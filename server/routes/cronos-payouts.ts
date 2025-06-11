import { Router } from 'express';
import { cronosPayoutSystem } from '../automated-cronos-payout-system';

const router = Router();

// Get Cronos payout system status and configuration
router.get('/', (req, res) => {
  try {
    const status = cronosPayoutSystem.getPayoutStatus();
    const config = cronosPayoutSystem.getPayoutConfiguration();
    
    res.json({
      success: true,
      status: 'active',
      configuration: {
        payoutAddress: config.payoutAddress,
        payoutAmount: config.payoutAmount,
        currency: 'USDC',
        minimumPortfolioValue: config.minimumPortfolioValue,
        intervalMinutes: config.intervalMinutes,
        whitelistValidated: config.whitelistValidated,
        usdcContract: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59'
      },
      payoutHistory: {
        totalPayouts: status.totalPayouts,
        totalAmountSent: status.totalAmountSent,
        lastPayoutTime: status.lastPayoutTime,
        nextPayoutETA: status.nextPayoutETA,
        recentPayouts: status.recentPayouts
      },
      message: 'Automated USDC payouts on Cronos network active'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Payout system error' 
    });
  }
});

// Trigger manual payout
router.post('/trigger', async (req, res) => {
  try {
    const success = await cronosPayoutSystem.triggerManualPayout();
    
    res.json({
      success,
      message: success 
        ? 'Manual payout triggered successfully' 
        : 'Payout blocked - portfolio below threshold or system paused'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Manual payout failed' 
    });
  }
});

// Pause automatic payouts
router.post('/pause', (req, res) => {
  try {
    cronosPayoutSystem.pausePayouts();
    
    res.json({
      success: true,
      message: 'Automatic payouts paused'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to pause payouts' 
    });
  }
});

// Resume automatic payouts
router.post('/resume', (req, res) => {
  try {
    cronosPayoutSystem.resumePayouts();
    
    res.json({
      success: true,
      message: 'Automatic payouts resumed'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to resume payouts' 
    });
  }
});

export default router;