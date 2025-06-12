import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Zap } from 'lucide-react';
import { TransformersSecurityMonitor } from '@/components/TransformersSecurityMonitor';

interface DeFiPosition {
  protocol: string;
  type: 'lending' | 'borrowing' | 'staking' | 'liquidity' | 'farming' | 'leverage';
  tokenSymbol: string;
  amount: number;
  valueUSD: number;
  apy: number;
  healthFactor?: number;
  liquidationPrice?: number;
  rewards?: {
    tokenSymbol: string;
    amount: number;
    valueUSD: number;
  }[];
}

interface PortfolioBreakdown {
  wallet: number;
  lending: number;
  staking: number;
  liquidity: number;
  leverage: number;
  rewards: number;
}

interface PortfolioData {
  totalValue: number;
  breakdown: PortfolioBreakdown;
  positions: number;
  walletBalance: {
    SOL: number;
    tokens: Record<string, number>;
  };
  lastUpdated: string;
}

export default function PortfolioDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  // Fetch comprehensive portfolio status
  const { data: portfolioData, isLoading: portfolioLoading } = useQuery({
    queryKey: ['/api/portfolio/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch DeFi positions
  const { data: positionsData, isLoading: positionsLoading } = useQuery({
    queryKey: ['/api/portfolio/positions'],
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch protocol breakdown
  const { data: protocolsData, isLoading: protocolsLoading } = useQuery({
    queryKey: ['/api/portfolio/protocols'],
    refetchInterval: 60000,
  });

  // Fetch portfolio performance
  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ['/api/portfolio/performance', selectedTimeframe],
    refetchInterval: 30000,
  });

  const portfolio = portfolioData?.data || { totalValue: 0, positions: [], change24h: 0 } as PortfolioData;
  const positions = positionsData?.data?.positions || [] as DeFiPosition[];
  const protocols = protocolsData?.data?.protocols || [];
  const performance = performanceData?.data?.performance || { returns: [], metrics: {} };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPositionTypeColor = (type: string) => {
    const colors = {
      lending: 'bg-green-500',
      staking: 'bg-blue-500',
      liquidity: 'bg-purple-500',
      leverage: 'bg-orange-500',
      farming: 'bg-yellow-500',
      borrowing: 'bg-red-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  if (portfolioLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6" style={{ paddingTop: '5rem' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Portfolio Dashboard</h1>
            <p className="text-slate-400">Comprehensive DeFi position tracking</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Last Updated</div>
            <div className="text-white">
              {portfolio?.lastUpdated ? new Date(portfolio.lastUpdated).toLocaleTimeString() : 'Loading...'}
            </div>
          </div>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Portfolio Value */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {portfolio ? formatCurrency(portfolio.totalValue) : 'Loading...'}
              </div>
              {performance && (
                <div className="flex items-center space-x-1 text-sm">
                  {performance.percentage_change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  )}
                  <span className={performance.percentage_change >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatPercentage(performance.percentage_change)}
                  </span>
                  <span className="text-slate-400">({selectedTimeframe})</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wallet Balance */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Wallet Balance</CardTitle>
              <Activity className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {portfolio ? formatCurrency(portfolio.breakdown.wallet) : 'Loading...'}
              </div>
              <div className="text-sm text-slate-400">
                {portfolio ? `${portfolio.walletBalance.SOL.toFixed(4)} SOL` : 'Loading...'}
              </div>
            </CardContent>
          </Card>

          {/* DeFi Positions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">DeFi Positions</CardTitle>
              <PieChart className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {portfolio ? portfolio.positions : '0'}
              </div>
              <div className="text-sm text-slate-400">
                {portfolio ? formatCurrency(
                  portfolio.breakdown.lending + 
                  portfolio.breakdown.staking + 
                  portfolio.breakdown.liquidity + 
                  portfolio.breakdown.leverage
                ) : 'Loading...'}
              </div>
            </CardContent>
          </Card>

          {/* Active Protocols */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Protocols</CardTitle>
              <Zap className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {protocols ? Object.keys(protocols).length : '0'}
              </div>
              <div className="text-sm text-slate-400">
                Kamino, Drift, Marinade...
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Allocation */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Portfolio Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {portfolio && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Wallet Balance</span>
                    <span className="text-white">{formatCurrency(portfolio.breakdown.wallet)}</span>
                  </div>
                  <Progress 
                    value={(portfolio.breakdown.wallet / portfolio.totalValue) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">DeFi Lending</span>
                    <span className="text-white">{formatCurrency(portfolio.breakdown.lending)}</span>
                  </div>
                  <Progress 
                    value={(portfolio.breakdown.lending / portfolio.totalValue) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Staking Rewards</span>
                    <span className="text-white">{formatCurrency(portfolio.breakdown.staking)}</span>
                  </div>
                  <Progress 
                    value={(portfolio.breakdown.staking / portfolio.totalValue) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Liquidity Pools</span>
                    <span className="text-white">{formatCurrency(portfolio.breakdown.liquidity)}</span>
                  </div>
                  <Progress 
                    value={(portfolio.breakdown.liquidity / portfolio.totalValue) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Leverage Trading</span>
                    <span className="text-white">{formatCurrency(portfolio.breakdown.leverage)}</span>
                  </div>
                  <Progress 
                    value={(portfolio.breakdown.leverage / portfolio.totalValue) * 100} 
                    className="h-2"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Detailed Positions */}
        <Tabs defaultValue="positions" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="positions" className="text-slate-400 data-[state=active]:text-white">
              DeFi Positions
            </TabsTrigger>
            <TabsTrigger value="protocols" className="text-slate-400 data-[state=active]:text-white">
              Protocol Breakdown
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-slate-400 data-[state=active]:text-white">
              Performance
            </TabsTrigger>
            <TabsTrigger value="security" className="text-slate-400 data-[state=active]:text-white">
              Security Monitor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Active DeFi Positions</CardTitle>
              </CardHeader>
              <CardContent>
                {positions && positions.length > 0 ? (
                  <div className="space-y-4">
                    {positions.map((position, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getPositionTypeColor(position.type)}`}></div>
                          <div>
                            <div className="font-medium text-white">{position.protocol}</div>
                            <div className="text-sm text-slate-400">
                              {position.tokenSymbol} • {position.type}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">{formatCurrency(position.valueUSD)}</div>
                          <div className="text-sm text-green-400">{position.apy.toFixed(2)}% APY</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-slate-400">No active DeFi positions detected</div>
                    <div className="text-sm text-slate-500 mt-2">
                      Consider lending on Kamino (11% APY available)
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="protocols" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Protocol Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                {protocols ? (
                  <div className="space-y-4">
                    {Object.entries(protocols).map(([protocol, data]: [string, any]) => (
                      <div key={protocol} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{protocol}</div>
                          <div className="text-sm text-slate-400">
                            {data.positions} position{data.positions !== 1 ? 's' : ''} • {data.types.join(', ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">{formatCurrency(data.totalValue)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No protocol data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-white">
                      {performance ? formatPercentage(performance.percentage_change) : 'Loading...'}
                    </div>
                    <div className="text-sm text-slate-400">Total Return</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-white">87.4%</div>
                    <div className="text-sm text-slate-400">AI Consciousness</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">11.0%</div>
                    <div className="text-sm text-slate-400">Best Opportunity (Kamino)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <TransformersSecurityMonitor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}