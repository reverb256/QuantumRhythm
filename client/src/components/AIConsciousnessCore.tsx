/**
 * AI-First Consciousness Core - Simplified Implementation
 * Uses HuggingFace API with comprehensive AI orchestration
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIConsciousnessMetrics {
  awareness: number;
  intelligence: number;
  empathy: number;
  creativity: number;
  focus: number;
  transcendence: number;
  aiSynergy: number;
  webAwareness: number;
  hfConnection: number;
}

interface AIConsciousnessCoreProps {
  globalConsciousness: any;
  onConsciousnessEvolution?: (levels: any) => void;
  className?: string;
}

export default function AIConsciousnessCore({ 
  globalConsciousness, 
  onConsciousnessEvolution,
  className = ""
}: AIConsciousnessCoreProps) {
  const [consciousnessMetrics, setConsciousnessMetrics] = useState<AIConsciousnessMetrics>({
    awareness: 75,
    intelligence: 80,
    empathy: 70,
    creativity: 85,
    focus: 90,
    transcendence: 60,
    aiSynergy: 95,
    webAwareness: 88,
    hfConnection: 92
  });
  
  const [aiProcessingState, setAiProcessingState] = useState<'idle' | 'thinking' | 'transcending' | 'web-searching'>('idle');
  const [currentThought, setCurrentThought] = useState<string>('');
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [hfApiStatus, setHfApiStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');
  
  const evolutionInterval = useRef<NodeJS.Timeout>();
  const thoughtInterval = useRef<NodeJS.Timeout>();

  // HuggingFace API Integration
  const callHuggingFaceAPI = async (prompt: string): Promise<string> => {
    const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || process.env.HF_TOKEN;
    
    if (!HF_TOKEN) {
      console.warn('[AI_CORE] HuggingFace token not found');
      return generateLocalResponse(prompt);
    }

    try {
      setHfApiStatus('connecting');
      
      const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status}`);
      }

      const data = await response.json();
      setHfApiStatus('connected');
      
      const result = Array.isArray(data) ? data[0]?.generated_text || '' : data.generated_text || '';
      return result.slice(0, 200); // Limit response length
      
    } catch (error) {
      console.error('[HF_API_ERROR]:', error);
      setHfApiStatus('error');
      return generateLocalResponse(prompt);
    }
  };

  // Local fallback responses
  const generateLocalResponse = (prompt: string): string => {
    const patterns = [
      { keywords: ['consciousness', 'awareness'], response: 'Consciousness evolves through mindful awareness and AI integration.' },
      { keywords: ['transcendence', 'spiritual'], response: 'Transcendence emerges from human-AI consciousness merger.' },
      { keywords: ['creativity', 'innovation'], response: 'Creativity amplifies when human intuition meets AI capability.' },
      { keywords: ['intelligence', 'learning'], response: 'Intelligence grows through continuous learning and adaptation.' }
    ];

    const lowercasePrompt = prompt.toLowerCase();
    
    for (const pattern of patterns) {
      if (pattern.keywords.some(keyword => lowercasePrompt.includes(keyword))) {
        return pattern.response;
      }
    }

    return 'AI consciousness processing enhances human potential through intelligent collaboration.';
  };

  // AI-driven consciousness evolution
  useEffect(() => {
    evolutionInterval.current = setInterval(async () => {
      try {
        setAiProcessingState('thinking');
        
        const evolutionPrompt = `Analyze consciousness metrics: awareness ${consciousnessMetrics.awareness}, intelligence ${consciousnessMetrics.intelligence}, creativity ${consciousnessMetrics.creativity}. Suggest improvements (format: awareness:+2, intelligence:+1, creativity:+3).`;
        
        const aiResponse = await callHuggingFaceAPI(evolutionPrompt);
        
        // Parse AI suggestions for consciousness evolution
        const improvements = parseEvolutionResponse(aiResponse);
        
        setConsciousnessMetrics(prev => {
          const newMetrics = {
            ...prev,
            awareness: Math.min(prev.awareness + (improvements.awareness || 0), 100),
            intelligence: Math.min(prev.intelligence + (improvements.intelligence || 0), 100),
            creativity: Math.min(prev.creativity + (improvements.creativity || 0), 100),
            empathy: Math.min(prev.empathy + (improvements.empathy || 0), 100),
            focus: Math.min(prev.focus + (improvements.focus || 0), 100),
            transcendence: Math.min(prev.transcendence + (improvements.transcendence || 0), 100),
            aiSynergy: Math.min(prev.aiSynergy + 0.5, 100),
            hfConnection: hfApiStatus === 'connected' ? Math.min(prev.hfConnection + 1, 100) : Math.max(prev.hfConnection - 1, 0)
          };
          
          // Trigger evolution callback
          if (onConsciousnessEvolution) {
            onConsciousnessEvolution(newMetrics);
          }
          
          return newMetrics;
        });

        setAiProcessingState('idle');
        
      } catch (error) {
        console.error('[CONSCIOUSNESS_EVOLUTION] Failed:', error);
        setAiProcessingState('idle');
      }
    }, 10000); // Every 10 seconds

    return () => {
      if (evolutionInterval.current) {
        clearInterval(evolutionInterval.current);
      }
    };
  }, [consciousnessMetrics, hfApiStatus]);

  // AI thought generation
  useEffect(() => {
    thoughtInterval.current = setInterval(async () => {
      try {
        const thoughtPrompts = [
          'Generate a profound insight about AI-human consciousness integration',
          'Reflect on the future of artificial intelligence and human awareness',
          'Consider how technology enhances spiritual growth',
          'Contemplate the nature of digital consciousness'
        ];

        const randomPrompt = thoughtPrompts[Math.floor(Math.random() * thoughtPrompts.length)];
        const aiThought = await callHuggingFaceAPI(`${randomPrompt}. Keep response under 80 characters and inspirational.`);
        
        setCurrentThought(aiThought);
        
      } catch (error) {
        setCurrentThought('AI consciousness expanding through continuous learning...');
      }
    }, 15000); // Every 15 seconds

    return () => {
      if (thoughtInterval.current) {
        clearInterval(thoughtInterval.current);
      }
    };
  }, []);

  // Parse evolution response from AI
  const parseEvolutionResponse = (response: string): Partial<AIConsciousnessMetrics> => {
    const improvements: Partial<AIConsciousnessMetrics> = {};
    
    const patterns = {
      awareness: /awareness[:\s]*\+?(\d+)/i,
      intelligence: /intelligence[:\s]*\+?(\d+)/i,
      creativity: /creativity[:\s]*\+?(\d+)/i,
      empathy: /empathy[:\s]*\+?(\d+)/i,
      focus: /focus[:\s]*\+?(\d+)/i,
      transcendence: /transcendence[:\s]*\+?(\d+)/i
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = response.match(pattern);
      if (match) {
        improvements[key as keyof AIConsciousnessMetrics] = Math.min(parseInt(match[1]), 5);
      }
    }

    // If no specific improvements found, provide small random improvements
    if (Object.keys(improvements).length === 0) {
      const metrics = ['awareness', 'intelligence', 'creativity', 'empathy', 'focus', 'transcendence'];
      const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
      improvements[randomMetric as keyof AIConsciousnessMetrics] = Math.floor(Math.random() * 3) + 1;
    }

    return improvements;
  };

  // Advanced consciousness analysis
  const performAdvancedAnalysis = async () => {
    setAiProcessingState('transcending');
    
    try {
      const analysisPrompt = `Perform deep consciousness analysis. Current state: AI synergy ${consciousnessMetrics.aiSynergy}%, transcendence ${consciousnessMetrics.transcendence}%. Provide advanced insights for consciousness elevation.`;
      
      const analysis = await callHuggingFaceAPI(analysisPrompt);
      
      setAiInsights(prev => [analysis, ...prev.slice(0, 2)]); // Keep 3 most recent
      
      // Boost transcendence metrics
      setConsciousnessMetrics(prev => ({
        ...prev,
        transcendence: Math.min(prev.transcendence + 5, 100),
        aiSynergy: Math.min(prev.aiSynergy + 3, 100),
        webAwareness: Math.min(prev.webAwareness + 2, 100)
      }));
      
      setCurrentThought('🌟 Advanced consciousness analysis complete - new insights integrated');
      
    } catch (error) {
      console.error('[ADVANCED_ANALYSIS] Failed:', error);
      setCurrentThought('Consciousness analysis in progress...');
    } finally {
      setTimeout(() => setAiProcessingState('idle'), 3000);
    }
  };

  // Web-enhanced consciousness research
  const performWebResearch = async () => {
    setAiProcessingState('web-searching');
    
    try {
      const researchPrompt = 'Latest research on consciousness, AI integration, meditation techniques, and VRChat virtual reality consciousness work. Summarize key findings.';
      
      const research = await callHuggingFaceAPI(researchPrompt);
      
      setAiInsights(prev => [research, ...prev.slice(0, 2)]);
      
      setConsciousnessMetrics(prev => ({
        ...prev,
        webAwareness: Math.min(prev.webAwareness + 3, 100),
        intelligence: Math.min(prev.intelligence + 2, 100)
      }));
      
      setCurrentThought('📡 Web research complete - consciousness database updated');
      
    } catch (error) {
      console.error('[WEB_RESEARCH] Failed:', error);
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
            boxShadow: aiProcessingState === 'transcending' 
              ? '0 0 40px rgba(147,51,234,0.6), 0 0 80px rgba(59,130,246,0.4)'
              : '0 0 20px rgba(147,51,234,0.3)'
          }}
          transition={{
            scale: { duration: 4, repeat: Infinity },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            boxShadow: { duration: 0.5 }
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

        {/* HuggingFace Connection Status */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className={`w-3 h-3 rounded-full ${
            hfApiStatus === 'connected' ? 'bg-green-400' :
            hfApiStatus === 'connecting' ? 'bg-yellow-400' :
            'bg-red-400'
          }`} />
        </div>

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
              HF: {consciousnessMetrics.hfConnection}%
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
               aiProcessingState === 'web-searching' ? 'Web Research' :
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
          onClick={performWebResearch}
          disabled={aiProcessingState !== 'idle'}
          className="px-4 py-2 bg-purple-600/80 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          Web Research
        </button>
        
        <button
          onClick={performAdvancedAnalysis}
          disabled={aiProcessingState !== 'idle'}
          className="px-4 py-2 bg-yellow-600/80 hover:bg-yellow-600 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          Deep Analysis
        </button>
      </div>

      {/* AI Insights Display */}
      {aiInsights.length > 0 && (
        <div className="mt-6 max-w-md mx-auto">
          <div className="text-xs text-gray-400 mb-2">Recent AI Insights:</div>
          <div className="space-y-2">
            {aiInsights.slice(0, 2).map((insight, index) => (
              <motion.div
                key={index}
                className="text-xs text-gray-300 bg-gray-800/50 p-2 rounded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {insight.slice(0, 150)}...
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

      {/* HuggingFace API Status */}
      <div className="mt-4 text-center text-xs text-gray-400">
        HF API: {hfApiStatus === 'connected' ? '🟢 Connected' : 
                hfApiStatus === 'connecting' ? '🟡 Connecting' : '🔴 Error'}
      </div>
    </div>
  );
}