const { layout } = require('./layout');

function blogIndexPage(articles) {
  var cards = articles.map(function(a) {
    return '<a href="/blog/' + a.slug + '.html" style="background:white;border-radius:16px;overflow:hidden;border:1.5px solid #eef0f3;text-decoration:none;color:inherit;transition:all .3s" onmouseover="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 12px 30px rgba(0,0,0,.08)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'none\'">' +
      '<div style="aspect-ratio:16/9;overflow:hidden;background:#f1f5f9"><img src="' + (a.image || '') + '" alt="' + a.title + '" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>' +
      '<div style="padding:24px">' +
      '<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#C9A96E;margin-bottom:8px">' + a.category + '</div>' +
      '<h2 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin:0 0 10px;line-height:1.4">' + a.title + '</h2>' +
      '<p style="font-size:13px;color:#64748b;line-height:1.6;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">' + a.excerpt + '</p>' +
      '<div style="margin-top:14px;font-size:12px;color:#94a3b8">' + a.date + ' &middot; ' + a.readTime + ' min lectura</div>' +
      '</div></a>';
  }).join('');

  var body = '<div style="max-width:1200px;margin:0 auto;padding:48px 6%">' +
    '<div style="margin-bottom:40px">' +
    '<h1 style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:2.4rem;font-weight:300;color:#0a1628;margin:0 0 12px">Blog Inmobiliario</h1>' +
    '<p style="font-size:15px;color:#64748b;max-width:600px">Guias, analisis y consejos para invertir en bienes raices en Guatemala.</p>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px">' + cards + '</div>' +
    '</div>';

  return layout({
    title: 'Blog Inmobiliario Guatemala — Guias de Inversion y Compra',
    desc: 'Articulos sobre inversion inmobiliaria en Guatemala. Guias de compra, analisis de zonas, tendencias del mercado y consejos para compradores e inversionistas.',
    canonical: '/blog/',
    body: body
  });
}

function blogArticlePage(article) {
  var toc = article.sections ? article.sections.map(function(s, i) {
    return '<a href="#s' + i + '" style="display:block;padding:8px 0;font-size:13px;color:#64748b;text-decoration:none;border-left:2px solid #eef0f3;padding-left:16px;transition:all .2s" onmouseover="this.style.color=\'#C9A96E\';this.style.borderColor=\'#C9A96E\'" onmouseout="this.style.color=\'#64748b\';this.style.borderColor=\'#eef0f3\'">' + s.heading + '</a>';
  }).join('') : '';

  var content = article.sections ? article.sections.map(function(s, i) {
    return '<div id="s' + i + '" style="margin-bottom:40px">' +
      '<h2 style="font-size:1.4rem;font-weight:700;color:#0a1628;margin:0 0 16px;padding-top:24px">' + s.heading + '</h2>' +
      '<div style="font-size:15px;color:#374151;line-height:1.8">' + s.content + '</div>' +
      '</div>';
  }).join('') : '<div style="font-size:15px;color:#374151;line-height:1.8">' + (article.content || '') + '</div>';

  var schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.excerpt,
    'image': article.image || '',
    'datePublished': article.dateISO || '2026-07-17',
    'dateModified': article.dateISO || '2026-07-17',
    'author': { '@type': 'Organization', 'name': 'INMUHUB' },
    'publisher': { '@type': 'Organization', 'name': 'INMUHUB', 'url': 'https://inmuhub.com' }
  });

  var relatedHTML = '';
  if (article.related && article.related.length) {
    relatedHTML = '<div style="border-top:1px solid #eef0f3;padding-top:40px;margin-top:48px">' +
      '<h3 style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#C9A96E;margin-bottom:20px">Articulos relacionados</h3>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">' +
      article.related.map(function(r) {
        return '<a href="/blog/' + r.slug + '.html" style="padding:20px;border:1.5px solid #eef0f3;border-radius:12px;text-decoration:none;color:inherit;transition:all .2s" onmouseover="this.style.borderColor=\'#C9A96E\'" onmouseout="this.style.borderColor=\'#eef0f3\'">' +
          '<div style="font-size:14px;font-weight:700;color:#0a1628;margin-bottom:6px">' + r.title + '</div>' +
          '<div style="font-size:12px;color:#64748b">' + r.excerpt.substring(0, 100) + '...</div></a>';
      }).join('') + '</div></div>';
  }

  var body = '<div style="max-width:900px;margin:0 auto;padding:48px 6%">' +
    '<nav style="font-size:12px;color:#94a3b8;margin-bottom:24px"><a href="/" style="color:#94a3b8;text-decoration:none">Inicio</a> / <a href="/blog/" style="color:#94a3b8;text-decoration:none">Blog</a> / <span style="color:#64748b">' + article.title.substring(0, 50) + '</span></nav>' +
    '<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#C9A96E;margin-bottom:12px">' + article.category + '</div>' +
    '<h1 style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:2.2rem;font-weight:300;color:#0a1628;margin:0 0 16px;line-height:1.3">' + article.title + '</h1>' +
    '<div style="font-size:13px;color:#94a3b8;margin-bottom:32px">' + article.date + ' &middot; ' + article.readTime + ' min lectura</div>' +
    (article.image ? '<div style="margin-bottom:40px;border-radius:16px;overflow:hidden;aspect-ratio:16/9"><img src="' + article.image + '" alt="' + article.title + '" style="width:100%;height:100%;object-fit:cover"></div>' : '') +
    (toc ? '<div style="background:#f8f9fb;border-radius:12px;padding:24px 28px;margin-bottom:40px"><div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:12px">En este articulo</div>' + toc + '</div>' : '') +
    content +
    '<div style="background:rgba(201,169,110,.06);border:1.5px solid rgba(201,169,110,.2);border-radius:16px;padding:32px;margin-top:48px;text-align:center">' +
    '<h3 style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:1.4rem;font-weight:300;color:#0a1628;margin:0 0 12px">Encuentra tu propiedad ideal</h3>' +
    '<p style="font-size:14px;color:#64748b;margin-bottom:20px">Explora nuestro catalogo de propiedades verificadas en Guatemala.</p>' +
    '<a href="/propiedades.html" style="display:inline-block;background:#1a3a5c;color:white;padding:12px 32px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none">Ver propiedades</a>' +
    '</div>' +
    relatedHTML +
    '</div>' +
    '<script type="application/ld+json">' + schema + '</script>';

  return layout({
    title: article.title + ' — Blog INMUHUB',
    desc: article.excerpt,
    canonical: '/blog/' + article.slug + '.html',
    ogImage: article.image,
    body: body
  });
}

