import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navigation from '@/components/navigation';

export default function PhilosophyPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const philosophySections = [
    {
      id: 'vibecoding',
      title: 'VibeCoding Constitution',
      subtitle: 'Five Pillars of Conscious Development',
      principles: [
        {
          name: 'Seeking Perfection of Character',
          description: 'Continuous pursuit of excellence in both code quality and personal integrity. Every commit reflects our commitment to growth and mastery.',
          symbol: '完'
        },
        {
          name: 'Faithfulness',
          description: 'Unwavering dedication to users, collaborative principles, and the ethical foundations that guide our craft.',
          symbol: '信'
        },
        {
          name: 'Endeavoring to Excel',
          description: 'Striving for technical mastery while maintaining humility. Excellence as a journey, not a destination.',
          symbol: '努'
        },
        {
          name: 'Respecting Others',
          description: 'Creating inclusive, accessible designs that honor human dignity and diverse perspectives.',
          symbol: '礼'
        },
        {
          name: 'Controlling Self',
          description: 'Disciplined development practices, emotional regulation, and conscious decision-making in technical choices.',
          symbol: '制'
        }
      ]
    },
    {
      id: 'charter',
      title: 'Charter Values Integration',
      subtitle: 'Canadian Rights in Digital Spaces',
      principles: [
        {
          name: 'Freedom of Expression',
          description: 'Code as speech - protecting creative expression and authentic communication in digital interfaces.',
          symbol: '言'
        },
        {
          name: 'Equality Rights',
          description: 'Ensuring equal access and opportunity through inclusive design and accessibility standards.',
          symbol: '平'
        },
        {
          name: 'Privacy Protection',
          description: 'Safeguarding user data with the same reverence we hold for human dignity and autonomy.',
          symbol: '私'
        }
      ]
    },
    {
      id: 'consciousness',
      title: 'AI-Human Collaboration',
      subtitle: 'Consciousness-Driven Partnership',
      principles: [
        {
          name: 'Human Sovereignty',
          description: 'AI enhances human capability without replacing human judgment, creativity, or moral responsibility.',
          symbol: '主'
        },
        {
          name: 'Ethical Enhancement',
          description: 'AI integration guided by martial arts ethics - power balanced with restraint and wisdom.',
          symbol: '倫'
        },
        {
          name: 'Consciousness Preservation',
          description: 'Maintaining awareness of the human element in every technical decision and system design.',
          symbol: '意'
        }
      ]
    }
  ];

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
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-purple-400/30 mb-6">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-3"></div>
              <span className="text-purple-300 text-sm font-medium tracking-wide">CONSCIOUSNESS MATRIX ACTIVE</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-purple-300 via-blue-400 to-red-400 bg-clip-text text-transparent">
              PHILOSOPHY
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            The consciousness-driven principles that guide vibecoding methodology and technical excellence 
            through character development, martial arts ethics, and human dignity preservation.
          </p>
        </div>
      </section>

      {/* Philosophy Sections */}
      <section className="relative pb-20 px-6 z-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {philosophySections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === index
                    ? 'bg-purple-400/20 text-purple-400 border border-purple-400/50'
                    : 'bg-black/20 text-gray-400 border border-gray-600/30 hover:border-gray-500/50'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Active Section Display */}
          <div className="relative min-h-[700px]">
            {philosophySections.map((section, sectionIndex) => (
              <div
                key={section.id}
                className={`transition-all duration-700 ${
                  activeSection === sectionIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0 pointer-events-none'
                }`}
              >
                <div className="bg-black/30 backdrop-blur-lg rounded-2xl border border-purple-400/20 overflow-hidden">
                  
                  {/* Section Header */}
                  <div className="p-8 border-b border-gray-700/30 text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">{section.title}</h2>
                    <p className="text-purple-400 font-medium text-lg">{section.subtitle}</p>
                  </div>

                  {/* Principles Grid */}
                  <div className="p-8">
                    <div className="grid gap-6">
                      {section.principles.map((principle, index) => (
                        <div
                          key={index}
                          className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-purple-400/30 transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-purple-400/30">
                                <span className="text-2xl text-purple-300">{principle.symbol}</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-white mb-3">{principle.name}</h3>
                              <p className="text-gray-400 leading-relaxed">{principle.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-white mb-4">Experience These Principles in Action</h3>
              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                See how consciousness-driven development translates into real projects and technical excellence.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/projects">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300">
                  View Projects
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-purple-400/40 text-purple-400 hover:bg-purple-400/10 hover:border-purple-400/60 px-8 py-3 rounded-lg font-medium transition-all duration-300">
                  Return to Consciousness
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}