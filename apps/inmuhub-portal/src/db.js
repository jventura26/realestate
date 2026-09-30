// Acceso a D1. Toda consulta usa parámetros enlazados (nunca concatenación).

import { zoneRange, valuePosition } from './normalize.js';

const PUBLIC_COLUMNS = `p.id, p.slug, p.title, p.status, p.verified, p.operation, p.type, p.zone_slug, p.location_label,
  p.municipality, p.price_amount, p.currency, p.price_gtq, p.area_built_m2, p.area_land_v2, p.bedrooms, p.bathrooms,
  p.parking, p.levels, p.description, p.features, p.images, p.tour_url, p.video_url, p.lat, p.lng, p.featured_until,
  p.published_at, p.whatsapp_enabled, z.name AS zone_name, a.name AS agency_name, a.verified AS agency_verified,
  g.name AS agent_name, COALESCE(g.whatsapp, a.whatsapp) AS contact_whatsapp`;

const PUBLIC_FROM = `FROM properties p
  LEFT JOIN zones z ON z.slug = p.zone_slug
  LEFT JOIN agencies a ON a.id = p.agency_id
  LEFT JOIN agents g ON g.id = p.agent_id`;

// Métrica de valor según el tipo: m² de construcción o vara² de terreno.
export function metricFor(type) {
  return ['terreno', 'finca'].includes(type) ? 'land' : 'built';
}

function comparableGroup(type) {
  return metricFor(type) === 'land' ? ['terreno', 'finca'] : [type === 'apartamento' ? 'apartamento' : 'casa'];
}

export function pricePerUnit(p) {
  if (!p.price_gtq) return null;
  if (metricFor(p.type) === 'land') return p.area_land_v2 ? p.price_gtq / p.area_land_v2 : null;
  return p.area_built_m2 ? p.price_gtq / p.area_built_m2 : null;
}

export async function listZones(db) {
  const { results } = await db.prepare('SELECT slug, name, featured FROM zones ORDER BY sort_order').all();
  return results;
}

export async function getZone(db, slug) {
  return db.prepare('SELECT slug, name FROM zones WHERE slug = ?').bind(slug).first();
}

export async function listProperties(db, { zone, type, operation, maxPrice, limit = 24, offset = 0 } = {}) {
  const where = ["p.status = 'publicada'"];
  const binds = [];
  if (zone) { where.push('p.zone_slug = ?'); binds.push(zone); }
  if (type) { where.push('p.type = ?'); binds.push(type); }
  if (operation === 'venta') where.push("p.operation IN ('venta','venta_renta')");
  if (operation === 'renta') where.push("p.operation IN ('renta','venta_renta')");
  if (maxPrice) { where.push('p.price_gtq <= ?'); binds.push(maxPrice); }
  const sql = `SELECT ${PUBLIC_COLUMNS} ${PUBLIC_FROM} WHERE ${where.join(' AND ')}
    ORDER BY (p.featured_until IS NOT NULL AND p.featured_until > datetime('now')) DESC, p.verified DESC, p.published_at DESC
    LIMIT ? OFFSET ?`;
  const { results } = await db.prepare(sql).bind(...binds, limit, offset).all();
  const countRow = await db.prepare(`SELECT COUNT(*) AS n ${PUBLIC_FROM} WHERE ${where.join(' AND ')}`).bind(...binds).first();
  return { items: results, total: countRow?.n ?? 0 };
}

export async function featuredProperties(db, limit = 3) {
  const { results } = await db
    .prepare(`SELECT ${PUBLIC_COLUMNS} ${PUBLIC_FROM} WHERE p.status = 'publicada' AND p.images IS NOT NULL AND p.images != '[]'
      ORDER BY (p.featured_until IS NOT NULL AND p.featured_until > datetime('now')) DESC,
        (p.zone_slug IN (SELECT slug FROM zones WHERE featured = 1)) DESC, p.verified DESC, p.published_at DESC
      LIMIT ?`)
    .bind(limit)
    .all();
  return results;
}

