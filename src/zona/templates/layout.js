const { escapeHtml } = require('../../shared/utils');

const DOMAIN    = 'https://zona-innmueble.com';
const WA        = '50245542088';

const WA_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

function layout({ title, desc, canonical, ogImage, body, scripts = '',
                  pixelId = '1668269500330907', ga4Id = 'G-5KVQZYZ7B3' }) {
  const pageTitle = title
    ? `${escapeHtml(title)} | Zona INNmueble`
    : 'Casas y Fincas en Venta Guatemala | Zona INNmueble';
  const metaDesc  = escapeHtml(desc || 'Casas, fincas y apartamentos en venta en Guatemala. Propiedades premium en Fraijanes, Zona 10, Zona 14, Mixco y Carretera a El Salvador. Asesoría personalizada por WhatsApp.');
  const ogImg     = ogImage || 'https://ik.imagekit.io/Zona/Imagen%201%20Reel.png';
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
  "logo": "https://raw.githubusercontent.com/jventura26/realestate/main/src/zona/assets/images/logo.png",
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
    "https://www.facebook.com/Zona-INNmueble-1616853578595692/"
  ]
}
</script>
<meta property="og:type"        content="website">
<meta property="og:title"       content="${pageTitle}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:url"         content="${canon}">
<meta property="og:image"       content="${escapeHtml(ogImg)}">
<meta property="og:locale"      content="es_GT">
<meta name="twitter:card"       content="summary_large_image">
<meta name="theme-color"        content="#0D1B3E">
<link rel="icon" type="image/png" href="/assets/favicon.png">

<!-- Google Analytics 4 — configurado: G-5KVQZYZ7B3 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4Id}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4Id}');</script>

