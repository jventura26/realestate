const { escapeHtml } = require('../../shared/utils');

const ICON_BED  = '<svg width="14" height="12" viewBox="0 0 16 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="6" width="14" height="5.5" rx="1.5"/><path d="M1 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/><rect x="4" y="4" width="3" height="2" rx=".5"/></svg>';
const ICON_BATH = '<svg width="13" height="12" viewBox="0 0 15 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 8h12v1.5a3.5 3.5 0 0 1-3.5 3H4A3.5 3.5 0 0 1 .5 9v-.5z"/><path d="M1.5 8V4A2.5 2.5 0 0 1 6.5 4"/></svg>';
const ICON_AREA = '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="1" width="12" height="12" rx="1.5"/><path d="M1 5h12M5 1v12"/></svg>';
const ICON_PIN  = '<svg width="11" height="13" viewBox="0 0 12 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 1a4 4 0 0 1 4 4c0 3-4 8-4 8S2 8 2 5a4 4 0 0 1 4-4z"/><circle cx="6" cy="5" r="1.4"/></svg>';

function card(p) {
  const img = p.mainImageThumb || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70';

  const tipoBadge = p.tipo ? `<span class="card-tipo">${escapeHtml(p.tipo)}</span>` : '';

  const cinta = (p.cinta || '').trim();
  const cintaSlug = cinta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-');
  const cintaBadge = cinta ? `<span class="card-cinta card-cinta--${cintaSlug}">${escapeHtml(cinta)}</span>` : '';

  const specs = [];
  if (p.habitaciones && p.habitaciones !== '0') specs.push(`<span class="cs-item">${ICON_BED}<span>${p.habitaciones} hab.</span></span>`);
  if (p.banos && p.banos !== '0') specs.push(`<span class="cs-item">${ICON_BATH}<span>${p.banos} ba.</span></span>`);
  if (p.areaConst) specs.push(`<span class="cs-item">${ICON_AREA}<span>${p.areaConst} m\u00B2</span></span>`);

  const specsHTML = specs.length > 0
    ? `<div class="card-specs">${specs.join('<span class="cs-sep"></span>')}</div>`
    : '';

  return `<a class="property-card" href="/propiedades/${p.slug}.html"
  data-tipo="${escapeHtml(p.tipo)}" data-ciudad="${escapeHtml(p.municipio)}"
  data-cinta="${escapeHtml(p.cinta)}" data-precio="${p.priceNumeric}"
  data-habs="${p.habitaciones||0}">
  <div class="card-img-wrap">
    <img referrerpolicy="no-referrer" src="${escapeHtml(img)}" alt="${escapeHtml(p.tipo||'Propiedad')} en ${escapeHtml(p.title)}" loading="lazy" width="600" height="375">
    <div class="card-badges">${tipoBadge}${cintaBadge}</div>
  </div>
  <div class="card-body">
    <div class="card-price">${escapeHtml(p.priceFormatted)}</div>
    <h3 class="card-title">${escapeHtml(p.title)}</h3>
    <p class="card-loc">${ICON_PIN}<span>${escapeHtml(p.locationFull)}</span></p>
    ${specsHTML}
  </div>
</a>`;
}

module.exports = { card };
