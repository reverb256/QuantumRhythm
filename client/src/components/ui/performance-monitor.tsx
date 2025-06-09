import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceMetrics {
  loadTime: number;
  domNodes: number;
  memoryUsage: number;
  fps: number;
  paintMetrics: {
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
  };
  jsHeapSize: number;
  networkRequests: number;
}

interface SecurityAuditResult {
  csp: boolean;
  https: boolean;
  xssProtection: boolean;
  clickjackProtection: boolean;
  mixedContent: boolean;
  score: number;
}

export default function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [security, setSecurity] = useState<SecurityAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runPerformanceAudit = async () => {
    setIsLoading(true);
    
    try {
      // Performance metrics
      const performance = window.performance;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      const memory = (performance as any).memory;
      
      // Calculate FPS
      let fps = 60;
      if ('requestAnimationFrame' in window) {
        let lastTime = performance.now();
        let frameCount = 0;
        const measureFPS = () => {
          const currentTime = performance.now();
          frameCount++;
          if (currentTime - lastTime >= 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
          }
          if (frameCount < 60) {
            requestAnimationFrame(measureFPS);
          }
        };
        measureFPS();
      }

      const performanceMetrics: PerformanceMetrics = {
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        domNodes: document.querySelectorAll('*').length,
        memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
        fps: fps,
        paintMetrics: {
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          largestContentfulPaint: 0 // Would need LCP observer
        },
        jsHeapSize: memory ? Math.round(memory.totalJSHeapSize / 1024 / 1024) : 0,
        networkRequests: performance.getEntriesByType('resource').length
      };

      // Security audit
      const securityAudit: SecurityAuditResult = {
        csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
        https: location.protocol === 'https:',
        xssProtection: document.querySelector('meta[http-equiv="X-XSS-Protection"]') !== null,
        clickjackProtection: document.querySelector('meta[http-equiv="X-Frame-Options"]') !== null,
        mixedContent: !document.querySelector('script[src^="http:"], link[href^="http:"], img[src^="http:"]'),
        score: 0
      };

      // Calculate security score
      const securityChecks = Object.values(securityAudit).slice(0, -1);
      securityAudit.score = Math.round((securityChecks.filter(Boolean).length / securityChecks.length) * 100);

      setMetrics(performanceMetrics);
      setSecurity(securityAudit);
    } catch (error) {
      console.error('Performance audit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !metrics) {
      runPerformanceAudit();
    }
  }, [isVisible, metrics]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMetricStatus = (value: number, good: number, ok: number) => {
    if (value <= good) return 'text-green-400';
    if (value <= ok) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
      {/* Floating Performance Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full shadow-lg shadow-purple-500/25 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
        onClick={() => setIsVisible(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <i className="fas fa-tachometer-alt text-lg"></i>
      </motion.button>

      {/* Performance Monitor Modal */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsVisible(false);
            }}
          >
            <motion.div
              className="w-full max-w-4xl max-h-[90vh] bg-black/95 backdrop-blur-xl border border-cyan-400/30 rounded-xl shadow-2xl shadow-cyan-400/20 overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-400/30">
                <div className="flex items-center gap-3">
                  <i className="fas fa-chart-line text-cyan-400 text-xl"></i>
                  <h2 className="text-xl font-bold text-white">Performance & Security Audit</h2>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-4"></div>
                    <p className="text-cyan-400">Running comprehensive audit...</p>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Performance Metrics */}
                    {metrics && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-cyan-300 flex items-center">
                          <i className="fas fa-rocket mr-2"></i>
                          Performance Metrics
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-900/50 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Load Time</div>
                            <div className={`text-2xl font-bold ${getMetricStatus(metrics.loadTime, 1000, 3000)}`}>
                              {Math.round(metrics.loadTime)}ms
                            </div>
                          </div>
                          
                          <div className="bg-gray-900/50 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">FPS</div>
                            <div className={`text-2xl font-bold ${getMetricStatus(60 - metrics.fps, 5, 15)}`}>
                              {metrics.fps}
                            </div>
                          </div>
                          
                          <div className="bg-gray-900/50 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">DOM Nodes</div>
                            <div className={`text-2xl font-bold ${getMetricStatus(metrics.domNodes, 1000, 2000)}`}>
                              {metrics.domNodes.toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="bg-gray-900/50 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Memory Usage</div>
                            <div className={`text-2xl font-bold ${getMetricStatus(metrics.memoryUsage, 50, 100)}`}>
                              {metrics.memoryUsage}MB
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-900/50 p-4 rounded-lg">
                          <div className="text-sm text-gray-400 mb-3">Paint Metrics</div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-300">First Paint</span>
                              <span className={getMetricStatus(metrics.paintMetrics.firstPaint, 1000, 2000)}>
                                {Math.round(metrics.paintMetrics.firstPaint)}ms
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">First Contentful Paint</span>
                              <span className={getMetricStatus(metrics.paintMetrics.firstContentfulPaint, 1500, 3000)}>
                                {Math.round(metrics.paintMetrics.firstContentfulPaint)}ms
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Security Audit */}
                    {security && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-bold text-cyan-300 flex items-center">
                          <i className="fas fa-shield-alt mr-2"></i>
                          Security Audit
                        </h3>
                        
                        <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                          <div className="text-sm text-gray-400 mb-2">Security Score</div>
                          <div className={`text-4xl font-bold ${getScoreColor(security.score)}`}>
                            {security.score}%
                          </div>
                        </div>

                        <div className="space-y-3">
                          {[
                            { key: 'https', label: 'HTTPS Enabled', icon: 'fas fa-lock' },
                            { key: 'csp', label: 'Content Security Policy', icon: 'fas fa-shield-alt' },
                            { key: 'xssProtection', label: 'XSS Protection', icon: 'fas fa-bug' },
                            { key: 'clickjackProtection', label: 'Clickjack Protection', icon: 'fas fa-mouse-pointer' },
                            { key: 'mixedContent', label: 'No Mixed Content', icon: 'fas fa-check-circle' }
                          ].map(({ key, label, icon }) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                              <div className="flex items-center">
                                <i className={`${icon} mr-3 text-cyan-400`}></i>
                                <span className="text-gray-300">{label}</span>
                              </div>
                              <div className={`font-bold ${security[key as keyof SecurityAuditResult] ? 'text-green-400' : 'text-red-400'}`}>
                                {security[key as keyof SecurityAuditResult] ? 'PASS' : 'FAIL'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
                  <button
                    onClick={runPerformanceAudit}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                  >
                    <i className="fas fa-redo mr-2"></i>
                    Re-run Audit
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}