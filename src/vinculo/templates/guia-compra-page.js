const { leadsMagnet } = require('./leads-magnet');
const { layout } = require('./layout');

function guiaCompraPae() {
  const title = 'Guía Premium de Inversión Inmobiliaria | INMUHUB 2026';
  const desc = 'Cómo comprar propiedades sin errores costosos. Análisis de mercado, financiamiento, zonas y negociación.';
  const canonical = '/herramientas/guia-compra.html';
  
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "Guía Premium de Inversión Inmobiliaria 2026",
    "description": desc,
    "url": "https://inmuhub.com" + canonical,
    "author": {
      "@type": "Organization",
      "name": "INMUHUB"
    }
  };

  const body = `
${leadsMagnet()}

<script type="application/ld+json">
${JSON.stringify(schemaMarkup, null, 2)}
</script>
`;

  return layout({ title, desc, canonical, body });
}

module.exports = { guiaCompraPae };
