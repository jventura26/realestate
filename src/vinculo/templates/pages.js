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
function renderDescBloques(bloques) {
  if (!bloques || !Array.isArray(bloques) || bloques.length === 0) return '';
  return bloques.map(b => {
    const c = (b.content || '').trim();
    if (!c) return '';
    if (b.type === 'destacado') {
      return '<div style="margin-bottom:20px;padding:16px 20px;border-left:3px solid var(--gold,#C9A96E);background:rgba(201,169,110,.06);border-radius:0 8px 8px 0">'
        + '<div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold,#C9A96E);margin-bottom:6px">Destacado</div>'
        + '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;font-weight:300;line-height:1.8;font-style:italic;color:#334155">' + escapeHtml(c) + '</div></div>';
    }
    if (b.type === 'lista') {
      const items = c.split('\n').map(l => l.trim()).filter(l => l);
      if (items.length === 0) return '';
      return '<ul style="margin:0 0 20px;padding:0 0 0 8px;list-style:none;display:flex;flex-direction:column;gap:8px">'
        + items.map(item => '<li style="display:flex;align-items:flex-start;gap:10px;line-height:1.6;color:#334155">'
          + '<span style="color:var(--gold,#C9A96E);font-size:1rem;flex-shrink:0;margin-top:2px">\u2713</span>'
          + '<span>' + escapeHtml(item) + '</span></li>').join('')
        + '</ul>';
    }
    return '<p style="margin:0 0 16px;line-height:1.8;color:#334155">' + escapeHtml(c) + '</p>';
  }).join('');
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
].map(([ic,nm,hr,ds])=>`<a href="${hr}" style="display:flex;flex-direction:column;align-items:flex-start;padding:28px;background:#f8f9fb;border:1.5px solid #eef0f3;border-radius:12px;text-decoration:none;text-align:left;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.background='white';this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 40px rgba(0,0,0,.08)'" onmouseout="this.style.borderColor='#eef0f3';this.style.background='#f8f9fb';this.style.transform='none';this.style.boxShadow='none'"><div style="margin-bottom:16px;display:flex;align-items:center;justify-content:center;color:var(--gold)">${ic}</div><div style="font-size:15px;font-weight:700;color:#0a1628;margin-bottom:8px">${nm}</div><div style="font-size:13px;color:#64748b;line-height:1.6;flex:1">${ds}</div><div style="margin-top:16px;font-size:12px;font-weight:700;color:var(--gold);letter-spacing:.04em">Ir a herramienta &rarr;</div></a>`).join('');

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

<section style="padding:72px 6%;background:white;border-bottom:1px solid #eef0f3"><div style="max-width:1200px;margin:0 auto"><div style="text-align:center;margin-bottom:48px"><div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Por que elegirnos</div><h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:300;color:#0a1628;margin:0">La diferencia que <em style="font-style:italic">realmente importa</em></h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:32px"><div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='#eef0f3';this.style.transform='none'"><div style="width:64px;height:64px;background:linear-gradient(135deg,#0a1628,#1a2a4e);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div><h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Propiedades verificadas</h3><p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Cada propiedad pasa por verificacion rigurosa. Papeleria en orden y precios reales.</p></div><div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='#eef0f3';this.style.transform='none'"><div style="width:64px;height:64px;background:linear-gradient(135deg,#c9a96e,#e6c06a);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1 1 1 0 0 1-1 1h0a1 1 0 0 1-1-1z"/><path d="M14 14a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1 1 1 0 0 1-1 1h0a1 1 0 0 1-1-1z"/><path d="M8 14a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1 1 1 0 0 1-1 1h0a1 1 0 0 1-1-1z"/><path d="M18 11.5V9a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2"/><path d="M6 11.5V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"/><path d="M3.5 11h.01"/><path d="M20.5 11h.01"/><path d="M6 11.5a6.5 6.5 0 0 0 12 0"/></svg></div><h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Asesoria personalizada</h3><p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Un asesor dedicado desde la busqueda hasta el cierre. Tu inversion, nuestra prioridad.</p></div><div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor='var(--gold)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='#eef0f3';this.style.transform='none'"><div style="width:64px;height:64px;background:linear-gradient(135deg,#25d366,#1da851);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div><h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Respuesta en 1 hora</h3><p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Contestamos por WhatsApp en menos de 60 minutos. Las mejores oportunidades no esperan.</p></div></div></div></section>
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
return layout({ title: 'Propiedades en Venta en Guatemala — Casas, Apartamentos, Fincas', desc: 'Catalogo de ' + props.length + ' propiedades en venta en Guatemala. Casas, apartamentos, fincas y terrenos en Zona 10, Zona 14, Cayala, Fraijanes. Precios verificados y actualizados.', canonical: '/propiedades.html', body });
}

