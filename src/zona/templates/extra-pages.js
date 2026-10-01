// Páginas nuevas: Vender, Diagnóstico, Índice, Comparar
const { layout, WA } = require('./layout');
const { escapeHtml } = require('../../shared/utils');
const A = require('../analysis');
const B = require('./blocks');
const { I, waLink } = B;

function fechaLarga() {
  const D = A.loadZoneData();
  return D.fecha ? new Date(D.fecha + 'T12:00:00').toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
}

// ── VENDER ──────────────────────────────────────────────────────────
function venderPage() {
  const body = `
<section class="pg-hero grid-bg">
  <div class="sec-in">
    <div class="ey">Para propietarios</div>
    <h1 class="pg-h1">Tu propiedad merece <em>mejor promoción.</em></h1>
    <p class="pg-lead">Vender bien no es publicar en más portales. Es llegar al mercado con un precio defendible, una presentación impecable y ante el comprador correcto. Así promocionamos cada propiedad que nos confían.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:30px"><a href="#evaluacion" class="btn-gold">Solicita una evaluación</a><a href="#estimador" class="btn-ghost">Estimar valor de referencia</a></div>
  </div>
</section>

<section class="sec" style="background:var(--ink2)">
  <div class="sec-in">
    <div class="sec-head"><div><div class="ey">Qué incluye</div><h2 class="st">Promoción con <em>estrategia</em></h2></div>
      <p>Cada propiedad recibe el mismo estándar de presentación que una marca premium. Lo ves antes de publicar.</p></div>
    <div class="svc-grid">
      <div class="svc">${I.chart}<h4>Análisis de precio con datos</h4><p>Comparamos tu propiedad con los anuncios reales de su zona para fijar un precio que se pueda defender frente al comprador.</p></div>
      <div class="svc">${I.camera}<h4>Fotografía y edición profesional</h4><p>Iluminación corregida, encuadres limpios y portada pensada para detener el scroll.</p></div>
      <div class="svc">${I.orbit}<h4>Recorrido virtual 360°</h4><p>Capturado con Insta360 X5. El comprador recorre la propiedad antes de visitarla y llega con más intención.</p></div>
      <div class="svc">${I.film}<h4>Reel cinematográfico</h4><p>Video vertical de 15 segundos con movimiento elegante, listo para Instagram, Facebook y anuncios.</p></div>
      <div class="svc">${I.target}<h4>Campaña segmentada en Meta Ads</h4><p>Anuncios dirigidos al perfil que compra en tu zona y en tu rango de precio, no a cualquiera.</p></div>
      <div class="svc">${I.users}<h4>Filtro y acompañamiento</h4><p>Calificamos a cada interesado antes de agendar visitas y te acompañamos hasta la escritura.</p></div>
    </div>
  </div>
</section>

<section class="sec" id="estimador" style="background:var(--ink)">
  <div class="sec-in split" style="align-items:start">
    <div>
      <div class="ey">Estimador de referencia</div>
      <h2 class="st">¿En qué rango se ofrece <em>una propiedad como la tuya?</em></h2>
      <p style="font-size:.88rem;color:var(--sv);line-height:1.85;font-weight:300;margin:14px 0 20px">Escribe la zona, el tipo y el área aproximada. Te mostramos el rango en que se ofrecen propiedades similares hoy. Es una referencia de mercado, no un avalúo: para un precio de salida preciso revisamos ubicación exacta, estado y comparables.</p>
      <p class="src-note">Basado en el Índice Zona-INNmueble, datos al ${escapeHtml(fechaLarga())}.</p>
    </div>
    <div class="h2-panel glass">${B.valorZonaWidget({ id: 've', withArea: true })}</div>
  </div>
</section>

<section class="sec" style="background:var(--ink2)">
  <div class="sec-in">
    <div class="sec-head"><div><div class="ey">Proceso</div><h2 class="st">De la evaluación <em>a la escritura</em></h2></div></div>
    <div class="method m4">
      <div class="method-step"><div class="method-n">01</div><h3>Evaluación</h3><p>Visitamos la propiedad, revisamos documentos y analizamos el mercado de la zona.</p></div>
      <div class="method-step"><div class="method-n">02</div><h3>Estrategia</h3><p>Definimos precio de salida, público objetivo y plan de promoción.</p></div>
      <div class="method-step"><div class="method-n">03</div><h3>Producción</h3><p>Fotografía, recorrido 360°, reel y ficha de análisis publicada en zona-innmueble.com.</p></div>
      <div class="method-step"><div class="method-n">04</div><h3>Cierre</h3><p>Filtramos interesados, coordinamos visitas y acompañamos la negociación y la escritura.</p></div>
    </div>
  </div>
</section>

<section class="sec" id="evaluacion" style="background:var(--ink)">
  <div class="sec-in split" style="align-items:start">
    <div>
      <div class="ey">Solicita una evaluación</div>
      <h2 class="st">Cuéntanos de <em>tu propiedad</em></h2>
      <p style="font-size:.88rem;color:var(--sv);line-height:1.85;font-weight:300;margin:14px 0 22px">Con estos datos preparamos una primera lectura de precio y estrategia. Te respondemos por WhatsApp en menos de 2 horas en horario hábil, sin compromiso.</p>
      <ul class="checks">
        <li>${I.check}<span><b>Sin costo</b> la primera evaluación.</span></li>
        <li>${I.check}<span><b>Discreción:</b> no publicamos nada sin tu aprobación.</span></li>
        <li>${I.check}<span><b>Honestidad:</b> si el precio esperado no es realista, te lo decimos con datos.</span></li>
      </ul>
    </div>
    <form class="h2-panel glass form2" id="vform">
      <div class="h2-row">
        <div><label class="h2-label" for="vf-n">Nombre</label><input class="h2-in" id="vf-n" required autocomplete="name"></div>
        <div><label class="h2-label" for="vf-tel">WhatsApp</label><input class="h2-in" id="vf-tel" type="tel" required autocomplete="tel" placeholder="+502"></div>
      </div>
      <div class="h2-row">
        <div><label class="h2-label" for="vf-t">Tipo</label><select class="h2-sel" id="vf-t"><option>Casa</option><option>Apartamento</option><option>Terreno</option><option>Finca</option><option>Local / oficina</option></select></div>
        <div><label class="h2-label" for="vf-o">Operación</label><select class="h2-sel" id="vf-o"><option>Venta</option><option>Renta</option><option>Venta o renta</option></select></div>
      </div>
      <div><label class="h2-label" for="vf-z">Zona / condominio</label><input class="h2-in" id="vf-z" required placeholder="Ej. Vista Hermosa, Zona 15"></div>
      <div class="h2-row">
        <div><label class="h2-label" for="vf-a">Área aprox. (m²)</label><input class="h2-in" id="vf-a" type="number" min="0"></div>
        <div><label class="h2-label" for="vf-p">Precio esperado</label><input class="h2-in" id="vf-p" placeholder="Opcional"></div>
      </div>
      <button class="btn-gold" type="submit">${I.wa} Enviar por WhatsApp</button>
      <p class="src-note">Al enviar se abre WhatsApp con tus datos. Consulta nuestra <a href="/privacidad.html">política de privacidad</a>.</p>
    </form>
  </div>
</section>
<script>
document.getElementById('vform').addEventListener('submit',function(e){e.preventDefault();
  var g=function(i){return (document.getElementById(i).value||'').trim()};
  var msg='Hola, quiero una evaluación para promocionar mi propiedad.\\nNombre: '+g('vf-n')+'\\nWhatsApp: '+g('vf-tel')+'\\nTipo: '+g('vf-t')+' · '+g('vf-o')+'\\nZona: '+g('vf-z')+(g('vf-a')?'\\nÁrea: '+g('vf-a')+' m²':'')+(g('vf-p')?'\\nPrecio esperado: '+g('vf-p'):'');
  try{if(window.zTrack)zTrack('Lead',{content_name:'Captacion propietario',content_category:g('vf-t')},true);}catch(x){}
  window.open('https://wa.me/${WA}?text='+encodeURIComponent(msg),'_blank');
});
</script>`;
  return layout({ title: 'Vende o renta tu propiedad con estrategia', desc: 'Promoción inmobiliaria profesional en Guatemala: análisis de precio con datos de mercado, fotografía, recorrido virtual 360°, reel y campañas en Meta Ads. Solicita una evaluación sin compromiso.', canonical: '/vender.html', body });
}

