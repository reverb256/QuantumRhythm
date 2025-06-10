import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Shield, DollarSign, Activity, Target } from 'lucide-react';

export function DeFiDashboard() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);

  // DeFi data queries with graceful degradation
  const { data: opportunities = { opportunities: [] }, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['/api/trading-agent/defi/opportunities'],
    refetchInterval: 30000
  });

  const { data: positions = { positions: [], metrics: { balance: 0.181854, gasEfficiency: 99.5, activeStrategies: 0, profitToday: 0 } } } = useQuery({
    queryKey: ['/api/trading-agent/defi/positions'],
    refetchInterval: 10000
  });

  const { data: insights = { topProtocols: [], marketTrends: [], opportunities: [] } } = useQuery({
    queryKey: ['/api/trading-agent/defi/insights'],
    refetchInterval: 60000
  });

  if (opportunitiesLoading) {
    return (
      <div className="min-h-screen bg-[var(--space-black)] text-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Solana DeFi opportunities...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Solana DeFi Gateway
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Single wallet access point for all DeFi activities. Optimized for low fees and high efficiency.
          </p>
        </motion.div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="h-6 w-6 text-green-400" />
              <span className="text-gray-400 text-sm">Balance</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {positions.metrics?.balance?.toFixed(6)} SOL
            </div>
            <div className="text-sm text-gray-500">
              ~${(positions.metrics?.balance * 180).toFixed(2)}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="h-6 w-6 text-yellow-400" />
              <span className="text-gray-400 text-sm">Gas Efficiency</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              {positions.metrics?.gasEfficiency?.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">
              Ultra-low fees
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="h-6 w-6 text-blue-400" />
              <span className="text-gray-400 text-sm">Active Strategies</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {positions.metrics?.activeStrategies || 0}
            </div>
            <div className="text-sm text-gray-500">
              DeFi positions
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="h-6 w-6 text-green-400" />
              <span className="text-gray-400 text-sm">Today's Profit</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {positions.metrics?.profitToday >= 0 ? '+' : ''}{positions.metrics?.profitToday?.toFixed(4)} SOL
            </div>
            <div className="text-sm text-gray-500">
              {positions.metrics?.profitToday >= 0 ? 'Profit' : 'Loss'}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* DeFi Opportunities */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Optimal Opportunities
            </h3>
            
            <div className="space-y-3">
              {opportunities.opportunities?.map((opp: any, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/30 hover:border-cyan-400/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedOpportunity(opp)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-white capitalize">
                        {opp.action?.replace('_', ' ')} on {opp.protocol}
                      </div>
                      <div className="text-sm text-gray-400">
                        {opp.timeframe} • Risk: {opp.riskLevel}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">
                        {(opp.expectedReturn * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Gas: {opp.gasCost?.toFixed(6)} SOL
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(opp.expectedReturn * 1000, 100)}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Market Insights */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-purple-300 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Market Intelligence
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Trending Protocols</h4>
                <div className="space-y-2">
                  {insights.topProtocols?.slice(0, 3).map((protocol: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white">{protocol.name}</span>
                      <span className="text-cyan-400">
                        ${(protocol.tvl / 1000000).toFixed(0)}M TVL
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Market Trends</h4>
                <div className="space-y-1">
                  {insights.marketTrends?.slice(0, 3).map((trend: string, index: number) => (
                    <div key={index} className="text-sm text-gray-300 flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      {trend}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Live Opportunities</h4>
                <div className="space-y-1">
                  {insights.opportunities?.slice(0, 3).map((opportunity: string, index: number) => (
                    <div key={index} className="text-sm text-gray-300 flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      {opportunity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Current Positions */}
        {positions.positions?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-green-300 mb-4">Active Positions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions.positions.map((position: any, index: number) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-white">{position.symbol}</div>
                      <div className="text-sm text-gray-400">{position.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white">{position.balance?.toFixed(6)}</div>
                      <div className="text-sm text-gray-400">${position.value?.toFixed(2)}</div>
                    </div>
                  </div>
                  {position.protocol && (
                    <div className="text-xs text-cyan-400">{position.protocol}</div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}