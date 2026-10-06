// Enlaces limpios para compartir propiedades de inmuhub.
// Cada propiedad recibe:
//   cleanPath  -> /casas/zona-16/kanajuyu   (legible, para colegas y clientes)
//   shortCode  -> k7q2                       (inmuhub.com/p/k7q2, para WhatsApp)
//                                            (red.inmuhub.com/k7q2, version para colegas)
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
// Nombres de paginas del sitio que un codigo corto nunca debe tapar (red.inmuhub.com/<codigo>)
const RESERVED = new Set(['blog','mapa','tipos','zonas','sw','index','planes','mercado','asesores','dashboard','favoritos','offline','assets','herramientas','propiedades','casas','fincas','terrenos','p']);
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
    while (usedCodes.has(code) || RESERVED.has(code)) code = hashCode(p.id, ++len);
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
    lines.push(`/${p.shortCode}  ${target}  200`);
    lines.push(`/${p.shortCode.toUpperCase()}  ${target}  200`);
  });
  lines.push('');
  return lines.join('\n');
}

// Ficha equivalente en el portal nuevo de inmuhub.com (/propiedad/<slug>).
// Cuando existe, la ficha anterior le cede el canonical para que Google indexe
// una sola version de cada propiedad.
const PORTAL_ALIAS = {
  'elgin-zona13': 'zona13-elgin', 'socorro': 'elsocorro', 'sanjeronimo': 'san-jeronimo',
  'asuncionmita': 'asuncion-mita', 'kanajuyu': 'kanajuyu-16', 'haciendanueva': 'hacienda-nueva',
  'alcala': 'villas-alcala', 'santarosalia': 'santa-rosalia', 'alta-mar': 'chulamar',
  'carretera-a-olmeca-casa-en-venta-renta-para-uso-comercial': 'olmeca',
  'sancristobal': 'san-cristobal2', 'sancristobal-b7': 'san-cristobal',
  'finca-en-chimaltenango': 'finca-chimaltenango'
};

function fetchPortalSlugs() {
  return new Promise(resolve => {
    require('https').get('https://inmuhub.com/sitemap.xml', res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        const set = new Set();
        (d.match(/\/propiedad\/[a-z0-9-]+/gi) || []).forEach(m => set.add(m.split('/').pop()));
        resolve(set.size ? set : null);
      });
    }).on('error', () => resolve(null));
  });
}

function assignPortalCanonicals(props, portalSlugs, domain) {
  props.forEach(p => {
    const alias = PORTAL_ALIAS[p.slug];
    let target = null;
    if (portalSlugs) target = alias && portalSlugs.has(alias) ? alias : (portalSlugs.has(p.slug) ? p.slug : null);
    else target = alias || null; // sin conexion: solo los equivalentes ya confirmados
    p.portalUrl = target ? domain + '/propiedad/' + target : '';
  });
  return props;
}

module.exports = { assignCleanLinks, cleanLinkRedirects, fetchPortalSlugs, assignPortalCanonicals };
