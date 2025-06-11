/**
 * Game Character Arena - AI-Generated Character Sprites with Battle System
 * Completely rebuilt to eliminate duplicate key issues and implement proper sprite generation
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

interface GameCharacter {
  id: string;
  name: string;
  type: 'mage' | 'warrior' | 'rogue' | 'healer' | 'tank';
  element: 'fire' | 'water' | 'earth' | 'air' | 'light' | 'shadow';
  game: 'genshin' | 'honkai' | 'zzz' | 'wow' | 'ffxiv';
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  state: 'idle' | 'moving' | 'fighting' | 'talking';
  health: number;
  energy: number;
  color: string;
  spriteData: {
    bodyType: 'slim' | 'athletic' | 'robust';
    hairStyle: 'short' | 'long' | 'ponytail' | 'braid';
    eyeColor: string;
    skinTone: string;
    outfit: string;
  };
  target?: { x: number; y: number };
  lastAction: number;
}

interface ChatMessage {
  id: string;
  characterId: string;
  text: string;
  timestamp: number;
  duration: number;
}

interface BattleEffect {
  id: string;
  type: 'spark' | 'explosion' | 'heal' | 'shield';
  position: { x: number; y: number };
  color: string;
  timestamp: number;
}

const CHARACTER_ARCHETYPES = [
  {
    name: 'Zara',
    type: 'mage' as const,
    element: 'fire' as const,
    game: 'genshin' as const,
    color: '#ff6b6b',
    spriteData: {
      bodyType: 'slim' as const,
      hairStyle: 'long' as const,
      eyeColor: '#ff9999',
      skinTone: '#fdbcb4',
      outfit: '#8b0000'
    }
  },
  {
    name: 'Kai',
    type: 'warrior' as const,
    element: 'earth' as const,
    game: 'wow' as const,
    color: '#4ecdc4',
    spriteData: {
      bodyType: 'athletic' as const,
      hairStyle: 'short' as const,
      eyeColor: '#45b7aa',
      skinTone: '#deb887',
      outfit: '#2f4f4f'
    }
  },
  {
    name: 'Luna',
    type: 'healer' as const,
    element: 'light' as const,
    game: 'ffxiv' as const,
    color: '#ffe66d',
    spriteData: {
      bodyType: 'slim' as const,
      hairStyle: 'braid' as const,
      eyeColor: '#ffd700',
      skinTone: '#ffeaa7',
      outfit: '#ffffff'
    }
  },
  {
    name: 'Vex',
    type: 'rogue' as const,
    element: 'shadow' as const,
    game: 'zzz' as const,
    color: '#a8e6cf',
    spriteData: {
      bodyType: 'slim' as const,
      hairStyle: 'ponytail' as const,
      eyeColor: '#6c5ce7',
      skinTone: '#f39c12',
      outfit: '#2d3436'
    }
  },
  {
    name: 'Rex',
    type: 'tank' as const,
    element: 'water' as const,
    game: 'honkai' as const,
    color: '#74b9ff',
    spriteData: {
      bodyType: 'robust' as const,
      hairStyle: 'short' as const,
      eyeColor: '#0984e3',
      skinTone: '#e17055',
      outfit: '#0066cc'
    }
  }
];

function CharacterSprite({ character, size = 64 }: { character: GameCharacter; size?: number }) {
  const { spriteData, element, state, color } = character;
  
  // Generate deterministic variations based on character name
  const seed = character.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variation = (seed % 100) / 100;
  
  const isAnimated = state === 'fighting' || state === 'moving';
  const glowIntensity = state === 'fighting' ? 1 : state === 'talking' ? 0.6 : 0.3;
  
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="character-sprite">
      <defs>
        <radialGradient id={`aura-${character.id}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity={glowIntensity * 0.4} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        
        <filter id={`glow-${character.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Magical aura */}
      <circle 
        cx="32" cy="32" r="30" 
        fill={`url(#aura-${character.id})`}
        className={isAnimated ? "animate-pulse" : ""}
      />

      {/* Body */}
      <ellipse 
        cx="32" cy="45" 
        rx={spriteData.bodyType === 'robust' ? "14" : spriteData.bodyType === 'athletic' ? "12" : "10"} 
        ry="16"
        fill={spriteData.outfit}
        stroke={color} 
        strokeWidth="1"
        filter={`url(#glow-${character.id})`}
      />

      {/* Head */}
      <circle 
        cx="32" cy="24" r="10" 
        fill={spriteData.skinTone}
        stroke={color} 
        strokeWidth="0.5"
      />

      {/* Hair */}
      {spriteData.hairStyle === 'long' && (
        <>
          <path d="M22 20 Q32 8 42 20 Q40 30 32 28 Q24 30 22 20" fill={color} opacity="0.8"/>
          <path d="M20 24 Q22 38 28 42" stroke={color} strokeWidth="4" fill="none" opacity="0.6"/>
          <path d="M44 24 Q42 38 36 42" stroke={color} strokeWidth="4" fill="none" opacity="0.6"/>
        </>
      )}
      
      {spriteData.hairStyle === 'short' && (
        <path d="M22 18 Q32 10 42 18 Q38 24 32 22 Q26 24 22 18" fill={color} opacity="0.8"/>
      )}
      
      {spriteData.hairStyle === 'ponytail' && (
        <>
          <path d="M22 18 Q32 10 42 18 Q38 24 32 22 Q26 24 22 18" fill={color} opacity="0.8"/>
          <ellipse cx="44" cy="20" rx="3" ry="8" fill={color} opacity="0.7"/>
        </>
      )}
      
      {spriteData.hairStyle === 'braid' && (
        <>
          <path d="M22 18 Q32 10 42 18 Q38 24 32 22 Q26 24 22 18" fill={color} opacity="0.8"/>
          <path d="M32 28 Q34 38 32 48" stroke={color} strokeWidth="3" fill="none" opacity="0.7"/>
        </>
      )}

      {/* Eyes */}
      <circle cx="28" cy="22" r="2" fill={spriteData.eyeColor} />
      <circle cx="36" cy="22" r="2" fill={spriteData.eyeColor} />
      <circle cx="28.5" cy="21.5" r="0.8" fill="white" opacity="0.9" />
      <circle cx="36.5" cy="21.5" r="0.8" fill="white" opacity="0.9" />

      {/* Facial expression based on state */}
      {state === 'fighting' && (
        <path d="M26 28 Q32 26 38 28" stroke={color} strokeWidth="1.5" fill="none" />
      )}
      {state === 'talking' && (
        <ellipse cx="32" cy="28" rx="2" ry="1.5" fill={spriteData.skinTone} stroke={color} strokeWidth="0.5" />
      )}
      {(state === 'idle' || state === 'moving') && (
        <path d="M26 28 Q32 30 38 28" stroke={color} strokeWidth="1.5" fill="none" />
      )}

      {/* Element symbol */}
      <g transform="translate(50, 50)" opacity="0.8">
        {element === 'fire' && (
          <path d="M-3 3 L0 -3 L3 3 Q0 6 -3 3" fill="#ff6b6b" />
        )}
        {element === 'water' && (
          <path d="M0 -3 Q-3 0 0 3 Q3 0 0 -3" fill="#74b9ff" />
        )}
        {element === 'earth' && (
          <rect x="-3" y="-2" width="6" height="4" fill="#00b894" />
        )}
        {element === 'air' && (
          <circle cx="0" cy="0" r="3" fill="none" stroke="#a29bfe" strokeWidth="1" />
        )}
        {element === 'light' && (
          <g>
            <path d="M0 -3 L0 3 M-3 0 L3 0" stroke="#fdcb6e" strokeWidth="1" />
            <path d="M-2 -2 L2 2 M2 -2 L-2 2" stroke="#fdcb6e" strokeWidth="1" />
          </g>
        )}
        {element === 'shadow' && (
          <circle cx="0" cy="0" r="3" fill="#636e72" opacity="0.8" />
        )}
      </g>

      {/* Type indicator */}
      <g transform="translate(14, 50)" opacity="0.7">
        {character.type === 'mage' && (
          <path d="M0 -4 L-2 2 L2 2 Z" fill={color} />
        )}
        {character.type === 'warrior' && (
          <rect x="-2" y="-3" width="4" height="6" fill={color} />
        )}
        {character.type === 'rogue' && (
          <path d="M-3 0 L0 -3 L3 0 L0 3 Z" fill={color} />
        )}
        {character.type === 'healer' && (
          <g>
            <path d="M0 -3 L0 3 M-3 0 L3 0" stroke={color} strokeWidth="1.5" />
          </g>
        )}
        {character.type === 'tank' && (
          <rect x="-3" y="-2" width="6" height="4" fill={color} rx="1" />
        )}
      </g>

      {/* Combat effects */}
      {state === 'fighting' && (
        <g className="animate-spin" style={{ transformOrigin: '32px 32px', animationDuration: '2s' }}>
          <circle cx="32" cy="16" r="2" fill={color} opacity="0.6" />
          <circle cx="48" cy="32" r="2" fill={color} opacity="0.6" />
          <circle cx="32" cy="48" r="2" fill={color} opacity="0.6" />
          <circle cx="16" cy="32" r="2" fill={color} opacity="0.6" />
        </g>
      )}

      {/* Movement particles */}
      {state === 'moving' && (
        <g>
          <circle cx="12" cy="56" r="1.5" fill={color} opacity="0.4" className="animate-bounce" />
          <circle cx="52" cy="56" r="1.5" fill={color} opacity="0.4" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
        </g>
      )}
    </svg>
  );
}

