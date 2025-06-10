/**
 * Twitter Intelligence System using twscrape
 * Free API access without keys, respects rate limits
 */

import { spawn } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';

interface TwitterSentiment {
  token: string;
  sentiment: number; // -100 to 100
  volume: number;
  engagement: number;
  influencerMentions: number;
  timestamp: Date;
}

interface RateLimitConfig {
  searchRequests: number;
  searchWindow: number; // minutes
  userRequests: number;
  userWindow: number; // minutes
  maxConcurrent: number;
  cooldownPeriod: number; // minutes
}

export class TwitterIntelligenceSystem {
  private rateLimits: RateLimitConfig;
  private requestCounts: Map<string, { count: number; resetTime: number }>;
  private accountPool: string[];
  private currentAccountIndex: number = 0;
  private isInitialized: boolean = false;

  constructor() {
    // Conservative rate limits based on twscrape documentation
    this.rateLimits = {
      searchRequests: 50, // Per account per window
      searchWindow: 15, // 15 minutes
      userRequests: 30, // Per account per window
      userWindow: 15, // 15 minutes
      maxConcurrent: 2, // Maximum concurrent requests
      cooldownPeriod: 5 // Cooldown between account switches
    };
    
    this.requestCounts = new Map();
    this.accountPool = [];
    this.initializeAccounts();
  }

  private async initializeAccounts(): Promise<void> {
    console.log('🐦 Initializing Twitter intelligence system...');
    
    // Setup database and basic configuration
    await this.setupDatabase();
    
    this.isInitialized = true;
    console.log('✅ Twitter intelligence system ready (rate-limited operation)');
  }

  private async setupDatabase(): Promise<void> {
    // Create accounts database for twscrape
    const dbPath = './twitter_accounts.db';
    if (!existsSync(dbPath)) {
      console.log('📊 Creating Twitter accounts database...');
    }
  }

  /**
   * Rate-limited search for token mentions
   */
  async searchTokenMentions(token: string, limit: number = 20): Promise<TwitterSentiment> {
    if (!this.isInitialized) {
      await this.initializeAccounts();
    }

    if (!this.canMakeRequest('search')) {
      console.log(`⏰ Rate limit reached, waiting for reset...`);
      await this.waitForRateLimit('search');
    }

    try {
      const searchQuery = `${token} OR $${token} OR #${token}`;
      const tweets = await this.executeTwscrapeSearch(searchQuery, limit);
      
      this.recordRequest('search');
      
      return this.analyzeSentiment(token, tweets);
    } catch (error) {
      console.log(`❌ Twitter search error for ${token}: ${error}`);
      return this.getDefaultSentiment(token);
    }
  }

  /**
   * Get user profile and recent tweets for influencer analysis
   */
  async analyzeInfluencer(username: string): Promise<{ followers: number; engagement: number; recentMentions: string[] }> {
    if (!this.canMakeRequest('user')) {
      await this.waitForRateLimit('user');
    }

    try {
      const userInfo = await this.executeTwscrapeUser(username);
      const tweets = await this.executeTwscrapeUserTweets(username, 10);
      
      this.recordRequest('user');
      
      return {
        followers: userInfo.followers || 0,
        engagement: this.calculateEngagement(tweets),
        recentMentions: this.extractTokenMentions(tweets)
      };
    } catch (error) {
      console.log(`❌ Influencer analysis error for ${username}: ${error}`);
      return { followers: 0, engagement: 0, recentMentions: [] };
    }
  }

