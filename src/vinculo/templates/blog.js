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
  },
  {
    slug: 'credito-hipotecario-guatemala-bancos',
    title: 'Credito hipotecario en Guatemala 2026: bancos, tasas y requisitos',
    excerpt: 'Comparativa actualizada de creditos hipotecarios en Guatemala. Tasas de interes, plazos, requisitos y consejos para obtener la mejor financiacion.',
    category: 'Finanzas',
    date: 'Julio 2026',
    dateISO: '2026-07-20',
    readTime: 14,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    sections: [
      { heading: 'Panorama del credito hipotecario en Guatemala', content: '<p>El mercado hipotecario guatemalteco ha evolucionado significativamente. Hoy existen opciones de financiamiento desde bancos tradicionales hasta cooperativas y entidades de desarrollo, cada una con condiciones particulares que pueden hacer una gran diferencia en el costo total de tu propiedad.</p><p>Entender las opciones disponibles es fundamental antes de comprometerte con un credito que te acompanara durante 15 a 25 anos.</p>' },
      { heading: 'Comparativa de tasas por banco', content: '<p><strong>Bancos comerciales grandes:</strong> Tasas entre 7.5% y 9.5% anual en quetzales. Plazos de hasta 25 anos con enganches desde el 10%. Mas competitivos para montos superiores a Q1 millon.</p><p><strong>Bancos medianos:</strong> Tasas entre 8% y 10.5%. Mas flexibles en requisitos de ingreso.</p><p><strong>FHA:</strong> Programa gubernamental con tasas preferenciales desde 6.5% para vivienda de interes social.</p><p><strong>Cooperativas:</strong> Tasas entre 7% y 9% para asociados. Requieren membresia y ahorro previo.</p>' },
      { heading: 'Requisitos generales', content: '<p>La mayoria de instituciones solicitan: DPI vigente, NIT, constancia de ingresos de los ultimos 6 meses, estados de cuenta bancarios, referencias crediticias, avaluo de la propiedad, y certificacion del Registro de la Propiedad.</p><p><strong>Ingreso minimo:</strong> La cuota mensual no debe superar el 30-35% de tu ingreso neto. Para un credito de Q1 millon a 20 anos al 8%, la cuota ronda los Q8,400, necesitando ingresos de al menos Q24,000.</p>' },
      { heading: 'Costos adicionales del credito', content: '<p>Mas alla de la cuota mensual: gastos de escrituracion (1-2% del valor), seguro de vida sobre saldo deudor, seguro contra incendio y terremoto, gastos de avaluo (Q2,000-Q5,000), y comision de apertura (0.5-1%). Estos costos pueden sumar entre Q30,000 y Q80,000.</p>' },
      { heading: 'Consejos para obtener la mejor tasa', content: '<p>Negocia activamente — las tasas publicadas son negociables. Presenta cotizaciones de otros bancos. Mantiene un historial crediticio limpio al menos 12 meses antes. Considera un enganche mayor del 20% para mejores condiciones.</p><p>Un asesor inmobiliario en <a href="/asesores.html" style="color:#C9A96E;font-weight:600">INMUHUB</a> puede orientarte sobre las mejores opciones de financiamiento.</p>' }
    ]
  },
  {
    slug: 'vivir-en-cayala-guatemala',
    title: 'Vivir en Cayala: la experiencia completa de la ciudad jardin de Guatemala',
    excerpt: 'Todo sobre vivir en Cayala. Precios actualizados, tipos de vivienda, amenidades y por que es una de las mejores opciones residenciales de Centroamerica.',
    category: 'Zonas',
    date: 'Julio 2026',
    dateISO: '2026-07-18',
    readTime: 11,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    sections: [
      { heading: 'Que hace unico a Cayala', content: '<p>Cayala no es un simple desarrollo residencial — es un concepto urbanistico completo inspirado en ciudades europeas. Calles peatonales, plazas publicas, comercios artesanales, restaurantes gourmet y areas culturales crean una experiencia de vida que no existe en ningun otro lugar de Guatemala.</p>' },
      { heading: 'Tipos de vivienda y precios', content: '<p><strong>Apartamentos tipo loft:</strong> Desde $130,000. Ideales para profesionales jovenes.</p><p><strong>Apartamentos familiares (2-3 hab):</strong> Desde $220,000 hasta $450,000.</p><p><strong>Casas en condominio:</strong> Desde $350,000 hasta $800,000+.</p><p><strong>Penthouses:</strong> Desde $500,000 con vistas panoramicas y terrazas amplias.</p>' },
      { heading: 'Estilo de vida', content: '<p>Vivir en Cayala significa caminar al supermercado, al banco, al gimnasio y a los mejores restaurantes. Los ninos juegan en plazas seguras. Los fines de semana hay eventos culturales, mercados artesanales y conciertos al aire libre. La comunidad es activa y conectada.</p>' },
      { heading: 'Plusvalia y potencial de inversion', content: '<p>Cayala ha demostrado una plusvalia consistente del 8-12% anual. La demanda supera la oferta, especialmente en unidades de 2-3 habitaciones. Como inversion para renta, los apartamentos amueblados generan rendimientos del 6-8% anual.</p>' },
      { heading: 'Conectividad y ubicacion', content: '<p>Ubicada en Zona 16, con acceso directo al Boulevard Vista Hermosa y Calzada La Paz. A 15 minutos de Zona 10 y 20 minutos del aeropuerto.</p><p>Explora opciones disponibles en Cayala en <a href="/" style="color:#C9A96E;font-weight:600">INMUHUB</a>.</p>' }
    ]
  },
  {
    slug: 'plusvalia-inmobiliaria-guatemala-que-es',
    title: 'Que es la plusvalia inmobiliaria y como aprovecharla en Guatemala',
    excerpt: 'Como funciona la plusvalia de propiedades en Guatemala. Factores que la impulsan, zonas con mayor crecimiento y estrategias para maximizar tu inversion.',
    category: 'Inversion',
    date: 'Julio 2026',
    dateISO: '2026-07-16',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=1200&q=80',
    sections: [
      { heading: 'Que es la plusvalia', content: '<p>La plusvalia es el incremento de valor que experimenta una propiedad con el tiempo. En Guatemala, la plusvalia promedio en zonas premium ha sido del 8-15% anual en la ultima decada, superando la inflacion (4-5%) y los rendimientos financieros tradicionales (5-7%).</p>' },
      { heading: 'Factores que impulsan la plusvalia', content: '<p><strong>Infraestructura:</strong> Nuevas carreteras y transporte aumentan el valor de zonas conectadas.</p><p><strong>Desarrollo comercial:</strong> Centros comerciales, hospitales y colegios de prestigio elevan los precios circundantes.</p><p><strong>Seguridad:</strong> Zonas con vigilancia privada y condominios cerrados mantienen su valor.</p><p><strong>Escasez de terreno:</strong> En zonas consolidadas la limitada disponibilidad impulsa precios al alza.</p>' },
      { heading: 'Zonas con mayor plusvalia', content: '<p><strong>Cayala:</strong> 10-12% anual. <strong>Zona 14:</strong> 8-10% anual. <strong>Fraijanes:</strong> 12-18% anual. <strong>Carretera a El Salvador:</strong> 10-15% anual.</p>' },
      { heading: 'Estrategias para maximizar plusvalia', content: '<p>Compra en preventa con descuentos del 10-20%. Invierte en zonas de expansion antes del boom. Mejora cocina y banos que recuperan 70-90% en el valor de reventa.</p><p>Un asesor de <a href="/asesores.html" style="color:#C9A96E;font-weight:600">INMUHUB</a> puede ayudarte a identificar oportunidades con mayor potencial.</p>' }
    ]
  },
  {
    slug: 'impuestos-compra-venta-propiedad-guatemala',
    title: 'Impuestos inmobiliarios en Guatemala: IUSI, ISR y costos de escrituracion',
    excerpt: 'Guia completa sobre impuestos al comprar, vender o poseer propiedades en Guatemala. IUSI, impuesto de transferencia, ISR por renta y deducciones.',
    category: 'Legal',
    date: 'Julio 2026',
    dateISO: '2026-07-14',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=80',
    sections: [
      { heading: 'IUSI — Impuesto Unico Sobre Inmuebles', content: '<p>El IUSI es el equivalente al impuesto predial. Se calcula sobre el valor fiscal registrado en DICABI o la municipalidad.</p><p><strong>Tasas:</strong> 2 por millar para Q2,001-Q20,000. 6 por millar para Q20,001-Q70,000. 9 por millar para valores superiores a Q70,000.</p><p>Pago trimestral en la municipalidad correspondiente.</p>' },
      { heading: 'Impuesto de transferencia', content: '<p>Al comprar o vender se genera un impuesto del 3% sobre la base imponible (el valor mas alto entre precio declarado, valor fiscal en DICABI, o avaluo bancario). Generalmente lo paga el comprador.</p>' },
      { heading: 'ISR por renta de inmuebles', content: '<p><strong>Regimen simplificado:</strong> 5% sobre ingresos brutos de renta.</p><p><strong>Regimen sobre utilidades:</strong> 25% sobre renta neta (ingresos menos gastos deducibles). Conviene cuando los gastos son significativos.</p>' },
      { heading: 'Costos de escrituracion', content: '<p>Honorarios del notario (0.5-1%), timbres notariales y fiscales, inscripcion en el Registro de la Propiedad. Total: 1.5-3% del valor de la propiedad.</p>' },
      { heading: 'Deducciones y beneficios fiscales', content: '<p>La vivienda propia esta exenta del ISR por ganancia de capital si es tu residencia habitual por al menos 2 anos. Los intereses hipotecarios son deducibles del ISR anual. Las mejoras al inmueble pueden sumarse al costo de adquisicion.</p><p>Consulta con un asesor inmobiliario de <a href="/asesores.html" style="color:#C9A96E;font-weight:600">INMUHUB</a> para optimizar tu situacion fiscal.</p>' }
    ]
  },
  {
    slug: 'renta-vs-compra-vivienda-guatemala',
    title: 'Rentar o comprar casa en Guatemala: analisis financiero completo',
    excerpt: 'Analisis detallado de rentar versus comprar vivienda en Guatemala con numeros reales para ayudarte a tomar la mejor decision financiera.',
    category: 'Finanzas',
    date: 'Julio 2026',
    dateISO: '2026-07-12',
    readTime: 13,
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&q=80',
    sections: [
      { heading: 'El dilema con numeros reales', content: '<p>Analicemos ambos escenarios con un apartamento de 2 habitaciones en Zona 14 valorado en $250,000 (Q1,950,000).</p>' },
      { heading: 'Escenario compra', content: '<p><strong>Enganche (20%):</strong> $50,000. <strong>Credito:</strong> $200,000 a 20 anos al 8.5%. <strong>Cuota mensual:</strong> ~$1,740. <strong>Costos adicionales:</strong> Mantenimiento $200, seguro $80, IUSI $40. <strong>Total mensual:</strong> $2,060.</p><p>En 20 anos habras pagado ~$497,000 pero seras dueno de un activo que con plusvalia del 8% anual valdria ~$1,165,000.</p>' },
      { heading: 'Escenario renta', content: '<p><strong>Renta mensual:</strong> $1,200 con incremento anual del 5-8%. Sin costos de mantenimiento mayor. Sin inversion inicial grande.</p><p>En 20 anos habras pagado ~$480,000 en renta sin generar patrimonio.</p>' },
      { heading: 'Cuando conviene comprar', content: '<p>Cuando planeas quedarte al menos 5 anos, tienes el enganche sin comprometer tu fondo de emergencia, la cuota no supera el 30% de tus ingresos, y la plusvalia supera la tasa del credito.</p>' },
      { heading: 'Cuando conviene rentar', content: '<p>Cuando no estas seguro de quedarte mas de 3 anos, prefieres flexibilidad, puedes invertir la diferencia en instrumentos con mayor rendimiento, o el mercado esta sobrevalorado.</p><p>Encuentra opciones en <a href="/" style="color:#C9A96E;font-weight:600">INMUHUB</a>.</p>' }
    ]
  },
  {
    slug: 'condominios-cerrados-guatemala-guia',
    title: 'Condominios cerrados en Guatemala: seguridad, amenidades y mejores opciones',
    excerpt: 'Guia sobre condominios cerrados en Guatemala. Ventajas, costos de mantenimiento, aspectos legales y los mejores condominios por zona.',
    category: 'Guias',
    date: 'Julio 2026',
    dateISO: '2026-07-08',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
    sections: [
      { heading: 'Por que elegir un condominio cerrado', content: '<p>Los condominios cerrados son la opcion predominante en zonas premium de Guatemala. Acceso controlado, vigilancia 24/7, camaras y rondas perimetrales ofrecen tranquilidad dificil de conseguir en viviendas independientes.</p><p>Ademas ofrecen amenidades: piscinas, gimnasios, areas de juego, salones sociales, coworking y areas verdes mantenidas.</p>' },
      { heading: 'Costos de mantenimiento', content: '<p>La cuota cubre: seguridad (40-50%), areas comunes (20-25%), servicios basicos (15-20%), fondo de reserva (10-15%).</p><p><strong>Rangos:</strong> Zona 10: Q1,500-Q4,000/mes. Zona 14: Q2,000-Q6,000/mes. Cayala: Q2,500-Q5,000/mes. Zona 15: Q1,200-Q3,500/mes.</p>' },
      { heading: 'Aspectos legales de la copropiedad', content: '<p>Al comprar en condominio adquieres una finca filial con derechos sobre tu unidad y participacion en areas comunes. Revisa: reglamento de copropiedad, estatutos de administracion, actas de asambleas recientes y estado financiero del condominio.</p>' },
      { heading: 'Como evaluar un condominio', content: '<p>Visita en diferentes horarios. Habla con residentes. Revisa mantenimiento de areas comunes. Pregunta por proyectos planificados. Verifica la empresa de seguridad.</p><p>Los asesores de <a href="/asesores.html" style="color:#C9A96E;font-weight:600">INMUHUB</a> conocen la reputacion de los principales condominios en cada zona.</p>' }
    ]
  },
  {
    slug: 'terrenos-lotes-inversion-guatemala',
    title: 'Comprar terrenos y lotes en Guatemala: requisitos, precios y oportunidades',
    excerpt: 'Guia para compra de terrenos en Guatemala. Verificacion legal, precios por zona y oportunidades de inversion en lotificaciones.',
    category: 'Inversion',
    date: 'Julio 2026',
    dateISO: '2026-07-06',
    readTime: 12,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    sections: [
      { heading: 'Por que invertir en terrenos', content: '<p>La compra de terrenos es una de las formas mas efectivas de generar patrimonio. En Guatemala, donde la expansion urbana avanza rapidamente, terrenos bien ubicados pueden multiplicar su valor en pocos anos. No hay depreciacion de construccion ni mantenimiento costoso.</p>' },
      { heading: 'Verificaciones legales indispensables', content: '<p><strong>Certificacion del Registro de la Propiedad</strong> para confirmar propietario y ausencia de gravamenes. <strong>Medida topografica</strong> por ingeniero colegiado. <strong>Zonificacion municipal</strong> que permita el uso planificado. Verifica acceso a agua, electricidad, drenajes y servidumbres de paso.</p>' },
      { heading: 'Precios por zona', content: '<p><strong>Zona 14:</strong> $300-$600/v2, escasos. <strong>Cayala:</strong> $250-$500/v2, limitados. <strong>Fraijanes:</strong> $50-$180/v2, mayor disponibilidad. <strong>Carretera a El Salvador:</strong> $40-$150/v2. <strong>Fincas rurales:</strong> $5-$30/v2.</p>' },
      { heading: 'Lotificaciones: oportunidad o riesgo', content: '<p>Verifica siempre: licencia municipal aprobada, servicios basicos garantizados en contrato, cronograma de urbanizacion, y que el desarrollador tenga historial comprobable.</p><p>Busca asesorias profesionales en <a href="/asesores.html" style="color:#C9A96E;font-weight:600">INMUHUB</a> antes de invertir en lotificaciones.</p>' }
    ]
  },
  {
    slug: 'seguridad-residencial-guatemala-zonas-seguras',
    title: 'Seguridad residencial en Guatemala: las zonas mas seguras para vivir',
    excerpt: 'Analisis de seguridad por zona residencial en Guatemala. Tipos de proteccion, condominios con mejor seguridad y factores clave al elegir donde vivir.',
    category: 'Zonas',
    date: 'Julio 2026',
    dateISO: '2026-07-03',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80',
    sections: [
      { heading: 'La seguridad como factor principal', content: '<p>En Guatemala, la seguridad es el factor numero uno al elegir donde vivir. Las zonas residenciales premium han desarrollado ecosistemas de seguridad privada con niveles de proteccion comparables a los mejores vecindarios de cualquier ciudad latinoamericana.</p>' },
      { heading: 'Tipos de seguridad residencial', content: '<p><strong>Condominios cerrados:</strong> Control de acceso, CCTV, rondas perimetrales y personal 24/7.</p><p><strong>Colonias con acceso controlado:</strong> Calles privadas con garitas. Menor costo pero menor control.</p><p><strong>Vigilancia municipal reforzada:</strong> Zonas como Cayala cuentan con vigilancia publica adicional.</p>' },
      { heading: 'Ranking de zonas por seguridad', content: '<p><strong>Cayala:</strong> Seguridad integral del masterplan — posiblemente el lugar mas seguro de Guatemala.</p><p><strong>Zona 14 (condominios):</strong> Excelente seguridad interna con vigilancia de zona.</p><p><strong>Zona 15:</strong> Condominios con alta seguridad en entorno de baja densidad.</p><p><strong>Zona 16:</strong> Menor densidad reduce riesgos. Protocolos estrictos.</p><p><strong>Fraijanes:</strong> Desarrollos recientes con tecnologia moderna.</p>' },
      { heading: 'Que evaluar antes de mudarte', content: '<p>Pregunta: empresa de seguridad y antiguedad, agentes por turno, monitoreo con camaras, protocolo de emergencia, requisitos de identificacion para visitantes.</p><p>Encuentra propiedades en las zonas mas seguras en <a href="/" style="color:#C9A96E;font-weight:600">INMUHUB</a>.</p>' }
    ]
  },
  {
    slug: 'primer-departamento-guatemala-jovenes',
    title: 'Tu primer apartamento en Guatemala: guia para jovenes profesionales',
    excerpt: 'Consejos practicos para comprar tu primer apartamento en Guatemala. Presupuesto, ubicacion, financiamiento y errores comunes de compradores primerizos.',
    category: 'Guias',
    date: 'Junio 2026',
    dateISO: '2026-06-28',
    readTime: 11,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    sections: [
      { heading: 'El momento correcto para comprar', content: '<p>Estas listo cuando: tienes fondo de emergencia de 6 meses, puedes cubrir el enganche sin endeudarte, la cuota no superaria el 30% de tu ingreso neto, y llevas al menos 2 anos de estabilidad laboral.</p>' },
      { heading: 'Cuanto necesitas ahorrar', content: '<p>Para un apartamento de Q800,000: Enganche (20%): Q160,000. Escrituracion: Q16,000-Q24,000. Mudanza: Q15,000-Q30,000. Contingencia: Q20,000. <strong>Total: Q215,000-Q235,000.</strong></p><p>Ahorrando Q5,000/mes necesitas ~4 anos. Con Q8,000/mes, 2.5 anos.</p>' },
      { heading: 'Mejores zonas para primer apartamento', content: '<p><strong>Zona 10:</strong> Q600,000-Q1.2M. Vida urbana activa.</p><p><strong>Zona 15:</strong> Q500,000-Q900,000. Mejor relacion precio-espacio.</p><p><strong>Carretera a El Salvador (km 9-15):</strong> Q400,000-Q700,000. Precios accesibles con alta plusvalia.</p>' },
      { heading: 'Errores del comprador primerizo', content: '<p><strong>Comprar por emocion:</strong> Visita al menos 5-8 opciones. <strong>Ignorar costos ocultos:</strong> Mantenimiento, IUSI, seguros suman Q2,000-Q4,000 extra. <strong>No negociar:</strong> Todo es negociable. <strong>No verificar la constructora:</strong> Investiga proyectos anteriores.</p>' },
      { heading: 'Pasos concretos', content: '<p>1. Define tu presupuesto real. 2. Explora zonas en diferentes horarios. 3. Conecta con un asesor en <a href="/asesores.html" style="color:#C9A96E;font-weight:600">INMUHUB</a>. 4. Precalifica en al menos 2 bancos. 5. Agenda visitas dentro de tu rango.</p>' }
    ]
  },
  {
    slug: 'desarrollo-inmobiliario-guatemala-2026-tendencias',
    title: 'Tendencias inmobiliarias Guatemala 2026: que viene para el mercado',
    excerpt: 'Analisis de las tendencias del mercado inmobiliario guatemalteco en 2026. Nuevos desarrollos, zonas emergentes y oportunidades de inversion.',
    category: 'Mercado',
    date: 'Junio 2026',
    dateISO: '2026-06-20',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    sections: [
      { heading: 'Estado actual del mercado', content: '<p>El mercado inmobiliario guatemalteco en 2026 muestra senales predominantemente positivas. La demanda en zonas premium se mantiene solida impulsada por clase media en crecimiento, remesas y acceso a credito. La oferta de terrenos en zonas consolidadas continua contrayendose.</p>' },
      { heading: 'Zonas emergentes', content: '<p><strong>Corredor Pacifico (km 15-25 CES):</strong> Mayor concentracion de nuevos desarrollos mixtos.</p><p><strong>San Cristobal - Mixco:</strong> Vivienda vertical accesible para jovenes profesionales (Q500,000-Q800,000).</p><p><strong>Fraijanes norte:</strong> Expansion natural de Zona 16 con mejor relacion precio-espacio.</p>' },
      { heading: 'Tendencias en diseno', content: '<p><strong>Sostenibilidad:</strong> Certificaciones LEED y disenos bioclimaticos como estandar premium.</p><p><strong>Espacios flexibles:</strong> Home office integrado con buena iluminacion y acustica.</p><p><strong>Amenidades wellness:</strong> Areas de meditacion, senderos, huertos y espacios pet-friendly.</p>' },
      { heading: 'Proyecciones de precios', content: '<p>Zonas consolidadas (Z10, Z14, Cayala): crecimiento 6-10%. Zonas de expansion: 10-15%. Apartamentos pequenos con mayor demanda. Terrenos rurales cercanos apreciandose 12-20%.</p>' },
      { heading: 'Oportunidades 2026', content: '<p>Preventas en zonas de expansion (descuentos 10-15%), apartamentos 1-2 hab para renta ejecutiva, y terrenos en corredores con infraestructura planificada.</p><p>Mantente actualizado en <a href="/" style="color:#C9A96E;font-weight:600">INMUHUB</a>.</p>' }
    ]
  }
];

// Add cross-references
articles.forEach(function(a, i) {
  a.related = articles.filter(function(r) { return r.slug !== a.slug; }).slice(0, 3);
});

module.exports = { blogIndexPage, blogArticlePage, articles };
