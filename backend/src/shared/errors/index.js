const { DomainError } = require('./domain-error');
const { ValidationError } = require('./validation-error');
const { NotFoundError } = require('./not-found-error');
const { ConflictError } = require('./conflict-error');
const { ConfigurationError } = require('./configuration-error');

module.exports = {
  DomainError,
  ValidationError,
  NotFoundError,
  ConflictError,
  ConfigurationError,
};
