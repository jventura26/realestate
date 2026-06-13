/**
 * Zona-INNmueble / InmuHub — Admin Worker
 * Cloudflare Workers + KV
 * Deploy: npx wrangler deploy
 */

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin1203';
const SESSION_TTL = 60 * 60 * 8; // 8 horas

// ── Helpers ──────────────────────────────────────────────────────────────────

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

async function requireAuth(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return false;
  const token = match[1];
  const stored = await env.DB.get('session:' + token);
  return stored === 'valid';
}

function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

// ── Admin HTML ────────────────────────────────────────────────────────────────

function getAdminHTML() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin — Zona INNmueble</title>
<style>
  :root {
    --navy: #0D1B3E;
    --orange: #F5820D;
    --steel: #3A6186;
    --light: #F8F9FA;
    --card: #ffffff;
    --text: #1a1a2e;
    --muted: #6c757d;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--navy); color: var(--text); }
  input, button, select, textarea { font-family: inherit; }

  /* ── Login ── */
  .login-wrap { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .login-card { background: white; border-radius: 12px; padding: 48px 40px; width: 100%; max-width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
  .login-logo { color: var(--navy); font-size: 22px; font-weight: 800; margin-bottom: 8px; }
  .login-logo span { color: var(--orange); }
  .login-sub { color: var(--muted); font-size: 13px; margin-bottom: 32px; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--navy); margin-bottom: 6px; }
  .field input { width: 100%; padding: 11px 14px; border: 1.5px solid #e0e0e0; border-radius: 6px; font-size: 14px; transition: border-color .2s; }
  .field input:focus { outline: none; border-color: var(--navy); }
  .btn-primary { width: 100%; padding: 13px; background: var(--navy); color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background .2s; }
  .btn-primary:hover { background: #1a2850; }
  .err-msg { background: #fef2f2; color: #b91c1c; border-radius: 6px; padding: 10px 14px; font-size: 13px; margin-top: 14px; display: none; }

  /* ── Shell ── */
  .shell { display: none; min-height: 100vh; background: #f0f2f5; }
  .topbar { background: var(--navy); padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .topbar-brand { color: white; font-weight: 800; font-size: 16px; }
  .topbar-brand span { color: var(--orange); }
  .topbar-right { display: flex; align-items: center; gap: 16px; }
  .topbar-user { color: rgba(255,255,255,.7); font-size: 13px; }
  .btn-sm { padding: 7px 16px; border-radius: 5px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; }
  .btn-logout { background: rgba(255,255,255,.1); color: white; }
  .btn-logout:hover { background: rgba(255,255,255,.2); }
  .btn-add { background: var(--orange); color: white; }
  .btn-add:hover { background: #e07209; }
  .btn-danger { background: #ef4444; color: white; }
  .btn-edit { background: var(--steel); color: white; }

  /* ── Stats ── */
  .main { max-width: 1200px; margin: 0 auto; padding: 28px 20px; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
  .stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); margin-bottom: 8px; }
  .stat-value { font-size: 32px; font-weight: 800; color: var(--navy); }
  .stat-value.orange { color: var(--orange); }

  /* ── Table ── */
  .table-card { background: white; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.08); overflow: hidden; }
  .table-header { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; }
  .table-title { font-size: 16px; font-weight: 700; color: var(--navy); }
  .search-input { padding: 8px 14px; border: 1.5px solid #e0e0e0; border-radius: 6px; font-size: 13px; width: 220px; }
  .search-input:focus { outline: none; border-color: var(--navy); }
  table { width: 100%; border-collapse: collapse; }
  th { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); padding: 12px 16px; text-align: left; background: #fafafa; border-bottom: 1px solid #f0f0f0; }
  td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid #f8f8f8; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafbff; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .badge-green { background: #dcfce7; color: #166534; }
  .badge-blue { background: #dbeafe; color: #1e40af; }
  .badge-orange { background: #ffedd5; color: #9a3412; }
  .prop-title { font-weight: 600; color: var(--navy); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .prop-price { font-weight: 700; color: var(--orange); }
  .actions { display: flex; gap: 6px; }
  .empty-state { text-align: center; padding: 48px 24px; color: var(--muted); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }

  /* ── Modal ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: none; justify-content: center; align-items: flex-start; padding: 40px 20px; z-index: 200; overflow-y: auto; }
  .modal-overlay.open { display: flex; }
  .modal { background: white; border-radius: 12px; width: 100%; max-width: 580px; padding: 32px; }
  .modal-title { font-size: 18px; font-weight: 800; color: var(--navy); margin-bottom: 24px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-grid .full { grid-column: 1/-1; }
  .form-field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--navy); margin-bottom: 5px; }
  .form-field input, .form-field select, .form-field textarea {
    width: 100%; padding: 10px 12px; border: 1.5px solid #e0e0e0; border-radius: 6px; font-size: 13px; transition: border-color .2s;
  }
  .form-field textarea { resize: vertical; min-height: 80px; }
  .form-field input:focus, .form-field select:focus, .form-field textarea:focus { outline: none; border-color: var(--navy); }
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
  .btn-cancel { background: #f0f2f5; color: var(--text); padding: 11px 20px; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 13px; }
  .btn-save { background: var(--navy); color: white; padding: 11px 24px; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 13px; }
  .btn-save:hover { background: #1a2850; }

  /* ── Toast ── */
  .toast { position: fixed; bottom: 24px; right: 24px; background: #1e293b; color: white; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; transform: translateY(80px); opacity: 0; transition: all .3s; z-index: 300; }
  .toast.show { transform: translateY(0); opacity: 1; }
  .toast.success { border-left: 4px solid #22c55e; }
  .toast.error { border-left: 4px solid #ef4444; }
</style>
</head>
<body>

<!-- LOGIN -->
<div id="loginPage" class="login-wrap">
  <div class="login-card">
    <div class="login-logo"><span>Zona</span>-INNmueble</div>
    <div class="login-sub">Panel de administración</div>
    <div class="field">
      <label>Usuario</label>
      <input type="text" id="loginUser" placeholder="admin" autocomplete="username">
    </div>
    <div class="field">
      <label>Contraseña</label>
      <input type="password" id="loginPass" placeholder="••••••••" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()">
    </div>
    <button class="btn-primary" onclick="doLogin()">Ingresar al panel</button>
    <div class="err-msg" id="loginErr">Usuario o contraseña incorrectos.</div>
  </div>
</div>

<!-- SHELL -->
<div id="adminShell" class="shell">
  <div class="topbar">
    <div class="topbar-brand"><span>Zona</span>-INNmueble Admin</div>
    <div class="topbar-right">
      <span class="topbar-user">Administrador</span>
      <button class="btn-sm btn-add" onclick="openModal()">+ Nueva propiedad</button>
      <button class="btn-sm btn-logout" onclick="doLogout()">Salir</button>
    </div>
  </div>

  <div class="main">
    <div class="stats">
      <div class="stat-card">
        <div class="stat-label">Propiedades</div>
        <div class="stat-value" id="statTotal">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Activas</div>
        <div class="stat-value orange" id="statActivas">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Venta</div>
        <div class="stat-value" id="statVenta">0</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Renta</div>
        <div class="stat-value" id="statRenta">0</div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <div class="table-title">Propiedades</div>
        <input class="search-input" type="text" placeholder="Buscar..." id="searchInput" oninput="renderTable()">
      </div>
      <div id="tableWrap"></div>
    </div>
  </div>
</div>

<!-- MODAL -->
<div class="modal-overlay" id="modalOverlay" onclick="if(event.target===this)closeModal()">
  <div class="modal">
    <div class="modal-title" id="modalTitle">Nueva propiedad</div>
    <div class="form-grid">
      <div class="form-field full">
        <label>Título *</label>
        <input type="text" id="fTitulo" placeholder="Casa residencial en Zona 10">
      </div>
      <div class="form-field">
        <label>Precio (Q o $) *</label>
        <input type="text" id="fPrecio" placeholder="Q 2,500,000">
      </div>
      <div class="form-field">
        <label>Tipo</label>
        <select id="fTipo">
          <option>Casa</option>
          <option>Apartamento</option>
          <option>Finca</option>
          <option>Local comercial</option>
          <option>Terreno</option>
        </select>
      </div>
      <div class="form-field">
        <label>Operación</label>
        <select id="fOperacion">
          <option>Venta</option>
          <option>Renta</option>
          <option>Venta/Renta</option>
        </select>
      </div>
      <div class="form-field">
        <label>Zona / Ubicación</label>
        <input type="text" id="fZona" placeholder="Zona 14, Guatemala">
      </div>
      <div class="form-field">
        <label>Área (m²)</label>
        <input type="text" id="fArea" placeholder="350">
      </div>
      <div class="form-field">
        <label>Habitaciones</label>
        <input type="number" id="fHabitaciones" placeholder="4">
      </div>
      <div class="form-field">
        <label>Baños</label>
        <input type="number" id="fBanos" placeholder="3">
      </div>
      <div class="form-field full">
        <label>URL imagen principal</label>
        <input type="url" id="fImagen" placeholder="https://...">
      </div>
      <div class="form-field full">
        <label>Descripción</label>
        <textarea id="fDescripcion" placeholder="Descripción breve de la propiedad..."></textarea>
      </div>
      <div class="form-field">
        <label>Estado</label>
        <select id="fEstado">
          <option>Activa</option>
          <option>Vendida</option>
          <option>Pausada</option>
        </select>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      <button class="btn-save" onclick="saveProp()">Guardar propiedad</button>
    </div>
  </div>
</div>

<!-- TOAST -->
<div class="toast" id="toast"></div>

<script>
let props = [];
let editingId = null;

// ── Auth ─────────────────────────────────────────────────────────────────────
async function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({user: u, pass: p})
  });
  if (res.ok) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminShell').style.display = 'block';
    loadProps();
  } else {
    const err = document.getElementById('loginErr');
    err.style.display = 'block';
    setTimeout(() => err.style.display = 'none', 3000);
  }
}

async function doLogout() {
  await fetch('/api/logout', {method:'POST'});
  location.reload();
}

async function checkSession() {
  const res = await fetch('/api/me');
  if (res.ok) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminShell').style.display = 'block';
    loadProps();
  }
}

// ── Propiedades ───────────────────────────────────────────────────────────────
async function loadProps() {
  const res = await fetch('/api/propiedades');
  if (res.ok) {
    props = await res.json();
    updateStats();
    renderTable();
  }
}

function updateStats() {
  document.getElementById('statTotal').textContent = props.length;
  document.getElementById('statActivas').textContent = props.filter(p => p.estado === 'Activa').length;
  document.getElementById('statVenta').textContent = props.filter(p => p.operacion === 'Venta' || p.operacion === 'Venta/Renta').length;
  document.getElementById('statRenta').textContent = props.filter(p => p.operacion === 'Renta' || p.operacion === 'Venta/Renta').length;
}

function renderTable() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = props.filter(p =>
    (p.titulo||'').toLowerCase().includes(q) ||
    (p.zona||'').toLowerCase().includes(q) ||
    (p.tipo||'').toLowerCase().includes(q)
  );

  if (!filtered.length) {
    document.getElementById('tableWrap').innerHTML = '<div class="empty-state"><div class="empty-icon">🏠</div><div>No hay propiedades. Agrega la primera.</div></div>';
    return;
  }

  let rows = filtered.map(p => \`
    <tr>
      <td><div class="prop-title" title="\${p.titulo}">\${p.titulo||'—'}</div></td>
      <td class="prop-price">\${p.precio||'—'}</td>
      <td>\${p.zona||'—'}</td>
      <td><span class="badge badge-blue">\${p.tipo||'—'}</span></td>
      <td><span class="badge badge-orange">\${p.operacion||'—'}</span></td>
      <td><span class="badge \${p.estado==='Activa'?'badge-green':'badge-blue'}">\${p.estado||'—'}</span></td>
      <td>
        <div class="actions">
          <button class="btn-sm btn-edit" onclick="editProp('\${p.id}')">Editar</button>
          <button class="btn-sm btn-danger" onclick="deleteProp('\${p.id}')">Eliminar</button>
        </div>
      </td>
    </tr>
  \`).join('');

  document.getElementById('tableWrap').innerHTML = \`
    <table>
      <thead><tr>
        <th>Título</th><th>Precio</th><th>Ubicación</th><th>Tipo</th><th>Operación</th><th>Estado</th><th>Acciones</th>
      </tr></thead>
      <tbody>\${rows}</tbody>
    </table>
  \`;
}

// ── Modal ────────────────────────────────────────────────────────────────────
function openModal(prop) {
  editingId = prop ? prop.id : null;
  document.getElementById('modalTitle').textContent = prop ? 'Editar propiedad' : 'Nueva propiedad';
  document.getElementById('fTitulo').value = prop?.titulo || '';
  document.getElementById('fPrecio').value = prop?.precio || '';
  document.getElementById('fTipo').value = prop?.tipo || 'Casa';
  document.getElementById('fOperacion').value = prop?.operacion || 'Venta';
  document.getElementById('fZona').value = prop?.zona || '';
  document.getElementById('fArea').value = prop?.area || '';
  document.getElementById('fHabitaciones').value = prop?.habitaciones || '';
  document.getElementById('fBanos').value = prop?.banos || '';
  document.getElementById('fImagen').value = prop?.imagen || '';
  document.getElementById('fDescripcion').value = prop?.descripcion || '';
  document.getElementById('fEstado').value = prop?.estado || 'Activa';
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  editingId = null;
}

async function saveProp() {
  const titulo = document.getElementById('fTitulo').value.trim();
  const precio = document.getElementById('fPrecio').value.trim();
  if (!titulo || !precio) { showToast('Título y precio son obligatorios.', 'error'); return; }

  const data = {
    titulo, precio,
    tipo: document.getElementById('fTipo').value,
    operacion: document.getElementById('fOperacion').value,
    zona: document.getElementById('fZona').value,
    area: document.getElementById('fArea').value,
    habitaciones: document.getElementById('fHabitaciones').value,
    banos: document.getElementById('fBanos').value,
    imagen: document.getElementById('fImagen').value,
    descripcion: document.getElementById('fDescripcion').value,
    estado: document.getElementById('fEstado').value,
  };

  const method = editingId ? 'PUT' : 'POST';
  const url = editingId ? '/api/propiedades/' + editingId : '/api/propiedades';
  const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });

  if (res.ok) {
    closeModal();
    showToast(editingId ? 'Propiedad actualizada.' : 'Propiedad creada.', 'success');
    loadProps();
  } else {
    showToast('Error al guardar.', 'error');
  }
}

function editProp(id) {
  const p = props.find(x => x.id === id);
  if (p) openModal(p);
}

async function deleteProp(id) {
  if (!confirm('¿Eliminar esta propiedad?')) return;
  const res = await fetch('/api/propiedades/' + id, { method: 'DELETE' });
  if (res.ok) { showToast('Propiedad eliminada.', 'success'); loadProps(); }
  else showToast('Error al eliminar.', 'error');
}

// ── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Init
checkSession();
</script>
</body>
</html>`;
}

// ── Router ────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // ── Admin UI ──

    // Script para los sitios - publico sin auth
    if (path === '/dynamic-grid.js') {
      const js = `(async function(){
  var API='https://zona-inmu.tours-virtuales-gt.workers.dev/api/public/propiedades';
  async function getProps(){
    try{var ts=parseInt(localStorage.getItem('kv_ts')||'0');if(Date.now()-ts<60000){var c=localStorage.getItem('kv_props');if(c)return JSON.parse(c);}}catch(e){}
    var r=await fetch(API);var data=await r.json();
    try{localStorage.setItem('kv_props',JSON.stringify(data));localStorage.setItem('kv_ts',String(Date.now()));}catch(e){}
    return data;
  }
  function cardZona(p){
    var img=p.mainImageThumb||p.imagen||'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70';
    var badge=p.cinta||p.operacion||'';
    var meta='';
    if(p.habitaciones&&p.habitaciones!=='0')meta+='<span>'+p.habitaciones+' Hab.</span>';
    if(p.banos&&p.banos!=='0')meta+='<span>'+p.banos+' Banos</span>';
    if(p.areaConst)meta+='<span>'+p.areaConst+'</span>';
    return '<a class="prop-card" href="/propiedades/'+(p.slug||p.id)+'.html" data-tipo="'+(p.tipo||'')+'" data-ciudad="'+(p.municipio||'')+'" data-cinta="'+(p.cinta||'')+'" data-precio="'+(p.priceNumeric||0)+'" data-habs="'+(p.habitaciones||0)+'">'
      +'<img referrerpolicy="no-referrer" src="'+img+'" alt="'+(p.titulo||'')+'" loading="lazy">'
      +'<div class="pc-ov"></div>'+(badge?'<span class="pc-badge">'+badge+'</span>':'')
      +'<div class="pc-info"><div class="pc-tipo">'+(p.tipo||'')+' &middot; '+(p.municipio||p.zona||'')+'</div>'
      +'<div class="pc-title">'+(p.titulo||'')+'</div>'+(meta?'<div class="pc-meta">'+meta+'</div>':'')
      +'<div style="display:flex;justify-content:space-between"><div class="pc-price">'+(p.priceFormatted||p.precio||'')+'</div><span class="pc-arr">&rarr;</span></div></div></a>';
  }
  function cardInmu(p){
    var img=p.mainImageThumb||p.imagen||'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70';
    var specs='';
    if(p.habitaciones&&p.habitaciones!=='0')specs+='<span class="cs-item">'+p.habitaciones+' hab.</span>';
    if(p.banos&&p.banos!=='0')specs+='<span class="cs-item">'+p.banos+' ba.</span>';
    if(p.areaConst)specs+='<span class="cs-item">'+p.areaConst+' m2</span>';
    return '<a class="property-card" href="/propiedades/'+(p.slug||p.id)+'.html" data-tipo="'+(p.tipo||'')+'" data-ciudad="'+(p.municipio||'')+'" data-cinta="'+(p.cinta||'')+'" data-precio="'+(p.priceNumeric||0)+'">'
      +'<div class="card-img-wrap"><img referrerpolicy="no-referrer" src="'+img+'" alt="'+(p.titulo||'')+'" loading="lazy">'
      +'<div class="card-badges">'+(p.tipo?'<span class="card-tipo">'+p.tipo+'</span>':'')+(p.cinta?'<span class="card-cinta">'+p.cinta+'</span>':'')+'</div></div>'
      +'<div class="card-body"><div class="card-price">'+(p.priceFormatted||p.precio||'')+'</div>'
      +'<h3 class="card-title">'+(p.titulo||'')+'</h3>'
      +'<p class="card-loc">'+(p.locationFull||p.zona||'')+'</p>'
      +(specs?'<div class="card-specs">'+specs+'</div>':'')+'</div></a>';
  }
  function run(props){
    var isZona=location.hostname.includes('zona-innmueble');
    var fn=isZona?cardZona:cardInmu;
    var grid=document.getElementById('g');
    if(grid){
      var q=(document.getElementById('fq')||{value:''}).value.toLowerCase();
      var ft=(document.getElementById('ft')||{value:''}).value;
      var filtered=props.filter(function(p){
        if(q&&!(p.titulo||'').toLowerCase().includes(q)&&!(p.zona||'').toLowerCase().includes(q))return false;
        if(ft&&p.tipo!==ft)return false;
        return true;
      });
      grid.innerHTML=filtered.length?filtered.map(fn).join(''):'<p style="text-align:center;padding:60px;opacity:.5">No hay propiedades.</p>';
      var cnt=document.getElementById('fc');if(cnt)cnt.textContent=filtered.length+' propiedad'+(filtered.length!==1?'es':'');
      ['fq','ft','fc2','fp','fh'].forEach(function(id){var el=document.getElementById(id);if(el&&!el.__kv){el.__kv=true;el.addEventListener('input',function(){run(props);});}});
      var cl=document.getElementById('cl');if(cl&&!cl.__kv){cl.__kv=true;cl.addEventListener('click',function(){run(props);});}
    } else {
      var hg=document.querySelector('.prop-grid,.property-grid');
      if(hg){hg.innerHTML=props.slice(0,location.hostname.includes('zona-innmueble')?6:9).map(fn).join('');}
    }
    window.__KV_PROPS__=props;
  }
  async function init(){
    try{
      var props=await getProps();
      // Detectar si es pagina de detalle
      var isDetail=location.pathname.includes('/propiedades/') && location.pathname.endsWith('.html');
      if(isDetail){
        var slug=location.pathname.split('/').pop().replace('.html','');
        var prop=props.find(function(p){return p.slug===slug;});
        if(prop){
          // Actualizar titulo
          var t=document.querySelector('.det-title,h1');
          if(t&&prop.titulo)t.textContent=prop.titulo;
          // Actualizar precio
          var pr=document.querySelector('.det-price');
          if(pr&&prop.priceFormatted)pr.textContent=prop.priceFormatted;
          // Actualizar descripcion
          var desc=document.querySelector('.det-desc');
          if(desc&&prop.descripcion)desc.textContent=prop.descripcion;
          // Actualizar titulo pagina
          if(prop.titulo)document.title=prop.titulo+' - Zona INNmueble';
          // Actualizar imagen principal
          var img=document.getElementById('mi');
          if(img&&prop.mainImage)img.src=prop.mainImage;
        }
      } else {
        run(props);
      }
    }catch(e){console.warn('[KV]',e.message);}
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();`;
      return new Response(js, {
        headers: { 'Content-Type': 'application/javascript', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' },
      });
    }

    if (path === '/' || path === '/admin' || path === '/admin/') {
      return html(getAdminHTML());
    }

    // ── Login ──
    if (path === '/api/login' && method === 'POST') {
      const { user, pass } = await request.json();
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        const token = generateToken();
        await env.DB.put('session:' + token, 'valid', { expirationTtl: SESSION_TTL });
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL}`,
          },
        });
      }
      return json({ error: 'Credenciales incorrectas' }, 401);
    }

    // ── Logout ──
    if (path === '/api/logout' && method === 'POST') {
      const cookie = request.headers.get('Cookie') || '';
      const match = cookie.match(/session=([^;]+)/);
      if (match) await env.DB.delete('session:' + match[1]);
      return new Response(JSON.stringify({ ok: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'session=; Path=/; Max-Age=0',
        },
      });
    }

    // ── Check session ──
    if (path === '/api/me') {
      const authed = await requireAuth(request, env);
      return authed ? json({ ok: true }) : json({ error: 'No autorizado' }, 401);
    }


    // API publica para los sitios - sin auth
    if (path === '/api/public/propiedades' && method === 'GET') {
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const pub = data.filter(p => !p.estado || p.estado === 'Activa');
      return new Response(JSON.stringify(pub), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    // ── Propiedades API (requiere auth) ──
    const authed = await requireAuth(request, env);
    if (!authed) return json({ error: 'No autorizado' }, 401);

    // GET /api/propiedades
    if (path === '/api/propiedades' && method === 'GET') {
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      return json(data);
    }

    // POST /api/propiedades
    if (path === '/api/propiedades' && method === 'POST') {
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const newProp = await request.json();
      newProp.id = Date.now().toString();
      newProp.createdAt = new Date().toISOString();
      data.push(newProp);
      await env.DB.put('propiedades', JSON.stringify(data));
      return json(newProp, 201);
    }

    // PUT /api/propiedades/:id
    if (path.startsWith('/api/propiedades/') && method === 'PUT') {
      const id = path.split('/').pop();
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const idx = data.findIndex(p => p.id === id);
      if (idx < 0) return json({ error: 'No encontrado' }, 404);
      const updates = await request.json();
      data[idx] = { ...data[idx], ...updates, id };
      await env.DB.put('propiedades', JSON.stringify(data));
      return json(data[idx]);
    }

    // DELETE /api/propiedades/:id
    if (path.startsWith('/api/propiedades/') && method === 'DELETE') {
      const id = path.split('/').pop();
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const filtered = data.filter(p => p.id !== id);
      await env.DB.put('propiedades', JSON.stringify(filtered));
      return json({ ok: true });
    }

    return json({ error: 'Not found' }, 404);
  },
};
