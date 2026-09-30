/* VINI — jovem protagonista de óculos e franjinha, roupa esportiva */
(function () {
  const D = VF.Draw;
  const PI = Math.PI;
  VF.Skins = VF.Skins || {};

  VF.faceExpr = function (e) {
    return {
      eye: { normal: 'normal', angry: 'angry', focus: 'focus', hurt: 'hurt', ko: 'ko', happy: 'happy' }[e] || 'normal',
      mouth: { normal: 'normal', angry: 'angry', focus: 'angry', hurt: 'hurt', ko: 'ko', happy: 'happy' }[e] || 'normal',
      brow: e === 'angry' || e === 'focus' ? 0.35 : e === 'hurt' ? -0.3 : 0
    };
  };

  VF.Skins.vini = {
    build: { torso: 72, width: 34, limb: 13, head: 27, leg: 1, arm: 1, foot: 1, belly: 3 },
    colors: {
      skin: '#f1c29a', hair: '#1d1a2b', shirt: '#1e88e5', accent: '#00e5ff',
      upperArm: '#1e88e5', foreArm: '#f1c29a', hand: '#f1c29a',
      pants: '#263043', shoes: '#ffffff', shoeAccent: '#ff3d3d', frame: '#1a1a1a'
    },
    alt: { shirt: '#e53935', accent: '#ffd600', upperArm: '#e53935', pants: '#2b2b2b', shoeAccent: '#1e88e5' },

    drawHead(ctx, R, expr, info) {
      const c = info.col;
      const fx = VF.faceExpr(expr);
      D.circle(ctx, 0, 0, R, c.skin, 3);
      // cabelo com franjinha
      D.shape(ctx, (g) => {
        g.moveTo(-R - 1, 9);
        g.bezierCurveTo(-R - 6, -R * 1.25, R * 0.5, -R * 1.5, R + 3, -R * 0.42);
        g.lineTo(R - 2, -R * 0.16);
        g.lineTo(R - 7, -R * 0.42);
        g.lineTo(R - 11, -R * 0.12);
        g.lineTo(R - 16, -R * 0.44);
        g.lineTo(R - 21, -R * 0.14);
        g.lineTo(R - 26, -R * 0.4);
        g.lineTo(-R * 0.2, -R * 0.3);
        g.quadraticCurveTo(-R * 0.55, -R * 0.05, -R * 0.45, 11);
        g.closePath();
      }, c.hair, 3);
      ctx.beginPath();
      ctx.arc(-2, -R * 0.55, R * 0.5, PI * 1.15, PI * 1.55);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 3;
      ctx.stroke();
      D.ear(ctx, -7, 4, c.skin);
      // olhos + sobrancelhas
      D.eye(ctx, 8, -1, 6, fx.eye, { lidColor: c.skin });
      D.eye(ctx, 20, -1, 5, fx.eye, { lidColor: c.skin });
      D.brow(ctx, 8, -10, 9, fx.brow, 3, c.hair);
      D.brow(ctx, 20, -10, 7, -fx.brow, 3, c.hair);
      D.nose(ctx, R, c.skin);
      D.mouth(ctx, 15, 13, 10, fx.mouth);
      // óculos
      const glow = info.f.state === 'special' || info.glow;
      const lens = glow ? 'rgba(160,255,255,0.95)' : 'rgba(190,230,255,0.28)';
      D.circle(ctx, 8, -1, 8.5, lens, 2.8);
      D.circle(ctx, 20.5, -1, 6.8, lens, 2.8);
      D.line(ctx, 14.5, -2, 16.2, -2, c.frame, 2.6);
      D.line(ctx, -0.5, -2, -8, -1, c.frame, 2.6);
      if (glow) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const rg = ctx.createRadialGradient(14, -1, 2, 14, -1, 30);
        rg.addColorStop(0, 'rgba(255,255,255,0.9)');
        rg.addColorStop(0.4, 'rgba(0,229,255,0.5)');
        rg.addColorStop(1, 'rgba(0,229,255,0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(14, -1, 30, 0, PI * 2);
        ctx.fill();
        ctx.restore();
      }
    },

    drawTorso(ctx, T, w, c) {
      D.poly(ctx, [[-w, -T * 0.28], [w, -T * 0.78], [w, -T * 0.62], [-w, -T * 0.12]], c.accent, 0);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(-w, -T - 6, w * 2, 9);
      ctx.fillRect(-w, -8, w * 2, 10);
      ctx.font = "bold 18px 'Bangers', Impact, sans-serif";
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText('V', w * 0.18, -T * 0.4);
    },

    drawFront(ctx, info) {
      // munhequeira
      const J = info.J;
      const k = 0.78;
      const x = J.fElb.x + (J.fHand.x - J.fElb.x) * k, y = J.fElb.y + (J.fHand.y - J.fElb.y) * k;
      D.circle(ctx, x, y, 6.5, info.col.accent, 2.4);
    },

    victoryPose(t) {
      const b = Math.abs(Math.sin(t * 4));
      return VF.Poses.P({
        lean: -0.05, head: -0.1,
        fa: [1.6, PI + 0.5], ba: [PI - 0.3, PI - 0.1 + Math.sin(t * 8) * 0.12],
        fl: [0.3 + b * 0.06, 0.1 - b * 0.08], bl: [-0.25, -0.25]
      });
    }
  };
})();
