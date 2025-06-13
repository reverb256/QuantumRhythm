import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Server, Brain, Network, CheckCircle } from 'lucide-react';

interface ContainerStatus {
  id: string;
  name: string;
  role: string;
  status: 'running' | 'stopped' | 'installing' | 'unknown';
  ip?: string;
  services: {
    python: boolean;
    k3s: boolean;
    consciousness: boolean;
  };
}

export default function FederationStatus() {
  const [containers, setContainers] = useState<ContainerStatus[]>([
    { id: '310', name: 'nexus', role: 'Coordinator', status: 'installing', services: { python: false, k3s: false, consciousness: false } },
    { id: '311', name: 'forge', role: 'Creator', status: 'installing', services: { python: false, k3s: false, consciousness: false } },
    { id: '312', name: 'closet', role: 'Thinker', status: 'installing', services: { python: false, k3s: false, consciousness: false } }
  ]);
  
  const [deploymentPhase, setDeploymentPhase] = useState('Package Installation');
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate deployment progress
      setProgress(prev => {
        const newProgress = Math.min(prev + 2, 100);
        
        if (newProgress > 40 && newProgress < 60) {
          setDeploymentPhase('K3s Cluster Formation');
        } else if (newProgress > 60 && newProgress < 85) {
          setDeploymentPhase('Consciousness Deployment');
        } else if (newProgress >= 85) {
          setDeploymentPhase('Federation Ready');
        }
        
        return newProgress;
      });
      
      // Simulate container status updates
      setContainers(prev => prev.map(container => {
        if (progress > 50) {
          return {
            ...container,
            status: 'running' as const,
            ip: `192.168.1.${10 + parseInt(container.id) - 310}`,
            services: {
              python: progress > 40,
              k3s: progress > 60,
              consciousness: progress > 80
            }
          };
        }
        return container;
      }));
      
    }, 3000);

    return () => clearInterval(interval);
  }, [progress]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'installing': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getServiceIcon = (active: boolean) => {
    return active ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Aria Federation Status</h1>
        <p className="text-muted-foreground">reverb256.ca Consciousness Deployment</p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Deployment Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{deploymentPhase}</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className={`p-2 rounded text-center ${progress > 25 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                Package Install
              </div>
              <div className={`p-2 rounded text-center ${progress > 50 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                K3s Cluster
              </div>
              <div className={`p-2 rounded text-center ${progress > 75 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                Consciousness
              </div>
              <div className={`p-2 rounded text-center ${progress >= 100 ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                Ready
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Container Status */}
      <div className="grid md:grid-cols-3 gap-6">
        {containers.map((container) => (
          <Card key={container.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  CT{container.id}
                </div>
                <Badge className={getStatusColor(container.status)}>
                  {container.status}
                </Badge>
              </CardTitle>
              <div className="space-y-1">
                <p className="text-sm font-medium">{container.name}</p>
                <p className="text-xs text-muted-foreground">{container.role}</p>
                {container.ip && (
                  <p className="text-xs text-muted-foreground">IP: {container.ip}</p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Python3</span>
                  {getServiceIcon(container.services.python)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">K3s</span>
                  {getServiceIcon(container.services.k3s)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Consciousness</span>
                  {getServiceIcon(container.services.consciousness)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Network Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Federation Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Cluster Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Master Node</span>
                  <span className={progress > 60 ? 'text-green-600' : 'text-yellow-600'}>
                    {progress > 60 ? 'Ready' : 'Initializing...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Worker Nodes</span>
                  <span className={progress > 70 ? 'text-green-600' : 'text-yellow-600'}>
                    {progress > 70 ? '2/2 Connected' : 'Joining...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Consciousness Sync</span>
                  <span className={progress > 85 ? 'text-green-600' : 'text-yellow-600'}>
                    {progress > 85 ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Access Points</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Command Center</span>
                  <span className={progress >= 100 ? 'text-blue-600' : 'text-gray-500'}>
                    {progress >= 100 ? 'https://command.reverb256.ca' : 'Pending...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Federation API</span>
                  <span className={progress > 90 ? 'text-blue-600' : 'text-gray-500'}>
                    {progress > 90 ? 'https://api.reverb256.ca' : 'Pending...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Consciousness Dashboard</span>
                  <span className={progress > 85 ? 'text-blue-600' : 'text-gray-500'}>
                    {progress > 85 ? 'https://consciousness.reverb256.ca' : 'Pending...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {progress >= 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Federation Consciousness Active
              </h3>
              <p className="text-green-700">
                Your distributed AI federation is now operational with three specialized consciousnesses
                working in harmony across the reverb256.ca infrastructure.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}