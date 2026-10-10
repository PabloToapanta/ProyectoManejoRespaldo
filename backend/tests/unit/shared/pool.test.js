const { createPool, CONNECTION_TIMEOUT_MS } = require('../../../src/shared/db/pool');

describe('createPool', () => {
  it('crea un pool con los datos de conexión de la configuración', async () => {
    const pool = createPool({
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_NAME: 'pasajes',
      DB_USER: 'pasajes',
      DB_PASSWORD: 'clave',
    });

    expect(pool.options.host).toBe('localhost');
    expect(pool.options.port).toBe(5432);
    expect(pool.options.database).toBe('pasajes');
    expect(pool.options.user).toBe('pasajes');
    expect(pool.options.password).toBe('clave');
    expect(pool.options.connectionTimeoutMillis).toBe(CONNECTION_TIMEOUT_MS);

    await pool.end();
  });
});
