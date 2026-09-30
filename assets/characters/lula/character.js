/* LULA — CARICATURA FICTÍCIA / PARÓDIA de videogame (ladrão de desenho animado).
   Nenhuma habilidade representa fatos sobre a pessoa real. */
(function () {
  const PI = Math.PI;
  const D = VF.Draw;
  const L = { beard: '#e6e6e6', beanie: '#2b2b33', band: '#4a4a58', mask: '#121212', hair: '#f1f1f1' };
  VF.defineCharacter({
    id: 'lula', name: 'LULA', parody: true,
    title: 'O Larápio de Desenho Animado',
    desc: 'Caricatura fictícia. Lento, mas cada golpe pesa uma tonelada. Agarrão devastador.',
    style: 'Lento • golpes pesados • agarrão',
    color: '#ff5252',
    stats: { power: 10, speed: 3, defense: 6 },
    archetype: 'grappler',
    anim: { stance: 'heavy', swagger: 0.8, idleSpeed: 3, poses: { heavy: 'hammer', kick: 'frontkick', forward: 'tackle', launcher: 'launcher' } },
    combo: 'Leve → Chute → Pesado (martelo) → dash → Agarrão | Baixo → Rasteira → ESPECIAL',
    look: {
      skin: 'light',
      build: { torso: 64, width: 44, limb: 15, head: 29, leg: 0.9, arm: 0.95, foot: 1.12, belly: 20 },
      hair: { style: 'short', color: '#f1f1f1' },
      outfit: { top: 'striped', topColor: '#f4f4f4', accent: '#1d1d22', sleeves: 'long', sleeveColor: '#e8e8e8', gloves: '#3a3a3a', bottomColor: '#3a4050', shoes: '#5d4037', shoeAccent: null },
      alt: { accent: '#b71c1c', pants: '#4e342e' },
      drawHead(ctx, R, expr, info) {
        const c = info.col;
        const fx = VF.faceExpr(expr);
        D.circle(ctx, 0, 0, R, c.skin, 3);
        D.shape(ctx, (g) => { g.moveTo(-R * 0.35, -R * 0.45); g.arc(-R * 0.7, -R * 0.2, R * 0.38, -1.2, 2.2, true); g.arc(-R * 0.75, R * 0.25, R * 0.3, -2.4, 1.6, true); g.lineTo(-R * 0.3, R * 0.2); g.closePath(); }, L.hair, 2.5);
        D.shape(ctx, (g) => { g.moveTo(-4, 2); g.quadraticCurveTo(-6, R * 0.95, 7, R + 5); g.quadraticCurveTo(R * 0.85, R + 3, R + 3, R * 0.35); g.lineTo(R - 1, 6); g.quadraticCurveTo(R * 0.55, 3, 10, 8); g.quadraticCurveTo(3, 6, -4, 2); g.closePath(); }, L.beard, 3);
        D.ear(ctx, -7, 4, c.skin);
        D.shape(ctx, (g) => { g.moveTo(-R - 3, -R * 0.35); g.bezierCurveTo(-R - 3, -R * 1.55, R * 0.95, -R * 1.6, R + 3, -R * 0.5); g.closePath(); }, L.beanie, 3);
        ctx.lineCap = 'round';
        D.line(ctx, -R - 3, -R * 0.42, R + 3, -R * 0.56, D.OL, 13);
        D.line(ctx, -R - 3, -R * 0.42, R + 3, -R * 0.56, L.band, 8);
        D.shape(ctx, (g) => { g.moveTo(0, -12); g.lineTo(R + 1, -12); g.quadraticCurveTo(R + 5, -6, R + 1, 1); g.lineTo(0, 1); g.quadraticCurveTo(-4, -6, 0, -12); g.closePath(); }, L.mask, 2);
        D.poly(ctx, [[-1, -8], [-10, -12], [-9, -3]], L.mask, 2);
        D.eye(ctx, 9, -5, 5.2, fx.eye, { lidColor: L.mask });
        D.eye(ctx, 20, -5, 4.6, fx.eye, { lidColor: L.mask });
        if (fx.brow) { D.brow(ctx, 9, -13, 8, fx.brow, 3, '#d0d0d0'); D.brow(ctx, 20, -13, 6, -fx.brow, 3, '#d0d0d0'); }
        D.circle(ctx, R - 1, 5, 6.5, c.skin, 2.6);
        D.shape(ctx, (g) => { g.moveTo(R - 18, 12); g.quadraticCurveTo(R - 12, 6, R - 4, 10); g.quadraticCurveTo(R + 1, 12, R - 1, 15); g.quadraticCurveTo(R - 10, 12, R - 18, 12); g.closePath(); }, L.hair, 2);
        D.mouth(ctx, R - 11, 17, 9, fx.mouth === 'normal' ? 'smirk' : fx.mouth);
      },
      drawFront(ctx, info) {
        if (info.f.state === 'special' || info.f.state === 'ultimate') VF.BG.glow(ctx, info.J.fHand.x, info.J.fHand.y, 26, '#ffd600', 0.9);
      },
      victoryPose: (t) => { const s = Math.sin(t * 7); return VF.Poses.P({ lean: -0.08 + s * 0.05, head: -0.2, fa: [PI - 1.1 + s * 0.2, PI - 0.6 + s * 0.3], ba: [PI + 0.5 - s * 0.2, PI + 0.2 - s * 0.3], fl: [0.3 + Math.max(0, s) * 0.4, 0.05], bl: [-0.3 + Math.min(0, s) * 0.4, -0.3] }); }
    },
    special: { type: 'drain', name: 'MÃO LEVE', icon: '🫳', color: '#ffd600', desc: 'Mecânica fictícia e cômica: avança e drena temporariamente parte da barra SPECIAL do adversário.' },
    ultimate: { name: 'LADRÃO DE ENERGIA', desc: 'Animação exagerada: absorve energia fictícia do adversário e termina com um golpe poderoso.', approach: 'rush', hits: 6, style: 'grab', gap: 0.14, dmg: 22, finish: 170, finisher: 'drain', color: '#ffd600', finishPose: 'hammer' },
    ai: { prefer: 'close', grabby: 0.2, aggression: 0.05 }
  });
})();
