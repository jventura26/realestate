const { layout }           = require('./layout');
const { card }             = require('./card');
const { escapeHtml, uniqueValues, getRelated } = require('../../shared/utils');

// ── INDEX ─────────────────────────────────────────────────────────────
function indexPage(props) {
  const featured = props.slice(0, 6);
  const tipos = uniqueValues(props, 'tipo');

  const body = `
<section class="hero">
  <div class="hero-content">
    <div class="eyebrow">Guatemala Real Estate Catalog</div>
    <h1>Propiedades para<br>evaluar con <em>claridad.</em></h1>
    <p class="hero-sub">Un portal inmobiliario moderno para explorar oportunidades en Guatemala: fotos, precios, ubicación y características en una experiencia limpia y premium.</p>
    <div class="hero-stats">
      <div><div class="stat-n">${props.length}</div><div class="stat-l">Propiedades</div></div>
      <div><div class="stat-n">${tipos.length}</div><div class="stat-l">Tipos</div></div>
      <div><div class="stat-n">100%</div><div class="stat-l">Publicado</div></div>
    </div>
  </div>
</section>

<div style="background:var(--cream);padding:36px 6%;border-bottom:1px solid var(--border);display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
  <a href="/propiedades.html" class="btn-outline-dark">Todas</a>
  ${tipos.map(t=>`<a href="/propiedades.html?tipo=${encodeURIComponent(t)}" class="btn-outline-dark">${escapeHtml(t)}s</a>`).join('')}
</div>

<section style="padding:64px 0 0">
  <div style="padding:0 6% 44px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px">
    <div>
      <div class="eyebrow">Portafolio Actual</div>
      <h2 class="section-title">Inventario inmobiliario <em>curado</em></h2>
    </div>
    <a href="/propiedades.html" style="font-size:.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)">Ver todo →</a>
  </div>
  <div class="prop-grid">${featured.map(p=>card(p)).join('')}</div>
  <div style="text-align:center;padding:48px 6%">
    <a href="/propiedades.html" class="btn-dark">Ver catálogo completo</a>
  </div>
</section>`;

  return layout({ title: null, desc: `Portal inmobiliario. ${props.length} propiedades en Guatemala.`, canonical: '/', body });
}

// ── CATALOG ───────────────────────────────────────────────────────────
function catalogPage(props) {
  const tipos    = uniqueValues(props, 'tipo');
  const ciudades = uniqueValues(props, 'municipio');
  const cintas   = uniqueValues(props, 'cinta');

  const filterJS = `<script>
(function(){
  const grid=document.getElementById('g'),count=document.getElementById('fc');
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
        (!pr||(()=>{const p=parseFloat(c.dataset.precio),parts=pr.split('-').map(Number);return p>=parts[0]&&(!parts[1]||p<=parts[1]);})());
      c.style.display=ok?'':'none';if(ok)n++;
    });
    count.textContent=n+' propiedad'+(n!==1?'es':'');
    document.getElementById('nr').style.display=n===0?'block':'none';
  }
  ['fq','ft','fc2','fc3','fp','fh'].forEach(id=>document.getElementById(id).addEventListener('input',run));
  document.getElementById('fq').addEventListener('change',run);
  document.getElementById('cl').addEventListener('click',()=>{['fq','ft','fc2','fc3','fp','fh'].forEach(id=>document.getElementById(id).value='');run();});
  const p=new URLSearchParams(location.search);
  if(p.get('tipo'))  document.getElementById('ft').value=p.get('tipo');
  if(p.get('ciudad'))document.getElementById('fc2').value=p.get('ciudad');
  run();count.textContent='${props.length} propiedades';
})();</script>`;

  const body = `
<div style="background:var(--cream);padding:40px 6% 32px;border-bottom:1px solid var(--border)">
  <div class="eyebrow">Catálogo Completo</div>
  <h1 class="section-title" style="margin-bottom:0">Propiedades <em>disponibles</em></h1>
</div>
<div class="filter-bar">
  <input id="fq" type="text" placeholder="Buscar propiedad, zona..." style="flex:1;min-width:180px">
  <select id="ft"><option value="">Tipo</option>${tipos.map(t=>`<option>${escapeHtml(t)}</option>`).join('')}</select>
  <select id="fc2"><option value="">Municipio</option>${ciudades.map(c=>`<option>${escapeHtml(c)}</option>`).join('')}</select>
  <select id="fc3"><option value="">Estado</option>${cintas.map(c=>`<option>${escapeHtml(c)}</option>`).join('')}</select>
  <select id="fp"><option value="">Precio</option>
    <option value="0-100000">Hasta $100K / Q1M</option>
    <option value="100000-300000">$100K–$300K</option>
    <option value="300000-600000">$300K–$600K</option>
    <option value="600000-1000000">$600K–$1M</option>
    <option value="1000000-9999999">Más de $1M</option>
  </select>
  <select id="fh"><option value="">Habitaciones</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option></select>
  <button id="cl">Limpiar</button>
  <span class="f-count" id="fc">${props.length} propiedades</span>
</div>
<div id="g" class="prop-grid" style="min-height:400px">
  ${props.map(p=>card(p)).join('')}
  <div id="nr" class="no-res" style="display:none"><p>Sin resultados</p><small>Intenta con otros filtros</small></div>
</div>`;

  return layout({ title: 'Catálogo de Propiedades Guatemala', desc: `${props.length} propiedades en Guatemala: casas, apartamentos, fincas, terrenos.`, canonical: '/propiedades.html', body, scripts: filterJS });
}

