/* GABRIEL MORAIS — cabelo parecido com o do Vini, mas SEM franja. Equilibrado. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'gabriel', name: 'GABRIEL MORAIS', short: 'GABRIEL',
    title: 'O Rival',
    desc: 'Equilibrado e agressivo na hora certa: avança como um foguete.',
    style: 'Equilibrado • avanço rápido',
    color: '#ff7043',
    stats: { power: 7, speed: 7, defense: 6 },
    archetype: 'balanced',
    anim: { stance: 'brawler', poses: { heavy: 'hook', kick: 'kick', forward: 'shoulder' } },
    combo: 'Leve → Leve → Chute → Pesado → dash → Leve → Chute → ESPECIAL (avanço) → ULTIMATE',
    look: {
      skin: 'light',
      hair: { style: 'textured', color: '#2b1d14' },
      face: { browColor: '#2b1d14', mouth: 'smirk' },
      neck: [{ type: 'chain' }],
      outfit: { top: 'tee', topColor: '#ff7043', accent: '#263238', logo: 'G', sleeves: 'short', bottomColor: '#37474f', shoes: '#212121', shoeAccent: '#ff7043' },
      victoryPose: (t) => VF.Poses.P({ lean: 0.05, head: -0.1, fa: [1.6, 1.0], ba: [1.4, 0.9], fl: [0.3, 0.1], bl: [-0.3, -0.25] })
    },
    special: { type: 'rush', name: 'MORAIS RUSH', icon: '💨', color: '#ff7043', hits: 5, dmg: 22, finish: 60, desc: 'Avança muito rápido e executa uma sequência de golpes que termina lançando o oponente.' },
    ultimate: { name: 'MORAIS FINAL', desc: 'Combo veloz terminando com um golpe poderoso que explode na parede.', approach: 'rush', hits: 10, style: 'punch', gap: 0.08, dmg: 14, finisher: 'impact', color: '#ff7043' },
    ai: { prefer: 'close', aggression: 0.1 }
  });
})();
