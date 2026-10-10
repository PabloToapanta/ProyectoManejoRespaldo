const js = require('@eslint/js');

const NODE_GLOBALS = {
  process: 'readonly',
  console: 'readonly',
  Buffer: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
};

const JEST_GLOBALS = {
  describe: 'readonly',
  it: 'readonly',
  test: 'readonly',
  expect: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
  jest: 'readonly',
};

const LAYER_MESSAGE =
  'El dominio no puede depender de infraestructura ni de otras capas (ver docs/architecture.md).';

module.exports = [
  {
    // Los fixtures se comprueban de forma programática en sus pruebas.
    ignores: ['node_modules/**', 'coverage/**', 'tests/fixtures/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'commonjs',
      globals: NODE_GLOBALS,
    },
    rules: {
      'no-console': 'error',
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: JEST_GLOBALS,
    },
  },
  {
    // Reglas de capas: el dominio no depende de nada de infraestructura.
    files: ['src/modules/*/domain/**/*.js'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'express', message: LAYER_MESSAGE },
            { name: 'pg', message: LAYER_MESSAGE },
          ],
          patterns: [
            {
              group: ['../application/**', '../infrastructure/**', '../interfaces/**'],
              message: LAYER_MESSAGE,
            },
          ],
        },
      ],
      // Equivalente para CommonJS (`require`), la sintaxis del backend.
      // `no-restricted-modules` está deprecada desde ESLint v7 y se elimina en v11:
      // al migrar, reemplazar por `n/no-restricted-require` de `eslint-plugin-n`.
      'no-restricted-modules': [
        'error',
        {
          paths: [
            { name: 'express', message: LAYER_MESSAGE },
            { name: 'pg', message: LAYER_MESSAGE },
          ],
          patterns: ['../application/*', '../infrastructure/*', '../interfaces/*'],
        },
      ],
    },
  },
];
