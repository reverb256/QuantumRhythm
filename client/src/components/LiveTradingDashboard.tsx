import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Wallet, Activity, AlertCircle } from "lucide-react";

interface TradingData {
  portfolio_data: {
    total_value_usd: number;
    total_pnl_24h: number;
    total_pnl_percentage: number;
    active_positions: number;
    last_trade_timestamp: string;
    trading_pairs: string[];
    performance_metrics: {
      win_rate: number;
      avg_profit_per_trade: number;
      max_drawdown: number;
      sharpe_ratio: number;
    };
  } | null;
  solana_data: {
    sol_balance: number;
    token_balances: Array<{
      mint: string;
      symbol: string;
      balance: number;
      value_usd: number;
    }>;
    total_value_usd: number;
    recent_transactions: Array<{
      signature: string;
      type: 'buy' | 'sell' | 'swap';
      amount: number;
      symbol: string;
      timestamp: string;
    }>;
  } | null;
  total_value: number;
  connection_status: string;
  is_live_data: boolean;
  last_update: string;
}

export function LiveTradingDashboard() {
  const { data: tradingData, isLoading, error } = useQuery<TradingData>({
    queryKey: ['/api/trading/portfolio'],
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: false
  });

  const { data: statusData } = useQuery({
    queryKey: ['/api/trading/status'],
    refetchInterval: 10000 // Status check every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 animate-spin" />
              <span>Connecting to live trading data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !tradingData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-yellow-600">
            <AlertCircle className="h-4 w-4" />
            <span>Waiting for trading API configuration</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Configure your wallet address and API keys to display live portfolio data
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getConnectionStatusColor = (status: string) => {
    if (status.includes('Connected')) return 'bg-green-100 text-green-800';
    if (status.includes('Waiting')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Live Trading Connection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge className={getConnectionStatusColor(tradingData.connection_status)}>
              {tradingData.connection_status}
            </Badge>
            <div className="text-sm text-gray-500">
              {tradingData.is_live_data ? 'Live Data' : 'Demo Mode'}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Last update: {new Date(tradingData.last_update).toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Total Portfolio Value</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatCurrency(tradingData.total_value)}
          </div>
          {tradingData.portfolio_data && (
            <div className="flex items-center space-x-2 mt-2">
              {tradingData.portfolio_data.total_pnl_24h >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={tradingData.portfolio_data.total_pnl_24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(tradingData.portfolio_data.total_pnl_24h)} (
                {formatPercentage(tradingData.portfolio_data.total_pnl_percentage)})
              </span>
              <span className="text-gray-500">24h</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solana Wallet */}
      {tradingData.solana_data && (
        <Card>
          <CardHeader>
            <CardTitle>Solana DeFi Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-semibold">
                  {formatCurrency(tradingData.solana_data.total_value_usd)}
                </div>
                <div className="text-sm text-gray-500">Total DeFi Value</div>
                <div className="mt-2">
                  <div className="text-sm">
                    SOL: {tradingData.solana_data.sol_balance.toFixed(4)}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Token Holdings</div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {tradingData.solana_data.token_balances.map((token, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span>{token.symbol}</span>
                      <span>{formatCurrency(token.value_usd)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading Performance */}
      {tradingData.portfolio_data && (
        <Card>
          <CardHeader>
            <CardTitle>Trading Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-lg font-semibold">
                  {tradingData.portfolio_data.active_positions}
                </div>
                <div className="text-sm text-gray-500">Active Positions</div>
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {formatPercentage(tradingData.portfolio_data.performance_metrics.win_rate)}
                </div>
                <div className="text-sm text-gray-500">Win Rate</div>
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {formatCurrency(tradingData.portfolio_data.performance_metrics.avg_profit_per_trade)}
                </div>
                <div className="text-sm text-gray-500">Avg Profit/Trade</div>
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {tradingData.portfolio_data.performance_metrics.sharpe_ratio.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Sharpe Ratio</div>
              </div>
            </div>
            
            {/* Risk Metrics */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Max Drawdown</span>
                <span className="text-sm font-medium">
                  {formatPercentage(tradingData.portfolio_data.performance_metrics.max_drawdown)}
                </span>
              </div>
              <Progress 
                value={Math.abs(tradingData.portfolio_data.performance_metrics.max_drawdown)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      {tradingData.solana_data?.recent_transactions && tradingData.solana_data.recent_transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tradingData.solana_data.recent_transactions.slice(0, 5).map((tx, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-2">
                    <Badge variant={tx.type === 'buy' ? 'default' : 'secondary'}>
                      {tx.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm">{tx.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{tx.amount.toFixed(4)}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Sources Status */}
      {statusData && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Data Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${statusData.data_sources.solana ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className="text-xs">Solana</div>
              </div>
              <div className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${statusData.data_sources.binance ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className="text-xs">Binance</div>
              </div>
              <div className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${statusData.data_sources.coinbase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className="text-xs">Coinbase</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}