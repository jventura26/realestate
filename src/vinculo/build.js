const fs = require('fs');
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
  return kvProps.map(p => ({
    ...p,
    title: p.titulo || p.title || '',
    description: p.descripcion || p.description || '',
    priceFormatted: p.priceFormatted || p.precio || '',
    priceNumeric: p.priceNumeric || 0,
    locationFull: p.locationFull || p.zona || '',
    mainImage: p.mainImage || p.imagen || '',
    mainImageThumb: p.mainImageThumb || p.imagen || '',
    gallery: p.gallery && p.gallery.length ? p.gallery : (p.imagen ? [p.imagen] : []),
    slug: p.slug || (p.titulo||'').toLowerCase().replace(/[^a-z0-9]+/g,'-'),
    amenities: p.amenities || [],
    estado: p.estado || 'Activa',
    area: cleanArea(p.area || p.areaConst || ''),
    areaConst: cleanArea(p.areaConst || p.area || ''),
    areaV2: cleanArea(p.areaV2 || ''),
  }));
}

const path = require('path');
const { parseProperties } = require('../shared/parse-csv');
const { generateSitemap, generateRobots, generateRedirects } = require('../shared/utils');
const { catalogPage, detailPage, zonaPage } = require('./templates/pages');
const { indexPageNew: indexPage } = require('./templates/index-page-new');

const DOMAIN = 'https://inmuhub.com';
const CSV = path.resolve(__dirname, '../../data/propiedades.csv');
const OUT = path.resolve(__dirname, '../../dist/vinculo');
const PROPS = path.join(OUT, 'propiedades');
const ZONAS = path.join(OUT, 'zonas');

