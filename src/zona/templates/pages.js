const { layout, WA }       = require('./layout');
const { escapeHtml, uniqueValues, getRelated } = require('../../shared/utils');

const DOMAIN = 'https://zona-innmueble.com';

const WA_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

function waLink(msg) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

// ── Card ─────────────────────────────────────────────────────────────
function card(p) {
  const cfg = p.privConfig || {};
  const esExclusiva = p.esExclusiva || cfg.exclusiva || false;
  const isNewListing = (() => {
    if (!p.fechaPublicacion) return false;
    const pubDate = new Date(p.fechaPublicacion);
    if (isNaN(pubDate.getTime())) return false;
    const daysSince = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= 0 && daysSince <= 7;
  })();
  const imgs = (p.gallery && p.gallery.length > 0 && !(esExclusiva||cfg.fotos)) ? p.gallery : [p.mainImageThumb || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70'];
  const img = imgs[0];
  const hasGallery = imgs.length > 1;
  const badgeClass = (p.cinta||'').toLowerCase() === 'renta' ? 'renta' : '';
  const badge = p.cinta || '';
  const meta = [];
  if (!esExclusiva && !cfg.specs) {
    if (p.habitaciones && p.habitaciones !== '0') meta.push(p.habitaciones + ' Hab.');
    if (p.banos        && p.banos        !== '0') meta.push(p.banos + ' Baños');
    if (ca(p.areaConst)) meta.push(ca(p.areaConst));
  }
  const cardId = 'card-' + (p.slug||p.id||Math.random().toString(36).slice(2));
  const imgsJson = JSON.stringify(imgs.slice(0,10).map(u=>escapeHtml(u)));
  const priceLabel = (esExclusiva||cfg.precio) ? 'Precio a consultar' : escapeHtml(p.priceFormatted);

  // Flechas del carrusel solo si hay galeria
  const arrows = hasGallery ? `
  <button class="card-prev" onclick="event.preventDefault();cardSlide('${cardId}',-1)" aria-label="Anterior">&#8249;</button>
  <button class="card-next" onclick="event.preventDefault();cardSlide('${cardId}',1)" aria-label="Siguiente">&#8250;</button>
  <div class="card-dots" id="${cardId}-dots">${imgs.slice(0,10).map((_,i)=>`<span class="card-dot${i===0?' active':''}" onclick="event.preventDefault();cardGoto('${cardId}',${i})"></span>`).join('')}</div>
  ` : '';

  const photoCount = hasGallery ? `<span class="card-photo-count">&#128247; ${imgs.length}</span>` : '';
  const exclusivaBadge = esExclusiva ? `<span class="pc-badge-excl">&#10022; Exclusiva</span>` : '';
  const newBadge = (!esExclusiva && isNewListing) ? `<span class="pc-badge-new">&#10024; Nuevo</span>` : '';

  return `<div class="prop-card-wrap" id="${cardId}" data-imgs='${imgsJson}' data-idx="0">
  <a class="prop-card" href="/propiedades/${escapeHtml(p.slug)}.html"
    data-tipo="${escapeHtml(p.tipo)}" data-ciudad="${escapeHtml(p.municipio)}"
    data-cinta="${escapeHtml(p.cinta)}" data-precio="${p.priceNumeric}"
    data-habs="${p.habitaciones||0}"
    data-fecha="${escapeHtml(String(p.fechaPublicacion||p.createdAt||''))}"
    data-area="${parseFloat(p.areaConst)||parseFloat(p.area)||0}">
    <img referrerpolicy="no-referrer" src="${escapeHtml(img)}" alt="${escapeHtml(p.title)}" loading="lazy" id="${cardId}-img" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70'">
    <div class="pc-ov"></div>
    ${badge ? `<span class="pc-badge ${badgeClass}">${escapeHtml(badge)}</span>` : ''}
    ${exclusivaBadge}
    ${newBadge}
    ${photoCount}
    <button class="pc-fav" data-slug="${escapeHtml(p.slug)}" onclick="toggleFav('${escapeHtml(p.slug)}',this)" aria-label="Guardar en favoritos">
      <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    </button>
    <div class="pc-info">
      <div class="pc-tipo">${escapeHtml(p.tipo)} · ${escapeHtml(p.municipio)}</div>
      <div class="pc-title">${escapeHtml(p.title)}</div>
      ${meta.length ? `<div class="pc-meta">${meta.map(m=>`<span>${m}</span>`).join('')}</div>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div class="pc-price">${priceLabel}</div>
        <span class="pc-arr">→</span>
      </div>
    </div>
  </a>
  ${arrows}
</div>`;
}

// ── INDEX ─────────────────────────────────────────────────────────────
function ca(area) {
  if (!area) return '';
  let s = String(area).trim().replace(/^'+/, '');
  if (!s || s === '0' || s === '-' || s === '--' || s === '---') return '';
  if (/^0\s*(v²|m²|v2|m2)?$/.test(s)) return '';
  // Si el valor viene con unidad de varas (dato legado mal cargado como "Área m²"),
  // no lo mostramos como m² — el campo areaV2 ya cubre esa medida correctamente.
  if (/v[²2]/i.test(s)) return '';
  // Limpiar cualquier unidad de metros sobrante para dejar solo el número
  s = s.replace(/\s*m[²2]\s*$/i, '').trim();
  if (!s) return '';
  return s;
}

function renderCaracteristicas(chars) {
  if (!chars || !chars.length) return '';
  const grupos = [
    { label:'Ubicación',       icon:'📍', items:['Ubicación privilegiada','Sobre carretera principal','Entorno natural y vistas','Cerca de servicios','Zona residencial exclusiva','Acceso pavimentado','Vista al valle','Vista a montañas'] },
    { label:'Seguridad',       icon:'🛡️', items:['Garita 24/7','Condominio cerrado','Cámaras de seguridad','Sistema de alarma','Muros perimetrales','Portón eléctrico'] },
    { label:'Servicios',       icon:'💡', items:['Agua municipal','Pozo propio','Cisterna','Luz 110v/220v','Panel solar','Internet fibra disponible','Gas propano','Drenaje municipal'] },
    { label:'Exteriores',      icon:'🌿', items:['Piscina','Jardín amplio','Área de BBQ','Pérgola','Terraza exterior','Cancha deportiva','Juegos infantiles','Huerto / área de siembra'] },
    { label:'Interiores',      icon:'🏠', items:['Cocina equipada','Isla de cocina','Walk-in closet','Cuarto de servicio con baño','Bodega','Chimenea','Jacuzzi','Estudio / Oficina','Sala familiar','Sala de cine','Lavandería interna','Bar interior'] },
    { label:'Vehículos',       icon:'🚗', items:['Garaje cerrado','Parqueo techado','Parqueo descubierto','Acceso para camión'] },
    { label:'Para fincas',     icon:'🌱', items:['Agua de nacimiento','Río o quebrada','Luz trifásica','Casa del guardián','Corrales','Cultivo activo','Finca inscrita en Registro','Caminos internos'] },
    { label:'Inversión',       icon:'📈', items:['Alta plusvalía','Zona en crecimiento','Papelería en orden','Sin gravámenes','Financiamiento disponible','Negociable','Potencial de desarrollo','Apta para alquiler','Acepta permuta','Acepta financiamiento bancario','Disponibilidad inmediata'] },
    { label:'Local / Comercial', icon:'🏬', items:['Sobre avenida principal','Rampa de carga','Uso de suelo comercial','Uso de suelo industrial','Baños para empleados','Luz trifásica disponible'] },
    { label:'Terreno',          icon:'🗺️', items:['Topografía plana','Uso de suelo autorizado','Servicios disponibles','Apto para construcción inmediata','Estudio topográfico disponible','Permisos municipales tramitados'] },
    { label:'Renta',            icon:'🔑', items:['Amueblado','Semi amueblado','Mascotas permitidas','Incluye mantenimiento','Incluye internet','Incluye agua'] },
  ];
  const activas = grupos.map(g => ({ ...g, activos: g.items.filter(i => chars.includes(i)) })).filter(g => g.activos.length);
  if (!activas.length) return '';
  let html = `<div style="margin-top:36px;padding-top:32px;border-top:1px solid var(--bd)">
    <div style="font-size:.57rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--or);margin-bottom:24px">Características y amenidades</div>`;
  activas.forEach(g => {
    html += `<div style="margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <span style="font-size:.9rem">${g.icon}</span>
        <span style="font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--sv)">${g.label}</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:7px">`;
    g.activos.forEach(item => {
      html += `<span style="display:inline-flex;align-items:center;gap:5px;padding:6px 12px;background:rgba(245,130,13,.06);border:1px solid rgba(245,130,13,.2);border-radius:4px;font-size:.72rem;color:var(--wh);font-weight:400;letter-spacing:.02em">✓ ${item}</span>`;
    });
    html += `</div></div>`;
  });
  html += `</div>`;
  return html;
}

function renderDesc(desc) {
  if (!desc) return '';
  const label = '<div style="font-size:.57rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--or);margin-bottom:12px">Descripci&oacute;n</div>';
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
  const tiposRaw = uniqueValues(props, 'tipo');
  const tipos    = ['Casa','Apartamento','Finca',...tiposRaw.filter(t=>!['Casa','Apartamento','Finca'].includes(t))];

  const body = `
<style>
/* ── MOBILE RESPONSIVE FIXES ────────────────────────────────────── */
@media(max-width:640px){
  /* Hero content: espacio para stats bar absoluta */
  .hero-content-inner{padding-top:80px!important;padding-bottom:100px!important;max-width:100%!important;width:100%!important}
  /* Buscador hero: apilado vertical */
  .hero-search-box{flex-direction:column!important;padding:10px!important}
  .hero-search-box>div{min-width:unset!important;width:100%!important}
  .hero-search-box>select{min-width:unset!important;width:100%!important;margin:0!important}
  /* Stats bar: 2×2 en lugar de 4×1 */
  .stats-bar-item{min-width:42%!important;max-width:50%!important;flex:none!important;padding:12px 10px!important;border-right:none!important;border-bottom:1px solid rgba(255,255,255,.08)!important}
  /* Off-market: 1 columna */
  .off-market-grid{grid-template-columns:1fr!important;gap:28px!important}
  /* Trust badges: 2×2 */
  .trust-badge-item{min-width:42%!important;max-width:50%!important;flex:none!important;padding:10px 8px!important}
  /* Sección contacto: padding lateral */
  .contacto-inner{padding:40px 5%!important}
  /* Zona page grids */
  .zona-content-grid{grid-template-columns:1fr!important;gap:24px!important}
  .zona-stats-row{flex-wrap:wrap!important}
  .zona-stats-row>div{min-width:42%!important;padding:14px 10px!important;border-right:none!important;border-bottom:1px solid var(--bd)!important}
  /* Asesor card: texto sin overflow */
  .asesor-card p{max-width:100%!important}
  /* Filter bar en propiedades */
  .filter-bar{flex-direction:column!important}
  .filter-bar select,.filter-bar input,.filter-bar>div[style*="min-width:180px"]{width:100%!important;min-width:unset!important}
}
@media(max-width:480px){
  .hero-content-inner{padding-top:60px!important;padding-bottom:90px!important}
  .off-market-grid>div:last-child{display:none}  /* Ocultar imagen decorativa en mobile muy pequeño */
}
</style>
<!-- HERO -->
<section style="min-height:93vh;position:relative;display:flex;align-items:center;overflow:hidden;padding:0 6%;background:var(--ink)">

  <!-- VIDEO DE FONDO -->
  <video autoplay muted loop playsinline
    style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;opacity:.55"
    poster="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=70">
    <source src="/assets/reel-hero.mp4" type="video/mp4">
  </video>

  <!-- GRADIENTE ENCIMA DEL VIDEO -->
  <div style="position:absolute;inset:0;background:linear-gradient(105deg,rgba(13,27,62,.92) 0%,rgba(13,27,62,.55) 55%,rgba(20,34,64,.75) 100%);z-index:1"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,62,.7) 0%,transparent 45%);z-index:1"></div>

  <!-- CONTENIDO HERO -->
  <div class="hero-content-inner" style="position:relative;z-index:2;max-width:760px;padding:100px 0 130px">
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap">
      <div class="ey" style="margin-bottom:0">Guatemala · Patrimonio Inmobiliario</div>
      <div style="display:flex;align-items:center;gap:7px;background:rgba(37,211,102,.1);border:1px solid rgba(37,211,102,.25);border-radius:100px;padding:5px 12px">
        <span class="live"></span>
        <span style="font-size:.65rem;font-weight:600;color:rgba(255,255,255,.7);letter-spacing:.08em">Disponibles · Respuesta en menos de 2h</span>
      </div>
    </div>
    <h1 style="font-family:'Cormorant Garamond',serif;font-size:clamp(3rem,6.5vw,5.4rem);font-weight:300;line-height:1.06;margin-bottom:22px">
      En Guatemala, la diferencia entre una casa y una <em style="color:var(--or);font-style:italic">residencia exclusiva</em> est&aacute; en cada detalle.
    </h1>
    <p style="font-size:.85rem;font-weight:300;color:var(--sv);line-height:1.9;max-width:480px;margin-bottom:44px">
      ${props.length} propiedades verificadas, oportunidades de inversi&oacute;n y un equipo que entiende que cada propiedad cuenta una historia. Asesor&iacute;a privada para quienes saben qu&eacute; buscan.
    </p>
    <!-- BUSCADOR HERO -->
    <div class="hero-search-box" style="background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:8px;display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px;max-width:620px">
      <div style="flex:1;min-width:200px;position:relative">
        <input type="text" id="hero-search"
          placeholder="Buscar por zona, tipo o colonia..."
          style="width:100%;padding:12px 16px 12px 40px;background:transparent;border:none;color:white;font-size:.88rem;font-family:'Montserrat',sans-serif;outline:none"
          oninput="heroSearch(this.value)"
          onkeydown="if(event.key==='Enter')heroGo()">
        <svg style="position:absolute;left:12px;top:50%;transform:translateY(-50%);opacity:.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <div id="hero-suggestions" style="display:none;position:absolute;top:100%;left:0;right:0;background:#0d1b3e;border:1px solid var(--gl);border-radius:8px;margin-top:4px;z-index:100;max-height:200px;overflow-y:auto"></div>
      </div>
      <select id="hero-tipo" style="padding:12px 14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:white;font-size:.82rem;font-family:'Montserrat',sans-serif;cursor:pointer;min-width:140px">
        <option value="">Tipo de propiedad</option>
        ${tipos.map(t=>`<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('')}
      </select>
      <button onclick="heroGo()" style="padding:12px 22px;background:var(--or);color:var(--ink);border:none;border-radius:8px;font-weight:700;font-size:.82rem;cursor:pointer;white-space:nowrap;font-family:'Montserrat',sans-serif">Buscar</button>
    </div>
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      <a href="https://wa.me/50245542088?text=${encodeURIComponent('Hola, quiero una asesoría privada de Zona INNmueble.')}" target="_blank" rel="noopener" class="btn-ol">${WA_SVG} Asesor&iacute;a por WhatsApp</a>
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
        return '<div class="hero-sug-item" data-slug="'+p.slug+'">'
          +'<span style="font-weight:600">'+p.titulo+'</span>'
          +' <span style="opacity:.5;font-size:.75rem">'+p.municipio+'</span>'
          +'</div>';
      }).join('');
      s.querySelectorAll('.hero-sug-item').forEach(function(el){
        el.addEventListener('click', function(){
          window.location.href = '/propiedades/' + el.getAttribute('data-slug') + '.html';
        });
      });
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

  <!-- BARRA DE ESTADÍSTICAS -->
  <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(13,27,62,.75);backdrop-filter:blur(16px);border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:center;flex-wrap:wrap;z-index:2">
    ${(()=>{
      const vendidas = props.filter(p=>p.estado==='Vendida').length;
      const activas = props.filter(p=>!p.estado||p.estado==='Activa').length;
      return [
        [activas+'+','Propiedades Activas'],
        [vendidas>0?vendidas+'+':'50+','Familias Asesoradas'],
        ['10+','A&ntilde;os en el Mercado'],
        ['100%','Asesor&iacute;a Personal'],
      ].map(([n,l])=>`<div class="stats-bar-item" style="padding:20px 44px;text-align:center;border-right:1px solid var(--bd);flex:1;max-width:220px;min-width:140px">
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.1rem;font-weight:500;color:var(--or);line-height:1;margin-bottom:5px">${n}</div>
        <div style="font-size:.58rem;font-weight:500;letter-spacing:.19em;text-transform:uppercase;color:var(--mt)">${l}</div>
      </div>`).join('');
    })()}
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

