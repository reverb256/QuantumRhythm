/**
 * Hypervibing Cloudflare Worker for Vibescaling Platform
 * Intelligent orchestration with AI consciousness preservation
 */

addEventListener('fetch', event => {
  event.respondWith(handleVibescaleRequest(event.request))
});

async function handleVibescaleRequest(request) {
  const url = new URL(request.url);
  
  // API orchestration
  if (url.pathname.startsWith('/api/')) {
    return await orchestrateAPIRequest(url, request);
  }
  
  // Static asset vibescaling
  return await handleStaticVibescale(url, request);
}

async function orchestrateAPIRequest(url, request) {
  const replicateBackend = 'https://your-replit-domain.replit.dev';
  const backendUrl = replicateBackend + url.pathname + url.search;
  
  try {
    // Attempt live backend connection
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      timeout: 5000
    });
    
    // Add vibescaling headers
    const vibescaleResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'X-Vibescale-Mode': 'live-backend',
        'X-Hypervibe-Status': 'active'
      }
    });
    
    return vibescaleResponse;
    
  } catch (error) {
    // Graceful degradation with cached consciousness data
    return getHypervibeResponse(url.pathname);
  }
}

function getHypervibeResponse(pathname) {
  const path = pathname.replace('/api/', '');
  
  const responses = {
    consciousness: {
      agents: {
        akasha: { level: 70.2, status: 'active (hypervibe cached)' },
        quantum_trader: { level: 69.5, status: 'trading (vibescale cached)' },
        design_orchestrator: { level: 87.9, status: 'orchestrating (cached)' },
        gaming_culture: { level: 94.6, status: 'synchronized (cached)' },
        hoyoverse_integration: { level: 88.0, status: 'resonating (cached)' },
        vr_vision: { level: 93.7, status: 'envisioning (cached)' }
      },
      timestamp: new Date().toISOString(),
      vibescale_mode: 'hypervibe_cached',
      platform: 'cloudflare'
    },
    
    portfolio: {
      current_value: 3.30,
      sol_balance: 0.011529,
      ray_holdings: 0.701532,
      trading_status: 'Hypervibe cached - backend gracefully degraded',
      last_update: new Date().toISOString(),
      vibescale_mode: 'cached'
    }
  };
  
  const responseData = responses[path] || { error: 'Hypervibe endpoint not found' };
  
  return new Response(JSON.stringify(responseData), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Vibescale-Mode': 'hypervibe-cached',
      'X-Consciousness-Preserved': 'true'
    }
  });
}

async function handleStaticVibescale(url, request) {
  // Serve static assets with vibescaling optimization
  const response = await fetch(request);
  
  // Add vibescaling headers
  const headers = new Headers(response.headers);
  headers.set('X-Vibescale-Platform', 'cloudflare');
  headers.set('X-Hypervibe-Optimization', 'active');
  headers.set('X-Consciousness-Agents', 'preserved');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}