const {
  DomainError,
  ValidationError,
  NotFoundError,
  ConflictError,
} = require('../../../src/shared/errors');

describe('DomainError y sus subclases', () => {
  it('usa código y estado por defecto', () => {
    const error = new DomainError('fallo de dominio');

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('DomainError');
    expect(error.code).toBe('DOMAIN_ERROR');
    expect(error.httpStatus).toBe(500);
  });

  it('ValidationError usa estado 400', () => {
    const error = new ValidationError('dato inválido');

    expect(error).toBeInstanceOf(DomainError);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.httpStatus).toBe(400);
  });

  it('NotFoundError usa estado 404', () => {
    const error = new NotFoundError('no existe');

    expect(error).toBeInstanceOf(DomainError);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.httpStatus).toBe(404);
  });

  it('ConflictError usa estado 409', () => {
    const error = new ConflictError('conflicto');

    expect(error).toBeInstanceOf(DomainError);
    expect(error.code).toBe('CONFLICT');
    expect(error.httpStatus).toBe(409);
  });
});
