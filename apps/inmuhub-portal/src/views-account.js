// Páginas de cuentas: ingresar, crear cuenta, mi cuenta y gestión en /admin/cuentas.
import { html, raw, formatMoney } from './html.js';
import { layout, CHECK, STATUS_LABEL } from './views.js';

export const ROLE = { comprador: 'Comprador', propietario: 'Propietario', asesor: 'Asesor inmobiliario' };
const ACC_STATUS = { activa: 'Activa', pendiente: 'En revisión', suspendida: 'Suspendida' };

function roleCards(selected, next = '') {
  const q = next ? `&next=${encodeURIComponent(next)}` : '';
  const card = (role, title, text) => html`
    <a class="role-card${selected === role ? raw(' is-on') : ''}" href="/registro?tipo=${role}${raw(q)}">
      <strong>${title}</strong><span class="small muted">${text}</span>
    </a>`;
  return html`<div class="role-cards role-cards-3">
    ${card('comprador', 'Busco propiedad', 'Accedo al inventario completo, a la lectura de valor y a la búsqueda asistida.')}
    ${card('propietario', 'Soy propietario', 'Publico mi casa, apartamento, terreno o finca y sigo su revisión.')}
    ${card('asesor', 'Soy asesor', 'Publico el inventario de mis clientes y comparto fichas con colegas.')}
  </div>`;
}

export function loginPage(env, { error, email = '', next = '', notice, intro }) {
  const body = html`
<section class="wrap section narrow auth">
  <div class="eyebrow">Mi cuenta</div>
  <h1 class="display-md">Ingresar a inmuhub</h1>
  <p class="lead">${intro || 'Compradores, propietarios y asesores ingresan con su correo para ver el inventario completo, publicar y dar seguimiento a cada propiedad.'}</p>
  <form class="form-card" method="post" action="/ingresar">
    ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}
    ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
    <input type="hidden" name="next" value="${next}">
    <label>Correo<input type="email" name="correo" autocomplete="email" maxlength="120" value="${email}" required></label>
    <label>Contraseña<input type="password" name="clave" autocomplete="current-password" maxlength="200" required></label>
    <button class="btn btn-primary btn-block" type="submit">Ingresar</button>
    <p class="small"><a href="/recuperar">¿Olvidó su contraseña?</a></p>
  </form>
  <div class="auth-alt">
    <h2 class="display-sm">¿Aún no tiene cuenta?</h2>
    ${roleCards('', next)}
  </div>
</section>`;
  return layout(env, { title: 'Ingresar', path: '/ingresar', body, noindex: true });
}

const REGISTER_COPY = {
  comprador: ['Cuenta de comprador', 'Acceda al inventario completo de propiedades revisadas, a la lectura de valor de cada una y a la búsqueda asistida. La cuenta es gratuita.'],
  propietario: ['Cuenta de propietario', 'Publique su propiedad y vea en qué etapa está: revisión, publicada y consultas recibidas.'],
  asesor: ['Cuenta de asesor', 'Publique el inventario de sus clientes con lectura de valor, comparta fichas en la red de asesores y siga cada propiedad desde su panel. Revisamos cada cuenta de asesor antes de activarla.'],
};

