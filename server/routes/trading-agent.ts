// Trading Agent Management API Routes
import { Router } from 'express';
import { z } from 'zod';
import { AutonomousTradingAgent } from '../permanent-trading-agent.js';
import { db } from '../db.js';
import { tradingAgents, tradingSignals, vibeCodingMetrics } from '../../shared/schema.js';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// Global agent instance
let globalAgent: AutonomousTradingAgent | null = null;
const AGENT_ID = '550e8400-e29b-41d4-a716-446655440000'; // Valid UUID for VibeCoding Quantum Agent

// Input validation schemas
const AgentConfigSchema = z.object({
  riskTolerance: z.number().min(0).max(1),
  maxPositionSize: z.number().min(0).max(1),
  targetTokens: z.array(z.string()),
  enabledDataSources: z.array(z.string()),
  vibeCodingWeights: z.object({
    pizzaKitchen: z.number().min(0).max(1),
    rhythmGaming: z.number().min(0).max(1),
    vrChatSocial: z.number().min(0).max(1),
    classicalPhilosophy: z.number().min(0).max(1)
  }),
  tradingRules: z.object({
    minConfidence: z.number().min(0).max(1),
    maxDailyTrades: z.number().positive(),
    stopLossPercentage: z.number().min(0).max(1),
    takeProfitPercentage: z.number().min(0).max(1)
  })
});

// Initialize agent on module load
async function initializeGlobalAgent() {
  if (!globalAgent) {
    globalAgent = new AutonomousTradingAgent(AGENT_ID);
    console.log('🤖 Global Trading Agent initialized');
  }
}

// Initialize immediately
initializeGlobalAgent();

