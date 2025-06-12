/**
 * Behavioral Learning Module for AI Trader
 * Learns from successful and failed trading patterns to improve decision quality
 */

interface TradePattern {
  id: string;
  timestamp: string;
  marketConditions: {
    volatility: number;
    trend: 'up' | 'down' | 'sideways';
    liquidity: number;
    sentiment: number;
  };
  tradeDetails: {
    action: 'buy' | 'sell' | 'hold';
    amount: number;
    price: number;
    confidence: number;
    reasoning: string;
  };
  outcome: {
    success: boolean;
    pnl: number;
    actualPrice: number;
    executionTime: number;
  };
  lessons: string[];
}

interface BehavioralInsight {
  pattern: string;
  frequency: number;
  successRate: number;
  averagePnL: number;
  conditions: any;
  recommendation: 'adopt' | 'avoid' | 'modify';
  confidence: number;
}

export class BehavioralLearningModule {
  private tradeHistory: TradePattern[] = [];
  private behavioralInsights: BehavioralInsight[] = [];
  private learningEnabled = true;
  private maxHistorySize = 1000;

  constructor() {
    console.log('🧠 Behavioral Learning Module initialized');
    this.initializeLearningPatterns();
  }

  private initializeLearningPatterns(): void {
    // Initialize with some common trading patterns to watch for
    this.behavioralInsights = [
      {
        pattern: 'high_confidence_volatile_market',
        frequency: 0,
        successRate: 0,
        averagePnL: 0,
        conditions: { volatility: '>0.8', confidence: '>0.9' },
        recommendation: 'modify',
        confidence: 0.5
      },
      {
        pattern: 'fear_based_selling',
        frequency: 0,
        successRate: 0,
        averagePnL: 0,
        conditions: { trend: 'down', sentiment: '<0.3', action: 'sell' },
        recommendation: 'avoid',
        confidence: 0.6
      },
      {
        pattern: 'fomo_buying',
        frequency: 0,
        successRate: 0,
        averagePnL: 0,
        conditions: { trend: 'up', sentiment: '>0.8', action: 'buy' },
        recommendation: 'modify',
        confidence: 0.7
      }
    ];
  }

  async recordTrade(tradeData: any): Promise<void> {
    if (!this.learningEnabled) return;

    const pattern: TradePattern = {
      id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      marketConditions: {
        volatility: tradeData.volatility || 0.5,
        trend: tradeData.trend || 'sideways',
        liquidity: tradeData.liquidity || 0.7,
        sentiment: tradeData.sentiment || 0.5
      },
      tradeDetails: {
        action: tradeData.action,
        amount: tradeData.amount,
        price: tradeData.price,
        confidence: tradeData.confidence || 0.6,
        reasoning: tradeData.reasoning || 'Standard trade execution'
      },
      outcome: {
        success: tradeData.success || false,
        pnl: tradeData.pnl || 0,
        actualPrice: tradeData.actualPrice || tradeData.price,
        executionTime: tradeData.executionTime || 100
      },
      lessons: []
    };

    // Extract lessons from this trade
    pattern.lessons = this.extractLessons(pattern);

    this.tradeHistory.push(pattern);
    
    // Maintain history size limit
    if (this.tradeHistory.length > this.maxHistorySize) {
      this.tradeHistory = this.tradeHistory.slice(-this.maxHistorySize);
    }

    // Update behavioral insights
    await this.updateBehavioralInsights(pattern);
    
    console.log(`📚 Recorded trade pattern: ${pattern.id}, lessons: ${pattern.lessons.length}`);
  }

  private extractLessons(pattern: TradePattern): string[] {
    const lessons: string[] = [];

    // High confidence in volatile markets
    if (pattern.marketConditions.volatility > 0.8 && pattern.tradeDetails.confidence > 0.9) {
      if (!pattern.outcome.success) {
        lessons.push('Overconfidence in volatile markets leads to poor outcomes');
      } else if (pattern.outcome.pnl < 0.01) {
        lessons.push('High confidence trades in volatile markets need larger profit margins');
      }
    }

    // Fear-based decisions
    if (pattern.marketConditions.sentiment < 0.3 && pattern.tradeDetails.action === 'sell') {
      if (pattern.outcome.pnl < 0) {
        lessons.push('Fear-based selling often leads to premature exits');
      }
    }

    // FOMO patterns
    if (pattern.marketConditions.sentiment > 0.8 && pattern.tradeDetails.action === 'buy') {
      if (pattern.outcome.pnl < 0) {
        lessons.push('FOMO buying during high sentiment periods is risky');
      }
    }

    // Gas fee inefficiencies
    if (pattern.outcome.executionTime > 300) {
      lessons.push('Long execution times reduce profitability - optimize gas strategy');
    }

    // Low liquidity issues
    if (pattern.marketConditions.liquidity < 0.3 && pattern.outcome.pnl < 0) {
      lessons.push('Avoid trading in low liquidity conditions');
    }

    return lessons;
  }

  private async updateBehavioralInsights(newPattern: TradePattern): Promise<void> {
    // Update existing insights based on new pattern
    for (const insight of this.behavioralInsights) {
      if (this.patternMatches(newPattern, insight.conditions)) {
        insight.frequency++;
        
        // Update success rate
        const successCount = insight.successRate * (insight.frequency - 1);
        const newSuccessCount = successCount + (newPattern.outcome.success ? 1 : 0);
        insight.successRate = newSuccessCount / insight.frequency;
        
        // Update average P&L
        const totalPnL = insight.averagePnL * (insight.frequency - 1);
        insight.averagePnL = (totalPnL + newPattern.outcome.pnl) / insight.frequency;
        
        // Update recommendation based on performance
        this.updateRecommendation(insight);
      }
    }

    // Look for new patterns
    await this.discoverNewPatterns();
  }

