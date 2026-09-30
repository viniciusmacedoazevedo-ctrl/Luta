/* Persistência (localStorage) e configurações do jogador */
VF.Storage = {
  get(key, def) {
    try {
      const v = localStorage.getItem('vinifight.' + key);
      return v == null ? def : JSON.parse(v);
    } catch (e) {
      return def;
    }
  },
  set(key, val) {
    try { localStorage.setItem('vinifight.' + key, JSON.stringify(val)); } catch (e) { /* modo privado */ }
  }
};

VF.Settings = {
  data: null,
  defaults() {
    return {
      musicVol: 0.55,
      sfxVol: 0.85,
      difficulty: 'normal',
      announcer: true,
      shake: true,
      showFps: false,
      touch: 'auto', // auto | on | off
      quality: 'auto', // auto | high | low
      bindings: JSON.parse(JSON.stringify(VF.DEFAULT_BINDINGS))
    };
  },
  load() {
    const def = this.defaults();
    const saved = VF.Storage.get('settings', {}) || {};
    const data = Object.assign(this.defaults(), saved);
    data.bindings = {};
    for (const p of ['p1', 'p2']) {
      data.bindings[p] = Object.assign({}, def.bindings[p], (saved.bindings || {})[p] || {});
    }
    if (!VF.DIFFICULTY[data.difficulty]) data.difficulty = 'normal';
    this.data = data;
    return data;
  },
  save() { VF.Storage.set('settings', this.data); VF.applyQuality(); },
  reset() { this.data = this.defaults(); this.save(); }
};

/* Qualidade gráfica (performance em PCs e celulares mais fracos) */
VF.Quality = { particles: 1, afterimages: true, textPops: true, cel: true, maxParticles: 900 };
VF.applyQuality = function () {
  const q = (VF.Settings.data && VF.Settings.data.quality) || 'auto';
  const weak = (navigator.hardwareConcurrency || 4) <= 4 || (VF.Device && VF.Device.mobileUA);
  const low = q === 'low' || (q === 'auto' && weak);
  Object.assign(VF.Quality, low
    ? { particles: 0.45, afterimages: false, textPops: false, cel: false, maxParticles: 350, low: true }
    : { particles: 1, afterimages: true, textPops: true, cel: true, maxParticles: 900, low: false });
  if (VF.Rig) VF.Rig.cel = VF.Quality.cel;
};
