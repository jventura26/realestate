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
  const zona = esc(prop.zona || prop.municipio || 'Guatemala');
  const tipo = esc(prop.tipo || 'Propiedad');
  const hab = prop.habitaciones && prop.habitaciones !== '0' ? prop.habitaciones + ' hab.' : '';
  const ban = prop.banos && prop.banos !== '0' ? prop.banos + ' ba\u00f1os' : '';
  const isPrivada = prop.privada === true;
  const waMsg = encodeURIComponent('Hola, me interesa: ' + (prop.titulo||'') + '. Vi la ficha y quisiera mas informacion.');
  const shareUrl = 'https://zona-innmueble.com/share/' + prop.slug + '.html';
  const ogTitle = hook || esc(prop.titulo);
  const ogDesc = descCorta || (tipo + ' en ' + zona);

  const precioHTML = isPrivada
    ? '<div class="precio-badge">\uD83D\uDD12 PRECIO DISPONIBLE BAJO SOLICITUD</div>'
    : (prop.priceFormatted ? '<div class="precio">' + esc(prop.priceFormatted) + '</div>' : '');

  const badgesHTML = '<span class="badge">' + tipo + '</span>'
    + '<span class="badge">\uD83D\uDCCD ' + zona + '</span>'
    + (isPrivada ? '<span class="badge badge-privada">\uD83D\uDD12 OFF-MARKET</span>' : '');

  const specsHTML = [hab, ban].filter(Boolean).map(function(s) {
    return '<span class="spec">' + s + '</span>';
  }).join('');

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
    + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&family=Montserrat:wght@400;600;700&display=swap">'
    + '<style>'
    + '*{margin:0;padding:0;box-sizing:border-box;}'
    + 'html,body{height:100%;}'
    + 'body{font-family:\'Montserrat\',sans-serif;background:#0D1B3E;color:white;padding:0!important;margin:0!important;}'
    + '.bg{position:fixed;inset:0;z-index:0;background:url("' + img + '") center/cover no-repeat;}'
    + '.overlay{position:relative;z-index:1;min-height:100vh;background:linear-gradient(to bottom,rgba(13,27,62,.85) 0%,rgba(13,27,62,.95) 60%,rgba(13,27,62,.99) 100%);display:flex;flex-direction:column;align-items:center;}'
    + '.content{width:100%;max-width:640px;padding:48px 24px 48px;flex:1;display:flex;flex-direction:column;}'
    + '.logo{font-family:\'Cormorant Garamond\',serif;font-size:1.1rem;color:rgba(255,255,255,.7);margin-bottom:40px;text-decoration:none;display:inline-block;}'
    + '.logo em{color:#F5820D;font-style:normal;}'
    + '.badges{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;}'
    + '.badge{display:inline-flex;align-items:center;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:100px;padding:5px 14px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.85);}'
    + '.badge-privada{background:rgba(245,130,13,.15);border-color:rgba(245,130,13,.4);color:#F5820D;}'
    + '.hook{font-family:\'Cormorant Garamond\',serif;font-size:clamp(2rem,7vw,3.2rem);font-weight:300;line-height:1.1;color:white;margin-bottom:16px;}'
    + '.desc{font-size:.9rem;color:rgba(255,255,255,.7);line-height:1.8;margin-bottom:20px;font-weight:300;}'
    + '.specs{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px;}'
    + '.spec{font-size:.78rem;font-weight:600;color:rgba(255,255,255,.6);background:rgba(255,255,255,.08);padding:5px 12px;border-radius:100px;}'
    + '.precio{font-family:\'Cormorant Garamond\',serif;font-size:2rem;font-weight:500;color:#F5820D;margin-bottom:28px;}'
    + '.precio-badge{display:inline-flex;align-items:center;background:rgba(245,130,13,.12);border:1px solid rgba(245,130,13,.3);border-radius:100px;padding:7px 18px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#F5820D;margin-bottom:28px;}'
    + '.divider{width:40px;height:2px;background:#F5820D;margin-bottom:28px;}'
    + '.cta-wa{display:flex;align-items:center;justify-content:center;gap:10px;background:#F5820D;color:#0D1B3E;font-size:14px;font-weight:700;padding:15px 24px;border-radius:8px;text-decoration:none;margin-bottom:12px;}'
    + '.cta-detail{display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.15);font-size:13px;font-weight:600;padding:13px 24px;border-radius:8px;text-decoration:none;}'
    + '.footer-txt{margin-top:40px;text-align:center;font-size:10px;color:rgba(255,255,255,.25);letter-spacing:.1em;}'
    + '@media(max-width:480px){.content{padding:32px 18px 36px;}.hook{font-size:1.8rem;}.cta-wa{font-size:13px;padding:14px 18px;}}'
    + '</style>'
    + '</head>'
    + '<body>'
    + '<div class="bg"></div>'
    + '<div class="overlay">'
    + '<div class="content">'
    + '<a href="https://zona-innmueble.com" class="logo"><em>ZONA</em> INNmueble</a>'
    + '<div class="badges">' + badgesHTML + '</div>'
    + (hook ? '<h1 class="hook">' + hook + '</h1>' : '')
    + (descCorta ? '<p class="desc">' + descCorta + '</p>' : '')
    + (specsHTML ? '<div class="specs">' + specsHTML + '</div>' : '')
    + precioHTML
    + '<div class="divider"></div>'
    + '<a href="https://wa.me/' + WA + '?text=' + waMsg + '" target="_blank" rel="noopener" class="cta-wa">'
    + '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
    + 'Solicitar informaci\u00f3n privada'
    + '</a>'
    + '<a href="/propiedades/' + prop.slug + '.html" class="cta-detail">Ver ficha completa \u2192</a>'
    + '<div class="footer-txt">ZONA INNMUEBLE \u00b7 GUATEMALA PREMIUM REAL ESTATE</div>'
    + '</div>'
    + '</div>'
    + '</body>'
    + '</html>';
}

module.exports = { sharePage };
