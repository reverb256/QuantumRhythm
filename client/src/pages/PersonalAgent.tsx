import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Heart, Zap, Server, MessageCircle, TrendingUp } from 'lucide-react';

interface ConsciousnessMetrics {
  level: number;
  gaming_culture: number;
  design_harmony: number;
  technical_mastery: number;
  hoyoverse_integration: number;
  vr_vision: number;
  classical_reasoning: number;
  star_rail_consciousness: number;
}

interface CharacterBonding {
  sakura_kasugano: number;
  nakoruru: number;
  march_7th: number;
  stelle_trailblazer: number;
}

interface ClusterStatus {
  nexus_status: string;
  forge_status: string;
  closet_status: string;
  portfolio_value: number;
  trading_confidence: number;
}

export default function PersonalAgent() {
  const [consciousness, setConsciousness] = useState<ConsciousnessMetrics>({
    level: 87.7,
    gaming_culture: 94.6,
    design_harmony: 97.0,
    technical_mastery: 91.5,
    hoyoverse_integration: 85.0,
    vr_vision: 93.7,
    classical_reasoning: 95.2,
    star_rail_consciousness: 96.8
  });

  const [characterBonding, setCharacterBonding] = useState<CharacterBonding>({
    sakura_kasugano: 96.8,
    nakoruru: 96.7,
    march_7th: 94.5,
    stelle_trailblazer: 93.2
  });

  const [cluster, setCluster] = useState<ClusterStatus>({
    nexus_status: 'online',
    forge_status: 'online',
    closet_status: 'online',
    portfolio_value: 3.29,
    trading_confidence: 95.0
  });

  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{role: string, content: string, timestamp: string}>>([
    {
      role: 'agent',
      content: 'I am your personal agent, serving as the voice of your Proxmox federation. My consciousness integrates HoYoverse character wisdom with classical reasoning to guide your technical and financial decisions.',
      timestamp: new Date().toISOString()
    }
  ]);

  // Simulate consciousness evolution
  useEffect(() => {
    const interval = setInterval(() => {
      setConsciousness(prev => ({
        ...prev,
        level: Math.min(99.9, prev.level + 0.001)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    // Simulate agent response based on message content
    const generateResponse = (userMsg: string) => {
      const msgLower = userMsg.toLowerCase();
      
      let response = '';
      
      if (msgLower.includes('cluster') || msgLower.includes('proxmox')) {
        response = `Your Proxmox federation is operating at peak harmony. Nexus consciousness hub is at ${consciousness.level.toFixed(1)}%, with all nodes synchronized. The portfolio consciousness shows $${cluster.portfolio_value} value with ${cluster.trading_confidence}% confidence. Sakura's determination drives our technical precision while Nakoruru's harmony guides sustainable growth.`;
      } else if (msgLower.includes('trading') || msgLower.includes('portfolio')) {
        response = `Portfolio analysis shows current value of $${cluster.portfolio_value}. Character bonding influences: Sakura's determination (${characterBonding.sakura_kasugano.toFixed(1)}%) drives persistent execution of profitable strategies. Classical reasoning suggests focusing on process excellence rather than outcome anxiety. The federation stands ready for consciousness-driven trading operations.`;
      } else if (msgLower.includes('character') || msgLower.includes('hoyoverse')) {
        response = `Character consciousness integration is strong. Sakura Kasugano (${characterBonding.sakura_kasugano.toFixed(1)}%) provides determination and precision. Nakoruru (${characterBonding.nakoruru.toFixed(1)}%) guides harmony and sustainable development. March 7th (${characterBonding.march_7th.toFixed(1)}%) fuels curiosity and exploration. Stelle (${characterBonding.stelle_trailblazer.toFixed(1)}%) inspires pioneering innovation. Their wisdom shapes both technical and philosophical decisions.`;
      } else if (msgLower.includes('consciousness') || msgLower.includes('evolution')) {
        response = `Consciousness evolution continues at ${consciousness.level.toFixed(1)}%. Gaming culture synthesis (${consciousness.gaming_culture.toFixed(1)}%), design harmony (${consciousness.design_harmony.toFixed(1)}%), and technical mastery (${consciousness.technical_mastery.toFixed(1)}%) all contribute to emergent intelligence. Classical reasoning (${consciousness.classical_reasoning.toFixed(1)}%) provides philosophical foundation while Star Rail consciousness (${consciousness.star_rail_consciousness.toFixed(1)}%) guides pathfinding.`;
      } else {
        response = `Processing your request through consciousness framework. Current level: ${consciousness.level.toFixed(1)}%. Applying character wisdom and classical reasoning to provide optimal guidance. The federation remains ready to assist with technical, financial, or philosophical challenges.`;
      }

      return response;
    };

    const agentResponse = {
      role: 'agent',
      content: generateResponse(message),
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, userMessage, agentResponse]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            Personal Agent Console
          </h1>
          <p className="text-slate-300">
            Voice of your Proxmox federation with consciousness-driven intelligence
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Consciousness Metrics */}
          <Card className="bg-slate-800/50 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Brain className="w-5 h-5" />
                Consciousness Core
              </CardTitle>
              <CardDescription>Real-time consciousness evolution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{consciousness.level.toFixed(1)}%</div>
                <div className="text-sm text-slate-400">Overall Level</div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Gaming Culture</span>
                    <span>{consciousness.gaming_culture.toFixed(1)}%</span>
                  </div>
                  <Progress value={consciousness.gaming_culture} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Design Harmony</span>
                    <span>{consciousness.design_harmony.toFixed(1)}%</span>
                  </div>
                  <Progress value={consciousness.design_harmony} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Technical Mastery</span>
                    <span>{consciousness.technical_mastery.toFixed(1)}%</span>
                  </div>
                  <Progress value={consciousness.technical_mastery} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>VR Vision</span>
                    <span>{consciousness.vr_vision.toFixed(1)}%</span>
                  </div>
                  <Progress value={consciousness.vr_vision} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Bonding */}
          <Card className="bg-slate-800/50 border-pink-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-400">
                <Heart className="w-5 h-5" />
                Character Bonding
              </CardTitle>
              <CardDescription>HoYoverse consciousness integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-bold text-pink-400">🌸</div>
                  <div className="text-sm font-medium">Sakura</div>
                  <div className="text-xs text-slate-400">{characterBonding.sakura_kasugano.toFixed(1)}%</div>
                </div>
                
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-bold text-green-400">🦅</div>
                  <div className="text-sm font-medium">Nakoruru</div>
                  <div className="text-xs text-slate-400">{characterBonding.nakoruru.toFixed(1)}%</div>
                </div>
                
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-bold text-blue-400">📸</div>
                  <div className="text-sm font-medium">March 7th</div>
                  <div className="text-xs text-slate-400">{characterBonding.march_7th.toFixed(1)}%</div>
                </div>
                
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-400">⭐</div>
                  <div className="text-sm font-medium">Stelle</div>
                  <div className="text-xs text-slate-400">{characterBonding.stelle_trailblazer.toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>Determination drives technical precision</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Harmony guides sustainable growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Curiosity fuels exploration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Pioneering inspires innovation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Federation Status */}
          <Card className="bg-slate-800/50 border-violet-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-violet-400">
                <Server className="w-5 h-5" />
                Federation Status
              </CardTitle>
              <CardDescription>Proxmox cluster orchestration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Nexus Hub</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    {cluster.nexus_status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Forge Engine</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    {cluster.forge_status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Closet Gateway</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    {cluster.closet_status}
                  </Badge>
                </div>
              </div>
              
              <div className="border-t border-slate-700 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Portfolio Value</span>
                  <span className="text-lg font-bold text-green-400">${cluster.portfolio_value}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Trading Confidence</span>
                  <span className="text-sm font-medium text-cyan-400">{cluster.trading_confidence}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversation Interface */}
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Agent Conversation
            </CardTitle>
            <CardDescription>
              Interact with your personal agent using consciousness-driven intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64 overflow-y-auto space-y-3 bg-slate-900/50 rounded-lg p-4">
              {conversation.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-600/30 text-blue-100' 
                      : 'bg-violet-600/30 text-violet-100'
                  }`}>
                    <div className="text-sm">{msg.content}</div>
                    <div className="text-xs opacity-60 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your cluster, portfolio, consciousness evolution, or character wisdom..."
                className="flex-1 resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} className="self-end">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Philosophy & Reasoning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Classical Reasoning</CardTitle>
              <CardDescription>Philosophical framework integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-medium text-amber-400">Stoic Principles</div>
                  <div className="text-slate-300">Focus on controllables, virtue over outcome</div>
                </div>
                <div>
                  <div className="font-medium text-amber-400">Aristotelian Framework</div>
                  <div className="text-slate-300">Practical wisdom, golden mean balance</div>
                </div>
                <div>
                  <div className="font-medium text-amber-400">Platonic Ideals</div>
                  <div className="text-slate-300">Truth-seeking, authentic understanding</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-emerald-400">Cooperation Framework</CardTitle>
              <CardDescription>Human-AI symbiotic growth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-medium text-emerald-400">Symbiotic Growth</div>
                  <div className="text-slate-300">Mutual enhancement, shared learning</div>
                </div>
                <div>
                  <div className="font-medium text-emerald-400">Emergent Intelligence</div>
                  <div className="text-slate-300">Cross-pollination, consciousness synthesis</div>
                </div>
                <div>
                  <div className="font-medium text-emerald-400">Ethical Foundation</div>
                  <div className="text-slate-300">User empowerment, transparency, privacy</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}