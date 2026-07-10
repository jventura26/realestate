// Durable Object para almacenar propiedades
export class PropertiesDatabase {
  constructor(state, env) {
    this.state = state;
    this.env = env;
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
      return stub.fetch(request);
    }

    // Servir archivos estáticos
    return env.ASSETS.fetch(request);
  }
};
