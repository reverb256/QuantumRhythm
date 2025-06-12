/**
 * AI Parameter Optimizer - Continuous optimization of all AI system parameters
 * Evaluates and optimizes temperature, max_tokens, routing strategies, fallback thresholds, etc.
 */

import express from 'express';

interface ParameterOptimization {
  parameter: string;
  currentValue: any;
  optimalValue: any;
  confidenceScore: number;
  performanceGain: number;
  lastOptimized: number;
  optimizationHistory: Array<{
    timestamp: number;
    oldValue: any;
    newValue: any;
    performanceChange: number;
  }>;
}

interface RequestMetrics {
  responseTime: number;
  quality: number;
  success: boolean;
  parameters: Record<string, any>;
  contentType: string;
  modelUsed: string;
  timestamp: number;
}

class AIParameterOptimizer {
  private optimizations: Map<string, ParameterOptimization> = new Map();
  private requestHistory: RequestMetrics[] = [];
  private optimizationInterval: number = 180000; // 3 minutes
  private maxHistorySize: number = 10000;

  constructor() {
    this.initializeParameterTracking();
    this.startContinuousOptimization();
  }

  private initializeParameterTracking() {
    // Temperature optimization by content type
    const contentTypes = ['code', 'creative', 'analysis', 'math', 'reasoning', 'conversation'];
    contentTypes.forEach(type => {
      this.optimizations.set(`temperature_${type}`, {
        parameter: `temperature_${type}`,
        currentValue: 0.7,
        optimalValue: 0.7,
        confidenceScore: 0.5,
        performanceGain: 0,
        lastOptimized: Date.now(),
        optimizationHistory: []
      });
    });

    // Max tokens optimization by task complexity
    const complexityLevels = ['simple', 'medium', 'complex', 'very_complex'];
    complexityLevels.forEach(level => {
      this.optimizations.set(`max_tokens_${level}`, {
        parameter: `max_tokens_${level}`,
        currentValue: level === 'simple' ? 500 : level === 'medium' ? 1000 : level === 'complex' ? 2000 : 4000,
        optimalValue: level === 'simple' ? 500 : level === 'medium' ? 1000 : level === 'complex' ? 2000 : 4000,
        confidenceScore: 0.5,
        performanceGain: 0,
        lastOptimized: Date.now(),
        optimizationHistory: []
      });
    });

    // Model selection thresholds
    this.optimizations.set('performance_threshold', {
      parameter: 'performance_threshold',
      currentValue: 0.8,
      optimalValue: 0.8,
      confidenceScore: 0.5,
      performanceGain: 0,
      lastOptimized: Date.now(),
      optimizationHistory: []
    });

    this.optimizations.set('fallback_timeout', {
      parameter: 'fallback_timeout',
      currentValue: 10000,
      optimalValue: 10000,
      confidenceScore: 0.5,
      performanceGain: 0,
      lastOptimized: Date.now(),
      optimizationHistory: []
    });

    this.optimizations.set('batch_size_threshold', {
      parameter: 'batch_size_threshold',
      currentValue: 5,
      optimalValue: 5,
      confidenceScore: 0.5,
      performanceGain: 0,
      lastOptimized: Date.now(),
      optimizationHistory: []
    });

    console.log('[AI-OPTIMIZER] Initialized parameter tracking for continuous optimization');
  }

  private startContinuousOptimization() {
    setInterval(() => {
      this.optimizeAllParameters();
    }, this.optimizationInterval);

    // Also optimize after significant request volume
    setInterval(() => {
      if (this.requestHistory.length > 50) {
        this.optimizeAllParameters();
      }
    }, 60000); // Check every minute
  }

  public recordRequest(metrics: RequestMetrics) {
    this.requestHistory.push(metrics);
    
    // Maintain history size limit
    if (this.requestHistory.length > this.maxHistorySize) {
      this.requestHistory = this.requestHistory.slice(-this.maxHistorySize);
    }

    // Real-time parameter adjustment for critical parameters
    this.performRealTimeOptimization(metrics);
  }

