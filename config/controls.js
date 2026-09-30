/* Controles padrão do teclado. Podem ser alterados em SETTINGS
   (ficam salvos no navegador). Cada ação aceita várias teclas.

   Golpes direcionais (valem para teclado, touch e IA):
     ↓ + ataque leve/chute  = ATAQUE BAIXO      ↓ + pesado = RASTEIRA
     → (para frente) + pesado = ATAQUE PARA FRENTE (avança e arremessa)
     ← (para trás) + qualquer ataque = ATAQUE PARA TRÁS (lançador para combo aéreo)
     no ar: leve/chute = AÉREO, pesado = AÉREO PESADO (bate no chão) */
VF.ACTIONS = ['left', 'right', 'up', 'down', 'punch', 'kick', 'heavy', 'special', 'ultimate', 'grab'];

VF.ACTION_LABELS = {
  left: 'Esquerda',
  right: 'Direita',
  up: 'Pular',
  down: 'Defesa / baixo',
  punch: 'Ataque leve',
  kick: 'Chute',
  heavy: 'Ataque pesado',
  special: 'Especial',
  ultimate: 'Ultimate',
  grab: 'Agarrão'
};

VF.DEFAULT_BINDINGS = {
  p1: {
    left: ['KeyA'], right: ['KeyD'], up: ['KeyW'], down: ['KeyS'],
    punch: ['KeyJ'], kick: ['KeyK'], heavy: ['KeyL'],
    special: ['KeyU'], ultimate: ['KeyI'], grab: ['KeyO']
  },
  p2: {
    left: ['ArrowLeft'], right: ['ArrowRight'], up: ['ArrowUp'], down: ['ArrowDown'],
    punch: ['Digit1', 'Numpad1'], kick: ['Digit2', 'Numpad2'], heavy: ['Digit3', 'Numpad3'],
    special: ['Digit4', 'Numpad4'], ultimate: ['Digit5', 'Numpad5'], grab: ['Digit6', 'Numpad6']
  }
};

VF.keyLabel = function (code) {
  if (!code) return '—';
  const map = {
    ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓',
    Space: 'Espaço', Enter: 'Enter', ShiftLeft: 'Shift', ShiftRight: 'Shift Dir',
    ControlLeft: 'Ctrl', ControlRight: 'Ctrl Dir', AltLeft: 'Alt', AltRight: 'AltGr',
    Backspace: '⌫', Tab: 'Tab', Comma: ',', Period: '.', Slash: '/', Semicolon: 'Ç',
    BracketLeft: '´', BracketRight: '[', Quote: '~', Minus: '-', Equal: '='
  };
  if (map[code]) return map[code];
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Numpad')) return 'Num ' + code.slice(6);
  return code;
};
