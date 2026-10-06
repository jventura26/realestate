// Páginas SEO por zona generadas con el Índice Zona-INNmueble
const { layout } = require('./layout');
const { escapeHtml } = require('../../shared/utils');
const A = require('../analysis');
const { I, waLink } = require('./blocks');

const TIPO_PL = { Casa: 'casas', Apartamento: 'apartamentos', Terreno: 'terrenos', Finca: 'fincas' };
const ORDER = ['Casa', 'Apartamento', 'Terreno', 'Finca'];

function slugify(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
const titleName = A.zoneTitle;
const zoneSlug = A.zoneSlugOf;

function zoneIndex() {
  const D = A.loadZoneData();
  const byId = {}; D.lugares.forEach(l => { byId[l.id] = l; });
  return { D, byId, list: D.lugares.map(l => ({ l, name: titleName(l, byId), slug: zoneSlug(l, byId) })) };
}

const usd = n => A.fmtUSD(n);
const money = n => '$' + Math.round(n).toLocaleString('en-US');

function valorZonaPage(entry, ctx, props, card) {
  const { l, name, slug } = entry;
  const { D, byId, list } = ctx;
  const fecha = D.fecha ? new Date(D.fecha + 'T12:00:00').toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const year = (D.fecha || '').slice(0, 4) || new Date().getFullYear();
  const tipos = ORDER.filter(t => l.tipos[t]);
  const main = tipos.slice().sort((x, y) => l.tipos[y].n - l.tipos[x].n)[0];
  const d = l.tipos[main];
  const parent = l.padre && byId[l.padre];
  const nTot = tipos.reduce((s, t) => s + l.tipos[t].n, 0);

  // Lectura en lenguaje claro
  const lect = [];
  lect.push(`${main === 'Casa' ? 'Una casa' : main === 'Apartamento' ? 'Un apartamento' : main === 'Terreno' ? 'Un terreno' : 'Una finca'} típic${main === 'Casa' || main === 'Finca' ? 'a' : 'o'} en ${escapeHtml(name)} se ofrece alrededor de <b>${usd(d.precio[1])}</b>. La mitad de los anuncios está entre ${usd(d.precio[0])} y ${usd(d.precio[2])}.`);
  if (d.m2) lect.push(`Por metro cuadrado ${/terreno/.test(d.base || '') ? 'de terreno' : 'construido'}, la mediana es <b>${money(d.m2[1])}/m²</b> (rango típico ${money(d.m2[0])}–${money(d.m2[2])}).`);
  if (parent && parent.tipos[main] && parent.tipos[main].m2 && d.m2) {
    const diff = (d.m2[1] / parent.tipos[main].m2[1] - 1) * 100;
    if (Math.abs(diff) >= 3) lect.push(`Eso es ${Math.abs(diff).toFixed(0)}% ${diff > 0 ? 'más alto' : 'más bajo'} que la mediana de ${escapeHtml(parent.nombre)} (${money(parent.tipos[main].m2[1])}/m²).`);
    else lect.push(`Está en línea con la mediana de ${escapeHtml(parent.nombre)}.`);
  }
  if (l.clase === 'Macro-zona' && d.m2) {
    const ranked = D.lugares.filter(x => x.clase === 'Macro-zona' && x.tipos[main] && x.tipos[main].m2).sort((a, b) => b.tipos[main].m2[1] - a.tipos[main].m2[1]);
    const pos = ranked.findIndex(x => x.id === l.id) + 1;
    if (pos) lect.push(`Por precio por m² de ${TIPO_PL[main]}, ocupa el puesto ${pos} de ${ranked.length} zonas del índice.`);
  }
  const rentT = tipos.find(t => l.tipos[t].renta && l.tipos[t].rend);
  if (rentT) lect.push(`Para renta, ${TIPO_PL[rentT]} se alquilan típicamente en <b>${money(l.tipos[rentT].renta[1])} al mes</b>, con un rendimiento bruto de ${(l.tipos[rentT].rend * 100).toFixed(1)}% anual.`);
  const lowConf = tipos.some(t => /baja/i.test(l.tipos[t].conf || ''));

  // Propiedades de la zona
  const mine = props.filter(p => {
    const z = A.matchZone(p);
    return z && (z.lugar.id === l.id || z.lugar.padre === l.id);
  }).slice(0, 6);

  // Zonas relacionadas
  const rel = list.filter(x => x.l.id !== l.id && (x.l.padre === l.id || (l.padre && (x.l.padre === l.padre || x.l.id === l.padre)))).slice(0, 10);

  const faqs = [];
  faqs.push([`¿Cuánto cuesta ${main === 'Casa' ? 'una casa' : main === 'Apartamento' ? 'un apartamento' : main === 'Terreno' ? 'un terreno' : 'una finca'} en ${name}?`,
    `Según el Índice Zona-INNmueble (${fecha}), el precio típico de oferta es ${usd(d.precio[1])}, y la mitad de los anuncios está entre ${usd(d.precio[0])} y ${usd(d.precio[2])}. Son precios publicados, no de cierre.`]);
  if (d.m2) faqs.push([`¿Cuál es el precio por metro cuadrado en ${name}?`, `La mediana es ${money(d.m2[1])} por m² ${/terreno/.test(d.base || '') ? 'de terreno' : 'de construcción'} para ${TIPO_PL[main]}, con un rango típico de ${money(d.m2[0])} a ${money(d.m2[2])}.`]);
  if (rentT) faqs.push([`¿Cuánto se renta ${rentT === 'Casa' ? 'una casa' : 'un apartamento'} en ${name}?`, `La renta típica es de ${money(l.tipos[rentT].renta[1])} al mes (rango ${money(l.tipos[rentT].renta[0])}–${money(l.tipos[rentT].renta[2])}), con un rendimiento bruto anual cercano a ${(l.tipos[rentT].rend * 100).toFixed(1)}%.`]);
  faqs.push([`¿Cómo sé si una propiedad en ${name} tiene buen precio?`, `Compara su precio y su precio por m² con el rango típico de la zona, y revisa estado, ubicación exacta y documentos. En Zona-INNmueble hacemos ese análisis con usted antes de cualquier oferta.`]);

  const jsonLd = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://zona-innmueble.com/' },
        { '@type': 'ListItem', position: 2, name: 'Índice', item: 'https://zona-innmueble.com/indice.html' },
        { '@type': 'ListItem', position: 3, name, item: `https://zona-innmueble.com/valor/${slug}.html` } ] },
    ],
  };

  const body = `
<section class="pg-hero grid-bg" style="padding-bottom:50px">
  <div class="sec-in">
    <div class="src-note" style="margin-bottom:14px"><a href="/">Inicio</a> › <a href="/indice.html">Índice</a> › ${escapeHtml(name)}</div>
    <div class="ey">Valor por zona · ${escapeHtml(l.clase === 'Macro-zona' ? 'Zona' : l.clase)}</div>
    <h1 class="pg-h1" style="font-size:clamp(2.2rem,5vw,4rem)">Precio de propiedades en <em>${escapeHtml(name)}</em> ${year}</h1>
    <p class="pg-lead">Valores de referencia de ${tipos.map(t => TIPO_PL[t]).join(', ').replace(/, ([^,]*)$/, ' y $1')} en ${escapeHtml(name)}, calculados con ${nTot.toLocaleString('en-US')} anuncios publicados. Datos al ${escapeHtml(fecha)}.</p>
  </div>
</section>

<section class="sec" style="background:var(--ink2);padding-top:56px">
  <div class="sec-in">
    <div class="zd-grid">
      ${tipos.map(t => { const x = l.tipos[t]; return `<div class="zd-card" style="cursor:default"><span class="zd-pin"></span>
        <div class="zd-name">${t === 'Casa' ? 'Casas' : t === 'Apartamento' ? 'Apartamentos' : t === 'Terreno' ? 'Terrenos' : 'Fincas'}</div>
        <div class="zd-sub">${x.n} anuncios · confianza ${escapeHtml((x.conf || '').toLowerCase())}</div>
        <div class="zd-kpis">
          ${x.m2 ? `<div class="zd-kpi"><b>${money(x.m2[1])}/m²</b><span>Mediana</span></div><div class="zd-kpi"><b>${money(x.m2[0])}–${money(x.m2[2])}</b><span>Rango /m²</span></div>` : ''}
          <div class="zd-kpi"><b>${usd(x.precio[1])}</b><span>Precio típico</span></div>
          <div class="zd-kpi"><b>${usd(x.precio[0])}–${usd(x.precio[2])}</b><span>Rango de precio</span></div>
          ${x.renta ? `<div class="zd-kpi"><b>${money(x.renta[1])}</b><span>Renta típica/mes</span></div>` : ''}
          ${x.rend ? `<div class="zd-kpi"><b>${(x.rend * 100).toFixed(1)}%</b><span>Rend. bruto</span></div>` : ''}
        </div></div>`; }).join('')}
    </div>

    <div class="split" style="margin-top:56px;align-items:start;gap:48px">
      <div>
        <h2 class="st-large">Qué dicen <em style="color:var(--or)">los datos</em></h2>
        ${lect.map(t => `<p style="font-size:.9rem;color:var(--sv);line-height:1.9;font-weight:300;margin-top:14px">${t}</p>`).join('')}
        ${lowConf ? `<p class="src-note" style="margin-top:14px">Algunos tipos tienen pocos anuncios en esta zona: úsalos como referencia general.</p>` : ''}
        <p class="src-note" style="margin-top:14px">Precios de oferta publicados, no de cierre. No constituyen avalúo. <a href="/indice.html">Metodología</a>.</p>
      </div>
      <div class="h2-panel glass">
        <div class="za-ey">¿Evalúas una propiedad en ${escapeHtml(name)}?</div>
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:400;margin:6px 0 12px">Le decimos si su precio está en rango</h3>
        <p style="font-size:.82rem;color:var(--sv);line-height:1.75;margin-bottom:18px">Envíanos el enlace o los datos de la propiedad y la comparamos con el mercado de la zona, sin compromiso.</p>
        <a class="btn-gold" style="width:100%" href="${waLink('Hola, estoy evaluando una propiedad en ' + name + '. ¿Me ayudan a analizar si su precio está en rango?')}" target="_blank" rel="noopener">${I.wa} Pedir análisis</a>
        <div style="display:flex;gap:10px;margin-top:10px"><a class="btn-ghost" style="flex:1;padding:12px 10px" href="/diagnostico.html">Diagnóstico</a><a class="btn-ghost" style="flex:1;padding:12px 10px" href="/vender.html#estimador">Vender</a></div>
      </div>
    </div>
  </div>
</section>

${mine.length ? `<section style="padding:80px 0 0;background:var(--ink)">
  <div class="sec-in" style="padding:0 6% 36px"><div class="ey">Propiedades analizadas</div><h2 class="st">En <em>${escapeHtml(name)}</em></h2></div>
  <div class="prop-grid">${mine.map((p, i) => card(p, i + 10)).join('')}</div>
