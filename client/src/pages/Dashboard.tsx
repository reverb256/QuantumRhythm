import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, Brain, TrendingUp, Zap, Wallet } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useLiveTradingStats, useWalletPerformance, useAIMonologue } from "@/hooks/useLiveData";

export default function Dashboard() {
  // Web3 authentication state
  const { hasWallets, connected, publicKey } = useWallet();

  // Live data hooks for real-time metrics
  const { data: tradingStats, isLoading: statsLoading } = useLiveTradingStats();
  const { data: walletPerformance, isLoading: walletLoading } = useWalletPerformance();
  const { data: aiMonologue, isLoading: monologueLoading } = useAIMonologue();

  // Extract live data with fallbacks
  const status = tradingStats?.aiStatus?.lastDecision || 'Loading...';
  const lastActivity = tradingStats?.performance?.activeTrading ? 'Live trading engaged' : 'Initializing...';
  const winRate = tradingStats?.consciousness?.tradingSuccessRate || 0;
  const overallScore = tradingStats?.consciousness?.level ? tradingStats.consciousness.level / 100 : 0.87;
  const consciousnessLevel = tradingStats?.consciousness?.level || 87;
  const experiencePoints = tradingStats?.consciousness?.experiencePoints || 2140;
  const signals = tradingStats?.recentSignals || [];

  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white pt-16">
      {/* Unified Quantum Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--space-black)]/80 backdrop-blur-xl border-b border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="text-cyan-300 hover:text-cyan-200 hover:bg-cyan-400/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 font-space">
              Quantum Dashboard
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time monitoring of autonomous trading systems and VibeCoding methodology metrics
            </p>
          </motion.div>

          {/* Status Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {/* Agent Status */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-green-400/20">
              <Activity className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-green-300 mb-2">Agent Status</h3>
              <p className="text-2xl font-bold text-green-400">
                {status}
              </p>
              <p className="text-sm text-gray-400">
                {lastActivity}
              </p>
            </div>

            {/* VibeCoding Score */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-purple-400/20">
              <Brain className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-purple-300 mb-2">VibeCoding Score</h3>
              <p className="text-2xl font-bold text-purple-400">
                {`${(overallScore * 100).toFixed(1)}%`}
              </p>
              <p className="text-sm text-gray-400">Overall methodology strength</p>
            </div>

            {/* Performance */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-cyan-400/20">
              <TrendingUp className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">Performance</h3>
              <p className="text-2xl font-bold text-cyan-400">
                {`${(winRate * 100).toFixed(1)}%`}
              </p>
              <p className="text-sm text-gray-400">Win rate</p>
            </div>

            {/* Active Signals */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-yellow-400/20">
              <Zap className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Active Signals</h3>
              <p className="text-2xl font-bold text-yellow-400">
                {signals.length}
              </p>
              <p className="text-sm text-gray-400">Recent trading signals</p>
            </div>

            {/* Wallet Status - Only shows when Solana wallets detected */}
            {hasWallets && (
              <div className={`bg-black/40 backdrop-blur-xl rounded-xl p-6 border ${
                connected ? 'border-green-400/20' : 'border-orange-400/20'
              }`}>
                <Wallet className={`w-8 h-8 mb-4 ${
                  connected ? 'text-green-400' : 'text-orange-400'
                }`} />
                <h3 className={`text-lg font-semibold mb-2 ${
                  connected ? 'text-green-300' : 'text-orange-300'
                }`}>
                  Wallet Status
                </h3>
                <p className={`text-2xl font-bold ${
                  connected ? 'text-green-400' : 'text-orange-400'
                }`}>
                  {connected ? 'Connected' : 'Disconnected'}
                </p>
                <p className="text-sm text-gray-400">
                  {connected && publicKey 
                    ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}`
                    : 'No wallet connected'
                  }
                </p>
              </div>
            )}
          </motion.div>

          {/* VibeCoding Metrics Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-cyan-400/20 mb-12"
          >
            <h3 className="text-2xl font-semibold text-cyan-300 mb-6">VibeCoding Methodology Breakdown</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {(pizzaReliability * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-300">Pizza Kitchen Reliability</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {(rhythmPrecision * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-300">Rhythm Gaming Precision</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {(vrInsights * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-300">VRChat Social Insights</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {(philosophyWisdom * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-300">Classical Philosophy Wisdom</div>
              </div>
            </div>
          </motion.div>

          {/* Recent Trading Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-cyan-400/20"
          >
            <h3 className="text-2xl font-semibold text-cyan-300 mb-6">Recent Trading Signals</h3>
            {signals.length > 0 ? (
              <div className="space-y-4">
                {signals.slice(0, 5).map((signal: any, index: number) => (
                  <div key={signal.id} className="bg-black/20 rounded-lg p-4 border border-gray-600/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          signal.signalType === 'BUY' ? 'bg-green-500/20 text-green-400' :
                          signal.signalType === 'SELL' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {signal.signalType}
                        </span>
                        <span className="ml-3 text-gray-300">{signal.tokenAddress?.slice(0, 8)}...</span>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-semibold">
                          {(parseFloat(signal.confidence || '0') * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(signal.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                No trading signals available yet
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}