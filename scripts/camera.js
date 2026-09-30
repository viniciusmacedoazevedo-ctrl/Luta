/* CÂMERA DINÂMICA
   - acompanha o meio da luta e aproxima quando os lutadores estão perto;
   - "punch": zoom rápido no ponto de um golpe forte;
   - "nudge": pequenos empurrões durante combos;
   - "focus": câmera cinematográfica (ULTIMATE) travada em um ponto. */
(function () {
  const C = VF.CONFIG, M = VF.M;

  class Camera {
    constructor() {
      this.x = 640; this.y = 360; this.zoom = 1;
      this.nx = 0; this.punch = null; this.focus = null;
      this.shakeAmt = 0; this.shakeT = 0;
      this.ox = 0; this.oy = 0;
    }

    reset() {
      this.x = 640; this.y = 360; this.zoom = 1; this.nx = 0;
      this.punch = null; this.focus = null; this.shakeAmt = 0; this.shakeT = 0;
    }

    shake(a, d) {
      if (!VF.Settings.data.shake) return;
      this.shakeAmt = Math.max(this.shakeAmt, a);
      this.shakeT = Math.max(this.shakeT, d);
    }

    update(dt, fighters) {
      const [a, b] = fighters;
      let tx = (a.x + b.x) / 2;
      const dist = Math.abs(a.x - b.x);
      let tz = M.clamp(1.2 - dist / 1400, 1.0, 1.14);
      let ty = Math.min(a.y, b.y) - 170;
      let speed = 4;
      if (this.punch) {
        this.punch.t -= dt;
        const k = Math.max(0, this.punch.t / this.punch.dur);
        tz += (this.punch.zoom - 1) * k;
        tx = M.lerp(tx, this.punch.x, 0.5 * k);
        ty = M.lerp(ty, this.punch.y, 0.4 * k);
        speed = 14;
        if (this.punch.t <= 0) this.punch = null;
      }
      if (this.focus) {
        tx = this.focus.x; ty = this.focus.y; tz = this.focus.zoom;
        speed = this.focus.speed || 6;
      }
      this.nx = M.approach(this.nx, 0, 60 * dt);
      const k = 1 - Math.exp(-speed * dt);
      this.zoom += (tz - this.zoom) * k;
      this.x += (tx + this.nx - this.x) * k;
      this.y += (ty - this.y) * k;
      // limites: a visão nunca sai do cenário
      const hw = C.WIDTH / 2 / this.zoom, hh = C.HEIGHT / 2 / this.zoom;
      this.x = M.clamp(this.x, hw, C.WIDTH - hw);
      this.y = M.clamp(this.y, hh, C.HEIGHT - hh);
      if (this.shakeT > 0) {
        this.shakeT -= dt;
        const s = this.shakeAmt;
        this.ox = (Math.random() - 0.5) * s * 2;
        this.oy = (Math.random() - 0.5) * s * 2;
        if (this.shakeT <= 0) { this.shakeAmt = 0; this.ox = this.oy = 0; }
      } else { this.ox = this.oy = 0; }
    }

    /* aplica a transformação do mundo; parallax < 1 para o fundo */
    apply(ctx, parallax) {
      const p = parallax == null ? 1 : parallax;
      const z = 1 + (this.zoom - 1) * p;
      const cx = 640 + (this.x - 640) * p, cy = 360 + (this.y - 360) * p;
      ctx.translate(640 + this.ox, 360 + this.oy);
      ctx.scale(z, z);
      ctx.translate(-cx, -cy);
    }
  }

  VF.Camera = Camera;
})();
