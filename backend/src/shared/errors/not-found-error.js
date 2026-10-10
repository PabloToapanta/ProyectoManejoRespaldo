const { DomainError } = require('./domain-error');

const NOT_FOUND_CODE = 'NOT_FOUND';
const NOT_FOUND_STATUS = 404;

/**
 * Error de dominio para recursos inexistentes (HTTP 404).
 */
class NotFoundError extends DomainError {
  constructor(message, code = NOT_FOUND_CODE) {
    super(message, { code, httpStatus: NOT_FOUND_STATUS });
  }
}

module.exports = { NotFoundError };
