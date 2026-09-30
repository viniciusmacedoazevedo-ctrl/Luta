/* JULIA NEGREIROS — roupa de igreja, elegante, personalidade confiante. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'julia_negreiros', name: 'JULIA NEGREIROS', short: 'JULIA N.',
    title: 'A Confiante',
    desc: 'Elegante e segura de si: um olhar e o adversário fica sem reação.',
    style: 'Precisão • atordoamento',
    color: '#ec407a',
    stats: { power: 6, speed: 7, defense: 6 },
    archetype: 'balanced',
    anim: { stance: 'elegant', swagger: 0.5, poses: { jab: 'slap', kick: 'highkick', heavy: 'palm', launcher: 'risekick' } },
    combo: 'ESPECIAL (olhar) → Leve → Leve → Chute alto → Pesado → dash → Para trás → ↑ → Aéreo',
    look: {
      skin: 'light',
      build: { torso: 68, width: 26, limb: 11, head: 25, leg: 1.05 },
      hair: { style: 'long_bangs', color: '#4e342e', hi: '#8d6e63' },
      face: { lashes: true, lips: '#d81b60', blush: true, iris: '#5d4037' },
      head: [{ type: 'earring_pearl' }],
      neck: [{ type: 'pearls' }],
      outfit: { top: 'dress', topColor: '#f06292', accent: '#ffffff', sleeves: 'short', bottom: 'skirt', skirt: { length: 82, color: '#f06292', trim: '#ffffff' }, shoes: '#ffffff', shoeAccent: '#ec407a' },
      victoryPose: (t) => VF.Poses.P({ lean: -0.1, head: -0.25, fa: [-0.5, 0.9], ba: [-0.6, 0.8], fl: [-0.1, -0.05], bl: [0.2, 0.05] })
    },
    special: { type: 'gaze', name: 'OLHAR DE JULIA', icon: '😏', color: '#ec407a', text: 'SEM REAÇÃO!', desc: 'Uma animação cômica: um olhar fulminante deixa o adversário vulnerável por alguns segundos.' },
    ultimate: { name: 'JULIA FINAL', desc: 'Uma sequência de ataques precisos que termina em uma explosão de brilhos.', approach: 'rush', hits: 9, style: 'precise', finisher: 'sparkles', color: '#ec407a' },
    ai: { prefer: 'mid' }
  });
})();
