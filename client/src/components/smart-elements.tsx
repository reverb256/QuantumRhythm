import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SmartButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  className?: string;
  asWrapper?: boolean;
}

export function SmartButton({ children, onClick, priority = 'normal', className = '', asWrapper = false }: SmartButtonProps) {
  const [hoverTime, setHoverTime] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const hoverStartRef = useRef<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (hoverTime > 0) {
      interval = setInterval(() => {
        const elapsed = Date.now() - hoverStartRef.current;
        setHoverTime(elapsed / 1000);
        setConfidence(Math.min(100, (elapsed / 1000) * 50));
      }, 100);
    }

    return () => clearInterval(interval);
  }, [hoverTime]);

  const handleMouseEnter = () => {
    hoverStartRef.current = Date.now();
    setHoverTime(0.1);
  };

  const handleMouseLeave = () => {
    setHoverTime(0);
    setConfidence(0);
  };

  const getPriorityStyle = () => {
    switch (priority) {
      case 'critical':
        return 'border-red-400/50 shadow-red-400/25 hover:shadow-red-400/40';
      case 'high':
        return 'border-cyan-400/50 shadow-cyan-400/25 hover:shadow-cyan-400/40';
      case 'low':
        return 'opacity-80 border-gray-400/30 shadow-gray-400/15';
      default:
        return 'border-blue-400/50 shadow-blue-400/25 hover:shadow-blue-400/40';
    }
  };

  // Check if children contains interactive elements to avoid nesting
  const hasInteractiveChild = typeof children === 'object' && children !== null;
  const shouldRenderAsDiv = asWrapper || hasInteractiveChild;

  const Component = shouldRenderAsDiv ? motion.div : motion.button;
  const props = shouldRenderAsDiv ? {} : { onClick };

  return (
    <Component
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden ${getPriorityStyle()} ${className}`}
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
      
      {/* Hover Effect */}
      {confidence > 70 && (
        <motion.div
          className="absolute inset-0 bg-cyan-400/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Component>
  );
}

interface AdaptiveTextProps {
  children: React.ReactNode;
  baseSize?: number;
  maxIncrease?: number;
}

export function AdaptiveText({ children, baseSize = 16, maxIncrease = 4 }: AdaptiveTextProps) {
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
    if (readingSpeed < 150) {
      return baseSize + maxIncrease;
    } else if (readingSpeed > 300) {
      return baseSize - 1;
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

interface ReactiveSectionProps {
  children: React.ReactNode;
  sectionId: string;
  consciousnessLevel?: number;
}

export function ReactiveSection({ children, sectionId, consciousnessLevel = 50 }: ReactiveSectionProps) {
  const [isInView, setIsInView] = useState(false);
  const [userAttention, setUserAttention] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
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
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isInView]);

  const getReactiveStyle = () => {
    const intensity = (userAttention + consciousnessLevel) / 2;
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
      animate={{ opacity: isInView ? 1 : 0.7 }}
      transition={{ duration: 0.5 }}
      data-section={sectionId}
    >
      {children}
      
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

interface ConsciousContainerProps {
  children: React.ReactNode;
  learningRate?: number;
}

export function ConsciousContainer({ children, learningRate = 0.1 }: ConsciousContainerProps) {
  const [interactions, setInteractions] = useState(0);

  useEffect(() => {
    const handleInteraction = () => {
      setInteractions(prev => prev + 1);
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
      <div className="fixed bottom-4 left-4 text-xs text-gray-500 font-mono opacity-20 pointer-events-none">
        Interactions: {interactions}
      </div>
    </div>
  );
}