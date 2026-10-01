// ─────────────────────────────────────────────────────────────────────
//  Zona-INNmueble · Motor de análisis
//  Usa los datos reales de la herramienta "Valor por zona"
//  (src/zona/valor-por-zona.html → const D = {...}) como única fuente
//  de verdad para comparar cada propiedad con su mercado.
//
//  Reglas de honestidad:
//   - Nunca se afirma un "avalúo": todo es "referencia de mercado" basada
//     en precios de OFERTA publicados, no de cierre.
//   - Si los datos no alcanzan (zona sin muestra, área dudosa), no se
//     muestra la comparación en lugar de inventarla.
// ─────────────────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');

const RATE = 7.65; // tipo de cambio referencial, igual que build.js
const Z10 = { lat: 14.5995, lng: -90.5085 }; // Zona Viva, Zona 10

let _D = null;
function loadZoneData() {
  if (_D) return _D;
  try {
    const html = fs.readFileSync(path.join(__dirname, 'valor-por-zona.html'), 'utf-8');
    const m = html.match(/const D = (\{[\s\S]*?\});\n/);
    _D = m ? JSON.parse(m[1]) : null;
  } catch (e) { _D = null; }
  if (!_D) _D = { fecha: '', n_anuncios: 0, n_rentas: 0, lugares: [] };
  return _D;
}

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── Precio ──────────────────────────────────────────────────────────
function priceInfo(p) {
  const ref = String(p.priceFormatted || p.precio || '');
  const num = parseFloat(ref.replace(/^\s*(Q\.?|GTQ|\$|USD)\s*/i, '').replace(/,/g, '').replace(/[^0-9.]/g, ''));
  if (!num || isNaN(num)) return null;
  let usd;
  if (ref.includes('$') || /usd/i.test(ref)) usd = true;
  else if (/^\s*(q|gtq)/i.test(ref)) usd = false;
  else usd = String(p.moneda || '').toUpperCase() === 'USD';
  return { usd: usd ? num : num / RATE, gtq: usd ? num * RATE : num, isUSD: usd };
}

function areaM2(p) {
  const a = parseFloat(String(p.areaConst || p.area || '').replace(/,/g, '').replace(/[^0-9.]/g, ''));
  return a && a > 0 ? a : 0;
}

function tipoKey(p) {
  const t = norm(p.tipo);
  if (t.startsWith('apart')) return 'Apartamento';
  if (t.startsWith('terren') || t.startsWith('lote')) return 'Terreno';
  if (t.startsWith('finca')) return 'Finca';
  if (t.startsWith('casa') || t.startsWith('resid')) return 'Casa';
  return null;
}

// ── Zona de comparación ─────────────────────────────────────────────
const EXTRA_ALIAS = [
  [/kanajuy/, 'M:Zona 16'], [/san isidro/, 'S:San Isidro'], [/cayala/, 'S:Cayalá'],
  [/vista hermosa/, 'S:Vista Hermosa'], [/el socorro/, 'S:El Socorro'], [/hacienda nueva/, 'S:Hacienda Nueva'],
  [/santa rosalia/, 'S:Santa Rosalía'], [/muxbal/, 'S:Muxbal'], [/oakland/, 'S:Oakland'],
  [/chulamar|puerto de san jose|puerto san jose/, 'U:puerto san jose'], [/monterrico/, 'U:monterrico'],
  [/san cristobal/, 'M:San Cristóbal'], [/milpas altas/, 'U:santa lucia milpas altas'],
  [/antigua/, 'M:Antigua Guatemala / Sacatepéquez'],
];

