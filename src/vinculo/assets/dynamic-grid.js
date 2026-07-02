/**
 * dynamic-grid.js
 * Carga propiedades desde el Worker KV y reemplaza el grid estatico
 * Incluir al final del <body> en index.html y propiedades.html
 */
(async function () {
  var API = 'https://zona-inmu.tours-virtuales-gt.workers.dev/api/public/propiedades';
  var WA_ZONA = '';
  var WA_INMU = '';

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

  function cintaClass(cinta) {
    if (!cinta) return '';
    var c = cinta.toLowerCase().replace(/\s+/g, '-');
    if (c === 'renta') return 'renta';
    if (c === 'venta') return 'venta';
    if (c === 'nueva' || c === 'nuevo') return 'nueva';
    if (c.includes('precio') || c.includes('reducido')) return 'precio-reducido';
    return '';
  }

  function buildCard(p) {
    var img = p.mainImageThumb || p.imagen || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70';
    var tipo = p.tipo || '';
    var municipio = p.municipio || p.zona || '';
    var cinta = p.cinta || p.operacion || '';
    var cc = cintaClass(cinta);
    var meta = [];
    if (p.habitaciones && p.habitaciones !== '0') meta.push(p.habitaciones + ' Hab.');
    if (p.banos && p.banos !== '0') meta.push(p.banos + ' Ba\u00f1os');
    if (p.areaConst) meta.push(p.areaConst);
    var metaHtml = meta.length
      ? '<div class="pc-meta">' + meta.map(function(m){return '<span>'+m+'</span>';}).join('<span style="color:#d1d5db">&#183;</span>') + '</div>'
      : '';
    var badgeRight = cinta ? '<span class="pc-badge ' + cc + '">' + cinta + '</span>' : '';
    return '<a class="prop-card" href="/propiedades/' + (p.slug || p.id) + '.html"'
      + ' data-tipo="' + tipo + '" data-ciudad="' + municipio + '"'
      + ' data-cinta="' + cinta + '" data-precio="' + (p.priceNumeric || 0) + '"'
      + ' data-habs="' + (p.habitaciones || 0) + '">'
      + '<div class="pc-img">'
      + '<img referrerpolicy="no-referrer" src="' + img + '" alt="' + (p.titulo || '') + '" loading="lazy">'
      + '<div class="pc-badges">'
      + (tipo ? '<span class="pc-badge">' + tipo + '</span>' : '')
      + badgeRight
      + '</div>'
      + '</div>'
      + '<div class="pc-info">'
      + '<div class="pc-price">' + (p.priceFormatted || p.precio || '') + '</div>'
      + '<div class="pc-title">' + (p.titulo || '') + '</div>'
      + (municipio ? '<div class="pc-tipo">' + (tipo ? tipo + ' · ' : '') + municipio + '</div>' : '')
      + metaHtml
      + '</div>'
      + '</a>';
  }

  function render(props, grid) {
    var q = (document.getElementById('fq') || {value:''}).value.toLowerCase();
    var ft = (document.getElementById('ft') || {value:''}).value;
    var fc = (document.getElementById('fc2') || {value:''}).value;
    var filtered = props.filter(function(p) {
      if (q && !(p.titulo||'').toLowerCase().includes(q) && !(p.zona||'').toLowerCase().includes(q)) return false;
      if (ft && p.tipo !== ft) return false;
      if (fc && p.municipio !== fc) return false;
      return true;
    });
    if (!filtered.length) {
      grid.innerHTML = '<p style="text-align:center;padding:60px;opacity:.5;color:var(--gray-400)">No hay propiedades disponibles.</p>';
      return;
    }
    grid.innerHTML = filtered.map(buildCard).join('');
    var cnt = document.getElementById('fc');
    if (cnt) cnt.textContent = filtered.length + ' propiedad' + (filtered.length !== 1 ? 'es' : '');
  }

  async function init() {
    var grid = document.getElementById('g');
    if (!grid) return;
    grid.innerHTML = '<div style="text-align:center;padding:80px;color:rgba(0,0,0,.25);font-size:14px">Cargando propiedades…</div>';
    try {
      var props = await fetchProps();
      window.__KV_PROPS__ = props;
      window.__renderGrid__ = function() { render(props, grid); };
      render(props, grid);
      ['fq','ft','fc2','fc3','fp','fh'].forEach(function(id) {
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
