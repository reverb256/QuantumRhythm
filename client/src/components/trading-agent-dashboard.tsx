import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Activity, Brain, TrendingUp, Zap, Play, Pause, BarChart3, Clock } from 'lucide-react';

interface AgentStatus {
  agent: {
    id: string;
    name: string;
    status: string;
    lastActivity: string;
    performanceMetrics: any;
  };
  isRunning: boolean;
  vibeCodingMetrics: {
    pizzaKitchen: number;
    rhythmGaming: number;
    vrChatSocial: number;
    classicalPhilosophy: number;
    overall: number;
  };
  activeDataSources: string[];
}

interface TradingSignal {
  id: string;
  signalType: string;
  confidence: number;
  vibeCodingScore: number;
  tokenAddress: string;
  reasoning: string[];
  createdAt: string;
  executed: boolean;
}

export default function TradingAgentDashboard() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAgentStatus();
    fetchRecentSignals();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchAgentStatus();
      fetchRecentSignals();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch('/api/trading-agent/status');
      const data = await response.json();
      if (data.success) {
        setAgentStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to fetch agent status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSignals = async () => {
    try {
      const response = await fetch('/api/trading-agent/signals?limit=10');
      const data = await response.json();
      if (data.success) {
        setSignals(data.signals);
      }
    } catch (error) {
      console.error('Failed to fetch signals:', error);
    }
  };

  const toggleAgent = async (action: 'start' | 'pause') => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/trading-agent/${action}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        await fetchAgentStatus();
      }
    } catch (error) {
      console.error(`Failed to ${action} agent:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'disabled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSignalTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'BUY': case 'STRONG_BUY': return 'bg-green-500';
      case 'SELL': case 'STRONG_SELL': return 'bg-red-500';
      case 'HOLD': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  return (
    <section id="trading-agent" className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Permanent Trading Agent
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Quantum hyper-empowered trading intelligence with VibeCoding methodology. 
          Always-on monitoring with RSS feeds, live on-chain data, and multi-source analysis.
        </p>
      </motion.div>

      {/* Agent Status */}
      {agentStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(agentStatus.agent.status)}`}></div>
                  <CardTitle className="text-white">{agentStatus.agent.name}</CardTitle>
                  <Badge variant={agentStatus.isRunning ? 'default' : 'secondary'}>
                    {agentStatus.isRunning ? 'RUNNING' : 'STOPPED'}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => toggleAgent(agentStatus.isRunning ? 'pause' : 'start')}
                    disabled={actionLoading}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:border-cyan-500"
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                    ) : agentStatus.isRunning ? (
                      <><Pause className="w-4 h-4 mr-2" />Pause</>
                    ) : (
                      <><Play className="w-4 h-4 mr-2" />Start</>
                    )}
                  </Button>
                </div>
              </div>
              <CardDescription>
                Last activity: {new Date(agentStatus.agent.lastActivity).toLocaleString()}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* VibeCoding Methodology Metrics */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">VibeCoding Methodology Scores</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-orange-400" />
                      <span className="text-xs text-gray-400">Pizza Kitchen</span>
                    </div>
                    <div className="text-lg font-bold text-orange-400">
                      {(agentStatus.vibeCodingMetrics.pizzaKitchen * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Reliability</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-gray-400">Rhythm Gaming</span>
                    </div>
                    <div className="text-lg font-bold text-yellow-400">
                      {(agentStatus.vibeCodingMetrics.rhythmGaming * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Precision</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-400">VRChat Social</span>
                    </div>
                    <div className="text-lg font-bold text-blue-400">
                      {(agentStatus.vibeCodingMetrics.vrChatSocial * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Social Insights</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-gray-400">Philosophy</span>
                    </div>
                    <div className="text-lg font-bold text-purple-400">
                      {(agentStatus.vibeCodingMetrics.classicalPhilosophy * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Wisdom</div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Overall VibeCoding Score</span>
                    <span className="text-xl font-bold text-cyan-400">
                      {(agentStatus.vibeCodingMetrics.overall * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Data Sources */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Active Data Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {agentStatus.activeDataSources.map((source) => (
                    <Badge key={source} variant="outline" className="border-gray-600 text-gray-300">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Trading Signals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Recent Trading Signals
            </CardTitle>
            <CardDescription>
              AI-generated trading recommendations with VibeCoding analysis
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {signals.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No trading signals generated yet
              </div>
            ) : (
              <div className="space-y-4">
                {signals.map((signal) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getSignalTypeColor(signal.signalType)} text-white`}>
                          {signal.signalType}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {signal.tokenAddress.slice(0, 8)}...
                        </span>
                        <Badge variant={signal.executed ? 'default' : 'outline'}>
                          {signal.executed ? 'Executed' : 'Pending'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-gray-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {new Date(signal.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-xs text-gray-400">Confidence</span>
                        <div className="text-lg font-bold text-green-400">
                          {(Number(signal.confidence) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">VibeCoding Score</span>
                        <div className="text-lg font-bold text-cyan-400">
                          {(Number(signal.vibeCodingScore) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    {Array.isArray(signal.reasoning) && signal.reasoning.length > 0 && (
                      <div className="text-xs text-gray-400 space-y-1">
                        {signal.reasoning.slice(0, 2).map((reason, index) => (
                          <div key={index}>• {reason}</div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Methodology Explanation */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Quantum Hyper-Empowered Trading Intelligence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong className="text-orange-400">Pizza Kitchen Reliability:</strong>
              <p>Consistent system performance and data quality validation like reliable food service</p>
            </div>
            <div>
              <strong className="text-yellow-400">Rhythm Gaming Precision:</strong>
              <p>Microsecond-accurate timing and frame-perfect execution from gaming mastery</p>
            </div>
            <div>
              <strong className="text-blue-400">VRChat Social Research:</strong>
              <p>8,500+ hours of social VR research applied to market sentiment analysis</p>
            </div>
            <div>
              <strong className="text-purple-400">Classical Philosophy:</strong>
              <p>Virtue ethics and Stoic principles guiding strategic trading decisions</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
            <strong className="text-cyan-400">Data Sources:</strong>
            <p>RSS feeds, live on-chain monitoring, Jupiter DEX, Birdeye analytics, news sentiment, and social intelligence</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}