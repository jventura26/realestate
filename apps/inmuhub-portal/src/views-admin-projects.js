// Panel: proyectos nuevos, desarrolladoras y reporte mensual.
import { html, raw, formatMoney, formatNumber, parseJsonArray } from './html.js';
import { layout } from './views.js';
import { KIND_LABELS, STAGE_LABELS } from './views-projects.js';

const STATUS = { borrador: 'Borrador', publicado: 'Publicado', pausado: 'Pausado', vendido: 'Vendido' };
const PLAN = { prueba: 'Prueba sin costo', proyecto: 'Proyecto', destacado: 'Destacado', pausado: 'Pausado' };
const opt = (value, label, current) => html`<option value="${value}"${String(current ?? '') === String(value) ? raw(' selected') : ''}>${label}</option>`;

export function adminProjectsPage(env, { projects, developers, notice, editDeveloper }) {
  const d = editDeveloper || {};
  const body = html`
<section class="wrap section admin">
  <div class="section-head">
    <div><a class="small" href="/admin">← Panel de propiedades</a><h1 class="display-sm">Proyectos nuevos</h1></div>
    <form method="post" action="/admin/proyectos/nuevo"><button class="btn btn-primary btn-sm" type="submit">Nuevo proyecto</button></form>
  </div>
  ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}

  <div class="table-wrap"><table>
    <thead><tr><th>Proyecto</th><th>Desarrolladora</th><th>Zona</th><th>Desde</th><th>Visitas 30 d</th><th>Consultas 30 d</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>${projects.length ? projects.map((j) => html`<tr>
      <td><strong>${j.name}</strong><br><span class="small muted">${KIND_LABELS[j.kind]} · ${STAGE_LABELS[j.stage]}${j.images === '[]' ? ' · sin fotos' : ''}</span></td>
      <td>${j.developer_name || html`<em class="muted">sin asignar</em>`}</td>
      <td>${j.zone_name || '—'}</td>
      <td>${j.price_from ? formatMoney(j.price_from, j.currency) : '—'}</td>
      <td>${formatNumber(j.views_30d)}</td>
      <td>${formatNumber(j.leads_30d)} <span class="small muted">(${formatNumber(j.leads_total)} total)</span></td>
      <td><span class="status${j.status === 'publicado' ? ' status-publicada' : ''}">${STATUS[j.status]}</span>${j.featured_until && new Date(j.featured_until.replace(' ', 'T') + 'Z') > new Date() ? html` <span class="status status-revision">Destacado</span>` : ''}</td>
      <td><form class="row-actions" method="post" action="/admin/proyecto/${j.id}/accion">
        <a class="btn btn-primary btn-xs" href="/admin/proyecto/${j.id}/editar">Editar</a>
        <a class="btn btn-outline btn-xs" href="/admin/proyecto/${j.id}/reporte">Reporte</a>
        ${j.status === 'publicado'
          ? html`<a class="btn btn-outline btn-xs" href="/proyecto/${j.slug}" target="_blank">Ver</a>
            <button class="btn btn-outline btn-xs" name="accion" value="destacar">Destacar 30 días</button>
            <button class="btn btn-outline btn-xs" name="accion" value="pausar">Pausar</button>
            <button class="btn btn-outline btn-xs" name="accion" value="vendido">Vendido</button>`
          : html`<button class="btn btn-outline btn-xs" name="accion" value="publicar">Publicar</button>`}
      </form></td>
    </tr>`) : html`<tr><td colspan="8" class="muted">Aún no hay proyectos. Cree el primero con «Nuevo proyecto».</td></tr>`}</tbody>
  </table></div>

  <h2>Desarrolladoras</h2>
  <div class="table-wrap"><table>
    <thead><tr><th>Desarrolladora</th><th>Contacto</th><th>Plan</th><th>Prueba hasta</th><th>Proyectos publicados</th><th></th></tr></thead>
    <tbody>${developers.length ? developers.map((x) => html`<tr>
      <td><strong>${x.name}</strong>${x.website ? html`<br><a class="small" href="${x.website}" target="_blank" rel="noopener">${x.website}</a>` : ''}</td>
      <td class="small">${x.contact_name || ''}${x.whatsapp ? html`<br><a href="https://wa.me/${x.whatsapp}" target="_blank" rel="noopener">+${x.whatsapp}</a>` : ''}${x.email ? html`<br>${x.email}` : ''}</td>
      <td>${PLAN[x.plan]}</td>
      <td class="small">${x.trial_until || '—'}</td>
      <td>${x.projects_live}</td>
      <td><a class="btn btn-outline btn-xs" href="/admin/proyectos?desarrolladora=${x.id}#desarrolladora">Editar</a></td>
    </tr>`) : html`<tr><td colspan="6" class="muted">Aún no hay desarrolladoras registradas.</td></tr>`}</tbody>
  </table></div>

  <form class="form-card form-wide" method="post" action="/admin/desarrolladora" id="desarrolladora">
    <h2>${d.id ? `Editar ${d.name}` : 'Agregar desarrolladora'}</h2>
    ${d.id ? html`<input type="hidden" name="id" value="${d.id}">` : ''}
    <div class="grid-2">
      <label>Nombre<input type="text" name="name" maxlength="120" value="${d.name || ''}" required></label>
      <label>Persona de contacto (no se publica)<input type="text" name="contact_name" maxlength="120" value="${d.contact_name || ''}"></label>
      <label>WhatsApp de la sala de ventas<input type="tel" name="whatsapp" maxlength="20" value="${d.whatsapp || ''}" placeholder="+502"></label>
      <label>Correo<input type="email" name="email" maxlength="120" value="${d.email || ''}"></label>
      <label>Sitio web<input type="url" name="website" maxlength="200" value="${d.website || ''}" placeholder="https://"></label>
      <label>Plan<select name="plan">${Object.entries(PLAN).map(([k, l]) => opt(k, l, d.plan || 'prueba'))}</select></label>
      <label>Prueba sin costo hasta<input type="text" name="trial_until" maxlength="10" value="${d.trial_until || ''}" placeholder="AAAA-MM-DD"></label>
    </div>
    <label>Notas internas<textarea name="notes" rows="3" maxlength="1000">${d.notes || ''}</textarea></label>
    <p class="small muted">Las consultas de sus proyectos se envían al WhatsApp de la sala de ventas. Si está vacío, llegan al WhatsApp de inmuhub.</p>
    <div class="row-actions"><button class="btn btn-primary" type="submit">${d.id ? 'Guardar cambios' : 'Agregar desarrolladora'}</button>${d.id ? html`<a class="btn btn-outline" href="/admin/proyectos">Cancelar</a>` : ''}</div>
  </form>
</section>`;
  return layout(env, { title: 'Proyectos · Administración', body, noindex: true });
}

