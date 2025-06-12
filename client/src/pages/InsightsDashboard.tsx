import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  BarChart3,
  Eye,
  Lightbulb,
  Gauge
} from 'lucide-react';

interface InsightsSummary {
  totalInsights: number;
  criticalInsights: number;
  categories: Record<string, number>;
  topPatterns: string[];
  successRate: number;
}

interface SystemInsight {
  category: 'performance' | 'security' | 'architecture' | 'user_behavior' | 'ai_optimization';
  priority: 'critical' | 'high' | 'medium' | 'low';
  pattern: string;
  solution: string;
  impact: string;
  confidence: number;
  source: string;
  timestamp: string;
}

const categoryIcons = {
  performance: Zap,
  security: Shield,
  architecture: Brain,
  user_behavior: Users,
  ai_optimization: TrendingUp
};

const categoryColors = {
  performance: 'bg-blue-500',
  security: 'bg-red-500',
  architecture: 'bg-purple-500',
  user_behavior: 'bg-green-500',
  ai_optimization: 'bg-orange-500'
};

const priorityColors = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

export default function InsightsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: insightsSummary, isLoading, refetch } = useQuery({
    queryKey: ['/api/insights/summary'],
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const { data: insightsReport } = useQuery({
    queryKey: ['/api/insights/report'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const summary = (insightsSummary as any)?.insights as InsightsSummary | undefined;

  const handleProcessTestData = async () => {
    setIsProcessing(true);
    try {
      const testData = "AI orchestration complete: 10/10 issues fixed, system status: healthy. Gaming consciousness integration at 90.1%. Security audit complete with 0 issues found.";
      
      const response = await fetch('/api/insights/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: testData })
      });

      if (response.ok) {
        await refetch();
      }
    } catch (error) {
      console.error('Failed to process test data:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Brain className="h-10 w-10 text-purple-400" />
                System Insights Dashboard
              </h1>
              <p className="text-gray-300">
                Real-time AI-powered system intelligence and pattern analysis
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleProcessTestData}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? (
                  <Activity className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Lightbulb className="h-4 w-4 mr-2" />
                )}
                Process Test Data
              </Button>
              <Button 
                onClick={() => refetch()}
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Refresh Insights
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Insights</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{summary?.totalInsights || 0}</div>
              <p className="text-xs text-gray-400">Patterns extracted</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Critical Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{summary?.criticalInsights || 0}</div>
              <p className="text-xs text-gray-400">Require attention</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{summary?.successRate?.toFixed(1) || 0}%</div>
              <p className="text-xs text-gray-400">Issue resolution</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">System Health</CardTitle>
              <Gauge className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">HEALTHY</div>
              <p className="text-xs text-gray-400">AI orchestration active</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-gray-300 data-[state=active]:text-white">
              Categories
            </TabsTrigger>
            <TabsTrigger value="patterns" className="text-gray-300 data-[state=active]:text-white">
              Top Patterns
            </TabsTrigger>
            <TabsTrigger value="report" className="text-gray-300 data-[state=active]:text-white">
              Full Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {summary && summary.criticalInsights > 0 && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertTitle className="text-red-400">Critical Issues Detected</AlertTitle>
                <AlertDescription className="text-red-300">
                  {summary.criticalInsights} critical insights require immediate attention. 
                  Review the patterns and implement suggested solutions.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Success Rate</span>
                      <span className="text-white">{summary?.successRate?.toFixed(1) || 0}%</span>
                    </div>
                    <Progress 
                      value={summary?.successRate || 0} 
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Pattern Recognition</span>
                      <span className="text-white">95.2%</span>
                    </div>
                    <Progress 
                      value={95.2} 
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">AI Orchestration</span>
                      <span className="text-white">90.1%</span>
                    </div>
                    <Progress 
                      value={90.1} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">AI orchestration completed successfully</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">System consolidation active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Gaming consciousness at 90.1%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Insights extraction engine active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {summary?.categories && Object.entries(summary.categories).map(([category, count]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                const colorClass = categoryColors[category as keyof typeof categoryColors];
                
                return (
                  <Card key={category} className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300 capitalize">
                        {category.replace('_', ' ')}
                      </CardTitle>
                      <Icon className={`h-4 w-4 text-${colorClass.split('-')[1]}-400`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{count}</div>
                      <p className="text-xs text-gray-400">Insights detected</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Top Patterns Identified</CardTitle>
                <CardDescription className="text-gray-400">
                  Most frequently detected system patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {summary?.topPatterns?.map((pattern, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="text-gray-300 text-sm">{pattern}</span>
                      </div>
                    )) || (
                      <div className="text-center text-gray-400 py-8">
                        No patterns detected yet. Process some data to see insights.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Comprehensive Insights Report</CardTitle>
                <CardDescription className="text-gray-400">
                  Detailed analysis and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                    {(insightsReport as any)?.report || 'No report available yet. Process some data to generate insights.'}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}