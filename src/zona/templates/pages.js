const { layout, WA }       = require('./layout');
const { escapeHtml, uniqueValues, getRelated } = require('../../shared/utils');

const DOMAIN = 'https://zona-innmueble.com';

const WA_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

function waLink(msg) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

// ── Card ─────────────────────────────────────────────────────────────
function card(p) {
  const img = p.mainImageThumb || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70';
  const badgeClass = (p.cinta||'').toLowerCase() === 'renta' ? 'renta' : '';
  const badge = p.cinta || '';
  const meta = [];
  if (p.habitaciones && p.habitaciones !== '0') meta.push(`${p.habitaciones} Hab.`);
  if (p.banos        && p.banos        !== '0') meta.push(`${p.banos} Baños`);
  if (ca(p.areaConst)) meta.push(ca(p.areaConst));

  return `<a class="prop-card" href="/propiedades/${p.slug}.html"
  data-tipo="${escapeHtml(p.tipo)}" data-ciudad="${escapeHtml(p.municipio)}"
  data-cinta="${escapeHtml(p.cinta)}" data-precio="${p.priceNumeric}"
  data-habs="${p.habitaciones||0}">
  <img referrerpolicy="no-referrer" src="${escapeHtml(img)}" alt="${escapeHtml(p.title)}" loading="lazy">
  <div class="pc-ov"></div>
  ${badge ? `<span class="pc-badge ${badgeClass}">${escapeHtml(badge)}</span>` : ''}
  <div class="pc-info">
    <div class="pc-tipo">${escapeHtml(p.tipo)} · ${escapeHtml(p.municipio)}</div>
    <div class="pc-title">${escapeHtml(p.title)}</div>
    ${meta.length ? `<div class="pc-meta">${meta.map(m=>`<span>${m}</span>`).join('')}</div>` : ''}
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div class="pc-price">${escapeHtml(p.priceFormatted)}</div>
      <span class="pc-arr">→</span>
    </div>
  </div>
</a>`;
}

// ── INDEX ─────────────────────────────────────────────────────────────
function ca(area) {
  if (!area) return '';
  const s = String(area).trim().replace(/^'+/, '');
  if (!s || s === '0' || s === '-' || s === '--' || s === '---') return '';
  if (/^0\s*(v²|m²|v2|m2)?$/.test(s)) return '';
  return s;
}

function renderCaracteristicas(chars) {
  if (!chars || !chars.length) return '';
  const grupos = {
    'Ubicacion': ['Ubicacion privilegiada','Sobre carretera','Entorno natural y vistas','Cerca de servicios','Zona residencial','Acceso pavimentado'],
    'Terreno': ['Amplio espacio','Topografia aprovechable','Acceso a servicios','Vista al valle','Terreno plano','Con jardin'],
    'Ideal para': ['Casa de descanso','Proyecto agricola','Desarrollo habitacional','Hotel ecologico','Inversion','Vivienda familiar'],
    'Amenidades': ['Piscina','Jardin','Pergola','Chimenea','Jacuzzi','Churrasquera','Terraza','Estudio','Cuarto de servicio','Bodega'],
    'Inversion': ['Alta plusvalia','Zona en crecimiento','Papeleria en orden','Sin gravamenes','Financiamiento disponible','Negociable'],
  };
  const emojis = {
    'Ubicacion privilegiada':'📍','Sobre carretera':'🚗','Entorno natural y vistas':'🌄','Cerca de servicios':'🏙️','Zona residencial':'🏘️','Acceso pavimentado':'🛣️',
    'Amplio espacio':'📏','Topografia aprovechable':'🌳','Acceso a servicios':'💧','Vista al valle':'🌅','Terreno plano':'⬜','Con jardin':'🌿',
    'Casa de descanso':'🏡','Proyecto agricola':'🌱','Desarrollo habitacional':'🏘️','Hotel ecologico':'🏢','Inversion':'📈','Vivienda familiar':'👨‍👩‍👧',
    'Piscina':'🏊','Jardin':'🌿','Pergola':'⛺','Chimenea':'🔥','Jacuzzi':'🛁','Churrasquera':'🍖','Terraza':'🌇','Estudio':'💼','Cuarto de servicio':'🛏','Bodega':'📦',
    'Alta plusvalia':'📈','Zona en crecimiento':'🚀','Papeleria en orden':'📄','Sin gravamenes':'✅','Financiamiento disponible':'🏦','Negociable':'🤝',
  };
  let html = '<div style="margin-top:32px"><div style="font-size:.57rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--or);margin-bottom:16px">Caracteristicas</div>';
  Object.entries(grupos).forEach(([grupo, items]) => {
    const activos = items.filter(i => chars.includes(i));
    if (!activos.length) return;
    html += '<div style="margin-bottom:14px"><div style="font-size:.6rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--mt);margin-bottom:8px">' + grupo + '</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
    activos.forEach(item => {
      const emoji = emojis[item] || '';
      html += '<span style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;background:rgba(255,255,255,.05);border:1px solid var(--gl);border-radius:20px;font-size:.72rem;color:var(--sv)">' + emoji + ' ' + item + '</span>';
    });
    html += '</div></div>';
  });
  html += '</div>';
  return html;
}

function renderDesc(desc) {
  if (!desc) return '';
  const label = '<div style="font-size:.57rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--or);margin-bottom:12px">Descripcion</div>';
  // JSON de Wix
  if (desc.trim().startsWith('{') || desc.includes('"nodes"')) {
    try {
      const texts = []; let m; const re = /"text":"([^"]+)"/g;
      while ((m = re.exec(desc)) !== null) { const t = m[1].trim(); if (t && t.length > 1) texts.push(t); }
      const clean = texts.join(' ');
      return clean ? label + '<p class="det-desc">' + escapeHtml(clean) + '</p>' : '';
    } catch(e) { return ''; }
  }
  // Detectar emojis como separadores
  const emojiRe = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
  if (emojiRe.test(desc)) {
    const parts = desc.split(/(?=\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu).map(s => s.trim()).filter(s => s);
    if (parts.length > 1) {
      const html = parts.map(part => {
        const em = part.match(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]️?/u);
        const emoji = em ? em[0] : '';
        const text = part.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]️?\s*/u, '').trim();
        if (!text) return '';
        return '<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 10px;margin-bottom:5px;background:rgba(255,255,255,.03);border-radius:5px;border-left:2px solid var(--or)">'
          + '<span style="font-size:1rem;flex-shrink:0">' + emoji + '</span>'
          + '<span style="font-size:.84rem;color:var(--sv);line-height:1.65">' + escapeHtml(text) + '</span>'
          + '</div>';
      }).filter(Boolean).join('');
      return label + '<div class="det-desc-list">' + html + '</div>';
    }
  }
  // Texto plano con saltos de linea
  const lines = desc.split('\n').map(l => l.trim()).filter(l => l);
  const html = lines.map(l => '<p style="font-size:.84rem;color:var(--sv);line-height:1.7;margin-bottom:8px">' + escapeHtml(l) + '</p>').join('');
  return label + '<div class="det-desc">' + html + '</div>';
}

