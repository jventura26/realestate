function sharePage(prop) {
  const WA = '50245542088';
  const img = prop.mainImageThumb || prop.imagen || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';
  const hook = prop.hook || prop.titulo || '';
  const descCorta = prop.descCorta || '';
  const zona = prop.zona || prop.municipio || 'Guatemala';
  const tipo = prop.tipo || 'Propiedad';
  const hab = prop.habitaciones && prop.habitaciones !== '0' ? prop.habitaciones + ' hab.' : '';
  const ban = prop.banos && prop.banos !== '0' ? prop.banos + ' baños' : '';
  const specs = [hab, ban].filter(Boolean).join(' · ');
  const isPrivada = prop.privada === true;
  const precioHTML = isPrivada
    ? '<div style="display:inline-flex;align-items:center;gap:8px;background:rgba(245,130,13,.12);border:1px solid rgba(245,130,13,.3);border-radius:100px;padding:6px 16px;margin-bottom:32px"><span style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#F5820D">🔒 Precio disponible bajo solicitud</span></div>'
    : '<div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:2.4rem;font-weight:500;color:#F5820D;margin-bottom:32px">' + (prop.priceFormatted || prop.precio || '') + '</div>';
  const waMsg = encodeURIComponent('Hola, me interesa la propiedad: ' + prop.titulo + '. Vi la ficha y quisiera más información.');
  const shareUrl = 'https://zona-innmueble.com/share/' + prop.slug + '.html';
  const ogTitle = hook || prop.titulo;
  const ogDesc = descCorta || (tipo + ' en ' + zona + (isPrivada ? ' · Precio bajo solicitud' : (prop.priceFormatted ? ' · ' + prop.priceFormatted : '')));

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${ogTitle} | Zona INNmueble</title>
<meta name="description" content="${ogDesc}">
<meta property="og:title" content="${ogTitle} | Zona INNmueble">
<meta property="og:description" content="${ogDesc}">
<meta property="og:image" content="${img}">
<meta property="og:url" content="${shareUrl}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_GT">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${ogTitle}">
<meta name="twitter:description" content="${ogDesc}">
<meta name="twitter:image" content="${img}">
<meta name="robots" content="noindex,nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@400;500;600;700&display=swap">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Montserrat',sans-serif;background:#0D1B3E;color:white;min-height:100vh;}
</style>
</head>
<body>
<!-- HERO -->
<div style="position:relative;min-height:100vh;display:flex;flex-direction:column">
  <!-- Imagen de fondo -->
  <div style="position:fixed;inset:0;z-index:0">
    <img src="${img}" alt="${prop.titulo}" style="width:100%;height:100%;object-fit:cover;display:block">
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(13,27,62,.6) 0%,rgba(13,27,62,.85) 50%,rgba(13,27,62,.97) 100%)"></div>
  </div>

  <!-- Contenido -->
  <div style="position:relative;z-index:2;flex:1;display:flex;flex-direction:column;max-width:680px;margin:0 auto;padding:60px 24px 40px;width:100%">

    <!-- Logo -->
    <div style="margin-bottom:48px">
      <a href="https://zona-innmueble.com" style="text-decoration:none">
        <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:1.2rem;font-weight:400;color:rgba(255,255,255,.7)"><em style="color:#F5820D;font-style:normal">ZONA</em> INNmueble</span>
      </a>
    </div>

    <!-- Badge tipo/zona -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px">
      <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:100px;padding:5px 14px;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.8)">${tipo}</span>
      <span style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:100px;padding:5px 14px;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.8)">📍 ${zona}</span>
      ${isPrivada ? '<span style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,130,13,.15);border:1px solid rgba(245,130,13,.4);border-radius:100px;padding:5px 14px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#F5820D">🔒 OFF-MARKET</span>' : ''}
    </div>

    <!-- Hook -->
    ${hook ? `<h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2.2rem,6vw,3.6rem);font-weight:300;line-height:1.1;color:white;margin-bottom:20px">${hook}</h1>` : ''}

    <!-- Descripcion corta -->
    ${descCorta ? `<p style="font-size:.95rem;color:rgba(255,255,255,.7);line-height:1.8;margin-bottom:28px;font-weight:300">${descCorta}</p>` : ''}

    <!-- Specs -->
    ${specs ? `<div style="display:flex;gap:12px;margin-bottom:28px;flex-wrap:wrap">${[hab,ban].filter(Boolean).map(s=>`<span style="font-size:.8rem;font-weight:600;color:rgba(255,255,255,.6);background:rgba(255,255,255,.08);padding:6px 14px;border-radius:100px">${s}</span>`).join('')}</div>` : ''}

    <!-- Precio o privado -->
    ${precioHTML}

    <!-- Divisor -->
    <div style="width:40px;height:2px;background:#F5820D;margin-bottom:32px"></div>

    <!-- CTA principal -->
    <a href="https://wa.me/${WA}?text=${waMsg}" target="_blank" rel="noopener"
      style="display:flex;align-items:center;justify-content:center;gap:12px;background:#F5820D;color:#0D1B3E;font-size:15px;font-weight:700;letter-spacing:.04em;padding:16px 32px;border-radius:8px;text-decoration:none;margin-bottom:14px;transition:all .3s"
      onmouseover="this.style.background='#d97008'" onmouseout="this.style.background='#F5820D'">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Solicitar información privada
    </a>

    <!-- Link al detalle completo -->
    <a href="/propiedades/${prop.slug}.html"
      style="display:flex;align-items:center;justify-content:center;gap:8px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);border:1px solid rgba(255,255,255,.15);font-size:13px;font-weight:600;padding:13px 32px;border-radius:8px;text-decoration:none"
      onmouseover="this.style.background='rgba(255,255,255,.15)'" onmouseout="this.style.background='rgba(255,255,255,.08)'">
      Ver ficha completa →
    </a>

    <!-- Footer -->
    <div style="margin-top:auto;padding-top:48px;text-align:center;font-size:11px;color:rgba(255,255,255,.3);letter-spacing:.06em">
      ZONA INNMUEBLE · GUATEMALA PREMIUM REAL ESTATE
    </div>
  </div>
</div>
</body>
</html>`;
}

module.exports = { sharePage };
