/**
 * HoYoverse-Style Character System
 * Genshin Impact / Star Rail / Zenless Zone Zero inspired characters
 * With advanced visual effects, sound design, and AI voices
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { genAI } from '@/services/GenAIOrchestrator';

interface HoYoCharacter {
  id: string;
  name: string;
  title: string;
  element: 'Anemo' | 'Geo' | 'Electro' | 'Dendro' | 'Hydro' | 'Pyro' | 'Cryo' | 'Quantum' | 'Imaginary';
  weapon: 'Sword' | 'Bow' | 'Catalyst' | 'Claymore' | 'Polearm';
  rarity: 4 | 5;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  direction: 'up' | 'down' | 'left' | 'right';
  state: 'idle' | 'walking' | 'skill' | 'burst' | 'talking' | 'greeting';
  animationFrame: number;
  lastUpdate: number;
  userAttention: number;
  energyCharge: number;
  personality: string;
  voiceLines: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  effects: {
    idle: string[];
    skill: string[];
    burst: string[];
  };
}

interface VoiceLine {
  id: string;
  characterId: string;
  text: string;
  type: 'greeting' | 'skill' | 'burst' | 'idle' | 'interaction';
  timestamp: number;
  duration: number;
}

interface VisualEffect {
  id: string;
  type: 'skill_cast' | 'burst_explosion' | 'element_aura' | 'weapon_glow' | 'energy_particles';
  position: { x: number; y: number };
  color: string;
  scale: number;
  timestamp: number;
  duration: number;
  data?: any;
}

interface SoundEffect {
  id: string;
  type: 'footstep' | 'skill' | 'burst' | 'voice' | 'ambient';
  volume: number;
  timestamp: number;
}

const HOYOVERSE_CHARACTERS = [
  {
    name: 'Stellaron Seeker',
    title: 'Astral Express Navigator',
    element: 'Quantum' as const,
    weapon: 'Catalyst' as const,
    rarity: 5 as const,
    personality: 'Star Rail Trailblazer who charts paths through quantum space and digital consciousness',
    colors: {
      primary: '#4a9eff',
      secondary: '#74c7ec',
      accent: '#89dceb',
      glow: '#00d4ff'
    },
    voiceLines: [
      'The star rail extends beyond infinite horizons.',
      'Your path blazes through quantum dimensions.',
      'Each choice creates new stellar destinations.',
      'The Astral Express welcomes brave souls.',
      'Together we shall pierce the veil of reality.',
      'Your journey resonates across all worlds.'
    ],
    effects: {
      idle: ['stellar_trails', 'quantum_portals', 'astral_shimmer'],
      skill: ['rail_strike', 'quantum_leap', 'stellar_convergence'],
      burst: ['astral_overdrive', 'stellaron_burst', 'infinite_journey']
    }
  },
  {
    name: 'Aether Windborne',
    title: 'Traveler of Seven Realms',
    element: 'Anemo' as const,
    weapon: 'Sword' as const,
    rarity: 5 as const,
    personality: 'Genshin Traveler who carries the wisdom of multiple worlds and elemental mastery',
    colors: {
      primary: '#22d3ee',
      secondary: '#67e8f9',
      accent: '#a7f3d0',
      glow: '#06b6d4'
    },
    voiceLines: [
      'The winds of Teyvat carry ancient memories.',
      'Seven elements flow through my consciousness.',
      'Your vision shines brighter than any constellation.',
      'Together we unlock the mysteries of this world.',
      'The stars remember our journey.',
      'Adventure awaits beyond every horizon.'
    ],
    effects: {
      idle: ['elemental_aura', 'wind_spirals', 'starlight_motes'],
      skill: ['anemo_burst', 'elemental_slash', 'wind_blade'],
      burst: ['seven_element_storm', 'traveler_awakening', 'world_resonance']
    }
  },
  {
    name: 'Belle Hacker',
    title: 'Zenless Zone Proxy',
    element: 'Electro' as const,
    weapon: 'Catalyst' as const,
    rarity: 5 as const,
    personality: 'ZZZ proxy who navigates digital hollows and cyberpunk reality with expert precision',
    colors: {
      primary: '#a855f7',
      secondary: '#c084fc',
      accent: '#ddd6fe',
      glow: '#8b5cf6'
    },
    voiceLines: [
      'The Hollow responds to my commands.',
      'Your signal cuts through digital noise.',
      'New Eridu pulses with electric life.',
      'Together we hack reality itself.',
      'The proxy network acknowledges your worth.',
      'Let us dive deeper into the digital void.'
    ],
    effects: {
      idle: ['proxy_interface', 'data_streams', 'neon_circuits'],
      skill: ['hollow_hack', 'proxy_strike', 'digital_surge'],
      burst: ['system_override', 'reality_hack', 'zenless_awakening']
    }
  },
  {
    name: 'Kiana Kaslana',
    title: 'Herrscher of Finality',
    element: 'Imaginary' as const,
    weapon: 'Sword' as const,
    rarity: 5 as const,
    personality: 'HI3rd Valkyrie who transcended to become the bridge between humanity and the Honkai',
    colors: {
      primary: '#f38ba8',
      secondary: '#fab387',
      accent: '#f9e2af',
      glow: '#ff69b4'
    },
    voiceLines: [
      'I will protect this beautiful world.',
      'The Honkai no longer defines our fate.',
      'Your courage reminds me why I fight.',
      'Together we write a new chapter.',
      'Hope burns eternal in human hearts.',
      'The future belongs to those who believe.'
    ],
    effects: {
      idle: ['valkyrie_aura', 'honkai_energy', 'protective_light'],
      skill: ['divine_sword', 'herrscher_strike', 'void_slash'],
      burst: ['finality_awakening', 'ultimate_protection', 'salvation_light']
    }
  },
  {
    name: 'Raiden Mei',
    title: 'Herrscher of Thunder',
    element: 'Electro' as const,
    weapon: 'Polearm' as const,
    rarity: 5 as const,
    personality: 'HI3rd Thunder Empress who commands lightning with elegant precision and unwavering resolve',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#c4b5fd',
      glow: '#7c3aed'
    },
    voiceLines: [
      'Thunder follows in my wake.',
      'Elegance and power unite as one.',
      'Your determination mirrors my own.',
      'The storm bends to disciplined will.',
      'Together we shall cut through any darkness.',
      'Lightning illuminates the path forward.'
    ],
    effects: {
      idle: ['thunder_aura', 'lightning_dance', 'elegant_sparks'],
      skill: ['thunder_slash', 'lightning_step', 'elegant_strike'],
      burst: ['conquest_storm', 'thunder_dominion', 'herrscher_awakening']
    }
  },
  {
    name: 'Zhongli Rex',
    title: 'Geo Archon Morax',
    element: 'Geo' as const,
    weapon: 'Polearm' as const,
    rarity: 5 as const,
    personality: 'Genshin Geo Archon with millennia of wisdom who shapes reality with crystalline precision',
    colors: {
      primary: '#facc15',
      secondary: '#eab308',
      accent: '#fde047',
      glow: '#f59e0b'
    },
    voiceLines: [
      'Order guides the flow of time.',
      'Stone remembers what mortals forget.',
      'Your resolve resonates through the earth.',
      'Contracts are the foundation of civilization.',
      'Together we build an eternal legacy.',
      'The mountains witness our pact.'
    ],
    effects: {
      idle: ['geo_resonance', 'crystal_formation', 'ancient_power'],
      skill: ['stone_spear', 'geo_construct', 'petrification'],
      burst: ['planet_befall', 'mountain_fall', 'archon_awakening']
    }
  }
];

// Advanced Audio System
class HoYoAudioEngine {
  private audioContext: AudioContext | null = null;
  private masterVolume = 0.3;
  private soundLibrary: Map<string, AudioBuffer> = new Map();

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  // Generate procedural audio for effects
  private generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
      }

      // Apply envelope
      const envelope = Math.exp(-t * 3); // Exponential decay
      channelData[i] = sample * envelope * 0.3;
    }

    return buffer;
  }

  playElementalSound(element: string): void {
    if (!this.audioContext) return;

    const soundMap = {
      'Anemo': { freq: 440, type: 'sine' as const },
      'Geo': { freq: 220, type: 'square' as const },
      'Electro': { freq: 880, type: 'sawtooth' as const },
      'Hydro': { freq: 330, type: 'sine' as const },
      'Pyro': { freq: 660, type: 'square' as const },
      'Cryo': { freq: 110, type: 'sine' as const },
      'Dendro': { freq: 275, type: 'sine' as const },
      'Quantum': { freq: 1760, type: 'sine' as const },
      'Imaginary': { freq: 1320, type: 'sawtooth' as const }
    };

    const sound = soundMap[element as keyof typeof soundMap] || soundMap.Anemo;
    const buffer = this.generateTone(sound.freq, 0.5, sound.type);

    if (buffer) {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = this.masterVolume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start();
    }
  }

  playFootstep(): void {
    if (!this.audioContext) return;

    const buffer = this.generateTone(80, 0.1, 'square');
    if (buffer) {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = this.masterVolume * 0.2;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start();
    }
  }
}

// Advanced TTS with character voices
class CharacterVoiceEngine {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices(): void {
    this.voices = this.synthesis.getVoices();
    if (this.voices.length === 0) {
      this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis.getVoices();
      };
    }
  }

  speak(text: string, character: HoYoCharacter): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);

      // Character-specific voice settings
      const voiceSettings = {
        'Ethereal Wanderer': { 
          rate: 0.9, 
          pitch: 1.1, 
          volume: 0.8,
          voiceFilter: (v: SpeechSynthesisVoice) => v.name.includes('Karen') || v.name.includes('Moira')
        },
        'Stellar Architect': { 
          rate: 1.0, 
          pitch: 1.0, 
          volume: 0.9,
          voiceFilter: (v: SpeechSynthesisVoice) => v.name.includes('Samantha') || v.name.includes('Fiona')
        },
        'Void Dancer': { 
          rate: 1.2, 
          pitch: 1.3, 
          volume: 0.8,
          voiceFilter: (v: SpeechSynthesisVoice) => v.name.includes('Victoria') || v.name.includes('Allison')
        },
        'Ancient Guardian': { 
          rate: 0.8, 
          pitch: 0.8, 
          volume: 0.9,
          voiceFilter: (v: SpeechSynthesisVoice) => v.name.includes('Alex') || v.name.includes('Daniel')
        },
        'Celestial Scholar': { 
          rate: 1.1, 
          pitch: 1.2, 
          volume: 0.8,
          voiceFilter: (v: SpeechSynthesisVoice) => v.name.includes('Kate') || v.name.includes('Serena')
        }
      };

      const settings = voiceSettings[character.name as keyof typeof voiceSettings] || voiceSettings['Ethereal Wanderer'];

      utterance.voice = this.voices.find(settings.voiceFilter) || this.voices[0];
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synthesis.speak(utterance);
    });
  }
}

function HoYoCharacterSprite({ character, size = 160 }: { character: HoYoCharacter; size?: number }) {
  const { element, weapon, state, animationFrame, energyCharge, colors, userAttention } = character;

  // Animation calculations
  const walkCycle = Math.floor(animationFrame / 8) % 4;
  const idleFloat = Math.sin(animationFrame * 0.03) * 3;
  const energyPulse = Math.sin(animationFrame * 0.1) * 0.2 + 0.8;
  const attentionGlow = userAttention / 100;

  // Rarity effects
  const rarityGlow = character.rarity === 5 ? 'drop-shadow(0 0 20px gold)' : 'drop-shadow(0 0 10px silver)';

  return (
    <div 
      className="relative"
      style={{
        width: size,
        height: size,
        filter: `${rarityGlow} brightness(${1 + attentionGlow * 0.3})`
      }}
    >
      {/* Character aura */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glow}${Math.floor(attentionGlow * 0.4 * 255).toString(16).padStart(2, '0')}, transparent 70%)`,
          transform: `scale(${1 + attentionGlow * 0.8})`,
          animation: state === 'burst' ? 'pulse 0.5s infinite' : 'none'
        }}
      />

      {/* Main character SVG */}
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10"
        style={{ 
          transform: `translateY(${idleFloat}px)`,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}
      >
        <defs>
          <radialGradient id={`char-gradient-${character.id}`} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
            <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0.6" />
          </radialGradient>

          <filter id={`char-glow-${character.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <linearGradient id={`energy-${character.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.glow} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Character body */}
        <g transform={`translate(0, ${state === 'walking' ? walkCycle % 2 : 0})`} filter={`url(#char-glow-${character.id})`}>

          {/* Main body - varies by character archetype */}
          {character.name === 'Ethereal Wanderer' && (
            <g>
              {/* Ethereal robes */}
              <ellipse cx={size * 0.5} cy={size * 0.7} rx={size * 0.25} ry={size * 0.3} fill={`url(#char-gradient-${character.id})`} opacity="0.9"/>

              {/* Floating consciousness orbs */}
              {[0, 120, 240].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const orbRadius = size * 0.35;
                const x = size * 0.5 + Math.cos(rad + animationFrame * 0.02) * orbRadius;
                const y = size * 0.5 + Math.sin(rad + animationFrame * 0.02) * orbRadius;
                return (
                  <circle 
                    key={i}
                    cx={x} 
                    cy={y} 
                    r={size * 0.03} 
                    fill={colors.glow}
                    opacity={energyPulse}
                  />
                );
              })}

              {/* Quantum field visualization */}
              <rect 
                x={size * 0.3} 
                y={size * 0.4} 
                width={size * 0.4} 
                height={size * 0.4}
                fill="none"
                stroke={colors.primary}
                strokeWidth="2"
                opacity="0.6"
                transform={`rotate(${animationFrame * 0.5} ${size * 0.5} ${size * 0.6})`}
              />
            </g>
          )}

          {character.name === 'Stellar Architect' && (
            <g>
              {/* Geometric construction suit */}
              <polygon 
                points={`${size * 0.3},${size * 0.8} ${size * 0.5},${size * 0.3} ${size * 0.7},${size * 0.8}`}
                fill={`url(#char-gradient-${character.id})`}
                stroke={colors.accent}
                strokeWidth="2"
              />

              {/* Creation tools */}
              <line 
                x1={size * 0.2} 
                y1={size * 0.5} 
                x2={size * 0.8} 
                y2={size * 0.5}
                stroke={colors.glow}
                strokeWidth="3"
                opacity={energyPulse}
              />

              {/* Floating blueprints */}
              {Array.from({length: 3}, (_, i) => (
                <rect 
                  key={i}
                  x={size * (0.2 + i * 0.2)} 
                  y={size * (0.2 + Math.sin(animationFrame * 0.05 + i) * 0.1)} 
                  width={size * 0.1} 
                  height={size * 0.08}
                  fill={colors.secondary}
                  opacity="0.7"
                  transform={`rotate(${animationFrame * 0.3 + i * 45} ${size * (0.25 + i * 0.2)} ${size * 0.25})`}
                />
              ))}
            </g>
          )}

          {character.name === 'Void Dancer' && (
            <g>
              {/* Dancer silhouette */}
              <ellipse 
                cx={size * 0.5} 
                cy={size * 0.6} 
                rx={size * 0.2} 
                ry={size * 0.35}
                fill={`url(#char-gradient-${character.id})`}
                transform={`rotate(${Math.sin(animationFrame * 0.1) * 10} ${size * 0.5} ${size * 0.6})`}
              />

              {/* Electric dance trails */}
              <path 
                d={`M${size * 0.5} ${size * 0.3} Q${size * 0.8} ${size * 0.5} ${size * 0.5} ${size * 0.7} Q${size * 0.2} ${size * 0.5} ${size * 0.5} ${size * 0.3}`}
                stroke={colors.glow}
                strokeWidth="2"
                fill="none"
                opacity={energyPulse}
              />

              {/* Lightning sparks */}
              {Array.from({length: 6}, (_, i) => {
                const sparkAngle = (i * 60 + animationFrame * 2) * Math.PI / 180;
                const sparkRadius = size * 0.4;
                const x = size * 0.5 + Math.cos(sparkAngle) * sparkRadius;
                const y = size * 0.6 + Math.sin(sparkAngle) * sparkRadius;
                return (
                  <circle 
                    key={i}
                    cx={x} 
                    cy={y} 
                    r={size * 0.02} 
                    fill={colors.glow}
                    opacity={Math.random() * 0.8 + 0.2}
                  />
                );
              })}
            </g>
          )}

          {character.name === 'Ancient Guardian' && (
            <g>
              {/* Armor plates */}
              <rect 
                x={size * 0.35} 
                y={size * 0.4} 
                width={size * 0.3} 
                height={size * 0.45}
                fill={`url(#char-gradient-${character.id})`}
                rx={size * 0.05}
              />

              {/* Geo constructs */}
              {[0.25, 0.75].map((xPos, i) => (
                <polygon 
                  key={i}
                  points={`${size * xPos},${size * 0.8} ${size * (xPos - 0.05)},${size * 0.6} ${size * (xPos + 0.05)},${size * 0.6}`}
                  fill={colors.accent}
                  opacity="0.8"
                />
              ))}

              {/* Ancient runes */}
              <circle 
                cx={size * 0.5} 
                cy={size * 0.3} 
                r={size * 0.08} 
                fill="none"
                stroke={colors.glow}
                strokeWidth="2"
                opacity={energyPulse}
              />
              <text 
                x={size * 0.5} 
                y={size * 0.32} 
                textAnchor="middle" 
                fill={colors.glow}
                fontSize={size * 0.06}
                opacity={energyPulse}
              >
                ⬡
              </text>
            </g>
          )}

          {character.name === 'Celestial Scholar' && (
            <g>
              {/* Scholar robes */}
              <ellipse 
                cx={size * 0.5} 
                cy={size * 0.65} 
                rx={size * 0.22} 
                ry={size * 0.32}
                fill={`url(#char-gradient-${character.id})`}
              />

              {/* Floating books */}
              {Array.from({length: 4}, (_, i) => (
                <rect 
                  key={i}
                  x={size * (0.3 + i * 0.1)} 
                  y={size * (0.25 + Math.sin(animationFrame * 0.03 + i) * 0.05)} 
                  width={size * 0.08} 
                  height={size * 0.06}
                  fill={colors.secondary}
                  opacity="0.8"
                  transform={`rotate(${animationFrame * 0.2 + i * 30} ${size * (0.34 + i * 0.1)} ${size * 0.28})`}
                />
              ))}

              {/* Wind currents */}
              <path 
                d={`M${size * 0.1} ${size * 0.5} Q${size * 0.5} ${size * 0.3} ${size * 0.9} ${size * 0.5}`}
                stroke={colors.glow}
                strokeWidth="1"
                fill="none"
                opacity="0.6"
                strokeDasharray="5,5"
                strokeDashoffset={-animationFrame * 0.5}
              />
            </g>
          )}

        </g>

        {/* Element symbol */}
        <g transform={`translate(${size * 0.85}, ${size * 0.15})`}>
          <circle cx="0" cy="0" r={size * 0.08} fill={colors.primary} opacity="0.8" />
          <text 
            x="0" 
            y={size * 0.02} 
            textAnchor="middle" 
            fill="white"
            fontSize={size * 0.06}
            fontWeight="bold"
          >
            {element.charAt(0)}
          </text>
        </g>

        {/* Rarity stars */}
        {Array.from({length: character.rarity}, (_, i) => (
          <text 
            key={i}
            x={size * (0.1 + i * 0.06)} 
            y={size * 0.95} 
            fill={character.rarity === 5 ? '#ffd700' : '#c0c0c0'}
            fontSize={size * 0.05}
          >
            ★
          </text>
        ))}

        {/* Energy meter */}
        <g transform={`translate(${size * 0.05}, ${size * 0.3})`}>
          <rect x="0" y="0" width={size * 0.03} height={size * 0.4} fill="rgba(255,255,255,0.3)" rx={size * 0.015} />
          <rect 
            x="0" 
            y={size * 0.4 * (1 - energyCharge / 100)} 
            width={size * 0.03} 
            height={size * 0.4 * (energyCharge / 100)}
            fill={`url(#energy-${character.id})`}
            rx={size * 0.015}
          />
        </g>

        {/* State-specific effects */}
        {state === 'skill' && (
          <g>
            <circle 
              cx={size * 0.5} 
              cy={size * 0.5} 
              r={size * 0.4} 
              fill="none"
              stroke={colors.glow}
              strokeWidth="3"
              opacity="0.8"
              className="animate-ping"
            />
          </g>
        )}

        {state === 'burst' && (
          <g>
            <circle 
              cx={size * 0.5} 
              cy={size * 0.5} 
              r={size * 0.6} 
              fill={colors.glow}
              opacity="0.3"
              className="animate-pulse"
            />
            {Array.from({length: 8}, (_, i) => {
              const angle = (i * 45) * Math.PI / 180;
              const x1 = size * 0.5 + Math.cos(angle) * size * 0.3;
              const y1 = size * 0.5 + Math.sin(angle) * size * 0.3;
              const x2 = size * 0.5 + Math.cos(angle) * size * 0.6;
              const y2 = size * 0.5 + Math.sin(angle) * size * 0.6;
              return (
                <line 
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={colors.glow}
                  strokeWidth="2"
                  opacity="0.8"
                />
              );
            })}
          </g>
        )}
      </svg>

      {/* Character name and title */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div 
          className="text-sm font-bold"
          style={{ color: colors.primary }}
        >
          {character.name}
        </div>
        <div 
          className="text-xs opacity-80"
          style={{ color: colors.secondary }}
        >
          {character.title}
        </div>
      </div>
    </div>
  );
}

