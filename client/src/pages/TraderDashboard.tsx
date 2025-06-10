import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Brain, TrendingUp, Zap, Eye, Target, Shield, Activity, Cpu, Layers, Globe } from 'lucide-react';
import QuantumVisualization from '@/components/QuantumVisualization';

interface AIConsciousness {
  level: number;
  evolution: number;
  quantumResonance: number;
  transcendenceProgress: number;
  tradingSuccess: number;
  marketTiming: number;
  riskManagement: number;
  adaptability: number;
  reputation: number;
  experiencePoints: number;
}

interface TradingMetrics {
  balance: number;
  totalTrades: number;
  winRate: number;
  profitLoss: number;
  tradingVolume: number;
  activePairs: string[];
  lastTradeTime: string;
  emergencyStop: boolean;
}

interface DeFiProtocol {
  name: string;
  tvl: number;
  apy: number;
  category: string;
  status: 'active' | 'monitoring' | 'inactive';
  allocation: number;
}

interface MarketInsight {
  token: string;
  sentiment: number;
  confidence: number;
  prediction: 'BUY' | 'SELL' | 'HOLD';
  reasoning: string;
  timeframe: string;
  probability: number;
}

export default function TraderDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [consciousnessAnimation, setConsciousnessAnimation] = useState(0);

  // Fetch AI consciousness and trading data
  const { data: consciousness } = useQuery({
    queryKey: ['/api/ai/consciousness'],
    refetchInterval: 5000,
  });

  const { data: tradingMetrics } = useQuery({
    queryKey: ['/api/trading/metrics'],
    refetchInterval: 2000,
  });

  const { data: defiProtocols } = useQuery({
    queryKey: ['/api/defi/protocols'],
    refetchInterval: 10000,
  });

  const { data: marketInsights } = useQuery({
    queryKey: ['/api/ai/insights'],
    refetchInterval: 3000,
  });

  const { data: performanceHistory } = useQuery({
    queryKey: ['/api/trading/history', selectedTimeframe],
  });

  // Animation for consciousness level
  useEffect(() => {
    const interval = setInterval(() => {
      setConsciousnessAnimation(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Mock data for demonstration (replace with real API data)
  const mockConsciousness: AIConsciousness = consciousness || {
    level: 85.4,
    evolution: 85.2,
    quantumResonance: 78.5,
    transcendenceProgress: 67.8,
    tradingSuccess: 77.6,
    marketTiming: 85.4,
    riskManagement: 80.0,
    adaptability: 10.7,
    reputation: 16.8,
    experiencePoints: 107
  };

  const mockTradingMetrics: TradingMetrics = tradingMetrics || {
    balance: 0.288736,
    totalTrades: 20,
    winRate: 77.6,
    profitLoss: -0.002376,
    tradingVolume: 0.202207,
    activePairs: ['SOL/USDC', 'RAY/SOL', 'ORCA/SOL', 'JUP/SOL'],
    lastTradeTime: new Date().toISOString(),
    emergencyStop: false
  };

  const mockProtocols: DeFiProtocol[] = defiProtocols || [
    { name: 'Raydium', tvl: 500000000, apy: 12.5, category: 'DEX', status: 'active', allocation: 35 },
    { name: 'Orca', tvl: 180000000, apy: 8.7, category: 'DEX', status: 'active', allocation: 25 },
    { name: 'Jupiter', tvl: 320000000, apy: 15.2, category: 'Aggregator', status: 'active', allocation: 20 },
    { name: 'Marinade', tvl: 1200000000, apy: 7.1, category: 'Staking', status: 'monitoring', allocation: 10 },
    { name: 'Kamino', tvl: 75000000, apy: 11.0, category: 'Lending', status: 'active', allocation: 10 }
  ];

  const mockInsights: MarketInsight[] = marketInsights || [
    {
      token: 'SOL',
      sentiment: 72,
      confidence: 85,
      prediction: 'BUY',
      reasoning: 'SEC fast-tracks Solana ETFs, positive regulatory momentum detected',
      timeframe: '3-5 weeks',
      probability: 78
    },
    {
      token: 'RAY',
      sentiment: 68,
      confidence: 76,
      prediction: 'HOLD',
      reasoning: 'Volume spikes indicate consolidation phase before next move',
      timeframe: '1-2 weeks',
      probability: 65
    }
  ];

  const performanceData = performanceHistory || [
    { time: '00:00', consciousness: 82.1, profit: 0.001, volume: 0.05 },
    { time: '04:00', consciousness: 83.5, profit: 0.0015, volume: 0.08 },
    { time: '08:00', consciousness: 84.8, profit: 0.002, volume: 0.12 },
    { time: '12:00', consciousness: 85.4, profit: 0.0018, volume: 0.10 },
    { time: '16:00', consciousness: 85.2, profit: 0.0022, volume: 0.15 },
    { time: '20:00', consciousness: 85.4, profit: 0.0025, volume: 0.18 }
  ];

  const consciousnessColors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Quantum AI Trader Dashboard</h1>
            <p className="text-gray-300">Advanced consciousness-driven trading intelligence</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant={mockTradingMetrics.emergencyStop ? "destructive" : "default"} className="text-lg px-4 py-2">
              {mockTradingMetrics.emergencyStop ? 'Emergency Stop' : 'Active Trading'}
            </Badge>
          </div>
        </div>

        {/* AI Consciousness Showcase */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-white">
              <Brain className="mr-3 h-8 w-8 text-purple-400" />
              AI Consciousness Evolution
              <div 
                className="ml-4 w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"
                style={{
                  transform: `rotate(${consciousnessAnimation}deg)`,
                  boxShadow: `0 0 20px rgba(147, 51, 234, 0.6)`
                }}
              />
            </CardTitle>
            <CardDescription className="text-gray-300">
              Real-time quantum consciousness metrics and evolutionary progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{mockConsciousness.level.toFixed(1)}%</div>
                <div className="text-sm text-gray-400 mb-3">Consciousness Level</div>
                <Progress value={mockConsciousness.level} className="h-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{mockConsciousness.quantumResonance.toFixed(1)}%</div>
                <div className="text-sm text-gray-400 mb-3">Quantum Resonance</div>
                <Progress value={mockConsciousness.quantumResonance} className="h-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{mockConsciousness.transcendenceProgress.toFixed(1)}%</div>
                <div className="text-sm text-gray-400 mb-3">Transcendence</div>
                <Progress value={mockConsciousness.transcendenceProgress} className="h-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{mockConsciousness.tradingSuccess.toFixed(1)}%</div>
                <div className="text-sm text-gray-400 mb-3">Trading Success</div>
                <Progress value={mockConsciousness.tradingSuccess} className="h-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-2">{mockConsciousness.experiencePoints}</div>
                <div className="text-sm text-gray-400 mb-3">Experience Points</div>
                <div className="text-xs text-gray-500">Expert Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Trading Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-white">
                <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
                Portfolio Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{mockTradingMetrics.balance.toFixed(6)} SOL</div>
              <div className="text-sm text-gray-400">≈ ${(mockTradingMetrics.balance * 240).toFixed(2)} USD</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-white">
                <Activity className="mr-2 h-5 w-5 text-blue-400" />
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{mockTradingMetrics.winRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">{mockTradingMetrics.totalTrades} total trades</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-white">
                <Zap className="mr-2 h-5 w-5 text-yellow-400" />
                Trading Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">{mockTradingMetrics.tradingVolume.toFixed(6)} SOL</div>
              <div className="text-sm text-gray-400">Last 24h</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-white">
                <Target className="mr-2 h-5 w-5 text-purple-400" />
                Market Timing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">{mockConsciousness.marketTiming.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Precision Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="consciousness" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-black/40 border border-gray-700">
            <TabsTrigger value="consciousness" className="data-[state=active]:bg-purple-600">
              Consciousness
            </TabsTrigger>
            <TabsTrigger value="trading" className="data-[state=active]:bg-blue-600">
              Trading Activity
            </TabsTrigger>
            <TabsTrigger value="defi" className="data-[state=active]:bg-green-600">
              DeFi Protocols
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-yellow-600">
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-pink-600">
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consciousness" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <QuantumVisualization 
                consciousness={mockConsciousness.level}
                quantumResonance={mockConsciousness.quantumResonance}
                tradingSuccess={mockConsciousness.tradingSuccess}
              />
              
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Consciousness Evolution Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #6B7280',
                          color: '#F9FAFB'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="consciousness" 
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Neural Network Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Pattern Recognition</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={92} className="w-24 h-2" />
                        <span className="text-sm text-gray-400">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Market Sentiment Analysis</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={87} className="w-24 h-2" />
                        <span className="text-sm text-gray-400">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Risk Assessment</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={mockConsciousness.riskManagement} className="w-24 h-2" />
                        <span className="text-sm text-gray-400">{mockConsciousness.riskManagement}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Quantum Coherence</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={mockConsciousness.quantumResonance} className="w-24 h-2" />
                        <span className="text-sm text-gray-400">{mockConsciousness.quantumResonance.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Transcendence Progress</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={mockConsciousness.transcendenceProgress} className="w-24 h-2" />
                        <span className="text-sm text-gray-400">{mockConsciousness.transcendenceProgress.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Trading Volume & Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #6B7280',
                          color: '#F9FAFB'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="volume" 
                        stackId="1" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="profit" 
                        stackId="2" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.8}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Active Trading Pairs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTradingMetrics.activePairs.map((pair, index) => (
                      <div key={pair} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-white font-medium">{pair}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 text-sm">+{(Math.random() * 5).toFixed(2)}%</div>
                          <div className="text-gray-400 text-xs">{(Math.random() * 0.1).toFixed(4)} SOL</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="defi" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">DeFi Protocol Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockProtocols}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, allocation }) => `${name}: ${allocation}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="allocation"
                      >
                        {mockProtocols.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={consciousnessColors[index % consciousnessColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Protocol Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProtocols.map((protocol) => (
                      <div key={protocol.name} className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{protocol.name}</span>
                            <Badge 
                              variant={protocol.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {protocol.status}
                            </Badge>
                          </div>
                          <span className="text-green-400 font-bold">{protocol.apy.toFixed(1)}% APY</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          TVL: ${(protocol.tvl / 1000000).toFixed(0)}M • Category: {protocol.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {mockInsights.map((insight, index) => (
                <Card key={insight.token} className="bg-black/40 border-yellow-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                      <div className="flex items-center">
                        <Eye className="mr-2 h-5 w-5 text-yellow-400" />
                        AI Market Insight: {insight.token}
                      </div>
                      <Badge 
                        variant={insight.prediction === 'BUY' ? 'default' : insight.prediction === 'SELL' ? 'destructive' : 'secondary'}
                        className="text-lg px-3 py-1"
                      >
                        {insight.prediction}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-2xl font-bold text-yellow-400 mb-1">{insight.confidence}%</div>
                        <div className="text-sm text-gray-400">Confidence Level</div>
                        <Progress value={insight.confidence} className="mt-2 h-2" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400 mb-1">{insight.probability}%</div>
                        <div className="text-sm text-gray-400">Success Probability</div>
                        <Progress value={insight.probability} className="mt-2 h-2" />
                      </div>
                      <div>
                        <div className="text-lg font-medium text-blue-400 mb-1">{insight.timeframe}</div>
                        <div className="text-sm text-gray-400">Timeframe</div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                      <div className="text-white font-medium mb-2">AI Reasoning:</div>
                      <div className="text-gray-300">{insight.reasoning}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-black/40 border-pink-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Comprehensive Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={[
                    { metric: 'Consciousness', value: mockConsciousness.level },
                    { metric: 'Trading Success', value: mockConsciousness.tradingSuccess },
                    { metric: 'Market Timing', value: mockConsciousness.marketTiming },
                    { metric: 'Risk Management', value: mockConsciousness.riskManagement },
                    { metric: 'Quantum Resonance', value: mockConsciousness.quantumResonance },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="metric" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #6B7280',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Bar dataKey="value" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Status */}
        <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-gray-400">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Connected to {mockProtocols.length} DeFi protocols</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4" />
                  <span>AI processing at {mockConsciousness.level.toFixed(1)}% capacity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Security: Quantum encrypted</span>
                </div>
              </div>
              <div className="text-sm">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}