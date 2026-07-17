const { layout } = require('./layout');

function dashboardAsesorPage() {
  const body = `
<style>
.dash-login{max-width:420px;margin:80px auto;padding:48px 40px;background:white;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.06);border:1.5px solid #eef0f3}
.dash-login h2{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.8rem;font-weight:300;color:#0a1628;margin:0 0 8px;text-align:center}
.dash-login p{font-size:13px;color:#94a3b8;text-align:center;margin-bottom:28px}
.dash-field{margin-bottom:16px}
.dash-field label{display:block;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:6px}
.dash-field input,.dash-field textarea,.dash-field select{width:100%;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;font-family:inherit;background:#fafbfc;transition:all .3s;box-sizing:border-box}
.dash-field input:focus,.dash-field textarea:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,169,110,.12);background:white}
.dash-btn{display:block;width:100%;padding:14px;background:var(--gold);color:#0a1628;font-size:14px;font-weight:700;border:none;border-radius:10px;cursor:pointer;transition:all .3s}
.dash-btn:hover{opacity:.88}
.dash-btn:disabled{opacity:.5;cursor:not-allowed}
.dash-msg{margin-top:16px;padding:12px 16px;border-radius:10px;font-size:13px;display:none}
.dash-msg.error{display:block;background:#fef2f2;color:#991b1b;border:1px solid #fecaca}

/* Dashboard layout */
.dash-container{max-width:1200px;margin:0 auto;padding:32px 6%}
.dash-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;flex-wrap:wrap;gap:16px}
.dash-header h1{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.8rem;font-weight:300;color:#0a1628;margin:0}
.dash-header-actions{display:flex;gap:12px;align-items:center}
.dash-logout{background:none;border:1.5px solid #e2e8f0;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;color:#64748b;cursor:pointer;transition:all .2s}
.dash-logout:hover{border-color:#ef4444;color:#ef4444}
.dash-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:40px}
.dash-stat{background:white;border-radius:16px;padding:28px 24px;border:1.5px solid #eef0f3;text-align:center}
.dash-stat-val{font-size:2rem;font-weight:800;color:#0a1628}
.dash-stat-label{font-size:12px;color:#94a3b8;margin-top:4px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.dash-plan-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.dash-plan-free{background:#f1f5f9;color:#64748b}
.dash-plan-pro{background:rgba(201,169,110,.12);color:#8B6914}
.dash-plan-premium{background:#0a1628;color:var(--gold)}
.dash-section{margin-bottom:40px}
.dash-section-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.dash-section-title{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}
.dash-add-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:var(--gold);color:#0a1628;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s}
.dash-add-btn:hover{opacity:.85}
.dash-props-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.dash-prop-card{background:white;border-radius:14px;overflow:hidden;border:1.5px solid #eef0f3;transition:all .3s}
.dash-prop-card:hover{border-color:var(--gold);box-shadow:0 8px 30px rgba(0,0,0,.08)}
.dash-prop-img{width:100%;height:180px;object-fit:cover;display:block}
.dash-prop-body{padding:20px}
.dash-prop-title{font-size:15px;font-weight:700;color:#0a1628;margin:0 0 6px}
.dash-prop-price{font-size:14px;font-weight:800;color:var(--gold);margin-bottom:8px}
.dash-prop-actions{display:flex;gap:8px;margin-top:12px}
.dash-prop-actions button{flex:1;padding:8px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;border:none}
.dash-edit-btn{background:#f1f5f9;color:#374151}
.dash-edit-btn:hover{background:#e2e8f0}
.dash-del-btn{background:#fef2f2;color:#ef4444}
.dash-del-btn:hover{background:#fee2e2}
.dash-empty{text-align:center;padding:60px 20px;color:#94a3b8}

/* Property modal */
.dash-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:none;align-items:flex-start;justify-content:center;padding:40px 20px;overflow-y:auto}
.dash-modal-overlay.open{display:flex}
.dash-modal{background:white;border-radius:20px;max-width:640px;width:100%;padding:40px;position:relative}
.dash-modal h3{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.5rem;font-weight:300;margin:0 0 24px}
.dash-modal-close{position:absolute;top:16px;right:20px;background:none;border:none;font-size:24px;cursor:pointer;color:#94a3b8}
</style>

<!-- LOGIN VIEW -->
<div id="loginView" style="padding:40px 6%;background:#f8f9fb;min-height:80vh">
  <div class="dash-login">
    <h2>Dashboard de Asesor</h2>
    <p>Inicia sesi&oacute;n para administrar tus propiedades</p>
    <form onsubmit="return handleLogin(event)">
      <div class="dash-field">
        <label>Email</label>
        <input type="email" id="loginEmail" required placeholder="tu@email.com">
      </div>
      <div class="dash-field">
        <label>Contrase&ntilde;a</label>
        <input type="password" id="loginPass" required placeholder="Tu contrase&ntilde;a">
      </div>
      <button type="submit" class="dash-btn" id="loginBtn">Iniciar sesi&oacute;n</button>
    </form>
    <div id="loginMsg" class="dash-msg"></div>
    <div style="text-align:center;margin-top:20px">
      <p style="font-size:13px;color:#94a3b8">&iquest;No tienes cuenta? <a href="/registro-asesor.html" style="color:var(--gold);font-weight:600;text-decoration:none">Reg&iacute;strate aqu&iacute;</a></p>
    </div>
  </div>
</div>

<!-- DASHBOARD VIEW -->
<div id="dashView" style="display:none;padding:32px 0;background:#f8f9fb;min-height:80vh">
  <div class="dash-container">
    <div class="dash-header">
      <div>
        <h1>Hola, <span id="dashNombre"></span></h1>
        <span id="dashPlanBadge" class="dash-plan-badge"></span>
      </div>
      <div class="dash-header-actions">
        <a href="" id="dashProfileLink" target="_blank" style="font-size:13px;color:var(--gold);font-weight:600;text-decoration:none">Ver mi perfil p&uacute;blico &#8594;</a>
        <button class="dash-logout" onclick="doLogout()">Cerrar sesi&oacute;n</button>
      </div>
    </div>

    <div class="dash-stats">
      <div class="dash-stat">
        <div class="dash-stat-val" id="statProps">0</div>
        <div class="dash-stat-label">Propiedades</div>
      </div>
      <div class="dash-stat">
        <div class="dash-stat-val" id="statLimit">2</div>
        <div class="dash-stat-label">L&iacute;mite del plan</div>
      </div>
      <div class="dash-stat">
        <div class="dash-stat-val" id="statViews">0</div>
        <div class="dash-stat-label">Vistas de perfil</div>
      </div>
      <div class="dash-stat">
        <div class="dash-stat-val" id="statClicks">0</div>
        <div class="dash-stat-label">Clicks WhatsApp</div>
      </div>
    </div>

    <div class="dash-section">
      <div class="dash-section-head">
        <span class="dash-section-title">Mis propiedades</span>
        <button class="dash-add-btn" id="addPropBtn" onclick="openPropModal()">+ Nueva propiedad</button>
      </div>
      <div id="dashPropsGrid" class="dash-props-grid"></div>
      <div id="dashPropsEmpty" class="dash-empty" style="display:none">
        <p style="font-size:16px;margin-bottom:8px">No tienes propiedades publicadas a&uacute;n</p>
        <p style="font-size:13px">Haz click en &ldquo;Nueva propiedad&rdquo; para comenzar.</p>
      </div>
    </div>

    <div style="text-align:center;padding:20px;border-top:1px solid #eef0f3;margin-top:20px">
      <p style="font-size:12px;color:#94a3b8">&iquest;Necesitas m&aacute;s propiedades? <a href="/planes.html" style="color:var(--gold);font-weight:600;text-decoration:none">Actualiza tu plan</a></p>
    </div>
  </div>
</div>

<!-- PROPERTY MODAL -->
<div class="dash-modal-overlay" id="propModal">
  <div class="dash-modal">
    <button class="dash-modal-close" onclick="closePropModal()">&times;</button>
    <h3 id="propModalTitle">Nueva propiedad</h3>
    <form onsubmit="return handleSaveProp(event)">
      <div class="dash-field">
        <label>T&iacute;tulo *</label>
        <input type="text" id="propTitulo" required placeholder="Ej: Casa moderna en Zona 15">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="dash-field">
          <label>Precio</label>
          <input type="text" id="propPrecio" placeholder="Ej: US$ 350,000">
        </div>
        <div class="dash-field">
          <label>Tipo</label>
          <select id="propTipo" style="width:100%;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;background:#fafbfc">
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Terreno">Terreno</option>
            <option value="Finca">Finca</option>
            <option value="Oficina">Oficina</option>
            <option value="Local Comercial">Local Comercial</option>
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div class="dash-field">
          <label>Habitaciones</label>
          <input type="number" id="propHabs" placeholder="3">
        </div>
        <div class="dash-field">
          <label>Ba&ntilde;os</label>
          <input type="number" id="propBanos" placeholder="2">
        </div>
        <div class="dash-field">
          <label>&Aacute;rea (m&sup2;)</label>
          <input type="text" id="propArea" placeholder="250">
        </div>
      </div>
      <div class="dash-field">
        <label>Zona / Ubicaci&oacute;n</label>
        <input type="text" id="propZona" placeholder="Zona 15, Ciudad de Guatemala">
      </div>
      <div class="dash-field">
        <label>Descripci&oacute;n</label>
        <textarea id="propDesc" style="min-height:100px;width:100%;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;font-family:inherit;background:#fafbfc;resize:vertical;box-sizing:border-box" placeholder="Describe la propiedad..."></textarea>
      </div>
      <div class="dash-field">
        <label>URL imagen principal</label>
        <input type="url" id="propImagen" placeholder="https://...">
      </div>
      <input type="hidden" id="propEditId" value="">
      <button type="submit" class="dash-btn" id="propSaveBtn">Publicar propiedad</button>
    </form>
    <div id="propMsg" class="dash-msg" style="margin-top:12px"></div>
  </div>
</div>

<script>
(function(){
  var API = 'https://zona-inmu.tours-virtuales-gt.workers.dev';
  var token = localStorage.getItem('broker_token');
  var brokerData = null;
  var myProps = [];

  function headers() { return {'Content-Type':'application/json','Authorization':'Bearer '+token}; }

  // Check session on load
  if (token) { loadDashboard(); } else { showLogin(); }

  function showLogin() {
    document.getElementById('loginView').style.display = '';
    document.getElementById('dashView').style.display = 'none';
  }
  function showDash() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('dashView').style.display = '';
  }

  window.handleLogin = function(e) {
    e.preventDefault();
    var btn = document.getElementById('loginBtn');
    var msg = document.getElementById('loginMsg');
    btn.disabled = true; btn.textContent = 'Ingresando...';
    msg.style.display = 'none';
    fetch(API+'/api/broker/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email:document.getElementById('loginEmail').value.trim(), password:document.getElementById('loginPass').value})
    })
    .then(function(r){return r.json();})
    .then(function(d){
      btn.disabled=false; btn.textContent='Iniciar sesión';
      if(d.ok && d.token){
        token = d.token;
        localStorage.setItem('broker_token', token);
        loadDashboard();
      } else {
        msg.className='dash-msg error'; msg.textContent=d.error||'Error'; msg.style.display='block';
      }
    })
    .catch(function(err){ btn.disabled=false; btn.textContent='Iniciar sesión'; msg.className='dash-msg error'; msg.textContent='Error de conexión. Intenta de nuevo.'; msg.style.display='block'; console.error('Login error:', err); });
    return false;
  };

  function loadDashboard() {
    fetch(API+'/api/broker/me', {headers:headers()})
    .then(function(r){ if(r.status===401){localStorage.removeItem('broker_token');token=null;showLogin();throw 'auth';} return r.json(); })
    .then(function(d){
      brokerData = d;
      document.getElementById('dashNombre').textContent = d.nombre.split(' ')[0];
      var badge = document.getElementById('dashPlanBadge');
      badge.textContent = (d.plan||'free').toUpperCase();
      badge.className = 'dash-plan-badge dash-plan-'+(d.plan||'free');
      document.getElementById('dashProfileLink').href = '/asesores/'+(d.slug||'')+'.html';
      document.getElementById('statProps').textContent = d.propiedades_count;
      document.getElementById('statLimit').textContent = d.propiedades_limit >= 999 ? '∞' : d.propiedades_limit;
      document.getElementById('statViews').textContent = d.stats ? d.stats.views : 0;
      document.getElementById('statClicks').textContent = d.stats ? d.stats.wa_clicks : 0;
      // Check limit for add button
      if(d.propiedades_count >= d.propiedades_limit){
        document.getElementById('addPropBtn').disabled = true;
        document.getElementById('addPropBtn').textContent = 'Límite alcanzado';
        document.getElementById('addPropBtn').style.opacity = '.5';
      }
      showDash();
      loadMyProps();
    })
    .catch(function(e){ if(e!=='auth') console.error(e); });
  }

  function loadMyProps() {
    fetch(API+'/api/broker/propiedades', {headers:headers()})
    .then(function(r){return r.json();})
    .then(function(list){
      myProps = list;
      var grid = document.getElementById('dashPropsGrid');
      var empty = document.getElementById('dashPropsEmpty');
      grid.innerHTML = '';
      if(!list.length){ empty.style.display=''; return; }
      empty.style.display='none';
      list.forEach(function(p){
        var card = document.createElement('div');
        card.className = 'dash-prop-card';
        card.innerHTML = (p.imagen||p.mainImage ? '<img class="dash-prop-img" src="'+(p.imagen||p.mainImage)+'" alt="">' : '<div style="height:180px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:14px">Sin imagen</div>') +
          '<div class="dash-prop-body">' +
          '<div class="dash-prop-price">'+(p.precio||p.priceFormatted||'Consultar')+'</div>' +
          '<div class="dash-prop-title">'+(p.titulo||p.title||'')+'</div>' +
          '<div style="font-size:12px;color:#94a3b8;margin-top:4px">'+(p.zona||p.municipio||p.locationFull||'')+'</div>' +
          '<div class="dash-prop-actions">' +
          '<button class="dash-edit-btn" onclick="editProp(\\''+encodeURIComponent(p.id||p.slug)+'\\')">Editar</button>' +
          '<button class="dash-del-btn" onclick="deleteProp(\\''+encodeURIComponent(p.id||p.slug)+'\\')">Eliminar</button>' +
          '</div></div>';
        grid.appendChild(card);
      });
    });
  }

  window.openPropModal = function(){
    document.getElementById('propEditId').value = '';
    document.getElementById('propModalTitle').textContent = 'Nueva propiedad';
    document.getElementById('propSaveBtn').textContent = 'Publicar propiedad';
    document.getElementById('propTitulo').value = '';
    document.getElementById('propPrecio').value = '';
    document.getElementById('propTipo').value = 'Casa';
    document.getElementById('propHabs').value = '';
    document.getElementById('propBanos').value = '';
    document.getElementById('propArea').value = '';
    document.getElementById('propZona').value = '';
    document.getElementById('propDesc').value = '';
    document.getElementById('propImagen').value = '';
    document.getElementById('propMsg').style.display = 'none';
    document.getElementById('propModal').classList.add('open');
  };

  window.editProp = function(encodedId){
    var id = decodeURIComponent(encodedId);
    var p = myProps.find(function(x){return (x.id||x.slug)===id;});
    if(!p) return;
    document.getElementById('propEditId').value = id;
    document.getElementById('propModalTitle').textContent = 'Editar propiedad';
    document.getElementById('propSaveBtn').textContent = 'Guardar cambios';
    document.getElementById('propTitulo').value = p.titulo||p.title||'';
    document.getElementById('propPrecio').value = p.precio||p.priceFormatted||'';
    document.getElementById('propTipo').value = p.tipo||'Casa';
    document.getElementById('propHabs').value = p.habitaciones||'';
    document.getElementById('propBanos').value = p.banos||'';
    document.getElementById('propArea').value = p.areaConst||p.area||'';
    document.getElementById('propZona').value = p.zona||p.municipio||'';
    document.getElementById('propDesc').value = p.descripcion||p.description||'';
    document.getElementById('propImagen').value = p.imagen||p.mainImage||'';
    document.getElementById('propMsg').style.display = 'none';
    document.getElementById('propModal').classList.add('open');
  };

  window.closePropModal = function(){ document.getElementById('propModal').classList.remove('open'); };

  window.handleSaveProp = function(e){
    e.preventDefault();
    var editId = document.getElementById('propEditId').value;
    var data = {
      titulo: document.getElementById('propTitulo').value.trim(),
      precio: document.getElementById('propPrecio').value.trim(),
      priceFormatted: document.getElementById('propPrecio').value.trim(),
      tipo: document.getElementById('propTipo').value,
      habitaciones: document.getElementById('propHabs').value,
      banos: document.getElementById('propBanos').value,
      areaConst: document.getElementById('propArea').value.trim(),
      zona: document.getElementById('propZona').value.trim(),
      municipio: document.getElementById('propZona').value.trim(),
      locationFull: document.getElementById('propZona').value.trim(),
      descripcion: document.getElementById('propDesc').value.trim(),
      description: document.getElementById('propDesc').value.trim(),
      imagen: document.getElementById('propImagen').value.trim(),
      mainImage: document.getElementById('propImagen').value.trim(),
      mainImageThumb: document.getElementById('propImagen').value.trim()
    };
    var btn = document.getElementById('propSaveBtn');
    var msg = document.getElementById('propMsg');
    btn.disabled = true;

    var url = API+'/api/broker/propiedades';
    var method = editId ? 'PUT' : 'POST';
    if(editId) data.id = editId;

    fetch(url, {method:method, headers:headers(), body:JSON.stringify(data)})
    .then(function(r){return r.json();})
    .then(function(d){
      btn.disabled = false;
      if(d.ok){ closePropModal(); loadDashboard(); }
      else { msg.className='dash-msg error'; msg.textContent=d.error||'Error'; msg.style.display='block'; }
    })
    .catch(function(){ btn.disabled=false; });
    return false;
  };

  window.deleteProp = function(encodedId){
    if(!confirm('¿Eliminar esta propiedad?')) return;
    var id = decodeURIComponent(encodedId);
    fetch(API+'/api/broker/propiedades', {method:'DELETE', headers:headers(), body:JSON.stringify({id:id})})
    .then(function(r){return r.json();})
    .then(function(d){ if(d.ok) loadDashboard(); });
  };

  window.doLogout = function(){
    fetch(API+'/api/broker/logout', {method:'POST', headers:headers()}).catch(function(){});
    localStorage.removeItem('broker_token');
    token = null;
    showLogin();
  };
})();
<\/script>
`;

  return layout({
    title: 'Dashboard de Asesor',
    desc: 'Administra tus propiedades, perfil y métricas como asesor inmobiliario en InmuHub.',
    canonical: '/dashboard.html',
    body: body
  });
}

module.exports = { dashboardAsesorPage };