</section>` : ''}

<section class="sec" style="background:var(--ink)">
  <div class="sec-in">
    <h2 class="st-large">Preguntas frecuentes</h2>
    <div style="display:grid;gap:10px;margin-top:20px">
      ${faqs.map(([q, a]) => `<details class="glass" style="padding:18px 22px;border-radius:10px"><summary style="cursor:pointer;font-weight:600;font-size:.88rem">${escapeHtml(q)}</summary><p style="font-size:.84rem;color:var(--sv);line-height:1.8;margin-top:10px">${escapeHtml(a)}</p></details>`).join('')}
    </div>
    ${rel.length ? `<div style="margin-top:40px"><div class="ey">Zonas relacionadas</div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">${rel.map(r => `<a class="za-tags" href="/valor/${r.slug}.html" style="display:inline-flex"><span>${escapeHtml(r.name)}</span></a>`).join('')}</div></div>` : ''}
  </div>
</section>`;

  return layout({
    title: `Precio de casas y terrenos en ${name} ${year} · valor por m²`,
    desc: `Cuánto cuesta una propiedad en ${name}: precio por m², precio típico${rentT ? ', renta' : ''} y rangos de ${tipos.map(t => TIPO_PL[t]).join(', ')}. Índice Zona-INNmueble con datos al ${fecha}.`,
    canonical: `/valor/${slug}.html`, body,
    scripts: `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  });
}

