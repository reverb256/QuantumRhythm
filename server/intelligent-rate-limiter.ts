/**
 * Intelligent Rate Limiter with Adaptive Discovery
 * Dynamically discovers rate limits and implements intelligent failover
 */

interface ApiEndpoint {
  url: string;
  provider: string;
  rateLimit: number; // requests per minute
  currentUsage: number;
  lastReset: Date;
  priority: number; // 1-10, higher is better
  responseTime: number; // average ms
  errorRate: number; // 0-1
  status: 'healthy' | 'degraded' | 'unavailable';
}

interface RateLimitMetrics {
  endpoint: string;
  requestsPerMinute: number;
  burstCapacity: number;
  cooldownPeriod: number;
  backoffStrategy: 'exponential' | 'linear' | 'fibonacci';
  successRate: number;
}

export class IntelligentRateLimiter {
  private endpoints: Map<string, ApiEndpoint> = new Map();
  private rateLimitMetrics: Map<string, RateLimitMetrics> = new Map();
  private requestQueues: Map<string, Array<() => Promise<any>>> = new Map();
  private adaptiveDelay: Map<string, number> = new Map();
  private failoverChains: Map<string, string[]> = new Map();

  constructor() {
    this.initializeEndpoints();
    this.startAdaptiveMonitoring();
  }

  private initializeEndpoints() {
    // Solana RPC endpoints
    this.registerEndpoint({
      url: 'https://api.mainnet-beta.solana.com',
      provider: 'solana-labs',
      rateLimit: 100, // Initial guess
      currentUsage: 0,
      lastReset: new Date(),
      priority: 5,
      responseTime: 0,
      errorRate: 0,
      status: 'healthy'
    });

    this.registerEndpoint({
      url: 'https://solana-api.projectserum.com',
      provider: 'serum',
      rateLimit: 150,
      currentUsage: 0,
      lastReset: new Date(),
      priority: 6,
      responseTime: 0,
      errorRate: 0,
      status: 'healthy'
    });

    this.registerEndpoint({
      url: 'https://rpc.ankr.com/solana',
      provider: 'ankr',
      rateLimit: 200,
      currentUsage: 0,
      lastReset: new Date(),
      priority: 7,
      responseTime: 0,
      errorRate: 0,
      status: 'healthy'
    });

    // Pump.fun API endpoints
    this.registerEndpoint({
      url: 'https://frontend-api.pump.fun',
      provider: 'pump-fun-primary',
      rateLimit: 60,
      currentUsage: 0,
      lastReset: new Date(),
      priority: 8,
      responseTime: 0,
      errorRate: 0,
      status: 'healthy'
    });

    // Setup failover chains
    this.failoverChains.set('solana-rpc', [
      'https://rpc.ankr.com/solana',
      'https://solana-api.projectserum.com',
      'https://api.mainnet-beta.solana.com'
    ]);

    this.failoverChains.set('pump-fun', [
      'https://frontend-api.pump.fun'
    ]);
  }

  private registerEndpoint(endpoint: ApiEndpoint) {
    this.endpoints.set(endpoint.url, endpoint);
    this.requestQueues.set(endpoint.url, []);
    this.adaptiveDelay.set(endpoint.url, 0);
    
    this.rateLimitMetrics.set(endpoint.url, {
      endpoint: endpoint.url,
      requestsPerMinute: endpoint.rateLimit,
      burstCapacity: Math.floor(endpoint.rateLimit * 0.8),
      cooldownPeriod: 60000, // 1 minute
      backoffStrategy: 'exponential',
      successRate: 1.0
    });
  }

  public async makeRequest<T>(
    endpointType: 'solana-rpc' | 'pump-fun',
    requestFn: (url: string) => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    const availableEndpoints = this.getAvailableEndpoints(endpointType);
    
    if (availableEndpoints.length === 0) {
      throw new Error(`No available endpoints for ${endpointType}`);
    }

    const bestEndpoint = this.selectBestEndpoint(availableEndpoints);
    
    try {
      // Check rate limit before making request
      if (!this.canMakeRequest(bestEndpoint.url)) {
        // Wait for rate limit reset or try failover
        await this.handleRateLimit(bestEndpoint.url, endpointType, requestFn, retryCount);
        return this.makeRequest(endpointType, requestFn, retryCount + 1);
      }

      // Track request
      this.trackRequest(bestEndpoint.url);
      
      const startTime = Date.now();
      const result = await requestFn(bestEndpoint.url);
      const responseTime = Date.now() - startTime;
      
      // Update metrics on success
      this.updateSuccessMetrics(bestEndpoint.url, responseTime);
      
      return result;
      
    } catch (error: any) {
      // Handle different types of errors
      if (error.message?.includes('429') || error.status === 429) {
        return this.handleRateLimit(bestEndpoint.url, endpointType, requestFn, retryCount);
      }
      
      if (error.message?.includes('5') && error.status >= 500) {
        return this.handleServerError(bestEndpoint.url, endpointType, requestFn, retryCount);
      }
      
      // Update error metrics
      this.updateErrorMetrics(bestEndpoint.url);
      
      // Try failover if available
      if (retryCount < 3) {
        console.log(`🔄 Failing over from ${bestEndpoint.provider}, attempt ${retryCount + 1}`);
        return this.makeRequest(endpointType, requestFn, retryCount + 1);
      }
      
      throw error;
    }
  }