<!-- Meta Pixel — configurado: 1668269500330907 -->
<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" alt=""></noscript>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://ik.imagekit.io" crossorigin>
<link rel="dns-prefetch" href="https://zona-inmu.tours-virtuales-gt.workers.dev">
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
nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(13,27,62,.97);backdrop-filter:blur(20px);border-bottom:1px solid var(--gl);padding:0;width:100%;height:68px;display:flex;align-items:stretch}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:100%;width:100%;padding:0 6%;flex:1}
.logo{font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;display:flex;align-items:baseline;gap:0}
.logo em{font-style:normal;color:var(--or)}
.logo sub{font-size:.48rem;font-weight:400;letter-spacing:.24em;color:var(--sv);margin-left:8px;font-family:'Montserrat',sans-serif}
.nav-links{display:flex;gap:26px;list-style:none}
.nav-links a{font-size:.68rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--sv);transition:color .3s}
.nav-links a:hover{color:var(--or)}
.nav-cta{border:1px solid var(--or);color:var(--or);padding:10px 22px;font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;transition:all .3s;border-radius:4px}
.nav-cta:hover{background:var(--or);color:var(--ink);border-color:var(--or)}
.hamburger{display:none;flex-direction:column;gap:4px;cursor:pointer;background:none;border:none;padding:8px;z-index:201}
.hamburger span{width:20px;height:2px;background:var(--or);transition:all .3s}
.hamburger.active span:nth-child(1){transform:rotate(45deg) translate(10px,10px)}
.hamburger.active span:nth-child(2){opacity:0}
.hamburger.active span:nth-child(3){transform:rotate(-45deg) translate(7px,-7px)}
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
.wa-btn{display:flex;align-items:center;gap:10px;background:var(--ink3);color:var(--wh);border:1px solid var(--gl);padding:12px 18px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;transition:all .3s;width:100%;margin-bottom:8px}
.wa-btn:hover{background:var(--or);color:var(--ink);border-color:var(--or);transform:translateY(-1px);box-shadow:0 8px 22px rgba(245,130,13,.25)}
/* CARDS */
.prop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px}
.prop-card{position:relative;overflow:hidden;aspect-ratio:4/5;display:block;cursor:pointer}
.prop-card img{width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.22,1,.36,1);filter:brightness(.72) saturate(.85)}
.prop-card:hover img{transform:scale(1.07);filter:brightness(.82) saturate(1)}
.pc-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,62,.97) 0%,rgba(13,27,62,.25) 50%,transparent 100%)}
.pc-badge{position:absolute;top:14px;left:14px;background:var(--or);color:var(--ink);font-size:.54rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;padding:4px 9px}
.pc-badge.renta{background:var(--bl)}
.pc-badge-excl{position:absolute;top:14px;right:14px;background:var(--ink);color:var(--or);border:1px solid var(--or);font-size:.54rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:4px 9px}
.pc-badge-new{position:absolute;top:14px;right:14px;background:#22c55e;color:#000;font-size:.54rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;padding:4px 9px}
.pc-fav{position:absolute;bottom:14px;right:14px;width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:5;transition:transform .15s}
.pc-fav:hover{transform:scale(1.1)}
.pc-fav svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2;transition:fill .15s,stroke .15s}
.pc-fav.active svg{fill:var(--or);stroke:var(--or)}
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
.hero-sug-item{padding:10px 14px;cursor:pointer;font-size:.82rem;color:rgba(255,255,255,.85);border-bottom:1px solid rgba(255,255,255,.06);transition:background .15s}
.hero-sug-item:hover{background:rgba(245,130,13,.15)}
.hero-sug-item:last-child{border-bottom:none}
.wa-float{position:fixed;bottom:26px;right:26px;z-index:300;width:52px;height:52px;background:var(--or);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(245,130,13,.4);transition:all .3s;animation:wfp 3s ease-in-out infinite}
.wa-float:hover{transform:scale(1.1);box-shadow:0 8px 32px rgba(245,130,13,.5)}
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
  body{padding-top:68px}
  nav{position:fixed;top:0;left:0;right:0;z-index:200;width:100%!important;height:68px!important;padding:0!important;display:flex!important;align-items:center!important}
  .nav-inner{height:68px!important;width:100%!important;padding:0 5%!important;display:flex!important;align-items:center!important;justify-content:space-between!important}
  .logo{margin-right:auto;flex-shrink:0}
  .hamburger{display:flex;margin-left:auto;flex-shrink:0}
  .nav-cta{display:none}
  .nav-links{position:fixed;top:68px;left:0;right:0;background:rgba(13,27,62,.98);backdrop-filter:blur(16px);flex-direction:column;gap:0;padding:12px 0;border-bottom:1px solid var(--gl);display:none;z-index:199;max-height:calc(100vh - 60px);overflow-y:auto}
  .nav-links.active{display:flex}
  .nav-links li{padding:0}
  .nav-links a{display:block;padding:14px 6%;border-bottom:1px solid var(--bd);font-size:.7rem}
  section{padding:18px 5%}
  .prop-grid{grid-template-columns:1fr}.filter-bar{padding:14px 5%}
  .ft{grid-template-columns:1fr;gap:32px}
  .det-body{padding:30px 5%;gap:32px}.gal-mini{grid-template-columns:repeat(4,1fr)}
  .specs{grid-template-columns:1fr}.wa-float{right:14px;bottom:14px;width:48px;height:48px}
  .related{padding:52px 5%}
}
@media(max-width:480px){
  html,body{width:100%!important;overflow-x:hidden!important;margin:0!important;padding:0!important;padding-top:60px!important}
  nav{position:fixed!important;top:0!important;left:0!important;right:0!important;z-index:200!important;width:100%!important;margin:0!important;height:68px!important;padding:0!important;display:flex!important;align-items:center!important}
  .nav-inner{height:68px!important;width:100%!important;padding:0 3%!important;margin:0!important;display:flex!important;align-items:center!important;justify-content:space-between!important}
  .logo{margin-right:auto;flex-shrink:0}
  .hamburger{display:flex!important;margin-left:auto;flex-shrink:0;gap:4px;padding:8px}
  .hamburger span{width:20px;height:2px;background:var(--or)}
  .nav-inner img{height:40px!important}
  .nav-links{gap:12px!important}
  .nav-links a{font-size:.6rem!important}
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

/* ── RESPONSIVE NUEVOS ELEMENTOS ─────────────────────────────────── */
@media(max-width:768px){
  /* Tipos de propiedad - 2 columnas en tablet */
  section[style*="background:var(--ink)"] > div[style*="grid-template-columns:repeat(auto-fit,minmax(210px,1fr))"],
  div[style*="grid-template-columns:repeat(auto-fit,minmax(210px,1fr))"] {
    grid-template-columns: 1fr 1fr !important;
  }
  /* Asesor card - vertical */
  .asesor-card { flex-direction: column; gap: 20px; padding: 28px 20px; }
  .asesor-avatar { width: 70px; height: 70px; font-size: 1.5rem; }
  /* Footer - 2 columnas */
  footer > div:first-child { grid-template-columns: 1fr 1fr !important; }
  footer > div:first-child > div:first-child { grid-column: 1/-1; }
  /* CTA banner */
  .cta-banner { padding: 48px 5%; }
  /* Testimonios - 1 columna */
  .testimonials-container { grid-template-columns: 1fr !important; }
}

@media(max-width:480px){
  /* Tipos - 1 columna */
  div[style*="grid-template-columns:repeat(auto-fit,minmax(210px,1fr))"] {
    grid-template-columns: 1fr !important;
  }
  /* Tipos altura minima */
  div[style*="grid-template-columns:repeat(auto-fit,minmax(210px,1fr))"] > a {
    min-height: 240px !important;
  }
  /* Asesor */
  .asesor-card { padding: 20px 16px; }
  /* Footer - 1 columna */
  footer > div:first-child { grid-template-columns: 1fr !important; }
  /* Stats bar del hero - 2 columnas */
  div[style*="justify-content:center;flex-wrap:wrap"] > div[style*="padding:20px 44px"] {
    min-width: 45% !important;
    padding: 14px 10px !important;
  }
  /* CTA banner */
  .cta-banner { padding: 40px 4%; }
  .cta-banner h2 { font-size: 1.6rem !important; }
}

/* ═══════════════════════════════════════════════════════════════════ */
/* FASE 1: ANIMACIONES PREMIUM + TESTIMONIOS + VIDEO HERO              */
/* ═══════════════════════════════════════════════════════════════════ */


/* Fade in al scroll */
.fade-in-up {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1);
}
.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}
.fade-in-up.delay-1 { transition-delay: .1s; }
.fade-in-up.delay-2 { transition-delay: .2s; }
.fade-in-up.delay-3 { transition-delay: .3s; }

