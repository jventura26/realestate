const { layout } = require('./layout');
const { escapeHtml, parsePriceToUSD } = require('../../shared/utils');

// Datos de Mercado — snapshot real del inventario activo publicado en InmuHub.
// Reemplaza una version anterior de esta pagina que mostraba cifras 100%
// inventadas (ej. "1,245 propiedades activas" cuando el inventario real tiene
// ~25, "20 zonas analizadas", "7.8% ROI promedio", rangos de precio por Zona 10/
// 14/16/Cayala que ni siquiera corresponden a las zonas reales del inventario).
// Esta version solo muestra numeros calculados directamente del inventario real
// (props) al momento del build. No se inventa ROI, rentabilidad ni proyecciones
// porque esos datos no existen en el sistema (no hay historico de ventas
// cerradas ni rentas) - mostrar eso seria repetir el mismo error.
function fmtUSD(n) {
  return '$ ' + Math.round(n).toLocaleString('en-US');
}

function computeMarketStats(props) {
  const activos = (props || []).filter(function(p){ return p.estado !== 'Inactiva' && p.estado !== 'Vendida'; });

  const conPrecio = activos.map(function(p) {
    const usd = parsePriceToUSD(p.precio);
    return Object.assign({}, p, { precioUSD: usd });
  }).filter(function(p){ return p.precioUSD && p.precioUSD > 0; });

  const totalActivas = activos.length;
  const totalConPrecio = conPrecio.length;
  const valorTotalUSD = conPrecio.reduce(function(sum, p){ return sum + p.precioUSD; }, 0);
  const precioPromedioUSD = totalConPrecio > 0 ? valorTotalUSD / totalConPrecio : 0;

  // Agrupar por zona (municipio) — usar "Otras zonas" para registros sin municipio,
  // en vez de descartarlos silenciosamente.
  const porZona = {};
  conPrecio.forEach(function(p) {
    const zona = (p.municipio && p.municipio.trim()) ? p.municipio.trim() : 'Otras zonas';
    if (!porZona[zona]) porZona[zona] = [];
    porZona[zona].push(p.precioUSD);
  });
  const zonasStats = Object.keys(porZona).map(function(zona) {
    const precios = porZona[zona];
    const avg = precios.reduce(function(a,b){ return a+b; }, 0) / precios.length;
    return {
      zona: zona,
      count: precios.length,
      avg: avg,
      min: Math.min.apply(null, precios),
      max: Math.max.apply(null, precios),
    };
  }).sort(function(a,b){ return b.count - a.count; });

  // Agrupar por tipo de propiedad
  const porTipo = {};
  conPrecio.forEach(function(p) {
    const tipo = p.tipo || 'Sin clasificar';
    if (!porTipo[tipo]) porTipo[tipo] = [];
    porTipo[tipo].push(p.precioUSD);
  });
  const tiposStats = Object.keys(porTipo).map(function(tipo) {
    const precios = porTipo[tipo];
    const avg = precios.reduce(function(a,b){ return a+b; }, 0) / precios.length;
    return { tipo: tipo, count: precios.length, avg: avg };
  }).sort(function(a,b){ return b.count - a.count; });

  return {
    totalActivas: totalActivas,
    totalConPrecio: totalConPrecio,
    zonasCount: zonasStats.length,
    valorTotalUSD: valorTotalUSD,
    precioPromedioUSD: precioPromedioUSD,
    zonasStats: zonasStats,
    tiposStats: tiposStats,
  };
}

