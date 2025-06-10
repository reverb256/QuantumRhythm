import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface DeploymentStatus {
  id: string;
  service: string;
  status: 'deploying' | 'healthy' | 'degraded' | 'failed' | 'maintenance';
  version: string;
  region: string;
  uptime: number;
  lastDeploy: string;
  healthScore: number;
  metrics: {
    cpu: number;
    memory: number;
    requests: number;
    errors: number;
    latency: number;
  };
  aiInsights: string[];
  prediction: {
    nextIssue: string;
    confidence: number;
    recommendations: string[];
  };
}

interface DeploymentData {
  services: DeploymentStatus[];
  globalHealth: number;
  totalDeployments: number;
  activeIncidents: number;
  aiRecommendations: string[];
  timestamp: number;
}

const AIDeploymentDashboard: React.FC = () => {
  const [selectedService, setSelectedService] = useState<DeploymentStatus | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const { data: deploymentData, isLoading } = useQuery<DeploymentData>({
    queryKey: ['/api/deployment-status'],
    refetchInterval: 3000,
    staleTime: 0
  });

  useEffect(() => {
    // Simulate AI insights streaming
    const interval = setInterval(() => {
      const insights = [
        '🤖 AI detected potential memory leak in trading-engine service',
        '⚡ Auto-scaling triggered for increased market volatility',
        '🔍 Analyzing deployment patterns for optimization',
        '🛡️ Security scan completed - all services secure',
        '📊 Performance optimization recommendations generated',
        '🚀 Preparing auto-deployment for bug fixes',
        '🧠 AI learning from trading patterns to improve deployment'
      ];
      
      setTerminalLogs(prev => {
        const newLog = insights[Math.floor(Math.random() * insights.length)];
        const updated = [...prev, `[${new Date().toLocaleTimeString()}] ${newLog}`];
        return updated.slice(-10); // Keep last 10 logs
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#00ff41';
      case 'deploying': return '#00bfff';
      case 'degraded': return '#ffa500';
      case 'failed': return '#ff0040';
      case 'maintenance': return '#9400d3';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '●';
      case 'deploying': return '◐';
      case 'degraded': return '◑';
      case 'failed': return '✕';
      case 'maintenance': return '⚠';
      default: return '○';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono p-6">
        <div className="border border-green-400 rounded p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-green-400 bg-opacity-20 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-green-400 bg-opacity-10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Matrix-style background effect */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-green-400/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="border border-green-400 rounded-lg mb-6 p-4 bg-black bg-opacity-90">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-green-400 mb-2">
                ◊ QUANTUM AI DEPLOYMENT MATRIX ◊
              </h1>
              <div className="text-sm opacity-80">
                Neural Network Status | Real-time Monitoring | AI-Powered Insights
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">
                {deploymentData?.globalHealth || 0}%
              </div>
              <div className="text-sm opacity-80">SYSTEM HEALTH</div>
            </div>
          </div>

          {/* Global Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="border border-green-400 border-opacity-30 rounded p-3 bg-green-400 bg-opacity-5">
              <div className="text-lg font-bold text-green-400">
                {deploymentData?.services.length || 0}
              </div>
              <div className="text-xs opacity-70">ACTIVE SERVICES</div>
            </div>
            <div className="border border-green-400 border-opacity-30 rounded p-3 bg-green-400 bg-opacity-5">
              <div className="text-lg font-bold text-cyan-400">
                {deploymentData?.totalDeployments || 0}
              </div>
              <div className="text-xs opacity-70">DEPLOYMENTS TODAY</div>
            </div>
            <div className="border border-green-400 border-opacity-30 rounded p-3 bg-green-400 bg-opacity-5">
              <div className="text-lg font-bold text-red-400">
                {deploymentData?.activeIncidents || 0}
              </div>
              <div className="text-xs opacity-70">ACTIVE INCIDENTS</div>
            </div>
            <div className="border border-green-400 border-opacity-30 rounded p-3 bg-green-400 bg-opacity-5">
              <div className="text-lg font-bold text-purple-400">
                99.97%
              </div>
              <div className="text-xs opacity-70">UPTIME</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services Grid */}
          <div className="lg:col-span-2">
            <div className="border border-green-400 rounded-lg p-4 bg-black bg-opacity-90">
              <h2 className="text-lg font-bold mb-4 text-green-400">
                » SERVICE MATRIX
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deploymentData?.services.map((service) => (
                  <div
                    key={service.id}
                    className={`border border-opacity-50 rounded p-3 cursor-pointer transition-all duration-300 hover:border-opacity-100 hover:shadow-lg ${
                      selectedService?.id === service.id 
                        ? 'bg-green-400 bg-opacity-10 border-green-400' 
                        : 'bg-green-400 bg-opacity-5 border-green-400 border-opacity-30'
                    }`}
                    onClick={() => setSelectedService(service)}
                    style={{
                      boxShadow: selectedService?.id === service.id 
                        ? `0 0 20px ${getStatusColor(service.status)}40`
                        : 'none'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-lg animate-pulse"
                          style={{ color: getStatusColor(service.status) }}
                        >
                          {getStatusIcon(service.status)}
                        </span>
                        <span className="font-semibold text-green-400">
                          {service.service.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs opacity-70">
                        v{service.version}
                      </span>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="opacity-70">Health:</span>
                        <span style={{ color: getStatusColor(service.status) }}>
                          {service.healthScore}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">CPU:</span>
                        <span className="text-cyan-400">{service.metrics.cpu}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Memory:</span>
                        <span className="text-yellow-400">{service.metrics.memory}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-70">Latency:</span>
                        <span className="text-purple-400">{service.metrics.latency}ms</span>
                      </div>
                    </div>

                    {/* Health bar */}
                    <div className="mt-2 h-1 bg-gray-800 rounded overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          width: `${service.healthScore}%`,
                          backgroundColor: getStatusColor(service.status)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="space-y-6">
            {/* AI Terminal */}
            <div className="border border-green-400 rounded-lg p-4 bg-black bg-opacity-90">
              <h3 className="text-lg font-bold mb-3 text-green-400">
                ◉ AI NEURAL FEED
              </h3>
              <div className="h-48 overflow-y-auto space-y-1 text-xs">
                {terminalLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className="opacity-80 hover:opacity-100 transition-opacity"
                    style={{ 
                      animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`
                    }}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="border border-green-400 rounded-lg p-4 bg-black bg-opacity-90">
              <h3 className="text-lg font-bold mb-3 text-green-400">
                ⚡ AI INSIGHTS
              </h3>
              <div className="space-y-2 text-sm">
                {deploymentData?.aiRecommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className="p-2 border border-green-400 border-opacity-30 rounded bg-green-400 bg-opacity-5"
                  >
                    {rec}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Service Details */}
            {selectedService && (
              <div className="border border-green-400 rounded-lg p-4 bg-black bg-opacity-90">
                <h3 className="text-lg font-bold mb-3 text-green-400">
                  ▶ {selectedService.service.toUpperCase()} ANALYSIS
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="opacity-70 mb-1">Status:</div>
                    <div 
                      className="font-semibold uppercase"
                      style={{ color: getStatusColor(selectedService.status) }}
                    >
                      {selectedService.status}
                    </div>
                  </div>

                  <div>
                    <div className="opacity-70 mb-1">Region:</div>
                    <div className="text-cyan-400">{selectedService.region}</div>
                  </div>

                  <div>
                    <div className="opacity-70 mb-1">Uptime:</div>
                    <div className="text-green-400">{selectedService.uptime}h</div>
                  </div>

                  <div>
                    <div className="opacity-70 mb-1">AI Prediction:</div>
                    <div className="text-purple-400 text-xs">
                      {selectedService.prediction.nextIssue}
                    </div>
                    <div className="text-yellow-400 text-xs mt-1">
                      Confidence: {selectedService.prediction.confidence}%
                    </div>
                  </div>

                  <div>
                    <div className="opacity-70 mb-1">AI Insights:</div>
                    <div className="space-y-1">
                      {selectedService.aiInsights.map((insight, index) => (
                        <div key={index} className="text-xs p-1 border border-green-400 border-opacity-20 rounded">
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="opacity-70 mb-1">Recommendations:</div>
                    <div className="space-y-1">
                      {selectedService.prediction.recommendations.map((rec, index) => (
                        <div key={index} className="text-xs text-cyan-400">
                          → {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Network Visualization */}
        <div className="mt-6 border border-green-400 rounded-lg p-4 bg-black bg-opacity-90">
          <h2 className="text-lg font-bold mb-4 text-green-400">
            ◊ NETWORK TOPOLOGY MATRIX ◊
          </h2>
          
          <div className="relative h-32 border border-green-400 border-opacity-30 rounded bg-green-400 bg-opacity-5">
            <svg className="w-full h-full">
              {/* Network connections */}
              {deploymentData?.services.map((service, index) => {
                const x = 50 + (index * 150);
                const y = 60;
                return (
                  <g key={service.id}>
                    {/* Connection lines */}
                    {index > 0 && (
                      <line
                        x1={x - 150}
                        y1={y}
                        x2={x}
                        y2={y}
                        stroke={getStatusColor(service.status)}
                        strokeWidth="1"
                        opacity="0.6"
                        className="animate-pulse"
                      />
                    )}
                    
                    {/* Service nodes */}
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill={getStatusColor(service.status)}
                      opacity="0.8"
                      className="animate-pulse"
                    />
                    
                    {/* Service labels */}
                    <text
                      x={x}
                      y={y + 25}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#00ff41"
                      opacity="0.8"
                    >
                      {service.service.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-matrix {
          animation: matrix 20s linear infinite;
        }
        
        @keyframes matrix {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default AIDeploymentDashboard;