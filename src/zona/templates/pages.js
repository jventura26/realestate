const { layout, WA }       = require('./layout');
const { escapeHtml, uniqueValues, getRelated } = require('../../shared/utils');

const DOMAIN = 'https://zona-innmueble.com';

const WA_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

function waLink(msg) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}

// ── Card ─────────────────────────────────────────────────────────────
function card(p) {
  const img = p.mainImageThumb || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70';
  const badgeClass = (p.cinta||'').toLowerCase() === 'renta' ? 'renta' : '';
  const badge = p.cinta || '';
  const meta = [];
  if (p.habitaciones && p.habitaciones !== '0') meta.push(`${p.habitaciones} Hab.`);
  if (p.banos        && p.banos        !== '0') meta.push(`${p.banos} Baños`);
  if (p.areaConst)                              meta.push(p.areaConst);

  return `<a class="prop-card" href="/propiedades/${p.slug}.html"
  data-tipo="${escapeHtml(p.tipo)}" data-ciudad="${escapeHtml(p.municipio)}"
  data-cinta="${escapeHtml(p.cinta)}" data-precio="${p.priceNumeric}"
  data-habs="${p.habitaciones||0}">
  <img referrerpolicy="no-referrer" src="${escapeHtml(img)}" alt="${escapeHtml(p.title)}" loading="lazy">
  <div class="pc-ov"></div>
  ${badge ? `<span class="pc-badge ${badgeClass}">${escapeHtml(badge)}</span>` : ''}
  <div class="pc-info">
    <div class="pc-tipo">${escapeHtml(p.tipo)} · ${escapeHtml(p.municipio)}</div>
    <div class="pc-title">${escapeHtml(p.title)}</div>
    ${meta.length ? `<div class="pc-meta">${meta.map(m=>`<span>${m}</span>`).join('')}</div>` : ''}
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div class="pc-price">${escapeHtml(p.priceFormatted)}</div>
      <span class="pc-arr">→</span>
    </div>
  </div>
</a>`;
}

