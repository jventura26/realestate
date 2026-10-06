// Búsquedas guardadas y avisos de propiedades nuevas que coinciden.
// Al publicarse una propiedad se buscan coincidencias; la persona las ve en "Mi cuenta",
// le llega un correo si hay RESEND_API_KEY y el admin puede enviarlas por WhatsApp desde /admin/alertas.
import { formatMoney, TYPE_LABELS } from './html.js';

export async function saveSearch(db, accountId, f) {
  const existing = await db
    .prepare(`SELECT id FROM saved_searches WHERE account_id = ? AND active = 1 AND IFNULL(zone_slug,'') = ? AND IFNULL(type,'') = ?
      AND IFNULL(operation,'') = ? AND IFNULL(budget_usd,0) = ?`)
    .bind(accountId, f.zone || '', f.type || '', f.operation || '', f.budget || 0)
    .first();
  if (existing) return existing.id;
  const count = await db.prepare('SELECT COUNT(*) AS n FROM saved_searches WHERE account_id = ? AND active = 1').bind(accountId).first();
  if ((count?.n || 0) >= 10) return null;
  const r = await db
    .prepare(`INSERT INTO saved_searches (account_id, zone_slug, type, operation, budget_usd, max_price_gtq) VALUES (?, ?, ?, ?, ?, ?) RETURNING id`)
    .bind(accountId, f.zone || null, f.type || null, f.operation || null, f.budget || null, f.maxPrice || null)
    .first();
  return r.id;
}

export async function accountSearches(db, accountId) {
  const { results } = await db
    .prepare(`SELECT s.*, z.name AS zone_name FROM saved_searches s LEFT JOIN zones z ON z.slug = s.zone_slug
      WHERE s.account_id = ? AND s.active = 1 ORDER BY s.created_at DESC`)
    .bind(accountId)
    .all();
  return results;
}

export async function deleteSearch(db, accountId, id) {
  await db.prepare('UPDATE saved_searches SET active = 0 WHERE id = ? AND account_id = ?').bind(id, accountId).run();
}

export async function accountMatches(db, accountId) {
  const { results } = await db
    .prepare(`SELECT m.search_id, m.created_at, m.seen_at, p.slug, p.title, p.price_amount, p.currency, z.name AS zone_name
      FROM search_matches m JOIN saved_searches s ON s.id = m.search_id JOIN properties p ON p.id = m.property_id
      LEFT JOIN zones z ON z.slug = p.zone_slug
      WHERE s.account_id = ? AND p.status = 'publicada' AND m.created_at > datetime('now', '-60 days')
      ORDER BY m.created_at DESC LIMIT 20`)
    .bind(accountId)
    .all();
  return results;
}

export async function markMatchesSeen(db, accountId) {
  await db
    .prepare(`UPDATE search_matches SET seen_at = datetime('now') WHERE seen_at IS NULL
      AND search_id IN (SELECT id FROM saved_searches WHERE account_id = ?)`)
    .bind(accountId)
    .run();
}

export function searchLabel(s) {
  const type = s.type ? `${TYPE_LABELS[s.type] || s.type}s` : 'Propiedades';
  const op = s.operation === 'renta' ? 'en renta' : s.operation === 'venta' ? 'en venta' : '';
  const zone = s.zone_name ? `en ${s.zone_name}` : 'en todas las zonas';
  const budget = s.budget_usd ? `hasta US$ ${Number(s.budget_usd).toLocaleString('en-US')}` : '';
  return [type, op, zone, budget].filter(Boolean).join(' ');
}

export function searchUrl(s) {
  const q = new URLSearchParams(Object.entries({ zona: s.zone_slug, tipo: s.type, op: s.operation, hasta: s.budget_usd }).filter(([, v]) => v));
  return '/propiedades' + (q.toString() ? '?' + q : '');
}

// Busca las búsquedas guardadas que coinciden con una propiedad recién publicada.
export async function processAlerts(env, propertyId, { sendEmail } = {}) {
  const db = env.DB;
  const p = await db
    .prepare(`SELECT p.id, p.slug, p.title, p.type, p.operation, p.zone_slug, p.price_gtq, p.price_amount, p.currency, p.account_id,
        z.name AS zone_name FROM properties p LEFT JOIN zones z ON z.slug = p.zone_slug WHERE p.id = ? AND p.status = 'publicada'`)
    .bind(propertyId)
    .first();
  if (!p) return 0;
  const ops = p.operation === 'venta_renta' ? ['venta', 'renta'] : [p.operation];
  const { results: searches } = await db
    .prepare(`SELECT s.id, s.account_id, a.email, a.name FROM saved_searches s JOIN accounts a ON a.id = s.account_id
      WHERE s.active = 1 AND a.status != 'suspendida'
        AND (s.zone_slug IS NULL OR s.zone_slug = ?)
        AND (s.type IS NULL OR s.type = ?)
        AND (s.operation IS NULL OR s.operation IN (${ops.map(() => '?').join(',')}))
        AND (s.max_price_gtq IS NULL OR ? <= s.max_price_gtq)
        AND (? IS NULL OR s.account_id != ?)`)
    .bind(p.zone_slug, p.type, ...ops, p.price_gtq ?? 0, p.account_id ?? null, p.account_id ?? null)
    .all();
  let created = 0;
  const notified = new Set();
  for (const s of searches) {
    const r = await db.prepare('INSERT OR IGNORE INTO search_matches (search_id, property_id) VALUES (?, ?)').bind(s.id, p.id).run();
    if (!r.meta?.changes) continue;
    created++;
    if (sendEmail && !notified.has(s.account_id)) {
      notified.add(s.account_id);
      const ok = await sendEmail(s, p).catch(() => false);
      if (ok) await db.prepare("UPDATE search_matches SET emailed_at = datetime('now') WHERE search_id = ? AND property_id = ?").bind(s.id, p.id).run();
    }
  }
  return created;
}

export async function pendingWhatsappAlerts(db) {
  const { results } = await db
    .prepare(`SELECT m.search_id, m.property_id, m.created_at, m.emailed_at, a.name, a.whatsapp, p.slug, p.title, p.price_amount, p.currency,
        z.name AS zone_name
      FROM search_matches m JOIN saved_searches s ON s.id = m.search_id JOIN accounts a ON a.id = s.account_id
      JOIN properties p ON p.id = m.property_id LEFT JOIN zones z ON z.slug = p.zone_slug
      WHERE m.sent_wa_at IS NULL AND m.seen_at IS NULL AND p.status = 'publicada' AND a.whatsapp IS NOT NULL
        AND m.created_at > datetime('now', '-30 days')
      ORDER BY m.created_at DESC LIMIT 100`)
    .all();
  return results;
}

export async function markWhatsappSent(db, searchId, propertyId) {
  await db.prepare("UPDATE search_matches SET sent_wa_at = datetime('now') WHERE search_id = ? AND property_id = ?").bind(searchId, propertyId).run();
}

export function priceText(p) {
  return formatMoney(p.price_amount, p.currency);
}
