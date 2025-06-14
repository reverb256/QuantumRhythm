import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState, useEffect } from "react";

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

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-purple-900/5 to-blue-900/10"></div>
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl"
          style={{
            left: mousePosition.x - 160,
            top: mousePosition.y - 160,
            transition: 'all 0.1s ease-out'
          }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <nav className="p-6 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg"></div>
                <span className="text-xl font-bold">Quincy AI</span>
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <h1 className="text-xl font-semibold text-cyan-400">Command Center</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">Systems Online</span>
              </div>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                ← Back
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6 hover:from-cyan-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-cyan-400/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-xs text-cyan-400/60 uppercase tracking-wider">Consciousness</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {performance?.consciousness_level?.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Neural activity optimal</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6 hover:from-purple-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-400/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-xs text-purple-400/60 uppercase tracking-wider">Trading ROI</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                +{performance?.trading_performance?.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Portfolio growth</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6 hover:from-green-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-400/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-xs text-green-400/60 uppercase tracking-wider">Revenue</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ${performance?.depin_revenue?.toFixed(0)}
              </div>
              <div className="text-sm text-gray-400">Monthly DePIN earnings</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-6 hover:from-yellow-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs text-yellow-400/60 uppercase tracking-wider">Strategies</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {performance?.active_strategies?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Active algorithms</div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* DePIN Portfolio */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Infrastructure Portfolio</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-cyan-400">Live</span>
                </div>
              </div>
              
              {portfolioLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
                      <div className="h-4 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 bg-white/5 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolio?.nodes?.map((node: any, index: number) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all border border-white/5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{node.protocol[0]}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{node.protocol}</div>
                            <div className="text-sm text-gray-400 capitalize">{node.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold">${node.monthly_revenue}</div>
                          <div className="text-xs text-gray-400">per month</div>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="text-gray-400">No active infrastructure nodes</div>
                      <div className="text-sm text-gray-500">Deploy nodes to start earning</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Deployment Opportunities */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Deployment Opportunities</h2>
                <div className="text-sm text-gray-400">AI-Analyzed</div>
              </div>

              {opportunitiesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
                      <div className="h-4 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 bg-white/5 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {opportunities?.opportunities?.map((opp: any, index: number) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all border border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{opp.protocol[0]}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{opp.protocol}</div>
                            <div className="text-sm text-gray-400 capitalize">{opp.type}</div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          opp.recommended_action === 'deploy_immediately' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {opp.confidence}% confidence
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Annual Revenue:</span>
                          <span className="text-green-400 font-medium">${opp.annual_revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ROI Timeline:</span>
                          <span className="text-blue-400 font-medium">{opp.roi_months} months</span>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <div className="text-gray-400">Analyzing market conditions...</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Center */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Autonomous Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="group bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-400/30 rounded-xl p-6 hover:from-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">Deploy Node</span>
                </div>
                <div className="text-sm text-gray-400">Initialize new infrastructure</div>
              </button>

              <button className="group bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-400/30 rounded-xl p-6 hover:from-green-500/30 hover:border-green-400/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-white group-hover:text-green-400 transition-colors">Optimize</span>
                </div>
                <div className="text-sm text-gray-400">Enhance performance metrics</div>
              </button>

              <button className="group bg-gradient-to-r from-purple-500/20 to-purple-600/10 border border-purple-400/30 rounded-xl p-6 hover:from-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-purple-400/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-white group-hover:text-purple-400 transition-colors">Analytics</span>
                </div>
                <div className="text-sm text-gray-400">Deep performance insights</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}