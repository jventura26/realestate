// Vistas de proyectos nuevos, comparador, páginas de zona y la página para desarrolladoras.
import { html, raw, formatMoney, formatNumber, parseJsonArray } from './html.js';
import {
  layout, CHECK, WA_ICON, GLOBE, zoneOptions, valueBar, utmInputs, PRIVACY_NOTE, HONEYPOT, placeLabel, propertyCard,
  renderDescription, lockBlock, imgUrl, imgSrcset,
} from './views.js';

export const KIND_LABELS = { apartamentos: 'Apartamentos', casas: 'Casas', lotes: 'Lotes', oficinas: 'Oficinas', mixto: 'Uso mixto' };
export const STAGE_LABELS = { preventa: 'Preventa', construccion: 'En construcción', entrega: 'Entrega inmediata' };

// Planes para desarrolladoras: un solo lugar para ajustar precios y contenido.
export const DEVELOPER_PLANS = [
  {
    id: 'proyecto', name: 'Proyecto', price: 'Q1,500', per: 'por proyecto al mes',
    items: ['Ficha completa con tipologías, avance y enganche', 'Lectura de precio por m² frente a su zona', 'Consultas directas a su sala de ventas por WhatsApp', 'Aparece en el comparador y en la página de su zona', 'Reporte mensual de visitas y consultas'],
  },
  {
    id: 'destacado', name: 'Proyecto destacado', price: 'Q2,800', per: 'por proyecto al mes', featured: true,
    items: ['Todo lo del plan Proyecto', 'Primera posición en su zona y en la página principal', 'Dos publicaciones al mes en las redes de inmuhub', 'Un reel vertical del proyecto al mes', 'Revisión trimestral de precio frente a la zona'],
  },
];
export const LAUNCH_OFFER = 'Las primeras 10 desarrolladoras publican su primer proyecto sin costo durante 3 meses.';

const COMPARE_ICON = raw('<svg class="i" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M12 3v18"/></svg>');

// ---------- Helpers ----------

function range(a, b, unit = '') {
  if (a && b && a !== b) return `${formatNumber(a)}–${formatNumber(b)}${unit}`;
  if (a || b) return `${formatNumber(a || b)}${unit}`;
  return '';
}

export function projectSpecs(j) {
  const parts = [];
  const beds = range(j.bedrooms_min, j.bedrooms_max);
  if (beds) parts.push(`${beds} hab.`);
  const m2 = range(j.m2_from, j.m2_to, ' m²');
  if (m2) parts.push(m2);
  return parts.join(' · ');
}

function priceFrom(j) {
  return j.price_from ? `Desde ${formatMoney(j.price_from, j.currency)}` : 'Precio a consultar';
}

function compareButton(j, cls = 'btn-outline btn-xs') {
  return html`<button type="button" class="btn ${cls} compare-btn" data-compare="${j.slug}" data-name="${j.name}" aria-pressed="false">${COMPARE_ICON}<span>Comparar</span></button>`;
}

function compareBar() {
  return raw('<div class="compare-bar" id="compare-bar" hidden><span id="compare-count"></span><a class="btn btn-brass btn-sm" id="compare-go" href="/comparar">Comparar ahora</a><button type="button" class="btn btn-sm compare-clear" id="compare-clear">Limpiar</button></div>');
}

export function projectCard(j) {
  const img = parseJsonArray(j.images)[0];
  const featured = j.featured_until && new Date(j.featured_until.replace(' ', 'T') + 'Z') > new Date();
  return html`<article class="card">
  <a class="card-link" href="/proyecto/${j.slug}">
    <div class="card-media">
      ${img ? html`<img src="${imgUrl(img, 800)}" alt="${j.name}" loading="lazy" decoding="async" width="800" height="600">` : html`<div class="ph">Sin fotografía</div>`}
      <div class="badges">
        <span class="badge badge-ink">${STAGE_LABELS[j.stage]}</span>
        ${featured ? html`<span class="badge">${CHECK}Destacado</span>` : ''}
      </div>
    </div>
    <div class="card-body">
      <span class="eyebrow-sm">${placeLabel(j)}</span>
      <h3>${j.name}</h3>
      <span class="muted small">${[KIND_LABELS[j.kind], projectSpecs(j)].filter(Boolean).join(' · ')}</span>
      ${j.developer_name ? html`<span class="small">${j.developer_name}</span>` : ''}
      <div class="card-foot">
        <span class="price">${priceFrom(j)}</span>
        ${j.delivery ? html`<span class="small muted">Entrega ${j.delivery}</span>` : ''}
      </div>
    </div>
  </a>
  <div class="card-actions">${compareButton(j)}</div>
</article>`;
}

