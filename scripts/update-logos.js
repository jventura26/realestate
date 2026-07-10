#!/usr/bin/env node

/**
 * UPDATE LOGO SCRIPT
 * Reemplaza el logo de texto por el nuevo logo en imagen en todas las propiedades
 */

const fs = require('fs');
const path = require('path');

const PROPIEDADES_DIR = path.join(__dirname, '..', 'src', 'zona', 'propiedades');

const LOGO_HTML = '<a href="/" class="logo"><img src="/assets/images/logo.png" alt="Zona INNmueble" style="height:50px;width:auto"></a>';

function actualizarLogo(slug) {
  const filePath = path.join(PROPIEDADES_DIR, `${slug}.html`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ NO EXISTE: ${slug}.html`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Reemplazar logo de texto por logo de imagen
    const logoAntiguo = /<a href="\/" class="logo"><em>ZONA<\/em>&nbsp;INNMUEBLE<sub>Real Estate<\/sub><\/a>/;
    
    if (logoAntiguo.test(content)) {
      content = content.replace(logoAntiguo, LOGO_HTML);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`  ✅ Logo actualizado en: ${slug.padEnd(20)}`);
      return true;
    } else {
      // Si ya está actualizado, no hacer nada
      return true;
    }
  } catch (err) {
    console.error(`  ❌ ERROR en ${slug}:`, err.message);
    return false;
  }
}

function main() {
  console.log(`\n${'═'.repeat(70)}`);
  console.log('🎨 UPDATE LOGO - Actualizando logos en todas las propiedades');
  console.log(`${'═'.repeat(70)}\n`);

  const archivos = fs.readdirSync(PROPIEDADES_DIR).filter(f => f.endsWith('.html'));
  console.log(`📊 Archivos HTML detectados: ${archivos.length}\n`);

  let exitosas = 0;

  console.log('Procesando propiedades:\n');
  
  archivos.forEach(archivo => {
    const slug = archivo.replace('.html', '');
    if (actualizarLogo(slug)) {
      exitosas++;
    }
  });

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`✅ Logos actualizados: ${exitosas}/${archivos.length}`);
  console.log(`${'═'.repeat(70)}\n`);
}

main();
