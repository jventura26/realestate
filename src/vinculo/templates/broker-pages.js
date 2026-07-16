const { layout } = require('./layout');
const { card } = require('./card');
const { escapeHtml } = require('../../shared/utils');

// ── Broker Profile Page ─────────────────────────────────────
function brokerProfilePage(broker, allProps) {
  const b = broker;
  const brokerProps = allProps.filter(function(p) {
    return p.asesor_id === b.id || p.asesor_slug === b.slug;
  });
  const propsHTML = brokerProps.length > 0
    ? '<div class="prop-grid">' + brokerProps.map(function(p){ return card(p); }).join('') + '</div>'
    : '<div style="text-align:center;padding:60px 20px;color:#94a3b8;font-size:15px">Este asesor aún no tiene propiedades publicadas.</div>';

  const zonasHTML = (b.zonas || []).map(function(z) {
    return '<span style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;background:#f8f9fb;border:1.5px solid #e2e8f0;border-radius:20px;font-size:13px;font-weight:500;color:#1a2a4e">' + escapeHtml(z) + '</span>';
  }).join('');

  const espHTML = (b.especialidad || []).map(function(e) {
    return '<span style="display:inline-flex;align-items:center;gap:4px;padding:5px 14px;background:rgba(201,169,110,.1);border:1.5px solid rgba(201,169,110,.3);border-radius:20px;font-size:13px;font-weight:500;color:#8B6914">' + escapeHtml(e) + '</span>';
  }).join('');

  const stars = b.rating ? (function() {
    var full = Math.floor(b.rating);
    var half = b.rating % 1 >= 0.5 ? 1 : 0;
    var s = '';
    for (var i = 0; i < full; i++) s += '<span style="color:#F59E0B;font-size:18px">&#9733;</span>';
    if (half) s += '<span style="color:#F59E0B;font-size:18px;opacity:.5">&#9733;</span>';
    return s + ' <span style="font-size:14px;font-weight:700;color:#374151;margin-left:4px">' + b.rating.toFixed(1) + '</span>';
  })() : '';

  const verificadoBadge = b.verificado
    ? '<span style="display:inline-flex;align-items:center;gap:6px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:100px;padding:6px 16px;font-size:12px;font-weight:700;color:#065F46;letter-spacing:.03em"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#065F46" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Verificado</span>'
    : '';

  const waLink = b.whatsapp
    ? 'https://wa.me/' + String(b.whatsapp).replace(/[^0-9]/g,'') + '?text=' + encodeURIComponent('Hola ' + b.nombre + ', vi tu perfil en InmuHub y me interesa consultar sobre propiedades.')
    : '';

  const body = `
<style>
.broker-hero{padding:0 6%;background:linear-gradient(135deg,#0a1628 0%,#0f1e38 50%,#0a1628 100%);position:relative;overflow:hidden}
.broker-hero::before{content:'';position:absolute;top:-200px;right:-100px;width:600px;height:600px;background:radial-gradient(circle,rgba(201,169,110,.08) 0%,transparent 70%);pointer-events:none}
.broker-hero-inner{max-width:1200px;margin:0 auto;padding:80px 0 60px;display:flex;gap:48px;align-items:center;position:relative;z-index:2}
.broker-avatar{width:180px;height:180px;border-radius:24px;object-fit:cover;border:3px solid rgba(201,169,110,.4);box-shadow:0 20px 50px rgba(0,0,0,.3);flex-shrink:0}
.broker-avatar-placeholder{width:180px;height:180px;border-radius:24px;background:linear-gradient(135deg,#1a3a5c,#0a1628);border:3px solid rgba(201,169,110,.4);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',Georgia,serif;font-size:4rem;font-weight:300;color:var(--gold);flex-shrink:0}
.broker-info h1{font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2rem,4vw,3rem);font-weight:300;color:white;margin:0 0 8px;line-height:1.1}
.broker-title-role{font-size:14px;font-weight:500;color:rgba(255,255,255,.5);letter-spacing:.06em;margin-bottom:16px}
.broker-meta{display:flex;flex-wrap:wrap;gap:20px;margin-bottom:20px}
.broker-meta-item{display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(255,255,255,.7)}
.broker-meta-item strong{color:var(--gold);font-weight:700}
.broker-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}
.broker-cta a{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;transition:all .3s}
.broker-cta-wa{background:#25D366;color:white}
.broker-cta-wa:hover{background:#1da851}
.broker-cta-contact{background:rgba(201,169,110,.15);color:var(--gold);border:1px solid rgba(201,169,110,.35)}
.broker-cta-contact:hover{background:rgba(201,169,110,.25)}
@media(max-width:768px){
.broker-hero-inner{flex-direction:column;text-align:center;padding:48px 0 40px}
.broker-cta{justify-content:center}
.broker-meta{justify-content:center}
}
</style>

<div class="broker-hero">
  <div class="broker-hero-inner">
    ${b.foto
      ? '<img class="broker-avatar" src="' + escapeHtml(b.foto) + '" alt="' + escapeHtml(b.nombre) + '">'
      : '<div class="broker-avatar-placeholder">' + escapeHtml((b.nombre||'A').charAt(0)) + '</div>'}
    <div class="broker-info">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:8px">${verificadoBadge}</div>
      <h1>${escapeHtml(b.nombre)}</h1>
      <div class="broker-title-role">${escapeHtml(b.titulo || 'Asesor Inmobiliario')}</div>
      <div class="broker-meta">
        <div class="broker-meta-item"><strong>${brokerProps.length}</strong> propiedades activas</div>
        <div class="broker-meta-item">${escapeHtml(b.response_time || 'Menos de 2 horas')}</div>
        ${stars ? '<div class="broker-meta-item">' + stars + '</div>' : ''}
      </div>
      <div class="broker-cta">
        ${waLink ? '<a class="broker-cta-wa" href="' + waLink + '" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.353 0-4.556-.685-6.41-1.857l-.447-.282-3.088 1.035 1.035-3.088-.282-.447A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg> WhatsApp</a>' : ''}
        <a class="broker-cta-contact" href="/propiedades.html">Ver todas las propiedades</a>
      </div>
    </div>
  </div>
</div>

<section style="padding:60px 6%;background:white">
  <div style="max-width:1200px;margin:0 auto">
    ${b.bio ? '<div style="max-width:700px;margin-bottom:48px"><div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:12px">Sobre ' + escapeHtml(b.nombre.split(' ')[0]) + '</div><p style="font-size:15px;line-height:1.9;color:#374151">' + escapeHtml(b.bio) + '</p></div>' : ''}
    ${zonasHTML ? '<div style="margin-bottom:32px"><div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:12px">Zonas de operación</div><div style="display:flex;flex-wrap:wrap;gap:8px">' + zonasHTML + '</div></div>' : ''}
    ${espHTML ? '<div style="margin-bottom:48px"><div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:12px">Especialidades</div><div style="display:flex;flex-wrap:wrap;gap:8px">' + espHTML + '</div></div>' : ''}
  </div>
</section>

<section style="padding:60px 6%;background:#f8f9fb">
  <div style="max-width:1200px;margin:0 auto">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px;flex-wrap:wrap;gap:16px">
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Propiedades de ${escapeHtml(b.nombre.split(' ')[0])}</div>
        <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:300;color:#0a1628;margin:0">${brokerProps.length} propiedad${brokerProps.length !== 1 ? 'es' : ''} <em style="font-style:italic">activa${brokerProps.length !== 1 ? 's' : ''}</em></h2>
      </div>
    </div>
    ${propsHTML}
  </div>
</section>
`;

  return layout({
    title: b.nombre + ' — Asesor Inmobiliario',
    desc: (b.bio || b.nombre + ' es asesor inmobiliario verificado en InmuHub.') + ' ' + brokerProps.length + ' propiedades activas en Guatemala.',
    canonical: '/asesores/' + b.slug + '.html',
    ogImage: b.foto || undefined,
    body: body
  });
}

