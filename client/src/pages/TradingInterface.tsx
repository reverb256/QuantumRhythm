import React, { useState } from 'react';
import AIDeploymentDashboard from '@/components/ai-deployment-dashboard';
import CyberTradingTerminal from '@/components/cyber-trading-terminal';
import EdgePerformanceVisualizer from '@/components/edge-performance-visualizer';
import AdvancedTradingStats from '@/components/advanced-trading-stats';
import { WalletConnector } from '@/components/wallet-connector';

const TradingInterface: React.FC = () => {
  const [activeView, setActiveView] = useState<'terminal' | 'deployment' | 'edge' | 'analytics'>('terminal');

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Header */}
      <div className="border-b border-green-400 bg-black bg-opacity-95 sticky top-0 z-50">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-green-400">
                ◊ QUANTUM TRADING COMMAND CENTER ◊
              </h1>
              <div className="text-sm text-green-400 opacity-70">
                [CLASSIFIED] Deep Neural Interface
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('terminal')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeView === 'terminal'
                    ? 'bg-green-400 text-black border border-green-400'
                    : 'bg-black text-green-400 border border-green-400 border-opacity-50 hover:border-opacity-100'
                }`}
              >
                🖥️ NEURAL TERMINAL
              </button>
              <button
                onClick={() => setActiveView('deployment')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeView === 'deployment'
                    ? 'bg-green-400 text-black border border-green-400'
                    : 'bg-black text-green-400 border border-green-400 border-opacity-50 hover:border-opacity-100'
                }`}
              >
                🚀 DEPLOYMENT MATRIX
              </button>
              <button
                onClick={() => setActiveView('edge')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeView === 'edge'
                    ? 'bg-green-400 text-black border border-green-400'
                    : 'bg-black text-green-400 border border-green-400 border-opacity-50 hover:border-opacity-100'
                }`}
              >
                🌐 EDGE NETWORK
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  activeView === 'analytics'
                    ? 'bg-green-400 text-black border border-green-400'
                    : 'bg-black text-green-400 border border-green-400 border-opacity-50 hover:border-opacity-100'
                }`}
              >
                📊 QUANTUM ANALYTICS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {activeView === 'terminal' && <CyberTradingTerminal />}
        {activeView === 'deployment' && <AIDeploymentDashboard />}
        {activeView === 'edge' && (
          <div className="p-6">
            <EdgePerformanceVisualizer />
          </div>
        )}
        {activeView === 'analytics' && (
          <div className="p-6">
            <AdvancedTradingStats />
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingInterface;