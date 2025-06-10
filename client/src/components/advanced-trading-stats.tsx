import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface PerformanceMetrics {
  totalTrades: number;
  winRate: number;
  avgProfitPerTrade: number;
  totalPnL: number;
  sharpeRatio: number;
  maxDrawdown: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  avgHoldTime: number;
  profitFactor: number;
  recoveryFactor: number;
  calmarRatio: number;
  sortinRatio: number;
  informationRatio: number;
}

interface MarketInsights {
  volatilityIndex: number;
  marketRegime: 'bull' | 'bear' | 'sideways' | 'volatile';
  correlationMatrix: Record<string, number>;
  volumeProfile: Array<{ price: number; volume: number }>;
  supportResistance: { support: number[]; resistance: number[] };
  sentimentScore: number;
  fearGreedIndex: number;
  technicalIndicators: {
    rsi: number;
    macd: { signal: number; histogram: number };
    bollinger: { upper: number; lower: number; middle: number };
    stochastic: number;
    williams: number;
  };
}

interface RiskMetrics {
  var95: number;
  var99: number;
  expectedShortfall: number;
  betaToMarket: number;
  trackingError: number;
  informationRatio: number;
  treynorRatio: number;
  jensenAlpha: number;
  downside_deviation: number;
  upside_potential: number;
}

interface TradingPatterns {
  timeOfDayPerformance: Array<{ hour: number; pnl: number; trades: number }>;
  dayOfWeekPerformance: Array<{ day: string; pnl: number; winRate: number }>;
  tokenTypePerformance: Array<{ type: string; pnl: number; volume: number }>;
  strategyBreakdown: Array<{ strategy: string; trades: number; pnl: number; winRate: number }>;
  holdTimeDistribution: Array<{ duration: string; count: number; avgPnl: number }>;
}

interface AIBehaviorAnalysis {
  confidenceDistribution: Array<{ range: string; trades: number; avgPnl: number }>;
  decisionLatency: Array<{ timestamp: number; latency: number; complexity: number }>;
  learningProgress: Array<{ epoch: number; accuracy: number; loss: number }>;
  emotionalState: {
    current: string;
    history: Array<{ timestamp: number; state: string; trigger: string }>;
  };
  adaptationMetrics: {
    strategiesGenerated: number;
    successfulAdaptations: number;
    failedAttempts: number;
    learningVelocity: number;
  };
}

const AdvancedTradingStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'performance' | 'market' | 'risk' | 'patterns' | 'ai'>('performance');
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d' | 'all'>('24h');

  const { data: performanceMetrics } = useQuery<PerformanceMetrics>({
    queryKey: ['/api/performance-metrics', timeframe],
    refetchInterval: 5000
  });

  const { data: marketInsights } = useQuery<MarketInsights>({
    queryKey: ['/api/market-insights'],
    refetchInterval: 3000
  });

  const { data: riskMetrics } = useQuery<RiskMetrics>({
    queryKey: ['/api/risk-metrics', timeframe],
    refetchInterval: 10000
  });

  const { data: tradingPatterns } = useQuery<TradingPatterns>({
    queryKey: ['/api/trading-patterns', timeframe],
    refetchInterval: 15000
  });

  const { data: aiBehavior } = useQuery<AIBehaviorAnalysis>({
    queryKey: ['/api/ai-behavior'],
    refetchInterval: 2000
  });

  const { data: realtimePnL } = useQuery({
    queryKey: ['/api/realtime-pnl'],
    refetchInterval: 1000
  });

  const formatNumber = (num: number, decimals = 4) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(decimals);
  };

  const formatPercentage = (num: number) => `${(num * 100).toFixed(2)}%`;

  const getColorForValue = (value: number, threshold = 0) => {
    return value >= threshold ? 'text-green-400' : 'text-red-400';
  };

  const tabs = [
    { id: 'performance', label: '📊 PERFORMANCE', icon: '📊' },
    { id: 'market', label: '🔍 MARKET', icon: '🔍' },
    { id: 'risk', label: '⚠️ RISK', icon: '⚠️' },
    { id: 'patterns', label: '📈 PATTERNS', icon: '📈' },
    { id: 'ai', label: '🤖 AI BEHAVIOR', icon: '🤖' }
  ];

  const timeframes = [
    { id: '1h', label: '1H' },
    { id: '24h', label: '24H' },
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' },
    { id: 'all', label: 'ALL' }
  ];

  return (
    <div className="bg-black border border-green-400 rounded-lg p-6 space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-green-400 font-mono">
          ⚡ QUANTUM ANALYTICS MATRIX ⚡
        </h2>
        
        <div className="flex gap-2">
          {timeframes.map(tf => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id as any)}
              className={`px-3 py-1 text-xs font-mono rounded ${
                timeframe === tf.id
                  ? 'bg-green-400 text-black'
                  : 'bg-black text-green-400 border border-green-400'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time PnL Ticker */}
      <div className="bg-gray-900 border border-green-400 rounded p-4">
        <div className="flex justify-between items-center">
          <span className="text-green-400 font-mono text-sm">REAL-TIME P&L:</span>
          <span className={`font-mono text-lg ${getColorForValue((realtimePnL as any)?.total || 0)}`}>
            {realtimePnL ? `${formatNumber((realtimePnL as any).total)} SOL` : 'Loading...'}
          </span>
        </div>
        <div className="text-xs text-green-400 mt-1 opacity-70">
          Last Trade: {(realtimePnL as any)?.lastTrade ? new Date((realtimePnL as any).lastTrade).toLocaleTimeString() : 'N/A'}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-green-400">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-mono rounded-t border-l border-r border-t border-green-400 ${
              activeTab === tab.id
                ? 'bg-green-400 text-black'
                : 'bg-black text-green-400 hover:bg-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Key Performance Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">WIN RATE</div>
                <div className={`text-2xl font-bold ${getColorForValue(performanceMetrics?.winRate || 0, 0.5)}`}>
                  {formatPercentage(performanceMetrics?.winRate || 0)}
                </div>
                <div className="text-xs text-gray-400">
                  {performanceMetrics?.totalTrades || 0} trades
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">SHARPE RATIO</div>
                <div className={`text-2xl font-bold ${getColorForValue(performanceMetrics?.sharpeRatio || 0, 1)}`}>
                  {(performanceMetrics?.sharpeRatio || 0).toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">Risk-adjusted return</div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">MAX DRAWDOWN</div>
                <div className="text-2xl font-bold text-red-400">
                  {formatPercentage(performanceMetrics?.maxDrawdown || 0)}
                </div>
                <div className="text-xs text-gray-400">Peak to trough</div>
              </div>
            </div>

            {/* Additional Performance Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-green-400 rounded p-3">
                <div className="text-green-400 text-xs font-mono">AVG PROFIT/TRADE</div>
                <div className={`text-lg font-bold ${getColorForValue(performanceMetrics?.avgProfitPerTrade || 0)}`}>
                  {formatNumber(performanceMetrics?.avgProfitPerTrade || 0)} SOL
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-3">
                <div className="text-green-400 text-xs font-mono">PROFIT FACTOR</div>
                <div className={`text-lg font-bold ${getColorForValue(performanceMetrics?.profitFactor || 0, 1)}`}>
                  {(performanceMetrics?.profitFactor || 0).toFixed(2)}
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-3">
                <div className="text-green-400 text-xs font-mono">RECOVERY FACTOR</div>
                <div className={`text-lg font-bold ${getColorForValue(performanceMetrics?.recoveryFactor || 0, 1)}`}>
                  {(performanceMetrics?.recoveryFactor || 0).toFixed(2)}
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-3">
                <div className="text-green-400 text-xs font-mono">AVG HOLD TIME</div>
                <div className="text-lg font-bold text-blue-400">
                  {Math.round(performanceMetrics?.avgHoldTime || 0)}m
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-gray-900 border border-green-400 rounded p-4">
              <h3 className="text-green-400 font-mono mb-4">CUMULATIVE P&L</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={(realtimePnL as any)?.history || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22c55e40" />
                  <XAxis dataKey="timestamp" stroke="#22c55e" />
                  <YAxis stroke="#22c55e" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #22c55e',
                      color: '#22c55e'
                    }} 
                  />
                  <Area type="monotone" dataKey="pnl" stroke="#22c55e" fill="#22c55e20" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'market' && marketInsights && (
          <div className="space-y-6">
            {/* Market Overview */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">MARKET REGIME</div>
                <div className={`text-lg font-bold ${
                  marketInsights.marketRegime === 'bull' ? 'text-green-400' :
                  marketInsights.marketRegime === 'bear' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {marketInsights.marketRegime.toUpperCase()}
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">VOLATILITY</div>
                <div className="text-lg font-bold text-orange-400">
                  {formatPercentage(marketInsights.volatilityIndex)}
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">SENTIMENT</div>
                <div className={`text-lg font-bold ${getColorForValue(marketInsights.sentimentScore, 0.5)}`}>
                  {(marketInsights.sentimentScore * 100).toFixed(0)}/100
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">FEAR & GREED</div>
                <div className={`text-lg font-bold ${
                  marketInsights.fearGreedIndex > 70 ? 'text-red-400' :
                  marketInsights.fearGreedIndex < 30 ? 'text-green-400' :
                  'text-yellow-400'
                }`}>
                  {marketInsights.fearGreedIndex}
                </div>
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="bg-gray-900 border border-green-400 rounded p-4">
              <h3 className="text-green-400 font-mono mb-4">TECHNICAL INDICATORS</h3>
              <div className="grid grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-green-400 text-xs font-mono">RSI</div>
                  <div className={`text-lg font-bold ${
                    marketInsights.technicalIndicators.rsi > 70 ? 'text-red-400' :
                    marketInsights.technicalIndicators.rsi < 30 ? 'text-green-400' :
                    'text-yellow-400'
                  }`}>
                    {marketInsights.technicalIndicators.rsi.toFixed(1)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-green-400 text-xs font-mono">MACD</div>
                  <div className={`text-lg font-bold ${getColorForValue(marketInsights.technicalIndicators.macd.signal)}`}>
                    {marketInsights.technicalIndicators.macd.signal.toFixed(3)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-green-400 text-xs font-mono">STOCHASTIC</div>
                  <div className={`text-lg font-bold ${
                    marketInsights.technicalIndicators.stochastic > 80 ? 'text-red-400' :
                    marketInsights.technicalIndicators.stochastic < 20 ? 'text-green-400' :
                    'text-yellow-400'
                  }`}>
                    {marketInsights.technicalIndicators.stochastic.toFixed(1)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-green-400 text-xs font-mono">WILLIAMS %R</div>
                  <div className={`text-lg font-bold ${
                    marketInsights.technicalIndicators.williams > -20 ? 'text-red-400' :
                    marketInsights.technicalIndicators.williams < -80 ? 'text-green-400' :
                    'text-yellow-400'
                  }`}>
                    {marketInsights.technicalIndicators.williams.toFixed(1)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-green-400 text-xs font-mono">BOLLINGER</div>
                  <div className="text-sm text-blue-400">
                    <div>U: {formatNumber(marketInsights.technicalIndicators.bollinger.upper)}</div>
                    <div>M: {formatNumber(marketInsights.technicalIndicators.bollinger.middle)}</div>
                    <div>L: {formatNumber(marketInsights.technicalIndicators.bollinger.lower)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Volume Profile */}
            <div className="bg-gray-900 border border-green-400 rounded p-4">
              <h3 className="text-green-400 font-mono mb-4">VOLUME PROFILE</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={marketInsights.volumeProfile}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22c55e40" />
                  <XAxis type="number" dataKey="volume" stroke="#22c55e" />
                  <YAxis type="category" dataKey="price" stroke="#22c55e" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #22c55e',
                      color: '#22c55e'
                    }} 
                  />
                  <Bar dataKey="volume" fill="#22c55e60" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'risk' && riskMetrics && (
          <div className="space-y-6">
            {/* Risk Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">VALUE AT RISK (95%)</div>
                <div className="text-2xl font-bold text-red-400">
                  {formatNumber(riskMetrics.var95)} SOL
                </div>
                <div className="text-xs text-gray-400">Daily VaR</div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">EXPECTED SHORTFALL</div>
                <div className="text-2xl font-bold text-red-400">
                  {formatNumber(riskMetrics.expectedShortfall)} SOL
                </div>
                <div className="text-xs text-gray-400">CVaR (99%)</div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">BETA TO MARKET</div>
                <div className={`text-2xl font-bold ${getColorForValue(riskMetrics.betaToMarket, 1)}`}>
                  {riskMetrics.betaToMarket.toFixed(3)}
                </div>
                <div className="text-xs text-gray-400">Market correlation</div>
              </div>
            </div>

            {/* Additional Risk Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-green-400 rounded p-3">
                <div className="text-green-400 text-xs font-mono">TRACKING ERROR</div>
                <div className="text-lg font-bold text-orange-400">
                  {formatPercentage(riskMetrics.trackingError)}
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-3">
                <div className="text-green-400 text-xs font-mono">TREYNOR RATIO</div>
                <div className={`text-lg font-bold ${getColorForValue(riskMetrics.treynorRatio)}`}>
                  {riskMetrics.treynorRatio.toFixed(3)}
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-3">
                <div className="text-green-400 text-xs font-mono">JENSEN ALPHA</div>
                <div className={`text-lg font-bold ${getColorForValue(riskMetrics.jensenAlpha)}`}>
                  {formatPercentage(riskMetrics.jensenAlpha)}
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-3">
                <div className="text-green-400 text-xs font-mono">DOWNSIDE DEV</div>
                <div className="text-lg font-bold text-red-400">
                  {formatPercentage(riskMetrics.downside_deviation)}
                </div>
              </div>
            </div>

            {/* Risk Distribution Chart */}
            <div className="bg-gray-900 border border-green-400 rounded p-4">
              <h3 className="text-green-400 font-mono mb-4">RISK DISTRIBUTION</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-green-400 text-sm font-mono mb-2">Upside Potential</h4>
                  <div className="bg-green-400 bg-opacity-20 rounded p-3">
                    <div className="text-2xl font-bold text-green-400">
                      +{formatPercentage(riskMetrics.upside_potential)}
                    </div>
                    <div className="text-xs text-gray-400">Maximum upside</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-red-400 text-sm font-mono mb-2">Downside Risk</h4>
                  <div className="bg-red-400 bg-opacity-20 rounded p-3">
                    <div className="text-2xl font-bold text-red-400">
                      -{formatPercentage(riskMetrics.downside_deviation)}
                    </div>
                    <div className="text-xs text-gray-400">Maximum downside</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && tradingPatterns && (
          <div className="space-y-6">
            {/* Time-based Performance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <h3 className="text-green-400 font-mono mb-4">HOURLY PERFORMANCE</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={tradingPatterns.timeOfDayPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22c55e40" />
                    <XAxis dataKey="hour" stroke="#22c55e" />
                    <YAxis stroke="#22c55e" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000', 
                        border: '1px solid #22c55e',
                        color: '#22c55e'
                      }} 
                    />
                    <Bar dataKey="pnl" fill="#22c55e60" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <h3 className="text-green-400 font-mono mb-4">DAILY PERFORMANCE</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={tradingPatterns.dayOfWeekPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22c55e40" />
                    <XAxis dataKey="day" stroke="#22c55e" />
                    <YAxis stroke="#22c55e" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#000', 
                        border: '1px solid #22c55e',
                        color: '#22c55e'
                      }} 
                    />
                    <Bar dataKey="pnl" fill="#22c55e60" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strategy Breakdown */}
            <div className="bg-gray-900 border border-green-400 rounded p-4">
              <h3 className="text-green-400 font-mono mb-4">STRATEGY PERFORMANCE</h3>
              <div className="grid grid-cols-1 gap-2">
                {tradingPatterns.strategyBreakdown.map((strategy, index) => (
                  <div key={index} className="flex justify-between items-center bg-black bg-opacity-50 rounded p-3">
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 font-mono text-sm">{strategy.strategy}</span>
                      <span className="text-gray-400 text-xs">{strategy.trades} trades</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-mono ${getColorForValue(strategy.pnl)}`}>
                        {formatNumber(strategy.pnl)} SOL
                      </span>
                      <span className={`font-mono text-sm ${getColorForValue(strategy.winRate, 0.5)}`}>
                        {formatPercentage(strategy.winRate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hold Time Distribution */}
            <div className="bg-gray-900 border border-green-400 rounded p-4">
              <h3 className="text-green-400 font-mono mb-4">HOLD TIME ANALYSIS</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={tradingPatterns.holdTimeDistribution}
                    dataKey="count"
                    nameKey="duration"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#22c55e"
                  >
                    {tradingPatterns.holdTimeDistribution.map((entry, index) => (
                      <Cell key={index} fill={`hsl(${120 + index * 30}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #22c55e',
                      color: '#22c55e'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'ai' && aiBehavior && (
          <div className="space-y-6">
            {/* AI State Overview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">EMOTIONAL STATE</div>
                <div className={`text-lg font-bold ${
                  aiBehavior.emotionalState.current === 'confident' ? 'text-green-400' :
                  aiBehavior.emotionalState.current === 'anxious' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {aiBehavior.emotionalState.current.toUpperCase()}
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">STRATEGIES GENERATED</div>
                <div className="text-2xl font-bold text-blue-400">
                  {aiBehavior.adaptationMetrics.strategiesGenerated}
                </div>
              </div>
              
              <div className="bg-gray-900 border border-green-400 rounded p-4">
                <div className="text-green-400 text-sm font-mono">LEARNING VELOCITY</div>
                <div className="text-2xl font-bold text-purple-400">
                  {(aiBehavior.adaptationMetrics.learningVelocity * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Confidence Distribution */}
            <div className="bg-gray-900 border border-green-400 rounded p-4">
              <h3 className="text-green-400 font-mono mb-4">CONFIDENCE vs PERFORMANCE</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={aiBehavior.confidenceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22c55e40" />
                  <XAxis dataKey="range" stroke="#22c55e" />
                  <YAxis stroke="#22c55e" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #22c55e',
                      color: '#22c55e'
                    }} 
                  />
                  <Bar dataKey="avgPnl" fill="#22c55e60" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Learning Progress */}
            <div className="bg-gray-900 border border-green-400 rounded p-4">
              <h3 className="text-green-400 font-mono mb-4">LEARNING PROGRESS</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={aiBehavior.learningProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22c55e40" />
                  <XAxis dataKey="epoch" stroke="#22c55e" />
                  <YAxis stroke="#22c55e" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #22c55e',
                      color: '#22c55e'
                    }} 
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Decision Latency */}
            <div className="bg-gray-900 border border-green-400 rounded p-4">
              <h3 className="text-green-400 font-mono mb-4">DECISION LATENCY ANALYSIS</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={aiBehavior.decisionLatency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22c55e40" />
                  <XAxis dataKey="timestamp" stroke="#22c55e" />
                  <YAxis stroke="#22c55e" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #22c55e',
                      color: '#22c55e'
                    }} 
                  />
                  <Area type="monotone" dataKey="latency" stroke="#22c55e" fill="#22c55e20" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedTradingStats;