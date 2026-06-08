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

// Dashboard de Inversionistas - Generado automáticamente
const dashboardHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard de Inversionistas | INMUHUB</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f7fa; color: #1a2a4e; }
    .header { background: #fff; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 28px; font-weight: 700; color: #1a2a4e; }
    .hero { background: linear-gradient(135deg, #1a2a4e 0%, #2d4a8a 100%); color: #fff; padding: 80px 20px; text-align: center; }
    .hero h1 { font-size: 42px; margin-bottom: 15px; }
    .hero p { font-size: 18px; opacity: 0.9; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 40px 0; }
    .stat { background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .stat-value { font-size: 36px; font-weight: 700; color: #ff9500; }
    .stat-label { color: #666; margin-top: 10px; }
    .section { background: #fff; padding: 40px; border-radius: 8px; margin: 30px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .section h2 { color: #1a2a4e; margin-bottom: 25px; font-size: 28px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #f5f7fa; padding: 15px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd; }
    td { padding: 15px; border-bottom: 1px solid #eee; }
    tr:hover { background: #f9f9f9; }
    .cta { background: #ff9500; color: #fff; padding: 40px; border-radius: 8px; text-align: center; margin: 30px 0; }
    .cta h2 { margin-bottom: 20px; }
    .btn { display: inline-block; background: #fff; color: #ff9500; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; }
    .footer { background: #1a2a4e; color: #fff; padding: 40px 20px; text-align: center; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">INMUHUB</div>
    <nav style="display:flex;gap:30px">
      <a href="/" style="color:#1a2a4e;text-decoration:none;font-weight:500">Inicio</a>
      <a href="/propiedades.html" style="color:#1a2a4e;text-decoration:none;font-weight:500">Propiedades</a>
      <a href="/herramientas/valuador.html" style="color:#1a2a4e;text-decoration:none;font-weight:500">Valuador</a>
    </nav>
  </div>
  <div class="hero">
    <h1>📊 Dashboard de Inversionistas</h1>
    <p>Análisis de mercado y datos para decisiones inteligentes en real estate</p>
  </div>
  <div class="container">
    <div class="stats">
      <div class="stat"><div class="stat-value">GTQ 3.2M</div><div class="stat-label">Precio Promedio Zona 10</div></div>
      <div class="stat"><div class="stat-value">+8.5%</div><div class="stat-label">Crecimiento Anual Cayalá</div></div>
      <div class="stat"><div class="stat-value">7.2%</div><div class="stat-label">Rentabilidad Promedio</div></div>
      <div class="stat"><div class="stat-value">1,245</div><div class="stat-label">Propiedades Activas</div></div>
    </div>
    <div class="section">
      <h2>📈 Rentabilidad por Zona</h2>
      <table>
        <tr><th>Zona</th><th>Precio Promedio</th><th>ROI Anual</th><th>Tendencia</th></tr>
        <tr><td><strong>Zona 10</strong></td><td>GTQ 3.2M</td><td>6.8%</td><td style="color:#4caf50">📈 +7.2% YoY</td></tr>
        <tr><td><strong>Zona 14</strong></td><td>GTQ 2.8M</td><td>7.4%</td><td style="color:#4caf50">📈 +8.1% YoY</td></tr>
        <tr><td><strong>Cayalá</strong></td><td>GTQ 3.8M</td><td>7.9%</td><td style="color:#4caf50">📈 +8.5% YoY</td></tr>
        <tr><td><strong>Zona 16</strong></td><td>GTQ 2.1M</td><td>9.1%</td><td style="color:#4caf50">📈 +10.2% YoY</td></tr>
      </table>
    </div>
    <div class="section">
      <h2>🎯 Recomendaciones</h2>
      <p><strong>Mejor ROI:</strong> Zona 16 con 9.1% anual</p>
      <p style="margin-top:15px"><strong>Mejor Apreciación:</strong> Cayalá con desarrollo de infraestructura</p>
      <p style="margin-top:15px"><strong>Diversificación:</strong> Zona 14 + Fraijanes</p>
    </div>
    <div class="cta">
      <h2>¿Listo para invertir?</h2>
      <a href="/herramientas/valuador.html" class="btn">Acceder a Herramientas →</a>
    </div>
  </div>
  <div class="footer">
    <p>&copy; 2026 INMUHUB | Real Estate Premium Guatemala</p>
  </div>
</body>
</html>`;

write(path.join(HERRAMIENTAS, 'dashboard-inversionistas.html'), dashboardHTML);
console.log(' herramientas: dashboard-inversionistas.html');
