// inmuhub portal — Worker principal.
import * as db from './db.js';
import * as views from './views.js';
import { normalizeWhatsapp, parseNumber, mapType, cleanText } from './normalize.js';
import { TYPE_LABELS } from './html.js';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; " +
    "script-src 'self' 'unsafe-inline' https://connect.facebook.net; connect-src 'self' https://www.facebook.com; " +
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

async function handleConsulta(request, env, ctx) {
  const form = await request.formData();
  const kind = field(form, 'tipo', 20);
  const rerender = async (error) => {
    const url = new URL(request.url);
    if (kind === 'propiedad') {
      const p = await db.getPublicProperty(env.DB, field(form, 'propiedad', 80));
      if (!p) return page(views.notFoundPage(env), 404);
      const reading = await db.propertyValueReading(env.DB, p, minComparables(env));
      return page(views.propertyPage(env, { p, reading, utm: utmFrom(url), error }), 422);
    }
    if (kind === 'valor_zona') {
      const zones = await db.listZones(env.DB);
      const zone = await db.getZone(env.DB, field(form, 'zona', 60));
      const type = mapType(field(form, 'tipo_propiedad', 20));
      const value = zone ? await db.zoneValue(env.DB, zone.slug, type, minComparables(env)) : null;
      return page(views.zoneValuePage(env, { zones, zone, type, value, utm: {}, error }), 422);
    }
    return page(views.plansPage(env, { utm: {}, error }), 422);
  };

  if (field(form, 'empresa')) return redirect('/'); // honeypot: bot
  if (!['propiedad', 'valor_zona', 'plan'].includes(kind)) return redirect('/');

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

  if (kind === 'propiedad') {
    property = await db.getPublicProperty(env.DB, field(form, 'propiedad', 80));
    if (!property) return page(views.notFoundPage(env), 404);
    lead.property_id = property.id;
    lead.zone_slug = property.zone_slug;
    destination = normalizeWhatsapp(property.contact_whatsapp) || destination;
    text = `Hola, soy ${name}. Me interesa la propiedad "${property.title}" (${env.SITE_URL}/propiedad/${property.slug}). La busco para ${lead.intent === 'invertir' ? 'invertir' : 'vivir'}.`;
  } else if (kind === 'valor_zona') {
    const zone = await db.getZone(env.DB, field(form, 'zona', 60));
    lead.zone_slug = zone?.slug || null;
    const tipo = TYPE_LABELS[mapType(field(form, 'tipo_propiedad', 20))] || 'Casa';
    text = `Hola, soy ${name}. Quiero el análisis de valor de ${zone?.name || 'mi zona'} (${tipo.toLowerCase()}). Mi interés es ${lead.intent === 'vender' ? 'vender' : 'comprar'}.`;
  } else {
    text = `Hola, soy ${name}${lead.message ? ` de ${lead.message}` : ''}. Quiero información del plan ${lead.intent || ''} de inmuhub.`;
  }

  const id = await db.insertLead(env.DB, lead);
  ctx.waitUntil(
    forwardToCrm(env, { id, ...lead, property_slug: property?.slug, property_title: property?.title })
      .then((ok) => ok && db.markLeadSynced(env.DB, id))
      .catch((e) => console.error('CRM webhook', e))
  );

  if (!destination) return redirect('/?consulta=recibida');
  return redirect(waLink(destination, text));
}

