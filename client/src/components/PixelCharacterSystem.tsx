/**
 * Pixel Character System - NES/SNES Style Walking Sprites
 * Retro 8-bit/16-bit style characters with proper async handling
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

interface PixelCharacter {
  id: string;
  name: string;
  class: 'knight' | 'mage' | 'rogue' | 'archer' | 'priest';
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  direction: 'down' | 'up' | 'left' | 'right';
  state: 'idle' | 'walking' | 'attacking' | 'talking';
  walkFrame: number;
  health: number;
  mana: number;
  level: number;
  color: string;
  target: { x: number; y: number } | null;
  lastUpdate: number;
  lastAction: number;
}

interface Message {
  id: string;
  characterId: string;
  text: string;
  timestamp: number;
  ttl: number;
}

interface Effect {
  id: string;
  type: 'attack' | 'magic' | 'heal';
  position: { x: number; y: number };
  color: string;
  timestamp: number;
}

const PIXEL_CHARACTERS = [
  {
    name: 'Sir Galahad',
    class: 'knight' as const,
    color: '#ff6b6b',
    palette: { primary: '#ff6b6b', secondary: '#4ecdc4', accent: '#45b7d1' },
    skills: ['Shield Bash', 'Sword Strike', 'Defend']
  },
  {
    name: 'Mystic Aria',
    class: 'mage' as const,
    color: '#a8e6cf',
    palette: { primary: '#a8e6cf', secondary: '#dda0dd', accent: '#98fb98' },
    skills: ['Fireball', 'Ice Shard', 'Lightning']
  },
  {
    name: 'Shadow Kael',
    class: 'rogue' as const,
    color: '#6c5ce7',
    palette: { primary: '#6c5ce7', secondary: '#fd79a8', accent: '#fdcb6e' },
    skills: ['Sneak Attack', 'Poison Dart', 'Vanish']
  },
  {
    name: 'Eagle Eye',
    class: 'archer' as const,
    color: '#fd79a8',
    palette: { primary: '#fd79a8', secondary: '#fdcb6e', accent: '#fd79a8' },
    skills: ['Arrow Shot', 'Multi Shot', 'Precise Aim']
  },
  {
    name: 'Sister Luna',
    class: 'priest' as const,
    color: '#74b9ff',
    palette: { primary: '#74b9ff', secondary: '#0984e3', accent: '#00cec9' },
    skills: ['Heal', 'Blessing', 'Holy Light']
  }
];

function PixelSprite({ character, size = 48 }: { character: PixelCharacter; size?: number }) {
  const { class: charClass, direction, walkFrame, state, color } = character;
  
  // Create retro pixel art sprite using CSS
  const spriteSize = size;
  const pixelSize = Math.floor(spriteSize / 16); // 16x16 pixel grid
  
  // Animation frame for walking cycle (0-3)
  const animFrame = Math.floor(walkFrame / 15) % 4;
  const isWalking = state === 'walking';
  
  // Determine sprite direction
  const spriteDirection = direction;
  
  // Color palette based on character class
  const palette = PIXEL_CHARACTERS.find(p => p.class === charClass)?.palette || {
    primary: color,
    secondary: '#666',
    accent: '#fff'
  };
  
  return (
    <div 
      className="pixel-sprite relative"
      style={{
        width: spriteSize,
        height: spriteSize,
        imageRendering: 'pixelated',
        filter: state === 'attacking' ? 'brightness(1.3)' : 'none'
      }}
    >
      {/* Character shadow */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: spriteSize * 0.8,
          height: pixelSize * 2,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />
      
      {/* Main character sprite */}
      <div className="relative w-full h-full">
        {/* Head */}
        <div
          className="absolute"
          style={{
            left: pixelSize * 6,
            top: pixelSize * 2,
            width: pixelSize * 4,
            height: pixelSize * 4,
            backgroundColor: '#fdbcb4', // Skin tone
            border: `${Math.max(1, pixelSize / 4)}px solid #333`
          }}
        />
        
        {/* Hair based on class */}
        {charClass === 'knight' && (
          <div
            className="absolute"
            style={{
              left: pixelSize * 5,
              top: pixelSize * 1,
              width: pixelSize * 6,
              height: pixelSize * 3,
              backgroundColor: '#8b4513',
              border: `${Math.max(1, pixelSize / 4)}px solid #333`
            }}
          />
        )}
        
        {charClass === 'mage' && (
          <>
            <div
              className="absolute"
              style={{
                left: pixelSize * 5,
                top: pixelSize * 1,
                width: pixelSize * 6,
                height: pixelSize * 4,
                backgroundColor: '#dda0dd',
                border: `${Math.max(1, pixelSize / 4)}px solid #333`
              }}
            />
            <div
              className="absolute"
              style={{
                left: pixelSize * 11,
                top: pixelSize * 3,
                width: pixelSize * 2,
                height: pixelSize * 6,
                backgroundColor: '#dda0dd',
                border: `${Math.max(1, pixelSize / 4)}px solid #333`
              }}
            />
          </>
        )}
        
        {charClass === 'rogue' && (
          <div
            className="absolute"
            style={{
              left: pixelSize * 6,
              top: pixelSize * 1,
              width: pixelSize * 4,
              height: pixelSize * 3,
              backgroundColor: '#2d3436',
              border: `${Math.max(1, pixelSize / 4)}px solid #333`
            }}
          />
        )}
        
        {charClass === 'archer' && (
          <div
            className="absolute"
            style={{
              left: pixelSize * 5,
              top: pixelSize * 1,
              width: pixelSize * 6,
              height: pixelSize * 3,
              backgroundColor: '#e17055',
              border: `${Math.max(1, pixelSize / 4)}px solid #333`
            }}
          />
        )}
        
        {charClass === 'priest' && (
          <div
            className="absolute"
            style={{
              left: pixelSize * 6,
              top: pixelSize * 1,
              width: pixelSize * 4,
              height: pixelSize * 3,
              backgroundColor: '#fdcb6e',
              border: `${Math.max(1, pixelSize / 4)}px solid #333`
            }}
          />
        )}
        
        {/* Eyes */}
        <div
          className="absolute"
          style={{
            left: pixelSize * 7,
            top: pixelSize * 3,
            width: pixelSize,
            height: pixelSize,
            backgroundColor: '#000'
          }}
        />
        <div
          className="absolute"
          style={{
            left: pixelSize * 8,
            top: pixelSize * 3,
            width: pixelSize,
            height: pixelSize,
            backgroundColor: '#000'
          }}
        />
        
        {/* Body */}
        <div
          className="absolute"
          style={{
            left: pixelSize * 6,
            top: pixelSize * 6,
            width: pixelSize * 4,
            height: pixelSize * 5,
            backgroundColor: palette.primary,
            border: `${Math.max(1, pixelSize / 4)}px solid #333`
          }}
        />
        
        {/* Arms */}
        <div
          className="absolute"
          style={{
            left: pixelSize * (4 + (isWalking && animFrame % 2 ? 1 : 0)),
            top: pixelSize * 7,
            width: pixelSize * 2,
            height: pixelSize * 4,
            backgroundColor: palette.secondary,
            border: `${Math.max(1, pixelSize / 4)}px solid #333`,
            transform: isWalking ? `rotate(${animFrame % 2 ? 10 : -10}deg)` : 'none',
            transformOrigin: 'top center'
          }}
        />
        <div
          className="absolute"
          style={{
            left: pixelSize * (10 - (isWalking && animFrame % 2 ? 1 : 0)),
            top: pixelSize * 7,
            width: pixelSize * 2,
            height: pixelSize * 4,
            backgroundColor: palette.secondary,
            border: `${Math.max(1, pixelSize / 4)}px solid #333`,
            transform: isWalking ? `rotate(${animFrame % 2 ? -10 : 10}deg)` : 'none',
            transformOrigin: 'top center'
          }}
        />
        
        {/* Legs */}
        <div
          className="absolute"
          style={{
            left: pixelSize * 6,
            top: pixelSize * (11 + (isWalking && animFrame % 2 ? 1 : 0)),
            width: pixelSize * 2,
            height: pixelSize * 4,
            backgroundColor: palette.accent,
            border: `${Math.max(1, pixelSize / 4)}px solid #333`
          }}
        />
        <div
          className="absolute"
          style={{
            left: pixelSize * 8,
            top: pixelSize * (11 - (isWalking && animFrame % 2 ? 1 : 0)),
            width: pixelSize * 2,
            height: pixelSize * 4,
            backgroundColor: palette.accent,
            border: `${Math.max(1, pixelSize / 4)}px solid #333`
          }}
        />
        
        {/* Class-specific accessories */}
        {charClass === 'knight' && (
          <>
            {/* Sword */}
            <div
              className="absolute"
              style={{
                left: pixelSize * 12,
                top: pixelSize * 5,
                width: pixelSize,
                height: pixelSize * 6,
                backgroundColor: '#c0c0c0',
                border: `${Math.max(1, pixelSize / 4)}px solid #333`
              }}
            />
            {/* Shield */}
            <div
              className="absolute"
              style={{
                left: pixelSize * 2,
                top: pixelSize * 7,
                width: pixelSize * 2,
                height: pixelSize * 3,
                backgroundColor: '#8b4513',
                border: `${Math.max(1, pixelSize / 4)}px solid #333`,
                borderRadius: '20%'
              }}
            />
          </>
        )}
        
        {charClass === 'mage' && (
          <>
            {/* Staff */}
            <div
              className="absolute"
              style={{
                left: pixelSize * 13,
                top: pixelSize * 2,
                width: pixelSize,
                height: pixelSize * 10,
                backgroundColor: '#8b4513',
                border: `${Math.max(1, pixelSize / 4)}px solid #333`
              }}
            />
            {/* Staff orb */}
            <div
              className="absolute"
              style={{
                left: pixelSize * 12,
                top: pixelSize * 1,
                width: pixelSize * 3,
                height: pixelSize * 3,
                backgroundColor: palette.primary,
                border: `${Math.max(1, pixelSize / 4)}px solid #333`,
                borderRadius: '50%',
                boxShadow: state === 'attacking' ? `0 0 ${pixelSize}px ${palette.primary}` : 'none'
              }}
            />
          </>
        )}
        
        {charClass === 'rogue' && (
          <>
            {/* Daggers */}
            <div
              className="absolute"
              style={{
                left: pixelSize * 3,
                top: pixelSize * 8,
                width: pixelSize,
                height: pixelSize * 3,
                backgroundColor: '#666',
                border: `${Math.max(1, pixelSize / 4)}px solid #333`
              }}
            />
            <div
              className="absolute"
              style={{
                left: pixelSize * 12,
                top: pixelSize * 8,
                width: pixelSize,
                height: pixelSize * 3,
                backgroundColor: '#666',
                border: `${Math.max(1, pixelSize / 4)}px solid #333`
              }}
            />
          </>
        )}
        
        {charClass === 'archer' && (
          <>
            {/* Bow */}
            <div
              className="absolute"
              style={{
                left: pixelSize * 2,
                top: pixelSize * 5,
                width: pixelSize,
                height: pixelSize * 6,
                backgroundColor: '#8b4513',
                border: `${Math.max(1, pixelSize / 4)}px solid #333`,
                borderRadius: '50% 0 0 50%'
              }}
            />
            {/* Quiver */}
            <div
              className="absolute"
              style={{
                left: pixelSize * 11,
                top: pixelSize * 4,
                width: pixelSize * 2,
                height: pixelSize * 4,
                backgroundColor: '#654321',
                border: `${Math.max(1, pixelSize / 4)}px solid #333`
              }}
            />
          </>
        )}
        
        {charClass === 'priest' && (
          <>
            {/* Holy symbol */}
            <div
              className="absolute"
              style={{
                left: pixelSize * 7,
                top: pixelSize * 8,
                width: pixelSize * 2,
                height: pixelSize,
                backgroundColor: '#ffd700',
                border: `${Math.max(1, pixelSize / 4)}px solid #333`
              }}
            />
            <div
              className="absolute"
              style={{
                left: pixelSize * 7.5,
                top: pixelSize * 7,
                width: pixelSize,
                height: pixelSize * 3,
                backgroundColor: '#ffd700',
                border: `${Math.max(1, pixelSize / 4)}px solid #333`
              }}
            />
          </>
        )}
        
        {/* Attack effects */}
        {state === 'attacking' && (
          <div
            className="absolute animate-ping"
            style={{
              left: pixelSize * 4,
              top: pixelSize * 4,
              width: pixelSize * 8,
              height: pixelSize * 8,
              backgroundColor: palette.primary,
              opacity: 0.3,
              borderRadius: '50%'
            }}
          />
        )}
        
        {/* Level indicator */}
        <div
          className="absolute -top-2 -right-1 text-xs font-bold text-white bg-black rounded-full w-4 h-4 flex items-center justify-center"
          style={{ fontSize: Math.max(8, pixelSize) }}
        >
          {character.level}
        </div>
      </div>
    </div>
  );
}

export function PixelCharacterSystem() {
  const [location] = useLocation();
  const [characters, setCharacters] = useState<PixelCharacter[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [effects, setEffects] = useState<Effect[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());

  // Async-safe character initialization
  const initializeCharacters = useCallback(async () => {
    try {
      if (isInitialized) return;
      
      const container = containerRef.current;
      if (!container) return;
      
      const bounds = container.getBoundingClientRect();
      const initialChars = PIXEL_CHARACTERS.slice(0, 3).map((template, index) => 
        createCharacter(template, index, bounds)
      );
      
      setCharacters(initialChars);
      setIsInitialized(true);
    } catch (error) {
      console.warn('Character initialization error:', error);
    }
  }, [isInitialized]);

  const createCharacter = (
    template: typeof PIXEL_CHARACTERS[0], 
    index: number, 
    bounds: DOMRect
  ): PixelCharacter => {
    const safeId = `${template.name.replace(/\s+/g, '-')}-${Date.now()}-${index}`;
    
    return {
      id: safeId,
      name: template.name,
      class: template.class,
      position: {
        x: 100 + Math.random() * Math.max(200, bounds.width - 200),
        y: 100 + Math.random() * Math.max(200, bounds.height - 200)
      },
      velocity: { x: 0, y: 0 },
      direction: 'down',
      state: 'idle',
      walkFrame: 0,
      health: 100,
      mana: 100,
      level: Math.floor(Math.random() * 10) + 1,
      color: template.color,
      target: null,
      lastUpdate: Date.now(),
      lastAction: Date.now()
    };
  };

  // Async-safe animation loop
  const startAnimationLoop = useCallback(() => {
    if (animationRef.current) return;
    
    const animate = () => {
      try {
        const now = Date.now();
        const deltaTime = now - lastUpdateRef.current;
        
        if (deltaTime > 16) { // ~60 FPS limit
          updateCharacters(now);
          cleanupMessages(now);
          cleanupEffects(now);
          generateRandomEvents(now);
          lastUpdateRef.current = now;
        }
        
        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.warn('Animation loop error:', error);
        // Continue animation even if there's an error
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, []);

  const updateCharacters = useCallback((now: number) => {
    setCharacters(prevChars => {
      try {
        const container = containerRef.current;
        if (!container) return prevChars;
        
        const bounds = container.getBoundingClientRect();
        
        return prevChars.map(char => {
          try {
            let updated = { ...char };
            
            // Update walk animation frame
            if (updated.state === 'walking') {
              updated.walkFrame = char.walkFrame + 1;
            }
            
            // State machine
            switch (char.state) {
              case 'idle':
                if (now - char.lastAction > 3000 && Math.random() < 0.01) {
                  updated = startWalking(updated, bounds);
                }
                break;
                
              case 'walking':
                updated = updateWalking(updated, bounds, now);
                break;
                
              case 'attacking':
                if (now - char.lastAction > 1000) {
                  updated.state = 'idle';
                  updated.lastAction = now;
                }
                break;
                
              case 'talking':
                if (now - char.lastAction > 4000) {
                  updated.state = 'idle';
                  updated.lastAction = now;
                }
                break;
            }
            
            updated.lastUpdate = now;
            return updated;
          } catch (error) {
            console.warn('Character update error:', error);
            return char; // Return original character if update fails
          }
        });
      } catch (error) {
        console.warn('Characters update error:', error);
        return prevChars;
      }
    });
  }, []);

  const startWalking = (char: PixelCharacter, bounds: DOMRect): PixelCharacter => {
    const target = {
      x: 60 + Math.random() * Math.max(100, bounds.width - 120),
      y: 60 + Math.random() * Math.max(100, bounds.height - 120)
    };
    
    return {
      ...char,
      state: 'walking',
      target,
      walkFrame: 0,
      lastAction: Date.now()
    };
  };

  const updateWalking = (char: PixelCharacter, bounds: DOMRect, now: number): PixelCharacter => {
    if (!char.target) {
      return { ...char, state: 'idle', velocity: { x: 0, y: 0 } };
    }
    
    const dx = char.target.x - char.position.x;
    const dy = char.target.y - char.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 15) {
      return {
        ...char,
        state: 'idle',
        target: null,
        velocity: { x: 0, y: 0 },
        lastAction: now
      };
    }
    
    const speed = 1.2;
    const normalizedDx = dx / distance;
    const normalizedDy = dy / distance;
    
    // Update direction
    let direction = char.direction;
    if (Math.abs(normalizedDx) > Math.abs(normalizedDy)) {
      direction = normalizedDx > 0 ? 'right' : 'left';
    } else {
      direction = normalizedDy > 0 ? 'down' : 'up';
    }
    
    const newX = Math.max(30, Math.min(bounds.width - 30, char.position.x + normalizedDx * speed));
    const newY = Math.max(30, Math.min(bounds.height - 30, char.position.y + normalizedDy * speed));
    
    return {
      ...char,
      position: { x: newX, y: newY },
      velocity: { x: normalizedDx * speed, y: normalizedDy * speed },
      direction
    };
  };

  const generateRandomEvents = useCallback((now: number) => {
    if (Math.random() < 0.003 && characters.length >= 2) { // 0.3% chance per frame
      try {
        const availableChars = characters.filter(c => c.state === 'idle' || c.state === 'walking');
        if (availableChars.length >= 2) {
          const char1 = availableChars[Math.floor(Math.random() * availableChars.length)];
          const char2 = availableChars.filter(c => c.id !== char1.id)[0];
          
          if (char2 && getDistance(char1.position, char2.position) < 150) {
            if (Math.random() < 0.4) {
              // Battle
              setCharacters(prev => prev.map(c => {
                if (c.id === char1.id || c.id === char2.id) {
                  return { ...c, state: 'attacking', lastAction: now };
                }
                return c;
              }));
              
              addEffect(char1.position, char1.color, 'attack');
              addMessage(char1.id, `${getSkillForClass(char1.class)}!`, 2500);
            } else {
              // Conversation
              setCharacters(prev => prev.map(c => {
                if (c.id === char1.id || c.id === char2.id) {
                  return { ...c, state: 'talking', lastAction: now };
                }
                return c;
              }));
              
              addMessage(char1.id, getGreetingForClass(char1.class), 3500);
            }
          }
        }
      } catch (error) {
        console.warn('Random event generation error:', error);
      }
    }
  }, [characters]);

  const getDistance = (pos1: { x: number; y: number }, pos2: { x: number; y: number }) => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getSkillForClass = (charClass: string): string => {
    const skills = PIXEL_CHARACTERS.find(p => p.class === charClass)?.skills || ['Attack'];
    return skills[Math.floor(Math.random() * skills.length)];
  };

  const getGreetingForClass = (charClass: string): string => {
    const greetings = {
      knight: ['Well met!', 'For honor!', 'Stand strong!'],
      mage: ['The arcane flows...', 'Magic beckons', 'Knowledge is power'],
      rogue: ['In the shadows...', 'Silent steps', 'Quick and quiet'],
      archer: ['Eye on target', 'Swift arrow', 'Precise shot'],
      priest: ['Blessings upon you', 'Light guide us', 'Peace be with you']
    };
    
    const classGreetings = greetings[charClass as keyof typeof greetings] || ['Hello there!'];
    return classGreetings[Math.floor(Math.random() * classGreetings.length)];
  };

  const addMessage = useCallback((characterId: string, text: string, ttl: number) => {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const message: Message = {
      id: messageId,
      characterId,
      text,
      timestamp: Date.now(),
      ttl
    };
    
    setMessages(prev => [...prev, message]);
  }, []);

  const addEffect = useCallback((position: { x: number; y: number }, color: string, type: Effect['type']) => {
    const effectId = `fx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const effect: Effect = {
      id: effectId,
      type,
      position: { ...position },
      color,
      timestamp: Date.now()
    };
    
    setEffects(prev => [...prev, effect]);
  }, []);

  const cleanupMessages = useCallback((now: number) => {
    setMessages(prev => prev.filter(msg => now - msg.timestamp < msg.ttl));
  }, []);

  const cleanupEffects = useCallback((now: number) => {
    setEffects(prev => prev.filter(effect => now - effect.timestamp < 2000));
  }, []);

  const handleCharacterClick = useCallback((character: PixelCharacter) => {
    const now = Date.now();
    
    setCharacters(prev => prev.map(c => {
      if (c.id === character.id) {
        return {
          ...c,
          state: c.state === 'attacking' ? 'idle' : 'talking',
          lastAction: now
        };
      }
      return c;
    }));

    addMessage(character.id, `*${character.name} waves* ${getGreetingForClass(character.class)}`, 3000);
  }, [addMessage]);

  // Initialize characters when container is ready
  useEffect(() => {
    if (containerRef.current && !isInitialized) {
      initializeCharacters();
    }
  }, [initializeCharacters, isInitialized]);

  // Start animation loop when characters are initialized
  useEffect(() => {
    if (isInitialized && characters.length > 0) {
      startAnimationLoop();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [isInitialized, characters.length, startAnimationLoop]);

  // Add more characters based on current page
  useEffect(() => {
    if (!isInitialized) return;
    
    const pageCounts = {
      '/': 3,
      '/philosophy': 4,
      '/projects': 5,
      '/consciousness-map': 6,
      '/dashboard': 4
    };
    
    const targetCount = pageCounts[location as keyof typeof pageCounts] || 3;
    if (characters.length < targetCount) {
      const container = containerRef.current;
      if (!container) return;
      
      const bounds = container.getBoundingClientRect();
      const additionalChars: PixelCharacter[] = [];
      
      for (let i = characters.length; i < targetCount; i++) {
        const template = PIXEL_CHARACTERS[i % PIXEL_CHARACTERS.length];
        additionalChars.push(createCharacter(template, i, bounds));
      }
      
      setCharacters(prev => [...prev, ...additionalChars]);
    }
  }, [location, characters.length, isInitialized]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-20 pointer-events-none overflow-hidden"
    >
      {/* Pixel Characters */}
      <AnimatePresence>
        {characters.map(character => (
          <motion.div
            key={character.id}
            className="absolute cursor-pointer pointer-events-auto"
            style={{
              left: character.position.x,
              top: character.position.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 21
            }}
            onClick={() => handleCharacterClick(character)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <PixelSprite character={character} size={48} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Speech Bubbles */}
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
                top: character.position.y - 70,
                transform: 'translate(-50%, -100%)'
              }}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
            >
              <div className="bg-black text-white text-xs px-2 py-1 rounded border border-gray-500 max-w-32 text-center font-mono">
                {message.text}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2
                             w-0 h-0 border-l-2 border-r-2 border-t-2
                             border-l-transparent border-r-transparent border-t-black" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Battle Effects */}
      <AnimatePresence>
        {effects.map(effect => (
          <motion.div
            key={effect.id}
            className="absolute pointer-events-none z-25"
            style={{
              left: effect.position.x,
              top: effect.position.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 1, 0],
              opacity: [0, 1, 0.7, 0],
              rotate: [0, 90, 180, 270]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div 
              className="w-8 h-8"
              style={{
                background: `radial-gradient(circle, ${effect.color}, transparent)`,
                imageRendering: 'pixelated',
                boxShadow: `0 0 16px ${effect.color}`
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Status Display */}
      <div className="absolute bottom-4 right-4 bg-black/90 text-green-400 text-xs p-2 rounded border border-green-400 font-mono pointer-events-auto">
        <div>HEROES: {characters.length}</div>
        <div>ACTIVE: {characters.filter(c => c.state === 'walking').length}</div>
        <div>FIGHTING: {characters.filter(c => c.state === 'attacking').length}</div>
      </div>
    </div>
  );
}

export default PixelCharacterSystem;