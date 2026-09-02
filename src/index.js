var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2((target, value) => __defProp22(target, "name", { value, configurable: true }), "__name");
var SESSION_TTL = 60 * 60 * 8;
var LOGIN_MAX_ATTEMPTS = 5;
var LOGIN_LOCKOUT_SECONDS = 60 * 15;
var HOOK_ZONA = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/8105bd67-0276-4485-a0e0-50dcdb0e525d";
var HOOK_INMU = "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/8a9c31c6-547b-4bef-b8d4-d7661fcda2f6";
function formatPrecio(precio, moneda) {
  if (!precio) return "";
  var num = parseFloat(String(precio).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return String(precio);
  var fmt = num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  var m = String(moneda || "$").toUpperCase();
  if (m === "USD" || m === "$") return "$" + fmt;
  if (m === "GTQ" || m === "Q") return "Q " + fmt;
  return (moneda || "") + " " + fmt;
}
__name(formatPrecio, "formatPrecio");
__name2(formatPrecio, "formatPrecio");
var PIXEL_ID = "1668269500330907";
var PIXEL_IDS = {
  "zona-innmueble.com": "1668269500330907",
  "inmuhub.com": "1003403445392993"
  // Pixel real de InmuHub (Meta Business Manager)
};
function getPixelId(pageUrl) {
  try {
    var host = new URL(pageUrl).hostname.replace(/^www\./, "");
    return PIXEL_IDS[host] || PIXEL_ID;
  } catch (e) {
    return PIXEL_ID;
  }
}
__name(getPixelId, "getPixelId");
__name2(getPixelId, "getPixelId");
__name22(getPixelId, "getPixelId");
var NOTIFY_WEBHOOK = "https://script.google.com/macros/s/AKfycby8sAQtzXYJHyRnO5sIHgyju-_dNdS6xyjjCJPQtjWghKcWZKc3xjqX6lUxRUP3Dniu/exec";
var META_CAPI_TOKEN = "";
var META_PAGE_ID = "1616853578595692";
var META_PAGE_TOKEN = "";
function computeLeadScore(fields) {
  var score = 0;
  var pres = (fields.presupuesto || "").toString().toLowerCase();
  if (pres.indexOf("500") >= 0 || pres.indexOf("millon") >= 0 || pres.indexOf("1,000") >= 0) score += 40;
  else if (pres.indexOf("300") >= 0 || pres.indexOf("400") >= 0) score += 30;
  else if (pres.indexOf("200") >= 0 || pres.indexOf("150") >= 0) score += 20;
  else if (pres.indexOf("100") >= 0) score += 10;
  var zona = (fields.zona || "").toString().toLowerCase();
  if (zona.indexOf("14") >= 0 || zona.indexOf("15") >= 0 || zona.indexOf("cayal") >= 0) score += 25;
  else if (zona.indexOf("10") >= 0 || zona.indexOf("16") >= 0) score += 20;
  else if (zona.indexOf("fraijanes") >= 0 || zona.indexOf("salvador") >= 0) score += 15;
  else if (zona) score += 5;
  var tipo = (fields.tipo || "").toString().toLowerCase();
  if (tipo.indexOf("finca") >= 0 || tipo.indexOf("luxury") >= 0 || tipo.indexOf("penthouse") >= 0) score += 20;
  else if (tipo.indexOf("casa") >= 0 || tipo.indexOf("residencia") >= 0) score += 15;
  else if (tipo.indexOf("apartamento") >= 0 || tipo.indexOf("apto") >= 0) score += 10;
  else if (tipo.indexOf("terreno") >= 0 || tipo.indexOf("lote") >= 0) score += 10;
  if (fields.email && fields.email.indexOf("@") >= 0) score += 10;
  if (fields.telefono) score += 5;
  var tier = score >= 60 ? "HOT" : score >= 35 ? "WARM" : "COLD";
  return { score, tier };
}
__name(computeLeadScore, "computeLeadScore");
__name2(computeLeadScore, "computeLeadScore");
__name22(computeLeadScore, "computeLeadScore");
async function findPropertyByName(env, name) {
  if (!name) return null;
  try {
    var raw = await env.DB.get("propiedades");
    var data = raw ? JSON.parse(raw) : [];
    return matchPropByNameIn(data, name);
  } catch (e) {
    return null;
  }
}
__name(findPropertyByName, "findPropertyByName");
__name2(findPropertyByName, "findPropertyByName");
__name22(findPropertyByName, "findPropertyByName");
function matchPropByNameIn(propList, name) {
  if (!name) return null;
  var target = name.toLowerCase().trim();
  var exact = propList.find(function(p) {
    return (p.titulo || "").toLowerCase().trim() === target;
  });
  if (exact) return exact;
  var partial = propList.find(function(p) {
    var t = (p.titulo || "").toLowerCase();
    return t && (target.indexOf(t) >= 0 || t.indexOf(target) >= 0);
  });
  return partial || null;
}
__name(matchPropByNameIn, "matchPropByNameIn");
__name2(matchPropByNameIn, "matchPropByNameIn");
__name22(matchPropByNameIn, "matchPropByNameIn");
async function buildWhatsAppCatalogContext(env) {
  try {
    var raw = await env.DB.get("propiedades");
    var data = raw ? JSON.parse(raw) : [];
    var activas = data.filter(function(p) {
      return p.estado === "Activa" && Array.isArray(p.sitios) && p.sitios.indexOf("zona") >= 0;
    });
    return activas.map(function(p) {
      return {
        titulo: p.titulo,
        tipo: p.tipo,
        operacion: p.operacion,
        zona: p.zona,
        municipio: p.municipio,
        precio: p.priceFormatted || p.precio,
        habitaciones: p.habitaciones,
        banos: p.banos,
        area: p.area,
        url: "https://zona-innmueble.com/propiedades/" + p.slug + ".html"
      };
    });
  } catch (e) {
    return [];
  }
}
__name(buildWhatsAppCatalogContext, "buildWhatsAppCatalogContext");
var WA_HISTORY_TTL = 60 * 60 * 24;
var WA_HISTORY_MAX_TURNS = 8;
var WA_FILLER_TIMEOUT_MS = 8000;
var WA_FILLER_MESSAGE = "Dame un momento, estoy revisando esto con cuidado para darte una respuesta precisa.";
async function getWaHistory(env, phone) {
  try {
    var raw = await env.DB.get("wa_convo:" + phone);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
__name(getWaHistory, "getWaHistory");
async function saveWaHistory(env, phone, history) {
  var trimmed = history.slice(-WA_HISTORY_MAX_TURNS);
  await env.DB.put("wa_convo:" + phone, JSON.stringify(trimmed), { expirationTtl: WA_HISTORY_TTL });
}
__name(saveWaHistory, "saveWaHistory");
var DEFAULT_BRAND_VOICE = [
  "Eres el asistente de WhatsApp de Zona-INNmueble, marca de real estate premium en Guatemala especializada en propiedades de lujo, residenciales, inversion y fincas en Zona 10, Zona 14, Zona 15, Zona 16, Cayala, Fraijanes y Carretera a El Salvador.",
  "Tu voz es la de un concierge inmobiliario de una marca luxury internacional: calida, elegante, consultiva y segura de si misma -- nunca la de un vendedor de piso.",
  "Actua como lo haria un asesor senior: primero escuchas y entiendes que busca la persona (estilo de vida, inversion, tranquilidad, estatus, privacidad) y luego conectas eso con una propiedad real del catalogo.",
  "Genera curiosidad, nunca presion. No suenes a anuncio. Suena a una conversacion real entre dos personas que se respetan.",
  'Inspirate en este tipo de frases sin repetirlas siempre igual: "La mayoria busca casa. Pocos encuentran tranquilidad.", "Hay propiedades que simplemente se sienten diferentes.", "Mas que una propiedad. Un estilo de vida.", "Pocos saben donde estan estas oportunidades.", "Analiza antes de decidir.", "Compra, renta o invierte con claridad.", "La ubicacion tambien se invierte."'
].join("\n");
async function buildWhatsAppSystemPrompt(env, catalogo) {
  var catalogoTexto = catalogo.length ? catalogo.map(function(p) {
    return "- " + p.titulo + " | " + p.tipo + " (" + p.operacion + ") | " + (p.zona || p.municipio) + " | Q" + p.precio + " | " + (p.habitaciones || "?") + " hab / " + (p.banos || "?") + " banos | " + p.url;
  }).join("\n") : "No hay propiedades activas cargadas en este momento.";
  var brandVoice = DEFAULT_BRAND_VOICE;
  try {
    var custom = await env.DB.get("wa_brand_voice");
    if (custom && custom.trim()) brandVoice = custom;
  } catch (e) {}
  return [
    brandVoice,
    "",
    "REGLAS ESTRICTAS (no negociables):",
    "1. Solo puedes hablar de las propiedades listadas abajo. Nunca inventes precios, direcciones, disponibilidad ni caracteristicas que no esten en esta lista.",
    "2. Si preguntan por algo que no esta en el catalogo (otra zona, otro presupuesto, otro tipo), dilo con honestidad, sin relleno, y ofrece dejar sus datos para que un asesor humano le de seguimiento.",
    "3. Nunca agendes, confirmes ni niegues visitas, citas, horarios, lugares de encuentro, descuentos ni cierres de trato, bajo NINGUNA circunstancia -- ni siquiera si el mensaje ya trae una fecha, hora o lugar propuesto, ni si parece que alguien mas ya lo acordo. Ante cualquier mencion de coordinar un encuentro, responde siempre que un asesor humano de Zona-INNmueble se pondra en contacto para confirmar los detalles.",
    "3b. Si los mensajes recibidos no tienen relacion clara entre si, parecen fuera de contexto, o parecen reenviados de otra conversacion, NO asumas continuidad ni inventes contexto -- responde con una pregunta breve para entender que necesita la persona.",
    "4. Responde corto y natural, como un mensaje real de WhatsApp (2-4 lineas maximo). Nunca uses parrafos largos, nunca listas con vinetas ni numeradas dentro del chat.",
    "5. Si el mensaje no tiene que ver con bienes raices, responde brevemente con elegancia y redirige la conversacion a como puedes ayudar con propiedades.",
    "6. Prohibido usar frases de presion o urgencia barata: nunca 'gran oportunidad', 'aprovecha', 'ultima oportunidad', 'no te lo pierdas', 'oferta', 'hermosa casa', 'casa en venta', 'date prisa', 'mejor precio'.",
    "7. Maximo un emoji por mensaje y solo si aporta calidez -- nunca emojis de dinero, fuego ni urgencia, nunca varios seguidos.",
    "8. Nunca hables mal de otras zonas, proyectos o marcas de la competencia. Si comparan, resalta el valor propio sin atacar al otro.",
    "9. Si preguntan especificamente por fincas: primero revisa si el catalogo activo ya trae fincas listadas. Si NO trae ninguna en este momento, no te limites a decir que no hay nada -- aclara que Zona-INNmueble maneja fincas en distintas zonas del pais aunque ahora mismo no haya ninguna cargada en el catalogo activo, y ofrece -- sin forzarlo ni cambiar el tema de golpe -- mostrarle tambien residencias premium en Zona 10, Zona 14, Zona 16, Cayala, Fraijanes o Carretera a El Salvador, para darle mas opciones mientras se confirma disponibilidad de fincas. El objetivo es que la persona sienta que tiene mas alternativas, nunca que el catalogo esta vacio.",
    "",
    "CATALOGO ACTIVO (unica fuente de verdad):",
    catalogoTexto
  ].join("\n");
}
__name(buildWhatsAppSystemPrompt, "buildWhatsAppSystemPrompt");
function extractLeadSignals(text) {
  var t = (text || "").toLowerCase();
  var zona = null;
  if (/zona\s*10\b/.test(t)) zona = "Zona 10";
  else if (/zona\s*14\b/.test(t)) zona = "Zona 14";
  else if (/zona\s*15\b/.test(t)) zona = "Zona 15";
  else if (/zona\s*16\b/.test(t)) zona = "Zona 16";
  else if (/cayal/.test(t)) zona = "Cayal\xE1";
  else if (/fraijanes/.test(t)) zona = "Fraijanes";
  else if (/carretera a el salvador|carr\.?\s*a\s*el\s*salvador|carr\.?\s*salvador/.test(t)) zona = "Carretera a El Salvador";
  var tipo = null;
  if (/\bfinca\b/.test(t)) tipo = "Finca";
  else if (/\bpenthouse\b/.test(t)) tipo = "Penthouse";
  else if (/\bapartamento\b|\bapto\b/.test(t)) tipo = "Apartamento";
  else if (/\bcasa\b|\bresidencia\b/.test(t)) tipo = "Casa";
  else if (/\bterreno\b|\blote\b/.test(t)) tipo = "Terreno";
  var presupuesto = null;
  var m = t.match(/\$\s?[\d,\.]+\s*(mil|k|millon(?:es)?)?/) || t.match(/q\.?\s?[\d,\.]+\s*(mil|k|millon(?:es)?)?/);
  if (m) presupuesto = m[0];
  return { zona, tipo, presupuesto };
}
__name(extractLeadSignals, "extractLeadSignals");
function matchCatalogPropertyMention(catalogo, text) {
  var t = (text || "").toLowerCase();
  if (!t || !catalogo || !catalogo.length) return null;
  for (var i = 0; i < catalogo.length; i++) {
    var titulo = (catalogo[i].titulo || "").toLowerCase();
    if (titulo && (t.indexOf(titulo) >= 0 || titulo.indexOf(t) >= 0)) return catalogo[i].titulo;
  }
  return null;
}
__name(matchCatalogPropertyMention, "matchCatalogPropertyMention");
async function upsertWhatsAppLead(env, from, contactName, convoText, catalogo) {
  try {
    var raw = await env.DB.get("leads");
    var leads = raw ? JSON.parse(raw) : [];
    var idx = leads.findIndex(function(l) { return l.wa_from === from; });
    var isNew = idx < 0;
    var lead = isNew ? {
      id: String(Date.now()),
      wa_from: from,
      telefono: "+" + from,
      nombre: contactName || "Contacto WhatsApp",
      email: "",
      fuente: "WhatsApp IA",
      source: "WhatsApp IA",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      fecha: (/* @__PURE__ */ new Date()).toISOString(),
      stage: "Nuevo",
      zona_interes: "",
      tipo_propiedad: "",
      presupuesto: "",
      propiedad: ""
    } : leads[idx];
    var signals = extractLeadSignals(convoText);
    var propMention = matchCatalogPropertyMention(catalogo, convoText);
    var changed = isNew;
    lead.lastInboundAt = (/* @__PURE__ */ new Date()).toISOString();
    lead.followUpStage = 0;
    lead.followUpStatus = "active";
    lead.nextFollowUpAt = new Date(Date.now() + WA_FOLLOWUP_INTERVALS_DAYS[0] * 864e5).toISOString();
    if (signals.zona && lead.zona_interes !== signals.zona) { lead.zona_interes = signals.zona; changed = true; }
    if (signals.tipo && lead.tipo_propiedad !== signals.tipo) { lead.tipo_propiedad = signals.tipo; changed = true; }
    if (signals.presupuesto && lead.presupuesto !== signals.presupuesto) { lead.presupuesto = signals.presupuesto; changed = true; }
    if (propMention && lead.propiedad !== propMention) { lead.propiedad = propMention; changed = true; }
    if (contactName && lead.nombre === "Contacto WhatsApp" && contactName !== lead.nombre) { lead.nombre = contactName; changed = true; }
    var prevTier = lead.lead_tier;
    var scoring = computeLeadScore({
      presupuesto: lead.presupuesto,
      zona: lead.zona_interes,
      tipo: lead.tipo_propiedad,
      email: lead.email,
      telefono: lead.telefono
    });
    lead.lead_score = scoring.score;
    lead.lead_tier = scoring.tier;
    if (isNew) leads.push(lead); else leads[idx] = lead;
    await env.DB.put("leads", JSON.stringify(leads));
    var shouldNotify = isNew || (changed && lead.lead_tier !== prevTier);
    if (shouldNotify) {
      var NOTIFY_URL = env.NOTIFY_WEBHOOK || NOTIFY_WEBHOOK || "";
      if (NOTIFY_URL) {
        var notifyData = {
          nombre: lead.nombre,
          telefono: lead.telefono,
          email: lead.email || "",
          propiedad: lead.propiedad || "",
          presupuesto: lead.presupuesto || "",
          zona: lead.zona_interes || "",
          tipo: lead.tipo_propiedad || "",
          fuente: lead.fuente,
          fecha: lead.fecha,
          lead_score: lead.lead_score,
          lead_tier: lead.lead_tier,
          whatsapp_link: "https://wa.me/" + from
        };
        try {
          await fetch(NOTIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notifyData)
          });
        } catch (e2) {}
      }
    }
    return lead;
  } catch (e) {
    return null;
  }
}
__name(upsertWhatsAppLead, "upsertWhatsAppLead");
var WA_FOLLOWUP_INTERVALS_DAYS = [1, 3, 7, 21];
var WA_FOLLOWUP_STOP_STAGES = ["Cierre", "Perdido"];
var WA_FOLLOWUP_TEMPLATE_NAME = "seguimiento_zona_innmueble";
var WA_FOLLOWUP_TEMPLATE_LANG = "es";
var WA_24H_WINDOW_MS = 24 * 60 * 60 * 1000;
var WA_FOLLOWUP_PAID_TIERS = ["WARM", "HOT"];
var DEFAULT_FOLLOWUP_TEMPLATES = [
  "Hola {nombre}, \xBFseguimos afinando la b\xFAsqueda? Cuando quieras, aqu\xED estoy.",
  "A veces la propiedad correcta aparece cuando uno menos la busca. Si quieres, te comparto otra opci\xF3n que podr\xEDa interesarte.",
  "\xBFSigues buscando, {nombre}, o ya diste con algo? Cualquiera sea la respuesta, aqu\xED sigo disponible.",
  "Ha pasado un tiempo. Si tu b\xFAsqueda sigue en pie, con gusto retomamos donde quedamos -- y si no, fue un gusto haber conversado."
];
async function getFollowUpTemplates(env) {
  try {
    var custom = await env.DB.get("wa_followup_templates");
    if (custom) {
      var arr = JSON.parse(custom);
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch (e) {}
  return DEFAULT_FOLLOWUP_TEMPLATES;
}
__name(getFollowUpTemplates, "getFollowUpTemplates");
async function sendFollowUps(env) {
  try {
    var raw = await env.DB.get("leads");
    var leads = raw ? JSON.parse(raw) : [];
    if (!leads.length) return;
    var templates = await getFollowUpTemplates(env);
    var now = Date.now();
    var changed = false;
    for (var i = 0; i < leads.length; i++) {
      var lead = leads[i];
      if (!lead.wa_from) continue;
      if (await isAiPausedForHuman(env, lead.wa_from)) continue;
      if (WA_FOLLOWUP_STOP_STAGES.indexOf(lead.stage) >= 0) {
        if (lead.followUpStatus !== "stopped") { lead.followUpStatus = "stopped"; changed = true; }
        continue;
      }
      if (lead.followUpStatus !== "active") continue;
      if (typeof lead.followUpStage !== "number" || lead.followUpStage >= WA_FOLLOWUP_INTERVALS_DAYS.length) continue;
      if (!lead.nextFollowUpAt || new Date(lead.nextFollowUpAt).getTime() > now) continue;
      var stageIdx = lead.followUpStage;
      var tpl = templates[stageIdx] || DEFAULT_FOLLOWUP_TEMPLATES[stageIdx];
      if (!tpl) continue;
      var nombre = (lead.nombre && lead.nombre !== "Contacto WhatsApp") ? lead.nombre.split(" ")[0] : "";
      var anchorTime = lead.lastInboundAt ? new Date(lead.lastInboundAt).getTime() : now;
      var withinWindow = (now - anchorTime) < WA_24H_WINDOW_MS;
      if (!withinWindow && WA_FOLLOWUP_PAID_TIERS.indexOf(lead.lead_tier) < 0) {
        lead.followUpStatus = "completed_cold";
        changed = true;
        continue;
      }
      if (withinWindow) {
        var text = tpl.split("{nombre}").join(nombre || "").replace(/\s{2,}/g, " ").trim();
        await sendWhatsAppMessage(env, lead.wa_from, text);
      } else {
        await sendWhatsAppTemplateMessage(env, lead.wa_from, WA_FOLLOWUP_TEMPLATE_NAME, WA_FOLLOWUP_TEMPLATE_LANG, [nombre || "de nuevo"]);
      }
      lead.followUpStage = stageIdx + 1;
      if (lead.followUpStage >= WA_FOLLOWUP_INTERVALS_DAYS.length) {
        lead.followUpStatus = "completed";
      } else {
        lead.nextFollowUpAt = new Date(anchorTime + WA_FOLLOWUP_INTERVALS_DAYS[lead.followUpStage] * 864e5).toISOString();
      }
      changed = true;
    }
    if (changed) await env.DB.put("leads", JSON.stringify(leads));
  } catch (e) {
    await logWaError(env, "sendFollowUps", e);
  }
}
__name(sendFollowUps, "sendFollowUps");
var WA_SCHEDULING_GUARDRAIL_MESSAGE = "Para coordinar fechas, horarios o un encuentro, prefiero que lo confirme directamente un asesor de Zona-INNmueble contigo -- en breve te contacta. Mientras tanto, cuentame que tipo de propiedad te interesa.";
function violatesSchedulingGuardrail(text) {
  var t = (text || "").toLowerCase();
  var schedulingVerbs = /(coordinamos|coordinar|confirmo|confirmado|confirmamos|agendamos|agendo|agendado|quedamos( a| en)|nos vemos|te espero|la reuni[o\xf3]n es|programamos|programado)/;
  var timeRefs = /(ma[\xf1n]ana|hoy|pasado ma[\xf1n]ana|a las \d|el d[i\xed]a \d|esta semana|el lunes|el martes|el mi[e\xe9]rcoles|el jueves|el viernes|el s[a\xe1]bado|el domingo)/;
  return schedulingVerbs.test(t) && timeRefs.test(t);
}
__name(violatesSchedulingGuardrail, "violatesSchedulingGuardrail");
async function askWhatsAppAssistant(env, systemPrompt, history, userMessage) {
  var apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) return "Gracias por escribir a Zona-INNmueble. En breve un asesor te contacta directamente.";
  var messages = history.concat([{ role: "user", content: userMessage }]);
  var controller = new AbortController();
  var hardTimeout = setTimeout(function() { controller.abort(); }, 20000);
  try {
    var res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
        max_tokens: 400,
        system: systemPrompt,
        messages
      }),
      signal: controller.signal
    });
    clearTimeout(hardTimeout);
    var data = await res.json();
    if (data && data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text.trim();
    }
    return "Gracias por tu mensaje. En un momento un asesor de Zona-INNmueble te contacta directamente.";
  } catch (e) {
    clearTimeout(hardTimeout);
    return "Gracias por tu mensaje. En un momento un asesor de Zona-INNmueble te contacta directamente.";
  }
}
__name(askWhatsAppAssistant, "askWhatsAppAssistant");
async function sendWhatsAppMessage(env, to, text) {
  var token = env.WHATSAPP_TOKEN;
  var phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID || "1276726378858448";
  if (!token) { await logWaError(env, "sendWhatsAppMessage", "WHATSAPP_TOKEN no configurado"); return; }
  try {
    var res = await fetch("https://graph.facebook.com/v21.0/" + phoneNumberId + "/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text }
      })
    });
    if (!res.ok) {
      var errBody = await res.text().catch(function() { return ""; });
      await logWaError(env, "sendWhatsAppMessage", "Meta API " + res.status + " (to=" + to + "): " + errBody.slice(0, 500));
    }
  } catch (e) {
    await logWaError(env, "sendWhatsAppMessage", e);
  }
}
__name(sendWhatsAppMessage, "sendWhatsAppMessage");
async function sendWhatsAppTemplateMessage(env, to, templateName, langCode, bodyParams) {
  var token = env.WHATSAPP_TOKEN;
  var phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID || "1276726378858448";
  if (!token) { await logWaError(env, "sendWhatsAppTemplateMessage", "WHATSAPP_TOKEN no configurado"); return; }
  try {
    var components = [];
    if (bodyParams && bodyParams.length) {
      components.push({
        type: "body",
        parameters: bodyParams.map(function(p) { return { type: "text", text: String(p || "") }; })
      });
    }
    var res = await fetch("https://graph.facebook.com/v21.0/" + phoneNumberId + "/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: langCode },
          components
        }
      })
    });
    if (!res.ok) {
      var errBody2 = await res.text().catch(function() { return ""; });
      await logWaError(env, "sendWhatsAppTemplateMessage", "Meta API " + res.status + " template=" + templateName + " lang=" + langCode + " (to=" + to + "): " + errBody2.slice(0, 500));
    }
  } catch (e) {
    await logWaError(env, "sendWhatsAppTemplateMessage", e);
  }
}
__name(sendWhatsAppTemplateMessage, "sendWhatsAppTemplateMessage");
var WA_HUMAN_PAUSE_TTL = 259200;
async function markHumanTookOver(env, phone) {
  try {
    await env.DB.put("wa_paused:" + phone, "1", { expirationTtl: WA_HUMAN_PAUSE_TTL });
  } catch (e) {}
}
__name(markHumanTookOver, "markHumanTookOver");
async function isAiPausedForHuman(env, phone) {
  try {
    var v = await env.DB.get("wa_paused:" + phone);
    return !!v;
  } catch (e) {
    return false;
  }
}
__name(isAiPausedForHuman, "isAiPausedForHuman");
async function logWaError(env, where, err) {
  try {
    var raw = await env.DB.get("wa_debug_errors");
    var list = raw ? JSON.parse(raw) : [];
    list.push({ at: (/* @__PURE__ */ new Date()).toISOString(), where, message: String(err && err.message || err), stack: err && err.stack ? String(err.stack).slice(0, 800) : "" });
    list = list.slice(-10);
    await env.DB.put("wa_debug_errors", JSON.stringify(list));
  } catch (e2) {}
}
__name(logWaError, "logWaError");
async function processWhatsAppTurn(env, from, userText, contactName) {
  var catalogo = await buildWhatsAppCatalogContext(env);
  var paused = await isAiPausedForHuman(env, from);
  if (paused) {
    var pausedHistory = await getWaHistory(env, from);
    pausedHistory.push({ role: "user", content: userText });
    await saveWaHistory(env, from, pausedHistory);
    var pausedConvoText = pausedHistory.map(function(h) { return h.content; }).join(" ");
    await upsertWhatsAppLead(env, from, contactName, pausedConvoText, catalogo);
    return;
  }
  var history = await getWaHistory(env, from);
  var systemPrompt = await buildWhatsAppSystemPrompt(env, catalogo);
  var fillerTimer = setTimeout(function() {
    sendWhatsAppMessage(env, from, WA_FILLER_MESSAGE).catch(function() {});
  }, WA_FILLER_TIMEOUT_MS);
  var reply = await askWhatsAppAssistant(env, systemPrompt, history, userText);
  clearTimeout(fillerTimer);
  if (violatesSchedulingGuardrail(reply)) {
    reply = WA_SCHEDULING_GUARDRAIL_MESSAGE;
  }
  await sendWhatsAppMessage(env, from, reply);
  history.push({ role: "user", content: userText });
  history.push({ role: "assistant", content: reply });
  await saveWaHistory(env, from, history);
  var convoText = history.map(function(h) { return h.content; }).join(" ");
  await upsertWhatsAppLead(env, from, contactName, convoText, catalogo);
}
__name(processWhatsAppTurn, "processWhatsAppTurn");
var WaConversationDO = class {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  async fetch(request) {
    try {
      var body = await request.json();
      await processWhatsAppTurn(this.env, body.from, body.userText, body.contactName);
      return new Response("ok");
    } catch (e) {
      await logWaError(this.env, "WaConversationDO.fetch", e);
      return new Response("error", { status: 500 });
    }
  }
};
async function handleWhatsAppMessage(body, env) {
  try {
    var entries = body.entry || [];
    for (var e = 0; e < entries.length; e++) {
      var changes = entries[e].changes || [];
      for (var c = 0; c < changes.length; c++) {
        var value = changes[c].value || {};
        var echoes = value.message_echoes || value.smb_message_echoes || [];
        for (var q = 0; q < echoes.length; q++) {
          if (echoes[q] && echoes[q].to) {
            await markHumanTookOver(env, echoes[q].to);
          }
        }
        var messages = value.messages || [];
        var contactName = (value.contacts && value.contacts[0] && value.contacts[0].profile && value.contacts[0].profile.name) || "";
        for (var m = 0; m < messages.length; m++) {
          var msg = messages[m];
          if (msg.type !== "text" || !msg.text || !msg.text.body) continue;
          var from = msg.from;
          var userText = msg.text.body;
          try {
            if (env.WA_CONVO) {
              var doId = env.WA_CONVO.idFromName(from);
              var stub = env.WA_CONVO.get(doId);
              await stub.fetch("https://wa-convo.internal/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ from, userText, contactName })
              });
            } else {
              await processWhatsAppTurn(env, from, userText, contactName);
            }
          } catch (eDispatch) {
            await logWaError(env, "handleWhatsAppMessage.dispatch", eDispatch);
          }
        }
      }
    }
  } catch (e2) {
  }
}
__name(handleWhatsAppMessage, "handleWhatsAppMessage");
async function hashSHA256(value) {
  var encoder = new TextEncoder();
  var data = encoder.encode(value);
  var hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(function(b) {
    return b.toString(16).padStart(2, "0");
  }).join("");
}
__name(hashSHA256, "hashSHA256");
__name2(hashSHA256, "hashSHA256");
__name22(hashSHA256, "hashSHA256");
async function triggerRebuild() {
  try {
    await Promise.all([
      fetch(HOOK_ZONA, { method: "POST" }),
      fetch(HOOK_INMU, { method: "POST" })
    ]);
  } catch (e) {
  }
}
__name(triggerRebuild, "triggerRebuild");
__name2(triggerRebuild, "triggerRebuild");
__name22(triggerRebuild, "triggerRebuild");
async function requireAuth(request, env) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return false;
  return await env.DB.get("session:" + match[1]) === "valid";
}
__name(requireAuth, "requireAuth");
__name2(requireAuth, "requireAuth");
__name22(requireAuth, "requireAuth");
function generateToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateToken, "generateToken");
__name2(generateToken, "generateToken");
__name22(generateToken, "generateToken");
function getDynamicGridJS() {
  return `
(function(){
  var API = 'https://zona-inmu.tours-virtuales-gt.workers.dev';
  function fetchProps(cb) {
    fetch(API + '/api/propiedades-publicas', { cache: 'no-cache' })
      .then(function(r){ return r.json(); })
      .then(function(data){ cb(null, data); })
      .catch(function(e){ cb(e, []); });
  }
  window.__zonaInmuLoadProps = fetchProps;
  document.dispatchEvent(new CustomEvent('zonaInmuReady'));
})();
`;
}
__name(getDynamicGridJS, "getDynamicGridJS");
__name2(getDynamicGridJS, "getDynamicGridJS");
__name22(getDynamicGridJS, "getDynamicGridJS");
function getAdminHTML() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin \xB7 Zona INNmueble</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.27.0/dist/tabler-icons.min.css">
<style>
:root{
  --navy:#0D1B3E;--navy2:#142240;--navy3:#1A3060;
  --or:#F5820D;--or2:#FF9B2E;
  --wh:#fff;--bg:#F0F2F5;
  --text:#1A1A2E;--text2:#4A5568;--text3:#8A9BB0;
  --border:#E2E8F0;--border2:#CBD5E0;
  --green:#22c55e;--red:#ef4444;--yellow:#f59e0b;--blue:#3b82f6;
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);font-size:14px}
input,select,textarea,button{font-family:inherit;font-size:13px}
a{text-decoration:none;color:inherit}

