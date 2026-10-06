// Páginas de cuentas: ingresar, crear cuenta, mi cuenta y gestión en /admin/cuentas.
import { html, raw, formatMoney } from './html.js';
import { layout, CHECK, STATUS_LABEL } from './views.js';

const ROLE = { propietario: 'Propietario', asesor: 'Asesor inmobiliario' };
const ACC_STATUS = { activa: 'Activa', pendiente: 'En revisión', suspendida: 'Suspendida' };

function roleCards(selected) {
  const card = (role, title, text) => html`
    <a class="role-card${selected === role ? raw(' is-on') : ''}" href="/registro?tipo=${role}">
      <strong>${title}</strong><span class="small muted">${text}</span>
    </a>`;
  return html`<div class="role-cards">
    ${card('propietario', 'Soy propietario', 'Publico mi casa, apartamento, terreno o finca y sigo su revisión.')}
    ${card('asesor', 'Soy asesor', 'Publico el inventario de mis clientes y comparto fichas con colegas.')}
  </div>`;
}

export function loginPage(env, { error, email = '', next = '', notice }) {
  const body = html`
<section class="wrap section narrow auth">
  <div class="eyebrow">Mi cuenta</div>
  <h1 class="display-md">Ingresar a inmuhub</h1>
  <p class="lead">Propietarios y asesores entran por aquí para publicar y dar seguimiento a sus propiedades.</p>
  <form class="form-card" method="post" action="/ingresar">
    ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}
    ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
    <input type="hidden" name="next" value="${next}">
    <label>Correo<input type="email" name="correo" autocomplete="email" maxlength="120" value="${email}" required></label>
    <label>Contraseña<input type="password" name="clave" autocomplete="current-password" maxlength="200" required></label>
    <button class="btn btn-primary btn-block" type="submit">Ingresar</button>
    <p class="small muted">¿Olvidó su contraseña? Escríbanos por WhatsApp y le enviamos una clave temporal.</p>
  </form>
  <div class="auth-alt">
    <h2 class="display-sm">¿Aún no tiene cuenta?</h2>
    ${roleCards('')}
  </div>
</section>`;
  return layout(env, { title: 'Ingresar', path: '/ingresar', body, noindex: true });
}

export function registerPage(env, { role = 'propietario', values = {}, error }) {
  const v = (k) => values[k] ?? '';
  const asesor = role === 'asesor';
  const body = html`
<section class="wrap section narrow auth">
  <div class="eyebrow">Crear cuenta</div>
  <h1 class="display-md">${asesor ? 'Cuenta de asesor' : 'Cuenta de propietario'}</h1>
  <p class="lead">${asesor
    ? 'Publique el inventario de sus clientes con lectura de valor y siga cada propiedad desde su panel. Revisamos cada cuenta de asesor antes de activarla.'
    : 'Publique su propiedad y vea en qué etapa está: revisión, publicada y consultas recibidas.'}</p>
  ${roleCards(role)}
  <form class="form-card" method="post" action="/registro">
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
    <p class="small muted">¿Ya tiene cuenta? <a href="/ingresar">Ingresar</a></p>
    <p class="small muted form-legal">Al crear su cuenta acepta el <a href="/privacidad">aviso de privacidad</a>. Su correo y WhatsApp no se publican.</p>
  </form>
</section>`;
  return layout(env, { title: asesor ? 'Cuenta de asesor' : 'Cuenta de propietario', path: '/registro', body, noindex: true });
}

export function accountPage(env, { account, props, notice }) {
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
    <div><span>Consultas recibidas</span><strong>${props.reduce((n, p) => n + (p.leads || 0), 0)}</strong></div>
  </div>

  <h2>Mis propiedades</h2>
  ${props.length
    ? html`<div class="table-wrap"><table>
      <thead><tr><th>Propiedad</th><th>Precio</th><th>Estado</th><th>Consultas</th><th></th></tr></thead>
      <tbody>${props.map((p) => html`<tr>
        <td><strong>${p.title}</strong><br><span class="small muted">${p.zone_name || ''} · Ref. IH-${String(p.id).padStart(4, '0')}</span>
          ${p.status === 'rechazada' && p.review_notes ? html`<br><span class="small">Observación: ${p.review_notes}</span>` : ''}</td>
        <td>${formatMoney(p.price_amount, p.currency)}</td>
        <td><span class="status status-${p.status}">${STATUS_LABEL[p.status] || p.status}</span></td>
        <td>${p.leads || 0}</td>
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
      <p class="small muted">Para cambiar sus datos o su contraseña, escríbanos por WhatsApp.</p>
    </div>
  </div>
</section>`;
  return layout(env, { title: 'Mi cuenta', path: '/mi-cuenta', body, noindex: true });
}

export function adminAccountsPage(env, { accounts, notice, tempPassword }) {
  const pending = accounts.filter((a) => a.status === 'pendiente').length;
  const body = html`
<section class="wrap section admin">
  <div class="section-head"><h1 class="display-sm">Cuentas</h1><a class="btn btn-outline btn-sm" href="/admin">Volver al panel</a></div>
  ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}
  ${tempPassword ? html`<p class="notice" role="status">Clave temporal para <strong>${tempPassword.email}</strong>: <code style="user-select:all">${tempPassword.value}</code> · Envíesela por WhatsApp. No se volverá a mostrar.</p>` : ''}
  <div class="kpis">
    <div><span>Propietarios</span><strong>${accounts.filter((a) => a.role === 'propietario').length}</strong></div>
    <div><span>Asesores</span><strong>${accounts.filter((a) => a.role === 'asesor').length}</strong></div>
    <div><span>Asesores por aprobar</span><strong>${pending}</strong></div>
    <div><span>Total</span><strong>${accounts.length}</strong></div>
  </div>
  <div class="table-wrap"><table>
    <thead><tr><th>Nombre</th><th>Tipo</th><th>Contacto</th><th>Propiedades</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>${accounts.map((a) => html`<tr>
      <td><strong>${a.name}</strong>${a.company ? html`<br><span class="small muted">${a.company}</span>` : ''}<br><span class="small muted">Desde ${String(a.created_at).slice(0, 10)}</span></td>
      <td>${ROLE[a.role]}</td>
      <td class="small">${a.email}<br>${a.whatsapp ? html`<a href="https://wa.me/${a.whatsapp}" target="_blank" rel="noopener">+${a.whatsapp}</a>` : ''}</td>
      <td>${a.props}</td>
      <td><span class="status status-${a.status === 'activa' ? 'publicada' : a.status === 'pendiente' ? 'revision' : 'rechazada'}">${ACC_STATUS[a.status]}</span></td>
      <td><form class="row-actions" method="post" action="/admin/cuenta/${a.id}">
        ${a.status === 'pendiente' ? html`<button name="accion" value="aprobar" class="btn btn-primary btn-xs">Aprobar</button>` : ''}
        ${a.status === 'suspendida'
          ? html`<button name="accion" value="activar" class="btn btn-outline btn-xs">Reactivar</button>`
          : html`<button name="accion" value="suspender" class="btn btn-outline btn-xs">Suspender</button>`}
        <button name="accion" value="clave" class="btn btn-outline btn-xs">Clave temporal</button>
      </form></td>
    </tr>`)}</tbody>
  </table></div>
  ${accounts.length ? '' : html`<p class="muted">Todavía no hay cuentas.</p>`}
</section>`;
  return layout(env, { title: 'Cuentas', body, noindex: true });
}
