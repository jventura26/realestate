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

function fetchBrokers() {
  return new Promise((resolve) => {
    https.get('https://zona-inmu.tours-virtuales-gt.workers.dev/api/public/brokers', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const brokers = JSON.parse(data);
          if (Array.isArray(brokers)) { resolve(brokers); } else { resolve([]); }
        } catch(e) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}


function cleanArea(area) {
  if (!area) return '';
  const s = String(area).trim();
  if (s === '0' || s === "'-" || s === "'--" || s === "'---" || s === "0 v²" || s === "0 m²" || s === "0v²") return '';
  return s.replace(/^'+/, '').trim();
}
function normalizeKV(kvProps) {
  return kvProps.map(p => ({
    ...p,
    title: p.titulo || p.title || '',
    description: p.descripcion || p.description || '',
    priceFormatted: p.priceFormatted || p.precio || '',
    priceNumeric: p.priceNumeric || parseFloat(String(p.precio || '0').replace(/^[^0-9]+/, '').replace(/,/g, '')) || 0,
    locationFull: p.locationFull || p.zona || '',
    mainImage: p.mainImage || p.imagen || '',
    mainImageThumb: p.mainImageThumb || p.imagen || '',
    gallery: p.gallery && p.gallery.length ? p.gallery : (p.imagen ? [p.imagen] : []),
    slug: p.slug || (p.titulo||'').toLowerCase().replace(/[^a-z0-9]+/g,'-'),
    amenities: p.amenities || [],
    estado: p.estado || 'Activa',
    createdAt: p.createdAt || null,
    area: cleanArea(p.area || p.areaConst || ''),
    areaConst: cleanArea(p.areaConst || p.area || ''),
    areaV2: cleanArea(p.areaV2 || ''),
  }));
}

const path = require('path');
const { parseProperties } = require('../shared/parse-csv');
const { generateSitemap, generateRobots, generateRedirects } = require('../shared/utils');
const { catalogPage, detailPage, zonaPage, tipoPage } = require('./templates/pages');
const { layout } = require('./templates/layout');
const { indexPageNew: indexPage } = require('./templates/index-page-new');
const { brokerProfilePage, brokersDirectoryPage } = require('./templates/broker-pages');

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

  const faviconSrc = path.join(__dirname, 'assets/favicon.png');
  const faviconDst = path.join(dstDir, 'favicon.png');
  if (fs.existsSync(faviconSrc)) {
    fs.copyFileSync(faviconSrc, faviconDst);
  }

  const logoSrc = path.join(__dirname, 'assets/logo.png');
  const logoDst = path.join(dstDir, 'logo.png');
  if (fs.existsSync(logoSrc)) {
    fs.copyFileSync(logoSrc, logoDst);
  }

  // Copiar vinculo-fase1.js (Sort, Area filter, Lightbox)
  const fase1Src = path.join(__dirname, 'assets/vinculo-fase1.js');
  if (fs.existsSync(fase1Src)) {
    fs.copyFileSync(fase1Src, path.join(dstDir, 'vinculo-fase1.js'));
  }
}

console.log('\n Building INMUHUB.COM\n');
Promise.all([fetchKV(), fetchBrokers()]).then(([kvData, brokersData]) => {
const brokers = brokersData || [];
let allProps = kvData ? normalizeKV(kvData) : parseProperties(CSV);
allProps = allProps.filter(p => {
  if (p.estado && p.estado !== 'Activa') return false;
  if (p.sitios && Array.isArray(p.sitios) && !p.sitios.includes('inmu')) return false;
  return true;
});
allProps.sort((a, b) => (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0));
const props = allProps;
console.log(` ${props.length} propiedades ${kvData ? 'desde KV' : 'desde CSV'}`);


try { fs.rmSync(OUT, { recursive:true, force:true }); } catch(e) { console.log('  (rmSync skipped: ' + e.code + ')'); }
fs.mkdirSync(PROPS, { recursive:true });
fs.mkdirSync(ZONAS, { recursive:true });

var homeBrokers = (brokersData || []).filter(function(b){ return b.activo !== false && b.estado === 'aprobado'; });
write(path.join(OUT,'index.html'), indexPage(props, homeBrokers)); console.log(' index.html');
write(path.join(OUT,'propiedades.html'), catalogPage(props)); console.log(' propiedades.html');

props.forEach(p => write(path.join(PROPS,`${p.slug}.html`), detailPage(p, props)));
console.log(` ${props.length} detail pages`);

const zonas = [...new Set(props.map(p => p.municipio).filter(Boolean))];
zonas.forEach(zona => {
  const zonaProps = props.filter(p => p.municipio === zona);
  if (zonaProps.length === 0) return;
  const slug = slugZona(zona);
  write(path.join(ZONAS, `${slug}.html`), zonaPage(zonaProps, zona));
  console.log(` zona: ${zona} (${zonaProps.length} props)`);
});
console.log(` ${zonas.length} zona pages`);

// Generar landing pages por tipo /tipos/*.html
var TIPOS_DIR = path.join(OUT, 'tipos');
fs.mkdirSync(TIPOS_DIR, { recursive: true });
var tiposUnicos = [...new Set(props.map(function(p){ return p.tipo; }).filter(Boolean))];
tiposUnicos.forEach(function(tipo) {
  var tipoSlug = tipo.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  write(path.join(TIPOS_DIR, tipoSlug + '.html'), tipoPage(tipo, props));
  console.log(' tipo: /tipos/' + tipoSlug + '.html');
});
console.log(' ' + tiposUnicos.length + ' tipo pages');

// Broker pages
const ASESORES = path.join(OUT, 'asesores');
fs.mkdirSync(ASESORES, { recursive: true });
// Calcular propiedades_count ANTES de generar directorio y perfiles
brokers.forEach(function(b) {
  b.propiedades_count = props.filter(function(p){ return p.broker_id === b.id; }).length;
});
var activeBrokers = brokers.filter(function(b){ return b.activo !== false && b.estado === 'aprobado'; });
write(path.join(OUT, 'asesores.html'), brokersDirectoryPage(activeBrokers));
console.log(' asesores.html (' + activeBrokers.length + ' active brokers)');
activeBrokers.forEach(function(b) {
  write(path.join(ASESORES, b.slug + '.html'), brokerProfilePage(b, props));
});
console.log(' ' + activeBrokers.length + ' broker profile pages');

// Favoritos page
const favoritosHTML = layout({
  title: 'Mis Favoritos',
  desc: 'Tus propiedades guardadas en INMUHUB',
  canonical: '/favoritos.html',
  body: `<div style="max-width:1200px;margin:0 auto;padding:48px 6%">
    <div style="margin-bottom:32px">
      <h1 style="font-size:28px;font-weight:800;color:#111;margin-bottom:8px">Mis Favoritos</h1>
      <p style="color:#666;font-size:15px">Las propiedades que has guardado para revisar despu&eacute;s.</p>
    </div>
    <div id="zpFavGrid" class="prop-grid" style="min-height:200px"></div>
    <div id="zpFavEmpty" style="display:none;text-align:center;padding:80px 20px">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" style="margin:0 auto 20px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      <h3 style="font-size:20px;font-weight:700;color:#374151;margin-bottom:8px">No tienes favoritos a&uacute;n</h3>
      <p style="color:#9ca3af;margin-bottom:24px">Explora propiedades y presiona el coraz&oacute;n para guardarlas aqu&iacute;.</p>
      <a href="/propiedades.html" style="display:inline-block;background:#1a3a5c;color:white;padding:12px 32px;border-radius:8px;font-weight:600;text-decoration:none">Ver propiedades</a>
    </div>
  </div>
  <script>
  (function(){
    var allProps = ` + JSON.stringify(props.map(function(p){return{slug:p.slug,title:p.title||p.titulo||'',priceFormatted:p.priceFormatted||'',priceNumeric:p.priceNumeric||0,moneda:p.moneda||'',mainImageThumb:p.mainImageThumb||'',tipo:p.tipo||'',municipio:p.municipio||'',locationFull:p.locationFull||'',habitaciones:p.habitaciones||'',banos:p.banos||'',areaConst:p.areaConst||'',areaV2:p.areaV2||'',destacada:p.destacada||false,gallery:p.gallery||[],cinta:p.cinta||''}})) + `;
    var favs = zpGetFavs();
    var grid = document.getElementById('zpFavGrid');
    var empty = document.getElementById('zpFavEmpty');
    if(!favs.length){ empty.style.display='block'; return; }
    var found = allProps.filter(function(p){return favs.indexOf(p.slug)!==-1});
    if(!found.length){ empty.style.display='block'; return; }
    found.forEach(function(p){
      var a = document.createElement('a');
      a.className='property-card visible';
      a.href='/propiedades/'+p.slug+'.html';
      a.innerHTML='<div style="overflow:hidden;position:relative;aspect-ratio:4/3"><img src="'+p.mainImageThumb+'" loading="lazy" style="width:100%;height:100%;object-fit:cover"><div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 50%)"></div></div><div style="padding:20px 22px 24px"><div style="font-size:1.25rem;font-weight:800;color:var(--gold)">'+(p.priceFormatted||'Consultar')+'</div><h3 style="font-size:.95rem;font-weight:600;color:#0a1628;margin:6px 0 8px">'+p.title+'</h3><p style="font-size:.78rem;color:#64748b">'+p.locationFull+'</p></div>';
      grid.appendChild(a);
    });
  })();
  <\/script>`
});
write(path.join(OUT,'favoritos.html'), favoritosHTML);
console.log(' favoritos.html');

// Mapa page
var propsWithCoords = props.filter(function(p){return p.lat && p.lng});
var mapaBody = '<div style="max-width:1400px;margin:0 auto;padding:24px 6%">' +
  '<div style="margin-bottom:20px"><h1 style="font-size:28px;font-weight:800;color:#111;margin-bottom:6px">Mapa de Propiedades</h1><p style="color:#666;font-size:14px">' + propsWithCoords.length + ' propiedades con ubicación en Guatemala</p></div>' +
  '<div id="zpMap" style="width:100%;height:calc(100vh - 220px);min-height:500px;border-radius:16px;overflow:hidden;border:1.5px solid #e5e7eb;box-shadow:0 4px 20px rgba(0,0,0,.08)"></div>' +
  '</div>' +
  '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">' +
  '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>' +
  '<script>' +
  'document.addEventListener("DOMContentLoaded",function(){' +
  'var map=L.map("zpMap").setView([14.6,-90.5],10);' +
  'L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"OSM",maxZoom:18}).addTo(map);' +
  'var props=' + JSON.stringify(propsWithCoords.map(function(p){return{lat:p.lat,lng:p.lng,t:p.title||p.titulo||'',p:p.priceFormatted||'',s:p.slug,img:p.mainImageThumb||''}})) + ';' +
  'props.forEach(function(p){' +
  'var popup=\'<div style="min-width:200px"><a href="/propiedades/\'+p.s+\'.html" style="text-decoration:none;color:inherit"><img src="\'+p.img+\'" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px"><div style="font-weight:700;color:#C9A96E;margin-bottom:4px">\'+p.p+\'</div><div style="font-size:13px;font-weight:600;color:#111">\'+p.t+\'</div></a></div>\';' +
  'L.marker([p.lat,p.lng]).addTo(map).bindPopup(popup);' +
  '});' +
  '});' +
  '<\/script>';
write(path.join(OUT,'mapa.html'), layout({
  title: 'Mapa de Propiedades',
  desc: 'Explora propiedades premium en Guatemala en un mapa interactivo',
  canonical: '/mapa.html',
  body: mapaBody
}));
console.log(' mapa.html');

const zonaUrls = zonas.map(z => ({ loc: `/zonas/${slugZona(z)}.html`, priority:'0.85', changefreq:'weekly' }));
const brokerUrls = activeBrokers.map(function(b){ return { loc: '/asesores/' + b.slug + '.html', priority: '0.8', changefreq: 'weekly' }; });

const { articles } = require('./templates/blog');
const { landings } = require('./templates/landing-seo');
const urls = [
  { loc:'/', priority:'1.0', changefreq:'weekly' },
  { loc:'/propiedades.html', priority:'0.9', changefreq:'daily' },
  { loc:'/favoritos.html', priority:'0.7', changefreq:'weekly' },
  { loc:'/mapa.html', priority:'0.8', changefreq:'weekly' },
  { loc:'/asesores.html', priority:'0.85', changefreq:'weekly' },
  { loc:'/registro-asesor.html', priority:'0.8', changefreq:'monthly' },
  { loc:'/dashboard.html', priority:'0.7', changefreq:'monthly' },
  ...brokerUrls,
  { loc:'/herramientas/calculadora-hipotecaria.html', priority:'0.85', changefreq:'monthly' },
  { loc:'/herramientas/valuador.html', priority:'0.85', changefreq:'monthly' },
  { loc:'/herramientas/guia-compra.html', priority:'0.85', changefreq:'monthly' },
  ...zonaUrls,
  { loc:'/blog/', priority:'0.9', changefreq:'weekly' },
  ...articles.map(a=>({ loc:"/blog/"+a.slug+".html", priority:'0.85', changefreq:'monthly' })),
  ...landings.map(l=>({ loc:'/'+l.slug+'.html', priority:'0.9', changefreq:'monthly' })),
  ...props.map(p=>({ loc:`/propiedades/${p.slug}.html`, priority:'0.8', changefreq:'weekly' })),
];
write(path.join(OUT,'sitemap.xml'), generateSitemap(DOMAIN, urls)); console.log(' sitemap.xml');
const src404 = require('path').join(__dirname, '404.html');
if(fs.existsSync(src404)){fs.copyFileSync(src404, require('path').join(OUT,'404.html'));console.log(' 404.html');}

write(path.join(OUT,'robots.txt'), generateRobots(DOMAIN)); console.log(' robots.txt');
write(path.join(OUT,'_redirects'), generateRedirects(props, DOMAIN)); console.log(' _redirects');

const { mortgageCalculatorPage } = require('./templates/mortgage-calculator-page');
const { simuladorInversionPage } = require('./templates/simulador-page');
const { valuacionPage } = require('./templates/valuacion-page');
const { guiaCompraPae } = require('./templates/guia-compra-page');
const { dashboardInversionistasPage } = require('./templates/dashboard-inversionistas-page');
const HERRAMIENTAS = path.join(OUT, 'herramientas');
fs.mkdirSync(HERRAMIENTAS, { recursive: true });

write(path.join(HERRAMIENTAS, 'calculadora-hipotecaria.html'), mortgageCalculatorPage());
console.log(' calculadora-hipotecaria.html');

write(path.join(HERRAMIENTAS, 'valuador.html'), valuacionPage());
console.log(' valuador.html');

write(path.join(HERRAMIENTAS, 'guia-compra.html'), guiaCompraPae());
console.log(' guia-compra.html');

write(path.join(HERRAMIENTAS, 'simulador-inversion.html'), simuladorInversionPage());
console.log(' simulador-inversion.html');

write(path.join(HERRAMIENTAS, 'dashboard-inversionistas.html'), dashboardInversionistasPage());
console.log(' dashboard-inversionistas.html');

// Registro asesor page
const { registroAsesorPage } = require('./templates/registro-asesor-page');
write(path.join(OUT, 'registro-asesor.html'), registroAsesorPage());
console.log(' registro-asesor.html');

// Dashboard asesor page
const { dashboardAsesorPage } = require('./templates/dashboard-asesor-page');
write(path.join(OUT, 'dashboard.html'), dashboardAsesorPage());
console.log(' dashboard.html');

// Admin Hub
const { adminHubPage } = require('./templates/admin-hub-page');
write(path.join(OUT, 'admin-hub.html'), adminHubPage());
console.log(' admin-hub.html');


// Blog SEO
const { blogIndexPage, blogArticlePage } = require('./templates/blog');
const BLOG = path.join(OUT, 'blog');
if (!fs.existsSync(BLOG)) fs.mkdirSync(BLOG, { recursive: true });
write(path.join(BLOG, 'index.html'), blogIndexPage(articles));
console.log(' blog/index.html');
articles.forEach(a => {
  write(path.join(BLOG, a.slug + '.html'), blogArticlePage(a));
  console.log('  blog/' + a.slug + '.html');
});


// SEO Landing Pages
const { seoLandingPage } = require('./templates/landing-seo');
landings.forEach(function(cfg) {
  write(path.join(OUT, cfg.slug + '.html'), seoLandingPage(cfg));
  console.log('  ' + cfg.slug + '.html');
});

console.log(`\n INMUHUB.COM built: ${props.length} propiedades + ${zonas.length} zonas\n`);

copyAssets(); console.log(' Assets copiados');

const planesSrc = path.join(__dirname, 'planes.html');
if (fs.existsSync(planesSrc)) {
  fs.copyFileSync(planesSrc, path.join(OUT, 'planes.html'));
  console.log(' planes.html copiado');
}

}).catch(e => { console.error('Build error:', e); process.exit(1); });