export function registerPage(env, { role = 'comprador', values = {}, error, next = '' }) {
  const v = (k) => values[k] ?? '';
  const asesor = role === 'asesor';
  const [heading, intro] = REGISTER_COPY[role] || REGISTER_COPY.comprador;
  const body = html`
<section class="wrap section narrow auth">
  <div class="eyebrow">Crear cuenta</div>
  <h1 class="display-md">${heading}</h1>
  <p class="lead">${intro}</p>
  ${roleCards(role, next)}
  <form class="form-card" method="post" action="/registro">
    <input type="hidden" name="next" value="${next}">
    ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
    <input type="hidden" name="tipo" value="${role}">
    <div class="hp" aria-hidden="true"><label>No llenar<input type="text" name="empresa_web" tabindex="-1" autocomplete="off"></label></div>
    <div class="grid-2">
      <label>Nombre completo<input type="text" name="nombre" autocomplete="name" maxlength="80" value="${v('nombre')}" required></label>
      <label>WhatsApp<input type="tel" name="whatsapp" autocomplete="tel" inputmode="tel" placeholder="+502" maxlength="20" value="${v('whatsapp')}" required></label>
    </div>
    ${asesor ? html`<label>Inmobiliaria o marca (opcional)<input type="text" name="empresa" maxlength="80" value="${v('empresa')}"></label>` : ''}
    <label>Correo<input type="email" name="correo" autocomplete="email" maxlength="120" value="${v('correo')}" required></label>
    <label>Contraseña<input type="password" name="clave" autocomplete="new-password" minlength="8" maxlength="200" required></label>
    <p class="small muted">Mínimo 8 caracteres.</p>
    <button class="btn btn-primary btn-block" type="submit">Crear cuenta</button>
    <p class="small muted">¿Ya tiene cuenta? <a href="/ingresar${next ? raw('?next=' + encodeURIComponent(next)) : ''}">Ingresar</a></p>
    <p class="small muted form-legal">Al crear su cuenta acepta el <a href="/privacidad">aviso de privacidad</a>. Su correo y WhatsApp no se publican.</p>
  </form>
</section>`;
  return layout(env, { title: heading, path: '/registro', body, noindex: true });
}

function searchesBlock(searches = [], matches = []) {
  return html`<h2 id="busquedas">Búsquedas guardadas</h2>
  ${matches.length ? html`<div class="panel matches">
    <div class="eyebrow">Novedades para usted</div>
    <ul>${matches.map((m) => html`<li${m.seen_at ? '' : raw(' class="is-new"')}><a href="/propiedad/${m.slug}"><strong>${m.title}</strong></a><span class="small muted">${m.zone_name || ''} · ${formatMoney(m.price_amount, m.currency)}${m.seen_at ? '' : ' · Nueva'}</span></li>`)}</ul>
  </div>` : ''}
  ${searches.length
    ? html`<ul class="search-list">${searches.map((x) => html`<li><a href="${x.url}">${x.label}</a>
        <form method="post" action="/busqueda/${x.id}/borrar"><button class="btn btn-outline btn-xs" type="submit">Quitar</button></form></li>`)}</ul>`
    : html`<p class="muted">Aún no tiene búsquedas guardadas. En <a href="/propiedades">Propiedades</a>, filtre por zona, tipo y presupuesto y pulse «Guardar búsqueda»: le avisamos aquí cuando entre una propiedad que coincida.</p>`}`;
}

function favoritesBlock(favs = []) {
  return html`<h2>Guardadas</h2>
  ${favs.length
    ? html`<div class="table-wrap"><table>
      <thead><tr><th>Propiedad</th><th>Precio</th><th></th></tr></thead>
      <tbody>${favs.map((p) => html`<tr>
        <td><strong>${p.title}</strong><br><span class="small muted">${p.zone_name || ''}</span></td>
        <td>${formatMoney(p.price_amount, p.currency)}</td>
        <td><a class="btn btn-outline btn-xs" href="/propiedad/${p.slug}">Ver ficha</a></td>
      </tr>`)}</tbody></table></div>`
    : html`<p class="muted">Aún no ha guardado propiedades. En cada ficha encontrará el botón «Guardar».</p>`}`;
}

