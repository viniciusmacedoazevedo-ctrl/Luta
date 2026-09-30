/* ESPECIAIS — biblioteca de tipos. Cada personagem escolhe um "type" em
   assets/characters/<id>/character.js (special.type) e pode passar parâmetros.
   Cada tipo tem: dur (duração), armor (invencível no início), update() e pose().
   Lula, Bolsonaro, Xandao e Einstein são caricaturas fictícias: seus poderes são
   apenas mecânicas cômicas de videogame. */
(function () {
  const C = VF.CONFIG, M = VF.M, PI = Math.PI;
  const R = (a, b) => a + Math.random() * (b - a);
  const PS = () => VF.Poses;

  function opp(f, w) { return w.fighters[0] === f ? w.fighters[1] : w.fighters[0]; }
  function proj(w, f, o) {
    const p = new VF.Projectile(Object.assign({ owner: f }, o));
    w.addProjectile(p);
    return p;
  }
  function ent(w, f, o) {
    const e = new VF.Entity(Object.assign({ owner: f, world: w }, o));
    w.addProjectile(e);
    return e;
  }
  const hit = (o) => Object.assign({ stun: 0.5, kb: 200, sfx: 'heavy', spark: 1.4 }, o);
  function kf(list, p) { return PS().keyframes(list.map(([t, pose]) => ({ t, pose })), p); }
  const st = (f) => PS().stanceOf(f);
  const K = () => PS().K;
  function castPose(p, f, charge, release) {
    const k = K();
    return kf([[0, PS().idle(0, f)], [0.12, charge || k.charge], [release || 0.45, charge || k.charge], [(release || 0.45) + 0.08, k.thrust], [0.85, k.thrust], [1, st(f)]], p);
  }

  const T = {
    // ---------------------------------------------------------- VINI
    beam: {
      dur: 0.85, armor: 0.35,
      update(s, f, o, w) {
        if (s.t < 0.4) {
          if (!s.a) { s.a = 1; VF.Audio.play('charge'); }
          if (Math.random() < 0.8) VF.FX.converge(w.ps, f.x + f.facing * 30, f.y - 210, s.P.color, 2, 110);
        } else if (!s.fired) {
          s.fired = true;
          VF.Audio.play('blast');
          proj(w, f, { type: 'blast', x: f.x + f.facing * 90, y: f.y - 180, vx: f.facing * 1050, w: 120, h: 76, color: s.P.color,
            hit: hit({ dmg: 175, stun: 0.6, kb: 560, kbY: -600, knockdown: true, spark: 2.4, shake: 12, zoom: 1.12, color: '#b3ffff' }) });
          w.shake(7, 0.2);
          w.flashScreen(s.P.color, 0.2);
        }
      },
      pose(p, f) {
        const P = PS().P;
        return kf([[0, PS().idle(0, f)], [0.15, P({ lean: -0.05, fa: [1.8, PI + 0.6], ba: [1.5, PI + 0.4] })], [0.47, P({ lean: -0.08, fa: [1.8, PI + 0.6], ba: [1.5, PI + 0.4] })],
          [0.55, K().thrust], [0.85, K().thrust], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- ARTHUR
    blink: {
      dur: 1.15, armor: 0.2,
      update(s, f, o, w) {
        const times = [0.1, 0.33, 0.56, 0.8];
        s.i = s.i || 0;
        f.alpha = Math.sin(s.t * 60) > 0.3 ? 1 : 0.5;
        while (s.i < times.length && s.t >= times[s.i]) {
          const last = s.i === times.length - 1;
          const side = s.i % 2 ? -1 : 1;
          let nx = o.x + side * 85;
          if (nx < C.STAGE_LEFT + 10 || nx > C.STAGE_RIGHT - 10) nx = o.x - side * 85;
          VF.FX.burst(w.ps, f.x, f.y - 110, s.P.color, 10, 380);
          f.x = M.clamp(nx, C.STAGE_LEFT, C.STAGE_RIGHT);
          f.y = s.i === 2 && !o.onGround ? o.y - 40 : f.y;
          f.facing = Math.sign(o.x - f.x) || f.facing;
          VF.Audio.play('flash');
          const box = f.hitboxWorld([-10, -230, 140, 230]);
          if (o.canBeHit() && M.overlap(box, o.hurtbox)) {
            VF.Combat.hit(w, f, o, hit({ dmg: last ? 60 : 34, stun: 0.45, kb: last ? 520 : 40, kbY: -620, knockdown: last, unblockable: true, sfx: last ? 'heavy' : 'punch', spark: last ? 2 : 1.2, shake: last ? 10 : 3, color: s.P.color }), box, f.facing, true);
          }
          VF.FX.speedLines(w.ps, f.x, f.y - 110, -f.facing, s.P.color);
          s.i++;
        }
        if (s.t > s.dur - 0.12) { f.alpha = 1; f.y = C.GROUND_Y; }
      },
      pose(p, f) {
        const k = K();
        const seq = [k.dash, k.jab, k.highkick, k.cross, k.hook];
        return PS().P(seq[Math.min(seq.length - 1, Math.floor(p * 5))]);
      }
    },

    // ---------------------------------------------------------- JULIA EDUARDA
    dark_burst: {
      dur: 1.0, armor: 0.5,
      update(s, f, o, w) {
        if (s.t < 0.45) {
          if (!s.a) { s.a = 1; VF.Audio.play('dark'); }
          VF.FX.energy(w.ps, f.x, f.y - 110, Math.random() < 0.5 ? s.P.color : '#1a0033', 3, 70);
        } else if (!s.fired) {
          s.fired = true;
          const cx = f.x + f.facing * 60, cy = f.y - 120;
          VF.BigFX.spawn(w, 'explosion', cx, cy, { color: s.P.color, color2: '#1a0033', dur: 0.6, size: 300 });
          VF.FX.burst(w.ps, cx, cy, s.P.color, 40, 800);
          VF.FX.burst(w.ps, cx, cy, '#2a0040', 20, 500);
          w.shake(12, 0.3);
          w.flashScreen(s.P.color, 0.3);
          VF.Audio.play('boom');
          if (o.canBeHit() && Math.hypot(o.x - cx, o.y - 110 - cy) < 300) {
            VF.Combat.hit(w, f, o, hit({ dmg: 170, stun: 0.6, kb: 520, kbY: -900, launch: true, knockdown: true, spark: 2.4, shake: 12, zoom: 1.15, color: '#e1bee7' }), { x: cx - 280, y: cy - 280, w: 560, h: 560 }, f.facing, true);
          }
        }
      },
      pose(p, f) { return castPose(p, f, K().charge, 0.45); }
    },

    // ---------------------------------------------------------- LULA (paródia)
    drain: {
      dur: 0.9, armor: 0.22,
      update(s, f, o, w, dt) {
        if (!s.a) { s.a = 1; VF.Audio.play('whoosh'); }
        if (s.t < 0.22) { f.vx = 0; if (Math.random() < 0.4) VF.FX.energy(w.ps, f.x + f.facing * 30, f.y - 150, '#ffd600', 1, 12); return; }
        if (s.t < 0.52 && !s.hit) {
          f.vx = f.facing * 1150;
          if (Math.random() < 0.6) VF.FX.dust(w.ps, f.x - f.facing * 20, f.y, 1, -f.facing);
          const box = f.hitboxWorld([10, -180, 95, 115]);
          if (o.canBeHit() && M.overlap(box, o.hurtbox)) {
            s.hit = true;
            f.vx = 0;
            VF.Combat.hit(w, f, o, hit({ dmg: 100, stun: 0.7, kb: 160, sfx: 'grab', spark: 1.6, unblockable: true, shake: 6, color: '#ffd600' }), box, f.facing, true);
            const stolen = Math.min(o.special, 50);
            o.special -= stolen;
            f.special = M.clamp(stolen + 20, 0, C.SPECIAL_MAX);
            VF.Audio.play('steal');
            for (let i = 0; i < 16; i++) w.ps.spawn({ x: o.x + R(-30, 30), y: o.y - 150 + R(-40, 40), vx: R(-350, 350), vy: R(-450, -100), life: 1.4, size: 6, color: i % 2 ? '#ffd600' : '#fff59d', add: true, target: f });
            VF.FX.text(w.ps, o.x, o.y - 260, stolen > 0 ? `-${Math.round(stolen)} SPECIAL` : 'BARRA VAZIA!', '#ffd600', 30, 1.2);
            VF.FX.text(w.ps, f.x, f.y - 280, 'MÃO LEVE!', '#ffffff', 36, 1.2);
          }
          return;
        }
        f.vx = M.approach(f.vx, 0, 4000 * dt);
      },
      pose(p, f, s) {
        const P = PS().P;
        if (p < 0.25) { const r = Math.sin(p * 80) * 0.25; return P({ lean: 0.12, fa: [1.0, 2.2 + r], ba: [1.0, 2.5 - r], fl: [0.4, 0.1], bl: [-0.35, -0.35] }); }
        if (!(s && s.hit) && p < 0.6) { const rp = PS().run(p * 3); rp.lean = 0.5; rp.fa = [1.55, 1.5]; return rp; }
        if (p > 0.92) return P(st(f));
        return P({ lean: -0.12, head: -0.25, fa: [0.2, 0.0], ba: [-0.3, 0.4], fl: [0.3, 0.1], bl: [-0.3, -0.3] });
      }
    },

    // ---------------------------------------------------------- BOLSONARO (paródia)
    speech_wave: {
      dur: 1.15, armor: 0.62,
      update(s, f, o, w) {
        if (!s.a) { s.a = 1; VF.Audio.play('speech'); s.next = 0; }
        if (s.t < 0.62) {
          if (s.t >= s.next) {
            s.next += 0.17;
            VF.FX.text(w.ps, f.x + f.facing * R(40, 110), f.y - R(240, 290), M.choose(['!!!', 'BLÁ BLÁ!', 'ATENÇÃO!', '!!', 'POVO!']), M.choose(['#ffd600', '#2ecc71', '#ffffff']), 26, 0.7);
          }
          if (Math.random() < 0.3) VF.FX.ring(w.ps, f.x + f.facing * 40, f.y - 200, '#ffd600', 10, 0.35);
        } else if (!s.fired) {
          s.fired = true;
          VF.Audio.play('wave');
          proj(w, f, { type: 'wave', x: f.x + f.facing * 70, y: f.y - 118, vx: f.facing * 760, w: 80, h: 235, color: '#2ecc71',
            hit: hit({ dmg: 165, stun: 0.6, kb: 950, kbY: -500, knockdown: true, wallbounce: true, spark: 2.2, shake: 12, color: '#ffd600' }) });
          w.shake(10, 0.3);
          w.flashScreen('#ffd600', 0.2);
        }
      },
      pose(p, f) {
        const P = PS().P;
        const g = Math.sin(p * 40) * 0.2;
        if (p < 0.54) return P({ lean: -0.05, head: -0.1, fa: [1.6, PI + 0.7], ba: [PI - 0.6 + g, PI - 0.3 + g], fl: [0.45, 0.1], bl: [-0.4, -0.35] });
        return kf([[0.54, K().thrust], [0.85, K().thrust], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- XANDAO (paródia)
    bind: {
      dur: 0.85, armor: 0.3,
      update(s, f, o, w) {
        if (!s.a) { s.a = 1; VF.Audio.play('gavel'); }
        if (s.t >= 0.32 && !s.fired) {
          s.fired = true;
          if (!o.canBeHit()) { VF.FX.text(w.ps, o.x, o.y - 250, 'ESCAPOU!', '#fff', 28); return; }
          const cx = o.x, cy = o.y;
          VF.Audio.play('zap');
          VF.Combat.hit(w, f, o, hit({ dmg: 45, stun: 1.8, kb: 0, unblockable: true, hold: true, sfx: 'block', spark: 1.2, color: s.P.color }), o.hurtbox, f.facing, true);
          o.applyStatus('bind', 1.9, w);
          VF.FX.text(w.ps, cx, cy - 280, 'ORDEM JUDICIAL!', '#ffffff', 34, 1.2);
          ent(w, f, {
            x: cx, y: cy, life: 1.9, tgt: o,
            onUpdate(e) { e.x = e.tgt.x; e.y = e.tgt.y; },
            draw(ctx, e) {
              const k = Math.min(1, e.t / 0.2);
              ctx.save();
              ctx.globalCompositeOperation = 'lighter';
              for (let i = 0; i < 7; i++) {
                const bx = e.x - 75 + i * 25;
                ctx.fillStyle = VF.M.hexA(s.P.color, 0.7);
                ctx.fillRect(bx - 3, e.y - 260 * k, 6, 260 * k);
              }
              ctx.strokeStyle = VF.M.hexA('#ffffff', 0.8);
              ctx.lineWidth = 5;
              ctx.strokeRect(e.x - 85, e.y - 262 * k, 170, 262 * k);
              ctx.restore();
              if (k >= 1) VF.BigFX.TYPES.bigtext(ctx, { x: e.x, y: e.y - 290, text: '⚖', size: 50, color: '#ffffff' }, 0.5);
            }
          });
        }
      },
      pose(p, f) {
        const P = PS().P;
        return kf([[0, PS().idle(0, f)], [0.2, P({ lean: 0.1, head: -0.05, fa: [1.65, 1.6], ba: [0.2, 1.7] })], [0.8, P({ lean: 0.1, fa: [1.65, 1.6], ba: [0.2, 1.7] })], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- WILL
    spin_storm: {
      dur: 1.0, armor: 0.3,
      update(s, f, o, w) {
        if (!s.a) { s.a = 1; VF.Audio.play('spin'); s.n = 0; }
        if (s.t < 0.75) {
          f.vx = f.facing * 480;
          const cols = ['#ff1744', '#ffd600', '#00e676', '#00b0ff', '#d500f9'];
          for (let i = 0; i < 2; i++) {
            const a = s.t * 30 + i * PI;
            w.ps.spawn({ x: f.x + Math.cos(a) * 70, y: f.y - 110 + Math.sin(a) * 40, vx: Math.cos(a) * 200, vy: -80, life: 0.6, size: 5, color: M.choose(cols), shape: 'rect', rot: a, spin: 8, add: true });
          }
          if (s.t > 0.1 + s.n * 0.13 && s.n < 5) {
            s.n++;
            const last = s.n === 5;
            const box = f.hitboxWorld([-40, -220, 170, 220]);
            if (o.canBeHit() && M.overlap(box, o.hurtbox)) VF.Combat.hit(w, f, o, hit({ dmg: last ? 50 : 26, stun: 0.4, kb: last ? 300 : 60, kbY: last ? -800 : 0, launch: last, sfx: 'kick', spark: 1.2, color: M.choose(cols) }), box, f.facing, true);
          }
        } else f.vx = M.approach(f.vx, 0, 60);
      },
      pose(p, f) {
        const P = PS().P;
        if (p > 0.8) return P(st(f));
        const a = p * 30;
        return P({ lean: -0.1, head: -0.2, fa: [1.6 + Math.sin(a) * 0.4, 1.7], ba: [-1.6 + Math.cos(a) * 0.4, -1.5], fl: [0.3 + Math.sin(a) * 0.5, 0.1], bl: [-0.2, -0.2] });
      }
    },

    // ---------------------------------------------------------- DEYVERSON
    wig_boomerang: {
      dur: 0.7, armor: 0.2,
      update(s, f, o, w) {
        if (s.t >= 0.22 && !s.fired) {
          s.fired = true;
          f.wigOff = true;
          VF.Audio.play('whoosh');
          VF.FX.text(w.ps, f.x, f.y - 270, 'PERUCA SUPREMA!', '#fff', 30, 1.1);
          ent(w, f, {
            x: f.x + f.facing * 40, y: f.y - 200, vx: f.facing * 1000, life: 3, dir: f.facing, back: false, cd: 0, hits: 0,
            onUpdate(e, dt) {
              e.cd -= dt;
              if (!e.back) { e.vx -= e.dir * 1300 * dt; if (Math.sign(e.vx) !== e.dir) e.back = true; }
              else {
                const dx = e.owner.x - e.x;
                e.vx = M.approach(e.vx, Math.sign(dx) * 1100, 2600 * dt);
                if (Math.abs(dx) < 40) { e.alive = false; e.owner.wigOff = false; VF.Audio.play('land'); }
              }
              e.x += e.vx * dt;
              e.y += ((e.owner.y - 200) - e.y) * 2 * dt;
              if (e.cd <= 0 && e.hits < 6 && e.tryHit({ x: e.x - 50, y: e.y - 35, w: 100, h: 70 }, hit({ dmg: 24, stun: 0.4, kb: 60, sfx: 'punch', spark: 1, color: '#8d6e63' }), Math.sign(e.vx))) { e.cd = 0.16; e.hits++; }
              if (Math.random() < 0.4) w.ps.spawn({ x: e.x, y: e.y, vx: 0, vy: 0, life: 0.3, size: 5, color: '#ffe082', add: true });
            },
            onEnd(e) { e.owner.wigOff = false; },
            draw(ctx, e) { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.t * 18); VF.BigFX.icon(ctx, 'wig', 38, '#6d4c41'); ctx.restore(); }
          });
        }
      },
      pose(p, f) {
        const P = PS().P;
        return kf([[0, PS().idle(0, f)], [0.25, P({ lean: -0.2, fa: [PI - 0.3, PI + 0.3], ba: [0.3, 2.6] })], [0.4, P({ lean: 0.35, fa: [1.7, 1.6], ba: [0.2, 2.6] })], [0.8, P({ lean: 0.35, fa: [1.7, 1.6], ba: [0.2, 2.6] })], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- WAL
    tornado: {
      dur: 0.75, armor: 0.25,
      update(s, f, o, w) {
        if (s.t >= 0.3 && !s.fired) {
          s.fired = true;
          VF.Audio.play('wind');
          ent(w, f, {
            x: f.x + f.facing * 130, y: C.GROUND_Y, vx: f.facing * (s.P.speed || 130), life: s.P.life || 3.6, cd: 0, color: s.P.color,
            onUpdate(e, dt) {
              e.x += e.vx * dt;
              if (e.x < C.STAGE_LEFT || e.x > C.STAGE_RIGHT) e.vx = -e.vx;
              e.cd -= dt;
              if (e.cd <= 0 && e.tryHit({ x: e.x - 70, y: e.y - 300, w: 140, h: 300 }, hit({ dmg: 20, stun: 0.5, kb: 40, kbY: -520, launch: true, sfx: 'kick', spark: 1, color: e.color }))) e.cd = 0.32;
              if (Math.random() < 0.6) w.ps.spawn({ x: e.x + R(-60, 60), y: e.y - R(0, 280), vx: R(-80, 80), vy: -120, life: 0.6, size: 4, color: e.color, add: true });
            },
            draw(ctx, e) { VF.BigFX.TYPES.tornado(ctx, { x: e.x, y: e.y, t: e.t, h: 300, w: 140, color: e.color, color2: '#f3e5f5' }, Math.max(0, (e.t - (e.life - 0.3)) / 0.3)); }
          });
        }
      },
      pose(p, f) { return castPose(p, f, PS().P({ lean: -0.1, fa: [PI - 0.3, PI - 0.6], ba: [PI - 0.8, PI - 0.4] }), 0.35); }
    },

    // ---------------------------------------------------------- DG
    soccer_ball: {
      dur: 0.6, armor: 0.15,
      update(s, f, o, w) {
        if (s.t >= 0.24 && !s.fired) {
          s.fired = true;
          VF.Audio.play('kickball');
          VF.FX.text(w.ps, f.x, f.y - 260, 'GOLAÇO!', '#ffd600', 30, 0.9);
          proj(w, f, { type: 'ball', x: f.x + f.facing * 70, y: f.y - 60, vx: f.facing * 950, vy: -500, gravity: 1800, bounce: 0.75, w: 54, h: 54, color: s.P.color,
            hit: hit({ dmg: 105, stun: 0.6, kb: 520, kbY: -700, knockdown: true, spark: 2, shake: 8, color: '#ffffff' }) });
        }
      },
      pose(p, f) {
        const k = K();
        return kf([[0, PS().idle(0, f)], [0.2, k.kneekick], [0.38, k.kick], [0.75, k.kick], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- GABRIEL / LIVIA / LUTU (avanço + sequência)
    rush: {
      dur: 1.1, armor: 0.2,
      update(s, f, o, w, dt) {
        const n = s.P.hits || 4;
        if (!s.hitAt) {
          if (s.t < 0.35) {
            f.vx = f.facing * (s.P.speed || 1400);
            VF.FX.speedLines(w.ps, f.x, f.y - 110, -f.facing, s.P.color);
            const box = f.hitboxWorld([0, -220, 110, 220]);
            if (o.canBeHit() && M.overlap(box, o.hurtbox)) { s.hitAt = s.t; s.k = 0; f.vx = 0; }
          } else { f.vx = M.approach(f.vx, 0, 4000 * dt); }
          return;
        }
        const gap = s.P.gap || 0.09;
        while (s.k < n && s.t >= s.hitAt + s.k * gap) {
          const last = s.k === n - 1;
          const box = f.hitboxWorld([-10, -230, 140, 230]);
          if (f.def.partnerSkin) f.swap = !f.swap;
          if (o.canBeHit()) VF.Combat.hit(w, f, o, hit({ dmg: last ? (s.P.finish || 60) : (s.P.dmg || 22), stun: 0.5, kb: last ? 520 : 20, kbY: last ? -800 : 0, launch: last, knockdown: last, unblockable: !!s.P.unblockable, sfx: s.k % 2 ? 'kick' : 'punch', spark: last ? 2.2 : 1.1, shake: last ? 10 : 2, color: s.P.color, zoom: last ? 1.15 : 0 }), box, f.facing, true);
          VF.FX.speedLines(w.ps, o.x, o.y - 120, f.facing, s.P.color);
          s.k++;
        }
        if (s.k >= n) f.swap = false;
      },
      pose(p, f, s) {
        const k = K();
        if (!(s && s.hitAt)) return PS().P(k.dash);
        const seq = [k.jab, k.cross, k.kick, k.hook, k.highkick, k.palm];
        const i = Math.floor(((p * s.dur - s.hitAt) / (s.P.gap || 0.09)));
        if (s.k >= (s.P.hits || 4) && p > 0.85) return PS().P(st(f));
        return PS().P(i >= (s.P.hits || 4) - 1 ? k.launcher : seq[Math.max(0, i) % seq.length]);
      }
    },

    // ---------------------------------------------------------- MUSKITO
    drones: {
      dur: 0.8, armor: 0.3,
      update(s, f, o, w) {
        if (!s.a) { s.a = 1; VF.Audio.play('digital'); VF.FX.text(w.ps, f.x, f.y - 270, 'NERD MODE ON', s.P.color, 30, 1); }
        if (Math.random() < 0.5) w.ps.spawn({ x: f.x + R(-80, 80), y: f.y - R(40, 240), vy: -60, life: 0.6, size: 12, color: s.P.color, shape: 'text', text: M.choose(['0', '1', '{ }', '</>']), font: 'monospace' });
        if (s.t >= 0.35 && !s.fired) {
          s.fired = true;
          for (let i = 0; i < 2; i++) {
            ent(w, f, {
              x: f.x, y: f.y - 260, life: 4.2, idx: i, cd: 0.4 + i * 0.35, color: s.P.color,
              onUpdate(e, dt) {
                const a = e.t * 2 + e.idx * PI;
                e.x = e.owner.x + Math.cos(a) * 80;
                e.y = e.owner.y - 270 + Math.sin(a * 2) * 20;
                e.cd -= dt;
                if (e.cd <= 0) {
                  e.cd = 0.75;
                  const tg = e.target;
                  const dx = tg.x - e.x, dy = tg.y - 120 - e.y, d = Math.hypot(dx, dy) || 1;
                  proj(w, e.owner, { type: 'laser', x: e.x, y: e.y, vx: (dx / d) * 1100, vy: (dy / d) * 1100, w: 24, h: 24, color: e.color, trail: false,
                    hit: hit({ dmg: 18, stun: 0.3, kb: 60, sfx: 'zap', spark: 0.8, color: e.color }) });
                  VF.Audio.play('zap');
                }
              },
              draw(ctx, e) {
                ctx.save();
                ctx.translate(e.x, e.y);
                ctx.fillStyle = '#263238';
                ctx.strokeStyle = '#120a1c';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.rect(-18, -8, 36, 16); ctx.fill(); ctx.stroke();
                ctx.fillStyle = e.color;
                ctx.fillRect(-26, -12, 12, 4); ctx.fillRect(14, -12, 12, 4);
                VF.BG.glow(ctx, 0, 0, 16, e.color, 0.8);
                ctx.restore();
              }
            });
          }
        }
      },
      pose(p, f) {
        const P = PS().P;
        const tap = Math.sin(p * 60) * 0.15;
        return kf([[0, PS().idle(0, f)], [0.15, P({ lean: 0.2, head: 0.2, fa: [1.2, 2.0 + tap], ba: [1.1, 1.9 - tap] })], [0.85, P({ lean: 0.2, head: 0.2, fa: [1.2, 2.0 + tap], ba: [1.1, 1.9 - tap] })], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- DOCINHO
    bless_wave: {
      dur: 1.05, armor: 0.5,
      update(s, f, o, w) {
        if (!s.a) { s.a = 1; VF.Audio.play('bell'); VF.BigFX.spawn(w, 'pillar', f.x, f.y, { color: s.P.color, dur: 0.6, w: 120 }); }
        if (s.t < 0.45) { if (Math.random() < 0.7) VF.FX.energy(w.ps, f.x, f.y - 250, '#fff59d', 2, 50); }
        else if (!s.fired) {
          s.fired = true;
          VF.Audio.play('boom');
          VF.BigFX.spawn(w, 'explosion', f.x, f.y - 110, { color: s.P.color, color2: '#ffffff', dur: 0.7, size: 360 });
          w.flashScreen('#fff8e1', 0.35);
          w.shake(8, 0.25);
          f.hp = Math.min(C.MAX_HP, f.hp + 30);
          VF.FX.text(w.ps, f.x, f.y - 280, '+30 VIDA', '#b9f6ca', 26, 1);
          if (o.canBeHit() && Math.abs(o.x - f.x) < 360) {
            VF.Combat.hit(w, f, o, hit({ dmg: 130, stun: 0.6, kb: 800, kbY: -500, knockdown: true, wallbounce: true, spark: 2, shake: 10, color: '#fff59d' }), o.hurtbox, Math.sign(o.x - f.x) || f.facing, true);
          }
        }
      },
      pose(p, f) { return castPose(p, f, PS().P({ lean: -0.15, head: -0.3, fa: [PI - 0.3, PI - 0.2], ba: [PI - 0.2, PI - 0.1] }), 0.45); }
    },

    // ---------------------------------------------------------- LIVIA (sequência rápida)
    flurry: {
      dur: 1.0, armor: 0.2,
      update(s, f, o, w, dt) {
        if (s.t < 0.15) { f.vx = f.facing * 1100; return; }
        f.vx = M.approach(f.vx, 0, 5000 * dt);
        s.n = s.n || 0;
        while (s.n < 8 && s.t >= 0.18 + s.n * 0.065) {
          const last = s.n === 7;
          const box = f.hitboxWorld([0, -220, 130, 220]);
          if (o.canBeHit() && M.overlap(box, o.hurtbox)) VF.Combat.hit(w, f, o, hit({ dmg: last ? 45 : 16, stun: 0.4, kb: last ? 520 : 15, kbY: last ? -500 : 0, knockdown: last, sfx: s.n % 2 ? 'kick' : 'punch', spark: last ? 1.8 : 0.9, shake: last ? 8 : 1, color: s.P.color }), box, f.facing, true);
          s.n++;
        }
      },
      pose(p, f) {
        const k = K();
        const seq = [k.jab, k.cross, k.slap, k.kick, k.jab, k.cross, k.kick, k.highkick];
        if (p < 0.15) return PS().P(k.dash);
        if (p > 0.85) return PS().P(st(f));
        return PS().P(seq[Math.min(7, Math.floor((p - 0.15) / 0.087))]);
      }
    },

    // ---------------------------------------------------------- LAURA
    lightning: {
      dur: 0.9, armor: 0.3,
      update(s, f, o, w) {
        if (!s.a) { s.a = 1; VF.Audio.play('bell'); s.mx = o.x; }
        if (s.t < 0.55) {
          s.mx += (o.x - s.mx) * 0.08;
          if (Math.random() < 0.5) w.ps.spawn({ x: s.mx + R(-60, 60), y: C.GROUND_Y - 4, vy: -40, life: 0.4, size: 4, color: s.P.color, add: true });
        } else if (!s.fired) {
          s.fired = true;
          VF.BigFX.spawn(w, 'bolt', s.mx, C.GROUND_Y, { color: s.P.color, dur: 0.45 });
          VF.BigFX.spawn(w, 'pillar', s.mx, C.GROUND_Y, { color: '#fff9c4', dur: 0.35, w: 90 });
          VF.Audio.play('zap');
          w.flashScreen('#ffffff', 0.4);
          w.shake(12, 0.3);
          const box = { x: s.mx - 70, y: -100, w: 140, h: C.GROUND_Y + 100 };
          if (o.canBeHit() && M.overlap(box, o.hurtbox)) VF.Combat.hit(w, f, o, hit({ dmg: 160, stun: 0.6, kb: 150, kbY: -650, knockdown: true, spark: 2.4, shake: 12, zoom: 1.12, color: '#fff59d' }), box, f.facing, true);
          else VF.FX.text(w.ps, s.mx, C.GROUND_Y - 200, 'ERROU!', '#fff', 26);
        }
      },
      pose(p, f) { return castPose(p, f, PS().P({ lean: -0.05, head: -0.35, fa: [PI - 0.15, PI + 0.1], ba: [PI - 0.35, PI - 0.05] }), 0.55); }
    },

    // ---------------------------------------------------------- ANNY
    buff: {
      dur: 0.75, armor: 0.4,
      update(s, f, o, w) {
        if (s.t >= 0.3 && !s.fired) {
          s.fired = true;
          f.applyStatus('buff', s.P.time || 7, w);
          VF.Audio.play('flex');
          VF.FX.burst(w.ps, f.x, f.y - 120, s.P.color, 30, 600);
          VF.FX.text(w.ps, f.x, f.y - 290, 'ACADEMIA MODE!', '#ff6d00', 36, 1.3);
          VF.FX.text(w.ps, f.x, f.y - 250, '+FORÇA  +VELOCIDADE', '#ffffff', 22, 1.3);
          w.shake(6, 0.2);
          if (o.canBeHit() && Math.abs(o.x - f.x) < 200) VF.Combat.hit(w, f, o, hit({ dmg: 30, stun: 0.4, kb: 500, sfx: 'heavy', spark: 1.4 }), o.hurtbox, Math.sign(o.x - f.x) || f.facing, true);
        }
      },
      pose(p, f) {
        const P = PS().P;
        const flex = P({ lean: -0.05, head: -0.1, fa: [2.0, PI + 0.5], ba: [2.0, PI + 0.5], fl: [0.45, 0.1], bl: [-0.45, -0.4] });
        return kf([[0, PS().idle(0, f)], [0.3, flex], [0.8, flex], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- JULIA NEGREIROS / LEIDIANE (atordoar)
    gaze: {
      dur: 0.85, armor: 0.3,
      update(s, f, o, w) {
        if (s.t >= 0.35 && !s.fired) {
          s.fired = true;
          VF.Audio.play('sparkle');
          const range = s.P.range || 520;
          const cx = f.x + f.facing * range / 2;
          ent(w, f, { x: f.x, y: f.y - 200, life: 0.35, draw(ctx, e) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const g = ctx.createLinearGradient(e.x, 0, e.x + f.facing * range, 0);
            g.addColorStop(0, VF.M.hexA(s.P.color, 0.8));
            g.addColorStop(1, VF.M.hexA(s.P.color, 0));
            ctx.fillStyle = g;
            ctx.fillRect(Math.min(e.x, e.x + f.facing * range), e.y - 20, range, 40);
            ctx.restore();
            for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(e.x + f.facing * (60 + i * range / 5), e.y + Math.sin(e.t * 20 + i) * 10); VF.BigFX.icon(ctx, i % 2 ? 'star' : 'heart', 16, s.P.color); ctx.restore(); }
          } });
          const box = { x: Math.min(f.x, f.x + f.facing * range), y: f.y - 260, w: range, h: 200 };
          if (o.canBeHit() && M.overlap(box, o.hurtbox)) {
            VF.Combat.hit(w, f, o, hit({ dmg: 30, stun: 0.3, kb: 0, unblockable: true, sfx: 'sparkle', spark: 1, color: s.P.color }), box, f.facing, true);
            o.applyStatus('daze', s.P.time || 2.4, w);
            VF.FX.text(w.ps, o.x, o.y - 280, s.P.text || 'VULNERÁVEL!', s.P.color, 30, 1.2);
          } else VF.FX.text(w.ps, cx, f.y - 240, 'HMPF!', '#fff', 24);
        }
      },
      pose(p, f) {
        const P = PS().P;
        const g = P({ lean: -0.1, head: -0.15, fa: [1.2, PI + 0.3], ba: [-0.5, 0.8] });
        return kf([[0, PS().idle(0, f)], [0.3, g], [0.8, g], [1, st(f)]], p);
      }
    },
    charm: {
      dur: 0.95, armor: 0.35,
      update(s, f, o, w) {
        if (s.t >= 0.4 && !s.fired) {
          s.fired = true;
          VF.Audio.play('sparkle');
          VF.BigFX.spawn(w, 'hearts', f.x, f.y - 140, { color: s.P.color, icon: s.P.icon2 || 'rose', dur: 0.8 });
          if (o.canBeHit() && Math.abs(o.x - f.x) < (s.P.range || 300)) {
            VF.Combat.hit(w, f, o, hit({ dmg: 35, stun: 0.3, kb: 0, unblockable: true, sfx: 'sparkle', spark: 1, color: s.P.color }), o.hurtbox, f.facing, true);
            o.applyStatus('daze', s.P.time || 2.2, w);
            o.vx = -f.facing * 260;
            VF.FX.text(w.ps, o.x, o.y - 280, 'ENCANTADO(A)!', s.P.color, 30, 1.2);
          }
        }
      },
      pose(p, f) {
        const P = PS().P;
        const flip = P({ lean: -0.2, head: -0.35, fa: [PI - 0.3, PI + 0.6], ba: [-0.6, 0.9], fl: [0.05, -0.1], bl: [0.15, -0.1] });
        return kf([[0, PS().idle(0, f)], [0.35, flip], [0.85, flip], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- ALLANE
    hair_vortex: {
      dur: 1.1, armor: 0.4,
      update(s, f, o, w) {
        if (!s.a) { s.a = 1; VF.Audio.play('spin'); s.n = 0; }
        if (s.t > 0.2 && s.t < 0.95) {
          f.vx = f.facing * 220;
          for (let i = 0; i < 3; i++) {
            const a = s.t * 20 + (i * PI * 2) / 3;
            w.ps.spawn({ x: f.x + Math.cos(a) * 130, y: f.y - 130 + Math.sin(a) * 90, life: 0.3, size: 12, color: i % 2 ? s.P.color : '#6d4c41', shrink: true });
          }
          if (s.t > 0.25 + s.n * 0.12 && s.n < 6) {
            s.n++;
            const last = s.n === 6;
            const box = { x: f.x - 150, y: f.y - 250, w: 300, h: 250 };
            if (o.canBeHit() && M.overlap(box, o.hurtbox)) VF.Combat.hit(w, f, o, hit({ dmg: last ? 45 : 22, stun: 0.45, kb: last ? 350 : 40, kbY: last ? -850 : -150, launch: last, sfx: 'kick', spark: 1.2, color: s.P.color }), box, Math.sign(o.x - f.x) || f.facing, true);
          }
        } else f.vx = 0;
      },
      pose(p, f) {
        const P = PS().P;
        const a = p * 25;
        if (p < 0.18 || p > 0.9) return P(st(f));
        return P({ lean: 0, head: Math.sin(a) * 0.3, fa: [PI - 0.8 + Math.sin(a) * 0.3, PI - 0.3], ba: [PI - 0.6 - Math.sin(a) * 0.3, PI - 0.2], fl: [0.2, 0.05], bl: [-0.2, -0.1] });
      }
    },

    // ---------------------------------------------------------- BIA
    volley: {
      dur: 0.95, armor: 0.2,
      update(s, f, o, w) {
        const times = [0.25, 0.42, 0.59];
        s.i = s.i || 0;
        while (s.i < times.length && s.t >= times[s.i]) {
          const vy = [0, -120, 120][s.i];
          proj(w, f, { type: 'arrow', x: f.x + f.facing * 80, y: f.y - 170, vx: f.facing * 1350, vy, w: 70, h: 30, color: s.P.color,
            hit: hit({ dmg: 52, stun: 0.45, kb: 220, sfx: 'punch', spark: 1.4, color: '#dcedc8', knockdown: s.i === 2 }) });
          VF.Audio.play('zap');
          s.i++;
        }
      },
      pose(p, f) {
        const P = PS().P;
        const aim = P({ lean: 0.05, fa: [1.57, 1.57], ba: [1.45, PI + 0.9] });
        return kf([[0, PS().idle(0, f)], [0.2, aim], [0.85, aim], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- EINSTEIN (paródia)
    time_slow: {
      dur: 0.9, armor: 0.4,
      update(s, f, o, w) {
        if (s.t >= 0.35 && !s.fired) {
          s.fired = true;
          VF.Audio.play('clock');
          o.applyStatus('slow', s.P.time || 4.5, w);
          VF.BigFX.spawn(w, 'clock', o.x, o.y - 160, { color: '#80d8ff', dur: 1.2 });
          VF.FX.text(w.ps, f.x, f.y - 280, 'RELATIVIDADE!', '#80d8ff', 34, 1.3);
          VF.FX.text(w.ps, o.x, o.y - 290, 'TEMPO LENTO', '#ffffff', 24, 1.3);
          w.timeFx = s.P.time || 4.5;
        }
      },
      pose(p, f) {
        const P = PS().P;
        const think = P({ lean: -0.1, head: -0.2, fa: [2.2, PI + 0.9], ba: [0.8, 2.4] });
        const point = P({ lean: 0.1, fa: [PI - 0.4, PI - 0.3], ba: [0.3, 2.4] });
        return kf([[0, PS().idle(0, f)], [0.2, think], [0.35, point], [0.85, point], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- JOVANIRA
    equations: {
      dur: 0.8, armor: 0.3,
      update(s, f, o, w) {
        if (s.t >= 0.3 && !s.fired) {
          s.fired = true;
          VF.Audio.play('digital');
          const list = ['x²', '√9', 'π', '2+2', 'Δ', '∑', 'f(x)', '7×8', '∫', '%'];
          ent(w, f, {
            x: o.x, y: o.y - 130, life: 1.5, n: 0, tgt: o,
            onUpdate(e) {
              if (e.t < 0.9) { e.x = e.tgt.x; e.y = e.tgt.y - 130; }
              while (e.t > 0.9 && e.n < 5 && e.t > 0.9 + e.n * 0.1) {
                e.n++;
                e.tryHit({ x: e.x - 90, y: e.y - 130, w: 180, h: 260 }, hit({ dmg: e.n === 5 ? 50 : 22, stun: 0.45, kb: e.n === 5 ? 400 : 20, kbY: e.n === 5 ? -600 : 0, knockdown: e.n === 5, sfx: 'punch', spark: 1.2, color: s.P.color }));
                VF.FX.burst(w.ps, e.x, e.y, s.P.color, 8, 300);
              }
            },
            draw(ctx, e) {
              const k = e.t < 0.9 ? 1 : Math.max(0, 1 - (e.t - 0.9) * 2);
              for (let i = 0; i < 10; i++) {
                const a = (i / 10) * PI * 2 + e.t * 3;
                const r = 140 * k + 10;
                VF.BigFX.TYPES.bigtext(ctx, { x: e.x + Math.cos(a) * r, y: e.y + Math.sin(a) * r * 0.7, text: list[i], size: 30, color: i % 2 ? '#ffffff' : s.P.color }, 0.5);
              }
            }
          });
        }
      },
      pose(p, f) {
        const P = PS().P;
        const chalk = P({ lean: 0.05, fa: [PI - 0.9, PI - 0.6], ba: [0.4, 2.2] });
        const write = P({ lean: 0.1, fa: [PI - 1.3, PI - 0.9], ba: [0.4, 2.2] });
        return kf([[0, PS().idle(0, f)], [0.15, chalk], [0.3, write], [0.45, chalk], [0.6, write], [0.9, chalk], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- GIOVANA
    heartbreak: {
      dur: 0.8, armor: 0.25,
      update(s, f, o, w) {
        if (!s.a) { s.a = 1; VF.FX.text(w.ps, f.x, f.y - 270, 'EX ATTACK!', s.P.color, 32, 1); }
        if (s.t >= 0.32 && !s.fired) {
          s.fired = true;
          VF.Audio.play('whoosh');
          proj(w, f, { type: 'heart', x: f.x + f.facing * 70, y: f.y - 160, vx: f.facing * 720, w: 70, h: 70, color: s.P.color,
            hit: hit({ dmg: 125, stun: 0.6, kb: 520, kbY: -650, knockdown: true, sfx: 'heartbreak', spark: 2, shake: 8, color: '#ff80ab' }),
            onHitFx: true });
        }
      },
      pose(p, f) {
        const P = PS().P;
        return kf([[0, PS().idle(0, f)], [0.25, P({ lean: -0.25, fa: [PI - 0.2, PI + 0.4], ba: [0.3, 2.4] })], [0.4, P({ lean: 0.35, fa: [1.6, 1.5], ba: [0.2, 2.5] })], [0.8, P({ lean: 0.35, fa: [1.6, 1.5] })], [1, st(f)]], p);
      }
    },

    // ---------------------------------------------------------- ELENA
    sound: {
      dur: 1.0, armor: 0.4,
      update(s, f, o, w) {
        if (!s.a) { s.a = 1; VF.Audio.play('sing'); }
        const times = [0.3, 0.45, 0.6];
        s.i = s.i || 0;
        while (s.i < times.length && s.t >= times[s.i]) {
          proj(w, f, { type: 'note', x: f.x + f.facing * 60, y: f.y - 180, vx: f.facing * 820, w: 90, h: 190, color: s.P.color, pierce: 0.25,
            hit: hit({ dmg: 42, stun: 0.45, kb: 250, sfx: 'punch', spark: 1.2, color: s.P.color, knockdown: s.i === 2 }) });
          s.i++;
        }
        if (Math.random() < 0.4) VF.FX.text(w.ps, f.x + f.facing * R(20, 80), f.y - R(220, 280), M.choose(['♪', '♫', '♬']), '#ffffff', 26, 0.7);
      },
      pose(p, f) {
        const P = PS().P;
        const sing = P({ lean: -0.15, head: -0.3, fa: [1.3, PI + 0.6], ba: [PI - 0.9, PI - 0.5] });
        return kf([[0, PS().idle(0, f)], [0.2, sing], [0.9, sing], [1, st(f)]], p);
      }
    }
  };

  // Lutu reaproveita o avanço com parceiro(a); Livia/Gabriel também usam "rush" com parâmetros próprios
  T.duo_combo = Object.assign({}, T.rush, { dur: 1.25 });

  class SpecialRunner {
    constructor(f, o, w) {
      this.P = Object.assign({ color: f.def.color }, f.def.special);
      this.type = T[this.P.type] || T.beam;
      this.f = f; this.o = o; this.w = w;
      this.t = 0;
      this.dur = this.P.dur || this.type.dur;
      this.armor = this.type.armor;
      this.done = false;
      this.pose = (p, fighter) => this.type.pose(p, fighter, this);
    }
    update(dt) {
      this.t += dt;
      this.armor -= dt;
      this.type.update(this, this.f, this.o, this.w, dt);
      if (this.t >= this.dur) {
        this.done = true;
        this.f.alpha = 1;
        this.f.swap = false;
        if (this.f.y < C.GROUND_Y && this.f.onGround) this.f.y = C.GROUND_Y;
      }
    }
  }

  VF.SpecialTypes = T;
  VF.Specials = {
    create: (f, o, w) => new SpecialRunner(f, o, w),
    isRanged: (type) => ['beam', 'speech_wave', 'soccer_ball', 'volley', 'sound', 'heartbreak', 'lightning', 'bind', 'time_slow', 'equations', 'wig_boomerang', 'tornado', 'drones', 'gaze'].includes(type)
  };
})();
