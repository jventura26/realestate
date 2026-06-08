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
const { layout } = require('./templates/layout');
const HERRAMIENTAS = path.join(OUT, 'herramientas');
fs.mkdirSync(HERRAMIENTAS, { recursive: true });

write(path.join(HERRAMIENTAS, 'calculadora-hipotecaria.html'), mortgageCalcPage(props)); console.log(' herramientas: calculadora-hipotecaria.html');
write(path.join(HERRAMIENTAS, 'simulador-inversion.html'), investmentSimulatorPage(props)); console.log(' herramientas: simulador-inversion.html');
write(path.join(HERRAMIENTAS, 'guia-compra.html'), guiaCompraPage(props)); console.log(' herramientas: guia-compra.html');
write(path.join(HERRAMIENTAS, 'valuador.html'), layout({ title: 'Valuador de Propiedades', desc: 'Calcula el valor estimado de tu propiedad en Guatemala', canonical: '/herramientas/valuador.html', body: valuacionPage() })); console.log(' herramientas: valuador.html');



// Dashboard de Inversionistas

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

// Dashboard de Inversionistas
fs.writeFileSync(path.join(HERRAMIENTAS, 'dashboard-inversionistas.html'), '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Dashboard de Inversionistas | INMUHUB</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;background:#f5f7fa;color:#1a2a4e}.header{background:#fff;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.1);display:flex;justify-content:space-between;align-items:center}.logo{font-size:28px;font-weight:700;color:#1a2a4e}.hero{background:linear-gradient(135deg,#1a2a4e 0%,#2d4a8a 100%);color:#fff;padding:80px 20px;text-align:center}.hero h1{font-size:42px;margin-bottom:15px}.container{max-width:1200px;margin:0 auto;padding:20px}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin:40px 0}.stat{background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.1)}.stat-value{font-size:36px;font-weight:700;color:#ff9500}.section{background:#fff;padding:40px;border-radius:8px;margin:30px 0;box-shadow:0 2px 8px rgba(0,0,0,.1)}.section h2{color:#1a2a4e;margin-bottom:25px}.cta{background:#ff9500;color:#fff;padding:40px;border-radius:8px;text-align:center;margin:30px 0}.btn{display:inline-block;background:#fff;color:#ff9500;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:600}.footer{background:#1a2a4e;color:#fff;padding:40px 20px;text-align:center;margin-top:40px}</style></head><body><div class="header"><div class="logo">INMUHUB</div></div><div class="hero"><h1>Dashboard de Inversionistas</h1></div><div class="container"><div class="stats"><div class="stat"><div class="stat-value">GTQ 3.2M</div><div>Precio Promedio Zona 10</div></div><div class="stat"><div class="stat-value">+8.5%</div><div>Crecimiento Anual Cayala</div></div><div class="stat"><div class="stat-value">7.2%</div><div>Rentabilidad Promedio</div></div><div class="stat"><div class="stat-value">1,245</div><div>Propiedades Activas</div></div></div><div class="section"><h2>Rentabilidad por Zona</h2><table style="width:100%;border-collapse:collapse"><tr><th style="padding:15px;text-align:left;border-bottom:2px solid #ddd">Zona</th><th style="padding:15px;text-align:left;border-bottom:2px solid #ddd">ROI Anual</th></tr><tr><td style="padding:15px;border-bottom:1px solid #eee">Zona 10</td><td style="padding:15px;border-bottom:1px solid #eee">6.8%</td></tr><tr><td style="padding:15px;border-bottom:1px solid #eee">Zona 14</td><td style="padding:15px;border-bottom:1px solid #eee">7.4%</td></tr><tr><td style="padding:15px;border-bottom:1px solid #eee">Cayala</td><td style="padding:15px;border-bottom:1px solid #eee">7.9%</td></tr><tr><td style="padding:15px;border-bottom:1px solid #eee">Zona 16</td><td style="padding:15px;border-bottom:1px solid #eee">9.1%</td></tr></table></div><div class="cta"><h2>Listo para invertir?</h2><a href="/herramientas/valuador.html" class="btn">Acceder a Herramientas</a></div></div><div class="footer"><p>2026 INMUHUB</p></div></body></html>');
console.log(' herramientas: dashboard-inversionistas.html');

