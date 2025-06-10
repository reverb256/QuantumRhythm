import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Zap, 
  Shield, 
  BarChart3, 
  Settings, 
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp,
  Globe,
  Database,
  Cpu
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface CloudflareFeature {
  name: string;
  category: string;
  capability: string;
  priority: number;
  enabled: boolean;
  performance: {
    successRate: number;
    avgResponseTime: number;
    errorRate: number;
    costEfficiency: number;
  };
  lastOptimized: string;
}

interface CloudflareStatus {
  totalFeatures: number;
  enabledFeatures: number;
  optimizations: number;
  features: Record<string, CloudflareFeature>;
}

interface CloudflareOptimization {
  feature: string;
  action: string;
  confidence: number;
  expectedBenefit: string;
  riskLevel: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'performance': return <TrendingUp className="h-4 w-4" />;
    case 'security': return <Shield className="h-4 w-4" />;
    case 'analytics': return <BarChart3 className="h-4 w-4" />;
    case 'workers': return <Cpu className="h-4 w-4" />;
    case 'r2': return <Database className="h-4 w-4" />;
    case 'ai': return <Zap className="h-4 w-4" />;
    case 'edge': return <Globe className="h-4 w-4" />;
    default: return <Settings className="h-4 w-4" />;
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

export default function CloudflareOptimization() {
  const queryClient = useQueryClient();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const { data: status, isLoading: statusLoading } = useQuery<CloudflareStatus>({
    queryKey: ['/api/cloudflare/status'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: reportData } = useQuery<{ report: string }>({
    queryKey: ['/api/cloudflare/report'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const enableFeatureMutation = useMutation({
    mutationFn: async (featureName: string) => {
      const response = await fetch(`/api/cloudflare/enable/${featureName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cloudflare/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cloudflare/report'] });
    }
  });

  if (statusLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <Cloud className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">Loading Cloudflare AI optimization status...</p>
        </div>
      </div>
    );
  }

  const features = status?.features ? Object.values(status.features) : [];
  const optimizationScore = status ? Math.round((status.enabledFeatures / status.totalFeatures) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Cloud className="h-8 w-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Cloudflare AI Optimization</h1>
          <p className="text-muted-foreground">
            Intelligent discovery and optimization of Cloudflare features
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Total Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.totalFeatures || 0}</div>
            <p className="text-xs text-muted-foreground">Discovered features</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Enabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.enabledFeatures || 0}</div>
            <p className="text-xs text-muted-foreground">Active optimizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.optimizations || 0}</div>
            <p className="text-xs text-muted-foreground">Optimization opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Optimization Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizationScore}%</div>
            <Progress value={optimizationScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="report">AI Report</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <Card 
                key={feature.name}
                className={`cursor-pointer transition-colors ${
                  selectedFeature === feature.name ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedFeature(feature.name)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(feature.category)}
                      <CardTitle className="text-sm capitalize">
                        {feature.name.replace('-', ' ')}
                      </CardTitle>
                    </div>
                    {feature.enabled ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <CardDescription className="text-xs">
                    {feature.capability}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span>Priority</span>
                    <Badge variant="outline">{feature.priority}/10</Badge>
                  </div>
                  
                  {feature.enabled && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Success Rate</span>
                          <span>{feature.performance.successRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={feature.performance.successRate} className="h-1" />
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          Optimized {new Date(feature.lastOptimized).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}

                  {!feature.enabled && (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        enableFeatureMutation.mutate(feature.name);
                      }}
                      disabled={enableFeatureMutation.isPending}
                    >
                      {enableFeatureMutation.isPending ? 'Enabling...' : 'Enable Feature'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Recommended Optimizations</CardTitle>
              <CardDescription>
                Intelligent recommendations based on system performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock optimizations - replace with real data when available */}
                {[
                  {
                    feature: 'ai-gateway',
                    action: 'enable',
                    confidence: 95,
                    expectedBenefit: 'Reduce AI model latency by 60-80% through edge caching',
                    riskLevel: 'low'
                  },
                  {
                    feature: 'workers',
                    action: 'configure',
                    confidence: 88,
                    expectedBenefit: 'Offload API rate limiting logic to edge for 200ms+ savings',
                    riskLevel: 'low'
                  },
                  {
                    feature: 'cache-api',
                    action: 'optimize',
                    confidence: 82,
                    expectedBenefit: 'Cache blockchain data at edge, reduce RPC calls by 70%',
                    riskLevel: 'medium'
                  }
                ].map((opt, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon('ai')}
                        <span className="font-medium capitalize">
                          {opt.feature.replace('-', ' ')}
                        </span>
                        <Badge variant="outline">{opt.action}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(opt.riskLevel)}>
                          {opt.riskLevel} risk
                        </Badge>
                        <span className="text-sm font-medium">{opt.confidence}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{opt.expectedBenefit}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Apply Optimization
                      </Button>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Response Time</span>
                    <span className="font-medium">285ms</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cache Hit Rate</span>
                    <span className="font-medium">92.3%</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <span className="font-medium">0.2%</span>
                  </div>
                  <Progress value={2} className="[&>div]:bg-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">$124.50</div>
                  <p className="text-sm text-muted-foreground">Monthly savings</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Bandwidth Savings</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Request Optimization</span>
                    <span className="font-medium">43%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Storage Efficiency</span>
                    <span className="font-medium">81%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Intelligence Report</CardTitle>
              <CardDescription>
                Comprehensive analysis from the Cloudflare AI Orchestrator
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportData?.report ? (
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg font-mono">
                  {reportData.report}
                </pre>
              ) : (
                <div className="text-center py-8">
                  <Cloud className="h-8 w-8 animate-pulse mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Generating AI analysis report...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}