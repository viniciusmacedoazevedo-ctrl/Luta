/* Controles touchscreen: joystick virtual (esquerda) + botões (direita).
   Aparecem automaticamente em celulares/tablets durante a luta. */
(function () {
  class TouchSource {
    constructor() {
      this.btn = {};
      this.taps = {};
      this.joy = { x: 0, y: 0, active: false };
      this.dash = 0;
    }
    read(held, taps) {
      const j = this.joy;
      if (j.active) {
        if (j.x < -0.35) held.left = true;
        if (j.x > 0.35) held.right = true;
        if (j.y < -0.6) held.up = true;
        if (j.y > 0.62) held.down = true;
      }
      for (const k in this.btn) if (this.btn[k]) held[k] = true;
      for (const k in this.taps) if (this.taps[k]) taps[k] = true;
      this.taps = {};
    }
    reset() {
      this.btn = {};
      this.taps = {};
      this.joy = { x: 0, y: 0, active: false };
    }
  }

  VF.Touch = {
    el: null,
    source: new TouchSource(),
    visible: false,

    init() {
      this.el = document.getElementById('touch');
      this.el.innerHTML = `
        <div class="tc-zone">
          <div class="tc-base"><div class="tc-knob"></div></div>
          <div class="tc-hint">MOVER • ↑ PULAR • ↓ BAIXO/DEFESA<br>toque duplo ← → = DASH • ← + golpe = LANÇADOR</div>
        </div>
        <div class="tc-pad">
          <button class="tc-btn tc-def" data-act="down"><b>🛡️</b><span>BLOCK</span></button>
          <button class="tc-btn tc-jump" data-act="up"><b>⬆️</b><span>JUMP</span></button>
          <button class="tc-btn tc-grab" data-act="grab"><b>✊</b><span>GRAB</span></button>
          <button class="tc-btn tc-ult" data-act="ultimate"><b>🔥</b><span>ULTIMATE</span></button>
          <button class="tc-btn tc-punch" data-act="punch"><b>👊</b><span>PUNCH</span></button>
          <button class="tc-btn tc-kick" data-act="kick"><b>🦶</b><span>KICK</span></button>
          <button class="tc-btn tc-heavy" data-act="heavy"><b>💥</b><span>HEAVY</span></button>
          <button class="tc-btn tc-sp" data-act="special"><b>⚡</b><span>SPECIAL</span></button>
        </div>`;
      this.zone = this.el.querySelector('.tc-zone');
      this.base = this.el.querySelector('.tc-base');
      this.knob = this.el.querySelector('.tc-knob');
      this.spBtn = this.el.querySelector('.tc-sp');
      this.ultBtn = this.el.querySelector('.tc-ult');
      this.bindJoystick();
      this.bindButtons();
    },

    bindJoystick() {
      const src = this.source;
      let pid = null, ox = 0, oy = 0;
      const radius = () => Math.max(40, this.base.offsetWidth / 2);
      const move = (e) => {
        if (e.pointerId !== pid) return;
        const r = radius();
        let dx = e.clientX - ox, dy = e.clientY - oy;
        const d = Math.hypot(dx, dy);
        if (d > r) { dx = (dx / d) * r; dy = (dy / d) * r; }
        src.joy.x = dx / r;
        src.joy.y = dy / r;
        this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const end = (e) => {
        if (e.pointerId !== pid) return;
        pid = null;
        src.joy = { x: 0, y: 0, active: false };
        this.knob.style.transform = 'translate(0,0)';
        this.base.classList.remove('active');
        this.base.style.left = '';
        this.base.style.top = '';
      };
      this.zone.addEventListener('pointerdown', (e) => {
        if (pid !== null) return;
        e.preventDefault();
        pid = e.pointerId;
        try { this.zone.setPointerCapture(pid); } catch (err) { /* ok */ }
        const zr = this.zone.getBoundingClientRect();
        const r = radius();
        ox = Math.min(Math.max(e.clientX, zr.left + r), zr.right - r);
        oy = Math.min(Math.max(e.clientY, zr.top + r), zr.bottom - r);
        this.base.style.left = ox - zr.left + 'px';
        this.base.style.top = oy - zr.top + 'px';
        this.base.classList.add('active');
        src.joy.active = true;
        move(e);
      });
      this.zone.addEventListener('pointermove', move);
      this.zone.addEventListener('pointerup', end);
      this.zone.addEventListener('pointercancel', end);
    },

    bindButtons() {
      const src = this.source;
      this.el.querySelectorAll('.tc-btn').forEach((b) => {
        const act = b.dataset.act;
        const down = (e) => {
          e.preventDefault();
          try { b.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
          src.btn[act] = true;
          src.taps[act] = true;
          b.classList.add('pressed');
          if (navigator.vibrate) { try { navigator.vibrate(12); } catch (err) { /* ok */ } }
        };
        const up = (e) => {
          e.preventDefault();
          src.btn[act] = false;
          b.classList.remove('pressed');
        };
        b.addEventListener('pointerdown', down);
        b.addEventListener('pointerup', up);
        b.addEventListener('pointercancel', up);
        b.addEventListener('contextmenu', (e) => e.preventDefault());
      });
    },

    show(v) {
      this.visible = !!v && VF.Device.touch;
      this.el.classList.toggle('show', this.visible);
      if (!this.visible) this.source.reset();
    },

    setSpecialReady(ready, ult) {
      if (this.spBtn && this.spBtn.classList.contains('ready') !== !!ready) this.spBtn.classList.toggle('ready', !!ready);
      if (this.ultBtn && this.ultBtn.classList.contains('ready') !== !!ult) this.ultBtn.classList.toggle('ready', !!ult);
    }
  };
})();
