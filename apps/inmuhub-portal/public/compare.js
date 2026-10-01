// Comparador de proyectos: guarda hasta 3 proyectos elegidos en este navegador.
(function () {
  var KEY = 'inmu_compare';
  var MAX = 3;
  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(v) ? v.filter(function (s) { return typeof s === 'string'; }).slice(0, MAX) : [];
    } catch (e) { return []; }
  }
  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* sin almacenamiento: solo esta página */ }
    state = list;
  }
  var state = read();
  var bar = document.getElementById('compare-bar');
  var count = document.getElementById('compare-count');
  var go = document.getElementById('compare-go');
  var clear = document.getElementById('compare-clear');

  function render() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-compare]'), function (b) {
      var on = state.indexOf(b.getAttribute('data-compare')) !== -1;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      var label = b.querySelector('span');
      if (label) label.textContent = on ? 'En comparación' : 'Comparar';
    });
    if (!bar) return;
    bar.hidden = state.length === 0;
    if (count) count.textContent = state.length + (state.length === 1 ? ' proyecto elegido' : ' proyectos elegidos') + (state.length < 2 ? ' · elija otro' : '');
    if (go) {
      go.href = '/comparar?p=' + state.map(encodeURIComponent).join(',');
      go.classList.toggle('is-disabled', state.length < 2);
    }
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-compare]');
    if (!b) return;
    e.preventDefault();
    var slug = b.getAttribute('data-compare');
    var list = state.slice();
    var i = list.indexOf(slug);
    if (i !== -1) list.splice(i, 1);
    else {
      if (list.length >= MAX) list.shift();
      list.push(slug);
    }
    write(list);
    render();
  });
  if (clear) clear.addEventListener('click', function () { write([]); render(); });

  // En /comparar sin parámetros, usa la selección guardada.
  if (location.pathname === '/comparar' && !location.search && state.length >= 2) {
    location.replace('/comparar?p=' + state.map(encodeURIComponent).join(','));
    return;
  }
  render();
})();