function dashboardInversionistasPage(props) {
  const title = 'Datos de Mercado Inmobiliario en Guatemala 2026 | InmuHub';
  const desc = 'Precio promedio, rangos y distribución por zona del inventario real de propiedades activas en InmuHub.';
  const canonical = '/herramientas/datos-mercado.html';
  const stats = computeMarketStats(props || []);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Datos de Mercado InmuHub",
    "description": desc,
    "url": "https://inmuhub.com" + canonical,
    "applicationCategory": "BusinessApplication",
    "author": { "@type": "Organization", "name": "INMUHUB" }
  };

  const zonaRows = stats.zonasStats.map(function(z) {
    return `<tr style="border-bottom:1px solid #eee">
      <td style="padding:14px 15px;font-weight:600;color:#1a2a4e">${escapeHtml(z.zona)}</td>
      <td style="padding:14px 15px">${z.count}</td>
      <td style="padding:14px 15px">${fmtUSD(z.avg)}</td>
      <td style="padding:14px 15px;color:#666">${fmtUSD(z.min)} — ${fmtUSD(z.max)}</td>
    </tr>`;
  }).join('');

  const tipoRows = stats.tiposStats.map(function(t) {
    return `<tr style="border-bottom:1px solid #eee">
      <td style="padding:14px 15px;font-weight:600;color:#1a2a4e">${escapeHtml(t.tipo)}</td>
      <td style="padding:14px 15px">${t.count}</td>
      <td style="padding:14px 15px">${fmtUSD(t.avg)}</td>
    </tr>`;
  }).join('');

  const body = `<section style="padding:0">
  <div style="background:linear-gradient(135deg,#0a1628 0%,#1a3a5c 100%);color:#fff;padding:60px 20px;text-align:center">
    <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:clamp(1.8rem,4vw,2.6rem);margin-bottom:10px">Datos de Mercado Inmobiliario</h1>
    <p style="font-size:16px;opacity:.75;max-width:640px;margin:0 auto">Snapshot calculado directamente del inventario activo publicado en InmuHub — sin proyecciones ni cifras estimadas.</p>
  </div>

  <div style="max-width:1200px;margin:0 auto;padding:20px">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:20px;margin:40px 0">
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="font-size:32px;font-weight:700;color:#c9a96e">${stats.totalActivas}</div>
        <div style="color:#1a2a4e;font-weight:600;margin-top:8px">Propiedades activas</div>
        <div style="color:#666;font-size:12px">Publicadas actualmente en InmuHub</div>
      </div>
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="font-size:32px;font-weight:700;color:#c9a96e">${stats.zonasCount}</div>
        <div style="color:#1a2a4e;font-weight:600;margin-top:8px">Zonas con inventario</div>
        <div style="color:#666;font-size:12px">Municipios/zonas con al menos 1 propiedad</div>
      </div>
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="font-size:32px;font-weight:700;color:#c9a96e">${fmtUSD(stats.precioPromedioUSD)}</div>
        <div style="color:#1a2a4e;font-weight:600;margin-top:8px">Precio promedio</div>
        <div style="color:#666;font-size:12px">Sobre ${stats.totalConPrecio} propiedades con precio publicado</div>
      </div>
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="font-size:32px;font-weight:700;color:#c9a96e">${fmtUSD(stats.valorTotalUSD)}</div>
        <div style="color:#1a2a4e;font-weight:600;margin-top:8px">Valor total del inventario</div>
        <div style="color:#666;font-size:12px">Suma de precios de listado, no ventas cerradas</div>
      </div>
    </div>

    <div style="background:#fff;padding:30px;border-radius:8px;margin:40px 0;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
      <h2 style="color:#1a2a4e;margin-bottom:20px;font-size:22px">Precio promedio por zona</h2>
      <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;min-width:520px">
        <tr style="background:#f8f9fb;border-bottom:2px solid #ddd">
          <th style="padding:14px 15px;text-align:left;font-weight:600;color:#1a2a4e">Zona</th>
          <th style="padding:14px 15px;text-align:left;font-weight:600;color:#1a2a4e"># Propiedades</th>
          <th style="padding:14px 15px;text-align:left;font-weight:600;color:#1a2a4e">Precio promedio</th>
          <th style="padding:14px 15px;text-align:left;font-weight:600;color:#1a2a4e">Rango</th>
        </tr>
        ${zonaRows || '<tr><td colspan="4" style="padding:20px;text-align:center;color:#94a3b8">Sin datos suficientes todavía.</td></tr>'}
      </table>
      </div>
    </div>

    <div style="background:#fff;padding:30px;border-radius:8px;margin:40px 0;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
      <h2 style="color:#1a2a4e;margin-bottom:20px;font-size:22px">Precio promedio por tipo de propiedad</h2>
      <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;min-width:420px">
        <tr style="background:#f8f9fb;border-bottom:2px solid #ddd">
          <th style="padding:14px 15px;text-align:left;font-weight:600;color:#1a2a4e">Tipo</th>
          <th style="padding:14px 15px;text-align:left;font-weight:600;color:#1a2a4e"># Propiedades</th>
          <th style="padding:14px 15px;text-align:left;font-weight:600;color:#1a2a4e">Precio promedio</th>
        </tr>
        ${tipoRows || '<tr><td colspan="3" style="padding:20px;text-align:center;color:#94a3b8">Sin datos suficientes todavía.</td></tr>'}
      </table>
      </div>
    </div>

    <p style="font-size:12px;color:#94a3b8;margin:24px 0 40px;line-height:1.7">
      Precios convertidos a USD con un tipo de cambio referencial de Q7.66 cuando la propiedad está publicada en quetzales.
      Estas cifras reflejan el inventario activo publicado en InmuHub al momento de generar esta página, no representan
      ventas cerradas, rentabilidad histórica ni proyecciones de mercado.
    </p>

    <div style="background:linear-gradient(135deg,#c9a96e 0%,#a8874f 100%);color:#0a1628;padding:40px;border-radius:8px;text-align:center;margin:40px 0">
      <h2 style="margin-bottom:15px;font-weight:700">¿Buscas invertir en Guatemala?</h2>
      <p style="margin-bottom:25px;font-size:16px">Explora el inventario completo o habla con un asesor.</p>
      <a href="/propiedades.html" style="display:inline-block;background:#0a1628;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:700;margin-right:10px">Ver propiedades →</a>
      <a href="/asesores.html" style="display:inline-block;background:#0a1628;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:700">Hablar con un asesor →</a>
    </div>
  </div>
</section>

<script type="application/ld+json">
${JSON.stringify(schemaMarkup, null, 2)}
</script>
`;

  return layout({ title, desc, canonical, body });
}

module.exports = { dashboardInversionistasPage, computeMarketStats };