function indexPage(props) {
  const featured = props.slice(0, 6);
  const tipos    = uniqueValues(props, 'tipo');

  const body = `
<!-- HERO -->
<section style="min-height:93vh;position:relative;display:flex;align-items:center;overflow:hidden;padding:0 6%;background:var(--ink)">
  <div style="position:absolute;inset:0;background:linear-gradient(105deg,rgba(13,27,62,.97) 0%,rgba(13,27,62,.68) 55%,rgba(20,34,64,.9) 100%),url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=70') center/cover no-repeat"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,62,.65) 0%,transparent 40%)"></div>
  <div style="position:relative;z-index:2;max-width:760px;padding:100px 0 130px">
    <div class="ey">Guatemala · Patrimonio Inmobiliario</div>
    <h1 style="font-family:'Cormorant Garamond',serif;font-size:clamp(3rem,6.5vw,5.4rem);font-weight:300;line-height:1.06;margin-bottom:22px">
      En Guatemala, la diferencia entre una casa y una <em style="color:var(--or);font-style:italic">residencia exclusiva</em> está en cada detalle.
    </h1>
    <p style="font-size:.85rem;font-weight:300;color:var(--sv);line-height:1.9;max-width:480px;margin-bottom:44px">
      ${props.length} propiedades verificadas, oportunidades de inversión y un equipo que entiende que cada propiedad cuenta una historia. Asesoría privada para quienes saben qué buscan.
    </p>
    <!-- BUSCADOR HERO -->
    <div style="background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:8px;display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px;max-width:620px">
      <div style="flex:1;min-width:200px;position:relative">
        <input type="text" id="hero-search"
          placeholder="Buscar por zona, tipo o colonia..."
          style="width:100%;padding:12px 16px 12px 40px;background:transparent;border:none;color:white;font-size:.88rem;font-family:'Montserrat',sans-serif;outline:none"
          oninput="heroSearch(this.value)"
          onkeydown="if(event.key==='Enter')heroGo()">
        <svg style="position:absolute;left:12px;top:50%;transform:translateY(-50%);opacity:.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <div id="hero-suggestions" style="display:none;position:absolute;top:100%;left:0;right:0;background:#0d1b3e;border:1px solid var(--gl);border-radius:8px;margin-top:4px;z-index:100;max-height:200px;overflow-y:auto"></div>
      </div>
      <select id="hero-tipo" style="padding:12px 14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:white;font-size:.82rem;font-family:'Montserrat',sans-serif;cursor:pointer;min-width:130px">
        <option value="">Tipo de propiedad</option>
        ${tipos.map(t=>`<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('')}
      </select>
      <button onclick="heroGo()" style="padding:12px 22px;background:var(--or);color:var(--ink);border:none;border-radius:8px;font-weight:700;font-size:.82rem;cursor:pointer;white-space:nowrap;font-family:'Montserrat',sans-serif">Buscar</button>
    </div>
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      <a href="https://wa.me/50245542088?text=${encodeURIComponent('Hola, quiero una asesoría privada de Zona INNmueble.')}" target="_blank" rel="noopener" class="btn-ol">${WA_SVG} Asesoría por WhatsApp</a>
    </div>
    <script>
    var __heroProps=${JSON.stringify(props.map(p=>({titulo:p.titulo,municipio:p.municipio,tipo:p.tipo,slug:p.slug})))};
    function heroSearch(q){
      var s=document.getElementById('hero-suggestions');
      if(!q||q.length<2){s.style.display='none';return;}
      var ql=q.toLowerCase();
      var matches=__heroProps.filter(function(p){
        return (p.titulo||'').toLowerCase().includes(ql)||(p.municipio||'').toLowerCase().includes(ql);
      }).slice(0,6);
      if(!matches.length){s.style.display='none';return;}
      s.innerHTML=matches.map(function(p){
        return '<div onclick="window.location.href=\'/propiedades/'+p.slug+'.html\'" style="padding:10px 14px;cursor:pointer;font-size:.82rem;color:rgba(255,255,255,.85);border-bottom:1px solid rgba(255,255,255,.06)" onmouseover="this.style.background=\'rgba(245,130,13,.15)\'" onmouseout="this.style.background=\'\'">'
          +'<span style="font-weight:600">'+p.titulo+'</span>'
          +' <span style="opacity:.5;font-size:.75rem">'+p.municipio+'</span>'
          +'</div>';
      }).join('');
      s.style.display='block';
    }
    function heroGo(){
      var q=document.getElementById('hero-search').value;
      var t=document.getElementById('hero-tipo').value;
      var url='/propiedades.html';
      var params=[];
      if(t)params.push('tipo='+encodeURIComponent(t));
      if(q)params.push('q='+encodeURIComponent(q));
      if(params.length)url+='?'+params.join('&');
      window.location.href=url;
    }
    document.addEventListener('click',function(e){
      if(!e.target.closest('#hero-search')&&!e.target.closest('#hero-suggestions')){
        var s=document.getElementById('hero-suggestions');
        if(s)s.style.display='none';
      }
    });
    <\/script>
  </div>
  <!-- Stats bar -->
  <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(20,34,64,.8);backdrop-filter:blur(16px);border-top:1px solid var(--gl);display:flex;justify-content:center;flex-wrap:wrap">
    ${[
      [props.length+'+'  ,'Propiedades'],
      ['10+','Años en el Mercado'],
      ['5','Zonas Premium'],
      ['100%','Asesoría Personal'],
    ].map(([n,l])=>`<div style="padding:20px 44px;text-align:center;border-right:1px solid var(--bd);flex:1;max-width:220px;min-width:140px">
      <div style="font-family:'Cormorant Garamond',serif;font-size:2.1rem;font-weight:500;color:var(--or);line-height:1;margin-bottom:5px">${n}</div>
      <div style="font-size:.58rem;font-weight:500;letter-spacing:.19em;text-transform:uppercase;color:var(--mt)">${l}</div>
    </div>`).join('')}
  </div>
