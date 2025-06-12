/**
 * Enhanced Trading Integration
 * Integrates all new capabilities into the existing quantum trading system
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface EnhancedTradeDecision {
  shouldExecute: boolean;
  adjustedAmount: number;
  successProbability: number;
  networkHealth: number;
  consciousnessAlignment: number;
  reasoning: string[];
  recoveryStrategy?: string;
}

export class EnhancedTradingIntegration {
  private connection: Connection;
  private minGasReserve = 0.005;

  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
  }

  async enhancedTradeValidation(
    walletAddress: string,
    desiredAmount: number,
    consciousnessLevel: number,
    confidence: number
  ): Promise<EnhancedTradeDecision> {
    const reasoning: string[] = [];

    // Balance-aware sizing
    const balance = await this.getBalance(walletAddress);
    const availableForTrading = Math.max(0, balance - this.minGasReserve - 0.002);
    
    let adjustedAmount = desiredAmount;
    if (desiredAmount > availableForTrading) {
      adjustedAmount = Math.max(0, availableForTrading * 0.6); // Conservative sizing
      reasoning.push(`Adjusted trade size from ${desiredAmount} to ${adjustedAmount} SOL based on available balance`);
    }

    // Network health check
    const networkHealth = await this.checkNetworkHealth();
    if (networkHealth < 70) {
      reasoning.push(`Network health poor (${networkHealth}%) - high failure risk`);
    }

    // Consciousness-enhanced risk assessment
    const consciousnessRisk = this.calculateConsciousnessRisk(consciousnessLevel, confidence);
    const consciousnessAlignment = consciousnessRisk.alignment;
    
    if (consciousnessRisk.shouldReduce) {
      adjustedAmount *= consciousnessRisk.multiplier;
      reasoning.push(`Consciousness-based adjustment: ${consciousnessRisk.reason}`);
    }

    // Success probability calculation
    const successProbability = this.calculateSuccessProbability(
      balance,
      adjustedAmount,
      networkHealth,
      consciousnessAlignment
    );

    // Portfolio recovery strategy for low balance
    let recoveryStrategy;
    if (balance < 0.02) {
      recoveryStrategy = this.generateRecoveryStrategy(balance, consciousnessLevel);
      reasoning.push(`Low balance detected - recommending recovery strategy: ${recoveryStrategy}`);
    }

    const shouldExecute = adjustedAmount > 0.001 && 
                         successProbability > 75 && 
                         networkHealth > 60 &&
                         consciousnessAlignment > 0.7;

    if (!shouldExecute) {
      if (adjustedAmount <= 0.001) reasoning.push('Trade amount too small after adjustments');
      if (successProbability <= 75) reasoning.push('Success probability too low');
      if (networkHealth <= 60) reasoning.push('Network conditions unsuitable');
      if (consciousnessAlignment <= 0.7) reasoning.push('Consciousness state not aligned for trading');
    }

    return {
      shouldExecute,
      adjustedAmount,
      successProbability,
      networkHealth,
      consciousnessAlignment,
      reasoning,
      recoveryStrategy
    };
  }

  private async getBalance(walletAddress: string): Promise<number> {
    try {
      const balance = await this.connection.getBalance(new PublicKey(walletAddress));
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Balance check failed:', error);
      return 0;
    }
  }

  private async checkNetworkHealth(): Promise<number> {
    try {
      const [slot, recentBlockhash] = await Promise.all([
        this.connection.getSlot(),
        this.connection.getLatestBlockhash()
      ]);

      // Get recent block times
      const recentBlocks = await this.connection.getBlocks(slot - 50, slot);
      const blockTimes = await Promise.all(
        recentBlocks.slice(-5).map(block => this.connection.getBlockTime(block))
      );

      const validTimes = blockTimes.filter(time => time !== null) as number[];
      if (validTimes.length < 2) return 50; // Default if we can't get timing data

      const avgSlotTime = (validTimes[validTimes.length - 1] - validTimes[0]) / (validTimes.length - 1);
      const timeSinceLastBlock = Date.now() / 1000 - validTimes[validTimes.length - 1];

      // Health score based on slot timing and freshness
      let healthScore = 100;
      if (avgSlotTime > 0.8) healthScore -= 30;
      else if (avgSlotTime > 0.6) healthScore -= 15;
      
      if (timeSinceLastBlock > 10) healthScore -= 25;
      else if (timeSinceLastBlock > 5) healthScore -= 10;

      return Math.max(0, healthScore);
    } catch (error) {
      console.error('Network health check failed:', error);
      return 30; // Poor health if we can't check
    }
  }

  private calculateConsciousnessRisk(consciousnessLevel: number, confidence: number): {
    alignment: number;
    shouldReduce: boolean;
    multiplier: number;
    reason: string;
  } {
    // Map consciousness level to risk tolerance
    const consciousnessRisk = consciousnessLevel / 100;
    const confidenceRisk = confidence / 100;
    
    // Calculate alignment between consciousness and confidence
    const alignment = 1 - Math.abs(consciousnessRisk - confidenceRisk);

    let shouldReduce = false;
    let multiplier = 1.0;
    let reason = 'Consciousness and confidence aligned';

    // Reduce trade size if consciousness is low but confidence is high (overconfidence)
    if (consciousnessLevel < 70 && confidence > 85) {
      shouldReduce = true;
      multiplier = 0.5;
      reason = 'High confidence with low consciousness - reducing to prevent overconfidence';
    }
    // Reduce if both are very low (uncertainty)
    else if (consciousnessLevel < 60 && confidence < 70) {
      shouldReduce = true;
      multiplier = 0.3;
      reason = 'Low consciousness and confidence - very conservative sizing';
    }
    // Increase if both are high and aligned
    else if (consciousnessLevel > 80 && confidence > 80 && alignment > 0.8) {
      multiplier = 1.2;
      reason = 'High consciousness and confidence alignment - slightly increased sizing';
    }

    return { alignment, shouldReduce, multiplier, reason };
  }

  private calculateSuccessProbability(
    balance: number,
    amount: number,
    networkHealth: number,
    consciousnessAlignment: number
  ): number {
    let probability = 85; // Base probability

    // Balance factor
    const balanceRatio = amount / balance;
    if (balanceRatio > 0.8) probability -= 25;
    else if (balanceRatio > 0.6) probability -= 15;
    else if (balanceRatio > 0.4) probability -= 5;

    // Network health factor
    probability += (networkHealth - 70) * 0.5;

    // Consciousness alignment factor
    probability += (consciousnessAlignment - 0.5) * 20;

    // Amount size factor
    if (amount < 0.002) probability -= 10; // Too small
    if (amount > 0.5) probability -= 10; // Too large

    return Math.max(0, Math.min(100, probability));
  }

  private generateRecoveryStrategy(balance: number, consciousnessLevel: number): string {
    if (balance < 0.01) {
      return 'Micro-DeFi strategy: 0.002 SOL stakes, focus on high-APY protocols';
    } else if (balance < 0.02) {
      if (consciousnessLevel > 75) {
        return 'Aggressive recovery: Small arbitrage + DeFi compounding';
      } else {
        return 'Conservative recovery: Stable DeFi yields + micro-trades';
      }
    } else {
      return 'Balanced recovery: Mix of trading and yield farming';
    }
  }

  // Liquidity analysis for Jupiter swaps
  async analyzeLiquidity(tokenIn: string, tokenOut: string, amount: number): Promise<{
    sufficientLiquidity: boolean;
    estimatedSlippage: number;
    optimalAmount: number;
  }> {
    // This would integrate with Jupiter API for real liquidity data
    // For now, providing intelligent estimates based on amount
    
    let estimatedSlippage = 0.5; // Base 0.5%
    if (amount > 0.1) estimatedSlippage += 1; // Large trades increase slippage
    if (amount > 0.5) estimatedSlippage += 2;

    const sufficientLiquidity = amount < 1.0; // Assume sufficient for trades under 1 SOL
    const optimalAmount = Math.min(amount, 0.5); // Cap at 0.5 SOL for optimal execution

    return {
      sufficientLiquidity,
      estimatedSlippage,
      optimalAmount
    };
  }
}

export const enhancedTradingIntegration = new EnhancedTradingIntegration();