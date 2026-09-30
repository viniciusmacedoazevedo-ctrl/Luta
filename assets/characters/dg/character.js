/* DG — jogador de futebol, camisa de time, rápido e acrobático. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'dg', name: 'DG',
    title: 'O Craque',
    desc: 'Joga futebol até na briga: chutes acrobáticos, dribles e bolas de energia.',
    style: 'Rápido • chutes acrobáticos',
    color: '#43a047',
    stats: { power: 6, speed: 9, defense: 5 },
    archetype: 'acrobat',
    anim: { stance: 'kicker', swagger: 0.5, idleSpeed: 6, poses: { jab: 'kneekick', kick: 'highkick', heavy: 'risekick', launcher: 'risekick', forward: 'tackle', air: 'air', airHeavy: 'axe' } },
    moves: {
      medium: { hits: [{ s: 0.12, e: 0.2, box: [28, -150, 112, 70], dmg: 46, stun: 0.4, kb: 60, kbY: -700, launch: true, sfx: 'kick', spark: 1.3 }], next: ['heavy', 'forward', 'sweep'], jumpCancel: true }
    },
    combo: 'Leve → Chute (levanta!) → ↑ → Aéreo → Soco aéreo → Aéreo pesado → quica → Chute → ESPECIAL',
    look: {
      skin: 'dark',
      build: { torso: 72, width: 30, limb: 12, head: 26, leg: 1.06 },
      hair: { style: 'buzz', color: '#111111' },
      face: { browColor: '#111', mouth: 'normal' },
      outfit: { top: 'jersey', topColor: '#ffd600', accent: '#1e88e5', number: '10', sleeves: 'short', bottom: 'shorts', bottomColor: '#1e88e5', socks: '#ffffff', shoes: '#111111', shoeAccent: '#76ff03' },
      drawFront(ctx, info) {
        if (info.f.state === 'victory') {
          const h = info.J.fHand;
          VF.BigFX.TYPES.ball(ctx, { x: h.x, y: h.y - 22, x0: h.x, t: info.t, r: 16, color: '#fff' }, 0);
        }
      },
      victoryPose: (t) => VF.Poses.P({ lean: -0.1, head: -0.2, fa: [PI - 0.2, PI + 0.3], ba: [PI - 0.6, PI - 0.4 + Math.sin(t * 8) * 0.2], fl: [0.3 + Math.abs(Math.sin(t * 6)) * 0.3, 0.1], bl: [-0.2, -0.3] })
    },
    special: { type: 'soccer_ball', name: 'CHUTE FANTÁSTICO', icon: '⚽', color: '#43a047', desc: 'Chuta uma bola de energia quicando contra o adversário.' },
    ultimate: { name: 'CRAQUE DO COMBO', desc: 'Dribles, chutes e uma bola gigante de energia no golpe final.', approach: 'rush', hits: 9, style: 'kick', finisher: 'ball', color: '#43a047' },
    ai: { prefer: 'mid', jumpy: 0.1 }
  });
})();