  private getAvailableEndpoints(type: 'solana-rpc' | 'pump-fun'): ApiEndpoint[] {
    const chainUrls = this.failoverChains.get(type) || [];
    return chainUrls
      .map(url => this.endpoints.get(url))
      .filter((endpoint): endpoint is ApiEndpoint => 
        endpoint !== undefined && endpoint.status !== 'unavailable'
      )
      .sort((a, b) => this.calculateEndpointScore(b) - this.calculateEndpointScore(a));
  }

  private selectBestEndpoint(endpoints: ApiEndpoint[]): ApiEndpoint {
    // Select endpoint with highest score (priority + performance - error rate)
    return endpoints[0];
  }

  private calculateEndpointScore(endpoint: ApiEndpoint): number {
    const responseTimeScore = Math.max(0, 10 - (endpoint.responseTime / 100));
    const errorRateScore = Math.max(0, 10 - (endpoint.errorRate * 10));
    const usageScore = Math.max(0, 10 - (endpoint.currentUsage / endpoint.rateLimit * 10));
    
    return (endpoint.priority * 2) + responseTimeScore + errorRateScore + usageScore;
  }

  private canMakeRequest(url: string): boolean {
    const endpoint = this.endpoints.get(url);
    if (!endpoint) return false;
    
    const metrics = this.rateLimitMetrics.get(url);
    if (!metrics) return false;
    
    // Check if we're within rate limits
    if (endpoint.currentUsage >= metrics.burstCapacity) {
      return false;
    }
    
    // Check adaptive delay
    const delay = this.adaptiveDelay.get(url) || 0;
    if (delay > Date.now()) {
      return false;
    }
    
    return true;
  }

  private trackRequest(url: string) {
    const endpoint = this.endpoints.get(url);
    if (endpoint) {
      endpoint.currentUsage++;
    }
  }

  private async handleRateLimit<T>(
    url: string,
    endpointType: string,
    requestFn: (url: string) => Promise<T>,
    retryCount: number
  ): Promise<T> {
    console.log(`⏳ Rate limit hit on ${url}, implementing intelligent backoff`);
    
    // Discover actual rate limit from 429 response
    this.discoverActualRateLimit(url);
    
    // Calculate intelligent delay
    const delay = this.calculateAdaptiveDelay(url, retryCount);
    this.adaptiveDelay.set(url, Date.now() + delay);
    
    console.log(`🕐 Waiting ${delay}ms before retry`);
    
    // Try immediate failover to different endpoint if available
    const availableEndpoints = this.getAvailableEndpoints(endpointType as any);
    const alternativeEndpoints = availableEndpoints.filter(ep => ep.url !== url);
    
    if (alternativeEndpoints.length > 0) {
      console.log(`🔄 Failing over to ${alternativeEndpoints[0].provider}`);
      return this.makeRequest(endpointType as any, requestFn, retryCount);
    }
    
    // Wait and retry on same endpoint if no alternatives
    await new Promise(resolve => setTimeout(resolve, delay));
    return this.makeRequest(endpointType as any, requestFn, retryCount + 1);
  }

  private async handleServerError<T>(
    url: string,
    endpointType: string,
    requestFn: (url: string) => Promise<T>,
    retryCount: number
  ): Promise<T> {
    console.log(`🚨 Server error on ${url}, marking as degraded`);
    
    const endpoint = this.endpoints.get(url);
    if (endpoint) {
      endpoint.status = 'degraded';
      // Temporarily reduce priority
      setTimeout(() => {
        if (endpoint.status === 'degraded') {
          endpoint.status = 'healthy';
        }
      }, 300000); // 5 minutes
    }
    
    // Immediate failover for server errors
    return this.makeRequest(endpointType as any, requestFn, retryCount + 1);
  }

  private discoverActualRateLimit(url: string) {
    const endpoint = this.endpoints.get(url);
    const metrics = this.rateLimitMetrics.get(url);
    
    if (endpoint && metrics) {
      // Reduce estimated rate limit if we hit 429
      const newLimit = Math.floor(endpoint.rateLimit * 0.8);
      endpoint.rateLimit = Math.max(10, newLimit); // Never go below 10 RPM
      metrics.requestsPerMinute = endpoint.rateLimit;
      metrics.burstCapacity = Math.floor(endpoint.rateLimit * 0.6);
      
      console.log(`📊 Discovered rate limit for ${endpoint.provider}: ${endpoint.rateLimit} RPM`);
    }
  }

  private calculateAdaptiveDelay(url: string, retryCount: number): number {
    const metrics = this.rateLimitMetrics.get(url);
    if (!metrics) return 1000;
    
    const baseDelay = 60000 / metrics.requestsPerMinute; // Base delay between requests
    
    switch (metrics.backoffStrategy) {
      case 'exponential':
        return Math.min(30000, baseDelay * Math.pow(2, retryCount));
      case 'fibonacci':
        return Math.min(30000, baseDelay * this.fibonacci(retryCount + 1));
      case 'linear':
      default:
        return Math.min(30000, baseDelay * (retryCount + 1));
    }
  }

  private fibonacci(n: number): number {
    if (n <= 1) return 1;
    let a = 1, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  private updateSuccessMetrics(url: string, responseTime: number) {
    const endpoint = this.endpoints.get(url);
    const metrics = this.rateLimitMetrics.get(url);
    
    if (endpoint && metrics) {
      // Update response time (exponential moving average)
      endpoint.responseTime = endpoint.responseTime * 0.7 + responseTime * 0.3;
      
      // Improve success rate
      metrics.successRate = Math.min(1.0, metrics.successRate + 0.01);
      
      // Gradually increase rate limit if we're doing well
      if (metrics.successRate > 0.95 && endpoint.errorRate < 0.05) {
        endpoint.rateLimit = Math.min(endpoint.rateLimit * 1.05, 300);
        metrics.requestsPerMinute = endpoint.rateLimit;
      }
      
      endpoint.status = 'healthy';
    }
  }

  private updateErrorMetrics(url: string) {
    const endpoint = this.endpoints.get(url);
    const metrics = this.rateLimitMetrics.get(url);
    
    if (endpoint && metrics) {
      // Update error rate (exponential moving average)
      endpoint.errorRate = endpoint.errorRate * 0.9 + 0.1;
      
      // Decrease success rate
      metrics.successRate = Math.max(0.0, metrics.successRate - 0.05);
      
      // Mark as degraded if error rate too high
      if (endpoint.errorRate > 0.5) {
        endpoint.status = 'degraded';
      }
    }
  }

  private startAdaptiveMonitoring() {
    // Reset usage counters every minute
    setInterval(() => {
      this.resetUsageCounters();
    }, 60000);
    
    // Adaptive strategy optimization every 5 minutes
    setInterval(() => {
      this.optimizeStrategies();
    }, 300000);
    
    // Health check every 30 seconds
    setInterval(() => {
      this.healthCheck();
    }, 30000);
  }

  private resetUsageCounters() {
    for (const endpoint of this.endpoints.values()) {
      endpoint.currentUsage = 0;
      endpoint.lastReset = new Date();
    }
    
    // Clear adaptive delays that have expired
    for (const [url, delay] of this.adaptiveDelay.entries()) {
      if (delay < Date.now()) {
        this.adaptiveDelay.set(url, 0);
      }
    }
  }

  private optimizeStrategies() {
    for (const [url, metrics] of this.rateLimitMetrics.entries()) {
      const endpoint = this.endpoints.get(url);
      if (!endpoint) continue;
      
      // Optimize backoff strategy based on success rate
      if (metrics.successRate > 0.9) {
        metrics.backoffStrategy = 'linear'; // Less aggressive
      } else if (metrics.successRate > 0.7) {
        metrics.backoffStrategy = 'exponential'; // Moderate
      } else {
        metrics.backoffStrategy = 'fibonacci'; // Most conservative
      }
    }
  }

  private healthCheck() {
    for (const endpoint of this.endpoints.values()) {
      // Auto-recovery for degraded endpoints
      if (endpoint.status === 'degraded' && endpoint.errorRate < 0.1) {
        endpoint.status = 'healthy';
        console.log(`🟢 ${endpoint.provider} recovered to healthy status`);
      }
      
      // Mark as unavailable if consistently failing
      if (endpoint.errorRate > 0.8) {
        endpoint.status = 'unavailable';
        console.log(`🔴 ${endpoint.provider} marked as unavailable`);
        
        // Auto-recovery after 10 minutes
        setTimeout(() => {
          endpoint.status = 'degraded';
          endpoint.errorRate = 0.5; // Reset to moderate error rate
        }, 600000);
      }
    }
  }

  public getSystemStatus() {
    const totalEndpoints = this.endpoints.size;
    const healthyEndpoints = Array.from(this.endpoints.values())
      .filter(ep => ep.status === 'healthy').length;
    
    const avgResponseTime = Array.from(this.endpoints.values())
      .reduce((sum, ep) => sum + ep.responseTime, 0) / totalEndpoints;
    
    const avgSuccessRate = Array.from(this.rateLimitMetrics.values())
      .reduce((sum, metrics) => sum + metrics.successRate, 0) / totalEndpoints;

    return {
      healthyEndpoints,
      totalEndpoints,
      healthRatio: healthyEndpoints / totalEndpoints,
      avgResponseTime: Math.round(avgResponseTime),
      avgSuccessRate: Math.round(avgSuccessRate * 100),
      activeFailovers: this.failoverChains.size
    };
  }
}

export const intelligentRateLimiter = new IntelligentRateLimiter();