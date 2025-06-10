/**
 * Robust Trading Pair Discovery Service
 * Dynamically discovers and validates trading pairs across multiple DEXs
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { PredictiveRateLimitManager } from './predictive-rate-limit-manager.js';

interface TradingPair {
  baseToken: string;
  quoteToken: string;
  baseMint: string;
  quoteMint: string;
  dex: string;
  liquidity: number;
  volume24h: number;
  priceImpact: number;
  spread: number;
  isActive: boolean;
  lastUpdated: Date;
  confidence: number;
}

interface TokenInfo {
  symbol: string;
  name: string;
  mint: string;
  decimals: number;
  supply: number;
  verified: boolean;
  coingeckoId?: string;
}

interface DEXInfo {
  name: string;
  endpoint: string;
  pairEndpoint: string;
  tokenEndpoint: string;
  enabled: boolean;
  reliability: number;
  rateLimit: number;
}

export class TradingPairDiscoveryService {
  private rateLimitManager: PredictiveRateLimitManager;
  private connection: Connection;
  private discoveredPairs: Map<string, TradingPair> = new Map();
  private tokenRegistry: Map<string, TokenInfo> = new Map();
  private isDiscovering = false;

  private dexConfigs: DEXInfo[] = [
    {
      name: 'Raydium',
      endpoint: 'https://api.raydium.io/v2',
      pairEndpoint: '/sdk/liquidity/mainnet.json',
      tokenEndpoint: '/sdk/token/mainnet.json',
      enabled: true,
      reliability: 95,
      rateLimit: 60
    },
    {
      name: 'Orca',
      endpoint: 'https://api.orca.so',
      pairEndpoint: '/v1/whirlpool/list',
      tokenEndpoint: '/v1/token/list',
      enabled: true,
      reliability: 90,
      rateLimit: 100
    },
    {
      name: 'Jupiter',
      endpoint: 'https://price.jup.ag/v4',
      pairEndpoint: '/price',
      tokenEndpoint: '/tokens',
      enabled: true,
      reliability: 98,
      rateLimit: 120
    },
    {
      name: 'Serum',
      endpoint: 'https://api.projectserum.com',
      pairEndpoint: '/markets',
      tokenEndpoint: '/tokens',
      enabled: true,
      reliability: 85,
      rateLimit: 30
    }
  ];

  private knownTokens = new Map([
    ['SOL', { mint: 'So11111111111111111111111111111111111111112', decimals: 9 }],
    ['USDC', { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 }],
    ['USDT', { mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 }],
    ['RAY', { mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', decimals: 6 }],
    ['ORCA', { mint: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE', decimals: 6 }],
    ['BONK', { mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', decimals: 5 }],
    ['JUP', { mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', decimals: 6 }]
  ]);

  constructor() {
    this.rateLimitManager = new PredictiveRateLimitManager();
    this.connection = new Connection('https://api.mainnet-beta.solana.com');
    this.initializeTokenRegistry();
    this.startDiscoveryProcess();
  }

  private initializeTokenRegistry() {
    // Initialize with known tokens
    for (const [symbol, info] of this.knownTokens.entries()) {
      this.tokenRegistry.set(symbol, {
        symbol,
        name: symbol,
        mint: info.mint,
        decimals: info.decimals,
        supply: 0,
        verified: true
      });
    }
  }

  async startDiscoveryProcess() {
    if (this.isDiscovering) return;
    this.isDiscovering = true;

    console.log('🔍 Starting robust trading pair discovery...');

    // Initial discovery burst
    await this.performFullDiscovery();

    // Schedule regular discovery updates
    setInterval(async () => {
      await this.performIncrementalDiscovery();
    }, 5 * 60 * 1000); // Every 5 minutes

    // Deep discovery every hour
    setInterval(async () => {
      await this.performFullDiscovery();
    }, 60 * 60 * 1000);
  }

  private async performFullDiscovery() {
    console.log('🌐 Performing full trading pair discovery...');

    const discoveryTasks = this.dexConfigs
      .filter(dex => dex.enabled)
      .map(dex => this.discoverPairsFromDEX(dex));

    const results = await Promise.allSettled(discoveryTasks);
    
    let totalPairs = 0;
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        totalPairs += result.value;
        console.log(`✅ ${this.dexConfigs[index].name}: ${result.value} pairs discovered`);
      } else {
        console.log(`❌ ${this.dexConfigs[index].name}: Discovery failed`);
      }
    });

    await this.validateDiscoveredPairs();
    console.log(`📊 Full discovery complete: ${totalPairs} total pairs, ${this.getValidPairs().length} validated`);
  }

  private async performIncrementalDiscovery() {
    // Update existing pairs and discover new ones
    const highReliabilityDEXs = this.dexConfigs.filter(dex => dex.reliability > 90 && dex.enabled);
    
    for (const dex of highReliabilityDEXs) {
      try {
        await this.updatePairsFromDEX(dex);
      } catch (error) {
        console.log(`⚠️ Incremental update failed for ${dex.name}:`, error);
      }
    }
  }

  private async discoverPairsFromDEX(dex: DEXInfo): Promise<number> {
    const endpoint = `${dex.endpoint}${dex.pairEndpoint}`;
    let discoveredCount = 0;

    try {
      const response = await this.rateLimitManager.makeSmartRequest(endpoint, async () => {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
        return await res.json();
      });

      discoveredCount = await this.processDEXResponse(dex, response);
      
    } catch (error) {
      console.log(`❌ Failed to discover pairs from ${dex.name}:`, error);
    }

    return discoveredCount;
  }

  private async processDEXResponse(dex: DEXInfo, response: any): Promise<number> {
    let count = 0;

    switch (dex.name) {
      case 'Raydium':
        count = await this.processRaydiumPairs(response);
        break;
      case 'Orca':
        count = await this.processOrcaPairs(response);
        break;
      case 'Jupiter':
        count = await this.processJupiterPairs(response);
        break;
      case 'Serum':
        count = await this.processSerumPairs(response);
        break;
      default:
        count = await this.processGenericPairs(dex, response);
    }

    return count;
  }

  private async processRaydiumPairs(response: any): Promise<number> {
    if (!response.official || !Array.isArray(response.official)) return 0;

    let count = 0;
    for (const pool of response.official) {
      if (pool.quoteMint && pool.baseMint && pool.lpMint) {
        const baseSymbol = await this.getTokenSymbol(pool.baseMint);
        const quoteSymbol = await this.getTokenSymbol(pool.quoteMint);

        if (baseSymbol && quoteSymbol) {
          const pairKey = `${baseSymbol}/${quoteSymbol}`;
          
          this.discoveredPairs.set(pairKey, {
            baseToken: baseSymbol,
            quoteToken: quoteSymbol,
            baseMint: pool.baseMint,
            quoteMint: pool.quoteMint,
            dex: 'Raydium',
            liquidity: parseFloat(pool.lpAmount || 0),
            volume24h: 0, // Would need additional API call
            priceImpact: 0,
            spread: 0,
            isActive: true,
            lastUpdated: new Date(),
            confidence: 90
          });
          count++;
        }
      }
    }

    return count;
  }

  private async processOrcaPairs(response: any): Promise<number> {
    if (!response.whirlpools || !Array.isArray(response.whirlpools)) return 0;

    let count = 0;
    for (const pool of response.whirlpools) {
      if (pool.tokenA && pool.tokenB) {
        const baseSymbol = await this.getTokenSymbol(pool.tokenA.mint);
        const quoteSymbol = await this.getTokenSymbol(pool.tokenB.mint);

        if (baseSymbol && quoteSymbol) {
          const pairKey = `${baseSymbol}/${quoteSymbol}`;
          
          this.discoveredPairs.set(pairKey, {
            baseToken: baseSymbol,
            quoteToken: quoteSymbol,
            baseMint: pool.tokenA.mint,
            quoteMint: pool.tokenB.mint,
            dex: 'Orca',
            liquidity: parseFloat(pool.liquidity || 0),
            volume24h: parseFloat(pool.volume?.day || 0),
            priceImpact: 0,
            spread: 0,
            isActive: true,
            lastUpdated: new Date(),
            confidence: 85
          });
          count++;
        }
      }
    }

    return count;
  }

  private async processJupiterPairs(response: any): Promise<number> {
    // Jupiter provides price data, we'll use it to validate existing pairs
    if (!response.data) return 0;

    let count = 0;
    for (const [mint, priceData] of Object.entries(response.data)) {
      const symbol = await this.getTokenSymbol(mint);
      if (symbol && typeof priceData === 'object' && priceData !== null) {
        // Update existing pairs with Jupiter price data
        for (const [pairKey, pair] of this.discoveredPairs.entries()) {
          if (pair.baseMint === mint || pair.quoteMint === mint) {
            pair.lastUpdated = new Date();
            pair.confidence = Math.min(pair.confidence + 5, 95);
            count++;
          }
        }
      }
    }

    return count;
  }

  private async processSerumPairs(response: any): Promise<number> {
    if (!Array.isArray(response)) return 0;

    let count = 0;
    for (const market of response) {
      if (market.baseTokenAccount && market.quoteTokenAccount) {
        const baseSymbol = await this.getTokenSymbol(market.baseTokenAccount);
        const quoteSymbol = await this.getTokenSymbol(market.quoteTokenAccount);

        if (baseSymbol && quoteSymbol) {
          const pairKey = `${baseSymbol}/${quoteSymbol}`;
          
          this.discoveredPairs.set(pairKey, {
            baseToken: baseSymbol,
            quoteToken: quoteSymbol,
            baseMint: market.baseTokenAccount,
            quoteMint: market.quoteTokenAccount,
            dex: 'Serum',
            liquidity: 0,
            volume24h: 0,
            priceImpact: 0,
            spread: 0,
            isActive: market.deprecated !== true,
            lastUpdated: new Date(),
            confidence: 75
          });
          count++;
        }
      }
    }

    return count;
  }

  private async processGenericPairs(dex: DEXInfo, response: any): Promise<number> {
    // Generic processor for unknown DEX formats
    let count = 0;
    
    if (Array.isArray(response)) {
      for (const item of response.slice(0, 100)) { // Limit to prevent overload
        if (item.baseToken && item.quoteToken) {
          const pairKey = `${item.baseToken}/${item.quoteToken}`;
          
          this.discoveredPairs.set(pairKey, {
            baseToken: item.baseToken,
            quoteToken: item.quoteToken,
            baseMint: item.baseMint || '',
            quoteMint: item.quoteMint || '',
            dex: dex.name,
            liquidity: parseFloat(item.liquidity || 0),
            volume24h: parseFloat(item.volume24h || 0),
            priceImpact: parseFloat(item.priceImpact || 0),
            spread: parseFloat(item.spread || 0),
            isActive: item.active !== false,
            lastUpdated: new Date(),
            confidence: 60
          });
          count++;
        }
      }
    }

    return count;
  }

  private async getTokenSymbol(mint: string): Promise<string | null> {
    // Check known tokens first
    for (const [symbol, info] of this.knownTokens.entries()) {
      if (info.mint === mint) return symbol;
    }

    // Check token registry
    for (const [symbol, info] of this.tokenRegistry.entries()) {
      if (info.mint === mint) return symbol;
    }

    // Try to resolve from on-chain data (simplified)
    try {
      const tokenInfo = await this.resolveTokenFromChain(mint);
      if (tokenInfo) {
        this.tokenRegistry.set(tokenInfo.symbol, tokenInfo);
        return tokenInfo.symbol;
      }
    } catch (error) {
      // Silent fail for unknown tokens
    }

    return null;
  }

  private async resolveTokenFromChain(mint: string): Promise<TokenInfo | null> {
    try {
      const mintPubkey = new PublicKey(mint);
      const mintInfo = await this.connection.getParsedAccountInfo(mintPubkey);
      
      if (mintInfo.value?.data && 'parsed' in mintInfo.value.data) {
        const parsedData = mintInfo.value.data.parsed;
        
        return {
          symbol: mint.slice(0, 8), // Fallback symbol
          name: `Token ${mint.slice(0, 8)}`,
          mint,
          decimals: parsedData.info?.decimals || 6,
          supply: parseFloat(parsedData.info?.supply || 0),
          verified: false
        };
      }
    } catch (error) {
      // Token might not exist or be invalid
    }

    return null;
  }

  private async updatePairsFromDEX(dex: DEXInfo) {
    // Update existing pairs with fresh data
    const pairs = Array.from(this.discoveredPairs.values())
      .filter(pair => pair.dex === dex.name);

    for (const pair of pairs.slice(0, 10)) { // Limit updates to prevent rate limiting
      try {
        await this.updatePairData(pair);
      } catch (error) {
        pair.confidence = Math.max(pair.confidence - 5, 10);
      }
    }
  }

  private async updatePairData(pair: TradingPair) {
    // Update pair data based on DEX
    switch (pair.dex) {
      case 'Jupiter':
        await this.updateJupiterPairData(pair);
        break;
      default:
        // Generic update
        pair.lastUpdated = new Date();
    }
  }

  private async updateJupiterPairData(pair: TradingPair) {
    try {
      const endpoint = `https://price.jup.ag/v4/price?ids=${pair.baseMint}`;
      const response = await this.rateLimitManager.makeSmartRequest(endpoint, async () => {
        const res = await fetch(endpoint);
        return await res.json();
      });

      if (response.data && response.data[pair.baseMint]) {
        pair.lastUpdated = new Date();
        pair.confidence = Math.min(pair.confidence + 2, 95);
      }
    } catch (error) {
      pair.confidence = Math.max(pair.confidence - 3, 20);
    }
  }

  private async validateDiscoveredPairs() {
    const validationTasks: Promise<void>[] = [];
    
    for (const [pairKey, pair] of this.discoveredPairs.entries()) {
      validationTasks.push(this.validatePair(pair));
      
      // Process in batches to avoid overwhelming the system
      if (validationTasks.length >= 10) {
        await Promise.allSettled(validationTasks);
        validationTasks.length = 0;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      }
    }

    if (validationTasks.length > 0) {
      await Promise.allSettled(validationTasks);
    }
  }

  private async validatePair(pair: TradingPair): Promise<void> {
    try {
      // Basic validation
      if (!pair.baseToken || !pair.quoteToken || pair.baseToken === pair.quoteToken) {
        pair.isActive = false;
        pair.confidence = 0;
        return;
      }

      // Mint validation
      if (pair.baseMint && pair.quoteMint) {
        try {
          new PublicKey(pair.baseMint);
          new PublicKey(pair.quoteMint);
        } catch {
          pair.isActive = false;
          pair.confidence = 0;
          return;
        }
      }

      // Confidence boost for validated pairs
      pair.confidence = Math.min(pair.confidence + 10, 100);
      
    } catch (error) {
      pair.confidence = Math.max(pair.confidence - 10, 0);
      if (pair.confidence === 0) {
        pair.isActive = false;
      }
    }
  }

  // Public methods for accessing discovered pairs
  getValidPairs(): TradingPair[] {
    return Array.from(this.discoveredPairs.values())
      .filter(pair => pair.isActive && pair.confidence > 50)
      .sort((a, b) => b.confidence - a.confidence);
  }

  getPairsByToken(token: string): TradingPair[] {
    return this.getValidPairs()
      .filter(pair => pair.baseToken === token || pair.quoteToken === token);
  }

  getPairsByDEX(dex: string): TradingPair[] {
    return this.getValidPairs()
      .filter(pair => pair.dex === dex);
  }

  findOptimalPair(baseToken: string, quoteToken: string): TradingPair | null {
    const candidates = this.getValidPairs()
      .filter(pair => 
        (pair.baseToken === baseToken && pair.quoteToken === quoteToken) ||
        (pair.baseToken === quoteToken && pair.quoteToken === baseToken)
      )
      .sort((a, b) => {
        // Sort by liquidity and confidence
        const scoreA = a.liquidity * a.confidence / 100;
        const scoreB = b.liquidity * b.confidence / 100;
        return scoreB - scoreA;
      });

    return candidates[0] || null;
  }

  getDiscoveryStatus(): any {
    const totalPairs = this.discoveredPairs.size;
    const validPairs = this.getValidPairs().length;
    const dexDistribution = {};

    for (const pair of this.getValidPairs()) {
      dexDistribution[pair.dex] = (dexDistribution[pair.dex] || 0) + 1;
    }

    return {
      totalPairs,
      validPairs,
      validationRate: totalPairs > 0 ? (validPairs / totalPairs * 100).toFixed(1) + '%' : '0%',
      dexDistribution,
      discoveryActive: this.isDiscovering,
      tokenRegistry: this.tokenRegistry.size,
      lastUpdate: new Date().toISOString()
    };
  }
}