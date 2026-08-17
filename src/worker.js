// Durable Object para almacenar propiedades
export class PropertiesDatabase {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async hashSHA256(value) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  async fetch(request) {
    const url = new URL(request.url);
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // GET - Listar propiedades
      if (method === 'GET' && url.pathname === '/api/propiedades') {
        const data = await this.state.storage.get('propiedades') || [];
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // POST - Crear propiedad
      if (method === 'POST' && url.pathname === '/api/propiedades') {
        const newProperty = await request.json();
        newProperty.id = Date.now().toString();
        newProperty.createdAt = new Date().toISOString();

        const data = await this.state.storage.get('propiedades') || [];
        data.push(newProperty);
        await this.state.storage.put('propiedades', data);

        return new Response(JSON.stringify(newProperty), {
          status: 201,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // DELETE - Eliminar propiedad
      if (method === 'DELETE' && url.pathname.startsWith('/api/propiedades/')) {
        const id = url.pathname.split('/').pop();
        const data = await this.state.storage.get('propiedades') || [];
        const filtered = data.filter(p => p.id !== id);
        await this.state.storage.put('propiedades', filtered);

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // PUT - Actualizar propiedad
      if (method === 'PUT' && url.pathname.startsWith('/api/propiedades/')) {
        const id = url.pathname.split('/').pop();
        const updated = await request.json();
        const data = await this.state.storage.get('propiedades') || [];
        const index = data.findIndex(p => p.id === id);

        if (index >= 0) {
          data[index] = { ...data[index], ...updated };
          await this.state.storage.put('propiedades', data);
          return new Response(JSON.stringify(data[index]), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        return new Response('No encontrado', { status: 404 });
      }

      // ── LEADS CRM ────────────────────────────────────────────────
      // POST - Guardar lead
      if (method === 'POST' && url.pathname === '/api/leads') {
        const lead = await request.json();
        lead.id = Date.now().toString();
        lead.createdAt = new Date().toISOString();
        lead.status = 'nuevo';

        const leads = await this.state.storage.get('leads') || [];
        leads.push(lead);
        await this.state.storage.put('leads', leads);

        // ── Meta Conversions API (server-side) ──────────────────
        const PIXEL_ID = '1668269500330907';
        const META_TOKEN = request.headers.get('X-Meta-Token') || 'EAAJqIg1BUn0BR4xyyEPPk7LYPBwj3XofzQq6fcq3JUmsNaYMTYwmDycjyZAinUl9NDjlB8ZBymE0vHqcqZCevHtZAoaEhCwHhm3i5ZBrAJ5z3ayUujBFEcpmLdcXZCw9qL1kSp6eilAvQ3ZB0x5ZBVHhVcTLIZCaZBeb2nqjNrV9D1WAi0wqEwQuU0g6aT5KuPVsA14QZDZD';
        if (META_TOKEN) {
          const eventData = {
            data: [{
              event_name: 'Lead',
              event_time: Math.floor(Date.now() / 1000),
              event_source_url: lead.page_url || '',
              action_source: 'website',
              user_data: {
                em: lead.email ? [await this.hashSHA256(lead.email.toLowerCase().trim())] : [],
                ph: lead.phone ? [await this.hashSHA256(lead.phone.replace(/[^0-9]/g, ''))] : [],
                fn: lead.name ? [await this.hashSHA256(lead.name.toLowerCase().trim().split(' ')[0])] : [],
                client_user_agent: lead.user_agent || '',
                fbc: lead.fbc || '',
                fbp: lead.fbp || ''
              },
              custom_data: {
                property_slug: lead.property_slug || '',
                property_name: lead.property_name || '',
                utm_source: lead.utm_source || '',
                utm_campaign: lead.utm_campaign || '',
                lead_type: 'form'
              }
            }]
          };
          // Fire and forget — don't block the response
          fetch('https://graph.facebook.com/v21.0/' + PIXEL_ID + '/events?access_token=' + META_TOKEN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
          }).catch(function() {});
        }

        return new Response(JSON.stringify({ success: true, id: lead.id }), {
          status: 201,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // GET - Listar leads
      if (method === 'GET' && url.pathname === '/api/leads') {
        const leads = await this.state.storage.get('leads') || [];
        return new Response(JSON.stringify(leads), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // DELETE - Eliminar lead
      if (method === 'DELETE' && url.pathname.startsWith('/api/leads/')) {
        const id = url.pathname.split('/').pop();
        const leads = await this.state.storage.get('leads') || [];
        const filtered = leads.filter(function(l) { return l.id !== id; });
        await this.state.storage.put('leads', filtered);
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // PUT - Actualizar estado de lead
      if (method === 'PUT' && url.pathname.startsWith('/api/leads/')) {
        const id = url.pathname.split('/').pop();
        const update = await request.json();
        const leads = await this.state.storage.get('leads') || [];
        var idx = -1;
        for (var li = 0; li < leads.length; li++) {
          if (leads[li].id === id) { idx = li; break; }
        }
        if (idx >= 0) {
          Object.assign(leads[idx], update);
          leads[idx].updatedAt = new Date().toISOString();
          await this.state.storage.put('leads', leads);
          return new Response(JSON.stringify(leads[idx]), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
        return new Response('Lead no encontrado', { status: 404 });
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
}

// Worker principal
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Redirigir /admin a admin.html
    if (url.pathname === '/admin') {
      return env.ASSETS.fetch('/admin.html');
    }

    // API - Usar Durable Object
    if (url.pathname.startsWith('/api/')) {
      const id = env.PROPERTIES_DB.idFromName('main');
      const stub = env.PROPERTIES_DB.get(id);
      // Pass env as header for CAPI token access
      const newReq = new Request(request);
      newReq.headers.set('X-Meta-Token', env.META_CAPI_TOKEN || '');
      return stub.fetch(newReq, ctx);
    }

    // Servir archivos estáticos
    return env.ASSETS.fetch(request);
  }
};
