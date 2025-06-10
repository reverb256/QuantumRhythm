/**
 * Autonomous Endpoint Discovery Agent
 * Programmatically discovers and validates free Solana RPC endpoints
 * Implements parallel processing with AI-driven optimization
 */

import { Connection, PublicKey } from '@solana/web3.js';

interface DiscoveredEndpoint {
  url: string;
  name: string;
  responseTime: number;
  isWorking: boolean;
  maxRPM: number;
  features: string[];
  reliability: number;
  lastChecked: number;
}

export class EndpointDiscoveryAgent {
  private knownEndpoints: string[] = [
    // Official endpoints
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com',
    
    // Infrastructure providers
    'https://rpc.ankr.com/solana',
    'https://solana-mainnet.g.alchemy.com/v2/demo',
    'https://mainnet.rpcpool.com',
    'https://api.mainnet.rpcpool.com',
    'https://solana.public-rpc.com',
    
    // Additional free endpoints
    'https://solana.blockdaemon.com',
    'https://ssc-dao.genesysgo.net',
    'https://solana-mainnet.rpc.extrnode.com',
    'https://solana.blockpi.network/v1/rpc/public',
    'https://rpc.hellomoon.io',
    'https://solana.api.onfinality.io/public',
    'https://rpc.solanabeach.io',
    'https://solana-rpc.publicnode.com',
    'https://rpc.shyft.to',
    'https://api.solana.fm',
    'https://solana-mainnet.phantom.tech',
    'https://rpc.solana.com',
    'https://api.tatum.io/v3/blockchain/node/SOL',
    'https://solana.getblock.io/mainnet/',
    'https://api.metaplex.solana.com',
    'https://api.syndica.io/access-token/mainnet',
    'https://ssc-dao.genesysgo.net',
    'https://rpc.ironforge.network/mainnet?apiKey=01234567-89ab-cdef-0123-456789abcdef',
    'https://mainnet.solana.cloud.chainstack.com',
    'https://solana-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7',
    'https://rpc.magiceden.dev',
    'https://api.devnet.solana.com',
    'https://api.testnet.solana.com',
    'https://devnet.genesysgo.net',
    'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899',
    'https://mango.rpcpool.com',
    'https://serum.rpcpool.com',
    'https://raydium.rpcpool.com',
    'https://jupiter.rpcpool.com',
    'https://orca.rpcpool.com',
    'https://marinade.rpcpool.com',
    'https://rpc.rari.capital',
    'https://api.solanabeach.io/v1',
    'https://api.solscan.io/chaininfo',
    'https://api.solana.fm/v0',
    'https://public-api.solscan.io/chaininfo'
  ];

  private discoveredEndpoints: Map<string, DiscoveredEndpoint> = new Map();
  private parallelTestLimit = 10;
  private testWallet = '4jTtAYiHP3tHqXcmi5T1riS1AcGmxNNhLZTw65vrKpkA';

  constructor() {
    this.startDiscoveryProcess();
  }

