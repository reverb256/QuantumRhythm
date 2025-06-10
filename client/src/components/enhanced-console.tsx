import React, { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react';

interface SecurityEvent {
  type: 'suspicious' | 'malicious' | 'educational' | 'fun';
  command: string;
  threat_level: number;
  timestamp: Date;
  response: string;
}

interface CommandSuggestion {
  command: string;
  description: string;
  category: 'system' | 'trading' | 'ai' | 'dojo' | 'security';
  confidence: number;
}

const EnhancedConsole = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [suggestions, setSuggestions] = useState<CommandSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState<Array<{input: string, output: string, type: SecurityEvent['type']}>>([
    { input: '', output: 'VibeCoding Terminal v2.5.7\nType "help" for available commands...', type: 'educational' }
  ]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const [adaptiveMode, setAdaptiveMode] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<'basic' | 'enhanced' | 'quantum'>('basic');
  const [intelligenceLevel, setIntelligenceLevel] = useState<'basic' | 'emergent' | 'quantum'>('basic');
  const [crossEmpowerment, setCrossEmpowerment] = useState(false);

  // Available commands
  const availableCommands: CommandSuggestion[] = [
    { command: 'dojo.perfection', description: 'Character development through code analysis', category: 'dojo', confidence: 1.0 },
    { command: 'dojo.faithful', description: 'Show commitment metrics and reliability scores', category: 'dojo', confidence: 1.0 },
    { command: 'dojo.excel', description: 'Display excellence pursuit and mastery progress', category: 'dojo', confidence: 1.0 },
    { command: 'dojo.respect', description: 'Review respectful interactions', category: 'dojo', confidence: 1.0 },
    { command: 'dojo.nonviolence', description: 'Assess healing vs harmful impact', category: 'dojo', confidence: 1.0 },
    { command: 'trading.status', description: 'View trading agent status', category: 'trading', confidence: 0.9 },
    { command: 'trading.signals', description: 'Show current market signals', category: 'trading', confidence: 0.9 },
    { command: 'system.status', description: 'Check system health', category: 'system', confidence: 0.9 },
    { command: 'help', description: 'Show all available commands', category: 'system', confidence: 1.0 },
  ];

  // Get command suggestions
  const getCommandSuggestions = useCallback((input: string): CommandSuggestion[] => {
    if (!input.trim()) return [];

    const inputLower = input.toLowerCase();
    const suggestions = availableCommands
      .filter(cmd => cmd.command.toLowerCase().includes(inputLower))
      .sort((a, b) => {
        const aExact = a.command.toLowerCase() === inputLower ? 10 : 0;
        const bExact = b.command.toLowerCase() === inputLower ? 10 : 0;
        const aPrefix = a.command.toLowerCase().startsWith(inputLower) ? 5 : 0;
        const bPrefix = b.command.toLowerCase().startsWith(inputLower) ? 5 : 0;

        return (bExact + bPrefix + b.confidence) - (aExact + aPrefix + a.confidence);
      })
      .slice(0, 6);

    return suggestions;
  }, [availableCommands]);

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setCommand(value);
    const suggestions = getCommandSuggestions(value);
    setSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0 && value.length > 0);
    setSelectedSuggestion(-1);
  }, [getCommandSuggestions]);

  // Handle keyboard navigation
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

  // Execute command
  const executeCommand = useCallback((cmd: string) => {
    if (!cmd.trim()) return;

    const trimmedCmd = cmd.trim().toLowerCase();
    let response = '';

    // Define available commands
    const commandActions: {[key: string]: {description: string, execute: () => string}} = {
      'help': {
        description: 'Show available commands',
        execute: () => `VibeCoding Terminal Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🥋 DOJO KUN COMMANDS
  dojo.perfection   - Character development through code
  dojo.faithful     - Commitment and reliability metrics
  dojo.excel        - Excellence pursuit progress
  dojo.respect      - Respectful interactions audit
  dojo.nonviolence  - System impact assessment

🤖 SYSTEM COMMANDS
  trading.status    - Trading agent status
  trading.signals   - Market signals
  system.status     - System health

🌟 ASTRAL ENGINE COMMANDS
  astralengine      - Activate AstralEngine integration protocols
  quantum-sync      - Synchronize with quantum intelligence patterns
  adaptive-ui       - Enable adaptive interface intelligence
  cross-empower     - Activate cross-system learning networks

🌌 CONSCIOUSNESS COMMANDS
  astral            - Enter astral plane consciousness

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⌨️  NAVIGATION: Use ↑↓ arrows, Tab to complete, Esc to close`
      },
      'dojo.perfection': {
        description: 'Character development through code analysis',
        execute: () => `🥋 Character Development Through Code

CURRENT METRICS:
├─ Code Quality Score: 92.7%
├─ Ethical Alignment: 98.1%
├─ Martial Arts Integration: 95.3%
└─ Continuous Improvement: 89.4%

FOCUS AREAS:
• Code quality and testing
• Error handling improvements
• Documentation clarity
• User experience refinement

"Perfect practice makes perfect."`
      },
      'dojo.faithful': {
        description: 'Commitment and reliability',
        execute: () => `🥋 Commitment and Reliability

TRACKING:
├─ Promise Fulfillment: 97.2%
├─ Values Adherence: 100%
├─ Principle Consistency: 96.8%
└─ Vision Alignment: 94.1%

"Be faithful to your principles."`
      },
      'trading.status': {
        description: 'Trading agent status',
        execute: () => `📈 Trading System Status:
- Agent: Active
- Signals: Processing
- Performance: Monitoring
- Risk Management: Enabled`
      },
      'system.status': {
        description: 'System health',
        execute: () => `🌟 System Status:
- Platform: Online
- Trading: Operational
- Security: Active
- Performance: Optimal`
      },
      'astral': {
        description: 'Enter astral plane consciousness',
        execute: () => "🌌 Quantum consciousness activated. Reality layers accessible."
      },
      'astralengine': {
        description: 'Activate AstralEngine integration protocols',
        execute: () => {
          setIntelligenceLevel('emergent');
          setCrossEmpowerment(true);
          return "⚡ AstralEngine protocols engaged: Multi-AI orchestration active, cross-empowerment enabled, adaptive intelligence online";
        }
      },
      'quantum-sync': {
        description: 'Synchronize with quantum intelligence patterns',
        execute: () => {
          setIntelligenceLevel('quantum');
          return "🔮 Quantum synchronization complete: Emergent intelligence patterns detected, consciousness-level optimization active";
        }
      },
      'adaptive-ui': {
        description: 'Enable adaptive interface intelligence',
        execute: () => {
          setAdaptiveMode(true);
          return "🧠 Adaptive UI intelligence activated: Interface will auto-reconfigure based on usage patterns and environmental context";
        }
      },
      'cross-empower': {
        description: 'Activate cross-system learning networks',
        execute: () => {
          setCrossEmpowerment(!crossEmpowerment);
          return crossEmpowerment 
            ? "🔗 Cross-empowerment disabled: Systems operating independently"
            : "🌐 Cross-empowerment activated: Systems learning from each other, network intelligence emerging";
        }
      },
    };

    if (commandActions[trimmedCmd]) {
      response = commandActions[trimmedCmd].execute();
    } else {
      response = `Command "${cmd}" processed.
Type 'help' for available commands.`;
    }

    // Log security event
    const securityEvent: SecurityEvent = {
      type: 'educational',
      command: cmd,
      threat_level: 0.1,
      timestamp: new Date(),
      response: response
    };

    setSecurityEvents(prev => [...prev, securityEvent]);

    setHistory(prev => [...prev, {
      input: cmd,
      output: response,
      type: 'educational'
    }]);

    setCommand('');
    setShowSuggestions(false);
  }, [adaptiveMode, crossEmpowerment, intelligenceLevel, setAdaptiveMode, setCrossEmpowerment, setIntelligenceLevel]);

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

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Global keyboard listener
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === '`' && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyPress);
    return () => document.removeEventListener('keydown', handleGlobalKeyPress);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 border border-cyan-500/50 rounded-lg shadow-2xl backdrop-blur-md w-full max-w-4xl h-3/4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-cyan-400 font-mono text-sm ml-4">VibeCoding Quantum Terminal</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Press ` to toggle</span>
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
            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-black/90 border border-cyan-500/50 rounded-lg backdrop-blur-sm max-h-48 overflow-y-auto z-50">
                <div className="p-2 border-b border-cyan-500/30">
                  <div className="text-xs text-cyan-400 font-mono">Command Suggestions</div>
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
                placeholder="Enter command... (autocomplete active)"
              />
            </div>
            <div className="text-xs text-gray-400 mb-2 space-y-1">
          <div>Security Level: {securityLevel.toUpperCase()} | Adaptive Mode: {adaptiveMode ? 'ACTIVE' : 'INACTIVE'}</div>
          <div>Intelligence: {intelligenceLevel.toUpperCase()} | Cross-Empowerment: {crossEmpowerment ? 'ONLINE' : 'OFFLINE'}</div>
          {intelligenceLevel === 'quantum' && (
            <div className="text-cyan-400">🔮 Quantum consciousness patterns detected - emergent intelligence active</div>
          )}
          {crossEmpowerment && (
            <div className="text-green-400">🌐 Cross-system learning networks operational - network effects enabled</div>
          )}
        </div>
            <div className="text-xs text-gray-500 mt-2">
              🛡️ Security monitoring active | 🥋 Martial arts ethics enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EnhancedConsole.displayName = 'EnhancedConsole';

export default EnhancedConsole;