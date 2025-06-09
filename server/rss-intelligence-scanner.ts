import RSSParser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cron from 'node-cron';
import { db } from './db.js';
import { rssFeedSources, newsArticles } from '../shared/schema.js';
import { eq, desc, and, gte } from 'drizzle-orm';

interface FeedSource {
  url: string;
  name: string;
  category: string;
  tokenRelevance: string[];
  weight: number;
}

class RSSIntelligenceScanner {
  private parser: RSSParser;
  private scanInterval: string = '*/5 * * * *'; // Every 5 minutes
  private maxArticlesPerFeed: number = 50;
  
  // Comprehensive free crypto/finance RSS feeds
  private feedSources: FeedSource[] = [
    // CoinDesk - Premier crypto news
    {
      url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
      name: 'CoinDesk',
      category: 'crypto_news',
      tokenRelevance: ['SOL', 'BTC', 'ETH', 'USDC', 'USDT'],
      weight: 0.9
    },
    // Cointelegraph - Major crypto publication
    {
      url: 'https://cointelegraph.com/rss',
      name: 'Cointelegraph',
      category: 'crypto_news',
      tokenRelevance: ['SOL', 'BTC', 'ETH', 'BONK', 'JUP'],
      weight: 0.85
    },
    // CryptoSlate - Technical analysis focus
    {
      url: 'https://cryptoslate.com/feed/',
      name: 'CryptoSlate',
      category: 'crypto_analysis',
      tokenRelevance: ['SOL', 'SOLANA', 'DEX', 'DeFi'],
      weight: 0.8
    },
    // The Block - Institutional crypto news
    {
      url: 'https://www.theblock.co/rss.xml',
      name: 'The Block',
      category: 'institutional',
      tokenRelevance: ['SOL', 'BTC', 'ETH', 'USDC', 'USDT'],
      weight: 0.75
    },
    // CryptoNews - General crypto coverage
    {
      url: 'https://cryptonews.com/news/feed/',
      name: 'CryptoNews',
      category: 'crypto_general',
      tokenRelevance: ['SOL', 'BONK', 'JUP', 'SOLANA'],
      weight: 0.7
    },
    // BeInCrypto - Market analysis
    {
      url: 'https://beincrypto.com/feed/',
      name: 'BeInCrypto',
      category: 'market_analysis',
      tokenRelevance: ['SOL', 'BTC', 'ETH', 'ALT'],
      weight: 0.7
    },
    // Decrypt - Web3 and crypto culture
    {
      url: 'https://decrypt.co/feed',
      name: 'Decrypt',
      category: 'web3_culture',
      tokenRelevance: ['SOL', 'NFT', 'DeFi', 'WEB3'],
      weight: 0.65
    },
    // CoinGape - Trading focused
    {
      url: 'https://coingape.com/feed/',
      name: 'CoinGape',
      category: 'trading_signals',
      tokenRelevance: ['SOL', 'BTC', 'ETH', 'TRADING'],
      weight: 0.6
    },
    // Finance feeds for macro context
    {
      url: 'https://finance.yahoo.com/rss/',
      name: 'Yahoo Finance',
      category: 'traditional_finance',
      tokenRelevance: ['USD', 'MARKETS', 'FED'],
      weight: 0.5
    }
  ];

  constructor() {
    this.parser = new RSSParser({
      customFields: {
        item: ['description', 'content', 'summary', 'media:content']
      }
    });
    this.startScanning();
  }

  async startScanning() {
    console.log('🔍 Starting RSS Intelligence Scanner');
    
    // Initial scan
    await this.performFullScan();
    
    // Schedule regular scans
    cron.schedule(this.scanInterval, async () => {
      await this.performFullScan();
    });
  }

  async performFullScan() {
    console.log('📡 Performing full RSS feed scan...');
    
    for (const feedSource of this.feedSources) {
      try {
        await this.scanFeed(feedSource);
        // Small delay to avoid overwhelming servers
        await this.delay(1000);
      } catch (error) {
        console.warn(`Failed to scan ${feedSource.name}:`, error.message);
      }
    }
  }

