const { escapeHtml } = require('../../shared/utils');

const DOMAIN = 'https://vinculoinmobiliario.com';

function layout({ title, desc, canonical, ogImage, body, scripts = '' }) {
  const pageTitle = title
    ? `${escapeHtml(title)} | Vinculo Inmobiliario`
    : 'Vinculo Inmobiliario | Propiedades en Guatemala';
  const metaDesc  = escapeHtml(desc || 'Portal inmobiliario en Guatemala. Casas, apartamentos, fincas y terrenos con precios visibles.');
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{--cream:#F5F0E8;--cream2:#EDE8DE;--ink:#1C1C1C;--ink2:#3D3D3D;--gold:#8B6914;--gold2:#C9A96E;--silver:#6B7280;--border:#E5E0D8;--white:#fff;--card:#FAFAF8}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:var(--white);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{display:block;max-width:100%}a{text-decoration:none;color:inherit}
/* NAV */
nav{position:sticky;top:0;z-index:100;background:var(--white);border-bottom:1px solid var(--border);padding:0 6%}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:62px}
.logo{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase}
.logo em{font-style:normal;color:var(--gold)}
.nav-links{display:flex;gap:28px;list-style:none}
.nav-links a{font-size:.7rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--silver);transition:color .2s}
.nav-links a:hover{color:var(--gold)}
.nav-btn{background:var(--ink);color:var(--white);padding:8px 20px;font-size:.68rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;transition:background .2s}
.nav-btn:hover{background:var(--gold)}
/* LAYOUT */
section{padding:80px 6%}
.eyebrow{display:flex;align-items:center;gap:10px;margin-bottom:14px;font-size:.6rem;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:var(--gold)}
.eyebrow::before{content:'';width:24px;height:1px;background:var(--gold)}
.section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.9rem,3.8vw,3rem);font-weight:300;line-height:1.12;margin-bottom:12px}
.section-title em{font-style:italic;color:var(--gold)}
.section-sub{font-size:.82rem;color:var(--silver);line-height:1.9;max-width:480px;font-weight:300}
/* HERO */
.hero{background:var(--cream);padding:80px 6% 68px;position:relative;overflow:hidden}
.hero::after{content:'';position:absolute;right:0;top:0;bottom:0;width:42%;background:var(--cream2);clip-path:polygon(10% 0,100% 0,100% 100%,0 100%)}
.hero-content{position:relative;z-index:2;max-width:600px}
.hero h1{font-family:'Cormorant Garamond',serif;font-size:clamp(2.4rem,5.5vw,4.2rem);font-weight:300;line-height:1.08;margin-bottom:18px}
.hero h1 em{font-style:italic;color:var(--gold)}
.hero-sub{font-size:.88rem;font-weight:300;color:var(--silver);line-height:1.85;max-width:440px;margin-bottom:36px}
.hero-stats{display:flex;gap:44px;flex-wrap:wrap}
.stat-n{font-family:'Cormorant Garamond',serif;font-size:2.1rem;font-weight:400;color:var(--ink);line-height:1}
.stat-l{font-size:.62rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--silver);margin-top:4px}
/* FILTERS */
.filter-bar{background:var(--cream);padding:20px 6%;border-bottom:1px solid var(--border);display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.filter-bar select,.filter-bar input{background:var(--white);border:1px solid var(--border);color:var(--ink);padding:9px 13px;font-family:'Inter',sans-serif;font-size:.77rem;outline:none;transition:border-color .2s;appearance:none;min-width:130px}
.filter-bar select:focus,.filter-bar input:focus{border-color:var(--gold)}
.filter-bar input::placeholder{color:var(--silver)}
.filter-bar select option{background:var(--white)}
#clearF{background:none;border:1px solid var(--border);color:var(--silver);padding:9px 14px;font-size:.7rem;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s}
#clearF:hover{border-color:var(--gold);color:var(--gold)}
.f-count{font-size:.7rem;color:var(--silver);margin-left:auto;font-weight:300}
/* GRID */
.prop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--border)}
.prop-card{background:var(--white);overflow:hidden;display:block;transition:box-shadow .3s;position:relative}
.prop-card:hover{box-shadow:0 8px 40px rgba(0,0,0,.09);z-index:1}
.pc-img{aspect-ratio:4/3;overflow:hidden;background:var(--cream2);position:relative}
.pc-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.22,1,.36,1)}
.prop-card:hover .pc-img img{transform:scale(1.04)}
.pc-badge{position:absolute;top:12px;left:12px;background:var(--ink);color:var(--white);font-size:.56rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;padding:4px 9px}
.pc-badge.nueva{background:var(--gold)}
.pc-body{padding:18px 20px 20px}
.pc-tipo{font-size:.58rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:5px}
.pc-title{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:400;line-height:1.25;margin-bottom:7px;color:var(--ink)}
.pc-loc{font-size:.7rem;color:var(--silver);margin-bottom:12px}
.pc-meta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.pc-meta span{font-size:.66rem;color:var(--ink2)}
.pc-sep{height:1px;background:var(--border);margin-bottom:12px}
.pc-bottom{display:flex;justify-content:space-between;align-items:center}
.pc-price{font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:400;color:var(--ink)}
.pc-cta{font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
/* DETAIL */
.detail-hero{background:var(--cream);padding:36px 6% 0;border-bottom:1px solid var(--border)}
.breadcrumb{font-size:.68rem;color:var(--silver);display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:20px}
.breadcrumb a:hover{color:var(--gold)}
.detail-grid{display:grid;grid-template-columns:1fr 390px;gap:64px;padding:60px 6%;align-items:start}
.main-img img{width:100%;aspect-ratio:4/3;object-fit:cover}
.gal-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin-top:3px}
.gal-grid img{width:100%;aspect-ratio:1;object-fit:cover;cursor:pointer;transition:opacity .2s}
.gal-grid img:hover{opacity:.78}
.detail-title{font-family:'Cormorant Garamond',serif;font-size:2.1rem;font-weight:300;line-height:1.18;margin-bottom:10px}
.detail-price{font-family:'Cormorant Garamond',serif;font-size:1.9rem;color:var(--gold);margin-bottom:24px}
.specs-box{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);margin-bottom:28px}
.spec{background:var(--white);padding:13px 15px}
.spec-l{font-size:.57rem;font-weight:600;letter-spacing:.17em;text-transform:uppercase;color:var(--silver);margin-bottom:3px}
.spec-v{font-size:.88rem;font-weight:500;color:var(--ink)}
.detail-desc{font-size:.83rem;line-height:1.92;color:var(--ink2);font-weight:300;margin-bottom:26px}
.tag{display:inline-block;background:var(--cream);border:1px solid var(--border);padding:5px 12px;font-size:.68rem;color:var(--ink2);margin:0 5px 5px 0}
/* Side panel */
.side-panel{background:var(--cream);border:1px solid var(--border);padding:26px 22px}
.side-panel-title{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:400;margin-bottom:8px}
.ref-box{background:var(--cream2);border:1px solid var(--border);padding:14px;margin:16px 0;font-family:'Cormorant Garamond',serif;font-size:1.3rem;letter-spacing:.08em;text-align:center}
/* NO RESULTS */
.no-res{text-align:center;padding:72px 20px;grid-column:1/-1}
.no-res p{font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:var(--silver)}
.no-res small{font-size:.76rem;color:var(--silver)}
/* RELATED */
.related{background:var(--cream);padding:60px 6%}
.related .prop-grid{margin-top:36px}
/* FOOTER */
footer{background:var(--ink);color:var(--white);padding:52px 6% 26px}
.ft{display:grid;grid-template-columns:2fr 1fr 1fr;gap:56px;padding-bottom:36px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:22px}
.ft-brand{font-family:'Cormorant Garamond',serif;font-size:1.1rem;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px}
.ft-brand em{font-style:normal;color:var(--gold2)}
.ft-tag{font-size:.72rem;color:rgba(255,255,255,.38);line-height:1.8;font-weight:300;max-width:260px}
.ft-col h4{font-size:.57rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--gold2);margin-bottom:16px}
.ft-col ul{list-style:none}
.ft-col ul li{font-size:.7rem;color:rgba(255,255,255,.38);margin-bottom:9px}
.ft-bot{font-size:.6rem;color:rgba(255,255,255,.26);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
/* BTN */
.btn-dark{display:inline-block;background:var(--ink);color:var(--white);padding:13px 30px;font-size:.7rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;transition:background .2s}
.btn-dark:hover{background:var(--gold)}
.btn-outline-dark{display:inline-block;background:transparent;color:var(--ink);border:1px solid var(--border);padding:12px 28px;font-size:.7rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;transition:all .2s}
.btn-outline-dark:hover{border-color:var(--gold);color:var(--gold)}
/* RESPONSIVE */
@media(max-width:1024px){.prop-grid{grid-template-columns:repeat(2,1fr)}.detail-grid{grid-template-columns:1fr}}
@media(max-width:768px){
  .nav-links{display:none}.hero::after{display:none}.hero{padding:60px 5% 50px}
  section{padding:60px 5%}.prop-grid{grid-template-columns:1fr}
  .filter-bar{padding:14px 5%}.ft{grid-template-columns:1fr;gap:32px}
  .detail-grid{padding:32px 5%;gap:36px}.gal-grid{grid-template-columns:repeat(4,1fr)}
  .specs-box{grid-template-columns:1fr}.related{padding:52px 5%}
  .hero-stats{gap:28px}
}
</style>
</head>
<body>
<nav>
  <div class="nav-inner">
    <a class="logo" href="/"><em>Vinculo</em> Inmobiliario</a>
    <ul class="nav-links">
      <li><a href="/propiedades.html">Propiedades</a></li>
      <li><a href="/propiedades.html?tipo=Casa">Casas</a></li>
      <li><a href="/propiedades.html?tipo=Apartamento">Apartamentos</a></li>
      <li><a href="/propiedades.html?tipo=Fincas">Fincas</a></li>
    </ul>
    <a href="/propiedades.html" class="nav-btn">Explorar</a>
  </div>
</nav>
${body}
<footer>
  <div class="ft">
    <div>
      <div class="ft-brand"><em>Vinculo</em> Inmobiliario</div>
      <p class="ft-tag">Catálogo de propiedades en Guatemala. Información visual, precios y características para evaluación inicial.</p>
    </div>
    <div class="ft-col"><h4>Propiedades</h4><ul><li>Casas</li><li>Apartamentos</li><li>Fincas</li><li>Terrenos</li></ul></div>
    <div class="ft-col"><h4>Zonas</h4><ul><li>Zona 10 · Zona 14</li><li>Zona 15 · Zona 16</li><li>Fraijanes · Cayalá</li><li>Carretera al Salvador</li></ul></div>
  </div>
  <div class="ft-bot">
    <span>© ${new Date().getFullYear()} Vinculo Inmobiliario · Guatemala</span>
    <span>Portal inmobiliario privado</span>
  </div>
</footer>
${scripts}
</body>
</html>`;
}

module.exports = { layout };
