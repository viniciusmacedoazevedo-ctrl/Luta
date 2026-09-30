/* Projéteis dos poderes especiais */
(function () {
  class Projectile {
    constructor(o) {
      this.t = 0;
      this.alive = true;
      this.life = 2.5;
      this.w = 60;
      this.h = 60;
      Object.assign(this, o);
    }

    get box() {
      return { x: this.x - this.w / 2, y: this.y - this.h / 2, w: this.w, h: this.h };
    }

    update(dt, world) {
      this.t += dt;
      this.x += this.vx * dt;
      if (this.x < -150 || this.x > VF.CONFIG.WIDTH + 150 || this.t > this.life) this.alive = false;
      // rastro
      if (Math.random() < 0.8) {
        world.ps.spawn({
          x: this.x - Math.sign(this.vx) * this.w * 0.3 + (Math.random() - 0.5) * 10,
          y: this.y + (Math.random() - 0.5) * this.h * 0.6,
          vx: -this.vx * 0.1, vy: (Math.random() - 0.5) * 60,
          life: 0.35, size: 4 + Math.random() * 5, shrink: true, color: this.color, add: true
        });
      }
    }

    render(ctx) {
      const fx = VF.ProjectileFX[this.type];
      if (fx) fx(ctx, this, this.t);
    }
  }

  VF.Projectile = Projectile;
})();
