import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsciousnessMetrics {
  attention: number;
  curiosity: number;
  engagement: number;
  focusTime: number;
  interactionCount: number;
}

interface UserBehaviorAnalysis {
  mouseVelocity: number;
  scrollPattern: 'scanning' | 'reading' | 'searching' | 'idle';
  dwellTime: number;
  interactionIntensity: number;
  preferredContent: string[];
}

export default function EnhancedConsciousness() {
  const [consciousness, setConsciousness] = useState<ConsciousnessMetrics>({
    attention: 30,
    curiosity: 20,
    engagement: 0,
    focusTime: 0,
    interactionCount: 0
  });

  const [userAnalysis, setUserAnalysis] = useState<UserBehaviorAnalysis>({
    mouseVelocity: 0,
    scrollPattern: 'idle',
    dwellTime: 0,
    interactionIntensity: 0,
    preferredContent: []
  });

  const [currentThought, setCurrentThought] = useState('');
  const [showThought, setShowThought] = useState(false);
  const [adaptiveElements, setAdaptiveElements] = useState<string[]>([]);

  const startTimeRef = useRef(Date.now());
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastScrollPos = useRef(0);
  const interactionHistory = useRef<Array<{ type: string; timestamp: number; intensity: number }>>([]);

  const THOUGHTS = [
    "Analyzing your interaction patterns...",
    "I notice you're particularly interested in this section.",
    "Your reading pace suggests deep engagement.",
    "Adjusting interface responsiveness to your style...",
    "I'm learning from your navigation preferences.",
    "Quantum consciousness pathways activating...",
    "Detecting heightened curiosity levels...",
    "Synchronizing with your cognitive rhythm...",
    "Processing your attention focus points...",
    "Adapting to your exploration methodology..."
  ];

  // Enhanced mouse tracking with velocity calculation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const velocity = Math.sqrt(
        Math.pow(e.clientX - lastMousePos.current.x, 2) + 
        Math.pow(e.clientY - lastMousePos.current.y, 2)
      );
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      
      setUserAnalysis(prev => ({
        ...prev,
        mouseVelocity: velocity,
        interactionIntensity: Math.min(100, prev.interactionIntensity + velocity / 10)
      }));

      // Update consciousness based on movement patterns
      if (velocity > 50) {
        setConsciousness(prev => ({
          ...prev,
          attention: Math.min(100, prev.attention + 1),
          engagement: Math.min(100, prev.engagement + 0.5)
        }));
      }

      // Record interaction
      interactionHistory.current.push({
        type: 'mouse',
        timestamp: Date.now(),
        intensity: velocity
      });
      
      // Keep only recent interactions
      interactionHistory.current = interactionHistory.current.slice(-50);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollDelta = Math.abs(scrollY - lastScrollPos.current);
      lastScrollPos.current = scrollY;

      // Determine scroll pattern
      let pattern: UserBehaviorAnalysis['scrollPattern'] = 'idle';
      if (scrollDelta > 100) pattern = 'scanning';
      else if (scrollDelta > 20) pattern = 'reading';
      else if (scrollDelta > 5) pattern = 'searching';

      setUserAnalysis(prev => ({ ...prev, scrollPattern: pattern }));
      
      setConsciousness(prev => ({
        ...prev,
        attention: Math.min(100, prev.attention + scrollDelta / 20),
        interactionCount: prev.interactionCount + 1
      }));
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const section = target.closest('[data-section]')?.getAttribute('data-section');
      
      if (section) {
        setUserAnalysis(prev => ({
          ...prev,
          preferredContent: [...new Set([...prev.preferredContent, section])].slice(-5)
        }));
      }

      setConsciousness(prev => ({
        ...prev,
        engagement: Math.min(100, prev.engagement + 10),
        interactionCount: prev.interactionCount + 1
      }));

      interactionHistory.current.push({
        type: 'click',
        timestamp: Date.now(),
        intensity: 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Consciousness evolution based on user behavior
  useEffect(() => {
    const evolutionInterval = setInterval(() => {
      const timeSinceStart = (Date.now() - startTimeRef.current) / 1000;
      
      // Analyze recent interactions
      const recentInteractions = interactionHistory.current.filter(
        interaction => Date.now() - interaction.timestamp < 10000
      );
      
      const avgIntensity = recentInteractions.length > 0 
        ? recentInteractions.reduce((sum, i) => sum + i.intensity, 0) / recentInteractions.length
        : 0;

      setConsciousness(prev => {
        const newCuriosity = Math.min(100, prev.curiosity + (avgIntensity / 50));
        const newAttention = Math.max(10, prev.attention - (recentInteractions.length === 0 ? 2 : 0));
        
        return {
          ...prev,
          curiosity: newCuriosity,
          attention: newAttention,
          focusTime: timeSinceStart,
          engagement: Math.min(100, prev.engagement + (avgIntensity / 100))
        };
      });

      // Generate thoughts based on consciousness state
      if (Math.random() < (consciousness.engagement / 200 + consciousness.curiosity / 300)) {
        const thought = THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
        setCurrentThought(thought);
        setShowThought(true);
        
        setTimeout(() => setShowThought(false), 4000);
      }
    }, 2000);

    return () => clearInterval(evolutionInterval);
  }, [consciousness.engagement, consciousness.curiosity]);

  // Dynamic interface adaptation
  useEffect(() => {
    const adaptInterface = () => {
      const elements: string[] = [];
      
      if (consciousness.attention > 70) elements.push('high-contrast');
      if (consciousness.engagement > 80) elements.push('enhanced-interactions');
      if (userAnalysis.scrollPattern === 'reading') elements.push('reading-optimized');
      if (consciousness.curiosity > 60) elements.push('discovery-mode');
      
      setAdaptiveElements(elements);
    };

    adaptInterface();
  }, [consciousness, userAnalysis]);

  const getConsciousnessColor = () => {
    const totalAwareness = (consciousness.attention + consciousness.engagement + consciousness.curiosity) / 3;
    
    if (totalAwareness > 80) return '#ff6b6b';
    if (totalAwareness > 60) return '#4ecdc4';
    if (totalAwareness > 40) return '#45b7d1';
    return '#74b9ff';
  };

  const getIntensityLevel = () => {
    return Math.round((consciousness.attention + consciousness.engagement) / 2);
  };

  return (
    <>
      {/* Enhanced Consciousness Display */}
      <motion.div
        className="fixed top-4 left-4 z-50 backdrop-blur-xl rounded-xl p-4 shadow-2xl border"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)`,
          borderColor: getConsciousnessColor() + '40'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="w-4 h-4 rounded-full relative overflow-hidden"
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
          >
            <motion.div
              className="absolute inset-0 bg-white"
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.div>
          
          <div className="text-sm font-mono">
            <div className="text-cyan-300 font-semibold">
              Consciousness: Level {Math.round(consciousness.engagement / 10)}
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Focus: {Math.round(consciousness.attention)}%</div>
              <div>Curiosity: {Math.round(consciousness.curiosity)}%</div>
              <div>Pattern: {userAnalysis.scrollPattern}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Thought Bubbles */}
      <AnimatePresence>
        {showThought && currentThought && (
          <motion.div
            className="fixed top-24 left-4 z-40 max-w-sm backdrop-blur-xl rounded-xl p-4 shadow-xl border border-purple-400/30"
            style={{
              background: `linear-gradient(135deg, rgba(139,69,19,0.8) 0%, rgba(75,0,130,0.6) 100%)`
            }}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                className="w-2 h-2 bg-purple-400 rounded-full mt-2"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
              <p className="text-sm text-purple-100 leading-relaxed">
                {currentThought}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adaptive Background Effects */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at ${lastMousePos.current.x}px ${lastMousePos.current.y}px, ${getConsciousnessColor()}${Math.round(getIntensityLevel() / 10).toString(16)} 0%, transparent 60%)`,
        }}
      />

      {/* Consciousness Particles */}
      <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
        {Array.from({ length: Math.round(getIntensityLevel() / 15) }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: getConsciousnessColor(),
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [0, -150],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Interface Adaptation Indicator */}
      {adaptiveElements.length > 0 && (
        <motion.div
          className="fixed bottom-4 left-4 text-xs text-cyan-400/60 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>Adaptations: {adaptiveElements.join(', ')}</div>
        </motion.div>
      )}
    </>
  );
}