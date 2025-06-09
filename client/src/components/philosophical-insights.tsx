import { useState, useEffect } from "react";

interface PhilosophicalInsight {
  id: string;
  quote: string;
  author: string;
  context: string;
  triggerSection: string;
  delay: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const philosophicalInsights: PhilosophicalInsight[] = [
  {
    id: "hero-introduction",
    quote: "The unexamined life is not worth living, but the unexamined code destroys production.",
    author: "Digital Socrates",
    context: "Every developer's journey begins with questioning assumptions",
    triggerSection: "hero",
    delay: 2000,
    position: "top-right"
  },
  {
    id: "about-identity",
    quote: "Man is by nature a social animal, and debugging is a fundamentally collaborative act.",
    author: "Aristotle (Developer Edition)",
    context: "Understanding yourself as both architect and artifact",
    triggerSection: "about",
    delay: 1500,
    position: "bottom-left"
  },
  {
    id: "projects-manifestation",
    quote: "The cave allegory applies perfectly to software: users see only shadows of what developers build in the light.",
    author: "Plato",
    context: "Each project reflects deeper truths about human needs",
    triggerSection: "projects",
    delay: 2500,
    position: "top-left"
  },
  {
    id: "skills-mastery",
    quote: "Excellence is not an act, but a habit. We are what we repeatedly deploy.",
    author: "Aristotle",
    context: "Technical mastery emerges from disciplined practice",
    triggerSection: "skills",
    delay: 1800,
    position: "bottom-right"
  },
  {
    id: "philosophy-integration",
    quote: "The philosopher's task is not to describe the world, but to debug it.",
    author: "Karl Marx (Refactored)",
    context: "Classical wisdom debugging modern complexity",
    triggerSection: "philosophy",
    delay: 2200,
    position: "top-right"
  },
  {
    id: "gaming-research",
    quote: "In virtual worlds, we discover the authentic rules governing real consciousness.",
    author: "Huizinga (VR Extension)",
    context: "8,500+ hours of systematic consciousness exploration",
    triggerSection: "gaming",
    delay: 1600,
    position: "bottom-left"
  },
  {
    id: "contact-connection",
    quote: "True dialogue occurs when two GitHub profiles merge without conflicts.",
    author: "Martin Buber (Git Edition)",
    context: "Professional relationships as conscious collaboration",
    triggerSection: "contact",
    delay: 2000,
    position: "top-left"
  },
  {
    id: "vibecoding-methodology",
    quote: "When ancient wisdom meets modern infrastructure, consciousness bootstraps itself.",
    author: "VibeCoding Constitution",
    context: "Philosophical programming methodology in practice",
    triggerSection: "hero",
    delay: 4000,
    position: "bottom-right"
  },
  {
    id: "infrastructure-consciousness",
    quote: "A 4-node Proxmox cluster is a meditation on distributed consciousness.",
    author: "Infrastructure Zen Master",
    context: "Ryzen 9 5950X, 3900X, i5-9500, R7 1700 in philosophical harmony",
    triggerSection: "skills",
    delay: 3500,
    position: "top-left"
  },
  {
    id: "react-philosophy",
    quote: "React hooks are Plato's forms made executable - pure functions returning impure reality.",
    author: "Frontend Philosopher",
    context: "TypeScript + React + Tailwind CSS + shadcn/ui component philosophy",
    triggerSection: "projects",
    delay: 4200,
    position: "bottom-right"
  },
  {
    id: "vrchat-consciousness",
    quote: "4,320 hours in VRChat taught me more about human nature than any philosophy textbook.",
    author: "Digital Anthropologist",
    context: "Virtual reality as consciousness research laboratory",
    triggerSection: "gaming",
    delay: 2800,
    position: "top-right"
  },
  {
    id: "fighting-game-precision",
    quote: "Frame data analysis is applied Stoicism - control the inputs, accept the outcomes.",
    author: "FGC Philosopher",
    context: "2,890+ hours of competitive gaming informing 60fps web optimization",
    triggerSection: "skills",
    delay: 5000,
    position: "bottom-left"
  },
  {
    id: "canadian-values",
    quote: "Charter Section 2(b) in code: every function should have the freedom to express its purpose clearly.",
    author: "Constitutional Programmer",
    context: "Democratic values embedded in technology architecture",
    triggerSection: "philosophy",
    delay: 3800,
    position: "bottom-left"
  }
];

interface InsightState {
  isVisible: boolean;
  hasTriggered: boolean;
  timestamp: number;
}

export default function PhilosophicalInsights() {
  const [insights, setInsights] = useState<Record<string, InsightState>>({});
  const [currentSection, setCurrentSection] = useState<string>('');
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [wisdomEnabled, setWisdomEnabled] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);

