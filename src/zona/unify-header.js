// Encabezado único para las páginas estáticas (blog, artículos, zonas, FAQ, 404…)
// que no se generan con layout.js. Reemplaza su barra propia por la misma del inicio:
// mismo logo sin fondo, mismos enlaces y el mismo botón de Asesoría.
const fs = require('fs');
const path = require('path');

const WA = '50245542088';
const LINKS = [
  ['/propiedades.html', 'Comprar'],
  ['/zonas/index.html', 'Zonas'],
  ['/valor-por-zona.html', 'Valor por zona'],
  ['/indice.html', '&Iacute;ndice'],
  ['/vender.html', 'Vender'],
  ['/servicios.html', 'Servicios'],
  ['/blog.html', 'Blog'],
  ['/about.html', 'Nosotros'],
];

const CSS = `<style id="zh-css">
#zh{position:fixed;top:0;left:0;right:0;z-index:300;height:68px;background:rgba(13,27,62,.97);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);border-bottom:1px solid rgba(201,163,91,.18);font-family:'Montserrat',system-ui,sans-serif}
#zh .zh-in{display:flex;align-items:center;justify-content:space-between;height:68px;padding:0 6%;box-sizing:border-box}
#zh .zh-logo{display:flex;align-items:center;line-height:0}
#zh .zh-logo img{height:52px;width:auto;display:block;background:none}
#zh .zh-links{display:flex;align-items:center;gap:30px;margin:0;padding:0;list-style:none}
#zh .zh-links a{color:#AEB9C8;text-decoration:none;font-size:.74rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;transition:color .2s}
#zh .zh-links a:hover{color:#fff}
#zh .zh-cta{border:1px solid #C9A35B;color:#C9A35B;padding:10px 22px;font-size:.76rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;border-radius:4px;transition:all .3s}
#zh .zh-cta:hover{background:#C9A35B;color:#0D1B3E}
#zh .zh-btn{display:none;background:none;border:0;padding:8px;cursor:pointer}
#zh .zh-btn span{display:block;width:24px;height:2px;background:#C9A35B;margin:5px 0;transition:transform .25s,opacity .25s}
#zh.open .zh-btn span:nth-child(1){transform:translateY(7px) rotate(45deg)}
#zh.open .zh-btn span:nth-child(2){opacity:0}
#zh.open .zh-btn span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
@media(max-width:1100px){#zh .zh-links{gap:20px}#zh .zh-links a{font-size:.68rem;letter-spacing:.12em}}
@media(max-width:960px){
  #zh .zh-in{padding:0 5%}
  #zh .zh-logo img{height:40px}
  #zh .zh-btn{display:block}
  #zh .zh-cta{display:none}
  #zh .zh-links{position:fixed;top:68px;left:0;right:0;flex-direction:column;align-items:stretch;gap:0;background:#0D1B3E;border-bottom:1px solid rgba(201,163,91,.18);padding:8px 0 16px;display:none}
  #zh.open .zh-links{display:flex}
  #zh .zh-links a{display:block;padding:14px 6%;font-size:.8rem;color:#E4EAF2}
}
</style>`;

function headerHtml() {
  const links = LINKS.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('');
  return `${CSS}
<header id="zh">
  <div class="zh-in">
    <a href="/" class="zh-logo"><img src="/assets/logo-nav.png" alt="Zona INNmueble" width="85" height="52"></a>
    <ul class="zh-links">${links}<li><a href="/en/" hreflang="en" lang="en">EN</a></li></ul>
    <a class="zh-cta" href="https://wa.me/${WA}?text=${encodeURIComponent('Hola, quiero asesoría de Zona INNmueble.')}" target="_blank" rel="noopener">Asesor&iacute;a</a>
    <button class="zh-btn" type="button" aria-label="Men&uacute;" onclick="this.closest('#zh').classList.toggle('open')"><span></span><span></span><span></span></button>
  </div>
</header>`;
}

// Devuelve [inicio, fin] del primer bloque <tag ...>...</tag> después de `from`.
function blockRange(s, re, closeTag, from) {
  re.lastIndex = from;
  const m = re.exec(s);
  if (!m) return null;
  const end = s.indexOf(closeTag, m.index);
  if (end < 0) return null;
  return [m.index, end + closeTag.length];
}

function unify(html, file) {
  if (html.includes('id="zh"') || html.includes('logo-nav.png')) return null;
  const body = html.search(/<body[^>]*>/i);
  if (body < 0) return null;
  const head = headerHtml();
  const near = (r) => r && r[0] - body < 3000;
  const withStubs = (out) => {
    // Los scripts propios de cada página buscan #hamburger y #nav-links; se dejan ocultos para que no fallen.
    const stubs = ['hamburger', 'nav-links'].filter((id) => !out.includes(`id="${id}"`)).map((id) => `<i id="${id}" hidden></i>`).join('');
    return stubs ? out.replace('</header>', stubs + '</header>') : out;
  };

  // 1) Barra fija propia (<nav> ... </nav>) al inicio de la página.
  let r = blockRange(html, /<nav(\s[^>]*)?>/gi, '</nav>', body);
  if (near(r) && /class="nav-inner"/.test(html.slice(r[0], r[1]))) {
    // Si la barra anterior era fija, la página ya deja su espacio; si no, se agrega.
    const spacer = /(^|[}\s])nav\s*\{[^}]*position:\s*fixed/.test(html) ? '' : '<div style="height:68px"></div>';
    return withStubs(html.slice(0, r[0]) + head + spacer + html.slice(r[1]));
  }
  // 2) Encabezado de artículo (<header class="art-header">).
  r = blockRange(html, /<header class="art-header"[^>]*>/gi, '</header>', body);
  if (near(r)) return withStubs(html.slice(0, r[0]) + head + '<div style="height:68px"></div>' + html.slice(r[1]));
  // 3) Landing de anuncios: se mantiene mínima, solo cambia el texto por el logo.
  if (/class="lp-logo"/.test(html)) {
    return html.replace(/<a href="\/" class="lp-logo">[\s\S]*?<\/a>/, '<a href="/" class="lp-logo" style="line-height:0"><img src="/assets/logo-nav.png" alt="Zona INNmueble" width="72" height="44" style="height:44px;width:auto"></a>');
  }
  // 4) 404 y gracias: se agrega el encabezado al inicio.
  if (/class="n4-logo"/.test(html)) {
    return html.replace(/<a href="\/" class="n4-logo">[\s\S]*?<\/a>/, head);
  }
  if (/^(gracias|404)\.html$/.test(path.basename(file))) {
    const at = html.indexOf('>', body) + 1;
    return html.slice(0, at) + head + html.slice(at);
  }
  return null;
}

const SKIP = /^(admin|offline|google[0-9a-f]+|exclusivas-template|proximamente-template|index-nuevo)\.html$/;

function unifyHeaders(outDir) {
  const changed = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const rel = path.relative(outDir, p);
      if (fs.statSync(p).isDirectory()) {
        if (!/^(share|assets|en)$/.test(rel)) walk(p);
        continue;
      }
      if (!name.endsWith('.html') || SKIP.test(name)) continue;
      const html = fs.readFileSync(p, 'utf-8');
      const out = unify(html, p);
      if (out) { fs.writeFileSync(p, out, 'utf-8'); changed.push(rel); }
    }
  };
  walk(outDir);
  return changed;
}

module.exports = { unifyHeaders };
