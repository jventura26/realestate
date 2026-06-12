export default {
  async fetch(request, env) {
    return new Response(getHTML(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};

function getHTML() {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Admin Zona-INNmueble</title>
<style>
* { margin: 0; padding: 0; }
body { font-family: Arial; background: #0D1B3E; }
.hidden { display: none; }
.login { display: flex; justify-content: center; align-items: center; height: 100vh; }
.box { background: white; padding: 40px; border-radius: 8px; width: 350px; }
input, button { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; }
button { background: #0D1B3E; color: white; border: none; cursor: pointer; font-weight: bold; }
.admin { display: none; }
.navbar { background: white; padding: 15px 30px; display: flex; justify-content: space-between; }
.content { padding: 20px; }
</style>
</head>
<body>
<div id="loginPage" class="login">
  <div class="box">
    <h1>Admin Panel</h1>
    <input type="text" id="user" value="admin">
    <input type="password" id="pass" value="admin1203">
    <button onclick="login()">Ingresar</button>
  </div>
</div>

<div id="adminPage" class="admin">
  <div class="navbar">
    <h2>Admin</h2>
    <button onclick="logout()">Salir</button>
  </div>
  <div class="content">
    <h1>Bienvenido</h1>
  </div>
</div>

<script>
function login() {
  if (document.getElementById('user').value === 'admin' && document.getElementById('pass').value === 'admin1203') {
    localStorage.setItem('logged', '1');
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('adminPage').classList.remove('hidden');
  } else {
    alert('Incorrecto');
  }
}

function logout() {
  localStorage.removeItem('logged');
  location.reload();
}

if (localStorage.getItem('logged') === '1') {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('adminPage').classList.remove('hidden');
}
</script>
</body>
</html>`;
  return html;
}
