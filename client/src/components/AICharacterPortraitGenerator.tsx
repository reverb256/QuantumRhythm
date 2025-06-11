/**
 * AI Character Portrait Generator
 * Generates dynamic anime-style portraits using multiple GenAI providers
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { genAI } from '@/services/GenAIOrchestrator';

interface CharacterPortrait {
  characterId: string;
  imageUrl: string;
  generatedAt: number;
  provider: string;
  prompt: string;
}

interface AICharacterPortraitGeneratorProps {
  character: {
    id: string;
    name: string;
    element: string;
    personality: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      glow: string;
    };
  };
  onPortraitGenerated?: (portrait: CharacterPortrait) => void;
}

export function AICharacterPortraitGenerator({ character, onPortraitGenerated }: AICharacterPortraitGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPortrait, setCurrentPortrait] = useState<CharacterPortrait | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState<string>('');

  const generatePortrait = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setError('');
    setGenerationProgress(0);

    try {
      // Create enhanced prompt for anime generation
      const characterPrompt = createAnimePrompt(character);
      
      setGenerationProgress(25);
      
      // Generate using AI orchestrator
      const imageUrl = await genAI.generateAnimeImage({
        prompt: characterPrompt,
        character: character.name.toLowerCase().replace(' ', '_') as any,
        style: 'hoyoverse',
        quality: 'hd'
      });
      
      setGenerationProgress(75);
      
      const portrait: CharacterPortrait = {
        characterId: character.id,
        imageUrl,
        generatedAt: Date.now(),
        provider: 'Pollinations AI',
        prompt: characterPrompt
      };
      
      setCurrentPortrait(portrait);
      onPortraitGenerated?.(portrait);
      setGenerationProgress(100);
      
    } catch (error) {
      console.error('Portrait generation failed:', error);
      setError('Failed to generate portrait. Trying alternative providers...');
      
      // Fallback to procedural generation
      try {
        const fallbackPortrait = generateProceduralPortrait(character);
        setCurrentPortrait(fallbackPortrait);
        onPortraitGenerated?.(fallbackPortrait);
      } catch (fallbackError) {
        setError('All portrait generation methods failed');
      }
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 2000);
    }
  };

  const createAnimePrompt = (char: typeof character): string => {
    const elementStyles = {
      'Quantum': 'cosmic energy, stellar patterns, quantum particles',
      'Anemo': 'wind currents, floating elements, cyan aura',
      'Electro': 'electric sparks, purple lightning, cyber elements',
      'Geo': 'golden crystal formations, earth patterns',
      'Hydro': 'water effects, blue crystalline patterns',
      'Pyro': 'flame aura, orange-red energy',
      'Cryo': 'ice crystals, blue-white frost patterns',
      'Dendro': 'nature patterns, green life energy',
      'Imaginary': 'reality distortion, golden void patterns'
    };

    const personalityToStyle = {
      'Star Rail': 'futuristic space aesthetic, cosmic background',
      'Genshin': 'fantasy medieval aesthetic, elemental magic',
      'ZZZ': 'cyberpunk urban aesthetic, neon lighting',
      'Honkai': 'sci-fi battle aesthetic, advanced technology'
    };

    const gameStyle = Object.keys(personalityToStyle).find(game => 
      char.personality.toLowerCase().includes(game.toLowerCase())
    ) || 'Genshin';

    return `masterpiece, best quality, highly detailed anime portrait, ${char.name}, 
            ${elementStyles[char.element as keyof typeof elementStyles] || 'magical aura'}, 
            ${personalityToStyle[gameStyle as keyof typeof personalityToStyle]},
            beautiful detailed eyes, detailed face, professional illustration,
            vibrant colors, perfect anatomy, 8K resolution, trending on artstation,
            HoYoverse style, ${char.element.toLowerCase()} element theme,
            dynamic pose, confident expression, detailed clothing,
            background with ${char.colors.primary} and ${char.colors.secondary} color scheme`;
  };

  const generateProceduralPortrait = (char: typeof character): CharacterPortrait => {
    // Create SVG-based procedural portrait as fallback
    const svgPortrait = `data:image/svg+xml,${encodeURIComponent(`
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg" cx="50%" cy="30%">
            <stop offset="0%" style="stop-color:${char.colors.primary}" />
            <stop offset="100%" style="stop-color:${char.colors.secondary}" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Background -->
        <circle cx="200" cy="200" r="180" fill="url(#bg)" opacity="0.3"/>
        
        <!-- Character silhouette -->
        <ellipse cx="200" cy="320" rx="60" ry="80" fill="${char.colors.primary}" opacity="0.8"/>
        
        <!-- Head -->
        <circle cx="200" cy="180" r="45" fill="${char.colors.accent}" opacity="0.9"/>
        
        <!-- Hair -->
        <path d="M155 160 Q200 140 245 160 Q240 120 200 115 Q160 120 155 160" 
              fill="${char.colors.secondary}" opacity="0.8"/>
        
        <!-- Eyes -->
        <circle cx="185" cy="175" r="8" fill="${char.colors.glow}" filter="url(#glow)"/>
        <circle cx="215" cy="175" r="8" fill="${char.colors.glow}" filter="url(#glow)"/>
        
        <!-- Element symbol -->
        <circle cx="350" cy="50" r="25" fill="${char.colors.primary}" opacity="0.7"/>
        <text x="350" y="55" text-anchor="middle" fill="white" font-size="16" font-weight="bold">
          ${char.element.charAt(0)}
        </text>
        
        <!-- Decorative elements -->
        <circle cx="100" cy="100" r="3" fill="${char.colors.glow}" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="320" cy="150" r="2" fill="${char.colors.accent}" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        
        <!-- Character name -->
        <text x="200" y="380" text-anchor="middle" fill="${char.colors.primary}" 
              font-size="14" font-weight="bold">${char.name}</text>
      </svg>
    `)}`;

    return {
      characterId: char.id,
      imageUrl: svgPortrait,
      generatedAt: Date.now(),
      provider: 'Procedural SVG',
      prompt: 'Fallback procedural generation'
    };
  };

  useEffect(() => {
    // Auto-generate portrait on mount
    generatePortrait();
  }, [character.id]);

  return (
    <div className="relative">
      {/* Portrait Display */}
      <motion.div 
        className="relative w-32 h-32 rounded-full overflow-hidden border-2 cursor-pointer"
        style={{ borderColor: character.colors.primary }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generatePortrait}
      >
        {currentPortrait ? (
          <img 
            src={currentPortrait.imageUrl}
            alt={`${character.name} portrait`}
            className="w-full h-full object-cover"
            onError={() => {
              // Regenerate on image load error
              console.warn('Portrait image failed to load, regenerating...');
              generatePortrait();
            }}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: character.colors.primary }}
          >
            {character.name.charAt(0)}
          </div>
        )}
        
        {/* Generation overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center">
              <div 
                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2"
              />
              <div className="text-xs text-white">
                {generationProgress}%
              </div>
            </div>
          </div>
        )}
        
        {/* Element indicator */}
        <div 
          className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: character.colors.glow }}
        >
          {character.element.charAt(0)}
        </div>
      </motion.div>
      
      {/* Error display */}
      {error && (
        <div className="absolute -bottom-8 left-0 right-0 text-xs text-red-400 text-center">
          {error}
        </div>
      )}
      
      {/* Generation info */}
      {currentPortrait && !isGenerating && (
        <div className="absolute -bottom-6 left-0 right-0 text-xs text-gray-400 text-center">
          {currentPortrait.provider}
        </div>
      )}
    </div>
  );
}

export default AICharacterPortraitGenerator;