function zonaPage(props, zona) {
var tipos = uniqueValues(props, 'tipo');
var slug = zona.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
var precios = props.map(function(p){ return p.priceNumeric; }).filter(function(n){ return n > 0; });
var precioMin = precios.length ? Math.min.apply(null, precios) : 0;
var precioMax = precios.length ? Math.max.apply(null, precios) : 0;
var rangoPrecios = precioMin && precioMax ? '$' + precioMin.toLocaleString('en-US') + ' - $' + precioMax.toLocaleString('en-US') : '';

var ZONA_CONTENT = {
  'zona-10': { desc: 'Zona 10 es el epicentro financiero y diplomatico de Ciudad de Guatemala. Alberga hoteles cinco estrellas, restaurantes de autor, centros comerciales exclusivos y embajadas. Las propiedades aqui combinan ubicacion estrategica con prestigio y alta plusvalia.', faqs: [
    { q: 'Que tipos de propiedades hay en Zona 10?', a: 'En Zona 10 encontraras principalmente apartamentos de lujo, oficinas corporativas y residencias exclusivas. Los precios varian segun el edificio y las amenidades.' },
    { q: 'Es buena inversion comprar en Zona 10?', a: 'Si, Zona 10 es una de las areas con mayor plusvalia en Guatemala. La demanda es constante por su ubicacion central, conectividad y oferta comercial.' },
    { q: 'Cual es el rango de precios en Zona 10?', a: rangoPrecios ? 'Actualmente las propiedades van desde ' + rangoPrecios + '.' : 'Los precios varian segun tipo y tamano. Consulta las propiedades disponibles para precios actualizados.' }
  ]},
  'zona-14': { desc: 'Zona 14 es sinonimo de exclusividad residencial en Guatemala. Con amplias avenidas arboladas, clubs privados, colegios de prestigio y la cercan\u00eda al aeropuerto internacional, es la eleccion natural para familias que buscan calidad de vida premium y seguridad.', faqs: [
    { q: 'Que hace especial a Zona 14 para vivir?', a: 'Zona 14 ofrece un entorno residencial tranquilo con acceso rapido a centros comerciales, hospitales y colegios de primer nivel. Su plusvalia historica es una de las mas altas del pais.' },
    { q: 'Que tipos de propiedades hay en Zona 14?', a: 'Predominan las casas amplias en condominios cerrados y apartamentos de lujo. Tambien hay opciones de terrenos y oficinas.' },
    { q: 'Cual es el rango de precios en Zona 14?', a: rangoPrecios ? 'Las propiedades actualmente van desde ' + rangoPrecios + '.' : 'Consulta las propiedades disponibles para precios actualizados.' }
  ]},
  'zona-15': { desc: 'Zona 15 combina naturaleza y modernidad. Con desarrollos residenciales contemporaneos, areas verdes extensas y acceso directo a centros educativos y comerciales, es ideal para familias jovenes y profesionales que buscan un equilibrio entre ciudad y tranquilidad.', faqs: [
    { q: 'Que ventajas tiene vivir en Zona 15?', a: 'Zona 15 destaca por sus areas verdes, condominios modernos con amenidades completas y excelente conectividad vial hacia zonas 10 y 14.' },
    { q: 'Cual es el rango de precios en Zona 15?', a: rangoPrecios ? 'Las propiedades van desde ' + rangoPrecios + '.' : 'Consulta las propiedades disponibles para precios actualizados.' }
  ]},
  'zona-16': { desc: 'Zona 16 ofrece un estilo de vida residencial exclusivo con amplios terrenos, vistas panoramicas y proyectos de baja densidad. Ideal para quienes buscan privacidad, naturaleza y propiedades de gran tamano sin alejarse de la ciudad.', faqs: [
    { q: 'Que tipo de propiedades se encuentran en Zona 16?', a: 'Zona 16 se caracteriza por casas amplias en condominios de baja densidad, terrenos para construccion y desarrollos exclusivos rodeados de naturaleza.' },
    { q: 'Cual es el rango de precios en Zona 16?', a: rangoPrecios ? 'Actualmente las propiedades van desde ' + rangoPrecios + '.' : 'Consulta las propiedades disponibles para precios actualizados.' }
  ]},
  'cayala': { desc: 'Cayala es el desarrollo urbanistico mas innovador de Guatemala. Su concepto de ciudad dentro de la ciudad integra residencias, comercios, restaurantes, oficinas y espacios publicos en un entorno peatonal seguro y sofisticado. Alta demanda y plusvalia creciente.', faqs: [
    { q: 'Que hace unica a Cayala?', a: 'Cayala es una ciudad planificada con arquitectura europea, calles peatonales, seguridad 24/7 y una comunidad activa. Combina residencia, trabajo y entretenimiento en un solo lugar.' },
    { q: 'Cual es el rango de precios en Cayala?', a: rangoPrecios ? 'Las propiedades van desde ' + rangoPrecios + '.' : 'Los precios varian segun tipo. Consulta las propiedades disponibles.' }
  ]},
  'fraijanes': { desc: 'Fraijanes se ha consolidado como destino premium para quienes buscan residencias amplias, fincas y terrenos de inversion a minutos de la capital. Su clima templado, entorno natural y desarrollos modernos atraen a familias y inversionistas.', faqs: [
    { q: 'Es buena inversion comprar en Fraijanes?', a: 'Si, Fraijanes ha experimentado un crecimiento sostenido en plusvalia gracias a nuevos desarrollos residenciales, mejora de infraestructura vial y alta demanda.' },
    { q: 'Que tipos de propiedades hay en Fraijanes?', a: 'Encontraras casas en condominio, fincas, terrenos para desarrollo y residencias de campo. Es ideal para quienes buscan espacio y naturaleza.' },
    { q: 'Cual es el rango de precios en Fraijanes?', a: rangoPrecios ? 'Las propiedades van desde ' + rangoPrecios + '.' : 'Consulta las propiedades disponibles para precios actualizados.' }
  ]}
};

var zoneKey = slug;
var zoneContent = ZONA_CONTENT[zoneKey] || { desc: 'Descubre las propiedades disponibles en ' + zona + ', Guatemala. Residencias, apartamentos, fincas y terrenos verificados con precios actualizados.', faqs: [] };

var faqHTML = '';
if (zoneContent.faqs && zoneContent.faqs.length) {
  faqHTML = '<div style="padding:40px 6%;background:var(--gray-50);border-top:1px solid var(--border)">' +
    '<div style="max-width:800px;margin:0 auto">' +
    '<h2 style="font-size:22px;font-weight:700;margin-bottom:24px;color:var(--gray-900)">Preguntas frecuentes sobre ' + escapeHtml(zona) + '</h2>' +
    zoneContent.faqs.map(function(faq, i) {
      return '<details style="border-bottom:1px solid var(--border);padding:16px 0"' + (i===0?' open':'') + '>' +
        '<summary style="cursor:pointer;font-size:15px;font-weight:600;color:var(--gray-900);list-style:none;display:flex;justify-content:space-between;align-items:center">' +
        '<span>' + escapeHtml(faq.q) + '</span>' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>' +
        '</summary>' +
        '<p style="font-size:14px;color:var(--gray-600);line-height:1.7;margin-top:12px">' + escapeHtml(faq.a) + '</p>' +
        '</details>';
    }).join('') +
    '</div></div>';
}

var body = '<div style="background:var(--gray-900);padding:48px 6%;color:var(--white)">' +
'<div style="font-size:12px;color:rgba(255,255,255,.5);margin-bottom:12px"><a href="/" style="color:rgba(255,255,255,.5)">Inicio</a> / <a href="/propiedades.html" style="color:rgba(255,255,255,.5)">Propiedades</a> / ' + escapeHtml(zona) + '</div>' +
'<h1 style="font-size:clamp(28px,4vw,42px);font-weight:800;margin-bottom:12px">Propiedades en Venta en <span style="color:var(--gold)">' + escapeHtml(zona) + '</span></h1>' +
'<p style="color:rgba(255,255,255,.65);font-size:16px;line-height:1.7;max-width:700px">' + escapeHtml(zoneContent.desc) + '</p>' +
'<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:20px">' +
tipos.map(function(t){ return '<span style="background:rgba(201,169,110,.15);color:var(--gold);border:1px solid rgba(201,169,110,.3);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600">' + escapeHtml(t) + '</span>'; }).join('') +
(rangoPrecios ? '<span style="background:rgba(201,169,110,.15);color:var(--gold);border:1px solid rgba(201,169,110,.3);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600">' + rangoPrecios + '</span>' : '') +
'</div></div>' +
'<div class="prop-grid" style="padding:32px 6%">' + props.map(function(p){ return card(p); }).join('') + '</div>' +
faqHTML +
'<div style="padding:40px 6%;background:var(--gray-50);text-align:center;border-top:1px solid var(--border)">' +
'<p style="color:var(--gray-600);margin-bottom:16px">Ver todas las propiedades disponibles en Guatemala</p>' +
'<a href="/propiedades.html" style="background:var(--blue);color:var(--white);padding:10px 28px;border-radius:6px;font-weight:600;display:inline-block">Ver catalogo completo</a>' +
'</div>';

var schemaBreadcrumb = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type':'ListItem', 'position':1, 'name':'Inicio', 'item':'https://inmuhub.com/' },
    { '@type':'ListItem', 'position':2, 'name':'Propiedades', 'item':'https://inmuhub.com/propiedades.html' },
    { '@type':'ListItem', 'position':3, 'name': 'Propiedades en ' + zona }
  ]
});