function valorIndexPage(ctx) {
  const { D, list } = ctx;
  const groups = {};
  list.forEach(x => { const k = x.l.clase === 'Macro-zona' ? 'Zonas principales' : x.l.clase === 'Tramo' ? 'Carretera a El Salvador por kilómetro' : x.l.clase === 'Sector' ? 'Sectores y colonias' : x.l.clase === 'Zona' ? 'Otras zonas de la capital' : 'Municipios'; (groups[k] = groups[k] || []).push(x); });
  const order = ['Zonas principales', 'Carretera a El Salvador por kilómetro', 'Sectores y colonias', 'Otras zonas de la capital', 'Municipios'];
  const body = `
<section class="pg-hero grid-bg"><div class="sec-in">
  <div class="ey">Valor por zona</div>
  <h1 class="pg-h1">¿Cuánto cuesta una propiedad <em>en su zona?</em></h1>
  <p class="pg-lead">${list.length} zonas, sectores y municipios de Guatemala con precio por m², precio típico y renta, calculados con ${(D.n_anuncios || 0).toLocaleString('en-US')} anuncios.</p>
</div></section>
<section class="sec" style="background:var(--ink2);padding-top:50px"><div class="sec-in">
  ${order.filter(k => groups[k]).map(k => `<div style="margin-bottom:34px"><div class="ey">${k}</div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">${groups[k].sort((a, b) => a.name.localeCompare(b.name)).map(x => `<a class="za-tags" href="/valor/${x.slug}.html" style="display:inline-flex"><span>${escapeHtml(x.name)}</span></a>`).join('')}</div></div>`).join('')}
</div></section>`;
  return layout({ title: 'Valor de propiedades por zona en Guatemala', desc: 'Precio por m², precio típico y renta por zona, sector y municipio de Guatemala. Índice Zona-INNmueble.', canonical: '/valor/index.html', body });
}

module.exports = { zoneIndex, valorZonaPage, valorIndexPage, zoneSlug, slugify };
