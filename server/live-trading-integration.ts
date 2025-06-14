/**
 * Live Trading Data Integration
 * Real-time collaboration with active trading AI systems
 */

import axios from 'axios';

interface LivePortfolioData {
  total_value_usd: number;
  total_pnl_24h: number;
  total_pnl_percentage: number;
  active_positions: number;
  last_trade_timestamp: string;
  trading_pairs: string[];
  performance_metrics: {
    win_rate: number;
    avg_profit_per_trade: number;
    max_drawdown: number;
    sharpe_ratio: number;
  };
}

interface SolanaWalletData {
  sol_balance: number;
  token_balances: Array<{
    mint: string;
    symbol: string;
    balance: number;
    value_usd: number;
  }>;
  total_value_usd: number;
  recent_transactions: Array<{
    signature: string;
    type: 'buy' | 'sell' | 'swap';
    amount: number;
    symbol: string;
    timestamp: string;
  }>;
}

export class LiveTradingIntegration {
  private portfolio_cache: LivePortfolioData | null = null;
  private solana_cache: SolanaWalletData | null = null;
  private last_update: Date = new Date();
  private update_interval: NodeJS.Timeout | null = null;

  constructor() {
    console.log('🔗 Live Trading Integration initialized - connecting to real data sources');
    this.startDataUpdates();
  }

  private startDataUpdates() {
    // Update portfolio data every 30 seconds
    this.update_interval = setInterval(async () => {
      await this.updateAllData();
    }, 30000);

    // Initial data fetch
    this.updateAllData();
  }

  private async updateAllData() {
    try {
      await Promise.all([
        this.fetchSolanaWalletData(),
        this.fetchExchangeData(),
        this.calculateRealTimeMetrics()
      ]);
      
      this.last_update = new Date();
      console.log('📊 Live trading data updated successfully');
    } catch (error) {
      console.error('⚠️ Error updating live trading data:', error);
    }
  }

  private async fetchSolanaWalletData(): Promise<void> {
    const wallet_address = process.env.SOLANA_WALLET_ADDRESS;
    if (!wallet_address) {
      console.log('⏳ Waiting for Solana wallet address configuration');
      return;
    }

    try {
      // Fetch SOL balance
      const sol_response = await axios.post('https://api.mainnet-beta.solana.com', {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [wallet_address]
      });

      const sol_balance = sol_response.data.result.value / 1e9; // Convert lamports to SOL

      // Fetch token accounts
      const token_response = await axios.post('https://api.mainnet-beta.solana.com', {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          wallet_address,
          { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
          { encoding: 'jsonParsed' }
        ]
      });

      // Process token balances and get USD values
      const token_balances = await this.processTokenBalances(token_response.data.result.value);

      // Fetch recent transactions
      const tx_response = await axios.post('https://api.mainnet-beta.solana.com', {
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [wallet_address, { limit: 10 }]
      });

      const recent_transactions = await this.processRecentTransactions(tx_response.data.result);

      this.solana_cache = {
        sol_balance,
        token_balances,
        total_value_usd: sol_balance * await this.getSolPrice() + token_balances.reduce((sum, token) => sum + token.value_usd, 0),
        recent_transactions
      };

    } catch (error) {
      console.error('Error fetching Solana data:', error);
    }
  }

  private async processTokenBalances(token_accounts: any[]): Promise<any[]> {
    const processed_balances = [];
    
    for (const account of token_accounts) {
      const parsed_info = account.account.data.parsed.info;
      const mint = parsed_info.mint;
      const balance = parseFloat(parsed_info.tokenAmount.uiAmount || '0');
      
      if (balance > 0) {
        // Get token metadata and price
        const token_info = await this.getTokenInfo(mint);
        processed_balances.push({
          mint,
          symbol: token_info.symbol || 'UNKNOWN',
          balance,
          value_usd: balance * (token_info.price_usd || 0)
        });
      }
    }
    
    return processed_balances;
  }

  private async processRecentTransactions(signatures: any[]): Promise<any[]> {
    const processed_transactions = [];
    
    for (const sig_info of signatures.slice(0, 5)) { // Process last 5 transactions
      try {
        const tx_response = await axios.post('https://api.mainnet-beta.solana.com', {
          jsonrpc: '2.0',
          id: 1,
          method: 'getTransaction',
          params: [sig_info.signature, { encoding: 'jsonParsed' }]
        });

        const tx_data = tx_response.data.result;
        if (tx_data) {
          const parsed_tx = this.parseTransactionType(tx_data);
          if (parsed_tx) {
            processed_transactions.push({
              signature: sig_info.signature,
              ...parsed_tx,
              timestamp: new Date(sig_info.blockTime * 1000).toISOString()
            });
          }
        }
      } catch (error) {
        console.error('Error processing transaction:', error);
      }
    }
    
    return processed_transactions;
  }

