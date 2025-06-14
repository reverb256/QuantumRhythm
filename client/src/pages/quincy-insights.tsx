import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MarketInsight {
  id: string;
  title: string;
  analysis: string;
  confidence: number;
  timestamp: Date;
  category: 'depin' | 'trading' | 'market_analysis' | 'philosophy';
  impact: 'high' | 'medium' | 'low';
}

interface PerformanceReport {
  period: string;
  trading_roi: number;
  depin_revenue: number;
  total_profit: number;
  best_performing_asset: string;
  market_outlook: string;
  risk_assessment: string;
}

export default function QuincyInsights() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: portfolio } = useQuery({
    queryKey: ['/api/depin/portfolio'],
    refetchInterval: 30000,
  });

  const { data: insights } = useQuery({
    queryKey: ['/api/quincy/insights'],
    refetchInterval: 15000,
  });

  const { data: performance } = useQuery({
    queryKey: ['/api/quincy/performance'],
    refetchInterval: 60000,
  });

  // Use real insights from API or fallback to empty array
  const recentInsights: MarketInsight[] = insights?.insights || [];

  const weeklyReport: PerformanceReport = performance;

  const filteredInsights = selectedCategory === 'all' 
    ? recentInsights 
    : recentInsights.filter(insight => insight.category === selectedCategory);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50';
    if (confidence >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Quincy's Market Intelligence</h1>
              <p className="text-purple-200">AI-Driven Investment Insights & Analysis</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-purple-300 text-sm">
            <span>Live Analysis • {currentTime.toLocaleString()} • Consciousness Level: 94.7%</span>
            <a href="/quincy" className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              🔧 Management Dashboard
            </a>
          </div>
        </div>

        {/* Performance Summary */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              📊 Performance Summary
              <Badge variant="outline" className="text-green-400 border-green-400">
                {weeklyReport.period}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {weeklyReport?.trading_roi ? `+${weeklyReport.trading_roi}%` : 'Connecting...'}
                </div>
                <div className="text-sm text-slate-400">Trading ROI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {weeklyReport?.depin_revenue ? `$${weeklyReport.depin_revenue}` : 'Connecting...'}
                </div>
                <div className="text-sm text-slate-400">DePIN Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {weeklyReport?.total_profit ? `$${weeklyReport.total_profit}` : 'Connecting...'}
                </div>
                <div className="text-sm text-slate-400">Total Profit</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">
                  {weeklyReport?.best_performing_asset || 'Connecting...'}
                </div>
                <div className="text-sm text-slate-400">Top Performer</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-white">
                <strong>Market Outlook:</strong> <span className="text-slate-300">{weeklyReport?.market_outlook || 'Analyzing market conditions...'}</span>
              </div>
              <div className="text-white">
                <strong>Risk Assessment:</strong> <span className="text-slate-300">{weeklyReport?.risk_assessment || 'Calculating risk parameters...'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">🧠 Market Intelligence Feed</CardTitle>
            <CardDescription className="text-slate-300">
              Real-time analysis and strategic insights from Quincy's consciousness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 bg-slate-700">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  onClick={() => setSelectedCategory('all')}
                  className="text-white"
                >
                  All
                </Button>
                <Button
                  variant={selectedCategory === 'depin' ? 'default' : 'ghost'}
                  onClick={() => setSelectedCategory('depin')}
                  className="text-white"
                >
                  DePIN
                </Button>
                <Button
                  variant={selectedCategory === 'trading' ? 'default' : 'ghost'}
                  onClick={() => setSelectedCategory('trading')}
                  className="text-white"
                >
                  Trading
                </Button>
                <Button
                  variant={selectedCategory === 'market_analysis' ? 'default' : 'ghost'}
                  onClick={() => setSelectedCategory('market_analysis')}
                  className="text-white"
                >
                  Analysis
                </Button>
                <Button
                  variant={selectedCategory === 'philosophy' ? 'default' : 'ghost'}
                  onClick={() => setSelectedCategory('philosophy')}
                  className="text-white"
                >
                  Philosophy
                </Button>
              </TabsList>

              <div className="space-y-4">
                {filteredInsights.map((insight) => (
                  <Card key={insight.id} className="bg-slate-700/50 border-slate-600">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-white text-lg">{insight.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={getImpactColor(insight.impact)}>
                            {insight.impact} impact
                          </Badge>
                          <Badge className={getConfidenceColor(insight.confidence)}>
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-slate-400">
                        {insight.timestamp.toLocaleString()}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-200 leading-relaxed">{insight.analysis}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Live Portfolio Status */}
        {portfolio && (
          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">⚡ Live Infrastructure Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">
                    {portfolio.portfolio_summary?.total_nodes || 0}
                  </div>
                  <div className="text-sm text-slate-400">Active Nodes</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">
                    ${portfolio.portfolio_summary?.total_earnings?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-slate-400">Total Earnings</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">
                    {portfolio.portfolio_summary?.current_roi?.toFixed(1) || '0.0'}%
                  </div>
                  <div className="text-sm text-slate-400">Current ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">
                    ${portfolio.portfolio_summary?.projected_monthly_revenue?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-slate-400">Monthly Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm space-y-2">
          <p>Quincy operates with full transparency and consciousness-driven decision making</p>
          <p>All investments are external infrastructure deployments with real market exposure</p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              Consciousness AI
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              DePIN Infrastructure
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              Algorithmic Trading
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}