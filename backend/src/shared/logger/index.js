const pino = require('pino');

const DEFAULT_LEVEL = 'info';

/**
 * Crea un logger estructurado con pino.
 */
function createLogger({ level = DEFAULT_LEVEL, ...options } = {}) {
  return pino({ level, ...options });
}

module.exports = { createLogger };
