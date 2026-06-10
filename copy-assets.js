const fs = require('fs');
const path = require('path');

// MAPPEO: archivo_fuente → archivo_destino
const fileMappings = {
  'InmuHub sin fondo 1_1.png': 'logo.png',      // Logo principal
  'InmuHub Ícono.png': 'icon.png'                // Icono principal
};

const srcDir = 'public/assets';
const dstDir = 'dist/vinculo/assets';

console.log('\n📦 Copiando assets para INMUHUB.COM...\n');

fs.mkdirSync(dstDir, { recursive: true });

Object.entries(fileMappings).forEach(([srcFile, dstFile]) => {
  const src = path.join(srcDir, srcFile);
  const dst = path.join(dstDir, dstFile);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`✅ ${srcFile} → ${dstFile}`);
  } else {
    console.warn(`⚠️  NO ENCONTRADO: ${srcFile}`);
  }
});

console.log('\n✨ Assets copy completado\n');
