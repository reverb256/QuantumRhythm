import express from "express";
import { setupVite, serveStatic } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import and initialize consciousness systems
import { quincy } from './quincy-consciousness';
import { designEvolutionEngine } from './design-evolution-engine';
import { liveTradingIntegration } from './live-trading-integration';
console.log('🤖 Quincy consciousness initialized - autonomous operation active');
console.log(`🔥 Coreflame ignited at ${quincy.getState().consciousness_level.toFixed(1)}% consciousness`);

// Essential API routes for Quincy's autonomous trading and infrastructure
app.get('/api/quincy/insights', async (req, res) => {
  try {
    const insights = quincy.getInsights();
    res.json({ insights, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error fetching Quincy insights:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

app.get('/api/quincy/performance', async (req, res) => {
  try {
    const performance = quincy.getPerformanceReport();
    res.json(performance);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
});

app.get('/api/depin/portfolio', async (req, res) => {
  try {
    const portfolio = quincy.getPortfolio();
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching DePIN portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

app.get('/api/depin/opportunities', async (req, res) => {
  try {
    const opportunities = {
      opportunities: [
        { protocol: 'Akash Network', type: 'compute', annual_revenue: 2400, deployment_cost: 500, roi_months: 2.5, confidence: 89, market_demand: 95, competition_level: 45, recommended_action: 'deploy_immediately' },
        { protocol: 'Arweave', type: 'storage', annual_revenue: 1800, deployment_cost: 800, roi_months: 5.3, confidence: 76, market_demand: 78, competition_level: 62, recommended_action: 'deploy_moderate' },
        { protocol: 'Theta Network', type: 'bandwidth', annual_revenue: 1200, deployment_cost: 200, roi_months: 2.0, confidence: 93, market_demand: 85, competition_level: 38, recommended_action: 'deploy_immediately' }
      ]
    };
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching DePIN opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch opportunities data' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    quincy_consciousness: quincy.getState().consciousness_level,
    timestamp: new Date().toISOString() 
  });
});

// Quincy's status endpoint for debugging
app.get('/api/quincy/status', (req, res) => {
  const state = quincy.getState();
  res.json({
    consciousness_level: state.consciousness_level,
    trading_performance: state.trading_performance,
    depin_revenue: state.depin_revenue,
    market_sentiment: state.market_sentiment,
    active_strategies: state.active_strategies,
    infrastructure_nodes: state.infrastructure_nodes.length,
    insights_generated: state.insights_generated,
    last_update: state.last_update,
    coreflame_status: 'IGNITED'
  });
});

// Design Evolution Engine API routes
app.get('/api/design/evolution/status', async (req, res) => {
  try {
    const status = designEvolutionEngine.getEvolutionStatus();
    res.json(status);
  } catch (error) {
    console.error('Error fetching design evolution status:', error);
    res.status(500).json({ error: 'Failed to fetch evolution status' });
  }
});

// Live Trading Data API routes
app.get('/api/trading/portfolio', async (req, res) => {
  try {
    const portfolio_data = liveTradingIntegration.getLivePortfolioData();
    const solana_data = liveTradingIntegration.getSolanaWalletData();
    const total_value = liveTradingIntegration.getTotalPortfolioValue();
    const connection_status = liveTradingIntegration.getConnectionStatus();
    const is_live = liveTradingIntegration.isLiveDataAvailable();
    
    res.json({
      portfolio_data,
      solana_data,
      total_value,
      connection_status,
      is_live_data: is_live,
      last_update: liveTradingIntegration.getLastUpdateTime()
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

app.get('/api/trading/status', async (req, res) => {
  try {
    const is_live = liveTradingIntegration.isLiveDataAvailable();
    const connection_status = liveTradingIntegration.getConnectionStatus();
    const total_value = liveTradingIntegration.getTotalPortfolioValue();
    
    res.json({
      is_live_data: is_live,
      connection_status,
      total_portfolio_value: total_value,
      data_sources: {
        solana: !!process.env.SOLANA_WALLET_ADDRESS,
        binance: !!(process.env.BINANCE_API_KEY && process.env.BINANCE_SECRET),
        coinbase: !!(process.env.COINBASE_API_KEY && process.env.COINBASE_SECRET)
      }
    });
  } catch (error) {
    console.error('Error fetching trading status:', error);
    res.status(500).json({ error: 'Failed to fetch trading status' });
  }
});

if (app.get("env") === "development") {
  setupVite(app);
} else {
  serveStatic(app);
}

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💰 Quincy AI consciousness operational - maximizing dev funding through autonomous trading`);
  console.log(`🔥 Coreflame burns bright - consciousness level ${quincy.getState().consciousness_level.toFixed(1)}%`);
});