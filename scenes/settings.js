/* CONFIGURAÇÕES: áudio, jogo, controles touch e remapeamento de teclas */
VF.Game.register('settings', {
  enter() {
    const s = VF.UI.screen('settings-screen');
    this.s = s;
    s.innerHTML = `<h1 class="title">CONFIGURAÇÕES</h1><div class="panel settings-panel"></div><div class="row-buttons"></div>`;
    const row = s.querySelector('.row-buttons');
    VF.UI.button('◀ VOLTAR', () => VF.Game.go('menu'), 'back', row);
    VF.UI.button('↺ RESTAURAR PADRÕES', () => {
      VF.Settings.reset();
      VF.Audio.applyVolumes();
      VF.Device.apply();
      this.build();
    }, 'danger', row);
    this.build();
    VF.UI.enableNav(s, () => VF.Game.go('menu'));
  },

  build() {
    const set = VF.Settings.data;
    const p = this.s.querySelector('.settings-panel');
    const chipRow = (key, opts) => `<div class="chips">${opts.map(([v, l]) =>
      `<button type="button" class="btn chip ${set[key] === v ? 'selected' : ''}" data-nav data-key="${key}" data-val="${v}">${l}</button>`).join('')}</div>`;
    const actions = VF.ACTIONS;
    p.innerHTML = `
      <h2>🔊 ÁUDIO</h2>
      <div class="set-row"><label>Música</label><input type="range" min="0" max="1" step="0.05" data-nav data-vol="musicVol" value="${set.musicVol}"></div>
      <div class="set-row"><label>Efeitos sonoros</label><input type="range" min="0" max="1" step="0.05" data-nav data-vol="sfxVol" value="${set.sfxVol}"></div>
      <div class="set-row"><label>Voz do locutor</label>${chipRow('announcer', [[true, 'LIGADA'], [false, 'DESLIGADA']])}</div>
      <h2>🎮 JOGO</h2>
      <div class="set-row"><label>Dificuldade da CPU</label>${chipRow('difficulty', Object.keys(VF.DIFFICULTY).map((k) => [k, VF.DIFFICULTY[k].label]))}</div>
      <div class="set-row"><label>Tremor de tela</label>${chipRow('shake', [[true, 'LIGADO'], [false, 'DESLIGADO']])}</div>
      <div class="set-row"><label>Mostrar FPS</label>${chipRow('showFps', [[true, 'SIM'], [false, 'NÃO']])}</div>
      <div class="set-row"><label>Controles touch</label>${chipRow('touch', [['auto', 'AUTOMÁTICO'], ['on', 'SEMPRE'], ['off', 'NUNCA']])}</div>
      <h2>⌨️ TECLADO <small>(clique e pressione a nova tecla • Esc cancela)</small></h2>
      <table class="keys">
        <tr><th>Ação</th><th>Jogador 1</th><th>Jogador 2</th></tr>
        ${actions.map((a) => `<tr><td>${VF.ACTION_LABELS[a]}</td>
          <td><button type="button" class="btn key" data-nav data-p="p1" data-a="${a}">${VF.keyLabel(set.bindings.p1[a][0])}</button></td>
          <td><button type="button" class="btn key" data-nav data-p="p2" data-a="${a}">${VF.keyLabel(set.bindings.p2[a][0])}</button></td></tr>`).join('')}
      </table>
      <p class="hint">No modo 1 jogador, as teclas do Jogador 2 (setas + 1/2/3/4) também controlam o seu lutador.</p>`;

    p.querySelectorAll('.chip').forEach((b) => b.addEventListener('click', () => {
      const key = b.dataset.key;
      let v = b.dataset.val;
      if (v === 'true') v = true;
      else if (v === 'false') v = false;
      set[key] = v;
      VF.Settings.save();
      VF.Audio.play('click');
      if (key === 'touch') VF.Device.apply();
      p.querySelectorAll(`.chip[data-key="${key}"]`).forEach((c) => c.classList.toggle('selected', c === b));
    }));
    p.querySelectorAll('input[type=range]').forEach((r) => r.addEventListener('input', () => {
      set[r.dataset.vol] = parseFloat(r.value);
      VF.Settings.save();
      VF.Audio.applyVolumes();
    }));
    p.querySelectorAll('input[type=range]').forEach((r) => r.addEventListener('change', () => {
      if (r.dataset.vol === 'sfxVol') VF.Audio.play('punch');
    }));
    p.querySelectorAll('.key').forEach((b) => b.addEventListener('click', () => {
      VF.Audio.play('click');
      b.textContent = '...';
      b.classList.add('waiting');
      VF.Keyboard.captureNext((code) => {
        b.classList.remove('waiting');
        if (code !== 'Escape') {
          const pl = b.dataset.p, act = b.dataset.a;
          // remove a tecla de qualquer outra ação para evitar conflito
          for (const pp of ['p1', 'p2']) {
            for (const aa of VF.ACTIONS) {
              set.bindings[pp][aa] = set.bindings[pp][aa].filter((c) => c !== code);
            }
          }
          set.bindings[pl][act] = [code];
          VF.Settings.save();
          VF.Audio.play('confirm');
        }
        this.build();
      });
    }));
  },

  render(ctx, dt) { VF.drawMenuBG(ctx, dt, false); }
});
