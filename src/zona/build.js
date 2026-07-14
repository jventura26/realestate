const fs   = require('fs');
const https = require('https');

function fetchKV() {
  return new Promise((resolve) => {
    https.get('https://zona-inmu.tours-virtuales-gt.workers.dev/api/public/propiedades', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const props = JSON.parse(data);
          if (Array.isArray(props) && props.length > 0) {
            resolve(props);
          } else {
            resolve(null);
          }
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}


function cleanArea(area) {
  if (!area) return '';
  // Quitar apostrofes, guiones solos, ceros solos
  const s = String(area).trim();
  if (s === '0' || s === "'-" || s === "'--" || s === "'---" || s === "0 v²" || s === "0 m²" || s === "0v²") return '';
  // Quitar el apostrofe inicial
  return s.replace(/^'+/, '').trim();
}
function normalizeKV(kvProps) {
  return kvProps.map(p => {
    const rawPrice = p.precio || '';
    // Quitar prefijo de moneda ANTES de extraer dígitos.
    // Bug anterior: "Q.1,440,000" → el punto de "Q." quedaba → ".1440000" → parseFloat = 0.144
    const rawPriceStripped = rawPrice
      .replace(/^\s*Q\.?\s*/i, '')
      .replace(/^\s*GTQ\s*/i, '')
      .replace(/^\s*\$\s*/, '')
      .replace(/^\s*USD\s*/i, '');
    const parsedNum = rawPriceStripped
      ? parseFloat(rawPriceStripped.replace(/,/g, '').replace(/[^0-9.]/g, ''))
      : NaN;
    const safeNum = isNaN(parsedNum) ? 0 : parsedNum;
    return ({
    ...p,
    title: p.titulo || p.title || '',
    description: p.descripcion || p.description || '',
    priceFormatted: p.priceFormatted || (function(){
      if (!rawPrice) return '';
      const isUSD = rawPrice.includes('$') || rawPrice.toUpperCase().includes('USD');
      const isQ = rawPrice.startsWith('Q') || rawPrice.toUpperCase().startsWith('Q ');
      if (isNaN(parsedNum)) return rawPrice;
      const fmt = parsedNum.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0});
      if (isUSD) return '$' + fmt;
      if (isQ) return 'Q ' + fmt;
      return rawPrice;
    })(),
    // IMPORTANTE: priceNumeric se calcula del texto en `precio` porque el admin nunca
    // envía un priceNumeric explícito. Si en el futuro el admin lo calculara y lo guardara,
    // p.priceNumeric tendría prioridad aquí (fue la causa real de que los filtros de precio
    // y el ordenamiento por precio mostraran 0 resultados en producción).
    priceNumeric: (p.priceNumeric && p.priceNumeric > 0) ? p.priceNumeric : safeNum,
    locationFull: p.locationFull || p.zona || '',
    mainImage: p.mainImage || p.imagen || '',
    mainImageThumb: p.mainImageThumb || p.imagen || '',
    gallery: p.gallery && p.gallery.length ? p.gallery : (p.imagen ? [p.imagen] : []),
    slug: p.slug || (p.titulo||'').toLowerCase().replace(/[^a-z0-9]+/g,'-'),
    amenities: p.amenities || [],
    estado: p.estado || 'Activa',
    area: cleanArea(p.area || p.areaConst || ''),
    areaConst: cleanArea(p.areaConst || p.area || ''),
  });
  });
}

const path = require('path');
const { parseProperties }  = require('../shared/parse-csv');
const { generateSitemap, generateRobots, generateRedirects } = require('../shared/utils');
const { indexPage, catalogPage, detailPage, zonaPage, zonaSlug, zonasIndexPage, tipoPage } = require('./templates/pages');
const { sharePage } = require('./templates/share-page');

const DOMAIN = 'https://zona-innmueble.com';
const CSV    = path.resolve(__dirname, '../../data/propiedades.csv');
const OUT    = path.resolve(__dirname, '../../dist/zona');
const PROPS  = path.join(OUT, 'propiedades');

function write(p, c) { fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,c,'utf-8'); }
function copyAssets() {
  const dstDir = path.join(OUT, 'assets');
  fs.mkdirSync(dstDir, { recursive: true });

  // Copiar desde public/assets (logo, icon)
  const publicDir = path.join(__dirname, '../../public/assets');
  const fileMappings = {
    'InmuHub sin fondo 1_1.png': 'logo.png',
    'InmuHub Ícono.png': 'icon.png'
  };
  if (fs.existsSync(publicDir)) {
    Object.entries(fileMappings).forEach(([src, dst]) => {
      const srcPath = path.join(publicDir, src);
      const dstPath = path.join(dstDir, dst);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, dstPath);
      }
    });
  }

  // Copiar favicon desde src/zona/assets
  const zonaFaviconSrc = path.join(__dirname, 'assets/favicon.png');
  const zonaFaviconDst = path.join(dstDir, 'favicon.png');
  if (fs.existsSync(zonaFaviconSrc)) {
    fs.copyFileSync(zonaFaviconSrc, zonaFaviconDst);
  }

  // Copiar images/ si existe
  const imagesDir = path.join(__dirname, 'assets/images');
  const dstImagesDir = path.join(dstDir, 'images');
  if (fs.existsSync(imagesDir)) {
    fs.cpSync(imagesDir, dstImagesDir, { recursive: true });
  }

  // Copiar zona-fase1.js (Sort, Area filter, Lightbox, Mobile CTA)
  const fase1Src = path.join(__dirname, 'assets/zona-fase1.js');
  if (fs.existsSync(fase1Src)) {
    fs.copyFileSync(fase1Src, path.join(dstDir, 'zona-fase1.js'));
  }
}

