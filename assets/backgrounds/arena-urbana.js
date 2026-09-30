/* Arena 2 — Arena urbana: galpão com grafite, grade, torcida e holofotes */
(function () {
  const BG = VF.BG;
  const GY = VF.CONFIG.GROUND_Y;

  function wallLayer() {
    const rnd = BG.rng(11);
    return BG.layer(1280, 720, (c) => {
      c.fillStyle = '#3b2323';
      c.fillRect(0, 0, 1280, 720);
      // tijolos
      for (let y = 0; y < 600; y += 22) {
        const off = (y / 22) % 2 ? 0 : 30;
        for (let x = -60 + off; x < 1300; x += 60) {
          const v = 50 + rnd() * 30;
          c.fillStyle = `rgb(${v + 60},${v * 0.55},${v * 0.45})`;
          c.fillRect(x + 2, y + 2, 56, 18);
        }
      }
      c.fillStyle = 'rgba(10,5,20,0.45)';
      c.fillRect(0, 0, 1280, 720);
      // grafites
      const tags = [
        { t: 'VINI FIGHT', x: 330, y: 250, s: 86, c1: '#00e5ff', c2: '#ff2d95', r: -0.08 },
        { t: 'LUTA!', x: 960, y: 230, s: 96, c1: '#ffd600', c2: '#ff3d00', r: 0.1 },
        { t: 'K.O.', x: 1150, y: 380, s: 60, c1: '#76ff03', c2: '#1b5e20', r: -0.15 },
        { t: 'RESPEITA', x: 640, y: 222, s: 44, c1: '#e040fb', c2: '#311b92', r: 0.03 }
      ];
      for (const g of tags) {
        c.save();
        c.translate(g.x, g.y);
        c.rotate(g.r);
        c.font = `bold ${g.s}px 'Bangers', Impact, sans-serif`;
        c.textAlign = 'center';
        c.lineJoin = 'round';
        c.lineWidth = g.s / 5;
        c.strokeStyle = '#111';
        c.strokeText(g.t, 6, 6);
        c.lineWidth = g.s / 8;
        c.strokeStyle = g.c2;
        c.strokeText(g.t, 0, 0);
        const gr = c.createLinearGradient(0, -g.s / 2, 0, g.s / 2);
        gr.addColorStop(0, '#fff');
        gr.addColorStop(0.5, g.c1);
        gr.addColorStop(1, g.c2);
        c.fillStyle = gr;
        c.fillText(g.t, 0, 0);
        c.restore();
      }
      // respingos de tinta
      for (let i = 0; i < 40; i++) {
        c.fillStyle = ['#00e5ff', '#ff2d95', '#ffd600', '#76ff03'][i % 4];
        c.globalAlpha = 0.5;
        c.beginPath();
        c.arc(rnd() * 1280, 60 + rnd() * 420, rnd() * 6 + 1, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
      // grade (alambrado)
      c.strokeStyle = 'rgba(180,190,200,0.35)';
      c.lineWidth = 2;
      for (let x = -600; x < 1300; x += 26) {
        c.beginPath();
        c.moveTo(x, 380);
        c.lineTo(x + 200, 580);
        c.moveTo(x + 200, 380);
        c.lineTo(x, 580);
        c.stroke();
      }
      c.fillStyle = '#555c66';
      c.fillRect(0, 374, 1280, 8);
      for (let x = 0; x < 1300; x += 160) c.fillRect(x, 374, 8, 210);
      // chão de concreto
      const fl = c.createLinearGradient(0, 580, 0, 720);
      fl.addColorStop(0, '#4a4a55');
      fl.addColorStop(1, '#2a2a33');
      c.fillStyle = fl;
      c.fillRect(0, 580, 1280, 140);
      // ringue pintado
      c.strokeStyle = 'rgba(255,214,0,0.55)';
      c.lineWidth = 6;
      c.beginPath();
      c.ellipse(640, 668, 560, 42, 0, 0, Math.PI * 2);
      c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.25)';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(640, 626);
      c.lineTo(640, 710);
      c.stroke();
      for (let i = 0; i < 30; i++) {
        c.fillStyle = 'rgba(0,0,0,0.2)';
        c.beginPath();
        c.ellipse(rnd() * 1280, 600 + rnd() * 110, 10 + rnd() * 30, 3 + rnd() * 5, 0, 0, Math.PI * 2);
        c.fill();
      }
    });
  }

  VF.Backgrounds.urbana = {
    create() {
      const rnd = BG.rng(21);
      const crowd = [];
      for (let i = 0; i < 70; i++) {
        crowd.push({ x: i * 19 + rnd() * 10 - 10, y: 560 + rnd() * 25, s: 0.8 + rnd() * 0.4, p: rnd() * 6, hue: rnd() });
      }
      const steam = new VF.ParticleSystem(80);
      return { layer: wallLayer(), crowd, steam, steamT: 0 };
    },

    draw(ctx, t, st) {
      ctx.drawImage(st.layer, 0, 0);
      // torcida
      for (const p of st.crowd) {
        const jump = Math.max(0, Math.sin(t * 6 + p.p)) * 10;
        const x = p.x, y = p.y - jump;
        ctx.fillStyle = `hsl(${260 + p.hue * 60},25%,${10 + p.hue * 10}%)`;
        ctx.beginPath();
        ctx.ellipse(x, y, 11 * p.s, 22 * p.s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y - 28 * p.s, 9 * p.s, 0, Math.PI * 2);
        ctx.fill();
        if (Math.sin(t * 3 + p.p * 2) > 0.2) {
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = 5 * p.s;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x - 8, y - 14);
          ctx.lineTo(x - 14, y - 44 - jump * 0.3);
          ctx.moveTo(x + 8, y - 14);
          ctx.lineTo(x + 14, y - 44 - jump * 0.3);
          ctx.stroke();
        }
      }
      // lâmpadas penduradas
      for (const lx of [220, 640, 1060]) {
        const sw = Math.sin(t * 1.2 + lx) * 0.06;
        const ex = lx + Math.sin(sw) * 110, ey = Math.cos(sw) * 110;
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.moveTo(ex - 24, ey + 14);
        ctx.lineTo(ex + 24, ey + 14);
        ctx.lineTo(ex + 10, ey);
        ctx.lineTo(ex - 10, ey);
        ctx.fill();
        BG.cone(ctx, ex, ey + 14, sw, 560, 0.35, '#fff2c0', 0.16);
        BG.glow(ctx, ex, ey + 16, 50, '#fff2c0', 0.7);
      }
      // holofotes varrendo
      BG.cone(ctx, 60, -20, 0.55 + Math.sin(t * 0.8) * 0.35, 900, 0.09, '#00e5ff', 0.18);
      BG.cone(ctx, 1220, -20, -0.55 + Math.sin(t * 0.7 + 1) * 0.35, 900, 0.09, '#ff2d95', 0.18);
      // vapor saindo do chão
      st.steamT += 1 / 60;
      if (st.steamT > 0.09) {
        st.steamT = 0;
        for (const vx of [110, 1170]) {
          st.steam.spawn({ x: vx + (Math.random() - 0.5) * 20, y: 590, vx: (Math.random() - 0.5) * 20, vy: -60 - Math.random() * 40, life: 2.2, size: 12, grow: 3, color: 'rgba(220,220,235,0.12)', shape: 'smoke' });
        }
      }
      st.steam.update(1 / 60);
      st.steam.render(ctx);
      for (const vx of [110, 1170]) {
        ctx.fillStyle = '#222';
        ctx.fillRect(vx - 30, 584, 60, 8);
      }
    },

    front(ctx) {
      BG.vignette(ctx, 0.6);
    }
  };
})();
