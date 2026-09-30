/* Fundo animado dos menus: raios giratórios, partículas de energia
   e dois lutadores aleatórios em pose de luta. */
(function () {
  const BG = VF.BG;

  VF.Backgrounds.menu = {
    create(opts) {
      opts = opts || {};
      const ids = VF.CHARACTERS.map((c) => c.id);
      const a = VF.M.choose(ids);
      let b = VF.M.choose(ids);
      if (b === a) b = ids[(ids.indexOf(a) + 1) % ids.length];
      const ps = new VF.ParticleSystem(260);
      return { ps, a, b, t: 0, showFighters: opts.fighters !== false };
    },

    draw(ctx, t, st, dt) {
      dt = dt || 1 / 60;
      const g = ctx.createRadialGradient(640, 360, 50, 640, 360, 900);
      g.addColorStop(0, '#3a0f5c');
      g.addColorStop(0.55, '#170733');
      g.addColorStop(1, '#07020f');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1280, 720);
      // raios giratórios
      ctx.save();
      ctx.translate(640, 330);
      ctx.rotate(t * 0.08);
      for (let i = 0; i < 16; i++) {
        ctx.rotate((Math.PI * 2) / 16);
        ctx.fillStyle = i % 2 ? 'rgba(255,61,113,0.06)' : 'rgba(0,229,255,0.05)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(1100, -90);
        ctx.lineTo(1100, 90);
        ctx.fill();
      }
      ctx.restore();
      // linhas de velocidade diagonais
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 14; i++) {
        const x = ((i * 137 + t * 380) % 1700) - 200;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - 300, 720);
        ctx.stroke();
      }
      ctx.restore();
      // partículas subindo
      if (Math.random() < 0.6) {
        st.ps.spawn({ x: Math.random() * 1280, y: 740, vx: (Math.random() - 0.5) * 30, vy: -60 - Math.random() * 120, life: 5, size: 1.5 + Math.random() * 3, color: Math.random() < 0.5 ? '#ff3d71' : '#ffd600', add: true, alpha: 0.8 });
      }
      st.ps.update(dt);
      st.ps.render(ctx);
      // lutadores
      if (st.showFighters) {
        const sa = VF.Skins[st.a], sb = VF.Skins[st.b];
        const pa = VF.Poses.idle(t), pb = VF.Poses.idle(t + 0.7);
        ctx.save();
        BG.glow(ctx, 180, 520, 260, VF.getCharacter(st.a).color, 0.25);
        BG.glow(ctx, 1100, 520, 260, VF.getCharacter(st.b).color, 0.25);
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(180, 700, 90, 14, 0, 0, Math.PI * 2);
        ctx.ellipse(1100, 700, 90, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        VF.Rig.draw(ctx, sa, pa, { x: 180, y: 700, facing: 1, scale: 1.45, t, fighter: { state: 'idle' } });
        VF.Rig.draw(ctx, sb, pb, { x: 1100, y: 700, facing: -1, scale: 1.45, t, fighter: { state: 'idle' } });
        ctx.restore();
      }
      BG.vignette(ctx, 0.6);
    }
  };
})();
