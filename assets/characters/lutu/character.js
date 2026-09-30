/* LUTU — uma DUPLA (casal) que luta como um único personagem.
   Os dois aparecem juntos, atacam em sincronia e trocam de posição. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'lutu', name: 'LUTU',
    title: 'A Dupla',
    desc: 'Dois lutadores, um só coração: atacam juntos, trocam de posição e finalizam em dupla.',
    style: 'Dupla • ataques sincronizados',
    color: '#ff8a65',
    stats: { power: 7, speed: 6, defense: 6 },
    archetype: 'balanced',
    anim: { stance: 'boxer', poses: { heavy: 'double', kick: 'kick' } },
    moves: {
      heavy: { hits: [
        { s: 0.2, e: 0.26, box: [25, -206, 110, 84], dmg: 45, stun: 0.45, kb: 60, sfx: 'punch', spark: 1.3 },
        { s: 0.32, e: 0.38, box: [25, -206, 110, 84], dmg: 50, stun: 0.5, kb: 440, sfx: 'heavy', spark: 1.8, shake: 7, zoom: 1.1 }
      ] }
    },
    combo: 'Leve → Chute → Pesado (golpe duplo) → dash → ESPECIAL (troca de posições) → ULTIMATE',
    look: {
      skin: 'tan',
      hair: { style: 'short', color: '#3e2723' },
      face: { mouth: 'smirk', beard: 'stubble' },
      outfit: { top: 'tee', topColor: '#ff8a65', accent: '#ffffff', logo: 'LU', sleeves: 'short', bottomColor: '#37474f', shoes: '#ffffff', shoeAccent: '#ff8a65' },
      victoryPose: (t) => VF.Poses.P({ lean: -0.05, head: -0.15, fa: [PI - 0.3, PI - 0.05], ba: [1.2, 2.6], fl: [0.25, 0.1], bl: [-0.25, -0.2] })
    },
    partner: {
      skin: 'light',
      build: { torso: 66, width: 26, limb: 11, head: 25, leg: 1.0 },
      hair: { style: 'ponytail', color: '#4e342e' },
      face: { lashes: true, lips: '#d81b60', blush: true },
      head: [{ type: 'earring_hoop' }],
      outfit: { top: 'tee', topColor: '#4db6ac', accent: '#ffffff', logo: 'TU', sleeves: 'short', bottomColor: '#263238', shoes: '#ffffff', shoeAccent: '#4db6ac' }
    },
    special: { type: 'duo_combo', name: 'ATAQUE DO CASAL', icon: '💑', color: '#ff8a65', hits: 6, dmg: 22, finish: 70, gap: 0.12, desc: 'Os dois avançam juntos e executam um combo sincronizado, trocando de posição a cada golpe.' },
    ultimate: { name: 'LUTU COMBO', desc: 'Ataques alternados e sincronizados terminando em um golpe conjunto explosivo.', approach: 'rush', hits: 10, style: 'duo', dmg: 15, finisher: 'duo', color: '#ff8a65' },
    ai: { prefer: 'mid' }
  });
})();
