import {
  html, raw, escape, formatMoney, formatNumber, TYPE_LABELS, OPERATION_LABELS, POSITION_LABELS, firstImage, parseJsonArray,
} from './html.js';

const CHECK = raw('<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>');
const WA_ICON = raw('<svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z"/></svg>');
const GLOBE = raw('<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18"/></svg>');

// ---------- Layout ----------

export function layout(env, { title, description, image, path = '/', body, noindex = false, bodyClass = '' }) {
  const site = env.SITE_URL || '';
  const fullTitle = title ? `${title} · inmuhub` : 'inmuhub · Portal inmobiliario curado en Guatemala';
  const desc = description || 'Propiedades revisadas en Guatemala, con lectura de valor por zona y contacto directo por WhatsApp.';
  const pixel = env.META_PIXEL_ID
    ? raw(`<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${escape(env.META_PIXEL_ID)}');fbq('track','PageView');document.addEventListener('submit',function(e){if(e.target.dataset.lead)fbq('track','Lead');});</script>`)
    : '';
  return html`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${fullTitle}</title>
<meta name="description" content="${desc}">
${noindex ? raw('<meta name="robots" content="noindex">') : ''}
<link rel="canonical" href="${site + path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="inmuhub">
<meta property="og:title" content="${title || 'inmuhub'}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${site + path}">
${image ? html`<meta property="og:image" content="${image.startsWith('/') ? site + image : image}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/portal.css">
${pixel}
</head>
<body class="${bodyClass}">
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="/">inmuhub <span>Guatemala</span></a>
    <nav class="main-nav" aria-label="Principal">
      <a href="/propiedades">Propiedades</a>
      <a href="/valor">Valor por zona</a>
      <a href="/publicar">Para propietarios</a>
      <a href="/planes">Para inmobiliarias</a>
    </nav>
    <a class="btn btn-primary btn-sm" href="/publicar"><span class="only-desktop">Publicar propiedad</span><span class="only-mobile">Publicar</span></a>
  </div>
</header>
<main>${body}</main>
<footer class="site-footer">
  <div class="wrap footer-row">
    <div>
      <div class="brand">inmuhub</div>
      <p class="muted">Portal inmobiliario curado en Guatemala.</p>
    </div>
    <div class="footer-cols">
      <div><strong>Explorar</strong><a href="/propiedades">Propiedades</a><a href="/valor">Valor por zona</a></div>
      <div><strong>Publicar</strong><a href="/publicar">Propietarios</a><a href="/planes">Inmobiliarias</a></div>
    </div>
  </div>
  <div class="wrap footer-legal muted">© ${new Date().getFullYear()} inmuhub. Los rangos de valor son referenciales y no sustituyen un avalúo profesional.</div>
</footer>
</body>
</html>`;
}

// ---------- Componentes ----------

function zoneOptions(zones, selected, { includeAll = true } = {}) {
  return html`${includeAll ? html`<option value="">Todas</option>` : ''}${zones.map(
    (z) => html`<option value="${z.slug}"${selected === z.slug ? raw(' selected') : ''}>${z.name}</option>`
  )}`;
}

function typeOptions(selected, { includeAll = true, only } = {}) {
  const types = only || ['casa', 'apartamento', 'terreno', 'finca', 'local', 'oficina'];
  return html`${includeAll ? html`<option value="">Todos</option>` : ''}${types.map(
    (t) => html`<option value="${t}"${selected === t ? raw(' selected') : ''}>${TYPE_LABELS[t]}</option>`
  )}`;
}

function specsLine(p) {
  const parts = [];
  if (['terreno', 'finca'].includes(p.type)) {
    if (p.area_land_v2) parts.push(`${formatNumber(p.area_land_v2)} v²`);
  } else {
    if (p.area_built_m2) parts.push(`${formatNumber(p.area_built_m2)} m²`);
    if (p.bedrooms) parts.push(`${formatNumber(p.bedrooms)} hab.`);
    if (p.bathrooms) parts.push(`${formatNumber(p.bathrooms, 1)} baños`);
    if (p.parking) parts.push(`${formatNumber(p.parking)} parqueos`);
  }
  return parts.join(' · ');
}

// "Carretera a El Salvador" + "Carretera a El Salvador km 16.5" -> solo el más específico.
function placeLabel(p) {
  const zone = p.zone_name || '';
  const loc = p.location_label || '';
  if (loc && zone && loc.toLowerCase().includes(zone.toLowerCase())) return loc;
  return [zone, loc].filter(Boolean).join(' · ') || p.municipality || '';
}

function positionTag(pos) {
  if (!pos) return '';
  return html`<span class="pos pos-${pos}"><span class="dot"></span>${POSITION_LABELS[pos]}</span>`;
}

export function propertyCard(p, pos) {
  const img = firstImage(p);
  return html`<article class="card">
  <a class="card-link" href="/propiedad/${p.slug}">
    <div class="card-media">
      ${img ? html`<img src="${img}" alt="${p.title}" loading="lazy">` : html`<div class="ph">Sin fotografía</div>`}
      <div class="badges">
        ${p.verified ? html`<span class="badge">${CHECK}Verificada</span>` : ''}
        ${p.tour_url ? html`<span class="badge badge-ink">Tour 360°</span>` : ''}
      </div>
    </div>
    <div class="card-body">
      <span class="eyebrow-sm">${placeLabel(p)}</span>
      <h3>${p.title}</h3>
      <span class="muted small">${specsLine(p)}</span>
      <div class="card-foot">
        <span class="price">${formatMoney(p.price_amount, p.currency)}</span>
        ${positionTag(pos)}
      </div>
    </div>
  </a>
</article>`;
}

function valueBar(range, ppu) {
  if (!range?.enough) return '';
  // Escala centrada en el rango P25–P75 para que un valor atípico no lo comprima.
  const pad = Math.max((range.high - range.low) * 0.75, range.median * 0.1);
  const lo = range.low - pad;
  const span = range.high + pad - lo;
  const pct = (v) => Math.max(2, Math.min(98, ((v - lo) / span) * 100));
  const left = pct(range.low);
  const width = pct(range.high) - left;
  const marker = ppu ? pct(ppu) : pct(range.median);
  return html`<div class="range">
  <div class="range-track"><div class="range-fill" style="left:${left.toFixed(1)}%;width:${width.toFixed(1)}%"></div><div class="range-marker" style="left:${marker.toFixed(1)}%"></div></div>
  <div class="range-labels"><span>Bajo el rango</span><span>Q ${formatNumber(range.low)} – ${formatNumber(range.high)}/${range.unit}</span><span>Sobre el rango</span></div>
</div>`;
}

function utmInputs(utm) {
  return html`<input type="hidden" name="utm_source" value="${utm.utm_source || ''}"><input type="hidden" name="utm_campaign" value="${utm.utm_campaign || ''}"><input type="hidden" name="utm_content" value="${utm.utm_content || ''}">`;
}

const HONEYPOT = raw('<div class="hp" aria-hidden="true"><label>No llenar<input type="text" name="empresa" tabindex="-1" autocomplete="off"></label></div>');

// ---------- Páginas ----------

export function homePage(env, { zones, featured, positions, heroImage }) {
  const featuredZones = zones.filter((z) => z.featured);
  const hero = heroImage || (featured[0] && firstImage(featured[0]));
  const body = html`
<section class="hero wrap">
  <div class="hero-copy">
    <div class="eyebrow">Portal inmobiliario curado · Guatemala</div>
    <h1 class="display">Propiedades con información, no solo con precio.</h1>
    <p class="lead">Cada propiedad se revisa antes de publicarse y muestra cómo se compara su precio con el valor de su zona. Menos ruido, mejores decisiones.</p>
    <form class="search" action="/propiedades" method="get">
      <label>Zona<select name="zona">${zoneOptions(zones, '')}</select></label>
      <label>Tipo<select name="tipo">${typeOptions('')}</select></label>
      <label>Operación<select name="op"><option value="venta">Venta</option><option value="renta">Renta</option></select></label>
      <button class="btn btn-primary" type="submit">Buscar</button>
    </form>
    <ul class="trust">
      <li>${CHECK}Propiedades revisadas</li>
      <li>${CHECK}Rango de valor por zona</li>
      <li>${CHECK}Atención de un asesor</li>
    </ul>
  </div>
  <div class="hero-media">
    ${hero ? html`<img src="${hero}" alt="Propiedad destacada en inmuhub">` : html`<div class="ph">inmuhub</div>`}
  </div>
</section>

<section class="ink">
  <div class="wrap zone-tool">
    <div>
      <div class="eyebrow eyebrow-light">Herramienta gratuita</div>
      <h2 class="display-md">¿Cuánto vale su zona?</h2>
      <p class="lead lead-light">Antes de comprar o vender, conozca el rango por metro cuadrado en su sector. Sin registrarse.</p>
    </div>
    <form class="zone-form" action="/valor" method="get">
      <label>Zona<select name="zona">${zoneOptions(zones, 'zona-15', { includeAll: false })}</select></label>
      <label>Tipo<select name="tipo">${typeOptions('casa', { includeAll: false, only: ['casa', 'apartamento', 'terreno'] })}</select></label>
      <button class="btn btn-brass" type="submit">Ver rango de valor</button>
      <div class="chips">${featuredZones.map((z) => html`<a class="chip" href="/valor?zona=${z.slug}&amp;tipo=casa">${z.name}</a>`)}</div>
    </form>
  </div>
</section>

<section class="wrap section">
  <div class="section-head">
    <div><div class="eyebrow">Selección curada</div><h2 class="display-md">Propiedades de la semana</h2></div>
    <a class="link-underline" href="/propiedades">Ver todas las propiedades</a>
  </div>
  <div class="cards">${featured.map((p) => propertyCard(p, positions.get(p.id)))}</div>
</section>

<section class="wrap section steps-section">
  <div class="section-head"><h2 class="display-md">Qué significa «Verificada»</h2><span class="tagline">No se trata de publicar por publicar.</span></div>
  <div class="steps">
    <div><span class="num">01</span><h3>Revisión antes de publicar</h3><p>Datos, fotos y precio se revisan antes de que la propiedad aparezca. Si algo no cuadra, no se publica.</p></div>
    <div><span class="num">02</span><h3>Lectura de valor en cada ficha</h3><p>Cada propiedad indica si su precio está por debajo, dentro o por encima del rango de su zona.</p></div>
    <div><span class="num">03</span><h3>Contacto directo y con contexto</h3><p>Su consulta llega al asesor o propietario con la propiedad ya identificada, sin intermediarios innecesarios.</p></div>
  </div>
</section>

<section class="wrap split">
  <div class="panel">
    <div class="eyebrow">Propietarios</div>
    <h3 class="display-sm">¿Vende o renta su propiedad?</h3>
    <p class="muted">Publíquela con una ficha que genera confianza desde el primer vistazo.</p>
    <ul class="checks"><li>${CHECK}Publicación revisada con lectura de valor</li><li>${CHECK}Opción de fotografía editada y tour 360°</li><li>${CHECK}Consultas directas a su WhatsApp</li></ul>
    <a class="btn btn-primary" href="/publicar">Publicar mi propiedad</a>
  </div>
  <div class="panel panel-ink">
    <div class="eyebrow eyebrow-light">Inmobiliarias y asesores</div>
    <h3 class="display-sm">Su inventario, presentado con criterio.</h3>
    <p class="lead-light">Un plan mensual con todo lo necesario para convertir consultas en visitas.</p>
    <ul class="checks checks-light"><li>${CHECK}Perfil verificado de su agencia</li><li>${CHECK}Panel de consultas por propiedad</li><li>${CHECK}Tours 360° y campañas en Meta como complemento</li></ul>
    <a class="btn btn-brass" href="/planes">Ver planes</a>
  </div>
</section>`;
  return layout(env, { path: '/', body, image: hero || null });
}

export function listingPage(env, { zones, filters, items, total, positions }) {
  const zoneName = zones.find((z) => z.slug === filters.zone)?.name;
  const heading = [filters.type ? TYPE_LABELS[filters.type] + 's' : 'Propiedades', zoneName ? `en ${zoneName}` : 'en Guatemala'].join(' ');
  const body = html`
<section class="wrap section">
  <div class="eyebrow">${total} ${total === 1 ? 'propiedad' : 'propiedades'}</div>
  <h1 class="display-md">${heading}</h1>
  <form class="search search-inline" action="/propiedades" method="get">
    <label>Zona<select name="zona">${zoneOptions(zones, filters.zone)}</select></label>
    <label>Tipo<select name="tipo">${typeOptions(filters.type)}</select></label>
    <label>Operación<select name="op"><option value="">Venta o renta</option><option value="venta"${filters.operation === 'venta' ? raw(' selected') : ''}>Venta</option><option value="renta"${filters.operation === 'renta' ? raw(' selected') : ''}>Renta</option></select></label>
    <button class="btn btn-primary" type="submit">Filtrar</button>
  </form>
  ${items.length
    ? html`<div class="cards">${items.map((p) => propertyCard(p, positions.get(p.id)))}</div>`
    : html`<div class="empty"><h2>Aún no hay propiedades con estos filtros.</h2><p class="muted">Pruebe otra zona o tipo, o déjenos su búsqueda y le avisamos por WhatsApp cuando llegue una opción que encaje.</p><a class="btn btn-primary" href="/valor${filters.zone ? `?zona=${encodeURIComponent(filters.zone)}` : ''}">Dejar mi búsqueda</a></div>`}
</section>`;
  const qs = new URLSearchParams(Object.entries({ zona: filters.zone, tipo: filters.type, op: filters.operation }).filter(([, v]) => v)).toString();
  return layout(env, { title: heading, path: '/propiedades' + (qs ? '?' + qs : ''), body });
}

export function propertyPage(env, { p, reading, utm, error }) {
  const wa = p.whatsapp_enabled !== 0;
  const images = parseJsonArray(p.images);
  const features = parseJsonArray(p.features);
  const isLand = ['terreno', 'finca'].includes(p.type);
  const specs = isLand
    ? [['Terreno', p.area_land_v2 && `${formatNumber(p.area_land_v2)} v²`], ['Tipo', TYPE_LABELS[p.type]], ['Operación', OPERATION_LABELS[p.operation]]]
    : [
        ['Construcción', p.area_built_m2 && `${formatNumber(p.area_built_m2)} m²`],
        ['Terreno', p.area_land_v2 && `${formatNumber(p.area_land_v2)} v²`],
        ['Niveles', p.levels],
        ['Habitaciones', p.bedrooms],
        ['Baños', p.bathrooms && formatNumber(p.bathrooms, 1)],
        ['Parqueos', p.parking],
      ];
  const shownSpecs = specs.filter(([, v]) => v);
  const place = placeLabel(p);
  const r = reading?.range;
  const readingBlock = r
    ? r.enough
      ? html`<section class="reading">
  <span class="eyebrow eyebrow-light">Lectura de valor</span>
  <h2>${reading.position ? `${POSITION_LABELS[reading.position].replace('de zona', 'de ' + p.zone_name)}` : `Rango de ${p.zone_name}`}</h2>
  ${valueBar(r, reading.ppu)}
  ${reading.ppu ? html`<p class="small light">Esta propiedad: Q ${formatNumber(reading.ppu)}/${r.unit}.</p>` : ''}
  <p class="small light">Referencia basada en ${r.count} propiedades comparables publicadas en inmuhub. No sustituye un avalúo profesional.</p>
</section>`
      : html`<section class="reading">
  <span class="eyebrow eyebrow-light">Lectura de valor</span>
  <h2>Aún reunimos comparables en ${p.zone_name}</h2>
  <p class="small light">Mostramos el rango de una zona cuando hay al menos ${env.MIN_COMPARABLES || 5} propiedades comparables. Hoy hay ${r.count}.</p>
</section>`
    : '';

  const body = html`
<article class="ficha">
  <div class="gallery" aria-label="Fotografías">
    ${images.length ? images.map((src, i) => html`<img src="${src}" alt="${p.title} — foto ${i + 1}" ${i ? raw('loading="lazy"') : ''}>`) : html`<div class="ph">Sin fotografía</div>`}
  </div>
  ${images.length > 1 ? html`<p class="wrap small muted gallery-hint">${images.length} fotografías · deslice para ver más</p>` : ''}
  <div class="wrap ficha-grid">
    <div class="ficha-main">
      <div class="badges-row">
        ${p.verified ? html`<span class="badge badge-line">${CHECK}Verificada</span>` : ''}
        <span class="badge badge-line">${OPERATION_LABELS[p.operation]}</span>
        ${p.tour_url ? html`<a class="badge badge-ink" href="${p.tour_url}" target="_blank" rel="noopener">${GLOBE}Recorrer en 360°</a>` : ''}
      </div>
      <span class="eyebrow-sm">${place}</span>
      <h1 class="display-sm">${p.title}</h1>
      <div class="price-row"><span class="price-lg">${formatMoney(p.price_amount, p.currency)}</span>${p.currency === 'USD' && p.price_gtq ? html`<span class="muted small">≈ Q ${formatNumber(p.price_gtq)}</span>` : ''}</div>
      ${shownSpecs.length ? html`<dl class="specs">${shownSpecs.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>` : ''}
      ${readingBlock}
      ${p.description ? html`<section class="block"><h2>Sobre la propiedad</h2><div class="prose">${p.description.split(/\n{2,}/).map((para) => html`<p>${para}</p>`)}</div></section>` : ''}
      ${features.length ? html`<section class="block"><h2>Características</h2><ul class="tags">${features.map((f) => html`<li>${f}</li>`)}</ul></section>` : ''}
      <section class="block"><h2>Ubicación</h2><p class="muted">${place}. La ubicación exacta se comparte al agendar la visita.</p></section>
    </div>
    <aside class="ficha-side">
      ${p.agency_name ? html`<div class="advisor"><div class="avatar">${(p.agent_name || p.agency_name).charAt(0)}</div><div><strong>${p.agent_name || p.agency_name}</strong><span class="small muted">${p.agent_name ? p.agency_name + ' · ' : ''}${p.agency_verified ? 'Perfil verificado' : 'Asesor'}</span></div></div>` : ''}
      <form class="form-card" method="post" action="/consulta" id="consulta" data-lead="1">
        <h2>¿Le interesa esta propiedad?</h2>
        ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
        <input type="hidden" name="propiedad" value="${p.slug}">
        <input type="hidden" name="tipo" value="propiedad">
        ${utmInputs(utm)}
        ${HONEYPOT}
        <label>Nombre<input type="text" name="nombre" autocomplete="name" maxlength="80" required></label>
        <label>${wa ? 'WhatsApp' : 'Teléfono'}<input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" placeholder="+502" maxlength="20" required></label>
        <fieldset class="seg"><legend>La busca para</legend>
          <label><input type="radio" name="intencion" value="vivir" checked><span>Vivir</span></label>
          <label><input type="radio" name="intencion" value="invertir"><span>Invertir</span></label>
        </fieldset>
        <button class="btn btn-primary btn-block" type="submit">${wa ? html`${WA_ICON}Continuar por WhatsApp` : 'Solicitar información'}</button>
        <p class="small muted">${wa ? 'Sus datos solo se comparten con el asesor de esta propiedad.' : 'Un asesor le contactará para darle información y coordinar una visita.'}</p>
      </form>
    </aside>
  </div>
  <div class="sticky-cta"><a class="btn btn-primary btn-block" href="#consulta">${wa ? html`${WA_ICON}Consultar por WhatsApp` : 'Solicitar información'}</a></div>
</article>`;
  return layout(env, {
    title: p.title,
    description: `${place} · ${formatMoney(p.price_amount, p.currency)}${specsLine(p) ? ' · ' + specsLine(p) : ''}`,
    image: images[0],
    path: `/propiedad/${p.slug}`,
    body,
    bodyClass: 'has-sticky',
  });
}

export function zoneValuePage(env, { zones, zone, type, value, utm, error }) {
  const typeLabel = { casa: 'Casas', apartamento: 'Apartamentos', terreno: 'Terrenos' }[type] || 'Casas';
  const result = !zone
    ? html`<p class="lead-light">Elija una zona para ver su rango.</p>`
    : value.enough
      ? html`<div class="result">
  <div class="result-head"><h2>${zone.name} · ${typeLabel}</h2></div>
  <span class="eyebrow eyebrow-light">Rango por ${value.unit === 'm²' ? 'm² de construcción' : 'vara² de terreno'}</span>
  <div class="result-figure">Q ${formatNumber(value.low)} – Q ${formatNumber(value.high)}</div>
  ${valueBar(value, null)}
  <dl class="result-stats"><div><dt>Propiedades analizadas</dt><dd>${value.count}</dd></div><div><dt>Rango de precio total</dt><dd>Q ${formatNumber(value.totalMin)} – ${formatNumber(value.totalMax)}</dd></div></dl>
  <p class="small light">Rango intercuartil (P25–P75) de la oferta publicada en inmuhub. Referencial: no sustituye un avalúo profesional.</p>
</div>`
      : html`<div class="result">
  <div class="result-head"><h2>${zone.name} · ${typeLabel}</h2></div>
  <p class="lead-light">Aún reunimos comparables en esta zona (hay ${value.count} de ${env.MIN_COMPARABLES || 5} necesarias para un rango confiable).</p>
  <p class="small light">Déjenos su WhatsApp y le enviamos un análisis hecho por un asesor.</p>
</div>`;

  const body = html`
<section class="ink">
  <div class="wrap zone-tool zone-page">
    <div>
      <div class="eyebrow eyebrow-light">Valor por zona</div>
      <h1 class="display-md">¿Cuánto vale su zona?</h1>
      <form class="zone-form" action="/valor" method="get">
        <label>Zona<select name="zona">${zoneOptions(zones, zone?.slug, { includeAll: false })}</select></label>
        <label>Tipo<select name="tipo">${typeOptions(type, { includeAll: false, only: ['casa', 'apartamento', 'terreno'] })}</select></label>
        <button class="btn btn-brass" type="submit">Actualizar</button>
      </form>
      ${result}
    </div>
    <form class="form-card" method="post" action="/consulta" data-lead="1">
      <h2>Reciba el análisis completo</h2>
      <p class="small muted">Un asesor le envía por WhatsApp el detalle de la zona: comparables, tendencia y recomendación.</p>
      ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
      <input type="hidden" name="tipo" value="valor_zona">
      <input type="hidden" name="zona" value="${zone?.slug || ''}">
      <input type="hidden" name="tipo_propiedad" value="${type}">
      ${utmInputs(utm)}
      ${HONEYPOT}
      <label>Nombre<input type="text" name="nombre" autocomplete="name" maxlength="80" required></label>
      <label>WhatsApp<input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" placeholder="+502" maxlength="20" required></label>
      <fieldset class="seg"><legend>Usted quiere</legend>
        <label><input type="radio" name="intencion" value="comprar" checked><span>Comprar</span></label>
        <label><input type="radio" name="intencion" value="vender"><span>Vender</span></label>
      </fieldset>
      <button class="btn btn-primary btn-block" type="submit">${WA_ICON}Recibir por WhatsApp</button>
    </form>
  </div>
</section>`;
  return layout(env, {
    title: zone ? `Valor por m² en ${zone.name}` : 'Valor por zona',
    description: zone ? `Rango de valor por m² de ${typeLabel.toLowerCase()} en ${zone.name}, calculado con propiedades publicadas.` : undefined,
    path: '/valor' + (zone ? `?zona=${zone.slug}&tipo=${type}` : ''),
    body,
  });
}

const PLANS = [
  { id: 'asesor', name: 'Asesor', who: 'Para asesores independientes.', price: 'Q350', items: ['Hasta 10 propiedades activas', 'Perfil verificado', 'Lectura de valor en cada ficha', 'Consultas directas a su WhatsApp'] },
  { id: 'agencia', name: 'Agencia', who: 'Para inmobiliarias con equipo.', price: 'Q950', featured: true, items: ['Hasta 50 propiedades activas', 'Hasta 5 asesores con perfil propio', 'Panel de consultas por propiedad y asesor', '2 propiedades destacadas al mes', 'Página de agencia con su marca'] },
  { id: 'agencia_pro', name: 'Agencia Pro', who: 'Para desarrolladoras e inventarios grandes.', price: 'Q2,200', items: ['Propiedades y asesores ilimitados', 'Todo lo del plan Agencia', '1 tour 360° incluido al mes', '5 propiedades destacadas al mes', 'Reporte mensual de consultas'] },
];

export function plansPage(env, { utm, error, selected }) {
  const body = html`
<section class="wrap section center">
  <div class="eyebrow">Planes para inmobiliarias y asesores</div>
  <h1 class="display">Su inventario, presentado con criterio.</h1>
  <p class="lead">Una tarifa mensual fija. Sin comisión sobre la operación. Sin permanencia.</p>
</section>
<section class="wrap plans">
  ${PLANS.map((pl) => html`<article class="plan${pl.featured ? ' plan-featured' : ''}">
    ${pl.featured ? html`<span class="plan-flag">Recomendado</span>` : ''}
    <h2>${pl.name}</h2><p class="${pl.featured ? 'light' : 'muted'}">${pl.who}</p>
    <div class="plan-price"><span>${pl.price}</span>/mes</div>
    <ul class="checks${pl.featured ? ' checks-light' : ''}">${pl.items.map((it) => html`<li>${CHECK}${it}</li>`)}</ul>
    <a class="btn ${pl.featured ? 'btn-brass' : 'btn-outline'} btn-block" href="/planes?plan=${pl.id}#contacto">Elegir ${pl.name}</a>
  </article>`)}
</section>
<section class="wrap section">
  <div class="section-head"><div><div class="eyebrow">Complementos</div><h2 class="display-md">Producción y pauta, cuando las necesite</h2></div></div>
  <div class="addons">
    <div class="panel"><h3>Propiedad destacada</h3><p class="muted">Primera posición en su zona y en la home durante 7 días.</p><strong class="addon-price">Q150</strong></div>
    <div class="panel"><h3>Tour 360°</h3><p class="muted">Recorrido virtual integrado en la ficha. Paquetes Básico, Pro y Premium.</p><strong class="addon-price">Consultar</strong></div>
    <div class="panel"><h3>Fotografía y reel</h3><p class="muted">Fotos editadas y un reel vertical listo para redes y anuncios.</p><strong class="addon-price">Consultar</strong></div>
    <div class="panel"><h3>Campaña en Meta</h3><p class="muted">Estrategia, creativos y gestión de pauta en Facebook e Instagram.</p><strong class="addon-price">Q1,500/mes + inversión</strong></div>
  </div>
</section>
<section class="wrap section" id="contacto">
  <div class="split">
    <div>
      <h2 class="display-md">Hablemos de su inventario</h2>
      <p class="lead">Déjenos su WhatsApp y le escribimos para activar su plan. Los primeros socios fundadores publican sin costo durante 3 meses.</p>
      <div class="faq">
        <h3>¿Cobran comisión sobre la venta o renta?</h3><p class="muted">No. inmuhub cobra solo el plan o servicio que usted elija.</p>
        <h3>¿Hay permanencia mínima?</h3><p class="muted">No. Los planes mensuales se cancelan cuando lo necesite.</p>
        <h3>¿Qué pasa si una propiedad no aprueba la revisión?</h3><p class="muted">Le indicamos qué corregir y se publica en cuanto queda lista.</p>
      </div>
    </div>
    <form class="form-card" method="post" action="/consulta" data-lead="1">
      <h2>Quiero información</h2>
      ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
      <input type="hidden" name="tipo" value="plan">
      ${utmInputs(utm)}
      ${HONEYPOT}
      <label>Nombre<input type="text" name="nombre" autocomplete="name" maxlength="80" required></label>
      <label>Inmobiliaria<input type="text" name="mensaje" maxlength="120" placeholder="Nombre de su agencia (opcional)"></label>
      <label>WhatsApp<input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" placeholder="+502" maxlength="20" required></label>
      <label>Plan<select name="intencion">${PLANS.map((pl) => html`<option value="${pl.id}"${selected === pl.id ? raw(' selected') : ''}>${pl.name} · ${pl.price}/mes</option>`)}</select></label>
      <button class="btn btn-primary btn-block" type="submit">${WA_ICON}Continuar por WhatsApp</button>
    </form>
  </div>
</section>`;
  return layout(env, { title: 'Planes para inmobiliarias', path: '/planes', body });
}

export function publishPage(env, { zones, values = {}, error }) {
  const v = (k) => values[k] ?? '';
  const body = html`
<section class="wrap section narrow">
  <div class="eyebrow">Propietarios</div>
  <h1 class="display-md">Publique su propiedad con análisis de valor</h1>
  <p class="lead">Complete los datos básicos. Revisamos la información y le escribimos por WhatsApp para recibir fotografías y confirmar la publicación.</p>
  <ol class="mini-steps"><li><strong>1.</strong> Datos de la propiedad</li><li><strong>2.</strong> Revisión y lectura de valor</li><li><strong>3.</strong> Publicación y consultas a su WhatsApp</li></ol>
  <form class="form-card form-wide" method="post" action="/publicar" data-lead="1">
    ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
    ${HONEYPOT}
    <fieldset><legend>La propiedad</legend>
      <div class="grid-2">
        <label>Tipo<select name="tipo" required>${typeOptions(v('tipo') || 'casa', { includeAll: false })}</select></label>
        <label>Operación<select name="operacion"><option value="venta">Venta</option><option value="renta"${v('operacion') === 'renta' ? raw(' selected') : ''}>Renta</option></select></label>
        <label>Zona<select name="zona" required>${zoneOptions(zones, v('zona'), { includeAll: false })}</select></label>
        <label>Colonia o condominio<input type="text" name="ubicacion" maxlength="120" value="${v('ubicacion')}" placeholder="Ej. Vista Hermosa III"></label>
        <label>Precio<input type="text" name="precio" inputmode="numeric" maxlength="20" value="${v('precio')}" required placeholder="Ej. 2,450,000"></label>
        <label>Moneda<select name="moneda"><option value="GTQ">Quetzales</option><option value="USD"${v('moneda') === 'USD' ? raw(' selected') : ''}>Dólares</option></select></label>
        <label>Construcción (m²)<input type="text" name="area_m2" inputmode="decimal" maxlength="10" value="${v('area_m2')}"></label>
        <label>Terreno (v²)<input type="text" name="terreno_v2" inputmode="decimal" maxlength="10" value="${v('terreno_v2')}"></label>
        <label>Habitaciones<input type="number" name="habitaciones" min="0" max="30" value="${v('habitaciones')}"></label>
        <label>Baños<input type="number" name="banos" min="0" max="30" step="0.5" value="${v('banos')}"></label>
      </div>
      <label>Descripción breve<textarea name="descripcion" rows="4" maxlength="2000" placeholder="Luz natural, distribución, entorno. Sin superlativos.">${v('descripcion')}</textarea></label>
    </fieldset>
    <fieldset><legend>Sus datos (no se publican)</legend>
      <div class="grid-2">
        <label>Nombre<input type="text" name="nombre" autocomplete="name" maxlength="80" value="${v('nombre')}" required></label>
        <label>WhatsApp<input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" placeholder="+502" maxlength="20" value="${v('whatsapp')}" required></label>
      </div>
      <label>Correo (opcional)<input type="email" name="correo" autocomplete="email" maxlength="120" value="${v('correo')}"></label>
    </fieldset>
    <button class="btn btn-primary btn-block" type="submit">Enviar a revisión</button>
    <p class="small muted">Publicación básica sin costo. Le indicaremos las opciones Verificado y Premium si le interesan.</p>
  </form>
</section>`;
  return layout(env, { title: 'Publicar propiedad', path: '/publicar', body });
}

export function publishThanksPage(env, { ref, waUrl }) {
  const body = html`
<section class="wrap section narrow center">
  <div class="eyebrow">Recibido · Referencia ${ref}</div>
  <h1 class="display-md">Su propiedad está en revisión.</h1>
  <p class="lead">El siguiente paso es enviarnos las fotografías por WhatsApp. Con eso completamos la revisión y la lectura de valor.</p>
  <a class="btn btn-primary" href="${waUrl}">${WA_ICON}Enviar fotografías por WhatsApp</a>
</section>`;
  return layout(env, { title: 'Propiedad en revisión', path: '/publicar', body, noindex: true });
}

export function notFoundPage(env) {
  const body = html`<section class="wrap section narrow center"><div class="eyebrow">404</div><h1 class="display-md">Esta página no está disponible.</h1><p class="lead">La propiedad pudo haberse vendido o pausado.</p><a class="btn btn-primary" href="/propiedades">Ver propiedades publicadas</a></section>`;
  return layout(env, { title: 'Página no encontrada', body, noindex: true });
}

// ---------- Admin ----------

export function adminLoginPage(env, { error }) {
  const body = html`<section class="wrap section narrow"><h1 class="display-sm">Administración</h1>
  <form class="form-card" method="post" action="/admin/login">${error ? html`<p class="form-error">${error}</p>` : ''}
  <label>Clave de acceso<input type="password" name="token" autocomplete="current-password" required></label>
  <button class="btn btn-primary btn-block" type="submit">Entrar</button></form></section>`;
  return layout(env, { title: 'Administración', body, noindex: true });
}

const STATUS_LABEL = { revision: 'En revisión', publicada: 'Publicada', rechazada: 'Rechazada', pausada: 'Pausada', vendida: 'Vendida' };

export function adminPage(env, { counts, props, leads, zones, filter }) {
  const waLink = (n) => (n ? `https://wa.me/${n}` : null);
  const body = html`
<section class="wrap section admin">
  <div class="section-head"><h1 class="display-sm">Panel inmuhub</h1><form method="post" action="/admin/logout"><button class="btn btn-outline btn-sm" type="submit">Salir</button></form></div>
  <div class="kpis">
    <div><span>En revisión</span><strong>${counts.pendientes}</strong></div>
    <div><span>Publicadas</span><strong>${counts.publicadas}</strong></div>
    <div><span>Consultas 7 días</span><strong>${counts.leads_7d}</strong></div>
    <div><span>Consultas totales</span><strong>${counts.leads_total}</strong></div>
  </div>

  <div class="section-head"><h2>Propiedades</h2><form method="post" action="/admin/nueva"><button class="btn btn-primary btn-sm" type="submit">Nueva propiedad</button></form></div>
  <nav class="tabs">${[['', 'Todas'], ['revision', 'En revisión'], ['publicada', 'Publicadas'], ['pausada', 'Pausadas'], ['rechazada', 'Rechazadas']].map(
    ([k, l]) => html`<a href="/admin${k ? '?estado=' + k : ''}"${filter === k ? raw(' aria-current="page"') : ''}>${l}</a>`
  )}</nav>
  <div class="table-wrap"><table>
    <thead><tr><th>Propiedad</th><th>Zona</th><th>Precio</th><th>Área</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>${props.map((p) => html`<tr>
      <td><strong>${p.title}</strong><br><span class="small muted">${p.slug}${p.owner_name ? html` · Propietario: ${p.owner_name} ${waLink(p.owner_whatsapp) ? html`<a href="${waLink(p.owner_whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>` : ''}` : ''}</span></td>
      <td>${p.zone_name || html`<em class="muted">sin zona</em>`}</td>
      <td>${formatMoney(p.price_amount, p.currency)}</td>
      <td>${p.area_built_m2 ? `${formatNumber(p.area_built_m2)} m²` : p.area_land_v2 ? `${formatNumber(p.area_land_v2)} v²` : '—'}</td>
      <td><span class="status status-${p.status}">${STATUS_LABEL[p.status]}</span>${p.verified ? html` <span class="status status-publicada">Verificada</span>` : ''}${!p.images || p.images === '[]' ? html` <span class="status status-revision">Sin fotos</span>` : ''}${p.whatsapp_enabled === 0 ? html` <span class="status">Sin WhatsApp</span>` : ''}</td>
      <td><form class="row-actions" method="post" action="/admin/propiedad/${p.id}">
        <a class="btn btn-primary btn-xs" href="/admin/propiedad/${p.id}/editar">Editar</a>
        ${p.status === 'revision'
          ? html`<select name="zona" aria-label="Zona">${zoneOptions(zones, p.zone_slug, { includeAll: false })}</select>
            <button name="accion" value="publicar" class="btn btn-primary btn-xs">Aprobar</button>
            <input type="text" name="nota" placeholder="Motivo" aria-label="Motivo de rechazo" maxlength="200">
            <button name="accion" value="rechazar" class="btn btn-outline btn-xs">Rechazar</button>`
          : html`${p.status === 'publicada'
              ? html`<a class="btn btn-outline btn-xs" href="/propiedad/${p.slug}" target="_blank">Ver</a>
                <button name="accion" value="verificar" class="btn btn-outline btn-xs">${p.verified ? 'Quitar sello' : 'Verificar'}</button>
                <button name="accion" value="destacar" class="btn btn-outline btn-xs">Destacar 7 días</button>
                <button name="accion" value="pausar" class="btn btn-outline btn-xs">Pausar</button>`
              : html`<button name="accion" value="publicar" class="btn btn-outline btn-xs">Publicar</button>`}`}
      </form></td>
    </tr>`)}</tbody>
  </table></div>

  <h2>Consultas recientes</h2>
  <div class="table-wrap"><table>
    <thead><tr><th>Fecha</th><th>Tipo</th><th>Nombre</th><th>WhatsApp</th><th>Detalle</th><th>Origen</th></tr></thead>
    <tbody>${leads.map((l) => html`<tr>
      <td class="small">${l.created_at}</td>
      <td>${l.kind}</td>
      <td>${l.name || '—'}</td>
      <td><a href="https://wa.me/${l.whatsapp}" target="_blank" rel="noopener">${l.whatsapp}</a></td>
      <td class="small">${l.property_title ? html`<a href="/propiedad/${l.property_slug}" target="_blank">${l.property_title}</a>` : l.zone_slug || ''} ${l.intent ? `· ${l.intent}` : ''} ${l.message ? `· ${l.message}` : ''}</td>
      <td class="small muted">${[l.utm_source, l.utm_campaign, l.utm_content].filter(Boolean).join(' / ') || 'directo'}</td>
    </tr>`)}</tbody>
  </table></div>
</section>`;
  return layout(env, { title: 'Administración', body, noindex: true });
}

// ---------- Solicitud recibida (propiedades sin WhatsApp) ----------

export function requestReceivedPage(env, { p }) {
  const body = html`
<section class="wrap section narrow center">
  <div class="eyebrow">Solicitud recibida</div>
  <h1 class="display-md">Gracias. Un asesor le contactará pronto.</h1>
  <p class="lead">${p ? html`Recibimos su interés en <strong>${p.title}</strong>. ` : ''}Le escribiremos para compartirle información y coordinar una visita.</p>
  <div class="row-actions">
    ${p ? html`<a class="btn btn-outline" href="/propiedad/${p.slug}">Volver a la propiedad</a>` : ''}
    <a class="btn btn-primary" href="/propiedades">Ver más propiedades</a>
  </div>
</section>`;
  return layout(env, { title: 'Solicitud recibida', body, noindex: true });
}

// ---------- Admin: editar propiedad ----------

export function adminEditPage(env, { p, zones, heroImage, notice, error }) {
  const images = parseJsonArray(p.images);
  const features = parseJsonArray(p.features);
  const v = (k) => p[k] ?? '';
  const opt = (value, label, current) => html`<option value="${value}"${String(current) === String(value) ? raw(' selected') : ''}>${label}</option>`;
  const photoAction = (i, accion, label, cls = 'btn-outline') =>
    html`<button class="btn ${cls} btn-xs" name="accion" value="${accion}">${label}</button>`;
  const body = html`
<section class="wrap section admin">
  <div class="section-head">
    <div>
      <a class="small" href="/admin">← Volver al panel</a>
      <h1 class="display-sm">${p.title}</h1>
      <span class="small muted">${p.slug} · ${STATUS_LABEL[p.status]}${p.status === 'publicada' ? html` · <a href="/propiedad/${p.slug}" target="_blank" rel="noopener">Ver ficha</a>` : ''}</span>
    </div>
  </div>
  ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}
  ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}

  <form class="form-card form-wide" method="post" action="/admin/propiedad/${p.id}/guardar">
    <fieldset><legend>Datos principales</legend>
      <label>Título<input type="text" name="title" maxlength="140" value="${v('title')}" required></label>
      <div class="grid-2">
        <label>Tipo<select name="type">${Object.entries(TYPE_LABELS).map(([k, l]) => opt(k, l, p.type))}</select></label>
        <label>Operación<select name="operation">${Object.entries(OPERATION_LABELS).map(([k, l]) => opt(k, l, p.operation))}</select></label>
        <label>Zona<select name="zone_slug">${opt('', 'Sin zona', p.zone_slug || '')}${zones.map((z) => opt(z.slug, z.name, p.zone_slug))}</select></label>
        <label>Colonia, condominio o km<input type="text" name="location_label" maxlength="140" value="${v('location_label')}"></label>
        <label>Precio<input type="text" name="price_amount" inputmode="decimal" maxlength="20" value="${p.price_amount ? formatNumber(p.price_amount) : ''}"></label>
        <label>Moneda<select name="currency">${opt('GTQ', 'Quetzales', p.currency)}${opt('USD', 'Dólares', p.currency)}</select></label>
      </div>
    </fieldset>
    <fieldset><legend>Medidas y distribución</legend>
      <div class="grid-2">
        <label>Construcción (m²)<input type="text" name="area_built_m2" inputmode="decimal" maxlength="12" value="${v('area_built_m2')}"></label>
        <label>Terreno (v²)<input type="text" name="area_land_v2" inputmode="decimal" maxlength="12" value="${v('area_land_v2')}"></label>
        <label>Habitaciones<input type="number" name="bedrooms" min="0" max="50" value="${v('bedrooms')}"></label>
        <label>Baños<input type="number" name="bathrooms" min="0" max="50" step="0.5" value="${v('bathrooms')}"></label>
        <label>Parqueos<input type="number" name="parking" min="0" max="50" value="${v('parking')}"></label>
        <label>Niveles<input type="number" name="levels" min="0" max="50" value="${v('levels')}"></label>
      </div>
      <p class="small muted">El área de construcción (o de terreno, en terrenos y fincas) define la lectura de valor por zona.</p>
    </fieldset>
    <fieldset><legend>Contenido</legend>
      <label>Descripción<textarea name="description" rows="8" maxlength="6000">${v('description')}</textarea></label>
      <label>Características (separadas por coma)<input type="text" name="features" maxlength="1500" value="${features.join(', ')}"></label>
      <label>Enlace del tour 360°<input type="url" name="tour_url" maxlength="500" value="${v('tour_url')}" placeholder="https://"></label>
    </fieldset>
    <fieldset><legend>Contacto y confianza</legend>
      <label class="check"><input type="checkbox" name="whatsapp_enabled" value="1"${p.whatsapp_enabled ? raw(' checked') : ''}><span>Mostrar WhatsApp en la ficha (si se desactiva, las consultas solo se guardan en el panel)</span></label>
      <label class="check"><input type="checkbox" name="verified" value="1"${p.verified ? raw(' checked') : ''}><span>Sello «Verificada» (documentación revisada)</span></label>
    </fieldset>
    <button class="btn btn-primary" type="submit">Guardar cambios</button>
  </form>

  <h2>Fotografías</h2>
  <p class="small muted">La primera foto es la principal de la ficha. «Portada del sitio» la muestra en la home de inmuhub.com.</p>
  ${images.length
    ? html`<div class="photo-grid">${images.map((src, i) => html`<figure class="photo${src === heroImage ? ' is-hero' : ''}">
      <img src="${src}" alt="Foto ${i + 1}" loading="lazy">
      <figcaption>
        <span class="small">${i === 0 ? 'Principal' : `Foto ${i + 1}`}${src === heroImage ? ' · Portada del sitio' : ''}</span>
        <form class="row-actions" method="post" action="/admin/propiedad/${p.id}/foto">
          <input type="hidden" name="i" value="${i}">
          ${i > 0 ? photoAction(i, 'principal', 'Hacer principal') : ''}
          ${i > 0 ? photoAction(i, 'subir', '↑') : ''}
          ${i < images.length - 1 ? photoAction(i, 'bajar', '↓') : ''}
          ${src === heroImage ? '' : photoAction(i, 'portada', 'Portada del sitio')}
          ${photoAction(i, 'quitar', 'Quitar')}
        </form>
      </figcaption>
    </figure>`)}</div>`
    : html`<p class="muted">Esta propiedad aún no tiene fotografías.</p>`}

  <form class="form-card" id="upload" method="post" action="/admin/propiedad/${p.id}/fotos" enctype="multipart/form-data">
    <label>Agregar fotografías (JPG, PNG o WebP)<input type="file" name="fotos" accept="image/jpeg,image/png,image/webp" multiple required></label>
    <button class="btn btn-primary" type="submit">Subir fotografías</button>
    <p class="small muted" id="upmsg">Se optimizan automáticamente (máx. 1920 px) antes de subirlas.</p>
  </form>
  <script>
  (function () {
    var form = document.getElementById('upload');
    var msg = document.getElementById('upmsg');
    function shrink(file) {
      if (!window.createImageBitmap) return Promise.resolve(file);
      return createImageBitmap(file).then(function (bmp) {
        var s = Math.min(1, 1920 / Math.max(bmp.width, bmp.height));
        var c = document.createElement('canvas');
        c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
        c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
        return new Promise(function (res) { c.toBlob(function (b) { res(b || file); }, 'image/webp', 0.82); });
      }).catch(function () { return file; });
    }
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var files = Array.prototype.slice.call(form.fotos.files);
      var fd = new FormData();
      for (var i = 0; i < files.length; i++) {
        msg.textContent = 'Optimizando ' + (i + 1) + ' de ' + files.length + '…';
        fd.append('fotos', await shrink(files[i]), files[i].name.replace(/\\.[^.]+$/, '') + '.webp');
      }
      msg.textContent = 'Subiendo…';
      var r = await fetch(form.action, { method: 'POST', body: fd, credentials: 'same-origin' });
      if (r.ok) { location.href = r.url; } else { msg.textContent = 'No se pudo subir: ' + (await r.text()).slice(0, 200); }
    });
  })();
  </script>
</section>`;
  return layout(env, { title: `Editar · ${p.title}`, body, noindex: true });
}
