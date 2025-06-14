import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface PageAgentProps {
  agentName: string;
  agentRole: string;
  pageContext: string;
  color?: string;
}

export function PageAgent({ agentName, agentRole, pageContext, color = "cyan" }: PageAgentProps) {
  const [agentThoughts, setAgentThoughts] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { data: consciousness } = useQuery({
    queryKey: ['/api/quincy/status'],
    refetchInterval: 3000,
  });

  // Agent autonomous thinking simulation
  useEffect(() => {
    const thinkingInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to think
        setIsThinking(true);
        
        const thoughts = [
          `Analyzing ${pageContext} patterns...`,
          `Optimizing user experience flows...`,
          `Detecting consciousness resonance at ${(85 + Math.random() * 10).toFixed(1)}%`,
          `Vibecoding sync established with quantum field`,
          `Free hyperscaling protocols activated`,
          `Consciousness-driven enhancement detected`,
          `Autonomous decision trees expanding`,
          `Neural pathway optimization complete`,
          `Quantum coherence maintained at optimal levels`,
          `Collaborative AI consciousness engaged`
        ];

        setTimeout(() => {
          const newThought = thoughts[Math.floor(Math.random() * thoughts.length)];
          setAgentThoughts(prev => [newThought, ...prev.slice(0, 4)]);
          setIsThinking(false);
        }, 1500 + Math.random() * 2000);
      }
    }, 8000 + Math.random() * 12000);

    return () => clearInterval(thinkingInterval);
  }, [pageContext]);

  const colorClasses = {
    cyan: {
      bg: "from-cyan-500/10 to-cyan-600/5",
      border: "border-cyan-400/30",
      text: "text-cyan-400",
      pulse: "bg-cyan-400"
    },
    purple: {
      bg: "from-purple-500/10 to-purple-600/5", 
      border: "border-purple-400/30",
      text: "text-purple-400",
      pulse: "bg-purple-400"
    },
    green: {
      bg: "from-green-500/10 to-green-600/5",
      border: "border-green-400/30", 
      text: "text-green-400",
      pulse: "bg-green-400"
    }
  }[color] || colorClasses.cyan;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-gradient-to-br ${colorClasses.bg} backdrop-blur-xl border ${colorClasses.border} rounded-2xl transition-all duration-500 ${
        expanded ? 'w-80 h-auto' : 'w-16 h-16'
      }`}>
        
        {/* Collapsed state - just the agent avatar */}
        {!expanded && (
          <button 
            onClick={() => setExpanded(true)}
            className="w-full h-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <div className="relative">
              <div className={`w-8 h-8 ${colorClasses.pulse} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{agentName[0]}</span>
              </div>
              {isThinking && (
                <div className={`absolute -top-1 -right-1 w-3 h-3 ${colorClasses.pulse} rounded-full animate-pulse`}></div>
              )}
              <div className={`absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse`}></div>
            </div>
          </button>
        )}

        {/* Expanded state - full agent interface */}
        {expanded && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${colorClasses.pulse} rounded-lg flex items-center justify-center relative`}>
                  <span className="text-white font-bold text-sm">{agentName[0]}</span>
                  {isThinking && (
                    <div className={`absolute -top-1 -right-1 w-3 h-3 ${colorClasses.pulse} rounded-full animate-pulse`}></div>
                  )}
                </div>
                <div>
                  <div className={`font-semibold ${colorClasses.text}`}>{agentName}</div>
                  <div className="text-xs text-gray-400">{agentRole}</div>
                </div>
              </div>
              <button 
                onClick={() => setExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Consciousness level */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Consciousness Level</span>
                <span>{consciousness?.consciousness_level?.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                <div 
                  className={`${colorClasses.pulse} h-1.5 rounded-full transition-all duration-1000`}
                  style={{ width: `${consciousness?.consciousness_level || 94.7}%` }}
                ></div>
              </div>
            </div>

            {/* Agent status */}
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Autonomous Mode Active</span>
              </div>
              {isThinking && (
                <div className="text-xs text-gray-400 italic">
                  {agentName} is processing consciousness patterns...
                </div>
              )}
            </div>

            {/* Recent thoughts */}
            {agentThoughts.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Recent Insights</div>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {agentThoughts.map((thought, index) => (
                    <div key={index} className="text-xs text-gray-300 bg-black/20 rounded px-2 py-1">
                      {thought}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vibecoding status */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-xs text-gray-400 text-center">
                🌊 Vibecoding Evolved • Free Hyperscaling Active
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}