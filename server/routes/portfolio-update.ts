import { Router } from 'express';
import { liveTradingExecutor } from '../live-trading-executor';

const router = Router();

let portfolioState = {
  value: 3.32,
  lastUpdate: new Date(),
  tradingProfits: 0,
  tradesExecuted: 0
};

router.post('/update', async (req, res) => {
  try {
    const { newValue, profits, tradesExecuted, timestamp } = req.body;
    
    portfolioState = {
      value: newValue || portfolioState.value,
      lastUpdate: new Date(timestamp || Date.now()),
      tradingProfits: (portfolioState.tradingProfits || 0) + (profits || 0),
      tradesExecuted: (portfolioState.tradesExecuted || 0) + (tradesExecuted || 0)
    };
    
    console.log(`💰 Portfolio updated: $${portfolioState.value.toFixed(2)}`);
    console.log(`📈 Total trading profits: $${portfolioState.tradingProfits.toFixed(2)}`);
    console.log(`🔄 Total trades: ${portfolioState.tradesExecuted}`);
    
    res.json({
      success: true,
      data: portfolioState
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/status', async (req, res) => {
  try {
    // Get live trading data
    const liveStatus = liveTradingExecutor.getPortfolioStatus();
    
    res.json({
      success: true,
      data: liveStatus
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

export default router;