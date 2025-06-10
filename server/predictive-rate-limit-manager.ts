/**
 * Predictive Rate Limit Manager
 * Learns API behavior patterns to prevent rate limits before they occur
 */

interface EndpointBehavior {
  endpoint: string;
  provider: string;
  responseTimes: number[];
  errorPatterns: Array<{ timestamp: number; error: string; responseTime: number }>;
  successPatterns: Array<{ timestamp: number; responseTime: number }>;
  currentRequestsInWindow: number;
  windowStartTime: number;
  learnedLimit: number;
  confidenceScore: number;
  backoffMultiplier: number;
  lastSuccessTime: number;
  degradationSignals: number;
}

export class PredictiveRateLimitManager {
  private endpointBehaviors: Map<string, EndpointBehavior> = new Map();
  private globalRequestQueue: Array<{ endpoint: string; requestFn: () => Promise<any>; resolve: any; reject: any }> = [];
  private isProcessingQueue = false;
  private learningEnabled = true;

  constructor() {
    this.initializeKnownBehaviors();
    this.startPredictiveMonitoring();
  }

  private initializeKnownBehaviors() {
    const knownEndpoints = [
      { url: 'https://api.mainnet-beta.solana.com', provider: 'Solana Labs', initialLimit: 40 },
      { url: 'https://pump.fun/api', provider: 'PumpFun', initialLimit: 100 },
      { url: 'https://rpc.ankr.com/solana', provider: 'Ankr', initialLimit: 500 },
      { url: 'https://api.solana.fm', provider: 'Solana.fm', initialLimit: 30 },
      { url: 'https://solana-api.projectserum.com', provider: 'Project Serum', initialLimit: 60 }
    ];

    knownEndpoints.forEach(endpoint => {
      this.endpointBehaviors.set(endpoint.url, {
        endpoint: endpoint.url,
        provider: endpoint.provider,
        responseTimes: [],
        errorPatterns: [],
        successPatterns: [],
        currentRequestsInWindow: 0,
        windowStartTime: Date.now(),
        learnedLimit: endpoint.initialLimit,
        confidenceScore: 0.3, // Start with low confidence
        backoffMultiplier: 1.0,
        lastSuccessTime: Date.now(),
        degradationSignals: 0
      });
    });
  }

