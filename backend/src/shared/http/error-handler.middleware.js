const { DomainError } = require('../errors');

const INTERNAL_ERROR_CODE = 'INTERNAL_ERROR';
const INTERNAL_ERROR_MESSAGE = 'Error interno del servidor';

/**
 * Traduce los errores a la respuesta HTTP uniforme. Los errores de dominio usan
 * su código y estado; los inesperados se registran y responden 500 sin exponer
 * detalles internos.
 */
function errorHandler(logger) {
  // Express exige 4 argumentos para reconocer un manejador de errores.
  return (error, _req, res, _next) => {
    if (error instanceof DomainError) {
      return res.status(error.httpStatus).json({
        error: { code: error.code, message: error.message },
      });
    }

    logger.error({ error }, INTERNAL_ERROR_MESSAGE);
    return res.status(500).json({
      error: { code: INTERNAL_ERROR_CODE, message: INTERNAL_ERROR_MESSAGE },
    });
  };
}

module.exports = { errorHandler };
