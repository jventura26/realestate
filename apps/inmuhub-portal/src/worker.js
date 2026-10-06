import { EmailMessage } from 'cloudflare:email';
// inmuhub portal — Worker principal.
import * as db from './db.js';
import * as views from './views.js';
import * as pviews from './views-projects.js';
import * as aviews from './views-admin-projects.js';
import * as acviews from './views-account.js';
import * as auth from './auth.js';
import * as sviews from './views-services.js';
import { serviceBySlug, SERVICES } from './services.js';
import { parseCoords, approxPoint } from './traslados.js';
import { cachedNearby, refreshNearby } from './cercanos.js';
import * as alertas from './alertas.js';
import {
  normalizeWhatsapp, parseNumber, mapType, cleanText, projectPricePerM2, parseTypologies, PROJECT_COMPARABLE, valuePosition,
} from './normalize.js';
import { TYPE_LABELS, parseJsonArray, formatMoney } from './html.js';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' https: data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://connect.facebook.net https://static.cloudflareinsights.com; " +
    "connect-src 'self' https://www.facebook.com https://cloudflareinsights.com; " +
    "form-action 'self' https://wa.me https://*.whatsapp.com; frame-ancestors 'none'; base-uri 'self'",
};

function page(body, status = 200, extra = {}) {
  return new Response(String(body), {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY_HEADERS, ...extra },
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300', ...SECURITY_HEADERS },
  });
}

function redirect(location, status = 303, extra = {}) {
  return new Response(null, { status, headers: { Location: location, ...extra } });
}

const minComparables = (env) => Number(env.MIN_COMPARABLES || 5);
const usdRate = (env) => Number(env.USD_TO_GTQ || 7.7);

function utmFrom(url) {
  const pick = (k) => (url.searchParams.get(k) || '').slice(0, 100);
  return { utm_source: pick('utm_source'), utm_campaign: pick('utm_campaign'), utm_content: pick('utm_content') };
}

function field(form, name, max = 200) {
  const v = form.get(name);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function waLink(number, text) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function slugify(s) {
  return String(s)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

// ---------- Admin: sesión por cookie ----------

async function sha256(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function sessionValue(env) {
  return sha256(`inmuhub-admin:${env.ADMIN_TOKEN}`);
}

async function isAdmin(request, env) {
  if (!env.ADMIN_TOKEN) return false;
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)inmu_admin=([a-f0-9]{64})/);
  return !!m && timingSafeEqual(m[1], await sessionValue(env));
}

// ---------- Leads ----------

async function forwardToCrm(env, lead) {
  if (!env.CRM_WEBHOOK_URL) return false;
  const res = await fetch(env.CRM_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: 'inmuhub', ...lead }),
  });
  return res.ok;
}

// Aviso por correo de cada consulta nueva (Cloudflare Email Routing).
// Solo funciona si wrangler.toml tiene el binding LEAD_MAIL y LEAD_MAIL_FROM/TO configurados.
const KIND_LABEL = {
  propiedad: 'Consulta por propiedad', valor_zona: 'Análisis de valor por zona', plan: 'Interés en planes',
  publicar: 'Propiedad enviada a revisión', proyecto: 'Consulta por proyecto', desarrolladora: 'Desarrolladora interesada',
};

async function notifyByEmail(env, lead) {
  if (!env.LEAD_MAIL || !env.LEAD_MAIL_FROM || !env.LEAD_MAIL_TO) return false;
  const phone = lead.whatsapp ? `+${lead.whatsapp}` : '';
  const lines = [
    `${KIND_LABEL[lead.kind] || 'Consulta nueva'} en inmuhub`,
    '',
    `Nombre: ${lead.name || '—'}`,
    `Teléfono: ${phone}`,
    lead.whatsapp ? `WhatsApp: https://wa.me/${lead.whatsapp}` : null,
    lead.property_title ? `Propiedad: ${lead.property_title}` : null,
    lead.property_slug ? `Ficha: ${env.SITE_URL}/propiedad/${lead.property_slug}` : null,
    lead.project_name ? `Proyecto: ${lead.project_name}` : null,
    lead.project_slug ? `Ficha: ${env.SITE_URL}/proyecto/${lead.project_slug}` : null,
    lead.zone_slug && !lead.property_slug && !lead.project_slug ? `Zona: ${lead.zone_name || lead.zone_slug}` : null,
    lead.intent ? `Interés: ${lead.intent}` : null,
    lead.message ? `Detalle: ${lead.message}` : null,
    lead.ref ? `Referencia: ${lead.ref}` : null,
    lead.utm_source || lead.utm_campaign ? `Origen: ${[lead.utm_source, lead.utm_campaign, lead.utm_content].filter(Boolean).join(' / ')}` : 'Origen: directo',
    '',
    `Panel: ${env.SITE_URL}/admin`,
  ].filter((l) => l !== null);
  const subject = `${KIND_LABEL[lead.kind] || 'Consulta nueva'}: ${lead.name || phone}`;
  const raw = buildMime({ from: env.LEAD_MAIL_FROM, fromName: 'inmuhub', to: env.LEAD_MAIL_TO, subject, text: lines.join('\r\n') });
  await env.LEAD_MAIL.send(new EmailMessage(env.LEAD_MAIL_FROM, env.LEAD_MAIL_TO, raw));
  return true;
}

// Mensaje RFC 5322 en texto plano UTF-8 (base64).
function b64utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

export function buildMime({ from, fromName, to, subject, text }) {
  const body = b64utf8(text).replace(/.{76}/g, '$&\r\n');
  return [
    `From: =?UTF-8?B?${b64utf8(fromName)}?= <${from}>`,
    `To: <${to}>`,
    `Subject: =?UTF-8?B?${b64utf8(subject)}?=`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${from.split('@')[1]}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body,
  ].join('\r\n');
}

async function handleConsulta(request, env, ctx) {
  const form = await request.formData();
  const kind = field(form, 'tipo', 20);
  const rerender = async (error) => {
    const url = new URL(request.url);
    if (kind === 'propiedad') {
      const p = await db.getPublicProperty(env.DB, field(form, 'propiedad', 80));
      if (!p) return page(views.notFoundPage(env), 404);
      const reading = await db.propertyValueReading(env.DB, p, minComparables(env));
      return page(views.propertyPage(env, { p, reading, utm: utmFrom(url), error, account: await auth.currentAccount(request, env.DB) }), 422);
    }
    if (kind === 'valor_zona') {
      const zones = await db.listZones(env.DB);
      const zone = await db.getZone(env.DB, field(form, 'zona', 60));
      const type = mapType(field(form, 'tipo_propiedad', 20));
      const value = zone ? await db.zoneValue(env.DB, zone.slug, type, minComparables(env)) : null;
      return page(views.zoneValuePage(env, { zones, zone, type, value, utm: {}, error, account: await auth.currentAccount(request, env.DB) }), 422);
    }
    if (kind === 'proyecto') {
      const j = await db.getPublicProject(env.DB, field(form, 'proyecto', 100));
      if (!j) return page(views.notFoundPage(env), 404);
      return page(pviews.projectPage(env, { j, reading: await projectReading(env, j), utm: utmFrom(url), error, account: await auth.currentAccount(request, env.DB) }), 422);
    }
    if (kind === 'desarrolladora') {
      return page(pviews.developersPage(env, { utm: {}, error, stats: await siteStats(env) }), 422);
    }
    return page(views.plansPage(env, { utm: {}, error }), 422);
  };

  if (field(form, 'empresa')) return redirect('/'); // honeypot: bot
  if (!['propiedad', 'valor_zona', 'plan', 'proyecto', 'desarrolladora'].includes(kind)) return redirect('/');
  // El análisis de una propiedad y la alerta de zona son para usuarios registrados.
  if (kind === 'valor_zona' && !(await auth.currentAccount(request, env.DB))) return redirect('/ingresar?next=/valor', 303);

  const whatsapp = normalizeWhatsapp(field(form, 'whatsapp', 20));
  const name = cleanText(field(form, 'nombre', 80));
  if (!whatsapp) return rerender('Revise su número de WhatsApp: debe tener 8 dígitos (o incluir el código de país).');
  if (!name) return rerender('Escriba su nombre para que el asesor sepa con quién habla.');

  const lead = {
    kind,
    name,
    whatsapp,
    intent: field(form, 'intencion', 30) || null,
    message: cleanText(field(form, 'mensaje', 300)) || null,
    utm_source: field(form, 'utm_source', 100) || null,
    utm_campaign: field(form, 'utm_campaign', 100) || null,
    utm_content: field(form, 'utm_content', 100) || null,
  };

  let destination = env.WHATSAPP_DEFAULT;
  let text;
  let property = null;
  let project = null;

  if (kind === 'propiedad') {
    property = await db.getPublicProperty(env.DB, field(form, 'propiedad', 80));
    if (!property) return page(views.notFoundPage(env), 404);
    if (property.contact_mode === 'ninguno') return redirect(`/propiedad/${property.slug}`);
    lead.property_id = property.id;
    lead.zone_slug = property.zone_slug;
    destination = normalizeWhatsapp(property.contact_whatsapp) || destination;
    text = `Hola, soy ${name}. Me interesa la propiedad "${property.title}" (${env.SITE_URL}/propiedad/${property.slug}). La busco para ${lead.intent === 'invertir' ? 'invertir' : 'vivir'}.`;
  } else if (kind === 'valor_zona') {
    const zone = await db.getZone(env.DB, field(form, 'zona', 60));
    lead.zone_slug = zone?.slug || null;
    lead.zone_name = zone?.name || null;
    const tipo = TYPE_LABELS[mapType(field(form, 'tipo_propiedad', 20))] || 'Casa';
    const alerta = field(form, 'alerta', 2) === '1';
    if (alerta) lead.message = 'Activar aviso mensual del rango de la zona';
    text = `Hola, soy ${name}. Quiero el análisis de valor de mi propiedad en ${zone?.name || 'mi zona'} (${tipo.toLowerCase()}). Mi interés es ${lead.intent === 'vender' ? 'vender' : 'comprar'}.${alerta ? ' También quiero el aviso mensual del rango de la zona.' : ''}`;
  } else if (kind === 'proyecto') {
    project = await db.getPublicProject(env.DB, field(form, 'proyecto', 100));
    if (!project) return page(views.notFoundPage(env), 404);
    if (project.contact_mode === 'ninguno') return redirect(`/proyecto/${project.slug}`);
    lead.project_id = project.id;
    lead.zone_slug = project.zone_slug;
    if (lead.intent && !['vivir', 'invertir'].includes(lead.intent)) lead.intent = null;
    destination = normalizeWhatsapp(project.developer_whatsapp) || destination;
    text = `Hola, soy ${name}. Vi el proyecto "${project.name}" en inmuhub (${env.SITE_URL}/proyecto/${project.slug}) y quiero precios y disponibilidad${lead.message ? ` de la tipología ${lead.message}` : ''}. Lo busco para ${lead.intent === 'invertir' ? 'invertir' : 'vivir'}.`;
  } else if (kind === 'desarrolladora') {
    if (!lead.message) return rerender('Escriba el nombre de su desarrolladora o proyecto.');
    lead.intent = lead.intent === 'lanzamiento' ? 'lanzamiento' : 'guia';
    text = `Hola, soy ${name} de ${lead.message}. Quiero publicar nuestro proyecto en inmuhub con la oferta de lanzamiento.`;
  } else {
    text = `Hola, soy ${name}${lead.message ? ` de ${lead.message}` : ''}. Quiero información del plan ${lead.intent || ''} de inmuhub.`;
  }

  const id = await db.insertLead(env.DB, lead);
  const full = {
    id, ...lead, property_slug: property?.slug, property_title: property?.title, project_slug: project?.slug, project_name: project?.name,
  };
  ctx.waitUntil(
    forwardToCrm(env, full)
      .then((ok) => ok && db.markLeadSynced(env.DB, id))
      .catch((e) => console.error('CRM webhook', e))
  );
  ctx.waitUntil(notifyByEmail(env, full).catch((e) => console.error('Aviso por correo', e)));

  // Propiedades sin WhatsApp: la consulta queda en el panel y la persona ve la confirmación.
  if (property && property.contact_mode === 'formulario') return redirect(`/gracias?propiedad=${encodeURIComponent(property.slug)}`);
  if (project && project.contact_mode === 'formulario') return redirect('/gracias');
  if (kind === 'desarrolladora' && lead.intent === 'guia') return redirect('/desarrolladoras/gracias');
  if (!destination) return redirect('/gracias');
  return redirect(waLink(destination, text));
}

