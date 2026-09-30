/* Lutador: máquina de estados, física, ataques, defesa e renderização */
(function () {
  const C = VF.CONFIG, M = VF.M;
  const NEUTRAL = ['idle', 'walk', 'run', 'block'];

  class Fighter {
    constructor(def, side, ctrl, opts) {
      opts = opts || {};
      this.def = def;
      this.skin = VF.Skins[def.id];
      this.side = side;
      this.ctrl = ctrl;
      this.colors = opts.alt ? Object.assign({}, this.skin.colors, this.skin.alt) : this.skin.colors;
      this.label = opts.label || (side ? 'P2' : 'P1');
      this.isCPU = !!opts.cpu;
      this.special = 0;
      this.stats = { damage: 0, hits: 0, maxCombo: 0, specials: 0, blocks: 0, roundsWon: 0 };
      this.reset(side ? C.P2_START : C.P1_START, side ? -1 : 1);
    }

    reset(x, facing) {
      Object.assign(this, {
        x, y: C.GROUND_Y, vx: 0, vy: 0, facing, hp: C.MAX_HP, dispHp: C.MAX_HP, hpLagT: 0,
        state: 'idle', st: 0, anim: Math.random() * 3, attack: null, sp: null, stun: 0, invuln: 0,
        onGround: true, combo: 0, comboShow: 0, comboPop: 0, lastHitAt: -9, airUsed: false, flash: 0,
        afterimages: [], aiT: 0, control: false, alpha: 1, dashDir: 0, stayDown: false, introSash: false
      });
      this.round = { damage: 0, maxCombo: 0, hits: 0 };
      if (this.ctrl) this.ctrl.reset();
    }

    setState(s) { this.state = s; this.st = 0; }

    get hurtbox() {
      const h = C.HURTBOX;
      if (this.state === 'down') return { x: this.x - 100, y: this.y - 40, w: 200, h: 40 };
      const crouch = this.state === 'block' || this.state === 'blockstun' ? 12 : 0;
      return { x: this.x + h.x, y: this.y + h.y + crouch, w: h.w, h: h.h - crouch };
    }

    hitboxWorld(box) {
      const [bx, by, bw, bh] = box;
      return { x: this.facing > 0 ? this.x + bx : this.x - bx - bw, y: this.y + by, w: bw, h: bh };
    }

    gainSpecial(v) {
      if (this.state === 'special') return;
      this.special = M.clamp(this.special + v, 0, C.SPECIAL_MAX);
    }

    get specialReady() { return this.special >= C.SPECIAL_MAX; }

    canBeHit() {
      return this.invuln <= 0 && this.state !== 'down' && this.state !== 'getup' &&
        !(this.sp && this.sp.armor > 0) && this.alpha > 0.3;
    }

    // ---------------------------------------------------------------
    update(dt, opp, world) {
      this.st += dt;
      this.anim += dt;
      if (this.invuln > 0) this.invuln -= dt;
      if (this.flash > 0) this.flash -= dt;
      if (this.comboShow > 0) this.comboShow -= dt;
      if (this.comboPop > 0) this.comboPop -= dt * 4;
      // barra de vida "atrasada" (efeito de dano)
      if (this.dispHp > this.hp) {
        this.hpLagT -= dt;
        if (this.hpLagT <= 0) this.dispHp = Math.max(this.hp, this.dispHp - 700 * dt);
      } else {
        this.dispHp = this.hp;
      }
      this.recordAfterimage(dt);

      const c = this.control ? this.ctrl : null;

      // virar para o oponente
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

      switch (this.state) {
        case 'idle':
        case 'walk':
        case 'run':
        case 'block':
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
          this.vx = this.dashDir * this.def.dashSpeed;
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
            if (this.sp && this.sp.done) {
              this.sp = null;
              this.setState(this.onGround ? 'idle' : 'jump');
            }
          } else {
            this.setState('idle');
          }
          break;
        case 'hurt':
          this.stun -= dt;
          this.friction(dt);
          if (this.stun <= 0) this.setState('idle');
          break;
        case 'blockstun':
          this.stun -= dt;
          this.friction(dt);
          if (this.stun <= 0) this.setState(c && c.held.down ? 'block' : 'idle');
          break;
        case 'knockdown':
          if (this.onGround && this.st > 0.05) {
            this.setState('down');
            this.vx *= 0.3;
          }
          break;
        case 'down':
          this.friction(dt * 2);
          if (this.hp > 0 && this.st > 0.75 && !this.stayDown) {
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
      this.physics(dt, world);
    }

    neutral(dt, c, opp, world) {
      if (!c) {
        this.friction(dt);
        if (this.state !== 'idle') this.setState('idle');
        return;
      }
      if (c.pressed('special') && this.specialReady) {
        c.consume('special');
        this.startSpecial(opp, world);
        return;
      }
      for (const a of ['heavy', 'kick', 'punch']) {
        if (c.pressed(a)) {
          c.consume(a);
          this.startAttack(a);
          return;
        }
      }
      if (c.pressed('up')) {
        c.consume('up');
        this.jump(c.dirX(), world);
        return;
      }
      if (c.dash) {
        this.startDash(c.dash, world);
        return;
      }
      if (c.held.down) {
        if (this.state !== 'block') this.setState('block');
        this.friction(dt * 2);
        return;
      }
      const dir = c.dirX();
      if (this.state === 'run') {
        if (dir === this.facing) {
          this.vx = dir * this.def.walk * this.def.runMult;
          if (Math.random() < dt * 10) VF.FX.dust(world.ps, this.x - this.facing * 20, this.y, 1, -this.facing);
          return;
        }
        this.setState('idle');
      }
      if (dir) {
        this.vx = dir * this.def.walk * (dir === this.facing ? 1 : 0.78);
        if (this.state !== 'walk') this.setState('walk');
      } else {
        this.vx = 0;
        if (this.state !== 'idle') this.setState('idle');
      }
    }

    jump(dir, world) {
      this.vy = -this.def.jump;
      this.vx = dir * this.def.walk * 1.15;
      this.onGround = false;
      this.airUsed = false;
      this.setState('jump');
      VF.Audio.play('jump');
      VF.FX.dust(world.ps, this.x, this.y, 5);
    }

    air(dt, c) {
      if (!c) return;
      if (!this.airUsed) {
        for (const a of ['punch', 'kick', 'heavy']) {
          if (c.pressed(a)) {
            c.consume(a);
            this.airUsed = true;
            this.startAttack('air');
            return;
          }
        }
      }
      const d = c.dirX();
      if (d) this.vx = M.approach(this.vx, d * this.def.walk * 1.15, 900 * dt);
    }

    startDash(dir, world) {
      this.dashDir = dir;
      this.setState('dash');
      VF.Audio.play('dash');
      VF.FX.dust(world.ps, this.x, this.y, 6, -dir);
    }

    startAttack(name) {
      const d = this.def.attacks[name];
      if (!d) return;
      const chain = this.state === 'attack' && this.attack ? this.attack.chain + 1 : 0;
      this.attack = { name, d, t: 0, done: [], hasHit: false, contact: false, chain };
      this.setState('attack');
      this.gainSpecial(C.SPECIAL_GAIN.onAttack);
      VF.Audio.play('whoosh', { vol: name === 'heavy' ? 1.5 : 1 });
      if (d.dive) {
        this.vx = this.facing * d.dive.vx;
        this.vy = d.dive.vy;
      }
    }

    updateAttack(dt, c, opp, world) {
      const a = this.attack;
      if (!a) { this.setState('idle'); return; }
      a.t += dt;
      const d = a.d;
      if (d.move && a.t >= d.move.s && a.t <= d.move.e) this.vx = this.facing * d.move.v;
      else if (this.onGround) this.friction(dt * 1.5);

      for (let i = 0; i < d.hits.length; i++) {
        const h = d.hits[i];
        if (a.done[i] || a.t < h.s || a.t > h.e) continue;
        const box = this.hitboxWorld(h.box);
        if (opp.canBeHit() && M.overlap(box, opp.hurtbox)) {
          a.done[i] = true;
          VF.Combat.hit(world, this, opp, h, box, this.facing);
          if (this.attack !== a) return; // golpe interrompido
        }
      }

      // cancelar em outro golpe (combo)
      const maxChain = this.def.id === 'arthur' ? 6 : 4;
      if (c && a.contact && d.cancel && a.t >= d.cancel && a.chain < maxChain && !d.air) {
        if (c.pressed('special') && this.specialReady) {
          c.consume('special');
          this.startSpecial(opp, world);
          return;
        }
        for (const n of ['heavy', 'kick', 'punch']) {
          if (c.pressed(n)) {
            c.consume(n);
            this.startAttack(n);
            return;
          }
        }
      }

      if (a.t >= d.dur) {
        this.attack = null;
        if (this.onGround) this.setState('idle');
        else { this.setState('jump'); this.airUsed = true; }
      }
    }

    startSpecial(opp, world) {
      this.special = 0;
      this.stats.specials++;
      this.attack = null;
      this.vx = 0;
      this.setState('special');
      this.sp = VF.Specials.create(this, opp, world);
      world.superFlash(this);
    }

    friction(dt) {
      if (this.onGround) this.vx = M.approach(this.vx, 0, 2600 * dt);
    }

    physics(dt, world) {
      if (!this.onGround) this.vy += C.GRAVITY * dt * (this.state === 'knockdown' ? 1.1 : 1);
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
      this.x = M.clamp(this.x, C.STAGE_LEFT, C.STAGE_RIGHT);
    }

    landed(world) {
      if (this.state === 'jump') {
        this.vx = 0;
        this.setState('land');
        VF.Audio.play('land');
        VF.FX.dust(world.ps, this.x, this.y, 4);
      } else if (this.state === 'attack' && this.attack && this.attack.d.air) {
        this.attack = null;
        this.vx = 0;
        this.setState('land');
        VF.FX.dust(world.ps, this.x, this.y, 6);
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
      const pw = att ? att.def.power : 1;
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
      const dmg = Math.max(1, Math.round((hit.dmg * pw / this.def.defense) * (scale || 1)));
      this.hp = Math.max(0, this.hp - dmg);
      this.hpLagT = 0.45;
      this.flash = 0.12;
      this.attack = null;
      this.sp = null;
      this.alpha = 1;
      this.combo = 0;
      const ko = this.hp <= 0;
      if (ko || hit.knockdown || !this.onGround) {
        this.setState('knockdown');
        this.onGround = false;
        this.y = Math.min(this.y, C.GROUND_Y - 1);
        this.vy = hit.kbY || (ko ? -820 : -560);
        this.vx = dir * Math.max(hit.kb || 0, 260) * (ko ? 1.3 : 1);
        this.facing = -dir;
      } else {
        this.setState('hurt');
        this.stun = hit.stun;
        this.vx = dir * hit.kb;
      }
      this.gainSpecial(dmg * C.SPECIAL_GAIN.onHurtPerDmg);
      return { type: 'hit', dmg, ko };
    }

    recordAfterimage(dt) {
      for (const a of this.afterimages) a.life -= dt * 4;
      this.afterimages = this.afterimages.filter((a) => a.life > 0);
      const fast = this.state === 'dash' || this.state === 'run' ||
        (this.state === 'special' && this.def.special.id === 'flash') ||
        (this.state === 'special' && this.def.special.id === 'steal' && Math.abs(this.vx) > 300) ||
        (this.state === 'attack' && this.def.id === 'arthur');
      this.aiT -= dt;
      if (fast && this.aiT <= 0) {
        this.aiT = 0.035;
        this.afterimages.push({ x: this.x, y: this.y, facing: this.facing, pose: VF.Poses.forFighter(this), life: 1 });
        if (this.afterimages.length > 6) this.afterimages.shift();
      }
    }

    // ---------------------------------------------------------------
    render(ctx) {
      const pose = VF.Poses.forFighter(this);
      const expr = VF.Poses.exprFor(this);
      for (const a of this.afterimages) {
        ctx.save();
        ctx.globalAlpha = a.life * 0.3;
        VF.Rig.draw(ctx, this.skin, a.pose, { x: a.x, y: a.y, facing: a.facing, colors: this.colors, fighter: this, expr, t: this.anim });
        ctx.restore();
      }
      if (this.alpha <= 0.02) return;
      const opt = { x: this.x, y: this.y, facing: this.facing, colors: this.colors, fighter: this, expr, t: this.anim, alpha: this.alpha };
      VF.Rig.draw(ctx, this.skin, pose, opt);
      if (this.flash > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = Math.min(1, this.flash / 0.12) * 0.75;
        VF.Rig.draw(ctx, this.skin, pose, opt);
        ctx.restore();
      }
      if (this.state === 'down' && this.hp <= 0) {
        // estrelinhas de tontura
        const hx = this.x - this.facing * 95, hy = this.y - 45;
        for (let i = 0; i < 3; i++) {
          const a = this.anim * 4 + (i * Math.PI * 2) / 3;
          ctx.save();
          ctx.translate(hx + Math.cos(a) * 30, hy + Math.sin(a) * 9 - 20);
          ctx.rotate(a);
          ctx.fillStyle = '#ffe25a';
          VF.drawStar(ctx, 8);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    renderShadow(ctx) {
      const h = C.GROUND_Y - this.y;
      const k = Math.max(0.35, 1 - h / 400);
      const w = this.state === 'down' ? 120 : 58;
      const cx = this.state === 'down' ? this.x - this.facing * 6 : this.x;
      ctx.fillStyle = `rgba(0,0,0,${0.35 * k})`;
      ctx.beginPath();
      ctx.ellipse(cx, C.GROUND_Y + 3, w * k, 11 * k, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  VF.Fighter = Fighter;
})();
