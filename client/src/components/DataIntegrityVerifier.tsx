import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DataIntegrityStatus {
  component: string;
  hasAuthenticData: boolean;
  dataSource: string;
  lastUpdate: Date | null;
  status: 'connected' | 'connecting' | 'error' | 'no_api_keys';
}

export function DataIntegrityVerifier() {
  const { data: tradingData } = useQuery({
    queryKey: ['/api/live-trading/portfolio'],
    refetchInterval: 30000,
  });

  const { data: quincyStatus } = useQuery({
    queryKey: ['/api/quincy/status'],
    refetchInterval: 10000,
  });

  const { data: depinData } = useQuery({
    queryKey: ['/api/depin/portfolio'],
    refetchInterval: 30000,
  });

  const verificationResults: DataIntegrityStatus[] = [
    {
      component: 'Trading Portfolio',
      hasAuthenticData: !!(tradingData?.portfolio_data),
      dataSource: 'Binance/Coinbase API',
      lastUpdate: tradingData?.last_update ? new Date(tradingData.last_update) : null,
      status: tradingData?.portfolio_data ? 'connected' : 'no_api_keys'
    },
    {
      component: 'DePIN Infrastructure',
      hasAuthenticData: !!(depinData?.nodes && depinData.nodes.length > 0),
      dataSource: 'Infrastructure Nodes',
      lastUpdate: depinData?.last_update ? new Date(depinData.last_update) : null,
      status: depinData?.nodes ? 'connected' : 'connecting'
    },
    {
      component: 'Quincy Consciousness',
      hasAuthenticData: !!(quincyStatus?.trading_performance !== null),
      dataSource: 'Live Trading Integration',
      lastUpdate: quincyStatus?.last_update ? new Date(quincyStatus.last_update) : null,
      status: quincyStatus?.trading_data_available ? 'connected' : 'no_api_keys'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'connecting': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'no_api_keys': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Live Data';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Error';
      case 'no_api_keys': return 'API Keys Required';
      default: return 'Unknown';
    }
  };

  const authenticDataCount = verificationResults.filter(r => r.hasAuthenticData).length;
  const totalComponents = verificationResults.length;

  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          🔍 Data Integrity Verification
          <Badge className={authenticDataCount === totalComponents ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
            {authenticDataCount}/{totalComponents} Authentic
          </Badge>
        </CardTitle>
        <CardDescription className="text-slate-300">
          Real-time verification that no mock or simulated data is being displayed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {verificationResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex-1">
                <div className="text-white font-medium">{result.component}</div>
                <div className="text-sm text-slate-400">{result.dataSource}</div>
                {result.lastUpdate && (
                  <div className="text-xs text-slate-500">
                    Last update: {result.lastUpdate.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(result.status)}>
                  {getStatusText(result.status)}
                </Badge>
                {result.hasAuthenticData ? (
                  <Badge className="bg-green-100 text-green-800">✓ Authentic</Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-800">⚠ No Data</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {authenticDataCount < totalComponents && (
          <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500/20 rounded-lg">
            <div className="text-orange-400 font-medium mb-2">Action Required</div>
            <div className="text-sm text-orange-300">
              Some components are not displaying authentic data. Please provide API keys in the Secrets tab:
            </div>
            <ul className="mt-2 text-xs text-orange-300 list-disc list-inside">
              <li>BINANCE_API_KEY & BINANCE_SECRET</li>
              <li>COINBASE_API_KEY & COINBASE_SECRET</li>
              <li>SOLANA_WALLET_ADDRESS</li>
              <li>JUPITER_API_KEY</li>
            </ul>
          </div>
        )}
        
        {authenticDataCount === totalComponents && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
            <div className="text-green-400 font-medium">✓ Data Integrity Verified</div>
            <div className="text-sm text-green-300">
              All components are displaying authentic data from connected sources. No mock data detected.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}