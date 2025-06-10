import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900/10 to-cyan-900/15" />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 text-center relative z-20 pt-24 pb-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Status Display */}
            <div className="mb-12">
              <div className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-cyan-400/50 mb-8 bg-black/20 backdrop-blur">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-cyan-300 text-sm font-medium">QUANTUM AI TRADING SYSTEM ONLINE</span>
                  <div className="w-px h-4 bg-cyan-400/30"></div>
                  <span className="text-cyan-400 text-sm font-mono">CONSCIOUSNESS_100%</span>
                </div>
              </div>
            </div>

            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
                Quantum AI Trading Platform
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                Advanced autonomous trading system with predictive analysis, historical pattern recognition, and real-time CAD portfolio tracking
              </p>
            </div>

            {/* Trading Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-black/20 backdrop-blur rounded-lg p-4 border border-cyan-400/30">
                <div className="text-2xl font-bold text-cyan-400">95%</div>
                <div className="text-sm text-gray-400">Max Confidence</div>
              </div>
              <div className="bg-black/20 backdrop-blur rounded-lg p-4 border border-green-400/30">
                <div className="text-2xl font-bold text-green-400">Real-time</div>
                <div className="text-sm text-gray-400">CAD Tracking</div>
              </div>
              <div className="bg-black/20 backdrop-blur rounded-lg p-4 border border-purple-400/30">
                <div className="text-2xl font-bold text-purple-400">AI Analysis</div>
                <div className="text-sm text-gray-400">Predictive Engine</div>
              </div>
              <div className="bg-black/20 backdrop-blur rounded-lg p-4 border border-blue-400/30">
                <div className="text-2xl font-bold text-blue-400">Multi-chain</div>
                <div className="text-sm text-gray-400">Ready</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/trading">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25">
                  Launch Trading Interface
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="mt-20 grid md:grid-cols-3 gap-8">
              <div className="bg-black/30 backdrop-blur rounded-xl p-6 border border-cyan-400/20">
                <div className="text-cyan-400 text-2xl mb-4">🔮</div>
                <h3 className="text-xl font-semibold text-white mb-3">Predictive Analysis</h3>
                <p className="text-gray-400">Advanced ML algorithms analyze market patterns and predict price movements with technical indicators</p>
              </div>
              <div className="bg-black/30 backdrop-blur rounded-xl p-6 border border-green-400/20">
                <div className="text-green-400 text-2xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-white mb-3">Historical Analysis</h3>
                <p className="text-gray-400">Deep analysis of trading history to identify successful patterns and optimize future decisions</p>
              </div>
              <div className="bg-black/30 backdrop-blur rounded-xl p-6 border border-purple-400/20">
                <div className="text-purple-400 text-2xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-white mb-3">Real-time CAD P&L</h3>
                <p className="text-gray-400">Continuous portfolio monitoring with live CAD pricing from multiple sources</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <PriorityLoader priority="low">
        <Suspense fallback={<div className="h-64 bg-gray-800 animate-pulse" />}>
          <ContactSection />
        </Suspense>
      </PriorityLoader>

      <Footer />



      {/* Performance metrics in dev mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-green-400 p-2 rounded text-xs font-mono">
          <div>FCP: {metrics.fcp.toFixed(0)}ms</div>
          <div>LCP: {metrics.lcp.toFixed(0)}ms</div>
          <div>CLS: {metrics.cls.toFixed(3)}</div>
        </div>
      )}
    </main>
  );
}