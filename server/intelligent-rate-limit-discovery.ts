/**
 * Intelligent Rate Limit Discovery and Management System
 * Automatically discovers, tracks, and adapts to API rate limits
 */

interface RateLimitProfile {
  endpoint: string;
  provider: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
  resetWindow: number; // seconds
  discoveredAt: Date;
  lastUpdated: Date;
  confidence: number; // 0-100%
  adaptiveMultiplier: number;
  errorPatterns: string[];
  successRate: number;
}

interface RateLimitMetrics {
  totalRequests: number;
  successfulRequests: number;
  rateLimitErrors: number;
  lastRateLimitTime: Date | null;
  averageResponseTime: number;
  currentBurstUsed: number;
  windowStartTime: Date;
}

export class IntelligentRateLimitDiscovery {
  private rateLimitProfiles: Map<string, RateLimitProfile> = new Map();
  private metricsHistory: Map<string, RateLimitMetrics> = new Map();
  private requestQueues: Map<string, Array<() => Promise<any>>> = new Map();
  private isProcessingQueue: Map<string, boolean> = new Map();
  private adaptiveDelays: Map<string, number> = new Map();

  constructor() {
    this.initializeKnownProviders();
    this.startAdaptiveMonitoring();
  }

  private initializeKnownProviders() {
    // Initialize with conservative estimates for known providers
    const knownProviders = [
      { endpoint: 'https://api.mainnet-beta.solana.com', provider: 'Solana Labs', rpm: 40, rph: 2000, rpd: 40000, burst: 10 },
      { endpoint: 'https://solana-api.projectserum.com', provider: 'Project Serum', rpm: 60, rph: 3000, rpd: 50000, burst: 15 },
      { endpoint: 'https://api.solana.fm', provider: 'Solana.fm', rpm: 30, rph: 1500, rpd: 30000, burst: 8 },
      { endpoint: 'https://rpc.ankr.com/solana', provider: 'Ankr', rpm: 500, rph: 10000, rpd: 100000, burst: 50 },
      { endpoint: 'pump.fun/api', provider: 'PumpFun', rpm: 100, rph: 2000, rpd: 20000, burst: 20 }
    ];

    knownProviders.forEach(provider => {
      this.rateLimitProfiles.set(provider.endpoint, {
        endpoint: provider.endpoint,
        provider: provider.provider,
        requestsPerMinute: provider.rpm,
        requestsPerHour: provider.rph,
        requestsPerDay: provider.rpd,
        burstLimit: provider.burst,
        resetWindow: 60,
        discoveredAt: new Date(),
        lastUpdated: new Date(),
        confidence: 50, // Start with medium confidence
        adaptiveMultiplier: 0.8, // Conservative start
        errorPatterns: ['429', 'Too Many Requests', 'Rate limit exceeded'],
        successRate: 95
      });

      this.metricsHistory.set(provider.endpoint, {
        totalRequests: 0,
        successfulRequests: 0,
        rateLimitErrors: 0,
        lastRateLimitTime: null,
        averageResponseTime: 0,
        currentBurstUsed: 0,
        windowStartTime: new Date()
      });

      this.requestQueues.set(provider.endpoint, []);
      this.isProcessingQueue.set(provider.endpoint, false);
      this.adaptiveDelays.set(provider.endpoint, 1000); // 1 second default
    });
  }

