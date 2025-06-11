/**
 * API Efficiency Manager
 * Handles all external API calls with intelligent rate limiting and failover
 */

import axios, { AxiosResponse } from 'axios';
import { dataProtection } from './data-protection-middleware';

interface EndpointHealth {
  url: string;
  provider: string;
  requestsPerMinute: number;
  errorRate: number;
  avgResponseTime: number;
  lastSuccessTime: number;
  consecutiveErrors: number;
  isHealthy: boolean;
}

export class APIEfficiencyManager {
  private endpoints: Map<string, EndpointHealth> = new Map();
  private requestCounters: Map<string, number[]> = new Map();
  private delayMultiplier: Map<string, number> = new Map();

  constructor() {
    this.initializeEndpoints();
    this.startHealthMonitoring();
  }

  private initializeEndpoints() {
    const endpoints = [
      { 
        url: 'https://api.mainnet-beta.solana.com', 
        provider: 'solana-official',
        baseRPM: 30
      },
      { 
        url: 'https://rpc.ankr.com/solana', 
        provider: 'ankr-solana',
        baseRPM: 60
      },
      { 
        url: 'https://frontend-api.pump.fun', 
        provider: 'pumpfun-api',
        baseRPM: 15
      }
    ];

    endpoints.forEach(ep => {
      this.endpoints.set(ep.url, {
        url: ep.url,
        provider: ep.provider,
        requestsPerMinute: ep.baseRPM,
        errorRate: 0,
        avgResponseTime: 0,
        lastSuccessTime: Date.now(),
        consecutiveErrors: 0,
        isHealthy: true
      });
      this.requestCounters.set(ep.url, []);
      this.delayMultiplier.set(ep.url, 1);
    });
  }

  async makeOptimizedRequest<T>(
    endpointType: 'solana-rpc' | 'pump-fun' | 'market-data',
    requestConfig: {
      path: string;
      method?: 'GET' | 'POST';
      data?: any;
      timeout?: number;
    }
  ): Promise<T> {
    const availableEndpoints = this.getHealthyEndpoints(endpointType);
    
    if (availableEndpoints.length === 0) {
      throw new Error(`No healthy endpoints available for ${endpointType}`);
    }

    const bestEndpoint = this.selectBestEndpoint(availableEndpoints);
    
    // Check rate limit before making request
    if (!this.canMakeRequest(bestEndpoint.url)) {
      await this.waitForRateLimit(bestEndpoint.url);
    }

    return this.executeRequest<T>(bestEndpoint, requestConfig);
  }

  private getHealthyEndpoints(type: string): EndpointHealth[] {
    const typeMapping: Record<string, string[]> = {
      'solana-rpc': ['https://api.mainnet-beta.solana.com', 'https://rpc.ankr.com/solana'],
      'pump-fun': ['https://frontend-api.pump.fun'],
      'market-data': ['https://api.mainnet-beta.solana.com', 'https://rpc.ankr.com/solana']
    };

    const relevantUrls = typeMapping[type] || [];
    return relevantUrls
      .map(url => this.endpoints.get(url))
      .filter((ep): ep is EndpointHealth => ep !== undefined && ep.isHealthy)
      .sort((a, b) => this.calculateScore(b) - this.calculateScore(a));
  }

  private selectBestEndpoint(endpoints: EndpointHealth[]): EndpointHealth {
    return endpoints[0]; // Already sorted by score
  }

  private calculateScore(endpoint: EndpointHealth): number {
    const timeScore = Math.max(0, 100 - endpoint.avgResponseTime / 10);
    const reliabilityScore = Math.max(0, 100 - (endpoint.errorRate * 100));
    const availabilityScore = endpoint.consecutiveErrors === 0 ? 100 : Math.max(0, 100 - (endpoint.consecutiveErrors * 20));
    
    return (timeScore + reliabilityScore + availabilityScore) / 3;
  }

  private canMakeRequest(url: string): boolean {
    const endpoint = this.endpoints.get(url);
    if (!endpoint) return false;

    const requests = this.requestCounters.get(url) || [];
    const oneMinuteAgo = Date.now() - 60000;
    const recentRequests = requests.filter(time => time > oneMinuteAgo);
    
    return recentRequests.length < endpoint.requestsPerMinute;
  }

