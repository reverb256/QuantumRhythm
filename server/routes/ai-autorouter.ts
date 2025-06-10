/**
 * AI Autorouter API Routes
 * Provides intelligent model routing endpoints for OWUI, void, and other agents
 */

import { Router } from 'express';
import { aiAutorouter } from '../ai-autorouter.js';
import { z } from 'zod';

const router = Router();

// Request validation schemas
const routingRequestSchema = z.object({
  content: z.string().min(1),
  contentType: z.enum(['text', 'code', 'image', 'audio', 'analysis', 'creative', 'technical']).default('text'),
  intent: z.enum(['generate', 'analyze', 'summarize', 'debug', 'optimize', 'explain', 'translate']).default('generate'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  context: z.string().optional(),
  maxTokens: z.number().min(1).max(200000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  agentId: z.string().optional()
});

const batchRequestSchema = z.object({
  requests: z.array(routingRequestSchema).min(1).max(10),
  parallelExecution: z.boolean().default(false)
});

/**
 * POST /api/ai/route - Route single request to optimal AI model
 */
router.post('/route', async (req, res) => {
  try {
    const validatedRequest = routingRequestSchema.parse(req.body);
    
    console.log(`🎯 AI Autorouter: Processing ${validatedRequest.intent} request for ${validatedRequest.contentType} content`);
    
    const response = await aiAutorouter.routeRequest(validatedRequest);
    
    res.json({
      success: true,
      data: response,
      metadata: {
        routingConfidence: response.confidence,
        estimatedSavings: calculateCostSavings(response),
        processingTime: response.processingTime
      }
    });

  } catch (error) {
    console.error('AI routing error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown routing error',
      fallback: 'Request could not be processed'
    });
  }
});

/**
 * POST /api/ai/route/batch - Route multiple requests (sequential or parallel)
 */
router.post('/route/batch', async (req, res) => {
  try {
    const { requests, parallelExecution } = batchRequestSchema.parse(req.body);
    
    console.log(`🔄 Processing batch of ${requests.length} requests (${parallelExecution ? 'parallel' : 'sequential'})`);
    
    const startTime = Date.now();
    let responses;

    if (parallelExecution) {
      // Execute all requests in parallel
      responses = await Promise.allSettled(
        requests.map(request => aiAutorouter.routeRequest(request))
      );
    } else {
      // Execute requests sequentially
      responses = [];
      for (const request of requests) {
        try {
          const response = await aiAutorouter.routeRequest(request);
          responses.push({ status: 'fulfilled', value: response });
        } catch (error) {
          responses.push({ status: 'rejected', reason: error });
        }
      }
    }

    const totalTime = Date.now() - startTime;
    const successCount = responses.filter(r => r.status === 'fulfilled').length;
    const totalCost = responses
      .filter(r => r.status === 'fulfilled')
      .reduce((sum, r) => sum + (r.value as any).cost, 0);

    res.json({
      success: true,
      data: responses,
      metadata: {
        totalRequests: requests.length,
        successfulRequests: successCount,
        failedRequests: requests.length - successCount,
        totalProcessingTime: totalTime,
        totalCost: totalCost,
        avgCostPerRequest: totalCost / successCount || 0
      }
    });

  } catch (error) {
    console.error('Batch routing error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Batch processing failed'
    });
  }
});

/**
 * GET /api/ai/models - Get available models and their capabilities
 */
