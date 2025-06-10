/**
 * Solana Endpoint Manager
 * Handles multiple RPC providers with intelligent failover and load balancing
 */

import { Connection, PublicKey } from '@solana/web3.js';

interface SolanaEndpoint {
  url: string;
  name: string;
  requestCount: number;
  errorCount: number;
  lastError: number;
  isHealthy: boolean;
  avgResponseTime: number;
  maxRPM: number;
}

export class SolanaEndpointManager {
  private endpoints: SolanaEndpoint[] = [
    {
      url: 'https://api.mainnet-beta.solana.com',
      name: 'Solana Labs',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 20
    },
    {
      url: 'https://solana-api.projectserum.com',
      name: 'Project Serum',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 30
    },
    {
      url: 'https://rpc.ankr.com/solana',
      name: 'Ankr',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 25
    }
  ];

  private currentIndex = 0;
  private lastReset = Date.now();

  constructor() {
    this.startHealthMonitoring();
  }

  private startHealthMonitoring() {
    setInterval(() => {
      this.resetCounters();
      this.checkEndpointHealth();
    }, 60000); // Reset every minute
  }

  private resetCounters() {
    const now = Date.now();
    if (now - this.lastReset >= 60000) {
      this.endpoints.forEach(endpoint => {
        endpoint.requestCount = 0;
      });
      this.lastReset = now;
    }
  }

  private async checkEndpointHealth() {
    for (const endpoint of this.endpoints) {
      try {
        const start = Date.now();
        const conn = new Connection(endpoint.url, 'confirmed');
        await conn.getSlot();
        const responseTime = Date.now() - start;
        
        endpoint.avgResponseTime = endpoint.avgResponseTime === 0 
          ? responseTime 
          : (endpoint.avgResponseTime + responseTime) / 2;
        
        endpoint.isHealthy = true;
      } catch (error) {
        endpoint.isHealthy = false;
        endpoint.errorCount++;
        endpoint.lastError = Date.now();
      }
    }
  }

  private getNextHealthyEndpoint(): SolanaEndpoint | null {
    const healthyEndpoints = this.endpoints.filter(ep => 
      ep.isHealthy && ep.requestCount < ep.maxRPM
    );

    if (healthyEndpoints.length === 0) {
      // If no healthy endpoints available, use least loaded one
      return this.endpoints.reduce((prev, current) => 
        prev.requestCount < current.requestCount ? prev : current
      );
    }

    // Round robin among healthy endpoints
    const endpoint = healthyEndpoints[this.currentIndex % healthyEndpoints.length];
    this.currentIndex++;
    return endpoint;
  }

  async makeRequest<T>(requestFn: (connection: Connection) => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    
    // Try up to 3 different endpoints
    for (let attempt = 0; attempt < 3; attempt++) {
      const endpoint = this.getNextHealthyEndpoint();
      if (!endpoint) {
        throw new Error('No Solana endpoints available');
      }

      try {
        const start = Date.now();
        const connection = new Connection(endpoint.url, 'confirmed');
        const result = await requestFn(connection);
        
        // Update metrics on success
        endpoint.requestCount++;
        const responseTime = Date.now() - start;
        endpoint.avgResponseTime = endpoint.avgResponseTime === 0 
          ? responseTime 
          : (endpoint.avgResponseTime + responseTime) / 2;
        
        return result;
      } catch (error: any) {
        lastError = error;
        endpoint.errorCount++;
        endpoint.isHealthy = false;
        endpoint.lastError = Date.now();
        
        // If rate limited, mark endpoint as unhealthy temporarily
        if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
          endpoint.isHealthy = false;
          // Wait before retrying with different endpoint
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError || new Error('All Solana endpoints failed');
  }

  getHealthStatus() {
    return {
      endpoints: this.endpoints.map(ep => ({
        name: ep.name,
        url: ep.url,
        isHealthy: ep.isHealthy,
        requestCount: ep.requestCount,
        errorCount: ep.errorCount,
        avgResponseTime: ep.avgResponseTime
      })),
      totalHealthy: this.endpoints.filter(ep => ep.isHealthy).length,
      totalEndpoints: this.endpoints.length
    };
  }
}

export const solanaEndpointManager = new SolanaEndpointManager();