/* Arena 4 — Arena futurista: skyline neon, grade synthwave em movimento,
   anel holográfico, lasers e drones. */
(function () {
  const BG = VF.BG;
  const GY = VF.CONFIG.GROUND_Y;

  function skyline() {
    const rnd = BG.rng(99);
    return BG.layer(1280, 720, (c) => {
      for (let layer = 0; layer < 2; layer++) {
        let x = -20;
        while (x < 1300) {
          const w = 40 + rnd() * 70, h = (layer ? 120 : 200) + rnd() * (layer ? 140 : 180);
          const y = 470 - h;
          c.fillStyle = layer ? '#150a33' : '#0d0624';
          c.fillRect(x, y, w, h + 60);
          const neon = ['#00e5ff', '#ff2d95', '#b36bff'][Math.floor(rnd() * 3)];
          c.fillStyle = neon;
          c.globalAlpha = 0.8;
          c.fillRect(x, y, w, 3);
          c.globalAlpha = 0.5;
          for (let wy = y + 12; wy < 470; wy += 14) {
            for (let wx = x + 6; wx < x + w - 6; wx += 10) {
              if (rnd() < 0.35) c.fillRect(wx, wy, 4, 6);
            }
          }
          c.globalAlpha = 1;
          if (!layer && rnd() < 0.3) {
            c.fillStyle = '#ff1744';
            c.fillRect(x + w / 2 - 1, y - 30, 2, 30);
          }
          x += w + (layer ? 30 : 6);
        }
      }
    });
  }

  VF.Backgrounds.futurista = {
    create() {
      const rnd = BG.rng(42);
      const stars = [];
      for (let i = 0; i < 120; i++) stars.push({ x: rnd() * 1280, y: rnd() * 330, s: rnd() * 2, p: rnd() * 6 });
      const drones = [];
      for (let i = 0; i < 3; i++) drones.push({ x: rnd() * 1280, y: 120 + rnd() * 140, v: 40 + rnd() * 60, p: rnd() * 6 });
      return { layer: skyline(), stars, drones };
    },

    draw(ctx, t, st) {
      const sky = ctx.createLinearGradient(0, 0, 0, 480);
      sky.addColorStop(0, '#05010f');
      sky.addColorStop(0.7, '#2a0a4a');
      sky.addColorStop(1, '#6a1b6e');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, 1280, 720);
      for (const s of st.stars) {
        ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(t + s.p));
        ctx.fillStyle = '#cfe8ff';
        ctx.fillRect(s.x, s.y, s.s, s.s);
      }
      ctx.globalAlpha = 1;
      // sol retrô com faixas
      ctx.save();
      const sg = ctx.createLinearGradient(0, 210, 0, 470);
      sg.addColorStop(0, '#ffe066');
      sg.addColorStop(1, '#ff2d95');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(640, 400, 150, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#2a0a4a';
      for (let i = 0; i < 6; i++) ctx.fillRect(480, 300 + i * 18 + ((t * 20) % 18), 320, 3 + i);
      ctx.restore();
      BG.glow(ctx, 640, 400, 260, '#ff2d95', 0.25);
      ctx.drawImage(st.layer, 0, 0);
      // horizonte
      ctx.fillStyle = '#0a0418';
      ctx.fillRect(0, 470, 1280, 250);
      BG.glow(ctx, 640, 470, 700, '#b36bff', 0.18);
      ctx.fillStyle = '#ff2d95';
      ctx.fillRect(0, 468, 1280, 3);
      // grade em perspectiva
      ctx.save();
      ctx.strokeStyle = 'rgba(0,229,255,0.55)';
      ctx.lineWidth = 2;
      for (let i = -24; i <= 24; i++) {
        ctx.beginPath();
        ctx.moveTo(640 + i * 20, 470);
        ctx.lineTo(640 + i * 130, 720);
        ctx.stroke();
      }
      const off = (t * 0.6) % 1;
      for (let i = 0; i < 12; i++) {
        const k = (i + off) / 12;
        const y = 470 + Math.pow(k, 2.2) * 250;
        ctx.globalAlpha = 0.2 + k * 0.7;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1280, y);
        ctx.stroke();
      }
      ctx.restore();
      // anel holográfico
      ctx.save();
      ctx.translate(640, 170);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = i === 1 ? 'rgba(255,45,149,0.5)' : 'rgba(0,229,255,0.45)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 150 + i * 22, 30 + i * 6 + Math.sin(t * 2 + i) * 6, Math.sin(t * 0.5) * 0.1, t * (i % 2 ? -1 : 1), t * (i % 2 ? -1 : 1) + Math.PI * 1.6);
        ctx.stroke();
      }
      ctx.font = "bold 40px 'Bangers', Impact, sans-serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(0,229,255,${0.5 + Math.sin(t * 8) * 0.2})`;
      ctx.fillText('VINI FIGHT 3000', 0, 14);
      ctx.restore();
      // lasers
      for (let i = 0; i < 2; i++) {
        const a = Math.sin(t * (0.9 + i * 0.4) + i * 2) * 0.6;
        BG.cone(ctx, i ? 1280 : 0, 470, Math.PI - (i ? -1 : 1) * (1.2 + a * 0.3), 1200, 0.012, i ? '#ff2d95' : '#00e5ff', 0.5);
      }
      // drones
      for (const d of st.drones) {
        d.x += d.v / 60;
        if (d.x > 1350) d.x = -70;
        const y = d.y + Math.sin(t * 2 + d.p) * 10;
        ctx.fillStyle = '#1b1035';
        ctx.fillRect(d.x - 20, y - 6, 40, 12);
        ctx.fillRect(d.x - 30, y - 10, 12, 4);
        ctx.fillRect(d.x + 18, y - 10, 12, 4);
        BG.glow(ctx, d.x, y + 6, 18, Math.sin(t * 10 + d.p) > 0 ? '#ff1744' : '#00e5ff', 0.9);
      }
      // pilares neon
      for (const px of [40, 1240]) {
        ctx.fillStyle = '#120828';
        ctx.fillRect(px - 16, 200, 32, 440);
        ctx.fillStyle = `rgba(0,229,255,${0.6 + Math.sin(t * 4 + px) * 0.3})`;
        ctx.fillRect(px - 3, 210, 6, 420);
      }
    },

    front(ctx, t) {
      // brilho do chão sob os lutadores
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(179,107,255,0.08)';
      ctx.fillRect(0, GY - 4, 1280, 6);
      ctx.restore();
      BG.vignette(ctx, 0.5);
    }
  };
})();
