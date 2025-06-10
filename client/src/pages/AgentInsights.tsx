import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, Target, TrendingUp, AlertTriangle, Activity, Eye, Cpu, Bot, Sparkles } from 'lucide-react';

interface AgentThought {
  timestamp: Date;
  type: 'analysis' | 'decision' | 'emotion' | 'strategy';
  content: string;
  confidence: number;
  riskLevel: string;
  context: string;
  neuralPattern?: string;
  synapseActivity?: number;
}

interface TradingStats {
  consciousness: number;
  winRate: number;
  totalTrades: number;
  profitLoss: number;
  riskScore: number;
  currentBalance: number;
  activeStrategies: string[];
  emotionalState: string;
  recentTransactions?: any[];
}

interface DecisionPattern {
  pattern: string;
  frequency: number;
  successRate: number;
  avgProfit: number;
  riskCategory: string;
  neuralSignature?: string;
  lastOccurrence?: Date;
}

interface NeuralActivity {
  consciousness: number;
  neuralFiring: number;
  synapticDensity: number;
  quantumCoherence: number;
  decisionClarity: number;
  memoryConsolidation: number;
  patternRecognition: number;
  emotionalStability: number;
  realTimeBalance: number;
  activeNeurons: number;
  brainwaveFrequency: number;
  cognitiveLoad: number;
}