// Lee coordenadas de un enlace de Google Maps. Los enlaces cortos se siguen una vez para leer la dirección final.
async function resolveCoords(text) {
  const direct = parseCoords(text);
  if (direct || !text) return direct;
  if (!/^https:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\/[A-Za-z0-9_-]+/.test(text.trim())) return null;
  try {
    const r = await fetch(text.trim(), { redirect: 'manual' });
    const loc = r.headers.get('Location') || '';
    return parseCoords(decodeURIComponent(loc));
  } catch {
    return null;
  }
}

async function handlePublicar(request, env, ctx) {
  const form = await request.formData();
  const zones = await db.listZones(env.DB);
  const values = Object.fromEntries([...form.entries()].map(([k, v]) => [k, typeof v === 'string' ? v.slice(0, 2000) : '']));
  const fail = (error) => page(views.publishPage(env, { zones, values, error }), 422);

  if (field(form, 'empresa')) return redirect('/');

  // Límite de envíos por IP (binding opcional PUBLISH_LIMITER).
  if (env.PUBLISH_LIMITER) {
    const ip = request.headers.get('CF-Connecting-IP') || 'local';
    const { success } = await env.PUBLISH_LIMITER.limit({ key: ip });
    if (!success) return fail('Recibimos varios envíos seguidos desde su conexión. Espere un minuto e intente de nuevo.');
  }

  // Fotografías del propietario: se validan antes de guardar nada.
  const photos = form.getAll('fotos').filter((f) => typeof f === 'object' && f && f.size > 0);
  if (photos.length > MAX_OWNER_PHOTOS) return fail(`Puede subir hasta ${MAX_OWNER_PHOTOS} fotografías.`);
  for (const f of photos) {
    if (!IMAGE_TYPES[f.type]) return fail(`La foto «${f.name}» no tiene un formato admitido. Use JPG, PNG o WebP.`);
    if (f.size > MAX_IMAGE_BYTES) return fail(`La foto «${f.name}» supera 8 MB.`);
  }
  if (photos.length && !env.MEDIA) return fail('En este momento no podemos recibir fotografías. Envíe el formulario sin fotos y se las pediremos por WhatsApp.');

  const type = mapType(field(form, 'tipo', 20));
  const zone = zones.find((z) => z.slug === field(form, 'zona', 60));
  const price = parseNumber(field(form, 'precio', 20));
  const currency = field(form, 'moneda', 3) === 'USD' ? 'USD' : 'GTQ';
  const whatsapp = normalizeWhatsapp(field(form, 'whatsapp', 20));
  const name = cleanText(field(form, 'nombre', 80));

  if (!zone) return fail('Elija la zona de la propiedad.');
  if (!price) return fail('Indique el precio (solo números).');
  if (!whatsapp) return fail('Revise su número de WhatsApp: debe tener 8 dígitos (o incluir el código de país).');
  if (!name) return fail('Escriba su nombre.');

  const location = cleanText(field(form, 'ubicacion', 120));
  const operation = field(form, 'operacion', 10) === 'renta' ? 'renta' : 'venta';
  const title = `${TYPE_LABELS[type]} en ${operation} · ${location ? location + ', ' : ''}${zone.name}`;
  const slug = `${slugify(`${TYPE_LABELS[type]} ${location || ''} ${zone.name}`)}-${crypto.randomUUID().slice(0, 6)}`;

  const account = await auth.currentAccount(request, env.DB);
  const coords = await resolveCoords(field(form, 'mapa', 600));
  const id = await db.insertSubmission(env.DB, {
    account_id: account ? account.id : null,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
    slug,
    title,
    operation,
    type,
    zone_slug: zone.slug,
    location_label: location || null,
    municipality: null,
    price_amount: price,
    currency,
    price_gtq: Math.round(currency === 'USD' ? price * usdRate(env) : price),
    area_built_m2: parseNumber(field(form, 'area_m2', 10)),
    area_land_v2: parseNumber(field(form, 'terreno_v2', 10)),
    bedrooms: parseNumber(field(form, 'habitaciones', 3)),
    bathrooms: parseNumber(field(form, 'banos', 4)),
    parking: null,
    description: cleanText(field(form, 'descripcion', 2000)) || null,
    owner_name: name,
    owner_whatsapp: whatsapp,
    owner_email: field(form, 'correo', 120) || null,
  });

  if (photos.length) {
    const images = [];
    for (const f of photos) {
      const key = `p/${id}/${crypto.randomUUID()}.${IMAGE_TYPES[f.type]}`;
      await env.MEDIA.put(key, await f.arrayBuffer(), { metadata: { type: f.type } });
      images.push(`/media/${key}`);
    }
    await db.adminSetImages(env.DB, id, images);
  }

  const ref = `IH-${String(id).padStart(4, '0')}`;
  const leadId = await db.insertLead(env.DB, { kind: 'publicar', name, whatsapp, zone_slug: zone.slug, message: `${ref} · ${title}` });
  ctx.waitUntil(forwardToCrm(env, { id: leadId, kind: 'publicar', name, whatsapp, ref, title }).catch(() => {}));
  ctx.waitUntil(
    notifyByEmail(env, { kind: 'publicar', name, whatsapp, ref, message: title, zone_slug: zone.slug }).catch((e) =>
      console.error('Aviso por correo', e)
    )
  );

  if (account) return redirect(`/mi-cuenta?ok=publicada&ref=${ref}`);
  return redirect(`/publicar/gracias?ref=${ref}&fotos=${photos.length}`);
}

// ---------- Cuentas ----------

// Correo transaccional (enlace para nueva contraseña) vía Resend. Sin RESEND_API_KEY no se envía
// y la solicitud queda marcada en /admin/cuentas para enviarla por WhatsApp.
async function sendMail(env, to, subject, text) {
  if (!env.RESEND_API_KEY || !to) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.ACCOUNT_MAIL_FROM || 'inmuhub <cuentas@inmuhub.com>', to: [to], subject, text }),
  });
  if (!res.ok) console.error('Resend', res.status, await res.text().catch(() => ''));
  return res.ok;
}

function alertMailer(env) {
  return (s, p) => {
    const first = (s.name || '').split(' ')[0];
    const text = [
      `Hola${first ? ', ' + first : ''}:`,
      '',
      'Entró a inmuhub una propiedad que coincide con su búsqueda guardada:',
      '',
      `${p.title}`,
      `${p.zone_name || ''} · ${formatMoney(p.price_amount, p.currency)}`,
      `${env.SITE_URL}/propiedad/${p.slug}`,
      '',
      `Puede ver o borrar sus búsquedas en ${env.SITE_URL}/mi-cuenta`,
      '',
      'inmuhub · Portal inmobiliario curado en Guatemala',
    ].join('\n');
    return sendMail(env, s.email, 'Nueva propiedad para su búsqueda', text);
  };
}

async function sendResetEmail(env, acc, link) {
  if (!env.RESEND_API_KEY) return false;
  const first = (acc.name || '').split(' ')[0];
  const text = [
    `Hola${first ? ', ' + first : ''}:`,
    '',
    'Recibimos una solicitud para crear una nueva contraseña en inmuhub.',
    'Use este enlace (vale por una hora y sirve una sola vez):',
    '',
    link,
    '',
    'Si usted no lo pidió, ignore este correo: su contraseña actual sigue igual.',
    '',
    'inmuhub · Portal inmobiliario curado en Guatemala',
  ].join('\n');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.ACCOUNT_MAIL_FROM || 'inmuhub <cuentas@inmuhub.com>',
      to: [acc.email],
      subject: 'Su enlace para crear una nueva contraseña',
      text,
    }),
  });
  if (!res.ok) console.error('Resend', res.status, await res.text().catch(() => ''));
  return res.ok;
}

