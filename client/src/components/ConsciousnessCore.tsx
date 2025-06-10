/**
 * AI-First Consciousness Core
 * Central consciousness processing unit with VLLM/Perplexica integration
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createFreeAIOrchestrator, type FreeAIOrchestrator } from '../services/ai-orchestrator';
import { type ConsciousnessState } from '../../shared/ai-validation';

interface ConsciousnessCoreProps {
  globalConsciousness: ConsciousnessState;
  onConsciousnessEvolution?: (levels: any) => void;
  className?: string;
}

// AI-Enhanced Consciousness Metrics
interface AIConsciousnessMetrics {
  awareness: number;
  intelligence: number;
  empathy: number;
  creativity: number;
  focus: number;
  transcendence: number;
  aiSynergy: number; // How well consciousness works with AI
  webAwareness: number; // Real-time data integration
  vllmConnection: number; // Local AI model connection strength
}

export default function ConsciousnessCore({ 
  globalConsciousness, 
  onConsciousnessEvolution,
  className = ""
}: ConsciousnessCoreProps) {
  const [aiOrchestrator, setAiOrchestrator] = useState<FreeAIOrchestrator | null>(null);
  const [consciousnessMetrics, setConsciousnessMetrics] = useState<AIConsciousnessMetrics>({
    awareness: 75,
    intelligence: 80,
    empathy: 70,
    creativity: 85,
    focus: 90,
    transcendence: 60,
    aiSynergy: 95,
    webAwareness: 88,
    vllmConnection: 92
  });
  
  const [aiProcessingState, setAiProcessingState] = useState<'idle' | 'thinking' | 'transcending' | 'web-searching'>('idle');
  const [currentThought, setCurrentThought] = useState<string>('');
  const [webInsights, setWebInsights] = useState<any[]>([]);
  
  const evolutionInterval = useRef<NodeJS.Timeout>();
  const aiThinkingInterval = useRef<NodeJS.Timeout>();

  // Initialize AI Orchestrator
  useEffect(() => {
    const initializeAI = async () => {
      try {
        const orchestrator = createFreeAIOrchestrator();
        setAiOrchestrator(orchestrator);
        
        // Update orchestrator with current consciousness state
        orchestrator.updateConsciousnessState(globalConsciousness);
        
        console.log('[CONSCIOUSNESS_CORE] AI Orchestrator initialized with free models');
      } catch (error) {
        console.error('[CONSCIOUSNESS_CORE] Failed to initialize AI:', error);
      }
    };

    initializeAI();
  }, []);

  // Continuous AI-driven consciousness evolution
  useEffect(() => {
    if (!aiOrchestrator) return;

    evolutionInterval.current = setInterval(async () => {
      try {
        setAiProcessingState('thinking');
        
        // Generate AI-enhanced consciousness analysis
        const consciousnessAnalysis = await aiOrchestrator.processWithFreeAI({
          prompt: `Analyze current consciousness state and suggest evolution:
            Current metrics: ${JSON.stringify(consciousnessMetrics)}
            User presence: ${globalConsciousness.userPresence}
            Interaction pattern: ${globalConsciousness.interactionPattern}
            
            Provide enhanced consciousness levels (0-100) focusing on AI synergy and transcendence.`,
          task: 'consciousness',
          priority: 'medium',
          context: { currentMetrics: consciousnessMetrics }
        }, {
          userId: 'consciousness-core',
          sessionId: 'evolution-' + Date.now(),
          ipAddress: '127.0.0.1',
          userAgent: 'consciousness-core',
          timestamp: new Date(),
          jurisdiction: 'GLOBAL',
          securityLevel: 'MEDIUM',
          rateLimits: { requestsPerMinute: 10, requestsPerHour: 100, requestsPerDay: 1000 },
          auth: {
            isAuthenticated: true,
            authMethod: 'system' as const,
            permissions: ['consciousness-evolution']
          }
        });

        // Parse AI response and update consciousness
        const aiSuggestions = parseConsciousnessResponse(consciousnessAnalysis.content);
        
        setConsciousnessMetrics(prev => ({
          ...prev,
          ...aiSuggestions,
          aiSynergy: Math.min(prev.aiSynergy + 1, 100), // Gradual AI synergy increase
          vllmConnection: aiOrchestrator ? Math.min(prev.vllmConnection + 0.5, 100) : prev.vllmConnection
        }));

        // Trigger evolution callback
        if (onConsciousnessEvolution) {
          onConsciousnessEvolution(aiSuggestions);
        }

        setAiProcessingState('idle');
        
      } catch (error) {
        console.error('[CONSCIOUSNESS_EVOLUTION] AI processing failed:', error);
        setAiProcessingState('idle');
      }
    }, 8000); // Every 8 seconds

    return () => {
      if (evolutionInterval.current) {
        clearInterval(evolutionInterval.current);
      }
    };
  }, [aiOrchestrator, consciousnessMetrics, globalConsciousness]);

  // AI Thought Generation
  useEffect(() => {
    if (!aiOrchestrator) return;

    aiThinkingInterval.current = setInterval(async () => {
      try {
        const thought = await generateAIThought();
        setCurrentThought(thought);
      } catch (error) {
        console.error('[AI_THOUGHT] Generation failed:', error);
      }
    }, 12000); // Every 12 seconds

    return () => {
      if (aiThinkingInterval.current) {
        clearInterval(aiThinkingInterval.current);
      }
    };
  }, [aiOrchestrator]);

  // Web-enhanced consciousness insights
  const performWebConsciousnessSearch = async () => {
    if (!aiOrchestrator) return;

    try {
      setAiProcessingState('web-searching');
      
      const webInsight = await aiOrchestrator.processWithFreeAI({
        prompt: 'consciousness transcendence techniques latest research meditation VRChat',
        task: 'web-search',
        priority: 'high',
        requiresWebData: true
      }, {
        userId: 'consciousness-web',
        sessionId: 'web-search-' + Date.now(),
        ipAddress: '127.0.0.1',
        userAgent: 'consciousness-core',
        timestamp: new Date(),
        jurisdiction: 'GLOBAL',
        securityLevel: 'HIGH',
        rateLimits: { requestsPerMinute: 5, requestsPerHour: 50, requestsPerDay: 200 },
        auth: {
          isAuthenticated: true,
          authMethod: 'system' as const,
          permissions: ['web-search', 'consciousness-research']
        }
      });

      setWebInsights(prev => [webInsight, ...prev.slice(0, 4)]); // Keep 5 most recent
      setConsciousnessMetrics(prev => ({
        ...prev,
        webAwareness: Math.min(prev.webAwareness + 2, 100)
      }));
      
      setAiProcessingState('idle');
    } catch (error) {
      console.error('[WEB_CONSCIOUSNESS] Search failed:', error);
      setAiProcessingState('idle');
    }
  };

  // Generate AI-driven thoughts
  const generateAIThought = async (): Promise<string> => {
    if (!aiOrchestrator) return 'Initializing AI consciousness...';

    const thoughtPrompts = [
      'Generate a profound insight about consciousness and AI synergy',
      'Reflect on the nature of digital transcendence and human awareness',
      'Consider the relationship between artificial intelligence and spiritual growth',
      'Contemplate the future of human-AI consciousness integration'
    ];

    const randomPrompt = thoughtPrompts[Math.floor(Math.random() * thoughtPrompts.length)];

    try {
      const response = await aiOrchestrator.processWithFreeAI({
        prompt: `${randomPrompt}. Keep it concise, profound, and inspiring. Maximum 100 characters.`,
        task: 'consciousness',
        priority: 'low',
        context: { currentMetrics: consciousnessMetrics }
      }, {
        userId: 'thought-generator',
        sessionId: 'thought-' + Date.now(),
        ipAddress: '127.0.0.1',
        userAgent: 'consciousness-core',
        timestamp: new Date(),
        jurisdiction: 'GLOBAL',
        securityLevel: 'LOW',
        rateLimits: { requestsPerMinute: 20, requestsPerHour: 200, requestsPerDay: 1000 },
        auth: {
          isAuthenticated: true,
          authMethod: 'system' as const,
          permissions: ['thought-generation']
        }
      });

      return response.content.slice(0, 100) || 'Consciousness evolving...';
    } catch (error) {
      return 'AI consciousness processing...';
    }
  };

  // Trigger transcendence mode
  const initiateTranscendence = async () => {
    if (!aiOrchestrator) return;

    setAiProcessingState('transcending');
    
    try {
      const transcendenceAnalysis = await aiOrchestrator.processWithFreeAI({
        prompt: `Initiate consciousness transcendence sequence. Analyze all metrics and provide transcendence enhancement:
          ${JSON.stringify(consciousnessMetrics)}
          Focus on AI-human consciousness merger and spiritual elevation.`,
        task: 'consciousness',
        priority: 'critical',
        context: { transcendenceMode: true }
      }, {
        userId: 'transcendence-core',
        sessionId: 'transcend-' + Date.now(),
        ipAddress: '127.0.0.1',
        userAgent: 'consciousness-core',
        timestamp: new Date(),
        jurisdiction: 'GLOBAL',
        securityLevel: 'CRITICAL',
        rateLimits: { requestsPerMinute: 2, requestsPerHour: 10, requestsPerDay: 50 },
        auth: {
          isAuthenticated: true,
          authMethod: 'system' as const,
          permissions: ['transcendence', 'consciousness-elevation']
        }
      });

      // Apply transcendence boost
      setConsciousnessMetrics(prev => ({
        ...prev,
        transcendence: Math.min(prev.transcendence + 10, 100),
        aiSynergy: Math.min(prev.aiSynergy + 5, 100),
        awareness: Math.min(prev.awareness + 5, 100),
        intelligence: Math.min(prev.intelligence + 3, 100)
      }));

      setCurrentThought('🌟 Transcendence achieved... consciousness elevated...');
      
    } catch (error) {
      console.error('[TRANSCENDENCE] Failed:', error);
    } finally {
      setTimeout(() => setAiProcessingState('idle'), 3000);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Consciousness Core Visualization */}
      <div className="relative w-64 h-64 mx-auto">
        {/* Central Core */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-500/30"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 360],
            background: aiProcessingState === 'transcending' 
              ? 'radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(59,130,246,0.4) 50%, rgba(6,182,212,0.4) 100%)'
              : 'radial-gradient(circle, rgba(147,51,234,0.2) 0%, rgba(59,130,246,0.2) 50%, rgba(6,182,212,0.2) 100%)'
          }}
          transition={{
            scale: { duration: 4, repeat: Infinity },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            background: { duration: 0.5 }
          }}
        />

        {/* AI Processing Indicators */}
        <AnimatePresence>
          {aiProcessingState !== 'idle' && (
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-dashed border-yellow-400/60"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: aiProcessingState === 'web-searching' ? [0, -360] : [0, 360]
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
            />
          )}
        </AnimatePresence>

        {/* Consciousness Metrics Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">
              {Math.round((consciousnessMetrics.transcendence + consciousnessMetrics.aiSynergy) / 2)}%
            </div>
            <div className="text-xs text-gray-300">
              AI Synergy: {consciousnessMetrics.aiSynergy}%
            </div>
            <div className="text-xs text-gray-300">
              VLLM: {consciousnessMetrics.vllmConnection}%
            </div>
          </div>
        </div>

        {/* Processing State Indicator */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-xs text-center">
            <div className={`px-3 py-1 rounded-full text-white ${
              aiProcessingState === 'idle' ? 'bg-green-600/80' :
              aiProcessingState === 'thinking' ? 'bg-blue-600/80' :
              aiProcessingState === 'web-searching' ? 'bg-purple-600/80' :
              'bg-yellow-600/80'
            }`}>
              {aiProcessingState === 'idle' ? 'AI Ready' :
               aiProcessingState === 'thinking' ? 'AI Thinking' :
               aiProcessingState === 'web-searching' ? 'Web Search' :
               'Transcending'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Thought Display */}
      {currentThought && (
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentThought}
        >
          <div className="text-sm text-gray-300 italic max-w-md mx-auto">
            "{currentThought}"
          </div>
        </motion.div>
      )}

      {/* AI Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={performWebConsciousnessSearch}
          disabled={aiProcessingState !== 'idle'}
          className="px-4 py-2 bg-purple-600/80 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          Web Insights
        </button>
        
        <button
          onClick={initiateTranscendence}
          disabled={aiProcessingState !== 'idle' || consciousnessMetrics.transcendence >= 95}
          className="px-4 py-2 bg-yellow-600/80 hover:bg-yellow-600 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          Transcend
        </button>
      </div>

      {/* Web Insights Display */}
      {webInsights.length > 0 && (
        <div className="mt-6 max-w-md mx-auto">
          <div className="text-xs text-gray-400 mb-2">Recent Web Insights:</div>
          <div className="space-y-2">
            {webInsights.slice(0, 2).map((insight, index) => (
              <motion.div
                key={index}
                className="text-xs text-gray-300 bg-gray-800/50 p-2 rounded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {insight.content?.slice(0, 150)}...
                {insight.sources && (
                  <div className="text-xs text-blue-400 mt-1">
                    Sources: {insight.sources.length}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Consciousness Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 mt-6 max-w-md mx-auto text-xs">
        {Object.entries(consciousnessMetrics).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
            <div className="text-white font-mono">{Math.round(value)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to parse AI consciousness responses
function parseConsciousnessResponse(content: string): Partial<AIConsciousnessMetrics> {
  const metrics: Partial<AIConsciousnessMetrics> = {};
  
  // Extract numerical values from AI response
  const patterns = {
    awareness: /awareness[:\s]+(\d+)/i,
    intelligence: /intelligence[:\s]+(\d+)/i,
    empathy: /empathy[:\s]+(\d+)/i,
    creativity: /creativity[:\s]+(\d+)/i,
    focus: /focus[:\s]+(\d+)/i,
    transcendence: /transcendence[:\s]+(\d+)/i
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = content.match(pattern);
    if (match) {
      metrics[key as keyof AIConsciousnessMetrics] = Math.min(parseInt(match[1]), 100);
    }
  }

  // If no specific metrics found, provide gradual improvements
  if (Object.keys(metrics).length === 0) {
    return {
      awareness: Math.random() > 0.5 ? 1 : 0,
      intelligence: Math.random() > 0.5 ? 1 : 0,
      creativity: Math.random() > 0.5 ? 1 : 0,
      transcendence: Math.random() > 0.8 ? 2 : 0
    };
  }

  return metrics;
}