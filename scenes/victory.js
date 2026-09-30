/* TELA DE VITÓRIA: vencedor comemorando + estatísticas */
VF.Game.register('victory', {
  enter(p) {
    this.data = p;
    const def = VF.getCharacter(p.winner.id);
    this.def = def;
    this.puppet = new VF.Puppet(p.winner.id, p.winner.colors);
    this.puppet.play('victory');
    this.bgDef = VF.Backgrounds[p.arena] || VF.Backgrounds.rua;
    this.bg = this.bgDef.create();
    this.ps = new VF.ParticleSystem(400);
    this.confettiT = 0;
    this.t = 0;
    VF.FX.confetti(this.ps, 1280, 120);
    VF.Audio.playMusic('victory');
    VF.Audio.announce(def.name + ' wins!');

    const st = p.winner.stats;
    const S = VF.Session;
    const who = S.mode === 'pvp' ? (p.winner.label === 'P1' ? 'JOGADOR 1 VENCEU!' : 'JOGADOR 2 VENCEU!')
      : p.winner.cpu ? (S.mode === 'demo' ? 'CPU VENCEU' : 'A CPU VENCEU... TENTE DE NOVO!') : 'VOCÊ VENCEU!';
    const s = VF.UI.screen('victory-screen');
    s.innerHTML = `<div class="victory-panel panel">
        <h1 class="vic-title">VITÓRIA!</h1>
        <div class="vic-name" style="color:${def.color}">${def.fullName || def.name}</div>
        <div class="vic-who">${who}</div>
        <div class="vic-stats">
          <div><span>Rounds vencidos</span><b>${st.roundsWon}</b></div>
          <div><span>Combo máximo</span><b>${st.maxCombo}</b></div>
          <div><span>Dano causado</span><b>${st.damage}</b></div>
          <div><span>Golpes acertados</span><b>${st.hits}</b></div>
          <div><span>Especiais usados</span><b>${st.specials}</b></div>
          <div><span>Placar final</span><b>${p.wins[0]} x ${p.wins[1]}</b></div>
        </div>
        <div class="vic-buttons"></div>
      </div>`;
    const box = s.querySelector('.vic-buttons');
    VF.UI.button('🔄 JOGAR NOVAMENTE', () => VF.Game.go('fight'), 'primary', box);
    VF.UI.button('👥 ESCOLHER PERSONAGEM', () => VF.Game.go('select'), '', box);
    VF.UI.button('🏠 MENU', () => VF.Game.go('menu'), '', box);
    VF.UI.enableNav(s, () => VF.Game.go('menu'));
    if (S.mode === 'demo') this.autoT = 6;
  },

  update(dt) {
    this.t += dt;
    this.puppet.update(dt);
    this.ps.update(dt);
    this.confettiT += dt;
    if (this.confettiT > 1.2) {
      this.confettiT = 0;
      VF.FX.confetti(this.ps, 1280, 30);
    }
    if (this.autoT != null) {
      this.autoT -= dt;
      if (this.autoT <= 0) { this.autoT = null; VF.Game.go('fight'); }
    }
  },

  render(ctx) {
    this.bgDef.draw(ctx, this.t, this.bg);
    ctx.fillStyle = 'rgba(8,3,18,0.55)';
    ctx.fillRect(0, 0, 1280, 720);
    // holofote no vencedor
    VF.BG.cone(ctx, 330, -40, 0, 800, 0.28, '#fff5c0', 0.25);
    VF.BG.glow(ctx, 330, 560, 260, this.def.color, 0.35);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(330, 668, 120, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    this.puppet.draw(ctx, 330, 665, 1.9, 1);
    // raios de energia
    if (Math.random() < 0.5) VF.FX.energy(this.ps, 330, 400, this.def.color, 2, 140);
    this.ps.render(ctx);
  }
});