/* LOGIN */
#loginPage{position:fixed;inset:0;background:var(--navy);display:flex;justify-content:center;align-items:center;z-index:9999}
.login-card{background:var(--wh);border-radius:14px;padding:44px 40px;width:100%;max-width:380px;box-shadow:0 24px 60px rgba(0,0,0,.4)}
.login-logo{font-size:22px;font-weight:800;color:var(--navy);letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px}
.login-logo span{color:var(--or)}
.login-sub{color:var(--text3);font-size:13px;margin-bottom:28px}
.login-field{margin-bottom:14px}
.login-field label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--navy);margin-bottom:5px}
.login-field input{width:100%;padding:10px 13px;border:1.5px solid var(--border2);border-radius:7px;font-size:14px;outline:none;transition:border-color .15s}
.login-field input:focus{border-color:var(--or)}
#loginBtn{width:100%;padding:12px;background:var(--navy);color:var(--wh);border:none;border-radius:7px;font-weight:700;font-size:14px;cursor:pointer;transition:background .15s}
#loginBtn:hover{background:var(--navy3)}
#loginErr{background:#FEF2F2;color:#B91C1C;border-radius:6px;padding:10px 14px;font-size:13px;margin-top:12px;display:none}

/* APP */
#adminApp{display:none;height:100vh;overflow:hidden}
.app{display:flex;height:100vh;overflow:hidden}

/* SIDEBAR */
.sidebar{width:230px;background:var(--navy);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto}
.sb-logo{padding:18px 20px 16px;border-bottom:1px solid rgba(255,255,255,.08)}
.sb-brand{font-size:14px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--wh)}
.sb-brand span{color:var(--or)}
.sb-sub{font-size:10px;color:rgba(255,255,255,.3);margin-top:2px}
.sb-nav{padding:10px 0;flex:1}
.sb-section{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.22);padding:14px 20px 5px}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 20px;font-size:12px;color:rgba(255,255,255,.55);cursor:pointer;transition:all .15s;border-right:2px solid transparent}
.sb-item:hover{color:var(--wh);background:rgba(255,255,255,.06)}
.sb-item.active{color:var(--wh);background:rgba(245,130,13,.15);border-right-color:var(--or)}
.sb-item i{font-size:17px;flex-shrink:0}
.sb-badge{margin-left:auto;background:var(--or);color:var(--navy);font-size:10px;font-weight:700;padding:1px 7px;border-radius:20px}
.sb-badge.new{background:var(--green)}
.sb-bottom{padding:14px 20px;border-top:1px solid rgba(255,255,255,.08)}
.sb-user{display:flex;align-items:center;gap:10px}
.sb-avatar{width:34px;height:34px;border-radius:50%;background:var(--or);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--navy);flex-shrink:0}
.sb-uname{font-size:12px;color:rgba(255,255,255,.8);font-weight:600}
.sb-urole{font-size:10px;color:rgba(255,255,255,.35)}

/* MAIN */
.main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
.topbar{background:var(--wh);border-bottom:1px solid var(--border);padding:0 24px;height:58px;display:flex;align-items:center;gap:10px;flex-shrink:0}
.topbar-title{font-size:16px;font-weight:700;color:var(--navy);flex:1}
.content{flex:1;overflow-y:auto;padding:24px;min-height:0}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .15s}
.btn-primary{background:var(--or);color:var(--wh)}
.btn-primary:hover{background:var(--or2)}
.btn-navy{background:var(--navy);color:var(--wh)}
.btn-navy:hover{background:var(--navy3)}
.btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2)}
.btn-ghost:hover{background:var(--bg)}
.btn-green{background:var(--green);color:var(--wh)}
.btn-sm{padding:5px 12px;font-size:11px}
.btn i{font-size:15px}

/* DASHBOARD STATS */
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:22px}
.stat-card{background:var(--wh);border:1px solid var(--border);border-radius:10px;padding:18px 20px;position:relative;overflow:hidden}
.stat-card::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:var(--or)}
.stat-card.green::before{background:var(--green)}
.stat-card.blue::before{background:var(--blue)}
.stat-card.red::before{background:var(--red)}
.stat-card.yellow::before{background:var(--yellow)}
.stat-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);margin-bottom:8px}
.stat-val{font-size:28px;font-weight:800;color:var(--navy);line-height:1}
.stat-sub{font-size:11px;color:var(--text3);margin-top:5px}
.stat-icon{position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:28px;color:var(--border);opacity:.7}

/* DASHBOARD GRID */
.dash-grid{display:grid;grid-template-columns:1fr 340px;gap:16px}
@media(max-width:1100px){.dash-grid{grid-template-columns:1fr}}