export async function getPublicProperty(db, slug) {
  return db.prepare(`SELECT ${PUBLIC_COLUMNS} ${PUBLIC_FROM} WHERE p.slug = ? AND p.status = 'publicada'`).bind(slug).first();
}

// Rango de valor de una zona para un tipo de propiedad, calculado con el inventario publicado.
export async function zoneValue(db, zoneSlug, type, minComparables) {
  const group = comparableGroup(type);
  const metric = metricFor(type);
  const areaCol = metric === 'land' ? 'area_land_v2' : 'area_built_m2';
  const placeholders = group.map(() => '?').join(',');
  const { results } = await db
    .prepare(`SELECT price_gtq, ${areaCol} AS area FROM properties
      WHERE status = 'publicada' AND zone_slug = ? AND type IN (${placeholders})
        AND operation IN ('venta','venta_renta') AND price_gtq > 0 AND ${areaCol} > 0`)
    .bind(zoneSlug, ...group)
    .all();
  const perUnit = results.map((r) => r.price_gtq / r.area);
  const totals = results.map((r) => r.price_gtq).sort((a, b) => a - b);
  const range = zoneRange(perUnit, minComparables);
  return {
    ...range,
    metric,
    unit: metric === 'land' ? 'vara²' : 'm²',
    totalMin: totals[0] ?? null,
    totalMax: totals[totals.length - 1] ?? null,
  };
}

export async function propertyValueReading(db, p, minComparables) {
  if (!p.zone_slug) return null;
  const range = await zoneValue(db, p.zone_slug, p.type, minComparables);
  const ppu = pricePerUnit(p);
  return { range, ppu, position: valuePosition(ppu, range) };
}

export async function positionsFor(db, props, minComparables) {
  const cache = new Map();
  const out = new Map();
  for (const p of props) {
    if (!p.zone_slug) continue;
    const key = `${p.zone_slug}|${comparableGroup(p.type).join(',')}`;
    if (!cache.has(key)) cache.set(key, await zoneValue(db, p.zone_slug, p.type, minComparables));
    out.set(p.id, valuePosition(pricePerUnit(p), cache.get(key)));
  }
  return out;
}

export async function insertLead(db, lead) {
  const r = await db
    .prepare(`INSERT INTO leads (property_id, zone_slug, kind, name, whatsapp, intent, message, utm_source, utm_campaign, utm_content)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`)
    .bind(
      lead.property_id ?? null, lead.zone_slug ?? null, lead.kind, lead.name ?? null, lead.whatsapp,
      lead.intent ?? null, lead.message ?? null, lead.utm_source ?? null, lead.utm_campaign ?? null, lead.utm_content ?? null
    )
    .first();
  return r.id;
}

export async function markLeadSynced(db, id) {
  await db.prepare('UPDATE leads SET crm_synced = 1 WHERE id = ?').bind(id).run();
}

export async function insertSubmission(db, s) {
  const r = await db
    .prepare(`INSERT INTO properties (slug, title, status, operation, type, zone_slug, location_label, municipality,
        price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, description,
        owner_name, owner_whatsapp, owner_email, source, images, features)
      VALUES (?, ?, 'revision', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'portal', '[]', '[]') RETURNING id`)
    .bind(
      s.slug, s.title, s.operation, s.type, s.zone_slug, s.location_label, s.municipality, s.price_amount, s.currency,
      s.price_gtq, s.area_built_m2, s.area_land_v2, s.bedrooms, s.bathrooms, s.parking, s.description, s.owner_name,
      s.owner_whatsapp, s.owner_email
    )
    .first();
  return r.id;
}

// ---- Admin ----

export async function adminListProperties(db, status) {
  const { results } = await db
    .prepare(`SELECT p.*, z.name AS zone_name FROM properties p LEFT JOIN zones z ON z.slug = p.zone_slug
      WHERE (? IS NULL OR p.status = ?) ORDER BY CASE p.status WHEN 'revision' THEN 0 ELSE 1 END, p.updated_at DESC LIMIT 200`)
    .bind(status ?? null, status ?? null)
    .all();
  return results;
}

