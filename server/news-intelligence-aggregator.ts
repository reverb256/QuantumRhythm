/**
 * News Intelligence Aggregator
 * Combines RSS feeds, news APIs, and sentiment analysis for trading intelligence
 */

import { RSSIntelligenceEngine } from './rss-intelligence-engine.js';
import axios from 'axios';

interface NewsAlert {
  id: string;
  timestamp: Date;
  title: string;
  summary: string;
  sentiment: number; // -100 to 100
  confidence: number; // 0 to 100
  tokens: string[];
  source: string;
  urgency: 'low' | 'medium' | 'high';
  category: 'regulatory' | 'market' | 'technical' | 'defi' | 'institutional';
  impact: 'bullish' | 'bearish' | 'neutral';
  tradingSignal?: {
    action: 'buy' | 'sell' | 'hold';
    strength: number; // 0 to 100
    timeframe: 'immediate' | 'short' | 'medium' | 'long';
  };
}

interface MarketIntelligence {
  overallSentiment: number;
  confidence: number;
  trendingTokens: Array<{
    token: string;
    mentions: number;
    sentiment: number;
    newsCount: number;
  }>;
  alerts: NewsAlert[];
  lastUpdate: Date;
}

export class NewsIntelligenceAggregator {
  private rssEngine: RSSIntelligenceEngine;
  private isActive: boolean = false;
  private updateInterval: NodeJS.Timeout | null = null;
  private cachedIntelligence: MarketIntelligence | null = null;

  constructor() {
    this.rssEngine = new RSSIntelligenceEngine();
  }

  async initialize(): Promise<void> {
    console.log('📰 Initializing News Intelligence Aggregator...');
    
    // Start RSS monitoring
    await this.rssEngine.startMonitoring();
    
    // Initial intelligence gathering
    await this.updateMarketIntelligence();
    
    // Set up periodic updates
    this.updateInterval = setInterval(() => {
      this.updateMarketIntelligence();
    }, 10 * 60 * 1000); // Update every 10 minutes

    this.isActive = true;
    console.log('✅ News Intelligence Aggregator active');
  }

  async shutdown(): Promise<void> {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    this.rssEngine.stopMonitoring();
    this.isActive = false;
    console.log('📰 News Intelligence Aggregator stopped');
  }

  private async updateMarketIntelligence(): Promise<void> {
    try {
      console.log('🔄 Updating market intelligence...');

      // Get RSS intelligence
      const overallSentiment = this.rssEngine.getOverallMarketSentiment();
      const tradingAlerts = this.rssEngine.getTradingAlerts();

      // Analyze trending tokens
      const trendingTokens = await this.analyzeTrendingTokens();

      // Generate trading alerts
      const alerts = await this.generateNewsAlerts(tradingAlerts.alerts);

      this.cachedIntelligence = {
        overallSentiment: overallSentiment.sentiment,
        confidence: overallSentiment.confidence,
        trendingTokens,
        alerts,
        lastUpdate: new Date()
      };

      // Log significant findings
      this.logSignificantIntelligence();

    } catch (error) {
      console.log(`❌ Error updating market intelligence: ${error}`);
    }
  }

  private async analyzeTrendingTokens(): Promise<Array<{
    token: string;
    mentions: number;
    sentiment: number;
    newsCount: number;
  }>> {
    const tokens = ['SOL', 'BTC', 'ETH', 'USDC', 'RAY', 'ORCA', 'AVAX', 'LINK', 'UNI', 'AAVE'];
    const trendingData: any[] = [];

    for (const token of tokens) {
      const tokenSentiment = this.rssEngine.getTokenSentiment(token);
      
      if (tokenSentiment.mentions > 0) {
        trendingData.push({
          token,
          mentions: tokenSentiment.mentions,
          sentiment: tokenSentiment.sentiment,
          newsCount: tokenSentiment.recentNews.length
        });
      }
    }

    // Sort by relevance (mentions * abs(sentiment))
    return trendingData
      .sort((a, b) => (b.mentions * Math.abs(b.sentiment)) - (a.mentions * Math.abs(a.sentiment)))
      .slice(0, 10);
  }

