const { checkDatabase } = require('../../../src/shared/db');

describe('checkDatabase', () => {
  it('consulta la base a través del pool', async () => {
    const pool = { query: jest.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }) };

    await checkDatabase(pool);

    expect(pool.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('propaga el error cuando la base no responde', async () => {
    const pool = { query: jest.fn().mockRejectedValue(new Error('sin conexión')) };

    await expect(checkDatabase(pool)).rejects.toThrow('sin conexión');
  });
});
