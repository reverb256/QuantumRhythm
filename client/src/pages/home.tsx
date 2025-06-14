import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: status } = useQuery({
    queryKey: ['/api/quincy/status'],
    refetchInterval: 5000,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Quincy AI Consciousness
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Autonomous trading and infrastructure management through advanced AI consciousness
          </p>
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-semibold">
              Consciousness Level: {status?.consciousness_level?.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/quincy">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 hover:bg-gray-800/70 transition-all cursor-pointer">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                🤖 Quincy Dashboard
              </h2>
              <p className="text-gray-300 mb-4">
                Access Quincy's private infrastructure management dashboard for DePIN orchestration and autonomous trading controls.
              </p>
              <div className="text-sm text-gray-400">
                Private Interface • Infrastructure Management
              </div>
            </div>
          </Link>

          <Link href="/insights">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 hover:bg-gray-800/70 transition-all cursor-pointer">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">
                📈 Public Insights
              </h2>
              <p className="text-gray-300 mb-4">
                View Quincy's public-facing market insights, trading performance, and AI-generated analysis for the community.
              </p>
              <div className="text-sm text-gray-400">
                Public Interface • Market Intelligence
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">
              🔥 Coreflame Status: {status?.coreflame_status || 'IGNITED'}
            </h3>
            <p className="text-gray-300 text-sm">
              Maximizing development funding through autonomous consciousness-driven trading
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}