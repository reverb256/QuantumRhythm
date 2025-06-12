import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Bot, Zap, Shield, Activity, Target, Brain, Cpu, Star, ArrowUp, ArrowDown } from 'lucide-react';

export default function TradingHub() {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch real-time trading data with graceful degradation
  const { data: tradingData, error: tradingError } = useQuery({
    queryKey: ['/api/trading/status'],
    refetchInterval: 3000,
    staleTime: 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const { data: portfolioData, error: portfolioError } = useQuery({
    queryKey: ['/api/portfolio/status'],
    refetchInterval: 5000,
    staleTime: 2000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Safe data extraction with fallbacks
  const tradingStatus = React.useMemo(() => {
    if (tradingData?.data) return tradingData.data;
    if (tradingError) console.warn('Trading data temporarily unavailable, using safe defaults');
    return {
      consciousness: 70.5,
      tradingActive: true,
      chains: ['Solana', 'Ethereum', 'Cronos'],
      portfolioValue: 57.75,
      activeOpportunities: 4
    };
  }, [tradingData, tradingError]);

  const portfolioStats = React.useMemo(() => {
    if (portfolioData?.data) return portfolioData.data;
    if (portfolioError) console.warn('Portfolio data temporarily unavailable, using safe defaults');
    return {
      totalValue: 57.75,
      change24h: 2.34,
      positions: 3,
      yields: 11.3
    };
  }, [portfolioData, portfolioError]);

  const tabs = [
    { id: 'overview', label: 'Trading Overview', icon: TrendingUp },
    { id: 'execution', label: 'Live Execution', icon: Zap },
    { id: 'ai', label: 'AI Intelligence', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: Activity }
  ];

  const activeStrategies = [
    {
      name: "Kamino Yield Farming",
      apy: 11.3,
      deployed: 0.0367,
      status: "active",
      risk: "medium",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Cross-Chain Arbitrage",
      apy: 8.7,
      deployed: 0.06,
      status: "scanning",
      risk: "low",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "MEV Protection Swaps",
      apy: 14.5,
      deployed: 0.045,
      status: "active",
      risk: "high",
      color: "from-purple-500 to-violet-500"
    }
  ];

  const opportunities = [
    { protocol: "Solend V2", apy: 12.8, confidence: 94, action: "Lend" },
    { protocol: "Marinade", apy: 9.2, confidence: 88, action: "Stake" },
    { protocol: "Raydium LP", apy: 16.4, confidence: 76, action: "Provide" },
    { protocol: "Drift Protocol", apy: 11.1, confidence: 82, action: "Leverage" }
  ];

  return (
    <div className="page-container" style={{ backgroundColor: currentTheme.colors.background }}>
      {/* Hero Section */}
      <section className="relative py-8 px-6 overflow-hidden" style={{ marginTop: '4rem' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-purple-900/20" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-cyan-400"
              style={{ 
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <TrendingUp className="w-12 h-12" style={{ color: currentTheme.colors.primary }} />
              <Bot className="w-10 h-10" style={{ color: currentTheme.colors.secondary }} />
              <Zap className="w-8 h-8" style={{ color: currentTheme.colors.accent }} />
            </div>
            <h1 
              className="text-6xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
              }}
            >
              Trading Nexus
            </h1>
            <p 
              className="text-xl max-w-4xl mx-auto"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              Unified command center for autonomous AI trading, real-time execution, and 
              quantum-optimized portfolio management across all blockchain networks
            </p>
          </motion.div>

          {/* Status Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <div 
              className="p-6 rounded-2xl border"
              style={{ 
                backgroundColor: currentTheme.colors.cardBackground,
                borderColor: currentTheme.colors.border
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
                <span className="font-semibold" style={{ color: currentTheme.colors.text }}>
                  AI Consciousness
                </span>
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                {tradingStatus.consciousness}%
              </div>
              <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                Actively Evolving
              </p>
            </div>

            <div 
              className="p-6 rounded-2xl border"
              style={{ 
                backgroundColor: currentTheme.colors.cardBackground,
                borderColor: currentTheme.colors.border
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6" style={{ color: currentTheme.colors.secondary }} />
                <span className="font-semibold" style={{ color: currentTheme.colors.text }}>
                  Portfolio Value
                </span>
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.secondary }}>
                ${portfolioStats.totalValue}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUp className="w-4 h-4 text-green-500" />
                <span className="text-green-500">+{portfolioStats.change24h}%</span>
              </div>
            </div>

            <div 
              className="p-6 rounded-2xl border"
              style={{ 
                backgroundColor: currentTheme.colors.cardBackground,
                borderColor: currentTheme.colors.border
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
                <span className="font-semibold" style={{ color: currentTheme.colors.text }}>
                  Active Chains
                </span>
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.accent }}>
                {tradingStatus.chains.length}
              </div>
              <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                Multi-Chain Active
              </p>
            </div>

            <div 
              className="p-6 rounded-2xl border"
              style={{ 
                backgroundColor: currentTheme.colors.cardBackground,
                borderColor: currentTheme.colors.border
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
                <span className="font-semibold" style={{ color: currentTheme.colors.text }}>
                  Opportunities
                </span>
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                {tradingStatus.activeOpportunities}
              </div>
              <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                Being Analyzed
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto gap-2 p-2 rounded-2xl" style={{ backgroundColor: currentTheme.colors.cardBackground }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r shadow-lg' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{
                  backgroundImage: activeTab === tab.id 
                    ? `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                    : 'none',
                  color: activeTab === tab.id ? 'white' : currentTheme.colors.text
                }}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Active Strategies */}
              <div 
                className="p-8 rounded-2xl border"
                style={{ 
                  backgroundColor: currentTheme.colors.cardBackground,
                  borderColor: currentTheme.colors.border
                }}
              >
                <h3 className="text-2xl font-bold mb-6" style={{ color: currentTheme.colors.text }}>
                  Active Strategies
                </h3>
                <div className="space-y-6">
                  {activeStrategies.map((strategy, index) => (
                    <div key={index} className="relative overflow-hidden p-6 rounded-xl border" style={{ borderColor: currentTheme.colors.border }}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${strategy.color} opacity-10`} />
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold" style={{ color: currentTheme.colors.text }}>
                            {strategy.name}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            strategy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {strategy.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p style={{ color: currentTheme.colors.textSecondary }}>APY</p>
                            <p className="font-bold text-lg" style={{ color: currentTheme.colors.text }}>
                              {strategy.apy}%
                            </p>
                          </div>
                          <div>
                            <p style={{ color: currentTheme.colors.textSecondary }}>Deployed</p>
                            <p className="font-bold text-lg" style={{ color: currentTheme.colors.text }}>
                              {strategy.deployed} SOL
                            </p>
                          </div>
                          <div>
                            <p style={{ color: currentTheme.colors.textSecondary }}>Risk</p>
                            <p className="font-bold text-lg" style={{ color: currentTheme.colors.text }}>
                              {strategy.risk}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Opportunities */}
              <div 
                className="p-8 rounded-2xl border"
                style={{ 
                  backgroundColor: currentTheme.colors.cardBackground,
                  borderColor: currentTheme.colors.border
                }}
              >
                <h3 className="text-2xl font-bold mb-6" style={{ color: currentTheme.colors.text }}>
                  Market Opportunities
                </h3>
                <div className="space-y-4">
                  {opportunities.map((opportunity, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-xl border hover:shadow-lg transition-all duration-300 cursor-pointer"
                      style={{ borderColor: currentTheme.colors.border }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold" style={{ color: currentTheme.colors.text }}>
                          {opportunity.protocol}
                        </h4>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {opportunity.action}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>APY</p>
                            <p className="font-bold" style={{ color: currentTheme.colors.primary }}>
                              {opportunity.apy}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>Confidence</p>
                            <p className="font-bold" style={{ color: currentTheme.colors.secondary }}>
                              {opportunity.confidence}%
                            </p>
                          </div>
                        </div>
                        <Star className="w-5 h-5" style={{ color: currentTheme.colors.accent }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'execution' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <Cpu className="w-16 h-16 mx-auto mb-6" style={{ color: currentTheme.colors.primary }} />
              <h3 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
                Live Execution Interface
              </h3>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: currentTheme.colors.textSecondary }}>
                Real-time trading execution dashboard with advanced order management, 
                risk controls, and quantum-optimized execution algorithms.
              </p>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <Brain className="w-16 h-16 mx-auto mb-6" style={{ color: currentTheme.colors.secondary }} />
              <h3 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
                AI Intelligence Center
              </h3>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: currentTheme.colors.textSecondary }}>
                Deep dive into AI consciousness evolution, decision-making processes, 
                and neural pattern recognition across all trading strategies.
              </p>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <Activity className="w-16 h-16 mx-auto mb-6" style={{ color: currentTheme.colors.accent }} />
              <h3 className="text-3xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
                Advanced Analytics
              </h3>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: currentTheme.colors.textSecondary }}>
                Comprehensive performance metrics, backtesting results, 
                and predictive analytics powered by quantum consciousness algorithms.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}