/* Manifesto de áudio.
   Por padrão (null) todos os sons e músicas são SINTETIZADOS em tempo real
   (assets/audio/synth.js e assets/audio/music.js), então o jogo funciona sem
   nenhum arquivo de áudio.

   Para usar arquivos reais, coloque-os em assets/audio/music ou assets/audio/sfx
   e informe o caminho abaixo. Exemplo:
     menu: 'assets/audio/music/menu.mp3',
     punch: 'assets/audio/sfx/punch.wav',
*/
VF.AUDIO_FILES = {
  music: {
    menu: null,
    rua: null,
    urbana: null,
    praca: null,
    futurista: null,
    escola: null,
    campo: null,
    igreja: null,
    ultimate: null,
    victory: null
  },
  sfx: {
    click: null, hover: null, confirm: null, back: null, select: null, ready: null,
    punch: null, kick: null, heavy: null, grab: null, block: null, whoosh: null,
    jump: null, land: null, dash: null, ko: null, combo: null, round: null,
    fight: null, tick: null, draw: null, victory: null, charge: null,
    blast: null, flash: null, dark: null, steal: null, speech: null, wave: null,
    launch: null, boom: null, gavel: null, zap: null, spin: null, wind: null, kickball: null,
    digital: null, bell: null, flex: null, sparkle: null, clock: null, heartbreak: null,
    sing: null, countdown: null, ultimate: null
  }
};
