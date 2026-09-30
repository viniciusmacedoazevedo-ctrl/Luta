/* DOCINHO — pastor, cabelo BEM cacheado, roupa social. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'docinho', name: 'DOCINHO',
    title: 'O Pastor',
    desc: 'Sereno e firme. Suas bênçãos iluminam a arena e empurram o adversário.',
    style: 'Equilibrado • área de luz',
    color: '#ffca28',
    stats: { power: 7, speed: 5, defense: 7 },
    archetype: 'balanced',
    anim: { stance: 'stiff', idleSpeed: 3, poses: { jab: 'palm', heavy: 'double', kick: 'frontkick' } },
    combo: 'Leve → Chute → Pesado → ESPECIAL (bênção) → parede → dash → Para frente',
    look: {
      skin: 'brown',
      build: { torso: 72, width: 33, limb: 13, head: 27 },
      hair: { style: 'curly_tight', color: '#2b1a12' },
      face: { browColor: '#2b1a12', mouth: 'normal', beard: 'stubble' },
      outfit: { top: 'suit', topColor: '#37474f', collar: '#ffffff', tie: '#ffca28', sleeves: 'long', bottomColor: '#37474f', shoes: '#111111', shoeAccent: null },
      drawFront(ctx, info) {
        if (info.f.state === 'victory') {
          const h = info.J.bHand;
          VF.Draw.shape(ctx, (g) => g.rect(h.x - 12, h.y - 16, 24, 30), '#4e342e', 2.5);
          VF.Draw.line(ctx, h.x, h.y - 10, h.x, h.y + 6, '#ffd54f', 2);
          VF.Draw.line(ctx, h.x - 5, h.y - 5, h.x + 5, h.y - 5, '#ffd54f', 2);
        }
      },
      victoryPose: (t) => VF.Poses.P({ lean: -0.08, head: -0.35, fa: [PI - 0.35, PI - 0.1], ba: [0.9, 2.0], fl: [0.2, 0.05], bl: [-0.2, -0.15] })
    },
    special: { type: 'bless_wave', name: 'BENÇÃO SUPREMA', icon: '🙌', color: '#ffca28', desc: 'Levanta as mãos e cria uma grande onda de luz ao redor (e recupera um pouco de vida).' },
    ultimate: { name: 'CHUVA DE BENÇÃOS', desc: 'Vários feixes de luz caem sobre a arena e atingem o adversário.', approach: 'screen', hits: 9, style: 'cast', castIcon: 'light', color2: '#fff59d', gap: 0.12, dmg: 16, finisher: 'lightrain', color: '#ffca28' },
    ai: { prefer: 'mid' }
  });
})();
