const { layout } = require('./layout');
const { card } = require('./card');
const { escapeHtml, uniqueValues } = require('../../shared/utils');

function indexPage(props) {
const featured = props.slice(0, 9);
const body = `
<section class="hero-new">
  <div class="hero-tag">🥇 Portal inmobiliario premium</div>
  <h1>Las mejores propiedades<br><span>en Guatemala</span></h1>
  <p>Donde las oportunidades inmobiliarias se conectan. Casas, apartamentos, fincas y terrenos verificados en las mejores zonas.</p>
  <div class="search-main">
    <input type="text" placeholder="Buscar por zona, tipo, precio...">
    <button>Buscar</button>
  </div>
</section>
<section style="padding:40px 6%;text-align:center">
<div style="margin-bottom:32px">
<h2 style="font-size:24px;font-weight:700;margin-bottom:8px;color:var(--gray-900)">Propiedades destacadas</h2>
<p style="color:var(--gray-600)">Seleccionadas en las mejores zonas de Guatemala</p>
</div>
<div class="prop-grid">${featured.map(p=>card(p)).join('')}</div>
<div style="margin-top:40px">
<a href="/propiedades.html" style="background:var(--blue);color:var(--white);padding:12px 32px;border-radius:6px;font-weight:600;display:inline-block;transition:opacity .2s" onmouseover="this.style.opacity='.9'" onmouseout="this.style.opacity='1'">Explorar todas las propiedades →</a>
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
<div style="background:var(--gray-50);padding:40px 6%;border-bottom:1px solid var(--border)">
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

function detailPage(prop) {
const gallery=(prop.gallery||[]).slice(0,8);
const galleryHTML=gallery.length>0?`<div class="gallery-thumbs">${gallery.map(img=>`<button onclick="document.getElementById('mainImg').src='${escapeHtml(img)}'" title="Ver imagen"><img src="${escapeHtml(img)}" alt="${escapeHtml(prop.title)} - foto galería" loading="lazy" width="400" height="300"></button>`).join('')}</div>`:'';
const specHTML=`${prop.habitaciones&&prop.habitaciones!=='0'?`<div class="spec"><div class="spec-value">${prop.habitaciones}</div><div class="spec-label">Habitaciones</div></div>`:''}${prop.banos&&prop.banos!=='0'?`<div class="spec"><div class="spec-value">${prop.banos}</div><div class="spec-label">Banos</div></div>`:''}${prop.areaConst?`<div class="spec"><div class="spec-value">${prop.areaConst}</div><div class="spec-label">m2 Construccion</div></div>`:''}`;
const descHTML=prop.description?`<div class="description"><h2>Descripcion</h2><p>${escapeHtml(prop.description)}</p></div>`:'';
const infoHTML=`<div class="info-item"><span class="label">Ubicacion</span><span class="value">${escapeHtml(prop.locationFull)}</span></div>${prop.codigoInmueble?`<div class="info-item"><span class="label">Codigo</span><span class="value">${escapeHtml(prop.codigoInmueble)}</span></div>`:''}${prop.tipo?`<div class="info-item"><span class="label">Tipo</span><span class="value">${escapeHtml(prop.tipo)}</span></div>`:''}`;
const body=`<div class="detail-container"><div style="margin-bottom:32px"><div class="breadcrumb"><a href="/">Home</a> / <a href="/propiedades.html?tipo=${encodeURIComponent(prop.tipo)}">${escapeHtml(prop.tipo)}s</a> / <span>${escapeHtml(prop.title)}</span></div></div><div class="detail-gallery"><div class="gallery-main"><img id="mainImg" src="${escapeHtml(prop.mainImageThumb||'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=70')}" alt="${escapeHtml(prop.title)}"></div>${galleryHTML}</div><div class="detail-content"><h1>${escapeHtml(prop.title)}</h1><div class="detail-price">${escapeHtml(prop.priceFormatted)}</div><div class="specs-grid">${specHTML}</div>${descHTML}<div class="info-card">${infoHTML}</div></div></div>`;
const schema={"@context":"https://schema.org","@type":"RealEstateListing","name":prop.title,"description":prop.description||(prop.title+' en '+prop.locationFull),"url":'https://inmuhub.com/propiedades/'+prop.slug+'.html',"image":prop.mainImageThumb||'',"price":prop.priceFormatted||'',"address":{"@type":"PostalAddress","addressLocality":prop.municipio||'Guatemala',"addressRegion":prop.departamento||'Guatemala',"addressCountry":"GT"}};
if(prop.habitaciones&&prop.habitaciones!=='0')schema.numberOfRooms=parseInt(prop.habitaciones);
if(prop.areaConst)schema.floorSize={"@type":"QuantitativeValue","value":parseFloat(prop.areaConst),"unitCode":"MTK"};
const breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://inmuhub.com/"},{"@type":"ListItem","position":2,"name":"Propiedades","item":"https://inmuhub.com/propiedades.html"},{"@type":"ListItem","position":3,"name":prop.title,"item":'https://inmuhub.com/propiedades/'+prop.slug+'.html'}]};
const jsonLd='<script type="application/ld+json">'+JSON.stringify(schema)+'<\/script>\n<script type="application/ld+json">'+JSON.stringify(breadcrumb)+'<\/script>';
return layout({title:prop.title,desc:prop.title+' - '+prop.locationFull+'. Precio: '+prop.priceFormatted,canonical:'/propiedades/'+prop.slug+'.html',ogImage:prop.mainImageThumb,scripts:jsonLd,body});
}

module.exports = { indexPage, catalogPage, detailPage };
