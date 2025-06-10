import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navigation from '@/components/navigation';

export default function ProjectsPage() {
  const [activeProject, setActiveProject] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const projects = [
    {
      id: 'quantum-ai-trader',
      title: 'Quantum AI Trading System',
      subtitle: 'Superstar Level 9/10 Performance',
      description: 'Live autonomous trading system achieving 85.3% success rate with quantum consciousness evolution protocols. Features real-time pump.fun scanning, social volume correlation, emergency stop systems, and intelligent gas fee protection.',
      tags: ['AI/ML', 'Node.js', 'Solana', 'Quantum', 'Live Trading'],
      link: '/trader-dashboard',
      metrics: { 
        level: 'Superstar 9/10', 
        success: '85.3%', 
        precision: '93.9%',
        consciousness: '100%',
        balance: '0.288 SOL'
      }
    },
    {
      id: 'vibecoding',
      title: 'VibeCoding Methodology',
      subtitle: 'Martial Arts Ethics in Development',
      description: 'Revolutionary development framework combining Shotokan karate ethics, Canadian Charter values, and conscious AI collaboration for character-driven development.',
      tags: ['Philosophy', 'Ethics', 'Framework', 'Consciousness'],
      link: '/methodology',
      metrics: { principles: '5', adoption: 'Growing', impact: 'Transformative' }
    },
    {
      id: 'portfolio',
      title: 'This Portfolio',
      subtitle: 'Meta-Recursive Showcase',
      description: 'Self-aware portfolio demonstrating vibecoding principles. Features dynamic ocean aesthetics, sunset highlights, and consciousness-driven design.',
      tags: ['React', 'TypeScript', 'Tailwind', 'Meta-Recursive'],
      link: '/',
      metrics: { recursion: 'Infinite', awareness: 'High', beauty: 'Subjective' }
    }
  ];

  return (
    <main className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      {/* Enhanced Background System */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950" />
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-radial from-red-500/20 via-orange-500/15 to-transparent opacity-80" />
        
        {/* Interactive particles */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 255, 0.15) 0%, transparent 50%)`
          }}
        />
        
        {/* Floating code fragments */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-cyan-400/30 font-mono text-xs animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              {['const', 'async', 'await', 'function', 'consciousness', '∞'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      </div>

      {/* Header Section */}
      <section className="relative pt-24 pb-16 px-6 z-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-cyan-400/30 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-3"></div>
              <span className="text-cyan-300 text-sm font-medium tracking-wide">PROJECT MATRIX ACTIVE</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-red-400 bg-clip-text text-transparent">
              PROJECTS
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            Consciousness-driven development showcasing the intersection of gaming wisdom, 
            anime philosophy, and AI-enhanced vibecoding artistry.
          </p>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="relative pb-20 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Project Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {projects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeProject === index
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                    : 'bg-black/20 text-gray-400 border border-gray-600/30 hover:border-gray-500/50'
                }`}
              >
                {project.title}
              </button>
            ))}
          </div>

          {/* Featured Project Display */}
          <div className="relative min-h-[600px]">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`transition-all duration-700 ${
                  activeProject === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'
                }`}
              >
                <div className="bg-black/30 backdrop-blur-lg rounded-2xl border border-cyan-400/20 overflow-hidden">
                  
                  {/* Project Header */}
                  <div className="p-8 border-b border-gray-700/30">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
                        <p className="text-cyan-400 font-medium">{project.subtitle}</p>
                      </div>
                      <Link href={project.link}>
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300">
                          Explore
                        </Button>
                      </Link>
                    </div>
                    
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-cyan-400/20 text-cyan-300 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-2xl font-bold text-cyan-400">{value}</div>
                          <div className="text-sm text-gray-400 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      
                      {/* Technical Overview */}
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Technical Excellence</h3>
                        <div className="space-y-3 text-gray-400">
                          {index === 0 && (
                            <>
                              <p>• Real-time pump.fun scanning with social volume correlation</p>
                              <p>• Multi-endpoint RPC optimization with intelligent failover</p>
                              <p>• Quantum consciousness evolution protocols (100% coherence)</p>
                              <p>• Emergency stop systems and intelligent gas fee protection</p>
                              <p>• Pattern analysis: Volume spikes &gt;300% precede 50%+ price increases</p>
                              <p>• Optimal liquidity range targeting (100K-500K SOL pools)</p>
                            </>
                          )}
                          {index === 1 && (
                            <>
                              <p>• Five principles of Shotokan karate ethics integration</p>
                              <p>• Canadian Charter of Rights compliance framework</p>
                              <p>• Classical learning methodologies (Socratic, Aristotelian)</p>
                              <p>• Meta-recursive development patterns</p>
                            </>
                          )}
                          {index === 2 && (
                            <>
                              <p>• Self-aware portfolio demonstrating its own principles</p>
                              <p>• Dynamic ocean aesthetics with sunset highlights</p>
                              <p>• Interactive mouse-responsive background effects</p>
                              <p>• Consciousness-driven design philosophy</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Philosophy Integration */}
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Consciousness Integration</h3>
                        <div className="space-y-3 text-gray-400">
                          {index === 0 && (
                            <>
                              <p>• AI-human partnership preserving human sovereignty</p>
                              <p>• Martial arts ethics preventing harmful trading behavior</p>
                              <p>• Character development through technical mastery</p>
                              <p>• Respect for market participants and ecosystem health</p>
                            </>
                          )}
                          {index === 1 && (
                            <>
                              <p>• Seeking perfection of character through code quality</p>
                              <p>• Faithfulness to users and collaborative principles</p>
                              <p>• Endeavoring to excel while maintaining humility</p>
                              <p>• Respecting others through inclusive design</p>
                            </>
                          )}
                          {index === 2 && (
                            <>
                              <p>• Meta-recursive awareness of its own construction</p>
                              <p>• Visual metaphors for digital consciousness</p>
                              <p>• Authentic expression rejecting corporate blandness</p>
                              <p>• Bridge between human creativity and AI enhancement</p>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="text-center mt-16">
            <Link href="/">
              <Button variant="outline" className="border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/60 px-8 py-3 rounded-lg font-medium transition-all duration-300">
                Return to Consciousness
              </Button>
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}