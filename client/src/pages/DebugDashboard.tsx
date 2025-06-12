import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Zap, 
  Database,
  Server,
  Cpu,
  Download
} from 'lucide-react';

interface SystemHealth {
  debugging: boolean;
  totalIssues: number;
  fixedIssues: number;
  criticalIssues: number;
  status: 'healthy' | 'degraded' | 'critical';
  lastScan: string;
}

interface DebugHealth {
  issues: string[];
  fixes: string[];
  status: 'healthy' | 'degraded' | 'critical';
  recommendations: string[];
}

export default function DebugDashboard() {
  const { data: systemHealth, refetch: refetchHealth } = useQuery<{ success: boolean; health: SystemHealth }>({
    queryKey: ['/api/ai-orchestration/health'],
    refetchInterval: 5000
  });

  const { data: debugHealth, refetch: refetchDebug } = useQuery<{ success: boolean; health: DebugHealth }>({
    queryKey: ['/api/debug/health'],
    refetchInterval: 10000
  });

  const health = systemHealth?.health;
  const debug = debugHealth?.health;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleFixBuildScripts = async () => {
    try {
      const response = await fetch('/api/debug/fix-build-scripts', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        refetchDebug();
        refetchHealth();
      }
    } catch (error) {
      console.error('Failed to fix build scripts:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-blue-950 text-white">
      {/* Header */}
      <div className="border-b border-purple-800/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AI Orchestration Debug Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Comprehensive system monitoring and recursive debugging
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {health && (
                <div className="flex items-center gap-2">
                  {getStatusIcon(health.status)}
                  <span className="text-sm font-medium">
                    System {health.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* System Overview */}
          <Card className="bg-black/40 border-purple-800/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {health ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <Badge className={getStatusColor(health.status)}>
                      {health.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Issues Fixed</span>
                      <span>{health.fixedIssues}/{health.totalIssues}</span>
                    </div>
                    <Progress 
                      value={health.totalIssues > 0 ? (health.fixedIssues / health.totalIssues) * 100 : 100}
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Total Issues</div>
                      <div className="text-lg font-semibold">{health.totalIssues}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Critical</div>
                      <div className="text-lg font-semibold text-red-400">{health.criticalIssues}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Activity className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                  <p className="text-gray-400">Loading system status...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Debug Status */}
          <Card className="bg-black/40 border-purple-800/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Debug Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {debug ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Health</span>
                    <Badge className={getStatusColor(debug.status)}>
                      {debug.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Issues Found</div>
                      <div className="text-lg font-semibold">{debug.issues.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Fixes Applied</div>
                      <div className="text-lg font-semibold text-green-400">{debug.fixes.length}</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleFixBuildScripts}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Fix Build Scripts
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Cpu className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                  <p className="text-gray-400">Loading debug status...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-black/40 border-purple-800/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => refetchHealth()}
                  variant="outline"
                  className="w-full border-purple-600"
                  size="sm"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
                
                <Button 
                  onClick={() => refetchDebug()}
                  variant="outline"
                  className="w-full border-purple-600"
                  size="sm"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Scan System
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-purple-600"
                  size="sm"
                  asChild
                >
                  <a href="/api/security/report" target="_blank">
                    <Download className="w-4 h-4 mr-2" />
                    Security Report
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList className="bg-black/40 border-purple-800/30">
            <TabsTrigger value="issues">Issues & Fixes</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>

          <TabsContent value="issues" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issues */}
              <Card className="bg-black/40 border-purple-800/30">
                <CardHeader>
                  <CardTitle>Detected Issues</CardTitle>
                  <CardDescription>
                    Current system issues requiring attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {debug?.issues.length ? (
                    <div className="space-y-2">
                      {debug.issues.map((issue, index) => (
                        <Alert key={index} className="border-yellow-600/30">
                          <AlertTriangle className="w-4 h-4" />
                          <AlertDescription>{issue}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p className="text-gray-400">No issues detected</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Fixes */}
              <Card className="bg-black/40 border-purple-800/30">
                <CardHeader>
                  <CardTitle>Applied Fixes</CardTitle>
                  <CardDescription>
                    Recently applied system fixes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {debug?.fixes.length ? (
                    <div className="space-y-2">
                      {debug.fixes.map((fix, index) => (
                        <Alert key={index} className="border-green-600/30">
                          <CheckCircle className="w-4 h-4" />
                          <AlertDescription>{fix}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400">No fixes applied yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card className="bg-black/40 border-purple-800/30">
              <CardHeader>
                <CardTitle>System Recommendations</CardTitle>
                <CardDescription>
                  AI-generated recommendations for system optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                {debug?.recommendations.length ? (
                  <div className="space-y-3">
                    {debug.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-purple-900/20">
                        <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p className="text-gray-400">System running optimally</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="bg-black/40 border-purple-800/30">
              <CardHeader>
                <CardTitle>System Health Details</CardTitle>
                <CardDescription>
                  Comprehensive system health information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {health ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-purple-900/20">
                        <div className="text-2xl font-bold text-purple-400">{health.totalIssues}</div>
                        <div className="text-sm text-gray-400">Total Issues</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-900/20">
                        <div className="text-2xl font-bold text-green-400">{health.fixedIssues}</div>
                        <div className="text-sm text-gray-400">Fixed Issues</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-red-900/20">
                        <div className="text-2xl font-bold text-red-400">{health.criticalIssues}</div>
                        <div className="text-sm text-gray-400">Critical Issues</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      Last scan: {new Date(health.lastScan).toLocaleString()}
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      Debugging active: {health.debugging ? 'Yes' : 'No'}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-400">Loading system health...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}