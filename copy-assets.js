const fs = require('fs');
const path = require('path');

console.log('\n📦 Copiando assets para INMUHUB.COM...\n');

const dstDir = 'dist/vinculo/assets';
fs.mkdirSync(dstDir, { recursive: true });

// Assets desde public/assets (logos originales)
const publicMappings = {
  'InmuHub sin fondo 1_1.png': 'logo.png',
  'InmuHub Ícono.png': 'icon.png',
};
Object.entries(publicMappings).forEach(([srcFile, dstFile]) => {
  const src = path.join('public/assets', srcFile);
  const dst = path.join(dstDir, dstFile);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`✅ ${srcFile} → ${dstFile}`);
  } else {
    console.warn(`⚠️  NO ENCONTRADO: ${srcFile}`);
  }
});

// Assets desde src/vinculo/assets (logo horizontal, favicon, etc)
const vinculoAssets = ['logo-horizontal.png', 'favicon2.png'];
vinculoAssets.forEach(file => {
  const src = path.join('src/vinculo/assets', file);
  const dst = path.join(dstDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`✅ ${file} → assets/${file}`);
  } else {
    console.warn(`⚠️  NO ENCONTRADO: ${file}`);
  }
});

console.log('\n✨ Assets copy completado\n');
