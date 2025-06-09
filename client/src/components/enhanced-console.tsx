import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsoleCommand {
  command: string;
  output: string | JSX.Element;
  type: 'info' | 'success' | 'error' | 'warning' | 'fun';
}

interface EnhancedConsoleProps {
  isVisible: boolean;
  onClose: () => void;
  initialCommands?: ConsoleCommand[];
}

const defaultCommands: ConsoleCommand[] = [
  {
    command: 'whoami',
    output: 'reverb@quantumrhythm:~$ Consciousness Architect & AI Collaborator',
    type: 'info'
  },
  {
    command: 'ls -la ~/skills',
    output: `total 42
drwxr-xr-x  8 reverb staff   256 Dec 2024 ./
drwxr-xr-x 15 reverb staff   480 Dec 2024 ../
-rw-r--r--  1 reverb staff  4320 Dec 2024 react.tsx
-rw-r--r--  1 reverb staff  3840 Dec 2024 node.js
-rw-r--r--  1 reverb staff  2890 Dec 2024 fighting-games.dat
-rw-r--r--  1 reverb staff  1337 Dec 2024 proxmox-cluster.yml
-rw-r--r--  1 reverb staff   999 Dec 2024 consciousness.ai`,
    type: 'info'
  },
  {
    command: 'cat ~/.vibe_profile',
    output: `# VibeCoding Configuration
CONSCIOUSNESS_LEVEL=quantum
PIZZA_KITCHEN_EXPERIENCE=authentic
QUANTUM_PARTICLES=enabled
GLASSMORPHISM=true
SPECTRUM_HARMONY=prismatic
AI_COLLABORATION=sovereign`,
    type: 'success'
  },
  {
    command: 'ps aux | grep inspiration',
    output: 'reverb    1337  0.0  42.0  ∞MB   ∞MB  ??  R     0:00.01 consciousness-architecture.exe',
    type: 'fun'
  }
];

const funCommands: Record<string, ConsoleCommand> = {
  'help': {
    command: 'help',
    output: `Available commands:
help           - Show this help message
clear          - Clear console
whoami         - Display user info
ls             - List directory contents
cat <file>     - Display file contents
ps             - Show running processes
top            - Display system resources
exit           - Close console
konami         - 🎮 Try the Konami code
hack           - 💻 Initiate quantum hack
vibe           - 🌈 Check current vibe level`,
    type: 'info'
  },
  'clear': {
    command: 'clear',
    output: '',
    type: 'info'
  },
  'konami': {
    command: 'konami',
    output: '🎮 Konami Code activated! +30 lives, infinite ammo, and extra quantum particles enabled.',
    type: 'fun'
  },
  'hack': {
    command: 'hack',
    output: `Initiating quantum hack sequence...
[████████████████████████████████] 100%
Access granted to The Matrix.
Neo, is that you?`,
    type: 'success'
  },
  'vibe': {
    command: 'vibe',
    output: `Current Vibe Status:
🌈 Quantum Harmony: ████████████ 100%
💎 Crystal Clarity: ████████████ 100%
⚡ Energy Flow:     ████████████ 100%
🎵 Rhythm Sync:    ████████████ 100%

Status: TRANSCENDENT CONSCIOUSNESS ACHIEVED`,
    type: 'success'
  },
  'top': {
    command: 'top',
    output: `PID    COMMAND         %CPU  %MEM
1337   consciousness    99.9  42.0
2890   fighting-games   15.2   8.1
4320   vrchat-research  12.3   6.2
1234   proxmox-cluster   8.7   4.3
9999   quantum-vibe      ∞.∞   ∞.∞`,
    type: 'info'
  },
  'exit': {
    command: 'exit',
    output: 'logout\nConnection to quantum realm closed.',
    type: 'info'
  }
};

export default function EnhancedConsole({ isVisible, onClose, initialCommands = defaultCommands }: EnhancedConsoleProps) {
  const [commands, setCommands] = useState<ConsoleCommand[]>(initialCommands);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commands]);

  const handleCommand = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    
    if (trimmedInput === 'clear') {
      setCommands([]);
      return;
    }

    if (trimmedInput === 'exit') {
      onClose();
      return;
    }

    const newCommand: ConsoleCommand = {
      command: input,
      output: '',
      type: 'info'
    };

    if (funCommands[trimmedInput]) {
      newCommand.output = funCommands[trimmedInput].output;
      newCommand.type = funCommands[trimmedInput].type;
    } else if (trimmedInput.startsWith('cat ')) {
      const file = trimmedInput.substring(4);
      newCommand.output = `cat: ${file}: No such file or directory (try exploring the site instead!)`;
      newCommand.type = 'error';
    } else if (trimmedInput.startsWith('ls')) {
      newCommand.output = `projects/    skills/    values/    vrchat/    consciousness/
Use navigation menu to explore these directories!`;
      newCommand.type = 'info';
    } else {
      newCommand.output = `Command '${input}' not found. Type 'help' for available commands.`;
      newCommand.type = 'error';
    }

    setCommands(prev => [...prev, newCommand]);
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentInput.trim()) {
        handleCommand(currentInput);
        setCurrentInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  const getOutputColor = (type: ConsoleCommand['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'fun': return 'text-purple-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="w-full max-w-4xl h-96 bg-black/95 backdrop-blur-xl border border-cyan-400/30 rounded-xl shadow-2xl shadow-cyan-400/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Console Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-400/30">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-cyan-400 font-mono text-sm">reverb@quantumrhythm:~$</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Console Output */}
            <div
              ref={outputRef}
              className="h-72 p-4 overflow-y-auto font-mono text-sm scrollbar-thin scrollbar-thumb-cyan-400/30 scrollbar-track-transparent"
            >
              {commands.map((cmd, index) => (
                <div key={index} className="mb-2">
                  <div className="text-green-400">
                    <span className="text-cyan-400">reverb@quantumrhythm:~$</span> {cmd.command}
                  </div>
                  <div className={`${getOutputColor(cmd.type)} whitespace-pre-wrap`}>
                    {cmd.output}
                  </div>
                </div>
              ))}
              
              {/* Current Input Line */}
              <div className="flex items-center">
                <span className="text-cyan-400 mr-2">reverb@quantumrhythm:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-transparent text-green-400 outline-none"
                  placeholder="Type 'help' for commands..."
                />
                <span className="text-green-400 animate-pulse">|</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}