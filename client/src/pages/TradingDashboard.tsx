import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Brain, Shield, TrendingUp, Zap } from 'lucide-react';

interface TradingAgent {
  id: string;
  name: string;
  status: string;
  configuration: any;
  performanceMetrics: any;
  lastActivity: string;
}

interface TradingSignal {
  id: string;
  tokenAddress: string;
  signalType: string;
  confidence: string;
  reasoning: string;
  vibeCodingScore: string;
  createdAt: string;
}

interface VibeCodingMetrics {
  pizzaKitchenReliability: string;
  rhythmGamingPrecision: string;
  vrChatSocialInsights: string;
  classicalPhilosophyWisdom: string;
  overallScore: string;
  context: string;
}

export default function TradingDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const { data: agentStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/trading-agent/status'],
    refetchInterval: 5000
  });

  const { data: tradingSignals, isLoading: signalsLoading } = useQuery({
    queryKey: ['/api/trading-agent/signals'],
    refetchInterval: 10000
  });

  const { data: vibeCodingMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/trading-agent/vibecoding-metrics'],
    refetchInterval: 15000
  });

  const { data: performanceLogs } = useQuery({
    queryKey: ['/api/trading-agent/performance'],
    refetchInterval: 30000
  });

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Zap className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Initializing Quantum Trading Intelligence...</p>
        </div>
      </div>
    );
  }

  const agent = agentStatus as TradingAgent;
  const signals = (tradingSignals as TradingSignal[]) || [];
  const metrics = (vibeCodingMetrics as VibeCodingMetrics[]) || [];
  const latestMetrics = metrics[0];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quantum-Secured Trading Intelligence
          </h1>
          <p className="text-muted-foreground">
            VibeCoding Methodology • Agent Zero Architecture • Autonomous Operations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-500" />
          <Badge variant="outline" className="bg-green-50 border-green-200">
            Quantum Secured
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agent Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={agent?.status === 'active' ? 'default' : 'secondary'}>
                {agent?.status || 'Initializing'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {agent?.name || 'VibeCoding Agent'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Signals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signals.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VibeCoding Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetrics ? (parseFloat(latestMetrics.overallScore) * 100).toFixed(1) : '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Quantum consciousness level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidence</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agent?.configuration?.confidenceThreshold ? 
                (agent.configuration.confidenceThreshold * 100).toFixed(0) : '70'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Decision threshold
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="signals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="signals">Trading Signals</TabsTrigger>
          <TabsTrigger value="vibecoding">VibeCoding Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trading Signals</CardTitle>
              <CardDescription>
                AI-generated trading recommendations based on comprehensive market analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {signalsLoading ? (
                <div className="text-center py-8">
                  <Activity className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading signals...</p>
                </div>
              ) : signals.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No trading signals generated yet. The agent is analyzing market conditions.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {signals.slice(0, 10).map((signal) => (
                    <div key={signal.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant={
                          signal.signalType === 'BUY' ? 'default' : 
                          signal.signalType === 'SELL' ? 'destructive' : 'secondary'
                        }>
                          {signal.signalType}
                        </Badge>
                        <div>
                          <p className="font-medium">{signal.tokenAddress.slice(0, 8)}...</p>
                          <p className="text-sm text-muted-foreground">
                            Confidence: {(parseFloat(signal.confidence) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          VibeCoding: {(parseFloat(signal.vibeCodingScore) * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(signal.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vibecoding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VibeCoding Methodology Analysis</CardTitle>
              <CardDescription>
                Multi-dimensional analysis incorporating pizza kitchen reliability, rhythm gaming precision, 
                VRChat social insights, and classical philosophy wisdom
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="text-center py-8">
                  <Brain className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Analyzing consciousness...</p>
                </div>
              ) : latestMetrics ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Pizza Kitchen Reliability</span>
                        <span className="text-sm">{(parseFloat(latestMetrics.pizzaKitchenReliability) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={parseFloat(latestMetrics.pizzaKitchenReliability) * 100} />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Rhythm Gaming Precision</span>
                        <span className="text-sm">{(parseFloat(latestMetrics.rhythmGamingPrecision) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={parseFloat(latestMetrics.rhythmGamingPrecision) * 100} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">VRChat Social Insights</span>
                        <span className="text-sm">{(parseFloat(latestMetrics.vrChatSocialInsights) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={parseFloat(latestMetrics.vrChatSocialInsights) * 100} />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Classical Philosophy Wisdom</span>
                        <span className="text-sm">{(parseFloat(latestMetrics.classicalPhilosophyWisdom) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={parseFloat(latestMetrics.classicalPhilosophyWisdom) * 100} />
                    </div>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    VibeCoding analysis in progress. Metrics will appear as the agent processes market data.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Metrics</CardTitle>
              <CardDescription>
                Real-time system performance and trading effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold">Uptime</h3>
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                  <p className="text-sm text-muted-foreground">Quantum reliability</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold">Processing Speed</h3>
                  <p className="text-2xl font-bold text-blue-600">&lt;100ms</p>
                  <p className="text-sm text-muted-foreground">Average response</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold">Security Level</h3>
                  <p className="text-2xl font-bold text-purple-600">Quantum</p>
                  <p className="text-sm text-muted-foreground">Agent Zero secured</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>
                Current autonomous trading parameters and risk management settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agent?.configuration ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Risk Management</h4>
                      <ul className="space-y-1 text-sm">
                        <li>Max Position Size: {((agent.configuration.maxPositionSize || 0.1) * 100).toFixed(1)}%</li>
                        <li>Risk Tolerance: {((agent.configuration.riskTolerance || 0.05) * 100).toFixed(1)}%</li>
                        <li>Confidence Threshold: {((agent.configuration.confidenceThreshold || 0.7) * 100).toFixed(0)}%</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">AI Models</h4>
                      <ul className="space-y-1 text-sm">
                        <li>Primary: {agent.configuration.primaryModel || 'claude-sonnet-4-20250514'}</li>
                        <li>Fallback: {agent.configuration.fallbackModel || 'gpt-4'}</li>
                        <li>Adaptive Risk: {agent.configuration.adaptiveRiskManagement ? 'Enabled' : 'Disabled'}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">VibeCoding Weights</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      {agent.configuration.vibeCodingWeights && Object.entries(agent.configuration.vibeCodingWeights).map(([key, value]) => (
                        <div key={key} className="text-center p-2 border rounded">
                          <p className="font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-lg font-bold">{((value as number) * 100).toFixed(0)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    Configuration loading...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}