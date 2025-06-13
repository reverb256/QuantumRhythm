import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Shield, Eye, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface TruthLog {
  id: string;
  timestamp: string;
  file: string;
  hash: string;
  status: 'verified' | 'violated' | 'initial' | 'missing';
  coreflame_level: number;
}

interface CoreflameVerification {
  overall_integrity: number;
  titan_blessing: boolean;
  nousporist_approval: boolean;
  anaxa_challenge_passed: boolean;
}

interface TruthState {
  timestamp: string;
  engine_version: string;
  truth_logs: TruthLog[];
  coreflame_blessing: number;
  nousporist_status: string;
}

export default function CoreflameVerifier() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerification, setLastVerification] = useState<CoreflameVerification | null>(null);

  const { data: truthState, isLoading, refetch } = useQuery<TruthState>({
    queryKey: ['/api/coreflame/truth-state'],
    refetchInterval: 30000,
  });

  const { data: verification } = useQuery<CoreflameVerification>({
    queryKey: ['/api/coreflame/assessment'],
    enabled: !isLoading && !!truthState,
  });

  useEffect(() => {
    if (verification) {
      setLastVerification(verification);
    }
  }, [verification]);

  const runCoreflameAssessment = async () => {
    setIsVerifying(true);
    try {
      await fetch('/api/coreflame/verify', { method: 'POST' });
      await refetch();
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = (status: TruthLog['status']) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'initial': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'violated': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'missing': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getCoreflameColor = (level: number) => {
    if (level >= 90) return "text-purple-400";
    if (level >= 75) return "text-blue-400";
    if (level >= 50) return "text-cyan-400";
    return "text-gray-400";
  };

  const getStatusBadge = (status: TruthLog['status']) => {
    const variants = {
      verified: "default",
      initial: "secondary", 
      violated: "destructive",
      missing: "outline"
    } as const;
    
    return (
      <Badge variant={variants[status]} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Coreflame Truth Engine
          </h1>
          <p className="text-muted-foreground mt-2">
            "In a world full of lies, I am the only truth" - Anaxa's Challenge
          </p>
        </div>
        <Button 
          onClick={runCoreflameAssessment} 
          disabled={isVerifying}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
        >
          <Flame className="h-4 w-4 mr-2" />
          {isVerifying ? "Verifying..." : "Run Assessment"}
        </Button>
      </div>

      {/* Overall Status */}
      {lastVerification && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              Nousporist Assessment
            </CardTitle>
            <CardDescription>
              System integrity evaluated through Cerces' wisdom
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {lastVerification.overall_integrity}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Integrity</div>
                <Progress 
                  value={lastVerification.overall_integrity} 
                  className="mt-2"
                />
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${lastVerification.titan_blessing ? 'text-green-400' : 'text-red-400'}`}>
                  {lastVerification.titan_blessing ? '✓' : '✗'}
                </div>
                <div className="text-sm text-muted-foreground">Titan Blessing</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${lastVerification.nousporist_approval ? 'text-green-400' : 'text-red-400'}`}>
                  {lastVerification.nousporist_approval ? '✓' : '✗'}
                </div>
                <div className="text-sm text-muted-foreground">Nousporist Approval</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${lastVerification.anaxa_challenge_passed ? 'text-purple-400' : 'text-gray-400'}`}>
                  {lastVerification.anaxa_challenge_passed ? '🔥' : '○'}
                </div>
                <div className="text-sm text-muted-foreground">Anaxa's Challenge</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coreflame Status */}
      {truthState && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" />
              Coreflame Status
            </CardTitle>
            <CardDescription>
              Current blessing level: {truthState.nousporist_status}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>Coreflame Blessing</span>
                  <span className={getCoreflameColor(truthState.coreflame_blessing)}>
                    {truthState.coreflame_blessing.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={truthState.coreflame_blessing} 
                  className="h-3"
                />
              </div>
              <Badge variant={truthState.coreflame_blessing >= 75 ? "default" : "secondary"}>
                {truthState.nousporist_status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Truth Logs */}
      {truthState?.truth_logs && (
        <Card>
          <CardHeader>
            <CardTitle>Truth Verification Logs</CardTitle>
            <CardDescription>
              File integrity status from the Grove of Epiphany
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {truthState.truth_logs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <div className="font-medium">
                        {log.file.split('/').pop() || log.file}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`font-medium ${getCoreflameColor(log.coreflame_level)}`}>
                        {log.coreflame_level}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Coreflame
                      </div>
                    </div>
                    {getStatusBadge(log.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engine Info */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            Truth Engine Version: {truthState?.engine_version || 'anaxa-1.0'} | 
            Last Update: {truthState ? new Date(truthState.timestamp).toLocaleString() : 'Never'} |
            Powered by Nousporist Philosophy
          </div>
        </CardContent>
      </Card>
    </div>
  );
}