  private async waitForRateLimit(url: string): Promise<void> {
    const endpoint = this.endpoints.get(url);
    const multiplier = this.delayMultiplier.get(url) || 1;
    
    const baseDelay = endpoint ? (60000 / endpoint.requestsPerMinute) : 2000;
    const delay = Math.min(30000, baseDelay * multiplier);
    
    console.log(`Rate limit reached for ${endpoint?.provider}, waiting ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private async executeRequest<T>(
    endpoint: EndpointHealth,
    config: {
      path: string;
      method?: 'GET' | 'POST';
      data?: any;
      timeout?: number;
    }
  ): Promise<T> {
    const startTime = Date.now();
    const url = `${endpoint.url}${config.path}`;
    
    try {
      // Track request
      const requests = this.requestCounters.get(endpoint.url) || [];
      requests.push(Date.now());
      this.requestCounters.set(endpoint.url, requests);

      const response: AxiosResponse<T> = await axios({
        method: config.method || 'GET',
        url,
        data: config.data,
        timeout: config.timeout || 5000,
        headers: {
          'User-Agent': 'QuantumTrader/1.0',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Update success metrics
      this.updateSuccessMetrics(endpoint, Date.now() - startTime);
      
      return response.data;

    } catch (error: any) {
      // Update error metrics
      this.updateErrorMetrics(endpoint, error);
      
      // Handle specific error types
      if (error.response?.status === 429) {
        this.handleRateLimitError(endpoint);
        throw new Error(`Rate limit exceeded for ${endpoint.provider}`);
      }
      
      if (error.response?.status >= 500) {
        this.handleServerError(endpoint);
      }
      
      const sanitizedError = dataProtection.sanitizeQuery(error.message || 'API request failed');
      throw new Error(`${endpoint.provider} API error: ${sanitizedError}`);
    }
  }

  private updateSuccessMetrics(endpoint: EndpointHealth, responseTime: number) {
    // Update response time (exponential moving average)
    endpoint.avgResponseTime = endpoint.avgResponseTime * 0.8 + responseTime * 0.2;
    
    // Improve error rate
    endpoint.errorRate = Math.max(0, endpoint.errorRate * 0.95);
    
    // Reset consecutive errors
    endpoint.consecutiveErrors = 0;
    endpoint.lastSuccessTime = Date.now();
    endpoint.isHealthy = true;
    
    // Reduce delay multiplier on success
    const currentMultiplier = this.delayMultiplier.get(endpoint.url) || 1;
    this.delayMultiplier.set(endpoint.url, Math.max(1, currentMultiplier * 0.9));
  }

  private updateErrorMetrics(endpoint: EndpointHealth, error: any) {
    // Increase error rate
    endpoint.errorRate = Math.min(1, endpoint.errorRate + 0.1);
    
    // Increment consecutive errors
    endpoint.consecutiveErrors++;
    
    // Mark as unhealthy if too many consecutive errors
    if (endpoint.consecutiveErrors >= 3) {
      endpoint.isHealthy = false;
      
      // Auto-recovery after 5 minutes
      setTimeout(() => {
        endpoint.isHealthy = true;
        endpoint.consecutiveErrors = 0;
        endpoint.errorRate = Math.min(0.5, endpoint.errorRate);
      }, 300000);
    }
  }

  private handleRateLimitError(endpoint: EndpointHealth) {
    // More aggressive rate limit reduction
    endpoint.requestsPerMinute = Math.max(3, Math.floor(endpoint.requestsPerMinute * 0.5));
    
    // Exponential backoff for severely rate-limited endpoints
    const currentMultiplier = this.delayMultiplier.get(endpoint.url) || 1;
    this.delayMultiplier.set(endpoint.url, Math.min(10, currentMultiplier * 2));
    
    // Temporarily disable endpoint if too many rate limit errors
    endpoint.consecutiveErrors++;
    if (endpoint.consecutiveErrors >= 5) {
      endpoint.isHealthy = false;
      console.log(`🚫 Endpoint ${endpoint.provider} temporarily disabled due to persistent rate limiting`);
      
      // Re-enable after extended cooldown
      setTimeout(() => {
        endpoint.isHealthy = true;
        endpoint.consecutiveErrors = 0;
        endpoint.requestsPerMinute = Math.max(1, endpoint.requestsPerMinute);
        console.log(`✅ Endpoint ${endpoint.provider} re-enabled after cooldown`);
      }, 900000); // 15 minutes
    }
    
    console.log(`⚠️ Rate limit updated for ${endpoint.provider}: ${endpoint.requestsPerMinute} RPM (multiplier: ${currentMultiplier}x)`);
  }

  private handleServerError(endpoint: EndpointHealth) {
    // Temporarily mark as unhealthy
    endpoint.isHealthy = false;
    
    // Auto-recovery after 2 minutes for server errors
    setTimeout(() => {
      endpoint.isHealthy = true;
      endpoint.consecutiveErrors = Math.max(0, endpoint.consecutiveErrors - 1);
    }, 120000);
  }

  private startHealthMonitoring() {
    // Clean old request counters every minute
    setInterval(() => {
      const oneMinuteAgo = Date.now() - 60000;
      
      for (const [url, requests] of this.requestCounters.entries()) {
        const recentRequests = requests.filter(time => time > oneMinuteAgo);
        this.requestCounters.set(url, recentRequests);
      }
    }, 60000);

    // Health check every 30 seconds
    setInterval(() => {
      this.performHealthCheck();
    }, 30000);
  }

  private performHealthCheck() {
    for (const endpoint of this.endpoints.values()) {
      const timeSinceLastSuccess = Date.now() - endpoint.lastSuccessTime;
      
      // Mark as unhealthy if no success in 10 minutes
      if (timeSinceLastSuccess > 600000) {
        endpoint.isHealthy = false;
      }
      
      // Auto-recovery for long-failed endpoints
      if (timeSinceLastSuccess > 1800000) { // 30 minutes
        endpoint.isHealthy = true;
        endpoint.consecutiveErrors = 0;
        endpoint.errorRate = 0.5;
      }
    }
  }

  public getSystemStatus() {
    const totalEndpoints = this.endpoints.size;
    const healthyEndpoints = Array.from(this.endpoints.values())
      .filter(ep => ep.isHealthy).length;
    
    const avgResponseTime = Array.from(this.endpoints.values())
      .reduce((sum, ep) => sum + ep.avgResponseTime, 0) / totalEndpoints;
    
    const avgErrorRate = Array.from(this.endpoints.values())
      .reduce((sum, ep) => sum + ep.errorRate, 0) / totalEndpoints;

    return {
      healthyEndpoints,
      totalEndpoints,
      healthRatio: healthyEndpoints / totalEndpoints,
      avgResponseTime: Math.round(avgResponseTime),
      avgErrorRate: Math.round(avgErrorRate * 100),
      systemHealth: healthyEndpoints > 0 ? 'operational' : 'degraded'
    };
  }
}

export const apiEfficiencyManager = new APIEfficiencyManager();