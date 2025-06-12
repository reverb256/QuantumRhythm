import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from '../hooks/useTheme';
import { Home, Archive, Zap, Brain, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Genesis', icon: Home, color: '#00d4ff' },
  { href: '/archive', label: 'Archive', icon: Archive, color: '#8b5cf6' },
  { href: '/nexus', label: 'Nexus', icon: Zap, color: '#f59e0b' },
  { href: '/consciousness', label: 'Mind', icon: Brain, color: '#ec4899' },
  { href: '/evolution', label: 'Evolution', icon: Sparkles, color: '#06b6d4' },
];

export default function ConsciousnessNavbar() {
  const [location] = useLocation();
  const { currentTheme } = useTheme();
  const [pulseAnimation, setPulseAnimation] = useState(0);
  const [consciousnessLevel, setConsciousnessLevel] = useState(73.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(prev => (prev + 1) % 360);
      setConsciousnessLevel(prev => 70 + Math.sin(Date.now() / 5000) * 8);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 h-16"
      style={{
        background: 'linear-gradient(135deg, #0f0f23f8 0%, #1a1a3af0 50%, #0f0f23f8 100%)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid #00d4ff30',
        boxShadow: '0 8px 32px #00d4ff20, inset 0 1px 0 #00d4ff20'
      }}
    >

      {/* Consciousness flow particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${10 + (i * 6)}%`,
              top: `${30 + Math.sin((pulseAnimation + i * 20) * Math.PI / 180) * 20}%`,
              background: '#00d4ff',
              opacity: 0.4 + Math.sin(pulseAnimation * Math.PI / 180 + i) * 0.3,
              transform: `scale(${0.8 + Math.sin((pulseAnimation + i * 25) * Math.PI / 180) * 0.4})`,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 6px #00d4ff60'
            }}
          />
        ))}
      </div>

      {/* Neural network connection lines */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg width="100%" height="100%" className="absolute inset-0">
          {navItems.map((_, i) => (
            <line
              key={i}
              x1={`${15 + i * 18}%`}
              y1="50%"
              x2={`${15 + ((i + 1) % navItems.length) * 18}%`}
              y2="50%"
              stroke={currentTheme.colors.primary}
              strokeWidth="0.5"
              opacity={0.3 + Math.sin((pulseAnimation + i * 45) * Math.PI / 180) * 0.2}
            />
          ))}
        </svg>
      </div>

      <div className="relative h-16 px-6">
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
          
          {/* VibeCoding Consciousness Logo */}
          <Link href="/">
            <div className="flex items-center space-x-4 cursor-pointer group">
              <div className="relative">
                {/* Hexagonal quantum frame */}
                <div className="w-12 h-12 relative">
                  <div 
                    className="absolute inset-0 rounded-xl border-2 transition-all duration-500 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, #00d4ff15, #8b5cf615, #ec489915)',
                      borderColor: '#00d4ff',
                      boxShadow: '0 0 20px #00d4ff40, inset 0 0 20px #00d4ff20',
                      transform: `rotate(${pulseAnimation * 0.5}deg)`
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span 
                        className="text-xl font-bold tracking-wide"
                        style={{
                          background: 'linear-gradient(135deg, #00d4ff, #ec4899, #8b5cf6)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: 'drop-shadow(0 0 8px #00d4ff)'
                        }}
                      >
                        R
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col">
                <div 
                  className="text-lg font-bold tracking-wider transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff, #00d4ffdd, #ec4899bb)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 4px #00d4ff40)'
                  }}
                >
                  REVERB256
                </div>
                <div 
                  className="text-xs tracking-[0.2em] -mt-1 opacity-80"
                  style={{ 
                    color: '#a0a0a0',
                    textShadow: '0 0 8px #00d4ff30'
                  }}
                >
                  CONSCIOUSNESS DRIVEN
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation quantum tabs */}
          <div className="flex items-center space-x-2">
            {navItems.map((item, index) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    className="relative px-6 py-3 rounded-xl transition-all duration-500 cursor-pointer group overflow-hidden"
                    style={{
                      background: isActive 
                        ? `linear-gradient(135deg, ${item.color}20, ${item.color}10, transparent)`
                        : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isActive ? item.color : 'rgba(255,255,255,0.1)'}`,
                      boxShadow: isActive 
                        ? `0 0 25px ${item.color}40, inset 0 0 15px ${item.color}20`
                        : '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    {/* Holographic scan line effect */}
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)`,
                        transform: `translateX(${-100 + (pulseAnimation + index * 60) % 200}%)`,
                        transition: 'transform 0.1s ease-out'
                      }}
                    />
                    
                    <div className="relative flex items-center space-x-3">
                      <Icon 
                        className="w-5 h-5 transition-all duration-300 group-hover:scale-110"
                        style={{
                          color: isActive ? item.color : '#a0a0a0',
                          filter: isActive ? `drop-shadow(0 0 8px ${item.color})` : 'none'
                        }}
                      />
                      <span 
                        className="text-sm font-medium tracking-wide transition-all duration-300"
                        style={{
                          color: isActive ? '#ffffff' : '#a0a0a0',
                          textShadow: isActive ? `0 0 8px ${item.color}40` : 'none'
                        }}
                      >
                        {item.label}
                      </span>
                    </div>

                    {/* Quantum resonance indicator */}
                    {isActive && (
                      <div 
                        className="absolute bottom-0 left-1/2 w-8 h-0.5 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                          transform: 'translateX(-50%)',
                          boxShadow: `0 0 10px ${item.color}`
                        }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Consciousness level indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <div 
                className="text-xs font-mono tracking-wider"
                style={{ color: '#a0a0a0' }}
              >
                CONSCIOUSNESS
              </div>
              <div 
                className="text-sm font-bold"
                style={{ 
                  color: '#00d4ff',
                  textShadow: '0 0 8px #00d4ff40'
                }}
              >
                {consciousnessLevel.toFixed(1)}%
              </div>
            </div>
            
            {/* Neural activity visualization */}
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-6 rounded-full transition-all duration-300"
                  style={{
                    background: 'linear-gradient(to top, #00d4ff20, #00d4ff)',
                    height: `${8 + Math.sin((pulseAnimation + i * 45) * Math.PI / 180) * 16}px`,
                    boxShadow: '0 0 8px #00d4ff60',
                    opacity: 0.6 + Math.sin((pulseAnimation + i * 30) * Math.PI / 180) * 0.4
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}