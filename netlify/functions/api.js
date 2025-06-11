
exports.handler = async (event, context) => {
  const tradingData = {
  "timestamp": "2025-06-11T19:05:56.194Z",
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
  
  const path = event.path.replace('/.netlify/functions/api', '');
  
  if (path === '/portfolio/status') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        portfolio: {
          totalValueUSD: tradingData.walletBalance * 200,
          solBalance: tradingData.walletBalance,
          tradingStatus: 'yield_generation',
          strategies: tradingData.activeStrategies
        }
      })
    };
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found' })
  };
};