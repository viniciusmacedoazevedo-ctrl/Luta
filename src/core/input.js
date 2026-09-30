/* Sistema de entrada.
   - VF.Keyboard: estado global do teclado.
   - KeyboardSource: lê um conjunto de bindings (p1/p2).
   - VF.Controller: combina várias fontes (teclado, touch, IA), gera
     "pressionados" com buffer e detecta toque duplo (dash). */
(function () {
  VF.Keyboard = {
    down: new Set(),
    taps: new Set(),
    listeners: [],
    capture: null,

    init() {
      window.addEventListener('keydown', (e) => {
        if (this.capture) {
          e.preventDefault();
          const cb = this.capture;
          this.capture = null;
          cb(e.code);
          return;
        }
        if (!e.repeat) this.taps.add(e.code);
        this.down.add(e.code);
        const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
        if (gameKeys.includes(e.code)) e.preventDefault();
        for (const l of this.listeners.slice()) l(e);
      });
      window.addEventListener('keyup', (e) => this.down.delete(e.code));
      window.addEventListener('blur', () => this.down.clear());
    },

    endFrame() { this.taps.clear(); },

    onKey(fn) {
      this.listeners.push(fn);
      return () => { this.listeners = this.listeners.filter((f) => f !== fn); };
    },

    captureNext(cb) { this.capture = cb; }
  };

  class KeyboardSource {
    constructor(getBindings) { this.getBindings = getBindings; }
    read(held, taps) {
      const kb = VF.Keyboard;
      for (const b of this.getBindings()) {
        for (const a of VF.ACTIONS) {
          const codes = b[a] || [];
          for (const c of codes) {
            if (kb.down.has(c)) held[a] = true;
            if (kb.taps.has(c)) taps[a] = true;
          }
        }
      }
    }
  }

  class Controller {
    constructor(sources) {
      this.sources = sources || [];
      this.held = {};
      this.prev = {};
      this.buffer = {};
      this.lastDir = { dir: 0, t: -10 };
      this.dash = 0;
      this.time = 0;
      this.enabled = true;
    }

    poll(dt) {
      this.time += dt;
      const held = {}, taps = {};
      if (this.enabled) for (const s of this.sources) s.read(held, taps);
      this.dash = 0;
      for (const a of VF.ACTIONS) {
        const edge = (held[a] && !this.prev[a]) || taps[a];
        if (edge) this.buffer[a] = 0.13;
        else if (this.buffer[a] > 0) this.buffer[a] -= dt;
        if (edge && (a === 'left' || a === 'right')) {
          const dir = a === 'left' ? -1 : 1;
          if (this.lastDir.dir === dir && this.time - this.lastDir.t < 0.27) {
            this.dash = dir;
            this.lastDir = { dir: 0, t: -10 };
          } else {
            this.lastDir = { dir, t: this.time };
          }
        }
      }
      for (const s of this.sources) {
        if (s.dash) { this.dash = s.dash; s.dash = 0; }
      }
      this.prev = held;
      this.held = held;
    }

    pressed(a) { return this.buffer[a] > 0; }
    consume(a) {
      const p = this.buffer[a] > 0;
      this.buffer[a] = 0;
      return p;
    }
    dirX() { return (this.held.right ? 1 : 0) - (this.held.left ? 1 : 0); }
    reset() { this.buffer = {}; this.held = {}; this.prev = {}; this.dash = 0; }
  }

  VF.KeyboardSource = KeyboardSource;
  VF.Controller = Controller;
})();