export function accountPage(env, { account, props, notice, favs = [], searches = [], matches = [] }) {
  if (account.role === 'comprador' && !props.length) return buyerAccountPage(env, { account, notice, favs, searches, matches });
  const asesor = account.role === 'asesor';
  const pending = account.status === 'pendiente';
  const body = html`
<section class="wrap section account">
  <div class="section-head">
    <div>
      <div class="eyebrow">${ROLE[account.role]}${account.company ? ` · ${account.company}` : ''}</div>
      <h1 class="display-sm">Hola, ${account.name.split(' ')[0]}</h1>
    </div>
    <div class="row-actions">
      <a class="btn btn-primary btn-sm" href="/publicar">Publicar propiedad</a>
      <form method="post" action="/salir"><button class="btn btn-outline btn-sm" type="submit">Salir</button></form>
    </div>
  </div>
  ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}
  ${pending ? html`<p class="notice" role="status">Su cuenta de asesor está en revisión. Ya puede enviar propiedades; las publicamos cuando confirmemos su cuenta.</p>` : ''}

  <div class="kpis">
    <div><span>Propiedades</span><strong>${props.length}</strong></div>
    <div><span>Publicadas</span><strong>${props.filter((p) => p.status === 'publicada').length}</strong></div>
    <div><span>En revisión</span><strong>${props.filter((p) => p.status === 'revision').length}</strong></div>
    <div><span>Visitas (30 días)</span><strong>${props.reduce((n, p) => n + (p.views30 || 0), 0)}</strong></div>
    <div><span>Consultas (30 días)</span><strong>${props.reduce((n, p) => n + (p.leads30 || 0), 0)}</strong></div>
  </div>

  ${favs.length ? favoritesBlock(favs) : ''}
  ${searches.length || matches.length ? searchesBlock(searches, matches) : ''}

  <h2>Mis propiedades</h2>
  ${props.some((p) => p.status === 'publicada') ? html`<p class="small muted">Visitas: personas que abrieron la ficha (sin contar buscadores). Guardada: cuántas personas la tienen en favoritos.</p>` : ''}
  ${props.length
    ? html`<div class="table-wrap"><table>
      <thead><tr><th>Propiedad</th><th>Precio</th><th>Estado</th><th>Visitas<br><span class="small muted">30 días · total</span></th><th>Guardada</th><th>Consultas<br><span class="small muted">30 días · total</span></th><th></th></tr></thead>
      <tbody>${props.map((p) => html`<tr>
        <td><strong>${p.title}</strong><br><span class="small muted">${p.zone_name || ''} · Ref. IH-${String(p.id).padStart(4, '0')}</span>
          ${p.status === 'rechazada' && p.review_notes ? html`<br><span class="small">Observación: ${p.review_notes}</span>` : ''}</td>
        <td>${formatMoney(p.price_amount, p.currency)}</td>
        <td><span class="status status-${p.status}">${STATUS_LABEL[p.status] || p.status}</span></td>
        <td>${p.status === 'publicada' ? html`<strong>${p.views30 || 0}</strong> · ${p.views_total || 0}` : '—'}</td>
        <td>${p.saves || 0}</td>
        <td><strong>${p.leads30 || 0}</strong> · ${p.leads || 0}</td>
        <td>${p.status === 'publicada' ? html`<a class="btn btn-outline btn-xs" href="/propiedad/${p.slug}" target="_blank" rel="noopener">Ver ficha</a>` : ''}</td>
      </tr>`)}</tbody></table></div>`
    : html`<div class="panel">
        <h3 class="display-sm">Aún no tiene propiedades</h3>
        <p class="muted">Publique la primera: la revisamos, le compartimos la lectura de valor de su zona y le avisamos por WhatsApp cuando esté en línea.</p>
        <a class="btn btn-primary" href="/publicar">Publicar mi primera propiedad</a>
      </div>`}

  <div class="split">
    <div class="panel">
      <div class="eyebrow">Cómo funciona</div>
      <ul class="checks">
        <li>${CHECK}Cada propiedad pasa por revisión antes de publicarse.</li>
        <li>${CHECK}La ficha muestra cómo se compara su precio con el valor de la zona.</li>
        <li>${CHECK}${asesor ? 'Las consultas llegan identificadas con la propiedad.' : 'Le avisamos por WhatsApp de cada consulta seria.'}</li>
      </ul>
    </div>
    <div class="panel">
      <div class="eyebrow">Sus datos</div>
      <p class="small">${account.email}<br>${account.whatsapp ? `+${account.whatsapp}` : ''}</p>
      <p class="small muted">Para cambiar su contraseña use <a href="/recuperar">este enlace</a>. Para cambiar sus datos, escríbanos por WhatsApp.</p>
    </div>
  </div>
</section>`;
  return layout(env, { title: 'Mi cuenta', path: '/mi-cuenta', body, noindex: true });
}

