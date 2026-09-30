/* BIBLIOTECA DE ANIMAÇÕES (poses por quadro-chave).
   Cada personagem tem um "estilo" de postura (boxer, elegant, heavy, casual,
   kicker, nerd, dancer, stiff, goofy, brawler) e pode trocar a variação de
   cada golpe (ex.: heavy:'hammer', medium:'frontkick'). Assim ninguém se move igual.
   Pose: { lean, head, fa:[braço, antebraço], ba, fl:[coxa, canela], bl, fixedHip, rot, ox, oy, dy } */
(function () {
  const PI = Math.PI;
  const M = VF.M;

  const BASE = { lean: 0.1, head: 0, fa: [0.7, 2.7], ba: [0.35, 2.85], fl: [0.35, 0.1], bl: [-0.3, -0.3] };

  function P(o) {
    const r = Object.assign({}, BASE, o || {});
    r.fa = (r.fa || BASE.fa).slice();
    r.ba = (r.ba || BASE.ba).slice();
    r.fl = (r.fl || BASE.fl).slice();
    r.bl = (r.bl || BASE.bl).slice();
    return r;
  }

  function lerpPose(a, b, t) {
    const r = {};
    const keys = new Set(Object.keys(a).concat(Object.keys(b)));
    for (const k of keys) {
      const va = a[k], vb = b[k];
      if (Array.isArray(va) || Array.isArray(vb)) {
        const A = va || vb, B = vb || va;
        r[k] = A.map((v, i) => v + (B[i] - v) * t);
      } else if (typeof va === 'number' || typeof vb === 'number') {
        r[k] = (va || 0) + ((vb || 0) - (va || 0)) * t;
      } else {
        r[k] = t < 0.5 ? va : vb;
      }
    }
    return r;
  }

  function keyframes(frames, t) {
    if (t <= frames[0].t) return frames[0].pose;
    for (let i = 0; i < frames.length - 1; i++) {
      const a = frames[i], b = frames[i + 1];
      if (t <= b.t) {
        const k = b.t - a.t <= 0 ? 1 : (t - a.t) / (b.t - a.t);
        return lerpPose(a.pose, b.pose, M.easeInOut(k));
      }
    }
    return frames[frames.length - 1].pose;
  }

  // ---------- posturas de luta ----------
  const STANCES = {
    boxer: P(),
    brawler: P({ lean: 0.2, fa: [1.0, 2.5], ba: [0.7, 2.6], fl: [0.42, 0.2], bl: [-0.42, -0.5] }),
    elegant: P({ lean: 0.02, head: -0.05, fa: [0.55, 2.2], ba: [0.1, 1.1], fl: [0.18, 0.05], bl: [-0.15, -0.2] }),
    heavy: P({ lean: 0.15, fa: [0.6, 2.2], ba: [0.4, 2.0], fl: [0.48, 0.15], bl: [-0.48, -0.42] }),
    casual: P({ lean: 0.0, head: -0.05, fa: [0.3, 1.2], ba: [-0.1, 0.4], fl: [0.16, 0.05], bl: [-0.16, -0.1] }),
    kicker: P({ lean: 0.04, fa: [0.9, 2.8], ba: [0.6, 2.6], fl: [0.3, 0.22], bl: [-0.35, -0.45] }),
    nerd: P({ lean: 0.2, head: 0.12, fa: [0.8, 2.4], ba: [0.6, 2.3], fl: [0.2, 0.05], bl: [-0.2, -0.2] }),
    dancer: P({ lean: -0.05, head: -0.1, fa: [1.25, 2.1], ba: [-0.6, 0.2], fl: [0.05, -0.1], bl: [0.12, -0.12] }),
    stiff: P({ lean: 0.02, head: -0.05, fa: [0.2, 1.8], ba: [0.18, 1.8], fl: [0.15, 0.05], bl: [-0.12, -0.1] }),
    goofy: P({ lean: -0.1, head: -0.12, fa: [1.4, 2.9], ba: [1.0, 2.8], fl: [0.4, 0.3], bl: [-0.3, -0.55] })
  };

  const styleOf = (f) => (f && f.def && f.def.anim && f.def.anim.stance) || 'boxer';
  const stanceOf = (f) => STANCES[styleOf(f)] || STANCES.boxer;

  // ---------- golpes (picos) ----------
  const K = {
    JUMP: P({ fixedHip: true, lean: 0.05, fa: [0.9, 2.5], ba: [-0.4, 0.6], fl: [1.15, 0.1], bl: [0.35, -0.9] }),
    FALL: P({ fixedHip: true, lean: 0.0, fa: [1.3, 2.2], ba: [-0.8, 0.0], fl: [0.6, -0.1], bl: [0.1, -0.6] }),
    jab: P({ lean: 0.28, head: 0.05, fa: [1.52, 1.56], ba: [0.25, 2.75], fl: [0.55, 0.2], bl: [-0.5, -0.5] }),
    cross: P({ lean: 0.35, head: 0.05, fa: [0.4, 2.8], ba: [1.55, 1.58], fl: [0.6, 0.25], bl: [-0.55, -0.5] }),
    palm: P({ lean: 0.3, fa: [1.45, 1.2], ba: [1.3, 1.1], fl: [0.6, 0.2], bl: [-0.5, -0.5] }),
    backfist: P({ lean: 0.1, fa: [1.9, 1.3], ba: [0.3, 2.6], fl: [0.4, 0.15], bl: [-0.4, -0.4] }),
    slap: P({ lean: 0.2, head: -0.1, fa: [1.7, 2.2], ba: [0.2, 1.5], fl: [0.45, 0.2], bl: [-0.4, -0.4] }),
    kick: P({ lean: -0.34, head: 0.12, fa: [0.45, 2.5], ba: [-0.5, 0.5], fl: [1.55, 1.6], bl: [-0.08, -0.08] }),
    highkick: P({ lean: -0.55, head: 0.25, fa: [0.2, 2.2], ba: [-0.8, 0.2], fl: [2.25, 2.3], bl: [-0.05, -0.05] }),
    frontkick: P({ lean: -0.25, fa: [0.7, 2.7], ba: [0.3, 2.6], fl: [1.3, 1.9], bl: [-0.05, -0.05] }),
    kneekick: P({ lean: 0.1, fa: [1.2, 1.5], ba: [1.0, 1.4], fl: [1.6, 0.1], bl: [-0.05, -0.05] }),
    hook: P({ lean: 0.42, head: 0.08, fa: [0.5, 2.8], ba: [1.75, 1.95], fl: [0.85, 0.35], bl: [-0.65, -0.55] }),
    hammer: P({ lean: 0.35, head: 0.1, fa: [1.2, 0.9], ba: [1.1, 0.8], fl: [0.7, 0.3], bl: [-0.6, -0.5] }),
    double: P({ lean: 0.4, fa: [1.55, 1.5], ba: [1.5, 1.45], fl: [0.9, 0.35], bl: [-0.7, -0.6] }),
    shoulder: P({ lean: 0.55, head: 0.15, fa: [0.3, 1.6], ba: [-0.5, 0.4], fl: [0.9, 0.4], bl: [-0.75, -0.7] }),
    spin: P({ lean: -0.2, head: -0.1, fa: [1.6, 1.7], ba: [-1.6, -1.5], fl: [0.35, 0.15], bl: [-0.25, -0.3] }),
    low: P({ lean: 0.25, fa: [1.0, 1.6], ba: [0.5, 2.5], fl: [1.25, 1.5], bl: [-0.9, -0.2] }),
    lowjab: P({ lean: 0.4, fa: [1.75, 1.75], ba: [0.6, 2.6], fl: [1.3, 0.1], bl: [-0.9, -1.8] }),
    sweep: P({ lean: 0.5, head: 0.2, fa: [1.2, 1.0], ba: [0.8, 0.6], fl: [1.55, 1.58], bl: [-1.0, -2.2] }),
    forward: P({ lean: 0.5, head: 0.1, fa: [1.6, 1.4], ba: [0.3, 2.4], fl: [1.0, 0.5], bl: [-0.8, -0.9] }),
    tackle: P({ lean: 0.7, head: 0.2, fa: [1.2, 0.8], ba: [0.2, 1.8], fl: [0.9, 0.3], bl: [-0.9, -1.0] }),
    launcher: P({ lean: -0.1, head: -0.2, fa: [2.7, 2.95], ba: [0.3, 2.6], fl: [0.5, 0.15], bl: [-0.35, -0.3] }),
    risekick: P({ lean: -0.6, head: 0.2, fa: [0.3, 2.3], ba: [-0.6, 0.3], fl: [2.7, 2.75], bl: [0.05, 0.05] }),
    air: P({ fixedHip: true, lean: -0.15, fa: [0.8, 2.3], ba: [-0.7, 0.1], fl: [1.4, 1.35], bl: [0.4, -0.6] }),
    air2: P({ fixedHip: true, lean: 0.25, fa: [1.5, 1.45], ba: [0.2, 2.5], fl: [0.9, 0.2], bl: [0.1, -0.8] }),
    airHeavy: P({ fixedHip: true, lean: 0.35, head: 0.15, fa: [2.2, 1.2], ba: [2.0, 1.0], fl: [1.1, 0.4], bl: [0.3, -0.7] }),
    axe: P({ fixedHip: true, lean: -0.3, fa: [0.9, 2.2], ba: [-0.6, 0.2], fl: [2.4, 1.2], bl: [0.1, -0.6] }),
    dive: P({ fixedHip: true, lean: 0.35, head: -0.1, fa: [-0.5, 0.3], ba: [-0.9, -0.3], fl: [0.85, 0.9], bl: [-0.25, -0.95] }),
    grab: P({ lean: 0.32, fa: [1.4, 1.5], ba: [1.3, 1.42], fl: [0.6, 0.3], bl: [-0.5, -0.4] }),
    throw: P({ lean: -0.25, head: -0.2, fa: [2.7, 2.95], ba: [2.5, 2.85], fl: [0.3, 0.1], bl: [-0.3, -0.3] }),
    block: P({ lean: -0.05, head: -0.08, fa: [0.95, 3.0], ba: [0.85, 3.05], fl: [0.55, -0.15], bl: [-0.45, -0.65] }),
    hurt: P({ lean: -0.42, head: -0.35, fa: [-0.3, -0.1], ba: [-0.6, -0.3], fl: [0.3, 0.1], bl: [-0.45, -0.3] }),
    lying: P({ rot: -PI / 2, ox: 108, oy: -16, lean: 0, head: 0.1, fa: [-0.3, 0.4], ba: [0.3, 0.9], fl: [0.08, 0.1], bl: [-0.1, 0.05] }),
    kneel: P({ lean: 0.55, head: 0.35, fa: [0.2, 0.1], ba: [0.1, 0.05], fl: [1.35, 0.1], bl: [-0.2, -1.5] }),
    charge: P({ lean: -0.15, head: -0.25, fa: [PI - 0.5, PI - 0.3], ba: [PI - 0.3, PI - 0.1], fl: [0.35, 0.1], bl: [-0.35, -0.3] }),
    thrust: P({ lean: 0.3, fa: [1.55, 1.6], ba: [1.4, 1.5], fl: [0.65, 0.25], bl: [-0.6, -0.5] }),
    pose: P({ lean: -0.1, head: -0.2, fa: [PI - 0.4, PI - 0.1], ba: [-0.5, 0.8], fl: [0.25, 0.1], bl: [-0.25, -0.2] })
  };
  // peso visual do "wind-up" de cada pico
  const WIND = {
    jab: P({ lean: 0.04, fa: [0.35, 2.9], ba: [0.45, 2.8] }),
    heavy: P({ lean: -0.14, fa: [0.3, 2.9], ba: [-0.9, 0.3], fl: [0.3, 0.1], bl: [-0.2, -0.3] }),
    kick: P({ lean: -0.1, fa: [0.6, 2.6], ba: [0.2, 2.6], fl: [1.25, -0.2], bl: [-0.1, -0.1] }),
    low: P({ lean: 0.2, fl: [0.7, 0.1], bl: [-0.6, -0.8] })
  };

  // variação padrão de cada golpe (pode ser trocada por personagem em def.anim.poses)
  const DEFAULT_VARIANT = {
    jab: 'jab', kick: 'kick', heavy: 'hook', low: 'low', sweep: 'sweep', forward: 'forward',
    launcher: 'launcher', air: 'air', air2: 'air2', airHeavy: 'airHeavy', grab: 'grab'
  };

  function variantFor(f, key) {
    const map = (f.def && f.def.anim && f.def.anim.poses) || {};
    return K[map[key]] || K[DEFAULT_VARIANT[key] || key] || K.jab;
  }

  // ---------- animações ----------
  function idle(t, f) {
    const st = stanceOf(f);
    const spd = (f && f.def && f.def.anim && f.def.anim.idleSpeed) || 4.2;
    const b = Math.sin(t * spd);
    const p = P(st);
    p.lean += b * 0.025;
    p.head += b * 0.03;
    p.fa = [st.fa[0] + b * 0.06, st.fa[1] + b * 0.05];
    p.ba = [st.ba[0] - b * 0.05, st.ba[1]];
    p.fl = [st.fl[0] + b * 0.05, st.fl[1] - b * 0.07];
    p.bl = [st.bl[0] - b * 0.04, st.bl[1] + b * 0.05];
    return p;
  }

  function walk(t, back, f) {
    const st = stanceOf(f);
    const swag = (f && f.def && f.def.anim && f.def.anim.swagger) || 0;
    const ph = t * (back ? 9 : 10) * (back ? -1 : 1);
    const s = Math.sin(ph), c = Math.cos(ph);
    const ft = 0.1 + 0.42 * s, bt = 0.1 - 0.42 * s;
    const p = P(st);
    p.lean = st.lean + 0.02 + Math.sin(ph * 2) * swag * 0.05;
    p.head = st.head + Math.sin(ph) * swag * 0.06;
    p.fa = [st.fa[0] + s * (0.08 + swag * 0.3), st.fa[1]];
    p.ba = [st.ba[0] - s * (0.08 + swag * 0.3), st.ba[1]];
    p.fl = [ft, ft - 0.1 - 0.6 * Math.max(0, c)];
    p.bl = [bt, bt - 0.1 - 0.6 * Math.max(0, -c)];
    return p;
  }

  function run(t) {
    const ph = t * 15;
    const s = Math.sin(ph), c = Math.cos(ph);
    const ft = 0.2 + 0.75 * s, bt = 0.2 - 0.75 * s;
    return P({
      lean: 0.38, head: -0.15,
      fa: [0.4 - 0.9 * s, 0.4 - 0.9 * s + 1.7], ba: [0.4 + 0.9 * s, 0.4 + 0.9 * s + 1.7],
      fl: [ft, ft - 0.2 - 1.0 * Math.max(0, c)],
      bl: [bt, bt - 0.2 - 1.0 * Math.max(0, -c)]
    });
  }

  function dash(f) {
    if (f && f.dashDir && f.dashDir !== f.facing) return P({ lean: -0.35, head: -0.1, fa: [0.9, 2.7], ba: [0.6, 2.6], fl: [0.5, 0.3], bl: [-0.2, -0.6] });
    return P({ lean: 0.55, head: -0.3, fa: [-0.6, 0.2], ba: [-0.9, -0.2], fl: [1.0, 0.1], bl: [-0.7, -1.2] });
  }

  function jump(f) {
    const k = M.clamp((f.vy + 700) / 1400, 0, 1);
    return lerpPose(K.JUMP, K.FALL, k);
  }

  function block(t) {
    const p = P(K.block);
    p.lean += Math.sin(t * 5) * 0.03;
    return p;
  }

  function hurt(f) {
    const k = M.clamp(f.st / 0.12, 0, 1);
    return lerpPose(idle(0, f), K.hurt, M.easeOutCubic(k));
  }

  function knock(f) {
    const p = P(K.hurt);
    p.fixedHip = true;
    p.rot = -M.clamp(f.st * 5, 0, 1.2);
    p.fl = [0.9, 0.5];
    p.bl = [0.4, 0.0];
    p.fa = [-1.2, -0.8];
    p.ba = [-1.6, -1.0];
    return p;
  }

  function down(f) {
    const p = P(K.lying);
    if (f.hp <= 0) p.head = 0.1 + Math.sin(f.anim * 6) * 0.15;
    return p;
  }

  function getup(f) {
    const k = M.clamp(f.st / 0.35, 0, 1);
    return lerpPose(K.lying, idle(0, f), M.easeOutCubic(k));
  }

  function victory(t, f) {
    const b = Math.abs(Math.sin(t * 5));
    return P({
      lean: -0.05, head: -0.15,
      fa: [PI - 0.35, PI - 0.05 + Math.sin(t * 10) * 0.1], ba: [0.35, 2.6],
      fl: [0.2 + b * 0.1, 0.05 - b * 0.12], bl: [-0.2, -0.2 + b * 0.05]
    });
  }

  function defeat(t) {
    const p = P(K.kneel);
    p.lean += Math.sin(t * 3) * 0.03;
    return p;
  }

  function attack(f) {
    const a = f.attack;
    if (!a) return idle(f.anim, f);
    const d = a.d;
    const st = stanceOf(f);
    const base = d.air ? K.JUMP : st;
    const h0 = d.hits[0], hl = d.hits[d.hits.length - 1];
    let peak, wind;
    switch (d.pose) {
      case 'jab':
        peak = (a.rep || 0) % 2 ? variantFor(f, 'jab2') !== K.jab ? variantFor(f, 'jab2') : K.cross : variantFor(f, 'jab');
        wind = WIND.jab;
        break;
      case 'kick': peak = variantFor(f, 'kick'); wind = WIND.kick; break;
      case 'heavy': peak = variantFor(f, 'heavy'); wind = WIND.heavy; break;
      case 'low': peak = variantFor(f, 'low'); wind = WIND.low; break;
      case 'sweep': peak = variantFor(f, 'sweep'); wind = WIND.low; break;
      case 'forward': peak = variantFor(f, 'forward'); wind = WIND.heavy; break;
      case 'launcher': peak = variantFor(f, 'launcher'); wind = WIND.low; break;
      case 'grab': {
        const frames = [{ t: 0, pose: base }, { t: h0.s, pose: K.grab }, { t: h0.e, pose: K.grab },
          { t: h0.e + 0.15, pose: a.hasHit ? K.throw : K.grab }, { t: d.dur, pose: base }];
        return keyframes(frames, a.t);
      }
      case 'air':
      case 'air2':
      case 'airHeavy': {
        const pk = variantFor(f, d.pose);
        return keyframes([{ t: 0, pose: K.JUMP }, { t: h0.s, pose: pk }, { t: hl.e, pose: pk }, { t: d.dur, pose: K.FALL }], a.t);
      }
      case 'combo': {
        const frames = [{ t: 0, pose: base }];
        const seq = [K.jab, K.kick, K.hook, K.cross, K.highkick];
        d.hits.forEach((h, i) => {
          frames.push({ t: h.s, pose: seq[i % seq.length] });
          frames.push({ t: h.e, pose: seq[i % seq.length] });
        });
        frames.push({ t: d.dur, pose: base });
        return keyframes(frames, a.t);
      }
      default:
        peak = K[d.pose] || K.jab;
        wind = WIND.jab;
    }
    if (d.hits.length > 1) {
      // golpes com vários acertos alternam o pico
      const frames = [{ t: 0, pose: base }];
      d.hits.forEach((h, i) => {
        const pk = i % 2 ? K.cross : peak;
        frames.push({ t: h.s, pose: pk });
        frames.push({ t: h.e, pose: pk });
      });
      frames.push({ t: d.dur, pose: base });
      return keyframes(frames, a.t);
    }
    return keyframes([{ t: 0, pose: base }, { t: h0.s * 0.55, pose: wind }, { t: h0.s, pose: peak },
      { t: hl.e + 0.03, pose: peak }, { t: d.dur, pose: base }], a.t);
  }

  function forFighter(f) {
    const t = f.anim || 0;
    switch (f.state) {
      case 'walk': return walk(t, f.vx * f.facing < 0, f);
      case 'run': return run(t);
      case 'dash': return dash(f);
      case 'jump': return jump(f);
      case 'block':
      case 'blockstun': return block(t);
      case 'hurt': return hurt(f);
      case 'bound': return hurt({ st: 0.2, def: f.def });
      case 'dazed': {
        const p = P(K.hurt);
        p.lean = -0.2 + Math.sin(t * 4) * 0.15;
        p.head = Math.sin(t * 5) * 0.3;
        return p;
      }
      case 'knockdown': return knock(f);
      case 'down': return down(f);
      case 'getup': return getup(f);
      case 'attack': return attack(f);
      case 'special': {
        const fn = f.sp && f.sp.pose;
        if (fn) return fn(f.sp.t / f.sp.dur, f);
        const tp = VF.SpecialTypes && VF.SpecialTypes[f.def.special.type];
        return tp && tp.pose ? tp.pose(f.spT || 0, f, {}) : keyframes([{ t: 0, pose: idle(0, f) }, { t: 0.4, pose: K.charge }, { t: 0.6, pose: K.thrust }, { t: 1, pose: stanceOf(f) }], f.spT || 0);
      }
      case 'ultimate': {
        if (f.ult && f.ult.pose) return f.ult.pose(f);
        const p = f.spT || 0;
        return keyframes([{ t: 0, pose: idle(0, f) }, { t: 0.25, pose: K.charge }, { t: 0.45, pose: K.jab }, { t: 0.55, pose: K.kick }, { t: 0.65, pose: K.hook }, { t: 0.8, pose: K.thrust }, { t: 1, pose: K.pose }], p);
      }
      case 'victory': return f.skin.victoryPose ? f.skin.victoryPose(t, f) : victory(t, f);
      case 'defeat': return defeat(t);
      default: return idle(t, f);
    }
  }

  function exprFor(f) {
    switch (f.state) {
      case 'hurt':
      case 'knockdown':
      case 'blockstun':
      case 'bound':
      case 'dazed': return 'hurt';
      case 'down': return f.hp <= 0 ? 'ko' : 'hurt';
      case 'getup':
      case 'attack':
      case 'dash':
      case 'run': return 'angry';
      case 'special':
      case 'ultimate': return 'focus';
      case 'victory': return 'happy';
      case 'defeat': return 'hurt';
      default: return 'normal';
    }
  }

  VF.Poses = { P, K, STANCES, stanceOf, lerpPose, keyframes, idle, walk, run, dash, jump, block, hurt, knock, down, getup, victory, defeat, attack, forFighter, exprFor };
})();
