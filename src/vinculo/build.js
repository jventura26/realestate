const fs   = require('fs');
const path = require('path');
const { parseProperties }   = require('../shared/parse-csv');
const { generateSitemap, generateRobots, generateRedirects } = require('../shared/utils');
const { indexPage, catalogPage, detailPage } = require('./templates/pages');

const DOMAIN   = 'https://inmuhub.com';
const CSV      = path.resolve(__dirname, '../../data/propiedades.csv');
const OUT      = path.resolve(__dirname, '../../dist/vinculo');
const PROPS    = path.join(OUT, 'propiedades');

function write(p, c) { fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,c,'utf-8'); }

console.log('\nâ¡  Building Vinculo Inmobiliarioâ¦\n');
const props = parseProperties(CSV);
console.log(`   â  ${props.length} properties parsed`);

fs.rmSync(OUT, { recursive:true, force:true });
fs.mkdirSync(PROPS, { recursive:true });

write(path.join(OUT,'index.html'),         indexPage(props));   console.log('   â  index.html');
write(path.join(OUT,'propiedades.html'),   catalogPage(props)); console.log('   â  propiedades.html');

props.forEach(p => write(path.join(PROPS,`${p.slug}.html`), detailPage(p, props)));
console.log(`   â  ${props.length} detail pages`);

const urls = [
  { loc:'/',                  priority:'1.0', changefreq:'weekly' },
  { loc:'/propiedades.html',  priority:'0.9', changefreq:'daily'  },
  ...props.map(p=>({ loc:`/propiedades/${p.slug}.html`, priority:'0.8', changefreq:'weekly' })),
];
write(path.join(OUT,'sitemap.xml'),   generateSitemap(DOMAIN, urls)); console.log('   â  sitemap.xml');
write(path.join(OUT,'robots.txt'),    generateRobots(DOMAIN));        console.log('   â  robots.txt');
write(path.join(OUT,'_redirects'),    generateRedirects(props, DOMAIN)); console.log('   â  _redirects (Wix URL migration)');

console.log(`\nâ  Vinculo â dist/vinculo/  (${props.length + 2} HTML pages)\n`);