</section>

<!-- FEATURED -->
<section style="padding:80px 0 0;background:var(--ink2)" class="fade-in-up">
  <div style="padding:0 6% 44px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:18px">
    <div>
      <div class="ey">Propiedades Verificadas</div>
      <h2 class="st">Cada detalle <em>cuenta una historia</em></h2>
      <p style="font-size:.8rem;color:var(--sv);max-width:400px;margin-top:12px;line-height:1.7">${props.length} propiedades cuidadosamente seleccionadas en las zonas más exclusivas de Guatemala.</p>
    </div>
    <a href="/propiedades.html" style="font-size:.67rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--or);transition:all .3s" onmouseover="this.style.color='var(--or2)'" onmouseout="this.style.color='var(--or)'">Ver todas →</a>
  </div>
  <div class="prop-grid">${featured.map(p=>card(p)).join('')}</div>
  <div style="text-align:center;padding:44px 6%">
    <a href="/propiedades.html" class="btn-or">Ver catálogo completo</a>
  </div>
</section>

<!-- TESTIMONIOS (FASE 1) -->

<!-- CTA INTERMEDIO -->
<div class="cta-banner fade-in-up">
  <div class="ey" style="justify-content:center;margin-bottom:12px">Asesoría privada</div>
  <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:300;color:var(--wh);margin-bottom:16px;line-height:1.2">
    ¿No encontraste lo que buscas?
  </h2>
  <p style="font-size:.85rem;color:var(--sv);margin-bottom:32px;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.8">
    Cuéntanos qué necesitas y nuestro equipo te presenta opciones exclusivas que no están publicadas.
  </p>
  <a href="https://wa.me/50245542088?text=${encodeURIComponent('Hola, busco una propiedad específica y quisiera asesoría privada.')}" target="_blank" rel="noopener" class="wa-btn" style="display:inline-flex;width:auto;justify-content:center;padding:14px 32px;font-size:.72rem">
    ${WA_SVG} Escribir al asesor
  </a>
</div>
<section style="padding:80px 6%;background:var(--ink2);border-top:1px solid var(--gl)">
  <div style="max-width:1200px;margin:0 auto">
    <div class="ey" style="justify-content:center;margin-bottom:12px">TESTIMONIOS VERIFICADOS</div>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:300;text-align:center;margin-bottom:60px;color:var(--wh)">
      Lo que dicen nuestros clientes
    </h2>
    
    <div class="testimonials-container" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:28px">
      <div class="testimonial-card fade-in-up" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px">
        <div style="display:flex;gap:3px;margin-bottom:20px">
          ${'★'.repeat(5).split('').map(s=>'<span style="color:var(--or);font-size:1.1rem">'+s+'</span>').join('')}
        </div>
        <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.9;font-size:.88rem">"Zona INNmueble me ayudó a encontrar la propiedad perfecta en Zona 10. El equipo fue muy profesional y comprensivo con mis necesidades. Altamente recomendado."</p>
        <div style="display:flex;align-items:center;gap:14px;padding-top:18px;border-top:1px solid var(--gl)">
          <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#1a2a4e,var(--navy));border:2px solid var(--or);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--or);flex-shrink:0">MC</div>
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem;margin-bottom:2px">María Castillo</div><div style="color:var(--or);font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Empresaria · Zona 10</div></div>
        </div>
      </div>
      
      <div class="testimonial-card fade-in-up delay-1" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px">
        <div style="display:flex;gap:3px;margin-bottom:20px">
          ${'★'.repeat(5).split('').map(s=>'<span style="color:var(--or);font-size:1.1rem">'+s+'</span>').join('')}
        </div>
        <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.9;font-size:.88rem">"Excelente asesoría para mi inversión inmobiliaria. Entendieron mi visión y me ofrecieron opciones que superaron mis expectativas. El proceso fue transparente y profesional."</p>
        <div style="display:flex;align-items:center;gap:14px;padding-top:18px;border-top:1px solid var(--gl)">
          <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#0d3d2a,#1a6b4a);border:2px solid var(--or);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--or);flex-shrink:0">CG</div>
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem;margin-bottom:2px">Carlos García</div><div style="color:var(--or);font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Inversionista · Fraijanes</div></div>
        </div>
      </div>
      
      <div class="testimonial-card fade-in-up delay-2" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px">
        <div style="display:flex;gap:3px;margin-bottom:20px">
          ${'★'.repeat(5).split('').map(s=>'<span style="color:var(--or);font-size:1.1rem">'+s+'</span>').join('')}
        </div>
        <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.9;font-size:.88rem">"El servicio es impecable. Desde la búsqueda hasta la finalización, todo fue smooth y profesional. Definitivamente mi opción número uno para propiedades premium."</p>
        <div style="display:flex;align-items:center;gap:14px;padding-top:18px;border-top:1px solid var(--gl)">
          <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#2d1a4e,#4a2d7a);border:2px solid var(--or);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--or);flex-shrink:0">SL</div>
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem;margin-bottom:2px">Sandra López</div><div style="color:var(--or);font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Ejecutiva · Zona 14</div></div>
        </div>
      </div>
    </div>
    
    <!-- TRUST BADGES -->
    <div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;padding:60px 0 0;border-top:1px solid var(--gl);margin-top:60px">
      <div style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">31 Propiedades</div>
      </div>
      <div style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">100% Verificadas</div>
      </div>
      <div style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">10+ Años</div>
      </div>
      <div style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">Soporte 24/7</div>
      </div>
    </div>
  </div>
