// Bloques reutilizables del rediseño (home, landing pages, propietarios)
const { escapeHtml, ikTransform } = require('../../shared/utils');
const A = require('../analysis');
const { WA } = require('./layout');

const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

// Íconos de línea (sin emojis)
const I = {
  search: '<svg class="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  map: '<svg class="ico" viewBox="0 0 24 24"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
  chart: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  shield: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  handshake: '<svg class="ico" viewBox="0 0 24 24"><path d="m11 17 2 2a1.4 1.4 0 0 0 2-2"/><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2L15 11"/><path d="M3 11l4-4 5 1 3-3 6 6-3 3"/><path d="m7 7-4 4 6 6 2-2"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>',
  camera: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  orbit: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4.5"/><path d="M12 2v2M12 20v2"/></svg>',
  film: '<svg class="ico" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/></svg>',
  target: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  users: '<svg class="ico" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.5 3.2-5.5 6.5-5.5s6 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.6c2.8.2 4.9 2 5.4 5.4"/></svg>',
  doc: '<svg class="ico" viewBox="0 0 24 24"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  wa: '<svg class="ico" viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1.1 3 .9 3.6.8.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 7 2.9 1.9 1.9 2.9 4.3 2.9 7 0 5.4-4.4 9.7-9.9 9.7zM20.5 3.5C18.2 1.2 15.2 0 12 0 5.5 0 .2 5.3.2 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.4-1.7c1.7.9 3.7 1.4 5.7 1.4 6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.5-8.3z"/></svg>',
  arrow: '<svg class="ico" viewBox="0 0 24 24" style="width:14px;height:14px"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
};

// ── Datos compactos para el cliente ─────────────────────────────────
function zoneDataLite() {
  const D = A.loadZoneData();
  return {
    f: D.fecha, n: D.n_anuncios, r: D.n_rentas,
    l: D.lugares.map(l => ({
      i: l.id, n: l.nombre, c: l.clase, a: l.alias || [],
      t: Object.fromEntries(Object.entries(l.tipos).map(([k, v]) => [k, {
        n: v.n, p: v.precio, m: v.m2 || null, b: v.base, q: v.conf, r: v.renta || null, y: v.rend || null,
      }])),
    })),
  };
}

function zoneGroup(p, a) {
  const id = a && a.zone ? a.zone.lugar.id : '';
  const txt = ((p.titulo || p.title || '') + ' ' + (p.zona || '') + ' ' + (p.municipio || '')).toLowerCase();
  if (/zona 1[0-6]|vista hermosa|san isidro|cayal|kanajuy|el prado/.test(txt) || /^(M:Zona 1|S:Vista|S:San Isidro|S:Cayal|S:Oakland)/.test(id)) return 'ciudad';
  if (/salvador|caes|fraijanes|pinula|socorro|rosal|hacienda nueva|muxbal|olmeca/.test(txt) || /Salvador|Fraijanes|Km|pinula|Socorro|Rosal|Hacienda|Muxbal/i.test(id)) return 'caes';
  if (/mixco|cristobal|cristóbal|milpas|manzanillo/.test(txt)) return 'occidente';
  return 'otros';
}

function propsLite(props) {
  return props.map(p => {
    const a = A.analyze(p);
    const pr = A.priceInfo(p);
    const cfg = p.privConfig || {};
    const hidePrice = p.esExclusiva || cfg.exclusiva || cfg.precio;
    return {
      s: p.slug, t: p.title || p.titulo, k: A.tipoKey(p) || p.tipo, op: p.operacion || p.cinta || '',
      u: hidePrice ? 0 : (pr ? Math.round(pr.usd) : 0), pf: hidePrice ? 'Precio a consultar' : (p.priceFormatted || ''),
      loc: [p.zona, p.municipio].filter((x, i, arr) => x && x !== 'Guatemala' && arr.indexOf(x) === i).join(' · ') || 'Guatemala',
      h: parseInt(p.habitaciones) || 0, b: bathsLabel(p), ar: A.tipoKey(p) === 'Casa' || A.tipoKey(p) === 'Apartamento' ? (parseFloat(String(p.areaConst || p.area || '').replace(/,/g, '')) || 0) : 0,
      img: ikTransform(p.mainImage || (p.gallery || [])[0] || '', { w: 480, q: 70 }),
      g: zoneGroup(p, a),
      zp: a && a.pricePos || '', zn: a && a.zone ? a.zone.lugar.nombre : '',
      ppm: a && a.ppm || 0, y: a && a.rend || 0,
      cm: a && a.commute && a.commute.pico ? a.commute.pico.join('–') + ' min' : '',
      id: a ? a.ideal : [],
      t360: !!p.tour360,
    };
  });
}

