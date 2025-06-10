/**
 * IO Intelligence Capabilities Maximizer
 * Extracts maximum value from IO Intelligence's 33 specialized models
 */

import { ModelCategories, ModelQuotas } from '../shared/io-intelligence.js';

interface IOIntelligenceCapability {
  category: string;
  models: string[];
  tradingApplications: string[];
  multiModalFeatures?: string[];
  contextLength?: number;
  specializations: string[];
}

export class IOIntelligenceMaximizer {
  private capabilities: Map<string, IOIntelligenceCapability> = new Map();

  constructor() {
    this.initializeCapabilities();
  }

  private initializeCapabilities() {
    // Reasoning Models - Critical for Trading Logic
    this.capabilities.set('reasoning', {
      category: 'reasoning',
      models: ModelCategories.reasoning,
      tradingApplications: [
        'Complex market pattern analysis',
        'Multi-step trading strategy reasoning',
        'Risk assessment with chain-of-thought',
        'Portfolio rebalancing logic',
        'Market regime change detection',
        'Correlation analysis across assets',
        'Options strategy optimization'
      ],
      contextLength: 128000,
      specializations: [
        'DeepSeek-R1: Advanced reasoning for complex trading scenarios',
        'QwQ-32B: Mathematical reasoning for quantitative analysis',
        'Confucius-o1: Strategic decision making'
      ]
    });

    // Coding Models - For Strategy Development
    this.capabilities.set('coding', {
      category: 'coding',
      models: ModelCategories.coding,
      tradingApplications: [
        'Automated trading strategy generation',
        'Risk management code optimization',
        'Smart contract interaction logic',
        'API integration for data feeds',
        'Performance optimization algorithms',
        'Backtesting framework development'
      ],
      contextLength: 128000,
      specializations: [
        'Qwen2.5-Coder: Specialized trading algorithm development',
        'DeepSeek-R1-Distill: Efficient strategy coding',
        'Llama-3.3: General trading system development'
      ]
    });

    // Multi-Modal Models - For Visual Market Analysis
    this.capabilities.set('multimodal', {
      category: 'multimodal',
      models: ModelCategories.multimodal,
      tradingApplications: [
        'Chart pattern recognition and analysis',
        'Technical indicator visualization interpretation',
        'Market sentiment from social media images',
        'Document analysis (earnings reports, SEC filings)',
        'Screenshot analysis of trading platforms',
        'Visual confirmation of trade setups'
      ],
      multiModalFeatures: [
        'Chart pattern recognition (head & shoulders, triangles, flags)',
        'Support/resistance level identification from charts',
        'Volume profile analysis from visual data',
        'Social sentiment from meme/image analysis',
        'Technical indicator crossover detection',
        'Market structure analysis from price charts'
      ],
      contextLength: 16000,
      specializations: [
        'Llama-3.2-90B-Vision: Advanced chart analysis',
        'Qwen2-VL: Efficient visual market data processing'
      ]
    });

    // Math Models - For Quantitative Analysis
    this.capabilities.set('math', {
      category: 'math',
      models: ModelCategories.math,
      tradingApplications: [
        'Options pricing calculations',
        'Statistical arbitrage modeling',
        'Risk metrics computation (VaR, Sharpe ratio)',
        'Correlation matrix analysis',
        'Monte Carlo simulations',
        'Portfolio optimization mathematics',
        'Greeks calculation for options'
      ],
      contextLength: 16000,
      specializations: [
        'AceMath-7B: Specialized financial mathematics',
        'phi-4: Efficient quantitative calculations'
      ]
    });

    // Long Context Models - For Historical Analysis
    this.capabilities.set('long_context', {
      category: 'long_context',
      models: ModelCategories.long_context,
      tradingApplications: [
        'Historical market data analysis (years of data)',
        'Long-term trend identification',
        'Seasonal pattern detection',
        'Economic cycle analysis',
        'Multi-timeframe correlation studies',
        'Historical volatility modeling',
        'Long-term backtesting analysis'
      ],
      contextLength: 512000,
      specializations: [
        'ReaderLM-v2: 512k context for extensive historical analysis',
        'Llama-4-Maverick: 430k context for comprehensive market studies'
      ]
    });

    // Efficient Models - For Real-Time Processing
    this.capabilities.set('efficient', {
      category: 'efficient',
      models: ModelCategories.efficient,
      tradingApplications: [
        'Real-time market monitoring',
        'High-frequency decision making',
        'Quick sentiment analysis',
        'Rapid news impact assessment',
        'Fast trade signal generation',
        'Real-time risk monitoring'
      ],
      contextLength: 8000,
      specializations: [
        'Phi-3.5-mini: Ultra-fast trading decisions',
        'Qwen2.5-1.5B: Efficient real-time processing',
        'MiniCPM3-4B: Balanced speed and accuracy'
      ]
    });
  }

