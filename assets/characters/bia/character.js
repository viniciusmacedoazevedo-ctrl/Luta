/* BIA — alta, cabelo liso castanho-claro, óculos. Bom alcance e precisão. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'bia', name: 'BIA',
    title: 'A Atiradora',
    desc: 'Alta e precisa: acerta de longe antes que o adversário chegue perto.',
    style: 'Longo alcance • precisão',
    color: '#8bc34a',
    stats: { power: 6, speed: 6, defense: 6 },
    archetype: 'range',
    anim: { stance: 'elegant', poses: { jab: 'jab', kick: 'frontkick', heavy: 'palm', forward: 'forward' } },
    combo: 'ESPECIAL (flechas) de longe → Chute longo → Pesado → dash → Chute → Para trás',
    look: {
      skin: 'fair',
      build: { torso: 76, width: 27, limb: 11, head: 25, leg: 1.12, arm: 1.08, scale: 1.04 },
      hair: { style: 'long_straight', color: '#a1887f', hi: '#d7ccc8' },
      face: { glasses: 'rect', lashes: true, lips: '#ad1457' },
      outfit: { top: 'cardigan', topColor: '#8bc34a', inner: '#ffffff', sleeves: 'long', bottomColor: '#5d4037', shoes: '#ffffff', shoeAccent: '#8bc34a' },
      victoryPose: (t) => VF.Poses.P({ lean: -0.05, head: -0.1, fa: [1.2, PI + 0.3], ba: [-0.5, 0.8], fl: [0.1, 0.05], bl: [-0.1, -0.05] })
    },
    special: { type: 'volley', name: 'LONG RANGE', icon: '🏹', color: '#8bc34a', desc: 'Dispara três flechas de energia de longa distância.' },
    ultimate: { name: 'MAX RANGE', desc: 'Grande sequência de ataques de longo alcance e uma chuva de flechas.', approach: 'beam', hits: 9, style: 'cast', castIcon: 'arrow', gap: 0.1, dmg: 15, finisher: 'arrows', color: '#8bc34a' },
    ai: { prefer: 'far' }
  });
})();
