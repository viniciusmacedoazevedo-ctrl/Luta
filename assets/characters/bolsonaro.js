/* JAIR BOLSONARO — CARICATURA FICTÍCIA / PARÓDIA de videogame.
   Terno de chefe de Estado exagerado e faixa presidencial em algumas animações.
   Nenhum elemento representa fatos sobre a pessoa real. */
(function () {
  const D = VF.Draw;
  const PI = Math.PI;

  VF.Skins.bolsonaro = {
    build: { torso: 70, width: 38, limb: 14, head: 28, leg: 0.98, arm: 1.0, foot: 1.1, belly: 8 },
    colors: {
      skin: '#f0c4a0', hair: '#595959', temple: '#a8a8a8', shirt: '#1e2a47', collar: '#ffffff', tie: '#0e7a3d',
      upperArm: '#1e2a47', foreArm: '#1e2a47', hand: '#f0c4a0',
      pants: '#1e2a47', shoes: '#101010', shoeAccent: null
    },
    alt: { shirt: '#3e2723', upperArm: '#3e2723', foreArm: '#3e2723', pants: '#3e2723', tie: '#c62828' },

    sash(f) {
      return !!f && (f.state === 'victory' || f.state === 'special' || f.introSash);
    },

    drawHead(ctx, R, expr, info) {
      const c = info.col;
      const fx = VF.faceExpr(expr);
      D.ellipse(ctx, 0, 1, R * 0.95, R * 1.05, 0, c.skin, 3);
      // queixo
      D.shape(ctx, (g) => {
        g.moveTo(2, R * 0.6);
        g.quadraticCurveTo(R * 0.6, R * 1.2, R * 0.85, R * 0.45);
      }, null, 2.5);
      // cabelo curto, repartido
      D.shape(ctx, (g) => {
        g.moveTo(-R - 1, 3);
        g.bezierCurveTo(-R - 3, -R * 1.3, R * 0.7, -R * 1.4, R * 0.95, -R * 0.55);
        g.quadraticCurveTo(R * 0.45, -R * 0.72, 3, -R * 0.62);
        g.quadraticCurveTo(-R * 0.5, -R * 0.5, -R * 0.62, 5);
        g.closePath();
      }, c.hair, 3);
      D.ellipse(ctx, -R * 0.62, -2, 6, 10, 0, c.temple, 0);
      D.line(ctx, -R * 0.2, -R * 1.02, R * 0.4, -R * 0.9, 'rgba(255,255,255,0.35)', 2);
      D.ear(ctx, -7, 4, c.skin);
      D.eye(ctx, 9, -2, 5, fx.eye, { lidColor: c.skin, iris: '#3b2a1a' });
      D.eye(ctx, 20, -2, 4.4, fx.eye, { lidColor: c.skin, iris: '#3b2a1a' });
      D.brow(ctx, 9, -11, 10, fx.brow - 0.08, 4.5, '#3d3d3d');
      D.brow(ctx, 20, -11, 8, -fx.brow + 0.08, 4.5, '#3d3d3d');
      D.nose(ctx, R * 0.97, c.skin, 1.15);
      D.mouth(ctx, 15, 15, 12, fx.mouth, { curve: 0 });
    },

    drawTorso(ctx, T, w, c, f) {
      // camisa + gravata
      D.poly(ctx, [[w * 0.02, -T + 1], [w * 0.62, -T + 1], [w * 0.36, -T * 0.58]], c.collar, 2);
      D.poly(ctx, [[w * 0.3, -T + 3], [w * 0.44, -T + 3], [w * 0.46, -T * 0.52], [w * 0.38, -T * 0.42], [w * 0.29, -T * 0.52]], c.tie, 1.8);
      // lapela
      D.line(ctx, w * 0.02, -T + 1, w * 0.3, -T * 0.52, 'rgba(0,0,0,0.5)', 2.5);
      // botões
      D.circle(ctx, w * 0.44, -T * 0.33, 2.4, '#0d1426', 0);
      D.circle(ctx, w * 0.44, -T * 0.18, 2.4, '#0d1426', 0);
      // lenço no bolso
      D.poly(ctx, [[-w * 0.2, -T * 0.72], [-w * 0.02, -T * 0.72], [-w * 0.1, -T * 0.82]], '#ffd400', 1.5);
      // faixa presidencial (em algumas animações)
      if (VF.Skins.bolsonaro.sash(f)) {
        D.poly(ctx, [[w * 0.7, -T * 0.98], [w * 0.7, -T * 0.98 + 17], [-w * 0.7, -T * 0.08 + 17], [-w * 0.7, -T * 0.08]], '#0a8f3c', 2);
        D.poly(ctx, [[w * 0.7, -T * 0.98 + 6], [w * 0.7, -T * 0.98 + 11], [-w * 0.7, -T * 0.08 + 11], [-w * 0.7, -T * 0.08 + 6]], '#ffd400', 0);
        D.circle(ctx, 0, -T * 0.53 + 8, 6, '#1565c0', 2);
        D.circle(ctx, 0, -T * 0.53 + 8, 2.5, '#ffd400', 0);
      }
    },

    drawFront(ctx, info) {
      if (info.f.state === 'special') {
        // microfone do discurso
        const h = info.J.fHand;
        D.line(ctx, h.x, h.y, h.x + 4, h.y - 14, '#222', 5);
        D.circle(ctx, h.x + 5, h.y - 18, 6, '#9e9e9e', 2.4);
      }
    },

    victoryPose(t) {
      const s = Math.sin(t * 5);
      return VF.Poses.P({
        lean: -0.08, head: -0.2,
        fa: [PI - 0.55 + s * 0.12, PI - 0.4 + s * 0.12], ba: [PI - 0.25 - s * 0.12, PI - 0.15 - s * 0.12],
        fl: [0.25, 0.1], bl: [-0.25, -0.25]
      });
    }
  };
})();
