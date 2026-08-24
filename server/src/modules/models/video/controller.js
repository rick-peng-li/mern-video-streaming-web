const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const {
  insert,
  search,
  update,
  updateViewCount,
  deleteById,
  count,
} = require('./service');
const { validate } = require('./request');
const { VIDEO_QUEUE_EVENTS: QUEUE_EVENTS } = require('../../queues/constants');
const { VIDEO_STATUS } = require('../../db/constant');
const { addQueueItem } = require('../../queues/queue');
const {
  getVideoDurationAndResolution,
} = require('../../queues/video-processor');
const logger = require('../../../logger');

const BASE_URL = `/api/videos`;

const setupRoutes = (app) => {
  logger.info(`Setting up routes for ${BASE_URL}`);

  // return empty response with success message for the base route
  app.get(`${BASE_URL}/`, async (req, res) => {
    logger.info(`GET`, req.params);
    const data = await search({});
    res.send({
      status: 'success',
      message: 'OK',
      timestamp: new Date(),
      data,
    });
  });

  app.get(`${BASE_URL}/detail/:id`, async (req, res) => {
    logger.info(`GET`, req.params);
    const video = await updateViewCount(req.params.id);
    if (video instanceof Error) {
      return res.status(400).json(JSON.parse(video.message));
    }
    res.send(video);
  });

  // TODO: Proper searching with paging and ordering
  app.post(`${BASE_URL}/search`, async (req, res) => {
    logger.info('POST search', req.body);
    const result = await search(req.body);
    res.send(result);
  });

  app.post(`${BASE_URL}/count`, async (req, res) => {
    logger.info('POST count', req.body);
    const result = await count(req.body);
    res.send({ count: result });
  });

  // app.post(`${BASE_URL}/create`, async (req, res) => {
  //   console.log('POST create', req.body);
  //   const validationResult = validate(req.body);
  //   if (!validationResult.error) {
  //     const result = await insert(req.body);
  //     if (result instanceof Error) {
  //       res.status(400).json(JSON.parse(result.message));
  //       return;
  //     }
  //     return res.json(result);
  //   }
  //   return res
  //     .status(400)
  //     .json({ status: 'error', message: validationResult.error });
  // });

  app.put(`${BASE_URL}/update/:id`, async (req, res) => {
    const validationResult = validate(req.body);
    if (req.params.id && !validationResult.error) {
      const result = await update({
        _id: req.params.id,
        ...validationResult.value,
      });
      if (result instanceof Error) {
        return res.status(400).json(JSON.parse(result.message));
      }
      return res.json(result);
    }
    return res
      .status(400)
      .json({ status: 'error', message: validationResult.error });
  });

  app.delete(`${BASE_URL}/delete/:id`, async (req, res) => {
    logger.info('DELETE', req.params.id);
    if (req.params.id) {
      const result = await deleteById(req.params.id);
      if (result instanceof Error) {
        res.status(400).json(JSON.parse(result.message));
        return;
      }
      return res.json(result);
    }
    return res.status(400).json({ status: 'error', message: 'Id required' });
  });

  // upload videos handler using multer package routes below.

  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/videos');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').pop() || 'mp4';
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/webm') {
      logger.info('file type supported', file);
      cb(null, true);
    } else {
      logger.info('file type not supported', file);
      cb(new multer.MulterError('File type not supported'), false);
    }
  };

  const useS3 = Boolean(
    process.env.BUCKET_NAME &&
    process.env.ENDPOINT &&
    process.env.ACCESS_KEY &&
    process.env.ACCESS_TOKEN
  );

  let activeStorage;
  if (useS3) {
    const s3Client = new S3Client({
      endpoint: process.env.ENDPOINT,
      forcePathStyle: false,
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.ACCESS_TOKEN,
      },
    });
    activeStorage = multerS3({
      s3: s3Client,
      bucket: process.env.BUCKET_NAME,
      acl: 'private',
    });
    logger.info('Using S3 storage for video uploads', { bucket: process.env.BUCKET_NAME });
  } else {
    activeStorage = diskStorage;
    logger.info('S3 not configured, using local disk storage for video uploads (uploads/videos/)');
  }

  const upload = multer({
    fileFilter: fileFilter,
    limits: { fileSize: 50000000 },
    storage: activeStorage,
  }).single('video');

  const uploadProcessor = (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        //console.error(err);
        res.status(400).json({ status: 'error', error: err });
        return;
      } else {
        logger.info('upload success', req.file);
        // res.status(200).json({ status: "success", message: "upload success" });
        next();
      }
    });
  };

  app.post(`${BASE_URL}/upload`, uploadProcessor, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'Video file is required' });
      }
      const serverUrl = process.env.SERVER_URL || 'http://localhost:4000';
      const videoServer = process.env.VIDEO_SERVER || serverUrl.replace(/:\d+$/, ':4001');
      const videoFileName = req.file.filename
        || (req.file.key && useS3 ? req.file.key.split('/').pop() : null)
        || req.file.originalname;
      const videoLink = useS3
        ? req.file.location
        : `${videoServer}/${videoFileName.replace(/\.[^.]+$/, '.m3u8')}`;

      const dbPayload = {
        ...req.body,
        fileName: videoFileName,
        originalName: req.file.originalname,
        recordingDate: new Date(),
        videoLink,
        viewCount: 0,
        duration: 0,
        status: VIDEO_STATUS.PENDING,
        processedPath: req.file.path,
      };
      logger.info('dbPayload', { dbPayload });
      const result = await insert(dbPayload);
      logger.info('result', result);
      await addQueueItem(QUEUE_EVENTS.VIDEO_UPLOADED, {
        id: result.insertedId.toString(),
        filePath: req.file.path,
        fileName: videoFileName,
        ...req.body,
      });
      res.status(200).json({
        status: 'success',
        message: 'Upload success, processing video...',
        ...result,
      });
      return;
    } catch (error) {
      logger.error(error);
      res.send(error);
    }
  });
};

const setup = (app) => {
  setupRoutes(app);
};

module.exports = { setup };
