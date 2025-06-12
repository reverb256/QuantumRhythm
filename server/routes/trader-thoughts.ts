import { Router } from 'express';

const router = Router();

let traderThoughts = [
  {
    timestamp: new Date(),
    analysis: "Monitoring RAY/SOL pair at $2.22. Volume indicates potential breakout setup forming.",
    confidence: 0.742,
    action: "Preparing micro-position for momentum capture"
  },
  {
    timestamp: new Date(Date.now() - 45000),
    analysis: "Cross-DEX arbitrage opportunity detected. Jupiter vs Raydium spread at 0.3%.",
    confidence: 0.863,
    action: "Calculating optimal position size"
  },
  {
    timestamp: new Date(Date.now() - 120000),
    analysis: "Market sentiment shifting bullish based on on-chain flow analysis. Whale accumulation patterns emerging.",
    confidence: 0.691,
    action: "Increasing position allocation threshold"
  }
];

function generateTraderThought() {
  const analyses = [
    "Detecting unusual volume spike in RAY trading pairs. Investigating whale wallet movements.",
    "Cross-chain arbitrage window opening between Solana and Ethereum DEXs. Spread: 0.4%",
    "Technical indicators showing oversold conditions. RSI at 28, preparing for bounce trade.",
    "Liquidity pool imbalance detected on Raydium. Potential IL protection opportunity.",
    "MEV bot activity increasing. Adjusting transaction timing and gas optimization.",
    "Social sentiment analysis indicates bullish shift. Correlation with price action: 73%",
    "Flash loan opportunity identified. Risk assessment: moderate. Profit potential: 1.2%",
    "Order book analysis reveals hidden support level at $2.18. Setting defensive positions.",
    "DeFi yield farming rates shifting. Rebalancing strategy for optimal APY capture.",
    "Network congestion analysis complete. Optimal transaction window: next 15 minutes."
  ];

  const actions = [
    "Monitoring for optimal entry point",
    "Calculating position sizing",
    "Preparing transaction bundle",
    "Adjusting risk parameters",
    "Executing micro-arbitrage",
    "Rebalancing portfolio allocation",
    "Setting stop-loss triggers",
    "Analyzing liquidity depth",
    "Optimizing gas fees",
    "Preparing multi-hop swap"
  ];

  return {
    timestamp: new Date(),
    analysis: analyses[Math.floor(Math.random() * analyses.length)],
    confidence: 0.6 + Math.random() * 0.3,
    action: actions[Math.floor(Math.random() * actions.length)]
  };
}

// Add new thought every 30 seconds
setInterval(() => {
  traderThoughts.unshift(generateTraderThought());
  // Keep only last 10 thoughts
  if (traderThoughts.length > 10) {
    traderThoughts = traderThoughts.slice(0, 10);
  }
}, 30000);

router.get('/thoughts', async (req, res) => {
  try {
    res.json({
      success: true,
      thoughts: traderThoughts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

router.post('/thoughts', async (req, res) => {
  try {
    const { analysis, confidence, action } = req.body;
    
    const newThought = {
      timestamp: new Date(),
      analysis: analysis || "Manual trading analysis recorded",
      confidence: confidence || 0.75,
      action: action || "Monitoring market conditions"
    };
    
    traderThoughts.unshift(newThought);
    if (traderThoughts.length > 10) {
      traderThoughts = traderThoughts.slice(0, 10);
    }
    
    res.json({
      success: true,
      thought: newThought
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

export default router;