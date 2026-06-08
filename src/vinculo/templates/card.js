const { escapeHtml } = require('../../shared/utils');

function card(p) {
  const img = p.mainImageThumb || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70';

  const tipoBadge = p.tipo ? `<span class="card-tipo">${escapeHtml(p.tipo)}</span>` : '';

  const cinta = (p.cinta || '').trim();
  const cintaSlug = cinta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-');
  const cintaBadge = cinta ? `<span class="card-cinta card-cinta--${cintaSlug}">${escapeHtml(cinta)}</span>` : '';

  const specs = [];
  if (p.habitaciones && p.habitaciones !== '0') specs.push(`<span class="cs-item">${p.habitaciones} hab.</span>`);
  if (p.banos && p.banos !== '0') specs.push(`<span class="cs-item">${p.banos} ba.</span>`);
  if (p.areaConst) specs.push(`<span class="cs-item">${p.areaConst} m\u00B2</span>`);

  const specsHTML = specs.length > 0
    ? `<div class="card-specs">${specs.join('<span class="cs-dot">\u00B7</span>')}</div>`
    : '';

  return `<a class="property-card" href="/propiedades/${p.slug}.html"
  data-tipo="${escapeHtml(p.tipo)}" data-ciudad="${escapeHtml(p.municipio)}"
  data-cinta="${escapeHtml(p.cinta)}" data-precio="${p.priceNumeric}"
  data-habs="${p.habitaciones||0}">
  <div class="card-img-wrap">
    <img referrerpolicy="no-referrer" src="${escapeHtml(img)}" alt="${escapeHtml(p.tipo||'Propiedad')} en ${escapeHtml(p.municipio||'Guatemala')} - ${escapeHtml(p.title)}" loading="lazy" width="600" height="375">
    <div class="card-badges">${tipoBadge}${cintaBadge}</div>
  </div>
  <div class="card-body">
    <div class="card-price">${escapeHtml(p.priceFormatted)}</div>
    <h3 class="card-title">${escapeHtml(p.title)}</h3>
    <p class="card-loc">${escapeHtml(p.locationFull)}</p>
    ${specsHTML}
  </div>
</a>`;
}

module.exports = { card };
