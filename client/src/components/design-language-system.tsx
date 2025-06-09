/**
 * Design Language System: Comprehensive Cross-Empowered Framework
 * Establishes unified visual consistency across all portfolio sections
 * with quantum consciousness principles and cyberpunk aesthetics
 */

import React from 'react';
import { sectionIntegrationPoints, crossEmpoweredInsights } from '@/data/knowledge-synthesis';

export interface DesignSystemProps {
  variant: 'quantum' | 'distributed' | 'sovereign' | 'glassmorphic' | 'neural';
  intensity: 'subtle' | 'medium' | 'intense';
  section: string;
}

// Unified color palette based on VibeCoding Constitution
export const quantumColorSystem = {
  primary: {
    cyan: 'var(--spectrum-cyan)',
    blue: 'var(--spectrum-blue)',
    violet: 'var(--spectrum-violet)',
    purple: 'var(--spectrum-purple)',
    pink: 'var(--spectrum-pink)',
    green: 'var(--spectrum-green)',
    teal: 'var(--spectrum-teal)',
    orange: 'var(--spectrum-orange)',
    red: 'var(--spectrum-red)'
  },
  consciousness: {
    quantum: 'from-cyan-400 via-blue-500 to-purple-600',
    distributed: 'from-purple-400 via-pink-500 to-red-500',
    sovereign: 'from-blue-400 via-cyan-400 to-white',
    glassmorphic: 'from-cyan-400/20 via-blue-500/30 to-purple-600/20',
    neural: 'from-green-400 to-teal-500'
  },
  infrastructure: {
    proxmox: 'from-teal-400 to-cyan-500',
    ansible: 'from-purple-400 to-indigo-500',
    gaming: 'from-red-400 to-pink-500',
    vr: 'from-violet-400 to-purple-500',
    charter: 'from-blue-400 via-cyan-400 to-white'
  }
};

// Unified animation system
export const quantumAnimations = {
  particles: {
    subtle: 15,
    medium: 25,
    intense: 35
  },
  timing: {
    fast: '3s',
    medium: '6s',
    slow: '12s',
    philosophical: '30s'
  },
  delays: {
    cascade: (index: number) => `${index * 0.1}s`,
    stagger: (index: number) => `${index * 0.2}s`,
    consciousness: (index: number) => `${index * 0.5}s`
  }
};

// Cross-empowered component patterns
export const QuantumPanel: React.FC<{
  children: React.ReactNode;
  variant: DesignSystemProps['variant'];
  className?: string;
}> = ({ children, variant, className = '' }) => {
  const variantClasses = {
    quantum: 'holo-panel border-cyan-400/50 gacha-shine energy-flow',
    distributed: 'holo-panel border-purple-400/50 prismatic-glass',
    sovereign: 'holo-panel border-blue-400/50 frost-aura',
    glassmorphic: 'prismatic-glass border-cyan-400/30',
    neural: 'holo-panel border-green-400/50 neural-glow'
  };

  return (
    <div className={`${variantClasses[variant]} p-8 rounded-3xl ${className}`}>
      {children}
    </div>
  );
};

export const ConsciousnessMetrics: React.FC<{
  section: string;
}> = ({ section }) => {
  const insights = sectionIntegrationPoints[section as keyof typeof sectionIntegrationPoints];
  
  if (!insights) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {insights.technicalHighlights.map((highlight, index) => (
        <div 
          key={highlight}
          className="text-center p-3 rounded-lg bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-400/20"
          style={{ animationDelay: quantumAnimations.delays.cascade(index) }}
        >
          <div className="text-xs text-cyan-300 font-mono">{highlight}</div>
        </div>
      ))}
    </div>
  );
};

export const PhilosophicalFramework: React.FC<{
  section: string;
}> = ({ section }) => {
  const insights = sectionIntegrationPoints[section as keyof typeof sectionIntegrationPoints];
  
  if (!insights) return null;

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-lg border border-purple-400/20">
      <div className="flex items-center mb-2">
        <i className="fas fa-lightbulb text-yellow-400 mr-2 text-xs"></i>
        <span className="text-xs text-purple-300 font-semibold">VibeCoding Framework</span>
      </div>
      <p className="text-xs text-purple-200 italic">
        {insights.philosophicalFramework}
      </p>
    </div>
  );
};

// Unified header system for all sections
export const QuantumSectionHeader: React.FC<{
  icon: string;
  systemName: string;
  title: string;
  description: string;
  variant: DesignSystemProps['variant'];
}> = ({ icon, systemName, title, description, variant }) => {
  const gradientMap = {
    quantum: quantumColorSystem.consciousness.quantum,
    distributed: quantumColorSystem.consciousness.distributed,
    sovereign: quantumColorSystem.consciousness.sovereign,
    glassmorphic: quantumColorSystem.consciousness.glassmorphic,
    neural: quantumColorSystem.consciousness.neural
  };

  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center justify-center px-6 py-3 holo-panel rounded-full border border-cyan-400/50 mb-8">
        <i className={`${icon} text-cyan-400 mr-3`}></i>
        <span className="text-cyan-300 text-sm font-medium">{systemName}</span>
      </div>
      
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space">
        <span className="holo-text">{title}</span>
      </h2>
      
      <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
};

// Background system generator
export const QuantumBackground: React.FC<{
  variant: DesignSystemProps['variant'];
  intensity: DesignSystemProps['intensity'];
  backgroundImage?: string;
}> = ({ variant, intensity, backgroundImage }) => {
  const particleCount = quantumAnimations.particles[intensity];
  
  return (
    <>
      {/* Cosmic Background Layer */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
            style={{
              backgroundImage: `url('${backgroundImage}')`,
              filter: 'brightness(0.25) saturate(1.3)',
            }}
          />
        </div>
      )}

      {/* Quantum Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20 z-5"></div>

      {/* Consciousness Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(particleCount)].map((_, i) => (
          <div
            key={i}
            className="quantum-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${6 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>
    </>
  );
};

// Export design system utilities
export const designSystemUtils = {
  getInsightsBySection: (section: string) => 
    crossEmpoweredInsights.filter(insight => 
      insight.relevantSections.includes(section)
    ),
  
  getSectionGradient: (variant: DesignSystemProps['variant']) => 
    quantumColorSystem.consciousness[variant],
  
  getAnimationDelay: (index: number, type: 'cascade' | 'stagger' | 'consciousness' = 'cascade') =>
    quantumAnimations.delays[type](index),
  
  generateParticles: (count: number = 20) => 
    [...Array(count)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${4 + Math.random() * 6}s`
    }))
};

export default {
  QuantumPanel,
  ConsciousnessMetrics,
  PhilosophicalFramework,
  QuantumSectionHeader,
  QuantumBackground,
  quantumColorSystem,
  quantumAnimations,
  designSystemUtils
};