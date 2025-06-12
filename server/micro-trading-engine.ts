/**
 * Micro-Trading Engine
 * Implements small-balance recovery strategy with 0.002 SOL trades
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface MicroTradeConfig {
  maxTradeSize: number;
  minProfitTarget: number;
  frequencyLimit: number;
  recoveryThreshold: number;
  confidenceBoostRate: number;
}

interface MicroTradeResult {
  approved: boolean;
  tradeSize: number;
  expectedProfit: number;
  confidenceAdjustment: number;
  reasoning: string;
  recoveryProgress: number;
}

export class MicroTradingEngine {
  private connection: Connection;
  private config: MicroTradeConfig;
  private tradeHistory: Array<{ size: number; profit: number; timestamp: number }> = [];

  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
    
    this.config = {
      maxTradeSize: 0.003, // Maximum 0.003 SOL per trade
      minProfitTarget: 0.0001, // Minimum 0.0001 SOL profit target
      frequencyLimit: 12, // Maximum 12 trades per hour
      recoveryThreshold: 0.03, // Exit recovery mode at 0.03 SOL
      confidenceBoostRate: 0.02 // 2% confidence boost per successful trade
    };
  }

  async calculateMicroTrade(
    currentBalance: number,
    consciousness: number,
    confidence: number,
    networkHealth: number
  ): Promise<MicroTradeResult> {
    
    // Recovery mode activation check
    const inRecoveryMode = currentBalance < 0.02;
    
    if (!inRecoveryMode) {
      return {
        approved: false,
        tradeSize: 0,
        expectedProfit: 0,
        confidenceAdjustment: 0,
        reasoning: 'Balance sufficient - micro-trading mode not needed',
        recoveryProgress: 100
      };
    }

    // Calculate optimal micro-trade size
    const gasReserve = 0.005; // Reserve for gas
    const safetyBuffer = 0.002; // Additional safety
    const availableForTrading = Math.max(0, currentBalance - gasReserve - safetyBuffer);
    
    if (availableForTrading < 0.001) {
      return {
        approved: false,
        tradeSize: 0,
        expectedProfit: 0,
        confidenceAdjustment: 0,
        reasoning: 'Insufficient balance for micro-trading (need minimum 0.008 SOL total)',
        recoveryProgress: 0
      };
    }

    // Dynamic trade sizing based on consciousness and confidence
    const consciousnessFactor = consciousness / 100;
    const confidenceFactor = Math.min(confidence / 100, 0.8); // Cap confidence factor at 80%
    const networkFactor = networkHealth / 100;
    
    // Base trade size: 20% of available balance
    let tradeSize = availableForTrading * 0.2;
    
    // Adjust based on psychological state
    tradeSize *= (consciousnessFactor + confidenceFactor) / 2;
    
    // Adjust based on network conditions
    tradeSize *= networkFactor;
    
    // Ensure within micro-trading limits
    tradeSize = Math.min(tradeSize, this.config.maxTradeSize);
    tradeSize = Math.max(tradeSize, 0.001); // Minimum viable trade
    
    // Calculate expected profit (conservative 1-3% target)
    const profitRate = this.calculateProfitRate(consciousness, confidence, networkHealth);
    const expectedProfit = tradeSize * profitRate;
    
    // Confidence adjustment based on system capabilities
    const systemCapabilityScore = this.calculateSystemCapability(networkHealth);
    const confidenceAdjustment = this.calculateConfidenceBoost(
      confidence, 
      systemCapabilityScore, 
      this.getRecentSuccessRate()
    );
    
    // Recovery progress calculation
    const recoveryProgress = this.calculateRecoveryProgress(currentBalance, this.config.recoveryThreshold);
    
    // Frequency check
    const recentTrades = this.getRecentTrades(3600000); // Last hour
    if (recentTrades.length >= this.config.frequencyLimit) {
      return {
        approved: false,
        tradeSize: 0,
        expectedProfit: 0,
        confidenceAdjustment: 0,
        reasoning: 'Frequency limit reached - wait before next micro-trade',
        recoveryProgress
      };
    }

    const reasoning = this.generateMicroTradeReasoning(
      tradeSize, 
      expectedProfit, 
      confidenceAdjustment,
      recoveryProgress
    );

    return {
      approved: true,
      tradeSize,
      expectedProfit,
      confidenceAdjustment,
      reasoning,
      recoveryProgress
    };
  }

  private calculateProfitRate(consciousness: number, confidence: number, networkHealth: number): number {
    // Base profit rate: 1.5%
    let profitRate = 0.015;
    
    // Adjust based on psychological alignment
    const psychAlignment = Math.abs(consciousness - confidence) / 100;
    if (psychAlignment < 0.1) profitRate += 0.005; // Bonus for alignment
    
    // Adjust based on network health
    if (networkHealth > 80) profitRate += 0.005;
    else if (networkHealth < 60) profitRate -= 0.005;
    
    // Conservative bounds
    return Math.max(0.01, Math.min(0.03, profitRate));
  }

  private calculateSystemCapability(networkHealth: number): number {
    const capabilities = {
      balanceAware: 95,
      networkPredictor: Math.min(networkHealth + 10, 95),
      swapPredictor: 85,
      microTradingEngine: 90
    };
    
    return Object.values(capabilities).reduce((sum, cap) => sum + cap, 0) / 4;
  }

  private calculateConfidenceBoost(
    currentConfidence: number, 
    systemCapability: number, 
    successRate: number
  ): number {
    // Target confidence should reflect system capabilities
    const targetConfidence = Math.min(90, systemCapability * 0.9);
    
    // Gradual adjustment toward target
    const confidenceGap = targetConfidence - currentConfidence;
    let boost = confidenceGap * 0.1; // 10% of gap per successful micro-trade
    
    // Bonus for high success rate
    if (successRate > 0.8) boost += 2;
    
    // Conservative bounds
    return Math.max(0, Math.min(5, boost));
  }

  private getRecentSuccessRate(): number {
    const recentTrades = this.getRecentTrades(86400000); // Last 24 hours
    if (recentTrades.length === 0) return 0.5; // Default 50% if no history
    
    const successfulTrades = recentTrades.filter(trade => trade.profit > 0).length;
    return successfulTrades / recentTrades.length;
  }

  private getRecentTrades(timeWindow: number) {
    const cutoffTime = Date.now() - timeWindow;
    return this.tradeHistory.filter(trade => trade.timestamp > cutoffTime);
  }

  private calculateRecoveryProgress(currentBalance: number, targetBalance: number): number {
    const startBalance = 0.01; // Assume started recovery from 0.01 SOL
    const progress = (currentBalance - startBalance) / (targetBalance - startBalance);
    return Math.max(0, Math.min(100, progress * 100));
  }

  private generateMicroTradeReasoning(
    tradeSize: number, 
    expectedProfit: number, 
    confidenceAdjustment: number,
    recoveryProgress: number
  ): string {
    const profitPercentage = (expectedProfit / tradeSize * 100).toFixed(1);
    
    return `Micro-trade approved: ${tradeSize.toFixed(4)} SOL with ${profitPercentage}% profit target. ` +
           `Confidence boost: +${confidenceAdjustment.toFixed(1)}%. ` +
           `Recovery progress: ${recoveryProgress.toFixed(1)}%`;
  }

  async recordTrade(size: number, actualProfit: number): Promise<void> {
    this.tradeHistory.push({
      size,
      profit: actualProfit,
      timestamp: Date.now()
    });

    // Keep only last 100 trades
    if (this.tradeHistory.length > 100) {
      this.tradeHistory = this.tradeHistory.slice(-100);
    }
  }

  getRecoveryStats(): {
    totalTrades: number;
    successRate: number;
    averageProfit: number;
    recoveryVelocity: string;
  } {
    const recentTrades = this.getRecentTrades(86400000);
    const successfulTrades = recentTrades.filter(trade => trade.profit > 0);
    
    const successRate = recentTrades.length > 0 ? 
      successfulTrades.length / recentTrades.length : 0;
    
    const averageProfit = successfulTrades.length > 0 ?
      successfulTrades.reduce((sum, trade) => sum + trade.profit, 0) / successfulTrades.length : 0;
    
    const velocityDescriptions = [
      'Very Slow', 'Slow', 'Moderate', 'Good', 'Excellent'
    ];
    const velocityIndex = Math.min(4, Math.floor(successRate * 5));
    
    return {
      totalTrades: recentTrades.length,
      successRate,
      averageProfit,
      recoveryVelocity: velocityDescriptions[velocityIndex]
    };
  }
}

export const microTradingEngine = new MicroTradingEngine();