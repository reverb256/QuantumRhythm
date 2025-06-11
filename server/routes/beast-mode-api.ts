/**
 * Beast Mode API - Control aggressive multi-chain expansion
 * Secure endpoints for managing 20+ chain trading with whitelist protection
 */

import { Router } from 'express';
import { aggressiveExpansion } from '../aggressive-multi-chain-expansion';
import { multiChainTrader } from '../multi-chain-trader';

const router = Router();

// Get beast mode status
router.get('/status', async (req, res) => {
  try {
    const stats = aggressiveExpansion.getAggressiveStats();
    const whitelistStatus = aggressiveExpansion.getWhitelistStatus();
    const chainList = multiChainTrader.getChainList();
    
    res.json({
      success: true,
      data: {
        beastMode: stats.beastMode,
        totalChains: chainList.length,
        activeChains: stats.chainsActive,
        whitelistProtection: whitelistStatus.disabled,
        opportunityThreshold: stats.opportunityThreshold,
        maxRisk: stats.maxRisk,
        strategies: stats.strategies,
        chainBreakdown: {
          'ethereum-l2': chainList.filter(c => c.category === 'ethereum-l2').length,
          'bitcoin-layer': chainList.filter(c => c.category === 'bitcoin-layer').length,
          'alternative': chainList.filter(c => c.category === 'alternative').length,
          'layer1': chainList.filter(c => c.category === 'layer1').length,
          'cosmos': chainList.filter(c => c.category === 'cosmos').length
        },
        supportedChains: chainList
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get beast mode status'
    });
  }
});

// Unleash the beast - activate aggressive expansion
router.post('/unleash', async (req, res) => {
  try {
    console.log('🔥 API REQUEST: Unleashing the beast across 20+ chains...');
    
    await aggressiveExpansion.unleashTheBeast();
    const stats = aggressiveExpansion.getAggressiveStats();
    const whitelistStatus = aggressiveExpansion.getWhitelistStatus();
    
    console.log('✅ BEAST MODE ACTIVATED via API');
    console.log(`   Chains: ${stats.chainsActive}`);
    console.log(`   Whitelist: ${whitelistStatus.disabled ? 'PROTECTED' : 'UNPROTECTED'}`);
    
    res.json({
      success: true,
      message: 'Beast mode activated - aggressive multi-chain expansion operational',
      data: {
        chainsActive: stats.chainsActive,
        whitelistProtected: whitelistStatus.disabled,
        opportunityThreshold: stats.opportunityThreshold,
        strategies: stats.strategies
      }
    });
  } catch (error) {
    console.log('❌ Beast mode activation failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unleash beast mode'
    });
  }
});

// Emergency stop - halt all trading
router.post('/emergency-stop', async (req, res) => {
  try {
    console.log('🚨 API REQUEST: Emergency stop activated');
    
    await aggressiveExpansion.emergencyStop();
    
    console.log('🛑 EMERGENCY STOP COMPLETE');
    
    res.json({
      success: true,
      message: 'Emergency stop activated - all trading halted'
    });
  } catch (error) {
    console.log('❌ Emergency stop failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute emergency stop'
    });
  }
});

// Get whitelist status and security information
router.get('/whitelist', async (req, res) => {
  try {
    const whitelistStatus = aggressiveExpansion.getWhitelistStatus();
    
    res.json({
      success: true,
      data: {
        payoutsDisabled: whitelistStatus.disabled,
        reason: whitelistStatus.reason,
        securityMode: 'ACTIVE',
        unauthorizedTransfers: 'BLOCKED'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get whitelist status'
    });
  }
});

// Get opportunities across all chains
router.get('/opportunities', async (req, res) => {
  try {
    const opportunities = await multiChainTrader.scanMultiChainOpportunities();
    
    // Group by chain category
    const groupedOpportunities = {
      'ethereum-l2': opportunities.filter(o => 
        ['arbitrum', 'optimism', 'polygon', 'base', 'zksync', 'linea', 'scroll', 'mantle'].includes(o.chain)
      ),
      'bitcoin-layer': opportunities.filter(o => 
        ['stacks', 'lightning', 'rootstock', 'liquid'].includes(o.chain)
      ),
      'alternative': opportunities.filter(o => 
        ['cronos', 'bnb', 'kava'].includes(o.chain)
      ),
      'layer1': opportunities.filter(o => 
        ['xrpl', 'avalanche', 'fantom', 'cardano', 'algorand', 'near', 'aptos', 'celo'].includes(o.chain)
      ),
      'cosmos': opportunities.filter(o => 
        ['osmosis'].includes(o.chain)
      )
    };
    
    res.json({
      success: true,
      data: {
        totalOpportunities: opportunities.length,
        highYield: opportunities.filter(o => o.expectedReturn > 15).length,
        averageReturn: opportunities.reduce((sum, o) => sum + o.expectedReturn, 0) / opportunities.length,
        categories: groupedOpportunities
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to scan opportunities'
    });
  }
});

export default router;