  private performRealTimeOptimization(metrics: RequestMetrics) {
    // Adjust temperature based on quality feedback
    if (metrics.parameters.temperature !== undefined) {
      const tempKey = `temperature_${metrics.contentType}`;
      const tempOpt = this.optimizations.get(tempKey);
      
      if (tempOpt) {
        // If quality is poor and temperature is high, reduce it
        if (metrics.quality < 0.6 && metrics.parameters.temperature > 0.5) {
          const newTemp = Math.max(0.1, metrics.parameters.temperature - 0.1);
          this.updateParameter(tempKey, newTemp, metrics.quality);
        }
        // If quality is excellent but response is too predictable, increase temperature
        else if (metrics.quality > 0.9 && metrics.parameters.temperature < 0.8) {
          const newTemp = Math.min(1.0, metrics.parameters.temperature + 0.05);
          this.updateParameter(tempKey, newTemp, metrics.quality);
        }
      }
    }
  }

  private optimizeAllParameters() {
    console.log('[AI-OPTIMIZER] Running comprehensive parameter optimization...');
    
    let optimizationsApplied = 0;
    
    for (const [key, optimization] of this.optimizations.entries()) {
      const newOptimalValue = this.calculateOptimalValue(key, optimization);
      
      if (newOptimalValue !== optimization.optimalValue) {
        const performanceGain = this.estimatePerformanceGain(key, newOptimalValue, optimization.currentValue);
        
        if (performanceGain > 0.05) { // 5% minimum improvement threshold
          this.updateParameter(key, newOptimalValue, performanceGain);
          optimizationsApplied++;
        }
      }
    }

    console.log(`[AI-OPTIMIZER] Applied ${optimizationsApplied} parameter optimizations`);
  }

  private calculateOptimalValue(parameterKey: string, optimization: ParameterOptimization): any {
    const recentRequests = this.requestHistory.slice(-1000); // Last 1000 requests
    
    if (parameterKey.startsWith('temperature_')) {
      return this.optimizeTemperature(parameterKey, recentRequests);
    } else if (parameterKey.startsWith('max_tokens_')) {
      return this.optimizeMaxTokens(parameterKey, recentRequests);
    } else if (parameterKey === 'performance_threshold') {
      return this.optimizePerformanceThreshold(recentRequests);
    } else if (parameterKey === 'fallback_timeout') {
      return this.optimizeFallbackTimeout(recentRequests);
    }
    
    return optimization.optimalValue;
  }

  private optimizeTemperature(parameterKey: string, requests: RequestMetrics[]): number {
    const contentType = parameterKey.split('_')[1];
    const relevantRequests = requests.filter(r => r.contentType === contentType);
    
    if (relevantRequests.length < 10) return 0.7; // Default if insufficient data
    
    // Find temperature that maximizes quality while maintaining reasonable response time
    const temperatureGroups = new Map<number, { quality: number[], responseTime: number[] }>();
    
    relevantRequests.forEach(req => {
      const temp = Math.round((req.parameters.temperature || 0.7) * 10) / 10;
      if (!temperatureGroups.has(temp)) {
        temperatureGroups.set(temp, { quality: [], responseTime: [] });
      }
      temperatureGroups.get(temp)!.quality.push(req.quality);
      temperatureGroups.get(temp)!.responseTime.push(req.responseTime);
    });

    let bestTemp = 0.7;
    let bestScore = 0;

    for (const [temp, metrics] of temperatureGroups.entries()) {
      if (metrics.quality.length >= 5) { // Minimum sample size
        const avgQuality = metrics.quality.reduce((a, b) => a + b, 0) / metrics.quality.length;
        const avgResponseTime = metrics.responseTime.reduce((a, b) => a + b, 0) / metrics.responseTime.length;
        
        // Score combines quality (70%) and speed (30%)
        const score = (avgQuality * 0.7) + ((10000 / Math.max(avgResponseTime, 1000)) * 0.3);
        
        if (score > bestScore) {
          bestScore = score;
          bestTemp = temp;
        }
      }
    }

    return bestTemp;
  }