var schemaFaq = (zoneContent.faqs && zoneContent.faqs.length) ? JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': zoneContent.faqs.map(function(faq) {
    return { '@type': 'Question', 'name': faq.q, 'acceptedAnswer': { '@type': 'Answer', 'text': faq.a } };
  })
}) : null;

var scripts = '<script type="application/ld+json">' + schemaBreadcrumb + '<\/script>';
if (schemaFaq) scripts += '<script type="application/ld+json">' + schemaFaq + '<\/script>';

return layout({
  title: 'Propiedades en Venta en ' + zona + ', Guatemala \u2014 Casas y Apartamentos',
  desc: props.length + ' propiedades en venta en ' + zona + ', Guatemala. ' + tipos.join(', ') + ' con precios verificados.' + (rangoPrecios ? ' Desde ' + rangoPrecios + '.' : ''),
  canonical: '/zonas/' + slug + '.html',
  body: body,
  scripts: scripts
});
}


function dualPriceDetail(prop, esc) {
  var raw = prop.priceFormatted || prop.precio || '';
  if (!raw) return { main:'', sub:'', sidebar:'', sidebarSub:'' };
  var num = parseFloat(String(prop.priceNumeric || 0));
  var m = (prop.moneda || '').toUpperCase();
  var isQ = m.includes('Q') || m.includes('GTQ') || raw.includes('Q');
  var alt = '';
  var approx = String.fromCharCode(8776);
  if (num > 0) {
    if (isQ) { alt = approx + ' ' + '$' + Math.round(num/7.60).toLocaleString('en-US') + ' USD'; }
    else { alt = approx + ' Q' + Math.round(num*7.80).toLocaleString('en-US'); }
  }
  return { main:esc(raw), sub:alt, sidebar:esc(raw), sidebarSub:alt };
}

