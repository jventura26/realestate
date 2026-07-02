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
const gallery=(prop.gallery||[]).slice(0,8);
const galleryHTML=gallery.length>0?`<div class="gallery-thumbs">${gallery.map(img=>`<button onclick="document.getElementById('mainImg').src='${escapeHtml(img)}';this.parentNode.querySelectorAll('button').forEach(b=>b.style.borderColor='');this.style.borderColor='var(--blue)'" title="Ver imagen"><img src="${escapeHtml(img)}" alt="${escapeHtml(prop.title)}" loading="lazy" width="120" height="80"></button>`).join('')}</div>`:'';
// Stats bar
const statItems=[];
if(prop.habitaciones&&prop.habitaciones!=='0')statItems.push(`<div class="zstat"><span class="zstat-n">${prop.habitaciones}</span><span class="zstat-l">Habitaciones</span></div>`);
if(prop.banos&&prop.banos!=='0')statItems.push(`<div class="zstat"><span class="zstat-n">${prop.banos}${prop.mediosBanos&&prop.mediosBanos!=='0'?'+\u00bd':''}</span><span class="zstat-l">Ba\u00f1os</span></div>`);
if(prop.areaConst&&prop.areaConst!=='0'&&prop.areaConst!=='')statItems.push(`<div class="zstat"><span class="zstat-n">${prop.areaConst}</span><span class="zstat-l">m\u00b2 construidos</span></div>`);
if(prop.area&&prop.area!==''&&prop.area!==prop.areaConst)statItems.push(`<div class="zstat"><span class="zstat-n">${prop.area}</span><span class="zstat-l">m\u00b2 terreno</span></div>`);
if(prop.parqueos&&prop.parqueos!=='0')statItems.push(`<div class="zstat"><span class="zstat-n">${prop.parqueos}</span><span class="zstat-l">Parqueos</span></div>`);
if(prop.niveles&&prop.niveles!=='0')statItems.push(`<div class="zstat"><span class="zstat-n">${prop.niveles}</span><span class="zstat-l">Niveles</span></div>`);
const statsBar=statItems.length?`<div class="zstats-bar">${statItems.join('<span class="zstat-div"></span>')}</div>`:'';
// Description - Zillow style: clean paragraphs, strip emojis, show/hide toggle
const descHTML=(()=>{
  if(!prop.description)return'';
  // Strip leading emojis and clean up text into paragraphs
  const clean=prop.description
    .replace(/[\u{1F000}-\u{1FBFF}\u{2600}-\u{27BF}\u{1F300}-\u{1F9FF}\u{2702}-\u{27B0}\u{25B0}-\u{25FF}]+/gu,' ')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
  const paras=clean.split(/\n\n+/).map(p=>p.replace(/\n/g,' ').replace(/\s+/g,' ').trim()).filter(p=>p.length>10);
  if(!paras.length)return'';
  const previewParas=paras.slice(0,2);
  const moreParas=paras.slice(2);
  const previewHTML=previewParas.map(p=>`<p style="margin:0 0 14px;color:var(--gray-700);line-height:1.75;font-size:15px">${escapeHtml(p)}</p>`).join('');
  const moreHTML=moreParas.length?moreParas.map(p=>`<p style="margin:0 0 14px;color:var(--gray-700);line-height:1.75;font-size:15px">${escapeHtml(p)}</p>`).join(''):'';
  const toggleId='desc-'+prop.slug.replace(/[^a-z0-9]/g,'');
  const moreBlock=moreHTML?`<div id="${toggleId}" style="display:none">${moreHTML}</div><button onclick="var el=document.getElementById('${toggleId}');var open=el.style.display!=='none';el.style.display=open?'none':'block';this.textContent=open?'Ver descripci\u00f3n completa \u2193':'Mostrar menos \u2191'" style="background:none;border:none;color:var(--blue);font-weight:600;font-size:14px;cursor:pointer;padding:4px 0;margin-top:-4px">Ver descripci\u00f3n completa \u2193</button>`:'';
  return`<div class="zsect"><h2 class="zsect-h">Descripci\u00f3n</h2>${previewHTML}${moreBlock}</div>`;
})();
// Características - 2 col checkmarks
const caracHTML=(()=>{
  const carac=prop.caracteristicas;
  if(!carac||!Array.isArray(carac)||carac.length===0)return'';
  const half=Math.ceil(carac.length/2);
  const renderItem=c=>`<li style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px;color:var(--gray-700)"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,7 5.5,10.5 12,4"/></svg>${escapeHtml(c)}</li>`;
  return`<div class="zsect"><h2 class="zsect-h">Caracter\u00edsticas</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px"><ul style="list-style:none;margin:0;padding:0">${carac.slice(0,half).map(renderItem).join('')}</ul><ul style="list-style:none;margin:0;padding:0">${carac.slice(half).map(renderItem).join('')}</ul></div></div>`;
})();
// Datos técnicos - 2 col label/value
const datosHTML=(()=>{
  const items=[];
  if(prop.tipoConstruccion)items.push(['Construcci\u00f3n',prop.tipoConstruccion]);
  if(prop.estadoConstruccion)items.push(['Estado',prop.estadoConstruccion]);
  if(prop.anioConstruccion&&prop.anioConstruccion!=='0')items.push(['A\u00f1o',prop.anioConstruccion]);
  if(prop.acabados)items.push(['Acabados',prop.acabados]);
  if(prop.techo)items.push(['Techo',prop.techo]);
  if(prop.piso)items.push(['Piso',prop.piso]);
  if(prop.cuotaMant)items.push(['Cuota mant.',prop.cuotaMant]);
  if(prop.disponibleDesde)items.push(['Disponible',prop.disponibleDesde]);
  if(prop.datosTecnicos)items.push(['Detalle',prop.datosTecnicos]);
  if(!items.length)return'';
  const half=Math.ceil(items.length/2);
  const renderItem=([l,v])=>`<div style="padding:12px 0;border-bottom:1px solid var(--border)"><div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px">${escapeHtml(l)}</div><div style="font-size:14px;font-weight:600;color:var(--gray-900)">${escapeHtml(String(v))}</div></div>`;
  return`<div class="zsect"><h2 class="zsect-h">Datos T\u00e9cnicos</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:0 32px">${items.slice(0,half).map(renderItem).join('')}${items.slice(half).map(renderItem).join('')}</div></div>`;
})();
// Video tour
const videoHTML=(()=>{
  if(!prop.videoTour)return'';
  let src=prop.videoTour;
  const m=src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if(m)src='https://www.youtube.com/embed/'+m[1];
  return`<div class="zsect"><h2 class="zsect-h">Video Tour</h2><div style="position:relative;padding-bottom:56.25%;border-radius:10px;overflow:hidden"><iframe src="${escapeHtml(src)}" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy"></iframe></div></div>`;
})();
// Mapa
const mapHTML=(()=>{
  if(!prop.lat||!prop.lng||prop.lat==='0'||prop.lng==='0')return'';
  const lat=parseFloat(prop.lat),lng=parseFloat(prop.lng);
  if(isNaN(lat)||isNaN(lng))return'';
  return`<div class="zsect"><h2 class="zsect-h">Ubicaci\u00f3n en mapa</h2><div style="border-radius:10px;overflow:hidden;border:1px solid var(--border)"><iframe width="100%" height="300" frameborder="0" scrolling="no" loading="lazy" src="https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed&hl=es"></iframe></div></div>`;
})();
// Sidebar - share link (no phone)
const propUrl='https://inmuhub.com/propiedades/'+prop.slug+'.html';
const shareText=encodeURIComponent('Mira esta propiedad: '+prop.title+' en '+(prop.ubicacionGeneral||prop.locationFull)+' '+propUrl);
const sidebarHTML=`<div class="zside-card">
  ${prop.esExclusiva?'<div style="background:linear-gradient(135deg,#c9a96e,#a07840);color:#fff;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.5px;text-align:center;margin-bottom:16px">\u2605 PROPIEDAD EXCLUSIVA</div>':''}
  <div style="font-size:30px;font-weight:800;color:var(--blue);margin-bottom:4px;line-height:1">${escapeHtml(prop.priceFormatted)}</div>
  <div style="font-size:12px;color:var(--text-muted);margin-bottom:20px">${escapeHtml(prop.moneda||'')}${prop.operacion?' &middot; '+escapeHtml(prop.operacion):''}</div>
  ${prop.precioRenta?'<div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">Precio renta: <strong>'+escapeHtml(prop.precioRenta)+'</strong></div>':''}
  <a href="https://wa.me/?text=${shareText}" target="_blank" rel="noopener" class="zbtn-wa">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
    Compartir propiedad
  </a>
  ${prop.plano?'<a href="'+escapeHtml(prop.plano)+'" target="_blank" rel="noopener" class="zbtn-sec">Ver plano \u2192</a>':''}
  <div class="zside-list">
    <div class="zside-row"><span>Tipo</span><strong>${escapeHtml(prop.tipo||'-')}</strong></div>
    <div class="zside-row"><span>Operaci\u00f3n</span><strong>${escapeHtml(prop.operacion||'-')}</strong></div>
    ${prop.municipio?'<div class="zside-row"><span>Municipio</span><strong>'+escapeHtml(prop.municipio)+'</strong></div>':''}
    ${prop.codigo?'<div class="zside-row"><span>C\u00f3digo</span><strong>'+escapeHtml(prop.codigo)+'</strong></div>':''}
  </div>
</div>`;
const body=`
<style>
.zdetail-wrap{max-width:1200px;margin:0 auto;padding:0 24px 60px}
.zdetail-gallery{margin-bottom:0}
.zdetail-gallery .gallery-main img,.zgallery-hero .gallery-main img{width:100%;max-height:520px;object-fit:cover;border-radius:12px 12px 0 0}
.gallery-thumbs{display:flex;gap:6px;padding:6px;background:var(--gray-900);border-radius:0 0 12px 12px;overflow-x:auto}
.gallery-thumbs button{flex:0 0 80px;height:56px;border:2px solid transparent;border-radius:6px;overflow:hidden;cursor:pointer;background:none;padding:0;transition:border-color .2s}
.gallery-thumbs button img{width:100%;height:100%;object-fit:cover}
.zgallery-hero{margin-bottom:28px}
.zheader{margin-bottom:20px}
.zbadges{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.zbadge{padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.3px}
.zbadge-op{background:var(--blue);color:#fff}
.zbadge-tip{background:var(--gray-100);color:var(--gray-700)}
.zdetail-h1{font-size:clamp(22px,3vw,30px);font-weight:800;color:var(--gray-900);margin:0 0 8px;line-height:1.2}
.zloc{display:flex;align-items:center;gap:6px;font-size:14px;color:var(--gray-600)}
.zstats-bar{display:flex;flex-wrap:wrap;align-items:center;background:var(--white);border:1px solid var(--border);border-radius:10px;padding:0 8px;margin-bottom:28px}
.zstat{padding:16px 20px;text-align:center;flex:1;min-width:72px}
.zstat-n{display:block;font-size:22px;font-weight:800;color:var(--gray-900);line-height:1}
.zstat-l{display:block;font-size:11px;color:var(--text-muted);margin-top:3px;font-weight:500}
.zstat-div{width:1px;background:var(--border);align-self:stretch;margin:10px 0}
.zlayout{display:grid;grid-template-columns:1fr 340px;gap:40px;align-items:start}
.zsect{padding:28px 0;border-bottom:1px solid var(--border)}
.zsect:last-child{border-bottom:none}
.zsect-h{font-size:17px;font-weight:700;color:var(--gray-900);margin:0 0 16px}
.zside-card{background:var(--white);border:1px solid var(--border);border-radius:12px;padding:24px;position:sticky;top:80px;box-shadow:0 2px 12px rgba(0,0,0,.06)}
.zbtn-wa{display:flex;align-items:center;justify-content:center;gap:8px;background:#25D366;color:#fff;padding:13px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;margin-bottom:10px;transition:opacity .2s}
.zbtn-wa:hover{opacity:.9}
.zbtn-sec{display:flex;align-items:center;justify-content:center;gap:6px;border:1px solid var(--border);color:var(--gray-700);padding:10px;border-radius:8px;font-weight:600;font-size:13px;text-decoration:none;margin-bottom:16px;transition:border-color .2s}
.zbtn-sec:hover{border-color:var(--blue);color:var(--blue)}
.zside-list{border-top:1px solid var(--border);padding-top:14px}
.zside-row{display:flex;justify-content:space-between;padding:8px 0;font-size:13px;border-bottom:1px solid var(--gray-100)}
.zside-row:last-child{border-bottom:none}
.zside-row span{color:var(--text-muted)}
.zside-row strong{color:var(--gray-900);font-weight:600;text-align:right;max-width:60%}
@media(max-width:768px){.zlayout{grid-template-columns:1fr}.zside-card{position:static}.zstats-bar{gap:0}.zstat{padding:12px 8px;min-width:60px}.zstat-n{font-size:17px}.zgallery-hero .gallery-main img{max-height:240px}}
</style>
<div class="zdetail-wrap">
  <div class="breadcrumb" style="padding:16px 0;font-size:13px"><a href="/">Inicio</a> / <a href="/propiedades.html">${escapeHtml(prop.tipo||'Propiedades')}</a> / <span>${escapeHtml(prop.title)}</span></div>
  <div class="zgallery-hero">
    <div class="gallery-main"><img id="mainImg" src="${escapeHtml(prop.mainImageThumb||'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=75')}" alt="${escapeHtml(prop.title)} - INMUHUB.COM" loading="eager" width="900" height="520"></div>
    ${galleryHTML}
  </div>
  <div class="zheader">
    <div class="zbadges">
      ${prop.operacion?'<span class="zbadge zbadge-op">'+escapeHtml(prop.operacion)+'</span>':''}
      ${prop.tipo?'<span class="zbadge zbadge-tip">'+escapeHtml(prop.tipo)+'</span>':''}
      ${prop.esExclusiva?'<span class="zbadge" style="background:linear-gradient(135deg,#c9a96e,#a07840);color:#fff">\u2605 Exclusiva</span>':''}
    </div>
    <h1 class="zdetail-h1">${escapeHtml(prop.title)}</h1>
    <div class="zloc"><svg width="14" height="16" viewBox="0 0 12 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 1a4 4 0 0 1 4 4c0 3-4 8-4 8S2 8 2 5a4 4 0 0 1 4-4z"/><circle cx="6" cy="5" r="1.4"/></svg>${escapeHtml(prop.ubicacionGeneral||prop.locationFull)}</div>
  </div>
  ${statsBar}
  <div class="zlayout">
    <div class="zmain">${descHTML}${caracHTML}${datosHTML}${videoHTML}${mapHTML}</div>
    <aside>${sidebarHTML}</aside>
  </div>
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
