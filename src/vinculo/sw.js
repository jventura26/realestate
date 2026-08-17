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

const CACHE_VERSION = 'inmuhub-v2';
const STATIC_CACHE = CACHE_VERSION + '-static';
// Cloudflare Pages redirige TODO archivo .html a su URL "limpia" sin
// extension (ej. /offline.html -> /offline con 308) - es el comportamiento
// por defecto de Pages en todo el sitio, no algo particular de este archivo.
// Los service workers no pueden guardar en cache una respuesta que vino de
// una redireccion durante la instalacion (falla silenciosamente), asi que
// aqui hay que usar la URL final ya redirigida, no la original con .html.
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/assets/icon-192.png',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      // cache.add() individual en vez de cache.addAll(): si UN asset falla
      // (ej. por quedar detras de una redireccion no prevista), los demas
      // igual se guardan. addAll() es todo-o-nada y hubiera dejado el
      // precache entero vacio por un solo fallo.
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