// ── DIAGNÓSTICO ─────────────────────────────────────────────────────
function diagnosticoPage(props) {
  const body = `
<section class="pg-hero grid-bg" style="padding-bottom:110px">
  <div class="sec-in dx">
    <div>
      <div class="ey">Diagnóstico inmobiliario</div>
      <h1 class="pg-h1" style="font-size:clamp(2.4rem,5vw,4rem)">Tu próxima propiedad empieza con <em>una mejor decisión.</em></h1>
      <p class="pg-lead">Responde cuatro preguntas y te mostramos al instante las propiedades que encajan con tu objetivo, presupuesto y zona, ordenadas según su posición frente al mercado.</p>
      <ul class="checks">
        <li>${I.check}<span><b>Un minuto</b>, sin registro.</span></li>
        <li>${I.check}<span><b>Resultados con datos</b> del Índice Zona-INNmueble.</span></li>
        <li>${I.check}<span><b>Seguimiento humano</b> por WhatsApp, sin presión.</span></li>
      </ul>
    </div>
    ${B.diagnosticoWidget(props, { id: 'dxp' })}
  </div>
</section>`;
  return layout({ title: 'Diagnóstico inmobiliario en 1 minuto', desc: 'Responde 4 preguntas y encuentra propiedades en Guatemala que encajan con tu objetivo, presupuesto y zona. Resultados con datos de mercado y asesoría por WhatsApp.', canonical: '/diagnostico.html', body });
}

