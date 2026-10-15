const { loadConfig } = require('../../../src/shared/config');
const { ConfigurationError } = require('../../../src/shared/errors');

const VALID_ENV = {
  NODE_ENV: 'test',
  PORT: '4000',
  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_NAME: 'pasajes',
  DB_USER: 'pasajes',
  DB_PASSWORD: 'una_clave',
  DB_NAME_TEST: 'pasajes_test',
  LOG_LEVEL: 'debug',
};

describe('loadConfig', () => {
  it('devuelve la configuración validada y convierte los puertos a número', () => {
    const config = loadConfig(VALID_ENV);

    expect(config.PORT).toBe(4000);
    expect(config.DB_PORT).toBe(5432);
    expect(config.DB_NAME).toBe('pasajes');
    expect(config.LOG_LEVEL).toBe('debug');
  });

  it('aplica valores por defecto cuando no se especifican', () => {
    const config = loadConfig({
      DB_HOST: 'localhost',
      DB_NAME: 'pasajes',
      DB_USER: 'pasajes',
      DB_PASSWORD: 'una_clave',
      DB_NAME_TEST: 'pasajes_test',
    });

    expect(config.NODE_ENV).toBe('development');
    expect(config.PORT).toBe(3000);
    expect(config.DB_PORT).toBe(5432);
    expect(config.LOG_LEVEL).toBe('info');
  });

  it('lanza ConfigurationError indicando la variable faltante', () => {
    const incompleteEnv = { ...VALID_ENV };
    delete incompleteEnv.DB_PASSWORD;

    expect(() => loadConfig(incompleteEnv)).toThrow(ConfigurationError);
    expect(() => loadConfig(incompleteEnv)).toThrow(/DB_PASSWORD/);
  });

  it('lanza ConfigurationError indicando la variable con valor inválido', () => {
    expect(() => loadConfig({ ...VALID_ENV, LOG_LEVEL: 'ruidoso' })).toThrow(/LOG_LEVEL/);
  });
});