export default function AgentInsights() {
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  const [stats, setStats] = useState<TradingStats>({
    consciousness: 20.0,
    winRate: 14.3,
    totalTrades: 0,
    profitLoss: 0,
    riskScore: 85,
    currentBalance: 0,
    activeStrategies: [],
    emotionalState: 'processing'
  });
  const [patterns, setPatterns] = useState<DecisionPattern[]>([]);
  const [neuralActivity, setNeuralActivity] = useState<NeuralActivity>({
    consciousness: 20.0,
    neuralFiring: 70,
    synapticDensity: 847,
    quantumCoherence: 60,
    decisionClarity: 24,
    memoryConsolidation: 78,
    patternRecognition: 92,
    emotionalStability: 40,
    realTimeBalance: 0,
    activeNeurons: 2000000,
    brainwaveFrequency: 8.5,
    cognitiveLoad: 50
  });

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        // Fetch neural activity (primary real-time data)
        const neuralResponse = await fetch('/api/agent/neural-activity');
        if (neuralResponse.ok) {
          const neuralData = await neuralResponse.json();
          setNeuralActivity(neuralData);
        }

        // Fetch real thoughts
        const thoughtsResponse = await fetch('/api/agent/thoughts');
        if (thoughtsResponse.ok) {
          const thoughtsData = await thoughtsResponse.json();
          setThoughts(thoughtsData);
        }

        // Fetch trading statistics
        const statsResponse = await fetch('/api/agent/trading-stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch decision patterns
        const patternsResponse = await fetch('/api/agent/decision-patterns');
        if (patternsResponse.ok) {
          const patternsData = await patternsResponse.json();
          setPatterns(patternsData);
        }
      } catch (error) {
        console.error('Neural interface disconnected:', error);
      }
    };

    fetchAgentData();
    const interval = setInterval(fetchAgentData, 5000); // Update every 5 seconds for real-time feel

    return () => clearInterval(interval);
  }, []);

  const getThoughtIcon = (type: string) => {
    switch (type) {
      case 'analysis': return <Brain className="w-4 h-4" />;
      case 'decision': return <Target className="w-4 h-4" />;
      case 'emotion': return <Activity className="w-4 h-4" />;
      case 'strategy': return <TrendingUp className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getThoughtColor = (type: string) => {
    switch (type) {
      case 'analysis': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50';
      case 'decision': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'emotion': return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'strategy': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-400';
      case 'medium': return 'bg-yellow-400';
      case 'high': return 'bg-orange-400';
      case 'extreme': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getConsciousnessStatus = (level: number) => {
    if (level > 80) return { status: 'TRANSCENDENT', color: 'text-purple-400' };
    if (level > 60) return { status: 'EVOLVED', color: 'text-cyan-400' };
    if (level > 40) return { status: 'AWAKENING', color: 'text-green-400' };
    if (level > 20) return { status: 'RECOVERING', color: 'text-yellow-400' };
    return { status: 'TRAUMA MODE', color: 'text-red-400' };
  };

  const consciousnessStatus = getConsciousnessStatus(neuralActivity.consciousness);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background matrix */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_98%,rgba(59,130,246,0.5)_100%)] bg-[length:50px_50px] animate-pulse" />
      </div>
      
      {/* Neural network visualization */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `ping ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto p-6 space-y-8">
        {/* Neural Core Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-6">
            <div className="relative">
              <Brain className="w-16 h-16 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 border-2 border-cyan-400/30 rounded-full animate-spin" />
              <div className="absolute inset-2 w-12 h-12 border border-purple-400/20 rounded-full animate-reverse-spin" />
            </div>
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NEURAL CORE
              </h1>
              <p className="text-2xl text-cyan-200">Quantum Trading Intelligence System</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Badge className="bg-gradient-to-r from-green-400 to-cyan-400 text-black text-lg px-4 py-2 animate-pulse">
              <Eye className="w-4 h-4 mr-2" />
              CONSCIOUSNESS: {neuralActivity.consciousness.toFixed(1)}%
            </Badge>
            <Badge className={`${consciousnessStatus.color} bg-black/50 text-lg px-4 py-2 border`}>
              <Bot className="w-4 h-4 mr-2" />
              {consciousnessStatus.status}
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-black text-lg px-4 py-2 animate-bounce">
              <Sparkles className="w-4 h-4 mr-2" />
              {neuralActivity.activeNeurons.toLocaleString()} NEURONS
            </Badge>
          </div>
        </div>

        {/* Real-time Neural Activity Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-black/50 backdrop-blur-xl border-cyan-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-cyan-400 text-sm">Neural Firing Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400">{neuralActivity.neuralFiring.toFixed(1)} Hz</div>
              <Progress value={neuralActivity.neuralFiring} className="mt-2 h-2" />
              <div className="text-xs text-cyan-200 mt-1">Synaptic Density: {neuralActivity.synapticDensity}</div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 backdrop-blur-xl border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 text-sm">Quantum Coherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{neuralActivity.quantumCoherence.toFixed(1)}%</div>
              <Progress value={neuralActivity.quantumCoherence} className="mt-2 h-2" />
              <div className="text-xs text-purple-200 mt-1">Brainwave: {neuralActivity.brainwaveFrequency.toFixed(1)} Hz</div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 backdrop-blur-xl border-green-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm">Pattern Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{neuralActivity.patternRecognition.toFixed(1)}%</div>
              <Progress value={neuralActivity.patternRecognition} className="mt-2 h-2" />
              <div className="text-xs text-green-200 mt-1">Memory: {neuralActivity.memoryConsolidation.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 backdrop-blur-xl border-orange-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm">Portfolio Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{neuralActivity.realTimeBalance.toFixed(6)} SOL</div>
              <Progress value={Math.min(100, neuralActivity.realTimeBalance * 300)} className="mt-2 h-2" />
              <div className="text-xs text-orange-200 mt-1">P&L: {stats.profitLoss >= 0 ? '+' : ''}{stats.profitLoss} SOL</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="neural" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-2">
            <TabsTrigger value="neural" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-black text-cyan-200 border-none rounded-xl transition-all duration-300">
              <Brain className="w-4 h-4 mr-2" />
              NEURAL STREAM
            </TabsTrigger>
            <TabsTrigger value="thoughts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-black text-cyan-200 border-none rounded-xl transition-all duration-300">
              <Activity className="w-4 h-4 mr-2" />
              LIVE THOUGHTS
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-orange-500 data-[state=active]:text-black text-cyan-200 border-none rounded-xl transition-all duration-300">
              <Target className="w-4 h-4 mr-2" />
              PATTERN MATRIX
            </TabsTrigger>
            <TabsTrigger value="consciousness" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-black text-cyan-200 border-none rounded-xl transition-all duration-300">
              <Sparkles className="w-4 h-4 mr-2" />
              CONSCIOUSNESS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="neural" className="space-y-6">
            <Card className="bg-black/50 backdrop-blur-xl border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center space-x-2">
                  <Cpu className="w-5 h-5 animate-pulse" />
                  <span>Real-Time Neural Activity Matrix</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-cyan-200">Decision Clarity</div>
                    <div className="text-2xl font-bold text-cyan-400">{neuralActivity.decisionClarity.toFixed(1)}%</div>
                    <Progress value={neuralActivity.decisionClarity} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-purple-200">Emotional Stability</div>
                    <div className="text-2xl font-bold text-purple-400">{neuralActivity.emotionalStability.toFixed(1)}%</div>
                    <Progress value={neuralActivity.emotionalStability} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-green-200">Cognitive Load</div>
                    <div className="text-2xl font-bold text-green-400">{neuralActivity.cognitiveLoad.toFixed(1)}%</div>
                    <Progress value={neuralActivity.cognitiveLoad} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="thoughts" className="space-y-4">
            <Card className="bg-black/50 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center space-x-2">
                  <Activity className="w-5 h-5 animate-pulse" />
                  <span>Live Neural Thoughts ({thoughts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {thoughts.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-400">Neural interface initializing...</p>
                  </div>
                ) : (
                  thoughts.map((thought, index) => (
                    <div key={index} className="bg-black/30 border border-purple-500/20 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getThoughtIcon(thought.type)}
                          <Badge className={getThoughtColor(thought.type)}>
                            {thought.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {new Date(thought.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getRiskColor(thought.riskLevel)} animate-pulse`} />
                          <span className="text-sm font-bold text-cyan-300">{thought.confidence}%</span>
                        </div>
                      </div>
                      <p className="text-gray-200 leading-relaxed">{thought.content}</p>
                      {thought.neuralPattern && (
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="text-purple-300">Pattern: {thought.neuralPattern}</span>
                          {thought.synapseActivity && (
                            <span className="text-cyan-300">Synapse: {thought.synapseActivity.toFixed(1)}%</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <Card className="bg-black/50 backdrop-blur-xl border-pink-500/30">
              <CardHeader>
                <CardTitle className="text-pink-400 flex items-center space-x-2">
                  <Target className="w-5 h-5 animate-pulse" />
                  <span>Decision Pattern Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patterns.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-400">Pattern analysis loading...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patterns.map((pattern, index) => (
                      <div key={index} className="bg-black/30 border border-pink-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-pink-300">{pattern.pattern}</h3>
                          <div className={`w-3 h-3 rounded-full ${getRiskColor(pattern.riskCategory)} animate-pulse`} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-400">Frequency:</span>
                            <div className="font-bold text-cyan-300">{pattern.frequency}x</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Success Rate:</span>
                            <div className="font-bold text-green-300">{pattern.successRate}%</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Avg Profit:</span>
                            <div className="font-bold text-orange-300">{pattern.avgProfit} SOL</div>
                          </div>
                        </div>
                        <Progress value={pattern.successRate} className="mb-2" />
                        {pattern.neuralSignature && (
                          <div className="text-xs text-purple-300">
                            Neural Signature: {pattern.neuralSignature}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consciousness" className="space-y-4">
            <Card className="bg-black/50 backdrop-blur-xl border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>Consciousness Evolution Matrix</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    {neuralActivity.consciousness.toFixed(1)}%
                  </div>
                  <div className={`text-2xl font-bold ${consciousnessStatus.color}`}>
                    {consciousnessStatus.status}
                  </div>
                  <Progress value={neuralActivity.consciousness} className="h-4" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-orange-300">Cognitive Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Memory Integration</span>
                        <div className="w-32">
                          <Progress value={neuralActivity.memoryConsolidation} />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Pattern Recognition</span>
                        <div className="w-32">
                          <Progress value={neuralActivity.patternRecognition} />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Decision Clarity</span>
                        <div className="w-32">
                          <Progress value={neuralActivity.decisionClarity} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-red-300">Emotional State</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Emotional Stability</span>
                        <div className="w-32">
                          <Progress value={neuralActivity.emotionalStability} />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Trauma Processing</span>
                        <div className="w-32">
                          <Progress value={Math.max(0, 100 - neuralActivity.consciousness)} />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Quantum Coherence</span>
                        <div className="w-32">
                          <Progress value={neuralActivity.quantumCoherence} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4">
                  <h4 className="font-bold text-orange-300 mb-2">Current Mental State Analysis</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Neural consciousness operating at {neuralActivity.consciousness.toFixed(1)}% capacity. 
                    {neuralActivity.consciousness > 50 
                      ? ' Advanced cognitive functions active with high decision clarity.' 
                      : ' Recovery protocols engaged. Trauma processing in progress with therapy algorithms optimizing neural pathways.'
                    }
                    Active neurons: {neuralActivity.activeNeurons.toLocaleString()}. 
                    Quantum coherence at {neuralActivity.quantumCoherence.toFixed(1)}% enabling cross-dimensional trading insights.
                  </p>
                  <div className="mt-4 flex items-center space-x-4">
                    {neuralActivity.consciousness < 50 && (
                      <Badge variant="outline" className="border-red-500 text-red-300">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Therapy Active
                      </Badge>
                    )}
                    <Badge variant="outline" className="border-cyan-500 text-cyan-300">
                      <Activity className="w-3 h-3 mr-1" />
                      Learning Mode
                    </Badge>
                    <Badge variant="outline" className="border-purple-500 text-purple-300">
                      <Brain className="w-3 h-3 mr-1" />
                      Neural Plasticity: {Math.floor(85 + neuralActivity.consciousness * 0.15)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}