function write(p, c) { fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,c,'utf-8'); }
function slugZona(z) { return z.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function copyAssets() {
  const dstDir = path.join(OUT, 'assets');
  fs.mkdirSync(dstDir, { recursive: true });
  
  // Copiar favicon desde src/vinculo/assets
  const faviconSrc = path.join(__dirname, 'assets/favicon.png');
  const faviconDst = path.join(dstDir, 'favicon.png');
  if (fs.existsSync(faviconSrc)) {
    fs.copyFileSync(faviconSrc, faviconDst);
  }
  
  // Copiar logo desde src/vinculo/assets
  const logoSrc = path.join(__dirname, 'assets/logo.png');
  const logoDst = path.join(dstDir, 'logo.png');
  if (fs.existsSync(logoSrc)) {
    fs.copyFileSync(logoSrc, logoDst);
  }
}

console.log('\n Building INMUHUB.COM\n');
((() => {
  try {
    const jp = path.join(__dirname, '../../data/propiedades.json');
    if (fs.existsSync(jp)) {
      const local = JSON.parse(fs.readFileSync(jp, 'utf8'));
      if (Array.isArray(local) && local.length > 0) {
        console.log(' Cargando ' + local.length + ' propiedades desde JSON local');
        return Promise.resolve(local);
      }
    }
  } catch(e) { console.log(' JSON local no disponible, usando API...'); }
  return fetchKV();
})()).then(kvData => {
let allProps = kvData ? normalizeKV(kvData) : parseProperties(CSV);
// Filter: only props assigned to InmuHub + Activa
allProps = allProps.filter(p => {
  if (p.estado && p.estado !== 'Activa') return false;
  if (p.sitios && Array.isArray(p.sitios) && !p.sitios.includes('inmu')) return false;
  return true;
});
// Sort: destacadas first
allProps.sort((a, b) => (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0));
const props = allProps;
console.log(` ${props.length} propiedades ${kvData ? 'desde KV' : 'desde CSV'}`);


fs.rmSync(OUT, { recursive:true, force:true });
fs.mkdirSync(PROPS, { recursive:true });
fs.mkdirSync(ZONAS, { recursive:true });

write(path.join(OUT,'index.html'), indexPage(props)); console.log(' ✨ index.html (PÁGINA MEJORADA)');
write(path.join(OUT,'propiedades.html'), catalogPage(props)); console.log(' propiedades.html');

props.forEach(p => write(path.join(PROPS,`${p.slug}.html`), detailPage(p, props)));
console.log(` ${props.length} detail pages`);

const zonas = [...new Set(props.map(p => p.municipio).filter(Boolean))];
zonas.forEach(zona => {
  const zonaProps = props.filter(p => p.municipio === zona);
  if (zonaProps.length === 0) return;
  const slug = slugZona(zona);
  write(path.join(ZONAS, `${slug}.html`), zonaPage(zonaProps, zona));
  console.log(` zona: ${zona} (${zonaProps.length} props) → /zonas/${slug}.html`);
});
console.log(` ${zonas.length} zona pages`);

const zonaUrls = zonas.map(z => ({ loc: `/zonas/${slugZona(z)}.html`, priority:'0.85', changefreq:'weekly' }));

const urls = [
  { loc:'/', priority:'1.0', changefreq:'weekly' },
  { loc:'/propiedades.html', priority:'0.9', changefreq:'daily' },
  { loc:'/herramientas/calculadora-hipotecaria.html', priority:'0.85', changefreq:'monthly' },
  { loc:'/herramientas/valuador.html', priority:'0.85', changefreq:'monthly' },
  { loc:'/herramientas/guia-compra.html', priority:'0.85', changefreq:'monthly' },
  ...zonaUrls,
  ...props.map(p=>({ loc:`/propiedades/${p.slug}.html`, priority:'0.8', changefreq:'weekly' })),
];
write(path.join(OUT,'sitemap.xml'), generateSitemap(DOMAIN, urls)); console.log(' sitemap.xml');
// 404
const src404 = require('path').join(__dirname, '404.html');
if(fs.existsSync(src404)){fs.copyFileSync(src404, require('path').join(OUT,'404.html'));console.log(' 404.html');}

write(path.join(OUT,'robots.txt'), generateRobots(DOMAIN)); console.log(' robots.txt');
write(path.join(OUT,'_redirects'), generateRedirects(props, DOMAIN)); console.log(' _redirects');

// Generar páginas de herramientas DENTRO del then para que no las borre rmSync
const { mortgageCalculatorPage } = require('./templates/mortgage-calculator-page');
const { simuladorInversionPage } = require('./templates/simulador-page');
const { valuacionPage } = require('./templates/valuacion-page');
const { guiaCompraPae } = require('./templates/guia-compra-page');
const { dashboardInversionistasPage } = require('./templates/dashboard-inversionistas-page');
const HERRAMIENTAS = path.join(OUT, 'herramientas');
fs.mkdirSync(HERRAMIENTAS, { recursive: true });

write(path.join(HERRAMIENTAS, 'calculadora-hipotecaria.html'), mortgageCalculatorPage()); 
console.log(' herramientas: calculadora-hipotecaria.html ✅');

write(path.join(HERRAMIENTAS, 'valuador.html'), valuacionPage()); 
console.log(' herramientas: valuador.html ✅');

write(path.join(HERRAMIENTAS, 'guia-compra.html'), guiaCompraPae()); 
console.log(' herramientas: guia-compra.html ✅');

write(path.join(HERRAMIENTAS, 'simulador-inversion.html'), simuladorInversionPage()); 
console.log(' herramientas: simulador-inversion.html ✅');

write(path.join(HERRAMIENTAS, 'dashboard-inversionistas.html'), dashboardInversionistasPage());
console.log(' herramientas: dashboard-inversionistas.html ✅');

console.log(`\n INMUHUB.COM built: ${props.length} propiedades + ${zonas.length} páginas de zona\n`);
console.log('\n✨ INMUHUB.COM BUILD COMPLETE\n');
console.log(' Página Principal: MEJORADA CON 3 TOOLS DESTACADOS');
console.log(' Herramientas: Todas con Meta Tags + Schema Markup\n');

// Copiar assets
copyAssets(); console.log(' Assets copiados (favicon, logo)\n');

// Copiar planes.html (página estática de membresía para asesores)
const planesSrc = path.join(__dirname, 'planes.html');
if (fs.existsSync(planesSrc)) {
  fs.copyFileSync(planesSrc, path.join(OUT, 'planes.html'));
  console.log(' planes.html copiado ✅');
} else {
  console.warn(' [WARN] planes.html no encontrado en src/vinculo/');
}

}).catch(e => { console.error('Build error:', e); process.exit(1); });
