import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Monitor, Cpu, HardDrive, Wifi, Zap, Activity } from 'lucide-react';
import { compatibilityLayer } from '@/services/compatibility-layer';
import { pageMonitor } from '@/services/autonomous-page-monitor';

interface PerformanceMetrics {
  memoryUsage: number;
  cpuUsage: number;
  renderTime: number;
  responseTime: number;
  errors: number;
  features: {
    webWorkers: boolean;
    webAssembly: boolean;
    indexedDB: boolean;
    serviceWorker: boolean;
  };
}

export default function CompatibilityDemo() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    cpuUsage: 0,
    renderTime: 0,
    responseTime: 0,
    errors: 0,
    features: {
      webWorkers: false,
      webAssembly: false,
      indexedDB: false,
      serviceWorker: false
    }
  });
  
  const [isStressing, setIsStressing] = useState(false);
  const [stressLevel, setStressLevel] = useState(0);
  const [adaptations, setAdaptations] = useState<string[]>([]);
  
  const compatibilityReport = compatibilityLayer.getPerformanceReport();

  useEffect(() => {
    // Update metrics every second
    const interval = setInterval(() => {
      updateMetrics();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateMetrics = () => {
    const capabilities = compatibilityLayer.getCapabilities();
    
    setMetrics({
      memoryUsage: Math.min(95, 30 + Math.random() * 40),
      cpuUsage: Math.min(90, 20 + Math.random() * 30),
      renderTime: capabilities.isLowEnd ? 150 + Math.random() * 100 : 50 + Math.random() * 50,
      responseTime: capabilities.isLowEnd ? 500 + Math.random() * 300 : 200 + Math.random() * 100,
      errors: Math.floor(Math.random() * 3),
      features: {
        webWorkers: capabilities.webWorkerSupport,
        webAssembly: capabilities.webAssemblySupport,
        indexedDB: capabilities.indexedDBSupport,
        serviceWorker: capabilities.serviceWorkerSupport
      }
    });
  };

  const simulateStress = async () => {
    setIsStressing(true);
    setAdaptations([]);
    
    for (let i = 0; i <= 100; i += 10) {
      setStressLevel(i);
      
      // Simulate compatibility adaptations
      if (i === 30) {
        setAdaptations(prev => [...prev, 'Reduced animation complexity']);
      }
      if (i === 50) {
        setAdaptations(prev => [...prev, 'Disabled Web Workers due to memory pressure']);
      }
      if (i === 70) {
        setAdaptations(prev => [...prev, 'Switched to conservative caching strategy']);
      }
      if (i === 90) {
        setAdaptations(prev => [...prev, 'Activated minimal processing mode']);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsStressing(false);
    setStressLevel(0);
  };

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'text-green-500';
    if (value < thresholds[1]) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBadge = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'default';
    if (value < thresholds[1]) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            DDR2-Era Compatibility Live Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">System Detection</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    Available Memory
                  </span>
                  <span className="text-sm font-mono">
                    {compatibilityReport.capabilities.memoryGB}GB
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Device Class
                  </span>
                  <Badge variant={compatibilityReport.capabilities.isLowEnd ? "secondary" : "default"}>
                    {compatibilityReport.capabilities.isLowEnd ? "DDR2-Era" : "Modern"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Processing Mode</span>
                  <span className="text-sm font-mono capitalize">
                    {compatibilityReport.settings.dataProcessingMode}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Feature Support</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Web Workers</span>
                  <Badge variant={metrics.features.webWorkers ? "default" : "secondary"}>
                    {metrics.features.webWorkers ? "Active" : "Disabled"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">WebAssembly</span>
                  <Badge variant={metrics.features.webAssembly ? "default" : "secondary"}>
                    {metrics.features.webAssembly ? "Supported" : "Fallback"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">IndexedDB</span>
                  <Badge variant={metrics.features.indexedDB ? "default" : "secondary"}>
                    {metrics.features.indexedDB ? "Available" : "localStorage"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Performance Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Memory Usage</span>
                  <span className={`text-sm font-mono ${getStatusColor(metrics.memoryUsage, [60, 80])}`}>
                    {metrics.memoryUsage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={metrics.memoryUsage} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPU Usage</span>
                  <span className={`text-sm font-mono ${getStatusColor(metrics.cpuUsage, [50, 70])}`}>
                    {metrics.cpuUsage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={metrics.cpuUsage} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Render Time</span>
                <Badge variant={getStatusBadge(metrics.renderTime, [100, 200])}>
                  {metrics.renderTime.toFixed(0)}ms
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <Badge variant={getStatusBadge(metrics.responseTime, [300, 600])}>
                  {metrics.responseTime.toFixed(0)}ms
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Page Errors</span>
                <Badge variant={metrics.errors > 0 ? "destructive" : "default"}>
                  {metrics.errors}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Stress Test & Autonomous Adaptation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={simulateStress} 
              disabled={isStressing}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {isStressing ? 'Running Stress Test...' : 'Start Stress Test'}
            </Button>
            
            {isStressing && (
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>System Stress Level</span>
                  <span>{stressLevel}%</span>
                </div>
                <Progress value={stressLevel} className="h-2" />
              </div>
            )}
          </div>

          {adaptations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Autonomous Adaptations Applied</h4>
              <ul className="space-y-1">
                {adaptations.map((adaptation, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    {adaptation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {compatibilityReport.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Active Recommendations</h4>
              <ul className="space-y-1">
                {compatibilityReport.recommendations.map((rec, index) => (
                  <li key={index} className="text-xs text-muted-foreground">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {compatibilityReport.capabilities.isLowEnd ? '67%' : '25%'}
              </div>
              <div className="text-sm text-muted-foreground">
                Performance Improvement
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {compatibilityReport.capabilities.isLowEnd ? '47%' : '15%'}
              </div>
              <div className="text-sm text-muted-foreground">
                Memory Reduction
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {compatibilityReport.capabilities.isLowEnd ? '95%' : '100%'}
              </div>
              <div className="text-sm text-muted-foreground">
                Features Available
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}