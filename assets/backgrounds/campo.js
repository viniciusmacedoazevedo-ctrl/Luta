/* Arena — Campo de futebol: estádio lotado à noite, refletores, bandeiras,
   gol ao fundo, gramado listrado e papel picado. */
(function () {
  const BG = VF.BG;

  function layer() {
    return BG.layer(1280, 720, (c) => {
      const sky = c.createLinearGradient(0, 0, 0, 300);
      sky.addColorStop(0, '#0a1330');
      sky.addColorStop(1, '#1d2d5c');
      c.fillStyle = sky;
      c.fillRect(0, 0, 1280, 720);
      // arquibancada
      c.fillStyle = '#1b1f2e';
      c.beginPath(); c.moveTo(0, 150); c.lineTo(1280, 150); c.lineTo(1280, 470); c.lineTo(0, 470); c.fill();
      for (let r = 0; r < 8; r++) {
        c.fillStyle = r % 2 ? '#262b3e' : '#2e344b';
        c.fillRect(0, 170 + r * 38, 1280, 20);
      }
      // placa de publicidade
      c.fillStyle = '#111';
      c.fillRect(0, 470, 1280, 44);
      c.font = "30px 'Bangers', Impact, sans-serif";
      for (let i = 0; i < 5; i++) {
        c.fillStyle = ['#ffd600', '#00e676', '#29b6f6', '#ff1744', '#ffffff'][i];
        c.fillText(['VINI FIGHT', 'GOOOL!', 'CRAQUE', 'ARENA 10', 'FUTEBOL'][i], 40 + i * 260, 503);
      }
      // gramado listrado
      for (let i = 0; i < 12; i++) {
        c.fillStyle = i % 2 ? '#2e7d32' : '#388e3c';
        c.fillRect(i * 110, 514, 110, 206);
      }
      c.strokeStyle = 'rgba(255,255,255,0.8)';
      c.lineWidth = 5;
      c.beginPath(); c.moveTo(640, 514); c.lineTo(640, 720); c.stroke();
      c.beginPath(); c.ellipse(640, 640, 180, 50, 0, 0, Math.PI * 2); c.stroke();
      // gol
      c.strokeStyle = '#ffffff';
      c.lineWidth = 7;
      c.beginPath(); c.moveTo(1080, 560); c.lineTo(1080, 430); c.lineTo(1250, 430); c.lineTo(1250, 560); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.3)';
      c.lineWidth = 1.5;
      for (let x = 1085; x < 1250; x += 12) { c.beginPath(); c.moveTo(x, 432); c.lineTo(x, 560); c.stroke(); }
      for (let y = 440; y < 560; y += 12) { c.beginPath(); c.moveTo(1082, y); c.lineTo(1248, y); c.stroke(); }
    });
  }

  VF.Backgrounds.campo = {
    create() {
      const rnd = BG.rng(12);
      const crowd = [];
      for (let r = 0; r < 7; r++) for (let i = 0; i < 44; i++) crowd.push({ x: i * 30 + (r % 2) * 15, y: 190 + r * 38, p: rnd() * 6, c: rnd() < 0.5 ? '#ffd600' : rnd() < 0.5 ? '#43a047' : '#1e88e5' });
      return { layer: layer(), crowd, conf: new VF.ParticleSystem(120), ct: 0 };
    },
    draw(ctx, t, st) {
      ctx.drawImage(st.layer, 0, 0);
      // torcida
      for (const p of st.crowd) {
        const j = Math.max(0, Math.sin(t * 5 + p.p + p.x * 0.01)) * 6;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x - 6, p.y - j, 12, 14);
        ctx.fillStyle = '#d7a57a';
        ctx.fillRect(p.x - 4, p.y - 8 - j, 8, 8);
      }
      // bandeiras balançando
      for (const bx of [180, 520, 860]) {
        ctx.fillStyle = '#eee';
        ctx.fillRect(bx, 150, 4, 90);
        const w = Math.sin(t * 4 + bx) * 10;
        ctx.fillStyle = '#ffd600';
        ctx.beginPath(); ctx.moveTo(bx + 4, 150); ctx.quadraticCurveTo(bx + 40, 150 + w, bx + 80, 155); ctx.lineTo(bx + 80, 195); ctx.quadraticCurveTo(bx + 40, 190 + w, bx + 4, 195); ctx.fill();
        ctx.fillStyle = '#43a047';
        ctx.fillRect(bx + 4, 170 + w * 0.3, 76, 8);
      }
      // refletores
      for (const lx of [80, 1200]) {
        ctx.fillStyle = '#222';
        ctx.fillRect(lx - 4, 20, 8, 140);
        ctx.fillStyle = '#fffde7';
        ctx.fillRect(lx - 40, 10, 80, 26);
        BG.glow(ctx, lx, 23, 140, '#fffde7', 0.5);
        BG.cone(ctx, lx, 30, lx < 640 ? 0.6 : -0.6, 900, 0.18, '#fffde7', 0.12);
      }
      // papel picado
      st.ct += 1 / 60;
      if (st.ct > 0.08) {
        st.ct = 0;
        st.conf.spawn({ x: Math.random() * 1280, y: -10, vx: (Math.random() - 0.5) * 40, vy: 70 + Math.random() * 60, life: 7, size: 4, color: Math.random() < 0.5 ? '#ffd600' : '#ffffff', shape: 'rect', spin: 5, fade: false });
      }
      st.conf.update(1 / 60);
      st.conf.render(ctx);
    },
    front(ctx) { BG.vignette(ctx, 0.45); }
  };
})();
