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

  /**
 * parse-csv.js — Wix CMS CSV parser
 *
 * Handles:
 * - Wix image URIs → static.wixstatic.com URLs
 * - Wix Gallery JSON → image arrays
 * - Wix rich text JSON → plain text
 * - Published filtering
 * - Slugs from old Wix URLs
 */

const fs = require('fs');
const { parse } = require('csv-parse/sync');

// ─────────────────────────────────────────────
// Wix image URI → CDN URL
// ─────────────────────────────────────────────
function wixImageUrl(wixUri, width = 1200) {
  if (!wixUri) return '';

  const value = String(wixUri).trim();
  if (!value) return '';

  if (value.startsWith('http')) return value;

  const match = value.match(/wix:image:\/\/v1\/([^/]+)/);
  if (!match) return '';

  return `https://static.wixstatic.com/media/${match[1]}`;
}
function wixImageUrlFull(wixUri) {
  return wixImageUrl(wixUri);
}

  const value = String(wixUri).trim();

  if (!value) return '';

  if (value.startsWith('http')) return value;

  const match = value.match(/wix:image:\/\/v1\/([^/]+)/);

  if (!match) return '';

  return `https://static.wixstatic.com/media/${match[1]}`;
}

// ─────────────────────────────────────────────
// Gallery parser
// ─────────────────────────────────────────────
function parseGallery(galleryStr) {
  if (!galleryStr) return [];

  const value = String(galleryStr).trim();

  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed
        .map(item => {
          if (typeof item === 'string') return wixImageUrlFull(item);
          return wixImageUrlFull(item.src || item.url || item.image || '');
        })
        .filter(Boolean);
    }

    return [];
  } catch (_) {
    return value
      .split(/[,|;]/)
      .map(v => wixImageUrlFull(v.trim()))
      .filter(Boolean);
  }
}

// ─────────────────────────────────────────────
// Rich text JSON → plain text
// ─────────────────────────────────────────────
function extractText(value) {
  if (!value) return '';

  const raw = String(value).trim();

  if (!raw) return '';

  try {
    const doc = JSON.parse(raw);
    const parts = [];

    function walk(nodes) {
      if (!Array.isArray(nodes)) return;

      for (const node of nodes) {
        if (node.type === 'TEXT') {
          const text = node.textData?.text || '';
          if (text.trim()) parts.push(text.trim());
        }

        if (node.nodes) walk(node.nodes);
      }
    }

    walk(doc.nodes || []);

    return parts
      .join(' ')
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .substring(0, 1500);
  } catch (_) {
    return raw
      .replace(/\s{2,}/g, ' ')
      .trim()
      .substring(0, 1500);
  }
}

