// Funcionamento offline: guarda os arquivos do app no aparelho depois da primeira visita.
const CACHE = 'caminho-v6'

self.addEventListener('install', (ev) => {
  ev.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html', './manifest.webmanifest'])))
  self.skipWaiting()
})

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys().then((chaves) => Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (ev) => {
  const req = ev.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  if (req.mode === 'navigate') {
    // Página: tenta a rede primeiro (para receber atualizações) e usa a cópia guardada sem internet.
    ev.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone()
          caches.open(CACHE).then((c) => c.put('./index.html', copia))
          return res
        })
        .catch(() => caches.match('./index.html')),
    )
    return
  }
  // Arquivos (scripts, estilos, fontes, ícones): usa a cópia guardada; se não tiver, busca e guarda.
  ev.respondWith(
    caches.match(req).then(
      (guardado) =>
        guardado ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copia = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copia))
          }
          return res
        }),
    ),
  )
})
