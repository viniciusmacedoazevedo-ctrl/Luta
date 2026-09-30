/* Arena — Igreja (versão estilizada): vitrais coloridos, raios de luz dourada,
   velas tremulando, bancos e partículas de poeira brilhando. */
(function () {
  const BG = VF.BG;

  function layer() {
    return BG.layer(1280, 720, (c) => {
      const g = c.createLinearGradient(0, 0, 0, 720);
      g.addColorStop(0, '#3e2723');
      g.addColorStop(1, '#1b0f0b');
      c.fillStyle = g;
      c.fillRect(0, 0, 1280, 720);
      // arcos e colunas
      for (let i = 0; i < 6; i++) {
        const x = 40 + i * 240;
        c.fillStyle = '#4e342e';
        c.fillRect(x, 60, 36, 520);
        c.fillStyle = 'rgba(255,255,255,0.06)';
        c.fillRect(x + 4, 60, 8, 520);
      }
      // vitrais
      const cols = ['#e53935', '#1e88e5', '#fdd835', '#43a047', '#8e24aa', '#ff7043'];
      for (let i = 0; i < 5; i++) {
        const x = 110 + i * 240, y = 80, w = 130, h = 250;
        c.save();
        c.beginPath();
        c.moveTo(x, y + h); c.lineTo(x, y + 60); c.quadraticCurveTo(x + w / 2, y - 30, x + w, y + 60); c.lineTo(x + w, y + h); c.closePath();
        c.clip();
        for (let k = 0; k < 24; k++) {
          c.fillStyle = cols[(k + i) % cols.length];
          c.globalAlpha = 0.85;
          c.fillRect(x + (k % 4) * (w / 4), y - 30 + Math.floor(k / 4) * 48, w / 4, 48);
        }
        c.globalAlpha = 1;
        c.strokeStyle = '#1b0f0b';
        c.lineWidth = 5;
        for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x + (k * w) / 4, y - 30); c.lineTo(x + (k * w) / 4, y + h); c.stroke(); }
        for (let k = 1; k < 6; k++) { c.beginPath(); c.moveTo(x, y - 30 + k * 48); c.lineTo(x + w, y - 30 + k * 48); c.stroke(); }
        c.restore();
        c.strokeStyle = '#6d4c41';
        c.lineWidth = 8;
        c.beginPath();
        c.moveTo(x, y + h); c.lineTo(x, y + 60); c.quadraticCurveTo(x + w / 2, y - 30, x + w, y + 60); c.lineTo(x + w, y + h); c.closePath();
        c.stroke();
      }
      // altar e cruz estilizada ao fundo
      c.fillStyle = '#6d4c41';
      c.fillRect(540, 400, 200, 150);
      c.fillStyle = '#fff8e1';
      c.fillRect(530, 390, 220, 18);
      c.fillStyle = '#ffd54f';
      c.fillRect(633, 290, 14, 100);
      c.fillRect(610, 312, 60, 12);
      // bancos
      for (let r = 0; r < 2; r++) {
        for (let i = 0; i < 4; i++) {
          const x = i < 2 ? 40 + i * 230 : 780 + (i - 2) * 230;
          c.fillStyle = r ? '#5d4037' : '#4e342e';
          c.fillRect(x, 470 + r * 40, 200, 26);
          c.fillRect(x + 10, 496 + r * 40, 12, 40);
          c.fillRect(x + 178, 496 + r * 40, 12, 40);
        }
      }
      // piso com tapete vermelho
      c.fillStyle = '#3e2723';
      c.fillRect(0, 560, 1280, 160);
      c.fillStyle = '#8e1b1b';
      c.fillRect(0, 590, 1280, 90);
      c.fillStyle = '#ffd54f';
      c.fillRect(0, 590, 1280, 4);
      c.fillRect(0, 676, 1280, 4);
    });
  }

  VF.Backgrounds.igreja = {
    create() {
      return { layer: layer(), dust: new VF.ParticleSystem(80) };
    },
    draw(ctx, t, st) {
      ctx.drawImage(st.layer, 0, 0);
      // raios de luz dos vitrais
      for (let i = 0; i < 5; i++) {
        const x = 175 + i * 240;
        BG.cone(ctx, x, 200, 0.35, 620, 0.16, ['#fff59d', '#ffe0b2', '#f8bbd0', '#bbdefb', '#fff59d'][i], 0.12 + Math.sin(t * 0.7 + i) * 0.03);
      }
      // velas
      for (const vx of [520, 560, 720, 760]) {
        ctx.fillStyle = '#fffde7';
        ctx.fillRect(vx - 5, 350, 10, 40);
        const fl = Math.sin(t * 20 + vx) * 2;
        ctx.fillStyle = '#ffb300';
        ctx.beginPath(); ctx.ellipse(vx + fl * 0.3, 342, 4, 8 + fl, 0, 0, Math.PI * 2); ctx.fill();
        BG.glow(ctx, vx, 342, 40, '#ffcc80', 0.5 + Math.sin(t * 13 + vx) * 0.1);
      }
      // poeira brilhante
      if (Math.random() < 0.3) st.dust.spawn({ x: 100 + Math.random() * 1080, y: 150 + Math.random() * 350, vx: (Math.random() - 0.5) * 10, vy: -8, life: 4, size: 2, color: '#fff8e1', add: true });
      st.dust.update(1 / 60);
      st.dust.render(ctx);
    },
    front(ctx) {
      const g = ctx.createRadialGradient(640, 300, 100, 640, 300, 800);
      g.addColorStop(0, 'rgba(255,220,150,0.08)');
      g.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1280, 720);
    }
  };
})();
