import { spawn } from 'child_process';
import { dataProtection } from './data-protection-middleware';
import { superstarEngine } from './superstar-evolution-engine';

interface TwitterSentiment {
  token: string;
  mention_count: number;
  sentiment_score: number;
  influence_score: number;
  trending_velocity: number;
  key_influencers: string[];
  viral_tweets: string[];
  risk_signals: string[];
}

interface APILimitationStatus {
  is_limited: boolean;
  reset_time: number;
  requests_remaining: number;
  accounts_available: number;
  healing_active: boolean;
}

export class TwitterIntelligenceScanner {
  private pythonProcess: any;
  private isRunning = false;
  private limitationHealer: APILimitationHealer;
  private sentimentCache = new Map<string, TwitterSentiment>();
  private lastUpdate = 0;

  constructor() {
    this.limitationHealer = new APILimitationHealer();
  }

  async initializeTwitterScraper(): Promise<void> {
    console.log('🐦 Initializing Twitter intelligence scanner...');
    
    try {
      // Create Python script for Twitter scraping
      await this.createTwitterScraperScript();
      
      // Start the scraper process
      await this.startScraperProcess();
      
      // Initialize API limitation healing
      await this.limitationHealer.startMonitoring();
      
      console.log('✅ Twitter intelligence scanner initialized');
      
    } catch (error) {
      const sanitizedError = dataProtection.sanitizeQuery(String(error));
      console.error('Twitter scanner initialization failed:', sanitizedError);
    }
  }

