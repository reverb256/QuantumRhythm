import { useEffect, useState } from 'react';

interface BreathingState {
  isActive: boolean;
  isPaused: boolean;
}

export const useBreathingAnimation = () => {
  const [breathingState, setBreathingState] = useState<BreathingState>({
    isActive: true,
    isPaused: false
  });

  useEffect(() => {
    let pauseTimeout: NodeJS.Timeout;
    let resumeTimeout: NodeJS.Timeout;

    const handleUserInteraction = () => {
      // Pause breathing on user interaction
      setBreathingState(prev => ({ ...prev, isPaused: true }));
      
      clearTimeout(pauseTimeout);
      clearTimeout(resumeTimeout);
      
      // Resume after 3 seconds of inactivity
      pauseTimeout = setTimeout(() => {
        setBreathingState(prev => ({ ...prev, isPaused: false }));
      }, 3000);
    };

    const handleScroll = () => {
      // Reduce breathing intensity during scroll
      setBreathingState(prev => ({ ...prev, isPaused: true }));
      
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        setBreathingState(prev => ({ ...prev, isPaused: false }));
      }, 1500);
    };

    // Listen for user interactions
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { passive: true });
    });

    document.addEventListener('scroll', handleScroll, { passive: true });

    // Auto-disable after 30 seconds to prevent distraction
    const autoDisableTimeout = setTimeout(() => {
      setBreathingState({ isActive: false, isPaused: false });
    }, 30000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
      document.removeEventListener('scroll', handleScroll);
      clearTimeout(pauseTimeout);
      clearTimeout(resumeTimeout);
      clearTimeout(autoDisableTimeout);
    };
  }, []);

  const getBreathingClass = (component: 'hero' | 'nav' | 'projects' | 'particles' | 'container') => {
    if (!breathingState.isActive) return '';
    
    const baseClass = `breathing-${component}`;
    const pausedClass = breathingState.isPaused ? 'breathing-paused' : '';
    
    return `${baseClass} ${pausedClass}`.trim();
  };

  return {
    isActive: breathingState.isActive,
    isPaused: breathingState.isPaused,
    getBreathingClass,
    toggleBreathing: () => setBreathingState(prev => ({ 
      ...prev, 
      isActive: !prev.isActive 
    }))
  };
};