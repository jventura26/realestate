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
  const esc = s => escapeHtml ? escapeHtml(String(s||'')) : String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const gallery = (prop.gallery||[]).slice(0,10);
  const mainImg = prop.mainImageThumb||prop.mainImage||'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';
  const imgs = gallery.length ? gallery : [mainImg];

  // Gallery grid: main (left) + up to 4 thumbs (right 2x2)
  const g1 = imgs[0]||mainImg;
  const g2 = imgs[1]||'';
  const g3 = imgs[2]||'';
  const g4 = imgs[3]||'';
  const g5 = imgs[4]||'';
  const totalPhotos = imgs.length;

  const galHTML = `<div class="zp-gal">
    <div class="zp-gal-main"><img src="${esc(g1)}" alt="" loading="eager"></div>
    <div class="zp-gal-grid">
      ${g2?`<div class="zp-gal-cell"><img src="${esc(g2)}" alt="" loading="lazy"></div>`:''}
      ${g3?`<div class="zp-gal-cell"><img src="${esc(g3)}" alt="" loading="lazy"></div>`:''}
      ${g4?`<div class="zp-gal-cell"><img src="${esc(g4)}" alt="" loading="lazy"></div>`:''}
      ${g5?`<div class="zp-gal-cell zp-gal-last"><img src="${esc(g5)}" alt="" loading="lazy"><button class="zp-gal-all" onclick="zpOpenGallery()">${totalPhotos > 5 ? '+ ' + (totalPhotos-5) + ' fotos' : 'Ver todas'}</button></div>`:''}
    </div>
  </div>`;

  // Price
  const precio = prop.priceFormatted || (prop.precio ? Number(prop.precio).toLocaleString('en-US') : '');
  const moneda = prop.moneda||'USD';
  const precioStr = precio ? moneda + ' ' + precio : '';
  const operStr = prop.operacion||'';

  // Quick specs
  const specs = [];
  if(prop.habitaciones && prop.habitaciones!=='0') specs.push({icon:'bed',val:prop.habitaciones,lbl:'Hab.'});
  if(prop.banos && prop.banos!=='0') specs.push({icon:'bath',val:prop.banos,lbl:'Baños'});
  if(prop.mediosBanos && prop.mediosBanos!=='0') specs.push({icon:'droplets',val:prop.mediosBanos,lbl:'½ Baño'});
  if(prop.parqueos && prop.parqueos!=='0') specs.push({icon:'car',val:prop.parqueos,lbl:'Parqueos'});
  if(prop.areaConst && prop.areaConst!=='0') specs.push({icon:'ruler-square',val:prop.areaConst+' m²',lbl:'Const.'});
  if(prop.area && prop.area!=='0') specs.push({icon:'polygon',val:prop.area+' m²',lbl:'Terreno'});
  if(prop.niveles && prop.niveles!=='0') specs.push({icon:'layers',val:prop.niveles,lbl:'Niveles'});

  const specsHTML = specs.map(s=>`<div class="zp-spec">
    <i class="ti ti-${s.icon}"></i>
    <strong>${esc(s.val)}</strong>
    <span>${s.lbl}</span>
  </div>`).join('');

  // Description - strip emojis, clean paragraphs
  const rawDesc = String(prop.descripcion||'');
  const cleanDesc = rawDesc.replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}]/gu,'').trim();
  const descParas = cleanDesc.split(/\n+/).map(p=>p.trim()).filter(p=>p.length>10);
  const descPreview = descParas.slice(0,3).map(p=>`<p>${esc(p)}</p>`).join('');
  const descRest = descParas.slice(3).map(p=>`<p>${esc(p)}</p>`).join('');
  const descHTML = descPreview + (descRest ? `<div class="zp-desc-more" id="zpDescMore" style="display:none">${descRest}</div>
    <button class="zp-link-btn" onclick="zpToggleDesc()"><span id="zpDescLbl">Ver descripción completa <i class='ti ti-chevron-down'></i></span></button>` : '');

  // Caracteristicas
  const caract = Array.isArray(prop.caracteristicas) ? prop.caracteristicas : typeof prop.caracteristicas === 'string' ? prop.caracteristicas.split(/[,\n]+/).map(s=>s.trim()).filter(Boolean) : [];
  const caractHTML = caract.length ? `<div class="zp-feat-grid">${caract.map(c=>`<div class="zp-feat-item"><i class="ti ti-check"></i>${esc(c)}</div>`).join('')}</div>` : '';

  // Technical details
  const tech = [];
  if(prop.tipo) tech.push(['Tipo',prop.tipo]);
  if(prop.tipoListing) tech.push(['Categoría',prop.tipoListing]);
  if(prop.estadoConstruccion) tech.push(['Estado',prop.estadoConstruccion]);
  if(prop.tipoConstruccion) tech.push(['Construcción',prop.tipoConstruccion]);
  if(prop.anioConstruccion && prop.anioConstruccion!=='0') tech.push(['Año',prop.anioConstruccion]);
  if(prop.techo) tech.push(['Techo',prop.techo]);
  if(prop.piso) tech.push(['Piso',prop.piso]);
  if(prop.acabados) tech.push(['Acabados',prop.acabados]);
  if(prop.privConfig) tech.push(['Privada',prop.privConfig]);
  if(prop.cuotaMant && prop.cuotaMant!=='0') tech.push(['Cuota mant.',prop.cuotaMant]);
  if(prop.datosTecnicos) {
    const dt = typeof prop.datosTecnicos === 'string' ? prop.datosTecnicos.split(/[,\n]+/).map(s=>s.trim()).filter(Boolean) : [];
    dt.forEach(d=>{ const p=d.split(/[:：]/); if(p.length>1) tech.push([p[0].trim(),p.slice(1).join(':').trim()]); else tech.push(['',d]); });
  }
  const techHTML = tech.length ? `<div class="zp-tech-grid">${tech.map(([k,v])=>`<div class="zp-tech-item"><span class="zp-tech-k">${esc(k)}</span><span class="zp-tech-v">${esc(v)}</span></div>`).join('')}</div>` : '';

  // Map & video
  const hasMap = prop.lat && prop.lng;
  const mapHTML = hasMap ? `<div class="zp-map"><iframe src="https://maps.google.com/maps?q=${prop.lat},${prop.lng}&z=16&output=embed" width="100%" height="340" style="border:0;border-radius:12px" loading="lazy"></iframe></div>` : '';
  const videoHTML = prop.videoTour ? `<div class="zp-video-wrap"><iframe src="${esc(prop.videoTour)}" allow="autoplay; fullscreen" allowfullscreen width="100%" height="340" style="border:0;border-radius:12px" loading="lazy"></iframe></div>` : '';

  // Location breadcrumb
  const locParts = [prop.zona, prop.municipio, prop.ubicacionGeneral||prop.departamento].filter(Boolean);
  const locStr = locParts.map(s=>esc(s)).join(' · ');

  // Cinta badge
  const cintaColor = {'En Venta':'#1a3a5c','En Renta':'#15803d','Preventa':'#92400e','Negociable':'#6b21a8'}[prop.cinta]||'#1a3a5c';
  const cintaHTML = prop.cinta ? `<span class="zp-badge" style="background:${cintaColor}">${esc(prop.cinta)}</span>` : '';
  const exclHTML = prop.esExclusiva ? `<span class="zp-badge zp-badge-gold">Exclusiva</span>` : '';

  // Sidebar WA share
  const propUrl = `https://inmuhub.com/propiedades/${esc(prop.slug||prop.id||'')}.html`;
  const waMsg = encodeURIComponent(`Hola, me interesa esta propiedad en INMUHUB:\n${prop.titulo}\n${propUrl}`);
  const waHref = `https://wa.me/?text=${waMsg}`;

  // Plano
  const planoHTML = prop.plano ? `<a href="${esc(prop.plano)}" target="_blank" class="zp-plano-btn"><i class="ti ti-file-description"></i> Ver plano / PDF</a>` : '';

  // Gallery lightbox thumbnails
  const lightboxHTML = `<div class="zp-lb" id="zpLb" onclick="this.style.display='none'">
    <button class="zp-lb-close" onclick="document.getElementById('zpLb').style.display='none'">×</button>
    <div class="zp-lb-strip">${imgs.map((src,i)=>`<img src="${esc(src)}" class="zp-lb-thumb" onclick="event.stopPropagation();zpLbShow(${i})" loading="lazy">`).join('')}</div>
    <div class="zp-lb-main"><img id="zpLbImg" src="${esc(imgs[0])}" alt=""></div>
  </div>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(prop.titulo||'Propiedad')} | INMUHUB.COM</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.27.0/dist/tabler-icons.min.css">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fff;color:#1a1a1a;font-size:15px;line-height:1.6}
a{text-decoration:none;color:inherit}
img{max-width:100%;display:block}

/* GALLERY */
.zp-gal{display:grid;grid-template-columns:1fr 1fr;gap:4px;height:480px;margin-bottom:0;background:#000}
.zp-gal-main{overflow:hidden}
.zp-gal-main img{width:100%;height:100%;object-fit:cover;cursor:pointer;transition:transform .4s}
.zp-gal-main img:hover{transform:scale(1.02)}
.zp-gal-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:4px}
.zp-gal-cell{overflow:hidden;position:relative}
.zp-gal-cell img{width:100%;height:100%;object-fit:cover;cursor:pointer;transition:transform .4s}
.zp-gal-cell img:hover{transform:scale(1.02)}
.zp-gal-last{position:relative}
.zp-gal-all{position:absolute;bottom:14px;right:14px;background:rgba(255,255,255,.95);border:1.5px solid #ddd;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;color:#1a1a1a;backdrop-filter:blur(4px)}
.zp-gal-all:hover{background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.15)}
@media(max-width:700px){
  .zp-gal{grid-template-columns:1fr;height:260px}
  .zp-gal-grid{display:none}
}

/* LAYOUT */
.zp-body{max-width:1200px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1fr 360px;gap:40px;padding-top:36px;padding-bottom:60px;align-items:start}
@media(max-width:900px){.zp-body{grid-template-columns:1fr;padding:24px 16px 48px}}

/* MAIN COLUMN */
.zp-main{}

/* BREADCRUMB */
.zp-loc{font-size:13px;color:#666;margin-bottom:10px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.zp-loc i{font-size:14px;color:#999}

/* BADGES */
.zp-badges{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.zp-badge{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:4px 12px;border-radius:20px;color:#fff}
.zp-badge-gold{background:linear-gradient(135deg,#b8960c,#d4af37)}

/* TITLE + PRICE */
.zp-title{font-size:26px;font-weight:700;line-height:1.2;margin-bottom:10px;color:#111;letter-spacing:-.01em}
@media(max-width:700px){.zp-title{font-size:21px}}
.zp-price{font-size:28px;font-weight:800;color:#1a3a5c;margin-bottom:4px;letter-spacing:-.02em}
.zp-price-sub{font-size:13px;color:#888;margin-bottom:20px}

/* SPECS BAR */
.zp-specs{display:flex;gap:0;flex-wrap:wrap;border-top:1px solid #eee;border-bottom:1px solid #eee;margin:20px 0;padding:4px 0}
.zp-spec{display:flex;align-items:center;gap:6px;padding:12px 20px 12px 0;margin-right:20px;border-right:1px solid #eee;font-size:14px}
.zp-spec:last-child{border-right:none}
.zp-spec i{font-size:18px;color:#1a3a5c}
.zp-spec strong{font-weight:700;color:#111}
.zp-spec span{color:#888;font-size:12px;margin-left:2px}
@media(max-width:600px){.zp-spec{padding:10px 14px 10px 0;margin-right:14px}}

/* SECTIONS */
.zp-section{margin-bottom:36px}
.zp-section-title{font-size:17px;font-weight:700;color:#111;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #f0f0f0}

/* DESCRIPTION */
.zp-desc p{color:#444;font-size:15px;line-height:1.7;margin-bottom:12px}
.zp-link-btn{background:none;border:none;cursor:pointer;color:#1a3a5c;font-size:14px;font-weight:600;padding:4px 0;display:flex;align-items:center;gap:4px;margin-top:4px}
.zp-link-btn:hover{text-decoration:underline}

/* FEATURES */
.zp-feat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
.zp-feat-item{display:flex;align-items:center;gap:8px;font-size:14px;color:#333;padding:6px 0}
.zp-feat-item i{color:#1a3a5c;font-size:16px;flex-shrink:0}

/* TECH GRID */
.zp-tech-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0;border:1px solid #eee;border-radius:12px;overflow:hidden}
.zp-tech-item{padding:12px 16px;border-bottom:1px solid #eee;border-right:1px solid #eee}
.zp-tech-item:nth-child(odd):last-child{grid-column:1/-1}
.zp-tech-k{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#999;font-weight:600;margin-bottom:2px}
.zp-tech-v{display:block;font-size:14px;color:#1a1a1a;font-weight:500}

/* VIDEO */
.zp-video-wrap{border-radius:12px;overflow:hidden;margin-bottom:8px}

/* SIDEBAR */
.zp-side{position:sticky;top:24px}
.zp-card{background:#fff;border:1.5px solid #e0e0e0;border-radius:16px;padding:24px;box-shadow:0 4px 24px rgba(0,0,0,.07)}
.zp-card-price{font-size:24px;font-weight:800;color:#1a3a5c;margin-bottom:2px}
.zp-card-op{font-size:13px;color:#888;margin-bottom:20px}
.zp-avail{display:flex;align-items:center;gap:8px;font-size:13px;color:#444;margin-bottom:20px;background:#f9f9f9;padding:10px 14px;border-radius:8px}
.zp-avail .dot{width:8px;height:8px;background:#22c55e;border-radius:50%;flex-shrink:0}
.zp-wa-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:15px;background:#25D366;color:#fff;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;transition:background .2s,transform .15s;margin-bottom:12px}
.zp-wa-btn:hover{background:#1ebe5d;transform:translateY(-1px)}
.zp-wa-btn i{font-size:20px}
.zp-share-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:11px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;font-weight:600;color:#444;cursor:pointer;background:#fff;transition:border-color .2s}
.zp-share-btn:hover{border-color:#1a3a5c;color:#1a3a5c}
.zp-divider{border:none;border-top:1px solid #eee;margin:16px 0}
.zp-meta{font-size:12px;color:#bbb;text-align:center;margin-top:4px}
.zp-code{font-size:13px;color:#666;background:#f5f5f5;padding:8px 12px;border-radius:8px;margin-bottom:12px;display:flex;justify-content:space-between}
.zp-code span{font-weight:700;color:#111}
.zp-plano-btn{display:flex;align-items:center;gap:8px;color:#1a3a5c;font-size:13px;font-weight:600;padding:10px 0;text-decoration:none}
.zp-plano-btn:hover{text-decoration:underline}
.zp-plano-btn i{font-size:16px}

/* LIGHTBOX */
.zp-lb{display:none;position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:9999;flex-direction:column;align-items:center;justify-content:center}
.zp-lb.open{display:flex}
.zp-lb-close{position:absolute;top:16px;right:20px;background:none;border:none;color:#fff;font-size:32px;cursor:pointer;line-height:1}
.zp-lb-main{flex:1;display:flex;align-items:center;justify-content:center;padding:60px 20px 20px;width:100%}
.zp-lb-main img{max-width:100%;max-height:70vh;object-fit:contain;border-radius:8px}
.zp-lb-strip{display:flex;gap:8px;padding:16px 20px;overflow-x:auto;width:100%;position:absolute;bottom:0;left:0}
.zp-lb-strip::-webkit-scrollbar{height:4px}
.zp-lb-strip::-webkit-scrollbar-thumb{background:#444;border-radius:2px}
.zp-lb-thumb{width:80px;height:56px;object-fit:cover;border-radius:6px;cursor:pointer;opacity:.6;transition:opacity .2s;flex-shrink:0;border:2px solid transparent}
.zp-lb-thumb:hover,.zp-lb-thumb.active{opacity:1;border-color:#fff}

/* NAV BACK */
.zp-topbar{max-width:1200px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #f0f0f0}
.zp-back{display:flex;align-items:center;gap:6px;font-size:14px;color:#666;text-decoration:none;font-weight:500}
.zp-back:hover{color:#1a3a5c}
.zp-back i{font-size:16px}
.zp-topbar-brand{font-weight:800;font-size:16px;letter-spacing:.08em;color:#1a1a1a}
.zp-topbar-brand span{color:#F5820D}
</style>
</head>
<body>

<div class="zp-topbar">
  <a href="/propiedades.html" class="zp-back"><i class="ti ti-arrow-left"></i> Propiedades</a>
  <div style="flex:1"></div>
  <span class="zp-topbar-brand">INMU<span>HUB</span></span>
</div>

${galHTML}

<div class="zp-body">

  <!-- MAIN -->
  <div class="zp-main">

    <div class="zp-loc"><i class="ti ti-map-pin"></i>${locStr||esc(prop.zona||'Guatemala')}</div>

    <div class="zp-badges">${cintaHTML}${exclHTML}</div>

    <h1 class="zp-title">${esc(prop.titulo||'Propiedad')}</h1>

    ${precioStr ? `<div class="zp-price">${esc(precioStr)}</div><div class="zp-price-sub">${esc(operStr)}</div>` : ''}

    ${specsHTML ? `<div class="zp-specs">${specsHTML}</div>` : ''}

    ${descHTML ? `<div class="zp-section">
      <h2 class="zp-section-title">Descripción</h2>
      <div class="zp-desc">${descHTML}</div>
    </div>` : ''}

    ${caractHTML ? `<div class="zp-section">
      <h2 class="zp-section-title">Características</h2>
      ${caractHTML}
    </div>` : ''}

    ${techHTML ? `<div class="zp-section">
      <h2 class="zp-section-title">Detalles de la propiedad</h2>
      ${techHTML}
    </div>` : ''}

    ${videoHTML ? `<div class="zp-section">
      <h2 class="zp-section-title">Video tour</h2>
      ${videoHTML}
    </div>` : ''}

    ${hasMap || prop.ubicacionGeneral ? `<div class="zp-section">
      <h2 class="zp-section-title">Ubicación</h2>
      ${prop.ubicacionGeneral ? `<p style="color:#555;margin-bottom:14px;font-size:14px">${esc(prop.ubicacionGeneral)}</p>` : ''}
      ${mapHTML}
    </div>` : ''}

  </div>

  <!-- SIDEBAR -->
  <div class="zp-side">
    <div class="zp-card">
      ${precioStr ? `<div class="zp-card-price">${esc(precioStr)}</div><div class="zp-card-op">${esc(operStr)}</div>` : ''}

      <div class="zp-avail"><span class="dot"></span>Disponible</div>

      <a href="${waHref}" target="_blank" class="zp-wa-btn">
        <i class="ti ti-brand-whatsapp"></i> Compartir propiedad
      </a>

      <button class="zp-share-btn" onclick="navigator.share ? navigator.share({title:document.title,url:location.href}) : navigator.clipboard.writeText(location.href).then(()=>alert('Enlace copiado'))">
        <i class="ti ti-share"></i> Copiar enlace
      </button>

      <hr class="zp-divider">

      ${prop.codigo ? `<div class="zp-code">Código <span>${esc(prop.codigo)}</span></div>` : ''}

      ${planoHTML}

      <p class="zp-meta">inmuhub.com — Real Estate Guatemala</p>
    </div>
  </div>

</div>

${lightboxHTML}

<script>
function zpOpenGallery(){ var lb=document.getElementById('zpLb'); lb.classList.add('open'); lb.style.display='flex'; }
function zpLbShow(i){ var imgs=${JSON.stringify(imgs)}; document.getElementById('zpLbImg').src=imgs[i]; document.querySelectorAll('.zp-lb-thumb').forEach(function(t,j){t.classList.toggle('active',i===j);}); }
function zpToggleDesc(){ var m=document.getElementById('zpDescMore'); var open=m.style.display!=='none'; m.style.display=open?'none':'block'; document.getElementById('zpDescLbl').innerHTML=open?'Ver descripción completa <i class=\"ti ti-chevron-down\"></i>':'Ver menos <i class=\"ti ti-chevron-up\"></i>'; }
document.querySelectorAll('.zp-gal-main img,.zp-gal-cell img').forEach(function(img,i){ img.addEventListener('click',function(){ zpOpenGallery(); zpLbShow(i); }); });
</script>
</body></html>`;
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
