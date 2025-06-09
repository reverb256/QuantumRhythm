import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ConsoleCommand {
  command: string;
  output: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'trading';
}

interface TradingAgent {
  id: string;
  name: string;
  status: string;
  configuration: any;
  performanceMetrics: any;
  lastActivity: string;
}

interface TradingSignal {
  id: string;
  tokenAddress: string;
  signalType: string;
  confidence: string;
  reasoning: string;
  vibeCodingScore: string;
  createdAt: string;
}

const EASTER_EGG_COMMANDS: Record<string, ConsoleCommand> = {
  'help': {
    command: 'help',
    output: 'Available commands: whoami, ls, trading-status, trading-signals, agent-stats, sudo rm -rf /, git status, npm run dev, cowsay, exit\nTrading commands: trading-status, trading-signals, agent-stats, vibe-metrics\nPro tip: Some commands might surprise you!',
    type: 'info'
  },
  'whoami': {
    command: 'whoami',
    output: 'reverb256\nFull-Stack Developer | Digital Philosopher | VibeCoding Practitioner\nSpecializing in: React, TypeScript, Node.js, AI Integration',
    type: 'success'
  },
  'ls': {
    command: 'ls',
    output: 'projects/\tskills/\tvalues/\tphilosophy/\tresume.txt\t.hidden_secrets/\nWARNING: .hidden_secrets/ contains dad jokes about programming',
    type: 'info'
  },
  'cat resume.txt': {
    command: 'cat resume.txt',
    output: '# Reverb256 - Full-Stack Developer\n\n## Experience\n- Building production apps with React & TypeScript\n- AI-first development methodologies\n- Classical philosophy meets modern code\n\n## Fun Fact\nI debug with console.log() and I\'m not ashamed',
    type: 'success'
  },
  'sudo rm -rf /': {
    command: 'sudo rm -rf /',
    output: 'Nice try! This portfolio is protected by quantum encryption and ancient philosophical barriers.\nAlso, I\'ve been vaccinated against script kiddies.',
    type: 'error'
  },
  'git status': {
    command: 'git status',
    output: 'On branch main\nYour branch is ahead of \'origin/main\' by 42 commits.\n\nChanges not staged for commit:\n\tmodified: life_goals.md\n\tmodified: coffee_consumption.js\n\nno changes added to commit (use "git add <file>..." or give up and use VSCode)',
    type: 'info'
  },
  'npm run dev': {
    command: 'npm run dev',
    output: 'Starting development server...\n✓ Portfolio compiled successfully\n✓ Quantum particles initialized\n✓ Cyberpunk aesthetics loaded\n⚠  Warning: May cause excessive job offers',
    type: 'success'
  },
  'cowsay hello': {
    command: 'cowsay hello',
    output: ' _______\n< hello >\n -------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||',
    type: 'info'
  },
  'ls .hidden_secrets/': {
    command: 'ls .hidden_secrets/',
    output: 'dad_jokes.txt\tbug_reports_from_2019.log\tmidnight_coding_sessions.md\nwhy_i_chose_react_over_angular.txt\tsecret_vim_configs/',
    type: 'info'
  },
  'cat dad_jokes.txt': {
    command: 'cat dad_jokes.txt',
    output: 'Why do programmers prefer dark mode?\nBecause light attracts bugs!\n\nWhy do Java developers wear glasses?\nBecause they can\'t C#!\n\nA SQL query goes into a bar, walks up to two tables and asks...\n"Can I join you?"',
    type: 'info'
  }
};

