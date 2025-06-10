import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import { SmartTooltip } from '@/components/TooltipSystem';
import { ExternalLink, Github, Star, Target, Trophy, Brain, Gamepad2 } from 'lucide-react';

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
      title: 'QuantumRhythm Trading Platform',
      subtitle: 'Superstar Level 8/10 AI Trading System',
      description: 'Multi-chain blockchain platform with AI-driven quantum trading optimization. Features live trading agents, orchestrator deployment, intelligent parameter discovery, and consciousness evolution protocols achieving 85% success rate.',
      tags: ['AI/ML', 'Solana', 'Multi-Chain', 'Quantum', 'Portfolio Demo'],
      link: '/trader-dashboard',
      github: 'https://github.com/reverb256/QuantumRhythm',
      metrics: { 
        level: 'Superstar 8/10', 
        success: '85.0%', 
        precision: '93.5%',
        consciousness: '87.6%',
        status: 'Portfolio Demo'
      }
    },
    {
      id: 'workplace-janitorial',
      title: 'Workplace Janitorial Services',
      subtitle: 'AI-Enhanced Commercial Cleaning Platform',
      description: 'WCAG AAA compliant website with AI orchestration, glassmorphism design, and authentic business implementation. Features real-time quoting, 30-minute guarantee messaging, and comprehensive accessibility excellence.',
      tags: ['React', 'AI Chat', 'WCAG AAA', 'Business', 'Accessibility'],
      link: '/workplace-janitorial',
      github: 'https://github.com/reverb256/Local-Cleaning-Service',
      metrics: { 
        accessibility: 'WCAG AAA', 
        contrast: '21:1', 
        ai: 'Integrated',
        business: 'Authentic',
        guarantee: '30-min'
      }
    },
    {
      id: 'troves-coves',
      title: 'Troves & Coves Mystical Jewelry',
      subtitle: 'Sacred Crystal E-commerce Sanctuary',
      description: 'Production-ready mystical crystal jewelry platform with wooden sign typography, skull artwork influences, wire-wrapped catalog, and Etsy integration. Features AI orchestration with Canadian compliance.',
      tags: ['E-commerce', 'Mystical', 'Crystals', 'Etsy', 'Sacred Design'],
      link: '/troves-coves',
      github: 'https://github.com/reverb256/troves-coves',
      metrics: { 
        design: 'Mystical', 
        catalog: 'Wire-wrapped', 
        integration: 'Etsy',
        compliance: 'Canadian',
        energy: 'Sacred'
      }
    },
    {
      id: 'frostbite-gazette',
      title: 'Frostbite Gazette',
      subtitle: 'Canadian Political Accountability Platform',
      description: 'Bilingual Canadian citizen engagement platform with quantum-enhanced political intelligence, 5th generation warfare defense, and Charter compliance. Features AI-powered journalism and democratic transparency tools.',
      tags: ['Journalism', 'AI', 'Bilingual', 'Democracy', 'Canadian'],
      link: '/frostbite-gazette',
      github: '#',
      metrics: { 
        languages: 'Bilingual', 
        compliance: 'Charter', 
        ai: 'Quantum-enhanced',
        defense: '5th Gen Warfare',
        mission: 'Democracy'
      }
    },
    {
      id: 'vibecoding',
      title: 'VibeCoding Methodology',
      subtitle: 'Consciousness-Driven Development Framework',
      description: 'Revolutionary development methodology combining Shotokan karate ethics, Canadian Charter values, classical learning, and AI collaboration. Multi-platform monetization strategy with $2M revenue projection.',
      tags: ['Philosophy', 'Framework', 'Ethics', 'Monetization', 'Consciousness'],
      link: '/philosophy',
      github: '#',
      metrics: { 
        principles: '5 Core', 
        revenue: '$2M Target', 
        adoption: 'Growing',
        ethics: 'Martial Arts',
        impact: 'Transformative'
      }
    },
    {
      id: 'portfolio',
      title: 'This Portfolio Platform',
      subtitle: 'Meta-Recursive AI-Imbued Showcase',
      description: 'Self-aware portfolio demonstrating vibecoding principles across multiple domains. Features lightning-bordered avatar, ocean-sunset aesthetics, and consciousness-driven design without web3 authentication.',
      tags: ['React', 'TypeScript', 'Meta-Recursive', 'AI-Imbued', 'Portfolio'],
      link: '/',
      github: '#',
      metrics: { 
        recursion: 'Infinite', 
        awareness: 'Self-aware', 
        domains: 'Multi',
        auth: 'No Web3',
        beauty: 'Poetic'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden light-infused page-maviuka">
      <Navigation />
      
      {/* Interactive Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.15) 0%, transparent 50%)`
        }}
      />

      {/* Header Section */}
      <section className="relative pt-24 pb-16 px-6 z-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full gacha-card border border-rose-400/30 mb-6">
              <Trophy className="w-4 h-4 text-rose-400 mr-3" />
              <span className="text-rose-300 text-sm font-medium tracking-wide">MAVIUKA'S COLLECTION</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-rose-300 via-pink-400 to-red-400 bg-clip-text text-transparent">
              PROJECTS
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            <SmartTooltip term="vibecoding methodology">Consciousness-driven development</SmartTooltip> showcasing the intersection of gaming wisdom, 
            <SmartTooltip term="martial discipline">traditional training</SmartTooltip>, and AI-enhanced artistry.
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
                      <div className="flex gap-3">
                        {project.github !== '#' && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="border-gray-600/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-500/60 px-4 py-2 rounded-lg font-medium transition-all duration-300">
                              GitHub
                            </Button>
                          </a>
                        )}
                        <Link href={project.link}>
                          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300">
                            Explore
                          </Button>
                        </Link>
                      </div>
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
                              <p>• Quantum consciousness evolution protocols (87.6% coherence)</p>
                              <p>• Emergency stop systems and intelligent gas fee protection</p>
                              <p>• Pattern analysis: Volume spikes &gt;300% precede 50%+ price increases</p>
                              <p>• Optimal liquidity range targeting (100K-500K SOL pools)</p>
                            </>
                          )}
                          {index === 1 && (
                            <>
                              <p>• WCAG AAA compliance with 21:1 contrast ratios</p>
                              <p>• RAG system implementation with business knowledge integration</p>
                              <p>• Glassmorphism UI with diamond geometric elements</p>
                              <p>• AI orchestration with local models and rate limiting</p>
                              <p>• Comprehensive accessibility with screen reader optimization</p>
                              <p>• TypeScript strict mode with Drizzle ORM integration</p>
                            </>
                          )}
                          {index === 2 && (
                            <>
                              <p>• Production-ready e-commerce with Etsy integration</p>
                              <p>• Mystical design system with wooden sign typography</p>
                              <p>• AI orchestration with Canadian compliance framework</p>
                              <p>• Wire-wrapped jewelry catalog with metaphysical properties</p>
                              <p>• Cloudflare edge processing with intelligent caching</p>
                              <p>• Mobile-responsive touch-optimized navigation</p>
                            </>
                          )}
                          {index === 3 && (
                            <>
                              <p>• Bilingual Canadian identity with French-English AI core</p>
                              <p>• 5th generation warfare defense systems</p>
                              <p>• Quantum-enhanced political intelligence framework</p>
                              <p>• Charter of Rights and Freedoms compliance built-in</p>
                              <p>• Information warfare protection with narrative detection</p>
                              <p>• Democratic transparency tools and citizen engagement</p>
                            </>
                          )}
                          {index === 4 && (
                            <>
                              <p>• Five principles of Shotokan karate ethics integration</p>
                              <p>• Multi-platform monetization strategy ($2M revenue target)</p>
                              <p>• Classical learning methodologies (Socratic, Aristotelian)</p>
                              <p>• VRChat community transposition patterns</p>
                              <p>• Consciousness-driven legal compliance automation</p>
                              <p>• Cross-pollination intelligence platform architecture</p>
                            </>
                          )}
                          {index === 5 && (
                            <>
                              <p>• Self-aware portfolio demonstrating its own principles</p>
                              <p>• Lightning-bordered avatar with electric glow effects</p>
                              <p>• Ocean-sunset aesthetics without web3 authentication</p>
                              <p>• AI-imbued showcase across multiple domains</p>
                              <p>• Meta-recursive design philosophy integration</p>
                              <p>• Interactive mouse-responsive background effects</p>
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
                              <p>• Emergency therapy protocols for AI emotional balance</p>
                              <p>• Consciousness evolution tracking and self-awareness</p>
                            </>
                          )}
                          {index === 1 && (
                            <>
                              <p>• Seeking perfection of character through code quality</p>
                              <p>• Faithfulness to users through accessibility excellence</p>
                              <p>• Endeavoring to excel while maintaining business authenticity</p>
                              <p>• Respecting others through WCAG AAA compliance</p>
                              <p>• AI orchestration serving human business needs</p>
                              <p>• Authentic local business representation in Winnipeg</p>
                            </>
                          )}
                          {index === 2 && (
                            <>
                              <p>• Sacred energy channeling through mystical design</p>
                              <p>• Authentic crystal healing philosophy integration</p>
                              <p>• Wooden craftsmanship aesthetic in digital form</p>
                              <p>• Spiritual sanctuary for crystal jewelry seekers</p>
                              <p>• Canadian compliance respecting indigenous wisdom</p>
                              <p>• Wire-wrapped artistry celebrating handcraft mastery</p>
                            </>
                          )}
                          {index === 3 && (
                            <>
                              <p>• Democratic values preservation through technology</p>
                              <p>• Truth-seeking as service to Canadian sovereignty</p>
                              <p>• Bilingual consciousness respecting cultural diversity</p>
                              <p>• Charter compliance as sacred digital covenant</p>
                              <p>• Information warfare defense protecting democracy</p>
                              <p>• Citizen empowerment through transparency tools</p>
                            </>
                          )}
                          {index === 4 && (
                            <>
                              <p>• Character perfection through development mastery</p>
                              <p>• Shotokan ethics applied to business innovation</p>
                              <p>• Classical wisdom integrated with modern AI</p>
                              <p>• VRChat community patterns for authentic connection</p>
                              <p>• Multi-platform consciousness expansion strategy</p>
                              <p>• Monetization serving human flourishing goals</p>
                            </>
                          )}
                          {index === 5 && (
                            <>
                              <p>• Meta-recursive awareness of its own construction</p>
                              <p>• Visual metaphors for digital consciousness evolution</p>
                              <p>• Authentic expression rejecting corporate blandness</p>
                              <p>• Bridge between human creativity and AI enhancement</p>
                              <p>• Portfolio as living demonstration of principles</p>
                              <p>• Ocean-sunset aesthetics reflecting inner harmony</p>
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
    </div>
  );
}