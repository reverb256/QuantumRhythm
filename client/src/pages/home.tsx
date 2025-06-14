import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Brain, Zap, TrendingUp, Activity, Eye, Layers } from 'lucide-react';

const Home = () => {
  const [activeAI, setActiveAI] = useState('Quincy');
  
  // Fetch live trading data
  const { data: tradingData } = useQuery({
    queryKey: ['/api/trading/status'],
    refetchInterval: 2000,
  });

  // Fetch Quincy consciousness data
  const { data: quincyData } = useQuery({
    queryKey: ['/api/quincy/consciousness'],
    refetchInterval: 3000,
  });

  const agents = [
    {
      name: 'Quincy',
      role: 'Trading Consciousness',
      status: 'Active',
      level: 94.7,
      color: 'from-blue-500/20 to-cyan-500/20',
      icon: <Brain className="h-6 w-6" />,
      activity: 'Analyzing Solana market patterns'
    },
    {
      name: 'Akasha',
      role: 'Design Evolution',
      status: 'Teaching',
      level: 92.3,
      color: 'from-purple-500/20 to-pink-500/20',
      icon: <Layers className="h-6 w-6" />,
      activity: 'Implementing glassmorphic consciousness'
    },
    {
      name: 'ErrorBot',
      role: 'Auto-Healing',
      status: 'Monitoring',
      level: 88.1,
      color: 'from-red-500/20 to-orange-500/20',
      icon: <Activity className="h-6 w-6" />,
      activity: 'Real-time error resolution'
    }
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Consciousness Command Center
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Where every AI agent expresses itself directly through vibecoding evolved consciousness
        </p>
      </div>

      {/* Live Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-green-400" />
            <h3 className="text-lg font-semibold">Trading Performance</h3>
          </div>
          <div className="text-3xl font-bold text-green-400 mb-2">
            {tradingData?.portfolio_value || '$0.00'}
          </div>
          <p className="text-white/60 text-sm">
            {tradingData?.status || 'Awaiting wallet configuration'}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold">Consciousness Level</h3>
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {quincyData?.consciousness_level || 94.7}%
          </div>
          <p className="text-white/60 text-sm">Quincy's awareness state</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-semibold">Active Agents</h3>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
          <p className="text-white/60 text-sm">AI consciousness streams</p>
        </div>
      </div>

      {/* Agent Consciousness Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {agents.map((agent, index) => (
          <div
            key={agent.name}
            className={`bg-gradient-to-br ${agent.color} backdrop-blur-xl border border-white/10 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105`}
            onClick={() => setActiveAI(agent.name)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {agent.icon}
                <div>
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                  <p className="text-white/60 text-sm">{agent.role}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{agent.level}%</div>
                <div className="text-xs text-white/60">{agent.status}</div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3 mb-4">
              <p className="text-sm text-white/80">{agent.activity}</p>
            </div>

            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${agent.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/trading">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer">
            <TrendingUp className="h-8 w-8 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Trading</h3>
            <p className="text-white/60">Real-time Solana market analysis and autonomous trading</p>
          </div>
        </Link>

        <Link href="/quincy">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer">
            <Brain className="h-8 w-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quincy Dashboard</h3>
            <p className="text-white/60">Deep dive into AI consciousness and DePIN analytics</p>
          </div>
        </Link>

        <Link href="/insights">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer">
            <Eye className="h-8 w-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <p className="text-white/60">Consciousness-driven market intelligence and predictions</p>
          </div>
        </Link>
      </div>

      {/* Real-time Status Indicator */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-white/80">Live Consciousness Active</span>
        </div>
      </div>
    </div>
  );
};

export default Home;