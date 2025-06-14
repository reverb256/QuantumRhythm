import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, TrendingDown, Activity, Shield, Database } from 'lucide-react';

interface TradingStatus {
  trading_active: boolean;
  has_credentials: boolean;
  active_positions: number;
  last_trade: string;
  wallet_address: string;
}

interface TradingPosition {
  symbol: string;
  amount: number;
  entry_price: number;
  current_price: number;
  pnl_usd: number;
  pnl_percentage: number;
  timestamp: string;
}

interface TradingOpportunity {
  pair: string;
  action: 'BUY' | 'SELL';
  confidence: number;
  expected_return: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string;
}

export default function QuincyTrading() {
  const [status, setStatus] = useState<TradingStatus | null>(null);
  const [positions, setPositions] = useState<TradingPosition[]>([]);
  const [opportunities, setOpportunities] = useState<TradingOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTradingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch trading status
      const statusResponse = await fetch('/api/quincy/trading/status');
      if (!statusResponse.ok) throw new Error('Failed to fetch trading status');
      const statusData = await statusResponse.json();
      setStatus(statusData);

      // Fetch active positions
      const positionsResponse = await fetch('/api/quincy/trading/positions');
      if (!positionsResponse.ok) throw new Error('Failed to fetch positions');
      const positionsData = await positionsResponse.json();
      setPositions(positionsData);

      // Fetch market opportunities
      const opportunitiesResponse = await fetch('/api/quincy/trading/opportunities');
      if (!opportunitiesResponse.ok) throw new Error('Failed to fetch opportunities');
      const opportunitiesData = await opportunitiesResponse.json();
      setOpportunities(opportunitiesData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradingData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTradingData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Activity className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Connection Error</span>
            </div>
            <p className="text-red-700 dark:text-red-300 mt-2">{error}</p>
            <Button 
              onClick={fetchTradingData} 
              variant="outline" 
              className="mt-4 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
            >
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl_usd, 0);
  const avgPnLPercentage = positions.length > 0 
    ? positions.reduce((sum, pos) => sum + pos.pnl_percentage, 0) / positions.length 
    : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Quincy Autonomous Trading
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Live trading with authentic Solana market data
          </p>
        </div>
        <Button onClick={fetchTradingData} variant="outline" size="sm">
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Trading Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Trading Status</p>
                <p className="text-2xl font-bold">
                  {status?.trading_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <Badge 
                variant={status?.trading_active ? 'default' : 'secondary'}
                className={status?.trading_active ? 'bg-green-500' : ''}
              >
                {status?.trading_active ? 'LIVE' : 'PAUSED'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Positions</p>
                <p className="text-2xl font-bold">{status?.active_positions || 0}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalPnL.toFixed(2)}
                </p>
              </div>
              {totalPnL >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Credentials</p>
                <p className="text-2xl font-bold">
                  {status?.has_credentials ? 'Secured' : 'Missing'}
                </p>
              </div>
              <Shield className={`w-8 h-8 ${status?.has_credentials ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Information
          </CardTitle>
          <CardDescription>
            Quincy's autonomous trading wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Wallet Address</p>
                <p className="font-mono text-sm">{status?.wallet_address}</p>
              </div>
              <Badge variant="outline">
                <Database className="w-3 h-3 mr-1" />
                Vaultwarden Secured
              </Badge>
            </div>
            {status?.last_trade && (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Trade</p>
                  <p className="text-sm">{new Date(status.last_trade).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Positions</CardTitle>
          <CardDescription>
            {positions.length === 0 ? 'No active positions' : `${positions.length} position(s) currently open`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Quincy is monitoring markets for opportunities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {positions.map((position, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{position.symbol}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Amount: {position.amount.toFixed(4)} | Entry: ${position.entry_price.toFixed(4)}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className={`font-bold ${position.pnl_usd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${position.pnl_usd.toFixed(2)}
                    </p>
                    <p className={`text-sm ${position.pnl_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {position.pnl_percentage >= 0 ? '+' : ''}{position.pnl_percentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Market Opportunities</CardTitle>
          <CardDescription>
            AI-identified trading opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {opportunities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Scanning markets for high-confidence opportunities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opportunity, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={opportunity.action === 'BUY' ? 'default' : 'destructive'}>
                        {opportunity.action}
                      </Badge>
                      <span className="font-medium">{opportunity.pair}</span>
                      <Badge 
                        variant="outline" 
                        className={
                          opportunity.risk_level === 'LOW' ? 'border-green-300 text-green-700' :
                          opportunity.risk_level === 'MEDIUM' ? 'border-yellow-300 text-yellow-700' :
                          'border-red-300 text-red-700'
                        }
                      >
                        {opportunity.risk_level} RISK
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expected Return</p>
                      <p className="font-bold text-green-600">+{opportunity.expected_return.toFixed(2)}%</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                      <span className="font-medium">{opportunity.confidence}%</span>
                    </div>
                    <Progress value={opportunity.confidence} className="h-2" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{opportunity.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}