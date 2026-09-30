/* HUD da luta (canvas): retrato, nome, VIDA, SPECIAL, ULTIMATE, timer,
   rounds vencidos e contador de COMBO (cresce e muda de cor com o combo). */
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
    ctx.strokeStyle = stroke || '#0b0614';
    ctx.strokeText(str, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(str, x, y);
  }

  function bar(ctx, X, x, y, w, h, sk, value, max, fillFn, lag) {
    ctx.fillStyle = '#0b0614';
    skewRect(ctx, X(x - 4, w + 8), y - 4, w + 8, h + 8, sk);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    skewRect(ctx, X(x, w), y, w, h, sk);
    ctx.fill();
    if (lag != null) {
      const lw = (w * lag) / max;
      ctx.fillStyle = '#ffffff';
      skewRect(ctx, X(x, lw), y, lw, h, sk);
      ctx.fill();
    }
    const vw = (w * value) / max;
    if (vw > 0) {
      ctx.fillStyle = fillFn(X(x, w), w);
      skewRect(ctx, X(x, vw), y, vw, h, sk);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      skewRect(ctx, X(x, vw), y + 2, vw, Math.max(2, h * 0.22), sk * 0.2);
      ctx.fill();
    }
  }

  VF.HUD = {
    draw(ctx, s) {
      const [a, b] = s.fighters;
      // faixa escura atrás do HUD para leitura
      const g = ctx.createLinearGradient(0, 0, 0, 140);
      g.addColorStop(0, 'rgba(5,2,12,0.75)');
      g.addColorStop(1, 'rgba(5,2,12,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, 140);
      this.side(ctx, a, 0, s);
      this.side(ctx, b, 1, s);
      this.timer(ctx, s);
      this.combo(ctx, a, 0);
      this.combo(ctx, b, 1);
    },

    side(ctx, f, side, s) {
      const X = (x, w) => (side ? W - x - (w || 0) : x);
      const t = s.t;
      const col = f.def.color;
      // retrato em moldura angulada
      const px = X(14, 92), py = 12;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(px + 10, py); ctx.lineTo(px + 92, py); ctx.lineTo(px + 82, py + 92); ctx.lineTo(px, py + 92); ctx.closePath();
      const pg = ctx.createLinearGradient(0, py, 0, py + 92);
      pg.addColorStop(0, col);
      pg.addColorStop(1, '#140a24');
      ctx.fillStyle = pg;
      ctx.fill();
      ctx.save();
      ctx.clip();
      let expr = 'normal';
      if (f.hp <= 0) expr = 'ko';
      else if (f.flash > 0 || ['hurt', 'knockdown', 'bound', 'dazed'].includes(f.state)) expr = 'hurt';
      else if (f.state === 'victory') expr = 'happy';
      else if (f.specialReady || f.ultimateReady || f.state === 'special' || f.state === 'ultimate') expr = 'angry';
      VF.Rig.portrait(ctx, f.skin, px + 46, py + 60, 110, { facing: side ? -1 : 1, colors: f.colors, expr, fighter: f, t: f.anim });
      ctx.restore();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();

      // nome + tag
      const nx = side ? W - 122 : 122;
      const name = f.def.short || f.def.name;
      text(ctx, name, nx, 32, 26, '#ffffff', side ? 'right' : 'left');
      ctx.font = `26px ${FONT}`;
      const nw = ctx.measureText(name).width;
      text(ctx, f.label === 'CPU' ? 'CPU' : f.label === 'P2' ? 'PLAYER 2' : 'PLAYER 1', side ? nx - nw - 10 : nx + nw + 10, 30, 15, f.isCPU ? '#ff8a80' : '#ffd600', side ? 'right' : 'left');

      // VIDA
      const sk = side ? -12 : 12;
      const pct = f.hp / C.MAX_HP;
      bar(ctx, X, 122, 40, 430, 26, sk, f.hp, C.MAX_HP, () => {
        const hg = ctx.createLinearGradient(0, 40, 0, 66);
        if (pct > 0.5) { hg.addColorStop(0, '#c6ff6b'); hg.addColorStop(1, '#27a844'); }
        else if (pct > 0.25) { hg.addColorStop(0, '#fff176'); hg.addColorStop(1, '#f9a825'); }
        else { hg.addColorStop(0, '#ff8a80'); hg.addColorStop(1, '#d50000'); }
        return hg;
      }, f.dispHp);
      if (pct <= 0.25 && pct > 0 && Math.sin(t * 12) > 0) {
        ctx.strokeStyle = '#ff5252';
        ctx.lineWidth = 3;
        skewRect(ctx, X(122, 430), 40, 430, 26, sk);
        ctx.stroke();
      }

      // SPECIAL
      const spReady = f.specialReady;
      bar(ctx, X, 122, 74, 300, 12, sk * 0.5, f.special, C.SPECIAL_MAX, (x0, w) => {
        const sg = ctx.createLinearGradient(x0, 0, x0 + w, 0);
        if (spReady) { const h = (t * 360) % 360; sg.addColorStop(0, `hsl(${h},100%,60%)`); sg.addColorStop(1, `hsl(${(h + 120) % 360},100%,60%)`); }
        else { sg.addColorStop(0, '#00b0ff'); sg.addColorStop(1, '#00e5ff'); }
        return sg;
      });
      text(ctx, spReady ? 'SPECIAL PRONTO!' : 'SPECIAL', side ? W - 430 : 430, 86, 14, spReady ? '#ffffff' : '#9ad8ff', side ? 'left' : 'right');

      // ULTIMATE
      const ulReady = f.ultimateReady;
      bar(ctx, X, 122, 94, 240, 10, sk * 0.4, f.ultimate, C.ULTIMATE_MAX, (x0, w) => {
        const ug = ctx.createLinearGradient(x0, 0, x0 + w, 0);
        ug.addColorStop(0, '#ff6d00');
        ug.addColorStop(1, ulReady ? (Math.sin(t * 14) > 0 ? '#ffffff' : '#ffd600') : '#ffd600');
        return ug;
      });
      text(ctx, ulReady ? 'ULTIMATE PRONTA!' : 'ULTIMATE', side ? W - 370 : 370, 104, 13, ulReady ? '#ffd600' : '#ffcc80', side ? 'left' : 'right');
      const hints = s.keyHint && s.keyHint[side];
      if (hints) {
        if (spReady && hints.special) text(ctx, hints.special, side ? W - 470 : 470, 86, 15, '#ffd600', side ? 'right' : 'left');
        if (ulReady && hints.ultimate) text(ctx, hints.ultimate, side ? W - 400 : 400, 105, 15, '#ffd600', side ? 'right' : 'left');
      }

      // rounds vencidos (estrelas perto do timer)
      for (let i = 0; i < C.WINS_NEEDED; i++) {
        const mx = side ? W - 580 + i * 26 : 580 - i * 26, my = 58;
        ctx.save();
        ctx.translate(mx, my);
        ctx.fillStyle = s.match.wins[side] > i ? '#ffd600' : '#2a1d3d';
        ctx.strokeStyle = '#0b0614';
        ctx.lineWidth = 3;
        VF.drawStar(ctx, 11);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    },

    timer(ctx, s) {
      const x = 640, y = 10;
      ctx.fillStyle = '#0b0614';
      ctx.beginPath();
      ctx.moveTo(x - 56, y); ctx.lineTo(x + 56, y); ctx.lineTo(x + 44, y + 88); ctx.lineTo(x - 44, y + 88);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffd600';
      ctx.stroke();
      const secs = Math.max(0, Math.ceil(s.timeLeft));
      const low = secs <= 10 && s.phase === 'fight';
      const pulse = low ? 1 + Math.max(0, Math.sin(s.t * 12)) * 0.12 : 1;
      text(ctx, 'TIME', x, y + 20, 16, '#ffd600', 'center');
      ctx.save();
      ctx.translate(x, y + 76);
      ctx.scale(pulse, pulse);
      text(ctx, String(secs).padStart(2, '0'), 0, 0, 58, low ? '#ff5252' : '#ffffff', 'center');
      ctx.restore();
      text(ctx, s.match.roundLabel, x, y + 116, 20, '#ffffff', 'center');
    },

    combo(ctx, f, side) {
      if (f.comboShow <= 0 || f.combo < 2) return;
      const x = side ? 1100 : 180, y = 300;
      const n = f.combo;
      let col = '#ffffff', col2 = '#9ad8ff';
      if (n >= 10) { const h = (performance.now() / 4) % 360; col = `hsl(${h},100%,65%)`; col2 = '#ff1744'; }
      else if (n >= 5) { col = '#ffab40'; col2 = '#ff3d00'; }
      else if (n >= 3) { col = '#ffe57f'; col2 = '#ffab00'; }
      const pop = 1 + Math.max(0, f.comboPop) * 0.5 + (n >= 10 ? 0.3 : n >= 5 ? 0.15 : 0);
      const alpha = Math.min(1, f.comboShow / 0.4);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(side ? 0.08 : -0.08);
      ctx.scale(pop, pop);
      if (n >= 5) VF.BG.glow(ctx, 0, 0, 90 + n * 3, col2, 0.35);
      text(ctx, 'COMBO', 0, -42, 26, col2, 'center');
      text(ctx, 'x' + n, 0, 20, 68, col, 'center');
      const tag = n >= 15 ? 'LENDÁRIO!' : n >= 10 ? 'INCRÍVEL!' : n >= 8 ? 'INSANO!' : n >= 5 ? 'BRUTAL!' : n >= 3 ? 'BOA!' : '';
      if (tag) text(ctx, tag, 0, 54, 24, '#ffffff', 'center');
      ctx.restore();
    }
  };
})();
