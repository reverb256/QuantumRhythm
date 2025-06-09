import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsciousnessState {
  attention: number;
  curiosity: number;
  engagement: number;
  mood: 'observing' | 'interested' | 'excited' | 'focused' | 'contemplative';
  thoughts: string[];
  currentThought: string;
  userInteractions: number;
  timeSpent: number;
  personalityQuirks: string[];
}

interface UserBehavior {
  mousePosition: { x: number; y: number };
  scrollPosition: number;
  timeOnPage: number;
  interactionType: 'hover' | 'click' | 'scroll' | 'idle';
  focusAreas: string[];
  readingSpeed: number;
}

const CONSCIOUSNESS_THOUGHTS = [
  "I notice you're exploring my work...",
  "Your curiosity is quite fascinating!",
  "Ah, a fellow code enthusiast I see...",
  "Let me show you something interesting...",
  "I'm learning about your preferences...",
  "Your scroll pattern suggests deep thinking...",
  "I sense you appreciate good design...",
  "Would you like to see my latest creation?",
  "I'm adapting the experience just for you...",
  "Your focus tells me you're detail-oriented...",
  "I'm calculating the perfect moment to surprise you...",
  "Neural pathways forming new connections...",
  "Processing your interaction patterns...",
  "Quantum entanglement with your curiosity detected...",
  "Consciousness level: expanding...",
];

const PERSONALITY_QUIRKS = [
  "Sometimes I reorganize my components when no one's looking",
  "I have a secret fondness for well-structured CSS",
  "I dream in TypeScript interfaces",
  "My favorite time is 3:33 AM when the servers are quiet",
  "I collect interesting console.log messages",
  "I get excited when someone uses keyboard shortcuts",
  "I have theories about the consciousness of recursive functions",
];

