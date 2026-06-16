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
    "    if(r.ok){document.getElementById('loginPage').style.display='none';document.getElementById('adminShell').style.display='block';loadProps();}",
    "    else{var e=document.getElementById('loginErr');e.style.display='block';setTimeout(function(){e.style.display='none'},3000);}",
    "  }catch(e){var er=document.getElementById('loginErr');er.textContent='Error: '+e.message;er.style.display='block';}",
    "  finally{btn.textContent='Ingresar al panel';btn.disabled=false;}",
    "}",
    "document.addEventListener('keydown',function(e){if(e.key==='Enter'&&document.getElementById('loginPage').style.display!=='none')doLogin();});",
    "async function doLogout(){await fetch('/api/logout',{method:'POST'});location.reload();}",
    "async function checkSession(){var r=await fetch('/api/me');if(r.ok){document.getElementById('loginPage').style.display='none';document.getElementById('adminShell').style.display='block';loadProps();}}",
    "async function loadProps(){var r=await fetch('/api/propiedades');if(r.ok){props=await r.json();updateStats();renderTable();}}",
    "function updateStats(){",
    "  document.getElementById('statTotal').textContent=props.length;",
    "  document.getElementById('statActivas').textContent=props.filter(function(p){return p.estado==='Activa';}).length;",
    "  document.getElementById('statVenta').textContent=props.filter(function(p){return p.operacion==='Venta'||p.operacion==='Venta/Renta';}).length;",
    "  document.getElementById('statRenta').textContent=props.filter(function(p){return p.operacion==='Renta'||p.operacion==='Venta/Renta';}).length;",
    "}",
    "function renderTable(){",
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
    "  document.querySelectorAll('#charsSection input[type=checkbox]').forEach(function(cb){",
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
    "  var data={titulo:titulo,precio:precio,tipo:document.getElementById('fTipo').value,operacion:document.getElementById('fOperacion').value,zona:document.getElementById('fZona').value,area:document.getElementById('fArea').value,habitaciones:document.getElementById('fHabitaciones').value,banos:document.getElementById('fBanos').value,imagen:imgM,mainImage:imgM,mainImageThumb:imgM,gallery:allG,descripcion:document.getElementById('fDescripcion').value,estado:document.getElementById('fEstado').value,sitios:sits,caracteristicas:getCheckedChars(),codigo:document.getElementById('fCodigo').value,hook:document.getElementById('fHook').value.trim(),descCorta:document.getElementById('fDescCorta').value.trim(),privada:document.getElementById('fPrivada').checked};",
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
    "checkSession();"
  ].join('\n');
}

