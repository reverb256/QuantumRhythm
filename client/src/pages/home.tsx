import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navigation from '@/components/navigation';
import { LiveMetrics } from '@/components/LiveMetrics';
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
      
      {/* Clean Ocean Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950" />
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-red-500/15 via-orange-500/10 to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 z-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Main Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
                  <span className="block text-white">Quantum</span>
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    AI Trading
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
                  Autonomous trading portfolio demonstrating advanced AI-driven strategies.
                  <span className="block text-cyan-400 font-medium mt-2">
                    Live DeFi analysis with real Solana blockchain integration.
                  </span>
                </p>
              </div>

              {/* Live Portfolio Metrics */}
              <LiveMetrics />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/trader-dashboard">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25">
                    Launch Dashboard
                  </Button>
                </Link>
                
                <Link href="/projects">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                    View Projects
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl animate-pulse"></div>
                
                {/* Main visual container */}
                <div className="relative bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50">
                  <div className="space-y-6">
                    {/* Real-time trading indicators */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Live Trading</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-medium">ACTIVE</span>
                      </div>
                    </div>
                    
                    {/* Trading pairs */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
                        <span className="text-white font-medium">SOL/USDC</span>
                        <span className="text-green-400">+2.4%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
                        <span className="text-white font-medium">RAY/SOL</span>
                        <span className="text-red-400">-0.8%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
                        <span className="text-white font-medium">JUP/SOL</span>
                        <span className="text-green-400">+1.2%</span>
                      </div>
                    </div>
                    
                    {/* AI Status */}
                    <div className="pt-4 border-t border-gray-700">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400 mb-1">Level 7</div>
                        <div className="text-sm text-gray-400">Superstar Trader</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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