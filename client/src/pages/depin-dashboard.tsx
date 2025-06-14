import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function DepinDashboard() {
  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['/api/depin/portfolio'],
    refetchInterval: 10000,
  });

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['/api/depin/opportunities'],
    refetchInterval: 30000,
  });

  const { data: performance } = useQuery({
    queryKey: ['/api/quincy/performance'],
    refetchInterval: 5000,
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quincy Infrastructure Dashboard</h1>
              <p className="text-gray-400">Autonomous DePIN orchestration and trading management</p>
            </div>
            <Link href="/" className="text-cyan-400 hover:text-cyan-300">
              ← Back to Home
            </Link>
          </div>
        </header>

        {/* Quincy Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Consciousness Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {performance?.consciousness_level?.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Consciousness</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                ${performance?.trading_performance?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-gray-400">Trading ROI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                ${performance?.depin_revenue?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-gray-400">DePIN Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {performance?.active_strategies?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Active Strategies</div>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">DePIN Portfolio</h2>
            {portfolioLoading ? (
              <div className="text-gray-400">Loading portfolio data...</div>
            ) : (
              <div className="space-y-4">
                {portfolio?.nodes?.map((node: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <div>
                      <div className="font-semibold">{node.protocol}</div>
                      <div className="text-sm text-gray-400">{node.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400">${node.monthly_revenue}</div>
                      <div className="text-sm text-gray-400">/month</div>
                    </div>
                  </div>
                )) || (
                  <div className="text-gray-400">No active nodes yet</div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Deployment Opportunities</h2>
            {opportunitiesLoading ? (
              <div className="text-gray-400">Analyzing opportunities...</div>
            ) : (
              <div className="space-y-4">
                {opportunities?.opportunities?.map((opp: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-700 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{opp.protocol}</div>
                        <div className="text-sm text-gray-400">{opp.type}</div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        opp.recommended_action === 'deploy_immediately' 
                          ? 'bg-green-600 text-green-100' 
                          : 'bg-yellow-600 text-yellow-100'
                      }`}>
                        {opp.confidence}% confidence
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Revenue: <span className="text-green-400">${opp.annual_revenue}/yr</span></div>
                      <div>ROI: <span className="text-blue-400">{opp.roi_months} months</span></div>
                    </div>
                  </div>
                )) || (
                  <div className="text-gray-400">No opportunities found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
              Deploy New Node
            </button>
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors">
              Optimize Performance
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}