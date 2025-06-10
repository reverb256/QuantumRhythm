/**
 * AI Parameter Insights API Routes
 * Provides monitoring and analytics for the parameter optimization system
 */

import { Router } from 'express';
import { aiParameterOptimizer } from '../ai-parameter-optimizer.js';

const router = Router();

// Get optimization insights
router.get('/optimization-insights', async (req, res) => {
  try {
    const insights = aiParameterOptimizer.getOptimizationInsights();
    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Parameter insights error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get usage pattern insights
router.get('/usage-patterns', async (req, res) => {
  try {
    const patterns = aiParameterOptimizer.getUsagePatternInsights();
    res.json({
      success: true,
      patterns
    });
  } catch (error) {
    console.error('Usage patterns error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get performance insights
router.get('/performance', async (req, res) => {
  try {
    const performance = aiParameterOptimizer.getPerformanceInsights();
    res.json({
      success: true,
      performance
    });
  } catch (error) {
    console.error('Performance insights error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get optimal parameters for specific situation
router.post('/discover-parameters', async (req, res) => {
  try {
    const { content, systemPrompt, situationType } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }
    
    const optimization = await aiParameterOptimizer.discoverOptimalParameters(
      content,
      systemPrompt,
      situationType
    );
    
    res.json({
      success: true,
      optimization
    });
  } catch (error) {
    console.error('Parameter discovery error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Manual performance feedback
router.post('/record-performance', async (req, res) => {
  try {
    const { 
      model, 
      situation, 
      parameters, 
      performance, 
      usageContext 
    } = req.body;
    
    if (!model || !situation || !parameters || !performance) {
      return res.status(400).json({
        success: false,
        error: 'Model, situation, parameters, and performance are required'
      });
    }
    
    aiParameterOptimizer.recordPerformance(
      model,
      situation,
      parameters,
      performance,
      usageContext
    );
    
    res.json({
      success: true,
      message: 'Performance recorded successfully'
    });
  } catch (error) {
    console.error('Performance recording error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;