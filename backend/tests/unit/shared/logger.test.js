const { createLogger } = require('../../../src/shared/logger');

describe('createLogger', () => {
  it('crea un logger con los métodos esperados y el nivel indicado', () => {
    const logger = createLogger({ level: 'silent' });

    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(logger.level).toBe('silent');
  });

  it('usa el nivel info por defecto', () => {
    const logger = createLogger();

    expect(logger.level).toBe('info');
  });
});
