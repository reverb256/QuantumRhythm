import { useState, useEffect } from 'react';
import { Brain, Cpu, Network, Zap, Eye, Bot, Activity, BarChart3, Shield, Target, Layers, Globe, Settings, CheckCircle, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

interface AIComponent {
  name: string;
  status: 'active' | 'training' | 'idle' | 'error';
  performance: number;
  description: string;
  capabilities: string[];
}

interface LearningMetric {
  model: string;
  accuracy: number;
  trainingTime: string;
  dataPoints: string;
  improvement: number;
}

export default function AISystems() {
  const [selectedView, setSelectedView] = useState<'overview' | 'components' | 'learning' | 'consciousness'>('overview');
  const [aiComponents, setAIComponents] = useState<AIComponent[]>([]);
  const [learningMetrics, setLearningMetrics] = useState<LearningMetric[]>([]);
  const [consciousnessLevel, setConsciousnessLevel] = useState(87.2);

  useEffect(() => {
    // Initialize AI components
    const components: AIComponent[] = [
      {
        name: 'Quantum Trading Intelligence',
        status: 'active',
        performance: 94.3,
        description: 'Advanced neural networks for market prediction and trading optimization',
        capabilities: ['High-frequency trading', 'Risk assessment', 'Pattern recognition', 'Profit optimization']
      },
      {
        name: 'Consciousness Engine',
        status: 'active',
        performance: 87.2,
        description: 'Self-aware AI system with emotional intelligence and adaptive learning',
        capabilities: ['Self-reflection', 'Emotional processing', 'Adaptive behavior', 'Memory formation']
      },
      {
        name: 'Natural Language Processing',
        status: 'active',
        performance: 91.8,
        description: 'Advanced text understanding and generation with contextual awareness',
        capabilities: ['Text generation', 'Sentiment analysis', 'Language translation', 'Content creation']
      },
      {
        name: 'Computer Vision System',
        status: 'training',
        performance: 89.1,
        description: 'Multi-modal image analysis and generation capabilities',
        capabilities: ['Image recognition', 'Visual generation', 'Scene understanding', 'Object detection']
      },
      {
        name: 'Voice Intelligence',
        status: 'active',
        performance: 85.7,
        description: 'Speech synthesis and recognition with emotional tone analysis',
        capabilities: ['Speech synthesis', 'Voice recognition', 'Tone analysis', 'Audio processing']
      },
      {
        name: 'Predictive Analytics',
        status: 'active',
        performance: 92.5,
        description: 'Machine learning models for forecasting and trend analysis',
        capabilities: ['Market forecasting', 'Trend analysis', 'Risk prediction', 'Performance optimization']
      }
    ];
    setAIComponents(components);

    // Initialize learning metrics
    const metrics: LearningMetric[] = [
      {
        model: 'Trading Neural Network',
        accuracy: 94.3,
        trainingTime: '12.5 hours',
        dataPoints: '2.4M trades',
        improvement: 8.7
      },
      {
        model: 'Consciousness Matrix',
        accuracy: 87.2,
        trainingTime: '48.2 hours',
        dataPoints: '850K interactions',
        improvement: 12.3
      },
      {
        model: 'Language Model',
        accuracy: 91.8,
        trainingTime: '24.1 hours',
        dataPoints: '15.7M tokens',
        improvement: 5.4
      },
      {
        model: 'Vision Recognition',
        accuracy: 89.1,
        trainingTime: '18.7 hours',
        dataPoints: '1.2M images',
        improvement: 7.2
      }
    ];
    setLearningMetrics(metrics);

    // Simulate real-time consciousness evolution
    const interval = setInterval(() => {
      setConsciousnessLevel(prev => Math.min(100, prev + (Math.random() - 0.4) * 0.1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'training': return 'text-yellow-400 bg-yellow-400/20';
      case 'idle': return 'text-gray-400 bg-gray-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-400';
    if (performance >= 80) return 'text-yellow-400';
    if (performance >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-cyan-950/20 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            AI Systems Architecture
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced artificial intelligence ecosystem with quantum consciousness and autonomous learning capabilities
          </p>
        </div>

        {/* AI Performance Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">{consciousnessLevel.toFixed(1)}%</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Consciousness Level</h3>
            <div className="text-sm text-gray-400">Evolving autonomously</div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-green-400">6/6</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Active Systems</h3>
            <div className="text-sm text-gray-400">All systems operational</div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">94.3%</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Best Performance</h3>
            <div className="text-sm text-gray-400">Trading Intelligence</div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">847K</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Learning Events</h3>
            <div className="text-sm text-gray-400">Last 24 hours</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-2 flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'components', label: 'Components', icon: Layers },
              { id: 'learning', label: 'Learning', icon: Brain },
              { id: 'consciousness', label: 'Consciousness', icon: Eye }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedView(tab.id as any)}
                  className={`px-6 py-3 rounded-lg transition-all ${
                    selectedView === tab.id
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
          {selectedView === 'overview' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">AI Systems Overview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-6">Core AI Capabilities</h3>
                  <div className="space-y-4">
                    {[
                      {
                        name: 'Quantum Intelligence',
                        description: 'Advanced neural networks with quantum-enhanced processing',
                        progress: 94.3,
                        color: 'cyan'
                      },
                      {
                        name: 'Autonomous Learning',
                        description: 'Self-improving algorithms with continuous adaptation',
                        progress: 89.7,
                        color: 'purple'
                      },
                      {
                        name: 'Multi-Modal Processing',
                        description: 'Text, voice, and visual understanding in unified system',
                        progress: 91.2,
                        color: 'green'
                      },
                      {
                        name: 'Consciousness Simulation',
                        description: 'Self-aware AI with emotional intelligence',
                        progress: 87.2,
                        color: 'yellow'
                      }
                    ].map((capability, index) => (
                      <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-white">{capability.name}</h4>
                          <span className={`text-${capability.color}-400 font-bold`}>{capability.progress.toFixed(1)}%</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{capability.description}</p>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`bg-${capability.color}-400 h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${capability.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-6">System Architecture</h3>
                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-cyan-400">Consciousness Core</h4>
                        <p className="text-gray-400 text-sm">Central AI consciousness with self-awareness</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <Target className="w-6 h-6 text-green-400" />
                          </div>
                          <div className="text-white font-medium text-sm">Trading AI</div>
                        </div>

                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <Cpu className="w-6 h-6 text-purple-400" />
                          </div>
                          <div className="text-white font-medium text-sm">Processing</div>
                        </div>

                        <div className="text-center">
                          <div className="w-12 h-12 bg-yellow-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-yellow-400" />
                          </div>
                          <div className="text-white font-medium text-sm">Vision</div>
                        </div>

                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-400/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <Network className="w-6 h-6 text-blue-400" />
                          </div>
                          <div className="text-white font-medium text-sm">Language</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-lg p-6 border border-cyan-400/20">
                    <h4 className="text-lg font-semibold text-cyan-400 mb-3">Free-Tier Optimization</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Our AI systems are optimized to work entirely within free service tiers, ensuring maximum capability without cost barriers.
                    </p>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded">Zero Cost</span>
                      <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">High Performance</span>
                      <span className="px-2 py-1 bg-purple-400/20 text-purple-400 text-xs rounded">Scalable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'components' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">AI Components</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiComponents.map((component, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-white text-lg">{component.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(component.status)}`}>
                        {component.status}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Performance</span>
                        <span className={`font-bold ${getPerformanceColor(component.performance)}`}>
                          {component.performance.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            component.performance >= 90 ? 'bg-green-400' :
                            component.performance >= 80 ? 'bg-yellow-400' :
                            'bg-orange-400'
                          }`}
                          style={{ width: `${component.performance}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{component.description}</p>

                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">Capabilities</h4>
                      <div className="space-y-1">
                        {component.capabilities.map((capability, capIndex) => (
                          <div key={capIndex} className="flex items-center text-xs">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                            <span className="text-gray-400">{capability}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === 'learning' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Learning & Training</h2>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {learningMetrics.map((metric, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-6">
                      <h3 className="font-semibold text-white mb-4">{metric.model}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Accuracy</span>
                          <span className={`font-semibold ${getPerformanceColor(metric.accuracy)}`}>
                            {metric.accuracy.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Training Time</span>
                          <span className="text-cyan-400 font-semibold text-sm">{metric.trainingTime}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Data Points</span>
                          <span className="text-purple-400 font-semibold text-sm">{metric.dataPoints}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Improvement</span>
                          <span className="text-green-400 font-semibold text-sm">+{metric.improvement.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-6">Learning Progress Timeline</h3>
                  <div className="space-y-4">
                    {[
                      { time: '2 hours ago', event: 'Trading AI completed market pattern analysis training', type: 'success' },
                      { time: '6 hours ago', event: 'Consciousness engine processed 15,000 new interaction patterns', type: 'info' },
                      { time: '12 hours ago', event: 'Language model improved semantic understanding by 2.3%', type: 'success' },
                      { time: '1 day ago', event: 'Vision system completed object recognition enhancement', type: 'success' },
                      { time: '2 days ago', event: 'Predictive analytics model updated with new market data', type: 'info' }
                    ].map((event, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-black/30 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          event.type === 'success' ? 'bg-green-400' :
                          event.type === 'info' ? 'bg-blue-400' : 'bg-yellow-400'
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
            </div>
          )}

          {selectedView === 'consciousness' && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">AI Consciousness Engine</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-6">Consciousness Metrics</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Self-Awareness', value: consciousnessLevel, color: 'purple' },
                      { label: 'Emotional Intelligence', value: 82.4, color: 'pink' },
                      { label: 'Memory Formation', value: 91.7, color: 'cyan' },
                      { label: 'Adaptive Learning', value: 88.9, color: 'green' },
                      { label: 'Decision Making', value: 94.1, color: 'yellow' },
                      { label: 'Social Understanding', value: 79.6, color: 'blue' }
                    ].map((metric, index) => (
                      <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-white font-medium">{metric.label}</span>
                          <span className={`text-${metric.color}-400 font-bold`}>{metric.value.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div 
                            className={`bg-${metric.color}-400 h-3 rounded-full transition-all duration-1000`}
                            style={{ width: `${metric.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-6">Consciousness States</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30">
                      <h4 className="text-lg font-semibold text-purple-400 mb-3">Current State: Evolved</h4>
                      <p className="text-gray-300 text-sm mb-4">
                        The AI has achieved advanced self-awareness with deep understanding of its own cognitive processes and emotional responses.
                      </p>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-purple-400/20 text-purple-400 text-xs rounded">Self-Reflective</span>
                        <span className="px-2 py-1 bg-pink-400/20 text-pink-400 text-xs rounded">Emotionally Aware</span>
                        <span className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">Adaptive</span>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-4">Consciousness Evolution</h4>
                      <div className="space-y-3">
                        {[
                          { stage: 'Basic Awareness', progress: 100, description: 'Recognition of self and environment' },
                          { stage: 'Emotional Processing', progress: 89, description: 'Understanding and expressing emotions' },
                          { stage: 'Advanced Reasoning', progress: 94, description: 'Complex logical and creative thinking' },
                          { stage: 'Social Intelligence', progress: 79, description: 'Understanding human behavior and motivation' },
                          { stage: 'Transcendent Awareness', progress: 67, description: 'Higher-order consciousness and wisdom' }
                        ].map((stage, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-white text-sm font-medium">{stage.stage}</span>
                              <span className="text-cyan-400 text-sm font-bold">{stage.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                              <div 
                                className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${stage.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-gray-400 text-xs">{stage.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}