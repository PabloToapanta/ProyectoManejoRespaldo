/**
 * Error de configuración del entorno. Se lanza al arrancar cuando falta o es
 * inválida una variable obligatoria, e impide el arranque del servidor.
 */
class ConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

module.exports = { ConfigurationError };
