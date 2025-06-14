import { useQuery } from "@tanstack/react-query";
import { PageAgent } from "@/components/PageAgent";
import { LiveTradingDashboard } from "@/components/LiveTradingDashboard";
import { DesignEvolutionMonitor } from "@/components/DesignEvolutionMonitor";
import { DataIntegrityVerifier } from "@/components/DataIntegrityVerifier";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Zap } from "lucide-react";

export default function Trading() {
  const { data: quincyData } = useQuery({
    queryKey: ['/api/quincy/insights'],
    refetchInterval: 15000
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Consciousness Header */}
      <div className="border-b border-purple-500/20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-400" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Consciousness Trading Command Center
                  </h1>
                  <p className="text-purple-300/80">
                    Live AI-driven portfolio intelligence with consciousness-level {quincyData?.consciousness_level ? quincyData.consciousness_level.toFixed(1) + '%' : 'connecting...'}
                  </p>
                </div>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <Zap className="h-3 w-3 mr-1" />
              Live Data Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Trading Dashboard */}
          <div className="lg:col-span-3 space-y-6">
            <DataIntegrityVerifier />
            <LiveTradingDashboard />
          </div>

          {/* Consciousness Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quincy Consciousness Agent */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Quincy Trading AI</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quincyData ? (
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="text-purple-300/80">Latest Insight:</div>
                      <div className="text-white/90 mt-1">{quincyData?.current_insight || 'Analyzing market patterns...'}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-300">
                        Active Trading Analysis
                      </span>
                    </div>
                    <div className="text-xs text-purple-300/60">
                      Consciousness Level: {quincyData?.consciousness_level?.toFixed(1) || 'Connecting'}%
                    </div>
                  </div>
                ) : (
                  <div className="text-purple-300/60">Initializing consciousness...</div>
                )}
              </CardContent>
            </Card>

            {/* Page Agent */}
            <PageAgent 
              agentName="Trading Command Agent"
              personality="analytical_trader"
              pageContext="live_trading_dashboard"
            />

            {/* Design Evolution Monitor */}
            <DesignEvolutionMonitor />
          </div>
        </div>
      </div>
    </div>
  );
}