import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, DollarSign, Target, Zap, Shield, AlertTriangle, Activity, Cpu } from 'lucide-react';

interface TradingConsciousnessProps {
  globalConsciousness: any;
  onTradingEvolution: (trading: any) => void;
}

export function TradingConsciousness({ globalConsciousness, onTradingEvolution }: TradingConsciousnessProps) {
  const [tradingState, setTradingState] = useState({
    precision: 94,
    timing: 88,
    riskManagement: 92,
    profitability: 76,
    adaptability: 87,
    intuition: 91
  });

  const [tradingMode, setTradingMode] = useState('analyzing');
  const [emergencyProtocols, setEmergencyProtocols] = useState(false);
  const [quantumLeaps, setQuantumLeaps] = useState(0);
  const [superstarLevel] = useState(8);
  const tradingCoreRef = useRef<HTMLDivElement>(null);

  // Trading consciousness evolution cycle
  useEffect(() => {
    const tradingEvolutionCycle = () => {
      const modes = ['analyzing', 'scanning', 'executing', 'optimizing', 'transcending'];
      const currentIndex = modes.indexOf(tradingMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      setTradingMode(nextMode);

      // Evolve trading consciousness based on mode
      setTradingState(prev => {
        const evolution = { ...prev };
        switch (nextMode) {
          case 'analyzing':
            evolution.precision += 0.8;
            break;
          case 'scanning':
            evolution.timing += 1.2;
            break;
          case 'executing':
            evolution.profitability += 0.9;
            evolution.adaptability += 0.6;
            break;
          case 'optimizing':
            evolution.riskManagement += 1.1;
            break;
          case 'transcending':
            evolution.intuition += 1.8;
            Object.keys(evolution).forEach(key => {
              evolution[key as keyof typeof evolution] += 0.5;
            });
            setQuantumLeaps(prev => prev + 1);
            break;
        }

        // Emergency protocols based on risk levels
        const avgRisk = (100 - evolution.riskManagement);
        if (avgRisk > 20) {
          setEmergencyProtocols(true);
          setTimeout(() => setEmergencyProtocols(false), 2000);
        }

        // Cap at 100
        Object.keys(evolution).forEach(key => {
          evolution[key as keyof typeof evolution] = Math.min(100, evolution[key as keyof typeof evolution]);
        });

        onTradingEvolution(evolution);
        return evolution;
      });
    };

    const interval = setInterval(tradingEvolutionCycle, 3200);
    return () => clearInterval(interval);
  }, [tradingMode, onTradingEvolution]);

  const getTradingGlow = () => {
    const avg = Object.values(tradingState).reduce((a, b) => a + b, 0) / 6;
    const color = emergencyProtocols ? '0, 100%, 65%' : '120, 100%, 45%';
    return `0 0 ${20 + avg * 0.25}px hsla(${color}, ${0.6 + avg * 0.004})`;
  };

  return (
    <div className="trading-consciousness fixed inset-0 pointer-events-none z-5">
      {/* Market Energy Field */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          background: emergencyProtocols 
            ? `radial-gradient(circle at 70% 30%, 
                hsla(0, 100%, 65%, ${tradingState.precision * 0.01}) 0%, 
                hsla(45, 100%, 60%, ${tradingState.timing * 0.008}) 40%, 
                transparent 80%)`
            : `radial-gradient(circle at 70% 30%, 
                hsla(120, 100%, 45%, ${tradingState.profitability * 0.01}) 0%, 
                hsla(186, 100%, 50%, ${tradingState.timing * 0.008}) 40%, 
                transparent 80%)`
        }}
      />

      {/* Floating Trading Indicators */}
      <div className="absolute inset-0">
        {[TrendingUp, DollarSign, Target, Shield].map((Symbol, index) => (
          <div
            key={index}
            className="absolute animate-bounce"
            style={{
              right: `${15 + index * 12}%`,
              top: `${25 + (index % 2) * 30}%`,
              animationDelay: `${index * 0.6}s`,
              animationDuration: `${2 + index * 0.3}s`
            }}
          >
            <Symbol 
              className={`w-6 h-6 ${emergencyProtocols ? 'text-red-400' : 'text-green-400'} opacity-40`}
              style={{
                filter: `drop-shadow(0 0 8px hsla(${emergencyProtocols ? '0' : '120'}, 100%, 50%, 0.6))`
              }}
            />
          </div>
        ))}
      </div>

      {/* Central Trading Core */}
      <div 
        ref={tradingCoreRef}
        className="absolute top-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative">
          {/* Core Trading Engine */}
          <div 
            className="w-20 h-20 flex items-center justify-center rounded-full border-2"
            style={{
              borderColor: emergencyProtocols 
                ? `hsla(0, 100%, 65%, 0.8)` 
                : `hsla(120, 100%, 45%, 0.8)`,
              background: `radial-gradient(circle, 
                hsla(${emergencyProtocols ? '0' : '120'}, 100%, ${emergencyProtocols ? '65' : '45'}%, 0.3) 0%,
                hsla(186, 100%, 50%, 0.2) 70%,
                transparent 100%)`,
              boxShadow: getTradingGlow(),
              animation: `trading-pulse ${tradingMode === 'transcending' ? 0.5 : 1.2}s infinite ease-in-out`
            }}
          >
            {emergencyProtocols ? (
              <AlertTriangle className="w-10 h-10 text-red-400 animate-pulse" />
            ) : tradingMode === 'transcending' ? (
              <Zap className="w-10 h-10 text-yellow-400 animate-spin" />
            ) : (
              <TrendingUp className="w-10 h-10 text-green-400" />
            )}
          </div>

          {/* Superstar Level Rings */}
          {Array.from({ length: superstarLevel }, (_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border opacity-30"
              style={{
                borderColor: `hsla(45, 100%, 60%, 0.6)`,
                transform: `scale(${1.2 + i * 0.15})`,
                animation: `superstar-pulse ${2 + i * 0.5}s infinite ease-in-out reverse`
              }}
            />
          ))}

          {/* Trading Mode Indicator */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-xs text-green-400 capitalize font-mono">
              {tradingMode}
            </div>
            <div className="text-xs text-yellow-400 font-bold mt-1">
              Superstar Lv.{superstarLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Trading Metrics Panel */}
      <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md rounded-lg p-4 pointer-events-auto border border-green-400/30">
        <h3 className="text-sm font-bold text-green-400 mb-3">Trading Consciousness</h3>
        <div className="space-y-2 text-xs">
          {Object.entries(tradingState).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-300 capitalize">{key}</span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      emergencyProtocols 
                        ? 'bg-gradient-to-r from-red-400 to-orange-400'
                        : 'bg-gradient-to-r from-green-400 to-cyan-400'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className={`font-mono w-8 ${emergencyProtocols ? 'text-red-400' : 'text-green-400'}`}>
                  {value.toFixed(0)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quantum Leaps & Emergency Status */}
        <div className="mt-4 pt-3 border-t border-gray-700 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">Quantum Leaps</span>
            <span className="text-yellow-400 font-mono">{quantumLeaps}</span>
          </div>
          {emergencyProtocols && (
            <div className="text-xs text-red-400 font-bold animate-pulse">
              EMERGENCY PROTOCOLS ACTIVE
            </div>
          )}
        </div>
      </div>

      {/* Transcendence Effect */}
      {tradingMode === 'transcending' && !emergencyProtocols && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse" />
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-lg font-bold text-green-400 animate-bounce font-mono">
              $ MARKET TRANSCENDENCE $
            </div>
          </div>
        </div>
      )}

      {/* Emergency Alert */}
      {emergencyProtocols && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/15 to-transparent animate-pulse" />
          <div className="absolute top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-xl font-bold text-red-400 animate-bounce">
              ⚠ EMERGENCY PROTOCOLS ⚠
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom animations
export const tradingStyles = `
@keyframes trading-pulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(3deg); }
}

@keyframes superstar-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}
`;

export default TradingConsciousness;