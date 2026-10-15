const request = require('supertest');
const { createApp } = require('../../../src/app');

describe('manejo de errores HTTP', () => {
  it('responde 404 con el formato de error uniforme en rutas inexistentes', async () => {
    const app = createApp();

    const response = await request(app).get('/api/v1/no-existe');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: { code: 'NOT_FOUND', message: 'Recurso no encontrado' },
    });
  });
});
