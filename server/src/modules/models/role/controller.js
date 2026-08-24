const logger = require('../../../logger');
const {
  insert,
  update,
  getById,
  search,
  count,
  deleteById,
} = require('./service');

const BASE_URL = `/api/roles`;

const setupRoutes = (app) => {
  logger.info(`Setting up routes for ${BASE_URL}`);

  app.post(`${BASE_URL}/create`, async (req, res) => {
    logger.info('role create', req.body);
    const result = await insert(req.body);
    if (result instanceof Error) {
      res.status(400).json(JSON.parse(result.message));
      return;
    }
    return res.json({ status: 'success', data: result });
  });

  app.put(`${BASE_URL}/update`, async (req, res) => {
    const result = await update(req.body);
    if (result instanceof Error) {
      res.status(400).json(JSON.parse(result.message));
      return;
    }
    return res.json({ status: 'success', data: result });
  });

  app.get(`${BASE_URL}/detail/:id`, async (req, res) => {
    logger.info(`GET role detail`, req.params);
    const item = await getById(req.params.id);
    if (item instanceof Error) {
      return res.status(400).json(JSON.parse(item.message));
    }
    res.send(item);
  });

  app.post(`${BASE_URL}/search`, async (req, res) => {
    logger.info('POST role search', req.body);
    const result = await search(req.body);
    res.send(result);
  });

  app.post(`${BASE_URL}/count`, async (req, res) => {
    logger.info('POST role count', req.body);
    const result = await count(req.body);
    res.send({ count: result });
  });

  app.delete(`${BASE_URL}/delete/:id`, async (req, res) => {
    logger.info('DELETE role', req.params.id);
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
