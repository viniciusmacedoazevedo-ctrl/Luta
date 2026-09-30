/* Definição dos lutadores: atributos, golpes e poder especial.
   Hitbox "box" = [x à frente, y (negativo = para cima a partir dos pés), largura, altura].
   Tempos em segundos. Dano base (multiplicado por "power" do atacante e
   dividido por "defense" do defensor). */
(function () {
  const clone = (o) => JSON.parse(JSON.stringify(o));

  const BASE = {
    punch: {
      pose: 'punch', dur: 0.30, cancel: 0.14,
      hits: [{ s: 0.07, e: 0.13, box: [20, -182, 82, 54], dmg: 40, stun: 0.27, kb: 120, sfx: 'punch', spark: 1 }]
    },
    kick: {
      pose: 'kick', dur: 0.42, cancel: 0.22,
      hits: [{ s: 0.13, e: 0.21, box: [28, -128, 102, 58], dmg: 60, stun: 0.33, kb: 190, sfx: 'kick', spark: 1.3 }]
    },
    heavy: {
      pose: 'heavy', dur: 0.62, cancel: 0.42, move: { s: 0.05, e: 0.26, v: 260 },
      hits: [{ s: 0.24, e: 0.34, box: [25, -205, 98, 80], dmg: 100, stun: 0.5, kb: 430, sfx: 'heavy', spark: 2, shake: 9 }]
    },
    air: {
      pose: 'air', air: true, dur: 0.45,
      hits: [{ s: 0.08, e: 0.36, box: [8, -118, 92, 70], dmg: 55, stun: 0.32, kb: 170, sfx: 'kick', spark: 1.2 }]
    }
  };

  function build(opts) {
    const a = clone(BASE);
    if (opts.override) for (const k in opts.override) a[k] = clone(opts.override[k]);
    const tm = opts.timeMul || 1;
    const reach = opts.reach || 0;
    for (const k in a) {
      const at = a[k];
      at.dur *= tm;
      if (at.cancel) at.cancel *= tm;
      if (at.move) { at.move.s *= tm; at.move.e *= tm; }
      at.hits.forEach((h) => { h.s *= tm; h.e *= tm; h.box[2] += reach; });
    }
    return a;
  }

  VF.CHARACTERS = [
    {
      id: 'vini',
      name: 'VINI',
      title: 'O Protagonista',
      desc: 'Equilibrado, bom ataque e boa defesa. Perfeito para começar.',
      style: 'Equilibrado • velocidade média',
      color: '#29b6f6',
      stats: { power: 7, speed: 6, defense: 7 },
      walk: 330, jump: 1060, dashSpeed: 1050, dashTime: 0.18, runMult: 1.65,
      power: 1.0, defense: 1.0,
      attacks: build({ timeMul: 1.0 }),
      moveNames: { punch: 'Soco', kick: 'Chute', heavy: 'Ataque forte', air: 'Chute aéreo' },
      special: {
        id: 'blast', name: 'VINI BLAST', icon: '👓',
        desc: 'Concentra energia nos óculos e dispara uma rajada de energia para frente.'
      },
      parody: false
    },
    {
      id: 'arthur',
      name: 'ARTHUR',
      title: 'O Relâmpago',
      desc: 'Muito rápido e ágil. Menos força, mas golpes em sequência.',
      style: 'Velocidade extrema • combos rápidos',
      color: '#ffd600',
      stats: { power: 4, speed: 10, defense: 4 },
      walk: 440, jump: 1120, dashSpeed: 1650, dashTime: 0.13, runMult: 1.7,
      power: 0.78, defense: 0.9,
      attacks: build({
        timeMul: 0.76,
        override: {
          heavy: {
            pose: 'combo', dur: 0.62, cancel: 0.5, move: { s: 0.0, e: 0.2, v: 220 },
            hits: [
              { s: 0.07, e: 0.12, box: [20, -182, 90, 56], dmg: 32, stun: 0.3, kb: 50, sfx: 'punch', spark: 1 },
              { s: 0.2, e: 0.25, box: [28, -130, 100, 60], dmg: 32, stun: 0.3, kb: 50, sfx: 'kick', spark: 1.1 },
              { s: 0.34, e: 0.4, box: [22, -205, 100, 80], dmg: 55, stun: 0.45, kb: 360, sfx: 'heavy', spark: 1.6, shake: 6 }
            ]
          }
        }
      }),
      moveNames: { punch: 'Soco rápido', kick: 'Chute rápido', heavy: 'Combo (3 golpes)', air: 'Chute aéreo' },
      special: {
        id: 'flash', name: 'FLASH ARTHUR', icon: '⚡',
        desc: 'Desaparece, surge atrás do adversário e desfere uma sequência relâmpago.'
      },
      parody: false
    },
    {
      id: 'juexu',
      name: 'JUEXU',
      title: 'A Sombra Elegante',
      desc: 'Elegante e técnica. Ótimo alcance e ataque aéreo mortal.',
      style: 'Equilibrada • bom alcance',
      color: '#b36bff',
      stats: { power: 6, speed: 7, defense: 6 },
      walk: 350, jump: 1080, dashSpeed: 1100, dashTime: 0.17, runMult: 1.6,
      power: 0.96, defense: 0.98,
      attacks: build({
        timeMul: 0.95, reach: 28,
        override: {
          air: {
            pose: 'dive', air: true, dur: 0.5, dive: { vx: 560, vy: 820 },
            hits: [{ s: 0.06, e: 0.45, box: [10, -110, 95, 80], dmg: 78, stun: 0.4, kb: 260, sfx: 'kick', spark: 1.5, shake: 4 }]
          }
        }
      }),
      moveNames: { punch: 'Soco', kick: 'Chute longo', heavy: 'Golpe giratório', air: 'Ataque aéreo (mergulho)' },
      special: {
        id: 'dark', name: 'ENERGIA SOMBRIA', icon: '🔮',
        desc: 'Envolve o corpo em energia roxa e lança uma esfera sombria devastadora.'
      },
      parody: false
    },
    {
      id: 'lula',
      name: 'LULA',
      title: 'O Larápio de Desenho Animado',
      desc: 'Caricatura fictícia. Lento, mas cada golpe pesa muito.',
      style: 'Lento • dano altíssimo',
      color: '#ff5252',
      stats: { power: 10, speed: 3, defense: 6 },
      walk: 250, jump: 960, dashSpeed: 800, dashTime: 0.2, runMult: 1.5,
      power: 1.35, defense: 1.05,
      attacks: build({
        timeMul: 1.2,
        override: {
          heavy: {
            pose: 'grab', dur: 0.72,
            hits: [{ s: 0.1, e: 0.2, box: [18, -195, 72, 160], dmg: 95, stun: 0.5, kb: 520, kbY: -780, knockdown: true, unblockable: true, sfx: 'grab', spark: 1.8, shake: 10 }]
          }
        }
      }),
      moveNames: { punch: 'Soco pesado', kick: 'Chute', heavy: 'Agarrão (indefensável)', air: 'Pisão aéreo' },
      special: {
        id: 'steal', name: 'MÃO LEVE', icon: '🫳',
        desc: 'Mecânica fictícia e cômica: avança e "pega emprestada" parte da barra SPECIAL do adversário.'
      },
      parody: true
    },
    {
      id: 'bolsonaro',
      name: 'BOLSONARO',
      fullName: 'JAIR BOLSONARO',
      title: 'O Chefe de Estado Exagerado',
      desc: 'Caricatura fictícia. Defesa altíssima e golpes fortes.',
      style: 'Defesa alta • velocidade média',
      color: '#2ecc71',
      stats: { power: 8, speed: 5, defense: 10 },
      walk: 300, jump: 1000, dashSpeed: 950, dashTime: 0.18, runMult: 1.55,
      power: 1.15, defense: 1.35,
      attacks: build({ timeMul: 1.06 }),
      moveNames: { punch: 'Soco', kick: 'Chute', heavy: 'Ataque forte', air: 'Chute aéreo' },
      special: {
        id: 'speech', name: 'DISCURSO DE PODER', icon: '📣',
        desc: 'Faz um discurso inflamado e solta uma onda de choque que empurra o adversário.'
      },
      parody: true
    }
  ];

  VF.getCharacter = (id) => VF.CHARACTERS.find((c) => c.id === id) || VF.CHARACTERS[0];
})();
