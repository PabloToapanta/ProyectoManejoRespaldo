const express = require('express');

const router = express.Router();

// Hasta integrar PostgreSQL (tarea 5) no se conoce el estado de la base.
const DATABASE_STATUS_UNKNOWN = 'unknown';

/**
 * Comprobación técnica de disponibilidad del servicio.
 */
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', database: DATABASE_STATUS_UNKNOWN });
});

module.exports = router;
