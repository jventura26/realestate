module.exports = () => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Calculadora Hipotecaria INMUHUB</title>
<style>
body { font-family: -apple-system, sans-serif; margin: 0; padding: 20px; background: #f5f7fa; }
header { background: #1a2a4e; color: white; padding: 20px; text-align: center; margin-bottom: 20px; border-radius: 8px; }
section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ff9500; }
h2 { color: #1a2a4e; margin-top: 0; }
label { display: block; margin: 10px 0 5px; font-weight: bold; color: #1a2a4e; }
input, select { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
.result { background: #fff9f0; padding: 15px; margin: 10px 0; border-left: 4px solid #ff9500; border-radius: 4px; }
.result-value { font-size: 24px; font-weight: bold; color: #ff9500; margin: 10px 0; }
.result-label { font-size: 12px; color: #666; }
button { background: #ff9500; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%; }
button:hover { background: #e68a00; }
</style>
</head>
<body>
<header>
<h1>💳 Calculadora Hipotecaria</h1>
<p>Análisis Financiero Guatemala</p>
</header>
<section>
<h2>📊 Datos</h2>
<label>Precio (GTQ)</label>
<input type="number" id="price" value="2500000">
<label>Enganche (%)</label>
<input type="number" id="down" value="30">
<label>Plazo (Años)</label>
<input type="number" id="term" value="20">
<h2>🏦 Banco</h2>
<label><input type="radio" name="bank" value="7.0" checked> G&T (7.0%)</label>
<label><input type="radio" name="bank" value="7.2"> Agromercantil (7.2%)</label>
<label><input type="radio" name="bank" value="7.5"> Industrial (7.5%)</label>
<label><input type="radio" name="bank" value="7.8"> Santander (7.8%)</label>
<button onclick="calc()">Calcular</button>
</section>
<section>
<h2>💰 Resultados</h2>
<div class="result">
<div class="result-label">Enganche</div>
<div class="result-value" id="eng">GTQ 750,000</div>
</div>
<div class="result">
<div class="result-label">A Financiar</div>
<div class="result-value" id="fin">GTQ 1,750,000</div>
</div>
<div class="result">
<div class="result-label">Cuota Mensual</div>
<div class="result-value" id="cuota">GTQ 10,500</div>
</div>
<div class="result">
<div class="result-label">Intereses</div>
<div class="result-value" id="int">GTQ 770,000</div>
</div>
</section>
<script>
function calc(){const p=parseFloat(document.getElementById('price').value)||2500000;const d=parseFloat(document.getElementById('down').value)||30;const t=parseFloat(document.getElementById('term').value)||20;const r=parseFloat(document.querySelector('input[name="bank"]:checked').value)||7;const down=p*(d/100);const loan=p-down;const mr=r/100/12;const m=t*12;const c=loan*(mr*Math.pow(1+mr,m))/(Math.pow(1+mr,m)-1);const i=(c*m)-loan;const fmt=n=>'GTQ '+Math.round(n).toLocaleString('es-ES');document.getElementById('eng').textContent=fmt(down);document.getElementById('fin').textContent=fmt(loan);document.getElementById('cuota').textContent=fmt(c);document.getElementById('int').textContent=fmt(i);}calc();document.querySelectorAll('input').forEach(x=>x.addEventListener('change',calc));
</script>
</body>
</html>`;
