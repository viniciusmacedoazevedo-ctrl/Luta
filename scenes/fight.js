/* CENA DE LUTA v2: rounds (ROUND → 3 → 2 → 1 → FIGHT!), timer de 60s, K.O.,
   tempo, empate/desempate, FINAL ROUND, câmera dinâmica, SPECIAL, ULTIMATE
   cinematográfica, pausa e renderização em camadas com parallax. */
(function () {
  const C = VF.CONFIG;

  VF.Game.register('fight', {
    enter() {
      const S = VF.Session;
      const set = VF.Settings.data;
      if (!S.p1) S.p1 = 'vini';
      if (!S.p2) S.p2 = 'arthur';
      if (!S.arena) S.arena = 'rua';

      this.match = new VF.Match({ p1: S.p1, p2: S.p2, arena: S.arena, mode: S.mode, difficulty: S.difficulty });
      this.arena = VF.getArena(S.arena);
      this.bgDef = VF.Backgrounds[this.arena.id];
      this.bg = this.bgDef.create();

      // controles: teclado/touch para humanos, IA para CPU
      this.ai1 = this.ai2 = null;
      let c1, c2;
      if (S.mode === 'demo') {
        this.ai1 = new VF.AISource(S.difficulty);
        c1 = new VF.Controller([this.ai1]);
      } else {
        const both = S.mode !== 'pvp';
        c1 = new VF.Controller([
          new VF.KeyboardSource(() => (both ? [set.bindings.p1, set.bindings.p2] : [set.bindings.p1])),
          VF.Touch.source
        ]);
      }
      if (S.mode === 'pvp') c2 = new VF.Controller([new VF.KeyboardSource(() => [set.bindings.p2])]);
      else { this.ai2 = new VF.AISource(S.difficulty); c2 = new VF.Controller([this.ai2]); }

      const d1 = VF.getCharacter(S.p1), d2 = VF.getCharacter(S.p2);
      this.fighters = [
        new VF.Fighter(d1, 0, c1, { label: S.mode === 'demo' ? 'CPU' : 'P1', cpu: S.mode === 'demo' }),
        new VF.Fighter(d2, 1, c2, { label: S.mode === 'pvp' ? 'P2' : 'CPU', cpu: S.mode !== 'pvp', alt: S.p1 === S.p2 })
      ];
      const K = (p, a) => '[' + VF.keyLabel(set.bindings[p][a][0]) + ']';
      this.keyHint = [
        S.mode !== 'demo' && !VF.Device.touch ? { special: K('p1', 'special'), ultimate: K('p1', 'ultimate') } : null,
        S.mode === 'pvp' ? { special: K('p2', 'special'), ultimate: K('p2', 'ultimate') } : null
      ];

      this.announcer = new VF.Announcer();
      this.world = this.makeWorld();
      this.timers = [];
      this.paused = false;
      this.t = 0;
      this.timeLeft = C.ROUND_TIME;
      this.phase = 'intro';

      this.buildDOM();
      VF.Audio.playMusic(this.arena.music);
      VF.Touch.show(S.mode !== 'demo');
      this.offKey = VF.Keyboard.onKey((e) => {
        if (e.code === 'Escape' || e.code === 'KeyP' || e.code === 'Pause') this.togglePause();
      });
      this.onVis = () => { if (document.hidden && !this.paused && this.phase !== 'end') this.togglePause(true); };
      document.addEventListener('visibilitychange', this.onVis);
      this.startRound();
    },

    exit() {
      if (this.offKey) this.offKey();
      document.removeEventListener('visibilitychange', this.onVis);
      VF.Touch.show(false);
      VF.Audio.musicOverride(null);
    },

    onDeviceChange() { if (!this.paused) VF.Touch.show(VF.Session.mode !== 'demo'); },

    makeWorld() {
      const scene = this;
      const cam = new VF.Camera();
      return {
        time: 0,
        fighters: this.fighters,
        projectiles: [],
        bigfx: [],
        ps: new VF.ParticleSystem(900),
        cam,
        announcer: this.announcer,
        hitstop: 0,
        freeze: 0,
        flashA: 0,
        flashColor: '#ffffff',
        slowmo: 0,
        ultDark: 0,
        timeFx: 0,
        ultimateActive: null,
        addProjectile(p) { this.projectiles.push(p); },
        shake(a, d) { cam.shake(a, d); },
        camPunch(x, y, zoom, dur) { cam.punch = { x, y: y - 40, zoom, t: dur, dur }; },
        camNudge(dx) { cam.nx += dx; },
        flashScreen(c, a) { this.flashColor = c; this.flashA = Math.max(this.flashA, a); },
        superFlash(f) {
          this.freeze = 0.7;
          scene.announcer.showBanner(f);
          VF.Audio.play('ready');
          this.flashScreen(f.def.color, 0.35);
          cam.punch = { x: f.x, y: f.y - 150, zoom: 1.25, t: 0.7, dur: 0.7 };
        },
        startUltimate(f, o) { VF.Ultimates.start(f, o, this); },
        onKO(att, def) { scene.onKO(att, def); },
        comboEvent(att, lvl) { scene.onCombo(att, lvl); }
      };
    },

    buildDOM() {
      const s = VF.UI.screen('fight-screen');
      this.dom = s;
      s.innerHTML = `<button class="pause-btn" type="button" aria-label="Pausar">❚❚</button>
        <div class="pause-overlay hidden"><div class="panel pause-panel"><h1 class="title">PAUSE</h1><div class="pause-buttons"></div>
        <div class="pause-help"></div></div></div>`;
      s.querySelector('.pause-btn').addEventListener('click', () => { VF.Audio.play('click'); this.togglePause(); });
      const box = s.querySelector('.pause-buttons');
      VF.UI.button('▶ CONTINUAR', () => this.togglePause(false), 'primary', box);
      VF.UI.button('🔄 REINICIAR LUTA', () => VF.Game.go('fight'), '', box);
      VF.UI.button('👥 ESCOLHER PERSONAGEM', () => VF.Game.go('select'), '', box);
      VF.UI.button('🏠 MENU PRINCIPAL', () => VF.Game.go('menu'), 'danger', box);
      const b = VF.Settings.data.bindings;
      const K = (p, a) => `<kbd>${VF.keyLabel(b[p][a][0])}</kbd>`;
      const d = this.fighters[0].def;
      s.querySelector('.pause-help').innerHTML = (VF.Device.touch
        ? 'Joystick: mover • ↑ pular • ↓ baixo/defesa • ← + golpe = lançador • toque duplo = dash'
        : `${K('p1', 'left')}${K('p1', 'right')} mover • ${K('p1', 'up')} pular • ${K('p1', 'down')} defesa • ${K('p1', 'punch')} leve • ${K('p1', 'kick')} chute • ${K('p1', 'heavy')} pesado • ${K('p1', 'grab')} agarrão • ${K('p1', 'special')} especial • ${K('p1', 'ultimate')} ultimate`) +
        `<br><b>${d.name} — COMBO:</b> ${d.combo || ''}`;
    },

    togglePause(force) {
      const want = force === undefined ? !this.paused : force;
      if (this.phase === 'end') return;
      this.paused = want;
      const ov = this.dom.querySelector('.pause-overlay');
      ov.classList.toggle('hidden', !want);
      VF.Touch.show(!want && VF.Session.mode !== 'demo');
      if (want) {
        VF.Audio.play('back');
        VF.UI.enableNav(ov, () => this.togglePause(false));
      } else if (VF.UI.navOff) {
        VF.UI.navOff();
        VF.UI.navOff = null;
      }
    },

    after(delay, fn) { this.timers.push({ t: delay, fn }); },

    startRound() {
      const [a, b] = this.fighters;
      a.reset(C.P1_START, 1);
      b.reset(C.P2_START, -1);
      a.introSash = b.introSash = true;
      const w = this.world;
      w.projectiles = [];
      w.bigfx = [];
      w.ps.clear();
      w.time = 0;
      w.slowmo = w.freeze = w.hitstop = w.timeFx = w.ultDark = 0;
      w.ultimateActive = null;
      w.cam.reset();
      this.timeLeft = C.ROUND_TIME;
      this.phase = 'intro';
      this.lastTick = null;
      const final = this.match.round >= 3;
      this.announcer.show(this.match.roundLabel, {
        dur: 1.2, size: final ? 118 : 135, color: '#ffffff', color2: final ? '#ff1744' : '#ffd600',
        sub: final ? 'DESEMPATE — QUEM VENCER LEVA!' : `PLACAR ${this.match.wins[0]} x ${this.match.wins[1]}`
      });
      VF.Audio.play('round');
      VF.Audio.announce(final ? 'Final round' : 'Round ' + ['one', 'two', 'three'][this.match.round - 1]);
      // contagem 3, 2, 1
      ['3', '2', '1'].forEach((n, i) => this.after(1.3 + i * 0.55, () => {
        this.announcer.show(n, { dur: 0.5, size: 160, color: '#ffffff', color2: '#29b6f6' });
        VF.Audio.play('countdown');
      }));
      this.after(1.3 + 3 * 0.55, () => {
        this.announcer.show('FIGHT!', { dur: 0.9, size: 175, color: '#fff59d', color2: '#ff1744', shake: true });
        VF.Audio.play('fight');
        VF.Audio.announce('Fight!');
        this.phase = 'fight';
        a.control = b.control = true;
        a.introSash = b.introSash = false;
      });
    },

    onCombo(att, lvl) {
      const x = att.side ? 1100 : 180;
      const cols = ['#ffe57f', '#ffab40', '#ff1744'];
      VF.FX.ring(this.world.ps, x, 300, cols[lvl - 1], 30 + lvl * 10, 0.4);
      if (lvl >= 2) this.world.shake(3 + lvl * 2, 0.15);
      if (lvl >= 3) { this.world.flashScreen('#ff1744', 0.15); this.world.camPunch(att.x, att.y - 120, 1.12, 0.3); }
    },

    onKO(att, def) {
      if (this.phase !== 'fight') return;
      this.phase = 'ko';
      const w = this.world;
      w.slowmo = 1.2;
      w.flashScreen('#ffffff', 0.7);
      w.shake(16, 0.5);
      w.camPunch(def.x, def.y - 120, 1.3, 1.2);
      VF.Audio.play('ko');
      VF.Audio.announce('K.O.');
      this.announcer.show('K.O.!', { dur: 1.9, size: 200, color: '#ff8a80', color2: '#d50000', shake: true });
      for (const f of this.fighters) f.control = false;
      def.stayDown = true;
      this.after(2.2, () => {
        const [a, b] = this.fighters;
        if (a.hp <= 0 && b.hp <= 0) this.resolveTie('DUPLO K.O.!');
        else this.endRound(a.hp > 0 ? 0 : 1);
      });
    },

    onTimeUp() {
      this.phase = 'timeup';
      for (const f of this.fighters) f.control = false;
      this.announcer.show('TIME!', { dur: 1.4, size: 150, color: '#ffffff', color2: '#29b6f6' });
      VF.Audio.play('round');
      VF.Audio.announce('Time!');
      this.after(1.6, () => {
        const [a, b] = this.fighters;
        if (a.hp === b.hp) this.resolveTie('EMPATE!');
        else this.endRound(a.hp > b.hp ? 0 : 1);
      });
    },

    resolveTie(title) {
      this.phase = 'tie';
      const [a, b] = this.fighters;
      const d = VF.Match.decide({ hp: 0, round: a.round }, { hp: 0, round: b.round });
      for (const f of this.fighters) {
        if (f.state !== 'down' && f.state !== 'knockdown') { f.setState('defeat'); f.vx = 0; }
      }
      this.announcer.show(title, { dur: 2.2, size: 140, color: '#e1bee7', color2: '#7b1fa2', sub: 'DESEMPATE: ' + d.reason });
      VF.Audio.play('draw');
      VF.FX.confetti(this.world.ps, 1280, 40);
      this.after(2.4, () => this.endRound(d.winner));
    },

    endRound(w) {
      this.match.record(w);
      const winner = this.fighters[w], loser = this.fighters[1 - w];
      winner.stats.roundsWon++;
      if (winner.state !== 'down' && winner.state !== 'knockdown') { winner.setState('victory'); winner.vx = 0; }
      if (loser.state !== 'down' && loser.state !== 'knockdown') { loser.setState('defeat'); loser.vx = 0; }
      this.phase = 'roundEnd';
      this.world.cam.focus = { x: winner.x, y: winner.y - 170, zoom: 1.35, speed: 3 };
      this.announcer.show(`${winner.def.short || winner.def.name} VENCE!`, {
        dur: 2.2, size: 92, color: '#fff59d', color2: winner.def.color,
        sub: this.match.over ? 'VITÓRIA DA PARTIDA!' : `PLACAR ${this.match.wins[0]} x ${this.match.wins[1]}`
      });
      VF.Audio.play('victory');
      this.after(2.6, () => {
        this.world.cam.focus = null;
        if (this.match.over) this.finishMatch();
        else this.startRound();
      });
    },

    finishMatch() {
      this.phase = 'end';
      const w = this.match.winner;
      const f = this.fighters[w], l = this.fighters[1 - w];
      VF.Game.go('victory', {
        winner: { id: f.def.id, label: f.label, cpu: f.isCPU, colors: f.colors, stats: f.stats },
        loser: { id: l.def.id, label: l.label, stats: l.stats },
        wins: this.match.wins.slice(),
        arena: this.arena.id,
        rounds: this.match.history.length
      });
    },

    update(dt) {
      if (this.paused) return;
      this.t += dt;
      this.announcer.update(dt);
      for (const tm of this.timers) tm.t -= dt;
      const due = this.timers.filter((tm) => tm.t <= 0);
      this.timers = this.timers.filter((tm) => tm.t > 0);
      due.forEach((tm) => tm.fn());
      if (VF.Game.scene !== this) return;

      const w = this.world;
      const [a, b] = this.fighters;
      if (w.flashA > 0) w.flashA = Math.max(0, w.flashA - dt * 1.8);
      if (w.timeFx > 0) w.timeFx -= dt;
      w.ps.update(dt * (w.slowmo > 0 ? 0.4 : 1));
      VF.BigFX.update(w, dt);
      w.cam.update(dt, this.fighters);
      VF.Touch.setSpecialReady(a.specialReady, a.ultimateReady);

      // ULTIMATE: a introdução congela a luta
      const U = w.ultimateActive;
      if (U) {
        U.update(dt);
        w.ultDark = Math.min(1, w.ultDark + dt * 4);
        if (U.phase === 'intro') return;
      } else if (w.ultDark > 0) w.ultDark = Math.max(0, w.ultDark - dt * 2);

      if (w.freeze > 0) { w.freeze -= dt; return; }
      if (w.hitstop > 0) { w.hitstop -= dt; return; }
      let sdt = dt;
      if (w.slowmo > 0) { w.slowmo -= dt; sdt = dt * 0.3; }

      if (this.ai1) this.ai1.think(sdt, a, b, w);
      if (this.ai2) this.ai2.think(sdt, b, a, w);
      a.ctrl.poll(sdt);
      b.ctrl.poll(sdt);
      w.time += sdt;
      a.update(sdt, b, w);
      b.update(sdt, a, w);
      VF.Combat.bodies(a, b);
      VF.Combat.entities(w, sdt);

      if (this.phase === 'fight' && !U) {
        this.timeLeft -= dt;
        const secs = Math.ceil(this.timeLeft);
        if (secs <= 10 && secs > 0 && secs !== this.lastTick) {
          this.lastTick = secs;
          VF.Audio.play('tick');
        }
        if (this.timeLeft <= 0) {
          this.timeLeft = 0;
          this.onTimeUp();
        }
      }
    },

    render(ctx) {
      const w = this.world;
      const cam = w.cam;
      // fundo com parallax
      ctx.save();
      cam.apply(ctx, 0.6);
      this.bgDef.draw(ctx, this.t, this.bg);
      ctx.restore();
      ctx.save();
      cam.apply(ctx, 1);
      // escurecimento (SPECIAL / ULTIMATE)
      const dark = Math.max(w.freeze > 0 ? Math.min(0.6, w.freeze * 1.5) : 0, w.ultDark * 0.75);
      if (dark > 0) {
        ctx.fillStyle = `rgba(5,0,15,${dark})`;
        ctx.fillRect(-400, -400, 2100, 1600);
      }
      for (const f of this.fighters) f.renderShadow(ctx);
      const top = (f) => (['attack', 'special', 'ultimate'].includes(f.state) ? 1 : 0);
      const order = this.fighters.slice().sort((x, y) => top(x) - top(y));
      for (const f of order) f.render(ctx);
      for (const p of w.projectiles) p.render(ctx);
      VF.BigFX.render(ctx, w);
      w.ps.render(ctx);
      ctx.restore();
      ctx.save();
      cam.apply(ctx, 0.9);
      if (this.bgDef.front) this.bgDef.front(ctx, this.t, this.bg);
      ctx.restore();
      // tempo lento (Relatividade): tinta azulada
      if (w.timeFx > 0) {
        ctx.fillStyle = `rgba(80,160,255,${Math.min(0.18, w.timeFx * 0.1)})`;
        ctx.fillRect(0, 0, C.WIDTH, C.HEIGHT);
      }
      if (w.flashA > 0) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, w.flashA) * 0.55;
        ctx.fillStyle = w.flashColor;
        ctx.fillRect(0, 0, C.WIDTH, C.HEIGHT);
        ctx.restore();
      }
      if (!(w.ultimateActive && w.ultimateActive.phase === 'intro')) VF.HUD.draw(ctx, this);
      this.announcer.draw(ctx);
    }
  });
})();