console.log('\n⚡  Building Zona INNmueble…\n');

fetchKV().then(kvData => {
let allProps = kvData ? normalizeKV(kvData) : parseProperties(CSV);
// Filter: only props assigned to Zona + Activa
allProps = allProps.filter(p => {
  if (p.estado && p.estado !== 'Activa') return false;
  if (p.sitios && Array.isArray(p.sitios) && !p.sitios.includes('zona')) return false;
  return true;
});
// Sort: destacadas first
allProps.sort((a, b) => (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0));
const props = allProps;
console.log(`   ✔  ${props.length} propiedades ${kvData ? 'desde KV' : 'desde CSV'}`);


fs.rmSync(OUT, { recursive:true, force:true });
fs.mkdirSync(PROPS, { recursive:true });

copyAssets();  console.log('   ✔  assets copiados');

write(path.join(OUT,'index.html'),        indexPage(props));   console.log('   ✔  index.html');
write(path.join(OUT,'propiedades.html'),  catalogPage(props)); console.log('   ✔  propiedades.html');

// Copiar FAQ y About
const faqSrc = path.join(__dirname, 'faq.html');
// Copiar dynamic-grid.js
const dynGridSrc = path.join(__dirname, 'assets', 'dynamic-grid.js');
if(fs.existsSync(dynGridSrc)) {
  fs.copyFileSync(dynGridSrc, path.join(OUT, 'dynamic-grid.js'));
  console.log('   ✔  dynamic-grid.js');
}

// 404
const src404 = path.join(__dirname, '404.html');
if(fs.existsSync(src404)) {
  fs.copyFileSync(src404, path.join(OUT, '404.html'));
  console.log('   ✔  404.html');
}

const aboutSrc = path.join(__dirname, 'about.html');
const blogSrc = path.join(__dirname, 'blog.html');

// Todos los artículos de blog que deben copiarse al output.
// IMPORTANTE: cada artículo nuevo que se cree en src/zona/ debe agregarse aquí,
// o el build lo dejará fuera silenciosamente (fue la causa de un 404 real en producción).
const blogArticles = [
  'guia-inversion-real-estate-2026.html',
  'zona-10-vs-zona-14.html',
  'senales-alerta-comprar-propiedad.html',
  'futuro-real-estate-guatemala-2030.html',
  'maximizar-roi-propiedades-alquiler.html',
  'cuanto-cuesta-casa-fraijanes-2026.html',
  'como-comprar-finca-guatemala.html',
  'mejores-zonas-vivir-guatemala.html',
  'proceso-comprar-casa-guatemala.html',
  'precios-casas-zona-10-guatemala.html',
];

const adminSrc = path.join(__dirname, 'admin.html');
if(fs.existsSync(adminSrc)) {
  fs.copyFileSync(adminSrc, path.join(OUT, 'admin.html'));
  console.log('   ✔  admin.html');
}
if(fs.existsSync(faqSrc)) {
  fs.copyFileSync(faqSrc, path.join(OUT, 'faq.html'));
  console.log('   ✔  faq.html');
}
if(fs.existsSync(aboutSrc)) {
  fs.copyFileSync(aboutSrc, path.join(OUT, 'about.html'));
  console.log('   ✔  about.html');
}
if(fs.existsSync(blogSrc)) {
  fs.copyFileSync(blogSrc, path.join(OUT, 'blog.html'));
  console.log('   ✔  blog.html');
}

// ── Landing Page para Meta Ads campaigns ────────────────────────────
const lpSrc = path.join(__dirname, 'lp.html');
if(fs.existsSync(lpSrc)) {
  fs.copyFileSync(lpSrc, path.join(OUT, 'lp.html'));
  console.log('   ✔  lp.html (landing page Meta Ads)');
}
// ── Thank You page (conversion tracking) ───────────────────────────
const graciasSrc = path.join(__dirname, 'gracias.html');
if(fs.existsSync(graciasSrc)) {
  fs.copyFileSync(graciasSrc, path.join(OUT, 'gracias.html'));
  console.log('   ✔  gracias.html');
}
// ── NUEVO: Política de Privacidad ────────────────────────────────────
const privacidadSrc = path.join(__dirname, 'privacidad.html');
if(fs.existsSync(privacidadSrc)) {
  fs.copyFileSync(privacidadSrc, path.join(OUT, 'privacidad.html'));
  console.log('   ✔  privacidad.html');
} else {
  console.warn('   ⚠️  privacidad.html no encontrado en src/zona/ — agrégalo para Meta Ads compliance');
}
// ─────────────────────────────────────────────────────────────────────

blogArticles.forEach(filename => {
  const srcFile = path.join(__dirname, filename);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, path.join(OUT, filename));
    console.log('   ✔  ' + filename);
  } else {
    console.warn('   ⚠️  Artículo listado pero NO encontrado: ' + filename);
  }
});

