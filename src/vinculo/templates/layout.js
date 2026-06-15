const { escapeHtml } = require('../../shared/utils');

const DOMAIN = 'https://inmuhub.com';

function layout({ title, desc, canonical, ogImage, body, scripts = '' }) {
const pageTitle = title
? `${escapeHtml(title)} | INMUHUB.COM`
: 'INMUHUB.COM | Donde las oportunidades inmobiliarias se conectan';
const metaDesc = escapeHtml(desc || 'Catálogo de propiedades premium en Guatemala. Casas, apartamentos, fincas y terrenos verificados en las mejores zonas.');
const ogImg = ogImage || `${DOMAIN}/assets/og.jpg`;
const canon = `${DOMAIN}${canonical || '/'}`;

return `<!DOCTYPE html>
<html lang="es">
<head>
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','1003403445392993');
fbq('track','PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1003403445392993&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel Code -->

<meta charset="UTF-8">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="apple-touch-icon" href="/assets/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${pageTitle}</title>
<meta name="description" content="${metaDesc}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${canon}">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<meta name="theme-color" content="#1a2a4e">
<meta property="og:type" content="website">
<meta property="og:title" content="${pageTitle}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${escapeHtml(ogImg)}">
<meta property="og:locale" content="es_GT">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<!-- Cache Break: 1780943256260 -->
<style>
/* Generated: 2026-06-08T18:27:36.260Z */
/* Cache Breaker: 1780941103618 */
/* Build: 2026-06-08T16:53:42.342Z - Mobile Fix */
:root{
--white:#FFFFFF;--gray-50:#F9FAFB;--gray-100:#F3F4F6;--gray-200:#E5E7EB;
--gray-300:#D1D5DB;--gray-400:#9CA3AF;--gray-600:#4B5563;--gray-900:#111827;
--blue:#0066CC;--red:#DC2626;--border:var(--gray-200);--gold:#C9A96E
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:var(--white);color:var(--gray-900);-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{display:block;max-width:100%}
a{text-decoration:none;color:inherit}
/* NAV */
nav{position:sticky;top:0;z-index:100;background:var(--white);border-bottom:1px solid var(--border);padding:0 6%;backdrop-filter:blur(10px);}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:72px;min-height:72px;padding:0;}
.logo{display:flex;flex-direction:column;gap:2px;align-items:flex-start;text-decoration:none;color:inherit}
.logo-name{font-size:clamp(14px,2vw,22px);font-weight:800;letter-spacing:-0.5px;color:var(--gray-900);line-height:1}
.logo-tag{font-size:clamp(8px,1.5vw,13px);font-weight:500;color:var(--gray-700);letter-spacing:0.05em;text-transform:none;line-height:1.2;margin-top:2px}
.search-compact{display:flex;gap:8px;flex:1;max-width:320px;width:100%}
.search-compact input{flex:1;border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-family:inherit;font-size:14px;outline:none;min-width:0}
.search-compact input::placeholder{color:var(--gray-400)}
.search-compact button{background:none;border:1px solid var(--border);border-radius:8px;cursor:pointer;padding:8px 12px;color:var(--gray-600);transition:all .2s;flex-shrink:0}
.search-compact button:hover{border-color:var(--blue);color:var(--blue)}

/* Mobile search fix */
@media(max-width:480px){
.search-compact{max-width:100%;gap:4px}
.search-compact input{font-size:16px;padding:10px 8px}
.search-compact button{padding:10px 8px;font-size:14px}
.nav-inner{flex-wrap:wrap;height:auto;min-height:60px;padding:12px 0}
}
/* HEADER RESPONSIVE */
@media(max-width:768px){
.logo img { height: 44px !important; }
.logo-tag { font-size: 11px !important; margin-top: 2px !important; }
.nav-inner { align-items:flex-start !important;  min-height:auto !important; }
}

@media(max-width:480px){
.logo img { height: 40px !important; }
.logo-tag { font-size: 10px !important; margin-top: 1px !important; }
.logo-name { font-size: 14px !important; }
.nav-inner { align-items:flex-start !important;  min-height:auto !important; }
div[style*="display:flex"][style*="gap:12px"] { gap: 6px !important; font-size: 12px !important; }
}

/* MOBILE HEADER COMPACT */
@media(max-width:480px){
.logo { gap: 1px; }
.logo-tag { margin-top: 0px; font-size: 8px !important; }
a.logo img { height: 38px !important; }
div[style*="display:flex"][style*="gap:12px"] { gap: 4px !important; }
.nav-inner { align-items:flex-start !important;  min-height:auto !important; }
}

/* MOBILE NAVBAR - Hide links */
@media(max-width:768px){
.nav-inner > div:nth-child(2) { display: none; }
.nav-inner > .search-compact { margin-left: 0 !important; flex: 0 1 100%; max-width: 100%; }
}

@media(max-width:480px){
.nav-inner > div:nth-child(2) { display: none !important; }
.nav-inner > .search-compact { margin-left: 0 !important; width: 100%; max-width: 100%; }
nav { padding: 0 6%; }
.search-compact { gap: 4px; }
.search-compact input { font-size: 16px; padding: 8px; }
.search-compact button { padding: 8px; }
}

/* Content spacing from header */
.detail-container {
  margin-top: clamp(24px, 4vh, 48px);
}

/* Hide search from navbar */
.search-compact {
  display: none !important;
}

/* Mobile characteristics fix */
@media(max-width:480px){
div[style*="grid-template-columns:1fr 1fr"] {
  grid-template-columns: 1fr !important;
  gap: 8px !important;
}
label[style*="display:flex"][style*="gap:8px"] {
  font-size: 13px !important;
  padding: 6px !important;
}
}





/* HERO */
.hero-new{background:var(--gray-900);padding:72px 6%;text-align:center;position:relative;overflow:hidden}
.hero-new::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,169,110,.08) 0%,transparent 60%);pointer-events:none}
.hero-new .hero-tag{display:inline-block;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,169,110,0.35);padding:5px 16px;border-radius:100px;margin-bottom:20px}
.hero-new h1{font-size:clamp(32px,5vw,52px);font-weight:800;letter-spacing:-1.5px;margin-bottom:14px;color:var(--white);line-height:1.1}
.hero-new h1 span{color:var(--gold)}
.hero-new p{font-size:16px;color:rgba(255,255,255,.65);max-width:560px;margin:0 auto 36px;line-height:1.7}
.search-main{display:flex;gap:8px;max-width:600px;margin:0 auto;background:var(--white);border-radius:10px;border:1px solid var(--border);padding:5px}
.search-main input{flex:1;border:none;padding:12px 16px;font-size:15px;outline:none;font-family:inherit;color:var(--gray-900)}
.search-main button{background:var(--gray-900);color:var(--white);border:none;border-radius:7px;padding:12px 24px;font-weight:600;cursor:pointer;transition:all .2s;font-size:14px}
.search-main button:hover{background:var(--blue)}
/* FILTERS */
.filter-bar{background:var(--gray-50);padding:10px 6%;border-bottom:1px solid var(--border);display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end}
.filter-bar select,.filter-bar input{background:var(--white);border:1px solid var(--border);color:var(--gray-900);padding:8px 12px;font-family:inherit;font-size:14px;outline:none;transition:border-color .2s;min-width:120px}
.filter-bar select:focus,.filter-bar input:focus{border-color:var(--blue)}
#clearF,#cl{background:none;border:1px solid var(--border);color:var(--gray-600);padding:8px 14px;font-size:13px;cursor:pointer;font-family:inherit;transition:all .2s}
#clearF:hover,#cl:hover{border-color:var(--blue);color:var(--blue)}
.f-count{font-size:13px;color:var(--gray-600);margin-left:auto;font-weight:500}
/* GRID */
.prop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:16px 6%}
.property-card{display:flex;flex-direction:column;background:var(--white);border:0.5px solid var(--border);border-radius:12px;overflow:hidden;transition:border-color .25s ease,transform .25s ease;text-decoration:none;color:inherit}
.property-card:hover{border-color:var(--gray-400,#9ca3af);transform:translateY(-3px)}
.property-card:hover .card-img-wrap img{transform:scale(1.04)}
.card-img-wrap{position:relative;overflow:hidden;aspect-ratio:4/3;background:var(--gray-100)}
.card-img-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease;display:block}
.card-badges{position:absolute;top:10px;left:10px;right:10px;display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
.card-tipo{background:rgba(0,0,0,0.52);color:#fff;font-size:10px;font-weight:600;letter-spacing:.06em;padding:4px 10px;border-radius:20px;text-transform:uppercase;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.card-cinta{font-size:10px;font-weight:700;letter-spacing:.05em;padding:4px 10px;border-radius:20px;text-transform:uppercase;margin-left:auto}
.card-cinta--nueva,.card-cinta--precio-reducido{background:var(--gold,#C9A96E);color:#2d2416}
.card-cinta--venta{background:var(--blue);color:#fff}
.card-cinta--renta{background:var(--gray-700,#374151);color:#fff}
.card-body{padding:14px 16px 16px;display:flex;flex-direction:column;flex:1}
.card-price{font-size:19px;font-weight:700;color:var(--gold,#C9A96E);line-height:1;margin-bottom:7px;letter-spacing:-0.02em}
.card-title{font-size:.95rem;line-height:1.4;font-size:14px;font-weight:600;color:var(--gray-900);line-height:1.4;margin:0 0 5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-loc{font-size:12px;color:var(--gray-500,#6b7280);margin:0 0 10px;display:flex;align-items:flex-start;gap:4px;overflow:hidden}
.card-loc svg{flex-shrink:0;opacity:.5}
.card-loc span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.card-specs{display:flex;align-items:stretch;padding-top:10px;border-top:0.5px solid var(--border);margin-top:auto}
.cs-item{display:flex;align-items:flex-start;gap:5px;font-size:11px;color:var(--gray-600);font-weight:500;flex:1;justify-content:center;padding:0 4px}
.cs-item svg{opacity:.45;flex-shrink:0}
.cs-item:first-child{justify-content:flex-start;padding-left:0}
.cs-item:last-child{justify-content:flex-end;padding-right:0}
.cs-sep{width:0.5px;background:var(--border);flex-shrink:0;align-self:stretch}


.gallery-thumbs button{aspect-ratio:1;border:2px solid var(--gray-200);border-radius:8px;overflow:hidden;cursor:pointer;background:none;padding:0;transition:border-color .2s}
.gallery-thumbs button:hover{border-color:var(--blue)}
.gallery-thumbs img{width:100%;height:100%;object-fit:cover}

.breadcrumb{font-size:13px;color:var(--gray-600);margin-bottom:24px}
.breadcrumb a{transition:color .2s}
.breadcrumb a:hover{color:var(--blue)}
.detail-content h1{font-size:32px;font-weight:700;margin:20px 0 16px;color:var(--gray-900)}
.detail-price{font-size:28px;font-weight:700;color:var(--blue);margin-bottom:24px}

.dspec-list{list-style:none;margin:0 0 24px;padding:0;display:flex;flex-direction:column;gap:0;border:0.5px solid var(--border);border-radius:10px;overflow:hidden}
.dspec-item{display:flex;align-items:flex-start;gap:12px;padding:14px 18px;font-size:14px;border-bottom:0.5px solid var(--border);background:var(--white)}
.dspec-item:last-child{border-bottom:none}
.dspec-item svg{color:var(--gold);flex-shrink:0;opacity:.75}
.dspec-label{flex:1;color:var(--gray-500);font-size:13px;font-weight:500}
.dspec-val{font-weight:700;color:var(--gray-900);font-size:15px}
.dinfo-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0;border:0.5px solid var(--border);border-radius:10px;overflow:hidden}
.dinfo-item{display:flex;align-items:flex-start;gap:12px;padding:13px 18px;font-size:14px;border-bottom:0.5px solid var(--border);background:var(--white)}
.dinfo-item:last-child{border-bottom:none}
.dinfo-item svg{color:var(--gold);flex-shrink:0;opacity:.65}
.dinfo-label{color:var(--gray-500);font-size:12px;font-weight:500;min-width:76px}
.dinfo-val{color:var(--gray-900);font-weight:600;font-size:14px}
.desc-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0}
.desc-item{display:flex;align-items:flex-start;gap:12px;padding:0px 0 !important;line-height:1.6}
.desc-item:last-child{border-bottom:none}
.desc-bullet{width:7px;height:7px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:7px;opacity:.85}
.desc-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0}
.desc-item{display:flex;align-items:flex-start;gap:12px;padding:0px 0 !important;line-height:1.6}
.desc-item:last-child{border-bottom:none}
.desc-bullet{width:7px;height:7px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:7px;opacity:.85}



.description{margin-bottom:32px}
.description h2{font-size:20px;font-weight:600;margin-bottom:12px}
.description p{color:var(--gray-600);line-height:1.8}
.info-card{background:var(--gray-50);border:1px solid var(--border);border-radius:8px;padding:16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
.info-item{display:flex;flex-direction:column}
.info-item .label{font-size:12px;color:var(--gray-600);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.info-item .value{font-size:16px;font-weight:600;color:var(--gray-900)}
/* FOOTER */
.footer-brand h3{font-size:22px;font-weight:800;margin-bottom:4px;letter-spacing:-0.5px}
.footer-brand h3 span{color:var(--gold)}
.footer-brand .footer-brand p{color:rgba(255,255,255,.55);font-size:14px;line-height:1.7}

.footer-col h4{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;color:var(--gold)}
.footer-col ul{list-style:none;margin:0;padding:0}
.footer-col li{margin-bottom:8px;transition:all 0.2s}
.footer-col a{color:rgba(255,255,255,.65);font-size:14px;transition:color .2s;display:inline-block}
.footer-col a:hover{color:var(--gold);padding-left:4px}
}

  section h3 { font-size: 22px !important; }
  [style*="gap:32px"] { gap: 16px !important; }
  [style*="padding:40px"][style*="border-radius"] { padding: 24px !important; }
}

/* FOOTER RESPONSIVE */



.footer-col h4{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:20px;color:var(--gold)}
.footer-col ul{list-style:none;margin:0;padding:0}
.footer-col li{margin-bottom:10px}
.footer-col a{color:rgba(255,255,255,0.7);font-size:14px;transition:all 0.3s;text-decoration:none;display:inline-block}
.footer-col a:hover{color:var(--gold);transform:translateX(4px)}

.footer-brand p{color:rgba(255,255,255,0.6);font-size:13px;line-height:1.7;margin:12px 0}


/* TABLET */
@media(max-width:768px){

.footer-col h4{font-size:12px;margin-bottom:16px}
.footer-col a{font-size:13px}

}

/* MÓVIL */
@media(max-width:480px){


.footer-col h4{font-size:11px;margin-bottom:12px;letter-spacing:1px}
.footer-col a{font-size:12px;margin-bottom:6px}
.footer-col li{margin-bottom:8px}
.footer-brand p{font-size:12px}

}


/* MOBILE OPTIMIZATIONS */
@media(max-width:640px){
/* GENERAL */
body { font-size: 15px; }
* { max-width: 100%; }

/* NAVBAR */
nav { padding: 0 3%; }
.nav-inner { align-items:flex-start !important;  gap: 8px; }
.logo img { height: 85px; }
.logo-tag { display: block; font-size: 11px; }
.logo { gap: 2px; }
.nav-inner > div:last-child { gap: 4px; font-size: 11px; }

/* HERO */
.hero-new { padding: 32px 3%; min-height: auto; }
.hero-new h1 { font-size: 24px; line-height: 1.2; margin-bottom: 16px; }
.hero-new p { font-size: 13px; }

/* CARDS */
.prop-card { border-radius: 12px; overflow: hidden; }
.prop-card img { height: 200px; object-fit: cover; }
.prop-card-body { padding: 16px; }
.prop-card-title { font-size: 14px; }
.prop-price { font-size: 16px; }

/* GRID */
.prop-grid { grid-template-columns: 1fr; gap: 16px; padding: 16px 3%; }


.gallery-main img { height: 300px; object-fit: cover; border-radius: 12px; }
.gallery-thumbs { max-height: 95px; gap: 6px; }
.gallery-thumbs img { width: 60px; height: 80px; }






/* CALCULATOR */
section[style*="padding:48px"] { padding: 28px 3% !important; }
section h3 { font-size: 20px !important; margin-bottom: 24px !important; }
[style*="padding:40px"][style*="border-radius"] { padding: 24px !important; }
[style*="grid-template-columns:1fr 1fr"] { grid-template-columns: 1fr !important; gap: 16px !important; }
[style*="font-size:32px"] { font-size: 24px !important; }
input[type="number"], input[type="range"] { width: 100%; padding: 10px; }
label { font-size: 12px; }

/* FOOTER */
.footer-bottom p { word-break: break-word; }
}

@media(max-width:380px){
.logo img { height: 110px; }
.hero-new h1 { font-size: 20px; }
.detail-content h1 { font-size: 18px; }

[style*="padding:40px"] { padding: 16px !important; }
}


/* ULTIMATE MOBILE FIX */
@media screen and (max-width:768px){
* { box-sizing: border-box; }
html, body { width: 100% !important; max-width: 100% !important; overflow-x: hidden !important; margin: 0 !important; padding: 0 !important; }
body > * { width: 100% !important; max-width: 100% !important; }
}

@media screen and (max-width:480px){
* { box-sizing: border-box; }
html { width: 100% !important; overflow-x: hidden !important; }
body { width: 100% !important; max-width: 100% !important; overflow-x: hidden !important; margin: 0 !important; padding: 0 !important; }
img { max-width: 100% !important; width: auto !important; height: auto !important; display: block; }
.detail-container { width: 100% !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; }
.detail-gallery { width: 100% !important; max-width: 100% !important; overflow: hidden !important; }
.gallery-main { width: 100% !important; overflow: hidden !important; }
.gallery-main img { width: 100% !important; max-width: none; height: auto !important; display: block !important; }
.gallery-thumbs { width: 100% !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch; padding: 0 !important; }
.gallery-thumbs button { flex: 0 0 auto; }
.gallery-thumbs img { max-height: 80px !important; width: auto !important; }
.detail-content { width: 100% !important; max-width: 100% !important; padding: 16px !important; margin: 0 !important; overflow-x: hidden !important; }
section { width: 100% !important; max-width: 100% !important; padding: 20px 12px !important; margin: 0 !important; overflow-x: hidden !important; }
div[style*="max-width:1200px"] { width: 100% !important; max-width: 100% !important; padding: 0 12px !important; }
div[style*="padding:48px"] { padding: 20px 12px !important; }
div[style*="padding:40px"] { padding: 16px 12px !important; }
div[style*="padding:32px"] { padding: 16px 12px !important; }
div[style*="display:grid"][style*="grid-template-columns:1fr 1fr"] { grid-template-columns: 1fr !important; }
.nav-inner { align-items:flex-start !important;  padding: 0 12px !important; }
a[style*="padding:16px 48px"] { padding: 12px 24px !important; }
input, textarea, select, button { font-size: 16px !important; width: 100% !important; max-width: 100% !important; }
}/* FOOTER SIMPLE Y RESPONSIVE */
footer{background:var(--gray-900);color:var(--white);margin-top:80px;padding:0;width:100%;box-sizing:border-box}
.footer-content{max-width:1200px;margin:0 auto;padding:48px 6%;width:100%;box-sizing:border-box;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:40px;align-items:flex-start}
.footer-col{display:flex;flex-direction:column;gap:0}
.footer-col h4{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 16px 0;color:var(--gold)}
.footer-col ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.footer-col li{margin:0;padding:0}
.footer-col a{color:rgba(255,255,255,0.7);font-size:13px;transition:all 0.2s;text-decoration:none}
.footer-col a:hover{color:var(--gold);margin-left:4px}
.footer-brand h4{margin:0 0 12px 0}
.footer-brand p{color:rgba(255,255,255,0.65);font-size:13px;line-height:1.6;margin:12px 0 0 0}
.footer-bottom{border-top:1px solid rgba(255,255,255,0.1);padding:16px 6%;text-align:center;color:rgba(255,255,255,0.4);font-size:11px;margin-top:20px}

@media(max-width:768px){
.footer-content{grid-template-columns:repeat(2,1fr);gap:32px;padding:32px 4%}
.footer-col h4{font-size:12px;margin-bottom:12px}
.footer-col a{font-size:12px}
}

@media(max-width:480px){
.footer-content{grid-template-columns:1fr;gap:24px;padding:24px 4%}
.footer-brand{margin-bottom:12px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.1)}
.footer-col h4{font-size:11px;margin-bottom:10px}
.footer-col a{font-size:11px}
.footer-col ul{gap:6px}
.footer-bottom{padding:12px 4%;font-size:10px}
}

/* TÍTULOS ALINEADOS */
.detail-content h1{font-size:32px;font-weight:700;color:#1a2a4e;margin:0 0 8px 0;line-height:1.2}
.detail-price{font-size:28px;font-weight:600;color:#ffa500;margin:16px 0 24px 0;display:inline-block;padding:8px 16px;background:rgba(255,165,0,0.05);border-radius:8px}

@media(max-width:768px){
.detail-content h1{font-size:26px;margin-bottom:12px}
.detail-price{font-size:22px;padding:6px 12px}
}

@media(max-width:480px){
.detail-content h1{font-size:20px;margin-bottom:8px}
.detail-price{font-size:18px;margin:12px 0 16px 0;padding:6px 10px}
}



.gallery-main img{width:100%;height:100%;object-fit:cover;display:block;position:relative;z-index:1}

.gallery-thumbs button{aspect-ratio:1;border:2px solid var(--gray-200);border-radius:8px;overflow:hidden;cursor:pointer;background:none;padding:0;transition:border-color .2s;position:relative;z-index:1}
.gallery-thumbs button:hover{border-color:var(--blue)}
.gallery-thumbs img{width:100%;height:100%;object-fit:cover;display:block}

.detail-content h1{position:relative;z-index:2;margin:0 0 8px 0}
.detail-price{position:relative;z-index:2;display:block}

/* DETAIL PAGE - SIN OVERLAPS */
.detail-container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 40px 6%; 
  display: block;
  overflow: visible;
}

.detail-gallery { 
  margin-bottom: 40px;
  display: block;
  overflow: hidden;
  width: 100%;
}

.gallery-main { 
  width: 100%; 
  aspect-ratio: 16/10; 
  background: var(--gray-100); 
  border-radius: 12px; 
  overflow: hidden; 
  margin-bottom: 12px;
  display: block;
}

.gallery-main img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover;
  display: block;
}

.gallery-thumbs { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); 
  gap: 8px;
  width: 100%;
}

.gallery-thumbs button { 
  aspect-ratio: 1; 
  border: 2px solid var(--gray-200); 
  border-radius: 8px; 
  overflow: hidden; 
  cursor: pointer; 
  background: none; 
  padding: 0; 
  transition: border-color .2s;
}

.gallery-thumbs button:hover { 
  border-color: var(--blue);
}

.gallery-thumbs img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover;
  display: block;
}

.detail-content { 
  margin-top: 40px;
  padding-top: 0;
  width: 100%;
  display: block;
  clear: both;
}

.detail-content h1 {
  margin: 0 0 16px 0;
  padding: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-900);
  position: static;
}

.detail-price {
  margin: 16px 0 24px 0;
  padding: 8px 16px;
  font-size: 28px;
  font-weight: 700;
  color: var(--blue);
  background: rgba(26, 42, 78, 0.05);
  border-radius: 8px;
  display: inline-block;
  position: static;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 24px;
  margin-bottom: 32px;
  width: 100%;
}

.description {
  margin: 24px 0;
  padding: 0;
  width: 100%;
}

.info-card {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid var(--border);
  width: 100%;
}
/* Footer logo responsive */
@media(max-width:768px){.footer-content img { height:64px !important; }}
@media(max-width:480px){.footer-content img { height:72px !important; }}
/* Footer Responsive Mobile */
@media(max-width:768px){
footer > div:first-child > div { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
}
@media(max-width:480px){
footer > div:first-child > div { grid-template-columns: 1fr !important; gap: 32px !important; padding: 40px 6% !important; }
footer h4 { font-size: 11px !important; margin-bottom: 16px !important; }
footer a { font-size: 12px !important; }
footer > div:last-child { flex-direction: column !important; gap: 16px !important; text-align: center !important; }
footer > div:last-child > div:last-child { text-align: center !important; }
}
/* FOOTER MOBILE FIX */
@media(max-width:768px){
footer [style*="grid-template-columns"] { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
}
@media(max-width:480px){
footer [style*="grid-template-columns"] { grid-template-columns: 1fr !important; gap: 32px !important; }
footer h4 { font-size: 11px !important; }
footer > div:last-child { padding: 24px 6% !important; }
footer > div:last-child > div { text-align: center !important; }
}
</style>
</head>
<body>
<nav>
<div class="nav-inner">
  <a href="/" class="logo" style="display:flex;align-items:center;text-decoration:none;flex-shrink:0">
    <img src="/assets/logo-horizontal.png" alt="INMUHUB - Conecta tu inversion inmobiliaria" style="height:44px;width:auto;" loading="lazy">
  </a>
  <div style="display:flex;align-items:center;gap:4px;margin:0 auto;padding:0 32px">
    <a href="/propiedades.html" style="font-size:13px;font-weight:500;color:#4a5568;padding:8px 14px;border-radius:6px;text-decoration:none;transition:all .2s;white-space:nowrap" onmouseover="this.style.color='#0f1b2e';this.style.background='#f7f8fa'" onmouseout="this.style.color='#4a5568';this.style.background='transparent'">Propiedades</a>
    <a href="/herramientas/valuador.html" style="font-size:13px;font-weight:500;color:#4a5568;padding:8px 14px;border-radius:6px;text-decoration:none;transition:all .2s;white-space:nowrap" onmouseover="this.style.color='#0f1b2e';this.style.background='#f7f8fa'" onmouseout="this.style.color='#4a5568';this.style.background='transparent'">Valuador</a>
    <a href="/herramientas/calculadora-hipotecaria.html" style="font-size:13px;font-weight:500;color:#4a5568;padding:8px 14px;border-radius:6px;text-decoration:none;transition:all .2s;white-space:nowrap" onmouseover="this.style.color='#0f1b2e';this.style.background='#f7f8fa'" onmouseout="this.style.color='#4a5568';this.style.background='transparent'">Calculadora</a>
    <a href="/herramientas/simulador-inversion.html" style="font-size:13px;font-weight:500;color:#4a5568;padding:8px 14px;border-radius:6px;text-decoration:none;transition:all .2s;white-space:nowrap" onmouseover="this.style.color='#0f1b2e';this.style.background='#f7f8fa'" onmouseout="this.style.color='#4a5568';this.style.background='transparent'">Simulador</a>
    <a href="/herramientas/guia-compra.html" style="font-size:13px;font-weight:500;color:#4a5568;padding:8px 14px;border-radius:6px;text-decoration:none;transition:all .2s;white-space:nowrap" onmouseover="this.style.color='#0f1b2e';this.style.background='#f7f8fa'" onmouseout="this.style.color='#4a5568';this.style.background='transparent'">Guia</a>
  </div>
  <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
    <div style="display:flex;align-items:center;background:#f7f8fa;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
      <input type="text" id="navSearch" placeholder="Buscar..." style="border:none;background:transparent;padding:8px 12px;font-size:13px;width:160px;outline:none;color:#1a2a4e">
      <button aria-label="Buscar" style="background:none;border:none;padding:8px 12px;cursor:pointer;font-size:14px;color:#4a5568">🔍</button>
    </div>
  </div>
</div>
</nav>
${body}
<footer style="background:#060e1c;color:white;margin-top:0;padding:0;border-top:1px solid rgba(255,255,255,.06)">
  <!-- CTA STRIP -->
  <div style="background:linear-gradient(135deg,#0a1628 0%,#1a2a4e 100%);padding:56px 6%;text-align:center;border-bottom:1px solid rgba(201,169,110,.15)">
    <div style="max-width:600px;margin:0 auto">
      <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:14px">Asesoria sin costo</div>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:300;color:white;margin-bottom:20px;line-height:1.2">Tu propiedad ideal esta <em style="font-style:italic;color:var(--gold)">a un mensaje</em></h2>
      <p style="font-size:.9rem;color:rgba(255,255,255,.55);margin-bottom:32px;line-height:1.7">Contactanos por WhatsApp y un asesor te responde en menos de 1 hora.</p>
      <a href="https://wa.me/50245542088" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;background:#25d366;color:white;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;transition:all .3s" onmouseover="this.style.background='#1da851'" onmouseout="this.style.background='#25d366'">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Escribir por WhatsApp
      </a>
    </div>
  </div>
  <!-- MAIN FOOTER -->
  <div style="max-width:1200px;margin:0 auto;padding:64px 6% 0">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:56px">
      <!-- BRAND -->
      <div>
        <img src="/assets/logo-horizontal.png" alt="INMUHUB" style="height:36px;width:auto;margin-bottom:20px;filter:brightness(0) invert(1)" loading="lazy">
        <p style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.8;margin:0 0 24px;max-width:280px">Conectamos compradores e inversionistas con las mejores propiedades en Guatemala. Verificadas, asesoradas y sin sorpresas.</p>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="width:8px;height:8px;background:#25d366;border-radius:50%;display:inline-block;animation:pulse 2s infinite"></span>
          <span style="font-size:12px;color:rgba(255,255,255,.4)">Disponibles Lun-Vie 8:00-18:00</span>
        </div>
      </div>
      <!-- PROPIEDADES -->
      <div>
        <h4 style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin:0 0 20px">Propiedades</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px">
          <li><a href="/propiedades.html?tipo=Casa" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Casas</a></li>
          <li><a href="/propiedades.html?tipo=Apartamento" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Apartamentos</a></li>
          <li><a href="/propiedades.html?tipo=Finca" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Fincas</a></li>
          <li><a href="/propiedades.html?tipo=Terreno" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Terrenos</a></li>
          <li><a href="/propiedades.html" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Ver todas</a></li>
        </ul>
      </div>
      <!-- HERRAMIENTAS -->
      <div>
        <h4 style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin:0 0 20px">Herramientas</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px">
          <li><a href="/herramientas/valuador.html" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Valuador</a></li>
          <li><a href="/herramientas/calculadora-hipotecaria.html" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Calculadora</a></li>
          <li><a href="/herramientas/simulador-inversion.html" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Simulador</a></li>
          <li><a href="/herramientas/guia-compra.html" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Guia de Compra</a></li>
        </ul>
      </div>
      <!-- ZONAS -->
      <div>
        <h4 style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin:0 0 20px">Zonas Premium</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px">
          <li><a href="/propiedades.html?ciudad=Guatemala" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Guatemala</a></li>
          <li><a href="/propiedades.html?ciudad=Mixco" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Mixco</a></li>
          <li><a href="/propiedades.html?ciudad=Fraijanes" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Fraijanes</a></li>
          <li><a href="/propiedades.html?ciudad=Santa+Catarina+Pinula" style="font-size:13px;color:rgba(255,255,255,.5);text-decoration:none;transition:color .2s" onmouseover="this.style.color='white'" onmouseout="this.style.color='rgba(255,255,255,.5)'">Santa Catarina</a></li>
        </ul>
      </div>
    </div>
    <!-- BOTTOM BAR -->
    <div style="border-top:1px solid rgba(255,255,255,.06);padding:24px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <p style="margin:0;font-size:12px;color:rgba(255,255,255,.3)">&copy; \${new Date().getFullYear()} INMUHUB.COM — Todos los derechos reservados</p>
      <p style="margin:0;font-size:12px;color:rgba(255,255,255,.3)">Guatemala City, Guatemala &middot; +502 4554-2088</p>
    </div>
  </div>
  <!-- MOBILE RESPONSIVE -->
  <style>
    @media(max-width:768px){
      .footer-grid{grid-template-columns:1fr 1fr !important;}
      .footer-brand{grid-column:1/-1;}
    }
    @media(max-width:480px){
      .footer-grid{grid-template-columns:1fr !important;}
      .nav-inner{height:auto !important;min-height:60px !important;padding:12px 0 !important;}
      .nav-inner > div:nth-child(2){display:none !important;}
    }
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  </style>
</footer>
${scripts}
</body>
</html>`;
}

module.exports = { layout };
<!-- INMUHUB v2.0.16 - PIXEL ACTIVO -->
