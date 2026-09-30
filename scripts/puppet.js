/* "Boneco" de demonstração: reproduz animações de um lutador fora da luta
   (galeria de personagens, painel da seleção, tela de vitória, menu). */
(function () {
  class Puppet {
    constructor(id, colors) {
      this.def = VF.getCharacter(id);
      this.skin = this.def.skin;
      this.colors = colors || this.skin.colors;
      this.partnerColors = this.def.partnerSkin ? this.def.partnerSkin.colors : null;
      this.facing = 1;
      this.hp = VF.CONFIG.MAX_HP;
      this.vx = 0; this.vy = 0; this.jy = 0;
      this.anim = Math.random() * 3;
      this.status = {};
      this.loop = null;
      this.loopIdx = -1;
      this.play('idle');
    }

    play(name) {
      this.st = 0; this.jy = 0; this.vy = 0;
      this.attack = null; this.sp = null; this.ult = null; this.spT = 0;
      this.cur = name;
      this.wigOff = false;
      const d = this.def;
      if (d.attacks[name]) {
        const at = d.attacks[name];
        this.attack = { name, d: at, t: 0, done: [], hasHit: true, contact: true, rep: 0 };
        this.state = 'attack';
        this.dur = at.dur + 0.3;
        this.moveName = d.moveNames[name] || name;
        if (at.air) this.jy = -140;
        return this.dur;
      }
      switch (name) {
        case 'special':
          this.state = 'special';
          this.dur = (VF.SpecialTypes[d.special.type] || {}).dur + 0.25 || 1.2;
          this.moveName = 'ESPECIAL: ' + d.special.name;
          if (d.special.type === 'wig_boomerang') this.wigOff = true;
          break;
        case 'ultimate': this.state = 'ultimate'; this.dur = 1.6; this.moveName = 'ULTIMATE: ' + d.ultimate.name; break;
        case 'jump': this.state = 'jump'; this.dur = 0.75; this.moveName = 'Pulo'; break;
        case 'walk': this.state = 'walk'; this.dur = 1.2; this.moveName = 'Andar'; break;
        case 'run': this.state = 'run'; this.dur = 1.0; this.moveName = 'Correr'; break;
        case 'dash': this.state = 'dash'; this.dur = 0.4; this.moveName = 'Dash (toque duplo)'; this.dashDir = 1; break;
        case 'block': this.state = 'block'; this.dur = 0.9; this.moveName = 'Defesa'; break;
        case 'hurt': this.state = 'hurt'; this.dur = 0.6; this.moveName = 'Dano'; break;
        case 'victory': this.state = 'victory'; this.dur = 2.0; this.moveName = 'Vitória'; break;
        case 'defeat': this.state = 'defeat'; this.dur = 1.5; this.moveName = 'Derrota'; break;
        default: this.state = 'idle'; this.dur = 1.3; this.moveName = 'Parado';
      }
      return this.dur;
    }

    setLoop(list) { this.loop = list; this.loopIdx = -1; this.next(); }
    next() { this.loopIdx = (this.loopIdx + 1) % this.loop.length; this.play(this.loop[this.loopIdx]); }

    update(dt) {
      this.st += dt;
      this.anim += dt;
      if (this.attack) this.attack.t = Math.min(this.attack.t + dt, this.attack.d.dur);
      if (this.state === 'special' || this.state === 'ultimate') this.spT = Math.min(1, this.st / (this.dur - 0.25));
      if (this.state === 'jump') {
        const T = 0.75, v0 = 1000, g = (2 * v0) / T, t = Math.min(this.st, T);
        this.vy = -v0 + g * t;
        this.jy = Math.min(0, -v0 * t + 0.5 * g * t * t);
      }
      if (this.st >= this.dur) {
        if (this.loop) this.next();
        else if (this.state !== 'idle' && this.state !== 'victory') this.play('idle');
      }
    }

    draw(ctx, x, y, scale, facing) {
      this.facing = facing || 1;
      const pose = VF.Poses.forFighter(this);
      const opt = { x, y: y + this.jy * scale, facing: this.facing, scale, colors: this.colors, fighter: this, expr: VF.Poses.exprFor(this), t: this.anim };
      if (this.def.partnerSkin) {
        VF.Rig.draw(ctx, this.def.partnerSkin, pose, Object.assign({}, opt, { x: x - this.facing * 46 * scale, colors: this.partnerColors, scale: scale * 0.94 }));
      }
      VF.Rig.draw(ctx, this.skin, pose, opt);
    }
  }

  VF.Puppet = Puppet;
})();
