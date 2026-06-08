const fs = require('fs');
const path = require('path');
const { parseProperties } = require('../shared/parse-csv');
const { generateSitemap, generateRobots, generateRedirects } = require('../shared/utils');
const { indexPage, catalogPage, detailPage, zonaPage } = require('./templates/pages');

const DOMAIN = 'https://inmuhub.com';
const CSV = path.resolve(__dirname, '../../data/propiedades.csv');
const OUT = path.resolve(__dirname, '../../dist/vinculo');
const PROPS = path.join(OUT, 'propiedades');
const ZONAS = path.join(OUT, 'zonas');

function write(p, c) { fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,c,'utf-8'); }
function slugZona(z) { return z.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

console.log('\n Building INMUHUB.COM\n');
const props = parseProperties(CSV);
console.log(` ${props.length} properties parsed`);

fs.rmSync(OUT, { recursive:true, force:true });
fs.mkdirSync(PROPS, { recursive:true });
fs.mkdirSync(ZONAS, { recursive:true });

write(path.join(OUT,'index.html'), indexPage(props)); console.log(' index.html');
write(path.join(OUT,'propiedades.html'), catalogPage(props)); console.log(' propiedades.html');

props.forEach(p => write(path.join(PROPS,`${p.slug}.html`), detailPage(p, props)));
console.log(` ${props.length} detail pages`);

// Páginas por zona
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
  ...zonaUrls,
  ...props.map(p=>({ loc:`/propiedades/${p.slug}.html`, priority:'0.8', changefreq:'weekly' })),
];
write(path.join(OUT,'sitemap.xml'), generateSitemap(DOMAIN, urls)); console.log(' sitemap.xml');
write(path.join(OUT,'robots.txt'), generateRobots(DOMAIN)); console.log(' robots.txt');
write(path.join(OUT,'_redirects'), generateRedirects(props, DOMAIN)); console.log(' _redirects');

console.log(`\n INMUHUB.COM built: ${props.length} propiedades + ${zonas.length} páginas de zona\n`);

// Generar páginas de herramientas
const { mortgageCalcPage, investmentSimulatorPage, guiaCompraPage } = require('./templates/pages');
const { valuacionPage } = require('./templates/valuacion-property');
const { dashboardInversionistasPage } = require('./templates/dashboard-inversionistas-page');
const { layout } = require('./templates/layout');
const HERRAMIENTAS = path.join(OUT, 'herramientas');
fs.mkdirSync(HERRAMIENTAS, { recursive: true });

write(path.join(HERRAMIENTAS, 'calculadora-hipotecaria.html'), mortgageCalcPage(props)); console.log(' herramientas: calculadora-hipotecaria.html');
write(path.join(HERRAMIENTAS, 'simulador-inversion.html'), investmentSimulatorPage(props)); console.log(' herramientas: simulador-inversion.html');
write(path.join(HERRAMIENTAS, 'guia-compra.html'), guiaCompraPage(props)); console.log(' herramientas: guia-compra.html');
write(path.join(HERRAMIENTAS, 'valuador.html'), layout({ title: 'Valuador de Propiedades', desc: 'Calcula el valor estimado de tu propiedad en Guatemala', canonical: '/herramientas/valuador.html', body: valuacionPage() })); console.log(' herramientas: valuador.html');
write(path.join(HERRAMIENTAS, 'dashboard-inversionistas.html'), layout({ title: 'Dashboard de Inversionistas', desc: 'Análisis de mercado y datos para inversionistas en Guatemala', canonical: '/herramientas/dashboard-inversionistas.html', body: dashboardInversionistasPage() })); console.log(' herramientas: dashboard-inversionistas.html');



// Dashboard de Inversionistas
const { dashboardInversionistasPage } = require('./templates/dashboard-inversionistas-page');
write(path.join(HERRAMIENTAS, 'dashboard-inversionistas.html'), layout({ title: 'Dashboard de Inversionistas', desc: 'Análisis de mercado para inversionistas en Guatemala', canonical: '/herramientas/dashboard-inversionistas.html', body: dashboardInversionistasPage() })); console.log(' herramientas: dashboard-inversionistas.html');
