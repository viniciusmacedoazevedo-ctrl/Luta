/* Arena 3 — Praça brasileira: pôr do sol, igreja colonial, coqueiros,
   chafariz, pombos e calçadão de ondas pretas e brancas. */
(function () {
  const BG = VF.BG;
  const GY = VF.CONFIG.GROUND_Y;

  function churchLayer() {
    return BG.layer(1280, 720, (c) => {
      // morros
      c.fillStyle = '#6b3a6e';
      c.beginPath();
      c.moveTo(0, 420);
      c.quadraticCurveTo(160, 300, 340, 400);
      c.quadraticCurveTo(470, 330, 560, 410);
      c.lineTo(560, 520);
      c.lineTo(0, 520);
      c.fill();
      c.beginPath();
      c.moveTo(760, 410);
      c.quadraticCurveTo(900, 250, 1040, 380);
      c.quadraticCurveTo(1150, 320, 1280, 390);
      c.lineTo(1280, 520);
      c.lineTo(760, 520);
      c.fill();
      // igreja colonial
      const x0 = 470, w = 340, top = 330;
      c.fillStyle = '#f3e9dc';
      c.fillRect(x0, top, w, 230);
      c.fillRect(x0 - 10, top - 120, 80, 350);
      c.fillRect(x0 + w - 70, top - 120, 80, 350);
      c.fillStyle = '#2f6fb5';
      c.fillRect(x0 - 10, top - 128, 80, 10);
      c.fillRect(x0 + w - 70, top - 128, 80, 10);
      c.fillRect(x0, top - 6, w, 8);
      // cúpulas das torres
      c.fillStyle = '#2f6fb5';
      for (const tx of [x0 + 30, x0 + w - 30]) {
        c.beginPath();
        c.moveTo(tx - 42, top - 128);
        c.quadraticCurveTo(tx, top - 210, tx + 42, top - 128);
        c.fill();
        c.fillStyle = '#ffd54f';
        c.fillRect(tx - 2, top - 225, 4, 26);
        c.fillRect(tx - 9, top - 216, 18, 4);
        c.fillStyle = '#2f6fb5';
        // sino
        c.fillStyle = '#5b3a1a';
        c.beginPath();
        c.arc(tx, top - 70, 16, Math.PI, 0);
        c.fill();
        c.fillStyle = '#2f6fb5';
      }
      // frontão
      c.fillStyle = '#f3e9dc';
      c.beginPath();
      c.moveTo(x0 + 60, top);
      c.quadraticCurveTo(x0 + w / 2, top - 150, x0 + w - 60, top);
      c.fill();
      c.strokeStyle = '#2f6fb5';
      c.lineWidth = 6;
      c.stroke();
      c.fillStyle = '#ffd54f';
      c.beginPath();
      c.arc(x0 + w / 2, top - 55, 18, 0, Math.PI * 2);
      c.fill();
      // porta e janelas
      c.fillStyle = '#5b3a1a';
      c.beginPath();
      c.moveTo(x0 + w / 2 - 40, 560);
      c.lineTo(x0 + w / 2 - 40, 450);
      c.quadraticCurveTo(x0 + w / 2, 400, x0 + w / 2 + 40, 450);
      c.lineTo(x0 + w / 2 + 40, 560);
      c.fill();
      c.fillStyle = '#2f6fb5';
      for (const wx of [x0 + 95, x0 + w - 125]) {
        c.fillRect(wx, 400, 30, 50);
      }
      c.fillStyle = 'rgba(255,120,60,0.18)';
      c.fillRect(x0 - 10, top - 230, w + 20, 460);
      // grama e canteiros
      c.fillStyle = '#3d7a3a';
      c.fillRect(0, 540, 1280, 40);
      c.fillStyle = '#2f5f2c';
      for (let x = 0; x < 1280; x += 36) {
        c.beginPath();
        c.arc(x + 18, 545, 22, Math.PI, 0);
        c.fill();
      }
      // calçadão de ondas (preto e branco)
      c.fillStyle = '#f2efe8';
      c.fillRect(0, 580, 1280, 140);
      c.fillStyle = '#1d1d1d';
      for (let band = 0; band < 6; band++) {
        const y0 = 585 + band * 24;
        c.beginPath();
        c.moveTo(0, y0);
        for (let x = 0; x <= 1280; x += 8) c.lineTo(x, y0 + Math.sin(x * 0.02 + band * 0.9) * 7);
        for (let x = 1280; x >= 0; x -= 8) c.lineTo(x, y0 + 11 + Math.sin(x * 0.02 + band * 0.9) * 7);
        c.closePath();
        c.fill();
      }
      c.fillStyle = 'rgba(255,140,60,0.12)';
      c.fillRect(0, 580, 1280, 140);
    });
  }

  function palm(ctx, x, y, h, t, ph) {
    const sway = Math.sin(t * 1.3 + ph) * 0.08;
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#4e342e';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(20, -h * 0.5, Math.sin(sway) * h * 0.4 + 10, -h);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 2;
    for (let i = 1; i < 10; i++) {
      const yy = -h * (i / 10);
      ctx.beginPath();
      ctx.moveTo(-6 + i * 1.2, yy);
      ctx.lineTo(8 + i * 1.2, yy);
      ctx.stroke();
    }
    ctx.translate(Math.sin(sway) * h * 0.4 + 10, -h);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + sway * 3 + Math.sin(t * 2 + i) * 0.05;
      ctx.fillStyle = i % 2 ? '#2e7d32' : '#388e3c';
      ctx.save();
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(60, -30, 120, 20);
      ctx.quadraticCurveTo(60, -5, 0, 0);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#6d4c41';
    ctx.beginPath();
    ctx.arc(-6, 8, 7, 0, Math.PI * 2);
    ctx.arc(7, 9, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  VF.Backgrounds.praca = {
    create() {
      const rnd = BG.rng(5);
      const clouds = [];
      for (let i = 0; i < 6; i++) clouds.push({ x: rnd() * 1400, y: 50 + rnd() * 140, s: 0.6 + rnd() * 0.8, v: 6 + rnd() * 10 });
      const birds = [];
      for (let i = 0; i < 5; i++) birds.push({ x: 150 + rnd() * 1000, p: rnd() * 6, dir: rnd() < 0.5 ? -1 : 1 });
      return { layer: churchLayer(), clouds, birds, water: new VF.ParticleSystem(200), wt: 0 };
    },

    draw(ctx, t, st) {
      const sky = ctx.createLinearGradient(0, 0, 0, 520);
      sky.addColorStop(0, '#3b1d6e');
      sky.addColorStop(0.45, '#d9477a');
      sky.addColorStop(0.8, '#ff9a3c');
      sky.addColorStop(1, '#ffd36e');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, 1280, 720);
      // sol
      BG.glow(ctx, 640, 380, 320, '#ffcf6b', 0.45);
      ctx.fillStyle = '#ffe28a';
      ctx.beginPath();
      ctx.arc(640, 380, 90, 0, Math.PI * 2);
      ctx.fill();
      // raios
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(640, 380);
      ctx.rotate(t * 0.05);
      ctx.fillStyle = 'rgba(255,220,140,0.07)';
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(700, -50);
        ctx.lineTo(700, 50);
        ctx.fill();
      }
      ctx.restore();
      // nuvens
      for (const c of st.clouds) {
        c.x -= c.v / 60;
        if (c.x < -250) c.x = 1450;
        ctx.fillStyle = 'rgba(255,200,210,0.55)';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, 90 * c.s, 22 * c.s, 0, 0, Math.PI * 2);
        ctx.ellipse(c.x + 40 * c.s, c.y - 14 * c.s, 50 * c.s, 22 * c.s, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.drawImage(st.layer, 0, 0);
      // chafariz
      ctx.fillStyle = '#cfc6b8';
      ctx.beginPath();
      ctx.ellipse(640, 572, 110, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5fb6d9';
      ctx.beginPath();
      ctx.ellipse(640, 568, 96, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b8ad9e';
      ctx.fillRect(630, 500, 20, 70);
      ctx.beginPath();
      ctx.ellipse(640, 500, 40, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      st.wt += 1 / 60;
      while (st.wt > 0.02) {
        st.wt -= 0.02;
        const a = (Math.random() - 0.5) * 1.2;
        st.water.spawn({ x: 640, y: 485, vx: Math.sin(a) * 160, vy: -260 - Math.random() * 60, g: 700, life: 0.85, size: 2.5, color: 'rgba(190,235,255,0.8)' });
      }
      st.water.update(1 / 60);
      st.water.render(ctx);
      // coqueiros
      palm(ctx, 110, 590, 300, t, 0);
      palm(ctx, 1170, 590, 330, t, 2);
      palm(ctx, 330, 570, 220, t, 4);
      // pombos
      for (const b of st.birds) {
        const peck = Math.sin(t * 5 + b.p) > 0.6 ? 4 : 0;
        b.x += b.dir * 0.3;
        if (b.x < 120 || b.x > 1160) b.dir *= -1;
        ctx.save();
        ctx.translate(b.x, 570);
        ctx.scale(b.dir, 1);
        ctx.fillStyle = '#8d8d99';
        ctx.beginPath();
        ctx.ellipse(0, -8, 10, 6, 0, 0, Math.PI * 2);
        ctx.arc(8, -14 + peck, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e0a400';
        ctx.fillRect(12, -14 + peck, 4, 2);
        ctx.restore();
      }
    },

    front(ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 720);
      g.addColorStop(0, 'rgba(255,120,60,0)');
      g.addColorStop(1, 'rgba(120,30,80,0.18)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1280, 720);
      BG.vignette(ctx, 0.35);
    }
  };
})();
