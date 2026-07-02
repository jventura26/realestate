const { layout } = require('./layout');
const { card } = require('./card');
const { escapeHtml, uniqueValues } = require('../../shared/utils');
function renderCaracteristicas(chars) {
  if (!chars || !chars.length) return '';
  const grupos = {
    'Ubicacion': ['Ubicacion privilegiada','Sobre carretera','Entorno natural y vistas','Cerca de servicios','Zona residencial','Acceso pavimentado'],
    'Terreno': ['Amplio espacio','Topografia aprovechable','Acceso a servicios','Vista al valle','Terreno plano','Con jardin'],
    'Ideal para': ['Casa de descanso','Proyecto agricola','Desarrollo habitacional','Hotel ecologico','Inversion','Vivienda familiar'],
    'Amenidades': ['Piscina','Jardin','Pergola','Chimenea','Jacuzzi','Churrasquera','Terraza','Estudio','Cuarto de servicio','Bodega'],
    'Inversion': ['Alta plusvalia','Zona en crecimiento','Papeleria en orden','Sin gravamenes','Financiamiento disponible','Negociable'],
  };
  const emojis = {'Ubicacion privilegiada':'📍','Sobre carretera':'🚗','Entorno natural y vistas':'🌄','Cerca de servicios':'🏙️','Zona residencial':'🏘️','Acceso pavimentado':'🛣️','Amplio espacio':'📏','Topografia aprovechable':'🌳','Acceso a servicios':'💧','Vista al valle':'🌅','Terreno plano':'⬜','Con jardin':'🌿','Casa de descanso':'🏡','Proyecto agricola':'🌱','Desarrollo habitacional':'🏘️','Hotel ecologico':'🏢','Inversion':'📈','Vivienda familiar':'👨‍👩‍👧','Piscina':'🏊','Jardin':'🌿','Pergola':'⛺','Chimenea':'🔥','Jacuzzi':'🛁','Churrasquera':'🍖','Terraza':'🌇','Estudio':'💼','Cuarto de servicio':'🛏','Bodega':'📦','Alta plusvalia':'📈','Zona en crecimiento':'🚀','Papeleria en orden':'📄','Sin gravamenes':'✅','Financiamiento disponible':'🏦','Negociable':'🤝'};
  let html = '<div style="margin-top:32px"><div style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--gold);margin-bottom:16px">Caracteristicas</div>';
  Object.entries(grupos).forEach(([grupo, items]) => {
    const activos = items.filter(i => chars.includes(i));
    if (!activos.length) return;
    html += '<div style="margin-bottom:16px"><div style="font-size:.65rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:8px">' + grupo + '</div><div style="display:flex;flex-wrap:wrap;gap:8px">';
    activos.forEach(item => { html += '<span style="display:inline-flex;align-items:center;gap:5px;padding:5px 12px;background:#f8f9fb;border:1.5px solid #e2e8f0;border-radius:20px;font-size:.78rem;color:#1a2a4e;font-weight:500">' + (emojis[item]||'') + ' ' + item + '</span>'; });
    html += '</div></div>';
  });
  return html + '</div>';
}

function renderDesc(desc) {
  if (!desc) return '';
  const label = '<h2 style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--gold);margin-bottom:16px">Descripcion</h2>';
  if (desc.trim().startsWith('{') || desc.includes('"nodes"')) {
    try {
      const texts = []; let m; const re = /"text":"([^"]+)"/g;
      while ((m = re.exec(desc)) !== null) { const t = m[1].trim(); if (t && t.length > 1) texts.push(t); }
      const clean = texts.join(' ');
      return clean ? '<div class="description">' + label + '<p>' + escapeHtml(clean) + '</p></div>' : '';
    } catch(e) { return ''; }
  }
  const lines = desc.split('\n').map(l => l.trim()).filter(l => l);
  if (!lines.length) return '';
  const html = lines.map(l => '<p style="font-size:.84rem;line-height:1.7;margin-bottom:8px;color:#374151">' + escapeHtml(l) + '</p>').join('');
  return '<div class="description">' + label + html + '</div>';
}


