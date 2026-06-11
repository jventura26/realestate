const { layout, WA } = require('./layout');
const { escapeHtml } = require('../../shared/utils');

function indexPage(props) {
  const body = `
<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-content">
    <p class="label">Guatemala · Patrimonio Inmobiliario</p>
    <h1>En Guatemala, la diferencia entre una casa y una <em>residencia exclusiva</em> está en cada detalle.</h1>
    <p class="description">31 propiedades verificadas, oportunidades de inversión y un equipo que entiende que cada propiedad cuenta una historia. Asesoría privada para quienes saben qué buscan.</p>
    <div class="button-group">
      <a href="/propiedades.html" class="btn btn-primary">Ver Propiedades</a>
      <a href="https://wa.me/50245542088?text=Hola, quiero asesoría de Zona INNmueble" target="_blank" rel="noopener" class="btn btn-secondary">WhatsApp</a>
    </div>
  </div>
</section>

<!-- FEATURED -->
<section class="featured">
  <div class="container">
    <p class="label">Destacado</p>
    <h2>Cada detalle <em>cuenta una historia</em></h2>
    <p class="subtitle">31 propiedades cuidadosamente seleccionadas en las zonas más exclusivas de Guatemala.</p>
    
    <div class="grid grid-3">
      ${props.slice(0, 6).map(p => `
      <a href="/propiedades/${p.slug}.html" class="card">
        <img src="${escapeHtml(p.mainImageThumb || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70')}" alt="${escapeHtml(p.title)}" loading="lazy">
        <div class="card-overlay"></div>
        <span class="badge">${p.cinta || 'PROPIEDAD'}</span>
        <div class="card-info">
          <div class="card-type">${escapeHtml(p.tipo)}</div>
          <h3>${escapeHtml(p.title)}</h3>
          <div class="card-meta">${p.habitaciones ? `<span>${p.habitaciones} hab</span>` : ''} ${p.banos ? `<span>${p.banos} baños</span>` : ''}</div>
          <div class="card-price">${escapeHtml(p.priceFormatted)}</div>
        </div>
      </a>
      `).join('')}
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <div class="container" style="text-align:center">
    <h2>¿Listo para dar el siguiente paso?</h2>
    <p class="subtitle">Nuestro equipo está disponible para asesorarte. Sin compromiso.</p>
    <a href="https://wa.me/50245542088?text=Hola, tengo una consulta sobre propiedades" target="_blank" rel="noopener" class="btn btn-primary">Contactar por WhatsApp</a>
  </div>
</section>

<!-- STATS -->
<section class="stats">
  <div class="container">
    <p class="label">Zona INNmueble en Números</p>
    <h2>Resultados que <em>hablan por sí solos</em></h2>
    
    <div class="grid grid-3-stats">
      <div class="stat-box">
        <div class="stat-number">31+</div>
        <div class="stat-label">Propiedades Verificadas</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">500+</div>
        <div class="stat-label">Familias Satisfechas</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">100%</div>
        <div class="stat-label">Transparencia</div>
      </div>
    </div>
  </div>
</section>

<!-- WA BUTTON -->
<a href="https://wa.me/50245542088" target="_blank" rel="noopener" class="wa-float">💬</a>
`;

  return layout({ 
    title: null, 
    desc: `Propiedades premium en Guatemala. ${props.length} propiedades disponibles. Asesoría personalizada.`, 
    canonical: '/', 
    body 
  });
}

function catalogPage(props) {
  const body = `
<section class="catalog">
  <div class="container">
    <p class="label">Catálogo</p>
    <h2>${props.length} Propiedades <em>Disponibles</em></h2>
    
    <div class="grid grid-3" style="margin-top:44px">
      ${props.map(p => `
      <a href="/propiedades/${p.slug}.html" class="card">
        <img src="${escapeHtml(p.mainImageThumb || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70')}" alt="${escapeHtml(p.title)}" loading="lazy">
        <div class="card-overlay"></div>
        <span class="badge">${p.cinta || 'PROPIEDAD'}</span>
        <div class="card-info">
          <div class="card-type">${escapeHtml(p.tipo)}</div>
          <h3>${escapeHtml(p.title)}</h3>
          <div class="card-meta">${p.habitaciones ? `<span>${p.habitaciones} hab</span>` : ''} ${p.banos ? `<span>${p.banos} baños</span>` : ''}</div>
          <div class="card-price">${escapeHtml(p.priceFormatted)}</div>
        </div>
      </a>
      `).join('')}
    </div>
  </div>
</section>
`;

  return layout({ 
    title: 'Catálogo Propiedades Premium Guatemala', 
    desc: `${props.length} propiedades premium en Guatemala. Casas, apartamentos, fincas e inversiones con asesoría.`, 
    canonical: '/propiedades.html', 
    body 
  });
}

function detailPage(prop, allProps) {
  const body = `
<section class="detail">
  <div class="container">
    <h1>${escapeHtml(prop.title)}</h1>
    <p class="price">${escapeHtml(prop.priceFormatted)}</p>
    
    <img src="${escapeHtml(prop.mainImage || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=70')}" alt="${escapeHtml(prop.title)}" style="width:100%;max-width:100%;height:auto;margin:44px 0;border-radius:4px;object-fit:cover;display:block">
    
    <div class="detail-content">
      <h2>Detalles</h2>
      <p>${escapeHtml(prop.description || 'Propiedad premium en Guatemala')}</p>
      
      <a href="https://wa.me/50245542088?text=Hola, me interesa ${escapeHtml(prop.title)}" target="_blank" rel="noopener" class="btn btn-primary">
        Consultar Disponibilidad
      </a>
    </div>
  </div>
</section>
`;

  return layout({ 
    title: prop.title, 
    desc: `${escapeHtml(prop.title)} en ${escapeHtml(prop.municipio || 'Guatemala')}. ${escapeHtml(prop.priceFormatted)}.`,
    canonical: `/propiedades/${prop.slug}.html`, 
    ogImage: prop.mainImage,
    body 
  });
}

module.exports = { indexPage, catalogPage, detailPage };
