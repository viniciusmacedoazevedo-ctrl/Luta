/* Gera a versão Windows.
   - No Windows (ou com Wine instalado): instalador (Setup .exe) + versão portátil.
   - No Linux/macOS sem Wine (ex.: GitHub Codespaces): gera um .zip com o jogo
     pronto para Windows (basta extrair e abrir "VINI FIGHT.exe").
   Uso: npm run build:win   (forçar zip: npm run build:win -- --zip) */
const { execSync, spawnSync } = require('child_process');

const forceZip = process.argv.includes('--zip');
const hasWine = process.platform !== 'win32' &&
  spawnSync(process.platform === 'darwin' ? 'which' : 'sh', process.platform === 'darwin' ? ['wine'] : ['-c', 'command -v wine'], { stdio: 'ignore' }).status === 0;
const canInstaller = !forceZip && (process.platform === 'win32' || hasWine);

execSync('node tools/build-web.js', { stdio: 'inherit' });

const targets = canInstaller ? 'nsis portable' : "zip -c.win.artifactName='VINI-FIGHT-win-x64.${ext}'";
if (!canInstaller) {
  console.log('\nℹ️  Sem Windows/Wine: gerando VINI-FIGHT-win-x64.zip (o instalador .exe precisa do Windows ou do GitHub Actions).\n');
}
execSync(`npx electron-builder --win ${targets} --x64 --publish never`, { stdio: 'inherit' });

console.log('\n✔ Pronto! Arquivos em dist/:');
if (canInstaller) {
  console.log('   • VINI FIGHT Setup 1.0.0.exe   (instalador)');
  console.log('   • VINI-FIGHT-portable.exe      (roda sem instalar)');
} else {
  console.log('   • VINI-FIGHT-win-x64.zip       (extraia no Windows e abra "VINI FIGHT.exe")');
}