/* Hover mejorado en prop-card */
.prop-card {
  transition: transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s;
}
.prop-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 24px 60px rgba(0,0,0,.5);
  z-index: 2;
}
.prop-card:hover .pc-info { transform: translateY(-4px); }
.pc-info { transition: transform .4s cubic-bezier(.22,1,.36,1); }
/* Cards con carrusel */
.prop-card-wrap{position:relative;overflow:hidden;aspect-ratio:4/5;border-radius:4px;}
.prop-card-wrap .prop-card{position:absolute;inset:0;aspect-ratio:unset;}
.card-prev,.card-next{position:absolute;top:50%;transform:translateY(-50%);z-index:10;background:rgba(0,0,0,.5);color:white;border:none;width:32px;height:32px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;backdrop-filter:blur(4px);}
.card-prev{left:8px;}
.card-next{right:8px;}
.prop-card-wrap:hover .card-prev,.prop-card-wrap:hover .card-next{opacity:1;}
.card-dots{position:absolute;bottom:70px;left:50%;transform:translateX(-50%);display:flex;gap:4px;z-index:10;}
.card-dot{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.4);cursor:pointer;transition:background .2s;}
.card-dot.active{background:white;}
.card-photo-count{position:absolute;top:12px;right:12px;z-index:10;background:rgba(0,0,0,.5);color:white;font-size:.65rem;font-weight:600;padding:3px 8px;border-radius:100px;backdrop-filter:blur(4px);}

/* CTA banner intermedio */
.cta-banner {
  background: linear-gradient(135deg, var(--ink3) 0%, var(--ink2) 100%);
  border-top: 1px solid var(--gl);
  border-bottom: 1px solid var(--gl);
  padding: 60px 6%;
  text-align: center;
}

/* Asesor card */
.asesor-card {
  background: var(--ink2);
  border: 1px solid var(--gl);
  border-radius: 4px;
  padding: 40px;
  display: flex;
  align-items: center;
  gap: 36px;
  flex-wrap: wrap;
}
.asesor-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--or), var(--or2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  color: var(--ink);
  font-weight: 600;
  flex-shrink: 0;
}

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
    <a href="/" class="logo"><img src="https://raw.githubusercontent.com/jventura26/realestate/main/src/zona/assets/images/logo.png" alt="Zona INNmueble" style="height:52px;width:auto"></a>
    <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    <ul class="nav-links" id="nav-links">
      <li><a href="/propiedades.html">Propiedades</a></li>
      <li><a href="/propiedades.html?tipo=Casa">Casas</a></li>
      <li><a href="/propiedades.html?tipo=Apartamento">Apartamentos</a></li>
      <li><a href="/propiedades.html?tipo=Fincas">Fincas</a></li>
      <li><a href="/blog.html">Blog</a></li>
      <li><a href="/zonas/guatemala.html">Zonas</a></li>
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


