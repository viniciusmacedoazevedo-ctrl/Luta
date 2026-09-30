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

    clear() { this.items = []; this.banner = null; this.ult = null; }

    showBanner(f) {
      this.banner = { f, t: 0, dur: 0.9 };
    }

    showUltimate(f) {
      this.ult = { f, t: 0, dur: 1.0 };
    }

    update(dt) {
      for (const it of this.items) it.t += dt;
      this.items = this.items.filter((it) => it.t < it.dur);
      if (this.banner) {
        this.banner.t += dt;
        if (this.banner.t > this.banner.dur) this.banner = null;
      }
      if (this.ult) {
        this.ult.t += dt;
        if (this.ult.t > this.ult.dur) this.ult = null;
      }
    }

    draw(ctx) {
      if (this.banner) this.drawBanner(ctx, this.banner);
      if (this.ult) this.drawUltimate(ctx, this.ult);
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

    /* tela cinematográfica da ULTIMATE: tarjas pretas + retrato + nome */
    drawUltimate(ctx, u) {
      const f = u.f;
      const k = u.t / u.dur;
      const bars = Math.min(1, k * 5) * (k > 0.85 ? (1 - k) / 0.15 : 1);
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 1280, 90 * bars);
      ctx.fillRect(0, 720 - 90 * bars, 1280, 90 * bars);
      const slide = M.easeOutCubic(Math.min(1, k * 4));
      const alpha = k > 0.85 ? (1 - k) / 0.15 : 1;
      ctx.globalAlpha = alpha;
      const dir = f.side ? -1 : 1;
      // faixa diagonal com a cor do personagem
      ctx.save();
      ctx.translate(640 + (1 - slide) * -1400 * dir, 360);
      ctx.rotate(-0.12);
      const g = ctx.createLinearGradient(0, -80, 0, 80);
      g.addColorStop(0, VF.M.hexA(f.def.color, 0.95));
      g.addColorStop(1, 'rgba(10,4,20,0.95)');
      ctx.fillStyle = g;
      ctx.fillRect(-900, -80, 1800, 160);
      ctx.strokeStyle = '#ffd600';
      ctx.lineWidth = 5;
      ctx.strokeRect(-900, -80, 1800, 160);
      ctx.restore();
      const px = f.side ? 1000 : 280;
      VF.Rig.portrait(ctx, f.skin, px + (1 - slide) * -600 * dir, 350, 250, { facing: f.side ? -1 : 1, colors: f.colors, expr: 'angry', fighter: f });
      ctx.font = `110px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 16;
      ctx.strokeStyle = '#120a1c';
      const tx = f.side ? 520 : 760;
      const pop = M.easeOutBack(Math.min(1, k * 3));
      ctx.save();
      ctx.translate(tx, 320);
      ctx.scale(pop, pop);
      ctx.strokeText('ULTIMATE!', 0, 0);
      const tg = ctx.createLinearGradient(0, -50, 0, 50);
      tg.addColorStop(0, '#ffffff');
      tg.addColorStop(0.4, '#ffd600');
      tg.addColorStop(1, '#ff3d00');
      ctx.fillStyle = tg;
      ctx.fillText('ULTIMATE!', 0, 0);
      ctx.restore();
      ctx.font = `46px ${FONT}`;
      ctx.lineWidth = 9;
      ctx.strokeText(f.def.ultimate.name, tx, 412);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(f.def.ultimate.name, tx, 412);
      ctx.restore();
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
      VF.Rig.portrait(ctx, f.skin, px, y + 88, 190, { facing: f.side ? -1 : 1, colors: f.colors, expr: 'angry', fighter: f });
      ctx.font = `76px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#120a1c';
      ctx.strokeText(f.def.special.name, 640, y + h / 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(f.def.special.name, 640, y + h / 2);
      ctx.font = `24px ${FONT}`;
      ctx.lineWidth = 6;
      ctx.strokeText('SPECIAL', 640, y + 26);
      ctx.fillStyle = '#ffd600';
      ctx.fillText('SPECIAL', 640, y + 26);
      ctx.restore();
    }
  }

  VF.Announcer = Announcer;
})();