function safeNext(next) {
  return /^\/(?!\/)[a-z0-9/_-]*(\?[a-z0-9=&_.-]{0,200})?(#[a-z0-9-]+)?$/i.test(next || '') && !next.startsWith('/admin') ? next : '/mi-cuenta';
}

async function handleAccounts(request, env, url, path, method) {
  const noStore = { 'Cache-Control': 'no-store' };
  const ip = request.headers.get('CF-Connecting-IP') || '';

  if (path === '/ingresar' && method === 'GET') {
    if (await auth.currentAccount(request, env.DB)) return redirect(safeNext(url.searchParams.get('next') || ''));
    const notice = { salida: 'Cerró su sesión.' }[url.searchParams.get('ok')];
    return page(acviews.loginPage(env, { next: url.searchParams.get('next') || '', notice }), 200, noStore);
  }

  if (path === '/ingresar' && method === 'POST') {
    const form = await request.formData();
    const email = field(form, 'correo', 120).toLowerCase();
    const password = typeof form.get('clave') === 'string' ? form.get('clave').slice(0, 200) : '';
    const next = safeNext(field(form, 'next', 200));
    const fail = (error, status = 401) => page(acviews.loginPage(env, { error, email, next }), status, noStore);
    if (!email || !password) return fail('Escriba su correo y contraseña.', 422);
    if (await auth.tooManyAttempts(env.DB, email)) return fail('Demasiados intentos. Espere 15 minutos o use «¿Olvidó su contraseña?».', 429);
    const acc = await db.findAccountByEmail(env.DB, email);
    if (!acc || !(await auth.verifyPassword(password, acc.password_hash))) {
      await auth.recordFailure(env.DB, email, ip);
      return fail('Correo o contraseña incorrectos.');
    }
    if (acc.status === 'suspendida') return fail('Esta cuenta está suspendida. Escríbanos por WhatsApp si cree que es un error.', 403);
    await auth.clearFailures(env.DB, email);
    return redirect(next, 303, { 'Set-Cookie': await auth.createSession(env.DB, acc.id) });
  }

  if (path === '/recuperar' && method === 'GET') {
    return page(acviews.forgotPage(env, {}), 200, noStore);
  }

  if (path === '/recuperar' && method === 'POST') {
    const form = await request.formData();
    const email = field(form, 'correo', 120).toLowerCase();
    if (field(form, 'empresa_web')) return redirect('/');
    if (!auth.validEmail(email)) return page(acviews.forgotPage(env, { error: 'Escriba un correo válido.', email }), 422, noStore);
    if (env.PUBLISH_LIMITER) {
      const { success } = await env.PUBLISH_LIMITER.limit({ key: `rec:${ip || 'local'}` });
      if (!success) return page(acviews.forgotPage(env, { error: 'Recibimos varias solicitudes seguidas. Espere un minuto e intente de nuevo.', email }), 429, noStore);
    }
    const acc = await db.findAccountByEmail(env.DB, email);
    // La respuesta es la misma exista o no la cuenta, para no revelar qué correos están registrados.
    if (acc && acc.status !== 'suspendida' && (await auth.recentResetRequests(env.DB, acc.id)) < 3) {
      let sent = false;
      if (env.RESEND_API_KEY) {
        const token = await auth.createResetToken(env.DB, acc.id, 'correo');
        sent = await sendResetEmail(env, acc, `${env.SITE_URL}/restablecer?t=${token}`).catch((e) => {
          console.error('Correo de clave', e);
          return false;
        });
      }
      if (!sent) await auth.recordResetRequest(env.DB, acc.id);
    }
    return page(acviews.forgotPage(env, { sent: true, email, byWhatsapp: !env.RESEND_API_KEY }), 200, noStore);
  }

  if (path === '/restablecer' && method === 'GET') {
    const token = url.searchParams.get('t') || '';
    const r = await auth.findReset(env.DB, token);
    if (!r || r.status === 'suspendida') return page(acviews.resetPage(env, { invalid: true }), 410, noStore);
    return page(acviews.resetPage(env, { token, name: r.name }), 200, { ...noStore, 'Referrer-Policy': 'no-referrer' });
  }

  if (path === '/restablecer' && method === 'POST') {
    const form = await request.formData();
    const token = field(form, 't', 64);
    const r = await auth.findReset(env.DB, token);
    if (!r || r.status === 'suspendida') return page(acviews.resetPage(env, { invalid: true }), 410, noStore);
    const pw = typeof form.get('clave') === 'string' ? form.get('clave').slice(0, 200) : '';
    const pw2 = typeof form.get('clave2') === 'string' ? form.get('clave2').slice(0, 200) : '';
    const problem = auth.passwordProblem(pw) || (pw !== pw2 ? 'Las dos contraseñas no coinciden.' : null);
    if (problem) return page(acviews.resetPage(env, { token, name: r.name, error: problem }), 422, noStore);
    await db.setAccountPassword(env.DB, r.account_id, await auth.hashPassword(pw)); // cierra las demás sesiones
    await auth.consumeReset(env.DB, r.token_hash, r.account_id);
    await auth.clearFailures(env.DB, r.email);
    return redirect('/mi-cuenta?ok=clave', 303, { 'Set-Cookie': await auth.createSession(env.DB, r.account_id) });
  }

  if (path === '/registro' && method === 'GET') {
    if (await auth.currentAccount(request, env.DB)) return redirect(safeNext(url.searchParams.get('next') || ''));
    const tipo = url.searchParams.get('tipo');
    const role = ['asesor', 'propietario', 'comprador'].includes(tipo) ? tipo : 'comprador';
    const next = safeNext(url.searchParams.get('next') || '');
    return page(acviews.registerPage(env, { role, next: next === '/mi-cuenta' ? '' : next }), 200, noStore);
  }

  if (path === '/registro' && method === 'POST') {
    const form = await request.formData();
    if (field(form, 'empresa_web')) return redirect('/');
    if (env.PUBLISH_LIMITER) {
      const { success } = await env.PUBLISH_LIMITER.limit({ key: `reg:${ip || 'local'}` });
      if (!success) return new Response('Demasiados registros seguidos. Intente en un minuto.', { status: 429 });
    }
    const tipo = field(form, 'tipo', 12);
    const role = ['asesor', 'propietario', 'comprador'].includes(tipo) ? tipo : 'comprador';
    const next = safeNext(field(form, 'next', 200));
    const values = { nombre: field(form, 'nombre', 80), whatsapp: field(form, 'whatsapp', 20), correo: field(form, 'correo', 120), empresa: field(form, 'empresa', 80) };
    const fail = (error) => page(acviews.registerPage(env, { role, values, error, next: next === '/mi-cuenta' ? '' : next }), 422, noStore);
    const name = cleanText(values.nombre);
    const email = values.correo.toLowerCase();
    const whatsapp = normalizeWhatsapp(values.whatsapp);
    const password = typeof form.get('clave') === 'string' ? form.get('clave') : '';
    if (!name) return fail('Escriba su nombre.');
    if (!whatsapp) return fail('Revise su número de WhatsApp: debe tener 8 dígitos (o incluir el código de país).');
    if (!auth.validEmail(email)) return fail('Revise su correo.');
    const pwProblem = auth.passwordProblem(password);
    if (pwProblem) return fail(pwProblem);
    if (await db.findAccountByEmail(env.DB, email)) return fail('Ya existe una cuenta con ese correo. Ingrese con su contraseña.');
    const id = await db.createAccount(env.DB, {
      role,
      status: role === 'asesor' ? 'pendiente' : 'activa',
      name,
      email,
      whatsapp,
      company: role === 'asesor' ? cleanText(values.empresa) || null : null,
      password_hash: await auth.hashPassword(password),
    });
    const dest = next === '/mi-cuenta' ? '/mi-cuenta?ok=bienvenida' : next;
    return redirect(dest, 303, { 'Set-Cookie': await auth.createSession(env.DB, id) });
  }

  if (path === '/mi-cuenta' && method === 'GET') {
    const account = await auth.currentAccount(request, env.DB);
    if (!account) return redirect('/ingresar?next=/mi-cuenta');
    const ref = (url.searchParams.get('ref') || '').replace(/[^A-Z0-9-]/gi, '').slice(0, 12);
    const notice = {
      bienvenida: 'Su cuenta está lista.',
      clave: 'Su nueva contraseña quedó guardada.',
      busqueda: 'Quitamos esa búsqueda.',
      publicada: `Recibimos su propiedad${ref ? ` (${ref})` : ''}. La revisamos y le escribimos por WhatsApp.`,
    }[url.searchParams.get('ok')];
    const [props, favs, searches, matches] = await Promise.all([
      db.accountProperties(env.DB, account.id),
      db.accountFavorites(env.DB, account.id),
      alertas.accountSearches(env.DB, account.id),
      alertas.accountMatches(env.DB, account.id),
    ]);
    if (matches.some((m) => !m.seen_at)) await alertas.markMatchesSeen(env.DB, account.id);
    const searchItems = searches.map((x) => ({ id: x.id, label: alertas.searchLabel(x), url: alertas.searchUrl(x) }));
    return page(acviews.accountPage(env, { account, props, notice, favs, searches: searchItems, matches }), 200, noStore);
  }

  if (path === '/salir' && method === 'POST') {
    return redirect('/ingresar?ok=salida', 303, { 'Set-Cookie': await auth.destroySession(request, env.DB) });
  }

  return null;
}

const MAX_OWNER_PHOTOS = 10;

// ---------- Proyectos ----------

async function projectReading(env, j) {
  const comparable = PROJECT_COMPARABLE[j.kind];
  const ppm2 = projectPricePerM2(j, parseJsonArray(j.typologies), usdRate(env));
  if (!comparable || !ppm2 || !j.zone_slug) return null;
  const range = await db.zoneValue(env.DB, j.zone_slug, comparable, minComparables(env));
  return { comparable, ppm2, range, position: valuePosition(ppm2, range) };
}

async function publicStats(env) {
  const [base, zones] = await Promise.all([siteStats(env), db.listZones(env.DB)]);
  return { ...base, zones: zones.filter((z) => z.slug !== 'interior').length };
}

async function siteStats(env) {
  const [counts, projects] = await Promise.all([db.adminCounts(env.DB), db.countPublicProjects(env.DB)]);
  return { properties: counts?.publicadas ?? 0, projects };
}

const BOT_UA = /bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|headless|lighthouse/i;

const PROJECT_NOTICES = {
  guardado: 'Proyecto guardado.',
  fotos: 'Imágenes agregadas.',
  orden: 'Orden de imágenes actualizado.',
  quitada: 'Imagen quitada.',
  nuevo: 'Proyecto creado como borrador. Complete los datos, agregue imágenes y publíquelo desde la lista.',
};

async function handleAdminProject(request, env, url, id, action) {
  const j = await db.adminGetProject(env.DB, id);
  if (!j) return page(views.notFoundPage(env), 404);
  const back = (ok) => redirect(`/admin/proyecto/${id}/editar?ok=${ok}`);
  const images = parseJsonArray(j.images);

  if (action === 'editar' && request.method === 'GET') {
    const [zones, developers] = await Promise.all([db.listZones(env.DB), db.listDevelopers(env.DB)]);
    return page(aviews.adminProjectEditPage(env, { j, zones, developers, notice: PROJECT_NOTICES[url.searchParams.get('ok')] }), 200, {
      'Cache-Control': 'no-store',
    });
  }

  if (action === 'reporte' && request.method === 'GET') {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      return d.toISOString().slice(0, 7);
    });
    const month = months.includes(url.searchParams.get('mes')) ? url.searchParams.get('mes') : months[0];
    const report = await db.projectMonthReport(env.DB, id, month);
    const dev = j.developer_id ? await db.getDeveloper(env.DB, j.developer_id) : null;
    return page(aviews.adminProjectReportPage(env, { j: { ...j, developer_name: dev?.name }, month, months, report }), 200, {
      'Cache-Control': 'no-store',
    });
  }

  if (request.method !== 'POST') return redirect(`/admin/proyecto/${id}/editar`);
  const form = await request.formData();

  if (action === 'accion') {
    await db.adminProjectAction(env.DB, id, field(form, 'accion', 20));
    return redirect('/admin/proyectos?ok=accion');
  }

  if (action === 'guardar') {
    const [zones, developers] = await Promise.all([db.listZones(env.DB), db.listDevelopers(env.DB)]);
    const name = cleanText(field(form, 'name', 120));
    if (!name) return page(aviews.adminProjectEditPage(env, { j, zones, developers, error: 'El nombre es obligatorio.' }), 422);
    const n = Math.min(Number(field(form, 't_count', 3)) || 8, 12);
    const typologies = parseTypologies(
      Array.from({ length: n }, (_, i) => ({
        name: field(form, `t${i}_name`, 60), bedrooms: field(form, `t${i}_bedrooms`, 4), bathrooms: field(form, `t${i}_bathrooms`, 6),
        m2: field(form, `t${i}_m2`, 10), price: field(form, `t${i}_price`, 20),
      }))
    );
    const currency = field(form, 'currency', 3) === 'GTQ' ? 'GTQ' : 'USD';
    const int = (k) => {
      const v = parseNumber(field(form, k, 6));
      return v === null ? null : Math.round(v);
    };
    const priced = typologies.filter((t) => t.price);
    const sized = typologies.filter((t) => t.m2);
    const beds = typologies.filter((t) => t.bedrooms);
    const priceFrom = parseNumber(field(form, 'price_from', 20)) ?? (priced.length ? Math.min(...priced.map((t) => t.price)) : null);
    const url_ = (k) => (/^https:\/\/\S+$/.test(field(form, k, 500)) ? field(form, k, 500) : null);
    const zoneSlug = field(form, 'zone_slug', 60);
    const devId = Number(field(form, 'developer_id', 10));
    const kind = field(form, 'kind', 20);
    const stage = field(form, 'stage', 20);
    const mode = field(form, 'contact_mode', 12);
    const fields = {
      name,
      developer_id: developers.some((d) => d.id === devId) ? devId : null,
      kind: pviews.KIND_LABELS[kind] ? kind : 'apartamentos',
      stage: pviews.STAGE_LABELS[stage] ? stage : 'preventa',
      delivery: cleanText(field(form, 'delivery', 60)) || null,
      zone_slug: zones.some((z) => z.slug === zoneSlug) ? zoneSlug : null,
      location_label: cleanText(field(form, 'location_label', 140)) || null,
      currency,
      price_from: priceFrom,
      price_from_gtq: priceFrom ? Math.round(currency === 'USD' ? priceFrom * usdRate(env) : priceFrom) : null,
      m2_from: parseNumber(field(form, 'm2_from', 10)) ?? (sized.length ? Math.min(...sized.map((t) => t.m2)) : null),
      m2_to: parseNumber(field(form, 'm2_to', 10)) ?? (sized.length ? Math.max(...sized.map((t) => t.m2)) : null),
      bedrooms_min: int('bedrooms_min') ?? (beds.length ? Math.min(...beds.map((t) => t.bedrooms)) : null),
      bedrooms_max: int('bedrooms_max') ?? (beds.length ? Math.max(...beds.map((t) => t.bedrooms)) : null),
      units_total: int('units_total'),
      units_available: int('units_available'),
      down_payment: cleanText(field(form, 'down_payment', 160)) || null,
      typologies: JSON.stringify(typologies),
      amenities: JSON.stringify(field(form, 'amenities', 1500).split(',').map((x) => cleanText(x)).filter(Boolean).slice(0, 30)),
      description: cleanText(field(form, 'description', 6000)) || null,
      brochure_url: url_('brochure_url'),
      video_url: url_('video_url'),
      tour_url: url_('tour_url'),
      contact_mode: ['whatsapp', 'formulario', 'ninguno'].includes(mode) ? mode : 'whatsapp',
    };
    if (j.slug.startsWith('nuevo-') && name !== 'Nuevo proyecto') fields.slug = `${slugify(name)}-${crypto.randomUUID().slice(0, 4)}`;
    await db.adminSaveProject(env.DB, id, fields);
    return back('guardado');
  }

  if (action === 'fotos') {
    if (!env.MEDIA) return new Response('El almacenamiento de fotos no está configurado.', { status: 500 });
    const files = form.getAll('fotos').filter((f) => typeof f === 'object' && f && f.size > 0);
    if (!files.length) return new Response('Seleccione al menos una imagen.', { status: 400 });
    if (images.length + files.length > MAX_IMAGES) return new Response(`Cada proyecto admite hasta ${MAX_IMAGES} imágenes.`, { status: 400 });
    for (const f of files) {
      if (!IMAGE_TYPES[f.type]) return new Response(`Formato no admitido: ${f.name}. Use JPG, PNG o WebP.`, { status: 400 });
      if (f.size > MAX_IMAGE_BYTES) return new Response(`La imagen ${f.name} supera 8 MB.`, { status: 400 });
    }
    for (const f of files) {
      const key = `pr/${id}/${crypto.randomUUID()}.${IMAGE_TYPES[f.type]}`;
      await env.MEDIA.put(key, await f.arrayBuffer(), { metadata: { type: f.type } });
      images.push(`/media/${key}`);
    }
    await db.adminSetProjectImages(env.DB, id, images);
    return back('fotos');
  }

  if (action === 'foto') {
    const i = Number(field(form, 'i', 3));
    const accion = field(form, 'accion', 20);
    if (!Number.isInteger(i) || i < 0 || i >= images.length) return back('orden');
    const move = (from, to) => images.splice(to, 0, images.splice(from, 1)[0]);
    if (accion === 'principal') move(i, 0);
    else if (accion === 'subir' && i > 0) move(i, i - 1);
    else if (accion === 'bajar' && i < images.length - 1) move(i, i + 1);
    else if (accion === 'quitar') {
      const [src] = images.splice(i, 1);
      if (src.startsWith('/media/') && env.MEDIA) await env.MEDIA.delete(src.slice('/media/'.length));
      await db.adminSetProjectImages(env.DB, id, images);
      return back('quitada');
    }
    await db.adminSetProjectImages(env.DB, id, images);
    return back('orden');
  }

  return redirect(`/admin/proyecto/${id}/editar`);
}