</section>



<!-- TYPES -->
<style>.tipo-bg{transform:scale(1)}.tipo-line{height:28px}a:hover .tipo-bg{transform:scale(1.06)}a:hover .tipo-line{height:44px}</style>
<section style="background:var(--ink)" class="fade-in-up">
  <div style="max-width:560px;margin-bottom:52px">
    <div class="ey">Encuentra Tu Tipo Ideal</div>
    <h2 class="st">Un portafolio para <em>cada visión</em> de vida.</h2>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1px;background:var(--bd)">
    ${[
      ['Residencias Premium','Casas diseñadas para vivir. Zona 10, 14, 15, 16 y Cayalá. Privacidad, acceso y plusvalía.','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=70','/propiedades.html?tipo=Casa'],
      ['Apartamentos Selectos','Penthouse y apartamentos de alto nivel. Ubicaciones estratégicas con retorno de inversión potencial.','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=70','/propiedades.html?tipo=Apartamento'],
      ['Fincas & Terrenos','Propiedades rurales con potencial. Espacio, naturaleza y oportunidades de desarrollo.','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=70','/propiedades.html?tipo=Finca'],
      ['Inversión Inteligente','Identificamos oportunidades antes que el mercado. Asesoría con análisis de retorno real.','https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=70','/propiedades.html'],
    ].map(([nm,ds,img,href])=>`<a href="${href}" style="position:relative;overflow:hidden;cursor:pointer;display:block;text-decoration:none;min-height:320px;display:flex;align-items:flex-end">
      <div style="position:absolute;inset:0;background:url('${img}') center/cover no-repeat;transition:transform .6s cubic-bezier(.22,1,.36,1)" class="tipo-bg"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,62,.97) 0%,rgba(13,27,62,.4) 60%,rgba(13,27,62,.1) 100%);transition:all .4s"></div>
      <div style="position:relative;z-index:2;padding:32px 28px;width:100%">
        <div style="width:2px;height:28px;background:var(--or);margin-bottom:16px;transition:height .3s" class="tipo-line"></div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:400;color:var(--wh);margin-bottom:10px">${nm}</div>
        <p style="font-size:.72rem;color:rgba(255,255,255,.65);line-height:1.8;font-weight:300;margin-bottom:16px">${ds}</p>
        <span style="font-size:.6rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--or)">Ver propiedades →</span>
      </div>
    </a>`).join('')}
  </div>
</section>

<!-- CTA -->

<!-- SECCION ASESOR -->
<section style="padding:80px 6%;background:var(--ink)" class="fade-in-up">
  <div style="max-width:860px;margin:0 auto">
    <div class="ey" style="margin-bottom:12px">Tu asesor personal</div>
    <h2 class="st" style="margin-bottom:44px">Un equipo que conoce <em>cada propiedad</em></h2>
    <div class="asesor-card">
      <div class="asesor-avatar">ZI</div>
      <div style="flex:1">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:400;color:var(--wh);margin-bottom:6px">Equipo Zona INNmueble</div>
        <div style="font-size:.65rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--or);margin-bottom:16px">Asesores Inmobiliarios · Guatemala</div>
        <p style="font-size:.82rem;color:var(--sv);line-height:1.8;margin-bottom:22px;max-width:480px">Más de 10 años conectando familias e inversionistas con las mejores propiedades en Guatemala. Te acompañamos desde la búsqueda hasta el cierre.</p>
        <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center">
          <div style="display:flex;align-items:center;gap:6px"><span class="live"></span><span style="font-size:.75rem;color:var(--sv)">Disponible Lun–Vie 8:00–18:00</span></div>
          <a href="https://wa.me/50245542088?text=${encodeURIComponent('Hola, quiero asesoría privada de Zona INNmueble.')}" target="_blank" rel="noopener" class="wa-btn" style="display:inline-flex;width:auto;padding:10px 20px;font-size:.68rem;margin-bottom:0">${WA_SVG} Contactar ahora</a>
        </div>
      </div>
    </div>
  </div>
