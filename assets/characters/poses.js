/* Biblioteca de poses/animações compartilhada por todos os lutadores.
   Cada pose: { lean, head, fa:[braço, antebraço], ba:[...], fl:[coxa, canela], bl:[...],
   fixedHip, rot, ox, oy } */
(function () {
  const PI = Math.PI;
  const M = VF.M;

  const STANCE = { lean: 0.1, head: 0, fa: [0.7, 2.7], ba: [0.35, 2.85], fl: [0.35, 0.1], bl: [-0.3, -0.3] };

  function P(o) {
    const r = Object.assign({}, STANCE, o || {});
    r.fa = (r.fa || STANCE.fa).slice();
    r.ba = (r.ba || STANCE.ba).slice();
    r.fl = (r.fl || STANCE.fl).slice();
    r.bl = (r.bl || STANCE.bl).slice();
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

  /* Interpola uma lista de quadros-chave [{t, pose}] */
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

  // ---------- Poses-chave ----------
  const K = {
    JUMP: P({ fixedHip: true, lean: 0.05, fa: [0.9, 2.5], ba: [-0.4, 0.6], fl: [1.15, 0.1], bl: [0.35, -0.9] }),
    FALL: P({ fixedHip: true, lean: 0.0, fa: [1.3, 2.2], ba: [-0.8, 0.0], fl: [0.6, -0.1], bl: [0.1, -0.6] }),
    PUNCH: P({ lean: 0.28, head: 0.05, fa: [1.52, 1.56], ba: [0.25, 2.75], fl: [0.55, 0.2], bl: [-0.5, -0.5] }),
    PUNCH_W: P({ lean: 0.04, fa: [0.35, 2.9], ba: [0.45, 2.8], fl: [0.4, 0.1], bl: [-0.35, -0.35] }),
    KICK: P({ lean: -0.34, head: 0.12, fa: [0.45, 2.5], ba: [-0.5, 0.5], fl: [1.55, 1.6], bl: [-0.08, -0.08] }),
    KICK_W: P({ lean: -0.1, fa: [0.6, 2.6], ba: [0.2, 2.6], fl: [1.25, -0.2], bl: [-0.1, -0.1] }),
    HEAVY: P({ lean: 0.42, head: 0.08, fa: [0.5, 2.8], ba: [1.75, 1.95], fl: [0.85, 0.35], bl: [-0.65, -0.55] }),
    HEAVY_W: P({ lean: -0.14, fa: [0.3, 2.9], ba: [-0.9, 0.3], fl: [0.3, 0.1], bl: [-0.2, -0.3] }),
    GRAB: P({ lean: 0.32, fa: [1.4, 1.5], ba: [1.3, 1.42], fl: [0.6, 0.3], bl: [-0.5, -0.4] }),
    THROW: P({ lean: -0.25, head: -0.2, fa: [2.7, 2.95], ba: [2.5, 2.85], fl: [0.3, 0.1], bl: [-0.3, -0.3] }),
    AIR: P({ fixedHip: true, lean: -0.15, fa: [0.8, 2.3], ba: [-0.7, 0.1], fl: [1.4, 1.35], bl: [0.4, -0.6] }),
    DIVE: P({ fixedHip: true, lean: 0.35, head: -0.1, fa: [-0.5, 0.3], ba: [-0.9, -0.3], fl: [0.85, 0.9], bl: [-0.25, -0.95] }),
    BLOCK: P({ lean: -0.05, head: -0.08, fa: [0.95, 3.0], ba: [0.85, 3.05], fl: [0.55, -0.15], bl: [-0.45, -0.65] }),
    HURT: P({ lean: -0.42, head: -0.35, fa: [-0.3, -0.1], ba: [-0.6, -0.3], fl: [0.3, 0.1], bl: [-0.45, -0.3] }),
    LYING: P({ rot: -PI / 2, ox: 108, oy: -16, lean: 0, head: 0.1, fa: [-0.3, 0.4], ba: [0.3, 0.9], fl: [0.08, 0.1], bl: [-0.1, 0.05] }),
    KNEEL: P({ lean: 0.55, head: 0.35, fa: [0.2, 0.1], ba: [0.1, 0.05], fl: [1.35, 0.1], bl: [-0.2, -1.5] })
  };
  K.COMBO_PEAKS = [K.PUNCH, K.KICK, K.HEAVY];

  // ---------- Animações ----------
  function idle(t) {
    const b = Math.sin(t * 4.2);
    return P({
      lean: 0.1 + b * 0.025, head: b * 0.03,
      fa: [0.7 + b * 0.06, 2.7 + b * 0.05], ba: [0.35 - b * 0.05, 2.85],
      fl: [0.38 + b * 0.05, 0.1 - b * 0.07], bl: [-0.3 - b * 0.04, -0.3 + b * 0.05]
    });
  }

  function walk(t, back) {
    const ph = t * (back ? 9 : 10) * (back ? -1 : 1);
    const s = Math.sin(ph), c = Math.cos(ph);
    const ft = 0.1 + 0.42 * s, bt = 0.1 - 0.42 * s;
    return P({
      lean: 0.12, head: 0,
      fa: [0.7 + s * 0.08, 2.7], ba: [0.35 - s * 0.08, 2.85],
      fl: [ft, ft - 0.1 - 0.6 * Math.max(0, c)],
      bl: [bt, bt - 0.1 - 0.6 * Math.max(0, -c)]
    });
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

  function dash() {
    return P({ lean: 0.55, head: -0.3, fa: [-0.6, 0.2], ba: [-0.9, -0.2], fl: [1.0, 0.1], bl: [-0.7, -1.2] });
  }

  function jump(f) {
    const k = M.clamp((f.vy + 700) / 1400, 0, 1);
    return lerpPose(K.JUMP, K.FALL, k);
  }

  function block(t) {
    const b = Math.sin(t * 5) * 0.03;
    const p = P(K.BLOCK);
    p.lean += b;
    return p;
  }

  function hurt(f) {
    const k = M.clamp(f.st / 0.12, 0, 1);
    return lerpPose(idle(0), K.HURT, M.easeOutCubic(k));
  }

  function knock(f) {
    const p = P(K.HURT);
    p.fixedHip = true;
    p.rot = -M.clamp(f.st * 5, 0, 1.2);
    p.fl = [0.9, 0.5];
    p.bl = [0.4, 0.0];
    p.fa = [-1.2, -0.8];
    p.ba = [-1.6, -1.0];
    return p;
  }

  function down(f) {
    const p = P(K.LYING);
    if (f.dizzy) p.head = 0.1 + Math.sin(f.anim * 6) * 0.15;
    return p;
  }

  function getup(f) {
    const k = M.clamp(f.st / 0.35, 0, 1);
    return lerpPose(K.LYING, idle(0), M.easeOutCubic(k));
  }

  function victory(t) {
    const b = Math.abs(Math.sin(t * 5));
    return P({
      lean: -0.05, head: -0.15,
      fa: [PI - 0.35, PI - 0.05 + Math.sin(t * 10) * 0.1], ba: [0.35, 2.6],
      fl: [0.2 + b * 0.1, 0.05 - b * 0.12], bl: [-0.2, -0.2 + b * 0.05]
    });
  }

  function defeat(t) {
    const p = P(K.KNEEL);
    p.lean += Math.sin(t * 3) * 0.03;
    return p;
  }

  // Ataques genéricos montados a partir dos tempos dos hits
  function attack(f) {
    const a = f.attack;
    if (!a) return idle(f.anim);
    const d = a.d;
    const base = d.air ? K.JUMP : STANCE;
    const h0 = d.hits[0], hl = d.hits[d.hits.length - 1];
    let frames;
    switch (d.pose) {
      case 'punch':
        frames = [{ t: 0, pose: base }, { t: h0.s * 0.5, pose: K.PUNCH_W }, { t: h0.s, pose: K.PUNCH }, { t: h0.e, pose: K.PUNCH }, { t: d.dur, pose: base }];
        break;
      case 'kick':
        frames = [{ t: 0, pose: base }, { t: h0.s * 0.55, pose: K.KICK_W }, { t: h0.s, pose: K.KICK }, { t: h0.e + 0.03, pose: K.KICK }, { t: d.dur, pose: base }];
        break;
      case 'heavy':
        frames = [{ t: 0, pose: base }, { t: h0.s * 0.6, pose: K.HEAVY_W }, { t: h0.s, pose: K.HEAVY }, { t: h0.e + 0.04, pose: K.HEAVY }, { t: d.dur, pose: base }];
        break;
      case 'grab':
        frames = [{ t: 0, pose: base }, { t: h0.s, pose: K.GRAB }, { t: h0.e, pose: K.GRAB },
          { t: h0.e + 0.15, pose: a.hasHit ? K.THROW : K.GRAB }, { t: d.dur, pose: base }];
        break;
      case 'combo': {
        frames = [{ t: 0, pose: base }];
        d.hits.forEach((h, i) => {
          const pk = K.COMBO_PEAKS[i % K.COMBO_PEAKS.length];
          frames.push({ t: h.s, pose: pk });
          frames.push({ t: h.e, pose: pk });
        });
        frames.push({ t: d.dur, pose: base });
        break;
      }
      case 'air':
        frames = [{ t: 0, pose: K.JUMP }, { t: h0.s, pose: K.AIR }, { t: hl.e, pose: K.AIR }, { t: d.dur, pose: K.FALL }];
        break;
      case 'dive':
        frames = [{ t: 0, pose: K.JUMP }, { t: h0.s, pose: K.DIVE }, { t: d.dur, pose: K.DIVE }];
        break;
      default:
        frames = [{ t: 0, pose: base }, { t: h0.s, pose: K.PUNCH }, { t: d.dur, pose: base }];
    }
    return keyframes(frames, a.t);
  }

  function forFighter(f) {
    const t = f.anim || 0;
    switch (f.state) {
      case 'walk': return walk(t, f.vx * f.facing < 0);
      case 'run': return run(t);
      case 'dash': return dash();
      case 'jump': return jump(f);
      case 'block':
      case 'blockstun': return block(t);
      case 'hurt': return hurt(f);
      case 'knockdown': return knock(f);
      case 'down': return down(f);
      case 'getup': return getup(f);
      case 'attack': return attack(f);
      case 'special': {
        const fn = VF.SpecialPoses && VF.SpecialPoses[f.def.special.id];
        const prog = f.sp ? f.sp.t / f.sp.dur : f.spT || 0;
        return fn ? fn(prog, f) : idle(t);
      }
      case 'victory': return f.skin.victoryPose ? f.skin.victoryPose(t) : victory(t);
      case 'defeat': return defeat(t);
      default: return idle(t);
    }
  }

  function exprFor(f) {
    switch (f.state) {
      case 'hurt':
      case 'knockdown':
      case 'blockstun': return 'hurt';
      case 'down': return f.hp <= 0 ? 'ko' : 'hurt';
      case 'getup': return 'angry';
      case 'attack':
      case 'dash':
      case 'run': return 'angry';
      case 'special': return 'focus';
      case 'victory': return 'happy';
      case 'defeat': return 'hurt';
      default: return 'normal';
    }
  }

  VF.Poses = { P, K, STANCE, lerpPose, keyframes, idle, walk, run, dash, jump, block, hurt, knock, down, getup, victory, defeat, attack, forFighter, exprFor };
})();
