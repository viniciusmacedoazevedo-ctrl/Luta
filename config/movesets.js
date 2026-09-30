/* MOVESETS — golpes, hitboxes e rotas de combo.
   Hitbox "box" = [x à frente, y (negativo = acima dos pés), largura, altura].
   Tempos em segundos. "next" = golpes em que este pode ser CANCELADO quando acerta.
   Propriedades de acerto:
     launch     → joga o oponente para cima (combo aéreo)
     slam       → bate o oponente no chão (quica e pode continuar)
     wallbounce → arremessa e quica na parede
     knockdown  → derruba      unblockable → não pode ser defendido
   Cada personagem escolhe um arquétipo e pode sobrescrever qualquer golpe. */
(function () {
  const clone = (o) => JSON.parse(JSON.stringify(o));

  const BASE = {
    light: {
      pose: 'jab', dur: 0.26, cancel: 0.1,
      hits: [{ s: 0.06, e: 0.11, box: [20, -184, 82, 54], dmg: 30, stun: 0.3, kb: 90, sfx: 'punch', spark: 0.9 }],
      next: ['light', 'medium', 'heavy', 'low', 'back', 'forward', 'grab']
    },
    medium: {
      pose: 'kick', dur: 0.4, cancel: 0.19,
      hits: [{ s: 0.12, e: 0.2, box: [28, -134, 106, 60], dmg: 50, stun: 0.36, kb: 170, sfx: 'kick', spark: 1.2 }],
      next: ['heavy', 'back', 'forward', 'low', 'sweep']
    },
    heavy: {
      pose: 'heavy', dur: 0.6, cancel: 0.38, move: { s: 0.04, e: 0.24, v: 260 },
      hits: [{ s: 0.24, e: 0.33, box: [25, -206, 102, 84], dmg: 86, stun: 0.5, kb: 470, sfx: 'heavy', spark: 2, shake: 8, zoom: 1.12 }],
      next: [], dashCancel: true
    },
    low: {
      pose: 'low', dur: 0.3, cancel: 0.13,
      hits: [{ s: 0.08, e: 0.14, box: [18, -72, 108, 62], dmg: 32, stun: 0.33, kb: 100, sfx: 'kick', spark: 0.9 }],
      next: ['low', 'medium', 'heavy', 'sweep', 'back']
    },
    sweep: {
      pose: 'sweep', dur: 0.55, cancel: 0.4,
      hits: [{ s: 0.16, e: 0.26, box: [12, -56, 135, 56], dmg: 58, stun: 0.5, kb: 200, kbY: -380, knockdown: true, sfx: 'heavy', spark: 1.4 }],
      next: []
    },
    forward: {
      pose: 'forward', dur: 0.55, cancel: 0.38, move: { s: 0.03, e: 0.22, v: 540 },
      hits: [{ s: 0.18, e: 0.28, box: [20, -204, 108, 115], dmg: 68, stun: 0.45, kb: 640, kbY: -260, knockdown: true, wallbounce: true, sfx: 'heavy', spark: 1.6, shake: 6, zoom: 1.1 }],
      next: [], dashCancel: true
    },
    back: {
      pose: 'launcher', dur: 0.5, cancel: 0.28,
      hits: [{ s: 0.12, e: 0.22, box: [8, -236, 92, 170], dmg: 52, stun: 0.6, kb: 60, kbY: -1000, launch: true, sfx: 'launch', spark: 1.4, shake: 4 }],
      next: [], jumpCancel: true
    },
    air: {
      pose: 'air', air: true, dur: 0.34, cancel: 0.15,
      hits: [{ s: 0.06, e: 0.2, box: [6, -124, 94, 76], dmg: 40, stun: 0.35, kb: 140, kbY: -430, sfx: 'kick', spark: 1.1 }],
      next: ['air2', 'airHeavy']
    },
    air2: {
      pose: 'air2', air: true, dur: 0.32, cancel: 0.14,
      hits: [{ s: 0.06, e: 0.18, box: [10, -170, 90, 70], dmg: 36, stun: 0.35, kb: 120, kbY: -400, sfx: 'punch', spark: 1 }],
      next: ['airHeavy']
    },
    airHeavy: {
      pose: 'airHeavy', air: true, dur: 0.5,
      hits: [{ s: 0.1, e: 0.3, box: [-5, -150, 110, 135], dmg: 68, stun: 0.5, kb: 120, kbY: 950, slam: true, knockdown: true, sfx: 'heavy', spark: 2, shake: 10, zoom: 1.14 }],
      next: []
    },
    grab: {
      pose: 'grab', dur: 0.66,
      hits: [{ s: 0.08, e: 0.16, box: [14, -205, 72, 175], dmg: 88, stun: 0.5, kb: 500, kbY: -720, knockdown: true, unblockable: true, grab: true, sfx: 'grab', spark: 1.7, shake: 10, zoom: 1.12 }],
      next: []
    }
  };

  /* Arquétipos: ajustes aplicados sobre a base */
  const ARCHETYPES = {
    balanced: {},
    speed: { timeMul: 0.78, repeat: 4, dmgMul: 0.85, allDash: true },
    power: { timeMul: 1.14, dmgMul: 1.18, kbMul: 1.2 },
    range: { reach: 34, timeMul: 1.02 },
    grappler: { timeMul: 1.15, dmgMul: 1.1, grabMul: 1.45, grabReach: 28 },
    technical: { lowReach: 32, stunMul: 1.15 },
    acrobat: { timeMul: 0.9, airMul: 1.25, repeat: 3 },
    zoner: { reach: 18, timeMul: 1.0 }
  };

  VF.buildMoveset = function (archetype, overrides, extra) {
    const a = clone(BASE);
    const mod = Object.assign({}, ARCHETYPES[archetype] || {}, extra || {});
    if (overrides) {
      for (const k in overrides) {
        if (overrides[k] === null) { delete a[k]; continue; }
        a[k] = Object.assign(a[k] ? clone(a[k]) : {}, clone(overrides[k]));
      }
    }
    const tm = mod.timeMul || 1;
    for (const k in a) {
      const at = a[k];
      if (!at.hits) continue;
      if (!at._raw) {
        at.dur *= tm;
        if (at.cancel) at.cancel *= tm;
        if (at.move) { at.move.s *= tm; at.move.e *= tm; }
      }
      at.hits.forEach((h) => {
        if (!at._raw) { h.s *= tm; h.e *= tm; }
        h.dmg = Math.round(h.dmg * (mod.dmgMul || 1) * (k === 'grab' ? mod.grabMul || 1 : 1) * ((k.startsWith('air') && mod.airMul) || 1));
        if (mod.kbMul) h.kb = Math.round(h.kb * mod.kbMul);
        if (mod.stunMul) h.stun *= mod.stunMul;
        if (mod.reach) h.box[2] += mod.reach;
        if (mod.lowReach && (k === 'low' || k === 'sweep')) h.box[2] += mod.lowReach;
        if (mod.grabReach && k === 'grab') h.box[2] += mod.grabReach;
      });
      if (mod.allDash && at.next && !at.air) at.dashCancel = true;
    }
    a._repeat = mod.repeat || 2;
    return a;
  };

  VF.MOVE_NAMES = {
    light: 'Ataque leve', medium: 'Chute', heavy: 'Ataque pesado', low: 'Ataque baixo', sweep: 'Rasteira',
    forward: 'Ataque para frente', back: 'Ataque para trás (lançador)', air: 'Ataque aéreo', air2: 'Soco aéreo',
    airHeavy: 'Aéreo pesado (bate no chão)', grab: 'Agarrão'
  };
})();
