/* Textos grandes animados (ROUND 1, FIGHT!, K.O., etc.) e faixa de poder especial */
(function () {
  const M = VF.M;
  const FONT = "'Bangers', Impact, sans-serif";

  class Announcer {
    constructor() {
      this.items = [];
      this.banner = null;
    }

    show(text, o) {
      o = o || {};
      this.items.push({
        text, t: 0, dur: o.dur || 1.3, size: o.size || 130, y: o.y || 330,
        c1: o.color || '#fff59d', c2: o.color2 || '#ff6d00', sub: o.sub || null, shake: !!o.shake
      });
    }

    clear() { this.items = []; this.banner = null; }

    showBanner(f) {
      this.banner = { f, t: 0, dur: 0.9 };
    }

    update(dt) {
      for (const it of this.items) it.t += dt;
      this.items = this.items.filter((it) => it.t < it.dur);
      if (this.banner) {
        this.banner.t += dt;
        if (this.banner.t > this.banner.dur) this.banner = null;
      }
    }

    draw(ctx) {
      if (this.banner) this.drawBanner(ctx, this.banner);
      for (const it of this.items) {
        const a = Math.min(1, it.t / 0.28);
        const sc = M.easeOutBack(a);
        const out = it.t > it.dur - 0.22 ? (it.dur - it.t) / 0.22 : 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, out);
        let ox = 0, oy = 0;
        if (it.shake && it.t < 0.5) { ox = (Math.random() - 0.5) * 12; oy = (Math.random() - 0.5) * 12; }
        ctx.translate(640 + ox, it.y + oy);
        ctx.scale(sc, sc);
        ctx.rotate(-0.04);
        ctx.font = `${it.size}px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';
        ctx.lineWidth = it.size / 5;
        ctx.strokeStyle = '#120a1c';
        ctx.strokeText(it.text, 6, 8);
        ctx.strokeText(it.text, 0, 0);
        const g = ctx.createLinearGradient(0, -it.size / 2, 0, it.size / 2);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.35, it.c1);
        g.addColorStop(1, it.c2);
        ctx.fillStyle = g;
        ctx.fillText(it.text, 0, 0);
        if (it.sub) {
          ctx.font = `${Math.round(it.size * 0.3)}px ${FONT}`;
          ctx.lineWidth = 6;
          ctx.strokeText(it.sub, 0, it.size * 0.62);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(it.sub, 0, it.size * 0.62);
        }
        ctx.restore();
      }
    }

    drawBanner(ctx, b) {
      const f = b.f;
      const k = b.t / b.dur;
      const slide = k < 0.2 ? M.easeOutCubic(k / 0.2) : k > 0.85 ? 1 - (k - 0.85) / 0.15 : 1;
      const dir = f.side ? -1 : 1;
      ctx.save();
      ctx.globalAlpha = Math.max(0, slide);
      const y = 250, h = 150;
      ctx.translate((1 - slide) * -900 * dir, 0);
      const g = ctx.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, VF.M.hexA(f.def.color, 0.95));
      g.addColorStop(1, 'rgba(18,10,28,0.95)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, y + 20);
      ctx.lineTo(1280, y);
      ctx.lineTo(1280, y + h - 20);
      ctx.lineTo(0, y + h);
      ctx.closePath();
      ctx.fill();
      // listras de velocidade
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 12; i++) {
        const lx = ((i * 157 + b.t * 2400 * dir) % 1500) - 100;
        ctx.beginPath();
        ctx.moveTo(lx, y + 30 + (i % 4) * 28);
        ctx.lineTo(lx + 160 * dir, y + 30 + (i % 4) * 28);
        ctx.stroke();
      }
      const px = f.side ? 1060 : 220;
      VF.Rig.portrait(ctx, f.skin, px, y + 88, 190, { facing: f.side ? -1 : 1, colors: f.colors, expr: 'angry', fighter: f, glow: true });
      ctx.font = `76px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#120a1c';
      ctx.strokeText(f.def.special.name, 640, y + h / 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(f.def.special.name, 640, y + h / 2);
      ctx.restore();
    }
  }

  VF.Announcer = Announcer;
})();
