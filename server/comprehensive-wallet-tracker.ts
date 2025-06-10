/**
 * Comprehensive Wallet Tracker - Real-time token tracking with CAD P&L
 * Tracks all tokens, calculates P&L, and provides CAD valuations
 */

interface TokenHolding {
  symbol: string;
  address: string;
  balance: number;
  cadValue: number;
  priceCad: number;
  change24h: number;
  lastUpdate: number;
}

interface TradeRecord {
  timestamp: number;
  action: 'BUY' | 'SELL';
  token: string;
  amount: number;
  priceCad: number;
  gasFee: number;
  totalCad: number;
}

interface PortfolioMetrics {
  totalValueCad: number;
  totalPnlCad: number;
  dayPnlCad: number;
  totalGasFees: number;
  winRate: number;
  totalTrades: number;
  profitableTrades: number;
  largestWin: number;
  largestLoss: number;
  sharpeRatio: number;
}

export class ComprehensiveWalletTracker {
  private holdings: Map<string, TokenHolding> = new Map();
  private tradeHistory: TradeRecord[] = [];
  private initialPortfolioValue = 0;
  private lastUpdateTime = 0;
  private priceCache: Map<string, { price: number; timestamp: number }> = new Map();

  constructor(private walletAddress: string) {
    this.initializeTracker();
  }

  private async initializeTracker() {
    console.log(`📊 Initializing comprehensive wallet tracker for ${this.walletAddress.substring(0, 8)}...`);
    
    // Set initial portfolio value in CAD
    this.initialPortfolioValue = await this.calculateTotalValueCad();
    
    // Start real-time tracking
    this.startRealTimeTracking();
    
    console.log(`✅ Wallet tracker initialized - Starting value: $${this.initialPortfolioValue.toFixed(2)} CAD`);
  }

  private startRealTimeTracking() {
    // Update every 30 seconds
    setInterval(async () => {
      await this.updateAllHoldings();
      await this.calculatePnL();
    }, 30000);

    // Log portfolio summary every 5 minutes
    setInterval(() => {
      this.logPortfolioSummary();
    }, 300000);
  }

  /**
   * Update all token holdings with current balances and prices
   */
  public async updateAllHoldings() {
    try {
      const tokens = await this.getAllWalletTokens();
      
      for (const token of tokens) {
        const priceData = await this.getTokenPriceCad(token.symbol);
        
        const holding: TokenHolding = {
          symbol: token.symbol,
          address: token.address,
          balance: token.balance,
          cadValue: token.balance * priceData.price,
          priceCad: priceData.price,
          change24h: priceData.change24h || 0,
          lastUpdate: Date.now()
        };

        this.holdings.set(token.symbol, holding);
      }

      this.lastUpdateTime = Date.now();
      
    } catch (error) {
      console.log('⚠️ Error updating holdings:', error);
    }
  }

  /**
   * Get all tokens in wallet (SOL, SPL tokens, etc.)
   */
  private async getAllWalletTokens() {
    const tokens = [
      { symbol: 'SOL', address: 'So11111111111111111111111111111111111111112', balance: 0.288736 }
    ];

    // Add logic to fetch SPL tokens from wallet
    // This would use Solana RPC calls to get all token accounts
    
    return tokens;
  }

  /**
   * Get real-time CAD price for any token
   */
  private async getTokenPriceCad(symbol: string): Promise<{ price: number; change24h: number }> {
    const cached = this.priceCache.get(symbol);
    const now = Date.now();
    
    // Use cache if less than 1 minute old
    if (cached && (now - cached.timestamp) < 60000) {
      return { price: cached.price, change24h: 0 };
    }

    try {
      // Use multiple price sources for accuracy
      const price = await this.fetchPriceFromSources(symbol);
      
      this.priceCache.set(symbol, { price, timestamp: now });
      
      return { price, change24h: 0 };
      
    } catch (error) {
      console.log(`⚠️ Error fetching price for ${symbol}:`, error);
      return { price: 0, change24h: 0 };
    }
  }

  private async fetchPriceFromSources(symbol: string): Promise<number> {
    const sources = [
      () => this.fetchFromCoinGecko(symbol),
      () => this.fetchFromJupiter(symbol),
      () => this.fetchFromDexScreener(symbol)
    ];

    for (const source of sources) {
      try {
        const price = await source();
        if (price > 0) return price;
      } catch (error) {
        continue;
      }
    }

    return 0;
  }

