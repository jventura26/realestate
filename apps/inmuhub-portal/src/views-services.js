// Servicios, «Qué es inmuhub» y acceso al inventario para usuarios registrados.
import { html, raw } from './html.js';
import { layout, CHECK } from './views.js';
import { SERVICES } from './services.js';

const n = (x) => Number(x || 0).toLocaleString('en-US');

export function serviceCards(list = SERVICES) {
  return html`<div class="svc-grid">${list.map((s) => html`
    <a class="svc-card" href="/servicios/${s.slug}">
      <span class="eyebrow">${s.eyebrow}</span>
      <strong>${s.name}</strong>
      <span class="muted">${s.summary}</span>
      <span class="svc-more">Conocer el servicio</span>
    </a>`)}</div>`;
}

export function servicesIndexPage(env) {
  const body = html`
<section class="wrap section narrow">
  <div class="eyebrow">Servicios</div>
  <h1 class="display-md">Todo lo que una operación inmobiliaria necesita, con criterio.</h1>
  <p class="lead">inmuhub combina un portal de propiedades revisadas, información de valor por zona y servicios de producción y marketing. Cada servicio tiene un objetivo concreto: decidir mejor, vender con orden o comprar con información.</p>
</section>
<section class="wrap section svc-section">${serviceCards()}</section>
<section class="wrap section">
  <div class="cta-band">
    <div><div class="eyebrow">Acceso</div><h2 class="display-sm">Los servicios se solicitan desde su cuenta.</h2><p class="muted">Así damos seguimiento ordenado a cada solicitud y le escribimos por WhatsApp con la propuesta.</p></div>
    <div class="row-actions"><a class="btn btn-primary" href="/registro">Crear cuenta</a><a class="btn btn-outline" href="/ingresar">Ingresar</a></div>
  </div>
</section>`;
  return layout(env, {
    title: 'Servicios',
    description: 'Publicación curada, análisis de valor, búsqueda asistida, planes para inmobiliarias, red de asesores, tours 360°, fotografía, campañas en Meta y datos de mercado en Guatemala.',
    path: '/servicios',
    body,
  });
}

export function servicePage(env, { s, account, notice, error }) {
  const next = `/servicios/${s.slug}#solicitar`;
  const q = `next=${encodeURIComponent(next)}`;
  const body = html`
<section class="wrap section narrow">
  <div class="crumbs small muted"><a href="/servicios">Servicios</a> · ${s.eyebrow}</div>
  <div class="eyebrow">${s.eyebrow}</div>
  <h1 class="display-md">${s.name}</h1>
  <p class="lead">${s.lead}</p>
  <div class="row-actions"><a class="btn btn-primary" href="#solicitar">${s.action}</a>${s.related ? html`<a class="btn btn-outline" href="${s.related[0]}">${s.related[1]}</a>` : ''}</div>
</section>

<section class="wrap section svc-detail">
  <div class="panel">
    <div class="eyebrow">Qué incluye</div>
    <ul class="checks">${s.includes.map((i) => html`<li>${CHECK}${i}</li>`)}</ul>
    ${s.note ? html`<p class="small muted">${s.note}</p>` : ''}
  </div>
  <div class="panel">
    <div class="eyebrow">Para quién es</div>
    <ul class="checks">${s.forWho.map((i) => html`<li>${CHECK}${i}</li>`)}</ul>
  </div>
</section>

<section class="wrap section">
  <div class="section-head"><h2 class="display-md">Cómo funciona</h2></div>
  <div class="steps">${s.steps.map(([t, d], i) => html`<div><span class="num">0${i + 1}</span><h3>${t}</h3><p>${d}</p></div>`)}</div>
</section>

<section class="wrap section narrow" id="solicitar">
  ${account
    ? html`<form class="form-card" method="post" action="/servicios/${s.slug}">
        <h2>${s.action}</h2>
        ${notice ? html`<p class="notice" role="status">${notice}</p>` : ''}
        ${error ? html`<p class="form-error" role="alert">${error}</p>` : ''}
        ${s.actionHref
          ? html`<p class="muted">Continúe para completar los datos de su propiedad. Quedará ligada a su cuenta y verá su estado desde «Mi cuenta».</p>
              <a class="btn btn-primary btn-block" href="${s.actionHref}">${s.action}</a>`
          : html`<p class="muted">Enviaremos la solicitud a nombre de <strong>${account.name}</strong> y le escribiremos al WhatsApp de su cuenta.</p>
              <label>Cuéntenos lo que necesita (opcional)<textarea name="mensaje" rows="4" maxlength="1000" placeholder="Zona, tipo de propiedad, fechas o cualquier detalle útil."></textarea></label>
              <button class="btn btn-primary btn-block" type="submit">Enviar solicitud</button>`}
      </form>`
    : html`<div class="gate">
        <div class="eyebrow">Acceso para usuarios registrados</div>
        <h2 class="display-sm">Para solicitar este servicio, ingrese a su cuenta.</h2>
        <p class="muted">Pedimos una cuenta para dar seguimiento ordenado a cada solicitud, proteger sus datos y escribirle con una propuesta concreta. Crearla toma menos de un minuto y no tiene costo.</p>
        <ul class="checks">
          <li>${CHECK}Seguimiento de sus solicitudes y propiedades en un solo lugar</li>
          <li>${CHECK}Acceso al inventario completo con lectura de valor</li>
          <li>${CHECK}Sus datos de contacto nunca se publican</li>
        </ul>
        <div class="row-actions">
          <a class="btn btn-primary" href="/registro?tipo=${s.role}&amp;${raw(q)}">Crear cuenta</a>
          <a class="btn btn-outline" href="/ingresar?${raw(q)}">Ya tengo cuenta</a>
        </div>
      </div>`}
</section>

<section class="wrap section">
  <div class="section-head"><h2 class="display-sm">Otros servicios</h2><a class="link-underline" href="/servicios">Ver todos</a></div>
  ${serviceCards(SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3))}
</section>`;
  return layout(env, { title: s.name, description: s.summary, path: `/servicios/${s.slug}`, body });
}