// ── Broker Card (for directory) ─────────────────────────────
function brokerCard(b) {
  const initials = (b.nombre || 'A').split(' ').map(function(w){ return w.charAt(0); }).join('').slice(0,2);
  const verificado = b.verificado
    ? '<span style="position:absolute;top:12px;right:12px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:20px;padding:3px 10px;font-size:10px;font-weight:700;color:#065F46;letter-spacing:.03em;z-index:2">Verificado</span>'
    : '';
  const destacado = b.destacado
    ? '<span style="position:absolute;top:12px;left:12px;background:#F59E0B;color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 8px rgba(245,158,11,.4);z-index:2">&#9733;</span>'
    : '';
  const zonas = (b.zonas || []).slice(0,3).join(' · ');
  const stars = b.rating ? '<span style="color:#F59E0B;font-size:13px">&#9733;</span> <span style="font-size:13px;font-weight:700;color:#374151">' + b.rating.toFixed(1) + '</span>' : '';

  return `<a href="/asesores/${escapeHtml(b.slug)}.html" style="display:flex;flex-direction:column;background:white;border-radius:16px;overflow:hidden;text-decoration:none;color:inherit;border:1.5px solid #eef0f3;transition:all .35s;box-shadow:0 2px 8px rgba(0,0,0,.04)" onmouseover="this.style.transform='translateY(-6px)';this.style.boxShadow='0 20px 50px rgba(0,0,0,.12)';this.style.borderColor='var(--gold)'" onmouseout="this.style.transform='none';this.style.boxShadow='0 2px 8px rgba(0,0,0,.04)';this.style.borderColor='#eef0f3'">
    <div style="position:relative;padding:32px 24px 24px;background:linear-gradient(135deg,#0a1628,#1a3a5c);text-align:center">
      ${verificado}${destacado}
      ${b.foto
        ? '<img src="' + escapeHtml(b.foto) + '" alt="' + escapeHtml(b.nombre) + '" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid rgba(201,169,110,.4);margin:0 auto 16px;display:block">'
        : '<div style="width:80px;height:80px;border-radius:50%;background:rgba(201,169,110,.15);border:3px solid rgba(201,169,110,.4);display:flex;align-items:center;justify-content:center;font-family:Cormorant Garamond,Georgia,serif;font-size:1.8rem;font-weight:300;color:var(--gold);margin:0 auto 16px">' + escapeHtml(initials) + '</div>'}
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:1.3rem;font-weight:400;color:white;margin-bottom:4px">${escapeHtml(b.nombre)}</div>
      <div style="font-size:12px;color:rgba(255,255,255,.5)">${escapeHtml(b.titulo || 'Asesor Inmobiliario')}</div>
    </div>
    <div style="padding:20px 24px 24px;flex:1;display:flex;flex-direction:column">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #eef0f3">
        <div style="font-size:13px;color:#64748b"><strong style="color:#0a1628">${b.propiedades_count || 0}</strong> propiedades</div>
        <div>${stars}</div>
      </div>
      ${zonas ? '<div style="font-size:12px;color:#94a3b8;margin-bottom:12px">' + escapeHtml(zonas) + '</div>' : ''}
      <div style="margin-top:auto;font-size:12px;font-weight:600;color:var(--gold);letter-spacing:.04em">Ver perfil &#8594;</div>
    </div>
  </a>`;
}

