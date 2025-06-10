/**
 * Intelligent Whitelisted Tokens Manager
 * Dynamically maintains and validates a curated list of high-quality trading tokens
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { PredictiveRateLimitManager } from './predictive-rate-limit-manager.js';

interface TokenMetrics {
  symbol: string;
  mint: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  liquidity: number;
  volatility: number;
  trustScore: number;
  whitelistScore: number;
  lastUpdated: Date;
  isVerified: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  tradingTier: 'premium' | 'standard' | 'experimental' | 'restricted';
}

interface WhitelistCriteria {
  minMarketCap: number;
  minVolume24h: number;
  minHolders: number;
  minLiquidity: number;
  maxVolatility: number;
  minTrustScore: number;
  requireVerification: boolean;
  allowExperimentalTokens: boolean;
}

interface TokenSource {
  name: string;
  endpoint: string;
  reliability: number;
  updateFrequency: number; // minutes
  weight: number; // influence on scoring
}

export class IntelligentTokenWhitelistManager {
  private rateLimitManager: PredictiveRateLimitManager;
  private connection: Connection;
  private whitelistedTokens: Map<string, TokenMetrics> = new Map();
  private blacklistedTokens: Set<string> = new Set();
  private isUpdating = false;
  private lastFullUpdate = new Date(0);
  
  private whitelistCriteria: WhitelistCriteria = {
    minMarketCap: 1000000, // $1M minimum market cap
    minVolume24h: 100000,  // $100K minimum 24h volume
    minHolders: 500,       // 500 minimum holders
    minLiquidity: 50000,   // $50K minimum liquidity
    maxVolatility: 0.3,    // 30% max volatility
    minTrustScore: 70,     // 70/100 minimum trust score
    requireVerification: false,
    allowExperimentalTokens: true
  };

  private tokenSources: TokenSource[] = [
    {
      name: 'Jupiter Price API',
      endpoint: 'https://price.jup.ag/v4',
      reliability: 95,
      updateFrequency: 5,
      weight: 0.3
    },
    {
      name: 'DexScreener',
      endpoint: 'https://api.dexscreener.com/latest/dex',
      reliability: 90,
      updateFrequency: 10,
      weight: 0.25
    },
    {
      name: 'CoinGecko',
      endpoint: 'https://api.coingecko.com/api/v3',
      reliability: 85,
      updateFrequency: 15,
      weight: 0.2
    },
    {
      name: 'Birdeye',
      endpoint: 'https://public-api.birdeye.so/defi',
      reliability: 88,
      updateFrequency: 8,
      weight: 0.25
    }
  ];

  // Known high-quality tokens (always whitelisted)
  private coreTokens = new Map([
    ['SOL', { mint: 'So11111111111111111111111111111111111111112', tier: 'premium' }],
    ['USDC', { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', tier: 'premium' }],
    ['USDT', { mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', tier: 'premium' }],
    ['RAY', { mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', tier: 'premium' }],
    ['ORCA', { mint: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE', tier: 'premium' }],
    ['JUP', { mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', tier: 'standard' }],
    ['BONK', { mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', tier: 'standard' }]
  ]);

  constructor() {
    this.rateLimitManager = new PredictiveRateLimitManager();
    this.connection = new Connection('https://api.mainnet-beta.solana.com');
    this.initializeManager();
  }

  private async initializeManager() {
    console.log('🔍 Initializing Intelligent Token Whitelist Manager...');
    
    // Initialize with core tokens
    await this.initializeCoreTokens();
    
    // Start background update processes
    this.startContinuousUpdates();
    
    console.log(`✅ Whitelist Manager initialized with ${this.whitelistedTokens.size} tokens`);
  }

  private async initializeCoreTokens() {
    for (const [symbol, info] of this.coreTokens.entries()) {
      const tokenMetrics: TokenMetrics = {
        symbol,
        mint: info.mint,
        name: symbol,
        price: 0,
        marketCap: 0,
        volume24h: 0,
        holders: 0,
        liquidity: 0,
        volatility: 0,
        trustScore: 100, // Core tokens get maximum trust
        whitelistScore: 100,
        lastUpdated: new Date(),
        isVerified: true,
        riskLevel: 'low',
        tradingTier: info.tier as any
      };
      
      this.whitelistedTokens.set(symbol, tokenMetrics);
    }
  }

  private startContinuousUpdates() {
    // Full whitelist update every hour
    setInterval(async () => {
      await this.performFullWhitelistUpdate();
    }, 60 * 60 * 1000);

    // Incremental updates every 15 minutes
    setInterval(async () => {
      await this.performIncrementalUpdate();
    }, 15 * 60 * 1000);

    // Real-time monitoring every 5 minutes
    setInterval(async () => {
      await this.monitorTokenHealth();
    }, 5 * 60 * 1000);

    // Initial update
    setTimeout(() => this.performFullWhitelistUpdate(), 5000);
  }

  private async performFullWhitelistUpdate() {
    if (this.isUpdating) return;
    this.isUpdating = true;

    console.log('🔄 Performing full token whitelist update...');

    try {
      const discoveryTasks = this.tokenSources.map(source => 
        this.discoverTokensFromSource(source)
      );

      const results = await Promise.allSettled(discoveryTasks);
      
      let totalDiscovered = 0;
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          totalDiscovered += result.value;
          console.log(`✅ ${this.tokenSources[index].name}: ${result.value} tokens analyzed`);
        } else {
          console.log(`❌ ${this.tokenSources[index].name}: Update failed`);
        }
      });

      await this.evaluateAndUpdateWhitelist();
      
      this.lastFullUpdate = new Date();
      console.log(`📊 Full update complete: ${totalDiscovered} tokens analyzed, ${this.getWhitelistedTokens().length} whitelisted`);
      
    } catch (error) {
      console.error('❌ Full whitelist update failed:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  private async discoverTokensFromSource(source: TokenSource): Promise<number> {
    let discoveredCount = 0;

    try {
      switch (source.name) {
        case 'Jupiter Price API':
          discoveredCount = await this.processJupiterTokens(source);
          break;
        case 'DexScreener':
          discoveredCount = await this.processDexScreenerTokens(source);
          break;
        case 'CoinGecko':
          discoveredCount = await this.processCoinGeckoTokens(source);
          break;
        case 'Birdeye':
          discoveredCount = await this.processBirdeyeTokens(source);
          break;
      }
    } catch (error) {
      console.log(`⚠️ Error processing ${source.name}:`, error);
    }

    return discoveredCount;
  }

  private async processJupiterTokens(source: TokenSource): Promise<number> {
    const endpoint = `${source.endpoint}/price`;
    
    const response = await this.rateLimitManager.makeSmartRequest(endpoint, async () => {
      const res = await fetch(`${endpoint}?ids=SOL,USDC,RAY,ORCA,JUP,BONK`);
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return await res.json();
    });

    let count = 0;
    if (response.data) {
      for (const [mint, priceData] of Object.entries(response.data)) {
        if (typeof priceData === 'object' && priceData !== null) {
          await this.updateTokenMetrics(mint, priceData, source);
          count++;
        }
      }
    }

    return count;
  }

  private async processDexScreenerTokens(source: TokenSource): Promise<number> {
    const endpoint = `${source.endpoint}/search/?q=SOL`;
    
    const response = await this.rateLimitManager.makeSmartRequest(endpoint, async () => {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return await res.json();
    });

    let count = 0;
    if (response.pairs && Array.isArray(response.pairs)) {
      for (const pair of response.pairs.slice(0, 20)) { // Limit to top 20
        if (pair.baseToken && pair.baseToken.address) {
          await this.updateTokenMetrics(pair.baseToken.address, pair, source);
          count++;
        }
      }
    }

    return count;
  }

  private async processCoinGeckoTokens(source: TokenSource): Promise<number> {
    // CoinGecko integration would require API key for higher limits
    // For now, return 0 to avoid rate limiting
    return 0;
  }

  private async processBirdeyeTokens(source: TokenSource): Promise<number> {
    // Birdeye integration would require API key
    // For now, return 0 to avoid rate limiting
    return 0;
  }

  private async updateTokenMetrics(mint: string, data: any, source: TokenSource) {
    try {
      const symbol = await this.resolveTokenSymbol(mint);
      if (!symbol) return;

      let existingMetrics = this.whitelistedTokens.get(symbol);
      if (!existingMetrics) {
        existingMetrics = {
          symbol,
          mint,
          name: symbol,
          price: 0,
          marketCap: 0,
          volume24h: 0,
          holders: 0,
          liquidity: 0,
          volatility: 0,
          trustScore: 50,
          whitelistScore: 0,
          lastUpdated: new Date(),
          isVerified: false,
          riskLevel: 'medium',
          tradingTier: 'experimental'
        };
      }

      // Update metrics based on source data
      this.mergeTokenData(existingMetrics, data, source);
      
      // Recalculate scores
      existingMetrics.whitelistScore = this.calculateWhitelistScore(existingMetrics);
      existingMetrics.lastUpdated = new Date();

      this.whitelistedTokens.set(symbol, existingMetrics);
      
    } catch (error) {
      // Silent fail for unknown tokens
    }
  }

  private mergeTokenData(metrics: TokenMetrics, data: any, source: TokenSource) {
    const weight = source.weight;

    // Jupiter data format
    if (data.price !== undefined) {
      metrics.price = (metrics.price * (1 - weight)) + (data.price * weight);
    }

    // DexScreener data format
    if (data.priceUsd) {
      metrics.price = (metrics.price * (1 - weight)) + (parseFloat(data.priceUsd) * weight);
    }
    if (data.volume && data.volume.h24) {
      metrics.volume24h = (metrics.volume24h * (1 - weight)) + (data.volume.h24 * weight);
    }
    if (data.liquidity && data.liquidity.usd) {
      metrics.liquidity = (metrics.liquidity * (1 - weight)) + (data.liquidity.usd * weight);
    }
    if (data.fdv) {
      metrics.marketCap = (metrics.marketCap * (1 - weight)) + (data.fdv * weight);
    }

    // Calculate volatility from price change
    if (data.priceChange && data.priceChange.h24) {
      const priceChangePercent = Math.abs(data.priceChange.h24) / 100;
      metrics.volatility = (metrics.volatility * (1 - weight)) + (priceChangePercent * weight);
    }
  }

  private calculateWhitelistScore(metrics: TokenMetrics): number {
    let score = 0;

    // Market cap scoring (0-25 points)
    if (metrics.marketCap >= this.whitelistCriteria.minMarketCap * 10) score += 25;
    else if (metrics.marketCap >= this.whitelistCriteria.minMarketCap * 5) score += 20;
    else if (metrics.marketCap >= this.whitelistCriteria.minMarketCap) score += 15;
    else if (metrics.marketCap >= this.whitelistCriteria.minMarketCap * 0.5) score += 10;

    // Volume scoring (0-20 points)
    if (metrics.volume24h >= this.whitelistCriteria.minVolume24h * 10) score += 20;
    else if (metrics.volume24h >= this.whitelistCriteria.minVolume24h * 5) score += 15;
    else if (metrics.volume24h >= this.whitelistCriteria.minVolume24h) score += 10;
    else if (metrics.volume24h >= this.whitelistCriteria.minVolume24h * 0.5) score += 5;

    // Liquidity scoring (0-20 points)
    if (metrics.liquidity >= this.whitelistCriteria.minLiquidity * 10) score += 20;
    else if (metrics.liquidity >= this.whitelistCriteria.minLiquidity * 5) score += 15;
    else if (metrics.liquidity >= this.whitelistCriteria.minLiquidity) score += 10;
    else if (metrics.liquidity >= this.whitelistCriteria.minLiquidity * 0.5) score += 5;

    // Volatility scoring (0-15 points) - lower volatility is better
    if (metrics.volatility <= 0.1) score += 15;
    else if (metrics.volatility <= 0.2) score += 10;
    else if (metrics.volatility <= this.whitelistCriteria.maxVolatility) score += 5;

    // Trust score contribution (0-15 points)
    score += (metrics.trustScore / 100) * 15;

    // Verification bonus (0-5 points)
    if (metrics.isVerified) score += 5;

    return Math.min(100, score);
  }

  private async resolveTokenSymbol(mint: string): Promise<string | null> {
    // Check core tokens first
    for (const [symbol, info] of this.coreTokens.entries()) {
      if (info.mint === mint) return symbol;
    }

    // Check existing tokens
    for (const [symbol, metrics] of this.whitelistedTokens.entries()) {
      if (metrics.mint === mint) return symbol;
    }

    // Try to resolve from on-chain data (simplified)
    try {
      const mintPubkey = new PublicKey(mint);
      // For now, return a short identifier
      return mint.slice(0, 8);
    } catch {
      return null;
    }
  }

  private async evaluateAndUpdateWhitelist() {
    for (const [symbol, metrics] of this.whitelistedTokens.entries()) {
      // Skip core tokens
      if (this.coreTokens.has(symbol)) continue;

      // Evaluate whitelist criteria
      if (this.meetsWhitelistCriteria(metrics)) {
        this.updateTradingTier(metrics);
      } else {
        // Remove from whitelist if it no longer meets criteria
        if (metrics.whitelistScore < 50) {
          this.whitelistedTokens.delete(symbol);
          this.blacklistedTokens.add(symbol);
        }
      }
    }
  }

  private meetsWhitelistCriteria(metrics: TokenMetrics): boolean {
    return (
      metrics.marketCap >= this.whitelistCriteria.minMarketCap &&
      metrics.volume24h >= this.whitelistCriteria.minVolume24h &&
      metrics.liquidity >= this.whitelistCriteria.minLiquidity &&
      metrics.volatility <= this.whitelistCriteria.maxVolatility &&
      metrics.trustScore >= this.whitelistCriteria.minTrustScore &&
      (!this.whitelistCriteria.requireVerification || metrics.isVerified)
    );
  }

  private updateTradingTier(metrics: TokenMetrics) {
    if (metrics.whitelistScore >= 90) {
      metrics.tradingTier = 'premium';
      metrics.riskLevel = 'low';
    } else if (metrics.whitelistScore >= 75) {
      metrics.tradingTier = 'standard';
      metrics.riskLevel = 'low';
    } else if (metrics.whitelistScore >= 60) {
      metrics.tradingTier = 'standard';
      metrics.riskLevel = 'medium';
    } else {
      metrics.tradingTier = 'experimental';
      metrics.riskLevel = 'high';
    }
  }

  private async performIncrementalUpdate() {
    // Update top 10 tokens more frequently
    const topTokens = Array.from(this.whitelistedTokens.values())
      .sort((a, b) => b.whitelistScore - a.whitelistScore)
      .slice(0, 10);

    for (const token of topTokens) {
      try {
        // Quick price update from Jupiter
        const endpoint = `https://price.jup.ag/v4/price?ids=${token.mint}`;
        const response = await this.rateLimitManager.makeSmartRequest(endpoint, async () => {
          const res = await fetch(endpoint);
          return await res.json();
        });

        if (response.data && response.data[token.mint]) {
          token.price = response.data[token.mint].price || token.price;
          token.lastUpdated = new Date();
        }
      } catch (error) {
        // Silent fail for individual tokens
      }
    }
  }

  private async monitorTokenHealth() {
    // Monitor for sudden changes that might indicate issues
    for (const [symbol, metrics] of this.whitelistedTokens.entries()) {
      if (this.coreTokens.has(symbol)) continue;

      // Check for suspicious activity
      if (this.detectSuspiciousActivity(metrics)) {
        console.log(`⚠️ Suspicious activity detected for ${symbol}, moving to restricted tier`);
        metrics.tradingTier = 'restricted';
        metrics.riskLevel = 'extreme';
      }
    }
  }

  private detectSuspiciousActivity(metrics: TokenMetrics): boolean {
    // Check for extreme volatility
    if (metrics.volatility > 0.5) return true;
    
    // Check for very low liquidity relative to volume
    if (metrics.volume24h > 0 && metrics.liquidity > 0) {
      const volumeToLiquidityRatio = metrics.volume24h / metrics.liquidity;
      if (volumeToLiquidityRatio > 10) return true; // Possible manipulation
    }

    // Check for stale data
    const hoursSinceUpdate = (Date.now() - metrics.lastUpdated.getTime()) / (1000 * 60 * 60);
    if (hoursSinceUpdate > 6) return true;

    return false;
  }

  // Public API methods for integration with quantum trader
  getWhitelistedTokens(tier?: 'premium' | 'standard' | 'experimental'): string[] {
    const tokens = Array.from(this.whitelistedTokens.values());
    
    if (tier) {
      return tokens
        .filter(token => token.tradingTier === tier)
        .sort((a, b) => b.whitelistScore - a.whitelistScore)
        .map(token => token.symbol);
    }

    return tokens
      .filter(token => token.tradingTier !== 'restricted')
      .sort((a, b) => b.whitelistScore - a.whitelistScore)
      .map(token => token.symbol);
  }

  getTokensForTrading(riskTolerance: 'conservative' | 'moderate' | 'aggressive'): string[] {
    const riskMapping = {
      conservative: ['low'],
      moderate: ['low', 'medium'],
      aggressive: ['low', 'medium', 'high']
    };

    const allowedRisks = riskMapping[riskTolerance];
    
    return Array.from(this.whitelistedTokens.values())
      .filter(token => 
        allowedRisks.includes(token.riskLevel) &&
        token.tradingTier !== 'restricted'
      )
      .sort((a, b) => b.whitelistScore - a.whitelistScore)
      .map(token => token.symbol);
  }

  getTokenMetrics(symbol: string): TokenMetrics | null {
    return this.whitelistedTokens.get(symbol) || null;
  }

  isTokenWhitelisted(symbol: string): boolean {
    const metrics = this.whitelistedTokens.get(symbol);
    return metrics !== undefined && metrics.tradingTier !== 'restricted';
  }

  isTokenBlacklisted(symbol: string): boolean {
    return this.blacklistedTokens.has(symbol);
  }

  updateWhitelistCriteria(newCriteria: Partial<WhitelistCriteria>) {
    this.whitelistCriteria = { ...this.whitelistCriteria, ...newCriteria };
    console.log('📋 Whitelist criteria updated:', newCriteria);
    
    // Re-evaluate all tokens with new criteria
    setTimeout(() => this.evaluateAndUpdateWhitelist(), 1000);
  }

  getWhitelistStatus(): any {
    const tokens = Array.from(this.whitelistedTokens.values());
    const tierDistribution = {
      premium: tokens.filter(t => t.tradingTier === 'premium').length,
      standard: tokens.filter(t => t.tradingTier === 'standard').length,
      experimental: tokens.filter(t => t.tradingTier === 'experimental').length,
      restricted: tokens.filter(t => t.tradingTier === 'restricted').length
    };

    return {
      totalWhitelisted: tokens.length,
      totalBlacklisted: this.blacklistedTokens.size,
      tierDistribution,
      lastUpdate: this.lastFullUpdate.toISOString(),
      isUpdating: this.isUpdating,
      criteria: this.whitelistCriteria
    };
  }
}