</section>
<section id="contacto" style="background:var(--ink2);position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=40') center/cover no-repeat;opacity:.03"></div>
  <div style="position:relative;z-index:1;max-width:620px;margin:0 auto;text-align:center">
    <div class="ey" style="justify-content:center">Contáctanos</div>
    <h2 class="st">Tu próxima propiedad empieza <em>con una conversación.</em></h2>
    <p style="font-size:.81rem;color:var(--sv);line-height:1.9;margin-bottom:40px;font-weight:300">Nuestro equipo está disponible para asesorarte de forma privada. Sin compromiso.</p>
    <div style="display:flex;flex-direction:column;gap:10px;max-width:340px;margin:0 auto">
      <a href="${waLink('Hola, me interesa una asesoría de Zona INNmueble.')}" target="_blank" rel="noopener" class="wa-btn" style="justify-content:center">${WA_SVG} Escribir por WhatsApp</a>
      <a href="/propiedades.html" class="btn-ol" style="justify-content:center">Ver propiedades disponibles</a>
    </div>
    <p style="margin-top:18px;font-size:.63rem;color:var(--mt)"><span class="live"></span>+502 4554-2088 · Lun–Vie 8:00–18:00</p>
  </div>
</section>`;

  return layout({ title: null, desc: `Propiedades premium en Guatemala. ${props.length} propiedades disponibles. Asesoría personalizada.`, canonical: '/', body });
}

// ── CATALOG ───────────────────────────────────────────────────────────
function catalogPage(props) {
  const tipos    = uniqueValues(props, 'tipo');
  const ciudades = uniqueValues(props, 'municipio');
  const cintas   = uniqueValues(props, 'cinta');

  const filterJS = `<script>
(function(){
  const grid=document.getElementById('g'),cnt=document.getElementById('fc');
  const cards=[...grid.querySelectorAll('.prop-card')];
  function run(){
    const q=document.getElementById('fq').value.toLowerCase();
    const ti=document.getElementById('ft').value,ci=document.getElementById('fc2').value;
    const ci2=document.getElementById('fc3').value,pr=document.getElementById('fp').value,hb=document.getElementById('fh').value;
    let n=0;
    cards.forEach(c=>{
      const ok=(!q||c.textContent.toLowerCase().includes(q))&&(!ti||c.dataset.tipo===ti)&&
        (!ci||c.dataset.ciudad===ci)&&(!ci2||c.dataset.cinta===ci2)&&
        (!hb||parseInt(c.dataset.habs)>=parseInt(hb))&&
        (()=>{const mn=parseFloat(document.getElementById('fp-min').value)||0;const mx=parseFloat(document.getElementById('fp-max').value)||0;const pv=parseFloat(c.dataset.precio)||0;return (!mn&&!mx)||(pv>=mn&&(!mx||pv<=mx));})();
      c.style.display=ok?'':'none';if(ok)n++;
    });
    cnt.textContent=n+' propiedad'+(n!==1?'es':'');
    document.getElementById('nr').style.display=n===0?'block':'none';
  }
  window.updatePriceBtn=function(){
    var mn=document.getElementById('fp-min').value;
    var mx=document.getElementById('fp-max').value;
    var btn=document.getElementById('price-btn');
    if(!mn&&!mx){btn.textContent='Precio: Cualquiera ▾';}
    else{btn.textContent='Precio: '+(mn?'$'+parseInt(mn).toLocaleString():'0')+' – '+(mx?'$'+parseInt(mx).toLocaleString():'sin límite')+' ▾';}
    run();
  };
  window.applyPrice=function(){
    document.getElementById('price-dropdown').style.display='none';
    run();
  };
  ['fq','ft','fc2','fc3','fh'].forEach(id=>{
    document.getElementById(id).addEventListener('input',run);
    document.getElementById(id).addEventListener('change',run);
  });
  document.getElementById('cl2').addEventListener('click',()=>{['fq','ft','fc2','fc3','fh'].forEach(id=>document.getElementById(id).value='');document.getElementById('fp-min').value='';document.getElementById('fp-max').value='';updatePriceBtn();run();});
  const p=new URLSearchParams(location.search);
  if(p.get('tipo'))  document.getElementById('ft').value=p.get('tipo');
  if(p.get('ciudad'))document.getElementById('fc2').value=p.get('ciudad');
  run();cnt.textContent='${props.length} propiedades';
})();</script>`;

  const body = `
<div style="background:var(--ink2);padding:42px 6% 34px;border-bottom:1px solid var(--bd)">
  <div class="ey">Catálogo Completo</div>
  <h1 class="st" style="margin-bottom:0">Propiedades <em>disponibles</em></h1>
