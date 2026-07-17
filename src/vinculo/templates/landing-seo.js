const { layout } = require('./layout');

function seoLandingPage(cfg) {
  var faqSchema = cfg.faqs ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': cfg.faqs.map(function(f) {
      return { '@type': 'Question', 'name': f.q, 'acceptedAnswer': { '@type': 'Answer', 'text': f.a } };
    })
  }) : '';

  var faqHTML = cfg.faqs ? '<div style="margin-top:48px"><h2 style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:1.8rem;font-weight:300;color:#0a1628;margin:0 0 24px">Preguntas frecuentes</h2>' +
    cfg.faqs.map(function(f) {
      return '<details style="border:1.5px solid #eef0f3;border-radius:12px;padding:20px 24px;margin-bottom:12px;cursor:pointer"><summary style="font-weight:700;font-size:15px;color:#0a1628;list-style:none;display:flex;justify-content:space-between;align-items:center">' + f.q + '<span style="color:#C9A96E;font-size:18px;transition:transform .2s">+</span></summary><p style="font-size:14px;color:#64748b;line-height:1.7;margin:12px 0 0">' + f.a + '</p></details>';
    }).join('') + '</div>' : '';

  var body = '<div style="max-width:900px;margin:0 auto;padding:48px 6%">' +
    '<nav style="font-size:12px;color:#94a3b8;margin-bottom:24px"><a href="/" style="color:#94a3b8;text-decoration:none">Inicio</a> / <span style="color:#64748b">' + cfg.h1 + '</span></nav>' +
    '<h1 style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:2.4rem;font-weight:300;color:#0a1628;margin:0 0 16px;line-height:1.2">' + cfg.h1 + '</h1>' +
    '<p style="font-size:16px;color:#64748b;line-height:1.7;margin-bottom:32px">' + cfg.intro + '</p>' +
    (cfg.image ? '<div style="margin-bottom:40px;border-radius:16px;overflow:hidden;aspect-ratio:16/9"><img src="' + cfg.image + '" alt="' + cfg.h1 + '" style="width:100%;height:100%;object-fit:cover" loading="lazy"></div>' : '') +
    '<div style="font-size:15px;color:#374151;line-height:1.8">' + cfg.content + '</div>' +
    '<div style="background:rgba(201,169,110,.06);border:1.5px solid rgba(201,169,110,.2);border-radius:16px;padding:32px;margin-top:40px;text-align:center">' +
    '<h3 style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:1.4rem;font-weight:300;color:#0a1628;margin:0 0 12px">' + (cfg.cta_title || 'Explora propiedades disponibles') + '</h3>' +
    '<p style="font-size:14px;color:#64748b;margin-bottom:20px">' + (cfg.cta_text || 'Propiedades verificadas con asesores certificados.') + '</p>' +
    '<a href="' + (cfg.cta_link || '/propiedades.html') + '" style="display:inline-block;background:#1a3a5c;color:white;padding:12px 32px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none">' + (cfg.cta_label || 'Ver propiedades') + '</a>' +
    '</div>' +
    faqHTML +
    '</div>' +
    (faqSchema ? '<script type="application/ld+json">' + faqSchema + '</script>' : '');

  return layout({
    title: cfg.title,
    desc: cfg.desc,
    canonical: '/' + cfg.slug + '.html',
    body: body
  });
}

