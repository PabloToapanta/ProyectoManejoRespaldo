const { z } = require('zod');
const { ConfigurationError } = require('../errors');

const ENVIRONMENTS = ['development', 'test', 'production'];
const LOG_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];
const DEFAULT_NODE_ENV = 'development';
const DEFAULT_PORT = 3000;
const DEFAULT_DB_PORT = 5432;
const DEFAULT_LOG_LEVEL = 'info';

const environmentSchema = z.object({
  NODE_ENV: z.enum(ENVIRONMENTS).default(DEFAULT_NODE_ENV),
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(DEFAULT_DB_PORT),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME_TEST: z.string().min(1),
  LOG_LEVEL: z.enum(LOG_LEVELS).default(DEFAULT_LOG_LEVEL),
});

function formatIssues(issues) {
  return issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
}

/**
 * Lee y valida las variables de entorno con Zod. Si falta o es inválida una
 * variable obligatoria, lanza ConfigurationError indicando cuál.
 */
function loadConfig(env = process.env) {
  const result = environmentSchema.safeParse(env);

  if (!result.success) {
    throw new ConfigurationError(
      `Configuración de entorno inválida: ${formatIssues(result.error.issues)}`,
    );
  }

  return result.data;
}

module.exports = { loadConfig, environmentSchema };