// --- ARTICLE DATA ---
var articles = [
  {
    slug: 'guia-inversion-inmobiliaria-guatemala',
    title: 'Guia completa para invertir en bienes raices en Guatemala 2026',
    excerpt: 'Todo lo que necesitas saber antes de invertir en propiedades en Guatemala. Zonas con mayor plusvalia, tipos de inversion, aspectos legales y errores comunes.',
    category: 'Inversion',
    date: 'Julio 2026',
    dateISO: '2026-07-15',
    readTime: 12,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    sections: [
      { heading: 'Por que invertir en Guatemala', content: '<p>Guatemala se ha posicionado como uno de los mercados inmobiliarios mas dinamicos de Centroamerica. Con un crecimiento del PIB sostenido, una poblacion joven en expansion y zonas urbanas en constante desarrollo, el pais ofrece oportunidades unicas para inversionistas locales e internacionales.</p><p>La plusvalia en zonas premium como Zona 10, Zona 14, Cayala y Fraijanes ha mostrado incrementos del 8-15% anual en los ultimos cinco anos, superando significativamente la inflacion y otros instrumentos de inversion tradicionales.</p>' },
      { heading: 'Zonas con mayor potencial de plusvalia', content: '<p><strong>Zona 14:</strong> El epicentro residencial de lujo. Condominios cerrados, clubes privados y la mejor infraestructura educativa. Ideal para familias de alto poder adquisitivo.</p><p><strong>Cayala:</strong> El desarrollo urbanistico mas innovador del pais. Concepto de ciudad dentro de la ciudad con crecimiento constante en demanda y precios.</p><p><strong>Zona 15:</strong> Equilibrio entre naturaleza y modernidad. Desarrollos contemporaneos con amenidades completas a precios competitivos respecto a Zona 14.</p><p><strong>Fraijanes:</strong> La frontera de expansion residencial premium. Terrenos amplios, clima templado y plusvalia acelerada por nuevos desarrollos.</p><p><strong>Carretera a El Salvador:</strong> Corredor de crecimiento con proyectos mixtos residenciales y comerciales. Alto potencial de revalorizacion a mediano plazo.</p>' },
      { heading: 'Tipos de inversion inmobiliaria', content: '<p><strong>Compra para renta:</strong> Apartamentos en zonas 10 y 14 generan rendimientos del 5-8% anual. La demanda de alquiler es constante por la comunidad diplomatica y ejecutiva.</p><p><strong>Compra para plusvalia:</strong> Terrenos y preventa en zonas de expansion como Fraijanes y Carretera a El Salvador. Mayor riesgo pero retornos potenciales del 15-25% en 3-5 anos.</p><p><strong>Fincas productivas:</strong> Combina apreciacion del terreno con generacion de ingresos agricolas. Ideal para diversificacion de portafolio.</p>' },
      { heading: 'Aspectos legales que debes conocer', content: '<p>Antes de invertir, asegurate de verificar: titulo de propiedad limpio en el Registro General de la Propiedad, pago de IUSI al dia, zonificacion municipal compatible con tu proyecto, y que no existan gravamenes o limitaciones.</p><p>Es recomendable trabajar con un abogado especialista en derecho inmobiliario y un asesor certificado que conozca el mercado local.</p>' },
      { heading: 'Errores comunes al invertir', content: '<p>Los errores mas frecuentes incluyen: no verificar la documentacion legal antes de comprar, no considerar los costos adicionales (escrituracion, impuestos, mantenimiento), invertir en zonas sin investigar la plusvalia historica, y no contar con asesoria profesional.</p><p>En INMUHUB conectamos compradores con asesores verificados que conocen cada zona y tipo de propiedad, reduciendo significativamente estos riesgos.</p>' }
    ]
  },
  {
    slug: 'mejores-zonas-vivir-guatemala',
    title: 'Las 7 mejores zonas para vivir en Ciudad de Guatemala en 2026',
    excerpt: 'Analisis detallado de las zonas residenciales mas exclusivas de Guatemala. Comparativa de precios, seguridad, servicios y calidad de vida.',
    category: 'Zonas',
    date: 'Julio 2026',
    dateISO: '2026-07-10',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    sections: [
      { heading: 'Criterios de evaluacion', content: '<p>Para este ranking evaluamos cada zona en cinco dimensiones: seguridad y vigilancia, acceso a servicios (colegios, hospitales, comercios), conectividad vial, plusvalia historica y calidad del entorno urbano.</p>' },
      { heading: '1. Zona 14 — La residencial por excelencia', content: '<p>Zona 14 lidera consistentemente como la zona residencial mas exclusiva de Guatemala. Sus amplias avenidas arboladas, condominios de primer nivel, y proximidad al aeropuerto internacional la convierten en la opcion preferida de familias de alto poder adquisitivo.</p><p><strong>Precios promedio:</strong> Desde $200,000 hasta $1.5M+ para casas en condominio.</p><p><strong>Ideal para:</strong> Familias que buscan espacio, privacidad y la mejor infraestructura educativa.</p>' },
      { heading: '2. Cayala — La ciudad dentro de la ciudad', content: '<p>Cayala redefinio el concepto de vivienda urbana en Guatemala. Su diseno peatonal, arquitectura europea, seguridad 24/7 y comunidad vibrante la hacen unica en Centroamerica.</p><p><strong>Precios promedio:</strong> Desde $180,000 para apartamentos hasta $800K+ para residencias.</p><p><strong>Ideal para:</strong> Profesionales jovenes y familias que valoran el lifestyle urbano moderno.</p>' },
      { heading: '3. Zona 15 — Naturaleza y modernidad', content: '<p>Zona 15 ofrece desarrollos contemporaneos rodeados de areas verdes. Es la alternativa ideal para quienes buscan la calidad de Zona 14 con precios mas accesibles.</p><p><strong>Precios promedio:</strong> Desde $150,000 para apartamentos hasta $600K+ para casas.</p>' },
      { heading: '4. Zona 10 — El epicentro urbano', content: '<p>Zona 10 es el corazon financiero y diplomatico. Ideal para quienes priorizan ubicacion central con acceso inmediato a restaurantes, hoteles y centros comerciales de primer nivel.</p><p><strong>Precios promedio:</strong> Desde $120,000 para apartamentos hasta $500K+ para penthouses.</p>' },
      { heading: '5. Zona 16 — Privacidad y exclusividad', content: '<p>Zona 16 ofrece terrenos amplios, vistas panoramicas y baja densidad poblacional. Es la eleccion de quienes buscan privacidad absoluta sin alejarse de la ciudad.</p>' },
      { heading: '6. Fraijanes — Expansion premium', content: '<p>Fraijanes combina clima templado, entorno natural y desarrollos modernos. Su crecimiento acelerado la posiciona como la proxima gran zona residencial de Guatemala.</p>' },
      { heading: '7. Carretera a El Salvador — El corredor emergente', content: '<p>El corredor hacia El Salvador ha experimentado un boom de desarrollos mixtos. Precios aun accesibles con alto potencial de plusvalia a mediano plazo.</p>' }
    ]
  },
  {
    slug: 'como-comprar-casa-guatemala-paso-a-paso',
    title: 'Como comprar casa en Guatemala: guia paso a paso',
    excerpt: 'Proceso completo de compra de vivienda en Guatemala. Desde la busqueda hasta la escrituracion, incluyendo financiamiento, documentos necesarios y costos.',
    category: 'Guias',
    date: 'Julio 2026',
    dateISO: '2026-07-05',
    readTime: 15,
    image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80',
    sections: [
      { heading: 'Paso 1: Define tu presupuesto real', content: '<p>Antes de buscar propiedades, calcula tu capacidad de compra considerando no solo el precio de la propiedad sino tambien: gastos de escrituracion (aproximadamente 1-2% del valor), impuestos de transferencia, honorarios legales, y costos de mudanza y adecuacion.</p><p>Si planeas financiar, la cuota mensual no debe superar el 30% de tus ingresos netos mensuales. Usa nuestra <a href="/herramientas/calculadora-hipotecaria.html" style="color:#C9A96E;font-weight:600">calculadora hipotecaria</a> para estimar tu cuota.</p>' },
      { heading: 'Paso 2: Elige la zona ideal', content: '<p>Cada zona tiene personalidad propia. Considera: distancia al trabajo, colegios para tus hijos, nivel de seguridad, acceso a comercios y servicios medicos, y potencial de plusvalia.</p><p>Visita las zonas en diferentes horarios para tener una perspectiva real del trafico, ruido y ambiente.</p>' },
      { heading: 'Paso 3: Busca con un asesor certificado', content: '<p>Un buen asesor inmobiliario no solo te muestra propiedades — te orienta sobre precios justos, historial del inmueble, potencial de la zona y negociacion. En <a href="/asesores.html" style="color:#C9A96E;font-weight:600">INMUHUB</a> encuentras asesores verificados especializados por zona.</p>' },
      { heading: 'Paso 4: Verifica la documentacion legal', content: '<p>Antes de hacer cualquier oferta, solicita y verifica: certificacion del Registro General de la Propiedad, solvencia de IUSI, planos registrados, licencia de construccion (si aplica), y que no existan demandas o gravamenes pendientes.</p>' },
      { heading: 'Paso 5: Negocia y firma promesa de venta', content: '<p>Una vez que encuentres la propiedad ideal, negocia el precio y condiciones. La promesa de compraventa es un documento legal que protege ambas partes y establece plazos, precio final y condiciones de pago.</p>' },
      { heading: 'Paso 6: Financiamiento y tramites bancarios', content: '<p>Si necesitas credito hipotecario, compara tasas en al menos 3 bancos. Los bancos en Guatemala ofrecen plazos de 15 a 25 anos con tasas que varian entre 7% y 11% anual. Prepara: constancia de ingresos, estados de cuenta, DPI, NIT y referencia crediticia.</p>' },
      { heading: 'Paso 7: Escrituracion y entrega', content: '<p>La escritura publica se firma ante notario y se inscribe en el Registro de la Propiedad. El proceso toma entre 2 y 6 semanas. Una vez registrada, recibes las llaves y tu propiedad esta oficialmente a tu nombre.</p>' }
    ]
  },
  {
    slug: 'apartamentos-inversion-zona-10-zona-14',
    title: 'Apartamentos para inversion en Zona 10 y Zona 14: rentabilidad y oportunidades',
    excerpt: 'Analisis de rentabilidad de apartamentos en las zonas premium de Guatemala. Rendimientos esperados, tipos de inquilinos y mejores edificios para invertir.',
    category: 'Inversion',
    date: 'Julio 2026',
    dateISO: '2026-07-01',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
    sections: [
      { heading: 'El mercado de renta en Guatemala', content: '<p>La demanda de apartamentos en renta en zonas premium se mantiene solida gracias a la comunidad diplomatica, ejecutivos corporativos internacionales y profesionales jovenes guatemaltecos que prefieren vivir en ubicaciones centrales sin comprometerse con una compra.</p>' },
      { heading: 'Rendimientos esperados por zona', content: '<p><strong>Zona 10:</strong> Apartamentos de 1-2 habitaciones generan entre 5% y 7% de rendimiento anual bruto. La demanda es constante por la proximidad a oficinas corporativas y hoteles.</p><p><strong>Zona 14:</strong> Apartamentos familiares de 2-3 habitaciones rinden entre 4.5% y 6.5% anual. La estabilidad de inquilinos es mayor — familias tienden a quedarse 2-3 anos minimo.</p>' },
      { heading: 'Que buscar al comprar para renta', content: '<p>Prioriza: ubicacion cerca de servicios, estado de la construccion, costos de mantenimiento bajos, amenidades del edificio (gimnasio, piscina, seguridad), y flexibilidad para amueblar. Un apartamento amueblado puede generar 30-40% mas de renta mensual.</p>' },
      { heading: 'Costos y consideraciones fiscales', content: '<p>Como propietario que renta, debes considerar: cuota de mantenimiento del condominio, seguro del inmueble, impuesto sobre la renta por alquiler (5% sobre ingresos brutos o escala progresiva), y reserva para mantenimiento y vacancias.</p>' }
    ]
  },
  {
    slug: 'fincas-guatemala-guia-compra',
    title: 'Comprar finca en Guatemala: todo lo que necesitas saber',
    excerpt: 'Guia completa sobre la compra de fincas en Guatemala. Tipos de fincas, zonas recomendadas, aspectos legales especificos y oportunidades de inversion rural.',
    category: 'Fincas',
    date: 'Junio 2026',
    dateISO: '2026-06-25',
    readTime: 11,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    sections: [
      { heading: 'Tipos de fincas disponibles', content: '<p><strong>Fincas de recreo:</strong> Propiedades rurales destinadas al descanso familiar. Generalmente incluyen casa, areas verdes, piscina y vistas panoramicas.</p><p><strong>Fincas productivas:</strong> Terrenos con capacidad agricola (cafe, cardamomo, macadamia, frutas) que generan ingresos operativos ademas de la plusvalia del terreno.</p><p><strong>Fincas de desarrollo:</strong> Extensiones grandes con potencial para lotificacion o proyectos residenciales/turisticos.</p>' },
      { heading: 'Zonas recomendadas', content: '<p><strong>Fraijanes y alrededores:</strong> A solo 30 minutos de la capital, ofrece clima templado ideal y acceso rapido a la ciudad.</p><p><strong>Antigua Guatemala:</strong> Alto valor turistico y cultural. Las fincas cerca de Antigua combinan lifestyle premium con potencial de renta vacacional.</p><p><strong>Altiplano:</strong> Terrenos mas grandes a precios accesibles con potencial productivo significativo.</p>' },
      { heading: 'Verificaciones legales especificas', content: '<p>Para fincas, ademas de las verificaciones estandar, asegurate de: verificar los limites exactos del terreno con un topografo certificado, confirmar el acceso a agua y servidumbres de paso, revisar la zonificacion y uso de suelo permitido, y verificar si existen derechos de posesion de terceros.</p>' },
      { heading: 'Oportunidades de inversion', content: '<p>Las fincas cercanas a la capital han mostrado plusvalias del 10-20% anual en los ultimos anos, especialmente en corredores de expansion como Fraijanes y Carretera a El Salvador. La combinacion de apreciacion del terreno mas ingresos productivos las convierte en inversiones muy atractivas para diversificacion de portafolio.</p>' }
    ]
  }
];

// Add cross-references
articles.forEach(function(a, i) {
  a.related = articles.filter(function(r) { return r.slug !== a.slug; }).slice(0, 3);
});

module.exports = { blogIndexPage, blogArticlePage, articles };