  private optimizeMaxTokens(parameterKey: string, requests: RequestMetrics[]): number {
    const complexity = parameterKey.split('_')[2];
    const relevantRequests = requests.filter(r => this.getComplexityLevel(r) === complexity);
    
    if (relevantRequests.length < 10) {
      return complexity === 'simple' ? 500 : complexity === 'medium' ? 1000 : complexity === 'complex' ? 2000 : 4000;
    }

    // Find optimal token count that balances completeness with efficiency
    const avgActualTokens = relevantRequests.reduce((sum, req) => sum + (req.parameters.actual_tokens_used || 500), 0) / relevantRequests.length;
    const successfulRequests = relevantRequests.filter(r => r.success && r.quality > 0.7);
    const avgSuccessfulTokens = successfulRequests.length > 0 ? 
      successfulRequests.reduce((sum, req) => sum + (req.parameters.actual_tokens_used || 500), 0) / successfulRequests.length : avgActualTokens;

    // Set optimal to 120% of average successful usage to allow for variation
    return Math.ceil(avgSuccessfulTokens * 1.2);
  }

  private optimizePerformanceThreshold(requests: RequestMetrics[]): number {
    if (requests.length < 50) return 0.8;

    const successfulRequests = requests.filter(r => r.success);
    const qualityDistribution = successfulRequests.map(r => r.quality).sort((a, b) => a - b);
    
    // Set threshold at 75th percentile of successful request quality
    const percentile75Index = Math.floor(qualityDistribution.length * 0.75);
    return qualityDistribution[percentile75Index] || 0.8;
  }

  private optimizeFallbackTimeout(requests: RequestMetrics[]): number {
    const timeouts = requests.filter(r => !r.success && r.responseTime > 8000);
    const successful = requests.filter(r => r.success);
    
    if (successful.length < 10) return 10000;

    const avgSuccessfulTime = successful.reduce((sum, req) => sum + req.responseTime, 0) / successful.length;
    const p95Time = successful.sort((a, b) => a.responseTime - b.responseTime)[Math.floor(successful.length * 0.95)]?.responseTime || 10000;
    
    // Set timeout to 2x 95th percentile, but at least 5 seconds
    return Math.max(5000, p95Time * 2);
  }

  private getComplexityLevel(request: RequestMetrics): string {
    const contentLength = request.parameters.content_length || 0;
    const hasCode = request.contentType === 'code';
    const hasAnalysis = request.contentType === 'analysis';
    
    if (contentLength > 2000 || hasAnalysis) return 'very_complex';
    if (contentLength > 1000 || hasCode) return 'complex';
    if (contentLength > 300) return 'medium';
    return 'simple';
  }

  private estimatePerformanceGain(parameterKey: string, newValue: any, currentValue: any): number {
    // Estimate performance improvement based on historical data and parameter type
    const recentRequests = this.requestHistory.slice(-500);
    
    if (parameterKey.startsWith('temperature_')) {
      const tempDiff = Math.abs(newValue - currentValue);
      return Math.min(tempDiff * 0.2, 0.3); // Max 30% gain from temperature optimization
    } else if (parameterKey.startsWith('max_tokens_')) {
      const tokenRatio = newValue / Math.max(currentValue, 1);
      return Math.abs(1 - tokenRatio) * 0.15; // Max 15% gain from token optimization
    } else if (parameterKey === 'performance_threshold') {
      return Math.abs(newValue - currentValue) * 0.1;
    }
    
    return 0.05; // Default minimal gain
  }