function indexPage(props) {
const featured = props.slice(0, 9);
const zonas = [...new Set(props.map(p=>p.municipio).filter(Boolean))].slice(0,6);
const zonasHTML = zonas.map(z => {
  const slug = z.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const count = props.filter(p=>p.municipio===z).length;
  return `<a href="/zonas/${slug}.html" style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);border:1px solid rgba(201,169,110,.25);border-radius:100px;padding:8px 18px;font-size:13px;font-weight:500;color:rgba(255,255,255,.8);transition:all .3s;text-decoration:none" onmouseover="this.style.background='rgba(201,169,110,.15)';this.style.borderColor='var(--gold)';this.style.color='var(--gold)'" onmouseout="this.style.background='rgba(255,255,255,.08)';this.style.borderColor='rgba(201,169,110,.25)';this.style.color='rgba(255,255,255,.8)'">\u{1F4CD} ${z} <span style="opacity:.6;font-size:11px">(${count})</span></a>`;
}).join('');

const statsBar = [
  [props.length+'+','Propiedades'],
  ['10+','Anos mercado'],
  ['6','Zonas premium'],
  ['100%','Asesoria personal'],
].map(([n,l])=>`<div style="flex:1;min-width:140px;padding:20px 0;border-right:1px solid rgba(255,255,255,.08);text-align:center"><div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:2rem;font-weight:500;color:var(--gold);line-height:1;margin-bottom:4px">${n}</div><div style="font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4)">${l}</div></div>`).join('');

const herramientas = [
  ['🏠','Valuador','/herramientas/valuador.html','Calcula el valor estimado de cualquier propiedad'],
  ['🧮','Calculadora','/herramientas/calculadora-hipotecaria.html','Simula tu cuota hipotecaria mensual'],
  ['📈','Simulador','/herramientas/simulador-inversion.html','Analiza ROI y rentabilidad antes de invertir'],
  ['📚','Guia de Compra','/herramientas/guia-compra.html','Guia premium para comprar sin errores'],
].map(([ic,nm,hr,ds])=>`<a href="${hr}" style="display:flex;flex-direction:column;align-items:flex-start;padding:28px;background:#f8f9fb;border:1.5px solid #eef0f3;border-radius:12px;text-decoration:none;text-align:left;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.background='white';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 40px rgba(0,0,0,.08)'" onmouseout="this.style.borderColor='#eef0f3';this.style.background='#f8f9fb';this.style.transform='none';this.style.boxShadow='none'"><div style="font-size:2rem;margin-bottom:16px">${ic}</div><div style="font-size:15px;font-weight:700;color:#0a1628;margin-bottom:8px">${nm}</div><div style="font-size:13px;color:#64748b;line-height:1.6;flex:1">${ds}</div><div style="margin-top:16px;font-size:12px;font-weight:700;color:var(--gold);letter-spacing:.04em">Ir a herramienta &rarr;</div></a>`).join('');

const body = `
<section style="min-height:92vh;position:relative;display:flex;align-items:center;background:#0a1628;overflow:hidden">
  <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=60') center/cover no-repeat;opacity:.18"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,22,40,.98) 0%,rgba(10,22,40,.75) 60%,rgba(15,27,46,.9) 100%)"></div>
  <div style="position:absolute;top:-200px;right:-100px;width:700px;height:700px;background:radial-gradient(circle,rgba(201,169,110,.08) 0%,transparent 70%);pointer-events:none"></div>
  <div style="position:relative;z-index:2;width:100%;max-width:1200px;margin:0 auto;padding:100px 6% 100px">
    <div style="max-width:700px">
      <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(201,169,110,.12);border:1px solid rgba(201,169,110,.3);border-radius:100px;padding:6px 16px;margin-bottom:28px">
        <span style="width:6px;height:6px;background:var(--gold);border-radius:50%;display:inline-block"></span>
        <span style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)">Portal Premium Guatemala</span>
      </div>
      <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(3rem,6vw,5rem);font-weight:300;line-height:1.05;color:white;margin-bottom:24px">
        Encuentra la propiedad<br>
        <em style="font-style:italic;color:var(--gold)">que cambiara tu vida</em>
      </h1>
      <p style="font-size:1rem;color:rgba(255,255,255,.6);line-height:1.8;max-width:520px;margin-bottom:44px;font-weight:300">
        ${props.length} propiedades verificadas en Guatemala. Casas, apartamentos, fincas e inversiones en las zonas mas exclusivas.
      </p>
      <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:60px">
        <a href="/propiedades.html" style="display:inline-flex;align-items:center;gap:8px;background:var(--gold);color:#0a1628;font-size:14px;font-weight:700;letter-spacing:.04em;padding:14px 28px;border-radius:8px;text-decoration:none;transition:all .3s" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">Ver propiedades &rarr;</a>
        <a href="/propiedades.html" style="display:inline-block;background:#1a2a4e;color:white;padding:12px 32px;border-radius:6px;font-weight:600;text-decoration:none">Ver propiedades →</a>
      </div>
      <div>
        <div style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:14px">Zonas destacadas</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">${zonasHTML}</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(255,255,255,.04);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,.08)">
    <div style="max-width:1200px;margin:0 auto;padding:0 6%;display:flex;flex-wrap:wrap">${statsBar}</div>
  </div>
</section>

<section style="padding:72px 6%;background:white;border-bottom:1px solid #eef0f3"><div style="max-width:1200px;margin:0 auto"><div style="text-align:center;margin-bottom:48px"><div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Por que elegirnos</div><h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:300;color:#0a1628;margin:0">La diferencia que <em style="font-style:italic">realmente importa</em></h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:32px"><div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='#eef0f3';this.style.transform='none'"><div style="width:64px;height:64px;background:linear-gradient(135deg,#0a1628,#1a2a4e);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem">✅</div><h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Propiedades verificadas</h3><p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Cada propiedad pasa por verificacion rigurosa. Papeleria en orden y precios reales.</p></div><div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='#eef0f3';this.style.transform='none'"><div style="width:64px;height:64px;background:linear-gradient(135deg,#c9a96e,#e6c06a);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem">🤝</div><h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Asesoria personalizada</h3><p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Un asesor dedicado desde la busqueda hasta el cierre. Tu inversion, nuestra prioridad.</p></div><div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='#eef0f3';this.style.transform='none'"><div style="width:64px;height:64px;background:linear-gradient(135deg,#25d366,#1da851);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem">⚡</div><h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Respuesta en 1 hora</h3><p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Contestamos por WhatsApp en menos de 60 minutos. Las mejores oportunidades no esperan.</p></div></div></div></section>
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

<section style="padding:80px 6%;background:white">
  <div style="max-width:1200px;margin:0 auto;text-align:center">
    <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Recursos profesionales</div>
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2rem,4vw,2.8rem);font-weight:300;color:#0a1628;margin-bottom:48px">Herramientas para <em style="font-style:italic">invertir mejor</em></h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px">${herramientas}</div>
  </div>
</section>`;

return layout({ title: null, desc: `Casas, apartamentos, fincas y terrenos en Guatemala. ${props.length} propiedades en Zona 10, Zona 14, Cayala, Fraijanes y mas.`, canonical: '/', body });
}



