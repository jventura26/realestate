function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function generateSitemap(baseUrl, urls) {
  const today = new Date().toISOString().split('T')[0];
  const entries = urls.map(({ loc, priority = '0.8', changefreq = 'weekly' }) =>
    `  <url><loc>${baseUrl}${loc}</loc><lastmod>${today}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

function generateRobots(baseUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
}

function uniqueValues(items, key) {
  return [...new Set(items.map(i => i[key]).filter(Boolean))].sort();
}

function getRelated(prop, all, limit = 3) {
  return all
    .filter(p => p.slug !== prop.slug && (p.tipo === prop.tipo || p.municipio === prop.municipio))
    .slice(0, limit);
}

// Generate Netlify _redirects from old Wix paths â new paths
function generateRedirects(properties, siteBase) {
  const lines = ['# Old Wix URLs â new static URLs (301 permanent)'];
  for (const p of properties) {
    if (!p.wixPath || !p.wixPath.includes('/propiedades-1/')) continue;
    lines.push(`${p.wixPath}    /propiedades/${p.slug}.html    301!`);
    lines.push(`${p.wixPath}/   /propiedades/${p.slug}.html    301!`);
  }
  // Also redirect old catalog
  lines.push('/propiedades-1/   /propiedades.html   301!');
  lines.push('/propiedades-1    /propiedades.html   301!');
  lines.push('');
  // No wildcard redirect - assets deben servirse directo
  return lines.join('\n');
}

module.exports = { escapeHtml, generateSitemap, generateRobots, uniqueValues, getRelated, generateRedirects };
