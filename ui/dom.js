/* Helpers de interface (DOM) + navegação por teclado nos menus */
(function () {
  VF.UI = {
    root: null,
    navOff: null,

    init() { this.root = document.getElementById('ui'); },

    clear() {
      this.root.innerHTML = '';
      if (this.navOff) { this.navOff(); this.navOff = null; }
    },

    el(tag, cls, html, parent) {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      if (parent) parent.appendChild(e);
      return e;
    },

    screen(cls) {
      const s = this.el('div', 'screen ' + (cls || ''));
      this.root.appendChild(s);
      return s;
    },

    button(label, onClick, cls, parent) {
      const b = this.el('button', 'btn ' + (cls || ''), label, parent);
      b.type = 'button';
      b.setAttribute('data-nav', '');
      b.addEventListener('pointerenter', () => { if (!VF.Device.touch) VF.Audio.play('hover'); });
      b.addEventListener('click', (e) => {
        // ignora "cliques fantasmas" logo após trocar de tela (toque que vazou da tela anterior)
        if (performance.now() - VF.Game.sceneAt < 280) return;
        VF.Audio.unlock();
        VF.Audio.play(b.classList.contains('back') ? 'back' : 'click');
        if (onClick) onClick(e);
      });
      return b;
    },

    /* Setas movem o foco entre elementos [data-nav]; Enter/Espaço ativam; Esc volta */
    enableNav(container, onBack, autofocus) {
      if (this.navOff) this.navOff();
      const handler = (e) => {
        if (!container.isConnected) return;
        const k = e.code;
        if ((k === 'Escape' || k === 'Backspace') && onBack) {
          e.preventDefault();
          VF.Audio.play('back');
          onBack();
          return;
        }
        const dirs = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], KeyW: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0] };
        const d = dirs[k];
        if (!d) return;
        const items = Array.from(container.querySelectorAll('[data-nav]')).filter((el) => !el.disabled && el.offsetParent !== null);
        if (!items.length) return;
        e.preventDefault();
        const cur = document.activeElement;
        if (!items.includes(cur)) { items[0].focus(); return; }
        const r0 = cur.getBoundingClientRect();
        const cx = r0.left + r0.width / 2, cy = r0.top + r0.height / 2;
        let best = null, bestScore = Infinity;
        for (const it of items) {
          if (it === cur) continue;
          const r = it.getBoundingClientRect();
          const x = r.left + r.width / 2 - cx, y = r.top + r.height / 2 - cy;
          const along = x * d[0] + y * d[1];
          if (along <= 4) continue;
          const across = Math.abs(x * d[1]) + Math.abs(y * d[0]);
          const score = along + across * 2.2;
          if (score < bestScore) { bestScore = score; best = it; }
        }
        if (best) {
          best.focus();
          VF.Audio.play('hover');
        }
      };
      this.navOff = VF.Keyboard.onKey(handler);
      if (autofocus !== false && !VF.Device.touch) {
        const first = container.querySelector('[data-nav]:not([disabled])');
        if (first) setTimeout(() => first.focus({ preventScroll: true }), 30);
      }
    },

    bar(value, max, color) {
      const pct = Math.round((value / max) * 100);
      return `<div class="statbar"><div class="statbar-fill" style="width:${pct}%;background:${color || ''}"></div></div>`;
    }
  };
})();
