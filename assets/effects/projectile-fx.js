/* Visual dos projéteis especiais */
(function () {
  VF.ProjectileFX = {
    // VINI BLAST: rajada ciano com núcleo branco
    blast(ctx, p, t) {
      const dir = Math.sign(p.vx) || 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(dir, 1);
      ctx.globalCompositeOperation = 'lighter';
      const len = 160;
      const g = ctx.createLinearGradient(-len, 0, 40, 0);
      g.addColorStop(0, 'rgba(0,229,255,0)');
      g.addColorStop(0.7, 'rgba(0,229,255,0.55)');
      g.addColorStop(1, 'rgba(255,255,255,0.9)');
      ctx.fillStyle = g;
      const wob = Math.sin(t * 60) * 4;
      ctx.beginPath();
      ctx.moveTo(-len, -8);
      ctx.quadraticCurveTo(0, -34 - wob, 40, 0);
      ctx.quadraticCurveTo(0, 34 + wob, -len, 8);
      ctx.fill();
      const r = 30 + Math.sin(t * 40) * 3;
      const rg = ctx.createRadialGradient(10, 0, 2, 10, 0, r);
      rg.addColorStop(0, '#ffffff');
      rg.addColorStop(0.4, '#9ff6ff');
      rg.addColorStop(1, 'rgba(0,180,255,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(10, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },

    // ENERGIA SOMBRIA: esfera roxa pulsante com anéis
    dark(ctx, p, t) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalCompositeOperation = 'lighter';
      const r = 52 + Math.sin(t * 20) * 5;
      const rg = ctx.createRadialGradient(0, 0, 4, 0, 0, r * 1.5);
      rg.addColorStop(0, '#ffffff');
      rg.addColorStop(0.2, '#e0b3ff');
      rg.addColorStop(0.5, 'rgba(140,40,220,0.8)');
      rg.addColorStop(1, 'rgba(60,0,90,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(40,0,60,0.8)';
      ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate(t * (4 + i * 2) * (i % 2 ? -1 : 1));
        ctx.beginPath();
        ctx.ellipse(0, 0, r * (0.8 + i * 0.15), r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    },

    // DISCURSO DE PODER: onda de choque em arco, verde e amarela
    wave(ctx, p, t) {
      const dir = Math.sign(p.vx) || 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(dir, 1);
      ctx.globalCompositeOperation = 'lighter';
      const h = p.h * 0.55;
      for (let i = 0; i < 4; i++) {
        const off = -i * 22;
        const alpha = 0.85 - i * 0.2;
        ctx.strokeStyle = i % 2 ? `rgba(255,214,0,${alpha})` : `rgba(46,204,113,${alpha})`;
        ctx.lineWidth = 14 - i * 2;
        ctx.beginPath();
        ctx.moveTo(off - 20, -h);
        ctx.quadraticCurveTo(off + 45 + Math.sin(t * 30 + i) * 6, 0, off - 20, h);
        ctx.stroke();
      }
      ctx.font = "bold 34px 'Bangers', Impact, sans-serif";
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.textAlign = 'center';
      ctx.fillText('!!!', -40, -h + 30 + Math.sin(t * 20) * 4);
      ctx.restore();
    }
  };
})();

/* Visuais extras de projéteis (v2) */
(function () {
  const PI = Math.PI;
  Object.assign(VF.ProjectileFX, {
    ball(ctx, p, t) {
      ctx.save();
      VF.BG.glow(ctx, p.x, p.y, 70, p.color, 0.5);
      ctx.translate(p.x, p.y);
      ctx.rotate(t * 20 * Math.sign(p.vx));
      VF.BigFX.TYPES.ball(ctx, { x: 0, y: 0, x0: 0, t: 0, r: p.w / 2, color: p.color }, 0);
      ctx.restore();
    },
    arrow(ctx, p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.atan2(p.vy || 0, p.vx));
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(-90, 0, 20, 0);
      g.addColorStop(0, VF.M.hexA(p.color, 0));
      g.addColorStop(1, VF.M.hexA(p.color, 0.9));
      ctx.fillStyle = g;
      ctx.fillRect(-90, -5, 110, 10);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(34, 0); ctx.lineTo(10, -12); ctx.lineTo(10, 12); ctx.closePath(); ctx.fill();
      ctx.restore();
    },
    heart(ctx, p, t) {
      ctx.save();
      VF.BG.glow(ctx, p.x, p.y, 80, p.color, 0.5);
      ctx.translate(p.x, p.y);
      const s = 1 + Math.sin(t * 20) * 0.1;
      ctx.scale(s, s);
      VF.BigFX.icon(ctx, 'heart', 38, p.color);
      ctx.restore();
    },
    note(ctx, p, t) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = VF.M.hexA(p.color, 0.8);
      ctx.lineWidth = 7;
      const dir = Math.sign(p.vx) || 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(p.x - dir * i * 22, p.y, 50 + i * 14, dir > 0 ? -PI / 3 : PI - PI / 3, dir > 0 ? PI / 3 : PI + PI / 3);
        ctx.stroke();
      }
      ctx.restore();
      VF.BigFX.TYPES.bigtext(ctx, { x: p.x, y: p.y - 10 + Math.sin(t * 10) * 8, text: '♪', size: 44, color: '#ffffff' }, 0.5);
    },
    laser(ctx, p) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      const n = Math.hypot(p.vx, p.vy || 0) || 1;
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - (p.vx / n) * 50, p.y - ((p.vy || 0) / n) * 50);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    },
    orb(ctx, p, t) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const r = p.w * 0.5 + Math.sin(t * 30) * 3;
      const g = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, r * 1.4);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.4, VF.M.hexA(p.color, 0.9));
      g.addColorStop(1, VF.M.hexA(p.color, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, r * 1.4, 0, PI * 2); ctx.fill();
      ctx.restore();
    }
  });
})();