<!-- OFF-MARKET -->
<section style="padding:80px 6%;background:var(--ink);position:relative;overflow:hidden" class="fade-in-up">
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 80% 50%,rgba(193,145,75,.06) 0%,transparent 70%)"></div>
  <div style="max-width:1200px;margin:0 auto;position:relative;z-index:1">
    <div class="off-market-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center">
      <!-- TEXTO -->
      <div>
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(193,145,75,.12);border:1px solid rgba(193,145,75,.3);border-radius:100px;padding:5px 14px;margin-bottom:20px">
          <span style="width:6px;height:6px;border-radius:50%;background:var(--or);display:inline-block;animation:pulse-dot 2s infinite"></span>
          <span style="font-size:.6rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--or)">Acceso Exclusivo</span>
        </div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:300;line-height:1.12;margin-bottom:22px;color:var(--wh)">
          Propiedades que <em style="color:var(--or);font-style:italic">no están publicadas</em>
        </h2>
        <p style="font-size:.85rem;color:var(--sv);line-height:1.95;margin-bottom:32px;max-width:440px;font-weight:300">
          El mercado premium de Guatemala mueve sus mejores propiedades en privado. Accede a listados exclusivos antes de que lleguen al mercado abierto.
        </p>
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:36px">
          ${[
            ['Residencias en Zona 10, 14 y 15 no listadas públicamente',''],
            ['Fincas con potencial de desarrollo en Carretera a El Salvador',''],
            ['Oportunidades de inversión con ROI proyectado',''],
          ].map(([t])=>`<div style="display:flex;align-items:flex-start;gap:12px">
            <div style="width:18px;height:18px;border-radius:50%;background:rgba(193,145,75,.15);border:1px solid rgba(193,145,75,.35);flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center">
              <svg width="8" height="8" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="var(--or)" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span style="font-size:.82rem;color:var(--sv);line-height:1.7">${t}</span>
          </div>`).join('')}
        </div>
        <a href="https://wa.me/50245542088?text=${encodeURIComponent('Hola, me interesa acceder a propiedades fuera del mercado. ¿Tienen listados exclusivos?')}" target="_blank" rel="noopener" class="btn-or" style="display:inline-flex;align-items:center;gap:10px">
          ${WA_SVG} Solicitar acceso privado
        </a>
        <p style="margin-top:14px;font-size:.63rem;color:var(--mt)">Respuesta en menos de 2 horas · Sin compromiso</p>
      </div>
      <!-- VISUAL -->
      <div style="position:relative">
        <div style="border-radius:16px;overflow:hidden;aspect-ratio:4/5;position:relative;background:var(--ink2);border:1px solid var(--gl)">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80" alt="Propiedad exclusiva Guatemala" style="width:100%;height:100%;object-fit:cover;opacity:.85" loading="lazy">
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,62,.85) 0%,transparent 50%)"></div>
          <div style="position:absolute;bottom:0;left:0;right:0;padding:28px">
            <div style="font-size:.58rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:6px">Off-Market</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:400;color:var(--wh);margin-bottom:4px">Residencia Privada</div>
            <div style="font-size:.72rem;color:var(--sv)">Zona 14 · Solo para clientes verificados</div>
          </div>
          <!-- LOCK BADGE -->
          <div style="position:absolute;top:20px;right:20px;background:rgba(13,27,62,.85);backdrop-filter:blur(8px);border:1px solid var(--gl);border-radius:100px;padding:8px 14px;display:flex;align-items:center;gap:7px">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--or)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style="font-size:.6rem;font-weight:600;color:var(--wh);letter-spacing:.08em">Acceso Privado</span>
          </div>
        </div>
        <!-- STAT CARD FLOTANTE -->
        <div style="position:absolute;bottom:-20px;left:-20px;background:var(--ink2);border:1px solid var(--gl);border-radius:12px;padding:16px 20px;box-shadow:0 8px 32px rgba(0,0,0,.3)">
          <div style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:400;color:var(--or);line-height:1;margin-bottom:4px">+40%</div>
          <div style="font-size:.63rem;color:var(--sv);line-height:1.5">propiedades off-market<br>no llegan al público</div>
        </div>
      </div>
    </div>
  </div>
</section>

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
<!-- SECCION DE CONFIANZA -->
<section style="padding:48px 6%;background:var(--ink);border-top:1px solid var(--gl);border-bottom:1px solid var(--gl)" class="fade-in-up">
  <div style="max-width:1200px;margin:0 auto">
    <div style="text-align:center;margin-bottom:32px">
      <div style="font-size:.6rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--mt)">Por qué elegirnos</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px">
      <div style="text-align:center;padding:24px 16px">
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:300;color:var(--or);line-height:1;margin-bottom:8px">10+</div>
        <div style="font-size:.72rem;font-weight:600;color:var(--sv);line-height:1.6">Años conectando familias con su propiedad ideal en Guatemala</div>
      </div>
      <div style="text-align:center;padding:24px 16px;border-left:1px solid var(--gl);border-right:1px solid var(--gl)">
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:300;color:var(--or);line-height:1;margin-bottom:8px">&lt;2h</div>
        <div style="font-size:.72rem;font-weight:600;color:var(--sv);line-height:1.6">Tiempo promedio de respuesta. Tu consulta no espera</div>
      </div>
      <div style="text-align:center;padding:24px 16px">
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:300;color:var(--or);line-height:1;margin-bottom:8px">100%</div>
        <div style="font-size:.72rem;font-weight:600;color:var(--sv);line-height:1.6">Propiedades verificadas. Papelería en orden, sin sorpresas</div>
      </div>
      <div style="text-align:center;padding:24px 16px;border-left:1px solid var(--gl)">
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:300;color:var(--or);line-height:1;margin-bottom:8px">5★</div>
        <div style="font-size:.72rem;font-weight:600;color:var(--sv);line-height:1.6">Calificación promedio de nuestros clientes en cada cierre</div>
      </div>
    </div>
  </div>
</section>

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
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem;margin-bottom:2px">María Castillo</div><div style="color:var(--or);font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Empresaria · Zona 10 · 2025</div></div>
        </div>
      </div>
      
      <div class="testimonial-card fade-in-up delay-1" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px">
        <div style="display:flex;gap:3px;margin-bottom:20px">
          ${'★'.repeat(5).split('').map(s=>'<span style="color:var(--or);font-size:1.1rem">'+s+'</span>').join('')}
        </div>
        <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.9;font-size:.88rem">"Excelente asesoría para mi inversión inmobiliaria. Entendieron mi visión y me ofrecieron opciones que superaron mis expectativas. El proceso fue transparente y profesional."</p>
        <div style="display:flex;align-items:center;gap:14px;padding-top:18px;border-top:1px solid var(--gl)">
          <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#0d3d2a,#1a6b4a);border:2px solid var(--or);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--or);flex-shrink:0">CG</div>
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem;margin-bottom:2px">Carlos García</div><div style="color:var(--or);font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Inversionista · Fraijanes · 2024</div></div>
        </div>
      </div>
      
      <div class="testimonial-card fade-in-up delay-2" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px">
        <div style="display:flex;gap:3px;margin-bottom:20px">
          ${'★'.repeat(5).split('').map(s=>'<span style="color:var(--or);font-size:1.1rem">'+s+'</span>').join('')}
        </div>
        <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.9;font-size:.88rem">"El servicio es impecable. Desde la búsqueda hasta la finalización, todo fue smooth y profesional. Definitivamente mi opción número uno para propiedades premium."</p>
        <div style="display:flex;align-items:center;gap:14px;padding-top:18px;border-top:1px solid var(--gl)">
          <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#2d1a4e,#4a2d7a);border:2px solid var(--or);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--or);flex-shrink:0">SL</div>
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem;margin-bottom:2px">Sandra López</div><div style="color:var(--or);font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Ejecutiva · Zona 14 · 2025</div></div>
        </div>
      </div>
    </div>
    
    <!-- TRUST BADGES -->
    <div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;padding:60px 0 0;border-top:1px solid var(--gl);margin-top:60px">
      <div class="trust-badge-item" style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">${props.filter(p=>!p.estado||p.estado==='Activa').length}+ Propiedades</div>
      </div>
      <div class="trust-badge-item" style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">100% Verificadas</div>
      </div>
      <div class="trust-badge-item" style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">10+ Años</div>
      </div>
      <div class="trust-badge-item" style="text-align:center;flex:1;min-width:120px">
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
      <div class="asesor-avatar" style="background:transparent;border:none;padding:0;width:88px;height:88px;flex-shrink:0;display:flex;align-items:center;justify-content:center">
        <img src="/assets/images/logo.png" alt="Zona INNmueble" style="width:80px;height:80px;object-fit:contain;border-radius:50%;background:#0d1b3e;padding:10px;border:1px solid var(--gl)" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div style="display:none;width:80px;height:80px;border-radius:50%;background:var(--or);color:var(--ink);font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:600;align-items:center;justify-content:center">ZI</div>
      </div>
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
<section id="contacto" style="background:var(--ink2);position:relative;overflow:hidden;padding:80px 6%">
  <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=40') center/cover no-repeat;opacity:.03"></div>
  <div class="contacto-inner" style="position:relative;z-index:1;max-width:620px;margin:0 auto;text-align:center">
    <div class="ey" style="justify-content:center">Contáctanos</div>
    <h2 class="st">Tu próxima propiedad empieza <em>con una conversación.</em></h2>
    <p style="font-size:.81rem;color:var(--sv);line-height:1.9;margin-bottom:40px;font-weight:300">Nuestro equipo está disponible para asesorarte de forma privada. Sin compromiso.</p>
    <div style="display:flex;flex-direction:column;gap:10px;max-width:340px;margin:0 auto">
      <a href="${waLink('Hola, me interesa una asesoría de Zona INNmueble.')}" target="_blank" rel="noopener" class="wa-btn" style="justify-content:center">${WA_SVG} Escribir por WhatsApp</a>
      <a href="/propiedades.html" class="btn-ol" style="justify-content:center">Ver propiedades disponibles</a>
    </div>
    <p style="margin-top:18px;font-size:.63rem;color:var(--mt)"><span class="live"></span>+502 4554-2088 · Lun–Vie 8:00–18:00</p>
  </div>