// ---------- Listado ----------

export function projectsPage(env, { zones, filters, items }) {
  const zoneName = zones.find((z) => z.slug === filters.zone)?.name;
  const heading = zoneName ? `Proyectos nuevos en ${zoneName}` : 'Proyectos nuevos';
  const sel = (cur, v) => (cur === v ? raw(' selected') : '');
  const body = html`
<section class="wrap section">
  <div class="section-head">
    <div>
      <div class="eyebrow">Obra nueva · Guatemala</div>
      <h1 class="display-md">${heading}</h1>
    </div>
    <span class="tagline">Explore, compare y decida con información.</span>
  </div>
  <form class="search search-inline" action="/proyectos" method="get">
    <label>Zona<select name="zona">${zoneOptions(zones, filters.zone)}</select></label>
    <label>Tipo<select name="tipo"><option value="">Todos</option>${Object.entries(KIND_LABELS).map(([k, l]) => html`<option value="${k}"${sel(filters.kind, k)}>${l}</option>`)}</select></label>
    <label>Etapa<select name="etapa"><option value="">Todas</option>${Object.entries(STAGE_LABELS).map(([k, l]) => html`<option value="${k}"${sel(filters.stage, k)}>${l}</option>`)}</select></label>
    <button class="btn btn-primary" type="submit">Filtrar</button>
  </form>
  ${items.length
    ? html`<div class="cards">${items.map(projectCard)}</div>`
    : html`<div class="empty">
    <h2>${filters.zone || filters.kind || filters.stage ? 'Aún no hay proyectos con estos filtros.' : 'Estamos incorporando los primeros proyectos.'}</h2>
    <p class="muted">Cada proyecto se revisa antes de publicarse: tipologías, precios, enganche y avance. Déjenos su búsqueda y le avisamos por WhatsApp cuando llegue una opción que encaje.</p>
    <div class="row-actions"><a class="btn btn-primary" href="/valor${filters.zone ? `?zona=${encodeURIComponent(filters.zone)}` : ''}">Dejar mi búsqueda</a><a class="btn btn-outline" href="/desarrolladoras">¿Desarrolla un proyecto?</a></div>
  </div>`}
</section>
${compareBar()}`;
  const qs = new URLSearchParams(Object.entries({ zona: filters.zone, tipo: filters.kind, etapa: filters.stage }).filter(([, v]) => v)).toString();
  return layout(env, {
    title: heading,
    description: 'Proyectos inmobiliarios nuevos en Guatemala: tipologías, precios desde, enganche, avance de obra y lectura de precio por m² frente a su zona.',
    path: '/proyectos' + (qs ? '?' + qs : ''),
    body,
    scripts: ['/compare.js'],
  });
}

// ---------- Ficha ----------

