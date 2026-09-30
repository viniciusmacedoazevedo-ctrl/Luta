/* Escolha do modo (1 jogador x CPU / 2 jogadores) e da dificuldade da IA */
VF.Game.register('mode', {
  enter() {
    const S = VF.Session;
    S.difficulty = VF.Settings.data.difficulty;
    if (VF.Device.touch) S.mode = 'cpu';
    else if (S.mode === 'demo') S.mode = 'cpu';
    const s = VF.UI.screen('mode-screen');
    s.innerHTML = `<h1 class="title">VERSUS</h1>
      <div class="mode-cards"></div>
      <div class="diff-box"><div class="label">DIFICULDADE DA IA</div><div class="chips"></div></div>
      <div class="row-buttons"></div>`;
    const cards = s.querySelector('.mode-cards');
    const mk = (mode, icon, title, sub, disabled) => {
      const b = VF.UI.button(`<div class="mode-icon">${icon}</div><div class="mode-title">${title}</div><div class="mode-sub">${sub}</div>`,
        () => { S.mode = mode; refresh(); }, 'mode-card', cards);
      b.dataset.mode = mode;
      if (disabled) { b.disabled = true; b.classList.add('disabled'); }
      return b;
    };
    mk('cpu', '🤖', 'PLAYER VS AI', 'Você contra a CPU');
    mk('pvp', '🎮', 'PLAYER VS PLAYER', VF.Device.touch ? 'Disponível no PC (mesmo teclado)' : 'Os dois no mesmo teclado', VF.Device.touch);
    const chips = s.querySelector('.chips');
    for (const k of Object.keys(VF.DIFFICULTY)) {
      const c = VF.UI.button(VF.DIFFICULTY[k].label, () => {
        S.difficulty = k;
        VF.Settings.data.difficulty = k;
        VF.Settings.save();
        refresh();
      }, 'chip', chips);
      c.dataset.diff = k;
    }
    const row = s.querySelector('.row-buttons');
    VF.UI.button('◀ VOLTAR', () => VF.Game.go('menu'), 'back', row);
    VF.UI.button('CONTINUAR ▶', () => { VF.Audio.play('confirm'); VF.Game.go('select'); }, 'primary', row);
    const refresh = () => {
      s.querySelectorAll('.mode-card').forEach((b) => b.classList.toggle('selected', b.dataset.mode === S.mode));
      s.querySelectorAll('.chip').forEach((b) => b.classList.toggle('selected', b.dataset.diff === S.difficulty));
      s.querySelector('.diff-box').classList.toggle('dim', S.mode === 'pvp');
    };
    refresh();
    VF.UI.enableNav(s, () => VF.Game.go('menu'));
  },
  render(ctx, dt) { VF.drawMenuBG(ctx, dt, false); }
});