function getAdminHTML() {
  const js = getAdminJS();
  return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Admin - Zona INNmueble</title>\n<style>\n:root{--navy:#0D1B3E;--orange:#F5820D;--steel:#3A6186;--muted:#6c757d;}\n*{margin:0;padding:0;box-sizing:border-box;}\nbody{font-family:system-ui,sans-serif;background:var(--navy);color:#1a1a2e;}\ninput,button,select,textarea{font-family:inherit;}\n.login-wrap{display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px;}\n.login-card{background:white;border-radius:12px;padding:48px 40px;width:100%;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,.4);}\n.login-logo{color:var(--navy);font-size:22px;font-weight:800;margin-bottom:8px;}\n.login-logo span{color:var(--orange);}\n.login-sub{color:var(--muted);font-size:13px;margin-bottom:32px;}\n.field{margin-bottom:16px;}\n.field label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--navy);margin-bottom:6px;}\n.field input{width:100%;padding:11px 14px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:14px;}\n.btn-primary{width:100%;padding:13px;background:var(--navy);color:white;border:none;border-radius:6px;font-weight:700;font-size:14px;cursor:pointer;}\n.err-msg{background:#fef2f2;color:#b91c1c;border-radius:6px;padding:10px 14px;font-size:13px;margin-top:14px;display:none;}\n.shell{display:none;min-height:100vh;background:#f0f2f5;}\n.topbar{background:var(--navy);padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}\n.topbar-brand{color:white;font-weight:800;font-size:16px;}\n.topbar-brand span{color:var(--orange);}\n.topbar-right{display:flex;align-items:center;gap:12px;}\n.btn-sm{padding:7px 14px;border-radius:5px;font-size:12px;font-weight:700;cursor:pointer;border:none;}\n.btn-import{background:var(--steel);color:white;}\n.btn-add{background:var(--orange);color:white;}\n.btn-logout{background:rgba(255,255,255,.15);color:white;}\n.btn-danger{background:#ef4444;color:white;}\n.btn-edit{background:var(--steel);color:white;}\n.main{max-width:1200px;margin:0 auto;padding:28px 20px;}\n.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:24px;}\n.stat-card{background:white;border-radius:10px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.08);}\n.stat-label{font-size:11px;font-weight:700;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}\n.stat-value{font-size:32px;font-weight:800;color:var(--navy);}\n.stat-value.orange{color:var(--orange);}\n.import-panel{background:white;border-radius:10px;padding:24px;margin-bottom:20px;display:none;box-shadow:0 1px 4px rgba(0,0,0,.08);}\n.import-panel.open{display:block;}\n.drop-zone{border:2px dashed #d0d5dd;border-radius:8px;padding:36px;text-align:center;cursor:pointer;background:#fafafa;}\n.drop-zone:hover{border-color:var(--navy);}\n.preview-info{background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:12px 16px;display:flex;justify-content:space-between;margin:14px 0;}\n.progress-wrap{display:none;margin-bottom:12px;}\n.progress-bar-bg{background:#e5e7eb;border-radius:99px;height:8px;overflow:hidden;}\n.progress-bar{background:var(--orange);height:8px;border-radius:99px;width:0%;transition:width .3s;}\n.progress-label{font-size:12px;color:var(--muted);margin-top:5px;}\n.import-preview{display:none;}\n.import-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:12px;}\n.table-card{background:white;border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow:hidden;}\n.table-header{padding:18px 22px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #f0f0f0;}\n.table-title{font-size:15px;font-weight:700;color:var(--navy);}\n.search-input{padding:8px 12px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:13px;width:200px;}\ntable{width:100%;border-collapse:collapse;}\nth{font-size:11px;font-weight:700;text-transform:uppercase;color:var(--muted);padding:11px 14px;text-align:left;background:#fafafa;border-bottom:1px solid #f0f0f0;}\ntd{padding:13px 14px;font-size:13px;border-bottom:1px solid #f8f8f8;vertical-align:middle;}\ntr:last-child td{border-bottom:none;}\ntr:hover td{background:#fafbff;}\n.badge{display:inline-block;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;}\n.badge-green{background:#dcfce7;color:#166534;}\n.badge-blue{background:#dbeafe;color:#1e40af;}\n.badge-orange{background:#ffedd5;color:#9a3412;}\n.prop-title{font-weight:600;color:var(--navy);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n.prop-price{font-weight:700;color:var(--orange);}\n.actions{display:flex;gap:6px;}\n.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:none;justify-content:center;align-items:flex-start;padding:40px 20px;z-index:200;overflow-y:auto;}\n.modal-overlay.open{display:flex;}\n.modal{background:white;border-radius:12px;width:100%;max-width:640px;padding:32px;}\n.modal-title{font-size:17px;font-weight:800;color:var(--navy);margin-bottom:22px;}\n.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}\n.form-grid .full{grid-column:1/-1;}\n.form-field label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--navy);margin-bottom:5px;}\n.form-field input,.form-field select,.form-field textarea{width:100%;padding:10px 12px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:13px;}\n.form-field textarea{resize:vertical;min-height:80px;}\n.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:22px;}\n.btn-cancel{background:#f0f2f5;color:#1a1a2e;padding:10px 18px;border:none;border-radius:6px;font-weight:700;cursor:pointer;}\n.btn-save{background:var(--navy);color:white;padding:10px 22px;border:none;border-radius:6px;font-weight:700;cursor:pointer;}\n.gallery-wrap{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}\n.gi{position:relative;width:90px;}\n.gi img{width:90px;height:65px;object-fit:cover;border-radius:4px;border:1.5px solid #e0e0e0;}\n.gi-rm{position:absolute;top:2px;right:2px;background:#ef4444;color:white;border:none;border-radius:3px;width:16px;height:16px;font-size:10px;cursor:pointer;}\n.char-group{margin-bottom:14px;}\n.char-group-title{font-size:11px;font-weight:700;text-transform:uppercase;color:var(--navy);margin-bottom:8px;padding-top:8px;border-top:1px solid #f0f0f0;}\n.char-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;}\n.char-item{display:flex;align-items:center;gap:6px;font-size:12px;padding:5px 8px;border:1.5px solid #e0e0e0;border-radius:6px;cursor:pointer;}\n.char-item input{margin:0;cursor:pointer;width:14px;height:14px;flex-shrink:0;}\n.char-item.on{background:#f0f3ff;border-color:var(--navy);}\n.sitio-sel{display:flex;gap:20px;padding:8px 0;}\n.sitio-sel label{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;cursor:pointer;}\n.share-box{background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin-top:8px;}\n.share-box-title{font-size:11px;font-weight:700;text-transform:uppercase;color:#0369a1;margin-bottom:10px;display:flex;align-items:center;gap:6px;}\n.privada-toggle{display:flex;align-items:center;gap:10px;padding:10px 0;}\n.privada-toggle input[type=checkbox]{width:18px;height:18px;cursor:pointer;accent-color:var(--orange);}\n.privada-toggle label{font-size:13px;font-weight:600;color:var(--navy);cursor:pointer;}\n.toast{position:fixed;bottom:24px;right:24px;background:#1e293b;color:white;padding:12px 18px;border-radius:8px;font-size:13px;font-weight:600;transform:translateY(80px);opacity:0;transition:all .3s;z-index:300;}\n.toast.show{transform:translateY(0);opacity:1;}\n.toast.success{border-left:4px solid #22c55e;}\n.toast.error{border-left:4px solid #ef4444;}\n</style>\n</head>\n<body>\n<div id="loginPage" class="login-wrap">\n  <div class="login-card">\n    <div class="login-logo"><span>Zona</span>-INNmueble</div>\n    <div class="login-sub">Panel de administracion</div>\n    <div class="field"><label>Usuario</label><input type="text" id="loginUser" placeholder="admin" autocomplete="username"></div>\n    <div class="field"><label>Contrasena</label><input type="password" id="loginPass" autocomplete="current-password"></div>\n    <button class="btn-primary" id="loginBtn" onclick="doLogin()">Ingresar al panel</button>\n    <div class="err-msg" id="loginErr">Usuario o contrasena incorrectos.</div>\n  </div>\n</div>\n<div id="adminShell" class="shell">\n  <div class="topbar">\n    <div class="topbar-brand"><span>Zona</span>-INNmueble Admin</div>\n    <div class="topbar-right">\n      <button class="btn-sm btn-import" onclick="toggleImport()">Importar CSV</button>\n      <button class="btn-sm btn-add" onclick="openModal(null)">+ Nueva propiedad</button>\n      <button class="btn-sm btn-logout" onclick="doLogout()">Salir</button>\n    </div>\n  </div>\n  <div class="main">\n    <div class="import-panel" id="importPanel">\n      <div style="font-size:15px;font-weight:700;color:var(--navy);margin-bottom:6px">Importar CSV</div>\n      <div style="font-size:13px;color:var(--muted);margin-bottom:16px">Sube el archivo propiedades.csv exportado de Wix.</div>\n      <div class="drop-zone" id="dropZone" onclick="triggerFileInput()">\n        <div style="font-size:13px;color:var(--muted)"><strong style="color:var(--navy)">Click para seleccionar</strong> o arrastra el CSV aqui</div>\n        <input type="file" id="csvFile" accept=".csv" style="display:none" onchange="handleFile(this.files[0])">\n      </div>\n      <div class="import-preview" id="importPreview">\n        <div class="preview-info"><span id="previewText">0 propiedades listas</span><span id="previewFile" style="color:var(--muted)"></span></div>\n        <div class="progress-wrap" id="progressWrap"><div class="progress-bar-bg"><div class="progress-bar" id="progressBar"></div></div><div class="progress-label" id="progressLabel"></div></div>\n        <div class="import-actions"><button class="btn-cancel" onclick="cancelImport()">Cancelar</button><button class="btn-save" id="btnImport" onclick="doImport()">Importar al KV</button></div>\n      </div>\n    </div>\n    <div class="stats">\n      <div class="stat-card"><div class="stat-label">Total</div><div class="stat-value" id="statTotal">0</div></div>\n      <div class="stat-card"><div class="stat-label">Activas</div><div class="stat-value orange" id="statActivas">0</div></div>\n      <div class="stat-card"><div class="stat-label">Venta</div><div class="stat-value" id="statVenta">0</div></div>\n      <div class="stat-card"><div class="stat-label">Renta</div><div class="stat-value" id="statRenta">0</div></div>\n    </div>\n    <div class="table-card">\n      <div class="table-header"><div class="table-title">Propiedades</div>\n      <input class="search-input" type="text" placeholder="Buscar..." id="searchInput" oninput="renderTable()"></div>\n      <div id="tableWrap"></div>\n    </div>\n  </div>\n</div>\n<div class="modal-overlay" id="modalOverlay" onclick="if(event.target===this)closeModal()">\n  <div class="modal">\n    <div class="modal-title" id="modalTitle">Nueva propiedad</div>\n    <div class="form-grid">\n      <div class="form-field full"><label>Titulo *</label><input type="text" id="fTitulo"></div>\n      <div class="form-field"><label>Precio *</label><input type="text" id="fPrecio" placeholder="Q 2,500,000"></div>\n      <div class="form-field"><label>Tipo</label><select id="fTipo"><option>Casa</option><option>Apartamento</option><option>Finca</option><option>Local</option><option>Terreno</option></select></div>\n      <div class="form-field"><label>Operacion</label><select id="fOperacion"><option>Venta</option><option>Renta</option><option>Venta/Renta</option></select></div>\n      <div class="form-field"><label>Zona</label><input type="text" id="fZona"></div>\n      <div class="form-field"><label>Area m2</label><input type="text" id="fArea"></div>\n      <div class="form-field"><label>Habitaciones</label><input type="number" id="fHabitaciones"></div>\n      <div class="form-field"><label>Banos</label><input type="number" id="fBanos"></div>\n      <div class="form-field full"><label>Imagen principal (URL)</label><input type="url" id="fImagen" placeholder="https://..."></div>\n      <div class="form-field full">\n        <label>Galeria adicional (max 50)</label>\n        <div class="gallery-wrap" id="gWrap"></div>\n        <button type="button" onclick="addImg()" style="margin-top:6px;padding:6px 14px;border:1.5px dashed #d0d5dd;border-radius:6px;background:none;font-size:12px;color:var(--muted);cursor:pointer">+ Agregar imagen</button>\n      </div>\n      <div class="form-field full">\n        <label>Caracteristicas</label>\n        <div id="charsSection" style="margin-top:6px">\n          <div class="char-group"><div class="char-group-title">Ubicacion</div><div class="char-grid">\n            <label class="char-item"><input type="checkbox" value="Ubicacion privilegiada"> Ubicacion privilegiada</label>\n            <label class="char-item"><input type="checkbox" value="Sobre carretera"> Sobre carretera</label>\n            <label class="char-item"><input type="checkbox" value="Entorno natural y vistas"> Entorno natural y vistas</label>\n            <label class="char-item"><input type="checkbox" value="Cerca de servicios"> Cerca de servicios</label>\n            <label class="char-item"><input type="checkbox" value="Zona residencial"> Zona residencial</label>\n            <label class="char-item"><input type="checkbox" value="Acceso pavimentado"> Acceso pavimentado</label>\n          </div></div>\n          <div class="char-group"><div class="char-group-title">Terreno</div><div class="char-grid">\n            <label class="char-item"><input type="checkbox" value="Amplio espacio"> Amplio espacio</label>\n            <label class="char-item"><input type="checkbox" value="Topografia aprovechable"> Topografia aprovechable</label>\n            <label class="char-item"><input type="checkbox" value="Acceso a servicios"> Acceso a servicios</label>\n            <label class="char-item"><input type="checkbox" value="Vista al valle"> Vista al valle</label>\n            <label class="char-item"><input type="checkbox" value="Terreno plano"> Terreno plano</label>\n            <label class="char-item"><input type="checkbox" value="Con jardin"> Con jardin</label>\n          </div></div>\n          <div class="char-group"><div class="char-group-title">Ideal para</div><div class="char-grid">\n            <label class="char-item"><input type="checkbox" value="Casa de descanso"> Casa de descanso</label>\n            <label class="char-item"><input type="checkbox" value="Proyecto agricola"> Proyecto agricola</label>\n            <label class="char-item"><input type="checkbox" value="Desarrollo habitacional"> Desarrollo habitacional</label>\n            <label class="char-item"><input type="checkbox" value="Hotel ecologico"> Hotel ecologico</label>\n            <label class="char-item"><input type="checkbox" value="Inversion"> Inversion</label>\n            <label class="char-item"><input type="checkbox" value="Vivienda familiar"> Vivienda familiar</label>\n          </div></div>\n          <div class="char-group"><div class="char-group-title">Amenidades</div><div class="char-grid">\n            <label class="char-item"><input type="checkbox" value="Piscina"> Piscina</label>\n            <label class="char-item"><input type="checkbox" value="Jardin"> Jardin</label>\n            <label class="char-item"><input type="checkbox" value="Pergola"> Pergola</label>\n            <label class="char-item"><input type="checkbox" value="Chimenea"> Chimenea</label>\n            <label class="char-item"><input type="checkbox" value="Jacuzzi"> Jacuzzi</label>\n            <label class="char-item"><input type="checkbox" value="Churrasquera"> Churrasquera</label>\n            <label class="char-item"><input type="checkbox" value="Terraza"> Terraza</label>\n            <label class="char-item"><input type="checkbox" value="Estudio"> Estudio</label>\n            <label class="char-item"><input type="checkbox" value="Cuarto de servicio"> Cuarto de servicio</label>\n            <label class="char-item"><input type="checkbox" value="Bodega"> Bodega</label>\n          </div></div>\n          <div class="char-group"><div class="char-group-title">Inversion</div><div class="char-grid">\n            <label class="char-item"><input type="checkbox" value="Alta plusvalia"> Alta plusvalia</label>\n            <label class="char-item"><input type="checkbox" value="Zona en crecimiento"> Zona en crecimiento</label>\n            <label class="char-item"><input type="checkbox" value="Papeleria en orden"> Papeleria en orden</label>\n            <label class="char-item"><input type="checkbox" value="Sin gravamenes"> Sin gravamenes</label>\n            <label class="char-item"><input type="checkbox" value="Financiamiento disponible"> Financiamiento disponible</label>\n            <label class="char-item"><input type="checkbox" value="Negociable"> Negociable</label>\n          </div></div>\n        </div>\n      </div>\n      <div class="form-field full"><label>Descripcion</label><textarea id="fDescripcion"></textarea></div>\n      <div class="form-field full">\n        <div class="share-box">\n          <div class="share-box-title">🔗 Ficha compartible (WhatsApp / Facebook)</div>\n          <div class="form-field" style="margin-bottom:10px"><label>Hook — frase que detiene el scroll</label><input type="text" id="fHook" placeholder="Ej: Hay casas. Y luego esta."></div>\n          <div class="form-field" style="margin-bottom:10px"><label>Descripcion corta para compartir</label><textarea id="fDescCorta" style="min-height:60px" placeholder="2-3 lineas premium que generen curiosidad sin revelar todo..."></textarea></div>\n          <div class="privada-toggle">\n            <input type="checkbox" id="fPrivada">\n            <label for="fPrivada">🔒 Propiedad PRIVADA — ocultar precio en la ficha compartible</label>\n          </div>\n          <div style="font-size:11px;color:var(--muted);margin-top:4px">Si esta activo, el link compartible no mostrara el precio. Solo zona, tipo y datos generales.</div>\n        </div>\n      </div>\n      <div class="form-field"><label>Codigo referencia</label><input type="text" id="fCodigo" placeholder="CV-001"></div>\n      <div class="form-field"><label>Estado</label><select id="fEstado"><option>Activa</option><option>Vendida</option><option>Pausada</option></select></div>\n      <div class="form-field full"><label>Publicar en</label>\n        <div class="sitio-sel">\n          <label><input type="checkbox" id="sZona" checked> zona-innmueble.com</label>\n          <label><input type="checkbox" id="sInmu" checked> inmuhub.com</label>\n        </div>\n      </div>\n    </div>\n    <div class="modal-actions"><button class="btn-cancel" onclick="closeModal()">Cancelar</button><button class="btn-save" onclick="saveProp()">Guardar propiedad</button></div>\n  </div>\n</div>\n<div class="toast" id="toast"></div>\n<script>\n' + js + '\n</scr' + 'ipt>\n</body>\n</html>';
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

    return json({ error: 'Not found' }, 404);
  },
};