  private async generateNewsAlerts(rssAlerts: any[]): Promise<NewsAlert[]> {
    const alerts: NewsAlert[] = [];

    for (const alert of rssAlerts) {
      const newsAlert: NewsAlert = {
        id: this.generateAlertId(),
        timestamp: new Date(),
        title: alert.reason,
        summary: this.generateAlertSummary(alert),
        sentiment: alert.type === 'bullish' ? 60 : alert.type === 'bearish' ? -60 : 0,
        confidence: alert.confidence,
        tokens: alert.tokens,
        source: 'RSS Aggregation',
        urgency: alert.urgency,
        category: this.categorizeAlert(alert),
        impact: alert.type,
        tradingSignal: this.generateTradingSignal(alert)
      };

      alerts.push(newsAlert);
    }

    return alerts.slice(0, 20); // Keep top 20 alerts
  }

  private generateAlertId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateAlertSummary(alert: any): string {
    const tokenList = alert.tokens.length > 0 ? ` affecting ${alert.tokens.join(', ')}` : '';
    return `${alert.type.toUpperCase()} signal detected${tokenList} with ${alert.confidence}% confidence`;
  }

  private categorizeAlert(alert: any): NewsAlert['category'] {
    const reason = alert.reason.toLowerCase();
    
    if (reason.includes('regulation') || reason.includes('sec') || reason.includes('legal')) {
      return 'regulatory';
    }
    if (reason.includes('defi') || reason.includes('protocol') || reason.includes('yield')) {
      return 'defi';
    }
    if (reason.includes('institutional') || reason.includes('fund') || reason.includes('investment')) {
      return 'institutional';
    }
    if (reason.includes('technical') || reason.includes('upgrade') || reason.includes('blockchain')) {
      return 'technical';
    }
    return 'market';
  }

  private generateTradingSignal(alert: any): NewsAlert['tradingSignal'] {
    const strength = Math.min(100, alert.confidence);
    
    let action: 'buy' | 'sell' | 'hold' = 'hold';
    if (alert.type === 'bullish' && strength > 70) action = 'buy';
    else if (alert.type === 'bearish' && strength > 70) action = 'sell';

    let timeframe: 'immediate' | 'short' | 'medium' | 'long' = 'medium';
    if (alert.urgency === 'high') timeframe = 'immediate';
    else if (alert.urgency === 'medium') timeframe = 'short';

    return { action, strength, timeframe };
  }

  private logSignificantIntelligence(): void {
    if (!this.cachedIntelligence) return;

    const { overallSentiment, confidence, trendingTokens, alerts } = this.cachedIntelligence;

    // Log overall market sentiment
    if (Math.abs(overallSentiment) > 30 && confidence > 50) {
      const direction = overallSentiment > 0 ? 'BULLISH' : 'BEARISH';
      console.log(`📊 MARKET SENTIMENT: ${direction} (${overallSentiment.toFixed(1)}) | Confidence: ${confidence.toFixed(1)}%`);
    }

    // Log trending tokens
    if (trendingTokens.length > 0) {
      console.log(`🔥 TRENDING: ${trendingTokens.slice(0, 3).map(t => 
        `${t.token} (${t.mentions} mentions, ${t.sentiment > 0 ? '+' : ''}${t.sentiment.toFixed(1)})`
      ).join(', ')}`);
    }

    // Log high-priority alerts
    const urgentAlerts = alerts.filter(a => a.urgency === 'high' || a.confidence > 80);
    if (urgentAlerts.length > 0) {
      console.log(`🚨 HIGH PRIORITY ALERTS: ${urgentAlerts.length}`);
      urgentAlerts.slice(0, 2).forEach(alert => {
        console.log(`   ${alert.impact.toUpperCase()}: ${alert.title}`);
      });
    }
  }

  // Public API methods

  getMarketIntelligence(): MarketIntelligence | null {
    return this.cachedIntelligence;
  }

