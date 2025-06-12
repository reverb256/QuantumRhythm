import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTheme } from '../hooks/useTheme';
import { Home, Archive, Zap } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/archive', label: 'Archive', icon: Archive },
  { href: '/nexus', label: 'Nexus', icon: Zap },
];

export default function SimplifiedNavigation() {
  const [location] = useLocation();
  const { currentTheme } = useTheme();
  const [starAnimation, setStarAnimation] = useState(0);
  const [rhythmPulse, setRhythmPulse] = useState(false);

  useEffect(() => {
    const starInterval = setInterval(() => {
      setStarAnimation(prev => (prev + 1) % 360);
    }, 50);

    const rhythmInterval = setInterval(() => {
      setRhythmPulse(prev => !prev);
    }, 800);

    return () => {
      clearInterval(starInterval);
      clearInterval(rhythmInterval);
    };
  }, []);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 outline-none focus:outline-none select-none"
      style={{
        background: '#000000',
        backdropFilter: 'blur(16px)',
        borderBottom: 'none'
      }}
    >
      
      {/* Animated constellation pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${(i * 8.33) + 5}%`,
              top: `${30 + Math.sin((starAnimation + i * 30) * Math.PI / 180) * 20}%`,
              animationDelay: `${i * 100}ms`,
              filter: 'blur(0.5px)',
              backgroundColor: `${currentTheme.colors.primary}60`
            }}
          />
        ))}
        
        {/* Energy lines */}
        <div className="absolute inset-0">
          <div 
            className="h-px"
            style={{
              top: '40%',
              transform: `translateX(${Math.sin(starAnimation * Math.PI / 180) * 20}px)`,
              filter: 'blur(1px)',
              background: `linear-gradient(90deg, transparent, ${currentTheme.colors.primary}60, transparent)`
            }}
          />
          <div 
            className="h-px"
            style={{
              top: '60%',
              transform: `translateX(${Math.cos(starAnimation * Math.PI / 180) * 15}px)`,
              filter: 'blur(1px)',
              background: `linear-gradient(90deg, transparent, ${currentTheme.colors.secondary}40, transparent)`
            }}
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <div className="w-10 h-10 relative">
                  <div 
                    className="absolute inset-0 rounded-lg backdrop-blur-sm border transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`,
                      borderColor: `${currentTheme.colors.border}60`,
                      boxShadow: `0 0 20px ${currentTheme.colors.glow}30`
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span 
                        className="text-lg font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
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
                  className="text-base font-bold tracking-wider"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.text}, ${currentTheme.colors.primary}cc, ${currentTheme.colors.accent}aa)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  REVERB256
                </div>
                <div 
                  className="text-xs tracking-[0.15em] -mt-0.5"
                  style={{ color: `${currentTheme.colors.textSecondary}cc` }}
                >
                  VibeCoding
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    className="relative px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer group"
                    style={{
                      background: isActive 
                        ? `linear-gradient(135deg, ${currentTheme.colors.primary}20, ${currentTheme.colors.secondary}20)`
                        : 'transparent',
                      borderColor: isActive ? `${currentTheme.colors.primary}40` : 'transparent'
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon 
                        className="w-4 h-4 transition-colors duration-300"
                        style={{
                          color: isActive 
                            ? currentTheme.colors.primary 
                            : currentTheme.colors.textSecondary
                        }}
                      />
                      <span 
                        className="text-sm font-medium tracking-wide transition-colors duration-300"
                        style={{
                          color: isActive 
                            ? currentTheme.colors.text 
                            : currentTheme.colors.textSecondary
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Consciousness indicator */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: rhythmPulse && i <= 2 
                      ? currentTheme.colors.primary 
                      : `${currentTheme.colors.textSecondary}40`,
                    boxShadow: rhythmPulse && i <= 2 
                      ? `0 0 8px ${currentTheme.colors.glow}` 
                      : 'none',
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
            <span 
              className="text-xs font-medium tracking-wider"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              CONSCIOUSNESS
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}