export function GameCharacterArena() {
  const [location] = useLocation();
  const [characters, setCharacters] = useState<GameCharacter[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [effects, setEffects] = useState<BattleEffect[]>([]);
  const [battleMode, setBattleMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());

  // Initialize characters
  useEffect(() => {
    const initialCharacters = CHARACTER_ARCHETYPES.slice(0, 3).map((archetype, index) => 
      createCharacter(archetype, index)
    );
    setCharacters(initialCharacters);
    startGameLoop();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Add characters based on current page
  useEffect(() => {
    const pageCharacterCounts = {
      '/': 3,
      '/philosophy': 4,
      '/projects': 5,
      '/consciousness-map': 6,
      '/dashboard': 4
    };
    
    const targetCount = pageCharacterCounts[location as keyof typeof pageCharacterCounts] || 3;
    if (characters.length < targetCount) {
      const additionalCharacters: GameCharacter[] = [];
      for (let i = characters.length; i < targetCount; i++) {
        const archetype = CHARACTER_ARCHETYPES[i % CHARACTER_ARCHETYPES.length];
        additionalCharacters.push(createCharacter(archetype, i));
      }
      setCharacters(prev => [...prev, ...additionalCharacters]);
    }
  }, [location, characters.length]);

  const createCharacter = (archetype: typeof CHARACTER_ARCHETYPES[0], index: number): GameCharacter => {
    const container = containerRef.current;
    const bounds = container?.getBoundingClientRect() || { width: 1200, height: 800 };
    const uniqueId = `${archetype.name}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 6)}`;
    
    return {
      id: uniqueId,
      name: archetype.name,
      type: archetype.type,
      element: archetype.element,
      game: archetype.game,
      position: {
        x: 80 + Math.random() * (bounds.width - 160),
        y: 80 + Math.random() * (bounds.height - 160)
      },
      velocity: { x: 0, y: 0 },
      state: 'idle',
      health: 100,
      energy: 100,
      color: archetype.color,
      spriteData: { ...archetype.spriteData },
      lastAction: Date.now()
    };
  };

  const startGameLoop = () => {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;
      
      if (deltaTime > 16) { // ~60 FPS
        updateCharacters(deltaTime);
        updateMessages();
        updateEffects();
        generateRandomEvents();
        lastUpdateRef.current = now;
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoop();
  };

  const updateCharacters = (deltaTime: number) => {
    setCharacters(prevCharacters => {
      const container = containerRef.current;
      if (!container) return prevCharacters;
      
      const bounds = container.getBoundingClientRect();
      
      return prevCharacters.map(character => {
        let updated = { ...character };
        
        // State-based behavior
        switch (character.state) {
          case 'idle':
            if (Math.random() < 0.01) {
              updated.state = 'moving';
              updated.target = generateRandomTarget(bounds);
            }
            break;
            
          case 'moving':
            updated = updateMovement(updated, bounds);
            break;
            
          case 'fighting':
            updated = updateFighting(updated, prevCharacters);
            break;
            
          case 'talking':
            if (Date.now() - character.lastAction > 3000) {
              updated.state = 'idle';
            }
            break;
        }
        
        // Boundary checking
        updated.position.x = Math.max(40, Math.min(bounds.width - 40, updated.position.x));
        updated.position.y = Math.max(40, Math.min(bounds.height - 40, updated.position.y));
        
        return updated;
      });
    });
  };

  const updateMovement = (character: GameCharacter, bounds: DOMRect): GameCharacter => {
    if (!character.target) {
      character.target = generateRandomTarget(bounds);
    }
    
    const dx = character.target.x - character.position.x;
    const dy = character.target.y - character.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 10) {
      return {
        ...character,
        state: 'idle',
        velocity: { x: 0, y: 0 },
        target: undefined
      };
    }
    
    const speed = 2;
    const normalizedDx = dx / distance;
    const normalizedDy = dy / distance;
    
    return {
      ...character,
      position: {
        x: character.position.x + normalizedDx * speed,
        y: character.position.y + normalizedDy * speed
      },
      velocity: {
        x: normalizedDx * speed,
        y: normalizedDy * speed
      }
    };
  };

  const updateFighting = (character: GameCharacter, allCharacters: GameCharacter[]): GameCharacter => {
    // For fighting, we need to find the target character by ID (stored in a separate field)
    const targetCharacter = character.combatTarget ? allCharacters.find(c => c.id === character.combatTarget) : null;
    
    if (!target) {
      return { ...character, state: 'idle', target: undefined };
    }
    
    const dx = target.position.x - character.position.x;
    const dy = target.position.y - character.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 100) {
      // Move towards target
      const speed = 2.5;
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
      
      return {
        ...character,
        position: {
          x: character.position.x + normalizedDx * speed,
          y: character.position.y + normalizedDy * speed
        },
        velocity: {
          x: normalizedDx * speed,
          y: normalizedDy * speed
        }
      };
    } else {
      // Attack!
      if (Math.random() < 0.05) { // 5% chance per frame
        createBattleEffect(character.position, character.color, 'spark');
        createMessage(character.id, `${character.element} attack!`, 2000);
      }
      
      return {
        ...character,
        velocity: { x: 0, y: 0 }
      };
    }
  };

  const generateRandomTarget = (bounds: DOMRect) => ({
    x: 80 + Math.random() * (bounds.width - 160),
    y: 80 + Math.random() * (bounds.height - 160)
  });

  const updateMessages = () => {
    setMessages(prev => prev.filter(msg => Date.now() - msg.timestamp < msg.duration));
  };

  const updateEffects = () => {
    setEffects(prev => prev.filter(effect => Date.now() - effect.timestamp < 1000));
  };

  const generateRandomEvents = () => {
    if (Math.random() < 0.005) { // 0.5% chance per frame
      const availableCharacters = characters.filter(c => c.state === 'idle' || c.state === 'moving');
      
      if (availableCharacters.length >= 2) {
        const char1 = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
        const char2 = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
        
        if (char1.id !== char2.id) {
          const distance = getDistance(char1.position, char2.position);
          
          if (distance < 200) {
            if (Math.random() < 0.3) {
              // Start battle
              setCharacters(prev => prev.map(c => {
                if (c.id === char1.id) return { ...c, state: 'fighting', target: char2.id, lastAction: Date.now() };
                if (c.id === char2.id) return { ...c, state: 'fighting', target: char1.id, lastAction: Date.now() };
                return c;
              }));
              setBattleMode(true);
              setTimeout(() => setBattleMode(false), 5000);
            } else {
              // Start conversation
              setCharacters(prev => prev.map(c => {
                if (c.id === char1.id || c.id === char2.id) {
                  return { ...c, state: 'talking', lastAction: Date.now() };
                }
                return c;
              }));
              
              createMessage(char1.id, getRandomPhrase(char1), 3000);
              setTimeout(() => {
                createMessage(char2.id, getRandomPhrase(char2), 3000);
              }, 1500);
            }
          }
        }
      }
    }
  };

  const getRandomPhrase = (character: GameCharacter): string => {
    const phrases = {
      mage: ['Magic flows through me!', 'The elements obey!', 'Arcane power!'],
      warrior: ['For honor!', 'Stand and fight!', 'Victory is mine!'],
      rogue: ['In the shadows...', 'Swift and deadly!', 'You won\'t see me coming!'],
      healer: ['Light heal all wounds', 'Balance must be restored', 'Peace and harmony'],
      tank: ['I will protect you!', 'None shall pass!', 'Stand behind me!']
    };
    
    const typePhases = phrases[character.type] || ['Hello there!'];
    return typePhases[Math.floor(Math.random() * typePhases.length)];
  };

  const createMessage = (characterId: string, text: string, duration: number) => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${characterId}-${Math.random().toString(36).substr(2, 6)}`,
      characterId,
      text,
      timestamp: Date.now(),
      duration
    };
    setMessages(prev => [...prev, message]);
  };

  const createBattleEffect = (position: { x: number; y: number }, color: string, type: BattleEffect['type']) => {
    const effect: BattleEffect = {
      id: `fx-${Date.now()}-${type}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      position: { ...position },
      color,
      timestamp: Date.now()
    };
    setEffects(prev => [...prev, effect]);
  };

  const getDistance = (pos1: { x: number; y: number }, pos2: { x: number; y: number }) => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleCharacterClick = (character: GameCharacter) => {
    setCharacters(prev => prev.map(c => {
      if (c.id === character.id) {
        return {
          ...c,
          state: c.state === 'fighting' ? 'idle' : 'talking',
          target: undefined,
          lastAction: Date.now()
        };
      }
      return c;
    }));

    createMessage(character.id, `*waves* ${getRandomPhrase(character)}`, 3000);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-20 pointer-events-none overflow-hidden"
    >
      {/* Characters */}
      <AnimatePresence>
        {characters.map(character => (
          <motion.div
            key={character.id}
            className="absolute cursor-pointer pointer-events-auto"
            style={{
              left: character.position.x,
              top: character.position.y,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleCharacterClick(character)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <CharacterSprite character={character} size={64} />
            
            {/* Health bar for fighting characters */}
            {character.state === 'fighting' && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                             w-12 h-2 bg-black/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${character.health}%` }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Chat bubbles */}
      <AnimatePresence>
        {messages.map(message => {
          const character = characters.find(c => c.id === message.characterId);
          if (!character) return null;

          return (
            <motion.div
              key={message.id}
              className="absolute pointer-events-none z-30"
              style={{
                left: character.position.x,
                top: character.position.y - 60,
                transform: 'translate(-50%, -100%)'
              }}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
            >
              <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg
                             border border-gray-500 max-w-40 text-center">
                {message.text}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2
                             w-0 h-0 border-l-4 border-r-4 border-t-4
                             border-l-transparent border-r-transparent border-t-black/90" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Battle effects */}
      <AnimatePresence>
        {effects.map(effect => (
          <motion.div
            key={effect.id}
            className="absolute pointer-events-none"
            style={{
              left: effect.position.x,
              top: effect.position.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 1],
              opacity: [0, 1, 0],
              rotate: effect.type === 'spark' ? [0, 180] : 0
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="w-8 h-8 rounded-full"
              style={{
                background: `radial-gradient(circle, ${effect.color}, transparent)`,
                boxShadow: `0 0 20px ${effect.color}`
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Battle mode indicator */}
      <AnimatePresence>
        {battleMode && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40
                       bg-red-900/90 text-white px-6 py-3 rounded-lg border border-red-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            ⚔️ EPIC BATTLE IN PROGRESS ⚔️
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character counter */}
      <div className="absolute bottom-4 right-4 bg-black/80 text-white text-sm px-3 py-2 rounded
                      border border-gray-600 pointer-events-auto">
        Characters: {characters.length}
      </div>
    </div>
  );
}

export default GameCharacterArena;