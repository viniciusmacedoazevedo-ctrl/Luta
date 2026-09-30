/* VINI — o protagonista. Óculos, franjinha, roupa esportiva moderna. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'vini', name: 'VINI',
    title: 'O Protagonista',
    desc: 'Um lutador equilibrado que usa seus óculos para concentrar energia.',
    style: 'Equilibrado',
    color: '#29b6f6',
    stats: { power: 7, speed: 6, defense: 6 },
    archetype: 'balanced',
    anim: { stance: 'boxer', poses: { heavy: 'hook', launcher: 'launcher' } },
    combo: 'Leve → Leve → Chute → Para trás (lança) → ↑ → Aéreo → Soco aéreo → Aéreo pesado → ESPECIAL',
    look: {
      skin: 'light',
      hair: { style: 'fringe', color: '#1d1a2b' },
      face: { glasses: 'round', glassGlow: true },
      outfit: { top: 'tee', topColor: '#1e88e5', accent: '#00e5ff', logo: 'V', sleeves: 'short', bottomColor: '#263043', shoes: '#ffffff', shoeAccent: '#ff3d3d' },
      alt: { shirt: '#e53935', upperArm: '#e53935', accent: '#ffd600', pants: '#2b2b2b' },
      victoryPose: (t) => VF.Poses.P({ lean: -0.05, head: -0.1, fa: [1.6, PI + 0.5], ba: [PI - 0.3, PI - 0.1 + Math.sin(t * 8) * 0.12], fl: [0.3, 0.1], bl: [-0.25, -0.25] }),
      ultPose: (k) => (k < 0.5 ? VF.Poses.P({ lean: -0.05, fa: [1.8, PI + 0.6], ba: [1.5, PI + 0.4] }) : VF.Poses.K.pose)
    },
    special: { type: 'beam', name: 'VINI BLAST', icon: '👓', color: '#00e5ff', desc: 'Concentra energia nos óculos e dispara uma grande rajada de energia.' },
    ultimate: { name: 'VINI FINAL BLAST', desc: 'Uma sequência rápida de golpes que termina em uma enorme explosão de energia.', approach: 'rush', hits: 8, style: 'punch', finisher: 'explosion', color: '#00e5ff' },
    ai: { prefer: 'mid' }
  });
})();
