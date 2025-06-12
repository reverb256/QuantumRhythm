import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Zap, 
  Cloud, 
  GitBranch, 
  Shield,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Calendar,
  Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

interface CostData {
  provider: string;
  service: string;
  monthlyUsage: number;
  monthlyCost: number;
  freeLimit: number;
  usagePercent: number;
  projectedCost: number;
  optimizationPotential: number;
}

interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  savings: number;
  effort: 'easy' | 'medium' | 'complex';
  category: string;
}

const COLORS = ['#00d4ff', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function CostOptimizationDashboard() {
  const [costData, setCostData] = useState<CostData[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
    // Load cost data from APIs or local storage
    loadCostData();
    generateRecommendations();
  }, [timeRange]);

  const loadCostData = async () => {
    // Simulate API call to gather cost data from various sources
    const mockData: CostData[] = [
      {
        provider: 'Cloudflare',
        service: 'Workers',
        monthlyUsage: 45000,
        monthlyCost: 0,
        freeLimit: 100000,
        usagePercent: 45,
        projectedCost: 0,
        optimizationPotential: 0
      },
      {
        provider: 'Cloudflare',
        service: 'KV Storage',
        monthlyUsage: 850,
        monthlyCost: 0,
        freeLimit: 1000,
        usagePercent: 85,
        projectedCost: 5,
        optimizationPotential: 3
      },
      {
        provider: 'GitHub',
        service: 'Pages',
        monthlyUsage: 2500,
        monthlyCost: 0,
        freeLimit: 100000,
        usagePercent: 2.5,
        projectedCost: 0,
        optimizationPotential: 0
      },
      {
        provider: 'GitHub',
        service: 'Actions',
        monthlyUsage: 1800,
        monthlyCost: 0,
        freeLimit: 2000,
        usagePercent: 90,
        projectedCost: 8,
        optimizationPotential: 5
      },
      {
        provider: 'Vaultwarden',
        service: 'Self-Hosted',
        monthlyUsage: 100,
        monthlyCost: 0,
        freeLimit: 999999,
        usagePercent: 0.01,
        projectedCost: 0,
        optimizationPotential: 0
      }
    ];
    setCostData(mockData);
  };

  const generateRecommendations = () => {
    const mockRecommendations: OptimizationRecommendation[] = [
      {
        id: '1',
        title: 'Optimize KV Storage Usage',
        description: 'Implement TTL-based cache expiration to reduce KV storage by 30%',
        impact: 'medium',
        savings: 3,
        effort: 'easy',
        category: 'storage'
      },
      {
        id: '2',
        title: 'Cache GitHub Actions Artifacts',
        description: 'Use action caching to reduce build minutes by 40%',
        impact: 'high',
        savings: 5,
        effort: 'medium',
        category: 'ci-cd'
      },
      {
        id: '3',
        title: 'Implement Edge Caching',
        description: 'Add aggressive edge caching to reduce Worker requests by 25%',
        impact: 'high',
        savings: 12,
        effort: 'medium',
        category: 'performance'
      },
      {
        id: '4',
        title: 'Optimize Asset Compression',
        description: 'Enable Brotli compression to reduce bandwidth costs',
        impact: 'low',
        savings: 2,
        effort: 'easy',
        category: 'optimization'
      }
    ];
    setRecommendations(mockRecommendations);
    setTotalSavings(mockRecommendations.reduce((sum, rec) => sum + rec.savings, 0));
  };

  const chartData = [
    { month: 'Jan', cost: 0, projected: 2 },
    { month: 'Feb', cost: 0, projected: 3 },
    { month: 'Mar', cost: 0, projected: 4 },
    { month: 'Apr', cost: 0, projected: 6 },
    { month: 'May', cost: 0, projected: 8 },
    { month: 'Jun', cost: 0, projected: 13 }
  ];

  const pieData = costData.map((item, index) => ({
    name: `${item.provider} ${item.service}`,
    value: item.projectedCost,
    color: COLORS[index % COLORS.length]
  }));

  const getStatusIcon = (usagePercent: number) => {
    if (usagePercent > 80) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    if (usagePercent > 60) return <TrendingUp className="w-4 h-4 text-blue-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              Sovereign Cost Control
            </h1>
            <p className="text-gray-400 mt-2">
              Be your own bank. Full transparency. Zero intermediaries. Like Bitcoin.
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                🏛️ Sovereign
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                🔍 Transparent
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                ⚡ Self-Custodial
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Current Month Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$0.00</div>
              <p className="text-xs text-green-400">100% within free tiers</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Projected Cost</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${costData.reduce((sum, item) => sum + item.projectedCost, 0).toFixed(2)}
              </div>
              <p className="text-xs text-blue-400">Next month estimate</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Potential Savings</CardTitle>
              <TrendingDown className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalSavings}.00</div>
              <p className="text-xs text-purple-400">{recommendations.length} optimizations</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Efficiency Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">94%</div>
              <p className="text-xs text-cyan-400">Excellent optimization</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
                Cost Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="cost" stroke="#00d4ff" strokeWidth={2} />
                  <Line type="monotone" dataKey="projected" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-orange-400" />
                Sovereign Cost Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-gray-300">
                  <div className="text-2xl font-bold text-orange-400">$0.00</div>
                  <div className="text-sm">Current Monthly Spend</div>
                  <div className="text-xs text-green-400 mt-1">100% Free Tier Utilization</div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    ⚡ Lightning-Fast Infrastructure
                  </h4>
                  <div className="space-y-2">
                    {costData.map((service, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{service.provider} {service.service}</span>
                        <span className="text-orange-400 font-mono">
                          {service.monthlyCost === 0 ? 'FREE' : `$${service.monthlyCost}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-lg p-3">
                  <div className="text-orange-300 font-semibold text-sm mb-1">Bitcoin Principle</div>
                  <div className="text-xs text-gray-300">
                    "Don't trust, verify." Every cost is transparent and auditable.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Usage Details */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Cloud className="w-5 h-5 mr-2 text-blue-400" />
              Service Usage & Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {costData.map((service, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {service.provider === 'Cloudflare' && <Zap className="w-5 h-5 text-orange-400" />}
                      {service.provider === 'GitHub' && <GitBranch className="w-5 h-5 text-gray-400" />}
                      {service.provider === 'Vaultwarden' && <Shield className="w-5 h-5 text-green-400" />}
                      <div>
                        <h3 className="font-semibold text-white">{service.provider} {service.service}</h3>
                        <p className="text-sm text-gray-400">
                          {service.monthlyUsage.toLocaleString()} / {service.freeLimit.toLocaleString()} free limit
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(service.usagePercent)}
                      <div className="text-right">
                        <div className="text-white font-medium">
                          ${service.monthlyCost.toFixed(2)} / ${service.projectedCost.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">current / projected</div>
                      </div>
                    </div>
                  </div>
                  <Progress value={service.usagePercent} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{service.usagePercent.toFixed(1)}% used</span>
                    {service.optimizationPotential > 0 && (
                      <span className="text-purple-400">
                        ${service.optimizationPotential} optimization potential
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Recommendations */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <TrendingDown className="w-5 h-5 mr-2 text-purple-400" />
                Optimization Recommendations
              </div>
              <Badge className="bg-purple-600 text-white">
                ${totalSavings}/month potential savings
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-white">{rec.title}</h3>
                        <Badge className={getImpactColor(rec.impact)}>
                          {rec.impact} impact
                        </Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-600">
                          {rec.effort} effort
                        </Badge>
                      </div>
                      <p className="text-gray-400 mb-3">{rec.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-green-400">
                          💰 ${rec.savings}/month savings
                        </span>
                        <span className="text-blue-400">
                          🏷️ {rec.category}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-purple-600 ml-4">
                      Implement
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}