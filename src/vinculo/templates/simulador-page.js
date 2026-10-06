const { layout } = require('./layout');
const { investmentSimulator } = require('./investment-simulator');

function simuladorInversionPage() {
  return layout({
    title: 'Simulador de Inversion Inmobiliaria | INMUHUB',
    desc: 'Simula el retorno de inversion (ROI) en propiedades guatemaltecas.',
    canonical: '/simulador-inversion',
    body: investmentSimulator()
  });
}

module.exports = { simuladorInversionPage };