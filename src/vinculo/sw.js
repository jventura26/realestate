// Service Worker de InmuHub.
//
// Estrategia deliberadamente conservadora: los precios, la disponibilidad y
// los listados de propiedades NUNCA deben mostrarse desde una copia vieja en
// cache sin que el usuario lo sepa - mostrar un precio o "Activa" desactualizado
// seria tan enganoso como cualquier otro dato inventado. Por eso:
//
// - Navegaciones HTML (cualquier pagina que el usuario abre): network-first.
//   Solo se usa el cache como fallback si de verdad no hay red, y ese fallback
//   es una pagina offline dedicada (nunca una copia vieja de una ficha de
//   propiedad con precio/estado potencialmente desactualizado).
// - Imagenes, CSS y JS estatico propio: stale-while-revalidate. Esto SI es
//   seguro de cachear porque no cambia el precio ni la disponibilidad de nada.
// - Cualquier llamada a la API (/api/...) se deja pasar directo a la red sin
//   interceptar.

const CACHE_VERSION = 'inmuhub-v1';
const STATIC_CACHE = CACHE_VERSION + '-static';
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/assets/icon-192.png',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .catch(() => {}) // si falla el precache no se rompe la instalacion
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

  // Nunca interceptar llamadas a la API del worker (datos siempre en vivo).
  if (url.pathname.startsWith('/api/')) return;

  // Navegaciones: red primero, offline.html solo si no hay conexion real.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Imagenes (incluye fotos de ImageKit) y assets estaticos propios:
  // stale-while-revalidate - responde rapido desde cache si existe, y en
  // paralelo actualiza el cache en segundo plano para la proxima visita.
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
  // Todo lo demas (fuentes de terceros, scripts de CDN, etc.) pasa directo a la red.
});
