/**
 * Balance-Aware Trading System
 * Solves the trader's #1 priority: Dynamic trade sizing based on actual balance
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface BalanceAnalysis {
  totalBalance: number;
  availableForTrading: number;
  reservedForGas: number;
  recommendedTradeSize: number;
  maxSafeTradeSize: number;
  canExecuteTrade: boolean;
  reasoning: string;
}

interface TradeRequest {
  desiredAmount: number;
  tokenIn: string;
  tokenOut: string;
  slippage: number;
}

export class BalanceAwareTrading {
  private connection: Connection;
  private minGasReserve: number = 0.005; // 0.005 SOL minimum reserve
  private safetyMargin: number = 0.002; // Additional safety buffer

  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
  }

  async analyzeBalance(walletAddress: string): Promise<BalanceAnalysis> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      const balanceSOL = balance / LAMPORTS_PER_SOL;

      // Calculate reserves and available trading amount
      const reservedForGas = this.minGasReserve + this.safetyMargin;
      const availableForTrading = Math.max(0, balanceSOL - reservedForGas);
      
      // Recommended trade size (conservative)
      const recommendedTradeSize = availableForTrading * 0.6; // 60% of available
      
      // Maximum safe trade size
      const maxSafeTradeSize = availableForTrading * 0.8; // 80% of available

      const canExecuteTrade = availableForTrading > 0.001; // Minimum 0.001 SOL to trade

      let reasoning = '';
      if (!canExecuteTrade) {
        reasoning = `Insufficient balance. Need ${reservedForGas + 0.001} SOL minimum (${reservedForGas} for gas + 0.001 for trade)`;
      } else if (availableForTrading < 0.005) {
        reasoning = `Very low balance. Recommend micro-trades only (<0.003 SOL)`;
      } else if (availableForTrading < 0.02) {
        reasoning = `Limited balance. Recommend conservative trades (${recommendedTradeSize.toFixed(4)} SOL max)`;
      } else {
        reasoning = `Healthy balance. Can execute trades up to ${maxSafeTradeSize.toFixed(4)} SOL safely`;
      }

      return {
        totalBalance: balanceSOL,
        availableForTrading,
        reservedForGas,
        recommendedTradeSize,
        maxSafeTradeSize,
        canExecuteTrade,
        reasoning
      };

    } catch (error) {
      throw new Error(`Balance analysis failed: ${error}`);
    }
  }

  async validateTradeRequest(walletAddress: string, tradeRequest: TradeRequest): Promise<{
    approved: boolean;
    adjustedAmount: number;
    reasoning: string;
    analysis: BalanceAnalysis;
  }> {
    const analysis = await this.analyzeBalance(walletAddress);
    
    if (!analysis.canExecuteTrade) {
      return {
        approved: false,
        adjustedAmount: 0,
        reasoning: analysis.reasoning,
        analysis
      };
    }

    // Check if requested amount is feasible
    if (tradeRequest.desiredAmount > analysis.maxSafeTradeSize) {
      const adjustedAmount = analysis.recommendedTradeSize;
      return {
        approved: true,
        adjustedAmount,
        reasoning: `Requested ${tradeRequest.desiredAmount} SOL exceeds safe limit. Adjusted to ${adjustedAmount.toFixed(4)} SOL`,
        analysis
      };
    }

    // Check if amount is too small to be profitable after gas
    const estimatedGasCost = 0.0001; // Rough estimate for Jupiter swap
    if (tradeRequest.desiredAmount < estimatedGasCost * 10) {
      return {
        approved: false,
        adjustedAmount: 0,
        reasoning: `Trade amount ${tradeRequest.desiredAmount} SOL too small. Minimum ${(estimatedGasCost * 10).toFixed(4)} SOL recommended`,
        analysis
      };
    }

    return {
      approved: true,
      adjustedAmount: tradeRequest.desiredAmount,
      reasoning: `Trade approved. Amount ${tradeRequest.desiredAmount} SOL is within safe limits`,
      analysis
    };
  }

  async getOptimalTradeSize(walletAddress: string, riskTolerance: 'conservative' | 'moderate' | 'aggressive' = 'moderate'): Promise<{
    recommendedAmount: number;
    reasoning: string;
    analysis: BalanceAnalysis;
  }> {
    const analysis = await this.analyzeBalance(walletAddress);

    if (!analysis.canExecuteTrade) {
      return {
        recommendedAmount: 0,
        reasoning: analysis.reasoning,
        analysis
      };
    }

    let multiplier = 0.6; // Default moderate
    if (riskTolerance === 'conservative') multiplier = 0.4;
    if (riskTolerance === 'aggressive') multiplier = 0.8;

    const recommendedAmount = analysis.availableForTrading * multiplier;

    return {
      recommendedAmount,
      reasoning: `${riskTolerance.toUpperCase()} strategy: ${(multiplier * 100)}% of available balance (${recommendedAmount.toFixed(4)} SOL)`,
      analysis
    };
  }

  // Real-time balance monitoring for the trader
  async startBalanceMonitoring(walletAddress: string, callback: (analysis: BalanceAnalysis) => void): Promise<void> {
    const monitor = async () => {
      try {
        const analysis = await this.analyzeBalance(walletAddress);
        callback(analysis);
      } catch (error) {
        console.error('Balance monitoring error:', error);
      }
    };

    // Initial check
    await monitor();

    // Check every 30 seconds
    setInterval(monitor, 30000);
  }
}

export const balanceAwareTrading = new BalanceAwareTrading();