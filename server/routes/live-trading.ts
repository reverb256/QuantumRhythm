import { Router } from 'express';
import { realProfitTrader } from '../real-profit-trader';

const router = Router();

// Activate live trading
router.post('/activate', async (req, res) => {
  try {
    console.log('🚀 Activating live trading for development funding...');
    
    const results = await realProfitTrader.activateRealTrading();
    const status = realProfitTrader.getPortfolioStatus();
    
    res.json({
      success: true,
      data: {
        tradingResults: results,
        portfolioStatus: status,
        message: status.readyForDevelopment 
          ? 'Development funding target achieved!' 
          : `Progress: ${status.progressPercent.toFixed(1)}% of target`
      }
    });
    
  } catch (error) {
    console.error('Live trading activation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get trading status
router.get('/status', async (req, res) => {
  try {
    const status = realProfitTrader.getPortfolioStatus();
    
    res.json({
      success: true,
      data: status
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;