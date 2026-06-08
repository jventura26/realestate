function mortgageCalculator() {
  return `
<section style="padding:60px 6%;background:linear-gradient(135deg,#f9fafb 0%,#f3f4f6 100%)">
  <div style="max-width:900px;margin:0 auto">
    <!-- Título -->
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:36px;font-weight:700;color:#1a2a4e;margin-bottom:12px">Calculadora Hipotecaria</h2>
      <p style="font-size:16px;color:#666;max-width:600px;margin:0 auto">Simula el costo de tu hipoteca incluyendo la cuota inicial del 20% que pide el banco</p>
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

      <!-- Input: Cuota Inicial (20%) -->
      <div style="margin-bottom:32px;padding:24px;background:#fff3e0;border-radius:12px;border:1px solid #ffe0b2">
        <label style="display:block;font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:15px">⚠️ Cuota Inicial Requerida (20%): Q <span id="downPaymentDisplay">100,000</span></label>
        <input type="number" id="downPayment" value="100000" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;font-family:inherit;font-size:14px;box-sizing:border-box;background:#ffffff;color:#1a2a4e;font-weight:600">
        <p style="font-size:12px;color:#666;margin-top:8px;margin-bottom:0">💡 Se actualiza automáticamente al cambiar el precio. Puedes editarlo manualmente si tienes una cifra diferente.</p>
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

      <!-- Grid de resultados -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:48px">
        
        <!-- Columna Izquierda: Financiamiento -->
        <div style="background:linear-gradient(135deg,#ffa500 0%,#ff8c00 100%);border-radius:12px;padding:32px;color:white">
          <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.2)">
            <p style="font-size:13px;opacity:0.9;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Cuota Inicial</p>
            <p style="font-size:32px;font-weight:700" id="summaryDownDisplay">Q 100,000</p>
          </div>
          <div>
            <p style="font-size:12px;opacity:0.8;margin-bottom:4px">Monto a Financiar (80%)</p>
            <p style="font-size:24px;font-weight:600" id="loanAmount">Q 400,000</p>
          </div>
        </div>

        <!-- Columna Derecha: Cuota Mensual -->
        <div style="background:linear-gradient(135deg,#1a2a4e 0%,#2d4069 100%);border-radius:12px;padding:32px;color:white">
          <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.2)">
            <p style="font-size:13px;opacity:0.8;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Cuota Mensual</p>
            <p style="font-size:32px;font-weight:700;color:#ffa500" id="monthlyPayment">Q 3,081</p>
          </div>
          <div>
            <p style="font-size:12px;opacity:0.8;margin-bottom:4px">Total a Pagar (20 años)</p>
            <p style="font-size:20px;font-weight:600" id="totalPayment">Q 739,584</p>
          </div>
        </div>
      </div>

      <!-- Resumen completo -->
      <div style="background:#f9fafb;border-radius:12px;padding:24px;border:1px solid #e5e7eb;margin-bottom:32px">
        <h4 style="font-size:16px;font-weight:700;color:#1a2a4e;margin-bottom:16px">Resumen Financiero Completo</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;font-size:14px">
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding-bottom:12px">
            <span style="color:#666">Precio Propiedad:</span>
            <span style="font-weight:600;color:#1a2a4e" id="summaryPrice">Q 500,000</span>
          </div>
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding-bottom:12px">
            <span style="color:#666">Cuota Inicial (20%):</span>
            <span style="font-weight:600;color:#ffa500" id="summaryDown">Q 100,000</span>
          </div>
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding-bottom:12px">
            <span style="color:#666">Monto Financiado (80%):</span>
            <span style="font-weight:600;color:#1a2a4e" id="summaryLoan">Q 400,000</span>
          </div>
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding-bottom:12px">
            <span style="color:#666">Intereses Totales:</span>
            <span style="font-weight:600;color:#dc2626" id="totalInterest">Q 339,584</span>
          </div>
        </div>
      </div>

      <!-- Botón CTA -->
      <div style="text-align:center">
        <a href="https://wa.me/502XXXXXXXX?text=Tengo%20el%2020%25%20inicial%20y%20quiero%20financiar%20una%20propiedad" target="_blank" style="display:inline-block;background:#1a2a4e;color:white;padding:16px 48px;border-radius:8px;font-weight:600;text-decoration:none;transition:all 0.3s" onmouseover="this.style.background='#2d4069'" onmouseout="this.style.background='#1a2a4e'">
          Contactar Asesor de Financiamiento →
        </a>
      </div>
    </div>
  </div>
</section>

<script>
  const priceInput = document.getElementById('price');
  const downPaymentInput = document.getElementById('downPayment');
  const termInput = document.getElementById('term');
  const rateInput = document.getElementById('rate');
  
  function formatNumber(n) { return n.toLocaleString('es-GT'); }
  
  function calculateMortgage() {
    const price = parseFloat(priceInput.value);
    const downPayment = parseFloat(downPaymentInput.value);
    const principal = price - downPayment; // Lo que financia el banco
    const r = parseFloat(rateInput.value) / 100 / 12;
    const n = parseFloat(termInput.value) * 12;
    
    const monthly = (principal * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
    const total = monthly * n;
    const interest = total - principal;
    
    // Actualizar displays
    document.getElementById('priceDisplay').textContent = formatNumber(Math.round(price));
    document.getElementById('downPaymentDisplay').textContent = formatNumber(Math.round(downPayment));
    document.getElementById('termDisplay').textContent = termInput.value;
    document.getElementById('rateDisplay').textContent = rateInput.value;
    
    document.getElementById('loanAmount').textContent = 'Q ' + formatNumber(Math.round(principal));
    document.getElementById('monthlyPayment').textContent = 'Q ' + formatNumber(Math.round(monthly));
    document.getElementById('totalPayment').textContent = 'Q ' + formatNumber(Math.round(total));
    document.getElementById('totalInterest').textContent = 'Q ' + formatNumber(Math.round(interest));
    
    // Resumen
    document.getElementById('summaryPrice').textContent = 'Q ' + formatNumber(Math.round(price));
    document.getElementById('summaryDown').textContent = 'Q ' + formatNumber(Math.round(downPayment));
    document.getElementById('summaryDownDisplay').textContent = 'Q ' + formatNumber(Math.round(downPayment));
    document.getElementById('summaryLoan').textContent = 'Q ' + formatNumber(Math.round(principal));
  }
  
  // Actualizar 20% automáticamente cuando cambia el precio
  priceInput.addEventListener('input', function() {
    const autoDownPayment = parseFloat(this.value) * 0.2;
    downPaymentInput.value = Math.round(autoDownPayment);
    calculateMortgage();
  });
  
  downPaymentInput.addEventListener('input', calculateMortgage);
  termInput.addEventListener('input', calculateMortgage);
  rateInput.addEventListener('input', calculateMortgage);
  
  calculateMortgage();
</script>
`;
}

module.exports = { mortgageCalculator };

// MEJORAS: Bancos e Impuestos
