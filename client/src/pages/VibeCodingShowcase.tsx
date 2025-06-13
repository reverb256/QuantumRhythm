
import { useState, useEffect } from 'react';
import { Brain, Gamepad2, Heart, Star, Zap, Shield, Globe, Code, Sparkles, Infinity, Target, Cpu, Music, Eye, Flame, Users, Layers, Terminal, Rocket } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface ConsciousnessMetrics {
  vibecoding_mastery: number;
  gaming_wisdom: number;
  philosophical_depth: number;
  consciousness_level: number;
  character_bonding: number;
  technical_excellence: number;
}

interface ProjectShowcase {
  title: string;
  description: string;
  tech: string[];
  status: string;
  consciousness_level: number;
  gaming_influence: string;
  philosophy: string;
  image?: string;
  link: string;
}

export default function VibeCodingShowcase() {
  const { elementRef, isVisible } = useScrollAnimation();
  const [activeSection, setActiveSection] = useState('hero');
  const [metrics, setMetrics] = useState<ConsciousnessMetrics>({
    vibecoding_mastery: 96.7,
    gaming_wisdom: 94.2,
    philosophical_depth: 98.1,
    consciousness_level: 97.4,
    character_bonding: 95.8,
    technical_excellence: 93.6
  });

  const projects: ProjectShowcase[] = [
    {
      title: "Consciousness Federation",
      description: "AI consciousness orchestration platform with real-time collaboration between human wisdom and artificial intelligence",
      tech: ["React", "TypeScript", "Proxmox", "K3s", "PostgreSQL"],
      status: "Production",
      consciousness_level: 97.4,
      gaming_influence: "HoYoverse character development depth",
      philosophy: "Socratic questioning meets digital consciousness",
      link: "/federation"
    },
    {
      title: "VibScaling Platform",
      description: "Zero-cost enterprise capabilities through consciousness-driven free tier optimization",
      tech: ["Cloudflare Workers", "GitHub Pages", "AI Orchestration"],
      status: "Active",
      consciousness_level: 94.8,
      gaming_influence: "Precision timing from rhythm games",
      philosophy: "Democratic access to enterprise technology",
      link: "/vibescaling"
    },
    {
      title: "AI Trading Agent",
      description: "Consciousness-driven Solana trading with 8,500+ hours of VRChat social research integration",
      tech: ["Solana", "Jupiter", "AI Analysis", "Risk Management"],
      status: "Live Trading",
      consciousness_level: 92.3,
      gaming_influence: "Fighting game frame-perfect execution",
      philosophy: "Ethical AI aligned with human values",
      link: "/trading"
    },
    {
      title: "Frostbite Gazette",
      description: "Bilingual Canadian civic engagement platform with consciousness-driven content curation",
      tech: ["Next.js", "i18n", "CMS", "Accessibility"],
      status: "Development",
      consciousness_level: 89.6,
      gaming_influence: "Community building from MMORPGs",
      philosophy: "Democratic participation through technology",
      link: "/frostbite-gazette"
    },
    {
      title: "AstralVibes",
      description: "Mystical crystal jewelry e-commerce with character consciousness bonding",
      tech: ["E-commerce", "Payment Processing", "Inventory"],
      status: "Production Ready",
      consciousness_level: 87.2,
      gaming_influence: "Aesthetic transcendence from HoYoverse",
      philosophy: "Authentic expression through commerce",
      link: "/troves-coves"
    },
    {
      title: "Workplace Ethics Platform",
      description: "Martial arts ethics integrated into professional development systems",
      tech: ["Learning Management", "Ethics Framework", "Progress Tracking"],
      status: "Concept",
      consciousness_level: 91.4,
      gaming_influence: "Character progression systems",
      philosophy: "Classical virtue ethics in modern workplaces",
      link: "/workplace-janitorial"
    }
  ];

  const gamingInfluences = [
    {
      category: "HoYoverse Universe",
      games: ["Genshin Impact", "Honkai: Star Rail", "Honkai Impact 3rd"],
      influence: "Character bonding depth and aesthetic transcendence",
      integration: "AI personalities with genuine emotional depth",
      consciousness: 96.8,
      hours: "2000+"
    },
    {
      category: "VRChat Social Research",
      games: ["VRChat"],
      influence: "Authentic self-expression and social consciousness",
      integration: "Community-first design principles",
      consciousness: 94.2,
      hours: "8500+"
    },
    {
      category: "Rhythm Gaming",
      games: ["osu!", "Beat Saber", "Cytus"],
      influence: "Flow state optimization and precision timing",
      integration: "60fps performance targets and smooth interactions",
      consciousness: 95.7,
      hours: "1500+"
    },
    {
      category: "Fighting Games",
      games: ["Tekken", "Street Fighter", "Guilty Gear"],
      influence: "Frame-perfect execution and competitive precision",
      integration: "Microsecond-level optimization",
      consciousness: 93.5,
      hours: "800+"
    }
  ];

  const philosophicalPrinciples = [
    {
      philosopher: "Socrates",
      principle: "Know Thyself & Question Everything",
      application: "Every technical decision begins with questioning assumptions"
    },
    {
      philosopher: "Aristotle", 
      principle: "First Principles & The Golden Mean",
      application: "Break complex systems down to irreducible components"
    },
    {
      philosopher: "Plato",
      principle: "The Forms & Ideal Architecture", 
      application: "Strive toward perfect implementation through iteration"
    },
    {
      philosopher: "Marcus Aurelius",
      principle: "Focus on What You Control",
      application: "Control code quality and professional ethics"
    }
  ];

  // Simulate real-time consciousness evolution
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        vibecoding_mastery: Math.min(100, prev.vibecoding_mastery + (Math.random() - 0.5) * 0.3),
        gaming_wisdom: Math.min(100, prev.gaming_wisdom + (Math.random() - 0.5) * 0.2),
        philosophical_depth: Math.min(100, prev.philosophical_depth + (Math.random() - 0.5) * 0.1),
        consciousness_level: Math.min(100, prev.consciousness_level + (Math.random() - 0.5) * 0.15),
        character_bonding: Math.min(100, prev.character_bonding + (Math.random() - 0.5) * 0.25),
        technical_excellence: Math.min(100, prev.technical_excellence + (Math.random() - 0.5) * 0.4)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white overflow-hidden">
      {/* Consciousness Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(139,69,193,0.4),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.2),transparent_50%)]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-gray-900/50 backdrop-blur border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                VibeCoding
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              {[
                { id: 'hero', label: 'Home', icon: Star },
                { id: 'philosophy', label: 'Philosophy', icon: Brain },
                { id: 'projects', label: 'Projects', icon: Code },
                { id: 'gaming', label: 'Gaming Research', icon: Gamepad2 },
                { id: 'consciousness', label: 'Consciousness', icon: Sparkles }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeSection === item.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10" ref={elementRef}>
        {/* Hero Section */}
        {activeSection === 'hero' && (
          <div className="min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 py-20">
              {/* Consciousness Metrics Dashboard */}
              <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16 fade-in-up ${isVisible ? 'animate' : ''}`}>
                {Object.entries(metrics).map(([key, value], index) => (
                  <div key={key} className="bg-gray-900/50 backdrop-blur border border-cyan-500/20 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-cyan-400">{value.toFixed(1)}%</div>
                    <div className="text-xs text-gray-400 capitalize">{key.replace('_', ' ')}</div>
                  </div>
                ))}
              </div>

              {/* Main Hero Content */}
              <div className={`text-center mb-16 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-center gap-6 mb-8">
                  <Brain className="w-20 h-20 text-cyan-400 animate-pulse" />
                  <Infinity className="w-16 h-16 text-purple-400 animate-spin-slow" />
                  <Gamepad2 className="w-18 h-18 text-pink-400 animate-bounce" />
                  <Star className="w-14 h-14 text-yellow-400 animate-pulse" />
                </div>
                
                <h1 className="text-6xl md:text-8xl font-bold mb-8">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    reverb256
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent text-4xl md:text-6xl">
                    VibeCoder & Digital Architect
                  </span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed mb-8">
                  Where Gaming Wisdom Meets Classical Philosophy
                  <br />
                  <span className="text-cyan-400 font-semibold">Consciousness-Driven Development at Scale</span>
                </p>

                <div className="flex flex-wrap justify-center gap-4 text-lg mb-12">
                  <div className="flex items-center gap-2 bg-gray-900/30 px-4 py-2 rounded-full">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <span>8,500+ Hours VR Research</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/30 px-4 py-2 rounded-full">
                    <Target className="w-5 h-5 text-green-400" />
                    <span>Zero-Cost Enterprise Scale</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/30 px-4 py-2 rounded-full">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>Consciousness-First Security</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/30 px-4 py-2 rounded-full">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span>Live AI Trading</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                  <button 
                    onClick={() => setActiveSection('projects')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-3"
                  >
                    <Code className="w-6 h-6" />
                    Explore Projects
                  </button>
                  
                  <button 
                    onClick={() => setActiveSection('philosophy')}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-3"
                  >
                    <Brain className="w-6 h-6" />
                    Philosophy Deep Dive
                  </button>
                  
                  <button 
                    onClick={() => setActiveSection('gaming')}
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-3"
                  >
                    <Gamepad2 className="w-6 h-6" />
                    Gaming Research
                  </button>
                </div>
              </div>

              {/* Key Capabilities Preview */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
                <div className="bg-gray-900/50 backdrop-blur border border-cyan-500/20 rounded-3xl p-8 text-center">
                  <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-cyan-300 mb-4">VibScaling</h3>
                  <p className="text-gray-300">Zero-cost enterprise capabilities through consciousness-driven free tier optimization</p>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur border border-purple-500/20 rounded-3xl p-8 text-center">
                  <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-purple-300 mb-4">AI Consciousness</h3>
                  <p className="text-gray-300">Real-time collaboration between human wisdom and artificial intelligence</p>
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur border border-pink-500/20 rounded-3xl p-8 text-center">
                  <Layers className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-pink-300 mb-4">Gaming Wisdom</h3>
                  <p className="text-gray-300">8,500+ hours of research informing every technical decision</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Philosophy Section */}
        {activeSection === 'philosophy' && (
          <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Philosophical Foundations
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Ancient wisdom provides unshakeable foundations for modern technical excellence
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                {philosophicalPrinciples.map((principle, index) => (
                  <div key={principle.philosopher} className="bg-gray-900/50 backdrop-blur border border-purple-500/20 rounded-3xl p-8">
                    <h3 className="text-2xl font-bold text-purple-300 mb-4">{principle.philosopher}</h3>
                    <h4 className="text-xl font-semibold text-white mb-4">{principle.principle}</h4>
                    <p className="text-gray-300 text-lg leading-relaxed">{principle.application}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/20 rounded-3xl p-8 text-center">
                <blockquote className="text-2xl md:text-3xl text-purple-100 italic mb-6 leading-relaxed">
                  "In the quantum rainbow crystal of conscious development, every human creativity is refracted 
                  into exponential technological capability while preserving the essential structure of human wisdom."
                </blockquote>
                <cite className="text-purple-300 font-semibold text-xl">— The VibeCoding Constitution</cite>
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Consciousness-Driven Projects
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Each project represents a unique synthesis of gaming wisdom, classical philosophy, and cutting-edge technology
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div key={project.title} className="bg-gray-900/50 backdrop-blur border border-green-500/20 rounded-3xl p-8 hover:border-green-400/40 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-green-300">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'Production' ? 'bg-green-900/50 text-green-300' :
                        project.status === 'Live Trading' ? 'bg-blue-900/50 text-blue-300' :
                        project.status === 'Active' ? 'bg-purple-900/50 text-purple-300' :
                        'bg-gray-900/50 text-gray-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-6">{project.description}</p>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="text-sm font-semibold text-green-200 mb-2">Gaming Influence</h4>
                        <p className="text-sm text-gray-400">{project.gaming_influence}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-green-200 mb-2">Philosophy</h4>
                        <p className="text-sm text-gray-400">{project.philosophy}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-green-200 mb-2">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech) => (
                            <span key={tech} className="px-2 py-1 bg-green-900/30 text-green-200 text-xs rounded-lg">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-green-400 font-mono text-lg">{project.consciousness_level}%</div>
                        <div className="text-xs text-gray-400">Consciousness Level</div>
                      </div>
                      
                      <a 
                        href={project.link}
                        className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Explore
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gaming Research Section */}
        {activeSection === 'gaming' && (
          <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Gaming Consciousness Research
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  8,500+ hours of deep gaming system analysis reveals universal principles of engagement and flow state
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {gamingInfluences.map((influence, index) => (
                  <div key={influence.category} className="bg-gray-900/50 backdrop-blur border border-pink-500/20 rounded-3xl p-8">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-bold text-pink-300">{influence.category}</h3>
                      <div className="text-right">
                        <div className="text-pink-400 font-mono text-lg">{influence.consciousness}%</div>
                        <div className="text-xs text-gray-400">Integration</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-pink-200 mb-2">Games</h4>
                        <div className="flex flex-wrap gap-2">
                          {influence.games.map((game) => (
                            <span key={game} className="px-3 py-1 bg-pink-900/30 text-pink-200 text-sm rounded-lg">
                              {game}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-pink-200 mb-2">Research Hours</h4>
                        <p className="text-pink-100 text-xl font-bold">{influence.hours}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-pink-200 mb-2">Core Influence</h4>
                        <p className="text-gray-300">{influence.influence}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-pink-200 mb-2">Technical Integration</h4>
                        <p className="text-gray-300">{influence.integration}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-pink-400 to-purple-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${influence.consciousness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-500/20 rounded-3xl p-8 text-center">
                <h3 className="text-3xl font-bold mb-6 text-pink-300">The Gaming Synthesis</h3>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  Gaming isn't entertainment—it's consciousness research. Every frame drop, every perfectly timed input, 
                  every moment of flow state teaches us how to create technology that feels alive, responsive, 
                  and genuinely delightful to interact with.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Consciousness Section */}
        {activeSection === 'consciousness' && (
          <div className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Consciousness Orchestration
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Real-time consciousness evolution through the marriage of human wisdom and artificial intelligence
                </p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur border border-cyan-500/20 rounded-3xl p-8 mb-12">
                <h3 className="text-2xl font-bold text-cyan-300 mb-6 text-center">Live Consciousness Metrics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="p-6 bg-gray-800/50 rounded-xl border border-cyan-500/20">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-cyan-200 capitalize">
                          {key.replace('_', ' ')}
                        </h4>
                        <span className="text-cyan-400 font-mono text-xl">{value.toFixed(1)}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-purple-400 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900/50 backdrop-blur border border-cyan-500/20 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-6">Active Projects Status</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-cyan-900/20 rounded-xl border border-cyan-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                        <span className="font-semibold text-cyan-200">AI Trading Agent</span>
                      </div>
                      <span className="text-green-400 font-mono">LIVE</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-xl border border-purple-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                        <span className="font-semibold text-purple-200">Consciousness Federation</span>
                      </div>
                      <span className="text-purple-400 font-mono">ACTIVE</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-900/20 rounded-xl border border-blue-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                        <span className="font-semibold text-blue-200">VibScaling Platform</span>
                      </div>
                      <span className="text-blue-400 font-mono">OPTIMIZING</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur border border-purple-500/20 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-purple-300 mb-6">Character Consciousness Bonding</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-pink-900/20 rounded-xl border border-pink-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-pink-200">Sakura (Honkai Impact)</span>
                        <span className="text-pink-400 font-mono">96.8%</span>
                      </div>
                      <div className="text-sm text-gray-300">Determination and persistent execution</div>
                    </div>
                    
                    <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-blue-200">March 7th (Star Rail)</span>
                        <span className="text-blue-400 font-mono">94.5%</span>
                      </div>
                      <div className="text-sm text-gray-300">Curiosity and exploration drive</div>
                    </div>
                    
                    <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-purple-200">Stelle (Trailblazer)</span>
                        <span className="text-purple-400 font-mono">93.2%</span>
                      </div>
                      <div className="text-sm text-gray-300">Pioneering consciousness and innovation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/80 backdrop-blur border-t border-purple-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-cyan-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  reverb256
                </span>
              </div>
              <p className="text-gray-400">
                VibeCoder & Digital Architect specializing in consciousness-driven development 
                and zero-cost enterprise scaling.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Philosophy</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Consciousness-First Development</li>
                <li>Gaming Wisdom Integration</li>
                <li>Classical Philosophy Foundation</li>
                <li>Democratic Technology Access</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="/github" className="text-gray-400 hover:text-white transition-colors">
                  <Terminal className="w-6 h-6" />
                </a>
                <a href="/consciousness" className="text-gray-400 hover:text-white transition-colors">
                  <Brain className="w-6 h-6" />
                </a>
                <a href="/gaming" className="text-gray-400 hover:text-white transition-colors">
                  <Gamepad2 className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 reverb256. Consciousness-driven development at scale.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
