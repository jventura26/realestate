module.exports = () => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard INMUHUB 2024</title>
<style>
body { font-family: -apple-system, sans-serif; margin: 0; padding: 20px; background: #f5f7fa; }
header { background: #1a2a4e; color: white; padding: 20px; text-align: center; margin-bottom: 20px; border-radius: 8px; }
section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ff9500; }
h2 { color: #1a2a4e; margin-top: 0; }
.stat { background: #fff9f0; padding: 15px; margin: 10px 0; border-left: 4px solid #ff9500; border-radius: 4px; }
.stat-value { font-size: 24px; font-weight: bold; color: #ff9500; }
.stat-label { font-size: 12px; color: #666; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
th { background: #f5f7fa; border-bottom: 2px solid #ff9500; font-weight: bold; }
</style>
</head>
<body>
<header>
<h1>📊 Dashboard INMUHUB</h1>
<p>Real Estate Premium Guatemala 2026</p>
</header>
<section>
<h2>📈 Mercado Guatemala</h2>
<div class="stat"><div class="stat-value">7.8%</div><div class="stat-label">ROI Promedio</div></div>
<div class="stat"><div class="stat-value">1,245</div><div class="stat-label">Propiedades Premium</div></div>
<div class="stat"><div class="stat-value">+34%</div><div class="stat-label">Demanda Activa</div></div>
</section>
<section>
<h2>🏘️ Zonas Recomendadas</h2>
<table>
<tr><th>Zona</th><th>ROI</th><th>Precio m²</th></tr>
<tr><td>Zona 10</td><td>12.0%</td><td>GTQ 12,500</td></tr>
<tr><td>Zona 14</td><td>13.3%</td><td>GTQ 11,200</td></tr>
<tr><td>Zona 16</td><td>17.0%</td><td>GTQ 9,200</td></tr>
<tr><td>Cayalá</td><td>12.7%</td><td>GTQ 13,500</td></tr>
</table>
</section>
</body>
</html>`;