<footer style="background:var(--ink);border-top:1px solid var(--gl)">
  <div style="max-width:1200px;margin:0 auto;padding:60px 6% 0;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px">
    <div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:300;color:var(--wh);margin-bottom:16px"><em style="color:var(--or);font-style:normal">ZONA</em> INNmueble</div>
      <p style="font-size:.82rem;color:var(--sv);line-height:1.8;max-width:280px;margin-bottom:24px">Donde las oportunidades inmobiliarias se convierten en patrimonio. Guatemala Premium Real Estate.</p>
      <a href="https://wa.me/${WA}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:var(--or);color:var(--ink);font-size:.75rem;font-weight:700;padding:10px 18px;border-radius:4px;text-decoration:none;letter-spacing:.04em;transition:all .3s" onmouseover="this.style.background='var(--or2)'" onmouseout="this.style.background='var(--or)'">
        ${WA_SVG} WhatsApp +502 4554-2088
      </a>
    </div>
    <div>
      <h4 style="font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--or);margin-bottom:20px">Propiedades</h4>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px">
        <li><a href="/propiedades.html?tipo=Casa" style="font-size:.8rem;color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--wh)'" onmouseout="this.style.color='var(--sv)'">Residencias</a></li>
        <li><a href="/propiedades.html?tipo=Apartamento" style="font-size:.8rem;color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--wh)'" onmouseout="this.style.color='var(--sv)'">Apartamentos</a></li>
        <li><a href="/propiedades.html?tipo=Finca" style="font-size:.8rem;color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--wh)'" onmouseout="this.style.color='var(--sv)'">Fincas</a></li>
        <li><a href="/propiedades.html" style="font-size:.8rem;color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--wh)'" onmouseout="this.style.color='var(--sv)'">Ver todas</a></li>
      </ul>
    </div>
    <div>
      <h4 style="font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--or);margin-bottom:20px">Zonas</h4>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px">
        <li><a href="/zonas/guatemala.html" style="font-size:.8rem;color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--wh)'" onmouseout="this.style.color='var(--sv)'">Guatemala (Zona 10-16)</a></li>
        <li><a href="/zonas/fraijanes.html" style="font-size:.8rem;color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--wh)'" onmouseout="this.style.color='var(--sv)'">Fraijanes</a></li>
        <li><a href="/zonas/mixco.html" style="font-size:.8rem;color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--wh)'" onmouseout="this.style.color='var(--sv)'">Mixco</a></li>
        <li><a href="/zonas/santa-catarina-pinula.html" style="font-size:.8rem;color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--wh)'" onmouseout="this.style.color='var(--sv)'">Santa Catarina Pinula</a></li>
      </ul>
    </div>
    <div>
      <h4 style="font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--or);margin-bottom:20px">Contacto</h4>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px">
        <li style="font-size:.8rem;color:var(--sv)">📍 Guatemala City</li>
        <li style="font-size:.8rem;color:var(--sv)">📞 +502 4554-2088</li>
        <li style="font-size:.8rem;color:var(--sv)">⏰ Lun–Vie 8:00–18:00</li>
        <li><a href="/about.html" style="font-size:.8rem;color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--wh)'" onmouseout="this.style.color='var(--sv)'">Nosotros</a></li>
      </ul>
    </div>
  </div>
  <div style="max-width:1200px;margin:0 auto;padding:28px 6%;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-top:1px solid var(--gl);margin-top:48px">
    <span style="font-size:.72rem;color:var(--mt)">© 2026 Zona INNmueble Real Estate · Guatemala</span>
    <span style="font-size:.72rem;color:var(--mt)">Premium Real Estate · Propiedades verificadas</span>
  </div>
  <style>
    @media(max-width:768px){
      footer > div:first-child{grid-template-columns:1fr 1fr !important;}
      footer > div:first-child > div:first-child{grid-column:1/-1;}
    }
    @media(max-width:480px){
      footer > div:first-child{grid-template-columns:1fr !important;}
    }
  </style>
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

// HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if(hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
  
  // Cerrar menú al hacer click en un link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
  
  // Cerrar menú al hacer click fuera
  document.addEventListener('click', (e) => {
    if(!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });
}

// Newsletter forms listener

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
</script>
</html>`;
}

module.exports = { layout, WA };
