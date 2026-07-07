function ca(a){if(!a)return "";var s=String(a).trim().replace(/^'+/,"");if(!s||s==="0"||s==="-"||/^0\s*(v²|m²)?$/.test(s))return "";return s;}
const { escapeHtml } = require('../../shared/utils');

const ICON_BED  = '<svg width="14" height="12" viewBox="0 0 16 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="6" width="14" height="5.5" rx="1.5"/><path d="M1 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/><rect x="4" y="4" width="3" height="2" rx=".5"/></svg>';
const ICON_BATH = '<svg width="13" height="12" viewBox="0 0 15 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 8h12v1.5a3.5 3.5 0 0 1-3.5 3H4A3.5 3.5 0 0 1 .5 9v-.5z"/><path d="M1.5 8V4A2.5 2.5 0 0 1 6.5 4"/></svg>';
const ICON_AREA = '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="1" width="12" height="12" rx="1.5"/><path d="M1 5h12M5 1v12"/></svg>';
const ICON_PIN  = '<svg width="11" height="13" viewBox="0 0 12 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 1a4 4 0 0 1 4 4c0 3-4 8-4 8S2 8 2 5a4 4 0 0 1 4-4z"/><circle cx="6" cy="5" r="1.4"/></svg>';


function dualPrice(p) {
  var raw = p.priceFormatted || '';
  if (!raw) return '';
  var num = parseFloat(String(p.priceNumeric || 0));
  if (!num || num <= 0) return escapeHtml(raw);
  var m = (p.moneda || '').toUpperCase();
  var isQ = m.includes('Q') || m.includes('GTQ') || raw.includes('Q');
  var approx = String.fromCharCode(8776);
  var sub = '<span style="display:block;font-size:.72rem;font-weight:500;color:#64748b;margin-top:2px">';
  if (isQ) {
    var usd = Math.round(num / 7.60);
    return escapeHtml(raw) + sub + approx + ' ' + '$' + usd.toLocaleString('en-US') + ' USD</span>';
  } else {
    var gtq = Math.round(num * 7.80);
    return escapeHtml(raw) + sub + approx + ' Q' + gtq.toLocaleString('en-US') + '</span>';
  }
}

function card(p) {
  const img = p.mainImageThumb || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70';
  const tipoBadge = p.tipo ? `<span class="card-tipo">${escapeHtml(p.tipo)}</span>` : '';
  const cinta = (p.cinta || '').trim();
  const cintaSlug = cinta.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-');
  const cintaBadge = cinta ? `<span class="card-cinta card-cinta--${cintaSlug}">${escapeHtml(cinta)}</span>` : '';
  const isNew = p.createdAt && (Date.now() - new Date(p.createdAt).getTime()) < 7*24*60*60*1000;
  const nuevoBadge = isNew ? '<span style="position:absolute;top:12px;right:' + (p.destacada ? '48px' : '12px') + ';background:#1a3a5c;color:#fff;font-size:10px;font-weight:700;letter-spacing:.06em;padding:4px 10px;border-radius:20px;z-index:3;text-transform:uppercase">Nuevo</span>' : '';
  const destBadge = p.destacada ? '<span style="position:absolute;top:12px;right:12px;background:#F59E0B;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(245,158,11,.4);z-index:3">★</span>' : '';

  const specs = [];
  if (p.habitaciones && p.habitaciones !== '0') specs.push(`<span class="cs-item">${ICON_BED}<span>${p.habitaciones} hab.</span></span>`);
  if (p.banos && p.banos !== '0') specs.push(`<span class="cs-item">${ICON_BATH}<span>${p.banos} ba.</span></span>`);
  if (ca(p.areaConst)) specs.push(`<span class="cs-item">${ICON_AREA}<span>${ca(p.areaConst)} m\u00B2</span></span>`);
  else if (ca(p.areaV2)) specs.push(`<span class="cs-item">${ICON_AREA}<span>${ca(p.areaV2)} v\u00B2</span></span>`);

  const specsHTML = specs.length > 0
    ? `<div class="card-specs" style="margin-top:auto">${specs.join('<span class="cs-sep"></span>')}</div>`
    : '';

  // ALT TEXT SIMPLE - sin NAN
  const altText = `${escapeHtml(p.title || 'Propiedad')}`;

  return `<a class="property-card" href="/propiedades/${p.slug}.html"
  data-tipo="${escapeHtml(p.tipo)}" data-ciudad="${escapeHtml(p.municipio)}"
  data-cinta="${escapeHtml(p.cinta)}" data-precio="${p.priceNumeric}"
  data-habs="${p.habitaciones||0}"
  style="display:flex;flex-direction:column;background:white;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;border:1.5px solid #eef0f3;transition:all .35s;box-shadow:0 2px 8px rgba(0,0,0,.04)"
  onmouseover="this.style.transform='translateY(-6px)';this.style.boxShadow='0 20px 50px rgba(0,0,0,.12)';this.style.borderColor='var(--gold)';this.querySelector('.card-img-wrap img').style.transform='scale(1.06)'"
  onmouseout="this.style.transform='none';this.style.boxShadow='0 2px 8px rgba(0,0,0,.04)';this.style.borderColor='#eef0f3';this.querySelector('.card-img-wrap img').style.transform='scale(1)'">
  <div class="card-img-wrap" style="overflow:hidden;position:relative;aspect-ratio:4/3">
    <img referrerpolicy="no-referrer" src="${escapeHtml(img)}" alt="${altText}" loading="lazy" width="600" height="375" style="width:100%;height:100%;object-fit:cover;transition:transform .5s ease">
    <div class="card-badges" style="position:absolute;top:12px;left:12px;display:flex;gap:6px">${tipoBadge}${cintaBadge}</div>${destBadge}${nuevoBadge}
    ${p.gallery && p.gallery.length > 1 ? `<div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.6);color:white;font-size:11px;font-weight:600;padding:4px 8px;border-radius:5px;backdrop-filter:blur(4px)">📷 ${p.gallery.length}</div>` : ''}
    <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.4) 0%,transparent 50%)"></div>
    <button onclick="event.preventDefault();event.stopPropagation();zpToggleFav('${p.slug}')" class="zp-fav-btn" id="fav-${p.slug}" style="position:absolute;bottom:10px;left:10px;background:rgba(255,255,255,.9);border:none;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:4;box-shadow:0 2px 8px rgba(0,0,0,.15);transition:all .2s" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
  </div>
  <div class="card-body" style="padding:20px 22px 24px;flex:1;display:flex;flex-direction:column">
    <div class="card-price" style="font-size:1.25rem;font-weight:800;color:var(--gold);margin-bottom:6px;font-family:'Cormorant Garamond',Georgia,serif">${dualPrice(p)}</div>
    <h3 class="card-title" style="font-size:.95rem;font-weight:600;color:#0a1628;line-height:1.4;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${escapeHtml(p.title)}</h3>
    <p class="card-loc" style="display:flex;align-items:center;gap:5px;font-size:.78rem;color:#64748b;margin-bottom:14px">${ICON_PIN}<span>${escapeHtml(p.locationFull)}</span></p>
    ${specsHTML}
  </div>
</a>`;
}

module.exports = { card };
