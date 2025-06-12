/**
 * Jupiter Swap Success Predictor
 * Predicts swap success probability before execution to prevent "Blockhash not found" failures
 */

import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

interface SwapPrediction {
  successProbability: number;
  canExecute: boolean;
  reasoning: string;
  networkHealth: 'excellent' | 'good' | 'poor' | 'critical';
  estimatedGas: number;
  recommendations: string[];
}

interface NetworkHealthMetrics {
  blockHeight: number;
  slot: number;
  lastBlockTime: number;
  transactionCount: number;
  averageSlotTime: number;
  healthScore: number;
}

export class JupiterSwapPredictor {
  private connection: Connection;
  private healthCache: Map<string, { data: NetworkHealthMetrics; timestamp: number }> = new Map();
  private cacheTimeout = 10000; // 10 seconds

  constructor() {
    this.connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
  }

  async getNetworkHealth(): Promise<NetworkHealthMetrics> {
    const cacheKey = 'network_health';
    const cached = this.healthCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const [blockHeight, slot, recentBlockhash, epochInfo] = await Promise.all([
        this.connection.getBlockHeight(),
        this.connection.getSlot(),
        this.connection.getLatestBlockhash(),
        this.connection.getEpochInfo()
      ]);

      // Get recent block times to calculate average slot time
      const recentBlocks = await this.connection.getBlocks(slot - 100, slot);
      const blockTimes = await Promise.all(
        recentBlocks.slice(-10).map(block => this.connection.getBlockTime(block))
      );

      const validBlockTimes = blockTimes.filter(time => time !== null) as number[];
      const averageSlotTime = validBlockTimes.length > 1 
        ? (validBlockTimes[validBlockTimes.length - 1] - validBlockTimes[0]) / (validBlockTimes.length - 1)
        : 0.4; // Default Solana slot time

      // Calculate health score based on multiple factors
      const timeSinceLastBlock = Date.now() / 1000 - (validBlockTimes[validBlockTimes.length - 1] || 0);
      const slotHealthScore = Math.max(0, 100 - (averageSlotTime - 0.4) * 100); // Penalize slow slots
      const freshnessScore = Math.max(0, 100 - timeSinceLastBlock * 10); // Penalize old blocks

      const healthScore = (slotHealthScore + freshnessScore) / 2;

      const metrics: NetworkHealthMetrics = {
        blockHeight,
        slot,
        lastBlockTime: validBlockTimes[validBlockTimes.length - 1] || 0,
        transactionCount: recentBlocks.length,
        averageSlotTime,
        healthScore
      };

      this.healthCache.set(cacheKey, { data: metrics, timestamp: Date.now() });
      return metrics;

    } catch (error) {
      console.error('Network health check failed:', error);
      return {
        blockHeight: 0,
        slot: 0,
        lastBlockTime: 0,
        transactionCount: 0,
        averageSlotTime: 1.0,
        healthScore: 0
      };
    }
  }

  async predictSwapSuccess(
    tokenIn: string,
    tokenOut: string,
    amount: number,
    walletAddress: string
  ): Promise<SwapPrediction> {
    try {
      const networkHealth = await this.getNetworkHealth();
      const recommendations: string[] = [];
      let successProbability = 85; // Base probability

      // Factor 1: Network Health
      if (networkHealth.healthScore > 80) {
        successProbability += 10;
        recommendations.push('Network health excellent');
      } else if (networkHealth.healthScore > 60) {
        successProbability += 5;
        recommendations.push('Network health good');
      } else if (networkHealth.healthScore > 40) {
        successProbability -= 10;
        recommendations.push('Network congested - consider waiting');
      } else {
        successProbability -= 25;
        recommendations.push('Network critical - avoid trading');
      }

      // Factor 2: Slot Time Analysis
      if (networkHealth.averageSlotTime > 0.8) {
        successProbability -= 15;
        recommendations.push('Slow slots detected - high failure risk');
      } else if (networkHealth.averageSlotTime > 0.6) {
        successProbability -= 5;
        recommendations.push('Slightly slow network');
      }

      // Factor 3: Recent Block Freshness
      const timeSinceLastBlock = Date.now() / 1000 - networkHealth.lastBlockTime;
      if (timeSinceLastBlock > 10) {
        successProbability -= 20;
        recommendations.push('Stale blockhash risk - wait for fresh blocks');
      } else if (timeSinceLastBlock > 5) {
        successProbability -= 10;
        recommendations.push('Aging blockhash - execute soon');
      }

      // Factor 4: Balance Verification
      try {
        const balance = await this.connection.getBalance(new PublicKey(walletAddress));
        const balanceSOL = balance / 1e9;
        
        if (balanceSOL < amount + 0.005) {
          successProbability = 0;
          recommendations.push('Insufficient balance for trade + gas');
        } else if (balanceSOL < amount + 0.01) {
          successProbability -= 20;
          recommendations.push('Very tight balance - risky');
        }
      } catch (balanceError) {
        successProbability -= 15;
        recommendations.push('Could not verify balance');
      }

      // Factor 5: Amount Size Analysis
      if (amount < 0.001) {
        successProbability -= 10;
        recommendations.push('Very small trade - may not be profitable after gas');
      } else if (amount > 1.0) {
        successProbability -= 5;
        recommendations.push('Large trade - higher slippage risk');
      }

      // Determine network health category
      let networkHealthCategory: 'excellent' | 'good' | 'poor' | 'critical';
      if (networkHealth.healthScore > 80) networkHealthCategory = 'excellent';
      else if (networkHealth.healthScore > 60) networkHealthCategory = 'good';
      else if (networkHealth.healthScore > 40) networkHealthCategory = 'poor';
      else networkHealthCategory = 'critical';

      // Clamp probability between 0 and 100
      successProbability = Math.max(0, Math.min(100, successProbability));

      // Determine if execution is recommended
      const canExecute = successProbability > 70;

      // Generate reasoning
      let reasoning = '';
      if (successProbability > 85) {
        reasoning = 'Excellent conditions for swap execution';
      } else if (successProbability > 70) {
        reasoning = 'Good conditions - proceed with caution';
      } else if (successProbability > 50) {
        reasoning = 'Risky conditions - consider waiting';
      } else {
        reasoning = 'Poor conditions - do not execute';
      }

      // Estimate gas cost
      const estimatedGas = networkHealth.averageSlotTime > 0.6 ? 0.0002 : 0.0001;

      return {
        successProbability,
        canExecute,
        reasoning,
        networkHealth: networkHealthCategory,
        estimatedGas,
        recommendations
      };

    } catch (error) {
      return {
        successProbability: 0,
        canExecute: false,
        reasoning: `Prediction failed: ${error}`,
        networkHealth: 'critical',
        estimatedGas: 0.0002,
        recommendations: ['Unable to analyze - do not execute']
      };
    }
  }

  async waitForOptimalConditions(maxWaitTime: number = 60000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const health = await this.getNetworkHealth();
      
      if (health.healthScore > 75 && health.averageSlotTime < 0.6) {
        return true; // Optimal conditions found
      }
      
      // Wait 5 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    return false; // Timeout reached
  }

  // Real-time monitoring for the trader
  async startNetworkMonitoring(callback: (health: NetworkHealthMetrics) => void): Promise<void> {
    const monitor = async () => {
      try {
        const health = await this.getNetworkHealth();
        callback(health);
      } catch (error) {
        console.error('Network monitoring error:', error);
      }
    };

    // Initial check
    await monitor();

    // Check every 15 seconds
    setInterval(monitor, 15000);
  }
}

export const jupiterSwapPredictor = new JupiterSwapPredictor();