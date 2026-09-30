/* Teste automatizado (Playwright + Chromium):
   1) fluxo completo pelo menu até a luta, usando o teclado;
   2) partida CPU x CPU acelerada até a tela de vitória (todas as regras de round);
   3) layout de celular (touch + paisagem): grade com toque duplo e 8 botões na tela.
   Uso: npm test   (screenshots em tools/test/screenshots) */
const path = require('path');
const fs = require('fs');

function loadPlaywright() {
  const tries = ['playwright', 'playwright-core', '/opt/node22/lib/node_modules/playwright'];
  for (const t of tries) {
    try { return require(t); } catch (e) { /* tenta o próximo */ }
  }
  console.error('Playwright não encontrado. Rode: npm install --save-dev playwright && npx playwright install chromium');
  process.exit(1);
}

const { chromium } = loadPlaywright();
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = process.env.SHOTS || path.join(__dirname, 'screenshots');
fs.mkdirSync(OUT, { recursive: true });
const URL = 'file://' + path.join(ROOT, 'index.html').replace(/\\/g, '/');

const errors = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function newPage(browser, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  // fontes externas não são necessárias no teste
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/ERR_FAILED|net::/.test(m.text())) errors.push('console: ' + m.text());
  });
  return page;
}

const scene = (p) => p.evaluate(() => VF.Game.sceneName);
async function waitScene(p, name, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < (ms || 10000)) {
    if ((await scene(p)) === name) { await sleep(350); return true; }
    await sleep(100);
  }
  throw new Error(`cena "${name}" não apareceu (atual: ${await scene(p)})`);
}
async function waitFight(p) {
  for (let i = 0; i < 150; i++) {
    if ((await p.evaluate(() => VF.Game.scene && VF.Game.scene.phase)) === 'fight') return;
    await sleep(100);
  }
  throw new Error('fase FIGHT! não começou');
}
const shot = (p, name) => p.screenshot({ path: path.join(OUT, name + '.png') });

