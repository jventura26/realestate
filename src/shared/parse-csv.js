/**
 * parse-csv.js — Wix CMS CSV parser (production)
 *
 * Handles the actual Wix export format:
 * - Wix image URIs  → static.wixstatic.com CDN URLs
 * - Wix Gallery JSON → array of CDN URLs
 * - Wix rich-text JSON → clean plain text
 * - Price strings (Q. 1,440,000 / $590,000) → normalized
 * - Slug from Propiedades (Item) field
 * - Published filter from last Status column
 */

const fs   = require('fs');
const { parse } = require('csv-parse/sync');

// ── Wix image URI → CDN URL ──────────────────────────────────────────
// Input:  wix:image://v1/71b3d1_cbfbac~mv2.jpeg/14.jpeg#originWidth=…
// Output: https://static.wixstatic.com/media/71b3d1_cbfbac~mv2.jpeg
function wixImageUrl(wixUri, width = 800) {
  if (!wixUri) return '';
  if (wixUri.startsWith('http')) return wixUri;
  const m = wixUri.match(/wix:image:\/\/v1\/([^/]+)/);
  if (!m) return '';
  // Simple CDN URL - works on external domains (confirmed working)
  return `https://static.wixstatic.com/media/${m[1]}`;
}

// Keep original hash for gallery full-size
function wixImageUrlFull(wixUri) {
  if (!wixUri) return '';
  if (wixUri.startsWith('http')) return wixUri;
  const m = wixUri.match(/wix:image:\/\/v1\/([^/]+)/);
  if (!m) return '';
  return `https://static.wixstatic.com/media/${m[1]}`;
}

// ── Wix Gallery JSON → URL array ─────────────────────────────────────
function parseGallery(galleryStr) {
  if (!galleryStr || galleryStr.trim() === '') return [];
  try {
    const items = JSON.parse(galleryStr);
    return items
      .map(item => wixImageUrlFull(item.src || ''))
      .filter(Boolean);
  } catch (_) {
    return [];
  }
}

// ── Wix rich-text JSON → plain text ──────────────────────────────────
function extractText(jsonStr) {
  if (!jsonStr || jsonStr.trim() === '') return '';
  try {
    const doc = JSON.parse(jsonStr);
    const parts = [];
    function walk(nodes) {
      if (!Array.isArray(nodes)) return;
      for (const n of nodes) {
        if (n.type === 'TEXT') {
          const t = (n.textData?.text || '').trim();
          if (t) parts.push(t);
        }
        if (n.nodes?.length) walk(n.nodes);
      }
    }
    walk(doc.nodes || []);
    // Clean emojis and excess whitespace
    return parts.join(' ')
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .substring(0, 1200);
  } catch (_) {
    return String(jsonStr).substring(0, 400);
  }
}