props.forEach(p => write(path.join(PROPS,`${p.slug}.html`), detailPage(p, props)));
console.log(`   ✔  ${props.length} detail pages`);

// Generar paginas de zona /zonas/*.html
const ZONAS = path.join(OUT, 'zonas');
fs.mkdirSync(ZONAS, { recursive: true });
const zonasMap = {};
props.forEach(p => {
  const z = p.municipio || p.zona || '';
  if (!z) return;
  const slug = zonaSlug(z);
  if (!zonasMap[slug]) zonasMap[slug] = { nombre: z, props: [] };
  if (!p.estado || p.estado === 'Activa') zonasMap[slug].props.push(p);
});
Object.values(zonasMap).forEach(({ nombre, props: propsZona }) => {
  const slug = zonaSlug(nombre);
  write(path.join(ZONAS, `${slug}.html`), zonaPage(nombre, propsZona, props));
  console.log(`   ✔  zona: ${nombre} (${propsZona.length} props) → /zonas/${slug}.html`);
});
console.log(`   ✔  ${Object.keys(zonasMap).length} zona pages`);

// FASE 3: Zonas editoriales premium
var ZONAS_PREMIUM = ['zona-10','zona-14','zona-15','zona-16','carretera-el-salvador'];
ZONAS_PREMIUM.forEach(function(slug) {
  if (!zonasMap[slug]) {
    var propsZona = props.filter(function(p) {
      return zonaSlug(p.municipio || "") === slug;
    });
    write(path.join(ZONAS, slug + ".html"), zonaPage(slug, propsZona, props));
    console.log("   zone editorial: /zonas/" + slug + ".html");
  }
});
// Generar landing pages por tipo /tipos/*.html
var TIPOS_DIR = path.join(OUT, 'tipos');
fs.mkdirSync(TIPOS_DIR, { recursive: true });
var tiposUnicos = [...new Set(props.map(function(p){ return p.tipo; }).filter(Boolean))];
tiposUnicos.forEach(function(tipo) {
  var tipoSlug = tipo.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  write(path.join(TIPOS_DIR, tipoSlug + '.html'), tipoPage(tipo, props, props));
  console.log('   tipo: /tipos/' + tipoSlug + '.html (' + props.filter(function(p){ return p.tipo === tipo; }).length + ' props)');
});
console.log('   ' + tiposUnicos.length + ' tipo pages');

// Generar paginas compartibles /share/*.html - rebuild 2026-06-16
const SHARE = path.join(OUT, 'share');
fs.mkdirSync(SHARE, { recursive: true });
props.forEach(p => write(path.join(SHARE, `${p.slug}.html`), sharePage(p)));
console.log(`   ✔  ${props.length} share pages`);

// Copiar páginas hiperlocales estáticas de src/zona/zonas/ (solo si no existen ya)
var staticZonasDir = path.join(__dirname, 'zonas');
if (fs.existsSync(staticZonasDir)) {
  fs.readdirSync(staticZonasDir).forEach(function(file) {
    if (!file.endsWith('.html')) return;
    var dest = path.join(ZONAS, file);
    fs.copyFileSync(path.join(staticZonasDir, file), dest);
    console.log('   ✔  zona hiperlocal (override): /zonas/' + file);
  });
}

// FASE 3: Zonas index
write(path.join(ZONAS, 'index.html'), zonasIndexPage(zonasMap));
console.log('   zone index: /zonas/index.html');
const urls = [
  { loc:'/',                 priority:'1.0', changefreq:'weekly' },
  { loc:'/propiedades.html', priority:'0.9', changefreq:'daily'  },
  { loc:'/blog.html',        priority:'0.8', changefreq:'weekly' },
  { loc:'/about.html',       priority:'0.6', changefreq:'monthly', lastmod:'2026-06-19' },
  { loc:'/faq.html',         priority:'0.6', changefreq:'monthly', lastmod:'2026-06-10' },
  { loc:'/privacidad.html',  priority:'0.3', changefreq:'yearly',  lastmod:'2026-06-21' },
  { loc:'/cuanto-cuesta-casa-fraijanes-2026.html',   priority:'0.8', changefreq:'monthly', lastmod:'2026-06-19' },
  { loc:'/como-comprar-finca-guatemala.html',         priority:'0.8', changefreq:'monthly', lastmod:'2026-06-19' },
  { loc:'/mejores-zonas-vivir-guatemala.html',        priority:'0.8', changefreq:'monthly', lastmod:'2026-06-19' },
  { loc:'/proceso-comprar-casa-guatemala.html',       priority:'0.8', changefreq:'monthly', lastmod:'2026-06-19' },
  { loc:'/precios-casas-zona-10-guatemala.html',      priority:'0.8', changefreq:'monthly', lastmod:'2026-06-19' },
  { loc:'/guia-inversion-real-estate-2026.html',      priority:'0.7', changefreq:'monthly', lastmod:'2026-06-10' },
  { loc:'/zona-10-vs-zona-14.html',                   priority:'0.7', changefreq:'monthly', lastmod:'2026-06-10' },
  { loc:'/senales-alerta-comprar-propiedad.html',     priority:'0.7', changefreq:'monthly', lastmod:'2026-06-10' },
  { loc:'/futuro-real-estate-guatemala-2030.html',    priority:'0.7', changefreq:'monthly', lastmod:'2026-06-10' },
  { loc:'/maximizar-roi-propiedades-alquiler.html',   priority:'0.7', changefreq:'monthly', lastmod:'2026-06-10' },
  ...props.map(p=>({
    loc:`/propiedades/${p.slug}.html`, priority:'0.8', changefreq:'weekly',
    lastmod: (p.fechaPublicacion || p.createdAt || '').toString().substring(0,10) || new Date().toISOString().substring(0,10)
  })),
  ...Object.keys(zonasMap).map(slug=>({ loc:`/zonas/${slug}.html`, priority:'0.7', changefreq:'weekly', lastmod: new Date().toISOString().substring(0,10) })),
  { loc:'/zonas/cayala.html', priority:'0.8', changefreq:'monthly', lastmod: new Date().toISOString().substring(0,10) },
  { loc:'/zonas/fraijanes.html', priority:'0.8', changefreq:'monthly', lastmod: new Date().toISOString().substring(0,10) },
  { loc:'/zonas/carretera-el-salvador.html', priority:'0.8', changefreq:'monthly', lastmod: new Date().toISOString().substring(0,10) },
  ...tiposUnicos.map(function(t){ var s = t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); return { loc:'/tipos/'+s+'.html', priority:'0.8', changefreq:'weekly', lastmod: new Date().toISOString().substring(0,10) }; }),
];
write(path.join(OUT,'sitemap.xml'),  generateSitemap(DOMAIN, urls)); console.log('   ✔  sitemap.xml');
write(path.join(OUT,'robots.txt'),   generateRobots(DOMAIN));        console.log('   ✔  robots.txt');
write(path.join(OUT,'google24850a801f739dec.html'), 'google-site-verification: google24850a801f739dec.html\n'); console.log('   ✔  google verification');

console.log('\n✅  Build completo!\n');

}).catch(function(err){
  console.error('Build failed:', err);
  process.exit(1);
});
