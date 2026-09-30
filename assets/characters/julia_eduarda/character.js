/* JULIA EDUARDA — energia sombria, cabelo longo, visual marcante. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'julia_eduarda', name: 'JULIA EDUARDA', short: 'JULIA E.',
    title: 'A Sombra',
    desc: 'Domina a energia sombria e ataca de média distância com golpes elegantes.',
    style: 'Energia sombria • médio alcance',
    color: '#b36bff',
    stats: { power: 7, speed: 7, defense: 5 },
    archetype: 'range',
    anim: { stance: 'elegant', poses: { kick: 'highkick', heavy: 'spin', airHeavy: 'axe', launcher: 'risekick' } },
    combo: 'Leve → Chute alto → Pesado → dash → Leve → Para trás → ↑ → Aéreo → Machado aéreo → ESPECIAL',
    look: {
      skin: 'fair',
      build: { torso: 70, width: 27, limb: 11, head: 25, leg: 1.06, arm: 1.02, foot: 0.9, belly: 4 },
      hair: { style: 'long_side', color: '#231031', hi: '#9b4dca' },
      face: { lashes: true, lips: '#c2185b', blush: true, iris: '#4a148c' },
      head: [{ type: 'flower', color: '#ff4081' }, { type: 'earring_hoop' }],
      outfit: { top: 'fighter', topColor: '#7b1fa2', accent: '#ff4081', sleeves: 'none', forearm: '#e1bee7', bottomColor: '#1b1b24', shoes: '#2b2b36', shoeAccent: '#b36bff' },
      victoryPose: (t) => VF.Poses.P({ lean: -0.06, head: -0.2 + Math.sin(t * 2) * 0.05, fa: [PI - 0.25, PI + 0.3], ba: [-0.65, 0.85], fl: [-0.12, -0.05], bl: [0.22, 0.1] })
    },
    special: { type: 'dark_burst', name: 'SHADOW BURST', icon: '🔮', color: '#b36bff', desc: 'Concentra energia roxa ao redor do corpo e cria uma explosão escura que lança o oponente.' },
    ultimate: { name: 'SHADOW STORM', desc: 'Sequência de golpes com energia roxa seguida de uma explosão sombria gigante.', approach: 'rush', hits: 9, style: 'dark', finisher: 'dark', color: '#b36bff' },
    ai: { prefer: 'mid' }
  });
})();
