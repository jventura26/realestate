function mortgageCalculator() {
  return `
<section style="padding:60px 6%;background:linear-gradient(135deg,#f9fafb 0%,#f3f4f6 100%)">
  <div style="max-width:900px;margin:0 auto">
    <!-- Título -->
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:36px;font-weight:700;color:#1a2a4e;margin-bottom:12px">Calculadora Hipotecaria</h2>
      <p style="font-size:16px;color:#666;max-width:600px;margin:0 auto">Simula el costo de tu hipoteca según el valor de la propiedad, plazo y tasa de interés</p>
    </div>

    <!-- Calculadora -->
    <div style="background:white;border-radius:16px;padding:48px;box-shadow:0 4px 20px rgba(0,0,0,0.08);border:1px solid #e5e7eb">
      
      <!-- Input: Precio Propiedad -->
      <div style="margin-bottom:32px">
        <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:15px">Precio de la Propiedad: Q <span id="priceDisplay">500,000</span></label>
        <input type="range" id="price" min="100000" max="5000000" step="50000" value="500000" style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;appearance:none;-webkit-appearance:none">
        <style>
          input[type=range]::-webkit-slider-thumb { appearance:none; width:24px; height:24px; background:#ffa500; border-radius:50%; cursor:pointer }
          input[type=range]::-moz-range-thumb { width:24px; height:24px; background:#ffa500; border-radius:50%; cursor:pointer; border:none }
        </style>
      </div>

      <!-- Input: Plazo -->
      <div style="margin-bottom:32px">
        <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:15px">Plazo: <span id="termDisplay">20</span> años</label>
        <input type="range" id="term" min="5" max="30" step="1" value="20" style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;appearance:none;-webkit-appearance:none">
      </div>

      <!-- Input: Tasa Interés -->
      <div style="margin-bottom:48px">
        <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:15px">Tasa de Interés: <span id="rateDisplay">7.5</span>%</label>
        <input type="range" id="rate" min="3" max="12" step="0.1" value="7.5" style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;appearance:none;-webkit-appearance:none">
      </div>

      <!-- Resultados -->
      <div style="background:linear-gradient(135deg,#1a2a4e 0%,#2d4069 100%);border-radius:12px;padding:32px;color:white">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
          <div>
            <p style="font-size:13px;opacity:0.8;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Cuota Mensual</p>
            <p style="font-size:32px;font-weight:700;color:#ffa500" id="monthlyPayment">Q 3,850</p>
          </div>
          <div>
            <p style="font-size:13px;opacity:0.8;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Total a Pagar</p>
            <p style="font-size:32px;font-weight:700" id="totalPayment">Q 924,000</p>
          </div>
        </div>
        <div style="border-top:1px solid rgba(255,255,255,0.2);padding-top:16px">
          <p style="font-size:13px;opacity:0.8;margin-bottom:4px">Intereses Totales</p>
          <p style="font-size:20px;font-weight:600;color:#ffa500" id="totalInterest">Q 424,000</p>
        </div>
      </div>

      <!-- Botón CTA -->
      <div style="margin-top:32px;text-align:center">
        <a href="https://wa.me/502XXXXXXXX?text=Interesado%20en%20propiedades%20con%20financiamiento" target="_blank" style="display:inline-block;background:#ffa500;color:white;padding:16px 48px;border-radius:8px;font-weight:600;text-decoration:none;transition:all 0.3s">
          Contactar Asesor de Financiamiento →
        </a>
      </div>
    </div>
  </div>
</section>

<script>
  const priceInput = document.getElementById('price');
  const termInput = document.getElementById('term');
  const rateInput = document.getElementById('rate');
  
  function formatNumber(n) { return n.toLocaleString('es-GT'); }
  function calculateMortgage() {
    const P = parseFloat(priceInput.value);
    const r = parseFloat(rateInput.value) / 100 / 12;
    const n = parseFloat(termInput.value) * 12;
    
    const monthly = (P * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
    const total = monthly * n;
    const interest = total - P;
    
    document.getElementById('priceDisplay').textContent = formatNumber(Math.round(P));
    document.getElementById('termDisplay').textContent = termInput.value;
    document.getElementById('rateDisplay').textContent = rateInput.value;
    document.getElementById('monthlyPayment').textContent = 'Q ' + formatNumber(Math.round(monthly));
    document.getElementById('totalPayment').textContent = 'Q ' + formatNumber(Math.round(total));
    document.getElementById('totalInterest').textContent = 'Q ' + formatNumber(Math.round(interest));
  }
  
  priceInput.addEventListener('input', calculateMortgage);
  termInput.addEventListener('input', calculateMortgage);
  rateInput.addEventListener('input', calculateMortgage);
  
  calculateMortgage();
</script>
`;
}

module.exports = { mortgageCalculator };
