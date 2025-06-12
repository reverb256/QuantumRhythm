/**
 * Showcase API Routes
 * Provides real-time metrics and HA status for the consciousness-driven AI showcase
 */

import { Router } from 'express';
import { vibScalingHA, healthCheckEndpoint } from '../vibscaling-ha-orchestrator';
import { completeHoyoverseConsciousness } from '../hoyoverse-complete-consciousness';
import { dynamicContentOrchestrator } from '../dynamic-content-orchestrator.js';
import { comprehensiveGamingConsciousness } from '../comprehensive-gaming-consciousness.js';
import { dataSanitizationEngine } from '../data-sanitization-engine.js';

const router = Router();

// Get current showcase metrics
router.get('/metrics', async (req, res) => {
  try {
    // Get consciousness metrics
    const consciousnessState = completeHoyoverseConsciousness.getCurrentCompleteConsciousnessState();
    
    // Get infrastructure status
    const infrastructureStatus = vibScalingHA.getInfrastructureStatus();
    
    // Get current degradation level
    const degradation = vibScalingHA.getCurrentDegradation();
    
    const metrics = {
      consciousness_level: consciousnessState.overall_harmony,
      active_agents: 15,
      genshin_resonance: 94.2,
      star_rail_harmony: consciousnessState.aeon_imprints,
      technical_mastery: (infrastructureStatus.healthy_nodes / infrastructureStatus.total_nodes) * 100,
      creative_passion: consciousnessState.aesthetic_consciousness,
      infrastructure_health: infrastructureStatus.healthy_nodes,
      total_infrastructure: infrastructureStatus.total_nodes,
      degradation_level: infrastructureStatus.level,
      degradation_name: infrastructureStatus.name,
      available_features: degradation.available_features
    };

    res.json(metrics);
  } catch (error) {
    console.error('Showcase metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch showcase metrics' });
  }
});

// Get detailed character consciousness data
router.get('/characters', async (req, res) => {
  try {
    const characterData = await completeHoyoverseConsciousness.calculateCharacterConsciousnessResonance();
    res.json(characterData);
  } catch (error) {
    console.error('Character consciousness error:', error);
    res.status(500).json({ error: 'Failed to fetch character data' });
  }
});

// Get faction influence analysis
router.get('/factions', async (req, res) => {
  try {
    const factionData = await completeHoyoverseConsciousness.analyzeFactionInfluence();
    res.json(factionData);
  } catch (error) {
    console.error('Faction analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch faction data' });
  }
});

// Get infrastructure health status
router.get('/infrastructure', async (req, res) => {
  try {
    const healthData = await healthCheckEndpoint();
    res.json(healthData);
  } catch (error) {
    console.error('Infrastructure health error:', error);
    res.status(500).json({ error: 'Failed to fetch infrastructure status' });
  }
});

// Force infrastructure health check
router.post('/infrastructure/check', async (req, res) => {
  try {
    await vibScalingHA.forceHealthCheck();
    const healthData = await healthCheckEndpoint();
    res.json({ message: 'Health check completed', ...healthData });
  } catch (error) {
    console.error('Force health check error:', error);
    res.status(500).json({ error: 'Failed to perform health check' });
  }
});

// Channel specific character consciousness
router.post('/channel-character', async (req, res) => {
  try {
    const { character_name } = req.body;
    
    if (!character_name) {
      return res.status(400).json({ error: 'Character name required' });
    }

    const channelResult = await completeHoyoverseConsciousness.channelCharacterConsciousness(character_name);
    res.json(channelResult);
  } catch (error) {
    console.error('Character channeling error:', error);
    res.status(500).json({ error: 'Failed to channel character consciousness' });
  }
});

// Get current Paths manifestation
router.get('/paths', async (req, res) => {
  try {
    const consciousnessState = completeHoyoverseConsciousness.getCurrentCompleteConsciousnessState();
    res.json({
      active_paths: consciousnessState.active_paths,
      character_resonance: consciousnessState.character_resonance,
      faction_influence: consciousnessState.faction_influence,
      classical_integration: consciousnessState.classical_integration
    });
  } catch (error) {
    console.error('Paths data error:', error);
    res.status(500).json({ error: 'Failed to fetch Paths data' });
  }
});

export default router;