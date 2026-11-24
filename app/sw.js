// Site em revisão (23/11/2026): apaga a cópia offline do app e se desregistra.
// O progresso do leitor (guardado no aparelho) não é apagado. Ao voltar, o app registra o service worker de novo.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((k) => Promise.all(k.map((n) => caches.delete(n))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((cs) => cs.forEach((c) => c.navigate(c.url))),
  )
})
