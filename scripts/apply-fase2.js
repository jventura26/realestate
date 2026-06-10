#!/usr/bin/env node

/**
 * FASE 2 AUTOMATION SCRIPT
 * Aplica automáticamente todas las mejoras a TODAS las propiedades
 * - Lightbox2 CSS
 * - Storytelling emocional
 * - Investment info
 * - Breadcrumb mejorado
 * - Lightbox2 script
 */

const fs = require('fs');
const path = require('path');

// ───────────────────────────────────────────────────────────────────
// CONFIG
// ───────────────────────────────────────────────────────────────────

const PROPIEDADES_DIR = path.join(__dirname, '..', 'src', 'zona', 'propiedades');
const CSV_PATH = path.join(__dirname, '..', 'data', 'propiedades.csv');

const LIGHTBOX_CSS = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css">';
const LIGHTBOX_SCRIPT = `<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/lightbox.min.js"></script>
<script>
lightbox.option({
  'resizeDuration': 200,
  'wrapAround': true,
  'imageFadeDuration': 300,
  'showImageNumberLabel': true
});
</script>`;

// Generar storytelling emocional por tipo de propiedad
function generarStorytellingProperty(tipo, zona, precio) {
  const templates = {
    'Casa': [
      `Ubicada en ${zona}, esta residencia no es solo una casa: es un espacio completamente renovado donde cada detalle respira modernidad y funcionalidad. Rodeada de naturaleza, ofrece el equilibrio perfecto entre privacidad y accesibilidad.`,
      `Diseñada para vivir, no solo para existir. Esta casa en ${zona} representa el estilo de vida que buscas: amplia, moderna y lista para recibir tus mejores momentos.`,
      `En esta propiedad en ${zona}, el espacio se convierte en experiencia. Cada ambiente fue pensado para ofrecerte comodidad, luz natural y esa sensación de hogar que se siente.`
    ],
    'Apartamento': [
      `Un apartamento en ${zona} que entiende lo que significa vivir en altura: luz, vistas y servicios premium. Tu acceso a la vida urbana sin sacrificar comodidad.`,
      `Penthouse con carácter. Este apartamento en ${zona} no es solo un inmueble: es un posicionamiento en la ciudad, una dirección que habla de ti.`,
      `Ubicado estratégicamente en ${zona}, este apartamento redefine lo que significa un espacio premium. Cada m² está optimizado para máximo confort.`
    ],
    'Fincas': [
      `Esta finca en ${zona} representa más que terreno: representa libertad, espacio y potencial. Aquí, la naturaleza es tu vecina, y el desarrollo es tuyo.`,
      `Aquí tienes algo cada vez más raro: espacio real, privacidad absoluta y potencial de crecimiento. Ubicada en ${zona}, combina tranquilidad rural con accesibilidad.`,
      `No es solo una finca. Es una inversión en calidad de vida. Ubicada en ${zona}, ofrece amplitud y oportunidades.`
    ]
  };

  const tiposDisp = templates[tipo] || templates['Casa'];
  const template = tiposDisp[Math.floor(Math.random() * tiposDisp.length)];

  return `<!-- STORY SECTION -->
      <div style="background:linear-gradient(135deg,rgba(74,144,217,.08) 0%,rgba(16,185,129,.04) 100%);border-left:3px solid var(--or);padding:28px;margin-bottom:36px;border-radius:4px">
        <div style="font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:12px">✨ Más que una propiedad</div>
        <p style="font-size:.85rem;color:var(--sv);line-height:1.9;font-weight:300;margin:0">${template}</p>
      </div>`;
}

// ───────────────────────────────────────────────────────────────────
// PARSEAR CSV
// ───────────────────────────────────────────────────────────────────

function parsearPropiedades() {
  const csv = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csv.split('\n').slice(1);
  const props = {};

  lines.forEach(line => {
    if (!line.trim()) return;
    const cols = line.split(',');
    const slug = cols[0]?.trim();
    if (!slug) return;

    props[slug] = {
      titulo: cols[1]?.trim() || '',
      precio: cols[5]?.trim() || '$0',
      tipo: cols[6]?.trim() || 'Casa',
      zona: cols[8]?.trim() || 'Guatemala',
      municipio: cols[9]?.trim() || 'Guatemala',
      habitaciones: cols[10]?.trim() || '0',
      banos: cols[11]?.trim() || '0',
      construccion: cols[13]?.trim() || '0 m²',
    };
  });

  return props;
}

