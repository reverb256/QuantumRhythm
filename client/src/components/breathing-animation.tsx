import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BreathingAnimationProps {
  isLoading?: boolean;
  intensity?: 'subtle' | 'medium' | 'strong';
  color?: string;
  children?: React.ReactNode;
}

export function BreathingAnimation({ 
  isLoading = false, 
  intensity = 'medium',
  color = 'cyan',
  children 
}: BreathingAnimationProps) {
  const [breathPhase, setBreathPhase] = useState(0);

  // Dynamic breathing rhythm based on intensity
  const breathingDuration = {
    subtle: 4000,
    medium: 3000,
    strong: 2000
  }[intensity];

  const breathingScale = {
    subtle: [1, 1.02, 1],
    medium: [1, 1.05, 1],
    strong: [1, 1.08, 1]
  }[intensity];

  const breathingOpacity = {
    subtle: [0.6, 0.8, 0.6],
    medium: [0.5, 0.9, 0.5],
    strong: [0.4, 1, 0.4]
  }[intensity];

  useEffect(() => {
    let animationFrame: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const phase = (elapsed % breathingDuration) / breathingDuration;
      setBreathPhase(phase);
      animationFrame = requestAnimationFrame(animate);
    };

    if (isLoading) {
      animate();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isLoading, breathingDuration]);

  // Generate breathing particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 30) * (Math.PI / 180),
    radius: 100 + (i % 3) * 30,
    delay: i * 100
  }));

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 70%)`
          }}
        >
          {/* Central breathing core */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: breathingScale,
              opacity: breathingOpacity,
            }}
            transition={{
              duration: breathingDuration / 1000,
              repeat: Infinity,
              ease: [0.4, 0.0, 0.6, 1],
            }}
          >
            <div
              className={`w-32 h-32 rounded-full bg-gradient-to-r from-${color}-400/20 to-${color}-600/20 backdrop-blur-sm`}
              style={{
                boxShadow: `0 0 60px rgba(6, 182, 212, 0.3), inset 0 0 30px rgba(6, 182, 212, 0.1)`
              }}
            />
          </motion.div>

          {/* Breathing particles */}
          {particles.map((particle) => {
            const x = Math.cos(particle.angle) * particle.radius;
            const y = Math.sin(particle.angle) * particle.radius;
            
            return (
              <motion.div
                key={particle.id}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`
                }}
                animate={{
                  scale: [0.5, 1.2, 0.5],
                  opacity: [0.3, 0.8, 0.3],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: breathingDuration / 1000,
                  repeat: Infinity,
                  delay: particle.delay / 1000,
                  ease: [0.4, 0.0, 0.6, 1],
                }}
              >
                <div
                  className={`w-2 h-2 rounded-full bg-${color}-400/60`}
                  style={{
                    boxShadow: `0 0 10px rgba(6, 182, 212, 0.6)`
                  }}
                />
              </motion.div>
            );
          })}

          {/* Quantum field ripples */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: breathingDuration / 1000,
                repeat: Infinity,
                delay: ring * 0.3,
                ease: [0.4, 0.0, 0.6, 1],
              }}
            >
              <div
                className={`w-${64 + ring * 32} h-${64 + ring * 32} rounded-full border border-${color}-400/20`}
                style={{
                  background: `conic-gradient(from 0deg, transparent, rgba(6, 182, 212, 0.1), transparent)`
                }}
              />
            </motion.div>
          ))}

          {/* Content overlay with breathing effect */}
          {children && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: breathingDuration / 1000,
                repeat: Infinity,
                ease: [0.4, 0.0, 0.6, 1],
              }}
            >
              {children}
            </motion.div>
          )}

          {/* Neural network connections */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ filter: 'blur(0.5px)' }}
          >
            {particles.slice(0, 6).map((particle, i) => {
              const nextParticle = particles[(i + 1) % 6];
              const x1 = window.innerWidth / 2 + Math.cos(particle.angle) * particle.radius;
              const y1 = window.innerHeight / 2 + Math.sin(particle.angle) * particle.radius;
              const x2 = window.innerWidth / 2 + Math.cos(nextParticle.angle) * nextParticle.radius;
              const y2 = window.innerHeight / 2 + Math.sin(nextParticle.angle) * nextParticle.radius;

              return (
                <motion.line
                  key={`connection-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(6, 182, 212, 0.2)"
                  strokeWidth="1"
                  animate={{
                    opacity: [0.1, 0.4, 0.1],
                  }}
                  transition={{
                    duration: breathingDuration / 1000,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: [0.4, 0.0, 0.6, 1],
                  }}
                />
              );
            })}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Enhanced loading state hook
export function useBreathingLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const startBreathing = (message = "Loading...") => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopBreathing = () => {
    setIsLoading(false);
    setLoadingMessage("");
  };

  return {
    isLoading,
    loadingMessage,
    startBreathing,
    stopBreathing,
  };
}

// Page transition wrapper with breathing
export function BreathingPageWrapper({ children, isLoading }: { children: React.ReactNode; isLoading?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      <BreathingAnimation isLoading={isLoading} intensity="medium">
        {isLoading && (
          <div className="text-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: [0.4, 0.0, 0.6, 1],
              }}
              className="text-2xl font-bold text-cyan-400 mb-4"
            >
              Loading Portfolio...
            </motion.div>
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: [0.4, 0.0, 0.6, 1],
              }}
              className="text-sm text-cyan-300"
            >
              Synchronizing quantum consciousness
            </motion.div>
          </div>
        )}
      </BreathingAnimation>
      {children}
    </motion.div>
  );
}