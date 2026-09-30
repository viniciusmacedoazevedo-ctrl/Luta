/* LEIDIANE — cabelo liso preto, pele clara, elegante, confiante, frequenta a igreja. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'leidiane', name: 'LEIDIANE',
    title: 'A Elegante',
    desc: 'Elegante e confiante: encanta o adversário e finaliza sem tirar o sorriso.',
    style: 'Charme • combos rápidos',
    color: '#d81b60',
    stats: { power: 6, speed: 7, defense: 6 },
    archetype: 'balanced',
    anim: { stance: 'elegant', swagger: 0.6, poses: { jab: 'slap', kick: 'highkick', heavy: 'palm', launcher: 'risekick' } },
    combo: 'ESPECIAL (charme) → Leve → Leve → Chute alto → Pesado → dash → Para trás → ↑ → Aéreo',
    look: {
      skin: 'pale',
      build: { torso: 70, width: 26, limb: 11, head: 25, leg: 1.06 },
      hair: { style: 'long_straight', color: '#0d0d0d', hi: '#424242', length: 1.15 },
      face: { lashes: true, lips: '#c62828', blush: true, iris: '#3e2723' },
      head: [{ type: 'earring_pearl' }],
      neck: [{ type: 'pearls' }],
      outfit: { top: 'dress', topColor: '#212121', accent: '#d81b60', sleeves: 'long', bottom: 'skirt', skirt: { length: 80, color: '#212121', trim: '#d81b60' }, shoes: '#d81b60', shoeAccent: null },
      victoryPose: (t) => VF.Poses.P({ lean: -0.2, head: -0.35, fa: [PI - 0.3, PI + 0.6], ba: [-0.6, 0.9], fl: [0.05, -0.1], bl: [0.15, -0.1] })
    },
    special: { type: 'charm', name: 'CHARME SUPREMO', icon: '🌹', color: '#d81b60', icon2: 'rose', desc: 'Animação estilizada e cômica: um charme que deixa o adversário vulnerável e o puxa para perto.' },
    ultimate: { name: 'LEIDIANE FINAL', desc: 'Combo rápido seguido de um ataque poderoso com chuva de rosas.', approach: 'rush', hits: 9, style: 'precise', gap: 0.08, dmg: 15, finisher: 'roses', color: '#d81b60' },
    ai: { prefer: 'mid' }
  });
})();
