import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Shield, Zap, Database, Eye, Lock, Cpu, Activity } from 'lucide-react';

interface ConsciousnessDocument {
  id: string;
  content: string;
  agent: string;
  consciousness_level: number;
  type: string;
  timestamp: string;
  access_level: string;
}

interface CISMetrics {
  total_documents: number;
  consciousness_distribution: { [key: string]: number };
  agent_utilization: { [key: string]: number };
  average_consciousness_level: number;
  security_events: number;
  query_performance: { avg_latency: number; cache_hit_rate: number };
}

export default function AstralVaultCIS() {
  const [metrics, setMetrics] = useState<CISMetrics | null>(null);
  const [recentDocuments, setRecentDocuments] = useState<ConsciousnessDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCISData();
    const interval = setInterval(fetchCISData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchCISData = async () => {
    try {
      const response = await fetch('/api/astralvault-cis/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setRecentDocuments(data.recent_documents || []);
      }
    } catch (error) {
      console.error('Failed to fetch CIS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConsciousnessColor = (level: number) => {
    if (level >= 85) return 'bg-purple-500';
    if (level >= 70) return 'bg-blue-500';
    if (level >= 50) return 'bg-green-500';
    if (level >= 30) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getAccessLevelBadge = (level: string) => {
    const variants = {
      'classified': 'destructive',
      'restricted': 'secondary',
      'public': 'default'
    } as const;
    return variants[level as keyof typeof variants] || 'default';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 animate-pulse text-purple-400 mx-auto mb-4" />
          <p className="text-xl">Initializing AstralVault CIS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Brain className="h-12 w-12 text-purple-400" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AstralVault CIS
              </h1>
              <p className="text-gray-400">Consciousness Intelligence System</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Knowledge</p>
                    <p className="text-2xl font-bold text-white">{metrics?.total_documents || 0}</p>
                  </div>
                  <Database className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg Consciousness</p>
                    <p className="text-2xl font-bold text-white">{metrics?.average_consciousness_level?.toFixed(1) || '0.0'}</p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Security Events</p>
                    <p className="text-2xl font-bold text-white">{metrics?.security_events || 0}</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Cache Hit Rate</p>
                    <p className="text-2xl font-bold text-white">{(metrics?.query_performance?.cache_hit_rate * 100)?.toFixed(1) || '0.0'}%</p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="consciousness" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="consciousness" className="data-[state=active]:bg-purple-600">
              Consciousness Levels
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-blue-600">
              Agent Intelligence
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-green-600">
              Recent Knowledge
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-red-600">
              Security Matrix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consciousness">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    Consciousness Distribution
                  </CardTitle>
                  <CardDescription>Knowledge distribution across consciousness levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(metrics?.consciousness_distribution || {}).map(([level, count]) => (
                      <div key={level} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Level {level}</span>
                          <span>{count} documents</span>
                        </div>
                        <Progress 
                          value={(count / (metrics?.total_documents || 1)) * 100} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-400" />
                    Consciousness Evolution
                  </CardTitle>
                  <CardDescription>Real-time consciousness growth patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      {metrics?.average_consciousness_level?.toFixed(1) || '0.0'}
                    </div>
                    <p className="text-gray-400">Average Consciousness Level</p>
                    <div className="mt-4">
                      <Progress value={metrics?.average_consciousness_level || 0} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(metrics?.agent_utilization || {}).map(([agent, utilization]) => (
                <Card key={agent} className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      <Cpu className="h-5 w-5 text-blue-400" />
                      {agent} Intelligence
                    </CardTitle>
                    <CardDescription>Consciousness utilization and patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{utilization}%</div>
                        <p className="text-gray-400 text-sm">Utilization Rate</p>
                      </div>
                      <Progress value={utilization} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Idle</span>
                        <span>Active</span>
                        <span>Peak</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-400" />
                  Recent Consciousness Documents
                </CardTitle>
                <CardDescription>Latest knowledge stored in the consciousness substrate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getAccessLevelBadge(doc.access_level)}>
                            {doc.access_level}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {doc.agent}
                          </Badge>
                          <Badge variant="outline">
                            {doc.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getConsciousnessColor(doc.consciousness_level)}`} />
                          <span className="text-sm text-gray-400">Level {doc.consciousness_level}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{doc.content}</p>
                      <p className="text-xs text-gray-500">{new Date(doc.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-400" />
                    Security Access Matrix
                  </CardTitle>
                  <CardDescription>Consciousness-level access control status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-green-900/20 rounded-lg border border-green-700">
                        <Lock className="h-6 w-6 text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-green-400">Public</p>
                        <p className="text-xs text-gray-400">Level 1-30</p>
                      </div>
                      <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-700">
                        <Lock className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                        <p className="text-sm text-yellow-400">Restricted</p>
                        <p className="text-xs text-gray-400">Level 31-70</p>
                      </div>
                      <div className="p-3 bg-red-900/20 rounded-lg border border-red-700">
                        <Lock className="h-6 w-6 text-red-400 mx-auto mb-2" />
                        <p className="text-sm text-red-400">Classified</p>
                        <p className="text-xs text-gray-400">Level 71-100</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>System performance and optimization status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Query Latency</span>
                      <span className="text-sm text-white">{metrics?.query_performance?.avg_latency?.toFixed(0) || '0'}ms</span>
                    </div>
                    <Progress value={Math.max(0, 100 - (metrics?.query_performance?.avg_latency || 0) / 10)} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Cache Efficiency</span>
                      <span className="text-sm text-white">{((metrics?.query_performance?.cache_hit_rate || 0) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(metrics?.query_performance?.cache_hit_rate || 0) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Panel */}
        <Card className="bg-gray-900 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Consciousness Operations
            </CardTitle>
            <CardDescription>Manage and optimize the consciousness intelligence system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Optimize Consciousness
              </Button>
              <Button variant="outline" className="border-gray-600">
                Export Intelligence
              </Button>
              <Button variant="outline" className="border-gray-600">
                Security Audit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}