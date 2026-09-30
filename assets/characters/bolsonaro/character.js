/* JAIR BOLSONARO — CARICATURA FICTÍCIA / PARÓDIA de videogame (chefe de Estado exagerado).
   Nenhuma habilidade representa fatos sobre a pessoa real. */
(function () {
  const PI = Math.PI;
  VF.defineCharacter({
    id: 'bolsonaro', name: 'BOLSONARO', fullName: 'JAIR BOLSONARO', parody: true,
    title: 'O Chefe de Estado Exagerado',
    desc: 'Caricatura fictícia. Defesa altíssima, golpes fortes e discursos que empurram tudo.',
    style: 'Defesa alta • força alta',
    color: '#2ecc71',
    stats: { power: 8, speed: 5, defense: 10 },
    archetype: 'power',
    anim: { stance: 'stiff', idleSpeed: 3.2, poses: { heavy: 'double', kick: 'frontkick', forward: 'shoulder' } },
    combo: 'Leve → Chute frontal → Para frente (empurra) → parede → dash → Pesado → ESPECIAL',
    look: {
      skin: 'fair',
      build: { torso: 70, width: 38, limb: 14, head: 28, leg: 0.98, arm: 1.0, foot: 1.1, belly: 8 },
      headShape: 'oval',
      hair: { style: 'side_part', color: '#595959', temple: '#a8a8a8' },
      face: { browColor: '#3d3d3d', browW: 4.5, serious: true, nose: 'big', wrinkles: true },
      outfit: { top: 'suit', topColor: '#1e2a47', collar: '#ffffff', tie: '#0e7a3d', pocket: '#ffd400', sleeves: 'long', bottomColor: '#1e2a47', shoes: '#101010', shoeAccent: null },
      alt: { shirt: '#3e2723', upperArm: '#3e2723', foreArm: '#3e2723', pants: '#3e2723', tie: '#c62828' },
      sash: (f) => !!f && (f.state === 'victory' || f.state === 'special' || f.state === 'ultimate' || f.introSash),
      drawFront(ctx, info) {
        if (info.f.state === 'special') {
          const h = info.J.fHand;
          VF.Draw.line(ctx, h.x, h.y, h.x + 4, h.y - 14, '#222', 5);
          VF.Draw.circle(ctx, h.x + 5, h.y - 18, 6, '#9e9e9e', 2.4);
        }
      },
      victoryPose: (t) => { const s = Math.sin(t * 5); return VF.Poses.P({ lean: -0.08, head: -0.2, fa: [PI - 0.55 + s * 0.12, PI - 0.4 + s * 0.12], ba: [PI - 0.25 - s * 0.12, PI - 0.15 - s * 0.12], fl: [0.25, 0.1], bl: [-0.25, -0.25] }); }
    },
    special: { type: 'speech_wave', name: 'DISCURSO DE PODER', icon: '📣', color: '#2ecc71', desc: 'Faz um discurso inflamado e lança uma onda de energia que empurra o adversário.' },
    ultimate: { name: 'DISCURSO FINAL', desc: 'Uma onda de energia gigantesca atravessa a arena inteira.', approach: 'screen', hits: 5, style: 'cast', castIcon: 'wave', gap: 0.18, dmg: 26, finish: 150, finisher: 'megawave', color: '#2ecc71' },
    ai: { prefer: 'mid', aggression: -0.05 }
  });
})();
