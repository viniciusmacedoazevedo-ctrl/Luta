/* LIVIA — cabelo longo, confiante/abusada, rápida e agressiva. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'livia', name: 'LIVIA',
    title: 'A Abusada',
    desc: 'Confiante e sem paciência: pressiona o tempo todo com golpes rapidíssimos.',
    style: 'Rápida • agressiva',
    color: '#ff1744',
    stats: { power: 5, speed: 9, defense: 4 },
    archetype: 'speed',
    anim: { stance: 'brawler', swagger: 0.7, idleSpeed: 5.5, poses: { jab: 'jab', jab2: 'slap', kick: 'highkick', heavy: 'spin' } },
    combo: 'Leve ×4 → Chute alto → dash → Leve → Chute → Para trás → ↑ → Aéreo → ESPECIAL',
    look: {
      skin: 'light',
      build: { torso: 68, width: 26, limb: 11, head: 25, leg: 1.04 },
      hair: { style: 'long_straight', color: '#3e2723', length: 1.1 },
      face: { lashes: true, lips: '#e91e63', browTilt: 0.12 },
      head: [{ type: 'earring_hoop' }],
      outfit: { top: 'bomber', topColor: '#212121', inner: '#ff1744', accent: '#ff1744', sleeves: 'long', bottomColor: '#37474f', shoes: '#ffffff', shoeAccent: '#ff1744' },
      victoryPose: (t) => VF.Poses.P({ lean: -0.15, head: -0.3, fa: [2.3, PI + 0.6], ba: [-0.5, 0.9], fl: [0.05, -0.05], bl: [0.2, 0.05] })
    },
    special: { type: 'flurry', name: 'LIVIA ATTACK', icon: '💢', color: '#ff1744', desc: 'Avança e desfere uma sequência rapidíssima de socos, tapas e chutes.' },
    ultimate: { name: 'LIVIA RUSH', desc: 'Combo extremamente rápido com vários efeitos, terminando em cortes vermelhos.', approach: 'rush', hits: 14, style: 'slap', gap: 0.065, dmg: 12, finisher: 'slashes', color: '#ff1744' },
    ai: { prefer: 'close', aggression: 0.2 }
  });
})();
