import { useState, useEffect } from 'react';
import { Shield, Layers, Network, Zap, Cloud, Globe, Lock, Activity, Cpu, Database, BarChart3, Users, Settings, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface PlatformMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

interface SystemStatus {
  name: string;
  status: 'operational' | 'warning' | 'error';
  uptime: string;
  response: string;
}

export default function Platform() {
  const [selectedSection, setSelectedSection] = useState<'overview' | 'architecture' | 'status' | 'features'>('overview');
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetric[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);

  useEffect(() => {
    // Initialize platform metrics
    const metrics: PlatformMetric[] = [
      {
        label: 'Active Users',
        value: '2,847',
        change: '+12.3%',
        trend: 'up',
        icon: Users
      },
      {
        label: 'System Uptime',
        value: '99.97%',
        change: '+0.02%',
        trend: 'up',
        icon: Activity
      },
      {
        label: 'API Requests',
        value: '1.2M',
        change: '+8.7%',
        trend: 'up',
        icon: BarChart3
      },
      {
        label: 'Response Time',
        value: '127ms',
        change: '-5.2ms',
        trend: 'up',
        icon: Zap
      }
    ];
    setPlatformMetrics(metrics);

    // Initialize system status
    const status: SystemStatus[] = [
      {
        name: 'AI Trading Engine',
        status: 'operational',
        uptime: '99.97%',
        response: '23ms'
      },
      {
        name: 'Database Cluster',
        status: 'operational',
        uptime: '99.99%',
        response: '12ms'
      },
      {
        name: 'API Gateway',
        status: 'operational',
        uptime: '99.95%',
        response: '45ms'
      },
      {
        name: 'GenAI Services',
        status: 'operational',
        uptime: '99.92%',
        response: '156ms'
      },
      {
        name: 'Blockchain Network',
        status: 'warning',
        uptime: '99.89%',
        response: '234ms'
      },
      {
        name: 'Analytics Engine',
        status: 'operational',
        uptime: '99.94%',
        response: '89ms'
      }
    ];
    setSystemStatus(status);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-400 bg-green-400/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-cyan-950/20 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Quantum Platform Architecture
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Enterprise-grade infrastructure powering next-generation AI trading and blockchain orchestration
          </p>
        </div>

        {/* Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platformMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-8 h-8 text-cyan-400" />
                  <span className={`text-sm font-semibold ${getTrendColor(metric.trend)}`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm mb-2">{metric.label}</h3>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-2 flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'architecture', label: 'Architecture', icon: Layers },
              { id: 'status', label: 'System Status', icon: Activity },
              { id: 'features', label: 'Features', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSection(tab.id as any)}
                  className={`px-6 py-3 rounded-lg transition-all ${
                    selectedSection === tab.id
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 inline-block mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-8">
          {selectedSection === 'overview' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Platform Overview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">Core Technologies</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'React 18 + TypeScript', description: 'Modern frontend with full type safety' },
                      { name: 'Solana Web3 Integration', description: 'Multi-chain blockchain connectivity' },
                      { name: 'AI Quantum Intelligence', description: 'Advanced AI-driven decision making' },
                      { name: 'Cloudflare Edge Computing', description: 'Global serverless deployment' },
                      { name: 'PostgreSQL + Drizzle ORM', description: 'Scalable data persistence' },
                      { name: 'Real-time WebSocket APIs', description: 'Live trading and market data' }
                    ].map((tech, index) => (
                      <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-2">{tech.name}</h4>
                        <p className="text-gray-400 text-sm">{tech.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">Platform Capabilities</h3>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-lg p-6 border border-cyan-400/20">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-3">AI Trading Orchestration</h4>
                      <p className="text-gray-300 text-sm mb-3">
                        Quantum-enhanced trading algorithms with real-time market analysis and autonomous decision-making capabilities.
                      </p>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">High-Frequency</span>
                        <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded">Profitable</span>
                        <span className="px-2 py-1 bg-purple-400/20 text-purple-400 text-xs rounded">Adaptive</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-lg p-6 border border-purple-400/20">
                      <h4 className="text-lg font-semibold text-purple-400 mb-3">Consciousness Engine</h4>
                      <p className="text-gray-300 text-sm mb-3">
                        Advanced AI consciousness simulation with emotional intelligence and adaptive learning patterns.
                      </p>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-purple-400/20 text-purple-400 text-xs rounded">Self-Aware</span>
                        <span className="px-2 py-1 bg-pink-400/20 text-pink-400 text-xs rounded">Evolving</span>
                        <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">Intelligent</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-400/10 to-emerald-500/10 rounded-lg p-6 border border-green-400/20">
                      <h4 className="text-lg font-semibold text-green-400 mb-3">GenAI Integration</h4>
                      <p className="text-gray-300 text-sm mb-3">
                        Multi-modal AI generation including text, voice, and visual content with free-tier optimization.
                      </p>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded">Free-Tier</span>
                        <span className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded">Multi-Modal</span>
                        <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded">Creative</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'architecture' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">System Architecture</h2>
              
              <div className="space-y-8">
                {/* Architecture Diagram */}
                <div className="bg-gray-900/50 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-6 text-center">Platform Architecture Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Frontend Layer */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-blue-400 text-center">Frontend Layer</h4>
                      {[
                        { name: 'React 18 SPA', icon: Globe },
                        { name: 'TypeScript', icon: Shield },
                        { name: 'Tailwind CSS', icon: Zap },
                        { name: 'Vite Build Tool', icon: Activity }
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={index} className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-4 text-center">
                            <Icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <div className="text-white text-sm">{item.name}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* API Layer */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-purple-400 text-center">API Layer</h4>
                      {[
                        { name: 'Express.js Server', icon: Network },
                        { name: 'WebSocket APIs', icon: Zap },
                        { name: 'REST Endpoints', icon: Globe },
                        { name: 'AI Orchestrator', icon: Cpu }
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={index} className="bg-purple-400/10 border border-purple-400/20 rounded-lg p-4 text-center">
                            <Icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <div className="text-white text-sm">{item.name}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Infrastructure Layer */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-green-400 text-center">Infrastructure</h4>
                      {[
                        { name: 'PostgreSQL DB', icon: Database },
                        { name: 'Cloudflare CDN', icon: Cloud },
                        { name: 'Solana Network', icon: Network },
                        { name: 'GenAI Services', icon: Cpu }
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={index} className="bg-green-400/10 border border-green-400/20 rounded-lg p-4 text-center">
                            <Icon className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <div className="text-white text-sm">{item.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Data Flow */}
                <div className="bg-gray-900/50 rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-6">Data Flow Architecture</h3>
                  <div className="space-y-4">
                    {[
                      {
                        step: '1. Market Data Ingestion',
                        description: 'Real-time market data from multiple sources including Solana RPC, Jupiter, and DeFi protocols',
                        color: 'cyan'
                      },
                      {
                        step: '2. AI Processing Pipeline',
                        description: 'Quantum intelligence engine processes market signals with consciousness-based decision making',
                        color: 'purple'
                      },
                      {
                        step: '3. Trading Execution',
                        description: 'Automated trade execution with risk management and profit optimization',
                        color: 'green'
                      },
                      {
                        step: '4. Real-time Updates',
                        description: 'WebSocket-driven live updates to frontend with portfolio and performance metrics',
                        color: 'yellow'
                      }
                    ].map((flow, index) => (
                      <div key={index} className={`bg-${flow.color}-400/10 border border-${flow.color}-400/20 rounded-lg p-4`}>
                        <h4 className={`font-semibold text-${flow.color}-400 mb-2`}>{flow.step}</h4>
                        <p className="text-gray-300 text-sm">{flow.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'status' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">System Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemStatus.map((system, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">{system.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(system.status)}`}>
                        {system.status === 'operational' && <CheckCircle className="w-4 h-4 inline-block mr-1" />}
                        {system.status === 'warning' && <AlertCircle className="w-4 h-4 inline-block mr-1" />}
                        {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Uptime</span>
                        <span className="text-green-400 font-semibold text-sm">{system.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Response Time</span>
                        <span className="text-cyan-400 font-semibold text-sm">{system.response}</span>
                      </div>
                      
                      {/* Status indicator bar */}
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            system.status === 'operational' ? 'bg-green-400' :
                            system.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: system.status === 'operational' ? '100%' : '85%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gray-900/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Recent Events</h3>
                <div className="space-y-3">
                  {[
                    { time: '2 minutes ago', event: 'AI Trading Engine: Successful trade execution (SOL/USDC)', type: 'success' },
                    { time: '15 minutes ago', event: 'Database Cluster: Automatic scaling completed', type: 'info' },
                    { time: '1 hour ago', event: 'Blockchain Network: Minor latency spike detected and resolved', type: 'warning' },
                    { time: '3 hours ago', event: 'System Maintenance: Routine backup completed successfully', type: 'success' }
                  ].map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-black/30 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        event.type === 'success' ? 'bg-green-400' :
                        event.type === 'warning' ? 'bg-yellow-400' :
                        event.type === 'error' ? 'bg-red-400' : 'bg-blue-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-gray-400 text-xs mb-1">{event.time}</div>
                        <div className="text-white text-sm">{event.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'features' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Platform Features</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[
                  {
                    category: 'Trading & Finance',
                    icon: TrendingUp,
                    color: 'green',
                    features: [
                      'High-frequency AI trading algorithms',
                      'Multi-chain DeFi protocol integration',
                      'Real-time portfolio optimization',
                      'Risk management automation',
                      'Profit tracking and analytics',
                      'Cross-chain arbitrage detection'
                    ]
                  },
                  {
                    category: 'AI & Intelligence',
                    icon: Cpu,
                    color: 'purple',
                    features: [
                      'Quantum consciousness simulation',
                      'Neural network visualization',
                      'Adaptive learning algorithms',
                      'Sentiment analysis integration',
                      'Predictive market modeling',
                      'Autonomous decision making'
                    ]
                  },
                  {
                    category: 'Infrastructure & Security',
                    icon: Shield,
                    color: 'cyan',
                    features: [
                      'Enterprise-grade security',
                      'Cloudflare edge optimization',
                      'Real-time monitoring',
                      'Automated scaling',
                      'Data encryption at rest',
                      '99.9% uptime guarantee'
                    ]
                  },
                  {
                    category: 'User Experience',
                    icon: Users,
                    color: 'yellow',
                    features: [
                      'Intuitive dashboard interface',
                      'Real-time notifications',
                      'Mobile-responsive design',
                      'Customizable layouts',
                      'Advanced charting tools',
                      'Voice interaction support'
                    ]
                  }
                ].map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div key={index} className={`bg-${category.color}-400/10 border border-${category.color}-400/20 rounded-xl p-6`}>
                      <div className="flex items-center mb-6">
                        <Icon className={`w-8 h-8 text-${category.color}-400 mr-3`} />
                        <h3 className={`text-xl font-semibold text-${category.color}-400`}>{category.category}</h3>
                      </div>
                      <div className="space-y-3">
                        {category.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <CheckCircle className={`w-4 h-4 text-${category.color}-400 mr-3 flex-shrink-0`} />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}