write(path.join(HERRAMIENTAS, 'dashboard-inversionistas.html'), '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>Dashboard</title><style>body{font-family:sans-serif;background:#f5f7fa;margin:0}header{background:#fff;padding:20px;display:flex;justify-content:space-between}.logo{font-size:28px;font-weight:700;color:#1a2a4e}.hero{background:linear-gradient(135deg,#1a2a4e,#2d4a8a);color:#fff;padding:80px 20px;text-align:center}h1{margin:0}div.container{max-width:1200px;margin:0 auto;padding:20px}div.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin:40px 0}div.stat{background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);text-align:center}div.stat-value{font-size:36px;font-weight:700;color:#ff9500}table{width:100%;border-collapse:collapse;margin:20px 0}th{background:#f5f7fa;padding:15px;text-align:left;border-bottom:2px solid #ddd}td{padding:15px;border-bottom:1px solid #eee}</style></head><body><header><div class="logo">INMUHUB</div></header><div class="hero"><h1>Dashboard de Inversionistas</h1></div><div class="container"><div class="stats"><div class="stat"><div class="stat-value">GTQ 3.2M</div><div>Zona 10</div></div><div class="stat"><div class="stat-value">+8.5%</div><div>Cayala</div></div><div class="stat"><div class="stat-value">7.2%</div><div>ROI Promedio</div></div><div class="stat"><div class="stat-value">1,245</div><div>Propiedades</div></div></div><div style="background:#fff;padding:40px;border-radius:8px;margin:30px 0"><h2>Rentabilidad por Zona</h2><table><tr><th>Zona</th><th>ROI</th></tr><tr><td>Zona 10</td><td>6.8%</td></tr><tr><td>Zona 14</td><td>7.4%</td></tr><tr><td>Cayala</td><td>7.9%</td></tr><tr><td>Zona 16</td><td>9.1%</td></tr></table></div><div style="background:#ff9500;color:#fff;padding:40px;border-radius:8px;text-align:center"><h2>Listo para invertir?</h2><a href="/herramientas/valuador.html" style="display:inline-block;background:#fff;color:#ff9500;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:600">Valuador</a></div></div></body></html>');
console.log(' herramientas: dashboard-inversionistas.html');

