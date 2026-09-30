/* ARTHUR — magrinho, cabelo estiloso, rapidíssimo. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'arthur', name: 'ARTHUR',
    title: 'O Relâmpago',
    desc: 'Extremamente rápido: combos longos com golpes leves que não param de vir.',
    style: 'Velocidade extrema • combos rápidos',
    color: '#ffd600',
    stats: { power: 4, speed: 10, defense: 4 },
    archetype: 'speed',
    anim: { stance: 'kicker', swagger: 0.6, idleSpeed: 6, poses: { jab: 'jab', kick: 'highkick', heavy: 'spin', launcher: 'risekick' } },
    moves: {
      heavy: { pose: 'combo', dur: 0.62, cancel: 0.5, move: { s: 0, e: 0.2, v: 240 },
        hits: [
          { s: 0.07, e: 0.12, box: [20, -184, 92, 56], dmg: 30, stun: 0.32, kb: 50, sfx: 'punch', spark: 1 },
          { s: 0.2, e: 0.25, box: [28, -134, 102, 62], dmg: 30, stun: 0.32, kb: 50, sfx: 'kick', spark: 1.1 },
          { s: 0.34, e: 0.4, box: [22, -206, 102, 82], dmg: 52, stun: 0.45, kb: 380, sfx: 'heavy', spark: 1.6, shake: 6, zoom: 1.1 }
        ], next: [] }
    },
    combo: 'Leve ×4 → Chute → Para trás → ↑ → Aéreo ×2 → Aéreo pesado → dash → Leve → ESPECIAL',
    look: {
      skin: 'tan',
      build: { torso: 76, width: 24, limb: 10, head: 25, leg: 1.08, arm: 1.05, foot: 0.95, belly: 1 },
      hair: { style: 'quiff', color: '#2e1c10', tip: '#ffcc33' },
      face: { mouth: 'smirk', sleepy: true },
      head: [{ type: 'earring_stud' }],
      outfit: { top: 'bomber', topColor: '#ffc400', inner: '#1b1b1b', accent: '#1b1b1b', sleeves: 'long', bottomColor: '#1c1c22', shoes: '#e53935', shoeAccent: '#ffffff' },
      victoryPose: (t) => VF.Poses.P({ lean: -0.12, head: -0.12, fa: [1.45, 1.95 + Math.sin(t * 10) * 0.08], ba: [-0.55, 0.9], fl: [0.08, 0.02], bl: [0.28, -0.05] })
    },
    special: { type: 'blink', name: 'FLASH ARTHUR', icon: '⚡', color: '#ffd600', desc: 'Desaparece e reaparece em várias posições, atacando o adversário de todos os lados.' },
    ultimate: { name: 'FLASH COMBO', desc: 'Uma sequência absurdamente rápida de ataques de todos os lados.', approach: 'rush', hits: 14, style: 'flash', gap: 0.065, dmg: 12, finisher: 'slashes', color: '#ffd600' },
    ai: { prefer: 'close', aggression: 0.15, jumpy: 0.05 }
  });
})();