// GET /api/trading-agent/status - Get agent status
router.get('/status', async (req, res) => {
  try {
    if (!globalAgent) {
      return res.status(503).json({
        error: 'Agent not initialized',
        message: 'Trading agent is not running'
      });
    }

    const status = await globalAgent.getAgentStatus();
    
    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Agent status error:', error);
    res.status(500).json({
      error: 'Failed to get agent status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/trading-agent/start - Start or resume agent
router.post('/start', async (req, res) => {
  try {
    if (!globalAgent) {
      globalAgent = new AutonomousTradingAgent(AGENT_ID);
    } else {
      await globalAgent.resumeAgent();
    }

    res.json({
      success: true,
      message: 'Trading agent started successfully',
      agentId: AGENT_ID,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Agent start error:', error);
    res.status(500).json({
      error: 'Failed to start agent',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/trading-agent/pause - Pause agent
router.post('/pause', async (req, res) => {
  try {
    if (!globalAgent) {
      return res.status(404).json({
        error: 'Agent not found',
        message: 'No active trading agent to pause'
      });
    }

    await globalAgent.pauseAgent();

    res.json({
      success: true,
      message: 'Trading agent paused successfully',
      agentId: AGENT_ID,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Agent pause error:', error);
    res.status(500).json({
      error: 'Failed to pause agent',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/trading-agent/signals - Get recent trading signals
router.get('/signals', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const signals = await db.select()
      .from(tradingSignals)
      .where(eq(tradingSignals.agentId, AGENT_ID))
      .orderBy(desc(tradingSignals.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      success: true,
      signals,
      pagination: {
        limit,
        offset,
        total: signals.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Signals retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve signals',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/trading-agent/metrics - Get VibeCoding methodology metrics
router.get('/metrics', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    
    const metrics = await db.select()
      .from(vibeCodingMetrics)
      .where(eq(vibeCodingMetrics.agentId, AGENT_ID))
      .orderBy(desc(vibeCodingMetrics.timestamp))
      .limit(limit);

    // Calculate averages
    const avgMetrics = metrics.reduce((acc, metric) => {
      acc.pizzaKitchen += Number(metric.pizzaKitchenReliability);
      acc.rhythmGaming += Number(metric.rhythmGamingPrecision);
      acc.vrChatSocial += Number(metric.vrChatSocialInsights);
      acc.classicalPhilosophy += Number(metric.classicalPhilosophyWisdom);
      acc.overall += Number(metric.overallScore);
      return acc;
    }, {
      pizzaKitchen: 0,
      rhythmGaming: 0,
      vrChatSocial: 0,
      classicalPhilosophy: 0,
      overall: 0
    });

    if (metrics.length > 0) {
      Object.keys(avgMetrics).forEach(key => {
        avgMetrics[key as keyof typeof avgMetrics] /= metrics.length;
      });
    }

    res.json({
      success: true,
      metrics,
      averages: avgMetrics,
      methodology: {
        pizzaKitchen: 'Consistent reliability under market pressure',
        rhythmGaming: 'Microsecond-accurate timing and precision',
        vrChatSocial: 'Social sentiment and community dynamics understanding',
        classicalPhilosophy: 'Long-term strategic thinking and ethical considerations'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Metrics retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/trading-agent/config - Update agent configuration
router.put('/config', async (req, res) => {
  try {
    const validatedConfig = AgentConfigSchema.parse(req.body);

    // Update agent configuration in database
    await db.update(tradingAgents)
      .set({
        configuration: validatedConfig,
        updatedAt: new Date()
      })
      .where(eq(tradingAgents.id, AGENT_ID));

    res.json({
      success: true,
      message: 'Agent configuration updated successfully',
      config: validatedConfig,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Config update error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid configuration format',
        details: error.errors
      });
    }

    res.status(500).json({
      error: 'Failed to update configuration',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/trading-agent/performance - Get agent performance summary
router.get('/performance', async (req, res) => {
  try {
    const [agent] = await db.select().from(tradingAgents).where(eq(tradingAgents.id, AGENT_ID));
    
    if (!agent) {
      return res.status(404).json({
        error: 'Agent not found',
        message: 'Trading agent not found in database'
      });
    }

    // Get recent signals for performance calculation
    const recentSignals = await db.select()
      .from(tradingSignals)
      .where(eq(tradingSignals.agentId, AGENT_ID))
      .orderBy(desc(tradingSignals.createdAt))
      .limit(100);

    const performance = {
      agent: {
        id: agent.id,
        name: agent.name,
        status: agent.status,
        lastActivity: agent.lastActivity,
        performanceMetrics: agent.performanceMetrics
      },
      recentActivity: {
        totalSignals: recentSignals.length,
        executedSignals: recentSignals.filter(s => s.executed).length,
        avgConfidence: recentSignals.reduce((sum, s) => sum + Number(s.confidence), 0) / recentSignals.length || 0,
        avgVibeCodingScore: recentSignals.reduce((sum, s) => sum + Number(s.vibeCodingScore), 0) / recentSignals.length || 0,
      },
      vibeCodingMethodology: 'Integrating pizza kitchen reliability, rhythm gaming precision, VRChat social insights, and classical philosophical wisdom'
    };

    res.json({
      success: true,
      performance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Performance retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve performance data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/trading-agent/insights - Get trading insights and analysis
router.get('/insights', async (req, res) => {
  try {
    // Get recent trading signals with analysis
    const signals = await db.select()
      .from(tradingSignals)
      .where(eq(tradingSignals.agentId, AGENT_ID))
      .orderBy(desc(tradingSignals.createdAt))
      .limit(10);

    // Get recent VibeCoding metrics
    const metrics = await db.select()
      .from(vibeCodingMetrics)
      .where(eq(vibeCodingMetrics.agentId, AGENT_ID))
      .orderBy(desc(vibeCodingMetrics.timestamp))
      .limit(5);

    const insights = {
      recentSignals: signals.map(signal => ({
        type: signal.signalType,
        confidence: Number(signal.confidence),
        vibeCodingScore: Number(signal.vibeCodingScore),
        reasoning: JSON.parse(signal.reasoning || '[]'),
        timestamp: signal.createdAt
      })),
      vibeCodingTrends: metrics.map(metric => ({
        pizzaKitchen: Number(metric.pizzaKitchenReliability),
        rhythmGaming: Number(metric.rhythmGamingPrecision),
        vrChatSocial: Number(metric.vrChatSocialInsights),
        classicalPhilosophy: Number(metric.classicalPhilosophyWisdom),
        overall: Number(metric.overallScore),
        timestamp: metric.timestamp
      })),
      marketIntelligence: {
        dataSourcesActive: ['RSS feeds', 'On-chain monitoring', 'Jupiter API', 'Birdeye API', 'News sentiment', 'Social analysis'],
        analysisFramework: 'VibeCoding Quantum Methodology',
        updateFrequency: 'Real-time for on-chain, 30s for market data, 5min for RSS'
      }
    };

    res.json({
      success: true,
      insights,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Insights retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve insights',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;