router.get('/models', (req, res) => {
  try {
    const systemStatus = aiAutorouter.getSystemStatus();
    
    res.json({
      success: true,
      data: {
        systemStatus,
        models: getModelCapabilities(),
        recommendations: getGeneralRecommendations()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve model information'
    });
  }
});

/**
 * GET /api/ai/agent/:agentId/recommendations - Get personalized recommendations for agent
 */
router.get('/agent/:agentId/recommendations', (req, res) => {
  try {
    const { agentId } = req.params;
    const recommendations = aiAutorouter.getAgentRecommendations(agentId);
    
    res.json({
      success: true,
      data: {
        agentId,
        recommendations,
        optimizations: generateOptimizationSuggestions(recommendations)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate agent recommendations'
    });
  }
});

/**
 * POST /api/ai/analyze - Analyze content and suggest optimal routing strategy
 */
router.post('/analyze', async (req, res) => {
  try {
    const { content, context } = z.object({
      content: z.string().min(1),
      context: z.string().optional()
    }).parse(req.body);

    // Analyze content characteristics
    const analysis = analyzeContentCharacteristics(content);
    
    // Get routing suggestions
    const suggestions = await generateRoutingSuggestions(content, context, analysis);
    
    res.json({
      success: true,
      data: {
        contentAnalysis: analysis,
        routingSuggestions: suggestions,
        estimatedCosts: calculateEstimatedCosts(suggestions),
        expectedPerformance: estimatePerformanceMetrics(suggestions)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Content analysis failed'
    });
  }
});

/**
 * GET /api/ai/status - Get system health and performance metrics
 */
router.get('/status', (req, res) => {
  try {
    const status = aiAutorouter.getSystemStatus();
    const health = determineSystemHealth(status);
    
    res.json({
      success: true,
      data: {
        ...status,
        health,
        uptime: process.uptime(),
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve system status'
    });
  }
});

/**
 * Helper Functions
 */

function calculateCostSavings(response: any): number {
  // Calculate potential savings compared to using most expensive model
  const maxCost = 0.00002 * response.tokensUsed; // Assume GPT-4 rate
  return Math.max(0, maxCost - response.cost);
}

function getModelCapabilities() {
  return [
    {
      name: 'claude-sonnet-4-20250514',
      provider: 'anthropic',
      strengths: ['Complex reasoning', 'Code analysis', 'Safety-critical tasks'],
      bestFor: ['Technical analysis', 'Code debugging', 'Complex problem solving'],
      costTier: 'premium',
      speed: 'medium'
    },
    {
      name: 'claude-3-7-sonnet-20250219',
      provider: 'anthropic',
      strengths: ['Speed', 'General purpose', 'Efficiency'],
      bestFor: ['General tasks', 'Quick responses', 'Content generation'],
      costTier: 'standard',
      speed: 'fast'
    },
    {
      name: 'gpt-4o',
      provider: 'openai',
      strengths: ['Multimodal', 'Vision', 'Creativity'],
      bestFor: ['Image analysis', 'Creative writing', 'Multimodal tasks'],
      costTier: 'premium',
      speed: 'medium'
    },
    {
      name: 'gpt-4o-mini',
      provider: 'openai',
      strengths: ['Speed', 'Cost-effective', 'Lightweight'],
      bestFor: ['Quick tasks', 'Cost optimization', 'Simple queries'],
      costTier: 'economy',
      speed: 'very fast'
    },
    {
      name: 'grok-2-1212',
      provider: 'xai',
      strengths: ['Real-time info', 'Current events', 'Web context'],
      bestFor: ['Current events', 'Real-time analysis', 'News interpretation'],
      costTier: 'standard',
      speed: 'medium'
    }
  ];
}

function getGeneralRecommendations() {
  return {
    costOptimization: {
      tip: 'Use gpt-4o-mini for simple tasks to minimize costs',
      potentialSavings: 'Up to 95% cost reduction vs premium models'
    },
    performance: {
      tip: 'Claude Sonnet 4 for complex reasoning, GPT-4o for multimodal tasks',
      expectedImprovement: '20-40% better accuracy for specialized tasks'
    },
    reliability: {
      tip: 'Enable fallback routing for critical applications',
      benefit: 'Maintains 99%+ uptime even with provider outages'
    }
  };
}

function generateOptimizationSuggestions(recommendations: any) {
  const suggestions = [];
  
  if (recommendations.avgCost > 0.001) {
    suggestions.push({
      type: 'cost',
      suggestion: 'Consider using more cost-effective models for routine tasks',
      potentialSavings: `${((recommendations.avgCost - 0.0005) * 100).toFixed(2)}% cost reduction`
    });
  }
  
  if (recommendations.avgLatency > 3000) {
    suggestions.push({
      type: 'performance',
      suggestion: 'Switch to faster models for time-sensitive operations',
      improvement: `${((recommendations.avgLatency - 1500) / recommendations.avgLatency * 100).toFixed(1)}% latency reduction`
    });
  }
  
  if (recommendations.successRate < 95) {
    suggestions.push({
      type: 'reliability',
      suggestion: 'Enable fallback routing to improve success rates',
      improvement: 'Up to 99% reliability with multi-model fallbacks'
    });
  }
  
  return suggestions;
}

function analyzeContentCharacteristics(content: string) {
  const characteristics = {
    length: content.length,
    complexity: 'medium',
    codeDetected: /```|function|class|import|def |npm |pip /.test(content),
    technicalTerms: /API|database|algorithm|framework|library|server/.test(content.toLowerCase()),
    creativeElements: /story|poem|creative|imagine|write|design/.test(content.toLowerCase()),
    analysisRequired: /analyze|examine|evaluate|assess|compare|review/.test(content.toLowerCase()),
    urgencyIndicators: /urgent|asap|immediately|critical|emergency/.test(content.toLowerCase())
  };
  
  // Determine complexity
  if (content.length > 5000 || characteristics.codeDetected || characteristics.technicalTerms) {
    characteristics.complexity = 'high';
  } else if (content.length < 500 && !characteristics.technicalTerms) {
    characteristics.complexity = 'low';
  }
  
  return characteristics;
}

async function generateRoutingSuggestions(content: string, context: string | undefined, analysis: any) {
  const suggestions = [];
  
  // Primary suggestion based on content analysis
  if (analysis.codeDetected) {
    suggestions.push({
      model: 'claude-sonnet-4-20250514',
      reason: 'Optimal for code analysis and debugging',
      confidence: 95,
      contentType: 'code',
      intent: 'analyze'
    });
  } else if (analysis.creativeElements) {
    suggestions.push({
      model: 'gpt-4o',
      reason: 'Excellent for creative content generation',
      confidence: 90,
      contentType: 'creative',
      intent: 'generate'
    });
  } else if (analysis.analysisRequired) {
    suggestions.push({
      model: 'claude-sonnet-4-20250514',
      reason: 'Superior analytical and reasoning capabilities',
      confidence: 92,
      contentType: 'analysis',
      intent: 'analyze'
    });
  } else {
    suggestions.push({
      model: 'claude-3-7-sonnet-20250219',
      reason: 'Fast and efficient for general-purpose tasks',
      confidence: 85,
      contentType: 'text',
      intent: 'generate'
    });
  }
  
  // Cost-optimized alternative
  if (analysis.complexity === 'low') {
    suggestions.push({
      model: 'gpt-4o-mini',
      reason: 'Cost-effective for simple tasks',
      confidence: 80,
      contentType: 'text',
      intent: 'generate',
      tag: 'cost-optimized'
    });
  }
  
  return suggestions;
}

function calculateEstimatedCosts(suggestions: any[]) {
  return suggestions.map(suggestion => ({
    model: suggestion.model,
    estimatedCost: suggestion.model.includes('mini') ? 0.0001 : 
                   suggestion.model.includes('gpt-4o') ? 0.002 : 0.0015,
    costTier: suggestion.model.includes('mini') ? 'economy' : 
              suggestion.model.includes('sonnet-4') ? 'premium' : 'standard'
  }));
}

function estimatePerformanceMetrics(suggestions: any[]) {
  return suggestions.map(suggestion => ({
    model: suggestion.model,
    estimatedLatency: suggestion.model.includes('mini') ? 800 : 
                     suggestion.model.includes('sonnet-4') ? 2000 : 1500,
    expectedAccuracy: suggestion.confidence,
    reliability: suggestion.model.includes('claude') ? 98 : 94
  }));
}

function determineSystemHealth(status: any) {
  if (status.availableModels >= 4 && status.avgLatency < 3000) {
    return { status: 'healthy', message: 'All systems operational' };
  } else if (status.availableModels >= 2) {
    return { status: 'degraded', message: 'Limited model availability' };
  } else {
    return { status: 'critical', message: 'System requires attention' };
  }
}

export default router;