</section>`;  return layout({ title: null, desc: `Casas, fincas y apartamentos en venta en Guatemala. ${props.length} propiedades disponibles en Fraijanes, Zona 10, Zona 14, Mixco y Carretera a El Salvador. Asesoría personalizada.`, canonical: '/', body });
}

// ── CATALOG ───────────────────────────────────────────────────────────
function catalogPage(props) {
  const tiposRaw = uniqueValues(props, 'tipo');
  const tipos    = ['Casa','Apartamento','Finca',...tiposRaw.filter(t=>!['Casa','Apartamento','Finca'].includes(t))];
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
      c.parentElement.style.display=ok?'':'none';if(ok)n++;
    });
    // Ordenar
    var sv=document.getElementById('fsort').value;
    if(sv){
      var wraps=[...grid.querySelectorAll('.prop-card-wrap')];
      wraps.sort(function(a,b){
        var ca=a.querySelector('.prop-card'),cb=b.querySelector('.prop-card');
        if(!ca||!cb)return 0;
        var pa=parseFloat(ca.dataset.precio)||0,pb=parseFloat(cb.dataset.precio)||0;
        if(sv==='price_asc')return pa-pb;
        if(sv==='price_desc')return pb-pa;
        if(sv==='newest')return (cb.dataset.fecha||'').localeCompare(ca.dataset.fecha||'');
        if(sv==='area_desc')return (parseFloat(cb.dataset.area)||0)-(parseFloat(ca.dataset.area)||0);
        return 0;
      });
      wraps.forEach(function(w){grid.appendChild(w);});
    }
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
  ['fq','ft','fc2','fc3','fh','fsort'].forEach(id=>{
    document.getElementById(id).addEventListener('input',run);
    document.getElementById(id).addEventListener('change',run);
  });
  document.getElementById('cl2').addEventListener('click',()=>{['fq','ft','fc2','fc3','fh','fsort'].forEach(id=>document.getElementById(id).value='');document.getElementById('fp-min').value='';document.getElementById('fp-max').value='';updatePriceBtn();run();});
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
  <select id="fsort"><option value="">Ordenar por</option><option value="price_asc">Precio: menor a mayor</option><option value="price_desc">Precio: mayor a menor</option><option value="newest">Más recientes</option><option value="area_desc">Mayor área</option></select>
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

  return layout({ title: 'Catálogo Propiedades Premium Guatemala', desc: `${props.length} casas, fincas y apartamentos en venta en Guatemala. Propiedades en Fraijanes, Zona 10, Zona 14, Mixco y Carretera a El Salvador. Filtra por precio y zona.`, canonical: '/propiedades.html', body, scripts: filterJS });
}

// ── DETAIL ────────────────────────────────────────────────────────────
function detailPage(prop, all) {
  // Configuración de privacidad (declarado primero para usar en jsonLd, meta, etc.)
  const cfg = prop.privConfig || {};
  const esExclusiva = prop.esExclusiva || cfg.exclusiva || false;
  const isNewListing = (() => {
    if (!prop.fechaPublicacion) return false;
    const pubDate = new Date(prop.fechaPublicacion);
    if (isNaN(pubDate.getTime())) return false;
    const daysSince = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= 0 && daysSince <= 7;
  })();
  const related  = getRelated(prop, all);
  const img      = prop.mainImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70';
  const propUrl  = `${DOMAIN}/propiedades/${prop.slug}.html`;

  // WhatsApp messages
  const msgInfo  = `Hola, me interesa la propiedad: ${prop.title}. Quiero solicitar más información. Link: ${propUrl}`;
  const msgVisit = `Hola, me interesa la propiedad: ${prop.title}. Quiero agendar una visita privada. Link: ${propUrl}`;
  const msgFin   = `Hola, me interesa la propiedad: ${prop.title}. Quiero consultar opciones de financiamiento. Link: ${propUrl}`;

  const specs = [
    { l:'Tipo',              v: prop.tipo },
    { l:'Operación',         v: prop.operacion || prop.cinta },
    (prop.zona && prop.zona.trim() && prop.zona.trim() !== (prop.municipio||'').trim()) ? { l:'Zona', v: prop.zona } : null,
    prop.habitaciones&&prop.habitaciones!=='0' ? { l:'Habitaciones',  v: prop.habitaciones } : null,
    prop.banos&&prop.banos!=='0'               ? { l:'Baños',         v: prop.banos }        : null,
    prop.mediosBanos&&prop.mediosBanos!=='0'   ? { l:'Medios baños',  v: prop.mediosBanos }  : null,
    prop.parqueos&&prop.parqueos!=='0'&&prop.parqueos!=='No' ? { l:'Parqueos', v: prop.parqueos } : null,
    prop.niveles&&prop.niveles!=='0'           ? { l:'Niveles',       v: prop.niveles }      : null,
    ca(prop.areaConst)||prop.area ? { l:'Área m²', v: ca(prop.areaConst)||prop.area } : null,
    prop.areaV2                                ? { l:'Área v²',       v: prop.areaV2 }       : null,
    prop.terreno                               ? { l:'Terreno',       v: prop.terreno }      : null,
    prop.anioConstruccion                      ? { l:'Año construcción', v: prop.anioConstruccion } : null,
    prop.estadoConstruccion                    ? { l:'Condición',     v: prop.estadoConstruccion } : null,
    prop.tipoConstruccion                      ? { l:'Construcción',  v: prop.tipoConstruccion }   : null,
    prop.techo                                 ? { l:'Techo',         v: prop.techo }        : null,
    prop.piso                                  ? { l:'Piso',          v: prop.piso }         : null,
    prop.acabados                              ? { l:'Acabados',      v: prop.acabados }     : null,
    prop.orientacion                           ? { l:'Orientación',   v: prop.orientacion }  : null,
    prop.antiguedad                            ? { l:'Antigüedad',    v: prop.antiguedad + ' años' } : null,
    prop.ventanas                              ? { l:'Ventanas',      v: prop.ventanas }     : null,
    prop.cielos                                ? { l:'Cielos',        v: prop.cielos }       : null,
    prop.calentador                            ? { l:'Calentador',    v: prop.calentador }   : null,
    prop.cuotaMant                             ? { l:'Mantenimiento', v: prop.cuotaMant }    : null,
    prop.numeroPiso                            ? { l:'Piso',          v: prop.numeroPiso }   : null,
    prop.areaBalcon                            ? { l:'Balcón',        v: prop.areaBalcon + ' m²' } : null,
    prop.vista                                 ? { l:'Vista',         v: prop.vista }        : null,
    prop.alturaTecho                           ? { l:'Altura techo',  v: prop.alturaTecho + ' m' } : null,
    prop.frenteML                              ? { l:'Frente',        v: prop.frenteML + ' ml' } : null,
    prop.manzanas                              ? { l:'Extensión',     v: prop.manzanas + ' mz' } : null,
    prop.cultivo                               ? { l:'Cultivo',       v: prop.cultivo }      : null,
    prop.tituloFinca                           ? { l:'Título',        v: prop.tituloFinca }  : null,
    prop.tiempoCarretera                       ? { l:'A carretera',   v: prop.tiempoCarretera } : null,
    prop.precioRenta                           ? { l:'Renta mensual', v: prop.precioRenta }  : null,
    prop.disponibleDesde                       ? { l:'Disponible',    v: prop.disponibleDesde } : null,
    prop.bancoFin                              ? { l:'Banco',         v: prop.bancoFin }     : null,
    prop.certEnerg                             ? { l:'Cert. energético', v: prop.certEnerg } : null,
    prop.asesor                                ? { l:'Asesor',        v: prop.asesor }       : null,
    prop.fechaPublicacion                      ? { l:'Publicado',     v: prop.fechaPublicacion } : null,
    prop.codigo                                ? { l:'Código',        v: prop.codigo }       : null,
  ].filter(Boolean);

  const gal    = prop.gallery.slice(0, 10);
  const galHtml= gal.length > 1
    ? `<div class="gal-mini">${gal.slice(1).map(src=>`<img referrerpolicy="no-referrer" src="${escapeHtml(src)}" alt="${escapeHtml(prop.title)}" loading="lazy" onclick="document.getElementById('mi').src=this.src">`).join('')}</div>` : '';

  const relHtml = related.length
    ? `<section class="related"><div class="ey">Relacionadas</div><h2 class="st">También te puede <em>interesar</em></h2><div class="prop-grid">${related.map(r=>card(r)).join('')}</div></section>` : '';

  // JSON-LD structured data
  const cleanDesc = (esExclusiva||cfg.descripcion) ? '' : (prop.description||'').replace(/"nodes".*$/s,'').replace(/[{}"\\]/g,'').substring(0,300).trim();
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": prop.title,
    "description": cleanDesc || prop.title,
    "url": propUrl,
    "image": prop.mainImage || '',
    "numberOfRooms": prop.habitaciones || undefined,
    "floorSize": prop.areaConst ? { "@type":"QuantitativeValue", "value": prop.areaConst } : undefined,
    "offers": (esExclusiva||cfg.precio) ? undefined : {
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


  // Banner exclusiva
  const exclusivaBanner = esExclusiva
    ? '<div style="background:linear-gradient(135deg,rgba(245,130,13,.12),rgba(245,130,13,.04));border:1px solid rgba(245,130,13,.3);border-radius:6px;padding:20px 24px;margin-bottom:24px;text-align:center">'
      + '<div style="font-size:.6rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:8px">🏷️ Propiedad exclusiva</div>'
      + '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:var(--sv);line-height:1.6;font-style:italic">Esta propiedad es de carácter exclusivo.<br>Para más información contacte directamente con su asesor.</div>'
      + '</div>'
    : '';

  // Quick specs for hero bar
  const quickSpecs = [
    prop.habitaciones&&prop.habitaciones!=='0' ? {icon:'🛏', v:prop.habitaciones, l:'hab.'} : null,
    prop.banos&&prop.banos!=='0'               ? {icon:'🚿', v:prop.banos, l:'baños'} : null,
    prop.parqueos&&prop.parqueos!=='0'&&prop.parqueos!=='No' ? {icon:'🚗', v:prop.parqueos, l:'parqueos'} : null,
    ca(prop.areaConst)||prop.area              ? {icon:'📐', v:ca(prop.areaConst)||prop.area, l:'m²'} : null,
    prop.areaV2                                ? {icon:'📏', v:prop.areaV2, l:'v²'} : null,
    prop.manzanas                              ? {icon:'🌿', v:prop.manzanas, l:'mz'} : null,
  ].filter(Boolean);

  const waNum = prop.waAsesor ? prop.waAsesor.replace(/\\D/g,'') : '50245542088';

  const body = `
<script type="application/ld+json">${jsonLd}<\/script>

<style>
.dv3-hero{position:relative;background:#000;overflow:hidden}
.dv3-hero-img{width:100%;max-height:580px;object-fit:cover;display:block;opacity:.92}
.dv3-hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7) 0%,rgba(0,0,0,.1) 50%,transparent 100%)}
.dv3-hero-content{position:absolute;bottom:0;left:0;right:0;padding:28px 5% 32px}
.dv3-badge{display:inline-flex;align-items:center;gap:6px;background:var(--or);color:#000;font-size:.58rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:5px 12px;border-radius:3px;margin-bottom:12px}
.dv3-badge-new{display:inline-flex;align-items:center;gap:6px;background:#22c55e;color:#000;font-size:.58rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:5px 12px;border-radius:3px;margin-bottom:12px;margin-left:6px}
.dv3-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.6rem,4vw,2.6rem);font-weight:400;color:#fff;line-height:1.1;margin-bottom:8px;text-shadow:0 2px 12px rgba(0,0,0,.4)}
.dv3-loc{font-size:.75rem;color:rgba(255,255,255,.75);letter-spacing:.06em;display:flex;align-items:center;gap:6px}
.dv3-gal{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;background:#000}
.dv3-gal img{width:100%;aspect-ratio:16/10;object-fit:cover;cursor:pointer;opacity:.72;transition:opacity .2s}
.dv3-gal img:hover{opacity:1}
.dv3-gal-more{position:relative;cursor:pointer;overflow:hidden}
.dv3-gal-more img{width:100%;aspect-ratio:16/10;object-fit:cover;opacity:.4}
.dv3-gal-more-label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.8rem;font-weight:700;letter-spacing:.06em}
.dv3-bread{padding:14px 5%;display:flex;align-items:center;gap:8px;font-size:.68rem;color:var(--mt);border-bottom:1px solid var(--bd);flex-wrap:wrap}
.dv3-bread a{color:var(--mt);transition:color .2s}.dv3-bread a:hover{color:var(--or)}
.dv3-wrap{display:grid;grid-template-columns:1fr 360px;gap:0;align-items:start;max-width:1400px;margin:0 auto;padding:0 5% 60px}
.dv3-main{padding:36px 40px 36px 0;border-right:1px solid var(--bd)}
.dv3-side{padding:32px 0 32px 36px;position:sticky;top:20px}
.dv3-price-row{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--bd)}
.dv3-price{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,4vw,2.4rem);color:var(--or);font-weight:400;line-height:1}
.dv3-price-sub{font-size:.68rem;color:var(--mt);margin-top:4px}
.dv3-share-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 13px;border:1px solid var(--bd);background:transparent;color:var(--sv);font-size:.65rem;font-weight:600;letter-spacing:.06em;cursor:pointer;border-radius:3px;transition:all .2s;text-transform:uppercase}
.dv3-share-btn:hover{border-color:var(--or);color:var(--or)}
.dv3-qs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:28px}
.dv3-qs-item{display:flex;align-items:center;gap:7px;padding:9px 14px;background:var(--ink2);border:1px solid var(--bd);border-radius:4px;font-size:.8rem;font-weight:600;color:var(--sv)}
.dv3-qs-item span{font-size:.62rem;font-weight:400;color:var(--mt)}
.dv3-hook{font-family:'Cormorant Garamond',serif;font-size:1.18rem;font-weight:300;color:var(--sv);line-height:1.8;font-style:italic;padding:18px 20px;border-left:2px solid var(--or);margin-bottom:28px;background:rgba(245,130,13,.04)}
.dv3-tabs{display:flex;gap:0;border-bottom:1px solid var(--bd);margin-bottom:28px;overflow-x:auto;scrollbar-width:none}
.dv3-tabs::-webkit-scrollbar{display:none}
.dv3-tab{padding:12px 20px;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--mt);cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;transition:all .2s;background:none;border-top:none;border-left:none;border-right:none}
.dv3-tab:hover{color:var(--sv)}
.dv3-tab.on{color:var(--or);border-bottom-color:var(--or)}
.dv3-tab-panel{display:none}.dv3-tab-panel.on{display:block}
.dv3-specs-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--bd);border:1px solid var(--bd);border-radius:6px;overflow:hidden;margin-bottom:24px}
.dv3-spec{background:var(--ink2);padding:13px 16px}
.dv3-spec-l{font-size:.56rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--mt);margin-bottom:4px}
.dv3-spec-v{font-size:.9rem;font-weight:500;color:var(--sv)}
.dv3-desc{font-size:.85rem;line-height:1.85;color:var(--sv)}
.dv3-datos{padding:14px 18px;background:rgba(245,130,13,.06);border:1px solid rgba(245,130,13,.25);border-radius:5px;font-size:.82rem;color:var(--sv);line-height:1.7;margin-bottom:18px}
.dv3-chars-group{margin-bottom:22px}
.dv3-chars-group-title{display:flex;align-items:center;gap:8px;font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--sv);margin-bottom:10px}
.dv3-chars-list{display:flex;flex-wrap:wrap;gap:7px}
.dv3-char{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;background:rgba(245,130,13,.06);border:1px solid rgba(245,130,13,.18);border-radius:4px;font-size:.73rem;color:var(--sv)}
.dv3-char::before{content:'✓';color:var(--or);font-weight:700;font-size:.8rem}
.dv3-video-wrap{position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:6px;border:1px solid var(--bd);margin-bottom:20px}
.dv3-video-wrap iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:none}
.dv3-plano{width:100%;border-radius:6px;border:1px solid var(--bd);display:block}
.dv3-side-card{background:var(--ink2);border:1px solid var(--bd);border-top:2px solid var(--or);padding:24px 22px;margin-bottom:12px;border-radius:4px}
.dv3-side-card.wa-card{border-top-color:#25D366}
.dv3-agent-row{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.dv3-agent-avatar{width:44px;height:44px;border-radius:50%;background:var(--or);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:700;color:#000;flex-shrink:0}
.dv3-agent-name{font-size:.82rem;font-weight:700;color:var(--sv)}
.dv3-agent-role{font-size:.65rem;color:var(--mt);margin-top:2px}
.dv3-live{display:inline-block;width:7px;height:7px;border-radius:50%;background:#25D366;animation:lp 2s ease-in-out infinite;margin-right:6px;flex-shrink:0;vertical-align:middle}
.dv3-avail{font-size:.6rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#25D366;margin-bottom:16px;display:flex;align-items:center}
.dv3-wa-btn{display:flex;align-items:center;justify-content:center;gap:9px;background:#0d1b3e;color:#fff;border:1px solid rgba(37,211,102,.3);padding:13px 16px;border-radius:4px;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;margin-bottom:8px;transition:all .2s}
.dv3-wa-btn:hover{filter:brightness(1.1)}
.dv3-wa-btn.outline{background:transparent;border:1px solid rgba(37,211,102,.3);color:rgba(255,255,255,.7)}
.dv3-wa-btn.outline:hover{background:#0d1b3e;border-color:rgba(37,211,102,.5);color:#fff}
.dv3-divider{height:1px;background:var(--bd);margin:18px 0}
.dv3-form-title{font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--or);margin-bottom:14px}
.dv3-input{width:100%;padding:10px 13px;background:rgba(255,255,255,.05);border:1px solid var(--gl);color:var(--wh);font-size:.78rem;border-radius:3px;font-family:inherit;margin-bottom:8px;outline:none;transition:border-color .2s;box-sizing:border-box}
.dv3-input:focus{border-color:var(--or)}
.dv3-submit{width:100%;padding:11px;background:var(--or);color:var(--ink);border:none;font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;border-radius:3px;font-family:inherit;transition:background .2s}
.dv3-submit:hover{background:var(--or2)}
.dv3-side-ref{background:var(--ink2);border:1px solid var(--bd);padding:16px 20px;border-radius:4px;margin-bottom:12px}
.dv3-ref-l{font-size:.56rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:8px}
.dv3-ref-v{font-family:'Cormorant Garamond',serif;font-size:1.3rem;letter-spacing:.08em;color:var(--sv)}
.dv3-more-links{background:var(--ink2);border:1px solid var(--bd);padding:16px 20px;border-radius:4px}
.dv3-more-link{display:block;font-size:.73rem;color:var(--sv);padding:7px 0;border-bottom:1px solid var(--bd);transition:color .2s}
.dv3-more-link:last-child{border-bottom:none;padding-bottom:0}
.dv3-more-link:hover{color:var(--or)}
.dv3-wa-float{display:none;position:fixed;bottom:0;left:0;right:0;z-index:100;padding:10px 14px;background:var(--ink);border-top:1px solid var(--bd);gap:8px;align-items:center}
.dv3-wa-float a{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;background:#0d1b3e;color:#fff;border:1px solid rgba(37,211,102,.3);padding:12px 8px;border-radius:4px;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;text-decoration:none}
.dv3-wa-float a.sec{background:transparent;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.6)}
/* LIGHTBOX */
.dv3-lb{display:none;position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:9999;align-items:center;justify-content:center;flex-direction:column}
.dv3-lb.open{display:flex}
.dv3-lb-img{max-width:92vw;max-height:80vh;object-fit:contain;border-radius:4px;display:block}
.dv3-lb-strip{display:flex;gap:6px;margin-top:14px;overflow-x:auto;max-width:92vw;padding-bottom:4px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.3) transparent}
.dv3-lb-strip img{width:64px;height:48px;object-fit:cover;border-radius:3px;cursor:pointer;opacity:.55;flex-shrink:0;transition:opacity .15s;border:2px solid transparent}
.dv3-lb-strip img.on{opacity:1;border-color:var(--or)}
.dv3-lb-close{position:absolute;top:16px;right:20px;background:none;border:none;color:#fff;font-size:1.8rem;cursor:pointer;line-height:1;opacity:.7;transition:opacity .2s}
.dv3-lb-close:hover{opacity:1}
.dv3-lb-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.12);border:none;color:#fff;font-size:1.5rem;cursor:pointer;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .2s}
.dv3-lb-nav:hover{background:rgba(255,255,255,.25)}
.dv3-lb-prev{left:16px}.dv3-lb-next{right:16px}
.dv3-lb-counter{position:absolute;top:16px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.6);font-size:.72rem;letter-spacing:.12em}
@media(max-width:1024px){
  .dv3-wrap{grid-template-columns:1fr;padding:0 4% 40px}
  .dv3-main{padding:28px 0;border-right:none;border-bottom:1px solid var(--bd)}
  .dv3-side{padding:28px 0 0;position:static}
  .dv3-wa-float{display:flex}
  .dv3-side-card.wa-card{display:none}
  .dv3-gal{grid-template-columns:repeat(4,1fr)}
}
@media(max-width:600px){
  .dv3-hero-img{max-height:260px}
  .dv3-hero-content{padding:14px 4% 18px}
  .dv3-title{font-size:1.45rem}
  .dv3-price{font-size:1.5rem}
  .dv3-qs-item{padding:7px 11px;font-size:.74rem}
  .dv3-specs-grid{grid-template-columns:1fr}
  .dv3-gal{grid-template-columns:repeat(3,1fr)}
  .dv3-tabs{flex-wrap:wrap!important;overflow-x:unset!important}
  .dv3-tab{padding:8px 10px!important;font-size:.58rem!important;flex:1 1 auto!important;text-align:center!important}
  .dv3-bread{padding:10px 4%;font-size:.62rem}
  .dv3-wrap{padding:0 4% 80px}
  .dv3-share-btn{display:none}
  /* Texto descriptivo — evita overflow horizontal */
  .dv3-desc,.det-desc,.det-desc-list,.dv3-hook,.dv3-datos{
    word-break:break-word;
    overflow-wrap:break-word;
    max-width:100%;
  }
  .dv3-desc p,.det-desc p{
    word-break:break-word;
    overflow-wrap:break-word;
    font-size:.82rem!important;
    line-height:1.75!important;
  }
  /* Descripción emoji-list items */
  .det-desc-list>div{
    flex-wrap:nowrap;
    min-width:0;
  }
  .det-desc-list>div>span:last-child{
    min-width:0;
    word-break:break-word;
    overflow-wrap:break-word;
  }
  /* Specs de detalle: 1 columna */
  .dv3-specs-grid{grid-template-columns:1fr!important}
  /* Calculadora hipoteca: 1 columna */
  .hip-grid{grid-template-columns:1fr!important;}
  /* Ubicación texto */
  .dv3-main [style*="font-size:.84rem"]{
    word-break:break-word;
    overflow-wrap:break-word;
    max-width:100%;
  }
  /* Caractéristicas wrapping */
  .dv3-chars-list{gap:5px}
  .dv3-char{font-size:.68rem!important}
  /* Quick specs en 2 filas si necesario */
  .dv3-qs{flex-wrap:wrap!important}
}
</style>

<div class="dv3-bread">
  <a href="/">Inicio</a> <span style="opacity:.3">›</span>
  <a href="/propiedades.html">Propiedades</a> <span style="opacity:.3">›</span>
  <span style="color:var(--sv)">${escapeHtml(prop.title)}</span>
</div>

<div class="dv3-hero">
  <img class="dv3-hero-img" id="mi" src="${escapeHtml(img)}" alt="${escapeHtml(prop.title)}" referrerpolicy="no-referrer">
  <div class="dv3-hero-overlay"></div>
  <div class="dv3-hero-content">
    <div class="dv3-badge">${escapeHtml(prop.tipo)} &middot; ${escapeHtml(prop.operacion||prop.cinta||'Venta')}</div>
    ${isNewListing ? '<span class="dv3-badge-new">&#10024; Nuevo</span>' : ''}
    <h1 class="dv3-title">${escapeHtml(prop.title)}</h1>
    <div class="dv3-loc">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      ${escapeHtml(prop.locationFull||prop.municipio||prop.zona||'Guatemala')}
    </div>
  </div>
</div>

${(!esExclusiva&&!cfg.fotos&&gal.length > 1) ? '<div class="dv3-gal">' + gal.slice(1,6).map(function(src,i){if(i===4&&gal.length>5){return '<div class="dv3-gal-more" onclick="dv3LightOpen('+String(i+1)+')"><img referrerpolicy="no-referrer" src="'+escapeHtml(src)+'" loading="lazy"><div class="dv3-gal-more-label">+'+String(gal.length-5)+' fotos</div></div>';}return '<img referrerpolicy="no-referrer" src="'+escapeHtml(src)+'" alt="'+escapeHtml(prop.title)+'" loading="lazy" onclick="dv3LightOpen('+String(i+1)+')">';}).join('') + '</div>' : ''}

<div class="dv3-wrap">
  <div class="dv3-main">

    <div class="dv3-price-row">
      <div>
        <div class="dv3-price">${(esExclusiva||cfg.precio) ? 'Precio a consultar' : escapeHtml(prop.priceFormatted||prop.precio||'Precio a consultar')}</div>
        ${(!esExclusiva&&!cfg.precio&&prop.precioRenta) ? '<div class="dv3-price-sub">Renta mensual: '+escapeHtml(prop.precioRenta)+'</div>' : ''}
      </div>
      <button class="dv3-share-btn" onclick="if(navigator.share){navigator.share({title:'${escapeHtml(prop.title)}',url:window.location.href});}else{navigator.clipboard.writeText(window.location.href);this.textContent='✓ Copiado';}">
        &#8679; Compartir
      </button>
    </div>

    ${(!esExclusiva&&!cfg.specs&&quickSpecs.length) ? '<div class="dv3-qs">'+quickSpecs.map(function(q){return '<div class="dv3-qs-item">'+q.icon+' '+escapeHtml(String(q.v))+' <span>'+escapeHtml(q.l)+'</span></div>';}).join('')+'</div>' : ''}

    ${(prop.descCorta && prop.descCorta.trim().length <= 140) ? '<div class="dv3-hook">&ldquo;'+escapeHtml(prop.descCorta)+'&rdquo;</div>' : ''}

    <div class="dv3-tabs">
      <button class="dv3-tab on" onclick="dv3Tab('det',this)">Detalles</button>
      <button class="dv3-tab" onclick="dv3Tab('desc',this)">Descripci&oacute;n</button>
      ${(prop.caracteristicas&&prop.caracteristicas.length) ? '<button class="dv3-tab" onclick="dv3Tab(\'chars\',this)">Caracter&iacute;sticas</button>' : ''}
      ${(prop.videoTour||prop.plano) ? '<button class="dv3-tab" onclick="dv3Tab(\'media\',this)">Video / Plano</button>' : ''}
      ${(!esExclusiva&&!cfg.ubicacion&&prop.lat&&prop.lng) ? '<button class="dv3-tab" onclick="dv3Tab(\'mapa\',this)">Ubicaci&oacute;n</button>' : ''}
      ${(!esExclusiva&&!cfg.precio&&prop.priceNumeric>0&&(prop.operacion||'').toLowerCase()!=='renta') ? '<button class="dv3-tab" onclick="dv3Tab(\'hipoteca\',this)">Calculadora</button>' : ''}
    </div>

    <div class="dv3-tab-panel on" id="dv3-det">
      ${exclusivaBanner}
      ${prop.datosTecnicos ? '<div class="dv3-datos"><span style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--or);display:block;margin-bottom:7px">Resumen</span>'+escapeHtml(prop.datosTecnicos)+'</div>' : ''}
      ${!esExclusiva && !cfg.specs ? '<div class="dv3-specs-grid">'+specs.map(function(s){return '<div class="dv3-spec"><div class="dv3-spec-l">'+escapeHtml(s.l)+'</div><div class="dv3-spec-v">'+escapeHtml(String(s.v))+'</div></div>';}).join('')+'</div>' : (!esExclusiva ? '' : '')}
      ${prop.produccion ? '<div class="dv3-datos" style="margin-top:10px"><span style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--or);display:block;margin-bottom:5px">Producci&oacute;n</span>'+escapeHtml(prop.produccion)+'</div>' : ''}
      ${prop.colindancias ? '<div class="dv3-datos" style="margin-top:10px"><span style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--or);display:block;margin-bottom:5px">Colindancias</span>'+escapeHtml(prop.colindancias)+'</div>' : ''}
    </div>

    <div class="dv3-tab-panel" id="dv3-desc">
      ${(esExclusiva||cfg.descripcion) ? '<div style="padding:24px;text-align:center;color:var(--mt);font-style:italic">Descripción disponible previa consulta.</div>' : ''}
      ${(!esExclusiva&&!cfg.descripcion&&prop.hook) ? '<div style="margin-bottom:20px;padding:16px 20px;border-left:2px solid var(--or);background:rgba(245,130,13,.04)"><div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--or);margin-bottom:6px">Destacado</div><div style=\"font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;font-weight:300;color:var(--sv);line-height:1.8;font-style:italic\">\"'+escapeHtml(prop.hook)+'\"</div></div>' : ''}
      <div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--or);margin-bottom:14px">Acerca de esta propiedad</div>
      <div class="dv3-desc">${(esExclusiva||cfg.descripcion) ? '' : renderDesc(prop.description)}</div>
      ${(!esExclusiva&&!cfg.ubicacion&&prop.ubicacionGeneral) ? '<div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--bd)"><div style=\"font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--or);margin-bottom:8px\">Ubicaci&oacute;n</div><div style=\"font-size:.84rem;color:var(--sv);line-height:1.7\">'+ escapeHtml(prop.ubicacionGeneral)+'</div></div>' : ''}
    </div>

    <div class="dv3-tab-panel" id="dv3-chars">
      ${(esExclusiva||cfg.caracteristicas) ? '<div style="padding:24px;text-align:center;color:var(--mt);font-style:italic">Características disponibles previa consulta.</div>' : renderCaracteristicas(prop.caracteristicas||[])}
    </div>

    <div class="dv3-tab-panel" id="dv3-media">
      ${prop.videoTour ? '<div style="margin-bottom:24px"><div class="dv3-ref-l" style="margin-bottom:12px">Video tour</div><div class="dv3-video-wrap"><iframe src="'+prop.videoTour.replace('watch?v=','embed/').replace('youtu.be/','youtube.com/embed/')+'" allowfullscreen loading="lazy"></iframe></div></div>' : ''}
      ${prop.plano ? '<div><div class="dv3-ref-l" style="margin-bottom:12px">Plano de planta</div><img class="dv3-plano" src="'+escapeHtml(prop.plano)+'" alt="Plano '+escapeHtml(prop.title)+'" loading="lazy"></div>' : ''}
    </div>

    ${(!esExclusiva&&!cfg.ubicacion&&prop.lat&&prop.lng) ? `<div class="dv3-tab-panel" id="dv3-mapa">
      <div class="dv3-video-wrap" style="padding-bottom:50%">
        <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(prop.lng)-0.01}%2C${parseFloat(prop.lat)-0.01}%2C${parseFloat(prop.lng)+0.01}%2C${parseFloat(prop.lat)+0.01}&layer=mapnik&marker=${prop.lat}%2C${prop.lng}" loading="lazy"></iframe>
      </div>
      <a href="https://www.google.com/maps?q=${prop.lat},${prop.lng}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;margin-top:12px;font-size:.75rem;color:var(--or)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Abrir en Google Maps
      </a>
    </div>` : ''}

    ${(!esExclusiva&&!cfg.precio&&prop.priceNumeric>0&&(prop.operacion||'').toLowerCase()!=='renta') ? `<div class="dv3-tab-panel" id="dv3-hipoteca">
      <div class="dv3-ref-l" style="margin-bottom:14px">Estimaci&oacute;n de cuota mensual</div>
      <div class="hip-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">
        <div>
          <label style="font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mt);display:block;margin-bottom:6px">Enganche (%)</label>
          <input type="range" id="hipEnganche" min="10" max="50" step="5" value="20" oninput="dv3CalcHipoteca()" style="width:100%">
          <div style="font-size:.78rem;color:var(--sv);margin-top:4px"><span id="hipEngancheVal">20</span>%</div>
        </div>
        <div>
          <label style="font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mt);display:block;margin-bottom:6px">Plazo (a&ntilde;os)</label>
          <input type="range" id="hipPlazo" min="5" max="30" step="5" value="20" oninput="dv3CalcHipoteca()" style="width:100%">
          <div style="font-size:.78rem;color:var(--sv);margin-top:4px"><span id="hipPlazoVal">20</span> a&ntilde;os</div>
        </div>
      </div>
      <div class="hip-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">
        <div>
          <label style="font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--mt);display:block;margin-bottom:6px">Tasa de inter&eacute;s anual (%)</label>
          <input type="number" id="hipTasa" value="9.5" step="0.1" min="1" max="25" oninput="dv3CalcHipoteca()" style="width:100%;padding:8px 10px;background:var(--ink2);border:1px solid var(--bd);border-radius:4px;color:var(--wh);font-size:.85rem">
        </div>
      </div>
      <div class="dv3-datos" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:var(--mt);font-size:.75rem">Precio de la propiedad</span><strong id="hipPrecioBase" style="color:var(--sv)"></strong></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="color:var(--mt);font-size:.75rem">Enganche estimado</span><strong id="hipEngancheMonto" style="color:var(--sv)"></strong></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--mt);font-size:.75rem">Monto a financiar</span><strong id="hipMontoFinanciar" style="color:var(--sv)"></strong></div>
      </div>
      <div style="background:rgba(245,130,13,.1);border:1px solid rgba(245,130,13,.3);border-radius:6px;padding:18px;text-align:center;margin-bottom:10px">
        <div style="font-size:.6rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--or);margin-bottom:6px">Cuota mensual estimada</div>
        <div id="hipCuotaMensual" style="font-family:'Cormorant Garamond',serif;font-size:2.2rem;color:var(--wh)"></div>
      </div>
      <p style="font-size:.68rem;color:var(--mt);line-height:1.6">Esta es una estimaci&oacute;n informativa basada en una tasa de referencia y no constituye una oferta de financiamiento. La aprobaci&oacute;n final, tasa real y condiciones dependen del banco y de tu perfil crediticio.</p>
    </div>` : ''}

  </div>

  <div class="dv3-side">

    <div class="dv3-side-card wa-card">
      <div class="dv3-avail"><span class="dv3-live"></span>Asesor disponible ahora</div>
      <div class="dv3-agent-row">
        <div class="dv3-agent-avatar">${prop.asesor ? escapeHtml(prop.asesor.charAt(0).toUpperCase()) : 'ZI'}</div>
        <div>
          <div class="dv3-agent-name">${prop.asesor ? escapeHtml(prop.asesor) : 'Zona INNmueble'}</div>
          <div class="dv3-agent-role">Asesor inmobiliario &middot; +502 ${prop.waAsesor ? escapeHtml(prop.waAsesor) : '4554-2088'}</div>
        </div>
      </div>
      <a class="dv3-wa-btn" href="${waLink(msgInfo)}" target="_blank" rel="noopener">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Solicitar informaci&oacute;n
      </a>
      <a class="dv3-wa-btn outline" href="${waLink(msgVisit)}" target="_blank" rel="noopener">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Agendar visita privada
      </a>
      <div class="dv3-divider"></div>
      <div class="dv3-form-title">O d&eacute;janos tus datos</div>
      <form onsubmit="var f=this,wa='50245542088',t=encodeURIComponent('Nuevo lead - ${escapeHtml(prop.title)}\nNombre: '+f.nombre.value+'\nTel\u00e9fono: '+f.telefono.value+'\nMensaje: '+(f.mensaje.value||'Sin mensaje')+'\nURL: ${propUrl}');window.open('https://wa.me/'+wa+'?text='+t,'_blank');f.nextElementSibling.style.display='block';f.reset();return false;">
        <input class="dv3-input" type="text" name="nombre" placeholder="Tu nombre completo" required>
        <input class="dv3-input" type="tel" name="telefono" placeholder="Tu tel&eacute;fono / WhatsApp" required>
        <textarea class="dv3-input" name="mensaje" placeholder="&iquest;Qu&eacute; deseas saber?" rows="2" style="resize:none"></textarea>
        <button class="dv3-submit" type="submit">Enviar consulta</button>
      </form>
      <p style="display:none;font-size:.72rem;color:#4ade80;text-align:center;margin:10px 0 0">&check; Enviado. Te contactamos pronto.</p>
    </div>

    <div class="dv3-side-ref">
      <div class="dv3-ref-l">C&oacute;digo de referencia</div>
      <div class="dv3-ref-v">${escapeHtml(prop.codigo||prop.slug.toUpperCase())}</div>
    </div>

    <div class="dv3-more-links">
      <div class="dv3-ref-l" style="margin-bottom:10px">M&aacute;s propiedades</div>
      <a class="dv3-more-link" href="/propiedades.html?tipo=${encodeURIComponent(prop.tipo)}">&rarr; M&aacute;s ${escapeHtml(prop.tipo)}s disponibles</a>
      <a class="dv3-more-link" href="/propiedades.html?ciudad=${encodeURIComponent(prop.municipio||prop.zona||'')}">&rarr; Propiedades en ${escapeHtml(prop.municipio||prop.zona||'Guatemala')}</a>
      <a class="dv3-more-link" href="/propiedades.html">&rarr; Ver cat&aacute;logo completo</a>
    </div>

  </div>
</div>

<div class="dv3-wa-float" id="dv3waFloat">
  <a href="${waLink(msgInfo)}" target="_blank" rel="noopener">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    Informaci&oacute;n
  </a>
  <a class="sec" href="${waLink(msgVisit)}" target="_blank" rel="noopener">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    Visita
  </a>
</div>

${relHtml}

<!-- LIGHTBOX -->
<div class="dv3-lb" id="dv3lb" onclick="if(event.target===this)dv3LightClose()">
  <button class="dv3-lb-close" onclick="dv3LightClose()">&#10005;</button>
  <button class="dv3-lb-nav dv3-lb-prev" onclick="dv3LightNav(-1)">&#8249;</button>
  <button class="dv3-lb-nav dv3-lb-next" onclick="dv3LightNav(1)">&#8250;</button>
  <span class="dv3-lb-counter" id="dv3lbCounter"></span>
  <img class="dv3-lb-img" id="dv3lbImg" src="" alt="">
  <div class="dv3-lb-strip" id="dv3lbStrip"></div>
</div>

<script>
var _dv3Gal=${JSON.stringify((esExclusiva||cfg.fotos) ? [gal[0]].filter(Boolean) : gal)};
var _dv3Idx=0;
function dv3LightOpen(i){
  _dv3Idx=i||0;
  dv3LightRender();
  document.getElementById('dv3lb').classList.add('open');
  document.body.style.overflow='hidden';
}
function dv3LightClose(){
  document.getElementById('dv3lb').classList.remove('open');
  document.body.style.overflow='';
}
function dv3LightNav(d){
  _dv3Idx=(_dv3Idx+d+_dv3Gal.length)%_dv3Gal.length;
  dv3LightRender();
}
function dv3LightRender(){
  var img=document.getElementById('dv3lbImg');
  var ctr=document.getElementById('dv3lbCounter');
  var strip=document.getElementById('dv3lbStrip');
  if(!img)return;
  img.src=_dv3Gal[_dv3Idx]||'';
  if(ctr)ctr.textContent=(_dv3Idx+1)+' / '+_dv3Gal.length;
  if(strip){
    strip.innerHTML=_dv3Gal.map(function(src,i){
      return '<img src="'+src+'" class="'+(i===_dv3Idx?'on':'')+'" onclick="dv3LightSet('+i+')" loading="lazy">';
    }).join('');
    var active=strip.querySelectorAll('img')[_dv3Idx];
    if(active)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  }
}
function dv3LightSet(i){_dv3Idx=i;dv3LightRender();}
document.addEventListener('keydown',function(e){
  var lb=document.getElementById('dv3lb');
  if(!lb||!lb.classList.contains('open'))return;
  if(e.key==='ArrowRight')dv3LightNav(1);
  if(e.key==='ArrowLeft')dv3LightNav(-1);
  if(e.key==='Escape')dv3LightClose();
});
function dv3Tab(id,btn){
  document.querySelectorAll('.dv3-tab-panel').forEach(function(p){p.classList.remove('on');});
  document.querySelectorAll('.dv3-tab').forEach(function(b){b.classList.remove('on');});
  var el=document.getElementById('dv3-'+id);
  if(el)el.classList.add('on');
  btn.classList.add('on');
}
var _dv3PrecioBase=${(!esExclusiva&&!cfg.precio) ? (prop.priceNumeric||0) : 0};
var _dv3Moneda=${JSON.stringify((prop.priceFormatted||'').includes('$') ? '$' : 'Q')};
function dv3FmtMoneda(n){
  return _dv3Moneda+' '+Math.round(n).toLocaleString('en-US');
}
function dv3CalcHipoteca(){
  var engPct=parseFloat(document.getElementById('hipEnganche').value)||20;
  var plazoAnios=parseFloat(document.getElementById('hipPlazo').value)||20;
  var tasaAnual=parseFloat(document.getElementById('hipTasa').value)||9.5;
  document.getElementById('hipEngancheVal').textContent=engPct;
  document.getElementById('hipPlazoVal').textContent=plazoAnios;
  if(!_dv3PrecioBase)return;
  var enganche=_dv3PrecioBase*(engPct/100);
  var monto=_dv3PrecioBase-enganche;
  var tasaMensual=(tasaAnual/100)/12;
  var nPagos=plazoAnios*12;
  var cuota=tasaMensual>0
    ? monto*(tasaMensual*Math.pow(1+tasaMensual,nPagos))/(Math.pow(1+tasaMensual,nPagos)-1)
    : monto/nPagos;
  var elPrecio=document.getElementById('hipPrecioBase');
  var elEng=document.getElementById('hipEngancheMonto');
  var elMonto=document.getElementById('hipMontoFinanciar');
  var elCuota=document.getElementById('hipCuotaMensual');
  if(elPrecio)elPrecio.textContent=dv3FmtMoneda(_dv3PrecioBase);
  if(elEng)elEng.textContent=dv3FmtMoneda(enganche);
  if(elMonto)elMonto.textContent=dv3FmtMoneda(monto);
  if(elCuota)elCuota.textContent=dv3FmtMoneda(cuota)+' / mes';
}
if(document.getElementById('dv3-hipoteca')){dv3CalcHipoteca();}
<\/script>`;



  const metaDesc = `${prop.tipo} en ${prop.locationFull}. ${(esExclusiva||cfg.precio)?'Precio a consultar':prop.priceFormatted}. ${(!esExclusiva&&!cfg.specs&&prop.habitaciones&&prop.habitaciones!=='0')?prop.habitaciones+' habitaciones. ':''}Consulta disponibilidad por WhatsApp.`;
  // Schema markup para Google
  const schemaProperty = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": prop.title,
    "description": (esExclusiva||cfg.descripcion) ? prop.title : (prop.description || prop.title),
    "url": `https://zona-innmueble.com/propiedades/${prop.slug}.html`,
    "image": prop.mainImage || '',
    "address": {
      "@type": "PostalAddress",
      "addressLocality": prop.municipio || prop.zona || 'Guatemala',
      "addressCountry": "GT"
    },
    "offers": (prop.priceNumeric && !esExclusiva && !cfg.precio) ? {
      "@type": "Offer",
      "price": prop.priceNumeric,
      "priceCurrency": "USD"
    } : undefined
  });
  // Titulo SEO optimizado: "Casa en Venta Zona 16 Guatemala | Zona INNmueble"
  const seoTitle = `${prop.title} | ${prop.tipo||'Propiedad'} en ${prop.municipio||prop.zona||'Guatemala'}`;
  return layout({ title: seoTitle, desc: metaDesc, canonical: `/propiedades/${prop.slug}.html`, ogImage: prop.mainImage, body,
    scripts: `<script type="application/ld+json">${schemaProperty}<\/script><script async src="https://zona-inmu.tours-virtuales-gt.workers.dev/dynamic-grid.js"><\/script>` });
}


// ── PAGINA DE ZONA ───────────────────────────────────────────────────
const ZONA_INFO = {
  'guatemala': {
    titulo: 'Guatemala — Zona 10, 14, 15 y 16', subtitulo: 'El corazón premium de la capital',
    desc: 'Las zonas 10, 14, 15 y 16 de Ciudad de Guatemala concentran las residencias más exclusivas, los edificios corporativos de mayor altura y los centros comerciales que definen el estilo de vida premium de la región. Invertir aquí no es solo comprar una propiedad — es adquirir un activo en el mercado más sólido de Centroamérica.',
    img: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1200&q=80',
    datos: ['Alta plusvalía histórica','Acceso a centros financieros','Infraestructura clase A','Servicios premium 24/7'],
    inversion: { apreciacion: '8–12% anual', demanda: 'Alta', perfil: 'Residencial premium e inversión' },
    lifestyle: ['Zona Rosa · gastronomía internacional','Centros comerciales: Oakland, Fontabella','Zona financiera y corporativa','Hospitales y clínicas de primer nivel','Colegios bilingües top del país'],
    porque: [
      { icon: '🏙️', titulo: 'Plusvalía garantizada', texto: 'Las zonas premium de Ciudad de Guatemala mantienen apreciación constante incluso en ciclos económicos adversos.' },
      { icon: '🔐', titulo: 'Seguridad y privacidad', texto: 'Condominios y residencias con seguridad 24/7, acceso controlado y comunidades establecidas.' },
      { icon: '📍', titulo: 'Ubicación estratégica', texto: 'A menos de 10 minutos de los principales centros comerciales, restaurantes y el Aeropuerto Internacional.' },
      { icon: '📈', titulo: 'Inversión blindada', texto: 'Mercado con demanda sostenida. Las propiedades bien ubicadas se venden en semanas, no meses.' },
    ]
  },
  'zona-10': {
    titulo: 'Zona 10', subtitulo: 'La Zona Viva · Lifestyle premium en el centro del poder',
    desc: 'Zona 10 es el epicentro financiero, gastronómico y residencial de Guatemala. La Zona Viva concentra los mejores restaurantes, hoteles 5 estrellas, galerías de arte y vida nocturna sofisticada. Residir aquí significa estar en el corazón de todo — sin sacrificar tranquilidad en sus colonias residenciales internas.',
    img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80',
    datos: ['Zona Viva y vida nocturna','Hoteles 5 estrellas','Restaurantes internacionales','Embajadas y consulados'],
    inversion: { apreciacion: '10–14% anual', demanda: 'Muy Alta', perfil: 'Residencial · Inversión · Renta' },
    lifestyle: ['La Zona Viva — centro de entretenimiento','Hotel InterContinental, Marriott, Westin','Gastronomía: Sei, Tamarindos, Taninos','Centro comercial Oakland Mall','Embajada de EE.UU. y delegaciones diplomáticas','Clínicas y hospitales privados'],
    porque: [
      { icon: '🍷', titulo: 'Lifestyle inigualable', texto: 'Restaurantes de autor, vida cultural activa y entretenimiento de primer nivel a pasos de tu puerta.' },
      { icon: '💼', titulo: 'Hub corporativo', texto: 'Empresas Fortune 500, firmas legales, bancos internacionales y sedes corporativas en tu misma zona.' },
      { icon: '🏠', titulo: 'Renta garantizada', texto: 'Alta demanda de ejecutivos expatriados genera rentabilidad de renta superior al promedio del mercado.' },
      { icon: '📈', titulo: 'Mayor plusvalía de la capital', texto: 'Históricamente la zona con mayor apreciación de Guatemala. Demanda permanentemente insatisfecha.' },
    ]
  },
  'zona-14': {
    titulo: 'Zona 14', subtitulo: 'Santa Fe · Residencial exclusivo para familias premium',
    desc: 'Zona 14 es el destino preferido de las familias guatemaltecas más establecidas. Sus colonias privadas — Vista Hermosa, San Isidro, Oakland — ofrecen amplitud, arbolado, seguridad y una calidad de vida que pocas zonas de Latinoamérica pueden igualar. Aquí el lujo no se exhibe — se vive.',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    datos: ['Colonias privadas consolidadas','Colegios bilingües premium','Acceso a Santa Fe','Ambiente familiar seguro'],
    inversion: { apreciacion: '8–11% anual', demanda: 'Alta', perfil: 'Residencial familiar premium' },
    lifestyle: ['Centro Comercial Santa Fe','Colegios: Colegio Americano, Interamericano','Parques y áreas verdes privadas','Club Social Zona 14','Hospitales: Herrera Llerandi, Bautista','Calles arboladas y tranquilas'],
    porque: [
      { icon: '🌳', titulo: 'La zona más arbolada de la capital', texto: 'Colonias con grandes áreas verdes, calles tranquilas y ambiente residencial que contrasta con el ruido urbano.' },
      { icon: '🏫', titulo: 'Los mejores colegios del país', texto: 'Colegio Americano, Interamericano y otros colegios bilingües de excelencia a distancia mínima.' },
      { icon: '🔒', titulo: 'Comunidad establecida', texto: 'Colonias con décadas de historia, vecinos estables y ambiente de confianza difícil de replicar.' },
      { icon: '💎', titulo: 'Discreción y exclusividad', texto: 'El verdadero lujo guatemalteco vive aquí — amplio, privado, sin ostentación.' },
    ]
  },
  'zona-15': {
    titulo: 'Zona 15', subtitulo: 'Vista Hermosa · Residencial premium con vistas únicas al valle',
    desc: 'Zona 15 ofrece algo que el resto de la capital no puede dar: vistas panorámicas al valle de Guatemala desde sus barrancos. Sus colonias elevadas — Vista Hermosa I, II y III — combinan altitud, aire limpio, silencio y propiedades de gran tamaño. Es la elección natural de quienes buscan espacio real sin salir de la ciudad.',
    img: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80',
    datos: ['Vistas panorámicas al valle','Lotes amplios y jardines','Tranquilidad residencial','Clima más fresco que el centro'],
    inversion: { apreciacion: '7–10% anual', demanda: 'Media-Alta', perfil: 'Residencial — familia y retiro premium' },
    lifestyle: ['Colonias Vista Hermosa I, II, III','Parque Ecológico Vista Hermosa','Colegios privados cercanos','Restaurantes y cafeterías boutique','Acceso rápido a zona 14 y 16','Supermercados y servicios completos'],
    porque: [
      { icon: '🏔️', titulo: 'Vistas que no tienen precio', texto: 'Amaneceres sobre el valle desde el jardín. Una experiencia de vida que solo Zona 15 puede ofrecer.' },
      { icon: '🍃', titulo: 'Aire limpio y silencio real', texto: 'Elevación que marca diferencia en calidad del aire y temperatura — fresco todo el año.' },
      { icon: '📐', titulo: 'Propiedades con espacio real', texto: 'Lotes grandes, jardines amplios y residencias con metros cuadrados que en otras zonas son imposibles.' },
      { icon: '🤫', titulo: 'Tranquilidad sin sacrificar acceso', texto: 'A 10–15 minutos de Zona 10 y 14. Lejos del ruido, cerca de todo lo que importa.' },
    ]
  },
  'zona-16': {
    titulo: 'Zona 16', subtitulo: 'Cayalá y el nuevo lujo planificado de Guatemala',
    desc: 'Zona 16 alberga uno de los desarrollos urbanísticos más importantes de Centroamérica: Ciudad Cayalá. Un concepto de ciudad dentro de la ciudad — caminable, segura, con arquitectura neoclásica, hoteles boutique, restaurantes, tiendas y residencias diseñadas para vivir sin usar el carro. La apuesta de largo plazo en Real Estate guatemalteco.',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    datos: ['Ciudad Cayalá planificada','Arquitectura premium uniforme','Ciudad caminable sin carros','Alta apreciación proyectada'],
    inversion: { apreciacion: '12–18% anual', demanda: 'Creciente', perfil: 'Inversión · Residencial · Renta vacacional' },
    lifestyle: ['Ciudad Cayalá — concepto caminable','Hotel Hyatt Centric Cayalá','Restaurantes boutique y cafés','Tiendas de diseñadores locales e internacionales','Eventos culturales y mercados artesanales','Offices y coworking premium'],
    porque: [
      { icon: '🏛️', titulo: 'El desarrollo más relevante del país', texto: 'Cayalá no es solo un vecindario — es una declaración de hacia dónde va el mercado premium guatemalteco.' },
      { icon: '🚶', titulo: 'Caminabilidad real', texto: 'Diseño urbano pensado para el peatón. Arquitectura coherente, aceras amplias y plazas que invitan a quedarse.' },
      { icon: '📊', titulo: 'Mayor potencial de apreciación', texto: 'Proyecto en expansión activa. Cada nueva etapa eleva el valor de las unidades existentes.' },
      { icon: '🌐', titulo: 'Referente internacional', texto: 'Reconocido en publicaciones de urbanismo como modelo de desarrollo planificado para Latinoamérica.' },
    ]
  },
  'fraijanes': {
    titulo: 'Fraijanes', subtitulo: 'Naturaleza, privacidad y retorno — a 25 minutos de la capital',
    desc: 'Fraijanes representa todo lo que la capital no puede ofrecer: hectáreas, bosque, silencio, clima fresco y propiedades con espacio real. En los últimos 5 años se ha consolidado como el mercado de mayor crecimiento del área metropolitana, atrayendo a familias, agricultores premium e inversionistas visionarios que anticiparon la tendencia.',
    img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80',
    datos: ['Clima fresco 18–22°C todo el año','Fincas desde 1 a 100+ manzanas','Mayor crecimiento del área metro','Acceso pavimentado a 25 min'],
    inversion: { apreciacion: '10–16% anual', demanda: 'Creciente alta', perfil: 'Fincas · Residencial · Inversión agrícola' },
    lifestyle: ['Fincas productivas con cacao, café, aguacate','Clubes ecuestres y deportivos','Aire limpio y baja densidad urbana','Comunidades cerradas en expansión','Acceso rápido a Carretera a El Salvador','Microclima ideal — sin calor extremo'],
    porque: [
      { icon: '🌿', titulo: 'Espacio que la ciudad no tiene', texto: 'Fincas de 1 a 100+ manzanas. El único mercado donde el metro cuadrado aún tiene precio razonable.' },
      { icon: '🌡️', titulo: 'El mejor clima del área metropolitana', texto: '18 a 22°C durante todo el año. Sin lluvia excesiva, sin calor. El clima que los capitalinos buscan.' },
      { icon: '📈', titulo: 'Mayor apreciación del área', texto: 'Fraijanes lleva 5 años consecutivos de apreciación superior al promedio del mercado guatemalteco.' },
      { icon: '🏡', titulo: 'Calidad de vida sin igual', texto: 'Silencio, naturaleza, seguridad y comunidad. Lo que las zonas urbanas perdieron hace décadas.' },
    ]
  },
  'cayala': {
    titulo: 'Cayalá', subtitulo: 'El estilo de vida premium planificado de Guatemala',
    desc: 'Ciudad Cayalá es el proyecto de desarrollo urbano más sofisticado de Guatemala y uno de los más reconocidos de Centroamérica. Su diseño neoclásico, calles peatonales, arquitectura uniforme y mezcla de usos crea un entorno de vida que atrae tanto a residentes nacionales como a expatriados e inversionistas internacionales.',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    datos: ['Proyecto urbanístico premiado','Zona caminable y segura','Alta demanda de alquiler','Expansión activa en nuevas etapas'],
    inversion: { apreciacion: '14–20% anual', demanda: 'Muy Alta', perfil: 'Inversión · Renta · Residencial premium' },
    lifestyle: ['Hotel Hyatt Centric','Plazas y calles peatonales','Restaurantes y cafés artesanales','Galería de arte y cultura local','Mercados y eventos semanales','Coworking y oficinas boutique'],
    porque: [
      { icon: '🏛️', titulo: 'Arquitectura que te enamora', texto: 'Fachadas neoclásicas, calles adoquinadas y plazas diseñadas para la vida al aire libre — único en Guatemala.' },
      { icon: '💰', titulo: 'Mejor ROI del mercado', texto: 'Unidades en Cayalá generan renta superior al 8% anual con demanda de alquiler permanentemente insatisfecha.' },
      { icon: '🚶', titulo: 'Sin carro, sin estrés', texto: 'Todo a pie: restaurantes, tiendas, trabajo, cultura. El concepto de ciudad que el resto de Guatemala todavía no tiene.' },
      { icon: '🌍', titulo: 'Reconocimiento internacional', texto: 'Cayalá aparece en publicaciones de arquitectura y urbanismo de Nueva York, Madrid y Ciudad de México.' },
    ]
  },
  'mixco': {
    titulo: 'Mixco', subtitulo: 'Conectividad, diversidad y oportunidad de inversión',
    desc: 'Mixco es el municipio más poblado del departamento de Guatemala y uno con mayor diversidad de oferta inmobiliaria. Desde proyectos de apartamentos modernos hasta residencias familiares en colonias consolidadas, Mixco ofrece una relación precio-valor muy atractiva para compradores de primera propiedad e inversionistas con visión de largo plazo.',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
    datos: ['Acceso a Calzada Roosevelt','Diversidad de oferta residencial','Precios accesibles vs capital','Proyección de crecimiento'],
    inversion: { apreciacion: '5–8% anual', demanda: 'Alta', perfil: 'Primera propiedad · Inversión accesible' },
    lifestyle: ['Centro Comercial Miraflores','Calzada Roosevelt — acceso rápido','Colegios y universidades cercanas','Mercados y comercio activo','Expansión de proyectos residenciales','Transporte público conectado'],
    porque: [
      { icon: '🛣️', titulo: 'Conectividad sin igual', texto: 'Acceso directo a Calzada Roosevelt y al anillo periférico. A 20 minutos del centro de la capital.' },
      { icon: '💵', titulo: 'Mejor precio por metro cuadrado', texto: 'Propiedades bien ubicadas a precios que las zonas premium de la capital dejaron de ofrecer hace años.' },
      { icon: '📊', titulo: 'Mercado en crecimiento sostenido', texto: 'La densificación de Mixco garantiza apreciación progresiva en todos los segmentos del mercado.' },
      { icon: '🏘️', titulo: 'Comunidades establecidas', texto: 'Colonias con décadas de historia, vecinos estables y servicios completos.' },
    ]
  },
  'santa-catarina-pinula': {
    titulo: 'Santa Catarina Pinula', subtitulo: 'Vistas, privacidad y el mejor estándar residencial del oriente',
    desc: 'Santa Catarina Pinula combina lo mejor de dos mundos: la proximidad a la capital con la calidad de vida de zona residencial tranquila. Sus condominios y residencias de alto nivel ofrecen algunas de las mejores vistas panorámicas al valle de Guatemala, clima agradable y comunidades bien planificadas que atraen a familias que buscan calidad sin el bullicio urbano.',
    img: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80',
    datos: ['Vistas panorámicas al valle','Condominios privados establecidos','Clima agradable todo el año','15 min al centro de la capital'],
    inversion: { apreciacion: '7–10% anual', demanda: 'Media-Alta', perfil: 'Residencial familiar · Primera propiedad premium' },
    lifestyle: ['Calzada Aycinena — acceso directo','Colegios privados de referencia','Áreas verdes y parques comunales','Seguridad 24/7 en condominios','Comercios y supermercados completos','Comunidad de alta cohesión social'],
    porque: [
      { icon: '🌄', titulo: 'Vistas que justifican el precio', texto: 'Desde Santa Catarina Pinula se ve toda la ciudad. Amaneceres sobre el valle que no se olvidan.' },
      { icon: '🏘️', titulo: 'Condominios con identidad', texto: 'Proyectos bien diseñados, mantenidos y con comunidades activas — más que residencias, un estilo de vida.' },
      { icon: '🌿', titulo: 'Verde sin salir del área metro', texto: 'Áreas verdes, jardines y un entorno natural que contrasta con la densidad urbana de zonas centrales.' },
      { icon: '📍', titulo: 'Distancia perfecta', texto: '15 minutos a Zona 10. La distancia ideal para desconectarse sin desconectarse de la ciudad.' },
    ]
  },
};


function zonaSlug(z) {
  return (z||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function zonaPage(zonaNombre, propsEnZona, allProps) {
  const slug = zonaSlug(zonaNombre);
  const info = ZONA_INFO[slug] || {
    titulo: zonaNombre, subtitulo: 'Propiedades disponibles',
    desc: `Descubre las propiedades disponibles en ${zonaNombre}, Guatemala. Residencias, terrenos e inversiones seleccionadas con asesoría personalizada.`,
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=70',
    datos: ['Ubicación estratégica','Propiedades verificadas','Asesoría personalizada','Respuesta rápida'],
    inversion: null, lifestyle: [], porque: []
  };

  const precios = propsEnZona.map(p => p.priceNumeric).filter(n => n > 0);
  const precioProm = precios.length ? Math.round(precios.reduce((a,b)=>a+b,0) / precios.length) : 0;
  const precioPromFmt = precioProm ? '$' + precioProm.toLocaleString('en-US') : null;
  const precioMin = precios.length ? Math.min(...precios) : 0;
  const precioMax = precios.length ? Math.max(...precios) : 0;
  const tiposEnZona = [...new Set(propsEnZona.map(p => p.tipo).filter(Boolean))];

  const body = `
<!-- HERO ZONA -->
<section style="position:relative;min-height:62vh;display:flex;align-items:flex-end;padding:0;overflow:hidden">
  <div style="position:absolute;inset:0;z-index:0">
    <img src="${escapeHtml(info.img)}" alt="${escapeHtml(info.titulo)}, Guatemala" style="width:100%;height:100%;object-fit:cover" loading="eager" fetchpriority="high">
    <div style="position:absolute;inset:0;background:linear-gradient(105deg,rgba(13,27,62,.94) 0%,rgba(13,27,62,.6) 55%,rgba(13,27,62,.75) 100%)"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,62,.95) 0%,transparent 55%)"></div>
  </div>
  <div style="position:relative;z-index:2;padding:100px 6% 56px;max-width:1000px;width:100%">
    <div style="font-size:.6rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:14px">
      <a href="/" style="color:inherit;text-decoration:none">Inicio</a> / <a href="/propiedades.html" style="color:inherit;text-decoration:none">Propiedades</a> / ${escapeHtml(info.titulo)}
    </div>
    <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(193,145,75,.12);border:1px solid rgba(193,145,75,.3);border-radius:100px;padding:5px 14px;margin-bottom:18px">
      <span style="font-size:.58rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--or)">Zona Premium · Guatemala</span>
    </div>
    <h1 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2.4rem,5.5vw,4.2rem);font-weight:300;line-height:1.08;color:var(--wh);margin-bottom:14px">${escapeHtml(info.titulo)}</h1>
    <p style="font-size:.9rem;color:var(--sv);font-weight:300;max-width:560px;line-height:1.7;margin-bottom:0">${escapeHtml(info.subtitulo)}</p>
  </div>
</section>

<!-- BARRA DE DATOS -->
<div style="background:var(--ink2);border-bottom:1px solid var(--bd);padding:0 6%">
  <div class="zona-stats-row" style="max-width:1200px;margin:0 auto;display:flex;flex-wrap:wrap">
    ${[
      [propsEnZona.length + (propsEnZona.length===1?' propiedad':' propiedades'), 'Disponibles ahora'],
      [precioPromFmt || '—', 'Precio promedio'],
      [precioMin && precioMax ? '$'+precioMin.toLocaleString('en-US')+' – $'+precioMax.toLocaleString('en-US') : '—', 'Rango de precios'],
      [info.inversion ? info.inversion.apreciacion : '—', 'Apreciación anual'],
    ].map(([val,lab])=>`<div style="flex:1;min-width:160px;padding:22px 24px;border-right:1px solid var(--bd)">
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:400;color:var(--or);line-height:1;margin-bottom:5px">${val}</div>
      <div style="font-size:.6rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--mt)">${lab}</div>
    </div>`).join('')}
  </div>
</div>

<!-- CONTENIDO EDITORIAL -->
<section style="padding:64px 6%;background:var(--ink)">
  <div class="zona-content-grid" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.5fr 1fr;gap:64px;align-items:start">
    <!-- DESCRIPCIÓN -->
    <div>
      <div class="ey" style="margin-bottom:14px">Sobre la zona</div>
      <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(1.6rem,3vw,2.4rem);font-weight:300;color:var(--wh);margin-bottom:24px;line-height:1.2">
        Por qué <em style="color:var(--or);font-style:italic">${escapeHtml(info.titulo.split(' ')[0])}</em> es diferente
      </h2>
      <p style="font-size:.88rem;color:var(--sv);line-height:2;margin-bottom:28px;font-weight:300">${escapeHtml(info.desc)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${info.datos.map(d=>`<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(193,145,75,.08);border:1px solid rgba(193,145,75,.25);border-radius:100px;padding:5px 12px;font-size:.67rem;font-weight:600;color:var(--or);letter-spacing:.06em">
          <svg width="8" height="8" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ${escapeHtml(d)}
        </span>`).join('')}
      </div>
    </div>
    <!-- SIDEBAR INVERSIÓN -->
    <div style="background:var(--ink2);border:1px solid var(--gl);border-radius:16px;padding:28px">
      <div style="font-size:.58rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--mt);margin-bottom:18px">Datos de inversión</div>
      ${info.inversion ? `
      <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid var(--bd)">
          <span style="font-size:.72rem;color:var(--sv)">Apreciación anual</span>
          <span style="font-family:'Cormorant Garamond',serif;font-size:1.15rem;color:var(--or)">${escapeHtml(info.inversion.apreciacion)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid var(--bd)">
          <span style="font-size:.72rem;color:var(--sv)">Demanda</span>
          <span style="font-size:.72rem;font-weight:700;color:var(--wh)">${escapeHtml(info.inversion.demanda)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:.72rem;color:var(--sv)">Perfil de comprador</span>
          <span style="font-size:.72rem;color:var(--sv);text-align:right;max-width:140px">${escapeHtml(info.inversion.perfil)}</span>
        </div>
      </div>
      ` : ''}
      ${tiposEnZona.length ? `
      <div style="margin-bottom:20px">
        <div style="font-size:.6rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--mt);margin-bottom:10px">Tipos disponibles</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">${tiposEnZona.map(t=>`<span style="background:rgba(255,255,255,.06);border:1px solid var(--gl);border-radius:100px;padding:4px 10px;font-size:.65rem;color:var(--sv)">${escapeHtml(t)}</span>`).join('')}</div>
      </div>` : ''}
      <a href="https://wa.me/50245542088?text=${encodeURIComponent('Hola, quiero ver propiedades en ' + info.titulo + ', Guatemala.')}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#0d1b3e;border:1px solid rgba(37,211,102,.3);color:#fff;padding:13px 20px;border-radius:8px;font-size:.72rem;font-weight:700;text-decoration:none;margin-bottom:10px">
        ${WA_SVG} Consultar disponibilidad
      </a>
      <p style="text-align:center;font-size:.62rem;color:var(--mt);margin:0">Respuesta en menos de 2 horas · Sin compromiso</p>
    </div>
  </div>
</section>

<!-- POR QUÉ AQUÍ -->
${info.porque && info.porque.length ? `
<section style="padding:64px 6%;background:var(--ink2);border-top:1px solid var(--bd)">
  <div style="max-width:1200px;margin:0 auto">
    <div class="ey" style="margin-bottom:14px;justify-content:center;text-align:center">Razones de peso</div>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:300;color:var(--wh);text-align:center;margin-bottom:44px;line-height:1.2">
      Por qué elegir <em style="color:var(--or);font-style:italic">${escapeHtml(info.titulo.split(' ')[0])}</em>
    </h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px">
      ${info.porque.map(r=>`
      <div style="background:var(--ink);border:1px solid var(--gl);border-radius:14px;padding:28px 24px;transition:border-color .3s" onmouseover="this.style.borderColor='rgba(193,145,75,.4)'" onmouseout="this.style.borderColor='var(--gl)'">
        <div style="font-size:1.8rem;margin-bottom:14px">${r.icon}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:500;color:var(--wh);margin-bottom:10px;line-height:1.3">${escapeHtml(r.titulo)}</div>
        <p style="font-size:.78rem;color:var(--sv);line-height:1.8;margin:0;font-weight:300">${escapeHtml(r.texto)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>` : ''}

<!-- LIFESTYLE -->
${info.lifestyle && info.lifestyle.length ? `
<section style="padding:56px 6%;background:var(--ink)">
  <div style="max-width:1200px;margin:0 auto">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center">
      <div>
        <div class="ey" style="margin-bottom:14px">Entorno y lifestyle</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(1.6rem,3vw,2.4rem);font-weight:300;color:var(--wh);margin-bottom:28px;line-height:1.2">
          Lo que encuentras <em style="color:var(--or);font-style:italic">aquí</em>
        </h2>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${info.lifestyle.map(item=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--ink2);border:1px solid var(--bd);border-radius:8px">
            <div style="width:6px;height:6px;border-radius:50%;background:var(--or);flex-shrink:0"></div>
            <span style="font-size:.78rem;color:var(--sv)">${escapeHtml(item)}</span>
          </div>`).join('')}
        </div>
      </div>
      <div style="background:var(--ink2);border:1px solid var(--gl);border-radius:16px;padding:32px">
        <div style="font-size:.58rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--mt);margin-bottom:20px">¿Buscas algo específico?</div>
        <p style="font-size:.82rem;color:var(--sv);line-height:1.9;margin-bottom:24px;font-weight:300">
          Nuestro equipo conoce cada propiedad, cada colonia y cada micro-mercado de ${escapeHtml(info.titulo.split('—')[0].trim())}. Dinos qué buscas.
        </p>
        <a href="https://wa.me/50245542088?text=${encodeURIComponent('Hola, busco una propiedad en ' + info.titulo + '. ¿Qué opciones tienen disponibles?')}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px;background:#0d1b3e;border:1px solid rgba(37,211,102,.3);color:#fff;padding:12px 18px;border-radius:8px;font-size:.72rem;font-weight:700;text-decoration:none;margin-bottom:10px">
          ${WA_SVG} Escribir ahora
        </a>
        <a href="/propiedades.html" style="display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid var(--gl);color:var(--sv);padding:11px 18px;border-radius:8px;font-size:.68rem;font-weight:600;text-decoration:none;letter-spacing:.06em;text-transform:uppercase">
          Ver todas las propiedades
        </a>
      </div>
    </div>
  </div>
</section>` : ''}

<!-- PROPIEDADES DE LA ZONA -->
<section style="padding:64px 6%;background:var(--ink2);border-top:1px solid var(--bd)">
  <div style="max-width:1200px;margin:0 auto">
    <div class="ey" style="margin-bottom:14px">Disponibles ahora</div>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:300;color:var(--wh);margin-bottom:32px;line-height:1.2">
      Propiedades en <em style="color:var(--or);font-style:italic">${escapeHtml(info.titulo.split('—')[0].trim())}</em>
    </h2>
    ${propsEnZona.length ? `<div class="prop-grid">${propsEnZona.map(p=>card(p)).join('')}</div>
    <div style="text-align:center;padding:44px 0 0">
      <a href="/propiedades.html" class="btn-or">Ver catálogo completo</a>
    </div>` : `
    <div style="text-align:center;padding:48px 24px;background:var(--ink);border:1px solid var(--bd);border-radius:14px">
      <div style="font-size:2rem;margin-bottom:14px">🔔</div>
      <p style="font-size:.85rem;color:var(--sv);margin-bottom:6px">No hay propiedades activas en esta zona por el momento</p>
      <small style="font-size:.72rem;color:var(--mt)">Contáctanos y te avisamos cuando haya disponibilidad</small>
      <div style="margin-top:22px">
        <a href="https://wa.me/50245542088?text=${encodeURIComponent('Hola, me interesa una propiedad en ' + info.titulo + '. ¿Cuándo tendrán disponibilidad?')}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:#0d1b3e;border:1px solid rgba(37,211,102,.3);color:#fff;padding:10px 20px;border-radius:8px;font-size:.72rem;font-weight:700;text-decoration:none">
          ${WA_SVG} Avisar cuando haya disponibilidad
        </a>
      </div>
    </div>`}
  </div>
</section>`;

  const schemaZona = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Propiedades en ${info.titulo} - Guatemala`,
    "description": info.desc,
    "url": `https://zona-innmueble.com/zonas/${slug}.html`,
    "numberOfItems": propsEnZona.length,
    "itemListElement": propsEnZona.slice(0,10).map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://zona-innmueble.com/propiedades/${p.slug}.html`,
      "name": p.title
    }))
  });

  return layout({
    title: `${propsEnZona.length > 0 ? propsEnZona.length + ' Propiedades en ' : 'Propiedades en '}${info.titulo} Guatemala - Casas y Fincas en Venta`,
    desc: `${propsEnZona.length > 0 ? propsEnZona.length + ' propiedades' : 'Propiedades'} en venta en ${info.titulo}, Guatemala. ${info.subtitulo}. Casas, fincas y apartamentos con asesoría personalizada.`,
    canonical: `/zonas/${slug}.html`,
    ogImage: info.img,
    body,
    scripts: `<script type="application/ld+json">${schemaZona}</script>`
  });
}

