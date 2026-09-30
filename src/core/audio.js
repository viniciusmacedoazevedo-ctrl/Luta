/* Gerenciador de áudio.
   Usa arquivos configurados em config/audio.js quando existirem; caso
   contrário usa os sons/músicas sintetizados (placeholders procedurais). */
VF.Audio = {
  ctx: null,
  master: null,
  musicGain: null,
  sfxGain: null,
  unlocked: false,
  musicId: null,
  fileMusic: null,

  init() {
    const unlock = () => this.unlock();
    ['pointerdown', 'keydown', 'touchstart', 'click'].forEach((ev) =>
      window.addEventListener(ev, unlock, { passive: true }));
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) this.ctx.suspend().catch(() => {});
      else if (this.unlocked) this.ctx.resume().catch(() => {});
    });
  },

  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
      } catch (e) { return; }
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain.connect(this.master);
      this.sfxGain.connect(this.master);
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
      this.applyVolumes();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    if (!this.unlocked) {
      this.unlocked = true;
      if (this.musicId) {
        const id = this.musicId;
        this.musicId = null;
        this.playMusic(id);
      }
    }
  },

  applyVolumes() {
    const s = VF.Settings.data;
    if (this.ctx) {
      this.musicGain.gain.value = s.musicVol * 0.55;
      this.sfxGain.gain.value = s.sfxVol;
    }
    if (this.fileMusic) this.fileMusic.volume = s.musicVol;
  },

  play(name, opts) {
    if (!this.ctx || !this.unlocked) return;
    const file = VF.AUDIO_FILES.sfx[name];
    if (file) {
      const a = new Audio(file);
      a.volume = VF.Settings.data.sfxVol;
      a.play().catch(() => {});
      return;
    }
    const fn = VF.Synth[name];
    if (fn) {
      try { fn(this.ctx, this.sfxGain, opts || {}); } catch (e) { console.warn('sfx', name, e); }
    }
  },

  playMusic(id) {
    if (this.musicId === id && (this.fileMusic || VF.Music.track || !this.unlocked)) return;
    this.stopMusic();
    this.musicId = id;
    if (!this.ctx || !this.unlocked) return;
    const file = VF.AUDIO_FILES.music[id];
    if (file) {
      const a = new Audio(file);
      a.loop = id !== 'victory';
      a.volume = VF.Settings.data.musicVol;
      a.play().catch(() => {});
      this.fileMusic = a;
    } else {
      VF.Music.play(id, this.ctx, this.musicGain);
    }
  },

  /* troca temporária de música (ULTIMATE); null volta para a anterior */
  musicOverride(id) {
    if (id) {
      if (!this.baseMusic) this.baseMusic = this.musicId;
      this.playMusic(id);
    } else if (this.baseMusic) {
      const b = this.baseMusic;
      this.baseMusic = null;
      this.playMusic(b);
    }
  },

  stopMusic() {
    VF.Music.stop();
    if (this.fileMusic) { this.fileMusic.pause(); this.fileMusic = null; }
    this.musicId = null;
  },

  /* Locutor por voz sintetizada do sistema (opcional) */
  announce(text, lang) {
    if (!VF.Settings.data.announcer || !window.speechSynthesis) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang || 'en-US';
      u.rate = 0.95;
      u.pitch = 0.55;
      u.volume = Math.min(1, VF.Settings.data.sfxVol + 0.1);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) { /* sem voz */ }
  }
};