// ── DETAIL ────────────────────────────────────────────────────────────
function detailPage(prop, all) {
  const related = getRelated(prop, all);
  const img     = prop.mainImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70';

  const specs = [
    { l:'Tipo',      v: prop.tipo },
    { l:'Estado',    v: prop.cinta || prop.estado },
    { l:'Condición', v: prop.estado },
    { l:'Ubicación', v: prop.locationFull },
    prop.habitaciones&&prop.habitaciones!=='0' ? { l:'Habitaciones', v: prop.habitaciones } : null,
    prop.banos&&prop.banos!=='0'               ? { l:'Baños',        v: prop.banos }        : null,
    prop.parqueos&&prop.parqueos!=='No'        ? { l:'Garaje',       v: prop.parqueos }     : null,
    prop.areaConst                             ? { l:'Construcción', v: prop.areaConst }    : null,
    prop.terreno                               ? { l:'Terreno',      v: prop.terreno }      : null,
    prop.codigo                                ? { l:'Código',       v: prop.codigo }       : null,
  ].filter(Boolean);

  const gal = prop.gallery.slice(0, 10);
  const galHtml = gal.length > 1
    ? `<div class="gal-grid">${gal.slice(1).map(src=>`<img src="${escapeHtml(src)}" alt="${escapeHtml(prop.title)}" loading="lazy" onclick="document.getElementById('mi').src=this.src">`).join('')}</div>`
    : '';

  const relHtml = related.length
    ? `<section class="related"><div class="eyebrow">Relacionadas</div><h2 class="section-title">También te puede <em>interesar</em></h2><div class="prop-grid">${related.map(r=>card(r)).join('')}</div></section>`
    : '';

  const body = `
<div class="detail-hero">
  <div class="breadcrumb">
    <a href="/">Inicio</a>/<a href="/propiedades.html">Propiedades</a>/<span>${escapeHtml(prop.title)}</span>
  </div>
</div>
<div class="detail-grid">
  <div>
    <div class="main-img"><img id="mi" src="${escapeHtml(img)}" alt="${escapeHtml(prop.title)}"></div>
    ${galHtml}
    <div style="margin-top:40px">
      <div class="eyebrow">${escapeHtml(prop.tipo)} · ${escapeHtml(prop.cinta||prop.estado||'')}</div>
      <h1 class="detail-title">${escapeHtml(prop.title)}</h1>
      <div class="detail-price">${escapeHtml(prop.priceFormatted)}</div>
      <div class="specs-box">${specs.map(s=>`<div class="spec"><div class="spec-l">${escapeHtml(s.l)}</div><div class="spec-v">${escapeHtml(String(s.v))}</div></div>`).join('')}</div>
      ${prop.description ? `<div class="eyebrow" style="margin-bottom:10px">Descripción</div><p class="detail-desc">${escapeHtml(prop.description)}</p>` : ''}
      ${prop.amenities?.length ? `<div style="margin-bottom:24px">${prop.amenities.map(a=>`<span class="tag">${escapeHtml(a)}</span>`).join('')}</div>` : ''}
    </div>
  </div>
  <div>
    <div class="side-panel">
      <div style="font-size:.58rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Portal Informativo</div>
      <div class="side-panel-title">Código de referencia</div>
      <div class="ref-box">${escapeHtml(prop.codigo||prop.slug)}</div>
      <p style="font-size:.76rem;color:var(--silver);line-height:1.7">Este catálogo muestra información de referencia. Verifica disponibilidad y precio con el agente responsable.</p>
      <div style="margin-top:20px;display:flex;flex-direction:column;gap:8px">
        <a href="/propiedades.html?tipo=${encodeURIComponent(prop.tipo)}" class="btn-outline-dark" style="text-align:center">Más ${escapeHtml(prop.tipo)}s</a>
        <a href="/propiedades.html?ciudad=${encodeURIComponent(prop.municipio)}" class="btn-outline-dark" style="text-align:center">En ${escapeHtml(prop.municipio)}</a>
      </div>
    </div>
  </div>
</div>
${relHtml}`;

  const metaDesc = `${prop.tipo} en ${prop.locationFull}. ${prop.priceFormatted}. ${prop.habitaciones&&prop.habitaciones!=='0'?prop.habitaciones+' habitaciones. ':''}${prop.areaConst||''}`;
  return layout({ title: prop.title, desc: metaDesc, canonical: `/propiedades/${prop.slug}.html`, ogImage: prop.mainImage, body });
}

module.exports = { indexPage, catalogPage, detailPage };
