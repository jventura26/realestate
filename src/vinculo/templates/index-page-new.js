const { layout } = require('./layout');
const { card } = require('./card');

function indexPageNew(props) {
  const featured = props.slice(0, 6);
  const zonas = [...new Set(props.map(p=>p.municipio).filter(Boolean))].slice(0, 6);
  
  const zonasHTML = zonas.map(z => {
    const slug = z.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    const count = props.filter(p=>p.municipio===z).length;
    return `<a href="/zonas/${slug}.html" style="display:inline-flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--border);border-radius:8px;padding:10px 18px;font-size:14px;font-weight:500;color:var(--gray-900);transition:all .2s" onmouseover="this.style.borderColor='var(--gold)';this.style.color='var(--gold)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--gray-900)'">\u{1F4CD} ${z} <span style="color:var(--text-muted);font-size:12px">(${count})</span></a>`;
  }).join('');

  const body = `
<!-- HERO -->
<section style="background:linear-gradient(135deg,#1a2a4e 0%,#2d4069 100%);padding:clamp(60px,10vw,100px) 6%;text-align:center;position:relative;overflow:hidden">
  <div style="position:absolute;top:0;right:0;width:300px;height:300px;background:rgba(255,165,0,0.1);border-radius:50%;transform:translate(50%,-50%)"></div>
  <div style="position:absolute;bottom:0;left:0;width:250px;height:250px;background:rgba(255,165,0,0.1);border-radius:50%;transform:translate(-50%,50%)"></div>
  <div style="position:relative;z-index:1;max-width:900px;margin:0 auto">
    <div style="display:inline-block;background:rgba(255,165,0,0.15);color:#ffa500;padding:8px 20px;border-radius:100px;font-size:13px;font-weight:600;margin-bottom:20px;border:1px solid rgba(255,165,0,0.3)">
      🏆 Platform Premium de Real Estate
    </div>
    <h1 style="font-size:clamp(36px,6vw,56px);font-weight:800;color:white;margin:20px 0;line-height:1.2;letter-spacing:-1px">
      Invierte en Guatemala
      <br><span style="background:linear-gradient(135deg,#ffa500,#ff8c00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">con Inteligencia</span>
    </h1>
    <p style="font-size:clamp(16px,3vw,20px);color:rgba(255,255,255,0.9);margin:20px 0 40px;line-height:1.6;max-width:700px;margin-left:auto;margin-right:auto">
      4 herramientas profesionales para invertir sin errores. Calcula, evalúa, analiza y compra las mejores propiedades premium de Guatemala.
    </p>
  </div>
</section>

<!-- HERRAMIENTAS -->
<section style="padding:clamp(60px,8vw,80px) 6%;background:#f8f9fb">
  <div style="max-width:1300px;margin:0 auto">
    <div style="text-align:center;margin-bottom:60px">
      <h2 style="font-size:clamp(28px,5vw,42px);font-weight:700;color:#1a2a4e;margin:0 0 16px">4 Herramientas Premium</h2>
      <p style="font-size:16px;color:#666;margin:0">Todo lo que necesitas para decisiones inmobiliarias profesionales</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:32px">
      <!-- CALCULADORA -->
      <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);transition:all 0.3s" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 48px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 32px rgba(0,0,0,0.08)'">
        <div style="background:linear-gradient(135deg,#ffa500,#ff8c00);padding:40px 20px;text-align:center;color:white">
          <div style="font-size:48px;margin-bottom:12px">🧮</div>
          <h3 style="margin:0;font-size:22px;font-weight:700">Calculadora Hipotecaria</h3>
        </div>
        <div style="padding:32px 24px">
          <p style="color:#666;margin:0 0 24px;line-height:1.6">Simula tu hipoteca con tasas reales 2026 de los bancos principales.</p>
          <a href="/herramientas/calculadora-hipotecaria.html" style="display:block;background:linear-gradient(135deg,#ffa500,#ff8c00);color:white;padding:14px;border-radius:8px;text-align:center;text-decoration:none;font-weight:700;transition:opacity 0.2s" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Acceder →</a>
        </div>
      </div>

      <!-- VALUADOR -->
      <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);transition:all 0.3s" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 48px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 32px rgba(0,0,0,0.08)'">
        <div style="background:linear-gradient(135deg,#1a2a4e,#2d4069);padding:40px 20px;text-align:center;color:white">
          <div style="font-size:48px;margin-bottom:12px">🏠</div>
          <h3 style="margin:0;font-size:22px;font-weight:700">Valuador Profesional</h3>
        </div>
        <div style="padding:32px 24px">
          <p style="color:#666;margin:0 0 24px;line-height:1.6">Estima el valor de tu propiedad en 20 zonas premium con datos 2026.</p>
          <a href="/herramientas/valuador.html" style="display:block;background:linear-gradient(135deg,#1a2a4e,#2d4069);color:white;padding:14px;border-radius:8px;text-align:center;text-decoration:none;font-weight:700;transition:opacity 0.2s" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Acceder →</a>
        </div>
      </div>

      <!-- GUÍA -->
      <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);transition:all 0.3s" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 48px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 32px rgba(0,0,0,0.08)'">
        <div style="background:linear-gradient(135deg,#27ae60,#229954);padding:40px 20px;text-align:center;color:white">
          <div style="font-size:48px;margin-bottom:12px">📚</div>
          <h3 style="margin:0;font-size:22px;font-weight:700">Guía de Compra Premium</h3>
        </div>
        <div style="padding:32px 24px">
          <p style="color:#666;margin:0 0 24px;line-height:1.6">Cómo comprar propiedades sin cometer errores costosos en Guatemala.</p>
          <a href="/herramientas/guia-compra.html" style="display:block;background:linear-gradient(135deg,#27ae60,#229954);color:white;padding:14px;border-radius:8px;text-align:center;text-decoration:none;font-weight:700;transition:opacity 0.2s" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Descargar →</a>
        </div>
      </div>

      <!-- DASHBOARD INVERSIONISTAS -->
      <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);transition:all 0.3s" onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 16px 48px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 32px rgba(0,0,0,0.08)'">
        <div style="background:linear-gradient(135deg,#9b59b6,#8e44ad);padding:40px 20px;text-align:center;color:white">
          <div style="font-size:48px;margin-bottom:12px">📊</div>
          <h3 style="margin:0;font-size:22px;font-weight:700">Dashboard Inversionistas</h3>
        </div>
        <div style="padding:32px 24px">
          <p style="color:#666;margin:0 0 24px;line-height:1.6">Análisis del mercado con ROI por zona y estrategias de inversión.</p>
          <a href="/herramientas/dashboard-inversionistas.html" style="display:block;background:linear-gradient(135deg,#9b59b6,#8e44ad);color:white;padding:14px;border-radius:8px;text-align:center;text-decoration:none;font-weight:700;transition:opacity 0.2s" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Inversionistas</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PROPIEDADES DESTACADAS -->
<section style="padding:60px 6%;background:white">
  <div style="max-width:1200px;margin:0 auto">
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:clamp(28px,5vw,42px);font-weight:700;color:#1a2a4e;margin:0 0 12px">Propiedades Destacadas</h2>
      <p style="font-size:16px;color:#666;margin:0">Las mejores opciones en zonas premium</p>
    </div>
    <div class="prop-grid">${featured.map(p => card(p)).join('')}</div>
    <div style="text-align:center;margin-top:48px">
      <a href="/propiedades.html" style="background:linear-gradient(135deg,#1a2a4e,#2d4069);color:white;padding:16px 48px;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;transition:opacity 0.2s;display:inline-block" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Ver todas →</a>
    </div>
  </div>
</section>

<!-- ZONAS -->
<section style="padding:60px 6%;background:#f8f9fb;border-top:1px solid #e5e7eb">
  <div style="max-width:1200px;margin:0 auto">
    <h2 style="font-size:24px;font-weight:700;color:#1a2a4e;margin-bottom:32px">Explorar por Zona Premium</h2>
    <div style="display:flex;flex-wrap:wrap;gap:12px">${zonasHTML}</div>
  </div>
</section>

<!-- CTA FINAL -->
<section style="background:linear-gradient(135deg,#1a2a4e 0%,#2d4069 100%);padding:80px 6%;text-align:center;color:white">
  <div style="max-width:700px;margin:0 auto">
    <h2 style="font-size:36px;font-weight:700;margin-bottom:16px">Listo para Invertir?</h2>
    <p style="font-size:18px;opacity:0.95;margin-bottom:32px;line-height:1.6">Comienza con nuestras herramientas gratuitas y toma decisiones inteligentes.</p>
    <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">
      <a href="/herramientas/valuador.html" style="background:white;color:#1a2a4e;padding:16px 32px;border-radius:8px;font-weight:700;text-decoration:none;transition:opacity 0.2s" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Valuador →</a>
      <a href="/herramientas/calculadora-hipotecaria.html" style="background:#ffa500;color:white;padding:16px 32px;border-radius:8px;font-weight:700;text-decoration:none;transition:opacity 0.2s" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Calculadora →</a>
      <a href="/herramientas/guia-compra.html" style="background:rgba(255,255,255,0.2);color:white;padding:16px 32px;border-radius:8px;font-weight:700;text-decoration:none;border:2px solid white;transition:all 0.2s" onmouseover="this.style.background='white';this.style.color='#1a2a4e'" onmouseout="this.style.background='rgba(255,255,255,0.2)';this.style.color='white'">Descargar Guía →</a>
    </div>
  </div>
</section>
`;

  return layout({ 
    title: null, 
    desc: `Plataforma premium de real estate en Guatemala. Calculadora hipotecaria, valuador profesional, guía de compra y análisis de inversionistas. ${props.length} propiedades verificadas.`, 
    canonical: '/', 
    body 
  });
}

module.exports = { indexPageNew };
