const { escapeHtml } = require('../../shared/utils');

function card(p) {
  const img = p.mainImageThumb || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70';
  const badgeClass = ['nueva','nueva'].includes((p.cinta||'').toLowerCase()) ? 'nueva' : '';
  const badge = p.cinta || p.estado || '';
  const meta = [];
  if (p.habitaciones && p.habitaciones !== '0') meta.push(`🛏 ${p.habitaciones}`);
  if (p.banos        && p.banos        !== '0') meta.push(`🚿 ${p.banos}`);
  if (p.areaConst)                              meta.push(`📐 ${p.areaConst}`);

  return `<a class="prop-card" href="/propiedades/${p.slug}.html"
  data-tipo="${escapeHtml(p.tipo)}" data-ciudad="${escapeHtml(p.municipio)}"
  data-cinta="${escapeHtml(p.cinta)}" data-precio="${p.priceNumeric}"
  data-habs="${p.habitaciones||0}">
  <div class="pc-img">
    <img src="${escapeHtml(img)}" alt="${escapeHtml(p.title)}" loading="lazy">
    ${badge ? `<span class="pc-badge ${badgeClass}">${escapeHtml(badge)}</span>` : ''}
  </div>
  <div class="pc-body">
    <div class="pc-tipo">${escapeHtml(p.tipo)}</div>
    <div class="pc-title">${escapeHtml(p.title)}</div>
    <div class="pc-loc">📍 ${escapeHtml(p.locationFull)}</div>
    ${meta.length ? `<div class="pc-meta">${meta.map(m=>`<span>${m}</span>`).join('')}</div>` : ''}
    <div class="pc-sep"></div>
    <div class="pc-bottom">
      <div class="pc-price">${escapeHtml(p.priceFormatted)}</div>
      <span class="pc-cta">Ver →</span>
    </div>
  </div>
</a>`;
}

module.exports = { card };
