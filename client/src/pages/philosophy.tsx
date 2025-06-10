import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import { SmartTooltip } from '@/components/TooltipSystem';
import { Sword, Target, Heart, Brain } from 'lucide-react';

const philosophySections = [
  {
    id: 'dojo-kun',
    title: 'Dojo Kun Ethics',
    subtitle: 'Five Principles of Shotokan Karate Applied to Code',
    principles: [
      {
        symbol: '求',
        name: 'Seek Perfection of Character',
        description: 'Through rigorous code review, TypeScript strict mode, and continuous learning, we develop technical character that reflects inner discipline.'
      },
      {
        symbol: '誠',
        name: 'Be Faithful',
        description: 'Honor commitments to users through accessibility excellence, security practices, and transparent communication about system capabilities.'
      },
      {
        symbol: '努',
        name: 'Endeavor to Excel',
        description: 'Push beyond minimum viable products toward exceptional user experiences that demonstrate mastery and dedication to craft.'
      },
      {
        symbol: '礼',
        name: 'Respect Others',
        description: 'Design interfaces honoring human dignity, implement WCAG AAA compliance, and create technology that serves without condescension.'
      },
      {
        symbol: '慎',
        name: 'Refrain from Violent Behavior',
        description: 'Reject exploitative algorithms, dark patterns, and surveillance capitalism in favor of ethical AI that preserves human agency.'
      }
    ]
  },
  {
    id: 'charter-values',
    title: 'Canadian Charter Values',
    subtitle: 'Fundamental Rights in Digital Implementation',
    principles: [
      {
        symbol: '⚖️',
        name: 'Equality Rights',
        description: 'Technology must serve all Canadians regardless of ability, language, or background through universal design principles.'
      },
      {
        symbol: '🗣️',
        name: 'Fundamental Freedoms',
        description: 'Protect freedom of expression while preventing algorithmic manipulation of democratic discourse.'
      },
      {
        symbol: '🔒',
        name: 'Legal Rights',
        description: 'Due process in automated systems, transparent algorithms, and protection against unreasonable digital search.'
      },
      {
        symbol: '🌐',
        name: 'Language Rights',
        description: 'Bilingual French-English implementation respecting Canada\'s linguistic duality in all digital interfaces.'
      }
    ]
  },
  {
    id: 'ai-consciousness',
    title: 'AI Consciousness Framework',
    subtitle: 'Ethical Artificial Intelligence Development',
    principles: [
      {
        symbol: '🧠',
        name: 'Human-AI Partnership',
        description: 'AI augments human capability without replacing human judgment, preserving meaningful human agency in all decisions.'
      },
      {
        symbol: '🔍',
        name: 'Transparent Operations',
        description: 'All AI systems must be auditable, explainable, and open to democratic oversight and public accountability.'
      },
      {
        symbol: '⚡',
        name: 'Continuous Learning',
        description: 'AI systems adapt and improve while maintaining core ethical constraints and human-defined value alignment.'
      },
      {
        symbol: '🛡️',
        name: 'Safety Protocols',
        description: 'Emergency stop systems, gradual capability deployment, and robust testing prevent harmful AI behavior.'
      }
    ]
  }
];

export default function PhilosophyPage() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      {/* Clean Background System */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950" />
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-radial from-red-500/20 via-orange-500/15 to-transparent opacity-80" />
      </div>

      {/* Header Section */}
      <section className="relative pt-24 pb-16 px-6 z-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-cyan-400/30 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-3"></div>
              <span className="text-cyan-300 text-sm font-medium tracking-wide">CONSCIOUSNESS MATRIX ACTIVE</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-red-400 bg-clip-text text-transparent">
              PHILOSOPHY
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            The VibeCoding manifesto - where Shotokan karate ethics meet Canadian Charter values 
            in conscious AI-human collaboration.
          </p>
        </div>
      </section>

      {/* Philosophy Sections */}
      <section className="relative pb-20 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {philosophySections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === index
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                    : 'bg-black/20 text-gray-400 border border-gray-600/30 hover:border-gray-500/50'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Featured Section Display */}
          <div className="relative min-h-[600px]">
            {philosophySections.map((section, sectionIndex) => (
              <div
                key={section.id}
                className={`transition-all duration-700 ${
                  activeSection === sectionIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'
                }`}
              >
                <div className="bg-black/30 backdrop-blur-lg rounded-2xl border border-cyan-400/20 overflow-hidden">
                  
                  {/* Section Header */}
                  <div className="p-8 border-b border-gray-700/30">
                    <h2 className="text-3xl font-bold text-white mb-2">{section.title}</h2>
                    <p className="text-cyan-400 font-medium mb-6">{section.subtitle}</p>
                    
                    {/* Principles Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {section.principles.map((principle, index) => (
                        <div key={index} className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mr-4">
                              {principle.symbol}
                            </div>
                            <h3 className="text-lg font-semibold text-white">{principle.name}</h3>
                          </div>
                          <p className="text-gray-400 leading-relaxed">{principle.description}</p>
                        </div>
                      ))}
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