/* WILL — elegante, colorido, estilo clássico e movimentos fluidos. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'will', name: 'WILL',
    title: 'O Estiloso',
    desc: 'Movimentos fluidos e golpes elegantes. Luta como quem desfila.',
    style: 'Fluido • elegante',
    color: '#ff4081',
    stats: { power: 6, speed: 7, defense: 6 },
    archetype: 'acrobat',
    anim: { stance: 'dancer', swagger: 1, poses: { jab: 'backfist', kick: 'highkick', heavy: 'spin', launcher: 'risekick', airHeavy: 'axe' } },
    combo: 'Leve → Leve → Chute alto → Pesado giratório → dash → Chute → Para trás → ↑ → Aéreo → Aéreo pesado',
    look: {
      skin: 'tan',
      build: { torso: 72, width: 30, limb: 12, head: 27, leg: 1.04 },
      hair: { style: 'medium_wavy', color: '#4e342e' },
      face: { mouth: 'smirk', browColor: '#3e2723' },
      neck: [{ type: 'scarf', color: '#ffd600' }],
      outfit: { top: 'blazer', topColor: '#8e24aa', accent: '#ffd600', inner: '#ffffff', sleeves: 'long', bottomColor: '#ff7043', shoes: '#ffffff', shoeAccent: '#8e24aa' },
      victoryPose: (t) => VF.Poses.P({ lean: -0.1, head: -0.25, fa: [PI - 0.2, PI + 0.5 + Math.sin(t * 3) * 0.1], ba: [-0.7, 0.9], fl: [-0.1, -0.1], bl: [0.25, 0.05] })
    },
    special: { type: 'spin_storm', name: 'FASHION STORM', icon: '🌈', color: '#ff4081', desc: 'Gira e avança criando uma tempestade de efeitos coloridos que acerta várias vezes.' },
    ultimate: { name: 'GRAND STYLE', desc: 'Uma sequência elegante de golpes que termina com uma pose e um arco-íris.', approach: 'rush', hits: 8, style: 'elegant', finisher: 'rainbow', color: '#ff4081' },
    ai: { prefer: 'mid', jumpy: 0.05 }
  });
})();
