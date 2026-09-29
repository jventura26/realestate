// Funciones puras de normalización. Las usa el importador y el Worker.

const ZONE_RULES = [
  [/\bzona\s*10\b/, 'zona-10'],
  [/\bzona\s*13\b/, 'zona-13'],
  [/\bzona\s*14\b/, 'zona-14'],
  [/\bzona\s*15\b|vista hermosa/, 'zona-15'],
  [/san crist[oó]bal/, 'san-cristobal'],
  [/carretera a el salvador|\b(ces|caes)\b|\bkm\.?\s*1\d/, 'carretera-el-salvador'],
];

const MUNICIPALITY_RULES = [
  [/fraijanes/, 'fraijanes'],
  [/santa catarina pinula/, 'santa-catarina-pinula'],
  [/san jos[eé] pinula/, 'san-jose-pinula'],
  [/milpas altas/, 'milpas-altas'],
  [/mixco/, 'mixco'],
  [/escuintla|puerto|chulamar|iztapa|monterrico/, 'puerto-san-jose'],
];

export function detectZone(text, municipality) {
  const t = ` ${String(text || '').toLowerCase()} `;
  if (/cayal/.test(t)) return 'cayala';
  if (/\bzona\s*16\b|kanajuy/.test(t)) return 'zona-16';
  for (const [re, slug] of ZONE_RULES) if (slug && re.test(t)) return slug;
  const m = ` ${String(municipality || '').toLowerCase()} `;
  for (const [re, slug] of MUNICIPALITY_RULES) if (re.test(m) || re.test(t)) return slug;
  if (/guatemala/.test(m)) return null; // ciudad sin zona identificable: queda para revisión
  return 'interior';
}

export function parseNumber(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number.isFinite(v) && v > 0 ? v : null;
  const s = String(v).replace(/,/g, '').match(/\d+(\.\d+)?/);
  if (!s) return null;
  const n = Number(s[0]);
  return n > 0 ? n : null;
}

export function parsePrice(raw, moneda) {
  const s = String(raw || '');
  const amount = parseNumber(s);
  const currency = /usd|\$/i.test(`${moneda || ''} ${s}`) ? 'USD' : 'GTQ';
  return { amount, currency };
}

export function mapType(t) {
  const s = String(t || '').toLowerCase();
  if (s.startsWith('casa')) return 'casa';
  if (s.startsWith('apart')) return 'apartamento';
  if (s.startsWith('terren') || s.startsWith('lote')) return 'terreno';
  if (s.startsWith('finca')) return 'finca';
  if (s.startsWith('local')) return 'local';
  if (s.startsWith('ofic')) return 'oficina';
  return 'otro';
}

export function mapOperation(o) {
  const s = String(o || '').toLowerCase();
  if (s.includes('venta') && s.includes('renta')) return 'venta_renta';
  if (s.includes('renta') || s.includes('alquiler')) return 'renta';
  return 'venta';
}

// Quita emojis y espacios repetidos: el portal usa un tono sobrio.
export function cleanText(s) {
  return String(s || '')
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n').map((l) => l.trim()).join('\n')
    .trim();
}

// "Zoraida Quintana 4769-2366" -> { name, whatsapp: '50247692366' }
export function splitAdvisor(asesor, waAsesor) {
  const s = String(asesor || '').trim();
  if (!s) return null;
  const digits = (String(waAsesor || '') || s).replace(/\D/g, '');
  const name = s.replace(/[\d\-+()\s]+$/, '').trim() || s;
  let whatsapp = null;
  if (digits.length === 8) whatsapp = '502' + digits;
  else if (digits.length === 11 && digits.startsWith('502')) whatsapp = digits;
  return { name, whatsapp };
}

export function normalizeWhatsapp(v) {
  const d = String(v || '').replace(/\D/g, '');
  if (d.length === 8) return '502' + d;
  if (d.length >= 10 && d.length <= 15) return d;
  return null;
}

// Percentil con interpolación lineal sobre un arreglo ya ordenado.
export function percentile(sorted, p) {
  if (!sorted.length) return null;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

// Rango de valor por m² de una zona: P25–P75 de las propiedades comparables.
export function zoneRange(pricesPerM2, minComparables) {
  const s = pricesPerM2.filter((n) => Number.isFinite(n) && n > 0).sort((a, b) => a - b);
  if (s.length < minComparables) return { enough: false, count: s.length };
  return {
    enough: true,
    count: s.length,
    low: percentile(s, 0.25),
    median: percentile(s, 0.5),
    high: percentile(s, 0.75),
    min: s[0],
    max: s[s.length - 1],
  };
}

// Dónde cae una propiedad frente al rango de su zona.
export function valuePosition(ppm2, range) {
  if (!range || !range.enough || !ppm2) return null;
  if (ppm2 < range.low) return 'bajo';
  if (ppm2 > range.high) return 'sobre';
  return 'en';
}
