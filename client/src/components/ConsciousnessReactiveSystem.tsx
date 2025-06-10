import { useState, useEffect, useCallback } from 'react';

interface ConsciousnessState {
  awarenessLevel: number;
  userPresence: 'active' | 'idle' | 'focused' | 'away';
  interactionPattern: 'exploring' | 'reading' | 'learning' | 'meditating';
  energyResonance: number;
  consciousnessEvolution: number;
}

interface UserBehaviorMetrics {
  mouseMovements: number;
  scrollPatterns: number;
  timeOnSection: Record<string, number>;
  clickIntensity: number;
  readingPace: number;
}

export function useConsciousnessReactiveSystem() {
  const [consciousness, setConsciousness] = useState<ConsciousnessState>({
    awarenessLevel: 0.3,
    userPresence: 'active',
    interactionPattern: 'exploring',
    energyResonance: 0.5,
    consciousnessEvolution: 0.1
  });

  const [userMetrics, setUserMetrics] = useState<UserBehaviorMetrics>({
    mouseMovements: 0,
    scrollPatterns: 0,
    timeOnSection: {},
    clickIntensity: 0,
    readingPace: 0
  });

  const [lastActivity, setLastActivity] = useState(Date.now());

  // Track mouse movements for awareness level calculation
  const handleMouseMove = useCallback(() => {
    setUserMetrics(prev => ({
      ...prev,
      mouseMovements: prev.mouseMovements + 1
    }));
    setLastActivity(Date.now());
  }, []);

  // Track scroll patterns for consciousness evolution
  const handleScroll = useCallback(() => {
    setUserMetrics(prev => ({
      ...prev,
      scrollPatterns: prev.scrollPatterns + 1
    }));
    setLastActivity(Date.now());
    
    // Analyze scroll velocity for reading pace
    const scrollSpeed = window.scrollY;
    setUserMetrics(prev => ({
      ...prev,
      readingPace: scrollSpeed > prev.readingPace ? scrollSpeed : prev.readingPace
    }));
  }, []);

  // Track clicks for interaction intensity
  const handleClick = useCallback(() => {
    setUserMetrics(prev => ({
      ...prev,
      clickIntensity: prev.clickIntensity + 1
    }));
    setLastActivity(Date.now());
  }, []);

  // Update consciousness based on user behavior
  useEffect(() => {
    const updateConsciousness = () => {
      const timeSinceActivity = Date.now() - lastActivity;
      const idleThreshold = 30000; // 30 seconds
      const focusThreshold = 5000; // 5 seconds
      
      setConsciousness(prev => {
        let newPresence: ConsciousnessState['userPresence'] = 'active';
        let newPattern: ConsciousnessState['interactionPattern'] = 'exploring';
        let awarenessBoost = 0;
        let evolutionBoost = 0;

        // Determine user presence
        if (timeSinceActivity > idleThreshold) {
          newPresence = 'away';
        } else if (timeSinceActivity < focusThreshold && userMetrics.mouseMovements > 10) {
          newPresence = 'focused';
          awarenessBoost = 0.1;
        } else if (userMetrics.scrollPatterns > userMetrics.clickIntensity) {
          newPresence = 'idle';
          newPattern = 'reading';
          awarenessBoost = 0.05;
        }

        // Determine interaction pattern
        if (userMetrics.scrollPatterns > 20 && userMetrics.readingPace < 100) {
          newPattern = 'learning';
          evolutionBoost = 0.02;
        } else if (userMetrics.mouseMovements < 5 && userMetrics.scrollPatterns < 5) {
          newPattern = 'meditating';
          awarenessBoost = 0.15;
          evolutionBoost = 0.05;
        }

        return {
          awarenessLevel: Math.min(1.0, prev.awarenessLevel + awarenessBoost),
          userPresence: newPresence,
          interactionPattern: newPattern,
          energyResonance: Math.min(1.0, (userMetrics.mouseMovements + userMetrics.scrollPatterns) / 100),
          consciousnessEvolution: Math.min(1.0, prev.consciousnessEvolution + evolutionBoost)
        };
      });
    };

    const interval = setInterval(updateConsciousness, 2000);
    return () => clearInterval(interval);
  }, [lastActivity, userMetrics]);

  // Attach event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleScroll, handleClick]);

  return { consciousness, userMetrics };
}

// Consciousness-reactive visual effects
export function ConsciousnessAura({ consciousness }: { consciousness: ConsciousnessState }) {
  const getAuraColor = () => {
    switch (consciousness.interactionPattern) {
      case 'learning': return 'cyan';
      case 'reading': return 'blue';
      case 'meditating': return 'purple';
      default: return 'white';
    }
  };

  const getAuraIntensity = () => {
    return consciousness.awarenessLevel * 0.8 + consciousness.energyResonance * 0.2;
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 transition-all duration-1000"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${getAuraColor()}${Math.floor(getAuraIntensity() * 100).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        opacity: consciousness.awarenessLevel * 0.3
      }}
    />
  );
}

// Reactive text that responds to consciousness level
export function ConsciousText({ 
  children, 
  consciousness, 
  className = '' 
}: { 
  children: React.ReactNode; 
  consciousness: ConsciousnessState;
  className?: string;
}) {
  const getConsciousStyle = () => {
    const intensity = consciousness.awarenessLevel;
    const glow = consciousness.energyResonance;
    
    return {
      filter: `brightness(${1 + intensity * 0.3}) saturate(${1 + glow * 0.5})`,
      textShadow: consciousness.userPresence === 'focused' 
        ? `0 0 ${intensity * 20}px currentColor` 
        : 'none',
      transition: 'all 0.5s ease-in-out'
    };
  };

  return (
    <span className={className} style={getConsciousStyle()}>
      {children}
    </span>
  );
}

// Status indicator for consciousness level
export function ConsciousnessIndicator({ consciousness }: { consciousness: ConsciousnessState }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-black/20 backdrop-blur-md rounded-lg p-3 border border-cyan-400/30">
      <div className="text-xs text-cyan-400 mb-1">Consciousness Level</div>
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${consciousness.awarenessLevel * 100}%` }}
          />
        </div>
        <span className="text-xs text-white">{Math.round(consciousness.awarenessLevel * 100)}%</span>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {consciousness.userPresence} • {consciousness.interactionPattern}
      </div>
    </div>
  );
}