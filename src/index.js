mkdir -p src
cat > src/index.js << 'EOF'
export default {
  async fetch(request, env) {
    return new Response(getHTML(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};

function getHTML() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Admin Zona-INNmueble</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial; background: #0D1B3E; }
.hidden { display: none; }
.login { display: flex; justify-content: center; align-items: center; height: 100vh; }
.box { background: white; padding: 40px; border-radius: 8px; width: 350px; }
h1 { color: #0D1B3E; margin-bottom: 20px; }
input, button { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; }
button { background: #0D1B3E; color: white; border: none; cursor: pointer; font-weight: bold; }
.admin { display: none; }
.navbar { background: white; padding: 15px 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
.navbar h2 { color: #0D1B3E; margin: 0; }
.content { padding: 20px; max-width: 1200px; margin: 0 auto; }
table { width: 100%; background: white; border-collapse: collapse; margin-top: 20px; }
th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
th { background: #0D1B3E; color: white; }
.btn-small { padding: 5px 10px; margin-right: 5px; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; }
.btn-edit { background: #2196F3; color: white; }
.btn-delete { background: #d32f2f; color: white; }
.btn-logout { background: #d32f2f; color: white; padding: 8px 15px; border: none; cursor: pointer; }
</style>
</head>
<body>

<div id="loginPage" class="login">
  <div class="box">
    <h1>Admin Panel</h1>
    <input type="text" id="user" placeholder="Usuario" value="admin">
    <input type="password" id="pass" placeholder="Contraseña" value="admin1203">
    <button onclick="login()">Ingresar</button>
  </div>
</div>

<div id="adminPage" class="admin">
  <div class="navbar">
    <h2><span style="color:#F5820D">Zona-INNmueble</span> Admin</h2>
    <button class="btn-logout" onclick="logout()">Salir</button>
  </div>

  <div class="content">
    <h1 style="color: white;">Propiedades</h1>
    <table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Ubicación</th>
          <th>Precio</th>
          <th>Tipo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="tb"></tbody>
    </table>
  </div>
</div>

<script>
const PROPS = [
  {id:1, titulo:"El Manzanillo", lugar:"Mixco", precio:"Q. 1,440,000", tipo:"Casa"},
  {id:2, titulo:"Hacienda Nueva", lugar:"San José", precio:"$590,000", tipo:"Casa"},
  {id:3, titulo:"Residencia Elgin", lugar:"Guatemala", precio:"$585,000", tipo:"Casa"}
];

let props = [];

window.addEventListener('load', () => {
  if (localStorage.getItem('logged') === '1') showAdmin();
});

function login() {
  if (document.getElementById('user').value === 'admin' && document.getElementById('pass').value === 'admin1203') {
    localStorage.setItem('logged', '1');
    showAdmin();
  } else {
    alert('Incorrecto');
  }
}

function showAdmin() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminPage').style.display = 'block';
  loadProps();
}

function logout() {
  localStorage.removeItem('logged');
  location.reload();
}

function loadProps() {
  let s = localStorage.getItem('props');
  props = s ? JSON.parse(s) : JSON.parse(JSON.stringify(PROPS));
  renderTable();
}

function renderTable() {
  const tb = document.getElementById('tb');
  tb.innerHTML = '';
  props.forEach(p => {
    const r = document.createElement('tr');
    r.innerHTML = '<td>' + p.titulo + '</td><td>' + p.lugar + '</td><td style="color:#F5820D;font-weight:bold">' + p.precio + '</td><td>' + p.tipo + '</td><td><button class="btn-small btn-edit" onclick="edit(' + p.id + ')">Editar</button><button class="btn-small btn-delete" onclick="del(' + p.id + ')">Eliminar</button></td>';
    tb.appendChild(r);
  });
}

function edit(id) {
  alert('Editar propiedad ' + id);
}

function del(id) {
  if (confirm('Eliminar?')) {
    props = props.filter(x => x.id !== id);
    localStorage.setItem('props', JSON.stringify(props));
    renderTable();
  }
}
</script>

</body>
</html>\`;
}
EOF