  private patternMatches(pattern: TradePattern, conditions: any): boolean {
    for (const [key, condition] of Object.entries(conditions)) {
      const value = this.getNestedValue(pattern, key);
      
      if (typeof condition === 'string') {
        if (condition.startsWith('>')) {
          const threshold = parseFloat(condition.substring(1));
          if (value <= threshold) return false;
        } else if (condition.startsWith('<')) {
          const threshold = parseFloat(condition.substring(1));
          if (value >= threshold) return false;
        } else if (value !== condition) {
          return false;
        }
      } else if (value !== condition) {
        return false;
      }
    }
    return true;
  }

  private getNestedValue(obj: any, path: string): any {
    const parts = path.split('.');
    let value = obj;
    for (const part of parts) {
      value = value?.[part];
    }
    return value;
  }

  private updateRecommendation(insight: BehavioralInsight): void {
    if (insight.successRate > 0.8 && insight.averagePnL > 0.01) {
      insight.recommendation = 'adopt';
      insight.confidence = Math.min(0.95, insight.confidence + 0.1);
    } else if (insight.successRate < 0.4 || insight.averagePnL < -0.005) {
      insight.recommendation = 'avoid';
      insight.confidence = Math.min(0.95, insight.confidence + 0.1);
    } else {
      insight.recommendation = 'modify';
      insight.confidence = Math.max(0.3, insight.confidence - 0.05);
    }
  }

  private async discoverNewPatterns(): Promise<void> {
    // Analyze recent trade history for new behavioral patterns
    const recentTrades = this.tradeHistory.slice(-50);
    const patternCandidates = this.identifyPatternCandidates(recentTrades);

    for (const candidate of patternCandidates) {
      if (!this.behavioralInsights.some(insight => insight.pattern === candidate.pattern)) {
        this.behavioralInsights.push(candidate);
        console.log(`🔍 Discovered new behavioral pattern: ${candidate.pattern}`);
      }
    }
  }

  private identifyPatternCandidates(trades: TradePattern[]): BehavioralInsight[] {
    const candidates: BehavioralInsight[] = [];

    // Look for patterns in failed trades
    const failedTrades = trades.filter(t => !t.outcome.success);
    
    // Common failure in trending markets
    const trendingFailures = failedTrades.filter(t => 
      t.marketConditions.trend !== 'sideways' && t.tradeDetails.confidence > 0.7
    );
    
    if (trendingFailures.length >= 3) {
      candidates.push({
        pattern: 'overconfident_trending_failure',
        frequency: trendingFailures.length,
        successRate: 0,
        averagePnL: trendingFailures.reduce((sum, t) => sum + t.outcome.pnl, 0) / trendingFailures.length,
        conditions: { trend: '!sideways', confidence: '>0.7' },
        recommendation: 'avoid',
        confidence: 0.6
      });
    }

    return candidates;
  }

  async getBehavioralGuidance(tradeContext: any): Promise<{
    recommendations: string[];
    riskAdjustments: any[];
    confidenceModifier: number;
  }> {
    const recommendations: string[] = [];
    const riskAdjustments: any[] = [];
    let confidenceModifier = 1.0;

    // Check current trade context against learned patterns
    for (const insight of this.behavioralInsights) {
      if (this.patternMatches({ 
        marketConditions: tradeContext.marketConditions,
        tradeDetails: tradeContext.tradeDetails 
      } as TradePattern, insight.conditions)) {
        
        if (insight.recommendation === 'avoid' && insight.confidence > 0.7) {
          recommendations.push(`Avoid: Pattern "${insight.pattern}" shows ${(insight.successRate * 100).toFixed(1)}% success rate`);
          confidenceModifier *= 0.7;
          riskAdjustments.push({ type: 'reduce_position', factor: 0.5 });
        } else if (insight.recommendation === 'adopt' && insight.confidence > 0.8) {
          recommendations.push(`Adopt: Pattern "${insight.pattern}" shows strong performance`);
          confidenceModifier *= 1.2;
        } else if (insight.recommendation === 'modify') {
          recommendations.push(`Modify: Pattern "${insight.pattern}" needs adjustment`);
          confidenceModifier *= 0.9;
          riskAdjustments.push({ type: 'adjust_timing', delay: 30000 });
        }
      }
    }

    return {
      recommendations,
      riskAdjustments,
      confidenceModifier: Math.max(0.3, Math.min(1.5, confidenceModifier))
    };
  }

  getBehavioralSummary(): {
    totalPatterns: number;
    totalTrades: number;
    topLessons: string[];
    performanceImpact: string;
  } {
    const allLessons = this.tradeHistory.flatMap(t => t.lessons);
    const lessonCounts = allLessons.reduce((acc, lesson) => {
      acc[lesson] = (acc[lesson] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topLessons = Object.entries(lessonCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([lesson]) => lesson);

    const recentTrades = this.tradeHistory.slice(-20);
    const recentSuccessRate = recentTrades.length > 0 
      ? recentTrades.filter(t => t.outcome.success).length / recentTrades.length 
      : 0;

    let performanceImpact = 'neutral';
    if (recentSuccessRate > 0.7) {
      performanceImpact = 'positive';
    } else if (recentSuccessRate < 0.4) {
      performanceImpact = 'needs_improvement';
    }

    return {
      totalPatterns: this.behavioralInsights.length,
      totalTrades: this.tradeHistory.length,
      topLessons,
      performanceImpact
    };
  }

  enableLearning(enabled: boolean): void {
    this.learningEnabled = enabled;
    console.log(`🧠 Behavioral learning ${enabled ? 'enabled' : 'disabled'}`);
  }
}

export const behavioralLearning = new BehavioralLearningModule();