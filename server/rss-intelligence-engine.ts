/**
 * RSS Intelligence Engine
 * Monitors crypto news feeds for market-moving information
 */

import RSSParser from 'rss-parser';
import { spawn } from 'child_process';

interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  sentiment: number; // -100 to 100
  relevanceScore: number; // 0 to 100
  tokenMentions: string[];
  urgency: 'low' | 'medium' | 'high';
  category: 'market' | 'regulatory' | 'technical' | 'defi' | 'nft' | 'general';
}

interface FeedSource {
  url: string;
  name: string;
  credibility: number; // 0 to 100
  updateFrequency: number; // minutes
  lastChecked: Date;
  isActive: boolean;
}

export class RSSIntelligenceEngine {
  private parser: RSSParser;
  private feedSources: FeedSource[];
  private newsCache: Map<string, NewsItem[]>;
  private sentimentCache: Map<string, number>;
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.parser = new RSSParser({
      timeout: 10000,
      headers: {
        'User-Agent': 'Quantum AI Trading Intelligence Bot/1.0'
      }
    });

    // High-quality crypto news sources
    this.feedSources = [
      {
        url: 'https://cointelegraph.com/rss',
        name: 'Cointelegraph',
        credibility: 85,
        updateFrequency: 15,
        lastChecked: new Date(0),
        isActive: true
      },
      {
        url: 'https://decrypt.co/feed',
        name: 'Decrypt',
        credibility: 80,
        updateFrequency: 20,
        lastChecked: new Date(0),
        isActive: true
      },
      {
        url: 'https://blockworks.co/feed/',
        name: 'Blockworks',
        credibility: 85,
        updateFrequency: 30,
        lastChecked: new Date(0),
        isActive: true
      },
      {
        url: 'https://thedefiant.io/feed/',
        name: 'The Defiant',
        credibility: 82,
        updateFrequency: 45,
        lastChecked: new Date(0),
        isActive: true
      },
      {
        url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
        name: 'CoinDesk',
        credibility: 90,
        updateFrequency: 10,
        lastChecked: new Date(0),
        isActive: true
      },
      {
        url: 'https://cryptoslate.com/feed/',
        name: 'CryptoSlate',
        credibility: 75,
        updateFrequency: 25,
        lastChecked: new Date(0),
        isActive: true
      }
    ];

    this.newsCache = new Map();
    this.sentimentCache = new Map();