  private async fetchFromCoinGecko(symbol: string): Promise<number> {
    const coinMap: Record<string, string> = {
      'SOL': 'solana',
      'USDC': 'usd-coin',
      'USDT': 'tether'
    };

    const coinId = coinMap[symbol];
    if (!coinId) return 0;

    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=cad`);
    const data = await response.json();
    
    return data[coinId]?.cad || 0;
  }

  private async fetchFromJupiter(symbol: string): Promise<number> {
    try {
      const response = await fetch(`https://price.jup.ag/v4/price?ids=${symbol}`);
      const data = await response.json();
      
      return data.data?.[symbol]?.price || 0;
    } catch {
      return 0;
    }
  }

  private async fetchFromDexScreener(symbol: string): Promise<number> {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${symbol}`);
      const data = await response.json();
      
      return parseFloat(data.pairs?.[0]?.priceUsd) || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Record a new trade
   */
  public recordTrade(action: 'BUY' | 'SELL', token: string, amount: number, priceCad: number, gasFee: number) {
    const trade: TradeRecord = {
      timestamp: Date.now(),
      action,
      token,
      amount,
      priceCad,
      gasFee,
      totalCad: amount * priceCad
    };

    this.tradeHistory.push(trade);
    
    console.log(`📈 Trade recorded: ${action} ${amount.toFixed(6)} ${token} at $${priceCad.toFixed(4)} CAD (Gas: $${(gasFee * priceCad).toFixed(4)} CAD)`);
    
    // Update holdings after trade
    this.updateHoldingAfterTrade(trade);
  }

  private updateHoldingAfterTrade(trade: TradeRecord) {
    const holding = this.holdings.get(trade.token);
    
    if (holding) {
      if (trade.action === 'BUY') {
        holding.balance += trade.amount;
      } else {
        holding.balance -= trade.amount;
      }
      
      holding.cadValue = holding.balance * holding.priceCad;
      holding.lastUpdate = Date.now();
      
      this.holdings.set(trade.token, holding);
    }
  }

  /**
   * Calculate comprehensive P&L metrics
   */
  public async calculatePnL(): Promise<PortfolioMetrics> {
    const currentValueUsd = await this.calculateTotalValueUsd();
    const totalPnlUsd = currentValueUsd - this.initialPortfolioValue;
    
    const dayStart = Date.now() - (24 * 60 * 60 * 1000);
    const dayTrades = this.tradeHistory.filter(t => t.timestamp >= dayStart);
    const dayPnlUsd = dayTrades.reduce((sum, trade) => {
      return sum + (trade.action === 'SELL' ? trade.totalUsd : -trade.totalUsd);
    }, 0);

    const totalGasFees = this.tradeHistory.reduce((sum, trade) => sum + trade.gasFee, 0);
    const profitableTrades = this.tradeHistory.filter(trade => {
      // Simplified profitability check
      return trade.action === 'SELL' && trade.totalUsd > 0;
    }).length;

    const winRate = this.tradeHistory.length > 0 ? (profitableTrades / this.tradeHistory.length) * 100 : 0;

    const metrics: PortfolioMetrics = {
      totalValueUsd: currentValueUsd,
      totalPnlUsd,
      dayPnlUsd,
      totalGasFees,
      winRate,
      totalTrades: this.tradeHistory.length,
      profitableTrades,
      largestWin: Math.max(...this.tradeHistory.map(t => t.totalUsd), 0),
      largestLoss: Math.min(...this.tradeHistory.map(t => -t.totalUsd), 0),
      sharpeRatio: this.calculateSharpeRatio()
    };

    return metrics;
  }

  private calculateSharpeRatio(): number {
    if (this.tradeHistory.length < 2) return 0;
    
    const returns = this.tradeHistory.map(trade => 
      trade.action === 'SELL' ? trade.totalUsd / this.initialPortfolioValue : 0
    );
    
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev > 0 ? avgReturn / stdDev : 0;
  }

  private async calculateTotalValueUsd(): Promise<number> {
    let total = 0;
    
    for (const holding of this.holdings.values()) {
      total += holding.usdValue;
    }
    
    return total;
  }

  /**
   * Get current portfolio status
   */
  public async getPortfolioStatus() {
    const metrics = await this.calculatePnL();
    const holdings = Array.from(this.holdings.values());
    
    return {
      metrics,
      holdings,
      lastUpdate: this.lastUpdateTime,
      tradeCount: this.tradeHistory.length
    };
  }

  /**
   * Log comprehensive portfolio summary
   */
  public async logPortfolioSummary() {
    const metrics = await this.calculatePnL();
    
    console.log('\n💼 COMPREHENSIVE PORTFOLIO SUMMARY');
    console.log('=====================================');
    console.log(`💰 Total Value: $${metrics.totalValueUsd.toFixed(2)}`);
    console.log(`📈 Total P&L: ${metrics.totalPnlUsd >= 0 ? '+' : ''}$${metrics.totalPnlUsd.toFixed(2)} (${((metrics.totalPnlUsd / this.initialPortfolioValue) * 100).toFixed(2)}%)`);
    console.log(`📊 24h P&L: ${metrics.dayPnlUsd >= 0 ? '+' : ''}$${metrics.dayPnlUsd.toFixed(2)}`);
    console.log(`⛽ Total Gas Fees: $${(metrics.totalGasFees * 200).toFixed(2)}`); // Assuming SOL price ~$200
    console.log(`🎯 Win Rate: ${metrics.winRate.toFixed(1)}% (${metrics.profitableTrades}/${metrics.totalTrades})`);
    console.log(`📊 Sharpe Ratio: ${metrics.sharpeRatio.toFixed(3)}`);
    
    console.log('\n🪙 TOKEN HOLDINGS:');
    for (const holding of this.holdings.values()) {
      const changeIcon = holding.change24h >= 0 ? '📈' : '📉';
      console.log(`${changeIcon} ${holding.symbol}: ${holding.balance.toFixed(6)} ($${holding.usdValue.toFixed(2)})`);
    }
    console.log('=====================================\n');
  }

  /**
   * Get real-time metrics for display
   */
  public async getRealTimeMetrics() {
    return await this.calculatePnL();
  }
}

export const comprehensiveWalletTracker = new ComprehensiveWalletTracker('4jTtAYiHP3tHqXcmi5T1riS1AcGmxNNhLZTw65vrKpkA');