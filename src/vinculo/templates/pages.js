const { layout } = require('./layout');
const { card } = require('./card');
const { escapeHtml, uniqueValues } = require('../../shared/utils');

function indexPage(props) {
const featured = props.slice(0, 9);
const zonas = [...new Set(props.map(p=>p.municipio).filter(Boolean))].slice(0,6);
const zonasHTML = zonas.map(z => {
  const slug = z.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const count = props.filter(p=>p.municipio===z).length;
  return `<a href="/zonas/${slug}.html" style="display:inline-flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--border);border-radius:8px;padding:10px 18px;font-size:14px;font-weight:500;color:var(--gray-900);transition:all .2s" onmouseover="this.style.borderColor='var(--gold)';this.style.color='var(--gold)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--gray-900)'">\u{1F4CD} ${z} <span style="color:var(--text-muted);font-size:12px">(${count})</span></a>`;
}).join('');
const body = `
<section class="hero-new">
  <div class="hero-tag">\u{1F947} Portal inmobiliario premium</div>
  <h1>Las mejores propiedades<br><span>en Guatemala</span></h1>
  <p>Donde las oportunidades inmobiliarias se conectan. Casas, apartamentos, fincas y terrenos verificados en las mejores zonas.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;max-width:800px;margin:0 auto">
    <a href="/herramientas/valuador.html" style="background:var(--white);color:var(--gray-900);padding:16px;border-radius:8px;font-weight:600;text-align:center;text-decoration:none;transition:all .2s;border:2px solid var(--white)" onmouseover="this.style.borderColor='var(--gold)';this.style.background='var(--gold)';this.style.color='var(--white)'" onmouseout="this.style.borderColor='var(--white)';this.style.background='var(--white)';this.style.color='var(--gray-900)'">🏠 Valuador</a>
    <a href="/herramientas/calculadora-hipotecaria.html" style="background:var(--white);color:var(--gray-900);padding:16px;border-radius:8px;font-weight:600;text-align:center;text-decoration:none;transition:all .2s;border:2px solid var(--white)" onmouseover="this.style.borderColor='var(--gold)';this.style.background='var(--gold)';this.style.color='var(--white)'" onmouseout="this.style.borderColor='var(--white)';this.style.background='var(--white)';this.style.color='var(--gray-900)'">🧮 Calculadora</a>
    <a href="/herramientas/simulador-inversion.html" style="background:var(--white);color:var(--gray-900);padding:16px;border-radius:8px;font-weight:600;text-align:center;text-decoration:none;transition:all .2s;border:2px solid var(--white)" onmouseover="this.style.borderColor='var(--gold)';this.style.background='var(--gold)';this.style.color='var(--white)'" onmouseout="this.style.borderColor='var(--white)';this.style.background='var(--white)';this.style.color='var(--gray-900)'">📈 Simulador</a>
    <a href="/herramientas/guia-compra.html" style="background:var(--white);color:var(--gray-900);padding:16px;border-radius:8px;font-weight:600;text-align:center;text-decoration:none;transition:all .2s;border:2px solid var(--white)" onmouseover="this.style.borderColor='var(--gold)';this.style.background='var(--gold)';this.style.color='var(--white)'" onmouseout="this.style.borderColor='var(--white)';this.style.background='var(--white)';this.style.color='var(--gray-900)'">📚 Guía</a>
    <a href="/herramientas/dashboard-inversionistas.html" style="background:var(--gold);color:var(--white);padding:16px;border-radius:8px;font-weight:600;text-align:center;text-decoration:none;transition:all .2s;border:2px solid var(--gold)" onmouseover="this.style.background='var(--gray-900)'" onmouseout="this.style.background='var(--gold)'">💼 Inversionistas</a>
  </div>
</section>
<section style="padding:32px 6%;background:var(--gray-50);border-bottom:1px solid var(--border)">
<div style="margin-bottom:16px"><h2 style="font-size:18px;font-weight:700;color:var(--gray-900)">Explorar por zona</h2></div>
<div style="display:flex;flex-wrap:wrap;gap:10px">${zonasHTML}</div>
</section>
<section style="padding:40px 6%;text-align:center">
<div style="margin-bottom:32px">
<h2 style="font-size:24px;font-weight:700;margin-bottom:8px;color:var(--gray-900)">Propiedades destacadas</h2>
<p style="color:var(--gray-600)">Seleccionadas en las mejores zonas de Guatemala</p>
</div>
<div class="prop-grid">${featured.map(p=>card(p)).join('')}</div>
<div style="margin-top:40px">
<a href="/propiedades.html" style="background:var(--blue);color:var(--white);padding:12px 32px;border-radius:6px;font-weight:600;display:inline-block;transition:opacity .2s" onmouseover="this.style.opacity='.9'" onmouseout="this.style.opacity='1'">Explorar todas las propiedades \u2192</a>
</div>
</section>`;
return layout({ title: null, desc: `Casas, apartamentos, fincas y terrenos en Guatemala. ${props.length} propiedades en Zona 10, Zona 14, Cayala, Fraijanes y mas.`, canonical: '/', body, scripts: `<script>
(async function() {
  try {
    var ts = parseInt(localStorage.getItem('kv_ts')||'0');
    var props = Date.now()-ts<60000 ? JSON.parse(localStorage.getItem('kv_props')||'null') : null;
    if (!props) {
      var res = await fetch('https://zona-inmu.tours-virtuales-gt.workers.dev/api/public/propiedades');
      props = await res.json();
      try { localStorage.setItem('kv_props',JSON.stringify(props)); localStorage.setItem('kv_ts',Date.now().toString()); } catch(e){}
    }
    document.querySelectorAll('p').forEach(function(el){
      if(el.textContent.match(/\d+ propiedades/)) el.textContent = el.textContent.replace(/\d+/, props.length);
    });
  } catch(e) { console.warn('[KV Home]', e.message); }
})();
</script>` });
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
return layout({ title: 'Propiedades en Guatemala', desc: 'Catalogo completo de casas, apartamentos, fincas y terrenos en Guatemala. Filtra por zona, tipo y precio. INMUHUB.COM', canonical: '/propiedades.html', body, scripts: `
<script src="https://zona-inmu.tours-virtuales-gt.workers.dev/dynamic-grid.js"><\/script>` });
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
const galleryHTML=gallery.length>0?`<div class="gallery-thumbs">${gallery.map(img=>`<button onclick="document.getElementById('mainImg').src='${escapeHtml(img)}'" title="Ver imagen"><img src="${escapeHtml(img)}" alt="${escapeHtml(prop.title)} - foto galeria" loading="lazy" width="400" height="300"></button>`).join('')}</div>`:'';
const specHTML=`${prop.habitaciones&&prop.habitaciones!=='0'?`<div class="spec"><div class="spec-value">${prop.habitaciones}</div><div class="spec-label">Habitaciones</div></div>`:''}${prop.banos&&prop.banos!=='0'?`<div class="spec"><div class="spec-value">${prop.banos}</div><div class="spec-label">Banos</div></div>`:''}${prop.areaConst?`<div class="spec"><div class="spec-value">${prop.areaConst}</div><div class="spec-label">m2 Construccion</div></div>`:''}`;
const descHTML=prop.description?`<div class="description"><h2>Descripcion</h2><p>${escapeHtml(prop.description)}</p></div>`:'';
const infoHTML=`<div class="info-item"><span class="label">Ubicacion</span><span class="value">${escapeHtml(prop.locationFull)}</span></div>${prop.codigoInmueble?`<div class="info-item"><span class="label">Codigo</span><span class="value">${escapeHtml(prop.codigoInmueble)}</span></div>`:''}${prop.tipo?`<div class="info-item"><span class="label">Tipo</span><span class="value">${escapeHtml(prop.tipo)}</span></div>`:''}`;
const body=`<div class="detail-container"><div style="margin-bottom:32px"><div class="breadcrumb"><a href="/">Home</a> / <a href="/propiedades.html?tipo=${encodeURIComponent(prop.tipo)}">${escapeHtml(prop.tipo)}s</a> / <span>${escapeHtml(prop.title)}</span></div></div><div class="detail-gallery"><div class="gallery-main"><img id="mainImg" src="${escapeHtml(prop.mainImageThumb||'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=70')}" alt="${escapeHtml(prop.tipo||'Propiedad')} ${escapeHtml(prop.title)} en ${escapeHtml(prop.locationFull)} - INMUHUB.COM" loading="eager" width="800" height="500"></div>${galleryHTML}</div><div class="detail-content"><h1>${escapeHtml(prop.title)}</h1><div class="detail-price">${escapeHtml(prop.priceFormatted)}</div><div class="specs-grid">${specHTML}</div>${descHTML}<div class="info-card">${infoHTML}</div>` + `` + `<section style="padding:48px 6%;background:white">
<div style="max-width:1200px;margin:0 auto">
<h3 style="font-size:28px;font-weight:700;color:#1a2a4e;margin-bottom:40px;text-align:center">Herramientas para Invertir</h3>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px">
<a href="/herramientas/valuador.html" style="background:white;border:2px solid #e5e7eb;border-radius:16px;padding:40px;text-align:center;transition:all 0.3s;text-decoration:none;color:inherit;display:flex;flex-direction:column;align-items:center">
<div style="font-size:48px;margin-bottom:20px">🏠</div>
<h4 style="font-weight:700;margin-bottom:12px;color:#1a2a4e;font-size:18px">Valuador de Propiedades</h4>
<p style="font-size:14px;color:#666;line-height:1.6;flex-grow:1">Calcula el valor estimado de tu propiedad en Guatemala</p>
<div style="margin-top:20px;color:#1a2a4e;font-weight:600;font-size:14px">Ir a Valuador →</div>
</a>
<a href="/herramientas/simulador-inversion.html" style="background:white;border:2px solid #e5e7eb;border-radius:16px;padding:40px;text-align:center;transition:all 0.3s;text-decoration:none;color:inherit;display:flex;flex-direction:column;align-items:center">
<div style="font-size:48px;margin-bottom:20px">📈</div>
<h4 style="font-weight:700;margin-bottom:12px;color:#1a2a4e;font-size:18px">Simulador de Inversión</h4>
<p style="font-size:14px;color:#666;line-height:1.6;flex-grow:1">Analiza el ROI y rentabilidad proyectada de cualquier propiedad</p>
<div style="margin-top:20px;color:#1a2a4e;font-weight:600;font-size:14px">Ir a Simulador →</div>
</a>
<a href="/herramientas/guia-compra.html" style="background:linear-gradient(135deg,#ffa500 0%,#ff8c00 100%);border-radius:16px;padding:40px;text-align:center;transition:all 0.3s;text-decoration:none;color:white;display:flex;flex-direction:column;align-items:center">
<div style="font-size:48px;margin-bottom:20px">📚</div>
<h4 style="font-weight:700;margin-bottom:12px;font-size:18px">Guía de Compra Gratis</h4>
<p style="font-size:14px;opacity:0.95;line-height:1.6;flex-grow:1">Descarga la guía premium para invertir en real estate sin errores</p>
<div style="margin-top:20px;font-weight:600;font-size:14px">Descargar →</div>
</a>
</div>
</div>
</section>` + + `</div>`;
const schema={"@context":"https://schema.org","@type":"RealEstateListing","name":prop.title,"description":prop.description||(prop.title+' en '+prop.locationFull),"url":'https://inmuhub.com/propiedades/'+prop.slug+'.html',"image":prop.mainImageThumb||'',"price":prop.priceFormatted||'',"address":{"@type":"PostalAddress","addressLocality":prop.municipio||'Guatemala',"addressRegion":prop.departamento||'Guatemala',"addressCountry":"GT"}};
if(prop.habitaciones&&prop.habitaciones!=='0')schema.numberOfRooms=parseInt(prop.habitaciones);
if(prop.areaConst)schema.floorSize={"@type":"QuantitativeValue","value":parseFloat(prop.areaConst),"unitCode":"MTK"};
const breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://inmuhub.com/"},{"@type":"ListItem","position":2,"name":"Propiedades","item":"https://inmuhub.com/propiedades.html"},{"@type":"ListItem","position":3,"name":prop.title,"item":'https://inmuhub.com/propiedades/'+prop.slug+'.html'}]};
const jsonLd='<script type="application/ld+json">'+JSON.stringify(schema)+'<\/script>\n<script type="application/ld+json">'+JSON.stringify(breadcrumb)+'<\/script>';
return layout({title:prop.title,desc:prop.title+' - '+prop.locationFull+'. Precio: '+prop.priceFormatted,canonical:'/propiedades/'+prop.slug+'.html',ogImage:prop.mainImageThumb,scripts:jsonLd+`<script>
(async function() {
  try {
    var slug = location.pathname.split('/').pop().replace('.html','');
    var ts = parseInt(localStorage.getItem('kv_ts')||'0');
    var props = Date.now()-ts<60000 ? JSON.parse(localStorage.getItem('kv_props')||'null') : null;
    if (!props) {
      var res = await fetch('https://zona-inmu.tours-virtuales-gt.workers.dev/api/public/propiedades');
      props = await res.json();
      try { localStorage.setItem('kv_props',JSON.stringify(props)); localStorage.setItem('kv_ts',Date.now().toString()); } catch(e){}
    }
    var prop = props.find(function(p){ return p.slug===slug; });
    if (!prop) return;
    var h1 = document.querySelector('h1');
    if (h1 && prop.titulo) h1.textContent = prop.titulo;
    document.querySelectorAll('.detail-price').forEach(function(el){ if(prop.priceFormatted) el.textContent = prop.priceFormatted; });
    if (prop.titulo) document.title = prop.titulo + ' - InmuHub';
  } catch(e) { console.warn('[KV Detail]', e.message); }
})();
</script>`,body});
}

module.exports = { indexPage, catalogPage, zonaPage, detailPage, mortgageCalcPage, investmentSimulatorPage, guiaCompraPage };

const { mortgageCalculator } = require('./mortgage-calculator');
const { investmentSimulator } = require('./investment-simulator');
const { leadsMagnet } = require('./leads-magnet');

// Página: Calculadora Hipotecaria
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
