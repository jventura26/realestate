const { escapeHtml } = require('../../shared/utils');

function card(p) {
  const img = p.mainImageThumb || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70';
  const badgeClass = ['nueva','nueva'].includes((p.cinta||'').toLowerCase()) ? 'badge' : '';
  const badge = ['Nueva', 'Venta'].includes(p.cinta || '') ? p.cinta : '';
  
  return `<a class="property-card" href="/propiedades/${p.slug}.html"
  data-tipo="${escapeHtml(p.tipo)}" data-ciudad="${escapeHtml(p.municipio)}"
  data-cinta="${escapeHtml(p.cinta)}" data-precio="${p.priceNumeric}"
  data-habs="${p.habitaciones||0}">
  <div class="property-image">
    <img referrerpolicy="no-referrer" src="${escapeHtml(img)}" alt="${escapeHtml(p.tipo||'Propiedad')} en ${escapeHtml(p.municipio||'Guatemala')} - ${escapeHtml(p.title)}" loading="lazy" width="600" height="375">
    ${badge ? `<span class="badge">${escapeHtml(badge)}</span>` : ''}
  </div>
  <div class="property-info">
    <div class="property-header">
      <h3>${escapeHtml(p.title)}</h3>
      <div class="property-price">${escapeHtml(p.priceFormatted)}</div>
    </div>
    <div class="property-meta">
      <span>📍 ${escapeHtml(p.locationFull)}</span>
      ${p.habitaciones && p.habitaciones !== '0' ? `<span>${p.habitaciones} 🛏</span>` : ''}
      ${p.banos && p.banos !== '0' ? `<span>${p.banos} 🚿</span>` : ''}
    </div>
  </div>
</a>`;
}

module.exports = { card };
