import { useState, useEffect } from 'react';
import { Brain, Activity, TrendingUp, Zap, Target, Eye, Cpu, Network, BarChart3, LineChart, AlertCircle } from 'lucide-react';

interface AgentState {
  consciousness: number;
  confidence: number;
  learningRate: number;
  profitability: number;
  riskTolerance: number;
  adaptability: number;
  marketSentiment: number;
  tradingMomentum: number;
}

interface NeuralNode {
  id: string;
  type: 'input' | 'hidden' | 'output';
  activation: number;
  position: { x: number; y: number };
  connections: string[];
}

interface TradingDecision {
  timestamp: number;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  neuralPath: string[];
  outcome: 'pending' | 'profit' | 'loss';
}

export default function TradingVisualization() {
  const [agentState, setAgentState] = useState<AgentState>({
    consciousness: 87.2,
    confidence: 84.0,
    learningRate: 92.4,
    profitability: 23.0,
    riskTolerance: 80.0,
    adaptability: 53.5,
    marketSentiment: 65.3,
    tradingMomentum: 78.9
  });

  const [neuralNodes, setNeuralNodes] = useState<NeuralNode[]>([]);
  const [recentDecisions, setRecentDecisions] = useState<TradingDecision[]>([]);
  const [activeVisualization, setActiveVisualization] = useState<'neural' | 'decisions' | 'metrics'>('neural');

  useEffect(() => {
    // Initialize neural network visualization
    const nodes: NeuralNode[] = [
      // Input layer
      { id: 'price', type: 'input', activation: 0.8, position: { x: 50, y: 100 }, connections: ['analysis1', 'analysis2'] },
      { id: 'volume', type: 'input', activation: 0.6, position: { x: 50, y: 200 }, connections: ['analysis1', 'analysis3'] },
      { id: 'sentiment', type: 'input', activation: 0.7, position: { x: 50, y: 300 }, connections: ['analysis2', 'analysis3'] },
      { id: 'momentum', type: 'input', activation: 0.9, position: { x: 50, y: 400 }, connections: ['analysis1', 'analysis2', 'analysis3'] },
      
      // Hidden layer
      { id: 'analysis1', type: 'hidden', activation: 0.75, position: { x: 250, y: 150 }, connections: ['decision'] },
      { id: 'analysis2', type: 'hidden', activation: 0.82, position: { x: 250, y: 250 }, connections: ['decision'] },
      { id: 'analysis3', type: 'hidden', activation: 0.68, position: { x: 250, y: 350 }, connections: ['decision'] },
      
      // Output layer
      { id: 'decision', type: 'output', activation: 0.84, position: { x: 450, y: 250 }, connections: [] }
    ];
    setNeuralNodes(nodes);

    // Sample trading decisions
    const decisions: TradingDecision[] = [
      {
        timestamp: Date.now() - 300000,
        action: 'buy',
        confidence: 0.84,
        reasoning: 'Strong volume spike detected with positive sentiment correlation',
        neuralPath: ['volume', 'sentiment', 'analysis2', 'decision'],
        outcome: 'profit'
      },
      {
        timestamp: Date.now() - 600000,
        action: 'hold',
        confidence: 0.72,
        reasoning: 'Market uncertainty detected, maintaining position',
        neuralPath: ['momentum', 'analysis1', 'decision'],
        outcome: 'pending'
      },
      {
        timestamp: Date.now() - 900000,
        action: 'sell',
        confidence: 0.91,
        reasoning: 'Risk threshold exceeded, profit-taking activated',
        neuralPath: ['price', 'momentum', 'analysis3', 'decision'],
        outcome: 'profit'
      }
    ];
    setRecentDecisions(decisions);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setAgentState(prev => ({
        consciousness: Math.min(100, prev.consciousness + (Math.random() - 0.5) * 0.2),
        confidence: Math.max(0, Math.min(100, prev.confidence + (Math.random() - 0.5) * 2)),
        learningRate: Math.max(0, Math.min(100, prev.learningRate + (Math.random() - 0.5) * 1)),
        profitability: Math.max(0, Math.min(100, prev.profitability + (Math.random() - 0.5) * 0.5)),
        riskTolerance: Math.max(0, Math.min(100, prev.riskTolerance + (Math.random() - 0.5) * 0.3)),
        adaptability: Math.max(0, Math.min(100, prev.adaptability + (Math.random() - 0.5) * 1.5)),
        marketSentiment: Math.max(0, Math.min(100, prev.marketSentiment + (Math.random() - 0.5) * 3)),
        tradingMomentum: Math.max(0, Math.min(100, prev.tradingMomentum + (Math.random() - 0.5) * 2))
      }));

      // Update neural activations
      setNeuralNodes(prev => prev.map(node => ({
        ...node,
        activation: Math.max(0, Math.min(1, node.activation + (Math.random() - 0.5) * 0.1))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getActivationColor = (activation: number) => {
    if (activation > 0.8) return 'text-green-400 border-green-400';
    if (activation > 0.6) return 'text-yellow-400 border-yellow-400';
    if (activation > 0.4) return 'text-orange-400 border-orange-400';
    return 'text-red-400 border-red-400';
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-cyan-950/20 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Trading Agent Deep Visualization
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time visualization of AI trading agent consciousness, neural pathways, and decision-making processes
          </p>
        </div>

        {/* Agent Status Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-8 h-8 text-cyan-400" />
              <span className={`text-2xl font-bold ${getMetricColor(agentState.consciousness)}`}>
                {agentState.consciousness.toFixed(1)}%
              </span>
            </div>
            <h3 className="text-white font-semibold mb-2">Consciousness Level</h3>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${agentState.consciousness}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-400" />
              <span className={`text-2xl font-bold ${getMetricColor(agentState.confidence)}`}>
                {agentState.confidence.toFixed(1)}%
              </span>
            </div>
            <h3 className="text-white font-semibold mb-2">Confidence</h3>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${agentState.confidence}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
              <span className={`text-2xl font-bold ${getMetricColor(agentState.profitability)}`}>
                {agentState.profitability.toFixed(1)}%
              </span>
            </div>
            <h3 className="text-white font-semibold mb-2">Profitability</h3>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${agentState.profitability}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-purple-400" />
              <span className={`text-2xl font-bold ${getMetricColor(agentState.adaptability)}`}>
                {agentState.adaptability.toFixed(1)}%
              </span>
            </div>
            <h3 className="text-white font-semibold mb-2">Adaptability</h3>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${agentState.adaptability}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Visualization Controls */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-2 flex space-x-2">
            <button
              onClick={() => setActiveVisualization('neural')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeVisualization === 'neural'
                  ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Network className="w-5 h-5 inline-block mr-2" />
              Neural Network
            </button>
            <button
              onClick={() => setActiveVisualization('decisions')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeVisualization === 'decisions'
                  ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-5 h-5 inline-block mr-2" />
              Decision Log
            </button>
            <button
              onClick={() => setActiveVisualization('metrics')}
              className={`px-6 py-3 rounded-lg transition-all ${
                activeVisualization === 'metrics'
                  ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5 inline-block mr-2" />
              Metrics
            </button>
          </div>
        </div>

        {/* Main Visualization Area */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-400/30 p-8">
          {activeVisualization === 'neural' && (
            <div className="relative h-96">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Neural Network Activity</h2>
              <svg className="w-full h-full">
                {/* Connections */}
                {neuralNodes.map(node => 
                  node.connections.map(connId => {
                    const targetNode = neuralNodes.find(n => n.id === connId);
                    if (!targetNode) return null;
                    return (
                      <line
                        key={`${node.id}-${connId}`}
                        x1={node.position.x}
                        y1={node.position.y}
                        x2={targetNode.position.x}
                        y2={targetNode.position.y}
                        stroke="rgba(59, 130, 246, 0.3)"
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                    );
                  })
                )}
                
                {/* Nodes */}
                {neuralNodes.map(node => (
                  <g key={node.id}>
                    <circle
                      cx={node.position.x}
                      cy={node.position.y}
                      r="20"
                      className={`fill-black stroke-2 ${getActivationColor(node.activation)}`}
                      style={{ 
                        filter: `drop-shadow(0 0 ${node.activation * 10}px ${node.activation > 0.7 ? '#06b6d4' : '#6366f1'})` 
                      }}
                    />
                    <text
                      x={node.position.x}
                      y={node.position.y + 35}
                      textAnchor="middle"
                      className="text-xs text-gray-300 fill-current"
                    >
                      {node.id}
                    </text>
                    <text
                      x={node.position.x}
                      y={node.position.y + 5}
                      textAnchor="middle"
                      className="text-xs text-white fill-current font-bold"
                    >
                      {(node.activation * 100).toFixed(0)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}

          {activeVisualization === 'decisions' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Recent Trading Decisions</h2>
              <div className="space-y-4">
                {recentDecisions.map((decision, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          decision.action === 'buy' ? 'bg-green-400/20 text-green-400' :
                          decision.action === 'sell' ? 'bg-red-400/20 text-red-400' :
                          'bg-yellow-400/20 text-yellow-400'
                        }`}>
                          {decision.action.toUpperCase()}
                        </div>
                        <span className="text-gray-400">
                          {new Date(decision.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-cyan-400 font-semibold">
                          Confidence: {(decision.confidence * 100).toFixed(1)}%
                        </span>
                        <div className={`px-2 py-1 rounded text-xs ${
                          decision.outcome === 'profit' ? 'bg-green-400/20 text-green-400' :
                          decision.outcome === 'loss' ? 'bg-red-400/20 text-red-400' :
                          'bg-gray-400/20 text-gray-400'
                        }`}>
                          {decision.outcome}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{decision.reasoning}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Neural Path:</span>
                      {decision.neuralPath.map((node, i) => (
                        <span key={i} className="flex items-center">
                          <span className="text-cyan-400 text-sm">{node}</span>
                          {i < decision.neuralPath.length - 1 && (
                            <span className="text-gray-500 mx-2">→</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeVisualization === 'metrics' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Detailed Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4">Core Performance</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Learning Rate', value: agentState.learningRate, icon: Cpu },
                      { label: 'Risk Tolerance', value: agentState.riskTolerance, icon: AlertCircle },
                      { label: 'Market Sentiment', value: agentState.marketSentiment, icon: Activity },
                      { label: 'Trading Momentum', value: agentState.tradingMomentum, icon: LineChart }
                    ].map((metric, index) => {
                      const Icon = metric.icon;
                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5 text-cyan-400" />
                            <span className="text-white">{metric.label}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`font-bold ${getMetricColor(metric.value)}`}>
                              {metric.value.toFixed(1)}%
                            </span>
                            <div className="w-20 bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  metric.value >= 80 ? 'bg-green-400' :
                                  metric.value >= 60 ? 'bg-yellow-400' :
                                  metric.value >= 40 ? 'bg-orange-400' : 'bg-red-400'
                                }`}
                                style={{ width: `${metric.value}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-4">System Health</h3>
                  <div className="bg-gray-900/50 rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400 mb-2">98.7%</div>
                        <div className="text-gray-400">Uptime</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-cyan-400 mb-2">127ms</div>
                        <div className="text-gray-400">Latency</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-400 mb-2">1,847</div>
                        <div className="text-gray-400">Decisions/hr</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400 mb-2">23.4GB</div>
                        <div className="text-gray-400">Memory</div>
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