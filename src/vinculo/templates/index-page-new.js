const { layout } = require('./layout');
const { card } = require('./card');

function indexPageNew(props) {
  const featured = props.slice(0, 9);
  const zonas = [...new Set(props.map(p=>p.municipio).filter(Boolean))].slice(0,6);

  const zonasHTML = zonas.map(z => {
    const slug = z.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    const count = props.filter(p=>p.municipio===z).length;
    return '<a href="/zonas/'+slug+'.html" style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);border:1px solid rgba(201,169,110,.25);border-radius:100px;padding:8px 18px;font-size:13px;font-weight:500;color:rgba(255,255,255,.8);transition:all .3s;text-decoration:none" onmouseover="this.style.background=\'rgba(201,169,110,.15)\';this.style.borderColor=\'var(--gold)\';this.style.color=\'var(--gold)\'" onmouseout="this.style.background=\'rgba(255,255,255,.08)\';this.style.borderColor=\'rgba(201,169,110,.25)\';this.style.color=\'rgba(255,255,255,.8)\'">📍 '+z+' <span style="opacity:.6;font-size:11px">('+count+')</span></a>';
  }).join('');

  const statsBar = [
    [props.length+'+','Propiedades'],
    ['10+','Anos mercado'],
    ['6','Zonas premium'],
    ['100%','Asesoria personal'],
  ].map(function(item){
    return '<div style="flex:1;min-width:140px;padding:20px 0;border-right:1px solid rgba(255,255,255,.08);text-align:center"><div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:2rem;font-weight:500;color:var(--gold);line-height:1;margin-bottom:4px">'+item[0]+'</div><div style="font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4)">'+item[1]+'</div></div>';
  }).join('');

  const herramientas = [
    ['🏠','Valuador','/herramientas/valuador.html','Calcula el valor estimado de cualquier propiedad'],
    ['🧮','Calculadora','/herramientas/calculadora-hipotecaria.html','Simula tu cuota hipotecaria mensual'],
    ['📈','Simulador','/herramientas/simulador-inversion.html','Analiza ROI y rentabilidad antes de invertir'],
    ['📚','Guia de Compra','/herramientas/guia-compra.html','Guia premium para comprar sin errores'],
  ].map(function(item){
    return '<a href="'+item[2]+'" style="display:flex;flex-direction:column;align-items:flex-start;padding:28px;background:#f8f9fb;border:1.5px solid #eef0f3;border-radius:12px;text-decoration:none;text-align:left;transition:all .3s" onmouseover="this.style.borderColor=\'var(--gold)\';this.style.background=\'white\';this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 12px 40px rgba(0,0,0,.08)\'" onmouseout="this.style.borderColor=\'#eef0f3\';this.style.background=\'#f8f9fb\';this.style.transform=\'none\';this.style.boxShadow=\'none\'"><div style="font-size:2rem;margin-bottom:16px">'+item[0]+'</div><div style="font-size:15px;font-weight:700;color:#0a1628;margin-bottom:8px">'+item[1]+'</div><div style="font-size:13px;color:#64748b;line-height:1.6;flex:1">'+item[3]+'</div><div style="margin-top:16px;font-size:12px;font-weight:700;color:var(--gold);letter-spacing:.04em">Ir a herramienta &rarr;</div></a>';
  }).join('');

  const porQueHTML = '<div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor=\'var(--gold)\';this.style.transform=\'translateY(-4px)\'" onmouseout="this.style.borderColor=\'#eef0f3\';this.style.transform=\'none\'"><div style="width:64px;height:64px;background:linear-gradient(135deg,#0a1628,#1a2a4e);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem">✅</div><h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Propiedades verificadas</h3><p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Cada propiedad pasa por verificacion rigurosa. Papeleria en orden y precios reales.</p></div>'
  + '<div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor=\'var(--gold)\';this.style.transform=\'translateY(-4px)\'" onmouseout="this.style.borderColor=\'#eef0f3\';this.style.transform=\'none\'"><div style="width:64px;height:64px;background:linear-gradient(135deg,#c9a96e,#e6c06a);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem">🤝</div><h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Asesoria personalizada</h3><p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Un asesor dedicado desde la busqueda hasta el cierre. Tu inversion, nuestra prioridad.</p></div>'
  + '<div style="text-align:center;padding:36px 24px;border:1.5px solid #eef0f3;border-radius:12px;transition:all .3s" onmouseover="this.style.borderColor=\'var(--gold)\';this.style.transform=\'translateY(-4px)\'" onmouseout="this.style.borderColor=\'#eef0f3\';this.style.transform=\'none\'"><div style="width:64px;height:64px;background:linear-gradient(135deg,#25d366,#1da851);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.8rem">⚡</div><h3 style="font-size:1.1rem;font-weight:700;color:#0a1628;margin-bottom:12px">Respuesta en 1 hora</h3><p style="font-size:.85rem;color:#64748b;line-height:1.7;margin:0">Contestamos por WhatsApp en menos de 60 minutos. Las mejores oportunidades no esperan.</p></div>';

  const body = '<section style="min-height:92vh;position:relative;display:flex;align-items:center;background:#0a1628;overflow:hidden">'
  + '<div style="position:absolute;inset:0;background:url(\'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=60\') center/cover no-repeat;opacity:.18"></div>'
  + '<div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,22,40,.98) 0%,rgba(10,22,40,.75) 60%,rgba(15,27,46,.9) 100%)"></div>'
  + '<div style="position:absolute;top:-200px;right:-100px;width:700px;height:700px;background:radial-gradient(circle,rgba(201,169,110,.08) 0%,transparent 70%);pointer-events:none"></div>'
  + '<div style="position:relative;z-index:2;width:100%;max-width:1200px;margin:0 auto;padding:100px 6% 100px">'
  + '<div style="max-width:700px">'
  + '<div style="display:inline-flex;align-items:center;gap:8px;background:rgba(201,169,110,.12);border:1px solid rgba(201,169,110,.3);border-radius:100px;padding:6px 16px;margin-bottom:28px"><span style="width:6px;height:6px;background:var(--gold);border-radius:50%;display:inline-block"></span><span style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)">Portal Premium Guatemala</span></div>'
  + '<h1 style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:clamp(3rem,6vw,5rem);font-weight:300;line-height:1.05;color:white;margin-bottom:24px">Encuentra la propiedad<br><em style="font-style:italic;color:var(--gold)">que cambiara tu vida</em></h1>'
  + '<p style="font-size:1rem;color:rgba(255,255,255,.6);line-height:1.8;max-width:520px;margin-bottom:44px;font-weight:300">'+props.length+' propiedades verificadas en Guatemala. Casas, apartamentos, fincas e inversiones en las zonas mas exclusivas.</p>'
  + '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:60px">'
  + '<a href="/propiedades.html" style="display:inline-flex;align-items:center;gap:8px;background:var(--gold);color:#0a1628;font-size:14px;font-weight:700;letter-spacing:.04em;padding:14px 28px;border-radius:8px;text-decoration:none" onmouseover="this.style.opacity=\'.85\'" onmouseout="this.style.opacity=\'1\'">Ver propiedades &rarr;</a>'
  + '<a href="https://wa.me/50245542088" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);color:white;border:1px solid rgba(255,255,255,.2);font-size:14px;font-weight:600;padding:14px 28px;border-radius:8px;text-decoration:none" onmouseover="this.style.background=\'rgba(255,255,255,.15)\'" onmouseout="this.style.background=\'rgba(255,255,255,.08)\'">Asesoria privada</a>'
  + '</div>'
  + '<div><div style="font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:14px">Zonas destacadas</div>'
  + '<div style="display:flex;flex-wrap:wrap;gap:8px">'+zonasHTML+'</div></div>'
  + '</div></div>'
  + '<div style="position:absolute;bottom:0;left:0;right:0;background:rgba(255,255,255,.04);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,.08)">'
  + '<div style="max-width:1200px;margin:0 auto;padding:0 6%;display:flex;flex-wrap:wrap">'+statsBar+'</div></div>'
  + '</section>'
  + '<section style="padding:72px 6%;background:white;border-bottom:1px solid #eef0f3"><div style="max-width:1200px;margin:0 auto"><div style="text-align:center;margin-bottom:48px"><div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Por que elegirnos</div><h2 style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:300;color:#0a1628;margin:0">La diferencia que <em style="font-style:italic">realmente importa</em></h2></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:32px">'+porQueHTML+'</div></div></section>'
  + '<section style="padding:80px 6%;background:#f8f9fb"><div style="max-width:1200px;margin:0 auto"><div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;flex-wrap:wrap;gap:16px"><div><div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Seleccion premium</div><h2 style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:clamp(2rem,4vw,3rem);font-weight:300;color:#0a1628;line-height:1.1;margin:0">Propiedades <em style="font-style:italic">destacadas</em></h2></div><a href="/propiedades.html" style="font-size:13px;font-weight:600;color:var(--gold);text-decoration:none;letter-spacing:.04em">Ver todas &rarr;</a></div><div class="prop-grid">'+featured.map(p=>card(p)).join('')+'</div></div></section>'
  + '<section style="padding:80px 6%;background:white"><div style="max-width:1200px;margin:0 auto;text-align:center"><div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">Recursos profesionales</div><h2 style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:clamp(2rem,4vw,2.8rem);font-weight:300;color:#0a1628;margin-bottom:48px">Herramientas para <em style="font-style:italic">invertir mejor</em></h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px">'+herramientas+'</div></div></section>';

  return layout({
    title: null,
    desc: 'Plataforma premium de real estate en Guatemala. Calculadora hipotecaria, valuador profesional, guia de compra y analisis de inversionistas. '+props.length+' propiedades verificadas.',
    canonical: '/',
    body
  });
}

module.exports = { indexPageNew };