// ── Brokers Directory Page ──────────────────────────────────
function brokersDirectoryPage(brokers) {
  const activeBrokers = brokers.filter(function(b){ return b.activo !== false; });
  const destacados = activeBrokers.filter(function(b){ return b.destacado; });
  const todos = activeBrokers.sort(function(a,b){ return (b.destacado?1:0) - (a.destacado?1:0); });

  const cardsHTML = todos.map(function(b){ return brokerCard(b); }).join('');

  const body = `
<section style="padding:80px 6% 60px;background:linear-gradient(135deg,#0a1628 0%,#0f1e38 50%,#0a1628 100%);position:relative;overflow:hidden;text-align:center">
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(201,168,76,.06) 0%,transparent 65%);pointer-events:none"></div>
  <div style="position:relative;z-index:2;max-width:700px;margin:0 auto">
    <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(201,169,110,.12);border:1px solid rgba(201,169,110,.3);border-radius:100px;padding:6px 16px;margin-bottom:24px">
      <span style="width:6px;height:6px;background:var(--gold);border-radius:50%;display:inline-block"></span>
      <span style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)">Asesores verificados</span>
    </div>
    <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2.5rem,5vw,3.5rem);font-weight:300;color:white;margin:0 0 16px;line-height:1.1">
      Asesores inmobiliarios<br><em style="font-style:italic;color:var(--gold)">de confianza</em>
    </h1>
    <p style="font-size:15px;color:rgba(255,255,255,.5);line-height:1.8;max-width:520px;margin:0 auto">${activeBrokers.length} asesores profesionales listos para ayudarte a encontrar tu propiedad ideal en Guatemala.</p>
  </div>
</section>

<section style="padding:60px 6%;background:#f8f9fb">
  <div style="max-width:1200px;margin:0 auto">
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:28px">
      ${cardsHTML || '<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:#94a3b8;font-size:16px">Pronto publicaremos nuestro directorio de asesores verificados.</div>'}
    </div>
  </div>
</section>

<section style="padding:80px 6%;background:white;text-align:center">
  <div style="max-width:600px;margin:0 auto">
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:300;color:#0a1628;margin:0 0 16px">Eres asesor inmobiliario?</h2>
    <p style="font-size:15px;color:#64748b;line-height:1.8;margin-bottom:32px">Publica tus propiedades en InmuHub y recibe leads directamente en tu WhatsApp. Sin comisiones. Sin intermediarios.</p>
    <a href="/planes.html" style="display:inline-flex;align-items:center;gap:8px;background:var(--gold);color:#0a1628;font-size:14px;font-weight:700;letter-spacing:.04em;padding:15px 32px;border-radius:8px;text-decoration:none;transition:all .3s" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Ver planes y precios &#8594;</a>
  </div>
</section>
`;

  return layout({
    title: 'Asesores Inmobiliarios Verificados en Guatemala',
    desc: activeBrokers.length + ' asesores inmobiliarios verificados en Guatemala. Encuentra el asesor ideal para comprar, vender o invertir en propiedades premium.',
    canonical: '/asesores.html',
    body: body
  });
}

module.exports = { brokerProfilePage, brokersDirectoryPage, brokerCard };
