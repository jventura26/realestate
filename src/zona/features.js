<!-- CALCULADORA DE HIPOTECA -->
<section style="background:linear-gradient(135deg,var(--ink2) 0%,var(--ink3) 100%);padding:60px 6%">
  <div style="max-width:900px;margin:0 auto">
    <h2 class="st">Calcula tu hipoteca</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:30px">
      <div>
        <label style="display:block;font-size:.7rem;color:var(--or);font-weight:700;text-transform:uppercase;margin-bottom:8px">Precio</label>
        <input type="number" id="calcPrice" placeholder="500,000" style="width:100%;padding:12px;background:rgba(255,255,255,.05);border:1px solid var(--bd);color:var(--wh);border-radius:3px;font-size:.9rem">
      </div>
      <div>
        <label style="display:block;font-size:.7rem;color:var(--or);font-weight:700;text-transform:uppercase;margin-bottom:8px">Cuota Inicial %</label>
        <input type="number" id="calcDownPayment" placeholder="20" value="20" style="width:100%;padding:12px;background:rgba(255,255,255,.05);border:1px solid var(--bd);color:var(--wh);border-radius:3px;font-size:.9rem">
      </div>
      <div>
        <label style="display:block;font-size:.7rem;color:var(--or);font-weight:700;text-transform:uppercase;margin-bottom:8px">Años</label>
        <input type="number" id="calcYears" placeholder="20" value="20" style="width:100%;padding:12px;background:rgba(255,255,255,.05);border:1px solid var(--bd);color:var(--wh);border-radius:3px;font-size:.9rem">
      </div>
    </div>
    <div id="calcResults" style="background:rgba(245,130,13,.08);padding:30px;border-radius:4px;display:none">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;text-align:center">
        <div>
          <p style="font-size:.7rem;color:var(--sv);margin-bottom:8px">CUOTA MENSUAL</p>
          <p style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:var(--or);font-weight:600" id="monthlyPayment">Q. 0</p>
        </div>
        <div>
          <p style="font-size:.7rem;color:var(--sv);margin-bottom:8px">FINANCIAMIENTO</p>
          <p style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:var(--or);font-weight:600" id="loanAmount">Q. 0</p>
        </div>
        <div>
          <p style="font-size:.7rem;color:var(--sv);margin-bottom:8px">INTERÉS TOTAL</p>
          <p style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:var(--or);font-weight:600" id="totalInterest">Q. 0</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- COMPARADOR -->
<section style="background:var(--ink);padding:60px 6%">
  <div style="max-width:900px;margin:0 auto">
    <h2 class="st">Compara propiedades</h2>
    <p style="font-size:.9rem;color:var(--sv);margin-bottom:30px">Selecciona hasta 3 propiedades para comparar características, precios y ubicación</p>
    <div style="background:var(--ink2);padding:30px;border-radius:4px;text-align:center">
      <p style="color:var(--sv);margin-bottom:15px">Selecciona propiedades en el catálogo para compararlas</p>
      <a href="/propiedades.html" class="btn btn-primary" style="display:inline-block">Ir al Catálogo</a>
    </div>
  </div>
</section>

<script>
document.getElementById('calcPrice').addEventListener('input', calculateMortgage);
document.getElementById('calcDownPayment').addEventListener('input', calculateMortgage);
document.getElementById('calcYears').addEventListener('input', calculateMortgage);

function calculateMortgage() {
  const price = parseFloat(document.getElementById('calcPrice').value) || 0;
  const downPayment = parseFloat(document.getElementById('calcDownPayment').value) || 20;
  const years = parseFloat(document.getElementById('calcYears').value) || 20;
  
  const loanAmount = price * (1 - downPayment/100);
  const monthlyRate = 0.065 / 12; // 6.5% tasa promedio
  const months = years * 12;
  
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - loanAmount;
  
  document.getElementById('monthlyPayment').textContent = 'Q. ' + monthlyPayment.toLocaleString('es-GT', {maximumFractionDigits: 0});
  document.getElementById('loanAmount').textContent = 'Q. ' + loanAmount.toLocaleString('es-GT', {maximumFractionDigits: 0});
  document.getElementById('totalInterest').textContent = 'Q. ' + totalInterest.toLocaleString('es-GT', {maximumFractionDigits: 0});
  document.getElementById('calcResults').style.display = 'block';
}

calculateMortgage();
</script>
