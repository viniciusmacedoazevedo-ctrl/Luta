/* PERSONAGENS: galeria com animação dos golpes e ficha de cada lutador */
VF.Game.register('characters', {
  enter() {
    const s = VF.UI.screen('chars-screen');
    s.innerHTML = `<div class="chars-list"></div><div class="chars-info panel"></div>
      <div class="chars-move"></div>`;
    const list = s.querySelector('.chars-list');
    VF.UI.button('◀ VOLTAR', () => VF.Game.go('menu'), 'back small', list);
    for (const d of VF.CHARACTERS) {
      const b = VF.UI.button(`${d.special.icon} ${d.name}`, () => this.show(d.id), 'char-tab', list);
      b.dataset.id = d.id;
      b.style.setProperty('--c', d.color);
    }
    this.s = s;
    this.show(VF.CHARACTERS[0].id);
    VF.UI.enableNav(s, () => VF.Game.go('menu'), false);
    const first = list.querySelector('.char-tab');
    if (!VF.Device.touch && first) setTimeout(() => first.focus(), 30);
  },

  show(id) {
    const d = VF.getCharacter(id);
    this.def = d;
    this.puppet = new VF.Puppet(id);
    this.puppet.setLoop(['idle', 'walk', 'run', 'punch', 'kick', 'heavy', 'jump', 'air', 'block', 'hurt', 'special', 'victory', 'defeat']);
    this.s.querySelectorAll('.char-tab').forEach((b) => b.classList.toggle('selected', b.dataset.id === id));
    const mv = d.moveNames;
    this.s.querySelector('.chars-info').innerHTML = `
      <div class="ci-name" style="color:${d.color}">${d.fullName || d.name}</div>
      <div class="ci-title">${d.title} — ${d.style}</div>
      ${d.parody ? '<div class="ci-parody">⚠️ Caricatura/paródia fictícia de videogame. Os poderes são apenas humor e não representam fatos reais.</div>' : ''}
      <div class="ci-stats">
        <div class="st"><span>FORÇA</span>${VF.UI.bar(d.stats.power, 10, '#ff5252')}</div>
        <div class="st"><span>VELOCIDADE</span>${VF.UI.bar(d.stats.speed, 10, '#ffd600')}</div>
        <div class="st"><span>DEFESA</span>${VF.UI.bar(d.stats.defense, 10, '#29b6f6')}</div>
      </div>
      <div class="ci-special"><span class="sp-icon big">${d.special.icon}</span><div><b>${d.special.name}</b><p>${d.special.desc}</p></div></div>
      <div class="ci-moves"><b>GOLPES:</b> ${mv.punch} • ${mv.kick} • ${mv.heavy} • ${mv.air} • Defesa • Pulo • Dash • ${d.special.name}</div>
      <p class="ci-desc">${d.desc}</p>`;
  },

  update(dt) { if (this.puppet) this.puppet.update(dt); },

  render(ctx, dt) {
    VF.drawMenuBG(ctx, dt, false);
    VF.BG.glow(ctx, 380, 470, 280, this.def.color, 0.3);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(380, 668, 120, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    this.puppet.draw(ctx, 380, 665, 1.95, 1);
    ctx.font = "34px 'Bangers', Impact, sans-serif";
    ctx.textAlign = 'center';
    ctx.lineWidth = 7;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#120a1c';
    ctx.fillStyle = '#ffd600';
    const label = this.puppet.moveName || '';
    ctx.strokeText(label, 380, 150);
    ctx.fillText(label, 380, 150);
  }
});
