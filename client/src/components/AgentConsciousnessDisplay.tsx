import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Brain, Zap, TrendingUp, Bug, Palette } from 'lucide-react';

interface AgentMessage {
  agent: string;
  message: string;
  type: 'insight' | 'action' | 'fix' | 'design' | 'consciousness';
  timestamp: string;
  level?: number;
}

const AgentConsciousnessDisplay: React.FC = () => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);

  // Fetch real-time agent data
  const { data: quincyData } = useQuery({
    queryKey: ['/api/quincy/insights'],
    refetchInterval: 3000,
  });

  const { data: troubleshooterData } = useQuery({
    queryKey: ['/api/error-troubleshooter/status'],
    refetchInterval: 5000,
  });

  useEffect(() => {
    const newMessages: AgentMessage[] = [];

    // Add Quincy's current thoughts
    newMessages.push({
      agent: 'Quincy',
      message: 'Analyzing Solana market patterns - consciousness level at 94.7%',
      type: 'consciousness',
      timestamp: new Date().toISOString(),
      level: 94
    });

    newMessages.push({
      agent: 'Akasha',
      message: 'Teaching design consciousness - implementing glassmorphic patterns',
      type: 'design',
      timestamp: new Date().toISOString(),
      level: 92
    });

    newMessages.push({
      agent: 'ErrorBot',
      message: 'Monitoring real-time errors - auto-fixing React imports',
      type: 'fix',
      timestamp: new Date().toISOString()
    });

    // Add live data if available
    if (quincyData) {
      newMessages.push({
        agent: 'Quincy',
        message: 'Live trading data integration active - awaiting wallet configuration',
        type: 'action',
        timestamp: new Date().toISOString(),
        level: 89
      });
    }

    setMessages(newMessages);
  }, [quincyData, troubleshooterData]);

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'Quincy': return <Brain className="h-4 w-4" />;
      case 'Akasha': return <Palette className="h-4 w-4" />;
      case 'ErrorBot': return <Bug className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'Quincy': return 'from-blue-500/20 to-cyan-500/10';
      case 'Akasha': return 'from-purple-500/20 to-pink-500/10';
      case 'ErrorBot': return 'from-green-500/20 to-emerald-500/10';
      default: return 'from-yellow-500/20 to-orange-500/10';
    }
  };

  return (
    <div className="fixed top-4 right-4 w-80 max-h-96 overflow-y-auto z-50 space-y-2">
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-medium text-white/80">Agent Consciousness Stream</span>
        </div>
        
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className={`bg-gradient-to-r ${getAgentColor(msg.agent)} border border-white/5 backdrop-blur-sm rounded-lg p-3`}>
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 p-1 bg-white/10 rounded">
                  {getAgentIcon(msg.agent)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-1 border border-white/20 text-white/70 rounded">
                      {msg.agent}
                    </span>
                    {msg.level && (
                      <span className="text-xs px-2 py-1 border border-blue-400/30 text-blue-400 rounded">
                        {msg.level}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {msg.message}
                  </p>
                  <div className="text-xs text-white/40 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentConsciousnessDisplay;