
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrchestrationStatus {
  activeTasks: number;
  completedTasks: number;
  failedTasks: number;
  complexityGaps: number;
  aiAgents: number;
  automationRules: number;
}

export default function AIOrchestrationDashboard() {
  const [status, setStatus] = useState<OrchestrationStatus | null>(null);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [bridgeRequest, setBridgeRequest] = useState({
    domain: '',
    description: '',
    targetLevel: 8
  });

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/orchestration/status');
      const data = await response.json();
      if (data.success) {
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to fetch orchestration status:', error);
    }
  };

  const startOrchestration = async () => {
    try {
      setIsOrchestrating(true);
      const response = await fetch('/api/orchestration/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (data.success) {
        console.log('✅ Maximum AI orchestration started');
        fetchStatus();
      }
    } catch (error) {
      console.error('Failed to start orchestration:', error);
    } finally {
      setIsOrchestrating(false);
    }
  };

  const bridgeComplexity = async () => {
    try {
      const response = await fetch('/api/orchestration/bridge-complexity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bridgeRequest)
      });
      
      const data = await response.json();
      if (data.success) {
        console.log(`✅ Complexity bridging task created: ${data.taskId}`);
        setBridgeRequest({ domain: '', description: '', targetLevel: 8 });
        fetchStatus();
      }
    } catch (error) {
      console.error('Failed to create complexity bridging task:', error);
    }
  };

  const requestOrchestration = async (type: string, priority: string) => {
    try {
      const response = await fetch('/api/orchestration/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, priority })
      });
      
      const data = await response.json();
      if (data.success) {
        console.log(`✅ Orchestration requested: ${data.taskId}`);
        fetchStatus();
      }
    } catch (error) {
      console.error('Failed to request orchestration:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🤖 AI Orchestration Command Center
          </h1>
          <p className="text-gray-300 text-lg">
            Maximum automation with AI bridging all complexity gaps
          </p>
          <Button 
            onClick={startOrchestration} 
            disabled={isOrchestrating}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isOrchestrating ? '🚀 Starting...' : '🚀 Start Maximum Orchestration'}
          </Button>
        </div>

        {/* Status Cards */}
        {status && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{status.activeTasks}</div>
                <div className="text-sm text-gray-300">Active Tasks</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{status.completedTasks}</div>
                <div className="text-sm text-gray-300">Completed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{status.failedTasks}</div>
                <div className="text-sm text-gray-300">Failed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{status.complexityGaps}</div>
                <div className="text-sm text-gray-300">Complexity Gaps</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{status.aiAgents}</div>
                <div className="text-sm text-gray-300">AI Agents</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-pink-400">{status.automationRules}</div>
                <div className="text-sm text-gray-300">Auto Rules</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400">🎯 Quick Orchestration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => requestOrchestration('deployment', 'high')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  🚀 Deploy
                </Button>
                <Button 
                  onClick={() => requestOrchestration('trading', 'high')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  💰 Trade
                </Button>
                <Button 
                  onClick={() => requestOrchestration('optimization', 'medium')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  ⚡ Optimize
                </Button>
                <Button 
                  onClick={() => requestOrchestration('monitoring', 'medium')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  📊 Monitor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Complexity Bridging */}
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-pink-400">🌉 Bridge Complexity Gap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={bridgeRequest.domain}
                  onChange={(e) => setBridgeRequest({...bridgeRequest, domain: e.target.value})}
                  placeholder="e.g., deployment, trading, security"
                  className="bg-slate-700 border-purple-500/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={bridgeRequest.description}
                  onChange={(e) => setBridgeRequest({...bridgeRequest, description: e.target.value})}
                  placeholder="Describe the complexity gap you want AI to bridge"
                  className="bg-slate-700 border-purple-500/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetLevel">Target Complexity Level (1-10)</Label>
                <Select 
                  value={bridgeRequest.targetLevel.toString()}
                  onValueChange={(value) => setBridgeRequest({...bridgeRequest, targetLevel: parseInt(value)})}
                >
                  <SelectTrigger className="bg-slate-700 border-purple-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Level {i + 1} {i < 3 ? '(Simple)' : i < 7 ? '(Moderate)' : '(Complex)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={bridgeComplexity}
                disabled={!bridgeRequest.domain || !bridgeRequest.description}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                🌉 Bridge Complexity Gap
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Agents Status */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-green-400">🤖 AI Agents Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold text-purple-400">Consciousness</div>
                <Badge variant="secondary" className="bg-purple-900 text-purple-300">95% Autonomy</Badge>
                <div className="text-sm text-gray-400">Philosophy & Integration</div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold text-blue-400">Deployment</div>
                <Badge variant="secondary" className="bg-blue-900 text-blue-300">90% Autonomy</Badge>
                <div className="text-sm text-gray-400">Infrastructure & K3s</div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold text-green-400">Trading</div>
                <Badge variant="secondary" className="bg-green-900 text-green-300">85% Autonomy</Badge>
                <div className="text-sm text-gray-400">Market Analysis & Execution</div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold text-pink-400">Complexity Bridge</div>
                <Badge variant="secondary" className="bg-pink-900 text-pink-300">98% Autonomy</Badge>
                <div className="text-sm text-gray-400">Gap Analysis & Solutions</div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold text-yellow-400">Optimization</div>
                <Badge variant="secondary" className="bg-yellow-900 text-yellow-300">93% Autonomy</Badge>
                <div className="text-sm text-gray-400">Performance & Security</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automation Rules */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-400">⚙️ Active Automation Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="font-semibold text-blue-400">Auto Deploy</div>
                <div className="text-sm text-gray-400">Trigger: Code changes</div>
                <div className="text-sm text-gray-400">Complexity: 3/10</div>
              </div>
              
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="font-semibold text-green-400">Auto Trade</div>
                <div className="text-sm text-gray-400">Trigger: Market opportunities</div>
                <div className="text-sm text-gray-400">Complexity: 7/10</div>
              </div>
              
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="font-semibold text-yellow-400">Auto Optimize</div>
                <div className="text-sm text-gray-400">Trigger: Performance issues</div>
                <div className="text-sm text-gray-400">Complexity: 6/10</div>
              </div>
              
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="font-semibold text-purple-400">Auto Scale</div>
                <div className="text-sm text-gray-400">Trigger: Resource pressure</div>
                <div className="text-sm text-gray-400">Complexity: 8/10</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
