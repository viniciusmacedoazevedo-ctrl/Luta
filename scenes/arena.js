/* ESCOLHA A ARENA — prévias animadas de cada cenário */
VF.Game.register('arena', {
  enter() {
    const s = VF.UI.screen('arena-screen');
    s.innerHTML = `<h1 class="title">ESCOLHA A ARENA</h1><div class="vs-line"></div><div class="arena-grid"></div><div class="row-buttons"></div>`;
    const S = VF.Session;
    const d1 = VF.getCharacter(S.p1), d2 = VF.getCharacter(S.p2);
    s.querySelector('.vs-line').innerHTML = `<span style="color:${d1.color}">${d1.name}</span> <b>VS</b> <span style="color:${d2.color}">${d2.name}</span>`;
    const grid = s.querySelector('.arena-grid');
    this.items = [];
    this.focus = null;
    this.frame = 0;
    for (const a of VF.ARENAS) {
      const b = VF.UI.button(`<canvas width="320" height="180"></canvas>
        <div class="arena-name">${a.icon} ${a.name}</div><div class="arena-desc">${a.desc}</div>`,
        () => this.choose(a.id), 'arena-card', grid);
      b.addEventListener('pointerenter', () => { this.focus = a.id; });
      b.addEventListener('focus', () => { this.focus = a.id; });
      const bg = VF.Backgrounds[a.id];
      this.items.push({ a, el: b, cv: b.querySelector('canvas'), bg, st: bg.create() });
    }
    const row = s.querySelector('.row-buttons');
    VF.UI.button('◀ VOLTAR', () => VF.Game.go('select'), 'back', row);
    VF.UI.button('🎲 ALEATÓRIA', () => this.choose(VF.M.choose(VF.ARENAS).id), '', row);
    VF.UI.enableNav(s, () => VF.Game.go('select'));
  },

  choose(id) {
    VF.Session.arena = id;
    VF.Audio.play('confirm');
    VF.Game.go('fight');
  },

  render(ctx, dt) {
    VF.drawMenuBG(ctx, dt, false);
    this.frame++;
    this.items.forEach((it, i) => {
      // só a arena em foco anima em tempo real; as outras atualizam devagar (economia no celular)
      if (this.focus !== it.a.id && (this.frame + i) % 8 !== 0 && this.frame > 2) return;
      const g = it.cv.getContext('2d');
      g.save();
      g.scale(it.cv.width / 1280, it.cv.height / 720);
      it.bg.draw(g, VF.Game.t, it.st);
      if (it.bg.front) it.bg.front(g, VF.Game.t, it.st);
      g.restore();
    });
  }
});
