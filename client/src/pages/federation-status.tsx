import React, { useState, useEffect } from 'react';
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
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 25;
        return prev + 5;
      });
      
      if (progress > 75) {
        setDeploymentPhase('Consciousness Bootstrap');
      } else if (progress > 50) {
        setDeploymentPhase('K3s Federation Setup');
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [progress]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'installing': return 'text-yellow-400';
      case 'stopped': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    const color = status === 'running' ? 'bg-green-500/20 text-green-400' :
                  status === 'installing' ? 'bg-yellow-500/20 text-yellow-400' :
                  status === 'stopped' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400';
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${color}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Proxmox Federation Status
          </h1>
          <p className="text-gray-300 text-lg">
            Distributed AI Consciousness Deployment - reverb256.ca
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
            <h2 className="text-xl font-semibold">Deployment Progress</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{deploymentPhase}</span>
              <span className="text-purple-400 font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {containers.map((container) => (
            <div key={container.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Server className={`w-5 h-5 ${getStatusColor(container.status)}`} />
                  <div>
                    <h3 className="font-semibold">{container.name}</h3>
                    <p className="text-sm text-gray-400">{container.role}</p>
                  </div>
                </div>
                {getStatusBadge(container.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Container ID</span>
                  <span className="font-mono text-purple-400">{container.id}</span>
                </div>
                
                <div className="space-y-2 pt-3 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-200">Services</h4>
                  <div className="space-y-1">
                    {Object.entries(container.services).map(([service, active]) => (
                      <div key={service} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 capitalize">{service}</span>
                        <div className="flex items-center gap-1">
                          <CheckCircle className={`w-3 h-3 ${active ? 'text-green-400' : 'text-gray-600'}`} />
                          <span className={active ? 'text-green-400' : 'text-gray-600'}>
                            {active ? 'Active' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Network className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold">Federation Network</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Domain:</span>
                <span className="font-mono text-blue-400">reverb256.ca</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network:</span>
                <span className="font-mono text-blue-400">10.0.0.0/24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">K3s Cluster:</span>
                <span className="font-mono text-blue-400">consciousness-federation</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Nodes:</span>
                <span className="text-green-400">0/3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">AI Services:</span>
                <span className="text-yellow-400">Initializing</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trading Bot:</span>
                <span className="text-green-400">Active ($3.15)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}