diff --git a/src/zona/about.html b/src/zona/about.html
index 2284a79..e7af18a 100644
--- a/src/zona/about.html
+++ b/src/zona/about.html
@@ -173,6 +173,39 @@ footer{background:var(--ink2);padding:44px 6%;border-top:1px solid var(--gl);mar
   </div>
 </section>
 
+
+<section style="padding:60px 6%;background:var(--ink)">
+  <div style="max-width:900px;margin:0 auto">
+    <div style="text-align:center;margin-bottom:48px">
+      <div style="font-size:.65rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--or);margin-bottom:12px">Nuestro Equipo</div>
+      <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300">Las personas detrás de <em style="color:var(--or);font-style:italic">cada cierre</em></h2>
+    </div>
+    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:32px">
+
+      <div style="text-align:center">
+        <div style="width:140px;height:140px;border-radius:50%;margin:0 auto 20px;overflow:hidden;border:2px solid var(--or);background:var(--ink2);display:flex;align-items:center;justify-content:center">
+          <!-- Reemplazar con foto real: <img src="URL" alt="Nombre" style="width:100%;height:100%;object-fit:cover"> -->
+          <span style="font-family:'Cormorant Garamond',serif;font-size:2.5rem;color:var(--or)">JV</span>
+        </div>
+        <div style="font-size:.95rem;font-weight:600;color:var(--wh);margin-bottom:4px">Juan Ventura</div>
+        <div style="font-size:.72rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--or);margin-bottom:10px">Director</div>
+        <p style="font-size:.78rem;color:var(--sv);line-height:1.7;max-width:260px;margin:0 auto">M&aacute;s de 10 a&ntilde;os conectando familias e inversionistas con las mejores oportunidades inmobiliarias de Guatemala.</p>
+      </div>
+
+      <div style="text-align:center">
+        <div style="width:140px;height:140px;border-radius:50%;margin:0 auto 20px;overflow:hidden;border:2px solid rgba(255,255,255,.1);background:var(--ink2);display:flex;align-items:center;justify-content:center">
+          <span style="font-family:'Cormorant Garamond',serif;font-size:2.5rem;color:var(--sv)">+</span>
+        </div>
+        <div style="font-size:.95rem;font-weight:600;color:var(--wh);margin-bottom:4px">Tu asesor dedicado</div>
+        <div style="font-size:.72rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--or);margin-bottom:10px">Asesor Inmobiliario</div>
+        <p style="font-size:.78rem;color:var(--sv);line-height:1.7;max-width:260px;margin:0 auto">Cada cliente recibe un asesor dedicado que conoce el mercado, entiende sus necesidades y acompa&ntilde;a cada paso del proceso.</p>
+      </div>
+
+    </div>
+    <p style="text-align:center;font-size:.72rem;color:var(--mt);margin-top:32px;font-style:italic">Conf&iacute;a en quienes conocen cada propiedad personalmente.</p>
+  </div>
+</section>
+
 <section style="padding:44px 6%;background:var(--ink2);border-top:1px solid var(--gl);text-align:center">
   <div style="max-width:700px;margin:0 auto">
     <p style="font-size:1.1rem;color:var(--wh);margin-bottom:12px;font-family:'Cormorant Garamond',serif;font-weight:300">¿Listo para tu siguiente oportunidad de patrimonio?</p>
diff --git a/src/zona/build.js b/src/zona/build.js
index 5d92d19..bacf389 100644
--- a/src/zona/build.js
+++ b/src/zona/build.js
@@ -87,6 +87,25 @@ const OUT    = path.resolve(__dirname, '../../dist/zona');
 const PROPS  = path.join(OUT, 'propiedades');
 
 function write(p, c) { fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,c,'utf-8'); }
