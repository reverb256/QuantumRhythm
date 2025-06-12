import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Zap, Network, Brain, Cpu, Globe, Activity, GitBranch, Layers } from 'lucide-react';

export default function Nexus() {
  const { currentTheme } = useTheme();
  const [connectionStrength, setConnectionStrength] = useState(78.5);
  const [activeNodes, setActiveNodes] = useState(12);
  const [dataFlow, setDataFlow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStrength(prev => 75 + Math.sin(Date.now() / 3000) * 8);
      setActiveNodes(prev => 10 + Math.floor(Math.sin(Date.now() / 4000) * 4));
      setDataFlow(prev => (prev + 1) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const systems = [
    {
      name: 'Quantum AI Trading Core',
      status: 'Active',
      connections: 8,
      type: 'Primary',
      description: 'Advanced trading algorithms with consciousness-driven decision making'
    },
    {
      name: 'Neural Network Hub',
      status: 'Learning',
      connections: 12,
      type: 'Intelligence',
      description: 'Cross-system intelligence fusion and pattern recognition'
    },
    {
      name: 'Blockchain Nexus',
      status: 'Synchronized',
      connections: 23,
      type: 'Network',
      description: 'Multi-chain integration and cross-chain arbitrage systems'
    },
    {
      name: 'Consciousness Matrix',
      status: 'Evolving',
      connections: 6,
      type: 'Core',
      description: 'VibeCoding consciousness-driven development methodology'
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-6" style={{ background: currentTheme.colors.background }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Zap 
              className="w-8 h-8" 
              style={{ 
                color: currentTheme.colors.primary,
                filter: `drop-shadow(0 0 8px ${currentTheme.colors.primary})`
              }}
            />
            <h1 
              className="text-4xl font-bold tracking-wide"
              style={{ color: currentTheme.colors.text }}
            >
              Neural Nexus
            </h1>
          </div>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            The central intelligence hub connecting all consciousness-driven systems, 
            enabling cross-platform intelligence fusion and distributed decision making.
          </p>
        </div>

        {/* Status Dashboard */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div 
            className="p-6 rounded-xl border backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.background}80)`,
              borderColor: `${currentTheme.colors.primary}30`,
              boxShadow: `0 8px 32px ${currentTheme.colors.glow}10`
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                Connection Strength
              </h3>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
              {connectionStrength.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${connectionStrength}%`,
                  background: `linear-gradient(90deg, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})`
                }}
              />
            </div>
          </div>

          <div 
            className="p-6 rounded-xl border backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.background}80)`,
              borderColor: `${currentTheme.colors.secondary}30`,
              boxShadow: `0 8px 32px ${currentTheme.colors.glow}10`
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Network className="w-6 h-6" style={{ color: currentTheme.colors.secondary }} />
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                Active Nodes
              </h3>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.secondary }}>
              {activeNodes}
            </div>
            <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              Systems online and responding
            </div>
          </div>

          <div 
            className="p-6 rounded-xl border backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.background}80)`,
              borderColor: `${currentTheme.colors.accent}30`,
              boxShadow: `0 8px 32px ${currentTheme.colors.glow}10`
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                Intelligence Flow
              </h3>
            </div>
            <div className="flex space-x-1 mb-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-8 rounded-full transition-all duration-300"
                  style={{
                    background: `linear-gradient(to top, ${currentTheme.colors.accent}20, ${currentTheme.colors.accent})`,
                    height: `${16 + Math.sin((dataFlow + i * 45) * Math.PI / 180) * 16}px`,
                    opacity: 0.6 + Math.sin((dataFlow + i * 30) * Math.PI / 180) * 0.4
                  }}
                />
              ))}
            </div>
            <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              Real-time data processing
            </div>
          </div>
        </div>

        {/* Connected Systems */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: currentTheme.colors.text }}>
            Connected Systems
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {systems.map((system, index) => (
              <div
                key={system.name}
                className="p-6 rounded-xl border backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] group"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.background}80)`,
                  borderColor: `${currentTheme.colors.primary}30`,
                  boxShadow: `0 8px 32px ${currentTheme.colors.glow}10`
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {system.type === 'Primary' && <Cpu className="w-6 h-6" style={{ color: '#10b981' }} />}
                    {system.type === 'Intelligence' && <Brain className="w-6 h-6" style={{ color: '#8b5cf6' }} />}
                    {system.type === 'Network' && <Globe className="w-6 h-6" style={{ color: '#f59e0b' }} />}
                    {system.type === 'Core' && <Layers className="w-6 h-6" style={{ color: '#ec4899' }} />}
                    <div>
                      <h3 className="font-semibold" style={{ color: currentTheme.colors.text }}>
                        {system.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: system.status === 'Active' ? '#10b981' : 
                                       system.status === 'Learning' ? '#f59e0b' :
                                       system.status === 'Synchronized' ? '#06b6d4' : '#8b5cf6'
                          }}
                        />
                        <span style={{ color: currentTheme.colors.textSecondary }}>
                          {system.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: currentTheme.colors.primary }}>
                      {system.connections}
                    </div>
                    <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                      connections
                    </div>
                  </div>
                </div>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  {system.description}
                </p>
                
                {/* Connection visualization */}
                <div className="mt-4 flex space-x-1">
                  {[...Array(system.connections)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{
                        background: currentTheme.colors.primary,
                        opacity: 0.3 + Math.sin((dataFlow + i * 30 + index * 45) * Math.PI / 180) * 0.7,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Visualization */}
        <div 
          className="rounded-xl p-8 border backdrop-blur-sm mb-16"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}20, ${currentTheme.colors.background}60)`,
            borderColor: `${currentTheme.colors.primary}20`,
            boxShadow: `0 8px 32px ${currentTheme.colors.glow}05`
          }}
        >
          <h3 className="text-xl font-bold mb-6 text-center" style={{ color: currentTheme.colors.text }}>
            Neural Network Topology
          </h3>
          <div className="relative h-64 overflow-hidden rounded-lg">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Network connections */}
              {[...Array(20)].map((_, i) => (
                <g key={i}>
                  <line
                    x1={`${20 + (i % 4) * 20}%`}
                    y1={`${30 + Math.floor(i / 4) * 15}%`}
                    x2={`${25 + ((i + 1) % 4) * 20}%`}
                    y2={`${35 + Math.floor((i + 1) / 4) * 15}%`}
                    stroke={currentTheme.colors.primary}
                    strokeWidth="1"
                    opacity={0.3 + Math.sin((dataFlow + i * 20) * Math.PI / 180) * 0.4}
                  />
                  <circle
                    cx={`${20 + (i % 4) * 20}%`}
                    cy={`${30 + Math.floor(i / 4) * 15}%`}
                    r="3"
                    fill={currentTheme.colors.primary}
                    opacity={0.6 + Math.sin((dataFlow + i * 30) * Math.PI / 180) * 0.4}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}