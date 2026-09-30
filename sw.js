/* Service worker: permite instalar o jogo no celular (PWA) e jogar offline.
   Estratégia: REDE PRIMEIRO (sempre pega a versão nova quando há internet) e
   usa o cache só quando estiver offline. Assim uma atualização nunca mistura
   arquivos antigos com novos. */
const CACHE = 'vinifight-v3';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html', './ui/styles.css', './manifest.webmanifest'])).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return; // fontes externas: navegador decide
  e.respondWith(
    fetch(req).then((res) => {
      // só guarda respostas reais do próprio jogo (nunca páginas de login/redirecionamento)
      if (res && res.ok && res.type === 'basic' && !res.redirected) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req))
  );
});