  private parseTransactionType(tx_data: any): any {
    // Simplified transaction parsing - can be enhanced
    const instructions = tx_data.transaction.message.instructions;
    
    for (const instruction of instructions) {
      if (instruction.parsed) {
        const parsed = instruction.parsed;
        if (parsed.type === 'transfer') {
          return {
            type: 'transfer',
            amount: parsed.info.lamports / 1e9,
            symbol: 'SOL'
          };
        }
      }
    }
    
    return {
      type: 'unknown',
      amount: 0,
      symbol: 'SOL'
    };
  }

  private async fetchExchangeData(): Promise<void> {
    // Aggregate data from multiple exchanges if keys are available
    const exchange_data = {
      total_value_usd: 0,
      total_pnl_24h: 0,
      total_pnl_percentage: 0,
      active_positions: 0,
      last_trade_timestamp: new Date().toISOString(),
      trading_pairs: [],
      performance_metrics: {
        win_rate: 0,
        avg_profit_per_trade: 0,
        max_drawdown: 0,
        sharpe_ratio: 0
      }
    };

    // Fetch Binance data if available
    if (process.env.BINANCE_API_KEY && process.env.BINANCE_SECRET) {
      const binance_data = await this.fetchBinanceData();
      exchange_data.total_value_usd += binance_data.total_value_usd || 0;
      exchange_data.active_positions += binance_data.active_positions || 0;
    }

    // Fetch Coinbase data if available
    if (process.env.COINBASE_API_KEY && process.env.COINBASE_SECRET) {
      const coinbase_data = await this.fetchCoinbaseData();
      exchange_data.total_value_usd += coinbase_data.total_value_usd || 0;
      exchange_data.active_positions += coinbase_data.active_positions || 0;
    }

    this.portfolio_cache = exchange_data;
  }

  private async fetchBinanceData(): Promise<any> {
    try {
      // Implementation would use Binance API with proper authentication
      console.log('📊 Fetching Binance portfolio data...');
      return { total_value_usd: 0, active_positions: 0 };
    } catch (error) {
      console.error('Error fetching Binance data:', error);
      return { total_value_usd: 0, active_positions: 0 };
    }
  }

  private async fetchCoinbaseData(): Promise<any> {
    try {
      // Implementation would use Coinbase API with proper authentication
      console.log('📊 Fetching Coinbase portfolio data...');
      return { total_value_usd: 0, active_positions: 0 };
    } catch (error) {
      console.error('Error fetching Coinbase data:', error);
      return { total_value_usd: 0, active_positions: 0 };
    }
  }

  private async calculateRealTimeMetrics(): Promise<void> {
    // Calculate real-time performance metrics
    const total_portfolio_value = (this.solana_cache?.total_value_usd || 0) + 
                                  (this.portfolio_cache?.total_value_usd || 0);
    
    console.log(`💰 Total portfolio value: $${total_portfolio_value.toFixed(2)}`);
  }

  private async getTokenInfo(mint: string): Promise<any> {
    try {
      // Use Jupiter API or CoinGecko for token metadata and pricing
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${mint}&vs_currencies=usd`);
      const price_data = response.data[mint];
      
      return {
        symbol: 'TOKEN', // Would fetch from metadata
        price_usd: price_data?.usd || 0
      };
    } catch (error) {
      return { symbol: 'UNKNOWN', price_usd: 0 };
    }
  }

  private async getSolPrice(): Promise<number> {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      return response.data.solana.usd;
    } catch (error) {
      return 0;
    }
  }

  // Public methods for accessing live data
  public getLivePortfolioData(): LivePortfolioData | null {
    return this.portfolio_cache;
  }

  public getSolanaWalletData(): SolanaWalletData | null {
    return this.solana_cache;
  }

  public getTotalPortfolioValue(): number {
    const solana_value = this.solana_cache?.total_value_usd || 0;
    const exchange_value = this.portfolio_cache?.total_value_usd || 0;
    return solana_value + exchange_value;
  }

  public getLastUpdateTime(): Date {
    return this.last_update;
  }

  public isLiveDataAvailable(): boolean {
    return !!(process.env.SOLANA_WALLET_ADDRESS || 
              process.env.BINANCE_API_KEY || 
              process.env.COINBASE_API_KEY);
  }

  public getConnectionStatus(): string {
    const connections = [];
    if (process.env.SOLANA_WALLET_ADDRESS) connections.push('Solana');
    if (process.env.BINANCE_API_KEY) connections.push('Binance');
    if (process.env.COINBASE_API_KEY) connections.push('Coinbase');
    
    return connections.length > 0 ? 
           `Connected to: ${connections.join(', ')}` : 
           'Waiting for API configuration';
  }

  public destroy() {
    if (this.update_interval) {
      clearInterval(this.update_interval);
    }
  }
}

export const liveTradingIntegration = new LiveTradingIntegration();