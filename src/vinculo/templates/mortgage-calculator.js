<!-- Build: 1780967280 -->
const mortgageCalculator = () => {
  const html = `
<div style="max-width:1100px;margin:0 auto;padding:20px">

<div style="background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:6px;margin-bottom:20px;font-size:11px;color:#333">
⚠️ Las tasas pueden variar según perfil crediticio, enganche, plazo, tipo de propiedad y condiciones vigentes.
</div>

<div style="display:flex;justify-content:center;gap:8px;margin-bottom:24px">
  <button id="btn-gtq" onclick="setMoneda('GTQ')" style="padding:10px 24px;border-radius:20px;border:1.5px solid #1a2a4e;background:#1a2a4e;color:#fff;font-weight:700;cursor:pointer;font-size:13px">Quetzales (Q)</button>
  <button id="btn-usd" onclick="setMoneda('USD')" style="padding:10px 24px;border-radius:20px;border:1.5px solid #1a2a4e;background:#fff;color:#1a2a4e;font-weight:700;cursor:pointer;font-size:13px">Dólares ($)</button>
</div>
<p id="tipo-cambio-note" style="text-align:center;font-size:11px;color:#888;margin:-12px 0 20px">1 USD ≈ Q 7.66 (referencial)</p>

<div style="display:grid;grid-template-columns:1fr;gap:16px;max-width:520px;margin:0 auto 32px">
  <div>
    <label style="font-weight:600;color:#1a2a4e;font-size:13px">Precio de la propiedad (<span id="lbl-moneda-precio">Q</span>)</label>
    <input type="number" id="precio" value="2500000" style="width:100%;padding:10px;margin:8px 0;border:1px solid #ddd;border-radius:6px;box-sizing:border-box">
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div>
      <label style="font-weight:600;color:#1a2a4e;font-size:13px">Enganche (%)</label>
      <input type="number" id="enganche" value="30" min="10" max="80" style="width:100%;padding:10px;margin:8px 0;border:1px solid #ddd;border-radius:6px;box-sizing:border-box">
    </div>
    <div>
      <label style="font-weight:600;color:#1a2a4e;font-size:13px">Plazo (años)</label>
      <input type="number" id="plazo" value="20" min="5" max="30" style="width:100%;padding:10px;margin:8px 0;border:1px solid #ddd;border-radius:6px;box-sizing:border-box">
    </div>
  </div>
</div>

<h3 style="text-align:center;font-size:20px;color:#1a2a4e;margin-bottom:6px">Compara los 3 bancos lado a lado</h3>
<p style="text-align:center;font-size:13px;color:#777;margin-bottom:20px">Misma propiedad, mismo enganche, mismo plazo — solo cambia la tasa.</p>

<div id="bancos-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">

  <div class="banco-card" data-tasa="6.90" style="background:#f8f9fa;border:2px solid #1a2a4e;border-radius:10px;padding:20px;position:relative">
    <div style="position:absolute;top:-11px;left:16px;background:#1a2a4e;color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px">MENOR TASA</div>
    <p style="margin:8px 0 2px;font-weight:700;color:#1a2a4e;font-size:15px">G&amp;T Continental</p>
    <p style="margin:0 0 14px;font-size:12px;color:#888">6.90% anual</p>
    <p style="margin:0;font-size:11px;color:#666">Cuota mensual</p>
    <p class="res-cuota" style="margin:2px 0 12px;font-size:24px;font-weight:700;color:#1a2a4e">—</p>
    <p style="margin:0;font-size:11px;color:#666">Total intereses</p>
    <p class="res-intereses" style="margin:2px 0;font-size:14px;font-weight:600;color:#444">—</p>
  </div>

  <div class="banco-card" data-tasa="8.50" style="background:#f8f9fa;border:1.5px solid #ddd;border-radius:10px;padding:20px">
    <p style="margin:8px 0 2px;font-weight:700;color:#1a2a4e;font-size:15px">BAC Guatemala</p>
    <p style="margin:0 0 14px;font-size:12px;color:#888">8.50% anual</p>
    <p style="margin:0;font-size:11px;color:#666">Cuota mensual</p>
    <p class="res-cuota" style="margin:2px 0 12px;font-size:24px;font-weight:700;color:#1a2a4e">—</p>
    <p style="margin:0;font-size:11px;color:#666">Total intereses</p>
    <p class="res-intereses" style="margin:2px 0;font-size:14px;font-weight:600;color:#444">—</p>
  </div>

  <div class="banco-card" data-tasa="8.50" style="background:#f8f9fa;border:1.5px solid #ddd;border-radius:10px;padding:20px">
    <p style="margin:8px 0 2px;font-weight:700;color:#1a2a4e;font-size:15px">Banco Industrial</p>
    <p style="margin:0 0 14px;font-size:12px;color:#888">8.50% anual</p>
    <p style="margin:0;font-size:11px;color:#666">Cuota mensual</p>
    <p class="res-cuota" style="margin:2px 0 12px;font-size:24px;font-weight:700;color:#1a2a4e">—</p>
    <p style="margin:0;font-size:11px;color:#666">Total intereses</p>
    <p class="res-intereses" style="margin:2px 0;font-size:14px;font-weight:600;color:#444">—</p>
  </div>

</div>

<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:16px;max-width:700px;margin-left:auto;margin-right:auto">
  <div style="text-align:center">
    <p style="margin:0;font-size:11px;color:#666">Enganche</p>
    <p id="res-enganche" style="margin:2px 0;font-size:15px;font-weight:600;color:#1a2a4e">—</p>
  </div>
  <div style="text-align:center">
    <p style="margin:0;font-size:11px;color:#666">Monto a financiar</p>
    <p id="res-financiar" style="margin:2px 0;font-size:15px;font-weight:600;color:#1a2a4e">—</p>
  </div>
  <div style="text-align:center">
    <p style="margin:0;font-size:11px;color:#666">Cuotas</p>
    <p id="res-cuotas" style="margin:2px 0;font-size:15px;font-weight:600;color:#1a2a4e">—</p>
  </div>
</div>

<div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #eee">
  <p style="font-size:14px;color:#555;margin-bottom:12px">¿Quieres saber qué banco te conviene según tu perfil crediticio?</p>
  <a href="/asesores.html" style="display:inline-block;padding:12px 28px;background:#ff9500;color:#fff;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none">Hablar con un asesor InmuHub →</a>
</div>

</div>

<script>
(function(){
  var TIPO_CAMBIO = 7.66;
  var moneda = 'GTQ';

  function fmt(n) {
    var simbolo = moneda === 'USD' ? '$ ' : 'Q ';
    return simbolo + Math.round(n).toLocaleString('es-GT');
  }

  window.setMoneda = function(m) {
    var precioInput = document.getElementById('precio');
    var precioActual = parseFloat(precioInput.value) || 0;
    if (m === moneda) return;
    if (m === 'USD' && moneda === 'GTQ') {
      precioInput.value = Math.round(precioActual / TIPO_CAMBIO);
    } else if (m === 'GTQ' && moneda === 'USD') {
      precioInput.value = Math.round(precioActual * TIPO_CAMBIO);
    }
    moneda = m;
    document.getElementById('lbl-moneda-precio').textContent = m === 'USD' ? '$' : 'Q';
    document.getElementById('btn-gtq').style.background = m === 'GTQ' ? '#1a2a4e' : '#fff';
    document.getElementById('btn-gtq').style.color = m === 'GTQ' ? '#fff' : '#1a2a4e';
    document.getElementById('btn-usd').style.background = m === 'USD' ? '#1a2a4e' : '#fff';
    document.getElementById('btn-usd').style.color = m === 'USD' ? '#fff' : '#1a2a4e';
    calcularHipoteca();
  };

  window.calcularHipoteca = function() {
    var precio = parseFloat(document.getElementById('precio').value) || 0;
    var enganche = parseFloat(document.getElementById('enganche').value) || 0;
    var plazo = parseFloat(document.getElementById('plazo').value) || 1;

    var engancheMonto = precio * (enganche / 100);
    var aFinanciar = precio - engancheMonto;
    var meses = plazo * 12;

    document.getElementById('res-enganche').textContent = fmt(engancheMonto);
    document.getElementById('res-financiar').textContent = fmt(aFinanciar);
    document.getElementById('res-cuotas').textContent = meses + ' (' + plazo + ' años)';

    var cards = document.querySelectorAll('.banco-card');
    cards.forEach(function(card) {
      var tasa = parseFloat(card.getAttribute('data-tasa'));
      var tasaMensual = tasa / 100 / 12;
      var cuotaMensual = aFinanciar > 0
        ? (aFinanciar * tasaMensual * Math.pow(1 + tasaMensual, meses)) / (Math.pow(1 + tasaMensual, meses) - 1)
        : 0;
      var totalPagado = cuotaMensual * meses;
      var totalIntereses = totalPagado - aFinanciar;

      card.querySelector('.res-cuota').textContent = fmt(cuotaMensual);
      card.querySelector('.res-intereses').textContent = fmt(totalIntereses);
    });
  };

  calcularHipoteca();
  document.getElementById('precio').addEventListener('input', calcularHipoteca);
  document.getElementById('enganche').addEventListener('input', calcularHipoteca);
  document.getElementById('plazo').addEventListener('input', calcularHipoteca);
})();
</script>
`;
  return html;
};

module.exports = { mortgageCalculator };
