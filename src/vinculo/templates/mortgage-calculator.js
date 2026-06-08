const mortgageCalculator = () => `
<div style="max-width:800px;margin:0 auto;padding:20px">

<h2>Simulación Hipotecaria Avanzada</h2>

<div style="background:#fff3cd;border:1px solid #ffc107;padding:15px;border-radius:6px;margin-bottom:20px;font-size:12px;color:#333">
<strong>⚠️ Importante:</strong> Las tasas pueden variar según perfil crediticio, enganche, plazo, tipo de propiedad y condiciones vigentes de cada institución financiera. Recomendamos realizar una precalificación bancaria para obtener una cotización personalizada.
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0">

<div>
<label>Precio Propiedad (Q)</label>
<input type="number" id="precio" value="2500000" style="width:100%;padding:10px;margin:10px 0">

<label>Enganche (%)</label>
<input type="number" id="enganche" value="30" min="10" max="80" style="width:100%;padding:10px;margin:10px 0">

<label>Plazo (Años)</label>
<input type="number" id="plazo" value="20" min="5" max="30" style="width:100%;padding:10px;margin:10px 0">

<label>Selecciona Banco</label>
<select id="banco" style="width:100%;padding:10px;margin:10px 0">
  <option value="6.90">G&T Continental (6.90%)</option>
  <option value="8.50">BAC Guatemala (8.50%)</option>
  <option value="8.50">Banco Industrial (8.50%)</option>
</select>

<button onclick="calcular()" style="width:100%;padding:12px;background:#ff9500;color:#fff;border:none;cursor:pointer;font-weight:600;margin-top:20px">CALCULAR</button>
</div>

<div id="resultados" style="background:#f5f7fa;padding:20px;border-radius:8px">
  <h3 style="color:#1a2a4e;margin-bottom:15px">Resumen Financiero</h3>
  <p><strong>Enganche:</strong> <span id="res-enganche">Q 750,000</span></p>
  <p><strong>A Financiar:</strong> <span id="res-financiar">Q 1,750,000</span></p>
  <p><strong>Cuota Mensual:</strong> <span id="res-cuota" style="color:#ff9500;font-size:20px;font-weight:bold">Q 10,500</span></p>
  <p><strong>Intereses (20 años):</strong> <span id="res-intereses">Q 770,000</span></p>
  
  <hr style="margin:15px 0">
  
  <h4 style="color:#1a2a4e;margin:10px 0">Impuestos y Gastos</h4>
  <p><strong>IUSI Anual:</strong> <span id="res-iusi">Q 3,000</span></p>
  <p><strong>Seguro Mensual:</strong> <span id="res-seguro">Q 730</span></p>
  <p><strong>Comisión Bancaria:</strong> <span id="res-comision">Q 8,750</span></p>
  
  <hr style="margin:15px 0">
  
  <p><strong>Cuota Total Mensual + Extras:</strong> <span id="res-total-mensual" style="color:#ff9500;font-size:18px;font-weight:bold">Q 11,230</span></p>
</div>

</div>

<script>
function calcular(){
  const precio = parseFloat(document.getElementById('precio').value) || 2500000;
  const enganchePct = parseFloat(document.getElementById('enganche').value) || 30;
  const plazo = parseFloat(document.getElementById('plazo').value) || 20;
  const tasa = parseFloat(document.getElementById('banco').value) || 6.90;
  
  const enganche = precio * (enganchePct / 100);
  const aFinanciar = precio - enganche;
  const tasaMensual = tasa / 100 / 12;
  const meses = plazo * 12;
  const cuota = aFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1);
  const intereses = (cuota * meses) - aFinanciar;
  
  const iusiAnual = precio * 0.0012;
  const seguroMensual = precio * 0.0035 / 12;
  const comision = aFinanciar * 0.005;
  const totalMensualConExtras = cuota + seguroMensual + (iusiAnual / 12);
  
  const fmt = n => 'Q ' + Math.round(n).toLocaleString('es-ES');
  
  document.getElementById('res-enganche').textContent = fmt(enganche);
  document.getElementById('res-financiar').textContent = fmt(aFinanciar);
  document.getElementById('res-cuota').textContent = fmt(cuota);
  document.getElementById('res-intereses').textContent = fmt(intereses);
  document.getElementById('res-iusi').textContent = fmt(iusiAnual);
  document.getElementById('res-seguro').textContent = fmt(seguroMensual);
  document.getElementById('res-comision').textContent = fmt(comision);
  document.getElementById('res-total-mensual').textContent = fmt(totalMensualConExtras);
}

calcular();
document.getElementById('precio').addEventListener('change', calcular);
document.getElementById('enganche').addEventListener('change', calcular);
document.getElementById('plazo').addEventListener('change', calcular);
document.getElementById('banco').addEventListener('change', calcular);
</script>

</div>
`;

module.exports = { mortgageCalculator };
