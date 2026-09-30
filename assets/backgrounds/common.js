/* Utilidades para cenários: camadas pré-renderizadas e helpers de luz */
(function () {
  VF.Backgrounds = VF.Backgrounds || {};

  VF.BG = {
    W: 1280,
    H: 720,
    layer(w, h, draw) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      draw(c.getContext('2d'), w, h);
      return c;
    },
    // pseudo-aleatório determinístico (cenário igual a cada luta)
    rng(seed) {
      let s = seed >>> 0;
      return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
      };
    },
    glow(ctx, x, y, r, color, alpha) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, VF.M.hexA(color, alpha == null ? 0.6 : alpha));
      g.addColorStop(1, VF.M.hexA(color, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
    cone(ctx, x, y, ang, len, spread, color, alpha) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const ex = x + Math.sin(ang) * len, ey = y + Math.cos(ang) * len;
      const g = ctx.createLinearGradient(x, y, ex, ey);
      g.addColorStop(0, VF.M.hexA(color, alpha));
      g.addColorStop(1, VF.M.hexA(color, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.sin(ang - spread) * len, y + Math.cos(ang - spread) * len);
      ctx.lineTo(x + Math.sin(ang + spread) * len, y + Math.cos(ang + spread) * len);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    vignette(ctx, strength) {
      const g = ctx.createRadialGradient(640, 380, 300, 640, 380, 820);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, `rgba(0,0,0,${strength || 0.55})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1280, 720);
    }
  };
})();