async function handlePublicar(request, env, ctx) {
  const form = await request.formData();
  const zones = await db.listZones(env.DB);
  const values = Object.fromEntries([...form.entries()].map(([k, v]) => [k, typeof v === 'string' ? v.slice(0, 2000) : '']));
  const fail = (error) => page(views.publishPage(env, { zones, values, error }), 422);

  if (field(form, 'empresa')) return redirect('/');

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

  const id = await db.insertSubmission(env.DB, {
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

  const ref = `IH-${String(id).padStart(4, '0')}`;
  const leadId = await db.insertLead(env.DB, { kind: 'publicar', name, whatsapp, zone_slug: zone.slug, message: `${ref} · ${title}` });
  ctx.waitUntil(forwardToCrm(env, { id: leadId, kind: 'publicar', name, whatsapp, ref, title }).catch(() => {}));

  const text = `Hola, soy ${name}. Envié mi propiedad a revisión en inmuhub (referencia ${ref}: ${title}). Aquí les comparto las fotografías.`;
  return page(views.publishThanksPage(env, { ref, waUrl: waLink(env.WHATSAPP_DEFAULT, text) }));
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

// ---------- Router ----------

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method;

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
        const [zones, featured] = await Promise.all([db.listZones(env.DB), db.featuredProperties(env.DB, 3)]);
        const positions = await db.positionsFor(env.DB, featured, minComparables(env));
        return page(views.homePage(env, { zones, featured, positions }), 200, { 'Cache-Control': 'public, max-age=120' });
      }

      if (method === 'GET' && path === '/propiedades') {
        const filters = {
          zone: url.searchParams.get('zona') || '',
          type: url.searchParams.get('tipo') || '',
          operation: url.searchParams.get('op') || '',
        };
        if (filters.type && !TYPE_LABELS[filters.type]) filters.type = '';
        const [zones, list] = await Promise.all([db.listZones(env.DB), db.listProperties(env.DB, filters)]);
        const positions = await db.positionsFor(env.DB, list.items, minComparables(env));
        return page(views.listingPage(env, { zones, filters, items: list.items, total: list.total, positions }));
      }

      const propMatch = path.match(/^\/propiedad\/([a-z0-9-]{1,100})$/i);
      if (method === 'GET' && propMatch) {
        const p = await db.getPublicProperty(env.DB, propMatch[1]);
        if (!p) return page(views.notFoundPage(env), 404);
        const reading = await db.propertyValueReading(env.DB, p, minComparables(env));
        return page(views.propertyPage(env, { p, reading, utm: utmFrom(url) }));
      }

      if (method === 'GET' && path === '/valor') {
        const zones = await db.listZones(env.DB);
        const zone = url.searchParams.get('zona') ? await db.getZone(env.DB, url.searchParams.get('zona')) : null;
        const type = ['casa', 'apartamento', 'terreno'].includes(url.searchParams.get('tipo')) ? url.searchParams.get('tipo') : 'casa';
        const value = zone ? await db.zoneValue(env.DB, zone.slug, type, minComparables(env)) : null;
        return page(views.zoneValuePage(env, { zones, zone, type, value, utm: utmFrom(url) }));
      }

      if (method === 'GET' && path === '/planes') {
        return page(views.plansPage(env, { utm: utmFrom(url), selected: url.searchParams.get('plan') || 'agencia' }));
      }

      if (method === 'GET' && path === '/publicar') {
        return page(views.publishPage(env, { zones: await db.listZones(env.DB) }));
      }

      if (method === 'POST' && path === '/consulta') return handleConsulta(request, env, ctx);
      if (method === 'POST' && path === '/publicar') return handlePublicar(request, env, ctx);

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
          await db.adminUpdateProperty(env.DB, Number(actionMatch[1]), field(form, 'accion', 20), {
            zone_slug: zoneSlug || null,
            review_notes: field(form, 'nota', 200) || null,
          });
          return redirect(request.headers.get('Referer')?.startsWith(env.SITE_URL) ? request.headers.get('Referer') : '/admin');
        }

        if (method === 'GET' && path === '/admin') {
          const filter = url.searchParams.get('estado') || '';
          const [counts, props, leads, zones] = await Promise.all([
            db.adminCounts(env.DB),
            db.adminListProperties(env.DB, filter || null),
            db.adminRecentLeads(env.DB),
            db.listZones(env.DB),
          ]);
          return page(views.adminPage(env, { counts, props, leads, zones, filter }), 200, { 'Cache-Control': 'no-store' });
        }
      }

      if (method === 'GET' && path === '/robots.txt') {
        return new Response(
          `User-agent: *\nDisallow: /admin\nDisallow: /admin-hub.html\nDisallow: /dashboard.html\nSitemap: ${env.SITE_URL}/sitemap.xml\n`,
          { headers: { 'Content-Type': 'text/plain' } }
        );
      }

      if (method === 'GET' && path === '/sitemap.xml') {
        const { items } = await db.listProperties(env.DB, { limit: 1000 });
        const own = ['/', '/propiedades', '/valor', '/planes', '/publicar', ...items.map((p) => `/propiedad/${p.slug}`)].map(
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
