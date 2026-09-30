/* WAL — mulher mais velha, cabelo roxo cacheado. Controle de área. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'wal', name: 'WAL',
    title: 'A Senhora dos Ventos',
    desc: 'Experiente e paciente: domina o espaço com tornados roxos.',
    style: 'Controle de área',
    color: '#ab47bc',
    stats: { power: 5, speed: 5, defense: 7 },
    archetype: 'zoner',
    anim: { stance: 'elegant', idleSpeed: 3, poses: { jab: 'palm', heavy: 'double', kick: 'frontkick' } },
    combo: 'ESPECIAL (tornado) → oponente no ar → Leve → Chute → Para trás → ↑ → Aéreo pesado',
    look: {
      skin: 'brown',
      build: { torso: 68, width: 32, limb: 12, head: 27, leg: 0.95, belly: 8 },
      hair: { style: 'curly_big', color: '#8e24aa' },
      face: { wrinkles: true, lashes: true, lips: '#8e2461', browColor: '#6a1b9a' },
      head: [{ type: 'earring_pearl' }],
      neck: [{ type: 'pearls' }],
      outfit: { top: 'cardigan', topColor: '#4a148c', inner: '#f8bbd0', sleeves: 'long', bottom: 'skirt', skirt: { length: 80, color: '#311b92', trim: '#ce93d8' }, shoes: '#3e2723', shoeAccent: null },
      victoryPose: (t) => VF.Poses.P({ lean: -0.05, head: -0.15, fa: [PI - 0.5 + Math.sin(t * 4) * 0.3, PI - 0.3], ba: [-0.6, 0.8], fl: [0.1, 0.05], bl: [-0.1, -0.05] })
    },
    special: { type: 'tornado', name: 'TORNADO ROXO', icon: '🌪️', color: '#ab47bc', desc: 'Cria um tornado roxo que permanece na arena por alguns segundos, levantando o adversário.' },
    ultimate: { name: 'MEGA TORNADO', desc: 'Um tornado gigantesco cobre parte da arena e arremessa o oponente.', approach: 'screen', hits: 8, style: 'cast', castIcon: 'wave', gap: 0.12, dmg: 16, finish: 160, finisher: 'tornado', color: '#ab47bc', juggle: true },
    ai: { prefer: 'far' }
  });
})();
