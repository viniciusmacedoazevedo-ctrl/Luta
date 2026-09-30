/* EFEITOS GRANDES (cinemáticos) usados por especiais e ultimates.
   VF.BigFX.spawn(world, tipo, x, y, opções) cria um efeito que dura "dur" segundos.
   Cada tipo tem um desenho próprio para que nenhum poder pareça igual ao outro. */
(function () {
  const PI = Math.PI;
  const R = (a, b) => a + Math.random() * (b - a);
  const glow = (ctx, x, y, r, color, a) => VF.BG.glow(ctx, x, y, r, color, a);
  const FONT = "'Bangers', Impact, sans-serif";

  function txt(ctx, s, x, y, size, fill, stroke) {
    ctx.font = `${size}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(4, size / 7);
    ctx.strokeStyle = stroke || '#120a1c';
    ctx.strokeText(s, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(s, x, y);
  }

  const TYPES = {
    // explosão de energia clássica
    explosion(ctx, e, k) {
      const r = 40 + k * (e.size || 320);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, r);
      g.addColorStop(0, `rgba(255,255,255,${1 - k})`);
      g.addColorStop(0.35, VF.M.hexA(e.color, 0.8 * (1 - k)));
      g.addColorStop(1, VF.M.hexA(e.color, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(e.x, e.y, r, 0, PI * 2); ctx.fill();
      ctx.strokeStyle = VF.M.hexA(e.color2 || '#ffffff', 1 - k);
      ctx.lineWidth = 10 * (1 - k);
      ctx.beginPath(); ctx.arc(e.x, e.y, r * 0.8, 0, PI * 2); ctx.stroke();
      ctx.restore();
    },
    // raio gigante horizontal
    beam(ctx, e, k) {
      const h = (e.h || 140) * Math.sin(Math.min(1, k * 1.3) * PI);
      const dir = e.dir || 1;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(0, e.y - h / 2, 0, e.y + h / 2);
      g.addColorStop(0, VF.M.hexA(e.color, 0));
      g.addColorStop(0.3, VF.M.hexA(e.color, 0.8));
      g.addColorStop(0.5, 'rgba(255,255,255,1)');
      g.addColorStop(0.7, VF.M.hexA(e.color, 0.8));
      g.addColorStop(1, VF.M.hexA(e.color, 0));
      ctx.fillStyle = g;
      const x0 = e.x, x1 = dir > 0 ? 1600 : -300;
      ctx.fillRect(Math.min(x0, x1), e.y - h / 2, Math.abs(x1 - x0), h);
      ctx.restore();
    },
    // cortes cruzados de velocidade
    slashes(ctx, e, k) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const n = e.n || 10;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * PI + (e.seed || 0);
        const len = 260 * Math.min(1, k * 3);
        ctx.strokeStyle = VF.M.hexA(i % 2 ? '#ffffff' : e.color, 1 - k);
        ctx.lineWidth = 6 * (1 - k) + 1;
        ctx.beginPath();
        ctx.moveTo(e.x - Math.cos(a) * len, e.y - Math.sin(a) * len);
        ctx.lineTo(e.x + Math.cos(a) * len, e.y + Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.restore();
    },
    // coluna de luz vinda do céu
    pillar(ctx, e, k) {
      const w = (e.w || 160) * Math.sin(Math.min(1, k * 1.2) * PI);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(e.x - w / 2, 0, e.x + w / 2, 0);
      g.addColorStop(0, VF.M.hexA(e.color, 0));
      g.addColorStop(0.5, 'rgba(255,255,240,0.95)');
      g.addColorStop(1, VF.M.hexA(e.color, 0));
      ctx.fillStyle = g;
      ctx.fillRect(e.x - w / 2, -200, w, e.y + 220);
      ctx.restore();
    },
    // raio elétrico
    bolt(ctx, e, k) {
      if (k > 0.7 && Math.random() < 0.5) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let pass = 0; pass < 2; pass++) {
        ctx.strokeStyle = pass ? '#ffffff' : e.color;
        ctx.lineWidth = pass ? 4 : 14;
        ctx.beginPath();
        let x = e.x + R(-10, 10), y = -60;
        ctx.moveTo(x, y);
        while (y < e.y) {
          y += R(40, 80);
          x = e.x + R(-35, 35);
          ctx.lineTo(x, Math.min(y, e.y));
        }
        ctx.stroke();
      }
      glow(ctx, e.x, e.y, 160, e.color, 0.6 * (1 - k));
      ctx.restore();
    },
    // onda enorme que atravessa a arena
    megawave(ctx, e, k) {
      const dir = e.dir || 1;
      const x = e.x + dir * k * 1500;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = VF.M.hexA(i % 2 ? e.color2 || '#ffd400' : e.color, 0.8 - i * 0.12);
        ctx.lineWidth = 26 - i * 4;
        ctx.beginPath();
        ctx.moveTo(x - dir * (i * 40 + 30), e.y - 330);
        ctx.quadraticCurveTo(x + dir * (100 - i * 30), e.y - 150, x - dir * (i * 40 + 30), e.y + 20);
        ctx.stroke();
      }
      ctx.restore();
    },
    // tornado gigante
    tornado(ctx, e, k) {
      const h = e.h || 520, x = e.x, y = e.y;
      ctx.save();
      for (let i = 0; i < 14; i++) {
        const yy = y - (i / 14) * h;
        const w = 30 + (i / 14) * (e.w || 220);
        const off = Math.sin(e.t * 12 + i * 0.7) * 16;
        ctx.strokeStyle = VF.M.hexA(i % 2 ? e.color : e.color2 || '#e1bee7', 0.75 * Math.min(1, (1 - k) * 3));
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.ellipse(x + off, yy, w / 2, 10 + i, 0, e.t * 8 + i, e.t * 8 + i + PI * 1.4);
        ctx.stroke();
      }
      glow(ctx, x, y - h / 2, 260, e.color, 0.25);
      ctx.restore();
    },
    // bola de futebol gigante
    ball(ctx, e, k) {
      const r = e.r || 110;
      const x = e.x0 + (e.x - e.x0) * Math.min(1, k * 2.2);
      const y = e.y - Math.sin(Math.min(1, k * 2.2) * PI) * 120;
      ctx.save();
      glow(ctx, x, y, r * 2, e.color, 0.4);
      ctx.translate(x, y);
      ctx.rotate(e.t * 12);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#120a1c';
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#222';
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * PI * 2;
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          const b = (j / 5) * PI * 2;
          ctx.lineTo(Math.cos(a) * r * 0.6 + Math.cos(b) * r * 0.22, Math.sin(a) * r * 0.6 + Math.sin(b) * r * 0.22);
        }
        ctx.fill();
      }
      ctx.restore();
    },
    // chuva de objetos (perucas, luzes, flechas, notas...)
    rain(ctx, e, k) {
      ctx.save();
      for (const it of e.items) {
        const y = it.y0 + (k * 1.6 - it.d) * 1400;
        if (y < -80 || y > e.y + 40) continue;
        ctx.save();
        ctx.translate(it.x, y);
        ctx.rotate(it.r + e.t * it.s);
        VF.BigFX.icon(ctx, e.icon, it.size, e.color);
        ctx.restore();
      }
      ctx.restore();
    },
    // martelo gigante (Decisão Final)
    gavel(ctx, e, k) {
      const a = k < 0.4 ? -1.4 + (k / 0.4) * 1.4 : 0;
      ctx.save();
      ctx.translate(e.x + 120, e.y - 420);
      ctx.rotate(a);
      ctx.fillStyle = '#5d4037';
      ctx.strokeStyle = '#120a1c';
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.rect(-12, 0, 24, 330); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath(); ctx.rect(-140, 300, 280, 110); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffd54f';
      ctx.fillRect(-140, 340, 280, 14);
      ctx.restore();
      if (k > 0.4) {
        const kk = (k - 0.4) / 0.6;
        glow(ctx, e.x, e.y, 300 * (1 - kk) + 60, e.color, 0.6 * (1 - kk));
      }
    },
    // fórmulas / números espiralando
    formulas(ctx, e, k) {
      const list = e.list || ['E=mc²', 'π', '∑', '√2', 'x²', '∞', '∫dx', 'a²+b²', 'Δ', '7×8'];
      ctx.save();
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * PI * 2 + e.t * 3;
        const r = (1 - k) * 280 + 30;
        txt(ctx, list[i % list.length], e.x + Math.cos(a) * r, e.y + Math.sin(a) * r * 0.6, 34, i % 2 ? '#ffffff' : e.color);
      }
      ctx.restore();
    },
    // tempestade digital
    digital(ctx, e, k) {
      ctx.save();
      ctx.globalAlpha = 1 - k;
      ctx.fillStyle = 'rgba(0,30,10,0.35)';
      ctx.fillRect(-200, -200, 1700, 1200);
      ctx.font = '22px monospace';
      ctx.fillStyle = e.color;
      for (let i = 0; i < 40; i++) {
        const x = (i * 37) % 1300;
        const y = ((e.t * 600 + i * 97) % 900) - 100;
        ctx.fillText(Math.random() < 0.5 ? '1' : '0', x, y);
      }
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        ctx.strokeRect(e.x - 60 - i * 30 * k * 3, e.y - 60 - i * 30 * k * 3, 120 + i * 60 * k * 3, 120 + i * 60 * k * 3);
      }
      ctx.restore();
    },
    // anéis sonoros (coral)
    sound(ctx, e, k) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 6; i++) {
        const r = ((k * 900 + i * 150) % 900);
        ctx.strokeStyle = VF.M.hexA(e.color, Math.max(0, 0.8 - r / 900));
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, -PI / 2.2, PI / 2.2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, PI - PI / 2.2, PI + PI / 2.2);
        ctx.stroke();
      }
      ctx.restore();
      for (let i = 0; i < 6; i++) {
        txt(ctx, i % 2 ? '♪' : '♫', e.x + Math.cos(e.t * 2 + i) * 200 * k, e.y - 100 - Math.sin(e.t * 3 + i) * 120 * k, 40, '#ffffff');
      }
    },
    // corações / brilhos
    hearts(ctx, e, k) {
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * PI * 2;
        const r = 40 + k * 300;
        ctx.save();
        ctx.globalAlpha = 1 - k;
        ctx.translate(e.x + Math.cos(a) * r, e.y + Math.sin(a) * r * 0.7);
        VF.BigFX.icon(ctx, e.icon || 'heart', 26, e.color);
        ctx.restore();
      }
    },
    // relógio / tempo
    clock(ctx, e, k) {
      ctx.save();
      ctx.globalAlpha = 0.8 * (1 - k);
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 8;
      const r = 90 + k * 60;
      ctx.beginPath(); ctx.arc(e.x, e.y, r, 0, PI * 2); ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * PI * 2;
        ctx.beginPath(); ctx.moveTo(e.x + Math.cos(a) * r * 0.85, e.y + Math.sin(a) * r * 0.85); ctx.lineTo(e.x + Math.cos(a) * r, e.y + Math.sin(a) * r); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(e.t * 9) * r * 0.8, e.y + Math.sin(e.t * 9) * r * 0.8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(e.t * 1.5) * r * 0.5, e.y + Math.sin(e.t * 1.5) * r * 0.5); ctx.stroke();
      ctx.restore();
    },
    // texto gigante (E = MC², DECISÃO FINAL...)
    bigtext(ctx, e, k) {
      const s = k < 0.15 ? k / 0.15 : 1;
      ctx.save();
      ctx.globalAlpha = k > 0.75 ? (1 - k) / 0.25 : 1;
      ctx.translate(e.x, e.y);
      ctx.scale(VF.M.easeOutBack(s), VF.M.easeOutBack(s));
      txt(ctx, e.text, 0, 0, e.size || 110, e.color, '#120a1c');
      ctx.restore();
    },
    // estilhaços / confete colorido
    rainbow(ctx, e, k) {
      const cols = ['#ff1744', '#ff9100', '#ffd600', '#00e676', '#00b0ff', '#d500f9'];
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < cols.length; i++) {
        ctx.strokeStyle = VF.M.hexA(cols[i], 1 - k);
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.arc(e.x, e.y + 60, 120 + i * 18 + k * 120, PI, 0);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  VF.BigFX = {
    TYPES,
    spawn(world, type, x, y, o) {
      const e = Object.assign({ type, x, y, t: 0, dur: 0.8, color: '#ffffff' }, o || {});
      if (type === 'rain') {
        e.items = [];
        const n = o.n || 18;
        for (let i = 0; i < n; i++) {
          e.items.push({ x: (o.cx || x) + R(-o.spread || -400, o.spread || 400), y0: -100 - R(0, 300), d: R(0, 0.6), r: R(0, 6), s: R(-4, 4), size: R(26, 44) });
        }
      }
      if (type === 'ball') e.x0 = o.x0 == null ? x - 400 : o.x0;
      world.bigfx.push(e);
      return e;
    },
    update(world, dt) {
      for (const e of world.bigfx) e.t += dt;
      world.bigfx = world.bigfx.filter((e) => e.t < e.dur);
    },
    render(ctx, world) {
      for (const e of world.bigfx) {
        const fn = TYPES[e.type];
        if (fn) fn(ctx, e, Math.min(1, e.t / e.dur));
      }
    },
    /* pequenos ícones desenhados (sem imagens externas) */
    icon(ctx, kind, s, color) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#120a1c';
      switch (kind) {
        case 'heart':
          ctx.fillStyle = color || '#ff4081';
          ctx.beginPath();
          ctx.moveTo(0, s * 0.35);
          ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.4, -s, 0, -s * 0.4);
          ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.3, 0, s * 0.35);
          ctx.fill(); ctx.stroke();
          break;
        case 'wig':
          ctx.fillStyle = color || '#6d4c41';
          ctx.beginPath();
          ctx.ellipse(0, 0, s, s * 0.6, 0, PI, 0);
          ctx.lineTo(s, s * 0.35);
          ctx.lineTo(-s, s * 0.35);
          ctx.closePath();
          ctx.fill(); ctx.stroke();
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.beginPath(); ctx.arc(-s * 0.2, -s * 0.1, s * 0.5, PI * 1.2, PI * 1.6); ctx.stroke();
          break;
        case 'star':
          ctx.fillStyle = color || '#ffd600';
          VF.drawStar(ctx, s * 0.7);
          ctx.fill(); ctx.stroke();
          break;
        case 'light':
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          VF.BG.glow(ctx, 0, 0, s * 1.4, color || '#fff59d', 0.9);
          ctx.restore();
          break;
        case 'arrow':
          ctx.rotate(PI / 2);
          ctx.fillStyle = color || '#8bc34a';
          ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(-s * 0.6, -s * 0.3); ctx.lineTo(-s * 0.3, 0); ctx.lineTo(-s * 0.6, s * 0.3); ctx.closePath();
          ctx.fill(); ctx.stroke();
          break;
        case 'note':
          txt(ctx, '♪', 0, 0, s * 1.6, color || '#ffffff');
          break;
        case 'rose':
          ctx.fillStyle = color || '#d81b60';
          ctx.beginPath(); ctx.arc(0, 0, s * 0.5, 0, PI * 2); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.beginPath(); ctx.arc(0, 0, s * 0.25, 0, PI * 1.5); ctx.stroke();
          break;
        case 'dumbbell':
          ctx.fillStyle = '#424242';
          ctx.fillRect(-s, -s * 0.12, s * 2, s * 0.24);
          ctx.fillStyle = color || '#ff6d00';
          ctx.fillRect(-s * 1.1, -s * 0.5, s * 0.35, s);
          ctx.fillRect(s * 0.75, -s * 0.5, s * 0.35, s);
          break;
        default:
          ctx.fillStyle = color || '#fff';
          ctx.beginPath(); ctx.arc(0, 0, s * 0.5, 0, PI * 2); ctx.fill();
      }
    }
  };
})();
