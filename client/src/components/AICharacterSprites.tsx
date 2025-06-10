/**
 * AI-Generated Character Sprites System
 * Creates unique visual sprites for each character using SVG generation
 */

import React from 'react';

interface CharacterSpriteProps {
  character: {
    name: string;
    game: 'genshin' | 'honkai' | 'zzz' | 'wow' | 'ffxiv';
    element: string;
    color: string;
    state: 'wandering' | 'talking' | 'fighting' | 'idle' | 'chasing';
  };
  size?: number;
}

export function AICharacterSprite({ character, size = 48 }: CharacterSpriteProps) {
  const generateCharacterSVG = () => {
    const { name, game, element, color, state } = character;
    
    // Generate unique characteristics based on character data
    const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rng = (s: number) => ((s * 9301 + 49297) % 233280) / 233280;
    
    // Character features based on game and element
    const gameStyles = {
      genshin: { bodyShape: 'rounded', eyes: 'large', hair: 'flowing' },
      honkai: { bodyShape: 'sleek', eyes: 'sharp', hair: 'tech' },
      zzz: { bodyShape: 'edgy', eyes: 'neon', hair: 'punk' },
      wow: { bodyShape: 'sturdy', eyes: 'fierce', hair: 'wild' },
      ffxiv: { bodyShape: 'elegant', eyes: 'mystical', hair: 'ornate' }
    };
    
    const style = gameStyles[game];
    const baseHue = parseInt(color.replace('#', ''), 16) % 360;
    
    // Generate unique features
    const hairStyle = rng(seed + 1) > 0.5 ? 'long' : 'short';
    const eyeColor = `hsl(${(baseHue + 60) % 360}, 70%, 60%)`;
    const skinTone = `hsl(${25 + rng(seed + 2) * 40}, 30%, ${60 + rng(seed + 3) * 20}%)`;
    const outfitHue = (baseHue + 120) % 360;
    
    // Animation states
    const isAnimated = state === 'fighting' || state === 'chasing';
    const glowIntensity = state === 'fighting' ? 0.8 : state === 'talking' ? 0.4 : 0.2;
    
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" className="character-sprite">
        <defs>
          {/* Glow filter for magical effects */}
          <filter id={`glow-${name}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Gradient for magical aura */}
          <radialGradient id={`aura-${name}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity={glowIntensity} />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Magical aura background */}
        <circle 
          cx="24" cy="24" r="22" 
          fill={`url(#aura-${name})`}
          className={isAnimated ? "animate-pulse" : ""}
        />
        
        {/* Body */}
        <ellipse 
          cx="24" cy="32" 
          rx={style.bodyShape === 'sturdy' ? "12" : "10"} 
          ry={style.bodyShape === 'elegant' ? "14" : "12"}
          fill={`hsl(${outfitHue}, 60%, 40%)`}
          stroke={color} 
          strokeWidth="1"
        />
        
        {/* Head */}
        <circle 
          cx="24" cy="18" r="8" 
          fill={skinTone}
          stroke={color} 
          strokeWidth="0.5"
          filter={`url(#glow-${name})`}
        />
        
        {/* Hair */}
        {hairStyle === 'long' ? (
          <>
            {/* Long hair */}
            <path 
              d="M16 16 Q24 8 32 16 Q30 22 24 20 Q18 22 16 16" 
              fill={color}
              opacity="0.8"
            />
            <path 
              d="M14 18 Q16 28 20 30" 
              stroke={color} 
              strokeWidth="3" 
              fill="none" 
              opacity="0.6"
            />
            <path 
              d="M34 18 Q32 28 28 30" 
              stroke={color} 
              strokeWidth="3" 
              fill="none" 
              opacity="0.6"
            />
          </>
        ) : (
          /* Short hair */
          <path 
            d="M16 14 Q24 6 32 14 Q28 18 24 16 Q20 18 16 14" 
            fill={color}
            opacity="0.8"
          />
        )}
        
        {/* Eyes */}
        <circle cx="21" cy="17" r="1.5" fill={eyeColor} />
        <circle cx="27" cy="17" r="1.5" fill={eyeColor} />
        
        {/* Eye highlights */}
        <circle cx="21.5" cy="16.5" r="0.5" fill="white" opacity="0.8" />
        <circle cx="27.5" cy="16.5" r="0.5" fill="white" opacity="0.8" />
        
        {/* Facial expression based on state */}
        {state === 'fighting' && (
          <path d="M20 21 Q24 19 28 21" stroke={color} strokeWidth="1" fill="none" />
        )}
        {state === 'talking' && (
          <circle cx="24" cy="21" r="1" fill={skinTone} stroke={color} strokeWidth="0.5" />
        )}
        {(state === 'wandering' || state === 'idle') && (
          <path d="M20 21 Q24 23 28 21" stroke={color} strokeWidth="1" fill="none" />
        )}
        
        {/* Element symbol */}
        <g transform="translate(36, 36)">
          {element === 'Anemo' && (
            <circle cx="0" cy="0" r="4" fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.8" />
          )}
          {element === 'Pyro' && (
            <path d="M-2 2 L0 -2 L2 2 Z" fill="#ef4444" opacity="0.8" />
          )}
          {element === 'Hydro' && (
            <path d="M0 -2 Q-2 0 0 2 Q2 0 0 -2" fill="#06b6d4" opacity="0.8" />
          )}
          {element === 'Electro' && (
            <path d="M-1 -2 L1 0 L-1 2 L0 0 Z" fill="#f59e0b" opacity="0.8" />
          )}
          {element === 'Quantum' && (
            <rect x="-1.5" y="-1.5" width="3" height="3" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.8" />
          )}
          {element === 'Shadow' && (
            <circle cx="0" cy="0" r="2" fill="#6b7280" opacity="0.6" />
          )}
          {element === 'Earth' && (
            <rect x="-2" y="-1" width="4" height="2" fill="#10b981" opacity="0.8" />
          )}
          {element === 'Time' && (
            <circle cx="0" cy="0" r="3" fill="none" stroke="#ec4899" strokeWidth="0.5" opacity="0.8" />
          )}
        </g>
        
        {/* Game-specific accessories */}
        {game === 'genshin' && (
          <path d="M24 10 L26 8 L28 10" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
        )}
        {game === 'honkai' && (
          <rect x="22" y="8" width="4" height="1" fill={color} opacity="0.6" />
        )}
        {game === 'zzz' && (
          <circle cx="18" cy="12" r="1" fill="#f59e0b" opacity="0.8" />
        )}
        {game === 'wow' && (
          <path d="M20 12 L24 10 L28 12" stroke={color} strokeWidth="2" fill="none" opacity="0.7" />
        )}
        {game === 'ffxiv' && (
          <path d="M22 9 Q24 7 26 9" stroke={color} strokeWidth="1" fill="none" opacity="0.8" />
        )}
        
        {/* Combat effects */}
        {state === 'fighting' && (
          <g className="animate-spin" style={{ transformOrigin: '24px 24px' }}>
            <path d="M12 24 L36 24 M24 12 L24 36" stroke={color} strokeWidth="1" opacity="0.3" />
          </g>
        )}
        
        {/* Movement particles */}
        {(state === 'wandering' || state === 'chasing') && (
          <g>
            <circle cx="8" cy="38" r="1" fill={color} opacity="0.3" className="animate-bounce" />
            <circle cx="40" cy="38" r="1" fill={color} opacity="0.3" className="animate-bounce" style={{ animationDelay: '0.1s' }} />
          </g>
        )}
      </svg>
    );
  };

  return <div className="character-sprite-container">{generateCharacterSVG()}</div>;
}

export default AICharacterSprite;