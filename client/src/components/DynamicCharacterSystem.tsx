/**
 * Dynamic Character System - AI-powered characters that move, talk, and battle
 * Gaming-inspired personalities with emergent behaviors
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

interface Character {
  id: string;
  name: string;
  personality: string;
  game: 'genshin' | 'honkai' | 'zzz' | 'wow' | 'ffxiv';
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  target: { x: number; y: number } | null;
  state: 'wandering' | 'talking' | 'fighting' | 'idle' | 'chasing';
  health: number;
  energy: number;
  color: string;
  element: string;
  relationships: Record<string, number>; // -1 to 1
  currentMessage: string | null;
  messageTimer: number;
  combatTarget: string | null;
  lastAction: number;
}

interface ChatBubble {
  id: string;
  characterId: string;
  message: string;
  timestamp: number;
  duration: number;
}

interface CombatEffect {
  id: string;
  type: 'hit' | 'explosion' | 'heal' | 'buff' | 'debuff';
  position: { x: number; y: number };
  color: string;
  timestamp: number;
}

const CHARACTER_TEMPLATES = [
  {
    name: 'Aria',
    personality: 'curious explorer with wind powers',
    game: 'genshin' as const,
    color: '#4ade80',
    element: 'Anemo',
    phrases: ['The wind carries secrets...', 'Adventure awaits!', 'Feel the breeze!']
  },
  {
    name: 'Nova',
    personality: 'quantum researcher seeking truth',
    game: 'honkai' as const,
    color: '#8b5cf6',
    element: 'Quantum',
    phrases: ['Reality bends to my will...', 'Calculating possibilities...', 'Quantum leap!']
  },
  {
    name: 'Zephyr',
    personality: 'electric warrior with attitude',
    game: 'zzz' as const,
    color: '#f59e0b',
    element: 'Electric',
    phrases: ['Shocking, isn\'t it?', 'Time to get wired!', 'Electric dreams!']
  },
  {
    name: 'Thorin',
    personality: 'steadfast guardian with earth magic',
    game: 'wow' as const,
    color: '#10b981',
    element: 'Earth',
    phrases: ['Stand your ground!', 'By earth and stone!', 'Nature\'s strength flows through me!']
  },
  {
    name: 'Lyralei',
    personality: 'mystical healer with water affinity',
    game: 'ffxiv' as const,
    color: '#06b6d4',
    element: 'Water',
    phrases: ['Healing waters flow...', 'Balance must be maintained...', 'Cleanse and purify!']
  },
  {
    name: 'Kage',
    personality: 'shadow assassin with dark powers',
    game: 'zzz' as const,
    color: '#6b7280',
    element: 'Shadow',
    phrases: ['From the shadows...', 'You won\'t see me coming...', 'Darkness embraces all!']
  },
  {
    name: 'Phoenix',
    personality: 'fiery mage with explosive temper',
    game: 'genshin' as const,
    color: '#ef4444',
    element: 'Pyro',
    phrases: ['Burn bright!', 'Feel the heat!', 'Phoenix rising!']
  },
  {
    name: 'Echo',
    personality: 'time manipulator with cosmic wisdom',
    game: 'honkai' as const,
    color: '#ec4899',
    element: 'Time',
    phrases: ['Time flows like a river...', 'Past, present, future...', 'Temporal shift!']
  }
];

export function DynamicCharacterSystem() {
  const [location] = useLocation();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [chatBubbles, setChatBubbles] = useState<ChatBubble[]>([]);
  const [combatEffects, setCombatEffects] = useState<CombatEffect[]>([]);
  const [battleMode, setBattleMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Initialize characters when component mounts
  useEffect(() => {
    initializeCharacters();
    startCharacterLoop();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Add more characters when visiting different pages
  useEffect(() => {
    const pageCharacterCount = {
      '/': 3,
      '/philosophy': 4,
      '/projects': 5,
      '/consciousness-map': 6,
      '/dashboard': 4
    };
    
    const targetCount = pageCharacterCount[location as keyof typeof pageCharacterCount] || 3;
    if (characters.length < targetCount) {
      addRandomCharacters(targetCount - characters.length);
    }
  }, [location, characters.length]);

  const initializeCharacters = () => {
    const initialCharacters = CHARACTER_TEMPLATES.slice(0, 3).map((template, index) => 
      createCharacter(template, index)
    );
    setCharacters(initialCharacters);
  };

  const createCharacter = (template: typeof CHARACTER_TEMPLATES[0], index: number): Character => {
    const container = containerRef.current;
    const bounds = container?.getBoundingClientRect() || { width: 1200, height: 800 };
    
    return {
      id: `char-${Date.now()}-${index}`,
      name: template.name,
      personality: template.personality,
      game: template.game,
      position: {
        x: 100 + Math.random() * (bounds.width - 200),
        y: 100 + Math.random() * (bounds.height - 200)
      },
      velocity: { x: 0, y: 0 },
      target: null,
      state: 'wandering',
      health: 100,
      energy: 100,
      color: template.color,
      element: template.element,
      relationships: {},
      currentMessage: null,
      messageTimer: 0,
      combatTarget: null,
      lastAction: Date.now()
    };
  };

  const addRandomCharacters = (count: number) => {
    const newCharacters: Character[] = [];
    for (let i = 0; i < count; i++) {
      const template = CHARACTER_TEMPLATES[Math.floor(Math.random() * CHARACTER_TEMPLATES.length)];
      newCharacters.push(createCharacter(template, characters.length + i));
    }
    setCharacters(prev => [...prev, ...newCharacters]);
  };

  const startCharacterLoop = () => {
    const update = () => {
      setCharacters(prev => prev.map(updateCharacter));
      updateChatBubbles();
      updateCombatEffects();
      generateRandomInteractions();
      
      animationFrameRef.current = requestAnimationFrame(update);
    };
    update();
  };

  const updateCharacter = (character: Character): Character => {
    const now = Date.now();
    const container = containerRef.current;
    if (!container) return character;
    
    const bounds = container.getBoundingClientRect();
    let newChar = { ...character };

    // Update based on current state
    switch (character.state) {
      case 'wandering':
        newChar = updateWandering(newChar, bounds);
        break;
      case 'talking':
        newChar = updateTalking(newChar);
        break;
      case 'fighting':
        newChar = updateFighting(newChar, characters);
        break;
      case 'chasing':
        newChar = updateChasing(newChar, characters);
        break;
    }

    // Random state changes
    if (now - character.lastAction > 3000) {
      newChar = maybeChangeState(newChar, characters);
      newChar.lastAction = now;
    }

    // Keep characters in bounds
    newChar.position.x = Math.max(50, Math.min(bounds.width - 50, newChar.position.x));
    newChar.position.y = Math.max(50, Math.min(bounds.height - 50, newChar.position.y));

    return newChar;
  };

  const updateWandering = (character: Character, bounds: DOMRect): Character => {
    let newChar = { ...character };
    
    // Set random target if none exists
    if (!newChar.target) {
      newChar.target = {
        x: 50 + Math.random() * (bounds.width - 100),
        y: 50 + Math.random() * (bounds.height - 100)
      };
    }

    // Move towards target
    const dx = newChar.target.x - newChar.position.x;
    const dy = newChar.target.y - newChar.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      const speed = 1.5;
      newChar.velocity.x = (dx / distance) * speed;
      newChar.velocity.y = (dy / distance) * speed;
      newChar.position.x += newChar.velocity.x;
      newChar.position.y += newChar.velocity.y;
    } else {
      newChar.target = null;
      newChar.velocity = { x: 0, y: 0 };
    }

    return newChar;
  };

  const updateTalking = (character: Character): Character => {
    const newChar = { ...character };
    newChar.velocity = { x: 0, y: 0 }; // Stop moving while talking
    
    if (newChar.messageTimer > 0) {
      newChar.messageTimer -= 16; // Assuming 60fps
    } else {
      newChar.state = 'wandering';
      newChar.currentMessage = null;
    }
    
    return newChar;
  };

  const updateFighting = (character: Character, allCharacters: Character[]): Character => {
    const newChar = { ...character };
    
    if (!newChar.combatTarget) {
      newChar.state = 'wandering';
      return newChar;
    }

    const target = allCharacters.find(c => c.id === newChar.combatTarget);
    if (!target) {
      newChar.state = 'wandering';
      newChar.combatTarget = null;
      return newChar;
    }

    // Move towards target
    const dx = target.position.x - newChar.position.x;
    const dy = target.position.y - newChar.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 80) {
      const speed = 2;
      newChar.velocity.x = (dx / distance) * speed;
      newChar.velocity.y = (dy / distance) * speed;
      newChar.position.x += newChar.velocity.x;
      newChar.position.y += newChar.velocity.y;
    } else {
      // Attack!
      newChar.velocity = { x: 0, y: 0 };
      if (Math.random() < 0.1) { // 10% chance per frame to attack
        createCombatEffect(newChar.position, newChar.color, 'hit');
        generateCombatMessage(newChar);
      }
    }

    return newChar;
  };

  const updateChasing = (character: Character, allCharacters: Character[]): Character => {
    return updateFighting(character, allCharacters); // Similar behavior
  };

  const maybeChangeState = (character: Character, allCharacters: Character[]): Character => {
    const newChar = { ...character };
    const nearbyCharacters = allCharacters.filter(c => 
      c.id !== character.id && getDistance(character.position, c.position) < 150
    );

    if (nearbyCharacters.length > 0 && Math.random() < 0.3) {
      const randomNearby = nearbyCharacters[Math.floor(Math.random() * nearbyCharacters.length)];
      
      // Check relationship
      const relationship = character.relationships[randomNearby.id] || (Math.random() * 2 - 1);
      
      if (relationship < -0.3 && Math.random() < 0.4) {
        // Start fighting
        newChar.state = 'fighting';
        newChar.combatTarget = randomNearby.id;
        setBattleMode(true);
      } else if (relationship > 0.2 && Math.random() < 0.6) {
        // Start talking
        newChar.state = 'talking';
        newChar.messageTimer = 3000;
        generateConversation(newChar, randomNearby);
      }
    }

    return newChar;
  };

  const generateConversation = (char1: Character, char2: Character) => {
    const phrases = CHARACTER_TEMPLATES.find(t => t.name === char1.name)?.phrases || ['Hello there!'];
    const message = phrases[Math.floor(Math.random() * phrases.length)];
    
    const bubble: ChatBubble = {
      id: `bubble-${Date.now()}`,
      characterId: char1.id,
      message,
      timestamp: Date.now(),
      duration: 3000
    };
    
    setChatBubbles(prev => [...prev, bubble]);

    // Generate AI response (simplified)
    setTimeout(() => {
      const responsePhrases = CHARACTER_TEMPLATES.find(t => t.name === char2.name)?.phrases || ['Indeed!'];
      const response = responsePhrases[Math.floor(Math.random() * responsePhrases.length)];
      
      const responseBubble: ChatBubble = {
        id: `bubble-${Date.now()}-response`,
        characterId: char2.id,
        message: response,
        timestamp: Date.now(),
        duration: 3000
      };
      
      setChatBubbles(prev => [...prev, responseBubble]);
    }, 1500);
  };

  const generateCombatMessage = (character: Character) => {
    const combatPhrases = [
      'Take this!',
      `${character.element} power!`,
      'Feel my strength!',
      'Not so fast!',
      'You cannot defeat me!'
    ];
    
    const message = combatPhrases[Math.floor(Math.random() * combatPhrases.length)];
    
    const bubble: ChatBubble = {
      id: `combat-${Date.now()}`,
      characterId: character.id,
      message,
      timestamp: Date.now(),
      duration: 2000
    };
    
    setChatBubbles(prev => [...prev, bubble]);
  };

  const createCombatEffect = (position: { x: number; y: number }, color: string, type: CombatEffect['type']) => {
    const effect: CombatEffect = {
      id: `effect-${Date.now()}`,
      type,
      position: { ...position },
      color,
      timestamp: Date.now()
    };
    
    setCombatEffects(prev => [...prev, effect]);
  };

  const updateChatBubbles = () => {
    setChatBubbles(prev => 
      prev.filter(bubble => Date.now() - bubble.timestamp < bubble.duration)
    );
  };

  const updateCombatEffects = () => {
    setCombatEffects(prev => 
      prev.filter(effect => Date.now() - effect.timestamp < 1000)
    );
  };

  const generateRandomInteractions = () => {
    if (Math.random() < 0.01) { // 1% chance per frame for spontaneous interaction
      const activeCharacters = characters.filter(c => c.state !== 'fighting');
      if (activeCharacters.length >= 2) {
        const char1 = activeCharacters[Math.floor(Math.random() * activeCharacters.length)];
        const char2 = activeCharacters[Math.floor(Math.random() * activeCharacters.length)];
        
        if (char1.id !== char2.id && getDistance(char1.position, char2.position) < 200) {
          generateConversation(char1, char2);
        }
      }
    }
  };

  const getDistance = (pos1: { x: number; y: number }, pos2: { x: number; y: number }) => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleCharacterClick = (character: Character) => {
    // Force interaction or state change
    setCharacters(prev => prev.map(c => {
      if (c.id === character.id) {
        return {
          ...c,
          state: c.state === 'fighting' ? 'wandering' : 'talking',
          messageTimer: 3000,
          combatTarget: null
        };
      }
      return c;
    }));

    // Generate greeting
    const phrases = CHARACTER_TEMPLATES.find(t => t.name === character.name)?.phrases || ['Hello!'];
    const message = `*waves* ${phrases[Math.floor(Math.random() * phrases.length)]}`;
    
    const bubble: ChatBubble = {
      id: `click-${Date.now()}`,
      characterId: character.id,
      message,
      timestamp: Date.now(),
      duration: 3000
    };
    
    setChatBubbles(prev => [...prev, bubble]);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-30 pointer-events-none overflow-hidden"
      style={{ zIndex: 30 }}
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Character Avatar */}
            <motion.div
              className="relative w-12 h-12 rounded-full border-2 flex items-center justify-center
                         shadow-lg backdrop-blur-sm"
              style={{
                borderColor: character.color,
                backgroundColor: `${character.color}20`,
                boxShadow: `0 0 15px ${character.color}60`
              }}
              animate={{
                y: character.state === 'fighting' ? [0, -3, 0] : [0, -1, 0],
                scale: character.state === 'fighting' ? [1, 1.1, 1] : 1,
                rotate: character.velocity.x !== 0 ? (character.velocity.x > 0 ? 5 : -5) : 0
              }}
              transition={{
                y: { duration: character.state === 'fighting' ? 0.5 : 2, repeat: Infinity },
                scale: { duration: 0.5, repeat: character.state === 'fighting' ? Infinity : 0 },
                rotate: { duration: 0.3 }
              }}
            >
              {/* Character Icon */}
              <div 
                className="text-white font-bold text-sm"
                style={{ color: character.color }}
              >
                {character.name.charAt(0)}
              </div>

              {/* State Indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-black">
                {character.state === 'fighting' && (
                  <div className="w-full h-full bg-red-500 rounded-full animate-pulse" />
                )}
                {character.state === 'talking' && (
                  <div className="w-full h-full bg-blue-500 rounded-full animate-pulse" />
                )}
                {character.state === 'wandering' && (
                  <div className="w-full h-full bg-green-500 rounded-full" />
                )}
              </div>

              {/* Health Bar */}
              {character.state === 'fighting' && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 
                               w-8 h-1 bg-black rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-300"
                    style={{ width: `${character.health}%` }}
                  />
                </div>
              )}
            </motion.div>

            {/* Movement Trail */}
            {(character.velocity.x !== 0 || character.velocity.y !== 0) && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${character.color}30, transparent)`
                }}
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
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
              className="absolute pointer-events-none z-40"
              style={{
                left: character.position.x,
                top: character.position.y - 40,
                transform: 'translate(-50%, -100%)'
              }}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
            >
              <div className="bg-black/90 text-white text-xs px-2 py-1 rounded-lg
                             border border-gray-600 max-w-32 text-center whitespace-nowrap
                             overflow-hidden text-ellipsis">
                {bubble.message}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2
                             w-0 h-0 border-l-4 border-r-4 border-t-4
                             border-l-transparent border-r-transparent border-t-black/90" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Combat Effects */}
      <AnimatePresence>
        {combatEffects.map(effect => (
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
              scale: effect.type === 'hit' ? [0, 1.5, 1] : [0, 2, 0],
              opacity: [0, 1, 0],
              rotate: effect.type === 'hit' ? 0 : 360
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
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

      {/* Battle Mode Overlay */}
      <AnimatePresence>
        {battleMode && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50
                       bg-red-900/80 text-white px-4 py-2 rounded-lg border border-red-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onAnimationComplete={() => {
              setTimeout(() => setBattleMode(false), 5000);
            }}
          >
            ⚔️ BATTLE IN PROGRESS ⚔️
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Counter */}
      <div className="absolute top-4 right-4 bg-black/80 text-white text-xs px-2 py-1 rounded
                      border border-gray-600 pointer-events-auto">
        Characters: {characters.length}
      </div>
    </div>
  );
}

export default DynamicCharacterSystem;