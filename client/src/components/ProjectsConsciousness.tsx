/**
 * Projects-Specific Consciousness Component
 * AI-enhanced consciousness for project showcase
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProjectsConsciousnessProps {
  globalConsciousness: any;
  onCreativityEvolution?: (creativity: any) => void;
}

export default function ProjectsConsciousness({ 
  globalConsciousness, 
  onCreativityEvolution 
}: ProjectsConsciousnessProps) {
  const [projectCreativity, setProjectCreativity] = useState({
    innovation: 88,
    execution: 92,
    breakthrough: 94
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProjectCreativity(prev => {
        const newCreativity = {
          innovation: Math.min(prev.innovation + Math.random() * 2, 100),
          execution: Math.min(prev.execution + Math.random() * 1, 100),
          breakthrough: Math.min(prev.breakthrough + Math.random() * 1.5, 100)
        };
        
        if (onCreativityEvolution) {
          onCreativityEvolution(newCreativity);
        }
        
        return newCreativity;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [onCreativityEvolution]);

  return (
    <motion.div 
      className="fixed top-4 right-4 bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 text-xs"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="text-purple-400 font-semibold mb-2">Project Consciousness</div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-300">Innovation:</span>
          <span className="text-white">{Math.round(projectCreativity.innovation)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Execution:</span>
          <span className="text-white">{Math.round(projectCreativity.execution)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Breakthrough:</span>
          <span className="text-white">{Math.round(projectCreativity.breakthrough)}%</span>
        </div>
      </div>
    </motion.div>
  );
}