// ---------- Sitio anterior (Cloudflare Pages) ----------
// El portal atiende sus rutas; el resto se sirve desde el sitio anterior sin cambios.

const HOP_HEADERS = ['host', 'cf-connecting-ip', 'cf-ipcountry', 'cf-ray', 'cf-visitor', 'x-forwarded-proto', 'x-real-ip'];

async function legacyFetch(request, env) {
  if (!env.LEGACY_ORIGIN) return null;
  const incoming = new URL(request.url);
  const origin = new URL(env.LEGACY_ORIGIN);
  const target = new URL(incoming.pathname + incoming.search, origin);
  const headers = new Headers(request.headers);
  for (const h of HOP_HEADERS) headers.delete(h);
  const res = await fetch(target, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    redirect: 'manual',
  });
  const out = new Response(res.body, res);
  // Las redirecciones del sitio anterior deben quedarse en inmuhub.com.
  const loc = out.headers.get('Location');
  if (loc) {
    const l = new URL(loc, origin);
    if (l.host === origin.host) out.headers.set('Location', incoming.origin + l.pathname + l.search + l.hash);
  }
  out.headers.delete('X-Robots-Tag');
  return out;
}

async function legacySitemapUrls(request, env) {
  if (!env.LEGACY_ORIGIN) return [];
  try {
    const res = await fetch(new URL('/sitemap.xml', env.LEGACY_ORIGIN), { cf: { cacheTtl: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
    return locs
      .map((u) => {
        try {
          const p = new URL(u);
          return p.pathname + p.search;
        } catch {
          return null;
        }
      })
      .filter((p) => p && p !== '/' && p !== '/index.html' && !p.startsWith('/propiedades') && !/admin|dashboard/.test(p))
      .map((p) => env.SITE_URL + p);
  } catch {
    return [];
  }
}

// ---------- Admin: edición de propiedades y fotos ----------

const IMAGE_TYPES = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGES = 40;
const NOTICES = {
  guardado: 'Cambios guardados.',
  fotos: 'Fotografías agregadas.',
  orden: 'Orden de fotografías actualizado.',
  quitada: 'Fotografía quitada.',
  portada: 'Foto de portada del sitio actualizada.',
  nueva: 'Propiedad creada como pausada. Complete los datos, agregue fotos y publíquela desde el panel.',
};

async function handleAdminEdit(request, env, url, id, action) {
  const p = await db.adminGetProperty(env.DB, id);
  if (!p) return page(views.notFoundPage(env), 404);
  const back = (ok) => redirect(`/admin/propiedad/${id}/editar?ok=${ok}`);
  const images = (() => {
    try {
      const a = JSON.parse(p.images || '[]');
      return Array.isArray(a) ? a : [];
    } catch {
      return [];
    }
  })();

  if (action === 'editar' && request.method === 'GET') {
    const [zones, heroImage] = await Promise.all([db.listZones(env.DB), db.getSetting(env.DB, 'hero_image')]);
    return page(views.adminEditPage(env, { p, zones, heroImage, notice: NOTICES[url.searchParams.get('ok')] }), 200, {
      'Cache-Control': 'no-store',
    });
  }

  if (request.method !== 'POST') return redirect(`/admin/propiedad/${id}/editar`);
  const form = await request.formData();

  if (action === 'guardar') {
    const zones = await db.listZones(env.DB);
    const title = cleanText(field(form, 'title', 140));
    if (!title) {
      return page(views.adminEditPage(env, { p, zones, heroImage: await db.getSetting(env.DB, 'hero_image'), error: 'El título es obligatorio.' }), 422);
    }
    const currency = field(form, 'currency', 3) === 'USD' ? 'USD' : 'GTQ';
    const price = parseNumber(field(form, 'price_amount', 20));
    const zoneSlug = field(form, 'zone_slug', 60);
    const operation = field(form, 'operation', 20);
    const tour = field(form, 'tour_url', 500);
    const int = (k) => {
      const n = parseNumber(field(form, k, 6));
      return n === null ? null : Math.round(n);
    };
    const fields = {
      title,
      type: mapType(field(form, 'type', 20)),
      operation: ['venta', 'renta', 'venta_renta'].includes(operation) ? operation : 'venta',
      zone_slug: zones.some((z) => z.slug === zoneSlug) ? zoneSlug : null,
      location_label: cleanText(field(form, 'location_label', 140)) || null,
      price_amount: price,
      currency,
      price_gtq: price ? Math.round(currency === 'USD' ? price * usdRate(env) : price) : null,
      area_built_m2: parseNumber(field(form, 'area_built_m2', 12)),
      area_land_v2: parseNumber(field(form, 'area_land_v2', 12)),
      bedrooms: int('bedrooms'),
      bathrooms: parseNumber(field(form, 'bathrooms', 6)),
      parking: int('parking'),
      levels: int('levels'),
      description: cleanText(field(form, 'description', 6000)) || null,
      features: JSON.stringify(
        field(form, 'features', 1500).split(',').map((s) => cleanText(s)).filter(Boolean).slice(0, 30)
      ),
      tour_url: /^https:\/\/\S+$/.test(tour) ? tour : null,
      contact_mode: ['whatsapp', 'formulario', 'ninguno'].includes(field(form, 'contact_mode', 12)) ? field(form, 'contact_mode', 12) : 'whatsapp',
      verified: form.get('verified') ? 1 : 0,
      commute_valle_min: int('commute_valle_min') || null,
      commute_pico_min: int('commute_pico_min') || null,
      commute_measured_at: cleanText(field(form, 'commute_measured_at', 40)) || null,
    };
    const mapa = field(form, 'ubicacion_mapa', 600);
    if (!mapa) {
      fields.lat = null;
      fields.lng = null;
    } else {
      const coords = await resolveCoords(mapa);
      if (!coords) {
        return page(views.adminEditPage(env, { p, zones, heroImage: await db.getSetting(env.DB, 'hero_image'), error: 'No pudimos leer la ubicación. Pegue el enlace completo de Google Maps o las coordenadas «lat, lng».' }), 422);
      }
      fields.lat = coords.lat;
      fields.lng = coords.lng;
    }
    // Una propiedad nueva recibe una URL definitiva con su primer título real.
    if (p.slug.startsWith('nueva-') && title !== 'Nueva propiedad') {
      fields.slug = `${slugify(title)}-${crypto.randomUUID().slice(0, 4)}`;
    }
    await db.adminSaveProperty(env.DB, id, fields);
    return back('guardado');
  }

  if (action === 'fotos') {
    if (!env.MEDIA) return new Response('El almacenamiento de fotos no está configurado.', { status: 500 });
    const files = form.getAll('fotos').filter((f) => typeof f === 'object' && f && f.size > 0);
    if (!files.length) return new Response('Seleccione al menos una fotografía.', { status: 400 });
    if (images.length + files.length > MAX_IMAGES) {
      return new Response(`Cada propiedad admite hasta ${MAX_IMAGES} fotografías.`, { status: 400 });
    }
    for (const f of files) {
      const ext = IMAGE_TYPES[f.type];
      if (!ext) return new Response(`Formato no admitido: ${f.name}. Use JPG, PNG o WebP.`, { status: 400 });
      if (f.size > MAX_IMAGE_BYTES) return new Response(`La foto ${f.name} supera 8 MB.`, { status: 400 });
    }
    for (const f of files) {
      const key = `p/${id}/${crypto.randomUUID()}.${IMAGE_TYPES[f.type]}`;
      await env.MEDIA.put(key, await f.arrayBuffer(), { metadata: { type: f.type } });
      images.push(`/media/${key}`);
    }
    await db.adminSetImages(env.DB, id, images);
    return back('fotos');
  }

  if (action === 'foto') {
    const i = Number(field(form, 'i', 3));
    const accion = field(form, 'accion', 20);
    if (!Number.isInteger(i) || i < 0 || i >= images.length) return back('orden');
    const src = images[i];
    const move = (from, to) => images.splice(to, 0, images.splice(from, 1)[0]);
    if (accion === 'principal') move(i, 0);
    else if (accion === 'subir' && i > 0) move(i, i - 1);
    else if (accion === 'bajar' && i < images.length - 1) move(i, i + 1);
    else if (accion === 'portada') {
      await db.setSetting(env.DB, 'hero_image', src);
      return back('portada');
    } else if (accion === 'quitar') {
      images.splice(i, 1);
      if (src.startsWith('/media/') && env.MEDIA) await env.MEDIA.delete(src.slice('/media/'.length));
      if ((await db.getSetting(env.DB, 'hero_image')) === src) await db.setSetting(env.DB, 'hero_image', null);
      await db.adminSetImages(env.DB, id, images);
      return back('quitada');
    }
    await db.adminSetImages(env.DB, id, images);
    return back('orden');
  }

  return redirect(`/admin/propiedad/${id}/editar`);
}

// ---------- Router ----------

// red.inmuhub.com: solo sirve las fichas para colegas (enlaces limpios y cortos) y sus archivos.
// Cualquier otra página se redirige al portal en inmuhub.com.
const RED_ASSET = /^\/(assets\/.*|sw\.js|manifest\.json|favicon\.ico|.*\.(?:css|js|mjs|png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|map))$/i;

async function handleRed(request, env, url) {
  const toPortal = () => redirect(`${env.SITE_URL}${url.pathname === '/' ? '/' : url.pathname}${url.search}`, 301);
  if (url.pathname === '/robots.txt') {
    return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  if (!['GET', 'HEAD'].includes(request.method) || url.pathname === '/') return toPortal();
  if (RED_ASSET.test(url.pathname)) return (await legacyFetch(request, env)) || toPortal();
  // Solo se muestran fichas de propiedad: se reconocen por la marca de presentación para colegas.
  const res = await legacyFetch(new Request(request.url, { method: 'GET', headers: request.headers }), env);
  if (!res || res.status !== 200 || !(res.headers.get('Content-Type') || '').includes('text/html')) return toPortal();
  const body = await res.text();
  if (!body.includes('ih-red')) return toPortal();
  const headers = new Headers(res.headers);
  headers.delete('Content-Length');
  headers.set('X-Robots-Tag', 'noindex');
  headers.set('Cache-Control', 'public, max-age=300');
  return new Response(request.method === 'HEAD' ? null : body, { status: 200, headers });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method;

    if (url.hostname.startsWith('red.')) {
      try {
        return await handleRed(request, env, url);
      } catch (e) {
        console.error('red', e);
        return redirect(`${env.SITE_URL}/`, 302);
      }
    }

    // www.inmuhub.com -> inmuhub.com
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4);
      return redirect(url.toString(), 301);
    }

    try {
      // URLs del sitio anterior que ahora tienen versión en el portal.
      if (method === 'GET' || method === 'HEAD') {
        if (path === '/index.html') return redirect('/' + url.search, 301);
        if (path === '/propiedades.html') return redirect('/propiedades' + url.search, 301);
        const old = path.match(/^\/propiedades\/([a-z0-9-]{1,100})(?:\.html)?$/i);
        if (old) {
          const exists = await db.getPublicProperty(env.DB, old[1]);
          if (exists) return redirect(`/propiedad/${old[1]}${url.search}`, 301);
        }
      }
      if (method === 'GET' && path === '/') {
        const [zones, heroImage, stats] = await Promise.all([
          db.listZones(env.DB),
          db.getSetting(env.DB, 'hero_image'),
          publicStats(env),
        ]);
        return page(views.homePage(env, { zones, heroImage, stats, servicesSection: sviews.serviceCards() }), 200, { 'Cache-Control': 'public, max-age=120' });
      }

      if (method === 'GET' && path === '/servicios') return page(sviews.servicesIndexPage(env));

      if (method === 'GET' && path === '/verificacion') {
        return page(sviews.verificationPage(env), 200, { 'Cache-Control': 'public, max-age=600' });
      }

      if (method === 'GET' && path === '/inmuhub') {
        return page(sviews.aboutPage(env, { stats: await publicStats(env) }), 200, { 'Cache-Control': 'public, max-age=300' });
      }

      const serviceMatch = path.match(/^\/servicios\/([a-z0-9-]{1,80})$/);
      if (serviceMatch && (method === 'GET' || method === 'POST')) {
        const s = serviceBySlug(serviceMatch[1]);
        if (!s) return page(views.notFoundPage(env), 404);
        const account = await auth.currentAccount(request, env.DB);
        if (method === 'GET') {
          const notice = url.searchParams.get('ok') === 'enviada' ? 'Recibimos su solicitud. Le escribiremos por WhatsApp con la propuesta.' : null;
          return page(sviews.servicePage(env, { s, account, notice }), 200, { 'Cache-Control': 'no-store' });
        }
        if (!account) return redirect(`/ingresar?next=${encodeURIComponent('/servicios/' + s.slug)}`);
        const form = await request.formData();
        const message = cleanText(field(form, 'mensaje', 1000));
        const whatsapp = account.whatsapp || normalizeWhatsapp('');
        if (!whatsapp) return page(sviews.servicePage(env, { s, account, error: 'Su cuenta no tiene WhatsApp. Escríbanos para completarlo.' }), 422);
        const leadId = await db.insertLead(env.DB, {
          kind: 'plan',
          name: account.name,
          whatsapp,
          intent: `servicio:${s.slug}`,
          message: [s.name, `${account.role} · ${account.email}`, message].filter(Boolean).join(' · '),
        });
        ctx.waitUntil(forwardToCrm(env, { id: leadId, kind: 'servicio', name: account.name, whatsapp, title: s.name, message }).catch(() => {}));
        ctx.waitUntil(
          notifyByEmail(env, { kind: 'plan', name: account.name, whatsapp, ref: s.name, message: message || s.name }).catch((e) => console.error('Aviso por correo', e))
        );
        return redirect(`/servicios/${s.slug}?ok=enviada#solicitar`);
      }

      if (method === 'GET' && path === '/propiedades') {
        // El inventario completo es para usuarios registrados.
        if (!(await auth.currentAccount(request, env.DB)) && !(await isAdmin(request, env))) {
          const [stats, zones] = await Promise.all([publicStats(env), db.listZones(env.DB)]);
          const keep = new URLSearchParams();
          for (const k of ['zona', 'tipo', 'op', 'hasta']) {
            const v = (url.searchParams.get(k) || '').replace(/[^a-z0-9-]/gi, '').slice(0, 40);
            if (v) keep.set(k, v);
          }
          const next = '/propiedades' + (keep.toString() ? '?' + keep.toString() : '');
          return page(sviews.catalogGatePage(env, { stats, zones, next }), 200, { 'Cache-Control': 'no-store' });
        }
        const filters = {
          zone: url.searchParams.get('zona') || '',
          type: url.searchParams.get('tipo') || '',
          operation: url.searchParams.get('op') || '',
          budget: views.BUDGETS.includes(Number(url.searchParams.get('hasta'))) ? Number(url.searchParams.get('hasta')) : '',
        };
        if (filters.budget) filters.maxPrice = Math.round(filters.budget * usdRate(env));
        if (filters.type && !TYPE_LABELS[filters.type]) filters.type = '';
        const [zones, list] = await Promise.all([db.listZones(env.DB), db.listProperties(env.DB, filters)]);
        const positions = await db.positionsFor(env.DB, list.items, minComparables(env));
        const listNotice = {
          busqueda: 'Búsqueda guardada. Le avisamos en «Mi cuenta» cuando entre una propiedad que coincida.',
          limite: 'Ya tiene 10 búsquedas guardadas. Borre alguna en «Mi cuenta» para agregar otra.',
        }[url.searchParams.get('ok')] || '';
        return page(views.listingPage(env, { zones, filters, items: list.items, total: list.total, positions, notice: listNotice }), 200, { 'Cache-Control': 'no-store' });
      }

      const propMatch = path.match(/^\/propiedad\/([a-z0-9-]{1,100})$/i);
      if (method === 'GET' && propMatch) {
        const p = await db.getPublicProperty(env.DB, propMatch[1]);
        if (!p) return page(views.notFoundPage(env), 404);
        if (!BOT_UA.test(request.headers.get('User-Agent') || '') && !(await isAdmin(request, env))) {
          ctx.waitUntil(db.recordPropertyView(env.DB, p.id).catch((e) => console.error('Visita', e)));
        }
        const reading = await db.propertyValueReading(env.DB, p, minComparables(env));
        const account = await auth.currentAccount(request, env.DB);
        const fav = account ? await db.isFavorite(env.DB, account.id, p.id) : false;
        const notice = {
          guardada: 'Guardada en su cuenta.',
          quitada: 'La quitamos de sus guardadas.',
          similares: 'Listo. Le escribimos por WhatsApp cuando entre una propiedad parecida.',
        }[url.searchParams.get('ok')] || '';
        const pt = approxPoint(p);
        const nearby = pt ? await cachedNearby(env, pt) : null;
        // Los servidores públicos de OpenStreetMap no responden de forma estable desde Cloudflare: se activa con POI_ENABLED=1.
        if (pt && !nearby && env.POI_ENABLED === '1') ctx.waitUntil(refreshNearby(env, pt).catch((e) => console.error('Cercanos', e)));
        return page(views.propertyPage(env, { p, reading, utm: utmFrom(url), account, fav, notice, pt, nearby }), 200, { 'Cache-Control': 'private, no-cache' });
      }

      // Guardar en favoritos y pedir propiedades similares (requiere cuenta).
      const saveMatch = path.match(/^\/(favorito|similares)\/([a-z0-9-]{1,100})$/i);
      if (method === 'POST' && saveMatch) {
        const [, action, slug] = saveMatch;
        const account = await auth.currentAccount(request, env.DB);
        if (!account) return redirect(`/ingresar?next=${encodeURIComponent(`/propiedad/${slug}`)}`);
        const p = await db.getPublicProperty(env.DB, slug);
        if (!p) return page(views.notFoundPage(env), 404);
        if (action === 'favorito') {
          const saved = await db.toggleFavorite(env.DB, account.id, p.id);
          return redirect(`/propiedad/${p.slug}?ok=${saved ? 'guardada' : 'quitada'}#guardar`, 303);
        }
        if (!account.whatsapp) return redirect(`/servicios/busqueda-asistida#solicitar`, 303);
        const lead = {
          kind: 'plan',
          name: account.name,
          whatsapp: account.whatsapp,
          intent: 'servicio:busqueda-asistida',
          message: `Similares a "${p.title}" · ${p.zone_name || p.zone_slug} · ${formatMoney(p.price_amount, p.currency)}`.slice(0, 300),
          property_id: p.id,
          zone_slug: p.zone_slug,
        };
        const id = await db.insertLead(env.DB, lead);
        const full = { id, ...lead, property_slug: p.slug, property_title: p.title };
        ctx.waitUntil(forwardToCrm(env, full).then((ok) => ok && db.markLeadSynced(env.DB, id)).catch((e) => console.error('CRM webhook', e)));
        ctx.waitUntil(notifyByEmail(env, full).catch((e) => console.error('Aviso por correo', e)));
        return redirect(`/propiedad/${p.slug}?ok=similares#guardar`, 303);
      }

      // Búsquedas guardadas
      if (method === 'POST' && path === '/busqueda/guardar') {
        const form = await request.formData();
        const f = {
          zone: field(form, 'zona', 60),
          type: field(form, 'tipo', 20),
          operation: ['venta', 'renta'].includes(field(form, 'op', 10)) ? field(form, 'op', 10) : '',
          budget: views.BUDGETS.includes(Number(field(form, 'hasta', 10))) ? Number(field(form, 'hasta', 10)) : 0,
        };
        const zones = await db.listZones(env.DB);
        if (!zones.some((z) => z.slug === f.zone)) f.zone = '';
        if (f.type && !TYPE_LABELS[f.type]) f.type = '';
        if (f.budget) f.maxPrice = Math.round(f.budget * usdRate(env));
        const q = new URLSearchParams(Object.entries({ zona: f.zone, tipo: f.type, op: f.operation, hasta: f.budget || '' }).filter(([, v]) => v));
        const back = '/propiedades' + (q.toString() ? '?' + q : '');
        const account = await auth.currentAccount(request, env.DB);
        if (!account) return redirect(`/ingresar?next=${encodeURIComponent(back)}`, 303);
        const id = await alertas.saveSearch(env.DB, account.id, f);
        q.set('ok', id ? 'busqueda' : 'limite');
        return redirect(`/propiedades?${q}`, 303);
      }
      const delSearch = path.match(/^\/busqueda\/(\d+)\/borrar$/);
      if (method === 'POST' && delSearch) {
        const account = await auth.currentAccount(request, env.DB);
        if (!account) return redirect('/ingresar?next=/mi-cuenta', 303);
        await alertas.deleteSearch(env.DB, account.id, Number(delSearch[1]));
        return redirect('/mi-cuenta?ok=busqueda#busquedas', 303);
      }

      if (method === 'GET' && path === '/api/sesion') {
        const account = await auth.currentAccount(request, env.DB);
        const nombre = account ? (account.name || '').trim().split(/\s+/)[0] : '';
        return new Response(JSON.stringify(account ? { sesion: true, nombre, rol: account.role } : { sesion: false }), {
          headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-cache', ...SECURITY_HEADERS },
        });
      }

      if (method === 'GET' && path === '/proyectos') {
        const filters = {
          zone: url.searchParams.get('zona') || '',
          kind: url.searchParams.get('tipo') || '',
          stage: url.searchParams.get('etapa') || '',
        };
        if (filters.kind && !pviews.KIND_LABELS[filters.kind]) filters.kind = '';
        if (filters.stage && !pviews.STAGE_LABELS[filters.stage]) filters.stage = '';
        const [zones, items] = await Promise.all([db.listZones(env.DB), db.listProjects(env.DB, { ...filters, limit: 60 })]);
        return page(pviews.projectsPage(env, { zones, filters, items }), 200, { 'Cache-Control': 'public, max-age=120' });
      }

      const projectMatch = path.match(/^\/proyecto\/([a-z0-9-]{1,100})$/i);
      if (method === 'GET' && projectMatch) {
        const j = await db.getPublicProject(env.DB, projectMatch[1]);
        if (!j) return page(views.notFoundPage(env), 404);
        if (!BOT_UA.test(request.headers.get('User-Agent') || '') && !(await isAdmin(request, env))) {
          ctx.waitUntil(db.recordProjectView(env.DB, j.id).catch((e) => console.error('Visita', e)));
        }
        const account = await auth.currentAccount(request, env.DB);
        if (account) ctx.waitUntil(db.recordProjectUnlock(env.DB, j.id, account.id).catch((e) => console.error('Acceso', e)));
        return page(pviews.projectPage(env, { j, reading: await projectReading(env, j), utm: utmFrom(url), account }), 200, { 'Cache-Control': 'no-store' });
      }

      if (method === 'GET' && path === '/comparar') {
        const slugs = [...new Set((url.searchParams.get('p') || '').split(',').map((x) => x.trim()).filter((x) => /^[a-z0-9-]{1,100}$/i.test(x)))].slice(0, 3);
        const items = await db.getPublicProjects(env.DB, slugs);
        const readings = new Map();
        for (const j of items) readings.set(j.id, await projectReading(env, j));
        return page(pviews.comparePage(env, { items, readings }), 200, { 'Cache-Control': 'no-store' });
      }

      const zoneMatch = path.match(/^\/zona\/([a-z0-9-]{1,60})$/);
      if (method === 'GET' && zoneMatch) {
        const zone = await db.getZone(env.DB, zoneMatch[1]);
        if (!zone) return page(views.notFoundPage(env), 404);
        const min = minComparables(env);
        const [casa, apartamento, terreno, projects, list] = await Promise.all([
          db.zoneValue(env.DB, zone.slug, 'casa', min),
          db.zoneValue(env.DB, zone.slug, 'apartamento', min),
          db.zoneValue(env.DB, zone.slug, 'terreno', min),
          db.listProjects(env.DB, { zone: zone.slug, limit: 6 }),
          db.listProperties(env.DB, { zone: zone.slug, limit: 6 }),
        ]);
        const positions = await db.positionsFor(env.DB, list.items, min);
        return page(
          pviews.zonePage(env, { zone, values: { casa, apartamento, terreno }, projects, properties: list.items, positions }),
          200,
          { 'Cache-Control': 'public, max-age=300' }
        );
      }

      if (method === 'GET' && path === '/desarrolladoras') {
        return page(pviews.developersPage(env, { utm: utmFrom(url), stats: await siteStats(env) }));
      }

      if (method === 'GET' && path === '/desarrolladoras/gracias') {
        const text = 'Hola, descargué el playbook para desarrolladoras de InmuHub y quiero revisar cómo quedaría nuestro proyecto.';
        return page(pviews.developersThanksPage(env, { waUrl: waLink(env.WHATSAPP_DEFAULT, text) }), 200, { 'Cache-Control': 'no-store' });
      }

      if (method === 'GET' && path === '/valor') {
        const zones = await db.listZones(env.DB);
        const zone = url.searchParams.get('zona') ? await db.getZone(env.DB, url.searchParams.get('zona')) : null;
        const type = ['casa', 'apartamento', 'terreno'].includes(url.searchParams.get('tipo')) ? url.searchParams.get('tipo') : 'casa';
        const value = zone ? await db.zoneValue(env.DB, zone.slug, type, minComparables(env)) : null;
        const account = await auth.currentAccount(request, env.DB);
        return page(views.zoneValuePage(env, { zones, zone, type, value, utm: utmFrom(url), account }), 200, { 'Cache-Control': 'no-store' });
      }

      if (method === 'GET' && path === '/privacidad') {
        return page(views.privacyPage(env), 200, { 'Cache-Control': 'public, max-age=3600' });
      }

      if (method === 'GET' && path === '/gracias') {
        const slug = url.searchParams.get('propiedad');
        const p = slug ? await db.getPublicProperty(env.DB, slug) : null;
        return page(views.requestReceivedPage(env, { p }));
      }

      // Fotografías subidas desde /admin (Workers KV)
      const mediaMatch = path.match(/^\/media\/((?:p\/\d+|pr\/\d+|site)\/[a-z0-9-]+\.(?:webp|jpg|png))$/);
      if ((method === 'GET' || method === 'HEAD') && mediaMatch && env.MEDIA) {
        const { value, metadata } = await env.MEDIA.getWithMetadata(mediaMatch[1], { type: 'stream', cacheTtl: 3600 });
        if (!value) return page(views.notFoundPage(env), 404);
        return new Response(value, {
          headers: {
            'Content-Type': metadata?.type || 'image/webp',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }

      if (method === 'GET' && path === '/planes') {
        return page(views.plansPage(env, { utm: utmFrom(url), selected: url.searchParams.get('plan') || 'agencia' }));
      }

      if (method === 'GET' && path === '/publicar') {
        const account = await auth.currentAccount(request, env.DB);
        if (!account) return redirect('/servicios/publicacion-de-propiedades#solicitar');
        const values = account ? { nombre: account.name, whatsapp: account.whatsapp ? `+${account.whatsapp}` : '', correo: account.email } : {};
        return page(views.publishPage(env, { zones: await db.listZones(env.DB), values }), 200, { 'Cache-Control': 'no-store' });
      }

      // --- Cuentas de propietarios y asesores ---
      const acct = await handleAccounts(request, env, url, path, method);
      if (acct) return acct;

      if (method === 'POST' && path === '/consulta') return handleConsulta(request, env, ctx);
      if (method === 'POST' && path === '/publicar') {
        if (!(await auth.currentAccount(request, env.DB))) return redirect('/servicios/publicacion-de-propiedades#solicitar');
        return handlePublicar(request, env, ctx);
      }

      if (method === 'GET' && path === '/publicar/gracias') {
        const ref = /^IH-\d{1,8}$/.test(url.searchParams.get('ref') || '') ? url.searchParams.get('ref') : null;
        if (!ref) return redirect('/publicar');
        const photos = Math.min(Number(url.searchParams.get('fotos')) || 0, MAX_OWNER_PHOTOS);
        const text = `Hola, envié mi propiedad a revisión en inmuhub (referencia ${ref}).${photos ? ' Les comparto más fotografías.' : ' Aquí les comparto las fotografías.'}`;
        return page(views.publishThanksPage(env, { ref, photos, waUrl: waLink(env.WHATSAPP_DEFAULT, text) }), 200, { 'Cache-Control': 'no-store' });
      }

      // --- API pública (JSON) ---
      if (method === 'GET' && path === '/api/propiedades') {
        const list = await db.listProperties(env.DB, {
          zone: url.searchParams.get('zona') || '',
          type: url.searchParams.get('tipo') || '',
          operation: url.searchParams.get('op') || '',
          limit: Math.min(Number(url.searchParams.get('limite')) || 24, 100),
        });
        const strip = ({ contact_whatsapp, ...rest }) => rest; // el número no se expone por API
        return json({ total: list.total, items: list.items.map(strip) });
      }

      if (method === 'GET' && path === '/api/valor') {
        const zone = await db.getZone(env.DB, url.searchParams.get('zona') || '');
        if (!zone) return json({ error: 'Zona no encontrada' }, 404);
        const type = mapType(url.searchParams.get('tipo') || 'casa');
        return json({ zona: zone, tipo: type, ...(await db.zoneValue(env.DB, zone.slug, type, minComparables(env))) });
      }

      // --- Admin ---
      if (path === '/admin/login' && method === 'POST') {
        const form = await request.formData();
        const token = field(form, 'token', 200);
        if (!env.ADMIN_TOKEN || !timingSafeEqual(await sha256(token), await sha256(env.ADMIN_TOKEN))) {
          return page(views.adminLoginPage(env, { error: 'Clave incorrecta.' }), 401);
        }
        return redirect('/admin', 303, {
          'Set-Cookie': `inmu_admin=${await sessionValue(env)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`,
        });
      }

      if (path === '/admin/logout' && method === 'POST') {
        return redirect('/admin', 303, { 'Set-Cookie': 'inmu_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0' });
      }

      if (path === '/admin' || path.startsWith('/admin/')) {
        if (!(await isAdmin(request, env))) return page(views.adminLoginPage(env, {}), 401);

        const actionMatch = path.match(/^\/admin\/propiedad\/(\d+)$/);
        if (method === 'POST' && actionMatch) {
          const form = await request.formData();
          const zoneSlug = field(form, 'zona', 60);
          const accion = field(form, 'accion', 20);
          await db.adminUpdateProperty(env.DB, Number(actionMatch[1]), accion, {
            zone_slug: zoneSlug || null,
            review_notes: field(form, 'nota', 200) || null,
          });
          if (accion === 'publicar') {
            ctx.waitUntil(alertas.processAlerts(env, Number(actionMatch[1]), { sendEmail: alertMailer(env) }).catch((e) => console.error('Alertas', e)));
          }
          return redirect(request.headers.get('Referer')?.startsWith(env.SITE_URL) ? request.headers.get('Referer') : '/admin');
        }

        const editMatch = path.match(/^\/admin\/propiedad\/(\d+)\/(editar|guardar|fotos|foto)$/);
        if (editMatch) return handleAdminEdit(request, env, url, Number(editMatch[1]), editMatch[2]);

        if (method === 'POST' && path === '/admin/portada') {
          const form = await request.formData();
          const current = await db.getSetting(env.DB, 'hero_image');
          const dropOld = async () => {
            if (current && current.startsWith('/media/site/') && env.MEDIA) await env.MEDIA.delete(current.slice('/media/'.length));
          };
          if (field(form, 'accion', 20) === 'restablecer') {
            await dropOld();
            await db.setSetting(env.DB, 'hero_image', null);
            return redirect('/admin?ok=portada-ilustrativa');
          }
          const f = form.get('foto');
          if (!f || typeof f !== 'object' || !f.size) return new Response('Seleccione una fotografía.', { status: 400 });
          if (!IMAGE_TYPES[f.type]) return new Response('Formato no admitido. Use JPG, PNG o WebP.', { status: 400 });
          if (f.size > MAX_IMAGE_BYTES) return new Response('La foto supera 8 MB.', { status: 400 });
          if (!env.MEDIA) return new Response('El almacenamiento de fotos no está configurado.', { status: 500 });
          const key = `site/hero-${crypto.randomUUID()}.${IMAGE_TYPES[f.type]}`;
          await env.MEDIA.put(key, await f.arrayBuffer(), { metadata: { type: f.type } });
          await dropOld();
          await db.setSetting(env.DB, 'hero_image', `/media/${key}`);
          return redirect('/admin?ok=portada');
        }

        const projectAdmin = path.match(/^\/admin\/proyecto\/(\d+)\/(editar|guardar|fotos|foto|accion|reporte)$/);
        if (projectAdmin) return handleAdminProject(request, env, url, Number(projectAdmin[1]), projectAdmin[2]);

        if (method === 'GET' && path === '/admin/proyectos') {
          const [projects, developers] = await Promise.all([db.adminListProjects(env.DB), db.listDevelopers(env.DB)]);
          const devId = Number(url.searchParams.get('desarrolladora'));
          const editDeveloper = devId ? developers.find((d) => d.id === devId) : null;
          const notice = { accion: 'Proyecto actualizado.', desarrolladora: 'Desarrolladora guardada.' }[url.searchParams.get('ok')];
          return page(aviews.adminProjectsPage(env, { projects, developers, notice, editDeveloper }), 200, { 'Cache-Control': 'no-store' });
        }

        if (method === 'POST' && path === '/admin/proyectos/nuevo') {
          const id = await db.adminCreateProject(env.DB, `nuevo-${crypto.randomUUID().slice(0, 8)}`);
          return redirect(`/admin/proyecto/${id}/editar?ok=nuevo`);
        }

        if (method === 'POST' && path === '/admin/desarrolladora') {
          const form = await request.formData();
          const name = cleanText(field(form, 'name', 120));
          if (!name) return redirect('/admin/proyectos');
          const plan = field(form, 'plan', 12);
          const trial = field(form, 'trial_until', 10);
          const website = field(form, 'website', 200);
          const id = Number(field(form, 'id', 10)) || null;
          await db.saveDeveloper(env.DB, id, {
            name,
            slug: `${slugify(name)}-${crypto.randomUUID().slice(0, 4)}`,
            contact_name: cleanText(field(form, 'contact_name', 120)) || null,
            whatsapp: normalizeWhatsapp(field(form, 'whatsapp', 20)),
            email: field(form, 'email', 120) || null,
            website: /^https:\/\/\S+$/.test(website) ? website : null,
            plan: ['prueba', 'proyecto', 'destacado', 'pausado'].includes(plan) ? plan : 'prueba',
            trial_until: /^\d{4}-\d{2}-\d{2}$/.test(trial) ? trial : null,
            notes: cleanText(field(form, 'notes', 1000)) || null,
          });
          return redirect('/admin/proyectos?ok=desarrolladora');
        }

        if (method === 'GET' && path === '/admin/alertas') {
          const items = await alertas.pendingWhatsappAlerts(env.DB);
          return page(acviews.adminAlertsPage(env, { items }), 200, { 'Cache-Control': 'no-store' });
        }
        if (method === 'POST' && path === '/admin/alerta') {
          const form = await request.formData();
          const sid = Number(field(form, 's', 12));
          const pid = Number(field(form, 'p', 12));
          const row = await env.DB.prepare(
            `SELECT a.name, a.whatsapp, p.slug, p.title FROM search_matches m JOIN saved_searches s ON s.id = m.search_id
              JOIN accounts a ON a.id = s.account_id JOIN properties p ON p.id = m.property_id WHERE m.search_id = ? AND m.property_id = ?`
          ).bind(sid, pid).first();
          if (!row?.whatsapp) return redirect('/admin/alertas');
          await alertas.markWhatsappSent(env.DB, sid, pid);
          if (field(form, 'solo', 2) === '1') return redirect('/admin/alertas');
          const first = (row.name || '').split(' ')[0];
          return redirect(waLink(row.whatsapp, `Hola${first ? ' ' + first : ''}, entró a inmuhub una propiedad que coincide con su búsqueda: ${row.title} — ${env.SITE_URL}/propiedad/${row.slug}`));
        }

        if (method === 'GET' && path === '/admin/cuentas') {
          const accounts = await db.adminListAccounts(env.DB);
          const notice = { accion: 'Cuenta actualizada.' }[url.searchParams.get('ok')];
          return page(acviews.adminAccountsPage(env, { accounts, notice }), 200, { 'Cache-Control': 'no-store' });
        }

        const accountAction = path.match(/^\/admin\/cuenta\/(\d+)$/);
        if (method === 'POST' && accountAction) {
          const form = await request.formData();
          const id = Number(accountAction[1]);
          const action = field(form, 'accion', 20);
          if (action === 'enlace') {
            const acc = await env.DB.prepare('SELECT id, email, name, whatsapp FROM accounts WHERE id = ?').bind(id).first();
            if (!acc) return redirect('/admin/cuentas');
            const link = `${env.SITE_URL}/restablecer?t=${await auth.createResetToken(env.DB, acc.id, 'admin')}`;
            const first = (acc.name || '').split(' ')[0];
            const wa = acc.whatsapp
              ? waLink(acc.whatsapp, `Hola${first ? ' ' + first : ''}, le comparto el enlace para crear su nueva contraseña en inmuhub. Vale por una hora y sirve una sola vez: ${link}`)
              : null;
            const accounts = await db.adminListAccounts(env.DB);
            return page(acviews.adminAccountsPage(env, { accounts, resetLink: { email: acc.email, url: link, wa } }), 200, { 'Cache-Control': 'no-store' });
          }
          if (action === 'clave') {
            const temp = auth.temporaryPassword();
            await db.setAccountPassword(env.DB, id, await auth.hashPassword(temp));
            const acc = await env.DB.prepare('SELECT email FROM accounts WHERE id = ?').bind(id).first();
            const accounts = await db.adminListAccounts(env.DB);
            return page(acviews.adminAccountsPage(env, { accounts, tempPassword: { email: acc?.email || '', value: temp } }), 200, { 'Cache-Control': 'no-store' });
          }
          await db.adminAccountAction(env.DB, id, action);
          return redirect('/admin/cuentas?ok=accion');
        }

        if (method === 'POST' && path === '/admin/nueva') {
          const id = await db.adminCreateProperty(env.DB, `nueva-${crypto.randomUUID().slice(0, 8)}`);
          return redirect(`/admin/propiedad/${id}/editar?ok=nueva`);
        }

        if (method === 'GET' && path === '/admin') {
          const filter = url.searchParams.get('estado') || '';
          const [counts, props, leads, zones, heroImage] = await Promise.all([
            db.adminCounts(env.DB),
            db.adminListProperties(env.DB, filter || null),
            db.adminRecentLeads(env.DB),
            db.listZones(env.DB),
            db.getSetting(env.DB, 'hero_image'),
          ]);
          const notice = { portada: 'Portada del sitio actualizada.', 'portada-ilustrativa': 'La home vuelve a usar la imagen ilustrativa.' }[url.searchParams.get('ok')];
          return page(views.adminPage(env, { counts, props, leads, zones, filter, heroImage, notice }), 200, { 'Cache-Control': 'no-store' });
        }
      }

      if (method === 'GET' && path === '/robots.txt') {
        return new Response(
          `User-agent: *\nDisallow: /admin\nDisallow: /admin-hub.html\nDisallow: /dashboard.html\nSitemap: ${env.SITE_URL}/sitemap.xml\n`,
          { headers: { 'Content-Type': 'text/plain' } }
        );
      }

      if (method === 'GET' && path === '/sitemap.xml') {
        const [{ items }, projects, zones] = await Promise.all([
          db.listProperties(env.DB, { limit: 1000 }),
          db.listProjects(env.DB, { limit: 1000 }),
          db.listZones(env.DB),
        ]);
        const own = [
          '/', '/propiedades', '/proyectos', '/valor', '/planes', '/publicar', '/desarrolladoras', '/inmuhub', '/verificacion', '/servicios',
          ...SERVICES.map((sv) => `/servicios/${sv.slug}`),
          ...zones.map((z) => `/zona/${z.slug}`),
          ...items.map((p) => `/propiedad/${p.slug}`),
          ...projects.map((j) => `/proyecto/${j.slug}`),
        ].map(
          (u) => `${env.SITE_URL}${u}`
        );
        // Páginas del sitio anterior que siguen vivas (blog, herramientas, zonas, asesores).
        const legacy = await legacySitemapUrls(request, env);
        const urls = [...new Set([...own, ...legacy])];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
          .map((u) => `<url><loc>${u.replace(/&/g, '&amp;')}</loc></url>`)
          .join('')}</urlset>`;
        return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
      }

      // Archivos estáticos del portal (portal.css)
      if (env.ASSETS) {
        const asset = await env.ASSETS.fetch(request);
        if (asset.status !== 404) return asset;
      }
      // Todo lo demás es del sitio anterior (blog, herramientas, asesores, zonas...).
      const legacy = await legacyFetch(request, env);
      if (legacy) return legacy;
      return page(views.notFoundPage(env), 404);
    } catch (err) {
      console.error(err);
      return page('<!doctype html><meta charset="utf-8"><title>Error</title><p style="font-family:sans-serif;padding:40px">Algo falló de nuestro lado. Intente de nuevo en un momento.</p>', 500);
    }
  },
};
