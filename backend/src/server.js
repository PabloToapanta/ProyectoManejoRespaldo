const { createApp } = require('./app');
const { loadConfig } = require('./shared/config');
const { createLogger } = require('./shared/logger');
const { createPool, checkDatabase } = require('./shared/db');

const EXIT_FAILURE = 1;

let config;

try {
  config = loadConfig();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(EXIT_FAILURE);
}

const logger = createLogger({ level: config.LOG_LEVEL });
const pool = createPool(config);

const app = createApp({
  logger,
  checkDatabase: () => checkDatabase(pool),
});

app.listen(config.PORT, () => {
  logger.info(`Servidor escuchando en el puerto ${config.PORT}`);
});
