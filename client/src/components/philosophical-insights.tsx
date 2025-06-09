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
    id: "socratic-beginning",
    quote: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    context: "Beginning the journey of conscious exploration",
    triggerSection: "hero",
    delay: 2000,
    position: "top-right"
  },
  {
    id: "aristotelian-identity",
    quote: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle",
    context: "Understanding the architect behind the code",
    triggerSection: "about",
    delay: 1500,
    position: "bottom-left"
  },
  {
    id: "platonic-forms",
    quote: "Every heart sings a song, incomplete, until another heart whispers back.",
    author: "Plato",
    context: "Creating connections through digital manifestations",
    triggerSection: "projects",
    delay: 2500,
    position: "top-left"
  },
  {
    id: "stoic-mastery",
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    context: "Mastering tools and technologies with inner discipline",
    triggerSection: "skills",
    delay: 1800,
    position: "bottom-right"
  },
  {
    id: "heraclitean-flow",
    quote: "No man ever steps in the same river twice, for it's not the same river and he's not the same man.",
    author: "Heraclitus",
    context: "Embracing the eternal flux of learning and growth",
    triggerSection: "philosophy",
    delay: 2200,
    position: "top-right"
  },
  {
    id: "gaming-wisdom",
    quote: "In play there are two pleasures for your choosing - the one is winning, and the other losing.",
    author: "Lord Byron",
    context: "Finding wisdom in virtual worlds and digital experiences",
    triggerSection: "gaming",
    delay: 1600,
    position: "bottom-left"
  },
  {
    id: "connection-wisdom",
    quote: "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.",
    author: "Carl Jung",
    context: "Bridging consciousness across digital and physical realms",
    triggerSection: "contact",
    delay: 2000,
    position: "top-left"
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
  
  useEffect(() => {
    const handleScroll = () => {
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
              if (!insights[insight.id]?.hasTriggered) {
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
  }, [currentSection, insights]);

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
                {/* Floating particles around the insight */}
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 3}s`
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
                  <p className="text-cyan-200/80 text-xs italic">
                    {insight.context}
                  </p>
                </div>

                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-lg"></div>
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
  );
}