function detailPage(prop, allProps) {
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

  const mobGalHTML = imgs.length ? `<div class="zp-mob-gal">
    <div class="zp-mob-track" id="zpMobTrack">${imgs.map((src,i)=>`<div class="zp-mob-slide"><img src="${esc(src)}" alt="${esc((prop.tipo||'Propiedad') + ' en ' + (prop.municipio||'Guatemala') + (i>0?' - foto '+(i+1):''))}" loading="lazy"></div>`).join('')}</div>
    <div class="zp-mob-counter" id="zpMobCounter">1 / ${imgs.length}</div>
    <div class="zp-mob-dots">${imgs.map((_,i)=>`<div class="zp-mob-dot${i===0?' active':''}" id="zpDot${i}"></div>`).join('')}</div>
  </div>` : '';

  const galHTML = `<div class="zp-gal">
    <div class="zp-gal-main"><img src="${esc(g1)}" alt="${esc((prop.tipo||'Propiedad') + ' en ' + (prop.municipio||'Guatemala'))}" loading="eager"></div>
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
  const dp = dualPriceDetail(prop, esc);
  const operStr = prop.operacion||'';

  // Quick specs
  const specs = [];
  if(prop.habitaciones && prop.habitaciones!=='0') specs.push({icon:'bed',val:prop.habitaciones,lbl:'Hab.'});
  if(prop.banos && prop.banos!=='0') specs.push({icon:'bath',val:prop.banos,lbl:'Baños'});
  if(prop.mediosBanos && prop.mediosBanos!=='0') specs.push({icon:'droplets',val:prop.mediosBanos,lbl:'½ Baño'});
  if(prop.parqueos && prop.parqueos!=='0') specs.push({icon:'car',val:prop.parqueos,lbl:'Parqueos'});
    if(prop.areaConst && prop.areaConst!=='0') specs.push({icon:'ruler-2',val:prop.areaConst+' m\u00B2',lbl:'Const.'});
  if(prop.areaV2 && prop.areaV2!=='0') specs.push({icon:'dimensions',val:prop.areaV2+' v\u00B2',lbl:'Terreno'});
  else if(prop.area && prop.area!=='0') specs.push({icon:'dimensions',val:prop.area+' m\u00B2',lbl:'Terreno'});
  if(prop.niveles && prop.niveles!=='0') specs.push({icon:'stairs-up',val:prop.niveles,lbl:'Niveles'});

  const specsHTML = specs.map(s=>`<div class="zp-spec">
    <i class="ti ti-${s.icon}"></i>
    <strong>${esc(s.val)}</strong>
    <span>${s.lbl}</span>
  </div>`).join('');

  // Description - strip emojis, clean paragraphs
  const rawDesc = String(prop.descripcion||'');
  const cleanDesc = rawDesc.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\uFE0F|\u20E3/g,'').trim();
  const descIconMap = [
    [/habitaci|dormitorio|cuarto|recamara|master/i,'ti-bed'],
    [/ba[ñn]o|lavabo|ducha|jacuzzi/i,'ti-bath'],
    [/cocina|kitchen|gourmet|comedor|dining/i,'ti-tools-kitchen-2'],
    [/sala|living|estar|lounge/i,'ti-sofa'],
    [/piscin|pool|nado/i,'ti-wave-sine'],
    [/jardín|jardin|garden|verde|naturaleza|bosque/i,'ti-leaf'],
    [/terraza|balc[oó]n|deck|vista|panoram/i,'ti-building-pavilion'],
    [/estudio|oficina|trabajo|home office/i,'ti-briefcase'],
    [/seguridad|vigilancia|c[aá]mara|acceso/i,'ti-shield-check'],
    [/garaje|parqueo|garage|auto|veh[ií]culo/i,'ti-car-garage'],
    [/construcc|acabado|diseño|arquitect|moderno/i,'ti-ruler-2'],
    [/inversion|rentabilidad|plusval|roi|valor/i,'ti-trending-up'],
    [/ubicaci|zona|sector|colonia|cerca|acceso/i,'ti-map-pin'],
    [/privada|exclusiv|residencial|gated/i,'ti-lock'],
    [/lujo|luxury|premium|alta gama|elegante/i,'ti-diamond'],
    [/finca|campo|naturaleza|hectarea|terreno/i,'ti-trees'],
    [/bodega|almacen|storage/i,'ti-box'],
    [/gimnasio|fitness|deporte/i,'ti-barbell'],
    [/luz|iluminaci|ventilaci|amplio|espaci/i,'ti-sun'],
  ];
  function getDescIcon(text){ for(const [re,ic] of descIconMap){ if(re.test(text)) return ic; } return 'ti-home'; }
  function makeDescPara(p){ return `<div class="zp-desc-para"><div class="zp-desc-icon"><i class="ti ${getDescIcon(p)}"></i></div><p>${esc(p)}</p></div>`; }
  const descParas = cleanDesc.split(/\n+/).map(p=>p.trim()).filter(p=>p.length>10);
  const descPreview = descParas.slice(0,3).map(makeDescPara).join('');
  const descRest = descParas.slice(3).map(makeDescPara).join('');
  const descHTML = descPreview + (descRest ? `<div class="zp-desc-more" id="zpDescMore" style="display:none">${descRest}</div>
    <button class="zp-link-btn" onclick="zpToggleDesc()"><span id="zpDescLbl">Ver descripción completa <i class='ti ti-chevron-down'></i></span></button>` : '');

  // Caracteristicas
  const caract = Array.isArray(prop.caracteristicas) ? prop.caracteristicas : typeof prop.caracteristicas === 'string' ? prop.caracteristicas.split(/[,\n]+/).map(s=>s.trim()).filter(Boolean) : [];
  const iconMap = [
    [/piscin|pool|jacuzzi/i,'ti-wave-sine'],
    [/gimnasio|gym|fitness/i,'ti-barbell'],
    [/seg[ue]ridad|guarda|vigilancia|c[aá]maras?/i,'ti-shield-check'],
    [/bodega|storage/i,'ti-box'],
    [/vista|panoram|view/i,'ti-binoculars'],
    [/jardín|jardin|garden/i,'ti-leaf'],
    [/terraza|balc[oó]n|deck/i,'ti-building-pavilion'],
    [/cocina|kitchen/i,'ti-tools-kitchen-2'],
    [/lavander[ií]a|laundry/i,'ti-wash-machine'],
    [/estudio|oficina|office/i,'ti-briefcase'],
    [/biblioteca|library/i,'ti-books'],
    [/sala|living/i,'ti-sofa'],
    [/comedor|dining/i,'ti-armchair'],
    [/cuarto|habitaci[oó]n|dormitorio/i,'ti-bed'],
    [/ba[ñn]o|bath/i,'ti-bath'],
    [/aire|a\/c|clima/i,'ti-air-conditioning'],
    [/calefacci[oó]n|calefactor/i,'ti-flame'],
    [/ascensor|elevador|lift/i,'ti-elevator'],
    [/parqueo|garage|estacion/i,'ti-car-garage'],
    [/internet|fibra|wifi/i,'ti-wifi'],
    [/solar|paneles|fotovoltai/i,'ti-solar-panel'],
    [/generador|planta/i,'ti-bolt'],
    [/cisterna|agua|pozo/i,'ti-droplet'],
    [/alarma|alarm/i,'ti-alarm'],
    [/portón|puerta|gate/i,'ti-door'],
    [/luminaria|iluminaci[oó]n|lights/i,'ti-bulb'],
    [/madera|wood/i,'ti-trees'],
    [/piedra|granito|m[aá]rmol/i,'ti-diamond'],
    [/amueblado|furnished/i,'ti-lamp'],
    [/acceso|entrada/i,'ti-key'],
    [/privada|gated/i,'ti-lock'],
  ];
  function getIcon(text){ for(const [re,ic] of iconMap){ if(re.test(text)) return ic; } return 'ti-check'; }
  const caractHTML = caract.length ? `<div class="zp-feat-grid">${caract.map(c=>`<div class="zp-feat-item"><i class="ti ${getIcon(c)}"></i>${esc(c)}</div>`).join('')}</div>` : '';

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
  // privConfig es objeto de privacidad, no se muestra
  if(prop.cuotaMant && prop.cuotaMant!=='0') tech.push(['Cuota mant.',prop.cuotaMant]);
  if(prop.datosTecnicos) {
    const dt = typeof prop.datosTecnicos === 'string' ? prop.datosTecnicos.split(/[,\n]+/).map(s=>s.trim()).filter(Boolean) : [];
    dt.forEach(d=>{ const p=d.split(/[:：]/); if(p.length>1) tech.push([p[0].trim(),p.slice(1).join(':').trim()]); else tech.push(['',d]); });
  }
  const techHTML = tech.length ? `<div class="zp-tech-grid">${tech.map(([k,v])=>`<div class="zp-tech-item"><span class="zp-tech-k">${esc(k)}</span><span class="zp-tech-v">${esc(v)}</span></div>`).join('')}</div>` : '';

  // Map & video
  const hasMap = prop.lat && prop.lng;
  const mapHTML = hasMap ? `<div class="zp-map"><iframe src="https://maps.google.com/maps?q=${prop.lat},${prop.lng}&z=16&output=embed" width="100%" height="340" style="border:0;border-radius:12px" loading="lazy"></iframe></div>` : '';
  const videoHTML = (prop.videoTour || prop.videoUrl) ? `<div class="zp-video-wrap"><iframe src="${esc(prop.videoTour || prop.videoUrl)}" allow="autoplay; fullscreen" allowfullscreen width="100%" height="340" style="border:0;border-radius:12px" loading="lazy"></iframe></div>` : '';

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
  // Schema RealEstateListing
  const schemaListing = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': prop.titulo || 'Propiedad',
    'description': cleanDesc || prop.titulo,
    'url': propUrl,
    'image': prop.mainImage || '',
    'numberOfRooms': prop.habitaciones || undefined,
    'floorSize': prop.areaConst ? { '@type':'QuantitativeValue', 'value': prop.areaConst, 'unitCode': 'MTK' } : undefined,
    'offers': {
      '@type': 'Offer',
      'price': prop.priceNumeric || 0,
      'priceCurrency': (prop.moneda||'USD').includes('Q') ? 'GTQ' : 'USD',
      'availability': 'https://schema.org/InStock'
    },
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': prop.municipio || prop.zona || 'Guatemala',
      'addressRegion': prop.departamento || 'Guatemala',
      'addressCountry': 'GT'
    }
  });

  const schemaBreadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type':'ListItem', 'position':1, 'name':'Inicio', 'item':'https://inmuhub.com/' },
      { '@type':'ListItem', 'position':2, 'name':'Propiedades', 'item':'https://inmuhub.com/propiedades.html' },
      { '@type':'ListItem', 'position':3, 'name': prop.titulo || 'Propiedad' }
    ]
  });


  // Plano
  const planoHTML = prop.plano ? `<a href="${esc(prop.plano)}" target="_blank" class="zp-plano-btn"><i class="ti ti-file-description"></i> Ver plano / PDF</a>` : '';

  // Gallery lightbox thumbnails
  const lightboxHTML = `<div class="zp-lb" id="zpLb" onclick="this.style.display='none'">
    <button class="zp-lb-close" onclick="document.getElementById('zpLb').style.display='none'">×</button>
    <div class="zp-lb-strip">${imgs.map((src,i)=>`<img src="${esc(src)}" class="zp-lb-thumb" onclick="event.stopPropagation();zpLbShow(${i})" loading="lazy">`).join('')}</div>
    <button class="zp-lb-nav zp-lb-prev" onclick="event.stopPropagation();zpLbPrev()" style="position:absolute;left:20px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.15);border:none;color:#fff;font-size:28px;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:10;backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center">&lsaquo;</button>
    <button class="zp-lb-nav zp-lb-next" onclick="event.stopPropagation();zpLbNext()" style="position:absolute;right:20px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.15);border:none;color:#fff;font-size:28px;width:44px;height:44px;border-radius:50%;cursor:pointer;z-index:10;backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center">&rsaquo;</button>
    <div class="zp-lb-main"><img id="zpLbImg" src="${esc(imgs[0])}" alt=""></div>
  </div>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(prop.titulo||'Propiedad')} | INMUHUB.COM</title>
