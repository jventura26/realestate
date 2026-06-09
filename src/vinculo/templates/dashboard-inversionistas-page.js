const { layout } = require('./layout');

function dashboardInversionistasPage() {
  const title = 'Dashboard de Inversionistas | Análisis Real Estate Guatemala 2026';
  const desc = 'Análisis profesional del mercado inmobiliario. Rentabilidad por zona, datos actualizados y estrategias de inversión.';
  const canonical = '/herramientas/dashboard-inversionistas.html';
  
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Dashboard de Inversionistas",
    "description": desc,
    "url": "https://inmuhub.com" + canonical,
    "applicationCategory": "BusinessApplication",
    "author": {
      "@type": "Organization",
      "name": "INMUHUB"
    }
  };

  const body = `<section style="padding:0">
  <div style="background:linear-gradient(135deg,#1a2a4e 0%,#2d4a8a 100%);color:#fff;padding:60px 20px;text-align:center">
    <h1 style="font-size:36px;margin-bottom:10px">📊 Dashboard de Inversionistas</h1>
    <p style="font-size:18px;opacity:0.9">Análisis profesional del mercado inmobiliario premium 2026</p>
  </div>
  
  <div style="max-width:1200px;margin:0 auto;padding:20px">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin:40px 0">
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
        <div style="font-size:32px;font-weight:700;color:#ff9500">GTQ 2.85B</div>
        <div style="color:#1a2a4e;font-weight:600;margin-top:8px">Volumen Anual</div>
        <div style="color:#666;font-size:12px">Mercado de propiedades premium</div>
      </div>
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
        <div style="font-size:32px;font-weight:700;color:#ff9500">7.8%</div>
        <div style="color:#1a2a4e;font-weight:600;margin-top:8px">ROI Promedio</div>
        <div style="color:#666;font-size:12px">Rentabilidad combinada</div>
      </div>
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
        <div style="font-size:32px;font-weight:700;color:#ff9500">1,245</div>
        <div style="color:#1a2a4e;font-weight:600;margin-top:8px">Propiedades Activas</div>
        <div style="color:#666;font-size:12px">En venta o pre-venta</div>
      </div>
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
        <div style="font-size:32px;font-weight:700;color:#ff9500">20</div>
        <div style="color:#1a2a4e;font-weight:600;margin-top:8px">Zonas Analizadas</div>
        <div style="color:#666;font-size:12px">Zonas premium de Guatemala</div>
      </div>
    </div>

    <div style="background:#fff;padding:30px;border-radius:8px;margin:40px 0;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
      <h2 style="color:#1a2a4e;margin-bottom:20px;font-size:24px">Rentabilidad por Zona</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr style="background:#f8f9fb;border-bottom:2px solid #ddd">
          <th style="padding:15px;text-align:left;font-weight:600;color:#1a2a4e">Zona</th>
          <th style="padding:15px;text-align:left;font-weight:600;color:#1a2a4e">Precio m²</th>
          <th style="padding:15px;text-align:left;font-weight:600;color:#1a2a4e">ROI Anual</th>
          <th style="padding:15px;text-align:left;font-weight:600;color:#1a2a4e">Recomendación</th>
        </tr>
        <tr style="border-bottom:1px solid #eee">
          <td style="padding:15px;font-weight:600;color:#1a2a4e">Zona 10</td>
          <td style="padding:15px">USD 2,800-3,200</td>
          <td style="padding:15px;color:#ff9500;font-weight:600">12.0%</td>
          <td style="padding:15px">Compra inmediata</td>
        </tr>
        <tr style="border-bottom:1px solid #eee">
          <td style="padding:15px;font-weight:600;color:#1a2a4e">Zona 14</td>
          <td style="padding:15px">USD 2,500-3,000</td>
          <td style="padding:15px;color:#ff9500;font-weight:600">13.3%</td>
          <td style="padding:15px">Altamente recomendado</td>
        </tr>
        <tr style="border-bottom:1px solid #eee">
          <td style="padding:15px;font-weight:600;color:#1a2a4e">Zona 16</td>
          <td style="padding:15px">USD 2,000-2,400</td>
          <td style="padding:15px;color:#27ae60;font-weight:600">17.0%</td>
          <td style="padding:15px">Mejor ROI</td>
        </tr>
        <tr style="border-bottom:1px solid #eee">
          <td style="padding:15px;font-weight:600;color:#1a2a4e">Cayalá</td>
          <td style="padding:15px">USD 3,000-3,500</td>
          <td style="padding:15px;color:#ff9500;font-weight:600">12.7%</td>
          <td style="padding:15px">Estratégica</td>
        </tr>
      </table>
    </div>

    <div style="background:linear-gradient(135deg,#ff9500 0%,#e68a00 100%);color:#fff;padding:40px;border-radius:8px;text-align:center;margin:40px 0">
      <h2 style="margin-bottom:15px">Listo para Invertir?</h2>
      <p style="margin-bottom:25px;font-size:16px">Accede a nuestras herramientas profesionales</p>
      <a href="/herramientas/valuador.html" style="display:inline-block;background:#fff;color:#ff9500;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:700;margin-right:10px">Valuador →</a>
      <a href="/herramientas/calculadora-hipotecaria.html" style="display:inline-block;background:#fff;color:#ff9500;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:700">Calculadora →</a>
    </div>
  </div>
</section>

<script type="application/ld+json">
${JSON.stringify(schemaMarkup, null, 2)}
</script>
`;

  return layout({ title, desc, canonical, body });
}

module.exports = { dashboardInversionistasPage };