export function aboutPage(env, { stats }) {
  const body = html`
<section class="wrap section narrow">
  <div class="eyebrow">Qué es inmuhub</div>
  <h1 class="display-md">Un portal inmobiliario curado, con información de valor en cada decisión.</h1>
  <p class="lead">inmuhub nació de una idea simple: en Guatemala sobran anuncios y falta información. Por eso cada propiedad se revisa antes de publicarse, cada ficha muestra cómo se compara su precio con su zona y cada consulta llega con contexto.</p>
</section>

<section class="ink">
  <div class="wrap section">
    <div class="pillars">
      <div class="pillar"><strong>${n(stats.properties)} propiedades revisadas</strong><span class="lead-light">Casas, apartamentos, terrenos y fincas con datos verificados antes de publicarse.</span></div>
      <div class="pillar"><strong>${n(stats.zones)} zonas con lectura de valor</strong><span class="lead-light">Rango por m² con comparables reales de cada sector.</span></div>
      <div class="pillar"><strong>${stats.projects ? `${n(stats.projects)} proyectos nuevos` : 'Proyectos nuevos'}</strong><span class="lead-light">Obra nueva comparable por zona, tipología y precio por m².</span></div>
    </div>
  </div>
</section>

<section class="wrap section">
  <div class="section-head"><h2 class="display-md">Nuestros principios</h2><span class="tagline">No se trata de publicar por publicar.</span></div>
  <div class="steps">
    <div><span class="num">01</span><h3>Revisión antes de publicar</h3><p>Datos, áreas, fotografías y precio se revisan. Si algo no cuadra, se corrige antes de salir.</p></div>
    <div><span class="num">02</span><h3>Valor con datos</h3><p>Cada propiedad se compara con el rango de su zona. El comprador decide con información y el propietario fija un precio defendible.</p></div>
    <div><span class="num">03</span><h3>Relación honesta</h3><p>Sin comisiones ocultas ni presión de venta. Cobramos solo el servicio que usted elige.</p></div>
  </div>
</section>

<section class="wrap section">
  <div class="section-head"><div><div class="eyebrow">Servicios</div><h2 class="display-md">Lo que hacemos</h2></div><a class="link-underline" href="/servicios">Ver todos los servicios</a></div>
  ${serviceCards(SERVICES.slice(0, 6))}
</section>

<section class="wrap section">
  <div class="cta-band">
    <div><div class="eyebrow">Mi cuenta</div><h2 class="display-sm">Forme parte de inmuhub.</h2><p class="muted">Compradores, propietarios y asesores acceden con una cuenta gratuita.</p></div>
    <div class="row-actions"><a class="btn btn-primary" href="/registro">Crear cuenta</a><a class="btn btn-outline" href="/ingresar">Ingresar</a></div>
  </div>
</section>`;
  return layout(env, {
    title: 'Qué es inmuhub',
    description: 'Portal inmobiliario curado en Guatemala: propiedades revisadas, lectura de valor por zona y servicios para propietarios, compradores, asesores y desarrolladoras.',
    path: '/inmuhub',
    body,
  });
}

