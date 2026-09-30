/* Controles padrão do teclado. Podem ser alterados em CONFIGURAÇÕES
   (as mudanças ficam salvas no navegador). Cada ação aceita várias teclas. */
VF.ACTIONS = ['left', 'right', 'up', 'down', 'punch', 'kick', 'heavy', 'special'];

VF.ACTION_LABELS = {
  left: 'Esquerda',
  right: 'Direita',
  up: 'Pular',
  down: 'Defesa',
  punch: 'Soco',
  kick: 'Chute',
  heavy: 'Ataque forte',
  special: 'Poder especial'
};

VF.DEFAULT_BINDINGS = {
  p1: {
    left: ['KeyA'], right: ['KeyD'], up: ['KeyW'], down: ['KeyS'],
    punch: ['KeyJ'], kick: ['KeyK'], heavy: ['KeyL'], special: ['KeyU']
  },
  p2: {
    left: ['ArrowLeft'], right: ['ArrowRight'], up: ['ArrowUp'], down: ['ArrowDown'],
    punch: ['Digit1', 'Numpad1'], kick: ['Digit2', 'Numpad2'],
    heavy: ['Digit3', 'Numpad3'], special: ['Digit4', 'Numpad4']
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