export async function adminRecentLeads(db, limit = 50) {
  const { results } = await db
    .prepare(`SELECT l.*, p.title AS property_title, p.slug AS property_slug FROM leads l
      LEFT JOIN properties p ON p.id = l.property_id ORDER BY l.created_at DESC LIMIT ?`)
    .bind(limit)
    .all();
  return results;
}

export async function adminCounts(db) {
  return db
    .prepare(`SELECT
      (SELECT COUNT(*) FROM properties WHERE status = 'revision') AS pendientes,
      (SELECT COUNT(*) FROM properties WHERE status = 'publicada') AS publicadas,
      (SELECT COUNT(*) FROM leads WHERE created_at > datetime('now','-7 days')) AS leads_7d,
      (SELECT COUNT(*) FROM leads) AS leads_total`)
    .first();
}

export async function adminUpdateProperty(db, id, action, fields = {}) {
  const now = "datetime('now')";
  switch (action) {
    case 'publicar':
      await db
        .prepare(`UPDATE properties SET status = 'publicada', published_at = COALESCE(published_at, ${now}),
          zone_slug = COALESCE(?, zone_slug), price_gtq = COALESCE(?, price_gtq), area_built_m2 = COALESCE(?, area_built_m2),
          review_notes = NULL, updated_at = ${now} WHERE id = ?`)
        .bind(fields.zone_slug ?? null, fields.price_gtq ?? null, fields.area_built_m2 ?? null, id)
        .run();
      return;
    case 'rechazar':
      await db.prepare(`UPDATE properties SET status = 'rechazada', review_notes = ?, updated_at = ${now} WHERE id = ?`)
        .bind(fields.review_notes ?? null, id).run();
      return;
    case 'pausar':
      await db.prepare(`UPDATE properties SET status = 'pausada', updated_at = ${now} WHERE id = ?`).bind(id).run();
      return;
    case 'verificar':
      await db.prepare(`UPDATE properties SET verified = 1 - verified, updated_at = ${now} WHERE id = ?`).bind(id).run();
      return;
    case 'destacar':
      await db.prepare(`UPDATE properties SET featured_until = datetime('now', '+7 days'), updated_at = ${now} WHERE id = ?`).bind(id).run();
      return;
    default:
      throw new Error('Acción no válida');
  }
}

// ---- Ajustes del sitio ----

export async function getSetting(db, key) {
  const r = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first();
  return r?.value ?? null;
}

export async function setSetting(db, key, value) {
  await db
    .prepare(`INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`)
    .bind(key, value)
    .run();
}

// ---- Edición en /admin ----

export async function adminGetProperty(db, id) {
  return db.prepare('SELECT * FROM properties WHERE id = ?').bind(id).first();
}

const EDITABLE = [
  'title', 'operation', 'type', 'zone_slug', 'location_label', 'municipality', 'price_amount', 'currency', 'price_gtq',
  'area_built_m2', 'area_land_v2', 'bedrooms', 'bathrooms', 'parking', 'levels', 'description', 'features', 'tour_url',
  'video_url', 'whatsapp_enabled', 'verified', 'slug',
];

export async function adminSaveProperty(db, id, fields) {
  const cols = EDITABLE.filter((c) => c in fields);
  if (!cols.length) return;
  await db
    .prepare(`UPDATE properties SET ${cols.map((c) => `${c} = ?`).join(', ')}, updated_at = datetime('now') WHERE id = ?`)
    .bind(...cols.map((c) => fields[c]), id)
    .run();
}

export async function adminSetImages(db, id, images) {
  await db.prepare(`UPDATE properties SET images = ?, updated_at = datetime('now') WHERE id = ?`).bind(JSON.stringify(images), id).run();
}

export async function adminCreateProperty(db, slug) {
  const r = await db
    .prepare(`INSERT INTO properties (slug, title, status, type, operation, source, images, features, whatsapp_enabled, agency_id)
      VALUES (?, 'Nueva propiedad', 'pausada', 'casa', 'venta', 'admin', '[]', '[]', 1,
        (SELECT id FROM agencies WHERE slug = 'zona-innmueble')) RETURNING id`)
    .bind(slug)
    .first();
  return r.id;
}