  getTokenIntelligence(token: string): {
    sentiment: number;
    mentions: number;
    recentNews: any[];
    confidence: number;
  } {
    const tokenData = this.rssEngine.getTokenSentiment(token);
    const confidence = Math.min(100, tokenData.mentions * 10 + Math.abs(tokenData.sentiment));

    return {
      sentiment: tokenData.sentiment,
      mentions: tokenData.mentions,
      recentNews: tokenData.recentNews,
      confidence
    };
  }

  getTradingSignals(): Array<{
    token: string;
    signal: 'buy' | 'sell' | 'hold';
    strength: number;
    reason: string;
    timeframe: string;
  }> {
    if (!this.cachedIntelligence) return [];

    return this.cachedIntelligence.alerts
      .filter(alert => alert.tradingSignal && alert.tradingSignal.action !== 'hold')
      .map(alert => ({
        token: alert.tokens[0] || 'MARKET',
        signal: alert.tradingSignal!.action,
        strength: alert.tradingSignal!.strength,
        reason: alert.title,
        timeframe: alert.tradingSignal!.timeframe
      }))
      .slice(0, 10);
  }

  getMarketSentimentScore(): number {
    if (!this.cachedIntelligence) return 50; // Neutral
    
    // Convert -100/+100 to 0-100 scale
    return Math.max(0, Math.min(100, this.cachedIntelligence.overallSentiment + 50));
  }

  getNewsAlerts(): NewsAlert[] {
    return this.cachedIntelligence?.alerts || [];
  }

  // Integration with trading system
  async getEnhancedTradingIntelligence(tokens: string[]): Promise<{
    overallSentiment: number;
    tokenSignals: Array<{
      token: string;
      sentiment: number;
      confidence: number;
      recommendation: 'buy' | 'sell' | 'hold';
    }>;
    marketConditions: {
      volatility: 'low' | 'medium' | 'high';
      trend: 'bullish' | 'bearish' | 'sideways';
      confidence: number;
    };
  }> {
    const intelligence = this.getMarketIntelligence();
    if (!intelligence) {
      return {
        overallSentiment: 50,
        tokenSignals: [],
        marketConditions: { volatility: 'medium', trend: 'sideways', confidence: 30 }
      };
    }

    // Analyze specific tokens
    const tokenSignals = tokens.map(token => {
      const tokenData = this.getTokenIntelligence(token);
      let recommendation: 'buy' | 'sell' | 'hold' = 'hold';
      
      if (tokenData.sentiment > 40 && tokenData.confidence > 60) recommendation = 'buy';
      else if (tokenData.sentiment < -40 && tokenData.confidence > 60) recommendation = 'sell';

      return {
        token,
        sentiment: tokenData.sentiment,
        confidence: tokenData.confidence,
        recommendation
      };
    });

    // Determine market conditions
    const volatility = this.determineVolatility(intelligence);
    const trend = intelligence.overallSentiment > 20 ? 'bullish' : 
                 intelligence.overallSentiment < -20 ? 'bearish' : 'sideways';

    return {
      overallSentiment: this.getMarketSentimentScore(),
      tokenSignals,
      marketConditions: {
        volatility,
        trend,
        confidence: intelligence.confidence
      }
    };
  }

  private determineVolatility(intelligence: MarketIntelligence): 'low' | 'medium' | 'high' {
    const urgentAlerts = intelligence.alerts.filter(a => a.urgency === 'high').length;
    const avgSentimentStrength = intelligence.alerts.reduce((sum, alert) => 
      sum + Math.abs(alert.sentiment), 0) / Math.max(1, intelligence.alerts.length);

    if (urgentAlerts > 3 || avgSentimentStrength > 60) return 'high';
    if (urgentAlerts > 1 || avgSentimentStrength > 30) return 'medium';
    return 'low';
  }

  getSystemStatus(): {
    isActive: boolean;
    rssStatus: any;
    lastUpdate: Date | null;
    alertCount: number;
  } {
    return {
      isActive: this.isActive,
      rssStatus: this.rssEngine.getStatus(),
      lastUpdate: this.cachedIntelligence?.lastUpdate || null,
      alertCount: this.cachedIntelligence?.alerts.length || 0
    };
  }
}