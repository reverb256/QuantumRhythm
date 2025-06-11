import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Activity, Zap, Shield, Eye, Cpu, HardDrive } from 'lucide-react';
import { pageMonitor } from '@/services/autonomous-page-monitor';
import { compatibilityLayer } from '@/services/compatibility-layer';
import '../styles/compatibility.css';

interface HealthReport {
  status: 'healthy' | 'issues_detected';
  activeIssues: number;
  resolvedIssues: number;
  averageResponseTime: number;
  memoryUsage: number;
  uptime: number;
  lastCheck: number;
}

interface PageIssue {
  id: string;
  type: string;
  data: any;
  detected: number;
  resolved: boolean;
  resolutionAttempts: number;
  resolutionStrategy?: string;
  resolvedAt?: number;
  unresolvable?: boolean;
}

export default function HealthMonitorDashboard() {
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [recentIssues, setRecentIssues] = useState<PageIssue[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [autoResolveCount, setAutoResolveCount] = useState(0);
  const [compatibilityReport, setCompatibilityReport] = useState(compatibilityLayer.getPerformanceReport());

  useEffect(() => {
    // Initialize monitoring
    pageMonitor.startMonitoring();
    setIsMonitoring(pageMonitor.isMonitoringActive());

    // Set up event listeners
    pageMonitor.onHealthUpdate((report) => {
      setHealthReport(report);
    });

    pageMonitor.onIssueDetected((issue) => {
      setRecentIssues(prev => [issue, ...prev.slice(0, 9)]);
    });

    pageMonitor.onIssueResolved((issue) => {
      setRecentIssues(prev => 
        prev.map(i => i.id === issue.id ? issue : i)
      );
      setAutoResolveCount(prev => prev + 1);
    });

    // Initial health check
    pageMonitor.getHealthReport().then(setHealthReport);

    return () => {
      // Cleanup would go here if needed
    };
  }, []);

  const triggerTestIssue = () => {
    // Simulate different types of issues for demonstration
    const testIssues = [
      () => {
        // Trigger a performance issue
        const start = performance.now();
        for (let i = 0; i < 1000000; i++) {
          Math.random();
        }
        console.log('Performance test completed in', performance.now() - start, 'ms');
      },
      () => {
        // Trigger a script error
        try {
          (window as any).nonExistentFunction();
        } catch (error) {
          console.error('Test error triggered:', error);
        }
      },
      () => {
        // Trigger a network issue simulation
        fetch('/non-existent-endpoint').catch(() => {
          console.log('Network test completed');
        });
      }
    ];

    const randomTest = testIssues[Math.floor(Math.random() * testIssues.length)];
    randomTest();
  };

  const forceHealthCheck = () => {
    pageMonitor.forceHealthCheck();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'issues_detected': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'script_error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'network_failure': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'performance_degraded': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'memory_high': return <Eye className="w-4 h-4 text-purple-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatUptime = (uptime: number) => {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Autonomous Page Monitor</h2>
        <div className="flex gap-2">
          <Button onClick={forceHealthCheck} variant="outline">
            Refresh Status
          </Button>
          <Button onClick={triggerTestIssue} variant="outline">
            Test Issue Detection
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            {healthReport?.status === 'healthy' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(healthReport?.status || 'unknown')}`}>
              {healthReport?.status?.replace('_', ' ').toUpperCase() || 'INITIALIZING'}
            </div>
            <p className="text-xs text-muted-foreground">
              Monitoring: {isMonitoring ? 'Active' : 'Inactive'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthReport?.activeIssues || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {healthReport?.resolvedIssues || 0} resolved automatically
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthReport?.averageResponseTime?.toFixed(1) || '0'}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((healthReport?.memoryUsage || 0) * 100).toFixed(1)}%
            </div>
            <Progress 
              value={(healthReport?.memoryUsage || 0) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monitoring Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Uptime</span>
              <span className="text-sm text-muted-foreground">
                {healthReport?.uptime ? formatUptime(Date.now() - healthReport.uptime) : 'Unknown'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last Check</span>
              <span className="text-sm text-muted-foreground">
                {healthReport?.lastCheck ? 
                  new Date(healthReport.lastCheck).toLocaleTimeString() : 
                  'Never'
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Auto-Resolutions</span>
              <span className="text-sm text-muted-foreground">
                {autoResolveCount}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Monitoring Mode</span>
              <Badge variant={isMonitoring ? "default" : "secondary"}>
                {isMonitoring ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentIssues.length > 0 ? (
                recentIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center space-x-3 p-2 rounded-lg border">
                    {getIssueTypeIcon(issue.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {issue.type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(issue.detected).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge 
                        variant={issue.resolved ? "default" : issue.unresolvable ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {issue.resolved ? "Resolved" : issue.unresolvable ? "Failed" : "Active"}
                      </Badge>
                      {issue.resolutionStrategy && (
                        <span className="text-xs text-muted-foreground mt-1">
                          {issue.resolutionStrategy}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No issues detected</p>
                  <p className="text-xs">System is running smoothly</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Compatibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    Memory
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {compatibilityReport.capabilities.memoryGB}GB
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Device Class
                  </span>
                  <Badge variant={compatibilityReport.capabilities.isLowEnd ? "secondary" : "default"}>
                    {compatibilityReport.capabilities.isLowEnd ? "Low-End" : "Modern"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Web Workers</span>
                  <Badge variant={compatibilityReport.capabilities.webWorkerSupport ? "default" : "secondary"}>
                    {compatibilityReport.capabilities.webWorkerSupport ? "Supported" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">WebAssembly</span>
                  <Badge variant={compatibilityReport.capabilities.webAssemblySupport ? "default" : "secondary"}>
                    {compatibilityReport.capabilities.webAssemblySupport ? "Supported" : "Disabled"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Animation Level</span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {compatibilityReport.settings.animationLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cache Strategy</span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {compatibilityReport.settings.cacheStrategy}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Max Workers</span>
                  <span className="text-sm text-muted-foreground">
                    {compatibilityReport.allocatedResources.maxWorkers}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processing Mode</span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {compatibilityReport.settings.dataProcessingMode}
                  </span>
                </div>
              </div>
            </div>

            {compatibilityReport.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Recommendations</h4>
                <ul className="text-xs space-y-1">
                  {compatibilityReport.recommendations.map((rec, index) => (
                    <li key={index} className="text-muted-foreground">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Autonomous Resolution Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Error Handling</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Script error isolation</li>
                  <li>• Promise rejection recovery</li>
                  <li>• Error boundary activation</li>
                  <li>• Graceful degradation</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Performance Optimization</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Memory leak detection</li>
                  <li>• Animation reduction</li>
                  <li>• Lazy loading activation</li>
                  <li>• Feature reduction</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Network Resilience</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Cache fallback</li>
                  <li>• Offline mode</li>
                  <li>• Retry with backoff</li>
                  <li>• Connection monitoring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}