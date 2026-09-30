/* Ponto de entrada: inicializa os sistemas e abre a tela inicial.
   Parâmetros de URL úteis para testes:
     ?demo=vini,arthur,rua&diff=hard&speed=4  → CPU x CPU acelerado
     ?scene=characters                        → abre uma cena direto */
(function () {
  function boot() {
    VF.Settings.load();
    VF.Device.init();
    VF.applyQuality();
    VF.Keyboard.init();
    VF.Audio.init();
    VF.UI.init();
    VF.Touch.init();
    VF.Game.init();

    // PWA (instalar no celular) — só funciona servindo via http(s)
    if (location.protocol.startsWith('http')) {
      const l = document.createElement('link');
      l.rel = 'manifest';
      l.href = 'manifest.webmanifest';
      document.head.appendChild(l);
      if ('serviceWorker' in navigator && !VF.Device.isNative) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      }
    }

    document.addEventListener('contextmenu', (e) => {
      if (VF.Game.sceneName === 'fight') e.preventDefault();
    });
    // evita zoom por gesto no iOS durante o jogo
    document.addEventListener('gesturestart', (e) => e.preventDefault());

    const q = new URLSearchParams(location.search);
    const speed = parseInt(q.get('speed'), 10);
    if (speed > 1) VF.Game.speed = Math.min(20, speed);
    const ids = VF.CHARACTERS.map((c) => c.id);
    const valid = (id, list) => (list.includes(id) ? id : VF.M.choose(list));
    if (q.has('demo')) {
      const [p1, p2, ar] = (q.get('demo') || '').split(',');
      const S = VF.Session;
      S.mode = 'demo';
      S.p1 = valid(p1, ids);
      S.p2 = valid(p2, ids);
      S.arena = valid(ar, VF.ARENAS.map((a) => a.id));
      S.difficulty = VF.DIFFICULTY[q.get('diff')] ? q.get('diff') : 'hard';
      VF.Game.go('fight');
    } else if (q.get('scene') && VF.Game.scenes[q.get('scene')]) {
      VF.Game.go(q.get('scene'));
    } else {
      VF.Game.go('title');
    }
    window.VF_READY = true;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
