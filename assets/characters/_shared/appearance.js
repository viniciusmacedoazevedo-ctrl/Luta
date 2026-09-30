/* BIBLIOTECA DE APARÊNCIA
   Transforma a descrição "look" de cada personagem (cabelo, rosto, roupa,
   acessórios) em uma "skin" desenhável pelo rig. Tudo é vetorial/procedural,
   então funciona como arte provisória que pode ser trocada por sprites depois.
   Cabeça: coordenadas locais com centro (0,0), raio R, olhando para +x. */
(function () {
  const D = VF.Draw;
  const PI = Math.PI;
  const OL = D.OL;

  VF.SKIN_TONES = {
    pale: '#f8dcc8', fair: '#f3c9a8', light: '#eebc95', tan: '#d9a176',
    brown: '#b07850', dark: '#7d4b2c', deep: '#5e3620'
  };

  VF.faceExpr = function (e) {
    return {
      eye: { normal: 'normal', angry: 'angry', focus: 'focus', hurt: 'hurt', ko: 'ko', happy: 'happy' }[e] || 'normal',
      mouth: { normal: 'normal', angry: 'angry', focus: 'angry', hurt: 'hurt', ko: 'ko', happy: 'happy' }[e] || 'normal',
      brow: e === 'angry' || e === 'focus' ? 0.35 : e === 'hurt' ? -0.3 : 0
    };
  };

  // ------------------------------------------------------------------ cores
  function hexToHsl(hex) {
    const n = parseInt(hex.slice(1), 16);
    let r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h /= 6;
    }
    return [h * 360, s, l];
  }
  function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360 / 360;
    const f = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    let r, g, b;
    if (s === 0) r = g = b = l;
    else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
      r = f(p, q, h + 1 / 3); g = f(p, q, h); b = f(p, q, h - 1 / 3);
    }
    return '#' + [r, g, b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
  }
  function hueShift(hex, deg) {
    if (!hex || hex[0] !== '#' || hex.length !== 7) return hex;
    const [h, s, l] = hexToHsl(hex);
    return hslToHex(h + deg, Math.max(0.35, s), Math.min(0.62, Math.max(0.3, l)));
  }
  VF.hueShift = hueShift;

  // ------------------------------------------------------------------ cabelos
  function curls(ctx, pts, r, color, dark) {
    // desenha um aglomerado de cachos (contorno único + textura)
    ctx.beginPath();
    for (const p of pts) { ctx.moveTo(p[0] + (p[2] || r), p[1]); ctx.arc(p[0], p[1], p[2] || r, 0, PI * 2); }
    ctx.lineWidth = 6;
    ctx.strokeStyle = OL;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = dark || 'rgba(0,0,0,0.18)';
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(p[0] + (p[2] || r) * 0.25, p[1] + (p[2] || r) * 0.25, (p[2] || r) * 0.45, 0, PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(p[0] - (p[2] || r) * 0.3, p[1] - (p[2] || r) * 0.35, (p[2] || r) * 0.22, 0, PI * 2);
      ctx.fill();
    }
  }
  function ring(cx, cy, dist, a0, a1, n, r, jitter) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = a0 + ((a1 - a0) * i) / Math.max(1, n - 1);
      const d = dist + (jitter ? Math.sin(i * 12.9898) * jitter : 0);
      pts.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d, r]);
    }
    return pts;
  }
  function shine(ctx, R, x, y, w) {
    ctx.beginPath();
    ctx.arc(x, y, R * (w || 0.5), PI * 1.15, PI * 1.55);
    ctx.strokeStyle = 'rgba(255,255,255,0.32)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  /* Cada estilo: { back(ctx, R, c, info, look) — atrás do corpo; front(ctx, R, c, info, look) — sobre a cabeça } */
  const HAIR = {
    fringe: {
      front(ctx, R, c) {
        D.shape(ctx, (g) => {
          g.moveTo(-R - 1, 9);
          g.bezierCurveTo(-R - 6, -R * 1.25, R * 0.5, -R * 1.5, R + 3, -R * 0.42);
          g.lineTo(R - 2, -R * 0.16); g.lineTo(R - 7, -R * 0.42); g.lineTo(R - 11, -R * 0.12);
          g.lineTo(R - 16, -R * 0.44); g.lineTo(R - 21, -R * 0.14); g.lineTo(R - 26, -R * 0.4);
          g.lineTo(-R * 0.2, -R * 0.3);
          g.quadraticCurveTo(-R * 0.55, -R * 0.05, -R * 0.45, 11);
          g.closePath();
        }, c, 3);
        shine(ctx, R, -2, -R * 0.55);
      }
    },
    textured: {
      // curto e arrepiado para cima, SEM franja (testa aparece)
      front(ctx, R, c) {
        D.shape(ctx, (g) => {
          g.moveTo(-R - 1, 8);
          g.bezierCurveTo(-R - 5, -R * 0.9, -R * 0.6, -R * 1.2, -R * 0.4, -R * 1.25);
          g.lineTo(-R * 0.2, -R * 1.45); g.lineTo(0, -R * 1.22); g.lineTo(R * 0.25, -R * 1.45);
          g.lineTo(R * 0.4, -R * 1.18); g.lineTo(R * 0.7, -R * 1.3); g.lineTo(R * 0.72, -R * 1.0);
          g.quadraticCurveTo(R * 1.05, -R * 0.85, R * 0.95, -R * 0.62);
          g.quadraticCurveTo(R * 0.4, -R * 0.78, -R * 0.1, -R * 0.62);
          g.quadraticCurveTo(-R * 0.5, -R * 0.35, -R * 0.45, 10);
          g.closePath();
        }, c, 3);
        shine(ctx, R, -2, -R * 0.75, 0.45);
      }
    },
    quiff: {
      front(ctx, R, c, info, look) {
        D.shape(ctx, (g) => {
          g.moveTo(-R * 0.95, 6);
          g.quadraticCurveTo(-R * 1.05, -R * 0.4, -R * 0.4, -R * 0.62);
          g.lineTo(R * 0.3, -R * 0.62);
          g.lineTo(-R * 0.3, 8);
          g.closePath();
        }, D.shade(c, -0.1) + '', 0);
        const grad = ctx.createLinearGradient(-R, -R, R, -R * 1.8);
        grad.addColorStop(0, c);
        grad.addColorStop(0.55, c);
        grad.addColorStop(1, look.hair.tip || c);
        D.shape(ctx, (g) => {
          g.moveTo(-R * 0.85, -R * 0.35);
          g.bezierCurveTo(-R * 1.1, -R * 1.3, -R * 0.2, -R * 1.9, R * 0.6, -R * 1.75);
          g.quadraticCurveTo(R * 1.35, -R * 1.6, R * 1.25, -R * 0.95);
          g.quadraticCurveTo(R * 0.95, -R * 1.15, R * 0.75, -R * 0.55);
          g.quadraticCurveTo(R * 0.2, -R * 0.75, -R * 0.2, -R * 0.55);
          g.quadraticCurveTo(-R * 0.5, -R * 0.45, -R * 0.85, -R * 0.35);
          g.closePath();
        }, grad, 3);
        shine(ctx, R, 0, -R * 1.2, 0.6);
      }
    },
    long_side: {
      back: longBack(3.6),
      front(ctx, R, c, info, look) {
        D.shape(ctx, (g) => {
          g.moveTo(-R - 1, 8);
          g.bezierCurveTo(-R - 5, -R * 1.35, R * 0.9, -R * 1.45, R + 2, -R * 0.15);
          g.quadraticCurveTo(R * 0.55, -R * 0.75, -R * 0.05, -R * 0.45);
          g.quadraticCurveTo(-R * 0.45, -R * 0.2, -R * 0.5, 9);
          g.closePath();
        }, c, 3);
        highlightStroke(ctx, R, look);
      }
    },
    long_straight: { back: longBack(3.4), front: capMiddle },
    long_medium: { back: longBack(2.2), front: capMiddle },
    long_bangs: {
      back: longBack(3.3),
      front(ctx, R, c, info, look) {
        D.shape(ctx, (g) => {
          g.moveTo(-R - 1, 8);
          g.bezierCurveTo(-R - 5, -R * 1.35, R * 0.8, -R * 1.45, R + 2, -R * 0.35);
          g.lineTo(R * 0.95, -R * 0.2);
          g.lineTo(-R * 0.1, -R * 0.35);
          g.quadraticCurveTo(-R * 0.5, -R * 0.2, -R * 0.5, 9);
          g.closePath();
        }, c, 3);
        highlightStroke(ctx, R, look);
      }
    },
    ponytail: {
      back(ctx, R, c, info) {
        const { x, y, sway } = hb(info, R);
        D.shape(ctx, (g) => {
          g.moveTo(x - R * 0.7, y - R * 0.75);
          g.quadraticCurveTo(x - R * 1.8 + sway, y - R * 0.2, x - R * 1.35 + sway, y + R * 1.8);
          g.quadraticCurveTo(x - R * 1.0 + sway, y + R * 0.4, x - R * 0.5, y - R * 0.45);
          g.closePath();
        }, c, 3);
      },
      front: capTight
    },
    braid: {
      back(ctx, R, c, info) {
        const { x, y, sway } = hb(info, R);
        for (let i = 0; i < 6; i++) {
          D.ellipse(ctx, x - R * 0.9 + sway * (i / 6), y + i * R * 0.42, R * 0.26, R * 0.3, 0.3, c, 2.5);
        }
      },
      front: capTight
    },
    curly_big: {
      back(ctx, R, c, info) {
        const { x, y } = hb(info, R);
        curls(ctx, ring(x - R * 0.1, y - R * 0.1, R * 1.05, PI * 0.55, PI * 1.9, 11, R * 0.42, 3), R * 0.42, c);
      },
      front(ctx, R, c) {
        curls(ctx, ring(0, -R * 0.05, R * 0.95, PI * 1.02, PI * 1.98, 8, R * 0.34, 2), R * 0.34, c);
      }
    },
    curly_tight: {
      // BEM cacheado, volume alto e cachos pequenos (Docinho)
      back(ctx, R, c, info) {
        const { x, y } = hb(info, R);
        curls(ctx, ring(x, y - R * 0.2, R * 1.25, PI * 0.9, PI * 2.05, 12, R * 0.26, 2).concat(ring(x, y - R * 0.2, R * 0.95, PI * 0.85, PI * 2.1, 10, R * 0.26, 2)), R * 0.26, c);
      },
      front(ctx, R, c) {
        curls(ctx, ring(0, -R * 0.35, R * 1.2, PI * 1.05, PI * 1.95, 9, R * 0.24, 2).concat(ring(0, -R * 0.25, R * 0.85, PI * 1.08, PI * 1.92, 7, R * 0.24, 1)), R * 0.24, c);
      }
    },
    curly_medium: {
      // meio crespo, curto e arredondado (Muskito)
      front(ctx, R, c) {
        curls(ctx, ring(-R * 0.05, -R * 0.1, R * 0.92, PI * 0.95, PI * 2.0, 7, R * 0.36, 0), R * 0.36, c);
      }
    },
    curly_long: {
      back(ctx, R, c, info) {
        const { x, y, sway } = hb(info, R);
        const pts = ring(x, y - R * 0.1, R * 1.0, PI * 0.6, PI * 1.9, 9, R * 0.38, 2);
        for (let i = 0; i < 4; i++) {
          pts.push([x - R * 1.0 + sway * 0.3, y + R * (0.5 + i * 0.55), R * 0.36]);
          pts.push([x - R * 0.45 + sway * 0.3, y + R * (0.7 + i * 0.5), R * 0.33]);
        }
        curls(ctx, pts, R * 0.36, c);
      },
      front(ctx, R, c) {
        curls(ctx, ring(0, -R * 0.08, R * 0.92, PI * 1.05, PI * 1.9, 7, R * 0.3, 1), R * 0.3, c);
      }
    },
    short_curly: {
      front(ctx, R, c) {
        curls(ctx, ring(-R * 0.05, -R * 0.12, R * 0.9, PI * 0.9, PI * 2.02, 10, R * 0.27, 1), R * 0.27, c);
      }
    },
    buzz: {
      front(ctx, R, c) {
        D.shape(ctx, (g) => {
          g.moveTo(-R - 1, 4);
          g.bezierCurveTo(-R - 2, -R * 1.2, R * 0.7, -R * 1.25, R * 0.92, -R * 0.45);
          g.quadraticCurveTo(R * 0.3, -R * 0.62, -R * 0.2, -R * 0.52);
          g.quadraticCurveTo(-R * 0.6, -R * 0.3, -R * 0.55, 5);
          g.closePath();
        }, c, 2.5);
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        for (let i = 0; i < 14; i++) ctx.fillRect(-R * 0.8 + (i % 7) * R * 0.25, -R * 0.95 + Math.floor(i / 7) * R * 0.3, 2, 2);
      }
    },
    side_part: {
      front(ctx, R, c, info, look) {
        D.shape(ctx, (g) => {
          g.moveTo(-R - 1, 3);
          g.bezierCurveTo(-R - 3, -R * 1.3, R * 0.7, -R * 1.4, R * 0.95, -R * 0.55);
          g.quadraticCurveTo(R * 0.45, -R * 0.72, 3, -R * 0.62);
          g.quadraticCurveTo(-R * 0.5, -R * 0.5, -R * 0.62, 5);
          g.closePath();
        }, c, 3);
        if (look.hair.temple) D.ellipse(ctx, -R * 0.62, -2, 6, 10, 0, look.hair.temple, 0);
        D.line(ctx, -R * 0.2, -R * 1.02, R * 0.4, -R * 0.9, 'rgba(255,255,255,0.35)', 2);
      }
    },
    bald: {
      front(ctx, R) {
        ctx.beginPath();
        ctx.ellipse(-R * 0.15, -R * 0.6, R * 0.35, R * 0.14, -0.4, 0, PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.fill();
      }
    },
    wig: {
      // peruca (some quando f.wigOff = true, ex.: durante o especial)
      front(ctx, R, c, info) {
        HAIR.bald.front(ctx, R);
        if (info.f && info.f.wigOff) return;
        const lift = info.f && info.f.state === 'hurt' ? -4 : 0;
        ctx.save();
        ctx.translate(2, lift);
        ctx.rotate(-0.06);
        D.shape(ctx, (g) => {
          g.moveTo(-R - 4, R * 0.25);
          g.bezierCurveTo(-R - 8, -R * 1.5, R * 1.1, -R * 1.6, R + 3, -R * 0.35);
          g.lineTo(R * 0.9, -R * 0.3);
          g.lineTo(-R * 0.2, -R * 0.42);
          g.quadraticCurveTo(-R * 0.55, -R * 0.1, -R * 0.55, R * 0.3);
          g.closePath();
        }, c, 3);
        for (let i = 0; i < 5; i++) D.line(ctx, -R * 0.6 + i * R * 0.35, -R * 1.05, -R * 0.4 + i * R * 0.35, -R * 0.5, 'rgba(0,0,0,0.2)', 2);
        shine(ctx, R, 0, -R * 0.8, 0.7);
        ctx.restore();
      }
    },
    medium_wavy: {
      back(ctx, R, c, info) {
        const { x, y, sway } = hb(info, R);
        D.shape(ctx, (g) => {
          g.moveTo(x + R * 0.2, y - R * 1.05);
          g.bezierCurveTo(x - R * 1.2, y - R * 1.2, x - R * 1.5, y, x - R * 1.25 + sway, y + R * 1.25);
          for (let i = 0; i < 4; i++) g.quadraticCurveTo(x - R * (1.05 - i * 0.22) + sway, y + R * (1.55 - (i % 2) * 0.2), x - R * (0.9 - i * 0.22) + sway, y + R * 1.25);
          g.quadraticCurveTo(x - R * 0.2, y + R * 0.6, x, y);
          g.closePath();
        }, c, 3);
      },
      front(ctx, R, c) {
        D.shape(ctx, (g) => {
          g.moveTo(-R - 2, 10);
          g.bezierCurveTo(-R - 6, -R * 1.4, R * 0.8, -R * 1.55, R + 3, -R * 0.4);
          g.quadraticCurveTo(R * 0.8, -R * 0.2, R * 0.55, -R * 0.45);
          g.quadraticCurveTo(R * 0.3, -R * 0.2, 0, -R * 0.45);
          g.quadraticCurveTo(-R * 0.35, -R * 0.25, -R * 0.45, 12);
          g.closePath();
        }, c, 3);
        shine(ctx, R, 0, -R * 0.75, 0.55);
      }
    },
    messy_white: {
      front(ctx, R, c) {
        D.shape(ctx, (g) => {
          const n = 16;
          for (let i = 0; i <= n; i++) {
            const a = PI * 0.85 + (PI * 1.25 * i) / n;
            const r = R * (i % 2 ? 1.05 : 1.45 + Math.sin(i * 3.1) * 0.15);
            const px = Math.cos(a) * r - R * 0.1, py = Math.sin(a) * r - R * 0.05;
            i ? g.lineTo(px, py) : g.moveTo(px, py);
          }
          g.quadraticCurveTo(R * 0.3, -R * 0.55, -R * 0.2, -R * 0.4);
          g.quadraticCurveTo(-R * 0.6, 0, -R * 0.55, R * 0.5);
          g.closePath();
        }, c, 3);
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.moveTo(-R * 0.8 + i * R * 0.3, -R * 1.1);
          ctx.lineTo(-R * 0.7 + i * R * 0.3, -R * 0.75);
          ctx.stroke();
        }
      }
    },
    short: {
      front(ctx, R, c) {
        D.shape(ctx, (g) => {
          g.moveTo(-R - 1, 6);
          g.bezierCurveTo(-R - 4, -R * 1.3, R * 0.8, -R * 1.45, R + 2, -R * 0.5);
          g.quadraticCurveTo(R * 0.5, -R * 0.65, -R * 0.1, -R * 0.55);
          g.quadraticCurveTo(-R * 0.55, -R * 0.3, -R * 0.5, 8);
          g.closePath();
        }, c, 3);
        shine(ctx, R, 0, -R * 0.75, 0.5);
      }
    },
    bun: {
      back(ctx, R, c, info) {
        const { x, y } = hb(info, R);
        D.circle(ctx, x - R * 0.75, y - R * 0.85, R * 0.45, c, 3);
      },
      front: capTight
    }
  };

  function hb(info, R) {
    const J = info.J;
    const sway = Math.sin((info.t || 0) * 3) * 4 - ((info.f && info.f.vx) || 0) * 0.01;
    return { x: J.head.x, y: J.head.y, sway };
  }
  function longBack(len) {
    return function (ctx, R, c, info, look) {
      const { x, y, sway } = hb(info, R);
      const L = len * (look.hair.length || 1);
      D.shape(ctx, (g) => {
        g.moveTo(x + R * 0.3, y - R * 0.95);
        g.bezierCurveTo(x - R * 0.9, y - R * 1.3, x - R * 1.5, y - R * 0.2, x - R * 1.3, y + R * Math.min(1.2, L * 0.4));
        g.quadraticCurveTo(x - R * 1.35 + sway * 0.5, y + R * L * 0.72, x - R * 1.05 + sway, y + R * L);
        g.quadraticCurveTo(x - R * 0.7 + sway, y + R * L * 0.84, x - R * 0.35 + sway * 0.6, y + R * L * 0.9);
        g.quadraticCurveTo(x - R * 0.3 + sway * 0.3, y + R * L * 0.55, x - R * 0.05, y + R * 0.9);
        g.closePath();
      }, c, 3);
      if (look.hair.hi) {
        ctx.beginPath();
        ctx.moveTo(x - R * 0.9, y - R * 0.3);
        ctx.quadraticCurveTo(x - R * 1.2 + sway * 0.4, y + R * L * 0.45, x - R * 0.9 + sway, y + R * L * 0.85);
        ctx.strokeStyle = look.hair.hi;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    };
  }
  function capMiddle(ctx, R, c, info, look) {
    D.shape(ctx, (g) => {
      g.moveTo(-R - 2, 12);
      g.bezierCurveTo(-R - 5, -R * 1.35, R * 0.75, -R * 1.45, R + 2, -R * 0.25);
      g.quadraticCurveTo(R * 0.6, -R * 0.7, R * 0.05, -R * 0.62);
      g.quadraticCurveTo(-R * 0.4, -R * 0.4, -R * 0.5, 12);
      g.closePath();
    }, c, 3);
    highlightStroke(ctx, R, look);
  }
  function capTight(ctx, R, c, info, look) {
    D.shape(ctx, (g) => {
      g.moveTo(-R - 1, 6);
      g.bezierCurveTo(-R - 3, -R * 1.25, R * 0.75, -R * 1.35, R + 1, -R * 0.4);
      g.quadraticCurveTo(R * 0.5, -R * 0.62, 0, -R * 0.55);
      g.quadraticCurveTo(-R * 0.45, -R * 0.35, -R * 0.5, 8);
      g.closePath();
    }, c, 3);
    highlightStroke(ctx, R, look);
  }
  function highlightStroke(ctx, R, look) {
    ctx.beginPath();
    ctx.moveTo(-R * 0.3, -R * 0.95);
    ctx.quadraticCurveTo(R * 0.4, -R * 1.05, R * 0.8, -R * 0.5);
    ctx.strokeStyle = look.hair.hi || 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  // ------------------------------------------------------------------ rosto
  function drawFace(ctx, R, expr, info, look) {
    const c = info.col;
    const F = look.face || {};
    const fx = VF.faceExpr(expr);
    const ex = F.eyeX || [8, 20];
    const ey = F.eyeY == null ? -1 : F.eyeY;
    const es = F.eyeSize || 1;
    const lid = { lidColor: c.skin, iris: F.iris || '#2a1c14', lid: F.sleepy && expr === 'normal' };
    // blush / sardas / rugas
    if (F.blush) D.circle(ctx, 15, 9, 4.5, 'rgba(255,110,140,0.35)', 0);
    if (F.freckles) { ctx.fillStyle = 'rgba(120,60,30,0.45)'; [[12, 6], [16, 8], [20, 6]].forEach(([x, y]) => ctx.fillRect(x, y, 1.6, 1.6)); }
    if (F.wrinkles) {
      D.line(ctx, 2, -R * 0.52, 14, -R * 0.55, 'rgba(0,0,0,0.25)', 1.5);
      D.line(ctx, 25, 2, 28, 5, 'rgba(0,0,0,0.25)', 1.5);
    }
    D.eye(ctx, ex[0], ey, 6 * es, fx.eye, lid);
    D.eye(ctx, ex[1], ey, 5 * es, fx.eye, lid);
    if (F.lashes && (fx.eye === 'normal' || fx.eye === 'angry' || fx.eye === 'focus')) {
      D.line(ctx, ex[0] + 3, ey - 5 * es, ex[0] + 7, ey - 8 * es, OL, 2);
      D.line(ctx, ex[1] + 2, ey - 5 * es, ex[1] + 5, ey - 7.5 * es, OL, 2);
    }
    const bc = F.browColor || c.hair || OL;
    const bw = F.browW || 3;
    D.brow(ctx, ex[0], ey - 9 * es, 8.5, fx.brow + (F.browTilt || 0), bw, bc);
    D.brow(ctx, ex[1], ey - 9 * es, 7, -fx.brow - (F.browTilt || 0), bw, bc);
    // nariz
    if (F.nose === 'big') D.circle(ctx, R - 1, 5, 6.5, c.skin, 2.6);
    else D.nose(ctx, R, c.skin, F.nose === 'small' ? 0.8 : 1);
    // barba / bigode
    if (F.beard) drawBeard(ctx, R, F.beard, F.beardColor || '#e6e6e6');
    // boca
    const my = F.mouthY || 13;
    if (fx.mouth === 'normal' && F.lips) {
      D.ellipse(ctx, 15, my, 4.5, 2.4, -0.1, F.lips, 1.8);
    } else if (fx.mouth === 'normal' && F.mouth) {
      D.mouth(ctx, 15, my, 10, F.mouth);
    } else {
      D.mouth(ctx, 15, my, 10, fx.mouth, { curve: F.serious ? 0 : 3 });
    }
    if (F.mustache) drawMustache(ctx, R, F.mustache, F.beardColor || '#eee');
    // óculos
    if (F.glasses) drawGlasses(ctx, F.glasses, ex, ey, es, F.glassesColor || '#1a1a1a', Object.assign({}, info, { glassGlow: F.glassGlow }));
  }

  function drawBeard(ctx, R, type, color) {
    if (type === 'stubble') {
      ctx.fillStyle = 'rgba(40,30,30,0.35)';
      for (let i = 0; i < 18; i++) ctx.fillRect(2 + (i % 6) * 4.5, 12 + Math.floor(i / 6) * 4, 1.6, 1.6);
      return;
    }
    if (type === 'goatee') {
      D.shape(ctx, (g) => { g.moveTo(10, 16); g.quadraticCurveTo(15, R + 4, 20, 16); g.closePath(); }, color, 2);
      return;
    }
    D.shape(ctx, (g) => {
      g.moveTo(-4, 2);
      g.quadraticCurveTo(-6, R * 0.95, 7, R + 5);
      g.quadraticCurveTo(R * 0.85, R + 3, R + 3, R * 0.35);
      g.lineTo(R - 1, 6);
      g.quadraticCurveTo(R * 0.55, 3, 10, 8);
      g.quadraticCurveTo(3, 6, -4, 2);
      g.closePath();
    }, color, 3);
  }
  function drawMustache(ctx, R, type, color) {
    const big = type === 'bushy';
    D.shape(ctx, (g) => {
      g.moveTo(R - (big ? 22 : 18), 11);
      g.quadraticCurveTo(R - 12, big ? 2 : 6, R - 3, 9);
      g.quadraticCurveTo(R + 2, 12, R - 1, big ? 17 : 15);
      g.quadraticCurveTo(R - 10, 12, R - (big ? 22 : 18), big ? 16 : 12);
      g.closePath();
    }, color, 2);
  }
  function drawGlasses(ctx, type, ex, ey, es, color, info) {
    const glow = info.f && (info.f.state === 'special' || info.f.state === 'ultimate') && info.glassGlow;
    const lens = glow ? 'rgba(160,255,255,0.95)' : 'rgba(190,230,255,0.28)';
    const r1 = 8.5 * es, r2 = 6.8 * es;
    if (type === 'round') {
      D.circle(ctx, ex[0], ey, r1, lens, 2.8);
      D.circle(ctx, ex[1] + 0.5, ey, r2, lens, 2.8);
    } else {
      const th = type === 'thick' ? 3.6 : 2.6;
      const cat = type === 'cat';
      for (const [x, r] of [[ex[0], r1], [ex[1] + 0.5, r2]]) {
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x - r, ey - r * 0.75, r * 2, r * 1.5, cat ? [r, 2, r, 2] : 3);
        else ctx.rect(x - r, ey - r * 0.75, r * 2, r * 1.5);
        ctx.fillStyle = lens;
        ctx.fill();
        ctx.lineWidth = th;
        ctx.strokeStyle = color;
        ctx.stroke();
      }
    }
    D.line(ctx, ex[0] + r1 - 1, ey - 1, ex[1] - r2 + 1, ey - 1, color, 2.4);
    D.line(ctx, ex[0] - r1, ey - 1, -8, 0, color, 2.4);
    if (glow) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const rg = ctx.createRadialGradient(14, ey, 2, 14, ey, 30);
      rg.addColorStop(0, 'rgba(255,255,255,0.9)');
      rg.addColorStop(0.4, 'rgba(0,229,255,0.5)');
      rg.addColorStop(1, 'rgba(0,229,255,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(14, ey, 30, 0, PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawHeadAccessories(ctx, R, look, info) {
    const acc = look.head || [];
    for (const a of acc) {
      switch (a.type || a) {
        case 'earring_hoop':
          ctx.beginPath(); ctx.arc(-7, 15, 4.5, 0, PI * 2); ctx.strokeStyle = a.color || '#ffca28'; ctx.lineWidth = 2; ctx.stroke(); break;
        case 'earring_stud':
          D.circle(ctx, -7, 11, 2.3, a.color || '#dfe6ee', 1.2); break;
        case 'earring_pearl':
          D.circle(ctx, -7, 13, 2.8, '#fffaf0', 1.2); break;
        case 'headband':
          D.shape(ctx, (g) => { g.moveTo(-R - 2, -R * 0.3); g.quadraticCurveTo(0, -R * 0.85, R + 1, -R * 0.45); }, null, 0);
          ctx.lineWidth = 7; ctx.strokeStyle = OL; ctx.stroke(); ctx.lineWidth = 4.5; ctx.strokeStyle = a.color || '#ff4081'; ctx.stroke(); break;
        case 'bow':
          D.poly(ctx, [[-R * 0.5, -R * 0.95], [-R * 0.95, -R * 1.2], [-R * 0.95, -R * 0.7]], a.color || '#ff80ab', 2);
          D.poly(ctx, [[-R * 0.5, -R * 0.95], [-R * 0.05, -R * 1.2], [-R * 0.05, -R * 0.7]], a.color || '#ff80ab', 2);
          D.circle(ctx, -R * 0.5, -R * 0.95, 3.5, D.shade(a.color || '#ff80ab', -0.2), 1.5); break;
        case 'flower':
          D.circle(ctx, -R * 0.35, -R * 0.85, 4, a.color || '#ff4081', 1.8); break;
        case 'clip':
          D.poly(ctx, [[R * 0.2, -R * 0.75], [R * 0.55, -R * 0.62], [R * 0.5, -R * 0.52], [R * 0.15, -R * 0.65]], a.color || '#ffd600', 1.5); break;
      }
    }
  }

  // ------------------------------------------------------------------ roupas (tronco, coords locais do tronco)
  const TOPS = {
    tee(ctx, T, w, c) {
      D.poly(ctx, [[-w, -T * 0.28], [w, -T * 0.78], [w, -T * 0.62], [-w, -T * 0.12]], c.accent, 0);
      band(ctx, T, w, 'rgba(0,0,0,0.35)');
      logo(ctx, T, w, c);
    },
    plain(ctx, T, w, c) { band(ctx, T, w, 'rgba(0,0,0,0.3)'); logo(ctx, T, w, c); },
    bomber(ctx, T, w, c) {
      ctx.fillStyle = c.inner || '#1b1b1b';
      ctx.fillRect(w * 0.12, -T - 5, w, T + 10);
      D.line(ctx, w * 0.12, -T, w * 0.12, 0, 'rgba(0,0,0,0.4)', 2);
      ctx.fillStyle = '#1b1b1b';
      ctx.fillRect(-w, -T - 6, w * 2, 9);
      ctx.fillRect(-w, -10, w * 2, 12);
      ctx.fillStyle = c.shirt;
      ctx.fillRect(-w, -6, w * 2, 2.5);
      D.poly(ctx, [[-w * 0.3, -T * 0.75], [-w * 0.05, -T * 0.52], [-w * 0.2, -T * 0.52], [0, -T * 0.28], [-w * 0.35, -T * 0.55], [-w * 0.2, -T * 0.55]], c.accent || '#1b1b1b', 0);
    },
    fighter(ctx, T, w, c) {
      ctx.fillStyle = OL;
      ctx.fillRect(-w, -T - 6, w * 2, 8);
      D.poly(ctx, [[w * 0.05, -T + 2], [w * 0.6, -T + 2], [w * 0.3, -T * 0.7]], OL, 0);
      ctx.fillStyle = c.accent;
      ctx.fillRect(-w, -14, w * 2, 12);
    },
    striped(ctx, T, w, c) {
      ctx.fillStyle = c.accent;
      for (let y = -6; y > -T - 6; y -= 13) ctx.fillRect(-w, y - 6.5, w * 2, 6.5);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(-w, -T - 6, w * 2, 7);
    },
    suit(ctx, T, w, c, f, look) {
      D.poly(ctx, [[w * 0.02, -T + 1], [w * 0.62, -T + 1], [w * 0.36, -T * 0.58]], c.collar || '#fff', 2);
      if (c.tie) D.poly(ctx, [[w * 0.3, -T + 3], [w * 0.44, -T + 3], [w * 0.46, -T * 0.52], [w * 0.38, -T * 0.42], [w * 0.29, -T * 0.52]], c.tie, 1.8);
      D.line(ctx, w * 0.02, -T + 1, w * 0.3, -T * 0.52, 'rgba(0,0,0,0.5)', 2.5);
      D.circle(ctx, w * 0.44, -T * 0.33, 2.4, 'rgba(0,0,0,0.6)', 0);
      D.circle(ctx, w * 0.44, -T * 0.18, 2.4, 'rgba(0,0,0,0.6)', 0);
      if (c.pocket) D.poly(ctx, [[-w * 0.2, -T * 0.72], [-w * 0.02, -T * 0.72], [-w * 0.1, -T * 0.82]], c.pocket, 1.5);
      if (look.sash && look.sash(f)) {
        D.poly(ctx, [[w * 0.7, -T * 0.98], [w * 0.7, -T * 0.98 + 17], [-w * 0.7, -T * 0.08 + 17], [-w * 0.7, -T * 0.08]], '#0a8f3c', 2);
        D.poly(ctx, [[w * 0.7, -T * 0.98 + 6], [w * 0.7, -T * 0.98 + 11], [-w * 0.7, -T * 0.08 + 11], [-w * 0.7, -T * 0.08 + 6]], '#ffd400', 0);
        D.circle(ctx, 0, -T * 0.53 + 8, 6, '#1565c0', 2);
        D.circle(ctx, 0, -T * 0.53 + 8, 2.5, '#ffd400', 0);
      }
    },
    blazer(ctx, T, w, c) {
      // blazer colorido com estampa (Will)
      ctx.fillStyle = c.accent;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(-w + (i % 4) * w * 0.6, -T * 0.2 - Math.floor(i / 4) * T * 0.45, 5, 0, PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = c.inner || '#fff';
      D.poly(ctx, [[w * 0.05, -T + 1], [w * 0.6, -T + 1], [w * 0.4, -T * 0.4]], c.inner || '#fff', 2);
      D.line(ctx, w * 0.05, -T + 1, w * 0.36, -T * 0.35, 'rgba(0,0,0,0.45)', 3);
    },
    polo(ctx, T, w, c) {
      ctx.fillStyle = D.shade(c.shirt, -0.25);
      ctx.fillRect(-w, -T - 6, w * 2, 9);
      D.line(ctx, w * 0.35, -T + 3, w * 0.35, -T * 0.7, 'rgba(0,0,0,0.4)', 2);
      D.circle(ctx, w * 0.35, -T * 0.82, 1.8, '#fff', 0);
      ctx.fillStyle = c.accent;
      ctx.fillRect(-w * 0.3, -T * 0.72, w * 0.25, 5);
    },
    cardigan(ctx, T, w, c) {
      ctx.fillStyle = c.inner || '#fff';
      ctx.fillRect(w * 0.15, -T - 5, w, T + 10);
      D.line(ctx, w * 0.15, -T, w * 0.15, 0, 'rgba(0,0,0,0.35)', 2);
      [0.3, 0.5, 0.7].forEach((k) => D.circle(ctx, w * 0.1, -T * k, 1.8, 'rgba(0,0,0,0.5)', 0));
      band(ctx, T, w, 'rgba(0,0,0,0.2)');
    },
    jersey(ctx, T, w, c) {
      ctx.fillStyle = c.accent;
      ctx.fillRect(-w * 0.15, -T - 6, w * 0.3, T + 10);
      ctx.fillRect(-w, -T - 6, w * 2, 6);
      ctx.font = "bold 20px 'Bangers', Impact, sans-serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = OL;
      ctx.lineWidth = 3;
      ctx.strokeText(c.number || '10', w * 0.12, -T * 0.35);
      ctx.fillText(c.number || '10', w * 0.12, -T * 0.35);
    },
    hoodie(ctx, T, w, c) {
      // moletom tech com circuitos
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-w * 0.6, -T * (0.2 + i * 0.17));
        ctx.lineTo(0, -T * (0.2 + i * 0.17));
        ctx.lineTo(w * 0.15, -T * (0.28 + i * 0.17));
        ctx.stroke();
        D.circle(ctx, w * 0.15, -T * (0.28 + i * 0.17), 2.2, c.accent, 0);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(-w, -12, w * 2, 12);
      D.shape(ctx, (g) => { g.moveTo(-w * 0.7, -T + 2); g.quadraticCurveTo(-w * 0.2, -T * 0.72, w * 0.3, -T + 2); }, null, 0);
      ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 3; ctx.stroke();
    },
    sport(ctx, T, w, c) {
      // top esportivo (barriga à mostra)
      ctx.fillStyle = c.skin;
      ctx.fillRect(-w, -T * 0.42, w * 2, T * 0.42 - 10);
      D.line(ctx, w * 0.25, -T * 0.3, w * 0.25, -T * 0.1, 'rgba(0,0,0,0.2)', 1.5);
      ctx.fillStyle = c.accent;
      ctx.fillRect(-w, -T * 0.47, w * 2, 6);
      ctx.fillStyle = c.pants;
      ctx.fillRect(-w, -12, w * 2, 14);
    },
    dress(ctx, T, w, c) {
      D.poly(ctx, [[w * 0.0, -T + 1], [w * 0.55, -T + 1], [w * 0.28, -T * 0.78]], c.skin, 0);
      ctx.fillStyle = c.accent;
      ctx.fillRect(-w, -T * 0.3, w * 2, 5);
    },
    blouse(ctx, T, w, c) {
      ctx.fillStyle = c.accent;
      for (let i = 0; i < 3; i++) ctx.fillRect(-w, -T * (0.2 + i * 0.25), w * 2, 3);
      D.poly(ctx, [[w * 0.05, -T + 1], [w * 0.6, -T + 1], [w * 0.3, -T * 0.72]], c.collar || c.skin, 1.5);
    },
    coat(ctx, T, w, c) {
      // paletó antigo + colete (Einstein)
      ctx.fillStyle = c.inner || '#6d4c41';
      ctx.fillRect(w * 0.05, -T * 0.9, w * 0.5, T * 0.8);
      D.poly(ctx, [[w * 0.02, -T + 1], [w * 0.62, -T + 1], [w * 0.36, -T * 0.72]], '#fff', 2);
      if (c.tie) D.poly(ctx, [[w * 0.3, -T + 3], [w * 0.42, -T + 3], [w * 0.36, -T * 0.82]], c.tie, 1.5);
      [0.55, 0.4, 0.25].forEach((k) => D.circle(ctx, w * 0.35, -T * k, 2, '#3e2723', 0));
      D.line(ctx, w * 0.02, -T + 1, w * 0.1, 0, 'rgba(0,0,0,0.45)', 2.5);
    }
  };
  function band(ctx, T, w, color) {
    ctx.fillStyle = color;
    ctx.fillRect(-w, -T - 6, w * 2, 9);
    ctx.fillRect(-w, -8, w * 2, 10);
  }
  function logo(ctx, T, w, c) {
    if (!c.logo) return;
    ctx.font = "bold 18px 'Bangers', Impact, sans-serif";
    ctx.fillStyle = c.logoColor || '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(c.logo, w * 0.18, -T * 0.4);
  }

  // ------------------------------------------------------------------ acessórios do corpo (sobre o tronco)
  function neckAccessories(ctx, T, w, look, c) {
    for (const a of look.neck || []) {
      switch (a.type || a) {
        case 'cross':
          D.line(ctx, w * 0.1, -T + 2, w * 0.3, -T * 0.72, a.color || '#ffd54f', 1.4);
          D.line(ctx, w * 0.3, -T * 0.72, w * 0.3, -T * 0.6, a.color || '#ffd54f', 2.4);
          D.line(ctx, w * 0.25, -T * 0.68, w * 0.35, -T * 0.68, a.color || '#ffd54f', 2.4);
          break;
        case 'pearls':
          for (let i = 0; i < 6; i++) D.circle(ctx, -w * 0.1 + i * w * 0.12, -T + 4 + Math.sin((i / 5) * PI) * 6, 2.2, '#fffaf0', 0.8);
          break;
        case 'lanyard':
          D.line(ctx, w * 0.05, -T + 1, w * 0.3, -T * 0.45, a.color || '#1e88e5', 2.5);
          D.line(ctx, w * 0.5, -T + 1, w * 0.3, -T * 0.45, a.color || '#1e88e5', 2.5);
          D.shape(ctx, (g) => { g.rect(w * 0.18, -T * 0.45, w * 0.26, T * 0.18); }, '#fff', 1.5);
          break;
        case 'whistle':
          D.line(ctx, w * 0.1, -T + 1, w * 0.4, -T * 0.55, '#333', 1.5);
          D.shape(ctx, (g) => { g.rect(w * 0.34, -T * 0.58, 9, 5); }, '#bdbdbd', 1.5);
          break;
        case 'scarf':
          D.shape(ctx, (g) => { g.rect(-w * 0.6, -T - 4, w * 1.3, 10); }, a.color || '#ff4081', 2);
          D.poly(ctx, [[w * 0.45, -T + 4], [w * 0.7, -T * 0.55], [w * 0.5, -T * 0.52]], a.color || '#ff4081', 2);
          break;
        case 'headphones':
          D.shape(ctx, (g) => { g.arc(w * 0.1, -T + 2, w * 0.45, 0.2, PI - 0.2); }, null, 0);
          ctx.lineWidth = 5; ctx.strokeStyle = '#222'; ctx.stroke();
          D.circle(ctx, w * 0.5, -T + 6, 6, a.color || '#00e5ff', 2);
          break;
        case 'chain':
          D.shape(ctx, (g) => { g.arc(w * 0.15, -T + 2, w * 0.35, 0.3, PI - 0.3); }, null, 0);
          ctx.lineWidth = 2.5; ctx.strokeStyle = '#ffd54f'; ctx.stroke();
          break;
        case 'medal':
          D.line(ctx, w * 0.1, -T + 1, w * 0.3, -T * 0.6, '#1565c0', 3);
          D.circle(ctx, w * 0.3, -T * 0.56, 5, '#ffd600', 1.8);
          break;
      }
    }
  }

  // ------------------------------------------------------------------ saia / vestido (sobre as pernas)
  function drawSkirt(ctx, info, look) {
    const J = info.J, c = info.col;
    const s = look.outfit.skirt;
    if (!s) return;
    const w = look.build.width;
    const len = s.length || 70;
    const fx = Math.max(J.fKnee.x, J.bKnee.x) + 14, bx = Math.min(J.fKnee.x, J.bKnee.x) - 14;
    const by = J.hip.y + len;
    D.shape(ctx, (g) => {
      g.moveTo(J.hip.x - w * 0.5, J.hip.y - 4);
      g.lineTo(J.hip.x + w * 0.5, J.hip.y - 4);
      g.lineTo(Math.max(fx, J.hip.x + w * 0.7), by);
      g.quadraticCurveTo((fx + bx) / 2, by + 8, Math.min(bx, J.hip.x - w * 0.7), by);
      g.closePath();
    }, s.color || c.shirt, 3);
    if (s.trim) {
      ctx.beginPath();
      ctx.moveTo(Math.max(fx, J.hip.x + w * 0.7) - 2, by - 4);
      ctx.quadraticCurveTo((fx + bx) / 2, by + 3, Math.min(bx, J.hip.x - w * 0.7) + 2, by - 4);
      ctx.strokeStyle = s.trim;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  // ------------------------------------------------------------------ fábrica
  VF.makeSkin = function (look) {
    const o = look.outfit || {};
    const skinC = VF.SKIN_TONES[look.skin] || look.skin || VF.SKIN_TONES.light;
    const top = o.topColor || '#1e88e5';
    const sleeves = o.sleeves || 'short';
    const sleeveC = o.sleeveColor || top;
    const colors = {
      skin: skinC,
      hair: (look.hair && look.hair.color) || '#1d1a2b',
      shirt: top,
      accent: o.accent || '#ffffff',
      inner: o.inner,
      collar: o.collar,
      tie: o.tie,
      pocket: o.pocket,
      number: o.number,
      logo: o.logo,
      logoColor: o.logoColor,
      upperArm: sleeves === 'none' ? skinC : sleeveC,
      foreArm: sleeves === 'long' ? sleeveC : o.forearm || skinC,
      hand: o.gloves || skinC,
      pants: o.bottom === 'skirt' ? o.legColor || skinC : o.bottomColor || '#263043',
      shin: o.shin || (o.bottom === 'skirt' ? o.legColor || skinC : undefined),
      shoes: o.shoes || '#ffffff',
      shoeAccent: o.shoeAccent === undefined ? '#e53935' : o.shoeAccent
    };
    if (o.bottom === 'shorts') { colors.shin = o.socks || '#ffffff'; }
    const alt = look.alt || {
      shirt: hueShift(colors.shirt, 150), upperArm: sleeves === 'none' ? skinC : hueShift(sleeveC, 150),
      foreArm: sleeves === 'long' ? hueShift(sleeveC, 150) : colors.foreArm,
      accent: hueShift(colors.accent, 150), pants: o.bottom === 'skirt' ? colors.pants : hueShift(colors.pants, 90)
    };
    const hair = HAIR[(look.hair && look.hair.style) || 'short'] || HAIR.short;
    const build = Object.assign({ torso: 72, width: 32, limb: 13, head: 27, leg: 1, arm: 1, foot: 1, belly: 3, scale: 1 }, look.build || {});
    look.build = build;
    const topFn = TOPS[o.top || 'tee'] || TOPS.tee;

    const skin = {
      look,
      build,
      colors,
      alt,
      drawBack(ctx, info) {
        if (hair.back) hair.back(ctx, build.head * (info.portrait ? 1 : VF.Rig.HEAD_SCALE), info.col.hair, info, look);
        if (look.drawBack) look.drawBack(ctx, info);
      },
      drawHead(ctx, R, expr, info) {
        if (look.drawHead) return look.drawHead(ctx, R, expr, info);
        const c = info.col;
        const shape = look.headShape || 'round';
        if (shape === 'oval') D.ellipse(ctx, 0, 1, R * 0.93, R * 1.04, 0, c.skin, 3);
        else if (shape === 'long') D.ellipse(ctx, 0, 2, R * 0.9, R * 1.1, 0, c.skin, 3);
        else if (shape === 'square') {
          D.shape(ctx, (g) => { if (g.roundRect) g.roundRect(-R, -R, R * 2, R * 2.05, R * 0.55); else g.arc(0, 0, R, 0, PI * 2); }, c.skin, 3);
        } else D.circle(ctx, 0, 0, R, c.skin, 3);
        // sombra do lado de trás do rosto
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, R - 1.5, 0, PI * 2);
        ctx.clip();
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.arc(-R * 0.55, R * 0.2, R, 0, PI * 2);
        ctx.fill();
        ctx.restore();
        if (!hair.earOver) D.ear(ctx, -7, 4, c.skin);
        hair.front(ctx, R, c.hair, info, look);
        drawFace(ctx, R, expr, info, look);
        drawHeadAccessories(ctx, R, look, info);
        if (look.drawHeadExtra) look.drawHeadExtra(ctx, R, expr, info);
      },
      drawTorso(ctx, T, w, c, f) {
        topFn(ctx, T, w, c, f, look);
      },
      drawTorsoOver(ctx, T, w, c, f) {
        neckAccessories(ctx, T, w, look, c);
        if (look.drawTorsoOver) look.drawTorsoOver(ctx, T, w, c, f);
      },
      drawLegs(ctx, info) {
        if (o.bottom === 'skirt') drawSkirt(ctx, info, look);
      },
      drawFront(ctx, info) {
        if (look.drawFront) look.drawFront(ctx, info);
      },
      drawNeckline(ctx, R, col) {
        if (o.top === 'suit' || o.top === 'coat' || o.top === 'blazer') {
          D.poly(ctx, [[-R * 0.45, R * 0.95], [R * 0.45, R * 0.95], [0, R * 1.9]], col.collar || '#fff', 2);
          if (col.tie) D.poly(ctx, [[-R * 0.12, R * 1.0], [R * 0.12, R * 1.0], [R * 0.08, R * 2.2], [-R * 0.08, R * 2.2]], col.tie, 1.5);
        } else if (o.top === 'jersey') {
          ctx.fillStyle = col.accent;
          ctx.fillRect(-R * 0.2, R * 1.1, R * 0.4, R * 1.3);
        }
      },
      drawPortraitBack: look.drawPortraitBack,
      victoryPose: look.victoryPose
    };
    return skin;
  };

  VF.HAIR_STYLES = Object.keys(HAIR);
})();
