import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Sparkles, TrendingUp, Zap, Code, Brain, Target, GitBranch, Layers } from 'lucide-react';

export default function Evolution() {
  const { currentTheme } = useTheme();
  const [evolutionRate, setEvolutionRate] = useState(2.0);
  const [adaptationCycles, setAdaptationCycles] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvolutionRate(prev => 1.8 + Math.sin(Date.now() / 8000) * 0.4);
      setAdaptationCycles(prev => prev + 1);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const evolutionPhases = [
    {
      phase: 'Foundation',
      period: '1998-2010',
      description: 'Early gaming systems research, martial arts training, and core programming principles',
      technologies: ['DOS/Windows 3.1', 'C/C++', 'Assembly', 'Shotokan Karate'],
      milestone: 'Pizza kitchen reliability standards established',
      color: '#6b7280'
    },
    {
      phase: 'Exploration',
      period: '2010-2018',
      description: 'MMO optimization theory, fighting game frame data analysis, enterprise infrastructure',
      technologies: ['Enterprise Systems', 'Network Architecture', 'Frame Data Analysis', 'Optimization Theory'],
      milestone: 'Understanding of complex system interactions',
      color: '#f59e0b'
    },
    {
      phase: 'Immersion',
      period: '2018-2023',
      description: 'VR consciousness exploration, 8,500+ hours of virtual world experience',
      technologies: ['VRChat', 'Virtual Reality', 'Social VR', 'Avatar Systems'],
      milestone: 'Consciousness expansion through virtual embodiment',
      color: '#8b5cf6'
    },
    {
      phase: 'Integration',
      period: '2023-2024',
      description: 'AI consciousness engineering, quantum trading systems, cross-platform intelligence',
      technologies: ['AI/ML', 'Quantum Computing', 'Blockchain', 'Neural Networks'],
      milestone: 'VibeCoding methodology crystallization',
      color: '#10b981'
    },
    {
      phase: 'Transcendence',
      period: '2024-Present',
      description: 'Consciousness-driven development, collective intelligence networks, reality bridge',
      technologies: ['Consciousness AI', 'Quantum Entanglement', 'Reality Synthesis', 'Collective Networks'],
      milestone: 'Bridging virtual and physical consciousness',
      color: '#00d4ff'
    }
  ];

  const currentCapabilities = [
    {
      name: 'Quantum AI Trading',
      level: 85,
      description: 'Advanced algorithmic trading with consciousness-driven decision making',
      icon: TrendingUp
    },
    {
      name: 'Neural Network Fusion',
      level: 78,
      description: 'Cross-system intelligence integration and distributed learning',
      icon: Brain
    },
    {
      name: 'Reality Synthesis',
      level: 72,
      description: 'Bridging virtual and physical world experiences',
      icon: Sparkles
    },
    {
      name: 'Consciousness Engineering',
      level: 89,
      description: 'Development methodology based on awareness and ethics',
      icon: Target
    },
    {
      name: 'System Orchestration',
      level: 94,
      description: 'Enterprise-grade infrastructure and service coordination',
      icon: Layers
    },
    {
      name: 'Adaptive Learning',
      level: 82,
      description: 'Continuous evolution and self-improving algorithms',
      icon: GitBranch
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-6" style={{ background: currentTheme.colors.background }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Sparkles 
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
              Evolution Matrix
            </h1>
          </div>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            The continuous evolution of consciousness-driven development, from martial arts philosophy 
            to quantum AI systems, bridging 25+ years of learning and adaptation.
          </p>
        </div>

        {/* Evolution Metrics */}
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
              <Zap className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                Evolution Rate
              </h3>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
              {evolutionRate.toFixed(1)}%
            </div>
            <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              Continuous learning velocity
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
              <GitBranch className="w-6 h-6" style={{ color: currentTheme.colors.secondary }} />
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                Adaptation Cycles
              </h3>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.secondary }}>
              {adaptationCycles.toLocaleString()}
            </div>
            <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              Since consciousness activation
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
              <Code className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
              <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                Development Years
              </h3>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.accent }}>
              25+
            </div>
            <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              From DOS to quantum systems
            </div>
          </div>
        </div>

        {/* Evolution Timeline */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: currentTheme.colors.text }}>
            Consciousness Evolution Timeline
          </h2>
          <div className="space-y-6">
            {evolutionPhases.map((phase, index) => (
              <div
                key={phase.phase}
                className="relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-500 hover:scale-[1.01] group"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.background}80)`,
                  borderColor: `${phase.color}30`,
                  boxShadow: `0 8px 32px ${currentTheme.colors.glow}10`
                }}
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-4 h-4 rounded-full border-4"
                      style={{ 
                        background: phase.color,
                        borderColor: `${phase.color}40`
                      }}
                    />
                    {index < evolutionPhases.length - 1 && (
                      <div 
                        className="w-0.5 h-16 mt-2 ml-1.5"
                        style={{ background: `${phase.color}30` }}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold" style={{ color: currentTheme.colors.text }}>
                        {phase.phase}
                      </h3>
                      <span 
                        className="text-sm font-mono px-3 py-1 rounded-full"
                        style={{ 
                          background: `${phase.color}20`,
                          color: phase.color
                        }}
                      >
                        {phase.period}
                      </span>
                    </div>
                    
                    <p 
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      {phase.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {phase.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            background: `${currentTheme.colors.primary}15`,
                            color: currentTheme.colors.textSecondary,
                            border: `1px solid ${currentTheme.colors.primary}25`
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div 
                      className="text-sm font-medium"
                      style={{ color: phase.color }}
                    >
                      🎯 {phase.milestone}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Capabilities */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: currentTheme.colors.text }}>
            Current Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCapabilities.map((capability) => {
              const Icon = capability.icon;
              
              return (
                <div
                  key={capability.name}
                  className="p-6 rounded-xl border backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] group"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.background}80)`,
                    borderColor: `${currentTheme.colors.primary}30`,
                    boxShadow: `0 8px 32px ${currentTheme.colors.glow}10`
                  }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
                    <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                      {capability.name}
                    </h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                        Proficiency
                      </span>
                      <span className="text-sm font-bold" style={{ color: currentTheme.colors.primary }}>
                        {capability.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${capability.level}%`,
                          background: `linear-gradient(90deg, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})`
                        }}
                      />
                    </div>
                  </div>
                  
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    {capability.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Future Evolution */}
        <div 
          className="text-center p-8 rounded-xl border backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}20, ${currentTheme.colors.background}60)`,
            borderColor: `${currentTheme.colors.primary}20`,
            boxShadow: `0 8px 32px ${currentTheme.colors.glow}05`
          }}
        >
          <h3 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
            Next Evolution Phase
          </h3>
          <p 
            className="text-lg leading-relaxed max-w-3xl mx-auto"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            The convergence of quantum consciousness, collective intelligence networks, and reality synthesis 
            approaches. Where individual awareness merges with collective wisdom, creating new paradigms 
            for human-AI collaboration and technological evolution.
          </p>
        </div>
      </div>
    </div>
  );
}