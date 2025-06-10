import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StackUtilizationData {
  utilizationScore: number;
  summary: string;
  recommendations: string[];
  components: {
    total: number;
    optimized: number;
    integrationScore: number;
  };
  performance: {
    stackUtilization: number;
    performanceGains: number;
    aiEfficiency: number;
  };
}

interface StackTrends {
  utilizationTrend: number;
  performanceTrend: number;
  integrationTrend: number;
  recommendations: string[];
}

export default function StackUtilizationDashboard() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch stack utilization data
  const { data: stackData, isLoading: stackLoading } = useQuery<StackUtilizationData>({
    queryKey: ['/api/trading/stack-utilization'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch stack trends
  const { data: trendsData, isLoading: trendsLoading } = useQuery<StackTrends>({
    queryKey: ['/api/trading/stack-trends'],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/trading/stack-utilization'] });
    queryClient.invalidateQueries({ queryKey: ['/api/trading/stack-trends'] });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-cyan-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  if (stackLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <span className="ml-3 text-cyan-300">Loading stack utilization data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[var(--space-black)] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-300 mb-2">Stack Utilization Dashboard</h1>
          <p className="text-cyan-100">Comprehensive monitoring of technology stack optimization</p>
        </div>
        <Button 
          onClick={refreshData}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white"
        >
          <i className="fas fa-sync-alt mr-2"></i>
          Refresh Data
        </Button>
      </div>

      {/* Overall Score Card */}
      {stackData && (
        <Card className="holo-panel border-cyan-400/50">
          <CardHeader>
            <CardTitle className="text-cyan-300 flex items-center">
              <i className="fas fa-tachometer-alt mr-3"></i>
              Overall Stack Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(stackData.utilizationScore)}`}>
                  {stackData.utilizationScore.toFixed(1)}%
                </div>
                <Badge variant="outline" className="mt-2">
                  {getScoreBadge(stackData.utilizationScore)}
                </Badge>
              </div>
              <div className="flex-1 ml-8">
                <Progress 
                  value={stackData.utilizationScore} 
                  className="h-6 bg-gray-700"
                />
                <div className="flex justify-between text-sm text-cyan-200 mt-2">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-cyan-900/20 rounded-lg border border-cyan-400/30">
                <div className="text-2xl font-bold text-cyan-300">
                  {stackData.components.optimized}/{stackData.components.total}
                </div>
                <div className="text-sm text-cyan-200">Components Optimized</div>
              </div>
              <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-400/30">
                <div className="text-2xl font-bold text-blue-300">
                  {stackData.performance.performanceGains.toFixed(1)}%
                </div>
                <div className="text-sm text-blue-200">Performance Gains</div>
              </div>
              <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-400/30">
                <div className="text-2xl font-bold text-purple-300">
                  {stackData.components.integrationScore.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-200">Integration Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="overview" className="text-cyan-300">Overview</TabsTrigger>
          <TabsTrigger value="performance" className="text-cyan-300">Performance</TabsTrigger>
          <TabsTrigger value="trends" className="text-cyan-300">Trends</TabsTrigger>
          <TabsTrigger value="recommendations" className="text-cyan-300">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {stackData && (
            <Card className="holo-panel border-cyan-400/50">
              <CardHeader>
                <CardTitle className="text-cyan-300">System Overview</CardTitle>
                <CardDescription className="text-cyan-200">
                  Current status of all technology components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-400/30">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-layer-group text-cyan-400 mr-2"></i>
                      <span className="text-cyan-300 font-semibold">Stack Utilization</span>
                    </div>
                    <div className="text-2xl font-bold text-cyan-300">
                      {stackData.performance.stackUtilization.toFixed(1)}%
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-400/30">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-brain text-blue-400 mr-2"></i>
                      <span className="text-blue-300 font-semibold">AI Efficiency</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-300">
                      {stackData.performance.aiEfficiency.toFixed(1)}%
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-400/30">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-cogs text-purple-400 mr-2"></i>
                      <span className="text-purple-300 font-semibold">Components</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-300">
                      {stackData.components.total}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {stackData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="holo-panel border-cyan-400/50">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-cyan-200">Stack Utilization</span>
                      <span className="text-cyan-300">{stackData.performance.stackUtilization.toFixed(1)}%</span>
                    </div>
                    <Progress value={stackData.performance.stackUtilization} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-cyan-200">Performance Gains</span>
                      <span className="text-cyan-300">{stackData.performance.performanceGains.toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.min(100, stackData.performance.performanceGains)} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-cyan-200">AI Efficiency</span>
                      <span className="text-cyan-300">{stackData.performance.aiEfficiency.toFixed(1)}%</span>
                    </div>
                    <Progress value={stackData.performance.aiEfficiency} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="holo-panel border-cyan-400/50">
                <CardHeader>
                  <CardTitle className="text-cyan-300">Component Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-400/30">
                      <span className="text-green-300">Optimized Components</span>
                      <span className="text-green-300 font-bold">{stackData.components.optimized}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-400/30">
                      <span className="text-yellow-300">Pending Optimization</span>
                      <span className="text-yellow-300 font-bold">
                        {stackData.components.total - stackData.components.optimized}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-400/30">
                      <span className="text-blue-300">Integration Score</span>
                      <span className="text-blue-300 font-bold">
                        {stackData.components.integrationScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {trendsData && (
            <Card className="holo-panel border-cyan-400/50">
              <CardHeader>
                <CardTitle className="text-cyan-300">Performance Trends</CardTitle>
                <CardDescription className="text-cyan-200">
                  Trending analysis over the last 6 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-400/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-300">Utilization Trend</span>
                      <span className="text-2xl">{getTrendIcon(trendsData.utilizationTrend)}</span>
                    </div>
                    <div className="text-xl font-bold text-cyan-300">
                      {trendsData.utilizationTrend > 0 ? '+' : ''}{trendsData.utilizationTrend.toFixed(2)}%
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-400/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-300">Performance Trend</span>
                      <span className="text-2xl">{getTrendIcon(trendsData.performanceTrend)}</span>
                    </div>
                    <div className="text-xl font-bold text-blue-300">
                      {trendsData.performanceTrend > 0 ? '+' : ''}{trendsData.performanceTrend.toFixed(2)}%
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-400/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-300">Integration Trend</span>
                      <span className="text-2xl">{getTrendIcon(trendsData.integrationTrend)}</span>
                    </div>
                    <div className="text-xl font-bold text-purple-300">
                      {trendsData.integrationTrend > 0 ? '+' : ''}{trendsData.integrationTrend.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {stackData && (
            <Card className="holo-panel border-cyan-400/50">
              <CardHeader>
                <CardTitle className="text-cyan-300">Optimization Recommendations</CardTitle>
                <CardDescription className="text-cyan-200">
                  AI-generated suggestions for improving stack utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stackData.recommendations.map((recommendation, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-400/30"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-cyan-200 leading-relaxed">{recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {trendsData && trendsData.recommendations.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-cyan-300 mb-3">Trend-Based Recommendations</h4>
                      {trendsData.recommendations.map((recommendation, index) => (
                        <div 
                          key={`trend-${index}`}
                          className="p-3 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-400/30 mb-2"
                        >
                          <div className="flex items-center">
                            <i className="fas fa-chart-line text-purple-400 mr-3"></i>
                            <p className="text-purple-200">{recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}