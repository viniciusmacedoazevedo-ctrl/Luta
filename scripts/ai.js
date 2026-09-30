/* IA do adversário. Funciona como uma "fonte de entrada" igual ao teclado.
   Decide o que segurar/apertar conforme a dificuldade e a PERSONALIDADE do
   personagem (def.ai: prefer close/mid/far, aggression, jumpy, grabby):
   anda, defende, pula, dá dash, faz combos com rotas (incl. lançador + combo
   aéreo), usa SPECIAL/ULTIMATE e reage à distância e ao comportamento do jogador. */
(function () {
  const M = VF.M;
  const NEUTRAL = ['idle', 'walk', 'run', 'block'];

  class AISource {
    constructor(diffKey) {
      this.p = VF.DIFFICULTY[diffKey] || VF.DIFFICULTY.normal;
      this.holdT = {};
      this.held = {};
      this.taps = {};
      this.dash = 0;
      this.timer = 0.4;
      this.reactCd = 0;
      this.pendingAir = 0;
      this.route = null;
      this.oppBlocks = 0; // quantas vezes o jogador defendeu (para usar agarrão)
    }

    read(held, taps) {
      for (const k in this.held) if (this.held[k]) held[k] = true;
      for (const k in this.taps) if (this.taps[k]) taps[k] = true;
      this.taps = {};
    }

    tap(a) { this.taps[a] = true; }
    hold(a, dur) { this.holdT[a] = dur; }
    release() { this.holdT = {}; }

    /* aperta um golpe "nomeado" montando a direção necessária */
    doMove(me, name) {
      const fwd = me.facing > 0 ? 'right' : 'left', back = me.facing > 0 ? 'left' : 'right';
      this.holdT = {};
      switch (name) {
        case 'light': this.tap('punch'); break;
        case 'medium': this.tap('kick'); break;
        case 'heavy': this.tap('heavy'); break;
        case 'low': this.hold('down', 0.12); this.held.down = true; this.tap('kick'); break;
        case 'sweep': this.hold('down', 0.12); this.held.down = true; this.tap('heavy'); break;
        case 'forward': this.hold(fwd, 0.12); this.held[fwd] = true; this.tap('heavy'); break;
        case 'back': this.hold(back, 0.12); this.held[back] = true; this.tap('punch'); break;
        case 'grab': this.tap('grab'); break;
        case 'air': this.tap('kick'); break;
        case 'air2': this.tap('punch'); break;
        case 'airHeavy': this.tap('heavy'); break;
      }
    }

    reach(me) {
      const k = me.def.attacks.medium.hits[0].box;
      return k[0] + k[2] + 18;
    }

    specialRangeOk(me, opp, dist) {
      const t = me.def.special.type;
      if (['drain', 'rush', 'duo_combo', 'flurry'].includes(t)) return dist < 380;
      if (['dark_burst', 'bless_wave', 'charm', 'hair_vortex', 'spin_storm', 'buff'].includes(t)) return dist < 280;
      if (t === 'gaze') return dist < 480;
      return dist > 110;
    }

    ultimateRangeOk(me, opp, dist) {
      const a = me.def.ultimate.approach;
      if (a === 'rush') return dist < 600;
      return true;
    }

    threat(me, opp, world, dist) {
      for (const pr of world.projectiles) {
        if (pr.owner === opp && !pr.custom && Math.sign(me.x - pr.x) === Math.sign(pr.vx) && Math.abs(me.x - pr.x) < 430) return 'proj';
      }
      if ((opp.state === 'attack' || opp.state === 'special') && dist < 220) return 'melee';
      return null;
    }

    /* rota de combo: sequência que a IA tenta encadear quando acerta */
    pickRoute(me) {
      const routes = [
        ['light', 'light', 'medium', 'heavy'],
        ['light', 'medium', 'back', 'JUMP', 'air', 'air2', 'airHeavy'],
        ['low', 'low', 'medium', 'sweep'],
        ['light', 'light', 'forward'],
        ['medium', 'heavy', 'SPECIAL']
      ];
      if (me.def.stats.speed >= 9) routes.push(['light', 'light', 'light', 'light', 'medium', 'heavy']);
      if (this.p.combo < 0.3) return M.choose(routes.slice(0, 1));
      return M.choose(routes);
    }

    think(dt, me, opp, world) {
      for (const k in this.holdT) this.holdT[k] -= dt;
      this.held = {};
      for (const k in this.holdT) if (this.holdT[k] > 0) this.held[k] = true;
      if (!me.control) return;

      const p = this.p;
      const per = me.def.ai;
      const aggr = M.clamp(p.aggression + (per.aggression || 0), 0.1, 0.95);
      const dx = opp.x - me.x;
      const dist = Math.abs(dx);
      const toward = dx > 0 ? 'right' : 'left';
      const away = dx > 0 ? 'left' : 'right';
      if (opp.state === 'blockstun') this.oppBlocks += dt;

      // ---- continuar a rota de combo quando o golpe conecta
      if (me.state === 'attack' && me.attack && me.attack.contact && !me.attack.aiQueued) {
        me.attack.aiQueued = true;
        if (this.route && Math.random() < p.combo) {
          const next = this.route.shift();
          if (next === 'JUMP') { this.tap('up'); this.pendingAir = 3; }
          else if (next === 'SPECIAL') { if (me.specialReady) this.tap('special'); }
          else if (next) this.doMove(me, next);
          if (me.ultimateReady && Math.random() < p.ultimate * 0.5) this.tap('ultimate');
        }
      }
      // ---- combo aéreo depois do lançador
      if (this.pendingAir > 0 && (me.state === 'jump' || (me.state === 'attack' && me.attack && me.attack.d.air && me.attack.contact))) {
        if (!(me.state === 'attack' && !me.attack.contact) && Math.abs(me.y - opp.y) < 220 && dist < 200 && Math.random() < 0.5) {
          const seq = this.route && this.route.length ? this.route.shift() : M.choose(['air', 'air2', 'airHeavy']);
          if (seq && seq.startsWith('air')) { this.doMove(me, seq); this.pendingAir--; }
        }
        if (me.state === 'jump') this.hold(toward, 0.2);
      }
      if (me.onGround && me.state !== 'jump' && me.state !== 'attack') this.pendingAir = 0;

      // ---- reações
      this.reactCd -= dt;
      const threat = this.threat(me, opp, world, dist);
      if (threat && me.onGround && NEUTRAL.includes(me.state) && this.reactCd <= 0) {
        this.reactCd = M.rand(p.react[0], p.react[1]) * 0.6;
        if (threat === 'proj') {
          if (Math.random() < p.dodge) {
            if (Math.random() < 0.5) { this.tap('up'); this.hold(toward, 0.45); }
            else this.hold('down', 0.5);
          }
        } else if (Math.random() < p.block) {
          this.release();
          this.hold('down', 0.3 + Math.random() * 0.25);
        }
      }
      // castigo: oponente atordoado/preso/lento → ataca com tudo
      const punish = opp.state === 'dazed' || (opp.state === 'bound' && !opp.held) || opp.status.slow > 0;

      this.timer -= dt;
      if (this.timer > 0 && !punish) return;
      this.timer = M.rand(p.react[0], p.react[1]) * (punish ? 0.5 : 1);
      if (!NEUTRAL.includes(me.state) || !me.onGround) return;
      if (this.holdT.down > 0 && !punish) return;

      const reach = this.reach(me);

      // ULTIMATE
      if (me.ultimateReady && Math.random() < p.ultimate && this.ultimateRangeOk(me, opp, dist) && opp.state !== 'down' && opp.state !== 'getup') {
        this.tap('ultimate');
        return;
      }
      // SPECIAL
      if (me.specialReady && Math.random() < p.special && this.specialRangeOk(me, opp, dist) && opp.state !== 'down' && opp.state !== 'getup') {
        this.tap('special');
        return;
      }

      const pref = per.prefer || 'mid';
      const want = pref === 'far' ? 420 : pref === 'close' ? reach - 20 : reach + 40;

      if (dist > reach + 20) {
        this.release();
        const r = Math.random();
        if (pref === 'far' && dist > 300 && dist < want && Math.random() < 0.5) {
          // zoner: mantém distância, recua ou provoca
          if (Math.random() < 0.5) this.hold(away, M.rand(0.2, 0.4));
          else this.hold('down', 0.3);
        } else if (r < p.dash + (per.aggression || 0) * 0.2 && dist > 300) {
          this.dash = Math.sign(dx);
          this.hold(toward, 0.4);
        } else if (r < p.dash + p.jump + (per.jumpy || 0) && dist < 430) {
          this.hold(toward, 0.55);
          this.tap('up');
          this.pendingAir = 1;
          this.route = [M.choose(['air', 'airHeavy'])];
        } else if (Math.random() < aggr || punish) {
          this.hold(toward, M.rand(0.25, 0.6));
        } else if (Math.random() < 0.4) {
          this.hold(away, M.rand(0.15, 0.3));
        }
      } else {
        this.release();
        // jogador defendendo muito → agarrão
        if ((this.oppBlocks > 0.6 || Math.random() < p.grab + (per.grabby || 0)) && dist < 120) {
          this.oppBlocks = 0;
          this.doMove(me, 'grab');
          return;
        }
        if (Math.random() < aggr || punish) {
          this.route = this.pickRoute(me);
          this.doMove(me, this.route.shift());
        } else if (Math.random() < 0.5) {
          this.hold('down', M.rand(0.25, 0.5));
        } else {
          this.hold(away, M.rand(0.15, 0.35));
        }
      }
    }
  }

  VF.AISource = AISource;
})();
