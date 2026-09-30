/* Efeitos sonoros sintetizados com Web Audio (placeholders procedurais).
   Para trocar por arquivos reais, veja config/audio.js. */
(function () {
  const S = (VF.Synth = {});
  let noiseBuf = null;

  function noise(ctx) {
    if (noiseBuf && noiseBuf.sampleRate === ctx.sampleRate) return noiseBuf;
    const len = ctx.sampleRate;
    const b = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    noiseBuf = b;
    return b;
  }

  function env(g, t, a, d, peak) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  function tone(ctx, out, o) {
    const t = ctx.currentTime + (o.t || 0);
    const a = o.a || 0.005, d = o.d || 0.2;
    const osc = ctx.createOscillator();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f || 440, t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f2), t + a + d);
    if (o.detune) osc.detune.value = o.detune;
    const g = ctx.createGain();
    env(g, t, a, d, o.vol || 0.3);
    let node = osc;
    if (o.lp) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = o.lp;
      osc.connect(f);
      node = f;
    }
    node.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + a + d + 0.05);
    return osc;
  }

  function burst(ctx, out, o) {
    const t = ctx.currentTime + (o.t || 0);
    const a = o.a || 0.002, d = o.d || 0.1;
    const src = ctx.createBufferSource();
    src.buffer = noise(ctx);
    const flt = ctx.createBiquadFilter();
    flt.type = o.type || 'lowpass';
    flt.frequency.setValueAtTime(o.f || 1000, t);
    if (o.f2) flt.frequency.exponentialRampToValueAtTime(o.f2, t + a + d);
    flt.Q.value = o.q || 1;
    const g = ctx.createGain();
    env(g, t, a, d, o.vol || 0.4);
    src.connect(flt).connect(g).connect(out);
    src.start(t, Math.random() * 0.5);
    src.stop(t + a + d + 0.05);
  }

  S._tone = tone;
  S._burst = burst;
  S._noise = noise;

  // ---------- Interface ----------
  S.hover = (c, o) => tone(c, o, { type: 'sine', f: 740, f2: 900, d: 0.04, vol: 0.06 });
  S.click = (c, o) => {
    tone(c, o, { type: 'square', f: 660, f2: 1320, d: 0.06, vol: 0.08 });
    tone(c, o, { type: 'sine', f: 1320, d: 0.08, vol: 0.06, t: 0.03 });
  };
  S.confirm = (c, o) => {
    [523, 659, 784, 1047].forEach((f, i) => tone(c, o, { type: 'square', f, d: 0.09, vol: 0.07, t: i * 0.05, lp: 3000 }));
  };
  S.back = (c, o) => {
    tone(c, o, { type: 'square', f: 600, f2: 300, d: 0.12, vol: 0.07, lp: 2000 });
  };
  S.select = (c, o) => {
    tone(c, o, { type: 'sawtooth', f: 220, f2: 880, d: 0.25, vol: 0.12, lp: 2500 });
    burst(c, o, { type: 'highpass', f: 3000, d: 0.2, vol: 0.12 });
  };
  S.ready = (c, o) => {
    [0, 4, 7, 12].forEach((s, i) => tone(c, o, { type: 'sawtooth', f: 220 * Math.pow(2, s / 12), d: 0.5, vol: 0.07, lp: 2400, t: 0 }));
    tone(c, o, { type: 'square', f: 880, d: 0.3, vol: 0.06, t: 0.05 });
    burst(c, o, { type: 'lowpass', f: 400, d: 0.3, vol: 0.4 });
  };

  // ---------- Combate ----------
  S.whoosh = (c, o, opt) => {
    burst(c, o, { type: 'bandpass', f: 600, f2: 2600, d: 0.12, vol: 0.12 * ((opt && opt.vol) || 1), q: 2 });
  };
  S.punch = (c, o) => {
    burst(c, o, { type: 'lowpass', f: 2200, f2: 400, d: 0.08, vol: 0.55 });
    tone(c, o, { type: 'sine', f: 170, f2: 55, d: 0.12, vol: 0.55 });
  };
  S.kick = (c, o) => {
    burst(c, o, { type: 'lowpass', f: 1600, f2: 250, d: 0.12, vol: 0.6 });
    tone(c, o, { type: 'sine', f: 130, f2: 40, d: 0.16, vol: 0.6 });
    burst(c, o, { type: 'highpass', f: 4000, d: 0.04, vol: 0.15 });
  };
  S.heavy = (c, o) => {
    burst(c, o, { type: 'lowpass', f: 3000, f2: 200, d: 0.25, vol: 0.7 });
    tone(c, o, { type: 'sine', f: 120, f2: 30, d: 0.35, vol: 0.8 });
    tone(c, o, { type: 'square', f: 70, f2: 35, d: 0.2, vol: 0.2, lp: 400 });
  };
  S.grab = (c, o) => {
    burst(c, o, { type: 'bandpass', f: 500, d: 0.08, vol: 0.4, q: 3 });
    tone(c, o, { type: 'sine', f: 100, f2: 30, d: 0.4, vol: 0.8, t: 0.12 });
    burst(c, o, { type: 'lowpass', f: 1500, f2: 150, d: 0.3, vol: 0.6, t: 0.12 });
  };
  S.block = (c, o) => {
    tone(c, o, { type: 'square', f: 900, d: 0.06, vol: 0.12, lp: 5000 });
    tone(c, o, { type: 'triangle', f: 1350, d: 0.12, vol: 0.12 });
    burst(c, o, { type: 'highpass', f: 2500, d: 0.06, vol: 0.2 });
  };
  S.jump = (c, o) => tone(c, o, { type: 'sine', f: 300, f2: 600, d: 0.1, vol: 0.1 });
  S.land = (c, o) => burst(c, o, { type: 'lowpass', f: 400, f2: 100, d: 0.1, vol: 0.25 });
  S.dash = (c, o) => burst(c, o, { type: 'bandpass', f: 1500, f2: 400, d: 0.18, vol: 0.25, q: 1.5 });
  S.ko = (c, o) => {
    tone(c, o, { type: 'sine', f: 90, f2: 25, d: 1.2, vol: 0.9 });
    burst(c, o, { type: 'lowpass', f: 2000, f2: 60, d: 1.0, vol: 0.6 });
    tone(c, o, { type: 'sawtooth', f: 880, f2: 110, d: 0.8, vol: 0.12, lp: 1800 });
  };
  S.combo = (c, o, opt) => {
    const lvl = (opt && opt.level) || 1;
    const base = [660, 880, 1175][Math.min(2, lvl - 1)];
    const notes = lvl >= 3 ? [0, 4, 7, 12, 16] : lvl === 2 ? [0, 4, 7, 12] : [0, 7, 12];
    notes.forEach((s, i) => tone(c, o, { type: 'square', f: base * Math.pow(2, s / 12), d: 0.12, vol: 0.07, t: i * 0.045, lp: 4000 }));
  };
  S.tick = (c, o) => tone(c, o, { type: 'square', f: 1000, d: 0.05, vol: 0.06 });

  // ---------- Locutor / rounds ----------
  S.round = (c, o) => {
    [0, 7, 12].forEach((s, i) => tone(c, o, { type: 'sawtooth', f: 196 * Math.pow(2, s / 12), d: 0.6, vol: 0.08, lp: 2000, t: i * 0.02 }));
    burst(c, o, { type: 'lowpass', f: 300, d: 0.5, vol: 0.4 });
  };
  S.fight = (c, o) => {
    [0, 4, 7, 12].forEach((s) => tone(c, o, { type: 'sawtooth', f: 262 * Math.pow(2, s / 12), d: 0.7, vol: 0.08, lp: 3000 }));
    burst(c, o, { type: 'lowpass', f: 3000, f2: 200, d: 0.4, vol: 0.5 });
    tone(c, o, { type: 'sine', f: 120, f2: 40, d: 0.4, vol: 0.6 });
  };
  S.draw = (c, o) => {
    [523, 494, 466, 440].forEach((f, i) => tone(c, o, { type: 'triangle', f, d: 0.25, vol: 0.12, t: i * 0.18 }));
  };
  S.victory = (c, o) => {
    [0, 4, 7, 12, 7, 12].forEach((s, i) => tone(c, o, { type: 'square', f: 392 * Math.pow(2, s / 12), d: 0.18, vol: 0.08, t: i * 0.1, lp: 3000 }));
  };

  // ---------- Especiais ----------
  S.charge = (c, o) => {
    tone(c, o, { type: 'sawtooth', f: 150, f2: 1200, d: 0.5, vol: 0.12, lp: 2500 });
    tone(c, o, { type: 'sine', f: 300, f2: 2400, d: 0.5, vol: 0.08 });
  };
  S.blast = (c, o) => {
    tone(c, o, { type: 'sawtooth', f: 1400, f2: 160, d: 0.5, vol: 0.2, lp: 4000 });
    tone(c, o, { type: 'square', f: 700, f2: 90, d: 0.45, vol: 0.12, lp: 2000 });
    burst(c, o, { type: 'bandpass', f: 3000, f2: 500, d: 0.5, vol: 0.35, q: 1 });
  };
  S.flash = (c, o) => {
    for (let i = 0; i < 5; i++) tone(c, o, { type: 'square', f: 800 + i * 200, f2: 2400 + i * 300, d: 0.06, vol: 0.06, t: i * 0.035 });
    burst(c, o, { type: 'highpass', f: 2000, d: 0.2, vol: 0.2 });
  };
  S.dark = (c, o) => {
    tone(c, o, { type: 'sawtooth', f: 55, f2: 110, d: 0.9, vol: 0.2, lp: 600 });
    tone(c, o, { type: 'sawtooth', f: 58, f2: 116, d: 0.9, vol: 0.2, lp: 600 });
    tone(c, o, { type: 'sine', f: 440, f2: 110, d: 0.8, vol: 0.1 });
    burst(c, o, { type: 'lowpass', f: 800, f2: 100, d: 0.9, vol: 0.3 });
  };
  S.steal = (c, o) => {
    // "slide whistle" cômico + tilintar
    tone(c, o, { type: 'sine', f: 400, f2: 1600, d: 0.3, vol: 0.18 });
    tone(c, o, { type: 'triangle', f: 1568, d: 0.15, vol: 0.12, t: 0.3 });
    tone(c, o, { type: 'triangle', f: 2093, d: 0.25, vol: 0.12, t: 0.38 });
  };
  S.speech = (c, o) => {
    // "blá blá blá" de megafone
    for (let i = 0; i < 6; i++) {
      const f = 140 + Math.random() * 60;
      tone(c, o, { type: 'square', f, f2: f * 0.8, d: 0.07, vol: 0.14, t: i * 0.09, lp: 1200 });
      burst(c, o, { type: 'bandpass', f: 1200, d: 0.05, vol: 0.08, t: i * 0.09, q: 4 });
    }
  };
  S.wave = (c, o) => {
    tone(c, o, { type: 'sine', f: 80, f2: 30, d: 0.8, vol: 0.9 });
    burst(c, o, { type: 'lowpass', f: 1200, f2: 80, d: 0.7, vol: 0.6 });
    tone(c, o, { type: 'sawtooth', f: 220, f2: 55, d: 0.6, vol: 0.12, lp: 900 });
  };
})();