// ── ÍNDICE ──────────────────────────────────────────────────────────
function indicePage() {
  const D = A.loadZoneData();
  const fecha = fechaLarga();
  const order = { 'Macro-zona': 0, 'Tramo': 1, 'Sector': 2, 'Zona': 3, 'Municipio': 4 };
  const PRI = ['M:Zona 10', 'M:Zona 14', 'M:Zona 15', 'M:Zona 16', 'M:Carretera a El Salvador', 'M:Fraijanes', 'M:San Cristóbal', 'M:Mixco (otros)', 'M:Zona 13', 'M:Ciudad de Guatemala (otras zonas)', 'M:Área metropolitana (otros)', 'M:Antigua Guatemala / Sacatepéquez'];
  const byIdI = {}; D.lugares.forEach(x => { byIdI[x.id] = x; });
  const macros = D.lugares.filter(l => l.clase === 'Macro-zona').sort((a, b) => ((PRI.indexOf(a.id) + 1) || 99) - ((PRI.indexOf(b.id) + 1) || 99));
  const kids = id => D.lugares.filter(l => l.padre === id).sort((a, b) => (order[a.clase] - order[b.clase]) || a.nombre.localeCompare(b.nombre));
  const tipos = ['Casa', 'Apartamento', 'Terreno', 'Finca'];
  const usd = n => A.fmtUSD(n);
  const row = (l, t, sub) => {
    const d = l.tipos[t]; if (!d) return '';
    return `<tr class="${sub ? 'sub' : ''}" data-t="${t}"><td><a href="/valor/${A.zoneSlugOf(l, byIdI)}.html" style="color:inherit;text-decoration:underline;text-decoration-color:rgba(201,163,91,.35);text-underline-offset:3px">${escapeHtml(l.nombre)}</a>${sub ? ` <span class="src-note">${escapeHtml(l.clase)}</span>` : ''}</td>
      <td>${d.m2 ? `<b>$${d.m2[1].toLocaleString('en-US')}</b>` : '–'}</td>
      <td>${d.m2 ? `$${d.m2[0].toLocaleString('en-US')} – $${d.m2[2].toLocaleString('en-US')}` : '–'}</td>
      <td>${usd(d.precio[1])} <span class="src-note">(${usd(d.precio[0])}–${usd(d.precio[2])})</span></td>
      <td>${d.renta ? '$' + Math.round(d.renta[1]).toLocaleString('en-US') : '–'}</td>
      <td>${d.rend ? (d.rend * 100).toFixed(1) + '%' : '–'}</td>
      <td>${d.n}</td><td><span class="conf">${escapeHtml(d.conf || '')}</span></td></tr>`;
  };
  const orphans = D.lugares.filter(l => l.clase !== 'Macro-zona' && !macros.some(m => m.id === l.padre)).sort((a, b) => a.nombre.localeCompare(b.nombre));
  const rows = t => macros.filter(m => m.tipos[t]).map(m => row(m, t, false) + kids(m.id).map(k => row(k, t, true)).join('')).join('')
    + (orphans.some(o => o.tipos[t]) ? `<tr data-t="${t}"><td colspan="8" style="color:var(--or);font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;padding-top:22px">Interior del país</td></tr>` + orphans.map(o => row(o, t, true)).join('') : '');
  const body = `
<section class="pg-hero grid-bg">
  <div class="sec-in">
    <div class="ey">Índice Zona-INNmueble</div>
    <h1 class="pg-h1">Valores de referencia <em>por zona</em> en Guatemala</h1>
    <p class="pg-lead">Precio por m², precio típico, renta y rendimiento bruto por zona, sector y tramo de carretera. Calculado con ${(D.n_anuncios || 0).toLocaleString('en-US')} anuncios en venta y ${(D.n_rentas || 0).toLocaleString('en-US')} en alquiler. Datos al ${escapeHtml(fecha)}.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:28px" class="no-print">
      <a href="${waLink('Hola, quiero recibir el Índice Zona-INNmueble cada mes por WhatsApp.')}" target="_blank" rel="noopener" class="btn-gold">${I.wa} Recibir cada mes</a>
      <button class="btn-ghost" onclick="window.print()">${I.doc} Descargar PDF</button>
      <a href="/valor-por-zona.html" class="btn-ghost">Buscador por zona</a>
    </div>
  </div>
</section>
<section class="sec" style="background:var(--ink2);padding-top:60px">
  <div class="sec-in">
    <div class="seg no-print" id="idxSeg">${tipos.map((t, i) => `<button class="${i ? '' : 'on'}" data-t="${t}">${t === 'Casa' ? 'Casas' : t === 'Apartamento' ? 'Apartamentos' : t === 'Terreno' ? 'Terrenos' : 'Fincas'}</button>`).join('')}</div>
    <div class="tbl-wrap"><table class="tbl" id="idxTbl">
      <thead><tr><th>Zona</th><th>Mediana US$/m²</th><th>Rango típico US$/m²</th><th>Precio típico</th><th>Renta típica/mes</th><th>Rend. bruto</th><th>Anuncios</th><th>Confianza</th></tr></thead>
      <tbody>${tipos.map(t => rows(t)).join('')}</tbody>
    </table></div>
    <div class="split" style="margin-top:56px;align-items:start;gap:40px">
      <div>
        <h2 class="st-large">Metodología</h2>
        <ul class="checks" style="margin-top:14px">
          <li>${I.check}<span><b>Fuente:</b> anuncios de propiedades en venta y alquiler publicados en portales y redes en Guatemala, depurados de duplicados y valores atípicos.</span></li>
          <li>${I.check}<span><b>Rango típico:</b> entre el percentil 25 y el 75. La mediana es el valor central.</span></li>
          <li>${I.check}<span><b>Base:</b> m² de construcción para casas y apartamentos; m² de terreno para terrenos y fincas.</span></li>
          <li>${I.check}<span><b>Rendimiento bruto:</b> renta anual típica dividida entre el precio típico, antes de gastos e impuestos.</span></li>
        </ul>
      </div>
      <div>
        <h2 class="st-large">Cómo leerlo</h2>
        <p style="font-size:.84rem;color:var(--sv);line-height:1.85;font-weight:300;margin-top:14px">Son precios de <b style="color:var(--wh)">oferta</b>, no de cierre: la negociación suele ajustar el valor final. Sirven para saber si un precio está dentro de lo razonable para su zona, no para valuar una propiedad específica. Para eso hacemos un análisis con ubicación exacta, estado y comparables.</p>
        <a href="${waLink('Hola, quiero un análisis de precio de una propiedad específica.')}" target="_blank" rel="noopener" class="btn-gold no-print" style="margin-top:22px">Solicitar análisis de una propiedad</a>
      </div>
    </div>
  </div>
</section>
<script>
document.addEventListener('DOMContentLoaded',function(){try{zTrack('VerIndice',{})}catch(e){}});
(function(){var seg=document.getElementById('idxSeg'),rows=document.querySelectorAll('#idxTbl tbody tr');
function f(t){rows.forEach(function(r){r.style.display=r.dataset.t===t?'':'none'});seg.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.dataset.t===t)});}
seg.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){f(b.dataset.t)})});f('Casa');
window.addEventListener('beforeprint',function(){rows.forEach(function(r){r.style.display=''})});
window.addEventListener('afterprint',function(){var on=seg.querySelector('button.on');f(on?on.dataset.t:'Casa')});})();
</script>`;
  return layout({ title: 'Índice de valores por zona en Guatemala', desc: `Precio por m², precio típico, renta y rendimiento por zona en Guatemala: Zona 10, 14, 15, 16, Carretera a El Salvador, Fraijanes, Mixco y más. ${D.n_anuncios} anuncios analizados.`, canonical: '/indice.html', body, alternates: { es: '/indice.html', en: '/en/price-index.html' } });
}