<meta name="description" content="${esc((cleanDesc||prop.titulo||'Propiedad en Guatemala').substring(0,160))}">
<link rel="canonical" href="https://inmuhub.com/propiedades/${esc(prop.slug||'')}.html">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(prop.titulo||'Propiedad')} | INMUHUB.COM">
<meta property="og:description" content="${esc((cleanDesc||prop.titulo||'').substring(0,160))}">
<meta property="og:url" content="https://inmuhub.com/propiedades/${esc(prop.slug||'')}.html">
<meta property="og:image" content="${esc(prop.mainImage||'')}">
<meta property="og:locale" content="es_GT">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="preload" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.27.0/dist/tabler-icons.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.27.0/dist/tabler-icons.min.css"></noscript>
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fff;color:#1a1a1a;font-size:15px;line-height:1.6}
a{text-decoration:none;color:inherit}
img{max-width:100%;display:block}

/* GALLERY */
.zp-gal{display:grid;grid-template-columns:1fr 1fr;gap:4px;height:480px;margin-bottom:0;background:#000;position:relative;z-index:2;overflow:hidden}
.zp-gal-main{overflow:hidden}
.zp-gal-main img{width:100%;height:100%;object-fit:cover;cursor:pointer;transition:transform .4s}
.zp-gal-main img:hover{transform:scale(1.02)}
.zp-gal-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:4px;overflow:hidden}
.zp-gal-cell{overflow:hidden;position:relative}
.zp-gal-cell img{width:100%;height:100%;object-fit:cover;cursor:pointer;transition:transform .4s}
.zp-gal-cell img:hover{transform:scale(1.02)}
.zp-gal-last{position:relative}
.zp-gal-all{position:absolute;bottom:14px;right:14px;background:rgba(255,255,255,.95);border:1.5px solid #ddd;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;color:#1a1a1a;backdrop-filter:blur(4px)}
.zp-gal-all:hover{background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.15)}
@media(max-width:700px){
  .zp-gal{display:none}
}
/* MOBILE CAROUSEL */
.zp-mob-gal{display:none;position:relative;height:280px;overflow:hidden;background:#000}
@media(max-width:700px){.zp-mob-gal{display:block}}
.zp-mob-track{display:flex;height:100%;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.zp-mob-track::-webkit-scrollbar{display:none}
.zp-mob-slide{flex:0 0 100%;height:100%;scroll-snap-align:start;overflow:hidden}
.zp-mob-slide img{width:100%;height:100%;object-fit:cover}
.zp-mob-counter{position:absolute;top:12px;right:14px;background:rgba(0,0,0,.55);color:#fff;font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;backdrop-filter:blur(4px)}
.zp-mob-dots{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:5px}
.zp-mob-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.45);transition:background .2s}
.zp-mob-dot.active{background:#fff}

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

/* SPECS CARDS */
.zp-specs{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px;margin:24px 0}
.zp-spec{display:flex;flex-direction:column;align-items:center;text-align:center;padding:18px 10px;background:#f8f9fb;border-radius:14px;border:1px solid #eef0f4;transition:box-shadow .2s,transform .2s;gap:6px}
.zp-spec:hover{box-shadow:0 4px 16px rgba(26,58,92,.1);transform:translateY(-2px)}
.zp-spec i{font-size:26px;color:#1a3a5c;margin-bottom:2px}
.zp-spec strong{font-size:17px;font-weight:800;color:#111;line-height:1}
.zp-spec span{color:#999;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
@media(max-width:500px){.zp-specs{grid-template-columns:repeat(3,1fr);gap:8px}.zp-spec{padding:14px 6px}}

/* SECTIONS */
.zp-section{margin-bottom:36px}
.zp-section-title{font-size:17px;font-weight:700;color:#111;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #f0f0f0}

/* DESCRIPTION */
.zp-desc-para{display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px solid #f5f5f5}
.zp-desc-para:last-of-type{border-bottom:none}
.zp-desc-icon{width:36px;height:36px;border-radius:10px;background:#f0f4fa;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
.zp-desc-icon i{font-size:18px;color:#1a3a5c}
.zp-desc-para p{color:#3a3a3a;font-size:15px;line-height:1.75;margin:0}
.zp-desc-more .zp-desc-para{display:flex}
.zp-link-btn{background:none;border:none;cursor:pointer;color:#1a3a5c;font-size:14px;font-weight:600;padding:8px 0 0;display:flex;align-items:center;gap:4px}
.zp-link-btn:hover{text-decoration:underline}

/* FEATURES */
.zp-feat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.zp-feat-item{display:flex;align-items:center;gap:10px;font-size:14px;color:#2a2a2a;padding:10px 14px;background:#fafafa;border-radius:10px;border:1px solid #f0f0f0;transition:background .15s}
.zp-feat-item:hover{background:#f0f4fa}
.zp-feat-item i{font-size:18px;color:#1a3a5c;flex-shrink:0;width:22px;text-align:center}

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

${mobGalHTML}${galHTML}

<div class="zp-body">

  <!-- MAIN -->
  <div class="zp-main">

    <nav class="zp-breadcrumb" style="font-size:12px;color:#94a3b8;margin-bottom:12px;display:flex;align-items:center;gap:4px;flex-wrap:wrap"><a href="/" style="color:#94a3b8;text-decoration:none">Inicio</a><span style="color:#cbd5e1"> / </span><a href="/propiedades.html" style="color:#94a3b8;text-decoration:none">Propiedades</a><span style="color:#cbd5e1"> / </span><span style="color:#64748b">${esc((prop.titulo||'Propiedad').substring(0,50))}</span></nav>
    <div class="zp-loc"><i class="ti ti-map-pin"></i>${locStr||esc(prop.zona||'Guatemala')}</div>
    <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#94a3b8;margin-top:6px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg><span id="zpViewCount">0</span> vistas</div>
    <script>(function(){var k="zpViews_${prop.slug}";var c=parseInt(localStorage.getItem(k)||"0")+1;localStorage.setItem(k,String(c));document.getElementById("zpViewCount").textContent=c;})()</script>


    <div class="zp-badges">${cintaHTML}${exclHTML}</div>

    <h1 class="zp-title">${esc(prop.titulo||'Propiedad')}</h1>

    ${precioStr ? `<div class="zp-price">${dp.main}</div>${dp.sub ? '<div style="font-size:.85rem;color:#64748b;margin-bottom:2px">'+dp.sub+'</div>' : ''}<div class="zp-price-sub">${esc(operStr)}</div>` : ''}

    ${specsHTML ? `<div class="zp-specs">${specsHTML}</div>` : ''}

    ${prop.priceNumeric > 0 ? '<a href="/herramientas/calculadora-hipotecaria.html" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:#f0f4fa;border:1.5px solid #e2e8f0;border-radius:10px;font-size:.8rem;font-weight:600;color:#1a3a5c;text-decoration:none;margin-bottom:24px"><i class="ti ti-calculator" style="font-size:18px"></i> Calcular cuota hipotecaria</a>' : ''}

    ${(prop.hook && prop.hook.trim()) ? `<div class="zp-section"><div style="padding:16px 20px;border-left:3px solid var(--gold,#C9A96E);background:rgba(201,169,110,.06);border-radius:0 8px 8px 0"><div style="font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:300;line-height:1.8;font-style:italic;color:#334155">&ldquo;${esc(prop.hook)}&rdquo;</div></div></div>` : ''}

    ${descHTML ? `<div class="zp-section">
      <h2 class="zp-section-title">Descripción</h2>
      <div class="zp-desc">${descHTML}</div>
    </div>` : ''}

    ${(prop.descBloques && Array.isArray(prop.descBloques) && prop.descBloques.length > 0) ? `<div class="zp-section">
      ${!descHTML ? '<h2 class="zp-section-title">Descripci\u00f3n</h2>' : ''}
      <div class="zp-desc">${renderDescBloques(prop.descBloques)}</div>
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
      ${(prop.lat && prop.lng) || prop.googleMapsUrl ? '<a href="' + (prop.googleMapsUrl || 'https://www.google.com/maps?q='+prop.lat+','+prop.lng) + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;margin-top:12px;padding:10px 18px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:.8rem;font-weight:600;color:#1a3a5c;text-decoration:none"><i class="ti ti-external-link" style="font-size:16px"></i> Abrir en Google Maps</a>' : ''}
    </div>` : ''}


    ${(function(){
      if(!allProps||!allProps.length) return '';
      var similar = allProps.filter(function(s){
        return s.slug !== prop.slug && (s.tipo === prop.tipo || s.municipio === prop.municipio);
      }).sort(function(a,b){
        var scoreA = (a.tipo===prop.tipo?2:0) + (a.municipio===prop.municipio?1:0);
        var scoreB = (b.tipo===prop.tipo?2:0) + (b.municipio===prop.municipio?1:0);
        return scoreB - scoreA;
      }).slice(0,3);
      if(!similar.length) return '';
      return '<div class="zp-section"><h2 class="zp-section-title">Propiedades similares</h2><div class="zp-similar" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">'+similar.map(function(s){
        var img = s.mainImageThumb||'';
        var price = s.priceFormatted||'Consultar';
        return '<a href="/propiedades/'+esc(s.slug)+'.html" style="background:#fff;border:1.5px solid #eef0f3;border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;transition:all .3s" onmouseover="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 12px 30px rgba(0,0,0,.1)\'" onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'none\'"><div style="aspect-ratio:4/3;overflow:hidden"><img src="'+esc(img)+'" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div><div style="padding:14px 16px"><div style="font-size:.95rem;font-weight:700;color:#C9A96E;margin-bottom:4px">'+esc(price)+'</div><div style="font-size:.82rem;font-weight:600;color:#111;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden">'+esc(s.title||s.titulo||'')+'</div><div style="font-size:.72rem;color:#64748b">'+esc(s.locationFull||s.zona||'')+'</div></div></a>';
      }).join('')+'</div></div>';
    })()}

  </div>

  <!-- SIDEBAR -->
  <div class="zp-side">
    <div class="zp-card">
      ${precioStr ? `<div class="zp-card-price">${dp.sidebar}</div>${dp.sidebarSub ? '<div style="font-size:.8rem;color:#94a3b8;margin-bottom:2px">'+dp.sidebarSub+'</div>' : ''}<div class="zp-card-op">${esc(operStr)}</div>` : ''}

      <div class="zp-avail"><span class="dot"></span>Disponible</div>

      <div class="zp-share-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <a href="https://wa.me/?text=${encodeURIComponent(prop.titulo+'\n'+propUrl)}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border:1.5px solid #25D366;border-radius:10px;font-size:13px;font-weight:600;color:#25D366;text-decoration:none;transition:all .2s" onmouseover="this.style.background='#25D366';this.style.color='#fff'" onmouseout="this.style.background='transparent';this.style.color='#25D366'"><i class="ti ti-brand-whatsapp"></i> WhatsApp</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propUrl)}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border:1.5px solid #1877F2;border-radius:10px;font-size:13px;font-weight:600;color:#1877F2;text-decoration:none;transition:all .2s" onmouseover="this.style.background='#1877F2';this.style.color='#fff'" onmouseout="this.style.background='transparent';this.style.color='#1877F2'"><i class="ti ti-brand-facebook"></i> Facebook</a>
      </div>
      <button class="zp-share-btn" onclick="navigator.clipboard.writeText(location.href).then(function(){var b=event.target.closest('.zp-share-btn');b.innerHTML='<i class=\'ti ti-check\'></i> Copiado';setTimeout(function(){b.innerHTML='<i class=\'ti ti-link\'></i> Copiar enlace'},2000)})">
        <i class="ti ti-link"></i> Copiar enlace
      </button>

      ${prop.pdfUrl ? '<a href="' + esc(prop.pdfUrl) + '" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:11px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;font-weight:600;color:#444;text-decoration:none;margin-top:8px"><i class="ti ti-file-download"></i> Descargar brochure</a>' : ''}

      <hr class="zp-divider">

      ${prop.codigo ? `<div class="zp-code">Código <span>${esc(prop.codigo)}</span></div>` : ''}

      ${(prop.iusi || prop.cuotaMantenimiento) ? `<div style="border-top:1px solid #eef0f3;padding-top:14px;margin-top:14px">
        ${prop.iusi ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:.78rem;color:#64748b">IUSI</span><span style="font-size:.82rem;font-weight:600;color:#0a1628">${esc(prop.iusi)}</span></div>` : ''}
        ${prop.cuotaMantenimiento ? `<div style="display:flex;justify-content:space-between"><span style="font-size:.78rem;color:#64748b">Mantenimiento</span><span style="font-size:.82rem;font-weight:600;color:#0a1628">${esc(prop.cuotaMantenimiento)}</span></div>` : ''}
      </div>` : ''}

      ${(prop.iusi || prop.cuotaMantenimiento) ? `<div style="border-top:1px solid #eef0f3;padding-top:14px;margin-top:14px">
        ${prop.iusi ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:.78rem;color:#64748b">IUSI</span><span style="font-size:.82rem;font-weight:600;color:#0a1628">${esc(prop.iusi)}</span></div>` : ''}
        ${prop.cuotaMantenimiento ? `<div style="display:flex;justify-content:space-between"><span style="font-size:.78rem;color:#64748b">Mantenimiento</span><span style="font-size:.82rem;font-weight:600;color:#0a1628">${esc(prop.cuotaMantenimiento)}</span></div>` : ''}
      </div>` : ''}

      ${planoHTML}


      <hr class="zp-divider">
      <div class="zp-contact-form" id="zpContactForm">
        <h3 style="font-size:14px;font-weight:700;color:#0a1628;margin-bottom:14px;display:flex;align-items:center;gap:8px"><i class="ti ti-mail" style="color:#C9A96E"></i> Contactar al asesor</h3>
        <div style="margin-bottom:10px"><input type="text" id="zpCName" placeholder="Tu nombre" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;font-family:inherit;box-sizing:border-box"></div>
        <div style="margin-bottom:10px"><input type="email" id="zpCEmail" placeholder="Tu email" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;font-family:inherit;box-sizing:border-box"></div>
        <div style="margin-bottom:10px"><input type="tel" id="zpCPhone" placeholder="Tu teléfono (opcional)" style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;font-family:inherit;box-sizing:border-box"></div>
        <div style="margin-bottom:12px"><textarea id="zpCMsg" rows="3" placeholder="Me interesa esta propiedad..." style="width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;font-family:inherit;resize:vertical;box-sizing:border-box"></textarea></div>
        <button onclick="zpSendMsg()" id="zpCBtn" style="width:100%;padding:12px;background:#1a3a5c;color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s">Enviar mensaje</button>
        <div id="zpCResult" style="margin-top:10px;font-size:13px;display:none"></div>
      </div>
      <p class="zp-meta">inmuhub.com — Real Estate Guatemala</p>
    </div>
  </div>

</div>

${lightboxHTML}

<script>
var zpLbIdx=0;var zpLbImgs=[];
function zpLbPrev(){zpLbIdx=(zpLbIdx-1+zpLbImgs.length)%zpLbImgs.length;zpLbShow(zpLbIdx);}
function zpLbNext(){zpLbIdx=(zpLbIdx+1)%zpLbImgs.length;zpLbShow(zpLbIdx);}
document.addEventListener("keydown",function(e){var lb=document.getElementById("zpLb");if(!lb||lb.style.display==="none")return;if(e.key==="ArrowLeft")zpLbPrev();if(e.key==="ArrowRight")zpLbNext();if(e.key==="Escape"){lb.classList.remove("open");lb.style.display="none";}});
function zpOpenGallery(){zpLbImgs=${JSON.stringify(imgs)}; var lb=document.getElementById('zpLb'); lb.classList.add('open'); lb.style.display='flex'; }
function zpLbShow(i){zpLbIdx=i; var imgs=${JSON.stringify(imgs)}; document.getElementById('zpLbImg').src=imgs[i]; document.querySelectorAll('.zp-lb-thumb').forEach(function(t,j){t.classList.toggle('active',i===j);}); }
function zpToggleDesc(){ var m=document.getElementById('zpDescMore'); var open=m.style.display!=='none'; m.style.display=open?'none':'block'; document.getElementById('zpDescLbl').innerHTML=open?'Ver descripción completa <i class=\"ti ti-chevron-down\"></i>':'Ver menos <i class=\"ti ti-chevron-up\"></i>'; }
document.querySelectorAll('.zp-gal-main img,.zp-gal-cell img').forEach(function(img,i){ img.addEventListener('click',function(){ zpOpenGallery(); zpLbShow(i); }); });
(function(){
  var track=document.getElementById('zpMobTrack');
  if(!track) return;
  var total=${imgs.length};
  track.addEventListener('scroll',function(){
    var idx=Math.round(track.scrollLeft/track.offsetWidth);
    document.getElementById('zpMobCounter').textContent=(idx+1)+' / '+total;
    for(var i=0;i<total;i++){var d=document.getElementById('zpDot'+i);if(d)d.classList.toggle('active',i===idx);}
  });
  track.querySelectorAll('img').forEach(function(img,i){img.addEventListener('click',function(){zpOpenGallery();zpLbShow(i);});});
})();
</script>
<script type="application/ld+json">${schemaListing}</script>
<script type="application/ld+json">${schemaBreadcrumb}</script>
<script>
function zpSendMsg(){
  var btn=document.getElementById('zpCBtn');
  var res=document.getElementById('zpCResult');
  var name=document.getElementById('zpCName').value.trim();
  var email=document.getElementById('zpCEmail').value.trim();
  var phone=document.getElementById('zpCPhone').value.trim();
  var msg=document.getElementById('zpCMsg').value.trim();
  if(!name||!email||!msg){res.style.display='block';res.style.color='#991b1b';res.textContent='Completa nombre, email y mensaje';return;}
  btn.disabled=true;btn.textContent='Enviando...';
  fetch('https://zona-inmu.tours-virtuales-gt.workers.dev/api/messages',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({broker_id:'${esc(prop.broker_id||"")}',propiedad_id:'${esc(prop.slug||prop.id||"")}',propiedad_titulo:'${esc(prop.titulo||"")}',nombre:name,email:email,telefono:phone,mensaje:msg})
  }).then(function(r){return r.json()}).then(function(d){
    if(d.ok){res.style.display='block';res.style.color='#166534';res.textContent='Mensaje enviado. El asesor te contactará pronto.';btn.textContent='Enviado';document.getElementById('zpCName').value='';document.getElementById('zpCEmail').value='';document.getElementById('zpCMsg').value='';document.getElementById('zpCPhone').value='';}
    else{res.style.display='block';res.style.color='#991b1b';res.textContent=d.error||'Error al enviar';btn.disabled=false;btn.textContent='Enviar mensaje';}
  }).catch(function(){res.style.display='block';res.style.color='#991b1b';res.textContent='Error de conexión';btn.disabled=false;btn.textContent='Enviar mensaje';});
}
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

function slugZona(z){z=String(z||'');return z.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}

function tipoPage(tipo, props) {
var tipoSlug = tipo.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
var propsDelTipo = props.filter(function(p){ return (p.tipo||'').toLowerCase() === tipo.toLowerCase(); });
var precios = propsDelTipo.map(function(p){ return p.priceNumeric; }).filter(function(n){ return n > 0; });
var precioMin = precios.length ? Math.min.apply(null, precios) : 0;
var precioMax = precios.length ? Math.max.apply(null, precios) : 0;
var rangoPrecios = precioMin && precioMax ? '$' + precioMin.toLocaleString('en-US') + ' - $' + precioMax.toLocaleString('en-US') : '';
var zonasDelTipo = [].concat(new Set(propsDelTipo.map(function(p){ return p.municipio; }).filter(Boolean)));
// deduplicate
var zonasUniq = [];
zonasDelTipo.forEach(function(z){ if(zonasUniq.indexOf(z)===-1) zonasUniq.push(z); });

var body = '<div style="background:var(--gray-900);padding:48px 6%;color:var(--white)">' +
'<div style="font-size:12px;color:rgba(255,255,255,.5);margin-bottom:12px"><a href="/" style="color:rgba(255,255,255,.5)">Inicio</a> / <a href="/propiedades.html" style="color:rgba(255,255,255,.5)">Propiedades</a> / ' + escapeHtml(tipo) + '</div>' +
'<h1 style="font-size:clamp(28px,4vw,42px);font-weight:800;margin-bottom:12px">' + escapeHtml(tipo) + ' en Venta en <span style="color:var(--gold)">Guatemala</span></h1>' +
'<p style="color:rgba(255,255,255,.65);font-size:16px;max-width:600px;line-height:1.7">' + propsDelTipo.length + ' ' + tipo.toLowerCase() + (propsDelTipo.length!==1?'s':'') + ' disponible' + (propsDelTipo.length!==1?'s':'') + ' con precios verificados.' + (rangoPrecios ? ' Desde ' + rangoPrecios + '.' : '') + '</p>' +
(zonasUniq.length ? '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:20px">' +
  zonasUniq.map(function(z){ var zSlug = slugZona(z); return '<a href="/zonas/' + zSlug + '.html" style="background:rgba(201,169,110,.15);color:var(--gold);border:1px solid rgba(201,169,110,.3);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;text-decoration:none">' + escapeHtml(z) + '</a>'; }).join('') +
  '</div>' : '') +
'</div>' +
'<div class="prop-grid" style="padding:32px 6%">' + propsDelTipo.map(function(p){ return card(p); }).join('') + '</div>' +
'<div style="padding:40px 6%;background:var(--gray-50);text-align:center;border-top:1px solid var(--border)">' +
'<p style="color:var(--gray-600);margin-bottom:16px">Ver todas las propiedades disponibles</p>' +
'<a href="/propiedades.html" style="background:var(--blue);color:var(--white);padding:10px 28px;border-radius:6px;font-weight:600;display:inline-block">Ver catalogo completo</a>' +
'</div>';

var schemaBreadcrumb = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type':'ListItem', 'position':1, 'name':'Inicio', 'item':'https://inmuhub.com/' },
    { '@type':'ListItem', 'position':2, 'name':'Propiedades', 'item':'https://inmuhub.com/propiedades.html' },
    { '@type':'ListItem', 'position':3, 'name': tipo + ' en Guatemala' }
  ]
});

return layout({
  title: tipo + ' en Venta en Guatemala — Precios Verificados',
  desc: propsDelTipo.length + ' ' + tipo.toLowerCase() + (propsDelTipo.length!==1?'s':'') + ' en venta en Guatemala. ' + (rangoPrecios ? 'Desde ' + rangoPrecios + '. ' : '') + 'Precios verificados y actualizados en INMUHUB.',
  canonical: '/tipos/' + tipoSlug + '.html',
  body: body,
  scripts: '<script type="application/ld+json">' + schemaBreadcrumb + '<\/script>'
});
}

module.exports = { indexPage, catalogPage, zonaPage, detailPage, mortgageCalcPage, investmentSimulatorPage, guiaCompraPage, tipoPage };

// Función helper para generar calculadora inline
function generateCalculator(prop) {
  const price = parseFloat(prop.priceNumeric || 0);
  const down = Math.round(price * 0.2);
  return `<section style="padding:48px 6%;background:#f9fafb;border-top:1px solid #e5e7eb"><div style="max-width:1200px;margin:0 auto"><h3 style="font-size:28px;font-weight:700;color:#1a2a4e;margin-bottom:40px;text-align:center">Calculadora Hipotecaria</h3><div style="background:white;border-radius:16px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08)"><div style="margin-bottom:32px;padding:24px;background:#e3f2fd;border-radius:12px"><p style="font-size:14px;color:#1a2a4e;font-weight:600;margin:0">Precio de esta propiedad:</p><p style="font-size:32px;font-weight:700;color:#1a2a4e;margin:8px 0 0 0">Q ${price.toLocaleString('es-GT')}</p></div><div style="margin-bottom:32px;padding:24px;background:#fff3e0;border-radius:12px"><label style="font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Cuota Inicial (20%): Q <span id="downPaymentDisplay">${down.toLocaleString('es-GT')}</span></label><input type="number" id="downPayment" value="${down}" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box"></div><div style="margin-bottom:32px"><label style="font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Plazo: <span id="termDisplay">20</span> años</label><input type="range" id="term" min="5" max="30" value="20" style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;cursor:pointer"></div><div style="margin-bottom:40px"><label style="font-weight:600;color:#1a2a4e;margin-bottom:12px;font-size:14px">Tasa: <span id="rateDisplay">7.5</span>%</label><input type="range" id="rate" min="3" max="12" step="0.1" value="7.5" style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;cursor:pointer"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:40px"><div style="background:linear-gradient(135deg,#ffa500 0%,#ff8c00 100%);border-radius:12px;padding:32px;color:white"><p style="font-size:12px;opacity:0.9;margin-bottom:8px">Cuota Inicial</p><p style="font-size:32px;font-weight:700;margin:0" id="summaryDown">Q ${down.toLocaleString('es-GT')}</p><p style="font-size:12px;opacity:0.8;margin-top:12px;border-top:1px solid rgba(255,255,255,0.2);padding-top:12px;margin-bottom:0">Monto a Financiar: <strong id="loanAmount">Q ${Math.round(price*0.8).toLocaleString('es-GT')}</strong></p></div><div style="background:linear-gradient(135deg,#1a2a4e 0%,#2d4069 100%);border-radius:12px;padding:32px;color:white"><p style="font-size:12px;opacity:0.8;margin-bottom:8px">Cuota Mensual</p><p style="font-size:32px;font-weight:700;color:#ffa500;margin:0" id="monthlyPayment">Q 0</p><p style="font-size:12px;opacity:0.8;margin-top:12px;border-top:1px solid rgba(255,255,255,0.2);padding-top:12px;margin-bottom:0">Total a Pagar: <strong id="totalPayment">Q 0</strong></p></div></div><div style="text-align:center"><a href="/propiedades.html" style="display:inline-block;background:#1a2a4e;color:white;padding:16px 48px;border-radius:8px;font-weight:600;text-decoration:none">Ver mÃ¡s propiedades â†’</a></div></div></div></section><script>const PROP_PRICE=${price};const down=document.getElementById('downPayment');const term=document.getElementById('term');const rate=document.getElementById('rate');function fmt(n){return n.toLocaleString('es-GT')}function calc(){const downPay=parseFloat(down.value);const principal=PROP_PRICE-downPay;const r=parseFloat(rate.value)/100/12;const n=parseFloat(term.value)*12;const monthly=principal>0?(principal*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1):0;document.getElementById('downPaymentDisplay').textContent=fmt(Math.round(downPay));document.getElementById('summaryDown').textContent='Q '+fmt(Math.round(downPay));document.getElementById('loanAmount').textContent='Q '+fmt(Math.round(principal));document.getElementById('monthlyPayment').textContent='Q '+fmt(Math.round(monthly));document.getElementById('totalPayment').textContent='Q '+fmt(Math.round(monthly*n*12));}down.addEventListener('input',calc);term.addEventListener('input',calc);rate.addEventListener('input',calc);calc();<\/script>`;
}
