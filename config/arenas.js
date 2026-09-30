/* Arenas. O desenho de cada uma fica em assets/backgrounds/<arquivo>.js
   e a música em assets/audio/music.js (ou arquivo real em config/audio.js). */
VF.ARENAS = [
  { id: 'rua', name: 'RUA BRASILEIRA', desc: 'Casinhas coloridas, bandeirinhas e o boteco da esquina à noite.', music: 'rua', icon: '🌙' },
  { id: 'escola', name: 'ESCOLA', desc: 'Pátio da escola com armários, quadro-negro e o sinal tocando.', music: 'escola', icon: '🏫' },
  { id: 'campo', name: 'CAMPO DE FUTEBOL', desc: 'Estádio lotado, refletores e torcida cantando.', music: 'campo', icon: '⚽' },
  { id: 'igreja', name: 'IGREJA', desc: 'Vitrais coloridos, velas e raios de luz dourada (versão estilizada).', music: 'igreja', icon: '⛪' },
  { id: 'urbana', name: 'ARENA URBANA', desc: 'Grafite, holofotes e a torcida gritando no galpão.', music: 'urbana', icon: '🏙️' },
  { id: 'futurista', name: 'ARENA FUTURISTA', desc: 'Neon, hologramas e lasers no ano 3000.', music: 'futurista', icon: '🚀' },
  { id: 'praca', name: 'PRAÇA', desc: 'Pôr do sol, coqueiros, chafariz e calçadão de ondas.', music: 'praca', icon: '🌴' }
];

VF.getArena = (id) => VF.ARENAS.find((a) => a.id === id) || VF.ARENAS[0];