function catalogPage(props) {
const tipos = uniqueValues(props, 'tipo');
const ciudades = uniqueValues(props, 'municipio');
const cintas = uniqueValues(props, 'cinta');
const filterJS = `<script>(function(){const grid=document.getElementById('g'),count=document.getElementById('fc');const cards=[...grid.querySelectorAll('.property-card')];function run(){const q=document.getElementById('fq').value.toLowerCase();const ti=document.getElementById('ft').value,ci=document.getElementById('fc2').value,ci2=document.getElementById('fc3').value,pr=document.getElementById('fp').value,hb=document.getElementById('fh').value;let n=0;cards.forEach(c=>{const ok=(!q||c.textContent.toLowerCase().includes(q))&&(!ti||c.dataset.tipo===ti)&&(!ci||c.dataset.ciudad===ci)&&(!ci2||c.dataset.cinta===ci2)&&(!hb||parseInt(c.dataset.habs)>=parseInt(hb))&&(!pr||(()=>{const p=parseFloat(c.dataset.precio),parts=pr.split('-').map(Number);return p>=parts[0]&&(!parts[1]||p<=parts[1]);})());c.style.display=ok?'':'none';if(ok)n++;});count.textContent=n+' propiedad'+(n!==1?'es':'');document.getElementById('nr').style.display=n===0?'block':'none';}['fq','ft','fc2','fc3','fp','fh'].forEach(id=>document.getElementById(id).addEventListener('input',run));document.getElementById('fq').addEventListener('change',run);document.getElementById('cl').addEventListener('click',()=>{['fq','ft','fc2','fc3','fp','fh'].forEach(id=>document.getElementById(id).value='');run();});const p=new URLSearchParams(location.search);if(p.get('tipo'))document.getElementById('ft').value=p.get('tipo');if(p.get('ciudad'))document.getElementById('fc2').value=p.get('ciudad');run();count.textContent='${props.length} propiedades';})();<\/script>`;
const tiposOptions=tipos.map(t=>`<option>${escapeHtml(t)}</option>`).join('');
const ciudadesOptions=ciudades.map(c=>`<option>${escapeHtml(c)}</option>`).join('');
const cintasOptions=cintas.map(c=>`<option>${escapeHtml(c)}</option>`).join('');
const body = `
<div style="background:var(--gray-50);padding:16px 6%;border-bottom:1px solid var(--border)">
<h1 style="font-size:32px;font-weight:700;color:var(--gray-900);margin:0">Catalogo de propiedades</h1>
</div>
<div class="filter-bar">
<input id="fq" type="text" placeholder="Buscar por nombre, zona...">
<select id="ft"><option value="">Tipo</option>${tiposOptions}</select>
<select id="fc2"><option value="">Municipio</option>${ciudadesOptions}</select>
<select id="fc3"><option value="">Estado</option>${cintasOptions}</select>
<select id="fp"><option value="">Precio</option><option value="0-100000">Hasta $100K</option><option value="100000-300000">$100K-$300K</option><option value="300000-600000">$300K-$600K</option><option value="600000-1000000">$600K-$1M</option><option value="1000000-9999999">Mas de $1M</option></select>
<select id="fh"><option value="">Habitaciones</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select>
<button id="cl">Limpiar filtros</button>
<span class="f-count" id="fc">${props.length} propiedades</span>
</div>
<div class="prop-grid" id="g">${props.map(p=>card(p)).join('')}</div>
<div class="no-res" id="nr" style="display:none"><p>No se encontraron propiedades</p><small>Intenta ajustar los filtros</small></div>
${filterJS}`;
return layout({ title: 'Propiedades en Guatemala', desc: 'Catalogo completo de casas, apartamentos, fincas y terrenos en Guatemala. Filtra por zona, tipo y precio. INMUHUB.COM', canonical: '/propiedades.html', body });
}

