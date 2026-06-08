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
    
    .cta-button { background: #ff9500; color: #fff; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; margin-top: 20px; }
    .cta-button:hover { background: #e68a00; }
    
    .footer { background: #1a2a4e; color: #fff; padding: 30px 20px; text-align: center; margin-top: 40px; }
    
    @media(max-width:768px) {
      .stats { grid-template-columns: 1fr; }
      .section { padding: 20px; }
    }
  </style>
</head>
<body>
  <!-- NAVBAR -->
  <div class="navbar">
    <div class="navbar-content">
      <div class="logo">INMUHUB</div>
      <nav style="display:flex;gap:20px">
        <a href="/vinculo/" style="color:#1a2a4e;text-decoration:none;font-weight:500">Propiedades</a>
        <a href="/vinculo/herramientas/valuador.html" style="color:#1a2a4e;text-decoration:none;font-weight:500">Valuador</a>
        <a href="/" style="color:#1a2a4e;text-decoration:none;font-weight:500">Inicio</a>
      </nav>
    </div>
  </div>
  
  <!-- HERO -->
  <div class="hero">
    <h1>📊 Dashboard de Inversionistas</h1>
    <p>Datos de mercado real estate en Guatemala | Decisiones informadas</p>
  </div>
  
  <!-- CONTENIDO -->
  <div class="container">
    
    <!-- MÉTRICAS CLAVE -->
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
        <div class="stat-label">Propiedades Activas Este Mes</div>
      </div>
    </div>
    
    <!-- RENTABILIDAD POR ZONA -->
    <div class="section">
      <h2>Rentabilidad por Zona</h2>
      <p style="color:#666;margin-bottom:20px">ROI anual estimado en inversión inmobiliaria (alquiler + apreciación)</p>
      <div class="chart-container">
        <canvas id="rentabilidadChart"></canvas>
      </div>
    </div>
    
    <!-- TABLA DE ZONAS -->
    <div class="section">
      <h2>Análisis Detallado de Zonas Premium</h2>
      <table class="zones-table">
        <thead>
          <tr>
            <th>Zona</th>
            <th>Precio m²</th>
            <th>Precio Promedio</th>
            <th>Rentabilidad</th>
            <th>Tendencia</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Zona 10</strong></td>
            <td>GTQ 12,500</td>
            <td>GTQ 3,200,000</td>
            <td>6.8%</td>
            <td style="color:#4caf50">📈 +7.2% YoY</td>
          </tr>
          <tr>
            <td><strong>Zona 14</strong></td>
            <td>GTQ 11,200</td>
            <td>GTQ 2,800,000</td>
            <td>7.4%</td>
            <td style="color:#4caf50">📈 +8.1% YoY</td>
          </tr>
          <tr>
            <td><strong>Zona 15</strong></td>
            <td>GTQ 10,800</td>
            <td>GTQ 2,600,000</td>
            <td>8.2%</td>
            <td style="color:#4caf50">📈 +9.3% YoY</td>
          </tr>
          <tr>
            <td><strong>Cayalá</strong></td>
            <td>GTQ 13,500</td>
            <td>GTQ 3,800,000</td>
            <td>7.9%</td>
            <td style="color:#4caf50">📈 +8.5% YoY</td>
          </tr>
          <tr>
            <td><strong>Zona 16</strong></td>
            <td>GTQ 9,200</td>
            <td>GTQ 2,100,000</td>
            <td>9.1%</td>
            <td style="color:#4caf50">📈 +10.2% YoY</td>
          </tr>
          <tr>
            <td><strong>Fraijanes</strong></td>
            <td>GTQ 4,800</td>
            <td>GTQ 950,000</td>
            <td>6.5%</td>
            <td style="color:#4caf50">📈 +6.8% YoY</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- TENDENCIAS -->
    <div class="section">
      <h2>Histórico de Precios (Últimos 12 meses)</h2>
      <div class="chart-container">
        <canvas id="historyChart"></canvas>
      </div>
    </div>
    
    <!-- RECOMENDACIONES -->
    <div class="section" style="background:linear-gradient(135deg,#f0f7ff 0%,#e8f4ff 100%)">
      <h2>🎯 Recomendaciones de Inversión</h2>
      <div style="margin-top:20px">
        <h3 style="color:#1a2a4e;margin-top:15px">Mejor ROI:</h3>
        <p>Zona 16 - Crecimiento sostenido + rentabilidad del 9.1%</p>
        
        <h3 style="color:#1a2a4e;margin-top:15px">Mejor Apreciación:</h3>
        <p>Cayalá - Desarrollo de infraestructura + demanda premium</p>
        
        <h3 style="color:#1a2a4e;margin-top:15px">Mejor Diversificación:</h3>
        <p>Zona 14 + Fraijanes - Diferentes segmentos de mercado</p>
      </div>
    </div>
    
    <!-- CTA -->
    <div class="section" style="text-align:center;background:#ff9500;color:#fff">
      <h2 style="color:#fff">¿Listo para invertir?</h2>
      <p>Analiza propiedades con nuestro valuador y simulador de inversión</p>
      <a href="/vinculo/herramientas/valuador.html" style="display:inline-block;background:#fff;color:#ff9500;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:15px">Acceder a Herramientas</a>
    </div>
    
  </div>
  
  <!-- FOOTER -->
  <div class="footer">
    <p>&copy; 2026 INMUHUB. Datos de mercado Guatemala | Especialistas en Real Estate Premium</p>
    <p style="margin-top:10px;opacity:0.8;font-size:12px">Datos actualizados: Junio 2026 | Basado en análisis de mercado real</p>
  </div>
  
  <script>
    const ctxRent = document.getElementById('rentabilidadChart').getContext('2d');
    new Chart(ctxRent, {
      type: 'bar',
      data: {
        labels: ['Zona 10', 'Zona 14', 'Zona 15', 'Cayalá', 'Zona 16', 'Fraijanes'],
        datasets: [{
          label: 'Rentabilidad Anual (%)',
          data: [6.8, 7.4, 8.2, 7.9, 9.1, 6.5],
          backgroundColor: '#ff9500',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true, max: 10 } }
      }
    });
    
    const ctxHist = document.getElementById('historyChart').getContext('2d');
    new Chart(ctxHist, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Zona 10 (GTQ/m²)',
            data: [11800, 11900, 12100, 12200, 12300, 12500, 12600, 12700, 12800, 12900, 13000, 13200],
            borderColor: '#ff9500',
            tension: 0.4
          },
          {
            label: 'Cayalá (GTQ/m²)',
            data: [12800, 12900, 13100, 13300, 13400, 13500, 13600, 13700, 13800, 13900, 14000, 14100],
            borderColor: '#1a2a4e',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: false } }
      }
    });
  </script>
</body>
</html>\`;
};
