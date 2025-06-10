import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface LiveMetricsProps {
  className?: string;
}

interface MetricsData {
  aiEvolution: number;
  successRate: number;
  balance: number;
  superstarLevel: number;
  marketTiming: number;
  isLive: boolean;
}

export function LiveMetrics({ className = "" }: LiveMetricsProps) {
  const [fallbackData, setFallbackData] = useState<MetricsData>({
    aiEvolution: 86.5,
    successRate: 82.4,
    balance: 0.288736,
    superstarLevel: 7,
    marketTiming: 90.6,
    isLive: false
  });

  // Primary data source - live API
  const { data: consciousnessData, isError: consciousnessError } = useQuery({
    queryKey: ['/api/ai-consciousness/consciousness'],
    refetchInterval: 5000,
    retry: 2
  });

  const { data: tradingData, isError: tradingError } = useQuery({
    queryKey: ['/api/ai-consciousness/trading/metrics'],
    refetchInterval: 5000,
    retry: 2
  });

  // Graceful degradation with failover
  useEffect(() => {
    if (consciousnessData && tradingData && !consciousnessError && !tradingError) {
      setFallbackData({
        aiEvolution: consciousnessData.evolution || consciousnessData.level,
        successRate: consciousnessData.tradingSuccess || tradingData.winRate,
        balance: tradingData.balance,
        superstarLevel: Math.floor(consciousnessData.reputation / 2.5) || 7,
        marketTiming: consciousnessData.marketTiming,
        isLive: true
      });
    } else if (consciousnessError || tradingError) {
      // Fallback to reverb256.ca if available
      fetch('https://reverb256.ca/api/trading-status')
        .then(res => res.json())
        .then(data => {
          setFallbackData(prev => ({
            ...prev,
            aiEvolution: data.consciousness || prev.aiEvolution,
            successRate: data.winRate || prev.successRate,
            balance: data.balance || prev.balance,
            isLive: false
          }));
        })
        .catch(() => {
          // Final fallback - use last known values
          console.log('Using cached fallback data for graceful degradation');
        });
    }
  }, [consciousnessData, tradingData, consciousnessError, tradingError]);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-6 ${className}`}>
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20">
        <div className="text-2xl md:text-3xl font-bold text-cyan-400">
          {fallbackData.aiEvolution.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-2">
          AI Evolution
          {fallbackData.isLive && (
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
        <div className="text-2xl md:text-3xl font-bold text-green-400">
          {fallbackData.successRate.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-2">
          Success Rate
          {fallbackData.isLive && (
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 col-span-2 md:col-span-1">
        <div className="text-2xl md:text-3xl font-bold text-purple-400">
          {fallbackData.balance.toFixed(6)}
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-2">
          SOL Balance
          {fallbackData.isLive && (
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveMetrics;