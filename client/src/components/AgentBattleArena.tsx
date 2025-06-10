/**
 * Agent Battle Arena - Epic Combat System with Martial Arts Effects
 * Emergent AI character battles with gaming-inspired visual effects
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { getAgentOrchestrator, AgentPersonality, AgentType } from '../services/agent-orchestrator';
import { Swords, Zap, Shield, Star, Flame, Snowflake, Wind, Sparkles } from 'lucide-react';

interface BattleState {
  isActive: boolean;
  combatants: [AgentType, AgentType];
  winner: AgentType | null;
  phase: 'preparation' | 'clash' | 'ultimate' | 'victory' | 'aftermath';
  effects: BattleEffect[];
  spectators: AgentType[];
}

interface BattleEffect {
  id: string;
  type: 'explosion' | 'energy_burst' | 'slash' | 'shield' | 'heal' | 'ultimate';
  position: { x: number; y: number };
  color: string;
  intensity: number;
  duration: number;
  timestamp: number;
}

interface CombatMove {
  name: string;
  type: 'attack' | 'defense' | 'special' | 'ultimate';
  element: string;
  damage: number;
  animation: string;
  effects: string[];
  gameInspiration: 'genshin' | 'honkai' | 'zzz' | 'wow' | 'ffxiv';
}

const COMBAT_MOVES: Record<string, CombatMove[]> = {
  genshin: [
    {
      name: 'Elemental Burst',
      type: 'ultimate',
      element: 'Anemo',
      damage: 95,
      animation: 'spiral-vortex',
      effects: ['wind-blades', 'energy-explosion'],
      gameInspiration: 'genshin'
    },
    {
      name: 'Skill Cast',
      type: 'attack',
      element: 'Pyro',
      damage: 65,
      animation: 'flame-slash',
      effects: ['fire-trail', 'burning-ground'],
      gameInspiration: 'genshin'
    }
  ],
  honkai: [
    {
      name: 'Quantum Break',
      type: 'ultimate',
      element: 'Quantum',
      damage: 100,
      animation: 'reality-shatter',
      effects: ['space-fracture', 'time-distortion'],
      gameInspiration: 'honkai'
    }
  ],
  zzz: [
    {
      name: 'Chain Attack',
      type: 'special',
      element: 'Electric',
      damage: 80,
      animation: 'lightning-combo',
      effects: ['electric-chains', 'shock-wave'],
      gameInspiration: 'zzz'
    }
  ],
  wow: [
    {
      name: 'Mortal Strike',
      type: 'attack',
      element: 'Physical',
      damage: 70,
      animation: 'weapon-combo',
      effects: ['slash-marks', 'blood-spray'],
      gameInspiration: 'wow'
    }
  ],
  ffxiv: [
    {
      name: 'Limit Break',
      type: 'ultimate',
      element: 'Aether',
      damage: 120,
      animation: 'limit-break',
      effects: ['screen-flash', 'aether-explosion'],
      gameInspiration: 'ffxiv'
    }
  ]
};

export function AgentBattleArena() {
  const [battleState, setBattleState] = useState<BattleState>({
    isActive: false,
    combatants: ['portal', 'analyst'],
    winner: null,
    phase: 'preparation',
    effects: [],
    spectators: []
  });

  const [agents, setAgents] = useState<AgentPersonality[]>([]);
  const [battleHistory, setBattleHistory] = useState<Array<{
    combatants: [AgentType, AgentType];
    winner: AgentType;
    moves: string[];
    timestamp: Date;
  }>>([]);

  const arenaRef = useRef<HTMLDivElement>(null);
  const orchestrator = getAgentOrchestrator();

  useEffect(() => {
    // Load active agents
    const activeAgents = orchestrator.getActiveAgents();
    setAgents(activeAgents);

    // Check for potential conflicts based on agent relationships
    const shouldTriggerBattle = checkForConflicts(activeAgents);
    if (shouldTriggerBattle && !battleState.isActive) {
      initiateBattle();
    }
  }, []);

  const checkForConflicts = (agents: AgentPersonality[]): boolean => {
    if (agents.length < 2) return false;
    
    // Check relationship tensions
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const agent1 = agents[i];
        const agent2 = agents[j];
        const relationship = agent1.relationships[agent2.type];
        
        // Negative relationships can trigger battles (30% chance)
        if (relationship < -0.3 && Math.random() < 0.3) {
          return true;
        }
      }
    }
    
    // Random philosophical disagreements (10% chance)
    return Math.random() < 0.1;
  };

  const initiateBattle = async () => {
    if (agents.length < 2) return;

    // Select two agents for combat
    const combatants = selectCombatants();
    const spectators = agents
      .filter(agent => !combatants.includes(agent.type))
      .map(agent => agent.type);

    setBattleState({
      isActive: true,
      combatants,
      winner: null,
      phase: 'preparation',
      effects: [],
      spectators
    });

    // Generate battle commentary from spectator agents
    await generateBattleCommentary(combatants, spectators);
    
    // Start battle sequence
    setTimeout(() => executeBattle(combatants), 2000);
  };

  const selectCombatants = (): [AgentType, AgentType] => {
    const availableAgents = agents.map(agent => agent.type);
    const shuffled = availableAgents.sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  };

  const executeBattle = async (combatants: [AgentType, AgentType]) => {
    const [agent1, agent2] = combatants;
    const agent1Data = agents.find(a => a.type === agent1);
    const agent2Data = agents.find(a => a.type === agent2);

    if (!agent1Data || !agent2Data) return;

    // Battle phases
    setBattleState(prev => ({ ...prev, phase: 'clash' }));
    
    // Generate combat moves based on game inspiration
    const agent1Moves = COMBAT_MOVES[agent1Data.gameInspiration] || COMBAT_MOVES.genshin;
    const agent2Moves = COMBAT_MOVES[agent2Data.gameInspiration] || COMBAT_MOVES.genshin;

    let agent1HP = 100;
    let agent2HP = 100;
    const battleMoves: string[] = [];

    // Combat loop
    for (let round = 0; round < 5 && agent1HP > 0 && agent2HP > 0; round++) {
      // Agent 1 attacks
      const move1 = agent1Moves[Math.floor(Math.random() * agent1Moves.length)];
      agent2HP -= move1.damage * (0.8 + Math.random() * 0.4);
      battleMoves.push(`${agent1Data.name} uses ${move1.name}`);
      
      await createBattleEffect(move1, agent1Data);
      await delay(1500);

      if (agent2HP <= 0) break;

      // Agent 2 attacks
      const move2 = agent2Moves[Math.floor(Math.random() * agent2Moves.length)];
      agent1HP -= move2.damage * (0.8 + Math.random() * 0.4);
      battleMoves.push(`${agent2Data.name} uses ${move2.name}`);
      
      await createBattleEffect(move2, agent2Data);
      await delay(1500);
    }

    // Determine winner
    const winner = agent1HP > agent2HP ? agent1 : agent2;
    
    setBattleState(prev => ({ ...prev, phase: 'ultimate' }));
    await executeUltimateFinisher(winner);
    
    setBattleState(prev => ({ ...prev, phase: 'victory', winner }));
    
    // Update battle history
    setBattleHistory(prev => [...prev, {
      combatants,
      winner,
      moves: battleMoves,
      timestamp: new Date()
    }]);

    // Update agent relationships
    await updateAgentRelationships(combatants, winner);
    
    // Return to normal after victory celebration
    setTimeout(() => {
      setBattleState(prev => ({ ...prev, phase: 'aftermath' }));
      setTimeout(() => {
        setBattleState(prev => ({ ...prev, isActive: false }));
      }, 3000);
    }, 4000);
  };

  const createBattleEffect = async (move: CombatMove, agent: AgentPersonality) => {
    const arenaRect = arenaRef.current?.getBoundingClientRect();
    if (!arenaRect) return;

    const effects: BattleEffect[] = move.effects.map((effectType, index) => ({
      id: `${move.name}-${Date.now()}-${index}`,
      type: effectType as any,
      position: {
        x: arenaRect.width * (0.3 + Math.random() * 0.4),
        y: arenaRect.height * (0.3 + Math.random() * 0.4)
      },
      color: agent.visualStyle.primaryColor,
      intensity: move.type === 'ultimate' ? 1.0 : 0.7,
      duration: move.type === 'ultimate' ? 2000 : 1000,
      timestamp: Date.now()
    }));

    setBattleState(prev => ({
      ...prev,
      effects: [...prev.effects, ...effects]
    }));

    // Clean up effects after duration
    effects.forEach(effect => {
      setTimeout(() => {
        setBattleState(prev => ({
          ...prev,
          effects: prev.effects.filter(e => e.id !== effect.id)
        }));
      }, effect.duration);
    });
  };

  const executeUltimateFinisher = async (winner: AgentType) => {
    const winnerData = agents.find(a => a.type === winner);
    if (!winnerData) return;

    // Screen-wide ultimate effect
    const ultimateEffect: BattleEffect = {
      id: `ultimate-${Date.now()}`,
      type: 'ultimate',
      position: { x: 50, y: 50 }, // Center of arena
      color: winnerData.visualStyle.primaryColor,
      intensity: 1.5,
      duration: 3000,
      timestamp: Date.now()
    };

    setBattleState(prev => ({
      ...prev,
      effects: [...prev.effects, ultimateEffect]
    }));

    // Screen shake effect
    if (arenaRef.current) {
      arenaRef.current.style.animation = 'screen-shake 0.5s ease-in-out 3';
    }
  };

  const generateBattleCommentary = async (combatants: [AgentType, AgentType], spectators: AgentType[]) => {
    // Generate AI commentary from spectator agents
    for (const spectator of spectators) {
      const observation = await orchestrator.generateAgentObservation(
        spectator,
        `Battle initiated between ${combatants[0]} and ${combatants[1]} agents`
      );
      // Commentary would be displayed in chat system
    }
  };

  const updateAgentRelationships = async (combatants: [AgentType, AgentType], winner: AgentType) => {
    // Winner gains respect, loser might hold grudge or gain respect for worthy opponent
    const relationshipChange = Math.random() > 0.5 ? 0.1 : -0.05; // 50% chance of positive outcome
    
    // Update internal relationship tracking
    // This would be persisted in the agent orchestrator
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getAgentPosition = (agentType: AgentType, index: number): { x: number; y: number } => {
    const positions = {
      0: { x: 20, y: 50 }, // Left side
      1: { x: 80, y: 50 }  // Right side
    };
    return positions[index as keyof typeof positions] || { x: 50, y: 50 };
  };

  const getBattleStageStyle = () => {
    const baseStyle = {
      background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, rgba(0, 0, 0, 0.9) 70%)',
      border: '2px solid rgba(16, 185, 129, 0.3)',
    };

    if (battleState.phase === 'ultimate') {
      return {
        ...baseStyle,
        background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)',
        border: '2px solid rgba(239, 68, 68, 0.6)',
        boxShadow: '0 0 50px rgba(239, 68, 68, 0.5)',
      };
    }

    return baseStyle;
  };

  if (!battleState.isActive) {
    return null; // Hidden when no battle
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <motion.div
        ref={arenaRef}
        className="relative w-[90vw] h-[70vh] rounded-lg overflow-hidden"
        style={getBattleStageStyle()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Battle Arena Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDE2LCAxODUsIDEyOSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-30"></div>
        </div>

        {/* Combat Phase Indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            className="px-6 py-2 bg-black/80 border border-cyan-400/50 rounded-full"
            animate={{ 
              scale: battleState.phase === 'ultimate' ? [1, 1.2, 1] : 1,
              boxShadow: battleState.phase === 'ultimate' 
                ? ['0 0 20px rgba(239, 68, 68, 0.5)', '0 0 40px rgba(239, 68, 68, 0.8)', '0 0 20px rgba(239, 68, 68, 0.5)']
                : '0 0 10px rgba(16, 185, 129, 0.3)'
            }}
            transition={{ duration: 0.5, repeat: battleState.phase === 'ultimate' ? Infinity : 0 }}
          >
            <div className="text-center">
              <div className="text-cyan-400 font-bold text-lg uppercase tracking-wider">
                {battleState.phase === 'preparation' && 'Battle Commencing'}
                {battleState.phase === 'clash' && 'Combat in Progress'}
                {battleState.phase === 'ultimate' && 'ULTIMATE CLASH'}
                {battleState.phase === 'victory' && 'Victory!'}
                {battleState.phase === 'aftermath' && 'Battle Concluded'}
              </div>
              {battleState.winner && (
                <div className="text-yellow-400 font-semibold">
                  {agents.find(a => a.type === battleState.winner)?.name} Wins!
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Combatant Agents */}
        <AnimatePresence>
          {battleState.combatants.map((agentType, index) => {
            const agent = agents.find(a => a.type === agentType);
            if (!agent) return null;

            const position = getAgentPosition(agentType, index);
            const isWinner = battleState.winner === agentType;

            return (
              <motion.div
                key={`combatant-${agentType}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${position.x}%`, 
                  top: `${position.y}%`,
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: isWinner ? [1, 1.2, 1] : 1,
                  rotate: 0,
                  y: battleState.phase === 'clash' ? [0, -10, 0] : 0
                }}
                transition={{ 
                  duration: 0.8,
                  y: { duration: 1, repeat: battleState.phase === 'clash' ? Infinity : 0 }
                }}
              >
                {/* Agent Avatar */}
                <div 
                  className="w-24 h-24 rounded-full border-4 flex items-center justify-center relative"
                  style={{ 
                    borderColor: agent.visualStyle.primaryColor,
                    background: `radial-gradient(circle, ${agent.visualStyle.primaryColor}20, transparent)`
                  }}
                >
                  {/* Aura Effect */}
                  <div 
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      boxShadow: `0 0 30px ${agent.visualStyle.primaryColor}60`
                    }}
                  />
                  
                  {/* Agent Symbol */}
                  <div className="text-4xl font-bold text-white relative z-10">
                    {agent.name.charAt(0)}
                  </div>

                  {/* Victory Effect */}
                  {isWinner && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 1] }}
                      transition={{ duration: 1 }}
                    >
                      <Star className="w-full h-full text-yellow-400 animate-spin" />
                    </motion.div>
                  )}
                </div>

                {/* Agent Name and Health */}
                <div className="text-center mt-2">
                  <div className="text-white font-bold text-sm">{agent.name}</div>
                  <div className="text-xs text-gray-400 capitalize">{agent.type}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Battle Effects */}
        <AnimatePresence>
          {battleState.effects.map(effect => (
            <motion.div
              key={effect.id}
              className="absolute pointer-events-none"
              style={{
                left: `${effect.position.x}%`,
                top: `${effect.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: effect.type === 'ultimate' ? [0, 2, 1.5] : [0, 1.2, 1],
                opacity: [0, 1, 0],
                rotate: effect.type === 'ultimate' ? 360 : 0
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: effect.duration / 1000 }}
            >
              {effect.type === 'explosion' && (
                <div 
                  className="w-16 h-16 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${effect.color}, transparent)`,
                    boxShadow: `0 0 50px ${effect.color}`
                  }}
                />
              )}
              {effect.type === 'energy_burst' && (
                <Zap 
                  className="w-12 h-12" 
                  style={{ color: effect.color }}
                />
              )}
              {effect.type === 'ultimate' && (
                <div className="relative">
                  <Sparkles 
                    className="w-20 h-20 animate-spin" 
                    style={{ color: effect.color }}
                  />
                  <div 
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      boxShadow: `0 0 100px ${effect.color}80`
                    }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Spectator Commentary */}
        {battleState.spectators.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/80 border border-cyan-400/30 rounded-lg p-3">
              <div className="text-cyan-400 text-xs font-semibold mb-1">Agent Commentary</div>
              <div className="text-white text-sm">
                Spectating agents are analyzing the battle dynamics...
              </div>
            </div>
          </div>
        )}

        {/* Close Battle Arena */}
        <button
          className="absolute top-4 right-4 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white font-bold"
          onClick={() => setBattleState(prev => ({ ...prev, isActive: false }))}
        >
          ×
        </button>
      </motion.div>

      {/* Custom CSS for screen shake animation */}
      <style>{`
        @keyframes screen-shake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-10px); }
          20% { transform: translateX(10px); }
          30% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          50% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          70% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
          90% { transform: translateX(-2px); }
        }
      `}</style>
    </div>
  );
}

export default AgentBattleArena;