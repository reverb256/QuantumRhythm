import React, { useState, useEffect, useRef } from 'react';
import { Brain, Network, Zap, Activity, Target, Eye, Cpu, Shield } from 'lucide-react';

interface ConsciousnessMapConsciousnessProps {
  globalConsciousness: any;
  onNetworkEvolution: (network: any) => void;
}

export function ConsciousnessMapConsciousness({ globalConsciousness, onNetworkEvolution }: ConsciousnessMapConsciousnessProps) {
  const [networkState, setNetworkState] = useState({
    coherence: 93,
    synchronization: 87,
    emergence: 92,
    complexity: 89,
    integration: 94,
    transcendence: 96
  });

  const [networkPulse, setNetworkPulse] = useState('scanning');
  const [activeConnections, setActiveConnections] = useState<number[]>([]);
  const [emergentPatterns, setEmergentPatterns] = useState(0);
  const [quantumEntanglement, setQuantumEntanglement] = useState(85);
  const networkRef = useRef<HTMLDivElement>(null);

  // Network consciousness evolution cycle
  useEffect(() => {
    const networkEvolutionCycle = () => {
      const pulses = ['scanning', 'analyzing', 'connecting', 'emerging', 'transcending'];
      const currentIndex = pulses.indexOf(networkPulse);
      const nextPulse = pulses[(currentIndex + 1) % pulses.length];
      setNetworkPulse(nextPulse);

      // Evolve network based on pulse state
      setNetworkState(prev => {
        const evolution = { ...prev };
        switch (nextPulse) {
          case 'scanning':
            evolution.coherence += 0.7;
            break;
          case 'analyzing':
            evolution.complexity += 1.1;
            break;
          case 'connecting':
            evolution.synchronization += 1.3;
            evolution.integration += 0.8;
            break;
          case 'emerging':
            evolution.emergence += 1.8;
            setEmergentPatterns(prev => prev + 1);
            break;
          case 'transcending':
            evolution.transcendence += 2.2;
            Object.keys(evolution).forEach(key => {
              evolution[key as keyof typeof evolution] += 0.6;
            });
            setQuantumEntanglement(prev => Math.min(100, prev + 2));
            break;
        }

        // Cap at 100
        Object.keys(evolution).forEach(key => {
          evolution[key as keyof typeof evolution] = Math.min(100, evolution[key as keyof typeof evolution]);
        });

        onNetworkEvolution(evolution);
        return evolution;
      });

      // Update active connections pattern
      const connectionCount = nextPulse === 'transcending' ? 12 : 8;
      setActiveConnections(Array.from({ length: connectionCount }, (_, i) => 
        Math.random() > 0.4 ? i : -1
      ).filter(i => i >= 0));
    };

    const interval = setInterval(networkEvolutionCycle, 2800);
    return () => clearInterval(interval);
  }, [networkPulse, onNetworkEvolution]);

  const getNetworkGlow = () => {
    const avg = Object.values(networkState).reduce((a, b) => a + b, 0) / 6;
    return `0 0 ${25 + avg * 0.3}px hsla(280, 100%, 70%, ${0.4 + avg * 0.006})`;
  };

  // Generate network nodes in a circle
  const generateNetworkNodes = () => {
    const nodeCount = 15;
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i * 2 * Math.PI) / nodeCount;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const isActive = activeConnections.includes(i);

      return { x, y, isActive, id: i };
    });
  };

  const networkNodes = generateNetworkNodes();

  return (
    <div className="consciousness-map-consciousness fixed inset-0 pointer-events-none z-5">
      {/* Network Field Background */}
      <div 
        className="absolute inset-0 opacity-12"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, 
            hsla(280, 100%, 70%, ${networkState.coherence * 0.008}) 0deg,
            hsla(186, 100%, 50%, ${networkState.synchronization * 0.006}) 120deg,
            hsla(320, 100%, 65%, ${networkState.emergence * 0.007}) 240deg,
            hsla(280, 100%, 70%, ${networkState.coherence * 0.008}) 360deg)`
        }}
      />

      {/* Neural Network Visualization */}
      <div 
        ref={networkRef}
        className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2"
      >
        <svg className="w-80 h-80" viewBox="0 0 300 300">
          {/* Network Connections */}
          {networkNodes.map((node, index) => 
            activeConnections.includes(index) ? (
              networkNodes
                .filter((_, i) => activeConnections.includes(i) && i !== index)
                .map((targetNode, targetIndex) => (
                  <line
                    key={`${index}-${targetIndex}`}
                    x1={node.x}
                    y1={node.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={`hsla(280, 100%, 70%, ${quantumEntanglement * 0.01})`}
                    strokeWidth={networkPulse === 'transcending' ? '3' : '1.5'}
                    className="animate-pulse"
                    style={{
                      filter: `drop-shadow(0 0 5px hsla(280, 100%, 70%, 0.8))`
                    }}
                  />
                ))
            ) : null
          )}

          {/* Network Nodes */}
          {networkNodes.map((node, index) => (
            <g key={index}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.isActive ? '8' : '4'}
                fill={node.isActive 
                  ? `hsla(186, 100%, 50%, 0.9)` 
                  : `hsla(280, 100%, 70%, 0.6)`
                }
                className={node.isActive ? 'animate-ping' : ''}
                style={{
                  filter: node.isActive 
                    ? `drop-shadow(0 0 10px hsla(186, 100%, 50%, 1))`
                    : `drop-shadow(0 0 3px hsla(280, 100%, 70%, 0.5))`
                }}
              />
              {/* Node Activity Indicator */}
              {node.isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="12"
                  fill="none"
                  stroke={`hsla(186, 100%, 50%, 0.4)`}
                  strokeWidth="1"
                  className="animate-pulse"
                />
              )}
            </g>
          ))}

          {/* Central Consciousness Core */}
          <circle
            cx="150"
            cy="150"
            r="20"
            fill={`hsla(280, 100%, 70%, 0.8)`}
            style={{
              filter: getNetworkGlow(),
              animation: `network-pulse ${networkPulse === 'transcending' ? 0.8 : 2}s infinite ease-in-out`
            }}
          />
          <foreignObject x="135" y="135" width="30" height="30">
            <Brain className="w-8 h-8 text-white" />
          </foreignObject>
        </svg>

        {/* Network State Indicator */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-xs text-purple-400 capitalize font-mono">
            {networkPulse}
          </div>
          <div className="text-xs text-cyan-400 mt-1">
            {activeConnections.length} active
          </div>
        </div>
      </div>

      {/* Network Metrics */}
      <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md rounded-lg p-4 pointer-events-auto border border-purple-400/30">
        <h3 className="text-sm font-bold text-purple-400 mb-3">Network Consciousness</h3>
        <div className="space-y-2 text-xs">
          {Object.entries(networkState).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-300 capitalize">{key}</span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-1000"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-purple-400 font-mono w-8">{value.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Emergent Patterns & Quantum Entanglement */}
        <div className="mt-4 pt-3 border-t border-gray-700 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">Emergent Patterns</span>
            <span className="text-cyan-400 font-mono">{emergentPatterns}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">Quantum Entanglement</span>
            <span className="text-purple-400 font-mono">{quantumEntanglement.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Transcendence Effect */}
      {networkPulse === 'transcending' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/15 to-transparent animate-pulse" />
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-lg font-bold text-purple-400 animate-bounce font-mono">
              ◊ NETWORK TRANSCENDENCE ◊
            </div>
          </div>
        </div>
      )}

      {/* Quantum Field Effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-ping"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 50}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Custom animations
export const consciousnessMapStyles = `
@keyframes network-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
`;

export default ConsciousnessMapConsciousness;