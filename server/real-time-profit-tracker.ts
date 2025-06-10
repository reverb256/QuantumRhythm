import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { dataProtection } from './data-protection-middleware';
import { intelligentRateLimiter } from './intelligent-rate-limiter';

interface RealProfitAnalysis {
  actualBalance: number;
  totalTransactions: number;
  tradingVolume: number;
  realizedPnL: number;
  timeframeAnalyzed: string;
  lastTransactionTime: number;
  tradingActive: boolean;
  walletAge: number;
  performanceMetrics: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    totalFees: number;
  };
}

export class RealTimeProfitTracker {
  private connection: Connection;
  private walletAddress = 'JA63CrEdqjK6cyEkGquuYmk4xyTVgTXSFABZDNW3Qnfj';

  constructor() {
    this.connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  }

  async analyzeRealTradingPerformance(): Promise<RealProfitAnalysis> {
    console.log('📊 Analyzing real wallet performance and trading history...');
    
    try {
      const publicKey = new PublicKey(this.walletAddress);
      
      // Get current balance with rate limiting
      const balance = await intelligentRateLimiter.makeRequest(
        'solana-rpc',
        async (url) => {
          const conn = new Connection(url, 'confirmed');
          return await conn.getBalance(publicKey);
        }
      );
      const actualBalance = balance / 1_000_000_000; // Convert lamports to SOL
      
      // Get transaction history with rate limiting
      const signatures = await intelligentRateLimiter.makeRequest(
        'solana-rpc',
        async (url) => {
          const conn = new Connection(url, 'confirmed');
          return await conn.getSignaturesForAddress(publicKey, { limit: 50 });
        }
      );
      
      console.log(`💰 Current Balance: ${actualBalance.toFixed(6)} SOL`);
      console.log(`📝 Found ${signatures.length} transactions to analyze`);
      
      let totalVolume = 0;
      let totalFees = 0;
      let profits: number[] = [];
      let losses: number[] = [];
      let lastTxTime = 0;
      let firstTxTime = Date.now();
      
      // Analyze recent transactions (last 100 for performance)
      const recentSignatures = signatures.slice(0, 100);
      
      for (const sig of recentSignatures) {
        try {
          const tx = await this.connection.getParsedTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0
          });
          
          if (tx && tx.meta) {
            const fee = tx.meta.fee / 1_000_000_000;
            totalFees += fee;
            
            if (sig.blockTime) {
              lastTxTime = Math.max(lastTxTime, sig.blockTime * 1000);
              firstTxTime = Math.min(firstTxTime, sig.blockTime * 1000);
            }
            
            // Analyze balance changes
            const preBalance = tx.meta.preBalances[0] / 1_000_000_000;
            const postBalance = tx.meta.postBalances[0] / 1_000_000_000;
            const netChange = postBalance - preBalance;
            
            if (Math.abs(netChange) > 0.001) { // Significant transaction
              totalVolume += Math.abs(netChange);
              
              if (netChange > 0) {
                profits.push(netChange);
              } else if (netChange < 0) {
                losses.push(Math.abs(netChange));
              }
            }
          }
        } catch (error) {
          // Skip failed transaction analysis
          continue;
        }
      }
      
      const totalProfit = profits.reduce((a, b) => a + b, 0);
      const totalLoss = losses.reduce((a, b) => a + b, 0);
      const realizedPnL = totalProfit - totalLoss - totalFees;
      
      const winRate = profits.length > 0 ? profits.length / (profits.length + losses.length) : 0;
      const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit;
      const maxDrawdown = losses.length > 0 ? Math.max(...losses) : 0;
      
      const walletAge = (Date.now() - firstTxTime) / (1000 * 60 * 60 * 24); // Days
      const tradingActive = (Date.now() - lastTxTime) < (24 * 60 * 60 * 1000); // Active in last 24h
      
      const analysis: RealProfitAnalysis = {
        actualBalance,
        totalTransactions: signatures.length,
        tradingVolume: totalVolume,
        realizedPnL,
        timeframeAnalyzed: `Last ${recentSignatures.length} transactions`,
        lastTransactionTime: lastTxTime,
        tradingActive,
        walletAge,
        performanceMetrics: {
          winRate,
          profitFactor,
          maxDrawdown,
          totalFees
        }
      };
      
