const { layout } = require('./layout');

function adminHubPage() {
  var body = `
<style>
  .ah-wrap{max-width:1200px;margin:0 auto;padding:40px 20px}
  .ah-login{max-width:400px;margin:80px auto;background:white;border-radius:16px;padding:40px;box-shadow:0 2px 20px rgba(0,0,0,.06)}
  .ah-login h2{font-family:'Cormorant Garamond',serif;font-size:1.8rem;margin:0 0 24px;color:#0a1628}
  .ah-field{margin-bottom:16px}
  .ah-field label{display:block;font-size:11px;font-weight:700;letter-spacing:1px;color:#64748b;margin-bottom:6px;text-transform:uppercase}
  .ah-field input{width:100%;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;background:#fafbfc;box-sizing:border-box}
  .ah-btn{display:inline-block;padding:12px 28px;background:var(--gold,#c9a96e);color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:.5px}
  .ah-btn:hover{opacity:.9}
  .ah-btn-sm{padding:6px 14px;font-size:12px;border-radius:6px}
  .ah-btn-danger{background:#ef4444}
  .ah-btn-green{background:#10b981}
  .ah-tabs{display:flex;gap:0;border-bottom:2px solid #eef0f3;margin-bottom:24px}
  .ah-tab{padding:12px 24px;font-size:13px;font-weight:700;color:#94a3b8;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;letter-spacing:.5px;text-transform:uppercase}
  .ah-tab.active{color:var(--gold,#c9a96e);border-bottom-color:var(--gold,#c9a96e)}
  .ah-tab:hover{color:#0a1628}
  .ah-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:32px}
  .ah-stat{background:white;border-radius:12px;padding:24px;border:1.5px solid #eef0f3;text-align:center}
  .ah-stat-val{font-size:2rem;font-weight:800;color:#0a1628}
  .ah-stat-label{font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;text-transform:uppercase;margin-top:4px}
  .ah-card{background:white;border-radius:12px;padding:20px;border:1.5px solid #eef0f3;margin-bottom:12px}
  .ah-card-head{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
  .ah-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.5px}
  .ah-badge-pending{background:#fef3c7;color:#92400e}
  .ah-badge-approved{background:#d1fae5;color:#065f46}
  .ah-badge-rejected{background:#fee2e2;color:#991b1b}
  .ah-badge-free{background:#f1f5f9;color:#64748b}
  .ah-badge-pro{background:#dbeafe;color:#1e40af}
  .ah-badge-premium{background:#fef3c7;color:#92400e}
  .ah-section{display:none}
  .ah-section.active{display:block}
  .ah-empty{text-align:center;padding:40px;color:#94a3b8}
  .ah-table{width:100%;border-collapse:collapse}
  .ah-table th{text-align:left;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;text-transform:uppercase;padding:8px 12px;border-bottom:1.5px solid #eef0f3}
  .ah-table td{padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#374151}
  .ah-search{width:100%;padding:10px 16px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;margin-bottom:16px;box-sizing:border-box}
  @media(max-width:768px){.ah-stats{grid-template-columns:1fr 1fr}.ah-table{font-size:12px}}
</style>

<div id="ahLogin" class="ah-login">
  <h2>Admin InmuHub</h2>
  <p style="color:#94a3b8;font-size:13px;margin:0 0 24px">Panel de administraci&oacute;n de la plataforma</p>
  <div class="ah-field"><label>Usuario</label><input type="text" id="ahUser" placeholder="admin"></div>
  <div class="ah-field"><label>Contrase&ntilde;a</label><input type="password" id="ahPass" placeholder="********"></div>
  <button class="ah-btn" style="width:100%" onclick="ahLogin()">Ingresar</button>
  <p id="ahLoginErr" style="color:#ef4444;font-size:13px;margin:8px 0 0;display:none"></p>
</div>

<div id="ahMain" class="ah-wrap" style="display:none">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
    <h1 style="font-family:'Cormorant Garamond',serif;font-size:2rem;margin:0;color:#0a1628">Admin InmuHub</h1>
    <button class="ah-btn" style="background:#64748b;font-size:12px" onclick="ahLogout()">Cerrar sesi&oacute;n</button>
  </div>

  <div class="ah-tabs">
    <div class="ah-tab active" onclick="ahTab('overview')">Overview</div>
    <div class="ah-tab" onclick="ahTab('asesores')">Asesores</div>
    <div class="ah-tab" onclick="ahTab('reviews')">Rese&ntilde;as</div>
    <div class="ah-tab" onclick="ahTab('payments')">Pagos</div>
  </div>

  <!-- OVERVIEW -->
  <div id="sec-overview" class="ah-section active">
    <div class="ah-stats">
      <div class="ah-stat"><div class="ah-stat-val" id="sTotal">0</div><div class="ah-stat-label">Asesores</div></div>
      <div class="ah-stat"><div class="ah-stat-val" id="sPending">0</div><div class="ah-stat-label">Pendientes</div></div>
      <div class="ah-stat"><div class="ah-stat-val" id="sProps">0</div><div class="ah-stat-label">Propiedades</div></div>
      <div class="ah-stat"><div class="ah-stat-val" id="sReviews">0</div><div class="ah-stat-label">Rese&ntilde;as pendientes</div></div>
      <div class="ah-stat"><div class="ah-stat-val" id="sPayments">0</div><div class="ah-stat-label">Pagos pendientes</div></div>
    </div>
    <h3 style="font-family:'Cormorant Garamond',serif;margin:0 0 16px">Asesores recientes</h3>
    <div id="ovRecent"></div>
  </div>

  <!-- ASESORES -->
  <div id="sec-asesores" class="ah-section">
    <input class="ah-search" placeholder="Buscar asesor..." oninput="ahFilterBrokers(this.value)">
    <div id="brokersList"></div>
  </div>

  <!-- REVIEWS -->
  <div id="sec-reviews" class="ah-section">
    <div id="reviewsList"></div>
  </div>

  <!-- PAYMENTS -->
  <div id="sec-payments" class="ah-section">
    <div id="paymentsList"></div>
  </div>
</div>

<script>
  var API = 'https://zona-inmu.tours-virtuales-gt.workers.dev';
  var brokers = [];
  var pendingReviews = [];
  var paymentRequests = [];

  function ahLogin() {
    var u = document.getElementById('ahUser').value;
    var p = document.getElementById('ahPass').value;
    fetch(API + '/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: u, password: p}),
      credentials: 'include'
    }).then(function(r) { return r.json(); }).then(function(d) {
      if (d.ok) {
        document.getElementById('ahLogin').style.display = 'none';
        document.getElementById('ahMain').style.display = '';
        loadAll();
      } else {
        document.getElementById('ahLoginErr').style.display = '';
        document.getElementById('ahLoginErr').textContent = d.error || 'Credenciales incorrectas';
      }
    }).catch(function() {
      document.getElementById('ahLoginErr').style.display = '';
      document.getElementById('ahLoginErr').textContent = 'Error de conexi&oacute;n';
    });
  }

  function ahLogout() {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    location.reload();
  }

  function ahTab(name) {
    document.querySelectorAll('.ah-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.ah-section').forEach(function(s) { s.classList.remove('active'); });
    event.target.classList.add('active');
    document.getElementById('sec-' + name).classList.add('active');
  }

  function loadAll() {
    loadBrokers();
    loadReviews();
    loadPayments();
  }

  // ── BROKERS ──
  function loadBrokers() {
    fetch(API + '/api/brokers', { credentials: 'include' })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      brokers = data || [];
      var pending = brokers.filter(function(b) { return b.status === 'pendiente'; });
      var approved = brokers.filter(function(b) { return b.status === 'aprobado'; });

      document.getElementById('sTotal').textContent = brokers.length;
      document.getElementById('sPending').textContent = pending.length;

      // Count properties
      var totalProps = 0;
      brokers.forEach(function(b) { totalProps += (b.propiedades || []).length; });
      document.getElementById('sProps').textContent = totalProps;

      // Recent brokers on overview
      var recent = brokers.slice().sort(function(a, b) {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }).slice(0, 5);
      var html = '';
      recent.forEach(function(b) {
        var badge = b.status === 'aprobado' ? 'approved' : b.status === 'pendiente' ? 'pending' : 'rejected';
        html += '<div class="ah-card"><div class="ah-card-head">'
          + '<div><strong>' + b.nombre + '</strong> <span class="ah-badge ah-badge-' + badge + '">' + b.status + '</span>'
          + ' <span class="ah-badge ah-badge-' + (b.plan || 'free') + '">' + (b.plan || 'free') + '</span></div>'
          + '<span style="font-size:12px;color:#94a3b8">' + (b.email || '') + '</span></div></div>';
      });
      document.getElementById('ovRecent').innerHTML = html || '<p class="ah-empty">No hay asesores</p>';

      renderBrokers(brokers);
    });
  }

  function renderBrokers(list) {
    var html = '';
    list.forEach(function(b) {
      var badge = b.status === 'aprobado' ? 'approved' : b.status === 'pendiente' ? 'pending' : 'rejected';
      var planBadge = b.plan || 'free';
      html += '<div class="ah-card"><div class="ah-card-head">'
        + '<div><strong style="font-size:15px">' + b.nombre + '</strong>'
        + ' <span class="ah-badge ah-badge-' + badge + '">' + b.status + '</span>'
        + ' <span class="ah-badge ah-badge-' + planBadge + '">' + planBadge + '</span>'
        + '<br><span style="font-size:12px;color:#94a3b8">' + (b.email || '') + ' &bull; ' + (b.telefono || '') + ' &bull; ' + ((b.propiedades || []).length) + ' props</span></div>'
        + '<div style="display:flex;gap:6px;flex-wrap:wrap">';

      if (b.status === 'pendiente') {
        html += '<button class="ah-btn ah-btn-sm ah-btn-green" onclick="approveBroker(&apos;' + b.id + '&apos;,&apos;aprobado&apos;)">Aprobar</button>'
          + '<button class="ah-btn ah-btn-sm ah-btn-danger" onclick="approveBroker(&apos;' + b.id + '&apos;,&apos;rechazado&apos;)">Rechazar</button>';
      }
      if (b.status === 'aprobado') {
        html += '<select onchange="changePlan(&apos;' + b.id + '&apos;,this.value)" style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:12px">'
          + '<option value="free"' + (b.plan === 'free' ? ' selected' : '') + '>Free</option>'
          + '<option value="pro"' + (b.plan === 'pro' ? ' selected' : '') + '>Pro</option>'
          + '<option value="premium"' + (b.plan === 'premium' ? ' selected' : '') + '>Premium</option>'
          + '</select>';
      }
      html += '</div></div></div>';
    });
    document.getElementById('brokersList').innerHTML = html || '<p class="ah-empty">No hay asesores</p>';
  }

  function ahFilterBrokers(q) {
    var filtered = brokers.filter(function(b) {
      var s = (b.nombre + ' ' + b.email + ' ' + b.status + ' ' + (b.plan || '')).toLowerCase();
      return s.indexOf(q.toLowerCase()) !== -1;
    });
    renderBrokers(filtered);
  }

  function approveBroker(id, status) {
    fetch(API + '/api/brokers/approve', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id, status: status}),
      credentials: 'include'
    }).then(function(r) { return r.json(); }).then(function() { loadBrokers(); });
  }

  function changePlan(id, plan) {
    fetch(API + '/api/brokers/plan', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id, plan: plan}),
      credentials: 'include'
    }).then(function(r) { return r.json(); }).then(function() { loadBrokers(); });
  }

  // ── REVIEWS ──
  function loadReviews() {
    fetch(API + '/api/admin/reviews/pending', { credentials: 'include' })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      pendingReviews = d.pending || [];
      document.getElementById('sReviews').textContent = pendingReviews.length;

      var html = '';
      if (!pendingReviews.length) {
        html = '<p class="ah-empty">No hay rese&ntilde;as pendientes</p>';
      }
      pendingReviews.forEach(function(r) {
        var stars = '';
        for (var i = 0; i < 5; i++) stars += i < r.rating ? '&#9733;' : '&#9734;';
        html += '<div class="ah-card">'
          + '<div class="ah-card-head"><div>'
          + '<strong>' + r.nombre + '</strong> <span style="color:var(--gold);letter-spacing:2px">' + stars + '</span>'
          + '<br><span style="font-size:12px;color:#94a3b8">Para: ' + (r.broker_name || r.broker_id) + '</span>'
          + '</div><div style="display:flex;gap:6px">'
          + '<button class="ah-btn ah-btn-sm ah-btn-green" onclick="moderateReview(&apos;' + r.broker_id + '&apos;,&apos;' + r.id + '&apos;,&apos;approved&apos;)">Aprobar</button>'
          + '<button class="ah-btn ah-btn-sm ah-btn-danger" onclick="moderateReview(&apos;' + r.broker_id + '&apos;,&apos;' + r.id + '&apos;,&apos;rejected&apos;)">Rechazar</button>'
          + '</div></div>'
          + '<p style="font-size:14px;color:#374151;margin:8px 0 0">' + r.comentario + '</p>'
          + '</div>';
      });
      document.getElementById('reviewsList').innerHTML = html;
    });
  }

  function moderateReview(brokerId, reviewId, status) {
    fetch(API + '/api/admin/reviews', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({broker_id: brokerId, review_id: reviewId, status: status}),
      credentials: 'include'
    }).then(function(r) { return r.json(); }).then(function() { loadReviews(); });
  }

  // ── PAYMENTS ──
  function loadPayments() {
    fetch(API + '/api/admin/payment-requests', { credentials: 'include' })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      paymentRequests = (d.requests || []).filter(function(p) { return p.status === 'pending'; });
      document.getElementById('sPayments').textContent = paymentRequests.length;

      var all = d.requests || [];
      var html = '';
      if (!all.length) {
        html = '<p class="ah-empty">No hay solicitudes de pago</p>';
      }
      all.forEach(function(p) {
        var badge = p.status === 'pending' ? 'pending' : p.status === 'confirmed' ? 'approved' : 'rejected';
        var labels = {pending: 'Pendiente', confirmed: 'Confirmado', rejected: 'Rechazado'};
        html += '<div class="ah-card">'
          + '<div class="ah-card-head"><div>'
          + '<strong>' + (p.broker_name || p.broker_id) + '</strong>'
          + ' <span class="ah-badge ah-badge-' + badge + '">' + (labels[p.status] || p.status) + '</span>'
          + '<br><span style="font-size:12px;color:#94a3b8">Plan: ' + p.plan + ' &bull; Ref: ' + (p.payment_reference || '-') + ' &bull; ' + new Date(p.created_at).toLocaleDateString() + '</span>'
          + '</div><div style="display:flex;gap:6px">';
        if (p.status === 'pending') {
          html += '<button class="ah-btn ah-btn-sm ah-btn-green" onclick="handlePayment(&apos;' + p.id + '&apos;,&apos;' + p.broker_id + '&apos;,&apos;confirmed&apos;)">Confirmar</button>'
            + '<button class="ah-btn ah-btn-sm ah-btn-danger" onclick="handlePayment(&apos;' + p.id + '&apos;,&apos;' + p.broker_id + '&apos;,&apos;rejected&apos;)">Rechazar</button>';
        }
        html += '</div></div></div>';
      });
      document.getElementById('paymentsList').innerHTML = html;
    });
  }

  function handlePayment(paymentId, brokerId, status) {
    fetch(API + '/api/admin/payment-requests', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({payment_id: paymentId, broker_id: brokerId, status: status}),
      credentials: 'include'
    }).then(function(r) { return r.json(); }).then(function() {
      loadPayments();
      loadBrokers();
    });
  }

  // Auto-login check
  fetch(API + '/api/brokers', { credentials: 'include' })
  .then(function(r) {
    if (r.ok) {
      document.getElementById('ahLogin').style.display = 'none';
      document.getElementById('ahMain').style.display = '';
      loadAll();
    }
  }).catch(function() {});
<\/script>
`;

  return layout({
    title: 'Admin InmuHub',
    desc: 'Panel de administración de InmuHub',
    canonical: '/admin-hub.html',
    body: body,
    noindex: true
  });
}

module.exports = { adminHubPage };
