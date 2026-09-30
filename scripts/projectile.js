/* Projéteis e entidades dos especiais.
   - Projectile: tiro que voa (pode quicar, atravessar, ter gravidade).
   - Entity: objeto com lógica própria (tornado, jaula, drones, peruca...),
     que decide sozinho quando acerta (custom = true). */
(function () {
  class Projectile {
    constructor(o) {
      this.t = 0;
      this.alive = true;
      this.life = 2.5;
      this.w = 60;
      this.h = 60;
      this.vy = 0;
      this.hitCd = 0;
      Object.assign(this, o);
    }

    get box() { return { x: this.x - this.w / 2, y: this.y - this.h / 2, w: this.w, h: this.h }; }

    update(dt, world) {
      this.t += dt;
      if (this.hitCd > 0) this.hitCd -= dt;
      this.x += this.vx * dt;
      if (this.gravity) {
        this.vy += this.gravity * dt;
        this.y += this.vy * dt;
        const floor = VF.CONFIG.GROUND_Y - this.h / 2;
        if (this.y > floor) {
          this.y = floor;
          this.vy = -Math.abs(this.vy) * (this.bounce || 0.6);
          VF.FX.dust(world.ps, this.x, VF.CONFIG.GROUND_Y, 4);
        }
      } else if (this.vy) this.y += this.vy * dt;
      if (this.x < -200 || this.x > VF.CONFIG.WIDTH + 200 || this.t > this.life) this.alive = false;
      if (this.trail !== false && Math.random() < 0.7 * VF.Quality.particles) {
        world.ps.spawn({
          x: this.x - Math.sign(this.vx) * this.w * 0.3, y: this.y + (Math.random() - 0.5) * this.h * 0.6,
          vx: -this.vx * 0.1, vy: (Math.random() - 0.5) * 60, life: 0.35, size: 4 + Math.random() * 5, shrink: true, color: this.color, add: true
        });
      }
    }

    render(ctx) {
      const fx = VF.ProjectileFX[this.type];
      if (fx) fx(ctx, this, this.t);
    }
  }

  class Entity {
    constructor(o) {
      this.t = 0;
      this.alive = true;
      this.custom = true;
      this.life = 3;
      Object.assign(this, o);
    }
    get target() { return this.world.fighters[0] === this.owner ? this.world.fighters[1] : this.world.fighters[0]; }
    update(dt, world) {
      this.world = world;
      this.t += dt;
      if (this.onUpdate) this.onUpdate(this, dt, world);
      if (this.t >= this.life) { this.alive = false; if (this.onEnd) this.onEnd(this, world); }
    }
    /* tenta acertar o alvo com uma caixa em coordenadas do mundo */
    tryHit(box, hit, dir) {
      const tg = this.target;
      if (tg.canBeHit() && VF.M.overlap(box, tg.hurtbox)) {
        VF.Combat.hit(this.world, this.owner, tg, hit, box, dir || Math.sign(tg.x - this.x) || 1, true);
        return true;
      }
      return false;
    }
    render(ctx) { if (this.draw) this.draw(ctx, this); }
  }

  VF.Projectile = Projectile;
  VF.Entity = Entity;
})();
