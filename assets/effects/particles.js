/* Sistema de partículas genérico */
(function () {
  class ParticleSystem {
    constructor(max) {
      this.list = [];
      this.max = max || 700;
    }

    spawn(p) {
      const max = Math.min(this.max, (VF.Quality && VF.Quality.maxParticles) || this.max);
      if (this.list.length >= max) this.list.shift();
      p.age = 0;
      p.life = p.life || 0.5;
      p.vx = p.vx || 0;
      p.vy = p.vy || 0;
      p.size = p.size == null ? 4 : p.size;
      p.shape = p.shape || 'circle';
      this.list.push(p);
      return p;
    }

    clear() { this.list.length = 0; }

    update(dt) {
      for (let i = this.list.length - 1; i >= 0; i--) {
        const p = this.list[i];
        p.age += dt;
        if (p.age >= p.life) { this.list.splice(i, 1); continue; }
        if (p.target) {
          // partícula "teleguiada" (ex.: Mão Leve)
          const tx = p.target.x, ty = p.target.y - 150;
          const dx = tx - p.x, dy = ty - p.y;
          const d = Math.hypot(dx, dy) || 1;
          const acc = 5200;
          p.vx += (dx / d) * acc * dt;
          p.vy += (dy / d) * acc * dt;
          p.vx *= Math.pow(0.9, dt * 60);
          p.vy *= Math.pow(0.9, dt * 60);
          if (d < 30) p.age = p.life;
        }
        p.vy += (p.g || 0) * dt;
        if (p.drag) {
          const k = Math.pow(p.drag, dt * 60);
          p.vx *= k;
          p.vy *= k;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.spin) p.rot = (p.rot || 0) + p.spin * dt;
        if (p.floor && p.y > p.floor) { p.y = p.floor; p.vy *= -0.3; p.vx *= 0.7; }
      }
    }

    render(ctx) {
      for (const p of this.list) {
        const k = p.age / p.life;
        const alpha = (p.fade === false ? 1 : 1 - k) * (p.alpha == null ? 1 : p.alpha);
        if (alpha <= 0.01) continue;
        let size = p.size;
        if (p.grow) size *= 1 + k * p.grow;
        if (p.shrink) size *= 1 - k;
        if (size <= 0) continue;
        ctx.save();
        ctx.globalAlpha = alpha;
        if (p.add) ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = p.color || '#fff';
        ctx.strokeStyle = p.color || '#fff';
        switch (p.shape) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'spark': {
            const sp = Math.hypot(p.vx, p.vy) || 1;
            const len = Math.min(60, sp * 0.04) * (1 - k * 0.5) + size;
            ctx.lineWidth = Math.max(1, size * 0.6);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - (p.vx / sp) * len, p.y - (p.vy / sp) * len);
            ctx.stroke();
            break;
          }
          case 'ring':
            ctx.lineWidth = p.width || Math.max(1, 6 * (1 - k));
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case 'star':
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot || 0);
            drawStar(ctx, size);
            ctx.fill();
            break;
          case 'rect':
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot || 0);
            ctx.fillRect(-size, -size * 0.5, size * 2, size);
            break;
          case 'smoke':
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'text':
            ctx.font = `${p.weight || 'bold'} ${Math.round(size)}px ${p.font || "'Bangers', Impact, sans-serif"}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineWidth = Math.max(3, size / 7);
            ctx.strokeStyle = p.stroke || '#15101f';
            ctx.lineJoin = 'round';
            ctx.strokeText(p.text, p.x, p.y);
            ctx.fillText(p.text, p.x, p.y);
            break;
        }
        ctx.restore();
      }
    }
  }

  function drawStar(ctx, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 === 0 ? r : r * 0.45;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
  }

  VF.ParticleSystem = ParticleSystem;
  VF.drawStar = drawStar;
})();
