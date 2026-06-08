const { escapeHtml } = require('../../shared/utils');

const DOMAIN = 'https://inmuhub.com';

function layout({ title, desc, canonical, ogImage, body, scripts = '' }) {
const pageTitle = title
? `${escapeHtml(title)} | INMUHUB.COM`
: 'INMUHUB.COM | Donde las oportunidades inmobiliarias se conectan';
const metaDesc = escapeHtml(desc || 'CatÃ¡logo de propiedades premium en Guatemala. Casas, apartamentos, fincas y terrenos verificados en las mejores zonas.');
const ogImg = ogImage || `${DOMAIN}/assets/og.jpg`;
const canon = `${DOMAIN}${canonical || '/'}`;

return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${pageTitle}</title>
<meta name="description" content="${metaDesc}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${canon}">
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
<style>
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
nav{position:sticky;top:0;z-index:100;background:var(--white);border-bottom:1px solid var(--border);padding:0 6%}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px;gap:20px}
.logo{display:flex;flex-direction:column;gap:2px}
.logo-name{font-size:18px;font-weight:800;letter-spacing:-0.5px;color:var(--gray-900);line-height:1}
.logo-tag{font-size:10px;font-weight:500;color:var(--gold);letter-spacing:0.12em;text-transform:uppercase;line-height:1}
.search-compact{display:flex;gap:8px;flex:1;max-width:320px}
.search-compact input{flex:1;border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-family:inherit;font-size:14px;outline:none}
.search-compact input::placeholder{color:var(--gray-400)}
.search-compact button{background:none;border:1px solid var(--border);border-radius:8px;cursor:pointer;padding:8px 12px;color:var(--gray-600);transition:all .2s}
.search-compact button:hover{border-color:var(--blue);color:var(--blue)}
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
.filter-bar{background:var(--gray-50);padding:20px 6%;border-bottom:1px solid var(--border);display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.filter-bar select,.filter-bar input{background:var(--white);border:1px solid var(--border);color:var(--gray-900);padding:8px 12px;font-family:inherit;font-size:14px;outline:none;transition:border-color .2s;min-width:120px}
.filter-bar select:focus,.filter-bar input:focus{border-color:var(--blue)}
#clearF,#cl{background:none;border:1px solid var(--border);color:var(--gray-600);padding:8px 14px;font-size:13px;cursor:pointer;font-family:inherit;transition:all .2s}
#clearF:hover,#cl:hover{border-color:var(--blue);color:var(--blue)}
.f-count{font-size:13px;color:var(--gray-600);margin-left:auto;font-weight:500}
/* GRID */
.prop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:32px 6%}
.property-card{display:flex;flex-direction:column;background:var(--white);border:0.5px solid var(--border);border-radius:12px;overflow:hidden;transition:border-color .25s ease,transform .25s ease;text-decoration:none;color:inherit}
.property-card:hover{border-color:var(--gray-400,#9ca3af);transform:translateY(-3px)}
.property-card:hover .card-img-wrap img{transform:scale(1.04)}
.card-img-wrap{position:relative;overflow:hidden;aspect-ratio:4/3;background:var(--gray-100)}
.card-img-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease;display:block}
.card-badges{position:absolute;top:10px;left:10px;right:10px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.card-tipo{background:rgba(0,0,0,0.52);color:#fff;font-size:10px;font-weight:600;letter-spacing:.06em;padding:4px 10px;border-radius:20px;text-transform:uppercase;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.card-cinta{font-size:10px;font-weight:700;letter-spacing:.05em;padding:4px 10px;border-radius:20px;text-transform:uppercase;margin-left:auto}
.card-cinta--nueva,.card-cinta--precio-reducido{background:var(--gold,#C9A96E);color:#2d2416}
.card-cinta--venta{background:var(--blue);color:#fff}
.card-cinta--renta{background:var(--gray-700,#374151);color:#fff}
.card-body{padding:14px 16px 16px;display:flex;flex-direction:column;flex:1}
.card-price{font-size:19px;font-weight:700;color:var(--gold,#C9A96E);line-height:1;margin-bottom:7px;letter-spacing:-0.02em}
.card-title{font-size:14px;font-weight:600;color:var(--gray-900);line-height:1.4;margin:0 0 5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-loc{font-size:12px;color:var(--gray-500,#6b7280);margin:0 0 10px;display:flex;align-items:center;gap:4px;overflow:hidden}
.card-loc svg{flex-shrink:0;opacity:.5}
.card-loc span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.card-specs{display:flex;align-items:stretch;padding-top:10px;border-top:0.5px solid var(--border);margin-top:auto}
.cs-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--gray-600);font-weight:500;flex:1;justify-content:center;padding:0 4px}
.cs-item svg{opacity:.45;flex-shrink:0}
.cs-item:first-child{justify-content:flex-start;padding-left:0}
.cs-item:last-child{justify-content:flex-end;padding-right:0}
.cs-sep{width:0.5px;background:var(--border);flex-shrink:0;align-self:stretch}
/* DETAIL */
.detail-container{max-width:1200px;margin:0 auto;padding:40px 6%}
.detail-gallery{margin-bottom:40px}
.gallery-main{width:100%;aspect-ratio:16/10;background:var(--gray-100);border-radius:12px;overflow:hidden;margin-bottom:12px}
.gallery-main img{width:100%;height:100%;object-fit:cover}
.gallery-thumbs{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px}
.gallery-thumbs button{aspect-ratio:1;border:2px solid var(--gray-200);border-radius:8px;overflow:hidden;cursor:pointer;background:none;padding:0;transition:border-color .2s}
.gallery-thumbs button:hover{border-color:var(--blue)}
.gallery-thumbs img{width:100%;height:100%;object-fit:cover}
.detail-content{max-width:800px}
.breadcrumb{font-size:13px;color:var(--gray-600);margin-bottom:24px}
.breadcrumb a{transition:color .2s}
.breadcrumb a:hover{color:var(--blue)}
.detail-content h1{font-size:32px;font-weight:700;margin:20px 0 16px;color:var(--gray-900)}
.detail-price{font-size:28px;font-weight:700;color:var(--blue);margin-bottom:24px}
.specs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid var(--border)}
.dspec-list{list-style:none;margin:0 0 24px;padding:0;display:flex;flex-direction:column;gap:0;border:0.5px solid var(--border);border-radius:10px;overflow:hidden}
.dspec-item{display:flex;align-items:center;gap:12px;padding:14px 18px;font-size:14px;border-bottom:0.5px solid var(--border);background:var(--white)}
.dspec-item:last-child{border-bottom:none}
.dspec-item svg{color:var(--gold);flex-shrink:0;opacity:.75}
.dspec-label{flex:1;color:var(--gray-500);font-size:13px;font-weight:500}
.dspec-val{font-weight:700;color:var(--gray-900);font-size:15px}
.dinfo-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0;border:0.5px solid var(--border);border-radius:10px;overflow:hidden}
.dinfo-item{display:flex;align-items:center;gap:12px;padding:13px 18px;font-size:14px;border-bottom:0.5px solid var(--border);background:var(--white)}
.dinfo-item:last-child{border-bottom:none}
.dinfo-item svg{color:var(--gold);flex-shrink:0;opacity:.65}
.dinfo-label{color:var(--gray-500);font-size:12px;font-weight:500;min-width:76px}
.dinfo-val{color:var(--gray-900);font-weight:600;font-size:14px}
.desc-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0}
.desc-item{display:flex;align-items:flex-start;gap:12px;padding:13px 0;border-bottom:0.5px solid var(--border);font-size:14px;color:var(--gray-700);line-height:1.6}
.desc-item:last-child{border-bottom:none}
.desc-bullet{width:7px;height:7px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:7px;opacity:.85}
.desc-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0}
.desc-item{display:flex;align-items:flex-start;gap:12px;padding:13px 0;border-bottom:0.5px solid var(--border);font-size:14px;color:var(--gray-700);line-height:1.6}
.desc-item:last-child{border-bottom:none}
.desc-bullet{width:7px;height:7px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:7px;opacity:.85}
.spec{text-align:center}
.spec-value{font-size:24px;font-weight:700;color:var(--blue)}
.spec-label{font-size:12px;color:var(--gray-600);margin-top:4px;text-transform:uppercase;letter-spacing:.5px}
.description{margin-bottom:32px}
.description h2{font-size:20px;font-weight:600;margin-bottom:12px}
.description p{color:var(--gray-600);line-height:1.8}
.info-card{background:var(--gray-50);border:1px solid var(--border);border-radius:8px;padding:16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
.info-item{display:flex;flex-direction:column}
.info-item .label{font-size:12px;color:var(--gray-600);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.info-item .value{font-size:16px;font-weight:600;color:var(--gray-900)}
/* FOOTER */
footer{background:var(--gray-900);color:var(--white);margin-top:80px}
.footer-content{max-width:1200px;margin:0 auto;padding:48px 6%;display:grid;grid-template-columns:1fr 2fr;gap:48px}
.footer-brand h3{font-size:22px;font-weight:800;margin-bottom:4px;letter-spacing:-0.5px}
.footer-brand h3 span{color:var(--gold)}
.footer-brand .footer-slogan{color:var(--gold);font-size:12px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px}
.footer-brand p{color:rgba(255,255,255,.55);font-size:14px;line-height:1.7}
.footer-links{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:32px}
.footer-col h4{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;color:var(--gold)}
.footer-col ul{list-style:none}
.footer-col ul li{margin-bottom:8px}
.footer-col a{color:rgba(255,255,255,.6);font-size:14px;transition:color .2s}
.footer-col a:hover{color:var(--white)}
.footer-bottom{border-top:1px solid rgba(255,255,255,.1);padding:24px 6%;text-align:center;color:rgba(255,255,255,.35);font-size:12px}
/* NO RESULTS */
.no-res{text-align:center;padding:72px 20px;grid-column:1/-1}
.no-res p{font-size:16px;color:var(--gray-600)}
/* RESPONSIVE */
@media(max-width:1024px){.prop-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
nav{padding:0 4%}.nav-inner{height:56px}.search-compact{display:none}
.hero-new{padding:56px 4%}.prop-grid{grid-template-columns:1fr;padding:20px 4%}
.filter-bar{padding:14px 4%}.detail-container{padding:24px 4%}
.footer-content{grid-template-columns:1fr;gap:32px}
.specs-grid{grid-template-columns:1fr}
}
</style>
</head>
<body>
<nav>
<div class="nav-inner">
<a href="/" class="logo">
<span class="logo-name">INMUHUB<span style="color:var(--gold)">.</span>COM</span>
<span class="logo-tag">Propiedades premium en Guatemala</span>
</a>
<div class="search-compact">
<input type="text" id="navSearch" placeholder="Buscar propiedades...">
<button aria-label="Filtros">âï¸</button>
</div>
</div>
</nav>
${body}
<footer>
<div class="footer-content">
<div class="footer-brand">
<h3>INMUHUB<span>.</span>COM</h3>
<div class="footer-slogan">Donde las oportunidades inmobiliarias se conectan</div>
<p>CatÃ¡logo de propiedades premium en Guatemala. Casas, apartamentos, fincas y terrenos con informaciÃ³n verificada en las mejores zonas.</p>
</div>
<div class="footer-links">
<div class="footer-col">
<h4>Propiedades</h4>
<ul>
<li><a href="/propiedades.html?tipo=Casa">Casas</a></li>
<li><a href="/propiedades.html?tipo=Apartamento">Apartamentos</a></li>
<li><a href="/propiedades.html?tipo=Fincas">Fincas</a></li>
<li><a href="/propiedades.html?tipo=Terreno">Terrenos</a></li>
</ul>
</div>
<div class="footer-col">
<h4>Zonas</h4>
<ul>
<li><a href="/propiedades.html?municipio=Zona%2010">Zona 10</a></li>
<li><a href="/propiedades.html?municipio=Zona%2014">Zona 14</a></li>
<li><a href="/propiedades.html?municipio=CayalÃ¡">CayalÃ¡</a></li>
<li><a href="/propiedades.html?municipio=Fraijanes">Fraijanes</a></li>
</ul>
</div>
<div class="footer-col">
<h4>Inmuhub</h4>
<ul>
<li><a href="/">Inicio</a></li>
<li><a href="/propiedades.html">CatÃ¡logo</a></li>
</ul>
</div>
</div>
</div>
<div class="footer-bottom">
<p>&copy; ${new Date().getFullYear()} INMUHUB.COM &nbsp;Â·&nbsp; Donde las oportunidades inmobiliarias se conectan &nbsp;Â·&nbsp; Guatemala</p>
</div>
</footer>
${scripts}
</body>
</html>`;
}

module.exports = { layout };
