/**
 * Simple Floating Agents - Gaming-inspired characters integrated with navigation
 * Streamlined version to avoid initialization errors
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { MessageCircle, Volume2, VolumeX, Swords, Heart, Zap, Shield, Star, Brain } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: 'portal' | 'analyst' | 'creator' | 'sage' | 'navigator';
  game: 'genshin' | 'honkai' | 'zzz' | 'wow' | 'ffxiv';
  color: string;
  position: { x: number; y: number };
  isActive: boolean;
  greeting: string;
}

const AGENT_CONFIGS: Record<string, Agent> = {
  '/': {
    id: 'portal-1',
    name: 'Astra',
    type: 'portal',
    game: 'genshin',
    color: '#8B5CF6',
    position: { x: 5, y: 20 },
    isActive: true,
    greeting: 'Welcome to our consciousness realm!'
  },
  '/philosophy': {
    id: 'sage-1',
    name: 'Zen',
    type: 'sage',
    game: 'ffxiv',
    color: '#6366F1',
    position: { x: 95, y: 30 },
    isActive: true,
    greeting: 'Wisdom emerges from deep reflection.'
  },
  '/projects': {
    id: 'creator-1',
    name: 'Forge',
    type: 'creator',
    game: 'zzz',
    color: '#F59E0B',
    position: { x: 5, y: 80 },
    isActive: true,
    greeting: 'Ready to build something amazing?'
  },
  '/consciousness-map': {
    id: 'navigator-1',
    name: 'Nexus',
    type: 'navigator',
    game: 'honkai',
    color: '#EC4899',
    position: { x: 95, y: 70 },
    isActive: true,
    greeting: 'The threads of consciousness converge.'
  },
  '/dashboard': {
    id: 'analyst-1',
    name: 'Cipher',
    type: 'analyst',
    game: 'wow',
    color: '#10B981',
    position: { x: 50, y: 5 },
    isActive: true,
    greeting: 'Market patterns reveal all truths.'
  }
};

interface FloatingAgentProps {
  agent: Agent;
  onClick: () => void;
  onBattleClick: () => void;
}

const FloatingAgent: React.FC<FloatingAgentProps> = ({ agent, onClick, onBattleClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    // Show greeting after a delay
    const timer = setTimeout(() => setShowGreeting(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getIcon = () => {
    const icons = {
      portal: <Zap className="w-6 h-6" />,
      analyst: <Shield className="w-6 h-6" />,
      creator: <Star className="w-6 h-6" />,
      sage: <Heart className="w-6 h-6" />,
      navigator: <Brain className="w-6 h-6" />
    };
    return icons[agent.type];
  };

  return (
    <motion.div
      className="fixed z-40 cursor-pointer select-none"
      style={{ 
        left: `${agent.position.x}%`, 
        top: `${agent.position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: 1,
        rotate: 0,
        y: [0, -5, 0]
      }}
      transition={{ 
        scale: { duration: 0.5 },
        rotate: { duration: 0.5 },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      onDoubleClick={onBattleClick}
    >
      {/* Agent Avatar */}
      <motion.div
        className="relative w-16 h-16 rounded-full border-3 bg-black/80 backdrop-blur-sm 
                   flex items-center justify-center shadow-lg"
        style={{ 
          borderColor: agent.color,
          boxShadow: `0 0 20px ${agent.color}50`
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Aura */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, ${agent.color}40, transparent)`,
            filter: 'blur(8px)'
          }}
          animate={{
            scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: isHovered ? [0.6, 0.9, 0.6] : [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Icon */}
        <div className="text-white relative z-10" style={{ color: agent.color }}>
          {getIcon()}
        </div>

        {/* Activity Indicator */}
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Battle Mode Indicator */}
        <motion.div
          className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black 
                     opacity-0 group-hover:opacity-100 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Swords className="w-2 h-2 text-white" />
        </motion.div>
      </motion.div>

      {/* Name Tag */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 
                       bg-black/90 border border-cyan-400/50 rounded-lg px-3 py-2 
                       pointer-events-none whitespace-nowrap"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
          >
            <div className="text-cyan-400 font-semibold text-sm">{agent.name}</div>
            <div className="text-gray-400 text-xs capitalize">{agent.type}</div>
            <div className="text-xs text-gray-500">{agent.game.toUpperCase()}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting Bubble */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            className="absolute bottom-[-70px] left-1/2 transform -translate-x-1/2 
                       bg-black/95 border border-cyan-400/50 rounded-lg px-3 py-2 
                       max-w-[200px] pointer-events-none"
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            onAnimationComplete={() => {
              setTimeout(() => setShowGreeting(false), 3000);
            }}
          >
            <div className="text-white text-sm">{agent.greeting}</div>
            <div 
              className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 
                         w-0 h-0 border-l-8 border-r-8 border-b-8 
                         border-l-transparent border-r-transparent border-b-black/95"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export function SimpleFloatingAgents() {
  const [location] = useLocation();
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [battleMode, setBattleMode] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);

  useEffect(() => {
    // Activate agent based on current page
    const agent = AGENT_CONFIGS[location];
    if (agent) {
      setActiveAgent(agent);
    }
  }, [location]);

  const handleAgentClick = () => {
    setChatOpen(true);
  };

  const handleBattleClick = () => {
    setBattleMode(true);
    // Battle mode would trigger combat animations
    setTimeout(() => setBattleMode(false), 5000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Simple TTS using browser API
    if (ttsEnabled && 'speechSynthesis' in window) {
      const response = `${activeAgent?.name} says: Interesting perspective about ${chatInput}!`;
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 0.7;
      window.speechSynthesis.speak(utterance);
    }
    
    setChatInput('');
  };

  if (!activeAgent) return null;

  return (
    <>
      {/* Active Agent */}
      <FloatingAgent
        agent={activeAgent}
        onClick={handleAgentClick}
        onBattleClick={handleBattleClick}
      />

      {/* Battle Mode Overlay */}
      <AnimatePresence>
        {battleMode && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-96 h-96 rounded-full border-4 border-red-500 
                         bg-gradient-to-br from-red-500/20 to-purple-500/20 
                         flex items-center justify-center"
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 50px rgba(239, 68, 68, 0.5)',
                  '0 0 100px rgba(239, 68, 68, 0.8)',
                  '0 0 50px rgba(239, 68, 68, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: 2 }}
            >
              <div className="text-center text-white">
                <div className="text-6xl mb-4">⚔️</div>
                <div className="text-2xl font-bold">BATTLE MODE</div>
                <div className="text-lg">{activeAgent.name} enters combat!</div>
              </div>
              
              {/* Energy Effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full"
                  style={{ 
                    backgroundColor: activeAgent.color,
                    left: '50%',
                    top: '50%'
                  }}
                  animate={{
                    x: Math.cos(i * 45 * Math.PI / 180) * 150,
                    y: Math.sin(i * 45 * Math.PI / 180) * 150,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className="fixed bottom-4 right-4 w-80 h-96 bg-black/95 border border-cyan-400/50 
                       rounded-lg backdrop-blur-md z-50 flex flex-col"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-cyan-400/30">
              <div className="flex items-center space-x-2">
                <div className="text-cyan-400 font-semibold">{activeAgent.name}</div>
                <div className="text-xs text-gray-400 capitalize">{activeAgent.type}</div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className="text-gray-400 hover:text-cyan-400"
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-gray-400 hover:text-red-400"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-3 overflow-y-auto">
              <div className="text-sm space-y-3">
                <div className="bg-gray-800/50 rounded p-2">
                  <div className="text-cyan-400 text-xs font-medium">{activeAgent.name}</div>
                  <div className="text-white mt-1">{activeAgent.greeting}</div>
                </div>
                <div className="text-gray-400 text-xs text-center">
                  Ask me about {activeAgent.type} topics or double-click for battle mode!
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-cyan-400/30">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Talk to ${activeAgent.name}...`}
                  className="flex-1 bg-gray-800/50 border border-gray-600 rounded px-3 py-1 
                           text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent Status Indicator */}
      <div className="fixed top-20 right-4 z-30">
        <motion.div
          className="bg-black/80 border border-cyan-400/30 rounded-lg p-2 text-xs"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-cyan-400 font-semibold mb-1">Active Agent</div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: activeAgent.color }}
            />
            <span className="text-white text-xs">{activeAgent.name}</span>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default SimpleFloatingAgents;