/* ARTHUR — magrinho, rápido, topete estiloso e jaqueta bomber */
(function () {
  const D = VF.Draw;
  const PI = Math.PI;

  VF.Skins.arthur = {
    build: { torso: 76, width: 25, limb: 10, head: 25, leg: 1.07, arm: 1.04, foot: 0.95, belly: 1 },
    colors: {
      skin: '#e8b58f', hair: '#2e1c10', hairTip: '#ffcc33', shirt: '#ffc400', inner: '#1b1b1b',
      upperArm: '#ffc400', foreArm: '#ffc400', hand: '#e8b58f',
      pants: '#1c1c22', shoes: '#e53935', shoeAccent: '#ffffff'
    },
    alt: { shirt: '#00c853', upperArm: '#00c853', foreArm: '#00c853', shoes: '#2962ff', hairTip: '#ff4081' },

    drawHead(ctx, R, expr, info) {
      const c = info.col;
      const fx = VF.faceExpr(expr);
      D.ellipse(ctx, 0, 1, R * 0.95, R, 0, c.skin, 3);
      // laterais raspadas (undercut)
      D.shape(ctx, (g) => {
        g.moveTo(-R * 0.95, 6);
        g.quadraticCurveTo(-R * 1.05, -R * 0.4, -R * 0.4, -R * 0.62);
        g.lineTo(R * 0.3, -R * 0.62);
        g.lineTo(-R * 0.3, 8);
        g.closePath();
      }, 'rgba(46,28,16,0.45)', 0);
      // topete
      const grad = ctx.createLinearGradient(-R, -R, R, -R * 1.8);
      grad.addColorStop(0, c.hair);
      grad.addColorStop(0.55, c.hair);
      grad.addColorStop(1, c.hairTip);
      D.shape(ctx, (g) => {
        g.moveTo(-R * 0.85, -R * 0.35);
        g.bezierCurveTo(-R * 1.1, -R * 1.3, -R * 0.2, -R * 1.9, R * 0.6, -R * 1.75);
        g.quadraticCurveTo(R * 1.35, -R * 1.6, R * 1.25, -R * 0.95);
        g.quadraticCurveTo(R * 0.95, -R * 1.15, R * 0.75, -R * 0.55);
        g.quadraticCurveTo(R * 0.2, -R * 0.75, -R * 0.2, -R * 0.55);
        g.quadraticCurveTo(-R * 0.5, -R * 0.45, -R * 0.85, -R * 0.35);
        g.closePath();
      }, grad, 3);
      ctx.beginPath();
      ctx.moveTo(-R * 0.4, -R * 1.2);
      ctx.quadraticCurveTo(R * 0.2, -R * 1.6, R * 0.9, -R * 1.4);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      D.ear(ctx, -6, 4, c.skin);
      D.circle(ctx, -6, 11, 2.2, '#dfe6ee', 1.2); // brinco
      D.eye(ctx, 8, -1, 5.5, fx.eye, { lid: expr === 'normal', lidColor: c.skin });
      D.eye(ctx, 19, -1, 4.6, fx.eye, { lid: expr === 'normal', lidColor: c.skin });
      D.brow(ctx, 8, -9, 8, fx.brow - 0.1, 2.8, c.hair);
      D.brow(ctx, 19, -9, 6, -fx.brow + 0.1, 2.8, c.hair);
      D.nose(ctx, R * 0.97, c.skin, 0.9);
      D.mouth(ctx, 14, 13, 9, fx.mouth === 'normal' ? 'smirk' : fx.mouth);
    },

    drawTorso(ctx, T, w, c) {
      // camiseta preta aparecendo na frente (jaqueta aberta)
      ctx.fillStyle = c.inner;
      ctx.fillRect(w * 0.12, -T - 5, w, T + 10);
      D.line(ctx, w * 0.12, -T, w * 0.12, 0, '#8a6d00', 2);
      // gola e barra canelada
      ctx.fillStyle = '#1b1b1b';
      ctx.fillRect(-w, -T - 6, w * 2, 9);
      ctx.fillRect(-w, -10, w * 2, 12);
      ctx.fillStyle = c.shirt;
      ctx.fillRect(-w, -6, w * 2, 2.5);
      // raio nas costas
      D.poly(ctx, [[-w * 0.3, -T * 0.75], [-w * 0.05, -T * 0.52], [-w * 0.2, -T * 0.52], [0, -T * 0.28], [-w * 0.35, -T * 0.55], [-w * 0.2, -T * 0.55]], '#1b1b1b', 0);
    },

    drawFront(ctx, info) {
      const J = info.J;
      // punho canelado da jaqueta
      const k = 0.82;
      D.circle(ctx, J.fElb.x + (J.fHand.x - J.fElb.x) * k, J.fElb.y + (J.fHand.y - J.fElb.y) * k, 5.5, '#1b1b1b', 2);
    },

    victoryPose(t) {
      const b = Math.abs(Math.sin(t * 6));
      return VF.Poses.P({
        lean: -0.12, head: -0.12,
        fa: [1.45, 1.95 + Math.sin(t * 10) * 0.08], ba: [-0.55, 0.9],
        fl: [0.08 + b * 0.05, 0.02 - b * 0.1], bl: [0.28, -0.05]
      });
    }
  };
})();