async function testMenuFlow(browser) {
  const p = await newPage(browser, { viewport: { width: 1280, height: 720 } });
  await p.goto(URL);
  await waitScene(p, 'title');
  await shot(p, '01-title');
  await p.keyboard.press('Enter');
  await waitScene(p, 'menu');
  await sleep(900);
  await shot(p, '02-menu');

  // telas secundárias
  for (const [btn, sc] of [['CHARACTERS', 'characters'], ['SETTINGS', 'settings'], ['HOW TO PLAY', 'howto']]) {
    await p.click(`button:has-text("${btn}")`);
    await waitScene(p, sc);
    await sleep(700);
    await shot(p, '03-' + sc);
    await p.keyboard.press('Escape');
    await waitScene(p, 'menu');
  }

  await p.click('button:has-text("FIGHT")');
  await waitScene(p, 'mode');
  await shot(p, '04-mode');
  await p.click('button:has-text("CONTINUAR")');
  await waitScene(p, 'select');
  await sleep(500);
  await shot(p, '05-select');
  const nSq = await p.locator('.sq').count();
  if (nSq !== 25) throw new Error('grade deveria ter 25 quadrados, tem ' + nSq);
  // passar o mouse mostra o painel de informações
  await p.hover('.sq >> nth=5');
  await sleep(300);
  const hovName = await p.evaluate(() => document.querySelector('.ip-name').textContent);
  if (!hovName) throw new Error('painel de informações não apareceu no hover');
  await shot(p, '06-select-hover');
  await p.click('.sq >> nth=0');
  await sleep(1300);
  const t2 = await p.evaluate(() => document.querySelector('.sel-title, h1').textContent);
  if (!/OPONENTE/.test(t2)) throw new Error('não mudou para ESCOLHA SEU OPONENTE: ' + t2);
  await p.click('.sq >> nth=3');
  await waitScene(p, 'arena', 4000);
  await sleep(600);
  await shot(p, '07-arena');
  await p.click('.arena-card >> nth=0');
  await waitScene(p, 'fight');
  await waitFight(p);

  // golpes do jogador 1 pelo teclado
  const st = () => p.evaluate(() => { const f = VF.Game.scene.fighters[0]; return { state: f.state, x: Math.round(f.x), phase: VF.Game.scene.phase }; });
  // CPU parada durante o teste de controles
  await p.evaluate(() => { VF.Game.scene.fighters[1].control = false; });
  const before = await st();
  if (before.phase !== 'fight') throw new Error('luta não começou: ' + JSON.stringify(before));
  await p.keyboard.down('KeyD');
  await sleep(400);
  await p.keyboard.up('KeyD');
  const moved = await st();
  if (moved.x <= before.x) throw new Error('lutador não andou para a direita');
  const seen = new Set();
  for (const k of ['KeyJ', 'KeyK', 'KeyL', 'KeyW']) {
    await p.keyboard.press(k);
    for (let i = 0; i < 6; i++) { seen.add((await st()).state); await sleep(40); }
    await sleep(350);
  }
  if (!seen.has('attack')) throw new Error('ataque não executado: ' + [...seen]);
  if (!seen.has('jump')) throw new Error('pulo não executado: ' + [...seen]);
  // especial: enche a barra e aperta U
  await p.evaluate(() => { VF.Game.scene.fighters[0].special = 100; });
  for (let i = 0; i < 40 && (await st()).state !== 'idle'; i++) await sleep(50);
  await p.keyboard.press('KeyU');
  await sleep(250);
  const sp = await p.evaluate(() => VF.Game.scene.fighters[0].state);
  await shot(p, '08-fight-special');
  if (sp !== 'special') throw new Error('especial não ativou (estado ' + sp + ')');
  for (let i = 0; i < 80 && (await st()).state !== 'idle'; i++) await sleep(50);
  // ultimate: enche a barra e aperta I
  for (let i = 0; i < 80 && (await p.evaluate(() => VF.Game.scene.fighters[1].state)) !== 'idle'; i++) await sleep(50);
  // coloca o oponente perto (ultimates de avanço podem errar se ele estiver longe)
  const hp1 = await p.evaluate(() => { const sc = VF.Game.scene; sc.fighters[1].x = sc.fighters[0].x + 160 * sc.fighters[0].facing; sc.fighters[0].ultimate = VF.CONFIG.ULTIMATE_MAX; sc.fighters[1].hp = VF.CONFIG.MAX_HP; return sc.fighters[1].hp; });
  await p.keyboard.press('KeyI');
  await sleep(300);
  const ul = await p.evaluate(() => VF.Game.scene.fighters[0].state);
  await shot(p, '08b-fight-ultimate');
  if (ul !== 'ultimate') throw new Error('ultimate não ativou (estado ' + ul + ')');
  for (let i = 0; i < 160 && (await st()).state === 'ultimate'; i++) await sleep(50);
  const hp2 = await p.evaluate(() => VF.Game.scene.fighters[1].hp);
  if (hp2 >= hp1) throw new Error('ultimate não causou dano');
  await sleep(600);
  await shot(p, '09-fight');
  // pausa
  await p.keyboard.press('Escape');
  await sleep(200);
  if (!(await p.evaluate(() => VF.Game.scene.paused))) throw new Error('pausa não funcionou');
  await shot(p, '10-pause');
  await p.keyboard.press('Escape');
  await p.context().close();
  console.log('✔ fluxo de menus, grade 25 + hover, movimento, ataques, pulo, especial, ultimate e pausa');
}

async function testDemoMatch(browser, chars, arena) {
  const p = await newPage(browser, { viewport: { width: 1280, height: 720 } });
  await p.goto(`${URL}?demo=${chars},${arena}&diff=hard&speed=10`);
  await waitScene(p, 'fight');
  const t0 = Date.now();
  const info = { rounds: new Set(), specials: 0, maxCombo: 0 };
  let shotDone = false;
  while (Date.now() - t0 < 120000) {
    const s = await p.evaluate(() => {
      const sc = VF.Game.scene;
      if (VF.Game.sceneName !== 'fight') return { scene: VF.Game.sceneName };
      return {
        scene: 'fight', round: sc.match.round, phase: sc.phase,
        sp: sc.fighters.map((f) => f.stats.specials), combo: sc.fighters.map((f) => f.stats.maxCombo),
        hp: sc.fighters.map((f) => f.hp), time: sc.timeLeft
      };
    });
    if (s.scene === 'victory') break;
    if (s.scene === 'fight') {
      info.rounds.add(s.round);
      info.specials = Math.max(info.specials, s.sp[0] + s.sp[1]);
      info.maxCombo = Math.max(info.maxCombo, ...s.combo);
      if (!shotDone && s.phase === 'fight' && s.time < 45) { shotDone = true; await shot(p, `11-demo-${arena}`); }
    }
    await sleep(150);
  }
  if ((await scene(p)) !== 'victory') throw new Error('partida CPU x CPU não terminou');
  await p.evaluate(() => { VF.Game.speed = 1; VF.Game.scene.autoT = null; });
  const res = await p.evaluate(() => ({ title: document.querySelector('.vic-title').textContent, name: document.querySelector('.vic-name').textContent }));
  await sleep(900);
  await shot(p, `12-victory-${arena}`);
  await p.context().close();
  console.log(`✔ CPU x CPU (${chars} @ ${arena}): rounds ${[...info.rounds].join(',')} • especiais ${info.specials} • combo máx ${info.maxCombo} • ${res.title} ${res.name}`);
  return info;
}

