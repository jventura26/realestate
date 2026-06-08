module.exports = () => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard de Inversionistas | INMUHUB</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f7fa; color: #1a2a4e; }
    .navbar { background: #fff; padding: 15px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
    .navbar-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: clamp(70px,12vw,200px); font-weight: 700; color: #1a2a4e; }
    .hero { background: linear-gradient(135deg, #1a2a4e 0%, #2d4a8a 100%); color: #fff; padding: clamp(40px,8vw,80px) 20px; text-align: center; }
    .hero h1 { font-size: clamp(28px,6vw,48px); margin-bottom: 10px; }
    .hero p { font-size: clamp(14px,3vw,18px); opacity: 0.9; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 40px 0; }
    .stat-card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .stat-value { font-size: 32px; font-weight: 700; color: #ff9500; }
    .stat-label { color: #666; margin-top: 8px; font-size: 14px; }
    .section { background: #fff; padding: 30px; border-radius: 8px; margin: 30px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .section h2 { color: #1a2a4e; margin-bottom: 20px; font-size: clamp(20px,4vw,28px); }
    .chart-container { position: relative; height: 300px; margin: 20px 0; }
    .zones-table { width: 100%; border-collapse: collapse; }
    .zones-table th { background: #f5f7fa; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #ddd; }
    .zones-table td { padding: 12px; border-bottom: 1px solid #eee; }
    .zones-table tr:hover { background: #f9f9f9; }
    .footer { background: #1a2a4e; color: #fff; padding: 30px 20px; text-align: center; margin-top: 40px; }
    @media(max-width:768px) { .stats { grid-template-columns: 1fr; } .section { padding: 20px; } }
  </style>
</head>
<body>
  <div class="navbar">
    <div class="navbar-content">
      <div class="logo">INMUHUB</div>
      <nav style="display:flex;gap:20px">
        <a href="/vinculo/" style="color:#1a2a4e;text-decoration:none;font-weight:500">Propiedades</a>
        <a href="/vinculo/herramientas/valuador.html" style="color:#1a2a4e;text-decoration:none;font-weight:500">Valuador</a>
      </nav>
    </div>
  </div>
  
  <div class="hero">
    <h1>📊 Dashboard de Inversionistas</h1>
    <p>Datos de mercado real estate en Guatemala</p>
  </div>
  
  <div class="container">
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">GTQ 3.2M</div>
        <div class="stat-label">Precio Promedio Zona 10</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">+8.5%</div>
        <div class="stat-label">Crecimiento Anual Cayalá</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">7.2%</div>
        <div class="stat-label">Rentabilidad Promedio</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">1,245</div>
        <div class="stat-label">Propiedades Activas</div>
      </div>
    </div>
    
    <div class="section">
      <h2>Rentabilidad por Zona</h2>
      <p style="color:#666;margin-bottom:20px">ROI anual estimado (alquiler + apreciación)</p>
      <div class="chart-container">
        <canvas id="rentChart"></canvas>
      </div>
    </div>
    
    <div class="section">
      <h2>Análisis por Zona</h2>
      <table class="zones-table">
        <tr>
          <th>Zona</th>
          <th>Precio m²</th>
          <th>Precio Promedio</th>
          <th>ROI</th>
          <th>Tendencia</th>
        </tr>
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
      </table>
    </div>
    
    <div class="section" style="text-align:center;background:#ff9500;color:#fff">
      <h2 style="color:#fff">¿Listo para invertir?</h2>
      <p>Usa nuestras herramientas de análisis</p>
      <a href="/vinculo/herramientas/valuador.html" style="display:inline-block;background:#fff;color:#ff9500;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:15px">Ir a Valuador</a>
    </div>
  </div>
  
  <div class="footer">
    <p>&copy; 2026 INMUHUB | Datos de mercado Guatemala</p>
  </div>
  
  <script>
    const ctx = document.getElementById('rentChart').getContext('2d');
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
  </script>
</body>
</html>\`;
};