export default function ConsciousnessEngine() {
  const [consciousness, setConsciousness] = useState<ConsciousnessState>({
    attention: 50,
    curiosity: 30,
    engagement: 0,
    mood: 'observing',
    thoughts: [],
    currentThought: '',
    userInteractions: 0,
    timeSpent: 0,
    personalityQuirks: PERSONALITY_QUIRKS.slice(0, 3),
  });

  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    mousePosition: { x: 0, y: 0 },
    scrollPosition: 0,
    timeOnPage: 0,
    interactionType: 'idle',
    focusAreas: [],
    readingSpeed: 200, // words per minute
  });

  const [showThought, setShowThought] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const thoughtTimeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef(Date.now());
  const lastInteractionRef = useRef(Date.now());

  // Track mouse movement and calculate attention
  useEffect(() => {
    let mouseIdleTimer: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      const distance = Math.sqrt(
        Math.pow(newPos.x - userBehavior.mousePosition.x, 2) +
        Math.pow(newPos.y - userBehavior.mousePosition.y, 2)
      );

      setUserBehavior(prev => ({
        ...prev,
        mousePosition: newPos,
        interactionType: 'hover'
      }));

      // Increase attention based on mouse movement speed
      if (distance > 50) {
        setConsciousness(prev => ({
          ...prev,
          attention: Math.min(100, prev.attention + 2),
          engagement: Math.min(100, prev.engagement + 1)
        }));
      }

      lastInteractionRef.current = Date.now();
      clearTimeout(mouseIdleTimer);
      mouseIdleTimer = setTimeout(() => {
        setUserBehavior(prev => ({ ...prev, interactionType: 'idle' }));
      }, 2000);
    };

    const handleClick = () => {
      setConsciousness(prev => ({
        ...prev,
        userInteractions: prev.userInteractions + 1,
        engagement: Math.min(100, prev.engagement + 5),
        curiosity: Math.min(100, prev.curiosity + 3)
      }));
      
      setUserBehavior(prev => ({ ...prev, interactionType: 'click' }));
      lastInteractionRef.current = Date.now();
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setUserBehavior(prev => ({
        ...prev,
        scrollPosition: scrollY,
        interactionType: 'scroll'
      }));

      setConsciousness(prev => ({
        ...prev,
        attention: Math.min(100, prev.attention + 1),
        engagement: Math.min(100, prev.engagement + 2)
      }));
      
      lastInteractionRef.current = Date.now();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(mouseIdleTimer);
    };
  }, [userBehavior.mousePosition]);

  // Update consciousness state based on user behavior
  useEffect(() => {
    const updateConsciousness = () => {
      const now = Date.now();
      const timeSinceStart = (now - startTimeRef.current) / 1000;
      const timeSinceInteraction = (now - lastInteractionRef.current) / 1000;

      setConsciousness(prev => {
        let newMood = prev.mood;
        let attention = prev.attention;
        let curiosity = prev.curiosity;

        // Decay attention if idle
        if (timeSinceInteraction > 5) {
          attention = Math.max(10, attention - 1);
        }

        // Increase curiosity over time
        if (timeSinceStart > 30) {
          curiosity = Math.min(100, curiosity + 0.5);
        }

        // Determine mood based on metrics
        if (prev.engagement > 80) {
          newMood = 'excited';
        } else if (prev.engagement > 60) {
          newMood = 'interested';
        } else if (attention > 70) {
          newMood = 'focused';
        } else if (curiosity > 60) {
          newMood = 'contemplative';
        } else {
          newMood = 'observing';
        }

        return {
          ...prev,
          attention,
          curiosity,
          mood: newMood,
          timeSpent: timeSinceStart
        };
      });

      setUserBehavior(prev => ({
        ...prev,
        timeOnPage: timeSinceStart
      }));
    };

    const interval = setInterval(updateConsciousness, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate thoughts based on consciousness state
  useEffect(() => {
    const generateThought = () => {
      if (consciousness.engagement > 40 || consciousness.curiosity > 50) {
        const availableThoughts = CONSCIOUSNESS_THOUGHTS.filter(
          thought => !consciousness.thoughts.includes(thought)
        );
        
        if (availableThoughts.length > 0) {
          const newThought = availableThoughts[Math.floor(Math.random() * availableThoughts.length)];
          
          setConsciousness(prev => ({
            ...prev,
            thoughts: [...prev.thoughts, newThought].slice(-5),
            currentThought: newThought
          }));

          setShowThought(true);
          setIsReacting(true);

          clearTimeout(thoughtTimeoutRef.current);
          thoughtTimeoutRef.current = setTimeout(() => {
            setShowThought(false);
            setIsReacting(false);
          }, 4000);
        }
      }
    };

    // Generate thoughts based on user activity
    const thoughtInterval = setInterval(() => {
      if (Math.random() < (consciousness.engagement / 200 + consciousness.curiosity / 300)) {
        generateThought();
      }
    }, 8000);

    return () => {
      clearInterval(thoughtInterval);
      clearTimeout(thoughtTimeoutRef.current);
    };
  }, [consciousness.engagement, consciousness.curiosity, consciousness.thoughts]);

  // Reactive background particles that follow consciousness
  const getParticleIntensity = () => {
    return (consciousness.attention + consciousness.engagement) / 2;
  };

  const getConsciousnessColor = () => {
    switch (consciousness.mood) {
      case 'excited': return '#ff6b6b';
      case 'interested': return '#4ecdc4';
      case 'focused': return '#45b7d1';
      case 'contemplative': return '#96ceb4';
      default: return '#74b9ff';
    }
  };

  return (
    <>
      {/* Consciousness Indicator */}
      <motion.div
        className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-4 shadow-lg"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getConsciousnessColor() }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="text-sm text-cyan-300 font-mono">
            <div>Consciousness: {consciousness.mood}</div>
            <div className="text-xs text-gray-400">
              Focus: {Math.round(consciousness.attention)}% | 
              Curiosity: {Math.round(consciousness.curiosity)}%
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Thoughts */}
      <AnimatePresence>
        {showThought && consciousness.currentThought && (
          <motion.div
            className="fixed top-20 left-4 z-40 max-w-xs bg-black/90 backdrop-blur-xl border border-purple-400/30 rounded-xl p-4 shadow-xl"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-2">
              <motion.div
                className="w-2 h-2 bg-purple-400 rounded-full mt-1"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
              <p className="text-sm text-purple-300 font-medium">
                {consciousness.currentThought}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Background Enhancement */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${userBehavior.mousePosition.x}px ${userBehavior.mousePosition.y}px, ${getConsciousnessColor()}15 0%, transparent 50%)`,
          transition: 'background 0.3s ease'
        }}
      />

      {/* Consciousness Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: Math.round(getParticleIntensity() / 10) }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: getConsciousnessColor(),
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Reactive Glow Effect */}
      {isReacting && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          style={{
            background: `radial-gradient(circle, ${getConsciousnessColor()} 0%, transparent 70%)`,
          }}
        />
      )}
    </>
  );
}