// ── INDEX ─────────────────────────────────────────────────────────────
function indexPage(props) {
  const featured = props.slice(0, 6);
  const tipos    = uniqueValues(props, 'tipo');

  const body = `
<!-- HERO -->
<section style="min-height:93vh;position:relative;display:flex;align-items:center;overflow:hidden;padding:0 6%;background:var(--ink)">
  <div style="position:absolute;inset:0;background:linear-gradient(105deg,rgba(13,27,62,.97) 0%,rgba(13,27,62,.68) 55%,rgba(20,34,64,.9) 100%),url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=70') center/cover no-repeat"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,62,.65) 0%,transparent 40%)"></div>
  <div style="position:relative;z-index:2;max-width:760px;padding:100px 0 130px">
    <div class="ey">Guatemala · Patrimonio Inmobiliario</div>
    <h1 style="font-family:'Cormorant Garamond',serif;font-size:clamp(3rem,6.5vw,5.4rem);font-weight:300;line-height:1.06;margin-bottom:22px">
      En Guatemala, la diferencia entre una casa y una <em style="color:var(--or);font-style:italic">residencia exclusiva</em> está en cada detalle.
    </h1>
    <p style="font-size:.85rem;font-weight:300;color:var(--sv);line-height:1.9;max-width:480px;margin-bottom:44px">
      31 propiedades verificadas, oportunidades de inversión y un equipo que entiende que cada propiedad cuenta una historia. Asesoría privada para quienes saben qué buscan.
    </p>
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      <a href="/propiedades.html" class="btn-or">Ver Propiedades</a>
      <a href="${waLink('Hola, quiero una asesoría privada de Zona INNmueble.')}" target="_blank" rel="noopener" class="btn-ol">${WA_SVG} Asesoría por WhatsApp</a>
    </div>
  </div>
  <!-- Stats bar -->
  <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(20,34,64,.8);backdrop-filter:blur(16px);border-top:1px solid var(--gl);display:flex;justify-content:center;flex-wrap:wrap">
    ${[
      [`+${props.length}`,'Propiedades'],
      ['10+','Años en el Mercado'],
      ['5','Zonas Premium'],
      ['100%','Asesoría Personal'],
    ].map(([n,l])=>`<div style="padding:20px 44px;text-align:center;border-right:1px solid var(--bd);flex:1;max-width:220px;min-width:140px">
      <div style="font-family:'Cormorant Garamond',serif;font-size:2.1rem;font-weight:500;color:var(--or);line-height:1;margin-bottom:5px">${n}</div>
      <div style="font-size:.58rem;font-weight:500;letter-spacing:.19em;text-transform:uppercase;color:var(--mt)">${l}</div>
    </div>`).join('')}
  </div>
</section>

<!-- FEATURED -->
<section style="padding:80px 0 0;background:var(--ink2)">
  <div style="padding:0 6% 44px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:18px">
    <div>
      <div class="ey">Propiedades Verificadas</div>
      <h2 class="st">Cada detalle <em>cuenta una historia</em></h2>
      <p style="font-size:.8rem;color:var(--sv);max-width:400px;margin-top:12px;line-height:1.7">31 propiedades cuidadosamente seleccionadas en las zonas más exclusivas de Guatemala.</p>
    </div>
    <a href="/propiedades.html" style="font-size:.67rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--or);transition:all .3s" onmouseover="this.style.color='var(--or2)'" onmouseout="this.style.color='var(--or)'">Ver todas →</a>
  </div>
  <div class="prop-grid">${featured.map(p=>card(p)).join('')}</div>
  <div style="text-align:center;padding:44px 6%">
    <a href="/propiedades.html" class="btn-or">Ver catálogo completo</a>
  </div>
</section>

<!-- TESTIMONIOS (FASE 1) -->
<section style="padding:80px 6%;background:var(--ink2);border-top:1px solid var(--gl)">
  <div style="max-width:1200px;margin:0 auto">
    <div class="ey" style="justify-content:center;margin-bottom:12px">TESTIMONIOS VERIFICADOS</div>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:300;text-align:center;margin-bottom:60px;color:var(--wh)">
      Lo que dicen nuestros clientes
    </h2>
    
    <div class="testimonials-container" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:28px">
      <div class="testimonial-card" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px;transition:all .4s;transform:translateY(40px);opacity:0">
        <div style="display:flex;gap:8px;margin-bottom:16px"><span style="color:var(--or)">★★★★★</span></div>
        <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.8">"Zona INNmueble me ayudó a encontrar la propiedad perfecta en Zona 10. El equipo fue muy profesional y comprensivo con mis necesidades. Altamente recomendado."</p>
        <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--gl)">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--or),var(--or2));display:flex;align-items:center;justify-content:center;color:var(--ink);font-weight:600;font-size:.9rem">MC</div>
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem">María Castillo</div><div style="color:var(--mt);font-size:.8rem">Empresaria</div></div>
        </div>
      </div>
      
      <div class="testimonial-card" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px;transition:all .4s;transform:translateY(40px);opacity:0">
        <div style="display:flex;gap:8px;margin-bottom:16px"><span style="color:var(--or)">★★★★★</span></div>
        <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.8">"Excelente asesoría para mi inversión inmobiliaria. Entendieron mi visión y me ofrecieron opciones que superaron mis expectativas."</p>
        <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--gl)">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--or),var(--or2));display:flex;align-items:center;justify-content:center;color:var(--ink);font-weight:600;font-size:.9rem">CG</div>
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem">Carlos García</div><div style="color:var(--mt);font-size:.8rem">Inversionista</div></div>
        </div>
      </div>
      
      <div class="testimonial-card" style="background:var(--ink3);padding:32px;border:1px solid var(--gl);border-radius:8px;transition:all .4s;transform:translateY(40px);opacity:0">
        <div style="display:flex;gap:8px;margin-bottom:16px"><span style="color:var(--or)">★★★★★</span></div>
        <p style="font-style:italic;color:var(--sv);margin-bottom:24px;line-height:1.8">"El servicio es impecable. Desde la búsqueda hasta la finalización, todo fue smooth y profesional. Definitivamente mi opción número uno."</p>
        <div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--gl)">
          <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--or),var(--or2));display:flex;align-items:center;justify-content:center;color:var(--ink);font-weight:600;font-size:.9rem">SL</div>
          <div><div style="font-weight:600;color:var(--wh);font-size:.9rem">Sandra López</div><div style="color:var(--mt);font-size:.8rem">Ejecutiva</div></div>
        </div>
      </div>
    </div>
    
    <!-- TRUST BADGES -->
    <div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;padding:60px 0 0;border-top:1px solid var(--gl);margin-top:60px">
      <div style="text-align:center;flex:1;min-width:120px">
        <div style="font-size:2.4rem;margin-bottom:4px">✓</div>
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">31 Propiedades</div>
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
  </div>
</section>

<!-- NEWSLETTER BANNER (NUEVO) -->
<section style="padding:80px 6%;background:linear-gradient(135deg,var(--ink3),var(--ink2));border-top:1px solid var(--gl);border-bottom:1px solid var(--gl)">
  <div style="max-width:700px;margin:0 auto;text-align:center">
    <div class="ey" style="justify-content:center;margin-bottom:12px">MANTENTE ACTUALIZADO</div>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,2.8rem);font-weight:300;margin-bottom:20px;color:var(--wh)">
      Suscríbete y recibe oportunidades premium antes que nadie
    </h2>
    <p style="font-size:.95rem;color:var(--sv);margin-bottom:35px;line-height:1.8">
      Nuevas propiedades, market insights y oportunidades exclusivas de inversión. Directamente en tu inbox.
    </p>
    <form class="newsletter-form" style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
      <input type="email" placeholder="tu-email@example.com" required style="flex:1;min-width:250px;max-width:400px;padding:14px 18px;background:rgba(255,255,255,.08);border:1px solid var(--gl);color:var(--wh);font-family:'Montserrat',sans-serif;font-size:.9rem;border-radius:4px;transition:all .3s">
      <button type="submit" style="padding:14px 32px;background:var(--or);color:var(--ink);border:none;font-size:.8rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;border-radius:4px;transition:all .3s;font-family:'Montserrat',sans-serif">Suscribirse</button>
    </form>
    <p style="font-size:.75rem;color:var(--mt);margin-top:18px">Respetamos tu privacidad. Baja frecuencia, solo contenido de valor.</p>
  </div>
</section>

<!-- TYPES -->
<section style="background:var(--ink)">
  <div style="max-width:560px;margin-bottom:52px">
    <div class="ey">Encuentra Tu Tipo Ideal</div>
    <h2 class="st">Un portafolio para <em>cada visión</em> de vida.</h2>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1px;background:var(--bd)">
    ${[
      ['🏠','Residencias Premium','Casas diseñadas para vivir. Zona 10, 14, 15, 16 y Cayalá. Privacidad, acceso y plusvalía.'],
      ['🏙️','Apartamentos Selectos','Penthouse y apartamentos de alto nivel. Ubicaciones estratégicas con retorno de inversión potencial.'],
      ['🌿','Fincas & Terrenos','Propiedades rurales con potencial. Espacio, naturaleza y oportunidades de desarrollo.'],
      ['📈','Inversión Inteligente','Identificamos oportunidades antes que el mercado. Asesoría con análisis de retorno real.'],
    ].map(([ic,nm,ds])=>`<div style="background:var(--ink2);padding:38px 30px;border-top:2px solid transparent;transition:all .4s;cursor:pointer" onmouseover="this.style.background='var(--ink3)';this.style.borderTopColor='var(--or)'" onmouseout="this.style.background='var(--ink2)';this.style.borderTopColor='transparent'">
      <div style="font-size:1.7rem;margin-bottom:18px">${ic}</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:400;margin-bottom:10px">${nm}</div>
      <p style="font-size:.73rem;color:var(--sv);line-height:1.8;font-weight:300">${ds}</p>
    </div>`).join('')}
  </div>
</section>

<!-- CTA -->
<section id="contacto" style="background:var(--ink2);position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=40') center/cover no-repeat;opacity:.03"></div>
  <div style="position:relative;z-index:1;max-width:620px;margin:0 auto;text-align:center">
    <div class="ey" style="justify-content:center">Contáctanos</div>
    <h2 class="st">Tu próxima propiedad empieza <em>con una conversación.</em></h2>
    <p style="font-size:.81rem;color:var(--sv);line-height:1.9;margin-bottom:40px;font-weight:300">Nuestro equipo está disponible para asesorarte de forma privada. Sin compromiso.</p>
    <div style="display:flex;flex-direction:column;gap:10px;max-width:340px;margin:0 auto">
      <a href="${waLink('Hola, me interesa una asesoría de Zona INNmueble.')}" target="_blank" rel="noopener" class="wa-btn" style="justify-content:center">${WA_SVG} Escribir por WhatsApp</a>
      <a href="/propiedades.html" class="btn-ol" style="justify-content:center">Ver propiedades disponibles</a>
    </div>
    <p style="margin-top:18px;font-size:.63rem;color:var(--mt)"><span class="live"></span>+502 4554-2088 · Lun–Vie 8:00–18:00</p>
  </div>
</section>`;

  return layout({ title: null, desc: `Propiedades premium en Guatemala. ${props.length} propiedades disponibles. Asesoría personalizada.`, canonical: '/', body });
}

