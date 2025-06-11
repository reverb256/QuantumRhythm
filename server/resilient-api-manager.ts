/**
 * Resilient API Manager - Fixes 90% Endpoint Failure Rate
 * Implements circuit breaker patterns and intelligent failover
 */

import { coreTrader } from './core-trading-engine';

interface APIEndpoint {
  name: string;
  url: string;
  provider: string;
  priority: number;
  rateLimit: number;
  currentRequests: number;
  lastReset: number;
  failureCount: number;
  successCount: number;
  avgResponseTime: number;
  isHealthy: boolean;
  lastHealthCheck: number;
}

interface CircuitBreaker {
  isOpen: boolean;
  failureThreshold: number;
  timeout: number;
  nextAttempt: number;
  failureCount: number;
}

export class ResilientAPIManager {
  private endpoints: Map<string, APIEndpoint> = new Map();
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private requestQueue: Array<{
    operation: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
    priority: number;
  }> = [];
  private isProcessingQueue = false;

  constructor() {
    this.initializeEndpoints();
    this.startHealthMonitoring();
  }

  private initializeEndpoints(): void {
    const endpointConfigs = [
      { name: 'Solana Labs', url: 'https://api.mainnet-beta.solana.com', priority: 1, rateLimit: 40 },
      { name: 'PublicNode', url: 'https://solana-mainnet.public.blastapi.io', priority: 2, rateLimit: 20 },
      { name: 'Ankr', url: 'https://rpc.ankr.com/solana', priority: 3, rateLimit: 30 },
      { name: 'QuickNode', url: 'https://neat-patient-panorama.solana-mainnet.discover.quiknode.pro', priority: 4, rateLimit: 25 },
      { name: 'Helius', url: 'https://mainnet.helius-rpc.com', priority: 5, rateLimit: 20 },
    ];

    endpointConfigs.forEach(config => {
      const endpoint: APIEndpoint = {
        ...config,
        provider: config.name,
        currentRequests: 0,
        lastReset: Date.now(),
        failureCount: 0,
        successCount: 0,
        avgResponseTime: 0,
        isHealthy: true,
        lastHealthCheck: Date.now(),
      };

      this.endpoints.set(config.name, endpoint);
      this.circuitBreakers.set(config.name, {
        isOpen: false,
        failureThreshold: 5,
        timeout: 30000,
        nextAttempt: 0,
        failureCount: 0,
      });
    });

    console.log('🔄 Initialized resilient API endpoints');
  }