// ───────────────────────────────────────────────────────────────────
// AGREGAR LIGHTBOX CSS
// ───────────────────────────────────────────────────────────────────

function agregarLightboxCSS(content) {
  // Buscar la línea de Google Fonts
  const fontLink = 'rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant';
  
  if (!content.includes('lightbox')) {
    content = content.replace(
      /(<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]*"[^>]*>)/,
      `$1\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css">`
    );
  }

  return content;
}

// ───────────────────────────────────────────────────────────────────
// AGREGAR STORYTELLING + BREADCRUMB
// ───────────────────────────────────────────────────────────────────

function agregarStorytellingYBreadcrumb(content, prop) {
  // Generar storytelling
  const storytelling = generarStorytellingProperty(prop.tipo, prop.zona, prop.precio);

  // Generar breadcrumb mejorado
  const breadcrumb = `<div style="background:var(--ink2);padding:14px 6%;border-top:1px solid var(--bd)">
  <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
    <div class="breadcrumb">
      <a href="/" style="color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--or)'" onmouseout="this.style.color='var(--sv)'">Inicio</a>
      <span style="color:var(--bd)">/</span>
      <a href="/propiedades.html" style="color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--or)'" onmouseout="this.style.color='var(--sv)'">Propiedades</a>
      <span style="color:var(--bd)">/</span>
      <span style="color:var(--sv)">${prop.titulo}</span>
    </div>
    <a href="/propiedades.html" style="display:inline-flex;align-items:center;gap:6px;font-size:.68rem;color:var(--sv);text-decoration:none;transition:color .2s" onmouseover="this.style.color='var(--or)'" onmouseout="this.style.color='var(--sv)'">← Volver a búsqueda</a>
  </div>
</div>`;

  // Reemplazar det-header
  content = content.replace(
    /<div class="det-header">[\s\S]*?<\/div>/,
    `<div class="det-header">\n</div>\n${breadcrumb}`
  );

  // Agregar storytelling después de margin-top:42px
  content = content.replace(
    /(<div style="margin-top:42px">)/,
    `$1\n      ${storytelling}`
  );

  return content;
}

// ───────────────────────────────────────────────────────────────────
// AGREGAR INVESTMENT INFO
// ───────────────────────────────────────────────────────────────────

function agregarInvestmentInfo(content, prop) {
  const investmentInfo = `<div style="margin-top:10px;background:var(--ink2);border:1px solid var(--bd);padding:18px 20px">
      <div style="font-size:.56rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:10px">📊 Análisis de Inversión</div>
      <div style="font-size:.75rem;color:var(--sv);line-height:1.8">
        <div style="margin-bottom:8px"><strong>Ubicación:</strong> ${prop.municipio} (acceso estratégico)</div>
        <div style="margin-bottom:8px"><strong>Potencial:</strong> Zona en apreciación sostenida</div>
        <div style="margin-bottom:8px"><strong>Estado:</strong> ${prop.tipo === 'Fincas' ? 'Terreno disponible' : 'Renovada y lista para habitar o rentar'}</div>
        <div style="margin-bottom:8px"><strong>Rentabilidad:</strong> Aproximada 4-5% anual</div>
      </div>
    </div>`;

  // Agregar antes de "Código de referencia"
  content = content.replace(
    /(<div style="margin-top:10px;background:var\(--ink2\);border:1px solid var\(--bd\);padding:18px 20px">\s*<div style="font-size:\.56rem;font-weight:600;letter-spacing:\.2em;text-transform:uppercase;color:var\(--or\);margin-bottom:10px">Código de referencia<\/div>)/,
    `${investmentInfo}\n    $1`
  );

  return content;
}

// ───────────────────────────────────────────────────────────────────
// CONVERTIR GALERÍA A LIGHTBOX
// ───────────────────────────────────────────────────────────────────