  async scanFeed(feedSource: FeedSource) {
    try {
      console.log(`📰 Scanning ${feedSource.name}...`);
      
      const feed = await this.parser.parseURL(feedSource.url);
      
      // Store/update feed source info
      await this.upsertFeedSource(feedSource, feed);
      
      // Process recent articles
      const recentArticles = feed.items.slice(0, this.maxArticlesPerFeed);
      
      for (const item of recentArticles) {
        await this.processArticle(item, feedSource);
      }
      
      console.log(`✅ Processed ${recentArticles.length} articles from ${feedSource.name}`);
      
    } catch (error) {
      await this.logFeedError(feedSource.url, error.message);
      throw error;
    }
  }

  async processArticle(item: any, feedSource: FeedSource) {
    try {
      // Extract and clean article data
      const articleData = {
        title: this.cleanText(item.title || ''),
        link: item.link || '',
        description: this.cleanText(item.description || item.summary || ''),
        content: this.cleanText(item.content || ''),
        author: item.creator || item.author || '',
        publishedAt: new Date(item.pubDate || item.isoDate || Date.now()),
        source: feedSource.name,
        category: feedSource.category
      };

      // Check if article already exists
      const existing = await db.select()
        .from(newsArticles)
        .where(eq(newsArticles.link, articleData.link))
        .limit(1);

      if (existing.length > 0) {
        return; // Skip duplicate
      }

      // Analyze content for trading signals
      const analysis = await this.analyzeArticleContent(articleData, feedSource);
      
      // Store article with analysis
      await db.insert(newsArticles).values({
        ...articleData,
        relevanceScore: analysis.relevanceScore.toString(),
        sentimentScore: analysis.sentimentScore.toString(),
        tokenMentions: analysis.tokenMentions,
        tradingSignals: analysis.tradingSignals,
        urgencyLevel: analysis.urgencyLevel
      });

    } catch (error) {
      console.warn('Failed to process article:', error.message);
    }
  }

  async analyzeArticleContent(article: any, feedSource: FeedSource) {
    const fullText = `${article.title} ${article.description} ${article.content}`.toLowerCase();
    
    // Token mention analysis
    const tokenMentions = this.extractTokenMentions(fullText, feedSource.tokenRelevance);
    
    // Sentiment analysis using keyword patterns
    const sentimentScore = this.calculateSentiment(fullText);
    
    // Relevance scoring
    const relevanceScore = this.calculateRelevance(fullText, tokenMentions, feedSource.weight);
    
    // Trading signal extraction
    const tradingSignals = this.extractTradingSignals(fullText);
    
    // Urgency detection
    const urgencyLevel = this.detectUrgency(fullText, article.publishedAt);

    return {
      tokenMentions,
      sentimentScore,
      relevanceScore,
      tradingSignals,
      urgencyLevel
    };
  }

  extractTokenMentions(text: string, relevantTokens: string[]): string[] {
    const mentions = [];
    
    // Extended token patterns
    const tokenPatterns = {
      'SOL': ['solana', 'sol token', '$sol', 'sol price', 'sol/usd'],
      'BTC': ['bitcoin', 'btc', '$btc', 'bitcoin price', 'btc/usd'],
      'ETH': ['ethereum', 'eth', '$eth', 'ethereum price', 'eth/usd'],
      'USDC': ['usd coin', 'usdc', '$usdc', 'circle'],
      'USDT': ['tether', 'usdt', '$usdt', 'tether price'],
      'BONK': ['bonk', '$bonk', 'bonk token', 'bonk inu'],
      'JUP': ['jupiter', 'jup', '$jup', 'jupiter dex', 'jupiter protocol']
    };

    for (const [token, patterns] of Object.entries(tokenPatterns)) {
      if (relevantTokens.includes(token)) {
        for (const pattern of patterns) {
          if (text.includes(pattern)) {
            mentions.push(token);
            break;
          }
        }
      }
    }

    return [...new Set(mentions)]; // Remove duplicates
  }

  calculateSentiment(text: string): number {
    const positiveWords = [
      'bullish', 'pump', 'moon', 'surge', 'rally', 'breakout', 'gains',
      'upward', 'positive', 'breakthrough', 'adoption', 'partnership',
      'upgrade', 'launch', 'success', 'growth', 'rise', 'increase'
    ];
    
    const negativeWords = [
      'bearish', 'dump', 'crash', 'drop', 'fall', 'decline', 'sell-off',
      'downward', 'negative', 'concerns', 'regulation', 'ban', 'hack',
      'exploit', 'loss', 'decrease', 'fear', 'uncertainty', 'volatility'
    ];

    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of positiveWords) {
      positiveCount += (text.match(new RegExp(word, 'g')) || []).length;
    }

