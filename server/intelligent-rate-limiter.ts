/**
 * Intelligent Rate Limiter with Adaptive Discovery
 * Dynamically discovers rate limits and implements intelligent failover
 */

import axios from 'axios';
import { dataProtection } from './data-protection-middleware';

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
    const endpointConfigs = [
      {
        url: 'https://api.mainnet-beta.solana.com',
        provider: 'solana-official',
        rateLimit: 30,
        priority: 8
      },
      {
        url: 'https://rpc.ankr.com/solana',
        provider: 'ankr-solana',
        rateLimit: 60,
        priority: 9
      },
      {
        url: 'https://frontend-api.pump.fun',
        provider: 'pumpfun-api',
        rateLimit: 15,
        priority: 7
      },
      {
        url: 'https://api.dexscreener.com/latest/dex',
        provider: 'dexscreener',
        rateLimit: 20,
        priority: 6
      }
    ];

    endpointConfigs.forEach(config => {
      this.registerEndpoint({
        url: config.url,
        provider: config.provider,
        rateLimit: config.rateLimit,
        currentUsage: 0,
        lastReset: new Date(),
        priority: config.priority,
        responseTime: 1000,
        errorRate: 0,
        status: 'healthy'
      });
    });

    // Setup failover chains
    this.failoverChains.set('solana-rpc', ['ankr-solana', 'solana-official']);
    this.failoverChains.set('pump-fun', ['pumpfun-api']);
    this.failoverChains.set('market-data', ['dexscreener']);
  }

  private registerEndpoint(endpoint: ApiEndpoint) {
    this.endpoints.set(endpoint.provider, endpoint);
    this.requestQueues.set(endpoint.provider, []);
    this.adaptiveDelay.set(endpoint.provider, 1000);
    
    this.rateLimitMetrics.set(endpoint.provider, {
      endpoint: endpoint.url,
      requestsPerMinute: endpoint.rateLimit,
      burstCapacity: Math.floor(endpoint.rateLimit * 0.8),
      cooldownPeriod: 60000,
      backoffStrategy: 'exponential',
      successRate: 1.0
    });
  }

  public async makeRequest<T>(
    endpointType: 'solana-rpc' | 'pump-fun' | 'market-data',
    requestFunction: (url: string) => Promise<T>,
    retryCount: number = 0
  ): Promise<T> {
    const availableEndpoints = this.getAvailableEndpoints(endpointType);
    
    if (availableEndpoints.length === 0) {
      throw new Error(`No available endpoints for ${endpointType}`);
    }

    const bestEndpoint = this.selectBestEndpoint(availableEndpoints);
    
    if (!this.canMakeRequest(bestEndpoint.url)) {
      await this.handleRateLimit(endpointType, requestFunction, retryCount);
      return this.makeRequest(endpointType, requestFunction, retryCount + 1);
    }

    try {
      this.trackRequest(bestEndpoint.url);
      const startTime = Date.now();
      
      const result = await requestFunction(bestEndpoint.url);
      
      const responseTime = Date.now() - startTime;
      this.updateSuccessMetrics(bestEndpoint.url, responseTime);
      
      return result;
      
    } catch (error: any) {
      this.updateErrorMetrics(bestEndpoint.url);
      
      // Handle 429 specifically
      if (error.response?.status === 429 || error.message?.includes('429')) {
        this.discoverActualRateLimit(bestEndpoint.url);
        return this.handleRateLimit(endpointType, requestFunction, retryCount);
      }
      
      // Handle server errors with failover
      if (error.response?.status >= 500) {
        return this.handleServerError(endpointType, requestFunction, retryCount);
      }
      
      throw error;
    }
  }

  private getAvailableEndpoints(type: 'solana-rpc' | 'pump-fun' | 'market-data'): ApiEndpoint[] {
    const chain = this.failoverChains.get(type) || [];
    return chain
      .map(provider => this.endpoints.get(provider))
      .filter((endpoint): endpoint is ApiEndpoint => 
        endpoint !== undefined && endpoint.status !== 'unavailable'
      )
      .sort((a, b) => this.calculateEndpointScore(b) - this.calculateEndpointScore(a));
  }

  private selectBestEndpoint(endpoints: ApiEndpoint[]): ApiEndpoint {
    return endpoints[0]; // Already sorted by score
  }

  private calculateEndpointScore(endpoint: ApiEndpoint): number {
    const healthScore = endpoint.status === 'healthy' ? 100 : 
                      endpoint.status === 'degraded' ? 50 : 0;
    const speedScore = Math.max(0, 100 - (endpoint.responseTime / 50));
    const reliabilityScore = Math.max(0, 100 - (endpoint.errorRate * 100));
    const priorityScore = endpoint.priority * 10;
    
    return (healthScore + speedScore + reliabilityScore + priorityScore) / 4;
  }

  private canMakeRequest(url: string): boolean {
    const endpoint = this.endpoints.get(this.getProviderFromUrl(url));
    if (!endpoint) return false;

    const now = new Date();
    const timeSinceReset = now.getTime() - endpoint.lastReset.getTime();
    
    // Reset usage counter every minute
    if (timeSinceReset >= 60000) {
      endpoint.currentUsage = 0;
      endpoint.lastReset = now;
    }
    
    return endpoint.currentUsage < endpoint.rateLimit;
  }

  private trackRequest(url: string) {
    const provider = this.getProviderFromUrl(url);
    const endpoint = this.endpoints.get(provider);
    if (endpoint) {
      endpoint.currentUsage++;
    }
  }

  private async handleRateLimit<T>(
    endpointType: 'solana-rpc' | 'pump-fun' | 'market-data',
    requestFunction: (url: string) => Promise<T>,
    retryCount: number
  ): Promise<T> {
    if (retryCount >= 3) {
      throw new Error(`Max retries exceeded for ${endpointType}`);
    }

    // Try next endpoint in chain
    const availableEndpoints = this.getAvailableEndpoints(endpointType);
    if (availableEndpoints.length > retryCount + 1) {
      return this.makeRequest(endpointType, requestFunction, retryCount);
    }

    // Wait with adaptive delay
    const delay = this.calculateAdaptiveDelay(endpointType, retryCount);
    console.log(`Rate limit reached, waiting ${delay}ms before retry`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return this.makeRequest(endpointType, requestFunction, retryCount);
  }

  private async handleServerError<T>(
    endpointType: 'solana-rpc' | 'pump-fun' | 'market-data',
    requestFunction: (url: string) => Promise<T>,
    retryCount: number
  ): Promise<T> {
    if (retryCount >= 2) {
      throw new Error(`Server error retry limit exceeded for ${endpointType}`);
    }

    // Mark current endpoint as degraded
    const availableEndpoints = this.getAvailableEndpoints(endpointType);
    if (availableEndpoints.length > 0) {
      availableEndpoints[0].status = 'degraded';
    }

    // Try failover
    return this.makeRequest(endpointType, requestFunction, retryCount + 1);
  }

  private discoverActualRateLimit(url: string) {
    const provider = this.getProviderFromUrl(url);
    const endpoint = this.endpoints.get(provider);
    const metrics = this.rateLimitMetrics.get(provider);
    
    if (endpoint && metrics) {
      // Reduce rate limit estimate by 20%
      const newLimit = Math.max(5, Math.floor(endpoint.rateLimit * 0.8));
      endpoint.rateLimit = newLimit;
      metrics.requestsPerMinute = newLimit;
      
      console.log(`Discovered rate limit for ${provider}: ${newLimit} RPM`);
    }
  }

  private calculateAdaptiveDelay(endpointType: string, retryCount: number): number {
    const baseDelay = this.adaptiveDelay.get(endpointType) || 1000;
    
    switch (retryCount) {
      case 0: return baseDelay;
      case 1: return baseDelay * 2;
      case 2: return baseDelay * 4;
      default: return Math.min(30000, baseDelay * Math.pow(2, retryCount));
    }
  }

  private fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }

  private updateSuccessMetrics(url: string, responseTime: number) {
    const provider = this.getProviderFromUrl(url);
    const endpoint = this.endpoints.get(provider);
    const metrics = this.rateLimitMetrics.get(provider);
    
    if (endpoint && metrics) {
      // Update response time (exponential moving average)
      endpoint.responseTime = endpoint.responseTime * 0.8 + responseTime * 0.2;
      
      // Improve error rate
      endpoint.errorRate = Math.max(0, endpoint.errorRate * 0.95);
      
      // Improve success rate
      metrics.successRate = Math.min(1, metrics.successRate * 0.95 + 0.05);
      
      // Mark as healthy if performing well
      if (endpoint.errorRate < 0.1 && responseTime < 5000) {
        endpoint.status = 'healthy';
      }
    }
  }

  private updateErrorMetrics(url: string) {
    const provider = this.getProviderFromUrl(url);
    const endpoint = this.endpoints.get(provider);
    const metrics = this.rateLimitMetrics.get(provider);
    
    if (endpoint && metrics) {
      // Increase error rate
      endpoint.errorRate = Math.min(1, endpoint.errorRate + 0.1);
      
      // Decrease success rate
      metrics.successRate = Math.max(0, metrics.successRate * 0.9);
      
      // Mark as degraded if too many errors
      if (endpoint.errorRate > 0.3) {
        endpoint.status = 'degraded';
      }
      
      // Mark as unavailable if very high error rate
      if (endpoint.errorRate > 0.7) {
        endpoint.status = 'unavailable';
        
        // Auto-recovery after 5 minutes
        setTimeout(() => {
          endpoint.status = 'degraded';
          endpoint.errorRate = 0.5;
        }, 300000);
      }
    }
  }

  private getProviderFromUrl(url: string): string {
    for (const [provider, endpoint] of this.endpoints.entries()) {
      if (endpoint.url === url || url.includes(endpoint.url)) {
        return provider;
      }
    }
    return 'unknown';
  }

  private startAdaptiveMonitoring() {
    // Reset usage counters and optimize strategies every minute
    setInterval(() => {
      this.resetUsageCounters();
      this.optimizeStrategies();
    }, 60000);

    // Health check every 30 seconds
    setInterval(() => {
      this.healthCheck();
    }, 30000);
  }

  private resetUsageCounters() {
    const now = new Date();
    for (const endpoint of this.endpoints.values()) {
      const timeSinceReset = now.getTime() - endpoint.lastReset.getTime();
      if (timeSinceReset >= 60000) {
        endpoint.currentUsage = 0;
        endpoint.lastReset = now;
      }
    }
  }

  private optimizeStrategies() {
    for (const [provider, metrics] of this.rateLimitMetrics.entries()) {
      const endpoint = this.endpoints.get(provider);
      if (endpoint && metrics.successRate > 0.9 && endpoint.errorRate < 0.1) {
        // Gradually increase rate limit if performing well
        const newLimit = Math.min(endpoint.rateLimit * 1.1, endpoint.rateLimit + 2);
        endpoint.rateLimit = Math.floor(newLimit);
        metrics.requestsPerMinute = endpoint.rateLimit;
      }
    }
  }

  private healthCheck() {
    for (const endpoint of this.endpoints.values()) {
      // Auto-recovery for degraded endpoints
      if (endpoint.status === 'degraded' && endpoint.errorRate < 0.2) {
        endpoint.status = 'healthy';
        console.log(`Auto-recovery: ${endpoint.provider} back to healthy`);
      }
      
      // Mark as degraded if response time is too high
      if (endpoint.responseTime > 10000 && endpoint.status === 'healthy') {
        endpoint.status = 'degraded';
        console.log(`Marking ${endpoint.provider} as degraded due to slow response`);
      }
    }
  }

  public getSystemStatus() {
    const endpoints = Array.from(this.endpoints.values());
    const healthyCount = endpoints.filter(e => e.status === 'healthy').length;
    const degradedCount = endpoints.filter(e => e.status === 'degraded').length;
    const unavailableCount = endpoints.filter(e => e.status === 'unavailable').length;
    
    const avgResponseTime = endpoints.reduce((sum, e) => sum + e.responseTime, 0) / endpoints.length;
    const avgErrorRate = endpoints.reduce((sum, e) => sum + e.errorRate, 0) / endpoints.length;
    
    return {
      totalEndpoints: endpoints.length,
      healthyEndpoints: healthyCount,
      degradedEndpoints: degradedCount,
      unavailableEndpoints: unavailableCount,
      avgResponseTime: Math.round(avgResponseTime),
      avgErrorRate: Math.round(avgErrorRate * 100),
      systemHealth: healthyCount > 0 ? 'operational' : 'degraded',
      details: endpoints.map(e => ({
        provider: e.provider,
        status: e.status,
        rateLimit: e.rateLimit,
        currentUsage: e.currentUsage,
        responseTime: Math.round(e.responseTime),
        errorRate: Math.round(e.errorRate * 100)
      }))
    };
  }
}

export const intelligentRateLimiter = new IntelligentRateLimiter();