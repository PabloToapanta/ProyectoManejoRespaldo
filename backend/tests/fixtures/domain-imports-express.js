// Fixture: simula un archivo de dominio que importa infraestructura.
// Queda excluido de `npm run lint` (ver ignores en eslint.config.js) y lo usa
// la prueba `tests/unit/lint/layer-rules.test.js` para verificar la regla de capas.
const express = require('express');

module.exports = express;
