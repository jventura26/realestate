const fs   = require('fs');
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
  const srcDir = path.join(__dirname, '../../public/assets');
  const dstDir = path.join(OUT, 'assets');
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(dstDir, { recursive: true });
  const fileMappings = {
    'InmuHub sin fondo 1_1.png': 'logo.png',
    'InmuHub Ícono.png': 'icon.png'
  };
  Object.entries(fileMappings).forEach(([src, dst]) => {
    const srcPath = path.join(srcDir, src);
    const dstPath = path.join(dstDir, dst);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, dstPath);
    }
  });
}

console.log('\n⚡  Building Zona INNmueble…\n');
const props = parseProperties(CSV);
console.log(`   ✔  ${props.length} properties parsed`);

fs.rmSync(OUT, { recursive:true, force:true });
fs.mkdirSync(PROPS, { recursive:true });

write(path.join(OUT,'index.html'),        indexPage(props));   console.log('   ✔  index.html');
write(path.join(OUT,'propiedades.html'),  catalogPage(props)); console.log('   ✔  propiedades.html');

props.forEach(p => write(path.join(PROPS,`${p.slug}.html`), detailPage(p, props)));
console.log(`   ✔  ${props.length} detail pages`);

const urls = [
  { loc:'/',                 priority:'1.0', changefreq:'weekly' },
  { loc:'/propiedades.html', priority:'0.9', changefreq:'daily'  },
  ...props.map(p=>({ loc:`/propiedades/${p.slug}.html`, priority:'0.8', changefreq:'weekly' })),
];
write(path.join(OUT,'sitemap.xml'),  generateSitemap(DOMAIN, urls)); console.log('   ✔  sitemap.xml');
write(path.join(OUT,'robots.txt'),   generateRobots(DOMAIN));        console.log('   ✔  robots.txt');
write(path.join(OUT,'_redirects'),   generateRedirects(props, DOMAIN)); console.log('   ✔  _redirects (Wix URL migration)');

// Copiar assets
copyAssets(); console.log('   ✔  assets copied');

console.log(`\n✅  Zona → dist/zona/  (${props.length + 2} HTML pages)\n`);
