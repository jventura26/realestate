/**
 * Zona-INNmueble / InmuHub - Admin Worker
 * Cloudflare Workers + KV
 */

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin1203';
const SESSION_TTL = 60 * 60 * 8;

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function requireAuth(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return false;
  const stored = await env.DB.get('session:' + match[1]);
  return stored === 'valid';
}

function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, function(b) { return b.toString(16).padStart(2, '0'); }).join('');
}

function getAdminHTML() {
  var html = '<!DOCTYPE html>';
  html += '<html lang="es">';
  html += '<head>';
  html += '<meta charset="UTF-8">';
  html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
  html += '<title>Admin - Zona INNmueble</title>';
  html += '<style>';
  html += ':root{--navy:#0D1B3E;--orange:#F5820D;--steel:#3A6186;--muted:#6c757d;}';
  html += '*{margin:0;padding:0;box-sizing:border-box;}';
  html += 'body{font-family:system-ui,sans-serif;background:var(--navy);color:#1a1a2e;}';
  html += 'input,button,select,textarea{font-family:inherit;}';
  html += '.login-wrap{display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px;}';
  html += '.login-card{background:white;border-radius:12px;padding:48px 40px;width:100%;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,.4);}';
  html += '.login-logo{color:var(--navy);font-size:22px;font-weight:800;margin-bottom:8px;}';
  html += '.login-logo span{color:var(--orange);}';
  html += '.login-sub{color:var(--muted);font-size:13px;margin-bottom:32px;}';
  html += '.field{margin-bottom:16px;}';
  html += '.field label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--navy);margin-bottom:6px;}';
  html += '.field input{width:100%;padding:11px 14px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:14px;}';
  html += '.field input:focus{outline:none;border-color:var(--navy);}';
  html += '.btn-primary{width:100%;padding:13px;background:var(--navy);color:white;border:none;border-radius:6px;font-weight:700;font-size:14px;cursor:pointer;}';
  html += '.btn-primary:hover{background:#1a2850;}';
  html += '.err-msg{background:#fef2f2;color:#b91c1c;border-radius:6px;padding:10px 14px;font-size:13px;margin-top:14px;display:none;}';
  html += '.shell{display:none;min-height:100vh;background:#f0f2f5;}';
  html += '.topbar{background:var(--navy);padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}';
  html += '.topbar-brand{color:white;font-weight:800;font-size:16px;}';
  html += '.topbar-brand span{color:var(--orange);}';
  html += '.topbar-right{display:flex;align-items:center;gap:12px;}';
  html += '.btn-sm{padding:7px 14px;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;border:none;}';
  html += '.btn-import{background:var(--steel);color:white;}';
  html += '.btn-add{background:var(--orange);color:white;}';
  html += '.btn-logout{background:rgba(255,255,255,.15);color:white;}';
  html += '.btn-danger{background:#ef4444;color:white;}';
  html += '.btn-edit{background:var(--steel);color:white;}';
  html += '.main{max-width:1200px;margin:0 auto;padding:28px 20px;}';
  html += '.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:24px;}';
  html += '.stat-card{background:white;border-radius:10px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.08);}';
  html += '.stat-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:8px;}';
  html += '.stat-value{font-size:32px;font-weight:800;color:var(--navy);}';
  html += '.stat-value.orange{color:var(--orange);}';
  html += '.import-panel{background:white;border-radius:10px;padding:24px;margin-bottom:20px;display:none;box-shadow:0 1px 4px rgba(0,0,0,.08);}';
  html += '.import-panel.open{display:block;}';
  html += '.import-title{font-size:15px;font-weight:700;color:var(--navy);margin-bottom:6px;}';
  html += '.import-sub{font-size:13px;color:var(--muted);margin-bottom:16px;}';
  html += '.drop-zone{border:2px dashed #d0d5dd;border-radius:8px;padding:36px;text-align:center;cursor:pointer;background:#fafafa;}';
  html += '.drop-zone:hover{border-color:var(--navy);background:#f0f3ff;}';
  html += '.drop-text{font-size:13px;color:var(--muted);}';
  html += '.drop-text strong{color:var(--navy);}';
  html += '.preview-info{background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin:14px 0;}';
  html += '.preview-info span{font-size:13px;color:#0369a1;font-weight:600;}';
  html += '.progress-wrap{display:none;margin-bottom:12px;}';
  html += '.progress-bar-bg{background:#e5e7eb;border-radius:99px;height:8px;overflow:hidden;}';
  html += '.progress-bar{background:var(--orange);height:8px;border-radius:99px;width:0%;transition:width .3s;}';
  html += '.progress-label{font-size:12px;color:var(--muted);margin-top:5px;}';
  html += '.import-preview{display:none;}';
  html += '.import-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:12px;}';
  html += '.table-card{background:white;border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow:hidden;}';
  html += '.table-header{padding:18px 22px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #f0f0f0;}';
  html += '.table-title{font-size:15px;font-weight:700;color:var(--navy);}';
  html += '.search-input{padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:13px;width:200px;}';
  html += '.search-input:focus{outline:none;border-color:var(--navy);}';
  html += 'table{width:100%;border-collapse:collapse;}';
  html += 'th{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);padding:11px 14px;text-align:left;background:#fafafa;border-bottom:1px solid #f0f0f0;}';
  html += 'td{padding:13px 14px;font-size:13px;border-bottom:1px solid #f8f8f8;vertical-align:middle;}';
  html += 'tr:last-child td{border-bottom:none;}';
  html += 'tr:hover td{background:#fafbff;}';
  html += '.badge{display:inline-block;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;}';
  html += '.badge-green{background:#dcfce7;color:#166534;}';
  html += '.badge-blue{background:#dbeafe;color:#1e40af;}';
  html += '.badge-orange{background:#ffedd5;color:#9a3412;}';
  html += '.prop-title{font-weight:600;color:var(--navy);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}';
  html += '.prop-price{font-weight:700;color:var(--orange);}';
  html += '.actions{display:flex;gap:6px;}';
  html += '.empty-state{text-align:center;padding:48px 24px;color:var(--muted);}';
  html += '.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:none;justify-content:center;align-items:flex-start;padding:40px 20px;z-index:200;overflow-y:auto;}';
  html += '.modal-overlay.open{display:flex;}';
  html += '.modal{background:white;border-radius:12px;width:100%;max-width:580px;padding:32px;}';
  html += '.modal-title{font-size:17px;font-weight:800;color:var(--navy);margin-bottom:22px;}';
  html += '.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}';
  html += '.form-grid .full{grid-column:1/-1;}';
  html += '.form-field label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--navy);margin-bottom:5px;}';
  html += '.form-field input,.form-field select,.form-field textarea{width:100%;padding:10px 12px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:13px;}';
  html += '.form-field textarea{resize:vertical;min-height:80px;}';
  html += '.form-field input:focus,.form-field select:focus,.form-field textarea:focus{outline:none;border-color:var(--navy);}';
  html += '.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:22px;}';
  html += '.btn-cancel{background:#f0f2f5;color:#1a1a2e;padding:10px 18px;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px;}';
  html += '.btn-save{background:var(--navy);color:white;padding:10px 22px;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px;}';
  html += '.toast{position:fixed;bottom:24px;right:24px;background:#1e293b;color:white;padding:12px 18px;border-radius:8px;font-size:13px;font-weight:600;transform:translateY(80px);opacity:0;transition:all .3s;z-index:300;}';
  html += '.toast.show{transform:translateY(0);opacity:1;}';
  html += '.toast.success{border-left:4px solid #22c55e;}';
  html += '.toast.error{border-left:4px solid #ef4444;}';
  html += '</style>';
  html += '</head>';
  html += '<body>';

  // LOGIN
  html += '<div id="loginPage" class="login-wrap">';
  html += '<div class="login-card">';
  html += '<div class="login-logo"><span>Zona</span>-INNmueble</div>';
  html += '<div class="login-sub">Panel de administracion</div>';
  html += '<div class="field"><label>Usuario</label><input type="text" id="loginUser" placeholder="admin" autocomplete="username"></div>';
  html += '<div class="field"><label>Contrasena</label><input type="password" id="loginPass" autocomplete="current-password"></div>';
  html += '<button class="btn-primary" id="loginBtn" onclick="doLogin()">Ingresar al panel</button>';
  html += '<div class="err-msg" id="loginErr">Usuario o contrasena incorrectos.</div>';
  html += '</div></div>';

  // SHELL
  html += '<div id="adminShell" class="shell">';
  html += '<div class="topbar">';
  html += '<div class="topbar-brand"><span>Zona</span>-INNmueble Admin</div>';
  html += '<div class="topbar-right">';
  html += '<button class="btn-sm btn-import" onclick="toggleImport()">Importar CSV</button>';
  html += '<button class="btn-sm btn-add" onclick="openModal(null)">+ Nueva propiedad</button>';
  html += '<button class="btn-sm btn-logout" onclick="doLogout()">Salir</button>';
  html += '</div></div>';

  html += '<div class="main">';

  // IMPORT PANEL
  html += '<div class="import-panel" id="importPanel">';
  html += '<div class="import-title">Importar propiedades desde CSV</div>';
  html += '<div class="import-sub">Sube el archivo propiedades.csv exportado de Wix. Las propiedades existentes seran reemplazadas.</div>';
  html += '<div class="drop-zone" id="dropZone" onclick="document.getElementById(\'csvFile\').click()">';
  html += '<div class="drop-text"><strong>Click para seleccionar</strong> o arrastra el CSV aqui</div>';
  html += '<input type="file" id="csvFile" accept=".csv" style="display:none" onchange="handleFile(this.files[0])">';
  html += '</div>';
  html += '<div class="import-preview" id="importPreview">';
  html += '<div class="preview-info"><span id="previewText">0 propiedades listas</span><span id="previewFile" style="color:var(--muted);font-weight:400"></span></div>';
  html += '<div class="progress-wrap" id="progressWrap"><div class="progress-bar-bg"><div class="progress-bar" id="progressBar"></div></div><div class="progress-label" id="progressLabel">Importando...</div></div>';
  html += '<div class="import-actions"><button class="btn-cancel" onclick="cancelImport()">Cancelar</button><button class="btn-save" id="btnImport" onclick="doImport()">Importar al KV</button></div>';
  html += '</div></div>';

  // STATS
  html += '<div class="stats">';
  html += '<div class="stat-card"><div class="stat-label">Total</div><div class="stat-value" id="statTotal">0</div></div>';
  html += '<div class="stat-card"><div class="stat-label">Activas</div><div class="stat-value orange" id="statActivas">0</div></div>';
  html += '<div class="stat-card"><div class="stat-label">Venta</div><div class="stat-value" id="statVenta">0</div></div>';
  html += '<div class="stat-card"><div class="stat-label">Renta</div><div class="stat-value" id="statRenta">0</div></div>';
  html += '</div>';

  // TABLE
  html += '<div class="table-card">';
  html += '<div class="table-header"><div class="table-title">Propiedades</div>';
  html += '<input class="search-input" type="text" placeholder="Buscar..." id="searchInput" oninput="renderTable()"></div>';
  html += '<div id="tableWrap"></div>';
  html += '</div></div></div>';

  // MODAL
  html += '<div class="modal-overlay" id="modalOverlay" onclick="if(event.target===this)closeModal()">';
  html += '<div class="modal">';
  html += '<div class="modal-title" id="modalTitle">Nueva propiedad</div>';
  html += '<div class="form-grid">';
  html += '<div class="form-field full"><label>Titulo</label><input type="text" id="fTitulo" placeholder="Casa en Zona 10"></div>';
  html += '<div class="form-field"><label>Precio</label><input type="text" id="fPrecio" placeholder="Q 2,500,000"></div>';
  html += '<div class="form-field"><label>Tipo</label><select id="fTipo"><option>Casa</option><option>Apartamento</option><option>Finca</option><option>Local</option><option>Terreno</option></select></div>';
  html += '<div class="form-field"><label>Operacion</label><select id="fOperacion"><option>Venta</option><option>Renta</option><option>Venta/Renta</option></select></div>';
  html += '<div class="form-field"><label>Zona / Ubicacion</label><input type="text" id="fZona" placeholder="Zona 14, Guatemala"></div>';
  html += '<div class="form-field"><label>Area m2</label><input type="text" id="fArea" placeholder="350"></div>';
  html += '<div class="form-field"><label>Habitaciones</label><input type="number" id="fHabitaciones" placeholder="4"></div>';
  html += '<div class="form-field"><label>Banos</label><input type="number" id="fBanos" placeholder="3"></div>';
  html += '<div class="form-field full"><label>URL imagen</label><input type="url" id="fImagen" placeholder="https://..."></div>';
  html += '<div class="form-field full"><label>Descripcion</label><textarea id="fDescripcion" placeholder="Descripcion breve..."></textarea></div>';
  html += '<div class="form-field"><label>Estado</label><select id="fEstado"><option>Activa</option><option>Vendida</option><option>Pausada</option></select></div>';
  html += '</div>';
  html += '<div class="modal-actions"><button class="btn-cancel" onclick="closeModal()">Cancelar</button><button class="btn-save" onclick="saveProp()">Guardar</button></div>';
  html += '</div></div>';

  // TOAST
  html += '<div class="toast" id="toast"></div>';

  // SCRIPT
  html += '<script>';
  html += 'var props = [];';
  html += 'var editingId = null;';
  html += 'var parsedProps = [];';

  html += 'async function doLogin() {';
  html += '  var u = document.getElementById("loginUser").value.trim();';
  html += '  var p = document.getElementById("loginPass").value;';
  html += '  var btn = document.getElementById("loginBtn");';
  html += '  btn.textContent = "Verificando..."; btn.disabled = true;';
  html += '  try {';
  html += '    var res = await fetch("/api/login", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user:u,pass:p})});';
  html += '    if (res.ok) {';
  html += '      document.getElementById("loginPage").style.display = "none";';
  html += '      document.getElementById("adminShell").style.display = "block";';
  html += '      loadProps();';
  html += '    } else {';
  html += '      var err = document.getElementById("loginErr");';
  html += '      err.style.display = "block";';
  html += '      setTimeout(function(){ err.style.display="none"; }, 3000);';
  html += '    }';
  html += '  } catch(e) {';
  html += '    var err = document.getElementById("loginErr");';
  html += '    err.textContent = "Error: " + e.message;';
  html += '    err.style.display = "block";';
  html += '  } finally { btn.textContent = "Ingresar al panel"; btn.disabled = false; }';
  html += '}';

  html += 'document.addEventListener("keydown", function(e){ if(e.key==="Enter" && document.getElementById("loginPage").style.display !== "none") doLogin(); });';

  html += 'async function doLogout() { await fetch("/api/logout",{method:"POST"}); location.reload(); }';

  html += 'async function checkSession() {';
  html += '  var res = await fetch("/api/me");';
  html += '  if (res.ok) { document.getElementById("loginPage").style.display="none"; document.getElementById("adminShell").style.display="block"; loadProps(); }';
  html += '}';

  html += 'async function loadProps() {';
  html += '  var res = await fetch("/api/propiedades");';
  html += '  if (res.ok) { props = await res.json(); updateStats(); renderTable(); }';
  html += '}';

  html += 'function updateStats() {';
  html += '  document.getElementById("statTotal").textContent = props.length;';
  html += '  document.getElementById("statActivas").textContent = props.filter(function(p){return p.estado==="Activa";}).length;';
  html += '  document.getElementById("statVenta").textContent = props.filter(function(p){return p.operacion==="Venta"||p.operacion==="Venta/Renta";}).length;';
  html += '  document.getElementById("statRenta").textContent = props.filter(function(p){return p.operacion==="Renta"||p.operacion==="Venta/Renta";}).length;';
  html += '}';

  html += 'function renderTable() {';
  html += '  var q = document.getElementById("searchInput").value.toLowerCase();';
  html += '  var filtered = props.filter(function(p){ return (p.titulo||"").toLowerCase().includes(q)||(p.zona||"").toLowerCase().includes(q)||(p.tipo||"").toLowerCase().includes(q); });';
  html += '  if (!filtered.length) { document.getElementById("tableWrap").innerHTML = "<div class=\'empty-state\'>No hay propiedades.</div>"; return; }';
  html += '  var rows = filtered.map(function(p) {';
  html += '    return "<tr><td><div class=\'prop-title\'>" + (p.titulo||"-") + "</div></td>"';
  html += '    + "<td class=\'prop-price\'>" + (p.precio||"-") + "</td>"';
  html += '    + "<td>" + (p.zona||"-") + "</td>"';
  html += '    + "<td><span class=\'badge badge-blue\'>" + (p.tipo||"-") + "</span></td>"';
  html += '    + "<td><span class=\'badge badge-orange\'>" + (p.operacion||"-") + "</span></td>"';
  html += '    + "<td><span class=\'badge " + (p.estado==="Activa"?"badge-green":"badge-blue") + "\'>" + (p.estado||"-") + "</span></td>"';
  html += '    + "<td><div class=\'actions\'><button class=\'btn-sm btn-edit\' onclick=\'editProp(\\"" + p.id + "\\")\'>Editar</button>"';
  html += '    + "<button class=\'btn-sm btn-danger\' onclick=\'deleteProp(\\"" + p.id + "\\")\'>Eliminar</button></div></td></tr>";';
  html += '  }).join("");';
  html += '  document.getElementById("tableWrap").innerHTML = "<table><thead><tr><th>Titulo</th><th>Precio</th><th>Ubicacion</th><th>Tipo</th><th>Operacion</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>" + rows + "</tbody></table>";';
  html += '}';

  html += 'function openModal(prop) {';
  html += '  editingId = prop ? prop.id : null;';
  html += '  document.getElementById("modalTitle").textContent = prop ? "Editar propiedad" : "Nueva propiedad";';
  html += '  document.getElementById("fTitulo").value = prop ? (prop.titulo||"") : "";';
  html += '  document.getElementById("fPrecio").value = prop ? (prop.precio||"") : "";';
  html += '  document.getElementById("fTipo").value = prop ? (prop.tipo||"Casa") : "Casa";';
  html += '  document.getElementById("fOperacion").value = prop ? (prop.operacion||"Venta") : "Venta";';
  html += '  document.getElementById("fZona").value = prop ? (prop.zona||"") : "";';
  html += '  document.getElementById("fArea").value = prop ? (prop.area||"") : "";';
  html += '  document.getElementById("fHabitaciones").value = prop ? (prop.habitaciones||"") : "";';
  html += '  document.getElementById("fBanos").value = prop ? (prop.banos||"") : "";';
  html += '  document.getElementById("fImagen").value = prop ? (prop.imagen||"") : "";';
  html += '  document.getElementById("fDescripcion").value = prop ? (prop.descripcion||"") : "";';
  html += '  document.getElementById("fEstado").value = prop ? (prop.estado||"Activa") : "Activa";';
  html += '  document.getElementById("modalOverlay").classList.add("open");';
  html += '}';

  html += 'function closeModal() { document.getElementById("modalOverlay").classList.remove("open"); editingId = null; }';

  html += 'async function saveProp() {';
  html += '  var titulo = document.getElementById("fTitulo").value.trim();';
  html += '  var precio = document.getElementById("fPrecio").value.trim();';
  html += '  if (!titulo || !precio) { showToast("Titulo y precio son obligatorios.", "error"); return; }';
  html += '  var data = { titulo:titulo, precio:precio, tipo:document.getElementById("fTipo").value, operacion:document.getElementById("fOperacion").value, zona:document.getElementById("fZona").value, area:document.getElementById("fArea").value, habitaciones:document.getElementById("fHabitaciones").value, banos:document.getElementById("fBanos").value, imagen:document.getElementById("fImagen").value, descripcion:document.getElementById("fDescripcion").value, estado:document.getElementById("fEstado").value };';
  html += '  var method = editingId ? "PUT" : "POST";';
  html += '  var url = editingId ? "/api/propiedades/" + editingId : "/api/propiedades";';
  html += '  var res = await fetch(url, {method:method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(data)});';
  html += '  if (res.ok) { closeModal(); showToast(editingId ? "Propiedad actualizada." : "Propiedad creada.", "success"); loadProps(); }';
  html += '  else showToast("Error al guardar.", "error");';
  html += '}';

  html += 'function editProp(id) { var p = props.find(function(x){return x.id===id;}); if(p) openModal(p); }';

  html += 'async function deleteProp(id) {';
  html += '  if (!confirm("Eliminar esta propiedad?")) return;';
  html += '  var res = await fetch("/api/propiedades/" + id, {method:"DELETE"});';
  html += '  if (res.ok) { showToast("Propiedad eliminada.", "success"); loadProps(); }';
  html += '  else showToast("Error al eliminar.", "error");';
  html += '}';

  html += 'function showToast(msg, type) {';
  html += '  var t = document.getElementById("toast");';
  html += '  t.textContent = msg; t.className = "toast " + (type||"success") + " show";';
  html += '  setTimeout(function(){ t.classList.remove("show"); }, 3000);';
  html += '}';

  // IMPORT
  html += 'function toggleImport() { document.getElementById("importPanel").classList.toggle("open"); }';

  html += 'function cancelImport() {';
  html += '  parsedProps = [];';
  html += '  document.getElementById("importPreview").style.display = "none";';
  html += '  document.getElementById("dropZone").style.display = "block";';
  html += '  document.getElementById("csvFile").value = "";';
  html += '}';

  html += 'function handleFile(file) {';
  html += '  if (!file || !file.name.endsWith(".csv")) { showToast("Selecciona un archivo .csv", "error"); return; }';
  html += '  var reader = new FileReader();';
  html += '  reader.onload = function(e) {';
  html += '    var text = e.target.result;';
  html += '    parsedProps = parseWixCSV(text);';
  html += '    if (!parsedProps.length) { showToast("No se encontraron propiedades", "error"); return; }';
  html += '    document.getElementById("previewText").textContent = parsedProps.length + " propiedades listas para importar";';
  html += '    document.getElementById("previewFile").textContent = file.name;';
  html += '    document.getElementById("importPreview").style.display = "block";';
  html += '    document.getElementById("dropZone").style.display = "none";';
  html += '  };';
  html += '  reader.readAsText(file, "UTF-8");';
  html += '}';

  html += 'function parseWixCSV(text) {';
  html += '  function parseRow(line) {';
  html += '    var cols=[],cur="",inQ=false;';
  html += '    for(var i=0;i<line.length;i++){';
  html += '      var ch=line[i];';
  html += '      if(ch==="\\""){inQ=!inQ;continue;}';
  html += '      if(ch===","&&!inQ){cols.push(cur.trim());cur="";continue;}';
  html += '      cur+=ch;';
  html += '    }';
  html += '    cols.push(cur.trim());';
  html += '    return cols;';
  html += '  }';
  html += '  var lines = text.split("\\n").filter(function(l){return l.trim();});';
  html += '  if(lines.length<2) return [];';
  html += '  lines[0] = lines[0].replace(/^\\uFEFF/,"");';
  html += '  var headers = parseRow(lines[0]);';
  html += '  function col(row,names){';
  html += '    for(var n=0;n<names.length;n++){';
  html += '      var i=headers.findIndex(function(h){return h.toLowerCase().includes(names[n].toLowerCase());});';
  html += '      if(i>=0&&row[i]) return row[i].trim();';
  html += '    }';
  html += '    return "";';
  html += '  }';
  html += '  function wixImg(uri){';
  html += '    if(!uri) return "";';
  html += '    if(uri.startsWith("http")) return uri;';
  html += '    var parts=uri.split("/");';
  html += '    for(var i=0;i<parts.length;i++){if(parts[i]==="v1"&&parts[i+1]){var f=parts[i+1].split("~")[0];return "https://static.wixstatic.com/media/"+f;}}';
  html += '    return "";';
  html += '  }';
  html += '  var result=[];';
  html += '  for(var i=1;i<lines.length;i++){';
  html += '    var row=parseRow(lines[i]);';
  html += '    var titulo=col(row,["titulo","title"]);';
  html += '    if(!titulo) continue;';
  html += '    var status=col(row,["status"]);';
  html += '    if(status&&status.toLowerCase()==="draft") continue;';
  html += '    var imgRaw=col(row,["imagen","image"]);';
  html += '    var img=wixImg(imgRaw);';
  html += '    var precio=col(row,["precio","price"]);';
  html += '    var itemPath=col(row,["propiedades (item)","item"]);';
  html += '    var slugParts=itemPath?itemPath.split("/"):[];';
  html += '    var slug=slugParts.length?slugParts[slugParts.length-1]:titulo.toLowerCase().replace(/[^a-z0-9]+/g,"-");';
  html += '    result.push({id:Date.now().toString()+i,titulo:titulo,precio:precio,tipo:col(row,["tipo de propiedad","tipo"])||"Casa",cinta:col(row,["cinta"]),operacion:col(row,["cinta","operacion"])||"Venta",zona:col(row,["lugar","zona"]),municipio:col(row,["municipio"]),area:col(row,["area de construccion","area"]),areaConst:col(row,["area de construccion","area"]),habitaciones:col(row,["numero de dormitorios","dormitorios"]),banos:col(row,["numero de banos","banos"]),imagen:img,mainImage:img,mainImageThumb:img,gallery:[img].filter(Boolean),descripcion:col(row,["description","descripcion"]),slug:slug,codigo:col(row,["codigo"]),estado:"Activa",createdAt:new Date().toISOString()});';
  html += '  }';
  html += '  return result;';
  html += '}';

  html += 'async function doImport() {';
  html += '  if (!parsedProps.length) return;';
  html += '  var btn=document.getElementById("btnImport");';
  html += '  var pw=document.getElementById("progressWrap");';
  html += '  var pb=document.getElementById("progressBar");';
  html += '  var pl=document.getElementById("progressLabel");';
  html += '  btn.disabled=true; pw.style.display="block";';
  html += '  var pct=0;';
  html += '  var ticker=setInterval(function(){pct=Math.min(pct+8,85);pb.style.width=pct+"%";},120);';
  html += '  try {';
  html += '    var res=await fetch("/api/propiedades/import",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(parsedProps)});';
  html += '    clearInterval(ticker);';
  html += '    if(res.ok){';
  html += '      pb.style.width="100%";';
  html += '      pl.textContent="OK - " + parsedProps.length + " propiedades importadas";';
  html += '      showToast(parsedProps.length + " propiedades cargadas al KV","success");';
  html += '      setTimeout(function(){document.getElementById("importPanel").classList.remove("open");cancelImport();loadProps();},1800);';
  html += '    } else { pl.textContent="Error al importar"; showToast("Error al importar","error"); btn.disabled=false; }';
  html += '  } catch(e) { clearInterval(ticker); pl.textContent="Error: "+e.message; btn.disabled=false; }';
  html += '}';

  html += 'checkSession();';
  html += '<\/script>';
  html += '</body></html>';
  return html;
}

