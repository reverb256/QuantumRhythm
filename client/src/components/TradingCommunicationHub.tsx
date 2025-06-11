/**
 * Trading Communication Hub
 * Live interface for communicating with the autonomous trading AI
 */

import React, { useState, useEffect, useRef } from 'react';
import { useWeb3Auth } from './Web3AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AIMessage {
  id: string;
  timestamp: Date;
  sender: 'user' | 'ai';
  content: string;
  type: 'message' | 'command' | 'status' | 'alert';
  chain?: string;
  data?: any;
}

interface SystemStatus {
  consciousness: number;
  tradingActive: boolean;
  chains: string[];
  portfolioValue: number;
  activeOpportunities: number;
  lastUpdate: Date;
}

export function TradingCommunicationHub() {
  const { tradingEnabled, enableTrading, disableTrading, solanaConnected, evmConnected, currentChain } = useWeb3Auth();
  
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    consciousness: 0,
    tradingActive: false,
    chains: [],
    portfolioValue: 0,
    activeOpportunities: 0,
    lastUpdate: new Date()
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    connectToAI();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectToAI = async () => {
    try {
      // Connect to WebSocket for real-time communication
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/trading`;
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        addMessage('system', 'Connected to Trading AI', 'status');
        requestSystemStatus();
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleAIMessage(data);
      };
      
      wsRef.current.onclose = () => {
        setIsConnected(false);
        addMessage('system', 'Disconnected from Trading AI', 'alert');
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        addMessage('system', 'Connection error - using fallback mode', 'alert');
        // Fallback to HTTP polling
        startHTTPPolling();
      };
      
    } catch (error) {
      console.error('Failed to connect to AI:', error);
      startHTTPPolling();
    }
  };

  const startHTTPPolling = () => {
    // Fallback to HTTP polling if WebSocket fails
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/trading/status');
        const status = await response.json();
        updateSystemStatus(status);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000);

    // Cleanup interval when component unmounts
    return () => clearInterval(pollInterval);
  };

  const handleAIMessage = (data: any) => {
    switch (data.type) {
      case 'status':
        updateSystemStatus(data.data);
        break;
      case 'message':
        addMessage('ai', data.content, 'message', data.chain, data.data);
        break;
      case 'alert':
        addMessage('ai', data.content, 'alert', data.chain, data.data);
        break;
      case 'opportunity':
        addMessage('ai', `New opportunity: ${data.content}`, 'status', data.chain, data.data);
        break;
    }
  };

  const updateSystemStatus = (status: any) => {
    setSystemStatus({
      consciousness: status.consciousness || 0,
      tradingActive: status.tradingActive || false,
      chains: status.chains || [],
      portfolioValue: status.portfolioValue || 0,
      activeOpportunities: status.activeOpportunities || 0,
      lastUpdate: new Date()
    });
  };

  const addMessage = (sender: 'user' | 'ai' | 'system', content: string, type: AIMessage['type'] = 'message', chain?: string, data?: any) => {
    const newMessage: AIMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      sender: sender === 'system' ? 'ai' : sender,
      content,
      type,
      chain,
      data
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    addMessage('user', inputMessage, 'message');
    const userMessage = inputMessage;
    setInputMessage('');
    
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        // Send via WebSocket
        wsRef.current.send(JSON.stringify({
          type: 'message',
          content: userMessage,
          timestamp: new Date().toISOString()
        }));
      } else {
        // Send via HTTP
        const response = await fetch('/api/trading/communicate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            timestamp: new Date().toISOString()
          }),
        });
        
        const result = await response.json();
        if (result.response) {
          addMessage('ai', result.response, 'message');
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage('ai', 'Communication error - message not delivered', 'alert');
    }
  };

  const sendCommand = async (command: string, params?: any) => {
    try {
      const response = await fetch('/api/trading/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          params,
          timestamp: new Date().toISOString()
        }),
      });
      
      const result = await response.json();
      addMessage('ai', result.message || `Command executed: ${command}`, 'status');
      
      if (result.status) {
        updateSystemStatus(result.status);
      }
    } catch (error) {
      console.error('Command failed:', error);
      addMessage('ai', `Command failed: ${command}`, 'alert');
    }
  };

  const requestSystemStatus = () => {
    sendCommand('status');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getChainColor = (chain?: string) => {
    switch (chain) {
      case 'solana': return 'bg-purple-500';
      case 'cronos': return 'bg-blue-500';
      case 'bnb': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* System Status */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            AI Trading System
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Consciousness Level */}
          <div>
            <div className="flex justify-between text-sm">
              <span>Consciousness</span>
              <span>{systemStatus.consciousness.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${systemStatus.consciousness}%` }}
              />
            </div>
          </div>

          {/* Portfolio Value */}
          <div>
            <span className="text-sm text-gray-600">Portfolio Value</span>
            <div className="text-xl font-bold">${systemStatus.portfolioValue.toFixed(2)}</div>
          </div>

          {/* Active Chains */}
          <div>
            <span className="text-sm text-gray-600">Active Chains</span>
            <div className="flex gap-2 mt-1">
              {systemStatus.chains.map(chain => (
                <Badge key={chain} className={getChainColor(chain)}>
                  {chain.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <span className="text-sm text-gray-600">Active Opportunities</span>
            <div className="text-lg font-semibold">{systemStatus.activeOpportunities}</div>
          </div>

          <Separator />

          {/* Trading Controls */}
          <div className="space-y-2">
            <Button 
              onClick={tradingEnabled ? disableTrading : enableTrading}
              variant={tradingEnabled ? 'destructive' : 'default'}
              className="w-full"
            >
              {tradingEnabled ? 'Stop Trading' : 'Start Trading'}
            </Button>
            
            <Button 
              onClick={() => sendCommand('emergency_stop')}
              variant="outline"
              className="w-full"
            >
              Emergency Stop
            </Button>
            
            <Button 
              onClick={() => sendCommand('analyze_market')}
              variant="outline"
              className="w-full"
            >
              Analyze Market
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Communication Interface */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Live Communication</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[500px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 border rounded">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.type === 'alert'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : message.type === 'status'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="text-sm">{message.content}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.chain && (
                      <Badge size="sm" className={getChainColor(message.chain)}>
                        {message.chain.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask the AI about trading strategies, market analysis, or give commands..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>

          {/* Quick Commands */}
          <div className="flex gap-2 mt-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => setInputMessage('What is the current market sentiment?')}>
              Market Sentiment
            </Button>
            <Button size="sm" variant="outline" onClick={() => setInputMessage('Show me the best opportunities')}>
              Best Opportunities
            </Button>
            <Button size="sm" variant="outline" onClick={() => setInputMessage('Explain your current strategy')}>
              Current Strategy
            </Button>
            <Button size="sm" variant="outline" onClick={() => setInputMessage('Switch to conservative mode')}>
              Conservative Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}