async function testMobile(browser) {
  const p = await newPage(browser, { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await p.goto(URL);
  await waitScene(p, 'title');
  await p.tap('.title-screen');
  await waitScene(p, 'menu');
  await sleep(800);
  await shot(p, '20-mobile-menu');
  await p.tap('button:has-text("FIGHT")');
  await waitScene(p, 'mode');
  await p.tap('button:has-text("CONTINUAR")');
  await waitScene(p, 'select');
  await sleep(400);
  await shot(p, '21-mobile-select');
  // 1º toque só mostra as informações; 2º toque seleciona
  await p.tap('.sq >> nth=1');
  await sleep(400);
  const picked1 = await p.evaluate(() => VF.Game.scene.picks[0]);
  if (picked1) throw new Error('1º toque já selecionou (deveria só mostrar infos)');
  await shot(p, '21b-mobile-info');
  await p.tap('.sq >> nth=1');
  await sleep(1300);
  if (!(await p.evaluate(() => VF.Game.scene.picks[0]))) throw new Error('2º toque não selecionou');
  await p.tap('.sq >> nth=4');
  await sleep(300);
  await p.tap('.sq >> nth=4');
  await waitScene(p, 'arena', 4000);
  await shot(p, '22-mobile-arena');
  await p.tap('.arena-card >> nth=2');
  await waitScene(p, 'fight');
  await waitFight(p);
  const vis = await p.evaluate(() => document.getElementById('touch').classList.contains('show'));
  if (!vis) throw new Error('controles touch não apareceram no celular');
  const nBtn = await p.locator('.tc-btn').count();
  if (nBtn !== 8) throw new Error('esperava 8 botões touch, há ' + nBtn);
  // toca no botão SOCO e confere o ataque
  const box = await p.locator('.tc-punch').boundingBox();
  await p.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  let attacked = false;
  for (let i = 0; i < 10 && !attacked; i++) {
    attacked = (await p.evaluate(() => VF.Game.scene.fighters[0].state)) === 'attack';
    await sleep(30);
  }
  await shot(p, '23-mobile-fight');
  if (!attacked) throw new Error('botão SOCO (touch) não gerou ataque');
  // retrato → aviso para girar
  await p.setViewportSize({ width: 390, height: 844 });
  await sleep(300);
  const rot = await p.evaluate(() => getComputedStyle(document.getElementById('rotate')).display);
  await shot(p, '24-mobile-portrait');
  if (rot !== 'flex') throw new Error('aviso de girar o celular não apareceu');
  await p.context().close();
  console.log('✔ celular: touch detectado, joystick/botões visíveis, SOCO funcionando, aviso de retrato');
}

async function launch() {
  try {
    return await chromium.launch();
  } catch (e) {
    // navegador do Playwright não baixado: tenta um Chromium/Chrome já instalado
    const fsx = require('fs');
    const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      '/usr/bin/chromium', '/usr/bin/google-chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe'].filter(Boolean);
    for (const c of candidates) if (fsx.existsSync(c)) return chromium.launch({ executablePath: c });
    console.error('Chromium não encontrado. Rode: npx playwright install chromium');
    throw e;
  }
}

(async () => {
  const browser = await launch();
  let ok = true;
  try {
    await testMenuFlow(browser);
    await testMobile(browser);
    const combos = [['vini,arthur', 'rua'], ['julia_eduarda,lula', 'escola'], ['bolsonaro,xandao', 'campo'],
      ['einstein,lutu', 'igreja'], ['leidiane,wal', 'urbana'], ['muskito,docinho', 'futurista'], ['anny,giovana', 'praca']];
    for (const [c, a] of combos) await testDemoMatch(browser, c, a);
  } catch (e) {
    ok = false;
    console.error('✘ FALHA:', e.message);
  }
  await browser.close();
  if (errors.length) {
    ok = false;
    console.error('✘ Erros no console:\n  ' + [...new Set(errors)].join('\n  '));
  }
  console.log(ok ? '\nTODOS OS TESTES PASSARAM ✅' : '\nTESTES FALHARAM ❌');
  console.log('Screenshots em', OUT);
  process.exit(ok ? 0 : 1);
})();
