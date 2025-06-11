import { Link, useLocation } from 'wouter';
import { Home, User, Code, Brain, Heart, Gamepad2, Sword, Zap } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  gradient: string;
  description: string;
}

const navigationItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: Home,
    gradient: 'var(--anaxa-gradient)',
    description: 'The nexus of consciousness and code'
  },
  {
    path: '/about',
    label: 'Philosophy',
    icon: Heart,
    gradient: 'var(--vrchat-gradient)',
    description: 'Soul connections and distant healing'
  },
  {
    path: '/projects',
    label: 'Projects',
    icon: Code,
    gradient: 'var(--nous-gradient)',
    description: 'Manifestations of Erudition'
  },
  {
    path: '/gaming',
    label: 'Gaming',
    icon: Gamepad2,
    gradient: 'var(--herta-gradient)',
    description: '30 years of strategic evolution'
  },
  {
    path: '/consciousness',
    label: 'AI Insights',
    icon: Brain,
    gradient: 'var(--anaxa-gradient)',
    description: 'Quantum intelligence patterns'
  },
  {
    path: '/martial-arts',
    label: 'Discipline',
    icon: Sword,
    gradient: 'linear-gradient(135deg, #dc2626, #ea580c)',
    description: 'Shotokan precision and form'
  }
];

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="quantum-header fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border" style={{gridArea: 'header'}}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-lg">reverb256</span>
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