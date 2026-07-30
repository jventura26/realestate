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
    lines.push(`${p.wixPath}    /propiedades/${p.slug}.html    301`);
    lines.push(`${p.wixPath}/   /propiedades/${p.slug}.html    301`);
  }
  // Also redirect old catalog
  lines.push('/propiedades-1/   /propiedades.html   301');
  lines.push('/propiedades-1    /propiedades.html   301');
  lines.push('');
  
  // No wildcard redirect - assets deben servirse directo
  return lines.join('\n');
}

// Score de reputacion compuesto (0-100) a partir de senales reales del asesor:
// verificado (flag de admin), antiguedad en la plataforma, responseSignal (actividad
// real basada en logins, ya calculada aparte - null si no hay suficientes datos) y
// propiedades activas publicadas. No inventa nada nuevo, solo combina senales que ya
// existen. Si el asesor no tiene NINGUNA senal positiva todavia (recien registrado,
// sin propiedades, sin actividad medible), se devuelve null para no mostrar un score
// bajo publico que se sienta como un demerito - simplemente no se muestra badge.
function computeReputationScore(b) {
  var score = 0;

  if (b.verificado) score += 25;

  var joinedAt = b.created_at ? new Date(b.created_at).getTime() : null;
  var monthsActive = joinedAt ? Math.max(0, (Date.now() - joinedAt) / (1000 * 60 * 60 * 24 * 30)) : 0;
  score += Math.min(monthsActive, 12) / 12 * 15;

  if (b.responseSignal && typeof b.responseSignal.avgHours === 'number') {
    var h = b.responseSignal.avgHours;
    if (h < 1) score += 30;
    else if (h < 4) score += 22;
    else if (h < 24) score += 15;
    else score += 8;
  }

  var propsCount = Math.min(b.propiedades_count || 0, 10);
  score += (propsCount / 10) * 30;

  score = Math.round(score);

  var hasAnySignal = !!b.verificado || propsCount > 0 || !!b.responseSignal;
  if (!hasAnySignal) return null;

  if (score >= 80) return { score: score, tier: 'elite', label: 'Asesor Elite' };
  if (score >= 50) return { score: score, tier: 'confiable', label: 'Asesor Confiable' };
  return null; // score bajo: no es un demerito publico, simplemente no se muestra badge
}

module.exports = { escapeHtml, generateSitemap, generateRobots, uniqueValues, getRelated, generateRedirects, computeReputationScore };
