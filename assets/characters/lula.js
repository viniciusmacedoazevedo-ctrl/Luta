/* LULA — CARICATURA FICTÍCIA / PARÓDIA de videogame.
   Visual de "ladrão de desenho animado" (touca, máscara, camisa listrada).
   Nenhum elemento representa fatos sobre a pessoa real. */
(function () {
  const D = VF.Draw;
  const PI = Math.PI;

  VF.Skins.lula = {
    build: { torso: 64, width: 44, limb: 15, head: 29, leg: 0.9, arm: 0.95, foot: 1.12, belly: 20 },
    colors: {
      skin: '#e9b48e', hair: '#f1f1f1', beard: '#e6e6e6', beanie: '#2b2b33', band: '#4a4a58', mask: '#121212',
      shirt: '#f4f4f4', stripe: '#1d1d22',
      upperArm: '#1d1d22', foreArm: '#f4f4f4', hand: '#3a3a3a',
      pants: '#3a4050', shoes: '#5d4037', shoeAccent: null
    },
    alt: { stripe: '#b71c1c', upperArm: '#b71c1c', beanie: '#1a237e', band: '#3949ab', pants: '#4e342e' },

    drawHead(ctx, R, expr, info) {
      const c = info.col;
      const fx = VF.faceExpr(expr);
      D.circle(ctx, 0, 0, R, c.skin, 3);
      // cabelo branco na nuca
      D.shape(ctx, (g) => {
        g.moveTo(-R * 0.35, -R * 0.45);
        g.arc(-R * 0.7, -R * 0.2, R * 0.38, -1.2, 2.2, true);
        g.arc(-R * 0.75, R * 0.25, R * 0.3, -2.4, 1.6, true);
        g.lineTo(-R * 0.3, R * 0.2);
        g.closePath();
      }, c.hair, 2.5);
      // barba
      D.shape(ctx, (g) => {
        g.moveTo(-4, 2);
        g.quadraticCurveTo(-6, R * 0.95, 7, R + 5);
        g.quadraticCurveTo(R * 0.85, R + 3, R + 3, R * 0.35);
        g.lineTo(R - 1, 6);
        g.quadraticCurveTo(R * 0.55, 3, 10, 8);
        g.quadraticCurveTo(3, 6, -4, 2);
        g.closePath();
      }, c.beard, 3);
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(2 + i * 5, R * 0.55 + (i % 2) * 5);
        ctx.lineTo(4 + i * 5, R * 0.75 + (i % 2) * 5);
        ctx.stroke();
      }
      D.ear(ctx, -7, 4, c.skin);
      // touca de ladrão
      D.shape(ctx, (g) => {
        g.moveTo(-R - 3, -R * 0.35);
        g.bezierCurveTo(-R - 3, -R * 1.55, R * 0.95, -R * 1.6, R + 3, -R * 0.5);
        g.closePath();
      }, c.beanie, 3);
      ctx.lineCap = 'round';
      D.line(ctx, -R - 3, -R * 0.42, R + 3, -R * 0.56, D.OL, 13);
      D.line(ctx, -R - 3, -R * 0.42, R + 3, -R * 0.56, c.band, 8);
      // máscara
      D.shape(ctx, (g) => {
        g.moveTo(0, -12);
        g.lineTo(R + 1, -12);
        g.quadraticCurveTo(R + 5, -6, R + 1, 1);
        g.lineTo(0, 1);
        g.quadraticCurveTo(-4, -6, 0, -12);
        g.closePath();
      }, c.mask, 2);
      D.poly(ctx, [[-1, -8], [-10, -12], [-9, -3]], c.mask, 2);
      D.eye(ctx, 9, -5, 5.2, fx.eye, { lidColor: c.mask });
      D.eye(ctx, 20, -5, 4.6, fx.eye, { lidColor: c.mask });
      if (fx.brow) {
        D.brow(ctx, 9, -13, 8, fx.brow, 3, '#d0d0d0');
        D.brow(ctx, 20, -13, 6, -fx.brow, 3, '#d0d0d0');
      }
      // narigão
      D.circle(ctx, R - 1, 5, 6.5, c.skin, 2.6);
      // bigode
      D.shape(ctx, (g) => {
        g.moveTo(R - 18, 12);
        g.quadraticCurveTo(R - 12, 6, R - 4, 10);
        g.quadraticCurveTo(R + 1, 12, R - 1, 15);
        g.quadraticCurveTo(R - 10, 12, R - 18, 12);
        g.closePath();
      }, c.hair, 2);
      D.mouth(ctx, R - 11, 17, 9, fx.mouth === 'normal' ? 'smirk' : fx.mouth);
    },

    drawTorso(ctx, T, w, c) {
      ctx.fillStyle = c.stripe;
      for (let y = -6; y > -T - 6; y -= 13) ctx.fillRect(-w, y - 6.5, w * 2, 6.5);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(-w, -T - 6, w * 2, 7);
    },

    drawFront(ctx, info) {
      if (info.f.state === 'special') {
        const J = info.J;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const rg = ctx.createRadialGradient(J.fHand.x, J.fHand.y, 1, J.fHand.x, J.fHand.y, 24);
        rg.addColorStop(0, 'rgba(255,255,200,0.95)');
        rg.addColorStop(1, 'rgba(255,200,0,0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(J.fHand.x, J.fHand.y, 24, 0, PI * 2);
        ctx.fill();
        ctx.restore();
      }
    },

    victoryPose(t) {
      const s = Math.sin(t * 7);
      return VF.Poses.P({
        lean: -0.08 + s * 0.05, head: -0.2,
        fa: [PI - 1.1 + s * 0.2, PI - 0.6 + s * 0.3], ba: [PI + 0.5 - s * 0.2, PI + 0.2 - s * 0.3],
        fl: [0.3 + Math.max(0, s) * 0.4, 0.05], bl: [-0.3 + Math.min(0, s) * 0.4, -0.3]
      });
    }
  };
})();
