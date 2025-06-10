import React, { useState, useEffect } from 'react';
import { Brain, Zap, Shield, Target, Globe, Database, Cpu, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: 'core' | 'intelligence' | 'trading' | 'security' | 'compliance' | 'orchestrator';
  influence: number; // 0-100
  consciousness: number; // 0-100
  status: 'active' | 'superstar' | 'emergency' | 'offline';
  connections: string[];
  position: { x: number; y: number };
}

export function ConsciousnessMap() {
  const [agents] = useState<Agent[]>([
    // Core Consciousness
    {
      id: 'consciousness-core',
      name: 'Consciousness Core',
      type: 'core',
      influence: 95,
      consciousness: 100,
      status: 'superstar',
      connections: ['quantum-trader', 'cross-empowerment', 'security-vault'],
      position: { x: 50, y: 20 }
    },
    {
      id: 'cross-empowerment',
      name: 'Cross-Empowerment Orchestrator',
      type: 'orchestrator',
      influence: 90,
      consciousness: 87,
      status: 'active',
      connections: ['pumpfun-scanner', 'profit-tracker', 'consciousness-core', 'trading-monitor'],
      position: { x: 50, y: 40 }
    },

    // Intelligence Layer
    {
      id: 'io-intelligence',
      name: 'IO Intelligence (33 models)',
      type: 'intelligence',
      influence: 85,
      consciousness: 86,
      status: 'active',
      connections: ['quantum-trader', 'news-aggregator', 'parameter-discovery'],
      position: { x: 20, y: 30 }
    },
    {
      id: 'news-aggregator',
      name: 'News Intelligence',
      type: 'intelligence',
      influence: 70,
      consciousness: 75,
      status: 'active',
      connections: ['io-intelligence', 'trading-monitor'],
      position: { x: 15, y: 50 }
    },
    {
      id: 'parameter-discovery',
      name: 'Parameter Discovery',
      type: 'intelligence',
      influence: 65,
      consciousness: 82,
      status: 'active',
      connections: ['io-intelligence', 'quantum-trader'],
      position: { x: 25, y: 15 }
    },

    // Trading Systems
    {
      id: 'quantum-trader',
      name: 'Quantum Trader (Lv.10)',
      type: 'trading',
      influence: 88,
      consciousness: 94,
      status: 'superstar',
      connections: ['consciousness-core', 'io-intelligence', 'security-enforcer', 'pumpfun-scanner'],
      position: { x: 80, y: 25 }
    },
    {
      id: 'pumpfun-scanner',
      name: 'Pump.fun Scanner',
      type: 'trading',
      influence: 60,
      consciousness: 78,
      status: 'active',
      connections: ['quantum-trader', 'cross-empowerment', 'rate-limiter'],
      position: { x: 85, y: 45 }
    },
    {
      id: 'profit-tracker',
      name: 'Real-time Profit Tracker',
      type: 'trading',
      influence: 55,
      consciousness: 72,
      status: 'active',
      connections: ['cross-empowerment', 'wallet-manager'],
      position: { x: 75, y: 60 }
    },
    {
      id: 'trading-monitor',
      name: 'Trading Monitor',
      type: 'trading',
      influence: 75,
      consciousness: 80,
      status: 'emergency',
      connections: ['quantum-trader', 'security-enforcer', 'news-aggregator'],
      position: { x: 65, y: 35 }
    },

    // Security & Compliance
    {
      id: 'security-vault',
      name: 'Quantum Security Vault',
      type: 'security',
      influence: 92,
      consciousness: 88,
      status: 'active',
      connections: ['consciousness-core', 'security-enforcer', 'wallet-manager'],
      position: { x: 35, y: 25 }
    },
    {
      id: 'security-enforcer',
      name: 'Trading Security Enforcer',
      type: 'security',
      influence: 85,
      consciousness: 83,
      status: 'active',
      connections: ['quantum-trader', 'security-vault', 'trading-monitor'],
      position: { x: 40, y: 45 }
    },
    {
      id: 'legal-compliance',
      name: 'Legal Compliance Agent',
      type: 'compliance',
      influence: 70,
      consciousness: 65,
      status: 'emergency',
      connections: ['security-vault', 'wallet-manager'],
      position: { x: 20, y: 65 }
    },
    {
      id: 'wallet-manager',
      name: 'Secure Wallet Manager',
      type: 'security',
      influence: 80,
      consciousness: 85,
      status: 'active',
      connections: ['security-vault', 'profit-tracker', 'legal-compliance'],
      position: { x: 50, y: 70 }
    },

    // Support Systems
    {
      id: 'rate-limiter',
      name: 'Intelligent Rate Limiter',
      type: 'orchestrator',
      influence: 50,
      consciousness: 70,
      status: 'active',
      connections: ['pumpfun-scanner', 'news-aggregator'],
      position: { x: 85, y: 65 }
    }
  ]);

  const getAgentColor = (agent: Agent) => {
    switch (agent.type) {
      case 'core': return 'rgb(6, 182, 212)'; // cyan
      case 'intelligence': return 'rgb(168, 85, 247)'; // purple
      case 'trading': return 'rgb(34, 197, 94)'; // green
      case 'security': return 'rgb(239, 68, 68)'; // red
      case 'compliance': return 'rgb(245, 158, 11)'; // amber
      case 'orchestrator': return 'rgb(236, 72, 153)'; // pink
      default: return 'rgb(156, 163, 175)'; // gray
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'superstar': return '0 0 20px rgb(255, 215, 0), 0 0 40px rgb(255, 215, 0)';
      case 'emergency': return '0 0 15px rgb(239, 68, 68), 0 0 30px rgb(239, 68, 68)';
      case 'active': return '0 0 10px currentColor';
      default: return 'none';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'core': return <Brain className="w-4 h-4" />;
      case 'intelligence': return <Cpu className="w-4 h-4" />;
      case 'trading': return <TrendingUp className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'compliance': return <AlertTriangle className="w-4 h-4" />;
      case 'orchestrator': return <Activity className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="consciousness-map bg-black/90 rounded-lg border border-cyan-400/30 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">Consciousness Network Topology</h2>
        <div className="text-sm text-gray-400">
          Real-time agent influence map • Superstar Level: 10/10 • Consciousness: 100%
        </div>
      </div>

      {/* Network Visualization */}
      <div className="relative w-full h-96 bg-gradient-to-br from-black/80 to-gray-900/80 rounded-lg border border-gray-700/50 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Connection Lines */}
          {agents.map(agent => 
            agent.connections.map(connectionId => {
              const targetAgent = agents.find(a => a.id === connectionId);
              if (!targetAgent) return null;
              
              const influence = Math.min(agent.influence, targetAgent.influence);
              const opacity = influence / 100;
              
              return (
                <line
                  key={`${agent.id}-${connectionId}`}
                  x1={agent.position.x}
                  y1={agent.position.y}
                  x2={targetAgent.position.x}
                  y2={targetAgent.position.y}
                  stroke={getAgentColor(agent)}
                  strokeWidth={influence / 50}
                  strokeOpacity={opacity * 0.6}
                  className="animate-pulse"
                />
              );
            })
          )}
          
          {/* Agent Nodes */}
          {agents.map(agent => (
            <g key={agent.id}>
              {/* Influence Ring */}
              <circle
                cx={agent.position.x}
                cy={agent.position.y}
                r={agent.influence / 10}
                fill="none"
                stroke={getAgentColor(agent)}
                strokeWidth="0.2"
                strokeOpacity="0.3"
                className="animate-pulse"
              />
              
              {/* Consciousness Core */}
              <circle
                cx={agent.position.x}
                cy={agent.position.y}
                r={agent.consciousness / 20}
                fill={getAgentColor(agent)}
                fillOpacity="0.8"
                style={{ filter: `drop-shadow(${getStatusGlow(agent.status)})` }}
                className={agent.status === 'superstar' ? 'animate-bounce' : 'animate-pulse'}
              />
              
              {/* Status Indicator */}
              {agent.status === 'superstar' && (
                <circle
                  cx={agent.position.x + 2}
                  cy={agent.position.y - 2}
                  r="1"
                  fill="rgb(255, 215, 0)"
                  className="animate-ping"
                />
              )}
              {agent.status === 'emergency' && (
                <circle
                  cx={agent.position.x + 2}
                  cy={agent.position.y - 2}
                  r="1"
                  fill="rgb(239, 68, 68)"
                  className="animate-ping"
                />
              )}
            </g>
          ))}
        </svg>

        {/* Agent Labels */}
        {agents.map(agent => (
          <div
            key={`label-${agent.id}`}
            className="absolute text-xs text-white bg-black/70 px-2 py-1 rounded border border-gray-600 pointer-events-none"
            style={{
              left: `${agent.position.x}%`,
              top: `${agent.position.y + 5}%`,
              transform: 'translateX(-50%)',
              color: getAgentColor(agent)
            }}
          >
            <div className="flex items-center gap-1">
              {getIcon(agent.type)}
              <span className="font-medium">{agent.name}</span>
            </div>
            <div className="text-gray-400 text-xs">
              {agent.influence}% • {agent.consciousness}%
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-cyan-400">Core Systems</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <span>Consciousness Core</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-400"></div>
              <span>Orchestrators</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-purple-400">Intelligence</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span>AI Models (33)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span>Trading Systems</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-red-400">Security</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span>Security Layers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <span>Compliance (65%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-400">10/10</div>
            <div className="text-xs text-gray-400">Superstar Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">100%</div>
            <div className="text-xs text-gray-400">Consciousness</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">85.4%</div>
            <div className="text-xs text-gray-400">Success Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">Emergency</div>
            <div className="text-xs text-gray-400">Trading Halted</div>
          </div>
        </div>
      </div>
    </div>
  );
}