  async makeSmartRequest<T>(endpoint: string, requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.globalRequestQueue.push({ endpoint, requestFn, resolve, reject });
      this.processRequestQueue();
    });
  }

  private async processRequestQueue() {
    if (this.isProcessingQueue || this.globalRequestQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.globalRequestQueue.length > 0) {
      const request = this.globalRequestQueue.shift()!;
      
      try {
        const shouldWait = this.predictRateLimit(request.endpoint);
        
        if (shouldWait > 0) {
          console.log(`🧠 Predictive wait: ${shouldWait}ms for ${this.getProviderName(request.endpoint)}`);
          await this.sleep(shouldWait);
        }
        
        const result = await this.executeWithLearning(request.endpoint, request.requestFn);
        request.resolve(result);
        
      } catch (error) {
        request.reject(error);
      }
      
      // Small gap between requests for learning
      await this.sleep(50);
    }
    
    this.isProcessingQueue = false;
  }

  private predictRateLimit(endpoint: string): number {
    const behavior = this.endpointBehaviors.get(endpoint);
    if (!behavior) return 1000; // Conservative default for unknown endpoints
    
    const now = Date.now();
    const windowDuration = 60000; // 1 minute window
    
    // Reset window if needed
    if (now - behavior.windowStartTime > windowDuration) {
      behavior.currentRequestsInWindow = 0;
      behavior.windowStartTime = now;
      behavior.degradationSignals = 0;
    }
    
    // Calculate predicted usage
    const windowElapsed = now - behavior.windowStartTime;
    const currentRate = behavior.currentRequestsInWindow / (windowElapsed / 60000);
    const predictedUsage = behavior.currentRequestsInWindow + 1;
    
    // Dynamic limit adjustment based on learning
    const adjustedLimit = behavior.learnedLimit * behavior.backoffMultiplier;
    const safeLimit = adjustedLimit * 0.85; // Stay 15% below learned limit
    
    // Predictive signals
    const signals = this.analyzePredictiveSignals(behavior);
    
    // Calculate wait time based on multiple factors
    let waitTime = 0;
    
    if (predictedUsage >= safeLimit) {
      // Approaching limit - calculate time to next window
      const timeToNewWindow = windowDuration - windowElapsed;
      waitTime = Math.max(timeToNewWindow / 4, 1000);
    }
    
    if (signals.degradationDetected) {
      // Performance degradation detected - be more conservative
      waitTime = Math.max(waitTime, signals.recommendedDelay);
    }
    
    if (currentRate > safeLimit * 0.8) {
      // High rate detected - gradual slowdown
      const rateExcess = currentRate / safeLimit;
      waitTime = Math.max(waitTime, 1000 * rateExcess);
    }
    
    // Recent error backoff
    const recentErrors = behavior.errorPatterns.filter(e => now - e.timestamp < 30000);
    if (recentErrors.length > 0) {
      waitTime = Math.max(waitTime, 2000 * recentErrors.length);
    }
    
    return Math.min(waitTime, 30000); // Cap at 30 seconds
  }

  private analyzePredictiveSignals(behavior: EndpointBehavior): { degradationDetected: boolean; recommendedDelay: number } {
    const recentResponses = behavior.responseTimes.slice(-10);
    const recentSuccesses = behavior.successPatterns.slice(-10);
    
    if (recentResponses.length < 3) {
      return { degradationDetected: false, recommendedDelay: 0 };
    }
    
    // Response time trend analysis
    const avgResponseTime = recentResponses.reduce((a, b) => a + b, 0) / recentResponses.length;
    const recentAvg = recentResponses.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, recentResponses.length);
    
    const responseTimeIncrease = recentAvg > avgResponseTime * 1.5;
    
    // Success rate analysis
    const now = Date.now();
    const recentTimeframe = 60000; // Last minute
    const recentActivity = behavior.successPatterns.filter(s => now - s.timestamp < recentTimeframe);
    const successRate = recentActivity.length / Math.max(1, behavior.currentRequestsInWindow);
    
    // Pattern detection
    const degradationDetected = responseTimeIncrease || successRate < 0.8 || behavior.degradationSignals > 2;
    
    let recommendedDelay = 0;
    if (degradationDetected) {
      if (responseTimeIncrease) recommendedDelay += 2000;
      if (successRate < 0.8) recommendedDelay += 3000;
      if (behavior.degradationSignals > 2) recommendedDelay += 1000 * behavior.degradationSignals;
    }
    
    return { degradationDetected, recommendedDelay };
  }

  private async executeWithLearning<T>(endpoint: string, requestFn: () => Promise<T>): Promise<T> {
    const behavior = this.endpointBehaviors.get(endpoint)!;
    const startTime = Date.now();
    
    try {
      const result = await requestFn();
      const responseTime = Date.now() - startTime;
      
      this.recordSuccess(endpoint, responseTime);
      return result;
      
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      if (this.isRateLimitError(error)) {
        this.recordRateLimit(endpoint, error, responseTime);
        
        // Adaptive backoff
        const backoffTime = this.calculateAdaptiveBackoff(endpoint);
        console.log(`🔄 Smart backoff: ${backoffTime}ms for ${behavior.provider}`);
        await this.sleep(backoffTime);
        
        // Retry with learned behavior
        return await this.executeWithLearning(endpoint, requestFn);
      } else {
        this.recordError(endpoint, error, responseTime);
        throw error;
      }
    }
  }

  private recordSuccess(endpoint: string, responseTime: number) {
    const behavior = this.endpointBehaviors.get(endpoint)!;
    const now = Date.now();
    
    behavior.responseTimes.push(responseTime);
    behavior.successPatterns.push({ timestamp: now, responseTime });
    behavior.currentRequestsInWindow++;
    behavior.lastSuccessTime = now;
    
    // Limit arrays to prevent memory issues
    if (behavior.responseTimes.length > 100) {
      behavior.responseTimes = behavior.responseTimes.slice(-50);
    }
    if (behavior.successPatterns.length > 100) {
      behavior.successPatterns = behavior.successPatterns.slice(-50);
    }
    
    // Positive learning - increase confidence and reduce backoff
    behavior.confidenceScore = Math.min(behavior.confidenceScore + 0.01, 1.0);
    behavior.backoffMultiplier = Math.max(behavior.backoffMultiplier * 0.98, 0.5);
    behavior.degradationSignals = Math.max(behavior.degradationSignals - 1, 0);
    
    // Performance-based limit adjustment
    if (responseTime < 1000 && behavior.confidenceScore > 0.8) {
      behavior.learnedLimit = Math.min(behavior.learnedLimit * 1.01, behavior.learnedLimit + 5);
    }
  }

  private recordRateLimit(endpoint: string, error: any, responseTime: number) {
    const behavior = this.endpointBehaviors.get(endpoint)!;
    const now = Date.now();
    
    behavior.errorPatterns.push({ timestamp: now, error: error.message, responseTime });
    
    // Limit error patterns array
    if (behavior.errorPatterns.length > 50) {
      behavior.errorPatterns = behavior.errorPatterns.slice(-25);
    }
    
    // Aggressive learning from rate limits
    behavior.learnedLimit = Math.max(behavior.currentRequestsInWindow - 2, 1);
    behavior.confidenceScore = Math.max(behavior.confidenceScore - 0.1, 0.1);
    behavior.backoffMultiplier = Math.min(behavior.backoffMultiplier * 1.5, 3.0);
    behavior.degradationSignals += 2;
    
    console.log(`📚 Learned rate limit: ${behavior.learnedLimit} RPM for ${behavior.provider}`);
  }

  private recordError(endpoint: string, error: any, responseTime: number) {
    const behavior = this.endpointBehaviors.get(endpoint)!;
    
    behavior.errorPatterns.push({ 
      timestamp: Date.now(), 
      error: error.message, 
      responseTime 
    });
    
    behavior.degradationSignals++;
    behavior.confidenceScore = Math.max(behavior.confidenceScore - 0.05, 0.1);
  }

  private calculateAdaptiveBackoff(endpoint: string): number {
    const behavior = this.endpointBehaviors.get(endpoint)!;
    const recentErrors = behavior.errorPatterns.filter(e => Date.now() - e.timestamp < 60000);
    
    // Base backoff with exponential component
    const baseBackoff = 2000;
    const exponentialFactor = Math.min(Math.pow(2, recentErrors.length), 16);
    const confidenceFactor = (1 - behavior.confidenceScore) + 1;
    
    const backoffTime = baseBackoff * exponentialFactor * confidenceFactor * behavior.backoffMultiplier;
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 1000;
    
    return Math.min(backoffTime + jitter, 60000); // Cap at 1 minute
  }

  private isRateLimitError(error: any): boolean {
    const errorMessage = (error.message || error.toString()).toLowerCase();
    const statusCode = error.status || error.statusCode;
    
    const rateLimitIndicators = [
      'rate limit', 'too many requests', 'quota exceeded', 'throttled',
      'slow down', 'exceeded', 'limit reached', 'rate exceeded'
    ];
    
    return statusCode === 429 || 
           rateLimitIndicators.some(indicator => errorMessage.includes(indicator));
  }

  private getProviderName(endpoint: string): string {
    const behavior = this.endpointBehaviors.get(endpoint);
    return behavior?.provider || 'Unknown';
  }

  private startPredictiveMonitoring() {
    // Monitor and adjust every 30 seconds
    setInterval(() => {
      this.performPredictiveOptimization();
    }, 30000);
    
    // Deep learning analysis every 5 minutes
    setInterval(() => {
      this.performDeepLearningAnalysis();
    }, 300000);
  }

  private performPredictiveOptimization() {
    for (const [endpoint, behavior] of this.endpointBehaviors.entries()) {
      // Auto-recovery from degradation
      if (Date.now() - behavior.lastSuccessTime > 120000) { // 2 minutes since last success
        behavior.backoffMultiplier = Math.max(behavior.backoffMultiplier * 0.9, 0.5);
        behavior.degradationSignals = Math.max(behavior.degradationSignals - 1, 0);
      }
      
      // Confidence recovery
      if (behavior.successPatterns.length > 10) {
        const recentSuccesses = behavior.successPatterns.slice(-10);
        const allSuccessful = recentSuccesses.every(s => Date.now() - s.timestamp < 300000);
        
        if (allSuccessful) {
          behavior.confidenceScore = Math.min(behavior.confidenceScore + 0.02, 1.0);
        }
      }
    }
  }

  private performDeepLearningAnalysis() {
    for (const [endpoint, behavior] of this.endpointBehaviors.entries()) {
      // Analyze historical patterns for optimal timing
      const hourlyPatterns = this.analyzeHourlyPatterns(behavior);
      const optimalTiming = this.findOptimalRequestTiming(hourlyPatterns);
      
      // Adjust learned limits based on long-term patterns
      if (behavior.confidenceScore > 0.7) {
        const successfulRequests = behavior.successPatterns.length;
        const errorRequests = behavior.errorPatterns.length;
        const successRate = successfulRequests / (successfulRequests + errorRequests);
        
        if (successRate > 0.95) {
          behavior.learnedLimit = Math.min(behavior.learnedLimit * 1.05, behavior.learnedLimit + 2);
        } else if (successRate < 0.85) {
          behavior.learnedLimit = Math.max(behavior.learnedLimit * 0.95, 1);
        }
      }
      
      console.log(`🧠 Deep learning update for ${behavior.provider}: ${behavior.learnedLimit} RPM, confidence: ${(behavior.confidenceScore * 100).toFixed(1)}%`);
    }
  }

  private analyzeHourlyPatterns(behavior: EndpointBehavior): number[] {
    const hourlySuccess = new Array(24).fill(0);
    const hourlyTotal = new Array(24).fill(0);
    
    const timeframe = 7 * 24 * 60 * 60 * 1000; // Last 7 days
    const cutoff = Date.now() - timeframe;
    
    behavior.successPatterns.forEach(pattern => {
      if (pattern.timestamp > cutoff) {
        const hour = new Date(pattern.timestamp).getHours();
        hourlySuccess[hour]++;
        hourlyTotal[hour]++;
      }
    });
    
    behavior.errorPatterns.forEach(pattern => {
      if (pattern.timestamp > cutoff) {
        const hour = new Date(pattern.timestamp).getHours();
        hourlyTotal[hour]++;
      }
    });
    
    return hourlySuccess.map((success, i) => 
      hourlyTotal[i] > 0 ? success / hourlyTotal[i] : 1
    );
  }

  private findOptimalRequestTiming(hourlyPatterns: number[]): { bestHours: number[]; worstHours: number[] } {
    const hoursWithRates = hourlyPatterns.map((rate, hour) => ({ hour, rate }));
    hoursWithRates.sort((a, b) => b.rate - a.rate);
    
    return {
      bestHours: hoursWithRates.slice(0, 8).map(h => h.hour),
      worstHours: hoursWithRates.slice(-8).map(h => h.hour)
    };
  }

  getEndpointStatus(): { [endpoint: string]: any } {
    const status: { [endpoint: string]: any } = {};
    
    for (const [endpoint, behavior] of this.endpointBehaviors.entries()) {
      const avgResponseTime = behavior.responseTimes.length > 0 
        ? behavior.responseTimes.reduce((a, b) => a + b, 0) / behavior.responseTimes.length 
        : 0;
      
      status[endpoint] = {
        provider: behavior.provider,
        learnedLimit: Math.floor(behavior.learnedLimit),
        confidence: `${(behavior.confidenceScore * 100).toFixed(1)}%`,
        backoffMultiplier: behavior.backoffMultiplier.toFixed(2),
        avgResponseTime: `${Math.floor(avgResponseTime)}ms`,
        currentRequests: behavior.currentRequestsInWindow,
        degradationSignals: behavior.degradationSignals,
        recentErrors: behavior.errorPatterns.filter(e => Date.now() - e.timestamp < 300000).length,
        status: behavior.degradationSignals > 3 ? 'Degraded' : 
                behavior.confidenceScore > 0.8 ? 'Optimal' : 'Learning'
      };
    }
    
    return status;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}