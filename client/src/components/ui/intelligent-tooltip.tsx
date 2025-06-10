import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipData {
  term: string;
  category: 'tech' | 'concept' | 'humor' | 'gaming' | 'error' | 'loading' | 'deprecated' | 'success';
  definition: string;
  context?: string;
  relatedTerms?: string[];
  funFact?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface IntelligentTooltipProps {
  children: React.ReactNode;
  tooltipData: TooltipData;
  className?: string;
}

const tooltipDatabase: Record<string, TooltipData> = {
  'React 18': {
    term: 'React 18',
    category: 'tech',
    definition: 'The latest version of React with concurrent features, automatic batching, and Suspense improvements.',
    context: 'Modern frontend framework for building user interfaces',
    relatedTerms: ['JSX', 'Hooks', 'Virtual DOM'],
    funFact: 'React 18 introduced the "concurrent renderer" which can pause and resume work',
    difficulty: 'intermediate'
  },
  'VibeCoding': {
    term: 'VibeCoding',
    category: 'concept',
    definition: 'A philosophical development methodology that balances technical excellence with conscious intention and authentic expression.',
    context: 'Personal development philosophy',
    relatedTerms: ['Consciousness Architecture', 'Quantum Development'],
    funFact: 'Named after the "vibe" or energy flow in coding sessions',
    difficulty: 'advanced'
  },
  'Glassmorphism': {
    term: 'Glassmorphism',
    category: 'tech',
    definition: 'A UI design trend featuring semi-transparent backgrounds with blur effects, creating a frosted glass appearance.',
    context: 'Modern UI/UX design technique',
    relatedTerms: ['Backdrop Filter', 'CSS Effects', 'Neumorphism'],
    funFact: 'Popularized by Apple\'s iOS and macOS design language',
    difficulty: 'beginner'
  },
  'Proxmox': {
    term: 'Proxmox VE',
    category: 'tech',
    definition: 'Open-source virtualization management platform combining KVM hypervisor and LXC containers.',
    context: 'Enterprise infrastructure management',
    relatedTerms: ['Virtualization', 'Hypervisor', 'Container'],
    funFact: 'Can manage hundreds of VMs from a single web interface',
    difficulty: 'expert'
  },
  'Quantum Algorithms': {
    term: 'Quantum Algorithms',
    category: 'concept',
    definition: 'Theoretical computational approaches inspired by quantum mechanics principles for problem-solving.',
    context: 'Advanced computational theory',
    relatedTerms: ['Superposition', 'Entanglement', 'Quantum Computing'],
    funFact: 'Currently more philosophical than practical in most applications',
    difficulty: 'expert'
  },
  'hover-glitch': {
    term: 'Glitch Effect',
    category: 'humor',
    definition: 'A cyberpunk-inspired visual effect that simulates digital corruption or interference.',
    context: 'Fun CSS animation effect',
    relatedTerms: ['Cyberpunk', 'Digital Distortion', 'Easter Egg'],
    funFact: 'Inspired by old CRT monitor glitches and sci-fi aesthetics',
    difficulty: 'beginner'
  },
  'hover-syntax-error': {
    term: 'Syntax Error',
    category: 'error',
    definition: 'Programming humor referencing code that doesn\'t follow language rules.',
    context: 'Developer humor and easter eggs',
    relatedTerms: ['Debugging', 'Compilation Error', 'Code Review'],
    funFact: 'Every developer\'s least favorite friend',
    difficulty: 'beginner'
  },
  'hover-404': {
    term: '404 Not Found',
    category: 'error',
    definition: 'HTTP status code indicating a requested resource couldn\'t be found on the server.',
    context: 'Web development error code',
    relatedTerms: ['HTTP Status', 'Server Response', 'Web Protocol'],
    funFact: 'Named after room 404 at CERN where the original web was created',
    difficulty: 'beginner'
  },
  'hover-deprecated': {
    term: 'Deprecated',
    category: 'deprecated',
    definition: 'Software feature marked as obsolete and scheduled for removal in future versions.',
    context: 'Software lifecycle management',
    relatedTerms: ['Legacy Code', 'Migration', 'Version Control'],
    funFact: 'From Latin "deprecari" meaning "to pray against"',
    difficulty: 'intermediate'
  },
  'hover-loading': {
    term: 'Loading State',
    category: 'loading',
    definition: 'UI state indicating that data or resources are being fetched or processed.',
    context: 'User experience design',
    relatedTerms: ['Async Operations', 'State Management', 'UX Design'],
    funFact: 'Good loading states can make apps feel faster than they actually are',
    difficulty: 'beginner'
  }
};

export function IntelligentTooltip({ children, tooltipData, className = '' }: IntelligentTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getCategoryColor = (category: TooltipData['category']) => {
    const colors = {
      tech: 'from-cyan-400 to-blue-400',
      concept: 'from-violet-400 to-purple-400', 
      humor: 'from-amber-400 to-yellow-400',
      gaming: 'from-emerald-400 to-green-400',
      error: 'from-red-400 to-rose-400',
      loading: 'from-blue-400 to-indigo-400',
      deprecated: 'from-gray-400 to-slate-400',
      success: 'from-green-400 to-emerald-400'
    };
    return colors[category];
  };

  const getDifficultyIcon = (difficulty?: string) => {
    const icons = {
      beginner: '🌱',
      intermediate: '⚡',
      advanced: '🔥',
      expert: '💎'
    };
    return difficulty ? icons[difficulty as keyof typeof icons] : '💫';
  };

  useEffect(() => {
    const updatePosition = () => {
      if (triggerRef.current && isVisible) {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let x = rect.left + rect.width / 2;
        let y = rect.top - 10;
        
        // For navigation items, show tooltip below to avoid clipping
        if (rect.top < 100) {
          y = rect.bottom + 10;
        }
        
        // Prevent horizontal overflow
        const tooltipWidth = 320; // Fixed width assumption
        if (x - tooltipWidth / 2 < 20) {
          x = tooltipWidth / 2 + 20;
        } else if (x + tooltipWidth / 2 > viewportWidth - 20) {
          x = viewportWidth - tooltipWidth / 2 - 20;
        }
        
        setPosition({ x, y });
      }
    };

    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible]);

  return (
    <>
      <span
        ref={triggerRef}
        className={`intelligent-tooltip-trigger ${className} ${tooltipData.category}-tag`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </span>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className="intelligent-tooltip-container"
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              transform: position.y > 100 ? 'translateX(-50%) translateY(-100%)' : 'translateX(-50%)',
              zIndex: 9999
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className={`intelligent-tooltip bg-gradient-to-br ${getCategoryColor(tooltipData.category)} p-1 rounded-xl shadow-2xl w-full`}>
              <div className="bg-black/95 backdrop-blur-sm rounded-lg p-4 w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">{getDifficultyIcon(tooltipData.difficulty)}</span>
                    <div className="text-white font-bold text-sm truncate">{tooltipData.term}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getCategoryColor(tooltipData.category)} text-white font-medium flex-shrink-0 ml-2`}>
                    {tooltipData.category}
                  </span>
                </div>

                {/* Definition */}
                <div className="text-gray-300 text-sm mb-3 leading-relaxed break-words hyphens-auto">
                  {tooltipData.definition}
                </div>

                {/* Context */}
                {tooltipData.context && (
                  <div className="mb-3">
                    <span className="text-cyan-400 text-xs font-medium">Context: </span>
                    <span className="text-gray-400 text-xs break-words">{tooltipData.context}</span>
                  </div>
                )}

                {/* Related Terms */}
                {tooltipData.relatedTerms && (
                  <div className="mb-3">
                    <span className="text-purple-400 text-xs font-medium block mb-1">Related:</span>
                    <div className="flex flex-wrap gap-1">
                      {tooltipData.relatedTerms.map((term, index) => (
                        <span key={index} className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded break-words">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fun Fact */}
                {tooltipData.funFact && (
                  <div className="border-t border-gray-700 pt-3">
                    <span className="text-yellow-400 text-xs font-medium">💡 Fun Fact: </span>
                    <span className="text-gray-400 text-xs italic break-words">{tooltipData.funFact}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function createTooltipSpan(text: string, className?: string) {
  const tooltipData = tooltipDatabase[text] || tooltipDatabase[className || ''];
  
  if (!tooltipData) {
    return <span className={className}>{text}</span>;
  }

  return (
    
      {text}
    
  );
}

export default IntelligentTooltip;