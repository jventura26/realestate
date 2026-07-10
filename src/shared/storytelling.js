/**
 * STORYTELLING EMOCIONAL PARA PROPIEDADES
 * Generador de narrativas premium para cada tipo de propiedad
 */

const STORYTELLING_TEMPLATES = {
  'Casa': {
    intro: 'Más que una propiedad',
    templates: [
      'Esta residencia no es solo un espacio: es un refugio donde cada detalle respira diseño y funcionalidad. Ubicada en {zona}, ofrece el equilibrio perfecto entre privacidad y accesibilidad a la ciudad.',
      'Diseñada para vivir, no solo para existir. Esta casa representa el estilo de vida que buscas: amplia, moderna y lista para recibir tus mejores momentos familiares.',
      'En esta propiedad, el espacio se convierte en experiencia. Cada ambiente fue pensado para ofrecerte comodidad, luz natural y esa sensación de hogar que no se compra, se siente.',
      'Ubicada en {zona}, esta residencia te ofrece más que m² de construcción. Te ofrece tranquilidad, acceso rápido a la ciudad y un ambiente donde la familia prospera.'
    ]
  },
  'Apartamento': {
    intro: 'Lujo compacto',
    templates: [
      'Un apartamento que entiende lo que significa vivir en altura: luz, vistas y servicios premium. Ubicado en {zona}, este es tu acceso a la vida urbana sin sacrificar comodidad.',
      'Penthouse con carácter. Este apartamento no es solo un inmueble: es un posicionamiento en la ciudad, una dirección que habla de ti.',
      'Ubicado en {zona}, este apartamento redefine lo que significa un espacio compacto premium. Cada m² está optimizado para ofrecer máximo confort.',
      'Más que un apartamento: es tu pied-à-terre en la ciudad. Con acceso a amenidades de lujo y ubicación estratégica en {zona}.'
    ]
  },
  'Fincas': {
    intro: 'Espacio y naturaleza',
    templates: [
      'Esta finca representa más que terreno: representa libertad, espacio y potencial. Ubicada en {zona}, es tu canvas para crear lo que siempre imaginaste.',
      'Aquí, la naturaleza es tu vecina. Esta propiedad ofrece amplitud, tranquilidad y oportunidades de desarrollo. El potencial está en tus manos.',
      'Ubicada en {zona}, esta finca te ofrece algo cada vez más raro en Guatemala: espacio real, privacidad absoluta y potencial de crecimiento.',
      'No es solo una finca. Es una inversión en calidad de vida. Ubicada en {zona}, combina tranquilidad rural con accesibilidad a servicios.'
    ]
  },
  'default': {
    intro: 'Una oportunidad única',
    templates: [
      'Esta propiedad en {zona} representa una oportunidad que no viene todos los días. Análisis serio de quiénes buscan aquí.',
      'Ubicada en {zona}, esta propiedad combina ubicación estratégica con características Premium. Para quienes saben lo que buscan.',
      'En {zona}, esta propiedad destaca. Para inversores que entienden valor. Para familias que saben qué es calidad.'
    ]
  }
};

function generarStorytellingProperty(tipo, zona, precio) {
  const template = STORYTELLING_TEMPLATES[tipo] || STORYTELLING_TEMPLATES.default;
  const randomTemplate = template.templates[Math.floor(Math.random() * template.templates.length)];
  const story = randomTemplate.replace('{zona}', zona || 'esta zona premium');
  
  return `
<div style="background:linear-gradient(135deg,rgba(74,144,217,.08) 0%,rgba(16,185,129,.04) 100%);border-left:3px solid var(--or);padding:28px;margin-bottom:36px;border-radius:4px">
  <div style="font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:12px">✨ ${template.intro}</div>
  <p style="font-size:.85rem;color:var(--sv);line-height:1.9;font-weight:300;margin:0">${story}</p>
</div>`;
}

function generarInvestmentInfo(zona, rentabilidad = 4) {
  return `
<div style="background:var(--ink2);border:1px solid var(--bd);padding:18px 20px">
  <div style="font-size:.56rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:10px">📊 Análisis de Inversión</div>
  <div style="font-size:.75rem;color:var(--sv);line-height:1.8">
    <div style="margin-bottom:8px"><strong>Ubicación:</strong> ${zona} (acceso estratégico)</div>
    <div style="margin-bottom:8px"><strong>Potencial:</strong> Zona en apreciación sostenida</div>
    <div style="margin-bottom:8px"><strong>Estado:</strong> Lista para habitar o rentar</div>
    <div style="margin-bottom:8px"><strong>Rentabilidad:</strong> Aproximada ${rentabilidad}-${rentabilidad + 1}% anual</div>
  </div>
</div>`;
}

module.exports = {
  generarStorytellingProperty,
  generarInvestmentInfo,
  STORYTELLING_TEMPLATES
};
