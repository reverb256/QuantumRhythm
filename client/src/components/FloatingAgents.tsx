/**
 * Floating Agents - Gaming-inspired characters that move around screen edges
 * Emergent AI personalities with TTS communication and battle capabilities
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useLocation } from 'wouter';
import { getAgentOrchestrator, AgentPersonality, AgentType, AgentMessage } from '../services/agent-orchestrator';
import { MessageCircle, Volume2, VolumeX, Swords, Heart, Zap, Shield, Star } from 'lucide-react';
import AgentBattleArena from './AgentBattleArena';

interface FloatingAgentProps {
  agent: AgentPersonality;
  position: { x: number; y: number };
  isActive: boolean;
  onInteract: (agentType: AgentType) => void;
  onBattleRequest: (agentType: AgentType) => void;
}

interface AgentChatState {
  isOpen: boolean;
  targetAgent: AgentType | null;
  messages: AgentMessage[];
  inputValue: string;
}

const FloatingAgent: React.FC<FloatingAgentProps> = ({ 
  agent, 
  position, 
  isActive, 
  onInteract, 
  onBattleRequest 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<'idle' | 'talking' | 'excited' | 'combat'>('idle');
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    // Animate agent based on current state
    const animateAgent = async () => {
      switch (currentAnimation) {
        case 'idle':
          await controls.start({
            y: [0, -5, 0],
            rotate: [0, 2, -2, 0],
            scale: 1,
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          });
          break;
        case 'talking':
          await controls.start({
            scale: [1, 1.1, 1],
            transition: { duration: 0.5, repeat: 3 }
          });
          break;
        case 'excited':
          await controls.start({
            y: [0, -10, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            transition: { duration: 1 }
          });
          break;
        case 'combat':
          await controls.start({
            x: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
            transition: { duration: 0.3, repeat: 5 }
          });
          break;
      }
    };

    animateAgent();
  }, [currentAnimation, controls]);

  const getAgentIcon = () => {
    const iconMap = {
      portal: <Zap className="w-6 h-6" />,
      analyst: <Shield className="w-6 h-6" />,
      creator: <Star className="w-6 h-6" />,
      sage: <Heart className="w-6 h-6" />,
      navigator: <MessageCircle className="w-6 h-6" />
    };
    return iconMap[agent.type] || <MessageCircle className="w-6 h-6" />;
  };

  const getGameStyleBorder = () => {
    const styleMap = {
      genshin: 'border-gradient-genshin',
      honkai: 'border-gradient-honkai', 
      zzz: 'border-gradient-zzz',
      wow: 'border-gradient-wow',
      ffxiv: 'border-gradient-ffxiv'
    };
    return styleMap[agent.gameInspiration] || 'border-gradient-genshin';
  };

  return (
    <motion.div
      className="fixed z-40 cursor-pointer select-none"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      animate={controls}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onInteract(agent.type)}
      onDoubleClick={() => onBattleRequest(agent.type)}
    >
      {/* Agent Avatar Container */}
      <div className="relative group">
        {/* Aura Effect */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            background: `radial-gradient(circle, ${agent.visualStyle.primaryColor}40, transparent)`,
            filter: 'blur(8px)'
          }}
          animate={{
            scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: isHovered ? [0.6, 0.9, 0.6] : [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Agent Avatar */}
        <motion.div
          className={`relative w-16 h-16 rounded-full border-3 ${getGameStyleBorder()} 
                     bg-black/80 backdrop-blur-sm flex items-center justify-center
                     ${isActive ? 'ring-2 ring-cyan-400 ring-opacity-60' : ''}`}
          style={{ 
            borderColor: agent.visualStyle.primaryColor,
            boxShadow: `0 0 20px ${agent.visualStyle.primaryColor}50`
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Agent Icon */}
          <div 
            className="text-white relative z-10"
            style={{ color: agent.visualStyle.accentColor }}
          >
            {getAgentIcon()}
          </div>

          {/* Activity Indicator */}
          {isActive && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}

          {/* Combat Ready Indicator */}
          <motion.div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black opacity-0 group-hover:opacity-100"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Swords className="w-2 h-2 text-white m-1" />
          </motion.div>
        </motion.div>

        {/* Agent Name Tag */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 
                         bg-black/90 border border-cyan-400/50 rounded-lg px-3 py-1 
                         pointer-events-none whitespace-nowrap"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-cyan-400 font-semibold text-sm">{agent.name}</div>
              <div className="text-gray-400 text-xs capitalize">{agent.type}</div>
              <div className="text-xs text-gray-500">{agent.gameInspiration.toUpperCase()}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Speech Bubble */}
        <AnimatePresence>
          {speechBubble && (
            <motion.div
              className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 
                         bg-black/95 border border-cyan-400/50 rounded-lg px-3 py-2 
                         max-w-[200px] pointer-events-none"
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-white text-sm">{speechBubble}</div>
              {/* Speech bubble arrow */}
              <div 
                className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 
                           w-0 h-0 border-l-8 border-r-8 border-b-8 
                           border-l-transparent border-r-transparent border-b-black/95"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export function FloatingAgents() {
  const [location] = useLocation();
  const [agents, setAgents] = useState<AgentPersonality[]>([]);
  const [agentPositions, setAgentPositions] = useState<Record<AgentType, { x: number; y: number }>>({
    portal: { x: 10, y: 5 },
    analyst: { x: 90, y: 20 },
    creator: { x: 10, y: 95 },
    sage: { x: 90, y: 80 },
    navigator: { x: 50, y: 5 }
  });
  const [chatState, setChatState] = useState<AgentChatState>({
    isOpen: false,
    targetAgent: null,
    messages: [],
    inputValue: ''
  });
  const [battleArenaOpen, setBattleArenaOpen] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [recentMessages, setRecentMessages] = useState<AgentMessage[]>([]);

  const orchestrator = getAgentOrchestrator();
  const positionUpdateRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    initializeAgentsForPage();
    startPositionUpdates();

    return () => {
      if (positionUpdateRef.current) {
        clearInterval(positionUpdateRef.current);
      }
    };
  }, [location]);

  const initializeAgentsForPage = async () => {
    // Determine which agent should be activated based on current page
    const pageAgentMap: Record<string, AgentType> = {
      '/': 'portal',
      '/philosophy': 'sage',
      '/projects': 'creator',
      '/consciousness-map': 'navigator',
      '/dashboard': 'analyst',
      '/trading': 'analyst',
      '/defi': 'analyst'
    };

    const primaryAgent = pageAgentMap[location] || 'portal';
    
    // Activate the primary agent for this page
    const activatedAgent = await orchestrator.activateAgent(primaryAgent);
    
    // Get all active agents
    const activeAgents = orchestrator.getActiveAgents();
    setAgents(activeAgents);

    // Generate initial positions for agents along screen edges
    generateAgentPositions(activeAgents);

    // Get recent messages
    const messages = orchestrator.getRecentMessages(10);
    setRecentMessages(messages);
  };

  const generateAgentPositions = (activeAgents: AgentPersonality[]) => {
    const positions: Record<AgentType, { x: number; y: number }> = {
      portal: { x: 10, y: 5 },
      analyst: { x: 90, y: 20 },
      creator: { x: 10, y: 95 },
      sage: { x: 90, y: 80 },
      navigator: { x: 50, y: 5 }
    };
    
    activeAgents.forEach((agent, index) => {
      // Position agents along screen edges in a strategic formation
      const edge = index % 4; // 0: top, 1: right, 2: bottom, 3: left
      const offset = (index + 1) * (100 / (activeAgents.length + 1));
      
      switch (edge) {
        case 0: // Top edge
          positions[agent.type] = { x: Math.min(90, Math.max(10, offset)), y: 5 };
          break;
        case 1: // Right edge
          positions[agent.type] = { x: 95, y: Math.min(90, Math.max(10, offset)) };
          break;
        case 2: // Bottom edge
          positions[agent.type] = { x: Math.min(90, Math.max(10, offset)), y: 95 };
          break;
        case 3: // Left edge
          positions[agent.type] = { x: 5, y: Math.min(90, Math.max(10, offset)) };
          break;
      }
    });
    
    setAgentPositions(positions);
  };

  const startPositionUpdates = () => {
    // Subtle position changes to make agents feel alive
    positionUpdateRef.current = setInterval(() => {
      setAgentPositions(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(agentType => {
          const pos = updated[agentType as AgentType];
          // Small random movements within bounds
          const deltaX = (Math.random() - 0.5) * 2;
          const deltaY = (Math.random() - 0.5) * 2;
          
          pos.x = Math.max(3, Math.min(97, pos.x + deltaX));
          pos.y = Math.max(3, Math.min(97, pos.y + deltaY));
        });
        return updated;
      });
    }, 8000); // Update every 8 seconds
  };

  const handleAgentInteract = async (agentType: AgentType) => {
    setChatState({
      isOpen: true,
      targetAgent: agentType,
      messages: recentMessages.filter(msg => 
        msg.from === agentType || 
        (Array.isArray(msg.to) ? msg.to.includes(agentType) : msg.to === agentType)
      ),
      inputValue: ''
    });

    // Generate a spontaneous greeting or observation
    const agent = agents.find(a => a.type === agentType);
    if (agent) {
      const observation = await orchestrator.generateAgentObservation(
        agentType, 
        `User clicked on ${agent.name} while on ${location} page`
      );
      
      if (observation) {
        setRecentMessages(prev => [...prev, observation]);
        
        // Synthesize TTS if enabled
        if (isTTSEnabled) {
          synthesizeSpeech(observation.content);
        }
      }
    }
  };

  const handleBattleRequest = async (agentType: AgentType) => {
    setBattleArenaOpen(true);
  };

  const handleSendMessage = async () => {
    if (!chatState.inputValue.trim() || !chatState.targetAgent) return;

    const responses = await orchestrator.processUserMessage(
      chatState.inputValue, 
      chatState.targetAgent
    );

    setChatState(prev => ({
      ...prev,
      inputValue: '',
      messages: [...prev.messages, ...responses]
    }));

    setRecentMessages(prev => [...prev, ...responses]);

    // TTS for agent responses
    if (isTTSEnabled && responses.length > 0) {
      responses.forEach(response => {
        setTimeout(() => synthesizeSpeech(response.content), 500);
      });
    }
  };

  const synthesizeSpeech = async (text: string) => {
    // Placeholder for AI TTS integration
    // Would use services like ElevenLabs, Murf, or browser Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateAgentGossip = async () => {
    const gossipMessages = await orchestrator.generateAgentGossip();
    setRecentMessages(prev => [...prev, ...gossipMessages]);
  };

  // Auto-generate agent gossip periodically
  useEffect(() => {
    const gossipInterval = setInterval(generateAgentGossip, 30000); // Every 30 seconds
    return () => clearInterval(gossipInterval);
  }, []);

  return (
    <>
      {/* Floating Agent Characters */}
      <AnimatePresence>
        {agents.map(agent => (
          <FloatingAgent
            key={agent.id}
            agent={agent}
            position={agentPositions[agent.type] || { x: 50, y: 50 }}
            isActive={true}
            onInteract={handleAgentInteract}
            onBattleRequest={handleBattleRequest}
          />
        ))}
      </AnimatePresence>

      {/* Agent Chat Interface */}
      <AnimatePresence>
        {chatState.isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 w-80 h-96 bg-black/95 border border-cyan-400/50 
                       rounded-lg backdrop-blur-md z-50 flex flex-col"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 border-b border-cyan-400/30">
              <div className="flex items-center space-x-2">
                <div className="text-cyan-400 font-semibold">
                  {agents.find(a => a.type === chatState.targetAgent)?.name || 'Agent'}
                </div>
                <div className="text-xs text-gray-400 capitalize">
                  {chatState.targetAgent}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                  className="text-gray-400 hover:text-cyan-400"
                >
                  {isTTSEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setChatState(prev => ({ ...prev, isOpen: false }))}
                  className="text-gray-400 hover:text-red-400"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatState.messages.map(message => (
                <div key={message.id} className="text-sm">
                  <div className="text-cyan-400 font-medium text-xs">
                    {agents.find(a => a.type === message.from)?.name || message.from}
                  </div>
                  <div className="text-white bg-gray-800/50 rounded p-2 mt-1">
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-cyan-400/30">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatState.inputValue}
                  onChange={(e) => setChatState(prev => ({ ...prev, inputValue: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Talk to the agent..."
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

      {/* Battle Arena */}
      {battleArenaOpen && (
        <AgentBattleArena />
      )}

      {/* Agent Activity Monitor */}
      <div className="fixed top-20 right-4 z-30">
        <motion.div
          className="bg-black/80 border border-cyan-400/30 rounded-lg p-2 text-xs"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-cyan-400 font-semibold mb-1">Agent Activity</div>
          <div className="space-y-1">
            {agents.map(agent => (
              <div key={agent.id} className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: agent.visualStyle.primaryColor }}
                />
                <span className="text-white text-xs">{agent.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gaming Style CSS */}
      <style>{`
        .border-gradient-genshin {
          border-image: linear-gradient(45deg, #4ade80, #06b6d4) 1;
        }
        .border-gradient-honkai {
          border-image: linear-gradient(45deg, #8b5cf6, #ec4899) 1;
        }
        .border-gradient-zzz {
          border-image: linear-gradient(45deg, #f59e0b, #ef4444) 1;
        }
        .border-gradient-wow {
          border-image: linear-gradient(45deg, #fbbf24, #dc2626) 1;
        }
        .border-gradient-ffxiv {
          border-image: linear-gradient(45deg, #6366f1, #8b5cf6) 1;
        }
      `}</style>
    </>
  );
}

export default FloatingAgents;