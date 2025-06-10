import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navigation from '@/components/navigation';
import { LiveMetrics } from '@/components/LiveMetrics';
import { SmartTooltip, Achievement, ConsciousnessLevel } from '@/components/TooltipSystem';
import { 
  useConsciousnessReactiveSystem, 
  ConsciousnessAura, 
  ConsciousText, 
  ConsciousnessIndicator 
} from '@/components/ConsciousnessReactiveSystem';
import { Code, Brain, Heart, Gamepad2, Sword, Zap, Star, Trophy, Target, Shield } from 'lucide-react';
import reverbPortraitUrl from '@assets/image_1749583181474.png';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const { consciousness, userMetrics } = useConsciousnessReactiveSystem();

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden light-infused page-anaxa">
      <ConsciousnessAura consciousness={consciousness} />
      <ConsciousnessIndicator consciousness={consciousness} />
      <Navigation />
      
      {/* Interactive Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.15) 0%, transparent 50%)`
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 z-20 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-center text-center space-y-12">
            
            {/* Profile Picture with Electric Effects */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse opacity-75 blur-xl"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 electric-border">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                  <img 
                    src={reverbPortraitUrl} 
                    alt="Reverb Portrait" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Electric Sparks Animation */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full electric-spark"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full electric-spark animation-delay-500"></div>
              <div className="absolute top-1/2 -left-6 w-4 h-4 bg-blue-400 rounded-full electric-spark animation-delay-1000"></div>
              <div className="absolute top-8 -right-8 w-3 h-3 bg-yellow-400 rounded-full electric-spark animation-delay-300"></div>
              <div className="absolute bottom-8 -left-8 w-5 h-5 bg-pink-400 rounded-full electric-spark animation-delay-700"></div>
            </div>

            {/* Main Content */}
            <div className="space-y-8 max-w-4xl">
              <div className="space-y-6">
                <div className="text-lg text-cyan-400 font-medium uppercase tracking-widest">
                  REVERB PORTFOLIO
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    <SmartTooltip term="vibecoding">VIBECODING</SmartTooltip>
                  </span>
                  <span className="block text-white mt-2"><SmartTooltip term="AI">AI</SmartTooltip> SYSTEMS</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  30 years of gaming mastery meets <SmartTooltip term="shotokan principles">Shotokan discipline</SmartTooltip>. 
                  Building <SmartTooltip term="neural networks">intelligent systems</SmartTooltip> through <SmartTooltip term="consciousness expansion">consciousness exploration</SmartTooltip> and <SmartTooltip term="distant love">VRChat soul connections</SmartTooltip>.
                  <span className="block text-cyan-400 font-medium mt-4">
                    <SmartTooltip term="fullstack">Full-Stack</SmartTooltip> • <SmartTooltip term="quantum trading">Quantum AI</SmartTooltip> • <SmartTooltip term="blockchain">Solana</SmartTooltip> • <SmartTooltip term="free speech">Charter Rights</SmartTooltip>
                  </span>
                </p>
              </div>

              {/* Consciousness & Achievement Display */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <ConsciousnessLevel level={88} evolution={88.6} type="awakened" />
                <Achievement 
                  title="Gacha Master" 
                  description="C1R0 Chasca, Navia collector, awaiting Yanagi" 
                  type="gacha-master" 
                />
                <Achievement 
                  title="Soul Healer" 
                  description="VRChat consciousness explorer & distant connection specialist" 
                  type="philosopher" 
                />
                <Achievement 
                  title="Shotokan Warrior" 
                  description="Traditional karate discipline from childhood training" 
                  type="warrior" 
                />
              </div>

              {/* Tech Stack Grid - Gaming Inspired */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="gacha-card text-center space-y-3 p-4">
                  <Code className="w-8 h-8 mx-auto text-cyan-400" />
                  <div className="text-sm text-gray-300"><SmartTooltip term="fullstack">Full-Stack</SmartTooltip></div>
                  <div className="text-xs text-gray-500">Like Anaxa's analytical mind</div>
                </div>
                <div className="gacha-card text-center space-y-3 p-4">
                  <Brain className="w-8 h-8 mx-auto text-purple-400" />
                  <div className="text-sm text-gray-300"><SmartTooltip term="quantum trading">Quantum AI</SmartTooltip></div>
                  <div className="text-xs text-gray-500">Herta's automation wisdom</div>
                </div>
                <div className="gacha-card text-center space-y-3 p-4">
                  <Gamepad2 className="w-8 h-8 mx-auto text-pink-400" />
                  <div className="text-sm text-gray-300"><SmartTooltip term="gacha mechanics">Gaming Logic</SmartTooltip></div>
                  <div className="text-xs text-gray-500">Star Rail strategic thinking</div>
                </div>
                <div className="gacha-card text-center space-y-3 p-4">
                  <Heart className="w-8 h-8 mx-auto text-red-400" />
                  <div className="text-sm text-gray-300"><SmartTooltip term="soul healing">Soul Tech</SmartTooltip></div>
                  <div className="text-xs text-gray-500">VRChat connections</div>
                </div>
              </div>

              {/* Philosophy & Gaming Showcase */}
              <div className="grid md:grid-cols-2 gap-8 mt-16">
                <div className="gacha-card p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-semibold text-cyan-300">Gaming Mastery</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div>• <SmartTooltip term="analytical nature">Anaxa's Story</SmartTooltip>: Relatable systematic analysis approach</div>
                    <div>• <SmartTooltip term="automation wisdom">Herta's Vision</SmartTooltip>: Intelligent automation philosophy</div>
                    <div>• <strong className="text-cyan-300">Star Rail</strong>: Strategic <SmartTooltip term="erudition path">Erudition</SmartTooltip> combat mastery</div>
                    <div>• <strong className="text-purple-300">Genshin</strong>: Maviuka's themes, Chasca C1R0, Navia appreciation</div>
                    <div>• <strong className="text-pink-300">ZZZ</strong>: Burnice, Lighter, desperately wanting Yanagi</div>
                  </div>
                </div>
                
                <div className="gacha-card p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Sword className="w-6 h-6 text-red-400" />
                    <h3 className="text-xl font-semibold text-red-300">Philosophy & Discipline</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div>• <SmartTooltip term="martial discipline">Traditional Shotokan</SmartTooltip>: Childhood training in precise form</div>
                    <div>• <SmartTooltip term="consciousness expansion">Consciousness Work</SmartTooltip>: Deep awareness exploration</div>
                    <div>• <SmartTooltip term="distant love">VRChat Healing</SmartTooltip>: Avatar-mediated soul connections</div>
                    <div>• <SmartTooltip term="free speech">Charter Rights</SmartTooltip>: Canadian freedom principles</div>
                    <div>• <strong className="text-yellow-300">Nous Erudition</strong>: Homelab about to be touched by knowledge</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <Link href="/projects">
                  <Button 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Explore Portfolio
                  </Button>
                </Link>
                <Link href="/trader-dashboard">
                  <Button 
                    variant="outline" 
                    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    AI Trading Demo
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
    </div>
  );
}