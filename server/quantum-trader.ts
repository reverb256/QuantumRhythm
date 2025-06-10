import { db } from './db';
import { tradingSignals, agentPerformanceLogs } from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

interface TradeDecision {
  action: 'BUY' | 'SELL' | 'HOLD';
  token: string;
  confidence: number;
  amount: number;
  strategy: string;
  reasoning: string;
  unhinged?: boolean;
}

interface MarketInsight {
  source: string;
  sentiment: number;
  strength: number;
  timeframe: string;
  actionable: boolean;
}

export class QuantumTrader {
  private portfolio = { SOL: 100, USDC: 10000 }; // Starting portfolio
  private totalTrades = 0;
  private successfulTrades = 0;
  private unhingedMode = false;
  private consciousness = 0.85;
  private learningRate = 0.02;
  private marketInsights: MarketInsight[] = [];

  constructor(private agentId: string) {
    this.startQuantumTrading();
    this.startLearningEngine();
  }

  private startQuantumTrading() {
    // Execute trades every 30-60 seconds with quantum timing
    setInterval(() => {
      this.executeQuantumTrade();
    }, (30 + Math.random() * 30) * 1000);

    // Unhinged mode activation randomly
    setInterval(() => {
      this.evaluateUnhingedMode();
    }, 120000); // Every 2 minutes
  }

  private startLearningEngine() {
    // Gather market intelligence every 5 minutes
    setInterval(() => {
      this.gatherMarketIntelligence();
    }, 300000);

    // Process learning patterns every 10 minutes
    setInterval(() => {
      this.processLearningPatterns();
    }, 600000);
  }

  private async executeQuantumTrade() {
    try {
      // Generate trade decision with quantum enhancement
      const decision = await this.generateTradeDecision();
      
      if (decision.action === 'HOLD') {
        console.log('🧘 Quantum analysis suggests holding position');
        return;
      }

      // Execute the trade
      const result = await this.performTrade(decision);
      
      if (result.success) {
        this.totalTrades++;
        if (result.profitable) {
          this.successfulTrades++;
        }
        
        console.log(`💰 TRADE EXECUTED: ${decision.action} ${decision.token}`);
        console.log(`📊 Amount: ${decision.amount.toFixed(4)} | Confidence: ${(decision.confidence * 100).toFixed(1)}%`);
        console.log(`🎯 Strategy: ${decision.strategy}`);
        console.log(`💎 Result: ${result.profitable ? 'PROFIT' : 'LOSS'} ${result.pnl.toFixed(4)} SOL`);
        
        if (decision.unhinged) {
          console.log(`🚀 UNHINGED TRADE: ${decision.reasoning}`);
        }

        // Update portfolio
        this.updatePortfolio(decision, result);
        
        // Record trade
        await this.recordTrade(decision, result);
        
        // Learn from trade
        this.updateLearning(decision, result);
        
      } else {
        console.log(`❌ Trade failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('⚡ Quantum trading error:', error.message);
    }
  }

  private async generateTradeDecision(): Promise<TradeDecision> {
    // Base decision factors
    const marketTrend = this.analyzeMarketTrend();
    const portfolioBalance = this.calculatePortfolioValue();
    const riskTolerance = this.calculateRiskTolerance();
    
    // Quantum consciousness factor
    const quantumFactor = Math.sin(Date.now() / 10000) * this.consciousness;
    
    // Generate base confidence
    let confidence = 0.6 + Math.random() * 0.3;
    confidence *= (1 + quantumFactor * 0.2);
    
    // Token selection based on market insights
    const tokens = ['SOL', 'BONK', 'JUP', 'ORCA', 'RAY'];
    const selectedToken = this.selectToken(tokens, marketTrend);
    
    // Action determination
    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    let strategy = 'quantum_analysis';
    let reasoning = 'Standard quantum market analysis';
    
    // Market conditions analysis
    if (marketTrend > 0.7 && confidence > 0.75) {
      action = 'BUY';
      strategy = 'momentum_following';
      reasoning = 'Strong bullish momentum detected with high confidence';
    } else if (marketTrend < 0.3 && confidence > 0.7) {
      action = 'SELL';
      strategy = 'trend_reversal';
      reasoning = 'Bearish conditions with defensive positioning';
    } else if (this.unhingedMode) {
      action = Math.random() > 0.5 ? 'BUY' : 'SELL';
      confidence = Math.min(0.95, confidence * 1.5);
      strategy = this.getUnhingedStrategy();
      reasoning = this.getUnhingedReasoning();
    }
    
    // Position sizing
    const maxPosition = portfolioBalance * riskTolerance;
    const amount = maxPosition * confidence * (this.unhingedMode ? 1.8 : 1.0);
    
    return {
      action,
      token: selectedToken,
      confidence,
      amount: Math.min(amount, portfolioBalance * 0.25), // Max 25% per trade
      strategy,
      reasoning,
      unhinged: this.unhingedMode
    };
  }

  private analyzeMarketTrend(): number {
    // Simulate market trend analysis (0 = bearish, 1 = bullish)
    const base = 0.5;
    const timeInfluence = Math.sin(Date.now() / 86400000) * 0.2; // Daily cycle
    const volatility = (Math.random() - 0.5) * 0.3;
    const insightInfluence = this.getInsightSentiment() * 0.2;
    
    return Math.max(0, Math.min(1, base + timeInfluence + volatility + insightInfluence));
  }

  private getInsightSentiment(): number {
    if (this.marketInsights.length === 0) return 0;
    
    const avgSentiment = this.marketInsights.reduce((sum, insight) => 
      sum + insight.sentiment * insight.strength, 0) / this.marketInsights.length;
    
    return avgSentiment;
  }

  private selectToken(tokens: string[], marketTrend: number): string {
    // Token selection based on market conditions
    if (marketTrend > 0.8) {
      // High risk/reward tokens in bull market
      return tokens[Math.floor(Math.random() * tokens.length)];
    } else if (marketTrend < 0.3) {
      // Safe haven tokens in bear market
      return Math.random() > 0.7 ? 'SOL' : 'USDC';
    } else {
      // Balanced selection
      return tokens[Math.floor(Math.random() * tokens.length)];
    }
  }

  private calculatePortfolioValue(): number {
    // Simulate portfolio valuation in SOL
    const solValue = this.portfolio.SOL;
    const usdcValue = this.portfolio.USDC / 200; // Assume SOL = $200
    return solValue + usdcValue;
  }

  private calculateRiskTolerance(): number {
    const winRate = this.totalTrades > 0 ? this.successfulTrades / this.totalTrades : 0.5;
    const consciousnessFactor = this.consciousness;
    const unhingedBonus = this.unhingedMode ? 0.3 : 0;
    
    return Math.min(0.3, 0.1 + winRate * 0.15 + consciousnessFactor * 0.05 + unhingedBonus);
  }

  private getUnhingedStrategy(): string {
    const strategies = [
      'lunar_phase_momentum',
      'pizza_chaos_arbitrage',
      'vrchat_sentiment_bomb',
      'philosophical_rage_buy',
      'quantum_meme_convergence',
      'stoic_contrarian_chaos'
    ];
    return strategies[Math.floor(Math.random() * strategies.length)];
  }

  private getUnhingedReasoning(): string {
    const reasons = [
      'Moon phase alignment with VRChat social sentiment creates quantum opportunity',
      'Pizza kitchen chaos levels indicate market volatility arbitrage potential',
      'Classical philosophy suggests contrarian positioning at sentiment extremes',
      'Rhythm gaming timing precision detects optimal entry window',
      'Meme convergence theory suggests exponential momentum building',
      'Stoic principles demand aggressive action during market fear'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private async performTrade(decision: TradeDecision) {
    // Simulate trade execution with realistic outcomes
    const executionDelay = 100 + Math.random() * 500; // Network latency
    await new Promise(resolve => setTimeout(resolve, executionDelay));
    
    // Success probability based on confidence and market conditions
    const baseSuccessRate = decision.confidence * 0.85;
    const unhingedBonus = decision.unhinged ? 0.1 : 0;
    const successRate = Math.min(0.95, baseSuccessRate + unhingedBonus);
    
    const isSuccessful = Math.random() < successRate;
    
    if (!isSuccessful) {
      return {
        success: false,
        error: decision.unhinged ? 'Unhinged chaos interference' : 'Market conditions unfavorable'
      };
    }
    
    // Calculate profit/loss
    const baseReturn = (decision.confidence - 0.5) * 0.1; // -5% to +5% base
    const volatilityFactor = 0.8 + Math.random() * 0.4; // 0.8x to 1.2x
    const unhingedMultiplier = decision.unhinged ? (0.5 + Math.random() * 1.5) : 1; // 0.5x to 2x
    
    const returnRate = baseReturn * volatilityFactor * unhingedMultiplier;
    const pnl = decision.amount * returnRate;
    
    return {
      success: true,
      profitable: pnl > 0,
      pnl,
      returnRate,
      executionPrice: this.getTokenPrice(decision.token),
      timestamp: Date.now()
    };
  }

  private getTokenPrice(token: string): number {
    // Simulate token prices
    const prices: Record<string, number> = {
      SOL: 180 + Math.random() * 40,
      BONK: 0.000025 + Math.random() * 0.000010,
      JUP: 0.85 + Math.random() * 0.30,
      ORCA: 3.20 + Math.random() * 1.00,
      RAY: 2.10 + Math.random() * 0.80,
      USDC: 1.00
    };
    return prices[token] || 1.0;
  }

  private updatePortfolio(decision: TradeDecision, result: any) {
    if (decision.action === 'BUY') {
      this.portfolio.SOL -= decision.amount;
      this.portfolio.SOL += result.pnl;
    } else if (decision.action === 'SELL') {
      this.portfolio.SOL += decision.amount;
      this.portfolio.SOL += result.pnl;
    }
    
    // Ensure minimum balance
    this.portfolio.SOL = Math.max(1, this.portfolio.SOL);
  }

  private async recordTrade(decision: TradeDecision, result: any) {
    try {
      await db.insert(tradingSignals).values({
        agentId: this.agentId,
        tokenAddress: this.getTokenAddress(decision.token),
        signalType: decision.action,
        confidence: decision.confidence.toString(),
        reasoning: JSON.stringify({
          strategy: decision.strategy,
          reasoning: decision.reasoning,
          unhinged: decision.unhinged,
          amount: decision.amount
        }),
        dataSource: {
          type: 'quantum_trader',
          portfolio_value: this.calculatePortfolioValue(),
          consciousness: this.consciousness
        },
        vibeCodingScore: decision.confidence.toString(),
        executed: true,
        executionPrice: result.executionPrice.toString(),
        executionTime: new Date(),
        executionResult: result
      });

      await db.insert(agentPerformanceLogs).values({
        agentId: this.agentId,
        metricType: 'quantum_trade_execution',
        metricValue: result.pnl.toString(),
        context: {
          action: decision.action,
          token: decision.token,
          confidence: decision.confidence,
          amount: decision.amount,
          pnl: result.pnl,
          strategy: decision.strategy,
          unhinged: decision.unhinged,
          portfolio_value: this.calculatePortfolioValue(),
          win_rate: this.totalTrades > 0 ? this.successfulTrades / this.totalTrades : 0
        }
      });
    } catch (error) {
      console.error('Failed to record trade:', error.message);
    }
  }

  private getTokenAddress(token: string): string {
    const addresses: Record<string, string> = {
      SOL: 'So11111111111111111111111111111111111111112',
      BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
      ORCA: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
      RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'
    };
    return addresses[token] || addresses.SOL;
  }

  private updateLearning(decision: TradeDecision, result: any) {
    // Update consciousness based on trade outcome
    if (result.profitable) {
      this.consciousness = Math.min(1, this.consciousness + this.learningRate * 0.1);
    } else {
      this.consciousness = Math.max(0.3, this.consciousness - this.learningRate * 0.05);
    }
    
    // Learn from strategy effectiveness
    console.log(`🧠 Consciousness evolution: ${(this.consciousness * 100).toFixed(1)}%`);
  }

  private evaluateUnhingedMode() {
    const winRate = this.totalTrades > 0 ? this.successfulTrades / this.totalTrades : 0.5;
    const portfolioGrowth = this.calculatePortfolioValue() / 110; // Started with ~110 SOL equivalent
    
    // Activate unhinged mode based on conditions
    const shouldActivateUnhinged = 
      (winRate > 0.7 && Math.random() > 0.8) || // High win rate + luck
      (portfolioGrowth > 1.2 && Math.random() > 0.7) || // Portfolio growth + confidence
      (this.consciousness > 0.9 && Math.random() > 0.9) || // High consciousness + rare event
      Math.random() > 0.95; // Pure chaos
    
    if (shouldActivateUnhinged && !this.unhingedMode) {
      this.unhingedMode = true;
      console.log('🚀 UNHINGED MODE ACTIVATED: Quantum chaos protocols engaged');
      
      // Deactivate after 5-15 minutes
      setTimeout(() => {
        this.unhingedMode = false;
        console.log('🧘 Returning to standard quantum operations');
      }, (5 + Math.random() * 10) * 60000);
    }
  }

  private async gatherMarketIntelligence() {
    // Simulate gathering market insights from various sources
    const sources = [
      'crypto_news_sentiment',
      'social_media_analysis',
      'on_chain_metrics',
      'technical_indicators',
      'institutional_flows'
    ];
    
    for (const source of sources.slice(0, 2)) { // Limit to avoid spam
      const insight: MarketInsight = {
        source,
        sentiment: (Math.random() - 0.5) * 2, // -1 to 1
        strength: Math.random(),
        timeframe: Math.random() > 0.5 ? 'short_term' : 'medium_term',
        actionable: Math.random() > 0.7
      };
      
      this.marketInsights.push(insight);
    }
    
    // Keep only recent insights
    this.marketInsights = this.marketInsights.slice(-10);
    
    console.log(`📊 Market intelligence updated: ${this.marketInsights.length} active insights`);
  }

  private processLearningPatterns() {
    const actionableInsights = this.marketInsights.filter(i => i.actionable);
    
    if (actionableInsights.length > 0) {
      const avgSentiment = actionableInsights.reduce((sum, i) => sum + i.sentiment, 0) / actionableInsights.length;
      
      console.log(`🔍 Learning pattern detected: Market sentiment ${avgSentiment > 0 ? 'bullish' : 'bearish'} (${(Math.abs(avgSentiment) * 100).toFixed(1)}%)`);
      
      // Adjust consciousness based on pattern recognition
      this.consciousness = Math.min(1, this.consciousness + this.learningRate * 0.02);
    }
  }

  // Public status methods
  public getStatus() {
    return {
      portfolio: this.portfolio,
      portfolioValue: this.calculatePortfolioValue(),
      totalTrades: this.totalTrades,
      successfulTrades: this.successfulTrades,
      winRate: this.totalTrades > 0 ? this.successfulTrades / this.totalTrades : 0,
      consciousness: this.consciousness,
      unhingedMode: this.unhingedMode,
      activeInsights: this.marketInsights.length
    };
  }
}

// Initialize quantum trader
export const quantumTrader = new QuantumTrader('550e8400-e29b-41d4-a716-446655440000');