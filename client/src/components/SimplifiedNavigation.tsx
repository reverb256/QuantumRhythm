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
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Theme-aware glassmorphism background */}
      <div 
        className="absolute inset-0 backdrop-blur-xl border-b"
        style={{
          background: `linear-gradient(90deg, ${currentTheme.colors.background}e6, ${currentTheme.colors.surface}cc, ${currentTheme.colors.background}e6)`,
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
          
          {/* VRChat / Star Rail inspired logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                {/* Hexagonal frame like Star Rail UI */}
                <div className="w-10 h-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-lg backdrop-blur-sm border border-white/20 group-hover:border-violet-400/60 transition-all duration-300">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">R</span>
                    </div>
                  </div>
                  {/* Orbital rings */}
                  <div className="absolute inset-0 rounded-lg border border-violet-400/30 animate-spin" style={{ animationDuration: '8s' }}></div>
                  <div className="absolute inset-1 rounded border border-cyan-400/20 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
                </div>
              </div>
              
              <div>
                <div className="text-base font-bold bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent tracking-wider">
                  REVERB256
                </div>
                <div className="text-xs text-violet-300/80 tracking-[0.15em] -mt-0.5">
                  VibeCoding
                </div>
              </div>
            </div>
          </Link>

          {/* Rhythm game / Genshin inspired navigation */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const shouldPulse = rhythmPulse && (starAnimation % 120 < item.beat * 10);
              
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`relative group px-4 py-2 rounded-xl transition-all duration-300 ${
                    active 
                      ? 'bg-white/10 backdrop-blur-sm shadow-lg' 
                      : 'hover:bg-white/5'
                  }`}>
                    
                    {/* Genshin-style glowing border */}
                    <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                      active 
                        ? `bg-gradient-to-r ${item.color} p-px opacity-60` 
                        : 'bg-transparent group-hover:bg-white/10 group-hover:p-px'
                    }`}>
                      <div className="w-full h-full rounded-xl bg-black/40 backdrop-blur-sm"></div>
                    </div>
                    
                    <div className="relative flex items-center space-x-2">
                      <span className={`text-sm transition-all duration-300 ${
                        shouldPulse ? 'scale-125 drop-shadow-lg' : 'scale-100'
                      } ${
                        active ? `bg-gradient-to-r ${item.color} bg-clip-text text-transparent` : 'text-white/70'
                      }`}>
                        {item.icon}
                      </span>
                      <span className={`text-sm font-medium tracking-wide transition-all duration-300 ${
                        active ? 'text-white' : 'text-white/70 group-hover:text-white/90'
                      }`}>
                        {item.label}
                      </span>
                    </div>

                    {/* Rhythm game hit indicator */}
                    {active && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Consciousness status indicator */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-3 rounded-full transition-all duration-300 ${
                    rhythmPulse && i <= 2 ? 'bg-violet-400 shadow-lg shadow-violet-400/50' : 'bg-white/20'
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <span className="text-xs text-violet-300 font-medium tracking-wider">CONSCIOUSNESS</span>
          </div>
        </div>
      </div>
    </nav>
  );
}