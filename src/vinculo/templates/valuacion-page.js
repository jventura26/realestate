const { valuacionPage: valuacionContent } = require('./valuacion-property');
const { layout } = require('./layout');

function valuacionPage() {
  const title = '¿Cuánto vale tu propiedad? | Valuador profesional Guatemala';
  const desc = 'Estima el valor de tu casa, apartamento o terreno en 20 zonas premium de Guatemala. Gratis y sin compromiso.';
  const canonical = '/herramientas/valuador.html';
  
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Valuador de Propiedades",
    "description": desc,
    "url": "https://inmuhub.com" + canonical,
    "applicationCategory": "RealEstateApplication",
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
      Valuador Profesional
    </h1>
    <p style="text-align:center;font-size:18px;color:#555;margin-bottom:40px;max-width:700px;margin-left:auto;margin-right:auto">
      Descubre el valor estimado de tu propiedad en 20 zonas premium de Guatemala
    </p>
    
    ${valuacionContent()}
  </div>
</div>

<script type="application/ld+json">
${JSON.stringify(schemaMarkup, null, 2)}
</script>
`;

  return layout({ title, desc, canonical, body });
}

module.exports = { valuacionPage };