function bathsLabel(p) {
  const b = parseFloat(p.banos) || 0, m = parseFloat(p.mediosBanos) || 0;
  if (!b && !m) return '';
  return String(b + m * 0.5).replace('.0', '');
}

// ── Diagnóstico de 4 preguntas ──────────────────────────────────────
function diagnosticoWidget(props, opts = {}) {
  const data = propsLite(props).filter(x => x.u > 0);
  const id = opts.id || 'dx';
  return `<div class="dx-card glass" id="${id}">
  <div class="dx-progress"><i id="${id}-bar"></i></div>
  <div class="dx-step on" data-q="obj">
    <div class="dx-q">¿Qué quieres lograr?</div><div class="dx-hint">Pregunta 1 de 4</div>
    <div class="dx-opts">
      <button class="dx-opt" data-v="Vivir">Vivir<small>Casa o apartamento para mi familia</small></button>
      <button class="dx-opt" data-v="Renta">Invertir para renta<small>Ingreso mensual y ocupación</small></button>
      <button class="dx-opt" data-v="Patrimonio">Patrimonio a largo plazo<small>Terreno, finca o propiedad estable</small></button>
      <button class="dx-opt" data-v="Descanso">Segunda vivienda<small>Descanso, playa o campo</small></button>
    </div>
  </div>
  <div class="dx-step" data-q="ppto">
    <div class="dx-q">¿Cuál es tu presupuesto?</div><div class="dx-hint">Pregunta 2 de 4 · referencia en dólares</div>
    <div class="dx-opts">
      <button class="dx-opt" data-v="0-200000">Hasta $200K<small>≈ hasta Q1.5M</small></button>
      <button class="dx-opt" data-v="200000-350000">$200K – $350K<small>≈ Q1.5M – Q2.7M</small></button>
      <button class="dx-opt" data-v="350000-550000">$350K – $550K<small>≈ Q2.7M – Q4.2M</small></button>
      <button class="dx-opt" data-v="550000-99000000">Más de $550K<small>≈ más de Q4.2M</small></button>
    </div>
  </div>
  <div class="dx-step" data-q="zona">
    <div class="dx-q">¿Dónde te ves?</div><div class="dx-hint">Pregunta 3 de 4</div>
    <div class="dx-opts">
      <button class="dx-opt" data-v="ciudad">Ciudad<small>Zonas 10, 13, 14, 15, 16</small></button>
      <button class="dx-opt" data-v="caes">Carretera a El Salvador<small>Fraijanes, Pinula, condominios</small></button>
      <button class="dx-opt" data-v="occidente">Occidente<small>Mixco, San Cristóbal, Milpas Altas</small></button>
      <button class="dx-opt" data-v="abierto">Abierto a sugerencias<small>Quiero que me orienten</small></button>
    </div>
  </div>
  <div class="dx-step" data-q="plazo">
    <div class="dx-q">¿Para cuándo?</div><div class="dx-hint">Pregunta 4 de 4</div>
    <div class="dx-opts">
      <button class="dx-opt" data-v="0 a 3 meses">0 a 3 meses</button>
      <button class="dx-opt" data-v="3 a 6 meses">3 a 6 meses</button>
      <button class="dx-opt" data-v="6 a 12 meses">6 a 12 meses</button>
      <button class="dx-opt" data-v="Solo explorando">Solo estoy explorando</button>
    </div>
  </div>
  <div class="dx-result" id="${id}-res">
    <div class="za-ey">Tu diagnóstico</div>
    <div class="dx-q" id="${id}-title">Esto es lo que encontramos</div>
    <div class="dx-sum" id="${id}-sum"></div>
    <div class="dx-matches" id="${id}-matches"></div>
    <a class="btn-gold" id="${id}-wa" href="#" target="_blank" rel="noopener" style="width:100%">${I.wa} Recibir mi análisis por WhatsApp</a>
    <p class="src-note" style="margin-top:10px;text-align:center">Un asesor revisa tu caso y te responde con opciones concretas. Sin compromiso.</p>
  </div>
  <div class="dx-nav"><button class="dx-back" id="${id}-back" style="visibility:hidden">&larr; Anterior</button><span class="src-note" id="${id}-step">1 / 4</span></div>
</div>
<script>
(function(){
  var P=${JSON.stringify(data)};
  var root=document.getElementById('${id}'),steps=root.querySelectorAll('.dx-step'),i=0,ans={};
  var LBL={obj:{Vivir:'Vivir',Renta:'Invertir para renta',Patrimonio:'Patrimonio',Descanso:'Segunda vivienda'},zona:{ciudad:'Ciudad',caes:'Carretera a El Salvador',occidente:'Occidente',abierto:'Abierto a sugerencias'}};
  function show(n){steps.forEach(function(s,k){s.classList.toggle('on',k===n)});document.getElementById('${id}-bar').style.width=((n+1)*25)+'%';document.getElementById('${id}-step').textContent=(n+1)+' / 4';document.getElementById('${id}-back').style.visibility=n>0?'visible':'hidden';}
  root.querySelectorAll('.dx-opt').forEach(function(b){b.addEventListener('click',function(){
    var st=b.closest('.dx-step');st.querySelectorAll('.dx-opt').forEach(function(o){o.classList.remove('sel')});b.classList.add('sel');
    ans[st.dataset.q]=b.dataset.v;
    setTimeout(function(){ if(i<3){i++;show(i);} else finish(); },180);
  });});
  document.getElementById('${id}-back').addEventListener('click',function(){
    if(document.getElementById('${id}-res').classList.contains('on')){document.getElementById('${id}-res').classList.remove('on');i=3;show(i);root.querySelector('.dx-nav').style.display='';return;}
    if(i>0){i--;show(i);}
  });
  function fmt(n){return n>=1e6?'$'+(n/1e6).toFixed(2).replace(/\\.?0+$/,'')+'M':'$'+Math.round(n/1e3)+'K';}
  function finish(){
    steps.forEach(function(s){s.classList.remove('on')});
    document.getElementById('${id}-bar').style.width='100%';
    var r=ans.ppto.split('-'),lo=+r[0],hi=+r[1];
    var m=P.filter(function(p){
      if(p.u<lo*0.9||p.u>hi*1.1)return false;
      if(ans.zona!=='abierto'&&p.g!==ans.zona)return false;
      if(ans.obj==='Patrimonio')return p.k==='Finca'||p.k==='Terreno'||p.k==='Casa';
      if(ans.obj==='Descanso')return p.id.indexOf('Descanso / segunda vivienda')>=0||p.k==='Finca'||p.g==='otros';
      if(ans.obj==='Renta')return p.k==='Casa'||p.k==='Apartamento';
      return p.k==='Casa'||p.k==='Apartamento';
    });
    m.sort(function(a,b){var s={bajo:0,medio:1,alto:2};var x=(s[a.zp]==null?1:s[a.zp])-(s[b.zp]==null?1:s[b.zp]);if(ans.obj==='Renta')x=(b.y||0)-(a.y||0)||x;return x;});
    m=m.slice(0,3);
    var sum=document.getElementById('${id}-sum');
    sum.innerHTML=['<span>'+LBL.obj[ans.obj]+'</span>','<span>'+(lo?fmt(lo):'Hasta')+(hi<9e7?' – '+fmt(hi):' +')+'</span>','<span>'+LBL.zona[ans.zona]+'</span>','<span>'+ans.plazo+'</span>'].join('');
    var box=document.getElementById('${id}-matches');
    if(m.length){
      document.getElementById('${id}-title').textContent=m.length===1?'Una propiedad encaja con tu perfil':m.length+' propiedades encajan con tu perfil';
      box.innerHTML=m.map(function(p){var tag=p.zp?('<span style="color:var(--'+(p.zp==='bajo'?'ok':p.zp==='alto'?'warn':'el')+')"> · '+(p.zp==='bajo'?'bajo':p.zp==='alto'?'sobre':'en')+' rango de zona</span>'):'';return '<a class="dx-m" href="/propiedades/'+p.s+'.html"><img src="'+p.img+'" alt=""><div><b>'+p.t+'</b><span>'+p.pf+' · '+p.loc+tag+'</span></div></a>';}).join('');
    } else {
      document.getElementById('${id}-title').textContent='Tu búsqueda necesita un análisis a la medida';
      box.innerHTML='<p class="dx-empty">Hoy no tenemos publicada una propiedad que cumpla los cuatro criterios. Muchas opciones no se publican: déjanos tu perfil y te avisamos cuando aparezca algo que realmente encaje.</p>';
    }
    var msg='Hola, hice el diagnóstico en zona-innmueble.com.\\nObjetivo: '+LBL.obj[ans.obj]+'\\nPresupuesto: '+(lo?fmt(lo):'hasta')+(hi<9e7?' a '+fmt(hi):' o más')+'\\nZona: '+LBL.zona[ans.zona]+'\\nPlazo: '+ans.plazo+(m.length?'\\nMe interesan: '+m.map(function(p){return p.t}).join(' / '):'')+'\\n¿Me pueden enviar un análisis?';
    document.getElementById('${id}-wa').href='https://wa.me/${WA}?text='+encodeURIComponent(msg);
    document.getElementById('${id}-res').classList.add('on');
    document.getElementById('${id}-step').textContent='Listo';
    try{ if(window.fbq) fbq('trackCustom','DiagnosticoCompletado',{objetivo:ans.obj,zona:ans.zona,plazo:ans.plazo}); if(window.dataLayer) dataLayer.push({event:'diagnostico_completado',objetivo:ans.obj,zona:ans.zona}); }catch(e){}
  }
  document.getElementById('${id}-wa').addEventListener('click',function(){try{if(window.fbq)fbq('track','Lead',{content_name:'Diagnostico'});}catch(e){}});
})();
</script>`;
}

