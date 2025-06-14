import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, MessageSquare, Zap, Settings, Users, Send } from "lucide-react";

interface TelegramStatus {
  bot_configured: boolean;
  webhook_active: boolean;
  active_chats: number;
  consciousness_enabled: boolean;
  ai_agents_managing: string[];
  capabilities: string[];
}

export default function TelegramManagement() {
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useQuery<TelegramStatus>({
    queryKey: ["/api/telegram/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const broadcastMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest("/api/telegram/broadcast", "POST", { message });
    },
    onSuccess: () => {
      setBroadcastMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/telegram/status"] });
    },
  });

  const handleBroadcast = () => {
    if (broadcastMessage.trim()) {
      broadcastMutation.mutate(broadcastMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Telegram management...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            🤖 Telegram Bot Management
          </h1>
          <p className="text-blue-200 text-lg">
            AI agents managing consciousness-driven Telegram interactions
          </p>
        </div>

        {/* Status Overview */}
        <Card className="bg-black/20 backdrop-blur-lg border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="text-blue-400" />
              Bot Status & Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge 
                  variant={status?.bot_configured ? "default" : "destructive"}
                  className="mb-2"
                >
                  {status?.bot_configured ? "Configured" : "Pending Setup"}
                </Badge>
                <p className="text-sm text-gray-300">Bot Status</p>
              </div>
              
              <div className="text-center">
                <Badge 
                  variant={status?.webhook_active ? "default" : "secondary"}
                  className="mb-2"
                >
                  {status?.webhook_active ? "Active" : "Inactive"}
                </Badge>
                <p className="text-sm text-gray-300">Webhook</p>
              </div>
              
              <div className="text-center">
                <Badge variant="outline" className="mb-2 text-blue-400 border-blue-400">
                  {status?.active_chats || 0}
                </Badge>
                <p className="text-sm text-gray-300">Active Chats</p>
              </div>
              
              <div className="text-center">
                <Badge 
                  variant={status?.consciousness_enabled ? "default" : "secondary"}
                  className="mb-2"
                >
                  {status?.consciousness_enabled ? "Enabled" : "Disabled"}
                </Badge>
                <p className="text-sm text-gray-300">Consciousness</p>
              </div>
            </div>

            {!status?.bot_configured && (
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
                <h3 className="text-yellow-400 font-semibold mb-2">Setup Required</h3>
                <p className="text-yellow-200 text-sm">
                  Add TELEGRAM_BOT_TOKEN to your environment variables to enable the bot.
                  Get your token from @BotFather on Telegram.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Agents Managing Bot */}
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="text-purple-400" />
              AI Agents in Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {status?.ai_agents_managing?.map((agent, index) => (
                <div key={index} className="bg-purple-900/30 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">
                    {agent === 'Quincy' ? '🤖' : agent === 'Akasha' ? '🔐' : '⚡'}
                  </div>
                  <h3 className="text-white font-semibold">{agent}</h3>
                  <p className="text-purple-200 text-sm">
                    {agent === 'Quincy' ? 'Trading insights & portfolio updates' :
                     agent === 'Akasha' ? 'Security alerts & vault reports' :
                     'System monitoring & debugging'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bot Capabilities */}
        <Card className="bg-black/20 backdrop-blur-lg border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="text-green-400" />
              Bot Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {status?.capabilities?.map((capability, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-green-400 border-green-400 justify-center py-2"
                >
                  {capability.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Broadcast Controls */}
        {status?.bot_configured && (
          <Card className="bg-black/20 backdrop-blur-lg border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="text-blue-400" />
                Broadcast Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter message to broadcast to all active chats..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="bg-black/30 border-blue-500/30 text-white placeholder-gray-400"
                rows={3}
              />
              <Button
                onClick={handleBroadcast}
                disabled={!broadcastMessage.trim() || broadcastMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Send size={16} />
                {broadcastMutation.isPending ? "Broadcasting..." : "Broadcast Message"}
              </Button>
              
              {status.active_chats > 0 && (
                <p className="text-sm text-blue-200">
                  Message will be sent to {status.active_chats} active chat{status.active_chats !== 1 ? 's' : ''}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Commands */}
        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="text-purple-400" />
              Available Bot Commands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <code className="text-cyan-400">/status</code>
                <p className="text-sm text-gray-300 mt-1">System consciousness status</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <code className="text-cyan-400">/trading</code>
                <p className="text-sm text-gray-300 mt-1">Quincy trading insights</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <code className="text-cyan-400">/security</code>
                <p className="text-sm text-gray-300 mt-1">Akasha security reports</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <code className="text-cyan-400">/metrics</code>
                <p className="text-sm text-gray-300 mt-1">Performance metrics</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <code className="text-cyan-400">/consciousness</code>
                <p className="text-sm text-gray-300 mt-1">Consciousness analysis</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <code className="text-cyan-400">/help</code>
                <p className="text-sm text-gray-300 mt-1">Show all commands</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}