import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Lock, Eye, MessageSquare, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import secureAIClient from '@/services/secure-ai-client';

interface SecurityStatus {
  vaultwarden: {
    connected: boolean;
    authenticated: boolean;
    serverUrl: string;
  };
  activeAuditLogs: number;
  activeSessions: number;
  rateLimitEntries: number;
}

interface AuditLog {
  id: string;
  timestamp: number;
  model: string;
  success: boolean;
  errorMessage?: string;
}

export default function SecureAIDashboard() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [sessionInfo, setSessionInfo] = useState(secureAIClient.getSessionInfo());
  const [healthStatus, setHealthStatus] = useState<any>(null);
  
  // Chat interface state
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  
  // Analysis state
  const [analysisText, setAnalysisText] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisType, setAnalysisType] = useState<'sentiment' | 'summary'>('sentiment');

  useEffect(() => {
    loadSecurityStatus();
    loadAuditLogs();
    loadHealthStatus();
    
    const interval = setInterval(() => {
      loadSecurityStatus();
      setSessionInfo(secureAIClient.getSessionInfo());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadSecurityStatus = async () => {
    try {
      const status = await secureAIClient.getSecurityStatus();
      setSecurityStatus(status);
    } catch (error) {
      console.error('Failed to load security status:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const logs = await secureAIClient.getAuditLogs();
      setAuditLogs(logs);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    }
  };

  const loadHealthStatus = async () => {
    try {
      const health = await secureAIClient.healthCheck();
      setHealthStatus(health);
    } catch (error) {
      console.error('Failed to load health status:', error);
    }
  };

  const createNewSession = async () => {
    try {
      await secureAIClient.createSession();
      setSessionInfo(secureAIClient.getSessionInfo());
      loadSecurityStatus();
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    const userMessage = { role: 'user', content: newMessage };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setNewMessage('');

    try {
      const response = await secureAIClient.secureChat(updatedMessages, encryptionEnabled);
      setChatMessages([...updatedMessages, { role: 'assistant', content: response }]);
      loadAuditLogs(); // Refresh audit logs
    } catch (error) {
      console.error('Chat message failed:', error);
      setChatMessages([...updatedMessages, { 
        role: 'assistant', 
        content: 'Error: Failed to process message. Please check your connection and try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!analysisText.trim()) return;

    setIsLoading(true);
    try {
      let result;
      if (analysisType === 'sentiment') {
        result = await secureAIClient.analyzeSentiment(analysisText, encryptionEnabled);
      } else {
        result = await secureAIClient.generateSummary(analysisText, encryptionEnabled);
      }
      setAnalysisResult(result);
      loadAuditLogs(); // Refresh audit logs
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResult('Error: Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSessionTimeRemaining = () => {
    if (!sessionInfo) return 0;
    return Math.max(0, Math.floor(secureAIClient.getTimeUntilExpiry() / 1000));
  };

  return (
    <div className="space-y-6">
      {/* Security Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaultwarden Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connected</span>
                <Badge variant={securityStatus?.vaultwarden.connected ? "default" : "destructive"}>
                  {securityStatus?.vaultwarden.connected ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Authenticated</span>
                <Badge variant={securityStatus?.vaultwarden.authenticated ? "default" : "destructive"}>
                  {securityStatus?.vaultwarden.authenticated ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessionInfo ? (
                <>
                  <div className="text-sm">
                    ID: {sessionInfo.sessionId.substring(0, 8)}...
                  </div>
                  <div className="text-sm">
                    Expires in: {getSessionTimeRemaining()}s
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">No active session</div>
              )}
              <Button size="sm" onClick={createNewSession} className="w-full">
                New Session
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant={healthStatus?.status === 'healthy' ? "default" : "destructive"}>
                  {healthStatus?.status || 'Unknown'}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Active Sessions: {securityStatus?.activeSessions || 0}
              </div>
              <div className="text-xs text-muted-foreground">
                Audit Logs: {securityStatus?.activeAuditLogs || 0}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secure AI Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Secure AI Chat
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              checked={encryptionEnabled}
              onCheckedChange={setEncryptionEnabled}
              id="encryption"
            />
            <Label htmlFor="encryption" className="text-sm">
              End-to-end encryption
            </Label>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4 h-64 overflow-y-auto space-y-2">
            {chatMessages.length === 0 ? (
              <div className="text-center text-muted-foreground">
                Start a secure conversation with AI
              </div>
            ) : (
              chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-blue-100 dark:bg-blue-900 ml-auto'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {message.role === 'user' ? 'You' : 'AI'}
                  </div>
                  <div className="text-sm">{message.content}</div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded max-w-[80%]">
                <div className="text-xs text-muted-foreground mb-1">AI</div>
                <div className="text-sm">Thinking...</div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your secure message..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={isLoading || !newMessage.trim()}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Secure AI Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={analysisType === 'sentiment' ? 'default' : 'outline'}
              onClick={() => setAnalysisType('sentiment')}
              size="sm"
            >
              Sentiment Analysis
            </Button>
            <Button
              variant={analysisType === 'summary' ? 'default' : 'outline'}
              onClick={() => setAnalysisType('summary')}
              size="sm"
            >
              Text Summary
            </Button>
          </div>

          <Textarea
            value={analysisText}
            onChange={(e) => setAnalysisText(e.target.value)}
            placeholder="Enter text to analyze..."
            rows={4}
          />

          <Button onClick={runAnalysis} disabled={isLoading || !analysisText.trim()}>
            Run {analysisType === 'sentiment' ? 'Sentiment Analysis' : 'Summary'}
          </Button>

          {analysisResult && (
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div className="text-sm font-medium mb-2">Analysis Result:</div>
              <div className="text-sm">{analysisResult}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No audit logs available
              </div>
            ) : (
              auditLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2">
                    {log.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{log.model}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={log.success ? "default" : "destructive"}>
                      {log.success ? "Success" : "Failed"}
                    </Badge>
                    {log.errorMessage && (
                      <div className="text-xs text-red-500 mt-1">
                        {log.errorMessage}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}