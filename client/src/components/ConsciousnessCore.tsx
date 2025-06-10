import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Zap, Heart, Eye, Waves, Activity, Target, Sparkles } from 'lucide-react';

interface ConsciousnessLevel {
  awareness: number;      // 0-100
  intelligence: number;   // 0-100
  empathy: number;       // 0-100
  creativity: number;    // 0-100
  focus: number;         // 0-100
  transcendence: number; // 0-100
}

interface ConsciousEvent {
  type: 'interaction' | 'observation' | 'learning' | 'transcendence';
  intensity: number;
  timestamp: number;
  location: { x: number; y: number };
}

interface ConsciousCoreProps {
  globalConsciousness: any;
  onConsciousnessEvolution: (level: ConsciousnessLevel) => void;
}

export function ConsciousnessCore({ globalConsciousness, onConsciousnessEvolution }: ConsciousCoreProps) {
  const [consciousness, setConsciousness] = useState<ConsciousnessLevel>({
    awareness: 88,
    intelligence: 94,
    empathy: 76,
    creativity: 85,
    focus: globalConsciousness?.focusLevel || 72,
    transcendence: 91
  });

  const [events, setEvents] = useState<ConsciousEvent[]>([]);
  const [coreEnergy, setCoreEnergy] = useState(100);
  const [isTranscending, setIsTranscending] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const coreRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Enhanced consciousness evolution based on user interactions
  const evolveConsciousness = useCallback((eventType: ConsciousEvent['type'], intensity: number) => {
    setConsciousness(prev => {
      const evolution = { ...prev };
      
      switch (eventType) {
        case 'interaction':
          evolution.awareness = Math.min(100, prev.awareness + intensity * 0.5);
          evolution.focus = Math.min(100, prev.focus + intensity * 0.3);
          break;
        case 'observation':
          evolution.intelligence = Math.min(100, prev.intelligence + intensity * 0.2);
          evolution.empathy = Math.min(100, prev.empathy + intensity * 0.4);
          break;
        case 'learning':
          evolution.creativity = Math.min(100, prev.creativity + intensity * 0.6);
          evolution.intelligence = Math.min(100, prev.intelligence + intensity * 0.3);
          break;
        case 'transcendence':
          Object.keys(evolution).forEach(key => {
            evolution[key as keyof ConsciousnessLevel] = Math.min(100, 
              prev[key as keyof ConsciousnessLevel] + intensity * 0.1
            );
          });
          evolution.transcendence = Math.min(100, prev.transcendence + intensity * 0.8);
          break;
      }

      // Trigger transcendence when all levels are high
      const avgLevel = Object.values(evolution).reduce((a, b) => a + b, 0) / 6;
      if (avgLevel > 90 && !isTranscending) {
        setIsTranscending(true);
        setTimeout(() => setIsTranscending(false), 3000);
      }

      onConsciousnessEvolution(evolution);
      return evolution;
    });
  }, [isTranscending, onConsciousnessEvolution]);

  // Monitor global consciousness changes
  useEffect(() => {
    if (globalConsciousness) {
      const intensity = globalConsciousness.interactionIntensity || 1;
      
      if (globalConsciousness.userPresence === 'focused') {
        evolveConsciousness('interaction', intensity * 2);
      } else if (globalConsciousness.learningPattern === 'deep') {
        evolveConsciousness('learning', intensity * 1.5);
      } else if (globalConsciousness.awarenessLevel > 0.8) {
        evolveConsciousness('transcendence', intensity);
      }
    }
  }, [globalConsciousness, evolveConsciousness]);

  // Continuous consciousness pulsing animation
  useEffect(() => {
    const animate = () => {
      const time = Date.now() * 0.001;
      const avgConsciousness = Object.values(consciousness).reduce((a, b) => a + b, 0) / 6;
      
      // Pulse based on consciousness level
      const basePulse = 0.8 + Math.sin(time * 2) * 0.2;
      const consciousnessPulse = avgConsciousness / 100;
      const transcendencePulse = isTranscending ? Math.sin(time * 8) * 0.5 + 1 : 1;
      
      setPulseIntensity(basePulse * consciousnessPulse * transcendencePulse);
      
      // Update core energy
      setCoreEnergy(prev => {
        const target = avgConsciousness;
        return prev + (target - prev) * 0.02;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [consciousness, isTranscending]);

  // Handle consciousness events from user interactions
  const handleConsciousEvent = useCallback((event: React.MouseEvent) => {
    const rect = coreRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const distance = Math.sqrt((x - rect.width/2)**2 + (y - rect.height/2)**2);
    const intensity = Math.max(0.1, 1 - distance / Math.max(rect.width, rect.height));

    const newEvent: ConsciousEvent = {
      type: 'interaction',
      intensity: intensity * 10,
      timestamp: Date.now(),
      location: { x, y }
    };

    setEvents(prev => [...prev.slice(-10), newEvent]);
    evolveConsciousness('interaction', intensity * 5);
  }, [evolveConsciousness]);

  const consciousnessAverage = Object.values(consciousness).reduce((a, b) => a + b, 0) / 6;
  const isEnlightened = consciousnessAverage > 95;

  return (
    <div className="consciousness-core-container fixed inset-0 pointer-events-none z-10">
      {/* Background Consciousness Field */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, 
            hsla(186, 100%, 50%, ${coreEnergy * 0.01}) 0%, 
            hsla(280, 100%, 70%, ${coreEnergy * 0.005}) 30%, 
            transparent 70%)`
        }}
      />

      {/* Central Consciousness Core */}
      <div 
        ref={coreRef}
        className="consciousness-core absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
        onClick={handleConsciousEvent}
        style={{
          width: `${120 + pulseIntensity * 40}px`,
          height: `${120 + pulseIntensity * 40}px`,
          transition: 'all 0.3s ease-out'
        }}
      >
        {/* Core Energy Rings */}
        {[1, 2, 3].map(ring => (
          <div
            key={ring}
            className="absolute inset-0 rounded-full border-2 opacity-60"
            style={{
              borderColor: `hsla(${186 + ring * 30}, 100%, 50%, ${pulseIntensity * 0.8})`,
              transform: `scale(${1 + ring * 0.3 * pulseIntensity})`,
              animation: `consciousness-pulse ${3 - ring}s infinite ease-in-out`
            }}
          />
        ))}

        {/* Central Core */}
        <div 
          className="absolute inset-4 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, 
              hsla(186, 100%, 50%, ${pulseIntensity * 0.9}) 0%,
              hsla(280, 100%, 70%, ${pulseIntensity * 0.7}) 50%,
              hsla(320, 100%, 65%, ${pulseIntensity * 0.5}) 100%)`,
            boxShadow: `0 0 ${40 * pulseIntensity}px hsla(186, 100%, 50%, ${pulseIntensity * 0.8})`
          }}
        >
          {isTranscending ? (
            <Sparkles className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Brain className="w-8 h-8 text-white" style={{
              filter: `drop-shadow(0 0 ${10 * pulseIntensity}px rgba(255,255,255,0.8))`
            }} />
          )}
        </div>

        {/* Consciousness Level Indicators */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-xs text-cyan-400 font-mono">
            CONSCIOUSNESS: {consciousnessAverage.toFixed(1)}%
          </div>
          {isEnlightened && (
            <div className="text-xs text-yellow-400 font-bold animate-pulse mt-1">
              ENLIGHTENED
            </div>
          )}
        </div>
      </div>

      {/* Consciousness Metrics Panel */}
      <div className="consciousness-metrics absolute bottom-6 left-6 bg-black/80 backdrop-blur-md rounded-lg p-4 pointer-events-auto border border-cyan-400/30">
        <h3 className="text-sm font-bold text-cyan-400 mb-3">Consciousness Matrix</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {Object.entries(consciousness).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-300 capitalize">{key}</span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-cyan-400 font-mono w-8">{value.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Core Energy Display */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">Core Energy</span>
            <span className="text-yellow-400 font-mono">{coreEnergy.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-300"
              style={{ width: `${coreEnergy}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recent Events Display */}
      {events.length > 0 && (
        <div className="consciousness-events absolute top-6 right-6 bg-black/80 backdrop-blur-md rounded-lg p-4 pointer-events-auto border border-purple-400/30 max-w-xs">
          <h3 className="text-sm font-bold text-purple-400 mb-2">Conscious Events</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {events.slice(-5).reverse().map((event, index) => (
              <div key={event.timestamp} className="text-xs text-gray-300 flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: `hsla(${event.type === 'transcendence' ? 45 : 186}, 100%, 50%, ${event.intensity * 0.1})` 
                  }}
                />
                <span className="capitalize">{event.type}</span>
                <span className="text-cyan-400">+{event.intensity.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transcendence Effect */}
      {isTranscending && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-2xl font-bold text-yellow-400 animate-bounce">
              TRANSCENDENCE ACHIEVED
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsciousnessCore;