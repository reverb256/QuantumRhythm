import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  // Fetch Quincy insights
  const { data: quincyData } = useQuery({
    queryKey: ['/api/quincy/insights'],
    refetchInterval: 3000,
  });

  // Fetch error troubleshooter status
  const { data: troubleshooterData } = useQuery({
    queryKey: ['/api/error-troubleshooter/status'],
    refetchInterval: 5000,
  });

  useEffect(() => {
    const newMessages: AgentMessage[] = [];

    if (quincyData?.insights) {
      quincyData.insights.slice(0, 3).forEach((insight: string, index: number) => {
        newMessages.push({
          agent: 'Quincy',
          message: insight,
          type: 'insight',
          timestamp: new Date().toISOString(),
          level: 85 + index * 2
        });
      });
    }

    if (troubleshooterData?.fixes_applied) {
      troubleshooterData.fixes_applied.slice(-2).forEach((fix: any) => {
        newMessages.push({
          agent: 'ErrorBot',
          message: `Auto-fixed: ${fix.fix_applied}`,
          type: 'fix',
          timestamp: fix.timestamp || new Date().toISOString()
        });
      });
    }

    // Design consciousness messages
    newMessages.push({
      agent: 'Akasha',
      message: 'Evolving glassmorphic design patterns for optimal consciousness expression',
      type: 'design',
      timestamp: new Date().toISOString(),
      level: 92
    });

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
            <Card key={index} className={`bg-gradient-to-r ${getAgentColor(msg.agent)} border-white/5 backdrop-blur-sm`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 p-1 bg-white/10 rounded">
                    {getAgentIcon(msg.agent)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                        {msg.agent}
                      </Badge>
                      {msg.level && (
                        <Badge variant="outline" className="text-xs border-blue-400/30 text-blue-400">
                          {msg.level}%
                        </Badge>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentConsciousnessDisplay;