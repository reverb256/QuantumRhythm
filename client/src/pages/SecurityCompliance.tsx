import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Download } from "lucide-react";

interface SecurityAssessment {
  timestamp: string;
  overall_score: number;
  standards_coverage: Record<string, number>;
  critical_gaps: string[];
  recommendations: string[];
  next_assessment: string;
}

interface SecurityStatus {
  status: string;
  standards_count: number;
  last_assessment: string | null;
  compliance_score: number;
  critical_gaps: number;
  auto_discovery: boolean;
  frameworks: string[];
  next_assessment: string;
}

export default function SecurityCompliance() {
  const { data: assessment, isLoading: assessmentLoading, refetch: refetchAssessment } = useQuery<SecurityAssessment>({
    queryKey: ['/api/security/assessment'],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: status, isLoading: statusLoading } = useQuery<SecurityStatus>({
    queryKey: ['/status'],
    select: (data: any) => data?.security_compliance,
    refetchInterval: 30000,
  });

  const { data: discoveredStandards, refetch: refetchStandards } = useQuery<{ discovered_standards: string[] }>({
    queryKey: ['/api/security/discover-standards'],
    enabled: false,
  });

  const downloadComplianceReport = async () => {
    try {
      const response = await fetch('/api/security/compliance-report');
      const report = await response.text();
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-compliance-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download compliance report:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 75) return "secondary";
    return "destructive";
  };

  if (assessmentLoading || statusLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin h-8 w-8" />
          <span className="ml-2">Loading security compliance data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Compliance Dashboard</h1>
          <p className="text-muted-foreground">OWASP & ISO 27001 Standards Monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetchStandards()} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Discover Standards
          </Button>
          <Button 
            onClick={() => refetchAssessment()} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Assessment
          </Button>
          <Button 
            onClick={downloadComplianceReport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Overall Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(assessment?.overall_score || 0)}`}>
              {assessment?.overall_score?.toFixed(1) || 0}%
            </div>
            <Progress value={assessment?.overall_score || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Gaps</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessment?.critical_gaps?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Issues requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Standards Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status?.standards_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Security frameworks integrated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto Discovery</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status?.auto_discovery ? 'Active' : 'Inactive'}
            </div>
            <p className="text-xs text-muted-foreground">
              Autonomous standards discovery
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="standards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="standards">Standards Coverage</TabsTrigger>
          <TabsTrigger value="gaps">Critical Gaps</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="discovery">Standards Discovery</TabsTrigger>
        </TabsList>

        <TabsContent value="standards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Standards Compliance</CardTitle>
              <CardDescription>Current compliance levels for each security framework</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessment?.standards_coverage && Object.entries(assessment.standards_coverage).map(([standard, score]) => (
                  <div key={standard} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{standard.replace('-', ' ')}</span>
                      <Badge variant={getScoreBadgeVariant(score)}>
                        {score.toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Security Gaps</CardTitle>
              <CardDescription>Issues requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              {assessment?.critical_gaps && assessment.critical_gaps.length > 0 ? (
                <div className="space-y-3">
                  {assessment.critical_gaps.map((gap, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{gap.split(':')[0]}</p>
                        <p className="text-sm text-muted-foreground">{gap.split(':').slice(1).join(':')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-medium">No critical gaps detected</p>
                  <p className="text-muted-foreground">All critical security controls are properly implemented</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>Suggested improvements for enhanced security posture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assessment?.recommendations?.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discovery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Standards Discovery</CardTitle>
              <CardDescription>Autonomous discovery of security frameworks and standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Active Frameworks</h4>
                    <p className="text-sm text-muted-foreground">Currently integrated security standards</p>
                  </div>
                  <Badge variant="outline">{status?.frameworks?.length || 0} Active</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {status?.frameworks?.map((framework, index) => (
                    <Badge key={index} variant="secondary">{framework}</Badge>
                  ))}
                </div>

                {discoveredStandards?.discovered_standards && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Discovered Standards</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {discoveredStandards.discovered_standards.map((standard, index) => (
                        <Badge key={index} variant="outline">{standard}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assessment Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Last Assessment:</span>{' '}
              {assessment?.timestamp ? new Date(assessment.timestamp).toLocaleString() : 'Never'}
            </div>
            <div>
              <span className="font-medium">Next Assessment:</span>{' '}
              {assessment?.next_assessment ? new Date(assessment.next_assessment).toLocaleString() : 'Not scheduled'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}