var landings = [
  {
    slug: 'apartamentos-zona-14-guatemala',
    title: 'Apartamentos en Zona 14 Guatemala — Venta y Renta 2026',
    desc: 'Encuentra apartamentos en venta y renta en Zona 14, Guatemala. Condominios premium, amenidades de primer nivel y la mejor ubicacion residencial.',
    h1: 'Apartamentos en Zona 14, Guatemala',
    intro: 'Zona 14 es la zona residencial mas exclusiva de Ciudad de Guatemala. Sus condominios cerrados, amplias avenidas y proximidad a colegios, hospitales y centros comerciales la posicionan como la opcion preferida para familias y profesionales de alto nivel.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    content: '<h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Por que elegir Zona 14</h2><p>Zona 14 combina seguridad, infraestructura y calidad de vida como ninguna otra zona en Guatemala. Sus residentes disfrutan de acceso inmediato a los mejores colegios (American School, Colegio Interamericano), hospitales de primer nivel, y centros comerciales como Oakland Mall.</p><h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Tipos de apartamentos disponibles</h2><p>Desde estudios modernos ideales para profesionales jovenes hasta amplios penthouses familiares de 3-4 habitaciones con vistas panoramicas. Los precios van desde $150,000 para apartamentos de una habitacion hasta $1.5M+ para residencias de lujo en los condominios mas exclusivos.</p><h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Inversion en Zona 14</h2><p>La plusvalia en Zona 14 ha promediado un 8-12% anual en los ultimos cinco anos. Los apartamentos para renta generan rendimientos del 5-7% anual, impulsados por la demanda constante de la comunidad diplomatica y ejecutiva internacional.</p>',
    cta_link: '/zona/zona-14.html',
    cta_title: 'Ver apartamentos en Zona 14',
    cta_label: 'Explorar Zona 14',
    faqs: [
      { q: 'Cual es el precio promedio de un apartamento en Zona 14?', a: 'Los precios varian segun tamano y ubicacion. Un apartamento de 2 habitaciones oscila entre $180,000 y $350,000. Penthouses y residencias de lujo pueden superar $1 millon.' },
      { q: 'Es segura la Zona 14 para vivir?', a: 'Si. Zona 14 cuenta con vigilancia privada en la mayoria de condominios, garita de acceso controlado, y presencia de seguridad municipal. Es considerada una de las zonas mas seguras de Guatemala.' },
      { q: 'Que amenidades tienen los condominios en Zona 14?', a: 'La mayoria incluye piscina, gimnasio, areas sociales, salon de eventos, areas de juego, parqueo techado y seguridad 24/7. Algunos ofrecen spa, canchas deportivas y coworking.' }
    ]
  },
  {
    slug: 'casas-cayala-guatemala',
    title: 'Casas y Apartamentos en Cayala Guatemala — Venta 2026',
    desc: 'Propiedades en venta en Cayala, Guatemala. Residencias, apartamentos y townhouses en el desarrollo urbanistico mas innovador de Centroamerica.',
    h1: 'Propiedades en Cayala, Guatemala',
    intro: 'Cayala redefinio el concepto de vivienda urbana en Guatemala. Su diseno peatonal inspirado en ciudades europeas, arquitectura cuidadosamente curada y comunidad vibrante la convierten en una de las direcciones mas deseadas del pais.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    content: '<h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Vivir en Cayala</h2><p>Cayala no es solo un lugar para vivir — es un estilo de vida. Restaurantes, boutiques, cafeterias, oficinas y areas recreativas a pasos de tu puerta. Todo conectado por calles peatonales seguras con arquitectura que inspira.</p><h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Tipos de propiedades</h2><p>Cayala ofrece apartamentos desde $180,000, townhouses desde $280,000, y residencias unifamiliares que pueden superar los $800,000. Cada propiedad mantiene estandares arquitectonicos consistentes que protegen la plusvalia del conjunto.</p><h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Inversion y plusvalia</h2><p>La demanda en Cayala se mantiene constante y los precios han mostrado apreciacion sostenida del 10-15% anual. La restriccion de oferta (terreno finito) y la alta demanda crean condiciones ideales para inversion a mediano y largo plazo.</p>',
    cta_link: '/zona/cayala.html',
    cta_title: 'Ver propiedades en Cayala',
    cta_label: 'Explorar Cayala',
    faqs: [
      { q: 'Cuanto cuesta vivir en Cayala?', a: 'Apartamentos desde $180,000, townhouses desde $280,000 y casas desde $500,000. La cuota de mantenimiento varia segun el proyecto, generalmente entre $200 y $500 mensuales.' },
      { q: 'Cayala es segura?', a: 'Si. Cayala cuenta con seguridad privada 24/7, acceso controlado y vigilancia integral. Es uno de los entornos urbanos mas seguros de Guatemala.' },
      { q: 'Como es el trafico para entrar y salir de Cayala?', a: 'Cayala tiene multiples accesos. En horas pico puede haber congestion, pero las mejoras viales recientes han reducido significativamente los tiempos de traslado.' }
    ]
  },
  {
    slug: 'inversion-inmobiliaria-guatemala',
    title: 'Inversion Inmobiliaria en Guatemala 2026 — Guia y Oportunidades',
    desc: 'Todo sobre inversion inmobiliaria en Guatemala. Zonas con mayor plusvalia, rendimientos esperados, aspectos legales y oportunidades actuales de inversion.',
    h1: 'Inversion Inmobiliaria en Guatemala',
    intro: 'Guatemala se posiciona como uno de los mercados inmobiliarios mas atractivos de Centroamerica. Con crecimiento economico sostenido, una clase media en expansion y zonas urbanas en pleno desarrollo, las oportunidades de inversion son significativas para quienes saben donde buscar.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    content: '<h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Rendimientos del mercado guatemalteco</h2><p>El mercado inmobiliario guatemalteco ofrece rendimientos competitivos: propiedades para renta en zonas premium generan entre 5-8% anual, mientras que la plusvalia en zonas de expansion puede alcanzar 15-25% en periodos de 3-5 anos.</p><h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Zonas con mayor potencial</h2><p>Las zonas con mejor balance riesgo-retorno incluyen: Zona 14 y Zona 15 para renta estable, Cayala para plusvalia consistente, Fraijanes para crecimiento acelerado, y Carretera a El Salvador para oportunidades a mediano plazo.</p><h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Como empezar a invertir</h2><p>El primer paso es definir tu perfil de inversionista: renta pasiva, plusvalia a largo plazo, o desarrollo. Luego, trabaja con un asesor certificado que conozca el mercado local y pueda guiarte en la seleccion, verificacion legal y negociacion.</p>',
    cta_title: 'Conecta con un asesor de inversion',
    cta_text: 'Asesores verificados especializados en inversion inmobiliaria en Guatemala.',
    cta_link: '/asesores.html',
    cta_label: 'Ver asesores',
    faqs: [
      { q: 'Es buen momento para invertir en bienes raices en Guatemala?', a: 'Si. El mercado muestra crecimiento sostenido, precios aun accesibles comparados con otros paises de la region, y demanda creciente en zonas premium. La estabilidad macroeconomica del pais tambien favorece la inversion.' },
      { q: 'Cuanto capital necesito para invertir en inmuebles en Guatemala?', a: 'Depende del tipo de inversion. Apartamentos para renta desde $120,000, terrenos en zonas de expansion desde $50,000, y fincas desde $150,000. El financiamiento bancario esta disponible con enganches del 10-20%.' },
      { q: 'Un extranjero puede comprar propiedad en Guatemala?', a: 'Si. Los extranjeros tienen los mismos derechos de propiedad que los guatemaltecos, con excepcion de terrenos en zonas fronterizas. El proceso de compra es similar y se recomienda trabajar con un abogado local.' }
    ]
  },
  {
    slug: 'casas-zona-16-guatemala',
    title: 'Casas en Zona 16 Guatemala — Residencias Exclusivas 2026',
    desc: 'Casas y residencias en venta en Zona 16, Guatemala. Terrenos amplios, privacidad, vistas panoramicas y los condominios mas exclusivos de la capital.',
    h1: 'Casas en Zona 16, Guatemala',
    intro: 'Zona 16 es sinonimo de privacidad y exclusividad. Sus amplios terrenos, baja densidad poblacional y entorno natural la convierten en la eleccion de quienes buscan espacio, tranquilidad y las mejores vistas de la ciudad sin alejarse del centro urbano.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    content: '<h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Caracteristicas de Zona 16</h2><p>Zona 16 ofrece lo que pocas zonas pueden: terrenos de 500 a 2,000+ metros cuadrados, condominios con densidades minimas, acceso a barrancos con vegetacion natural, y vistas que abarcan toda la ciudad. Es la zona para quienes no negocian la privacidad.</p><h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Desarrollos destacados</h2><p>Los condominios mas reconocidos incluyen proyectos con lotes amplios, clubhouses exclusivos, canchas deportivas y senderos naturales dentro del conjunto. Las casas se construyen a medida, permitiendo personalizacion total.</p>',
    cta_link: '/zona/zona-16.html',
    cta_title: 'Ver propiedades en Zona 16',
    cta_label: 'Explorar Zona 16',
    faqs: [
      { q: 'Cuanto cuesta una casa en Zona 16?', a: 'Las casas en Zona 16 van desde $350,000 para residencias en condominio hasta $2M+ para propiedades con terrenos amplios y acabados de lujo.' },
      { q: 'Zona 16 esta lejos del centro?', a: 'No. Zona 16 esta a 15-25 minutos del centro financiero (Zona 10) y tiene acceso directo por vias principales. La conectividad es uno de sus grandes atractivos.' }
    ]
  },
  {
    slug: 'fincas-venta-guatemala',
    title: 'Fincas en Venta en Guatemala 2026 — Recreo, Productivas e Inversion',
    desc: 'Fincas en venta en Guatemala. Fincas de recreo, productivas y de inversion cerca de la capital. Fraijanes, Antigua, altiplano y mas.',
    h1: 'Fincas en Venta en Guatemala',
    intro: 'El mercado de fincas en Guatemala ofrece oportunidades unicas: desde fincas de recreo familiar a minutos de la capital hasta propiedades productivas con rendimientos agricolas y potencial de plusvalia excepcional.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    content: '<h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Tipos de fincas</h2><p><strong>Recreo:</strong> Propiedades rurales con casa, areas verdes, piscina y vistas. Ideales para descanso familiar los fines de semana. Precios desde $150,000 en zonas cercanas a la capital.</p><p><strong>Productivas:</strong> Terrenos con potencial agricola (cafe, macadamia, aguacate). Generan ingresos operativos ademas de plusvalia. Desde $200,000 dependiendo de ubicacion y extension.</p><p><strong>Inversion/Desarrollo:</strong> Extensiones grandes con potencial para lotificacion o proyectos turisticos. Requieren mayor capital pero ofrecen los retornos mas altos.</p><h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:32px 0 16px">Mejores ubicaciones</h2><p>Fraijanes y alrededores (30 min de la capital), corredor hacia Antigua Guatemala, y el altiplano occidental para fincas productivas de mayor extension.</p>',
    cta_link: '/tipo/finca.html',
    cta_title: 'Ver fincas disponibles',
    cta_label: 'Explorar fincas',
    faqs: [
      { q: 'Que debo verificar antes de comprar una finca?', a: 'Titulo de propiedad limpio, limites verificados por topografo, acceso a agua, servidumbres de paso, zonificacion y uso de suelo. Es fundamental trabajar con un abogado especialista.' },
      { q: 'Las fincas son buena inversion?', a: 'Si. Fincas cercanas a la capital han mostrado plusvalias del 10-20% anual. Combinadas con produccion agricola, ofrecen diversificacion atractiva para cualquier portafolio.' }
    ]
  }
];

module.exports = { seoLandingPage, landings };
