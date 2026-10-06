// Servicios de Zona-INNmueble: una sola fuente para la portada y la página /servicios.html
const { layout, WA } = require('./layout');
const { escapeHtml } = require('../../shared/utils');

const wa = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const SERVICIOS = [
  {
    slug: 'asesoria-al-comprador',
    grupo: 'Comprar',
    nombre: 'Asesoría al comprador',
    corto: 'Le acompañamos desde la búsqueda hasta la escritura, con análisis de cada opción y negociación con criterio.',
    detalle: 'Definimos con usted zona, presupuesto y prioridades. Filtramos el mercado, analizamos cada opción frente a su zona y le decimos también lo que conviene revisar. Negociamos con datos y le acompañamos hasta la firma.',
    incluye: ['Perfil de búsqueda y filtro del mercado, publicado y no publicado', 'Ficha de análisis de cada opción: precio, traslado y puntos a revisar', 'Acompañamiento en visitas y negociación', 'Coordinación con notario hasta la escritura'],
    cta: 'Quiero asesoría para comprar',
  },
  {
    slug: 'venta-con-estrategia',
    grupo: 'Vender o rentar',
    nombre: 'Venta con estrategia de marketing',
    corto: 'Precio defendible, presentación impecable y campaña dirigida al comprador correcto.',
    detalle: 'Vender bien no es publicar en más portales. Fijamos un precio defendible con datos de su zona, producimos fotografía, tour 360° y reel, y lanzamos una campaña segmentada. Filtramos compradores antes de cada visita.',
    incluye: ['Análisis de precio con comparables de la zona', 'Fotografía editada, tour 360° y reel vertical', 'Campaña en Meta Ads dirigida al perfil que compra en su zona', 'Filtro de compradores y reportes de avance'],
    cta: 'Quiero vender mi propiedad',
    href: '/vender.html',
  },
  {
    slug: 'opinion-de-valor',
    grupo: 'Vender o rentar',
    nombre: 'Opinión de valor',
    corto: 'Cuánto vale su propiedad hoy frente a la oferta real de su zona, explicado con claridad.',
    detalle: 'Comparamos su propiedad con los anuncios reales de su zona y sector: precio por m², rango típico, renta y rendimiento. Le entregamos una lectura clara de dónde se ubica y qué precio es defendible. Es una referencia de mercado, no un avalúo bancario.',
    incluye: ['Comparables de su zona y sector', 'Rango de precio por m² y precio sugerido', 'Renta estimada y rendimiento bruto', 'Recomendación de estrategia de venta o renta'],
    cta: 'Quiero saber cuánto vale mi propiedad',
    href: '/valor-por-zona.html',
  },
  {
    slug: 'debida-diligencia',
    grupo: 'Comprar',
    nombre: 'Debida diligencia documental',
    corto: 'Revisamos titularidad, gravámenes, IUSI y medidas antes de que usted ofrezca.',
    detalle: 'Antes de una oferta o un anticipo revisamos, junto con un notario aliado, la certificación del Registro General de la Propiedad, gravámenes y anotaciones, solvencia de IUSI y servicios, y que las medidas registrales coincidan con las físicas.',
    incluye: ['Certificación registral: titular, gravámenes y anotaciones', 'Solvencia de IUSI y servicios', 'Medidas registrales frente a medidas físicas', 'Informe claro de hallazgos y recomendaciones'],
    cta: 'Quiero revisar una propiedad',
  },
  {
    slug: 'tours-360',
    grupo: 'Producción',
    nombre: 'Tours 360° y producción audiovisual',
    corto: 'Recorridos virtuales, fotografía y reels que presentan su propiedad como merece.',
    detalle: 'Capturamos la propiedad con cámara 360° profesional y producimos fotografía con iluminación cuidada y un reel vertical para redes y anuncios. Disponible también para colegas e inmobiliarias.',
    incluye: ['Tour 360° navegable para web y redes', 'Fotografía con edición de luz y color', 'Reel vertical para Instagram, Facebook y anuncios', 'Paquetes Básico, Pro y Premium'],
    cta: 'Quiero cotizar un tour 360°',
  },
  {
    slug: 'inversion-y-fincas',
    grupo: 'Invertir',
    nombre: 'Inversión y fincas',
    corto: 'Análisis de acceso, agua, título y rendimiento antes de invertir en tierra o en renta.',
    detalle: 'Para fincas y terrenos revisamos acceso, agua, uso de suelo y situación registral. Para propiedades de renta calculamos rendimiento bruto y neto frente a la zona. Le ayudamos a invertir con criterio, sin promesas.',
    incluye: ['Fincas y terrenos en distintos departamentos', 'Revisión de acceso, agua, uso de suelo y título', 'Rendimiento de renta frente a la zona', 'Estrategia de entrada y de salida'],
    cta: 'Quiero invertir con criterio',
    href: '/zonas/fincas-guatemala.html',
  },
  {
    slug: 'administracion-de-rentas',
    grupo: 'Invertir',
    nombre: 'Administración de rentas',
    corto: 'Su propiedad rentada y cuidada: inquilinos calificados, cobro y seguimiento.',
    detalle: 'Nos encargamos de promover la propiedad, calificar inquilinos, preparar el contrato y dar seguimiento a pagos y mantenimiento, con reportes periódicos para el propietario.',
    incluye: ['Promoción y filtro de inquilinos', 'Contrato y entrega con inventario', 'Seguimiento de pagos y mantenimiento', 'Reporte periódico al propietario'],
    cta: 'Quiero rentar mi propiedad',
  },
  {
    slug: 'compradores-en-el-extranjero',
    grupo: 'Comprar',
    nombre: 'Compradores en el extranjero',
    corto: 'Para guatemaltecos fuera del país: compre con información, a distancia y con acompañamiento.',
    detalle: 'Si vive fuera de Guatemala, le mostramos cada opción con tour 360° y videollamada, revisamos la documentación y coordinamos la firma por medio de mandato o en su próxima visita. Atención en español e inglés.',
    incluye: ['Recorridos por videollamada y tour 360°', 'Ficha de análisis y debida diligencia', 'Coordinación de firma a distancia o en su visita', 'Atención en español e inglés'],
    cta: 'Vivo fuera de Guatemala y quiero comprar',
  },
  {
    slug: 'traslados-en-hora-pico',
    grupo: 'Comprar',
    nombre: 'Traslados medidos en hora pico',
    corto: 'Cuánto toma realmente llegar a Zona 10 desde la propiedad, medido en horario real.',
    detalle: 'Hacemos el recorrido en hora pico de la mañana y de la tarde, y fuera de hora pico, y le entregamos los tiempos reales y la ruta sugerida. Ideal para Carretera a El Salvador, Fraijanes y Pinula.',
    incluye: ['Recorrido real de 6:30 a 8:30 y de 17:00 a 19:30', 'Tiempo fuera de hora pico como referencia', 'Ruta sugerida y accesos principales', 'Tiempos visibles en la ficha de la propiedad'],
    cta: 'Quiero medir el traslado de una propiedad',
  },
];

