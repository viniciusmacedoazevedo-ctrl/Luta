/* Arena — Escola: pátio coberto com armários, quadro-negro, janelas,
   relógio de parede, bandeirolas e alunos torcendo ao fundo. */
(function () {
  const BG = VF.BG;

  function layer() {
    const rnd = BG.rng(33);
    return BG.layer(1280, 720, (c) => {
      // parede
      const g = c.createLinearGradient(0, 0, 0, 560);
      g.addColorStop(0, '#f3e3b9');
      g.addColorStop(1, '#e2c98f');
      c.fillStyle = g;
      c.fillRect(0, 0, 1280, 560);
      c.fillStyle = '#2e7d32';
      c.fillRect(0, 380, 1280, 180);
      c.fillStyle = '#1b5e20';
      c.fillRect(0, 376, 1280, 8);
      // janelas com céu
      for (let i = 0; i < 4; i++) {
        const x = 60 + i * 320;
        c.fillStyle = '#90caf9';
        c.fillRect(x, 70, 200, 150);
        c.fillStyle = 'rgba(255,255,255,0.5)';
        c.beginPath(); c.moveTo(x + 20, 210); c.lineTo(x + 80, 80); c.lineTo(x + 110, 80); c.lineTo(x + 50, 210); c.fill();
        c.strokeStyle = '#6d4c41';
        c.lineWidth = 8;
        c.strokeRect(x, 70, 200, 150);
        c.beginPath(); c.moveTo(x + 100, 70); c.lineTo(x + 100, 220); c.moveTo(x, 145); c.lineTo(x + 200, 145); c.stroke();
      }
      // quadro-negro
      c.fillStyle = '#5d4037';
      c.fillRect(420, 250, 440, 190);
      c.fillStyle = '#263c2e';
      c.fillRect(432, 262, 416, 166);
      c.font = "34px 'Bangers', Impact, sans-serif";
      c.fillStyle = 'rgba(255,255,255,0.85)';
      c.fillText('PROVA HOJE!', 470, 310);
      c.font = '26px monospace';
      c.fillText('x² + 2x + 1 = 0', 470, 355);
      c.fillText('E = mc²', 470, 395);
      c.fillStyle = '#eee';
      c.fillRect(760, 404, 30, 8);
      // armários
      for (let i = 0; i < 9; i++) {
        const side = i < 4 ? 20 + i * 90 : 900 + (i - 4) * 76;
        if (i >= 4 && side > 1260) break;
        const w = i < 4 ? 84 : 70;
        c.fillStyle = ['#1e88e5', '#e53935', '#fdd835', '#43a047'][i % 4];
        c.fillRect(side, 260, w, 300);
        c.fillStyle = 'rgba(0,0,0,0.25)';
        c.fillRect(side + w - 6, 260, 6, 300);
        c.fillStyle = 'rgba(0,0,0,0.35)';
        for (let k = 0; k < 4; k++) c.fillRect(side + 12, 285 + k * 10, w - 24, 4);
        c.fillStyle = '#cfd8dc';
        c.fillRect(side + w - 20, 400, 8, 22);
      }
      // piso quadriculado
      for (let y = 560; y < 720; y += 40) {
        for (let x = 0; x < 1280; x += 40) {
          c.fillStyle = ((x + y) / 40) % 2 ? '#eceff1' : '#b0bec5';
          c.fillRect(x, y, 40, 40);
        }
      }
      c.fillStyle = 'rgba(0,0,0,0.12)';
      c.fillRect(0, 560, 1280, 8);
    });
  }

  VF.Backgrounds.escola = {
    create() {
      const rnd = BG.rng(8);
      const kids = [];
      for (let i = 0; i < 16; i++) kids.push({ x: 440 + i * 26, p: rnd() * 6, c: ['#e53935', '#1e88e5', '#fdd835', '#8e24aa', '#43a047'][i % 5] });
      return { layer: layer(), kids, paper: new VF.ParticleSystem(40), pt: 0 };
    },
    draw(ctx, t, st) {
      ctx.drawImage(st.layer, 0, 0);
      // relógio de parede
      const cx = 640, cy = 140;
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#212121'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(cx, cy, 44, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(t - 1.57) * 34, cy + Math.sin(t - 1.57) * 34); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(t / 12 - 1.57) * 22, cy + Math.sin(t / 12 - 1.57) * 22); ctx.stroke();
      // bandeirolas
      for (let i = 0; i < 20; i++) {
        const x = 20 + i * 64, y = 40 + Math.sin(i * 0.5) * 6;
        ctx.fillStyle = ['#e53935', '#fdd835', '#1e88e5', '#43a047'][i % 4];
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 40, y); ctx.lineTo(x + 20 + Math.sin(t * 3 + i) * 4, y + 30); ctx.fill();
      }
      // alunos (silhuetas) torcendo em frente ao quadro
      for (const k of st.kids) {
        const j = Math.max(0, Math.sin(t * 7 + k.p)) * 8;
        ctx.fillStyle = k.c;
        ctx.beginPath(); ctx.ellipse(k.x, 540 - j, 11, 22, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#6d4c41';
        ctx.beginPath(); ctx.arc(k.x, 512 - j, 9, 0, Math.PI * 2); ctx.fill();
      }
      // folhas de papel voando
      st.pt += 1 / 60;
      if (st.pt > 0.5) {
        st.pt = 0;
        st.paper.spawn({ x: -20, y: 150 + Math.random() * 250, vx: 90 + Math.random() * 80, vy: 20, life: 12, size: 7, color: '#ffffff', shape: 'rect', spin: 3, fade: false });
      }
      st.paper.update(1 / 60);
      st.paper.render(ctx);
    },
    front(ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 720);
      g.addColorStop(0, 'rgba(255,230,160,0.1)');
      g.addColorStop(1, 'rgba(0,0,0,0.1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1280, 720);
      BG.vignette(ctx, 0.35);
    }
  };
})();