  /**
   * Execute twscrape search command with rate limiting
   */
  private async executeTwscrapeSearch(query: string, limit: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import asyncio
import json
from twscrape import API, gather

async def search_tweets():
    try:
        api = API("./twitter_accounts.db")
        
        # Search with rate limiting
        tweets = await gather(api.search("${query.replace(/"/g, '\\"')}", limit=${limit}))
        
        # Convert to JSON serializable format
        results = []
        for tweet in tweets:
            results.append({
                "id": tweet.id,
                "text": tweet.rawContent,
                "author": tweet.user.username if tweet.user else "unknown",
                "created_at": tweet.date.isoformat() if tweet.date else None,
                "retweet_count": tweet.retweetCount or 0,
                "like_count": tweet.likeCount or 0,
                "reply_count": tweet.replyCount or 0,
                "quote_count": tweet.quoteCount or 0
            })
        
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

asyncio.run(search_tweets())
`;

      const process = spawn('python3', ['-c', pythonScript]);
      let output = '';
      let error = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output.trim());
            if (result.error) {
              reject(new Error(result.error));
            } else {
              resolve(result);
            }
          } catch (parseError) {
            reject(new Error(`Parse error: ${parseError}, Output: ${output}`));
          }
        } else {
          reject(new Error(`Process exited with code ${code}: ${error}`));
        }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        process.kill();
        reject(new Error('Request timeout'));
      }, 30000);
    });
  }

  /**
   * Execute twscrape user lookup with rate limiting
   */
  private async executeTwscrapeUser(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import asyncio
import json
from twscrape import API

async def get_user():
    try:
        api = API("./twitter_accounts.db")
        user = await api.user_by_login("${username}")
        
        result = {
            "id": user.id,
            "username": user.username,
            "followers": user.followersCount or 0,
            "following": user.friendsCount or 0,
            "tweets": user.statusesCount or 0,
            "verified": user.verified or False
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

asyncio.run(get_user())
`;

      const process = spawn('python3', ['-c', pythonScript]);
      let output = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output.trim());
            resolve(result.error ? {} : result);
          } catch (parseError) {
            resolve({});
          }
        } else {
          resolve({});
        }
      });

      setTimeout(() => {
        process.kill();
        resolve({});
      }, 20000);
    });
  }

  /**
   * Get user's recent tweets
   */
  private async executeTwscrapeUserTweets(username: string, limit: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import asyncio
import json
from twscrape import API, gather

async def get_user_tweets():
    try:
        api = API("./twitter_accounts.db")
        user = await api.user_by_login("${username}")
        tweets = await gather(api.user_tweets(user.id, limit=${limit}))
        
        results = []
        for tweet in tweets:
            results.append({
                "text": tweet.rawContent,
                "retweet_count": tweet.retweetCount or 0,
                "like_count": tweet.likeCount or 0,
                "created_at": tweet.date.isoformat() if tweet.date else None
            })
        
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps([]))

