const { mortgageCalculator } = require('./mortgage-calculator');
const { layout } = require('./layout');

function mortgageCalculatorPage() {
  const title = 'Calcula tu hipoteca real en Guatemala | Tasas 2026';
  const desc = 'Descubre cuánto pagas mensualmente según tu enganche. Simulador con tasas actuales de G&T, BAC e Industrial.';
  const canonical = '/herramientas/calculadora-hipotecaria.html';
  
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Calculadora Hipotecaria",
    "description": desc,
    "url": "https://inmuhub.com" + canonical,
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GTQ"
    }
  };

  const body = `
<div style="padding:60px 6%;background:linear-gradient(135deg,#f8f9fa 0%,#e8eef5 100%);min-height:100vh">
  <div style="max-width:1000px;margin:0 auto">
    <h1 style="text-align:center;font-size:44px;font-weight:700;margin-bottom:20px;color:#1a2a4e">
      Calculadora Hipotecaria 2026
    </h1>
    <p style="text-align:center;font-size:18px;color:#555;margin-bottom:40px;max-width:700px;margin-left:auto;margin-right:auto">
      Simula tu hipoteca con tasas actuales de los bancos principales de Guatemala
    </p>
    
    ${mortgageCalculator()}
  </div>
</div>

<script type="application/ld+json">
${JSON.stringify(schemaMarkup, null, 2)}
</script>
`;

  return layout({ title, desc, canonical, body });
}

module.exports = { mortgageCalculatorPage };
