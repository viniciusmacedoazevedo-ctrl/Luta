/* Poderes especiais: lógica (VF.Specials) e animação (VF.SpecialPoses).
   Lula e Bolsonaro são caricaturas fictícias: "Mão Leve" e "Discurso de Poder"
   são apenas mecânicas cômicas de videogame. */
(function () {
  const C = VF.CONFIG, M = VF.M, PI = Math.PI;
  const R = (a, b) => a + Math.random() * (b - a);

  const DEFS = {
    // VINI BLAST — carrega energia nos óculos e dispara uma rajada
    blast: {
      dur: 0.75, armor: 0.3,
      update(s, f, opp, w) {
        if (s.t < 0.38) {
          if (!s.charged) { s.charged = true; VF.Audio.play('charge'); }
          if (Math.random() < 0.8) VF.FX.converge(w.ps, f.x + f.facing * 30, f.y - 205, '#7ff6ff', 2, 100);
        } else if (!s.fired) {
          s.fired = true;
          VF.Audio.play('blast');
          w.addProjectile(new VF.Projectile({
            type: 'blast', owner: f, x: f.x + f.facing * 80, y: f.y - 178, vx: f.facing * 980, w: 84, h: 58, color: '#00e5ff',
            hit: { dmg: 190, stun: 0.6, kb: 520, kbY: -600, knockdown: true, sfx: 'heavy', spark: 2.2, shake: 12, color: '#7ff6ff' }
          }));
          w.shake(6, 0.2);
          w.flashScreen('#00e5ff', 0.18);
          VF.FX.ring(w.ps, f.x + f.facing * 80, f.y - 178, '#00e5ff', 20);
        }
      }
    },

    // FLASH ARTHUR — some, reaparece atrás do oponente e ataca em sequência
    flash: {
      dur: 1.0, armor: 0.25,
      update(s, f, opp, w) {
        if (!s.vanished) {
          s.vanished = true;
          VF.Audio.play('flash');
          VF.FX.burst(w.ps, f.x, f.y - 110, '#ffd600', 16, 420);
        }
        if (s.t < 0.16) {
          f.alpha = 1 - s.t / 0.16;
          return;
        }
        if (!s.teleported) {
          s.teleported = true;
          f.alpha = 1;
          const side = Math.sign(opp.x - f.x) || f.facing;
          let nx = opp.x + side * 80;
          if (nx < C.STAGE_LEFT + 10 || nx > C.STAGE_RIGHT - 10) nx = opp.x - side * 80;
          f.x = M.clamp(nx, C.STAGE_LEFT, C.STAGE_RIGHT);
          f.y = C.GROUND_Y;
          f.vy = 0;
          f.onGround = true;
          f.facing = Math.sign(opp.x - f.x) || -side;
          s.hitIdx = 0;
          VF.FX.burst(w.ps, f.x, f.y - 110, '#ffd600', 16, 420);
          VF.Audio.play('dash');
        }
        const times = [0.24, 0.34, 0.44, 0.54, 0.7];
        while (s.hitIdx < times.length && s.t >= times[s.hitIdx]) {
          const last = s.hitIdx === times.length - 1;
          const box = f.hitboxWorld([0, -215, 125, 205]);
          if (opp.canBeHit() && M.overlap(box, opp.hurtbox)) {
            VF.Combat.hit(w, f, opp, {
              dmg: last ? 70 : 36, stun: 0.42, kb: last ? 480 : 30, kbY: -650, knockdown: last, unblockable: true,
              sfx: last ? 'heavy' : s.hitIdx % 2 ? 'kick' : 'punch', spark: last ? 2 : 1.1, shake: last ? 10 : 2, color: '#ffd600'
            }, box, f.facing, true);
          }
          s.hitIdx++;
        }
        if (s.t > 0.2 && s.t < 0.75 && Math.random() < 0.6) VF.FX.energy(w.ps, f.x, f.y - 120, '#ffd600', 1, 50);
      }
    },

    // ENERGIA SOMBRIA — aura roxa e esfera sombria
    dark: {
      dur: 0.95, armor: 0.45,
      update(s, f, opp, w) {
        if (!s.started) { s.started = true; VF.Audio.play('dark'); }
        if (s.t < 0.5) {
          VF.FX.energy(w.ps, f.x, f.y - 110, Math.random() < 0.5 ? '#b36bff' : '#6a00b8', 3, 55);
          if (Math.random() < 0.15) VF.FX.ring(w.ps, f.x, f.y - 110, '#b36bff', 40, 0.4);
        } else if (!s.fired) {
          s.fired = true;
          w.addProjectile(new VF.Projectile({
            type: 'dark', owner: f, x: f.x + f.facing * 85, y: f.y - 130, vx: f.facing * 700, w: 100, h: 100, color: '#b36bff',
            hit: { dmg: 220, stun: 0.7, kb: 600, kbY: -700, knockdown: true, sfx: 'heavy', spark: 2.4, shake: 14, color: '#d8a6ff' }
          }));
          w.shake(8, 0.25);
          w.flashScreen('#b36bff', 0.22);
        }
      }
    },

    // MÃO LEVE (paródia fictícia) — avança e "pega emprestada" a barra SPECIAL
    steal: {
      dur: 0.9, armor: 0.22,
      update(s, f, opp, w, dt) {
        if (!s.started) { s.started = true; VF.Audio.play('whoosh'); }
        if (s.t < 0.22) {
          f.vx = 0;
          if (Math.random() < 0.4) VF.FX.energy(w.ps, f.x + f.facing * 30, f.y - 150, '#ffd600', 1, 12);
          return;
        }
        if (s.t < 0.52 && !s.hit) {
          f.vx = f.facing * 1150;
          if (Math.random() < 0.6) VF.FX.dust(w.ps, f.x - f.facing * 20, f.y, 1, -f.facing);
          const box = f.hitboxWorld([10, -180, 95, 115]);
          if (opp.canBeHit() && M.overlap(box, opp.hurtbox)) {
            s.hit = true;
            f.vx = 0;
            VF.Combat.hit(w, f, opp, { dmg: 100, stun: 0.7, kb: 160, sfx: 'grab', spark: 1.6, unblockable: true, shake: 6, color: '#ffd600' }, box, f.facing, true);
            const stolen = Math.min(opp.special, 50);
            opp.special -= stolen;
            f.special = M.clamp(stolen + 20, 0, C.SPECIAL_MAX);
            VF.Audio.play('steal');
            for (let i = 0; i < 16; i++) {
              w.ps.spawn({ x: opp.x + R(-30, 30), y: opp.y - 150 + R(-40, 40), vx: R(-350, 350), vy: R(-450, -100), life: 1.4, size: 6, color: i % 2 ? '#ffd600' : '#fff59d', add: true, target: f });
            }
            VF.FX.text(w.ps, opp.x, opp.y - 260, stolen > 0 ? `-${Math.round(stolen)} SPECIAL` : 'BARRA VAZIA!', '#ffd600', 30, 1.2);
            VF.FX.text(w.ps, f.x, f.y - 280, 'MÃO LEVE!', '#ffffff', 36, 1.2);
          }
          return;
        }
        f.vx = M.approach(f.vx, 0, 4000 * dt);
      }
    },

    // DISCURSO DE PODER (paródia fictícia) — discurso + onda de choque
    speech: {
      dur: 1.15, armor: 0.62,
      update(s, f, opp, w) {
        if (!s.started) { s.started = true; VF.Audio.play('speech'); s.nextText = 0; }
        if (s.t < 0.62) {
          if (s.t >= s.nextText) {
            s.nextText += 0.17;
            VF.FX.text(w.ps, f.x + f.facing * R(40, 110), f.y - R(240, 290), M.choose(['!!!', 'BLÁ BLÁ!', 'ATENÇÃO!', '!!', 'POVO!']),
              M.choose(['#ffd600', '#2ecc71', '#ffffff']), 26, 0.7);
          }
          if (Math.random() < 0.3) VF.FX.ring(w.ps, f.x + f.facing * 40, f.y - 200, '#ffd600', 10, 0.35);
        } else if (!s.fired) {
          s.fired = true;
          VF.Audio.play('wave');
          w.addProjectile(new VF.Projectile({
            type: 'wave', owner: f, x: f.x + f.facing * 70, y: f.y - 118, vx: f.facing * 760, w: 80, h: 235, color: '#2ecc71',
            hit: { dmg: 170, stun: 0.6, kb: 950, kbY: -500, knockdown: true, sfx: 'heavy', spark: 2.2, shake: 12, color: '#ffd600' }
          }));
          w.shake(10, 0.3);
          w.flashScreen('#ffd600', 0.2);
        }
      }
    }
  };

  class SpecialRunner {
    constructor(f, opp, w) {
      this.id = f.def.special.id;
      this.def = DEFS[this.id];
      this.f = f;
      this.opp = opp;
      this.w = w;
      this.t = 0;
      this.dur = this.def.dur;
      this.armor = this.def.armor;
      this.done = false;
    }
    update(dt) {
      this.t += dt;
      this.armor -= dt;
      this.def.update(this, this.f, this.opp, this.w, dt);
      if (this.t >= this.dur) {
        this.done = true;
        this.f.alpha = 1;
      }
    }
  }

  VF.Specials = {
    DEFS,
    create: (f, opp, w) => new SpecialRunner(f, opp, w),
    isRanged: (id) => id === 'blast' || id === 'dark' || id === 'speech'
  };

  // ---------- Animações dos especiais (progresso p de 0 a 1) ----------
  const PS = () => VF.Poses;

  VF.SpecialPoses = {
    blast(p) {
      const { P, keyframes, idle, STANCE } = PS();
      const CH = P({ lean: -0.05, head: -0.05, fa: [1.8, PI + 0.6], ba: [1.5, PI + 0.4], fl: [0.45, 0.15], bl: [-0.4, -0.4] });
      const REL = P({ lean: 0.25, fa: [1.52, 1.52], ba: [1.45, 1.5], fl: [0.6, 0.25], bl: [-0.55, -0.5] });
      return keyframes([{ t: 0, pose: idle(0) }, { t: 0.15, pose: CH }, { t: 0.48, pose: CH }, { t: 0.56, pose: REL }, { t: 0.85, pose: REL }, { t: 1, pose: STANCE }], p);
    },
    flash(p) {
      const { K, P, dash, STANCE } = PS();
      if (p < 0.22) return dash();
      if (p > 0.82) return P(STANCE);
      if (p > 0.66) return P(K.HEAVY);
      return Math.floor((p - 0.22) / 0.1) % 2 ? P(K.KICK) : P(K.PUNCH);
    },
    dark(p) {
      const { P, keyframes, idle, STANCE } = PS();
      const G = P({ lean: -0.18, head: -0.25, fa: [PI - 0.5, PI - 0.3], ba: [PI - 0.3, PI - 0.1], fl: [0.3, 0.1], bl: [-0.3, -0.3] });
      const T = P({ lean: 0.3, fa: [1.55, 1.6], ba: [1.4, 1.5], fl: [0.65, 0.25], bl: [-0.6, -0.5] });
      return keyframes([{ t: 0, pose: idle(0) }, { t: 0.15, pose: G }, { t: 0.5, pose: G }, { t: 0.57, pose: T }, { t: 0.85, pose: T }, { t: 1, pose: STANCE }], p);
    },
    steal(p, f) {
      const { P, run, STANCE } = PS();
      const hit = f && f.sp && f.sp.hit;
      if (p < 0.25) {
        const r = Math.sin(p * 80) * 0.25;
        return P({ lean: 0.12, head: -0.05, fa: [1.0, 2.2 + r], ba: [1.0, 2.5 - r], fl: [0.4, 0.1], bl: [-0.35, -0.35] });
      }
      if (!hit && p < 0.6) {
        const rp = run(p * 3);
        rp.lean = 0.5;
        rp.fa = [1.55, 1.5];
        return rp;
      }
      if (p > 0.92) return P(STANCE);
      return P({ lean: -0.12, head: -0.25, fa: [0.2, 0.0], ba: [-0.3, 0.4], fl: [0.3, 0.1], bl: [-0.3, -0.3] });
    },
    speech(p) {
      const { P, keyframes, STANCE, idle } = PS();
      const g = Math.sin(p * 40) * 0.2;
      if (p < 0.54) {
        const sp = P({ lean: -0.05, head: -0.1, fa: [1.6, PI + 0.7], ba: [PI - 0.6 + g, PI - 0.3 + g], fl: [0.45, 0.1], bl: [-0.4, -0.35] });
        return p < 0.08 ? PS().lerpPose(idle(0), sp, p / 0.08) : sp;
      }
      const T = P({ lean: 0.3, fa: [1.6, 1.6], ba: [1.5, 1.55], fl: [0.65, 0.25], bl: [-0.6, -0.5] });
      return keyframes([{ t: 0.54, pose: T }, { t: 0.85, pose: T }, { t: 1, pose: STANCE }], p);
    }
  };
})();