</div>
<div class="filter-bar">
  <input id="fq" type="text" placeholder="Buscar propiedad, zona..." style="flex:1;min-width:170px">
  <select id="ft"><option value="">Tipo</option>${tipos.map(t=>`<option>${escapeHtml(t)}</option>`).join('')}</select>
  <select id="fc2"><option value="">Municipio</option>${ciudades.map(c=>`<option>${escapeHtml(c)}</option>`).join('')}</select>
  <select id="fc3"><option value="">Estado</option>${cintas.map(c=>`<option>${escapeHtml(c)}</option>`).join('')}</select>
  <div style="position:relative;min-width:180px">
    <button onclick="document.getElementById('price-dropdown').style.display=document.getElementById('price-dropdown').style.display==='block'?'none':'block'" id="price-btn" style="padding:9px 14px;background:var(--ink2);border:1px solid var(--gl);border-radius:6px;color:var(--sv);font-size:.78rem;font-family:inherit;cursor:pointer;white-space:nowrap;width:100%;text-align:left">Precio: Cualquiera ▾</button>
    <div id="price-dropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;background:#0d1b3e;border:1px solid var(--gl);border-radius:8px;padding:16px;z-index:50;width:260px;box-shadow:0 8px 32px rgba(0,0,0,.4)">
      <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--mt);margin-bottom:10px">Rango de precio</div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <div style="flex:1"><div style="font-size:.65rem;color:var(--mt);margin-bottom:4px">Mínimo</div>
        <input type="number" id="fp-min" placeholder="0" min="0" step="10000" style="width:100%;padding:7px 10px;background:rgba(255,255,255,.06);border:1px solid var(--gl);border-radius:6px;color:white;font-size:.78rem;font-family:inherit" oninput="updatePriceBtn()"></div>
        <div style="flex:1"><div style="font-size:.65rem;color:var(--mt);margin-bottom:4px">Máximo</div>
        <input type="number" id="fp-max" placeholder="Sin límite" min="0" step="10000" style="width:100%;padding:7px 10px;background:rgba(255,255,255,.06);border:1px solid var(--gl);border-radius:6px;color:white;font-size:.78rem;font-family:inherit" oninput="updatePriceBtn()"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
        ${[['Hasta $100K','0','100000'],['$100K–$300K','100000','300000'],['$300K–$600K','300000','600000'],['$600K–$1M','600000','1000000'],['Más de $1M','1000000',''],['Sin filtro','','']].map(([l,mn,mx])=>`<button onclick="document.getElementById('fp-min').value='${mn}';document.getElementById('fp-max').value='${mx}';updatePriceBtn();document.getElementById('price-dropdown').style.display='none';" style="padding:6px 8px;background:rgba(255,255,255,.06);border:1px solid var(--gl);border-radius:5px;color:var(--sv);font-size:.72rem;cursor:pointer;text-align:center;font-family:inherit">${l}</button>`).join('')}
      </div>
      <button onclick="applyPrice()" style="width:100%;padding:8px;background:var(--or);color:var(--ink);border:none;border-radius:6px;font-weight:700;font-size:.75rem;cursor:pointer;font-family:inherit">Aplicar</button>
    </div>
  </div>
  <input type="hidden" id="fp" value="">
  <select id="fh"><option value="">Habitaciones</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select>
  <button id="cl2">Limpiar</button>
  <span class="f-count" id="fc">${props.length} propiedades</span>
</div>
<div id="g" class="prop-grid" style="background:var(--ink);min-height:400px">
  ${props.map(p=>card(p)).join('')}
  <div id="nr" class="no-res" style="display:none">
    <p>Sin resultados</p>
    <small>Intenta otros filtros o <a href="https://wa.me/${WA}" style="color:var(--or)">contáctanos por WhatsApp</a></small>
  </div>
</div>`;

  return layout({ title: 'Catálogo Propiedades Premium Guatemala', desc: `${props.length} propiedades premium en Guatemala. Casas, apartamentos, fincas e inversiones con asesoría.`, canonical: '/propiedades.html', body, scripts: filterJS });
}

// ── DETAIL ────────────────────────────────────────────────────────────
function detailPage(prop, all) {
  const related  = getRelated(prop, all);
  const img      = prop.mainImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70';
  const propUrl  = `${DOMAIN}/propiedades/${prop.slug}.html`;

  // WhatsApp messages
  const msgInfo  = `Hola, me interesa la propiedad: ${prop.title}. Quiero solicitar más información. Link: ${propUrl}`;
  const msgVisit = `Hola, me interesa la propiedad: ${prop.title}. Quiero agendar una visita privada. Link: ${propUrl}`;
  const msgFin   = `Hola, me interesa la propiedad: ${prop.title}. Quiero consultar opciones de financiamiento. Link: ${propUrl}`;

  const specs = [
    { l:'Tipo',        v: prop.tipo },
    { l:'Estado',      v: prop.cinta||prop.estado },
    { l:'Condición',   v: prop.estado },
    { l:'Ubicación',   v: prop.locationFull },
    prop.habitaciones&&prop.habitaciones!=='0' ? { l:'Habitaciones', v: prop.habitaciones } : null,
    prop.banos&&prop.banos!=='0'               ? { l:'Baños',        v: prop.banos }        : null,
    prop.parqueos&&prop.parqueos!=='No'        ? { l:'Garaje',       v: prop.parqueos }     : null,
    ca(prop.areaConst) ? { l:'Area', v: ca(prop.areaConst) } : null,
    prop.terreno                               ? { l:'Terreno',      v: prop.terreno }      : null,
    prop.codigo                                ? { l:'Código',       v: prop.codigo }       : null,
  ].filter(Boolean);

  const gal    = prop.gallery.slice(0, 10);
  const galHtml= gal.length > 1
    ? `<div class="gal-mini">${gal.slice(1).map(src=>`<img referrerpolicy="no-referrer" src="${escapeHtml(src)}" alt="${escapeHtml(prop.title)}" loading="lazy" onclick="document.getElementById('mi').src=this.src">`).join('')}</div>` : '';

  const relHtml = related.length
    ? `<section class="related"><div class="ey">Relacionadas</div><h2 class="st">También te puede <em>interesar</em></h2><div class="prop-grid">${related.map(r=>card(r)).join('')}</div></section>` : '';

  // JSON-LD structured data
  const cleanDesc = (prop.description||'').replace(/"nodes".*$/s,'').replace(/[{}"\\]/g,'').substring(0,300).trim();
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": prop.title,
    "description": cleanDesc || prop.title,
    "url": propUrl,
    "image": prop.mainImage || '',
    "numberOfRooms": prop.habitaciones || undefined,
    "floorSize": prop.areaConst ? { "@type":"QuantitativeValue", "value": prop.areaConst } : undefined,
    "offers": {
      "@type": "Offer",
      "price": prop.priceNumeric || 0,
      "priceCurrency": (prop.priceFormatted||'').includes('$') ? 'USD' : 'GTQ',
      "availability": "https://schema.org/InStock"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": prop.municipio || 'Guatemala',
      "addressRegion": "Guatemala",
      "addressCountry": "GT"
    },
    "seller": {
      "@type": "RealEstateAgent",
      "name": "Zona INNmueble",
      "url": "https://zona-innmueble.com",
      "telephone": "+50245542088"
    }
  });

  const body = `