// ── Slug from Wix item path ───────────────────────────────────────────
// Input:  /propiedades-1/hacienda-nueva-1
// Output: hacienda-nueva-1
function extractSlug(itemPath, title) {
  if (itemPath) {
    const cleaned = itemPath
      .replace(/\/propiedades-1\//g, '')
      .replace(/\/propiedades\//g,   '')
      .replace(/^\/+|\/+$/g, '')
      .trim();
    if (cleaned) return cleaned;
  }
  // Fallback: generate from title
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

// ── Price formatting ──────────────────────────────────────────────────
function formatPrice(priceStr) {
  if (!priceStr || priceStr.trim() === "") return "Consultar";
  return priceStr.trim();
}

function priceNumeric(priceStr) {
  if (!priceStr) return 0;
  // Remover TODO excepto números (comas y puntos son separadores, no los queremos)
  const num = String(priceStr).replace(/[^0-9]/g, '');
  return parseInt(num) || 0;
}

// ── Area cleaning ─────────────────────────────────────────────────────
function cleanArea(raw) {
  if (!raw) return '';
  const s = raw.replace(/'/g, '').trim();
  // Remove garbage values
  if (s === '- m²' || s === '--- m²' || s === '0 v²' || s === '0 m²' || s === '0') return '';
  // Normalize v² → m²
  return s.replace(/v²/g, 'm²').replace(/\s+/g, ' ');
}

// ── Parking normalization ─────────────────────────────────────────────
function cleanParking(raw) {
  if (!raw) return '';
  const s = String(raw).trim().toLowerCase();
  if (s === 'si' || s === 'sí' || s === 'yes') return 'Sí';
  if (s === 'no') return 'No';
  if (!isNaN(parseInt(s)) && parseInt(s) > 0) return s;
  return s || '';
}

// ── Published check ───────────────────────────────────────────────────
function isPublished(row) {
  // Wix CSV has Status in multiple columns — last one is most reliable
  const vals = Object.values(row);
  return vals.some(v => String(v).trim().toUpperCase() === 'PUBLISHED');
}

// ── Main parser ───────────────────────────────────────────────────────
function parseProperties(csvPath) {
  const raw = fs.readFileSync(csvPath, 'utf-8');

  const records = parse(raw, {
    columns:           true,
    skip_empty_lines:  true,
    trim:              true,
    bom:               true,
    relax_column_count: true,
  });

  const properties = [];

  for (const row of records) {
    if (!isPublished(row)) continue;

    const title       = (row['Titulo'] || '').trim();
    if (!title) continue;

    const itemPath    = row['Propiedades (Item)'] || '';
    const slug        = extractSlug(itemPath, title);
    const description = extractText(row['Description'] || '');
    const mainImageRaw= row['Imagen'] || '';
    const mainImage   = wixImageUrl(mainImageRaw, 1200);
    const mainImageThumb = wixImageUrl(mainImageRaw, 600);
    const gallery     = parseGallery(row['Gallery'] || '');

    // Prefer gallery for images; add mainImage if not already in gallery
    const allImages   = gallery.length > 0 ? gallery : (mainImage ? [mainImage] : []);

    const precio      = (row['Precio'] || '').trim();
    const tipo        = (row['Tipo de propiedad'] || 'Casa').trim();
    const cinta       = (row['Cinta'] || '').trim();          // Venta / Renta / Nueva / Usada
    const estado      = (row['Estado'] || '').trim();         // Condición del inmueble
    const municipio   = (row['Municipio'] || '').trim();
    const departamento= (row['Departamento'] || '').trim();
    const lugar       = (row['Lugar'] || '').trim();

    const habitaciones= (row['Numero de Dormitorios'] || row['Dormitorios'] || '').trim();
    const banos       = (row['Numero de Baños']       || row['Baños']       || '').trim();
    const parqueos    = cleanParking(row['Garaje'] || '');
    const areaConst   = cleanArea(row['Area de Construccion'] || '');
    const terreno     = cleanArea(row['Tamaño del Terreno'] || row['Tamaño de la Propiedad'] || '');
    const codigo      = (row['Codigo Inmueble'] || '').trim();
    const jardin      = (row['Jardin']  || '').toLowerCase().trim();
    const terraza     = (row['Terraza'] || '').toLowerCase().trim();

    const locationFull = [municipio, departamento].filter(Boolean).join(', ');

    // Build amenities from boolean fields
    const amenities = [];
    if (jardin  === 'si' || jardin  === 'sí') amenities.push('Jardín');
    if (terraza === 'si' || terraza === 'sí') amenities.push('Terraza');
    if (parqueos && parqueos !== 'No')        amenities.push(`Garaje`);

    // Old Wix URL for redirect generation
    const wixPath = itemPath; // e.g. /propiedades-1/hacienda-nueva-1

    properties.push({
      title,
      slug,
      description,
      mainImage,
      mainImageThumb,
      gallery:     allImages,
      precio,
      priceFormatted: formatPrice(precio),
      priceNumeric:   priceNumeric(precio),
      tipo,
      cinta,       // badge on card
      estado,
      municipio,
      departamento,
      lugar,
      locationFull,
      habitaciones,
      banos,
      parqueos,
      areaConst,
      terreno,
      amenities,
      codigo,
      wixPath,
    });
  }

  return properties;
}

module.exports = { parseProperties, wixImageUrl };
