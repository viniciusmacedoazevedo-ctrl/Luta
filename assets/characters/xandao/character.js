/* XANDAO — CARICATURA FICTÍCIA / PARÓDIA de videogame. Careca, terno elegante, postura séria.
   Nenhuma habilidade representa fatos sobre a pessoa real. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'xandao', name: 'XANDAO', parody: true,
    title: 'O Juiz Implacável',
    desc: 'Caricatura fictícia. Defensivo e preciso: controla a luta e prende o adversário.',
    style: 'Defesa • controle • precisão',
    color: '#7e57c2',
    stats: { power: 7, speed: 5, defense: 9 },
    archetype: 'technical',
    anim: { stance: 'stiff', idleSpeed: 2.6, poses: { jab: 'palm', heavy: 'hammer', kick: 'frontkick', forward: 'forward' } },
    combo: 'Baixo → Baixo → Chute → ESPECIAL (prende) → Pesado → Para trás → ↑ → Aéreo pesado',
    look: {
      skin: 'fair',
      build: { torso: 72, width: 34, limb: 13, head: 28, leg: 1.0, belly: 5 },
      headShape: 'oval',
      hair: { style: 'bald', color: '#f3c9a8' },
      face: { browColor: '#2b2b2b', browW: 4.5, browTilt: 0.15, serious: true, mouth: 'normal' },
      outfit: { top: 'suit', topColor: '#1c1c24', collar: '#ffffff', tie: '#6a1b9a', pocket: '#ffffff', sleeves: 'long', bottomColor: '#1c1c24', shoes: '#0d0d0d', shoeAccent: null },
      victoryPose: (t) => VF.Poses.P({ lean: 0.02, head: -0.08, fa: [0.9, PI - 0.3], ba: [0.15, 1.7], fl: [0.12, 0.05], bl: [-0.12, -0.1] }),
      drawFront(ctx, info) {
        if (info.f.state === 'victory') {
          const h = info.J.fHand;
          VF.Draw.line(ctx, h.x, h.y, h.x, h.y - 30, '#5d4037', 5);
          VF.Draw.shape(ctx, (g) => g.rect(h.x - 16, h.y - 44, 32, 16), '#8d6e63', 2.5);
        }
      }
    },
    special: { type: 'bind', name: 'ORDEM JUDICIAL', icon: '⚖️', color: '#b388ff', desc: 'Cria uma barreira de energia ao redor do adversário, prendendo-o temporariamente.' },
    ultimate: { name: 'DECISÃO FINAL', desc: 'A arena escurece e um golpe cinematográfico cai como um martelo gigante.', approach: 'screen', hits: 3, style: 'cast', castIcon: 'wave', gap: 0.3, dmg: 40, finish: 190, finisher: 'gavel', color: '#b388ff' },
    ai: { prefer: 'mid', aggression: -0.1 }
  });
})();