<script type="application/ld+json">${jsonLd}</script>
<div class="det-header">
  <div class="breadcrumb">
    <a href="/">Inicio</a>/<a href="/propiedades.html">Propiedades</a>/<span style="color:var(--sv)">${escapeHtml(prop.title)}</span>
  </div>
</div>
<div class="det-body">
  <!-- LEFT -->
  <div>
    <div class="main-img"><img referrerpolicy="no-referrer" id="mi" src="${escapeHtml(img)}" alt="${escapeHtml(prop.title)}"></div>
    ${galHtml}
    <div style="margin-top:42px">
      <div style="font-size:.57rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--or);margin-bottom:8px">${escapeHtml(prop.tipo)} · ${escapeHtml(prop.cinta||prop.estado||'')}</div>
      <h1 class="det-title">${escapeHtml(prop.title)}</h1>
      <div class="det-price">${escapeHtml(prop.priceFormatted)}</div>
      <div class="specs">${specs.map(s=>`<div class="sp"><div class="sp-l">${escapeHtml(s.l)}</div><div class="sp-v">${escapeHtml(String(s.v))}</div></div>`).join('')}</div>
      ${renderDesc(prop.description)}
      ${renderCaracteristicas(prop.caracteristicas||[])}
      ${prop.amenities?.length?`<div style="margin-bottom:22px">${prop.amenities.map(a=>`<span class="tag">${escapeHtml(a)}</span>`).join('')}</div>`:''}
    </div>
    <!-- MOBILE WA (hidden on desktop) -->
    <div style="display:none" id="mobileWa">
      <a href="${waLink(msgInfo)}"  target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Solicitar información</a>
      <a href="${waLink(msgVisit)}" target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Agendar visita privada</a>
      <a href="${waLink(msgFin)}"   target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Consultar financiamiento</a>
    </div>
  </div>
  <!-- SIDEBAR -->
  <div>
    <div class="sidebar">
      <div style="font-size:.57rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--or);margin-bottom:14px;display:flex;align-items:center"><span class="live"></span>Asesor Disponible</div>
      <div class="sb-title">¿Te interesa<br>esta propiedad?</div>
      <p class="sb-sub">Respuesta en menos de 1 hora por WhatsApp.</p>
      <a href="${waLink(msgInfo)}"  target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Solicitar información</a>
      <a href="${waLink(msgVisit)}" target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Agendar visita privada</a>
      <a href="${waLink(msgFin)}"   target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Consultar financiamiento</a>
      <div class="div-line"></div>
      <div style="text-align:center;font-size:.63rem;color:var(--mt);line-height:1.65">
        <strong style="display:block;color:var(--sv);margin-bottom:4px">+502 4554-2088</strong>
        Lun–Vie 8:00–18:00 · Sáb 9:00–14:00
      </div>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--gl)">
        <div style="font-size:.57rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--or);margin-bottom:14px">O deja tus datos</div>
        <form id="lead-form-${prop.slug}" onsubmit="var f=this;var t='Nuevo lead - '+f.propiedad.value+'%0ANombre: '+f.nombre.value+'%0ATelefono: '+f.telefono.value+'%0AMensaje: '+(f.mensaje.value||'Sin mensaje')+'%0AURL: ${propUrl}';window.open('https://wa.me/50245542088?text='+encodeURIComponent(t),'_blank');f.nextElementSibling.style.display='block';f.reset();return false;" style="display:flex;flex-direction:column;gap:8px">
          <input type="hidden" name="propiedad" value="${escapeHtml(prop.title)}">
          <input type="text" name="nombre" placeholder="Tu nombre" required style="padding:9px 12px;background:rgba(255,255,255,.05);border:1px solid var(--gl);color:var(--wh);font-size:.78rem;border-radius:3px;font-family:inherit" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='var(--gl)'">
          <input type="tel" name="telefono" placeholder="Tu teléfono" required style="padding:9px 12px;background:rgba(255,255,255,.05);border:1px solid var(--gl);color:var(--wh);font-size:.78rem;border-radius:3px;font-family:inherit" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='var(--gl)'">
          <textarea name="mensaje" placeholder="¿Qué deseas saber?" rows="2" style="padding:9px 12px;background:rgba(255,255,255,.05);border:1px solid var(--gl);color:var(--wh);font-size:.78rem;border-radius:3px;resize:none;font-family:inherit" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='var(--gl)'"></textarea>
          <button type="submit" style="padding:10px;background:var(--or);color:var(--ink);border:none;font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;border-radius:3px;font-family:inherit">Solicitar información</button>
        </form>
        <p style="display:none;font-size:.75rem;color:#4ade80;text-align:center;margin:8px 0 0">✓ Enviado. Te contactamos pronto.</p>
      </div>
    </div>
    <div style="margin-top:10px;background:var(--ink2);border:1px solid var(--bd);padding:18px 20px">
      <div style="font-size:.56rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:10px">Código de referencia</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;letter-spacing:.08em;color:var(--sv)">${escapeHtml(prop.codigo||prop.slug.toUpperCase())}</div>
    </div>
    <div style="margin-top:10px;background:var(--ink2);border:1px solid var(--bd);padding:18px 20px">
      <div style="font-size:.56rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:12px">Más propiedades</div>
      <a href="/propiedades.html?tipo=${encodeURIComponent(prop.tipo)}" style="display:block;font-size:.74rem;color:var(--sv);margin-bottom:7px;transition:color .2s" onmouseover="this.style.color='var(--or)'" onmouseout="this.style.color='var(--sv)'">→ Más ${escapeHtml(prop.tipo)}s disponibles</a>
      <a href="/propiedades.html?ciudad=${encodeURIComponent(prop.municipio)}" style="display:block;font-size:.74rem;color:var(--sv);transition:color .2s" onmouseover="this.style.color='var(--or)'" onmouseout="this.style.color='var(--sv)'">→ En ${escapeHtml(prop.municipio)}</a>
    </div>
  </div>
</div>
${relHtml}
<style>@media(max-width:768px){#mobileWa{display:block!important;margin-top:24px}}</style>`;

  const metaDesc = `${prop.tipo} en ${prop.locationFull}. ${prop.priceFormatted}. ${prop.habitaciones&&prop.habitaciones!=='0'?prop.habitaciones+' habitaciones. ':''}Consulta disponibilidad por WhatsApp.`;
  return layout({ title: prop.title, desc: metaDesc, canonical: `/propiedades/${prop.slug}.html`, ogImage: prop.mainImage, body });
}

module.exports = { indexPage, catalogPage, detailPage };

// ── TESTIMONIOS SECTION (FASE 1) ───────────────────────────────────
function testimonialsSection() {
  return `

<!-- CTA INTERMEDIO -->
<div class="cta-banner fade-in-up">
  <div class="ey" style="justify-content:center;margin-bottom:12px">Asesoría privada</div>
  <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:300;color:var(--wh);margin-bottom:16px;line-height:1.2">
    ¿No encontraste lo que buscas?
  </h2>
  <p style="font-size:.85rem;color:var(--sv);margin-bottom:32px;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.8">
    Cuéntanos qué necesitas y nuestro equipo te presenta opciones exclusivas que no están publicadas.
  </p>
  <a href="https://wa.me/50245542088?text=${encodeURIComponent('Hola, busco una propiedad específica y quisiera asesoría privada.')}" target="_blank" rel="noopener" class="wa-btn" style="display:inline-flex;width:auto;justify-content:center;padding:14px 32px;font-size:.72rem">
    ${WA_SVG} Escribir al asesor
  </a>
</div>
<section style="padding:80px 6%;background:var(--ink2);border-top:1px solid var(--gl)">
  <div style="max-width:1200px;margin:0 auto">
    <div class="ey" style="justify-content:center;margin-bottom:12px">TESTIMONIOS VERIFICADOS</div>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:300;text-align:center;margin-bottom:60px;color:var(--wh)">
      Lo que dicen nuestros clientes
    </h2>
    
    <div class="testimonials-container" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:28px">
      <div class="testimonial-card" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px;transition:all .4s;transform:translateY(40px);opacity:0">
        <div style="display:flex;gap:8px;margin-bottom:16px"><span style="color:var(--or)">★★★★★</span></div>
        <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.8">"Zona INNmueble me ayudó a encontrar la propiedad perfecta en Zona 10. El equipo fue muy profesional y comprensivo. Altamente recomendado."</p>
        <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--gl)">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--or),var(--or2));display:flex;align-items:center;justify-content:center;color:var(--ink);font-weight:600;font-size:.9rem">MC</div>
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem">María Castillo</div><div style="color:var(--mt);font-size:.8rem">Empresaria</div></div>
        </div>
      </div>
      
      <div class="testimonial-card" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px;transition:all .4s;transform:translateY(40px);opacity:0">
        <div style="display:flex;gap:8px;margin-bottom:16px"><span style="color:var(--or)">★★★★★</span></div>
        <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.8">"Excelente asesoría para mi inversión inmobiliaria. Entendieron mi visión y ofrecieron opciones que superaron mis expectativas."</p>
        <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--gl)">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--or),var(--or2));display:flex;align-items:center;justify-content:center;color:var(--ink);font-weight:600;font-size:.9rem">CG</div>
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem">Carlos García</div><div style="color:var(--mt);font-size:.8rem">Inversionista</div></div>
        </div>
      </div>
      
      <div class="testimonial-card" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px;transition:all .4s;transform:translateY(40px);opacity:0">
        <div style="display:flex;gap:8px;margin-bottom:16px"><span style="color:var(--or)">★★★★★</span></div>
        <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.8">"El servicio es impecable. Desde búsqueda hasta finalización, todo fue smooth y profesional. Definitivamente mi opción número uno."</p>
        <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--gl)">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--or),var(--or2));display:flex;align-items:center;justify-content:center;color:var(--ink);font-weight:600;font-size:.9rem">SL</div>
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem">Sandra López</div><div style="color:var(--mt);font-size:.8rem">Ejecutiva</div></div>
        </div>
      </div>
    </div>
  </div>
</section>
  `;
}

// ── TRUST BADGES (FASE 1) ──────────────────────────────────────────
function trustBadges() {
  return `
<div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;padding:24px 0;border-top:1px solid var(--gl)">
  <div style="text-align:center;flex:1;min-width:120px">
    <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
    <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">31 Propiedades</div>
  </div>
  <div style="text-align:center;flex:1;min-width:120px">
    <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
    <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">100% Verificadas</div>
  </div>
  <div style="text-align:center;flex:1;min-width:120px">
    <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
    <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">10+ Años</div>
  </div>
  <div style="text-align:center;flex:1;min-width:120px">
    <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
    <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">Soporte 24/7</div>
  </div>
</div>
  `;
}
