const Joi = require('joi');
const logger = require('../../../logger');
const {
  insert,
  update,
  getById,
  authenticate,
  search,
  count,
  deleteById,
} = require('./service');

const BASE_URL = `/api/users`;

const validateRegister = (payload) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    roleId: Joi.string().optional(),
    avatarUrl: Joi.string().optional(),
  });
  return schema.validate(payload);
};

const validateLogin = (payload) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(payload);
};

const setupRoutes = (app) => {
  logger.info(`Setting up routes for ${BASE_URL}`);

  app.post(`${BASE_URL}/register`, async (req, res) => {
    logger.info('POST register', req.body);
    const validationResult = validateRegister(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ status: 'error', message: validationResult.error.details[0].message });
    }
    const result = await insert(req.body);
    if (result instanceof Error) {
      return res.status(400).json(JSON.parse(result.message));
    }
    const { insertedId } = result;
    const user = await getById(insertedId);
    const { password: _, ...userWithoutPassword } = user;
    return res.json({ status: 'success', data: userWithoutPassword });
  });

  app.post(`${BASE_URL}/login`, async (req, res) => {
    logger.info('POST login', { email: req.body.email });
    const validationResult = validateLogin(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ status: 'error', message: validationResult.error.details[0].message });
    }
    const result = await authenticate(req.body);
    if (result instanceof Error) {
      return res.status(401).json(JSON.parse(result.message));
    }
    return res.json({ status: 'success', data: result });
  });

  app.put(`${BASE_URL}/update`, async (req, res) => {
    const result = await update(req.body);
    if (result instanceof Error) {
      return res.status(400).json(JSON.parse(result.message));
    }
    return res.json({ status: 'success', data: result });
  });

  app.get(`${BASE_URL}/detail/:id`, async (req, res) => {
    logger.info(`GET user detail`, req.params);
    const item = await getById(req.params.id);
    if (item instanceof Error) {
      return res.status(400).json(JSON.parse(item.message));
    }
    const { password: _, ...userWithoutPassword } = item || {};
    res.send(userWithoutPassword);
  });

  app.post(`${BASE_URL}/search`, async (req, res) => {
    logger.info('POST user search', req.body);
    const result = await search(req.body);
    res.send(result);
  });

  app.post(`${BASE_URL}/count`, async (req, res) => {
    logger.info('POST user count', req.body);
    const result = await count(req.body);
    res.send({ count: result });
  });

  app.delete(`${BASE_URL}/delete/:id`, async (req, res) => {
    logger.info('DELETE user', req.params.id);
    if (req.params.id) {
      const result = await deleteById(req.params.id);
      if (result instanceof Error) {
        return res.status(400).json(JSON.parse(result.message));
      }
      return res.json({ status: 'success', data: result });
    }
    return res.status(400).json({ status: 'error', message: 'Id required' });
  });
};

const setup = (app) => {
  setupRoutes(app);
};

module.exports = { setup };
