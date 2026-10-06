// Enlaces limpios para compartir propiedades de inmuhub.
// Cada propiedad recibe:
//   cleanPath  -> /casas/zona-16/kanajuyu   (legible, para colegas y clientes)
//   shortCode  -> k7q2                       (inmuhub.com/p/k7q2, para WhatsApp)
// Ambos se sirven como reescritura (200) hacia /propiedades/<slug>, asi la
// barra del navegador conserva el enlace limpio.
const fs = require('fs');
const path = require('path');

const OVERRIDES = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'enlaces.json'), 'utf-8')); }
  catch (e) { return {}; }
})();

const TIPOS = { casa: 'casas', apartamento: 'apartamentos', terreno: 'terrenos', finca: 'fincas',
  local: 'locales', oficina: 'oficinas', bodega: 'bodegas', edificio: 'edificios' };
const ALPHA = '23456789abcdefghjkmnpqrstuvwxyz'; // sin 0/o, 1/l/i para que se pueda dictar

function slugify(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function autoPath(p) {
  const t = TIPOS[slugify(p.tipo).split('-')[0]] || 'propiedades';
  const hay = [p.zona, p.titulo].join(' ');
  const z = hay.match(/zona\s*(\d{1,2})/i);
  let lugar;
  if (z) lugar = 'zona-' + z[1];
  else if (/carretera a el salvador|caes/i.test(hay)) lugar = 'carretera-a-el-salvador';
  else lugar = slugify(p.municipio && p.municipio !== 'Guatemala' ? p.municipio : (p.zona || 'guatemala'));
  const nombre = slugify(String(p.titulo || p.slug || p.id).split('|')[0]) || slugify(p.slug);
  return '/' + t + '/' + (lugar || 'guatemala') + '/' + nombre;
}

function hashCode(id, len) {
  // FNV-1a de 32 bits sobre el id: el codigo de una propiedad nunca cambia.
  let h = 0x811c9dc5;
  const s = String(id);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  let out = '';
  for (let i = 0; i < len; i++) { out += ALPHA[h % ALPHA.length]; h = Math.floor(h / ALPHA.length) || (h ^ 0x9e3779b9) >>> 0; }
  return out;
}

function assignCleanLinks(props, domain) {
  const usedPaths = new Set();
  const usedCodes = new Set();
  // Orden por id: una propiedad nueva nunca le quita el enlace a una anterior.
  const ordered = props.slice().sort((a, b) => String(a.id).localeCompare(String(b.id), 'en', { numeric: true }));
  ordered.forEach(p => {
    let cp = OVERRIDES[String(p.id)] || autoPath(p);
    if (usedPaths.has(cp)) { let n = 2; while (usedPaths.has(cp + '-' + n)) n++; cp = cp + '-' + n; }
    usedPaths.add(cp);
    let len = 4, code = hashCode(p.id, len);
    while (usedCodes.has(code)) code = hashCode(p.id, ++len);
    usedCodes.add(code);
    p.cleanPath = cp;
    p.shortCode = code;
    p.cleanUrl = domain + cp;
    p.shortUrl = domain + '/p/' + code;
  });
  return props;
}

function cleanLinkRedirects(props) {
  const lines = ['', '# Enlaces limpios (reescritura, el navegador conserva la URL limpia)'];
  props.forEach(p => {
    if (!p.cleanPath || !p.slug) return;
    const target = '/propiedades/' + p.slug;
    lines.push(`${p.cleanPath}  ${target}  200`);
    lines.push(`/p/${p.shortCode}  ${target}  200`);
    lines.push(`/p/${p.shortCode.toUpperCase()}  ${target}  200`);
  });
  lines.push('');
  return lines.join('\n');
}

module.exports = { assignCleanLinks, cleanLinkRedirects };
