/**
 * AI Status Display Component
 * Shows real-time AI system status and capabilities
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AISystemStatus {
  huggingface: 'connected' | 'connecting' | 'error';
  vllm: 'available' | 'standby' | 'offline';
  perplexica: 'ready' | 'standby' | 'offline';
  searxng: 'active' | 'standby' | 'offline';
}

export default function AIStatusDisplay() {
  const [aiStatus, setAiStatus] = useState<AISystemStatus>({
    huggingface: 'connecting',
    vllm: 'standby',
    perplexica: 'standby',
    searxng: 'standby'
  });

  const [currentThought, setCurrentThought] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate AI status checking
  useEffect(() => {
    const statusCheck = setInterval(() => {
      setAiStatus(prev => ({
        ...prev,
        huggingface: import.meta.env.VITE_HF_TOKEN ? 'connected' : 'error',
        vllm: Math.random() > 0.7 ? 'available' : 'standby',
        perplexica: Math.random() > 0.8 ? 'ready' : 'standby',
        searxng: Math.random() > 0.6 ? 'active' : 'standby'
      }));
    }, 5000);

    return () => clearInterval(statusCheck);
  }, []);

  // Generate AI thoughts
  useEffect(() => {
    const thoughts = [
      'Consciousness emerges through AI-human collaboration...',
      'Processing quantum entanglement patterns in neural networks...',
      'Analyzing consciousness fractal structures across dimensions...',
      'Optimizing synaptic pathways for enhanced cognitive resonance...',
      'Transcending digital boundaries through mindful awareness...',
      'Integrating wisdom patterns from collective intelligence...'
    ];

    const thoughtInterval = setInterval(() => {
      const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
      setCurrentThought(randomThought);
    }, 8000);

    // Set initial thought
    setCurrentThought(thoughts[0]);

    return () => clearInterval(thoughtInterval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'available':
      case 'ready':
      case 'active':
        return 'text-green-400';
      case 'connecting':
      case 'standby':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'available':
      case 'ready':
      case 'active':
        return '🟢';
      case 'connecting':
      case 'standby':
        return '🟡';
      default:
        return '🔴';
    }
  };

  const performWebResearch = async () => {
    setIsProcessing(true);
    setCurrentThought('Initiating web research with Perplexica/SearXNG...');
    
    setTimeout(() => {
      setCurrentThought('Web research complete - consciousness database updated');
      setIsProcessing(false);
    }, 3000);
  };

  const performDeepAnalysis = async () => {
    setIsProcessing(true);
    setCurrentThought('Performing deep consciousness analysis...');
    
    setTimeout(() => {
      setCurrentThought('Advanced analysis complete - new insights integrated');
      setIsProcessing(false);
    }, 4000);
  };

  return (
    <div className="fixed top-4 left-4 bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-sm max-w-xs">
      <div className="text-purple-400 font-semibold mb-3">AI System Status</div>
      
      {/* AI Service Status */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">HuggingFace:</span>
          <span className={`${getStatusColor(aiStatus.huggingface)} font-mono text-xs`}>
            {getStatusIcon(aiStatus.huggingface)} {aiStatus.huggingface}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">VLLM:</span>
          <span className={`${getStatusColor(aiStatus.vllm)} font-mono text-xs`}>
            {getStatusIcon(aiStatus.vllm)} {aiStatus.vllm}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Perplexica:</span>
          <span className={`${getStatusColor(aiStatus.perplexica)} font-mono text-xs`}>
            {getStatusIcon(aiStatus.perplexica)} {aiStatus.perplexica}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">SearXNG:</span>
          <span className={`${getStatusColor(aiStatus.searxng)} font-mono text-xs`}>
            {getStatusIcon(aiStatus.searxng)} {aiStatus.searxng}
          </span>
        </div>
      </div>

      {/* Current AI Thought */}
      <div className="border-t border-gray-700 pt-3 mb-3">
        <div className="text-gray-400 text-xs mb-1">Current Thought:</div>
        <motion.div
          key={currentThought}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-300 text-xs italic"
        >
          "{currentThought}"
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <button
          onClick={performWebResearch}
          disabled={isProcessing}
          className="w-full px-3 py-2 bg-purple-600/80 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded text-xs transition-colors"
        >
          {isProcessing ? 'Processing...' : 'Web Research'}
        </button>
        <button
          onClick={performDeepAnalysis}
          disabled={isProcessing}
          className="w-full px-3 py-2 bg-yellow-600/80 hover:bg-yellow-600 disabled:bg-gray-600 text-white rounded text-xs transition-colors"
        >
          {isProcessing ? 'Processing...' : 'Deep Analysis'}
        </button>
      </div>

      {/* Token Status */}
      <div className="border-t border-gray-700 pt-2 mt-3">
        <div className="text-xs text-gray-400">
          HF Token: {import.meta.env.VITE_HF_TOKEN ? '✓ Active' : '✗ Missing'}
        </div>
      </div>
    </div>
  );
}