// ── Consulta rápida de valor por zona (hero / vender) ───────────────
function valorZonaWidget(opts = {}) {
  const id = opts.id || 'vz';
  const withArea = !!opts.withArea;
  return `<div class="h2-field">
    <label class="h2-label" for="${id}-q">Zona, colonia o municipio</label>
    <input class="h2-in" id="${id}-q" placeholder="Ej. Zona 14, Cayalá, Fraijanes, Km 16 CAES…" autocomplete="off">
    <div class="h2-sug" id="${id}-sug"></div>
  </div>
  <div class="h2-row">
    <div class="h2-field"><label class="h2-label" for="${id}-t">Tipo</label>
      <select class="h2-sel" id="${id}-t"><option>Casa</option><option>Apartamento</option><option>Terreno</option><option>Finca</option></select></div>
    ${withArea ? `<div class="h2-field"><label class="h2-label" for="${id}-a">Área aprox. (m²)</label><input class="h2-in" id="${id}-a" type="number" min="20" placeholder="Ej. 250"></div>`
               : `<div class="h2-field"><label class="h2-label">&nbsp;</label><button class="btn-gold h2-go" id="${id}-go" type="button">Consultar valor</button></div>`}
  </div>
  ${withArea ? `<button class="btn-gold h2-go" id="${id}-go" type="button">Ver rango de referencia</button>` : ''}
  <div class="vz-res" id="${id}-res"></div>
<script>
(function(){
  var Z=window.__ZD||(window.__ZD=${JSON.stringify(zoneDataLite())});
  var q=document.getElementById('${id}-q'),sug=document.getElementById('${id}-sug'),sel=null;
  function nm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');}
  var CL={'Macro-zona':'Zona','Zona':'Zona','Tramo':'Carretera a El Salvador','Sector':'Sector','Municipio':'Municipio'};
  function find(v){v=nm(v);if(v.length<2)return[];return Z.l.filter(function(l){return nm(l.n).indexOf(v)>=0||l.a.some(function(a){return nm(a).indexOf(v)>=0})}).slice(0,7);}
  q.addEventListener('input',function(){sel=null;var r=find(q.value);if(!r.length){sug.style.display='none';return;}
    sug.innerHTML=r.map(function(l,k){return '<div data-k="'+k+'">'+l.n+'<small>'+(CL[l.c]||l.c)+'</small></div>'}).join('');sug.style.display='block';
    sug.querySelectorAll('div').forEach(function(d){d.addEventListener('click',function(){sel=r[+d.dataset.k];q.value=sel.n;sug.style.display='none';go();});});});
  q.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();var r=find(q.value);if(r.length){sel=r[0];q.value=sel.n;}sug.style.display='none';go();}});
  document.addEventListener('click',function(e){if(!e.target.closest('#${id}-q')&&!e.target.closest('#${id}-sug'))sug.style.display='none';});
  document.getElementById('${id}-go').addEventListener('click',function(){if(!sel){var r=find(q.value);if(r.length){sel=r[0];q.value=sel.n;}}go();});
  document.getElementById('${id}-t').addEventListener('change',function(){if(sel)go();});
  function usd(n){return n>=1e6?'$'+(n/1e6).toFixed(2).replace(/\\.?0+$/,'')+'M':'$'+Math.round(n/1e3)+'K';}
  function go(){
    var box=document.getElementById('${id}-res'),t=document.getElementById('${id}-t').value;
    if(!sel){box.innerHTML='<p class="src-note">Escribe una zona y elige una opción de la lista.</p>';box.classList.add('on');return;}
    var d=sel.t[t];
    if(!d){var alt=Object.keys(sel.t);box.innerHTML='<h4>'+sel.n+'</h4><p class="src-note">No hay suficientes anuncios de '+t.toLowerCase()+'s en esta zona para dar una referencia confiable'+(alt.length?'. Disponible: '+alt.join(', ')+'.':'.')+'</p>';box.classList.add('on');return;}
    var area=${withArea ? `parseFloat(document.getElementById('${id}-a').value)||0` : '0'};
    var k=[];
    if(d.m)k.push('<div class="vz-kpi"><b>$'+d.m[1].toLocaleString('en-US')+'</b><span>Mediana '+(d.b&&d.b.indexOf('terreno')>=0?'/ m² terreno':'/ m² constr.')+'</span></div>');
    if(area&&d.m)k.push('<div class="vz-kpi"><b>'+usd(d.m[0]*area)+'–'+usd(d.m[2]*area)+'</b><span>Rango para '+area+' m²</span></div>');
    else k.push('<div class="vz-kpi"><b>'+usd(d.p[1])+'</b><span>Precio típico</span></div>');
    if(d.r)k.push('<div class="vz-kpi"><b>$'+Math.round(d.r[1]).toLocaleString('en-US')+'</b><span>Renta típica/mes</span></div>');
    else k.push('<div class="vz-kpi"><b>'+d.n+'</b><span>Anuncios</span></div>');
    box.innerHTML='<h4>'+t+'s en '+sel.n+'</h4><div class="vz-kpis">'+k.join('')+'</div>'+
      '<p class="src-note">Rango típico '+usd(d.p[0])+' – '+usd(d.p[2])+(d.m?' · $'+d.m[0].toLocaleString('en-US')+'–$'+d.m[2].toLocaleString('en-US')+'/m²':'')+(d.y?' · rendimiento bruto '+(d.y*100).toFixed(1)+'%':'')+'. Basado en '+d.n+' anuncios publicados (precios de oferta, no avalúo).</p>'+
      '<div class="vz-actions"><a href="/propiedades.html?q='+encodeURIComponent(sel.n)+'">Ver propiedades &rarr;</a><a href="/valor-por-zona.html">Análisis completo &rarr;</a><a href="https://wa.me/${WA}?text='+encodeURIComponent('Hola, consulté el valor de '+t.toLowerCase()+'s en '+sel.n+(area?' ('+area+' m²)':'')+' en zona-innmueble.com. Me gustaría un análisis de una propiedad específica.')+'" target="_blank" rel="noopener">Pedir análisis &rarr;</a></div>';
    box.classList.add('on');
    try{if(window.fbq)fbq('trackCustom','ConsultaValorZona',{zona:sel.n,tipo:t});if(window.dataLayer)dataLayer.push({event:'consulta_valor_zona',zona:sel.n,tipo:t});}catch(e){}
  }
})();
</script>`;
}

module.exports = { I, waLink, zoneDataLite, propsLite, diagnosticoWidget, valorZonaWidget, bathsLabel, zoneGroup };
