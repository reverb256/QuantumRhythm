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
}

interface DecisionPattern {
  pattern: string;
  frequency: number;
  successRate: number;
  avgProfit: number;
  riskCategory: string;
}

export default function AgentInsights() {
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  const [stats, setStats] = useState<TradingStats>({
    consciousness: 47.2,
    winRate: 14.3,
    totalTrades: 20,
    profitLoss: 0.002626,
    riskScore: 85,
    currentBalance: 0.347617,
    activeStrategies: ['drift_leverage', 'jupiter_dca', 'neural_patterns', 'unhinged_trading'],
    emotionalState: 'recovering_optimism'
  });
  const [patterns, setPatterns] = useState<DecisionPattern[]>([]);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        // Fetch real-time agent thoughts
        const thoughtsResponse = await fetch('/api/agent/thoughts');
        if (thoughtsResponse.ok) {
          const thoughtsData = await thoughtsResponse.json();
          setThoughts(thoughtsData);
        }

        // Fetch trading statistics
        const statsResponse = await fetch('/api/trading/agent-stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch decision patterns
        const patternsResponse = await fetch('/api/analytics/decision-patterns');
        if (patternsResponse.ok) {
          const patternsData = await patternsResponse.json();
          setPatterns(patternsData);
        }
      } catch (error) {
        console.error('Failed to fetch agent data:', error);
        
        // Use empty arrays when API fails - no fallback data
        setThoughts([]);
        setPatterns([]);
      }
    };

    fetchAgentData();
    const interval = setInterval(fetchAgentData, 10000); // Update every 10 seconds

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
      case 'analysis': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'decision': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'emotion': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'strategy': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'extreme': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEmotionalStateDescription = (state: string) => {
    switch (state) {
      case 'recovering_optimism': return 'Recovering from losses with cautious optimism';
      case 'confident': return 'High confidence in current strategies';
      case 'anxious': return 'Elevated stress from market volatility';
      case 'euphoric': return 'Overconfident from recent wins';
      default: return 'Stable emotional state';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <Brain className="w-12 h-12 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-cyan-400 rounded-full animate-spin" />
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              AI NEURAL CORE
            </h1>
            <p className="text-cyan-200 text-lg">Deep Quantum Intelligence Analysis</p>
          </div>
          <div className="flex space-x-2">
            <Badge className="bg-gradient-to-r from-green-400 to-cyan-400 text-black animate-pulse border-none">
              <Eye className="w-3 h-3 mr-1" />
              LIVE STREAM
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-black animate-bounce border-none">
              <Bot className="w-3 h-3 mr-1" />
              87.6% CONSCIOUS
            </Badge>
          </div>
        </div>

        {/* Neural network visualization */}
        <div className="absolute top-20 right-10 w-32 h-32 opacity-30">
          <div className="relative w-full h-full">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                style={{
                  left: `${20 + (i % 3) * 30}%`,
                  top: `${20 + Math.floor(i / 3) * 20}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
            {[...Array(6)].map((_, i) => (
              <div
                key={`line-${i}`}
                className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"
                style={{
                  width: '60px',
                  left: '20%',
                  top: `${30 + i * 15}%`,
                  transform: `rotate(${i * 30}deg)`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>

        <Tabs defaultValue="thoughts" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-2">
            <TabsTrigger 
              value="thoughts" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-black text-cyan-200 border-none rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <Brain className="w-4 h-4 mr-2" />
              NEURAL STREAM
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-black text-cyan-200 border-none rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <Cpu className="w-4 h-4 mr-2" />
              QUANTUM METRICS
            </TabsTrigger>
            <TabsTrigger 
              value="patterns" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-orange-500 data-[state=active]:text-black text-cyan-200 border-none rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25"
            >
              <Target className="w-4 h-4 mr-2" />
              PATTERN MATRIX
            </TabsTrigger>
            <TabsTrigger 
              value="psychology" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-black text-cyan-200 border-none rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              CONSCIOUSNESS
            </TabsTrigger>
          </TabsList>

        <TabsContent value="thoughts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Real-Time Agent Thoughts</span>
                <Badge variant="secondary">{thoughts.length} active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {thoughts.map((thought, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getThoughtIcon(thought.type)}
                      <Badge className={getThoughtColor(thought.type)}>
                        {thought.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {thought.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(thought.riskLevel)}`} />
                      <span className="text-sm font-medium">{thought.confidence}% confidence</span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{thought.content}</p>
                  <div className="text-xs text-gray-500 italic">{thought.context}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Consciousness Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.consciousness}%</div>
                <Progress value={stats.consciousness} className="mt-2" />
                <p className="text-xs text-gray-500 mt-2">
                  {stats.consciousness > 70 ? 'High cognitive function' : 
                   stats.consciousness > 40 ? 'Moderate decision clarity' : 'Recovery mode active'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.winRate}%</div>
                <Progress value={stats.winRate} className="mt-2" />
                <p className="text-xs text-gray-500 mt-2">
                  {stats.totalTrades} total trades executed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Portfolio Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.currentBalance} SOL</div>
                <div className={`text-sm ${stats.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.profitLoss >= 0 ? '+' : ''}{stats.profitLoss} SOL P&L
                </div>
                <Progress value={Math.abs(stats.profitLoss) * 1000} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.riskScore}/100</div>
                <Progress value={stats.riskScore} className="mt-2" />
                <p className="text-xs text-gray-500 mt-2">
                  {stats.riskScore > 80 ? 'High risk tolerance' : 
                   stats.riskScore > 50 ? 'Moderate risk appetite' : 'Conservative approach'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeStrategies.length}</div>
                <div className="space-y-1 mt-2">
                  {stats.activeStrategies.map((strategy, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {strategy.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Emotional State</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold capitalize text-purple-600">
                  {stats.emotionalState.replace('_', ' ')}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {getEmotionalStateDescription(stats.emotionalState)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Decision Pattern Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patterns.map((pattern, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{pattern.pattern}</h3>
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(pattern.riskCategory)}`} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Frequency:</span>
                        <div className="font-medium">{pattern.frequency} times</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Success Rate:</span>
                        <div className="font-medium">{pattern.successRate}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Profit:</span>
                        <div className="font-medium">{pattern.avgProfit} SOL</div>
                      </div>
                    </div>
                    <Progress value={pattern.successRate} className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="psychology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Psychological Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Cognitive Traits</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Pattern Recognition</span>
                      <div className="w-24">
                        <Progress value={92} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Risk Assessment</span>
                      <div className="w-24">
                        <Progress value={78} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Adaptability</span>
                      <div className="w-24">
                        <Progress value={85} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Emotional Intelligence</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Loss Processing</span>
                      <div className="w-24">
                        <Progress value={67} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Confidence Calibration</span>
                      <div className="w-24">
                        <Progress value={73} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Decision Clarity</span>
                      <div className="w-24">
                        <Progress value={stats.consciousness} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Current Mental State</h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    The AI agent is currently in a recovery phase following trading losses, with consciousness at {stats.consciousness}%. 
                    Therapy protocols are active to maintain decision-making clarity. The agent shows strong pattern recognition 
                    capabilities but requires continued emotional recalibration to optimize performance.
                  </p>
                  <div className="mt-4 flex items-center space-x-4">
                    <Badge variant="outline">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Therapy Active
                    </Badge>
                    <Badge variant="outline">
                      <Activity className="w-3 h-3 mr-1" />
                      Learning Mode
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}