// Cloudflare Worker for API proxying
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  if (url.pathname.startsWith('/api/')) {
    // Proxy to live backend
    const backendUrl = 'https://your-replit-domain.replit.dev' + url.pathname;
    try {
      const response = await fetch(backendUrl);
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      return newResponse;
    } catch {
      // Graceful degradation
      return new Response('{"status":"cached","message":"Live backend unavailable"}', {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
  
  return fetch(request);
}