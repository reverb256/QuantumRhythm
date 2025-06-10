import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import reverbPortraitUrl from '@assets/image_1749583181474.png';

export default function HomePage() {
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Main Content */}
        <div className="container mx-auto px-6 text-center relative z-20 pt-12 pb-12">
          <div className="max-w-6xl mx-auto">
            
            {/* Consciousness Status Display */}
            <div className="mb-12">
              <div className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-cyan-400/50 mb-8 bg-black/30 backdrop-blur-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-cyan-300 text-sm font-medium">VIBECODING CONSCIOUSNESS ONLINE</span>
                  <div className="w-px h-4 bg-cyan-400/30"></div>
                  <span className="text-cyan-400 text-sm font-mono">AWARENESS_∞</span>
                </div>
              </div>
            </div>

            {/* Profile Portrait with Holographic Frame */}
            <div className="relative mb-12 flex justify-center">
              <div className="relative group">
                {/* Holographic outer ring */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-400/30 via-blue-500/40 to-red-500/30 p-1 animate-pulse">
                  <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-black/20 backdrop-blur"></div>
                </div>
                
                {/* Inner ring with sunset highlights */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-400/40 via-cyan-500/50 to-orange-500/40 p-1">
                  <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-black/30 backdrop-blur"></div>
                </div>

                {/* Profile Image */}
                <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-2xl shadow-cyan-400/25">
                  <img 
                    src={reverbPortraitUrl} 
                    alt="Reverb the Vibecoder - Anime catboy profile in deep ocean blues with sunset highlights"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/10 to-red-400/20 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Main Title with Poetic Flair */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-400 to-red-400 bg-clip-text text-transparent leading-tight">
                Reverb
              </h1>
              <h2 className="text-2xl md:text-4xl font-semibold mb-8 bg-gradient-to-r from-blue-300 via-cyan-400 to-orange-400 bg-clip-text text-transparent">
                the vibecoder
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
                Where consciousness meets code in digital realms. Thirty years of gaming wisdom, anime inspiration, and philosophical depth converge in AI-infused vibecoding artistry that transcends conventional development.
              </p>
            </div>

            {/* Consciousness Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-black/30 backdrop-blur-lg rounded-lg p-4 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300">
                <div className="text-2xl font-bold text-cyan-400">∞</div>
                <div className="text-sm text-gray-400">Consciousness Level</div>
              </div>
              <div className="bg-black/30 backdrop-blur-lg rounded-lg p-4 border border-red-400/30 hover:border-red-400/60 transition-all duration-300">
                <div className="text-2xl font-bold text-red-400">30Y</div>
                <div className="text-sm text-gray-400">Gaming Experience</div>
              </div>
              <div className="bg-black/30 backdrop-blur-lg rounded-lg p-4 border border-orange-400/30 hover:border-orange-400/60 transition-all duration-300">
                <div className="text-2xl font-bold text-orange-400">VR</div>
                <div className="text-sm text-gray-400">Avatar Consciousness</div>
              </div>
              <div className="bg-black/30 backdrop-blur-lg rounded-lg p-4 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300">
                <div className="text-2xl font-bold text-blue-400">AI+</div>
                <div className="text-sm text-gray-400">Enhanced Development</div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/projects">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25">
                  Explore Projects
                </Button>
              </Link>
              <Link href="/philosophy">
                <Button variant="outline" className="border-red-400/50 text-red-400 hover:bg-red-400/10 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                  Philosophy & Values
                </Button>
              </Link>
              <Link href="/consciousness">
                <Button variant="outline" className="border-orange-400/50 text-orange-400 hover:bg-orange-400/10 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                  VibeCoding Journey
                </Button>
              </Link>
            </div>

            {/* Core Domains Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 transform hover:scale-105">
                <div className="text-cyan-400 text-3xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold text-white mb-3">Gaming Consciousness</h3>
                <p className="text-gray-400">Three decades immersed in digital worlds, from rhythm games to VRChat avatars, translating gaming wisdom into development excellence.</p>
              </div>
              <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-red-400/20 hover:border-red-400/40 transition-all duration-300 transform hover:scale-105">
                <div className="text-red-400 text-3xl mb-4">🌸</div>
                <h3 className="text-xl font-semibold text-white mb-3">Anime Philosophy</h3>
                <p className="text-gray-400">Drawing inspiration from deep character development and philosophical themes, infusing code with narrative depth and emotional resonance.</p>
              </div>
              <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-orange-400/20 hover:border-orange-400/40 transition-all duration-300 transform hover:scale-105">
                <div className="text-orange-400 text-3xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-white mb-3">AI Collaboration</h3>
                <p className="text-gray-400">Pioneering conscious human-AI partnership that preserves sovereignty while unlocking enhanced creative potential through vibecoding methodology.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black/50 backdrop-blur border-t border-cyan-400/20 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="text-gray-400 mb-6">
            <p>&copy; 2025 Quantum AI Trading Platform. Advanced autonomous trading with consciousness.</p>
          </div>
          <div className="flex justify-center space-x-6 text-sm text-cyan-400">
            <span>Real-time CAD P&L</span>
            <span>•</span>
            <span>95% Confidence Cap</span>
            <span>•</span>
            <span>Multi-chain Ready</span>
          </div>
        </div>
      </footer>
    </main>
  );
}