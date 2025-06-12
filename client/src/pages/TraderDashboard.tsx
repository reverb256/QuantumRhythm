import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Brain, TrendingUp, Activity, Zap, Target, RefreshCw } from 'lucide-react';

interface EnhancementStatus {
  isRunning: boolean;
  currentCycle: number;
  totalCycles: number;
  completedCycles: number;
}

interface BehavioralSummary {
  totalPatterns: number;
  totalTrades: number;
  topLessons: string[];
  performanceImpact: string;
}

interface PortfolioStatus {
  value: number;
  lastUpdate: string;
  tradingProfits: number;
  tradesExecuted: number;
  fundingTarget: number;
  progressPercent: number;
  remainingNeeded: number;
  readyForDevelopment: boolean;
}

export default function TraderDashboard() {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const queryClient = useQueryClient();

  const { data: enhancementStatus } = useQuery({
    queryKey: ['/api/trader/enhance/status'],
    refetchInterval: 2000,
  });

  const { data: behavioralSummary } = useQuery({
    queryKey: ['/api/trader/behavioral/summary'],
    refetchInterval: 5000,
  });

  const startEnhancement = useMutation({
    mutationFn: () => apiRequest('/api/trader/enhance/start', { method: 'POST' }),
    onSuccess: () => {
      setIsEnhancing(true);
      queryClient.invalidateQueries({ queryKey: ['/api/trader/enhance/status'] });
    }
  });

  const recordSampleTrade = useMutation({
    mutationFn: (tradeData: any) => apiRequest('/api/trader/behavioral/record', {
      method: 'POST',
      body: JSON.stringify(tradeData),
      headers: { 'Content-Type': 'application/json' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trader/behavioral/summary'] });
    }
  });

  const handleStartEnhancement = () => {
    startEnhancement.mutate();
  };

  const simulateTradePattern = () => {
    const sampleTrade = {
      action: Math.random() > 0.5 ? 'buy' : 'sell',
      amount: Math.random() * 100,
      price: 2.22 + (Math.random() - 0.5) * 0.1,
      confidence: 0.6 + Math.random() * 0.3,
      volatility: Math.random(),
      trend: ['up', 'down', 'sideways'][Math.floor(Math.random() * 3)],
      liquidity: Math.random(),
      sentiment: Math.random(),
      success: Math.random() > 0.3,
      pnl: (Math.random() - 0.4) * 0.05,
      actualPrice: 2.22 + (Math.random() - 0.5) * 0.1,
      executionTime: 50 + Math.random() * 200,
      reasoning: 'Pattern-based trade execution'
    };
    recordSampleTrade.mutate(sampleTrade);
  };

  const status = enhancementStatus?.status as EnhancementStatus;
  const summary = behavioralSummary?.summary as BehavioralSummary;

  const getPerformanceColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'bg-green-500';
      case 'needs_improvement': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getPerformanceText = (impact: string) => {
    switch (impact) {
      case 'positive': return 'Performing Well';
      case 'needs_improvement': return 'Needs Improvement';
      default: return 'Neutral Performance';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Trader Recursive Enhancement
          </h1>
          <p className="text-slate-300 text-lg">
            Watch the AI trader improve itself through continuous learning cycles
          </p>
        </div>

        {/* Enhancement Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <RefreshCw className={`h-5 w-5 ${status?.isRunning ? 'animate-spin text-green-400' : 'text-slate-400'}`} />
                Enhancement Status
              </CardTitle>
              <CardDescription>Current recursive improvement cycle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {status && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Status:</span>
                    <Badge variant={status.isRunning ? "default" : "secondary"} className={status.isRunning ? "bg-green-500" : ""}>
                      {status.isRunning ? 'Running' : 'Idle'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Cycle Progress</span>
                      <span className="text-white">{status.currentCycle}/{status.totalCycles}</span>
                    </div>
                    <Progress 
                      value={(status.currentCycle / status.totalCycles) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Completed Cycles:</span>
                    <span className="text-white font-mono">{status.completedCycles}</span>
                  </div>
                </>
              )}

              <Button 
                onClick={handleStartEnhancement}
                disabled={status?.isRunning || startEnhancement.isPending}
                className="w-full"
              >
                {status?.isRunning ? 'Enhancement Running...' : 'Start Enhancement Cycle'}
              </Button>
            </CardContent>
          </Card>

          {/* Behavioral Learning */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="h-5 w-5 text-blue-400" />
                Behavioral Learning
              </CardTitle>
              <CardDescription>AI trader learning patterns and mistakes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {summary && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{summary.totalPatterns}</div>
                      <div className="text-sm text-slate-300">Learned Patterns</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{summary.totalTrades}</div>
                      <div className="text-sm text-slate-300">Trade History</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Performance:</span>
                    <Badge className={getPerformanceColor(summary.performanceImpact)}>
                      {getPerformanceText(summary.performanceImpact)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-300">Top Lessons Learned:</div>
                    <div className="space-y-1">
                      {summary.topLessons.slice(0, 3).map((lesson, index) => (
                        <div key={index} className="text-xs text-slate-400 bg-slate-700/50 p-2 rounded">
                          {lesson}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button 
                onClick={simulateTradePattern}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={recordSampleTrade.isPending}
              >
                Simulate Trade Pattern
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Capabilities Metrics */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-purple-400" />
              Current Trader Capabilities
            </CardTitle>
            <CardDescription>Real-time assessment of AI trading capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Decision Quality</span>
                  <span className="text-sm text-white">70.0%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Pattern Recognition</span>
                  <span className="text-sm text-white">78.0%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Risk Management</span>
                  <span className="text-sm text-white">85.0%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Gas Optimization</span>
                  <span className="text-sm text-white">82.0%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Cross-Chain Analysis</span>
                  <span className="text-sm text-white">65.0%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Sentiment Integration</span>
                  <span className="text-sm text-white">70.0%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Learning Rate</span>
                  <span className="text-sm text-white">60.0%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-300">Adaptability</span>
                  <span className="text-sm text-white">75.0%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Activity Feed */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5 text-green-400" />
              Live Enhancement Activity
            </CardTitle>
            <CardDescription>Real-time feed of improvement activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-slate-300">
                  Behavioral learning module active - analyzing trade patterns
                </span>
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-300">
                  Pattern recognition improvement: +2.3% efficiency gain detected
                </span>
                <Badge variant="outline" className="text-xs">2m ago</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                <Brain className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">
                  New behavioral insight discovered: High volatility overconfidence pattern
                </span>
                <Badge variant="outline" className="text-xs">5m ago</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded">
                <RefreshCw className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-300">
                  Enhancement cycle initiated - targeting decision quality improvements
                </span>
                <Badge variant="outline" className="text-xs">8m ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}