      this.logRealPerformance(analysis);
      return analysis;
      
    } catch (error) {
      const sanitizedError = dataProtection.sanitizeQuery(String(error));
      console.error('Real performance analysis failed:', sanitizedError);
      
      return {
        actualBalance: 0,
        totalTransactions: 0,
        tradingVolume: 0,
        realizedPnL: 0,
        timeframeAnalyzed: 'Analysis failed',
        lastTransactionTime: 0,
        tradingActive: false,
        walletAge: 0,
        performanceMetrics: {
          winRate: 0,
          profitFactor: 0,
          maxDrawdown: 0,
          totalFees: 0
        }
      };
    }
  }

  private logRealPerformance(analysis: RealProfitAnalysis): void {
    console.log('\n📊 REAL WALLET PERFORMANCE ANALYSIS');
    console.log('=====================================');
    console.log(`💰 Current Balance: ${analysis.actualBalance.toFixed(6)} SOL`);
    console.log(`📊 Total Transactions: ${analysis.totalTransactions}`);
    console.log(`🔄 Trading Volume: ${analysis.tradingVolume.toFixed(6)} SOL`);
    console.log(`💎 Realized P&L: ${analysis.realizedPnL.toFixed(6)} SOL`);
    console.log(`⏱️ Wallet Age: ${analysis.walletAge.toFixed(1)} days`);
    console.log(`🎯 Win Rate: ${(analysis.performanceMetrics.winRate * 100).toFixed(1)}%`);
    console.log(`📈 Profit Factor: ${analysis.performanceMetrics.profitFactor.toFixed(2)}`);
    console.log(`📉 Max Drawdown: ${analysis.performanceMetrics.maxDrawdown.toFixed(6)} SOL`);
    console.log(`💸 Total Fees: ${analysis.performanceMetrics.totalFees.toFixed(6)} SOL`);
    console.log(`🔴 Trading Active: ${analysis.tradingActive ? 'YES' : 'NO'}`);
    
    if (analysis.realizedPnL > 0) {
      console.log(`🚀 PROFITABLE: +${analysis.realizedPnL.toFixed(6)} SOL net gain`);
    } else if (analysis.realizedPnL < 0) {
      console.log(`📉 LOSS: ${analysis.realizedPnL.toFixed(6)} SOL net loss`);
    } else {
      console.log(`⚖️ BREAKEVEN: No significant P&L detected`);
    }
  }

  async compareSimulatedVsReal(): Promise<{
    simulatedProfit: number;
    realProfit: number;
    accuracyScore: number;
    recommendation: string;
  }> {
    const realAnalysis = await this.analyzeRealTradingPerformance();
    
    // Current system shows simulated profits, compare with real data
    const simulatedProfit = 0; // No real profits detected from logs
    const realProfit = realAnalysis.realizedPnL;
    
    const accuracyScore = realProfit === 0 ? 0 : Math.min(100, (1 - Math.abs(simulatedProfit - realProfit) / Math.abs(realProfit)) * 100);
    
    let recommendation = '';
    if (realAnalysis.actualBalance === 0) {
      recommendation = 'SIMULATION MODE: No SOL balance detected. System correctly operating in simulation mode.';
    } else if (realAnalysis.tradingActive) {
      recommendation = 'LIVE TRADING DETECTED: Wallet shows recent activity. Consider enabling live trading mode.';
    } else {
      recommendation = 'DORMANT WALLET: Wallet has balance but no recent trading activity detected.';
    }
    
    console.log('\n🔍 SIMULATION VS REALITY COMPARISON');
    console.log('=====================================');
    console.log(`🎮 Simulated Profit: ${simulatedProfit.toFixed(6)} SOL`);
    console.log(`💰 Real Profit: ${realProfit.toFixed(6)} SOL`);
    console.log(`🎯 Accuracy Score: ${accuracyScore.toFixed(1)}%`);
    console.log(`💡 Recommendation: ${recommendation}`);
    
    return {
      simulatedProfit,
      realProfit,
      accuracyScore,
      recommendation
    };
  }

  // Monitor real-time changes
  startRealTimeMonitoring(): void {
    setInterval(async () => {
      await this.analyzeRealTradingPerformance();
    }, 300000); // Every 5 minutes
  }
}

export const profitTracker = new RealTimeProfitTracker();