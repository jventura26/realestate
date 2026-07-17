const { layout } = require('./layout');

function registroAsesorPage() {
  const body = `
<style>
.reg-hero{padding:80px 6% 60px;background:linear-gradient(135deg,#0a1628 0%,#0f1e38 50%,#0a1628 100%);position:relative;overflow:hidden;text-align:center}
.reg-hero::before{content:'';position:absolute;top:-200px;right:-100px;width:600px;height:600px;background:radial-gradient(circle,rgba(201,169,110,.08) 0%,transparent 70%);pointer-events:none}
.reg-form-section{padding:60px 6%;background:#f8f9fb}
.reg-card{max-width:640px;margin:0 auto;background:white;border-radius:20px;padding:48px 40px;box-shadow:0 8px 40px rgba(0,0,0,.06);border:1.5px solid #eef0f3}
.reg-field{margin-bottom:20px}
.reg-field label{display:block;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin-bottom:6px}
.reg-field input,.reg-field textarea,.reg-field select{width:100%;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;font-family:inherit;background:#fafbfc;transition:all .3s;box-sizing:border-box}
.reg-field input:focus,.reg-field textarea:focus,.reg-field select:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,169,110,.12);background:white}
.reg-field textarea{resize:vertical;min-height:80px}
.reg-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.reg-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.reg-chip{display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1.5px solid #e2e8f0;border-radius:20px;font-size:13px;cursor:pointer;transition:all .2s;background:white;user-select:none}
.reg-chip.active{background:rgba(201,169,110,.12);border-color:var(--gold);color:#8B6914;font-weight:600}
.reg-chip:hover{border-color:#c9a96e}
.reg-btn{display:block;width:100%;padding:16px;background:var(--gold);color:#0a1628;font-size:15px;font-weight:700;border:none;border-radius:10px;cursor:pointer;letter-spacing:.03em;transition:all .3s;margin-top:32px}
.reg-btn:hover{opacity:.88}
.reg-btn:disabled{opacity:.5;cursor:not-allowed}
.reg-msg{margin-top:20px;padding:16px 20px;border-radius:10px;font-size:14px;display:none}
.reg-msg.success{display:block;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}
.reg-msg.error{display:block;background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
.reg-benefits{max-width:1200px;margin:0 auto;padding:60px 6%}
.reg-benefits-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:24px;margin-top:32px}
.reg-benefit{background:white;border-radius:16px;padding:32px 28px;border:1.5px solid #eef0f3}
.reg-benefit h4{font-size:16px;font-weight:700;color:#0a1628;margin:0 0 8px}
.reg-benefit p{font-size:13px;color:#64748b;line-height:1.7;margin:0}
@media(max-width:640px){.reg-row{grid-template-columns:1fr}.reg-card{padding:32px 24px}}
</style>

<div class="reg-hero">
  <div style="position:relative;z-index:2">
    <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(201,169,110,.12);border:1px solid rgba(201,169,110,.3);border-radius:100px;padding:6px 16px;margin-bottom:24px">
      <span style="width:6px;height:6px;background:var(--gold);border-radius:50%"></span>
      <span style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)">Registro de asesores</span>
    </div>
    <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2.2rem,5vw,3.2rem);font-weight:300;color:white;margin:0 0 16px;line-height:1.1">
      Publica tus propiedades<br><em style="font-style:italic;color:var(--gold)">en InmuHub</em>
    </h1>
    <p style="font-size:15px;color:rgba(255,255,255,.5);max-width:500px;margin:0 auto;line-height:1.8">Reg&iacute;strate como asesor verificado y comienza a recibir leads directamente en tu WhatsApp.</p>
  </div>
</div>

<div class="reg-form-section">
  <div class="reg-card">
    <div style="text-align:center;margin-bottom:32px">
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:1.8rem;font-weight:300;color:#0a1628;margin:0 0 8px">Crea tu cuenta</h2>
      <p style="font-size:13px;color:#94a3b8">Completa el formulario y te notificaremos cuando tu cuenta est&eacute; activa.</p>
    </div>

    <form id="regForm" onsubmit="return handleRegister(event)">
      <div class="reg-field">
        <label>Nombre completo *</label>
        <input type="text" id="regNombre" required placeholder="Tu nombre completo">
      </div>
      <div class="reg-row">
        <div class="reg-field">
          <label>Email *</label>
          <input type="email" id="regEmail" required placeholder="tu@email.com">
        </div>
        <div class="reg-field">
          <label>Contrase&ntilde;a *</label>
          <input type="password" id="regPassword" required minlength="6" placeholder="M&iacute;nimo 6 caracteres">
        </div>
      </div>
      <div class="reg-row">
        <div class="reg-field">
          <label>Tel&eacute;fono</label>
          <input type="tel" id="regTelefono" placeholder="5021 2345 6789">
        </div>
        <div class="reg-field">
          <label>WhatsApp *</label>
          <input type="tel" id="regWhatsapp" required placeholder="502XXXXXXXX">
        </div>
      </div>
      <div class="reg-field">
        <label>T&iacute;tulo profesional</label>
        <input type="text" id="regTitulo" placeholder="Asesor Inmobiliario, Broker, Agente...">
      </div>
      <div class="reg-field">
        <label>Bio corta</label>
        <textarea id="regBio" placeholder="Cu&eacute;ntanos sobre tu experiencia en el mercado inmobiliario..."></textarea>
      </div>

      <div class="reg-field">
        <label>Zonas de operaci&oacute;n</label>
        <div class="reg-chips" id="zonasChips">
          <span class="reg-chip" data-val="Zona 10">Zona 10</span>
          <span class="reg-chip" data-val="Zona 14">Zona 14</span>
          <span class="reg-chip" data-val="Zona 15">Zona 15</span>
          <span class="reg-chip" data-val="Zona 16">Zona 16</span>
          <span class="reg-chip" data-val="Cayalá">Cayal&aacute;</span>
          <span class="reg-chip" data-val="Fraijanes">Fraijanes</span>
          <span class="reg-chip" data-val="Carretera a El Salvador">Carr. El Salvador</span>
          <span class="reg-chip" data-val="Antigua Guatemala">Antigua</span>
          <span class="reg-chip" data-val="Otro">Otro</span>
        </div>
      </div>

      <div class="reg-field">
        <label>Especialidades</label>
        <div class="reg-chips" id="espChips">
          <span class="reg-chip" data-val="Residencial">Residencial</span>
          <span class="reg-chip" data-val="Apartamentos">Apartamentos</span>
          <span class="reg-chip" data-val="Inversión">Inversi&oacute;n</span>
          <span class="reg-chip" data-val="Fincas">Fincas</span>
          <span class="reg-chip" data-val="Terrenos">Terrenos</span>
          <span class="reg-chip" data-val="Comercial">Comercial</span>
          <span class="reg-chip" data-val="Luxury">Luxury</span>
        </div>
      </div>

      <button type="submit" class="reg-btn" id="regBtn">Crear mi cuenta</button>
    </form>

    <div id="regMsg" class="reg-msg"></div>

    <div style="text-align:center;margin-top:24px">
      <p style="font-size:13px;color:#94a3b8">&iquest;Ya tienes cuenta? <a href="/dashboard.html" style="color:var(--gold);font-weight:600;text-decoration:none">Inicia sesi&oacute;n</a></p>
    </div>
  </div>
</div>

<div class="reg-benefits">
  <div style="text-align:center;margin-bottom:16px">
    <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Beneficios</div>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(1.8rem,3.5vw,2.4rem);font-weight:300;color:#0a1628;margin:0">&iquest;Por qu&eacute; unirte a InmuHub?</h2>
  </div>
  <div class="reg-benefits-grid">
    <div class="reg-benefit">
      <h4>Perfil profesional</h4>
      <p>P&aacute;gina propia con tu foto, bio, zonas y especialidades. Tu marca personal como asesor.</p>
    </div>
    <div class="reg-benefit">
      <h4>Leads directos</h4>
      <p>Los interesados te contactan directo por WhatsApp. Sin intermediarios, sin comisiones.</p>
    </div>
    <div class="reg-benefit">
      <h4>Visibilidad premium</h4>
      <p>Aparece en el directorio de asesores verificados de Guatemala. SEO optimizado.</p>
    </div>
    <div class="reg-benefit">
      <h4>M&eacute;tricas de rendimiento</h4>
      <p>Conoce cu&aacute;ntas personas ven tu perfil y hacen click en tu WhatsApp.</p>
    </div>
  </div>
  <div style="text-align:center;margin-top:40px">
    <a href="/planes.html" style="display:inline-flex;align-items:center;gap:8px;color:var(--gold);font-size:14px;font-weight:700;text-decoration:none;letter-spacing:.04em">Ver planes y precios &#8594;</a>
  </div>
</div>

<script>
(function(){
  var API = 'https://zona-inmu.tours-virtuales-gt.workers.dev';

  // Chip selection
  document.querySelectorAll('.reg-chips').forEach(function(container){
    container.querySelectorAll('.reg-chip').forEach(function(chip){
      chip.addEventListener('click', function(){
        chip.classList.toggle('active');
      });
    });
  });

  function getChipValues(containerId) {
    var vals = [];
    document.getElementById(containerId).querySelectorAll('.reg-chip.active').forEach(function(c){
      vals.push(c.getAttribute('data-val'));
    });
    return vals;
  }

  window.handleRegister = function(e) {
    e.preventDefault();
    var btn = document.getElementById('regBtn');
    var msg = document.getElementById('regMsg');
    btn.disabled = true;
    btn.textContent = 'Registrando...';
    msg.className = 'reg-msg';
    msg.style.display = 'none';

    var data = {
      nombre: document.getElementById('regNombre').value.trim(),
      email: document.getElementById('regEmail').value.trim(),
      password: document.getElementById('regPassword').value,
      telefono: document.getElementById('regTelefono').value.trim(),
      whatsapp: document.getElementById('regWhatsapp').value.trim(),
      titulo: document.getElementById('regTitulo').value.trim(),
      bio: document.getElementById('regBio').value.trim(),
      zonas: getChipValues('zonasChips'),
      especialidad: getChipValues('espChips')
    };

    fetch(API + '/api/broker/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(function(r){ return r.json().then(function(d){ return {ok: r.ok, data: d}; }); })
    .then(function(res){
      btn.disabled = false;
      btn.textContent = 'Crear mi cuenta';
      if (res.ok && res.data.ok) {
        msg.className = 'reg-msg success';
        msg.innerHTML = '<strong>&iexcl;Registro exitoso!</strong><br>Tu cuenta est&aacute; pendiente de aprobaci&oacute;n. Te notificaremos por email cuando est&eacute; activa.';
        msg.style.display = 'block';
        document.getElementById('regForm').reset();
        document.querySelectorAll('.reg-chip.active').forEach(function(c){ c.classList.remove('active'); });
      } else {
        msg.className = 'reg-msg error';
        msg.textContent = res.data.error || 'Error al registrar. Intenta de nuevo.';
        msg.style.display = 'block';
      }
    })
    .catch(function(){
      btn.disabled = false;
      btn.textContent = 'Crear mi cuenta';
      msg.className = 'reg-msg error';
      msg.textContent = 'Error de conexi&oacute;n. Intenta de nuevo.';
      msg.style.display = 'block';
    });
    return false;
  };
})();
<\/script>
`;

  return layout({
    title: 'Registro de Asesores Inmobiliarios',
    desc: 'Regístrate como asesor inmobiliario verificado en InmuHub. Publica tus propiedades y recibe leads directos en tu WhatsApp.',
    canonical: '/registro-asesor.html',
    body: body
  });
}

module.exports = { registroAsesorPage };
