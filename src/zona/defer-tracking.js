// Post-proceso de todo el HTML de dist/zona: el Pixel de Meta, Google Tag Manager y gtag
// dejan de bloquear la carga. Se descargan con la primera interaccion (scroll, toque, clic,
// tecla) o a los 3.5 s de cargar la pagina. Los eventos anteriores quedan en cola (fbq y
// dataLayer son colas), asi que la medicion se mantiene.
const fs = require('fs');
const path = require('path');

const BOOT = '<script>(function(w){var q=[],done=false;w.__zDefer=function(f){done?f():q.push(f)};' +
  'function go(){if(done)return;done=true;q.forEach(function(f){try{f()}catch(e){}});q=[];}' +
  "['scroll','pointerdown','keydown','touchstart'].forEach(function(e){w.addEventListener(e,go,{passive:true,once:true})});" +
  "w.addEventListener('load',function(){setTimeout(go,3500)});})(window);</script>";

function transform(html) {
  if (html.includes('__zDefer=function')) return html;
  let out = html;
  let touched = false;
  // Pixel de Meta (snippet estandar minificado)
  out = out.replace(/t\.src=v;s=b\.getElementsByTagName\(e\)\[0\];\s*s\.parentNode\.insertBefore\(t,s\)/g, () => {
    touched = true;
    return 't.src=v;__zDefer(function(){s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})';
  });
  // Google Tag Manager (snippet estandar)
  out = out.replace(/j\.src=\s*'https:\/\/www\.googletagmanager\.com\/gtm\.js\?id='\+i\+dl;\s*f\.parentNode\.insertBefore\(j,f\);/g, () => {
    touched = true;
    return "j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;__zDefer(function(){f.parentNode.insertBefore(j,f)});";
  });
  // gtag.js
  out = out.replace(/<script async src="(https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[A-Z0-9]+)"><\/script>/g, (m, src) => {
    touched = true;
    if (/G-XXXXXXXXXX/.test(src)) return '';
    return `<script>__zDefer(function(){var j=document.createElement('script');j.async=true;j.src='${src}';document.head.appendChild(j)})</script>`;
  });
  if (!touched) return html;
  return out.replace(/<head([^>]*)>/i, (m) => m + '\n' + BOOT);
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (name.endsWith('.html') && name !== 'admin.html') files.push(p);
  }
  return files;
}

function deferAll(outDir) {
  let n = 0;
  for (const f of walk(outDir)) {
    const html = fs.readFileSync(f, 'utf-8');
    const next = transform(html);
    if (next !== html) { fs.writeFileSync(f, next, 'utf-8'); n++; }
  }
  return n;
}

module.exports = { transform, deferAll };
