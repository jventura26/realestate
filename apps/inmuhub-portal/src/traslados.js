// Tiempos de traslado a Zona 10 (Zona Viva) fuera de hora pico y en hora pico.
// Fuente, en este orden: tiempo medido por inmuhub (admin) → ubicación de la propiedad → centro de su zona.
// El pin exacto nunca sale en la página: los enlaces usan la colonia y la zona como origen.

const Z10 = { lat: 14.5995, lng: -90.5085 };

// Centro aproximado de cada zona y tolerancia en km para detectar pines mal cargados.
const CENTROIDS = {
  'zona-10': [14.600, -90.508, 4],
  'zona-13': [14.580, -90.530, 4],
  'zona-14': [14.585, -90.513, 4],
  'zona-15': [14.598, -90.490, 4],
  'zona-16': [14.612, -90.478, 5],
  cayala: [14.610, -90.488, 3],
  'carretera-el-salvador': [14.530, -90.450, 14],
  fraijanes: [14.465, -90.440, 10],
  'san-cristobal': [14.610, -90.590, 5],
  mixco: [14.630, -90.610, 9],
  'santa-catarina-pinula': [14.570, -90.480, 7],
  'san-jose-pinula': [14.545, -90.410, 8],
  'milpas-altas': [14.570, -90.680, 6],
};

function km(a, b) {
  const R = 6371;
  const toR = (x) => (x * Math.PI) / 180;
  const dLat = toR(b.lat - a.lat);
  const dLng = toR(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Guatemala está al oeste de Greenwich: corrige longitudes cargadas sin el signo.
export function cleanCoords(lat, lng) {
  let la = Number(lat);
  let ln = Number(lng);
  if (!la || !ln) return null;
  if (ln > 0) ln = -ln;
  if (la < 13 || la > 18.5 || ln < -92.5 || ln > -88) return null;
  return { lat: la, lng: ln };
}

// Acepta "14.59, -90.50" o un enlace de Google Maps (@lat,lng · q=lat,lng · !3dlat!4dlng).
export function parseCoords(text) {
  const t = String(text || '').trim();
  if (!t) return null;
  const pats = [/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, /@(-?\d+\.\d+),(-?\d+\.\d+)/, /[?&](?:q|query|ll|destination)=(-?\d+\.\d+)(?:,|%2C)\s*(-?\d+\.\d+)/i, /^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/];
  for (const re of pats) {
    const m = t.match(re);
    if (m) return cleanCoords(m[1], m[2]);
  }
  return null;
}

const r5 = (x) => Math.max(5, Math.round(x / 5) * 5);

export function commuteFor(p) {
  if (p.commute_valle_min || p.commute_pico_min) {
    return { measured: true, valle: p.commute_valle_min || null, pico: p.commute_pico_min || null, at: p.commute_measured_at || null };
  }
  const c = CENTROIDS[p.zone_slug];
  let point = cleanCoords(p.lat, p.lng);
  let source = 'ubicacion';
  if (point && c && km(point, { lat: c[0], lng: c[1] }) > c[2]) point = null; // pin fuera de su zona
  if (!point && c) {
    point = { lat: c[0], lng: c[1] };
    source = 'zona';
  }
  if (!point) return null;
  const straight = km(Z10, point);
  if (straight > 45) return { far: true, km: Math.round((straight * 1.6) / 5) * 5 };
  const road = Math.max(straight * 1.45, 1.5);
  return {
    source,
    km: Math.max(1, Math.round(road)),
    valle: [r5((road / 38) * 60 + 4), r5((road / 30) * 60 + 6)],
    pico: [r5((road / 20) * 60 + 6), r5((road / 14) * 60 + 10)],
  };
}

export function mapsLink(p) {
  const origin = [p.location_label, p.zone_name, 'Guatemala'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent('Zona Viva, Zona 10, Guatemala')}&travelmode=driving`;
}

// Punto aproximado para el mapa público: nunca el pin exacto.
// Se desplaza de forma estable (según el id) hasta ~250 m y se dibuja como un círculo.
export function approxPoint(p) {
  const c = CENTROIDS[p.zone_slug];
  let point = cleanCoords(p.lat, p.lng);
  let fromZone = false;
  if (point && c && km(point, { lat: c[0], lng: c[1] }) > c[2]) point = null;
  if (!point && c) {
    point = { lat: c[0], lng: c[1] };
    fromZone = true;
  }
  if (!point) return null;
  let h = 2166136261;
  for (const ch of String(p.id || p.slug || '')) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const angle = ((h % 360) * Math.PI) / 180;
  const dist = fromZone ? 0 : 0.0012 + ((h >>> 9) % 1000) / 1000 * 0.0011; // ~130–250 m en grados
  const round = (x) => Math.round(x * 10000) / 10000;
  return {
    lat: round(point.lat + Math.sin(angle) * dist),
    lng: round(point.lng + Math.cos(angle) * dist),
    radius: fromZone ? 1500 : 600,
    fromZone,
  };
}

export function distanceKm(a, b) {
  return km(a, b);
}
