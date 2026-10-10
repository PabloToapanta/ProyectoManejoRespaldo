// Copia los archivos de Bootstrap instalados por npm a public/.
// Se usa Node en lugar de comandos de shell para que funcione igual en Linux, macOS y Windows.
const { copyFileSync, mkdirSync } = require('node:fs');
const { dirname, join } = require('node:path');

const PROJECT_ROOT = join(__dirname, '..');
const BOOTSTRAP_DIST = join(PROJECT_ROOT, 'node_modules', 'bootstrap', 'dist');

const FILES_TO_COPY = [
  [join(BOOTSTRAP_DIST, 'css', 'bootstrap.min.css'), join(PROJECT_ROOT, 'public', 'css', 'bootstrap.min.css')],
  [
    join(BOOTSTRAP_DIST, 'js', 'bootstrap.bundle.min.js'),
    join(PROJECT_ROOT, 'public', 'js', 'bootstrap.bundle.min.js'),
  ],
];

for (const [source, destination] of FILES_TO_COPY) {
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
}

process.stdout.write('Bootstrap copiado a public/.\n');