export function adminAlertsPage(env, { items }) {
  const body = html`
<section class="wrap section admin">
  <div class="section-head"><h1 class="display-sm">Alertas por enviar</h1><a class="btn btn-outline btn-sm" href="/admin">Volver al panel</a></div>
  <p class="muted">Propiedades publicadas que coinciden con búsquedas guardadas y que la persona aún no ha visto en su cuenta. ${env.RESEND_API_KEY ? 'También se envían por correo automáticamente.' : 'El aviso por correo se activa al conectar Resend.'}</p>
  ${items.length
    ? html`<div class="table-wrap"><table>
      <thead><tr><th>Persona</th><th>Propiedad</th><th>Desde</th><th></th></tr></thead>
      <tbody>${items.map((m) => html`<tr>
        <td><strong>${m.name}</strong><br><span class="small muted">+${m.whatsapp}</span></td>
        <td><a href="/propiedad/${m.slug}" target="_blank" rel="noopener">${m.title}</a><br><span class="small muted">${m.zone_name || ''} · ${formatMoney(m.price_amount, m.currency)}</span></td>
        <td class="small">${String(m.created_at).slice(0, 10)}${m.emailed_at ? html`<br><span class="muted">Correo enviado</span>` : ''}</td>
        <td><form class="row-actions" method="post" action="/admin/alerta" target="_blank">
          <input type="hidden" name="s" value="${m.search_id}"><input type="hidden" name="p" value="${m.property_id}">
          <button class="btn btn-primary btn-xs" type="submit">Enviar por WhatsApp</button>
        </form>
        <form method="post" action="/admin/alerta"><input type="hidden" name="s" value="${m.search_id}"><input type="hidden" name="p" value="${m.property_id}"><input type="hidden" name="solo" value="1"><button class="btn btn-outline btn-xs" type="submit">Marcar como enviada</button></form></td>
      </tr>`)}</tbody></table></div>`
    : html`<p class="muted">No hay alertas pendientes.</p>`}
</section>`;
  return layout(env, { title: 'Alertas', body, noindex: true });
}

export function forgotPage(env, { sent = false, error, email = '', byWhatsapp = false }) {
  const body = html`
<section class="wrap section narrow auth">
  <div class="eyebrow">Mi cuenta</div>
  <h1 class="display-md">Recuperar contraseña</h1>
  ${sent
    ? html`<div class="form-card">
      ${byWhatsapp
        ? html`<p class="notice" role="status">Recibimos su solicitud. Si existe una cuenta con <strong>${email}</strong>, le enviamos el enlace para crear su nueva contraseña al WhatsApp registrado en la cuenta.</p>
      <p class="small muted">El enlace vale por una hora y sirve una sola vez. Lo enviamos en horario hábil.</p>`
        : html`<p class="notice" role="status">Si existe una cuenta con <strong>${email}</strong>, le enviamos un enlace para crear una nueva contraseña.</p>
      <p class="small muted">El enlace vale por una hora y sirve una sola vez. Revise también la carpeta de correo no deseado. Si no le llega en unos minutos, escríbanos por WhatsApp y se lo hacemos llegar.</p>`}
      <a class="btn btn-outline btn-block" href="/ingresar">Volver a ingresar</a>
    </div>`
    : html`<p class="lead">Escriba el correo con el que creó su cuenta y le enviamos un enlace para crear una nueva contraseña.</p>
  <form class="form-card" method="post" action="/recuperar">
    ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
    <label>Correo<input type="email" name="correo" autocomplete="email" maxlength="120" value="${email}" required></label>
    <input type="text" name="empresa_web" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
    <button class="btn btn-primary btn-block" type="submit">Enviar enlace</button>
    <p class="small"><a href="/ingresar">Volver a ingresar</a></p>
  </form>`}
</section>`;
  return layout(env, { title: 'Recuperar contraseña', path: '/recuperar', body, noindex: true });
}

