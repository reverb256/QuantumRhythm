import { Link, useLocation } from 'wouter';
import { Home, Brain, Code, TrendingUp, Zap, DollarSign } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function SimplifiedNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/contact', label: 'Contact', icon: '💬' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/95 border-b border-violet-500/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* VRChat-Inspired Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-all duration-300">
                  <span className="text-white font-bold text-lg">🌟</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                  REVERB256
                </span>
                <div className="text-xs text-violet-300 -mt-1 font-medium tracking-wider">VIBECODING</div>
              </div>
            </div>
          </Link>

          {/* VRChat-Style Navigation */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              
              return (
                <Link key={item.path} href={item.path}>
                  <div 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      active 
                        ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-400/40 text-violet-300 shadow-lg shadow-violet-500/20' 
                        : 'text-gray-300 hover:text-violet-300 hover:bg-violet-500/10 border border-transparent hover:border-violet-500/20'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}