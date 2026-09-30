/* ELENA — baixa, cabelo liso marrom, cantora de igreja. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'elena', name: 'ELENA',
    title: 'A Cantora',
    desc: 'Pequena na altura, gigante na voz: suas notas viram ondas de energia.',
    style: 'Ondas sonoras • distância',
    color: '#4fc3f7',
    stats: { power: 5, speed: 6, defense: 6 },
    archetype: 'zoner',
    anim: { stance: 'elegant', idleSpeed: 3.5, poses: { jab: 'palm', kick: 'frontkick', heavy: 'double' } },
    combo: 'ESPECIAL (3 ondas) → Chute → Pesado → dash → Leve → Para trás → ↑ → Aéreo',
    look: {
      skin: 'light',
      build: { torso: 62, width: 25, limb: 10.5, head: 25, leg: 0.92, scale: 0.9 },
      hair: { style: 'long_medium', color: '#6d4c41', hi: '#a1887f' },
      face: { lashes: true, lips: '#e91e63', blush: true },
      head: [{ type: 'earring_pearl' }],
      neck: [{ type: 'cross', color: '#ffffff' }],
      outfit: { top: 'dress', topColor: '#5c6bc0', accent: '#ffffff', sleeves: 'long', bottom: 'skirt', skirt: { length: 84, color: '#5c6bc0', trim: '#ffffff' }, shoes: '#212121', shoeAccent: null },
      drawFront(ctx, info) {
        if (info.f.state === 'victory' || info.f.state === 'special') {
          const h = info.J.fHand;
          VF.Draw.line(ctx, h.x, h.y, h.x + 3, h.y - 14, '#222', 5);
          VF.Draw.circle(ctx, h.x + 4, h.y - 18, 6, '#bdbdbd', 2.4);
        }
      },
      victoryPose: (t) => VF.Poses.P({ lean: -0.12, head: -0.3, fa: [1.3, PI + 0.6], ba: [PI - 0.8 + Math.sin(t * 3) * 0.2, PI - 0.4], fl: [0.1, 0.05], bl: [-0.1, -0.05] })
    },
    special: { type: 'sound', name: 'VOZ DIVINA', icon: '🎤', color: '#4fc3f7', desc: 'Canta e solta três ondas sonoras de energia que atravessam a arena.' },
    ultimate: { name: 'GRANDE CORAL', desc: 'Um coral invisível: várias ondas sonoras em sequência atingem o adversário.', approach: 'screen', hits: 10, style: 'cast', castIcon: 'note', gap: 0.11, dmg: 15, finisher: 'choir', color: '#4fc3f7' },
    ai: { prefer: 'far' }
  });
})();
