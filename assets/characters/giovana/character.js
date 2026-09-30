/* GIOVANA GOBI — cabelo cacheado, simpática. (Ex-namorada do Docinho no universo do jogo.) */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'giovana', name: 'GIOVANA GOBI', short: 'GIOVANA',
    title: 'A Ex',
    desc: 'Simpática... até lembrar do ex. Transforma o coração partido em golpe.',
    style: 'Equilibrada • combos cômicos',
    color: '#e040fb',
    stats: { power: 6, speed: 7, defense: 5 },
    archetype: 'balanced',
    anim: { stance: 'casual', swagger: 0.6, poses: { jab: 'slap', jab2: 'backfist', kick: 'kneekick', heavy: 'spin' } },
    combo: 'Tapa → Tapa → Joelhada → Pesado → dash → ESPECIAL (coração) → ULTIMATE',
    look: {
      skin: 'light',
      build: { torso: 68, width: 27, limb: 11, head: 26 },
      hair: { style: 'curly_long', color: '#6d4c41' },
      face: { lashes: true, lips: '#ad1457', blush: true },
      head: [{ type: 'clip', color: '#e040fb' }],
      outfit: { top: 'blouse', topColor: '#e040fb', accent: '#ffffff', sleeves: 'none', bottomColor: '#283593', shoes: '#ffffff', shoeAccent: '#e040fb' },
      drawFront(ctx, info) {
        if (info.f.state === 'victory') { ctx.save(); ctx.translate(info.J.fHand.x, info.J.fHand.y - 20); VF.BigFX.icon(ctx, 'heart', 16, '#e040fb'); ctx.restore(); }
      },
      victoryPose: (t) => VF.Poses.P({ lean: -0.1, head: -0.2, fa: [PI - 0.3, PI - 0.1], ba: [-0.6, 0.8], fl: [0.2, 0.05], bl: [-0.2, -0.1] })
    },
    special: { type: 'heartbreak', name: 'EX ATTACK', icon: '💔', color: '#e040fb', desc: 'Ataque cômico sobre o tema ex-casal: arremessa um coração partido que explode no adversário.' },
    ultimate: { name: 'EX COMBO', desc: 'Uma sequência divertida de tapas e golpes que termina em um grande coração partido.', approach: 'rush', hits: 10, style: 'slap', gap: 0.09, dmg: 14, finisher: 'heartbreak', color: '#e040fb' },
    ai: { prefer: 'mid' }
  });
})();