export function adminProjectEditPage(env, { j, zones, developers, notice, error }) {
  const images = parseJsonArray(j.images);
  const typologies = parseJsonArray(j.typologies);
  const rows = [...typologies, ...Array.from({ length: Math.max(0, 8 - typologies.length) }, () => ({}))].slice(0, 12);
  const v = (k) => j[k] ?? '';
  const num = (k) => (j[k] ? formatNumber(j[k], 2) : '');
  const photoAction = (accion, label) => html`<button class="btn btn-outline btn-xs" name="accion" value="${accion}">${label}</button>`;
  const body = html`
<section class="wrap section admin">
  <div class="section-head"><div>
    <a class="small" href="/admin/proyectos">← Proyectos</a>
    <h1 class="display-sm">${j.name}</h1>
    <span class="small muted">${j.slug} · ${STATUS[j.status]}${j.status === 'publicado' ? html` · <a href="/proyecto/${j.slug}" target="_blank" rel="noopener">Ver ficha</a>` : ''}</span>
  </div></div>
  ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}
  ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}

  <form class="form-card form-wide" method="post" action="/admin/proyecto/${j.id}/guardar">
    <fieldset><legend>Proyecto</legend>
      <label>Nombre del proyecto<input type="text" name="name" maxlength="120" value="${v('name')}" required></label>
      <div class="grid-2">
        <label>Desarrolladora<select name="developer_id">${opt('', 'Sin asignar', j.developer_id)}${developers.map((d) => opt(d.id, d.name, j.developer_id))}</select></label>
        <label>Tipo<select name="kind">${Object.entries(KIND_LABELS).map(([k, l]) => opt(k, l, j.kind))}</select></label>
        <label>Etapa<select name="stage">${Object.entries(STAGE_LABELS).map(([k, l]) => opt(k, l, j.stage))}</select></label>
        <label>Entrega estimada<input type="text" name="delivery" maxlength="60" value="${v('delivery')}" placeholder="Ej. segundo semestre 2028"></label>
        <label>Zona<select name="zone_slug">${opt('', 'Sin zona', j.zone_slug)}${zones.map((z) => opt(z.slug, z.name, j.zone_slug))}</select></label>
        <label>Ubicación<input type="text" name="location_label" maxlength="140" value="${v('location_label')}" placeholder="Ej. Vista Hermosa II"></label>
      </div>
    </fieldset>
    <fieldset><legend>Precio y áreas</legend>
      <div class="grid-2">
        <label>Moneda<select name="currency">${opt('USD', 'Dólares', j.currency)}${opt('GTQ', 'Quetzales', j.currency)}</select></label>
        <label>Precio desde<input type="text" name="price_from" inputmode="decimal" maxlength="20" value="${num('price_from')}"></label>
        <label>m² desde<input type="text" name="m2_from" inputmode="decimal" maxlength="10" value="${v('m2_from')}"></label>
        <label>m² hasta<input type="text" name="m2_to" inputmode="decimal" maxlength="10" value="${v('m2_to')}"></label>
        <label>Habitaciones desde<input type="number" name="bedrooms_min" min="0" max="10" value="${v('bedrooms_min')}"></label>
        <label>Habitaciones hasta<input type="number" name="bedrooms_max" min="0" max="10" value="${v('bedrooms_max')}"></label>
        <label>Unidades totales<input type="number" name="units_total" min="0" max="5000" value="${v('units_total')}"></label>
        <label>Unidades disponibles<input type="number" name="units_available" min="0" max="5000" value="${v('units_available')}"></label>
      </div>
      <label>Enganche y forma de pago<input type="text" name="down_payment" maxlength="160" value="${v('down_payment')}" placeholder="Ej. Enganche desde 10 % en 24 cuotas sin intereses"></label>
      <p class="small muted">Si deja vacíos «Precio desde» y las áreas, se calculan de las tipologías.</p>
    </fieldset>
    <fieldset><legend>Tipologías</legend>
      <div class="table-wrap"><table class="typo-edit">
        <thead><tr><th>Nombre</th><th>Hab.</th><th>Baños</th><th>m²</th><th>Precio</th></tr></thead>
        <tbody>${rows.map((t, i) => html`<tr>
          <td><input type="text" name="t${i}_name" maxlength="60" value="${t.name || ''}" placeholder="Tipo ${String.fromCharCode(65 + i)}" aria-label="Nombre de la tipología ${i + 1}"></td>
          <td><input type="text" name="t${i}_bedrooms" inputmode="numeric" maxlength="2" value="${t.bedrooms ?? ''}" aria-label="Habitaciones"></td>
          <td><input type="text" name="t${i}_bathrooms" inputmode="decimal" maxlength="4" value="${t.bathrooms ?? ''}" aria-label="Baños"></td>
          <td><input type="text" name="t${i}_m2" inputmode="decimal" maxlength="8" value="${t.m2 ?? ''}" aria-label="Metros cuadrados"></td>
          <td><input type="text" name="t${i}_price" inputmode="decimal" maxlength="14" value="${t.price ? formatNumber(t.price) : ''}" aria-label="Precio"></td>
        </tr>`)}</tbody>
      </table></div>
      <input type="hidden" name="t_count" value="${rows.length}">
      <p class="small muted">Las tipologías con precio y m² definen la lectura de precio por m² frente a la zona.</p>
    </fieldset>
    <fieldset><legend>Contenido</legend>
      <label>Descripción<textarea name="description" rows="14" maxlength="6000">${v('description')}</textarea></label>
      <p class="small muted">Párrafos separados por una línea en blanco. «## Título» crea una sección y «- texto» un punto de lista.</p>
      <label>Amenidades (separadas por coma)<input type="text" name="amenities" maxlength="1500" value="${parseJsonArray(j.amenities).join(', ')}"></label>
      <div class="grid-2">
        <label>Brochure (enlace)<input type="url" name="brochure_url" maxlength="500" value="${v('brochure_url')}" placeholder="https://"></label>
        <label>Video (enlace)<input type="url" name="video_url" maxlength="500" value="${v('video_url')}" placeholder="https://"></label>
        <label>Recorrido 360° (enlace)<input type="url" name="tour_url" maxlength="500" value="${v('tour_url')}" placeholder="https://"></label>
        <label>Contacto en la ficha<select name="contact_mode">${opt('whatsapp', 'Formulario que abre WhatsApp de la sala de ventas', j.contact_mode)}${opt('formulario', 'Formulario (consulta queda en el panel)', j.contact_mode)}${opt('ninguno', 'Sin contacto', j.contact_mode)}</select></label>
      </div>
    </fieldset>
    <button class="btn btn-primary" type="submit">Guardar proyecto</button>
  </form>

  <h2>Imágenes</h2>
  <p class="small muted">La primera es la principal. En preventa puede usar renders; la ficha lo aclara.</p>
  ${images.length
    ? html`<div class="photo-grid">${images.map((src, i) => html`<figure class="photo"><img src="${src}" alt="Imagen ${i + 1}" loading="lazy"><figcaption>
      <span class="small">${i === 0 ? 'Principal' : `Imagen ${i + 1}`}</span>
      <form class="row-actions" method="post" action="/admin/proyecto/${j.id}/foto"><input type="hidden" name="i" value="${i}">
        ${i > 0 ? photoAction('principal', 'Hacer principal') : ''}${i > 0 ? photoAction('subir', '↑') : ''}${i < images.length - 1 ? photoAction('bajar', '↓') : ''}${photoAction('quitar', 'Quitar')}
      </form></figcaption></figure>`)}</div>`
    : html`<p class="muted">Aún no hay imágenes.</p>`}
  <form class="form-card" method="post" action="/admin/proyecto/${j.id}/fotos" enctype="multipart/form-data" data-upload>
    <label>Agregar imágenes (JPG, PNG o WebP)<input type="file" name="fotos" accept="image/jpeg,image/png,image/webp" multiple data-max="20" required></label>
    <div class="upload-preview" data-upload-preview></div>
    <button class="btn btn-primary" type="submit">Subir imágenes</button>
    <p class="small muted" data-upload-msg>Se optimizan automáticamente (máx. 1920 px).</p>
  </form>
</section>`;
  return layout(env, { title: `Editar · ${j.name}`, body, noindex: true, scripts: ['/upload.js'] });
}

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function monthLabel(month) {
  const [y, m] = month.split('-').map(Number);
  return `${MONTHS[m - 1]} de ${y}`;
}