// ─────────────────────────────────────────────
// Slug
// ─────────────────────────────────────────────
function extractSlug(itemPath, title) {
  if (itemPath) {
    const cleaned = String(itemPath)
      .replace('/propiedades-1/items/', '')
      .replace('/propiedades-1/', '')
      .replace('/propiedades/', '')
      .replace(/^\/+|\/+$/g, '')
      .trim();

    if (cleaned) return cleaned;
  }

  return String(title || 'propiedad')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

// ─────────────────────────────────────────────
// Cleaning helpers
// ─────────────────────────────────────────────
function formatPrice(priceStr) {
  if (!priceStr) return 'Consultar';

  const value = String(priceStr).trim();

  if (!value) return 'Consultar';

  return value;
}

function priceNumeric(priceStr) {
  if (!priceStr) return 0;

  const value = String(priceStr).replace(/[^0-9.]/g, '');

  return parseFloat(value) || 0;
}

function cleanArea(raw) {
  if (!raw) return '';

  const value = String(raw)
    .replace(/'/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (
    !value ||
    value === '- m²' ||
    value === '--- m²' ||
    value === '0 v²' ||
    value === '0 m²' ||
    value === '0'
  ) {
    return '';
  }

  return value.replace(/v²/g, 'm²');
}

function cleanParking(raw) {
  if (!raw) return '';

  const value = String(raw).trim();

  if (!value) return '';

  const lower = value.toLowerCase();

  if (lower === 'si' || lower === 'sí' || lower === 'yes') return 'Sí';
  if (lower === 'no') return 'No';

  return value;
}

function isYes(value) {
  const lower = String(value || '').trim().toLowerCase();
  return lower === 'si' || lower === 'sí' || lower === 'yes';
}

function isPublished(row) {
  const values = Object.values(row).map(v =>
    String(v || '').trim().toUpperCase()
  );

  return values.includes('PUBLISHED');
}

function firstValue(row, keys) {
  for (const key of keys) {
    const value = row[key];

    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }

  return '';
}

function uniqueArray(values) {
  return [...new Set(values.filter(Boolean))];
}

// ─────────────────────────────────────────────
// Main parser
// ─────────────────────────────────────────────
function parseProperties(csvPath) {
  const raw = fs.readFileSync(csvPath, 'utf-8');

  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true,
  });

  const properties = [];

  for (const row of records) {
    if (!isPublished(row)) continue;

    const title = firstValue(row, ['Titulo', 'Titulo Descricion']);
    if (!title) continue;

    const itemPath = firstValue(row, [
      'Propiedades (Item)',
      'Link-copy-2-of-properties-all',
      'Link_Privado',
    ]);

    const slug = extractSlug(itemPath, title);

    const description = extractText(
      firstValue(row, ['Description', 'Descripcion', 'Titulo Descricion'])
    );

    // Images
   const imageFields = [
  firstValue(row, ['Imagen']),
  firstValue(row, ['Imagen-1']),
  firstValue(row, ['Imagen-2']),
].filter(Boolean);

    const galleryImages = parseGallery(firstValue(row, ['Gallery']));

    const allImages = uniqueArray([
      ...imageFields.map(img => wixImageUrlFull(img)),
      ...galleryImages,
    ]);

    const mainImageRaw =
  firstValue(row, ['Imagen-1']) ||
  imageFields[0] ||
  allImages[0] ||
  '';

const mainImage = wixImageUrlFull(mainImageRaw);

const mainImageThumb = mainImage;

    const finalGallery = uniqueArray([
      mainImage,
      ...allImages,
    ]);

    // Property data
    const precio = firstValue(row, ['Precio']);

    const tipo = firstValue(row, ['Tipo de propiedad']) || 'Propiedad';

    const cinta = firstValue(row, ['Cinta']);

    const estado = firstValue(row, [
      'Estado',
      'Condicion de la Propiedad',
      'Status',
      'Status-1',
    ]);

    const municipio = firstValue(row, ['Municipio']);
    const departamento = firstValue(row, ['Departamento']);
    const lugar = firstValue(row, ['Lugar']);

    const habitaciones = firstValue(row, [
      'Numero de Dormitorios',
      'Dormitorios',
    ]);

    const banos = firstValue(row, [
      'Numero de Baños',
      'Baños',
    ]);

    const parqueos = cleanParking(firstValue(row, ['Garaje']));

    const areaConst = cleanArea(
      firstValue(row, [
        'Area de Construccion',
        'Area de Construccion-1',
        'Tamaño de la Propiedad',
      ])
    );

    const terreno = cleanArea(
      firstValue(row, [
        'Tamaño del Terreno',
        'Tamaño',
      ])
    );

    const codigo = firstValue(row, ['Codigo Inmueble', 'ID']);

    const locationFull = [municipio, departamento]
      .filter(Boolean)
      .join(', ');

    const amenities = [];

    if (isYes(row['Jardin'])) amenities.push('Jardín');
    if (isYes(row['Terraza'])) amenities.push('Terraza');
    if (parqueos && parqueos !== 'No') amenities.push('Garaje');

    properties.push({
      title,
      slug,
      description,

      mainImage,
      mainImageThumb,
      gallery: finalGallery,

      precio,
      priceFormatted: formatPrice(precio),
      priceNumeric: priceNumeric(precio),

      tipo,
      cinta,
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
      wixPath: itemPath,
    });
  }

  return properties;
}

module.exports = {
  parseProperties,
  wixImageUrl,
  wixImageUrlFull,
};
