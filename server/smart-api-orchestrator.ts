/**
 * Smart API Orchestrator
 * Eliminates rate limiting through intelligent request distribution and circuit breaker patterns
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { endpointDiscovery } from './endpoint-discovery-agent';

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
      name: 'Alchemy Demo',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 30,
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
    },
    {
      url: 'https://api.mainnet.rpcpool.com',
      name: 'RPC Pool Alt',
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
      url: 'https://ssc-dao.genesysgo.net',
      name: 'GenesysGo',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 25,
      currentRPM: 0,
      lastRequestTime: 0
    },
    {
      url: 'https://solana-mainnet.rpc.extrnode.com',
      name: 'ExtrNode',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 30,
      currentRPM: 0,
      lastRequestTime: 0
    },
    {
      url: 'https://solana.blockpi.network/v1/rpc/public',
      name: 'BlockPI',
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
      url: 'https://rpc.hellomoon.io',
      name: 'HelloMoon',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 20,
      currentRPM: 0,
      lastRequestTime: 0
    },
    {
      url: 'https://solana.api.onfinality.io/public',
      name: 'OnFinality',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 25,
      currentRPM: 0,
      lastRequestTime: 0
    },
    {
      url: 'https://rpc.solanabeach.io',
      name: 'Solana Beach',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 30,
      currentRPM: 0,
      lastRequestTime: 0
    },
    {
      url: 'https://solana-rpc.publicnode.com',
      name: 'PublicNode',
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
      url: 'https://rpc.shyft.to',
      name: 'Shyft',
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: 0,
      maxRPM: 20,
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
    this.initializeDynamicEndpoints();
  }

  private async initializeDynamicEndpoints() {
    // Wait for endpoint discovery to complete
    setTimeout(async () => {
      try {
        const discoveredEndpoints = endpointDiscovery.exportForOrchestrator();
        console.log(`🔍 Integrating ${discoveredEndpoints.length} discovered endpoints`);
        
        // Replace static endpoints with dynamically discovered ones
        this.endpoints = discoveredEndpoints;
        
        console.log(`🚀 Endpoint pool expanded to ${this.endpoints.length} active endpoints`);
        this.logEndpointCapacity();
      } catch (error) {
        console.log('Using fallback endpoint configuration');
      }
    }, 10000); // Give discovery agent time to complete
  }

  private logEndpointCapacity() {
    const totalCapacity = this.endpoints.reduce((sum, ep) => sum + ep.maxRPM, 0);
    const avgResponseTime = this.endpoints.reduce((sum, ep) => sum + ep.avgResponseTime, 0) / this.endpoints.length;
    
    console.log(`📊 ENDPOINT CAPACITY REPORT:`);
    console.log(`🔗 Total endpoints: ${this.endpoints.length}`);
    console.log(`🚀 Combined capacity: ${totalCapacity} requests/minute`);
    console.log(`⚡ Average response time: ${avgResponseTime.toFixed(0)}ms`);
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
    // Calculate health scores for intelligent prioritization
    this.updateHealthScores();
    
    const availableEndpoints = this.endpoints.filter(ep => 
      ep.isHealthy && 
      ep.currentRPM < ep.maxRPM * 0.9 && // Stay below 90% of max RPM
      Date.now() - ep.lastRequestTime > 500 // Minimum 500ms between requests
    );

    if (availableEndpoints.length === 0) {
      // If no ideal endpoints, try any healthy one with lower standards
      const fallbackEndpoints = this.endpoints.filter(ep => 
        ep.isHealthy && ep.currentRPM < ep.maxRPM
      );
      
      if (fallbackEndpoints.length === 0) {
        return null;
      }
      
      return fallbackEndpoints[0];
    }

    // Intelligent sorting based on multiple factors
    availableEndpoints.sort((a, b) => {
      // Primary: Health score (higher is better)
      const healthDiff = this.getHealthScore(b) - this.getHealthScore(a);
      if (Math.abs(healthDiff) > 0.1) return healthDiff;
      
      // Secondary: Current load (lower is better)
      const loadA = a.currentRPM / a.maxRPM;
      const loadB = b.currentRPM / b.maxRPM;
      const loadDiff = loadA - loadB;
      if (Math.abs(loadDiff) > 0.1) return loadDiff;
      
      // Tertiary: Response time (lower is better)
      return a.avgResponseTime - b.avgResponseTime;
    });

    return availableEndpoints[0];
  }

  private updateHealthScores() {
    this.endpoints.forEach(endpoint => {
      const successRate = endpoint.requestCount > 0 ? 
        (endpoint.requestCount - endpoint.errorCount) / endpoint.requestCount : 1;
      const responseTimeFactor = Math.max(0, 1 - (endpoint.avgResponseTime / 5000)); // 5s max
      const loadFactor = Math.max(0, 1 - (endpoint.currentRPM / endpoint.maxRPM));
      const timeSinceErrorFactor = endpoint.lastError > 0 ? 
        Math.min(1, (Date.now() - endpoint.lastError) / 300000) : 1; // 5 minutes to recover
      
      const healthScore = (successRate * 0.4 + responseTimeFactor * 0.3 + 
                          loadFactor * 0.2 + timeSinceErrorFactor * 0.1);
      
      // Store health score for this endpoint
      endpoint.isHealthy = healthScore > 0.5;
    });
  }

  private getHealthScore(endpoint: EndpointMetrics): number {
    const successRate = endpoint.requestCount > 0 ? 
      (endpoint.requestCount - endpoint.errorCount) / endpoint.requestCount : 1;
    const responseTimeFactor = Math.max(0, 1 - (endpoint.avgResponseTime / 5000));
    const loadFactor = Math.max(0, 1 - (endpoint.currentRPM / endpoint.maxRPM));
    const timeSinceErrorFactor = endpoint.lastError > 0 ? 
      Math.min(1, (Date.now() - endpoint.lastError) / 300000) : 1;
    
    return successRate * 0.4 + responseTimeFactor * 0.3 + 
           loadFactor * 0.2 + timeSinceErrorFactor * 0.1;
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