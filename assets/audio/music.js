/* Músicas procedurais (sequenciador Web Audio).
   Cada faixa: bpm, progressão de acordes (notas MIDI da tônica por compasso),
   padrões de bateria (16 passos) e baixo/arpejo. Placeholders que podem ser
   substituídos por arquivos em config/audio.js. */
(function () {
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const CH = { m: [0, 3, 7, 10], M: [0, 4, 7, 11], d: [0, 4, 7, 10] };

  const TRACKS = {
    menu: {
      bpm: 124, prog: [45, 41, 43, 40], types: ['m', 'M', 'M', 'd'],
      kick: 'x...x...x...x...', snare: '....x.......x...', hat: '..x...x...x...x.',
      bass: [0, null, 0, 12, null, 0, null, 12, 0, null, 0, 12, null, 7, null, 12],
      arp: { every: 2, pattern: [0, 1, 2, 3, 2, 1, 2, 3], oct: 24, wave: 'square', vol: 0.035 },
      pad: 0.03
    },
    rua: {
      bpm: 132, prog: [50, 50, 45, 48], types: ['m', 'm', 'm', 'M'],
      kick: 'x..x..x.x..x..x.', snare: '....x..x....x...', hat: 'x.xxx.xxx.xxx.xx',
      perc: 'x.x..x.x.x..x.x.',
      bass: [0, null, null, 0, null, null, 7, null, 0, null, null, 12, null, 10, 7, null],
      arp: { every: 2, pattern: [0, 2, 1, 3, 2, 1, 0, 2], oct: 24, wave: 'triangle', vol: 0.05 },
      pad: 0.025
    },
    urbana: {
      bpm: 92, swing: 0.12, prog: [48, 46, 44, 43], types: ['m', 'M', 'M', 'd'],
      kick: 'x......xx.x.....', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.xx',
      bass: [0, null, null, null, null, null, null, 0, 0, null, 3, null, null, null, null, null],
      arp: { every: 4, pattern: [2, 3, 1, 2], oct: 24, wave: 'square', vol: 0.04 },
      pad: 0.035
    },
    praca: {
      bpm: 116, prog: [48, 45, 50, 43], types: ['M', 'm', 'm', 'd'],
      kick: 'x..x..x.x..x..x.', snare: '..x..x....x..x..', hat: 'x.x.x.x.x.x.x.x.',
      bass: [0, null, null, 7, null, null, 0, null, 7, null, null, 0, null, null, 7, null],
      arp: { every: 2, pattern: [0, 1, 2, 3, 2, 1, 3, 2], oct: 24, wave: 'triangle', vol: 0.05 },
      pad: 0.03
    },
    futurista: {
      bpm: 118, prog: [45, 41, 48, 43], types: ['m', 'M', 'M', 'M'],
      kick: 'x...x...x...x...', snare: '....x.......x...', hat: '..x...x...x...x.',
      bass: [0, 0, 12, 0, 0, 12, 0, 0, 0, 0, 12, 0, 0, 12, 0, 12],
      arp: { every: 1, pattern: [0, 1, 2, 3, 2, 1, 0, 2, 0, 1, 2, 3, 3, 2, 1, 0], oct: 24, wave: 'sawtooth', vol: 0.03 },
      pad: 0.035, delay: true
    },
    escola: {
      bpm: 126, prog: [48, 53, 43, 48], types: ['M', 'M', 'd', 'M'],
      kick: 'x...x...x...x...', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.',
      bass: [0, null, 7, null, 12, null, 7, null, 0, null, 7, null, 12, null, 10, null],
      arp: { every: 2, pattern: [0, 1, 2, 1, 2, 3, 2, 1], oct: 24, wave: 'square', vol: 0.04 },
      pad: 0.025
    },
    campo: {
      bpm: 138, prog: [43, 48, 50, 43], types: ['M', 'M', 'm', 'M'],
      kick: 'x..x..x.x..x..x.', snare: '....x..x....x..x', hat: 'xxxxxxxxxxxxxxxx',
      perc: 'x.x.x..xx.x.x..x',
      bass: [0, null, 0, null, 7, null, 0, 12, 0, null, 0, null, 7, null, 10, null],
      arp: { every: 2, pattern: [0, 2, 1, 2, 3, 2, 1, 0], oct: 24, wave: 'sawtooth', vol: 0.03 },
      pad: 0.03
    },
    igreja: {
      bpm: 84, prog: [48, 45, 41, 43], types: ['M', 'm', 'M', 'M'],
      kick: 'x.......x.......', snare: '........x.......', hat: '....x.......x...',
      bass: [0, null, null, null, null, null, null, null, 7, null, null, null, null, null, null, null],
      arp: { every: 2, pattern: [0, 1, 2, 3, 2, 1, 2, 3], oct: 24, wave: 'triangle', vol: 0.06 },
      pad: 0.06, delay: true
    },
    ultimate: {
      bpm: 160, prog: [45, 46, 45, 44], types: ['m', 'M', 'm', 'M'],
      kick: 'x.x.x.x.x.x.x.x.', snare: '....x.......x.x.', hat: 'xxxxxxxxxxxxxxxx',
      bass: [0, 0, 12, 0, 0, 12, 0, 12, 0, 0, 12, 0, 0, 12, 3, 12],
      arp: { every: 1, pattern: [0, 1, 2, 3, 2, 1, 3, 2], oct: 24, wave: 'sawtooth', vol: 0.035 },
      pad: 0.04
    },
    victory: {
      bpm: 150, loop: false, length: 48, prog: [48, 53, 55, 48], types: ['M', 'M', 'M', 'M'],
      kick: 'x.......x.......', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.',
      bass: [0, null, null, null, 7, null, null, null, 0, null, null, null, 7, null, null, null],
      melody: [72, null, 72, 72, 76, null, 79, null, 77, null, 76, 74, 76, null, null, null,
        77, null, 77, 77, 81, null, 84, null, 79, null, 77, 76, 79, null, null, null,
        84, null, 83, null, 81, null, 79, null, 84, null, null, null, null, null, null, null],
      pad: 0.04
    }
  };

  VF.Music = {
    tracks: TRACKS,
    track: null,
    timer: null,
    ctx: null,
    bus: null,
    step: 0,
    nextTime: 0,

    play(id, ctx, out) {
      this.stop();
      const tr = TRACKS[id];
      if (!tr) return;
      this.ctx = ctx;
      this.track = tr;
      this.bus = ctx.createGain();
      this.bus.gain.value = 1;
      this.bus.connect(out);
      this.out = this.bus;
      if (tr.delay) {
        const d = ctx.createDelay();
        d.delayTime.value = (60 / tr.bpm) * 0.75;
        const fb = ctx.createGain();
        fb.gain.value = 0.3;
        this.delayIn = ctx.createGain();
        this.delayIn.gain.value = 0.5;
        this.delayIn.connect(d);
        d.connect(fb).connect(d);
        d.connect(this.bus);
      } else {
        this.delayIn = null;
      }
      this.step = 0;
      this.nextTime = ctx.currentTime + 0.08;
      this.timer = setInterval(() => this.schedule(), 25);
      this.schedule();
    },

    stop() {
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
      if (this.bus && this.ctx) {
        const b = this.bus;
        b.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
        setTimeout(() => { try { b.disconnect(); } catch (e) { /* ok */ } }, 500);
      }
      this.bus = null;
      this.track = null;
    },

    schedule() {
      const tr = this.track;
      if (!tr || !this.ctx) return;
      const sixteenth = 60 / tr.bpm / 4;
      while (this.nextTime < this.ctx.currentTime + 0.15) {
        this.playStep(tr, this.step, this.nextTime);
        let dur = sixteenth;
        if (tr.swing) dur *= this.step % 2 === 0 ? 1 + tr.swing : 1 - tr.swing;
        this.nextTime += dur;
        this.step++;
        if (tr.loop === false && this.step >= tr.length) {
          clearInterval(this.timer);
          this.timer = null;
          this.track = null;
          break;
        }
      }
    },

    playStep(tr, step, t) {
      const ctx = this.ctx, out = this.bus;
      const s = step % 16;
      const barIdx = Math.floor(step / 16) % tr.prog.length;
      const root = tr.prog[barIdx];
      const chord = CH[tr.types[barIdx]] || CH.m;
      const sixteenth = 60 / tr.bpm / 4;

      if (tr.kick[s] === 'x') this.kick(t);
      if (tr.snare[s] === 'x') this.snare(t);
      if (tr.hat[s] === 'x') this.hat(t, s % 4 === 2 ? 0.05 : 0.03);
      if (tr.perc && tr.perc[s] === 'x') this.perc(t);

      const b = tr.bass[s];
      if (b !== null && b !== undefined) this.note('sawtooth', mtof(root - 12 + b), t, sixteenth * 1.6, 0.12, 420);

      if (tr.arp && step % tr.arp.every === 0) {
        const idx = Math.floor(step / tr.arp.every) % tr.arp.pattern.length;
        const deg = tr.arp.pattern[idx];
        const semi = chord[deg % chord.length] + (deg >= chord.length ? 12 : 0);
        this.note(tr.arp.wave, mtof(root + tr.arp.oct - 12 + semi), t, sixteenth * tr.arp.every * 0.9, tr.arp.vol, 2600, true);
      }
      if (tr.melody) {
        const m = tr.melody[step % tr.melody.length];
        if (m) this.note('square', mtof(m), t, sixteenth * 1.8, 0.06, 3500, true);
      }
      if (tr.pad && s === 0) {
        chord.slice(0, 3).forEach((c) => this.note('triangle', mtof(root + 12 + c), t, sixteenth * 15, tr.pad, 1800));
      }
    },

    note(type, f, t, dur, vol, lp, toDelay) {
      const ctx = this.ctx;
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      const flt = ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.value = lp || 2000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(flt).connect(g).connect(this.bus);
      if (toDelay && this.delayIn) g.connect(this.delayIn);
      o.start(t);
      o.stop(t + dur + 0.05);
    },

    kick(t) {
      const ctx = this.ctx;
      const o = ctx.createOscillator();
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.5, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      o.connect(g).connect(this.bus);
      o.start(t);
      o.stop(t + 0.25);
    },

    noiseHit(t, type, f, dur, vol) {
      const ctx = this.ctx;
      const src = ctx.createBufferSource();
      src.buffer = VF.Synth._noise(ctx);
      const flt = ctx.createBiquadFilter();
      flt.type = type;
      flt.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(flt).connect(g).connect(this.bus);
      src.start(t, Math.random() * 0.5);
      src.stop(t + dur + 0.02);
    },

    snare(t) {
      this.noiseHit(t, 'bandpass', 1800, 0.16, 0.25);
      const o = this.ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(200, t);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
      o.connect(g).connect(this.bus);
      o.start(t);
      o.stop(t + 0.12);
    },
    hat(t, vol) { this.noiseHit(t, 'highpass', 7000, 0.04, vol); },
    perc(t) { this.noiseHit(t, 'bandpass', 3800, 0.05, 0.08); }
  };
})();
