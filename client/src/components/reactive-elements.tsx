import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ReactiveElementsProps {
  children: React.ReactNode;
  sectionId: string;
  consciousnessLevel?: number;
}

export function ReactiveSection({ children, sectionId, consciousnessLevel = 50 }: ReactiveElementsProps) {
  const [isInView, setIsInView] = useState(false);
  const [userAttention, setUserAttention] = useState(0);
  const [adaptationLevel, setAdaptationLevel] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const attentionRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setAdaptationLevel(prev => Math.min(100, prev + 10));
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      const attention = Math.max(0, 100 - (distance / 5));
      setUserAttention(attention);
      attentionRef.current = attention;
      
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const attentionDecay = setInterval(() => {
      setUserAttention(prev => Math.max(0, prev - 1));
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(attentionDecay);
    };
  }, [isInView]);

  const getReactiveStyle = () => {
    const intensity = (userAttention + consciousnessLevel + adaptationLevel) / 3;
    return {
      filter: `brightness(${1 + intensity / 200}) saturate(${1 + intensity / 300})`,
      transform: `scale(${1 + intensity / 1000})`,
      transition: 'all 0.3s ease'
    };
  };

  return (
    <motion.div
      ref={sectionRef}
      className="reactive-section"
      style={getReactiveStyle()}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isInView ? 1 : 0.7,
        scale: isInView ? 1 : 0.98
      }}
      transition={{ duration: 0.5 }}
      data-section={sectionId}
      data-attention={Math.round(userAttention)}
    >
      {children}
      
      {/* Attention Indicator */}
      {userAttention > 30 && (
        <motion.div
          className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full opacity-50"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
      )}
    </motion.div>
  );
}

export function AdaptiveText({ children, baseSize = 16, maxIncrease = 4 }: {
  children: React.ReactNode;
  baseSize?: number;
  maxIncrease?: number;
}) {
  const [readingSpeed, setReadingSpeed] = useState(200);
  const [focusTime, setFocusTime] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let startTime = Date.now();
    let isReading = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTime = Date.now();
          isReading = true;
        } else {
          if (isReading) {
            const timeSpent = (Date.now() - startTime) / 1000;
            setFocusTime(timeSpent);
            
            // Estimate reading speed
            const text = textRef.current?.textContent || '';
            const wordCount = text.split(' ').length;
            const estimatedSpeed = (wordCount / timeSpent) * 60;
            
            if (estimatedSpeed > 50 && estimatedSpeed < 800) {
              setReadingSpeed(estimatedSpeed);
            }
          }
          isReading = false;
        }
      },
      { threshold: 0.7 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getAdaptiveSize = () => {
    // Adjust text size based on reading speed
    if (readingSpeed < 150) {
      return baseSize + maxIncrease; // Slower readers get larger text
    } else if (readingSpeed > 300) {
      return baseSize - 1; // Fast readers get slightly smaller text
    }
    return baseSize;
  };

  return (
    <div
      ref={textRef}
      style={{
        fontSize: `${getAdaptiveSize()}px`,
        lineHeight: readingSpeed < 150 ? 1.8 : 1.6,
        transition: 'all 0.5s ease'
      }}
      className="adaptive-text"
    >
      {children}
    </div>
  );
}

export function SmartButton({ children, onClick, priority = 'normal' }: {
  children: React.ReactNode;
  onClick: () => void;
  priority?: 'low' | 'normal' | 'high' | 'critical';
}) {
  const [hoverTime, setHoverTime] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const hoverStartRef = useRef<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (hoverTime > 0) {
      interval = setInterval(() => {
        const elapsed = Date.now() - hoverStartRef.current;
        setHoverTime(elapsed / 1000);
        
        // Build confidence based on hover time
        const newConfidence = Math.min(100, (elapsed / 1000) * 50);
        setConfidence(newConfidence);
        
        // Preload content if high confidence
        if (newConfidence > 70 && !isPreloading) {
          setIsPreloading(true);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [hoverTime, isPreloading]);

  const handleMouseEnter = () => {
    hoverStartRef.current = Date.now();
    setHoverTime(0.1);
  };

  const handleMouseLeave = () => {
    setHoverTime(0);
    setConfidence(0);
    setIsPreloading(false);
  };

  const getPriorityStyle = () => {
    const baseStyle = {
      position: 'relative' as const,
      overflow: 'hidden' as const,
    };

    switch (priority) {
      case 'critical':
        return { ...baseStyle, borderColor: '#ff6b6b', boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)' };
      case 'high':
        return { ...baseStyle, borderColor: '#4ecdc4', boxShadow: '0 0 15px rgba(78, 205, 196, 0.2)' };
      case 'low':
        return { ...baseStyle, opacity: 0.8 };
      default:
        return baseStyle;
    }
  };

  return (
    <motion.button
      style={getPriorityStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="smart-button relative"
    >
      {children}
      
      {/* Confidence Indicator */}
      {confidence > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-cyan-400"
          initial={{ width: '0%' }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.1 }}
        />
      )}
      
      {/* Preload Indicator */}
      {isPreloading && (
        <motion.div
          className="absolute inset-0 bg-cyan-400/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}

export function ConsciousContainer({ children, learningRate = 0.1 }: {
  children: React.ReactNode;
  learningRate?: number;
}) {
  const [userPreferences, setUserPreferences] = useState({
    preferredSections: [] as string[],
    interactionPatterns: {} as Record<string, number>,
    engagementLevel: 0,
    adaptationHistory: [] as Array<{ timestamp: number; action: string; result: number }>
  });

  useEffect(() => {
    // Learn from user interactions
    const handleInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      const section = target.closest('[data-section]')?.getAttribute('data-section');
      
      if (section) {
        setUserPreferences(prev => ({
          ...prev,
          interactionPatterns: {
            ...prev.interactionPatterns,
            [section]: (prev.interactionPatterns[section] || 0) + 1
          },
          adaptationHistory: [
            ...prev.adaptationHistory.slice(-20), // Keep last 20 interactions
            {
              timestamp: Date.now(),
              action: e.type,
              result: Math.random() * 100 // Placeholder for actual engagement measurement
            }
          ]
        }));
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('scroll', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  return (
    <div className="conscious-container" data-learning-rate={learningRate}>
      {children}
      
      {/* Hidden learning indicators for debugging */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-500 font-mono opacity-20 pointer-events-none">
        Interactions: {Object.values(userPreferences.interactionPatterns).reduce((a, b) => a + b, 0)}
      </div>
    </div>
  );
}