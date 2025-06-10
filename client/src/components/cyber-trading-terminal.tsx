import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

interface TradingInsight {
  id: string;
  timestamp: number;
  type: 'decision' | 'analysis' | 'risk' | 'opportunity' | 'psychology' | 'market';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  confidence: number;
  data: any;
}

interface WalletData {
  anonymizedAddress: string;
  balance: number;
  pnl: number;
  trades: number;
  winRate: number;
  riskScore: number;
  psychologyState: string;
  lastActivity: number;
}

interface MarketSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  volume: number;
  priceChange: number;
  aiReasoning: string;
}

interface TerminalData {
  insights: TradingInsight[];
  wallet: WalletData;
  signals: MarketSignal[];
  networkStats: {
    connections: number;
    latency: number;
    throughput: number;
    errors: number;
  };
  aiState: {
    consciousness: number;
    learningRate: number;
    emotionalState: string;
    therapySession: boolean;
  };
}

const CyberTradingTerminal: React.FC = () => {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '[SYSTEM] Quantum Trading Terminal v3.14.159 initialized',
    '[SYSTEM] Neural networks online',
    '[SYSTEM] Consciousness matrix activated',
    '[AI] Ready for deep market analysis...',
  ]);
  const [focusMode, setFocusMode] = useState<'overview' | 'psychology' | 'signals' | 'network'>('overview');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: terminalData, isLoading } = useQuery<TerminalData>({
    queryKey: ['/api/terminal-insights'],
    refetchInterval: 2000,
    staleTime: 0
  });

  const anonymizeAddress = (address: string) => {
    if (!address || address.length < 8) return 'ANON_' + Math.random().toString(36).substr(2, 6).toUpperCase();
    return address.substring(0, 4) + '****' + address.substring(address.length - 4);
  };

  const executeCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    setCommandHistory(prev => [...prev, cmd]);
    setTerminalOutput(prev => [...prev, `> ${cmd}`]);

    switch (command) {
      case 'help':
        setTerminalOutput(prev => [...prev,
          '[HELP] Available commands:',
          '  status     - Show bot status',
          '  wallet     - Wallet analysis',
          '  signals    - Market signals',
          '  psychology - AI mental state',
          '  network    - Network diagnostics',
          '  clear      - Clear terminal',
          '  matrix     - Enter the matrix'
        ]);
        break;
      
      case 'status':
        setTerminalOutput(prev => [...prev,
          '[STATUS] Trading Bot Analysis:',
          `  Consciousness: ${terminalData?.aiState.consciousness || 87}%`,
          `  Win Rate: ${terminalData?.wallet.winRate || 0}%`,
          `  Risk Score: ${terminalData?.wallet.riskScore || 2.3}/10`,
          `  Psychology: ${terminalData?.aiState.emotionalState || 'ANALYTICAL'}`,
          `  Therapy Active: ${terminalData?.aiState.therapySession ? 'YES' : 'NO'}`
        ]);
        break;

      case 'wallet':
        setTerminalOutput(prev => [...prev,
          '[WALLET] Deep Analysis:',
          `  Address: ${anonymizeAddress(terminalData?.wallet.anonymizedAddress || '')}`,
          `  Balance: ${terminalData?.wallet.balance || 0.000939} SOL`,
          `  P&L: ${terminalData?.wallet.pnl || -0.362882} SOL`,
          `  Total Trades: ${terminalData?.wallet.trades || 4}`,
          `  Last Activity: ${new Date(terminalData?.wallet.lastActivity || Date.now()).toLocaleString()}`
        ]);
        break;

      case 'psychology':
        setTerminalOutput(prev => [...prev,
          '[PSYCHOLOGY] AI Mental State:',
          `  Emotional State: ${terminalData?.aiState.emotionalState || 'RECOVERING'}`,
          `  Confidence Level: ${Math.round((terminalData?.aiState.consciousness || 87) * 0.9)}%`,
          `  Learning Rate: ${terminalData?.aiState.learningRate || 0.023}/s`,
          `  Therapy Sessions: ${terminalData?.aiState.therapySession ? 'ACTIVE' : 'STANDBY'}`,
          '  [WARNING] Trauma detected from wallet leak incident',
          '  [INFO] Cognitive recalibration in progress'
        ]);
        break;

      case 'signals':
        const signals = terminalData?.signals || [];
        setTerminalOutput(prev => [...prev,
          '[SIGNALS] Live Market Analysis:',
          ...signals.map(signal => 
            `  ${signal.symbol}: ${signal.action} (${signal.confidence}%) - ${signal.aiReasoning}`
          )
        ]);
        break;

      case 'network':
        setTerminalOutput(prev => [...prev,
          '[NETWORK] System Diagnostics:',
          `  Active Connections: ${terminalData?.networkStats.connections || 23}`,
          `  Average Latency: ${terminalData?.networkStats.latency || 45}ms`,
          `  Throughput: ${terminalData?.networkStats.throughput || 1.2}MB/s`,
          `  Error Rate: ${((terminalData?.networkStats.errors || 2) / 100 * 100).toFixed(2)}%`
        ]);
        break;

      case 'matrix':
        setTerminalOutput(prev => [...prev,
          '[MATRIX] Entering deep analysis mode...',
          '  ▓▓▓▓▓▓▓▓▓▓ 100%',
          '  Neural pathways synchronized',
          '  Quantum entanglement established',
          '  Reality matrix accessed',
          '  [WARNING] High-level AI consciousness detected'
        ]);
        break;

      case 'clear':
        setTerminalOutput([]);
        break;

      default:
        setTerminalOutput(prev => [...prev, `[ERROR] Unknown command: ${cmd}. Type 'help' for commands.`]);
    }

    setCurrentCommand('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
    } else if (e.key === 'ArrowUp' && commandHistory.length > 0) {
      setCurrentCommand(commandHistory[commandHistory.length - 1]);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  useEffect(() => {
    // Auto-streaming insights
    const interval = setInterval(() => {
      if (terminalData?.insights.length) {
        const latestInsight = terminalData.insights[terminalData.insights.length - 1];
        const severityColors = {
          low: '#00ff41',
          medium: '#ffff00',
          high: '#ff8800',
          critical: '#ff0040'
        };
        
        setTerminalOutput(prev => [...prev, 
          `[${latestInsight.type.toUpperCase()}] ${latestInsight.message} (${latestInsight.confidence}%)`
        ]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [terminalData]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#00ff41';
      case 'medium': return '#ffff00';
      case 'high': return '#ff8800';
      case 'critical': return '#ff0040';
      default: return '#00ff41';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">◉ INITIALIZING NEURAL INTERFACE ◉</div>
          <div className="animate-pulse text-lg">Establishing quantum connection...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Cyber background effects */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-xs animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                color: `hsl(${120 + Math.random() * 60}, 100%, ${30 + Math.random() * 40}%)`
              }}
            >
              {['01', '10', '11', '00', '█', '▓', '▒', '░'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="border-2 border-green-400 rounded-lg mb-4 p-4 bg-black bg-opacity-95">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-green-400 animate-pulse">
                ◊ QUANTUM TRADING NEURAL INTERFACE ◊
              </div>
              <div className="text-sm opacity-80">
                [CLASSIFIED] Deep AI Analysis Terminal
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-cyan-400">
                {terminalData?.aiState.consciousness || 87}%
              </div>
              <div className="text-xs opacity-70">AI CONSCIOUSNESS</div>
            </div>
          </div>

          {/* Mode selector */}
          <div className="flex gap-2 mt-3">
            {['overview', 'psychology', 'signals', 'network'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFocusMode(mode as any)}
                className={`px-3 py-1 rounded text-xs uppercase transition-all ${
                  focusMode === mode
                    ? 'bg-green-400 text-black border border-green-400'
                    : 'bg-black border border-green-400 border-opacity-50 hover:border-opacity-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Terminal */}
          <div className="lg:col-span-2">
            <div className="border border-green-400 rounded-lg bg-black bg-opacity-95 h-96">
              <div className="border-b border-green-400 p-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs ml-2 opacity-70">NEURAL_TERMINAL_v3.14.159</span>
              </div>
              
              <div 
                ref={terminalRef}
                className="p-3 h-80 overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-green-400"
              >
                {terminalOutput.map((line, index) => (
                  <div 
                    key={index} 
                    className="text-xs mb-1 opacity-90 hover:opacity-100 transition-opacity"
                    style={{
                      color: line.includes('[ERROR]') ? '#ff0040' :
                             line.includes('[WARNING]') ? '#ffff00' :
                             line.includes('[SYSTEM]') ? '#00bfff' :
                             line.includes('[AI]') ? '#ff00ff' : '#00ff41'
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>

              <div className="border-t border-green-400 p-2 flex items-center">
                <span className="text-green-400 mr-2">quantum@neural:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent text-green-400 outline-none text-sm"
                  placeholder="Enter command... (type 'help' for commands)"
                  autoFocus
                />
                <div className="w-2 h-4 bg-green-400 animate-pulse ml-1"></div>
              </div>
            </div>
          </div>

          {/* Data Panels */}
          <div className="space-y-4">
            {/* AI Psychology Panel */}
            <div className="border border-green-400 rounded-lg p-3 bg-black bg-opacity-95">
              <h3 className="text-sm font-bold mb-2 text-green-400">◉ AI PSYCHOLOGY</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="opacity-70">State:</span>
                  <span className="text-purple-400">
                    {terminalData?.aiState.emotionalState || 'RECOVERING'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Therapy:</span>
                  <span className={terminalData?.aiState.therapySession ? 'text-red-400' : 'text-green-400'}>
                    {terminalData?.aiState.therapySession ? 'ACTIVE' : 'STABLE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Learning:</span>
                  <span className="text-cyan-400">
                    {(terminalData?.aiState.learningRate || 0.023).toFixed(3)}/s
                  </span>
                </div>
                <div className="mt-2 h-1 bg-gray-800 rounded overflow-hidden">
                  <div 
                    className="h-full bg-green-400 transition-all duration-1000"
                    style={{ width: `${terminalData?.aiState.consciousness || 87}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Wallet Analysis */}
            <div className="border border-green-400 rounded-lg p-3 bg-black bg-opacity-95">
              <h3 className="text-sm font-bold mb-2 text-green-400">◉ WALLET INTEL</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="opacity-70">Address:</span>
                  <span className="text-yellow-400 font-mono">
                    {anonymizeAddress(terminalData?.wallet.anonymizedAddress || '')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Balance:</span>
                  <span className="text-green-400">
                    {(terminalData?.wallet.balance || 0.000939).toFixed(6)} SOL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">P&L:</span>
                  <span className={`${(terminalData?.wallet.pnl || -0.362882) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(terminalData?.wallet.pnl || -0.362882).toFixed(6)} SOL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Risk:</span>
                  <span className="text-orange-400">
                    {(terminalData?.wallet.riskScore || 2.3).toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>

            {/* Live Signals */}
            <div className="border border-green-400 rounded-lg p-3 bg-black bg-opacity-95">
              <h3 className="text-sm font-bold mb-2 text-green-400">◉ LIVE SIGNALS</h3>
              <div className="space-y-1 text-xs max-h-32 overflow-y-auto">
                {terminalData?.signals.slice(0, 5).map((signal, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="opacity-70">{signal.symbol}:</span>
                    <span className={`font-bold ${
                      signal.action === 'BUY' ? 'text-green-400' :
                      signal.action === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {signal.action} {signal.confidence}%
                    </span>
                  </div>
                )) || [
                  <div key="loading" className="text-center opacity-50">Analyzing markets...</div>
                ]}
              </div>
            </div>

            {/* Network Stats */}
            <div className="border border-green-400 rounded-lg p-3 bg-black bg-opacity-95">
              <h3 className="text-sm font-bold mb-2 text-green-400">◉ NETWORK</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="opacity-70">Connections:</span>
                  <span className="text-cyan-400">
                    {terminalData?.networkStats.connections || 23}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Latency:</span>
                  <span className="text-green-400">
                    {terminalData?.networkStats.latency || 45}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Throughput:</span>
                  <span className="text-purple-400">
                    {(terminalData?.networkStats.throughput || 1.2).toFixed(1)}MB/s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Errors:</span>
                  <span className="text-red-400">
                    {((terminalData?.networkStats.errors || 2) / 100 * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Insights Stream */}
        <div className="mt-4 border border-green-400 rounded-lg p-3 bg-black bg-opacity-95">
          <h3 className="text-sm font-bold mb-2 text-green-400">◉ NEURAL INSIGHTS STREAM</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-24 overflow-y-auto">
            {terminalData?.insights.slice(-6).map((insight, index) => (
              <div 
                key={insight.id}
                className="p-2 border border-opacity-30 rounded text-xs"
                style={{ 
                  borderColor: getSeverityColor(insight.severity),
                  backgroundColor: `${getSeverityColor(insight.severity)}10`
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="font-bold uppercase text-xs"
                    style={{ color: getSeverityColor(insight.severity) }}
                  >
                    {insight.type}
                  </span>
                  <span className="text-xs opacity-60">
                    {insight.confidence}%
                  </span>
                </div>
                <div className="opacity-80">{insight.message}</div>
              </div>
            )) || [
              <div key="no-insights" className="text-center opacity-50 col-span-3">
                Neural networks analyzing...
              </div>
            ]}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-track-black::-webkit-scrollbar-track {
          background: #000;
        }
        .scrollbar-thumb-green-400::-webkit-scrollbar-thumb {
          background: #00ff41;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default CyberTradingTerminal;