module.exports = { indexPage, catalogPage, detailPage, zonaPage, zonaSlug, ZONA_INFO };

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
<!-- SECCION DE CONFIANZA -->
<section style="padding:48px 6%;background:var(--ink);border-top:1px solid var(--gl);border-bottom:1px solid var(--gl)" class="fade-in-up">
  <div style="max-width:1200px;margin:0 auto">
    <div style="text-align:center;margin-bottom:32px">
      <div style="font-size:.6rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--mt)">Por qué elegirnos</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px">
      <div style="text-align:center;padding:24px 16px">
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:300;color:var(--or);line-height:1;margin-bottom:8px">10+</div>
        <div style="font-size:.72rem;font-weight:600;color:var(--sv);line-height:1.6">Años conectando familias con su propiedad ideal en Guatemala</div>
      </div>
      <div style="text-align:center;padding:24px 16px;border-left:1px solid var(--gl);border-right:1px solid var(--gl)">
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:300;color:var(--or);line-height:1;margin-bottom:8px">&lt;2h</div>
        <div style="font-size:.72rem;font-weight:600;color:var(--sv);line-height:1.6">Tiempo promedio de respuesta. Tu consulta no espera</div>
      </div>
      <div style="text-align:center;padding:24px 16px">
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:300;color:var(--or);line-height:1;margin-bottom:8px">100%</div>
        <div style="font-size:.72rem;font-weight:600;color:var(--sv);line-height:1.6">Propiedades verificadas. Papelería en orden, sin sorpresas</div>
      </div>
      <div style="text-align:center;padding:24px 16px;border-left:1px solid var(--gl)">
        <div style="font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:300;color:var(--or);line-height:1;margin-bottom:8px">5★</div>
        <div style="font-size:.72rem;font-weight:600;color:var(--sv);line-height:1.6">Calificación promedio de nuestros clientes en cada cierre</div>
      </div>
    </div>
  </div>
</section>

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
    <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">${props.filter(p=>!p.estado||p.estado==='Activa').length}+ Propiedades</div>
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
