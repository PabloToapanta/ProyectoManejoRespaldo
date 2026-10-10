const request = require('supertest');
const { createApp } = require('../../../src/app');

describe('GET /api/v1/health', () => {
  it('responde 200 con el estado del servicio', async () => {
    const app = createApp();

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', database: 'unknown' });
  });
});
