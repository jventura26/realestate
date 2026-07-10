/**
 * ZONA INNMUEBLE — FASE 1 WORLD-CLASS ENHANCEMENTS
 * Add to any page: <script src="/assets/zona-fase1.js"></script>
 * 
 * Features:
 * 1. Sort dropdown (precio, area, habitaciones)
 * 2. Area filter (extracted from card text)
 * 3. Fullscreen lightbox gallery (detail pages)
 * 4. Mobile sticky CTA bar
 * 5. Skeleton loading animation
 */
(function(){
  // ═══════════════════════════════════════
  // CSS INJECTION
  // ═══════════════════════════════════════
  var css = document.createElement('style');
  css.textContent = [
    '/* SORT & AREA FILTER */',
    '#fs{border-color:rgba(245,130,13,.25)!important;color:#F5820D!important;font-weight:500!important}',
    '/* MOBILE STICKY CTA */',
    '.zi-sticky-cta{display:none;position:fixed;bottom:0;left:0;right:0;z-index:250;background:rgba(13,27,62,.97);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid rgba(245,130,13,.25);padding:10px 4%;gap:8px}',
    '.zi-sticky-cta a{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:12px 8px;font-family:Montserrat,sans-serif;font-size:.65rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;transition:all .3s}',
    '.zi-sticky-cta .zi-scta-wa{background:#25D366;color:#fff;border:none}',
    '.zi-sticky-cta .zi-scta-wa:hover{background:#1ebe5d}',
    '.zi-sticky-cta .zi-scta-call{background:transparent;color:#F5820D;border:1px solid rgba(245,130,13,.25)}',
    '.zi-sticky-cta .zi-scta-call:hover{background:#F5820D;color:#0D1B3E}',
    '@media(max-width:768px){.zi-sticky-cta{display:flex}.wa-float{display:none!important}body{padding-bottom:64px}}',
    '/* FULLSCREEN LIGHTBOX */',
    '.main-img{position:relative;cursor:pointer}',
    '.zi-fs-btn{position:absolute;top:14px;right:14px;background:rgba(13,27,62,.8);color:#fff;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15);opacity:0;transition:opacity .3s;cursor:pointer;z-index:5}',
    '.main-img:hover .zi-fs-btn{opacity:1}',
    '.zi-lightbox{display:none;position:fixed;inset:0;z-index:9999;background:rgba(5,10,20,.96);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);flex-direction:column;align-items:center;justify-content:center}',
    '.zi-lightbox.active{display:flex}',
    '.zi-lb-close{position:absolute;top:20px;right:24px;color:#fff;font-size:28px;cursor:pointer;z-index:10;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);transition:all .3s}',
    '.zi-lb-close:hover{background:rgba(245,130,13,.2);color:#F5820D}',
    '.zi-lb-img{max-width:90vw;max-height:75vh;object-fit:contain;transition:opacity .3s}',
    '.zi-lb-nav{position:absolute;top:50%;transform:translateY(-50%);color:#fff;font-size:32px;cursor:pointer;width:52px;height:52px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);transition:all .3s;user-select:none}',
    '.zi-lb-nav:hover{background:rgba(245,130,13,.2);color:#F5820D}',
    '.zi-lb-prev{left:16px}',
    '.zi-lb-next{right:16px}',
    '.zi-lb-counter{position:absolute;bottom:24px;color:#8A9BB0;font-size:.75rem;letter-spacing:.2em;font-weight:500;font-family:Montserrat,sans-serif}',
    '.zi-lb-thumbs{position:absolute;bottom:56px;display:flex;gap:4px;max-width:90vw;overflow-x:auto;padding:8px}',
    '.zi-lb-thumbs img{width:56px;height:56px;object-fit:cover;opacity:.4;cursor:pointer;transition:all .3s;border:2px solid transparent;flex-shrink:0}',
    '.zi-lb-thumbs img.active{opacity:1;border-color:#F5820D}',
    '.zi-lb-thumbs img:hover{opacity:.8}',
    '@media(max-width:768px){.zi-lb-nav{width:40px;height:40px;font-size:24px}.zi-lb-prev{left:8px}.zi-lb-next{right:8px}.zi-lb-thumbs img{width:44px;height:44px}}',
    '/* FILTER BAR RESPONSIVE FIX */',
    '@media(max-width:480px){.filter-bar select,.filter-bar input{width:100%!important;min-width:0!important}}'
  ].join('\n');
  document.head.appendChild(css);

  // ═══════════════════════════════════════
  // DETECT PAGE TYPE
  // ═══════════════════════════════════════
  var isListingPage = !!document.getElementById('g');
  var isDetailPage = !!document.querySelector('.main-img');

  // ═══════════════════════════════════════
  // 1. LISTING PAGE: SORT + AREA FILTER
  // ═══════════════════════════════════════
  if (isListingPage) {
    var filterBar = document.querySelector('.filter-bar');
    var clearBtn = document.getElementById('cl2');
    
    if (filterBar && clearBtn) {
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

      // Add Sort dropdown
      var sortSelect = document.createElement('select');
      sortSelect.id = 'fs';
      sortSelect.innerHTML = '<option value="">Ordenar</option>'
        + '<option value="price-asc">Precio: menor a mayor</option>'
        + '<option value="price-desc">Precio: mayor a menor</option>'
        + '<option value="area-desc">Area: mayor a menor</option>'
        + '<option value="habs-desc">Habitaciones: mas primero</option>';
      filterBar.insertBefore(sortSelect, clearBtn);

      // Extract area from card text and store as data attribute
      var grid = document.getElementById('g');
      var cards = [].slice.call(grid.querySelectorAll('.prop-card'));
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

      // Price normalization (some prices stored as decimals like 0.144 = Q1,440,000)
      function getPrice(c) {
        var p = parseFloat(c.dataset.precio);
        if (p > 0 && p < 10) p = p * 10000000;
        return p || 0;
      }
      function getArea(c) { return parseFloat(c.dataset.area) || 0; }

      // Override the filter function
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

        // Sort
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

      // Bind events
      ['fa', 'fs'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', runFilters);
          el.addEventListener('input', runFilters);
        }
      });

      // Override existing filters to use our enhanced version
      ['fq', 'ft', 'fc2', 'fc3', 'fp', 'fh'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
          // Clone and replace to remove old listeners
          var newEl = el.cloneNode(true);
          el.parentNode.replaceChild(newEl, el);
          newEl.addEventListener('input', runFilters);
          newEl.addEventListener('change', runFilters);
        }
      });

      // Override clear button
      var newClear = clearBtn.cloneNode(true);
      clearBtn.parentNode.replaceChild(newClear, clearBtn);
      newClear.addEventListener('click', function() {
        ['fq', 'ft', 'fc2', 'fc3', 'fp', 'fh', 'fa', 'fs'].forEach(function(id) {
          var el = document.getElementById(id);
          if (el) el.value = '';
        });
        runFilters();
      });

      // Re-apply URL params
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
    var mainImg = document.querySelector('.main-img');
    var mi = document.getElementById('mi');
    var galMini = document.querySelector('.gal-mini');
    var lbImgs = [];
    var lbIdx = 0;

    // Collect all gallery images
    if (mi) lbImgs.push(mi.src);
    if (galMini) {
      var thumbs = galMini.querySelectorAll('img');
      for (var i = 0; i < thumbs.length; i++) {
        lbImgs.push(thumbs[i].src);
      }
    }

    if (lbImgs.length > 0) {
      // Add fullscreen button to main image
      var fsBtn = document.createElement('div');
      fsBtn.className = 'zi-fs-btn';
      fsBtn.innerHTML = '&#x26F6;';
      fsBtn.title = 'Ver en pantalla completa';
      if (mainImg) mainImg.appendChild(fsBtn);

      // Create lightbox overlay
      var lb = document.createElement('div');
      lb.className = 'zi-lightbox';
      lb.id = 'ziLB';
      lb.innerHTML = '<div class="zi-lb-close">&times;</div>'
        + '<div class="zi-lb-nav zi-lb-prev">&#8249;</div>'
        + '<img class="zi-lb-img" id="ziLBimg" src="" alt="Propiedad">'
        + '<div class="zi-lb-nav zi-lb-next">&#8250;</div>'
        + '<div class="zi-lb-thumbs" id="ziLBthumbs"></div>'
        + '<div class="zi-lb-counter" id="ziLBcnt"></div>';
      document.body.appendChild(lb);

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
        document.getElementById('ziLBimg').src = lbImgs[lbIdx];
        document.getElementById('ziLBcnt').textContent = (lbIdx + 1) + ' / ' + lbImgs.length;
        var tc = document.getElementById('ziLBthumbs');
        tc.innerHTML = '';
        for (var i = 0; i < lbImgs.length; i++) {
          var im = document.createElement('img');
          im.src = lbImgs[i];
          if (i === lbIdx) im.className = 'active';
          (function(idx) { im.onclick = function() { lbIdx = idx; updateLB(); }; })(i);
          tc.appendChild(im);
        }
      }

      // Click handlers
      fsBtn.onclick = function(e) { e.stopPropagation(); openLB(0); };
      if (mainImg) mainImg.addEventListener('click', function(e) {
        if (e.target === fsBtn || fsBtn.contains(e.target)) return;
        openLB(0);
      });
      lb.querySelector('.zi-lb-close').onclick = closeLB;
      lb.querySelector('.zi-lb-prev').onclick = function() { navLB(-1); };
      lb.querySelector('.zi-lb-next').onclick = function() { navLB(1); };

      // Keyboard nav
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

      // Click on lightbox background to close
      lb.addEventListener('click', function(e) {
        if (e.target === lb) closeLB();
      });
    }
  }

  // ═══════════════════════════════════════
  // 3. MOBILE STICKY CTA (ALL PAGES)
  // ═══════════════════════════════════════
  var stickyBar = document.createElement('div');
  stickyBar.className = 'zi-sticky-cta';
  stickyBar.innerHTML = '<a href="https://wa.me/50245542088?text=Hola%2C%20me%20interesa%20una%20propiedad%20de%20Zona%20INNmueble." target="_blank" rel="noopener" class="zi-scta-wa">💬 WhatsApp</a>'
    + '<a href="tel:+50245542088" class="zi-scta-call">📞 Llamar</a>';
  document.body.appendChild(stickyBar);

})();