function zonaPage(props, zona) {
const tipos = uniqueValues(props, 'tipo');
const slug = zona.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const body = `
<div style="background:var(--gray-900);padding:48px 6%;color:var(--white)">
<div style="font-size:12px;color:rgba(255,255,255,.5);margin-bottom:12px"><a href="/" style="color:rgba(255,255,255,.5)">Inicio</a> / <a href="/propiedades.html" style="color:rgba(255,255,255,.5)">Propiedades</a> / ${escapeHtml(zona)}</div>
<h1 style="font-size:clamp(28px,4vw,42px);font-weight:800;margin-bottom:12px">Propiedades en <span style="color:var(--gold)">${escapeHtml(zona)}</span></h1>
<p style="color:rgba(255,255,255,.65);font-size:16px">${props.length} propiedad${props.length!==1?'es':''} disponible${props.length!==1?'s':''} en ${escapeHtml(zona)}, Guatemala</p>
<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:20px">
${tipos.map(t=>`<span style="background:rgba(201,169,110,.15);color:var(--gold);border:1px solid rgba(201,169,110,.3);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600">${escapeHtml(t)}</span>`).join('')}
</div>
</div>
<div class="prop-grid" style="padding:32px 6%">${props.map(p=>card(p)).join('')}</div>
<div style="padding:40px 6%;background:var(--gray-50);text-align:center;border-top:1px solid var(--border)">
<p style="color:var(--gray-600);margin-bottom:16px">Ver todas las propiedades disponibles en Guatemala</p>
<a href="/propiedades.html" style="background:var(--blue);color:var(--white);padding:10px 28px;border-radius:6px;font-weight:600;display:inline-block">Ver catalogo completo</a>
</div>`;
return layout({
  title: `Propiedades en ${zona}, Guatemala`,
  desc: `${props.length} propiedades en ${zona} Guatemala. Casas, apartamentos y mas en venta y renta. Precios verificados en INMUHUB.COM`,
  canonical: `/zonas/${slug}.html`,
  body
});
}

