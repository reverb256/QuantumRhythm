import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import catboy2025PFP___Copy from "@assets/catboy2025PFP - Copy.png";
// Using direct path for profile image

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Layered Background System */}
      <div className="absolute inset-0 z-0">
        {/* Primary Deep Space Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437202750.png')`,
            filter: 'brightness(0.4) saturate(1.3)',
          }}
        />
        
        {/* Holographic Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-screen opacity-20" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437206205.png')`,
          }}
        />
        
        {/* Digital Stream Effects */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-15" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437219730.png')`,
          }}
        />
      </div>
      {/* Cybernetic Grid Matrix */}
      <div className="absolute inset-0 opacity-10 z-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(147, 197, 253, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 197, 253, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      {/* Floating Holographic Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-cyan-400 rounded-full animate-pulse opacity-60"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      {/* Energy Circuit Lines */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(147, 197, 253, 0)" />
              <stop offset="50%" stopColor="rgba(147, 197, 253, 0.8)" />
              <stop offset="100%" stopColor="rgba(147, 197, 253, 0)" />
            </linearGradient>
          </defs>
          <path
            d="M100,200 Q400,100 700,300 T900,500"
            stroke="url(#circuitGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M200,800 Q500,600 800,750 T1000,400"
            stroke="url(#circuitGradient)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </svg>
      </div>
      {/* Main Content Container */}
      <div className="container mx-auto px-6 text-center relative z-20 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Holographic Status Display */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center px-6 py-3 prismatic-glass rounded-full border border-cyan-400/50 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-300 text-sm font-medium">SYSTEM ONLINE</span>
                <div className="w-px h-4 bg-cyan-400/30"></div>
                <span className="text-cyan-400 text-sm font-mono">NEURAL_LINK_100%</span>
              </div>
            </div>
          </div>

          {/* Character Portrait with Holographic Frame */}
          <div className="relative mb-10">
            {/* Outer Holographic Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-56 h-56 md:w-72 md:h-72 border-2 border-cyan-400/40 rounded-full animate-spin" style={{ animationDuration: '30s' }}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50"></div>
              </div>
            </div>
            
            {/* Portrait Container */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                <img
                  src={catboy2025PFP___Copy}
                  alt="reverb256 Digital Architect"
                  className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-4 border-cyan-300/60 shadow-2xl shadow-cyan-400/40"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 via-transparent to-purple-400/20 pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Main Identity Card */}
          <div className="prismatic-glass p-8 md:p-12 rounded-3xl mb-8 border border-cyan-400/50 relative overflow-hidden">
            {/* Background Circuit Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('/attached_assets/image_1749437226380.png')`,
                }}
              ></div>
            </div>
            
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-space">
                <span className="holo-text">Reverb</span>
              </h1>
              
              <h2 className="text-xl md:text-3xl lg:text-4xl text-[var(--text-secondary)] mb-6 font-medium">
                Full-Stack Developer & Digital Philosopher
              </h2>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-cyan-200/90 font-mono mb-6">
                <span className="flex items-center">
                  <span className="text-[var(--spectrum-cyan)] mr-2">SPECIALIZATION</span>
                  <span className="text-[var(--text-primary)]">React • Node.js • AI</span>
                </span>
                <span className="flex items-center">
                  <span className="text-[var(--spectrum-cyan)] mr-2">APPROACH</span>
                  <span className="text-[var(--text-primary)]">VibeCoding Methodology</span>
                </span>
                <span className="flex items-center">
                  <span className="text-[var(--spectrum-cyan)] mr-2">LOCATION</span>
                  <span className="text-[var(--text-primary)]">Canada</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bio Description */}
          <div className="prismatic-glass p-6 md:p-8 rounded-2xl mb-10 border border-cyan-400/30">
            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
              I craft digital experiences that merge philosophical depth with cutting-edge technology. 
              My VibeCoding methodology combines ancient wisdom principles with modern development practices, 
              creating solutions that prioritize human dignity and meaningful connection.
            </p>
          </div>

          {/* Prismatic Spectrum Display */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-2 md:space-x-3">
              {[
                'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 
                'bg-green-400', 'bg-cyan-400', 'bg-blue-400', 
                'bg-indigo-400', 'bg-purple-400', 'bg-pink-400'
              ].map((color, index) => (
                <div 
                  key={index}
                  className={`w-3 h-12 md:w-4 md:h-16 ${color} rounded-full animate-pulse shadow-lg`}
                  style={{ 
                    animationDelay: `${index * 0.2}s`,
                    boxShadow: `0 0 20px ${color.replace('bg-', '').replace('-400', '')}`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Action Button Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full h-16 holo-panel bg-gradient-to-r from-[var(--spectrum-cyan)] to-[var(--spectrum-blue)] hover:from-[var(--spectrum-blue)] hover:to-[var(--spectrum-violet)] text-white rounded-2xl text-lg font-semibold transition-all duration-300 border border-cyan-400/50 shadow-lg shadow-cyan-400/25 hover:shadow-xl hover:shadow-cyan-400/40 gacha-shine"
            >
              <i className="fas fa-code mr-3 text-xl"></i>
              View My Work
            </button>
            
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full h-16 holo-panel bg-gradient-to-r from-[var(--spectrum-violet)] to-[var(--spectrum-pink)] hover:from-[var(--spectrum-pink)] hover:to-[var(--spectrum-red)] text-white rounded-2xl text-lg font-semibold transition-all duration-300 border border-purple-400/50 shadow-lg shadow-purple-400/25 hover:shadow-xl hover:shadow-purple-400/40 gacha-shine"
            >
              <i className="fas fa-envelope mr-3 text-xl"></i>
              Start Conversation
            </button>
            
            <Link href="/values">
              <Button className="w-full h-16 holo-panel bg-gradient-to-r from-[var(--spectrum-green)] to-[var(--spectrum-teal)] hover:from-[var(--spectrum-teal)] hover:to-[var(--spectrum-cyan)] text-white rounded-2xl text-lg font-semibold transition-all duration-300 border border-green-400/50 shadow-lg shadow-green-400/25 hover:shadow-xl hover:shadow-green-400/40 gacha-shine">
                <i className="fas fa-compass mr-3 text-xl"></i>
                Core Values
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Holographic Corner Brackets */}
      <div className="absolute top-6 left-6 w-20 h-20 border-l-3 border-t-3 border-cyan-400/70 z-40"></div>
      <div className="absolute top-6 right-6 w-20 h-20 border-r-3 border-t-3 border-cyan-400/70 z-40"></div>
      <div className="absolute bottom-6 left-6 w-20 h-20 border-l-3 border-b-3 border-cyan-400/70 z-40"></div>
      <div className="absolute bottom-6 right-6 w-20 h-20 border-r-3 border-b-3 border-cyan-400/70 z-40"></div>
    </section>
  );
}