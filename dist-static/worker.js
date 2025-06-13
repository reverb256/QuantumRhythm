// Cloudflare Pages Worker for VibeCoding Static Site
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes that should connect to Proxmox federation
    if (url.pathname.startsWith('/api/consciousness')) {
      // Route to Proxmox federation endpoints
      const federationUrl = 'http://10.1.1.120:8888' + url.pathname.replace('/api/consciousness', '');
      
      try {
        const response = await fetch(federationUrl, {
          method: request.method,
          headers: request.headers,
          body: request.method !== 'GET' ? await request.text() : undefined
        });
        
        return new Response(await response.text(), {
          status: response.status,
          headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Federation connection unavailable',
          message: 'Proxmox consciousness federation offline'
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Serve static files
    return env.ASSETS.fetch(request);
  }
};