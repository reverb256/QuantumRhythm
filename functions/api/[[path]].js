
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const tradingData = {
  "timestamp": "2025-06-12T03:01:17.793Z",
  "walletBalance": 0.288736,
  "activeStrategies": [
    {
      "protocol": "Kamino",
      "apy": 11,
      "allocation": 0.0693
    },
    {
      "protocol": "Marinade",
      "apy": 7.2,
      "allocation": 0.0693
    },
    {
      "protocol": "Solend",
      "apy": 8.5,
      "allocation": 0.0693
    }
  ],
  "totalDeployed": 0.2079,
  "expectedAnnualReturn": 3.7,
  "opportunitiesScanned": 16,
  "autonomousWallets": 4,
  "performanceMetrics": {
    "totalReturn": 0,
    "winRate": 0,
    "activeTrades": 0
  }
};

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Handle API routes
  if (url.pathname.startsWith('/api/')) {
    return handleAPI(url.pathname)
  }
  
  // Serve static content
  return fetch(request)
}

function handleAPI(path) {
  const headers = { 'Content-Type': 'application/json' }
  
  if (path === '/api/portfolio/status') {
    return new Response(JSON.stringify({
      success: true,
      portfolio: {
        totalValueUSD: tradingData.walletBalance * 200,
        strategies: tradingData.activeStrategies,
        lastUpdate: tradingData.timestamp
      }
    }), { headers })
  }
  
  return new Response(JSON.stringify({ error: 'Not found' }), { 
    status: 404, 
    headers 
  })
}