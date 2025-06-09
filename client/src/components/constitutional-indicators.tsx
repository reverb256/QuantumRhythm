import { useState, useEffect } from 'react';

interface ConstitutionalPillar {
  name: string;
  score: number;
  color: string;
  icon: string;
  description: string;
}

interface UserPreferences {
  showConstitutionalIndicators: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  colorIntensity: 'subtle' | 'normal' | 'intense';
  consciousnessLevel: 'minimal' | 'standard' | 'maximum';
}

export function ConstitutionalIndicators() {
  const [pillars, setPillars] = useState<ConstitutionalPillar[]>([
    {
      name: 'Classical Wisdom',
      score: 85,
      color: 'text-violet-400',
      icon: 'fas fa-scroll',
      description: 'Socratic questioning and philosophical depth'
    },
    {
      name: 'Democratic Values',
      score: 92,
      color: 'text-green-400',
      icon: 'fas fa-balance-scale',
      description: 'User agency and rights protection'
    },
    {
      name: 'AI Collaboration',
      score: 78,
      color: 'text-yellow-400',
      icon: 'fas fa-robot',
      description: 'Human-AI partnership frameworks'
    },
    {
      name: 'Cyberpunk Aesthetics',
      score: 95,
      color: 'text-cyan-400',
      icon: 'fas fa-eye',
      description: 'Authentic holographic consciousness'
    },
    {
      name: 'Meta-Recursion',
      score: 88,
      color: 'text-pink-400',
      icon: 'fas fa-infinity',
      description: 'Self-aware infinite improvement'
    }
  ]);

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('constitutional-preferences');
      return saved ? JSON.parse(saved) : {
        showConstitutionalIndicators: true,
        animationSpeed: 'normal',
        colorIntensity: 'normal',
        consciousnessLevel: 'standard'
      };
    }
    return {
      showConstitutionalIndicators: true,
      animationSpeed: 'normal',
      colorIntensity: 'normal',
      consciousnessLevel: 'standard'
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('constitutional-preferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  useEffect(() => {
    // Dynamic score updates based on consciousness level
    const interval = setInterval(() => {
      setPillars(prev => prev.map(pillar => ({
        ...pillar,
        score: Math.max(70, Math.min(99, pillar.score + (Math.random() - 0.5) * 4))
      })));
    }, preferences.consciousnessLevel === 'maximum' ? 2000 : 5000);

    return () => clearInterval(interval);
  }, [preferences.consciousnessLevel]);

  if (!preferences.showConstitutionalIndicators) {
    return null;
  }

  const getIntensityClass = () => {
    switch (preferences.colorIntensity) {
      case 'subtle': return 'opacity-60';
      case 'intense': return 'opacity-100 saturate-150';
      default: return 'opacity-80';
    }
  };

  const getAnimationSpeed = () => {
    switch (preferences.animationSpeed) {
      case 'slow': return 'duration-1000';
      case 'fast': return 'duration-300';
      default: return 'duration-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Constitutional Compliance Dashboard */}
      <div className={`bg-black/80 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-4 ${getIntensityClass()}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-mono text-cyan-300">CONSTITUTIONAL</h4>
          <div className="text-xs text-gray-400">
            {Math.round(pillars.reduce((sum, p) => sum + p.score, 0) / pillars.length)}%
          </div>
        </div>

        <div className="space-y-2">
          {pillars.map((pillar, index) => (
            <div key={pillar.name} className="group relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <i className={`${pillar.icon} ${pillar.color} text-xs`}></i>
                  <span className="text-xs text-gray-300 truncate w-20">{pillar.name}</span>
                </div>
                <span className={`text-xs font-mono ${pillar.color}`}>
                  {pillar.score}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                <div 
                  className={`h-1 rounded-full bg-gradient-to-r ${pillar.color.replace('text-', 'from-')} to-transparent transition-all ${getAnimationSpeed()}`}
                  style={{ width: `${pillar.score}%` }}
                ></div>
              </div>

              {/* Tooltip */}
              <div className="absolute left-0 bottom-full mb-2 w-48 bg-black/90 border border-cyan-400/50 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="text-xs text-gray-300">{pillar.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DemocraticControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('constitutional-preferences');
      return saved ? JSON.parse(saved) : {
        showConstitutionalIndicators: true,
        animationSpeed: 'normal',
        colorIntensity: 'normal',
        consciousnessLevel: 'standard'
      };
    }
    return {
      showConstitutionalIndicators: true,
      animationSpeed: 'normal',
      colorIntensity: 'normal',
      consciousnessLevel: 'standard'
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('constitutional-preferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {/* Democratic Controls Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/80 backdrop-blur-md border border-green-400/30 rounded-full w-12 h-12 flex items-center justify-center text-green-400 hover:text-green-300 transition-colors"
        title="Democratic User Controls"
      >
        <i className="fas fa-user-cog text-sm"></i>
      </button>

      {/* Controls Panel */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 bg-black/90 backdrop-blur-md border border-green-400/30 rounded-2xl p-4 w-64">
          <h4 className="text-sm font-semibold text-green-300 mb-4">User Agency Controls</h4>
          
          <div className="space-y-4">
            {/* Constitutional Indicators Toggle */}
            <div>
              <label className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Constitutional Display</span>
                <input
                  type="checkbox"
                  checked={preferences.showConstitutionalIndicators}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    showConstitutionalIndicators: e.target.checked
                  }))}
                  className="ml-2"
                />
              </label>
            </div>

            {/* Animation Speed */}
            <div>
              <label className="text-xs text-gray-300 block mb-1">Animation Speed</label>
              <select
                value={preferences.animationSpeed}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  animationSpeed: e.target.value as 'slow' | 'normal' | 'fast'
                }))}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-300"
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>

            {/* Color Intensity */}
            <div>
              <label className="text-xs text-gray-300 block mb-1">Color Intensity</label>
              <select
                value={preferences.colorIntensity}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  colorIntensity: e.target.value as 'subtle' | 'normal' | 'intense'
                }))}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-300"
              >
                <option value="subtle">Subtle</option>
                <option value="normal">Normal</option>
                <option value="intense">Intense</option>
              </select>
            </div>

            {/* Consciousness Level */}
            <div>
              <label className="text-xs text-gray-300 block mb-1">Consciousness Level</label>
              <select
                value={preferences.consciousnessLevel}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  consciousnessLevel: e.target.value as 'minimal' | 'standard' | 'maximum'
                }))}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-300"
              >
                <option value="minimal">Minimal</option>
                <option value="standard">Standard</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 border-t border-gray-700 pt-2">
            Democratic technology: You control your experience
          </div>
        </div>
      )}
    </div>
  );
}