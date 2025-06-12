/**
 * Portfolio API Routes
 * Provides comprehensive portfolio data including DeFi positions
 */

import { Router } from 'express';
import { comprehensivePortfolioTracker } from '../comprehensive-portfolio-tracker';
import { db } from '../db';

const router = Router();

// Get current comprehensive portfolio status
router.get('/status', async (req, res) => {
  try {
    const portfolio = await comprehensivePortfolioTracker.getComprehensivePortfolio();
    res.json({
      success: true,
      portfolio: {
        totalValueUSD: portfolio.totalValueUSD,
        breakdown: portfolio.breakdown,
        positions: portfolio.defiPositions.length,
        walletBalance: portfolio.walletBalance,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Portfolio status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get portfolio status'
    });
  }
});

// Get detailed DeFi positions
router.get('/positions', async (req, res) => {
  try {
    const portfolio = await comprehensivePortfolioTracker.getComprehensivePortfolio();
    res.json({
      success: true,
      data: {
        positions: portfolio.defiPositions,
        totalValueUSD: portfolio.totalValueUSD,
        breakdown: portfolio.breakdown
      }
    });
  } catch (error) {
    console.error('Portfolio positions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get portfolio positions'
    });
  }
});

// Get portfolio history from snapshots
router.get('/history', async (req, res) => {
  try {
    const { timeframe = '24h' } = req.query;
    
    let hoursBack = 24;
    if (timeframe === '7d') hoursBack = 168;
    if (timeframe === '30d') hoursBack = 720;
    
    const snapshots = await db.execute(`
      SELECT * FROM portfolio_snapshots 
      WHERE timestamp >= NOW() - INTERVAL '${hoursBack} hours'
      ORDER BY timestamp ASC
    `);
    
    res.json({
      success: true,
      data: {
        snapshots: snapshots.rows,
        timeframe,
        count: snapshots.rows.length
      }
    });
  } catch (error) {
    console.error('Portfolio history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get portfolio history'
    });
  }
});

// Get portfolio performance metrics
router.get('/performance', async (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    let hoursBack = 24;
    if (period === '7d') hoursBack = 168;
    if (period === '30d') hoursBack = 720;
    
    const performance = await db.execute(`
      WITH latest AS (
        SELECT * FROM portfolio_snapshots 
        ORDER BY timestamp DESC LIMIT 1
      ),
      historical AS (
        SELECT * FROM portfolio_snapshots 
        WHERE timestamp <= NOW() - INTERVAL '${hoursBack} hours'
        ORDER BY timestamp DESC LIMIT 1
      )
      SELECT 
        l.total_value_usd as current_value,
        h.total_value_usd as historical_value,
        (l.total_value_usd - h.total_value_usd) as absolute_change,
        CASE 
          WHEN h.total_value_usd > 0 
          THEN ((l.total_value_usd - h.total_value_usd) / h.total_value_usd) * 100 
          ELSE 0 
        END as percentage_change
      FROM latest l, historical h
    `);
    
    res.json({
      success: true,
      data: {
        period,
        performance: performance.rows[0] || {
          current_value: 0,
          historical_value: 0,
          absolute_change: 0,
          percentage_change: 0
        }
      }
    });
  } catch (error) {
    console.error('Portfolio performance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get portfolio performance'
    });
  }
});

// Get protocol breakdown (DeFi allocation)
router.get('/protocols', async (req, res) => {
  try {
    const portfolio = await comprehensivePortfolioTracker.getComprehensivePortfolio();
    
    const protocolBreakdown = portfolio.defiPositions.reduce((acc, position) => {
      if (!acc[position.protocol]) {
        acc[position.protocol] = {
          totalValue: 0,
          positions: 0,
          types: new Set()
        };
      }
      
      acc[position.protocol].totalValue += position.valueUSD;
      acc[position.protocol].positions += 1;
      acc[position.protocol].types.add(position.type);
      
      return acc;
    }, {} as Record<string, any>);
    
    // Convert Set to Array for JSON serialization
    Object.keys(protocolBreakdown).forEach(protocol => {
      protocolBreakdown[protocol].types = Array.from(protocolBreakdown[protocol].types);
    });
    
    res.json({
      success: true,
      data: {
        protocols: protocolBreakdown,
        totalProtocols: Object.keys(protocolBreakdown).length,
        totalPositions: portfolio.defiPositions.length
      }
    });
  } catch (error) {
    console.error('Protocol breakdown error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get protocol breakdown'
    });
  }
});

export default router;