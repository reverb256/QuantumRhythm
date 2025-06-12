import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export class PaperTradingLab {
  private connection: Connection;
  private experiments: Array<{
    id: string;
    strategy: string;
    entry: number;
    exit?: number;
    result?: 'win' | 'loss';
    confidence: number;
    timestamp: Date;
  }> = [];

  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );
  }

  async startPaperTradingExperiments() {
    console.log('🧪 Starting paper trading experiments for strategy learning');
    
    // Run experiments every 2 minutes
    setInterval(async () => {
      await this.runTradingExperiment();
    }, 120000);
  }

  async runTradingExperiment() {
    try {
      // Get real market data for experiments
      const solPrice = await this.getAuthenticPrice('solana');
      const rayPrice = await this.getAuthenticPrice('raydium');
      
      // Analyze real market conditions
      const marketConditions = await this.analyzeMarketConditions(solPrice, rayPrice);
      
      // Run paper experiment based on real data
      const experiment = {
        id: `exp_${Date.now()}`,
        strategy: this.selectExperimentStrategy(marketConditions),
        entry: marketConditions.dominant === 'SOL' ? solPrice : rayPrice,
        confidence: marketConditions.confidence,
        timestamp: new Date()
      };
      
      this.experiments.push(experiment);
      
      console.log(`🧪 Paper experiment: ${experiment.strategy} at $${experiment.entry.toFixed(4)} (${experiment.confidence.toFixed(1)}% confidence)`);
      
      // Clean up old experiments (keep last 50)
      if (this.experiments.length > 50) {
        this.experiments = this.experiments.slice(-50);
      }
      
    } catch (error) {
      console.log('Paper trading experiment skipped - waiting for authentic data');
    }
  }

  async analyzeMarketConditions(solPrice: number, rayPrice: number) {
    // Get 24h price changes for real market analysis
    const solData = await this.getPriceChange('solana');
    const rayData = await this.getPriceChange('raydium');
    
    return {
      solPrice,
      rayPrice,
      solChange24h: solData.change24h,
      rayChange24h: rayData.change24h,
      dominant: Math.abs(solData.change24h) > Math.abs(rayData.change24h) ? 'SOL' : 'RAY',
      volatility: Math.max(Math.abs(solData.change24h), Math.abs(rayData.change24h)),
      confidence: this.calculateConfidence(solData.change24h, rayData.change24h)
    };
  }

  selectExperimentStrategy(conditions: any): string {
    if (conditions.volatility > 5) return 'High Volatility Momentum';
    if (conditions.volatility < 1) return 'Low Volatility Range';
    if (conditions.solChange24h > 2) return 'SOL Bullish Trend';
    if (conditions.rayChange24h > 3) return 'RAY Momentum Play';
    return 'Neutral Market Analysis';
  }

  calculateConfidence(solChange: number, rayChange: number): number {
    const avgVolatility = (Math.abs(solChange) + Math.abs(rayChange)) / 2;
    return Math.min(95, 40 + (avgVolatility * 8));
  }

  async getAuthenticPrice(coinId: string): Promise<number> {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
    if (!response.ok) throw new Error('Price API failed');
    
    const data = await response.json();
    const price = data[coinId]?.usd;
    
    if (!price) throw new Error('No authentic price data available');
    return price;
  }

  async getPriceChange(coinId: string) {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`);
    if (!response.ok) throw new Error('Price change API failed');
    
    const data = await response.json();
    return {
      price: data[coinId]?.usd || 0,
      change24h: data[coinId]?.usd_24h_change || 0
    };
  }

  getExperimentStats() {
    if (this.experiments.length === 0) return null;
    
    const avgConfidence = this.experiments.reduce((sum, exp) => sum + exp.confidence, 0) / this.experiments.length;
    const strategies = [...new Set(this.experiments.map(exp => exp.strategy))];
    
    return {
      totalExperiments: this.experiments.length,
      averageConfidence: avgConfidence,
      strategiesTested: strategies.length,
      recentExperiments: this.experiments.slice(-5).map(exp => ({
        strategy: exp.strategy,
        confidence: exp.confidence,
        timestamp: exp.timestamp
      }))
    };
  }
}

export const paperTradingLab = new PaperTradingLab();