function matchZone(p) {
  const D = loadZoneData();
  const byId = {};
  D.lugares.forEach(l => { byId[l.id] = l; });
  const tk = tipoKey(p);
  if (!tk) return null;
  const text = norm([p.titulo || p.title, p.zona, p.municipio, p.ubicacionGeneral].join(' '));
  const cands = [];

  // 1) Tramo de Carretera a El Salvador por kilómetro
  const km = text.match(/km\.?\s*(\d+(?:[.,]\d+)?)/);
  const isCAES = /salvador|caes|\bces\b|fraijanes|pinula|arrazola|fontana|vizcaya|alcala/.test(text);
  if (km && isCAES) {
    const k = parseFloat(km[1].replace(',', '.'));
    if (k >= 8 && k < 13) cands.push('C:Km 8 a 12.5');
    else if (k >= 13 && k < 17) cands.push('C:Km 13 a 16.5');
    else if (k >= 17 && k < 21) cands.push('C:Km 17 a 20.5');
    else if (k >= 21) cands.push('C:Km 21 en adelante');
  }
  // 2) Sectores y alias conocidos
  EXTRA_ALIAS.forEach(([re, id]) => { if (re.test(text)) cands.push(id); });
  // 3) "Zona N" (ignora "Zona 8 de Mixco")
  const zm = text.match(/zona (\d{1,2})(?! de mixco)/);
  if (zm) cands.push('M:Zona ' + zm[1], 'Z:Zona ' + zm[1]);
  // 4) Municipio
  const mun = norm(p.municipio);
  if (mun && mun !== 'guatemala' && mun !== 'ciudad de guatemala') {
    D.lugares.filter(l => l.clase === 'Municipio').forEach(l => {
      const ln = norm(l.nombre);
      if (ln === mun || (mun.length > 6 && (ln.endsWith(' ' + mun) || mun.includes(ln)))) cands.push(l.id);
    });
  }
  if (isCAES) cands.push('M:Carretera a El Salvador');
  if (/fraijanes/.test(text)) cands.push('M:Fraijanes');

  for (const id of cands) {
    const l = byId[id];
    // Muestra mínima: 10 anuncios del mismo tipo. Si no alcanza se prueba el
    // siguiente candidato (no se sube a macro-zonas genéricas "otros").
    if (l && l.tipos && l.tipos[tk] && l.tipos[tk].n >= 10) return { lugar: l, t: l.tipos[tk], tipo: tk };
  }
  return null;
}

