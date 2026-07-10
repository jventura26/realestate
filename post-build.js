const fs = require('fs');
const path = require('path');

// Copiar archivos HTML de src/vinculo a dist/vinculo
const srcDir = path.join(__dirname, 'src/vinculo');
const distDir = path.join(__dirname, 'dist/vinculo');

const files = fs.readdirSync(srcDir);
files.forEach(file => {
  if (file.endsWith('.html')) {
    const srcFile = path.join(srcDir, file);
    const distFile = path.join(distDir, file);
    fs.copyFileSync(srcFile, distFile);
    console.log(`✅ Copiado: ${file}`);
  }
});

console.log('\n✅ Post-build: Archivos HTML copiados a dist/\n');