+// ── TRACKING: inyectar Pixel + GA4 en páginas estáticas ──────────────
+const TRACKING_SNIPPET = `
+<!-- Google Analytics 4 -->
+<script async src="https://www.googletagmanager.com/gtag/js?id=G-5KVQZYZ7B3"></script>
+<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-5KVQZYZ7B3');</script>
+<!-- Meta Pixel -->
+<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1668269500330907');fbq('track','PageView');</script>
+<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1668269500330907&ev=PageView&noscript=1" alt=""></noscript>
+`;
+
+function copyWithTracking(src, dst) {
+  let html = fs.readFileSync(src, 'utf-8');
+  if (!html.includes('fbq(')) {
+    html = html.replace('</head>', TRACKING_SNIPPET + '</head>');
+  }
+  fs.mkdirSync(path.dirname(dst), { recursive: true });
+  fs.writeFileSync(dst, html, 'utf-8');
+}
+
 function copyAssets() {
   const dstDir = path.join(OUT, 'assets');
   fs.mkdirSync(dstDir, { recursive: true });
@@ -156,7 +175,7 @@ if(fs.existsSync(dynGridSrc)) {
 // 404
 const src404 = path.join(__dirname, '404.html');
 if(fs.existsSync(src404)) {
-  fs.copyFileSync(src404, path.join(OUT, '404.html'));
+  copyWithTracking(src404, path.join(OUT, '404.html'));
   console.log('   ✔  404.html');
 }
 
@@ -185,22 +204,22 @@ if(fs.existsSync(adminSrc)) {
   console.log('   ✔  admin.html');
 }
 if(fs.existsSync(faqSrc)) {
-  fs.copyFileSync(faqSrc, path.join(OUT, 'faq.html'));
+  copyWithTracking(faqSrc, path.join(OUT, 'faq.html'));
   console.log('   ✔  faq.html');
 }
 if(fs.existsSync(aboutSrc)) {
-  fs.copyFileSync(aboutSrc, path.join(OUT, 'about.html'));
+  copyWithTracking(aboutSrc, path.join(OUT, 'about.html'));
   console.log('   ✔  about.html');
 }
 if(fs.existsSync(blogSrc)) {
-  fs.copyFileSync(blogSrc, path.join(OUT, 'blog.html'));
+  copyWithTracking(blogSrc, path.join(OUT, 'blog.html'));
   console.log('   ✔  blog.html');
 }
 
 // ── NUEVO: Política de Privacidad ────────────────────────────────────
 const privacidadSrc = path.join(__dirname, 'privacidad.html');
 if(fs.existsSync(privacidadSrc)) {
-  fs.copyFileSync(privacidadSrc, path.join(OUT, 'privacidad.html'));
+  copyWithTracking(privacidadSrc, path.join(OUT, 'privacidad.html'));
   console.log('   ✔  privacidad.html');
 } else {
   console.warn('   ⚠️  privacidad.html no encontrado en src/zona/ — agrégalo para Meta Ads compliance');
@@ -210,7 +229,7 @@ if(fs.existsSync(privacidadSrc)) {
 blogArticles.forEach(filename => {
   const srcFile = path.join(__dirname, filename);
   if (fs.existsSync(srcFile)) {
-    fs.copyFileSync(srcFile, path.join(OUT, filename));
+    copyWithTracking(srcFile, path.join(OUT, filename));
     console.log('   ✔  ' + filename);
   } else {
     console.warn('   ⚠️  Artículo listado pero NO encontrado: ' + filename);
diff --git a/src/zona/templates/pages.js b/src/zona/templates/pages.js
index 7d4c548..e185572 100644
--- a/src/zona/templates/pages.js
+++ b/src/zona/templates/pages.js
@@ -441,10 +441,33 @@ function indexPage(props) {
     <div class="ey" style="justify-content:center">Cont&aacute;ctanos</div>
     <h2 class="st">Tu pr&oacute;xima propiedad empieza <em>con una conversaci&oacute;n.</em></h2>
     <p style="font-size:.81rem;color:var(--sv);line-height:1.9;margin-bottom:40px;font-weight:300">Nuestro equipo est&aacute; disponible para asesorarte de forma privada. Sin compromiso.</p>
-    <div style="display:flex;flex-direction:column;gap:10px;max-width:340px;margin:0 auto">
-      <a href="${waLink('Hola, me interesa una asesorÃ­a de Zona INNmueble.')}" target="_blank" rel="noopener" class="wa-btn" style="justify-content:center">${WA_SVG} Escribir por WhatsApp</a>
-      <a href="/propiedades.html" class="btn-ol" style="justify-content:center">Ver propiedades disponibles</a>
+    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;max-width:700px;margin:0 auto;text-align:left">
+      <form onsubmit="var f=this,wa='${WA}',t=encodeURIComponent('Nuevo lead desde Home\nNombre: '+f.nombre.value+'\nTeléfono: '+f.telefono.value+'\nInterés: '+f.interes.value+'\nURL: https://zona-innmueble.com');window.open('https://wa.me/'+wa+'?text='+t,'_blank');f.nextElementSibling.style.display='block';if(typeof fbq==='function')fbq('track','Lead');f.style.display='none';return false;" style="display:flex;flex-direction:column;gap:12px">
+        <div style="font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--or);margin-bottom:4px">Solicitar asesoría</div>
+        <input type="text" name="nombre" placeholder="Nombre completo" required style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--wh);padding:12px 16px;font-family:Montserrat,sans-serif;font-size:.82rem;outline:none;transition:border .3s" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='rgba(255,255,255,.1)'">
+        <input type="tel" name="telefono" placeholder="Teléfono / WhatsApp" required style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--wh);padding:12px 16px;font-family:Montserrat,sans-serif;font-size:.82rem;outline:none;transition:border .3s" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='rgba(255,255,255,.1)'">
+        <select name="interes" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--sv);padding:12px 16px;font-family:Montserrat,sans-serif;font-size:.82rem;outline:none;transition:border .3s;-webkit-appearance:none" onfocus="this.style.borderColor='var(--or)'" onblur="this.style.borderColor='rgba(255,255,255,.1)'">
+          <option value="Residencia">Busco residencia</option>
+          <option value="Apartamento">Busco apartamento</option>
+          <option value="Finca">Busco finca / terreno</option>
+          <option value="Inversión">Inversión inmobiliaria</option>
+          <option value="Otro">Otro</option>
+        </select>
+        <button type="submit" style="background:var(--or);color:var(--ink);padding:13px;font-family:Montserrat,sans-serif;font-size:.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;border:none;cursor:pointer;transition:background .3s">Solicitar asesoría privada</button>
+      </form>
+      <div style="display:none;text-align:center;padding:40px 20px">
+        <div style="font-size:1.4rem;color:#4ade80;margin-bottom:8px">✓</div>
+        <div style="font-size:.88rem;color:var(--wh);font-weight:500;margin-bottom:6px">Recibido</div>
+        <div style="font-size:.78rem;color:var(--sv)">Te contactamos en menos de 2 horas.</div>
+      </div>
+      <div style="display:flex;flex-direction:column;justify-content:center;gap:16px;border-left:1px solid rgba(255,255,255,.08);padding-left:40px">
+        <div style="font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--or);margin-bottom:4px">O escríbenos directo</div>
+        <a href="${waLink('Hola, me interesa una asesorÃ­a de Zona INNmueble.')}" target="_blank" rel="noopener" class="wa-btn" style="justify-content:center">${WA_SVG} Escribir por WhatsApp</a>
+        <a href="/propiedades.html" class="btn-ol" style="justify-content:center">Ver propiedades disponibles</a>
+        <p style="font-size:.72rem;color:var(--sv);line-height:1.6;margin-top:8px">Respuesta promedio: menos de 2 horas.<br>Sin compromiso. Tu información es privada.</p>
+      </div>
     </div>
+    <style>@media(max-width:680px){[style*="grid-template-columns:1fr 1fr"]{grid-template-columns:1fr!important}[style*="border-left:1px"]{border-left:none!important;padding-left:0!important;border-top:1px solid rgba(255,255,255,.08);padding-top:24px!important}}</style>
     
   </div>
 </section>`;  return layout({ title: null, desc: `Casas, fincas y apartamentos en venta en Guatemala. ${props.length} propiedades disponibles en Fraijanes, Zona 10, Zona 14, Mixco y Carretera a El Salvador. AsesorÃ­a personalizada.`, canonical: '/', body });
@@ -1003,7 +1026,7 @@ ${(!esExclusiva&&!cfg.fotos&&gal.length>1) ? '<div class="dv3-swiper" id="dv3sw"
       </a>
       <div class="dv3-divider"></div>
       <div class="dv3-form-title">O d&eacute;janos tus datos</div>
-      <form onsubmit="var f=this,wa='${waNum}',t=encodeURIComponent('Nuevo lead - ${escapeHtml(prop.title)}\nNombre: '+f.nombre.value+'\nTel\u00e9fono: '+f.telefono.value+'\nMensaje: '+(f.mensaje.value||'Sin mensaje')+'\nURL: ${propUrl}');window.open('https://wa.me/'+wa+'?text='+t,'_blank');f.nextElementSibling.style.display='block';f.reset();return false;">
+      <form onsubmit="var f=this,wa='${waNum}',t=encodeURIComponent('Nuevo lead - ${escapeHtml(prop.title)}\nNombre: '+f.nombre.value+'\nTel\u00e9fono: '+f.telefono.value+'\nMensaje: '+(f.mensaje.value||'Sin mensaje')+'\nURL: ${propUrl}');window.open('https://wa.me/'+wa+'?text='+t,'_blank');f.nextElementSibling.style.display='block';if(typeof fbq==='function')fbq('track','Lead');f.reset();return false;">
         <input class="dv3-input" type="text" name="nombre" placeholder="Tu nombre completo" required>
         <input class="dv3-input" type="tel" name="telefono" placeholder="Tu tel&eacute;fono / WhatsApp" required>
         <textarea class="dv3-input" name="mensaje" placeholder="&iquest;Qu&eacute; deseas saber?" rows="2" style="resize:none"></textarea>
