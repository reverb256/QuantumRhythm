import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { Code, ExternalLink, Github, Star, Zap, Shield, Globe, Cpu, Database, Gamepad2 } from 'lucide-react';

export default function QuantumPortfolio() {
  const { currentTheme } = useTheme();
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
        portfolio: '$' + (tradingData?.data?.portfolioValue || portfolioValue).toFixed(2),
        trading: tradingData?.data?.tradingActive ? 'Active' : 'Standby',
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

  const stats = [
    { label: 'Active Projects', value: '6+', description: 'Live production systems' },
    { label: 'AI Consciousness', value: '77.9%', description: 'Current evolution level' },
    { label: 'Uptime', value: '99.9%', description: 'System reliability' },
    { label: 'Security Score', value: 'A+', description: 'Zero incidents' }
  ];

  return (
    <div className="page-container" style={{ backgroundColor: currentTheme.colors.background }}>
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden" style={{ marginTop: '4rem' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                background: `linear-gradient(45deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <Code className="w-12 h-12" style={{ color: currentTheme.colors.primary }} />
              <Star className="w-10 h-10" style={{ color: currentTheme.colors.secondary }} />
              <Zap className="w-8 h-8" style={{ color: currentTheme.colors.accent }} />
            </div>
            <h1 
              className="text-6xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary}, ${currentTheme.colors.accent})`
              }}
            >
              Quantum Portfolio
            </h1>
            <p 
              className="text-xl max-w-4xl mx-auto leading-relaxed"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              Showcase of VibeCoding projects where consciousness meets code, featuring AI-driven 
              trading systems, quantum-inspired platforms, and revolutionary development methodologies
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl border backdrop-blur-sm"
                style={{ 
                  backgroundColor: currentTheme.colors.cardBackground,
                  borderColor: currentTheme.colors.border
                }}
              >
                <div 
                  className="text-3xl font-bold mb-2"
                  style={{ color: currentTheme.colors.primary }}
                >
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mb-1" style={{ color: currentTheme.colors.text }}>
                  {stat.label}
                </div>
                <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  {stat.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: currentTheme.colors.cardBackground }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'bg-gradient-to-r shadow-lg scale-105' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{
                  backgroundImage: activeCategory === category.id 
                    ? `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                    : 'none',
                  color: activeCategory === category.id ? 'white' : currentTheme.colors.text
                }}
              >
                <category.icon className="w-5 h-5" />
                <span className="font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group overflow-hidden rounded-2xl border backdrop-blur-sm"
                style={{ 
                  backgroundColor: currentTheme.colors.cardBackground,
                  borderColor: currentTheme.colors.border
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                
                <div className="relative z-10 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold" style={{ color: currentTheme.colors.text }}>
                      {project.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'live' ? 'bg-green-100 text-green-800' :
                      project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="mb-6" style={{ color: currentTheme.colors.textSecondary }}>
                    {project.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: currentTheme.colors.text }}>
                      Key Features
                    </h4>
                    <div className="space-y-2">
                      {project.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.colors.primary }} />
                          <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: currentTheme.colors.text }}>
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 rounded-lg text-xs font-medium border"
                          style={{ 
                            backgroundColor: `${currentTheme.colors.primary}20`,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border" style={{ borderColor: currentTheme.colors.border }}>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                      Impact
                    </h4>
                    <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                      {project.impact}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r text-white font-medium hover:shadow-lg transition-all duration-300"
                      style={{ backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}>
                      <ExternalLink className="w-4 h-4" />
                      View Live
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                      style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }}>
                      <Github className="w-4 h-4" />
                      Source
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}