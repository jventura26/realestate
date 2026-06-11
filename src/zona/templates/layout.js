const { escapeHtml } = require('../../shared/utils');

const DOMAIN    = 'https://zona-innmueble.com';
const WA        = '50245542088';

const WA_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

function layout({ title, desc, canonical, ogImage, body, scripts = '',
                  pixelId = 'TU_META_PIXEL_ID', ga4Id = 'G-XXXXXXXXXX' }) {
  const pageTitle = title
    ? `${escapeHtml(title)} | Zona INNmueble`
    : 'Zona INNmueble | Propiedades Premium Guatemala';
  const metaDesc  = escapeHtml(desc || 'Propiedades premium en Guatemala. Residencias, apartamentos, fincas e inversiones. Asesoría personalizada por WhatsApp.');
  const ogImg     = ogImage || `${DOMAIN}/assets/og.jpg`;
  const canon     = `${DOMAIN}${canonical || '/'}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${pageTitle}</title>
<meta name="description" content="${metaDesc}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${canon}">
<meta property="og:type"        content="website">
<meta property="og:title"       content="${pageTitle}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:url"         content="${canon}">
<meta property="og:image"       content="${escapeHtml(ogImg)}">
<meta property="og:locale"      content="es_GT">
<meta name="twitter:card"       content="summary_large_image">
<meta name="theme-color"        content="#0D1B3E">
<link rel="icon" type="image/png" href="/assets/favicon.png">

<!-- Google Analytics 4 — replace G-XXXXXXXXXX in Netlify env -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4Id}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4Id}');</script>

<!-- Meta Pixel — replace TU_META_PIXEL_ID in Netlify env -->
<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#0D1B3E;--ink2:#142240;--ink3:#1A3060;
  --or:#F5820D;--or2:#FF9B2E;
  --bl:#4A90D9;--bl2:#6BAEE8;
  --wh:#fff;--cream:#F0EBE1;--sv:#8A9BB0;--mt:#56647A;
  --bd:rgba(255,255,255,.08);--gl:rgba(245,130,13,.25);
  --wa:#25D366;--wa2:#1ebe5d;
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Montserrat',sans-serif;background:var(--ink);color:var(--wh);overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%}a{text-decoration:none;color:inherit}
/* NAV */
nav{position:sticky;top:0;z-index:200;background:rgba(13,27,62,.96);backdrop-filter:blur(16px);border-bottom:1px solid var(--gl);padding:0 6%}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:40px}
.logo{font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;display:flex;align-items:baseline;gap:0}
.logo em{font-style:normal;color:var(--or)}
.logo sub{font-size:.48rem;font-weight:400;letter-spacing:.24em;color:var(--sv);margin-left:8px;font-family:'Montserrat',sans-serif}
.nav-links{display:flex;gap:26px;list-style:none}
.nav-links a{font-size:.66rem;font-weight:500;letter-spacing:.13em;text-transform:uppercase;color:var(--sv);transition:color .3s}
.nav-links a:hover{color:var(--or)}
.nav-cta{border:1px solid var(--gl);color:var(--or);padding:9px 20px;font-size:.63rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;transition:all .3s}
.nav-cta:hover{background:var(--or);color:var(--ink);border-color:var(--or)}
/* SHARED */
section{padding:20px 6%}
.ey{display:flex;align-items:center;gap:12px;margin-bottom:4px;font-size:.59rem;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:var(--or)}
.ey::before{content:'';width:26px;height:1px;background:var(--or)}
.st{font-family:"Cormorant Garamond",serif;font-size:clamp(2.5rem,5vw,4rem);font-weight:300;line-height:1.15;margin-bottom:8px}.st-large{font-family:'Cormorant Garamond',serif;font-size:clamp(1.9rem,3.8vw,3.1rem);font-weight:300;line-height:1.12;margin-bottom:12px}
.st em{font-style:italic;color:var(--or)}
.ss{font-size:1.1rem;font-weight:300;line-height:2;letter-spacing:.02em;color:var(--sv);line-height:1.9;max-width:500px;font-weight:300}
.description-premium{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:300;line-height:1.8;color:var(--wh);margin-bottom:24px;letter-spacing:.01em}
/* BUTTONS */
.btn-or{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--or);color:var(--ink);border:1px solid var(--or);padding:13px 30px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;transition:all .3s;cursor:pointer}
.btn-or:hover{background:var(--or2);border-color:var(--or2);transform:translateY(-1px);box-shadow:0 8px 28px rgba(245,130,13,.35)}
.btn-ol{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:transparent;color:var(--wh);border:1px solid rgba(255,255,255,.22);padding:13px 30px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:500;letter-spacing:.15em;text-transform:uppercase;transition:all .3s}
.btn-ol:hover{border-color:var(--gl);color:var(--or)}
/* WA BUTTONS */
.wa-btn{display:flex;align-items:center;gap:10px;background:var(--wa);color:var(--wh);padding:12px 18px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;transition:all .3s;width:100%;margin-bottom:8px}
.wa-btn:hover{background:var(--wa2);transform:translateY(-1px);box-shadow:0 8px 22px rgba(37,211,102,.3)}
/* CARDS */
.prop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px}
.prop-card{position:relative;overflow:hidden;aspect-ratio:4/5;display:block;cursor:pointer}
.prop-card img{width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.22,1,.36,1);filter:brightness(.72) saturate(.85)}
.prop-card:hover img{transform:scale(1.07);filter:brightness(.82) saturate(1)}
.pc-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,62,.97) 0%,rgba(13,27,62,.25) 50%,transparent 100%)}
.pc-badge{position:absolute;top:14px;left:14px;background:var(--or);color:var(--ink);font-size:.54rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;padding:4px 9px}
.pc-badge.renta{background:var(--bl)}
.pc-info{position:absolute;bottom:22px;left:20px;right:20px}
.pc-tipo{font-size:.57rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--or);margin-bottom:6px}
.pc-title{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:400;line-height:1.2;margin-bottom:7px}
.pc-meta{display:flex;gap:10px;font-size:.62rem;color:var(--sv);margin-bottom:8px}
.pc-price{font-size:.7rem;font-weight:600;color:var(--or);letter-spacing:.1em}
.pc-arr{float:right;opacity:0;transform:translateX(-6px);transition:all .3s}
.prop-card:hover .pc-arr{opacity:1;transform:translateX(0)}
/* FILTERS */
.filter-bar{background:var(--ink2);padding:18px 6%;border-bottom:1px solid var(--bd);display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.filter-bar select,.filter-bar input{background:rgba(255,255,255,.05);border:1px solid var(--bd);color:var(--wh);padding:9px 12px;font-family:'Montserrat',sans-serif;font-size:.75rem;font-weight:300;outline:none;transition:border-color .3s;appearance:none;min-width:120px}
.filter-bar select:focus,.filter-bar input:focus{border-color:var(--gl)}
.filter-bar input::placeholder{color:var(--mt)}
.filter-bar select option{background:var(--ink2)}
#cl2{background:none;border:1px solid var(--bd);color:var(--sv);padding:9px 13px;font-size:.68rem;cursor:pointer;font-family:'Montserrat',sans-serif;transition:all .2s}
#cl2:hover{border-color:var(--or);color:var(--or)}
.f-count{font-size:.68rem;color:var(--mt);margin-left:auto}
/* DETAIL */
.det-header{background:var(--ink2);padding:34px 6% 0;border-bottom:1px solid var(--bd)}
.breadcrumb{font-size:.67rem;color:var(--mt);display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:18px}
.breadcrumb a:hover{color:var(--or)}
.det-body{display:grid;grid-template-columns:1fr 370px;gap:56px;padding:56px 6%;align-items:start}
.main-img img{width:100%;aspect-ratio:4/3;object-fit:cover}
.gal-mini{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin-top:3px}
.gal-mini img{width:100%;aspect-ratio:1;object-fit:cover;cursor:pointer;filter:brightness(.8);transition:filter .2s}
.gal-mini img:hover{filter:brightness(1)}
.det-title{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;line-height:1.15;margin-bottom:10px}
.det-price{font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--or);margin-bottom:22px}
.specs{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--bd);margin-bottom:26px}
.sp{background:var(--ink2);padding:13px 15px}
.sp-l{font-size:.56rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--mt);margin-bottom:3px}
.sp-v{font-size:.87rem;font-weight:500}
.det-desc{font-size:.81rem;line-height:1.92;color:var(--sv);margin-bottom:24px;font-weight:300}
.tag{display:inline-block;background:rgba(255,255,255,.04);border:1px solid var(--bd);padding:4px 11px;font-size:.67rem;color:var(--sv);margin:0 5px 5px 0}
/* SIDEBAR */
.sidebar{background:var(--ink2);border:1px solid var(--bd);border-top:2px solid var(--or);padding:26px 22px}
.sb-title{font-family:'Cormorant Garamond',serif;font-size:1.45rem;font-weight:400;color:var(--cream);margin-bottom:6px}
.sb-sub{font-size:.7rem;color:var(--mt);margin-bottom:20px;line-height:1.65}
.live{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--wa);animation:lp 2s ease-in-out infinite;margin-right:7px}
@keyframes lp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}
.div-line{height:1px;background:var(--bd);margin:16px 0}
/* FLOAT WA */
.wa-float{position:fixed;bottom:26px;right:26px;z-index:300;width:52px;height:52px;background:var(--wa);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,.4);transition:all .3s;animation:wfp 3s ease-in-out infinite}
.wa-float:hover{transform:scale(1.1);box-shadow:0 8px 32px rgba(37,211,102,.6)}
@keyframes wfp{0%,100%{box-shadow:0 4px 20px rgba(37,211,102,.4)}50%{box-shadow:0 4px 32px rgba(37,211,102,.6),0 0 0 10px rgba(37,211,102,.07)}}
.wa-float svg{width:24px;height:24px;fill:white}
/* NO RESULTS */
.no-res{text-align:center;padding:72px;color:var(--sv);grid-column:1/-1}
.no-res p{font-family:'Cormorant Garamond',serif;font-size:1.7rem;margin-bottom:8px}
.no-res small{font-size:.74rem}
/* RELATED */
.related{background:var(--ink2);padding:60px 6%}
.related .prop-grid{margin-top:36px}
/* FOOTER */
footer{background:#050A14;padding:56px 6% 26px;border-top:1px solid var(--gl)}
.ft{display:grid;grid-template-columns:2fr 1fr 1fr;gap:60px;padding-bottom:40px;border-bottom:1px solid var(--bd);margin-bottom:22px}
.ft-brand{font-family:'Cormorant Garamond',serif;font-size:1.1rem;letter-spacing:.17em;text-transform:uppercase;color:var(--cream);margin-bottom:12px}
.ft-brand em{font-style:normal;color:var(--or)}
.ft-tag{font-size:.7rem;color:var(--mt);line-height:1.9;font-weight:300;max-width:265px}
.ft-col h4{font-size:.56rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--or);margin-bottom:16px}
.ft-col ul{list-style:none}
.ft-col ul li{font-size:.7rem;color:var(--mt);margin-bottom:9px}
.ft-bot{font-size:.6rem;color:var(--mt);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
/* RESPONSIVE */
@media(max-width:1024px){.prop-grid{grid-template-columns:repeat(2,1fr)}.det-body{grid-template-columns:1fr}}
@media(max-width:768px){
  .nav-links{display:none}section{padding:18px 5%}
  .prop-grid{grid-template-columns:1fr}.filter-bar{padding:14px 5%}
  .ft{grid-template-columns:1fr;gap:32px}
  .det-body{padding:30px 5%;gap:32px}.gal-mini{grid-template-columns:repeat(4,1fr)}
  .specs{grid-template-columns:1fr}.wa-float{right:14px;bottom:14px;width:48px;height:48px}
  .related{padding:52px 5%}
}
@media(max-width:480px){
  html,body{width:100%!important;overflow-x:hidden!important;margin:0!important;padding:0!important}
  nav{padding:0 3%!important;margin:0!important;width:100%!important}
  .nav-inner{height:38px!important;padding:0!important;margin:0!important}
  .nav-inner img{height:36px!important}
  .nav-links{gap:12px!important}
  .nav-links a{font-size:.55rem!important}
  section{padding:12px 4%!important;margin:0!important;width:100%!important;max-width:100%!important;overflow-x:hidden!important;min-height:auto!important;height:auto!important;display:block!important}
  section[style*="min-height"]{min-height:auto!important;height:auto!important;display:block!important}
  section[style*="display:flex"]{display:block!important;align-items:unset!important}
  section[style*="display:flex;align-items:center"]{display:block!important;align-items:unset!important;justify-content:unset!important;flex-direction:unset!important}
  section[style*="min-height:93vh"]{min-height:auto!important;display:block!important;padding:0 4%!important;align-items:unset!important;justify-content:unset!important;height:auto!important;min-height:70vh!important}
  section[style*="min-height:93vh"] > div[style*="position:relative;z-index"]{padding:20px 0 20px!important;position:relative!important;max-width:100%!important;width:100%!important}
  section[style*="min-height:93vh"] p[style*="margin-bottom:44px"]{margin-bottom:80px!important}
  section[style*="min-height:93vh"] div[style*="display:flex;gap:14px"]{margin-top:0!important;width:100%!important}
  .ey,.label{font-size:.56rem!important;margin-bottom:2px!important}
  h1{font-size:clamp(1.4rem,3.5vw,1.8rem)!important;line-height:1.15!important;margin-bottom:8px!important;margin-top:0!important}
  h2{font-size:clamp(1.2rem,3.2vw,1.5rem)!important;margin-bottom:8px!important}
  h3{margin-bottom:4px!important}
  p{margin-bottom:6px!important}
  .st{margin-bottom:6px!important}
  .st-large{margin-bottom:6px!important}
  .prop-grid{grid-template-columns:1fr!important;gap:2px!important}
  .prop-card{aspect-ratio:4/5!important}
  .filter-bar{padding:12px 4%!important;flex-direction:column!important}
  .filter-bar select,.filter-bar input{width:100%!important;min-width:100%!important}
  .det-header{padding:16px 4% 0!important}
  .det-body{padding:16px 4%!important;grid-template-columns:1fr!important;gap:12px!important}
  .related{padding:20px 4%!important}
  footer{padding:20px 4% 12px!important}
  .ft{grid-template-columns:1fr!important;gap:16px!important}
  .btn-or,.btn-ol,.wa-btn{width:100%!important;padding:8px 12px!important;margin-bottom:4px!important;font-size:.6rem!important}
  .wa-float{width:48px!important;height:48px!important;right:10px!important;bottom:10px!important}
}

/* ═══════════════════════════════════════════════════════════════════ */
/* FASE 1: ANIMACIONES PREMIUM + TESTIMONIOS + VIDEO HERO              */
/* ═══════════════════════════════════════════════════════════════════ */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.testimonial-card {
  transition: all .4s cubic-bezier(.22,1,.36,1);
}

.testimonial-card:hover {
  transform: translateY(-8px) !important;
  border-color: var(--or) !important;
  background: linear-gradient(135deg, rgba(245,130,13,.05), rgba(245,130,13,0)) !important;
}

.btn-or:hover, .btn-ol:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245,130,13,.2);
}

.counter {
  display: inline-block;
  font-variant-numeric: tabular-nums;
}
</style>
</head>
<body>
<nav>
  <div class="nav-inner">
    <a href="/" class="logo"><img src="https://raw.githubusercontent.com/jventura26/realestate/main/src/zona/assets/images/logo.png" alt="Zona INNmueble" style="height:45px;width:auto"></a>
    <ul class="nav-links">
      <li><a href="/propiedades.html">Propiedades</a></li>
      <li><a href="/propiedades.html?tipo=Casa">Casas</a></li>
      <li><a href="/propiedades.html?tipo=Apartamento">Apartamentos</a></li>
      <li><a href="/propiedades.html?tipo=Fincas">Fincas</a></li>
      <li><a href="/faq.html">FAQ</a></li>
      <li><a href="/about.html">Nosotros</a></li>
    </ul>
    <a href="https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero asesoría de Zona INNmueble.')}" target="_blank" rel="noopener" class="nav-cta">Asesoría</a>
  </div>
</nav>

${body}

<!-- WhatsApp Float -->
<a href="https://wa.me/${WA}?text=${encodeURIComponent('Hola, me interesa una propiedad de Zona INNmueble.')}" class="wa-float" target="_blank" rel="noopener" aria-label="WhatsApp">
  <svg viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>

<!-- NEWSLETTER FOOTER -->
<section style="padding:44px 6%;background:var(--ink2);border-bottom:1px solid var(--gl)">
  <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:44px;align-items:center">
    <div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:300;margin-bottom:12px">Mantente en el Loop</div>
      <p style="font-size:.9rem;color:var(--sv);line-height:1.7">Recibe las mejores oportunidades inmobiliarias premium directamente en tu email.</p>
    </div>
    <form class="newsletter-form" style="display:flex;gap:10px">
      <input type="email" placeholder="tu-email@example.com" required style="flex:1;min-width:200px;padding:12px 16px;background:rgba(255,255,255,.05);border:1px solid var(--gl);color:var(--wh);font-family:'Montserrat',sans-serif;font-size:.85rem;border-radius:3px;transition:all .3s">
      <button type="submit" style="padding:12px 24px;background:var(--or);color:var(--ink);border:none;font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border-radius:3px;transition:all .3s;font-family:'Montserrat',sans-serif;white-space:nowrap">Suscribirse</button>
    </form>
  </div>
</section>

<footer>
  <div class="ft">
    <div><div class="ft-brand"><em>ZONA</em> INNMUEBLE</div><p class="ft-tag">Donde las oportunidades inmobiliarias se convierten en patrimonio. Guatemala Premium Real Estate.</p></div>
    <div class="ft-col"><h4>Propiedades</h4><ul><li>Residencias</li><li>Apartamentos</li><li>Fincas</li><li>Inversión</li></ul></div>
    <div class="ft-col"><h4>Zonas</h4><ul><li>Zona 10 · Zona 14</li><li>Zona 15 · Zona 16</li><li>Cayalá · Fraijanes</li><li>Carretera al Salvador</li></ul></div>
  </div>
  <div class="ft-bot">
    <span>© ${new Date().getFullYear()} Zona INNmueble Real Estate · Guatemala</span>
    <span>+502 4554-2088 · WhatsApp</span>
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

// NEWSLETTER BREVO INTEGRATION
// API Key configured in Cloudflare Environment Variables
const BREVO_API_KEY = window.BREVO_API_KEY || 'CONFIGURE_IN_CLOUDFLARE_ENV';
const BREVO_LIST_ID = 3;

async function subscribeNewsletter(email) {
  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
        attributes: {
          FIRSTNAME: 'Suscriptor',
          SOURCE: 'Website Newsletter'
        }
      })
    });

    if (response.ok || response.status === 400) {
      return { success: true, message: '¡Gracias por suscribirte!' };
    } else {
      return { success: false, message: 'Error en la suscripción. Intenta de nuevo.' };
    }
  } catch (error) {
    console.error('Newsletter error:', error);
    return { success: false, message: 'Error de conexión. Intenta de nuevo.' };
  }
}

// Newsletter forms listener
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    const email = input.value.trim();

    if (!email) {
      alert('Por favor ingresa tu email');
      return;
    }

    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Suscribiendo...';

    const result = await subscribeNewsletter(email);
    
    if (result.success) {
      input.value = '';
      btn.textContent = '¡Suscrito!';
      btn.style.background = '#25D366';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
        btn.style.background = '';
      }, 3000);
    } else {
      alert(result.message);
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
});
</script>
</html>`;
}

module.exports = { layout, WA };
