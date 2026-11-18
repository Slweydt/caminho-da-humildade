// O app saiu da raiz para /app/ (18/11/2026). Este service worker substitui o antigo da raiz:
// apaga os caches antigos do app e se desregistra, para o site ser sempre carregado da rede.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((k) => Promise.all(k.filter((n) => n.startsWith('caminho-')).map((n) => caches.delete(n))))
      .then(() => self.registration.unregister()),
  )
})
