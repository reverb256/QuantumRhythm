import { Router } from 'express';
import { walletManager } from '../wallet-manager';

const router = Router();

// Get current wallet status
router.get('/status', async (req, res) => {
  try {
    const currentWallet = walletManager.getCurrentWallet();
    const validation = await walletManager.validateWallet();
    
    res.json({
      connected: walletManager.isWalletConnected(),
      wallet: currentWallet,
      validation,
      source: walletManager.getWalletSource()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get wallet status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Set user wallet
router.post('/connect', async (req, res) => {
  try {
    const { publicKey, source = 'user_input' } = req.body;
    
    if (!publicKey) {
      return res.status(400).json({
        error: 'Public key required'
      });
    }
    
    const success = walletManager.setUserWallet(publicKey, source);
    
    if (success) {
      const validation = await walletManager.validateWallet();
      res.json({
        success: true,
        message: 'Wallet connected successfully',
        validation
      });
    } else {
      res.status(400).json({
        error: 'Invalid wallet address'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to connect wallet',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Disconnect wallet
router.post('/disconnect', (req, res) => {
  try {
    walletManager.disconnectWallet();
    res.json({
      success: true,
      message: 'Wallet disconnected'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to disconnect wallet',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get wallet balance
router.get('/balance', async (req, res) => {
  try {
    const balance = await walletManager.getWalletBalance();
    const currentWallet = walletManager.getCurrentWallet();
    
    res.json({
      balance,
      address: currentWallet?.publicKey || null,
      connected: walletManager.isWalletConnected()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get wallet balance',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;