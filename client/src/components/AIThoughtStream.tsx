import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

interface AIThought {
  id: string;
  timestamp: Date;
  type: 'analysis' | 'decision' | 'insight' | 'warning';
  content: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export function AIThoughtStream() {
  const [thoughts, setThoughts] = useState<AIThought[]>([]);

  useEffect(() => {
    // Simulate real-time AI thoughts
    const generateThought = () => {
      const thoughtTypes = ['analysis', 'decision', 'insight', 'warning'] as const;
      const priorities = ['low', 'medium', 'high', 'critical'] as const;
      
      const thoughtTemplates = {
        analysis: [
          "Detecting volume spike pattern in SOL/USDC pair",
          "Market sentiment shifting from bearish to neutral",
          "Correlation analysis shows BTC dominance declining",
          "DeFi TVL increasing across multiple protocols",
          "Options flow indicating bullish positioning"
        ],
        decision: [
          "Executing partial position close on RAY due to resistance",
          "Increasing SOL allocation based on technical breakout",
          "Pausing trades due to high volatility conditions",
          "Reallocating to stablecoin yield strategies",
          "Activating emergency stop protocols"
        ],
        insight: [
          "Whale wallet movements suggest accumulation phase",
          "Cross-chain bridge activity increasing significantly",
          "Institutional inflows detected in liquid staking",
          "MEV opportunities emerging in arbitrage markets",
          "Governance token voting patterns indicate protocol changes"
        ],
        warning: [
          "Gas fees spiking beyond optimal thresholds",
          "Liquidity depth decreasing in target markets",
          "Unusual trading patterns detected - possible manipulation",
          "Network congestion affecting transaction timing",
          "Market volatility exceeding risk parameters"
        ]
      };

      const type = thoughtTypes[Math.floor(Math.random() * thoughtTypes.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const templates = thoughtTemplates[type];
      const content = templates[Math.floor(Math.random() * templates.length)];

      const newThought: AIThought = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        type,
        content,
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100% confidence
        priority
      };

      setThoughts(prev => [newThought, ...prev.slice(0, 9)]); // Keep last 10 thoughts
    };

    // Generate initial thoughts
    for (let i = 0; i < 5; i++) {
      setTimeout(() => generateThought(), i * 1000);
    }

    // Continue generating thoughts
    const interval = setInterval(generateThought, 8000 + Math.random() * 4000); // 8-12 seconds

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: AIThought['type']) => {
    switch (type) {
      case 'analysis': return <Brain className="h-4 w-4" />;
      case 'decision': return <Zap className="h-4 w-4" />;
      case 'insight': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: AIThought['type']) => {
    switch (type) {
      case 'analysis': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'decision': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'insight': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'warning': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    }
  };

  const getPriorityColor = (priority: AIThought['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-500/20';
      case 'medium': return 'bg-yellow-500/20';
      case 'high': return 'bg-orange-500/20';
      case 'critical': return 'bg-red-500/20';
    }
  };

  return (
    <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Brain className="mr-2 h-5 w-5 text-blue-400" />
          AI Thought Stream
          <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {thoughts.map((thought) => (
            <div
              key={thought.id}
              className={`p-3 rounded-lg border ${getTypeColor(thought.type)} ${getPriorityColor(thought.priority)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getIcon(thought.type)}
                  <span className="text-sm font-medium capitalize">{thought.type}</span>
                  <Badge variant="outline" className="text-xs">
                    {thought.confidence}% confidence
                  </Badge>
                </div>
                <span className="text-xs text-gray-400">
                  {thought.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-200">{thought.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default AIThoughtStream;