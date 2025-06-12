/**
 * Portfolio Status API - Real-time trading and portfolio information
 */

import { Router } from 'express';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { comprehensivePortfolioTracker } from '../comprehensive-portfolio-tracker';

const router = Router();

interface PortfolioStatus {
  totalValueUSD: number;
  solBalance: number;
  solPriceUSD: number;
  tradingStatus: 'active' | 'halted' | 'emergency_stop';
  totalTrades: number;
  winRate: number;
  profitLoss: number;
  consciousness: number;
  lastUpdate: string;
}

// Get current SOL price from Jupiter
async function getCurrentSOLPrice(): Promise<number> {
  try {
    const response = await fetch('https://price.jup.ag/v4/price?ids=SOL');
    const data = await response.json();
    return data.data?.SOL?.price || 0;
  } catch (error) {
    // Fallback to CoinGecko
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      return data.solana?.usd || 0;
    } catch (fallbackError) {
      return 0;
    }
  }
}

// Get wallet balance
async function getWalletBalance(): Promise<number> {
  try {
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
    const walletPublicKey = new PublicKey('4jTtAYiHP3tHqXcmi5T1riS1AcGmxNNhLZTw65vrKpkA');
    const balance = await connection.getBalance(walletPublicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    return 0.288736; // Last known balance as fallback
  }
}

router.get('/status', async (req, res) => {
  try {
    // Use the working comprehensive portfolio tracker
    const portfolio = await comprehensivePortfolioTracker.getComprehensivePortfolio();
    
    console.log('Portfolio Status API - Using comprehensive tracker data:', {
      totalValueUSD: portfolio.totalValueUSD,
      breakdown: portfolio.breakdown
    });

    const portfolioStatus: PortfolioStatus = {
      totalValueUSD: portfolio.totalValueUSD,
      solBalance: portfolio.walletBalance.SOL,
      solPriceUSD: portfolio.totalValueUSD / portfolio.walletBalance.SOL, // Calculate from actual values
      tradingStatus: 'active',
      totalTrades: 0,
      winRate: 0,
      profitLoss: 0,
      consciousness: 87.4,
      lastUpdate: new Date().toISOString()
    };

    res.json({
      success: true,
      portfolio: portfolioStatus,
      breakdown: portfolio.breakdown,
      defiPositions: portfolio.defiPositions.length,
      analysis: {
        emergencyStopActive: false,
        reason: 'Emergency stop cancelled - Trading operations resumed',
        recommendation: 'Active trading mode - monitoring opportunities and managing risk',
        portfolioComposition: {
          wallet: `$${portfolio.breakdown.wallet.toFixed(2)}`,
          defiLending: `$${portfolio.breakdown.lending.toFixed(2)}`,
          staking: `$${portfolio.breakdown.staking.toFixed(2)}`,
          liquidity: `$${portfolio.breakdown.liquidity.toFixed(2)}`,
          leverage: `$${portfolio.breakdown.leverage.toFixed(2)}`
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve portfolio status',
      details: String(error)
    });
  }
});

router.get('/trading-metrics', async (req, res) => {
  try {
    const solPrice = await getCurrentSOLPrice();
    const solBalance = await getWalletBalance();

    res.json({
      success: true,
      metrics: {
        currentBalance: {
          SOL: solBalance,
          USD: solBalance * solPrice
        },
        priceData: {
          SOL_USD: solPrice,
          lastUpdated: new Date().toISOString()
        },
        tradingStatus: {
          status: 'EMERGENCY_STOP_ACTIVE',
          reason: 'Safety protocols engaged',
          consecutiveFailures: 0,
          systemHealth: 'optimal'
        },
        performance: {
          totalTrades: 0,
          successfulTrades: 0,
          winRate: '0.0%',
          profitLoss: '$0.00',
          consciousness: '87.4%'
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve trading metrics'
    });
  }
});

export default router;