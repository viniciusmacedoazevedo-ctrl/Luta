/* Arena 1 — Rua brasileira à noite: casinhas coloridas, postes,
   bandeirinhas, boteco com neon e um gato passeando no telhado. */
(function () {
  const BG = VF.BG;
  const GY = VF.CONFIG.GROUND_Y;

  function staticLayer() {
    const rnd = BG.rng(7);
    return BG.layer(1280, 720, (c) => {
      // morro com luzes da comunidade ao fundo
      c.fillStyle = '#141032';
      c.beginPath();
      c.moveTo(0, 360);
      c.bezierCurveTo(200, 220, 420, 300, 600, 250);
      c.bezierCurveTo(800, 200, 1000, 320, 1280, 240);
      c.lineTo(1280, 520);
      c.lineTo(0, 520);
      c.fill();
      for (let i = 0; i < 220; i++) {
        const x = rnd() * 1280, y = 260 + rnd() * 200;
        c.fillStyle = rnd() < 0.7 ? 'rgba(255,200,90,0.55)' : 'rgba(255,255,255,0.35)';
        c.fillRect(x, y, 2 + rnd() * 2, 2 + rnd() * 2);
      }
      // casinhas coloridas
      const cols = ['#c2185b', '#00897b', '#f9a825', '#6a1b9a', '#ef6c00', '#2e7d32', '#1565c0', '#d84315'];
      let x = -20;
      let i = 0;
      while (x < 1300) {
        const w = 130 + rnd() * 90, h = 150 + rnd() * 110;
        const top = 560 - h;
        const col = cols[i % cols.length];
        c.fillStyle = col;
        c.fillRect(x, top, w, h);
        c.fillStyle = 'rgba(0,0,20,0.45)'; // noite
        c.fillRect(x, top, w, h);
        c.fillStyle = 'rgba(0,0,0,0.35)';
        c.fillRect(x + w - 10, top, 10, h);
        // telhado / platibanda
        c.fillStyle = rnd() < 0.5 ? '#5d2e1a' : '#e0e0e0';
        c.globalAlpha = 0.8;
        c.fillRect(x - 4, top - 10, w + 8, 12);
        c.globalAlpha = 1;
        // janelas
        const nw = Math.floor(w / 55);
        for (let k = 0; k < nw; k++) {
          const wx = x + 18 + k * 52, wy = top + 30;
          const lit = rnd() < 0.6;
          c.fillStyle = lit ? '#ffd27a' : '#1d1b33';
          c.fillRect(wx, wy, 30, 38);
          c.strokeStyle = 'rgba(0,0,0,0.6)';
          c.lineWidth = 3;
          c.strokeRect(wx, wy, 30, 38);
          c.beginPath();
          c.moveTo(wx + 15, wy);
          c.lineTo(wx + 15, wy + 38);
          c.stroke();
          if (h > 200 && rnd() < 0.7) {
            c.fillStyle = rnd() < 0.5 ? '#ffd27a' : '#1d1b33';
            c.fillRect(wx, wy + 70, 30, 38);
            c.strokeRect(wx, wy + 70, 30, 38);
          }
        }
        // porta
        c.fillStyle = '#2b1a12';
        c.fillRect(x + w * 0.55, 560 - 70, 34, 70);
        x += w;
        i++;
      }
      // boteco
      c.fillStyle = '#3e2723';
      c.fillRect(820, 430, 260, 130);
      c.fillStyle = '#ffcc80';
      c.fillRect(840, 470, 220, 90);
      c.fillStyle = 'rgba(0,0,0,0.35)';
      for (let k = 0; k < 6; k++) c.fillRect(840 + k * 44, 470, 4, 90);
      // toldo listrado
      for (let k = 0; k < 13; k++) {
        c.fillStyle = k % 2 ? '#ffffff' : '#e53935';
        c.fillRect(815 + k * 21, 440, 21, 26);
      }
      // calçada + rua
      c.fillStyle = '#4a4458';
      c.fillRect(0, 560, 1280, 30);
      c.fillStyle = '#2d2838';
      c.fillRect(0, 590, 1280, 130);
      c.fillStyle = '#6d6680';
      c.fillRect(0, 586, 1280, 6);
      // paralelepípedos
      c.strokeStyle = 'rgba(0,0,0,0.35)';
      c.lineWidth = 2;
      for (let y = 600; y < 720; y += 18) {
        const off = (y / 18) % 2 ? 0 : 20;
        for (let xx = -40 + off; xx < 1300; xx += 40) {
          c.strokeRect(xx, y, 40, 18);
        }
      }
    });
  }

  VF.Backgrounds.rua = {
    create() {
      const rnd = BG.rng(3);
      const stars = [];
      for (let i = 0; i < 90; i++) stars.push({ x: rnd() * 1280, y: rnd() * 240, s: rnd() * 2 + 0.5, p: rnd() * 6 });
      return { layer: staticLayer(), stars, catX: -200 };
    },

    draw(ctx, t, st) {
      const sky = ctx.createLinearGradient(0, 0, 0, 400);
      sky.addColorStop(0, '#070a24');
      sky.addColorStop(1, '#3a1f5c');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, 1280, 720);
      for (const s of st.stars) {
        ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + s.p));
        ctx.fillStyle = '#fff';
        ctx.fillRect(s.x, s.y, s.s, s.s);
      }
      ctx.globalAlpha = 1;
      // lua
      BG.glow(ctx, 1080, 110, 140, '#fff6c8', 0.25);
      ctx.fillStyle = '#fff6d6';
      ctx.beginPath();
      ctx.arc(1080, 110, 44, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.beginPath();
      ctx.arc(1068, 100, 10, 0, Math.PI * 2);
      ctx.arc(1095, 125, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.drawImage(st.layer, 0, 0);

      // gato no telhado
      st.catX += 60 / 60;
      if (st.catX > 1500) st.catX = -300;
      const cx = st.catX, cy = 305 + Math.sin(cx * 0.01) * 2;
      ctx.fillStyle = '#0a0a12';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 16, 8, 0, 0, Math.PI * 2);
      ctx.arc(cx + 16, cy - 7, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 12, cy - 12); ctx.lineTo(cx + 14, cy - 20); ctx.lineTo(cx + 17, cy - 13);
      ctx.moveTo(cx + 18, cy - 12); ctx.lineTo(cx + 21, cy - 19); ctx.lineTo(cx + 22, cy - 11);
      ctx.fill();
      ctx.strokeStyle = '#0a0a12';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy);
      ctx.quadraticCurveTo(cx - 30, cy - 5 + Math.sin(t * 4) * 5, cx - 26, cy - 22);
      ctx.stroke();

      // neon do boteco
      const on = Math.sin(t * 13) > -0.85 || Math.sin(t * 2.3) > 0;
      ctx.font = "bold 40px 'Bangers', Impact, sans-serif";
      ctx.textAlign = 'center';
      if (on) BG.glow(ctx, 950, 408, 120, '#ff2d95', 0.35);
      ctx.lineWidth = 5;
      ctx.strokeStyle = on ? '#ff5cb1' : '#5a2a44';
      ctx.strokeText('BOTECO', 950, 420);
      ctx.fillStyle = on ? '#fff0f8' : '#3a1a2a';
      ctx.fillText('BOTECO', 950, 420);

      // postes com luz
      for (const px of [150, 640, 1180]) {
        ctx.fillStyle = '#1b1b24';
        ctx.fillRect(px - 5, 250, 10, 340);
        ctx.fillRect(px - 5, 250, 44, 8);
        const flick = px === 640 ? (Math.sin(t * 25) > 0.95 ? 0.3 : 1) : 1;
        ctx.fillStyle = flick > 0.5 ? '#fff3c4' : '#8a7a50';
        ctx.fillRect(px + 26, 256, 22, 8);
        BG.cone(ctx, px + 37, 262, 0, 360, 0.42, '#ffd27a', 0.22 * flick);
        BG.glow(ctx, px + 37, 262, 70, '#ffe7a3', 0.5 * flick);
      }

      // bandeirinhas balançando
      const flagCols = ['#e53935', '#ffd600', '#43a047', '#1e88e5', '#ff6d00', '#d81b60'];
      for (let row = 0; row < 2; row++) {
        const y0 = 170 + row * 45;
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x <= 1280; x += 20) {
          const y = y0 + Math.sin((x / 1280) * Math.PI) * 40;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
        for (let x = 10 + row * 16; x < 1280; x += 32) {
          const y = y0 + Math.sin((x / 1280) * Math.PI) * 40;
          const sw = Math.sin(t * 3 + x * 0.05 + row) * 4;
          ctx.fillStyle = flagCols[(x / 32 + row) % flagCols.length | 0];
          ctx.beginPath();
          ctx.moveTo(x - 9, y);
          ctx.lineTo(x + 9, y);
          ctx.lineTo(x + 9 + sw, y + 22);
          ctx.lineTo(x + sw, y + 15);
          ctx.lineTo(x - 9 + sw, y + 22);
          ctx.closePath();
          ctx.fill();
        }
      }
    },

    front(ctx, t) {
      // brilho molhado no chão
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(255,210,120,0.05)';
      for (const px of [187, 677, 1217]) {
        ctx.beginPath();
        ctx.ellipse(px, GY + 30, 120, 16, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      BG.vignette(ctx, 0.5);
    }
  };
})();
