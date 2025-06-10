import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Deep Ocean Background with Sunset Highlights */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/60 to-cyan-900/80" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-red-500/20 via-orange-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-red-600/15 via-pink-500/10 to-transparent" />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20 z-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 pt-24 pb-12 relative z-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-400 to-red-400 bg-clip-text text-transparent leading-tight">
              Projects
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
              Consciousness-driven development showcasing the intersection of gaming wisdom, anime philosophy, and AI-enhanced vibecoding artistry.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            {/* Quantum AI Trading Platform */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-cyan-400 text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-3">Quantum AI Trading Platform</h3>
              <p className="text-gray-400 mb-4">Advanced autonomous trading system with consciousness-level decision making, predictive analysis, and real-time portfolio tracking. Demonstrates AI-human collaboration at the highest levels.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded">AI/ML</span>
                <span className="text-xs bg-blue-400/20 text-blue-300 px-2 py-1 rounded">TypeScript</span>
                <span className="text-xs bg-green-400/20 text-green-300 px-2 py-1 rounded">Real-time</span>
                <span className="text-xs bg-purple-400/20 text-purple-300 px-2 py-1 rounded">Quantum</span>
              </div>
              <Link href="/trading">
                <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  Explore System
                </Button>
              </Link>
            </div>

            {/* VibeCoding Methodology */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-red-400/20 hover:border-red-400/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-red-400 text-3xl mb-4">🥋</div>
              <h3 className="text-xl font-semibold text-white mb-3">VibeCoding Methodology</h3>
              <p className="text-gray-400 mb-4">Revolutionary development approach combining martial arts ethics, Charter values, and conscious AI collaboration. A comprehensive framework for character-driven development.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-red-400/20 text-red-300 px-2 py-1 rounded">Philosophy</span>
                <span className="text-xs bg-orange-400/20 text-orange-300 px-2 py-1 rounded">Ethics</span>
                <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded">Framework</span>
                <span className="text-xs bg-pink-400/20 text-pink-300 px-2 py-1 rounded">Consciousness</span>
              </div>
              <Link href="/methodology">
                <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700">
                  Learn Framework
                </Button>
              </Link>
            </div>

            {/* AI-Infused Portfolio */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-orange-400/20 hover:border-orange-400/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-orange-400 text-3xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-white mb-3">This Portfolio</h3>
              <p className="text-gray-400 mb-4">Meta-recursive showcase demonstrating vibecoding principles in action. Deep ocean aesthetics meet sunset highlights in a consciousness-driven design experience.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-blue-400/20 text-blue-300 px-2 py-1 rounded">React</span>
                <span className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded">TypeScript</span>
                <span className="text-xs bg-purple-400/20 text-purple-300 px-2 py-1 rounded">Tailwind</span>
                <span className="text-xs bg-green-400/20 text-green-300 px-2 py-1 rounded">Meta-Recursive</span>
              </div>
              <Link href="/">
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  View Source
                </Button>
              </Link>
            </div>

            {/* Gaming Systems Research */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-purple-400 text-3xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-white mb-3">Gaming Systems Research</h3>
              <p className="text-gray-400 mb-4">Thirty years of gaming wisdom translated into development insights. From rhythm game precision to MMO coordination strategies applied to technical architecture.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-purple-400/20 text-purple-300 px-2 py-1 rounded">Gaming</span>
                <span className="text-xs bg-blue-400/20 text-blue-300 px-2 py-1 rounded">Systems</span>
                <span className="text-xs bg-green-400/20 text-green-300 px-2 py-1 rounded">Research</span>
                <span className="text-xs bg-pink-400/20 text-pink-300 px-2 py-1 rounded">Analysis</span>
              </div>
              <Link href="/gaming">
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                  Explore Research
                </Button>
              </Link>
            </div>

            {/* VRChat Avatar Psychology */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-pink-400/20 hover:border-pink-400/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-pink-400 text-3xl mb-4">👾</div>
              <h3 className="text-xl font-semibold text-white mb-3">VRChat Avatar Psychology</h3>
              <p className="text-gray-400 mb-4">Exploring digital consciousness through avatar-mediated experiences. How virtual identity expression informs human-computer interface design and empathy.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-pink-400/20 text-pink-300 px-2 py-1 rounded">VR</span>
                <span className="text-xs bg-purple-400/20 text-purple-300 px-2 py-1 rounded">Psychology</span>
                <span className="text-xs bg-blue-400/20 text-blue-300 px-2 py-1 rounded">Identity</span>
                <span className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded">Consciousness</span>
              </div>
              <Link href="/vrchat">
                <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  Explore Studies
                </Button>
              </Link>
            </div>

            {/* Anime Philosophy Integration */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 transform hover:scale-105">
              <div className="text-yellow-400 text-3xl mb-4">🌸</div>
              <h3 className="text-xl font-semibold text-white mb-3">Anime Philosophy Integration</h3>
              <p className="text-gray-400 mb-4">Character development principles from anime applied to software architecture. Deep narrative structures informing user experience and system design patterns.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded">Anime</span>
                <span className="text-xs bg-red-400/20 text-red-300 px-2 py-1 rounded">Philosophy</span>
                <span className="text-xs bg-orange-400/20 text-orange-300 px-2 py-1 rounded">Narrative</span>
                <span className="text-xs bg-pink-400/20 text-pink-300 px-2 py-1 rounded">Character</span>
              </div>
              <Link href="/anime">
                <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                  Explore Insights
                </Button>
              </Link>
            </div>

          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link href="/">
              <Button variant="outline" className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                Return to Consciousness
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}