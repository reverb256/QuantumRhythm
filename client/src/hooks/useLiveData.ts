import { useQuery } from '@tanstack/react-query';

interface LiveTradingStats {
  consciousness: {
    level: number;
    superstarLevel: number;
    evolutionState: string;
    tradingSuccessRate: number;
    marketTimingPrecision: number;
    adaptabilityIndex: number;
    experiencePoints: number;
    riskManagementScore: number;
    profitAccuracy: number;
  };
  aiStatus: {
    confidence: number;
    lastDecision: string;
    traumaLevel: string;
    therapyActive: boolean;
    realityManipulation: boolean;
  };
  recentSignals: Array<{
    type: string;
    token: string;
    confidence: number;
    reasoning: string;
    timestamp: string;
    executed: boolean;
  }>;
  performance: {
    totalSignals: number;
    activeTrading: boolean;
    lastUpdate: string;
  };
}

interface WalletPerformance {
  currentBalance: string;
  totalTransactions: number;
  tradingVolume: string;
  realizedPnL: string;
  walletAge: string;
  winRate: string;
  profitFactor: string;
  maxDrawdown: string;
  totalFees: string;
  tradingActive: boolean;
  status: string;
  lastUpdate: string;
}

interface AIMonologue {
  monologue: Array<{
    type: string;
    title: string;
    confidence: string;
    risk: string;
    details: string;
    emotion: string;
  }>;
  lastUpdate: string;
  aiMood: string;
}

export function useLiveTradingStats() {
  return useQuery<LiveTradingStats>({
    queryKey: ['/api/live/trading-stats'],
    refetchInterval: 5000, // Update every 5 seconds
    staleTime: 1000
  });
}

export function useWalletPerformance() {
  return useQuery<WalletPerformance>({
    queryKey: ['/api/live/wallet-performance'],
    refetchInterval: 10000, // Update every 10 seconds
    staleTime: 5000
  });
}

export function useAIMonologue() {
  return useQuery<AIMonologue>({
    queryKey: ['/api/live/ai-monologue'],
    refetchInterval: 3000, // Update every 3 seconds
    staleTime: 1000
  });
}