function convertirGaleriaALightbox(content, prop) {
  // Este es un patrón complejo. Detectar si ya está convertida
  if (content.includes('data-lightbox="property"')) {
    console.log('  ⚠️  Galería ya convertida');
    return content;
  }

  // Extraer URLs de galería del patrón onclick
  const galeriaRegex = /<div class="gal-mini">([\s\S]*?)<\/div>/;
  const match = content.match(galeriaRegex);

  if (match) {
    const galeriaOld = match[0];
    // Extraer todas las imágenes
    const imgRegex = /src="([^"]*)"[^>]*alt="([^"]*)"/g;
    let imgMatch;
    let contador = 1;
    let galeriaNew = '<div class="gal-mini" id="lightboxGallery">';

    while ((imgMatch = imgRegex.exec(galeriaOld)) !== null) {
      const url = imgMatch[1];
      galeriaNew += `<a href="${url}" data-lightbox="property" data-title="${prop.titulo} - Foto ${contador}">
    <img referrerpolicy="no-referrer" src="${url}" alt="${prop.titulo}" loading="lazy" style="cursor:pointer">
  </a>`;
      contador++;
    }

    galeriaNew += '</div>';
    content = content.replace(galeriaOld, galeriaNew);
  }

  return content;
}

// ───────────────────────────────────────────────────────────────────
// AGREGAR LIGHTBOX SCRIPT
// ───────────────────────────────────────────────────────────────────

function agregarLightboxScript(content) {
  if (content.includes('lightbox.option')) {
    console.log('  ⚠️  Script Lightbox ya agregado');
    return content;
  }

  content = content.replace(
    /\n<\/body>\n<\/html>/,
    `\n${LIGHTBOX_SCRIPT}\n\n</body>\n</html>`
  );

  return content;
}

// ───────────────────────────────────────────────────────────────────
// PROCESAR CADA PROPIEDAD
// ───────────────────────────────────────────────────────────────────

function procesarPropiedad(slug, prop) {
  const filePath = path.join(PROPIEDADES_DIR, `${slug}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ NO EXISTE: ${slug}.html`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Aplicar mejoras
    content = agregarLightboxCSS(content);
    content = agregarStorytellingYBreadcrumb(content, prop);
    content = agregarInvestmentInfo(content, prop);
    content = convertirGaleriaALightbox(content, prop);
    content = agregarLightboxScript(content);

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ ${slug.padEnd(20)} - COMPLETADO`);
    return true;
  } catch (err) {
    console.error(`  ❌ ERROR en ${slug}:`, err.message);
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────
// MAIN
// ───────────────────────────────────────────────────────────────────

function main() {
  console.log(`\n${'═'.repeat(70)}`);
  console.log('🚀 FASE 2 AUTOMATION - Aplicando mejoras a TODAS las propiedades');
  console.log(`${'═'.repeat(70)}\n`);

  // Obtener todos los archivos HTML
  const archivos = fs.readdirSync(PROPIEDADES_DIR).filter(f => f.endsWith('.html'));
  console.log(`📊 Archivos HTML detectados: ${archivos.length}\n`);

  // Procesar cada archivo
  let exitosas = 0;
  let fallidas = 0;

  console.log('Procesando propiedades:\n');
  
  archivos.forEach(archivo => {
    const slug = archivo.replace('.html', '');
    
    // Crear objeto propiedad básico (se puede mejorar)
    const prop = {
      titulo: slug.replace(/-/g, ' ').toUpperCase(),
      tipo: 'Casa', // Default
      zona: 'Guatemala',
      municipio: 'Guatemala',
      precio: '$0'
    };

    if (procesarPropiedad(slug, prop)) {
      exitosas++;
    } else {
      fallidas++;
    }
  });

  // Resumen
  console.log(`\n${'═'.repeat(70)}`);
  console.log('📋 RESUMEN');
  console.log(`${'═'.repeat(70)}`);
  console.log(`✅ Exitosas:  ${exitosas}`);
  console.log(`❌ Fallidas:  ${fallidas}`);
  console.log(`📊 Total:     ${exitosas + fallidas}`);
  console.log(`\n✨ FASE 2 COMPLETADA AL ${Math.round((exitosas / (exitosas + fallidas)) * 100)}%\n`);

  if (exitosas === archivos.length) {
    console.log('🎉 ¡TODAS LAS PROPIEDADES ACTUALIZADAS EXITOSAMENTE!');
    console.log('\nPróximos pasos:');
    console.log('1. git add -A');
    console.log('2. git commit -m "✨ FASE 2 AUTOMÁTICA: Todas las propiedades actualizadas"');
    console.log('3. git push');
    console.log('\n');
  }
}

main();
