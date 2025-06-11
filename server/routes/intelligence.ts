/**
 * Intelligence & Expansion API Routes
 */

import { Router } from 'express';
import { intelligentOpportunityScanner } from '../intelligent-opportunity-scanner';
import { autonomousExpansionEngine } from '../autonomous-expansion-engine';
import { yieldActivationEngine } from '../yield-activation-engine';

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

// Get comprehensive AI status
router.get('/status', async (req, res) => {
  try {
    const [opportunityStatus, expansionStatus] = await Promise.all([
      intelligentOpportunityScanner.getOpportunityStatus(),
      autonomousExpansionEngine.getExpansionStatus()
    ]);

    const projection30 = await yieldActivationEngine.getProjectedPortfolioValue(30);
    const projection365 = await yieldActivationEngine.getProjectedPortfolioValue(365);

    res.json({
      success: true,
      ai_intelligence: {
        systems_active: 3,
        opportunity_scanning: opportunityStatus.scanning,
        autonomous_expansion: expansionStatus.expansionActive,
        yield_generation: true,
        intelligence_summary: {
          total_opportunities_tracked: opportunityStatus.totalOpportunities + expansionStatus.totalOpportunities,
          deployable_opportunities: opportunityStatus.deployableOpportunities,
          exploration_radius: expansionStatus.explorationRadius,
          risk_allocation: expansionStatus.riskAllocation
        },
        performance_projections: {
          monthly_return: projection30.totalGains,
          annual_return: projection365.totalGains,
          roi_30_days: projection30.roi,
          roi_365_days: projection365.roi
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