import {
  html, raw, escape, formatMoney, formatNumber, TYPE_LABELS, OPERATION_LABELS, POSITION_LABELS, firstImage, parseJsonArray,
} from './html.js';

export const CHECK = raw('<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>');
export const WA_ICON = raw('<svg class="i" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.5A8.4 8.4 0 1 1 21 11.5z"/></svg>');
export const GLOBE = raw('<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18"/></svg>');

// Cambia en cada publicación para que los navegadores no usen estilos ni scripts viejos.
export const ASSET_VERSION = '2026-10-06b';

// ---------- Layout ----------

export function layout(env, { title, description, image, path = '/', body, noindex = false, bodyClass = '', scripts = [] }) {
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
<link rel="stylesheet" href="/portal.css?v=${ASSET_VERSION}">
${pixel}
</head>
<body class="${bodyClass}">
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="/">inmuhub <span>Guatemala</span></a>
    <nav class="main-nav" aria-label="Principal">
      <a href="/propiedades">Propiedades</a>
      <a href="/proyectos">Proyectos nuevos</a>
      <a href="/servicios">Servicios</a>
      <a href="/valor">Valor por zona</a>
      <a href="/inmuhub">Qué es inmuhub</a>
    </nav>
    <div class="header-actions">
      <a class="header-login" href="/ingresar">Ingresar</a>
      <a class="btn btn-primary btn-sm" href="/publicar"><span class="only-desktop">Publicar propiedad</span><span class="only-mobile">Publicar</span></a>
      <details class="menu">
        <summary aria-label="Abrir menú"><span class="burger" aria-hidden="true"><i></i><i></i><i></i></span></summary>
        <nav class="menu-panel" aria-label="Menú">
          <a href="/propiedades">Propiedades</a>
          <a href="/proyectos">Proyectos nuevos</a>
          <a href="/comparar">Comparar proyectos</a>
          <a href="/valor">Valor por zona</a>
          <a href="/servicios">Servicios</a>
          <a href="/inmuhub">Qué es inmuhub</a>
          <span class="menu-sep"></span>
          <a href="/publicar">Propietarios</a>
          <a href="/planes">Inmobiliarias</a>
          <a href="/desarrolladoras">Desarrolladoras</a>
          <span class="menu-sep"></span>
          <a href="/ingresar">Ingresar</a>
          <a href="/registro">Crear cuenta</a>
        </nav>
      </details>
    </div>
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
      <div><strong>inmuhub</strong><a href="/inmuhub">Qué es inmuhub</a><a href="/servicios">Servicios</a><a href="/mercado">Datos de mercado</a></div>
      <div><strong>Explorar</strong><a href="/propiedades">Propiedades</a><a href="/proyectos">Proyectos nuevos</a><a href="/comparar">Comparar proyectos</a><a href="/valor">Valor por zona</a></div>
      <div><strong>Publicar</strong><a href="/publicar">Propietarios</a><a href="/planes">Inmobiliarias</a><a href="/desarrolladoras">Desarrolladoras</a></div>
      <div><strong>Mi cuenta</strong><a href="/ingresar">Ingresar</a><a href="/registro?tipo=comprador">Cuenta de comprador</a><a href="/registro?tipo=propietario">Cuenta de propietario</a><a href="/registro?tipo=asesor">Cuenta de asesor</a></div>
      <div><strong>Legal</strong><a href="/privacidad">Aviso de privacidad</a></div>
    </div>
  </div>
  <div class="wrap footer-legal muted">© ${new Date().getFullYear()} inmuhub. Los rangos de valor son referenciales y no sustituyen un avalúo profesional.</div>
</footer>
${scripts.map((src) => html`<script src="${src}?v=${ASSET_VERSION}" defer></script>`)}
</body>
</html>`;
}

// ---------- Componentes ----------

export function zoneOptions(zones, selected, { includeAll = true } = {}) {
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
export function placeLabel(p) {
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

export function valueBar(range, ppu) {
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

export function utmInputs(utm) {
  return html`<input type="hidden" name="utm_source" value="${utm.utm_source || ''}"><input type="hidden" name="utm_campaign" value="${utm.utm_campaign || ''}"><input type="hidden" name="utm_content" value="${utm.utm_content || ''}">`;
}

export const PRIVACY_NOTE = raw('<p class="small muted form-legal">Al enviar acepta el <a href="/privacidad">aviso de privacidad</a>.</p>');
export const HONEYPOT = raw('<div class="hp" aria-hidden="true"><label>No llenar<input type="text" name="empresa" tabindex="-1" autocomplete="off"></label></div>');

// Descripción con formato simple: párrafos, «## Título» para secciones y «- punto» para listas.
// Los párrafos antes de la primera sección son la presentación; las secciones van en rejilla.
export function renderDescription(text) {
  const blocks = String(text || '').replace(/\r/g, '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const intro = [];
  const sections = [];
  let current = null;
  for (const b of blocks) {
    const lines = b.split('\n');
    if (lines[0].startsWith('## ')) {
      current = { title: lines[0].slice(3).trim(), items: [] };
      sections.push(current);
      lines.shift();
      if (!lines.length) continue;
    }
    const bullets = lines.filter((l) => l.startsWith('- '));
    const node = bullets.length === lines.length && bullets.length
      ? { list: bullets.map((l) => l.slice(2).trim()) }
      : { text: lines.join(' ') };
    (current ? current.items : intro).push(node);
  }
  const renderItems = (items) =>
    items.map((it) => (it.list ? html`<ul class="desc-list">${it.list.map((li) => html`<li>${li}</li>`)}</ul>` : html`<p>${it.text}</p>`));
  return html`<div class="desc">
  ${intro.length ? html`<div class="desc-intro">${renderItems(intro)}</div>` : ''}
  ${sections.length ? html`<div class="desc-sections">${sections.map((sec) => html`<div class="desc-section"><h3>${sec.title}</h3>${renderItems(sec.items)}</div>`)}</div>` : ''}
</div>`;
}

// ---------- Páginas ----------

export function homePage(env, { zones, heroImage, stats = {}, servicesSection = '' }) {
  const featuredZones = zones.filter((z) => z.featured);
  const hero = heroImage || '/portada.webp';
  const illustrative = hero === '/portada.webp';
  const body = html`
<section class="hero wrap">
  <div class="hero-copy">
    <div class="eyebrow">Portal inmobiliario · Guatemala</div>
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
    <img src="${hero}" alt="${illustrative ? 'Residencia contemporánea al atardecer con vista a un volcán' : 'Propiedad destacada en inmuhub'}" fetchpriority="high">
    ${illustrative ? html`<span class="hero-note">Imagen ilustrativa</span>` : ''}
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

<section class="wrap section" id="como-funciona">
  <div class="section-head">
    <div><div class="eyebrow">Cómo funciona</div><h2 class="display-md">Un portal para cada parte de la operación</h2></div>
  </div>
  <p class="lead">inmuhub reúne propiedades revisadas, datos de valor por zona y una red de asesores en Guatemala. Así funciona según lo que usted busque:</p>
  <div class="how">
    <article class="how-card">
      <div class="eyebrow">Compradores</div>
      <h3>Compare antes de visitar</h3>
      <p>Cada ficha indica si el precio está por debajo, dentro o por encima del rango de su zona.</p>
      <ul class="checks"><li>${CHECK}Propiedades revisadas antes de publicarse</li><li>${CHECK}Rango de precio por m² en cada zona</li><li>${CHECK}Consulta directa, con la propiedad identificada</li></ul>
      <a class="btn btn-outline btn-sm" href="/servicios/busqueda-asistida">Conocer la búsqueda asistida</a>
    </article>
    <article class="how-card">
      <div class="eyebrow">Propietarios</div>
      <h3>Publique con análisis de valor</h3>
      <p>Cree su cuenta, envíe su propiedad y siga su revisión y las consultas desde su panel.</p>
      <ul class="checks"><li>${CHECK}Publicación básica sin costo</li><li>${CHECK}Lectura de valor de su zona</li><li>${CHECK}Fotografía editada y tour 360° opcionales</li></ul>
      <a class="btn btn-primary btn-sm" href="/servicios/publicacion-de-propiedades">Conocer el servicio</a>
    </article>
    <article class="how-card">
      <div class="eyebrow">Asesores e inmobiliarias</div>
      <h3>Su inventario, con criterio</h3>
      <p>Publique el inventario de sus clientes y comparta fichas con colegas desde la red de asesores.</p>
      <ul class="checks"><li>${CHECK}Panel con estado y consultas por propiedad</li><li>${CHECK}Enlaces para colegas en red.inmuhub.com</li><li>${CHECK}Planes mensuales para agencias</li></ul>
      <a class="btn btn-primary btn-sm" href="/servicios/planes-para-inmobiliarias">Conocer el servicio</a>
    </article>
    <article class="how-card">
      <div class="eyebrow">Desarrolladoras</div>
      <h3>Proyectos nuevos, comparables</h3>
      <p>Presente su proyecto junto a otros de la zona, con precio por m² y reporte mensual de interés.</p>
      <ul class="checks"><li>${CHECK}Ficha de proyecto y tipologías</li><li>${CHECK}Comparador de proyectos</li><li>${CHECK}Reporte mensual de visitas y consultas</li></ul>
      <a class="btn btn-outline btn-sm" href="/servicios/proyectos-para-desarrolladoras">Conocer el servicio</a>
    </article>
  </div>
</section>

<section class="ink">
  <div class="wrap section">
    <div><div class="eyebrow eyebrow-light">Información, no solo precio</div><h2 class="display-md">Datos que respaldan cada decisión</h2></div>
    <div class="pillars">
      <div class="pillar"><strong>Precio por m² por zona</strong><span class="lead-light">Mediana y rango de Zona 10, 14, 15, 16, Cayalá, Fraijanes y Carretera a El Salvador, con anuncios reales y actualización mensual.</span><a href="/mercado">Ver datos de mercado</a></div>
      <div class="pillar"><strong>Valor de su zona</strong><span class="lead-light">Consulte el rango de su sector antes de comprar, vender o fijar un precio. Sin registrarse.</span><a href="/valor">Consultar valor por zona</a></div>
      <div class="pillar"><strong>Herramientas</strong><span class="lead-light">Calculadora hipotecaria, valuador y guía de compra para preparar cada paso de la operación.</span><a href="/calculadora-hipotecaria">Calcular mi cuota</a></div>
    </div>
  </div>
</section>

<section class="wrap section">
  <div class="see-more">
    <div>
      <div class="eyebrow">Inventario completo</div>
      <h2 class="display-md">Propiedades revisadas, con lectura de valor en cada una.</h2>
      <p class="lead">El inventario completo está disponible para usuarios registrados: casas, apartamentos, terrenos y fincas, cada uno comparado con el rango de precio de su zona.</p>
      <div class="row-actions"><a class="btn btn-primary" href="/propiedades">Ver más propiedades</a><a class="btn btn-outline" href="/registro?tipo=comprador&amp;next=%2Fpropiedades">Crear cuenta gratuita</a></div>
    </div>
    <div class="see-more-stats">
      ${[[stats.properties, 'propiedades revisadas'], [stats.zones, 'zonas con lectura de valor'], [stats.projects, 'proyectos nuevos']]
        .filter(([v]) => v > 0)
        .map(([v, l]) => html`<div><strong>${v}</strong><span>${l}</span></div>`)}
    </div>
  </div>
</section>

<section class="wrap section">
  <div class="section-head"><div><div class="eyebrow">Servicios</div><h2 class="display-md">Servicios para cada etapa de la operación</h2></div><a class="link-underline" href="/servicios">Ver todos los servicios</a></div>
  ${servicesSection}
</section>

<section class="wrap section steps-section">
  <div class="section-head"><h2 class="display-md">Qué significa «Verificada»</h2><span class="tagline">No se trata de publicar por publicar.</span></div>
  <div class="steps">
    <div><span class="num">01</span><h3>Revisión antes de publicar</h3><p>Datos, fotos y precio se revisan antes de que la propiedad aparezca. Si algo no cuadra, no se publica.</p></div>
    <div><span class="num">02</span><h3>Lectura de valor en cada ficha</h3><p>Cada propiedad indica si su precio está por debajo, dentro o por encima del rango de su zona.</p></div>
    <div><span class="num">03</span><h3>Contacto directo y con contexto</h3><p>Su consulta llega al asesor o propietario con la propiedad ya identificada, sin intermediarios innecesarios.</p></div>
  </div>
</section>

<section class="wrap section">
  <div class="cta-band">
    <div><div class="eyebrow">Mi cuenta</div><h2 class="display-sm">Publique y dé seguimiento desde un solo lugar.</h2><p class="muted">Compradores, propietarios y asesores ingresan con su correo para ver el inventario completo, publicar y dar seguimiento a cada propiedad.</p></div>
    <div class="row-actions"><a class="btn btn-primary" href="/registro">Crear cuenta</a><a class="btn btn-outline" href="/ingresar">Ingresar</a></div>
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

// Bloque para contenido que se abre con una cuenta gratuita.
export function lockBlock(title, text, next, { light = false } = {}) {
  const q = `next=${encodeURIComponent(next)}`;
  return html`<div class="lock${light ? ' lock-light' : ''}">
    <div><strong>${title}</strong><p class="small muted">${text}</p></div>
    <div class="row-actions"><a class="btn ${light ? 'btn-brass' : 'btn-primary'} btn-sm" href="/registro?tipo=comprador&amp;${raw(q)}">Crear cuenta gratuita</a><a class="btn ${light ? 'btn-outline' : 'btn-outline'} btn-sm" href="/ingresar?${raw(q)}">Ingresar</a></div>
  </div>`;
}

function saveRow(p, account, fav, notice) {
  const next = `/propiedad/${p.slug}`;
  if (!account) {
    return html`<div class="save-box" id="guardar">
      <strong>Guárdela y reciba similares</strong>
      <p class="small muted">Con una cuenta gratuita guarda esta propiedad y le avisamos cuando entre una parecida en ${p.zone_name || 'la zona'}.</p>
      <div class="fav-row"><a class="btn btn-outline btn-sm" href="/registro?tipo=comprador&amp;${raw(`next=${encodeURIComponent(next)}`)}">Crear cuenta</a><a class="btn btn-outline btn-sm" href="/ingresar?${raw(`next=${encodeURIComponent(next)}`)}">Ingresar</a></div>
    </div>`;
  }
  return html`<div class="save-box" id="guardar">
    ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}
    <div class="fav-row">
      <form method="post" action="/favorito/${p.slug}"><button class="btn ${fav ? 'btn-primary' : 'btn-outline'} btn-sm" type="submit">${fav ? 'Guardada ✓' : 'Guardar'}</button></form>
      <form method="post" action="/similares/${p.slug}"><button class="btn btn-outline btn-sm" type="submit">Recibir similares</button></form>
    </div>
    <p class="small muted">${fav ? 'La encuentra en Mi cuenta.' : 'Las propiedades guardadas quedan en Mi cuenta.'}</p>
  </div>`;
}

export function propertyPage(env, { p, reading, utm, error, account = null, fav = false, notice = '' }) {
  const mode = p.contact_mode || (p.whatsapp_enabled === 0 ? 'formulario' : 'whatsapp');
  const wa = mode === 'whatsapp';
  const contact = mode !== 'ninguno';
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
      ${p.description ? html`<section class="block"><h2>Sobre la propiedad</h2>${renderDescription(p.description)}</section>` : ''}
      ${features.length ? html`<section class="block"><h2>Amenidades y equipamiento</h2><ul class="tags">${features.map((f) => html`<li>${f}</li>`)}</ul></section>` : ''}
      <section class="block"><h2>Ubicación</h2><p class="muted">${place}. La ubicación exacta se comparte al agendar la visita.</p></section>
    </div>
    <aside class="ficha-side">
      ${p.agency_name ? html`<div class="advisor"><div class="avatar">${(p.agent_name || p.agency_name).charAt(0)}</div><div><strong>${p.agent_name || p.agency_name}</strong><span class="small muted">${p.agent_name ? p.agency_name + ' · ' : ''}${p.agency_verified ? 'Perfil verificado' : 'Asesor'}</span></div></div>` : ''}
      ${contact ? html`      <form class="form-card" method="post" action="/consulta" id="consulta" data-lead="1">
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
      ${PRIVACY_NOTE}
      </form>` : ''}
      ${saveRow(p, account, fav, notice)}
    </aside>
  </div>
  ${contact ? html`<div class="sticky-cta"><a class="btn btn-primary btn-block" href="#consulta">${wa ? html`${WA_ICON}Consultar por WhatsApp` : 'Solicitar información'}</a></div>` : ''}
</article>`;
  return layout(env, {
    title: p.title,
    description: `${place} · ${formatMoney(p.price_amount, p.currency)}${specsLine(p) ? ' · ' + specsLine(p) : ''}`,
    image: images[0],
    path: `/propiedad/${p.slug}`,
    body,
    bodyClass: contact ? 'has-sticky' : '',
  });
}

export function zoneValuePage(env, { zones, zone, type, value, utm, error, account = null }) {
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
  <p class="small light">Mientras tanto, un asesor puede preparar el análisis de su propiedad.</p>
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
    ${account ? html`<form class="form-card" method="post" action="/consulta" data-lead="1">
      <h2>Análisis de su propiedad</h2>
      <p class="small muted">Un asesor revisa su caso y le envía por WhatsApp los comparables, la tendencia de la zona y una recomendación de precio.</p>
      ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
      <input type="hidden" name="tipo" value="valor_zona">
      <input type="hidden" name="zona" value="${zone?.slug || ''}">
      <input type="hidden" name="tipo_propiedad" value="${type}">
      ${utmInputs(utm)}
      ${HONEYPOT}
      <label>Nombre<input type="text" name="nombre" autocomplete="name" maxlength="80" value="${account.name || ''}" required></label>
      <label>WhatsApp<input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" placeholder="+502" maxlength="20" value="${account.whatsapp ? `+${account.whatsapp}` : ''}" required></label>
      <fieldset class="seg"><legend>Usted quiere</legend>
        <label><input type="radio" name="intencion" value="comprar" checked><span>Comprar</span></label>
        <label><input type="radio" name="intencion" value="vender"><span>Vender</span></label>
      </fieldset>
      <label class="check-line"><input type="checkbox" name="alerta" value="1" checked> Avisarme cada mes si cambia el rango de la zona</label>
      <button class="btn btn-primary btn-block" type="submit">${WA_ICON}Solicitar análisis</button>
    ${PRIVACY_NOTE}
    </form>` : html`<div class="form-card">
      <span class="eyebrow">Con cuenta gratuita</span>
      <h2>Análisis de su propiedad</h2>
      <ul class="checks">
        <li>${CHECK}Comparables de su propiedad, no solo de la zona.</li>
        <li>${CHECK}Recomendación de precio de un asesor por WhatsApp.</li>
        <li>${CHECK}Aviso mensual si cambia el rango de la zona.</li>
      </ul>
      <a class="btn btn-primary btn-block" href="/registro?tipo=comprador&amp;next=%2Fvalor">Crear cuenta gratuita</a>
      <a class="btn btn-outline btn-block" href="/ingresar?next=%2Fvalor">Ya tengo cuenta</a>
      <p class="small muted">El rango de la zona es público. La cuenta sirve para darle seguimiento a su caso.</p>
    </div>`}
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
  { id: 'agencia_pro', name: 'Agencia Pro', who: 'Para inventarios grandes y equipos comerciales.', price: 'Q2,200', items: ['Propiedades y asesores ilimitados', 'Todo lo del plan Agencia', '1 tour 360° incluido al mes', '5 propiedades destacadas al mes', 'Reporte mensual de consultas'] },
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
<p class="wrap small muted center-text">¿Desarrolla un proyecto nuevo? Vea los <a href="/desarrolladoras">planes por proyecto para desarrolladoras</a>.</p>
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
    ${PRIVACY_NOTE}
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
  <p class="lead">Complete los datos básicos y agregue sus fotografías. Revisamos la información y le escribimos por WhatsApp para confirmar la publicación.</p>
  <ol class="mini-steps"><li><strong>1.</strong> Datos de la propiedad</li><li><strong>2.</strong> Revisión y lectura de valor</li><li><strong>3.</strong> Publicación y consultas a su WhatsApp</li></ol>
  <form class="form-card form-wide" method="post" action="/publicar" enctype="multipart/form-data" data-lead="1" data-upload>
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
    <fieldset><legend>Fotografías</legend>
      <label>Hasta 10 fotos (JPG, PNG o WebP)<input type="file" name="fotos" accept="image/jpeg,image/png,image/webp" multiple data-max="10"></label>
      <div class="upload-preview" data-upload-preview></div>
      <p class="small muted" data-upload-msg>Recomendado: fachada, sala, cocina, habitación principal y jardín, con buena luz natural. Se optimizan automáticamente.</p>
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
  ${PRIVACY_NOTE}
      </form>
</section>`;
  return layout(env, { title: 'Publicar propiedad', path: '/publicar', body, scripts: ['/upload.js'] });
}

export function publishThanksPage(env, { ref, waUrl, photos = 0 }) {
  const body = html`
<section class="wrap section narrow center">
  <div class="eyebrow">Recibido · Referencia ${ref}</div>
  <h1 class="display-md">Su propiedad está en revisión.</h1>
  ${photos
    ? html`<p class="lead">Recibimos sus datos y ${photos === 1 ? 'una fotografía' : `${photos} fotografías`}. Le escribiremos por WhatsApp para confirmar la publicación y compartirle la lectura de valor.</p>
  <a class="btn btn-outline" href="${waUrl}">${WA_ICON}Enviar más fotografías por WhatsApp</a>`
    : html`<p class="lead">El siguiente paso es enviarnos las fotografías por WhatsApp. Con eso completamos la revisión y la lectura de valor.</p>
  <a class="btn btn-primary" href="${waUrl}">${WA_ICON}Enviar fotografías por WhatsApp</a>`}
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

export const STATUS_LABEL = { revision: 'En revisión', publicada: 'Publicada', rechazada: 'Rechazada', pausada: 'Pausada', vendida: 'Vendida' };

export function adminPage(env, { counts, props, leads, zones, filter, heroImage, notice }) {
  const waLink = (n) => (n ? `https://wa.me/${n}` : null);
  const body = html`
<section class="wrap section admin">
  <div class="section-head"><h1 class="display-sm">Panel inmuhub</h1><div class="admin-links"><a class="btn btn-primary btn-sm" href="/admin/proyectos">Proyectos y desarrolladoras</a><form method="post" action="/admin/logout"><button class="btn btn-outline btn-sm" type="submit">Salir</button></form></div></div>
  ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}
  <div class="kpis">
    <div><span>En revisión</span><strong>${counts.pendientes}</strong></div>
    <div><span>Publicadas</span><strong>${counts.publicadas}</strong></div>
    <div><span>Consultas 7 días</span><strong>${counts.leads_7d}</strong></div>
    <div><span>Consultas totales</span><strong>${counts.leads_total}</strong></div>
  </div>

  <section class="hero-admin">
    <img src="${heroImage || '/portada.webp'}" alt="Portada actual">
    <div class="hero-admin-body">
      <h2>Portada del sitio</h2>
      <p class="small muted">${heroImage ? 'Foto elegida por usted.' : 'Imagen ilustrativa predeterminada.'} Se muestra en la parte superior de la home. Funcionan mejor las fotos verticales o cuadradas.</p>
      <form method="post" action="/admin/portada" enctype="multipart/form-data" data-upload class="row-actions">
        <input type="file" name="foto" accept="image/jpeg,image/png,image/webp" data-max="1" required aria-label="Foto de portada">
        <button class="btn btn-primary btn-sm" type="submit">Subir como portada</button>
        <span class="small muted" data-upload-msg></span>
      </form>
      ${heroImage ? html`<form method="post" action="/admin/portada"><button class="btn btn-outline btn-sm" name="accion" value="restablecer">Volver a la imagen ilustrativa</button></form>` : ''}
    </div>
  </section>

  <section class="admin-switch">
    <a class="admin-switch-card" href="/admin/cuentas"><span class="eyebrow">Usuarios</span><strong>Cuentas</strong><span class="small muted">Propietarios y asesores registrados, aprobación y claves temporales</span></a>
    <a class="admin-switch-card" href="/admin/proyectos"><span class="eyebrow">Obra nueva</span><strong>Proyectos y desarrolladoras</strong><span class="small muted">Crear, publicar y ver el reporte mensual de cada proyecto</span></a>
    <form method="post" action="/admin/proyectos/nuevo" class="admin-switch-card admin-switch-new"><button type="submit"><span class="eyebrow">Atajo</span><strong>+ Nuevo proyecto</strong><span class="small muted">Se crea como borrador</span></button></form>
  </section>

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
      <td><span class="status status-${p.status}">${STATUS_LABEL[p.status]}</span>${p.verified ? html` <span class="status status-publicada">Verificada</span>` : ''}${!p.images || p.images === '[]' ? html` <span class="status status-revision">Sin fotos</span>` : ''}${p.contact_mode === 'ninguno' ? html` <span class="status">Sin contacto</span>` : p.contact_mode === 'formulario' ? html` <span class="status">Solo formulario</span>` : ''}</td>
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
      <td class="small">${l.property_title ? html`<a href="/propiedad/${l.property_slug}" target="_blank">${l.property_title}</a>` : l.project_name ? html`<a href="/proyecto/${l.project_slug}" target="_blank">${l.project_name}</a>` : l.zone_slug || ''} ${l.intent ? `· ${l.intent}` : ''} ${l.message ? `· ${l.message}` : ''}</td>
      <td class="small muted">${[l.utm_source, l.utm_campaign, l.utm_content].filter(Boolean).join(' / ') || 'directo'}</td>
    </tr>`)}</tbody>
  </table></div>
