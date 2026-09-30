/* Presets de efeitos visuais (impacto, poeira, energia, confete, textos) */
(function () {
  const R = (a, b) => a + Math.random() * (b - a);

  VF.FX = {
    hitSpark(ps, x, y, dir, power, color) {
      power = power || 1;
      color = color || '#ffe25a';
      const n = Math.round(10 * power * ((VF.Quality && VF.Quality.particles) || 1));
      for (let i = 0; i < n; i++) {
        const a = R(-1.1, 1.1) + (dir > 0 ? 0 : Math.PI);
        const sp = R(400, 1000) * (0.7 + power * 0.3);
        ps.spawn({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: R(0.15, 0.3), size: R(2, 4) * power, color: i % 3 ? color : '#fff', shape: 'spark', drag: 0.85, add: true });
      }
      ps.spawn({ x, y, life: 0.18, size: 18 * power, grow: 2.2, color: '#fff', shape: 'ring', width: 5 * power, add: true });
      ps.spawn({ x, y, life: 0.12, size: 26 * power, shrink: true, color, shape: 'star', rot: R(0, 6), add: true });
      ps.spawn({ x, y, life: 0.08, size: 40 * power, shrink: true, color: 'rgba(255,255,255,0.9)', shape: 'circle', add: true });
    },

    blockSpark(ps, x, y, dir) {
      for (let i = 0; i < 8; i++) {
        const a = R(-0.9, 0.9) + (dir > 0 ? Math.PI : 0);
        const sp = R(250, 600);
        ps.spawn({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: R(0.12, 0.22), size: 2.5, color: '#7fd8ff', shape: 'spark', drag: 0.85, add: true });
      }
      ps.spawn({ x, y, life: 0.2, size: 16, grow: 1.5, color: '#9be8ff', shape: 'ring', width: 4, add: true });
    },

    dust(ps, x, y, n, dir) {
      n = n || 6;
      for (let i = 0; i < n; i++) {
        ps.spawn({
          x: x + R(-20, 20), y: y - R(0, 6),
          vx: R(-120, 120) + (dir || 0) * 120, vy: R(-90, -20),
          life: R(0.35, 0.6), size: R(6, 12), grow: 1.2, color: 'rgba(210,200,190,0.55)', shape: 'smoke', drag: 0.9
        });
      }
    },

    energy(ps, x, y, color, n, spread) {
      n = n || 6;
      spread = spread || 40;
      for (let i = 0; i < n; i++) {
        ps.spawn({ x: x + R(-spread, spread), y: y + R(-spread, spread), vx: R(-40, 40), vy: R(-160, -40), life: R(0.3, 0.7), size: R(3, 7), shrink: true, color, add: true });
      }
    },

    converge(ps, x, y, color, n, radius) {
      n = n || 8;
      radius = radius || 110;
      for (let i = 0; i < n; i++) {
        const a = R(0, Math.PI * 2);
        const d = R(radius * 0.6, radius);
        const life = R(0.18, 0.3);
        ps.spawn({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, vx: (-Math.cos(a) * d) / life, vy: (-Math.sin(a) * d) / life, life, size: R(2, 4), color, shape: 'spark', add: true });
      }
    },

    ring(ps, x, y, color, size, life) {
      ps.spawn({ x, y, life: life || 0.35, size: size || 30, grow: 3, color, shape: 'ring', width: 6, add: true });
    },

    burst(ps, x, y, color, n, speed) {
      n = n || 24;
      speed = speed || 600;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const sp = R(speed * 0.5, speed);
        ps.spawn({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: R(0.25, 0.5), size: R(3, 6), shrink: true, color, drag: 0.9, add: true });
      }
      ps.spawn({ x, y, life: 0.3, size: 30, grow: 3, color: '#fff', shape: 'ring', width: 8, add: true });
    },

    text(ps, x, y, text, color, size, life) {
      ps.spawn({ x, y, vy: -80, life: life || 0.9, size: size || 30, color: color || '#fff', shape: 'text', text, drag: 0.95 });
    },

    confetti(ps, w, n) {
      const cols = ['#ff3d71', '#ffd600', '#00e5ff', '#76ff03', '#b36bff', '#ff9100'];
      for (let i = 0; i < (n || 80); i++) {
        ps.spawn({ x: R(0, w), y: R(-200, -10), vx: R(-60, 60), vy: R(80, 260), g: 60, life: R(2.5, 4.5), size: R(4, 8), color: cols[i % cols.length], shape: 'rect', rot: R(0, 6), spin: R(-8, 8), fade: false });
      }
    },

    speedLines(ps, x, y, dir, color) {
      const n = Math.max(1, Math.round(3 * ((VF.Quality && VF.Quality.particles) || 1)));
      for (let i = 0; i < n; i++) {
        ps.spawn({ x: x + R(-30, 30), y: y + R(-90, 90), vx: dir * R(900, 1500), vy: 0, life: R(0.12, 0.22), size: R(2, 3.5), color: i % 2 ? '#ffffff' : color || '#ffffff', shape: 'spark', add: true });
      }
    },

    stars(ps, x, y) {
      for (let i = 0; i < 3; i++) {
        ps.spawn({ x: x + R(-30, 30), y: y + R(-10, 10), vx: R(-30, 30), vy: R(-60, -20), life: 0.6, size: 7, color: '#ffe25a', shape: 'star', spin: 6 });
      }
    }
  };
})();