// ROUTER
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (path === '/' || path === '/admin' || path === '/admin/') {
      return new Response(getAdminHTML(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    if (path === '/api/login' && method === 'POST') {
      const { user, pass } = await request.json();
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        const token = generateToken();
        await env.DB.put('session:' + token, 'valid', { expirationTtl: SESSION_TTL });
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': 'session=' + token + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + SESSION_TTL,
          },
        });
      }
      return json({ error: 'Credenciales incorrectas' }, 401);
    }

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

    if (path === '/api/me') {
      const authed = await requireAuth(request, env);
      return authed ? json({ ok: true }) : json({ error: 'No autorizado' }, 401);
    }

    // API publica para los sitios
    if (path === '/api/public/propiedades' && method === 'GET') {
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const pub = data.filter(function(p) { return !p.estado || p.estado === 'Activa'; });
      return new Response(JSON.stringify(pub), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    // Rutas protegidas
    const authed = await requireAuth(request, env);
    if (!authed) return json({ error: 'No autorizado' }, 401);

    if (path === '/api/propiedades/import' && method === 'POST') {
      const data = await request.json();
      if (!Array.isArray(data)) return json({ error: 'Se esperaba un array' }, 400);
      const normalized = data.map(function(p, i) {
        return Object.assign({}, p, { id: p.id || (Date.now() + i).toString() });
      });
      await env.DB.put('propiedades', JSON.stringify(normalized));
      return json({ ok: true, count: normalized.length }, 201);
    }

    if (path === '/api/propiedades' && method === 'GET') {
      const raw = await env.DB.get('propiedades');
      return json(raw ? JSON.parse(raw) : []);
    }

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

    if (path.startsWith('/api/propiedades/') && method === 'PUT') {
      const id = path.split('/').pop();
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const idx = data.findIndex(function(p) { return p.id === id; });
      if (idx < 0) return json({ error: 'No encontrado' }, 404);
      const updates = await request.json();
      data[idx] = Object.assign({}, data[idx], updates, { id: id });
      await env.DB.put('propiedades', JSON.stringify(data));
      return json(data[idx]);
    }

    if (path.startsWith('/api/propiedades/') && method === 'DELETE') {
      const id = path.split('/').pop();
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      await env.DB.put('propiedades', JSON.stringify(data.filter(function(p) { return p.id !== id; })));
      return json({ ok: true });
    }

    return json({ error: 'Not found' }, 404);
  },
};
