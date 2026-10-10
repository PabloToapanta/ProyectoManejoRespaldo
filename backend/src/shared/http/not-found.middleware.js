const { NotFoundError } = require('../errors');

const RESOURCE_NOT_FOUND_MESSAGE = 'Recurso no encontrado';

/**
 * Convierte cualquier ruta no reconocida en un DomainError para que el
 * middleware de errores responda con el formato uniforme.
 */
function notFoundHandler(_req, _res, next) {
  next(new NotFoundError(RESOURCE_NOT_FOUND_MESSAGE));
}

module.exports = { notFoundHandler };
