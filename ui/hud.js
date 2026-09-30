/* HUD da luta (desenhado no canvas): vida, SPECIAL, timer, rounds e combos */
(function () {
  const C = VF.CONFIG;
  const W = 1280;
  const FONT = "'Bangers', Impact, sans-serif";

  function skewRect(ctx, x, y, w, h, skew) {
    ctx.beginPath();
    ctx.moveTo(x + skew, y);
    ctx.lineTo(x + w + skew, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
  }

  function text(ctx, str, x, y, size, fill, align, stroke) {
    ctx.font = `${size}px ${FONT}`;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(3, size / 6);
    ctx.strokeStyle = stroke || '#120a1c';
    ctx.strokeText(str, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(str, x, y);
  }

  VF.HUD = {
    draw(ctx, s) {
      const [a, b] = s.fighters;
      this.side(ctx, a, 0, s);
      this.side(ctx, b, 1, s);
      this.timer(ctx, s);
      this.combo(ctx, a, 0);
      this.combo(ctx, b, 1);
    },

    side(ctx, f, side, s) {
      const X = (x, w) => (side ? W - x - (w || 0) : x);
      const t = s.t;
      // retrato
      const cx = X(58), cy = 62;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 46, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(cx, cy - 10, 5, cx, cy, 46);
      g.addColorStop(0, f.def.color);
      g.addColorStop(1, '#1a0f2e');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.clip();
      let expr = 'normal';
      if (f.hp <= 0) expr = 'ko';
      else if (f.flash > 0 || f.state === 'hurt' || f.state === 'knockdown') expr = 'hurt';
      else if (f.state === 'victory') expr = 'happy';
      else if (f.specialReady || f.state === 'special') expr = 'angry';
      VF.Rig.portrait(ctx, f.skin, cx, cy + 14, 104, { facing: side ? -1 : 1, colors: f.colors, expr, fighter: f, t: f.anim });
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx, cy, 46, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#120a1c';
      ctx.stroke();

      // barra de vida
      const bx = 112, by = 26, bw = 440, bh = 32;
      const sk = side ? -12 : 12;
      ctx.fillStyle = '#120a1c';
      skewRect(ctx, X(bx - 5, bw + 10), by - 5, bw + 10, bh + 10, sk);
      ctx.fill();
      ctx.fillStyle = '#3a1020';
      skewRect(ctx, X(bx, bw), by, bw, bh, sk);
      ctx.fill();
      const lagW = (bw * f.dispHp) / C.MAX_HP;
      const hpW = (bw * f.hp) / C.MAX_HP;
      ctx.fillStyle = '#ffffff';
      skewRect(ctx, X(bx, lagW), by, lagW, bh, sk);
      ctx.fill();
      const pct = f.hp / C.MAX_HP;
      const hg = ctx.createLinearGradient(0, by, 0, by + bh);
      if (pct > 0.5) { hg.addColorStop(0, '#b6ff5c'); hg.addColorStop(1, '#2fae3a'); }
      else if (pct > 0.25) { hg.addColorStop(0, '#fff176'); hg.addColorStop(1, '#f9a825'); }
      else { hg.addColorStop(0, '#ff8a80'); hg.addColorStop(1, '#d50000'); }
      ctx.fillStyle = hg;
      if (hpW > 0) {
        skewRect(ctx, X(bx, hpW), by, hpW, bh, sk);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        skewRect(ctx, X(bx, hpW), by + 3, hpW, 7, sk * 0.2);
        ctx.fill();
      }
      if (pct <= 0.25 && pct > 0 && Math.sin(t * 12) > 0) {
        ctx.strokeStyle = '#ff5252';
        ctx.lineWidth = 3;
        skewRect(ctx, X(bx, bw), by, bw, bh, sk);
        ctx.stroke();
      }

      // barra SPECIAL
      const sx = 112, sy = 68, sw = 320, sh = 16;
      const ready = f.specialReady;
      ctx.fillStyle = '#120a1c';
      skewRect(ctx, X(sx - 4, sw + 8), sy - 4, sw + 8, sh + 8, sk * 0.5);
      ctx.fill();
      ctx.fillStyle = '#1d2a4a';
      skewRect(ctx, X(sx, sw), sy, sw, sh, sk * 0.5);
      ctx.fill();
      const spW = (sw * f.special) / C.SPECIAL_MAX;
      if (spW > 0) {
        const sg = ctx.createLinearGradient(X(sx, sw), 0, X(sx, sw) + sw, 0);
        if (ready) {
          const hue = (t * 360) % 360;
          sg.addColorStop(0, `hsl(${hue},100%,60%)`);
          sg.addColorStop(1, `hsl(${(hue + 120) % 360},100%,60%)`);
        } else {
          sg.addColorStop(0, '#00b0ff');
          sg.addColorStop(1, '#00e5ff');
        }
        ctx.fillStyle = sg;
        skewRect(ctx, X(sx, spW), sy, spW, sh, sk * 0.5);
        ctx.fill();
      }
      if (ready) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.35 + Math.sin(t * 10) * 0.25;
        ctx.fillStyle = '#ffffff';
        skewRect(ctx, X(sx, sw), sy, sw, sh, sk * 0.5);
        ctx.fill();
        ctx.restore();
      }
      text(ctx, ready ? 'SPECIAL PRONTO!' : 'SPECIAL', side ? W - sx - 6 : sx + 6, sy + 14, 16, ready ? '#fff' : '#9ad8ff', side ? 'right' : 'left');
      if (ready && s.keyHint && s.keyHint[side]) {
        text(ctx, s.keyHint[side], side ? W - sx - sw - 18 : sx + sw + 18, sy + 15, 18, '#ffd600', side ? 'right' : 'left');
      }

      // nome + marcadores de rounds
      const tag = f.label;
      text(ctx, f.def.name, side ? W - 112 : 112, 124, 30, '#ffffff', side ? 'right' : 'left');
      ctx.font = `30px ${FONT}`;
      const nameW = ctx.measureText(f.def.name).width;
      text(ctx, tag, side ? W - 112 - nameW - 10 : 112 + nameW + 10, 122, 18, f.isCPU ? '#ff8a80' : '#ffd600', side ? 'right' : 'left');
      for (let i = 0; i < C.WINS_NEEDED; i++) {
        const mx = side ? W - 540 + i * 30 : 540 - i * 30, my = 112;
        ctx.beginPath();
        ctx.arc(mx, my, 10, 0, Math.PI * 2);
        ctx.fillStyle = s.match.wins[side] > i ? '#ffd600' : '#2a1d3d';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#120a1c';
        ctx.stroke();
        if (s.match.wins[side] > i) {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(mx - 3, my - 3, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },

    timer(ctx, s) {
      const x = 640, y = 16;
      ctx.fillStyle = '#120a1c';
      ctx.beginPath();
      ctx.moveTo(x - 58, y);
      ctx.lineTo(x + 58, y);
      ctx.lineTo(x + 48, y + 92);
      ctx.lineTo(x - 48, y + 92);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffd600';
      ctx.stroke();
      const secs = Math.max(0, Math.ceil(s.timeLeft));
      const low = secs <= 10 && s.phase === 'fight';
      const pulse = low ? 1 + Math.max(0, Math.sin(s.t * 12)) * 0.12 : 1;
      text(ctx, 'TIME', x, y + 22, 18, '#ffd600', 'center');
      ctx.save();
      ctx.translate(x, y + 80);
      ctx.scale(pulse, pulse);
      text(ctx, String(secs).padStart(2, '0'), 0, 0, 60, low ? '#ff5252' : '#ffffff', 'center');
      ctx.restore();
      text(ctx, s.match.roundLabel, x, y + 122, 20, '#ffffff', 'center');
    },

    combo(ctx, f, side) {
      if (f.comboShow <= 0 || f.combo < 2) return;
      const x = side ? 1110 : 170, y = 270;
      const n = f.combo;
      let col = '#ffffff', col2 = '#9ad8ff';
      if (n >= 10) { const h = (performance.now() / 4) % 360; col = `hsl(${h},100%,65%)`; col2 = '#ff1744'; }
      else if (n >= 5) { col = '#ffab40'; col2 = '#ff3d00'; }
      else if (n >= 3) { col = '#ffe57f'; col2 = '#ffab00'; }
      const pop = 1 + Math.max(0, f.comboPop) * 0.5 + (n >= 10 ? 0.25 : n >= 5 ? 0.12 : 0);
      const alpha = Math.min(1, f.comboShow / 0.4);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(side ? 0.08 : -0.08);
      ctx.scale(pop, pop);
      text(ctx, n >= 3 ? 'COMBO' : 'HITS', 0, -40, 26, col2, 'center');
      text(ctx, 'x' + n, 0, 20, 64, col, 'center');
      if (n >= 10) text(ctx, 'INCRÍVEL!', 0, 52, 24, '#ffffff', 'center');
      else if (n >= 5) text(ctx, 'BRUTAL!', 0, 52, 22, '#ffffff', 'center');
      ctx.restore();
    }
  };
})();
