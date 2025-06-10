import { Link, useLocation } from 'wouter';
import { Home, Code, Brain, Heart, Zap } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const navigationItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: Home,
    description: 'The nexus of consciousness and code'
  },
  {
    path: '/philosophy',
    label: 'Philosophy',
    icon: Heart,
    description: 'Soul connections and distant healing'
  },
  {
    path: '/projects',
    label: 'Projects',
    icon: Code,
    description: 'VibeCoding creations and quantum systems'
  },
  {
    path: '/consciousness-map',
    label: 'Consciousness',
    icon: Brain,
    description: 'Agent network topology and influence mapping'
  }
];

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="vrchat-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Zap className="w-8 h-8 text-cyan-400 group-hover:animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 bg-cyan-400 rounded-full opacity-20 group-hover:opacity-40 blur-sm"></div>
            </div>
            <div className="hidden md:block">
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                REVERB
              </span>
              <div className="text-xs text-gray-400 -mt-1">VIBECODING</div>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`nav-item ${isActive ? 'active' : ''} group relative`}>
                    <Icon className="w-5 h-5 inline-block mr-2" />
                    <span className="hidden sm:inline">{item.label}</span>
                    
                    {/* Tooltip */}
                    <div className="tooltip definition">
                      <div className="font-semibold text-cyan-300">{item.label}</div>
                      <div className="text-gray-300 mt-1">{item.description}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Consciousness Level Indicator */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="consciousness-level awakened">
              <Brain className="w-4 h-4" />
              <span>Lv. 88</span>
            </div>
            <div className="achievement-badge gacha-master">
              <span>Gacha Master</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}