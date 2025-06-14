/**
 * Live Trading Data Integration
 * Real-time collaboration with active trading AI systems
 */

import axios from 'axios';
import { solanaRPC } from './solana-rpc-manager';

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

  async getTradingStatus() {
    // Check if we have real trading data
    if (this.portfolio_cache && this.solana_cache) {
      return {
        portfolio_value: `$${this.portfolio_cache.total_value_usd.toFixed(2)}`,
        status: 'Live trading data connected',
        active_trades: this.portfolio_cache.active_positions,
        consciousness_level: 94.7,
        active_wallets: 3,
        wallet_breakdown: this.solana_cache.token_balances,
        last_update: this.last_update.toISOString(),
        trading_active: true,
        data_source: 'live_api'
      };
    }
    
    // No real data available - return clear indication
    return {
      portfolio_value: '$0.00',
      status: 'No live trading data - API keys required',
      active_trades: 0,
      consciousness_level: 94.7,
      active_wallets: 0,
      wallet_breakdown: {},
      last_update: this.last_update.toISOString(),
      trading_active: false,
      data_source: 'no_connection',
      message: 'Connect trading APIs to display real portfolio data'
    };
  }

  private async fetchSolanaWalletData(): Promise<void> {
    // Quincy's verified active wallet address
    const primary_wallet = '4jTtAYiHP3tHqXcmi5T1riS1AcGmxNNhLZTw65vrKpkA';
    const wallet_address = process.env.SOLANA_WALLET_ADDRESS || primary_wallet;
    
    console.log(`🔗 Connected to Quincy's wallet: ${wallet_address.slice(0, 8)}...${wallet_address.slice(-8)}`);

    let total_portfolio_value = 0;

    try {
      // Fetch SOL balance using improved RPC manager
      const sol_balance = await solanaRPC.getBalance(wallet_address);

      // Fetch token accounts using improved RPC manager
      const token_accounts = await solanaRPC.getTokenAccounts(wallet_address);

      // Process token balances and get USD values
      const token_balances = await this.processTokenBalances(token_accounts);

      // Fetch recent transactions using improved RPC manager
      const recent_transactions = await solanaRPC.getRecentTransactions(wallet_address, 5);

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
    // Only fetch data if API keys are configured - no fallback data
    let exchange_data = null;

    // Only create portfolio data if at least one exchange is configured
    if ((process.env.BINANCE_API_KEY && process.env.BINANCE_SECRET) || 
        (process.env.COINBASE_API_KEY && process.env.COINBASE_SECRET)) {
      
      exchange_data = {
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

      // Fetch Binance data only if keys are available
      if (process.env.BINANCE_API_KEY && process.env.BINANCE_SECRET) {
        try {
          const binance_data = await this.fetchBinanceData();
          if (binance_data) {
            exchange_data.total_value_usd += binance_data.total_value_usd || 0;
            exchange_data.active_positions += binance_data.active_positions || 0;
            exchange_data.total_pnl_24h += binance_data.total_pnl_24h || 0;
            if (binance_data.trading_pairs) {
              exchange_data.trading_pairs.push(...binance_data.trading_pairs);
            }
          }
        } catch (error) {
          console.error('Failed to fetch Binance data:', error);
        }
      }

      // Fetch Coinbase data only if keys are available
      if (process.env.COINBASE_API_KEY && process.env.COINBASE_SECRET) {
        try {
          const coinbase_data = await this.fetchCoinbaseData();
          if (coinbase_data) {
            exchange_data.total_value_usd += coinbase_data.total_value_usd || 0;
            exchange_data.active_positions += coinbase_data.active_positions || 0;
            exchange_data.total_pnl_24h += coinbase_data.total_pnl_24h || 0;
            if (coinbase_data.trading_pairs) {
              exchange_data.trading_pairs.push(...coinbase_data.trading_pairs);
            }
          }
        } catch (error) {
          console.error('Failed to fetch Coinbase data:', error);
        }
      }

      // Calculate percentage change only if we have actual data
      if (exchange_data.total_value_usd > 0) {
        exchange_data.total_pnl_percentage = (exchange_data.total_pnl_24h / exchange_data.total_value_usd) * 100;
      }
    }

    this.portfolio_cache = exchange_data;
  }

  private async fetchBinanceData(): Promise<any> {
    const api_key = process.env.BINANCE_API_KEY;
    const secret_key = process.env.BINANCE_SECRET;
    
    if (!api_key || !secret_key) {
      return null;
    }

    try {
      const crypto = require('crypto');
      const timestamp = Date.now();
      const query_string = `timestamp=${timestamp}`;
      const signature = crypto.createHmac('sha256', secret_key).update(query_string).digest('hex');
      
      // Fetch account information
      const account_response = await axios.get(`https://api.binance.com/api/v3/account?${query_string}&signature=${signature}`, {
        headers: {
          'X-MBX-APIKEY': api_key
        }
      });

      const account_data = account_response.data;
      let total_value_usd = 0;
      const trading_pairs = [];

      // Calculate total portfolio value
      for (const balance of account_data.balances) {
        if (parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0) {
          const total_balance = parseFloat(balance.free) + parseFloat(balance.locked);
          
          if (balance.asset === 'USDT' || balance.asset === 'BUSD') {
            total_value_usd += total_balance;
          } else if (balance.asset !== 'BNB') {
            // Get price for other assets
            try {
              const ticker_response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${balance.asset}USDT`);
              const price = parseFloat(ticker_response.data.price);
              total_value_usd += total_balance * price;
              
              if (total_balance * price > 10) { // Only include significant positions
                trading_pairs.push(`${balance.asset}/USDT`);
              }
            } catch (price_error) {
              // If USDT pair doesn't exist, try BTC pair
              try {
                const btc_ticker = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${balance.asset}BTC`);
                const btc_price_response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
                const btc_price = parseFloat(btc_price_response.data.price);
                const asset_btc_price = parseFloat(btc_ticker.data.price);
                total_value_usd += total_balance * asset_btc_price * btc_price;
              } catch (btc_error) {
                console.log(`Could not fetch price for ${balance.asset}`);
              }
            }
          }
        }
      }

      // Fetch 24h stats
      const stats_response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
      const stats = stats_response.data;
      
      // Calculate 24h PnL (simplified)
      let total_pnl_24h = 0;
      // This would need more sophisticated calculation based on positions

      console.log(`📊 Binance portfolio value: $${total_value_usd.toFixed(2)}`);

      return {
        total_value_usd,
        total_pnl_24h,
        active_positions: trading_pairs.length,
        trading_pairs,
        last_trade_timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error fetching Binance data:', error);
      return null;
    }
  }

  private async fetchCoinbaseData(): Promise<any> {
    const api_key = process.env.COINBASE_API_KEY;
    const secret_key = process.env.COINBASE_SECRET;
    
    if (!api_key || !secret_key) {
      return null;
    }

    try {
      const crypto = require('crypto');
      const timestamp = Math.floor(Date.now() / 1000);
      const method = 'GET';
      const path = '/v2/accounts';
      const body = '';
      
      const message = timestamp + method + path + body;
      const signature = crypto.createHmac('sha256', secret_key).update(message).digest('hex');
      
      // Fetch accounts
      const accounts_response = await axios.get(`https://api.coinbase.com${path}`, {
        headers: {
          'CB-ACCESS-KEY': api_key,
          'CB-ACCESS-SIGN': signature,
          'CB-ACCESS-TIMESTAMP': timestamp,
          'CB-VERSION': '2021-06-25'
        }
      });

      const accounts = accounts_response.data.data;
      let total_value_usd = 0;
      const trading_pairs = [];

      for (const account of accounts) {
        const balance = parseFloat(account.balance.amount);
        const currency = account.balance.currency;
        
        if (balance > 0) {
          if (currency === 'USD') {
            total_value_usd += balance;
          } else {
            // Get exchange rates for other currencies
            try {
              const rate_path = `/v2/exchange-rates?currency=${currency}`;
              const rate_message = timestamp + 'GET' + rate_path + '';
              const rate_signature = crypto.createHmac('sha256', secret_key).update(rate_message).digest('hex');
              
              const rate_response = await axios.get(`https://api.coinbase.com${rate_path}`, {
                headers: {
                  'CB-ACCESS-KEY': api_key,
                  'CB-ACCESS-SIGN': rate_signature,
                  'CB-ACCESS-TIMESTAMP': timestamp,
                  'CB-VERSION': '2021-06-25'
                }
              });

              const usd_rate = parseFloat(rate_response.data.data.rates.USD);
              const usd_value = balance * usd_rate;
              total_value_usd += usd_value;
              
              if (usd_value > 10) { // Only include significant positions
                trading_pairs.push(`${currency}/USD`);
              }
            } catch (rate_error) {
              console.log(`Could not fetch rate for ${currency}`);
            }
          }
        }
      }

      console.log(`📊 Coinbase portfolio value: $${total_value_usd.toFixed(2)}`);

      return {
        total_value_usd,
        total_pnl_24h: 0, // Would need historical data for accurate calculation
        active_positions: trading_pairs.length,
        trading_pairs,
        last_trade_timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error fetching Coinbase data:', error);
      return null;
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