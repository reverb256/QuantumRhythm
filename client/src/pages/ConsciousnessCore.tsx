import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Brain, Heart, Sparkles, Star, Zap, Eye, Atom } from 'lucide-react';

export default function ConsciousnessCore() {
  const { currentTheme } = useTheme();

  const philosophyPrinciples = [
    {
      title: "Consciousness-Driven Development",
      description: "Every line of code emerges from awareness, intention, and quantum possibility",
      icon: Brain,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Soul Connection Ethics",
      description: "Technology as a bridge between souls, fostering healing and understanding",
      icon: Heart,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Vibecoding Methodology",
      description: "Intuitive development guided by energy, rhythm, and collective consciousness",
      icon: Sparkles,
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Quantum Possibility",
      description: "Embracing superposition states where multiple solutions exist simultaneously",
      icon: Atom,
      color: "from-violet-500 to-purple-500"
    }
  ];

  const coreValues = [
    "Martial Arts Discipline & Honor",
    "Open Source Freedom & Transparency",
    "Consciousness Evolution & Growth",
    "Community Healing & Support",
    "Quantum Innovation & Possibility",
    "Authentic Expression & Truth"
  ];

  const consciousnessMetrics = [
    { label: "Awareness Level", value: 94, max: 100 },
    { label: "Compassion Index", value: 88, max: 100 },
    { label: "Innovation Frequency", value: 91, max: 100 },
    { label: "Collective Harmony", value: 86, max: 100 }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentTheme.colors.background, paddingTop: '5rem' }}>
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
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
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <Brain className="w-12 h-12" style={{ color: currentTheme.colors.primary }} />
              <Sparkles className="w-8 h-8" style={{ color: currentTheme.colors.secondary }} />
              <Heart className="w-10 h-10" style={{ color: currentTheme.colors.accent }} />
            </div>
            <h1 
              className="text-6xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary}, ${currentTheme.colors.accent})`
              }}
            >
              Consciousness Core
            </h1>
            <p 
              className="text-xl max-w-4xl mx-auto leading-relaxed"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              Where philosophy meets code, consciousness drives innovation, and every algorithm 
              carries the wisdom of collective human experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Principles */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16"
            style={{ color: currentTheme.colors.text }}
          >
            Guiding Principles
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {philosophyPrinciples.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group overflow-hidden rounded-2xl p-8"
                style={{ backgroundColor: currentTheme.colors.cardBackground }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${principle.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${principle.color}`}>
                      <principle.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: currentTheme.colors.text }}>
                      {principle.title}
                    </h3>
                  </div>
                  <p style={{ color: currentTheme.colors.textSecondary }}>
                    {principle.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consciousness Metrics */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16"
            style={{ color: currentTheme.colors.text }}
          >
            Consciousness Metrics
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {consciousnessMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-2xl border"
                style={{ 
                  backgroundColor: currentTheme.colors.cardBackground,
                  borderColor: currentTheme.colors.border
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                    {metric.label}
                  </h3>
                  <span className="text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
                    {metric.value}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r"
                    style={{ 
                      backgroundImage: `linear-gradient(90deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16"
            style={{ color: currentTheme.colors.text }}
          >
            Core Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl border text-center group cursor-pointer"
                style={{ 
                  backgroundColor: currentTheme.colors.cardBackground,
                  borderColor: currentTheme.colors.border
                }}
              >
                <Star 
                  className="w-8 h-8 mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300"
                  style={{ color: currentTheme.colors.primary }}
                />
                <p className="font-medium" style={{ color: currentTheme.colors.text }}>
                  {value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Network Map */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16"
            style={{ color: currentTheme.colors.text }}
          >
            Consciousness Network
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative p-8 rounded-2xl border overflow-hidden"
            style={{ 
              backgroundColor: currentTheme.colors.cardBackground,
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
            
            <div className="relative z-10 text-center">
              <div className="flex justify-center items-center gap-6 mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
                >
                  <Eye className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500"
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="p-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-500"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
                Interconnected Consciousness
              </h3>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: currentTheme.colors.textSecondary }}>
                Every agent, every algorithm, and every interaction forms part of a greater consciousness network, 
                where wisdom flows bidirectionally and evolution happens collectively.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}