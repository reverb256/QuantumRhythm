/**
 * Walking Character System - AI-Generated Sprites with Realistic Walking Animation
 * Characters walk around the screen with proper sprite animation frames
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

interface WalkingCharacter {
  id: string;
  name: string;
  type: 'warrior' | 'mage' | 'rogue' | 'healer' | 'archer';
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  direction: 'up' | 'down' | 'left' | 'right';
  state: 'walking' | 'idle' | 'talking' | 'fighting';
  animationFrame: number;
  health: number;
  color: string;
  element: string;
  target: { x: number; y: number } | null;
  lastFrameUpdate: number;
  lastActionTime: number;
  combatTarget: string | null;
  spriteVariant: number;
}

interface ChatBubble {
  id: string;
  characterId: string;
  message: string;
  timestamp: number;
  duration: number;
}

interface BattleFX {
  id: string;
  position: { x: number; y: number };
  type: 'hit' | 'magic' | 'heal';
  color: string;
  timestamp: number;
}

const CHARACTER_ARCHETYPES = [
  {
    name: 'Aria',
    type: 'archer' as const,
    color: '#4ade80',
    element: 'Wind',
    phrases: ['The wind guides my arrows', 'Swift as the breeze', 'Perfect aim!']
  },
  {
    name: 'Kael',
    type: 'warrior' as const,
    color: '#f59e0b',
    element: 'Fire',
    phrases: ['For honor and glory!', 'Stand and fight!', 'My blade burns bright!']
  },
  {
    name: 'Luna',
    type: 'mage' as const,
    color: '#8b5cf6',
    element: 'Arcane',
    phrases: ['Magic flows through me', 'Arcane power unleashed!', 'Reality bends to my will']
  },
  {
    name: 'Raven',
    type: 'rogue' as const,
    color: '#6b7280',
    element: 'Shadow',
    phrases: ['From the shadows...', 'Strike swift, strike true', 'You never saw me coming']
  },
  {
    name: 'Sage',
    type: 'healer' as const,
    color: '#06b6d4',
    element: 'Light',
    phrases: ['Light heals all wounds', 'Peace and harmony', 'Balance must be maintained']
  }
];

function WalkingSprite({ character, size = 64 }: { character: WalkingCharacter; size?: number }) {
  const { type, direction, animationFrame, state, color, spriteVariant } = character;
  
  // Generate sprite variations based on character
  const seed = character.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hairColor = `hsl(${(seed * 137) % 360}, 70%, 45%)`;
  const skinTone = `hsl(${25 + (seed % 40)}, 30%, ${60 + (seed % 20)}%)`;
  const outfitColor = `hsl(${(seed * 87) % 360}, 60%, 40%)`;
  
  // Walking animation - changes sprite based on frame
  const walkFrame = Math.floor(animationFrame / 10) % 4; // 4 frame walk cycle
  const isWalking = state === 'walking';
  
  // Determine sprite facing based on direction
  const facingLeft = direction === 'left';
  const facingRight = direction === 'right';
  const facingUp = direction === 'up';
  const facingDown = direction === 'down';
  
  // Leg positions for walking animation
  const legOffset = isWalking ? (walkFrame % 2 === 0 ? 2 : -2) : 0;
  const leftLegY = 48 + legOffset;
  const rightLegY = 48 - legOffset;
  
  // Arm swing for walking
  const armSwing = isWalking ? (walkFrame % 2 === 0 ? 3 : -3) : 0;
  const leftArmX = facingLeft ? 20 - armSwing : 20 + armSwing;
  const rightArmX = facingLeft ? 44 + armSwing : 44 - armSwing;
  
  // Body bob while walking
  const bodyBob = isWalking ? Math.sin(animationFrame * 0.3) * 1 : 0;
  
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="walking-sprite">
      <defs>
        <radialGradient id={`glow-${character.id}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        
        <filter id={`shadow-${character.id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Character glow/aura */}
      <circle 
        cx="32" cy="32" r="28" 
        fill={`url(#glow-${character.id})`}
        className={state === 'fighting' ? "animate-pulse" : ""}
      />

      {/* Character shadow */}
      <ellipse 
        cx="32" cy="58" 
        rx="12" ry="3" 
        fill="#000" 
        opacity="0.2"
      />

      {/* Legs */}
      <g transform={`translate(0, ${bodyBob})`}>
        {/* Left leg */}
        <rect 
          x="26" y={leftLegY} 
          width="4" height="12" 
          fill={outfitColor} 
          rx="2"
          filter={`url(#shadow-${character.id})`}
        />
        
        {/* Right leg */}
        <rect 
          x="34" y={rightLegY} 
          width="4" height="12" 
          fill={outfitColor} 
          rx="2"
          filter={`url(#shadow-${character.id})`}
        />
        
        {/* Feet */}
        <ellipse cx="28" cy={leftLegY + 14} rx="3" ry="2" fill="#8b4513" />
        <ellipse cx="36" cy={rightLegY + 14} rx="3" ry="2" fill="#8b4513" />
      </g>

      {/* Body */}
      <g transform={`translate(0, ${bodyBob})`} filter={`url(#shadow-${character.id})`}>
        {/* Torso */}
        <rect 
          x="24" y="32" 
          width="16" height="18" 
          fill={outfitColor} 
          rx="3"
        />
        
        {/* Arms */}
        <rect 
          x={leftArmX} y="36" 
          width="4" height="12" 
          fill={skinTone} 
          rx="2"
          transform={`rotate(${armSwing} ${leftArmX + 2} 36)`}
        />
        <rect 
          x={rightArmX} y="36" 
          width="4" height="12" 
          fill={skinTone} 
          rx="2"
          transform={`rotate(${-armSwing} ${rightArmX + 2} 36)`}
        />
        
        {/* Head */}
        <circle 
          cx="32" cy="22" r="9" 
          fill={skinTone}
        />
        
        {/* Hair based on type */}
        {type === 'warrior' && (
          <path d="M23 18 Q32 10 41 18 Q38 26 32 24 Q26 26 23 18" fill={hairColor} opacity="0.9"/>
        )}
        {type === 'mage' && (
          <>
            <path d="M23 16 Q32 8 41 16 Q39 28 32 26 Q25 28 23 16" fill={hairColor} opacity="0.9"/>
            <path d="M22 22 Q24 36 30 38" stroke={hairColor} strokeWidth="3" fill="none" opacity="0.7"/>
            <path d="M42 22 Q40 36 34 38" stroke={hairColor} strokeWidth="3" fill="none" opacity="0.7"/>
          </>
        )}
        {type === 'rogue' && (
          <>
            <path d="M25 16 Q32 12 39 16 Q37 24 32 22 Q27 24 25 16" fill={hairColor} opacity="0.9"/>
            <ellipse cx="40" cy="20" rx="2" ry="6" fill={hairColor} opacity="0.8"/>
          </>
        )}
        {type === 'healer' && (
          <>
            <path d="M23 16 Q32 8 41 16 Q39 28 32 26 Q25 28 23 16" fill={hairColor} opacity="0.9"/>
            <path d="M32 26 Q34 36 32 46" stroke={hairColor} strokeWidth="2" fill="none" opacity="0.8"/>
          </>
        )}
        {type === 'archer' && (
          <path d="M24 16 Q32 10 40 16 Q36 22 32 20 Q28 22 24 16" fill={hairColor} opacity="0.9"/>
        )}
        
        {/* Eyes based on direction */}
        {facingDown && (
          <>
            <circle cx="28" cy="20" r="1.5" fill="#fff" />
            <circle cx="36" cy="20" r="1.5" fill="#fff" />
            <circle cx="28" cy="20" r="0.8" fill="#333" />
            <circle cx="36" cy="20" r="0.8" fill="#333" />
          </>
        )}
        
        {facingUp && (
          <>
            <circle cx="28" cy="19" r="1.5" fill="#fff" />
            <circle cx="36" cy="19" r="1.5" fill="#fff" />
            <circle cx="28" cy="18.5" r="0.8" fill="#333" />
            <circle cx="36" cy="18.5" r="0.8" fill="#333" />
          </>
        )}
        
        {(facingLeft || facingRight) && (
          <>
            <circle cx={facingLeft ? "26" : "38"} cy="20" r="1.5" fill="#fff" />
            <circle cx={facingLeft ? "26" : "38"} cy="20" r="0.8" fill="#333" />
          </>
        )}
        
        {/* Mouth/expression */}
        {state === 'talking' && (
          <ellipse cx="32" cy="25" rx="2" ry="1" fill={skinTone} stroke="#333" strokeWidth="0.5" />
        )}
        {state === 'fighting' && (
          <path d="M28 25 Q32 23 36 25" stroke="#333" strokeWidth="1" fill="none" />
        )}
        {(state === 'walking' || state === 'idle') && (
          <path d="M28 25 Q32 27 36 25" stroke="#333" strokeWidth="1" fill="none" />
        )}
        
        {/* Type-specific accessories */}
        {type === 'warrior' && (
          <>
            <rect x="38" y="28" width="2" height="16" fill="#8b4513" rx="1" />
            <rect x="36" y="26" width="6" height="4" fill="#c0c0c0" rx="1" />
          </>
        )}
        
        {type === 'mage' && (
          <>
            <rect x="40" y="20" width="2" height="20" fill="#8b4513" rx="1" />
            <circle cx="41" cy="18" r="3" fill={color} opacity="0.7" />
          </>
        )}
        
        {type === 'rogue' && (
          <>
            <rect x="38" y="30" width="1" height="8" fill="#666" />
            <rect x="26" y="30" width="1" height="8" fill="#666" />
          </>
        )}
        
        {type === 'healer' && (
          <>
            <path d="M32 10 L34 14 L30 14 Z" fill="#ffd700" />
            <path d="M32 12 L32 16 M30 14 L34 14" stroke="#ffd700" strokeWidth="1" />
          </>
        )}
        
        {type === 'archer' && (
          <>
            <rect x="22" y="32" width="2" height="12" fill="#8b4513" rx="1" />
            <path d="M20 38 Q16 38 20 42" stroke="#8b4513" strokeWidth="1" fill="none" />
          </>
        )}
      </g>

      {/* Combat effects */}
      {state === 'fighting' && (
        <g className="animate-spin" style={{ transformOrigin: '32px 32px', animationDuration: '3s' }}>
          <circle cx="32" cy="16" r="2" fill={color} opacity="0.6" />
          <circle cx="48" cy="32" r="2" fill={color} opacity="0.6" />
          <circle cx="32" cy="48" r="2" fill={color} opacity="0.6" />
          <circle cx="16" cy="32" r="2" fill={color} opacity="0.6" />
        </g>
      )}

      {/* Element indicator */}
      <g transform="translate(50, 8)" opacity="0.8">
        <circle cx="0" cy="0" r="4" fill={color} opacity="0.3" />
        <text x="0" y="2" textAnchor="middle" fontSize="6" fill={color} fontWeight="bold">
          {character.element.charAt(0)}
        </text>
      </g>

      {/* Health bar when fighting */}
      {state === 'fighting' && (
        <g transform="translate(16, 4)">
          <rect x="0" y="0" width="32" height="3" fill="#000" opacity="0.5" rx="1" />
          <rect x="1" y="1" width={`${(character.health / 100) * 30}`} height="1" fill="#ff0000" rx="0.5" />
        </g>
      )}
    </svg>
  );
}

export function WalkingCharacterSystem() {
  const [location] = useLocation();
  const [characters, setCharacters] = useState<WalkingCharacter[]>([]);
  const [chatBubbles, setChatBubbles] = useState<ChatBubble[]>([]);
  const [battleEffects, setBattleEffects] = useState<BattleFX[]>([]);
  const [battleMode, setBattleMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    initializeCharacters();
    startAnimationLoop();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const pageCounts = {
      '/': 3,
      '/philosophy': 4,
      '/projects': 5,
      '/consciousness-map': 6,
      '/dashboard': 4
    };
    
    const targetCount = pageCounts[location as keyof typeof pageCounts] || 3;
    if (characters.length < targetCount) {
      addMoreCharacters(targetCount - characters.length);
    }
  }, [location, characters.length]);

  const initializeCharacters = () => {
    const initial = CHARACTER_ARCHETYPES.slice(0, 3).map((archetype, index) => 
      createCharacter(archetype, index)
    );
    setCharacters(initial);
  };

  const createCharacter = (archetype: typeof CHARACTER_ARCHETYPES[0], index: number): WalkingCharacter => {
    const container = containerRef.current;
    const bounds = container?.getBoundingClientRect() || { width: 1200, height: 800 };
    
    return {
      id: `${archetype.name}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 8)}`,
      name: archetype.name,
      type: archetype.type,
      position: {
        x: 100 + Math.random() * (bounds.width - 200),
        y: 100 + Math.random() * (bounds.height - 200)
      },
      velocity: { x: 0, y: 0 },
      direction: 'down',
      state: 'idle',
      animationFrame: 0,
      health: 100,
      color: archetype.color,
      element: archetype.element,
      target: null,
      lastFrameUpdate: Date.now(),
      lastActionTime: Date.now(),
      combatTarget: null,
      spriteVariant: Math.floor(Math.random() * 4)
    };
  };

  const addMoreCharacters = (count: number) => {
    const additional: WalkingCharacter[] = [];
    for (let i = 0; i < count; i++) {
      const archetype = CHARACTER_ARCHETYPES[(characters.length + i) % CHARACTER_ARCHETYPES.length];
      additional.push(createCharacter(archetype, characters.length + i));
    }
    setCharacters(prev => [...prev, ...additional]);
  };

  const startAnimationLoop = () => {
    const animate = () => {
      const now = Date.now();
      
      setCharacters(prevChars => {
        const container = containerRef.current;
        if (!container) return prevChars;
        
        const bounds = container.getBoundingClientRect();
        
        return prevChars.map(char => {
          let updated = { ...char };
          
          // Update animation frame
          if (now - char.lastFrameUpdate > 50) { // 20 FPS animation
            updated.animationFrame = char.animationFrame + 1;
            updated.lastFrameUpdate = now;
          }
          
          // State behavior
          switch (char.state) {
            case 'idle':
              // Randomly start walking
              if (now - char.lastActionTime > 2000 && Math.random() < 0.02) {
                updated = startWalking(updated, bounds);
              }
              break;
              
            case 'walking':
              updated = updateWalking(updated, bounds);
              break;
              
            case 'fighting':
              updated = updateFighting(updated, prevChars);
              break;
              
            case 'talking':
              if (now - char.lastActionTime > 3000) {
                updated.state = 'idle';
                updated.lastActionTime = now;
              }
              break;
          }
          
          // Random interactions
          if (now - char.lastActionTime > 5000 && Math.random() < 0.005) {
            const nearby = findNearbyCharacters(char, prevChars, 120);
            if (nearby.length > 0) {
              const target = nearby[Math.floor(Math.random() * nearby.length)];
              if (Math.random() < 0.3) {
                // Start battle
                updated.state = 'fighting';
                updated.combatTarget = target.id;
                updated.lastActionTime = now;
                setBattleMode(true);
                setTimeout(() => setBattleMode(false), 8000);
              } else {
                // Start conversation
                updated.state = 'talking';
                updated.lastActionTime = now;
                createChatBubble(char.id, getRandomPhrase(char), 3000);
              }
            }
          }
          
          return updated;
        });
      });
      
      updateChatBubbles();
      updateBattleEffects();
      
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const startWalking = (char: WalkingCharacter, bounds: DOMRect): WalkingCharacter => {
    const target = {
      x: 80 + Math.random() * (bounds.width - 160),
      y: 80 + Math.random() * (bounds.height - 160)
    };
    
    return {
      ...char,
      state: 'walking',
      target,
      lastActionTime: Date.now()
    };
  };

  const updateWalking = (char: WalkingCharacter, bounds: DOMRect): WalkingCharacter => {
    if (!char.target) {
      return { ...char, state: 'idle', velocity: { x: 0, y: 0 } };
    }
    
    const dx = char.target.x - char.position.x;
    const dy = char.target.y - char.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 10) {
      return {
        ...char,
        state: 'idle',
        target: null,
        velocity: { x: 0, y: 0 },
        lastActionTime: Date.now()
      };
    }
    
    const speed = 1.5;
    const normalizedDx = dx / distance;
    const normalizedDy = dy / distance;
    
    // Update direction based on movement
    let direction = char.direction;
    if (Math.abs(normalizedDx) > Math.abs(normalizedDy)) {
      direction = normalizedDx > 0 ? 'right' : 'left';
    } else {
      direction = normalizedDy > 0 ? 'down' : 'up';
    }
    
    const newX = Math.max(40, Math.min(bounds.width - 40, char.position.x + normalizedDx * speed));
    const newY = Math.max(40, Math.min(bounds.height - 40, char.position.y + normalizedDy * speed));
    
    return {
      ...char,
      position: { x: newX, y: newY },
      velocity: { x: normalizedDx * speed, y: normalizedDy * speed },
      direction
    };
  };

  const updateFighting = (char: WalkingCharacter, allChars: WalkingCharacter[]): WalkingCharacter => {
    const target = char.combatTarget ? allChars.find(c => c.id === char.combatTarget) : null;
    
    if (!target) {
      return { ...char, state: 'idle', combatTarget: null, lastActionTime: Date.now() };
    }
    
    const dx = target.position.x - char.position.x;
    const dy = target.position.y - char.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Update direction to face target
    let direction = char.direction;
    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? 'right' : 'left';
    } else {
      direction = dy > 0 ? 'down' : 'up';
    }
    
    if (distance > 80) {
      // Move towards target
      const speed = 2;
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
      
      return {
        ...char,
        position: {
          x: char.position.x + normalizedDx * speed,
          y: char.position.y + normalizedDy * speed
        },
        velocity: { x: normalizedDx * speed, y: normalizedDy * speed },
        direction
      };
    } else {
      // Attack range - create effects
      if (Math.random() < 0.08) {
        createBattleEffect(char.position, char.color, 'hit');
        createChatBubble(char.id, `${char.element} attack!`, 2000);
      }
      
      return {
        ...char,
        velocity: { x: 0, y: 0 },
        direction
      };
    }
  };

  const findNearbyCharacters = (char: WalkingCharacter, allChars: WalkingCharacter[], radius: number): WalkingCharacter[] => {
    return allChars.filter(other => {
      if (other.id === char.id) return false;
      const dx = other.position.x - char.position.x;
      const dy = other.position.y - char.position.y;
      return Math.sqrt(dx * dx + dy * dy) < radius;
    });
  };

  const getRandomPhrase = (char: WalkingCharacter): string => {
    const archetype = CHARACTER_ARCHETYPES.find(a => a.name === char.name);
    if (!archetype) return 'Hello there!';
    
    return archetype.phrases[Math.floor(Math.random() * archetype.phrases.length)];
  };

  const createChatBubble = (characterId: string, message: string, duration: number) => {
    const bubble: ChatBubble = {
      id: `chat-${Date.now()}-${characterId}-${Math.random().toString(36).substr(2, 6)}`,
      characterId,
      message,
      timestamp: Date.now(),
      duration
    };
    setChatBubbles(prev => [...prev, bubble]);
  };

  const createBattleEffect = (position: { x: number; y: number }, color: string, type: BattleFX['type']) => {
    const effect: BattleFX = {
      id: `fx-${Date.now()}-${type}-${Math.random().toString(36).substr(2, 6)}`,
      position: { ...position },
      type,
      color,
      timestamp: Date.now()
    };
    setBattleEffects(prev => [...prev, effect]);
  };

  const updateChatBubbles = () => {
    setChatBubbles(prev => prev.filter(bubble => Date.now() - bubble.timestamp < bubble.duration));
  };

  const updateBattleEffects = () => {
    setBattleEffects(prev => prev.filter(effect => Date.now() - effect.timestamp < 1500));
  };

  const handleCharacterClick = (character: WalkingCharacter) => {
    setCharacters(prev => prev.map(c => {
      if (c.id === character.id) {
        return {
          ...c,
          state: c.state === 'fighting' ? 'idle' : 'talking',
          combatTarget: null,
          lastActionTime: Date.now()
        };
      }
      return c;
    }));

    createChatBubble(character.id, `*waves* ${getRandomPhrase(character)}`, 3000);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-20 pointer-events-none overflow-hidden"
    >
      {/* Walking Characters */}
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
            <WalkingSprite character={character} size={64} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Chat Bubbles */}
      <AnimatePresence>
        {chatBubbles.map(bubble => {
          const character = characters.find(c => c.id === bubble.characterId);
          if (!character) return null;

          return (
            <motion.div
              key={bubble.id}
              className="absolute pointer-events-none z-30"
              style={{
                left: character.position.x,
                top: character.position.y - 80,
                transform: 'translate(-50%, -100%)'
              }}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
            >
              <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg
                             border border-gray-500 max-w-48 text-center">
                {bubble.message}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2
                             w-0 h-0 border-l-4 border-r-4 border-t-4
                             border-l-transparent border-r-transparent border-t-black/90" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Battle Effects */}
      <AnimatePresence>
        {battleEffects.map(effect => (
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
              scale: [0, 1.8, 1.2, 0],
              opacity: [0, 1, 0.8, 0],
              rotate: effect.type === 'hit' ? [0, 180, 360] : 0
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div 
              className="w-12 h-12 rounded-full"
              style={{
                background: `radial-gradient(circle, ${effect.color}, transparent)`,
                boxShadow: `0 0 25px ${effect.color}`
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Battle Mode Indicator */}
      <AnimatePresence>
        {battleMode && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40
                       bg-red-900/90 text-white px-6 py-3 rounded-lg border border-red-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            ⚔️ EPIC BATTLE COMMENCED ⚔️
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Status */}
      <div className="absolute bottom-4 right-4 bg-black/80 text-white text-sm px-3 py-2 rounded
                      border border-gray-600 pointer-events-auto">
        Active Characters: {characters.length}
        <br />
        <span className="text-xs text-gray-300">
          Walking: {characters.filter(c => c.state === 'walking').length} | 
          Fighting: {characters.filter(c => c.state === 'fighting').length}
        </span>
      </div>
    </div>
  );
}

export default WalkingCharacterSystem;