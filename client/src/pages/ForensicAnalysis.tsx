import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Search, Clock, DollarSign, Activity } from 'lucide-react';

interface ForensicReport {
  walletAddress: string;
  analysisTimestamp: string;
  totalTransactions: number;
  suspiciousTransactions: number;
  drainEvents: DrainEvent[];
  attackerProfiles: AttackerProfile[];
  recoveryRecommendations: string[];
  legalActions: string[];
  quantumThreatLevel: 'low' | 'medium' | 'high' | 'critical';
  blockchainEvidence: number;
}

interface DrainEvent {
  startTime: string;
  endTime: string;
  totalAmount: number;
  transactionCount: number;
  drainType: 'gradual' | 'rapid' | 'systematic';
  attackerAddresses: string[];
  methodUsed: string;
  compromiseVector: string;
}

interface AttackerProfile {
  address: string;
  totalStolen: number;
  transactionCount: number;
  activeTimeframe: { start: string; end: string };
  methodsUsed: string[];
  riskLevel: number;
}

export default function ForensicAnalysis() {
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customWallet, setCustomWallet] = useState('');
  const [analysisMode, setAnalysisMode] = useState<'hacked' | 'custom'>('hacked');

  const runForensicAnalysis = async (walletAddress?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/trading-agent/forensic/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(walletAddress ? { walletAddress } : {})
      });
      
      const data = await response.json();
      
      if (data.success) {
        setReport(data.report);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Failed to connect to analysis service');
    } finally {
      setLoading(false);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Shield className="w-10 h-10 text-blue-400" />
            Quantum Forensic Analysis
          </h1>
          <p className="text-xl text-slate-300">
            Advanced blockchain investigation and wallet security analysis
          </p>
        </div>

        {/* Analysis Controls */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5" />
              Investigation Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={analysisMode} onValueChange={(v) => setAnalysisMode(v as 'hacked' | 'custom')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="hacked">Investigate Hacked Wallet</TabsTrigger>
                <TabsTrigger value="custom">Custom Wallet Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hacked" className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This will analyze the compromised wallet stored in HACKED_WALLET environment variable.
                    The analysis includes transaction pattern recognition, attacker profiling, and legal recommendations.
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={() => runForensicAnalysis()} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Analyzing...' : 'Run Quantum Analysis'}
                </Button>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Solana wallet address..."
                    value={customWallet}
                    onChange={(e) => setCustomWallet(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => runForensicAnalysis(customWallet)} 
                    disabled={loading || !customWallet}
                  >
                    Analyze
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
              <h3 className="text-xl font-semibold text-white">Quantum Analysis in Progress</h3>
              <p className="text-slate-300">Scanning blockchain transactions and identifying threat patterns...</p>
              <Progress value={33} className="w-full" />
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {report && (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total Transactions</p>
                      <p className="text-2xl font-bold text-white">{report.totalTransactions}</p>
                    </div>
                    <Activity className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Suspicious Activity</p>
                      <p className="text-2xl font-bold text-red-400">{report.suspiciousTransactions}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Drain Events</p>
                      <p className="text-2xl font-bold text-orange-400">{report.drainEvents.length}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Threat Level</p>
                      <Badge variant={getThreatLevelColor(report.quantumThreatLevel)} className="text-lg">
                        {report.quantumThreatLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <Shield className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="drains">Drain Events</TabsTrigger>
                <TabsTrigger value="attackers">Attackers</TabsTrigger>
                <TabsTrigger value="recovery">Recovery</TabsTrigger>
                <TabsTrigger value="legal">Legal Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Analysis Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Wallet Information</h4>
                        <p className="text-slate-300">Address: {report.walletAddress}</p>
                        <p className="text-slate-300">Analysis Time: {new Date(report.analysisTimestamp).toLocaleString()}</p>
                        <p className="text-slate-300">Evidence Preserved: {report.blockchainEvidence} transactions</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Security Assessment</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-300">Threat Level</span>
                            <Badge variant={getThreatLevelColor(report.quantumThreatLevel)}>
                              {report.quantumThreatLevel}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Risk Score</span>
                            <span className="text-orange-400">
                              {Math.round((report.suspiciousTransactions / report.totalTransactions) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="drains">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Drain Events Detected</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {report.drainEvents.length > 0 ? (
                      <div className="space-y-4">
                        {report.drainEvents.map((event, index) => (
                          <div key={index} className="border border-slate-600 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-white">Drain Event #{index + 1}</h4>
                              <Badge variant={event.drainType === 'rapid' ? 'destructive' : 'secondary'}>
                                {event.drainType}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-slate-300">Amount: <span className="text-red-400">{event.totalAmount.toFixed(4)} SOL</span></p>
                                <p className="text-slate-300">Transactions: {event.transactionCount}</p>
                                <p className="text-slate-300">Duration: {new Date(event.startTime).toLocaleDateString()} - {new Date(event.endTime).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-slate-300">Method: {event.methodUsed}</p>
                                <p className="text-slate-300">Vector: {event.compromiseVector}</p>
                                <p className="text-slate-300">Attackers: {event.attackerAddresses.length}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-8">No drain events detected</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attackers">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Attacker Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {report.attackerProfiles.length > 0 ? (
                      <div className="space-y-4">
                        {report.attackerProfiles.map((attacker, index) => (
                          <div key={index} className="border border-slate-600 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-white">Attacker #{index + 1}</h4>
                              <Badge variant={attacker.riskLevel > 70 ? 'destructive' : 'secondary'}>
                                Risk: {attacker.riskLevel}%
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-slate-300">Address: <code className="text-blue-400">{attacker.address}</code></p>
                                <p className="text-slate-300">Total Stolen: <span className="text-red-400">{attacker.totalStolen.toFixed(4)} SOL</span></p>
                                <p className="text-slate-300">Transactions: {attacker.transactionCount}</p>
                              </div>
                              <div>
                                <p className="text-slate-300">Active Period: {new Date(attacker.activeTimeframe.start).toLocaleDateString()} - {new Date(attacker.activeTimeframe.end).toLocaleDateString()}</p>
                                <p className="text-slate-300">Methods: {attacker.methodsUsed.join(', ')}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-8">No attacker profiles identified</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recovery">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recovery Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.recoveryRecommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-slate-300">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="legal">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Legal Actions & Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.legalActions.map((action, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                          <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
                          <p className="text-slate-300">{action}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}