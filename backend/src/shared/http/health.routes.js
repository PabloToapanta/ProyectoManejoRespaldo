const express = require('express');

const HEALTH_STATUS_OK = 'ok';
const HEALTH_STATUS_ERROR = 'error';
const DATABASE_UP = 'up';
const DATABASE_DOWN = 'down';

/**
 * Rutas de salud. Recibe la comprobación de la base como dependencia para
 * poder simular su disponibilidad en las pruebas.
 */
function createHealthRouter({ checkDatabase }) {
  const router = express.Router();

  router.get('/health', async (_req, res) => {
    try {
      await checkDatabase();
      return res.status(200).json({ status: HEALTH_STATUS_OK, database: DATABASE_UP });
    } catch {
      return res.status(503).json({ status: HEALTH_STATUS_ERROR, database: DATABASE_DOWN });
    }
  });

  return router;
}

module.exports = { createHealthRouter };
