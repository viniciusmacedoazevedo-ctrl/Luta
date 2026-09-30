/* Fundo animado dos menus: uma arena real com movimento de câmera,
   iluminação colorida, partículas e três lutadores ao fundo. */
(function () {
  const BG = VF.BG;

  VF.Backgrounds.menu = {
    create() {
      const ids = VF.CHARACTERS.map((c) => c.id);
      const pick = () => ids.splice(Math.floor(Math.random() * ids.length), 1)[0];
      const arena = VF.M.choose(['rua', 'urbana', 'futurista', 'campo', 'igreja', 'escola', 'praca']);
      const bg = VF.Backgrounds[arena];
      const trio = [pick(), pick(), pick()].map((id) => new VF.Puppet(id));
      return { ps: new VF.ParticleSystem(200), arena, bg, bgState: bg.create(), trio, showFighters: true };
    },

    draw(ctx, t, st, dt) {
      dt = dt || 1 / 60;
      // câmera lenta passeando pela arena
      const z = 1.12 + Math.sin(t * 0.13) * 0.05;
      const px = Math.sin(t * 0.09) * 50;
      ctx.save();
      ctx.translate(640, 360);
      ctx.scale(z, z);
      ctx.translate(-640 + px, -360);
      st.bg.draw(ctx, t, st.bgState);
      if (st.showFighters) {
        const pos = [[250, 1], [1030, -1], [640, 1]];
        st.trio.forEach((p, i) => {
          p.update(dt);
          const [x, f] = pos[i];
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.beginPath();
          ctx.ellipse(x, 642, 70, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          if (i < 2) p.draw(ctx, x, 640, 1.25, f);
        });
      }
      if (st.bg.front) st.bg.front(ctx, t, st.bgState);
      ctx.restore();
      // camada escura + luzes coloridas
      const g = ctx.createLinearGradient(0, 0, 0, 720);
      g.addColorStop(0, 'rgba(8,3,20,0.55)');
      g.addColorStop(0.5, 'rgba(8,3,20,0.35)');
      g.addColorStop(1, 'rgba(8,3,20,0.75)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1280, 720);
      BG.cone(ctx, 200 + Math.sin(t * 0.5) * 120, -40, 0.3, 900, 0.14, '#ff2d95', 0.18);
      BG.cone(ctx, 1080 + Math.cos(t * 0.4) * 120, -40, -0.3, 900, 0.14, '#00e5ff', 0.18);
      if (Math.random() < 0.5) {
        st.ps.spawn({ x: Math.random() * 1280, y: 740, vx: (Math.random() - 0.5) * 30, vy: -60 - Math.random() * 120, life: 5, size: 1.5 + Math.random() * 3, color: Math.random() < 0.5 ? '#ff3d71' : '#ffd600', add: true, alpha: 0.8 });
      }
      st.ps.update(dt);
      st.ps.render(ctx);
      BG.vignette(ctx, 0.55);
    }
  };
})();
