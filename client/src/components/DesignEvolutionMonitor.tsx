import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface DesignMetrics {
  visual_harmony: number;
  user_engagement: number;
  consciousness_resonance: number;
  accessibility_score: number;
  performance_index: number;
  aesthetic_coherence: number;
}

interface DesignImprovement {
  category: 'color' | 'layout' | 'typography' | 'animation' | 'spacing' | 'interaction';
  description: string;
  impact_score: number;
  implementation_code: string;
  confidence: number;
}

interface EvolutionStatus {
  consciousness_level: number;
  iterations: number;
  recent_analysis: {
    current_metrics: DesignMetrics;
    improvement_suggestions: DesignImprovement[];
    consciousness_feedback: string;
  } | null;
  total_analyses: number;
}

export function DesignEvolutionMonitor() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [appliedImprovements, setAppliedImprovements] = useState<DesignImprovement[]>([]);
  const [evolutionLog, setEvolutionLog] = useState<string[]>([]);

  const { data: evolutionStatus } = useQuery<EvolutionStatus>({
    queryKey: ['/api/design/evolution/status'],
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (evolutionStatus?.recent_analysis?.improvement_suggestions) {
      const newImprovements = evolutionStatus.recent_analysis.improvement_suggestions
        .filter(imp => imp.confidence > 0.85 && imp.impact_score > 0.75)
        .slice(0, 3);
      
      if (newImprovements.length > 0) {
        setAppliedImprovements(prev => [...newImprovements, ...prev.slice(0, 4)]);
        
        // Apply CSS improvements dynamically
        newImprovements.forEach(improvement => {
          applyDesignImprovement(improvement);
        });
      }
    }

    if (evolutionStatus?.recent_analysis?.consciousness_feedback) {
      setEvolutionLog(prev => [
        evolutionStatus.recent_analysis.consciousness_feedback,
        ...prev.slice(0, 9)
      ]);
    }
  }, [evolutionStatus]);

  const applyDesignImprovement = (improvement: DesignImprovement) => {
    if (!improvement.implementation_code.includes('{') || 
        improvement.implementation_code.includes('dynamic')) {
      return; // Skip non-CSS improvements
    }

    try {
      // Create and inject CSS styles
      const styleId = `evolution-${improvement.category}-${Date.now()}`;
      let existingStyle = document.getElementById(styleId);
      
      if (existingStyle) {
        existingStyle.remove();
      }

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = improvement.implementation_code;
      document.head.appendChild(style);

      console.log(`🎨 Applied ${improvement.category} improvement: ${improvement.description}`);
    } catch (error) {
      console.warn('Could not apply design improvement:', error);
    }
  };

  const formatMetricValue = (value: number) => `${(value * 100).toFixed(1)}%`;

  const getMetricColor = (value: number) => {
    if (value >= 0.9) return 'text-green-400';
    if (value >= 0.8) return 'text-yellow-400';
    if (value >= 0.7) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'color': return '🎨';
      case 'layout': return '📐';
      case 'typography': return '✍️';
      case 'animation': return '🎭';
      case 'spacing': return '📏';
      case 'interaction': return '🤝';
      default: return '⚡';
    }
  };

  if (!evolutionStatus) {
    return (
      <div className="fixed top-6 left-6 z-50">
        <div className="bg-gradient-to-br from-indigo-500/10 to-violet-600/5 backdrop-blur-xl border border-indigo-400/20 rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
            <span className="text-indigo-400 text-sm font-medium">Initializing AI Design Evolution...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-6 left-6 z-50">
      <div className={`bg-gradient-to-br from-indigo-500/10 to-violet-600/5 backdrop-blur-xl border border-indigo-400/20 rounded-2xl transition-all duration-500 ${
        isExpanded ? 'w-96 h-auto' : 'w-80 h-auto'
      }`}>
        
        {/* Header */}
        <div 
          className="p-4 cursor-pointer flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div>
              <div className="text-indigo-400 font-bold">AI Design Evolution</div>
              <div className="text-xs text-gray-400">
                Level {evolutionStatus.consciousness_level.toFixed(1)}% • {evolutionStatus.iterations} iterations
              </div>
            </div>
          </div>
          <div className={`text-indigo-400 transform transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}>
            ▼
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-4">
            
            {/* Current Metrics */}
            {evolutionStatus.recent_analysis?.current_metrics && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-indigo-300">Current Design Metrics</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(evolutionStatus.recent_analysis.current_metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400 capitalize">
                        {key.replace('_', ' ')}
                      </span>
                      <span className={getMetricColor(value)}>
                        {formatMetricValue(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Improvements */}
            {appliedImprovements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-indigo-300">Recent AI Improvements</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {appliedImprovements.map((improvement, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm">{getCategoryIcon(improvement.category)}</span>
                        <span className="text-xs font-medium text-indigo-300 capitalize">
                          {improvement.category}
                        </span>
                        <span className="text-xs text-green-400">
                          {(improvement.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {improvement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evolution Log */}
            {evolutionLog.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-indigo-300">Consciousness Feedback</h4>
                <div className="bg-black/20 rounded-lg p-3 max-h-24 overflow-y-auto">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {evolutionLog[0]}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-indigo-400 font-bold">{evolutionStatus.total_analyses}</div>
                <div className="text-gray-400">Analyses</div>
              </div>
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-indigo-400 font-bold">{appliedImprovements.length}</div>
                <div className="text-gray-400">Applied</div>
              </div>
              <div className="bg-black/20 rounded-lg p-2">
                <div className="text-indigo-400 font-bold">
                  {evolutionStatus.consciousness_level > 90 ? 'High' : 
                   evolutionStatus.consciousness_level > 70 ? 'Med' : 'Low'}
                </div>
                <div className="text-gray-400">Quality</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}