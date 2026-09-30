/* LUTADOR v2: máquina de estados, física, golpes direcionais, rotas de combo
   (cancelamentos, jump cancel, dash cancel), juggles, bounce, agarrão,
   SPECIAL, ULTIMATE e efeitos de status (preso, tonto, lento, fortalecido). */
(function () {
  const C = VF.CONFIG, M = VF.M;
  const NEUTRAL = ['idle', 'walk', 'run', 'block'];
  const ALWAYS_CANCEL = ['special', 'ultimate'];

  class Fighter {
    constructor(def, side, ctrl, opts) {
      opts = opts || {};
      this.def = def;
      this.skin = def.skin;
      this.side = side;
      this.ctrl = ctrl;
      this.colors = opts.alt ? Object.assign({}, this.skin.colors, this.skin.alt) : this.skin.colors;
      this.partnerColors = def.partnerSkin ? (opts.alt ? Object.assign({}, def.partnerSkin.colors, def.partnerSkin.alt) : def.partnerSkin.colors) : null;
      this.label = opts.label || (side ? 'P2' : 'P1');
      this.isCPU = !!opts.cpu;
      this.special = 0;
      this.ultimate = 0;
      this.stats = { damage: 0, hits: 0, maxCombo: 0, specials: 0, ultimates: 0, blocks: 0, roundsWon: 0 };
      this.reset(side ? C.P2_START : C.P1_START, side ? -1 : 1);
    }

    reset(x, facing) {
      Object.assign(this, {
        x, y: C.GROUND_Y, vx: 0, vy: 0, facing, hp: C.MAX_HP, dispHp: C.MAX_HP, hpLagT: 0,
        state: 'idle', st: 0, anim: Math.random() * 3, attack: null, sp: null, ult: null, stun: 0, invuln: 0,
        onGround: true, combo: 0, comboShow: 0, comboPop: 0, lastHitAt: -9, airUsed: false, airChain: 0, flash: 0,
        afterimages: [], aiT: 0, control: false, alpha: 1, dashDir: 0, stayDown: false, introSash: false,
        juggle: 0, bounceReady: false, wallReady: false, chainUse: {}, status: {}, wigOff: false, swap: false
      });
      this.round = { damage: 0, maxCombo: 0, hits: 0 };
      if (this.ctrl) this.ctrl.reset();
    }

    setState(s) { this.state = s; this.st = 0; }

    get hurtbox() {
      const h = C.HURTBOX;
      if (this.state === 'down') return { x: this.x - 100, y: this.y - 40, w: 200, h: 40 };
      const crouch = this.state === 'block' || this.state === 'blockstun' ? 14 : 0;
      return { x: this.x + h.x, y: this.y + h.y + crouch, w: h.w, h: h.h - crouch };
    }

    hitboxWorld(box) {
      const [bx, by, bw, bh] = box;
      return { x: this.facing > 0 ? this.x + bx : this.x - bx - bw, y: this.y + by, w: bw, h: bh };
    }

    gainSpecial(v) {
      if (this.state === 'special' || this.state === 'ultimate') return;
      this.special = M.clamp(this.special + v, 0, C.SPECIAL_MAX);
    }
    gainUltimate(v) {
      if (this.state === 'ultimate') return;
      this.ultimate = M.clamp(this.ultimate + v, 0, C.ULTIMATE_MAX);
    }

    get specialReady() { return this.special >= C.SPECIAL_MAX; }
    get ultimateReady() { return this.ultimate >= C.ULTIMATE_MAX; }
    get powerMul() { return this.def.power * (this.status.buff > 0 ? 1.35 : 1); }
    get speedMul() { return this.status.buff > 0 ? 1.22 : 1; }

    canBeHit() {
      return this.invuln <= 0 && this.state !== 'down' && this.state !== 'getup' &&
        !(this.sp && this.sp.armor > 0) && !(this.ult && this.ult.armor) && this.alpha > 0.3;
    }

    // ---------------------------------------------------------------
    update(dt, opp, world) {
      // lentidão (Relatividade) afeta o tempo deste lutador
      if (this.status.slow > 0) { this.status.slow -= dt; dt *= 0.45; }
      if (this.status.buff > 0) this.status.buff -= dt;
      this.st += dt;
      this.anim += dt;
      if (this.invuln > 0) this.invuln -= dt;
      if (this.flash > 0) this.flash -= dt;
      if (this.comboShow > 0) this.comboShow -= dt;
      if (this.comboPop > 0) this.comboPop -= dt * 4;
      if (this.dispHp > this.hp) {
        this.hpLagT -= dt;
        if (this.hpLagT <= 0) this.dispHp = Math.max(this.hp, this.dispHp - 700 * dt);
      } else this.dispHp = this.hp;
      this.recordAfterimage(dt);

      const c = this.control ? this.ctrl : null;

      if (this.onGround && (NEUTRAL.includes(this.state) || this.state === 'blockstun' || this.state === 'land')) {
        const dx = opp.x - this.x;
        if (Math.abs(dx) > 8) {
          const nf = Math.sign(dx);
          if (nf !== this.facing) {
            this.facing = nf;
            if (this.state === 'run') this.setState('idle');
          }
        }
      }
      if (NEUTRAL.includes(this.state) && this.onGround) { this.chainUse = {}; this.juggleOpp = 0; }

      switch (this.state) {
        case 'idle': case 'walk': case 'run': case 'block':
          this.neutral(dt, c, opp, world);
          break;
        case 'land':
          this.friction(dt);
          if (this.st > 0.07) this.setState('idle');
          break;
        case 'jump':
          this.air(dt, c, world);
          break;
        case 'dash':
          this.vx = this.dashDir * this.def.dashSpeed * this.speedMul;
          if (c && this.st > 0.05 && this.dashDir === this.facing) {
            const n = this.resolveAttack(c);
            if (n) { this.startAttack(n, world, true); break; }
          }
          if (this.st >= this.def.dashTime) {
            if (c && c.dirX() === this.dashDir && this.dashDir === this.facing) this.setState('run');
            else { this.vx *= 0.25; this.setState('idle'); }
          }
          break;
        case 'attack':
          this.updateAttack(dt, c, opp, world);
          break;
        case 'special':
          if (this.sp) {
            this.sp.update(dt);
            if (this.sp && this.sp.done) { this.sp = null; this.setState(this.onGround ? 'idle' : 'jump'); }
          } else this.setState('idle');
          break;
        case 'ultimate':
          if (!this.ult) this.setState('idle');
          break;
        case 'hurt':
          this.stun -= dt;
          this.friction(dt);
          if (this.stun <= 0) this.setState('idle');
          break;
        case 'bound':
          this.vx = 0;
          this.stun -= dt;
          if (this.stun <= 0 && !this.held) this.setState(this.onGround ? 'idle' : 'jump');
          break;
        case 'dazed':
          this.friction(dt);
          this.stun -= dt;
          if (Math.random() < dt * 6) VF.FX.stars(world.ps, this.x, this.y - 250);
          if (this.stun <= 0) this.setState('idle');
          break;
        case 'blockstun':
          this.stun -= dt;
          this.friction(dt);
          if (this.stun <= 0) this.setState(c && c.held.down ? 'block' : 'idle');
          break;
        case 'knockdown':
          if (this.onGround && this.st > 0.05) {
            if (this.bounceReady) {
              this.bounceReady = false;
              this.onGround = false;
              this.vy = -520;
              this.y = C.GROUND_Y - 1;
              VF.FX.dust(world.ps, this.x, this.y, 14);
              VF.FX.ring(world.ps, this.x, this.y - 10, '#ffffff', 30, 0.3);
              VF.Audio.play('land');
              world.shake(8, 0.2);
            } else {
              this.setState('down');
              this.vx *= 0.3;
              this.juggle = 0;
            }
          }
          break;
        case 'down':
          this.friction(dt * 2);
          if (this.hp > 0 && this.st > 0.7 && !this.stayDown) {
            this.setState('getup');
            this.invuln = 0.5;
          }
          break;
        case 'getup':
          this.vx = 0;
          if (this.st >= 0.35) this.setState('idle');
          break;
        default:
          this.friction(dt);
      }
      if (this.state !== 'ultimate' && !this.held) this.physics(dt, world);
    }

    /* traduz botão + direção no nome do golpe */
    resolveAttack(c, air) {
      let btn = null;
      for (const b of ['heavy', 'kick', 'punch']) if (c.pressed(b)) { btn = b; break; }
      if (!btn) return null;
      c.consume(btn);
      if (air || !this.onGround) return btn === 'heavy' ? 'airHeavy' : btn === 'punch' ? 'air2' : 'air';
      const dir = c.dirX();
      if (c.held.down) return btn === 'heavy' ? 'sweep' : 'low';
      if (dir === -this.facing) return 'back';
      if (dir === this.facing && btn === 'heavy') return 'forward';
      return btn === 'punch' ? 'light' : btn === 'kick' ? 'medium' : 'heavy';
    }

    neutral(dt, c, opp, world) {
      if (!c) {
        this.friction(dt);
        if (this.state !== 'idle') this.setState('idle');
        return;
      }
      if (c.pressed('ultimate') && this.ultimateReady) { c.consume('ultimate'); this.startUltimate(opp, world); return; }
      if (c.pressed('special') && this.specialReady) { c.consume('special'); this.startSpecial(opp, world); return; }
      if (c.pressed('grab')) { c.consume('grab'); this.startAttack('grab', world); return; }
      const n = this.resolveAttack(c);
      if (n) { this.startAttack(n, world); return; }
      if (c.pressed('up')) { c.consume('up'); this.jump(c.dirX(), world); return; }
      if (c.dash) { this.startDash(c.dash, world); return; }
      if (c.held.down) {
        if (this.state !== 'block') this.setState('block');
        this.friction(dt * 2);
        return;
      }
      if (this.state === 'block') this.setState('idle');
      const dir = c.dirX();
      const sp = this.speedMul;
      if (this.state === 'run') {
        if (dir === this.facing) {
          this.vx = dir * this.def.walk * this.def.runMult * sp;
          if (Math.random() < dt * 10) VF.FX.dust(world.ps, this.x - this.facing * 20, this.y, 1, -this.facing);
          return;
        }
        this.setState('idle');
      }
      if (dir) {
        this.vx = dir * this.def.walk * (dir === this.facing ? 1 : 0.78) * sp;
        if (this.state !== 'walk') this.setState('walk');
      } else {
        this.vx = 0;
        if (this.state !== 'idle') this.setState('idle');
      }
    }

    jump(dir, world, superJump) {
      this.vy = -this.def.jump * (superJump ? 1.12 : 1);
      this.vx = superJump ? this.facing * 330 : dir * this.def.walk * 1.15;
      this.onGround = false;
      this.airUsed = false;
      this.airChain = 0;
      this.setState('jump');
      VF.Audio.play('jump');
      VF.FX.dust(world.ps, this.x, this.y, 5);
    }

    air(dt, c, world) {
      if (!c) return;
      if (this.airChain < 3) {
        const n = this.resolveAttack(c, true);
        if (n) { this.startAttack(n, world); return; }
      }
      const d = c.dirX();
      if (d) this.vx = M.approach(this.vx, d * this.def.walk * 1.15, 900 * dt);
    }

    startDash(dir, world) {
      this.dashDir = dir;
      this.setState('dash');
      VF.Audio.play('dash');
      VF.FX.dust(world.ps, this.x, this.y, 6, -dir);
      if (dir === this.facing) VF.FX.speedLines(world.ps, this.x, this.y - 110, -dir, this.def.color);
    }

    startAttack(name, world, keepChain) {
      const d = this.def.attacks[name];
      if (!d) return false;
      const chained = this.state === 'attack' && this.attack;
      const chain = chained ? this.attack.chain + 1 : keepChain ? 1 : 0;
      this.chainUse[name] = (this.chainUse[name] || 0) + 1;
      const rep = chained && this.attack.name === name ? (this.attack.rep || 0) + 1 : 0;
      this.attack = { name, d, t: 0, done: [], hasHit: false, contact: false, chain, rep };
      if (d.air) this.airChain++;
      this.setState('attack');
      this.gainSpecial(C.SPECIAL_GAIN.onAttack);
      VF.Audio.play('whoosh', { vol: name === 'heavy' || name === 'forward' ? 1.5 : 1 });
      if (d.dive) { this.vx = this.facing * d.dive.vx; this.vy = d.dive.vy; }
      if (name === 'airHeavy') this.vy = Math.max(this.vy, 250);
      return true;
    }

    canChainTo(name) {
      const a = this.attack;
      if (!a) return false;
      if (ALWAYS_CANCEL.includes(name)) return true;
      if (!(a.d.next || []).includes(name)) return false;
      const limit = name === 'light' ? this.def.attacks._repeat : 2;
      return (this.chainUse[name] || 0) < limit;
    }

    updateAttack(dt, c, opp, world) {
      const a = this.attack;
      if (!a) { this.setState('idle'); return; }
      a.t += dt * this.speedMul;
      const d = a.d;
      if (d.move && a.t >= d.move.s && a.t <= d.move.e) this.vx = this.facing * d.move.v * this.speedMul;
      else if (this.onGround) this.friction(dt * 1.5);

      for (let i = 0; i < d.hits.length; i++) {
        const h = d.hits[i];
        if (a.done[i] || a.t < h.s || a.t > h.e) continue;
        const box = this.hitboxWorld(h.box);
        if (opp.canBeHit() && M.overlap(box, opp.hurtbox)) {
          if (h.grab && (!opp.onGround || opp.state === 'blockstun' && false)) continue;
          a.done[i] = true;
          VF.Combat.hit(world, this, opp, h, box, this.facing);
          if (this.attack !== a) return;
        }
      }

      // cancelamentos (rotas de combo)
      if (c && a.contact && a.t >= (d.cancel || d.dur)) {
        if (c.pressed('ultimate') && this.ultimateReady && this.onGround) { c.consume('ultimate'); this.startUltimate(opp, world); return; }
        if (c.pressed('special') && this.specialReady && this.onGround) { c.consume('special'); this.startSpecial(opp, world); return; }
        if (d.jumpCancel && a.hasHit && c.pressed('up')) {
          c.consume('up');
          this.attack = null;
          this.jump(this.facing, world, true);
          return;
        }
        if (d.dashCancel && c.dash === this.facing) { this.attack = null; this.startDash(this.facing, world); return; }
        const peek = this.peekAttack(c, !this.onGround);
        if (peek && this.canChainTo(peek)) {
          if (peek === 'grab') c.consume('grab');
          else this.resolveAttack(c, !this.onGround);
          this.startAttack(peek, world);
          return;
        }
      }

      if (a.t >= d.dur) {
        this.attack = null;
        if (this.onGround) this.setState('idle');
        else this.setState('jump');
      }
    }

    peekAttack(c, air) {
      // igual a resolveAttack mas sem consumir o botão
      let btn = null;
      for (const b of ['heavy', 'kick', 'punch']) if (c.pressed(b)) { btn = b; break; }
      if (!btn) return c.pressed('grab') && !air ? 'grab' : null;
      if (air) return btn === 'heavy' ? 'airHeavy' : btn === 'punch' ? 'air2' : 'air';
      const dir = c.dirX();
      if (c.held.down) return btn === 'heavy' ? 'sweep' : 'low';
      if (dir === -this.facing) return 'back';
      if (dir === this.facing && btn === 'heavy') return 'forward';
      return btn === 'punch' ? 'light' : btn === 'kick' ? 'medium' : 'heavy';
    }

    startSpecial(opp, world) {
      this.special = 0;
      this.stats.specials++;
      this.attack = null;
      this.vx = 0;
      this.setState('special');
      this.sp = VF.Specials.create(this, opp, world);
      world.superFlash(this, 'special');
    }

    startUltimate(opp, world) {
      this.ultimate = 0;
      this.stats.ultimates++;
      this.attack = null;
      this.vx = 0;
      this.setState('ultimate');
      world.startUltimate(this, opp);
    }

    friction(dt) {
      if (this.onGround) this.vx = M.approach(this.vx, 0, 2600 * dt);
    }

    physics(dt, world) {
      if (!this.onGround) this.vy += C.GRAVITY * dt * (this.state === 'knockdown' ? 1.05 : 1);
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      if (this.y >= C.GROUND_Y) {
        this.y = C.GROUND_Y;
        if (!this.onGround) {
          this.onGround = true;
          this.vy = 0;
          this.landed(world);
        }
      }
      // quique na parede
      if ((this.x <= C.STAGE_LEFT || this.x >= C.STAGE_RIGHT) && this.state === 'knockdown' && this.wallReady && Math.abs(this.vx) > 350) {
        this.wallReady = false;
        this.vx = -this.vx * 0.45;
        this.vy = Math.min(this.vy, -380);
        VF.FX.ring(world.ps, this.x, this.y - 120, '#ffffff', 40, 0.35);
        VF.FX.dust(world.ps, this.x, this.y - 120, 10);
        VF.Audio.play('heavy');
        world.shake(9, 0.2);
        world.flashScreen('#ffffff', 0.12);
      }
      this.x = M.clamp(this.x, C.STAGE_LEFT, C.STAGE_RIGHT);
    }

    landed(world) {
      if (this.state === 'jump') {
        this.vx = 0;
        this.setState('land');
        VF.Audio.play('land');
        VF.FX.dust(world.ps, this.x, this.y, 4);
      } else if (this.state === 'attack' && this.attack && this.attack.d.air) {
        const slam = this.attack.name === 'airHeavy';
        this.attack = null;
        this.vx = 0;
        this.setState('land');
        VF.FX.dust(world.ps, this.x, this.y, slam ? 14 : 6);
        if (slam) { world.shake(5, 0.15); VF.FX.ring(world.ps, this.x, this.y - 5, '#ffffff', 30, 0.3); }
      } else if (this.state === 'knockdown') {
        VF.FX.dust(world.ps, this.x, this.y, 12);
        VF.Audio.play('land');
        world.shake(4, 0.15);
      }
    }

    /* Recebe um golpe. dir = sentido em que o golpe viaja (+1 direita). */
    receiveHit(hit, att, dir, scale) {
      const fromFront = dir === -this.facing;
      const blocking = (this.state === 'block' || this.state === 'blockstun') && this.onGround && fromFront && !hit.unblockable;
      const pw = att ? att.powerMul : 1;
      if (blocking) {
        const chip = Math.max(1, Math.round((hit.dmg * pw * C.BLOCK_CHIP) / this.def.defense));
        this.hp = Math.max(1, this.hp - chip);
        this.hpLagT = 0.35;
        this.setState('blockstun');
        this.stun = Math.max(0.12, hit.stun * 0.55);
        this.vx = dir * (hit.kb * 0.6 + 90);
        this.gainSpecial(hit.dmg * C.SPECIAL_GAIN.onBlockPerDmg);
        this.stats.blocks++;
        return { type: 'block', dmg: chip };
      }
      const vuln = this.state === 'dazed' ? 1.3 : 1;
      let dmg = Math.max(1, Math.round((hit.dmg * pw / this.def.defense) * (scale || 1) * vuln));
      this.hp = Math.max(0, this.hp - dmg);
      this.hpLagT = 0.45;
      this.flash = 0.12;
      this.attack = null;
      if (this.sp) { this.sp = null; this.wigOff = false; }
      this.alpha = 1;
      this.combo = 0;
      this.chainUse = {};
      const ko = this.hp <= 0;
      const airborne = !this.onGround || this.state === 'knockdown';
      if (hit.hold) {
        // golpes de ULTIMATE / prisão: segura no lugar
        this.setState('bound');
        this.stun = hit.stun;
      } else if (ko || hit.knockdown || hit.launch || airborne) {
        if (airborne) this.juggle++;
        this.setState('knockdown');
        this.onGround = false;
        this.y = Math.min(this.y, C.GROUND_Y - 1);
        let vy = hit.kbY || (ko ? -820 : -560);
        if (this.juggle > C.MAX_JUGGLE && vy < 0) vy = 200; // limite de juggle: cai
        this.vy = vy;
        this.vx = dir * Math.max(hit.kb || 0, hit.launch ? 40 : 260) * (ko ? 1.3 : 1);
        if (airborne && !hit.knockdown && !hit.slam) this.vx = dir * Math.min(Math.abs(this.vx), 180);
        this.facing = -dir;
        this.bounceReady = !!hit.slam;
        this.wallReady = !!hit.wallbounce;
      } else {
        this.setState('hurt');
        this.stun = hit.stun;
        this.vx = dir * hit.kb;
      }
      this.gainSpecial(dmg * C.SPECIAL_GAIN.onHurtPerDmg);
      this.gainUltimate(dmg * C.ULTIMATE_GAIN.onHurtPerDmg);
      return { type: 'hit', dmg, ko };
    }

    /* efeitos de status aplicados por especiais */
    applyStatus(kind, dur, world) {
      if (kind === 'bind') { this.attack = null; this.sp = null; this.setState('bound'); this.stun = dur; this.vx = 0; }
      else if (kind === 'daze') { this.attack = null; this.sp = null; this.setState('dazed'); this.stun = dur; }
      else if (kind === 'slow') this.status.slow = dur;
      else if (kind === 'buff') this.status.buff = dur;
    }

    recordAfterimage(dt) {
      for (const a of this.afterimages) a.life -= dt * 4;
      this.afterimages = this.afterimages.filter((a) => a.life > 0);
      const fast = this.state === 'dash' || this.state === 'run' || this.state === 'ultimate' ||
        (this.state === 'special' && Math.abs(this.vx) > 300) || (this.state === 'special' && this.def.special.type === 'blink') ||
        (this.state === 'attack' && (this.def.stats.speed >= 9 || (this.attack && this.attack.d.move && Math.abs(this.vx) > 300)));
      this.aiT -= dt;
      if (fast && this.aiT <= 0 && VF.Quality.afterimages) {
        this.aiT = 0.04;
        this.afterimages.push({ x: this.x, y: this.y, facing: this.facing, pose: VF.Poses.forFighter(this), life: 1 });
        if (this.afterimages.length > 5) this.afterimages.shift();
      }
    }

    // ---------------------------------------------------------------
    drawBody(ctx, pose, opt) {
      if (this.def.partnerSkin) {
        // LUTU: o parceiro(a) aparece atrás, sincronizado
        const pSkin = this.swap ? this.skin : this.def.partnerSkin;
        const mSkin = this.swap ? this.def.partnerSkin : this.skin;
        const pCol = this.swap ? this.colors : this.partnerColors;
        const mCol = this.swap ? this.partnerColors : this.colors;
        const pPose = this.state === 'attack' || this.state === 'special' || this.state === 'ultimate' ? pose : VF.Poses.forFighter(Object.assign({}, this, { anim: this.anim + 0.5 }));
        VF.Rig.draw(ctx, pSkin, pPose, Object.assign({}, opt, { x: opt.x - opt.facing * 46, colors: pCol, scale: 0.94 }));
        VF.Rig.draw(ctx, mSkin, pose, Object.assign({}, opt, { colors: mCol }));
      } else {
        VF.Rig.draw(ctx, this.skin, pose, opt);
      }
    }

    render(ctx) {
      const pose = VF.Poses.forFighter(this);
      const expr = VF.Poses.exprFor(this);
      for (const a of this.afterimages) {
        ctx.save();
        ctx.globalAlpha = a.life * 0.28;
        VF.Rig.draw(ctx, this.skin, a.pose, { x: a.x, y: a.y, facing: a.facing, colors: this.colors, fighter: this, expr, t: this.anim });
        ctx.restore();
      }
      if (this.alpha <= 0.02) return;
      // aura de status
      if (this.status.buff > 0) VF.BG.glow(ctx, this.x, this.y - 110, 150, '#ff3d00', 0.3 + Math.sin(this.anim * 12) * 0.1);
      if (this.status.slow > 0) VF.BG.glow(ctx, this.x, this.y - 110, 140, '#80d8ff', 0.25);
      if (this.specialReady || this.ultimateReady) {
        if (Math.random() < 0.3) this.readyFx = true;
        VF.BG.glow(ctx, this.x, this.y - 100, 120, this.ultimateReady ? '#ffd600' : this.def.color, 0.12 + Math.sin(this.anim * 8) * 0.05);
      }
      const opt = { x: this.x, y: this.y, facing: this.facing, colors: this.colors, fighter: this, expr, t: this.anim, alpha: this.alpha };
      this.drawBody(ctx, pose, opt);
      if (this.flash > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = Math.min(1, this.flash / 0.12) * 0.7;
        this.drawBody(ctx, pose, opt);
        ctx.restore();
      }
      if ((this.state === 'down' && this.hp <= 0) || this.state === 'dazed') {
        const hx = this.state === 'dazed' ? this.x : this.x - this.facing * 95;
        const hy = this.state === 'dazed' ? this.y - 245 : this.y - 45;
        for (let i = 0; i < 3; i++) {
          const a = this.anim * 4 + (i * Math.PI * 2) / 3;
          ctx.save();
          ctx.translate(hx + Math.cos(a) * 30, hy + Math.sin(a) * 9 - 20);
          ctx.rotate(a);
          ctx.fillStyle = this.state === 'dazed' ? '#ff80ab' : '#ffe25a';
          VF.drawStar(ctx, 8);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    renderShadow(ctx) {
      const h = C.GROUND_Y - this.y;
      const k = Math.max(0.35, 1 - h / 400);
      const w = this.state === 'down' ? 120 : this.def.partnerSkin ? 90 : 58;
      const cx = this.state === 'down' ? this.x - this.facing * 6 : this.x - (this.def.partnerSkin ? this.facing * 22 : 0);
      ctx.fillStyle = `rgba(0,0,0,${0.35 * k})`;
      ctx.beginPath();
      ctx.ellipse(cx, C.GROUND_Y + 3, w * k, 11 * k, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  VF.Fighter = Fighter;
})();