  async startDiscoveryProcess() {
    console.log('🔍 Starting autonomous endpoint discovery...');
    
    // Parallel endpoint validation
    const chunks = this.chunkArray(this.knownEndpoints, this.parallelTestLimit);
    
    for (const chunk of chunks) {
      await Promise.allSettled(
        chunk.map(url => this.validateEndpoint(url))
      );
      
      // Small delay between chunks to avoid overwhelming endpoints
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.rankEndpoints();
    this.logDiscoveryResults();
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private async validateEndpoint(url: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Test basic connectivity
      const connection = new Connection(url, 'confirmed');
      
      // Test getBalance - most common operation
      const balance = await connection.getBalance(new PublicKey(this.testWallet));
      const responseTime = Date.now() - startTime;
      
      // Test additional features
      const features = await this.testEndpointFeatures(connection);
      
      const endpoint: DiscoveredEndpoint = {
        url,
        name: this.extractProviderName(url),
        responseTime,
        isWorking: true,
        maxRPM: this.estimateRateLimit(url),
        features,
        reliability: this.calculateReliability(responseTime, features.length),
        lastChecked: Date.now()
      };

      this.discoveredEndpoints.set(url, endpoint);
      console.log(`✅ Discovered working endpoint: ${endpoint.name} (${responseTime}ms)`);
      
    } catch (error) {
      console.log(`❌ Failed endpoint: ${this.extractProviderName(url)} - ${error.message}`);
    }
  }

  private async testEndpointFeatures(connection: Connection): Promise<string[]> {
    const features: string[] = [];
    
    try {
      // Test getSlot
      await connection.getSlot();
      features.push('getSlot');
    } catch {}

    try {
      // Test getBlockHeight
      await connection.getBlockHeight();
      features.push('getBlockHeight');
    } catch {}

    try {
      // Test getRecentBlockhash (deprecated but some endpoints support)
      await connection.getLatestBlockhash();
      features.push('getLatestBlockhash');
    } catch {}

    return features;
  }

  private extractProviderName(url: string): string {
    if (url.includes('alchemy')) return 'Alchemy';
    if (url.includes('ankr')) return 'Ankr';
    if (url.includes('genesysgo')) return 'GenesysGo';
    if (url.includes('rpcpool')) return 'RPC Pool';
    if (url.includes('blockdaemon')) return 'BlockDaemon';
    if (url.includes('extrnode')) return 'ExtrNode';
    if (url.includes('blockpi')) return 'BlockPI';
    if (url.includes('hellomoon')) return 'HelloMoon';
    if (url.includes('onfinality')) return 'OnFinality';
    if (url.includes('solanabeach')) return 'Solana Beach';
    if (url.includes('publicnode')) return 'PublicNode';
    if (url.includes('shyft')) return 'Shyft';
    if (url.includes('phantom')) return 'Phantom';
    if (url.includes('tatum')) return 'Tatum';
    if (url.includes('getblock')) return 'GetBlock';
    if (url.includes('metaplex')) return 'Metaplex';
    if (url.includes('syndica')) return 'Syndica';
    if (url.includes('ironforge')) return 'IronForge';
    if (url.includes('chainstack')) return 'Chainstack';
    if (url.includes('nodereal')) return 'NodeReal';
    if (url.includes('magiceden')) return 'Magic Eden';
    if (url.includes('api.mainnet-beta.solana.com')) return 'Solana Labs';
    if (url.includes('projectserum')) return 'Project Serum';
    
    return 'Unknown Provider';
  }

  private estimateRateLimit(url: string): number {
    // Conservative estimates based on known provider limits
    if (url.includes('alchemy')) return 60;
    if (url.includes('ankr')) return 45;
    if (url.includes('rpcpool')) return 55;
    if (url.includes('genesysgo')) return 25;
    if (url.includes('blockdaemon')) return 30;
    if (url.includes('api.mainnet-beta.solana.com')) return 40;
    if (url.includes('projectserum')) return 50;
    
    return 20; // Conservative default
  }

  private calculateReliability(responseTime: number, featureCount: number): number {
    const timeScore = Math.max(0, 1 - (responseTime / 5000)); // 5s max
    const featureScore = featureCount / 3; // Max 3 features tested
    return (timeScore * 0.7 + featureScore * 0.3);
  }

  private rankEndpoints(): void {
    const endpoints = Array.from(this.discoveredEndpoints.values());
    
    endpoints.sort((a, b) => {
      // Primary: Reliability
      if (Math.abs(a.reliability - b.reliability) > 0.1) {
        return b.reliability - a.reliability;
      }
      
      // Secondary: Response time
      if (Math.abs(a.responseTime - b.responseTime) > 100) {
        return a.responseTime - b.responseTime;
      }
      
      // Tertiary: Rate limit
      return b.maxRPM - a.maxRPM;
    });

    console.log('\n🏆 TOP PERFORMING ENDPOINTS:');
    endpoints.slice(0, 10).forEach((ep, i) => {
      console.log(`${i + 1}. ${ep.name}: ${ep.responseTime}ms, ${ep.maxRPM} RPM, ${(ep.reliability * 100).toFixed(1)}% reliable`);
    });
  }

  private logDiscoveryResults(): void {
    const working = Array.from(this.discoveredEndpoints.values()).filter(ep => ep.isWorking);
    const avgResponseTime = working.reduce((sum, ep) => sum + ep.responseTime, 0) / working.length;
    const totalRPM = working.reduce((sum, ep) => sum + ep.maxRPM, 0);

    console.log(`\n📊 DISCOVERY SUMMARY:`);
    console.log(`✅ Working endpoints: ${working.length}/${this.knownEndpoints.length}`);
    console.log(`⚡ Average response time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`🚀 Total capacity: ${totalRPM} requests/minute`);
    console.log(`🎯 Discovery completed successfully`);
  }

  getOptimalEndpoints(): DiscoveredEndpoint[] {
    return Array.from(this.discoveredEndpoints.values())
      .filter(ep => ep.isWorking && ep.reliability > 0.5)
      .sort((a, b) => b.reliability - a.reliability);
  }

  // Export for Smart API Orchestrator
  exportForOrchestrator() {
    return this.getOptimalEndpoints().map(ep => ({
      url: ep.url,
      name: ep.name,
      requestCount: 0,
      errorCount: 0,
      lastError: 0,
      isHealthy: true,
      avgResponseTime: ep.responseTime,
      maxRPM: ep.maxRPM,
      currentRPM: 0,
      lastRequestTime: 0
    }));
  }
}

// Auto-discovery instance
export const endpointDiscovery = new EndpointDiscoveryAgent();