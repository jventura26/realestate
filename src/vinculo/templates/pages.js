const { layout } = require('./layout');
const { card } = require('./card');
const { escapeHtml, uniqueValues } = require('../../shared/utils');
const { heroSection } = require('../hero-section');

function indexPage(props) {
const featured = props.slice(0, 9);
const zonas = [...new Set(props.map(p=>p.municipio).filter(Boolean))].slice(0,6);
const zonasHTML = zonas.map(z => {
  const slug = z.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const count = props.filter(p=>p.municipio===z).length;
  return `<a href="/zonas/${slug}.html" style="display:inline-flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--border);border-radius:8px;padding:10px 18px;font-size:14px;font-weight:500;color:var(--gray-900);transition:all .2s" onmouseover="this.style.borderColor='var(--gold)';this.style.color='var(--gold)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--gray-900)'">\u{1F4CD} ${z} <span style="color:var(--text-muted);font-size:12px">(${count})</span></a>`;
}).join('');

const body = `
${heroSection()}
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

function zonaPage(props, zona) {
const tipos = uniqueValues(props, 'tipo');
const slug = zona.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
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
const specHTML=(()=>{const items=[];if(prop.habitaciones&&prop.habitaciones!=='0')items.push(`<li class="dspec-item"><svg width="16" height="14" viewBox="0 0 16 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="6" width="14" height="5.5" rx="1.5"/><path d="M1 6V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/><rect x="4" y="4" width="3" height="2" rx=".5"/></svg><span class="dspec-label">Habitaciones</span><strong class="dspec-val">${prop.habitaciones}</strong></li>`);if(prop.banos&&prop.banos!=='0')items.push(`<li class="dspec-item"><svg width="15" height="14" viewBox="0 0 15 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 8h12v1.5a3.5 3.5 0 0 1-3.5 3H4A3.5 3.5 0 0 1 .5 9v-.5z"/><path d="M1.5 8V4A2.5 2.5 0 0 1 6.5 4"/></svg><span class="dspec-label">Baños</span><strong class="dspec-val">${prop.banos}</strong></li>`);if(prop.areaConst)items.push(`<li class="dspec-item"><svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="1" width="12" height="12" rx="1.5"/><path d="M1 5h12M5 1v12"/></svg><span class="dspec-label">Área construida</span><strong class="dspec-val">${prop.areaConst} m²</strong></li>`);return items.length?`<ul class="dspec-list">${items.join('')}</ul>`:'';})();return '';
}

module.exports = { indexPage, catalogPage, zonaPage, detailPage };
