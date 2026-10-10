const DEFAULT_CODE = 'DOMAIN_ERROR';
const DEFAULT_HTTP_STATUS = 500;

/**
 * Clase base de los errores de dominio. Lleva un `code` estable para la API y
 * el `httpStatus` con el que el middleware de errores debe responder.
 */
class DomainError extends Error {
  constructor(message, { code = DEFAULT_CODE, httpStatus = DEFAULT_HTTP_STATUS } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

module.exports = { DomainError };
