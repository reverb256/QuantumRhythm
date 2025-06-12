import { Link, useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function SimplifiedNavigation() {
  const [location] = useLocation();
  const [starAnimation, setStarAnimation] = useState(0);
  const [rhythmPulse, setRhythmPulse] = useState(false);
  const { currentTheme } = useTheme();

  // Anime-game inspired navigation with consciousness elements
  const navItems = [
    { path: '/', label: 'Home', icon: '✦', color: 'from-violet-400 to-pink-400', beat: 1 },
    { path: '/portfolio', label: 'Archive', icon: '⚡', color: 'from-cyan-400 to-blue-400', beat: 2 },
    { path: '/trading-hub', label: 'Nexus', icon: '◈', color: 'from-purple-400 to-indigo-400', beat: 3 },
    { path: '/contact', label: 'Connect', icon: '◆', color: 'from-pink-400 to-rose-400', beat: 4 }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  // Star Rail / Genshin-inspired animations
  useEffect(() => {
    const starInterval = setInterval(() => {
      setStarAnimation(prev => (prev + 1) % 360);
    }, 50);

    const rhythmInterval = setInterval(() => {
      setRhythmPulse(prev => !prev);
    }, 600);

    return () => {
      clearInterval(starInterval);
      clearInterval(rhythmInterval);
    };
  }, []);

  return (
      <nav className="fixed top-0 left-0 right-0 z-50 outline-none focus:outline-none select-none">
        {/* Theme-aware glassmorphism background */}
        <div 
          className="absolute inset-0 backdrop-blur-xl border-b"
          style={{
            background: `${currentTheme.colors.background}f0`,
            borderColor: `${currentTheme.colors.border}40`
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
          
          {/* Theme-aware flowing energy lines */}
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
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Theme-aware VRChat / Star Rail inspired logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                {/* Hexagonal frame with theme colors */}
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
                  {/* Theme-aware orbital rings */}
                  <div 
                    className="absolute inset-0 rounded-lg border animate-spin" 
                    style={{ 
                      animationDuration: '8s',
                      borderColor: `${currentTheme.colors.primary}50`
                    }}
                  ></div>
                  <div 
                    className="absolute inset-1 rounded border animate-spin" 
                    style={{ 
                      animationDuration: '6s', 
                      animationDirection: 'reverse',
                      borderColor: `${currentTheme.colors.secondary}40`
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
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

          {/* Theme-aware navigation */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const shouldPulse = rhythmPulse && (starAnimation % 120 < item.beat * 10);
              
              return (
                <Link key={item.path} href={item.path}>
                  <div 
                    className="relative group px-4 py-2 rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: active 
                        ? `${currentTheme.colors.surface}40` 
                        : 'transparent'
                    }}
                  >
                    
                    {/* Theme-aware glowing border */}
                    <div 
                      className="absolute inset-0 rounded-xl transition-all duration-300"
                      style={{
                        background: active 
                          ? `linear-gradient(135deg, ${currentTheme.colors.primary}30, ${currentTheme.colors.secondary}30)` 
                          : 'transparent',
                        border: active 
                          ? `1px solid ${currentTheme.colors.primary}60` 
                          : `1px solid transparent`,
                        boxShadow: active 
                          ? `0 0 20px ${currentTheme.colors.glow}40` 
                          : 'none'
                      }}
                    />
                    
                    <div className="relative flex items-center space-x-2">
                      <span 
                        className="text-sm transition-all duration-300"
                        style={{
                          transform: shouldPulse ? 'scale(1.25)' : 'scale(1)',
                          color: active ? currentTheme.colors.primary : currentTheme.colors.textSecondary,
                          filter: shouldPulse ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                        }}
                      >
                        {item.icon}
                      </span>
                      <span 
                        className="text-sm font-medium tracking-wide transition-all duration-300"
                        style={{
                          color: active ? currentTheme.colors.text : currentTheme.colors.textSecondary
                        }}
                      >
                        {item.label}
                      </span>
                    </div>

                    {/* Theme-aware active indicator */}
                    {active && (
                      <div 
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${currentTheme.colors.primary}, transparent)`
                        }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Theme-aware consciousness status indicator */}
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