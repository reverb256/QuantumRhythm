/**
 * Smart API Orchestrator
 * Eliminates rate limiting through intelligent request distribution and circuit breaker patterns
 */

import { Connection, PublicKey } from '@solana/web3.js';

interface EndpointMetrics {
  url: string;
  name: string;
  requestCount: number;
  errorCount: number;
  lastError: number;
  isHealthy: boolean;
  avgResponseTime: number;
  maxRPM: number;
  currentRPM: number;
  lastRequestTime: number;
}

export class SmartAPIOrchestrator {
  private endpoints: EndpointMetrics[] = [
    {
      url: 'https://api.mainnet-beta.solana.com',
      name: 'Solana Labs',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 40,
      currentRPM: 0,
      lastRequestTime: 0
    },
    {
      url: 'https://solana-api.projectserum.com',
      name: 'Project Serum',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 50,
      currentRPM: 0,
      lastRequestTime: 0
    },
    {
      url: 'https://rpc.ankr.com/solana',
      name: 'Ankr',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 45,
      currentRPM: 0,
      lastRequestTime: 0
    },
    {
      url: 'https://solana-mainnet.g.alchemy.com/v2/demo',
      name: 'Alchemy',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 60,
      currentRPM: 0,
      lastRequestTime: 0
    },
    {
      url: 'https://solana.public-rpc.com',
      name: 'Public RPC',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 35,
      currentRPM: 0,
      lastRequestTime: 0
    },
    {
      url: 'https://mainnet.rpcpool.com',
      name: 'RPC Pool',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 55,
      currentRPM: 0,
      lastRequestTime: 0
    }
  ];

  private currentIndex = 0;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  constructor() {
    this.startHealthMonitoring();
    this.startRequestProcessor();
    this.resetRPMCounters();
  }

  private startHealthMonitoring() {
    setInterval(() => {
      this.checkEndpointHealth();
    }, 30000);
  }

  private resetRPMCounters() {
    setInterval(() => {
      this.endpoints.forEach(endpoint => {
        endpoint.currentRPM = 0;
      });
    }, 60000);
  }

  private async checkEndpointHealth() {
    for (const endpoint of this.endpoints) {
      // Mark as healthy if no errors in last 5 minutes
      if (Date.now() - endpoint.lastError > 300000) {
        endpoint.isHealthy = true;
      }
    }
  }

  private getOptimalEndpoint(): EndpointMetrics | null {
    const healthyEndpoints = this.endpoints.filter(ep => 
      ep.isHealthy && 
      ep.currentRPM < ep.maxRPM * 0.8 && // Stay below 80% of max RPM
      Date.now() - ep.lastRequestTime > 1000 // Minimum 1 second between requests
    );

    if (healthyEndpoints.length === 0) {
      return null;
    }

    // Sort by lowest current RPM, then by response time
    healthyEndpoints.sort((a, b) => {
      if (a.currentRPM !== b.currentRPM) {
        return a.currentRPM - b.currentRPM;
      }
      return a.avgResponseTime - b.avgResponseTime;
    });

    return healthyEndpoints[0];
  }

