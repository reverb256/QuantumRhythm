import { Link, useLocation } from 'wouter';
import { Home, Brain, Code, TrendingUp, Zap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function SimplifiedNavigation() {
  const [location] = useLocation();
  const { currentTheme } = useTheme();

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
    },
    {
      path: '/consciousness',
      label: 'Consciousness',
      icon: Brain,
    },
    {
      path: '/portfolio',
      label: 'Portfolio',
      icon: Code,
    },
    {
      path: '/trading-hub',
      label: 'Trading',
      icon: TrendingUp,
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{ 
        backgroundColor: `${currentTheme.colors.background}CC`,
        borderColor: currentTheme.colors.border
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <Zap 
                  className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" 
                  style={{ color: currentTheme.colors.primary }}
                />
                <div 
                  className="absolute inset-0 w-8 h-8 rounded-full opacity-20 group-hover:opacity-40 blur-sm transition-opacity duration-300"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                />
              </div>
              <div>
                <span 
                  className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                  }}
                >
                  REVERB
                </span>
                <div className="text-xs -mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                  VIBECODING
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link key={item.path} href={item.path}>
                  <button 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      active 
                        ? 'scale-105 shadow-lg' 
                        : 'hover:scale-105 hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: active 
                        ? `${currentTheme.colors.primary}30`
                        : 'transparent',
                      color: active 
                        ? currentTheme.colors.primary
                        : currentTheme.colors.text,
                      border: active 
                        ? `1px solid ${currentTheme.colors.primary}50`
                        : `1px solid transparent`
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:block font-medium">{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}