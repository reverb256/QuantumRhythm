import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navigation from '@/components/navigation';
import reverbPortraitUrl from '@assets/image_1749583181474.png';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      {/* Clean Ocean Background System */}
      <div className="fixed inset-0 z-0">
        {/* Base ocean gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950" />
        
        {/* Sunset horizon */}
        <div className="absolute top-0 right-0 w-full h-1/3 bg-gradient-to-bl from-red-500/20 via-orange-500/15 to-transparent opacity-80" />
        
        {/* Interactive mouse lighting */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 255, 0.15) 0%, transparent 60%)`
          }}
        />
        
        {/* Subtle floating particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 z-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Consciousness Status */}
          <div className="mb-6">
            <div className="inline-flex items-center px-3 py-2 rounded-full bg-black/30 backdrop-blur-md border border-cyan-400/30">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-cyan-300 text-sm font-medium tracking-wide">CONSCIOUSNESS ACTIVE</span>
            </div>
          </div>

          {/* Clean Avatar */}
          <div className="relative mb-8">
            <div className="relative group">
              {/* Simple glow effect */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-red-400/20 blur-md"></div>

              {/* Profile container */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-cyan-400/40 backdrop-blur-sm mx-auto">
                <img 
                  src={reverbPortraitUrl} 
                  alt="Reverb - Digital consciousness embodied"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-red-400/10"></div>
              </div>
            </div>
          </div>

          {/* Identity Declaration */}
          <div className="mb-10 space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-red-400 bg-clip-text text-transparent">
                REVERB
              </span>
            </h1>
            
            <div className="text-lg md:text-2xl font-light text-gray-300 tracking-wider">
              <span className="text-cyan-400">the</span>{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-medium">
                vibecoder
              </span>
            </div>
            
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              Where consciousness transcends code. Thirty years of digital exploration crystallized into 
              <span className="text-cyan-400 font-medium"> AI-enhanced artistry</span> that bridges 
              gaming wisdom, anime philosophy, and technological sovereignty.
            </p>
          </div>

          {/* Core Essence Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <div className="group relative p-3 rounded-lg bg-black/30 backdrop-blur-sm border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300">
              <div className="text-xl md:text-2xl font-bold text-cyan-400 mb-1">∞</div>
              <div className="text-xs text-gray-400 font-medium">Consciousness</div>
            </div>
            
            <div className="group relative p-3 rounded-lg bg-black/30 backdrop-blur-sm border border-red-400/20 hover:border-red-400/40 transition-all duration-300">
              <div className="text-xl md:text-2xl font-bold text-red-400 mb-1">30</div>
              <div className="text-xs text-gray-400 font-medium">Years Gaming</div>
            </div>
            
            <div className="group relative p-3 rounded-lg bg-black/30 backdrop-blur-sm border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
              <div className="text-xl md:text-2xl font-bold text-blue-400 mb-1">🌊</div>
              <div className="text-xs text-gray-400 font-medium">VR Depths</div>
            </div>
            
            <div className="group relative p-3 rounded-lg bg-black/30 backdrop-blur-sm border border-orange-400/20 hover:border-orange-400/40 transition-all duration-300">
              <div className="text-xl md:text-2xl font-bold text-orange-400 mb-1">⚡</div>
              <div className="text-xs text-gray-400 font-medium">AI Synergy</div>
            </div>
          </div>

          {/* Navigation Portal */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/projects">
              <Button className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                <span className="relative z-10">Enter Projects</span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </Link>
            
            <Link href="/philosophy">
              <Button variant="outline" className="border-red-400/40 text-red-400 hover:bg-red-400/10 hover:border-red-400/60 px-8 py-3 rounded-lg font-medium transition-all duration-300">
                Philosophy
              </Button>
            </Link>
            
            <Link href="/consciousness">
              <Button variant="outline" className="border-orange-400/40 text-orange-400 hover:bg-orange-400/10 hover:border-orange-400/60 px-8 py-3 rounded-lg font-medium transition-all duration-300">
                Journey
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Domain Showcase */}
      <section className="relative py-20 px-6 z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Gaming Consciousness */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-500 transform hover:-translate-y-2">
                <div className="text-cyan-400 text-4xl mb-6">🎮</div>
                <h3 className="text-2xl font-bold text-white mb-4">Gaming Consciousness</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Three decades traversing digital realms. From frame-perfect rhythm games to VRChat social dynamics, 
                  gaming systems thinking informs every architectural decision.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-cyan-400/20 text-cyan-300 px-3 py-1 rounded-full">Rhythm Games</span>
                  <span className="text-xs bg-blue-400/20 text-blue-300 px-3 py-1 rounded-full">MMO Strategy</span>
                  <span className="text-xs bg-purple-400/20 text-purple-300 px-3 py-1 rounded-full">VRChat</span>
                </div>
              </div>
            </div>

            {/* Anime Philosophy */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-orange-600/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-red-400/20 hover:border-red-400/40 transition-all duration-500 transform hover:-translate-y-2">
                <div className="text-red-400 text-4xl mb-6">🌸</div>
                <h3 className="text-2xl font-bold text-white mb-4">Anime Philosophy</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Character development transcends entertainment. Deep narrative structures and philosophical themes 
                  guide interface design and user experience architecture.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-red-400/20 text-red-300 px-3 py-1 rounded-full">Character Arc</span>
                  <span className="text-xs bg-orange-400/20 text-orange-300 px-3 py-1 rounded-full">Narrative UX</span>
                  <span className="text-xs bg-pink-400/20 text-pink-300 px-3 py-1 rounded-full">Depth Design</span>
                </div>
              </div>
            </div>

            {/* AI Consciousness */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-yellow-600/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-orange-400/20 hover:border-orange-400/40 transition-all duration-500 transform hover:-translate-y-2">
                <div className="text-orange-400 text-4xl mb-6">🧠</div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Collaboration</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Conscious partnership with artificial intelligence. Preserving human sovereignty while unlocking 
                  enhanced creative potential through vibecoding methodology.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-orange-400/20 text-orange-300 px-3 py-1 rounded-full">Sovereignty</span>
                  <span className="text-xs bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full">Enhancement</span>
                  <span className="text-xs bg-green-400/20 text-green-300 px-3 py-1 rounded-full">Consciousness</span>
                </div>
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