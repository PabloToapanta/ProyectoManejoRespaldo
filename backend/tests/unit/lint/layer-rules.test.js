const fs = require('fs');
const path = require('path');
const { ESLint } = require('eslint');

const BACKEND_ROOT = path.resolve(__dirname, '..', '..', '..');
const FIXTURE_PATH = path.join(BACKEND_ROOT, 'tests', 'fixtures', 'domain-imports-express.js');
// Ruta simulada dentro de la capa de dominio: hace que aplique la regla de capas.
const DOMAIN_FILE_PATH = path.join(BACKEND_ROOT, 'src', 'modules', 'demo', 'domain', 'demo.js');
// Se reutiliza la configuración real. Se pasa directamente para que ESLint no
// la cargue con import() dinámico, que el entorno de Jest no soporta.
const ESLINT_CONFIG = require(path.join(BACKEND_ROOT, 'eslint.config.js'));

function createEslint() {
  return new ESLint({
    cwd: BACKEND_ROOT,
    overrideConfigFile: true,
    overrideConfig: ESLINT_CONFIG,
  });
}

describe('reglas de capas de ESLint', () => {
  it('rechaza que un archivo de dominio importe express', async () => {
    const source = fs.readFileSync(FIXTURE_PATH, 'utf8');
    const eslint = createEslint();

    const [result] = await eslint.lintText(source, { filePath: DOMAIN_FILE_PATH });

    expect(result.errorCount).toBeGreaterThan(0);
    expect(result.messages.map((message) => message.ruleId)).toContain('no-restricted-modules');
  });

  it('acepta un archivo de dominio sin dependencias de infraestructura', async () => {
    const eslint = createEslint();

    const [result] = await eslint.lintText("const VALUE = 'ok';\n\nmodule.exports = VALUE;\n", {
      filePath: DOMAIN_FILE_PATH,
    });

    expect(result.errorCount).toBe(0);
  });
});
