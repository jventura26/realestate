const fs = require('fs');
const path = require('path');

const files = ['favicon.ico', 'apple-touch-icon.png', 'INMUNHUB (1).png'];
const srcDir = 'public/assets';
const dstDir = 'dist/vinculo/assets';

fs.mkdirSync(dstDir, { recursive: true });

files.forEach(file => {
  const src = path.join(srcDir, file);
  const dst = path.join(dstDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`✅ Copiado: ${file}`);
  }
});
