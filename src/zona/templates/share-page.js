function sharePage(prop) {
  const WA = '50245542088';

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  const img = prop.mainImageThumb || prop.imagen || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';
  const hook = esc(prop.hook || prop.titulo || '');
  const descCorta = esc(prop.descCorta || '');
  const ubicacion = esc(prop.ubicacionGeneral || prop.zona || prop.municipio || 'Guatemala');
  const tipo = esc(prop.tipo || 'Propiedad');
  const tipoListing = esc(prop.tipoListing || 'Residencial');
  const datosTecnicos = esc(prop.datosTecnicos || '');
  const isPrivada = prop.privada === true;
  const pdfUrl = prop.pdfUrl || '';
  const waMsg = encodeURIComponent('Hola, me interesa la propiedad: ' + (prop.titulo||'') + '. Quisiera recibir el paquete de informacion completo.');
  const shareUrl = 'https://zona-innmueble.com/share/' + prop.slug + '.html';
  const ogTitle = hook || esc(prop.titulo);
  const ogDesc = descCorta || (tipo + ' · ' + ubicacion + (isPrivada ? ' · Precio bajo solicitud' : ''));

  const precioHTML = isPrivada
    ? '<div class="precio-tag">Precio disponible bajo solicitud</div>'
    : (prop.priceFormatted ? '<div class="precio-tag precio-visible">' + esc(prop.priceFormatted) + '</div>' : '');

  const codigoRef = prop.codigo
    ? '<div style="font-size:.58rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-top:6px">Ref. ' + esc(prop.codigo) + '</div>'
    : '';

  const charsHtml = (prop.caracteristicas && prop.caracteristicas.length && !isPrivada)
    ? '<div style="margin-top:18px;padding-top:18px;border-top:1px solid rgba(255,255,255,.1)">'
      + '<div style="font-size:.54rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(245,130,13,.8);margin-bottom:8px">Características</div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:5px">'
      + prop.caracteristicas.slice(0,8).map(function(ch){ return '<span style="font-size:.64rem;padding:4px 9px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:3px;color:rgba(255,255,255,.65)">✓ ' + esc(ch) + '</span>'; }).join('')
      + '</div></div>'
    : '';

  const propSlug = prop.slug || '';
  const propNombre = esc(prop.titulo || '');
  const pdfTarget = pdfUrl ? esc(pdfUrl) : '';
  
  // Formulario de captura antes del PDF
  const captureForm = '<div id="form-capture">'
    + '<div class="pkg-title">Acceder al paquete de informacion</div>'
    + '<div class="pkg-desc">Completa tus datos para descargar la ficha completa con fotografia, planos y precio.</div>'
    + '<div class="form-field"><input type="text" id="f-nombre" placeholder="Tu nombre completo" required></div>'
    + '<div class="form-field"><input type="tel" id="f-telefono" placeholder="Tu telefono (WhatsApp)" required></div>'
    + '<div class="form-field"><select id="f-tipo"><option value="">Soy...</option><option value="Interesado">Comprador interesado</option><option value="Asesor">Asesor inmobiliario</option><option value="Inversionista">Inversionista</option></select></div>'
    + '<button class="btn-pdf" onclick="submitLead()" id="btn-submit">Acceder a la ficha completa</button>'
    + '<p id="form-error" style="color:#F5820D;font-size:.72rem;margin-top:8px;display:none">Por favor completa todos los campos.</p>'
    + '</div>'
    + '<div id="form-success" style="display:none">'
    + (pdfTarget
      ? '<a href="' + pdfTarget + '" target="_blank" rel="noopener" class="btn-pdf" id="btn-download">Descargar ficha completa (PDF)</a>'
      : '<a href="https://wa.me/' + WA + '?text=' + encodeURIComponent('Hola, llene el formulario y quisiera la ficha completa de: ' + (prop.titulo||'')) + '" target="_blank" rel="noopener" class="btn-pdf">Recibir ficha por WhatsApp</a>'
    )
    + '<p style="font-size:.72rem;color:rgba(255,255,255,.35);margin-top:10px;text-align:center">Gracias. Te contactaremos pronto.</p>'
    + '</div>'
    + '<script>'
    + 'function submitLead(){'
    + 'var n=document.getElementById("f-nombre").value.trim();'
    + 'var t=document.getElementById("f-telefono").value.trim();'
    + 'var tp=document.getElementById("f-tipo").value;'
    + 'if(!n||!t||!tp){document.getElementById("form-error").style.display="block";return;}'
    + 'document.getElementById("form-error").style.display="none";'
    + 'var btn=document.getElementById("btn-submit");'
    + 'btn.textContent="Guardando...";btn.style.opacity=".7";btn.disabled=true;'
    + 'fetch("https://zona-inmu.tours-virtuales-gt.workers.dev/api/public/lead",{'
    + 'method:"POST",'
    + 'headers:{"Content-Type":"application/json"},'
    + 'body:JSON.stringify({nombre:n,telefono:t,tipo:tp,propiedad:"' + propNombre + '",slug:"' + propSlug + '"})'
    + '}).then(function(){document.getElementById("form-capture").style.display="none";document.getElementById("form-success").style.display="block";}).catch(function(){document.getElementById("form-capture").style.display="none";document.getElementById("form-success").style.display="block";});'
    + '}'
    + '<\/script>';

  const pdfBtn = captureForm;

  return '<!DOCTYPE html>'
    + '<html lang="es">'
    + '<head>'
    + '<meta charset="UTF-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + ogTitle + ' | Zona INNmueble</title>'
    + '<meta name="description" content="' + ogDesc + '">'
    + '<meta property="og:title" content="' + ogTitle + '">'
    + '<meta property="og:description" content="' + ogDesc + '">'
    + '<meta property="og:image" content="' + esc(img) + '">'
    + '<meta property="og:url" content="' + shareUrl + '">'
    + '<meta property="og:type" content="website">'
    + '<meta name="twitter:card" content="summary_large_image">'
    + '<meta name="robots" content="noindex,nofollow">'
    + '<link rel="preconnect" href="https://fonts.googleapis.com">'
    + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap">'
    + '<style>'
    + '*{margin:0;padding:0;box-sizing:border-box;}'
    + 'html,body{height:100%;}'
    + 'body{font-family:\'Montserrat\',sans-serif;background:#08111f;color:white;padding:0!important;margin:0!important;}'

    /* HERO imagen */
    + '.hero{position:relative;height:55vh;min-height:280px;overflow:hidden;}'
    + '.hero-img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.75);}'
    + '.hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(8,17,31,.3) 0%,rgba(8,17,31,.7) 100%);}'
    + '.hero-top{position:absolute;top:0;left:0;right:0;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;}'
    + '.logo{font-family:\'Cormorant Garamond\',serif;font-size:1rem;color:rgba(255,255,255,.85);text-decoration:none;letter-spacing:.04em;}'
    + '.logo em{color:#F5820D;font-style:normal;}'
    + '.badge-offmarket{display:inline-flex;align-items:center;gap:6px;background:rgba(8,17,31,.7);border:1px solid rgba(245,130,13,.5);border-radius:4px;padding:4px 12px;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#F5820D;backdrop-filter:blur(8px);}'
    + '.hero-bottom{position:absolute;bottom:0;left:0;right:0;padding:20px 24px;}'
    + '.tipo-listing{font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:8px;}'
    + '.precio-tag{display:inline-block;font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;font-weight:400;color:rgba(255,255,255,.6);font-style:italic;letter-spacing:.02em;}'
    + '.precio-visible{color:#F5820D;font-style:normal;font-weight:500;}'

    /* CONTENIDO */
    + '.content{padding:28px 24px 40px;max-width:680px;margin:0 auto;}'
    + '.ubicacion{font-size:10px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:16px;}'
    + '.hook{font-family:\'Cormorant Garamond\',serif;font-size:clamp(1.8rem,5vw,2.8rem);font-weight:300;line-height:1.1;color:white;margin-bottom:16px;}'
    + '.desc{font-size:.82rem;color:rgba(255,255,255,.5);line-height:1.85;margin-bottom:24px;font-weight:300;}'
    + '.divider{width:32px;height:1px;background:#F5820D;margin-bottom:24px;}'
    + '.datos{font-size:.78rem;color:rgba(255,255,255,.55);letter-spacing:.06em;margin-bottom:28px;line-height:1.8;}'
    + '.datos strong{color:rgba(255,255,255,.8);font-weight:600;}'

    /* PDF / CTA principal */
    + '.pkg-box{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:20px;margin-bottom:16px;}'
    + '.pkg-title{font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:6px;}'
    + '.pkg-desc{font-size:.78rem;color:rgba(255,255,255,.35);margin-bottom:16px;line-height:1.6;}'
    + '.btn-pdf{display:flex;align-items:center;justify-content:center;gap:8px;background:#F5820D;color:#08111f;font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:13px 20px;border-radius:6px;text-decoration:none;}'
    + '.btn-wa{display:flex;align-items:center;justify-content:center;gap:8px;background:transparent;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.12);font-size:.72rem;font-weight:500;padding:11px 20px;border-radius:6px;text-decoration:none;margin-top:10px;}'
    + '.btn-wa:hover{border-color:rgba(255,255,255,.25);color:rgba(255,255,255,.7);}'
    + '.confidential{text-align:center;font-size:9px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.2);margin-top:28px;line-height:1.8;}'

    + '.form-field{margin-bottom:10px;}'
    + '.form-field input,.form-field select{width:100%;padding:11px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:6px;color:white;font-size:.82rem;font-family:inherit;outline:none;}'
    + '.form-field input::placeholder{color:rgba(255,255,255,.3);}'
    + '.form-field input:focus,.form-field select:focus{border-color:#F5820D;}'
    + '.form-field select{cursor:pointer;}'
    + '.form-field select option{background:#08111f;color:white;}'
    + '@media(max-width:480px){'
    + '.hero{height:45vh;}'
    + '.content{padding:22px 18px 36px;}'
    + '.hook{font-size:1.6rem;}'
    + '.btn-pdf{font-size:.72rem;padding:12px 16px;}'
    + '}'
    + '</style>'
    + '</head>'
    + '<body>'

    /* HERO */
    + '<div class="hero">'
    + '<img src="' + esc(img) + '" alt="' + esc(prop.titulo||'') + '" class="hero-img" loading="eager">'
    + '<div class="hero-overlay"></div>'
    + '<div class="hero-top">'
    + '<a href="https://zona-innmueble.com" class="logo"><em>ZONA</em> INNmueble</a>'
    + (isPrivada ? '<span class="badge-offmarket">🔒 Off-Market</span>' : '')
    + '</div>'
    + '<div class="hero-bottom">'
    + '<div class="tipo-listing">' + tipoListing + ' · Listado privado</div>'
    + precioHTML
    + codigoRef
    + '</div>'
    + '</div>'

    /* CONTENIDO */
    + '<div class="content">'
    + '<div class="ubicacion">📍 ' + ubicacion + '</div>'
    + (hook ? '<h1 class="hook">' + hook + '</h1>' : '')
    + (descCorta ? '<p class="desc">' + descCorta + '</p>' : '')
    + charsHtml
    + '<div class="divider"></div>'
    + (datosTecnicos ? '<div class="datos">' + datosTecnicos + '</div>' : '')

    /* Paquete */
    + '<div class="pkg-box">'
    + '<div class="pkg-title">Paquete de informacion</div>'
    + '<div class="pkg-desc">Fotografia completa, planos, datos legales y precio disponibles para compradores calificados.</div>'
    + pdfBtn
    + '</div>'

    /* WA secundario */
    + '<a href="https://wa.me/' + WA + '?text=' + waMsg + '" target="_blank" rel="noopener" class="btn-wa">'
    + '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
    + 'Consultar por WhatsApp'
    + '</a>'

    + '<div class="confidential">'
    + 'Este listado es confidencial y esta destinado unicamente a compradores calificados.<br>'
    + 'No distribuir publicamente · Zona INNmueble · Guatemala'
    + '</div>'
    + '</div>'
    + '</body>'
    + '</html>';
}

module.exports = { sharePage };
