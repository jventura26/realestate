module.exports = () => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Ejecutivo de Inversiones | INMUHUB</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', -apple-system, sans-serif; background: #f8f9fb; color: #2c3e50; line-height: 1.7; }
    .header { background: linear-gradient(135deg, #1a2a4e 0%, #2d4a8a 100%); padding: 25px; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,.15); }
    .logo { font-size: 28px; font-weight: 700; }
    .subtitle { font-size: 12px; opacity: .8; margin-top: 5px; }
    .hero { background: linear-gradient(135deg, #1a2a4e 0%, #2d4a8a 100%); color: #fff; padding: 80px 20px; text-align: center; }
    .hero h1 { font-size: 44px; margin-bottom: 10px; font-weight: 700; }
    .hero p { font-size: 16px; opacity: .9; margin-bottom: 5px; }
    .hero .date { font-size: 12px; opacity: .7; }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    .section { background: #fff; padding: 35px; border-radius: 10px; margin: 30px 0; box-shadow: 0 2px 12px rgba(0,0,0,.08); border-left: 5px solid #ff9500; }
    .section h2 { color: #1a2a4e; margin-bottom: 25px; font-size: 26px; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 30px 0; }
    .stat { background: linear-gradient(135deg, #f8f9fb 0%, #fff 100%); padding: 28px; border-radius: 10px; border-left: 5px solid #ff9500; }
    .stat-value { font-size: 36px; font-weight: 700; color: #ff9500; margin-bottom: 8px; }
    .stat-label { color: #1a2a4e; font-weight: 600; font-size: 15px; }
    table { width: 100%; border-collapse: collapse; margin: 25px 0; }
    th { background: linear-gradient(135deg, #1a2a4e 0%, #2d4a8a 100%); color: #fff; padding: 15px 12px; text-align: left; font-weight: 600; }
    td { padding: 14px 12px; border-bottom: 1px solid #ecf0f1; }
    tr:hover { background: #f8f9fb; }
    .cta { background: linear-gradient(135deg, #ff9500 0%, #e68a00 100%); color: #fff; padding: 45px; border-radius: 10px; text-align: center; margin: 35px 0; box-shadow: 0 4px 15px rgba(255,149,0,.3); }
    .cta h2 { font-size: 28px; margin-bottom: 15px; }
    .cta p { font-size: 15px; margin-bottom: 25px; opacity: .95; }
    .btn { display: inline-block; background: #fff; color: #ff9500; padding: 14px 35px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 15px; margin: 0 10px; cursor: pointer; border: none; }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.2); }
    .footer { background: #1a2a4e; color: #fff; padding: 40px 20px; text-align: center; margin-top: 50px; }
    .footer p { margin: 8px 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">INMUHUB</div>
    <div class="subtitle">Real Estate Intelligence Platform</div>
  </div>

  <div class="hero">
    <h1>Dashboard Ejecutivo de Inversiones</h1>
    <p>Análisis Integral del Mercado Inmobiliario Premium en Guatemala</p>
    <div class="date">Actualizado: Junio 2026</div>
  </div>

  <div class="container">
    <div class="section">
      <h2>📋 Resumen Ejecutivo</h2>
      <div class="stats">
        <div class="stat">
          <div class="stat-value">GTQ 2.85B</div>
          <div class="stat-label">Volumen de Mercado Anual</div>
        </div>
        <div class="stat">
          <div class="stat-value">7.8%</div>
          <div class="stat-label">ROI Promedio Anual</div>
        </div>
        <div class="stat">
          <div class="stat-value">1,245</div>
          <div class="stat-label">Propiedades Premium Activas</div>
        </div>
        <div class="stat">
          <div class="stat-value">34%</div>
          <div class="stat-label">Demanda No Satisfecha</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>🏘️ Análisis por Zona</h2>
      <table>
        <thead>
          <tr>
            <th>Zona</th>
            <th>Precio m²</th>
            <th>Precio Promedio</th>
            <th>ROI</th>
            <th>Tendencia</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Zona 10</b></td>
            <td>GTQ 12,500</td>
            <td>GTQ 3.2M</td>
            <td>6.8%</td>
            <td style="color:#4caf50">📈 +7.2%</td>
          </tr>
          <tr>
            <td><b>Zona 14</b></td>
            <td>GTQ 11,200</td>
            <td>GTQ 2.8M</td>
            <td>7.4%</td>
            <td style="color:#4caf50">📈 +8.1%</td>
          </tr>
          <tr>
            <td><b>Cayalá</b></td>
            <td>GTQ 13,500</td>
            <td>GTQ 3.8M</td>
            <td>7.9%</td>
            <td style="color:#4caf50">📈 +8.5%</td>
          </tr>
          <tr>
            <td><b>Zona 16</b></td>
            <td>GTQ 9,200</td>
            <td>GTQ 2.1M</td>
            <td>9.1%</td>
            <td style="color:#4caf50">📈 +10.2%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section" style="text-align:center;background:#ff9500;color:#fff;border-left:none">
      <h2 style="color:#fff;border-bottom-color:#fff">¿Listo para invertir?</h2>
      <p>Descarga nuestro reporte de análisis o accede a nuestras herramientas</p>
      <button onclick="descargarPDF()" class="btn">📥 Descargar Reporte PDF</button>
      <a href="/vinculo/herramientas/valuador.html" class="btn">🏠 Ir a Valuador</a>
    </div>
  </div>

  <div class="footer">
    <p><strong>&copy; 2026 INMUHUB | Análisis Profesional de Real Estate</strong></p>
    <p>Especialistas en Inversiones Inmobiliarias Premium</p>
    <p style="margin-top:15px;font-size:12px">Datos: Junio 2026 | Actualización: Mensual</p>
  </div>

  <script>
    function descargarPDF() {
      // Crear mensaje temporal
      const btn = event.target;
      const textoOriginal = btn.textContent;
      btn.textContent = '⏳ Preparando...';
      btn.disabled = true;

      // Descargar el PDF
      const link = document.createElement('a');
      link.href = '/files/INMUHUB-Reporte-Inversionistas-2026.pdf';
      link.download = 'INMUHUB-Reporte-Inversionistas-2026.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Restaurar botón
      setTimeout(() => {
        btn.textContent = textoOriginal;
        btn.disabled = false;
      }, 1000);
    }

    const ctx = document.getElementById('rentChart')?.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Zona 10', 'Zona 14', 'Cayalá', 'Zona 16'],
          datasets: [{
            label: 'ROI Anual (%)',
            data: [6.8, 7.4, 7.9, 9.1],
            backgroundColor: '#ff9500'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, max: 10 } }
        }
      });
    }
  </script>
</body>
</html>`;
};