// ── Traslado a Zona 10 ──────────────────────────────────────────────
function km(a, b) {
  const R = 6371, toR = x => x * Math.PI / 180;
  const dLat = toR(b.lat - a.lat), dLng = toR(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
// Centro aproximado de cada zona de comparación + tolerancia (km).
// Sirve para detectar coordenadas mal cargadas en el admin: si el pin cae
// lejos de la zona que dice el título, NO se calcula el traslado.
const CENTROIDS = {
  'M:Zona 10': [14.600, -90.508, 4], 'M:Zona 13': [14.580, -90.530, 4], 'M:Zona 14': [14.585, -90.513, 4],
  'M:Zona 15': [14.598, -90.490, 4], 'M:Zona 16': [14.612, -90.478, 5], 'S:Vista Hermosa': [14.600, -90.490, 3],
  'S:San Isidro': [14.610, -90.470, 4], 'S:Cayalá': [14.610, -90.488, 3], 'S:El Socorro': [14.585, -90.470, 4],
  'S:Santa Rosalía': [14.572, -90.462, 4], 'S:Hacienda Nueva': [14.540, -90.400, 5], 'S:Muxbal': [14.575, -90.475, 4],
  'C:Km 8 a 12.5': [14.565, -90.470, 4], 'C:Km 13 a 16.5': [14.540, -90.455, 5], 'C:Km 17 a 20.5': [14.515, -90.440, 5],
  'C:Km 21 en adelante': [14.485, -90.445, 8], 'M:Carretera a El Salvador': [14.530, -90.450, 14], 'M:Fraijanes': [14.480, -90.445, 10],
  'U:fraijanes': [14.480, -90.445, 10], 'U:santa catarina pinula': [14.570, -90.480, 7], 'M:San Cristóbal': [14.610, -90.590, 5],
  'U:mixco': [14.630, -90.610, 9], 'U:santa lucia milpas altas': [14.570, -90.680, 6],
};
function coordsSuspect(p, zone) {
  const lat = parseFloat(p.lat), lng = parseFloat(p.lng);
  if (!lat || !lng || !zone) return false;
  const c = CENTROIDS[zone.lugar.id];
  if (!c) return false;
  return km({ lat, lng }, { lat: c[0], lng: c[1] }) > c[2];
}
function commute(p, zone) {
  if (p.tiempoZona10) return { manual: String(p.tiempoZona10) };
  const lat = parseFloat(p.lat), lng = parseFloat(p.lng);
  if (!lat || !lng) return null;
  if (coordsSuspect(p, zone)) return null;
  const straight = km(Z10, { lat, lng });
  if (straight > 45) return { far: true, km: Math.round(straight) };
  const road = straight * 1.45;
  const r5 = x => Math.max(5, Math.round(x / 5) * 5);
  return {
    km: Math.round(road),
    valle: [r5(road / 38 * 60 + 4), r5(road / 30 * 60 + 6)],
    pico: [r5(road / 20 * 60 + 6), r5(road / 14 * 60 + 10)],
    maps: `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=Zona+Viva,+Zona+10,+Guatemala&travelmode=driving`,
    waze: `https://www.waze.com/ul?ll=14.5995,-90.5085&navigate=yes&from=ll.${lat},${lng}`,
  };
}

// ── Análisis completo ───────────────────────────────────────────────
function analyze(p) {
  const cfg = p.privConfig || {};
  if (p.esExclusiva || cfg.exclusiva || cfg.precio) return null;
  const pr = priceInfo(p);
  const tk = tipoKey(p);
  const zone = matchZone(p);
  const area = areaM2(p);
  const out = { price: pr, tipo: tk, zone, commute: commute(p, zone), area, coordsSuspect: coordsSuspect(p, zone) };

  if (pr && zone) {
    const [lo, mid, hi] = zone.t.precio;
    out.pricePos = pr.usd < lo ? 'bajo' : pr.usd > hi ? 'alto' : 'medio';
    out.priceRange = [lo, mid, hi];
    // US$/m²: solo si el área es creíble para el tipo y el valor no es absurdo
    if (zone.t.m2 && area >= 60 && (tk === 'Casa' || tk === 'Apartamento')) {
      const ppm = pr.usd / area;
      const [m25, , m75] = zone.t.m2;
      if (ppm > m25 * 0.45 && ppm < m75 * 1.8) {
        out.ppm = Math.round(ppm);
        out.ppmRange = zone.t.m2;
        out.ppmPos = ppm < m25 ? 'bajo' : ppm > m75 ? 'alto' : 'medio';
      }
    }
    if (zone.t.renta && zone.t.rend && (tk === 'Casa' || tk === 'Apartamento')) {
      out.renta = zone.t.renta; out.rend = zone.t.rend;
    }
  }

  // Ideal para
  const ideal = [];
  const habs = parseInt(p.habitaciones) || 0;
  const op = norm(p.operacion || p.cinta);
  if (tk === 'Finca') ideal.push('Patrimonio', 'Producción o desarrollo');
  else if (tk === 'Terreno') ideal.push('Construir a la medida', 'Patrimonio');
  else {
    if (habs >= 3) ideal.push('Vivir en familia');
    else if (habs >= 1) ideal.push('Pareja o profesional');
    if (out.rend && out.rend >= 0.055) ideal.push('Renta');
    if (/renta/.test(op) && !ideal.includes('Renta')) ideal.push('Renta');
    if (/playa|mar|chulamar|monterrico/.test(norm(p.titulo + ' ' + p.zona))) ideal.push('Descanso / segunda vivienda');
    if (/comercial|oficina|local/.test(norm(p.titulo))) ideal.push('Uso comercial');
  }
  out.ideal = ideal.slice(0, 3);

  // Puntos fuertes (de los datos cargados, sin adjetivos inventados)
  const chars = p.caracteristicas || [];
  const fuertes = [];
  if (Array.isArray(p.puntosFuertes) && p.puntosFuertes.length) fuertes.push(...p.puntosFuertes);
  else {
    const prio = ['Garita 24/7', 'Condominio cerrado', 'Piscina', 'Jardín amplio', 'Pozo propio', 'Vista al valle', 'Vista a montañas',
      'Entorno natural y vistas', 'Panel solar', 'Cuarto de servicio con baño', 'Estudio / Oficina', 'Papelería en orden',
      'Finca inscrita en Registro', 'Agua de nacimiento', 'Potencial de desarrollo', 'Disponibilidad inmediata'];
    prio.forEach(c => { if (chars.includes(c) && fuertes.length < 4) fuertes.push(c); });
    const parq = parseInt(p.parqueos) || 0;
    if (parq >= 3 && fuertes.length < 5) fuertes.push(parq + ' parqueos');
    if (out.pricePos === 'bajo' && fuertes.length < 5) fuertes.push('Precio por debajo del rango típico de la zona');
    if (norm(p.estadoConstruccion) === 'nueva' && fuertes.length < 5) fuertes.push('Construcción nueva');
  }
  out.fuertes = fuertes.slice(0, 5);

  // A considerar (honesto, verificable)
  const cons = [];
  if (p.aConsiderar) {
    String(p.aConsiderar).split('\n').map(s => s.trim()).filter(Boolean).forEach(s => cons.push(s));
  } else {
    const year = parseInt(p.anioConstruccion) || (p.antiguedad ? new Date().getFullYear() - parseInt(p.antiguedad) : 0);
    const age = year ? new Date().getFullYear() - year : 0;
    if (age >= 20) cons.push(`Construcción de ${year}: recomendamos inspección de instalaciones eléctricas, hidráulicas e impermeabilización.`);
    else if (norm(p.estadoConstruccion) === 'usada' && !year) cons.push('Propiedad usada: conviene una inspección técnica antes de ofertar.');
    if (out.pricePos === 'alto') cons.push('Precio por encima del rango típico de oferta en la zona: vale la pena revisar comparables y qué lo justifica.');
    if (out.pricePos === 'bajo') cons.push('Precio por debajo del rango típico: entender el motivo (estado, tamaño, ubicación exacta) antes de decidir.');
    if (out.commute && out.commute.pico && out.commute.pico[1] >= 60) cons.push('Trayecto largo a Zona 10 en hora pico: evalúa tu rutina de traslado.');
    if (chars.includes('Condominio cerrado') && !p.cuotaMant && !p.cuotaMantenimiento) cons.push('Confirmar cuota de mantenimiento del condominio.');
    if (tk === 'Finca' || tk === 'Terreno') cons.push('Verificar medida registral vs. medida física y acceso legal.');
    if (norm(p.estadoConstruccion) === 'nueva' && /preventa|planos/.test(norm(p.titulo))) cons.push('Venta en planos: revisar respaldo del desarrollador y plazos de entrega.');
  }
  out.considerar = cons.slice(0, 4);
  return out;
}

// ── Helpers de formato ──────────────────────────────────────────────
function fmtUSD(n) {
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(n >= 1e7 ? 0 : 2).replace(/\.?0+$/, '') + 'M';
  if (n >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
  return '$' + Math.round(n).toLocaleString('en-US');
}
function fmtQ(n) {
  if (n >= 1e6) return 'Q' + (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M';
  return 'Q' + Math.round(n / 1e3) + 'K';
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Barra de posición: rango P25–P75 con marcador
function bar(value, range, fmt) {
  const [lo, mid, hi] = range;
  const min = Math.min(lo * 0.55, value * 0.9), max = Math.max(hi * 1.45, value * 1.1);
  const pct = x => Math.max(0, Math.min(100, (x - min) / (max - min) * 100));
  return `<div class="za-bar"><div class="za-bar-track">
    <div class="za-bar-range" style="left:${pct(lo)}%;width:${pct(hi) - pct(lo)}%"></div>
    <div class="za-bar-mid" style="left:${pct(mid)}%"></div>
    <div class="za-bar-pin" style="left:${pct(value)}%"><span>${fmt(value)}</span></div>
  </div><div class="za-bar-legend"><span>${fmt(lo)}</span><span>Rango típico</span><span>${fmt(hi)}</span></div></div>`;
}

const POS_LABEL = { bajo: 'Por debajo del rango típico', medio: 'Dentro del rango típico', alto: 'Por encima del rango típico' };

const ICON = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
};

// Checklist de debida diligencia (estado real si el admin lo marca)
function docsChecklist(p) {
  const d = p.verificacion || {};
  const items = [
    ['escritura', 'Escritura y titularidad en el Registro de la Propiedad'],
    ['gravamenes', 'Libertad de gravámenes y anotaciones'],
    ['iusi', 'IUSI al día' + (p.iusi ? ` (${esc(p.iusi)})` : '')],
    ['servicios', 'Servicios (agua, luz) sin saldos pendientes'],
    ['medidas', 'Medidas registrales vs. medidas físicas'],
  ];
  return items.map(([k, l]) => {
    const ok = d[k] === true;
    return `<li class="${ok ? 'ok' : ''}"><span class="za-doc-ic">${ok ? ICON.check : ICON.doc}</span><span>${l}</span><em>${ok ? 'Verificado' : 'Se verifica antes de ofertar'}</em></li>`;
  }).join('');
}

function fichaAnalisis(p, a) {
  if (!a) return '';
  const D = loadZoneData();
  const blocks = [];
  const fechaD = D.fecha ? new Date(D.fecha + 'T12:00:00').toLocaleDateString('es-GT', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  // 1. Precio vs mercado
  if (a.zone && a.pricePos) {
    const sample = a.zone.t.n;
    let html = `<div class="za-block za-price">
      <div class="za-h">${ICON.target} Precio frente al mercado</div>
      <div class="za-verdict za-${a.pricePos}">${POS_LABEL[a.pricePos]}</div>
      <p class="za-p">Comparado con ${sample} ${a.zone.tipo === 'Casa' ? 'casas' : a.zone.tipo === 'Apartamento' ? 'apartamentos' : a.zone.tipo === 'Terreno' ? 'terrenos' : 'fincas'} en oferta en <strong>${esc(a.zone.lugar.nombre)}</strong>.</p>
      ${bar(a.price.usd, a.priceRange, fmtUSD)}`;
    if (a.ppm) {
      html += `<div class="za-sub">Precio por m² construido: <strong>$${a.ppm.toLocaleString('en-US')}/m²</strong> · rango típico $${a.ppmRange[0].toLocaleString('en-US')}–$${a.ppmRange[2].toLocaleString('en-US')}/m² <span class="za-pill za-${a.ppmPos}">${a.ppmPos === 'medio' ? 'en rango' : a.ppmPos === 'bajo' ? 'bajo el rango' : 'sobre el rango'}</span></div>`;
    }
    if (a.renta) {
      html += `<div class="za-sub">Renta típica en la zona: <strong>${fmtUSD(a.renta[0])}–${fmtUSD(a.renta[2])}/mes</strong> · rendimiento bruto típico <strong>${(a.rend * 100).toFixed(1)}%</strong> anual</div>`;
    }
    html += `<p class="za-note">Referencia basada en precios de oferta publicados (Índice Zona-INNmueble${fechaD ? ', ' + fechaD : ''}). No es un avalúo.</p></div>`;
    blocks.push(html);
  }

  // 2. Fuertes / considerar
  if (a.fuertes.length || a.considerar.length) {
    blocks.push(`<div class="za-block za-two">
      ${a.fuertes.length ? `<div><div class="za-h">${ICON.check} Puntos fuertes</div><ul class="za-list za-good">${a.fuertes.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>` : ''}
      ${a.considerar.length ? `<div><div class="za-h">${ICON.alert} A considerar</div><ul class="za-list za-warn">${a.considerar.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>` : ''}
    </div>`);
  }

  // 3. Ideal para + traslado
  const c = a.commute;
  let row = '';
  if (a.ideal.length) row += `<div><div class="za-h">${ICON.target} Ideal para</div><div class="za-tags">${a.ideal.map(i => `<span>${esc(i)}</span>`).join('')}</div></div>`;
  if (c && c.manual) row += `<div><div class="za-h">${ICON.clock} Traslado a Zona 10</div><div class="za-commute"><strong>${esc(c.manual)}</strong></div></div>`;
  else if (c && c.far) row += `<div><div class="za-h">${ICON.clock} Ubicación</div><div class="za-commute">A ~${c.km} km en línea recta de la Ciudad de Guatemala</div></div>`;
  else if (c) row += `<div><div class="za-h">${ICON.clock} Traslado a Zona 10 (estimado)</div>
      <div class="za-commute"><div><span>Fuera de hora pico</span><strong>${c.valle[0] === c.valle[1] ? c.valle[0] : c.valle[0] + '–' + c.valle[1]} min</strong></div><div><span>Hora pico</span><strong>${c.pico[0]}–${c.pico[1]} min</strong></div></div>
      <div class="za-links"><a href="${c.maps}" target="_blank" rel="noopener">Ver ruta en Google Maps</a><a href="${c.waze}" target="_blank" rel="noopener">Abrir en Waze</a></div></div>`;
  if (row) blocks.push(`<div class="za-block za-two">${row}</div>`);

  // 4. Debida diligencia
  blocks.push(`<div class="za-block"><div class="za-h">${ICON.doc} Debida diligencia</div>
    <ul class="za-docs">${docsChecklist(p)}</ul>
    <p class="za-note">Revisamos estos puntos contigo antes de cualquier oferta. No se trata de vender por vender.</p></div>`);

  return `<section class="za-ficha" id="analisis">
    <div class="za-head"><div><div class="za-ey">Ficha de análisis Zona-INNmueble</div><h2 class="za-title">Lo que conviene saber <em>antes de decidir</em></h2></div></div>
    ${blocks.join('')}
  </section>`;
}

// Etiqueta corta para tarjetas
function cardTag(a) {
  if (!a || !a.pricePos) return '';
  const t = { bajo: 'Bajo rango de zona', medio: 'En rango de zona', alto: 'Sobre rango de zona' }[a.pricePos];
  return `<span class="pc-za pc-za-${a.pricePos}" title="Comparado con el Índice Zona-INNmueble">${t}</span>`;
}

// Resumen por zona para home / índice
const HOME_ZONES = [
  ['M:Zona 10', '/zonas/zona-10.html', 'Corazón financiero y de servicios'],
  ['M:Zona 14', '/zonas/zona-14.html', 'Residencial consolidado, alta demanda'],
  ['M:Zona 15', '/zonas/zona-15.html', 'Vista Hermosa, perfil familiar'],
  ['M:Zona 16', '/zonas/zona-16.html', 'Cayalá, San Isidro y naturaleza'],
  ['M:Carretera a El Salvador', '/zonas/carretera-el-salvador.html', 'Condominios del Km 8 al 25'],
  ['M:Fraijanes', '/zonas/fraijanes.html', 'Clima, espacio y precio de entrada'],
];
function zoneSummaries(ids) {
  const D = loadZoneData();
  const byId = {}; D.lugares.forEach(l => { byId[l.id] = l; });
  return (ids || HOME_ZONES).map(([id, href, sub]) => {
    const l = byId[id]; if (!l) return null;
    const c = l.tipos.Casa || l.tipos.Apartamento; const ap = l.tipos.Apartamento;
    return { id, nombre: l.nombre, href, sub, casa: l.tipos.Casa, apto: ap, terreno: l.tipos.Terreno, main: c };
  }).filter(Boolean);
}

function zoneTitle(l, byId) {
  if (l.clase === 'Tramo' && l.padre && byId[l.padre] && l.nombre.indexOf(byId[l.padre].nombre) < 0) return byId[l.padre].nombre + ', ' + l.nombre;
  if (l.clase === 'Municipio') return l.nombre.replace(/(^|\s)([a-záéíóúñ])/g, (m, a, c) => a + c.toUpperCase());
  return l.nombre;
}
function zoneSlugOf(l, byId) {
  return zoneTitle(l, byId).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
module.exports = { zoneTitle, zoneSlugOf, loadZoneData, analyze, fichaAnalisis, cardTag, zoneSummaries, fmtUSD, fmtQ, priceInfo, tipoKey, matchZone, HOME_ZONES, RATE };
