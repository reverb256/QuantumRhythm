/**
 * Philosophy-Specific Consciousness Component
 * AI-enhanced consciousness for philosophical exploration
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PhilosophyConsciousnessProps {
  globalConsciousness: any;
  onWisdomEvolution?: (wisdom: any) => void;
}

export default function PhilosophyConsciousness({ 
  globalConsciousness, 
  onWisdomEvolution 
}: PhilosophyConsciousnessProps) {
  const [philosophyWisdom, setPhilosophyWisdom] = useState({
    depth: 85,
    clarity: 90,
    transcendence: 92,
    connection: 88
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPhilosophyWisdom(prev => {
        const newWisdom = {
          depth: Math.min(prev.depth + Math.random() * 1.5, 100),
          clarity: Math.min(prev.clarity + Math.random() * 1, 100),
          transcendence: Math.min(prev.transcendence + Math.random() * 2, 100),
          connection: Math.min(prev.connection + Math.random() * 1.2, 100)
        };
        
        if (onWisdomEvolution) {
          onWisdomEvolution(newWisdom);
        }
        
        return newWisdom;
      });
    }, 9000);

    return () => clearInterval(interval);
  }, [onWisdomEvolution]);

  return (
    <motion.div 
      className="fixed top-4 right-4 bg-gray-900/80 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 text-xs"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="text-blue-400 font-semibold mb-2">Philosophy Consciousness</div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-300">Depth:</span>
          <span className="text-white">{Math.round(philosophyWisdom.depth)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Clarity:</span>
          <span className="text-white">{Math.round(philosophyWisdom.clarity)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Transcendence:</span>
          <span className="text-white">{Math.round(philosophyWisdom.transcendence)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Connection:</span>
          <span className="text-white">{Math.round(philosophyWisdom.connection)}%</span>
        </div>
      </div>
    </motion.div>
  );
}