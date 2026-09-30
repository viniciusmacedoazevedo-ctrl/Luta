/* ULTIMATES — sequência cinematográfica:
   1) INTRO: câmera aproxima, fundo escurece, música muda, pose + "ULTIMATE!"
   2) APROXIMAÇÃO: "rush" (avança), "screen" (atinge onde estiver) ou "beam" (raio)
   3) SEQUÊNCIA: vários golpes no estilo do personagem (oponente preso)
   4) FINALIZAÇÃO: efeito gigante próprio + impacto + câmera treme
   Configuração de cada um em assets/characters/<id>/character.js → ultimate. */
(function () {
  const C = VF.CONFIG, M = VF.M, PI = Math.PI;
  const R = (a, b) => a + Math.random() * (b - a);
  const INTRO = 1.0;

  /* golpes de cada estilo: poses + efeito por acerto */
  const STYLES = {
    punch: { poses: ['jab', 'cross', 'hook', 'jab', 'palm'], fx: 'spark' },
    flash: { poses: ['jab', 'highkick', 'cross', 'kick', 'backfist'], fx: 'blink' },
    dark: { poses: ['palm', 'spin', 'highkick', 'thrust'], fx: 'orb' },
    grab: { poses: ['grab', 'throw', 'grab', 'hammer'], fx: 'drain' },
    kick: { poses: ['kick', 'highkick', 'risekick', 'frontkick'], fx: 'spark' },
    elegant: { poses: ['spin', 'highkick', 'palm', 'backfist'], fx: 'confetti' },
    slap: { poses: ['slap', 'backfist', 'slap', 'kneekick'], fx: 'hearts' },
    heavy: { poses: ['hammer', 'double', 'shoulder', 'hook'], fx: 'dust' },
    duo: { poses: ['jab', 'kick', 'cross', 'highkick'], fx: 'spark', swap: true },
    precise: { poses: ['jab', 'palm', 'kneekick', 'cross'], fx: 'sparkle' },
    cast: { poses: ['charge', 'thrust'], fx: 'cast', stay: true }
  };

  /* finalizações */
  const FINISHERS = {
    explosion(w, x, y, U) { VF.BigFX.spawn(w, 'explosion', x, y, { color: U.color, color2: '#fff', dur: 0.9, size: 520 }); VF.FX.burst(w.ps, x, y, U.color, 50, 1000); },
    slashes(w, x, y, U) { VF.BigFX.spawn(w, 'slashes', x, y, { color: U.color, dur: 0.6, n: 14, seed: R(0, 3) }); VF.BigFX.spawn(w, 'explosion', x, y, { color: U.color, dur: 0.5, size: 260 }); },
    dark(w, x, y, U) { VF.BigFX.spawn(w, 'explosion', x, y, { color: U.color, color2: '#1a0033', dur: 1.0, size: 600 }); VF.FX.burst(w.ps, x, y, '#2a0040', 40, 900); },
    drain(w, x, y, U, f) {
      VF.BigFX.spawn(w, 'explosion', x, y, { color: '#ffd600', dur: 0.8, size: 380 });
      for (let i = 0; i < 30; i++) w.ps.spawn({ x: x + R(-40, 40), y: y + R(-60, 60), vx: R(-500, 500), vy: R(-500, 0), life: 1.6, size: 7, color: i % 2 ? '#ffd600' : '#fff59d', add: true, target: f });
    },
    megawave(w, x, y, U, f) { VF.BigFX.spawn(w, 'megawave', f.x, C.GROUND_Y, { color: U.color, color2: '#ffd400', dur: 1.0, dir: f.facing }); },
    gavel(w, x, y, U) { VF.BigFX.spawn(w, 'gavel', x, C.GROUND_Y, { color: U.color, dur: 1.0 }); VF.BigFX.spawn(w, 'bigtext', 640, 250, { text: 'DECISÃO FINAL', color: '#ffffff', dur: 1.4, size: 90 }); },
    rainbow(w, x, y, U) { VF.BigFX.spawn(w, 'rainbow', x, y, { dur: 1.1 }); VF.FX.confetti(w.ps, 1280, 60); },
    wigs(w, x, y, U) { VF.BigFX.spawn(w, 'rain', x, C.GROUND_Y, { icon: 'wig', color: '#6d4c41', dur: 1.2, n: 26, cx: x, spread: 300 }); VF.BigFX.spawn(w, 'explosion', x, y, { color: '#8d6e63', dur: 0.6, size: 300 }); },
    tornado(w, x, y, U) { VF.BigFX.spawn(w, 'tornado', x, C.GROUND_Y, { color: U.color, color2: '#f3e5f5', dur: 1.3, h: 640, w: 380 }); },
    ball(w, x, y, U, f) { VF.BigFX.spawn(w, 'ball', x, y, { color: U.color, dur: 0.8, r: 120, x0: f.x }); VF.BigFX.spawn(w, 'explosion', x, y, { color: '#ffffff', dur: 0.6, size: 420 }); },
    impact(w, x, y, U) { VF.BigFX.spawn(w, 'explosion', x, y, { color: U.color, dur: 0.6, size: 420 }); VF.BigFX.spawn(w, 'slashes', x, y, { color: '#ffffff', n: 6, dur: 0.4 }); },
    digital(w, x, y, U) { VF.BigFX.spawn(w, 'digital', x, y, { color: U.color, dur: 1.3 }); VF.BigFX.spawn(w, 'explosion', x, y, { color: U.color, dur: 0.7, size: 360 }); },
    lightrain(w, x, y, U) { VF.BigFX.spawn(w, 'rain', x, C.GROUND_Y, { icon: 'light', color: '#fff59d', dur: 1.2, n: 22, cx: x, spread: 350 }); VF.BigFX.spawn(w, 'pillar', x, C.GROUND_Y, { color: '#fff59d', dur: 0.9, w: 260 }); },
    pillar(w, x, y, U) { VF.BigFX.spawn(w, 'pillar', x, C.GROUND_Y, { color: U.color, dur: 1.1, w: 360 }); VF.BigFX.spawn(w, 'bolt', x, C.GROUND_Y, { color: '#fff9c4', dur: 0.6 }); },
    legday(w, x, y, U) { VF.BigFX.spawn(w, 'explosion', x, C.GROUND_Y - 20, { color: U.color, dur: 0.8, size: 460 }); VF.BigFX.spawn(w, 'rain', x, C.GROUND_Y, { icon: 'dumbbell', color: U.color, dur: 1, n: 10, cx: x, spread: 300 }); VF.BigFX.spawn(w, 'bigtext', 640, 240, { text: 'LEG DAY!', color: '#ff6d00', dur: 1.3, size: 110 }); },
    sparkles(w, x, y, U) { VF.BigFX.spawn(w, 'hearts', x, y, { icon: 'star', color: U.color, dur: 0.9 }); VF.BigFX.spawn(w, 'slashes', x, y, { color: U.color, n: 8, dur: 0.5 }); },
    curly(w, x, y, U) { VF.BigFX.spawn(w, 'tornado', x, C.GROUND_Y, { color: '#6d4c41', color2: U.color, dur: 1.1, h: 460, w: 300 }); VF.BigFX.spawn(w, 'explosion', x, y, { color: U.color, dur: 0.6, size: 320 }); },
    arrows(w, x, y, U) { VF.BigFX.spawn(w, 'rain', x, C.GROUND_Y, { icon: 'arrow', color: U.color, dur: 1.0, n: 24, cx: x, spread: 280 }); VF.BigFX.spawn(w, 'explosion', x, y, { color: U.color, dur: 0.6, size: 300 }); },
    emc2(w, x, y, U) { VF.BigFX.spawn(w, 'bigtext', 640, 230, { text: 'E = MC²', color: '#ffd600', dur: 1.5, size: 140 }); VF.BigFX.spawn(w, 'explosion', x, y, { color: '#ffffff', color2: '#ffd600', dur: 1.1, size: 700 }); },
    formulas(w, x, y, U) { VF.BigFX.spawn(w, 'formulas', x, y, { color: U.color, dur: 1.0 }); VF.BigFX.spawn(w, 'explosion', x, y, { color: U.color, dur: 0.8, size: 420 }); },
    heartbreak(w, x, y, U) { VF.BigFX.spawn(w, 'hearts', x, y, { icon: 'heart', color: U.color, dur: 1.0 }); VF.BigFX.spawn(w, 'bigtext', x, y - 120, { text: '💔', color: '#ff4081', dur: 1.1, size: 120 }); },
    choir(w, x, y, U, f) { VF.BigFX.spawn(w, 'sound', f.x, f.y - 160, { color: U.color, dur: 1.4 }); VF.BigFX.spawn(w, 'explosion', x, y, { color: U.color, dur: 0.6, size: 300 }); },
    duo(w, x, y, U) { VF.BigFX.spawn(w, 'hearts', x, y, { icon: 'heart', color: U.color, dur: 0.9 }); VF.BigFX.spawn(w, 'explosion', x, y, { color: U.color, dur: 0.8, size: 460 }); },
    roses(w, x, y, U) { VF.BigFX.spawn(w, 'rain', x, C.GROUND_Y, { icon: 'rose', color: U.color, dur: 1.1, n: 20, cx: x, spread: 280 }); VF.BigFX.spawn(w, 'slashes', x, y, { color: U.color, n: 10, dur: 0.5 }); }
  };

  /* efeitos durante a sequência de golpes */
  function hitFx(style, w, f, o, U, i) {
    const x = o.x, y = o.y - 130;
    switch (style.fx) {
      case 'blink': {
        const side = i % 2 ? -1 : 1;
        VF.FX.burst(w.ps, f.x, f.y - 110, U.color, 6, 300);
        f.x = M.clamp(o.x + side * 90, C.STAGE_LEFT, C.STAGE_RIGHT);
        f.facing = Math.sign(o.x - f.x) || f.facing;
        VF.FX.speedLines(w.ps, x, y, f.facing, U.color);
        break;
      }
      case 'orb': VF.FX.energy(w.ps, x, y, U.color, 8, 60); break;
      case 'drain': for (let k = 0; k < 4; k++) w.ps.spawn({ x: x + R(-30, 30), y: y + R(-40, 40), vx: R(-200, 200), vy: R(-300, 0), life: 1.2, size: 6, color: '#ffd600', add: true, target: f }); break;
      case 'confetti': for (let k = 0; k < 8; k++) w.ps.spawn({ x, y, vx: R(-400, 400), vy: R(-500, 0), g: 700, life: 1, size: 6, color: M.choose(['#ff1744', '#ffd600', '#00e676', '#00b0ff', '#d500f9']), shape: 'rect', spin: 8 }); break;
      case 'hearts': VF.FX.text(w.ps, x + R(-40, 40), y - 60, M.choose(['💔', '♥', 'PÁ!']), U.color, 28, 0.6); break;
      case 'dust': VF.FX.dust(w.ps, x, C.GROUND_Y, 8); VF.FX.ring(w.ps, x, y, '#ffffff', 20, 0.3); break;
      case 'sparkle': VF.FX.stars(w.ps, x, y); break;
      case 'cast': {
        const ic = U.castIcon;
        if (ic === 'bolt') VF.BigFX.spawn(w, 'bolt', x + R(-30, 30), C.GROUND_Y, { color: U.color, dur: 0.25 });
        else if (ic === 'formula') VF.FX.text(w.ps, x + R(-80, 80), y + R(-80, 60), M.choose(['π', '√', 'x²', '∑', '∞', '÷']), U.color, 40, 0.6);
        else if (ic === 'digital') { VF.FX.text(w.ps, x + R(-80, 80), y + R(-80, 60), M.choose(['01', '</>', '#', '{}']), U.color, 30, 0.6); VF.FX.burst(w.ps, x, y, U.color, 6, 300); }
        else if (ic === 'note') VF.FX.text(w.ps, x + R(-80, 80), y + R(-80, 60), M.choose(['♪', '♫', '♬']), '#ffffff', 44, 0.6);
        else if (ic === 'wave') VF.FX.ring(w.ps, x, y, U.color, 40, 0.4);
        else if (ic === 'clock') VF.BigFX.spawn(w, 'clock', x, y, { color: U.color, dur: 0.4 });
        else if (ic) VF.BigFX.spawn(w, 'rain', x, C.GROUND_Y, { icon: ic, color: U.color2 || U.color, dur: 0.6, n: 3, cx: x, spread: 80 });
        VF.FX.energy(w.ps, x, y, U.color, 6, 70);
        break;
      }
      default: VF.FX.energy(w.ps, x, y, U.color, 4, 40);
    }
  }

  class UltimateRunner {
    constructor(f, o, w) {
      this.f = f; this.o = o; this.w = w;
      this.U = Object.assign({ approach: 'rush', hits: 8, style: 'punch', dmg: 16, finish: 150, finisher: 'explosion', color: f.def.color }, f.def.ultimate);
      this.style = STYLES[this.U.style] || STYLES.punch;
      this.t = 0;
      this.phase = 'intro';
      this.pt = 0;
      this.armor = true;
      this.i = 0;
      this.startX = f.x;
      f.ult = this;
      w.cam.focus = { x: f.x + f.facing * 40, y: f.y - 170, zoom: 1.5, speed: 7 };
      w.ultDark = 1;
      VF.Audio.play('ultimate');
      VF.Audio.musicOverride('ultimate');
      w.announcer.showUltimate(f);
    }

    setPhase(p) { this.phase = p; this.pt = 0; }

    connectable() { return this.o.state !== 'down' && this.o.state !== 'getup' && this.o.alpha > 0.3; }

    update(dt) {
      const f = this.f, o = this.o, w = this.w, U = this.U;
      this.t += dt;
      this.pt += dt;
      switch (this.phase) {
        case 'intro':
          if (Math.random() < 0.9) VF.FX.converge(w.ps, f.x, f.y - 130, U.color, 3, 160);
          if (this.pt >= INTRO) {
            this.setPhase('approach');
            w.cam.focus = null;
            if (U.approach === 'screen' || U.approach === 'beam') {
              if (U.approach === 'beam') VF.BigFX.spawn(w, 'beam', f.x + f.facing * 60, f.y - 170, { color: U.color, dur: 0.5, dir: f.facing, h: 170 });
              if (this.connectable() && (U.approach === 'screen' || Math.abs(o.y - C.GROUND_Y) < 200)) this.connect();
              else this.whiff();
            }
          }
          break;
        case 'approach': {
          if (U.approach !== 'rush') break;
          const dx = o.x - f.x;
          f.facing = Math.sign(dx) || f.facing;
          f.x += f.facing * 1800 * dt;
          f.x = M.clamp(f.x, C.STAGE_LEFT, C.STAGE_RIGHT);
          VF.FX.speedLines(w.ps, f.x, f.y - 110, -f.facing, U.color);
          if (Math.abs(o.x - f.x) < 115 && this.connectable()) this.connect();
          else if (this.pt > 0.45 || Math.sign(o.x - f.x) !== f.facing) this.whiff();
          break;
        }
        case 'combo': {
          const gap = U.gap || (this.style.stay ? 0.14 : 0.1);
          if (!this.style.stay && this.style.fx !== 'blink') {
            o.x = M.clamp(f.x + f.facing * 95, C.STAGE_LEFT, C.STAGE_RIGHT);
            if (o.x !== f.x + f.facing * 95) f.x = o.x - f.facing * 95;
          }
          o.y = M.approach(o.y, C.GROUND_Y - (this.i > U.hits / 2 && U.juggle ? 80 : 0), 900 * dt);
          while (this.i < U.hits && this.pt >= this.i * gap) {
            const box = { x: o.x - 60, y: o.y - 220, w: 120, h: 220 };
            VF.Combat.hit(w, f, o, { dmg: U.dmg, stun: 1.2, kb: 0, hold: true, unblockable: true, noScale: true, sfx: this.i % 2 ? 'kick' : 'punch', spark: 1.3, color: U.color, shake: 3 }, box, f.facing, true);
            hitFx(this.style, w, f, o, U, this.i);
            if (this.style.swap) f.swap = !f.swap;
            w.cam.focus = { x: (f.x + o.x) / 2 + R(-20, 20), y: f.y - 170 + R(-15, 15), zoom: 1.3 + (this.i % 2) * 0.06, speed: 12 };
            this.i++;
          }
          if (this.pt >= U.hits * gap + 0.15) {
            this.setPhase('finisher');
            w.cam.focus = { x: o.x, y: o.y - 160, zoom: 1.4, speed: 10 };
            VF.Audio.play('charge');
          }
          break;
        }
        case 'finisher':
          if (this.pt >= 0.25 && !this.finished) {
            this.finished = true;
            const x = o.x, y = o.y - 130;
            (FINISHERS[U.finisher] || FINISHERS.explosion)(w, x, y, U, f);
            o.held = false;
            VF.Combat.hit(w, f, o, { dmg: U.finish, stun: 0.8, kb: 900, kbY: -950, knockdown: true, wallbounce: true, unblockable: true, noScale: true, sfx: 'heavy', spark: 3, color: U.color }, { x: o.x - 80, y: o.y - 240, w: 160, h: 240 }, f.facing, true);
            VF.Audio.play('boom');
            VF.Audio.play('ko');
            w.shake(20, 0.6);
            w.flashScreen('#ffffff', 0.9);
            w.slowmo = Math.max(w.slowmo, 0.6);
            w.cam.focus = { x: o.x, y: o.y - 160, zoom: 1.2, speed: 4 };
            if (U.name) VF.FX.text(w.ps, f.x, f.y - 300, U.name, U.color, 40, 1.4);
          }
          if (this.pt >= 0.9) this.end();
          break;
        case 'whiff':
          if (this.pt >= 0.5) this.end();
          break;
      }
    }

    connect() {
      this.setPhase('combo');
      this.o.held = true;
      this.o.attack = null;
      this.o.sp = null;
      this.o.setState('bound');
      this.o.stun = 2;
      this.o.vx = 0;
      this.o.vy = 0;
      if (this.o.y < C.GROUND_Y) this.o.onGround = true;
      VF.FX.text(this.w.ps, this.o.x, this.o.y - 270, 'PEGOU!', '#ffffff', 30, 0.8);
    }

    whiff() {
      this.setPhase('whiff');
      this.armor = false;
      VF.FX.text(this.w.ps, this.f.x, this.f.y - 260, 'ERROU!', '#ffffff', 34, 1);
    }

    end() {
      const f = this.f, w = this.w;
      f.ult = null;
      f.swap = false;
      if (f.state === 'ultimate') f.setState('idle');
      if (this.o.held) { this.o.held = false; this.o.setState('idle'); }
      f.y = C.GROUND_Y;
      f.onGround = true;
      w.ultimateActive = null;
      w.cam.focus = null;
      w.ultDark = 0;
      VF.Audio.musicOverride(null);
    }

    pose(f) {
      const K = VF.Poses.K, P = VF.Poses.P;
      switch (this.phase) {
        case 'intro': {
          const k = this.pt / INTRO;
          const ult = f.skin.look && f.skin.look.ultPose;
          const pose = ult ? ult(k) : (k < 0.5 ? K.charge : K.pose);
          return VF.Poses.lerpPose(VF.Poses.idle(0, f), P(pose), Math.min(1, k * 3));
        }
        case 'approach': return P(this.U.approach === 'rush' ? K.dash : K.thrust);
        case 'combo': {
          const name = this.style.poses[Math.max(0, this.i - 1) % this.style.poses.length];
          return P(K[name] || K.jab);
        }
        case 'finisher': return P(this.pt < 0.25 ? K.charge : this.U.finishPose ? K[this.U.finishPose] : K.thrust);
        default: return P(K.pose);
      }
    }
  }

  VF.Ultimates = {
    STYLES, FINISHERS,
    start(f, o, w) { const u = new UltimateRunner(f, o, w); w.ultimateActive = u; return u; }
  };
})();