  async makeIntelligentRequest<T>(endpoint: string, requestFn: () => Promise<T>): Promise<T> {
    const profile = this.rateLimitProfiles.get(endpoint);
    if (!profile) {
      // New endpoint - start discovery
      await this.discoverRateLimits(endpoint, requestFn);
      return await this.makeIntelligentRequest(endpoint, requestFn);
    }

    return new Promise((resolve, reject) => {
      const queue = this.requestQueues.get(endpoint)!;
      queue.push(async () => {
        try {
          const result = await this.executeWithRateLimitHandling(endpoint, requestFn);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue(endpoint);
    });
  }

  private async executeWithRateLimitHandling<T>(endpoint: string, requestFn: () => Promise<T>): Promise<T> {
    const profile = this.rateLimitProfiles.get(endpoint)!;
    const metrics = this.metricsHistory.get(endpoint)!;
    const adaptiveDelay = this.adaptiveDelays.get(endpoint)!;

    // Check if we need to wait
    if (this.shouldThrottle(endpoint)) {
      const waitTime = this.calculateWaitTime(endpoint);
      console.log(`⏳ Rate limit protection: waiting ${waitTime}ms for ${profile.provider}`);
      await this.sleep(waitTime);
    }

    const startTime = Date.now();
    
    try {
      const result = await requestFn();
      
      // Success - update metrics
      const responseTime = Date.now() - startTime;
      this.updateSuccessMetrics(endpoint, responseTime);
      
      // Adaptive optimization - reduce delays on success
      this.adaptiveDelays.set(endpoint, Math.max(100, adaptiveDelay * 0.95));
      
      return result;
      
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      if (this.isRateLimitError(error)) {
        console.log(`🚫 Rate limit detected for ${profile.provider}: ${error.message}`);
        await this.handleRateLimitError(endpoint, error);
        
        // Retry with exponential backoff
        const backoffTime = this.calculateBackoffTime(endpoint);
        console.log(`🔄 Retrying after ${backoffTime}ms delay...`);
        await this.sleep(backoffTime);
        
        return await this.executeWithRateLimitHandling(endpoint, requestFn);
      } else {
        this.updateErrorMetrics(endpoint, responseTime);
        throw error;
      }
    }
  }

  private async discoverRateLimits<T>(endpoint: string, requestFn: () => Promise<T>) {
    console.log(`🔍 Discovering rate limits for new endpoint: ${endpoint}`);
    
    const profile: RateLimitProfile = {
      endpoint,
      provider: this.extractProviderName(endpoint),
      requestsPerMinute: 60, // Conservative start
      requestsPerHour: 1000,
      requestsPerDay: 10000,
      burstLimit: 5,
      resetWindow: 60,
      discoveredAt: new Date(),
      lastUpdated: new Date(),
      confidence: 10, // Low confidence initially
      adaptiveMultiplier: 0.5, // Very conservative
      errorPatterns: ['429', 'Too Many Requests', 'Rate limit'],
      successRate: 50
    };

    this.rateLimitProfiles.set(endpoint, profile);
    this.metricsHistory.set(endpoint, {
      totalRequests: 0,
      successfulRequests: 0,
      rateLimitErrors: 0,
      lastRateLimitTime: null,
      averageResponseTime: 0,
      currentBurstUsed: 0,
      windowStartTime: new Date()
    });
    
    this.requestQueues.set(endpoint, []);
    this.isProcessingQueue.set(endpoint, false);
    this.adaptiveDelays.set(endpoint, 2000); // Conservative 2 second start

    // Perform intelligent probing
    await this.performRateLimitProbing(endpoint, requestFn);
  }

  private async performRateLimitProbing<T>(endpoint: string, requestFn: () => Promise<T>) {
    console.log(`🧪 Probing rate limits for ${endpoint}`);
    
    const profile = this.rateLimitProfiles.get(endpoint)!;
    let consecutiveSuccesses = 0;
    let rateLimitHit = false;
    
    // Gradual probing with increasing frequency
    const probingIntervals = [5000, 3000, 2000, 1000, 500, 250]; // milliseconds
    
    for (const interval of probingIntervals) {
      if (rateLimitHit) break;
      
      try {
        await requestFn();
        consecutiveSuccesses++;
        
        if (consecutiveSuccesses >= 3) {
          // Update profile with successful rate
          profile.requestsPerMinute = Math.min(profile.requestsPerMinute + 10, 60000 / interval);
          profile.confidence = Math.min(profile.confidence + 15, 90);
          profile.adaptiveMultiplier = Math.min(profile.adaptiveMultiplier + 0.1, 1.0);
        }
        
        await this.sleep(interval);
        
      } catch (error: any) {
        if (this.isRateLimitError(error)) {
          rateLimitHit = true;
          
          // Adjust profile based on when rate limit was hit
          profile.requestsPerMinute = Math.max(1, 60000 / (interval * 2));
          profile.burstLimit = Math.max(1, consecutiveSuccesses);
          profile.confidence = 80;
          
          console.log(`📊 Rate limit discovered: ${profile.requestsPerMinute} RPM, ${profile.burstLimit} burst`);
          break;
        }
      }
    }
    
    profile.lastUpdated = new Date();
  }

  private shouldThrottle(endpoint: string): boolean {
    const profile = this.rateLimitProfiles.get(endpoint)!;
    const metrics = this.metricsHistory.get(endpoint)!;
    
    const now = new Date();
    const windowElapsed = now.getTime() - metrics.windowStartTime.getTime();
    
    // Reset window if needed
    if (windowElapsed > profile.resetWindow * 1000) {
      metrics.currentBurstUsed = 0;
      metrics.windowStartTime = now;
      return false;
    }
    
    // Check burst limit
    const burstThreshold = profile.burstLimit * profile.adaptiveMultiplier;
    if (metrics.currentBurstUsed >= burstThreshold) {
      return true;
    }
    
    // Check rate limit
    const requestsInWindow = metrics.currentBurstUsed;
    const rateThreshold = (profile.requestsPerMinute * profile.adaptiveMultiplier * windowElapsed) / 60000;
    
    return requestsInWindow >= rateThreshold;
  }

  private calculateWaitTime(endpoint: string): number {
    const profile = this.rateLimitProfiles.get(endpoint)!;
    const metrics = this.metricsHistory.get(endpoint)!;
    const adaptiveDelay = this.adaptiveDelays.get(endpoint)!;
    
    // Calculate time until next available slot
    const windowRemaining = (profile.resetWindow * 1000) - (Date.now() - metrics.windowStartTime.getTime());
    const slotsRemaining = (profile.burstLimit * profile.adaptiveMultiplier) - metrics.currentBurstUsed;
    
    if (slotsRemaining <= 0) {
      return Math.max(windowRemaining, adaptiveDelay);
    }
    
    return Math.max(adaptiveDelay, 60000 / (profile.requestsPerMinute * profile.adaptiveMultiplier));
  }

  private calculateBackoffTime(endpoint: string): number {
    const metrics = this.metricsHistory.get(endpoint)!;
    const baseDelay = this.adaptiveDelays.get(endpoint)!;
    
    // Exponential backoff based on recent rate limit errors
    const backoffMultiplier = Math.min(Math.pow(2, metrics.rateLimitErrors), 32);
    const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
    
    return baseDelay * backoffMultiplier + jitter;
  }

  private async handleRateLimitError(endpoint: string, error: any) {
    const profile = this.rateLimitProfiles.get(endpoint)!;
    const metrics = this.metricsHistory.get(endpoint)!;
    
    metrics.rateLimitErrors++;
    metrics.lastRateLimitTime = new Date();
    
    // Extract rate limit info from headers if available
    const retryAfter = this.extractRetryAfter(error);
    if (retryAfter) {
      this.adaptiveDelays.set(endpoint, retryAfter * 1000);
    } else {
      // Increase adaptive delay
      const currentDelay = this.adaptiveDelays.get(endpoint)!;
      this.adaptiveDelays.set(endpoint, Math.min(currentDelay * 2, 60000));
    }
    
    // Reduce confidence and adaptive multiplier
    profile.confidence = Math.max(profile.confidence - 10, 10);
    profile.adaptiveMultiplier = Math.max(profile.adaptiveMultiplier - 0.1, 0.1);
    
    // Learn from the error
    this.updateRateLimitProfile(endpoint, error);
  }

  private updateRateLimitProfile(endpoint: string, error: any) {
    const profile = this.rateLimitProfiles.get(endpoint)!;
    
    // Extract rate limit information from error message
    const errorMessage = error.message || error.toString();
    
    // Look for specific rate limit patterns
    const ratePatterns = [
      /(\d+)\s*requests?\s*per\s*minute/i,
      /(\d+)\s*requests?\s*per\s*hour/i,
      /limit\s*of\s*(\d+)/i,
      /retry\s*after\s*(\d+)/i
    ];
    
    ratePatterns.forEach(pattern => {
      const match = errorMessage.match(pattern);
      if (match) {
        const limit = parseInt(match[1]);
        if (pattern.source.includes('minute')) {
          profile.requestsPerMinute = Math.min(profile.requestsPerMinute, limit);
        } else if (pattern.source.includes('hour')) {
          profile.requestsPerHour = Math.min(profile.requestsPerHour, limit);
        }
      }
    });
    
    profile.lastUpdated = new Date();
  }

  private async processQueue(endpoint: string) {
    if (this.isProcessingQueue.get(endpoint)) return;
    
    this.isProcessingQueue.set(endpoint, true);
    const queue = this.requestQueues.get(endpoint)!;
    
    while (queue.length > 0) {
      const requestFn = queue.shift()!;
      
      try {
        await requestFn();
      } catch (error) {
        console.error(`Queue processing error for ${endpoint}:`, error);
      }
      
      // Small delay between queue processing
      await this.sleep(100);
    }
    
    this.isProcessingQueue.set(endpoint, false);
  }

  private updateSuccessMetrics(endpoint: string, responseTime: number) {
    const metrics = this.metricsHistory.get(endpoint)!;
    const profile = this.rateLimitProfiles.get(endpoint)!;
    
    metrics.totalRequests++;
    metrics.successfulRequests++;
    metrics.currentBurstUsed++;
    
    // Update rolling average response time
    metrics.averageResponseTime = (metrics.averageResponseTime + responseTime) / 2;
    
    // Update success rate
    profile.successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;
  }

  private updateErrorMetrics(endpoint: string, responseTime: number) {
    const metrics = this.metricsHistory.get(endpoint)!;
    const profile = this.rateLimitProfiles.get(endpoint)!;
    
    metrics.totalRequests++;
    
    // Update success rate
    profile.successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;
  }

  private isRateLimitError(error: any): boolean {
    const errorString = (error.message || error.toString()).toLowerCase();
    const statusCode = error.status || error.statusCode;
    
    return statusCode === 429 || 
           errorString.includes('rate limit') ||
           errorString.includes('too many requests') ||
           errorString.includes('quota exceeded') ||
           errorString.includes('throttled');
  }

  private extractRetryAfter(error: any): number | null {
    if (error.headers && error.headers['retry-after']) {
      return parseInt(error.headers['retry-after']);
    }
    
    const errorMessage = error.message || error.toString();
    const retryMatch = errorMessage.match(/retry\s*after\s*(\d+)/i);
    
    return retryMatch ? parseInt(retryMatch[1]) : null;
  }

  private extractProviderName(endpoint: string): string {
    const url = new URL(endpoint);
    const hostname = url.hostname;
    
    const providerMap: { [key: string]: string } = {
      'api.mainnet-beta.solana.com': 'Solana Labs',
      'solana-api.projectserum.com': 'Project Serum',
      'api.solana.fm': 'Solana.fm',
      'rpc.ankr.com': 'Ankr',
      'pump.fun': 'PumpFun',
      'api.tatum.io': 'Tatum',
      'getblock.io': 'GetBlock',
      'chainstack.com': 'Chainstack'
    };
    
    for (const [key, value] of Object.entries(providerMap)) {
      if (hostname.includes(key)) {
        return value;
      }
    }
    
    return 'Unknown Provider';
  }

  private startAdaptiveMonitoring() {
    // Monitor and adjust rate limits every 5 minutes
    setInterval(() => {
      this.performAdaptiveOptimization();
    }, 5 * 60 * 1000);
  }

  private performAdaptiveOptimization() {
    for (const [endpoint, profile] of this.rateLimitProfiles.entries()) {
      const metrics = this.metricsHistory.get(endpoint)!;
      
      // Increase rate limits if success rate is high and no recent errors
      if (profile.successRate > 95 && metrics.rateLimitErrors === 0) {
        profile.adaptiveMultiplier = Math.min(profile.adaptiveMultiplier + 0.05, 1.2);
        profile.confidence = Math.min(profile.confidence + 5, 100);
      }
      
      // Reset error counts periodically
      if (Date.now() - (metrics.lastRateLimitTime?.getTime() || 0) > 60000) {
        metrics.rateLimitErrors = Math.max(0, metrics.rateLimitErrors - 1);
      }
    }
  }

  getRateLimitStatus(): { [endpoint: string]: any } {
    const status: { [endpoint: string]: any } = {};
    
    for (const [endpoint, profile] of this.rateLimitProfiles.entries()) {
      const metrics = this.metricsHistory.get(endpoint)!;
      
      status[endpoint] = {
        provider: profile.provider,
        requestsPerMinute: Math.floor(profile.requestsPerMinute * profile.adaptiveMultiplier),
        successRate: profile.successRate.toFixed(1) + '%',
        confidence: profile.confidence + '%',
        averageResponseTime: Math.floor(metrics.averageResponseTime) + 'ms',
        totalRequests: metrics.totalRequests,
        rateLimitErrors: metrics.rateLimitErrors,
        currentDelay: this.adaptiveDelays.get(endpoint) + 'ms'
      };
    }
    
    return status;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}