function detailPage(prop) {
const gallery=(prop.gallery||[]).slice(0,10);
const mainImg=escapeHtml(prop.mainImageThumb||prop.mainImage||'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=75');

// Gallery thumbnails (shown inside hero strip)
const thumbsHTML=gallery.length>1?`<div class="dv3-gal">
  ${gallery.map((img,i)=>`<button class="dv3-gal-thumb${i===0?' on':''}" onclick="(function(b){document.getElementById('dv3MainImg').src='${escapeHtml(img)}';document.querySelectorAll('.dv3-gal-thumb').forEach(x=>x.classList.remove('on'));b.classList.add('on')})(this)" title="Foto ${i+1}"><img src="${escapeHtml(img)}" alt="foto ${i+1}" loading="lazy"></button>`).join('')}
</div>`:'';

// Quick specs
const qsItems=[];
if(prop.habitaciones&&prop.habitaciones!=='0')qsItems.push(`<div class="dv3-qs-item">🛏 ${prop.habitaciones} hab.</div>`);
if(prop.banos&&prop.banos!=='0')qsItems.push(`<div class="dv3-qs-item">🚿 ${prop.banos}${prop.mediosBanos&&prop.mediosBanos!=='0'?'+½':''} baños</div>`);
if(prop.parqueos&&prop.parqueos!=='0')qsItems.push(`<div class="dv3-qs-item">🚗 ${prop.parqueos} parqueo${prop.parqueos!=='1'?'s':''}</div>`);
if(prop.areaConst&&prop.areaConst!=='0'&&prop.areaConst!=='')qsItems.push(`<div class="dv3-qs-item">📐 ${prop.areaConst} m²</div>`);
if(prop.area&&prop.area!==''&&prop.area!==prop.areaConst)qsItems.push(`<div class="dv3-qs-item">🌳 ${prop.area} m² terreno</div>`);
if(prop.niveles&&prop.niveles!=='0')qsItems.push(`<div class="dv3-qs-item">🏠 ${prop.niveles} nivel${prop.niveles!=='1'?'es':''}</div>`);
const qsHTML=qsItems.length?`<div class="dv3-qs">${qsItems.join('')}</div>`:'';

// Tab: Detalles
const detallesHTML=(()=>{
  const items=[];
  if(prop.tipoConstruccion)items.push(['Construcción',prop.tipoConstruccion]);
  if(prop.estadoConstruccion)items.push(['Estado',prop.estadoConstruccion]);
  if(prop.anioConstruccion&&prop.anioConstruccion!=='0')items.push(['Año',prop.anioConstruccion]);
  if(prop.acabados)items.push(['Acabados',prop.acabados]);
  if(prop.techo)items.push(['Techo',prop.techo]);
  if(prop.piso)items.push(['Piso',prop.piso]);
  if(prop.orientacion)items.push(['Orientación',prop.orientacion]);
  if(prop.cuotaMant)items.push(['Cuota mant.',prop.cuotaMant]);
  if(prop.disponibleDesde)items.push(['Disponible',prop.disponibleDesde]);
  if(prop.tipo)items.push(['Tipo propiedad',prop.tipo]);
  if(prop.operacion)items.push(['Operación',prop.operacion]);
  if(prop.moneda)items.push(['Moneda',prop.moneda]);
  if(prop.municipio)items.push(['Municipio',prop.municipio]);
  if(prop.datosTecnicos)items.push(['Detalles',prop.datosTecnicos]);
  if(!items.length)return'<p style="color:var(--text-muted);font-size:14px">Sin datos técnicos disponibles.</p>';
  return`<div class="dv3-specs-grid">${items.map(([l,v])=>`<div class="dv3-spec"><span class="dv3-spec-l">${escapeHtml(l)}</span><span class="dv3-spec-v">${escapeHtml(String(v))}</span></div>`).join('')}</div>`;
})();

// Tab: Descripción
const descTabHTML=(()=>{
  if(!prop.description)return'<p style="color:var(--text-muted)">Sin descripción disponible.</p>';
  const clean=prop.description.replace(/[\u{1F000}-\u{1FBFF}\u{2600}-\u{27BF}\u{1F300}-\u{1F9FF}\u{2702}-\u{27B0}\u{25B0}-\u{25FF}]+/gu,' ').replace(/\n{3,}/g,'\n\n').trim();
  const paras=clean.split(/\n\n+/).map(p=>p.replace(/\n/g,' ').replace(/\s+/g,' ').trim()).filter(p=>p.length>8);
  if(!paras.length)return'';
  const preview=paras.slice(0,2).map(p=>`<p class="dv3-desc-p">${escapeHtml(p)}</p>`).join('');
  const more=paras.slice(2);
  const moreId='dm-'+prop.slug.replace(/[^a-z0-9]/g,'');
  const moreBlock=more.length?`<div id="${moreId}" style="display:none">${more.map(p=>`<p class="dv3-desc-p">${escapeHtml(p)}</p>`).join('')}</div><button class="dv3-desc-toggle" onclick="var el=document.getElementById('${moreId}'),open=el.style.display!=='none';el.style.display=open?'none':'block';this.textContent=open?'Ver más ↓':'Mostrar menos ↑'">Ver más ↓</button>`:'';
  return preview+moreBlock;
})();

// Tab: Características
const caracTabHTML=(()=>{
  const c=prop.caracteristicas;
  if(!c||!Array.isArray(c)||!c.length)return'<p style="color:var(--text-muted)">Sin características registradas.</p>';
  const half=Math.ceil(c.length/2);
  const item=x=>`<li class="dv3-carac-item"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,7 5.5,10.5 12,4"/></svg>${escapeHtml(x)}</li>`;
  return`<div class="dv3-carac-grid"><ul>${c.slice(0,half).map(item).join('')}</ul><ul>${c.slice(half).map(item).join('')}</ul></div>`;
})();

// Tab: Ubicación
const ubicTabHTML=(()=>{
  const parts=[];
  if(prop.lat&&prop.lng&&prop.lat!=='0'&&prop.lng!=='0'){
    const lat=parseFloat(prop.lat),lng=parseFloat(prop.lng);
    if(!isNaN(lat)&&!isNaN(lng))parts.push(`<div class="dv3-map"><iframe src="https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=es" width="100%" height="320" frameborder="0" loading="lazy"></iframe></div>`);
  }
  if(prop.videoTour){
    let src=prop.videoTour;
    const m=src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if(m)src='https://www.youtube.com/embed/'+m[1];
    parts.push(`<div class="dv3-video-wrap" style="margin-top:24px"><h3 style="font-size:15px;font-weight:700;margin:0 0 12px">Video Tour</h3><div style="position:relative;padding-bottom:56.25%;border-radius:10px;overflow:hidden"><iframe src="${escapeHtml(src)}" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allow="accelerometer;autoplay;encrypted-media;picture-in-picture" allowfullscreen loading="lazy"></iframe></div></div>`);
  }
  if(!parts.length)return'<p style="color:var(--text-muted)">Ubicación no disponible.</p>';
  return parts.join('');
})();

// Sidebar
const propUrl='https://inmuhub.com/propiedades/'+prop.slug+'.html';
const shareText=encodeURIComponent('Mira esta propiedad: '+prop.title+' '+propUrl);
const sideHTML=`
  <div class="dv3-side-card wa-card">
    ${prop.esExclusiva?'<div class="dv3-excl">★ Propiedad Exclusiva</div>':''}
    <div class="dv3-avail"><span class="dv3-live"></span>Disponible</div>
    <a href="https://wa.me/?text=${shareText}" target="_blank" rel="noopener" class="dv3-wa-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
      Compartir propiedad
    </a>
  </div>
  ${prop.codigo?'<div class="dv3-side-ref"><span class="dv3-ref-l">Código de referencia</span><span class="dv3-ref-v">'+escapeHtml(prop.codigo)+'</span></div>':''}
  ${prop.plano?'<div class="dv3-more-links"><a href="'+escapeHtml(prop.plano)+'" target="_blank" rel="noopener" class="dv3-more-link">Ver plano →</a></div>':''}
`;

const tabsJS=`<script>(function(){var tabs=document.querySelectorAll('.dv3-tab'),panels=document.querySelectorAll('.dv3-tab-panel');tabs.forEach(function(t,i){t.addEventListener('click',function(){tabs.forEach(function(x){x.classList.remove('on')});panels.forEach(function(x){x.style.display='none'});t.classList.add('on');panels[i].style.display='block'});});})();<\/script>`;

const body=`<style>
.dv3-hero{position:relative;background:#000;overflow:hidden}
.dv3-hero-img{width:100%;max-height:580px;object-fit:cover;display:block;opacity:.92}
.dv3-hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.72) 0%,rgba(0,0,0,.25) 45%,transparent 100%)}
.dv3-hero-content{position:absolute;bottom:0;left:0;right:0;padding:28px 32px;color:#fff}
.dv3-bread{font-size:12px;color:rgba(255,255,255,.6);margin-bottom:10px}
.dv3-bread a{color:rgba(255,255,255,.6)}
.dv3-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.18);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.25);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:10px}
.dv3-title{font-size:clamp(20px,3.5vw,34px);font-weight:800;color:#fff;margin:0 0 8px;line-height:1.15;text-shadow:0 2px 8px rgba(0,0,0,.4)}
.dv3-loc{display:flex;align-items:center;gap:6px;font-size:14px;color:rgba(255,255,255,.85);margin-bottom:16px}
.dv3-gal{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}
.dv3-gal-thumb{flex:0 0 64px;height:44px;border:2px solid rgba(255,255,255,.3);border-radius:6px;overflow:hidden;cursor:pointer;background:none;padding:0;transition:border-color .2s}
.dv3-gal-thumb.on{border-color:#fff}
.dv3-gal-thumb img{width:100%;height:100%;object-fit:cover}
.dv3-wrap{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1fr 320px;gap:36px;padding:28px 24px 60px;align-items:start}
.dv3-main{}
.dv3-price-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border)}
.dv3-price{font-size:32px;font-weight:800;color:var(--blue);line-height:1}
.dv3-price-sub{font-size:13px;color:var(--text-muted);margin-top:4px}
.dv3-share-btn{display:flex;align-items:center;gap:6px;background:var(--gray-50);border:1px solid var(--border);color:var(--gray-700);padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:border-color .2s;text-decoration:none}
.dv3-share-btn:hover{border-color:var(--blue);color:var(--blue)}
.dv3-qs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--border)}
.dv3-qs-item{background:var(--gray-50);border:1px solid var(--border);border-radius:8px;padding:8px 14px;font-size:13px;font-weight:600;color:var(--gray-800)}
.dv3-tabs{display:flex;gap:0;border-bottom:2px solid var(--border);margin-bottom:24px;overflow-x:auto}
.dv3-tab{padding:10px 18px;font-size:13px;font-weight:600;color:var(--text-muted);background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-2px;cursor:pointer;white-space:nowrap;transition:color .15s,border-color .15s}
.dv3-tab:hover{color:var(--gray-900)}
.dv3-tab.on{color:var(--blue);border-bottom-color:var(--blue)}
.dv3-tab-panel{}
.dv3-specs-grid{display:grid;grid-template-columns:1fr 1fr;gap:0}
.dv3-spec{padding:12px 0;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:3px}
.dv3-spec-l{font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px}
.dv3-spec-v{font-size:14px;font-weight:600;color:var(--gray-900)}
.dv3-desc-p{margin:0 0 14px;color:var(--gray-700);line-height:1.78;font-size:15px}
.dv3-desc-toggle{background:none;border:none;color:var(--blue);font-weight:600;font-size:14px;cursor:pointer;padding:0;margin-top:-4px}
.dv3-carac-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 20px}
.dv3-carac-grid ul{list-style:none;margin:0;padding:0}
.dv3-carac-item{display:flex;align-items:center;gap:8px;padding:7px 0;font-size:13px;color:var(--gray-700);border-bottom:1px solid var(--gray-100)}
.dv3-map{border-radius:10px;overflow:hidden;border:1px solid var(--border)}
.dv3-map iframe{display:block}
.dv3-side{position:sticky;top:72px}
.dv3-side-card{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:22px;margin-bottom:16px;box-shadow:0 2px 16px rgba(0,0,0,.07)}
.dv3-excl{background:linear-gradient(135deg,#c9a96e,#a07840);color:#fff;padding:5px 12px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.5px;text-align:center;margin-bottom:14px}
.dv3-avail{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:var(--gray-700);margin-bottom:16px}
.dv3-live{width:8px;height:8px;border-radius:50%;background:#22c55e;flex-shrink:0;box-shadow:0 0 0 3px rgba(34,197,94,.2)}
.dv3-wa-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:#25D366;color:#fff;padding:13px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;transition:opacity .2s}
.dv3-wa-btn:hover{opacity:.88}
.dv3-side-ref{background:var(--gray-50);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:12px;display:flex;flex-direction:column;gap:4px}
.dv3-ref-l{font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px}
.dv3-ref-v{font-size:14px;font-weight:700;color:var(--gray-900)}
.dv3-more-links{display:flex;flex-direction:column;gap:8px}
.dv3-more-link{display:flex;align-items:center;justify-content:center;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-weight:600;color:var(--gray-700);text-decoration:none;transition:border-color .2s,color .2s}
.dv3-more-link:hover{border-color:var(--blue);color:var(--blue)}
@media(max-width:768px){.dv3-wrap{grid-template-columns:1fr}.dv3-side{position:static}.dv3-hero-img{max-height:280px}.dv3-hero-content{padding:16px 18px}.dv3-title{font-size:20px}.dv3-specs-grid{grid-template-columns:1fr 1fr}.dv3-carac-grid{grid-template-columns:1fr}.dv3-price{font-size:26px}}
</style>
<div class="dv3-hero">
  <img class="dv3-hero-img" id="dv3MainImg" src="${mainImg}" alt="${escapeHtml(prop.title)} - INMUHUB.COM" loading="eager">
  <div class="dv3-hero-overlay"></div>
  <div class="dv3-hero-content">
    <div class="dv3-bread"><a href="/">Inicio</a> / <a href="/propiedades.html">Propiedades</a> / ${escapeHtml(prop.title)}</div>
    <div class="dv3-badge">${escapeHtml(prop.tipo||'Propiedad')} &middot; ${escapeHtml(prop.operacion||'Venta')}</div>
    <h1 class="dv3-title">${escapeHtml(prop.title)}</h1>
    <div class="dv3-loc"><svg width="13" height="15" viewBox="0 0 12 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 1a4 4 0 0 1 4 4c0 3-4 8-4 8S2 8 2 5a4 4 0 0 1 4-4z"/><circle cx="6" cy="5" r="1.3"/></svg>${escapeHtml(prop.ubicacionGeneral||prop.locationFull)}</div>
    ${thumbsHTML}
  </div>
</div>
<div class="dv3-wrap">
  <div class="dv3-main">
    <div class="dv3-price-row">
      <div>
        <div class="dv3-price">${escapeHtml(prop.priceFormatted)}</div>
        ${prop.moneda||prop.precioRenta?'<div class="dv3-price-sub">'+(prop.moneda?escapeHtml(prop.moneda):'')+(prop.precioRenta?' &middot; Renta: '+escapeHtml(prop.precioRenta):'')+'</div>':''}
      </div>
      <a href="https://wa.me/?text=${encodeURIComponent('Mira esta propiedad: '+prop.title+' https://inmuhub.com/propiedades/'+prop.slug+'.html')}" target="_blank" rel="noopener" class="dv3-share-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        Compartir
      </a>
    </div>
    ${qsHTML}
    <div class="dv3-tabs">
      <button class="dv3-tab on">Detalles</button>
      <button class="dv3-tab">Descripción</button>
      <button class="dv3-tab">Características</button>
      <button class="dv3-tab">Ubicación</button>
    </div>
    <div class="dv3-tab-panel">${detallesHTML}</div>
    <div class="dv3-tab-panel" style="display:none">${descTabHTML}</div>
    <div class="dv3-tab-panel" style="display:none">${caracTabHTML}</div>
    <div class="dv3-tab-panel" style="display:none">${ubicTabHTML}</div>
    ${tabsJS}
  </div>
  <aside class="dv3-side">${sideHTML}</aside>
</div>`;

const schema={"@context":"https://schema.org","@type":"RealEstateListing","name":prop.title,"description":prop.description||(prop.title+' en '+prop.locationFull),"url":'https://inmuhub.com/propiedades/'+prop.slug+'.html',"image":prop.mainImageThumb||'',"price":prop.priceFormatted||'',"address":{"@type":"PostalAddress","addressLocality":prop.municipio||'Guatemala',"addressRegion":prop.departamento||'Guatemala',"addressCountry":"GT"}};
if(prop.habitaciones&&prop.habitaciones!=='0')schema.numberOfRooms=parseInt(prop.habitaciones);
if(prop.areaConst)schema.floorSize={"@type":"QuantitativeValue","value":parseFloat(prop.areaConst),"unitCode":"MTK"};
const breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://inmuhub.com/"},{"@type":"ListItem","position":2,"name":"Propiedades","item":"https://inmuhub.com/propiedades.html"},{"@type":"ListItem","position":3,"name":prop.title,"item":'https://inmuhub.com/propiedades/'+prop.slug+'.html'}]};
const jsonLd='<script type="application/ld+json">'+JSON.stringify(schema)+'<\/script>\n<script type="application/ld+json">'+JSON.stringify(breadcrumb)+'<\/script>';
return layout({title:prop.title,desc:prop.title+' - '+(prop.ubicacionGeneral||prop.locationFull)+'. '+prop.priceFormatted,canonical:'/propiedades/'+prop.slug+'.html',ogImage:prop.mainImageThumb,scripts:jsonLd,body});
}

