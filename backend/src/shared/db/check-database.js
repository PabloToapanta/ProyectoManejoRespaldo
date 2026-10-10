const HEALTH_CHECK_QUERY = 'SELECT 1';

/**
 * Comprueba que el pool puede consultar la base. Resuelve si la base responde
 * y lanza el error del driver si no lo hace.
 */
async function checkDatabase(pool) {
  await pool.query(HEALTH_CHECK_QUERY);
}

module.exports = { checkDatabase };
