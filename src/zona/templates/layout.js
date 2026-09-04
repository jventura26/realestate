const { escapeHtml } = require('../../shared/utils');

const DOMAIN    = 'https://zona-innmueble.com';
const WA        = '50245542088';

const WA_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

// CAMBIO 3: ogType = 'website' como parámetro por defecto
function layout({ title, desc, canonical, ogImage, ogType = 'website', body, scripts = '',
                  pixelId = '1668269500330907', ga4Id = 'G-5KVQZYZ7B3' }) {
  const pageTitle = title
    ? `${escapeHtml(title)} | Zona INNmueble`
    : 'Casas y Fincas en Venta en Guatemala | Zona INNmueble — Inmobiliaria Premium';
  const metaDesc  = escapeHtml(desc || 'Inmobiliaria premium en Guatemala. Casas, fincas, apartamentos y terrenos en venta en Zona 10, Zona 14, Zona 15, Fraijanes, Cayala y Carretera a El Salvador. Propiedades verificadas con asesoria personalizada.');
  const ogImg     = ogImage || 'https://zona-innmueble.com/assets/og.jpg';
  const canon     = `${DOMAIN}${canonical || '/'}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="google-site-verification" content="O8Y0pUTjSvnMM9c7Mq82yy5u5OoqlYBThE0aLzTDASA">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${pageTitle}</title>
<meta name="description" content="${metaDesc}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${canon}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Zona INNmueble",
  "url": "https://zona-innmueble.com",
  "logo": "https://ik.imagekit.io/Zona/logo.png",
  "image": "https://zona-innmueble.com/assets/og.jpg",
  "description": "Inmobiliaria premium en Guatemala. Casas, fincas y apartamentos en venta en Fraijanes, Zona 10, Zona 14, Mixco y Carretera a El Salvador.",
  "telephone": "+50245542088",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ciudad de Guatemala",
    "addressCountry": "GT"
  },
  "areaServed": ["Guatemala", "Fraijanes", "Mixco", "Santa Catarina Pinula", "Escuintla"],
  "openingHours": "Mo-Fr 08:00-18:00",
  "sameAs": [
    "https://www.facebook.com/Zona-INNmueble-1616853578595692/",
    "https://www.instagram.com/zona_innmueble/",
    "https://www.tiktok.com/@zonainnmueble",
    "https://www.youtube.com/@zonainnmueble",
    "https://www.linkedin.com/in/zona-innmueble/"
  ]
}
</script>
<meta property="og:type"        content="${ogType}">
<meta property="og:title"       content="${pageTitle}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:url"         content="${canon}">
<meta property="og:image"       content="${escapeHtml(ogImg)}">
<meta property="og:locale"      content="es_GT">
<meta name="twitter:card"       content="summary_large_image">
<meta name="theme-color"        content="#0D1B3E">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Zona INNmueble">

<!-- Meta Pixel (inline para _fbp cookie inmediata) -->
<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','` + pixelId + `');fbq('track','PageView');</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=` + pixelId + `&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel -->

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KH4VCQBZ');</script>
<!-- End Google Tag Manager -->

<!-- GA4 manejado por GTM (GTM-KH4VCQBZ) | Meta Pixel ahora inline arriba -->

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://ik.imagekit.io" crossorigin>
<!-- Preload directo de los woff2 usados en el hero (stats-bar) para evitar el
     salto de layout (CLS) que ocurre cuando el font-swap llega tarde -->
<link rel="preload" as="font" type="font/woff2" crossorigin href="https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="https://fonts.gstatic.com/s/cormorantgaramond/v21/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtKky2F7g.woff2">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://zona-inmu.tours-virtuales-gt.workers.dev">
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet"></noscript>
<link rel="preload" href="/assets/zona-styles.css" as="style">
<link rel="stylesheet" href="/assets/zona-styles.css">
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KH4VCQBZ"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<nav>
  <div class="nav-inner">
    <a href="/" class="logo"><img src="https://ik.imagekit.io/Zona/logo.png" alt="Zona INNmueble" style="height:52px;width:auto"></a>
    <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    <ul class="mega-nav" id="nav-links">
      <li data-mega="comprar">
        <a href="/propiedades.html">Comprar <span class="dd-arrow">&#9660;</span></a>
        <div class="mega-panel">
          <div class="mega-col">
            <h5>Por tipo</h5>
            <ul>
              <li><a href="/propiedades.html?tipo=Casa"><svg class="mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg> Casas &amp; Residencias</a></li>
              <li><a href="/propiedades.html?tipo=Apartamento"><svg class="mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2M9 18h6"/></svg> Apartamentos</a></li>
              <li><a href="/propiedades.html?tipo=Finca"><svg class="mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6M9 9h.01M15 9h.01"/></svg> Fincas</a></li>
              <li><a href="/propiedades.html?tipo=Terreno"><svg class="mega-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 20L9 8l4 6 3-4 6 10H2z"/><circle cx="17" cy="6" r="2"/></svg> Terrenos</a></li>
            </ul>
          </div>
          <div class="mega-col">
            <h5>Por zona</h5>
            <ul>
              <li><a href="/zonas/zona-10.html">Zona 10 &mdash; Ciudad</a></li>
              <li><a href="/zonas/zona-14.html">Zona 14 &mdash; Premium</a></li>
              <li><a href="/zonas/zona-15.html">Zona 15 &mdash; Vista Hermosa</a></li>
              <li><a href="/zonas/zona-16.html">Zona 16 &mdash; Cañadas</a></li>
              <li><a href="/zonas/fraijanes.html">Fraijanes</a></li>
              <li><a href="/zonas/carretera-el-salvador.html">Carretera a El Salvador</a></li>
            </ul>
          </div>
          <div class="mega-cta">
            <a href="/propiedades.html">Ver todas las propiedades <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
            <a href="/zonas/index.html">Explorar zonas <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
          </div>
        </div>
      </li>
      <li><a href="/propiedades.html?tipo=Finca">Fincas</a></li>
      <li data-mega="zonas">
        <a href="/zonas/index.html">Zonas <span class="dd-arrow">&#9660;</span></a>
        <ul class="simple-dd">
          <li><a href="/zonas/zona-10.html">Zona 10</a></li>
          <li><a href="/zonas/zona-14.html">Zona 14</a></li>
          <li><a href="/zonas/zona-15.html">Zona 15</a></li>
          <li><a href="/zonas/zona-16.html">Zona 16</a></li>
          <li><a href="/zonas/fraijanes.html">Fraijanes</a></li>
          <li><a href="/zonas/carretera-el-salvador.html">Carretera El Salvador</a></li>
          <li class="dd-sep"><a href="/zonas/index.html">Ver todas &rarr;</a></li>
        </ul>
      </li>
      <li><a href="/blog.html">Blog</a></li>
      <li><a href="/about.html">Nosotros</a></li>
      <li><a href="/faq.html">FAQ</a></li>
    </ul>
    <a href="https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero asesoría de Zona INNmueble.')}" target="_blank" rel="noopener" class="nav-cta">Asesor&iacute;a</a>
  </div>
</nav>

${body}

<!-- WhatsApp Float -->
<a href="https://wa.me/${WA}?text=${encodeURIComponent('Hola, me interesa una propiedad de Zona INNmueble.')}" class="wa-float" target="_blank" rel="noopener" aria-label="WhatsApp">
  <svg viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>


<footer class="footer-premium">
  <div class="footer-top">
    <div class="footer-brand-block">
      <div class="footer-logo"><em>ZONA</em> INNmueble</div>
      <p class="footer-tagline">Donde las oportunidades inmobiliarias se convierten en patrimonio. Guatemala Premium Real Estate.</p>
      <div class="footer-social">
        <a href="https://www.facebook.com/Zona-INNmueble-1616853578595692/" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
        <a href="https://www.instagram.com/zona_innmueble/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg></a>
        <a href="https://www.tiktok.com/@zonainnmueble" target="_blank" rel="noopener" aria-label="TikTok"><svg viewBox="0 0 24 24"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0115.54 3h-3.09v12.4a2.592 2.592 0 01-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 004.3 1.38V7.3s-1.88.09-3.24-1.48z"/></svg></a>
        <a href="https://www.youtube.com/@zonainnmueble" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.87.55 9.38.55 9.38.55s7.51 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.75 15.5v-7l6.27 3.5-6.27 3.5z"/></svg></a>
        <a href="https://www.linkedin.com/in/zona-innmueble/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM.5 8.75h4.96V23H.5V8.75zM9.02 8.75h4.75v1.95h.07c.66-1.19 2.27-2.44 4.67-2.44 5 0 5.92 3.14 5.92 7.23V23h-4.96v-6.5c0-1.55-.03-3.55-2.2-3.55-2.2 0-2.54 1.68-2.54 3.44V23H9.02V8.75z"/></svg></a>
        <a href="https://wa.me/${WA}" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Propiedades</h4>
      <ul>
        <li><a href="/propiedades.html?tipo=Casa">Residencias</a></li>
        <li><a href="/propiedades.html?tipo=Apartamento">Apartamentos</a></li>
        <li><a href="/propiedades.html?tipo=Finca">Fincas</a></li>
        <li><a href="/propiedades.html">Ver todas</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Zonas</h4>
      <ul>
        <li><a href="/zonas/zona-14.html">Zona 14</a></li>
        <li><a href="/zonas/zona-15.html">Zona 15</a></li>
        <li><a href="/zonas/zona-16.html">Zona 16</a></li>
        <li><a href="/zonas/fraijanes.html">Fraijanes</a></li>
        <li><a href="/zonas/carretera-el-salvador.html">Carretera a El Salvador</a></li>
        <li><a href="/zonas/fincas-guatemala.html">Fincas en toda Guatemala</a></li>
        <li><a href="/zonas/index.html">Ver todas</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Recursos</h4>
      <ul>
        <li><a href="/blog.html">Blog</a></li>
        <li><a href="/faq.html">Preguntas Frecuentes</a></li>
        <li><a href="/about.html">Nosotros</a></li>
        <li><a href="/privacidad.html">Privacidad</a></li>
      </ul>
    </div>
    <div class="footer-newsletter">
      <h4>Novedades</h4>
      <p>Recibe propiedades nuevas y oportunidades de inversi&oacute;n directamente por WhatsApp.</p>
      <a href="https://wa.me/${WA}?text=Hola%2C%20quiero%20recibir%20propiedades%20nuevas%20y%20oportunidades%20de%20inversi%C3%B3n." target="_blank" rel="noopener" class="footer-wa-btn">
        ${WA_SVG} Recibir por WhatsApp
      </a>
    </div>
  </div>
  <div class="footer-bottom">
    <span>&copy; 2026 Zona INNmueble Real Estate &middot; Guatemala</span>
    <div class="footer-bottom-links">
      <a href="/privacidad.html">Pol&iacute;tica de Privacidad</a>
      <a href="/about.html">Nosotros</a>
      <a href="https://wa.me/${WA}" target="_blank" rel="noopener">Contacto</a>
    </div>
  </div>
</footer>
${scripts}

<!-- FASE 1: ANIMACIONES COUNTER + TESTIMONIOS -->
<script>
// Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    if(!target || counter.dataset.animated) return;
    counter.dataset.animated = '1';

    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 50);
  });
}

// Testimonials Fade In
function animateTestimonials() {
  const testimonials = document.querySelectorAll('.testimonial-card');
  testimonials.forEach((el, index) => {
    setTimeout(() => {
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    }, 100 + index * 150);
  });
}

// Intersection Observer para animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement;
      if (parent && parent.classList.contains('stats-container')) {
        animateCounters();
        observer.unobserve(entry.target);
      }
      if (parent && parent.classList.contains('testimonials-container')) {
        animateTestimonials();
        observer.unobserve(entry.target);
      }
    }
  });
}, observerOptions);

// Initialize on load
window.addEventListener('load', () => {
  setTimeout(() => {
    animateCounters();
    animateTestimonials();
  }, 300);
});

// Observe counters
document.querySelectorAll('.counter').forEach(el => {
  if(el.parentElement) observer.observe(el.parentElement);
});

// MEGA-MENU + HAMBURGER
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
var megaTimer = null;

// Desktop: hover open/close mega panels
document.querySelectorAll('.mega-nav > li[data-mega]').forEach(function(li) {
  li.addEventListener('mouseenter', function() {
    if(window.innerWidth <= 768) return;
    clearTimeout(megaTimer);
    document.querySelectorAll('.mega-nav > li.mega-open').forEach(function(o) { if(o !== li) o.classList.remove('mega-open'); });
    li.classList.add('mega-open');
  });
  li.addEventListener('mouseleave', function() {
    if(window.innerWidth <= 768) return;
    megaTimer = setTimeout(function() { li.classList.remove('mega-open'); }, 200);
  });
});

// Mobile: click to toggle mega panels
document.querySelectorAll('.mega-nav > li[data-mega] > a').forEach(function(a) {
  a.addEventListener('click', function(e) {
    if(window.innerWidth <= 768) {
      e.preventDefault();
      var li = a.parentElement;
      var wasOpen = li.classList.contains('mega-open');
      document.querySelectorAll('.mega-nav > li.mega-open').forEach(function(o) { o.classList.remove('mega-open'); });
      if(!wasOpen) li.classList.add('mega-open');
    }
  });
});

// Hamburger toggle
if(hamburger && navLinks) {
  hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('a:not([data-mega] > a)').forEach(function(link) {
    if(!link.parentElement.hasAttribute('data-mega')) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      });
    }
  });

  // Close on outside click
  document.addEventListener('click', function(e) {
    if(!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      document.querySelectorAll('.mega-nav > li.mega-open').forEach(function(o) { o.classList.remove('mega-open'); });
    }
  });
}

// Close mega on Escape
document.addEventListener('keydown', function(e) {
  if(e.key === 'Escape') {
    document.querySelectorAll('.mega-nav > li.mega-open').forEach(function(o) { o.classList.remove('mega-open'); });
    if(navLinks) navLinks.classList.remove('active');
    if(hamburger) hamburger.classList.remove('active');
  }
});

// Fade in al scroll con Intersection Observer
const fadeEls = document.querySelectorAll('.fade-in-up');
if (fadeEls.length && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => obs.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

// Carrusel de cards
function cardSlide(id,dir){
  var wrap=document.getElementById(id);if(!wrap)return;
  var imgs=JSON.parse(wrap.dataset.imgs||'[]');
  var idx=(parseInt(wrap.dataset.idx||0)+dir+imgs.length)%imgs.length;
  wrap.dataset.idx=idx;
  var img=document.getElementById(id+'-img');if(img)img.src=imgs[idx];
  var dots=document.getElementById(id+'-dots');
  if(dots)dots.querySelectorAll('.card-dot').forEach(function(d,i){d.classList.toggle('active',i===idx);});
}
function cardGoto(id,idx){
  var wrap=document.getElementById(id);if(!wrap)return;
  var imgs=JSON.parse(wrap.dataset.imgs||'[]');
  wrap.dataset.idx=idx;
  var img=document.getElementById(id+'-img');if(img)img.src=imgs[idx];
  var dots=document.getElementById(id+'-dots');
  if(dots)dots.querySelectorAll('.card-dot').forEach(function(d,i){d.classList.toggle('active',i===idx);});
}
var FAV_KEY='zona_favoritos_v1';
function getFavs(){
  try{return JSON.parse(localStorage.getItem(FAV_KEY)||'[]');}catch(e){return [];}
}
function isFav(slug){
  return getFavs().indexOf(slug)>=0;
}
function toggleFav(slug,btn){
  event.preventDefault();event.stopPropagation();
  var favs=getFavs();
  var idx=favs.indexOf(slug);
  if(idx>=0){favs.splice(idx,1);}else{favs.push(slug);}
  try{localStorage.setItem(FAV_KEY,JSON.stringify(favs));}catch(e){}
  if(btn)btn.classList.toggle('active',idx<0);
  var counter=document.getElementById('favCounter');
  if(counter)counter.textContent=favs.length;
}
document.addEventListener('DOMContentLoaded',function(){
  var favs=getFavs();
  document.querySelectorAll('.pc-fav').forEach(function(btn){
    var slug=btn.getAttribute('data-slug');
    if(favs.indexOf(slug)>=0)btn.classList.add('active');
  });
});

// Mega-menu handles all dropdown logic above
</script>
<script src="/assets/zona-fase1.js" defer></script>
<!-- Lead Capture Pop-up -->
<div id="zpPopup" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(13,27,62,.7);backdrop-filter:blur(6px);align-items:center;justify-content:center">
<div style="background:linear-gradient(145deg,#0D1B3E 0%,#142240 100%);border:1px solid rgba(193,145,75,.3);border-radius:20px;padding:40px 32px;max-width:420px;width:90%;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.5)">
<button onclick="document.getElementById('zpPopup').style.display='none';sessionStorage.setItem('zpPopDismissed','1')" style="position:absolute;top:14px;right:16px;background:none;border:none;color:rgba(255,255,255,.4);font-size:22px;cursor:pointer;line-height:1">&times;</button>
<div style="text-align:center">
<div style="font-size:28px;margin-bottom:12px">🏡</div>
<div style="font-size:.55rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#F5820D;margin-bottom:14px">Acceso exclusivo</div>
<h3 style="font-family:'Cormorant Garamond',serif;font-size:clamp(1.4rem,3vw,1.8rem);font-weight:300;color:#fff;line-height:1.3;margin-bottom:12px">Recibe propiedades <em style="color:#F5820D;font-style:italic">antes que nadie</em></h3>
<p style="font-size:.82rem;color:#8A9BB0;line-height:1.7;margin-bottom:24px">Nuevas propiedades, oportunidades de inversi&oacute;n y propiedades exclusivas directamente a tu WhatsApp. Sin spam.</p>
<a href="https://wa.me/50245542088?text=Hola%2C%20quiero%20recibir%20propiedades%20nuevas%20y%20oportunidades%20de%20inversi%C3%B3n." style="display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;padding:14px 24px;border-radius:10px;font-size:.85rem;font-weight:600;text-decoration:none;transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(37,211,102,.3)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
${WA_SVG} Quiero recibir propiedades
</a>
<p style="font-size:.65rem;color:rgba(138,155,176,.5);margin-top:14px">Respuesta en menos de 2 horas &middot; Sin compromiso</p>
</div>
</div>
</div>
<script>
(function(){
if(sessionStorage.getItem('zpPopDismissed')) return;
var shown=false;
var scrolledEnough=false;
function showPop(){if(shown)return;shown=true;document.getElementById('zpPopup').style.display='flex';}
function closePop(){document.getElementById('zpPopup').style.display='none';sessionStorage.setItem('zpPopDismissed','1');}
function checkScroll(){
  var doc=document.documentElement;
  var max=(doc.scrollHeight-doc.clientHeight)||1;
  var pct=(window.scrollY||doc.scrollTop)/max;
  if(pct>=0.45) scrolledEnough=true;
}
window.addEventListener('scroll',checkScroll,{passive:true});
setTimeout(function(){ if(scrolledEnough) showPop(); },20000);
setTimeout(showPop,45000);
document.addEventListener('mouseout',function(e){if(!e.relatedTarget&&e.clientY<5)showPop();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closePop();});
})();
</script>
<script>
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});});}
</script>
</html>`;
}

module.exports = { layout, WA };
