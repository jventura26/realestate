/**
 * Zona-INNmueble Admin Worker
 */

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin1203';
const SESSION_TTL = 60 * 60 * 8;
const HOOK_ZONA = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/8105bd67-0276-4485-a0e0-50dcdb0e525d';
const HOOK_INMU = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/8a9c31c6-547b-4bef-b8d4-d7661fcda2f6';

async function triggerRebuild() {
  try {
    await Promise.all([
      fetch(HOOK_ZONA, { method: 'POST' }),
      fetch(HOOK_INMU, { method: 'POST' }),
    ]);
  } catch(e) {}
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

async function requireAuth(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return false;
  return (await env.DB.get('session:' + match[1])) === 'valid';
}

function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

function getDynamicGridJS() {
  return [
    "(async function(){",
    "  if(window.__SHARE_PAGE__||location.pathname.indexOf('/share/')===0)return;",
    "  var API='https://zona-inmu.tours-virtuales-gt.workers.dev/api/public/propiedades';",
    "  async function getProps(){",
    "    try{var ts=parseInt(localStorage.getItem('kv_ts')||'0');if(Date.now()-ts<60000){var c=localStorage.getItem('kv_props');if(c)return JSON.parse(c);}}catch(e){}",
    "    var r=await fetch(API);var data=await r.json();",
    "    try{localStorage.setItem('kv_props',JSON.stringify(data));localStorage.setItem('kv_ts',String(Date.now()));}catch(e){}",
    "    return data;",
    "  }",
    "  function cardZona(p){",
    "    var img=p.mainImageThumb||p.imagen||'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70';",
    "    var badge=p.cinta||p.operacion||'';var meta='';",
    "    if(p.habitaciones&&p.habitaciones!=='0')meta+='<span>'+p.habitaciones+' Hab.</span>';",
    "    if(p.banos&&p.banos!=='0')meta+='<span>'+p.banos+' Banos</span>';",
    "    if(p.areaConst)meta+='<span>'+p.areaConst+'</span>';",
    "    return '<a class=\"prop-card\" href=\"/propiedades/'+(p.slug||p.id)+'.html\" data-tipo=\"'+(p.tipo||'')+'\" data-ciudad=\"'+(p.municipio||'')+'\" data-cinta=\"'+(p.cinta||'')+'\" data-precio=\"'+(p.priceNumeric||0)+'\" data-habs=\"'+(p.habitaciones||0)+'\">'",
    "      +'<img referrerpolicy=\"no-referrer\" src=\"'+img+'\" alt=\"'+(p.titulo||'')+'\" loading=\"lazy\">'",
    "      +'<div class=\"pc-ov\"></div>'+(badge?'<span class=\"pc-badge\">'+badge+'</span>':'')",
    "      +'<div class=\"pc-info\"><div class=\"pc-tipo\">'+(p.tipo||'')+' &middot; '+(p.municipio||p.zona||'')+'</div>'",
    "      +'<div class=\"pc-title\">'+(p.titulo||'')+'</div>'+(meta?'<div class=\"pc-meta\">'+meta+'</div>':'')",
    "      +'<div style=\"display:flex;justify-content:space-between\"><div class=\"pc-price\">'+(p.priceFormatted||p.precio||'')+'</div><span class=\"pc-arr\">&rarr;</span></div></div></a>';",
    "  }",
    "  function cardInmu(p){",
    "    var img=p.mainImageThumb||p.imagen||'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70';",
    "    var specs='';",
    "    if(p.habitaciones&&p.habitaciones!=='0')specs+='<span class=\"cs-item\">'+p.habitaciones+' hab.</span>';",
    "    if(p.banos&&p.banos!=='0')specs+='<span class=\"cs-item\">'+p.banos+' ba.</span>';",
    "    if(p.areaConst)specs+='<span class=\"cs-item\">'+p.areaConst+' m2</span>';",
    "    return '<a class=\"property-card\" href=\"/propiedades/'+(p.slug||p.id)+'.html\" data-tipo=\"'+(p.tipo||'')+'\" data-ciudad=\"'+(p.municipio||'')+'\" data-cinta=\"'+(p.cinta||'')+'\" data-precio=\"'+(p.priceNumeric||0)+'\">'",
    "      +'<div class=\"card-img-wrap\"><img referrerpolicy=\"no-referrer\" src=\"'+img+'\" alt=\"'+(p.titulo||'')+'\" loading=\"lazy\">'",
    "      +'<div class=\"card-badges\">'+(p.tipo?'<span class=\"card-tipo\">'+p.tipo+'</span>':'')+(p.cinta?'<span class=\"card-cinta\">'+p.cinta+'</span>':'')+'</div></div>'",
    "      +'<div class=\"card-body\"><div class=\"card-price\">'+(p.priceFormatted||p.precio||'')+'</div>'",
    "      +'<h3 class=\"card-title\">'+(p.titulo||'')+'</h3>'",
    "      +'<p class=\"card-loc\">'+(p.locationFull||p.zona||'')+'</p>'",
    "      +(specs?'<div class=\"card-specs\">'+specs+'</div>':'')+'</div></a>';",
    "  }",
    "  function run(props){",
    "    var isZona=location.hostname.toLowerCase().includes('zona-innmueble');",
    "    var fn=isZona?cardZona:cardInmu;",
    "    var grid=document.getElementById('g');",
    "    if(grid){",
    "      var q=(document.getElementById('fq')||{value:''}).value.toLowerCase();",
    "      var ft=(document.getElementById('ft')||{value:''}).value;",
    "      var filtered=props.filter(function(p){",
    "        if(q&&!(p.titulo||'').toLowerCase().includes(q)&&!(p.zona||'').toLowerCase().includes(q))return false;",
    "        if(ft&&p.tipo!==ft)return false;",
    "        return true;",
    "      });",
    "      grid.innerHTML=filtered.length?filtered.map(fn).join(''):'<p style=\"text-align:center;padding:60px;opacity:.5\">No hay propiedades.</p>';",
    "      var cnt=document.getElementById('fc');if(cnt)cnt.textContent=filtered.length+' propiedad'+(filtered.length!==1?'es':'');",
    "      ['fq','ft','fc2','fp','fh'].forEach(function(id){var el=document.getElementById(id);if(el&&!el.__kv){el.__kv=true;el.addEventListener('input',function(){run(props);});}});",
    "      var cl=document.getElementById('cl');if(cl&&!cl.__kv){cl.__kv=true;cl.addEventListener('click',function(){run(props);});}",
    "    } else {",
    "      var hg=document.querySelector('.prop-grid,.property-grid');",
    "      if(hg){hg.innerHTML=props.slice(0,location.hostname.toLowerCase().includes('zona-innmueble')?6:9).map(fn).join('');}",
    "    }",
    "    window.__KV_PROPS__=props;",
    "  }",
    "  async function init(){",
    "    try{",
    "      var props=await getProps();",
    "      var isDetail=location.pathname.includes('/propiedades/')&&location.pathname.endsWith('.html');",
    "      if(isDetail){",
    "        var slug=location.pathname.split('/').pop().replace('.html','');",
    "        var prop=props.find(function(p){return p.slug===slug;});",
    "        if(prop){",
    "          function applyDetail(){",
    "            var t=document.querySelector('.det-title,h1');",
    "            if(t&&prop.titulo)t.textContent=prop.titulo;",
    "            var pr=document.querySelector('.det-price');",
    "            if(pr&&prop.priceFormatted)pr.textContent=prop.priceFormatted;",
    "            if(prop.titulo)document.title=prop.titulo+' - Zona INNmueble';",
    "            var img=document.getElementById('mi');",
    "            if(img&&prop.mainImage)img.src=prop.mainImage;",
    "          }",
    "          applyDetail();",
    "          var _titulo=prop.titulo;",
    "          var observer=new MutationObserver(function(){",
    "            var t=document.querySelector('.det-title,h1');",
    "            if(t&&t.textContent!==_titulo)t.textContent=_titulo;",
    "          });",
    "          var t=document.querySelector('.det-title,h1');",
    "          if(t)observer.observe(document.body,{childList:true,subtree:true,characterData:true});",
    "        }",
    "      } else {",
    "        run(props);",
    "      }",
    "    }catch(e){console.warn('[KV]',e.message);}",
    "  }",
    "  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}",
    "})();"
  ].join('\n');
}

function getAdminJS() {
  return [
    "var props=[],editingId=null,parsedProps=[],gUrls=[];",
    "function triggerFileInput(){document.getElementById('csvFile').click();}",
    "async function doLogin(){",
    "  var u=document.getElementById('loginUser').value.trim(),p=document.getElementById('loginPass').value;",
    "  var btn=document.getElementById('loginBtn');btn.textContent='Verificando...';btn.disabled=true;",
    "  try{",
    "    var r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:u,pass:p})});",
    "    if(r.ok){document.getElementById('loginPage').style.display='none';document.getElementById('adminApp').style.display='block';loadProps();setTimeout(function(){showPage('dashboard');},100);}",
    "    else{var e=document.getElementById('loginErr');e.style.display='block';setTimeout(function(){e.style.display='none'},3000);}",
    "  }catch(e){var er=document.getElementById('loginErr');er.textContent='Error: '+e.message;er.style.display='block';}",
    "  finally{btn.textContent='Ingresar al panel';btn.disabled=false;}",
    "}",
    "document.addEventListener('keydown',function(e){if(e.key==='Enter'&&document.getElementById('loginPage').style.display!=='none')doLogin();});",
    "async function doLogout(){await fetch('/api/logout',{method:'POST'});location.reload();}",
    "async function checkSession(){var r=await fetch('/api/me');if(r.ok){document.getElementById('loginPage').style.display='none';document.getElementById('adminApp').style.display='block';loadProps();setTimeout(function(){showPage('dashboard');},100);}}",
    "async function loadProps(){var r=await fetch('/api/propiedades');if(r.ok){props=await r.json();updateStats();var tw=document.getElementById('tableWrap');if(tw)renderTable();var dt=document.getElementById('dashTableWrap');if(dt)renderTableInto(dt,props.slice(0,8));}}",
    "function updateStats(){",
    "  var st=document.getElementById('statTotal');if(st)st.textContent=props.length;",
    "  var sa=document.getElementById('statActivas');if(sa)sa.textContent=props.filter(function(p){return p.estado==='Activa';}).length;",
    "  document.getElementById('statVenta').textContent=props.filter(function(p){return p.operacion==='Venta'||p.operacion==='Venta/Renta';}).length;",
    "  document.getElementById('statRenta').textContent=props.filter(function(p){return p.operacion==='Renta'||p.operacion==='Venta/Renta';}).length;",
    "}",
    "function renderTable(){var tw=document.getElementById('tableWrap');if(!tw)return;",
    "  var q=document.getElementById('searchInput').value.toLowerCase();",
    "  var filtered=props.filter(function(p){return(p.titulo||'').toLowerCase().includes(q)||(p.zona||'').toLowerCase().includes(q)||(p.tipo||'').toLowerCase().includes(q);});",
    "  if(!filtered.length){document.getElementById('tableWrap').innerHTML='<div style=\"text-align:center;padding:48px;color:#6c757d\">No hay propiedades.</div>';return;}",
    "  var rows=filtered.map(function(p){",
    "    var badge=p.estado==='Activa'?'badge-green':'badge-blue';",
    "    var privBadge=p.privada?'<span class=\"badge badge-orange\" style=\"margin-left:4px\">PRIVADA</span>':'';",
    "    var shareUrl='https://zona-innmueble.com/share/'+(p.slug||p.id)+'.html';",
    "    return '<tr><td><div class=\"prop-title\">'+(p.titulo||'-')+'</div>'+privBadge+'</td>'",
    "      +'<td class=\"prop-price\">'+(p.privada?'<em style=\"color:#94a3b8;font-style:italic\">Privado</em>':p.precio||'-')+'</td>'",
    "      +'<td>'+(p.zona||'-')+'</td>'",
    "      +'<td><span class=\"badge badge-blue\">'+(p.tipo||'-')+'</span></td>'",
    "      +'<td><span class=\"badge badge-orange\">'+(p.operacion||'-')+'</span></td>'",
    "      +'<td><span class=\"badge '+badge+'\">'+(p.estado||'-')+'</span></td>'",
    "      +'<td><div class=\"actions\">'",
    "      +'<button class=\"btn-sm btn-edit\" onclick=\"editProp(\\'' +p.id+ '\\')\" >Editar</button>'",
    "      +'<button class=\"btn-sm\" style=\"background:#0ea5e9;color:white\" onclick=\"copyShare(\\'' +shareUrl+ '\\')\" title=\"Copiar link compartible\">Link</button>'",
    "      +'<button class=\"btn-sm btn-danger\" onclick=\"deleteProp(\\'' +p.id+ '\\')\" >Eliminar</button>'",
    "      +'</div></td></tr>';",
    "  }).join('');",
    "  document.getElementById('tableWrap').innerHTML='<table><thead><tr><th>Titulo</th><th>Precio</th><th>Zona</th><th>Tipo</th><th>Operacion</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>'+rows+'</tbody></table>';",
    "}",
    "function copyShare(url){navigator.clipboard.writeText(url).then(function(){showToast('Link copiado al portapapeles','success');}).catch(function(){prompt('Copia este link:',url);});}",
    "function addImg(){",
    "  if(gUrls.length>=50){showToast('Maximo 50 imagenes','error');return;}",
    "  var u=prompt('URL de la imagen:');",
    "  if(u&&u.startsWith('http')){gUrls.push(u);renderGallery();}",
    "}",
    "function removeImg(i){gUrls.splice(i,1);renderGallery();}",
    "function renderGallery(){",
    "  var w=document.getElementById('gWrap');if(!w)return;",
    "  var h='';",
    "  for(var i=0;i<gUrls.length;i++){",
    "    h+='<div class=\"gi\"><img src=\"'+gUrls[i]+'\" onerror=\"this.style.opacity=.3\"><button class=\"gi-rm\" onclick=\"removeImg('+i+')\">x</button></div>';",
    "  }",
    "  w.innerHTML=h;",
    "}",
    "function getCheckedChars(){",
    "  var c=[];",
    "  document.querySelectorAll('#charsSection input[type=checkbox]:checked').forEach(function(cb){c.push(cb.value);});",
    "  return c;",
    "}",
    "function setCheckedChars(chars){",
    "  document.querySelectorAll('.char-item input[type=checkbox]').forEach(function(cb){",
    "    cb.checked=false;cb.closest('.char-item').classList.remove('on');",
    "  });",
    "  if(!chars||!chars.length)return;",
    "  document.querySelectorAll('#charsSection input[type=checkbox]').forEach(function(cb){",
    "    if(chars.indexOf(cb.value)>=0){cb.checked=true;cb.closest('.char-item').classList.add('on');}",
    "  });",
    "}",
    "document.addEventListener('change',function(e){",
    "  if(e.target.matches('#charsSection input[type=checkbox]')){",
    "    e.target.closest('.char-item').classList.toggle('on',e.target.checked);",
    "  }",
    "});",
    "function openModal(prop){",
    "  editingId=prop?prop.id:null;",
    "  document.getElementById('modalTitle').textContent=prop?'Editar propiedad':'Nueva propiedad';",
    "  document.getElementById('fTitulo').value=prop?prop.titulo||'':'';",
    "  document.getElementById('fPrecio').value=prop?prop.precio||'':'';",
    "  document.getElementById('fTipo').value=prop?prop.tipo||'Casa':'Casa';",
    "  document.getElementById('fOperacion').value=prop?prop.operacion||'Venta':'Venta';",
    "  document.getElementById('fZona').value=prop?prop.zona||'':'';",
    "  document.getElementById('fArea').value=prop?prop.area||'':'';",
    "  document.getElementById('fHabitaciones').value=prop?prop.habitaciones||'':'';",
    "  document.getElementById('fBanos').value=prop?prop.banos||'':'';",
    "  document.getElementById('fImagen').value=prop?prop.imagen||'':'';",
    "  document.getElementById('fDescripcion').value=prop?prop.descripcion||'':'';",
    "  document.getElementById('fEstado').value=prop?prop.estado||'Activa':'Activa';",
    "  document.getElementById('fCodigo').value=prop?prop.codigo||'':'';",
    "  document.getElementById('fHook').value=prop?prop.hook||'':'';",
    "  document.getElementById('fDescCorta').value=prop?prop.descCorta||'':'';",
    "  document.getElementById('fPrivada').checked=prop?prop.privada===true:false;",
    "  document.getElementById('fPdfUrl').value=prop?prop.pdfUrl||'':'';",
    "  document.getElementById('fDatosTecnicos').value=prop?prop.datosTecnicos||'':'';",
    "  document.getElementById('fUbicacionGeneral').value=prop?prop.ubicacionGeneral||'':'';",
    "  if(document.getElementById('fMunicipio'))document.getElementById('fMunicipio').value=prop?prop.municipio||'':'';",
    "  if(document.getElementById('fAreaV2'))document.getElementById('fAreaV2').value=prop?prop.areaV2||'':'';",
    "  if(document.getElementById('fMediosBanos'))document.getElementById('fMediosBanos').value=prop?prop.mediosBanos||'':'';",
    "  if(document.getElementById('fParqueos'))document.getElementById('fParqueos').value=prop?prop.parqueos||'':'';",
    "  if(document.getElementById('fNiveles'))document.getElementById('fNiveles').value=prop?prop.niveles||'':'';",
    "  if(document.getElementById('fAnioConstruccion'))document.getElementById('fAnioConstruccion').value=prop?prop.anioConstruccion||'':'';",
    "  if(document.getElementById('fEstadoConstruccion'))document.getElementById('fEstadoConstruccion').value=prop?prop.estadoConstruccion||'':'';",
    "  if(document.getElementById('fTipoConstruccion'))document.getElementById('fTipoConstruccion').value=prop?prop.tipoConstruccion||'':'';",
    "  if(document.getElementById('fTecho'))document.getElementById('fTecho').value=prop?prop.techo||'':'';",
    "  if(document.getElementById('fPiso'))document.getElementById('fPiso').value=prop?prop.piso||'':'';",
    "  if(document.getElementById('fAcabados'))document.getElementById('fAcabados').value=prop?prop.acabados||'':'';",
    "  if(document.getElementById('fDepartamento'))document.getElementById('fDepartamento').value=prop?prop.departamento||'':'';",
    "  if(document.getElementById('fSlug'))document.getElementById('fSlug').value=prop?prop.slug||'':'';",
    "  if(document.getElementById('fLat'))document.getElementById('fLat').value=prop?prop.lat||'':'';",
    "  if(document.getElementById('fLng'))document.getElementById('fLng').value=prop?prop.lng||'':\'\';",
    "  document.getElementById('fTipoListing').value=prop?prop.tipoListing||'Residencial':'Residencial';",
    "  gUrls=prop&&prop.gallery?prop.gallery.filter(function(u){return u&&u!==prop.imagen;}).slice(0,50):[];",
    "  renderGallery();",
    "  setCheckedChars(prop?prop.caracteristicas||[]:[]);",
    "  var chZ=document.getElementById('sZona'),chI=document.getElementById('sInmu');",
    "  if(prop&&prop.sitios){chZ.checked=prop.sitios.indexOf('zona')>=0;chI.checked=prop.sitios.indexOf('inmu')>=0;}",
    "  else{chZ.checked=true;chI.checked=true;}",
    "  document.getElementById('modalOverlay').classList.add('open');",
    "}",
    "function closeModal(){document.getElementById('modalOverlay').classList.remove('open');editingId=null;}",
    "async function saveProp(){",
    "  var titulo=document.getElementById('fTitulo').value.trim();",
    "  var precio=document.getElementById('fPrecio').value.trim();",
    "  if(!titulo||!precio){showToast('Titulo y precio son obligatorios.','error');return;}",
    "  var imgM=document.getElementById('fImagen').value;",
    "  var allG=imgM?[imgM].concat(gUrls):gUrls.slice();",
    "  var sits=[];",
    "  if(document.getElementById('sZona').checked)sits.push('zona');",
    "  if(document.getElementById('sInmu').checked)sits.push('inmu');",
    "  var data={titulo:titulo,precio:precio,tipo:document.getElementById('fTipo').value,operacion:document.getElementById('fOperacion').value,zona:document.getElementById('fZona').value,area:document.getElementById('fArea').value,habitaciones:document.getElementById('fHabitaciones').value,banos:document.getElementById('fBanos').value,imagen:imgM,mainImage:imgM,mainImageThumb:imgM,gallery:allG,descripcion:document.getElementById('fDescripcion').value,estado:document.getElementById('fEstado').value,sitios:sits,caracteristicas:getCheckedChars(),codigo:document.getElementById('fCodigo').value,hook:document.getElementById('fHook').value.trim(),descCorta:document.getElementById('fDescCorta').value.trim(),privada:document.getElementById('fPrivada').checked,pdfUrl:document.getElementById('fPdfUrl').value.trim(),datosTecnicos:document.getElementById('fDatosTecnicos').value.trim(),ubicacionGeneral:document.getElementById('fUbicacionGeneral').value.trim(),tipoListing:document.getElementById('fTipoListing').value,areaV2:document.getElementById('fAreaV2').value.trim(),municipio:document.getElementById('fMunicipio')?document.getElementById('fMunicipio').value.trim():'',mediosBanos:document.getElementById('fMediosBanos')?document.getElementById('fMediosBanos').value.trim():'',parqueos:document.getElementById('fParqueos')?document.getElementById('fParqueos').value.trim():'',niveles:document.getElementById('fNiveles')?document.getElementById('fNiveles').value.trim():'',anioConstruccion:document.getElementById('fAnioConstruccion')?document.getElementById('fAnioConstruccion').value.trim():'',estadoConstruccion:document.getElementById('fEstadoConstruccion')?document.getElementById('fEstadoConstruccion').value.trim():'',tipoConstruccion:document.getElementById('fTipoConstruccion')?document.getElementById('fTipoConstruccion').value.trim():'',techo:document.getElementById('fTecho')?document.getElementById('fTecho').value.trim():'',piso:document.getElementById('fPiso')?document.getElementById('fPiso').value.trim():'',acabados:document.getElementById('fAcabados')?document.getElementById('fAcabados').value.trim():'',departamento:document.getElementById('fDepartamento')?document.getElementById('fDepartamento').value.trim():'',lat:document.getElementById('fLat')?document.getElementById('fLat').value.trim():'',lng:document.getElementById('fLng')?document.getElementById('fLng').value.trim():'',precioReal:document.getElementById('fPrecioReal').value.trim(),contactoVendedor:document.getElementById('fContactoVendedor').value.trim(),notasInternas:document.getElementById('fNotasInternas').value.trim(),estadoLegal:document.getElementById('fEstadoLegal').value.trim()};",
    "  var method=editingId?'PUT':'POST';",
    "  var url=editingId?'/api/propiedades/'+editingId:'/api/propiedades';",
    "  var res=await fetch(url,{method:method,headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});",
    "  if(res.ok){closeModal();showToast(editingId?'Propiedad actualizada.':'Propiedad creada.','success');loadProps();}",
    "  else showToast('Error al guardar.','error');",
    "}",
    "function editProp(id){var p=props.find(function(x){return x.id===id;});if(p)openModal(p);}",
    "async function deleteProp(id){",
    "  if(!confirm('Eliminar esta propiedad?'))return;",
    "  var res=await fetch('/api/propiedades/'+id,{method:'DELETE'});",
    "  if(res.ok){showToast('Propiedad eliminada.','success');loadProps();}",
    "  else showToast('Error al eliminar.','error');",
    "}",
    "function showToast(msg,type){var t=document.getElementById('toast');t.textContent=msg;t.className='toast '+(type||'success')+' show';setTimeout(function(){t.classList.remove('show');},3000);}",
    "function toggleImport(){document.getElementById('importPanel').classList.toggle('open');}",
    "function cancelImport(){parsedProps=[];document.getElementById('importPreview').style.display='none';document.getElementById('dropZone').style.display='block';document.getElementById('csvFile').value='';}",
    "function handleFile(file){",
    "  if(!file||!file.name.endsWith('.csv')){showToast('Selecciona un .csv','error');return;}",
    "  var reader=new FileReader();",
    "  reader.onload=function(e){",
    "    parsedProps=parseWixCSV(e.target.result);",
    "    if(!parsedProps.length){showToast('No se encontraron propiedades','error');return;}",
    "    document.getElementById('previewText').textContent=parsedProps.length+' propiedades listas';",
    "    document.getElementById('previewFile').textContent=file.name;",
    "    document.getElementById('importPreview').style.display='block';",
    "    document.getElementById('dropZone').style.display='none';",
    "  };",
    "  reader.readAsText(file,'UTF-8');",
    "}",
    "function parseWixCSV(text){",
    "  function parseRow(line){var cols=[],cur='',inQ=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch=='\"'){inQ=!inQ;continue;}if(ch==','&&!inQ){cols.push(cur.trim());cur='';continue;}cur+=ch;}cols.push(cur.trim());return cols;}",
    "  var lines=text.split('\\n').filter(function(l){return l.trim();});",
    "  if(lines.length<2)return[];",
    "  lines[0]=lines[0].replace(/^\\uFEFF/,'');",
    "  var headers=parseRow(lines[0]);",
    "  function col(row,names){for(var n=0;n<names.length;n++){var idx=headers.findIndex(function(h){return h.toLowerCase().includes(names[n].toLowerCase());});if(idx>=0&&row[idx])return row[idx].trim();}return'';}",
    "  function wixImg(uri){if(!uri)return'';if(uri.startsWith('http'))return uri;var parts=uri.split('/');for(var i=0;i<parts.length;i++){if(parts[i]==='v1'&&parts[i+1]){var f=parts[i+1].split('~')[0];return'https://static.wixstatic.com/media/'+f;}}return'';}",
    "  var result=[];",
    "  for(var i=1;i<lines.length;i++){",
    "    var row=parseRow(lines[i]);",
    "    var titulo=col(row,['titulo','title']);",
    "    if(!titulo)continue;",
    "    var status=col(row,['status']);if(status&&status.toLowerCase()==='draft')continue;",
    "    var imgRaw=col(row,['imagen','image']),img=wixImg(imgRaw);",
    "    var precio=col(row,['precio','price']);",
    "    var itemPath=col(row,['propiedades (item)','item']);",
    "    var slugParts=itemPath?itemPath.split('/'):[];",
    "    var slug=slugParts.length?slugParts[slugParts.length-1]:titulo.toLowerCase().replace(/[^a-z0-9]+/g,'-');",
    "    result.push({id:String(Date.now()+i),titulo:titulo,precio:precio,tipo:col(row,['tipo de propiedad','tipo'])||'Casa',cinta:col(row,['cinta']),operacion:col(row,['cinta','operacion'])||'Venta',zona:col(row,['lugar','zona']),municipio:col(row,['municipio']),area:col(row,['area de construccion','area']),areaConst:col(row,['area de construccion','area']),habitaciones:col(row,['numero de dormitorios','dormitorios']),banos:col(row,['numero de banos','banos']),imagen:img,mainImage:img,mainImageThumb:img,gallery:[img].filter(Boolean),descripcion:col(row,['description','descripcion']),slug:slug,codigo:col(row,['codigo']),estado:'Activa',sitios:['zona','inmu'],caracteristicas:[],hook:'',descCorta:'',privada:false,createdAt:new Date().toISOString()});",
    "  }",
    "  return result;",
    "}",
    "async function doImport(){",
    "  if(!parsedProps.length)return;",
    "  var btn=document.getElementById('btnImport'),pw=document.getElementById('progressWrap'),pb=document.getElementById('progressBar'),pl=document.getElementById('progressLabel');",
    "  btn.disabled=true;pw.style.display='block';",
    "  var pct=0,ticker=setInterval(function(){pct=Math.min(pct+8,85);pb.style.width=pct+'%';},120);",
    "  try{",
    "    var res=await fetch('/api/propiedades/import',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(parsedProps)});",
    "    clearInterval(ticker);",
    "    if(res.ok){pb.style.width='100%';pl.textContent='OK - '+parsedProps.length+' propiedades importadas';showToast(parsedProps.length+' propiedades cargadas','success');setTimeout(function(){document.getElementById('importPanel').classList.remove('open');cancelImport();loadProps();},1800);}",
    "    else{pl.textContent='Error al importar';showToast('Error al importar','error');btn.disabled=false;}",
    "  }catch(e){clearInterval(ticker);pl.textContent='Error: '+e.message;btn.disabled=false;}",
    "}",
    "async function showLeads(){fetch('/api/leads').then(function(r){return r.json();}).then(function(leads){if(!leads.length){showToast('Sin leads','error');return;}var h='<table><thead><tr><th>Fecha</th><th>Nombre</th><th>Tel</th><th>Tipo</th><th>Propiedad</th></tr></thead><tbody>';leads.forEach(function(l){h+='<tr><td>'+(l.fecha?l.fecha.substring(0,10):'-')+'</td><td>'+(l.nombre||'-')+'</td><td>'+(l.telefono||'-')+'</td><td>'+(l.tipo||'-')+'</td><td>'+(l.propiedad||'-')+'</td></tr>';});h+='</tbody></table>';document.getElementById('tableWrap').innerHTML='<div style=\"padding:16px 22px;font-size:15px;font-weight:700;color:var(--navy)\">Leads ('+leads.length+') <button class=\"btn-sm\" style=\"margin-left:10px;background:#f0f2f5;color:#1a1a2e\" onclick=\"loadProps()\">Propiedades</button></div>'+h;});}",
    "checkSession();",
    "function showPage(page){",
    "  var pages=['dashboard','propiedades','leads','importar'];",
    "  pages.forEach(function(p){var n=document.getElementById('nav-'+p);if(n)n.classList.remove('active');});",
    "  var nav=document.getElementById('nav-'+page);if(nav)nav.classList.add('active');",
    "  var titles={dashboard:'Dashboard',propiedades:'Propiedades',leads:'Leads',importar:'Importar CSV'};",
    "  var t=document.getElementById('pageTitle');if(t)t.textContent=titles[page]||page;",
    "  var mc=document.getElementById('mainContent');if(!mc)return;",
    "  if(page==='dashboard'){renderDashboard();}",
    "  else if(page==='propiedades')renderPropsPage();",
    "  else if(page==='leads')renderLeadsPage();",
    "  else if(page==='importar')renderImportPage();",
    "}",
    "function renderDashboard(){",
    "  var mc=document.getElementById('mainContent');if(!mc)return;",
    "  var activas=props.filter(function(p){return !p.estado||p.estado==='Activa';}).length;",
    "  var vendidas=props.filter(function(p){return p.estado==='Vendida';}).length;",
    "  var pausadas=props.filter(function(p){return p.estado==='Pausada';}).length;",
    "  mc.innerHTML=",
    "    '<div style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:22px\">'+",
    "    '<div style=\"background:#fff;border:1px solid #E2E8F0;border-radius:10px;padding:18px 20px\">'+",
    "    '<div style=\"font-size:11px;font-weight:600;text-transform:uppercase;color:#8A9BB0;margin-bottom:8px\">Propiedades activas</div>'+",
    "    '<div style=\"font-size:28px;font-weight:800;color:#0D1B3E\">'+activas+'</div>'+",
    "    '<div style=\"font-size:11px;color:#8A9BB0;margin-top:5px\">Total: '+props.length+'</div></div>'+",
    "    '<div style=\"background:#fff;border:1px solid #E2E8F0;border-radius:10px;padding:18px 20px\">'+",
    "    '<div style=\"font-size:11px;font-weight:600;text-transform:uppercase;color:#8A9BB0;margin-bottom:8px\">Vendidas</div>'+",
    "    '<div style=\"font-size:28px;font-weight:800;color:#0D1B3E\">'+vendidas+'</div></div>'+",
    "    '<div style=\"background:#fff;border:1px solid #E2E8F0;border-radius:10px;padding:18px 20px\">'+",
    "    '<div style=\"font-size:11px;font-weight:600;text-transform:uppercase;color:#8A9BB0;margin-bottom:8px\">Leads</div>'+",
    "    '<div style=\"font-size:28px;font-weight:800;color:#0D1B3E\" id=\"statLeadsNum\">-</div></div>'+",
    "    '</div>'+",
    "    '<div style=\"background:#fff;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)\">'+",
    "    '<div style=\"padding:16px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #E2E8F0\">'+",
    "    '<div style=\"font-size:13px;font-weight:700;color:#0D1B3E\">Propiedades recientes</div>'+",
    "    '<button class=\"btn btn-primary btn-sm\" onclick=\"openModal(null)\"><i class=\"ti ti-plus\"></i> Nueva</button></div>'+",
    "    '<div id=\"dashTableWrap\"></div></div>';",
    "  var dt=document.getElementById('dashTableWrap');if(dt)renderTableInto(dt,props.slice(0,8));",
    "  fetch('/api/leads',{credentials:'include'}).then(function(r){return r.json();}).then(function(leads){",
    "    var n=document.getElementById('statLeadsNum');if(n)n.textContent=leads.length;",
    "    var lc=document.getElementById('leadsCount');if(lc)lc.textContent=leads.length;",
    "  }).catch(function(){});",
    "}",
    "function renderPropsPage(){",
    "  var mc=document.getElementById('mainContent');if(!mc)return;",
    "  mc.innerHTML=",
    "    '<div id=\"importPanel\" style=\"background:#fff;border:1px solid #E2E8F0;border-radius:10px;padding:20px;margin-bottom:20px;display:none\">'+",
    "    '<div style=\"font-size:15px;font-weight:700;color:#0D1B3E;margin-bottom:6px\">Importar CSV</div>'+",
    "    '<div style=\"font-size:13px;color:#8A9BB0;margin-bottom:16px\">Sube el archivo propiedades.csv exportado de Wix.</div>'+",
    "    '<div class=\"drop-zone\" id=\"dropZone\" onclick=\"triggerFileInput()\">'+",
    "    '<div style=\"font-size:13px;color:#8A9BB0\"><strong>Click para seleccionar</strong> o arrastra el CSV aquí</div>'+",
    "    '<input type=\"file\" id=\"csvFile\" accept=\".csv\" style=\"display:none\" onchange=\"handleFile(this.files[0])\"></div>'+",
    "    '<div class=\"import-preview\" id=\"importPreview\">'+",
    "    '<div style=\"background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:12px 16px;display:flex;justify-content:space-between;margin:14px 0\"><span id=\"previewText\">0 propiedades</span><span id=\"previewFile\" style=\"color:#8A9BB0\"></span></div>'+",
    "    '<div class=\"progress-wrap\" id=\"progressWrap\"><div class=\"progress-bar-bg\"><div class=\"progress-bar\" id=\"progressBar\"></div></div><div class=\"progress-label\" id=\"progressLabel\"></div></div>'+",
    "    '<div class=\"import-actions\"><button class=\"btn btn-ghost\" onclick=\"cancelImport()\">Cancelar</button><button class=\"btn btn-navy\" id=\"btnImport\" onclick=\"doImport()\">Importar al KV</button></div>'+",
    "    '</div></div>'+",
    "    '<div style=\"background:#fff;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden\">'+",
    "    '<div style=\"padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid #E2E8F0\">'+",
    "    '<div style=\"display:flex;align-items:center;gap:8px;background:#F0F2F5;border:1px solid #E2E8F0;border-radius:7px;padding:7px 12px;flex:1;max-width:300px\">'+",
    "    '<i class=\"ti ti-search\" style=\"font-size:16px;color:#8A9BB0\"></i>'+",
    "    '<input type=\"text\" id=\"searchInput\" placeholder=\"Buscar propiedad...\" oninput=\"renderTable()\" style=\"border:none;background:transparent;outline:none;width:100%;font-size:13px\"></div>'+",
    "    '<div style=\"display:flex;gap:8px\">'+",
    "    '<button class=\"btn btn-ghost btn-sm\" onclick=\"toggleImport()\"><i class=\"ti ti-upload\"></i> CSV</button>'+",
    "    '<button class=\"btn btn-primary btn-sm\" onclick=\"openModal(null)\"><i class=\"ti ti-plus\"></i> Nueva</button></div></div>'+",
    "    '<div id=\"tableWrap\"></div></div>';",
    "  setTimeout(function(){renderTable();},50);",
    "}",
    "function renderLeadsPage(){",
    "  var mc=document.getElementById('mainContent');if(!mc)return;",
    "  mc.innerHTML='<div id=\"leadsContent\" style=\"font-size:13px;color:#8A9BB0\">Cargando leads...</div>';",
    "  showLeads();",
    "}",
    "function renderImportPage(){",
    "  showPage('propiedades');",
    "  setTimeout(function(){toggleImport();},100);",
    "}",
    "function renderTableInto(el,data){",
    "  if(!data||!data.length){el.innerHTML='<div style=\"padding:32px;text-align:center;color:#8A9BB0\">Sin propiedades</div>';return;}",
    "  var html='<table><thead><tr><th style=\"padding:11px 16px;font-size:11px;font-weight:700;text-transform:uppercase;color:#8A9BB0;background:#F0F2F5\">Propiedad</th><th style=\"padding:11px 16px;font-size:11px;font-weight:700;text-transform:uppercase;color:#8A9BB0;background:#F0F2F5\">Tipo</th><th style=\"padding:11px 16px;font-size:11px;font-weight:700;text-transform:uppercase;color:#8A9BB0;background:#F0F2F5\">Precio</th><th style=\"padding:11px 16px;font-size:11px;font-weight:700;text-transform:uppercase;color:#8A9BB0;background:#F0F2F5\">Estado</th><th style=\"padding:11px 16px;font-size:11px;font-weight:700;text-transform:uppercase;color:#8A9BB0;background:#F0F2F5\">Acciones</th></tr></thead><tbody>';",
    "  data.forEach(function(p){",
    "    var badge=p.estado==='Vendida'?'badge-red':p.estado==='Pausada'?'badge-gray':'badge-green';",
    "    html+='<tr>'+",
    "      '<td style=\"padding:13px 16px;border-bottom:1px solid #f0f0f0\"><div style=\"font-weight:600;color:#0D1B3E;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap\">'+escHtml(p.titulo||'')+'</div>'+",
    "      '<div style=\"font-size:11px;color:#8A9BB0;margin-top:2px\">'+escHtml(p.municipio||p.zona||'')+'</div></td>'+",
    "      '<td style=\"padding:13px 16px;border-bottom:1px solid #f0f0f0;font-size:13px\">'+escHtml(p.tipo||'')+'</td>'+",
    "      '<td style=\"padding:13px 16px;border-bottom:1px solid #f0f0f0;font-weight:700;color:#F5820D;white-space:nowrap\">'+escHtml(p.priceFormatted||p.precio||'')+'</td>'+",
    "      '<td style=\"padding:13px 16px;border-bottom:1px solid #f0f0f0\"><span style=\"padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:'+(p.estado==='Vendida'?'#fee2e2;color:#991b1b':p.estado==='Pausada'?'#f1f5f9;color:#475569':'#dcfce7;color:#166534')+'\">'+escHtml(p.estado||'Activa')+'</span></td>'+",
    "      '<td style=\"padding:13px 16px;border-bottom:1px solid #f0f0f0\"><div style=\"display:flex;gap:6px\"><div style=\"width:30px;height:30px;border-radius:6px;border:1px solid #E2E8F0;background:#F0F2F5;display:flex;align-items:center;justify-content:center;cursor:pointer\" data-id=\"'+idx+'\" onclick=\"var d=props[this.dataset.id];if(d)openModal(d.id||d.slug)\"><i class=\"ti ti-edit\" style=\"font-size:15px\"></i></div>'+",
    "      '<div style=\"width:30px;height:30px;border-radius:6px;border:1px solid #E2E8F0;background:#F0F2F5;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#ef4444\" data-id=\"'+idx+'\" onclick=\"var d=props[this.dataset.id];if(d)deleteProp(d.id||d.slug,String(d.titulo||String()))\" ><i class=\"ti ti-trash\" style=\"font-size:15px\"></i></div></div></td></tr>';",
    "  });",
    "  html+='</tbody></table>';",
    "  el.innerHTML=html;",
    "}",
    "function escHtml(s){var t={'&':'&amp;','<':'&lt;','>':'&gt;'};return String(s).replace(/[&<>]/g,function(c){return t[c]||c;});}",
    "function triggerRebuildBtn(){fetch('/api/rebuild',{method:'POST',credentials:'include'}).then(function(){showToast('Rebuild iniciado','success');}).catch(function(){showToast('Error','error');});}",
  ].join('\n');
}

function getAdminHTML() {
  const js = getAdminJS();
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin · Zona INNmueble</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.27.0/dist/tabler-icons.min.css">
<style>
:root{
  --navy:#0D1B3E;--navy2:#142240;--navy3:#1A3060;
  --or:#F5820D;--or2:#FF9B2E;
  --wh:#fff;--bg:#F0F2F5;--bg2:#E8EBF0;
  --text:#1A1A2E;--text2:#4A5568;--text3:#8A9BB0;
  --border:#E2E8F0;--border2:#CBD5E0;
  --green:#22c55e;--red:#ef4444;--yellow:#f59e0b;--blue:#3b82f6;
  --shadow:0 1px 3px rgba(0,0,0,.08);
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);font-size:14px}
input,select,textarea,button{font-family:inherit;font-size:13px}
a{text-decoration:none;color:inherit}
/* LAYOUT */
.app{display:flex;height:100vh;overflow:hidden}
/* SIDEBAR */
.sidebar{width:230px;background:var(--navy);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto}
.sb-logo{padding:18px 20px 16px;border-bottom:1px solid rgba(255,255,255,.08)}
.sb-brand{font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--wh)}
.sb-brand span{color:var(--or)}
.sb-sub{font-size:10px;color:rgba(255,255,255,.3);margin-top:2px;letter-spacing:.04em}
.sb-nav{padding:10px 0;flex:1}
.sb-section{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.22);padding:14px 20px 5px}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 20px;font-size:12px;color:rgba(255,255,255,.55);cursor:pointer;transition:all .15s;border-right:2px solid transparent}
.sb-item:hover{color:var(--wh);background:rgba(255,255,255,.06)}
.sb-item.active{color:var(--wh);background:rgba(245,130,13,.15);border-right-color:var(--or)}
.sb-item i{font-size:17px;flex-shrink:0}
.sb-badge{margin-left:auto;background:var(--or);color:var(--navy);font-size:10px;font-weight:700;padding:1px 7px;border-radius:20px}
.sb-bottom{padding:14px 20px;border-top:1px solid rgba(255,255,255,.08)}
.sb-user{display:flex;align-items:center;gap:10px}
.sb-avatar{width:34px;height:34px;border-radius:50%;background:var(--or);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--navy);flex-shrink:0}
.sb-uname{font-size:12px;color:rgba(255,255,255,.8);font-weight:600}
.sb-urole{font-size:10px;color:rgba(255,255,255,.35)}
/* MAIN */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.topbar{background:var(--wh);border-bottom:1px solid var(--border);padding:0 24px;height:58px;display:flex;align-items:center;gap:12px;flex-shrink:0}
.topbar-title{font-size:16px;font-weight:700;color:var(--navy);flex:1}
.content{flex:1;overflow-y:auto;padding:24px}
/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .15s}
.btn-primary{background:var(--or);color:var(--wh)}
.btn-primary:hover{background:var(--or2)}
.btn-navy{background:var(--navy);color:var(--wh)}
.btn-navy:hover{background:var(--navy3)}
.btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2)}
.btn-ghost:hover{background:var(--bg)}
.btn-danger{background:var(--red);color:var(--wh)}
.btn-sm{padding:5px 12px;font-size:11px}
.btn i{font-size:15px}
/* CARDS */
.card{background:var(--wh);border:1px solid var(--border);border-radius:10px;padding:20px;box-shadow:var(--shadow)}
.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.card-title{font-size:13px;font-weight:700;color:var(--navy)}
/* STATS */
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:22px}
.stat-card{background:var(--wh);border:1px solid var(--border);border-radius:10px;padding:18px 20px;box-shadow:var(--shadow)}
.stat-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.stat-label i{font-size:15px;color:var(--or)}
.stat-val{font-size:28px;font-weight:800;color:var(--navy);line-height:1}
.stat-sub{font-size:11px;color:var(--text3);margin-top:5px}
.stat-sub.up{color:var(--green)}
.stat-sub.warn{color:var(--or)}
/* TABLE */
.table-card{background:var(--wh);border:1px solid var(--border);border-radius:10px;overflow:hidden;box-shadow:var(--shadow)}
.table-header{padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--border)}
.search-box{display:flex;align-items:center;gap:8px;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:7px 12px;flex:1;max-width:300px}
.search-box i{font-size:16px;color:var(--text3)}
.search-box input{border:none;background:transparent;outline:none;width:100%;font-size:13px;color:var(--text)}
table{width:100%;border-collapse:collapse}
th{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);padding:11px 16px;text-align:left;background:var(--bg);border-bottom:1px solid var(--border)}
td{padding:13px 16px;border-bottom:1px solid var(--border);vertical-align:middle;font-size:13px}
tr:last-child td{border-bottom:none}
tr:hover td{background:#FAFBFF}
.prop-thumb{width:48px;height:38px;border-radius:6px;object-fit:cover;background:var(--bg2)}
.prop-name{font-weight:600;color:var(--navy);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.prop-loc{font-size:11px;color:var(--text3);margin-top:2px}
.price-cell{font-weight:700;color:var(--or);white-space:nowrap}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
.badge-green{background:#dcfce7;color:#166534}
.badge-blue{background:#dbeafe;color:#1e40af}
.badge-orange{background:#ffedd5;color:#9a3412}
.badge-red{background:#fee2e2;color:#991b1b}
.badge-gray{background:#f1f5f9;color:#475569}
.badge-purple{background:#f3e8ff;color:#7e22ce}
.actions-cell{display:flex;gap:6px;align-items:center}
.icon-btn{width:30px;height:30px;border-radius:6px;border:1px solid var(--border);background:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text2);transition:all .15s}
.icon-btn:hover{background:var(--navy);color:var(--wh);border-color:var(--navy)}
.icon-btn i{font-size:15px}
/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;justify-content:flex-start;align-items:stretch;z-index:500}
.modal-overlay.open{display:flex}
.modal-panel{background:var(--wh);width:820px;max-width:100%;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3)}
.modal-topbar{background:var(--navy);padding:0 24px;height:58px;display:flex;align-items:center;gap:14px;flex-shrink:0}
.modal-topbar-title{font-size:15px;font-weight:700;color:var(--wh);flex:1}
.modal-body{flex:1;overflow-y:auto;padding:0}
.modal-footer{padding:14px 24px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:10px;flex-shrink:0;background:var(--wh)}
/* FORM SECTIONS */
.form-sections{display:grid;grid-template-columns:1fr 300px;gap:0;align-items:start}
.form-left{padding:20px 20px 20px 24px;border-right:1px solid var(--border);display:flex;flex-direction:column;gap:0}
.form-right{padding:20px 24px 20px 20px;display:flex;flex-direction:column;gap:14px}
.fsec{margin-bottom:20px}
.fsec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--navy);padding:10px 0 10px;border-bottom:1px solid var(--border);margin-bottom:14px;display:flex;align-items:center;gap:7px}
.fsec-title i{font-size:16px;color:var(--or)}
.fg{margin-bottom:12px}
.fg:last-child{margin-bottom:0}
.fg label{display:block;font-size:11px;font-weight:600;color:var(--text2);margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}
.fg input,.fg select,.fg textarea{width:100%;padding:8px 10px;border:1px solid var(--border2);border-radius:6px;font-size:13px;color:var(--text);background:var(--wh);outline:none;transition:border-color .15s}
.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--or)}
.fg textarea{resize:vertical;min-height:72px}
.fg-row{display:grid;gap:10px}
.fg-row.c2{grid-template-columns:1fr 1fr}
.fg-row.c3{grid-template-columns:1fr 1fr 1fr}
.fg-row.c4{grid-template-columns:1fr 1fr 1fr 1fr}
/* CHECKBOXES */
.chars-section{margin-bottom:14px}
.chars-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text2);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.chars-label i{font-size:14px;color:var(--or)}
.chars-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.char-item{display:flex;align-items:center;gap:6px;padding:5px 8px;border:1px solid var(--border);border-radius:6px;cursor:pointer;transition:all .15s;font-size:12px;color:var(--text2)}
.char-item:hover{border-color:var(--or);color:var(--navy)}
.char-item input{width:13px;height:13px;accent-color:var(--or);cursor:pointer;flex-shrink:0}
.char-item.on{background:#FFF8F2;border-color:var(--or);color:var(--navy);font-weight:500}
/* SHARE BOX */
.share-box{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:14px;margin-bottom:14px}
.share-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#1E40AF;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.share-title i{font-size:15px}
.share-box .fg label{color:#1D4ED8}
.share-box .fg input,.share-box .fg textarea{border-color:#BFDBFE;background:#fff}
.share-box .fg input:focus,.share-box .fg textarea:focus{border-color:#3B82F6}
/* PRIVATE BOX */
.priv-box{background:#FFFBEB;border:1px solid #FCD34D;border-radius:8px;padding:14px;margin-bottom:14px}
.priv-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#92400E;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.priv-title i{font-size:15px}
.priv-box .fg label{color:#78350F}
.priv-box .fg input,.priv-box .fg textarea{border-color:#FCD34D;background:#FFFDE7}
.priv-box .fg input:focus,.priv-box .fg textarea:focus{border-color:#F59E0B}
/* SIDE CARD */
.side-card{background:var(--wh);border:1px solid var(--border);border-radius:8px;padding:14px}
.side-card-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--navy);margin-bottom:12px;display:flex;align-items:center;gap:6px}
.side-card-title i{font-size:15px;color:var(--or)}
.status-pills{display:flex;gap:6px;flex-wrap:wrap}
.pill{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border2);color:var(--text2);background:var(--bg);transition:all .15s}
.pill.selected{background:var(--or);color:var(--wh);border-color:var(--or)}
.sitio-row{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;cursor:pointer;margin-bottom:7px;transition:border-color .15s}
.sitio-row:hover{border-color:var(--or)}
.sitio-row:last-child{margin-bottom:0}
.sitio-row input{width:14px;height:14px;accent-color:var(--or)}
.sitio-label{font-size:12px;font-weight:600;color:var(--navy)}
.sitio-url{font-size:10px;color:var(--text3)}
/* IMG */
.img-drop{border:1.5px dashed var(--border2);border-radius:8px;padding:20px;text-align:center;cursor:pointer;background:var(--bg);transition:all .15s}
.img-drop:hover{border-color:var(--or);background:#FFF8F2}
.img-drop i{font-size:28px;color:var(--text3);display:block;margin-bottom:5px}
.img-drop-text{font-size:12px;color:var(--text2);font-weight:500}
.img-drop-sub{font-size:11px;color:var(--text3);margin-top:2px}
.gallery-wrap{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.gi{position:relative;width:64px}
.gi img{width:64px;height:50px;object-fit:cover;border-radius:5px;border:1px solid var(--border)}
.gi-rm{position:absolute;top:2px;right:2px;background:var(--red);color:var(--wh);border:none;border-radius:3px;width:16px;height:16px;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center}
/* LEADS PAGE */
.leads-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
.lead-card{background:var(--wh);border:1px solid var(--border);border-radius:10px;padding:16px;box-shadow:var(--shadow);transition:all .2s}
.lead-card:hover{border-color:var(--or);transform:translateY(-2px)}
.lead-card-header{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.lead-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--navy),var(--navy3));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--wh);flex-shrink:0}
.lead-name{font-size:14px;font-weight:700;color:var(--navy)}
.lead-time{font-size:11px;color:var(--text3);margin-top:1px}
.lead-prop{font-size:12px;color:var(--text2);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.lead-prop i{font-size:14px;color:var(--or)}
.lead-type{font-size:11px;color:var(--text3);margin-bottom:10px}
.lead-wa{display:inline-flex;align-items:center;gap:6px;background:#25D366;color:var(--wh);padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;transition:all .15s}
.lead-wa:hover{background:#1ebe5d}
.lead-wa i{font-size:14px}
/* IMPORT */
.import-panel{background:var(--wh);border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:20px;display:none;box-shadow:var(--shadow)}
.import-panel.open{display:block}
.drop-zone{border:2px dashed var(--border2);border-radius:8px;padding:36px;text-align:center;cursor:pointer;background:var(--bg);transition:all .15s}
.drop-zone:hover{border-color:var(--navy)}
.progress-wrap{display:none;margin-bottom:12px}
.progress-bar-bg{background:var(--bg2);border-radius:99px;height:6px;overflow:hidden}
.progress-bar{background:var(--or);height:6px;border-radius:99px;width:0%;transition:width .3s}
.progress-label{font-size:11px;color:var(--text3);margin-top:4px}
.import-preview{display:none}
.import-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:12px}
/* TOAST */
.toast{position:fixed;bottom:24px;right:24px;background:var(--navy);color:var(--wh);padding:12px 18px;border-radius:8px;font-size:13px;font-weight:600;transform:translateY(80px);opacity:0;transition:all .3s;z-index:999;display:flex;align-items:center;gap:8px}
.toast.show{transform:translateY(0);opacity:1}
.toast.success{border-left:4px solid var(--green)}
.toast.error{border-left:4px solid var(--red)}
/* LOGIN */
.login-wrap{display:flex;justify-content:center;align-items:center;min-height:100vh;background:var(--navy)}
.login-card{background:var(--wh);border-radius:14px;padding:44px 40px;width:100%;max-width:380px;box-shadow:0 24px 60px rgba(0,0,0,.4)}
.login-logo{font-size:22px;font-weight:800;color:var(--navy);letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px}
.login-logo span{color:var(--or)}
.login-sub{color:var(--text3);font-size:13px;margin-bottom:28px}
.login-field{margin-bottom:14px}
.login-field label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--navy);margin-bottom:5px}
.login-field input{width:100%;padding:10px 13px;border:1.5px solid var(--border2);border-radius:7px;font-size:14px;outline:none;transition:border-color .15s}
.login-field input:focus{border-color:var(--or)}
.login-btn{width:100%;padding:12px;background:var(--navy);color:var(--wh);border:none;border-radius:7px;font-weight:700;font-size:14px;cursor:pointer;transition:background .15s}
.login-btn:hover{background:var(--navy3)}
.login-err{background:#FEF2F2;color:#B91C1C;border-radius:6px;padding:10px 14px;font-size:13px;margin-top:12px;display:none}
/* RESPONSIVE */
@media(max-width:768px){
  .sidebar{display:none}
  .fg-row.c3,.fg-row.c4{grid-template-columns:1fr 1fr}
  .form-sections{grid-template-columns:1fr}
  .form-right{border-top:1px solid var(--border);padding:20px 24px}
  .modal-panel{width:100%}
}
</style>
</head>
<body>

<div id="loginPage" class="login-wrap">
  <div class="login-card">
    <div class="login-logo"><span>Zona</span>-INNmueble</div>
    <div class="login-sub">Panel de administración v2</div>
    <div class="login-field"><label>Usuario</label><input type="text" id="loginUser" placeholder="admin" autocomplete="username"></div>
    <div class="login-field"><label>Contraseña</label><input type="password" id="loginPass" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()"></div>
    <button class="login-btn" onclick="doLogin()">Ingresar</button>
    <div class="login-err" id="loginErr">Usuario o contraseña incorrectos.</div>
  </div>
</div>

<div id="adminApp" class="app" style="display:none">
  <div class="sidebar">
    <div class="sb-logo">
      <div class="sb-brand"><span>Zona</span>-INNmueble</div>
      <div class="sb-sub">Panel de administración</div>
    </div>
    <div class="sb-nav">
      <div class="sb-item active" onclick="showPage('dashboard')" id="nav-dashboard"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
      <div class="sb-section">Catálogo</div>
      <div class="sb-item" onclick="showPage('propiedades')" id="nav-propiedades"><i class="ti ti-building"></i> Propiedades</div>
      <div class="sb-item" onclick="openModal(null)" id="nav-nueva"><i class="ti ti-plus"></i> Nueva propiedad</div>
      <div class="sb-item" onclick="showPage('importar')" id="nav-importar"><i class="ti ti-upload"></i> Importar CSV</div>
      <div class="sb-section">Clientes</div>
      <div class="sb-item" onclick="showPage('leads')" id="nav-leads"><i class="ti ti-users"></i> Leads <span class="sb-badge" id="leadsCount">0</span></div>
      <div class="sb-section">Sitios</div>
      <div class="sb-item" onclick="window.open('https://zona-innmueble.com','_blank')" id="nav-zona"><i class="ti ti-world"></i> Zona INNmueble</div>
      <div class="sb-item" onclick="window.open('https://inmuhub.com','_blank')" id="nav-inmu"><i class="ti ti-building-skyscraper"></i> InmuHub</div>
    </div>
    <div class="sb-bottom">
      <div class="sb-user">
        <div class="sb-avatar">ZI</div>
        <div>
          <div class="sb-uname">Admin</div>
          <div class="sb-urole" id="sbRole">zona-innmueble.com</div>
        </div>
      </div>
    </div>
  </div>

  <div class="main">
    <div class="topbar">
      <div class="topbar-title" id="pageTitle">Dashboard</div>
      <button class="btn btn-ghost btn-sm" onclick="triggerRebuildBtn()"><i class="ti ti-refresh"></i> Rebuild sitio</button>
      <button class="btn btn-primary btn-sm" onclick="openModal(null)"><i class="ti ti-plus"></i> Nueva propiedad</button>
      <button class="btn btn-ghost btn-sm" onclick="doLogout()"><i class="ti ti-logout"></i> Salir</button>
    </div>
    <div class="content" id="mainContent"></div>
  </div>
</div>

<!-- MODAL PROPIEDAD -->
<div class="modal-overlay" id="modalOverlay" onclick="if(event.target===this)closeModal()">
  <div class="modal-panel">
    <div class="modal-topbar">
      <button class="btn btn-ghost btn-sm" onclick="closeModal()" style="color:#fff;border-color:rgba(255,255,255,.2)"><i class="ti ti-arrow-left"></i></button>
      <div class="modal-topbar-title" id="modalTitle">Nueva propiedad</div>
      <button class="btn btn-ghost btn-sm" onclick="saveProp()" style="color:#fff;border-color:rgba(255,255,255,.2)"><i class="ti ti-device-floppy"></i> Guardar</button>
    </div>
    <div class="modal-body">
      <div class="form-sections">
        <div class="form-left">

          <!-- BASICA -->
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-info-circle"></i> Información básica</div>
            <div class="fg"><label>Título *</label><input type="text" id="fTitulo" placeholder="Ej: Casa en Kanajuyú · Zona 16"></div>
            <div class="fg-row c2">
              <div class="fg"><label>Precio *</label><input type="text" id="fPrecio" placeholder="Ej: $395,000 o Q 2,500,000"></div>
              <div class="fg"><label>Código</label><input type="text" id="fCodigo" placeholder="CV-001"></div>
            </div>
            <div class="fg-row c3">
              <div class="fg"><label>Tipo</label><select id="fTipo"><option>Casa</option><option>Apartamento</option><option>Finca</option><option>Local</option><option>Terreno</option></select></div>
              <div class="fg"><label>Operación</label><select id="fOperacion"><option>Venta</option><option>Renta</option><option>Venta/Renta</option></select></div>
              <div class="fg"><label>Listing</label><select id="fTipoListing"><option>Residencial</option><option>Finca</option><option>Inversión</option><option>Comercial</option></select></div>
            </div>
            <div class="fg-row c2">
              <div class="fg"><label>Zona / Colonia</label><input type="text" id="fZona" placeholder="Ej: Kanajuyú, Villas de Alcalá"></div>
              <div class="fg"><label>Municipio</label><input type="text" id="fMunicipio" placeholder="Ej: Guatemala, Fraijanes, Mixco"></div>
            </div>
            <div class="fg"><label>Ubicación general (sin dirección exacta)</label><input type="text" id="fUbicacionGeneral" placeholder="Ej: Fraijanes · Carretera a El Salvador · Km 16.5"></div>
          </div>

          <!-- MEDIDAS -->
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-ruler"></i> Medidas y espacios</div>
            <div class="fg-row c4">
              <div class="fg"><label>Área m²</label><input type="text" id="fArea" placeholder="350"></div>
              <div class="fg"><label>Área v²</label><input type="text" id="fAreaV2" placeholder="2048"></div>
              <div class="fg"><label>Habitaciones</label><input type="number" id="fHabitaciones" placeholder="0" min="0"></div>
              <div class="fg"><label>Baños</label><input type="number" id="fBanos" placeholder="0" min="0"></div>
            </div>
            <div class="fg-row c3">
              <div class="fg"><label>Medios baños</label><input type="number" id="fMediosBanos" placeholder="0" min="0"></div>
              <div class="fg"><label>Parqueos</label><input type="number" id="fParqueos" placeholder="0" min="0"></div>
              <div class="fg"><label>Niveles</label><input type="number" id="fNiveles" placeholder="1" min="1"></div>
            </div>
            <div class="fg"><label>Datos técnicos (resumen para la ficha pública)</label><input type="text" id="fDatosTecnicos" placeholder="Ej: 4 hab · 4 baños · 580 m² · Terreno 2,400 m²"></div>
          </div>

          <!-- CONSTRUCCION -->
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-tools"></i> Construcción y acabados</div>
            <div class="fg-row c2">
              <div class="fg"><label>Año de construcción</label><input type="text" id="fAnioConstruccion" placeholder="Ej: 2018"></div>
              <div class="fg"><label>Estado</label><select id="fEstadoConstruccion"><option value="">-- Seleccionar --</option><option>Nueva</option><option>Usada</option><option>En construcción</option><option>En planos</option></select></div>
            </div>
            <div class="fg-row c2">
              <div class="fg"><label>Tipo de construcción</label><select id="fTipoConstruccion"><option value="">-- Seleccionar --</option><option>Block / Concreto</option><option>Mixta</option><option>Madera</option><option>Adobe</option></select></div>
              <div class="fg"><label>Tipo de techo</label><select id="fTecho"><option value="">-- Seleccionar --</option><option>Losa</option><option>Terraza</option><option>Duralita</option><option>Teja</option><option>Mixto</option></select></div>
            </div>
            <div class="fg-row c2">
              <div class="fg"><label>Piso principal</label><select id="fPiso"><option value="">-- Seleccionar --</option><option>Granito</option><option>Porcelanato</option><option>Cerámica</option><option>Madera</option><option>Mármol</option><option>Cemento alisado</option></select></div>
              <div class="fg"><label>Nivel de acabados</label><select id="fAcabados"><option value="">-- Seleccionar --</option><option>Básico</option><option>Medio</option><option>Premium</option><option>Lujo</option></select></div>
            </div>
          </div>

          <!-- DESCRIPCION -->
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-file-text"></i> Descripción</div>
            <div class="fg"><label>Descripción completa</label><textarea id="fDescripcion" style="min-height:100px" placeholder="Descripción detallada para el sitio web..."></textarea></div>
            <div class="fg"><label>Hook para redes sociales</label><input type="text" id="fHook" placeholder="Ej: Hay casas. Y luego está esta."></div>
            <div class="fg"><label>Descripción corta para compartir</label><textarea id="fDescCorta" style="min-height:60px" placeholder="2-3 líneas premium que generen curiosidad sin revelar todo..."></textarea></div>
          </div>

          <!-- CARACTERISTICAS -->
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-tag"></i> Características</div>

            <div class="chars-section">
              <div class="chars-label"><i class="ti ti-map-pin"></i> Ubicación</div>
              <div class="chars-grid" id="chars-ubicacion">
                <label class="char-item"><input type="checkbox" value="Ubicación privilegiada"> Ubicación privilegiada</label>
                <label class="char-item"><input type="checkbox" value="Sobre carretera principal"> Sobre carretera principal</label>
                <label class="char-item"><input type="checkbox" value="Entorno natural y vistas"> Entorno natural y vistas</label>
                <label class="char-item"><input type="checkbox" value="Cerca de servicios"> Cerca de servicios</label>
                <label class="char-item"><input type="checkbox" value="Zona residencial exclusiva"> Zona residencial exclusiva</label>
                <label class="char-item"><input type="checkbox" value="Acceso pavimentado"> Acceso pavimentado</label>
                <label class="char-item"><input type="checkbox" value="Vista al valle"> Vista al valle</label>
                <label class="char-item"><input type="checkbox" value="Vista a montañas"> Vista a montañas</label>
              </div>
            </div>

            <div class="chars-section">
              <div class="chars-label"><i class="ti ti-shield"></i> Seguridad</div>
              <div class="chars-grid" id="chars-seguridad">
                <label class="char-item"><input type="checkbox" value="Garita 24/7"> Garita 24/7</label>
                <label class="char-item"><input type="checkbox" value="Condominio cerrado"> Condominio cerrado</label>
                <label class="char-item"><input type="checkbox" value="Cámaras de seguridad"> Cámaras de seguridad</label>
                <label class="char-item"><input type="checkbox" value="Sistema de alarma"> Sistema de alarma</label>
                <label class="char-item"><input type="checkbox" value="Muros perimetrales"> Muros perimetrales</label>
                <label class="char-item"><input type="checkbox" value="Portón eléctrico"> Portón eléctrico</label>
              </div>
            </div>

            <div class="chars-section">
              <div class="chars-label"><i class="ti ti-droplet"></i> Servicios básicos</div>
              <div class="chars-grid" id="chars-servicios">
                <label class="char-item"><input type="checkbox" value="Agua municipal"> Agua municipal</label>
                <label class="char-item"><input type="checkbox" value="Pozo propio"> Pozo propio</label>
                <label class="char-item"><input type="checkbox" value="Cisterna"> Cisterna</label>
                <label class="char-item"><input type="checkbox" value="Luz 110v/220v"> Luz 110v/220v</label>
                <label class="char-item"><input type="checkbox" value="Panel solar"> Panel solar</label>
                <label class="char-item"><input type="checkbox" value="Internet fibra disponible"> Internet fibra disponible</label>
                <label class="char-item"><input type="checkbox" value="Gas propano"> Gas propano</label>
                <label class="char-item"><input type="checkbox" value="Drenaje municipal"> Drenaje municipal</label>
              </div>
            </div>

            <div class="chars-section">
              <div class="chars-label"><i class="ti ti-car"></i> Vehículos</div>
              <div class="chars-grid" id="chars-vehiculos">
                <label class="char-item"><input type="checkbox" value="Garaje cerrado"> Garaje cerrado</label>
                <label class="char-item"><input type="checkbox" value="Parqueo techado"> Parqueo techado</label>
                <label class="char-item"><input type="checkbox" value="Parqueo descubierto"> Parqueo descubierto</label>
                <label class="char-item"><input type="checkbox" value="Acceso para camión"> Acceso para camión</label>
              </div>
            </div>

            <div class="chars-section">
              <div class="chars-label"><i class="ti ti-tree"></i> Exteriores</div>
              <div class="chars-grid" id="chars-exteriores">
                <label class="char-item"><input type="checkbox" value="Piscina"> Piscina</label>
                <label class="char-item"><input type="checkbox" value="Jardín amplio"> Jardín amplio</label>
                <label class="char-item"><input type="checkbox" value="Área de BBQ"> Área de BBQ</label>
                <label class="char-item"><input type="checkbox" value="Pérgola"> Pérgola</label>
                <label class="char-item"><input type="checkbox" value="Terraza exterior"> Terraza exterior</label>
                <label class="char-item"><input type="checkbox" value="Cancha deportiva"> Cancha deportiva</label>
                <label class="char-item"><input type="checkbox" value="Juegos infantiles"> Juegos infantiles</label>
                <label class="char-item"><input type="checkbox" value="Huerto / área de siembra"> Huerto / área de siembra</label>
              </div>
            </div>

            <div class="chars-section">
              <div class="chars-label"><i class="ti ti-sofa"></i> Interiores</div>
              <div class="chars-grid" id="chars-interiores">
                <label class="char-item"><input type="checkbox" value="Cocina equipada"> Cocina equipada</label>
                <label class="char-item"><input type="checkbox" value="Isla de cocina"> Isla de cocina</label>
                <label class="char-item"><input type="checkbox" value="Walk-in closet"> Walk-in closet</label>
                <label class="char-item"><input type="checkbox" value="Cuarto de servicio con baño"> Cuarto de servicio con baño</label>
                <label class="char-item"><input type="checkbox" value="Bodega"> Bodega</label>
                <label class="char-item"><input type="checkbox" value="Chimenea"> Chimenea</label>
                <label class="char-item"><input type="checkbox" value="Jacuzzi"> Jacuzzi</label>
                <label class="char-item"><input type="checkbox" value="Estudio / Oficina"> Estudio / Oficina</label>
                <label class="char-item"><input type="checkbox" value="Sala familiar"> Sala familiar</label>
                <label class="char-item"><input type="checkbox" value="Sala de cine"> Sala de cine</label>
                <label class="char-item"><input type="checkbox" value="Lavandería interna"> Lavandería interna</label>
                <label class="char-item"><input type="checkbox" value="Bar interior"> Bar interior</label>
              </div>
            </div>

            <div class="chars-section">
              <div class="chars-label"><i class="ti ti-plant"></i> Para fincas</div>
              <div class="chars-grid" id="chars-finca">
                <label class="char-item"><input type="checkbox" value="Agua de nacimiento"> Agua de nacimiento</label>
                <label class="char-item"><input type="checkbox" value="Río o quebrada"> Río o quebrada</label>
                <label class="char-item"><input type="checkbox" value="Luz trifásica"> Luz trifásica</label>
                <label class="char-item"><input type="checkbox" value="Casa del guardián"> Casa del guardián</label>
                <label class="char-item"><input type="checkbox" value="Corrales"> Corrales</label>
                <label class="char-item"><input type="checkbox" value="Cultivo activo"> Cultivo activo</label>
                <label class="char-item"><input type="checkbox" value="Finca inscrita en Registro"> Finca inscrita en Registro</label>
                <label class="char-item"><input type="checkbox" value="Caminos internos"> Caminos internos</label>
              </div>
            </div>

            <div class="chars-section">
              <div class="chars-label"><i class="ti ti-trending-up"></i> Inversión</div>
              <div class="chars-grid" id="chars-inversion">
                <label class="char-item"><input type="checkbox" value="Alta plusvalía"> Alta plusvalía</label>
                <label class="char-item"><input type="checkbox" value="Zona en crecimiento"> Zona en crecimiento</label>
                <label class="char-item"><input type="checkbox" value="Papelería en orden"> Papelería en orden</label>
                <label class="char-item"><input type="checkbox" value="Sin gravámenes"> Sin gravámenes</label>
                <label class="char-item"><input type="checkbox" value="Financiamiento disponible"> Financiamiento disponible</label>
                <label class="char-item"><input type="checkbox" value="Negociable"> Negociable</label>
                <label class="char-item"><input type="checkbox" value="Potencial de desarrollo"> Potencial de desarrollo</label>
                <label class="char-item"><input type="checkbox" value="Apta para alquiler"> Apta para alquiler</label>
              </div>
            </div>
          </div>

          <!-- SHARE -->
          <div class="share-box">
            <div class="share-title"><i class="ti ti-share"></i> Ficha compartible — WhatsApp / Redes</div>
            <div class="fg"><label>URL del PDF (paquete de listado)</label><input type="url" id="fPdfUrl" placeholder="https://drive.google.com/..."></div>
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0">
              <input type="checkbox" id="fPrivada" style="width:15px;height:15px;accent-color:var(--or)">
              <label for="fPrivada" style="font-size:12px;color:#1E40AF;cursor:pointer;font-weight:500">🔒 Propiedad PRIVADA — ocultar precio en la ficha compartible</label>
            </div>
          </div>

          <!-- PRIVADA -->
          <div class="priv-box">
            <div class="priv-title"><i class="ti ti-lock"></i> Información privada — solo visible en admin</div>
            <div class="fg"><label>Precio real / margen de negociación</label><input type="text" id="fPrecioReal" placeholder="Ej: Vendedor acepta mínimo Q 2,200,000"></div>
            <div class="fg"><label>Contacto del vendedor</label><input type="text" id="fContactoVendedor" placeholder="Ej: Juan Pérez · +502 5555-1234"></div>
            <div class="fg"><label>Notas internas</label><textarea id="fNotasInternas" style="min-height:70px" placeholder="Motivación de venta, situación especial, historial de precio, observaciones..."></textarea></div>
            <div class="fg"><label>Estado legal y documentación</label><input type="text" id="fEstadoLegal" placeholder="Ej: Escritura en Registro, sin gravámenes, IUSI al día, hipoteca con Banrural"></div>
          </div>

        </div>

        <!-- COLUMNA DERECHA -->
        <div class="form-right">

          <div class="side-card">
            <div class="side-card-title"><i class="ti ti-photo"></i> Imagen principal</div>
            <div class="fg"><input type="url" id="fImagen" placeholder="https://ik.imagekit.io/Zona/..."></div>
            <div id="imgPreview" style="display:none;margin-top:8px"><img id="imgPreviewEl" style="width:100%;height:120px;object-fit:cover;border-radius:6px;border:1px solid var(--border)"></div>
          </div>

          <div class="side-card">
            <div class="side-card-title"><i class="ti ti-photos"></i> Galería</div>
            <div class="gallery-wrap" id="gWrap"></div>
            <button type="button" onclick="addImg()" style="margin-top:8px;width:100%;padding:7px;border:1.5px dashed var(--border2);border-radius:6px;background:none;font-size:12px;color:var(--text3);cursor:pointer">+ Agregar imagen</button>
          </div>

          <div class="side-card">
            <div class="side-card-title"><i class="ti ti-toggle-right"></i> Estado</div>
            <div class="fg"><select id="fEstado"><option>Activa</option><option>Vendida</option><option>Pausada</option></select></div>
          </div>

          <div class="side-card">
            <div class="side-card-title"><i class="ti ti-world"></i> Publicar en</div>
            <label class="sitio-row"><input type="checkbox" id="sZona" checked>
              <div><div class="sitio-label">Zona INNmueble</div><div class="sitio-url">zona-innmueble.com</div></div>
            </label>
            <label class="sitio-row"><input type="checkbox" id="sInmu" checked>
              <div><div class="sitio-label">InmuHub</div><div class="sitio-url">inmuhub.com</div></div>
            </label>
          </div>

          <div class="side-card">
            <div class="side-card-title"><i class="ti ti-map-pin"></i> Ubicación y SEO</div>
            <div class="fg"><label>Departamento</label>
              <select id="fDepartamento">
                <option value="">-- Seleccionar --</option>
                <option>Guatemala</option><option>Sacatepéquez</option><option>Escuintla</option>
                <option>Chimaltenango</option><option>Baja Verapaz</option><option>Alta Verapaz</option>
                <option>El Progreso</option><option>Jalapa</option><option>Jutiapa</option>
              </select>
            </div>
            <div class="fg"><label>Slug (URL)</label><input type="text" id="fSlug" placeholder="auto-generado desde título"></div>
          </div>

          <div class="side-card">
            <div class="side-card-title"><i class="ti ti-map"></i> Coordenadas (opcional)</div>
            <div class="fg-row c2">
              <div class="fg"><label>Latitud</label><input type="text" id="fLat" placeholder="14.6349"></div>
              <div class="fg"><label>Longitud</label><input type="text" id="fLng" placeholder="-90.5069"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-navy" onclick="saveProp()"><i class="ti ti-device-floppy"></i> Guardar propiedad</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
${js}
</script>
</body>
</html>`;

}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (path === '/dynamic-grid.js') {
      return new Response(getDynamicGridJS(), {
        headers: { 'Content-Type': 'application/javascript', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' },
      });
    }

    if (path === '/' || path === '/admin' || path === '/admin/') {
      return new Response(getAdminHTML(), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    if (path === '/api/login' && method === 'POST') {
      const { user, pass } = await request.json();
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        const token = generateToken();
        await env.DB.put('session:' + token, 'valid', { expirationTtl: SESSION_TTL });
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Set-Cookie': 'session=' + token + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + SESSION_TTL },
        });
      }
      return json({ error: 'Credenciales incorrectas' }, 401);
    }

    if (path === '/api/logout' && method === 'POST') {
      const cookie = request.headers.get('Cookie') || '';
      const match = cookie.match(/session=([^;]+)/);
      if (match) await env.DB.delete('session:' + match[1]);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json', 'Set-Cookie': 'session=; Path=/; Max-Age=0' },
      });
    }

    if (path === '/api/me') {
      const authed = await requireAuth(request, env);
      return authed ? json({ ok: true }) : json({ error: 'No autorizado' }, 401);
    }

    if (path === '/api/public/propiedades' && method === 'GET') {
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const pub = data
        .filter(p => !p.estado || p.estado === 'Activa')
        .map(p => {
          // Si es privada, ocultar precio en la API publica
          if (p.privada) {
            const { precio, priceFormatted, priceNumeric, ...rest } = p;
            return { ...rest, precio: null, priceFormatted: null, priceNumeric: 0 };
          }
          return p;
        });
      return new Response(JSON.stringify(pub), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=60' },
      });
    }




    // PUBLIC - guardar lead sin auth
    if (path === '/api/public/lead' && method === 'POST') {
      const lead = await request.json();
      const raw = await env.DB.get('leads');
      const leads = raw ? JSON.parse(raw) : [];
      lead.id = String(Date.now());
      lead.fecha = new Date().toISOString();
      leads.unshift(lead);
      if (leads.length > 500) leads.splice(500);
      await env.DB.put('leads', JSON.stringify(leads));
      return new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const authed = await requireAuth(request, env);
    if (!authed) return json({ error: 'No autorizado' }, 401);

    if (path === '/api/propiedades/import' && method === 'POST') {
      const data = await request.json();
      if (!Array.isArray(data)) return json({ error: 'Se esperaba un array' }, 400);
      const normalized = data.map((p, i) => ({ ...p, id: p.id || String(Date.now() + i) }));
      await env.DB.put('propiedades', JSON.stringify(normalized));
      await triggerRebuild();
      return json({ ok: true, count: normalized.length }, 201);
    }

    if (path === '/api/propiedades' && method === 'GET') {
      const raw = await env.DB.get('propiedades');
      return json(raw ? JSON.parse(raw) : []);
    }

    if (path === '/api/propiedades' && method === 'POST') {
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const newProp = await request.json();
      newProp.id = String(Date.now());
      newProp.createdAt = new Date().toISOString();
      newProp.slug = newProp.slug || (newProp.titulo||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      data.push(newProp);
      await env.DB.put('propiedades', JSON.stringify(data));
      await triggerRebuild();
      return json(newProp, 201);
    }

    if (path.startsWith('/api/propiedades/') && method === 'PUT') {
      const id = path.split('/').pop();
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      const idx = data.findIndex(p => p.id === id);
      if (idx < 0) return json({ error: 'No encontrado' }, 404);
      const updated = await request.json();
      if (!updated.slug && updated.titulo) updated.slug = (updated.titulo||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      data[idx] = { ...data[idx], ...updated, id };
      await env.DB.put('propiedades', JSON.stringify(data));
      await triggerRebuild();
      return json(data[idx]);
    }

    if (path.startsWith('/api/propiedades/') && method === 'DELETE') {
      const id = path.split('/').pop();
      const raw = await env.DB.get('propiedades');
      const data = raw ? JSON.parse(raw) : [];
      await env.DB.put('propiedades', JSON.stringify(data.filter(p => p.id !== id)));
      await triggerRebuild();
      return json({ ok: true });
    }

    // LEADS API
    if (path === '/api/leads' && method === 'GET') {
      const raw = await env.DB.get('leads');
      return json(raw ? JSON.parse(raw) : []);
    }

    if (path === '/api/leads' && method === 'POST') {
      const lead = await request.json();
      const raw = await env.DB.get('leads');
      const leads = raw ? JSON.parse(raw) : [];
      lead.id = String(Date.now());
      lead.fecha = new Date().toISOString();
      leads.unshift(lead); // mas reciente primero
      // Mantener maximo 500 leads
      if (leads.length > 500) leads.splice(500);
      await env.DB.put('leads', JSON.stringify(leads));
      return json({ ok: true }, 201);
    }

    return json({ error: 'Not found' }, 404);
  },
};
