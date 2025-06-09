// IO Intelligence API routes with comprehensive security and rate limiting
import { Router } from 'express';
import { z } from 'zod';
import { IOIntelligenceOrchestrator } from '../io-intelligence.js';

const router = Router();

// Input validation schemas
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().min(1).max(50000)
  })).min(1).max(50),
  taskType: z.string().optional(),
  maxTokens: z.number().positive().max(4000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  model: z.string().optional()
});

const TaskRequestSchema = z.object({
  type: z.enum(['reasoning', 'summarization', 'sentiment_analysis', 'translation', 'code_generation', 'data_extraction']),
  description: z.string().min(1).max(1000),
  input: z.string().min(1).max(50000),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional()
});

// Rate limiting map (in production, use Redis or Cloudflare KV)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientIP: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = clientIP;
  const existing = rateLimitMap.get(key);
  
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (existing.count >= limit) {
    return false;
  }
  
  existing.count++;
  return true;
}

// Initialize orchestrator
let orchestrator: IOIntelligenceOrchestrator | null = null;

function getOrchestrator(): IOIntelligenceOrchestrator {
  if (!orchestrator) {
    const apiKey = process.env.IO_INTELLIGENCE_API_KEY;
    if (!apiKey) {
      throw new Error('IO_INTELLIGENCE_API_KEY not configured');
    }
    orchestrator = new IOIntelligenceOrchestrator(apiKey);
  }
  return orchestrator;
}

// Middleware for authentication and rate limiting
router.use((req, res, next) => {
  // Get client IP
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Rate limiting
  if (!checkRateLimit(clientIP, 100, 60000)) { // 100 requests per minute
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests, please try again later'
    });
  }
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
});

// GET /api/io-intelligence/models - Discover available models
router.get('/models', async (req, res) => {
  try {
    const orch = getOrchestrator();
    const models = orch.getAvailableModels();
    
    res.json({
      success: true,
      models: models.map(model => ({
        id: model.id,
        owned_by: model.owned_by,
        created: model.created
      })),
      count: models.length
    });
  } catch (error) {
    console.error('Models discovery error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to discover models'
    });
  }
});

// GET /api/io-intelligence/status - Get system status and rate limits
router.get('/status', async (req, res) => {
  try {
    const orch = getOrchestrator();
    const rateLimits = orch.getRateLimitStatus();
    const insights = orch.getRecentInsights(5);
    const taskQueue = orch.getTaskQueue();
    
    res.json({
      success: true,
      status: 'operational',
      rateLimits: rateLimits.map(limit => ({
        model: limit.model,
        remainingTokens: limit.remainingTokens,
        dailyQuota: limit.dailyQuota,
        resetTime: limit.resetTime
      })),
      insights: insights.map(insight => ({
        type: insight.insight_type,
        description: insight.description,
        confidence: insight.confidence,
        timestamp: insight.timestamp
      })),
      taskQueue: {
        pending: taskQueue.filter(t => t.status === 'pending').length,
        running: taskQueue.filter(t => t.status === 'running').length,
        completed: taskQueue.filter(t => t.status === 'completed').length,
        failed: taskQueue.filter(t => t.status === 'failed').length
      }
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get system status'
    });
  }
});

// POST /api/io-intelligence/chat - Chat completion
router.post('/chat', async (req, res) => {
  try {
    // Validate request body
    const validatedRequest = ChatRequestSchema.parse(req.body);
    
    const orch = getOrchestrator();
    
    // Execute completion
    const result = await orch.executeCompletion({
      messages: validatedRequest.messages,
      taskType: validatedRequest.taskType,
      maxTokens: validatedRequest.maxTokens,
      temperature: validatedRequest.temperature,
      model: validatedRequest.model
    });
    
    res.json({
      success: true,
      content: result.content,
      model: result.model,
      tokensUsed: result.tokensUsed,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat completion error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid request format',
        details: error.errors
      });
    }
    
    if (error instanceof Error && error.message.includes('Rate limit')) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process chat completion'
    });
  }
});

export default router;