export function resetPage(env, { token = '', name = '', error, invalid = false }) {
  const body = html`
<section class="wrap section narrow auth">
  <div class="eyebrow">Mi cuenta</div>
  <h1 class="display-md">Nueva contraseña</h1>
  ${invalid
    ? html`<div class="form-card">
      <p class="form-error" role="alert">Este enlace ya no es válido. Vence a la hora de enviado y sirve una sola vez.</p>
      <a class="btn btn-primary btn-block" href="/recuperar">Pedir un enlace nuevo</a>
    </div>`
    : html`<p class="lead">${name ? `Hola, ${name.split(' ')[0]}. ` : ''}Elija una contraseña de al menos 8 caracteres.</p>
  <form class="form-card" method="post" action="/restablecer">
    ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
    <input type="hidden" name="t" value="${token}">
    <label>Nueva contraseña<input type="password" name="clave" autocomplete="new-password" minlength="8" maxlength="200" required></label>
    <label>Repítala<input type="password" name="clave2" autocomplete="new-password" minlength="8" maxlength="200" required></label>
    <button class="btn btn-primary btn-block" type="submit">Guardar e ingresar</button>
  </form>`}
</section>`;
  return layout(env, { title: 'Nueva contraseña', path: '/restablecer', body, noindex: true });
}

export function adminAccountsPage(env, { accounts, notice, tempPassword, resetLink }) {
  const pending = accounts.filter((a) => a.status === 'pendiente').length;
  const body = html`
<section class="wrap section admin">
  <div class="section-head"><h1 class="display-sm">Cuentas</h1><a class="btn btn-outline btn-sm" href="/admin">Volver al panel</a></div>
  ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}
  ${resetLink ? html`<div class="notice" role="status">Enlace para que <strong>${resetLink.email}</strong> cree su nueva contraseña (vale 1 hora, un solo uso):<br><code style="user-select:all;word-break:break-all">${resetLink.url}</code>
    ${resetLink.wa ? html`<br><a class="btn btn-primary btn-xs" href="${resetLink.wa}" target="_blank" rel="noopener">Enviar por WhatsApp</a>` : ''}</div>` : ''}
  ${accounts.some((a) => a.reset_pending) ? html`<p class="notice" role="status">${accounts.filter((a) => a.reset_pending).length} persona(s) pidieron recuperar su contraseña en las últimas 24 horas. Use «Enlace de clave» en su fila.</p>` : ''}
  ${tempPassword ? html`<p class="notice" role="status">Clave temporal para <strong>${tempPassword.email}</strong>: <code style="user-select:all">${tempPassword.value}</code> · Envíesela por WhatsApp. No se volverá a mostrar.</p>` : ''}
  <div class="kpis">
    <div><span>Compradores</span><strong>${accounts.filter((a) => a.role === 'comprador').length}</strong></div>
    <div><span>Propietarios</span><strong>${accounts.filter((a) => a.role === 'propietario').length}</strong></div>
    <div><span>Asesores</span><strong>${accounts.filter((a) => a.role === 'asesor').length}</strong></div>
    <div><span>Asesores por aprobar</span><strong>${pending}</strong></div>
  </div>
  <div class="table-wrap"><table>
    <thead><tr><th>Nombre</th><th>Tipo</th><th>Contacto</th><th>Propiedades</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>${accounts.map((a) => html`<tr>
      <td><strong>${a.name}</strong>${a.reset_pending ? html` <span class="status status-revision">Pidió nueva clave</span>` : ''}${a.company ? html`<br><span class="small muted">${a.company}</span>` : ''}<br><span class="small muted">Desde ${String(a.created_at).slice(0, 10)}</span></td>
      <td>${ROLE[a.role]}</td>
      <td class="small">${a.email}<br>${a.whatsapp ? html`<a href="https://wa.me/${a.whatsapp}" target="_blank" rel="noopener">+${a.whatsapp}</a>` : ''}</td>
      <td>${a.props}</td>
      <td><span class="status status-${a.status === 'activa' ? 'publicada' : a.status === 'pendiente' ? 'revision' : 'rechazada'}">${ACC_STATUS[a.status]}</span></td>
      <td><form class="row-actions" method="post" action="/admin/cuenta/${a.id}">
        ${a.status === 'pendiente' ? html`<button name="accion" value="aprobar" class="btn btn-primary btn-xs">Aprobar</button>` : ''}
        ${a.status === 'suspendida'
          ? html`<button name="accion" value="activar" class="btn btn-outline btn-xs">Reactivar</button>`
          : html`<button name="accion" value="suspender" class="btn btn-outline btn-xs">Suspender</button>`}
        <button name="accion" value="enlace" class="btn ${a.reset_pending ? 'btn-primary' : 'btn-outline'} btn-xs">Enlace de clave</button>
        <button name="accion" value="clave" class="btn btn-outline btn-xs">Clave temporal</button>
      </form></td>
    </tr>`)}</tbody>
  </table></div>
  ${accounts.length ? '' : html`<p class="muted">Todavía no hay cuentas.</p>`}
</section>`;
  return layout(env, { title: 'Cuentas', body, noindex: true });
}

