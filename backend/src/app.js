const express = require('express');
const healthRouter = require('./shared/http/health.routes');
const { notFoundHandler } = require('./shared/http/not-found.middleware');
const { errorHandler } = require('./shared/http/error-handler.middleware');
const { createLogger } = require('./shared/logger');

const API_PREFIX = '/api/v1';
const SILENT_LOG_LEVEL = 'silent';

/**
 * Compone la aplicación Express sin abrir el puerto.
 * Se separa de server.js para poder montarla en las pruebas.
 */
function createApp({ logger = createLogger({ level: SILENT_LOG_LEVEL }) } = {}) {
  const app = express();

  app.use(express.json());
  app.use(API_PREFIX, healthRouter);
  app.use(notFoundHandler);
  app.use(errorHandler(logger));

  return app;
}

module.exports = { createApp };