</section>`;
  return layout(env, { title: 'Administración', body, noindex: true, scripts: ['/upload.js'] });
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
      <label>Descripción<textarea name="description" rows="16" maxlength="6000">${v('description')}</textarea></label>
      <p class="small muted">Formato: párrafos separados por una línea en blanco. «## Título» crea una sección y «- texto» un punto de lista.</p>
      <label>Características (separadas por coma)<input type="text" name="features" maxlength="1500" value="${features.join(', ')}"></label>
      <label>Enlace del tour 360°<input type="url" name="tour_url" maxlength="500" value="${v('tour_url')}" placeholder="https://"></label>
    </fieldset>
    <fieldset><legend>Contacto y confianza</legend>
      <label>Forma de contacto en la ficha<select name="contact_mode">${opt('whatsapp', 'Formulario que abre WhatsApp', p.contact_mode)}${opt('formulario', 'Formulario (la consulta solo se guarda en este panel)', p.contact_mode)}${opt('ninguno', 'Sin contacto (ficha solo informativa)', p.contact_mode)}</select></label>
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

// ---------- Aviso de privacidad ----------

export function privacyPage(env) {
  const wa = String(env.WHATSAPP_DEFAULT || '');
  const waLabel = wa.startsWith('502') && wa.length === 11 ? `+502 ${wa.slice(3, 7)}-${wa.slice(7)}` : wa;
  const body = html`