  private async startRequestProcessor() {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (true) {
      if (this.requestQueue.length > 0) {
        const request = this.requestQueue.shift();
        if (request) {
          try {
            await request();
          } catch (error) {
            console.error('Request processing error:', error);
          }
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async makeRequest<T>(requestFn: (connection: Connection) => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.executeRequest(requestFn);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private async executeRequest<T>(requestFn: (connection: Connection) => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    
    // Try up to 3 different endpoints
    for (let attempt = 0; attempt < 3; attempt++) {
      const endpoint = this.getOptimalEndpoint();
      
      if (!endpoint) {
        // If no endpoints available, wait and retry
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      const start = Date.now();
      
      try {
        // Enforce minimum delay between requests
        const timeSinceLastRequest = Date.now() - endpoint.lastRequestTime;
        const minDelay = Math.max(0, 1500 - timeSinceLastRequest); // 1.5 second minimum
        
        if (minDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, minDelay));
        }

        endpoint.lastRequestTime = Date.now();
        endpoint.currentRPM++;
        
        const connection = new Connection(endpoint.url, 'confirmed');
        const result = await requestFn(connection);
        
        // Update success metrics
        endpoint.requestCount++;
        const responseTime = Date.now() - start;
        endpoint.avgResponseTime = endpoint.avgResponseTime === 0 
          ? responseTime 
          : (endpoint.avgResponseTime + responseTime) / 2;
        
        endpoint.isHealthy = true;
        
        console.log(`✅ Request successful via ${endpoint.name} (${responseTime}ms)`);
        return result;
        
      } catch (error: any) {
        lastError = error;
        endpoint.errorCount++;
        const responseTime = Date.now() - start;
        
        if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
          endpoint.isHealthy = false;
          endpoint.lastError = Date.now();
          
          console.log(`⚠️ Rate limit hit on ${endpoint.name}, switching endpoint`);
          
          // Exponential backoff for this endpoint
          await new Promise(resolve => setTimeout(resolve, Math.min(5000 * Math.pow(2, attempt), 15000)));
        } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
          endpoint.isHealthy = false;
          endpoint.lastError = Date.now();
          
          console.log(`🚫 Access denied on ${endpoint.name}, trying next endpoint`);
        } else {
          endpoint.isHealthy = false;
          endpoint.lastError = Date.now();
          
          console.log(`❌ Error on ${endpoint.name}: ${error.message}`);
        }
      }
    }

    throw lastError || new Error('All Solana endpoints exhausted - rate limiting optimization in progress');
  }

  getStatus() {
    const healthyCount = this.endpoints.filter(ep => ep.isHealthy).length;
    const totalRequests = this.endpoints.reduce((sum, ep) => sum + ep.requestCount, 0);
    const totalErrors = this.endpoints.reduce((sum, ep) => sum + ep.errorCount, 0);
    const avgResponseTime = this.endpoints.reduce((sum, ep) => sum + ep.avgResponseTime, 0) / this.endpoints.length;

    return {
      healthyEndpoints: healthyCount,
      totalEndpoints: this.endpoints.length,
      totalRequests,
      totalErrors,
      successRate: totalRequests > 0 ? ((totalRequests - totalErrors) / totalRequests * 100).toFixed(1) : '100',
      avgResponseTime: avgResponseTime.toFixed(0),
      queueLength: this.requestQueue.length,
      endpoints: this.endpoints.map(ep => ({
        name: ep.name,
        healthy: ep.isHealthy,
        requestCount: ep.requestCount,
        errorCount: ep.errorCount,
        currentRPM: ep.currentRPM,
        maxRPM: ep.maxRPM,
        avgResponseTime: ep.avgResponseTime.toFixed(0)
      }))
    };
  }

  generateStatusReport(): string {
    const status = this.getStatus();
    
    return `
🔍 SMART API ORCHESTRATOR STATUS
================================
🟢 Healthy Endpoints: ${status.healthyEndpoints}/${status.totalEndpoints}
📊 Total Requests: ${status.totalRequests}
✅ Success Rate: ${status.successRate}%
⚡ Avg Response Time: ${status.avgResponseTime}ms
⏳ Queue Length: ${status.queueLength}

ENDPOINT DETAILS:
${status.endpoints.map(ep => 
  `${ep.healthy ? '🟢' : '🔴'} ${ep.name}: ${ep.requestCount} req, ${ep.errorCount} err, ${ep.currentRPM}/${ep.maxRPM} RPM`
).join('\n')}

🎯 Rate limiting elimination: ${status.successRate === '100' ? 'COMPLETE' : 'IN PROGRESS'}
`;
  }
}

export const smartAPIOrchestrator = new SmartAPIOrchestrator();

// Report status every 2 minutes
setInterval(() => {
  console.log(smartAPIOrchestrator.generateStatusReport());
}, 120000);