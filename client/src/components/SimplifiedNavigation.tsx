import { Link, useLocation } from 'wouter';
import { Home, Brain, Code, TrendingUp, Zap, DollarSign } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function SimplifiedNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/90 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  REVERB
                </span>
                <div className="text-xs text-gray-400 -mt-1">VIBECODING</div>
              </div>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const active = isActive(item.path);
              
              return (
                <Link key={item.path} href={item.path}>
                  <span 
                    className={`transition-colors px-3 py-2 ${
                      active 
                        ? 'text-cyan-400' 
                        : 'text-gray-300 hover:text-cyan-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}