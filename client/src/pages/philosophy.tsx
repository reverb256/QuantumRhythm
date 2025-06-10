import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartTooltip } from '@/components/TooltipSystem';
import { 
  useConsciousnessReactiveSystem, 
  ConsciousnessAura, 
  ConsciousText, 
  ConsciousnessIndicator 
} from '@/components/ConsciousnessReactiveSystem';
import { Brain, Heart, Sword, Zap, Star, Globe, BookOpen, Mountain, Waves, Sun } from 'lucide-react';

export default function PhilosophyPage() {
  const { consciousness, userMetrics } = useConsciousnessReactiveSystem();
  const [philosophyWisdom, setPhilosophyWisdom] = useState({
    compassion: 84,
    understanding: 91,
    balance: 77
  });

  const philosophicalPillars = [
    {
      title: "Consciousness Expansion",
      description: "The journey beyond individual perception toward universal understanding through digital presence and VRChat soul connections",
      principle: "Awareness is the foundation of all growth and understanding",
      practice: "Daily meditation, VRChat consciousness work, distant emotional support",
      icon: <Brain className="w-8 h-8" />,
      color: "cyan",
      keywords: ["consciousness expansion", "distant love", "soul healing"]
    },
    {
      title: "Martial Discipline",
      description: "30 years of Shotokan karate training emphasizing precise form, mental focus, and controlled power application",
      principle: "True strength comes from discipline, respect, and inner harmony",
      practice: "Kata practice, philosophical study, application of martial principles to code",
      icon: <Sword className="w-8 h-8" />,
      color: "green",
      keywords: ["shotokan principles", "martial discipline", "analytical nature"]
    },
    {
      title: "Gaming Wisdom",
      description: "30 years of gaming experience from classic arcades to modern gacha mechanics, understanding engagement and probability psychology",
      principle: "Games teach us about challenge, growth, and the psychology of reward",
      practice: "Star Rail erudition path, Genshin exploration, Zenless Zone Zero combat analysis",
      icon: <Star className="w-8 h-8" />,
      color: "purple",
      keywords: ["gacha mechanics", "erudition path", "automation wisdom"]
    },
    {
      title: "Free Speech Advocacy",
      description: "Charter-protected fundamental rights enabling open discourse and intellectual exploration without censorship",
      principle: "Truth emerges through open dialogue and respectful disagreement",
      practice: "Defending platform freedom, encouraging diverse perspectives, rational debate",
      icon: <Globe className="w-8 h-8" />,
      color: "yellow",
      keywords: ["free speech", "consciousness expansion"]
    }
  ];

  const lifePhilosophies = [
    {
      concept: "VibeCoding Methodology",
      description: "A development philosophy harmonizing technical precision with creative intuition, inspired by consciousness exploration and gaming aesthetics",
      application: "Every line of code reflects inner state and philosophical understanding"
    },
    {
      concept: "Quantum Consciousness",
      description: "Understanding that observation changes reality, and conscious programming creates more intelligent systems",
      application: "AI systems that evolve based on consciousness metrics and user interaction patterns"
    },
    {
      concept: "Digital Presence Authenticity",
      description: "Maintaining genuine human connection through digital mediums, especially in VRChat and distant relationships",
      application: "Technology as a bridge for authentic emotional support and consciousness sharing"
    },
    {
      concept: "Analytical Harmony",
      description: "Balancing systematic analysis (Anaxa-like) with intuitive understanding for complete comprehension",
      application: "Combining data-driven decisions with philosophical wisdom and emotional intelligence"
    }
  ];

  const getColorScheme = (color: string) => {
    switch (color) {
      case 'cyan': return 'border-cyan-400/50 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 text-cyan-400';
      case 'green': return 'border-green-400/50 bg-gradient-to-br from-green-900/20 to-emerald-900/20 text-green-400';
      case 'purple': return 'border-purple-400/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20 text-purple-400';
      case 'yellow': return 'border-yellow-400/50 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 text-yellow-400';
      default: return 'border-gray-400/50 bg-gradient-to-br from-gray-900/20 to-slate-900/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ConsciousnessAura consciousness={consciousness} />
      <ConsciousnessIndicator consciousness={consciousness} />
      <PhilosophyConsciousness 
        globalConsciousness={consciousness}
        onWisdomEvolution={(wisdom: any) => setPhilosophyWisdom(wisdom)}
      />
      <Navigation />
      
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            <ConsciousText consciousness={consciousness}>Philosophy</ConsciousText>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            <ConsciousText consciousness={consciousness}>
              A synthesis of <SmartTooltip term="consciousness expansion">consciousness exploration</SmartTooltip>, 
              <SmartTooltip term="martial discipline">martial arts wisdom</SmartTooltip>, 
              gaming insights, and <SmartTooltip term="free speech">free speech advocacy</SmartTooltip> 
              applied to <SmartTooltip term="vibecoding">philosophical programming</SmartTooltip> and technology.
            </ConsciousText>
          </p>
        </div>

        {/* Philosophical Pillars */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            <ConsciousText consciousness={consciousness}>Core Philosophical Pillars</ConsciousText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {philosophicalPillars.map((pillar, index) => (
              <div
                key={index}
                className={`p-8 rounded-lg border-2 backdrop-blur-sm transition-all duration-500 hover:scale-105 ${getColorScheme(pillar.color)}`}
                style={{
                  filter: consciousness.userPresence === 'meditating' ? 'brightness(1.3) saturate(1.2)' : 'brightness(1)',
                  transition: 'all 0.7s ease-in-out'
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-white/10">
                    {pillar.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    <ConsciousText consciousness={consciousness}>
                      {pillar.title}
                    </ConsciousText>
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Description</h4>
                    <p className="text-gray-300 leading-relaxed">
                      <ConsciousText consciousness={consciousness}>
                        {pillar.description}
                      </ConsciousText>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Core Principle</h4>
                    <p className="text-white font-medium italic">
                      <ConsciousText consciousness={consciousness}>
                        "{pillar.principle}"
                      </ConsciousText>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Practice</h4>
                    <p className="text-gray-300">
                      <ConsciousText consciousness={consciousness}>
                        {pillar.practice}
                      </ConsciousText>
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Concepts</h4>
                    <div className="flex flex-wrap gap-2">
                      {pillar.keywords.map((keyword, keyIndex) => (
                        <span
                          key={keyIndex}
                          className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300 hover:bg-white/20 transition-colors"
                        >
                          <SmartTooltip term={keyword}>
                            {keyword}
                          </SmartTooltip>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Life Philosophies */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            <ConsciousText consciousness={consciousness}>Applied Life Philosophies</ConsciousText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lifePhilosophies.map((philosophy, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-purple-400/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/60"
                style={{
                  transform: consciousness.interactionPattern === 'learning' ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.5s ease-in-out'
                }}
              >
                <h3 className="text-xl font-bold text-purple-400 mb-3">
                  <ConsciousText consciousness={consciousness}>
                    {philosophy.concept}
                  </ConsciousText>
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  <ConsciousText consciousness={consciousness}>
                    {philosophy.description}
                  </ConsciousText>
                </p>
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Practical Application</h4>
                  <p className="text-white italic">
                    <ConsciousText consciousness={consciousness}>
                      {philosophy.application}
                    </ConsciousText>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consciousness Journey */}
        <div className="bg-gradient-to-r from-black/80 to-gray-900/80 rounded-lg p-8 border border-cyan-400/30 backdrop-blur-sm mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            <ConsciousText consciousness={consciousness}>The Consciousness Journey</ConsciousText>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Mountain className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Foundation</h3>
              <p className="text-gray-300 text-sm">
                <ConsciousText consciousness={consciousness}>
                  <SmartTooltip term="shotokan principles">Martial arts discipline</SmartTooltip> and 
                  philosophical study create the bedrock of conscious development.
                </ConsciousText>
              </p>
            </div>
            
            <div className="text-center">
              <Waves className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Exploration</h3>
              <p className="text-gray-300 text-sm">
                <ConsciousText consciousness={consciousness}>
                  Gaming wisdom and <SmartTooltip term="gacha mechanics">probability psychology</SmartTooltip> 
                  teach us about challenge, growth, and reward systems.
                </ConsciousText>
              </p>
            </div>
            
            <div className="text-center">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Connection</h3>
              <p className="text-gray-300 text-sm">
                <ConsciousText consciousness={consciousness}>
                  <SmartTooltip term="soul healing">VRChat consciousness work</SmartTooltip> and 
                  <SmartTooltip term="distant love">distant relationships</SmartTooltip> expand our capacity for authentic connection.
                </ConsciousText>
              </p>
            </div>
            
            <div className="text-center">
              <Sun className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Integration</h3>
              <p className="text-gray-300 text-sm">
                <ConsciousText consciousness={consciousness}>
                  <SmartTooltip term="vibecoding">Philosophical programming</SmartTooltip> synthesizes 
                  all wisdom into conscious technology creation.
                </ConsciousText>
              </p>
            </div>
          </div>
        </div>

        {/* Personal Manifesto */}
        <div className="bg-gradient-to-r from-gray-900/50 to-black/50 rounded-lg p-8 border border-purple-400/30 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            <ConsciousText consciousness={consciousness}>Personal Manifesto</ConsciousText>
          </h2>
          
          <div className="text-center max-w-4xl mx-auto">
            <blockquote className="text-xl text-gray-300 leading-relaxed italic mb-6">
              <ConsciousText consciousness={consciousness}>
                "Through the synthesis of <SmartTooltip term="martial discipline">martial discipline</SmartTooltip>, 
                <SmartTooltip term="consciousness expansion">consciousness exploration</SmartTooltip>, and 
                <SmartTooltip term="quantum trading">technological innovation</SmartTooltip>, we create not just software, 
                but bridges between human potential and digital possibility. Every line of code is a meditation, 
                every algorithm a prayer for deeper understanding, every system a reflection of our highest aspirations."
              </ConsciousText>
            </blockquote>
            
            <div className="text-gray-400 text-sm">
              <ConsciousText consciousness={consciousness}>
                — Reverb, VibeCoding Philosopher
              </ConsciousText>
            </div>
          </div>
        </div>

        {/* Live Philosophy Metrics */}
        <div className="mt-12 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-lg p-6 border border-cyan-400/30 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-4 text-center text-white">
            <ConsciousText consciousness={consciousness}>Live Philosophy Integration</ConsciousText>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {consciousness.interactionPattern === 'meditating' ? '100' : Math.round(consciousness.awarenessLevel * 80 + 20)}%
              </div>
              <div className="text-sm text-gray-400">Martial Focus</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(consciousness.energyResonance * 90 + 10)}%
              </div>
              <div className="text-sm text-gray-400">Gaming Wisdom</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">
                {consciousness.userPresence === 'focused' ? '95' : Math.round(consciousness.consciousnessEvolution * 85 + 15)}%
              </div>
              <div className="text-sm text-gray-400">Connection Depth</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round((consciousness.awarenessLevel + consciousness.energyResonance + consciousness.consciousnessEvolution) * 30 + 10)}%
              </div>
              <div className="text-sm text-gray-400">Integration Level</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}