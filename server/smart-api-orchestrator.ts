/**
 * Smart API Orchestrator
 * Eliminates 429 rate limit errors with intelligent request management
 */

import axios from 'axios';
import { dataProtection } from './data-protection-middleware';

interface ApiEndpoint {
  url: string;
  provider: string;
  rpm: number; // requests per minute
  currentCount: number;
  lastReset: number;
  healthy: boolean;
  errorCount: number;
  avgDelay: number;
}

class SmartAPIOrchestrator {
  private endpoints: Map<string, ApiEndpoint> = new Map();
  private requestQueue: Map<string, Array<() => Promise<any>>> = new Map();
  private processing: Map<string, boolean> = new Map();

  constructor() {
    this.initializeEndpoints();
    this.startRateLimitManager();
  }

  private initializeEndpoints() {
    const configs = [
      { url: 'https://api.mainnet-beta.solana.com', provider: 'solana-main', rpm: 20 },
      { url: 'https://rpc.ankr.com/solana', provider: 'ankr', rpm: 40 },
      { url: 'https://frontend-api.pump.fun', provider: 'pumpfun', rpm: 10 }
    ];

    configs.forEach(config => {
      this.endpoints.set(config.provider, {
        url: config.url,
        provider: config.provider,
        rpm: config.rpm,
        currentCount: 0,
        lastReset: Date.now(),
        healthy: true,
        errorCount: 0,
        avgDelay: 0
      });
      this.requestQueue.set(config.provider, []);
      this.processing.set(config.provider, false);
    });
  }

  async makeRequest(type: 'solana' | 'pumpfun', requestFn: () => Promise<any>): Promise<any> {
    const provider = type === 'solana' ? 'ankr' : 'pumpfun';
    const endpoint = this.endpoints.get(provider);
    
    if (!endpoint || !endpoint.healthy) {
      // Use fallback endpoint
      const fallback = type === 'solana' ? 'solana-main' : 'pumpfun';
      const fallbackEndpoint = this.endpoints.get(fallback);
      if (fallbackEndpoint?.healthy) {
        return this.queueRequest(fallback, requestFn);
      }
      throw new Error(`No healthy endpoints for ${type}`);
    }

    return this.queueRequest(provider, requestFn);
  }

  private async queueRequest(provider: string, requestFn: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      const queue = this.requestQueue.get(provider);
      if (queue) {
        queue.push(async () => {
          try {
            const result = await this.executeRequest(provider, requestFn);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
        this.processQueue(provider);
      }
    });
  }

  private async processQueue(provider: string) {
    if (this.processing.get(provider)) return;
    
    this.processing.set(provider, true);
    const queue = this.requestQueue.get(provider);
    const endpoint = this.endpoints.get(provider);
    
    if (!queue || !endpoint) return;

    while (queue.length > 0 && endpoint.healthy) {
      if (!this.canMakeRequest(endpoint)) {
        await this.waitForRateLimit(endpoint);
        continue;
      }

      const request = queue.shift();
      if (request) {
        try {
          await request();
          endpoint.currentCount++;
        } catch (error) {
          // Error handling is done in executeRequest
        }
      }
    }
    
    this.processing.set(provider, false);
  }

  private canMakeRequest(endpoint: ApiEndpoint): boolean {
    const now = Date.now();
    
    // Reset counter every minute
    if (now - endpoint.lastReset > 60000) {
      endpoint.currentCount = 0;
      endpoint.lastReset = now;
    }
    
    return endpoint.currentCount < endpoint.rpm;
  }

  private async waitForRateLimit(endpoint: ApiEndpoint): Promise<void> {
    const timeUntilReset = 60000 - (Date.now() - endpoint.lastReset);
    const delay = Math.max(1000, timeUntilReset / (endpoint.rpm - endpoint.currentCount));
    
    console.log(`Rate limit wait: ${Math.round(delay)}ms for ${endpoint.provider}`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private async executeRequest(provider: string, requestFn: () => Promise<any>): Promise<any> {
    const endpoint = this.endpoints.get(provider);
    if (!endpoint) throw new Error(`Unknown provider: ${provider}`);

    const startTime = Date.now();
    
    try {
      const result = await requestFn();
      
      // Update success metrics
      const responseTime = Date.now() - startTime;
      endpoint.avgDelay = endpoint.avgDelay * 0.8 + responseTime * 0.2;
      endpoint.errorCount = Math.max(0, endpoint.errorCount - 1);
      
      return result;
      
    } catch (error: any) {
      endpoint.errorCount++;
      
      // Handle rate limits
      if (error.response?.status === 429 || error.message?.includes('429')) {
        console.log(`Rate limit hit for ${provider}, reducing RPM`);
        endpoint.rpm = Math.max(5, Math.floor(endpoint.rpm * 0.8));
        
        // Wait longer for 429 errors
        await new Promise(resolve => setTimeout(resolve, 5000));
        throw error;
      }
      
      // Mark unhealthy if too many errors
      if (endpoint.errorCount > 5) {
        endpoint.healthy = false;
        console.log(`Marking ${provider} as unhealthy`);
        
        // Auto-recovery after 5 minutes
        setTimeout(() => {
          endpoint.healthy = true;
          endpoint.errorCount = 0;
          console.log(`${provider} marked as healthy again`);
        }, 300000);
      }
      
      throw error;
    }
  }

  private startRateLimitManager() {
    // Reset counters and optimize rates every minute
    setInterval(() => {
      for (const endpoint of this.endpoints.values()) {
        // Gradually increase RPM if no recent errors
        if (endpoint.errorCount === 0 && endpoint.healthy) {
          endpoint.rpm = Math.min(endpoint.rpm * 1.1, endpoint.rpm + 5);
        }
      }
    }, 60000);

    // Health check every 30 seconds
    setInterval(() => {
      this.performHealthCheck();
    }, 30000);
  }

  private performHealthCheck() {
    for (const endpoint of this.endpoints.values()) {
      // Auto-recovery for unhealthy endpoints
      if (!endpoint.healthy && endpoint.errorCount < 3) {
        endpoint.healthy = true;
        console.log(`Auto-recovery: ${endpoint.provider} back online`);
      }
    }
  }

  getSystemStatus() {
    const endpoints = Array.from(this.endpoints.values());
    const healthy = endpoints.filter(e => e.healthy).length;
    const total = endpoints.length;
    
    return {
      healthyEndpoints: healthy,
      totalEndpoints: total,
      healthRatio: healthy / total,
      avgRPM: endpoints.reduce((sum, e) => sum + e.rpm, 0) / total,
      status: healthy > 0 ? 'operational' : 'degraded'
    };
  }
}

export const smartAPIOrchestrator = new SmartAPIOrchestrator();

// Integration functions for existing code
export async function makeOptimizedSolanaRequest<T>(requestFn: () => Promise<T>): Promise<T> {
  return smartAPIOrchestrator.makeRequest('solana', requestFn);
}

export async function makeOptimizedPumpFunRequest<T>(requestFn: () => Promise<T>): Promise<T> {
  return smartAPIOrchestrator.makeRequest('pumpfun', requestFn);
}