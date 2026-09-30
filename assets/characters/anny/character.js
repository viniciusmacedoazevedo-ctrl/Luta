/* ANNY — mulher negra, cabelo liso loiro, roupa esportiva, ama academia. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'anny', name: 'ANNY',
    title: 'A Rata de Academia',
    desc: 'Força física absurda. Nunca pula o treino de perna — nem na luta.',
    style: 'Força física alta',
    color: '#ff6d00',
    stats: { power: 9, speed: 6, defense: 6 },
    archetype: 'power',
    anim: { stance: 'brawler', swagger: 0.4, poses: { heavy: 'double', kick: 'frontkick', forward: 'tackle', airHeavy: 'axe' } },
    combo: 'ESPECIAL (buff) → Leve → Chute → Pesado → dash → Para frente → parede → Leve → Chute',
    look: {
      skin: 'dark',
      build: { torso: 70, width: 32, limb: 14, head: 26, leg: 1.04 },
      hair: { style: 'long_straight', color: '#f5d76e', hi: '#fff3b0' },
      face: { lashes: true, lips: '#8e2461', browColor: '#3e2723' },
      head: [{ type: 'headband', color: '#ff6d00' }, { type: 'earring_stud', color: '#ffd54f' }],
      outfit: { top: 'sport', topColor: '#ff6d00', accent: '#212121', sleeves: 'none', bottomColor: '#212121', shoes: '#ffffff', shoeAccent: '#ff6d00' },
      drawFront(ctx, info) {
        if (info.f.state === 'victory') { ctx.save(); ctx.translate(info.J.fHand.x, info.J.fHand.y); VF.BigFX.icon(ctx, 'dumbbell', 18, '#ff6d00'); ctx.restore(); }
      },
      victoryPose: (t) => VF.Poses.P({ lean: -0.05, head: -0.1, fa: [2.0, PI + 0.5 + Math.sin(t * 6) * 0.25], ba: [2.0, PI + 0.5], fl: [0.45, 0.1], bl: [-0.45, -0.4] })
    },
    special: { type: 'buff', name: 'ACADEMIA MODE', icon: '💪', color: '#ff6d00', time: 7, desc: 'Aumenta temporariamente a força e a velocidade (e empurra quem estiver perto).' },
    ultimate: { name: 'LEG DAY', desc: 'Uma sequência exagerada de golpes físicos fortíssimos com um pisão final.', approach: 'rush', hits: 7, style: 'heavy', gap: 0.13, dmg: 22, finish: 170, finisher: 'legday', color: '#ff6d00', finishPose: 'hammer' },
    ai: { prefer: 'close', aggression: 0.1 }
  });
})();
