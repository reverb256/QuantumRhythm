import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';

interface DePINOpportunity {
  protocol: string;
  type: string;
  annual_revenue: number;
  deployment_cost: number;
  roi_months: number;
  confidence: number;
  market_demand: number;
  competition_level: number;
  recommended_action: string;
}

interface PortfolioNode {
  id: string;
  protocol: string;
  status: string;
  deployment_cost: number;
  earnings_total: number;
  roi_percentage: number;
  monthly_revenue: number;
  region: string;
}

interface PortfolioSummary {
  total_nodes: number;
  earning_nodes: number;
  roi_achieved_nodes: number;
  total_investment: number;
  total_earnings: number;
  current_roi: number;
  projected_monthly_revenue: number;
}

export default function DePINDashboard() {
  const [deploymentBudget, setDeploymentBudget] = useState(1000);
  const [traderPersonality, setTraderPersonality] = useState('analytical');
  const queryClient = useQueryClient();

  // Trader AI personality states
  const traderPersonalities = {
    analytical: { emoji: '🤖', name: 'Analytical Mode', style: 'calculating optimal deployments...' },
    aggressive: { emoji: '⚡', name: 'Aggressive Growth', style: 'maximizing revenue potential...' },
    conservative: { emoji: '🛡️', name: 'Risk Management', style: 'prioritizing stable returns...' },
    experimental: { emoji: '🧪', name: 'Innovation Focus', style: 'exploring emerging protocols...' }
  };

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['/api/depin/opportunities'],
    refetchInterval: 30000,
  });

  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['/api/depin/portfolio'],
    refetchInterval: 10000,
  });

  const deployMutation = useMutation({
    mutationFn: async (budget: number) => {
      return apiRequest('/api/depin/deploy', {
        method: 'POST',
        body: { budget }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/depin/portfolio'] });
    }
  });

  const optimizeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/depin/optimize', {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/depin/portfolio'] });
    }
  });

  const handleDeploy = () => {
    deployMutation.mutate(deploymentBudget);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'earning': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'deploying': return 'bg-yellow-500';
      case 'maintenance': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getROIColor = (roi: number) => {
    if (roi >= 100) return 'text-green-600';
    if (roi >= 50) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const portfolioSummary: PortfolioSummary = portfolio?.portfolio_summary || {
    total_nodes: 0,
    earning_nodes: 0,
    roi_achieved_nodes: 0,
    total_investment: 0,
    total_earnings: 0,
    current_roi: 0,
    projected_monthly_revenue: 0
  };

  const nodes: PortfolioNode[] = portfolio?.node_breakdown || [];
  const topOpportunities: DePINOpportunity[] = opportunities?.opportunities?.slice(0, 5) || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {traderPersonalities[traderPersonality].emoji} Quincy's Infrastructure Lab
          </h1>
          <p className="text-muted-foreground">
            {traderPersonalities[traderPersonality].name} - {traderPersonalities[traderPersonality].style}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={traderPersonality} 
            onChange={(e) => setTraderPersonality(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            {Object.entries(traderPersonalities).map(([key, personality]) => (
              <option key={key} value={key}>
                {personality.emoji} {personality.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <a href="/insights" className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
              📊 Public Insights
            </a>
            <Badge variant="outline" className="text-lg px-4 py-2">
              AI Trader
            </Badge>
          </div>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioSummary.total_investment.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{portfolioSummary.total_nodes} active nodes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${portfolioSummary.total_earnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{portfolioSummary.earning_nodes} earning nodes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getROIColor(portfolioSummary.current_roi)}`}>
              {portfolioSummary.current_roi.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">{portfolioSummary.roi_achieved_nodes} nodes achieved ROI</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioSummary.projected_monthly_revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">projected revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="opportunities">Market Opportunities</TabsTrigger>
          <TabsTrigger value="portfolio">Active Nodes</TabsTrigger>
          <TabsTrigger value="deploy">Deploy Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Opportunities</CardTitle>
              <CardDescription>
                Highest confidence DePIN infrastructure deployments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {opportunitiesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {topOpportunities.map((opp, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{opp.protocol}</h3>
                          <Badge variant="secondary">{opp.type}</Badge>
                          <Badge variant={opp.confidence >= 90 ? "default" : "outline"}>
                            {opp.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{opp.recommended_action}</p>
                        <div className="text-xs text-muted-foreground">
                          Market demand: {opp.market_demand}% | Competition: {opp.competition_level}%
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-semibold">${(opp.annual_revenue / 12).toFixed(0)}/month</div>
                        <div className="text-sm text-muted-foreground">${opp.deployment_cost} cost</div>
                        <div className="text-xs">ROI: {opp.roi_months} months</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Infrastructure Nodes</CardTitle>
              <CardDescription>
                Current DePIN deployments and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {portfolioLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : nodes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No infrastructure deployed yet. Start with the Deploy tab.
                </div>
              ) : (
                <div className="space-y-4">
                  {nodes.map((node) => (
                    <div key={node.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{node.protocol}</h3>
                          <Badge className={getStatusColor(node.status)}>
                            {node.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{node.region}</span>
                        </div>
                        <div className="space-y-1">
                          <Progress 
                            value={Math.min(100, node.roi_percentage)} 
                            className="w-48 h-2"
                          />
                          <div className="text-xs text-muted-foreground">
                            ROI Progress: {node.roi_percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-semibold text-green-600">
                          ${node.earnings_total.toFixed(2)} earned
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${node.deployment_cost} invested
                        </div>
                        <div className="text-xs">
                          ${node.monthly_revenue.toFixed(2)}/month target
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deploy New Infrastructure</CardTitle>
              <CardDescription>
                Expand your DePIN portfolio with optimal deployments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Deployment Budget</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={deploymentBudget}
                    onChange={(e) => setDeploymentBudget(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder="Enter budget amount"
                  />
                  <Button 
                    onClick={handleDeploy}
                    disabled={deployMutation.isPending}
                    className="px-6"
                  >
                    {deployMutation.isPending ? 'Deploying...' : 'Deploy Optimal Strategy'}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => optimizeMutation.mutate()}
                  disabled={optimizeMutation.isPending}
                  className="w-full"
                >
                  {optimizeMutation.isPending ? 'Optimizing...' : 'Optimize Existing Deployments'}
                </Button>
              </div>

              {opportunities?.market_analysis && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Market Analysis</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Opportunities:</span>
                      <span className="ml-2 font-medium">{opportunities.market_analysis.total_opportunities}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Confidence:</span>
                      <span className="ml-2 font-medium">{opportunities.market_analysis.avg_confidence.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Highest ROI:</span>
                      <span className="ml-2 font-medium">{(opportunities.market_analysis.highest_roi * 100).toFixed(1)}%/year</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recommended Budget:</span>
                      <span className="ml-2 font-medium">${opportunities.market_analysis.recommended_budget}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}