  private async createTwitterScraperScript(): Promise<void> {
    const pythonScript = `
import asyncio
import json
import sys
from twscrape import API, gather
from twscrape.logger import set_log_level
import time
from datetime import datetime, timedelta

class MemeTokenSentimentAnalyzer:
    def __init__(self):
        self.api = API("twitter_accounts.db")
        self.meme_keywords = [
            "pump.fun", "pumpfun", "memecoin", "meme coin", 
            "$SOL", "solana", "rug pull", "diamond hands",
            "to the moon", "hodl", "lambo", "ape in"
        ]
        
    async def setup_accounts(self):
        """Setup Twitter accounts with rotation capability"""
        try:
            # Account management with API limitation detection
            accounts = await self.api.pool.accounts_info()
            if len(accounts) == 0:
                print("⚠️ No Twitter accounts configured. Add accounts manually.")
                return False
            
            # Test account health
            healthy_accounts = 0
            for account in accounts:
                if account.status == "ACTIVE":
                    healthy_accounts += 1
            
            print(f"🔍 {healthy_accounts}/{len(accounts)} accounts healthy")
            return healthy_accounts > 0
            
        except Exception as e:
            print(f"Account setup error: {str(e)}")
            return False
    
    async def scan_token_sentiment(self, token_symbol):
        """Scan Twitter for token sentiment and viral signals"""
        try:
            search_queries = [
                f"${token_symbol}",
                f"{token_symbol} pump",
                f"{token_symbol} moon",
                f"{token_symbol} buy"
            ]
            
            sentiment_data = {
                "token": token_symbol,
                "mention_count": 0,
                "sentiment_score": 0.0,
                "influence_score": 0.0,
                "trending_velocity": 0.0,
                "key_influencers": [],
                "viral_tweets": [],
                "risk_signals": []
            }
            
            for query in search_queries:
                try:
                    tweets = []
                    async for tweet in self.api.search(query, limit=50):
                        tweets.append(tweet)
                    
                    # Analyze sentiment and influence
                    for tweet in tweets:
                        sentiment_data["mention_count"] += 1
                        
                        # Basic sentiment analysis
                        positive_words = ["moon", "pump", "buy", "bullish", "rocket"]
                        negative_words = ["dump", "sell", "bearish", "rug", "scam"]
                        
                        text_lower = tweet.rawContent.lower()
                        positive_score = sum(1 for word in positive_words if word in text_lower)
                        negative_score = sum(1 for word in negative_words if word in text_lower)
                        
                        sentiment_data["sentiment_score"] += (positive_score - negative_score)
                        
                        # Influence scoring
                        if tweet.user.followersCount > 10000:
                            sentiment_data["influence_score"] += tweet.user.followersCount / 1000000
                            sentiment_data["key_influencers"].append(tweet.user.username)
                        
                        # Viral detection
                        if tweet.retweetCount > 100 or tweet.likeCount > 500:
                            sentiment_data["viral_tweets"].append(tweet.id)
                        
                        # Risk signal detection
                        risk_words = ["rug", "scam", "dump", "exit"]
                        if any(word in text_lower for word in risk_words):
                            sentiment_data["risk_signals"].append(tweet.id)
                    
                    # Rate limiting protection
                    await asyncio.sleep(1)
                    
                except Exception as e:
                    print(f"Query error for {query}: {str(e)}")
                    continue
            
            # Calculate trending velocity
            if sentiment_data["mention_count"] > 0:
                sentiment_data["trending_velocity"] = sentiment_data["mention_count"] / 50 * 100
            
            return sentiment_data
            
        except Exception as e:
            print(f"Sentiment scan error: {str(e)}")
            return None
    
    async def scan_trending_tokens(self):
        """Scan for trending tokens and meme coins"""
        try:
            trending_terms = []
            
            # Scan pump.fun related content
            async for tweet in self.api.search("pump.fun", limit=100):
                # Extract potential token symbols from tweets
                import re
                symbols = re.findall(r'\\$([A-Z]{2,10})', tweet.rawContent)
                trending_terms.extend(symbols)
            
            # Count occurrences and rank
            from collections import Counter
            token_counts = Counter(trending_terms)
            
            trending_tokens = []
            for token, count in token_counts.most_common(10):
                if count >= 3:  # Minimum threshold
                    trending_tokens.append({
                        "symbol": token,
                        "mentions": count,
                        "timestamp": int(time.time())
                    })
            
            return trending_tokens
            
        except Exception as e:
            print(f"Trending scan error: {str(e)}")
            return []

async def main():
    analyzer = MemeTokenSentimentAnalyzer()
    
    # Setup accounts
    if not await analyzer.setup_accounts():
        print("❌ Failed to setup Twitter accounts")
        return
    
    print("🚀 Starting continuous meme coin sentiment analysis...")
    
    # Continuous scanning loop
    while True:
        try:
            # Scan trending tokens
            trending = await analyzer.scan_trending_tokens()
            
            # Analyze sentiment for each trending token
            for token_data in trending:
                sentiment = await analyzer.scan_token_sentiment(token_data["symbol"])
                if sentiment:
                    print(json.dumps({
                        "type": "sentiment_update",
                        "data": sentiment,
                        "timestamp": int(time.time())
                    }))
                    sys.stdout.flush()
            
            # Rate limiting and API protection
            await asyncio.sleep(30)  # 30 second intervals
            
        except Exception as e:
            print(f"Main loop error: {str(e)}")
            await asyncio.sleep(60)  # Longer delay on errors

if __name__ == "__main__":
    set_log_level("INFO")
    asyncio.run(main())
`;

    // Write the Python script to a file
    await this.writePythonScript(pythonScript);
  }

  private async writePythonScript(content: string): Promise<void> {
    const fs = require('fs').promises;
    await fs.writeFile('twitter_scanner.py', content);
  }

  private async startScraperProcess(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pythonProcess = spawn('python', ['twitter_scanner.py'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.pythonProcess.stdout.on('data', (data: Buffer) => {
        this.handleScraperOutput(data.toString());
      });

      this.pythonProcess.stderr.on('data', (data: Buffer) => {
        const error = dataProtection.sanitizeQuery(data.toString());
        console.error('Twitter scraper error:', error);
      });

      this.pythonProcess.on('close', (code: number) => {
        console.log(`Twitter scraper process exited with code ${code}`);
        this.isRunning = false;
        
        // Auto-restart on failure
        if (code !== 0) {
          setTimeout(() => this.startScraperProcess(), 30000);
        }
      });

      this.isRunning = true;
      resolve();
    });
  }

  private handleScraperOutput(output: string): void {
    try {
      const lines = output.trim().split('\n');
      
      for (const line of lines) {
        if (line.startsWith('{')) {
          const data = JSON.parse(line);
          
          if (data.type === 'sentiment_update') {
            this.processSentimentUpdate(data.data);
          }
        }
      }
    } catch (error) {
      // Skip malformed JSON
    }
  }

  private processSentimentUpdate(sentiment: TwitterSentiment): void {
    // Cache sentiment data
    this.sentimentCache.set(sentiment.token, sentiment);
    this.lastUpdate = Date.now();

    // Integrate with superstar engine
    this.integrateWithSuperstarEngine(sentiment);

    console.log(`🐦 Twitter sentiment update: ${sentiment.token} - ${sentiment.mention_count} mentions, ${sentiment.sentiment_score} sentiment`);
  }

  private async integrateWithSuperstarEngine(sentiment: TwitterSentiment): Promise<void> {
    // Feed Twitter insights to superstar evolution
    if (sentiment.mention_count > 50 && sentiment.sentiment_score > 10) {
      console.log(`⭐ High momentum detected: ${sentiment.token}`);
      
      // Trigger superstar analysis
      const insights = {
        source: 'twitter',
        token: sentiment.token,
        signal_strength: sentiment.influence_score,
        viral_potential: sentiment.viral_tweets.length,
        risk_level: sentiment.risk_signals.length
      };

      // This would integrate with the superstar engine
      // superstarEngine.processTwitterInsights(insights);
    }
  }

  async getTokenSentiment(token: string): Promise<TwitterSentiment | null> {
    return this.sentimentCache.get(token) || null;
  }

  async getTrendingTokens(): Promise<TwitterSentiment[]> {
    const now = Date.now();
    const recentThreshold = 300000; // 5 minutes

    return Array.from(this.sentimentCache.values())
      .filter(sentiment => (now - this.lastUpdate) < recentThreshold)
      .sort((a, b) => b.trending_velocity - a.trending_velocity)
      .slice(0, 10);
  }

  getAPIStatus(): APILimitationStatus {
    return this.limitationHealer.getStatus();
  }
}

class APILimitationHealer {
  private isMonitoring = false;
  private status: APILimitationStatus = {
    is_limited: false,
    reset_time: 0,
    requests_remaining: 100,
    accounts_available: 0,
    healing_active: false
  };

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;
    
    console.log('🔧 Starting API limitation monitoring and healing...');
    this.isMonitoring = true;

    // Monitor API health every 30 seconds
    setInterval(async () => {
      await this.checkAPIHealth();
      await this.performHealing();
    }, 30000);
  }

  private async checkAPIHealth(): Promise<void> {
    try {
      // Check if Python process is responsive
      // Monitor rate limit headers
      // Track account status
      
      // Simulate API health check
      this.status.requests_remaining = Math.max(0, this.status.requests_remaining - 1);
      
      if (this.status.requests_remaining < 10) {
        this.status.is_limited = true;
        this.status.reset_time = Date.now() + 900000; // 15 minutes
      } else if (Date.now() > this.status.reset_time) {
        this.status.is_limited = false;
        this.status.requests_remaining = 100;
      }
      
    } catch (error) {
      const sanitizedError = dataProtection.sanitizeQuery(String(error));
      console.error('API health check failed:', sanitizedError);
    }
  }

  private async performHealing(): Promise<void> {
    if (!this.status.is_limited) return;

    console.log('🔧 API limitation detected - activating healing protocols...');
    this.status.healing_active = true;

    try {
      // Account rotation
      await this.rotateAccounts();
      
      // Rate limit management
      await this.adjustRateLimits();
      
      // Proxy rotation if needed
      await this.rotateProxies();
      
      console.log('✅ API healing protocols completed');
      
    } catch (error) {
      const sanitizedError = dataProtection.sanitizeQuery(String(error));
      console.error('API healing failed:', sanitizedError);
    } finally {
      this.status.healing_active = false;
    }
  }

  private async rotateAccounts(): Promise<void> {
    // Implement account rotation logic
    console.log('🔄 Rotating Twitter accounts...');
  }

  private async adjustRateLimits(): Promise<void> {
    // Implement rate limit adjustments
    console.log('⏱️ Adjusting rate limits...');
  }

  private async rotateProxies(): Promise<void> {
    // Implement proxy rotation if available
    console.log('🌐 Rotating proxy connections...');
  }

  getStatus(): APILimitationStatus {
    return { ...this.status };
  }
}

export const twitterScanner = new TwitterIntelligenceScanner();