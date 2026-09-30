/* ALBERT EINSTEIN — versão TOTALMENTE FICTÍCIA e cartunesca do personagem histórico.
   Cabelo branco bagunçado, roupa clássica, animações atrapalhadas. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'einstein', name: 'ALBERT EINSTEIN', short: 'EINSTEIN', parody: true,
    title: 'O Gênio Atrapalhado',
    desc: 'Versão fictícia e cartunesca: atrapalhado, mas dobra o tempo quando quer.',
    style: 'Controle do tempo • atrapalhado',
    color: '#ffb300',
    stats: { power: 5, speed: 4, defense: 5 },
    archetype: 'zoner',
    anim: { stance: 'goofy', swagger: 1.2, idleSpeed: 7, poses: { jab: 'slap', kick: 'kneekick', heavy: 'hammer', forward: 'tackle' } },
    combo: 'ESPECIAL (tempo lento) → Leve → Leve → Chute → Pesado → Para trás → ↑ → Aéreo pesado',
    look: {
      skin: 'fair',
      build: { torso: 66, width: 32, limb: 12, head: 29, leg: 0.95, belly: 10 },
      hair: { style: 'messy_white', color: '#f5f5f5' },
      face: { mustache: 'bushy', beardColor: '#eeeeee', browColor: '#e0e0e0', browW: 4.5, wrinkles: true, nose: 'big' },
      outfit: { top: 'coat', topColor: '#6d4c41', inner: '#8d6e63', tie: '#3e2723', sleeves: 'long', bottomColor: '#5d4037', shoes: '#3e2723', shoeAccent: null },
      drawFront(ctx, info) {
        if (info.f.state === 'victory') VF.BigFX.TYPES.bigtext(ctx, { x: info.J.fHand.x + 10, y: info.J.fHand.y - 30, text: 'E=mc²', size: 22, color: '#ffffff' }, 0.5);
      },
      victoryPose: (t) => VF.Poses.P({ lean: -0.2, head: -0.3 + Math.sin(t * 5) * 0.1, fa: [PI - 0.3, PI + 0.4], ba: [-0.8, 0.5], fl: [0.4 + Math.sin(t * 8) * 0.3, 0.2], bl: [-0.3, -0.5] })
    },
    special: { type: 'time_slow', name: 'RELATIVIDADE', icon: '⏱️', color: '#80d8ff', time: 4.5, desc: 'Altera a velocidade do tempo: o adversário fica em câmera lenta por alguns segundos.' },
    ultimate: { name: 'E = MC²', desc: 'Fórmulas e relógios giram e tudo termina em uma explosão de energia gigantesca.', approach: 'screen', hits: 6, style: 'cast', castIcon: 'clock', gap: 0.16, dmg: 18, finish: 180, finisher: 'emc2', color: '#ffb300' },
    ai: { prefer: 'far', jumpy: 0.08 }
  });
})();
