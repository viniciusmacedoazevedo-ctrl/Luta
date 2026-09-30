/* MUSKITO — nerd de tecnologia, óculos, cabelo meio crespo (diferente do Docinho). */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'muskito', name: 'MUSKITO',
    title: 'O Hacker',
    desc: 'Técnico e tecnológico: controla drones e transforma a arena em código.',
    style: 'Técnico • tecnologia',
    color: '#00e676',
    stats: { power: 5, speed: 6, defense: 6 },
    archetype: 'technical',
    anim: { stance: 'nerd', idleSpeed: 5, poses: { jab: 'palm', heavy: 'double', kick: 'frontkick' } },
    combo: 'ESPECIAL (drones) → Baixo → Baixo → Chute → Pesado → drones continuam atirando',
    look: {
      skin: 'tan',
      hair: { style: 'curly_medium', color: '#3e2723' },
      face: { glasses: 'rect', browColor: '#3e2723' },
      neck: [{ type: 'headphones', color: '#00e676' }],
      outfit: { top: 'hoodie', topColor: '#263238', accent: '#00e676', sleeves: 'long', bottomColor: '#37474f', shoes: '#eceff1', shoeAccent: '#00e676' },
      victoryPose: (t) => VF.Poses.P({ lean: 0.1, head: 0.05, fa: [1.3, 2.3 + Math.sin(t * 30) * 0.1], ba: [1.2, 2.2 - Math.sin(t * 30) * 0.1], fl: [0.2, 0.05], bl: [-0.2, -0.2] })
    },
    special: { type: 'drones', name: 'NERD MODE', icon: '💻', color: '#00e676', desc: 'Ativa o modo tecnológico: dois drones aparecem e disparam lasers por alguns segundos.' },
    ultimate: { name: 'SUPER COMPUTADOR', desc: 'A arena vira código digital e vários ataques tecnológicos são disparados.', approach: 'screen', hits: 10, style: 'cast', castIcon: 'digital', gap: 0.1, dmg: 15, finisher: 'digital', color: '#00e676' },
    ai: { prefer: 'far' }
  });
})();
