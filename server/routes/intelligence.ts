/**
 * Intelligence & Expansion API Routes
 */

import { Router } from 'express';
import { intelligentOpportunityScanner } from '../intelligent-opportunity-scanner';
import { autonomousExpansionEngine } from '../autonomous-expansion-engine';
import { yieldActivationEngine } from '../yield-activation-engine';
import { autonomousWalletManager } from '../autonomous-wallet-manager';
import { freeStaticHyperscaler } from '../free-static-hyperscaler';

const router = Router();

// Get current opportunity scanning status
router.get('/opportunities', async (req, res) => {
  try {
    const status = await intelligentOpportunityScanner.getOpportunityStatus();
    res.json({
      success: true,
      intelligence: {
        scanning: status.scanning,
        totalOpportunities: status.totalOpportunities,
        deployableOpportunities: status.deployableOpportunities,
        totalDeployed: status.totalDeployed,
        projectedAnnualReturn: status.projectedAnnualReturn,
        lastScan: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get opportunity status'
    });
  }
});

// Get expansion engine status
router.get('/expansion', async (req, res) => {
  try {
    const status = await autonomousExpansionEngine.getExpansionStatus();
    res.json({
      success: true,
      expansion: {
        expansionActive: status.expansionActive,
        explorationRadius: status.explorationRadius,
        totalOpportunities: status.totalOpportunities,
        breakdown: {
          crossChain: status.crossChainOpportunities,
          emerging: status.emergingProtocols,
          arbitrage: status.arbitrageOpportunities
        },
        riskAllocation: status.riskAllocation,
        lastExpansion: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get expansion status'
    });
  }
});

// Get yield projections
router.get('/yield-projections', async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const projections = await yieldActivationEngine.getProjectedPortfolioValue(days);
    
    res.json({
      success: true,
      projections: {
        timeframe: `${days} days`,
        currentValue: projections.currentValue,
        projectedValue: projections.projectedValue,
        totalGains: projections.totalGains,
        roi: projections.roi,
        calculatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate yield projections'
    });
  }
});

// Get autonomous wallet status
router.get('/wallets', async (req, res) => {
  try {
    const walletStatus = await autonomousWalletManager.getWalletStatus();
    res.json({
      success: true,
      autonomous_wallets: {
        total_wallets: walletStatus.totalWallets,
        active_wallets: walletStatus.activeWallets,
        total_allocation: walletStatus.totalAllocation,
        wallet_breakdown: walletStatus.purposes,
        top_performer: walletStatus.topPerformer ? {
          purpose: walletStatus.topPerformer.purpose,
          return: walletStatus.topPerformer.performance.totalReturn,
          win_rate: walletStatus.topPerformer.performance.winRate,
          trades: walletStatus.topPerformer.performance.trades
        } : null,
        last_update: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet status'
    });
  }
});

// Get hyperscale deployment status
router.get('/hyperscale', async (req, res) => {
  try {
    const hyperscaleStatus = freeStaticHyperscaler.getHyperscaleStatus();
    res.json({
      success: true,
      hyperscale: {
        builds_generated: hyperscaleStatus.builds,
        cdn_providers: hyperscaleStatus.providers,
        total_assets: hyperscaleStatus.totalAssets,
        optimizations: hyperscaleStatus.optimizations,
        deployment_ready: hyperscaleStatus.deploymentReady,
        supported_platforms: [
          'Vercel (Serverless Functions)',
          'Netlify (Edge Functions)', 
          'GitHub Pages (Static)',
          'Cloudflare Pages (Workers)'
        ],
        cost_optimization: 'Free tier maximization across all providers',
        last_update: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get hyperscale status'
    });
  }
});

// Get comprehensive AI status
router.get('/status', async (req, res) => {
  try {
    const [opportunityStatus, expansionStatus, walletStatus, hyperscaleStatus] = await Promise.all([
      intelligentOpportunityScanner.getOpportunityStatus(),
      autonomousExpansionEngine.getExpansionStatus(),
      autonomousWalletManager.getWalletStatus(),
      Promise.resolve(freeStaticHyperscaler.getHyperscaleStatus())
    ]);

    const projection30 = await yieldActivationEngine.getProjectedPortfolioValue(30);
    const projection365 = await yieldActivationEngine.getProjectedPortfolioValue(365);

    res.json({
      success: true,
      ai_intelligence: {
        systems_active: 5,
        opportunity_scanning: opportunityStatus.scanning,
        autonomous_expansion: expansionStatus.expansionActive,
        yield_generation: true,
        wallet_management: true,
        static_hyperscaling: true,
        intelligence_summary: {
          total_opportunities_tracked: opportunityStatus.totalOpportunities + expansionStatus.totalOpportunities,
          deployable_opportunities: opportunityStatus.deployableOpportunities,
          exploration_radius: expansionStatus.explorationRadius,
          risk_allocation: expansionStatus.riskAllocation,
          autonomous_wallets: walletStatus.activeWallets,
          hyperscale_builds: hyperscaleStatus.builds
        },
        performance_projections: {
          monthly_return: projection30.totalGains,
          annual_return: projection365.totalGains,
          roi_30_days: projection30.roi,
          roi_365_days: projection365.roi
        },
        autonomous_capabilities: {
          wallet_creation: 'Active - Creates specialized wallets for different strategies',
          opportunity_execution: 'Active - Automatically deploys capital at 75%+ confidence',
          cross_chain_expansion: 'Active - Bridges to Ethereum, Arbitrum, Base, Polygon',
          static_deployment: 'Ready - 4 CDN providers configured with free tiers',
          risk_management: 'Active - Dynamic allocation based on market conditions'
        },
        last_update: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get AI intelligence status'
    });
  }
});

export default router;