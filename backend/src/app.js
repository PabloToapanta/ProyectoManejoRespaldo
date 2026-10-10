const express = require('express');
const healthRouter = require('./shared/http/health.routes');

const API_PREFIX = '/api/v1';

/**
 * Compone la aplicación Express sin abrir el puerto.
 * Se separa de server.js para poder montarla en las pruebas.
 */
function createApp() {
  const app = express();

  app.use(express.json());
  app.use(API_PREFIX, healthRouter);

  return app;
}

module.exports = { createApp };