    for (const word of negativeWords) {
      negativeCount += (text.match(new RegExp(word, 'g')) || []).length;
    }

    const total = positiveCount + negativeCount;
    if (total === 0) return 0.5; // Neutral

    return positiveCount / total; // 0-1 scale, 0.5 is neutral
  }

  calculateRelevance(text: string, tokenMentions: string[], sourceWeight: number): number {
    let relevanceScore = 0;

    // Base score from token mentions
    relevanceScore += tokenMentions.length * 0.3;

    // Trading-related keywords
    const tradingKeywords = [
      'price', 'trading', 'volume', 'market', 'chart', 'technical',
      'support', 'resistance', 'trend', 'analysis', 'forecast'
    ];

    for (const keyword of tradingKeywords) {
      if (text.includes(keyword)) {
        relevanceScore += 0.1;
      }
    }

    // Apply source weight
    relevanceScore *= sourceWeight;

    return Math.min(relevanceScore, 1.0); // Cap at 1.0
  }

  extractTradingSignals(text: string): any {
    const signals = {
      priceTargets: [],
      supportLevels: [],
      resistanceLevels: [],
      timeFrames: [],
      actionWords: []
    };

    // Extract price targets (simplified regex patterns)
    const pricePatterns = [
      /\$([0-9,]+\.?[0-9]*)/g,
      /([0-9,]+\.?[0-9]*)\s*usd/g,
      /target.*?([0-9,]+\.?[0-9]*)/g
    ];

    for (const pattern of pricePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        signals.priceTargets.push(...matches.slice(0, 3)); // Limit to 3
      }
    }

    // Extract action words
    const actionWords = ['buy', 'sell', 'hold', 'accumulate', 'exit', 'enter'];
    for (const word of actionWords) {
      if (text.includes(word)) {
        signals.actionWords.push(word);
      }
    }

    return signals;
  }

  detectUrgency(text: string, publishedAt: Date): string {
    const urgentKeywords = [
      'breaking', 'urgent', 'alert', 'now', 'immediate', 'flash',
      'emergency', 'critical', 'developing', 'just in'
    ];

    const hasUrgentKeywords = urgentKeywords.some(keyword => text.includes(keyword));
    const isRecent = Date.now() - publishedAt.getTime() < 3600000; // Within 1 hour

    if (hasUrgentKeywords && isRecent) return 'high';
    if (hasUrgentKeywords || isRecent) return 'medium';
    return 'low';
  }

  cleanText(text: string): string {
    // Remove HTML tags and clean up text
    const $ = cheerio.load(text);
    return $.text().trim().substring(0, 5000); // Limit length
  }

  async upsertFeedSource(feedSource: FeedSource, feedData: any) {
    try {
      const existing = await db.select()
        .from(rssFeedSources)
        .where(eq(rssFeedSources.url, feedSource.url))
        .limit(1);

      const feedInfo = {
        url: feedSource.url,
        name: feedSource.name,
        category: feedSource.category,
        isActive: true,
        lastFetched: new Date(),
        lastSuccessfulFetch: new Date(),
        errorCount: 0,
        totalArticles: feedData.items?.length || 0
      };

      if (existing.length > 0) {
        await db.update(rssFeedSources)
          .set(feedInfo)
          .where(eq(rssFeedSources.url, feedSource.url));
      } else {
        await db.insert(rssFeedSources).values(feedInfo);
      }
    } catch (error) {
      console.warn('Failed to upsert feed source:', error.message);
    }
  }

  async logFeedError(url: string, errorMessage: string) {
    try {
      await db.update(rssFeedSources)
        .set({
          lastFetched: new Date(),
          errorCount: db.select().from(rssFeedSources).where(eq(rssFeedSources.url, url)),
          lastError: errorMessage
        })
        .where(eq(rssFeedSources.url, url));
    } catch (error) {
      console.warn('Failed to log feed error:', error.message);
    }
  }

  async getLatestSignals(limit: number = 20) {
    return await db.select()
      .from(newsArticles)
      .where(and(
        gte(newsArticles.publishedAt, new Date(Date.now() - 24 * 60 * 60 * 1000)), // Last 24 hours
        eq(newsArticles.relevanceScore, 'high')
      ))
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const rssScanner = new RSSIntelligenceScanner();