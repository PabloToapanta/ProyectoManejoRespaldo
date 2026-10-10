const { DomainError } = require('./domain-error');

const VALIDATION_ERROR_CODE = 'VALIDATION_ERROR';
const VALIDATION_ERROR_STATUS = 400;

/**
 * Error de dominio para entradas o datos inválidos (HTTP 400).
 */
class ValidationError extends DomainError {
  constructor(message, code = VALIDATION_ERROR_CODE) {
    super(message, { code, httpStatus: VALIDATION_ERROR_STATUS });
  }
}

module.exports = { ValidationError };
