/**
 * Portfolio Display - Real-time CAD P&L dashboard
 * Provides continuous financial metrics and token tracking
 */

import { comprehensiveWalletTracker } from './comprehensive-wallet-tracker.js';

export class PortfolioDisplay {
  private displayInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startRealTimeDisplay();
  }

  private startRealTimeDisplay() {
    // Display portfolio metrics every 2 minutes
    this.displayInterval = setInterval(async () => {
      await this.displayPortfolioMetrics();
    }, 120000);

    // Initial display
    setTimeout(async () => {
      await this.displayPortfolioMetrics();
    }, 5000);
  }

  private async displayPortfolioMetrics() {
    try {
      const portfolio = await comprehensiveWalletTracker.getPortfolioStatus();
      const metrics = portfolio.metrics;

      console.log('\n💼 REAL-TIME CAD PORTFOLIO METRICS');
      console.log('═══════════════════════════════════════');
      console.log(`💰 Total Portfolio Value: $${metrics.totalValueCad.toFixed(2)} CAD`);
      
      const pnlIcon = metrics.totalPnlCad >= 0 ? '📈' : '📉';
      const pnlPercentage = ((metrics.totalPnlCad / (metrics.totalValueCad - metrics.totalPnlCad)) * 100).toFixed(2);
      console.log(`${pnlIcon} Total P&L: ${metrics.totalPnlCad >= 0 ? '+' : ''}$${metrics.totalPnlCad.toFixed(2)} CAD (${pnlPercentage}%)`);
      
      const dayPnlIcon = metrics.dayPnlCad >= 0 ? '🟢' : '🔴';
      console.log(`${dayPnlIcon} 24h P&L: ${metrics.dayPnlCad >= 0 ? '+' : ''}$${metrics.dayPnlCad.toFixed(2)} CAD`);
      
      console.log(`⛽ Total Gas Fees: $${(metrics.totalGasFees * 270).toFixed(2)} CAD`);
      console.log(`🎯 Win Rate: ${metrics.winRate.toFixed(1)}% (${metrics.profitableTrades}/${metrics.totalTrades} trades)`);
      
      if (metrics.totalTrades > 0) {
        console.log(`🏆 Largest Win: $${metrics.largestWin.toFixed(2)} CAD`);
        console.log(`📉 Largest Loss: $${Math.abs(metrics.largestLoss).toFixed(2)} CAD`);
        console.log(`📊 Sharpe Ratio: ${metrics.sharpeRatio.toFixed(3)}`);
      }

      console.log('\n🪙 TOKEN HOLDINGS:');
      for (const holding of portfolio.holdings) {
        const changeIcon = holding.change24h >= 0 ? '📈' : '📉';
        const percentChange = holding.change24h.toFixed(2);
        console.log(`${changeIcon} ${holding.symbol}: ${holding.balance.toFixed(6)} ($${holding.cadValue.toFixed(2)} CAD) [${percentChange}%]`);
      }
      
      console.log(`\n🕐 Last Updated: ${new Date(portfolio.lastUpdate).toLocaleTimeString()}`);
      console.log('═══════════════════════════════════════\n');

    } catch (error) {
      console.log('⚠️ Error displaying portfolio metrics:', error);
    }
  }

  public async getQuickSummary() {
    const portfolio = await comprehensiveWalletTracker.getPortfolioStatus();
    const metrics = portfolio.metrics;
    
    return {
      totalValueCad: metrics.totalValueCad,
      totalPnlCad: metrics.totalPnlCad,
      dayPnlCad: metrics.dayPnlCad,
      winRate: metrics.winRate,
      totalTrades: metrics.totalTrades,
      holdings: portfolio.holdings.length
    };
  }

  public stopDisplay() {
    if (this.displayInterval) {
      clearInterval(this.displayInterval);
      this.displayInterval = null;
    }
  }
}

export const portfolioDisplay = new PortfolioDisplay();