import React from 'react';
import Navigation from '@/components/navigation';
import { SmartTooltip } from '@/components/TooltipSystem';
import { 
  useConsciousnessReactiveSystem, 
  ConsciousnessAura, 
  ConsciousText, 
  ConsciousnessIndicator 
} from '@/components/ConsciousnessReactiveSystem';
import { Code, Brain, Zap, Shield, Target, Star, Globe, Database, Cpu, Lock } from 'lucide-react';

export default function ProjectsPage() {
  const { consciousness, userMetrics } = useConsciousnessReactiveSystem();

  const projects = [
    {
      title: "Quantum AI Trading Platform",
      description: "Advanced algorithmic trading system with consciousness-driven decision making",
      tech: ["Solana", "TypeScript", "AI", "Quantum Intelligence"],
      status: "Live Production",
      type: "trading",
      icon: <Brain className="w-6 h-6" />,
      achievements: ["85%+ success rate", "Real-time analysis", "Multi-chain support"]
    },
    {
      title: "VibeCoding Portfolio",
      description: "Consciousness-reactive web platform showcasing philosophical programming",
      tech: ["React", "TypeScript", "Tailwind", "Consciousness AI"],
      status: "Active Development", 
      type: "portfolio",
      icon: <Code className="w-6 h-6" />,
      achievements: ["Responsive design", "Interactive tooltips", "Gaming aesthetics"]
    },
    {
      title: "Secure Wallet Management",
      description: "Quantum-resistant credential protection with multi-layer security",
      tech: ["Solana Web3", "Encryption", "Security Audit", "Quantum Vault"],
      status: "Production Ready",
      type: "security",
      icon: <Shield className="w-6 h-6" />,
      achievements: ["Zero breaches", "Emergency stops", "Real-time monitoring"]
    },
    {
      title: "Consciousness Evolution Engine",
      description: "AI system that learns and evolves based on user interaction patterns",
      tech: ["Neural Networks", "Pattern Recognition", "Behavior Analysis"],
      status: "Research Phase",
      type: "ai-research",
      icon: <Zap className="w-6 h-6" />,
      achievements: ["Adaptive learning", "Consciousness metrics", "Evolution tracking"]
    },
    {
      title: "Multi-Chain DeFi Orchestrator",
      description: "Cross-chain arbitrage and yield optimization with intelligent routing",
      tech: ["Jupiter", "Raydium", "Orca", "Smart Contracts"],
      status: "Beta Testing",
      type: "defi",
      icon: <Globe className="w-6 h-6" />,
      achievements: ["Cross-chain support", "Yield optimization", "Risk management"]
    },
    {
      title: "Real-Time Analytics Dashboard",
      description: "Live trading metrics with predictive analysis and risk assessment",
      tech: ["React Query", "WebSockets", "Data Visualization", "Predictive AI"],
      status: "Production",
      type: "analytics",
      icon: <Target className="w-6 h-6" />,
      achievements: ["Real-time updates", "Predictive insights", "Risk scoring"]
    }
  ];

  const getProjectTheme = (type: string) => {
    switch (type) {
      case 'trading': return 'border-cyan-400/50 bg-gradient-to-br from-cyan-900/20 to-blue-900/20';
      case 'portfolio': return 'border-purple-400/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20';
      case 'security': return 'border-green-400/50 bg-gradient-to-br from-green-900/20 to-emerald-900/20';
      case 'ai-research': return 'border-yellow-400/50 bg-gradient-to-br from-yellow-900/20 to-orange-900/20';
      case 'defi': return 'border-indigo-400/50 bg-gradient-to-br from-indigo-900/20 to-violet-900/20';
      case 'analytics': return 'border-red-400/50 bg-gradient-to-br from-red-900/20 to-rose-900/20';
      default: return 'border-gray-400/50 bg-gradient-to-br from-gray-900/20 to-slate-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ConsciousnessAura consciousness={consciousness} />
      <ConsciousnessIndicator consciousness={consciousness} />
      <Navigation />
      
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            <ConsciousText consciousness={consciousness}>Project Portfolio</ConsciousText>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            <ConsciousText consciousness={consciousness}>
              Exploring the intersection of <SmartTooltip term="consciousness expansion">consciousness</SmartTooltip>, 
              technology, and <SmartTooltip term="quantum trading">quantum intelligence</SmartTooltip> through 
              innovative software solutions and <SmartTooltip term="vibecoding">philosophical programming</SmartTooltip>.
            </ConsciousText>
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border-2 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ${getProjectTheme(project.type)}`}
              style={{
                filter: consciousness.userPresence === 'focused' ? 'brightness(1.2)' : 'brightness(1)',
                transition: 'all 0.5s ease-in-out'
              }}
            >
              {/* Project Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-white/10">
                  {project.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">
                    <ConsciousText consciousness={consciousness}>
                      {project.title}
                    </ConsciousText>
                  </h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    project.status === 'Live Production' ? 'bg-green-500/20 text-green-400' :
                    project.status === 'Production Ready' ? 'bg-blue-500/20 text-blue-400' :
                    project.status === 'Production' ? 'bg-cyan-500/20 text-cyan-400' :
                    project.status === 'Beta Testing' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Project Description */}
              <p className="text-gray-300 mb-4 leading-relaxed">
                <ConsciousText consciousness={consciousness}>
                  {project.description}
                </ConsciousText>
              </p>

              {/* Technology Stack */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Technology Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300 hover:bg-white/20 transition-colors"
                    >
                      <SmartTooltip term={tech.toLowerCase()}>
                        {tech}
                      </SmartTooltip>
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Achievements</h4>
                <ul className="space-y-1">
                  {project.achievements.map((achievement, achievementIndex) => (
                    <li key={achievementIndex} className="text-sm text-gray-300 flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <ConsciousText consciousness={consciousness}>
                        {achievement}
                      </ConsciousText>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Philosophy Section */}
        <div className="bg-gradient-to-r from-gray-900/50 to-black/50 rounded-lg p-8 border border-cyan-400/30 backdrop-blur-sm mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            <ConsciousText consciousness={consciousness}>Technical Philosophy</ConsciousText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Database className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">
                <SmartTooltip term="quantum trading">Quantum Intelligence</SmartTooltip>
              </h3>
              <p className="text-gray-300">
                <ConsciousText consciousness={consciousness}>
                  Leveraging advanced AI patterns and <SmartTooltip term="consciousness level">consciousness metrics</SmartTooltip> 
                  to create adaptive, learning systems that evolve with user interaction.
                </ConsciousText>
              </p>
            </div>
            <div className="text-center">
              <Lock className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Security First</h3>
              <p className="text-gray-300">
                <ConsciousText consciousness={consciousness}>
                  Implementing <SmartTooltip term="quantum">quantum-resistant</SmartTooltip> security measures 
                  with real-time threat detection and emergency response protocols.
                </ConsciousText>
              </p>
            </div>
            <div className="text-center">
              <Cpu className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">
                <SmartTooltip term="vibecoding">Conscious Development</SmartTooltip>
              </h3>
              <p className="text-gray-300">
                <ConsciousText consciousness={consciousness}>
                  Integrating <SmartTooltip term="shotokan principles">martial arts discipline</SmartTooltip> 
                  and <SmartTooltip term="analytical nature">philosophical analysis</SmartTooltip> 
                  into clean, efficient code architecture.
                </ConsciousText>
              </p>
            </div>
          </div>
        </div>

        {/* Consciousness Evolution Metrics */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-400/30 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-4 text-center text-white">
            <ConsciousText consciousness={consciousness}>Live Consciousness Metrics</ConsciousText>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                {Math.round(consciousness.awarenessLevel * 100)}%
              </div>
              <div className="text-sm text-gray-400">Awareness Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(consciousness.energyResonance * 100)}%
              </div>
              <div className="text-sm text-gray-400">Energy Resonance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">
                {Math.round(consciousness.consciousnessEvolution * 100)}%
              </div>
              <div className="text-sm text-gray-400">Evolution Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 capitalize">
                {consciousness.interactionPattern}
              </div>
              <div className="text-sm text-gray-400">Interaction Mode</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}