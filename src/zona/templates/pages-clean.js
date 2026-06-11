const { layout, WA } = require('./layout');
const { escapeHtml } = require('../../shared/utils');

const DOMAIN = 'https://zona-innmueble.com';

function indexPage(props) {
  const body = `
<nav style="position:sticky;top:0;z-index:200;background:rgba(13,27,62,.96);backdrop-filter:blur(16px);border-bottom:1px solid rgba(245,130,13,.25);width:100%;margin:0;padding:0">
  <div style="display:flex;align-items:center;justify-content:space-between;height:62px;padding:0 6%;width:100%;margin:0">
    <a href="/" style="display:flex;align-items:center;text-decoration:none"><img src="/assets/images/logo.png" alt="Zona INNmueble" style="height:50px;width:auto;object-fit:contain"></a>
    <ul style="display:flex;gap:26px;list-style:none;margin:0;padding:0">
      <li><a href="/propiedades.html" style="font-size:.66rem;font-weight:500;letter-spacing:.13em;text-transform:uppercase;color:#8A9BB0;transition:color .3s;text-decoration:none">Propiedades</a></li>
    </ul>
    <button onclick="document.querySelector('#search').scrollIntoView({behavior:'smooth'})" style="border:1px solid rgba(245,130,13,.25);color:#F5820D;padding:9px 20px;font-size:.63rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;transition:all .3s;cursor:pointer;background:transparent;text-decoration:none">Buscar</button>
  </div>
</nav>

<section style="min-height:80vh;position:relative;display:flex;align-items:center;overflow:hidden;padding:0 6%;width:100%;background:#0D1B3E;margin:0">
  <div style="position:absolute;inset:0;background:linear-gradient(105deg,rgba(13,27,62,.97) 0%,rgba(13,27,62,.68) 55%,rgba(20,34,64,.9) 100%),url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=70') center/cover no-repeat;z-index:0"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,62,.65) 0%,transparent 40%);z-index:1"></div>
  <div style="position:relative;z-index:2;max-width:760px;width:100%">
    <p style="display:flex;align-items:center;gap:12px;margin-bottom:14px;font-size:.59rem;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:#F5820D;margin-top:0">
      <span style="width:26px;height:1px;background:#F5820D"></span>Guatemala · Patrimonio
    </p>
    <h1 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2.5rem,5vw,4.5rem);font-weight:300;line-height:1.1;margin-bottom:20px;margin-top:0;color:#fff">
      En Guatemala, la diferencia entre una casa y una <em style="color:#F5820D;font-style:italic">residencia exclusiva</em> está en cada detalle.
    </h1>
    <p style="font-size:.85rem;font-weight:300;color:#8A9BB0;line-height:1.9;max-width:480px;margin-bottom:40px;margin-top:0">
      31 propiedades verificadas, oportunidades de inversión y un equipo que entiende que cada propiedad cuenta una historia. Asesoría privada para quienes saben qué buscan.
    </p>
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin:0">
      <a href="/propiedades.html" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 30px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;transition:all .3s;cursor:pointer;border:1px solid #F5820D;background:#F5820D;color:#0D1B3E;text-decoration:none">Ver Propiedades</a>
      <a href="https://wa.me/50245542088?text=Hola, quiero asesoría de Zona INNmueble" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 30px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;transition:all .3s;cursor:pointer;border:1px solid rgba(255,255,255,.22);background:transparent;color:#fff;text-decoration:none">WhatsApp</a>
    </div>
  </div>
</section>

<section id="search" style="background:linear-gradient(135deg,rgba(13,27,62,.98) 0%,rgba(20,34,64,.92) 100%);padding:60px 6%;border-top:1px solid rgba(245,130,13,.25);position:relative;z-index:10;width:100%;overflow-x:hidden;margin:0">
  <div style="max-width:900px;margin:0 auto;position:relative;z-index:1;width:100%;padding:0">
    <p style="display:flex;align-items:center;gap:12px;margin-bottom:14px;font-size:.59rem;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:#F5820D;margin-top:0">
      <span style="width:26px;height:1px;background:#F5820D"></span>Búsqueda
    </p>
    <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:400;margin-bottom:30px;color:#fff;margin-top:0">Encuentra tu próxima <em style="color:#F5820D;font-style:italic">propiedad ideal</em></h2>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px">
      <div style="display:flex;flex-direction:column">
        <label style="font-size:.65rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#F5820D;margin-bottom:8px">Tipo</label>
        <select style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);color:#fff;padding:11px 12px;font-family:'Montserrat',sans-serif;font-size:.75rem;border-radius:3px;outline:none;transition:border-color .2s;cursor:pointer">
          <option value="">Todas</option>
          <option value="Casa">Casa</option>
          <option value="Apartamento">Apartamento</option>
          <option value="Fincas">Fincas</option>
        </select>
      </div>
      <div style="display:flex;flex-direction:column">
        <label style="font-size:.65rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#F5820D;margin-bottom:8px">Zona</label>
        <input type="text" placeholder="ej: Zona 10, Cayalá" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);color:#fff;padding:11px 12px;font-family:'Montserrat',sans-serif;font-size:.75rem;border-radius:3px;outline:none;transition:border-color .2s;cursor:pointer">
      </div>
    </div>
    <div style="display:flex;gap:10px">
      <button style="background:#F5820D;color:#0D1B3E;padding:11px 28px;font-size:.68rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;border:1px solid #F5820D;border-radius:3px;cursor:pointer;transition:all .3s">Buscar</button>
      <button style="background:transparent;color:#8A9BB0;border:1px solid rgba(255,255,255,.08);padding:11px 20px;font-size:.68rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;border-radius:3px;cursor:pointer;transition:all .3s">Limpiar</button>
    </div>
  </div>
</section>

<section style="padding:88px 6%;width:100%;overflow-x:hidden;margin:0;max-width:100%">
  <p style="display:flex;align-items:center;gap:12px;margin-bottom:14px;font-size:.59rem;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:#F5820D;margin-top:0">
    <span style="width:26px;height:1px;background:#F5820D"></span>Destacado
  </p>
  <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(1.9rem,3.8vw,3.1rem);font-weight:300;line-height:1.12;margin-bottom:12px;margin-top:0">Cada detalle <em style="font-style:italic;color:#F5820D">cuenta una historia</em></h2>
  <p style="font-size:.8rem;color:#8A9BB0;max-width:400px;margin-top:12px;line-height:1.7;margin-bottom:44px">31 propiedades cuidadosamente seleccionadas en las zonas más exclusivas de Guatemala.</p>
  
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:3px">
    ${props.slice(0, 6).map((p,i) => `
    <a href="/propiedades/${p.slug}.html" style="position:relative;overflow:hidden;aspect-ratio:4/5;display:block;cursor:pointer;text-decoration:none">
      <img src="${escapeHtml(p.mainImageThumb || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70')}" alt="${escapeHtml(p.title)}" style="width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.22,1,.36,1);filter:brightness(.72) saturate(.85)" loading="lazy">
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(13,27,62,.97) 0%,rgba(13,27,62,.25) 50%,transparent 100%)"></div>
      <div style="position:absolute;top:14px;left:14px;background:#F5820D;color:#0D1B3E;font-size:.54rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;padding:4px 9px;z-index:10">${p.cinta || 'PROPIEDAD'}</div>
      <div style="position:absolute;bottom:22px;left:20px;right:20px;z-index:5">
        <div style="font-size:.57rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#F5820D;margin-bottom:6px">${escapeHtml(p.tipo)}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:400;line-height:1.2;margin-bottom:7px;color:#fff">${escapeHtml(p.title)}</div>
        <div style="display:flex;gap:10px;font-size:.62rem;color:#8A9BB0;margin-bottom:8px">${p.habitaciones ? `<span>${p.habitaciones} hab</span>` : ''} ${p.banos ? `<span>${p.banos} baños</span>` : ''}</div>
        <div style="font-size:.7rem;font-weight:600;color:#F5820D;letter-spacing:.1em">${escapeHtml(p.priceFormatted)}</div>
      </div>
    </a>
    `).join('')}
  </div>
</section>

<section style="padding:88px 6%;width:100%;overflow-x:hidden;margin:0;max-width:100%;text-align:center">
  <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(1.9rem,3.8vw,3.1rem);font-weight:300;line-height:1.12;margin-bottom:12px;margin-top:0">¿Listo para dar el siguiente paso?</h2>
  <p style="font-size:.81rem;color:#8A9BB0;line-height:1.9;margin-bottom:40px;max-width:500px;margin-left:auto;margin-right:auto;margin-top:0">Nuestro equipo está disponible para asesorarte. Sin compromiso.</p>
  <a href="https://wa.me/50245542088?text=Hola, tengo una consulta sobre propiedades" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 30px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;transition:all .3s;cursor:pointer;border:1px solid #F5820D;background:#F5820D;color:#0D1B3E;text-decoration:none">Contactar por WhatsApp</a>
</section>

<section style="background:#1A3060;padding:72px 6%;text-align:center;border-top:1px solid rgba(245,130,13,.25);width:100%;overflow-x:hidden;margin:0">
  <p style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:14px;font-size:.59rem;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:#F5820D;margin-top:0">
    <span style="width:26px;height:1px;background:#F5820D"></span>Zona INNmueble en Números
  </p>
  <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(1.9rem,3.8vw,3.1rem);font-weight:300;line-height:1.12;margin-bottom:12px;margin-top:0">Resultados que <em style="font-style:italic;color:#F5820D">hablan por sí solos</em></h2>
  
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:40px;max-width:900px;margin:0 auto;text-align:center">
    <div>
      <div style="font-size:2.8rem;font-weight:700;color:#F5820D;margin-bottom:8px">31+</div>
      <div style="font-size:.9rem;color:#8A9BB0;letter-spacing:.15em;text-transform:uppercase">Propiedades Verificadas</div>
    </div>
    <div>
      <div style="font-size:2.8rem;font-weight:700;color:#F5820D;margin-bottom:8px">500+</div>
      <div style="font-size:.9rem;color:#8A9BB0;letter-spacing:.15em;text-transform:uppercase">Familias Satisfechas</div>
    </div>
    <div>
      <div style="font-size:2.8rem;font-weight:700;color:#F5820D;margin-bottom:8px">100%</div>
      <div style="font-size:.9rem;color:#8A9BB0;letter-spacing:.15em;text-transform:uppercase">Transparencia</div>
    </div>
  </div>
</section>

<footer style="background:#050A14;padding:56px 6% 26px;border-top:1px solid rgba(245,130,13,.25);width:100%;margin:0">
  <p style="margin:0;padding:0;color:#fff;font-size:.75rem">© 2026 Zona INNmueble. Todos los derechos reservados.</p>
</footer>

<a href="https://wa.me/50245542088" target="_blank" rel="noopener" style="position:fixed;bottom:26px;right:26px;z-index:300;width:54px;height:54px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,.4);transition:all .3s;cursor:pointer;text-decoration:none;font-size:24px;animation:wa-pulse 3s ease-in-out infinite">
  💬
</a>

<style>
@keyframes wa-pulse{0%,100%{box-shadow:0 4px 20px rgba(37,211,102,.4)}50%{box-shadow:0 4px 32px rgba(37,211,102,.6),0 0 0 10px rgba(37,211,102,.07)}}

@media(max-width:1024px){
  div[style*="grid-template-columns:repeat(3,1fr)"]{grid-template-columns:repeat(2,1fr)!important}
}

@media(max-width:768px){
  nav {padding:0!important}
  nav > div {padding:0 3%!important;height:56px!important}
  nav img {height:40px!important}
  
  section {padding:48px 5%!important}
  
  h1 {font-size:clamp(1.8rem,4vw,2.2rem)!important;margin-bottom:14px!important;line-height:1.15!important}
  
  div[style*="grid-template-columns:repeat(3,1fr)"]{grid-template-columns:1fr!important}
  div[style*="grid-template-columns:repeat(2,1fr)"]{grid-template-columns:1fr!important}
}

@media(max-width:480px){
  nav {padding:0!important}
  nav > div {padding:0 2%!important;height:52px!important}
  nav img {height:34px!important}
  
  section {padding:32px 4%!important}
  
  h1 {font-size:clamp(1.4rem,3.5vw,1.8rem)!important;margin-bottom:10px!important;line-height:1.15!important}
  
  div[style*="grid-template-columns:repeat(3,1fr)"]{grid-template-columns:1fr!important;gap:2px!important}
  div[style*="display:grid;grid-template-columns:repeat(2,1fr);"]{grid-template-columns:1fr!important}
  
  a[style*="display:inline-flex"]{width:100%!important}
}
</style>
`;

  return layout({ 
    title: null, 
    desc: `Propiedades premium en Guatemala. ${props.length} propiedades disponibles. Asesoría personalizada.`, 
    canonical: '/', 
    body 
  });
}

module.exports = { indexPage };
