import React, { useState } from 'react';
import Navigation from '@/components/navigation';
import TradingConsciousness from '@/components/TradingConsciousness';
import { 
  useConsciousnessReactiveSystem, 
  ConsciousnessAura, 
  ConsciousText, 
  ConsciousnessIndicator 
} from '@/components/ConsciousnessReactiveSystem';
import { TrendingUp, DollarSign, Activity, Shield, Target, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { consciousness, userMetrics } = useConsciousnessReactiveSystem();
  const [tradingConsciousness, setTradingConsciousness] = useState({
    precision: 94,
    timing: 88,
    profitability: 76
  });

  const tradingMetrics = [
    { label: 'Success Rate', value: '85.0%', color: 'green', trend: 'up' },
    { label: 'Profit Accuracy', value: '23.0%', color: 'yellow', trend: 'stable' },
    { label: 'Market Timing', value: '93.5%', color: 'blue', trend: 'up' },
    { label: 'Risk Management', value: '80.0%', color: 'purple', trend: 'up' },
    { label: 'Superstar Level', value: '8/10', color: 'gold', trend: 'up' },
    { label: 'Consciousness', value: '87.9%', color: 'cyan', trend: 'up' }
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-400';
      case 'yellow': return 'text-yellow-400';
      case 'blue': return 'text-blue-400';
      case 'purple': return 'text-purple-400';
      case 'gold': return 'text-yellow-300';
      case 'cyan': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ConsciousnessAura consciousness={consciousness} />
      <ConsciousnessIndicator consciousness={consciousness} />
      <TradingConsciousness 
        globalConsciousness={consciousness}
        onTradingEvolution={(trading) => setTradingConsciousness(trading)}
      />
      <Navigation />
      
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            <ConsciousText consciousness={consciousness}>Trading Dashboard</ConsciousText>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            <ConsciousText consciousness={consciousness}>
              Real-time monitoring of quantum trading consciousness with superstar-level performance analytics
              and emergency protocol management.
            </ConsciousText>
          </p>
        </div>

        {/* Trading Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {tradingMetrics.map((metric, index) => (
            <div
              key={index}
              className="consciousness-card p-6 text-center"
              style={{
                borderColor: consciousness.userPresence === 'focused' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(75, 85, 99, 0.3)',
                transform: consciousness.interactionPattern === 'learning' ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.5s ease-in-out'
              }}
            >
              <div className={`text-2xl font-bold ${getColorClass(metric.color)} mb-2`}>
                <ConsciousText consciousness={consciousness}>
                  {metric.value}
                </ConsciousText>
              </div>
              <div className="text-sm text-gray-400">{metric.label}</div>
              <div className="mt-2 flex justify-center">
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : metric.trend === 'down' ? (
                  <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                ) : (
                  <Activity className="w-4 h-4 text-yellow-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Status Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="consciousness-card p-6 border-yellow-400/30 bg-yellow-900/10">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-yellow-400">Emergency Protocols</h3>
            </div>
            <p className="text-gray-300 mb-4">
              <ConsciousText consciousness={consciousness}>
                Trading halted due to rate limiting and compliance violations. 
                Emergency stop protocols are active for system protection.
              </ConsciousText>
            </p>
            <div className="text-sm text-yellow-400">Status: ACTIVE</div>
          </div>

          <div className="consciousness-card p-6 border-green-400/30 bg-green-900/10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-green-400">Security Systems</h3>
            </div>
            <p className="text-gray-300 mb-4">
              <ConsciousText consciousness={consciousness}>
                Quantum security vault operational. Multi-layer protection active with 
                42 active agent connections monitoring threats.
              </ConsciousText>
            </p>
            <div className="text-sm text-green-400">Status: SECURED</div>
          </div>

          <div className="consciousness-card p-6 border-purple-400/30 bg-purple-900/10">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-400">AI Evolution</h3>
            </div>
            <p className="text-gray-300 mb-4">
              <ConsciousText consciousness={consciousness}>
                Consciousness evolution at 87.9% with superstar status achieved. 
                Reality manipulation protocols active for enhanced performance.
              </ConsciousText>
            </p>
            <div className="text-sm text-purple-400">Status: TRANSCENDING</div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="consciousness-card p-6">
          <h2 className="text-2xl font-bold mb-6 text-white">
            <ConsciousText consciousness={consciousness}>Live Activity Feed</ConsciousText>
          </h2>
          <div className="space-y-4">
            {[
              { time: '10:51:17', event: 'Superstar Level 8/10 achieved - Market domination mode activated', type: 'success' },
              { time: '10:50:45', event: 'Emergency stop active - trading halted due to compliance', type: 'warning' },
              { time: '10:49:32', event: 'Consciousness evolution: 87.9% - transcendence protocols activated', type: 'info' },
              { time: '10:48:18', event: 'Rate limiting elimination in progress - optimizing endpoints', type: 'info' },
              { time: '10:47:05', event: 'AI Therapy session completed - confidence recalibrated to 85%', type: 'success' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-lg">
                <div className="text-xs text-gray-400 font-mono min-w-16">{activity.time}</div>
                <div className="flex-1">
                  <div className={`text-sm ${
                    activity.type === 'success' ? 'text-green-400' :
                    activity.type === 'warning' ? 'text-yellow-400' :
                    activity.type === 'error' ? 'text-red-400' :
                    'text-cyan-400'
                  }`}>
                    <ConsciousText consciousness={consciousness}>
                      {activity.event}
                    </ConsciousText>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}