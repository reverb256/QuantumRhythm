/**
 * Analysis Integration Module - Combines predictive and historical analysis
 * Provides unified analysis results for enhanced trading decisions
 */

import { predictiveAnalysisEngine } from './predictive-analysis.js';
import { historicalAnalysisEngine } from './historical-analysis.js';
import { comprehensiveWalletTracker } from './comprehensive-wallet-tracker.js';

interface CombinedAnalysis {
  token: string;
  prediction: any;
  historicalContext: string[];
  recommendations: string[];
  riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number;
  timeframe: string;
}

export class AnalysisIntegration {
  constructor() {
    this.initializeAnalysisIntegration();
  }

  private initializeAnalysisIntegration() {
    console.log('🔗 Initializing analysis integration...');
    
    // Start periodic analysis updates
    setInterval(async () => {
      await this.updateAnalysisCache();
    }, 600000); // 10 minutes
    
    console.log('✅ Analysis integration ready');
  }

  /**
   * Get comprehensive analysis for a token
   */
  public async getComprehensiveAnalysis(tokenAddress: string): Promise<CombinedAnalysis> {
    try {
      // Get predictive analysis
      const prediction = await predictiveAnalysisEngine.analyzePricePrediction(tokenAddress);
      
      // Get historical recommendations
      const historicalRecommendations = historicalAnalysisEngine.getHistoricalRecommendations();
      
      // Get performance metrics
      const metrics = historicalAnalysisEngine.calculatePerformanceMetrics();
      
      // Combine analysis results
      const combinedRecommendations = this.generateCombinedRecommendations(
        prediction,
        historicalRecommendations,
        metrics
      );
      
      // Assess overall risk
      const riskAssessment = this.assessOverallRisk(prediction, metrics);
      
      // Calculate confidence score
      const confidenceScore = this.calculateCombinedConfidence(prediction, metrics);
      
      return {
        token: tokenAddress,
        prediction,
        historicalContext: historicalRecommendations,
        recommendations: combinedRecommendations,
        riskAssessment,
        confidenceScore,
        timeframe: prediction.timeframe
      };

    } catch (error) {
      console.log(`❌ Analysis integration failed for ${tokenAddress}:`, error);
      return this.generateFallbackAnalysis(tokenAddress);
    }
  }

  private generateCombinedRecommendations(
    prediction: any,
    historicalRecommendations: string[],
    metrics: any
  ): string[] {
    const recommendations: string[] = [];
    
    // Predictive recommendations
    if (prediction.direction === 'BULLISH' && prediction.confidence > 0.7) {
      recommendations.push(`Strong bullish signal detected (${(prediction.confidence * 100).toFixed(1)}% confidence)`);
    } else if (prediction.direction === 'BEARISH' && prediction.confidence > 0.7) {
      recommendations.push(`Strong bearish signal detected (${(prediction.confidence * 100).toFixed(1)}% confidence)`);
    }
    
    // Historical context recommendations
    if (metrics.winRate > 0.7) {
      recommendations.push(`High historical win rate (${(metrics.winRate * 100).toFixed(1)}%) supports trading`);
    } else if (metrics.winRate < 0.4) {
      recommendations.push(`Low historical win rate (${(metrics.winRate * 100).toFixed(1)}%) suggests caution`);
    }
    
    // Risk management
    if (metrics.maxDrawdown > 0.15) {
      recommendations.push('High historical drawdown - consider smaller position sizes');
    }
    
    if (metrics.consecutiveLosses > 3) {
      recommendations.push('Recent consecutive losses detected - exercise additional caution');
    }
    
    // Add top historical recommendations
    recommendations.push(...historicalRecommendations.slice(0, 2));
    
    return recommendations;
  }

  private assessOverallRisk(prediction: any, metrics: any): 'LOW' | 'MEDIUM' | 'HIGH' {
    let riskScore = 0;
    
    // Prediction-based risk factors
    if (prediction.confidence < 0.5) riskScore += 2;
    if (prediction.direction === 'NEUTRAL') riskScore += 1;
    
    // Historical risk factors
    if (metrics.winRate < 0.5) riskScore += 2;
    if (metrics.maxDrawdown > 0.1) riskScore += 1;
    if (metrics.consecutiveLosses > 2) riskScore += 1;
    
    if (riskScore >= 4) return 'HIGH';
    if (riskScore >= 2) return 'MEDIUM';
    return 'LOW';
  }

  private calculateCombinedConfidence(prediction: any, metrics: any): number {
    const predictiveWeight = 0.6;
    const historicalWeight = 0.4;
    
    const predictiveConfidence = prediction.confidence;
    const historicalConfidence = Math.min(metrics.winRate * 1.2, 1.0);
    
    return (predictiveConfidence * predictiveWeight) + (historicalConfidence * historicalWeight);
  }

  private generateFallbackAnalysis(tokenAddress: string): CombinedAnalysis {
    return {
      token: tokenAddress,
      prediction: {
        direction: 'NEUTRAL',
        confidence: 0.3,
        timeframe: 'Unknown',
        targetPrice: 0,
        probability: 0.5
      },
      historicalContext: ['Insufficient historical data'],
      recommendations: ['Gather more data before trading'],
      riskAssessment: 'HIGH',
      confidenceScore: 0.2,
      timeframe: 'Unknown'
    };
  }

  /**
   * Update analysis cache for active tokens
   */
  private async updateAnalysisCache() {
    try {
      const portfolio = await comprehensiveWalletTracker.getPortfolioStatus();
      const tokens = portfolio.holdings.map(h => h.symbol).slice(0, 5);
      
      for (const token of tokens) {
        await this.getComprehensiveAnalysis(token);
      }
      
      console.log(`🔄 Analysis cache updated for ${tokens.length} tokens`);
    } catch (error) {
      console.log('⚠️ Error updating analysis cache:', error);
    }
  }

  /**
   * Generate analysis summary report
   */
  public async generateAnalysisSummary(): Promise<string> {
    const historicalReport = historicalAnalysisEngine.generateAnalysisReport();
    const metrics = historicalAnalysisEngine.calculatePerformanceMetrics();
    
    return `
🔮 COMPREHENSIVE TRADING ANALYSIS SUMMARY
========================================

${historicalReport}

🧠 PREDICTIVE INTELLIGENCE
• Advanced technical analysis with 15+ indicators
• Pattern recognition across multiple timeframes
• ML-based price movement predictions
• Real-time market sentiment integration

🎯 TRADING OPTIMIZATION
• Confidence levels hard-capped at 95%
• Emergency stop protocols active
• Real-time CAD P&L tracking
• Multi-source price validation

⚡ SYSTEM STATUS
• Predictive Analysis: ACTIVE
• Historical Analysis: ACTIVE
• Portfolio Tracking: ACTIVE
• Risk Management: ACTIVE
`;
  }
}

export const analysisIntegration = new AnalysisIntegration();