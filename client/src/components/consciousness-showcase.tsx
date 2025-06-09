import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConsciousnessShowcase() {
  const [demoActive, setDemoActive] = useState(false);
  const [interactions, setInteractions] = useState(0);
  const [mouseTrails, setMouseTrails] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [currentEffect, setCurrentEffect] = useState<'particles' | 'ripples' | 'neural' | 'quantum'>('particles');

  useEffect(() => {
    let trailId = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!demoActive) return;
      
      const newTrail = { x: e.clientX, y: e.clientY, id: trailId++ };
      setMouseTrails(prev => [...prev.slice(-20), newTrail]);
      
      // Clear old trails
      setTimeout(() => {
        setMouseTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
      }, 2000);
    };

    const handleClick = () => {
      if (!demoActive) return;
      setInteractions(prev => prev + 1);
      
      // Cycle through effects on click
      setCurrentEffect(prev => {
        const effects: Array<typeof currentEffect> = ['particles', 'ripples', 'neural', 'quantum'];
        const currentIndex = effects.indexOf(prev);
        return effects[(currentIndex + 1) % effects.length];
      });
    };

    if (demoActive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [demoActive]);

  const getEffectColor = () => {
    switch (currentEffect) {
      case 'particles': return '#00ffff';
      case 'ripples': return '#ff6b6b';
      case 'neural': return '#4ecdc4';
      case 'quantum': return '#a855f7';
    }
  };

  return (
    <>
      {/* Demo Control Panel */}
      <motion.div
        className="fixed top-20 right-4 z-50 backdrop-blur-xl bg-black/80 border border-cyan-400/30 rounded-xl p-4 shadow-2xl"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="space-y-3">
          <h3 className="text-cyan-300 font-semibold text-sm">Consciousness Demo</h3>
          
          <button
            onClick={() => setDemoActive(!demoActive)}
            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              demoActive 
                ? 'bg-green-500/20 text-green-300 border border-green-400/50' 
                : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
            }`}
          >
            {demoActive ? 'Demo Active' : 'Start Demo'}
          </button>
          
          {demoActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <div className="text-xs text-gray-400">
                <div>Effect: {currentEffect}</div>
                <div>Interactions: {interactions}</div>
                <div>Trails: {mouseTrails.length}</div>
              </div>
              
              <div className="text-xs text-cyan-300">
                Move mouse and click to see consciousness effects
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Mouse Trails */}
      <AnimatePresence>
        {mouseTrails.map(trail => (
          <motion.div
            key={trail.id}
            className="fixed w-4 h-4 rounded-full pointer-events-none z-40"
            style={{
              left: trail.x - 8,
              top: trail.y - 8,
              backgroundColor: getEffectColor(),
              boxShadow: `0 0 20px ${getEffectColor()}`
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Dynamic Background Effects */}
      {demoActive && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {currentEffect === 'particles' && (
            <div className="absolute inset-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: getEffectColor(),
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: Math.random() * 4,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          )}

          {currentEffect === 'ripples' && interactions > 0 && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${getEffectColor()}15 0%, transparent 70%)`
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          {currentEffect === 'neural' && (
            <svg className="absolute inset-0 w-full h-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.line
                  key={`neural-${i}`}
                  x1={`${Math.random() * 100}%`}
                  y1={`${Math.random() * 100}%`}
                  x2={`${Math.random() * 100}%`}
                  y2={`${Math.random() * 100}%`}
                  stroke={getEffectColor()}
                  strokeWidth="1"
                  opacity="0.3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.2
                  }}
                />
              ))}
            </svg>
          )}

          {currentEffect === 'quantum' && (
            <div className="absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={`quantum-${i}`}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: getEffectColor(),
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 2, 0],
                    rotate: [0, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {demoActive && (
        <motion.div
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 backdrop-blur-xl bg-black/80 border border-purple-400/30 rounded-xl p-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="text-purple-300 text-sm">
            <div className="font-semibold mb-1">🧠 Consciousness Active</div>
            <div>Move your mouse around and click to experience reactive effects</div>
            <div className="text-xs text-gray-400 mt-1">
              Current mode: {currentEffect} • Click to cycle effects
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}