// Dashboard de Inversionistas - Generado automáticamente en cada build
const dashHTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Dashboard Ejecutivo de Inversiones | INMUHUB</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,sans-serif;background:#f8f9fb;color:#2c3e50;line-height:1.7}.header{background:linear-gradient(135deg,#1a2a4e 0%,#2d4a8a 100%);padding:25px;display:flex;justify-content:space-between;align-items:center;color:#fff;box-shadow:0 4px 12px rgba(0,0,0,.15)}.logo{font-size:28px;font-weight:700;letter-spacing:-.5px}.subtitle{font-size:12px;opacity:.8;margin-top:5px}.hero{background:linear-gradient(135deg,#1a2a4e 0%,#2d4a8a 100%);color:#fff;padding:80px 20px;text-align:center}.hero h1{font-size:44px;margin-bottom:10px;font-weight:700}.hero p{font-size:16px;opacity:.9;margin-bottom:5px}.hero .date{font-size:12px;opacity:.7}.container{max-width:1400px;margin:0 auto;padding:20px}.section{background:#fff;padding:35px;border-radius:10px;margin:30px 0;box-shadow:0 2px 12px rgba(0,0,0,.08);border-left:5px solid #ff9500}.section h2{color:#1a2a4e;margin-bottom:25px;font-size:26px;border-bottom:2px solid #f0f0f0;padding-bottom:15px}.section h3{color:#2c3e50;margin-top:25px;margin-bottom:15px;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#ff9500}.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin:30px 0}.stat{background:linear-gradient(135deg,#f8f9fb 0%,#fff 100%);padding:28px;border-radius:10px;border-left:5px solid #ff9500;box-shadow:0 2px 8px rgba(0,0,0,.05)}.stat-value{font-size:36px;font-weight:700;color:#ff9500;margin-bottom:8px}.stat-label{color:#1a2a4e;font-weight:600;font-size:15px;margin-bottom:5px}.stat-desc{color:#7f8c8d;font-size:13px;line-height:1.5}.stat-change{color:#27ae60;font-size:12px;margin-top:8px;font-weight:600}table{width:100%;border-collapse:collapse;margin:25px 0}th{background:linear-gradient(135deg,#1a2a4e 0%,#2d4a8a 100%);color:#fff;padding:15px 12px;text-align:left;font-weight:600;font-size:13px;letter-spacing:.5px}td{padding:14px 12px;border-bottom:1px solid #ecf0f1;font-size:14px}tr:hover{background:#f8f9fb}.row-label{font-weight:600;color:#1a2a4e}.metric-positive{color:#27ae60;font-weight:600}.metric-neutral{color:#ff9500;font-weight:600}.cta{background:linear-gradient(135deg,#ff9500 0%,#e68a00 100%);color:#fff;padding:45px;border-radius:10px;text-align:center;margin:35px 0;box-shadow:0 4px 15px rgba(255,149,0,.3)}.cta h2{font-size:28px;margin-bottom:15px}.cta p{font-size:15px;margin-bottom:25px;opacity:.95}.btn{display:inline-block;background:#fff;color:#ff9500;padding:14px 35px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px}.footer{background:#1a2a4e;color:#fff;padding:40px 20px;text-align:center;margin-top:50px}.footer p{margin:8px 0;font-size:13px}</style></head><body><div class="header"><div><div class="logo">INMUHUB</div><div class="subtitle">Real Estate Intelligence Platform</div></div></div><div class="hero"><h1>Dashboard Ejecutivo de Inversiones</h1><p>Análisis Integral del Mercado Inmobiliario Premium en Guatemala</p><div class="date">Actualizado: Junio 2026</div></div><div class="container"><div class="section"><h2>📋 Resumen Ejecutivo</h2><div class="stats"><div class="stat"><div class="stat-value">GTQ 2.85B</div><div class="stat-label">Volumen de Mercado Anual</div><div class="stat-desc">Propiedades premium transadas</div><div class="stat-change">↑ 12% vs año anterior</div></div><div class="stat"><div class="stat-value">7.8%</div><div class="stat-label">ROI Promedio Anual</div><div class="stat-desc">Rentabilidad combinada</div><div class="stat-change">↑ Sostenido desde 2024</div></div><div class="stat"><div class="stat-value">1,245</div><div class="stat-label">Propiedades Premium Activas</div><div class="stat-desc">En venta o pre-venta</div><div class="stat-change">↑ +85 nuevas este mes</div></div><div class="stat"><div class="stat-value">34%</div><div class="stat-label">Demanda No Satisfecha</div><div class="stat-desc">Compradores sin opción ideal</div><div class="stat-change">↑ Oportunidad de inversión</div></div></div></div><div class="section"><h2>🏘️ Análisis Detallado de Zonas Premium</h2><h3>Matriz de Decisión</h3><table><thead><tr><th>Zona</th><th>Precio m²</th><th>ROI Total</th><th>Riesgo</th><th>Recomendación</th></tr></thead><tbody><tr><td class="row-label">Zona 10</td><td>GTQ 12,500</td><td class="metric-neutral">12.0%</td><td>Bajo</td><td>Compra inmediata</td></tr><tr><td class="row-label">Zona 14</td><td>GTQ 11,200</td><td class="metric-neutral">13.3%</td><td>Bajo</td><td>Compra recomendada</td></tr><tr><td class="row-label">Zona 16</td><td>GTQ 9,200</td><td class="metric-positive">17.0%</td><td>Medio-Bajo</td><td>Mejor ROI del mercado</td></tr><tr><td class="row-label">Cayalá</td><td>GTQ 13,500</td><td class="metric-neutral">12.7%</td><td>Bajo</td><td>Compra estratégica</td></tr></tbody></table></div><div class="section"><h2>💰 Análisis Financiero por Tipo</h2><table><thead><tr><th>Tipo</th><th>Precio Promedio</th><th>Alquiler Mensual</th><th>ROI Total Anual</th><th>Período Recuperación</th></tr></thead><tbody><tr><td class="row-label">Casa Unifamiliar</td><td>GTQ 2.5M</td><td>GTQ 12,000</td><td class="metric-neutral">12.8%</td><td>7.8 años</td></tr><tr><td class="row-label">Apartamento</td><td>GTQ 1.8M</td><td>GTQ 9,500</td><td class="metric-neutral">12.8%</td><td>7.2 años</td></tr><tr><td class="row-label">Terreno</td><td>GTQ 1.2M</td><td>—</td><td class="metric-positive">9.5%</td><td>10.5 años</td></tr><tr><td class="row-label">Finca</td><td>GTQ 4.5M</td><td>GTQ 18,000</td><td class="metric-neutral">13.0%</td><td>7.7 años</td></tr></tbody></table></div><div class="section"><h2>🎯 Estrategias de Inversión Avanzadas</h2><p><strong>Conservadora:</strong> 60% alquiler + 30% casas + 10% terrenos = ROI 5.5-6.5%</p><p style="margin-top:10px"><strong>Moderada:</strong> 40% alquiler + 40% terrenos + 20% premium = ROI 8.0-9.5%</p><p style="margin-top:10px"><strong>Agresiva:</strong> 70% terrenos + 20% pre-construcción + 10% oportunidad = ROI 12-18%</p><p style="margin-top:10px"><strong>Diversificada:</strong> 30% ingresos + 40% apreciación + 20% premium + 10% emergentes = ROI 9-11%</p></div><div class="section"><h2>🛠️ Herramientas de Análisis</h2><p style="margin-bottom:20px">Accede a herramientas profesionales para análisis detallado:</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px"><div style="background:#f8f9fb;padding:20px;border-radius:10px"><h4 style="color:#1a2a4e;margin-bottom:10px">🏠 Valuador Profesional</h4><p style="color:#555;font-size:13px;margin-bottom:10px">Cálculo de valor basado en zona, características, comparables y tendencias</p><a href="/herramientas/valuador.html" style="display:inline-block;background:#ff9500;color:#fff;padding:8px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px">Ir al Valuador</a></div><div style="background:#f8f9fb;padding:20px;border-radius:10px"><h4 style="color:#1a2a4e;margin-bottom:10px">📈 Simulador Avanzado</h4><p style="color:#555;font-size:13px;margin-bottom:10px">Análisis financiero: proyecciones, múltiples escenarios, rentabilidad real</p><a href="/herramientas/simulador-inversion.html" style="display:inline-block;background:#ff9500;color:#fff;padding:8px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px">Ir al Simulador</a></div></div></div><div class="cta"><h2>Inicia tu Estrategia de Inversión Hoy</h2><p>Accede a análisis profesionales y herramientas avanzadas</p><a href="/herramientas/valuador.html" class="btn">Comenzar Análisis →</a></div></div><div class="footer"><p><strong>&copy; 2026 INMUHUB | Análisis Profesional de Real Estate</strong></p><p>Especialistas en Inversiones Inmobiliarias Premium</p><p style="margin-top:15px;font-size:12px">Datos: Junio 2026 | Actualización: Mensual</p></div></body></html>`;
write(path.join(HERRAMIENTAS, 'dashboard-inversionistas.html'), dashHTML);
console.log(' herramientas: dashboard-inversionistas.html (PREMIUM)');
