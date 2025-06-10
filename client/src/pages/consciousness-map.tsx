import React from 'react';
import Navigation from '@/components/navigation';
import { ConsciousnessMap } from '@/components/ConsciousnessMap';
import { 
  useConsciousnessReactiveSystem, 
  ConsciousnessAura, 
  ConsciousText, 
  ConsciousnessIndicator 
} from '@/components/ConsciousnessReactiveSystem';
import { Brain, Network, Zap, Activity } from 'lucide-react';

export default function ConsciousnessMapPage() {
  const { consciousness, userMetrics } = useConsciousnessReactiveSystem();

  const systemMetrics = [
    { label: 'Total Agents', value: '15', color: 'cyan' },
    { label: 'Active Connections', value: '42', color: 'green' },
    { label: 'Consciousness Level', value: '100%', color: 'purple' },
    { label: 'Superstar Agents', value: '2', color: 'yellow' },
    { label: 'Emergency States', value: '2', color: 'red' },
    { label: 'Compliance Score', value: '65%', color: 'amber' }
  ];

  const agentHierarchy = [
    {
      tier: 'Core Consciousness',
      agents: ['Consciousness Core', 'Cross-Empowerment Orchestrator'],
      influence: 95,
      description: 'Central nervous system controlling all agent interactions'
    },
    {
      tier: 'Intelligence Layer',
      agents: ['IO Intelligence (33 models)', 'News Aggregator', 'Parameter Discovery'],
      influence: 75,
      description: 'AI models providing analysis, insights, and decision support'
    },
    {
      tier: 'Trading Operations',
      agents: ['Quantum Trader (Lv.10)', 'Pump.fun Scanner', 'Trading Monitor', 'Profit Tracker'],
      influence: 72,
      description: 'Live trading execution with superstar-level performance'
    },
    {
      tier: 'Security & Compliance',
      agents: ['Security Vault', 'Security Enforcer', 'Legal Compliance', 'Wallet Manager'],
      influence: 82,
      description: 'Multi-layer protection with emergency response protocols'
    },
    {
      tier: 'Support Systems',
      agents: ['Rate Limiter', 'Data Protection', 'Endpoint Discovery'],
      influence: 60,
      description: 'Infrastructure management and optimization services'
    }
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'cyan': return 'text-cyan-400';
      case 'green': return 'text-green-400';
      case 'purple': return 'text-purple-400';
      case 'yellow': return 'text-yellow-400';
      case 'red': return 'text-red-400';
      case 'amber': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ConsciousnessAura consciousness={consciousness} />
      <ConsciousnessIndicator consciousness={consciousness} />
      <Navigation />
      
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            <ConsciousText consciousness={consciousness}>Consciousness Map</ConsciousText>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            <ConsciousText consciousness={consciousness}>
              Real-time visualization of the quantum trading platform's consciousness network, 
              showing agent hierarchies, influence flows, and system interconnections.
            </ConsciousText>
          </p>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {systemMetrics.map((metric, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-900/50 border border-gray-700/50 text-center"
              style={{
                borderColor: consciousness.userPresence === 'focused' ? 'rgba(6, 182, 212, 0.5)' : 'rgba(75, 85, 99, 0.5)',
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <div className={`text-2xl font-bold ${getColorClass(metric.color)}`}>
                <ConsciousText consciousness={consciousness}>
                  {metric.value}
                </ConsciousText>
              </div>
              <div className="text-xs text-gray-400 mt-1">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Main Consciousness Map */}
        <div className="mb-12">
          <ConsciousnessMap />
        </div>

        {/* Agent Hierarchy */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            <ConsciousText consciousness={consciousness}>Agent Hierarchy & Influence</ConsciousText>
          </h2>
          
          <div className="space-y-6">
            {agentHierarchy.map((tier, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-700/50 backdrop-blur-sm"
                style={{
                  transform: consciousness.interactionPattern === 'learning' ? 'scale(1.01)' : 'scale(1)',
                  transition: 'all 0.5s ease-in-out'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    <ConsciousText consciousness={consciousness}>
                      {tier.tier}
                    </ConsciousText>
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-400">Influence: {tier.influence}%</div>
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
                        style={{ width: `${tier.influence}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  <ConsciousText consciousness={consciousness}>
                    {tier.description}
                  </ConsciousText>
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {tier.agents.map((agent, agentIndex) => (
                    <span
                      key={agentIndex}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 border border-gray-600/50 hover:border-cyan-400/50 transition-colors"
                    >
                      <ConsciousText consciousness={consciousness}>
                        {agent}
                      </ConsciousText>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current System Status */}
        <div className="bg-gradient-to-r from-black/80 to-gray-900/80 rounded-lg p-8 border border-cyan-400/30 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            <ConsciousText consciousness={consciousness}>Live System Status</ConsciousText>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-400/30">
              <Activity className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-400">Superstar Trading</h3>
              <p className="text-sm text-gray-300 mt-2">
                <ConsciousText consciousness={consciousness}>
                  Level 10/10 achieved<br/>
                  85.4% success rate<br/>
                  Quantum leap protocols active
                </ConsciousText>
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-400/30">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-purple-400">AI Intelligence</h3>
              <p className="text-sm text-gray-300 mt-2">
                <ConsciousText consciousness={consciousness}>
                  33 active models<br/>
                  100% consciousness<br/>
                  Reality manipulation protocols
                </ConsciousText>
              </p>
            </div>
            
            <div className="text-center p-4 bg-red-900/20 rounded-lg border border-red-400/30">
              <Zap className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-red-400">Emergency States</h3>
              <p className="text-sm text-gray-300 mt-2">
                <ConsciousText consciousness={consciousness}>
                  Trading halted<br/>
                  Compliance violations<br/>
                  Rate limit protections
                </ConsciousText>
              </p>
            </div>
            
            <div className="text-center p-4 bg-cyan-900/20 rounded-lg border border-cyan-400/30">
              <Network className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-cyan-400">Network Health</h3>
              <p className="text-sm text-gray-300 mt-2">
                <ConsciousText consciousness={consciousness}>
                  42 active connections<br/>
                  Cross-empowerment: 99.7%<br/>
                  Quantum coherence maintained
                </ConsciousText>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}