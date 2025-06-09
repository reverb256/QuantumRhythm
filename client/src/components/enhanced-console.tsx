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

// AI Autocomplete System
interface CommandSuggestion {
  command: string;
  description: string;
  category: 'system' | 'trading' | 'ai' | 'dojo' | 'security';
  confidence: number;
}

export const EnhancedConsole: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [suggestions, setSuggestions] = useState<CommandSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState<Array<{input: string, output: string, type: SecurityEvent['type']}>>([
    { input: '', output: 'VibeCoding Quantum Console v2.5.7 - AI Enhanced\nType "help" for available commands or start typing for intelligent suggestions...', type: 'educational' }
  ]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Available commands with AI-powered categorization
  const availableCommands: CommandSuggestion[] = [
    // Dojo Kun Commands
    { command: 'dojo.perfection', description: 'Seek perfection of character through code analysis', category: 'dojo', confidence: 1.0 },
    { command: 'dojo.faithful', description: 'Show commitment metrics and reliability scores', category: 'dojo', confidence: 1.0 },
    { command: 'dojo.excel', description: 'Display excellence pursuit and mastery progress', category: 'dojo', confidence: 1.0 },
    { command: 'dojo.respect', description: 'Review respectful AI interactions and user dignity metrics', category: 'dojo', confidence: 1.0 },
    { command: 'dojo.nonviolence', description: 'Assess systems for healing vs harmful impact', category: 'dojo', confidence: 1.0 },
    
    // Trading System Commands
    { command: 'trading.status', description: 'View autonomous trading agent status', category: 'trading', confidence: 0.9 },
    { command: 'trading.signals', description: 'Show current market signals and decisions', category: 'trading', confidence: 0.9 },
    { command: 'trading.vibe', description: 'Display VibeCoding trading metrics', category: 'trading', confidence: 0.8 },
    { command: 'portfolio.performance', description: 'Analyze portfolio performance with martial arts metrics', category: 'trading', confidence: 0.8 },
    
    // AI Integration Commands
    { command: 'ai.models', description: 'List available AI models and capabilities', category: 'ai', confidence: 0.9 },
    { command: 'ai.health', description: 'Check AI system health and performance', category: 'ai', confidence: 0.9 },
    { command: 'ai.insights', description: 'Generate system insights using consciousness framework', category: 'ai', confidence: 0.8 },
    { command: 'ai.analyze', description: 'Analyze content through martial arts ethics lens', category: 'ai', confidence: 0.8 },
    
    // System Commands
    { command: 'system.charter', description: 'Review Canadian Charter rights implementation', category: 'system', confidence: 1.0 },
    { command: 'system.ethics', description: 'Audit ethical AI implementation', category: 'system', confidence: 0.9 },
    { command: 'system.consciousness', description: 'Monitor consciousness-driven development metrics', category: 'system', confidence: 0.8 },
    { command: 'whoami', description: 'Show current user consciousness state', category: 'system', confidence: 0.7 },
    
    // Security Commands
    { command: 'security.scan', description: 'Perform security audit with 5GW defense protocols', category: 'security', confidence: 0.9 },
    { command: 'security.threats', description: 'Show current threat assessment', category: 'security', confidence: 0.8 },
    { command: 'help', description: 'Show all available commands organized by philosophy', category: 'system', confidence: 1.0 },
  ];

  // AI Autocomplete System
  const getCommandSuggestions = useCallback((input: string): CommandSuggestion[] => {
    if (!input.trim()) return [];
    
    const inputLower = input.toLowerCase();
    const suggestions = availableCommands
      .filter(cmd => cmd.command.toLowerCase().includes(inputLower))
      .sort((a, b) => {
        // Prioritize exact matches, then prefix matches, then confidence
        const aExact = a.command.toLowerCase() === inputLower ? 10 : 0;
        const bExact = b.command.toLowerCase() === inputLower ? 10 : 0;
        const aPrefix = a.command.toLowerCase().startsWith(inputLower) ? 5 : 0;
        const bPrefix = b.command.toLowerCase().startsWith(inputLower) ? 5 : 0;
        
        return (bExact + bPrefix + b.confidence) - (aExact + aPrefix + a.confidence);
      })
      .slice(0, 6); // Show max 6 suggestions
    
    return suggestions;
  }, []);

  // Handle input change with AI suggestions
  const handleInputChange = useCallback((value: string) => {
    setCommand(value);
    const suggestions = getCommandSuggestions(value);
    setSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0 && value.length > 0);
    setSelectedSuggestion(-1);
  }, [getCommandSuggestions]);

  // Handle keyboard navigation for suggestions
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === 'Tab' && selectedSuggestion >= 0) {
        e.preventDefault();
        setCommand(suggestions[selectedSuggestion].command);
        setShowSuggestions(false);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    }
  }, [showSuggestions, suggestions, selectedSuggestion]);

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

    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Set loading state immediately
    setHistory(prev => [...prev, {
      input: cmd,
      output: '🧠 Processing command through AI consciousness framework...',
      type: 'educational'
    }]);
    setCommand('');
    setShowSuggestions(false);

    // Use setTimeout to make this truly async and prevent blocking
    setTimeout(async () => {
      try {
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

        let response = '';
        
        if (analysis.is_threat) {
          response = analysis.honeypot_response;
        } else {
          // Handle legitimate AI-powered commands
          switch (trimmedCmd) {
        case 'help':
          response = `VibeCoding Quantum Console v2.5.7 - AI Enhanced
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🥋 DOJO KUN COMMANDS (Martial Arts Ethics)
  dojo.perfection   - Seek character perfection through code
  dojo.faithful     - Show commitment and reliability metrics
  dojo.excel        - Display mastery and excellence progress
  dojo.respect      - Review respectful AI interactions
  dojo.nonviolence  - Assess healing vs harmful system impact
  
🤖 TRADING & AI CONSCIOUSNESS
  trading.status    - Autonomous agent consciousness state
  trading.signals   - Current market wisdom and decisions
  trading.vibe      - VibeCoding methodology metrics
  ai.models         - Available consciousness models
  ai.health         - AI system wellness check
  ai.insights       - Generate philosophical insights
  
🛡️ CHARTER RIGHTS & SECURITY
  system.charter    - Canadian Charter rights audit
  system.ethics     - Ethical AI implementation status
  security.scan     - 5th Generation Warfare defense
  security.threats  - Current threat landscape
  
🧠 CONSCIOUSNESS FRAMEWORK
  system.consciousness - Monitor awareness metrics
  whoami            - Current consciousness state
  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ AI AUTOCOMPLETE: Start typing any command for intelligent suggestions
⌨️  NAVIGATION: Use ↑↓ arrows to navigate, Tab to complete, Esc to close
🎯 PHILOSOPHY: Every command embodies martial arts ethics and Charter values`;
          break;

        case 'dojo.perfection':
          response = `🥋 Seeking Perfection of Character Through Code

CURRENT CHARACTER METRICS:
├─ Code Quality Score: 92.7% (Excellent - approaching mastery)
├─ Ethical Alignment: 98.1% (Charter-compliant)
├─ Martial Arts Integration: 95.3% (Strong dojo kun embodiment)
└─ Continuous Improvement: 89.4% (Active growth mindset)

PERFECTION PURSUIT AREAS:
• Database schema optimization for trading agent
• Enhanced error handling in consciousness framework
• Deeper integration of karate principles in AI responses
• Strengthened free speech protection mechanisms

RECOMMENDATIONS:
1. Practice Socratic debugging methods daily
2. Apply kata-like precision to code refactoring
3. Meditate on Charter values before major decisions
4. Seek feedback from diverse perspectives (respecting others)

"Perfect practice makes perfect." - Applied to both martial arts and code.`;
          break;

        case 'dojo.faithful':
          response = `🥋 Faithfulness - Unwavering Commitment Metrics

COMMITMENT TRACKING:
├─ User Promise Fulfillment: 97.2% (Highly reliable)
├─ Charter Values Adherence: 100% (Unwavering)
├─ Ethical Principle Consistency: 96.8% (Strong foundation)
└─ Long-term Vision Alignment: 94.1% (Focused direction)

FAITHFULNESS DEMONSTRATIONS:
• 45 consecutive days of martial arts ethics integration
• Zero compromises on free speech protection
• Consistent application of dojo kun in all decisions
• Reliable trading agent performance with ethical boundaries

"Be faithful to your principles, especially when tested."`;
          break;

            default:
              response = analysis.educational_response;
          }
        }

        // Update the history with the final response
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = {
            input: cmd,
            output: response,
            type: securityEvent.type
          };
          return newHistory;
        });

      } catch (error) {
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = {
            input: cmd,
            output: `Error processing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
            type: 'educational'
          };
          return newHistory;
        });
      }
    }, 10); // Small delay to prevent blocking
  }, [analyzeCommand]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(command);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
    handleKeyDown(e);
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
              <div className="p-4 border-t border-cyan-500/30 relative">
                {/* AI Autocomplete Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute bottom-full left-4 right-4 mb-2 bg-black/90 border border-cyan-500/50 rounded-lg backdrop-blur-sm max-h-48 overflow-y-auto z-50">
                    <div className="p-2 border-b border-cyan-500/30">
                      <div className="text-xs text-cyan-400 font-mono">AI Autocomplete Suggestions</div>
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.command}
                        className={`p-3 border-b border-cyan-500/20 last:border-b-0 cursor-pointer transition-colors ${
                          index === selectedSuggestion 
                            ? 'bg-cyan-500/20 border-l-4 border-l-cyan-400' 
                            : 'hover:bg-cyan-500/10'
                        }`}
                        onClick={() => {
                          setCommand(suggestion.command);
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded text-xs font-mono ${
                              suggestion.category === 'dojo' ? 'bg-purple-500/20 text-purple-300' :
                              suggestion.category === 'trading' ? 'bg-green-500/20 text-green-300' :
                              suggestion.category === 'ai' ? 'bg-blue-500/20 text-blue-300' :
                              suggestion.category === 'security' ? 'bg-red-500/20 text-red-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {suggestion.category}
                            </span>
                            <span className="text-cyan-400 font-mono">{suggestion.command}</span>
                          </div>
                          <span className="text-xs text-gray-400">{Math.round(suggestion.confidence * 100)}%</span>
                        </div>
                        <div className="text-xs text-gray-300 mt-1 ml-16">{suggestion.description}</div>
                      </div>
                    ))}
                    <div className="p-2 text-xs text-gray-400 border-t border-cyan-500/30">
                      Use ↑↓ to navigate, Tab to complete, Esc to close
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-purple-400 font-mono text-sm">reverb256@quantum:</span>
                  <span className="text-white font-mono text-sm">~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={command}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 bg-transparent text-cyan-400 font-mono text-sm outline-none"
                    placeholder="Enter command... (AI autocomplete active)"
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

export default EnhancedConsole;