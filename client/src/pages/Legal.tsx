import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Globe, 
  Scale,
  Cpu,
  Coins,
  Users,
  Lock,
  Eye
} from 'lucide-react';

interface ComplianceViolation {
  ruleId: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  timestamp: string;
  resolved: boolean;
}

interface ComplianceDashboard {
  overview: {
    overallScore: number;
    passed: boolean;
    totalViolations: number;
    criticalIssues: number;
    highPriorityIssues: number;
  };
  trends: {
    scoreHistory: Array<{
      date: string;
      score: number;
      passed: boolean;
    }>;
    averageScore: number;
  };
  breakdown: {
    byCategory: Record<string, number>;
    byJurisdiction: Record<string, number>;
    bySeverity: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  recentViolations: ComplianceViolation[];
  topRecommendations: string[];
}

const categoryIcons: Record<string, any> = {
  privacy: Users,
  financial: Coins,
  ai: Cpu,
  crypto: Coins,
  data: Lock,
  accessibility: Eye,
  international: Globe
};

const severityColors = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500'
};

const categoryColors = {
  privacy: 'text-purple-400',
  financial: 'text-green-400',
  ai: 'text-cyan-400',
  crypto: 'text-yellow-400',
  data: 'text-blue-400',
  accessibility: 'text-pink-400',
  international: 'text-indigo-400'
};

export default function Legal() {
  const [isRunningCheck, setIsRunningCheck] = useState(false);

  const { data: dashboard, isLoading, refetch } = useQuery<ComplianceDashboard>({
    queryKey: ['/api/legal/dashboard'],
    refetchInterval: 60000 // Refresh every minute
  });

  const { data: rules } = useQuery<{data: any[]}>({
    queryKey: ['/api/legal/rules']
  });

  const runComplianceCheck = async () => {
    setIsRunningCheck(true);
    try {
      const response = await fetch('/api/legal/check', { method: 'POST' });
      if (response.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Failed to run compliance check:', error);
    } finally {
      setIsRunningCheck(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--space-black)] text-white pt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white pt-16">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Legal Compliance</h1>
            <p className="text-gray-400">Comprehensive regulatory compliance monitoring and management</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={runComplianceCheck}
              disabled={isRunningCheck}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isRunningCheck ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Running Check...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Run Compliance Check
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black/40 border-cyan-400/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-300">Overall Score</CardTitle>
                <Scale className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboard.overview.overallScore}%</div>
                <Progress value={dashboard.overview.overallScore} className="mt-2" />
                <p className="text-xs text-gray-400 mt-1">
                  {dashboard.overview.passed ? 'Compliant' : 'Issues detected'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-red-400/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-300">Critical Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboard.overview.criticalIssues}</div>
                <p className="text-xs text-gray-400">Require immediate attention</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-orange-400/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-300">High Priority</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{dashboard.overview.highPriorityIssues}</div>
                <p className="text-xs text-gray-400">Need attention soon</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-green-400/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-300">Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {dashboard.overview.passed ? 'Compliant' : 'Issues'}
                </div>
                <p className="text-xs text-gray-400">Overall compliance status</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-black/40">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="jurisdictions">Jurisdictions</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {dashboard && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Severity Breakdown */}
                <Card className="bg-black/40 border-cyan-400/30">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">Violations by Severity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(dashboard.breakdown.bySeverity).map(([severity, count]) => {
                        const severityKey = severity as keyof typeof severityColors;
                        return (
                          <div key={severity} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${severityColors[severityKey]}`}></div>
                              <span className="capitalize text-gray-300">{severity}</span>
                            </div>
                            <span className="font-mono text-white">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Recommendations */}
                <Card className="bg-black/40 border-yellow-400/30">
                  <CardHeader>
                    <CardTitle className="text-yellow-300">Top Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {dashboard.topRecommendations.slice(0, 5).map((recommendation, index) => (
                        <div key={index} className="text-sm text-gray-300 p-2 bg-black/20 rounded">
                          {recommendation}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="violations" className="space-y-6">
            {dashboard && (
              <Card className="bg-black/40 border-red-400/30">
                <CardHeader>
                  <CardTitle className="text-red-300">Recent Violations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboard.recentViolations.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <p className="text-green-300">No violations detected!</p>
                      </div>
                    ) : (
                      dashboard.recentViolations.map((violation, index) => (
                        <Alert key={index} className="border-red-400/50 bg-red-400/10">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="destructive" className={severityColors[violation.severity]}>
                                    {violation.severity}
                                  </Badge>
                                  <span className="text-xs text-gray-400">{violation.ruleId}</span>
                                </div>
                                <p className="text-sm text-white mb-2">{violation.description}</p>
                                <p className="text-xs text-gray-300">{violation.recommendation}</p>
                              </div>
                              <time className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                {new Date(violation.timestamp).toLocaleDateString()}
                              </time>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {dashboard && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(dashboard.breakdown.byCategory).map(([category, count]) => {
                  const IconComponent = categoryIcons[category] || FileText;
                  return (
                    <Card key={category} className="bg-black/40 border-cyan-400/30">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-medium capitalize ${categoryColors[category as keyof typeof categoryColors]}`}>
                          {category}
                        </CardTitle>
                        <IconComponent className={`h-4 w-4 ${categoryColors[category as keyof typeof categoryColors]}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">{count}</div>
                        <p className="text-xs text-gray-400">violations detected</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="jurisdictions" className="space-y-6">
            {dashboard && (
              <Card className="bg-black/40 border-cyan-400/30">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Violations by Jurisdiction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(dashboard.breakdown.byJurisdiction).map(([jurisdiction, count]) => (
                      <div key={jurisdiction} className="flex items-center justify-between p-3 bg-black/20 rounded">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-indigo-400" />
                          <span className="text-gray-300">{jurisdiction}</span>
                        </div>
                        <Badge variant="outline" className="text-white border-gray-600">
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            {rules && (
              <Card className="bg-black/40 border-cyan-400/30">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Compliance Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rules.data.map((rule: any) => (
                      <div key={rule.id} className="p-4 bg-black/20 rounded border border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`${categoryColors[rule.category as keyof typeof categoryColors]} border-current`}>
                              {rule.category}
                            </Badge>
                            <Badge variant="outline" className="text-gray-300 border-gray-600">
                              {rule.jurisdiction}
                            </Badge>
                            <Badge variant={rule.automated ? "default" : "secondary"}>
                              {rule.automated ? "Automated" : "Manual"}
                            </Badge>
                          </div>
                          <Badge variant="destructive" className={severityColors[rule.severity as keyof typeof severityColors]}>
                            {rule.severity}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-white mb-1">{rule.regulation}</h4>
                        <p className="text-sm text-gray-300">{rule.requirement}</p>
                        <p className="text-xs text-gray-400 mt-1">Rule ID: {rule.id}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}