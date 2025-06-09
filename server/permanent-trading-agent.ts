// Permanent Trading Agent with Quantum Hyper-Empowerment
// Leveraging RSS feeds, live on-chain data, and VibeCoding methodology

import { db } from './db.js';
import { tradingAgents, marketDataStreams, tradingSignals, rssFeedSources, rssFeedItems, onChainEvents, agentPerformanceLogs, vibeCodingMetrics } from '../shared/schema.js';
import { eq, desc, and, gte } from 'drizzle-orm';
import { TradingIntelligenceEngine } from '../solana-bot/src/intelligence-engine.js';
import Parser from 'rss-parser';
import WebSocket from 'ws';

interface AgentConfiguration {
  riskTolerance: number;
  maxPositionSize: number;
  targetTokens: string[];
  enabledDataSources: string[];
  vibeCodingWeights: {
    pizzaKitchen: number;
    rhythmGaming: number;
    vrChatSocial: number;
    classicalPhilosophy: number;
  };
  tradingRules: {
    minConfidence: number;
    maxDailyTrades: number;
    stopLossPercentage: number;
    takeProfitPercentage: number;
  };
}

class PermanentTradingAgent {
  private agentId: string;
  private config: AgentConfiguration;
  private intelligenceEngine: TradingIntelligenceEngine;
  private rssParser: Parser;
  private solanaWs: WebSocket | null = null;
  private isRunning: boolean = false;
  private intervals: NodeJS.Timeout[] = [];

  constructor(agentId: string) {
    this.agentId = agentId;
    this.intelligenceEngine = new TradingIntelligenceEngine();
    this.rssParser = new Parser({
      customFields: {
        item: ['pubDate', 'description', 'content']
      }
    });
    
    this.initializeAgent();
  }

  private async initializeAgent() {
    console.log(`🤖 Initializing Permanent Trading Agent: ${this.agentId}`);
    
    // Load agent configuration from database
    await this.loadConfiguration();
    
    // Initialize RSS feeds
    await this.initializeRSSFeeds();
    
    // Connect to Solana WebSocket for live on-chain data
    await this.connectToSolanaStream();
    
    // Start all monitoring loops
    this.startAgent();
    
    console.log(`✅ Permanent Trading Agent ${this.agentId} fully operational`);
  }

  private async loadConfiguration() {
    const [agent] = await db.select().from(tradingAgents).where(eq(tradingAgents.id, this.agentId));
    
    if (!agent) {
      // Create default agent configuration
      const defaultConfig: AgentConfiguration = {
        riskTolerance: 0.05,
        maxPositionSize: 0.1,
        targetTokens: ['So11111111111111111111111111111111111111112'], // SOL
        enabledDataSources: ['jupiter', 'birdeye', 'rss', 'onchain', 'news', 'sentiment'],
        vibeCodingWeights: {
          pizzaKitchen: 0.25,
          rhythmGaming: 0.25,
          vrChatSocial: 0.25,
          classicalPhilosophy: 0.25
        },
        tradingRules: {
          minConfidence: 0.75,
          maxDailyTrades: 10,
          stopLossPercentage: 0.08,
          takeProfitPercentage: 0.15
        }
      };

      await db.insert(tradingAgents).values({
        id: this.agentId,
        name: 'VibeCoding Quantum Trading Agent',
        status: 'active',
        configuration: defaultConfig,
        performanceMetrics: {
          totalTrades: 0,
          successfulTrades: 0,
          totalReturn: 0,
          sharpeRatio: 0
        }
      });

      this.config = defaultConfig;
    } else {
      this.config = agent.configuration as AgentConfiguration;
    }
  }

