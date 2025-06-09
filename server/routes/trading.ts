import { Router } from 'express';
import { db } from '../db';
import { tradingAgents, tradingSignals, vibeCodingMetrics } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// Get trading agent status
router.get('/status', async (req, res) => {
  try {
    const agents = await db.select().from(tradingAgents).limit(1);
    
    if (agents.length === 0) {
      return res.json({
        name: 'vibecoding-quantum-agent',
        status: 'initializing',
        lastActivity: new Date().toISOString(),
        performanceMetrics: { successRate: 0 },
        configuration: { strategies: [], targetTokens: [] }
      });
    }

    const agent = agents[0];
    return res.json({
      name: agent.name,
      status: agent.status,
      lastActivity: agent.lastActivity,
      performanceMetrics: agent.performanceMetrics,
      configuration: agent.configuration
    });
  } catch (error) {
    console.error('Error fetching agent status:', error);
    return res.status(500).json({ error: 'Failed to get agent status' });
  }
});

// Get trading signals
router.get('/signals', async (req, res) => {
  try {
    const signals = await db
      .select()
      .from(tradingSignals)
      .orderBy(desc(tradingSignals.timestamp))
      .limit(10);

    return res.json(signals);
  } catch (error) {
    console.error('Error fetching trading signals:', error);
    return res.status(500).json({ error: 'Failed to get trading signals' });
  }
});

// Get VibeCoding metrics
router.get('/vibe-metrics', async (req, res) => {
  try {
    const metrics = await db
      .select()
      .from(vibeCodingMetrics)
      .orderBy(desc(vibeCodingMetrics.timestamp))
      .limit(1);

    if (metrics.length === 0) {
      return res.json({
        pizzaKitchenReliability: '0.85',
        rhythmGamingPrecision: '0.92',
        vrChatSocialInsights: '0.78',
        classicalPhilosophyWisdom: '0.88',
        overallScore: '0.86'
      });
    }

    return res.json(metrics[0]);
  } catch (error) {
    console.error('Error fetching VibeCoding metrics:', error);
    return res.status(500).json({ error: 'Failed to get VibeCoding metrics' });
  }
});

export default router;