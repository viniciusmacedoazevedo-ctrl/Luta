/* Rig 2D procedural: desenha um lutador cartunesco a partir de uma "pose"
   (ângulos de membros). Coordenadas locais: pés em (0,0), olhando para +x.
   Ângulos dos membros: 0 = para baixo, positivo = para a frente (sentido do olhar),
   PI = para cima. Os ângulos do antebraço/canela são absolutos. */
(function () {
  const OL = '#15101f';

  const D = (VF.Draw = {
    OL,
    circle(ctx, x, y, r, fill, lw) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (lw !== 0) { ctx.lineWidth = lw || 3; ctx.strokeStyle = OL; ctx.stroke(); }
    },
    ellipse(ctx, x, y, rx, ry, rot, fill, lw) {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (lw !== 0) { ctx.lineWidth = lw || 3; ctx.strokeStyle = OL; ctx.stroke(); }
    },
    poly(ctx, pts, fill, lw) {
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (lw !== 0) { ctx.lineWidth = lw || 3; ctx.strokeStyle = OL; ctx.lineJoin = 'round'; ctx.stroke(); }
    },
    shape(ctx, build, fill, lw) {
      ctx.beginPath();
      build(ctx);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (lw !== 0) { ctx.lineWidth = lw || 3; ctx.strokeStyle = OL; ctx.lineJoin = 'round'; ctx.stroke(); }
    },
    line(ctx, x1, y1, x2, y2, color, lw) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color || OL;
      ctx.lineWidth = lw || 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    },

    /* Olho (olhando para a direita) */
    eye(ctx, x, y, s, expr, opt) {
      opt = opt || {};
      ctx.lineCap = 'round';
      switch (expr) {
        case 'hurt':
          D.line(ctx, x - s * 0.8, y - s * 0.6, x + s * 0.5, y, OL, 2.6);
          D.line(ctx, x + s * 0.5, y, x - s * 0.8, y + s * 0.6, OL, 2.6);
          return;
        case 'ko':
          D.line(ctx, x - s * 0.7, y - s * 0.7, x + s * 0.7, y + s * 0.7, OL, 2.6);
          D.line(ctx, x + s * 0.7, y - s * 0.7, x - s * 0.7, y + s * 0.7, OL, 2.6);
          return;
        case 'happy':
          ctx.beginPath();
          ctx.arc(x, y + s * 0.5, s * 0.8, Math.PI * 1.15, Math.PI * 1.85);
          ctx.strokeStyle = OL;
          ctx.lineWidth = 2.8;
          ctx.stroke();
          return;
      }
      D.ellipse(ctx, x, y, s * 0.78, s, 0, opt.white || '#fff', 2);
      const px = x + s * 0.28 + (opt.look || 0), py = y + (expr === 'focus' ? -s * 0.1 : s * 0.05);
      D.circle(ctx, px, py, s * 0.45, opt.iris || '#2a1c14', 0);
      D.circle(ctx, px + s * 0.12, py - s * 0.18, s * 0.14, '#fff', 0);
      if (expr === 'angry' || expr === 'focus' || opt.lid) {
        // pálpebra
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(x, y, s * 0.78 + 0.5, s + 0.5, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = opt.lidColor || '#e3a987';
        ctx.fillRect(x - s, y - s * 1.2, s * 2, s * (expr === 'angry' ? 0.75 : 0.55));
        ctx.restore();
        D.line(ctx, x - s * 0.9, y - s * (expr === 'angry' ? 0.45 : 0.65), x + s * 0.9, y - s * (expr === 'angry' ? 0.3 : 0.65), OL, 2.2);
      }
    },

    brow(ctx, x, y, w, ang, lw, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0);
      ctx.lineTo(w / 2, 0);
      ctx.strokeStyle = color || OL;
      ctx.lineWidth = lw || 3.5;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    },

    /* Boca (olhando para a direita) */
    mouth(ctx, x, y, w, expr, opt) {
      opt = opt || {};
      ctx.lineCap = 'round';
      switch (expr) {
        case 'angry':
          D.shape(ctx, (c) => { c.roundRect ? c.roundRect(x - w / 2, y - 4, w, 8, 3) : c.rect(x - w / 2, y - 4, w, 8); }, '#fff', 2);
          D.line(ctx, x - w / 2, y, x + w / 2, y, OL, 1.5);
          return;
        case 'hurt':
        case 'shout':
          D.ellipse(ctx, x, y + 2, w * 0.38, w * 0.45, 0, '#5a1020', 2);
          D.ellipse(ctx, x, y + 6, w * 0.22, w * 0.16, 0, '#ff6b81', 0);
          return;
        case 'happy':
          D.shape(ctx, (c) => { c.moveTo(x - w / 2, y - 2); c.quadraticCurveTo(x, y + w * 0.9, x + w / 2, y - 3); c.closePath(); }, '#5a1020', 2);
          D.ellipse(ctx, x, y + w * 0.3, w * 0.2, w * 0.12, 0, '#ff6b81', 0);
          return;
        case 'ko':
          ctx.beginPath();
          ctx.moveTo(x - w / 2, y);
          for (let i = 1; i <= 4; i++) ctx.lineTo(x - w / 2 + (w / 4) * i, y + (i % 2 ? 3 : -3));
          ctx.strokeStyle = OL;
          ctx.lineWidth = 2.4;
          ctx.stroke();
          return;
        case 'smirk':
          ctx.beginPath();
          ctx.moveTo(x - w / 2, y + 1);
          ctx.quadraticCurveTo(x, y + 4, x + w / 2, y - 4);
          ctx.strokeStyle = OL;
          ctx.lineWidth = 2.6;
          ctx.stroke();
          return;
        default:
          ctx.beginPath();
          ctx.moveTo(x - w / 2, y);
          ctx.quadraticCurveTo(x, y + (opt.curve == null ? 3 : opt.curve), x + w / 2, y - 1);
          ctx.strokeStyle = opt.color || OL;
          ctx.lineWidth = 2.6;
          ctx.stroke();
      }
    },

    nose(ctx, R, fill, size) {
      size = size || 1;
      D.shape(ctx, (c) => {
        c.moveTo(R - 4, -3 * size);
        c.quadraticCurveTo(R + 6 * size, 4 * size, R - 2, 8 * size);
      }, fill, 2.4);
    },

    ear(ctx, x, y, fill) {
      D.ellipse(ctx, x, y, 6, 8, 0, fill, 2.4);
      ctx.beginPath();
      ctx.arc(x + 1, y, 3, -1.2, 1.2);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
  });

  function shade(color, amt) {
    // escurece (amt<0) ou clareia (amt>0) uma cor hex
    if (!color || color[0] !== '#') return color;
    const n = parseInt(color.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const f = (v) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
    r = f(r); g = f(g); b = f(b);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  D.shade = shade;

  function seg(ctx, a, b, w, color) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineWidth = w;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function limb(ctx, p0, p1, p2, w1, w2, c1, c2, end, endR, endColor, back) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // contorno
    seg(ctx, p0, p1, w1 + 5, OL);
    seg(ctx, p1, p2, w2 + 5, OL);
    if (end === 'hand') D.circle(ctx, p2.x, p2.y, endR + 2.5, OL, 0);
    // preenchimento
    seg(ctx, p0, p1, w1, back ? shade(c1, -0.22) : c1);
    seg(ctx, p1, p2, w2, back ? shade(c2, -0.22) : c2);
    if (end === 'hand') D.circle(ctx, p2.x, p2.y, endR, back ? shade(endColor, -0.22) : endColor, 0);
    if (!back && VF.Rig.cel) {
      // brilho de cel-shading
      const o = { x: -w1 * 0.16, y: -w1 * 0.16 };
      const q = (p) => ({ x: p.x + o.x, y: p.y + o.y });
      seg(ctx, q(p0), q(p1), w1 * 0.28, shade(c1, 0.32));
      seg(ctx, q(p1), q(p2), w2 * 0.26, shade(c2, 0.32));
      if (end === 'hand') D.circle(ctx, p2.x - endR * 0.3, p2.y - endR * 0.3, endR * 0.35, shade(endColor, 0.4), 0);
    }
  }

  function shoe(ctx, foot, shinAng, color, accent, back, size) {
    const dx = Math.cos(shinAng), dy = -Math.sin(shinAng);
    const cx = foot.x + dx * 8 * size, cy = foot.y + dy * 8 * size;
    const rot = Math.atan2(dy, dx);
    D.ellipse(ctx, cx, cy, 15 * size, 8 * size, rot, back ? shade(color, -0.22) : color, 3);
    if (accent) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.fillStyle = back ? shade(accent, -0.22) : accent;
      ctx.fillRect(-12 * size, 2 * size, 24 * size, 3.5 * size);
      ctx.restore();
    }
  }

  const P = (x, y) => ({ x, y });
  const add = (a, ang, len) => ({ x: a.x + Math.sin(ang) * len, y: a.y + Math.cos(ang) * len });

  function joints(pose, b) {
    const TH = 46 * b.leg, SH = 48 * b.leg, T = b.torso, R = b.head;
    const UA = 34 * b.arm, FA = 32 * b.arm;
    const fl = pose.fl, bl = pose.bl;
    const ext = (t, s) => TH * Math.cos(t) + SH * Math.cos(s);
    const hipY = pose.fixedHip ? -(TH + SH - 4) : -Math.max(ext(fl[0], fl[1]), ext(bl[0], bl[1]));
    const hip = P(pose.hx || 0, hipY + (pose.dy || 0));
    const lean = pose.lean || 0;
    const neck = P(hip.x + Math.sin(lean) * T, hip.y - Math.cos(lean) * T);
    const sh = P(hip.x + (neck.x - hip.x) * 0.9, hip.y + (neck.y - hip.y) * 0.9);
    const hang = lean + (pose.head || 0);
    const HS = VF.Rig.HEAD_SCALE;
    const head = P(neck.x + Math.sin(hang) * (R * HS + 2), neck.y - Math.cos(hang) * (R * HS + 2));
    const fHip = P(hip.x + 3, hip.y), bHip = P(hip.x - 4, hip.y);
    const fKnee = add(fHip, fl[0], TH), fFoot = add(fKnee, fl[1], SH);
    const bKnee = add(bHip, bl[0], TH), bFoot = add(bKnee, bl[1], SH);
    const fSh = P(sh.x + 4, sh.y), bSh = P(sh.x - 5, sh.y + 2);
    const fElb = add(fSh, pose.fa[0], UA), fHand = add(fElb, pose.fa[1], FA);
    const bElb = add(bSh, pose.ba[0], UA), bHand = add(bElb, pose.ba[1], FA);
    return { hip, neck, sh, head, hang, lean, fHip, bHip, fKnee, fFoot, bKnee, bFoot, fSh, bSh, fElb, fHand, bElb, bHand, T, R };
  }

  function drawTorso(ctx, J, b, col, skin, f) {
    const w = b.width, T = J.T;
    const wh = w * 0.48, ws = w * 0.56, bulge = b.belly || 2;
    ctx.save();
    ctx.translate(J.hip.x, J.hip.y);
    ctx.rotate(J.lean);
    const path = (c) => {
      c.moveTo(-wh, 4);
      c.lineTo(wh, 4);
      c.quadraticCurveTo(wh + bulge, -T * 0.45, ws, -T + 4);
      c.quadraticCurveTo(0, -T - 8, -ws, -T + 4);
      c.quadraticCurveTo(-wh - bulge * 0.2, -T * 0.5, -wh, 4);
      c.closePath();
    };
    ctx.beginPath();
    path(ctx);
    ctx.fillStyle = col.shirt;
    ctx.fill();
    ctx.save();
    ctx.clip();
    // sombreamento lateral
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.fillRect(-ws - 10, -T - 10, w * 0.35, T + 20);
    if (VF.Rig.cel) {
      ctx.fillStyle = 'rgba(255,255,255,0.13)';
      ctx.fillRect(ws * 0.25, -T - 10, w * 0.22, T + 20);
    }
    if (skin.drawTorso) skin.drawTorso(ctx, T, w, col, f);
    ctx.restore();
    ctx.beginPath();
    path(ctx);
    ctx.lineWidth = 3;
    ctx.strokeStyle = OL;
    ctx.lineJoin = 'round';
    ctx.stroke();
    if (skin.drawTorsoOver) skin.drawTorsoOver(ctx, T, w, col, f);
    ctx.restore();
  }

  VF.Rig = {
    HEAD_SCALE: 1.17,
    cel: true,
    joints,

    /* opt: {x, y, facing, scale, colors, expr, t, fighter, alpha} */
    draw(ctx, skin, pose, opt) {
      const b = skin.build;
      const col = opt.colors || skin.colors;
      const f = opt.fighter || {};
      const s = (opt.scale || 1) * (b.scale || 1);
      ctx.save();
      ctx.translate(opt.x, opt.y);
      ctx.scale((opt.facing || 1) * s, s);
      if (opt.alpha != null) ctx.globalAlpha *= opt.alpha;
      ctx.translate(pose.ox || 0, pose.oy || 0);
      if (pose.rot) ctx.rotate(pose.rot);

      const J = joints(pose, b);
      const lw = b.limb;
      const expr = opt.expr || 'normal';
      const ctxInfo = { J, col, f, t: opt.t || 0, expr, pose };

      if (skin.drawBack) skin.drawBack(ctx, ctxInfo);

      // braço de trás
      limb(ctx, J.bSh, J.bElb, J.bHand, lw * 1.05, lw * 0.95, col.upperArm, col.foreArm, 'hand', lw * 0.72, col.hand, true);
      // perna de trás
      limb(ctx, J.bHip, J.bKnee, J.bFoot, lw * 1.25, lw * 1.1, col.pants, col.shin || col.pants, null, 0, null, true);
      shoe(ctx, J.bFoot, pose.bl[1], col.shoes, col.shoeAccent, true, b.foot || 1);
      // quadril
      D.ellipse(ctx, J.hip.x, J.hip.y + 2, b.width * 0.52, 15, J.lean, col.pants, 3);
      // perna da frente
      limb(ctx, J.fHip, J.fKnee, J.fFoot, lw * 1.25, lw * 1.1, col.pants, col.shin || col.pants, null, 0, null, false);
      shoe(ctx, J.fFoot, pose.fl[1], col.shoes, col.shoeAccent, false, b.foot || 1);
      if (skin.drawLegs) skin.drawLegs(ctx, ctxInfo);
      // tronco
      drawTorso(ctx, J, b, col, skin, f);
      // pescoço + cabeça
      ctx.lineCap = 'round';
      seg(ctx, J.neck, J.head, 17, OL);
      seg(ctx, J.neck, J.head, 12, col.skin);
      ctx.save();
      ctx.translate(J.head.x, J.head.y);
      ctx.rotate(J.hang);
      ctx.scale(VF.Rig.HEAD_SCALE, VF.Rig.HEAD_SCALE);
      skin.drawHead(ctx, J.R, expr, ctxInfo);
      ctx.restore();
      // braço da frente
      limb(ctx, J.fSh, J.fElb, J.fHand, lw * 1.05, lw * 0.95, col.upperArm, col.foreArm, 'hand', lw * 0.78, col.hand, false);
      if (skin.drawFront) skin.drawFront(ctx, ctxInfo);

      ctx.restore();
      return J;
    },

    /* Retrato (busto) para HUD e cards */
    portrait(ctx, skin, x, y, size, opt) {
      opt = opt || {};
      const col = opt.colors || skin.colors;
      const R = skin.build.head;
      const k = size / (R * 2.6);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(k * (opt.facing || 1), k);
      const info = { J: { head: { x: 0, y: 0 }, hang: 0, lean: 0, R }, col, f: opt.fighter || {}, t: opt.t || 0, expr: opt.expr || 'normal', portrait: true };
      // ombros
      D.shape(ctx, (c) => {
        c.moveTo(-R * 1.7, R * 2.4);
        c.quadraticCurveTo(-R * 1.6, R * 0.95, 0, R * 0.95);
        c.quadraticCurveTo(R * 1.6, R * 0.95, R * 1.7, R * 2.4);
        c.closePath();
      }, col.shirt, 3);
      if (skin.drawPortraitBack) skin.drawPortraitBack(ctx, info);
      if (skin.drawNeckline) skin.drawNeckline(ctx, R, col, info);
      if (skin.drawBack) skin.drawBack(ctx, info);
      ctx.lineCap = 'round';
      seg(ctx, { x: 0, y: R * 1.1 }, { x: 0, y: 0 }, 17, OL);
      seg(ctx, { x: 0, y: R * 1.1 }, { x: 0, y: 0 }, 12, col.skin);
      skin.drawHead(ctx, R, opt.expr || 'normal', info);
      ctx.restore();
    }
  };
})();
