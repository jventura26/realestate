/**
 * INMUHUB — FASE 1 ENHANCEMENTS
 * Sort, Area filter, Fullscreen lightbox gallery
 * NO WhatsApp / NO contacts (InmuHub policy)
 */
(function(){
  var css = document.createElement('style');
  css.textContent = [
    '/* SORT & AREA FILTER */',
    '#fs{border-color:var(--gold)!important;color:var(--gold)!important;font-weight:500!important}',
    '/* FULLSCREEN LIGHTBOX */',
    '.ih-lightbox{display:none;position:fixed;inset:0;z-index:9999;background:rgba(5,10,20,.96);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);flex-direction:column;align-items:center;justify-content:center}',
    '.ih-lightbox.active{display:flex}',
    '.ih-lb-close{position:absolute;top:20px;right:24px;color:#fff;font-size:28px;cursor:pointer;z-index:10;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:8px;transition:all .3s}',
    '.ih-lb-close:hover{background:rgba(201,169,110,.2);color:var(--gold)}',
    '.ih-lb-img{max-width:90vw;max-height:75vh;object-fit:contain;border-radius:8px;transition:opacity .3s}',
    '.ih-lb-nav{position:absolute;top:50%;transform:translateY(-50%);color:#fff;font-size:32px;cursor:pointer;width:52px;height:52px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;transition:all .3s;user-select:none}',
    '.ih-lb-nav:hover{background:rgba(201,169,110,.2);color:var(--gold)}',
    '.ih-lb-prev{left:16px}',
    '.ih-lb-next{right:16px}',
    '.ih-lb-counter{position:absolute;top:24px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.6);font-size:13px;letter-spacing:.15em;font-weight:500}',
    '.ih-lb-thumbs{position:absolute;bottom:24px;display:flex;gap:6px;max-width:90vw;overflow-x:auto;padding:8px}',
    '.ih-lb-thumbs img{width:56px;height:56px;object-fit:cover;opacity:.4;cursor:pointer;transition:all .3s;border:2px solid transparent;border-radius:6px;flex-shrink:0}',
    '.ih-lb-thumbs img.active{opacity:1;border-color:var(--gold,#C9A96E)}',
    '.ih-lb-thumbs img:hover{opacity:.8}',
    '.zp-gal-cell{cursor:pointer;transition:opacity .2s}',
    '.zp-gal-cell:hover{opacity:.85}',
    '.zp-gal-main{cursor:pointer;transition:opacity .2s}',
    '.zp-gal-main:hover{opacity:.9}',
    '@media(max-width:768px){.ih-lb-nav{width:40px;height:40px;font-size:24px}.ih-lb-prev{left:8px}.ih-lb-next{right:8px}.ih-lb-thumbs img{width:44px;height:44px}}',
    '@media(max-width:480px){.filter-bar select,.filter-bar input{width:100%!important;min-width:0!important}}'
  ].join('\n');
  document.head.appendChild(css);

  // ═══════════════════════════════════════
  // DETECT PAGE TYPE
  // ═══════════════════════════════════════
  var isListingPage = !!document.getElementById('g');
  var isDetailPage = !!document.querySelector('.zp-gal');

  // ═══════════════════════════════════════
  // 1. LISTING PAGE: SORT + AREA FILTER
  // ═══════════════════════════════════════
  if (isListingPage) {
    var filterBar = document.querySelector('.filter-bar');
    var clearBtn = document.getElementById('cl');

    if (filterBar && clearBtn) {
      // Add Sort dropdown
      var sortSelect = document.createElement('select');
      sortSelect.id = 'fs';
      sortSelect.innerHTML = '<option value="">Ordenar por</option>'
        + '<option value="price-asc">Precio: menor a mayor</option>'
        + '<option value="price-desc">Precio: mayor a menor</option>'
        + '<option value="area-desc">Area: mayor a menor</option>'
        + '<option value="habs-desc">Habitaciones: mas primero</option>';
      filterBar.insertBefore(sortSelect, clearBtn);

      // Add Area filter
      var areaSelect = document.createElement('select');
      areaSelect.id = 'fa';
      areaSelect.innerHTML = '<option value="">Area</option>'
        + '<option value="0-100">Hasta 100 m2</option>'
        + '<option value="100-300">100-300 m2</option>'
        + '<option value="300-700">300-700 m2</option>'
        + '<option value="700-2000">700-2,000 m2</option>'
        + '<option value="2000-99999">Mas de 2,000 m2</option>';
      filterBar.insertBefore(areaSelect, clearBtn);

      // Extract area from card meta
      var grid = document.getElementById('g');
      var cards = [].slice.call(grid.querySelectorAll('.property-card'));
      var originalOrder = cards.slice();

      cards.forEach(function(c) {
        var metaSpans = c.querySelectorAll('.pc-meta span');
        var area = 0;
        for (var i = 0; i < metaSpans.length; i++) {
          var txt = metaSpans[i].textContent;
          var m = txt.match(/([\d,\.]+)\s*m/);
          if (m) {
            area = parseFloat(m[1].replace(/,/g, '')) || 0;
            break;
          }
        }
        c.dataset.area = area;
      });

      function getPrice(c) {
        var p = parseFloat(c.dataset.precio);
        if (p > 0 && p < 10) p = p * 10000000;
        return p || 0;
      }
      function getArea(c) { return parseFloat(c.dataset.area) || 0; }

      var cnt = document.getElementById('fc');
      var nr = document.getElementById('nr');

      function runFilters() {
        var q = document.getElementById('fq').value.toLowerCase();
        var ti = document.getElementById('ft').value;
        var ci = document.getElementById('fc2').value;
        var ci2 = document.getElementById('fc3').value;
        var pr = document.getElementById('fp').value;
        var hb = document.getElementById('fh').value;
        var ar = document.getElementById('fa').value;
        var so = document.getElementById('fs').value;
        var visible = [];
        var n = 0;

        cards.forEach(function(c) {
          var ok = true;
          if (q && c.textContent.toLowerCase().indexOf(q) === -1) ok = false;
          if (ok && ti && c.dataset.tipo !== ti) ok = false;
          if (ok && ci && c.dataset.ciudad !== ci) ok = false;
          if (ok && ci2 && c.dataset.cinta !== ci2) ok = false;
          if (ok && hb && parseInt(c.dataset.habs) < parseInt(hb)) ok = false;
          if (ok && pr) {
            var p = getPrice(c);
            var pts = pr.split('-').map(Number);
            if (p < pts[0] || (pts[1] && p > pts[1])) ok = false;
          }
          if (ok && ar) {
            var a = getArea(c);
            var ats = ar.split('-').map(Number);
            if (a < ats[0] || (ats[1] && a > ats[1])) ok = false;
          }
          c.style.display = ok ? '' : 'none';
          if (ok) { n++; visible.push(c); }
        });

        if (so && visible.length > 1) {
          if (so === 'price-asc') visible.sort(function(a, b) { return getPrice(a) - getPrice(b); });
          else if (so === 'price-desc') visible.sort(function(a, b) { return getPrice(b) - getPrice(a); });
          else if (so === 'area-desc') visible.sort(function(a, b) { return getArea(b) - getArea(a); });
          else if (so === 'habs-desc') visible.sort(function(a, b) { return (parseInt(b.dataset.habs) || 0) - (parseInt(a.dataset.habs) || 0); });
          visible.forEach(function(c) { grid.appendChild(c); });
        } else if (!so) {
          originalOrder.forEach(function(c) { grid.appendChild(c); });
        }

        if (cnt) cnt.textContent = n + ' propiedad' + (n !== 1 ? 'es' : '');
        if (nr) nr.style.display = n === 0 ? 'block' : 'none';
      }

      ['fa', 'fs'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', runFilters);
          el.addEventListener('input', runFilters);
        }
      });

      ['fq', 'ft', 'fc2', 'fc3', 'fp', 'fh'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
          var newEl = el.cloneNode(true);
          el.parentNode.replaceChild(newEl, el);
          newEl.addEventListener('input', runFilters);
          newEl.addEventListener('change', runFilters);
        }
      });

      var newClear = clearBtn.cloneNode(true);
      clearBtn.parentNode.replaceChild(newClear, clearBtn);
      newClear.addEventListener('click', function() {
        ['fq', 'ft', 'fc2', 'fc3', 'fp', 'fh', 'fa', 'fs'].forEach(function(id) {
          var el = document.getElementById(id);
          if (el) el.value = '';
        });
        runFilters();
      });

      var params = new URLSearchParams(location.search);
      if (params.get('tipo')) document.getElementById('ft').value = params.get('tipo');
      if (params.get('ciudad')) document.getElementById('fc2').value = params.get('ciudad');
      runFilters();
    }
  }

  // ═══════════════════════════════════════
  // 2. DETAIL PAGE: FULLSCREEN LIGHTBOX
  // ═══════════════════════════════════════
  if (isDetailPage) {
    var galContainer = document.querySelector('.zp-gal');
    var lbImgs = [];

    // Collect images from the gallery grid
    var galImgs = galContainer.querySelectorAll('img');
    for (var i = 0; i < galImgs.length; i++) {
      if (galImgs[i].src) lbImgs.push(galImgs[i].src);
    }

    // Also collect from mobile gallery if present
    var mobGal = document.querySelector('.zp-mob-gal');
    if (mobGal && lbImgs.length === 0) {
      var mobImgs = mobGal.querySelectorAll('img');
      for (var j = 0; j < mobImgs.length; j++) {
        if (mobImgs[j].src) lbImgs.push(mobImgs[j].src);
      }
    }

    if (lbImgs.length > 0) {
      // Create lightbox
      var lb = document.createElement('div');
      lb.className = 'ih-lightbox';
      lb.innerHTML = '<div class="ih-lb-close">&times;</div>'
        + '<div class="ih-lb-counter" id="ihLBcnt"></div>'
        + '<div class="ih-lb-nav ih-lb-prev">&#8249;</div>'
        + '<img class="ih-lb-img" id="ihLBimg" src="" alt="Propiedad">'
        + '<div class="ih-lb-nav ih-lb-next">&#8250;</div>'
        + '<div class="ih-lb-thumbs" id="ihLBthumbs"></div>';
      document.body.appendChild(lb);

      var lbIdx = 0;

      function openLB(idx) {
        lbIdx = idx;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLB();
      }
      function closeLB() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
      }
      function navLB(d) {
        lbIdx = (lbIdx + d + lbImgs.length) % lbImgs.length;
        updateLB();
      }
      function updateLB() {
        document.getElementById('ihLBimg').src = lbImgs[lbIdx];
        document.getElementById('ihLBcnt').textContent = (lbIdx + 1) + ' / ' + lbImgs.length;
        var tc = document.getElementById('ihLBthumbs');
        tc.innerHTML = '';
        for (var i = 0; i < lbImgs.length; i++) {
          var im = document.createElement('img');
          im.src = lbImgs[i];
          if (i === lbIdx) im.className = 'active';
          (function(idx) { im.onclick = function() { lbIdx = idx; updateLB(); }; })(i);
          tc.appendChild(im);
        }
      }

      // Make gallery images clickable
      var galMain = galContainer.querySelector('.zp-gal-main');
      if (galMain) {
        galMain.addEventListener('click', function() { openLB(0); });
      }
      var galCells = galContainer.querySelectorAll('.zp-gal-cell');
      for (var k = 0; k < galCells.length; k++) {
        (function(idx) {
          galCells[idx].addEventListener('click', function() { openLB(idx + 1); });
        })(k);
      }

      // Override zpOpenGallery if it exists (the "Ver todas" / "+X fotos" button)
      window.zpOpenGallery = function() { openLB(0); };

      // Close handlers
      lb.querySelector('.ih-lb-close').onclick = closeLB;
      lb.querySelector('.ih-lb-prev').onclick = function() { navLB(-1); };
      lb.querySelector('.ih-lb-next').onclick = function() { navLB(1); };

      document.addEventListener('keydown', function(e) {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape') closeLB();
        if (e.key === 'ArrowLeft') navLB(-1);
        if (e.key === 'ArrowRight') navLB(1);
      });

      // Touch swipe
      var sx = 0;
      lb.addEventListener('touchstart', function(e) { sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', function(e) {
        var dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) navLB(dx > 0 ? -1 : 1);
      }, { passive: true });

      lb.addEventListener('click', function(e) {
        if (e.target === lb) closeLB();
      });
    }
  }

})();