  // Get optimal model for specific trading task
  getOptimalModelForTask(task: string, priority: 'speed' | 'accuracy' | 'context' = 'accuracy'): string {
    const taskMappings = {
      'chart_analysis': 'multimodal',
      'options_pricing': 'math',
      'strategy_development': 'coding',
      'market_reasoning': 'reasoning',
      'historical_analysis': 'long_context',
      'real_time_monitoring': 'efficient',
      'pattern_recognition': 'multimodal',
      'risk_calculation': 'math',
      'trend_analysis': 'reasoning',
      'news_analysis': 'efficient'
    };

    const category = taskMappings[task] || 'reasoning';
    const capability = this.capabilities.get(category);
    
    if (!capability) return ModelCategories.reasoning[0];

    // Select best model based on priority
    switch (priority) {
      case 'speed':
        return capability.models[capability.models.length - 1]; // Usually smaller/faster models
      case 'context':
        return capability.models.find(model => 
          ModelQuotas[model]?.context > 100000
        ) || capability.models[0];
      case 'accuracy':
      default:
        return capability.models[0]; // Usually the most capable model
    }
  }

  // Get all multi-modal capabilities for trader enhancement
  getMultiModalCapabilities(): string[] {
    const multiModal = this.capabilities.get('multimodal');
    return multiModal?.multiModalFeatures || [];
  }

  // Generate trading-specific prompts for each capability
  generateTradingPrompts(): Record<string, string> {
    return {
      reasoning: `Analyze the current market conditions using multi-step reasoning. Consider:
1. Technical indicators and their convergence
2. Market sentiment and news impact
3. Risk factors and probability assessments
4. Historical pattern matching
Provide a structured analysis with confidence levels for each conclusion.`,

      multimodal: `Analyze this trading chart/image and identify:
1. Chart patterns (triangles, head & shoulders, flags)
2. Support and resistance levels
3. Volume patterns and anomalies
4. Technical indicator signals
5. Market structure and trend direction
Provide specific entry/exit points with risk levels.`,

      math: `Calculate the following trading metrics:
1. Options Greeks (Delta, Gamma, Theta, Vega)
2. Risk metrics (VaR, Sharpe ratio, max drawdown)
3. Portfolio correlation matrix
4. Optimal position sizing using Kelly criterion
5. Statistical significance of trading signals
Show all calculations with step-by-step workings.`,

      coding: `Generate optimized trading code for:
1. Strategy implementation with proper risk management
2. Real-time data processing and signal generation
3. Order execution with slippage protection
4. Performance tracking and analytics
5. Error handling and fail-safes
Code should be production-ready with proper documentation.`,

      long_context: `Analyze extensive historical market data to identify:
1. Long-term cycles and seasonal patterns
2. Market regime changes and their triggers
3. Correlation breakdowns during crisis periods
4. Multi-year trend reversals and confirmations
5. Economic indicator relationships over time
Provide actionable insights for current market positioning.`,

      efficient: `Provide rapid market analysis for real-time trading:
1. Immediate sentiment assessment
2. Quick technical level identification
3. Fast news impact evaluation
4. Rapid risk assessment
5. Real-time trade signal generation
Focus on speed while maintaining accuracy for time-sensitive decisions.`
    };
  }

  // Get comprehensive capability summary
  getCapabilitySummary(): Record<string, any> {
    const summary = {};
    
    for (const [category, capability] of this.capabilities.entries()) {
      summary[category] = {
        models: capability.models.length,
        primaryModel: capability.models[0],
        contextLength: capability.contextLength,
        tradingApplications: capability.tradingApplications.length,
        keyStrengths: capability.specializations
      };
    }
    
    return summary;
  }

  // Get model selection strategy for different market conditions
  getMarketConditionStrategy(): Record<string, string> {
    return {
      'high_volatility': this.getOptimalModelForTask('real_time_monitoring', 'speed'),
      'trend_following': this.getOptimalModelForTask('trend_analysis', 'accuracy'),
      'range_bound': this.getOptimalModelForTask('pattern_recognition', 'accuracy'),
      'news_driven': this.getOptimalModelForTask('news_analysis', 'speed'),
      'options_heavy': this.getOptimalModelForTask('options_pricing', 'accuracy'),
      'backtesting': this.getOptimalModelForTask('historical_analysis', 'context'),
      'strategy_dev': this.getOptimalModelForTask('strategy_development', 'accuracy')
    };
  }
}

export const ioIntelligenceMaximizer = new IOIntelligenceMaximizer();