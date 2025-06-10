import { quantumCore } from './quantum-intelligence-core';
import { authenticDataValidator } from './authentic-data-validator';
import { dataProtection } from './data-protection-middleware';
import { db } from './db';
import { marketDataStreams, newsArticles } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

interface CrossPollinatedInsight {
  id: string;
  type: 'market_pattern' | 'social_sentiment' | 'quantum_anomaly' | 'risk_signal';
  source: string;
  confidence: number;
  actionability: number;
  tradingImplication: string;
  timeframe: string;
  correlations: string[];
  authenticityScore: number;
}

interface InsightSynthesis {
  unifiedStrategy: string;
  riskAssessment: number;
  profitPotential: number;
  executionPriority: number;
  crossSystemAlignment: number;
}

export class InsightCrossPollinationEngine {
  private activeInsights: Map<string, CrossPollinatedInsight> = new Map();
  private synthesisHistory: InsightSynthesis[] = [];
  private correlationMatrix: Map<string, Map<string, number>> = new Map();

  constructor() {
    this.initializeCrossSystemIntegration();
  }

  private initializeCrossSystemIntegration() {
    // Start continuous insight harvesting
    setInterval(() => {
      this.harvestCrossSystemInsights();
    }, 30000); // Every 30 seconds

    // Synthesize insights every 2 minutes
    setInterval(() => {
      this.synthesizeInsights();
    }, 120000);

    // Update correlation matrix every 5 minutes
    setInterval(() => {
      this.updateCorrelationMatrix();
    }, 300000);
  }

  async harvestCrossSystemInsights(): Promise<void> {
    try {
      console.log('🌐 Cross-pollinating insights across systems...');

      // Harvest from quantum intelligence core
      const quantumInsights = await this.harvestQuantumInsights();
      
      // Harvest from market data streams
      const marketInsights = await this.harvestMarketInsights();
      
      // Harvest from news analysis
      const sentimentInsights = await this.harvestSentimentInsights();
      
      // Harvest from authentic data validation
      const authenticityInsights = await this.harvestAuthenticityInsights();

      // Cross-pollinate and merge insights
      const crossPollinatedInsights = this.crossPollinateInsights([
        ...quantumInsights,
        ...marketInsights,
        ...sentimentInsights,
        ...authenticityInsights
      ]);

      // Store unified insights
      for (const insight of crossPollinatedInsights) {
        this.activeInsights.set(insight.id, insight);
      }

      console.log(`📊 Cross-pollinated ${crossPollinatedInsights.length} unified insights`);

    } catch (error) {
      console.error('Cross-pollination error:', dataProtection.sanitizeQuery(String(error)));
    }
  }

