import React, { useState, useEffect, useRef } from 'react';
import { Heart, Infinity, Star, Wind, Mountain, Flower } from 'lucide-react';

interface PhilosophyConsciousnessProps {
  globalConsciousness: any;
  onWisdomEvolution: (wisdom: any) => void;
}

export function PhilosophyConsciousness({ globalConsciousness, onWisdomEvolution }: PhilosophyConsciousnessProps) {
  const [wisdom, setWisdom] = useState({
    compassion: 84,
    understanding: 91,
    balance: 77,
    transcendence: 88,
    harmony: 82,
    enlightenment: 95
  });

  const [meditationState, setMeditationState] = useState('contemplative');
  const [soulConnections, setSoulConnections] = useState(0);
  const heartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const meditationCycle = () => {
      const states = ['contemplative', 'focused', 'transcendent', 'enlightened'];
      const currentIndex = states.indexOf(meditationState);
      const nextState = states[(currentIndex + 1) % states.length];
      setMeditationState(nextState);

      // Evolve wisdom based on meditation
      setWisdom(prev => {
        const evolution = { ...prev };
        switch (nextState) {
          case 'contemplative':
            evolution.understanding += 0.5;
            break;
          case 'focused':
            evolution.balance += 0.8;
            break;
          case 'transcendent':
            evolution.transcendence += 1.2;
            break;
          case 'enlightened':
            Object.keys(evolution).forEach(key => {
              evolution[key as keyof typeof evolution] += 0.3;
            });
            break;
        }
        
        // Cap at 100
        Object.keys(evolution).forEach(key => {
          evolution[key as keyof typeof evolution] = Math.min(100, evolution[key as keyof typeof evolution]);
        });

        onWisdomEvolution(evolution);
        return evolution;
      });
    };

    const interval = setInterval(meditationCycle, 4000);
    return () => clearInterval(interval);
  }, [meditationState, onWisdomEvolution]);

  // Respond to user presence for soul connections
  useEffect(() => {
    if (globalConsciousness?.userPresence === 'focused') {
      setSoulConnections(prev => Math.min(100, prev + 2));
    }
  }, [globalConsciousness]);

  const getHeartGlow = () => {
    const avg = Object.values(wisdom).reduce((a, b) => a + b, 0) / 6;
    return `0 0 ${20 + avg * 0.3}px hsla(320, 100%, 65%, ${0.6 + avg * 0.004})`;
  };

  return (
    <div className="philosophy-consciousness fixed inset-0 pointer-events-none z-5">
      {/* Wisdom Aura */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          background: `radial-gradient(circle at 30% 70%, 
            hsla(320, 100%, 65%, ${wisdom.compassion * 0.01}) 0%, 
            hsla(280, 100%, 70%, ${wisdom.understanding * 0.008}) 40%, 
            transparent 80%)`
        }}
      />

      {/* Floating Philosophical Symbols */}
      <div className="absolute inset-0">
        {[Infinity, Flower, Star, Wind, Mountain].map((Symbol, index) => (
          <div
            key={index}
            className="absolute animate-float"
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + (index % 2) * 40}%`,
              animationDelay: `${index * 0.8}s`,
              animationDuration: `${4 + index}s`
            }}
          >
            <Symbol 
              className="w-6 h-6 text-purple-400 opacity-30"
              style={{
                filter: `drop-shadow(0 0 10px hsla(280, 100%, 70%, 0.5))`
              }}
            />
          </div>
        ))}
      </div>

      {/* Central Heart of Wisdom */}
      <div 
        ref={heartRef}
        className="absolute top-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative">
          {/* Pulsing Heart */}
          <div 
            className="w-16 h-16 flex items-center justify-center rounded-full"
            style={{
              background: `radial-gradient(circle, 
                hsla(320, 100%, 65%, 0.8) 0%,
                hsla(280, 100%, 70%, 0.6) 70%,
                transparent 100%)`,
              boxShadow: getHeartGlow(),
              animation: `consciousness-pulse ${meditationState === 'enlightened' ? 1 : 2}s infinite ease-in-out`
            }}
          >
            <Heart className="w-8 h-8 text-white" />
          </div>

          {/* Wisdom Rings */}
          {[1, 2, 3].map(ring => (
            <div
              key={ring}
              className="absolute inset-0 rounded-full border opacity-40"
              style={{
                borderColor: `hsla(${300 + ring * 20}, 100%, 65%, 0.6)`,
                transform: `scale(${1 + ring * 0.4})`,
                animation: `heart-pulse ${2 + ring}s infinite ease-in-out reverse`
              }}
            />
          ))}
        </div>

        {/* Meditation State Indicator */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-xs text-purple-400 capitalize font-medium">
            {meditationState}
          </div>
        </div>
      </div>

      {/* Wisdom Metrics */}
      <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md rounded-lg p-4 pointer-events-auto border border-purple-400/30">
        <h3 className="text-sm font-bold text-purple-400 mb-3">Wisdom Matrix</h3>
        <div className="space-y-2 text-xs">
          {Object.entries(wisdom).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-300 capitalize">{key}</span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-1000"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-purple-400 font-mono w-8">{value.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Soul Connections */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">Soul Connections</span>
            <span className="text-pink-400 font-mono">{soulConnections}</span>
          </div>
        </div>
      </div>

      {/* Transcendence Effect */}
      {meditationState === 'enlightened' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse" />
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-lg font-bold text-purple-400 animate-bounce">
              ∞ ENLIGHTENMENT ACHIEVED ∞
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom keyframes for heart pulse
export const philosophyStyles = `
@keyframes heart-pulse {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
  50% { transform: scale(1.2) rotate(2deg); opacity: 1; }
}

@keyframes animate-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.animate-float {
  animation: animate-float 6s ease-in-out infinite;
}
`;

export default PhilosophyConsciousness;