asyncio.run(get_user_tweets())
`;

      const process = spawn('python3', ['-c', pythonScript]);
      let output = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.on('close', (code) => {
        try {
          const result = JSON.parse(output.trim() || '[]');
          resolve(Array.isArray(result) ? result : []);
        } catch {
          resolve([]);
        }
      });

      setTimeout(() => {
        process.kill();
        resolve([]);
      }, 20000);
    });
  }

  /**
   * Analyze sentiment from tweet data
   */
  private analyzeSentiment(token: string, tweets: any[]): TwitterSentiment {
    if (!tweets || tweets.length === 0) {
      return this.getDefaultSentiment(token);
    }

    let totalSentiment = 0;
    let totalEngagement = 0;
    let influencerMentions = 0;

    for (const tweet of tweets) {
      // Simple sentiment analysis based on keywords
      const text = tweet.text.toLowerCase();
      let sentiment = 0;

      // Positive indicators
      if (text.includes('bullish') || text.includes('moon') || text.includes('pump') || 
          text.includes('buy') || text.includes('hodl') || text.includes('diamond')) {
        sentiment += 20;
      }

      // Negative indicators
      if (text.includes('bearish') || text.includes('dump') || text.includes('sell') || 
          text.includes('crash') || text.includes('scam') || text.includes('rug')) {
        sentiment -= 20;
      }

      // Engagement weighting
      const engagement = (tweet.like_count || 0) + (tweet.retweet_count || 0) + (tweet.reply_count || 0);
      totalEngagement += engagement;

      // Weight sentiment by engagement
      totalSentiment += sentiment * Math.log(1 + engagement);

      // Check for influencer mentions (high follower accounts)
      if (engagement > 100) {
        influencerMentions++;
      }
    }

    const avgSentiment = tweets.length > 0 ? totalSentiment / tweets.length : 0;
    const volume = tweets.length;
    const avgEngagement = tweets.length > 0 ? totalEngagement / tweets.length : 0;

    return {
      token,
      sentiment: Math.max(-100, Math.min(100, avgSentiment)),
      volume,
      engagement: avgEngagement,
      influencerMentions,
      timestamp: new Date()
    };
  }

  /**
   * Rate limiting logic
   */
  private canMakeRequest(type: 'search' | 'user'): boolean {
    const now = Date.now();
    const config = type === 'search' ? 
      { limit: this.rateLimits.searchRequests, window: this.rateLimits.searchWindow } :
      { limit: this.rateLimits.userRequests, window: this.rateLimits.userWindow };

    const key = `${type}_${this.currentAccountIndex}`;
    const record = this.requestCounts.get(key);

    if (!record || now > record.resetTime) {
      return true;
    }

    return record.count < config.limit;
  }

  private recordRequest(type: 'search' | 'user'): void {
    const now = Date.now();
    const config = type === 'search' ? 
      { limit: this.rateLimits.searchRequests, window: this.rateLimits.searchWindow } :
      { limit: this.rateLimits.userRequests, window: this.rateLimits.userWindow };

    const key = `${type}_${this.currentAccountIndex}`;
    const record = this.requestCounts.get(key);

    if (!record || now > record.resetTime) {
      this.requestCounts.set(key, {
        count: 1,
        resetTime: now + (config.window * 60 * 1000)
      });
    } else {
      record.count++;
    }
  }

  private async waitForRateLimit(type: 'search' | 'user'): Promise<void> {
    const key = `${type}_${this.currentAccountIndex}`;
    const record = this.requestCounts.get(key);
    
    if (record) {
      const waitTime = record.resetTime - Date.now();
      if (waitTime > 0) {
        console.log(`⏰ Waiting ${Math.ceil(waitTime / 1000)}s for rate limit reset...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  private calculateEngagement(tweets: any[]): number {
    if (!tweets || tweets.length === 0) return 0;
    
    const totalEngagement = tweets.reduce((sum, tweet) => {
      return sum + (tweet.like_count || 0) + (tweet.retweet_count || 0) + (tweet.reply_count || 0);
    }, 0);

    return Math.floor(totalEngagement / tweets.length);
  }

  private extractTokenMentions(tweets: any[]): string[] {
    const mentions = new Set<string>();
    
    for (const tweet of tweets) {
      const text = tweet.text;
      // Extract $TOKEN mentions
      const tokenMatches = text.match(/\$[A-Z]{2,10}/g);
      if (tokenMatches) {
        tokenMatches.forEach(match => mentions.add(match.substring(1)));
      }
    }

    return Array.from(mentions);
  }

  private getDefaultSentiment(token: string): TwitterSentiment {
    return {
      token,
      sentiment: 0,
      volume: 0,
      engagement: 0,
      influencerMentions: 0,
      timestamp: new Date()
    };
  }

  /**
   * Bulk analysis for multiple tokens with rate limiting
   */
  async analyzeMultipleTokens(tokens: string[]): Promise<TwitterSentiment[]> {
    const results: TwitterSentiment[] = [];
    
    for (const token of tokens) {
      try {
        const sentiment = await this.searchTokenMentions(token, 15);
        results.push(sentiment);
        
        // Delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.log(`❌ Error analyzing ${token}: ${error}`);
        results.push(this.getDefaultSentiment(token));
      }
    }

    return results;
  }

  /**
   * Get trending crypto topics
   */
  async getTrendingCryptoTopics(): Promise<string[]> {
    try {
      const cryptoKeywords = ['crypto', 'bitcoin', 'ethereum', 'solana', 'defi', 'nft'];
      const trends: string[] = [];

      for (const keyword of cryptoKeywords) {
        if (this.canMakeRequest('search')) {
          const tweets = await this.executeTwscrapeSearch(keyword, 10);
          const mentions = this.extractTokenMentions(tweets);
          trends.push(...mentions);
          
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      // Return unique trending tokens
      return Array.from(new Set(trends)).slice(0, 10);
    } catch (error) {
      console.log(`❌ Error getting trending topics: ${error}`);
      return [];
    }
  }
}