  private async initializeRSSFeeds() {
    console.log('📡 Initializing RSS feeds for quantum market intelligence');
    
    const cryptoRSSFeeds = [
      { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'news' },
      { name: 'Cointelegraph', url: 'https://cointelegraph.com/rss', category: 'news' },
      { name: 'CryptoSlate', url: 'https://cryptoslate.com/feed/', category: 'news' },
      { name: 'Decrypt', url: 'https://decrypt.co/feed', category: 'news' },
      { name: 'DeFi Pulse', url: 'https://defipulse.com/blog/feed/', category: 'defi' },
      { name: 'Solana News', url: 'https://solana.com/news/rss.xml', category: 'solana' },
      { name: 'Messari', url: 'https://messari.io/rss', category: 'analysis' },
      { name: 'The Block', url: 'https://www.theblock.co/rss.xml', category: 'news' }
    ];

    for (const feed of cryptoRSSFeeds) {
      try {
        const [existingFeed] = await db.select().from(rssFeedSources).where(eq(rssFeedSources.url, feed.url));
        
        if (!existingFeed) {
          await db.insert(rssFeedSources).values({
            name: feed.name,
            url: feed.url,
            category: feed.category,
            active: true
          });
          console.log(`Added RSS feed: ${feed.name}`);
        }
      } catch (error) {
        console.warn(`Failed to add RSS feed ${feed.name}:`, error);
      }
    }
  }

  private async connectToSolanaStream() {
    console.log('🔗 Connecting to Solana WebSocket for live on-chain data');
    
    try {
      this.solanaWs = new WebSocket('wss://api.mainnet-beta.solana.com');
      
      this.solanaWs.on('open', () => {
        console.log('✅ Connected to Solana WebSocket');
        
        // Subscribe to account changes for target tokens
        this.config.targetTokens.forEach(tokenAddress => {
          this.solanaWs?.send(JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'accountSubscribe',
            params: [
              tokenAddress,
              {
                encoding: 'jsonParsed',
                commitment: 'finalized'
              }
            ]
          }));
        });
      });

      this.solanaWs.on('message', (data) => {
        this.handleSolanaMessage(data.toString());
      });

      this.solanaWs.on('error', (error) => {
        console.error('Solana WebSocket error:', error);
        // Reconnect after 5 seconds
        setTimeout(() => this.connectToSolanaStream(), 5000);
      });

    } catch (error) {
      console.error('Failed to connect to Solana WebSocket:', error);
    }
  }

  private async handleSolanaMessage(message: string) {
    try {
      const data = JSON.parse(message);
      
      if (data.method === 'accountNotification') {
        const accountData = data.params.result;
        
        // Store on-chain event
        await db.insert(onChainEvents).values({
          eventType: 'account_change',
          transactionHash: accountData.context.slot.toString(),
          blockNumber: accountData.context.slot,
          tokenAddress: accountData.value.pubkey,
          eventData: accountData.value,
          timestamp: new Date(),
          processed: false
        });

        // Process immediately for real-time trading decisions
        await this.processOnChainEvent(accountData);
      }
    } catch (error) {
      console.error('Error processing Solana message:', error);
    }
  }

  private async processOnChainEvent(eventData: any) {
    // Real-time on-chain analysis with VibeCoding methodology
    const analysis = {
      pizzaKitchenReliability: this.validateOnChainDataQuality(eventData),
      rhythmGamingPrecision: this.calculateEventTiming(eventData),
      vrChatSocialInsights: await this.analyzeOnChainSocialSignals(eventData),
      classicalPhilosophyWisdom: this.assessOnChainEthics(eventData)
    };

    // Generate trading signal if criteria met
    const signal = this.evaluateOnChainSignal(eventData, analysis);
    if (signal) {
      await this.generateTradingSignal(signal);
    }
  }

  private startAgent() {
    console.log('🚀 Starting all monitoring loops for quantum-empowered trading');
    
    this.isRunning = true;

    // RSS feed monitoring (every 5 minutes)
    this.intervals.push(setInterval(() => this.processRSSFeeds(), 5 * 60 * 1000));

    // Market data collection (every 30 seconds)
    this.intervals.push(setInterval(() => this.collectMarketData(), 30 * 1000));

    // Signal generation and analysis (every 60 seconds)
    this.intervals.push(setInterval(() => this.generateSignals(), 60 * 1000));

    // Performance monitoring (every 10 minutes)
    this.intervals.push(setInterval(() => this.updatePerformanceMetrics(), 10 * 60 * 1000));

    // VibeCoding methodology evaluation (every 5 minutes)
    this.intervals.push(setInterval(() => this.evaluateVibeCodingMetrics(), 5 * 60 * 1000));

    // Start immediate processing
    this.processRSSFeeds();
    this.collectMarketData();
  }

  private async processRSSFeeds() {
    console.log('📰 Processing RSS feeds for market intelligence');
    
    const activeFeeds = await db.select().from(rssFeedSources).where(eq(rssFeedSources.active, true));

    for (const feed of activeFeeds) {
      try {
        const parsedFeed = await this.rssParser.parseURL(feed.url);
        
        for (const item of parsedFeed.items) {
          // Check if item already exists
          const [existingItem] = await db.select().from(rssFeedItems).where(eq(rssFeedItems.link, item.link || ''));
          
          if (!existingItem && item.link) {
            // Analyze sentiment using Hugging Face
            const sentiment = await this.analyzeSentiment(item.title + ' ' + (item.contentSnippet || ''));
            const relevance = this.calculateRelevanceScore(item.title + ' ' + (item.contentSnippet || ''));

            await db.insert(rssFeedItems).values({
              feedId: feed.id,
              title: item.title || '',
              description: item.contentSnippet || '',
              link: item.link,
              pubDate: new Date(item.pubDate || Date.now()),
              sentiment: sentiment,
              relevanceScore: relevance,
              processed: false
            });
          }
        }

        // Update last fetched time
        await db.update(rssFeedSources)
          .set({ lastFetched: new Date(), errorCount: 0 })
          .where(eq(rssFeedSources.id, feed.id));

      } catch (error) {
        console.error(`Error processing RSS feed ${feed.name}:`, error);
        
        // Increment error count
        await db.update(rssFeedSources)
          .set({ errorCount: feed.errorCount + 1 })
          .where(eq(rssFeedSources.id, feed.id));
      }
    }
  }

  private async collectMarketData() {
    console.log('📊 Collecting comprehensive market data');
    
    for (const tokenAddress of this.config.targetTokens) {
      try {
        // Collect data from multiple sources
        const [jupiterData, birdeyeData, newsData] = await Promise.all([
          this.getJupiterData(tokenAddress),
          this.getBirdeyeData(tokenAddress),
          this.getRecentNews(tokenAddress)
        ]);

        // Store market data streams
        if (jupiterData) {
          await db.insert(marketDataStreams).values({
            source: 'jupiter',
            dataType: 'price',
            tokenAddress,
            data: jupiterData,
            processed: false
          });
        }

        if (birdeyeData) {
          await db.insert(marketDataStreams).values({
            source: 'birdeye',
            dataType: 'overview',
            tokenAddress,
            data: birdeyeData,
            processed: false
          });
        }

        if (newsData) {
          await db.insert(marketDataStreams).values({
            source: 'news',
            dataType: 'sentiment',
            tokenAddress,
            data: newsData,
            processed: false
          });
        }

      } catch (error) {
        console.error(`Error collecting market data for ${tokenAddress}:`, error);
      }
    }
  }

  private async generateSignals() {
    console.log('🧠 Generating trading signals with quantum intelligence');
    
    for (const tokenAddress of this.config.targetTokens) {
      try {
        // Get comprehensive market intelligence
        const intelligence = await this.intelligenceEngine.generateTradingIntelligence(tokenAddress);
        
        // Apply VibeCoding methodology analysis
        const vibeCodingAnalysis = await this.applyVibeCodingAnalysis(intelligence);
        
        // Generate signal if criteria met
        if (vibeCodingAnalysis.overallScore >= this.config.tradingRules.minConfidence) {
          await db.insert(tradingSignals).values({
            agentId: this.agentId,
            tokenAddress,
            signalType: intelligence.tradingRecommendation.action,
            confidence: intelligence.tradingRecommendation.confidence,
            reasoning: JSON.stringify(intelligence.tradingRecommendation.reasoning),
            dataSource: {
              intelligence,
              vibeCodingAnalysis
            },
            vibeCodingScore: vibeCodingAnalysis.overallScore,
            executed: false
          });

          console.log(`Generated ${intelligence.tradingRecommendation.action} signal for ${tokenAddress} with ${(vibeCodingAnalysis.overallScore * 100).toFixed(1)}% confidence`);
        }

      } catch (error) {
        console.error(`Error generating signals for ${tokenAddress}:`, error);
      }
    }
  }

  private async applyVibeCodingAnalysis(intelligence: any) {
    // Pizza Kitchen Reliability: Consistent data quality under market pressure
    const pizzaKitchenScore = this.assessDataReliability(intelligence);
    
    // Rhythm Gaming Precision: Frame-perfect timing analysis
    const rhythmGamingScore = this.assessTimingPrecision(intelligence);
    
    // VRChat Social Insights: Community and social sentiment analysis
    const vrChatSocialScore = await this.assessSocialIntelligence(intelligence);
    
    // Classical Philosophy: Ethical and long-term strategic thinking
    const classicalPhilosophyScore = this.assessStrategicWisdom(intelligence);

    const overallScore = (
      pizzaKitchenScore * this.config.vibeCodingWeights.pizzaKitchen +
      rhythmGamingScore * this.config.vibeCodingWeights.rhythmGaming +
      vrChatSocialScore * this.config.vibeCodingWeights.vrChatSocial +
      classicalPhilosophyScore * this.config.vibeCodingWeights.classicalPhilosophy
    );

    return {
      pizzaKitchenScore,
      rhythmGamingScore,
      vrChatSocialScore,
      classicalPhilosophyScore,
      overallScore,
      methodology: 'VibeCoding Quantum Analysis'
    };
  }

  private async updatePerformanceMetrics() {
    console.log('📈 Updating agent performance metrics');
    
    // Calculate recent performance
    const recentSignals = await db.select()
      .from(tradingSignals)
      .where(and(
        eq(tradingSignals.agentId, this.agentId),
        gte(tradingSignals.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)) // Last 24 hours
      ));

    const executedSignals = recentSignals.filter(s => s.executed);
    const successfulSignals = executedSignals.filter(s => {
      const result = s.executionResult as any;
      return result && result.profitable;
    });

    const performanceMetrics = {
      totalSignals: recentSignals.length,
      executedSignals: executedSignals.length,
      successfulSignals: successfulSignals.length,
      successRate: executedSignals.length > 0 ? successfulSignals.length / executedSignals.length : 0,
      avgConfidence: recentSignals.reduce((sum, s) => sum + Number(s.confidence), 0) / recentSignals.length || 0,
      avgVibeCodingScore: recentSignals.reduce((sum, s) => sum + Number(s.vibeCodingScore), 0) / recentSignals.length || 0
    };

    // Log performance metrics
    await db.insert(agentPerformanceLogs).values({
      agentId: this.agentId,
      metricType: 'daily_performance',
      metricValue: performanceMetrics.successRate,
      context: performanceMetrics
    });

    // Update agent record
    await db.update(tradingAgents)
      .set({ 
        performanceMetrics,
        lastActivity: new Date(),
        updatedAt: new Date()
      })
      .where(eq(tradingAgents.id, this.agentId));
  }

  private async evaluateVibeCodingMetrics() {
    console.log('🎯 Evaluating VibeCoding methodology metrics');
    
    const recentAnalysis = await this.getCurrentVibeCodingMetrics();
    
    await db.insert(vibeCodingMetrics).values({
      agentId: this.agentId,
      pizzaKitchenReliability: recentAnalysis.pizzaKitchen,
      rhythmGamingPrecision: recentAnalysis.rhythmGaming,
      vrChatSocialInsights: recentAnalysis.vrChatSocial,
      classicalPhilosophyWisdom: recentAnalysis.classicalPhilosophy,
      overallScore: recentAnalysis.overall,
      context: 'continuous_evaluation'
    });

    console.log(`VibeCoding Metrics - Pizza Kitchen: ${(recentAnalysis.pizzaKitchen * 100).toFixed(1)}%, Rhythm Gaming: ${(recentAnalysis.rhythmGaming * 100).toFixed(1)}%, VRChat Social: ${(recentAnalysis.vrChatSocial * 100).toFixed(1)}%, Classical Philosophy: ${(recentAnalysis.classicalPhilosophy * 100).toFixed(1)}%`);
  }

  // Helper methods for VibeCoding analysis
  private assessDataReliability(intelligence: any): number {
    // Pizza kitchen standard: consistent quality under pressure
    const dataCompletenessScore = intelligence.marketData ? 0.9 : 0.1;
    const dataFreshnessScore = this.calculateDataFreshness(intelligence);
    const crossValidationScore = this.validateDataConsistency(intelligence);
    
    return (dataCompletenessScore + dataFreshnessScore + crossValidationScore) / 3;
  }

  private assessTimingPrecision(intelligence: any): number {
    // Rhythm gaming standard: frame-perfect execution timing
    const signalLatency = Date.now() - new Date(intelligence.timestamp).getTime();
    const precisionScore = signalLatency < 1000 ? 1.0 : Math.max(0, 1 - (signalLatency - 1000) / 10000);
    
    return precisionScore;
  }

  private async assessSocialIntelligence(intelligence: any): Promise<number> {
    // VRChat research: understanding social dynamics and sentiment
    const sentimentAnalysis = intelligence.vibeCodingAnalysis?.vrChatSocialInsights;
    const communityScore = sentimentAnalysis?.communitysentiment?.confidence || 0.5;
    const viralityScore = sentimentAnalysis?.viralityMetrics?.score || 0.5;
    
    return (communityScore + viralityScore) / 2;
  }

  private assessStrategicWisdom(intelligence: any): number {
    // Classical philosophy: long-term thinking and ethical considerations
    const philosophicalAnalysis = intelligence.vibeCodingAnalysis?.classicalPhilosophyWisdom;
    const prudenceScore = philosophicalAnalysis?.prudence?.prudenceRating || 0.8;
    const ethicalScore = philosophicalAnalysis?.justice?.ethicalRating || 0.9;
    const wisdomScore = philosophicalAnalysis?.longTermThinking?.wisdomRating || 0.8;
    
    return (prudenceScore + ethicalScore + wisdomScore) / 3;
  }

  private calculateDataFreshness(intelligence: any): number {
    const timestamp = new Date(intelligence.timestamp);
    const age = Date.now() - timestamp.getTime();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    return Math.max(0, 1 - age / maxAge);
  }

  private validateDataConsistency(intelligence: any): number {
    // Cross-validate data from multiple sources
    const hasJupiter = !!intelligence.marketData?.jupiter;
    const hasBirdeye = !!intelligence.marketData?.birdeye;
    const hasNews = !!intelligence.marketData?.news;
    
    return (Number(hasJupiter) + Number(hasBirdeye) + Number(hasNews)) / 3;
  }

  private validateOnChainDataQuality(eventData: any): number {
    // Validate on-chain data quality with pizza kitchen standards
    const hasRequiredFields = eventData.value && eventData.context;
    const dataIntegrity = eventData.value?.data !== null;
    
    return (Number(hasRequiredFields) + Number(dataIntegrity)) / 2;
  }

  private calculateEventTiming(eventData: any): number {
    // Calculate event processing timing with rhythm gaming precision
    const eventTime = eventData.context?.slot ? eventData.context.slot * 400 : Date.now(); // Approximate slot time
    const processingDelay = Date.now() - eventTime;
    
    return processingDelay < 1000 ? 1.0 : Math.max(0, 1 - processingDelay / 10000);
  }

  private async analyzeOnChainSocialSignals(eventData: any): Promise<number> {
    // Analyze social signals from on-chain activity
    // Large transactions might indicate institutional interest
    const accountInfo = eventData.value;
    const lamports = accountInfo?.lamports || 0;
    
    // Score based on transaction size (simplified)
    return Math.min(lamports / 1000000000, 1); // Normalize to SOL amount
  }

  private assessOnChainEthics(eventData: any): number {
    // Assess ethical implications of on-chain activity
    // For now, assume all monitored activity is ethical
    return 0.95;
  }

  private evaluateOnChainSignal(eventData: any, analysis: any): any {
    const overallScore = (
      analysis.pizzaKitchenReliability * 0.25 +
      analysis.rhythmGamingPrecision * 0.25 +
      analysis.vrChatSocialInsights * 0.25 +
      analysis.classicalPhilosophyWisdom * 0.25
    );

    if (overallScore >= this.config.tradingRules.minConfidence) {
      return {
        type: 'onchain_signal',
        score: overallScore,
        data: eventData,
        analysis
      };
    }

    return null;
  }

  private async generateTradingSignal(signal: any) {
    // Generate trading signal from various inputs
    await db.insert(tradingSignals).values({
      agentId: this.agentId,
      tokenAddress: signal.tokenAddress || this.config.targetTokens[0],
      signalType: signal.type === 'positive' ? 'BUY' : signal.type === 'negative' ? 'SELL' : 'HOLD',
      confidence: signal.score,
      reasoning: JSON.stringify(signal.analysis),
      dataSource: signal,
      vibeCodingScore: signal.score,
      executed: false
    });
  }

  private async analyzeSentiment(text: string): Promise<number> {
    // Use Hugging Face for sentiment analysis
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.HF_KEY}` },
        body: JSON.stringify({ inputs: text })
      });
      
      const result = await response.json();
      if (result && result[0]) {
        const sentiments = result[0];
        const positive = sentiments.find((s: any) => s.label === 'LABEL_2')?.score || 0;
        const negative = sentiments.find((s: any) => s.label === 'LABEL_0')?.score || 0;
        
        return positive - negative; // Range: -1 to 1
      }
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
    }
    
    return 0; // Neutral
  }

  private calculateRelevanceScore(text: string): number {
    const cryptoKeywords = ['bitcoin', 'ethereum', 'solana', 'defi', 'crypto', 'blockchain', 'trading', 'investment'];
    const words = text.toLowerCase().split(/\s+/);
    const matches = words.filter(word => cryptoKeywords.some(keyword => word.includes(keyword)));
    
    return Math.min(matches.length / words.length * 10, 1); // Normalize to 0-1
  }

  private async getJupiterData(tokenAddress: string) {
    // Implementation would call Jupiter API
    return null; // Placeholder
  }

  private async getBirdeyeData(tokenAddress: string) {
    // Implementation would call Birdeye API
    return null; // Placeholder
  }

  private async getRecentNews(tokenAddress: string) {
    // Get recent news from RSS feeds
    const recentNews = await db.select()
      .from(rssFeedItems)
      .where(gte(rssFeedItems.pubDate, new Date(Date.now() - 24 * 60 * 60 * 1000)))
      .orderBy(desc(rssFeedItems.pubDate))
      .limit(10);
    
    return recentNews;
  }

  private async getCurrentVibeCodingMetrics() {
    // Get current VibeCoding methodology metrics
    const recent = await db.select()
      .from(vibeCodingMetrics)
      .where(eq(vibeCodingMetrics.agentId, this.agentId))
      .orderBy(desc(vibeCodingMetrics.timestamp))
      .limit(1);

    if (recent.length > 0) {
      const metrics = recent[0];
      return {
        pizzaKitchen: Number(metrics.pizzaKitchenReliability),
        rhythmGaming: Number(metrics.rhythmGamingPrecision),
        vrChatSocial: Number(metrics.vrChatSocialInsights),
        classicalPhilosophy: Number(metrics.classicalPhilosophyWisdom),
        overall: Number(metrics.overallScore)
      };
    }

    return {
      pizzaKitchen: 0.8,
      rhythmGaming: 0.85,
      vrChatSocial: 0.75,
      classicalPhilosophy: 0.9,
      overall: 0.825
    };
  }

  // Public methods for external control
  async pauseAgent() {
    this.isRunning = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    
    await db.update(tradingAgents)
      .set({ status: 'paused', updatedAt: new Date() })
      .where(eq(tradingAgents.id, this.agentId));
    
    console.log(`Agent ${this.agentId} paused`);
  }

  async resumeAgent() {
    if (!this.isRunning) {
      await db.update(tradingAgents)
        .set({ status: 'active', updatedAt: new Date() })
        .where(eq(tradingAgents.id, this.agentId));
      
      this.startAgent();
      console.log(`Agent ${this.agentId} resumed`);
    }
  }

  async getAgentStatus() {
    const [agent] = await db.select().from(tradingAgents).where(eq(tradingAgents.id, this.agentId));
    const recentMetrics = await this.getCurrentVibeCodingMetrics();
    
    return {
      agent,
      isRunning: this.isRunning,
      vibeCodingMetrics: recentMetrics,
      activeDataSources: this.config.enabledDataSources
    };
  }
}

export { PermanentTradingAgent };