// ── COMPARAR ────────────────────────────────────────────────────────
function compararPage() {
  const body = `
<section class="pg-hero" style="padding-bottom:30px">
  <div class="sec-in">
    <div class="ey">Comparador</div>
    <h1 class="pg-h1" style="font-size:clamp(2.2rem,5vw,3.6rem)">Compara con <em>criterio</em></h1>
    <p class="pg-lead">Guarda propiedades con el corazón y compáralas lado a lado: precio frente al mercado, precio por m², traslado y perfil ideal.</p>
  </div>
</section>
<section class="sec" style="background:var(--ink);padding-top:30px">
  <div class="sec-in">
    <div id="cmpBox"><p class="src-note">Cargando…</p></div>
    <div id="cmpCta" style="display:none;margin-top:26px;text-align:center"><a class="btn-gold" id="cmpWa" href="#" target="_blank" rel="noopener">${I.wa} Analizar estas opciones con un asesor</a></div>
  </div>
</section>
<script>
(function(){
  var K='zona_favoritos_v1';function favs(){try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(e){return[]}}
  var POS={bajo:'Bajo el rango',medio:'En rango',alto:'Sobre el rango'};
  fetch('/assets/props-lite.json').then(function(r){return r.json()}).then(function(P){
    function render(){
      var f=favs(),list=P.filter(function(p){return f.indexOf(p.s)>=0}).slice(0,3),box=document.getElementById('cmpBox');
      if(list.length<2){box.innerHTML='<div class="glass" style="padding:36px;border-radius:14px;text-align:center"><p style="color:var(--sv);font-size:.9rem;line-height:1.8;margin-bottom:20px">'+(list.length?'Guarda al menos una propiedad más para comparar.':'Aún no tienes propiedades guardadas.')+' Toca el corazón en cualquier tarjeta o el botón “Agregar a comparar” dentro de una propiedad.</p><a class="btn-gold" href="/propiedades.html">Ver propiedades</a></div>';document.getElementById('cmpCta').style.display='none';return;}
      box.innerHTML='<div class="cmp-grid" style="grid-template-columns:repeat('+list.length+',minmax(0,1fr))">'+list.map(function(p){
        var r=function(l,v){return '<div class="cmp-row"><span>'+l+'</span><b>'+(v||'–')+'</b></div>'};
        return '<div class="cmp-col"><img src="'+p.img+'" alt="" loading="lazy"><div class="in"><button class="cmp-x" data-s="'+p.s+'">Quitar ✕</button><h3><a href="/propiedades/'+p.s+'.html">'+p.t+'</a></h3><div class="src-note" style="margin-bottom:10px">'+p.loc+'</div>'+
          r('Precio',p.pf)+r('Frente a la zona',p.zp?POS[p.zp]+(p.zn?' · '+p.zn:''):'')+r('US$/m²',p.ppm?'$'+p.ppm.toLocaleString('en-US'):'')+r('Habitaciones',p.h||'')+r('Baños',p.b)+r('Área',p.ar?p.ar+' m²':'')+r('Traslado a Z10 (pico)',p.cm)+r('Rend. renta zona',p.y?(p.y*100).toFixed(1)+'%':'')+r('Ideal para',(p.id||[]).join(', '))+
          '</div></div>';}).join('')+'</div>';
      box.querySelectorAll('.cmp-x').forEach(function(b){b.addEventListener('click',function(){var f=favs().filter(function(x){return x!==b.dataset.s});try{localStorage.setItem(K,JSON.stringify(f))}catch(e){}render();});});
      document.getElementById('cmpWa').href='https://wa.me/${WA}?text='+encodeURIComponent('Hola, estoy comparando estas propiedades en zona-innmueble.com:\\n'+list.map(function(p){return '• '+p.t+' ('+p.pf+')'}).join('\\n')+'\\n¿Me ayudan a analizarlas?');
      document.getElementById('cmpCta').style.display='block';
      try{if(!window.__cmpT){window.__cmpT=1;zTrack('CompararPropiedades',{content_ids:list.map(function(p){return p.s}),content_type:'product',num_items:list.length});}}catch(e){}
    }
    render();
  }).catch(function(){document.getElementById('cmpBox').innerHTML='<p class="src-note">No se pudo cargar el comparador. Intenta de nuevo.</p>'});
})();
</script>
<style>@media(max-width:760px){.cmp-grid{grid-template-columns:1fr!important}}</style>`;
  return layout({ title: 'Comparar propiedades', desc: 'Compara propiedades en Guatemala lado a lado: precio frente al mercado, precio por m², traslado y perfil ideal.', canonical: '/comparar.html', body });
}

module.exports = { venderPage, diagnosticoPage, indicePage, compararPage };
