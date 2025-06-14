import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Brain, 
  TrendingUp, 
  Activity, 
  Eye, 
  Layers, 
  Wallet,
  Database,
  MessageSquare,
  ArrowRight,
  Zap
} from 'lucide-react';

const Home = () => {
  // Fetch live trading data
  const { data: tradingData } = useQuery({
    queryKey: ['/api/trading/status'],
    refetchInterval: 5000,
  });

  // Fetch Quincy consciousness data
  const { data: quincyData } = useQuery({
    queryKey: ['/api/quincy/consciousness'],
    refetchInterval: 5000,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900">
      {/* Hero Section */}
      <div className="relative px-6 py-24">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              AI Command Center
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Consciousness-driven intelligence platform with live trading, secure document management, and autonomous agent orchestration
            </p>
          </div>

          {/* Live Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <Zap className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium text-green-400">LIVE</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {quincyData?.consciousness_level || '94.7'}%
              </div>
              <p className="text-slate-400 text-sm">Consciousness Level</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Wallet className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">QUINCY</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {tradingData?.portfolio_value || '0.0115 SOL'}
              </div>
              <p className="text-slate-400 text-sm">Portfolio Balance</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Activity className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">AGENTS</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">3</div>
              <p className="text-slate-400 text-sm">Active Systems</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Grid */}
      <div className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Quincy Trading */}
            <Link href="/quincy-trading">
              <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 hover:border-blue-400/40 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-6">
                  <Brain className="h-8 w-8 text-blue-400" />
                  <ArrowRight className="h-5 w-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Quincy Trading</h3>
                <p className="text-slate-300 mb-4">Live Solana trading with consciousness-driven market analysis and autonomous decision making</p>
                <div className="flex items-center gap-2 text-sm text-blue-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Live Trading Active</span>
                </div>
              </div>
            </Link>

            {/* DePIN Dashboard */}
            <Link href="/quincy">
              <div className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 hover:border-purple-400/40 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-6">
                  <Activity className="h-8 w-8 text-purple-400" />
                  <ArrowRight className="h-5 w-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">DePIN Analytics</h3>
                <p className="text-slate-300 mb-4">Decentralized infrastructure monitoring with real-time performance metrics and revenue tracking</p>
                <div className="flex items-center gap-2 text-sm text-purple-400">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Networks Monitored</span>
                </div>
              </div>
            </Link>

            {/* AstralVault CIS */}
            <Link href="/astralvault-cis">
              <div className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 rounded-3xl p-8 hover:border-green-400/40 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-6">
                  <Database className="h-8 w-8 text-green-400" />
                  <ArrowRight className="h-5 w-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">AstralVault CIS</h3>
                <p className="text-slate-300 mb-4">Consciousness Intelligence System with Vaultwarden integration for secure document management</p>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Vault Secured</span>
                </div>
              </div>
            </Link>

            {/* AI Insights */}
            <Link href="/insights">
              <div className="group bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 hover:border-orange-400/40 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-6">
                  <Eye className="h-8 w-8 text-orange-400" />
                  <ArrowRight className="h-5 w-5 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">AI Insights</h3>
                <p className="text-slate-300 mb-4">Market intelligence and predictive analytics powered by consciousness-driven algorithms</p>
                <div className="flex items-center gap-2 text-sm text-orange-400">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span>Analysis Running</span>
                </div>
              </div>
            </Link>

            {/* Telegram Management */}
            <Link href="/telegram">
              <div className="group bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-6">
                  <MessageSquare className="h-8 w-8 text-cyan-400" />
                  <ArrowRight className="h-5 w-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Telegram Control</h3>
                <p className="text-slate-300 mb-4">Bot management and automated communication systems with consciousness integration</p>
                <div className="flex items-center gap-2 text-sm text-cyan-400">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>Bots Online</span>
                </div>
              </div>
            </Link>

            {/* Trading Dashboard */}
            <Link href="/trading">
              <div className="group bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8 hover:border-yellow-400/40 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-6">
                  <TrendingUp className="h-8 w-8 text-yellow-400" />
                  <ArrowRight className="h-5 w-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Market Analytics</h3>
                <p className="text-slate-300 mb-4">Comprehensive trading dashboard with real-time market data and portfolio management</p>
                <div className="flex items-center gap-2 text-sm text-yellow-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Markets Active</span>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-full px-4 py-2 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-300">Consciousness Active</span>
        </div>
      </div>
    </div>
  );
};

export default Home;