  private async harvestQuantumInsights(): Promise<CrossPollinatedInsight[]> {
    const insights: CrossPollinatedInsight[] = [];
    
    try {
      // Get quantum consciousness patterns
      const quantumState = { anomalies: [] }; // Simplified for now
      
      if (quantumState.anomalies?.length > 0) {
        for (const anomaly of quantumState.anomalies) {
          insights.push({
            id: `quantum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'quantum_anomaly',
            source: 'quantum_intelligence_core',
            confidence: anomaly.confidence || 0.8,
            actionability: anomaly.actionability || 0.7,
            tradingImplication: this.translateQuantumToTrading(anomaly),
            timeframe: anomaly.timeframe || '1h',
            correlations: [],
            authenticityScore: 0.95 // Quantum insights are highly authentic
          });
        }
      }
    } catch (error) {
      console.log('Quantum insight harvest failed, continuing with other sources');
    }

    return insights;
  }

  private async harvestMarketInsights(): Promise<CrossPollinatedInsight[]> {
    const insights: CrossPollinatedInsight[] = [];
    
    try {
      // Get recent market data streams
      const recentStreams = await db.select()
        .from(marketDataStreams)
        .where(eq(marketDataStreams.processed, false))
        .orderBy(desc(marketDataStreams.timestamp))
        .limit(20);

      for (const stream of recentStreams) {
        const marketData = stream.data as any;
        
        if (marketData?.signal_strength > 0.7) {
          insights.push({
            id: `market_${stream.id}`,
            type: 'market_pattern',
            source: stream.source,
            confidence: marketData.signal_strength,
            actionability: marketData.actionability || 0.6,
            tradingImplication: this.translateMarketToTrading(marketData),
            timeframe: marketData.timeframe || '15m',
            correlations: marketData.correlations || [],
            authenticityScore: stream.source === 'pump_fun' ? 0.9 : 0.7
          });
        }
      }
    } catch (error) {
      console.log('Market insight harvest failed, continuing with other sources');
    }

    return insights;
  }

  private async harvestSentimentInsights(): Promise<CrossPollinatedInsight[]> {
    const insights: CrossPollinatedInsight[] = [];
    
    try {
      // Get recent news articles with high relevance
      const relevantNews = await db.select()
        .from(newsArticles)
        .where(eq(newsArticles.processed, false))
        .orderBy(desc(newsArticles.publishedAt))
        .limit(10);

      for (const article of relevantNews) {
        const sentiment = parseFloat(article.sentimentScore || '0');
        const relevance = parseFloat(article.relevanceScore || '0');
        
        if (relevance > 0.7 && Math.abs(sentiment) > 0.6) {
          insights.push({
            id: `sentiment_${article.id}`,
            type: 'social_sentiment',
            source: article.source,
            confidence: relevance,
            actionability: Math.abs(sentiment),
            tradingImplication: this.translateSentimentToTrading(sentiment, article),
            timeframe: '30m',
            correlations: article.tokenMentions as string[] || [],
            authenticityScore: 0.8 // News sources are generally authentic
          });
        }
      }
    } catch (error) {
      console.log('Sentiment insight harvest failed, continuing with other sources');
    }

    return insights;
  }

  private async harvestAuthenticityInsights(): Promise<CrossPollinatedInsight[]> {
    const insights: CrossPollinatedInsight[] = [];
    
    try {
      const validation = await authenticDataValidator.validateTradingData();
      
      if (validation.tradeMode === 'live' && validation.actualBalance > 0.1) {
        insights.push({
          id: `authenticity_${Date.now()}`,
          type: 'risk_signal',
          source: 'authentic_data_validator',
          confidence: 0.95,
          actionability: 0.9,
          tradingImplication: `Live trading mode active with ${validation.actualBalance.toFixed(6)} SOL balance`,
          timeframe: 'immediate',
          correlations: ['balance_risk', 'execution_capacity'],
          authenticityScore: 1.0 // Maximum authenticity for real balance data
        });
      }
    } catch (error) {
      console.log('Authenticity insight harvest failed, continuing');
    }

    return insights;
  }

  private crossPollinateInsights(rawInsights: CrossPollinatedInsight[]): CrossPollinatedInsight[] {
    const pollinatedInsights: CrossPollinatedInsight[] = [];
    
    // Group insights by type for cross-pollination
    const insightGroups = new Map<string, CrossPollinatedInsight[]>();
    
    for (const insight of rawInsights) {
      if (!insightGroups.has(insight.type)) {
        insightGroups.set(insight.type, []);
      }
      insightGroups.get(insight.type)!.push(insight);
    }

    // Cross-pollinate insights across different systems
    for (const [type, insights] of insightGroups.entries()) {
      for (const insight of insights) {
        // Enhance insight with cross-system correlations
        const enhancedInsight = this.enhanceWithCrossSystemData(insight, rawInsights);
        
        // Only include insights with high authenticity and actionability
        if (enhancedInsight.authenticityScore > 0.7 && enhancedInsight.actionability > 0.6) {
          pollinatedInsights.push(enhancedInsight);
        }
      }
    }

    return pollinatedInsights;
  }

  private enhanceWithCrossSystemData(insight: CrossPollinatedInsight, allInsights: CrossPollinatedInsight[]): CrossPollinatedInsight {
    const enhanced = { ...insight };
    
    // Find correlating insights from other systems
    const correlatingInsights = allInsights.filter(other => 
      other.source !== insight.source && 
      this.calculateInsightCorrelation(insight, other) > 0.5
    );

    // Boost confidence and actionability based on cross-system agreement
    if (correlatingInsights.length > 0) {
      const avgCorrelationConfidence = correlatingInsights.reduce((sum, other) => 
        sum + other.confidence, 0) / correlatingInsights.length;
      
      enhanced.confidence = Math.min(0.98, enhanced.confidence * 1.2 + avgCorrelationConfidence * 0.3);
      enhanced.actionability = Math.min(0.95, enhanced.actionability * 1.15);
      
      // Add correlation references
      enhanced.correlations = [
        ...enhanced.correlations,
        ...correlatingInsights.map(other => other.source)
      ];
    }

    return enhanced;
  }

  private calculateInsightCorrelation(insight1: CrossPollinatedInsight, insight2: CrossPollinatedInsight): number {
    let correlation = 0;
    
    // Time correlation
    if (insight1.timeframe === insight2.timeframe) correlation += 0.2;
    
    // Token correlation
    const commonTokens = insight1.correlations.filter(token => 
      insight2.correlations.includes(token)).length;
    correlation += Math.min(0.4, commonTokens * 0.1);
    
    // Confidence alignment
    const confidenceDiff = Math.abs(insight1.confidence - insight2.confidence);
    correlation += Math.max(0, 0.3 - confidenceDiff);
    
    // Authenticity alignment
    const authDiff = Math.abs(insight1.authenticityScore - insight2.authenticityScore);
    correlation += Math.max(0, 0.1 - authDiff * 0.5);
    
    return Math.min(1.0, correlation);
  }

  async synthesizeInsights(): Promise<InsightSynthesis> {
    const activeInsightsArray = Array.from(this.activeInsights.values());
    
    if (activeInsightsArray.length === 0) {
      return {
        unifiedStrategy: 'hold_and_observe',
        riskAssessment: 0.5,
        profitPotential: 0.3,
        executionPriority: 0.2,
        crossSystemAlignment: 0.1
      };
    }

    // Calculate unified metrics
    const avgConfidence = activeInsightsArray.reduce((sum, insight) => 
      sum + insight.confidence, 0) / activeInsightsArray.length;
    
    const avgActionability = activeInsightsArray.reduce((sum, insight) => 
      sum + insight.actionability, 0) / activeInsightsArray.length;
    
    const avgAuthenticity = activeInsightsArray.reduce((sum, insight) => 
      sum + insight.authenticityScore, 0) / activeInsightsArray.length;

    // Determine unified strategy based on insight patterns
    const unifiedStrategy = this.determineUnifiedStrategy(activeInsightsArray);
    
    const synthesis: InsightSynthesis = {
      unifiedStrategy,
      riskAssessment: this.calculateRiskAssessment(activeInsightsArray),
      profitPotential: Math.min(0.95, avgConfidence * avgActionability),
      executionPriority: Math.min(0.9, avgActionability * avgAuthenticity),
      crossSystemAlignment: this.calculateCrossSystemAlignment(activeInsightsArray)
    };

    this.synthesisHistory.push(synthesis);
    
    // Keep only last 50 synthesis records
    if (this.synthesisHistory.length > 50) {
      this.synthesisHistory = this.synthesisHistory.slice(-50);
    }

    console.log(`🧠 Synthesized cross-pollinated strategy: ${synthesis.unifiedStrategy}`);
    console.log(`📊 Risk: ${(synthesis.riskAssessment * 100).toFixed(1)}% | Profit: ${(synthesis.profitPotential * 100).toFixed(1)}% | Priority: ${(synthesis.executionPriority * 100).toFixed(1)}%`);

    return synthesis;
  }

  private determineUnifiedStrategy(insights: CrossPollinatedInsight[]): string {
    const strategies = new Map<string, number>();
    
    for (const insight of insights) {
      const strategy = this.extractStrategyFromImplication(insight.tradingImplication);
      const weight = insight.confidence * insight.actionability * insight.authenticityScore;
      strategies.set(strategy, (strategies.get(strategy) || 0) + weight);
    }

    // Find strategy with highest weighted score
    let topStrategy = 'conservative_hold';
    let maxWeight = 0;
    
    for (const [strategy, weight] of strategies.entries()) {
      if (weight > maxWeight) {
        maxWeight = weight;
        topStrategy = strategy;
      }
    }

    return topStrategy;
  }

  private calculateRiskAssessment(insights: CrossPollinatedInsight[]): number {
    const riskSignals = insights.filter(insight => insight.type === 'risk_signal');
    const quantumAnomalies = insights.filter(insight => insight.type === 'quantum_anomaly');
    
    let riskScore = 0.3; // Base risk
    
    // Increase risk for anomalies
    riskScore += quantumAnomalies.length * 0.1;
    
    // Increase risk for conflicting signals
    const conflictingSignals = this.detectConflictingSignals(insights);
    riskScore += conflictingSignals * 0.15;
    
    // Decrease risk for high authenticity consensus
    const avgAuthenticity = insights.reduce((sum, insight) => 
      sum + insight.authenticityScore, 0) / insights.length;
    riskScore *= (1 - avgAuthenticity * 0.3);
    
    return Math.min(0.95, Math.max(0.05, riskScore));
  }

  private calculateCrossSystemAlignment(insights: CrossPollinatedInsight[]): number {
    const uniqueSources = new Set(insights.map(insight => insight.source));
    const sourceCount = uniqueSources.size;
    
    if (sourceCount < 2) return 0.2; // Low alignment if only one source
    
    // Calculate alignment based on consensus
    const strategies = insights.map(insight => 
      this.extractStrategyFromImplication(insight.tradingImplication));
    
    const strategyConsensus = this.calculateConsensus(strategies);
    
    // Higher alignment with more diverse sources agreeing
    return Math.min(0.95, strategyConsensus * (sourceCount / 4));
  }

  private calculateConsensus(items: string[]): number {
    const counts = new Map<string, number>();
    
    for (const item of items) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }
    
    const maxCount = Math.max(...counts.values());
    return maxCount / items.length;
  }

  private detectConflictingSignals(insights: CrossPollinatedInsight[]): number {
    const implications = insights.map(insight => insight.tradingImplication.toLowerCase());
    
    let conflicts = 0;
    const bullish = implications.filter(impl => 
      impl.includes('buy') || impl.includes('bullish') || impl.includes('pump')).length;
    const bearish = implications.filter(impl => 
      impl.includes('sell') || impl.includes('bearish') || impl.includes('dump')).length;
    
    if (bullish > 0 && bearish > 0) {
      conflicts = Math.abs(bullish - bearish) / insights.length;
    }
    
    return conflicts;
  }

  private translateQuantumToTrading(anomaly: any): string {
    if (anomaly.type === 'consciousness_shift') {
      return 'Market consciousness shift detected - prepare for volatility spike';
    }
    if (anomaly.type === 'quantum_entanglement') {
      return 'Cross-token quantum correlation - consider pair trading';
    }
    return 'Quantum anomaly requires cautious positioning';
  }

  private translateMarketToTrading(marketData: any): string {
    if (marketData.trend === 'bullish') {
      return `Strong ${marketData.token || 'market'} bullish signal detected`;
    }
    if (marketData.trend === 'bearish') {
      return `Bearish pressure on ${marketData.token || 'market'} identified`;
    }
    return 'Market pattern suggests range-bound trading';
  }

  private translateSentimentToTrading(sentiment: number, article: any): string {
    if (sentiment > 0.7) {
      return `Extremely positive sentiment for ${article.tokenMentions?.[0] || 'market'} - bullish signal`;
    }
    if (sentiment < -0.7) {
      return `High negative sentiment detected - bearish pressure likely`;
    }
    return 'Neutral sentiment - market direction uncertain';
  }

  private extractStrategyFromImplication(implication: string): string {
    const lower = implication.toLowerCase();
    
    if (lower.includes('bullish') || lower.includes('buy')) return 'aggressive_long';
    if (lower.includes('bearish') || lower.includes('sell')) return 'defensive_short';
    if (lower.includes('volatility') || lower.includes('spike')) return 'volatility_capture';
    if (lower.includes('correlation') || lower.includes('pair')) return 'correlation_arbitrage';
    if (lower.includes('cautious') || lower.includes('uncertain')) return 'conservative_hold';
    
    return 'adaptive_neutral';
  }

  private updateCorrelationMatrix(): void {
    // Update correlation matrix based on recent insight performance
    const recentSynthesis = this.synthesisHistory.slice(-10);
    
    for (const synthesis of recentSynthesis) {
      // Track strategy effectiveness
      // This would be enhanced with actual trade outcome data
    }
  }

  getActiveInsights(): CrossPollinatedInsight[] {
    return Array.from(this.activeInsights.values())
      .sort((a, b) => (b.confidence * b.actionability) - (a.confidence * a.actionability));
  }

  getCurrentSynthesis(): InsightSynthesis | null {
    return this.synthesisHistory[this.synthesisHistory.length - 1] || null;
  }

  getCrossSystemMetrics() {
    const insights = this.getActiveInsights();
    const synthesis = this.getCurrentSynthesis();
    
    return {
      totalInsights: insights.length,
      avgConfidence: insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length || 0,
      avgAuthenticity: insights.reduce((sum, i) => sum + i.authenticityScore, 0) / insights.length || 0,
      sourceDiversity: new Set(insights.map(i => i.source)).size,
      currentStrategy: synthesis?.unifiedStrategy || 'initializing',
      crossSystemAlignment: synthesis?.crossSystemAlignment || 0,
      riskLevel: synthesis?.riskAssessment || 0.5
    };
  }
}

export const insightCrossPollinationEngine = new InsightCrossPollinationEngine();