// ── CATALOG ───────────────────────────────────────────────────────────
function catalogPage(props) {
  const tipos    = uniqueValues(props, 'tipo');
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
        (!pr||(()=>{const p=parseFloat(c.dataset.precio),pts=pr.split('-').map(Number);return p>=pts[0]&&(!pts[1]||p<=pts[1]);})());
      c.style.display=ok?'':'none';if(ok)n++;
    });
    cnt.textContent=n+' propiedad'+(n!==1?'es':'');
    document.getElementById('nr').style.display=n===0?'block':'none';
  }
  ['fq','ft','fc2','fc3','fp','fh'].forEach(id=>{
    document.getElementById(id).addEventListener('input',run);
    document.getElementById(id).addEventListener('change',run);
  });
  document.getElementById('cl2').addEventListener('click',()=>{['fq','ft','fc2','fc3','fp','fh'].forEach(id=>document.getElementById(id).value='');run();});
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
  <select id="fc3"><option value="">Estado</option>${cintas.map(c=>`<option>${escapeHtml(c)}</option>`).join('')}</select>
  <select id="fp"><option value="">Precio</option>
    <option value="0-100000">Hasta $100K / Q1M</option>
    <option value="100000-300000">$100K–$300K</option>
    <option value="300000-600000">$300K–$600K</option>
    <option value="600000-1000000">$600K–$1M</option>
    <option value="1000000-9999999">Más de $1M</option>
  </select>
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

  return layout({ title: 'Catálogo Propiedades Premium Guatemala', desc: `${props.length} propiedades premium en Guatemala. Casas, apartamentos, fincas e inversiones con asesoría.`, canonical: '/propiedades.html', body, scripts: filterJS + `
<script src="https://zona-inmu.tours-virtuales-gt.workers.dev/dynamic-grid.js"></script>` });
}

