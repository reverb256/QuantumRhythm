/**
 * Streamlined Trading Engine - Consolidated AI decision making
 * Replaces multiple redundant AI systems with single efficient engine
 */

import { aiService } from './ai-service.js';
import { tradingMonitor } from './trading-monitor.js';

interface StreamlinedDecision {
  action: 'BUY' | 'SELL' | 'HOLD';
  token: string;
  confidence: number;
  amount: number;
  strategy: string;
  reasoning: string;
}

interface MarketContext {
  balance: number;
  trend: number;
  volatility: number;
  recentPerformance: number;
}

export class StreamlinedTradingEngine {
  private gasReserve = 0.05;
  private minimumTradeSize = 0.001;
  private maxConfidence = 0.95;
  private consecutiveHolds = 0;

  constructor() {
    console.log('🔄 Streamlined Trading Engine initialized');
  }

  async generateDecision(marketContext: MarketContext): Promise<StreamlinedDecision> {
    try {
      // Single AI analysis instead of multiple redundant systems
      const decision = await this.performSingleAIAnalysis(marketContext);
      
      // Validate and fix the decision
      const validatedDecision = this.validateDecision(decision, marketContext);
      
      return validatedDecision;
    } catch (error) {
      console.log('⚠️ AI analysis failed, using conservative fallback');
      return this.generateConservativeFallback(marketContext);
    }
  }

  private async performSingleAIAnalysis(context: MarketContext): Promise<StreamlinedDecision> {
    const prompt = `Analyze this trading scenario and provide a single decision:

Current Balance: ${context.balance.toFixed(6)} SOL
Market Trend: ${(context.trend * 100).toFixed(1)}%
Recent Performance: ${(context.recentPerformance * 100).toFixed(1)}%
Volatility: ${context.volatility.toFixed(2)}

Gas Reserve Required: ${this.gasReserve} SOL
Minimum Trade Size: ${this.minimumTradeSize} SOL

Provide decision as: ACTION|TOKEN|CONFIDENCE|REASONING
Example: BUY|USDC|0.75|Strong bullish momentum detected

Keep confidence between 0.3-0.95. Only suggest trades if amount would be >= ${this.minimumTradeSize} SOL after gas reserves.`;

    const response = await aiService.generate(prompt, {
      maxTokens: 200,
      temperature: 0.3
    });

    return this.parseAIResponse(response, context);
  }

  private parseAIResponse(response: string, context: MarketContext): StreamlinedDecision {
    try {
      const parts = response.split('|');
      if (parts.length >= 4) {
        const action = parts[0].trim() as 'BUY' | 'SELL' | 'HOLD';
        const token = parts[1].trim();
        const confidence = Math.min(parseFloat(parts[2]), this.maxConfidence);
        const reasoning = parts[3].trim();

        // Calculate safe position size
        const amount = this.calculateSafePositionSize(confidence, context.balance);

        return {
          action: amount >= this.minimumTradeSize ? action : 'HOLD',
          token,
          confidence,
          amount,
          strategy: 'streamlined_ai',
          reasoning: amount >= this.minimumTradeSize ? reasoning : 'Amount below minimum threshold'
        };
      }
    } catch (error) {
      console.log('⚠️ Failed to parse AI response, using fallback');
    }

    return this.generateConservativeFallback(context);
  }

  private calculateSafePositionSize(confidence: number, balance: number): number {
    // Single position sizing calculation
    const availableBalance = balance - this.gasReserve;
    
    if (availableBalance <= 0) {
      return 0;
    }

    // Conservative position sizing: 5-15% based on confidence
    const basePercentage = 0.05 + (confidence - 0.3) * 0.15; // 5-15%
    const calculatedAmount = availableBalance * basePercentage;

    // Ensure minimum viable size
    return Math.max(0, calculatedAmount);
  }

  private validateDecision(decision: StreamlinedDecision, context: MarketContext): StreamlinedDecision {
    // Cap confidence at maximum
    if (decision.confidence > this.maxConfidence) {
      console.log(`🧠 Capping confidence ${(decision.confidence * 100).toFixed(1)}% → ${(this.maxConfidence * 100).toFixed(1)}%`);
      decision.confidence = this.maxConfidence;
    }

    // Validate minimum trade size
    if (decision.amount < this.minimumTradeSize && decision.action !== 'HOLD') {
      console.log(`⚠️ Trade amount ${decision.amount.toFixed(6)} below minimum, switching to HOLD`);
      decision.action = 'HOLD';
      decision.amount = 0;
      decision.reasoning = 'Position size below minimum threshold';
    }

    // Prevent excessive consecutive holds
    if (decision.action === 'HOLD') {
      this.consecutiveHolds++;
      if (this.consecutiveHolds > 10 && context.balance > this.gasReserve + this.minimumTradeSize) {
        console.log('🎯 Breaking hold pattern with conservative trade');
        decision.action = 'BUY';
        decision.token = 'USDC';
        decision.confidence = 0.4;
        decision.amount = this.minimumTradeSize;
        decision.reasoning = 'Conservative trade to break hold pattern';
        this.consecutiveHolds = 0;
      }
    } else {
      this.consecutiveHolds = 0;
    }

    return decision;
  }

  private generateConservativeFallback(context: MarketContext): StreamlinedDecision {
    const availableBalance = context.balance - this.gasReserve;
    
    if (availableBalance < this.minimumTradeSize) {
      return {
        action: 'HOLD',
        token: 'SOL',
        confidence: 0,
        amount: 0,
        strategy: 'insufficient_balance',
        reasoning: 'Insufficient balance for safe trading'
      };
    }

    // Conservative 5% allocation
    const amount = availableBalance * 0.05;
    
    return {
      action: 'BUY',
      token: 'USDC',
      confidence: 0.4,
      amount: Math.max(this.minimumTradeSize, amount),
      strategy: 'conservative_fallback',
      reasoning: 'Conservative fallback decision'
    };
  }

  public getStats() {
    return {
      consecutiveHolds: this.consecutiveHolds,
      gasReserve: this.gasReserve,
      minimumTradeSize: this.minimumTradeSize,
      maxConfidence: this.maxConfidence
    };
  }
}

export const streamlinedTradingEngine = new StreamlinedTradingEngine();