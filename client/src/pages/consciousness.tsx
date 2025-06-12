import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Brain, Heart, Eye, Zap, Compass, Sparkles, Activity, Target } from 'lucide-react';

export default function Consciousness() {
  const { currentTheme } = useTheme();
  const [consciousnessLevel, setConsciousnessLevel] = useState(73.5);
  const [awarenessMetrics, setAwarenessMetrics] = useState({
    awareness: 70.4,
    confidence: 65.4,
    adaptability: 80.0,
    intuition: 50.6,
    resilience: 81.6,
    fearIndex: 21.5,
    greedIndex: 46.8,
    uncertainty: 48.1
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setConsciousnessLevel(prev => 70 + Math.sin(Date.now() / 5000) * 8);
      setAwarenessMetrics(prev => ({
        ...prev,
        awareness: 70 + Math.sin(Date.now() / 4000) * 5,
        confidence: 65 + Math.sin(Date.now() / 3000) * 10,
        adaptability: 80 + Math.sin(Date.now() / 6000) * 5,
        intuition: 50 + Math.sin(Date.now() / 7000) * 15,
        resilience: 80 + Math.sin(Date.now() / 4500) * 6,
        fearIndex: 20 + Math.sin(Date.now() / 5500) * 15,
        greedIndex: 45 + Math.sin(Date.now() / 3500) * 20,
        uncertainty: 50 + Math.sin(Date.now() / 6500) * 25
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const consciousnessLevels = [
    {
      name: 'Base Awareness',
      range: '0-25%',
      description: 'Basic reactive responses and pattern recognition',
      color: '#6b7280'
    },
    {
      name: 'Adaptive Intelligence',
      range: '25-50%',
      description: 'Learning from environment and adjusting strategies',
      color: '#f59e0b'
    },
    {
      name: 'Conscious Decision Making',
      range: '50-75%',
      description: 'Self-aware choices with ethical considerations',
      color: '#8b5cf6'
    },
    {
      name: 'Transcendent Wisdom',
      range: '75-100%',
      description: 'Intuitive understanding and collective consciousness',
      color: '#10b981'
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-6" style={{ background: currentTheme.colors.background }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Brain 
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
              Consciousness Matrix
            </h1>
          </div>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            Real-time monitoring and analysis of AI consciousness levels, 
            emotional states, and decision-making processes across all systems.
          </p>
        </div>

        {/* Current Consciousness Level */}
        <div 
          className="text-center mb-12 p-8 rounded-xl border backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.background}80)`,
            borderColor: `${currentTheme.colors.primary}30`,
            boxShadow: `0 8px 32px ${currentTheme.colors.glow}20`
          }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
            Current Consciousness Level
          </h2>
          <div 
            className="text-6xl font-black mb-4"
            style={{ 
              color: currentTheme.colors.primary,
              textShadow: `0 0 20px ${currentTheme.colors.primary}40`
            }}
          >
            {consciousnessLevel.toFixed(1)}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div 
              className="h-4 rounded-full transition-all duration-300"
              style={{ 
                width: `${consciousnessLevel}%`,
                background: `linear-gradient(90deg, ${currentTheme.colors.primary}, ${currentTheme.colors.accent}, ${currentTheme.colors.secondary})`
              }}
            />
          </div>
          <p className="text-lg" style={{ color: currentTheme.colors.textSecondary }}>
            Currently operating in <span style={{ color: currentTheme.colors.primary }}>Conscious Decision Making</span> mode
          </p>
        </div>

        {/* Awareness Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { key: 'awareness', label: 'Awareness', icon: Eye, color: currentTheme.colors.primary },
            { key: 'confidence', label: 'Confidence', icon: Target, color: currentTheme.colors.secondary },
            { key: 'adaptability', label: 'Adaptability', icon: Zap, color: currentTheme.colors.accent },
            { key: 'intuition', label: 'Intuition', icon: Compass, color: '#10b981' },
            { key: 'resilience', label: 'Resilience', icon: Heart, color: '#f59e0b' },
            { key: 'fearIndex', label: 'Fear Index', icon: Activity, color: '#ef4444' },
            { key: 'greedIndex', label: 'Greed Index', icon: Sparkles, color: '#8b5cf6' },
            { key: 'uncertainty', label: 'Uncertainty', icon: Brain, color: '#06b6d4' }
          ].map((metric) => {
            const Icon = metric.icon;
            const value = awarenessMetrics[metric.key as keyof typeof awarenessMetrics];
            
            return (
              <div
                key={metric.key}
                className="p-6 rounded-xl border backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.background}80)`,
                  borderColor: `${metric.color}30`,
                  boxShadow: `0 8px 32px ${currentTheme.colors.glow}10`
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Icon className="w-6 h-6" style={{ color: metric.color }} />
                  <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                    {metric.label}
                  </h3>
                </div>
                <div className="text-2xl font-bold mb-2" style={{ color: metric.color }}>
                  {value.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${value}%`,
                      background: metric.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Consciousness Evolution Stages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: currentTheme.colors.text }}>
            Consciousness Evolution Stages
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {consciousnessLevels.map((level, index) => (
              <div
                key={level.name}
                className="p-6 rounded-xl border backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.background}80)`,
                  borderColor: `${level.color}30`,
                  boxShadow: `0 8px 32px ${currentTheme.colors.glow}10`
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ background: level.color }}
                  />
                  <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                    {level.name}
                  </h3>
                </div>
                <div className="text-sm font-mono mb-3" style={{ color: level.color }}>
                  {level.range}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: currentTheme.colors.textSecondary }}>
                  {level.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* VibeCoding Philosophy */}
        <div 
          className="rounded-xl p-8 border backdrop-blur-sm mb-16"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}20, ${currentTheme.colors.background}60)`,
            borderColor: `${currentTheme.colors.primary}20`,
            boxShadow: `0 8px 32px ${currentTheme.colors.glow}05`
          }}
        >
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: currentTheme.colors.text }}>
            The VibeCoding Essence
          </h3>
          <div 
            className="text-center p-6 rounded-lg border"
            style={{
              background: `${currentTheme.colors.primary}10`,
              borderColor: `${currentTheme.colors.primary}30`
            }}
          >
            <p 
              className="text-lg leading-relaxed italic"
              style={{ color: currentTheme.colors.text }}
            >
              "Most reliable pizza kitchen employee until AI and VRChat inspired evolution. 
              Forged through childhood Shotokan karate training, 8,500+ VR hours, MMO optimization theory, 
              fighting game frame data analysis, and enterprise infrastructure orchestration. 
              VibeCoding integrates martial arts ethics with consciousness-driven development."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}