export function projectPage(env, { j, reading, utm, error, account = null }) {
  const mode = j.contact_mode || 'whatsapp';
  const wa = mode === 'whatsapp';
  const contact = mode !== 'ninguno';
  const images = parseJsonArray(j.images);
  const amenities = parseJsonArray(j.amenities);
  const typologies = parseJsonArray(j.typologies);
  const place = placeLabel(j);
  const specs = [
    ['Etapa', STAGE_LABELS[j.stage]],
    ['Entrega', j.delivery],
    ['Tipo', KIND_LABELS[j.kind]],
    ['Habitaciones', range(j.bedrooms_min, j.bedrooms_max)],
    ['Áreas', range(j.m2_from, j.m2_to, ' m²')],
    ['Disponibles', j.units_available ? `${formatNumber(j.units_available)}${j.units_total ? ` de ${formatNumber(j.units_total)}` : ''} unidades` : ''],
  ].filter(([, v]) => v);

  const r = reading?.range;
  const typeWord = reading?.comparable === 'casa' ? 'casas' : 'apartamentos';
  const readingBlock = !reading
    ? ''
    : r?.enough
      ? html`<section class="reading">
  <span class="eyebrow eyebrow-light">Lectura de precio por m²</span>
  <h2>Q ${formatNumber(reading.ppm2)}/m² frente a ${typeWord} publicados en ${j.zone_name}</h2>
  ${valueBar(r, reading.ppm2)}
  <p class="small light">Comparado con ${r.count} ${typeWord} publicados en inmuhub en la misma zona, en su mayoría de reventa. La obra nueva suele ubicarse por encima por acabados, amenidades y garantía de construcción. Referencial: no sustituye un avalúo.</p>
</section>`
      : html`<section class="reading">
  <span class="eyebrow eyebrow-light">Lectura de precio por m²</span>
  <h2>Q ${formatNumber(reading.ppm2)}/m² en promedio</h2>
  <p class="small light">Aún reunimos comparables de ${typeWord} en ${j.zone_name} para mostrar el rango de la zona (hay ${r?.count ?? 0} de ${env.MIN_COMPARABLES || 5}).</p>
</section>`;

  const typologyOptions = typologies.filter((t) => t.name);
  const body = html`
<article class="ficha">
  <div class="gallery" aria-label="Fotografías">
    ${images.length ? images.map((src, i) => html`<img src="${imgUrl(src, 1200)}"${imgSrcset(src) ? raw(` srcset="${imgSrcset(src)}" sizes="(min-width: 1024px) 48vw, (min-width: 720px) 70vw, 100vw"`) : ''} alt="${j.name} — imagen ${i + 1}" width="1200" height="800" ${i ? raw('loading="lazy" decoding="async"') : raw('fetchpriority="high"')}>`) : html`<div class="ph">Sin fotografía</div>`}
  </div>
  ${images.length > 1 ? html`<p class="wrap small muted gallery-hint">${images.length} imágenes · deslice para ver más. Las imágenes de proyectos en preventa pueden ser renders.</p>` : ''}
  <div class="wrap ficha-grid">
    <div class="ficha-main">
      <div class="badges-row">
        <span class="badge badge-ink">${STAGE_LABELS[j.stage]}</span>
        <span class="badge badge-line">${KIND_LABELS[j.kind]}</span>
        ${j.tour_url ? html`<a class="badge badge-line" href="${j.tour_url}" target="_blank" rel="noopener">${GLOBE}Recorrido 360°</a>` : ''}
      </div>
      <span class="eyebrow-sm">${place}${j.developer_name ? ` · ${j.developer_name}` : ''}</span>
      <h1 class="display-sm">${j.name}</h1>
      <div class="price-row"><span class="price-lg">${priceFrom(j)}</span>${j.currency === 'USD' && j.price_from_gtq ? html`<span class="muted small">≈ Q ${formatNumber(j.price_from_gtq)}</span>` : ''}</div>
      ${j.down_payment && account ? html`<p class="callout">${j.down_payment}</p>` : ''}
      ${specs.length ? html`<dl class="specs">${specs.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>` : ''}
      ${readingBlock}
      ${typologies.length ? html`<section class="block"><h2>Tipologías</h2>
        <div class="table-wrap"><table class="typologies">
          <thead><tr><th>Tipo</th><th>Hab.</th><th>Baños</th><th>Área</th>${account ? html`<th>Precio</th><th>Por m²</th>` : ''}</tr></thead>
          <tbody>${typologies.map((t) => html`<tr><td><strong>${t.name || '—'}</strong></td><td>${t.bedrooms ?? '—'}</td><td>${t.bathrooms ? formatNumber(t.bathrooms, 1) : '—'}</td><td>${t.m2 ? `${formatNumber(t.m2, 1)} m²` : '—'}</td>${account ? html`<td>${t.price ? formatMoney(t.price, j.currency) : 'Consultar'}</td><td class="muted">${t.price && t.m2 ? formatMoney(t.price / t.m2, j.currency) : '—'}</td>` : ''}</tr>`)}</tbody>
        </table></div>
        ${account ? html`<p class="small muted">Precios y disponibilidad sujetos a confirmación de la desarrolladora.</p>` : ''}
      </section>` : ''}
      ${!account && (typologies.some((t) => t.price) || j.down_payment || j.brochure_url)
        ? lockBlock(
            'Precios por tipología, plan de pagos y brochure',
            'Con su cuenta gratuita accede al precio de cada tipología, su valor por m², las condiciones de enganche y el material completo del proyecto.',
            `/proyecto/${j.slug}`
          )
        : ''}
      ${j.description ? html`<section class="block"><h2>Sobre el proyecto</h2>${renderDescription(j.description)}</section>` : ''}
      ${amenities.length ? html`<section class="block"><h2>Amenidades</h2><ul class="tags">${amenities.map((a) => html`<li>${a}</li>`)}</ul></section>` : ''}
      ${j.brochure_url || j.video_url ? html`<section class="block"><h2>Material del proyecto</h2><div class="row-actions">
        ${j.brochure_url ? (account ? html`<a class="btn btn-outline btn-sm" href="${j.brochure_url}" target="_blank" rel="noopener">Ver brochure</a>` : html`<a class="btn btn-outline btn-sm" href="/ingresar?next=${encodeURIComponent('/proyecto/' + j.slug)}">Brochure (con cuenta)</a>`) : ''}
        ${j.video_url ? html`<a class="btn btn-outline btn-sm" href="${j.video_url}" target="_blank" rel="noopener">Ver video</a>` : ''}
      </div></section>` : ''}
      <section class="block"><h2>Ubicación</h2><p class="muted">${place}. ${j.zone_slug ? html`<a href="/zona/${j.zone_slug}">Ver todo sobre ${j.zone_name}</a>` : ''}</p></section>
    </div>
    <aside class="ficha-side">
      ${j.developer_name ? html`<div class="advisor"><div class="avatar">${j.developer_name.charAt(0)}</div><div><strong>${j.developer_name}</strong><span class="small muted">Desarrolladora${j.developer_website ? html` · <a href="${j.developer_website}" target="_blank" rel="noopener">Sitio web</a>` : ''}</span></div></div>` : ''}
      ${compareButton(j, 'btn-outline btn-block')}
      ${contact ? html`<form class="form-card" method="post" action="/consulta" id="consulta" data-lead="1">
        <h2>Reciba precios y disponibilidad</h2>
        ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
        <input type="hidden" name="tipo" value="proyecto">
        <input type="hidden" name="proyecto" value="${j.slug}">
        ${utmInputs(utm)}
        ${HONEYPOT}
        <label>Nombre<input type="text" name="nombre" autocomplete="name" maxlength="80" required></label>
        <label>${wa ? 'WhatsApp' : 'Teléfono'}<input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" placeholder="+502" maxlength="20" required></label>
        ${typologyOptions.length ? html`<label>Tipología de interés<select name="mensaje"><option value="">Aún no sé</option>${typologyOptions.map((t) => html`<option value="${t.name}">${t.name}${t.m2 ? ` · ${formatNumber(t.m2)} m²` : ''}</option>`)}</select></label>` : ''}
        <fieldset class="seg"><legend>Lo busca para</legend>
          <label><input type="radio" name="intencion" value="vivir" checked><span>Vivir</span></label>
          <label><input type="radio" name="intencion" value="invertir"><span>Invertir</span></label>
        </fieldset>
        <button class="btn btn-primary btn-block" type="submit">${wa ? html`${WA_ICON}Continuar por WhatsApp` : 'Solicitar información'}</button>
        <p class="small muted">${wa ? 'Su consulta llega directo a la sala de ventas del proyecto.' : 'La sala de ventas le contactará con precios y disponibilidad.'}</p>
        ${PRIVACY_NOTE}
      </form>` : ''}
    </aside>
  </div>
  ${contact ? html`<div class="sticky-cta"><a class="btn btn-primary btn-block" href="#consulta">${wa ? html`${WA_ICON}Precios por WhatsApp` : 'Solicitar información'}</a></div>` : ''}
</article>
${compareBar()}`;
  return layout(env, {
    title: `${j.name} · ${place}`,
    description: `${KIND_LABELS[j.kind]} en ${STAGE_LABELS[j.stage].toLowerCase()} en ${place}. ${priceFrom(j)}${projectSpecs(j) ? ' · ' + projectSpecs(j) : ''}.`,
    image: images[0],
    path: `/proyecto/${j.slug}`,
    body,
    bodyClass: contact ? 'has-sticky' : '',
    scripts: ['/compare.js'],
  });
}

// ---------- Comparador ----------

export function comparePage(env, { items, readings }) {
  const rows = [
    ['Ubicación', (j) => placeLabel(j)],
    ['Desarrolladora', (j) => j.developer_name || '—'],
    ['Tipo', (j) => KIND_LABELS[j.kind]],
    ['Etapa', (j) => STAGE_LABELS[j.stage]],
    ['Entrega', (j) => j.delivery || '—'],
    ['Precio desde', (j) => (j.price_from ? formatMoney(j.price_from, j.currency) : 'Consultar')],
    ['Habitaciones', (j) => range(j.bedrooms_min, j.bedrooms_max) || '—'],
    ['Áreas', (j) => range(j.m2_from, j.m2_to, ' m²') || '—'],
    ['Precio por m²', (j) => (readings.get(j.id)?.ppm2 ? `Q ${formatNumber(readings.get(j.id).ppm2)}` : '—')],
    ['Frente a su zona', (j) => {
      const rd = readings.get(j.id);
      if (!rd?.range?.enough) return 'Sin rango aún';
      return { bajo: 'Bajo el rango', en: 'Dentro del rango', sobre: 'Sobre el rango' }[rd.position] || '—';
    }],
    ['Enganche', (j) => j.down_payment || '—'],
    ['Disponibles', (j) => (j.units_available ? `${formatNumber(j.units_available)} unidades` : '—')],
    ['Amenidades', (j) => parseJsonArray(j.amenities).slice(0, 6).join(', ') || '—'],
  ];
  const body = html`
<section class="wrap section">
  <div class="eyebrow">Comparador</div>
  <h1 class="display-md">${items.length > 1 ? 'Sus proyectos, lado a lado' : 'Compare hasta 3 proyectos'}</h1>
  ${items.length < 2
    ? html`<div class="empty"><h2>Elija al menos dos proyectos.</h2><p class="muted">En cada proyecto toque «Comparar». Puede elegir hasta tres y verlos aquí lado a lado: precio, áreas, entrega, enganche y su lectura frente a la zona.</p><a class="btn btn-primary" href="/proyectos">Ver proyectos</a></div>`
    : html`<div class="table-wrap compare-wrap"><table class="compare">
    <thead><tr><th></th>${items.map((j) => {
      const img = parseJsonArray(j.images)[0];
      return html`<th>${img ? html`<img src="${img}" alt="">` : html`<div class="compare-ph"></div>`}<a href="/proyecto/${j.slug}">${j.name}</a></th>`;
    })}</tr></thead>
    <tbody>${rows.map(([label, fn]) => html`<tr><th scope="row">${label}</th>${items.map((j) => html`<td>${fn(j)}</td>`)}</tr>`)}
      <tr><th scope="row"></th>${items.map((j) => html`<td><a class="btn btn-primary btn-xs" href="/proyecto/${j.slug}#consulta">Pedir precios</a></td>`)}</tr>
    </tbody>
  </table></div>
  <p class="small muted">«Frente a su zona» compara el precio por m² del proyecto con la oferta publicada en inmuhub de su misma zona. Es una referencia, no un avalúo.</p>`}
</section>`;
  return layout(env, { title: 'Comparar proyectos', path: '/comparar', body, noindex: items.length > 0, scripts: ['/compare.js'] });
}

// ---------- Página de zona ----------

export function zonePage(env, { zone, values, projects, properties, positions }) {
  const stat = (label, v) =>
    html`<div class="zone-stat"><span class="small">${label}</span>${v?.enough ? html`<strong>Q ${formatNumber(v.low)} – ${formatNumber(v.high)}</strong><span class="small light">por ${v.unit} · ${v.count} comparables</span>` : html`<strong>—</strong><span class="small light">Aún reunimos comparables (${v?.count ?? 0})</span>`}</div>`;
  const body = html`
<section class="ink">
  <div class="wrap section zone-hero">
    <div class="eyebrow eyebrow-light">Guía de zona</div>
    <h1 class="display-md">${zone.name}</h1>
    <p class="lead-light">Proyectos nuevos, propiedades revisadas y el rango de valor por m² de la oferta publicada en ${zone.name}.</p>
    <div class="zone-stats">${stat('Casas', values.casa)}${stat('Apartamentos', values.apartamento)}${stat('Terrenos', values.terreno)}</div>
    <a class="btn btn-brass zone-cta" href="/valor?zona=${zone.slug}">Recibir el análisis completo</a>
  </div>
</section>
<section class="wrap section">
  <div class="section-head"><div><div class="eyebrow">Obra nueva</div><h2 class="display-md">Proyectos en ${zone.name}</h2></div><a class="link-underline" href="/proyectos?zona=${zone.slug}">Ver proyectos</a></div>
  ${projects.length ? html`<div class="cards">${projects.map(projectCard)}</div>` : html`<p class="muted">Aún no hay proyectos publicados en esta zona.</p>`}
</section>
<section class="wrap section">
  <div class="section-head"><div><div class="eyebrow">Selección curada</div><h2 class="display-md">Propiedades en ${zone.name}</h2></div><a class="link-underline" href="/propiedades?zona=${zone.slug}">Ver todas</a></div>
  ${properties.length ? html`<div class="cards">${properties.map((p) => propertyCard(p, positions.get(p.id)))}</div>` : html`<p class="muted">Aún no hay propiedades publicadas en esta zona.</p>`}
</section>
${compareBar()}`;
  return layout(env, {
    title: `${zone.name}: proyectos, propiedades y valor por m²`,
    description: `Proyectos nuevos y propiedades revisadas en ${zone.name}, con el rango de valor por m² de la oferta publicada.`,
    path: `/zona/${zone.slug}`,
    body,
    scripts: ['/compare.js'],
  });
}

// ---------- Desarrolladoras ----------

export function developersPage(env, { utm, error, stats }) {
  const body = html`
<section class="wrap hero dev-hero">
  <div class="hero-copy">
    <div class="eyebrow">Para desarrolladoras</div>
    <h1 class="display">Su proyecto, frente a compradores que comparan.</h1>
    <p class="lead">inmuhub reúne proyectos nuevos con la información que el comprador busca antes de escribir: tipologías, precio por m², enganche, avance y cómo se compara con su zona. Las consultas llegan directo a su sala de ventas.</p>
    <div class="callout callout-brass"><strong>Lanzamiento.</strong> ${LAUNCH_OFFER}</div>
    <div class="row-actions"><a class="btn btn-primary" href="#contacto">Quiero publicar mi proyecto</a><a class="btn btn-outline" href="#guia">Descargar el playbook gratuito</a></div>
  </div>
  <div class="dev-panel">
    <div class="eyebrow eyebrow-light">Lo que recibe cada mes</div>
    <ul class="checks checks-light">
      <li>${CHECK}Consultas con nombre, WhatsApp, tipología e intención (vivir o invertir)</li>
      <li>${CHECK}Reporte de visitas a la ficha y consultas por campaña</li>
      <li>${CHECK}Lectura de su precio por m² frente a la oferta de la zona</li>
      <li>${CHECK}Presencia en el comparador y en la guía de su zona</li>
    </ul>
    ${stats.projects || stats.properties ? html`<p class="small light">Hoy en inmuhub: ${stats.properties} propiedades revisadas${stats.projects ? ` y ${stats.projects} proyectos` : ''}.</p>` : ''}
  </div>
</section>

<section class="wrap section steps-section">
  <div class="section-head"><h2 class="display-md">Cómo funciona</h2><span class="tagline">No se trata de publicar por publicar.</span></div>
  <div class="steps steps-4">
    <div><span class="num">01</span><h3>Nos comparte el proyecto</h3><p>Brochure, tipologías, lista de precios, enganche, avance y renders. Nosotros armamos la ficha.</p></div>
    <div><span class="num">02</span><h3>Revisión y lectura de valor</h3><p>Validamos datos y calculamos el precio por m² frente a la oferta publicada en la zona.</p></div>
    <div><span class="num">03</span><h3>Publicación y difusión</h3><p>Ficha, comparador, guía de zona y, en el plan destacado, contenido en redes.</p></div>
    <div><span class="num">04</span><h3>Consultas y reporte</h3><p>Cada consulta llega a su WhatsApp. A fin de mes recibe visitas, consultas y su origen.</p></div>
  </div>
</section>

<section class="wrap plans plans-2">
  ${DEVELOPER_PLANS.map((pl) => html`<article class="plan${pl.featured ? ' plan-featured' : ''}">
    ${pl.featured ? html`<span class="plan-flag">Más visibilidad</span>` : ''}
    <h2>${pl.name}</h2>
    <div class="plan-price"><span>${pl.price}</span> ${pl.per}</div>
    <ul class="checks${pl.featured ? ' checks-light' : ''}">${pl.items.map((it) => html`<li>${CHECK}${it}</li>`)}</ul>
    <a class="btn ${pl.featured ? 'btn-brass' : 'btn-outline'} btn-block" href="#contacto">Elegir ${pl.name}</a>
  </article>`)}
</section>
<p class="wrap small muted center-text">Sin comisión sobre ventas. Sin permanencia mínima. ${LAUNCH_OFFER}</p>

<section class="wrap section" id="guia">
  <div class="split">
    <div class="panel panel-ink">
      <div class="eyebrow eyebrow-light">Playbook gratuito · 2027</div>
      <h2 class="display-sm">Cómo atraer compradores que comparan</h2>
      <p class="lead-light">Lo que el comprador busca antes de escribir, cómo leer su precio por m² frente a la zona, qué destacar en cada mercado y cómo usar IA para responder y calificar mejor.</p>
      <ul class="checks checks-light"><li>${CHECK}Los 12 datos que se revisan antes de pedir información</li><li>${CHECK}Lectura por zona: qué pesa en cada mercado</li><li>${CHECK}IA y herramientas digitales en la sala de ventas</li><li>${CHECK}Qué medir en cada campaña de captación</li></ul>
    </div>
    <form class="form-card" method="post" action="/consulta" data-lead="1" id="contacto">
      <h2>Hablemos de su proyecto</h2>
      ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
      <input type="hidden" name="tipo" value="desarrolladora">
      ${utmInputs(utm)}
      ${HONEYPOT}
      <label>Nombre<input type="text" name="nombre" autocomplete="name" maxlength="80" required></label>
      <label>Desarrolladora<input type="text" name="mensaje" maxlength="120" placeholder="Nombre de la empresa o del proyecto" required></label>
      <label>WhatsApp<input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" placeholder="+502" maxlength="20" required></label>
      <fieldset class="seg"><legend>Quiero</legend>
        <label><input type="radio" name="intencion" value="guia" checked><span>El playbook</span></label>
        <label><input type="radio" name="intencion" value="lanzamiento"><span>Publicar</span></label>
      </fieldset>
      <button class="btn btn-primary btn-block" type="submit">Continuar</button>
      <p class="small muted">Con «El playbook» lo descarga de inmediato. Con «Publicar» seguimos la conversación por WhatsApp.</p>
      ${PRIVACY_NOTE}
    </form>
  </div>
</section>`;
  return layout(env, {
    title: 'Para desarrolladoras',
    description: 'Publique su proyecto en inmuhub: ficha con tipologías, lectura de precio por m² frente a la zona y consultas directas a su sala de ventas.',
    path: '/desarrolladoras',
    body,
  });
}

export function developersThanksPage(env, { waUrl }) {
  const body = html`
<section class="wrap section narrow center">
  <div class="eyebrow">Playbook para desarrolladoras 2027</div>
  <h1 class="display-md">Gracias. Su playbook está listo.</h1>
  <p class="lead">Descárguela aquí. Si quiere revisar su proyecto con nosotros, escríbanos por WhatsApp: le compartimos cómo quedaría su ficha y su lectura frente a la zona.</p>
  <div class="row-actions">
    <a class="btn btn-primary" href="/recursos/playbook-inmuhub-desarrolladoras-2027.pdf" download>Descargar el playbook (PDF)</a>
    <a class="btn btn-outline" href="${waUrl}">${WA_ICON}Revisar mi proyecto</a>
  </div>
</section>`;
  return layout(env, { title: 'Playbook para desarrolladoras', path: '/desarrolladoras', body, noindex: true });
}

// Bloque de la home con proyectos nuevos (solo si hay publicados).
export function homeProjectsSection(projects) {
  if (!projects.length) return '';
  return html`<section class="wrap section">
  <div class="section-head">
    <div><div class="eyebrow">Obra nueva</div><h2 class="display-md">Proyectos nuevos</h2></div>
    <a class="link-underline" href="/proyectos">Ver todos los proyectos</a>
  </div>
  <div class="cards">${projects.map(projectCard)}</div>
</section>${compareBar()}`;
}