function mortgageCalcPage(props) {
  const body = mortgageCalculator();
  return layout({
    title: 'Calculadora Hipotecaria',
    desc: 'Calcula tu cuota hipotecaria mensual para propiedades en Guatemala',
    canonical: '/herramientas/calculadora-hipotecaria.html',
    body
  });
}

// Página: Simulador de Inversión
function investmentSimulatorPage(props) {
  const body = investmentSimulator();
  return layout({
    title: 'Simulador de Inversión',
    desc: 'Analiza el ROI de invertir en propiedades guatemaltecas',
    canonical: '/herramientas/simulador-inversion.html',
    body
  });
}

// Página: Guía de Compra
function guiaCompraPage(props) {
  const body = leadsMagnet();
  return layout({
    title: 'Guía Completa de Compra',
    desc: 'Descarga la guía premium para invertir en real estate sin errores',
    canonical: '/herramientas/guia-compra.html',
    body
  });
}

module.exports = { indexPage, catalogPage, zonaPage, detailPage, mortgageCalcPage, investmentSimulatorPage, guiaCompraPage };

// Función helper para generar calculadora inline
function generateCalculator(prop) {
  const price = parseFloat(prop.priceNumeric || 0);
  const down = Math.round(price * 0.2);
  return `<section style="padding:48px 6%;background:#f9fafb;border-top:1px solid #e5e7eb"><div style="max-width:1200px;margin:0 auto"><h3 style="font-size:28px;font-weight:700;color:#1a2a4e;margin-bottom:40px;text-align:center">Calculadora Hipotecaria</h3><div style="background:white;border-radius:16px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08)"><div style="margin-bottom:32px;padding:24px;background:#e3f2fd;border-radius:12px"><p style="font-size:14px;color:#1a2a4e;font-weight:600;margin:0">Precio de esta propiedad:</p><p style="font-size:32px;font-weight:700;color:#1a2a4e;margin:8px 0 0 0">Q ${price.toLocaleString('es-GT')}</p></div><div style="margin-bottom:32px;padding:24px;background:#fff3e0;border-radius:12px"><label style="font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Cuota Inicial (20%): Q <span id="downPaymentDisplay">${down.toLocaleString('es-GT')}</span></label><input type="number" id="downPayment" value="${down}" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box"></div><div style="margin-bottom:32px"><label style="font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Plazo: <span id="termDisplay">20</span> años</label><input type="range" id="term" min="5" max="30" value="20" style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;cursor:pointer"></div><div style="margin-bottom:40px"><label style="font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Tasa: <span id="rateDisplay">7.5</span>%</label><input type="range" id="rate" min="3" max="12" step="0.1" value="7.5" style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;cursor:pointer"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:40px"><div style="background:linear-gradient(135deg,#ffa500 0%,#ff8c00 100%);border-radius:12px;padding:32px;color:white"><p style="font-size:12px;opacity:0.9;margin-bottom:8px">Cuota Inicial</p><p style="font-size:32px;font-weight:700;margin:0" id="summaryDown">Q ${down.toLocaleString('es-GT')}</p><p style="font-size:12px;opacity:0.8;margin-top:12px;border-top:1px solid rgba(255,255,255,0.2);padding-top:12px;margin-bottom:0">Monto a Financiar: <strong id="loanAmount">Q ${Math.round(price*0.8).toLocaleString('es-GT')}</strong></p></div><div style="background:linear-gradient(135deg,#1a2a4e 0%,#2d4069 100%);border-radius:12px;padding:32px;color:white"><p style="font-size:12px;opacity:0.8;margin-bottom:8px">Cuota Mensual</p><p style="font-size:32px;font-weight:700;color:#ffa500;margin:0" id="monthlyPayment">Q 0</p><p style="font-size:12px;opacity:0.8;margin-top:12px;border-top:1px solid rgba(255,255,255,0.2);padding-top:12px;margin-bottom:0">Total a Pagar: <strong id="totalPayment">Q 0</strong></p></div></div><div style="text-align:center"><a href="https://wa.me/502XXXXXXXX" target="_blank" style="display:inline-block;background:#1a2a4e;color:white;padding:16px 48px;border-radius:8px;font-weight:600;text-decoration:none">Contactar Asesor →</a></div></div></div></section><script>const PROP_PRICE=${price};const down=document.getElementById('downPayment');const term=document.getElementById('term');const rate=document.getElementById('rate');function fmt(n){return n.toLocaleString('es-GT')}function calc(){const downPay=parseFloat(down.value);const principal=PROP_PRICE-downPay;const r=parseFloat(rate.value)/100/12;const n=parseFloat(term.value)*12;const monthly=principal>0?(principal*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1):0;document.getElementById('downPaymentDisplay').textContent=fmt(Math.round(downPay));document.getElementById('summaryDown').textContent='Q '+fmt(Math.round(downPay));document.getElementById('loanAmount').textContent='Q '+fmt(Math.round(principal));document.getElementById('monthlyPayment').textContent='Q '+fmt(Math.round(monthly));document.getElementById('totalPayment').textContent='Q '+fmt(Math.round(monthly*n*12));}down.addEventListener('input',calc);term.addEventListener('input',calc);rate.addEventListener('input',calc);calc();<\/script>`;
}
