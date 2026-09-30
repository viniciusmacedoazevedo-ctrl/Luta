/* DEYVERSON — coordenador de escola, usa peruca. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'deyverson', name: 'DEYVERSON',
    title: 'O Coordenador',
    desc: 'O coordenador mais temido da escola. Sua peruca é uma arma mágica.',
    style: 'Equilibrado • projétil que volta',
    color: '#8d6e63',
    stats: { power: 6, speed: 5, defense: 7 },
    archetype: 'balanced',
    anim: { stance: 'casual', swagger: 0.3, poses: { jab: 'slap', heavy: 'hammer', kick: 'frontkick' } },
    combo: 'Leve → Leve → Chute → Pesado → ESPECIAL (peruca vai e volta) → dash → Leve → Para trás',
    look: {
      skin: 'light',
      hair: { style: 'wig', color: '#6d4c41' },
      face: { browColor: '#4e342e', mouth: 'normal' },
      neck: [{ type: 'lanyard', color: '#1565c0' }, { type: 'whistle' }],
      outfit: { top: 'polo', topColor: '#1565c0', accent: '#ffffff', sleeves: 'short', bottomColor: '#a1887f', shoes: '#212121', shoeAccent: null },
      victoryPose: (t) => VF.Poses.P({ lean: 0.05, head: 0.05, fa: [1.4, PI - 0.1 + Math.sin(t * 9) * 0.2], ba: [-0.3, 0.4], fl: [0.2, 0.05], bl: [-0.2, -0.15] })
    },
    special: { type: 'wig_boomerang', name: 'PERUCA SUPREMA', icon: '👱', color: '#8d6e63', desc: 'Tira a peruca e a lança como um objeto mágico; ela volta acertando várias vezes.' },
    ultimate: { name: 'PERUCA INFINITA', desc: 'Várias perucas aparecem pela tela e atacam o adversário de todos os lados.', approach: 'screen', hits: 10, style: 'cast', castIcon: 'wig', color2: '#6d4c41', gap: 0.11, dmg: 14, finish: 150, finisher: 'wigs', color: '#8d6e63' },
    ai: { prefer: 'mid' }
  });
})();
