const request = require('supertest');
const { createApp } = require('../../../src/app');

describe('GET /api/v1/health', () => {
  it('responde 200 con database up cuando la base responde', async () => {
    const checkDatabase = jest.fn().mockResolvedValue(undefined);
    const app = createApp({ checkDatabase });

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', database: 'up' });
    expect(checkDatabase).toHaveBeenCalled();
  });

  it('responde 503 con database down cuando la base no responde', async () => {
    const checkDatabase = jest.fn().mockRejectedValue(new Error('sin conexión'));
    const app = createApp({ checkDatabase });

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ status: 'error', database: 'down' });
  });
});