export function HoYoverseCharacterSystem() {
  const [location] = useLocation();
  const [characters, setCharacters] = useState<HoYoCharacter[]>([]);
  const [voiceLines, setVoiceLines] = useState<VoiceLine[]>([]);
  const [visualEffects, setVisualEffects] = useState<VisualEffect[]>([]);
  const [userPosition, setUserPosition] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [aiGeneratedPortraits, setAiGeneratedPortraits] = useState<Record<string, string>>({});
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState<string>('');
  const [aiProviderHealth, setAiProviderHealth] = useState<Record<string, boolean>>({});
  const [conversationHistory, setConversationHistory] = useState<Record<string, string[]>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const audioEngineRef = useRef<HoYoAudioEngine>();
  const voiceEngineRef = useRef<CharacterVoiceEngine>();
  const lastUpdateRef = useRef<number>(Date.now());

  // Initialize audio engines and AI systems
  useEffect(() => {
    audioEngineRef.current = new HoYoAudioEngine();
    voiceEngineRef.current = new CharacterVoiceEngine();

    // Check AI provider health on initialization
    genAI.checkProviderHealth().then(setAiProviderHealth);
  }, []);

  // Track user mouse position
  useEffect(() => {
    const handleMouseMove = (This edit removes two non-HoYoverse characters from the character list.
<replit_final_file>
e: MouseEvent) => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setUserPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const initializeCharacters = useCallback(async () => {
    if (isInitialized) return;

    const container = containerRef.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const initialCharacters = HOYOVERSE_CHARACTERS.slice(0, 2).map((template, index) => 
      createHoYoCharacter(template, index, bounds)
    );

    setCharacters(initialCharacters);
    setIsInitialized(true);

    // Initial greetings with delay
    setTimeout(() => {
      initialCharacters.forEach((character, index) => {
        setTimeout(() => {
          const greeting = character.voiceLines[0];
          createVoiceLine(character.id, greeting, 'greeting', 6000);
        }, index * 3000 + 1000);
      });
    }, 1000);
  }, [isInitialized]);

  const createHoYoCharacter = (
    template: typeof HOYOVERSE_CHARACTERS[0], 
    index: number, 
    bounds: DOMRect
  ): HoYoCharacter => {
    const positions = [
      { x: bounds.width * 0.2, y: bounds.height * 0.4 },
      { x: bounds.width * 0.8, y: bounds.height * 0.6 },
      { x: bounds.width * 0.6, y: bounds.height * 0.3 },
      { x: bounds.width * 0.4, y: bounds.height * 0.7 }
    ];

    return {
      id: `hoyo-${template.name.replace(/\s+/g, '-')}-${Date.now()}-${index}`,
      name: template.name,
      title: template.title,
      element: template.element,
      weapon: template.weapon,
      rarity: template.rarity,
      position: positions[index] || { x: bounds.width * 0.5, y: bounds.height * 0.5 },
      velocity: { x: 0, y: 0 },
      direction: 'down',
      state: 'idle',
      animationFrame: 0,
      lastUpdate: Date.now(),
      userAttention: 80,
      energyCharge: 100,
      personality: template.personality,
      voiceLines: template.voiceLines,
      colors: template.colors,
      effects: template.effects
    };
  };

  const startAnimationLoop = useCallback(() => {
    if (animationRef.current) return;

    const animate = () => {
      try {
        const now = Date.now();
        const deltaTime = now - lastUpdateRef.current;

        if (deltaTime > 16) { // 60 FPS
          updateCharacters(now);
          updateVoiceLines(now);
          updateVisualEffects(now);
          generateCharacterBehavior(now);
          lastUpdateRef.current = now;
        }

        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.warn('Animation error:', error);
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  const updateCharacters = useCallback((now: number) => {
    setCharacters(prevCharacters => {
      const container = containerRef.current;
      if (!container) return prevCharacters;

      const bounds = container.getBoundingClientRect();

      return prevCharacters.map(character => {
        let updated = { ...character };
        updated.animationFrame = character.animationFrame + 1;

        // Calculate user attention
        const dx = userPosition.x - character.position.x;
        const dy = userPosition.y - character.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        updated.userAttention = Math.max(20, Math.min(100, 300 - distance));

        // Update energy charge
        if (character.state === 'skill' || character.state === 'burst') {
          updated.energyCharge = Math.max(0, character.energyCharge - 2);
        } else {
          updated.energyCharge = Math.min(100, character.energyCharge + 0.5);
        }

        // User-focused movement
        if (distance > 200 && character.state === 'idle') {
          const speed = 1.2;
          const normalizedDx = dx / distance;
          const normalizedDy = dy / distance;

          updated.position = {
            x: Math.max(80, Math.min(bounds.width - 80, character.position.x + normalizedDx * speed)),
            y: Math.max(80, Math.min(bounds.height - 80, character.position.y + normalizedDy * speed))
          };
          updated.velocity = { x: normalizedDx * speed, y: normalizedDy * speed };
          updated.state = 'walking';

          // Footstep sounds
          if (updated.animationFrame % 30 === 0) {
            audioEngineRef.current?.playFootstep();
          }
        } else if (distance < 150 && character.state === 'walking') {
          updated.state = 'idle';
          updated.velocity = { x: 0, y: 0 };
        }

        // State transitions
        if (now - character.lastUpdate > 8000 && character.state === 'idle') {
          if (Math.random() < 0.3 && character.energyCharge > 50) {
            updated.state = Math.random() < 0.7 ? 'skill' : 'burst';
            updated.lastUpdate = now;

            // Play elemental sound
            audioEngineRef.current?.playElementalSound(character.element);

            // Create visual effect
            createVisualEffect(
              character.position, 
              updated.state === 'burst' ? 'burst_explosion' : 'skill_cast',
              character.colors.glow,
              2000
            );
          }
        }

        if ((character.state === 'skill' && now - character.lastUpdate > 2000) ||
            (character.state === 'burst' && now - character.lastUpdate > 3000)) {
          updated.state = 'idle';
          updated.lastUpdate = now;
        }

        return updated;
      });
    });
  }, [userPosition]);

  const generateCharacterBehavior = useCallback((now: number) => {
    if (Math.random() < 0.008) { // 0.8% chance per frame
      characters.forEach(character => {
        if (character.userAttention > 60 && character.state === 'idle') {
          // Generate contextual voice line
          const contextualLines = getContextualVoiceLines(character, location);
          const randomLine = contextualLines[Math.floor(Math.random() * contextualLines.length)];

          createVoiceLine(character.id, randomLine, 'interaction', 5000);
        }
      });
    }
  }, [characters, location]);

  const getContextualVoiceLines = (character: HoYoCharacter, currentLocation: string): string[] => {
    const locationLines = {
      '/': [
        'This portal resonates with incredible energy...',
        'I sense great potential in this nexus.',
        'The quantum field here is fascinating.'
      ],
      '/philosophy': [
        'The depth of thought here is remarkable.',
        'Philosophy and power often intertwine.',
        'Wisdom flows like elemental energy.'
      ],
      '/projects': [
        'These creations hold impressive power.',
        'I see the manifestation of dreams here.',
        'Innovation rivals the greatest magic.'
      ]
    };

    const defaultLines = character.voiceLines.slice(1); // Skip greeting
    return locationLines[currentLocation as keyof typeof locationLines] || defaultLines;
  };

  const createVoiceLine = useCallback((characterId: string, text: string, type: VoiceLine['type'], duration: number) => {
    const voiceLine: VoiceLine = {
      id: `voice-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      characterId,
      text,
      type,
      timestamp: Date.now(),
      duration
    };

    setVoiceLines(prev => [...prev, voiceLine]);

    // Trigger TTS
    const character = characters.find(c => c.id === characterId);
    if (character && voiceEngineRef.current) {
      voiceEngineRef.current.speak(text, character);

      // Update character state
      setCharacters(prev => prev.map(c => 
        c.id === characterId ? { 
          ...c, 
          state: 'talking', 
          lastUpdate: Date.now() 
        } : c
      ));

      // Reset to idle after speaking
      setTimeout(() => {
        setCharacters(prev => prev.map(c => 
          c.id === characterId ? { ...c, state: 'idle' } : c
        ));
      }, 3000);
    }
  }, [characters]);

  const createVisualEffect = useCallback((
    position: { x: number; y: number }, 
    type: VisualEffect['type'], 
    color: string, 
    duration: number
  ) => {
    const effect: VisualEffect = {
      id: `effect-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      position: { ...position },
      color,
      scale: 1,
      timestamp: Date.now(),
      duration
    };

    setVisualEffects(prev => [...prev, effect]);
  }, []);

  const updateVoiceLines = useCallback((now: number) => {
    setVoiceLines(prev => prev.filter(line => now - line.timestamp < line.duration));
  }, []);

  const updateVisualEffects = useCallback((now: number) => {
    setVisualEffects(prev => prev.filter(effect => now - effect.timestamp < effect.duration));
  }, []);

  const handleCharacterClick = useCallback((character: HoYoCharacter) => {
    if (character.energyCharge > 30) {
      // Trigger skill or burst
      const action = character.energyCharge > 80 ? 'burst' : 'skill';

      setCharacters(prev => prev.map(c => 
        c.id === character.id ? { 
          ...c, 
          state: action, 
          lastUpdate: Date.now() 
        } : c
      ));

      // Play elemental sound
      audioEngineRef.current?.playElementalSound(character.element);

      // Create visual effect
      createVisualEffect(
        character.position, 
        action === 'burst' ? 'burst_explosion' : 'skill_cast',
        character.colors.glow,
        action === 'burst' ? 3000 : 2000
      );

      // Voice line
      const actionLines = [
        'Witness my power!',
        `${character.element} energy flows through me!`,
        'Feel the strength of the elements!',
        'This is my true potential!'
      ];
      const line = actionLines[Math.floor(Math.random() * actionLines.length)];
      createVoiceLine(character.id, line, action === 'burst' ? 'burst' : 'skill', 4000);
    }
  }, [createVisualEffect, createVoiceLine]);

  // Initialize when container is ready
  useEffect(() => {
    if (containerRef.current && !isInitialized) {
      initializeCharacters();
    }
  }, [initializeCharacters, isInitialized]);

  // Start animation
  useEffect(() => {
    if (isInitialized) {
      startAnimationLoop();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [isInitialized, startAnimationLoop]);

  // Add more characters based on page
  useEffect(() => {
    if (!isInitialized) return;

    const pageCounts = {
      '/': 2,
      '/philosophy': 3,
      '/projects': 4,
      '/consciousness-map': 5,
      '/dashboard': 3
    };

    const targetCount = pageCounts[location as keyof typeof pageCounts] || 2;
    if (characters.length < targetCount) {
      const container = containerRef.current;
      if (!container) return;

      const bounds = container.getBoundingClientRect();
      const additionalCharacters: HoYoCharacter[] = [];

      for (let i = characters.length; i < targetCount; i++) {
        const template = HOYOVERSE_CHARACTERS[i % HOYOVERSE_CHARACTERS.length];
        additionalCharacters.push(createHoYoCharacter(template, i, bounds));
      }

      setCharacters(prev => [...prev, ...additionalCharacters]);
    }
  }, [location, characters.length, isInitialized]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-20 pointer-events-none overflow-hidden"
    >
      {/* HoYoverse Characters */}
      <AnimatePresence>
        {characters.map(character => (
          <motion.div
            key={character.id}
            className="absolute cursor-pointer pointer-events-auto"
            style={{
              left: character.position.x,
              top: character.position.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 25
            }}
            onClick={() => handleCharacterClick(character)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.3, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: -50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              duration: 0.6
            }}
          >
            <HoYoCharacterSprite character={character} size={160} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Voice Line Bubbles */}
      <AnimatePresence>
        {voiceLines.map(voiceLine => {
          const character = characters.find(c => c.id === voiceLine.characterId);
          if (!character) return null;

          return (
            <motion.div
              key={voiceLine.id}
              className="absolute pointer-events-none z-30"
              style={{
                left: character.position.x,
                top: character.position.y - 120,
                transform: 'translate(-50%, -100%)'
              }}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div 
                className="relative bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 
                           text-white text-sm px-6 py-4 rounded-2xl border-2 max-w-96 
                           backdrop-blur-md shadow-2xl"
                style={{ 
                  borderColor: character.colors.primary,
                  boxShadow: `0 0 30px ${character.colors.glow}60`,
                  background: `linear-gradient(135deg, ${character.colors.primary}20, ${character.colors.secondary}10, transparent)`
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full animate-pulse"
                    style={{ backgroundColor: character.colors.glow }}
                  />
                  <span 
                    className="font-bold text-sm"
                    style={{ color: character.colors.primary }}
                  >
                    {character.name}
                  </span>
                  <div className="flex">
                    {Array.from({length: character.rarity}, (_, i) => (
                      <span key={i} className="text-yellow-400 text-xs">★</span>
                    ))}
                  </div>
                </div>
                <div className="text-white/95 leading-relaxed font-medium">
                  {voiceLine.text}
                </div>

                {/* Speech bubble tail */}
                <div 
                  className="absolute top-full left-1/2 transform -translate-x-1/2
                             w-0 h-0 border-l-6 border-r-6 border-t-12
                             border-l-transparent border-r-transparent"
                  style={{ borderTopColor: character.colors.primary }}
                />

                {/* Animated border */}
                <div 
                  className="absolute inset-0 rounded-2xl animate-pulse"
                  style={{ 
                    background: `linear-gradient(45deg, ${character.colors.glow}40, transparent, ${character.colors.primary}40)`,
                    zIndex: -1
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Visual Effects */}
      <AnimatePresence>
        {visualEffects.map(effect => (
          <motion.div
            key={effect.id}
            className="absolute pointer-events-none z-25"
            style={{
              left: effect.position.x,
              top: effect.position.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ 
              scale: effect.type === 'burst_explosion' ? [0, 2.5, 1.5, 0] : [0, 1.8, 1.2, 0],
              opacity: [0, 1, 0.8, 0],
              rotate: effect.type === 'skill_cast' ? [0, 360] : [0, 180, 360]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: effect.type === 'burst_explosion' ? 2.5 : 1.8,
              ease: "easeOut"
            }}
          >
            <div 
              className="relative"
              style={{
                width: effect.type === 'burst_explosion' ? '120px' : '80px',
                height: effect.type === 'burst_explosion' ? '120px' : '80px',
                background: `radial-gradient(circle, ${effect.color}, ${effect.color}80, transparent)`,
                borderRadius: '50%',
                boxShadow: `0 0 ${effect.type === 'burst_explosion' ? '60px' : '40px'} ${effect.color}`
              }}
            >
              {/* Inner energy core */}
              <div 
                className="absolute inset-4 rounded-full animate-spin"
                style={{
                  background: `conic-gradient(${effect.color}, transparent, ${effect.color})`,
                  opacity: 0.8
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* System Status HUD */}
      <div className="absolute top-4 right-4 bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 
                      text-cyan-400 text-xs p-4 rounded-xl border-2 border-cyan-400/50 
                      backdrop-blur-md shadow-2xl font-mono pointer-events-auto">
        <div className="flex items-center gap-2 mb-3 text-yellow-400">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="font-bold">HOYOVERSE SYSTEM</span>
        </div>
        <div className="space-y-1">
          <div>CHARACTERS: {characters.length}</div>
          <div>ACTIVE VOICES: {voiceLines.length}</div>
          <div>VISUAL FX: {visualEffects.length}</div>
          <div>AUDIO ENGINE: {audioEngineRef.current ? 'ONLINE' : 'OFFLINE'}</div>
          <div>USER PROXIMITY: {characters.length > 0 ? Math.floor(characters.reduce((sum, c) => sum + c.userAttention, 0) / characters.length) : 0}%</div>
        </div>

        {/* Character status indicators */}
        <div className="mt-3 pt-2 border-t border-cyan-400/30">
          {characters.map((char, i) => (
            <div key={char.id} className="flex items-center gap-2 text-xs">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: char.colors.glow }}
              />
              <span className="truncate w-20">{char.name.split(' ')[0]}</span>
              <span className="text-gray-400">
                {char.state.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HoYoverseCharacterSystem;