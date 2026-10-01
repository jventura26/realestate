// Home rediseñada · "No compres a ciegas"
const { layout } = require('./layout');
const { escapeHtml, ikTransform } = require('../../shared/utils');
const A = require('../analysis');
const B = require('./blocks');
const { I, waLink } = B;

function indexPage(props, card) {
  const D = A.loadZoneData();
  const fecha = D.fecha ? new Date(D.fecha + 'T12:00:00').toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const nAn = (D.n_anuncios || 0).toLocaleString('en-US');
  const activas = props.filter(p => !p.estado || p.estado === 'Activa').length;
  const vendidas = props.filter(p => p.estado === 'Vendida').length;
  const featured = props.slice(0, 6);
  const tipos = ['Casa', 'Apartamento', 'Finca', 'Terreno'];

  // Imagen editorial: la casa de mayor precio con foto propia
  const premium = props.filter(p => A.tipoKey(p) === 'Casa' && (p.mainImage || (p.gallery || [])[0]))
    .map(p => ({ p, u: (A.priceInfo(p) || {}).usd || 0 })).sort((a, b) => b.u - a.u)[0];
  const premiumImg = premium ? ikTransform(premium.p.mainImage || premium.p.gallery[0], { w: 900, q: 75 }) : '/assets/finca-premium.jpg';

  // Tipos con inventario real
  const count = k => props.filter(p => A.tipoKey(p) === k).length;
  const imgOf = (k, n = 0) => { const ps = props.filter(x => A.tipoKey(x) === k && (x.mainImage || (x.gallery || [])[0])); const p = ps[Math.min(n, ps.length - 1)]; return p ? ikTransform(p.mainImage || p.gallery[0], { w: 700, q: 70 }) : ''; };
  const rentables = props.filter(p => /renta/i.test(p.operacion || p.cinta || '') || ((A.analyze(p) || {}).rend || 0) >= 0.055).length;
  const tipoCards = [
    ['Casa', 'Residencias', 'Casas en condominio y residencias en ciudad, Carretera a El Salvador y occidente.', imgOf('Casa'), '/propiedades.html?tipo=Casa', count('Casa')],
    ['Terreno', 'Terrenos', 'Para construir a la medida o como reserva patrimonial.', imgOf('Terreno'), '/propiedades.html?tipo=Terreno', count('Terreno')],
    ['Finca', 'Fincas', 'Producción, descanso o desarrollo. Analizamos acceso, agua y título.', '/assets/finca-premium.jpg', '/propiedades.html?tipo=Finca', count('Finca')],
    ['Renta', 'Para invertir', 'Propiedades en zonas con rendimiento de alquiler por encima del promedio.', imgOf('Casa', 6), '/propiedades.html', rentables],
  ].filter(t => t[5] > 0);

  const zones = A.zoneSummaries();

  const body = `
<!-- HERO -->
<section class="h2-hero">
  <video autoplay muted loop playsinline preload="metadata" aria-hidden="true">
    <source src="https://ik.imagekit.io/Zona/Zona_INNmueble_Guatemala_Hero_16_9.webm" type="video/webm">
  </video>
  <div class="h2-ov"></div>
  <div class="h2-wrap">
    <div>
      <div class="h2-ey">
        <span class="h2-chip"><span class="dot"></span>Asesoría inmobiliaria con análisis, valores y claridad</span>
      </div>
      <h1 class="h2-h1">No compres<br><em>a ciegas.</em></h1>
      <p class="h2-lead">Propiedades en Guatemala analizadas por ubicación, valor y potencial antes de llegar a ti. Te decimos lo que conviene saber, también lo que otros no mencionan.</p>
      <div class="h2-ctas">
        <a href="/propiedades.html" class="btn-gold">Ver propiedades analizadas</a>
        <a href="#diagnostico" class="btn-ghost">Diagnóstico en 1 minuto</a>
      </div>
      <div class="h2-proof">
        <span><b>${nAn}</b> anuncios analizados</span>
        <span>Datos al <b>${escapeHtml(fecha)}</b></span>
        <span>Respuesta en <b>menos de 2 h</b></span>
      </div>
    </div>
    <div class="h2-panel glass">
      <div class="h2-tabs" role="tablist">
        <button class="h2-tab on" data-p="valor" role="tab">Valor de una zona</button>
        <button class="h2-tab" data-p="buscar" role="tab">Buscar propiedad</button>
      </div>
      <div class="h2-pane on" id="pane-valor">
        ${B.valorZonaWidget({ id: 'hv' })}
      </div>
      <div class="h2-pane" id="pane-buscar">
        <div class="h2-field">
          <label class="h2-label" for="hs-q">¿Dónde buscas?</label>
          <input class="h2-in" id="hs-q" placeholder="Zona, condominio o municipio" autocomplete="off">
        </div>
        <div class="h2-row">
          <div class="h2-field"><label class="h2-label" for="hs-t">Tipo</label>
            <select class="h2-sel" id="hs-t"><option value="">Todos</option>${tipos.map(t => `<option value="${t}">${t}</option>`).join('')}</select></div>
          <div class="h2-field"><label class="h2-label" for="hs-p">Presupuesto máx.</label>
            <select class="h2-sel" id="hs-p"><option value="">Sin límite</option><option value="200000">$200K / Q1.5M</option><option value="350000">$350K / Q2.7M</option><option value="550000">$550K / Q4.2M</option><option value="1000000">$1M / Q7.6M</option></select></div>
        </div>
        <button class="btn-gold h2-go" type="button" id="hs-go">${I.search} Buscar</button>
        <p class="src-note" style="margin-top:10px">${activas} propiedades activas, cada una con su ficha de análisis.</p>
      </div>
    </div>
  </div>
  <div class="h2-stats">
    <div class="h2-stat"><b>${activas}</b><span>Propiedades activas</span></div>
    <div class="h2-stat"><b>${vendidas > 0 ? vendidas + '+' : '50+'}</b><span>Familias asesoradas</span></div>
    <div class="h2-stat"><b>10+</b><span>Años en el mercado</span></div>
    <div class="h2-stat"><b>${nAn}</b><span>Anuncios en nuestro índice</span></div>
  </div>
</section>
<script>
document.querySelectorAll('.h2-tab').forEach(function(t){t.addEventListener('click',function(){document.querySelectorAll('.h2-tab').forEach(function(x){x.classList.remove('on')});t.classList.add('on');document.querySelectorAll('.h2-pane').forEach(function(p){p.classList.remove('on')});document.getElementById('pane-'+t.dataset.p).classList.add('on');});});
(function(){function go(){var q=document.getElementById('hs-q').value.trim(),t=document.getElementById('hs-t').value,p=document.getElementById('hs-p').value,u=[];if(t)u.push('tipo='+encodeURIComponent(t));if(q)u.push('q='+encodeURIComponent(q));if(p)u.push('pmax='+p);location.href='/propiedades.html'+(u.length?'?'+u.join('&'):'');}
document.getElementById('hs-go').addEventListener('click',go);document.getElementById('hs-q').addEventListener('keydown',function(e){if(e.key==='Enter')go();});})();
</script>

<!-- MÉTODO -->
<section class="sec" style="background:var(--ink2)">
  <div class="sec-in">
    <div class="sec-head"><div><div class="ey">Cómo trabajamos</div><h2 class="st">Antes de mostrarte una propiedad, <em>la analizamos.</em></h2></div>
      <p>Cada propiedad publicada pasa por el mismo filtro. Así puedes comparar con criterio y decidir sin presión.</p></div>
    <div class="method">
      <div class="method-step">${I.map}<div class="method-n">01</div><h3>Ubicación</h3><p>Accesos, traslado real a Zona 10 en hora pico, servicios y entorno. La ubicación también se invierte.</p></div>
      <div class="method-step">${I.chart}<div class="method-n">02</div><h3>Valor</h3><p>Comparamos el precio con ${nAn} anuncios de la zona. Te mostramos si está por debajo, dentro o por encima del rango típico.</p></div>
      <div class="method-step">${I.shield}<div class="method-n">03</div><h3>Claridad</h3><p>Puntos fuertes, lo que conviene revisar y la debida diligencia documental antes de cualquier oferta.</p></div>
    </div>
    <p class="brand-line">No se trata de vender por vender. Se trata de <b>decidir bien.</b></p>
  </div>
</section>

<!-- PROPIEDADES -->
<section style="padding:100px 0 0;background:var(--ink)">
  <div style="padding:0 6% 40px" class="sec-in">
    <div class="sec-head" style="margin-bottom:0"><div><div class="ey">Propiedades analizadas</div><h2 class="st">Cada una con su <em>ficha de análisis</em></h2></div>
      <p>Precio frente al mercado, traslado estimado y puntos a revisar. Abre cualquier propiedad para ver el detalle.</p></div>
  </div>
  <div class="prop-grid">${featured.map((p, i) => card(p, i)).join('')}</div>
  <div style="text-align:center;padding:40px 6%"><a href="/propiedades.html" class="btn-ghost">Ver las ${activas} propiedades ${I.arrow}</a></div>
</section>

<!-- DIAGNÓSTICO -->
<section class="sec grid-bg" id="diagnostico" style="background-color:var(--ink2)">
  <div class="sec-in dx">
    <div>
      <div class="ey">Diagnóstico inmobiliario</div>
      <h2 class="st">Cuatro preguntas. <em>Una búsqueda con criterio.</em></h2>
      <p style="font-size:.88rem;color:var(--sv);line-height:1.85;font-weight:300;margin:14px 0 24px;max-width:440px">Cuéntanos qué buscas y te mostramos al instante las propiedades que encajan, ordenadas por su posición frente al mercado. Si nada encaja, te avisamos cuando aparezca.</p>
      <ul class="checks">
        <li>${I.check}<span><b>Sin registro.</b> Ves resultados de inmediato.</span></li>
        <li>${I.check}<span><b>Con datos.</b> Cada opción muestra si su precio está en rango.</span></li>
        <li>${I.check}<span><b>Con seguimiento.</b> Un asesor revisa tu caso por WhatsApp.</span></li>
      </ul>
    </div>
    ${B.diagnosticoWidget(props, { id: 'dx' })}
  </div>
</section>

<!-- ZONAS CON DATOS -->
<section class="sec" style="background:var(--ink)">
  <div class="sec-in">
    <div class="sec-head"><div><div class="ey">Índice Zona-INNmueble</div><h2 class="st">La ubicación <em>también se invierte.</em></h2></div>
      <p>Valores de referencia por zona, calculados con anuncios publicados. Medianas y rangos típicos, no promesas.</p></div>
    <div class="zd-grid">
      ${zones.map(z => {
        const c = z.casa, ap = z.apto, m = c || ap;
        const k = [];
        if (c && c.m2) k.push(['$' + c.m2[1].toLocaleString('en-US') + '/m²', 'Casa · mediana']);
        if (c) k.push([A.fmtUSD(c.precio[1]), 'Casa típica']);
        if (ap && ap.m2) k.push(['$' + ap.m2[1].toLocaleString('en-US') + '/m²', 'Apto. · mediana']);
        const rend = (ap && ap.rend) || (c && c.rend);
        if (rend) k.push([(rend * 100).toFixed(1) + '%', 'Rend. renta bruto']);
        return `<a class="zd-card" href="${z.href}"><span class="zd-pin"></span>
          <div class="zd-name">${escapeHtml(z.nombre)}</div><div class="zd-sub">${escapeHtml(z.sub)}</div>
          <div class="zd-kpis">${k.slice(0, 4).map(([v, l]) => `<div class="zd-kpi"><b>${v}</b><span>${l}</span></div>`).join('')}</div>
          <span class="zd-more">Ver zona ${I.arrow}</span></a>`;
      }).join('')}
    </div>
    <p class="src-note" style="margin-top:18px">Fuente: Índice Zona-INNmueble con ${nAn} anuncios en venta y ${(D.n_rentas || 0).toLocaleString('en-US')} en alquiler, datos al ${escapeHtml(fecha)}. Precios de oferta publicados; no constituyen avalúo. <a href="/indice.html">Ver metodología e índice completo</a>.</p>
  </div>
</section>

<!-- PROPIETARIOS -->
<section class="sec" style="background:var(--ink2)">
  <div class="sec-in split">
    <div class="split-img"><img src="${escapeHtml(premiumImg)}" alt="Propiedad promocionada por Zona-INNmueble" loading="lazy"><div class="split-cap">Promoción profesional · Zona-INNmueble</div></div>
    <div>
      <div class="ey">Para propietarios</div>
      <h2 class="st">Tu propiedad merece <em>mejor promoción.</em></h2>
      <p style="font-size:.88rem;color:var(--sv);line-height:1.85;font-weight:300;margin-top:14px">Vender bien no es publicar en más portales. Es llegar con un precio defendible, una presentación impecable y ante el comprador correcto.</p>
      <ul class="checks">
        <li>${I.chart}<span><b>Precio con datos:</b> comparamos con el mercado real de tu zona.</span></li>
        <li>${I.orbit}<span><b>Recorrido virtual 360°</b> y fotografía editada profesionalmente.</span></li>
        <li>${I.film}<span><b>Reel cinematográfico</b> y campaña segmentada en Meta Ads.</span></li>
        <li>${I.users}<span><b>Compradores filtrados</b> antes de cada visita.</span></li>
      </ul>
      <div style="display:flex;gap:12px;flex-wrap:wrap"><a href="/vender.html" class="btn-gold">Solicita una evaluación</a><a href="/vender.html#estimador" class="btn-ghost">Estimar valor de mi propiedad</a></div>
    </div>
  </div>
</section>

<!-- OFF-MARKET -->
<section class="sec" style="background:var(--ink)">
  <div class="sec-in split">
    <div>
      <div class="ey">Búsqueda privada</div>
      <h2 class="st">Hay propiedades que <em>no se publican.</em></h2>
      <p style="font-size:.88rem;color:var(--sv);line-height:1.85;font-weight:300;margin:14px 0 26px">Algunos propietarios prefieren vender con discreción. Si buscas algo específico (una zona, un condominio, una finca con agua), registramos tu perfil y te contactamos solo cuando aparezca algo que encaje.</p>
      <a href="${waLink('Hola, busco una propiedad que no está publicada. Quiero registrar mi búsqueda privada.')}" target="_blank" rel="noopener" class="btn-gold">${I.wa} Registrar búsqueda privada</a>
      <p class="src-note" style="margin-top:12px">Discreción y respuesta en menos de 2 horas en horario hábil.</p>
    </div>
    <div class="split-img"><img src="/assets/finca-premium.jpg" alt="Finca en Guatemala" loading="lazy"><div class="split-cap">Residencias · Fincas · Terrenos</div></div>
  </div>
</section>

<!-- ÍNDICE -->
<section class="sec" style="background:var(--ink2);padding-top:40px">
  <div class="sec-in">
    <div class="idx-band">
      <div>
        <div class="ey" style="color:var(--el)">Índice Zona-INNmueble</div>
        <h2 class="st-large">Valores de referencia por zona en Guatemala, <em style="color:var(--or)">en un solo documento.</em></h2>
        <p style="font-size:.86rem;color:var(--sv);line-height:1.85;font-weight:300;margin:12px 0 24px;max-width:520px">Precio por m², precio típico, renta y rendimiento por zona, sector y tramo de carretera. Consúltalo gratis o recíbelo en tu WhatsApp cada mes.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap"><a href="/indice.html" class="btn-gold">Ver el índice</a><a href="${waLink('Hola, quiero recibir el Índice Zona-INNmueble de valores por zona.')}" target="_blank" rel="noopener" class="btn-ghost">Recibir por WhatsApp</a></div>
      </div>
      <div class="idx-mini">
        ${zones.slice(0, 5).map(z => z.casa && z.casa.m2 ? `<div><span>${escapeHtml(z.nombre)}</span><b>$${z.casa.m2[1].toLocaleString('en-US')}/m²</b></div>` : '').join('')}
      </div>
    </div>
  </div>
</section>

<!-- TIPOS -->
<section class="sec" style="background:var(--ink)">
  <div class="sec-in">
    <div class="sec-head"><div><div class="ey">Portafolio</div><h2 class="st">Propiedades para <em>cada objetivo</em></h2></div></div>
    <div class="tipo2">
      ${tipoCards.map(([k, t, d, img, href, n]) => `<a href="${href}"><div class="bg" style="background-image:url('${escapeHtml(img)}')"></div><div class="ov"></div>
        <div class="tx"><div class="n">${n} ${n === 1 ? 'disponible' : 'disponibles'}</div><h3>${t}</h3><p>${d}</p></div></a>`).join('')}
    </div>
  </div>
</section>

<!-- COMPROMISOS -->
<section class="sec" style="background:var(--ink2)">
  <div class="sec-in">
    <div class="sec-head"><div><div class="ey">Nuestro compromiso</div><h2 class="st">Lo que puedes esperar <em>de nosotros</em></h2></div></div>
    <div class="commit">
      <div><h4>Análisis antes que opinión</h4><p>Cada recomendación se apoya en datos de mercado, no en lo que conviene vender.</p></div>
      <div><h4>Lo bueno y lo que conviene revisar</h4><p>Te decimos los puntos fuertes y también lo que hay que verificar antes de ofertar.</p></div>
      <div><h4>Documentos en orden</h4><p>Revisamos titularidad, gravámenes e impuestos contigo antes de cualquier compromiso.</p></div>
      <div><h4>Cero presión</h4><p>Decides con calma. Si una propiedad no te conviene, te lo decimos.</p></div>
    </div>
  </div>
</section>

<!-- CONTACTO -->
<section id="contacto" class="sec" style="background:var(--ink);text-align:center">
  <div style="max-width:640px;margin:0 auto">
    <div class="ey" style="justify-content:center">Escríbenos hoy</div>
    <h2 class="st">Tu próxima propiedad empieza <em>con una mejor decisión.</em></h2>
    <p style="font-size:.86rem;color:var(--sv);line-height:1.9;margin:10px 0 34px;font-weight:300">Cuéntanos qué buscas, qué quieres vender o qué propiedad estás evaluando. Te respondemos con análisis, no con presión.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="${waLink('Hola, me interesa una asesoría de Zona INNmueble.')}" target="_blank" rel="noopener" class="btn-gold">${I.wa} Escribir por WhatsApp</a>
      <a href="/propiedades.html" class="btn-ghost">Ver propiedades</a>
    </div>
    <p class="src-note" style="margin-top:16px">Lunes a viernes, 8:00 a 18:00 · +502 4554 2088</p>
  </div>
</section>`;

  return layout({
    title: null,
    desc: `Propiedades en Guatemala analizadas por ubicación, valor y potencial. ${activas} propiedades con ficha de análisis, índice de valores por zona y asesoría honesta en Zona 10, 14, 15, 16, Fraijanes y Carretera a El Salvador.`,
    canonical: '/', body,
  });
}

module.exports = { indexPage };
