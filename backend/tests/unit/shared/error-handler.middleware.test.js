const { errorHandler } = require('../../../src/shared/http/error-handler.middleware');
const { ValidationError } = require('../../../src/shared/errors');

function createResponseStub() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('errorHandler', () => {
  it('traduce un DomainError a su código y estado', () => {
    const logger = { error: jest.fn() };
    const res = createResponseStub();

    errorHandler(logger)(new ValidationError('La cédula es obligatoria'), {}, res, () => {});

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'La cédula es obligatoria' },
    });
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('responde 500 sin exponer detalles de un error inesperado', () => {
    const logger = { error: jest.fn() };
    const res = createResponseStub();

    errorHandler(logger)(new Error('secreto interno'), {}, res, () => {});

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
    });
    expect(JSON.stringify(res.body)).not.toContain('secreto interno');
    expect(logger.error).toHaveBeenCalled();
  });
});
