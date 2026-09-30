/* Resolução de combate: acertos, defesa, combos (com efeitos que crescem),
   colisão de corpos e entidades (projéteis, tornados, drones...). */
(function () {
  const C = VF.CONFIG, M = VF.M;

  VF.Combat = {
    /* isSpecial = golpe vindo de especial/ultimate/projétil (não altera o golpe atual) */
    hit(world, att, def, h, box, dir, isSpecial) {
      const inCombo = world.time - att.lastHitAt <= C.COMBO_WINDOW;
      const scale = h.noScale ? 1 : Math.max(0.4, 1 - 0.06 * Math.max(0, inCombo ? att.combo : 0));
      const res = def.receiveHit(h, att, dir, scale);
      const hb = def.hurtbox;
      const px = (Math.max(box.x, hb.x) + Math.min(box.x + box.w, hb.x + hb.w)) / 2;
      const py = (Math.max(box.y, hb.y) + Math.min(box.y + box.h, hb.y + hb.h)) / 2;
      if (!isSpecial && att.attack) att.attack.contact = true;

      if (res.type === 'block') {
        VF.FX.blockSpark(world.ps, px, py, dir);
        VF.Audio.play('block');
        world.hitstop = Math.max(world.hitstop, 0.05);
        att.gainSpecial(C.SPECIAL_GAIN.onBlocked);
        if (h.kb > 300) world.shake(3, 0.1);
        if (!isSpecial) this.cornerPush(att, def, h, dir);
        return res;
      }

      if (!isSpecial && att.attack) att.attack.hasHit = true;
      this.registerCombo(world, att, res.dmg, isSpecial);
      const lvl = att.combo >= 10 ? 3 : att.combo >= 5 ? 2 : att.combo >= 3 ? 1 : 0;
      VF.FX.hitSpark(world.ps, px, py, dir, (h.spark || 1) * (1 + lvl * 0.15), h.color || (lvl >= 2 ? '#ff9100' : null));
      if (VF.Quality.textPops) VF.FX.text(world.ps, px, py - 30, String(res.dmg), res.dmg >= 90 ? '#ff5252' : '#ffffff', 18 + Math.min(20, res.dmg / 8), 0.6);
      VF.Audio.play(h.sfx || 'punch', { level: lvl });
      world.hitstop = Math.max(world.hitstop, 0.045 + 0.025 * (h.spark || 1) + lvl * 0.01);
      if (h.shake) world.shake(h.shake + lvl * 2, 0.22);
      else if (lvl) world.shake(1.5 + lvl, 0.1);
      // câmera: zoom em golpes fortes, pequenos movimentos em combos
      if (h.zoom) world.camPunch(px, py, h.zoom, 0.28);
      else world.camNudge(dir * (4 + lvl * 3));
      if ((h.spark || 1) >= 2) world.flashScreen('#ffffff', 0.12);
      if (h.launch) VF.FX.ring(world.ps, px, py, '#ffffff', 25, 0.3);
      if (res.ko) world.onKO(att, def);
      if (!isSpecial) this.cornerPush(att, def, h, dir);
      return res;
    },

    registerCombo(world, att, dmg, isSpecial) {
      if (world.time - att.lastHitAt <= C.COMBO_WINDOW) att.combo++;
      else att.combo = 1;
      att.lastHitAt = world.time;
      att.comboShow = 1.6;
      att.comboPop = 1;
      att.stats.damage += dmg;
      att.stats.hits++;
      att.round.damage += dmg;
      att.round.hits++;
      att.stats.maxCombo = Math.max(att.stats.maxCombo, att.combo);
      att.round.maxCombo = Math.max(att.round.maxCombo, att.combo);
      const bonus = att.combo >= 3 ? Math.min(att.combo, 12) : 0;
      att.gainSpecial(C.SPECIAL_GAIN.onHit + C.SPECIAL_GAIN.comboBonus * bonus);
      att.gainUltimate((isSpecial ? C.ULTIMATE_GAIN.onSpecialHit : C.ULTIMATE_GAIN.onHit) + C.ULTIMATE_GAIN.comboBonus * bonus);
      let lvl = 0;
      if (att.combo === 3) lvl = 1;
      else if (att.combo === 5) lvl = 2;
      else if (att.combo === 8) lvl = 2;
      else if (att.combo >= 10 && att.combo % 5 === 0) lvl = 3;
      if (lvl) {
        VF.Audio.play('combo', { level: lvl });
        world.comboEvent(att, lvl);
      }
    },

    cornerPush(att, def, h, dir) {
      if (def.x <= C.STAGE_LEFT + 2 || def.x >= C.STAGE_RIGHT - 2) {
        att.vx = -dir * Math.max(120, (h.kb || 100) * 0.6);
      }
    },

    bodies(a, b) {
      if (a.state === 'down' || b.state === 'down' || a.alpha < 0.3 || b.alpha < 0.3) return;
      if (a.state === 'ultimate' || b.state === 'ultimate' || a.held || b.held) return;
      if (Math.abs(a.y - b.y) > 130) return;
      const min = C.BODY_WIDTH;
      const dx = b.x - a.x;
      if (Math.abs(dx) >= min) return;
      const dir = dx !== 0 ? Math.sign(dx) : a.facing;
      const ov = (min - Math.abs(dx)) / 2;
      a.x -= dir * ov;
      b.x += dir * ov;
      a.x = M.clamp(a.x, C.STAGE_LEFT, C.STAGE_RIGHT);
      b.x = M.clamp(b.x, C.STAGE_LEFT, C.STAGE_RIGHT);
      if (Math.abs(b.x - a.x) < min - 1) {
        if (a.x <= C.STAGE_LEFT || a.x >= C.STAGE_RIGHT) b.x = a.x + dir * min;
        else a.x = b.x - dir * min;
      }
    },

    /* projéteis clássicos + entidades de especiais */
    entities(world, dt) {
      const list = world.projectiles;
      for (const p of list) {
        if (!p.alive) continue;
        p.update(dt, world);
        if (p.custom) continue; // entidades cuidam dos próprios acertos
        const target = world.fighters[0] === p.owner ? world.fighters[1] : world.fighters[0];
        if (p.alive && target.canBeHit() && M.overlap(p.box, target.hurtbox)) {
          if (p.pierce) {
            if (p.hitCd > 0) continue;
            p.hitCd = p.pierce;
          } else p.alive = false;
          this.hit(world, p.owner, target, p.hit, p.box, Math.sign(p.vx) || p.owner.facing, true);
          VF.FX.burst(world.ps, p.x, p.y, p.color, 22, 520);
        }
      }
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i], b = list[j];
          if (a.alive && b.alive && !a.custom && !b.custom && a.owner !== b.owner && M.overlap(a.box, b.box)) {
            a.alive = b.alive = false;
            VF.FX.burst(world.ps, (a.x + b.x) / 2, (a.y + b.y) / 2, '#ffffff', 30, 700);
            VF.Audio.play('heavy');
            world.shake(8, 0.2);
          }
        }
      }
      world.projectiles = list.filter((p) => p.alive);
    }
  };
})();
