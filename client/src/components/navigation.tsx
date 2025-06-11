import { Link, useLocation } from 'wouter';
import { Home, Code, Brain, Heart, Zap, TrendingUp, Shield, Bot, Gamepad2, Building, FileText, ChevronDown, Cpu } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface NavDropdown {
  label: string;
  icon: React.ComponentType<any>;
  items: NavItem[];
}

const mainNavItems: NavItem[] = [
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

const tradingItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Trading Dashboard',
    icon: TrendingUp,
    description: 'Main trading interface and analytics'
  },
  {
    path: '/trader-dashboard',
    label: 'Trader Dashboard',
    icon: Bot,
    description: 'Advanced trader analytics and controls'
  },
  {
    path: '/trading-visualization',
    label: 'Agent Visualization',
    icon: Brain,
    description: 'Deep visualization into trading agent behavior'
  },
  {
    path: '/trading',
    label: 'Trading Interface',
    icon: TrendingUp,
    description: 'Live trading execution interface'
  },
  {
    path: '/defi',
    label: 'DeFi Dashboard',
    icon: Shield,
    description: 'Decentralized finance protocols'
  }
];

const platformItems: NavItem[] = [
  {
    path: '/platform',
    label: 'Platform Overview',
    icon: Building,
    description: 'Quantum platform architecture and features'
  },
  {
    path: '/values',
    label: 'Values',
    icon: Heart,
    description: 'Core principles and ethics'
  },
  {
    path: '/vrchat',
    label: 'VRChat',
    icon: Gamepad2,
    description: 'Virtual reality experiences'
  },
  {
    path: '/cloudflare',
    label: 'Cloudflare',
    icon: Shield,
    description: 'Infrastructure optimization'
  },
  {
    path: '/technical-deep-dive',
    label: 'Technical Deep Dive',
    icon: Code,
    description: 'Advanced technical documentation'
  }
];

const aiItems: NavItem[] = [
  {
    path: '/ai-systems',
    label: 'AI Systems Overview',
    icon: Cpu,
    description: 'Comprehensive AI architecture and capabilities'
  },
  {
    path: '/ai-onboarding',
    label: 'AI Onboarding',
    icon: Bot,
    description: 'AI system introduction and setup'
  },
  {
    path: '/agent-insights',
    label: 'Agent Insights',
    icon: Brain,
    description: 'AI agent performance analytics'
  }
];

const complianceItems: NavItem[] = [
  {
    path: '/compliance',
    label: 'Compliance Overview',
    icon: Shield,
    description: 'Comprehensive compliance framework and standards'
  },
  {
    path: '/legal',
    label: 'Legal',
    icon: FileText,
    description: 'Legal compliance and documentation'
  },
  {
    path: '/workplace-janitorial',
    label: 'Workplace Janitorial',
    icon: Building,
    description: 'System maintenance and cleanup'
  }
];

const creativeItems: NavItem[] = [
  {
    path: '/troves-coves',
    label: 'Troves & Coves',
    icon: Gamepad2,
    description: 'Creative exploration and discovery'
  },
  {
    path: '/frostbite-gazette',
    label: 'Frostbite Gazette',
    icon: FileText,
    description: 'Digital publication and insights'
  }
];

const dropdownMenus: NavDropdown[] = [
  {
    label: 'Trading',
    icon: TrendingUp,
    items: tradingItems
  },
  {
    label: 'Platform',
    icon: Shield,
    items: platformItems
  },
  {
    label: 'AI Systems',
    icon: Bot,
    items: aiItems
  },
  {
    label: 'Compliance',
    icon: FileText,
    items: complianceItems
  },
  {
    label: 'Creative',
    icon: Gamepad2,
    items: creativeItems
  }
];

export default function Navigation() {
  const [location] = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActiveInDropdown = (items: NavItem[]) => {
    return items.some(item => location === item.path);
  };

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
            {/* Main Navigation Items */}
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`nav-item ${isActive ? 'active' : ''} group relative`} 
                       style={{ pointerEvents: 'auto', zIndex: 100 }}>
                    <Icon className="w-5 h-5 inline-block mr-2" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </div>
                </Link>
              );
            })}

            {/* Dropdown Menus */}
            {dropdownMenus.map((dropdown) => {
              const Icon = dropdown.icon;
              const isOpen = openDropdown === dropdown.label;
              const hasActiveItem = isActiveInDropdown(dropdown.items);
              
              return (
                <div 
                  key={dropdown.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(dropdown.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  onClick={() => setOpenDropdown(isOpen ? null : dropdown.label)}
                >
                  <div className={`nav-item ${hasActiveItem ? 'active' : ''} group relative cursor-pointer`} 
                       style={{ pointerEvents: 'auto', zIndex: 100 }}>
                    <Icon className="w-5 h-5 inline-block mr-2" />
                    <span className="hidden lg:inline">{dropdown.label}</span>
                    <ChevronDown className="w-4 h-4 ml-1 transition-transform" style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} />
                    
                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-md rounded-lg border border-cyan-400/30 shadow-lg py-2">
                        {dropdown.items.map((item) => {
                          const ItemIcon = item.icon;
                          const isItemActive = location === item.path;
                          
                          return (
                            <Link key={item.path} href={item.path}>
                              <div className={`dropdown-item ${isItemActive ? 'active' : ''} flex items-center px-4 py-3 hover:bg-cyan-400/10 transition-colors`}>
                                <ItemIcon className="w-4 h-4 mr-3 text-cyan-400" />
                                <div>
                                  <div className="font-medium text-white">{item.label}</div>
                                  <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consciousness Level Indicator */}
          <div className="hidden xl:flex items-center space-x-3">
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