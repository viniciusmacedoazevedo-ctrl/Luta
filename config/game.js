/* VINI FIGHT — configurações gerais do jogo.
   Todos os números de balanceamento globais ficam aqui. */
window.VF = window.VF || {};

VF.CONFIG = {
  VERSION: '2.0.0',
  WIDTH: 1280,
  HEIGHT: 720,
  GROUND_Y: 640,
  STAGE_LEFT: 60,
  STAGE_RIGHT: 1220,
  FIXED_DT: 1 / 60,
  GRAVITY: 2900,

  ROUND_TIME: 60,     // segundos exatos por round
  WINS_NEEDED: 2,     // vitórias para ganhar a luta (2 rounds + FINAL ROUND se 1x1)
  MAX_HP: 1000,
  SPECIAL_MAX: 100,
  ULTIMATE_MAX: 100,
  COMBO_WINDOW: 1.0,  // segundos entre golpes para manter o combo
  BLOCK_CHIP: 0.12,   // fração de dano que passa pela defesa
  MAX_JUGGLE: 7,      // golpes no ar antes do oponente cair obrigatoriamente

  SPECIAL_GAIN: {
    onAttack: 1.5,
    onHit: 5,
    onBlocked: 2,
    onHurtPerDmg: 0.06,
    onBlockPerDmg: 0.03,
    comboBonus: 1.5
  },
  ULTIMATE_GAIN: {
    onHit: 2.2,
    onHurtPerDmg: 0.045,
    comboBonus: 0.9,
    onSpecialHit: 6
  },

  BODY_WIDTH: 62,
  HURTBOX: { x: -32, y: -222, w: 64, h: 222 },

  P1_START: 440,
  P2_START: 840
};

VF.DIFFICULTY = {
  easy:   { label: 'EASY',   react: [0.45, 0.85], block: 0.12, combo: 0.15, special: 0.25, ultimate: 0.3, aggression: 0.45, dodge: 0.10, dash: 0.05, jump: 0.08, grab: 0.05 },
  normal: { label: 'NORMAL', react: [0.22, 0.45], block: 0.35, combo: 0.5, special: 0.6, ultimate: 0.7, aggression: 0.65, dodge: 0.35, dash: 0.15, jump: 0.12, grab: 0.12 },
  hard:   { label: 'HARD',   react: [0.07, 0.18], block: 0.62, combo: 0.88, special: 0.95, ultimate: 0.95, aggression: 0.85, dodge: 0.65, dash: 0.3, jump: 0.14, grab: 0.2 }
};
