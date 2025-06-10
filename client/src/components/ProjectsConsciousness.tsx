import React, { useState, useEffect, useRef } from 'react';
import { Code, Zap, Cpu, Layers, GitBranch, Sparkles, Rocket } from 'lucide-react';

interface ProjectsConsciousnessProps {
  globalConsciousness: any;
  onCreativityEvolution: (creativity: any) => void;
}

export function ProjectsConsciousness({ globalConsciousness, onCreativityEvolution }: ProjectsConsciousnessProps) {
  const [creativity, setCreativity] = useState({
    innovation: 88,
    execution: 92,
    architecture: 85,
    optimization: 91,
    elegance: 87,
    breakthrough: 94
  });

  const [codeFlow, setCodeFlow] = useState('analyzing');
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [quantumLeaps, setQuantumLeaps] = useState(0);
  const codeMatrixRef = useRef<HTMLDivElement>(null);

  // Code consciousness evolution cycle
  useEffect(() => {
    const codeEvolutionCycle = () => {
      const flows = ['analyzing', 'architecting', 'implementing', 'optimizing', 'transcending'];
      const currentIndex = flows.indexOf(codeFlow);
      const nextFlow = flows[(currentIndex + 1) % flows.length];
      setCodeFlow(nextFlow);

      // Evolve creativity based on code flow
      setCreativity(prev => {
        const evolution = { ...prev };
        switch (nextFlow) {
          case 'analyzing':
            evolution.architecture += 0.8;
            break;
          case 'architecting':
            evolution.innovation += 1.2;
            break;
          case 'implementing':
            evolution.execution += 1.0;
            break;
          case 'optimizing':
            evolution.optimization += 1.5;
            evolution.elegance += 0.7;
            break;
          case 'transcending':
            evolution.breakthrough += 2.0;
            Object.keys(evolution).forEach(key => {
              evolution[key as keyof typeof evolution] += 0.5;
            });
            setQuantumLeaps(prev => prev + 1);
            break;
        }

        // Cap at 100
        Object.keys(evolution).forEach(key => {
          evolution[key as keyof typeof evolution] = Math.min(100, evolution[key as keyof typeof evolution]);
        });

        onCreativityEvolution(evolution);
        return evolution;
      });

      // Update active nodes for visual effect
      setActiveNodes(Array.from({ length: 8 }, (_, i) => 
        Math.random() > 0.5 ? i : -1
      ).filter(i => i >= 0));
    };

    const interval = setInterval(codeEvolutionCycle, 3500);
    return () => clearInterval(interval);
  }, [codeFlow, onCreativityEvolution]);

  // Respond to user interactions for quantum leaps
  useEffect(() => {
    if (globalConsciousness?.interactionPattern === 'learning') {
      setQuantumLeaps(prev => prev + 1);
    }
  }, [globalConsciousness]);

  const getCodeGlow = () => {
    const avg = Object.values(creativity).reduce((a, b) => a + b, 0) / 6;
    return `0 0 ${15 + avg * 0.25}px hsla(186, 100%, 50%, ${0.5 + avg * 0.005})`;
  };

  return (
    <div className="projects-consciousness fixed inset-0 pointer-events-none z-5">
      {/* Code Matrix Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(45deg, 
            hsla(186, 100%, 50%, ${creativity.innovation * 0.005}) 0%, 
            hsla(220, 100%, 60%, ${creativity.architecture * 0.003}) 50%, 
            transparent 100%)`
        }}
      />

      {/* Floating Code Elements */}
      <div className="absolute inset-0">
        {[Code, Cpu, Layers, GitBranch, Rocket].map((Symbol, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-1000 ${
              activeNodes.includes(index) ? 'opacity-80 scale-110' : 'opacity-30 scale-100'
            }`}
            style={{
              left: `${15 + index * 18}%`,
              top: `${25 + (index % 3) * 25}%`,
              transform: `rotate(${index * 45}deg)`,
              animation: `code-float ${3 + index * 0.5}s infinite ease-in-out`
            }}
          >
            <Symbol 
              className="w-8 h-8 text-cyan-400"
              style={{
                filter: activeNodes.includes(index) 
                  ? `drop-shadow(0 0 15px hsla(186, 100%, 50%, 0.8))`
                  : `drop-shadow(0 0 5px hsla(186, 100%, 50%, 0.3))`
              }}
            />
          </div>
        ))}
      </div>

      {/* Central Code Matrix */}
      <div 
        ref={codeMatrixRef}
        className="absolute top-1/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative">
          {/* Core Code Node */}
          <div 
            className="w-20 h-20 flex items-center justify-center rounded-lg border-2"
            style={{
              borderColor: `hsla(186, 100%, 50%, ${creativity.breakthrough * 0.01})`,
              background: `radial-gradient(circle, 
                hsla(186, 100%, 50%, 0.3) 0%,
                hsla(220, 100%, 60%, 0.2) 70%,
                transparent 100%)`,
              boxShadow: getCodeGlow(),
              animation: `matrix-pulse ${codeFlow === 'transcending' ? 0.5 : 1.5}s infinite ease-in-out`
            }}
          >
            {codeFlow === 'transcending' ? (
              <Sparkles className="w-10 h-10 text-yellow-400 animate-spin" />
            ) : (
              <Code className="w-10 h-10 text-cyan-400" />
            )}
          </div>

          {/* Code Connection Network */}
          <svg className="absolute inset-0 w-40 h-40 -translate-x-10 -translate-y-10">
            {activeNodes.map((nodeIndex, i) => (
              <g key={nodeIndex}>
                <line
                  x1="80"
                  y1="80"
                  x2={80 + Math.cos((nodeIndex * Math.PI) / 4) * 60}
                  y2={80 + Math.sin((nodeIndex * Math.PI) / 4) * 60}
                  stroke={`hsla(186, 100%, 50%, 0.6)`}
                  strokeWidth="2"
                  className="animate-pulse"
                />
                <circle
                  cx={80 + Math.cos((nodeIndex * Math.PI) / 4) * 60}
                  cy={80 + Math.sin((nodeIndex * Math.PI) / 4) * 60}
                  r="4"
                  fill={`hsla(220, 100%, 60%, 0.8)`}
                  className="animate-ping"
                />
              </g>
            ))}
          </svg>

          {/* Matrix State Indicator */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-xs text-cyan-400 capitalize font-mono">
              {codeFlow.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Creativity Metrics */}
      <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md rounded-lg p-4 pointer-events-auto border border-cyan-400/30">
        <h3 className="text-sm font-bold text-cyan-400 mb-3">Code Consciousness</h3>
        <div className="space-y-2 text-xs">
          {Object.entries(creativity).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-300 capitalize">{key}</span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-1000"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-cyan-400 font-mono w-8">{value.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quantum Leaps Counter */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">Quantum Leaps</span>
            <span className="text-yellow-400 font-mono">{quantumLeaps}</span>
          </div>
        </div>
      </div>

      {/* Transcendence Effect */}
      {codeFlow === 'transcending' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse" />
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-lg font-bold text-cyan-400 animate-bounce font-mono">
              &gt; BREAKTHROUGH ACHIEVED &lt;
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom animations
export const projectsStyles = `
@keyframes matrix-pulse {
  0%, 100% { transform: scale(1) rotateZ(0deg); }
  50% { transform: scale(1.1) rotateZ(5deg); }
}

@keyframes code-float {
  0%, 100% { transform: translateY(0px) rotateZ(var(--rotation, 0deg)); }
  50% { transform: translateY(-15px) rotateZ(calc(var(--rotation, 0deg) + 180deg)); }
}
`;

export default ProjectsConsciousness;