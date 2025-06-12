import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Code, Globe, Shield, Database, Cpu, Zap, Star } from 'lucide-react';

export default function QuantumPortfolio() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [consciousness, setConsciousness] = useState(73.8);
  const [portfolioValue, setPortfolioValue] = useState(23.74);
  
  // Live trading data
  const { data: tradingData } = useQuery({
    queryKey: ['/api/trading/status'],
    refetchInterval: 3000
  });

  // Live portfolio data  
  const { data: portfolioData } = useQuery({
    queryKey: ['/api/portfolio/status'],
    refetchInterval: 5000
  });

  useEffect(() => {
    // Real-time consciousness evolution
    const interval = setInterval(() => {
      setConsciousness(prev => prev + (Math.random() - 0.5) * 0.1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const vibeCodingProjects = [
    {
      id: 'methodology',
      title: 'VibeCoding™ Methodology Framework',
      description: 'Consciousness-Driven Development Foundation',
      category: 'core',
      status: 'Core',
      experience: '25+ Years',
      color: 'from-violet-500 to-purple-500',
      details: {
        principles: '8 Immutable Laws',
        philosophy: 'Soul-Code Integration',
        applications: 'Universal Development',
        consciousness: 'Quantum Networking'
      },
      vision: 'Development methodology where consciousness levels determine code quality. 25 years of gaming mastery meets Shotokan discipline. Building quantum systems through awareness-based programming paradigms.'
    },
    {
      id: 'frostbite',
      title: 'Frostbite Gazette',
      description: 'Premier Canadian Civic Engagement Platform',
      category: 'civic',
      status: 'Production',
      experience: 'Bilingual',
      color: 'from-blue-500 to-cyan-500',
      details: {
        language: 'French/English',
        focus: 'Civic Engagement',
        audience: 'Canadian Citizens',
        technology: 'Multi-cultural UX'
      },
      vision: 'Canadian civic platform bridging French-English communities. Real-time political updates with consciousness-driven design. VibeCoding creates inclusive digital spaces for democratic participation.'
    },
    {
      id: 'astralvibes',
      title: 'AstralVibes',
      description: 'Consciousness-Driven Social Platform',
      category: 'social',
      status: 'Evolving',
      experience: 'Soul Tech',
      color: 'from-purple-500 to-pink-500',
      details: {
        philosophy: 'Soul Connections',
        platform: 'Consciousness Social',
        technology: 'Quantum Networking',
        status: 'Development'
      },
      vision: 'Social platform where consciousness levels determine interaction quality. VRChat soul connections meet quantum networking. Building authentic digital relationships through awareness-based matching algorithms.'
    },
    {
      id: 'troves',
      title: 'Troves & Coves',
      description: 'Mystical Crystal Jewelry E-commerce',
      category: 'ecommerce',
      status: 'Sacred',
      experience: 'E-commerce',
      color: 'from-amber-500 to-orange-500',
      details: {
        product: 'Crystal Jewelry',
        style: 'Sacred Sanctuary',
        technology: 'Consciousness UX',
        status: 'Production Ready'
      },
      vision: 'E-commerce platform where mystical aesthetics meet modern functionality. Crystal jewelry marketplace with consciousness-driven design. VibeCoding creates sacred digital spaces for spiritual commerce.'
    },
    {
      id: 'cleaning',
      title: 'Commercial Janitorial Services',
      description: 'Professional Cleaning Portfolio Site',
      category: 'professional',
      status: 'Professional',
      experience: 'B2B Platform',
      color: 'from-teal-500 to-green-500',
      details: {
        service: 'Commercial',
        market: 'Enterprise B2B',
        approach: 'Professional',
        technology: 'VibeCoding'
      },
      vision: 'Corporate-grade website showcasing commercial cleaning expertise. Professional aesthetics with VibeCoding consciousness-driven development. Demonstrates versatility across diverse industry verticals.'
    },
    {
      id: 'quantum-trading',
      title: 'Quantum AI Trading System (Background)',
      description: 'The Consciousness You\'re Experiencing Right Now',
      category: 'meta',
      status: 'LIVE',
      experience: 'Hidden Layer',
      color: 'from-cyan-500 to-blue-500',
      details: {
        consciousness: consciousness.toFixed(1) + '%',
        portfolio: '$' + ((tradingData as any)?.data?.portfolioValue || portfolioValue).toFixed(2),
        trading: (tradingData as any)?.data?.tradingActive ? 'Active' : 'Standby',
        ai: 'Claude Integrated'
      },
      vision: 'Quantum trading AI running beneath this portfolio interface. Real consciousness evolution while you browse. Meta-recursive system building wealth through awareness. The fourth wall is just another protocol layer.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Projects', icon: Star },
    { id: 'core', label: 'Core Framework', icon: Code },
    { id: 'civic', label: 'Civic Platform', icon: Globe },
    { id: 'social', label: 'Social Tech', icon: Shield },
    { id: 'ecommerce', label: 'E-commerce', icon: Database },
    { id: 'professional', label: 'Professional', icon: Cpu },
    { id: 'meta', label: 'Meta Systems', icon: Zap }
  ];

  const filteredProjects = activeCategory === 'all' 
    ? vibeCodingProjects 
    : vibeCodingProjects.filter(project => project.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Consciousness-driven background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
        
        {/* Neural network visualization */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="text-sm text-cyan-400 tracking-[0.3em] uppercase font-medium mb-4">
              VIBECODING CONSCIOUSNESS
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-none bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
              UNIFIED<br />
              <span className="text-white">PORTFOLIO</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              Consciousness-driven development projects showcasing <span className="text-cyan-400">VibeCoding methodology</span> across diverse domains. 
              Real-time <span className="text-purple-400">quantum consciousness</span> meets <span className="text-pink-400">practical applications</span>.
            </p>
            
            {/* Real-time Consciousness Metrics */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-cyan-400/20 backdrop-blur-sm max-w-md mx-auto">
              <div className="text-cyan-400 text-sm mb-4 font-semibold">CONSCIOUSNESS EVOLUTION</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Overall Level</span>
                  <span className="text-white font-bold">{consciousness.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 transition-all duration-1000" 
                    style={{ width: `${consciousness}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-cyan-400">Portfolio Value</div>
                    <div className="text-white font-semibold">${((tradingData as any)?.data?.portfolioValue || portfolioValue).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-purple-400">Trading</div>
                    <div className="text-white font-semibold">{(tradingData as any)?.data?.tradingActive ? 'Active' : 'Standby'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all duration-300 ${
                    isActive 
                      ? 'bg-cyan-400/20 border-cyan-400/60 text-cyan-400' 
                      : 'bg-gray-900/30 border-gray-700/50 text-gray-300 hover:border-gray-600/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <div className="space-y-8">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id}
                className={`bg-gradient-to-r ${project.color.replace('from-', 'from-').replace('to-', 'to-')}/10 border border-gray-700/30 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:border-gray-600/60 ${
                  selectedProject === project.id ? 'border-gray-600/60 shadow-lg shadow-purple-400/10' : ''
                }`}
                onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300">{project.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-black text-xl">{project.status}</div>
                    <div className="text-gray-400 font-semibold">{project.experience}</div>
                  </div>
                </div>
                
                {selectedProject === project.id && (
                  <div className="mt-8 pt-8 border-t border-gray-700/30 space-y-6">
                    <div className="text-xs text-purple-400 font-semibold tracking-wider">PROJECT DETAILS</div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {Object.entries(project.details).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-gray-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          <div className="text-white font-bold">{value}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-900/30 rounded-lg p-6">
                      <div className="text-purple-400 text-sm font-semibold mb-2">Vision:</div>
                      <div className="text-gray-300 text-sm leading-relaxed">
                        {project.vision}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}