// ── DETAIL ────────────────────────────────────────────────────────────
function detailPage(prop, all) {
  const related  = getRelated(prop, all);
  const img      = prop.mainImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70';
  const propUrl  = `${DOMAIN}/propiedades/${prop.slug}.html`;

  // WhatsApp messages
  const msgInfo  = `Hola, me interesa la propiedad: ${prop.title}. Quiero solicitar más información. Link: ${propUrl}`;
  const msgVisit = `Hola, me interesa la propiedad: ${prop.title}. Quiero agendar una visita privada. Link: ${propUrl}`;
  const msgFin   = `Hola, me interesa la propiedad: ${prop.title}. Quiero consultar opciones de financiamiento. Link: ${propUrl}`;

  const specs = [
    { l:'Tipo',        v: prop.tipo },
    { l:'Estado',      v: prop.cinta||prop.estado },
    { l:'Condición',   v: prop.estado },
    { l:'Ubicación',   v: prop.locationFull },
    prop.habitaciones&&prop.habitaciones!=='0' ? { l:'Habitaciones', v: prop.habitaciones } : null,
    prop.banos&&prop.banos!=='0'               ? { l:'Baños',        v: prop.banos }        : null,
    prop.parqueos&&prop.parqueos!=='No'        ? { l:'Garaje',       v: prop.parqueos }     : null,
    prop.areaConst                             ? { l:'Construcción', v: prop.areaConst }    : null,
    prop.terreno                               ? { l:'Terreno',      v: prop.terreno }      : null,
    prop.codigo                                ? { l:'Código',       v: prop.codigo }       : null,
  ].filter(Boolean);

  const gal    = prop.gallery.slice(0, 10);
  const galHtml= gal.length > 1
    ? `<div class="gal-mini">${gal.slice(1).map(src=>`<img referrerpolicy="no-referrer" src="${escapeHtml(src)}" alt="${escapeHtml(prop.title)}" loading="lazy" onclick="document.getElementById('mi').src=this.src">`).join('')}</div>` : '';

  const relHtml = related.length
    ? `<section class="related"><div class="ey">Relacionadas</div><h2 class="st">También te puede <em>interesar</em></h2><div class="prop-grid">${related.map(r=>card(r)).join('')}</div></section>` : '';

  // JSON-LD structured data
  const jsonLd = JSON.stringify({
    "@context":"https://schema.org","@type":"RealEstateListing",
    "name": prop.title,
    "description": prop.description?.substring(0,200) || '',
    "url": propUrl,
    "image": prop.mainImage || '',
    "offers": { "@type":"Offer", "price": prop.priceNumeric || 0, "priceCurrency": prop.precio?.includes('$')?'USD':'GTQ' },
    "address": { "@type":"PostalAddress", "addressLocality": prop.municipio, "addressCountry":"GT" },
  });

  const body = `
<script type="application/ld+json">${jsonLd}</script>
<div class="det-header">
  <div class="breadcrumb">
    <a href="/">Inicio</a>/<a href="/propiedades.html">Propiedades</a>/<span style="color:var(--sv)">${escapeHtml(prop.title)}</span>
  </div>
</div>
<div class="det-body">
  <!-- LEFT -->
  <div>
    <div class="main-img"><img referrerpolicy="no-referrer" id="mi" src="${escapeHtml(img)}" alt="${escapeHtml(prop.title)}"></div>
    ${galHtml}
    <div style="margin-top:42px">
      <div style="font-size:.57rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--or);margin-bottom:8px">${escapeHtml(prop.tipo)} · ${escapeHtml(prop.cinta||prop.estado||'')}</div>
      <h1 class="det-title">${escapeHtml(prop.title)}</h1>
      <div class="det-price">${escapeHtml(prop.priceFormatted)}</div>
      <div class="specs">${specs.map(s=>`<div class="sp"><div class="sp-l">${escapeHtml(s.l)}</div><div class="sp-v">${escapeHtml(String(s.v))}</div></div>`).join('')}</div>
      ${prop.description?`<div style="font-size:.57rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--or);margin-bottom:12px">Descripción</div><p class="det-desc">${escapeHtml(prop.description)}</p>`:''}
      ${prop.amenities?.length?`<div style="margin-bottom:22px">${prop.amenities.map(a=>`<span class="tag">${escapeHtml(a)}</span>`).join('')}</div>`:''}
    </div>
    <!-- MOBILE WA (hidden on desktop) -->
    <div style="display:none" id="mobileWa">
      <a href="${waLink(msgInfo)}"  target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Solicitar información</a>
      <a href="${waLink(msgVisit)}" target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Agendar visita privada</a>
      <a href="${waLink(msgFin)}"   target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Consultar financiamiento</a>
    </div>
  </div>
  <!-- SIDEBAR -->
  <div>
    <div class="sidebar">
      <div style="font-size:.57rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--or);margin-bottom:14px;display:flex;align-items:center"><span class="live"></span>Asesor Disponible</div>
      <div class="sb-title">¿Te interesa<br>esta propiedad?</div>
      <p class="sb-sub">Respuesta en menos de 1 hora por WhatsApp.</p>
      <a href="${waLink(msgInfo)}"  target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Solicitar información</a>
      <a href="${waLink(msgVisit)}" target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Agendar visita privada</a>
      <a href="${waLink(msgFin)}"   target="_blank" rel="noopener" class="wa-btn">${WA_SVG} Consultar financiamiento</a>
      <div class="div-line"></div>
      <div style="text-align:center;font-size:.63rem;color:var(--mt);line-height:1.65">
        <strong style="display:block;color:var(--sv);margin-bottom:4px">+502 4554-2088</strong>
        Lun–Vie 8:00–18:00 · Sáb 9:00–14:00
      </div>
    </div>
    <div style="margin-top:10px;background:var(--ink2);border:1px solid var(--bd);padding:18px 20px">
      <div style="font-size:.56rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:10px">Código de referencia</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;letter-spacing:.08em;color:var(--sv)">${escapeHtml(prop.codigo||prop.slug.toUpperCase())}</div>
    </div>
    <div style="margin-top:10px;background:var(--ink2);border:1px solid var(--bd);padding:18px 20px">
      <div style="font-size:.56rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:12px">Más propiedades</div>
      <a href="/propiedades.html?tipo=${encodeURIComponent(prop.tipo)}" style="display:block;font-size:.74rem;color:var(--sv);margin-bottom:7px;transition:color .2s" onmouseover="this.style.color='var(--or)'" onmouseout="this.style.color='var(--sv)'">→ Más ${escapeHtml(prop.tipo)}s disponibles</a>
      <a href="/propiedades.html?ciudad=${encodeURIComponent(prop.municipio)}" style="display:block;font-size:.74rem;color:var(--sv);transition:color .2s" onmouseover="this.style.color='var(--or)'" onmouseout="this.style.color='var(--sv)'">→ En ${escapeHtml(prop.municipio)}</a>
    </div>
  </div>
</div>
${relHtml}
<style>@media(max-width:768px){#mobileWa{display:block!important;margin-top:24px}}</style>`;

  const metaDesc = `${prop.tipo} en ${prop.locationFull}. ${prop.priceFormatted}. ${prop.habitaciones&&prop.habitaciones!=='0'?prop.habitaciones+' habitaciones. ':''}Consulta disponibilidad por WhatsApp.`;
  return layout({ title: prop.title, desc: metaDesc, canonical: `/propiedades/${prop.slug}.html`, ogImage: prop.mainImage, body });
}

module.exports = { indexPage, catalogPage, detailPage };

// ── TESTIMONIOS SECTION (FASE 1) ───────────────────────────────────
function testimonialsSection() {
  return `
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
    <div style="font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--or)">31 Propiedades</div>
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
