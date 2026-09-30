/* JOVANIRA — mulher negra, baixinha, professora de matemática, óculos. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'jovanira', name: 'JOVANIRA',
    title: 'A Professora de Matemática',
    desc: 'Baixinha e implacável: resolve a luta com equações impossíveis.',
    style: 'Técnica • matemática',
    color: '#00897b',
    stats: { power: 5, speed: 6, defense: 7 },
    archetype: 'technical',
    anim: { stance: 'stiff', idleSpeed: 4, poses: { jab: 'palm', kick: 'kneekick', heavy: 'hammer' } },
    combo: 'Baixo → Baixo → Chute → ESPECIAL (equações) → Pesado → Para frente',
    look: {
      skin: 'dark',
      build: { torso: 62, width: 30, limb: 12, head: 27, leg: 0.88, belly: 8, scale: 0.9 },
      hair: { style: 'short_curly', color: '#1b1b1b' },
      face: { glasses: 'thick', lips: '#6d2c3e', browColor: '#111' },
      head: [{ type: 'earring_stud', color: '#ffd54f' }],
      neck: [{ type: 'lanyard', color: '#00897b' }],
      outfit: { top: 'blouse', topColor: '#00897b', accent: '#b2dfdb', collar: '#ffffff', sleeves: 'long', bottom: 'skirt', skirt: { length: 74, color: '#004d40' }, shoes: '#212121', shoeAccent: null },
      drawFront(ctx, info) {
        if (info.f.state === 'victory') VF.BigFX.TYPES.bigtext(ctx, { x: info.J.fHand.x, y: info.J.fHand.y - 30, text: '10', size: 30, color: '#ffd600' }, 0.5);
      },
      victoryPose: (t) => VF.Poses.P({ lean: 0.02, head: -0.1, fa: [PI - 0.5, PI - 0.2], ba: [-0.4, 0.9], fl: [0.15, 0.05], bl: [-0.15, -0.1] })
    },
    special: { type: 'equations', name: 'EQUAÇÃO IMPOSSÍVEL', icon: '➗', color: '#1de9b6', desc: 'Números e equações cercam o adversário e se fecham sobre ele.' },
    ultimate: { name: 'MATEMÁTICA FINAL', desc: 'Várias fórmulas aparecem ao redor do oponente e terminam em uma explosão.', approach: 'screen', hits: 9, style: 'cast', castIcon: 'formula', gap: 0.12, dmg: 16, finisher: 'formulas', color: '#1de9b6' },
    ai: { prefer: 'mid', aggression: -0.05 }
  });
})();
