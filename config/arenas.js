/* Arenas disponíveis. O desenho de cada uma fica em assets/backgrounds/<id>.js
   e a música correspondente em assets/audio/music.js (ou arquivo em config/audio.js). */
VF.ARENAS = [
  { id: 'rua', name: 'RUA BRASILEIRA À NOITE', desc: 'Casinhas coloridas, bandeirinhas e o boteco da esquina.', music: 'rua', icon: '🌙' },
  { id: 'urbana', name: 'ARENA URBANA', desc: 'Grafite, holofotes e a torcida gritando no galpão.', music: 'urbana', icon: '🏙️' },
  { id: 'praca', name: 'PRAÇA BRASILEIRA', desc: 'Pôr do sol, coqueiros, chafariz e calçadão de ondas.', music: 'praca', icon: '🌴' },
  { id: 'futurista', name: 'ARENA FUTURISTA', desc: 'Neon, hologramas e lasers no ano 3000.', music: 'futurista', icon: '🚀' }
];

VF.getArena = (id) => VF.ARENAS.find((a) => a.id === id) || VF.ARENAS[0];