    // Initialize cache for each feed
    this.feedSources.forEach(feed => {
      this.newsCache.set(feed.name, []);
    });
  }

  /**
   * Start RSS monitoring with intelligent scheduling
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('📰 RSS Intelligence Engine activated');

    // Initial fetch from all sources
    await this.performFullScan();

    // Set up intelligent monitoring schedule
    this.monitoringInterval = setInterval(async () => {
      await this.performIncrementalScan();
    }, 5 * 60 * 1000); // Check every 5 minutes

    console.log('✅ RSS monitoring active with intelligent scheduling');
  }

  /**
   * Stop RSS monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('📰 RSS monitoring stopped');
  }

  /**
   * Perform full scan of all RSS feeds
   */
  private async performFullScan(): Promise<void> {
    console.log('📡 Performing full RSS scan...');

    for (const feed of this.feedSources) {
      if (!feed.isActive) continue;

      try {
        await this.processFeed(feed);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting
      } catch (error) {
        console.log(`❌ Error scanning ${feed.name}: ${error}`);
        this.handleFeedError(feed);
      }
    }
  }

  /**
   * Perform incremental scan based on update frequencies
   */
  private async performIncrementalScan(): Promise<void> {
    const now = new Date();
    const feedsToUpdate = this.feedSources.filter(feed => {
      if (!feed.isActive) return false;
      const timeSinceLastCheck = now.getTime() - feed.lastChecked.getTime();
      const updateInterval = feed.updateFrequency * 60 * 1000;
      return timeSinceLastCheck >= updateInterval;
    });

    if (feedsToUpdate.length === 0) return;

    console.log(`📡 Incremental RSS scan: ${feedsToUpdate.length} feeds`);

    for (const feed of feedsToUpdate) {
      try {
        await this.processFeed(feed);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Rate limiting
      } catch (error) {
        console.log(`❌ Error updating ${feed.name}: ${error}`);
        this.handleFeedError(feed);
      }
    }
  }

  /**
   * Process individual RSS feed
   */
  private async processFeed(feed: FeedSource): Promise<void> {
    try {
      console.log(`📰 Fetching ${feed.name}...`);
      const rssFeed = await this.parser.parseURL(feed.url);
      
      if (!rssFeed.items) {
        console.log(`⚠️ No items found in ${feed.name}`);
        return;
      }

      const existingNews = this.newsCache.get(feed.name) || [];
      const newItems: NewsItem[] = [];

      for (const item of rssFeed.items.slice(0, 10)) { // Process latest 10 items
        if (!item.title || !item.pubDate) continue;

        const pubDate = new Date(item.pubDate);
        const isNew = !existingNews.some(existing => 
          existing.title === item.title && existing.link === item.link
        );

        if (isNew) {
          const processedItem = await this.processNewsItem(item, feed);
          newItems.push(processedItem);
        }
      }

      if (newItems.length > 0) {
        console.log(`📈 ${feed.name}: ${newItems.length} new items`);
        
        // Update cache with new items (keep latest 50)
        const updatedCache = [...newItems, ...existingNews].slice(0, 50);
        this.newsCache.set(feed.name, updatedCache);

        // Log significant news
        this.reportSignificantNews(newItems, feed.name);
      }

      feed.lastChecked = new Date();

    } catch (error) {
      throw new Error(`Failed to process ${feed.name}: ${error}`);
    }
  }

  /**
   * Process individual news item with AI analysis
   */
  private async processNewsItem(item: any, feed: FeedSource): Promise<NewsItem> {
    const title = item.title || '';
    const description = item.description || item.summary || '';
    const content = `${title} ${description}`.toLowerCase();

    // Extract token mentions
    const tokenMentions = this.extractTokenMentions(content);

    // Analyze sentiment
    const sentiment = await this.analyzeSentiment(title, description);

    // Calculate relevance score
    const relevanceScore = this.calculateRelevanceScore(content, tokenMentions);

    // Determine urgency
    const urgency = this.determineUrgency(title, description, sentiment);

    // Categorize news
    const category = this.categorizeNews(content);

    return {
      title,
      description,
      link: item.link || '',
      pubDate: new Date(item.pubDate),
      sentiment,
      relevanceScore,
      tokenMentions,
      urgency,
      category
    };
  }

  /**
   * Extract cryptocurrency token mentions
   */
  private extractTokenMentions(content: string): string[] {
    const tokens = new Set<string>();
    
    // Common cryptocurrency patterns
    const patterns = [
      /\b(bitcoin|btc)\b/gi,
      /\b(ethereum|eth)\b/gi,
      /\b(solana|sol)\b/gi,
      /\b(cardano|ada)\b/gi,
      /\b(polygon|matic)\b/gi,
      /\b(chainlink|link)\b/gi,
      /\b(avalanche|avax)\b/gi,
      /\b(polkadot|dot)\b/gi,
      /\b(dogecoin|doge)\b/gi,
      /\b(shiba|shib)\b/gi,
      /\busd[ct]?\b/gi,
      /\b(raydium|ray)\b/gi,
      /\b(orca)\b/gi,
      /\b(serum|srm)\b/gi,
      /\$[A-Z]{2,10}\b/g // $TOKEN format
    ];

    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => tokens.add(match.replace('$', '').toUpperCase()));
      }
    });

    return Array.from(tokens);
  }

  /**
   * Analyze sentiment using keyword analysis
   */
  private async analyzeSentiment(title: string, description: string): Promise<number> {
    const text = `${title} ${description}`.toLowerCase();
    
    // Positive indicators
    const positiveWords = [
      'bullish', 'surge', 'rally', 'breakout', 'adoption', 'partnership',
      'integration', 'upgrade', 'launch', 'breakthrough', 'milestone',
      'record', 'institutional', 'investment', 'fund', 'backing'
    ];

    // Negative indicators
    const negativeWords = [
      'bearish', 'crash', 'dump', 'hack', 'exploit', 'regulation',
      'ban', 'concerns', 'risks', 'volatility', 'uncertainty',
      'investigation', 'lawsuit', 'sanctions', 'restrictions'
    ];

    let sentiment = 0;
    let wordCount = 0;

    positiveWords.forEach(word => {
      const matches = (text.match(new RegExp(word, 'gi')) || []).length;
      sentiment += matches * 10;
      wordCount += matches;
    });

    negativeWords.forEach(word => {
      const matches = (text.match(new RegExp(word, 'gi')) || []).length;
      sentiment -= matches * 10;
      wordCount += matches;
    });

    // Normalize sentiment
    if (wordCount > 0) {
      sentiment = Math.max(-100, Math.min(100, sentiment));
    }

    return sentiment;
  }

  /**
   * Calculate relevance score for trading decisions
   */
  private calculateRelevanceScore(content: string, tokenMentions: string[]): number {
    let score = 0;

    // Token mentions boost relevance
    score += tokenMentions.length * 15;

    // Market-related keywords
    const marketKeywords = [
      'price', 'trading', 'market', 'volume', 'liquidity', 'defi',
      'yield', 'staking', 'farming', 'protocol', 'tvl', 'apy'
    ];

    marketKeywords.forEach(keyword => {
      if (content.includes(keyword)) score += 10;
    });

    // High-impact keywords
    const highImpactKeywords = [
      'fed', 'interest rate', 'inflation', 'regulation', 'sec',
      'etf', 'institutional', 'whale', 'liquidation'
    ];

    highImpactKeywords.forEach(keyword => {
      if (content.includes(keyword)) score += 20;
    });

    return Math.min(100, score);
  }

  /**
   * Determine news urgency level
   */
  private determineUrgency(title: string, description: string, sentiment: number): 'low' | 'medium' | 'high' {
    const content = `${title} ${description}`.toLowerCase();

    // High urgency indicators
    const urgentKeywords = [
      'breaking', 'urgent', 'alert', 'emergency', 'crash', 'surge',
      'halt', 'suspended', 'investigation', 'hack', 'exploit'
    ];

    if (urgentKeywords.some(keyword => content.includes(keyword))) {
      return 'high';
    }

    // Medium urgency for strong sentiment
    if (Math.abs(sentiment) > 50) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Categorize news by type
   */
  private categorizeNews(content: string): NewsItem['category'] {
    if (content.includes('regulation') || content.includes('sec') || content.includes('legal')) {
      return 'regulatory';
    }
    if (content.includes('defi') || content.includes('yield') || content.includes('protocol')) {
      return 'defi';
    }
    if (content.includes('nft') || content.includes('collectible')) {
      return 'nft';
    }
    if (content.includes('technical') || content.includes('upgrade') || content.includes('blockchain')) {
      return 'technical';
    }
    if (content.includes('price') || content.includes('trading') || content.includes('market')) {
      return 'market';
    }
    return 'general';
  }

  /**
   * Report significant news items
   */
  private reportSignificantNews(newsItems: NewsItem[], sourceName: string): void {
    const significantNews = newsItems.filter(item => 
      item.relevanceScore > 50 || item.urgency === 'high' || Math.abs(item.sentiment) > 40
    );

    if (significantNews.length === 0) return;

    console.log(`🚨 SIGNIFICANT NEWS from ${sourceName}:`);
    significantNews.forEach(item => {
      console.log(`📰 ${item.title}`);
      console.log(`   Sentiment: ${item.sentiment} | Relevance: ${item.relevanceScore} | Urgency: ${item.urgency}`);
      if (item.tokenMentions.length > 0) {
        console.log(`   Tokens: ${item.tokenMentions.join(', ')}`);
      }
    });
  }

  /**
   * Handle feed errors with intelligent fallback
   */
  private handleFeedError(feed: FeedSource): void {
    console.log(`⚠️ ${feed.name} error - reducing priority temporarily`);
    
    // Temporarily reduce update frequency for problematic feeds
    feed.updateFrequency = Math.min(feed.updateFrequency * 1.5, 120);
    
    // Disable feed if consistently failing
    const now = new Date();
    const timeSinceSuccess = now.getTime() - feed.lastChecked.getTime();
    if (timeSinceSuccess > 2 * 60 * 60 * 1000) { // 2 hours
      feed.isActive = false;
      console.log(`❌ ${feed.name} disabled due to persistent errors`);
    }
  }

  /**
   * Get aggregated market sentiment from all news sources
   */
  getOverallMarketSentiment(): { sentiment: number; confidence: number; newsCount: number } {
    let totalSentiment = 0;
    let totalWeight = 0;
    let newsCount = 0;

    // Get recent news from all sources (last 6 hours)
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

    this.newsCache.forEach((newsItems, sourceName) => {
      const feed = this.feedSources.find(f => f.name === sourceName);
      if (!feed) return;

      const recentNews = newsItems.filter(item => item.pubDate > sixHoursAgo);
      
      recentNews.forEach(item => {
        const weight = (item.relevanceScore / 100) * (feed.credibility / 100);
        totalSentiment += item.sentiment * weight;
        totalWeight += weight;
        newsCount++;
      });
    });

    const sentiment = totalWeight > 0 ? totalSentiment / totalWeight : 0;
    const confidence = Math.min(100, totalWeight * 10); // Confidence based on weighted news volume

    return { sentiment, confidence, newsCount };
  }

  /**
   * Get token-specific sentiment
   */
  getTokenSentiment(token: string): { sentiment: number; mentions: number; recentNews: NewsItem[] } {
    const tokenUpper = token.toUpperCase();
    let totalSentiment = 0;
    let mentions = 0;
    const recentNews: NewsItem[] = [];

    // Look at news from last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    this.newsCache.forEach((newsItems) => {
      newsItems.forEach(item => {
        if (item.pubDate > oneDayAgo && item.tokenMentions.includes(tokenUpper)) {
          totalSentiment += item.sentiment;
          mentions++;
          recentNews.push(item);
        }
      });
    });

    const sentiment = mentions > 0 ? totalSentiment / mentions : 0;

    return { 
      sentiment, 
      mentions, 
      recentNews: recentNews.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()).slice(0, 5)
    };
  }

  /**
   * Get trading alerts based on news analysis
   */
  getTradingAlerts(): { 
    alerts: Array<{
      type: 'bullish' | 'bearish' | 'neutral';
      tokens: string[];
      reason: string;
      confidence: number;
      urgency: 'low' | 'medium' | 'high';
    }>;
  } {
    const alerts: any[] = [];
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Analyze recent high-impact news
    this.newsCache.forEach((newsItems) => {
      newsItems.forEach(item => {
        if (item.pubDate > oneHourAgo && 
            (item.relevanceScore > 70 || item.urgency === 'high' || Math.abs(item.sentiment) > 60)) {
          
          const type = item.sentiment > 20 ? 'bullish' : item.sentiment < -20 ? 'bearish' : 'neutral';
          const confidence = Math.min(100, item.relevanceScore + Math.abs(item.sentiment));

          alerts.push({
            type,
            tokens: item.tokenMentions,
            reason: item.title,
            confidence,
            urgency: item.urgency
          });
        }
      });
    });

    return { alerts: alerts.slice(0, 10) }; // Return top 10 alerts
  }

  /**
   * Get engine status
   */
  getStatus(): {
    isActive: boolean;
    feedsActive: number;
    totalFeeds: number;
    lastUpdate: Date;
    newsCount: number;
  } {
    const activeFeedsCount = this.feedSources.filter(f => f.isActive).length;
    const totalNewsCount = Array.from(this.newsCache.values()).reduce((total, items) => total + items.length, 0);
    const lastUpdate = Math.max(...this.feedSources.map(f => f.lastChecked.getTime()));

    return {
      isActive: this.isMonitoring,
      feedsActive: activeFeedsCount,
      totalFeeds: this.feedSources.length,
      lastUpdate: new Date(lastUpdate),
      newsCount: totalNewsCount
    };
  }
}