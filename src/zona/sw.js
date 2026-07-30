// Service Worker de Zona INNmueble.
//
// Misma estrategia deliberadamente conservadora que se uso en InmuHub: los
// precios, la disponibilidad y los listados de propiedades NUNCA deben
// mostrarse desde una copia vieja en cache sin que el usuario lo sepa.
//
// - Navegaciones HTML: network-first. El cache solo se usa como fallback si
//   de verdad no hay red, y ese fallback es una pagina offline dedicada
//   (nunca una copia vieja de una ficha de propiedad).
// - Imagenes y assets estaticos propios: stale-while-revalidate - esto SI es
//   seguro de cachear porque no cambia el precio ni la disponibilidad.
// - Cualquier llamada a la API (/api/...) se deja pasar directo a la red.
//
// Nota: Cloudflare Pages redirige todo .html a su URL "limpia" sin extension
// (ej. /offline.html -> /offline con 308) en todo el sitio. Los service
// workers no pueden cachear una respuesta que vino de una redireccion
// durante el evento install, por eso OFFLINE_URL apunta directo a /offline
// (la URL final), no a /offline.html - este bug ya se encontro y corrigio
// en InmuHub, aqui se aplica el fix desde el principio.

const CACHE_VERSION = 'zona-v1';
const STATIC_CACHE = CACHE_VERSION + '-static';
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/assets/icon-192.png',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.all(PRECACHE_ASSETS.map((url) => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  if (url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  const isImage = req.destination === 'image';
  const isOwnStatic = url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js'));

  if (isImage || isOwnStatic) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req).then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
          return cached || network;
        })
      )
    );
  }
});
