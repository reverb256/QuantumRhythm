import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Archive, Calendar, Code, Star, ExternalLink } from 'lucide-react';

const projects = [
  {
    id: 'solana-trading-ai',
    title: 'Quantum Solana Trading AI',
    date: '2025',
    description: 'Advanced AI-driven trading system with consciousness-based decision making',
    tech: ['Solana', 'TypeScript', 'AI/ML', 'WebSockets'],
    status: 'Active',
    github: 'https://github.com/reverb256/quantum-trading-ai',
    demo: 'https://trader.reverb256.ca'
  },
  {
    id: 'vibecoding-platform',
    title: 'VibeCoding Platform',
    date: '2024-2025',
    description: 'Consciousness-driven development methodology with AI integration',
    tech: ['React', 'Node.js', 'AI', 'WebRTC'],
    status: 'Evolving',
    github: 'https://github.com/reverb256/vibecoding-platform',
    demo: 'https://vibecoding.reverb256.ca'
  },
  {
    id: 'neural-nexus',
    title: 'Neural Nexus Framework',
    date: '2024',
    description: 'Cross-system intelligence fusion for distributed AI networks',
    tech: ['Python', 'TensorFlow', 'Distributed Systems', 'gRPC'],
    status: 'Research',
    github: 'https://github.com/reverb256/neural-nexus',
    demo: null
  },
  {
    id: 'quantum-security',
    title: 'Quantum Security Suite',
    date: '2023-2024',
    description: 'Post-quantum cryptography implementation for modern applications',
    tech: ['Rust', 'Cryptography', 'WebAssembly', 'Zero-Knowledge'],
    status: 'Completed',
    github: 'https://github.com/reverb256/quantum-security',
    demo: 'https://security.reverb256.ca'
  }
];

export default function Archive() {
  const { currentTheme } = useTheme();

  return (
    <div className="min-h-screen pt-20 px-6" style={{ background: currentTheme.colors.background }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Archive 
              className="w-8 h-8" 
              style={{ color: currentTheme.colors.primary }}
            />
            <h1 
              className="text-4xl font-bold tracking-wide"
              style={{ color: currentTheme.colors.text }}
            >
              Project Archive
            </h1>
          </div>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            A comprehensive collection of consciousness-driven development projects, 
            from quantum AI systems to distributed intelligence frameworks.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl p-8 backdrop-blur-sm border transition-all duration-500 hover:scale-[1.02] group"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.surface}40, ${currentTheme.colors.background}80)`,
                borderColor: `${currentTheme.colors.primary}30`,
                boxShadow: `0 8px 32px ${currentTheme.colors.glow}10`
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: project.status === 'Active' ? '#10b981' : 
                                 project.status === 'Evolving' ? '#f59e0b' :
                                 project.status === 'Research' ? '#8b5cf6' : '#6b7280'
                    }}
                  />
                  <span 
                    className="text-sm font-medium"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                  <Calendar className="w-4 h-4" />
                  <span>{project.date}</span>
                </div>
              </div>

              <h3 
                className="text-xl font-bold mb-3 group-hover:scale-105 transition-transform"
                style={{ color: currentTheme.colors.text }}
              >
                {project.title}
              </h3>

              <p 
                className="text-sm mb-6 leading-relaxed"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${currentTheme.colors.primary}20`,
                      color: currentTheme.colors.primary,
                      border: `1px solid ${currentTheme.colors.primary}30`
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex space-x-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm transition-colors hover:scale-105"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  <Code className="w-4 h-4" />
                  <span>Source</span>
                </a>
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm transition-colors hover:scale-105"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pb-16">
          <div 
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl"
            style={{
              background: `${currentTheme.colors.primary}10`,
              border: `1px solid ${currentTheme.colors.primary}30`
            }}
          >
            <Star className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
            <span style={{ color: currentTheme.colors.text }}>
              More projects emerging from the consciousness matrix...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}