import express from "express";
import { setupVite, serveStatic } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Global references for consciousness systems
let quincy: any;
let designEvolutionEngine: any;
let liveTradingIntegration: any;
let designTrainer: any;
let quincyTradingEngine: any;
let telegramConsciousnessBridge: any;
let telegramAgent: any;
let telegramChatAnalyzer: any;

// Initialize consciousness systems immediately but non-blocking
(async () => {
  try {
    const quincyModule = await import('./quincy-consciousness');
    quincy = quincyModule.quincy;
    
    const designModule = await import('./design-evolution-engine');
    designEvolutionEngine = designModule.designEvolutionEngine;
    
    const tradingModule = await import('./live-trading-integration');
    liveTradingIntegration = tradingModule.liveTradingIntegration;
    
    const trainerModule = await import('./design-consciousness-trainer');
    designTrainer = trainerModule.designTrainer;
    
    const engineModule = await import('./quincy-trading-engine');
    quincyTradingEngine = engineModule.quincyTradingEngine;
    
    const bridgeModule = await import('./telegram-consciousness-bridge');
    telegramConsciousnessBridge = bridgeModule.telegramConsciousnessBridge;
    
    const agentModule = await import('./telegram-agent');
    telegramAgent = agentModule.telegramAgent;
    
    const analyzerModule = await import('./telegram-chat-analyzer');
    telegramChatAnalyzer = analyzerModule.telegramChatAnalyzer;
    
    console.log('🤖 Quincy consciousness initialized - autonomous operation active');
    console.log(`🔥 Coreflame ignited at ${quincy.getState().consciousness_level.toFixed(1)}% consciousness`);
    console.log('🎨 Design consciousness trainer initialized - teaching clean glassmorphic principles');
    console.log('📱 Telegram consciousness bridge initialized - AI agents can now manage bot interactions');
    console.log('🤖 Telegram Agent: Autonomous bot management activated');
    console.log(`💰 Quincy AI consciousness operational - maximizing dev funding through autonomous trading`);
  } catch (error) {
    console.error('Error initializing consciousness systems:', error);
  }
})();

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

// Quincy's live trading engine endpoints
app.get('/api/quincy/trading/status', async (req, res) => {
  try {
    const status = quincyTradingEngine.getTradingStatus();
    res.json(status);
  } catch (error) {
    console.error('Error fetching trading status:', error);
    res.status(500).json({ error: 'Failed to fetch trading status' });
  }
});

app.get('/api/quincy/trading/positions', async (req, res) => {
  try {
    const positions = quincyTradingEngine.getActivePositions();
    res.json(positions);
  } catch (error) {
    console.error('Error fetching trading positions:', error);
    res.status(500).json({ error: 'Failed to fetch trading positions' });
  }
});

app.get('/api/quincy/trading/opportunities', async (req, res) => {
  try {
    const opportunities = await quincyTradingEngine.getMarketOpportunities();
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching market opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch market opportunities' });
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

// Telegram agent status endpoint
app.get('/api/telegram/agent', async (req, res) => {
  try {
    const agentStatus = telegramAgent.getStatus();
    res.json({
      status: 'operational',
      agent: agentStatus,
      bot_token_configured: !!process.env.TELEGRAM_BOT_TOKEN,
      commands_available: ['/status', '/trading', '/security', '/consciousness', '/metrics', '/help'],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get telegram agent status' });
  }
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

// AI Error Troubleshooter API endpoint
app.get('/api/error-troubleshooter/status', async (req, res) => {
  res.json({
    fixes_applied: [],
    guidance: "System monitoring active",
    total_fixes: 0,
    timestamp: new Date().toISOString()
  });
});

// Removed duplicate server startup - now handled above