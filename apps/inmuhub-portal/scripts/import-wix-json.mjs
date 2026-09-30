#!/usr/bin/env node
// Convierte data/propiedades.json (inventario del sitio anterior) en SQL para D1.
// Solo sirvió para la carga inicial: desde ahora las propiedades se administran en /admin (Cloudflare D1).
//
// Solo copia campos públicos en una lista blanca. Nunca exporta precioReal,
// contactoVendedor, notasInternas, estadoLegal ni otros campos internos.
//
// Uso: node scripts/import-wix-json.mjs ../../data/propiedades.json > migrations/0003_seed_inventario.sql

import { readFileSync } from 'node:fs';
import { detectZone, parsePrice, parseNumber, mapType, mapOperation, cleanText } from '../src/normalize.js';

const file = process.argv[2];
if (!file) {
  console.error('Uso: node scripts/import-wix-json.mjs <ruta a propiedades.json>');
  process.exit(1);
}

const USD_TO_GTQ = Number(process.env.USD_TO_GTQ || 7.7);
const rows = JSON.parse(readFileSync(file, 'utf8'));
const q = (v) => (v === null || v === undefined || v === '' || Number.isNaN(v) ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);

const out = [];
const warnings = [];
out.push('-- Generado por scripts/import-wix-json.mjs — inventario inicial de Zona-INNmueble');
out.push("INSERT OR IGNORE INTO agencies (name, slug, plan, verified) VALUES ('Zona-INNmueble', 'zona-innmueble', 'agencia_pro', 1);");

const agents = new Map();
const props = [];

for (const p of rows) {
  if (p.estado && String(p.estado).toLowerCase() !== 'activa') continue;

  const type = mapType(p.tipo);
  const { amount, currency } = parsePrice(p.precio, p.moneda);
  const areaBuilt = parseNumber(p.area) || parseNumber(p.areaConst);
  const zone = detectZone([p.titulo, p.zona, p.ubicacionGeneral].join(' '), p.municipio);
  const images = Array.isArray(p.gallery) && p.gallery.length ? p.gallery : [p.mainImage || p.imagen].filter(Boolean);
  const features = Array.isArray(p.caracteristicas)
    ? p.caracteristicas
    : String(p.caracteristicas || '').split(/[,\n|]/).map((s) => s.trim()).filter(Boolean);

  // Los asesores que vienen en el archivo de origen no se importan: todas las consultas
  // de estas propiedades van a Zona-INNmueble (ver migración 0004).
  const advisor = null;

  if (!amount) warnings.push(`${p.slug}: sin precio`);
  if (!areaBuilt && ['casa', 'apartamento'].includes(type)) warnings.push(`${p.slug}: sin área de construcción (no entra en el cálculo de valor por zona)`);

  props.push({
    slug: p.slug,
    title: cleanText(p.titulo),
    operation: mapOperation(p.operacion || p.cinta),
    type,
    zone_slug: zone,
    location_label: cleanText(p.ubicacionGeneral || ''),
    municipality: cleanText(p.municipio || ''),
    price_amount: amount,
    currency,
    price_gtq: amount ? Math.round(currency === 'USD' ? amount * USD_TO_GTQ : amount) : null,
    area_built_m2: areaBuilt,
    area_land_v2: parseNumber(p.areaV2) || parseNumber(p.terreno),
    bedrooms: parseNumber(p.habitaciones),
    bathrooms: parseNumber(p.banos),
    parking: parseNumber(p.parqueos),
    levels: parseNumber(p.niveles),
    description: cleanText(p.descripcion || p.descCorta || ''),
    features: JSON.stringify(features.map(cleanText).filter(Boolean).slice(0, 20)),
    images: JSON.stringify(images),
    tour_url: p.videoTour || null,
    video_url: p.videoUrl || null,
    lat: parseNumber(p.lat),
    lng: parseNumber(p.lng),
    advisor: advisor ? advisor.name : null,
    source_ref: p.id,
  });
}

for (const a of agents.values()) {
  out.push(`INSERT INTO agents (agency_id, name, whatsapp) SELECT id, ${q(a.name)}, ${q(a.whatsapp)} FROM agencies WHERE slug = 'zona-innmueble';`);
}

for (const r of props) {
  const agentSql = r.advisor ? `(SELECT id FROM agents WHERE name = ${q(r.advisor)} LIMIT 1)` : 'NULL';
  out.push(
    `INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES (` +
      [
        q(r.slug), q(r.title), "'publicada'", 0, q(r.operation), q(r.type), q(r.zone_slug), q(r.location_label), q(r.municipality),
        q(r.price_amount), q(r.currency), q(r.price_gtq), q(r.area_built_m2), q(r.area_land_v2), q(r.bedrooms), q(r.bathrooms),
        q(r.parking), q(r.levels), q(r.description), q(r.features), q(r.images), q(r.tour_url), q(r.video_url), q(r.lat), q(r.lng),
        "(SELECT id FROM agencies WHERE slug = 'zona-innmueble')", agentSql, "'import-wix'", q(r.source_ref), "datetime('now')",
      ].join(', ') +
      ');'
  );
}

process.stdout.write(out.join('\n') + '\n');
console.error(`Importadas ${props.length} propiedades, ${agents.size} asesor(es).`);
for (const w of warnings) console.error('  aviso: ' + w);
