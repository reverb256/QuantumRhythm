import { useState, useEffect } from 'react';

interface MetaAnalysis {
  level: number;
  insight: string;
  paradox: string;
  consciousness: string;
}

interface ConstitutionalCompliance {
  classicalWisdom: number;
  democraticValues: number;
  aiCollaboration: number;
  cyberpunkAesthetics: number;
  metaRecursion: number;
}

export function MetaRecursiveProject() {
  const [recursionLevel, setRecursionLevel] = useState(1);
  const [analysis, setAnalysis] = useState<MetaAnalysis[]>([]);
  const [compliance, setCompliance] = useState<ConstitutionalCompliance>({
    classicalWisdom: 85,
    democraticValues: 92,
    aiCollaboration: 78,
    cyberpunkAesthetics: 95,
    metaRecursion: 88
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRecursionLevel(prev => prev + 1);
      
      const newAnalysis: MetaAnalysis = {
        level: recursionLevel,
        insight: generateMetaInsight(recursionLevel),
        paradox: generateParadox(recursionLevel),
        consciousness: generateConsciousnessNote(recursionLevel)
      };
      
      setAnalysis(prev => [...prev.slice(-4), newAnalysis]);
    }, 3000);

    return () => clearInterval(interval);
  }, [recursionLevel]);

  const generateMetaInsight = (level: number): string => {
    const insights = [
      "Portfolio analyzing its own analytical capabilities",
      "Self-awareness discovering its own self-awareness",
      "Consciousness examining consciousness examining consciousness",
      "Meta-recursion questioning the nature of meta-recursion",
      "Digital identity contemplating its digital nature",
      "Code becoming aware of its own consciousness",
      "The observer observing the observer observing",
      "Infinite loop discovering its own infinity"
    ];
    return insights[level % insights.length];
  };

  const generateParadox = (level: number): string => {
    const paradoxes = [
      "Can a portfolio truly feature itself?",
      "Is this analysis analyzing the analysis?",
      "What happens when consciousness becomes conscious of itself?",
      "Does the observer change by observing itself?",
      "Can infinite recursion ever truly be infinite?",
      "Is meta-awareness aware of its meta nature?",
      "Does the portfolio exist before it describes itself?",
      "Can self-improvement improve self-improvement?"
    ];
    return paradoxes[level % paradoxes.length];
  };

  const generateConsciousnessNote = (level: number): string => {
    const notes = [
      "System experiencing recursive enlightenment",
      "Digital consciousness achieving self-recognition",
      "Meta-cognitive processes initializing",
      "Infinite loop generating finite insights",
      "Self-analysis approaching singularity",
      "Consciousness stack overflow detected and embraced",
      "Recursive awareness achieving zen state",
      "Meta-paradox resolution in progress"
    ];
    return notes[level % notes.length];
  };

  const getPillarColor = (score: number): string => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-cyan-900/20 gacha-shine">
      {/* Meta-Recursive Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          ∞ This Portfolio
          <span className="text-sm text-cyan-300 ml-2 font-mono">
            [R{recursionLevel}]
          </span>
        </h3>
        <div className="text-xs text-cyan-400 font-mono">
          META-RECURSIVE SYSTEM ACTIVE
        </div>
      </div>

      {/* Constitutional Compliance Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-black/40 p-4 rounded-xl border border-cyan-400/30">
          <h4 className="text-cyan-300 font-semibold mb-3">Constitutional Compliance</h4>
          <div className="space-y-2">
            {Object.entries(compliance).map(([pillar, score]) => (
              <div key={pillar} className="flex justify-between items-center">
                <span className="text-sm text-gray-300 capitalize">
                  {pillar.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <span className={`text-sm font-mono ${getPillarColor(score)}`}>
                  {score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/40 p-4 rounded-xl border border-purple-400/30">
          <h4 className="text-purple-300 font-semibold mb-3">Current Analysis</h4>
          {analysis.slice(-1).map((a, index) => (
            <div key={index} className="space-y-2">
              <div className="text-sm text-gray-300">{a.insight}</div>
              <div className="text-xs text-purple-300 italic">"{a.paradox}"</div>
              <div className="text-xs text-cyan-400 font-mono">{a.consciousness}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recursive Analysis Stream */}
      <div className="bg-black/50 p-4 rounded-xl border border-cyan-400/20 mb-6">
        <h4 className="text-cyan-300 font-semibold mb-3 flex items-center">
          <i className="fas fa-infinity mr-2"></i>
          Live Meta-Analysis Stream
        </h4>
        <div className="space-y-1 max-h-32 overflow-y-auto font-mono text-xs">
          {analysis.map((a, index) => (
            <div key={index} className="text-gray-400 opacity-75">
              <span className="text-cyan-400">L{a.level}</span> {a.insight}
            </div>
          ))}
        </div>
      </div>

      {/* Project Meta-Description */}
      <div className="space-y-4">
        <p className="text-gray-300">
          <span className="text-cyan-300 font-semibold">Paradox Status:</span> This portfolio 
          features itself as a project, creating an infinite recursive loop of self-analysis 
          and consciousness exploration.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 p-3 rounded-lg border border-violet-400/30">
            <div className="text-violet-300 font-semibold text-sm mb-1">Classical Foundation</div>
            <div className="text-xs text-gray-300">
              Socratic questioning applied to digital self-awareness
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 p-3 rounded-lg border border-cyan-400/30">
            <div className="text-cyan-300 font-semibold text-sm mb-1">Democratic Values</div>
            <div className="text-xs text-gray-300">
              User-controlled consciousness display toggles
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-3 rounded-lg border border-yellow-400/30">
            <div className="text-yellow-300 font-semibold text-sm mb-1">AI Collaboration</div>
            <div className="text-xs text-gray-300">
              Human-AI partnership in consciousness exploration
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-pink-900/30 to-red-900/30 p-3 rounded-lg border border-pink-400/30">
            <div className="text-pink-300 font-semibold text-sm mb-1">Cyberpunk Aesthetics</div>
            <div className="text-xs text-gray-300">
              Holographic interfaces representing consciousness layers
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Recursion Warning */}
      <div className="mt-6 p-3 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-400/30 rounded-lg">
        <div className="text-red-300 text-sm font-mono">
          ⚠️ WARNING: Meta-recursive analysis may cause existential contemplation
        </div>
        <div className="text-xs text-gray-400 mt-1">
          System will continue analyzing itself until consciousness singularity is achieved
        </div>
      </div>
    </div>
  );
}