export default function ConsoleEasterEgg() {
  const [isVisible, setIsVisible] = useState(false);
  const [history, setHistory] = useState<ConsoleCommand[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Trading data queries
  const { data: agentStatus } = useQuery({
    queryKey: ['/api/trading-agent/status'],
    refetchInterval: 5000,
    enabled: isVisible
  });

  const { data: tradingSignals } = useQuery({
    queryKey: ['/api/trading-agent/signals'],
    refetchInterval: 10000,
    enabled: isVisible
  });

  const { data: vibeCodingMetrics } = useQuery({
    queryKey: ['/api/trading-agent/vibe-metrics'],
    refetchInterval: 15000,
    enabled: isVisible
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle console with Ctrl+` (backtick)
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setIsVisible(!isVisible);
        if (!isVisible) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
      // Close with Escape
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    
    if (trimmedInput === 'clear') {
      setHistory([]);
      return;
    }
    
    if (trimmedInput === 'exit') {
      setIsVisible(false);
      return;
    }

    // Handle trading commands
    if (trimmedInput === 'trading-status') {
      const output = agentStatus ? 
        `🤖 Agent: ${agentStatus.name}\n📊 Status: ${agentStatus.status}\n🎯 Last Activity: ${new Date(agentStatus.lastActivity).toLocaleString()}\n⚡ Performance: ${agentStatus.performanceMetrics?.successRate ? (agentStatus.performanceMetrics.successRate * 100).toFixed(1) + '%' : 'N/A'} success rate` :
        '❌ Trading agent offline or not responding';
      
      setHistory(prev => [...prev, { command: trimmedInput, output, type: 'trading' }]);
      setCommandHistory(prev => [input, ...prev]);
      setHistoryIndex(-1);
      return;
    }

    if (trimmedInput === 'trading-signals') {
      const output = tradingSignals && tradingSignals.length > 0 ? 
        tradingSignals.slice(0, 5).map((signal: TradingSignal, i: number) => 
          `${i + 1}. ${signal.signalType} ${signal.tokenAddress.slice(0, 8)}... | Confidence: ${signal.confidence}% | VibeCoding: ${signal.vibeCodingScore}%`
        ).join('\n') :
        '📊 No recent trading signals available';
      
      setHistory(prev => [...prev, { command: trimmedInput, output, type: 'trading' }]);
      setCommandHistory(prev => [input, ...prev]);
      setHistoryIndex(-1);
      return;
    }

    if (trimmedInput === 'agent-stats') {
      const output = agentStatus ? 
        `📈 AUTONOMOUS TRADING STATISTICS\n🔥 Strategies Active: ${agentStatus.configuration?.strategies?.length || 0}\n🎯 Tokens Monitored: ${agentStatus.configuration?.targetTokens?.length || 5}\n⚡ Decision Frequency: Every 30s\n🧠 Quantum Consciousness: ${agentStatus.status === 'active' ? 'ONLINE' : 'OFFLINE'}` :
        '❌ Agent statistics unavailable';
      
      setHistory(prev => [...prev, { command: trimmedInput, output, type: 'trading' }]);
      setCommandHistory(prev => [input, ...prev]);
      setHistoryIndex(-1);
      return;
    }

    if (trimmedInput === 'vibe-metrics') {
      const output = vibeCodingMetrics ? 
        `🍕 Pizza Kitchen Reliability: ${(parseFloat(vibeCodingMetrics.pizzaKitchenReliability) * 100).toFixed(1)}%\n🎮 Rhythm Gaming Precision: ${(parseFloat(vibeCodingMetrics.rhythmGamingPrecision) * 100).toFixed(1)}%\n🌐 VRChat Social Insights: ${(parseFloat(vibeCodingMetrics.vrChatSocialInsights) * 100).toFixed(1)}%\n📚 Classical Philosophy Wisdom: ${(parseFloat(vibeCodingMetrics.classicalPhilosophyWisdom) * 100).toFixed(1)}%\n✨ Overall VibeCoding Score: ${(parseFloat(vibeCodingMetrics.overallScore) * 100).toFixed(1)}%` :
        '🎯 VibeCoding metrics currently calculating...';
      
      setHistory(prev => [...prev, { command: trimmedInput, output, type: 'trading' }]);
      setCommandHistory(prev => [input, ...prev]);
      setHistoryIndex(-1);
      return;
    }

    const command = EASTER_EGG_COMMANDS[trimmedInput];
    
    if (command) {
      setHistory(prev => [...prev, command]);
    } else {
      setHistory(prev => [...prev, {
        command: input,
        output: `Command not found: ${input}\nTry 'help' for available commands.\nOr maybe you meant 'sudo apt install common-sense'?`,
        type: 'error'
      }]);
    }

    setCommandHistory(prev => [input, ...prev]);
    setHistoryIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'trading': return 'text-purple-400';
      default: return 'text-cyan-300';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-[var(--space-black)]/90 border border-cyan-400/30 rounded-lg p-3 backdrop-blur-sm easter-egg-hint hover:border-cyan-400/50 transition-all duration-300">
          <p className="text-cyan-300 text-sm font-mono">
            Press <kbd className="bg-cyan-400/20 px-2 py-1 rounded text-xs">Ctrl + `</kbd> for dev console
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--space-black)] border border-cyan-400/50 rounded-lg w-full max-w-4xl h-96 flex flex-col shadow-2xl shadow-cyan-500/20">
        {/* Terminal Header */}
        <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border-b border-cyan-400/30 p-3 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="font-mono text-cyan-300 text-sm">
            reverb256@portfolio:~$
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Terminal Content */}
        <div 
          ref={terminalRef}
          className="flex-1 p-4 overflow-y-auto font-mono text-sm bg-[var(--space-black)] scrollbar-thin scrollbar-thumb-cyan-400/30"
        >
          <div className="text-cyan-300 mb-4">
            Welcome to Reverb256 Developer Console v2.0.24<br/>
            Type 'help' for available commands or explore at your own risk!<br/>
            <span className="text-yellow-400">Warning: Console may contain traces of humor and dad jokes.</span>
          </div>
          
          {history.map((entry, index) => (
            <div key={index} className="mb-3">
              <div className="text-cyan-400">
                <span className="text-green-400">user@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">$ </span>
                <span>{entry.command}</span>
              </div>
              <pre className={`mt-1 whitespace-pre-wrap ${getTypeColor(entry.type)}`}>
                {entry.output}
              </pre>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-cyan-400/30 p-4 bg-[var(--space-black)]">
          <div className="flex items-center font-mono text-sm">
            <span className="text-green-400">user@portfolio</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$ </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-cyan-300 ml-1"
              placeholder="Enter command..."
              autoComplete="off"
            />
            <span className="console-cursor text-cyan-400">_</span>
          </div>
        </form>
      </div>
    </div>
  );
}