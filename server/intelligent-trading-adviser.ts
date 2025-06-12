/**
 * Intelligent Trading Adviser
 * Integrates balance-aware trading and Jupiter swap prediction for the AI trader
 */

import { balanceAwareTrading } from './balance-aware-trading.js';
import { jupiterSwapPredictor } from './jupiter-swap-predictor.js';

interface TradeAdvice {
  shouldExecute: boolean;
  recommendedAmount: number;
  originalAmount: number;
  successProbability: number;
  reasoning: string[];
  networkHealth: string;
  balanceStatus: string;
  recommendations: string[];
  estimatedGas: number;
}

export class IntelligentTradingAdviser {
  async adviseOnTrade(
    walletAddress: string,
    tokenIn: string,
    tokenOut: string,
    desiredAmount: number,
    riskTolerance: 'conservative' | 'moderate' | 'aggressive' = 'moderate'
  ): Promise<TradeAdvice> {
    const reasoning: string[] = [];
    const recommendations: string[] = [];

    try {
      // Step 1: Balance Analysis
      const balanceValidation = await balanceAwareTrading.validateTradeRequest(walletAddress, {
        desiredAmount,
        tokenIn,
        tokenOut,
        slippage: 0.5
      });

      reasoning.push(`Balance Analysis: ${balanceValidation.reasoning}`);

      if (!balanceValidation.approved) {
        return {
          shouldExecute: false,
          recommendedAmount: 0,
          originalAmount: desiredAmount,
          successProbability: 0,
          reasoning,
          networkHealth: 'unknown',
          balanceStatus: 'insufficient',
          recommendations: ['Insufficient balance for trade'],
          estimatedGas: 0
        };
      }

      // Step 2: Jupiter Swap Prediction
      const swapPrediction = await jupiterSwapPredictor.predictSwapSuccess(
        tokenIn,
        tokenOut,
        balanceValidation.adjustedAmount,
        walletAddress
      );

      reasoning.push(`Swap Prediction: ${swapPrediction.reasoning}`);
      recommendations.push(...swapPrediction.recommendations);

      // Step 3: Combined Decision
      const shouldExecute = balanceValidation.approved && swapPrediction.canExecute;
      
      if (shouldExecute) {
        reasoning.push('Trade approved with optimal conditions');
      } else if (!swapPrediction.canExecute) {
        reasoning.push('Network conditions not suitable for trading');
      }

      // Step 4: Final Recommendations
      if (balanceValidation.adjustedAmount !== desiredAmount) {
        recommendations.push(`Amount adjusted from ${desiredAmount} to ${balanceValidation.adjustedAmount} SOL`);
      }

      if (swapPrediction.successProbability < 80) {
        recommendations.push('Consider waiting for better network conditions');
      }

      return {
        shouldExecute,
        recommendedAmount: balanceValidation.adjustedAmount,
        originalAmount: desiredAmount,
        successProbability: swapPrediction.successProbability,
        reasoning,
        networkHealth: swapPrediction.networkHealth,
        balanceStatus: balanceValidation.approved ? 'sufficient' : 'insufficient',
        recommendations,
        estimatedGas: swapPrediction.estimatedGas
      };

    } catch (error) {
      return {
        shouldExecute: false,
        recommendedAmount: 0,
        originalAmount: desiredAmount,
        successProbability: 0,
        reasoning: [`Analysis failed: ${error}`],
        networkHealth: 'unknown',
        balanceStatus: 'unknown',
        recommendations: ['Unable to analyze trade - do not execute'],
        estimatedGas: 0
      };
    }
  }

  async getOptimalTradingWindow(walletAddress: string): Promise<{
    canTradeNow: boolean;
    recommendedWaitTime: number;
    networkScore: number;
    balanceScore: number;
    overallScore: number;
    advice: string;
  }> {
    try {
      const [balanceAnalysis, networkHealth] = await Promise.all([
        balanceAwareTrading.analyzeBalance(walletAddress),
        jupiterSwapPredictor.getNetworkHealth()
      ]);

      const balanceScore = balanceAnalysis.canExecuteTrade ? 
        Math.min(100, (balanceAnalysis.availableForTrading / 0.05) * 100) : 0;
      
      const networkScore = networkHealth.healthScore;
      const overallScore = (balanceScore + networkScore) / 2;

      let advice = '';
      let recommendedWaitTime = 0;
      let canTradeNow = false;

      if (overallScore > 75) {
        canTradeNow = true;
        advice = 'Excellent conditions for trading';
      } else if (overallScore > 60) {
        canTradeNow = true;
        advice = 'Good conditions - proceed with caution';
      } else if (networkScore < 50) {
        recommendedWaitTime = 300; // 5 minutes
        advice = 'Network congested - wait for better conditions';
      } else if (balanceScore < 50) {
        advice = 'Insufficient balance for safe trading';
      } else {
        recommendedWaitTime = 180; // 3 minutes
        advice = 'Suboptimal conditions - consider waiting';
      }

      return {
        canTradeNow,
        recommendedWaitTime,
        networkScore,
        balanceScore,
        overallScore,
        advice
      };

    } catch (error) {
      return {
        canTradeNow: false,
        recommendedWaitTime: 600,
        networkScore: 0,
        balanceScore: 0,
        overallScore: 0,
        advice: `Analysis failed: ${error}`
      };
    }
  }
}

export const intelligentTradingAdviser = new IntelligentTradingAdviser();