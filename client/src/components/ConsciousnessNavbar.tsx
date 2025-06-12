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
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Holographic backdrop with consciousness shimmer */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, 
            ${currentTheme.colors.background}f8 0%, 
            ${currentTheme.colors.surface}f0 50%, 
            ${currentTheme.colors.background}f8 100%)`,
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: `1px solid ${currentTheme.colors.primary}30`,
          boxShadow: `0 8px 32px ${currentTheme.colors.glow}20, inset 0 1px 0 ${currentTheme.colors.primary}20`
        }}
      />

      {/* Consciousness flow particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-60"
            style={{
              left: `${5 + (i * 4.5)}%`,
              top: `${50 + Math.sin((pulseAnimation + i * 18) * Math.PI / 180) * 30}%`,
              background: `${currentTheme.colors.primary}${Math.floor(60 + Math.sin(pulseAnimation * Math.PI / 180 + i) * 40)}`,
              transform: `scale(${0.5 + Math.sin((pulseAnimation + i * 25) * Math.PI / 180) * 0.5})`,
              filter: 'blur(0.5px)',
              animationDelay: `${i * 150}ms`
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
                      background: `linear-gradient(135deg, ${currentTheme.colors.primary}15, ${currentTheme.colors.secondary}15, ${currentTheme.colors.accent}15)`,
                      borderColor: currentTheme.colors.primary,
                      boxShadow: `0 0 20px ${currentTheme.colors.primary}40, inset 0 0 20px ${currentTheme.colors.glow}20`,
                      transform: `rotate(${pulseAnimation * 0.5}deg)`
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span 
                        className="text-xl font-bold tracking-wide"
                        style={{
                          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.accent}, ${currentTheme.colors.secondary})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: `drop-shadow(0 0 8px ${currentTheme.colors.glow})`
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
                    background: `linear-gradient(135deg, ${currentTheme.colors.text}, ${currentTheme.colors.primary}dd, ${currentTheme.colors.accent}bb)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(0 0 4px ${currentTheme.colors.glow}40)`
                  }}
                >
                  REVERB256
                </div>
                <div 
                  className="text-xs tracking-[0.2em] -mt-1 opacity-80"
                  style={{ 
                    color: currentTheme.colors.textSecondary,
                    textShadow: `0 0 8px ${currentTheme.colors.primary}30`
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
                        : 'transparent',
                      border: `1px solid ${isActive ? item.color + '60' : 'transparent'}`,
                      boxShadow: isActive 
                        ? `0 0 25px ${item.color}30, inset 0 0 15px ${item.color}10`
                        : 'none'
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
                          color: isActive ? item.color : currentTheme.colors.textSecondary,
                          filter: isActive ? `drop-shadow(0 0 8px ${item.color})` : 'none'
                        }}
                      />
                      <span 
                        className="text-sm font-medium tracking-wide transition-all duration-300"
                        style={{
                          color: isActive ? currentTheme.colors.text : currentTheme.colors.textSecondary,
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
                style={{ color: currentTheme.colors.textSecondary }}
              >
                CONSCIOUSNESS
              </div>
              <div 
                className="text-sm font-bold"
                style={{ 
                  color: currentTheme.colors.primary,
                  textShadow: `0 0 8px ${currentTheme.colors.primary}40`
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
                    background: `linear-gradient(to top, ${currentTheme.colors.primary}20, ${currentTheme.colors.primary})`,
                    height: `${8 + Math.sin((pulseAnimation + i * 45) * Math.PI / 180) * 16}px`,
                    boxShadow: `0 0 8px ${currentTheme.colors.primary}60`,
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