export function verificationPage(env) {
  const body = html`
<section class="wrap section narrow">
  <div class="eyebrow">Cómo verificamos</div>
  <h1 class="display-md">Una propiedad en inmuhub no se publica por publicar.</h1>
  <p class="lead">Todas las propiedades pasan por una revisión antes de aparecer. Las que además tienen el sello «Verificada» pasaron una revisión documental. Aquí explicamos qué significa cada nivel y qué no garantiza.</p>
</section>

<section class="wrap section verify">
  <div class="verify-grid">
    <article class="verify-card">
      <span class="eyebrow">Todas las propiedades</span>
      <h2 class="display-sm">Revisada</h2>
      <p class="muted">Lo que revisamos antes de publicar cualquier propiedad:</p>
      <ul class="checks">
        <li>${CHECK}Datos completos y coherentes: tipo, zona, áreas, habitaciones y precio.</li>
        <li>${CHECK}Fotografías actuales de la propiedad, sin imágenes de catálogo ni de otras propiedades.</li>
        <li>${CHECK}Precio comparado con el rango de su zona, visible en la ficha.</li>
        <li>${CHECK}Contacto confirmado: quien publica es el propietario o un asesor identificado.</li>
        <li>${CHECK}Sin anuncios duplicados ni propiedades ya vendidas o rentadas.</li>
      </ul>
    </article>
    <article class="verify-card verify-card-ink">
      <span class="eyebrow eyebrow-light">Sello adicional</span>
      <h2 class="display-sm">${CHECK}Verificada</h2>
      <p class="light">Además de lo anterior, para otorgar el sello revisamos:</p>
      <ul class="checks checks-light">
        <li>${CHECK}Certificación reciente del Registro General de la Propiedad: titular, gravámenes y anotaciones.</li>
        <li>${CHECK}Identidad de quien vende o renta, o la autorización escrita del propietario al asesor.</li>
        <li>${CHECK}Concordancia entre las áreas publicadas y las del registro o plano.</li>
        <li>${CHECK}Visita a la propiedad o recorrido virtual que confirme su estado actual.</li>
      </ul>
    </article>
  </div>
</section>

<section class="wrap section narrow">
  <h2 class="display-sm">Lo que el sello no sustituye</h2>
  <p>La verificación reduce riesgos y da claridad, pero no reemplaza el trabajo de un abogado o notario ni un avalúo profesional. Antes de firmar una promesa o entregar un anticipo, recomendamos un estudio legal completo de la propiedad y revisar que el precio tenga sentido frente a su zona.</p>
  <p class="muted">Si encuentra información que no corresponde en una ficha, escríbanos y la revisamos de inmediato. Una propiedad puede perder el sello si cambian sus condiciones.</p>
  <div class="row-actions"><a class="btn btn-primary" href="/propiedades">Ver propiedades</a><a class="btn btn-outline" href="/servicios/publicacion-de-propiedades">Publicar una propiedad</a></div>
</section>`;
  return layout(env, {
    title: 'Cómo verificamos las propiedades',
    description: 'Qué revisa inmuhub antes de publicar una propiedad y qué significa el sello «Verificada»: registro, identidad, áreas y estado actual.',
    path: '/verificacion',
    body,
  });
}

export function catalogGatePage(env, { stats, zones, next = '/propiedades' }) {
  const enc = encodeURIComponent(next);
  const body = html`
<section class="wrap section gate-hero">
  <div class="gate-copy">
    <div class="eyebrow">Inventario completo</div>
    <h1 class="display-md">${n(stats.properties)} propiedades revisadas, con lectura de valor en cada una.</h1>
    <p class="lead">El inventario completo de inmuhub está disponible para usuarios registrados. Así cuidamos la información de propietarios y asesores, y le ofrecemos una experiencia sin ruido: solo propiedades revisadas, con precio comparado con su zona.</p>
    <ul class="checks">
      <li>${CHECK}Casas, apartamentos, terrenos y fincas en ${n(stats.zones)} zonas</li>
      <li>${CHECK}Rango de precio por m² y posición de cada propiedad frente a su zona</li>
      <li>${CHECK}Contacto directo con el asesor o propietario, con la propiedad identificada</li>
      <li>${CHECK}Búsqueda asistida: le avisamos cuando entra algo que encaja con usted</li>
    </ul>
    ${zones.length ? html`<div class="chips chips-dark">${zones.slice(0, 8).map((z) => html`<span class="chip">${z.name}</span>`)}</div>` : ''}
  </div>
  <div class="gate-box">
    <form class="form-card" method="post" action="/ingresar">
      <h2>Ingresar</h2>
      <input type="hidden" name="next" value="${next}">
      <label>Correo<input type="email" name="correo" autocomplete="email" maxlength="120" required></label>
      <label>Contraseña<input type="password" name="clave" autocomplete="current-password" maxlength="200" required></label>
      <button class="btn btn-primary btn-block" type="submit">Ver propiedades</button>
      <p class="small muted">¿Aún no tiene cuenta? Es gratuita.</p>
      <a class="btn btn-outline btn-block" href="/registro?tipo=comprador&amp;next=${enc}">Crear cuenta de comprador</a>
      <p class="small muted">¿Es propietario o asesor? <a href="/registro?tipo=propietario&amp;next=${enc}">Cuenta de propietario</a> · <a href="/registro?tipo=asesor&amp;next=${enc}">Cuenta de asesor</a></p>
    </form>
  </div>
</section>
<section class="wrap section">
  <div class="section-head"><div><div class="eyebrow">Mientras tanto</div><h2 class="display-sm">Conozca nuestros servicios</h2></div><a class="link-underline" href="/servicios">Ver todos</a></div>
  ${serviceCards(SERVICES.slice(0, 3))}
</section>`;
  return layout(env, {
    title: 'Propiedades en Guatemala',
    description: 'Inventario de propiedades revisadas en Guatemala con lectura de valor por zona. Acceso para usuarios registrados.',
    path: '/propiedades',
    body,
  });
}
