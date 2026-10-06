// Lugares de referencia cerca de una propiedad (colegios, universidades, hospitales y centros comerciales)
// a partir de OpenStreetMap (Overpass). Se guarda en KV 30 días por zona aproximada para no consultar en cada visita.
import { distanceKm } from './traslados.js';

const TTL = 60 * 60 * 24 * 30;
const ENDPOINT = 'https://overpass-api.de/api/interpreter';
export const POI_GROUPS = [
  ['colegios', 'Colegios'],
  ['universidades', 'Universidades'],
  ['salud', 'Hospitales'],
  ['comercio', 'Centros comerciales'],
];

const keyFor = (pt) => `poi:v1:${pt.lat.toFixed(3)},${pt.lng.toFixed(3)}`;

function classify(tags) {
  if (tags.shop === 'mall') return 'comercio';
  if (tags.amenity === 'hospital') return 'salud';
  if (tags.amenity === 'university' || tags.amenity === 'college') return 'universidades';
  if (tags.amenity === 'school') return 'colegios';
  return null;
}

export async function cachedNearby(env, pt) {
  if (!env.MEDIA || !pt) return null;
  try {
    return await env.MEDIA.get(keyFor(pt), { type: 'json', cacheTtl: 3600 });
  } catch {
    return null;
  }
}

export async function refreshNearby(env, pt) {
  if (!env.MEDIA || !pt) return;
  // Marca temporal para no repetir la consulta mientras se resuelve (o si falla).
  await env.MEDIA.put(keyFor(pt), JSON.stringify({ groups: null }), { expirationTtl: 900 });
  const q = `[out:json][timeout:20];(
    nwr["amenity"~"^(school|university|college|hospital)$"]["name"](around:3500,${pt.lat},${pt.lng});
    nwr["shop"="mall"]["name"](around:5000,${pt.lat},${pt.lng});
  );out center 120;`;
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'inmuhub.com (portal inmobiliario)' },
    body: 'data=' + encodeURIComponent(q),
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const data = await res.json();
  const groups = {};
  const seen = new Set();
  for (const el of data.elements || []) {
    const tags = el.tags || {};
    const group = classify(tags);
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    const name = String(tags.name || '').trim();
    if (!group || !lat || !name || name.length > 70) continue;
    const k = group + '|' + name.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    (groups[group] ||= []).push({ name, km: Math.round(distanceKm(pt, { lat, lng }) * 10) / 10 });
  }
  for (const g of Object.keys(groups)) groups[g] = groups[g].sort((a, b) => a.km - b.km).slice(0, 3);
  await env.MEDIA.put(keyFor(pt), JSON.stringify({ at: new Date().toISOString().slice(0, 10), groups }), { expirationTtl: TTL });
}
