<!-- Build: 1780967279 -->
const { layout } = require('./layout');
const { card } = require('./card');

function indexPageNew(props, brokers) {
  brokers = brokers || [];
  const featured = props.slice(0, 6);
  const zonas = [...new Set(props.map(p=>p.municipio).filter(Boolean))].slice(0, 6);
  
  const zonasHTML = zonas.map(z => {
    const slug = z.toLowerCase().normalize('NFD').replace(/[Ì-Í¯]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    const count = props.filter(p=>p.municipio===z).length;
    return `<a href="/zonas/${slug}.html" style="display:inline-flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--border);border-radius:8px;padding:10px 18px;font-size:14px;font-weight:500;color:var(--gray-900);transition:all .2s" onmouseover="this.style.borderColor='var(--gold)';this.style.color='var(--gold)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--gray-900)'">\u{1F4CD} ${z} <span style="color:var(--text-muted);font-size:12px">(${count})</span></a>`;
  }).join('');

  const statsBar = [
    [props.length+'+','Propiedades'],
    ['10+','Anos mercado'],
    ['6','Zonas premium'],
    ['500+','Compradores/mes'],
  ].map(([n,l])=>`<div style="flex:1;min-width:140px;padding:20px 0;border-right:1px solid rgba(255,255,255,.08);text-align:center"><div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:2rem;font-weight:500;color:var(--gold);line-height:1;margin-bottom:4px">${n}</div><div style="font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4)">${l}</div></div>`).join('');

  const herramientas = [
    ['🏠','Valuador','/herramientas/valuador.html','Calcula el valor estimado de cualquier propiedad'],
    ['🧮','Calculadora','/herramientas/calculadora-hipotecaria.html','Simula tu cuota hipotecaria mensual'],
    ['📈','Simulador','/herramientas/simulador-inversion.html','Analiza ROI y rentabilidad antes de invertir'],
    ['📚','Guia de Compra','/herramientas/guia-compra.html','Guia premium para comprar sin errores'],
  ].map(([ic,nm,hr,ds])=>`<a href="${hr}" style="display:flex;flex-direction:column;align-items:flex-start;padding:28px;background:#f8f9fb;border:1.5px solid #eef0f3;border-radius:12px;text-decoration:none;text-align:left;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.background='white';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 40px rgba(0,0,0,.08)'" onmouseout="this.style.borderColor='#eef0f3';this.style.background='#f8f9fb';this.style.transform='none';this.style.boxShadow='none'"><div style="margin-bottom:16px;display:flex;align-items:center;justify-content:center;color:var(--gold)">${ic}</div><div style="font-size:15px;font-weight:700;color:#0a1628;margin-bottom:8px">${nm}</div><div style="font-size:13px;color:#64748b;line-height:1.6;flex:1">${ds}</div><div style="margin-top:16px;font-size:12px;font-weight:700;color:var(--gold);letter-spacing:.04em">Ir a herramienta &rarr;</div></a>`).join('');

  const body = `
<section class="hero-section" style="min-height:92vh;position:relative;display:flex;flex-direction:column;align-items:center;background:#0a1628;overflow:hidden">
  <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=60') center/cover no-repeat;opacity:.18"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,22,40,.98) 0%,rgba(10,22,40,.75) 60%,rgba(15,27,46,.9) 100%)"></div>
  <div style="position:absolute;top:-200px;right:-100px;width:700px;height:700px;background:radial-gradient(circle,rgba(201,169,110,.08) 0%,transparent 70%);pointer-events:none"></div>
  <div class="hero-inner" style="position:relative;z-index:2;width:100%;max-width:1200px;margin:0 auto;padding:clamp(60px,8vw,100px) 4% clamp(40px,10vw,140px)">
    <div style="max-width:700px">
      <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(201,169,110,.12);border:1px solid rgba(201,169,110,.3);border-radius:100px;padding:6px 16px;margin-bottom:12px">
        <span style="width:6px;height:6px;background:var(--gold);border-radius:50%;display:inline-block"></span>
        <span style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)">Portal Premium Guatemala</span>
      </div>
      <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(3rem,6vw,5rem);font-weight:300;line-height:1.05;color:white;margin-bottom:10px">
        Encuentra la propiedad<br>
        <em style="font-style:italic;color:var(--gold)">que cambiara tu vida</em>
      </h1>
      <p style="font-size:1rem;color:rgba(255,255,255,.6);line-height:1.8;max-width:520px;margin-bottom:20px;font-weight:300">
        ${props.length} propiedades verificadas en Guatemala. Casas, apartamentos, fincas e inversiones en las zonas mas exclusivas.
      </p>
      <div style="max-width:560px;margin-bottom:16px">
        <form action="/propiedades.html" method="GET" style="display:flex;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:12px;overflow:hidden;backdrop-filter:blur(10px)">
          <input type="text" name="q" placeholder="Buscar por zona, tipo o precio..." style="flex:1;background:transparent;border:none;padding:14px 20px;font-size:14px;color:white;outline:none;font-family:inherit" />
          <button type="submit" style="background:var(--gold);border:none;padding:14px 24px;cursor:pointer;display:flex;align-items:center;transition:opacity .2s" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a1628" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        </form>
      </div>
      <div class="hub-hero-tabs">
        <button class="hub-hero-tab active" onclick="setHubMode('comprar')">Comprar</button>
        <button class="hub-hero-tab" onclick="setHubMode('alquilar')">Alquilar</button>
        <button class="hub-hero-tab" onclick="setHubMode('invertir')">Invertir</button>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;max-width:520px">
        <a href="/propiedades.html" id="hubHeroCTA" style="display:inline-flex;align-items:center;gap:8px;background:var(--gold);color:#0a1628;font-size:14px;font-weight:700;letter-spacing:.04em;padding:14px 28px;border-radius:8px;text-decoration:none;transition:all .3s;flex:1;justify-content:center" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Ver propiedades &rarr;</a>
        <button onclick="openHubFiltros()" style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);padding:14px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all .3s;font-family:inherit" onmouseover="this.style.borderColor='var(--gold)';this.style.color='var(--gold)'" onmouseout="this.style.borderColor='rgba(255,255,255,.2)';this.style.color='rgba(255,255,255,.8)'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21V14"/><path d="M4 10V3"/><path d="M12 21V12"/><path d="M12 8V3"/><path d="M20 21V16"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/></svg> Filtros</button>
      </div>
      <div style="margin-bottom:10px">
        <a href="/planes.html" style="font-size:13px;font-weight:600;color:var(--gold);text-decoration:none;letter-spacing:.04em;border-bottom:1px solid rgba(201,169,110,.3);padding-bottom:2px" onmouseover="this.style.opacity='.7'" onmouseout="this.style.opacity='1'">Eres asesor? Publica aqui &rarr;</a>
      </div>
      <div>
        <div style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:14px">Zonas destacadas</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">${zonasHTML}</div>
      </div>
    </div>
  </div>
  <div class="stats-bar" style="position:absolute;bottom:0;left:0;right:0;width:100%;background:rgba(255,255,255,.04);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,.08)">
    <div style="max-width:1200px;margin:0 auto;padding:0 6%;display:flex;flex-wrap:wrap">${statsBar}</div>
  </div>
</section>
<script>
var hubMode='comprar';
function setHubMode(m){
  hubMode=m;
  document.querySelectorAll('.hub-hero-tab').forEach(function(t){t.classList.remove('active')});
  event.target.classList.add('active');
  var cta=document.getElementById('hubHeroCTA');
  if(m==='comprar'){cta.textContent='Ver propiedades \u2192';cta.href='/propiedades.html';}
  else if(m==='alquilar'){cta.textContent='Ver alquileres \u2192';cta.href='/propiedades.html?tipo=Alquiler';}
  else{cta.textContent='Ver inversiones \u2192';cta.href='/propiedades.html?tipo=Inversion';}
}
function openHubFiltros(){document.getElementById('hubFiltrosOverlay').classList.add('active');document.body.style.overflow='hidden';}
function closeHubFiltros(){document.getElementById('hubFiltrosOverlay').classList.remove('active');document.body.style.overflow='';}
function applyHubFiltros(){
  var z=document.getElementById('hfZona').value;
  var t=document.getElementById('hfTipo').value;
  var pmin=document.getElementById('hfPmin').value;
  var pmax=document.getElementById('hfPmax').value;
  var h=document.getElementById('hfHabs').value;
  var params=[];
  if(t)params.push('tipo='+encodeURIComponent(t));
  if(z)params.push('ciudad='+encodeURIComponent(z));
  if(pmin)params.push('pmin='+pmin);
  if(pmax)params.push('pmax='+pmax);
  if(h)params.push('habs='+h);
  window.location.href='/propiedades.html'+(params.length?'?'+params.join('&'):'');
}
</script>
<div class="hub-filtros-overlay" id="hubFiltrosOverlay" onclick="if(event.target===this)closeHubFiltros()">
  <div class="hub-filtros-modal">
    <div class="hfm-header">
      <h3>Filtros avanzados</h3>
      <button class="hfm-close" onclick="closeHubFiltros()">&times;</button>
    </div>
    <div class="hfm-body">
      <div class="hfm-grid">
        <div class="hfm-group"><label>Zona</label><select id="hfZona"><option value="">Todas las zonas</option><option>Zona 10</option><option>Zona 14</option><option>Zona 15</option><option>Zona 16</option><option>Cayala</option><option>Fraijanes</option><option>Mixco</option><option>Villa Canales</option><option>San Jose Pinula</option></select></div>
        <div class="hfm-group"><label>Tipo</label><select id="hfTipo"><option value="">Todos los tipos</option><option>Casa</option><option>Apartamento</option><option>Finca</option><option>Terreno</option><option>Local</option></select></div>
        <div class="hfm-group"><label>Precio minimo</label><input type="number" id="hfPmin" placeholder="Q 0" step="10000"></div>
        <div class="hfm-group"><label>Precio maximo</label><input type="number" id="hfPmax" placeholder="Sin limite" step="10000"></div>
        <div class="hfm-group"><label>Habitaciones</label><select id="hfHabs"><option value="">Cualquiera</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select></div>
      </div>
      <div class="hfm-amenities"><label>Amenidades</label><div class="hfm-pills"><button class="hfm-pill" onclick="this.classList.toggle('selected')">Piscina</button><button class="hfm-pill" onclick="this.classList.toggle('selected')">Jardin</button><button class="hfm-pill" onclick="this.classList.toggle('selected')">Seguridad 24/7</button><button class="hfm-pill" onclick="this.classList.toggle('selected')">Vista</button><button class="hfm-pill" onclick="this.classList.toggle('selected')">Parqueo</button></div></div>
    </div>
    <div class="hfm-footer">
      <button class="hfm-btn-clear" onclick="document.querySelectorAll('.hfm-group select,.hfm-group input').forEach(function(e){e.value=''});document.querySelectorAll('.hfm-pill').forEach(function(p){p.classList.remove('selected')})">Limpiar</button>
      <button class="hfm-btn-apply" onclick="applyHubFiltros()">Aplicar filtros</button>
    </div>
  </div>
</div>

<section style="padding:72px 6%;background:white;border-bottom:1px solid #eef0f3">
  <div style="max-width:1200px;margin:0 auto">
    <div style="text-align:center;margin-bottom:48px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Por que elegirnos</div>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:300;color:#0a1628;margin:0">La diferencia que <em style="font-style:italic">realmente importa</em></h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:32px">
      <div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='#eef0f3';this.style.transform='none'">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#0a1628,#1a2a4e);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>
        <h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Propiedades verificadas</h3>
        <p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Cada propiedad pasa por verificacion rigurosa. Papeleria en orden y precios reales.</p>
      </div>
      <div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='#eef0f3';this.style.transform='none'">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#c9a96e,#e6c06a);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1 1 1 0 0 1-1 1h0a1 1 0 0 1-1-1z"/><path d="M14 14a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1 1 1 0 0 1-1 1h0a1 1 0 0 1-1-1z"/><path d="M8 14a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1 1 1 0 0 1-1 1h0a1 1 0 0 1-1-1z"/><path d="M18 11.5V9a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2"/><path d="M6 11.5V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"/><path d="M3.5 11h.01"/><path d="M20.5 11h.01"/><path d="M6 11.5a6.5 6.5 0 0 0 12 0"/></svg></div>
        <h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Asesoria personalizada</h3>
        <p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Un asesor dedicado desde la busqueda hasta el cierre. Tu inversion, nuestra prioridad.</p>
      </div>
      <div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='#eef0f3';this.style.transform='none'">
        <div style="width:64px;height:64px;background:linear-gradient(135deg,#25d366,#1da851);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
        <h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Respuesta en 1 hora</h3>
        <p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Contestamos por WhatsApp en menos de 60 minutos. Las mejores oportunidades no esperan.</p>
      </div>
    </div>
  </div>
</section>

<section style="padding:80px 6%;background:#f8f9fb">
  <div style="max-width:1200px;margin:0 auto">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;flex-wrap:wrap;gap:16px">
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Seleccion premium</div>
        <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2rem,4vw,3rem);font-weight:300;color:#0a1628;line-height:1.1;margin:0">Propiedades <em style="font-style:italic">destacadas</em></h2>
      </div>
      <a href="/propiedades.html" style="font-size:13px;font-weight:600;color:var(--gold);text-decoration:none;letter-spacing:.04em" onmouseover="this.style.opacity='.7'" onmouseout="this.style.opacity='1'">Ver todas &rarr;</a>
    </div>
    <div class="prop-grid">${featured.map(p=>card(p)).join('')}</div>
  </div>
</section>

${brokers.length > 0 ? `
<section style="padding:80px 6%;background:white;border-bottom:1px solid #eef0f3">
  <div style="max-width:1200px;margin:0 auto">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;flex-wrap:wrap;gap:16px">
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Red de confianza</div>
        <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2rem,4vw,3rem);font-weight:300;color:#0a1628;line-height:1.1;margin:0">Asesores <em style="font-style:italic">destacados</em></h2>
      </div>
      <a href="/asesores.html" style="font-size:13px;font-weight:600;color:var(--gold);text-decoration:none;letter-spacing:.04em" onmouseover="this.style.opacity='.7'" onmouseout="this.style.opacity='1'">Ver todos &rarr;</a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px">
      ${brokers.filter(b=>b.activo!==false&&b.destacado).slice(0,4).map(b=>{
        const initials = (b.nombre||'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
        const zones = (b.zonas||[]).slice(0,3).join(' · ');
        return `<a href="/asesores/${b.slug}.html" style="display:flex;align-items:center;gap:16px;padding:24px;background:#f8f9fb;border:1.5px solid #eef0f3;border-radius:14px;text-decoration:none;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 30px rgba(0,0,0,.06)'" onmouseout="this.style.borderColor='#eef0f3';this.style.transform='none';this.style.boxShadow='none'">
          <div style="flex-shrink:0;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#0a1628,#1a2a4e);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:var(--gold);letter-spacing:.04em;overflow:hidden">${b.foto?`<img src="${b.foto}" style="width:100%;height:100%;object-fit:cover" alt="${b.nombre}"/>`:initials}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px"><span style="font-size:15px;font-weight:700;color:#0a1628">${b.nombre}</span>${b.verificado?'<svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a96e" stroke="white" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>':''}</div>
            <div style="font-size:12px;color:#64748b;margin-bottom:4px">${b.titulo||'Asesor inmobiliario'}</div>
            <div style="font-size:11px;color:#94a3b8">${zones||'Guatemala'}</div>
          </div>
        </a>`;
      }).join('')}
    </div>
  </div>
</section>` : ''}

<section style="padding:80px 6%;background:#0a1628;overflow:hidden">
  <div style="max-width:1200px;margin:0 auto">
    <div style="text-align:center;margin-bottom:48px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Zonas premium</div>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2rem,4vw,3rem);font-weight:300;color:white;line-height:1.1;margin:0">Explora por <em style="font-style:italic">ubicacion</em></h2>
    </div>
    <div class="hub-zones">
      <a href="/zonas/zona-10.html" class="hub-zone-card"><div class="hub-zone-bg" style="background-image:url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=60')"></div><div class="hub-zone-ov"></div><div class="hub-zone-info"><h3>Zona 10</h3><p>Centro financiero y diplomatico. Hoteles, embajadas y alta plusvalia.</p><div class="hub-zone-stats"><span>Desde Q2.5M</span> &bull; Corporativo</div></div></a>
      <a href="/zonas/zona-14.html" class="hub-zone-card"><div class="hub-zone-bg" style="background-image:url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=60')"></div><div class="hub-zone-ov"></div><div class="hub-zone-info"><h3>Zona 14</h3><p>Exclusividad residencial. Clubs privados, colegios premium y tranquilidad.</p><div class="hub-zone-stats"><span>Desde Q3.2M</span> &bull; Residencial</div></div></a>
      <a href="/zonas/zona-15.html" class="hub-zone-card"><div class="hub-zone-bg" style="background-image:url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=60')"></div><div class="hub-zone-ov"></div><div class="hub-zone-info"><h3>Zona 15</h3><p>Modernidad y naturaleza. Desarrollos contemporaneos con amenidades.</p><div class="hub-zone-stats"><span>Desde Q1.8M</span> &bull; Familiar</div></div></a>
      <a href="/zonas/zona-16.html" class="hub-zone-card"><div class="hub-zone-bg" style="background-image:url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=60')"></div><div class="hub-zone-ov"></div><div class="hub-zone-info"><h3>Zona 16</h3><p>Privacidad y terrenos amplios. Baja densidad con vistas panoramicas.</p><div class="hub-zone-stats"><span>Desde Q2.8M</span> &bull; Exclusivo</div></div></a>
      <a href="/zonas/fraijanes.html" class="hub-zone-card"><div class="hub-zone-bg" style="background-image:url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=60')"></div><div class="hub-zone-ov"></div><div class="hub-zone-info"><h3>Fraijanes</h3><p>Mayor crecimiento 2026. Fincas, residencias y alta plusvalia.</p><div class="hub-zone-stats"><span>Desde Q950K</span> &bull; Inversion</div></div></a>
      <a href="/zonas/cayala.html" class="hub-zone-card"><div class="hub-zone-bg" style="background-image:url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=60')"></div><div class="hub-zone-ov"></div><div class="hub-zone-info"><h3>Cayala</h3><p>Ciudad planificada. Arquitectura europea, seguridad y comunidad activa.</p><div class="hub-zone-stats"><span>Desde Q2.2M</span> &bull; Lifestyle</div></div></a>
    </div>
    <div style="text-align:center;margin-top:40px">
      <a href="/propiedades.html" style="display:inline-flex;align-items:center;gap:8px;color:var(--gold);font-size:13px;font-weight:700;letter-spacing:.04em;text-decoration:none;border:1px solid rgba(201,169,110,.3);padding:12px 28px;border-radius:8px;transition:all .3s" onmouseover="this.style.background='rgba(201,169,110,.1)'" onmouseout="this.style.background='none'">Explorar todas las zonas &rarr;</a>
    </div>
  </div>
</section>

<section style="padding:80px 6%;background:var(--gray-50);border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
  <div style="max-width:1200px;margin:0 auto">
    <div style="text-align:center;margin-bottom:48px">
      <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Datos del mercado</div>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2rem,4vw,3rem);font-weight:300;color:#0a1628;line-height:1.1;margin:0">Market <em style="font-style:italic">Insights</em></h2>
    </div>
    <div class="hub-insights-grid">
      <div class="hub-insight-card"><div class="hub-insight-val">+12%</div><div class="hub-insight-label">Plusvalia promedio anual en zonas premium</div></div>
      <div class="hub-insight-card"><div class="hub-insight-val">Q18K</div><div class="hub-insight-label">Precio promedio por metro cuadrado</div></div>
      <div class="hub-insight-card"><div class="hub-insight-val">6.8%</div><div class="hub-insight-label">Cap rate promedio en inversion</div></div>
      <div class="hub-insight-card"><div class="hub-insight-val">&lt;45</div><div class="hub-insight-label">Dias promedio en mercado</div></div>
    </div>
    <div style="margin-top:32px;background:linear-gradient(135deg,#0a1628,#1a2a4e);border-radius:12px;padding:24px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
      <div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:4px">Zona con mayor demanda en 2026</div>
        <div style="font-size:1.3rem;font-weight:300;color:white;font-family:'Cormorant Garamond',Georgia,serif">Fraijanes &mdash; crecimiento sostenido y alta rentabilidad</div>
      </div>
      <a href="/zonas/fraijanes.html" style="font-size:13px;font-weight:700;color:#0a1628;background:var(--gold);padding:10px 24px;border-radius:8px;text-decoration:none;transition:opacity .2s;white-space:nowrap" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Ver propiedades</a>
    </div>
  </div>
</section>

<section style="padding:80px 6%;background:white">
  <div style="max-width:1200px;margin:0 auto;text-align:center">
    <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Recursos profesionales</div>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2rem,4vw,2.8rem);font-weight:300;color:#0a1628;margin-bottom:48px">Herramientas para <em style="font-style:italic">invertir mejor</em></h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px">${herramientas}</div>
  </div>
</section>
<section style="padding:100px 6%;background:linear-gradient(135deg,#0a1628 0%,#0f1e38 50%,#0a1628 100%);position:relative;overflow:hidden">
<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(201,168,76,.07) 0%,transparent 65%);pointer-events:none"></div>
<div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.3),transparent)"></div>
<div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center" class="agent-grid">
<style>.agent-grid{grid-template-columns:1fr 1fr!important}@media(max-width:768px){.agent-grid{grid-template-columns:1fr!important;gap:40px!important}}</style>
<div>
<div style="display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.25);border-radius:100px;padding:6px 16px;margin-bottom:28px">
<span style="width:6px;height:6px;background:#c9a84c;border-radius:50%;display:inline-block;animation:pulse 2s infinite"></span>
<span style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#c9a84c">Para Asesores Inmobiliarios</span>
</div>
<style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}</style>
<h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2.2rem,4vw,3.2rem);font-weight:300;color:white;line-height:1.1;margin-bottom:20px">
Publica tus propiedades.<br>
<em style="font-style:italic;color:#c9a84c">Recibe leads directamente.</em>
</h2>
<p style="font-size:.95rem;color:rgba(255,255,255,.55);line-height:1.9;max-width:460px;margin-bottom:40px;font-weight:300">
InmuHub conecta tus propiedades con compradores activos en Guatemala. Sin comisión por venta, sin intermediarios. Solo tú, tu cliente y WhatsApp.
</p>
<div style="display:flex;flex-direction:column;gap:16px;margin-bottom:44px">
<div style="display:flex;align-items:flex-start;gap:12px"><span style="flex-shrink:0;width:20px;height:20px;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#c9a84c;margin-top:1px">â</span><span style="font-size:.88rem;color:rgba(255,255,255,.6);line-height:1.6">Publica desde 8 propiedades hasta inventario ilimitado</span></div><div style="display:flex;align-items:flex-start;gap:12px"><span style="flex-shrink:0;width:20px;height:20px;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#c9a84c;margin-top:1px">â</span><span style="font-size:.88rem;color:rgba(255,255,255,.6);line-height:1.6">Los leads llegan directo a tu WhatsApp personal</span></div><div style="display:flex;align-items:flex-start;gap:12px"><span style="flex-shrink:0;width:20px;height:20px;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#c9a84c;margin-top:1px">â</span><span style="font-size:.88rem;color:rgba(255,255,255,.6);line-height:1.6">Presencia en zonas premium: Z10, Z14, Z15, Z16, Fraijanes</span></div><div style="display:flex;align-items:flex-start;gap:12px"><span style="flex-shrink:0;width:20px;height:20px;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#c9a84c;margin-top:1px">â</span><span style="font-size:.88rem;color:rgba(255,255,255,.6);line-height:1.6">Sin pago por lead. Sin comisión. Precio fijo mensual</span></div>
</div>
<div style="display:flex;gap:14px;flex-wrap:wrap">
<a href="/planes.html" style="display:inline-flex;align-items:center;gap:8px;background:#c9a84c;color:#0a1628;font-size:14px;font-weight:700;letter-spacing:.04em;padding:15px 32px;border-radius:8px;text-decoration:none;transition:all .3s" onmouseover="this.style.background='#dbb85a'" onmouseout="this.style.background='#c9a84c'">Ver planes y precios &rarr;</a>

</div>
</div>
<div style="position:relative">
<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:40px;backdrop-filter:blur(10px)">
<div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:28px">Nuestros planes</div>
<div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-radius:12px;margin-bottom:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)">
<div>
<div style="font-size:13px;font-weight:700;color:#64748b;letter-spacing:.04em;margin-bottom:4px">Básico</div>
<div style="font-size:11px;color:rgba(255,255,255,.35)">8 propiedades activas Â· Zonas estándar</div>
</div>
<div style="text-align:right">
<div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:1.6rem;font-weight:500;color:white;line-height:1">Q149</div>
<div style="font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.06em">/mes</div>
</div>
</div><div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-radius:12px;margin-bottom:10px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3)">
<div>
<div style="font-size:13px;font-weight:700;color:#c9a84c;letter-spacing:.04em;margin-bottom:4px">Pro</div>
<div style="font-size:11px;color:rgba(255,255,255,.35)">25 propiedades activas Â· Destacado en zonas</div>
</div>
<div style="text-align:right">
<div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:1.6rem;font-weight:500;color:white;line-height:1">Q349</div>
<div style="font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.06em">/mes</div>
</div>
</div><div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-radius:12px;margin-bottom:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)">
<div>
<div style="font-size:13px;font-weight:700;color:#e6c06a;letter-spacing:.04em;margin-bottom:4px">Premium</div>
<div style="font-size:11px;color:rgba(255,255,255,.35)">Inventario ilimitado Â· Zona exclusiva</div>
</div>
<div style="text-align:right">
<div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:1.6rem;font-weight:500;color:white;line-height:1">Q699</div>
<div style="font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.06em">/mes</div>
</div>
</div>
<a href="/planes.html" style="display:block;text-align:center;margin-top:20px;font-size:12px;font-weight:600;color:#c9a84c;text-decoration:none;letter-spacing:.06em" onmouseover="this.style.opacity='.7'" onmouseout="this.style.opacity='1'">VER DETALLES COMPLETOS &rarr;</a>
</div>
</div>
</div>
</section>
`;



  return layout({ 
    title: null, 
    desc: `Plataforma premium de real estate en Guatemala. Calculadora hipotecaria, valuador profesional, guía de compra y análisis de inversionistas. ${props.length} propiedades verificadas.`, 
    canonical: '/', 
    body 
  });
}

module.exports = { indexPageNew };
