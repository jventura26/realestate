const mortgageCalculator = () => {
  const html = `
<div style="max-width:900px;margin:0 auto;padding:20px">

<div style="background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:6px;margin-bottom:20px;font-size:11px;color:#333">
⚠️ Las tasas pueden variar según perfil crediticio, enganche, plazo, tipo de propiedad y condiciones vigentes.
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0">

<div>
<label style="font-weight:600;color:#1a2a4e">Precio Propiedad (Q)</label>
<input type="number" id="precio" value="2500000" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd;border-radius:6px">

<label style="font-weight:600;color:#1a2a4e">Enganche (%)</label>
<input type="number" id="enganche" value="30" min="10" max="80" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd;border-radius:6px">

<label style="font-weight:600;color:#1a2a4e">Plazo (Años)</label>
<input type="number" id="plazo" value="20" min="5" max="30" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd;border-radius:6px">

<label style="font-weight:600;color:#1a2a4e">Banco</label>
<select id="banco" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd;border-radius:6px">
  <option value="6.90">G&T Continental (6.90%)</option>
  <option value="8.50">BAC Guatemala (8.50%)</option>
  <option value="8.50">Banco Industrial (8.50%)</option>
</select>

<button onclick="calcularHipoteca()" style="width:100%;padding:12px;background:#ff9500;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;margin-top:20px;font-size:14px">CALCULAR</button>
</div>

<div style="display:flex;flex-direction:column;gap:12px">
<div style="background:#f0f0f0;padding:15px;border-radius:8px;border-left:4px solid #ff9500">
  <p style="margin:0;font-size:12px;color:#666">Cuota Mensual</p>
  <p id="res-cuota" style="margin:8px 0 0;font-size:28px;font-weight:700;color:#ff9500">Q 10,500</p>
</div>

<div style="background:#f0f0f0;padding:15px;border-radius:8px;border-left:4px solid #1a2a4e">
  <p style="margin:0;font-size:12px;color:#666">Enganche</p>
  <p id="res-enganche" style="margin:8px 0 0;font-size:20px;font-weight:600;color:#1a2a4e">Q 750,000</p>
</div>

<div style="background:#f0f0f0;padding:15px;border-radius:8px;border-left:4px solid #1a2a4e">
  <p style="margin:0;font-size:12px;color:#666">A Financiar</p>
  <p id="res-financiar" style="margin:8px 0 0;font-size:20px;font-weight:600;color:#1a2a4e">Q 1,750,000</p>
</div>

<div style="background:#f0f0f0;padding:15px;border-radius:8px;border-left:4px solid #1a2a4e">
  <p style="margin:0;font-size:12px;color:#666">Total Intereses</p>
  <p id="res-intereses" style="margin:8px 0 0;font-size:20px;font-weight:600;color:#1a2a4e">Q 770,000</p>
</div>
</div>

</div>

<script>
function calcularHipoteca() {
  const precio = parseFloat(document.getElementById('precio').value) || 0;
  const enganche = parseFloat(document.getElementById('enganche').value) || 0;
  const plazo = parseFloat(document.getElementById('plazo').value) || 1;
  const tasa = parseFloat(document.getElementById('banco').value) || 7;

  const engancheQ = precio * (enganche / 100);
  const aFinanciar = precio - engancheQ;
  const tasaMensual = tasa / 100 / 12;
  const meses = plazo * 12;
  
  const cuotaMensual = aFinanciar > 0 
    ? (aFinanciar * tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1)
    : 0;
  
  const totalPagado = cuotaMensual * meses;
  const totalIntereses = totalPagado - aFinanciar;

  const fmt = n => 'Q ' + Math.round(n).toLocaleString('es-GT');

  document.getElementById('res-enganche').textContent = fmt(engancheQ);
  document.getElementById('res-financiar').textContent = fmt(aFinanciar);
  document.getElementById('res-cuota').textContent = fmt(cuotaMensual);
  document.getElementById('res-intereses').textContent = fmt(totalIntereses);
}

// Calcular al cargar
calcularHipoteca();
document.getElementById('precio').addEventListener('change', calcularHipoteca);
document.getElementById('enganche').addEventListener('change', calcularHipoteca);
document.getElementById('plazo').addEventListener('change', calcularHipoteca);
document.getElementById('banco').addEventListener('change', calcularHipoteca);
</script>
`;
  return html;
};

module.exports = { mortgageCalculator };
