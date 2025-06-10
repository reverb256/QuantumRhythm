import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { secureWallet } from './secure-wallet-manager';
import { dataProtection } from './data-protection-middleware';

interface AuthenticTradeData {
  isLiveChain: boolean;
  actualBalance: number;
  realProfits: number;
  simulatedProfits: number;
  tradeMode: 'live' | 'simulation' | 'testnet';
  networkStatus: string;
}

export class AuthenticDataValidator {
  private connection: Connection;
  private actualProfits = 0;
  private simulatedProfits = 0;
  private tradeHistory: Array<{
    timestamp: number;
    type: 'real' | 'simulated';
    amount: number;
    profit: number;
  }> = [];

  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    );
  }

  async validateTradingData(): Promise<AuthenticTradeData> {
    try {
      // Use the specified wallet address: JA63CrEdqjK6cyEkGquuYmk4xyTVgTXSFABZDNW3Qnfj
      const walletAddress = 'JA63CrEdqjK6cyEkGquuYmk4xyTVgTXSFABZDNW3Qnfj';
      const balance = await this.connection.getBalance(new PublicKey(walletAddress));
      const actualBalance = balance / LAMPORTS_PER_SOL;

      // Determine if we're on live chain with real funds
      const isLiveChain = actualBalance > 0.01; // Consider live if >0.01 SOL
      
      // Check network to confirm mainnet
      const genesisHash = await this.connection.getGenesisHash();
      const isMainnet = genesisHash === '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
      
      const tradeMode = this.determineTradeMode(isLiveChain, isMainnet);
      
      console.log(`📊 Trading Data Validation:`);
      console.log(`💰 Actual Balance: ${actualBalance.toFixed(6)} SOL`);
      console.log(`🌐 Network: ${isMainnet ? 'Mainnet' : 'Devnet/Testnet'}`);
      console.log(`🎯 Mode: ${tradeMode.toUpperCase()}`);
      console.log(`💎 Real Profits: ${this.actualProfits.toFixed(6)} SOL`);
      console.log(`🎮 Simulated Profits: ${this.simulatedProfits.toFixed(6)} SOL`);

      return {
        isLiveChain: isLiveChain && isMainnet,
        actualBalance,
        realProfits: this.actualProfits,
        simulatedProfits: this.simulatedProfits,
        tradeMode,
        networkStatus: isMainnet ? 'mainnet-beta' : 'devnet'
      };

    } catch (error) {
      const sanitizedError = dataProtection.sanitizeQuery(String(error));
      console.error('Data validation error:', sanitizedError);
      
      return {
        isLiveChain: false,
        actualBalance: 0,
        realProfits: 0,
        simulatedProfits: this.simulatedProfits,
        tradeMode: 'simulation',
        networkStatus: 'unknown'
      };
    }
  }

  private determineTradeMode(hasBalance: boolean, isMainnet: boolean): 'live' | 'simulation' | 'testnet' {
    if (!isMainnet) return 'testnet';
    if (!hasBalance) return 'simulation';
    return 'live';
  }

  recordTrade(amount: number, profit: number, isReal: boolean): void {
    this.tradeHistory.push({
      timestamp: Date.now(),
      type: isReal ? 'real' : 'simulated',
      amount,
      profit
    });

    if (isReal) {
      this.actualProfits += profit;
    } else {
      this.simulatedProfits += profit;
    }

    // Keep only last 100 trades
    if (this.tradeHistory.length > 100) {
      this.tradeHistory = this.tradeHistory.slice(-100);
    }
  }

  async getAuthenticPerformanceMetrics(): Promise<{
    totalRealTrades: number;
    totalSimulatedTrades: number;
    realWinRate: number;
    simulatedWinRate: number;
    actualBalance: number;
    authenticMode: string;
  }> {
    const validation = await this.validateTradingData();
    
    const realTrades = this.tradeHistory.filter(t => t.type === 'real');
    const simulatedTrades = this.tradeHistory.filter(t => t.type === 'simulated');
    
    const realWinRate = realTrades.length > 0 
      ? realTrades.filter(t => t.profit > 0).length / realTrades.length 
      : 0;
    
    const simulatedWinRate = simulatedTrades.length > 0
      ? simulatedTrades.filter(t => t.profit > 0).length / simulatedTrades.length
      : 0;

    return {
      totalRealTrades: realTrades.length,
      totalSimulatedTrades: simulatedTrades.length,
      realWinRate,
      simulatedWinRate,
      actualBalance: validation.actualBalance,
      authenticMode: validation.tradeMode
    };
  }

  // Real-time monitoring of authentic data
  startAuthenticDataMonitoring(): void {
    setInterval(async () => {
      const validation = await this.validateTradingData();
      
      if (validation.tradeMode !== 'live' && validation.actualBalance === 0) {
        console.log('⚠️ Running in simulation mode - No real SOL balance detected');
      }
    }, 60000); // Check every minute
  }

  getTradeHistory(): Array<{
    timestamp: number;
    type: 'real' | 'simulated';
    amount: number;
    profit: number;
  }> {
    return [...this.tradeHistory];
  }
}

export const dataValidator = new AuthenticDataValidator();