export function adminProjectReportPage(env, { j, month, months, report }) {
  const byIntent = report.leads.reduce((acc, l) => ((acc[l.intent || 'sin dato'] = (acc[l.intent || 'sin dato'] || 0) + 1), acc), {});
  const bySource = report.leads.reduce((acc, l) => {
    const k = l.utm_campaign || l.utm_source || 'Directo / orgánico';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const rate = report.views ? ((report.leads.length / report.views) * 100).toFixed(1) : null;
  const [yy, mm] = month.split('-').map(Number);
  const byDay = new Map(report.daily.map((d) => [d.day, d.views]));
  const days = Array.from({ length: new Date(Date.UTC(yy, mm, 0)).getUTCDate() }, (_, i) => {
    const day = `${month}-${String(i + 1).padStart(2, '0')}`;
    return { day, views: byDay.get(day) || 0 };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.views));
  const body = html`
<section class="wrap section admin report">
  <div class="section-head no-print">
    <div><a class="small" href="/admin/proyectos">← Proyectos</a></div>
    <form class="row-actions" method="get"><label class="sr">Mes<select name="mes" onchange="this.form.submit()">${months.map((m) => html`<option value="${m}"${m === month ? raw(' selected') : ''}>${monthLabel(m)}</option>`)}</select></label>
    <button class="btn btn-outline btn-sm" type="button" onclick="window.print()">Imprimir o guardar PDF</button></form>
  </div>
  <div class="report-head">
    <div class="eyebrow">Reporte mensual · inmuhub</div>
    <h1 class="display-sm">${j.name}</h1>
    <p class="muted">${j.developer_name ? `${j.developer_name} · ` : ''}${monthLabel(month)}</p>
  </div>
  <div class="kpis">
    <div><span>Visitas a la ficha</span><strong>${formatNumber(report.views)}</strong></div>
    <div><span>Consultas</span><strong>${formatNumber(report.leads.length)}</strong></div>
    <div><span>Consultas por cada 100 visitas</span><strong>${rate ?? '—'}</strong></div>
    <div><span>Para invertir</span><strong>${formatNumber(byIntent.invertir || 0)}</strong></div>
  </div>
  ${report.views ? html`<div class="report-chart" role="img" aria-label="Visitas por día del mes">${days.map((d) => html`<span style="height:${d.views ? Math.max(4, (d.views / maxDay) * 100).toFixed(0) : 1}%" title="${d.day}: ${d.views}"></span>`)}</div><p class="small muted">Visitas por día del mes</p>` : ''}
  <div class="split">
    <div class="panel"><h3>Origen de las consultas</h3>${Object.keys(bySource).length ? html`<ul class="desc-list">${Object.entries(bySource).map(([k, n]) => html`<li>${k}: <strong>${n}</strong></li>`)}</ul>` : html`<p class="muted">Sin consultas este mes.</p>`}</div>
    <div class="panel"><h3>Intención</h3>${Object.keys(byIntent).length ? html`<ul class="desc-list">${Object.entries(byIntent).map(([k, n]) => html`<li>${k}: <strong>${n}</strong></li>`)}</ul>` : html`<p class="muted">Sin consultas este mes.</p>`}</div>
  </div>
  <h2>Consultas del mes</h2>
  <div class="table-wrap"><table>
    <thead><tr><th>Fecha</th><th>Nombre</th><th>WhatsApp</th><th>Tipología</th><th>Intención</th><th>Origen</th></tr></thead>
    <tbody>${report.leads.length ? report.leads.map((l) => html`<tr><td class="small">${l.created_at.slice(0, 16)}</td><td>${l.name || '—'}</td><td>+${l.whatsapp}</td><td>${l.message || '—'}</td><td>${l.intent || '—'}</td><td class="small">${[l.utm_source, l.utm_campaign].filter(Boolean).join(' / ') || 'Directo'}</td></tr>`) : html`<tr><td colspan="6" class="muted">Sin consultas este mes.</td></tr>`}</tbody>
  </table></div>
  <p class="small muted">Visitas: aperturas de la ficha del proyecto en inmuhub.com (sin contar robots conocidos). Consultas: formularios enviados desde la ficha.</p>
</section>`;
  return layout(env, { title: `Reporte · ${j.name}`, body, noindex: true });
}
