/* SELEÇÃO: grade de quadrados só com o retrato + painel de informações.
   ESCOLHA SEU LUTADOR → ESCOLHA SEU OPONENTE → arena. */
VF.Game.register('select', {
  enter() {
    VF.Audio.playMusic('menu');
    this.phase = 0;
    this.locked = false;
    this.picks = [null, null];
    const s = VF.UI.screen('select-screen');
    this.s = s;
    s.innerHTML = `<div class="sel-head"><h1 class="title sel-title"></h1><div class="sel-sub"></div></div>
      <div class="sel-body"><div class="sel-grid-wrap"></div><div class="sel-panel-wrap"></div></div>
      <div class="sel-foot"><div class="slot slot-p1"></div><div class="vs">VS</div><div class="slot slot-p2"></div></div>`;
    const foot = s.querySelector('.sel-foot');
    foot.insertBefore(VF.UI.button('◀ VOLTAR', () => this.back(), 'back small'), foot.firstChild);
    VF.UI.button('🎲 ALEATÓRIO', () => this.pick(VF.M.choose(VF.CHARACTERS).id), 'small', foot);
    this.panel = VF.InfoPanel(s.querySelector('.sel-panel-wrap'));
    this.grid = VF.RosterGrid(s.querySelector('.sel-grid-wrap'), {
      onHover: (id) => this.panel.show(id),
      onPick: (id) => this.pick(id)
    });
    // botão de seleção no painel (ajuda no celular)
    const act = this.panel.actions();
    this.pickBtn = VF.UI.button('✔ SELECIONAR', () => { if (this.panel.def) this.pick(this.panel.def.id); }, 'primary small', act);
    this.panel.show(VF.Session.p1 || 'vini');
    this.grid.setHover(VF.Session.p1 || 'vini');
    this.updateHeader();
    VF.UI.enableNav(s, () => this.back(), false);
    if (!VF.Device.touch) setTimeout(() => { const it = this.grid.items.find((x) => x.def.id === (VF.Session.p1 || 'vini')); if (it) it.el.focus(); }, 40);
  },

  updateHeader() {
    const S = VF.Session;
    const t = this.s.querySelector('.sel-title');
    t.textContent = this.phase === 0 ? 'ESCOLHA SEU LUTADOR' : 'ESCOLHA SEU OPONENTE';
    t.classList.remove('pop');
    void t.offsetWidth;
    t.classList.add('pop');
    const who = this.phase === 0 ? (S.mode === 'demo' ? 'CPU 1' : 'PLAYER 1')
      : S.mode === 'pvp' ? 'PLAYER 2 (mesmo teclado)' : 'CPU • ' + VF.DIFFICULTY[S.difficulty].label;
    this.s.querySelector('.sel-sub').textContent = who + (VF.Device.touch ? ' — toque 1x para ver, 2x para escolher' : ' — passe o mouse para ver, clique para escolher');
    this.updateSlots();
  },

  updateSlots() {
    const S = VF.Session;
    const slot = (i) => {
      const id = this.picks[i];
      const lbl = i === 0 ? 'P1' : S.mode === 'pvp' ? 'P2' : 'CPU';
      if (!id) return `<span class="slot-tag">${lbl}</span><span class="slot-name">???</span>`;
      const d = VF.getCharacter(id);
      return `<span class="slot-tag">${lbl}</span><span class="slot-name" style="color:${d.color}">${d.short || d.name}</span>`;
    };
    this.s.querySelector('.slot-p1').innerHTML = slot(0);
    this.s.querySelector('.slot-p2').innerHTML = slot(1);
  },

  pick(id) {
    if (this.locked) return;
    this.locked = true;
    this.picks[this.phase] = id;
    VF.Audio.play('select');
    setTimeout(() => VF.Audio.play('ready'), 160);
    const it = this.grid.items.find((x) => x.def.id === id);
    it.el.classList.add(this.phase === 0 ? 'picked' : 'picked2');
    this.grid.mark(id, this.phase === 0 ? 'P1' : VF.Session.mode === 'pvp' ? 'P2' : 'CPU', 'marked');
    this.panel.show(id);
    this.s.classList.add('flash');
    setTimeout(() => this.s.classList.remove('flash'), 350);
    this.updateSlots();
    const phase = this.phase;
    setTimeout(() => {
      if (VF.Game.scene !== this || this.phase !== phase) return;
      if (phase === 0) {
        this.phase = 1;
        this.locked = false;
        this.updateHeader();
      } else {
        VF.Session.p1 = this.picks[0];
        VF.Session.p2 = this.picks[1];
        VF.Game.go('arena');
      }
    }, 900);
  },

  back() {
    if (this.phase === 1) {
      this.phase = 0;
      this.locked = false;
      this.picks = [null, null];
      this.grid.clearMarks();
      this.updateHeader();
    } else VF.Game.go('mode');
  },

  render(ctx, dt) {
    VF.drawMenuBG(ctx, dt, false);
    this.grid.render(VF.Game.t);
    this.panel.render(dt, VF.Game.t);
  }
});