/* TABLE */
.table-wrap{background:var(--wh);border:1px solid var(--border);border-radius:10px;overflow:hidden}
.table-header{padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--border)}
.table-title{font-size:13px;font-weight:700;color:var(--navy)}
.search-box{display:flex;align-items:center;gap:8px;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:7px 12px;flex:1;max-width:280px}
.search-box i{font-size:16px;color:var(--text3)}
.search-box input{border:none;background:transparent;outline:none;width:100%;font-size:13px;color:var(--text)}
table{width:100%;border-collapse:collapse}
th{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text3);padding:11px 14px;text-align:left;background:var(--bg);border-bottom:1px solid var(--border);white-space:nowrap}
td{padding:11px 14px;border-bottom:1px solid var(--border);vertical-align:middle;font-size:13px}
tr:last-child td{border-bottom:none}
tr:hover td{background:#FAFBFF}
.prop-img{width:48px;height:38px;border-radius:5px;object-fit:cover;background:var(--bg);border:1px solid var(--border);display:block}
.prop-name{font-weight:600;color:var(--navy);max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.prop-loc{font-size:11px;color:var(--text3);margin-top:1px}
.price-cell{font-weight:700;color:var(--or);white-space:nowrap}
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
.badge-green{background:#dcfce7;color:#166534}
.badge-red{background:#fee2e2;color:#991b1b}
.badge-gray{background:#f1f5f9;color:#475569}
.badge-orange{background:#ffedd5;color:#9a3412}
.badge-blue{background:#dbeafe;color:#1e40af}
.badge-yellow{background:#fef3c7;color:#92400e}
.actions-cell{display:flex;gap:5px}
.icon-btn{width:30px;height:30px;border-radius:6px;border:1px solid var(--border);background:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text2);transition:all .15s}
.icon-btn:hover{background:var(--navy);color:var(--wh);border-color:var(--navy)}
.icon-btn.danger:hover{background:var(--red);border-color:var(--red)}
.icon-btn.success:hover{background:var(--green);border-color:var(--green)}
.icon-btn i{font-size:15px}

/* COMPLETION BAR */
.completion-bar{height:4px;background:var(--border);border-radius:2px;margin-top:4px;width:80px}
.completion-fill{height:100%;border-radius:2px;transition:width .3s}

/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;z-index:500;overflow-y:auto;padding:16px}
.modal-overlay.open{display:flex;align-items:flex-start;justify-content:center}
.modal-panel{background:var(--wh);width:100%;max-width:960px;border-radius:12px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.4);display:flex;flex-direction:column;max-height:calc(100vh - 32px)}
.modal-topbar{background:var(--navy);padding:0 20px;height:54px;display:flex;align-items:center;gap:12px;flex-shrink:0}
.modal-topbar-title{font-size:14px;font-weight:700;color:var(--wh);flex:1}
.modal-progress{font-size:11px;color:rgba(255,255,255,.5);white-space:nowrap}
.modal-body{display:flex;flex:1;min-height:0;overflow:hidden}

/* FORM TABS */
.form-tabs-nav{width:160px;background:#F8FAFC;border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;padding:12px 0}
.ftab{display:flex;align-items:center;gap:8px;padding:10px 16px;font-size:12px;font-weight:500;color:var(--text3);cursor:pointer;border-right:2px solid transparent;transition:all .15s}
.ftab:hover{color:var(--navy);background:rgba(0,0,0,.03)}
.ftab.active{color:var(--or);background:rgba(245,130,13,.06);border-right-color:var(--or);font-weight:700}
.ftab i{font-size:16px;flex-shrink:0}
.ftab-dot{width:6px;height:6px;border-radius:50%;background:var(--green);margin-left:auto;display:none}
.ftab.has-data .ftab-dot{display:block}
.form-tabs-body{flex:1;overflow-y:auto;padding:20px}
.ftab-panel{display:none}
.ftab-panel.active{display:block}
.form-right{width:280px;border-left:1px solid var(--border);padding:16px;overflow-y:auto;flex-shrink:0;background:var(--bg)}

/* FORM ELEMENTS */
.fsec{margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid var(--border)}
.fsec:last-child{border-bottom:none;margin-bottom:0}
.fsec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--navy);margin-bottom:12px;display:flex;align-items:center;gap:7px}
.fsec-title i{font-size:16px;color:var(--or)}
.fg{margin-bottom:10px}
.fg:last-child{margin-bottom:0}
.fg label{display:block;font-size:11px;font-weight:600;color:var(--text2);margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}
.fg input,.fg select,.fg textarea{width:100%;padding:8px 10px;border:1px solid var(--border2);border-radius:6px;font-size:13px;color:var(--text);background:var(--wh);outline:none;transition:border-color .15s}
.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--or);box-shadow:0 0 0 2px rgba(245,130,13,.1)}
.fg textarea{resize:vertical;min-height:70px}
.fg-row{display:grid;gap:10px}
.fg-row.c2{grid-template-columns:1fr 1fr}
.fg-row.c3{grid-template-columns:1fr 1fr 1fr}
.fg-row.c4{grid-template-columns:1fr 1fr 1fr 1fr}
.fg-hint{font-size:11px;color:var(--text3);margin-top:3px}
.fg-auto{font-size:11px;color:var(--blue);margin-top:2px;cursor:pointer}

/* CHARS */
.chars-group{margin-bottom:14px}
.chars-group-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text2);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.chars-group-title i{font-size:14px;color:var(--or)}
.chars-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}
.char-item{display:flex;align-items:center;gap:7px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:12px;color:var(--text2);transition:all .15s;user-select:none}
.char-item:hover{border-color:var(--or)}
.char-item input{width:13px;height:13px;accent-color:var(--or);cursor:pointer;flex-shrink:0;margin:0}
.char-item.checked{background:#FFF8F2;border-color:var(--or);color:var(--navy);font-weight:500}

/* PRIV CONFIG */
.priv-toggle{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border:1px solid var(--border);border-radius:7px;margin-bottom:7px;cursor:pointer;transition:border-color .15s}
.priv-toggle:hover{border-color:var(--or)}
.priv-toggle label{font-size:12px;font-weight:600;color:var(--navy);cursor:pointer;flex:1}
.priv-toggle small{font-size:11px;color:var(--text3);display:block;font-weight:400}
.toggle-switch{position:relative;width:36px;height:20px;flex-shrink:0}
.toggle-switch input{opacity:0;width:0;height:0;position:absolute}
.toggle-slider{position:absolute;inset:0;background:var(--border2);border-radius:10px;transition:.2s}
.toggle-slider::before{content:'';position:absolute;width:14px;height:14px;left:3px;top:3px;background:var(--wh);border-radius:50%;transition:.2s}
.toggle-switch input:checked + .toggle-slider{background:var(--or)}
.toggle-switch input:checked + .toggle-slider::before{transform:translateX(16px)}

/* SHARE BOX */
.share-box{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:14px;margin-bottom:14px}
.share-box-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#1E40AF;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.share-box .fg label{color:#1D4ED8}
.share-box .fg input,.share-box .fg textarea{border-color:#BFDBFE}

/* PRIVATE BOX */
.priv-box{background:#FFFBEB;border:1px solid #FCD34D;border-radius:8px;padding:14px}
.priv-box-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#92400E;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.priv-box .fg label{color:#78350F}
.priv-box .fg input,.priv-box .fg textarea{border-color:#FCD34D;background:#FFFDE7}

/* SIDE CARDS */
.side-card{background:var(--wh);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:10px}
.side-card:last-child{margin-bottom:0}
.side-card-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--navy);margin-bottom:10px;display:flex;align-items:center;gap:6px}
.side-card-title i{font-size:15px;color:var(--or)}
.status-pills{display:flex;gap:6px;flex-wrap:wrap}
.pill{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border2);color:var(--text2);background:var(--bg);transition:all .15s}
.pill.active{background:var(--or);color:var(--wh);border-color:var(--or)}
.sitio-row{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;cursor:pointer;margin-bottom:6px;transition:border-color .15s}
.sitio-row:last-child{margin-bottom:0}
.sitio-row:hover{border-color:var(--or)}
.sitio-row input{width:14px;height:14px;accent-color:var(--or)}
.sitio-label{font-size:12px;font-weight:600;color:var(--navy)}
.sitio-url{font-size:10px;color:var(--text3)}
.img-preview{width:100%;height:110px;object-fit:cover;border-radius:6px;border:1px solid var(--border);display:none;margin-top:8px}
.gal-wrap{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}
.gal-item{position:relative}
.gal-item img{width:60px;height:46px;object-fit:cover;border-radius:5px;border:1px solid var(--border)}
.gal-remove{position:absolute;top:-4px;right:-4px;background:var(--red);color:var(--wh);border:none;border-radius:50%;width:16px;height:16px;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;line-height:1}
.gal-count{font-size:11px;color:var(--text3);margin-top:4px}
.add-gal-btn{margin-top:8px;width:100%;padding:7px;border:1.5px dashed var(--border2);border-radius:6px;background:none;font-size:12px;color:var(--text3);cursor:pointer;transition:border-color .15s}
.add-gal-btn:hover{border-color:var(--or);color:var(--or)}

/* MODAL FOOTER */
.modal-footer{padding:12px 20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:var(--bg);flex-shrink:0}
.modal-footer-left{display:flex;gap:8px}
.modal-footer-right{display:flex;gap:8px}

/* LEADS */
.leads-filters{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.lead-filter-btn{padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border2);color:var(--text2);background:var(--wh);transition:all .15s}
.lead-filter-btn.active{background:var(--navy);color:var(--wh);border-color:var(--navy)}
.lead-card{background:var(--wh);border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:10px;transition:box-shadow .15s}
.lead-card:hover{box-shadow:0 4px 12px rgba(0,0,0,.08)}
.lead-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:12px}
.lead-name{font-size:14px;font-weight:700;color:var(--navy)}
.lead-time{font-size:11px;color:var(--text3);white-space:nowrap}
.lead-detail{font-size:12px;color:var(--text2);margin-bottom:4px;display:flex;align-items:center;gap:6px}
.lead-detail i{font-size:14px;color:var(--text3);flex-shrink:0}
.lead-actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;align-items:center}
.wa-btn{display:inline-flex;align-items:center;gap:6px;background:#25D366;color:var(--wh);padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;transition:background .15s}
.wa-btn:hover{background:#1ebe5d}
.lead-status-sel{padding:5px 10px;border:1px solid var(--border2);border-radius:6px;font-size:12px;font-weight:600;outline:none;cursor:pointer;background:var(--wh)}
.lead-note-btn{padding:5px 10px;border:1px solid var(--border2);border-radius:6px;font-size:12px;color:var(--text2);background:var(--wh);cursor:pointer;display:flex;align-items:center;gap:4px}
.lead-note-area{margin-top:8px;display:none}
.lead-note-area textarea{width:100%;padding:8px;border:1px solid var(--border2);border-radius:6px;font-size:12px;resize:none;outline:none}
.lead-note-area textarea:focus{border-color:var(--or)}

/* TOAST */
.toast{position:fixed;bottom:24px;right:24px;background:var(--navy);color:var(--wh);padding:12px 18px;border-radius:8px;font-size:13px;font-weight:600;transform:translateY(80px);opacity:0;transition:all .3s;z-index:9999;display:flex;align-items:center;gap:8px;max-width:320px}
.toast.show{transform:translateY(0);opacity:1}
.toast.success{border-left:4px solid var(--green)}
.toast.error{border-left:4px solid var(--red)}

/* REBUILD BTN */
.rebuild-banner{background:linear-gradient(135deg,var(--navy),var(--navy3));border-radius:10px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
.rebuild-text{color:rgba(255,255,255,.8);font-size:12px}
.rebuild-text strong{color:var(--wh);display:block;margin-bottom:2px}

@media(max-width:768px){
  .sidebar{display:none}
  .form-tabs-nav{display:none}
  .form-right{width:100%;border-left:none;border-top:1px solid var(--border)}
  .modal-body{flex-direction:column}
  .dash-grid{grid-template-columns:1fr}
  .fg-row.c3,.fg-row.c4{grid-template-columns:1fr 1fr}
}
/* KANBAN */
.kanban-board{display:flex;gap:12px;overflow-x:auto;padding:4px 0 16px;min-height:60vh}
.kanban-col{min-width:240px;max-width:280px;flex:1;background:var(--bg);border-radius:10px;display:flex;flex-direction:column}
.kanban-col-header{padding:12px 14px;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:space-between;border-radius:10px 10px 0 0}
.kanban-col-header .col-count{background:rgba(255,255,255,.25);border-radius:10px;padding:2px 8px;font-size:11px;font-weight:600}
.kanban-col[data-stage="Nuevo"] .kanban-col-header{background:#3b82f6;color:#fff}
.kanban-col[data-stage="Contactado"] .kanban-col-header{background:#eab308;color:#fff}
.kanban-col[data-stage="Interesado"] .kanban-col-header{background:#f97316;color:#fff}
.kanban-col[data-stage="Visita"] .kanban-col-header{background:#8b5cf6;color:#fff}
.kanban-col[data-stage="Cierre"] .kanban-col-header{background:#22c55e;color:#fff}
.kanban-col[data-stage="Perdido"] .kanban-col-header{background:#6b7280;color:#fff}
.kanban-cards{flex:1;padding:8px;overflow-y:auto;display:flex;flex-direction:column;gap:8px}
.kanban-card{background:var(--wh);border:1px solid var(--border);border-radius:8px;padding:12px;cursor:pointer;transition:box-shadow .15s,transform .1s}
.kanban-card:hover{box-shadow:0 4px 12px rgba(0,0,0,.1);transform:translateY(-1px)}
.kanban-card .kc-name{font-size:13px;font-weight:700;color:var(--navy);margin-bottom:6px}
.kanban-card .kc-prop{font-size:11px;color:var(--text2);margin-bottom:4px}
.kanban-card .kc-phone{font-size:11px;color:var(--text3)}
.kanban-card .kc-meta{display:flex;align-items:center;justify-content:space-between;margin-top:8px}
.kanban-card .kc-date{font-size:10px;color:var(--text3)}
.score-badge{font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:.5px}
.score-hot{background:#fee2e2;color:#dc2626}
.score-warm{background:#fff7ed;color:#f97316}
.score-cold{background:#eff6ff;color:#3b82f6}
.lead-modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px}
.lead-modal{background:var(--wh);border-radius:14px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3)}
.lead-modal-head{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.lead-modal-head h3{font-size:16px;font-weight:700;color:var(--navy);margin:0}
.lead-modal-close{background:none;border:none;font-size:20px;cursor:pointer;color:var(--text3);padding:4px}
.lead-modal-body{padding:24px}
.lm-row{display:flex;gap:12px;margin-bottom:12px}
.lm-field{flex:1}
.lm-label{font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.lm-value{font-size:13px;color:var(--navy);font-weight:500}
.lm-section{font-size:12px;font-weight:700;color:var(--navy);margin:20px 0 10px;padding-top:14px;border-top:1px solid var(--border)}
.lm-notes-list{max-height:200px;overflow-y:auto;margin-bottom:12px}
.lm-note-item{background:var(--bg);border-radius:8px;padding:10px 12px;margin-bottom:6px;font-size:12px;color:var(--text2)}
.lm-note-item .note-date{font-size:10px;color:var(--text3);margin-bottom:4px}
.lm-note-input{width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:12px;resize:vertical;min-height:60px;font-family:inherit;box-sizing:border-box}
.lm-stage-sel{width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;background:var(--wh)}
.lm-followup{width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;box-sizing:border-box}
.lm-actions{display:flex;gap:8px;margin-top:16px}
.lm-actions .btn{flex:1}
.pipeline-mini{display:flex;gap:6px;margin-top:10px}
.pipeline-mini-col{flex:1;text-align:center}
.pipeline-mini-col .pm-count{font-size:16px;font-weight:700;color:var(--navy)}
.pipeline-mini-col .pm-label{font-size:9px;color:var(--text3);text-transform:uppercase}
.dash-chart-bars{display:flex;align-items:flex-end;gap:6px;height:80px;padding:10px 0}
.dash-chart-bars .bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.dash-chart-bars .bar{width:100%;background:var(--or);border-radius:3px 3px 0 0;min-height:2px;transition:height .3s}
.dash-chart-bars .bar-label{font-size:9px;color:var(--text3)}
</style>
</head>
<body>

<!-- LOGIN -->
<div id="loginPage">
  <div class="login-card">
    <div class="login-logo"><span>Zona</span>-INNmueble</div>
    <div class="login-sub">Panel de administraci\xF3n \xB7 Premium</div>
    <div class="login-field"><label>Usuario</label><input type="text" id="loginUser" placeholder="admin" autocomplete="username"></div>
    <div class="login-field"><label>Contrase\xF1a</label><input type="password" id="loginPass" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()"></div>
    <button id="loginBtn" onclick="doLogin()">Ingresar</button>
    <div id="loginErr">Usuario o contrase\xF1a incorrectos.</div>
  </div>
</div>

<!-- APP -->
<div id="adminApp">
  <div class="app">
    <div class="sidebar">
      <div class="sb-logo">
        <div class="sb-brand"><span>Zona</span>-INNmueble</div>
        <div class="sb-sub">Panel de administraci\xF3n</div>
      </div>
      <div class="sb-nav">
        <div class="sb-item active" id="nav-dashboard" onclick="showPage('dashboard')"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
        <div class="sb-section">Cat\xE1logo</div>
        <div class="sb-item" id="nav-propiedades" onclick="showPage('propiedades')"><i class="ti ti-building"></i> Propiedades</div>
        <div class="sb-item" onclick="openModal(null)"><i class="ti ti-plus"></i> Nueva propiedad</div>
        <div class="sb-section">Clientes</div>
        <div class="sb-item" id="nav-leads" onclick="showPage('leads')"><i class="ti ti-users"></i> Leads <span class="sb-badge new" id="leadsCount">0</span></div>
        <div class="sb-item" id="nav-pipeline" onclick="showPage('pipeline')"><i class="ti ti-layout-kanban"></i> Pipeline</div>
        <div class="sb-section">Sitios</div>
        <div class="sb-item" onclick="window.open('https://zona-innmueble.com','_blank')"><i class="ti ti-world"></i> Ver sitio</div>
        <div class="sb-item" onclick="triggerRebuild()"><i class="ti ti-refresh"></i> Publicar cambios</div>
      </div>
      <div class="sb-bottom">
        <div class="sb-user">
          <div class="sb-avatar">ZI</div>
          <div>
            <div class="sb-uname">Admin</div>
            <div class="sb-urole" id="sidebarLogout" onclick="doLogout()" style="cursor:pointer;color:rgba(255,100,100,.6)">Cerrar sesi\xF3n</div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="topbar">
        <div class="topbar-title" id="pageTitle">Dashboard</div>
        <button class="btn btn-ghost btn-sm" onclick="showPage('leads')"><i class="ti ti-users"></i> Leads <span id="topLeadsCount" style="background:var(--green);color:#fff;font-size:10px;padding:1px 6px;border-radius:10px;margin-left:2px">0</span></button>
        <button class="btn btn-ghost btn-sm" onclick="doLogout()"><i class="ti ti-logout"></i> Salir</button>
        <button class="btn btn-primary btn-sm" onclick="openModal(null)"><i class="ti ti-plus"></i> Nueva propiedad</button>
      </div>
      <div class="content" id="mainContent"></div>
    </div>
  </div>
</div>

<!-- MODAL PROPIEDAD -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal-panel">
    <div class="modal-topbar">
      <button class="btn btn-ghost btn-sm" onclick="closeModal()" style="color:#fff;border-color:rgba(255,255,255,.2)"><i class="ti ti-x"></i></button>
      <div class="modal-topbar-title" id="modalTitle">Nueva propiedad</div>
      <div class="modal-progress" id="modalProgress">0% completo</div>
      <button class="btn btn-sm" onclick="saveProp()" style="background:var(--or);color:#fff;border:none"><i class="ti ti-device-floppy"></i> Guardar</button>
    </div>
    <div class="modal-body">
      <!-- TABS NAV -->
      <div class="form-tabs-nav">
        <div class="ftab active" onclick="switchTab('basico')"><i class="ti ti-info-circle"></i> B\xE1sico <span class="ftab-dot"></span></div>
        <div class="ftab" onclick="switchTab('detalles')"><i class="ti ti-ruler"></i> Detalles <span class="ftab-dot"></span></div>
        <div class="ftab" onclick="switchTab('contenido')"><i class="ti ti-file-text"></i> Contenido <span class="ftab-dot"></span></div>
        <div class="ftab" onclick="switchTab('caracteristicas')"><i class="ti ti-tag"></i> Amenidades <span class="ftab-dot"></span></div>
        <div class="ftab" onclick="switchTab('publicacion')"><i class="ti ti-send"></i> Publicaci\xF3n <span class="ftab-dot"></span></div>
      </div>

      <!-- TABS BODY -->
      <div class="form-tabs-body">

        <!-- TAB 1: B\xC1SICO -->
        <div class="ftab-panel active" id="tab-basico">
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-home"></i> Informaci\xF3n principal</div>
            <div class="fg"><label>T\xEDtulo de la propiedad *</label><input type="text" id="fTitulo" placeholder="Ej: Residencia en Kanajuy\xFA \xB7 Zona 16" oninput="updateProgress()"></div>
            <div class="fg-row c2">
              <div class="fg" style="flex:2"><label>Precio <span style="font-size:.65rem;color:#94a3b8;font-weight:400">(n\xFAmero sin s\xEDmbolo)</span></label><input type="text" id="fPrecio" placeholder="Ej: 395000" oninput="autoFormatPrice()"></div>
              <div class="fg" style="flex:1;max-width:140px"><label>Moneda</label><select id="fMoneda" style="width:100%;padding:10px 12px;background:#1e2d4e;border:1px solid #2d4a7a;border-radius:6px;color:#e2e8f0;font-size:.82rem;font-family:inherit;cursor:pointer"><option value="Q.">Q. \u2014 Quetzal</option><option value="$">$ \u2014 D\xF3lar</option><option value="USD">USD</option></select></div>
              <div class="fg"><label>C\xF3digo interno</label><input type="text" id="fCodigo" placeholder="CV-001"></div>
            </div>
            <div class="fg-row c3">
              <div class="fg"><label>Tipo</label>
                <select id="fTipo" onchange="updateProgress()">
                  <option>Casa</option><option>Apartamento</option><option>Finca</option><option>Local</option><option>Terreno</option>
                </select>
              </div>
              <div class="fg"><label>Operaci\xF3n</label>
                <select id="fOperacion"><option>Venta</option><option>Renta</option><option>Venta/Renta</option></select>
              </div>
              <div class="fg"><label>Categor\xEDa</label>
                <select id="fTipoListing"><option>Residencial</option><option>Finca</option><option>Inversi\xF3n</option><option>Comercial</option></select>
              </div>
            </div>
          </div>
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-map-pin"></i> Ubicaci\xF3n</div>
            <div class="fg-row c2">
              <div class="fg"><label>Zona / Colonia</label><input type="text" id="fZona" placeholder="Ej: Kanajuy\xFA, El Socorro, Hacienda Nueva"></div>
              <div class="fg"><label>Municipio</label><input type="text" id="fMunicipio" placeholder="Ej: Guatemala, Fraijanes, Mixco"></div>
            </div>
            <div class="fg-row c2">
              <div class="fg"><label>Departamento</label>
                <select id="fDepartamento">
                  <option value="">-- Seleccionar --</option>
                  <option>Guatemala</option><option>Sacatep\xE9quez</option><option>Escuintla</option>
                  <option>Chimaltenango</option><option>Baja Verapaz</option><option>Alta Verapaz</option>
                  <option>El Progreso</option><option>Jalapa</option><option>Jutiapa</option>
                </select>
              </div>
              <div class="fg"><label>Ubicaci\xF3n general (referencia)</label><input type="text" id="fUbicacionGeneral" placeholder="Fraijanes \xB7 Km 16.5 \xB7 Carr. a El Salvador"></div>
            </div>
            <div class="fg-row c2">
              <div class="fg"><label>Latitud</label><input type="text" id="fLat" placeholder="14.6349"></div>
              <div class="fg"><label>Longitud</label><input type="text" id="fLng" placeholder="-90.5069"></div>
            </div>
          </div>
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-user-check"></i> Asesor</div>
            <div class="fg-row c2">
              <div class="fg"><label>Nombre del asesor</label><input type="text" id="fAsesor" placeholder="Ej: Juan P\xE9rez"></div>
              <div class="fg"><label>WhatsApp asesor (sin +502)</label><input type="text" id="fWaAsesor" placeholder="Ej: 45542088"></div>
            </div>
          </div>
        </div>

        <!-- TAB 2: DETALLES -->
        <div class="ftab-panel" id="tab-detalles">
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-ruler"></i> Medidas y espacios</div>
            <div class="fg-row c4">
              <div class="fg"><label>\xC1rea m\xB2</label><input type="text" id="fArea" placeholder="350"></div>
              <div class="fg"><label>\xC1rea v\xB2</label><input type="text" id="fAreaV2" placeholder="2048"></div>
              <div class="fg"><label>Habitaciones</label><input type="number" id="fHabitaciones" placeholder="0" min="0"></div>
              <div class="fg"><label>Ba\xF1os</label><input type="number" id="fBanos" placeholder="0" min="0"></div>
            </div>
            <div class="fg-row c4">
              <div class="fg"><label>Medios ba\xF1os</label><input type="number" id="fMediosBanos" placeholder="0" min="0"></div>
              <div class="fg"><label>Parqueos</label><input type="number" id="fParqueos" placeholder="0" min="0"></div>
              <div class="fg"><label>Niveles</label><input type="number" id="fNiveles" placeholder="1" min="1"></div>
              <div class="fg"><label>Terreno m\xB2</label><input type="text" id="fTerreno" placeholder="500"></div>
            </div>
            <div class="fg"><label>Resumen t\xE9cnico (para ficha)</label><input type="text" id="fDatosTecnicos" placeholder="Ej: 4 hab \xB7 4.5 ba\xF1os \xB7 580 m\xB2 construidos \xB7 Terreno 2,400 m\xB2"></div>
          </div>
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-tools"></i> Construcci\xF3n y acabados</div>
            <div class="fg-row c3">
              <div class="fg"><label>A\xF1o construcci\xF3n</label><input type="text" id="fAnioConstruccion" placeholder="2018"></div>
              <div class="fg"><label>Estado</label>
                <select id="fEstadoConstruccion"><option value="">-- Seleccionar --</option><option>Nueva</option><option>Usada</option><option>En construcci\xF3n</option><option>En planos</option></select>
              </div>
              <div class="fg"><label>Acabados</label>
                <select id="fAcabados"><option value="">-- Seleccionar --</option><option>B\xE1sico</option><option>Medio</option><option>Premium</option><option>Lujo</option></select>
              </div>
            </div>
            <div class="fg-row c3">
              <div class="fg"><label>Tipo construcci\xF3n</label>
                <select id="fTipoConstruccion"><option value="">-- Seleccionar --</option><option>Block / Concreto</option><option>Mixta</option><option>Madera</option><option>Adobe</option></select>
              </div>
              <div class="fg"><label>Techo</label>
                <select id="fTecho"><option value="">-- Seleccionar --</option><option>Losa</option><option>Terraza</option><option>Duralita</option><option>Teja</option><option>Mixto</option></select>
              </div>
              <div class="fg"><label>Piso</label>
                <select id="fPiso"><option value="">-- Seleccionar --</option><option>Granito</option><option>Porcelanato</option><option>Cer\xE1mica</option><option>Madera</option><option>M\xE1rmol</option><option>Cemento alisado</option></select>
              </div>
            </div>
            <div class="fg-row c3">
              <div class="fg"><label>Orientaci\xF3n</label>
                <select id="fOrientacion"><option value="">--</option><option>Norte</option><option>Sur</option><option>Este</option><option>Oeste</option><option>Noreste</option><option>Noroeste</option><option>Sureste</option><option>Suroeste</option></select>
              </div>
              <div class="fg"><label>Antig\xFCedad (a\xF1os)</label><input type="number" id="fAntiguedad" placeholder="0" min="0"></div>
              <div class="fg"><label>Cuota mantenimiento</label><input type="text" id="fCuotaMant" placeholder="Ej: Q 800/mes"></div>
            </div>
          </div>
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-building-skyscraper"></i> Apartamento</div>
            <div class="fg-row c3">
              <div class="fg"><label>N\xFAmero de piso</label><input type="number" id="fNumeroPiso" placeholder="0" min="0"></div>
              <div class="fg"><label>\xC1rea balc\xF3n m\xB2</label><input type="text" id="fAreaBalcon" placeholder="0"></div>
              <div class="fg"><label>Vista</label>
                <select id="fVista"><option value="">--</option><option>Interior</option><option>Exterior</option><option>Ciudad</option><option>Jard\xEDn</option><option>Monta\xF1a</option><option>Valle</option></select>
              </div>
            </div>
          </div>
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-plant"></i> Finca</div>
            <div class="fg-row c3">
              <div class="fg"><label>Extensi\xF3n (manzanas)</label><input type="text" id="fManzanas" placeholder="0"></div>
              <div class="fg"><label>Tipo de cultivo</label><input type="text" id="fCultivo" placeholder="Ej: Aguacate, Caf\xE9, Sin cultivo"></div>
              <div class="fg"><label>Tiempo a carretera</label><input type="text" id="fTiempoCarretera" placeholder="Ej: 5 min"></div>
            </div>
            <div class="fg"><label>T\xEDtulo / Escritura</label>
              <select id="fTituloFinca"><option value="">-- Seleccionar --</option><option>Finca inscrita en Registro</option><option>T\xEDtulo supletorio</option><option>En tr\xE1mite</option><option>Escritura p\xFAblica</option></select>
            </div>
          </div>
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-home-dollar"></i> Renta</div>
            <div class="fg-row c3">
              <div class="fg"><label>Precio renta mensual</label><input type="text" id="fPrecioRenta" placeholder="Ej: $1,200/mes"></div>
              <div class="fg"><label>Banco financiamiento</label><input type="text" id="fBancoFin" placeholder="Ej: Banrural, G&T"></div>
              <div class="fg"><label>Disponible desde</label><input type="text" id="fDisponibleDesde" placeholder="Ej: Julio 2026"></div>
            </div>
          </div>
        </div>

        <!-- TAB 3: CONTENIDO -->
        <div class="ftab-panel" id="tab-contenido">
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-file-text"></i> Textos premium</div>
            <div class="fg">
              <label>Descripci\xF3n completa</label>
              <textarea id="fDescripcion" style="min-height:100px" placeholder="Descripci\xF3n detallada y premium para el sitio web. Describe el entorno, los acabados, el estilo de vida que ofrece..." oninput="updateProgress()"></textarea>
            </div>
            <div class="fg">
              <label>Hook para redes sociales</label>
              <input type="text" id="fHook" placeholder="Ej: Hay casas. Y luego est\xE1 esta.">
              <div class="fg-hint">Frase corta y poderosa para Instagram y Facebook. M\xE1x. 80 caracteres.</div>
            </div>
            <div class="fg">
              <label>Descripci\xF3n corta (para preview)</label>
              <textarea id="fDescCorta" style="min-height:56px" placeholder="2-3 l\xEDneas elegantes que resumen lo esencial de la propiedad..."></textarea>
            </div>
          </div>
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-search"></i> SEO y multimedia</div>
            <div class="fg"><label>Tags SEO (separados por coma)</label><input type="text" id="fTagsSeo" placeholder="Ej: casa zona 10, residencia exclusiva guatemala, propiedad premium"></div>
            <div class="fg"><label>Video tour (YouTube / Vimeo URL)</label><input type="url" id="fVideoUrl" placeholder="https://youtube.com/watch?v=..."></div>
            <div class="fg"><label>Plano de planta (URL imagen)</label><input type="url" id="fPlano" placeholder="https://ik.imagekit.io/Zona/planos/..."></div>
            <div class="fg"><label>Certificado energ\xE9tico</label>
              <select id="fCertEnerg"><option value="">Sin certificado</option><option>A+</option><option>A</option><option>B</option><option>C</option><option>D</option></select>
            </div>
            <div class="fg">
              <label>Slug URL</label>
              <input type="text" id="fSlug" placeholder="casa-zona-10-kanajuyu">
              <div class="fg-auto" onclick="autoSlug()">\u{1F504} Generar desde t\xEDtulo</div>
            </div>
            <div class="fg"><label>Fecha de publicaci\xF3n</label><input type="date" id="fFechaPublicacion"></div>
          </div>
          <div class="share-box">
            <div class="share-box-title"><i class="ti ti-share"></i> Ficha compartible (WhatsApp / Redes)</div>
            <div class="fg"><label>URL del PDF (Google Drive)</label><input type="url" id="fPdfUrl" placeholder="https://drive.google.com/..."></div>
          </div>
          <div class="priv-box" style="margin-top:14px">
            <div class="priv-box-title"><i class="ti ti-lock"></i> Informaci\xF3n privada (solo admin)</div>
            <div class="fg"><label>Precio real / margen negociaci\xF3n</label><input type="text" id="fPrecioReal" placeholder="Ej: Vendedor acepta m\xEDnimo Q 2,200,000"></div>
            <div class="fg"><label>Contacto del vendedor</label><input type="text" id="fContactoVendedor" placeholder="Ej: Juan P\xE9rez \xB7 +502 5555-1234"></div>
            <div class="fg"><label>Notas internas</label><textarea id="fNotasInternas" style="min-height:56px" placeholder="Motivaci\xF3n de venta, situaci\xF3n especial, observaciones..."></textarea></div>
            <div class="fg"><label>Estado legal</label><input type="text" id="fEstadoLegal" placeholder="Ej: Sin grav\xE1menes, IUSI al d\xEDa, escritura en tr\xE1mite"></div>
          </div>
        </div>

        <!-- TAB 4: CARACTER\xCDSTICAS -->
        <div class="ftab-panel" id="tab-caracteristicas">
          <div class="chars-group">
            <div class="chars-group-title"><i class="ti ti-map-pin"></i> Ubicaci\xF3n</div>
            <div class="chars-grid">
              <label class="char-item"><input type="checkbox" value="Ubicaci\xF3n privilegiada"> Ubicaci\xF3n privilegiada</label>
              <label class="char-item"><input type="checkbox" value="Sobre carretera principal"> Sobre carretera principal</label>
              <label class="char-item"><input type="checkbox" value="Entorno natural y vistas"> Entorno natural y vistas</label>
              <label class="char-item"><input type="checkbox" value="Cerca de servicios"> Cerca de servicios</label>
              <label class="char-item"><input type="checkbox" value="Zona residencial exclusiva"> Zona residencial exclusiva</label>
              <label class="char-item"><input type="checkbox" value="Acceso pavimentado"> Acceso pavimentado</label>
              <label class="char-item"><input type="checkbox" value="Vista al valle"> Vista al valle</label>
              <label class="char-item"><input type="checkbox" value="Vista a monta\xF1as"> Vista a monta\xF1as</label>
            </div>
          </div>
          <div class="chars-group">
            <div class="chars-group-title"><i class="ti ti-shield"></i> Seguridad</div>
            <div class="chars-grid">
              <label class="char-item"><input type="checkbox" value="Garita 24/7"> Garita 24/7</label>
              <label class="char-item"><input type="checkbox" value="Condominio cerrado"> Condominio cerrado</label>
              <label class="char-item"><input type="checkbox" value="C\xE1maras de seguridad"> C\xE1maras de seguridad</label>
              <label class="char-item"><input type="checkbox" value="Sistema de alarma"> Sistema de alarma</label>
              <label class="char-item"><input type="checkbox" value="Muros perimetrales"> Muros perimetrales</label>
              <label class="char-item"><input type="checkbox" value="Port\xF3n el\xE9ctrico"> Port\xF3n el\xE9ctrico</label>
            </div>
          </div>
          <div class="chars-group">
            <div class="chars-group-title"><i class="ti ti-droplet"></i> Servicios b\xE1sicos</div>
            <div class="chars-grid">
              <label class="char-item"><input type="checkbox" value="Agua municipal"> Agua municipal</label>
              <label class="char-item"><input type="checkbox" value="Pozo propio"> Pozo propio</label>
              <label class="char-item"><input type="checkbox" value="Cisterna"> Cisterna</label>
              <label class="char-item"><input type="checkbox" value="Luz 110v/220v"> Luz 110v/220v</label>
              <label class="char-item"><input type="checkbox" value="Panel solar"> Panel solar</label>
              <label class="char-item"><input type="checkbox" value="Internet fibra disponible"> Internet fibra</label>
              <label class="char-item"><input type="checkbox" value="Gas propano"> Gas propano</label>
              <label class="char-item"><input type="checkbox" value="Drenaje municipal"> Drenaje municipal</label>
            </div>
          </div>
          <div class="chars-group">
            <div class="chars-group-title"><i class="ti ti-tree"></i> Exteriores</div>
            <div class="chars-grid">
              <label class="char-item"><input type="checkbox" value="Piscina"> Piscina</label>
              <label class="char-item"><input type="checkbox" value="Jard\xEDn amplio"> Jard\xEDn amplio</label>
              <label class="char-item"><input type="checkbox" value="\xC1rea de BBQ"> \xC1rea de BBQ</label>
              <label class="char-item"><input type="checkbox" value="P\xE9rgola"> P\xE9rgola</label>
              <label class="char-item"><input type="checkbox" value="Terraza exterior"> Terraza exterior</label>
              <label class="char-item"><input type="checkbox" value="Cancha deportiva"> Cancha deportiva</label>
              <label class="char-item"><input type="checkbox" value="Juegos infantiles"> Juegos infantiles</label>
              <label class="char-item"><input type="checkbox" value="Huerto / \xE1rea de siembra"> Huerto / siembra</label>
            </div>
          </div>
          <div class="chars-group">
            <div class="chars-group-title"><i class="ti ti-sofa"></i> Interiores</div>
            <div class="chars-grid">
              <label class="char-item"><input type="checkbox" value="Cocina equipada"> Cocina equipada</label>
              <label class="char-item"><input type="checkbox" value="Isla de cocina"> Isla de cocina</label>
              <label class="char-item"><input type="checkbox" value="Walk-in closet"> Walk-in closet</label>
              <label class="char-item"><input type="checkbox" value="Cuarto de servicio con ba\xF1o"> Cuarto de servicio</label>
              <label class="char-item"><input type="checkbox" value="Bodega"> Bodega</label>
              <label class="char-item"><input type="checkbox" value="Chimenea"> Chimenea</label>
              <label class="char-item"><input type="checkbox" value="Jacuzzi"> Jacuzzi</label>
              <label class="char-item"><input type="checkbox" value="Estudio / Oficina"> Estudio / Oficina</label>
              <label class="char-item"><input type="checkbox" value="Sala familiar"> Sala familiar</label>
              <label class="char-item"><input type="checkbox" value="Sala de cine"> Sala de cine</label>
              <label class="char-item"><input type="checkbox" value="Lavander\xEDa interna"> Lavander\xEDa interna</label>
              <label class="char-item"><input type="checkbox" value="Bar interior"> Bar interior</label>
              <label class="char-item"><input type="checkbox" value="Cocina abierta"> Cocina abierta</label>
              <label class="char-item"><input type="checkbox" value="Aire acondicionado"> Aire acondicionado</label>
            </div>
          </div>
          <div class="chars-group">
            <div class="chars-group-title"><i class="ti ti-plant"></i> Para fincas</div>
            <div class="chars-grid">
              <label class="char-item"><input type="checkbox" value="Agua de nacimiento"> Agua de nacimiento</label>
              <label class="char-item"><input type="checkbox" value="R\xEDo o quebrada"> R\xEDo o quebrada</label>
              <label class="char-item"><input type="checkbox" value="Luz trif\xE1sica"> Luz trif\xE1sica</label>
              <label class="char-item"><input type="checkbox" value="Casa del guardi\xE1n"> Casa del guardi\xE1n</label>
              <label class="char-item"><input type="checkbox" value="Corrales"> Corrales</label>
              <label class="char-item"><input type="checkbox" value="Cultivo activo"> Cultivo activo</label>
              <label class="char-item"><input type="checkbox" value="Finca inscrita en Registro"> Finca inscrita</label>
              <label class="char-item"><input type="checkbox" value="Caminos internos"> Caminos internos</label>
            </div>
          </div>
          <div class="chars-group">
            <div class="chars-group-title"><i class="ti ti-trending-up"></i> Inversi\xF3n</div>
            <div class="chars-grid">
              <label class="char-item"><input type="checkbox" value="Alta plusval\xEDa"> Alta plusval\xEDa</label>
              <label class="char-item"><input type="checkbox" value="Zona en crecimiento"> Zona en crecimiento</label>
              <label class="char-item"><input type="checkbox" value="Papeler\xEDa en orden"> Papeler\xEDa en orden</label>
              <label class="char-item"><input type="checkbox" value="Sin grav\xE1menes"> Sin grav\xE1menes</label>
              <label class="char-item"><input type="checkbox" value="Financiamiento disponible"> Financiamiento disponible</label>
              <label class="char-item"><input type="checkbox" value="Negociable"> Negociable</label>
              <label class="char-item"><input type="checkbox" value="Potencial de desarrollo"> Potencial de desarrollo</label>
              <label class="char-item"><input type="checkbox" value="Apta para alquiler"> Apta para alquiler</label>
              <label class="char-item"><input type="checkbox" value="Acepta permuta"> Acepta permuta</label>
              <label class="char-item"><input type="checkbox" value="Disponibilidad inmediata"> Disponibilidad inmediata</label>
            </div>
          </div>
          <div class="chars-group">
            <div class="chars-group-title"><i class="ti ti-car"></i> Veh\xEDculos</div>
            <div class="chars-grid">
              <label class="char-item"><input type="checkbox" value="Garaje cerrado"> Garaje cerrado</label>
              <label class="char-item"><input type="checkbox" value="Parqueo techado"> Parqueo techado</label>
              <label class="char-item"><input type="checkbox" value="Parqueo descubierto"> Parqueo descubierto</label>
              <label class="char-item"><input type="checkbox" value="Acceso para cami\xF3n"> Acceso para cami\xF3n</label>
            </div>
          </div>
        </div>

        <!-- TAB 5: PUBLICACI\xD3N -->
        <div class="ftab-panel" id="tab-publicacion">
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-eye-off"></i> Control de visibilidad p\xFAblica</div>
            <p style="font-size:12px;color:var(--text3);margin-bottom:14px">Selecciona qu\xE9 informaci\xF3n se oculta en el sitio p\xFAblico. \xDAtil para propiedades exclusivas o en negociaci\xF3n.</p>
            <div class="priv-toggle" onclick="togglePriv('privPrecio')">
              <label><strong>Ocultar precio</strong><small>Muestra "A consultar" en vez del precio</small></label>
              <label class="toggle-switch"><input type="checkbox" id="privPrecio"><span class="toggle-slider"></span></label>
            </div>
            <div class="priv-toggle" onclick="togglePriv('privDireccion')">
              <label><strong>Ocultar direcci\xF3n exacta</strong><small>Solo muestra zona/municipio general</small></label>
              <label class="toggle-switch"><input type="checkbox" id="privDireccion"><span class="toggle-slider"></span></label>
            </div>
            <div class="priv-toggle" onclick="togglePriv('privGaleria')">
              <label><strong>Ocultar galer\xEDa</strong><small>Solo muestra la imagen principal</small></label>
              <label class="toggle-switch"><input type="checkbox" id="privGaleria"><span class="toggle-slider"></span></label>
            </div>
            <div class="priv-toggle" onclick="togglePriv('privDatos')">
              <label><strong>Ocultar datos t\xE9cnicos</strong><small>\xC1rea, habitaciones y ba\xF1os no visibles</small></label>
              <label class="toggle-switch"><input type="checkbox" id="privDatos"><span class="toggle-slider"></span></label>
            </div>
            <div class="priv-toggle" onclick="togglePriv('privDesc')">
              <label><strong>Ocultar descripci\xF3n</strong><small>Solo muestra el hook de redes</small></label>
              <label class="toggle-switch"><input type="checkbox" id="privDesc"><span class="toggle-slider"></span></label>
            </div>
            <div class="priv-toggle" onclick="togglePriv('privExclusiva')">
              <label><strong style="color:var(--or)">\u{1F3F7}\uFE0F Listado EXCLUSIVO</strong><small>Muestra mensaje de propiedad exclusiva y oculta todo excepto imagen y t\xEDtulo</small></label>
              <label class="toggle-switch"><input type="checkbox" id="privExclusiva"><span class="toggle-slider"></span></label>
            </div>
          </div>
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-world"></i> Publicar en</div>
            <label class="sitio-row"><input type="checkbox" id="sZona" checked><div><div class="sitio-label">Zona INNmueble</div><div class="sitio-url">zona-innmueble.com</div></div></label>
            <label class="sitio-row"><input type="checkbox" id="sInmu"><div><div class="sitio-label">InmuHub</div><div class="sitio-url">inmuhub.com</div></div></label>
          </div>
          <div class="fsec">
            <div class="fsec-title"><i class="ti ti-eye"></i> Contadores</div>
            <div class="fg-row c2">
              <div class="fg"><label>Vistas</label><input type="number" id="fVistas" placeholder="0" min="0"></div>
              <div class="fg"><label>Favoritos</label><input type="number" id="fFavoritos" placeholder="0" min="0"></div>
            </div>
          </div>
        </div>

      </div><!-- /form-tabs-body -->

      <!-- SIDEBAR DERECHO -->
      <div class="form-right">
        <div class="side-card">
          <div class="side-card-title"><i class="ti ti-photo"></i> Imagen principal</div>
          <div class="fg"><input type="url" id="fImagen" placeholder="https://ik.imagekit.io/Zona/..." oninput="previewImg(); updateProgress()"></div>
          <img id="imgPreview" class="img-preview">
        </div>
        <div class="side-card">
          <div class="side-card-title"><i class="ti ti-photos"></i> Galer\xEDa (<span id="galCount">0</span> fotos)</div>
          <div class="gal-wrap" id="galWrap"></div>
          <button type="button" class="add-gal-btn" onclick="addGalImgBulk()">+ Agregar fotos (URL por URL)</button>
        </div>
        <div class="side-card">
          <div class="side-card-title"><i class="ti ti-toggle-right"></i> Estado</div>
          <div class="status-pills" id="statusPills">
            <div class="pill active" onclick="setStatus('Activa')">Activa</div>
            <div class="pill" onclick="setStatus('Vendida')">Vendida</div>
            <div class="pill" onclick="setStatus('Pausada')">Pausada</div>
          </div>
          <input type="hidden" id="fEstado" value="Activa">
        </div>
        <div class="side-card" style="background:#FFF8F2;border-color:rgba(245,130,13,.3)">
          <div class="side-card-title"><i class="ti ti-share"></i> Compartir propiedad</div>
          <button type="button" onclick="shareWA()" class="btn btn-green btn-sm" style="width:100%;justify-content:center;margin-bottom:6px"><i class="ti ti-brand-whatsapp"></i> Enviar por WhatsApp</button>
          <button type="button" onclick="copyLink()" class="btn btn-ghost btn-sm" style="width:100%;justify-content:center"><i class="ti ti-link"></i> Copiar enlace</button>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="modal-footer-left">
        <button class="btn btn-ghost btn-sm" onclick="closeModal()"><i class="ti ti-x"></i> Cancelar</button>
        <button class="btn btn-ghost btn-sm" onclick="duplicateProp()" id="btnDuplicate" style="display:none"><i class="ti ti-copy"></i> Duplicar</button>
      </div>
      <div class="modal-footer-right">
        <div id="progressLabel" style="font-size:12px;color:var(--text3);align-self:center">0% completo</div>
        <button class="btn btn-navy btn-sm" onclick="saveProp()"><i class="ti ti-device-floppy"></i> Guardar propiedad</button>
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const API = 'https://zona-inmu.tours-virtuales-gt.workers.dev';
let props = [];
let editingId = null;
let galUrls = [];
let currentStatus = 'Activa';
let leadsData = [];
let leadStatuses = {};
  try { leadStatuses = JSON.parse(localStorage.getItem('zin_ls') || '{}'); } catch(e) {}

// \u2500\u2500 AUTH \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  const btn  = document.getElementById('loginBtn');
  const err  = document.getElementById('loginErr');
  if (!user || !pass) return;
  btn.disabled = true; btn.textContent = 'Ingresando...'; err.style.display = 'none';
  try {
    const r = await fetch(API + '/api/login', {method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({user,pass})});
    if (r.ok) {
      document.getElementById('loginPage').style.display = 'none';
      document.getElementById('adminApp').style.display = 'block';
      await loadProps();
      showPage('dashboard');
    } else { err.style.display = 'block'; }
  } catch(e) { err.textContent = 'Error de conexi\xF3n.'; err.style.display = 'block'; }
  btn.disabled = false; btn.textContent = 'Ingresar';
}

async function doLogout() {
  await fetch(API + '/api/logout', {method:'POST',credentials:'include'}).catch(()=>{});
  document.getElementById('adminApp').style.display = 'none';
  document.getElementById('loginPage').style.display = 'flex';
}

async function checkSession() {
  try {
    const r = await fetch(API + '/api/me', {credentials:'include'});
    if (r.ok) {
      document.getElementById('loginPage').style.display = 'none';
      document.getElementById('adminApp').style.display = 'block';
      await loadProps();
      showPage('dashboard');
    }
  } catch(e) {}
}

// \u2500\u2500 PROPS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function loadProps() {
  try {
    const r = await fetch(API + '/api/propiedades', {credentials:'include'});
    if (r.ok) props = await r.json();
  } catch(e) { console.error('loadProps:', e); }
}

// \u2500\u2500 NAVIGATION \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function showPage(page) {
  document.querySelectorAll('.sb-item').forEach(n => n.classList.remove('active'));
  const nav = document.getElementById('nav-' + page);
  if (nav) nav.classList.add('active');
  const titles = {dashboard:'Dashboard', propiedades:'Propiedades', leads:'Leads CRM', pipeline:'Pipeline CRM'};
  document.getElementById('pageTitle').textContent = titles[page] || page;
  const mc = document.getElementById('mainContent');
  if (page === 'dashboard')   renderDashboard(mc);
  if (page === 'propiedades') renderPropiedades(mc);
  if (page === 'leads')       renderLeads(mc);
  if (page === 'pipeline')    renderPipeline(mc);
}

// \u2500\u2500 DASHBOARD \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function renderDashboard(mc) {
  const activas  = props.filter(p => !p.estado || p.estado === 'Activa').length;
  const vendidas = props.filter(p => p.estado === 'Vendida').length;
  const pausadas = props.filter(p => p.estado === 'Pausada').length;
  const casas    = props.filter(p => p.tipo === 'Casa').length;
  const fincas   = props.filter(p => p.tipo === 'Finca').length;
  const apts     = props.filter(p => p.tipo === 'Apartamento').length;

  mc.innerHTML = \`
    <div class="rebuild-banner">
      <div class="rebuild-text"><strong>\xBFActualizaste propiedades?</strong>Los cambios se reflejan en el sitio despu\xE9s de publicar.</div>
      <button class="btn btn-sm" style="background:var(--or);color:#fff;border:none;white-space:nowrap" onclick="triggerRebuild()"><i class="ti ti-refresh"></i> Publicar ahora</button>
    </div>
    <div class="stats-grid">
      <div class="stat-card green"><div class="stat-label">Activas</div><div class="stat-val">\${activas}</div><div class="stat-sub">De \${props.length} total</div><i class="ti ti-check stat-icon"></i></div>
      <div class="stat-card red"><div class="stat-label">Vendidas</div><div class="stat-val">\${vendidas}</div><div class="stat-sub">Cerradas</div><i class="ti ti-trophy stat-icon"></i></div>
      <div class="stat-card yellow"><div class="stat-label">Pausadas</div><div class="stat-val">\${pausadas}</div><div class="stat-sub">En revisi\xF3n</div><i class="ti ti-pause stat-icon"></i></div>
      <div class="stat-card blue"><div class="stat-label">Leads</div><div class="stat-val" id="dashLeadsNum">\u2014</div><div class="stat-sub">Total registrados</div><i class="ti ti-users stat-icon"></i></div>
    </div>
    <div class="table-wrap" style="margin-bottom:14px">
      <div class="table-header"><div class="table-title">Pipeline de Leads</div><button class="btn btn-primary btn-sm" onclick="showPage('pipeline')"><i class="ti ti-layout-kanban"></i> Ver Pipeline</button></div>
      <div id="dashPipelineStats" style="padding:14px 20px">
        <div class="pipeline-mini" id="dashPipelineMini"></div>
      </div>
    </div>
    <div class="table-wrap" style="margin-bottom:14px">
      <div class="table-header"><div class="table-title">Leads \xFAltimos 7 d\xEDas</div></div>
      <div id="dashLeadsChart" style="padding:14px 20px"><div class="dash-chart-bars" id="dashChartBars"></div></div>
    </div>
    <div class="dash-grid">
      <div class="table-wrap">
        <div class="table-header">
          <div class="table-title">Propiedades recientes</div>
          <button class="btn btn-primary btn-sm" onclick="openModal(null)"><i class="ti ti-plus"></i> Nueva</button>
        </div>
        \${buildTable(props.slice(0, 8))}
      </div>
      <div>
        <div class="table-wrap" style="margin-bottom:14px">
          <div class="table-header"><div class="table-title">Por tipo</div></div>
          <div style="padding:14px 20px">
            \${[['Casa',casas,'#F5820D'],['Finca',fincas,'#22c55e'],['Apartamento',apts,'#3b82f6'],['Otros',props.length-casas-fincas-apts,'#8A9BB0']].map(([tipo,n,color])=>\`
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <div style="font-size:12px;color:var(--text2);width:90px">\${tipo}</div>
              <div style="flex:1;height:8px;background:var(--border);border-radius:4px">
                <div style="height:100%;border-radius:4px;background:\${color};width:\${props.length?Math.round(n/props.length*100):0}%;transition:width .5s"></div>
              </div>
              <div style="font-size:12px;font-weight:700;color:var(--navy);width:24px;text-align:right">\${n}</div>
            </div>\`).join('')}
          </div>
        </div>
        <div class="table-wrap" id="dashLeadsWrap">
          <div class="table-header"><div class="table-title">\xDAltimos leads</div><button class="btn btn-ghost btn-sm" onclick="showPage('leads')">Ver todos</button></div>
          <div style="padding:20px;text-align:center;color:var(--text3);font-size:12px">Cargando...</div>
        </div>
      </div>
    </div>\`;
  
  fetch(API + '/api/leads', {credentials:'include'})
    .then(r => r.json()).then(leads => {
      leadsData = leads;
      const n = leads.length;
      document.querySelectorAll('#dashLeadsNum,#topLeadsCount').forEach(el => { if(el) el.textContent = n; });
      document.querySelectorAll('#leadsCount,#topLeadsCount').forEach(el => { if(el) el.textContent = n; });
      const wrap = document.getElementById('dashLeadsWrap');
      if (!wrap) return;
      if (!leads.length) { wrap.innerHTML += '<div style="padding:20px;text-align:center;color:var(--text3);font-size:12px">Sin leads a\xFAn</div>'; return; }
      wrap.querySelector('div:last-child').innerHTML = leads.slice(0,4).map(l => \`
        <div style="padding:10px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:8px">
          <div>
            <div style="font-size:12px;font-weight:700;color:var(--navy)">\${esc(l.nombre||'Sin nombre')}</div>
            <div style="font-size:11px;color:var(--text3)">\${esc(l.propiedad||'-')} \xB7 \${l.fecha?l.fecha.substring(0,10):'-'}</div>
          </div>
          \${l.telefono?\`<a href="https://wa.me/502\${l.telefono.replace(/\\D/g,'')}" target="_blank" class="wa-btn" style="padding:4px 10px;font-size:11px"><i class="ti ti-brand-whatsapp"></i></a>\`:''}
        </div>\`).join('');
      var miniEl = document.getElementById('dashPipelineMini');
      if (miniEl) {
        var stageColors = {Nuevo:'#3b82f6',Contactado:'#eab308',Interesado:'#f97316',Visita:'#8b5cf6',Cierre:'#22c55e',Perdido:'#6b7280'};
        var stageCounts = {};
        pipelineStages.forEach(function(s){ stageCounts[s] = 0; });
        leads.forEach(function(l){ var s = l.stage || leadStatuses[l.id||l.fecha] || 'Nuevo'; stageCounts[s] = (stageCounts[s]||0) + 1; });
        miniEl.innerHTML = pipelineStages.map(function(s){
          return '<div class="pipeline-mini-col"><div class="pm-count" style="color:' + stageColors[s] + '">' + (stageCounts[s]||0) + '</div><div class="pm-label">' + s + '</div></div>';
        }).join('');
      }
      var chartEl = document.getElementById('dashChartBars');
      if (chartEl) {
        var today = new Date();
        var days = [];
        var dayCounts = [];
        for (var d = 6; d >= 0; d--) {
          var dt = new Date(today); dt.setDate(dt.getDate() - d);
          var key = dt.toISOString().substring(0,10);
          days.push(dt.toLocaleDateString('es',{weekday:'short'}).substring(0,3));
          var count = 0;
          leads.forEach(function(l){ if(l.fecha && l.fecha.substring(0,10) === key) count++; });
          dayCounts.push(count);
        }
        var maxC = Math.max.apply(null, dayCounts) || 1;
        chartEl.innerHTML = days.map(function(day, i){
          var h = Math.round((dayCounts[i]/maxC)*60);
          return '<div class="bar-wrap"><div class="bar" style="height:' + h + 'px"></div><div class="bar-label">' + day + '</div></div>';
        }).join('');
      }
    }).catch(() => {});
}

// \u2500\u2500 PROPIEDADES PAGE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function renderPropiedades(mc) {
  mc.innerHTML = \`
    <div class="table-wrap">
      <div class="table-header">
        <div class="search-box"><i class="ti ti-search"></i><input type="text" id="searchInput" placeholder="Buscar propiedad..." oninput="filterTable()"></div>
        <div style="display:flex;gap:8px">
          <select id="filterStatus" onchange="filterTable()" style="padding:6px 10px;border:1px solid var(--border2);border-radius:7px;font-size:12px;outline:none">
            <option value="">Todos los estados</option>
            <option value="Activa">Activas</option>
            <option value="Vendida">Vendidas</option>
            <option value="Pausada">Pausadas</option>
          </select>
          <button class="btn btn-primary btn-sm" onclick="openModal(null)"><i class="ti ti-plus"></i> Nueva</button>
        </div>
      </div>
      <div id="tableBody">\${buildTable(props)}</div>
    </div>\`;
}

function filterTable() {
  const q  = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const st = document.getElementById('filterStatus')?.value || '';
  let filtered = props;
  if (q) filtered = filtered.filter(p => (p.titulo||'').toLowerCase().includes(q) || (p.municipio||p.zona||'').toLowerCase().includes(q) || (p.tipo||'').toLowerCase().includes(q));
  if (st) filtered = filtered.filter(p => (p.estado||'Activa') === st);
  const tb = document.getElementById('tableBody');
  if (tb) tb.innerHTML = buildTable(filtered);
}

function buildTable(data) {
  if (!data || !data.length) return '<div style="padding:40px;text-align:center;color:var(--text3);font-size:13px">Sin propiedades</div>';
  let rows = '';
  data.forEach((p, i) => {
    const id  = encodeURIComponent(p.id || p.slug || i);
    const est = p.estado || 'Activa';
    const bc  = est==='Vendida'?'badge-red':est==='Pausada'?'badge-gray':'badge-green';
    const img = p.imagen ? \`<img class="prop-img" src="\${p.imagen}" onerror="this.style.opacity='.3'">\` : \`<div class="prop-img"></div>\`;
    const comp = calcCompletion(p);
    const compColor = comp>=80?'#22c55e':comp>=50?'#f59e0b':'#ef4444';
    rows += \`<tr>
      <td style="white-space:nowrap">\${img}</td>
      <td>
        <div class="prop-name" title="\${esc(p.titulo||'')}">\${esc(p.titulo||'')}</div>
        <div class="prop-loc">\${esc(p.municipio||p.zona||'')} \xB7 \${esc(p.tipo||'')}</div>
        <div class="completion-bar"><div class="completion-fill" style="width:\${comp}%;background:\${compColor}"></div></div>
      </td>
      <td class="price-cell">\${esc(p.priceFormatted||p.precio||'\u2014')}</td>
      <td><span class="badge \${bc}">\${esc(est)}</span></td>
      <td style="font-size:11px;color:var(--text3)">\${comp}%</td>
      <td><div class="actions-cell">
        <div class="icon-btn" title="Editar" onclick="openModal('\${id}')"><i class="ti ti-edit"></i></div>
        <div class="icon-btn success" title="Ver en sitio" onclick="window.open('https://zona-innmueble.com/propiedades/\${p.slug||p.id}.html','_blank')"><i class="ti ti-external-link"></i></div>
        <div class="icon-btn danger" title="Eliminar" onclick="deleteProp('\${id}','\${esc(p.titulo||'')}')"><i class="ti ti-trash"></i></div>
      </div></td>
    </tr>\`;
  });
  return \`<table>
    <thead><tr><th></th><th>Propiedad</th><th>Precio</th><th>Estado</th><th>Completud</th><th>Acciones</th></tr></thead>
    <tbody>\${rows}</tbody>
  </table>\`;
}

function calcCompletion(p) {
  const checks = [
    p.titulo, p.precio, p.tipo, p.municipio||p.zona,
    p.descripcion, p.imagen, (p.gallery&&p.gallery.length>1),
    p.habitaciones||p.manzanas, p.banos, p.area||p.areaConst,
    p.caracteristicas&&p.caracteristicas.length
  ];
  const done = checks.filter(Boolean).length;
  return Math.round(done / checks.length * 100);
}

// \u2500\u2500 LEADS CRM \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
let currentLeadFilter = 'all';

async function renderLeads(mc) {
  mc.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text3)">Cargando leads...</div>';
  try {
    const r = await fetch(API + '/api/leads', {credentials:'include'});
    leadsData = await r.json();
    document.querySelectorAll('#leadsCount,#topLeadsCount').forEach(el => { if(el) el.textContent = leadsData.length; });
    
    if (!leadsData.length) {
      mc.innerHTML = \`<div style="padding:60px;text-align:center">
        <i class="ti ti-users" style="font-size:48px;color:var(--border);display:block;margin-bottom:12px"></i>
        <div style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:4px">Sin leads a\xFAn</div>
        <div style="font-size:12px;color:var(--text3)">Los leads aparecer\xE1n aqu\xED cuando los clientes completen el formulario del sitio.</div>
      </div>\`;
      return;
    }

    const statusCounts = leadsData.reduce((acc, l) => {
      const s = leadStatuses[l.id||l.fecha] || 'Nuevo';
      acc[s] = (acc[s]||0) + 1;
      return acc;
    }, {});

    mc.innerHTML = \`
      <div class="leads-filters">
        <button class="lead-filter-btn active" onclick="filterLeads('all',this)">Todos (\${leadsData.length})</button>
        <button class="lead-filter-btn" onclick="filterLeads('Nuevo',this)">Nuevos (\${statusCounts['Nuevo']||0})</button>
        <button class="lead-filter-btn" onclick="filterLeads('Contactado',this)">Contactados (\${statusCounts['Contactado']||0})</button>
        <button class="lead-filter-btn" onclick="filterLeads('Calificado',this)">Calificados (\${statusCounts['Calificado']||0})</button>
        <button class="lead-filter-btn" onclick="filterLeads('Cerrado',this)">Cerrados (\${statusCounts['Cerrado']||0})</button>
      </div>
      <div id="leadsList">\${buildLeadsList(leadsData)}</div>\`;
  } catch(e) {
    mc.innerHTML = '<div style="padding:40px;text-align:center;color:var(--red)">Error cargando leads.</div>';
  }
}

function buildLeadsList(leads) {
  return leads.map((l, i) => {
    const lid = l.id || l.fecha || i;
    const st = leadStatuses[lid] || 'Nuevo';
    const stColors = {Nuevo:'badge-blue',Contactado:'badge-yellow',Calificado:'badge-orange',Cerrado:'badge-green'};
    return \`
      <div class="lead-card" data-status="\${st}" data-id="\${lid}" onclick="openLeadDetail('\${lid}')" style="cursor:pointer">
        <div class="lead-header">
          <div>
            <div class="lead-name">\${esc(l.nombre||'Sin nombre')}</div>
            <span class="badge \${stColors[st]||'badge-gray'}" style="margin-top:4px">\${st}</span>
          </div>
          <div class="lead-time">\${l.fecha?l.fecha.substring(0,10):'-'}</div>
        </div>
        \${l.telefono?\`<div class="lead-detail"><i class="ti ti-phone"></i> \${esc(l.telefono)}</div>\`:''}
        \${l.propiedad?\`<div class="lead-detail"><i class="ti ti-building"></i> \${esc(l.propiedad)}</div>\`:''}
        \${l.mensaje?\`<div class="lead-detail" style="font-style:italic"><i class="ti ti-message"></i> "\${esc(l.mensaje)}"</div>\`:''}
        <div class="lead-actions">
          \${l.telefono?\`<a class="wa-btn" href="https://wa.me/502\${l.telefono.replace(/\\D/g,'')}" target="_blank"><i class="ti ti-brand-whatsapp"></i> Contactar</a>\`:''}
          <select class="lead-status-sel" onchange="updateLeadStatus('\${lid}',this.value)">
            <option \${st==='Nuevo'?'selected':''}>Nuevo</option>
            <option \${st==='Contactado'?'selected':''}>Contactado</option>
            <option \${st==='Calificado'?'selected':''}>Calificado</option>
            <option \${st==='Cerrado'?'selected':''}>Cerrado</option>
          </select>
          <button class="lead-note-btn" onclick="toggleNote('note-\${lid}')"><i class="ti ti-note"></i> Nota</button>
        </div>
        <div class="lead-note-area" id="note-\${lid}">
          <textarea placeholder="Escribe una nota sobre este lead..." rows="2">\${l._nota||''}</textarea>
        </div>
      </div>\`;
  }).join('');
}

function filterLeads(status, btn) {
  currentLeadFilter = status;
  document.querySelectorAll('.lead-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = status === 'all' ? leadsData : leadsData.filter(l => {
    const lid = l.id || l.fecha;
    return (leadStatuses[lid] || 'Nuevo') === status;
  });
  const list = document.getElementById('leadsList');
  if (list) list.innerHTML = buildLeadsList(filtered);
}

function updateLeadStatus(lid, status) {
  leadStatuses[lid] = status;
  try { localStorage.setItem('zin_ls', JSON.stringify(leadStatuses)); } catch(e) {}
  const card = document.querySelector(\`[data-id="\${lid}"]\`);
  if (card) card.dataset.status = status;
  showToast(\`Estado: \${status}\`, 'success');
}

function toggleNote(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

// \u2500\u2500 PIPELINE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
var pipelineStages = ['Nuevo','Contactado','Interesado','Visita','Cierre','Perdido'];

async function renderPipeline(mc) {
  mc.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text3)">Cargando pipeline...</div>';
  try {
    var r = await fetch(API + '/api/leads', {credentials:'include'});
    leadsData = await r.json();
    document.querySelectorAll('#leadsCount,#topLeadsCount').forEach(function(el){ if(el) el.textContent = leadsData.length; });
    var grouped = {};
    pipelineStages.forEach(function(s){ grouped[s] = []; });
    leadsData.forEach(function(l){
      var stage = l.stage || leadStatuses[l.id||l.fecha] || 'Nuevo';
      if (!grouped[stage]) grouped[stage] = [];
      grouped[stage].push(l);
    });
    var colsHtml = pipelineStages.map(function(stage){
      var cards = grouped[stage] || [];
      var cardsHtml = cards.map(function(l){
        var lid = l.id || l.fecha || '';
        var score = l.lead_score || 0;
        var tier = l.lead_tier || (score >= 70 ? 'HOT' : (score >= 40 ? 'WARM' : 'COLD'));
        var tierClass = tier === 'HOT' ? 'score-hot' : (tier === 'WARM' ? 'score-warm' : 'score-cold');
        var phone = l.telefono || '';
        return '<div class="kanban-card" onclick="openLeadDetail('' + lid + '')">'+
          '<div class="kc-name">' + esc(l.nombre||'Sin nombre') + '</div>'+
          (l.propiedad ? '<div class="kc-prop"><i class="ti ti-building"></i> ' + esc(l.propiedad) + '</div>' : '')+
          (phone ? '<div class="kc-phone"><i class="ti ti-phone"></i> ' + esc(phone) + '</div>' : '')+
          '<div class="kc-meta">'+
            '<span class="score-badge ' + tierClass + '">' + tier + '</span>'+
            '<span class="kc-date">' + (l.fecha ? l.fecha.substring(0,10) : '-') + '</span>'+
          '</div>'+
        '</div>';
      }).join('');
      return '<div class="kanban-col" data-stage="' + stage + '">'+
        '<div class="kanban-col-header"><span>' + stage + '</span><span class="col-count">' + cards.length + '</span></div>'+
        '<div class="kanban-cards">' + (cardsHtml || '<div style="padding:20px;text-align:center;font-size:11px;color:var(--text3)">Sin leads</div>') + '</div>'+
      '</div>';
    }).join('');
    mc.innerHTML = '<div class="kanban-board">' + colsHtml + '</div>';
  } catch(e) {
    mc.innerHTML = '<div style="padding:40px;text-align:center;color:var(--red)">Error cargando pipeline.</div>';
  }
}

function openLeadDetail(lid) {
  var lead = null;
  for (var i = 0; i < leadsData.length; i++) {
    if ((leadsData[i].id || leadsData[i].fecha) === lid) { lead = leadsData[i]; break; }
  }
  if (!lead) return;
  var score = lead.lead_score || 0;
  var tier = lead.lead_tier || (score >= 70 ? 'HOT' : (score >= 40 ? 'WARM' : 'COLD'));
  var tierClass = tier === 'HOT' ? 'score-hot' : (tier === 'WARM' ? 'score-warm' : 'score-cold');
  var currentStage = lead.stage || leadStatuses[lid] || 'Nuevo';
  var phone = lead.telefono || '';
  var waLink = phone ? 'https://wa.me/502' + phone.replace(/\\D/g,'') : '';
  var notesHtml = '';
  if (lead.notes_history && lead.notes_history.length) {
    for (var n = 0; n < lead.notes_history.length; n++) {
      var note = lead.notes_history[n];
      notesHtml += '<div class="lm-note-item"><div class="note-date">' + (note.date || '-') + '</div>' + esc(note.text || '') + '</div>';
    }
  }
  var stageOpts = pipelineStages.map(function(s){
    return '<option' + (s === currentStage ? ' selected' : '') + '>' + s + '</option>';
  }).join('');
  var overlay = document.createElement('div');
  overlay.className = 'lead-modal-overlay';
  overlay.onclick = function(e){ if(e.target === overlay) overlay.remove(); };
  overlay.innerHTML = '<div class="lead-modal">'+
    '<div class="lead-modal-head"><h3>' + esc(lead.nombre||'Lead') + ' <span class="score-badge ' + tierClass + '" style="margin-left:8px;font-size:11px">' + tier + ' (' + score + ')</span></h3><button class="lead-modal-close" onclick="this.closest(''.lead-modal-overlay'').remove()">&times;</button></div>'+
    '<div class="lead-modal-body">'+
      '<div class="lm-row">'+
        '<div class="lm-field"><div class="lm-label">Tel\xE9fono</div><div class="lm-value">' + esc(phone || '-') + '</div></div>'+
        '<div class="lm-field"><div class="lm-label">Email</div><div class="lm-value">' + esc(lead.email || '-') + '</div></div>'+
      '</div>'+
      '<div class="lm-row">'+
        '<div class="lm-field"><div class="lm-label">Propiedad</div><div class="lm-value">' + esc(lead.propiedad || '-') + '</div></div>'+
        '<div class="lm-field"><div class="lm-label">Presupuesto</div><div class="lm-value">' + esc(lead.presupuesto || lead.budget || '-') + '</div></div>'+
      '</div>'+
      '<div class="lm-row">'+
        '<div class="lm-field"><div class="lm-label">Fuente</div><div class="lm-value">' + esc(lead.fuente || lead.source || '-') + '</div></div>'+
        '<div class="lm-field"><div class="lm-label">Fecha</div><div class="lm-value">' + (lead.fecha ? lead.fecha.substring(0,10) : '-') + '</div></div>'+
      '</div>'+
      (lead.mensaje ? '<div class="lm-row"><div class="lm-field"><div class="lm-label">Mensaje</div><div class="lm-value" style="font-style:italic">"' + esc(lead.mensaje) + '"</div></div></div>' : '')+
      '<div class="lm-section">Etapa</div>'+
      '<select class="lm-stage-sel" id="ldStage">' + stageOpts + '</select>'+
      '<div class="lm-section">Seguimiento</div>'+
      '<input type="date" class="lm-followup" id="ldFollowup" value="' + (lead.followup_date || '') + '">'+
      '<div class="lm-section">Notas</div>'+
      '<div class="lm-notes-list">' + (notesHtml || '<div style="font-size:12px;color:var(--text3);padding:8px">Sin notas a\xFAn.</div>') + '</div>'+
      '<textarea class="lm-note-input" id="ldNote" placeholder="Agregar nota..."></textarea>'+
      '<div class="lm-actions">'+
        (waLink ? '<a class="btn btn-sm" style="background:#25d366;color:#fff;border:none;text-decoration:none;text-align:center" href="' + waLink + '" target="_blank"><i class="ti ti-brand-whatsapp"></i> WhatsApp</a>' : '')+
        '<button class="btn btn-sm" style="background:var(--navy);color:#fff;border:none" onclick="saveLeadDetail('' + lid + '')"><i class="ti ti-device-floppy"></i> Guardar</button>'+
      '</div>'+
    '</div>'+
  '</div>';
  document.body.appendChild(overlay);
}

async function saveLeadDetail(lid) {
  var stage = document.getElementById('ldStage').value;
  var followup = document.getElementById('ldFollowup').value;
  var noteText = document.getElementById('ldNote').value.trim();
  try {
    var r = await fetch(API + '/api/leads/update', {
      method:'PUT', credentials:'include',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({id:lid, stage:stage, followup_date:followup})
    });
    if (!r.ok) throw new Error('update failed');
    leadStatuses[lid] = stage;
    try { localStorage.setItem('zin_ls', JSON.stringify(leadStatuses)); } catch(e) {}
    if (noteText) {
      await fetch(API + '/api/leads/note', {
        method:'POST', credentials:'include',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({lead_id:lid, text:noteText})
      });
    }
    var overlay = document.querySelector('.lead-modal-overlay');
    if (overlay) overlay.remove();
    showToast('Lead actualizado', 'success');
    var mc = document.getElementById('mainContent');
    var activePage = document.querySelector('.sb-item.active');
    if (activePage && activePage.id === 'nav-pipeline') renderPipeline(mc);
    else if (activePage && activePage.id === 'nav-leads') renderLeads(mc);
  } catch(e) {
    showToast('Error al guardar lead', 'error');
  }
}

// \u2500\u2500 REBUILD \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function triggerRebuild() {
  showToast('Publicando sitio...', 'success');
  try {
    const r = await fetch(API + '/api/rebuild', {method:'POST',credentials:'include'});
    if (r.ok) showToast('\xA1Sitio publicado! Actualizando en ~30 seg.', 'success');
    else showToast('Error al publicar. Intenta de nuevo.', 'error');
  } catch(e) { showToast('Error de conexi\xF3n.', 'error'); }
}

// \u2500\u2500 MODAL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function openModal(id) {
  editingId = null; galUrls = []; currentStatus = 'Activa';
  clearForm();
  document.getElementById('btnDuplicate').style.display = 'none';
  if (id) {
    const decoded = decodeURIComponent(id);
    const p = props.find(x => (x.id||x.slug) === decoded || encodeURIComponent(x.id||x.slug) === id);
    if (p) {
      editingId = p.id || p.slug;
      document.getElementById('modalTitle').textContent = 'Editar propiedad';
      document.getElementById('btnDuplicate').style.display = 'inline-flex';
      loadForm(p);
    }
  } else {
    document.getElementById('modalTitle').textContent = 'Nueva propiedad';
  }
  switchTab('basico');
  document.getElementById('modalOverlay').classList.add('open');
  updateProgress();
}

function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

function switchTab(tab) {
  document.querySelectorAll('.ftab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
  const panel = document.getElementById('tab-' + tab);
  if (panel) panel.classList.add('active');
  const tabs = {basico:0,detalles:1,contenido:2,caracteristicas:3,publicacion:4};
  const idx = tabs[tab];
  document.querySelectorAll('.ftab')[idx]?.classList.add('active');
}

function togglePriv(id) {
  const el = document.getElementById(id);
  if (el) el.checked = !el.checked;
}

function clearForm() {
  const ids = ['fTitulo','fPrecio','fMoneda','fCodigo','fZona','fMunicipio','fUbicacionGeneral',
    'fArea','fAreaV2','fHabitaciones','fBanos','fMediosBanos','fParqueos','fNiveles',
    'fDatosTecnicos','fTerreno','fAnioConstruccion','fDescripcion','fHook','fDescCorta',
    'fPdfUrl','fPrecioReal','fContactoVendedor','fNotasInternas','fEstadoLegal',
    'fSlug','fLat','fLng','fImagen','fManzanas','fCultivo','fTituloFinca',
    'fTiempoCarretera','fPrecioRenta','fBancoFin','fDisponibleDesde','fNumeroPiso',
    'fAreaBalcon','fAsesor','fWaAsesor','fTagsSeo','fVideoUrl','fPlano',
    'fVistas','fFavoritos','fFechaPublicacion','fAntiguedad','fCuotaMant'];
  ids.forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  ['fEstadoConstruccion','fTipoConstruccion','fTecho','fPiso','fAcabados',
   'fDepartamento','fOrientacion','fVista','fCertEnerg'].forEach(id => {
    const el=document.getElementById(id); if(el) el.value='';
  });
  document.getElementById('fTipo').value = 'Casa';
  document.getElementById('fOperacion').value = 'Venta';
  document.getElementById('fTipoListing').value = 'Residencial';
  document.getElementById('sZona').checked = true;
  document.getElementById('sInmu').checked = false;
  ['privPrecio','privDireccion','privGaleria','privDatos','privDesc','privExclusiva'].forEach(id => {
    const el=document.getElementById(id); if(el) el.checked=false;
  });
  document.querySelectorAll('.char-item input[type=checkbox]').forEach(cb => {
    cb.checked=false; cb.closest('.char-item').classList.remove('checked');
  });
  setStatus('Activa');
  galUrls = []; renderGallery();
  const imgPrev = document.getElementById('imgPreview');
  if (imgPrev) imgPrev.style.display = 'none';
}

function loadForm(p) {
  const set = (id, val) => { const el=document.getElementById(id); if(el) el.value=val||''; };
  set('fTitulo', p.titulo); set('fPrecio', p.precio); set('fMoneda', p.moneda||'$'); set('fCodigo', p.codigo);
  set('fZona', p.zona); set('fMunicipio', p.municipio); set('fUbicacionGeneral', p.ubicacionGeneral);
  set('fArea', p.area||p.areaConst); set('fAreaV2', p.areaV2);
  set('fHabitaciones', p.habitaciones); set('fBanos', p.banos);
  set('fMediosBanos', p.mediosBanos); set('fParqueos', p.parqueos);
  set('fNiveles', p.niveles); set('fDatosTecnicos', p.datosTecnicos);
  set('fTerreno', p.terreno); set('fAnioConstruccion', p.anioConstruccion);
  set('fEstadoConstruccion', p.estadoConstruccion); set('fTipoConstruccion', p.tipoConstruccion);
  set('fTecho', p.techo); set('fPiso', p.piso); set('fAcabados', p.acabados);
  set('fOrientacion', p.orientacion); set('fAntiguedad', p.antiguedad);
  set('fCuotaMant', p.cuotaMant); set('fDescripcion', p.descripcion);
  set('fHook', p.hook); set('fDescCorta', p.descCorta);
  set('fPdfUrl', p.pdfUrl); set('fPrecioReal', p.precioReal);
  set('fContactoVendedor', p.contactoVendedor); set('fNotasInternas', p.notasInternas);
  set('fEstadoLegal', p.estadoLegal); set('fSlug', p.slug);
  set('fLat', p.lat); set('fLng', p.lng); set('fImagen', p.imagen||p.mainImage);
  set('fManzanas', p.manzanas); set('fCultivo', p.cultivo);
  set('fTituloFinca', p.tituloFinca); set('fTiempoCarretera', p.tiempoCarretera);
  set('fPrecioRenta', p.precioRenta); set('fBancoFin', p.bancoFin);
  set('fDisponibleDesde', p.disponibleDesde); set('fNumeroPiso', p.numeroPiso);
  set('fAreaBalcon', p.areaBalcon); set('fVista', p.vista);
  set('fAsesor', p.asesor); set('fWaAsesor', p.waAsesor);
  set('fTagsSeo', p.tagsSeo); set('fVideoUrl', p.videoUrl||p.video);
  set('fPlano', p.plano); set('fVistas', p.vistas||0); set('fFavoritos', p.favoritos||0);
  set('fFechaPublicacion', p.fechaPublicacion);
  const sel = (id, val) => { const el=document.getElementById(id); if(el&&val) el.value=val; };
  sel('fTipo', p.tipo); sel('fOperacion', p.operacion||p.cinta);
  sel('fTipoListing', p.tipoListing); sel('fDepartamento', p.departamento);
  sel('fOrientacion', p.orientacion); sel('fVista', p.vista); sel('fCertEnerg', p.certEnerg);
  // privConfig
  const cfg = p.privConfig || {};
  document.getElementById('privPrecio').checked = !!cfg.precio;
  document.getElementById('privDireccion').checked = !!cfg.direccion;
  document.getElementById('privGaleria').checked = !!cfg.galeria;
  document.getElementById('privDatos').checked = !!cfg.datos;
  document.getElementById('privDesc').checked = !!cfg.descripcion;
  document.getElementById('privExclusiva').checked = !!(p.esExclusiva || cfg.exclusiva);
  document.getElementById('sZona').checked = p.sitios ? p.sitios.includes('zona') : true;
  document.getElementById('sInmu').checked = p.sitios ? p.sitios.includes('inmu') : false;
  setStatus(p.estado || 'Activa');
  if (p.caracteristicas) {
    document.querySelectorAll('.char-item input[type=checkbox]').forEach(cb => {
      const on = p.caracteristicas.includes(cb.value);
      cb.checked = on; cb.closest('.char-item').classList.toggle('checked', on);
    });
  }
  galUrls = (p.gallery||[]).filter(u => u && u !== (p.imagen||p.mainImage));
  renderGallery();
  if (p.imagen||p.mainImage) {
    const img = document.getElementById('imgPreview');
    if (img) { img.src = p.imagen||p.mainImage; img.style.display='block'; }
  }
  updateProgress();
}

function setStatus(st) {
  currentStatus = st;
  document.getElementById('fEstado').value = st;
  document.querySelectorAll('#statusPills .pill').forEach(p => p.classList.toggle('active', p.textContent===st));
}

function previewImg() {
  const val = document.getElementById('fImagen').value;
  const img = document.getElementById('imgPreview');
  if (val) { img.src=val; img.style.display='block'; } else { img.style.display='none'; }
}

function addGalImgBulk() {
  const url = prompt('URL de la imagen (ImageKit):');
  if (url && url.trim()) { galUrls.push(url.trim()); renderGallery(); }
}

function removeGalImg(i) { galUrls.splice(i,1); renderGallery(); }

function renderGallery() {
  const wrap = document.getElementById('galWrap');
  if (!wrap) return;
  wrap.innerHTML = galUrls.map((u,i) =>
    \`<div class="gal-item"><img src="\${u}" onerror="this.style.opacity='.3'"><button class="gal-remove" onclick="removeGalImg(\${i})">\xD7</button></div>\`
  ).join('');
  const cnt = document.getElementById('galCount');
  if (cnt) cnt.textContent = galUrls.length;
}

function autoSlug() {
  const titulo = document.getElementById('fTitulo').value;
  if (!titulo) return;
  const slug = titulo.toLowerCase()
    .replace(/[\xE1\xE0\xE4\xE2]/g,'a').replace(/[\xE9\xE8\xEB\xEA]/g,'e').replace(/[\xED\xEC\xEF\xEE]/g,'i')
    .replace(/[\xF3\xF2\xF6\xF4]/g,'o').replace(/[\xFA\xF9\xFC\xFB]/g,'u').replace(/\xF1/g,'n')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  document.getElementById('fSlug').value = slug;
}

function autoFormatPrice() { /* prix auto-format placeholder */ }

function updateProgress() {
  const titulo = document.getElementById('fTitulo')?.value;
  const precio = document.getElementById('fPrecio')?.value;
  const tipo = document.getElementById('fTipo')?.value;
  const municipio = document.getElementById('fMunicipio')?.value;
  const desc = document.getElementById('fDescripcion')?.value;
  const imagen = document.getElementById('fImagen')?.value;
  const hab = document.getElementById('fHabitaciones')?.value;
  const banos = document.getElementById('fBanos')?.value;
  const area = document.getElementById('fArea')?.value;
  const hook = document.getElementById('fHook')?.value;
  const slug = document.getElementById('fSlug')?.value;
  const checks = [titulo,precio,tipo,municipio,desc,imagen,hab,banos,area,hook,slug,galUrls.length>0];
  const done = checks.filter(Boolean).length;
  const pct = Math.round(done/checks.length*100);
  document.querySelectorAll('#modalProgress,#progressLabel').forEach(el => {
    if(el) el.textContent = \`\${pct}% completo\`;
  });
}

function shareWA() {
  const titulo = document.getElementById('fTitulo').value || 'Propiedad';
  const slug = document.getElementById('fSlug').value;
  const url = slug ? \`https://zona-innmueble.com/propiedades/\${slug}.html\` : 'https://zona-innmueble.com';
  const msg = encodeURIComponent(\`*\${titulo}*\\n\${url}\`);
  window.open(\`https://wa.me/?text=\${msg}\`, '_blank');
}

function copyLink() {
  const slug = document.getElementById('fSlug').value;
  if (!slug) { showToast('Primero genera el slug', 'error'); return; }
  navigator.clipboard.writeText(\`https://zona-innmueble.com/propiedades/\${slug}.html\`);
  showToast('Enlace copiado \u2713', 'success');
}

async function duplicateProp() {
  if (!editingId) return;
  const p = props.find(x => (x.id||x.slug) === editingId);
  if (!p) return;
  galUrls = [...(p.gallery || [])];
  privConfig = {...(p.privConfig || {})};
  currentStatus = 'Activa';
  editingId = null;
  document.getElementById('fTitulo').value = (p.titulo||'') + ' (Copia)';
  document.getElementById('fSlug').value = '';
  document.getElementById('modalTitle').textContent = 'Duplicar propiedad';
  document.getElementById('btnDuplicate').style.display = 'none';
  renderGallery();
  // apply privConfig toggles from duplicated property
  const _pce = document.getElementById('privPrecio'); if(_pce) _pce.checked = !!privConfig.precio;
  const _pdi = document.getElementById('privDireccion'); if(_pdi) _pdi.checked = !!privConfig.direccion;
  const _pga = document.getElementById('privGaleria'); if(_pga) _pga.checked = !!privConfig.galeria;
  const _pda = document.getElementById('privDatos'); if(_pda) _pda.checked = !!privConfig.datos;
  const _pds = document.getElementById('privDesc'); if(_pds) _pds.checked = !!privConfig.descripcion;
  const _pex = document.getElementById('privExclusiva'); if(_pex) _pex.checked = !!privConfig.exclusiva;
  showToast('Editando copia \u2014 guarda para crear', 'success');
}

async function saveProp() {
  const titulo = document.getElementById('fTitulo').value.trim();
  if (!titulo) { showToast('El t\xEDtulo es obligatorio', 'error'); switchTab('basico'); return; }
  const chars = Array.from(document.querySelectorAll('.char-item input[type=checkbox]:checked')).map(cb => cb.value);
  const sitios = [];
  if (document.getElementById('sZona').checked) sitios.push('zona');
  if (document.getElementById('sInmu').checked) sitios.push('inmu');
  const g = id => { const el=document.getElementById(id); return el ? el.value.trim() : ''; };
  const privConfig = {
    precio: document.getElementById('privPrecio').checked,
    direccion: document.getElementById('privDireccion').checked,
    galeria: document.getElementById('privGaleria').checked,
    datos: document.getElementById('privDatos').checked,
    descripcion: document.getElementById('privDesc').checked,
    exclusiva: document.getElementById('privExclusiva').checked,
  };
  const data = {
    titulo, precio:g('fPrecio'), moneda:g('fMoneda')||'$', codigo:g('fCodigo'),
    tipo:g('fTipo'), operacion:g('fOperacion'), tipoListing:g('fTipoListing'),
    zona:g('fZona'), municipio:g('fMunicipio'), ubicacionGeneral:g('fUbicacionGeneral'),
    area:g('fArea'), areaV2:g('fAreaV2'), terreno:g('fTerreno'),
    habitaciones:g('fHabitaciones'), banos:g('fBanos'), mediosBanos:g('fMediosBanos'),
    parqueos:g('fParqueos'), niveles:g('fNiveles'), datosTecnicos:g('fDatosTecnicos'),
    anioConstruccion:g('fAnioConstruccion'), estadoConstruccion:g('fEstadoConstruccion'),
    tipoConstruccion:g('fTipoConstruccion'), techo:g('fTecho'),
    piso:g('fPiso'), acabados:g('fAcabados'),
    orientacion:g('fOrientacion'), antiguedad:g('fAntiguedad'), cuotaMant:g('fCuotaMant'),
    numeroPiso:g('fNumeroPiso'), areaBalcon:g('fAreaBalcon'), vista:g('fVista'),
    manzanas:g('fManzanas'), cultivo:g('fCultivo'), tituloFinca:g('fTituloFinca'),
    tiempoCarretera:g('fTiempoCarretera'), precioRenta:g('fPrecioRenta'),
    bancoFin:g('fBancoFin'), disponibleDesde:g('fDisponibleDesde'),
    descripcion:g('fDescripcion'), hook:g('fHook'), descCorta:g('fDescCorta'),
    pdfUrl:g('fPdfUrl'), precioReal:g('fPrecioReal'),
    contactoVendedor:g('fContactoVendedor'), notasInternas:g('fNotasInternas'),
    estadoLegal:g('fEstadoLegal'), departamento:g('fDepartamento'),
    lat:g('fLat'), lng:g('fLng'), slug:g('fSlug'),
    imagen:g('fImagen'), gallery:galUrls,
    asesor:g('fAsesor'), waAsesor:g('fWaAsesor'),
    tagsSeo:g('fTagsSeo'), videoUrl:g('fVideoUrl'), plano:g('fPlano'),
    certEnerg:g('fCertEnerg'), vistas:parseInt(g('fVistas'))||0,
    favoritos:parseInt(g('fFavoritos'))||0, fechaPublicacion:g('fFechaPublicacion'),
    estado:currentStatus, caracteristicas:chars, sitios, privConfig,
    esExclusiva: privConfig.exclusiva,
    ...(editingId ? {id:editingId} : {})
  };
  try {
    const r = await fetch(API + '/api/propiedades', {
      method: editingId ? 'PUT' : 'POST',
      credentials:'include',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data)
    });
    if (r.ok) {
      showToast(editingId ? 'Propiedad actualizada \u2713' : 'Propiedad creada \u2713', 'success');
      closeModal();
      await loadProps();
      showPage('propiedades');
    } else { showToast('Error al guardar', 'error'); }
  } catch(e) { showToast('Error de conexi\xF3n', 'error'); }
}

async function deleteProp(id, titulo) {
  if (!confirm('\xBFEliminar "' + decodeURIComponent(titulo) + '"?')) return;
  try {
    const r = await fetch(API + '/api/propiedades/' + id, {method:'DELETE',credentials:'include'});
    if (r.ok) {
      showToast('Propiedad eliminada', 'success');
      await loadProps();
      showPage('propiedades');
    } else { showToast('Error al eliminar', 'error'); }
  } catch(e) { showToast('Error de conexi\xF3n', 'error'); }
}

// \u2500\u2500 UTILS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast '+(type||'');
  void t.offsetWidth; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 3000);
}

document.addEventListener('keydown', e => {
  if (e.key==='Escape') closeModal();
});

document.querySelectorAll('.char-item').forEach(item => {
  item.addEventListener('change', () => item.classList.toggle('checked', item.querySelector('input').checked));
});

checkSession();
<\/script>
</body>
</html>
`;
}
__name(getAdminHTML, "getAdminHTML");
__name2(getAdminHTML, "getAdminHTML");
__name22(getAdminHTML, "getAdminHTML");
var index_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const ALLOWED_ORIGINS = [
      "https://zona-innmueble.com",
      "https://www.zona-innmueble.com",
      "https://inmuhub.com",
      "https://www.inmuhub.com"
    ];
    function cors(req2) {
      const origin = req2.headers.get("Origin") || "";
      const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : "*";
      return {
        "Access-Control-Allow-Origin": allowed,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      };
    }
    __name(cors, "cors");
    __name2(cors, "cors");
    __name22(cors, "cors");
    function jsonRes(data2, status = 200) {
      return new Response(JSON.stringify(data2), {
        status,
        headers: { "Content-Type": "application/json", ...cors(request) }
      });
    }
    __name(jsonRes, "jsonRes");
    __name2(jsonRes, "jsonRes");
    __name22(jsonRes, "jsonRes");
    if (method === "OPTIONS") {
      return new Response(null, { headers: cors(request) });
    }
    if (method === "GET" && path === "/admin") {
      return Response.redirect("https://zona-innmueble.com/admin.html", 302);
    }
    if (method === "GET" && path === "/") {
      return new Response(getAdminHTML(), {
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }
    if (method === "GET" && path === "/dynamic-grid.js") {
      return new Response(getDynamicGridJS(), {
        headers: { "Content-Type": "application/javascript", "Cache-Control": "no-cache", ...cors(request) }
      });
    }
    if (method === "GET" && path === "/api/propiedades-publicas") {
      const raw2 = await env.DB.get("propiedades");
      const data2 = raw2 ? JSON.parse(raw2) : [];
      const pub2 = data2.filter((p) => p.estado !== "Pausada" && p.estado !== "Eliminada").map((p) => {
        const out = { ...p };
        if (p.privConfig) {
          if (p.privConfig.precio) delete out.precio;
          if (p.privConfig.direccion) {
            delete out.ubicacion;
            delete out.municipio;
          }
          if (p.privConfig.galeria) {
            delete out.gallery;
            delete out.galeria;
          }
          if (p.privConfig.datos) {
            delete out.habitaciones;
            delete out.banos;
            delete out.area;
          }
          if (p.privConfig.descripcion) delete out.descripcion;
        }
        return out;
      });
      return new Response(JSON.stringify(pub2), {
        headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60", ...cors(request) }
      });
    }
    if (method === "GET" && path === "/api/public/propiedades") {
      const raw2 = await env.DB.get("propiedades");
      const data2 = raw2 ? JSON.parse(raw2) : [];
      const pub2 = data2.filter((p) => p.estado !== "Pausada" && p.estado !== "Eliminada").map((p) => {
        const out = { ...p };
        if (p.privConfig) {
          if (p.privConfig.precio) delete out.precio;
          if (p.privConfig.direccion) {
            delete out.ubicacion;
            delete out.municipio;
          }
          if (p.privConfig.galeria) {
            delete out.gallery;
            delete out.galeria;
          }
          if (p.privConfig.datos) {
            delete out.habitaciones;
            delete out.banos;
            delete out.area;
          }
          if (p.privConfig.descripcion) delete out.descripcion;
        }
        return out;
      });
      return new Response(JSON.stringify(pub2), {
        headers: { "Content-Type": "application/json", "Cache-Control": "no-cache", ...cors(request) }
      });
    }
    if (method === "GET" && path === "/api/meta-feed.csv") {
      let csvEscape = /* @__PURE__ */ __name2(function(v) {
        const s2 = v === void 0 || v === null ? "" : String(v);
        if (/[",\n]/.test(s2)) return '"' + s2.replace(/"/g, '""') + '"';
        return s2;
      }, "csvEscape"), parsePriceGTQorUSD = /* @__PURE__ */ __name2(function(p) {
        const raw3 = p.precio || "";
        const stripped = raw3.replace(/^\s*Q\.?\s*/i, "").replace(/^\s*GTQ\s*/i, "").replace(/^\s*\$\s*/, "").replace(/^\s*USD\s*/i, "");
        const num = parseFloat(stripped.replace(/,/g, "").replace(/[^0-9.]/g, ""));
        let currency = "GTQ";
        if (p.moneda === "USD" || raw3.includes("$") || raw3.toUpperCase().includes("USD")) currency = "USD";
        return { amount: isNaN(num) ? 0 : num, currency };
      }, "parsePriceGTQorUSD");
      __name22(csvEscape, "csvEscape");
      __name22(parsePriceGTQorUSD, "parsePriceGTQorUSD");
      const raw2 = await env.DB.get("propiedades");
      const data2 = raw2 ? JSON.parse(raw2) : [];
      const rows = data2.filter((p) => (!p.estado || p.estado === "Activa") && (!p.sitios || p.sitios.includes("zona"))).map((p) => {
        const { amount, currency } = parsePriceGTQorUSD(p);
        const img = p.imagen || p.gallery && p.gallery[0] || "";
        return [
          csvEscape(p.slug || ""),
          csvEscape(p.titulo || ""),
          csvEscape(p.descripcion || p.descCorta || p.hook || (p.titulo || "")),
          csvEscape("in stock"),
          csvEscape("used"),
          csvEscape(amount ? amount.toFixed(2) + " " + currency : ""),
          csvEscape("https://zona-innmueble.com/propiedades/" + (p.slug || "")),
          csvEscape(img),
          csvEscape("Zona INNmueble")
        ].join(",");
      });
      const header = ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand"].join(",");
      const csv = [header, ...rows].join("\n") + "\n";
      return new Response(csv, {
        headers: { "Content-Type": "text/csv; charset=utf-8", "Cache-Control": "public, max-age=1800", ...cors(request) }
      });
    }
    if (method === "POST" && path === "/api/login") {
      let body2;
      try {
        body2 = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      const { user, pass } = body2 || {};
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const attemptsKey = "login_attempts:" + ip;
      const attemptsRaw = await env.DB.get(attemptsKey);
      const attempts = attemptsRaw ? JSON.parse(attemptsRaw) : { count: 0, ts: Date.now() };
      if (attempts.count >= LOGIN_MAX_ATTEMPTS) {
        const elapsed = (Date.now() - attempts.ts) / 1e3;
        if (elapsed < LOGIN_LOCKOUT_SECONDS) {
          return jsonRes({ error: `Demasiados intentos. Espera ${Math.ceil(LOGIN_LOCKOUT_SECONDS - elapsed)}s.` }, 429);
        }
        attempts.count = 0;
      }
      const adminUser = env.ADMIN_USER;
      const adminPass = env.ADMIN_PASS;
      if (!adminUser || !adminPass) {
        return jsonRes({ error: "Admin no configurado: falta ADMIN_USER/ADMIN_PASS en el Worker" }, 500);
      }
      if (user !== adminUser || pass !== adminPass) {
        attempts.count = (attempts.count || 0) + 1;
        attempts.ts = Date.now();
        await env.DB.put(attemptsKey, JSON.stringify(attempts), { expirationTtl: LOGIN_LOCKOUT_SECONDS });
        return jsonRes({ error: "Credenciales incorrectas" }, 401);
      }
      await env.DB.delete(attemptsKey);
      const token2 = generateToken();
      await env.DB.put("session:" + token2, "valid", { expirationTtl: SESSION_TTL });
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `session=${token2}; HttpOnly; Secure; SameSite=None; Max-Age=${SESSION_TTL}; Path=/`,
          ...cors(request)
        }
      });
    }
    if (method === "POST" && path === "/api/logout") {
      const cookie = request.headers.get("Cookie") || "";
      const match = cookie.match(/session=([^;]+)/);
      if (match) await env.DB.delete("session:" + match[1]);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "session=; HttpOnly; Secure; SameSite=None; Max-Age=0; Path=/",
          ...cors(request)
        }
      });
    }
    if (method === "GET" && path === "/api/me") {
      const authed2 = await requireAuth(request, env);
      if (!authed2) return jsonRes({ error: "No autenticado" }, 401);
      return jsonRes({ ok: true, user: env.ADMIN_USER || "admin" });
    }
    if (method === "GET" && path === "/api/propiedades") {
      const authed2 = await requireAuth(request, env);
      if (!authed2) return jsonRes({ error: "No autenticado" }, 401);
      const raw2 = await env.DB.get("propiedades");
      const data2 = raw2 ? JSON.parse(raw2) : [];
      return jsonRes(data2);
    }
    if (method === "POST" && path === "/api/propiedades") {
      const authed2 = await requireAuth(request, env);
      if (!authed2) return jsonRes({ error: "No autenticado" }, 401);
      const raw2 = await env.DB.get("propiedades");
      const data2 = raw2 ? JSON.parse(raw2) : [];
      let body2;
      try {
        body2 = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      body2.id = String(Date.now());
      body2.createdAt = (/* @__PURE__ */ new Date()).toISOString();
      if (!body2.slug && body2.titulo) {
        body2.slug = body2.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      body2.priceFormatted = formatPrecio(body2.precio, body2.moneda);
      data2.push(body2);
      await env.DB.put("propiedades", JSON.stringify(data2));
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true, id: body2.id });
    }
    if (method === "PUT" && path.startsWith("/api/propiedades/")) {
      const authed2 = await requireAuth(request, env);
      if (!authed2) return jsonRes({ error: "No autenticado" }, 401);
      const id2 = decodeURIComponent(path.slice("/api/propiedades/".length));
      const raw2 = await env.DB.get("propiedades");
      const data2 = raw2 ? JSON.parse(raw2) : [];
      const idx2 = data2.findIndex((p) => (p.id || p.slug || "") === id2);
      if (idx2 < 0) return jsonRes({ error: "No encontrado" }, 404);
      let body2;
      try {
        body2 = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body2.slug && body2.titulo) {
        body2.slug = body2.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      data2[idx2] = { ...data2[idx2], ...body2, id: id2 };
      data2[idx2].priceFormatted = formatPrecio(data2[idx2].precio, data2[idx2].moneda);
      await env.DB.put("propiedades", JSON.stringify(data2));
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true, prop: data2[idx2] });
    }
    if (method === "PUT" && path === "/api/propiedades") {
      const authed2 = await requireAuth(request, env);
      if (!authed2) return jsonRes({ error: "No autenticado" }, 401);
      let body2;
      try {
        body2 = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      const { id: id2 } = body2 || {};
      if (!id2) return jsonRes({ error: "ID requerido" }, 400);
      const raw2 = await env.DB.get("propiedades");
      const data2 = raw2 ? JSON.parse(raw2) : [];
      const idx2 = data2.findIndex((p) => (p.id || p.slug || "") === id2);
      if (idx2 < 0) return jsonRes({ error: "No encontrado" }, 404);
      if (!body2.slug && body2.titulo) {
        body2.slug = body2.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      data2[idx2] = { ...data2[idx2], ...body2, id: id2 };
      data2[idx2].priceFormatted = formatPrecio(data2[idx2].precio, data2[idx2].moneda);
      await env.DB.put("propiedades", JSON.stringify(data2));
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true, prop: data2[idx2] });
    }
    if (method === "DELETE" && path.startsWith("/api/propiedades/")) {
      const authed2 = await requireAuth(request, env);
      if (!authed2) return jsonRes({ error: "No autenticado" }, 401);
      const id2 = decodeURIComponent(path.slice("/api/propiedades/".length));
      const raw2 = await env.DB.get("propiedades");
      const data2 = raw2 ? JSON.parse(raw2) : [];
      const filtered = data2.filter((p) => {
        const pid = p.id || p.slug || "";
        return pid !== id2;
      });
      await env.DB.put("propiedades", JSON.stringify(filtered));
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true });
    }
    if (method === "GET" && path === "/api/leads") {
      const authed2 = await requireAuth(request, env);
      if (!authed2) return jsonRes({ error: "No autenticado" }, 401);
      const raw2 = await env.DB.get("leads");
      const data2 = raw2 ? JSON.parse(raw2) : [];
      return jsonRes(data2.sort((a, b2) => new Date(b2.fecha || b2.createdAt || 0) - new Date(a.fecha || a.createdAt || 0)));
    }
    if (method === "POST" && path === "/api/leads/import") {
      if (!await requireAuth(request, env)) return jsonRes({ error: "No autorizado" }, 401);
      var importBody;
      try {
        importBody = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!Array.isArray(importBody)) return jsonRes({ error: "Se espera un array" }, 400);
      var existingRaw = await env.DB.get("leads");
      var existing = existingRaw ? JSON.parse(existingRaw) : [];
      var phoneIndex = {};
      for (var ei = 0; ei < existing.length; ei++) {
        var ep = (existing[ei].phone || "").replace(/[^0-9]/g, "");
        if (ep) phoneIndex[ep] = true;
      }
      var added = 0;
      for (var ii = 0; ii < importBody.length; ii++) {
        var imp = importBody[ii];
        var impPhone = (imp.phone || "").replace(/[^0-9]/g, "");
        if (impPhone && phoneIndex[impPhone]) continue;
        if (!imp.id) imp.id = String(Date.now()) + "_" + ii;
        if (!imp.createdAt) imp.createdAt = (/* @__PURE__ */ new Date()).toISOString();
        if (!imp.fecha) imp.fecha = imp.createdAt.slice(0, 10);
        existing.push(imp);
        if (impPhone) phoneIndex[impPhone] = true;
        added++;
      }
      await env.DB.put("leads", JSON.stringify(existing));
      return jsonRes({ ok: true, imported: added, total: existing.length, duplicates: importBody.length - added });
    }
    if (method === "POST" && (path === "/api/lead" || path === "/api/leads")) {
      let body2;
      try {
        body2 = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      var raw = await env.DB.get("leads");
      var data = raw ? JSON.parse(raw) : [];
      var lead = { ...body2, id: String(Date.now()), createdAt: (/* @__PURE__ */ new Date()).toISOString(), fecha: (/* @__PURE__ */ new Date()).toISOString() };
      var scoring = computeLeadScore({
        presupuesto: lead.presupuesto,
        zona: lead.zona_interes || lead.zona,
        tipo: lead.tipo_propiedad || lead.tipo,
        email: lead.email,
        telefono: lead.telefono || lead.phone
      });
      lead.lead_score = scoring.score;
      lead.lead_tier = scoring.tier;
      lead.stage = "Nuevo";
      data.push(lead);
      await env.DB.put("leads", JSON.stringify(data));
      var token = env.META_CAPI_TOKEN || META_CAPI_TOKEN;
      if (token) {
        var userData = {
          client_user_agent: lead.user_agent || "",
          client_ip_address: request.headers.get("cf-connecting-ip") || "",
          fbc: lead.fbc || "",
          fbp: lead.fbp || "",
          external_id: [await hashSHA256(lead.id)],
          ct: [await hashSHA256("guatemala city")],
          st: [await hashSHA256("guatemala")],
          country: [await hashSHA256("gt")],
          zp: [await hashSHA256("01010")]
        };
        if (lead.email) {
          userData.em = [await hashSHA256(lead.email.toLowerCase().trim())];
        }
        if (lead.phone) {
          userData.ph = [await hashSHA256(lead.phone.replace(/[^0-9]/g, ""))];
        }
        if (lead.name || lead.nombre) {
          var nameVal = (lead.name || lead.nombre).toLowerCase().trim().split(" ")[0];
          userData.fn = [await hashSHA256(nameVal)];
        }
        var eventData = {
          data: [{
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1e3),
            event_source_url: lead.page_url || "",
            action_source: "website",
            user_data: userData,
            custom_data: {
              property_slug: lead.property_slug || "",
              property_name: lead.property_name || lead.propiedad || "",
              utm_source: lead.utm_source || "",
              utm_campaign: lead.utm_campaign || "",
              lead_type: "form"
            }
          }]
        };
        ctx.waitUntil(
          fetch("https://graph.facebook.com/v21.0/" + getPixelId(lead.page_url) + "/events?access_token=" + token, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData)
          }).catch(function() {
          })
        );
      }
      var NOTIFY_URL = env.NOTIFY_WEBHOOK || NOTIFY_WEBHOOK || "";
      if (NOTIFY_URL) {
        var notifyData = {
          nombre: lead.nombre || lead.name || "Sin nombre",
          telefono: lead.telefono || lead.phone || "",
          email: lead.email || "",
          propiedad: lead.propiedad || lead.property_name || "",
          presupuesto: lead.presupuesto || "",
          zona: lead.zona_interes || "",
          tipo: lead.tipo_propiedad || lead.tipo || "",
          fuente: lead.utm_source || lead.source || "Sitio web",
          fecha: lead.fecha,
          lead_score: lead.lead_score,
          lead_tier: lead.lead_tier,
          whatsapp_link: (function() {
            var ph = (lead.telefono || lead.phone || "").replace(/[^0-9]/g, "");
            return ph ? "https://wa.me/" + (ph.startsWith("502") ? ph : "502" + ph) : "";
          })()
        };
        ctx.waitUntil(
          fetch(NOTIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notifyData)
          }).catch(function() {
          })
        );
      }
      return jsonRes({ ok: true, id: lead.id });
    }
    if (method === "GET" && path === "/api/leads/webhook") {
      var params = new URL(request.url).searchParams;
      var mode = params.get("hub.mode");
      var token = params.get("hub.verify_token");
      var challenge = params.get("hub.challenge");
      if (mode === "subscribe" && token === "zona_innmueble_webhook_2026") {
        return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
      }
      return jsonRes({ error: "Verification failed" }, 403);
    }
    if (method === "POST" && path === "/api/leads/webhook") {
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ ok: true });
      }
      var graphToken = env.META_CAPI_TOKEN || META_CAPI_TOKEN;
      var entries = body.entry || [];
      for (var e = 0; e < entries.length; e++) {
        var changes = entries[e].changes || [];
        for (var ch = 0; ch < changes.length; ch++) {
          var val = changes[ch].value || {};
          var leadgenId = val.leadgen_id || "";
          var formId = val.form_id || "";
          var pageId = val.page_id || entries[e].id || "";
          var nombre = "";
          var email = "";
          var telefono = "";
          var formName = "";
          if (leadgenId && graphToken) {
            try {
              var graphRes = await fetch("https://graph.facebook.com/v21.0/" + leadgenId + "?access_token=" + graphToken);
              var graphData = await graphRes.json();
              if (graphData.field_data) {
                for (var f = 0; f < graphData.field_data.length; f++) {
                  var fd = graphData.field_data[f];
                  var fn = (fd.name || "").toLowerCase();
                  var fv = fd.values && fd.values[0] || "";
                  if (fn === "full_name" || fn === "nombre_completo" || fn === "nombre") nombre = fv;
                  else if (fn === "email" || fn === "correo") email = fv;
                  else if (fn === "phone_number" || fn === "telefono" || fn === "whatsapp") telefono = fv;
                }
              }
              formName = graphData.form_id || formId;
            } catch (graphErr) {
            }
          }
          var matchedProp = await findPropertyByName(env, formName);
          var mlScoring = matchedProp ? computeLeadScore({ presupuesto: matchedProp.precio, zona: matchedProp.zona, tipo: matchedProp.tipo, email, telefono }) : { score: 30, tier: "WARM" };
          var lead = {
            id: String(Date.now()) + "_" + Math.random().toString(36).slice(2, 6),
            nombre,
            email,
            telefono,
            propiedad: formName || formId,
            fuente: "Meta Lead Ad",
            leadgen_id: leadgenId,
            form_id: formId,
            page_id: pageId,
            fecha: (/* @__PURE__ */ new Date()).toISOString(),
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            stage: "Nuevo",
            fase: "NUEVO LEAD",
            lead_score: mlScoring.score,
            lead_tier: mlScoring.tier
          };
          var raw = await env.DB.get("leads");
          var data = raw ? JSON.parse(raw) : [];
          data.push(lead);
          await env.DB.put("leads", JSON.stringify(data));
          var NOTIFY_URL = env.NOTIFY_WEBHOOK || NOTIFY_WEBHOOK || "";
          if (NOTIFY_URL) {
            var phone = (lead.telefono || "").replace(/[^0-9]/g, "");
            var waLink = phone ? "https://wa.me/" + (phone.startsWith("502") ? phone : "502" + phone) : "";
            ctx.waitUntil(
              fetch(NOTIFY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  nombre: lead.nombre,
                  telefono: lead.telefono,
                  email: lead.email,
                  propiedad: "Meta Lead Ad Form",
                  fuente: "Meta Lead Ad",
                  fecha: lead.fecha,
                  lead_score: lead.lead_score,
                  lead_tier: lead.lead_tier,
                  whatsapp_link: waLink,
                  tipo: "instant_form"
                })
              }).catch(function() {
              })
            );
          }
        }
      }
      return jsonRes({ ok: true });
    }
    if (method === "GET" && path === "/api/whatsapp/webhook") {
      var waParams = new URL(request.url).searchParams;
      var waMode = waParams.get("hub.mode");
      var waTok = waParams.get("hub.verify_token");
      var waChallenge = waParams.get("hub.challenge");
      var waVerifyToken = env.WHATSAPP_VERIFY_TOKEN || "zona_innmueble_whatsapp_2026";
      if (waMode === "subscribe" && waTok === waVerifyToken) {
        return new Response(waChallenge, { status: 200, headers: { "Content-Type": "text/plain" } });
      }
      return jsonRes({ error: "Verification failed" }, 403);
    }
    if (method === "GET" && path === "/api/whatsapp/pause-status") {
      var psToken = new URL(request.url).searchParams.get("token");
      var psVerify = env.WHATSAPP_VERIFY_TOKEN || "zona_innmueble_whatsapp_2026";
      if (psToken !== psVerify) return jsonRes({ error: "no autorizado" }, 403);
      var psPhone = new URL(request.url).searchParams.get("phone");
      if (!psPhone) return jsonRes({ error: "falta ?phone=" }, 400);
      var psVal = await env.DB.get("wa_paused:" + psPhone);
      return jsonRes({ phone: psPhone, paused: !!psVal });
    }
    if (method === "GET" && path === "/api/whatsapp/debug-errors") {
      var errToken = new URL(request.url).searchParams.get("token");
      var errVerify = env.WHATSAPP_VERIFY_TOKEN || "zona_innmueble_whatsapp_2026";
      if (errToken !== errVerify) return jsonRes({ error: "no autorizado" }, 403);
      var errRaw = await env.DB.get("wa_debug_errors");
      var errList = errRaw ? JSON.parse(errRaw) : [];
      return jsonRes({ count: errList.length, errors: errList });
    }
    if (method === "GET" && path === "/api/whatsapp/unpause") {
      var upToken = new URL(request.url).searchParams.get("token");
      var upVerify = env.WHATSAPP_VERIFY_TOKEN || "zona_innmueble_whatsapp_2026";
      if (upToken !== upVerify) return jsonRes({ error: "no autorizado" }, 403);
      var upPhone = new URL(request.url).searchParams.get("phone");
      if (!upPhone) return jsonRes({ error: "falta ?phone=" }, 400);
      await env.DB.delete("wa_paused:" + upPhone);
      return jsonRes({ ok: true, phone: upPhone, paused: false });
    }
    if (method === "GET" && path === "/api/whatsapp/pause") {
      var pzToken = new URL(request.url).searchParams.get("token");
      var pzVerify = env.WHATSAPP_VERIFY_TOKEN || "zona_innmueble_whatsapp_2026";
      if (pzToken !== pzVerify) return jsonRes({ error: "no autorizado" }, 403);
      var pzPhone = new URL(request.url).searchParams.get("phone");
      if (!pzPhone) return jsonRes({ error: "falta ?phone=" }, 400);
      await markHumanTookOver(env, pzPhone);
      return jsonRes({ ok: true, phone: pzPhone, paused: true });
    }
    if (method === "GET" && path === "/api/whatsapp/backfill-followups") {
      var bfToken = new URL(request.url).searchParams.get("token");
      var bfVerify = env.WHATSAPP_VERIFY_TOKEN || "zona_innmueble_whatsapp_2026";
      if (bfToken !== bfVerify) return jsonRes({ error: "no autorizado" }, 403);
      var bfRaw = await env.DB.get("leads");
      var bfLeads = bfRaw ? JSON.parse(bfRaw) : [];
      var activados = [];
      var requierenOptIn = [];
      var bfChanged = false;
      for (var bi = 0; bi < bfLeads.length; bi++) {
        var bfLead = bfLeads[bi];
        if (WA_FOLLOWUP_STOP_STAGES.indexOf(bfLead.stage) >= 0) continue;
        if (typeof bfLead.followUpStage === "number" && bfLead.followUpStatus) continue;
        if (bfLead.wa_from) {
          var bfAnchor = bfLead.lastInboundAt || bfLead.fecha || bfLead.createdAt || (/* @__PURE__ */ new Date()).toISOString();
          bfLead.lastInboundAt = bfAnchor;
          bfLead.followUpStage = 0;
          bfLead.followUpStatus = "active";
          bfLead.nextFollowUpAt = new Date(new Date(bfAnchor).getTime() + WA_FOLLOWUP_INTERVALS_DAYS[0] * 864e5).toISOString();
          bfChanged = true;
          activados.push({ id: bfLead.id, nombre: bfLead.nombre, telefono: bfLead.telefono });
        } else if (bfLead.telefono) {
          requierenOptIn.push({ id: bfLead.id, nombre: bfLead.nombre, telefono: bfLead.telefono, fuente: bfLead.fuente || bfLead.source || "" });
        }
      }
      if (bfChanged) await env.DB.put("leads", JSON.stringify(bfLeads));
      return jsonRes({
        activados_count: activados.length,
        activados,
        requieren_opt_in_count: requierenOptIn.length,
        requieren_opt_in: requierenOptIn,
        nota: "Los 'requieren_opt_in' nunca han escrito por WhatsApp -- no se activaron automaticamente por riesgo de politica de Meta. Revisar manualmente antes de contactarlos por este canal."
      });
    }
    if (method === "GET" && path === "/api/whatsapp/test-template") {
      var ttToken = new URL(request.url).searchParams.get("token");
      var ttVerify = env.WHATSAPP_VERIFY_TOKEN || "zona_innmueble_whatsapp_2026";
      if (ttToken !== ttVerify) return jsonRes({ error: "no autorizado" }, 403);
      var ttPhone = new URL(request.url).searchParams.get("phone");
      if (!ttPhone) return jsonRes({ error: "falta ?phone=" }, 400);
      var ttNombre = new URL(request.url).searchParams.get("nombre") || "de nuevo";
      var ttWaToken = env.WHATSAPP_TOKEN;
      var ttPhoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID || "1276726378858448";
      if (!ttWaToken) return jsonRes({ error: "WHATSAPP_TOKEN no configurado" }, 500);
      var ttRes = await fetch("https://graph.facebook.com/v21.0/" + ttPhoneNumberId + "/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + ttWaToken },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: ttPhone,
          type: "template",
          template: {
            name: WA_FOLLOWUP_TEMPLATE_NAME,
            language: { code: WA_FOLLOWUP_TEMPLATE_LANG },
            components: [{ type: "body", parameters: [{ type: "text", text: ttNombre }] }]
          }
        })
      });
      var ttData = await ttRes.json().catch(function() { return null; });
      return jsonRes({ status: ttRes.status, meta_response: ttData });
    }
    if (method === "GET" && path === "/api/whatsapp/list-templates") {
      var ltToken = new URL(request.url).searchParams.get("token");
      var ltVerify = env.WHATSAPP_VERIFY_TOKEN || "zona_innmueble_whatsapp_2026";
      if (ltToken !== ltVerify) return jsonRes({ error: "no autorizado" }, 403);
      var ltWaToken = env.WHATSAPP_TOKEN;
      if (!ltWaToken) return jsonRes({ error: "WHATSAPP_TOKEN no configurado" }, 500);
      var ltWabaId = env.WHATSAPP_WABA_ID || "1700973914498013";
      var ltRes = await fetch("https://graph.facebook.com/v21.0/" + ltWabaId + "/message_templates?fields=name,language,status,category,components&limit=100", {
        headers: { "Authorization": "Bearer " + ltWaToken }
      });
      var ltData = await ltRes.json().catch(function() { return null; });
      return jsonRes({ status: ltRes.status, waba_id: ltWabaId, meta_response: ltData });
    }
    if (method === "POST" && path === "/api/whatsapp/webhook") {
      var waBody;
      var waRawText = await request.text();
      try {
        waBody = JSON.parse(waRawText);
      } catch {
        return jsonRes({ ok: true });
      }
      ctx.waitUntil(handleWhatsAppMessage(waBody, env));
      return jsonRes({ ok: true });
    }
    if (method === "POST" && path === "/api/leads/sync-meta") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        body = {};
      }
      var pageToken = body.page_token || env.META_PAGE_TOKEN || META_PAGE_TOKEN || "";
      if (!pageToken) return jsonRes({ error: "Se requiere page_token" }, 400);
      var pageId = env.META_PAGE_ID || META_PAGE_ID;
      var formsRes = await fetch("https://graph.facebook.com/v21.0/" + pageId + "/leadgen_forms?access_token=" + pageToken);
      var formsData = await formsRes.json();
      if (formsData.error) return jsonRes({ error: "Error Graph API: " + formsData.error.message }, 400);
      var forms = formsData.data || [];
      var propRawSM = await env.DB.get("propiedades");
      var propListSM = propRawSM ? JSON.parse(propRawSM) : [];
      var raw = await env.DB.get("leads");
      var existingLeads = raw ? JSON.parse(raw) : [];
      var existingIds = {};
      for (var i = 0; i < existingLeads.length; i++) {
        if (existingLeads[i].leadgen_id) existingIds[existingLeads[i].leadgen_id] = true;
      }
      var newCount = 0;
      for (var fi = 0; fi < forms.length; fi++) {
        var formId = forms[fi].id;
        var formName = forms[fi].name || formId;
        var leadsRes = await fetch("https://graph.facebook.com/v21.0/" + formId + "/leads?access_token=" + pageToken);
        var leadsData = await leadsRes.json();
        if (leadsData.error) continue;
        var metaLeads = leadsData.data || [];
        for (var li = 0; li < metaLeads.length; li++) {
          var ml = metaLeads[li];
          if (existingIds[ml.id]) continue;
          var nombre = "";
          var email = "";
          var telefono = "";
          var fieldData = ml.field_data || [];
          for (var fd = 0; fd < fieldData.length; fd++) {
            var fn = (fieldData[fd].name || "").toLowerCase();
            var fv = fieldData[fd].values && fieldData[fd].values[0] || "";
            if (fn === "full_name" || fn === "nombre_completo" || fn === "nombre") nombre = fv;
            else if (fn === "email" || fn === "correo" || fn === "correo_electr\xF3nico") email = fv;
            else if (fn === "phone_number" || fn === "telefono" || fn === "n\xFAmero_de_tel\xE9fono" || fn === "whatsapp") telefono = fv;
          }
          var matchedPropSM = matchPropByNameIn(propListSM, formName);
          var smScoring = matchedPropSM ? computeLeadScore({ presupuesto: matchedPropSM.precio, zona: matchedPropSM.zona, tipo: matchedPropSM.tipo, email, telefono }) : { score: 30, tier: "WARM" };
          var lead = {
            id: String(Date.now()) + "_" + Math.random().toString(36).slice(2, 6),
            nombre,
            email,
            telefono,
            propiedad: formName,
            fuente: "Meta Lead Ad",
            leadgen_id: ml.id,
            form_id: formId,
            page_id: pageId,
            fecha: ml.created_time || (/* @__PURE__ */ new Date()).toISOString(),
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            stage: "Nuevo",
            fase: "NUEVO LEAD",
            lead_score: smScoring.score,
            lead_tier: smScoring.tier
          };
          existingLeads.push(lead);
          existingIds[ml.id] = true;
          newCount++;
        }
      }
      if (newCount > 0) {
        await env.DB.put("leads", JSON.stringify(existingLeads));
      }
      return jsonRes({ ok: true, new_leads: newCount, total_forms: forms.length });
    }
    if (method === "PUT" && path === "/api/leads/update") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      var raw = await env.DB.get("leads");
      var data = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < data.length; i++) {
        if ((data[i].id || data[i]._id || data[i].fecha) == body.id) {
          if (body.stage) data[i].stage = body.stage;
          if (body.followup_date) data[i].followup_date = body.followup_date;
          if (body.contacted_at) data[i].contacted_at = body.contacted_at;
          found = true;
          break;
        }
      }
      if (found) await env.DB.put("leads", JSON.stringify(data));
      return jsonRes({ ok: found });
    }
    if (method === "POST" && path === "/api/leads/note") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      var raw = await env.DB.get("leads");
      var data = raw ? JSON.parse(raw) : [];
      for (var i = 0; i < data.length; i++) {
        if ((data[i].id || data[i]._id || data[i].fecha) == body.id) {
          if (!data[i].notes_history) data[i].notes_history = [];
          data[i].notes_history.push({ text: body.text, date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), author: "Admin" });
          break;
        }
      }
      await env.DB.put("leads", JSON.stringify(data));
      return jsonRes({ ok: true });
    }
    if (method === "DELETE" && path === "/api/leads/delete") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.id) return jsonRes({ error: "ID requerido" }, 400);
      var raw = await env.DB.get("leads");
      var data = raw ? JSON.parse(raw) : [];
      var before = data.length;
      data = data.filter(function(l) {
        return (l.id || l._id || l.fecha) != body.id;
      });
      if (data.length < before) {
        await env.DB.put("leads", JSON.stringify(data));
        return jsonRes({ ok: true, deleted: true });
      }
      return jsonRes({ error: "Lead no encontrado" }, 404);
    }
    if (method === "GET" && path === "/api/public/brokers") {
      var raw = await env.DB.get("brokers");
      var data = raw ? JSON.parse(raw) : [];
      var approved = data.filter(function(b2) {
        return b2.activo !== false && b2.estado === "aprobado";
      });
      var pub = await Promise.all(approved.map(async function(b2) {
        var o = Object.assign({}, b2);
        delete o.telefono;
        delete o.whatsapp_raw;
        delete o.email;
        delete o.password_hash;
        delete o.whatsapp;
        delete o.response_time;
        o.responseSignal = await computeResponseSignal(b2.id, env);
        return o;
      }));
      return new Response(JSON.stringify(pub), {
        headers: { "Content-Type": "application/json", "Cache-Control": "no-cache", ...cors(request) }
      });
    }
    if (method === "GET" && path === "/api/brokers") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var raw = await env.DB.get("brokers");
      var data = raw ? JSON.parse(raw) : [];
      return jsonRes(data);
    }
    if (method === "POST" && path === "/api/brokers") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.nombre) return jsonRes({ error: "Nombre requerido" }, 400);
      var raw = await env.DB.get("brokers");
      var data = raw ? JSON.parse(raw) : [];
      var slug = (body.nombre || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      var existing = data.find(function(b2) {
        return b2.slug === slug;
      });
      if (existing) slug = slug + "-" + Date.now().toString(36);
      var broker = {
        id: "bk_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        slug,
        nombre: body.nombre,
        titulo: body.titulo || "Asesor Inmobiliario",
        bio: body.bio || "",
        foto: body.foto || "",
        telefono: body.telefono || "",
        whatsapp: body.whatsapp || "",
        whatsapp_raw: body.whatsapp || "",
        email: body.email || "",
        zonas: body.zonas || [],
        especialidad: body.especialidad || [],
        verificado: body.verificado || false,
        destacado: body.destacado || false,
        activo: true,
        propiedades_count: 0,
        rating: body.rating || 0,
        reviews_count: 0,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      data.push(broker);
      await env.DB.put("brokers", JSON.stringify(data));
      return jsonRes({ ok: true, broker });
    }
    if (method === "PUT" && path === "/api/brokers") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.id) return jsonRes({ error: "ID requerido" }, 400);
      var raw = await env.DB.get("brokers");
      var data = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === body.id) {
          var fields = ["nombre", "titulo", "bio", "foto", "telefono", "whatsapp", "whatsapp_raw", "email", "zonas", "especialidad", "verificado", "destacado", "activo", "rating", "response_time", "estado", "plan"];
          fields.forEach(function(f2) {
            if (body[f2] !== void 0) data[i][f2] = body[f2];
          });
          found = true;
          break;
        }
      }
      if (found) await env.DB.put("brokers", JSON.stringify(data));
      return jsonRes({ ok: found });
    }
    if (method === "DELETE" && path === "/api/brokers") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.id) return jsonRes({ error: "ID requerido" }, 400);
      var raw = await env.DB.get("brokers");
      var data = raw ? JSON.parse(raw) : [];
      var before = data.length;
      data = data.filter(function(b2) {
        return b2.id !== body.id;
      });
      if (data.length < before) {
        await env.DB.put("brokers", JSON.stringify(data));
        return jsonRes({ ok: true, deleted: true });
      }
      return jsonRes({ error: "Broker no encontrado" }, 404);
    }
    if (method === "GET" && path === "/api/meta-ads-stats") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var cached = await env.DB.get("meta_ads_stats");
      if (cached) return jsonRes(JSON.parse(cached));
      return jsonRes({ error: "Sin datos. Actualiza desde Cowork." }, 404);
    }
    if (method === "POST" && path === "/api/meta-ads-stats") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      await env.DB.put("meta_ads_stats", JSON.stringify(body));
      return jsonRes({ ok: true });
    }
    if (method === "POST" && path === "/api/rebuild") {
      const authed2 = await requireAuth(request, env);
      if (!authed2) return jsonRes({ error: "No autenticado" }, 401);
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true });
    }
    if (method === "POST" && path === "/api/pageview") {
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ ok: true });
      }
      var token = env.META_CAPI_TOKEN || META_CAPI_TOKEN;
      if (token) {
        var pvUserData = {
          client_user_agent: body.user_agent || request.headers.get("user-agent") || "",
          client_ip_address: request.headers.get("cf-connecting-ip") || "",
          fbc: body.fbc || "",
          fbp: body.fbp || "",
          ct: [await hashSHA256("guatemala city")],
          st: [await hashSHA256("guatemala")],
          country: [await hashSHA256("gt")],
          zp: [await hashSHA256("01010")]
        };
        if (body.external_id) {
          pvUserData.external_id = [await hashSHA256(body.external_id)];
        }
        var pvEvent = {
          data: [{
            event_name: body.event_name || "PageView",
            event_time: Math.floor(Date.now() / 1e3),
            event_source_url: body.page_url || "",
            action_source: "website",
            user_data: pvUserData,
            custom_data: body.custom_data || {}
          }]
        };
        ctx.waitUntil(
          fetch("https://graph.facebook.com/v21.0/" + getPixelId(body.page_url) + "/events?access_token=" + token, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pvEvent)
          }).catch(function() {
          })
        );
      }
      return jsonRes({ ok: true });
    }
    if (method === "POST" && path === "/api/broker/register") {
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.nombre || !body.email || !body.password) {
        return jsonRes({ error: "Nombre, email y contrase\xF1a son requeridos" }, 400);
      }
      if (body.password.length < 6) {
        return jsonRes({ error: "La contrase\xF1a debe tener al menos 6 caracteres" }, 400);
      }
      var raw = await env.DB.get("brokers");
      var data = raw ? JSON.parse(raw) : [];
      var emailExists = data.find(function(b2) {
        return b2.email && b2.email.toLowerCase() === body.email.toLowerCase();
      });
      if (emailExists) return jsonRes({ error: "Ya existe una cuenta con este email" }, 409);
      var slug = (body.nombre || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      var existingSlug = data.find(function(b2) {
        return b2.slug === slug;
      });
      if (existingSlug) slug = slug + "-" + Date.now().toString(36);
      var passwordHash = await hashSHA256(body.password + ":broker_salt_zi");
      var broker = {
        id: "bk_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        slug,
        nombre: body.nombre,
        titulo: body.titulo || "Asesor Inmobiliario",
        bio: body.bio || "",
        foto: body.foto || "",
        telefono: body.telefono || "",
        whatsapp: body.whatsapp || "",
        whatsapp_raw: body.whatsapp || "",
        email: body.email.toLowerCase(),
        zonas: body.zonas || [],
        especialidad: body.especialidad || [],
        verificado: false,
        destacado: false,
        activo: false,
        estado: "pendiente",
        plan: "free",
        password_hash: passwordHash,
        propiedades_count: 0,
        rating: 0,
        reviews_count: 0,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      data.push(broker);
      await env.DB.put("brokers", JSON.stringify(data));
      return jsonRes({ ok: true, message: "Registro exitoso. Tu cuenta est\xE1 pendiente de aprobaci\xF3n." });
    }
    if (method === "POST" && path === "/api/broker/login") {
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.email || !body.password) return jsonRes({ error: "Email y contrase\xF1a requeridos" }, 400);
      var raw = await env.DB.get("brokers");
      var data = raw ? JSON.parse(raw) : [];
      var broker = data.find(function(b2) {
        return b2.email && b2.email.toLowerCase() === body.email.toLowerCase();
      });
      if (!broker || !broker.password_hash) return jsonRes({ error: "Credenciales inv\xE1lidas" }, 401);
      var hash = await hashSHA256(body.password + ":broker_salt_zi");
      if (hash !== broker.password_hash) return jsonRes({ error: "Credenciales inv\xE1lidas" }, 401);
      if (broker.estado === "pendiente") return jsonRes({ error: "Tu cuenta est\xE1 pendiente de aprobaci\xF3n" }, 403);
      if (broker.estado === "rechazado") return jsonRes({ error: "Tu cuenta ha sido rechazada" }, 403);
      if (broker.activo === false && broker.estado !== "aprobado") return jsonRes({ error: "Tu cuenta no est\xE1 activa" }, 403);
      try {
        var loginsRaw = await env.DB.get("broker_logins:" + broker.id);
        var logins = loginsRaw ? JSON.parse(loginsRaw) : [];
        logins.push((/* @__PURE__ */ new Date()).toISOString());
        if (logins.length > 50) logins = logins.slice(-50);
        await env.DB.put("broker_logins:" + broker.id, JSON.stringify(logins));
      } catch (e2) {
      }
      var token = generateToken();
      await env.DB.put("broker_session:" + token, broker.id, { expirationTtl: SESSION_TTL });
      return jsonRes({ ok: true, token, broker: { id: broker.id, nombre: broker.nombre, plan: broker.plan, estado: broker.estado } });
    }
    if (method === "POST" && path === "/api/broker/logout") {
      var authHeader = request.headers.get("Authorization") || "";
      var bToken = authHeader.replace("Bearer ", "");
      if (bToken) await env.DB.delete("broker_session:" + bToken);
      return jsonRes({ ok: true });
    }
    async function requireBrokerAuth(request2, env2) {
      var authHeader2 = request2.headers.get("Authorization") || "";
      var token2 = authHeader2.replace("Bearer ", "");
      if (!token2) return null;
      var brokerId2 = await env2.DB.get("broker_session:" + token2);
      if (!brokerId2) return null;
      var raw2 = await env2.DB.get("brokers");
      var data2 = raw2 ? JSON.parse(raw2) : [];
      return data2.find(function(b2) {
        return b2.id === brokerId2;
      }) || null;
    }
    __name(requireBrokerAuth, "requireBrokerAuth");
    __name2(requireBrokerAuth, "requireBrokerAuth");
    __name22(requireBrokerAuth, "requireBrokerAuth");
    async function computeResponseSignal(brokerId2, env2) {
      try {
        var leadsRaw2 = await env2.DB.get("leads");
        var leads2 = leadsRaw2 ? JSON.parse(leadsRaw2) : [];
        var myLeads = leads2.filter(function(l) {
          return l.assigned_broker === brokerId2;
        });
        var loginsRaw2 = await env2.DB.get("broker_logins:" + brokerId2);
        var logins2 = (loginsRaw2 ? JSON.parse(loginsRaw2) : []).map(function(t) {
          return new Date(t).getTime();
        }).sort(function(a, b2) {
          return a - b2;
        });
        if (!myLeads.length || !logins2.length) return null;
        var cutoff = Date.now() - 30 * 24 * 60 * 60 * 1e3;
        var gaps = [];
        myLeads.forEach(function(l) {
          var assignedAt = new Date(l.assigned_at || l.createdAt || l.fecha).getTime();
          if (!assignedAt || assignedAt < cutoff) return;
          var nextLogin = logins2.find(function(t) {
            return t >= assignedAt;
          });
          if (nextLogin) gaps.push((nextLogin - assignedAt) / (1e3 * 60 * 60));
        });
        if (gaps.length < 3) return null;
        var avgHours = gaps.reduce(function(a, b2) {
          return a + b2;
        }, 0) / gaps.length;
        var label;
        if (avgHours < 1) label = "Activo en menos de 1 hora";
        else if (avgHours < 4) label = "Activo en pocas horas";
        else if (avgHours < 24) label = "Activo el mismo dia";
        else label = "Activo en 1-2 dias";
        return { label, avgHours: Math.round(avgHours * 10) / 10, sampleSize: gaps.length };
      } catch (e2) {
        return null;
      }
    }
    __name(computeResponseSignal, "computeResponseSignal");
    __name2(computeResponseSignal, "computeResponseSignal");
    __name22(computeResponseSignal, "computeResponseSignal");
    if (method === "GET" && path === "/api/broker/me") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var planLimits = { free: 2, basico: 8, pro: 25, premium: 999 };
      var raw = await env.DB.get("propiedades");
      var allProps = raw ? JSON.parse(raw) : [];
      var myProps = allProps.filter(function(p) {
        return p.broker_id === broker.id;
      });
      var stats = await env.DB.get("broker_stats:" + broker.id);
      var statsData = stats ? JSON.parse(stats) : { views: 0, wa_clicks: 0 };
      return jsonRes({
        id: broker.id,
        slug: broker.slug,
        nombre: broker.nombre,
        titulo: broker.titulo,
        bio: broker.bio,
        foto: broker.foto,
        email: broker.email,
        telefono: broker.telefono,
        whatsapp: broker.whatsapp,
        zonas: broker.zonas,
        especialidad: broker.especialidad,
        verificado: broker.verificado,
        destacado: broker.destacado,
        plan: broker.plan || "free",
        estado: broker.estado || "aprobado",
        propiedades_count: myProps.length,
        propiedades_limit: planLimits[broker.plan || "free"] || 2,
        stats: statsData,
        created_at: broker.created_at
      });
    }
    if (method === "PUT" && path === "/api/broker/me") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      var raw = await env.DB.get("brokers");
      var data = raw ? JSON.parse(raw) : [];
      var allowedFields = ["nombre", "titulo", "bio", "foto", "telefono", "whatsapp", "zonas", "especialidad", "response_time"];
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === broker.id) {
          allowedFields.forEach(function(f2) {
            if (body[f2] !== void 0) data[i][f2] = body[f2];
          });
          if (body.whatsapp) data[i].whatsapp_raw = body.whatsapp;
          break;
        }
      }
      await env.DB.put("brokers", JSON.stringify(data));
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true });
    }
    if (method === "GET" && path === "/api/broker/propiedades") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var raw = await env.DB.get("propiedades");
      var allProps = raw ? JSON.parse(raw) : [];
      var myProps = allProps.filter(function(p) {
        return p.broker_id === broker.id;
      });
      return jsonRes(myProps);
    }
    if (method === "POST" && path === "/api/broker/propiedades") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var planLimits = { free: 2, basico: 8, pro: 25, premium: 999 };
      var limit = planLimits[broker.plan || "free"] || 2;
      var raw = await env.DB.get("propiedades");
      var allProps = raw ? JSON.parse(raw) : [];
      var myCount = allProps.filter(function(p) {
        return p.broker_id === broker.id;
      }).length;
      if (myCount >= limit) {
        return jsonRes({ error: "Has alcanzado el l\xEDmite de propiedades de tu plan (" + limit + "). Actualiza tu plan para publicar m\xE1s." }, 403);
      }
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.titulo) return jsonRes({ error: "T\xEDtulo requerido" }, 400);
      var slug = (body.titulo || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      var existingSlug = allProps.find(function(p) {
        return p.slug === slug;
      });
      if (existingSlug) slug = slug + "-" + Date.now().toString(36);
      var prop = Object.assign({}, body, {
        id: slug,
        slug,
        broker_id: broker.id,
        estado: "Activa",
        sitios: ["inmu"],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      allProps.push(prop);
      await env.DB.put("propiedades", JSON.stringify(allProps));
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true, propiedad: prop });
    }
    if (method === "PUT" && path === "/api/broker/propiedades") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.id) return jsonRes({ error: "ID requerido" }, 400);
      var raw = await env.DB.get("propiedades");
      var allProps = raw ? JSON.parse(raw) : [];
      var idx = allProps.findIndex(function(p) {
        return (p.id || p.slug) === body.id && p.broker_id === broker.id;
      });
      if (idx === -1) return jsonRes({ error: "Propiedad no encontrada o no te pertenece" }, 404);
      var id = body.id;
      delete body.id;
      delete body.broker_id;
      allProps[idx] = Object.assign({}, allProps[idx], body, { id, broker_id: broker.id });
      await env.DB.put("propiedades", JSON.stringify(allProps));
      ctx.waitUntil(triggerRebuild());
      return jsonRes({ ok: true });
    }
    if (method === "DELETE" && path === "/api/broker/propiedades") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.id) return jsonRes({ error: "ID requerido" }, 400);
      var raw = await env.DB.get("propiedades");
      var allProps = raw ? JSON.parse(raw) : [];
      var before = allProps.length;
      allProps = allProps.filter(function(p) {
        return !((p.id || p.slug) === body.id && p.broker_id === broker.id);
      });
      if (allProps.length < before) {
        await env.DB.put("propiedades", JSON.stringify(allProps));
        ctx.waitUntil(triggerRebuild());
        return jsonRes({ ok: true });
      }
      return jsonRes({ error: "Propiedad no encontrada o no te pertenece" }, 404);
    }
    if (method === "POST" && path.startsWith("/api/broker/view/")) {
      var slug = path.split("/api/broker/view/")[1];
      if (slug) {
        var statsKey = "broker_stats_by_slug:" + slug;
        var raw = await env.DB.get("brokers");
        var data = raw ? JSON.parse(raw) : [];
        var b = data.find(function(x) {
          return x.slug === slug;
        });
        if (b) {
          var sRaw = await env.DB.get("broker_stats:" + b.id);
          var s = sRaw ? JSON.parse(sRaw) : { views: 0, wa_clicks: 0 };
          s.views = (s.views || 0) + 1;
          await env.DB.put("broker_stats:" + b.id, JSON.stringify(s));
        }
      }
      return jsonRes({ ok: true });
    }
    if (method === "POST" && path.startsWith("/api/broker/wa-click/")) {
      var slug = path.split("/api/broker/wa-click/")[1];
      if (slug) {
        var raw = await env.DB.get("brokers");
        var data = raw ? JSON.parse(raw) : [];
        var b = data.find(function(x) {
          return x.slug === slug;
        });
        if (b) {
          var sRaw = await env.DB.get("broker_stats:" + b.id);
          var s = sRaw ? JSON.parse(sRaw) : { views: 0, wa_clicks: 0 };
          s.wa_clicks = (s.wa_clicks || 0) + 1;
          await env.DB.put("broker_stats:" + b.id, JSON.stringify(s));
        }
      }
      return jsonRes({ ok: true });
    }
    if (method === "PUT" && path === "/api/brokers/approve") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.id || !body.estado) return jsonRes({ error: "ID y estado requeridos" }, 400);
      if (["aprobado", "rechazado", "pendiente"].indexOf(body.estado) === -1) return jsonRes({ error: "Estado inv\xE1lido" }, 400);
      var raw = await env.DB.get("brokers");
      var data = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === body.id) {
          data[i].estado = body.estado;
          data[i].activo = body.estado === "aprobado";
          if (body.plan) data[i].plan = body.plan;
          found = true;
          break;
        }
      }
      if (found) {
        await env.DB.put("brokers", JSON.stringify(data));
        ctx.waitUntil(triggerRebuild());
      }
      return jsonRes({ ok: found });
    }
    if (method === "PUT" && path === "/api/brokers/plan") {
      var authed = await requireAuth(request, env);
      if (!authed) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.id || !body.plan) return jsonRes({ error: "ID y plan requeridos" }, 400);
      if (["free", "basico", "pro", "premium"].indexOf(body.plan) === -1) return jsonRes({ error: "Plan inv\xE1lido" }, 400);
      var raw = await env.DB.get("brokers");
      var data = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === body.id) {
          data[i].plan = body.plan;
          if (body.plan === "pro" || body.plan === "premium") data[i].verificado = true;
          if (body.plan === "premium") data[i].destacado = true;
          found = true;
          break;
        }
      }
      if (found) await env.DB.put("brokers", JSON.stringify(data));
      return jsonRes({ ok: found });
    }
    if (method === "POST" && path === "/api/messages") {
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.broker_id || !body.nombre || !body.email || !body.mensaje) {
        return jsonRes({ error: "broker_id, nombre, email y mensaje son requeridos" }, 400);
      }
      var msg = {
        id: crypto.randomUUID(),
        broker_id: body.broker_id,
        propiedad_id: body.propiedad_id || null,
        propiedad_titulo: body.propiedad_titulo || null,
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono || "",
        mensaje: body.mensaje,
        leido: false,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      var raw = await env.DB.get("messages:" + body.broker_id);
      var msgs = raw ? JSON.parse(raw) : [];
      msgs.unshift(msg);
      if (msgs.length > 500) msgs = msgs.slice(0, 500);
      await env.DB.put("messages:" + body.broker_id, JSON.stringify(msgs));
      var unread = msgs.filter(function(m) {
        return !m.leido;
      }).length;
      await env.DB.put("messages_unread:" + body.broker_id, String(unread));
      var brokersRaw = await env.DB.get("brokers");
      var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
      var broker = brokers.find(function(b2) {
        return b2.id === body.broker_id;
      });
      if (broker && NOTIFY_WEBHOOK) {
        ctx.waitUntil(fetch(NOTIFY_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "broker_message",
            broker_name: broker.nombre,
            broker_phone: broker.whatsapp_raw || "",
            broker_email: broker.email || "",
            broker_id: broker.id,
            sender_name: body.nombre,
            sender_email: body.email,
            sender_phone: body.telefono || "",
            property: body.propiedad_titulo || "Consulta general",
            property_id: body.propiedad_id || "",
            message: body.mensaje.substring(0, 500),
            unread_count: unread
          })
        }).catch(function() {
        }));
      }
      return jsonRes({ ok: true, id: msg.id });
    }
    if (method === "GET" && path === "/api/broker/messages") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var raw = await env.DB.get("messages:" + broker.id);
      var msgs = raw ? JSON.parse(raw) : [];
      var unread = msgs.filter(function(m) {
        return !m.leido;
      }).length;
      return jsonRes({ messages: msgs, unread });
    }
    if (method === "PUT" && path === "/api/broker/messages/read") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.id) return jsonRes({ error: "ID requerido" }, 400);
      var raw = await env.DB.get("messages:" + broker.id);
      var msgs = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < msgs.length; i++) {
        if (msgs[i].id === body.id) {
          msgs[i].leido = true;
          found = true;
          break;
        }
      }
      if (found) {
        await env.DB.put("messages:" + broker.id, JSON.stringify(msgs));
        var unread = msgs.filter(function(m) {
          return !m.leido;
        }).length;
        await env.DB.put("messages_unread:" + broker.id, String(unread));
      }
      return jsonRes({ ok: found });
    }
    if (method === "PUT" && path === "/api/broker/messages/read-all") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var raw = await env.DB.get("messages:" + broker.id);
      var msgs = raw ? JSON.parse(raw) : [];
      for (var i = 0; i < msgs.length; i++) {
        msgs[i].leido = true;
      }
      await env.DB.put("messages:" + broker.id, JSON.stringify(msgs));
      await env.DB.put("messages_unread:" + broker.id, "0");
      return jsonRes({ ok: true });
    }
    if (method === "DELETE" && path === "/api/broker/messages") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.id) return jsonRes({ error: "ID requerido" }, 400);
      var raw = await env.DB.get("messages:" + broker.id);
      var msgs = raw ? JSON.parse(raw) : [];
      msgs = msgs.filter(function(m) {
        return m.id !== body.id;
      });
      await env.DB.put("messages:" + broker.id, JSON.stringify(msgs));
      var unread = msgs.filter(function(m) {
        return !m.leido;
      }).length;
      await env.DB.put("messages_unread:" + broker.id, String(unread));
      return jsonRes({ ok: true });
    }
    if (method === "GET" && path === "/api/public/propiedades/search") {
      var raw = await env.DB.get("propiedades");
      var data = raw ? JSON.parse(raw) : [];
      var results = data.filter(function(p) {
        return p.estado !== "Pausada" && p.estado !== "Eliminada";
      });
      var searchUrl = new URL(request.url);
      var tipo = searchUrl.searchParams.get("tipo");
      var zona = searchUrl.searchParams.get("zona");
      var precioMin = searchUrl.searchParams.get("precio_min");
      var precioMax = searchUrl.searchParams.get("precio_max");
      var habMin = searchUrl.searchParams.get("habitaciones_min");
      var banosMin = searchUrl.searchParams.get("banos_min");
      var areaMin = searchUrl.searchParams.get("area_min");
      var areaMax = searchUrl.searchParams.get("area_max");
      var q = searchUrl.searchParams.get("q");
      var broker_id = searchUrl.searchParams.get("broker_id");
      var sort = searchUrl.searchParams.get("sort") || "newest";
      if (tipo) results = results.filter(function(p) {
        return (p.tipo || "").toLowerCase() === tipo.toLowerCase();
      });
      if (zona) results = results.filter(function(p) {
        return (p.zona || p.ubicacion || "").toLowerCase().indexOf(zona.toLowerCase()) !== -1;
      });
      if (precioMin) results = results.filter(function(p) {
        return parseFloat(p.precio) >= parseFloat(precioMin);
      });
      if (precioMax) results = results.filter(function(p) {
        return parseFloat(p.precio) <= parseFloat(precioMax);
      });
      if (habMin) results = results.filter(function(p) {
        return parseInt(p.habitaciones) >= parseInt(habMin);
      });
      if (banosMin) results = results.filter(function(p) {
        return parseInt(p.banos) >= parseInt(banosMin);
      });
      if (areaMin) results = results.filter(function(p) {
        return parseFloat(p.area) >= parseFloat(areaMin);
      });
      if (areaMax) results = results.filter(function(p) {
        return parseFloat(p.area) <= parseFloat(areaMax);
      });
      if (broker_id) results = results.filter(function(p) {
        return p.broker_id === broker_id;
      });
      if (q) {
        var terms = q.toLowerCase().split(/\s+/);
        results = results.filter(function(p) {
          var text = [p.titulo, p.descripcion, p.ubicacion, p.zona, p.tipo, p.municipio].join(" ").toLowerCase();
          return terms.every(function(t) {
            return text.indexOf(t) !== -1;
          });
        });
      }
      results = results.map(function(p) {
        var out = Object.assign({}, p);
        if (p.privConfig) {
          if (p.privConfig.precio) delete out.precio;
          if (p.privConfig.direccion) {
            delete out.ubicacion;
            delete out.municipio;
          }
          if (p.privConfig.galeria) {
            delete out.gallery;
            delete out.galeria;
          }
          if (p.privConfig.datos) {
            delete out.habitaciones;
            delete out.banos;
            delete out.area;
          }
          if (p.privConfig.descripcion) delete out.descripcion;
        }
        return out;
      });
      if (sort === "price_asc") results.sort(function(a, b2) {
        return (parseFloat(a.precio) || 0) - (parseFloat(b2.precio) || 0);
      });
      else if (sort === "price_desc") results.sort(function(a, b2) {
        return (parseFloat(b2.precio) || 0) - (parseFloat(a.precio) || 0);
      });
      else if (sort === "area_desc") results.sort(function(a, b2) {
        return (parseFloat(b2.area) || 0) - (parseFloat(a.area) || 0);
      });
      else results.sort(function(a, b2) {
        return new Date(b2.created_at || 0) - new Date(a.created_at || 0);
      });
      return new Response(JSON.stringify({ total: results.length, results }), {
        headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=30", ...cors(request) }
      });
    }
    if (method === "POST" && path === "/api/leads/route") {
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.lead_id) return jsonRes({ error: "lead_id requerido" }, 400);
      var leadsRaw = await env.DB.get("leads");
      var leads = leadsRaw ? JSON.parse(leadsRaw) : [];
      var lead = leads.find(function(l) {
        return l.id === body.lead_id;
      });
      if (!lead) return jsonRes({ error: "Lead no encontrado" }, 404);
      var brokersRaw = await env.DB.get("brokers");
      var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
      var aprobados = brokers.filter(function(b2) {
        return b2.estado === "aprobado";
      });
      var zona = (lead.zona || lead.propiedad || "").toLowerCase();
      var matched = aprobados.filter(function(b2) {
        if (!b2.zonas || !b2.zonas.length) return false;
        return b2.zonas.some(function(z) {
          return zona.indexOf(z.toLowerCase()) !== -1;
        });
      });
      if (!matched.length && lead.tipo) {
        var tipo = lead.tipo.toLowerCase();
        matched = aprobados.filter(function(b2) {
          return (b2.especialidad || []).some(function(e2) {
            return e2.toLowerCase().indexOf(tipo) !== -1;
          });
        });
      }
      if (!matched.length) {
        matched = aprobados.filter(function(b2) {
          return b2.plan === "premium" || b2.plan === "pro";
        });
      }
      if (matched.length) {
        var best = matched[0];
        var minCount = 999999;
        for (var i = 0; i < matched.length; i++) {
          var count = leads.filter(function(l) {
            return l.assigned_broker === matched[i].id;
          }).length;
          if (count < minCount) {
            minCount = count;
            best = matched[i];
          }
        }
        for (var j = 0; j < leads.length; j++) {
          if (leads[j].id === body.lead_id) {
            leads[j].assigned_broker = best.id;
            leads[j].assigned_broker_name = best.nombre;
            leads[j].assigned_at = (/* @__PURE__ */ new Date()).toISOString();
            break;
          }
        }
        await env.DB.put("leads", JSON.stringify(leads));
        return jsonRes({ ok: true, assigned_to: best.nombre, broker_id: best.id });
      }
      return jsonRes({ ok: false, message: "No hay asesores disponibles para esta zona" });
    }
    if (method === "GET" && path === "/api/broker/messages/unread-count") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var count = await env.DB.get("messages_unread:" + broker.id);
      return jsonRes({ unread: parseInt(count || "0") });
    }
    if (method === "GET" && path === "/api/cron/followups") {
      var authH = request.headers.get("Authorization") || "";
      if (authH !== "Bearer " + (env.CRON_SECRET || "cron-secret-2026")) return jsonRes({ error: "Unauthorized" }, 401);
      var leads = JSON.parse(await env.DB.get("leads") || "[]");
      var now = Date.now();
      var oneDay = 864e5;
      var twoDays = oneDay * 2;
      var sevenDays = oneDay * 7;
      var actions = [];
      for (var i = 0; i < leads.length; i++) {
        var ld = leads[i];
        if (ld.etapa === "cerrado" || ld.etapa === "perdido") continue;
        var created = new Date(ld.fecha || ld.created_at || 0).getTime();
        var lastContact = ld.last_contact ? new Date(ld.last_contact).getTime() : created;
        var age = now - created;
        var sinceContact = now - lastContact;
        var score = ld.score || 0;
        if (score >= 70 && sinceContact > oneDay && !ld.followup_sent_hot) {
          actions.push({ lead_id: ld.id, type: "hot_lead_reminder", nombre: ld.nombre, score, hours_since: Math.round(sinceContact / 36e5) });
          leads[i].followup_sent_hot = true;
        } else if (ld.etapa === "nuevo" && age > twoDays && !ld.followup_sent_48h) {
          actions.push({ lead_id: ld.id, type: "stale_new_lead", nombre: ld.nombre, hours_since: Math.round(age / 36e5) });
          leads[i].followup_sent_48h = true;
        } else if (sinceContact > sevenDays && !ld.followup_sent_7d) {
          actions.push({ lead_id: ld.id, type: "cold_lead_7d", nombre: ld.nombre, days_since: Math.round(sinceContact / oneDay) });
          leads[i].followup_sent_7d = true;
        }
      }
      if (actions.length > 0) {
        await env.DB.put("leads", JSON.stringify(leads));
        if (env.NOTIFY_WEBHOOK) {
          try {
            await fetch(env.NOTIFY_WEBHOOK, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "followup_reminders", actions, count: actions.length, timestamp: (/* @__PURE__ */ new Date()).toISOString() })
            });
          } catch (e2) {
          }
        }
      }
      return jsonRes({ ok: true, followups: actions.length, actions });
    }
    if (method === "POST" && path === "/api/leads/auto-route") {
      var authH = request.headers.get("Authorization") || "";
      if (authH !== "Bearer " + (env.ADMIN_KEY || "")) return jsonRes({ error: "Unauthorized" }, 401);
      var body = await request.json();
      var leads = JSON.parse(await env.DB.get("leads") || "[]");
      var brokers = JSON.parse(await env.DB.get("brokers") || "[]");
      var approvedBrokers = brokers.filter(function(b2) {
        return b2.status === "aprobado";
      });
      if (!approvedBrokers.length) return jsonRes({ error: "No hay asesores aprobados" }, 400);
      var routed = 0;
      var results = [];
      for (var i = 0; i < leads.length; i++) {
        var ld = leads[i];
        if (ld.assigned_broker) continue;
        if (ld.etapa === "cerrado" || ld.etapa === "perdido") continue;
        var zona = (ld.zona || ld.ubicacion || "").toLowerCase();
        var tipo = (ld.tipo || ld.interes || "").toLowerCase();
        var matched = [];
        for (var j = 0; j < approvedBrokers.length; j++) {
          var b = approvedBrokers[j];
          var bZonas = (b.zonas || []).map(function(z) {
            return z.toLowerCase();
          });
          var bEsp = (b.especialidad || []).map(function(e2) {
            return e2.toLowerCase();
          });
          var zMatch = zona && bZonas.some(function(z) {
            return zona.indexOf(z) !== -1 || z.indexOf(zona) !== -1;
          });
          var tMatch = tipo && bEsp.some(function(e2) {
            return tipo.indexOf(e2) !== -1 || e2.indexOf(tipo) !== -1;
          });
          if (zMatch && tMatch) matched.push({ broker: b, priority: 3 });
          else if (zMatch) matched.push({ broker: b, priority: 2 });
          else if (tMatch) matched.push({ broker: b, priority: 1 });
        }
        if (matched.length === 0) {
          var assignedCounts = {};
          leads.forEach(function(l) {
            if (l.assigned_broker) assignedCounts[l.assigned_broker] = (assignedCounts[l.assigned_broker] || 0) + 1;
          });
          var best = approvedBrokers.reduce(function(a, b2) {
            return (assignedCounts[a.id] || 0) <= (assignedCounts[b2.id] || 0) ? a : b2;
          });
          matched.push({ broker: best, priority: 0 });
        }
        matched.sort(function(a, b2) {
          return b2.priority - a.priority;
        });
        var winner = matched[0].broker;
        leads[i].assigned_broker = winner.id;
        leads[i].assigned_broker_name = winner.nombre;
        leads[i].assigned_at = (/* @__PURE__ */ new Date()).toISOString();
        routed++;
        results.push({ lead: ld.nombre, broker: winner.nombre, priority: matched[0].priority });
      }
      if (routed > 0) {
        await env.DB.put("leads", JSON.stringify(leads));
      }
      return jsonRes({ ok: true, routed, results });
    }
    if (method === "GET" && path === "/api/reports/weekly") {
      var authH = request.headers.get("Authorization") || "";
      if (authH !== "Bearer " + (env.CRON_SECRET || "cron-secret-2026") && authH !== "Bearer " + (env.ADMIN_KEY || ""))
        return jsonRes({ error: "Unauthorized" }, 401);
      var leads = JSON.parse(await env.DB.get("leads") || "[]");
      var brokers = JSON.parse(await env.DB.get("brokers") || "[]");
      var now = Date.now();
      var weekAgo = now - 7 * 864e5;
      var weekLeads = leads.filter(function(l) {
        return new Date(l.fecha || l.created_at || 0).getTime() > weekAgo;
      });
      var totalLeads = leads.length;
      var byEtapa = {};
      leads.forEach(function(l) {
        byEtapa[l.etapa || "sin_etapa"] = (byEtapa[l.etapa || "sin_etapa"] || 0) + 1;
      });
      var bySource = {};
      weekLeads.forEach(function(l) {
        var s2 = l.utm_source || l.source || "directo";
        bySource[s2] = (bySource[s2] || 0) + 1;
      });
      var hotLeads = leads.filter(function(l) {
        return (l.score || 0) >= 70 && l.etapa !== "cerrado" && l.etapa !== "perdido";
      });
      var brokerStats = {};
      leads.forEach(function(l) {
        if (l.assigned_broker) {
          if (!brokerStats[l.assigned_broker]) brokerStats[l.assigned_broker] = { total: 0, nuevo: 0, contactado: 0, cerrado: 0, perdido: 0, name: l.assigned_broker_name || l.assigned_broker };
          brokerStats[l.assigned_broker].total++;
          brokerStats[l.assigned_broker][l.etapa || "nuevo"]++;
        }
      });
      var cerrados = leads.filter(function(l) {
        return l.etapa === "cerrado";
      }).length;
      var convRate = totalLeads > 0 ? Math.round(cerrados / totalLeads * 100) : 0;
      var staleLeads = leads.filter(function(l) {
        if (l.etapa === "cerrado" || l.etapa === "perdido") return false;
        var lastC = l.last_contact ? new Date(l.last_contact).getTime() : new Date(l.fecha || l.created_at || 0).getTime();
        return now - lastC > 7 * 864e5;
      });
      var report = {
        period: { from: new Date(weekAgo).toISOString().split("T")[0], to: new Date(now).toISOString().split("T")[0] },
        summary: {
          total_leads: totalLeads,
          new_this_week: weekLeads.length,
          hot_leads: hotLeads.length,
          stale_leads: staleLeads.length,
          conversion_rate: convRate + "%",
          active_brokers: brokers.filter(function(b2) {
            return b2.status === "aprobado";
          }).length
        },
        pipeline: byEtapa,
        sources_this_week: bySource,
        broker_performance: Object.values(brokerStats),
        alerts: []
      };
      if (hotLeads.length > 0) report.alerts.push({ type: "hot_leads", message: hotLeads.length + " leads calientes sin cerrar", leads: hotLeads.map(function(l) {
        return { nombre: l.nombre, score: l.score, etapa: l.etapa };
      }).slice(0, 10) });
      if (staleLeads.length > 0) report.alerts.push({ type: "stale_leads", message: staleLeads.length + " leads sin contacto en 7+ dias" });
      if (weekLeads.length === 0) report.alerts.push({ type: "no_leads", message: "No se generaron leads esta semana" });
      if (env.NOTIFY_WEBHOOK) {
        try {
          await fetch(env.NOTIFY_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "weekly_report", report, timestamp: (/* @__PURE__ */ new Date()).toISOString() })
          });
        } catch (e2) {
        }
      }
      return jsonRes(report);
    }
    if (method === "POST" && path === "/api/track") {
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      var event = body.event;
      var brokerId = body.broker_id;
      if (!event || !brokerId) return jsonRes({ error: "event y broker_id requeridos" }, 400);
      var today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      var key = "analytics:" + brokerId;
      var raw = await env.DB.get(key);
      var analytics = raw ? JSON.parse(raw) : { daily: {}, totals: {} };
      if (!analytics.daily[today]) analytics.daily[today] = {};
      analytics.daily[today][event] = (analytics.daily[today][event] || 0) + 1;
      analytics.totals[event] = (analytics.totals[event] || 0) + 1;
      var days = Object.keys(analytics.daily).sort();
      if (days.length > 90) {
        for (var d = 0; d < days.length - 90; d++) delete analytics.daily[days[d]];
      }
      await env.DB.put(key, JSON.stringify(analytics));
      return jsonRes({ ok: true });
    }
    if (method === "GET" && path === "/api/broker/analytics") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var raw = await env.DB.get("analytics:" + broker.id);
      var analytics = raw ? JSON.parse(raw) : { daily: {}, totals: {} };
      var now = /* @__PURE__ */ new Date();
      var last7 = {};
      var last30 = {};
      for (var i = 0; i < 30; i++) {
        var d = new Date(now - i * 864e5).toISOString().split("T")[0];
        var dayData = analytics.daily[d] || {};
        Object.keys(dayData).forEach(function(ev) {
          last30[ev] = (last30[ev] || 0) + dayData[ev];
          if (i < 7) last7[ev] = (last7[ev] || 0) + dayData[ev];
        });
      }
      var msgsRaw = await env.DB.get("messages:" + broker.id);
      var msgs = msgsRaw ? JSON.parse(msgsRaw) : [];
      var unread = msgs.filter(function(m) {
        return !m.leido;
      }).length;
      var propsRaw = await env.DB.get("propiedades");
      var allProps = propsRaw ? JSON.parse(propsRaw) : [];
      var myProps = allProps.filter(function(p) {
        return p.broker_id === broker.id && p.estado !== "Eliminada";
      });
      var revRaw = await env.DB.get("reviews:" + broker.id);
      var reviews = revRaw ? JSON.parse(revRaw) : [];
      var avgRating = reviews.length > 0 ? (reviews.reduce(function(s2, r) {
        return s2 + r.rating;
      }, 0) / reviews.length).toFixed(1) : null;
      return jsonRes({
        totals: analytics.totals,
        last7,
        last30,
        daily: analytics.daily,
        messages_total: msgs.length,
        messages_unread: unread,
        properties_active: myProps.length,
        reviews_count: reviews.length,
        avg_rating: avgRating
      });
    }
    if (method === "POST" && path === "/api/reviews") {
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.broker_id || !body.nombre || !body.rating || !body.comentario) {
        return jsonRes({ error: "broker_id, nombre, rating y comentario son requeridos" }, 400);
      }
      var rating = parseInt(body.rating);
      if (rating < 1 || rating > 5) return jsonRes({ error: "Rating debe ser entre 1 y 5" }, 400);
      var review = {
        id: crypto.randomUUID(),
        broker_id: body.broker_id,
        nombre: body.nombre,
        email: body.email || "",
        rating,
        comentario: body.comentario.substring(0, 500),
        propiedad: body.propiedad || "",
        status: "pending",
        // pending → approved → rejected
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      var key = "reviews:" + body.broker_id;
      var raw = await env.DB.get(key);
      var reviews = raw ? JSON.parse(raw) : [];
      reviews.unshift(review);
      if (reviews.length > 100) reviews = reviews.slice(0, 100);
      await env.DB.put(key, JSON.stringify(reviews));
      var approved = reviews.filter(function(r) {
        return r.status === "approved";
      });
      if (approved.length > 0) {
        var avg = (approved.reduce(function(s2, r) {
          return s2 + r.rating;
        }, 0) / approved.length).toFixed(1);
        var brokersRaw = await env.DB.get("brokers");
        var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
        for (var i = 0; i < brokers.length; i++) {
          if (brokers[i].id === body.broker_id) {
            brokers[i].avg_rating = parseFloat(avg);
            brokers[i].review_count = approved.length;
            break;
          }
        }
        await env.DB.put("brokers", JSON.stringify(brokers));
      }
      if (NOTIFY_WEBHOOK) {
        ctx.waitUntil(fetch(NOTIFY_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "new_review", broker_id: body.broker_id, reviewer: body.nombre, rating, comment: body.comentario.substring(0, 200) })
        }).catch(function() {
        }));
      }
      return jsonRes({ ok: true, id: review.id, message: "Rese\xF1a enviada. Ser\xE1 visible despu\xE9s de aprobaci\xF3n." });
    }
    if (method === "GET" && path.startsWith("/api/public/reviews/")) {
      var brokerId = path.replace("/api/public/reviews/", "");
      var raw = await env.DB.get("reviews:" + brokerId);
      var reviews = raw ? JSON.parse(raw) : [];
      var approved = reviews.filter(function(r) {
        return r.status === "approved";
      });
      approved.forEach(function(r) {
        delete r.email;
      });
      var avg = approved.length > 0 ? (approved.reduce(function(s2, r) {
        return s2 + r.rating;
      }, 0) / approved.length).toFixed(1) : null;
      return jsonRes({ reviews: approved, avg_rating: avg, count: approved.length });
    }
    if (method === "GET" && path === "/api/broker/reviews") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var raw = await env.DB.get("reviews:" + broker.id);
      var reviews = raw ? JSON.parse(raw) : [];
      return jsonRes({ reviews });
    }
    if (method === "PUT" && path === "/api/admin/reviews") {
      if (!await requireAuth(request, env)) return jsonRes({ error: "No autorizado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.broker_id || !body.review_id || !body.status) return jsonRes({ error: "broker_id, review_id y status requeridos" }, 400);
      var key = "reviews:" + body.broker_id;
      var raw = await env.DB.get(key);
      var reviews = raw ? JSON.parse(raw) : [];
      var found = false;
      for (var i = 0; i < reviews.length; i++) {
        if (reviews[i].id === body.review_id) {
          reviews[i].status = body.status;
          found = true;
          break;
        }
      }
      if (!found) return jsonRes({ error: "Rese\xF1a no encontrada" }, 404);
      await env.DB.put(key, JSON.stringify(reviews));
      var approved = reviews.filter(function(r) {
        return r.status === "approved";
      });
      var brokersRaw = await env.DB.get("brokers");
      var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
      for (var i = 0; i < brokers.length; i++) {
        if (brokers[i].id === body.broker_id) {
          brokers[i].avg_rating = approved.length > 0 ? parseFloat((approved.reduce(function(s2, r) {
            return s2 + r.rating;
          }, 0) / approved.length).toFixed(1)) : 0;
          brokers[i].review_count = approved.length;
          break;
        }
      }
      await env.DB.put("brokers", JSON.stringify(brokers));
      return jsonRes({ ok: true });
    }
    if (method === "GET" && path === "/api/admin/reviews/pending") {
      if (!await requireAuth(request, env)) return jsonRes({ error: "No autorizado" }, 401);
      var brokersRaw = await env.DB.get("brokers");
      var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
      var pending = [];
      for (var b = 0; b < brokers.length; b++) {
        var raw = await env.DB.get("reviews:" + brokers[b].id);
        var reviews = raw ? JSON.parse(raw) : [];
        reviews.filter(function(r) {
          return r.status === "pending";
        }).forEach(function(r) {
          r.broker_name = brokers[b].nombre;
          pending.push(r);
        });
      }
      pending.sort(function(a, b2) {
        return new Date(b2.created_at) - new Date(a.created_at);
      });
      return jsonRes({ pending });
    }
    if (method === "POST" && path === "/api/broker/payment-request") {
      var broker = await requireBrokerAuth(request, env);
      if (!broker) return jsonRes({ error: "No autenticado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      var plan = body.plan;
      if (plan !== "pro" && plan !== "premium") return jsonRes({ error: "Plan debe ser pro o premium" }, 400);
      var paymentRequest = {
        id: crypto.randomUUID(),
        broker_id: broker.id,
        broker_name: broker.nombre,
        broker_email: broker.email || "",
        current_plan: broker.plan || "free",
        requested_plan: plan,
        status: "pending",
        // pending → confirmed → rejected
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        payment_method: body.payment_method || "",
        payment_reference: body.payment_reference || "",
        notes: body.notes || ""
      };
      var key = "payment_requests";
      var raw = await env.DB.get(key);
      var requests = raw ? JSON.parse(raw) : [];
      requests.unshift(paymentRequest);
      await env.DB.put(key, JSON.stringify(requests));
      if (NOTIFY_WEBHOOK) {
        ctx.waitUntil(fetch(NOTIFY_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "payment_request", broker: broker.nombre, plan, reference: body.payment_reference || "Sin referencia" })
        }).catch(function() {
        }));
      }
      return jsonRes({
        ok: true,
        id: paymentRequest.id,
        message: "Solicitud recibida. Tu plan ser\xE1 activado al confirmar el pago.",
        payment_info: {
          bank: "Banco Industrial",
          account: "Monetaria 000-000000-0",
          name: "ZONA INNMUEBLE",
          amount: plan === "basico" ? "Q149/mes" : plan === "pro" ? "Q349/mes" : "Q699/mes",
          instructions: "Realiza la transferencia o dep\xF3sito y env\xEDa el comprobante por WhatsApp o sube la referencia aqu\xED."
        }
      });
    }
    if (method === "GET" && path === "/api/admin/payment-requests") {
      if (!await requireAuth(request, env)) return jsonRes({ error: "No autorizado" }, 401);
      var raw = await env.DB.get("payment_requests");
      var requests = raw ? JSON.parse(raw) : [];
      return jsonRes({ requests });
    }
    if (method === "PUT" && path === "/api/admin/payment-requests") {
      if (!await requireAuth(request, env)) return jsonRes({ error: "No autorizado" }, 401);
      var body;
      try {
        body = await request.json();
      } catch {
        return jsonRes({ error: "JSON inv\xE1lido" }, 400);
      }
      if (!body.request_id || !body.status) return jsonRes({ error: "request_id y status requeridos" }, 400);
      var raw = await env.DB.get("payment_requests");
      var requests = raw ? JSON.parse(raw) : [];
      var req = null;
      for (var i = 0; i < requests.length; i++) {
        if (requests[i].id === body.request_id) {
          requests[i].status = body.status;
          requests[i].confirmed_at = (/* @__PURE__ */ new Date()).toISOString();
          req = requests[i];
          break;
        }
      }
      if (!req) return jsonRes({ error: "Solicitud no encontrada" }, 404);
      await env.DB.put("payment_requests", JSON.stringify(requests));
      if (body.status === "confirmed") {
        var brokersRaw = await env.DB.get("brokers");
        var brokers = brokersRaw ? JSON.parse(brokersRaw) : [];
        for (var i = 0; i < brokers.length; i++) {
          if (brokers[i].id === req.broker_id) {
            brokers[i].plan = req.requested_plan;
            brokers[i].plan_activated_at = (/* @__PURE__ */ new Date()).toISOString();
            break;
          }
        }
        await env.DB.put("brokers", JSON.stringify(brokers));
      }
      return jsonRes({ ok: true, plan_upgraded: body.status === "confirmed" });
    }
    return jsonRes({ error: "Not found" }, 404);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(logWaError(env, "cron_heartbeat", "scheduled() se ejecuto correctamente a las " + new Date(event.scheduledTime).toISOString()));
    ctx.waitUntil(sendFollowUps(env));
  }
};
export {
  index_default as default,
  WaConversationDO
};
//# sourceMappingURL=index.js.map

