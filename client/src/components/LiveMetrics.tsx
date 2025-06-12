import React from 'react';

interface LiveMetricsProps {
  className?: string;
}

interface Strategy {
  name: string;
  apy: string;
  allocated: number;
}

interface MetricsData {
  currentBalance: number;
  deployedCapital: number;
  expectedReturn: number;
  opportunitiesScanned: number;
  activeStrategies: Strategy[];
}

export function LiveMetrics({ className = "" }: LiveMetricsProps) {
  // Static showcase data matching the design
  const metrics: MetricsData = {
    currentBalance: 0.288736,
    deployedCapital: 0.2079,
    expectedReturn: 3.7,
    opportunitiesScanned: 16,
    activeStrategies: [
      { name: "Kamino", apy: "11% APY", allocated: 0.0693 },
      { name: "Marinade", apy: "7.2% APY", allocated: 0.0693 },
      { name: "Solend", apy: "8.5% APY", allocated: 0.0693 }
    ]
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">⚡</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Quantum AI Trading Platform</h2>
        </div>
        <p className="text-gray-400">Autonomous intelligent trading with real-time optimization</p>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Current Balance */}
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-2">
            {metrics.currentBalance.toFixed(6)} SOL
          </div>
          <div className="text-sm text-gray-300">Current Balance</div>
        </div>

        {/* Deployed Capital */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-2">
            {metrics.deployedCapital.toFixed(4)} SOL
          </div>
          <div className="text-sm text-gray-300">Deployed Capital</div>
        </div>

        {/* Expected Annual Return */}
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-400 mb-2">
            ${metrics.expectedReturn.toFixed(1)}
          </div>
          <div className="text-sm text-gray-300">Expected Annual Return</div>
        </div>

        {/* Opportunities Scanned */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-2">
            {metrics.opportunitiesScanned}
          </div>
          <div className="text-sm text-gray-300">Opportunities Scanned</div>
        </div>
      </div>

      {/* Active Strategies */}
      <div className="bg-gradient-to-br from-gray-900/40 to-slate-900/40 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-white">Active Strategies</h3>
        </div>
        
        <div className="space-y-3">
          {metrics.activeStrategies.map((strategy: Strategy, index: number) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div>
                <div className="font-medium text-white">{strategy.name}</div>
                <div className="text-sm text-gray-400">{strategy.apy}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-cyan-400">{strategy.allocated.toFixed(4)} SOL</div>
                <div className="text-xs text-gray-500">Allocated</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-green-400">95.2%</div>
          <div className="text-sm text-gray-300">Success Rate</div>
          <div className="text-xs text-gray-500">Trading Accuracy</div>
        </div>
        
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-purple-400">72.5%</div>
          <div className="text-sm text-gray-300">AI Evolution</div>
          <div className="text-xs text-gray-500">Consciousness Level</div>
        </div>
        
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-cyan-400">24/7</div>
          <div className="text-sm text-gray-300">Active Monitoring</div>
          <div className="text-xs text-gray-500">Autonomous Operation</div>
        </div>
      </div>
    </div>
  );
}