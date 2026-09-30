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
  save() { VF.Storage.set('settings', this.data); },
  reset() { this.data = this.defaults(); this.save(); }
};
