/* ESCOLHA SEU LUTADOR → ESCOLHA SEU OPONENTE */
VF.Game.register('select', {
  enter() {
    VF.Audio.playMusic('menu');
    this.phase = 0;
    this.locked = false;
    this.picks = [null, null];
    this.hover = null;
    const s = VF.UI.screen('select-screen');
    this.s = s;
    s.innerHTML = `<div class="sel-head"><h1 class="title sel-title"></h1><div class="sel-sub"></div></div>
      <div class="cards"></div>
      <div class="sel-foot"><div class="slot slot-p1"></div><div class="vs">VS</div><div class="slot slot-p2"></div></div>`;
    const foot = s.querySelector('.sel-foot');
    const back = VF.UI.button('◀ VOLTAR', () => this.back(), 'back small', null);
    foot.insertBefore(back, foot.firstChild);
    const cards = s.querySelector('.cards');
    this.cards = [];
    for (const def of VF.CHARACTERS) {
      const b = VF.UI.button(`
        <canvas class="card-cv" width="240" height="300"></canvas>
        <div class="card-body">
          <div class="card-name">${def.name}</div>
          <div class="card-stats">
            <div class="st"><span>FORÇA</span>${VF.UI.bar(def.stats.power, 10, '#ff5252')}</div>
            <div class="st"><span>VELOC.</span>${VF.UI.bar(def.stats.speed, 10, '#ffd600')}</div>
            <div class="st"><span>DEFESA</span>${VF.UI.bar(def.stats.defense, 10, '#29b6f6')}</div>
          </div>
          <div class="card-desc">${def.desc}</div>
          <div class="card-special"><span class="sp-icon">${def.special.icon}</span><span>${def.special.name}</span></div>
        </div>
        ${def.parody ? '<div class="parody-tag">PARÓDIA</div>' : ''}
        <div class="ready">READY!</div><div class="pick-tag"></div>`, () => this.pick(def.id), 'card', cards);
      b.style.setProperty('--c', def.color);
      b.addEventListener('pointerenter', () => { this.hover = def.id; });
      b.addEventListener('focus', () => { this.hover = def.id; });
      this.cards.push({ def, el: b, cv: b.querySelector('canvas'), puppet: new VF.Puppet(def.id) });
    }
    this.updateHeader();
    VF.UI.enableNav(s, () => this.back());
  },

  updateHeader() {
    const S = VF.Session;
    const t = this.s.querySelector('.sel-title');
    t.textContent = this.phase === 0 ? 'ESCOLHA SEU LUTADOR' : 'ESCOLHA SEU OPONENTE';
    t.classList.remove('pop');
    void t.offsetWidth;
    t.classList.add('pop');
    const who = this.phase === 0 ? (S.mode === 'demo' ? 'CPU 1' : 'JOGADOR 1') : S.mode === 'pvp' ? 'JOGADOR 2 (mesmo teclado)' : 'CPU • ' + VF.DIFFICULTY[S.difficulty].label;
    this.s.querySelector('.sel-sub').textContent = who;
    this.updateSlots();
  },

  updateSlots() {
    const S = VF.Session;
    const slot = (i) => {
      const id = this.picks[i];
      const lbl = i === 0 ? 'P1' : S.mode === 'pvp' ? 'P2' : 'CPU';
      if (!id) return `<span class="slot-tag">${lbl}</span><span class="slot-name">???</span>`;
      const d = VF.getCharacter(id);
      return `<span class="slot-tag">${lbl}</span><span class="slot-name" style="color:${d.color}">${d.name}</span>`;
    };
    this.s.querySelector('.slot-p1').innerHTML = slot(0);
    this.s.querySelector('.slot-p2').innerHTML = slot(1);
  },

  pick(id) {
    if (this.locked) return;
    const card = this.cards.find((c) => c.def.id === id);
    this.locked = true;
    this.picks[this.phase] = id;
    VF.Audio.play('select');
    setTimeout(() => VF.Audio.play('ready'), 160);
    card.el.classList.add('picked');
    card.el.querySelector('.pick-tag').textContent = this.phase === 0 ? 'P1' : VF.Session.mode === 'pvp' ? 'P2' : 'CPU';
    const skin = VF.Skins[id];
    card.puppet.colors = this.phase === 1 && id === this.picks[0] ? Object.assign({}, skin.colors, skin.alt) : skin.colors;
    card.puppet.play('victory');
    this.updateSlots();
    const phase = this.phase;
    setTimeout(() => {
      if (VF.Game.scene !== this || this.phase !== phase) return;
      if (phase === 0) {
        this.phase = 1;
        this.locked = false;
        card.el.classList.remove('picked');
        card.el.classList.add('chosen');
        card.puppet.play('idle');
        this.updateHeader();
      } else {
        VF.Session.p1 = this.picks[0];
        VF.Session.p2 = this.picks[1];
        VF.Game.go('arena');
      }
    }, 1050);
  },

  back() {
    if (this.phase === 1) {
      this.phase = 0;
      this.locked = false;
      this.picks = [null, null];
      for (const c of this.cards) {
        c.el.classList.remove('picked', 'chosen');
        c.el.querySelector('.pick-tag').textContent = '';
        c.puppet.colors = c.puppet.skin.colors;
        c.puppet.play('idle');
      }
      this.updateHeader();
    } else {
      VF.Game.go('mode');
    }
  },

  render(ctx, dt) {
    VF.drawMenuBG(ctx, dt, false);
    for (const c of this.cards) {
      const p = c.puppet;
      p.update(this.hover === c.def.id && p.state === 'idle' ? dt * 1.8 : dt);
      const cv = c.cv, g = cv.getContext('2d');
      g.clearRect(0, 0, cv.width, cv.height);
      const rg = g.createRadialGradient(cv.width / 2, cv.height * 0.45, 10, cv.width / 2, cv.height * 0.45, cv.width * 0.7);
      rg.addColorStop(0, VF.M.hexA(c.def.color, 0.55));
      rg.addColorStop(1, 'rgba(10,5,20,0)');
      g.fillStyle = rg;
      g.fillRect(0, 0, cv.width, cv.height);
      p.draw(g, cv.width / 2 - 8, cv.height + 105, 1.42, 1);
    }
  }
});
