const { DomainError } = require('./domain-error');

const CONFLICT_CODE = 'CONFLICT';
const CONFLICT_STATUS = 409;

/**
 * Error de dominio para conflictos con el estado actual (HTTP 409).
 */
class ConflictError extends DomainError {
  constructor(message, code = CONFLICT_CODE) {
    super(message, { code, httpStatus: CONFLICT_STATUS });
  }
}

module.exports = { ConflictError };