  async executeRequest<T>(
    operation: (endpoint: APIEndpoint) => Promise<T>,
    priority: number = 1
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        operation: () => this.executeWithFailover(operation),
        resolve,
        reject,
        priority,
      });

      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      // Sort by priority
      this.requestQueue.sort((a, b) => b.priority - a.priority);
      const request = this.requestQueue.shift()!;

      try {
        const result = await request.operation();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }

      // Small delay to prevent overwhelming endpoints
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    this.isProcessingQueue = false;
  }

  private async executeWithFailover<T>(
    operation: (endpoint: APIEndpoint) => Promise<T>
  ): Promise<T> {
    const healthyEndpoints = Array.from(this.endpoints.values())
      .filter(endpoint => this.isEndpointAvailable(endpoint))
      .sort((a, b) => a.priority - b.priority);

    if (healthyEndpoints.length === 0) {
      throw new Error('No healthy endpoints available');
    }

    let lastError: Error | null = null;

    for (const endpoint of healthyEndpoints) {
      if (!this.canMakeRequest(endpoint)) {
        continue;
      }

      const circuitBreaker = this.circuitBreakers.get(endpoint.name)!;
      if (circuitBreaker.isOpen && Date.now() < circuitBreaker.nextAttempt) {
        continue;
      }

      try {
        const startTime = Date.now();
        endpoint.currentRequests++;
        
        const result = await Promise.race([
          operation(endpoint),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 10000)
          )
        ]);

        const responseTime = Date.now() - startTime;
        this.recordSuccess(endpoint, responseTime);
        
        return result;

      } catch (error) {
        lastError = error as Error;
        this.recordFailure(endpoint, lastError);
      } finally {
        endpoint.currentRequests--;
      }
    }

    throw lastError || new Error('All endpoints failed');
  }

  private isEndpointAvailable(endpoint: APIEndpoint): boolean {
    const circuitBreaker = this.circuitBreakers.get(endpoint.name)!;
    
    if (circuitBreaker.isOpen) {
      if (Date.now() >= circuitBreaker.nextAttempt) {
        circuitBreaker.isOpen = false;
        circuitBreaker.failureCount = 0;
        console.log(`🔄 Circuit breaker reset for ${endpoint.name}`);
      } else {
        return false;
      }
    }

    return endpoint.isHealthy;
  }

  private canMakeRequest(endpoint: APIEndpoint): boolean {
    const now = Date.now();
    
    // Reset rate limit counter every minute
    if (now - endpoint.lastReset > 60000) {
      endpoint.currentRequests = 0;
      endpoint.lastReset = now;
    }

    return endpoint.currentRequests < endpoint.rateLimit;
  }

  private recordSuccess(endpoint: APIEndpoint, responseTime: number): void {
    endpoint.successCount++;
    endpoint.avgResponseTime = endpoint.avgResponseTime === 0 
      ? responseTime 
      : (endpoint.avgResponseTime + responseTime) / 2;
    
    const circuitBreaker = this.circuitBreakers.get(endpoint.name)!;
    circuitBreaker.failureCount = Math.max(0, circuitBreaker.failureCount - 1);
    
    endpoint.isHealthy = true;
  }

  private recordFailure(endpoint: APIEndpoint, error: Error): void {
    endpoint.failureCount++;
    
    const circuitBreaker = this.circuitBreakers.get(endpoint.name)!;
    circuitBreaker.failureCount++;

    if (circuitBreaker.failureCount >= circuitBreaker.failureThreshold) {
      circuitBreaker.isOpen = true;
      circuitBreaker.nextAttempt = Date.now() + circuitBreaker.timeout;
      console.log(`⚡ Circuit breaker opened for ${endpoint.name} - too many failures`);
    }

    // Mark as unhealthy if failure rate is too high
    const totalRequests = endpoint.successCount + endpoint.failureCount;
    if (totalRequests > 10 && endpoint.failureCount / totalRequests > 0.7) {
      endpoint.isHealthy = false;
    }
  }

  private startHealthMonitoring(): void {
    setInterval(async () => {
      for (const [name, endpoint] of this.endpoints) {
        if (Date.now() - endpoint.lastHealthCheck > 300000) { // 5 minutes
          await this.performHealthCheck(endpoint);
        }
      }

      this.printHealthSummary();
    }, 60000); // Check every minute
  }

  private async performHealthCheck(endpoint: APIEndpoint): Promise<void> {
    try {
      const startTime = Date.now();
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getHealth'
        }),
      });

      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        endpoint.isHealthy = true;
        endpoint.avgResponseTime = responseTime;
        console.log(`✅ Health check passed for ${endpoint.name} (${responseTime}ms)`);
      } else {
        endpoint.isHealthy = false;
      }
    } catch (error) {
      endpoint.isHealthy = false;
    }

    endpoint.lastHealthCheck = Date.now();
  }

  private printHealthSummary(): void {
    const healthyCount = Array.from(this.endpoints.values()).filter(e => e.isHealthy).length;
    const totalCount = this.endpoints.size;
    
    console.log('🔍 API HEALTH SUMMARY');
    console.log(`   Healthy endpoints: ${healthyCount}/${totalCount}`);
    console.log(`   Success rate: ${this.calculateOverallSuccessRate().toFixed(1)}%`);
    console.log(`   Queue length: ${this.requestQueue.length}`);
  }

  private calculateOverallSuccessRate(): number {
    let totalSuccess = 0;
    let totalRequests = 0;

    for (const endpoint of this.endpoints.values()) {
      totalSuccess += endpoint.successCount;
      totalRequests += endpoint.successCount + endpoint.failureCount;
    }

    return totalRequests > 0 ? (totalSuccess / totalRequests) * 100 : 0;
  }

  getStatus() {
    return {
      healthyEndpoints: Array.from(this.endpoints.values()).filter(e => e.isHealthy).length,
      totalEndpoints: this.endpoints.size,
      successRate: this.calculateOverallSuccessRate(),
      queueLength: this.requestQueue.length,
      endpoints: Array.from(this.endpoints.entries()).map(([name, endpoint]) => ({
        name,
        isHealthy: endpoint.isHealthy,
        successCount: endpoint.successCount,
        failureCount: endpoint.failureCount,
        avgResponseTime: endpoint.avgResponseTime,
        currentRequests: endpoint.currentRequests,
        rateLimit: endpoint.rateLimit,
      }))
    };
  }
}

export const apiManager = new ResilientAPIManager();