<section class="wrap section narrow legal">
  <div class="eyebrow">Aviso de privacidad</div>
  <h1 class="display-md">Cómo tratamos sus datos</h1>
  <p class="lead">inmuhub es un portal inmobiliario operado por Zona-INNmueble en Guatemala. Este aviso explica qué datos recibimos a través del sitio, para qué los usamos y cómo puede pedir que los corrijamos o eliminemos.</p>

  <h2>Qué datos recibimos</h2>
  <ul class="desc-list">
    <li>Los que usted escribe en nuestros formularios: nombre, número de teléfono o WhatsApp, correo (opcional), su interés (comprar, vender, invertir) y los datos de la propiedad que desea publicar.</li>
    <li>La página desde la que nos contacta y, si llegó desde un anuncio, el nombre de la campaña.</li>
    <li>Datos técnicos básicos de navegación que registran nuestros proveedores de alojamiento y, si está activa, la medición de anuncios de Meta.</li>
  </ul>

  <h2>Para qué los usamos</h2>
  <ul class="desc-list">
    <li>Responder su consulta y darle información sobre la propiedad o zona que le interesa.</li>
    <li>Revisar y publicar la propiedad que usted nos envía.</li>
    <li>Coordinar visitas y dar seguimiento a su solicitud.</li>
    <li>Medir qué anuncios y páginas funcionan mejor, de forma agregada.</li>
  </ul>
  <p>No vendemos sus datos ni los usamos para fines distintos de los descritos aquí.</p>

  <h2>Con quién los compartimos</h2>
  <ul class="desc-list">
    <li>Con el asesor o propietario responsable de la propiedad por la que usted consulta, solo para atender su solicitud.</li>
    <li>Con los proveedores técnicos que alojan el sitio y los mensajes (Cloudflare) y, cuando usted elige continuar por WhatsApp, con esa plataforma.</li>
  </ul>
  <p>Los datos de contacto de quien publica una propiedad no se muestran en el sitio.</p>

  <h2>Cuánto tiempo los guardamos</h2>
  <p>Mientras sean útiles para atender su solicitud o dar seguimiento comercial razonable. Puede pedir su eliminación en cualquier momento.</p>

  <h2>Sus derechos</h2>
  <p>Puede solicitar acceso, corrección o eliminación de sus datos, o pedir que dejemos de contactarle, escribiéndonos por WhatsApp${waLabel ? html` al <strong>${waLabel}</strong>` : ''}. Atenderemos su solicitud en un plazo razonable.</p>

  <p class="small muted">Última actualización: septiembre de 2026.</p>
</section>`;
  return layout(env, { title: 'Aviso de privacidad', path: '/privacidad', body });
}