  // Handle navigation clicks to prevent insights during menu navigation
  useEffect(() => {
    const handleNavigationClick = () => {
      setIsNavigating(true);
      setTimeout(() => setIsNavigating(false), 1500); // Block insights for 1.5 seconds after navigation
    };

    // Listen for navigation clicks
    const navLinks = document.querySelectorAll('nav a, [href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', handleNavigationClick);
    });

    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', handleNavigationClick);
      });
    };
  }, []);
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const now = Date.now();
      const currentScrollY = window.scrollY;
      
      // Calculate scroll velocity
      const timeDelta = now - lastScrollTime;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      const velocity = timeDelta > 0 ? scrollDelta / timeDelta : 0;
      
      setScrollVelocity(velocity);
      setLastScrollTime(now);
      lastScrollY = currentScrollY;
      
      // Don't trigger insights if navigating or scrolling too fast (velocity > 2)
      if (isNavigating || velocity > 2) {
        return;
      }
      
      const sections = ['hero', 'about', 'projects', 'skills', 'philosophy', 'gaming', 'contact'];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.2;
          
          if (isInView && currentSection !== sectionId) {
            setCurrentSection(sectionId);
            
            // Find insights for this section
            const sectionInsights = philosophicalInsights.filter(
              insight => insight.triggerSection === sectionId
            );
            
            sectionInsights.forEach(insight => {
              if (!insights[insight.id]?.hasTriggered && wisdomEnabled) {
                setTimeout(() => {
                  setInsights(prev => ({
                    ...prev,
                    [insight.id]: {
                      isVisible: true,
                      hasTriggered: true,
                      timestamp: Date.now()
                    }
                  }));
                  
                  // Auto-hide after 8 seconds
                  setTimeout(() => {
                    setInsights(prev => ({
                      ...prev,
                      [insight.id]: {
                        ...prev[insight.id],
                        isVisible: false
                      }
                    }));
                  }, 8000);
                }, insight.delay);
              }
            });
            
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [wisdomEnabled, isNavigating, lastScrollTime]);

  const getPositionStyles = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-20 left-6';
      case 'top-right':
        return 'top-20 right-6';
      case 'bottom-left':
        return 'bottom-20 left-6';
      case 'bottom-right':
        return 'bottom-20 right-6';
      default:
        return 'top-20 right-6';
    }
  };

  return (
    <>
      {/* Floating Wisdom Control Panel */}
      <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-40 pointer-events-auto">
        <div className="flex flex-col space-y-2">
          {/* Main wisdom toggle */}
          <button
            onClick={() => setWisdomEnabled(!wisdomEnabled)}
            className={`w-12 h-12 rounded-full border-2 backdrop-blur-sm transition-all duration-300 ${
              wisdomEnabled 
                ? 'bg-cyan-400/20 border-cyan-400/50 text-cyan-300' 
                : 'bg-gray-600/20 border-gray-500/50 text-gray-400'
            } hover:scale-110 hover:shadow-lg hover:shadow-cyan-400/20`}
            title={wisdomEnabled ? "Disable philosophical insights" : "Enable philosophical insights"}
          >
            <i className="fas fa-lightbulb text-sm"></i>
          </button>
          
          {/* Archive toggle */}
          <button
            onClick={() => setIsArchiveOpen(!isArchiveOpen)}
            className="w-10 h-10 rounded-full bg-purple-400/20 border-2 border-purple-400/50 text-purple-300 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/20"
            title="View wisdom archive"
          >
            <i className="fas fa-scroll text-xs"></i>
          </button>
        </div>
      </div>

      {/* Wisdom Archive Panel */}
      {isArchiveOpen && (
        <div className="fixed top-20 left-4 w-80 max-h-96 overflow-y-auto z-35 pointer-events-auto">
          <div className="prismatic-glass rounded-lg border border-purple-400/30 p-4 backdrop-blur-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-purple-300 font-semibold text-sm">Wisdom Archive</h3>
              <button
                onClick={() => setIsArchiveOpen(false)}
                className="text-purple-400/60 hover:text-purple-300 transition-colors"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {philosophicalInsights.map(insight => {
                const state = insights[insight.id];
                return (
                  <div
                    key={insight.id}
                    className={`p-3 rounded border transition-all duration-200 cursor-pointer ${
                      state?.hasTriggered 
                        ? 'bg-purple-400/10 border-purple-400/30' 
                        : 'bg-gray-600/10 border-gray-500/30'
                    } hover:bg-purple-400/20`}
                    onClick={() => {
                      if (!state?.isVisible) {
                        setInsights(prev => ({
                          ...prev,
                          [insight.id]: {
                            isVisible: true,
                            hasTriggered: true,
                            timestamp: Date.now()
                          }
                        }));
                        setTimeout(() => {
                          setInsights(prev => ({
                            ...prev,
                            [insight.id]: {
                              ...prev[insight.id],
                              isVisible: false
                            }
                          }));
                        }, 8000);
                      }
                    }}
                  >
                    <div className="text-xs text-purple-200 mb-1">"{insight.quote}"</div>
                    <div className="text-xs text-purple-300/80">— {insight.author}</div>
                    <div className="text-xs text-purple-400/60 mt-1 capitalize">{insight.triggerSection}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Insights Display */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {philosophicalInsights.map(insight => {
          const state = insights[insight.id];
          if (!state?.isVisible) return null;

        return (
          <div
            key={insight.id}
            className={`absolute ${getPositionStyles(insight.position)} max-w-sm pointer-events-auto philosophical-insight ${
              state.isVisible 
                ? 'animate-[gentle-reveal_1s_ease-out_forwards]' 
                : 'animate-[gentle-fade-out_0.5s_ease-in_forwards]'
            }`}
          >
            <div className="relative">
              {/* Philosophical insight card */}
              <div className="prismatic-glass rounded-lg border border-cyan-400/30 p-6 backdrop-blur-lg">
                {/* Enhanced floating particles around the insight */}
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${2 + Math.random() * 3}px`,
                        height: `${2 + Math.random() * 3}px`,
                        background: i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#a855f7' : '#10b981',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `wisdom-particle-float ${3 + Math.random() * 2}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 4}s`
                      }}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Quote */}
                  <blockquote className="text-cyan-100 text-sm leading-relaxed mb-3 font-medium">
                    "{insight.quote}"
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center justify-between mb-2">
                    <cite className="text-cyan-300 text-xs font-semibold not-italic">
                      — {insight.author}
                    </cite>
                    <div className="w-8 h-px bg-gradient-to-r from-cyan-400 to-transparent"></div>
                  </div>
                  
                  {/* Context */}
                  <p className="text-cyan-200/80 text-xs italic mb-3">
                    {insight.context}
                  </p>

                  {/* Interactive controls */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-cyan-400/20">
                    <button
                      onClick={() => {
                        setInsights(prev => ({
                          ...prev,
                          [insight.id]: {
                            ...prev[insight.id],
                            isVisible: false
                          }
                        }));
                      }}
                      className="text-cyan-400/60 hover:text-cyan-300 transition-colors duration-200 text-xs"
                      title="Dismiss insight"
                    >
                      <i className="fas fa-times mr-1"></i>
                      Dismiss
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          // Replay animation
                          setInsights(prev => ({
                            ...prev,
                            [insight.id]: {
                              ...prev[insight.id],
                              isVisible: false
                            }
                          }));
                          setTimeout(() => {
                            setInsights(prev => ({
                              ...prev,
                              [insight.id]: {
                                ...prev[insight.id],
                                isVisible: true
                              }
                            }));
                          }, 100);
                        }}
                        className="text-cyan-400/60 hover:text-cyan-300 transition-colors duration-200 text-xs"
                        title="Replay insight"
                      >
                        <i className="fas fa-redo-alt"></i>
                      </button>
                      
                      <div className="w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Enhanced glow effect with pulse */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-lg animate-[insight-glow-pulse_3s_ease-in-out_infinite]"></div>
              </div>

              {/* Connecting line to suggest flow */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-px h-8 bg-gradient-to-b from-cyan-400/50 to-transparent"></div>
              </div>
            </div>
          </div>
        );
        })}
      </div>
    </>
  );
}