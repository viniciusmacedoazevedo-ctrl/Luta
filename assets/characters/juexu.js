/* JUEXU — lutadora elegante de cabelo longo, visual roxo/sombrio */
(function () {
  const D = VF.Draw;
  const PI = Math.PI;

  VF.Skins.juexu = {
    build: { torso: 70, width: 27, limb: 11, head: 25, leg: 1.06, arm: 1.02, foot: 0.9, belly: 4 },
    colors: {
      skin: '#f3c7a6', hair: '#231031', hairHi: '#9b4dca', shirt: '#7b1fa2', trim: '#15101f', belt: '#ff4081',
      upperArm: '#f3c7a6', foreArm: '#e1bee7', hand: '#f3c7a6', lips: '#c2185b',
      pants: '#1b1b24', shoes: '#2b2b36', shoeAccent: '#b36bff'
    },
    alt: { shirt: '#00897b', belt: '#ffd600', foreArm: '#b2dfdb', hairHi: '#26c6da', shoeAccent: '#26c6da' },

    drawBack(ctx, info) {
      const { J, col, f, t } = info;
      const x = J.head.x, y = J.head.y, R = J.R * (info.portrait ? 1 : VF.Rig.HEAD_SCALE);
      const sway = Math.sin(t * 3) * 5 - (f.vx || 0) * 0.012 + (f.state === 'jump' ? -8 : 0);
      D.shape(ctx, (g) => {
        g.moveTo(x + R * 0.3, y - R * 0.95);
        g.bezierCurveTo(x - R * 0.9, y - R * 1.3, x - R * 1.5, y - R * 0.2, x - R * 1.3, y + R * 1.2);
        g.quadraticCurveTo(x - R * 1.35 + sway * 0.5, y + R * 2.6, x - R * 1.05 + sway, y + R * 3.6);
        g.quadraticCurveTo(x - R * 0.7 + sway, y + R * 3.0, x - R * 0.45 + sway * 0.6, y + R * 3.3);
        g.quadraticCurveTo(x - R * 0.35 + sway * 0.3, y + R * 2.0, x - R * 0.1, y + R * 0.9);
        g.closePath();
      }, col.hair, 3);
      ctx.beginPath();
      ctx.moveTo(x - R * 0.9, y - R * 0.3);
      ctx.quadraticCurveTo(x - R * 1.2 + sway * 0.4, y + R * 1.5, x - R * 0.9 + sway, y + R * 3.1);
      ctx.strokeStyle = col.hairHi;
      ctx.lineWidth = 3;
      ctx.stroke();
    },

    drawHead(ctx, R, expr, info) {
      const c = info.col;
      const fx = VF.faceExpr(expr);
      D.ellipse(ctx, 0, 1, R * 0.96, R, 0, c.skin, 3);
      // bochecha
      D.circle(ctx, 15, 9, 4.5, 'rgba(255,120,150,0.35)', 0);
      // franja lateral
      D.shape(ctx, (g) => {
        g.moveTo(-R - 1, 8);
        g.bezierCurveTo(-R - 5, -R * 1.35, R * 0.9, -R * 1.45, R + 2, -R * 0.15);
        g.quadraticCurveTo(R * 0.55, -R * 0.75, -R * 0.05, -R * 0.45);
        g.quadraticCurveTo(-R * 0.45, -R * 0.2, -R * 0.5, 9);
        g.closePath();
      }, c.hair, 3);
      ctx.beginPath();
      ctx.moveTo(-R * 0.3, -R * 0.95);
      ctx.quadraticCurveTo(R * 0.4, -R * 1.05, R * 0.8, -R * 0.5);
      ctx.strokeStyle = c.hairHi;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // enfeite de cabelo
      D.circle(ctx, -R * 0.35, -R * 0.85, 4, c.belt, 1.8);
      D.ear(ctx, -7, 4, c.skin);
      // brinco de argola
      ctx.beginPath();
      ctx.arc(-7, 15, 4.5, 0, PI * 2);
      ctx.strokeStyle = '#ffca28';
      ctx.lineWidth = 2;
      ctx.stroke();
      D.eye(ctx, 8, -1, 5.8, fx.eye, { iris: '#4a148c', lidColor: c.skin });
      D.eye(ctx, 19, -1, 4.8, fx.eye, { iris: '#4a148c', lidColor: c.skin });
      if (fx.eye === 'normal' || fx.eye === 'angry' || fx.eye === 'focus') {
        // cílios
        D.line(ctx, 11, -6, 15, -9, D.OL, 2);
        D.line(ctx, 21, -6, 24, -8.5, D.OL, 2);
      }
      D.brow(ctx, 8, -10, 7, fx.brow - 0.15, 2.2, c.hair);
      D.brow(ctx, 19, -10, 5.5, -fx.brow + 0.15, 2.2, c.hair);
      D.nose(ctx, R * 0.97, c.skin, 0.8);
      if (fx.mouth === 'normal') {
        D.ellipse(ctx, 15, 13, 4.5, 2.3, -0.1, c.lips, 1.8);
      } else {
        D.mouth(ctx, 15, 13, 9, fx.mouth);
      }
    },

    drawTorso(ctx, T, w, c) {
      ctx.fillStyle = c.trim;
      ctx.fillRect(-w, -T - 6, w * 2, 8);
      // detalhe em "V"
      D.poly(ctx, [[w * 0.05, -T + 2], [w * 0.6, -T + 2], [w * 0.3, -T * 0.7]], c.trim, 0);
      // faixa/cinto
      ctx.fillStyle = c.belt;
      ctx.fillRect(-w, -14, w * 2, 12);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(-w, -4, w * 2, 3);
    },

    drawTorsoOver(ctx, T, w, c) {
      // laço do cinto com pontas
      D.circle(ctx, w * 0.45, -8, 5, c.belt, 2);
      D.poly(ctx, [[w * 0.45, -6], [w * 0.75, 14], [w * 0.55, 16]], c.belt, 2);
    },

    victoryPose(t) {
      return VF.Poses.P({
        lean: -0.06, head: -0.2 + Math.sin(t * 2) * 0.05,
        fa: [PI - 0.25, PI + 0.3 + Math.sin(t * 3) * 0.1], ba: [-0.65, 0.85],
        fl: [-0.12, -0.05], bl: [0.22, 0.1]
      });
    }
  };
})();