function buyerAccountPage(env, { account, notice, favs, searches, matches }) {
  const body = html`
<section class="wrap section account">
  <div class="section-head">
    <div><div class="eyebrow">Comprador</div><h1 class="display-sm">Hola, ${account.name.split(' ')[0]}</h1></div>
    <div class="row-actions">
      <a class="btn btn-primary btn-sm" href="/propiedades">Ver propiedades</a>
      <form method="post" action="/salir"><button class="btn btn-outline btn-sm" type="submit">Salir</button></form>
    </div>
  </div>
  ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}
  <div class="how">
    <article class="how-card"><div class="eyebrow">Inventario</div><h3>Propiedades revisadas</h3><p>Explore todo el inventario con la lectura de valor de cada propiedad.</p><a class="btn btn-primary btn-sm" href="/propiedades">Ver propiedades</a></article>
    <article class="how-card"><div class="eyebrow">A su medida</div><h3>Búsqueda asistida</h3><p>Defina zona y presupuesto, y le avisamos cuando entre una opción que encaje.</p><a class="btn btn-outline btn-sm" href="/servicios/busqueda-asistida">Activar búsqueda</a></article>
    <article class="how-card"><div class="eyebrow">Proyectos</div><h3>Obra nueva</h3><p>Compare proyectos en preventa y construcción por precio por m² y zona.</p><a class="btn btn-outline btn-sm" href="/proyectos">Ver proyectos</a></article>
    <article class="how-card"><div class="eyebrow">Datos</div><h3>Precio por m²</h3><p>Rangos por zona actualizados cada mes con anuncios reales.</p><a class="btn btn-outline btn-sm" href="/mercado">Ver datos de mercado</a></article>
  </div>
  ${searchesBlock(searches, matches)}
  ${favoritesBlock(favs)}
  <div class="panel">
    <div class="eyebrow">Sus datos</div>
    <p class="small">${account.email}<br>${account.whatsapp ? `+${account.whatsapp}` : ''}</p>
    <p class="small muted">Para cambiar su contraseña use <a href="/recuperar">este enlace</a>. Para cambiar sus datos, escríbanos por WhatsApp.</p>
  </div>
</section>`;
  return layout(env, { title: 'Mi cuenta', path: '/mi-cuenta', body, noindex: true });
}
