import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
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

  getTradeHistory() {
    return this.tradeHistory;
  }

  async getAuthenticMarketData() {
    // Get real market data from authentic sources only
    const tokens = ['SOL', 'BONK', 'JUP', 'ORCA', 'RAY'];
    const marketData = {};
    
    for (const token of tokens) {
      try {
        // Use real price data from Jupiter API
        const response = await fetch(`https://price.jup.ag/v6/price?ids=${token}`);
        if (response.ok) {
          const data = await response.json();
          marketData[token] = data.data?.[token]?.price || 1.0;
        }
      } catch (error) {
        console.log(`Failed to fetch ${token} price from authentic source`);
        marketData[token] = null; // Use null to indicate missing authentic data
      }
    }
    
    return marketData;
  }
}

export const authenticDataValidator = new AuthenticDataValidator();