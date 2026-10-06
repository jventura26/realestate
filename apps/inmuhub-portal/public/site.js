// inmuhub: comportamiento común a todas las páginas del portal.
(function () {
  // Encabezado: si hay sesión, "Ingresar" pasa a "Mi cuenta" con la inicial de la persona.
  var login = document.querySelector('.header-login');
  if (login && !/^\/(ingresar|registro|recuperar|restablecer)/.test(location.pathname)) {
    fetch('/api/sesion', { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (s) {
        if (!s || !s.sesion) return;
        var name = String(s.nombre || '').slice(0, 18);
        login.href = '/mi-cuenta';
        login.classList.add('is-in');
        login.setAttribute('aria-label', 'Mi cuenta' + (name ? ' de ' + name : ''));
        login.textContent = '';
        var av = document.createElement('span');
        av.className = 'header-avatar';
        av.textContent = (name.charAt(0) || '·').toUpperCase();
        var label = document.createElement('span');
        label.className = 'only-desktop';
        label.textContent = name || 'Mi cuenta';
        login.appendChild(av);
        login.appendChild(label);
        var menuLink = document.querySelector('.menu-panel a[href="/ingresar"]');
        if (menuLink) { menuLink.href = '/mi-cuenta'; menuLink.textContent = 'Mi cuenta'; }
      })
      .catch(function () {});
  }
})();

// Mapa aproximado de la ficha: Leaflet se carga solo cuando el mapa está por entrar en pantalla.
(function () {
  var box = document.querySelector('[data-map]');
  if (!box) return;
  var started = false;
  function load() {
    if (started) return;
    started = true;
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/vendor/leaflet/leaflet.css';
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = '/vendor/leaflet/leaflet.js';
    js.onload = draw;
    document.head.appendChild(js);
  }
  function draw() {
    var L = window.L;
    if (!L) return;
    var lat = parseFloat(box.dataset.lat), lng = parseFloat(box.dataset.lng), r = parseFloat(box.dataset.r) || 600;
    box.innerHTML = '';
    var map = L.map(box, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, zoomControl: true, attributionControl: true }).setView([lat, lng], r > 1000 ? 13 : 15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    }).addTo(map);
    var circle = L.circle([lat, lng], { radius: r, color: '#0F1B2D', weight: 1.5, fillColor: '#C9A86A', fillOpacity: 0.28 }).addTo(map);
    map.fitBounds(L.latLng(lat, lng).toBounds(r * 2.4), { maxZoom: 15 });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); load(); }
    }, { rootMargin: '400px' });
    io.observe(box);
  } else load();
})();
