/* Copia os arquivos do jogo para a pasta www/ (usada pelo Electron e pelo Capacitor/Android). */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'www');
const INCLUDE = ['index.html', 'manifest.webmanifest', 'sw.js', 'src', 'assets', 'ui', 'scenes', 'scripts', 'config'];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const item of INCLUDE) {
  const from = path.join(ROOT, item);
  if (!fs.existsSync(from)) continue;
  fs.cpSync(from, path.join(OUT, item), { recursive: true });
}
// GitHub Pages: sem isso o Jekyll ignora pastas que começam com "_" (ex.: assets/characters/_shared)
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log('✔ Jogo copiado para', OUT);
