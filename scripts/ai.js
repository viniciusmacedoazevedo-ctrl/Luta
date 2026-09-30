/* IA do adversário. Funciona como uma "fonte de entrada" igual ao teclado:
   decide o que segurar/apertar a cada intervalo de reação, conforme a dificuldade. */
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
      this.pendingAir = false;
    }

    read(held, taps) {
      for (const k in this.held) if (this.held[k]) held[k] = true;
      for (const k in this.taps) if (this.taps[k]) taps[k] = true;
      this.taps = {};
    }

    tap(a) { this.taps[a] = true; }
    hold(a, dur) { this.holdT[a] = dur; }
    release() { this.holdT = {}; }

    reach(me) {
      const k = me.def.attacks.kick.hits[0].box;
      return k[0] + k[2] + 20;
    }

    specialRangeOk(me, opp, dist) {
      const id = me.def.special.id;
      if (id === 'steal') return dist < 360;
      if (id === 'flash') return true;
      return dist > 110;
    }

    threat(me, opp, world, dist) {
      for (const pr of world.projectiles) {
        if (pr.owner === opp && Math.sign(me.x - pr.x) === Math.sign(pr.vx) && Math.abs(me.x - pr.x) < 430) return 'proj';
      }
      if ((opp.state === 'attack' || opp.state === 'special') && dist < 210) return 'melee';
      return null;
    }

    think(dt, me, opp, world) {
      for (const k in this.holdT) this.holdT[k] -= dt;
      this.held = {};
      for (const k in this.holdT) if (this.holdT[k] > 0) this.held[k] = true;
      if (!me.control) return;

      const p = this.p;
      const dx = opp.x - me.x;
      const dist = Math.abs(dx);
      const toward = dx > 0 ? 'right' : 'left';
      const away = dx > 0 ? 'left' : 'right';

      // continuar combos quando o golpe conecta
      if (me.state === 'attack' && me.attack && me.attack.contact && !me.attack.aiQueued) {
        me.attack.aiQueued = true;
        if (Math.random() < p.combo) {
          if (me.specialReady && Math.random() < p.special * 0.6 && this.specialRangeOk(me, opp, dist)) this.tap('special');
          else {
            const seq = ['punch', 'kick', 'heavy'];
            this.tap(seq[Math.min(2, me.attack.chain + (me.attack.name === 'punch' ? 0 : 1))]);
          }
        }
      }

      // ataque aéreo depois de pular
      if (this.pendingAir && me.state === 'jump' && dist < 190 && me.vy > -500) {
        this.pendingAir = false;
        this.tap('kick');
      }
      if (me.onGround && me.state !== 'jump') this.pendingAir = false;

      // reações (defender / esquivar)
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

      this.timer -= dt;
      if (this.timer > 0) return;
      this.timer = M.rand(p.react[0], p.react[1]);
      if (!NEUTRAL.includes(me.state) || !me.onGround) return;
      if (this.holdT.down > 0) return;

      const reach = this.reach(me);

      // poder especial
      if (me.specialReady && Math.random() < p.special && this.specialRangeOk(me, opp, dist) &&
          opp.state !== 'down' && opp.state !== 'getup') {
        this.tap('special');
        return;
      }

      if (dist > reach + 25) {
        // aproximar
        const r = Math.random();
        this.release();
        if (r < p.dash && dist > 320) {
          this.dash = Math.sign(dx);
          this.hold(toward, 0.4);
        } else if (r < p.dash + p.jump && dist < 430) {
          this.hold(toward, 0.55);
          this.tap('up');
          this.pendingAir = true;
        } else if (Math.random() < p.aggression) {
          this.hold(toward, M.rand(0.25, 0.6));
        } else if (Math.random() < 0.4) {
          this.hold(away, M.rand(0.15, 0.3));
        }
      } else {
        // no alcance: atacar, defender ou recuar
        this.release();
        if (Math.random() < p.aggression) {
          const r = Math.random();
          this.tap(r < 0.45 ? 'punch' : r < 0.8 ? 'kick' : 'heavy');
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
