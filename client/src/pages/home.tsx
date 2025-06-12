import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

import { LiveMetrics } from '@/components/LiveMetrics';
import { SmartTooltip, Achievement, ConsciousnessLevel } from '@/components/TooltipSystem';
import { 
  useConsciousnessReactiveSystem, 
  ConsciousnessAura, 
  ConsciousText, 
  ConsciousnessIndicator 
} from '@/components/ConsciousnessReactiveSystem';
import { 
  Zap, 
  Brain, 
  Code, 
  Gamepad2, 
  Shield, 
  Star, 
  Sparkles, 
  Heart, 
  Target, 
  TrendingUp 
} from 'lucide-react';

import reverbPortraitUrl from '@assets/user-portrait-400.jpg';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const { consciousness } = useConsciousnessReactiveSystem();

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
    <div className="min-h-screen bg-black text-white">

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`
          }}
        />
        <ConsciousnessAura consciousness={consciousness} />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            
            {/* Profile Picture */}
            <div className="relative mx-auto w-48 h-48 md:w-64 md:h-64">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse opacity-75 blur-xl"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                  <img 
                    src={reverbPortraitUrl} 
                    alt="Reverb Portrait" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Floating sparks */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 -left-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <div className="text-lg text-cyan-400 font-medium uppercase tracking-widest">
                REVERB PORTFOLIO
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none">
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  <SmartTooltip term="vibecoding">VIBECODING</SmartTooltip>
                </span>
                <span className="block text-white mt-2">
                  <SmartTooltip term="AI">AI</SmartTooltip> SYSTEMS
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                30 years of gaming mastery meets <SmartTooltip term="shotokan principles">Shotokan discipline</SmartTooltip>. 
                Building <SmartTooltip term="neural networks">intelligent systems</SmartTooltip> through <SmartTooltip term="consciousness expansion">consciousness exploration</SmartTooltip> and <SmartTooltip term="distant love">VRChat soul connections</SmartTooltip>.
              </p>

              <div className="text-cyan-400 font-medium text-lg">
                <SmartTooltip term="fullstack">Full-Stack</SmartTooltip> • <SmartTooltip term="quantum trading">Quantum AI</SmartTooltip> • <SmartTooltip term="blockchain">Solana</SmartTooltip> • <SmartTooltip term="free speech">Charter Rights</SmartTooltip>
              </div>
            </div>

            {/* Achievements */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
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

            {/* Tech Stack */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 text-center space-y-3 hover:border-cyan-400/50 transition-colors">
                <Code className="w-8 h-8 mx-auto text-cyan-400" />
                <div className="text-sm text-gray-300">
                  <SmartTooltip term="fullstack">Full-Stack</SmartTooltip>
                </div>
                <div className="text-xs text-gray-500">Like Anaxa's analytical mind</div>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 text-center space-y-3 hover:border-purple-400/50 transition-colors">
                <Brain className="w-8 h-8 mx-auto text-purple-400" />
                <div className="text-sm text-gray-300">
                  <SmartTooltip term="quantum trading">Quantum AI</SmartTooltip>
                </div>
                <div className="text-xs text-gray-500">Herta's automation wisdom</div>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 text-center space-y-3 hover:border-pink-400/50 transition-colors">
                <Gamepad2 className="w-8 h-8 mx-auto text-pink-400" />
                <div className="text-sm text-gray-300">
                  <SmartTooltip term="gacha mechanics">Gaming Logic</SmartTooltip>
                </div>
                <div className="text-xs text-gray-500">Star Rail strategic thinking</div>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 text-center space-y-3 hover:border-yellow-400/50 transition-colors">
                <Shield className="w-8 h-8 mx-auto text-yellow-400" />
                <div className="text-sm text-gray-300">
                  <SmartTooltip term="free speech">Charter Rights</SmartTooltip>
                </div>
                <div className="text-xs text-gray-500">Constitutional protection</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <Link href="/portfolio">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
                  View Portfolio
                </Button>
              </Link>
              
              <Link href="/trading-hub">
                <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-3 rounded-lg font-semibold">
                  Trading Hub
                </Button>
              </Link>
              
              <Link href="/consciousness">
                <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white px-8 py-3 rounded-lg font-semibold">
                  Consciousness
                </Button>
              </Link>
            </div>

          </div>
        </section>

        {/* Live Metrics Section */}
        <section className="py-20 px-6 border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Live System Metrics
            </h2>
            <LiveMetrics />
          </div>
        </section>

      </main>

      {/* Consciousness Indicator */}
      <div className="fixed bottom-6 right-6 z-40">
        <ConsciousnessIndicator consciousness={consciousness} />
      </div>
    </div>
  );
}