const fs = require('fs');
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
  
  // Copiar archivos JS de src/vinculo/assets
  const jsAssetsDir = path.join(__dirname, 'assets');
  if (fs.existsSync(jsAssetsDir)) {
    fs.readdirSync(jsAssetsDir).forEach(file => {
      if (file.endsWith('.js')) {
        fs.copyFileSync(path.join(jsAssetsDir, file), path.join(dstDir, file));
      }
    });
  }

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
const props = parseProperties(CSV);
console.log(` ${props.length} properties parsed`);

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
write(path.join(OUT,'robots.txt'), generateRobots(DOMAIN)); console.log(' robots.txt');
write(path.join(OUT,'_redirects'), generateRedirects(props, DOMAIN)); console.log(' _redirects');

console.log(`\n INMUHUB.COM built: ${props.length} propiedades + ${zonas.length} páginas de zona\n`);

// Generar páginas de herramientas
const { mortgageCalculatorPage } = require('./templates/mortgage-calculator-page');
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

write(path.join(HERRAMIENTAS, 'dashboard-inversionistas.html'), dashboardInversionistasPage());
console.log(' herramientas: dashboard-inversionistas.html ✅');

console.log('\n✨ INMUHUB.COM BUILD COMPLETE\n');
console.log(' Página Principal: MEJORADA CON 3 TOOLS DESTACADOS');
console.log(' Herramientas: Todas con Meta Tags + Schema Markup\n');

// Copiar assets
copyAssets(); console.log(' Assets copiados (favicon, logo)\n');
