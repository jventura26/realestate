function investmentSimulator() {
  return `
<section style="padding:60px 6%;background:white">
  <div style="max-width:900px;margin:0 auto">
    <!-- Título -->
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:36px;font-weight:700;color:#1a2a4e;margin-bottom:12px">Simulador de Inversión</h2>
      <p style="font-size:16px;color:#666;max-width:600px;margin:0 auto">Analiza el retorno de inversión (ROI) en propiedades guatemaltecas</p>
    </div>

    <!-- Simulador -->
    <div style="background:#f9fafb;border-radius:16px;padding:48px;border:1px solid #e5e7eb">
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:40px">
        <!-- Inputs -->
        <div>
          <div style="margin-bottom:24px">
            <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:8px;font-size:14px">Inversión Inicial (Q)</label>
            <input type="number" id="investment" value="500000" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;font-family:inherit;font-size:14px">
          </div>

          <div style="margin-bottom:24px">
            <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:8px;font-size:14px">Renta Mensual (Q)</label>
            <input type="number" id="rentMonthly" value="8000" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;font-family:inherit;font-size:14px">
          </div>

          <div style="margin-bottom:24px">
            <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:8px;font-size:14px">Valorización Anual (%)</label>
            <input type="number" id="appreciation" value="5" step="0.1" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;font-family:inherit;font-size:14px">
          </div>

          <div style="margin-bottom:24px">
            <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:8px;font-size:14px">Años de Análisis</label>
            <input type="number" id="years" value="10" min="1" max="30" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;font-family:inherit;font-size:14px">
          </div>

          <button onclick="simulateInvestment()" style="width:100%;background:#ffa500;color:white;padding:14px;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:15px">Simular</button>
        </div>

        <!-- Resultados -->
        <div style="background:white;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
          <div style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #e5e7eb">
            <p style="font-size:13px;color:#666;margin-bottom:4px;text-transform:uppercase">Renta Total Acumulada</p>
            <p style="font-size:28px;font-weight:700;color:#1a2a4e" id="totalRent">Q 960,000</p>
          </div>

          <div style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #e5e7eb">
            <p style="font-size:13px;color:#666;margin-bottom:4px;text-transform:uppercase">Valor de Propiedad</p>
            <p style="font-size:28px;font-weight:700;color:#1a2a4e" id="propertyValue">Q 814,441</p>
          </div>

          <div style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #e5e7eb">
            <p style="font-size:13px;color:#666;margin-bottom:4px;text-transform:uppercase">Total Patrimonio</p>
            <p style="font-size:28px;font-weight:700;color:#ffa500" id="totalAssets">Q 1,774,441</p>
          </div>

          <div>
            <p style="font-size:13px;color:#666;margin-bottom:4px;text-transform:uppercase">ROI Total</p>
            <p style="font-size:28px;font-weight:700;color:#22c55e" id="roi">254.9%</p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;padding-top:32px;border-top:1px solid #e5e7eb">
        <p style="color:#666;margin-bottom:16px;font-size:15px">¿Listo para invertir en propiedades premium de Guatemala?</p>
        <a href="/propiedades.html" target="_blank" style="display:inline-block;background:#1a2a4e;color:white;padding:14px 40px;border-radius:8px;font-weight:600;text-decoration:none">Ver propiedades disponibles &rarr;</a>
      </div>
    </div>
  </div>
</section>

<script>
function simulateInvestment() {
  const investment = parseFloat(document.getElementById('investment').value);
  const rentMonthly = parseFloat(document.getElementById('rentMonthly').value);
  const appreciation = parseFloat(document.getElementById('appreciation').value) / 100;
  const years = parseInt(document.getElementById('years').value);
  
  const totalRent = rentMonthly * 12 * years;
  const propertyValue = investment * Math.pow(1 + appreciation, years);
  const totalAssets = totalRent + propertyValue;
  const roi = ((totalAssets - investment) / investment) * 100;
  
  function fmt(n) { return n.toLocaleString('es-GT'); }
  
  document.getElementById('totalRent').textContent = 'Q ' + fmt(Math.round(totalRent));
  document.getElementById('propertyValue').textContent = 'Q ' + fmt(Math.round(propertyValue));
  document.getElementById('totalAssets').textContent = 'Q ' + fmt(Math.round(totalAssets));
  document.getElementById('roi').textContent = roi.toFixed(1) + '%';
}

simulateInvestment();
</script>
`;
}

module.exports = { investmentSimulator };
