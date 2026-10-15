const { Pool } = require('pg');

const CONNECTION_TIMEOUT_MS = 5000;

/**
 * Crea el pool de conexiones a PostgreSQL a partir de la configuración validada.
 */
function createPool(config) {
  return new Pool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
  });
}

module.exports = { createPool, CONNECTION_TIMEOUT_MS };