  private updateParameter(key: string, newValue: any, performanceGain: number) {
    const optimization = this.optimizations.get(key);
    if (!optimization) return;

    optimization.optimizationHistory.push({
      timestamp: Date.now(),
      oldValue: optimization.optimalValue,
      newValue: newValue,
      performanceChange: performanceGain
    });

    // Keep only last 100 optimization records
    if (optimization.optimizationHistory.length > 100) {
      optimization.optimizationHistory = optimization.optimizationHistory.slice(-100);
    }

    optimization.optimalValue = newValue;
    optimization.performanceGain = performanceGain;
    optimization.confidenceScore = Math.min(0.95, optimization.confidenceScore + 0.1);
    optimization.lastOptimized = Date.now();

    console.log(`[AI-OPTIMIZER] Updated ${key}: ${optimization.currentValue} → ${newValue} (${(performanceGain * 100).toFixed(1)}% gain)`);
  }

  public getOptimalParameters(contentType: string, complexity?: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Get optimal temperature for content type
    const tempOpt = this.optimizations.get(`temperature_${contentType}`);
    if (tempOpt) {
      params.temperature = tempOpt.optimalValue;
    }

    // Get optimal max tokens for complexity
    if (complexity) {
      const tokenOpt = this.optimizations.get(`max_tokens_${complexity}`);
      if (tokenOpt) {
        params.max_tokens = tokenOpt.optimalValue;
      }
    }

    // Get other optimal parameters
    const perfOpt = this.optimizations.get('performance_threshold');
    if (perfOpt) {
      params.performance_threshold = perfOpt.optimalValue;
    }

    const timeoutOpt = this.optimizations.get('fallback_timeout');
    if (timeoutOpt) {
      params.fallback_timeout = timeoutOpt.optimalValue;
    }

    return params;
  }

  public getOptimizationStatus(): any {
    const status = {
      totalParameters: this.optimizations.size,
      recentOptimizations: 0,
      avgConfidenceScore: 0,
      totalPerformanceGain: 0,
      lastOptimizationRun: 0,
      parameterDetails: {} as Record<string, any>
    };

    let totalConfidence = 0;
    let totalGain = 0;
    const now = Date.now();
    const oneHour = 3600000;

    for (const [key, opt] of this.optimizations.entries()) {
      if (now - opt.lastOptimized < oneHour) {
        status.recentOptimizations++;
      }
      
      totalConfidence += opt.confidenceScore;
      totalGain += opt.performanceGain;
      
      status.parameterDetails[key] = {
        current: opt.currentValue,
        optimal: opt.optimalValue,
        confidence: opt.confidenceScore,
        gain: opt.performanceGain,
        optimizations: opt.optimizationHistory.length
      };
      
      if (opt.lastOptimized > status.lastOptimizationRun) {
        status.lastOptimizationRun = opt.lastOptimized;
      }
    }

    status.avgConfidenceScore = totalConfidence / this.optimizations.size;
    status.totalPerformanceGain = totalGain;

    return status;
  }
}

// Export singleton instance
export const aiParameterOptimizer = new AIParameterOptimizer();

// Express router for parameter optimization endpoints
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: aiParameterOptimizer.getOptimizationStatus(),
    meta: {
      requestHistory: (aiParameterOptimizer as any).requestHistory.length,
      optimizationInterval: (aiParameterOptimizer as any).optimizationInterval / 1000 + 's'
    }
  });
});

router.post('/record-performance', (req, res) => {
  const metrics: RequestMetrics = req.body;
  aiParameterOptimizer.recordRequest(metrics);
  res.json({ success: true, message: 'Performance recorded' });
});

router.get('/optimal-parameters', (req, res) => {
  const { contentType, complexity } = req.query;
  const params = aiParameterOptimizer.getOptimalParameters(
    contentType as string || 'text',
    complexity as string
  );
  res.json({ success: true, data: params });
});

export default router;