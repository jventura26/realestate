function dashboardInversionistasPage() {
  return `<section style="padding:0">
  <div style="background:linear-gradient(135deg,#1a2a4e 0%,#2d4a8a 100%);color:#fff;padding:60px 20px;text-align:center">
    <h1 style="font-size:36px;margin-bottom:10px">📊 Dashboard de Inversionistas</h1>
    <p style="font-size:18px;opacity:0.9">Datos de mercado real estate en Guatemala</p>
  </div>
  
  <div style="max-width:1200px;margin:0 auto;padding:20px">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin:40px 0">
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
        <div style="font-size:32px;font-weight:700;color:#ff9500">GTQ 3.2M</div>
        <div style="color:#666;margin-top:8px;font-size:14px">Precio Promedio Zona 10</div>
      </div>
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
        <div style="font-size:32px;font-weight:700;color:#ff9500">+8.5%</div>
        <div style="color:#666;margin-top:8px;font-size:14px">Crecimiento Anual Cayalá</div>
      </div>
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
        <div style="font-size:32px;font-weight:700;color:#ff9500">7.2%</div>
        <div style="color:#666;margin-top:8px;font-size:14px">Rentabilidad Promedio</div>
      </div>
      <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
        <div style="font-size:32px;font-weight:700;color:#ff9500">1,245</div>
        <div style="color:#666;margin-top:8px;font-size:14px">Propiedades Activas</div>
      </div>
    </div>
    
    <div style="background:#fff;padding:30px;border-radius:8px;margin:30px 0;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
      <h2 style="color:#1a2a4e;margin-bottom:20px">Análisis por Zona Premium</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr style="background:#f5f7fa">
          <th style="padding:12px;text-align:left;font-weight:600;border-bottom:2px solid #ddd">Zona</th>
          <th style="padding:12px;text-align:left;font-weight:600;border-bottom:2px solid #ddd">Precio m²</th>
          <th style="padding:12px;text-align:left;font-weight:600;border-bottom:2px solid #ddd">Precio Promedio</th>
          <th style="padding:12px;text-align:left;font-weight:600;border-bottom:2px solid #ddd">ROI Anual</th>
          <th style="padding:12px;text-align:left;font-weight:600;border-bottom:2px solid #ddd">Tendencia</th>
        </tr>
        <tr><td style="padding:12px;border-bottom:1px solid #eee"><b>Zona 10</b></td><td style="padding:12px;border-bottom:1px solid #eee">GTQ 12,500</td><td style="padding:12px;border-bottom:1px solid #eee">GTQ 3.2M</td><td style="padding:12px;border-bottom:1px solid #eee">6.8%</td><td style="padding:12px;border-bottom:1px solid #eee;color:#4caf50">📈 +7.2%</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #eee"><b>Zona 14</b></td><td style="padding:12px;border-bottom:1px solid #eee">GTQ 11,200</td><td style="padding:12px;border-bottom:1px solid #eee">GTQ 2.8M</td><td style="padding:12px;border-bottom:1px solid #eee">7.4%</td><td style="padding:12px;border-bottom:1px solid #eee;color:#4caf50">📈 +8.1%</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #eee"><b>Cayalá</b></td><td style="padding:12px;border-bottom:1px solid #eee">GTQ 13,500</td><td style="padding:12px;border-bottom:1px solid #eee">GTQ 3.8M</td><td style="padding:12px;border-bottom:1px solid #eee">7.9%</td><td style="padding:12px;border-bottom:1px solid #eee;color:#4caf50">📈 +8.5%</td></tr>
        <tr><td style="padding:12px;border-bottom:1px solid #eee"><b>Zona 16</b></td><td style="padding:12px;border-bottom:1px solid #eee">GTQ 9,200</td><td style="padding:12px;border-bottom:1px solid #eee">GTQ 2.1M</td><td style="padding:12px;border-bottom:1px solid #eee">9.1%</td><td style="padding:12px;border-bottom:1px solid #eee;color:#4caf50">📈 +10.2%</td></tr>
      </table>
    </div>
    
    <div style="background:#ff9500;color:#fff;padding:30px;border-radius:8px;margin:30px 0;box-shadow:0 2px 8px rgba(0,0,0,0.1);text-align:center">
      <h2 style="color:#fff;margin-bottom:15px">¿Listo para invertir?</h2>
      <a href="/herramientas/valuador.html" style="display:inline-block;background:#fff;color:#ff9500;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:600">Ir a Valuador →</a>
    </div>
  </div>
</section>`;
}

module.exports = { dashboardInversionistasPage };
