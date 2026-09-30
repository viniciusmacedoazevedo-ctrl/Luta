/* ALLANE — cabelo cacheado, simpática, divertida e provocadora. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'allane', name: 'ALLANE',
    title: 'A Provocadora',
    desc: 'Simpática, divertida e provocadora: seus cachos viram um redemoinho de energia.',
    style: 'Giros • área próxima',
    color: '#26c6da',
    stats: { power: 6, speed: 7, defense: 6 },
    archetype: 'acrobat',
    anim: { stance: 'casual', swagger: 0.8, poses: { jab: 'backfist', kick: 'highkick', heavy: 'spin', launcher: 'launcher' } },
    combo: 'Leve → Chute alto → Pesado giratório → ESPECIAL (cachos) → oponente no ar → ↑ → Aéreo',
    look: {
      skin: 'tan',
      build: { torso: 68, width: 27, limb: 11, head: 26 },
      hair: { style: 'curly_long', color: '#4e342e' },
      face: { lashes: true, lips: '#c2185b', blush: true, mouth: 'smirk' },
      head: [{ type: 'earring_hoop' }],
      outfit: { top: 'blouse', topColor: '#26c6da', accent: '#ffffff', sleeves: 'short', bottomColor: '#3949ab', shoes: '#ffffff', shoeAccent: '#26c6da' },
      victoryPose: (t) => VF.Poses.P({ lean: -0.15 + Math.sin(t * 6) * 0.1, head: -0.2, fa: [PI - 0.4, PI - 0.1 + Math.sin(t * 12) * 0.3], ba: [0.4, 2.2], fl: [0.2, 0.05], bl: [-0.2, -0.1] })
    },
    special: { type: 'hair_vortex', name: 'CURLY STORM', icon: '🌀', color: '#26c6da', desc: 'O cabelo vira uma energia giratória que acerta várias vezes e lança o adversário.' },
    ultimate: { name: 'CURLY CHAOS', desc: 'Grande ataque giratório: um tornado de cachos e energia.', approach: 'rush', hits: 10, style: 'elegant', gap: 0.08, dmg: 14, finisher: 'curly', color: '#26c6da' },
    ai: { prefer: 'close' }
  });
})();
