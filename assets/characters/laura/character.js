/* LAURA — menina de igreja, nerd, roupa discreta. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'laura', name: 'LAURA',
    title: 'A Estudiosa',
    desc: 'Quietinha e estudiosa, mas quando ora o céu responde com raios de luz.',
    style: 'Distância • ataques do céu',
    color: '#7986cb',
    stats: { power: 5, speed: 6, defense: 6 },
    archetype: 'zoner',
    anim: { stance: 'nerd', idleSpeed: 3.5, poses: { jab: 'palm', heavy: 'double', kick: 'frontkick' } },
    combo: 'Leve → Chute → Pesado → ESPECIAL (raio) | Baixo → Rasteira → raio no oponente caído',
    look: {
      skin: 'fair',
      build: { torso: 68, width: 26, limb: 11, head: 26, leg: 1.0 },
      hair: { style: 'braid', color: '#5d4037' },
      face: { glasses: 'round', lashes: true, blush: true, freckles: true },
      head: [{ type: 'bow', color: '#9fa8da' }],
      neck: [{ type: 'cross', color: '#ffd54f' }],
      outfit: { top: 'cardigan', topColor: '#9fa8da', inner: '#ffffff', sleeves: 'long', bottom: 'skirt', skirt: { length: 88, color: '#3949ab' }, shoes: '#5d4037', shoeAccent: null },
      victoryPose: (t) => VF.Poses.P({ lean: -0.05, head: -0.3, fa: [1.4, PI + 0.2], ba: [1.3, PI + 0.25], fl: [0.1, 0.05], bl: [-0.1, -0.05] })
    },
    special: { type: 'lightning', name: 'RAIO DA FÉ', icon: '⚡', color: '#fff176', desc: 'Um raio de energia desce do céu exatamente sobre o adversário (dá para desviar!).' },
    ultimate: { name: 'LUZ SUPREMA', desc: 'Grande ataque de luz: raios em sequência e uma coluna de luz gigante.', approach: 'screen', hits: 7, style: 'cast', castIcon: 'bolt', gap: 0.14, dmg: 18, finisher: 'pillar', color: '#fff176' },
    ai: { prefer: 'far' }
  });
})();
