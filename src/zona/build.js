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
  }));
}

const path = require('path');
const { parseProperties }  = require('../shared/parse-csv');
const { generateSitemap, generateRobots, generateRedirects } = require('../shared/utils');
const { indexPage, catalogPage, detailPage } = require('./templates/pages');

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
}

console.log('\n⚡  Building Zona INNmueble…\n');

fetchKV().then(kvData => {
const props = kvData ? normalizeKV(kvData) : parseProperties(CSV);
console.log(`   ✔  ${props.length} propiedades ${kvData ? 'desde KV' : 'desde CSV'}`);


fs.rmSync(OUT, { recursive:true, force:true });
fs.mkdirSync(PROPS, { recursive:true });

write(path.join(OUT,'index.html'),        indexPage(props));   console.log('   ✔  index.html');
write(path.join(OUT,'propiedades.html'),  catalogPage(props)); console.log('   ✔  propiedades.html');

// Copiar FAQ y About
const faqSrc = path.join(__dirname, 'faq.html');
const aboutSrc = path.join(__dirname, 'about.html');
const blogSrc = path.join(__dirname, 'blog.html');
const art1Src = path.join(__dirname, 'guia-inversion-real-estate-2026.html');
const art2Src = path.join(__dirname, 'zona-10-vs-zona-14.html');
const art3Src = path.join(__dirname, 'senales-alerta-comprar-propiedad.html');

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
if(fs.existsSync(art1Src)) {
  fs.copyFileSync(art1Src, path.join(OUT, 'guia-inversion-real-estate-2026.html'));
  console.log('   ✔  blog/art1.html');
}
if(fs.existsSync(art2Src)) {
  fs.copyFileSync(art2Src, path.join(OUT, 'zona-10-vs-zona-14.html'));
  console.log('   ✔  blog/art2.html');
}
if(fs.existsSync(art3Src)) {
  fs.copyFileSync(art3Src, path.join(OUT, 'senales-alerta-comprar-propiedad.html'));
  console.log('   ✔  blog/art3.html');
}

props.forEach(p => write(path.join(PROPS,`${p.slug}.html`), detailPage(p, props)));
console.log(`   ✔  ${props.length} detail pages`);

const urls = [
  { loc:'/',                 priority:'1.0', changefreq:'weekly' },
  { loc:'/propiedades.html', priority:'0.9', changefreq:'daily'  },
  ...props.map(p=>({ loc:`/propiedades/${p.slug}.html`, priority:'0.8', changefreq:'weekly' })),
];
write(path.join(OUT,'sitemap.xml'),  generateSitemap(DOMAIN, urls)); console.log('   ✔  sitemap.xml');
write(path.join(OUT,'robots.txt'),   generateRobots(DOMAIN));        console.log('   ✔  robots.txt');
write(path.join(OUT,'google24850a801f739dec.html'), 'google-site-verification: google24850a801f739dec.html'); console.log('   ✔  google verification');
write(path.join(OUT,'_redirects'),   generateRedirects(props, DOMAIN)); console.log('   ✔  _redirects (Wix URL migration)');

// Copiar assets
copyAssets(); console.log('   ✔  assets copied');

console.log(`\n✅  Zona → dist/zona/  (${props.length + 10} HTML pages)\n`);
}).catch(e => { console.error('Build error:', e); process.exit(1); });
