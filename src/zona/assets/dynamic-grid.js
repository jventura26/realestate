/**
 * dynamic-grid.js
 * Carga propiedades desde el Worker KV y reemplaza el grid estatico
 * Incluir al final del <body> en index.html y propiedades.html de ambos sitios
 */
(async function () {
  var API = 'https://zona-inmu.tours-virtuales-gt.workers.dev/api/public/propiedades';
  var WA_ZONA = '50245542088';    // <- cambia por tu numero real de zona-innmueble
  var WA_INMU = '50245542088';    // <- cambia por tu numero real de inmuhub

  var isZona = location.hostname.includes('zona-innmueble');
  var WA = isZona ? WA_ZONA : WA_INMU;

  async function fetchProps() {
    var KEY = 'kv_props', TS = 'kv_props_ts';
    try {
      var ts = parseInt(localStorage.getItem(TS) || '0');
      if (Date.now() - ts < 60000) {
        var cached = localStorage.getItem(KEY);
        if (cached) return JSON.parse(cached);
      }
    } catch(e) {}
    var res = await fetch(API);
    var data = await res.json();
    try { localStorage.setItem(KEY, JSON.stringify(data)); localStorage.setItem(TS, Date.now().toString()); } catch(e) {}
    return data;
  }

  function cardZona(p) {
    var img = p.mainImageThumb || p.imagen || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70';
    var badge = p.cinta || p.operacion || '';
    var meta = [];
    if (p.habitaciones && p.habitaciones !== '0') meta.push(p.habitaciones + ' Hab.');
    if (p.banos && p.banos !== '0') meta.push(p.banos + ' Banos');
    if (p.areaConst) meta.push(p.areaConst);
    var waMsg = encodeURIComponent('Hola, me interesa: ' + p.titulo);
    return '<a class="prop-card" href="/propiedades/' + (p.slug || p.id) + '.html"'
      + ' data-tipo="' + (p.tipo||'') + '" data-ciudad="' + (p.municipio||'') + '"'
      + ' data-cinta="' + (p.cinta||'') + '" data-precio="' + (p.priceNumeric||0) + '"'
      + ' data-habs="' + (p.habitaciones||0) + '">'
      + '<img referrerpolicy="no-referrer" src="' + img + '" alt="' + (p.titulo||'') + '" loading="lazy">'
      + '<div class="pc-ov"></div>'
      + (badge ? '<span class="pc-badge' + (badge.toLowerCase()==='renta'?' renta':'') + '">' + badge + '</span>' : '')
      + '<div class="pc-info">'
      + '<div class="pc-tipo">' + (p.tipo||'') + ' · ' + (p.municipio||p.zona||'') + '</div>'
      + '<div class="pc-title">' + (p.titulo||'') + '</div>'
      + (meta.length ? '<div class="pc-meta">' + meta.map(function(m){return '<span>'+m+'</span>';}).join('') + '</div>' : '')
      + '<div style="display:flex;justify-content:space-between;align-items:center">'
      + '<div class="pc-price">' + (p.priceFormatted||p.precio||'') + '</div>'
      + '<span class="pc-arr">→</span>'
      + '</div></div></a>';
  }

  function cardInmuhub(p) {
    var img = p.mainImageThumb || p.imagen || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70';
    var waMsg = encodeURIComponent('Hola, me interesa: ' + p.titulo);
    return '<a class="prop-card" href="/propiedades/' + (p.slug || p.id) + '.html"'
      + ' data-tipo="' + (p.tipo||'') + '" data-ciudad="' + (p.municipio||'') + '"'
      + ' data-cinta="' + (p.cinta||'') + '" data-precio="' + (p.priceNumeric||0) + '"'
      + ' data-habs="' + (p.habitaciones||0) + '">'
      + '<img referrerpolicy="no-referrer" src="' + img + '" alt="' + (p.titulo||'') + '" loading="lazy">'
      + '<div class="pc-ov"></div>'
      + (p.cinta ? '<span class="pc-badge">' + p.cinta + '</span>' : '')
      + '<div class="pc-info">'
      + '<div class="pc-tipo">' + (p.tipo||'') + ' · ' + (p.municipio||p.zona||'') + '</div>'
      + '<div class="pc-title">' + (p.titulo||'') + '</div>'
      + '<div class="pc-price">' + (p.priceFormatted||p.precio||'') + '</div>'
      + '<span class="pc-arr">→</span>'
      + '</div></a>';
  }

  var cardFn = isZona ? cardZona : cardInmuhub;

  function render(props, grid) {
    var q = (document.getElementById('fq') || {value:''}).value.toLowerCase();
    var ft = (document.getElementById('ft') || {value:''}).value;
    var fc = (document.getElementById('fc2') || {value:''}).value;
    var fc3 = (document.getElementById('fc3') || {value:''}).value;
    var fh = (document.getElementById('fh') || {value:''}).value;
    var fsort = (document.getElementById('fsort') || {value:''}).value;
    var fpRaw = (document.getElementById('fp') || {value:''}).value;
    var priceMin = 0, priceMax = Infinity;
    if (fpRaw) {
      var parts = fpRaw.split('-');
      priceMin = parseFloat(parts[0]) || 0;
      priceMax = parts[1] ? (parseFloat(parts[1]) || Infinity) : Infinity;
    }
    var filtered = props.filter(function(p) {
      if (q && !(p.titulo||'').toLowerCase().includes(q) && !(p.zona||'').toLowerCase().includes(q)) return false;
      if (ft && p.tipo !== ft) return false;
      if (fc && p.municipio !== fc) return false;
      if (fc3 && p.cinta !== fc3 && p.operacion !== fc3) return false;
      if (fh && parseInt(p.habitaciones||0) < parseInt(fh)) return false;
      var priceNum = p.priceNumeric || 0;
      if (priceNum > 0 && (priceNum < priceMin || priceNum > priceMax)) return false;
      return true;
    });
    if (fsort === 'price_asc') filtered.sort(function(a,b){ return (a.priceNumeric||0)-(b.priceNumeric||0); });
    else if (fsort === 'price_desc') filtered.sort(function(a,b){ return (b.priceNumeric||0)-(a.priceNumeric||0); });
    else if (fsort === 'newest') filtered.sort(function(a,b){ return (b.createdAt||'').localeCompare(a.createdAt||''); });
    else if (fsort === 'area_desc') filtered.sort(function(a,b){ return (parseFloat(b.area)||0)-(parseFloat(a.area)||0); });
    if (!filtered.length) {
      grid.innerHTML = '<p style="text-align:center;padding:60px;opacity:.5;color:white">No hay propiedades disponibles.</p>';
      var cnt0 = document.getElementById('fc');
      if (cnt0) cnt0.textContent = '0 propiedades';
      return;
    }
    grid.innerHTML = filtered.map(cardFn).join('');
    // actualizar contador si existe
    var cnt = document.getElementById('fc');
    if (cnt) cnt.textContent = filtered.length + ' propiedad' + (filtered.length !== 1 ? 'es' : '');
  }

  window.updatePriceBtn = function() {
    var min = (document.getElementById('fp-min') || {value:''}).value;
    var max = (document.getElementById('fp-max') || {value:''}).value;
    var btn = document.getElementById('price-btn');
    if (!btn) return;
    if (!min && !max) { btn.textContent = 'Precio: Cualquiera \u25be'; return; }
    var fmt = function(n) { return n ? '$' + Number(n).toLocaleString('en-US') : ''; };
    if (min && max) btn.textContent = fmt(min) + ' \u2013 ' + fmt(max) + ' \u25be';
    else if (min) btn.textContent = 'Desde ' + fmt(min) + ' \u25be';
    else btn.textContent = 'Hasta ' + fmt(max) + ' \u25be';
  };

  window.applyPrice = function() {
    var min = (document.getElementById('fp-min') || {value:''}).value;
    var max = (document.getElementById('fp-max') || {value:''}).value;
    var fp = document.getElementById('fp');
    if (fp) {
      fp.value = (min || '0') + '-' + (max || '');
      fp.dispatchEvent(new Event('input', { bubbles: true }));
    }
    var dropdown = document.getElementById('price-dropdown');
    if (dropdown) dropdown.style.display = 'none';
  };

  async function init() {
    var grid = document.getElementById('g');
    if (!grid) return;

    // Skeleton
    grid.innerHTML = '<div style="text-align:center;padding:80px;color:rgba(255,255,255,.4);font-size:14px">Cargando propiedades...</div>';

    try {
      var props = await fetchProps();
      window.__KV_PROPS__ = props;
      window.__renderGrid__ = function() { render(props, grid); };
      render(props, grid);

      // Reconectar filtros existentes
      ['fq','ft','fc2','fc3','fp','fh','fsort'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', function() { render(props, grid); });
      });
      var cl = document.getElementById('cl');
      if (cl) cl.addEventListener('click', function() { render(props, grid); });

    } catch(e) {
      console.warn('[KV Grid] Error:', e.message);
      grid.innerHTML = '';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