const ICONS = {
  'Comprar': '<path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  'Vender o rentar': '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  'Producción': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  'Invertir': '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
};
const icon = (g) => `<svg class="z3-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[g] || ICONS.Comprar}</svg>`;

// Tarjetas para la portada
function serviciosGrid(limit = 9) {
  return `<div class="z3-svc-grid">${SERVICIOS.slice(0, limit).map((s) => `
    <a class="z3-svc" href="/servicios.html#${s.slug}">
      ${icon(s.grupo)}
      <span class="z3-svc-g">${escapeHtml(s.grupo)}</span>
      <h3>${escapeHtml(s.nombre)}</h3>
      <p>${escapeHtml(s.corto)}</p>
      <span class="z3-more">Conocer el servicio <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
    </a>`).join('')}</div>`;
}

function serviciosPage() {
  const grupos = ['Comprar', 'Vender o rentar', 'Invertir', 'Producción'];
  const body = `
<section class="z3-page-hero">
  <div class="sec-in">
    <div class="ey">Servicios</div>
    <h1 class="z3-h1">Asesoría inmobiliaria completa, <em>con análisis en cada paso.</em></h1>
    <p class="z3-lead">Comprar, vender, rentar o invertir en Guatemala con información clara: precio frente al mercado, documentos en orden y acompañamiento de principio a fin. No se trata de vender por vender.</p>
    <div class="z3-chips" role="navigation" aria-label="Servicios">${SERVICIOS.map((s) => `<a href="#${s.slug}">${escapeHtml(s.nombre)}</a>`).join('')}</div>
  </div>
</section>
${grupos.map((g, gi) => {
  const items = SERVICIOS.filter((s) => s.grupo === g);
  if (!items.length) return '';
  return `<section class="sec ${gi % 2 === 0 ? 'lt' : ''}">
  <div class="sec-in">
    <div class="ey">${escapeHtml(g)}</div>
    <div class="z3-svc-list">
      ${items.map((s) => `<article class="z3-svc-row" id="${s.slug}">
        <div>
          ${icon(s.grupo)}
          <h2 class="z3-h2">${escapeHtml(s.nombre)}</h2>
          <p class="z3-p">${escapeHtml(s.detalle)}</p>
          <div class="z3-actions">
            <a class="btn-gold" href="${wa('Hola, me interesa el servicio de ' + s.nombre + ' de Zona INNmueble.')}" target="_blank" rel="noopener">${escapeHtml(s.cta)}</a>
            ${s.href ? `<a class="btn-ghost" href="${s.href}">Ver más</a>` : ''}
          </div>
        </div>
        <ul class="z3-inc">${s.incluye.map((i) => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="16" height="16"><path d="M20 6 9 17l-5-5"/></svg>${escapeHtml(i)}</li>`).join('')}</ul>
      </article>`).join('')}
    </div>
  </div>
</section>`;
}).join('')}
<section class="sec" style="text-align:center">
  <div style="max-width:640px;margin:0 auto">
    <div class="ey" style="justify-content:center">Conversemos</div>
    <h2 class="st">Cuéntenos su caso. <em>Le respondemos con análisis.</em></h2>
    <p class="z3-p" style="margin:12px auto 30px">Lunes a viernes, de 8:00 a 18:00. Respuesta en menos de 2 horas en horario hábil.</p>
    <a class="btn-gold" href="${wa('Hola, quiero asesoría de Zona INNmueble.')}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
  </div>
</section>`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: SERVICIOS.map((s, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Service', name: s.nombre, description: s.corto, provider: { '@type': 'RealEstateAgent', name: 'Zona INNmueble' }, areaServed: 'Guatemala', url: 'https://zona-innmueble.com/servicios.html#' + s.slug },
    })),
  };
  return layout({
    title: 'Servicios inmobiliarios en Guatemala',
    desc: 'Asesoría al comprador, venta con estrategia, opinión de valor, debida diligencia, tours 360°, inversión y fincas, administración de rentas y traslados medidos en hora pico.',
    canonical: '/servicios.html',
    body: body + `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
  });
}

module.exports = { SERVICIOS, serviciosGrid, serviciosPage };
