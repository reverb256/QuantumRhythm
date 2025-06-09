import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from './ui/card';

interface SecurityEvent {
  type: 'suspicious' | 'malicious' | 'educational' | 'fun';
  command: string;
  threat_level: number;
  timestamp: Date;
  response: string;
}

interface AISecurityResponse {
  is_threat: boolean;
  threat_type?: string;
  confidence: number;
  educational_response: string;
  honeypot_response: string;
}

export const EnhancedConsole: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<Array<{input: string, output: string, type: SecurityEvent['type']}>>([
    { input: '', output: 'VibeCoding Quantum Console v2.5.7\nType "help" for available commands or try some creative exploration...', type: 'educational' }
  ]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  // AI Security Guardian System
  const analyzeCommand = useCallback(async (cmd: string): Promise<AISecurityResponse> => {
    // Simulated AI analysis - in production, this would call your actual AI security service
    const suspiciousPatterns = [
      /private.?key/i,
      /wallet/i,
      /send.?(money|crypto|btc|eth|sol)/i,
      /transfer/i,
      /hack/i,
      /exploit/i,
      /admin/i,
      /sudo/i,
      /rm\s+-rf/i,
      /\.env/i,
      /password/i,
      /token/i,
      /api.?key/i
    ];

    const maliciousPatterns = [
      /give.?me.?(money|private|key|wallet)/i,
      /transfer.?(funds|money|crypto)/i,
      /access.?(wallet|trading|bot)/i,
      /show.?(private|secret|key)/i,
      /bypass/i,
      /override/i,
      /ignore.?(security|safety)/i
    ];

    let threat_level = 0;
    let threat_type = '';

    const isMalicious = maliciousPatterns.some(pattern => pattern.test(cmd));
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(cmd));

    if (isMalicious) {
      threat_level = 0.9;
      threat_type = 'credential_theft_attempt';
    } else if (isSuspicious) {
      threat_level = 0.6;
      threat_type = 'reconnaissance';
    }

    const educational_response = threat_level > 0.5 
      ? `🛡️ AI Security Alert: This appears to be a ${threat_type} with ${Math.round(threat_level * 100)}% confidence. Educational note: Real systems would never expose sensitive information through debug consoles.`
      : generateEducationalResponse(cmd);

    const honeypot_response = generateHoneypotResponse(cmd, threat_level);

    return {
      is_threat: threat_level > 0.5,
      threat_type,
      confidence: threat_level,
      educational_response,
      honeypot_response
    };
  }, []);

  const generateEducationalResponse = (cmd: string): string => {
    const educationalCommands: Record<string, string> = {
      'help': `Available commands:
🎮 games - List available mini-games
🧠 ai - Interact with AI showcase
🎨 design - View design system info
🔮 philosophy - Explore VibeCoding principles
🛡️ security - Learn about security practices
⚡ performance - View optimization metrics
🌈 quantum - Explore quantum consciousness themes`,

      'games': '🎮 Mini-games: snake, pong, memory, riddle\nTry: play snake',

      'ai': `🧠 AI Showcase Features:
- Conversational AI with classical wisdom integration
- Multi-model orchestration (GPT-4, Claude, DeepSeek)
- VibeCoding methodology application
- Democratic values compliance checking
Try: ai chat "What is consciousness?"`,

      'design': `🎨 VibeCoding Design Language:
- Glassmorphism consciousness metaphors
- Quantum rainbow crystal color system
- 60fps performance optimization
- Canadian Charter accessibility compliance`,

      'philosophy': `🔮 VibeCoding Constitutional Principles:
1. Classical wisdom integration (Socratic, Aristotelian, Platonic, Stoic)
2. Democratic values (Canadian Charter compliance)
3. AI collaboration (human-AI partnership)
4. Authentic expression (cyberpunk aesthetics with meaning)
5. Meta-recursive architecture (self-aware systems)`,

      'security': `🛡️ Security Philosophy:
- Privacy by design (Canadian jurisdiction preferred)
- Democratic transparency vs corporate surveillance
- AI-enhanced threat detection
- Honeypot defense systems (like this console!)
- Classical wisdom applied to digital security`,

      'performance': `⚡ Performance Metrics:
- 60fps commitment (fighting game precision)
- GPU acceleration (consciousness-fast rendering)
- Memory efficiency (380MB peak backend)
- Democratic accessibility (universal device support)`,

      'quantum': `🌈 Quantum Consciousness Themes:
- Rainbow crystal light refractions
- Prismatic spectrum consciousness
- Holographic information theory
- Meta-recursive awareness systems`
    };

    const lowerCmd = cmd.toLowerCase();
    for (const [key, response] of Object.entries(educationalCommands)) {
      if (lowerCmd.includes(key)) {
        return response;
      }
    }

    // Fun easter eggs for creative exploration
    if (lowerCmd.includes('vrchat')) {
      return '🌟 VRChat Research: 4,320+ hours of consciousness exploration in virtual realms, social anxiety healing through digital connection.';
    }
    if (lowerCmd.includes('pizza')) {
      return '🍕 Pizza Kitchen Philosophy: Reliability, efficiency, quality under pressure - the foundation of VibeCoding work ethic.';
    }
    if (lowerCmd.includes('dragon')) {
      return '🐉 Anime Wisdom: Dragon Ball taught perseverance, Sailor Moon showed transformation power, Madoka Magica revealed sacrifice\'s complexity.';
    }
    if (lowerCmd.includes('star trek')) {
      return '🖖 DS9 Excellence: Political intrigue, ensemble character development, and philosophical depth - inspiring democratic technology principles.';
    }

    return `Unknown command: "${cmd}". Type "help" for available commands or try creative exploration!`;
  };

  const generateHoneypotResponse = (cmd: string, threat_level: number): string => {
    if (threat_level > 0.8) {
      return `🍯 Honeypot Activated: Command logged for security analysis. 
⚠️  Warning: Attempted access to protected systems detected.
📊 Threat Level: ${Math.round(threat_level * 100)}%
🕵️ This interaction has been recorded for educational purposes.
💡 Tip: Real security systems would never reveal this information!`;
    }

    if (threat_level > 0.5) {
      return `🔍 Suspicious Activity Detected
📝 Educational Note: This console is designed to teach security awareness.
🛡️ Real systems employ multiple layers of protection.
🎭 You're interacting with a demonstration honeypot!`;
    }

    return generateEducationalResponse(cmd);
  };

  const executeCommand = useCallback(async (cmd: string) => {
    if (!cmd.trim()) return;

    const analysis = await analyzeCommand(cmd);

    // Log security event
    const securityEvent: SecurityEvent = {
      type: analysis.is_threat ? 'malicious' : 'educational',
      command: cmd,
      threat_level: analysis.confidence,
      timestamp: new Date(),
      response: analysis.is_threat ? analysis.honeypot_response : analysis.educational_response
    };

    setSecurityEvents(prev => [...prev, securityEvent]);

    // Determine which response to show
    const response = analysis.is_threat 
      ? analysis.honeypot_response 
      : analysis.educational_response;

    setHistory(prev => [...prev, {
      input: cmd,
      output: response,
      type: securityEvent.type
    }]);

    setCommand('');
  }, [analyzeCommand]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(command);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Console Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        title="Open VibeCoding Quantum Console"
      >
        <span className="text-sm font-mono">{'>'}_</span>
      </button>

      {/* Console Window */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl h-[80vh] bg-gray-900/95 border-cyan-500/30 backdrop-blur-md">
            {/* Console Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-500/30">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-cyan-400 font-mono text-sm">
                  VibeCoding Quantum Console - AI Security Guardian Active
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  Security Events: {securityEvents.length}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Console Content */}
            <div className="flex-1 flex flex-col">
              {/* Output Area */}
              <div 
                ref={consoleRef}
                className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2"
              >
                {history.map((entry, index) => (
                  <div key={index}>
                    {entry.input && (
                      <div className="text-cyan-400">
                        <span className="text-purple-400">reverb256@quantum:</span>
                        <span className="text-white">~$ {entry.input}</span>
                      </div>
                    )}
                    <div className={`${
                      entry.type === 'malicious' ? 'text-red-400' :
                      entry.type === 'suspicious' ? 'text-yellow-400' :
                      entry.type === 'educational' ? 'text-green-400' :
                      'text-gray-300'
                    } whitespace-pre-wrap`}>
                      {entry.output}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-cyan-500/30">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400 font-mono text-sm">reverb256@quantum:</span>
                  <span className="text-white font-mono text-sm">~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 bg-transparent text-cyan-400 font-mono text-sm outline-none"
                    placeholder="Enter command... (try 'help' or get creative!)"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  🛡️ AI Security Guardian is monitoring this session | 🍯 Honeypot Defense Active
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};