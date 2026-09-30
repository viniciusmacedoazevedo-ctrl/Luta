/* VINI FIGHT — configurações gerais do jogo.
   Todos os números de balanceamento globais ficam aqui. */
window.VF = window.VF || {};

VF.CONFIG = {
  VERSION: '1.0.0',
  WIDTH: 1280,
  HEIGHT: 720,
  GROUND_Y: 640,
  STAGE_LEFT: 60,
  STAGE_RIGHT: 1220,
  FIXED_DT: 1 / 60,
  GRAVITY: 2900,

  ROUND_TIME: 60,     // segundos exatos por round
  WINS_NEEDED: 2,     // vitórias para ganhar a luta
  MAX_HP: 1000,
  SPECIAL_MAX: 100,
  COMBO_WINDOW: 1.0,  // segundos entre golpes para manter o combo
  BLOCK_CHIP: 0.12,   // fração de dano que passa pela defesa

  SPECIAL_GAIN: {
    onAttack: 1.5,        // ao iniciar um ataque
    onHit: 5,             // ao acertar
    onBlocked: 2,         // ao acertar na defesa do oponente
    onHurtPerDmg: 0.06,   // ao receber dano (por ponto de dano)
    onBlockPerDmg: 0.03,  // ao defender
    comboBonus: 1.5       // extra por hit a partir do combo x3
  },

  BODY_WIDTH: 62,
  HURTBOX: { x: -32, y: -222, w: 64, h: 222 },

  P1_START: 440,
  P2_START: 840
};

VF.DIFFICULTY = {
  easy:   { label: 'FÁCIL',   react: [0.45, 0.85], block: 0.12, combo: 0.15, special: 0.25, aggression: 0.45, dodge: 0.10, dash: 0.05, jump: 0.08 },
  normal: { label: 'NORMAL',  react: [0.22, 0.45], block: 0.35, combo: 0.50, special: 0.60, aggression: 0.65, dodge: 0.35, dash: 0.15, jump: 0.12 },
  hard:   { label: 'DIFÍCIL', react: [0.07, 0.18], block: 0.62, combo: 0.88, special: 0.95, aggression: 0.85, dodge: 0.65, dash: 0.30, jump: 0.12 }
};
