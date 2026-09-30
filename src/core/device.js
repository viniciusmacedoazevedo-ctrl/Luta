/* Detecção de plataforma: PC (teclado) x celular/tablet (touch) */
VF.Device = {
  touchSeen: false,
  coarse: !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches),
  mobileUA: /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),

  get touch() {
    const mode = VF.Settings.data ? VF.Settings.data.touch : 'auto';
    if (mode === 'on') return true;
    if (mode === 'off') return false;
    return this.mobileUA || this.coarse || this.touchSeen;
  },
  get isElectron() { return !!window.vfDesktop; },
  get isNative() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  },

  init() {
    window.addEventListener('touchstart', () => {
      if (!this.touchSeen) {
        this.touchSeen = true;
        this.apply();
      }
    }, { passive: true });
    this.apply();
  },

  apply() {
    document.body.classList.toggle('is-touch', this.touch);
    document.body.classList.toggle('is-pc', !this.touch);
    if (VF.Game && VF.Game.scene && VF.Game.scene.onDeviceChange) VF.Game.scene.onDeviceChange();
  },

  /* Tela cheia + travar paisagem (quando o navegador permite) */
  goFullscreenLandscape() {
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!document.fullscreenElement && req) {
      try {
        const p = req.call(el, { navigationUI: 'hide' });
        if (p && p.then) {
          p.then(() => {
            if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
          }).catch(() => {});
        }
      } catch (e) { /* ignorado */ }
    }
  }
};
