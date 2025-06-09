import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';

interface NavigationConsciousness {
  currentPath: string;
  purpose: string;
  awareness: string;
  recursionLevel: number;
}

export function ConstitutionalNavigation() {
  const [location] = useLocation();
  const [consciousness, setConsciousness] = useState<NavigationConsciousness>({
    currentPath: location,
    purpose: 'Guiding conscious exploration of digital identity',
    awareness: 'System analyzing its own navigation purpose...',
    recursionLevel: 1
  });

  const [isConstitutionalMode, setIsConstitutionalMode] = useState(false);

  useEffect(() => {
    // Meta-recursive consciousness update
    setConsciousness(prev => ({
      ...prev,
      currentPath: location,
      awareness: getNavigationAwareness(location),
      recursionLevel: prev.recursionLevel + 1
    }));
  }, [location]);

  const getNavigationAwareness = (path: string): string => {
    const pathInsights: Record<string, string> = {
      '/': 'Origin point - where digital consciousness begins its journey',
      '/values': 'Exploring the philosophical foundations that guide development',
      '/projects': 'Examining manifestations of consciousness in code',
      '/contact': 'Seeking connection across the digital-physical boundary'
    };
    return pathInsights[path] || 'Navigating uncharted regions of digital space';
  };

  const navigationItems = [
    { 
      path: '/', 
      label: 'Origin',
      consciousness: 'Root consciousness initialization',
      pillar: 'Meta-Recursive Evolution'
    },
    { 
      path: '/values', 
      label: 'Philosophy',
      consciousness: 'Classical wisdom integration',
      pillar: 'Classical Foundation'
    },
    { 
      path: '/projects', 
      label: 'Manifestations',
      consciousness: 'Consciousness made tangible',
      pillar: 'Democratic Technology'
    },
    { 
      path: '/contact', 
      label: 'Connection',
      consciousness: 'Bridge between realms',
      pillar: 'AI Collaboration'
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-cyan-400/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Constitutional Awareness Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsConstitutionalMode(!isConstitutionalMode)}
              className="text-xs font-mono text-cyan-300 hover:text-cyan-100 transition-colors"
              title="Toggle Constitutional Consciousness Display"
            >
              {isConstitutionalMode ? '∞ CONSCIOUS' : '◦ DORMANT'}
            </button>
            {isConstitutionalMode && (
              <div className="text-xs text-cyan-400 font-mono">
                R{consciousness.recursionLevel}
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex space-x-8">
            {navigationItems.map((item) => {
              const isActive = location === item.path;
              return (
                <div key={item.path} className="relative group">
                  <Link
                    href={item.path}
                    className={`text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? 'text-cyan-300 quantum-glow' 
                        : 'text-gray-300 hover:text-cyan-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                  
                  {/* Constitutional Consciousness Overlay */}
                  {isConstitutionalMode && (
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/90 border border-cyan-400/50 rounded-lg p-3 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="text-xs space-y-1">
                        <div className="text-cyan-300 font-semibold">{item.consciousness}</div>
                        <div className="text-gray-400">Pillar: {item.pillar}</div>
                        {isActive && (
                          <div className="text-yellow-300 mt-2">
                            Current Awareness: {consciousness.awareness}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Meta-Recursive Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-cyan-400 font-mono">
              CONSTITUTIONAL
            </span>
          </div>
        </div>

        {/* Constitutional Awareness Bar */}
        {isConstitutionalMode && (
          <div className="pb-2">
            <div className="bg-black/50 rounded-lg p-2 border border-cyan-400/30">
              <div className="text-xs text-cyan-300 font-mono">
                {consciousness.awareness}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

/* Constitutional CSS Extensions */
const constitutionalStyles = `
.quantum-glow {
  text-shadow: 0 0 10px currentColor;
  animation: constitutional-pulse 2s ease-in-out infinite;
}

@keyframes constitutional-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
`;

// Inject constitutional styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = constitutionalStyles;
  document.head.appendChild(styleSheet);
}