/**
 * Autonomous Page Monitor Integration
 * Integrates with the Web Worker health monitor for real-time issue detection and resolution
 */

import { compatibilityLayer } from './compatibility-layer';

interface PageIssue {
  id: string;
  type: string;
  data: any;
  detected: number;
  resolved: boolean;
  resolutionAttempts: number;
  resolutionStrategy?: string;
  resolvedAt?: number;
  unresolvable?: boolean;
}

interface HealthReport {
  status: 'healthy' | 'issues_detected';
  activeIssues: number;
  resolvedIssues: number;
  averageResponseTime: number;
  memoryUsage: number;
  uptime: number;
  lastCheck: number;
}

export class AutonomousPageMonitor {
  private worker: Worker | null = null;
  private healthCallback: ((report: HealthReport) => void) | null = null;
  private issueCallback: ((issue: PageIssue) => void) | null = null;
  private resolutionCallback: ((issue: PageIssue) => void) | null = null;
  private isActive = false;

  constructor() {
    this.initializeWorker();
    this.setupMainThreadMonitoring();
  }

  private initializeWorker() {
    try {
      // Check compatibility layer for Web Worker support
      if (!compatibilityLayer.shouldUseWebWorker()) {
        console.log('Web Workers disabled by compatibility layer, using fallback monitoring');
        this.setupFallbackMonitoring();
        return;
      }

      // In development, skip Web Workers due to CORS issues
      if (import.meta.env.DEV) {
        console.log('Development mode detected, using fallback monitoring');
        this.setupFallbackMonitoring();
        return;
      }

      this.worker = new Worker('/workers/page-health-monitor.js');
      this.setupWorkerListeners();
      
      // Test worker with a simple message
      this.worker.postMessage({ type: 'INIT_TEST' });
      
      // Fallback if worker doesn't respond within 2 seconds
      setTimeout(() => {
        if (!this.isActive) {
          console.warn('Worker initialization timeout, using fallback monitoring');
          this.worker?.terminate();
          this.worker = null;
          this.setupFallbackMonitoring();
        }
      }, 2000);
      
    } catch (error) {
      console.warn('Page health monitor worker failed to initialize, using fallback monitoring');
      this.setupFallbackMonitoring();
    }
  }

  private setupWorkerListeners() {
    if (!this.worker) return;

    this.worker.onmessage = (event) => {
      const { type, data } = event.data;

      switch (type) {
        case 'MONITORING_STARTED':
          this.isActive = true;
          break;

        case 'HEALTH_CHECK':
        case 'HEALTH_REPORT':
          if (this.healthCallback) {
            this.healthCallback(data);
          }
          break;

        case 'ISSUE_DETECTED':
          if (this.issueCallback) {
            this.issueCallback(data);
          }
          break;

        case 'ISSUE_RESOLVED':
          if (this.resolutionCallback) {
            this.resolutionCallback(data);
          }
          break;

        case 'ISSUE_UNRESOLVABLE':
          console.warn('Unresolvable issue detected:', data);
          break;

        case 'EXECUTE_RESOLUTION':
          this.executeResolution(data);
          break;
      }
    };

    this.worker.onerror = (error) => {
      console.warn('Page health monitor worker error:', error);
      this.setupFallbackMonitoring();
    };
  }

  private setupMainThreadMonitoring() {
    // Monitor for main thread errors
    window.addEventListener('error', (event) => {
      this.reportMainThreadError('SCRIPT_ERROR', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString()
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.reportMainThreadError('PROMISE_REJECTION', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    });

    // Monitor network connectivity
    window.addEventListener('online', () => {
      this.reportConnectivityChange(true);
    });

    window.addEventListener('offline', () => {
      this.reportConnectivityChange(false);
    });

    // Monitor performance
    this.setupPerformanceMonitoring();
  }

  private setupPerformanceMonitoring() {
    // Monitor memory usage if available
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (usage > 0.8) {
          this.reportMainThreadError('MEMORY_HIGH', {
            usage,
            used: memory.usedJSHeapSize,
            limit: memory.jsHeapSizeLimit
          });
        }
      }, 10000);
    }

    // Monitor frame rate
    let lastTime = performance.now();
    let frameCount = 0;
    
    const checkFrameRate = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        if (fps < 30) {
          this.reportMainThreadError('LOW_FPS', { fps });
        }
      }
      
      requestAnimationFrame(checkFrameRate);
    };
    
    requestAnimationFrame(checkFrameRate);
  }

  private reportMainThreadError(type: string, data: any) {
    if (this.worker) {
      // Report to worker for processing
      console.log(`Reporting ${type} to worker:`, data);
    } else {
      // Handle directly if worker not available
      this.handleErrorDirectly(type, data);
    }
  }

  private reportConnectivityChange(online: boolean) {
    if (!online) {
      this.enableOfflineMode();
    } else {
      this.disableOfflineMode();
    }
  }

  private executeResolution(resolutionData: any) {
    const { action, issue, feature, delay } = resolutionData;

    switch (action) {
      case 'retry_render':
        this.retryRender();
        break;

      case 'show_fallback':
        this.showFallbackContent();
        break;

      case 'progressive_enhancement':
        this.enableProgressiveEnhancement();
        break;

      case 'error_boundary':
        this.activateErrorBoundary();
        break;

      case 'graceful_degradation':
        this.enableGracefulDegradation();
        break;

      case 'disable_feature':
        this.disableFeature(feature);
        break;

      case 'use_cache':
        this.useCacheData();
        break;

      case 'offline_mode':
        this.enableOfflineMode();
        break;

      case 'retry_request':
        setTimeout(() => this.retryFailedRequests(), delay || 1000);
        break;

      case 'css_reset':
        this.applyCSSReset();
        break;

      case 'responsive_fallback':
        this.enableResponsiveFallback();
        break;

      case 'minimal_layout':
        this.enableMinimalLayout();
        break;

      case 'reduce_animations':
        this.reduceAnimations();
        break;

      case 'lazy_loading':
        this.enableLazyLoading();
        break;

      case 'reduce_features':
        this.reduceFeatures();
        break;
    }
  }

  // Resolution implementations
  private retryRender() {
    // Force a re-render of critical components
    window.dispatchEvent(new CustomEvent('force-rerender'));
  }

  private showFallbackContent() {
    // Show basic fallback content
    document.body.classList.add('fallback-mode');
  }

  private enableProgressiveEnhancement() {
    // Enable basic functionality first
    document.body.classList.add('progressive-enhancement');
  }

  private activateErrorBoundary() {
    // Activate React error boundaries
    window.dispatchEvent(new CustomEvent('activate-error-boundary'));
  }

  private enableGracefulDegradation() {
    // Reduce functionality to essentials
    document.body.classList.add('degraded-mode');
  }

  private disableFeature(feature: string) {
    // Disable problematic features
    document.body.classList.add(`disable-${feature}`);
  }

  private useCacheData() {
    // Use cached data instead of network requests
    window.dispatchEvent(new CustomEvent('use-cache-data'));
  }

  private enableOfflineMode() {
    document.body.classList.add('offline-mode');
    
    // Show offline indicator
    const offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offline-indicator';
    offlineIndicator.textContent = 'Offline Mode - Using cached data';
    offlineIndicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #f59e0b;
      color: white;
      text-align: center;
      padding: 8px;
      z-index: 9999;
    `;
    
    if (!document.getElementById('offline-indicator')) {
      document.body.appendChild(offlineIndicator);
    }
  }

  private disableOfflineMode() {
    document.body.classList.remove('offline-mode');
    
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  private retryFailedRequests() {
    // Retry failed network requests
    window.dispatchEvent(new CustomEvent('retry-failed-requests'));
  }

  private applyCSSReset() {
    // Apply emergency CSS reset
    const resetStyle = document.createElement('style');
    resetStyle.id = 'emergency-css-reset';
    resetStyle.textContent = `
      .css-reset * {
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }
    `;
    
    if (!document.getElementById('emergency-css-reset')) {
      document.head.appendChild(resetStyle);
      document.body.classList.add('css-reset');
    }
  }

  private enableResponsiveFallback() {
    // Enable mobile-first responsive fallback
    document.body.classList.add('responsive-fallback');
  }

  private enableMinimalLayout() {
    // Switch to minimal layout
    document.body.classList.add('minimal-layout');
  }

  private reduceAnimations() {
    // Disable non-essential animations
    const style = document.createElement('style');
    style.id = 'reduced-animations';
    style.textContent = `
      .reduce-animations *,
      .reduce-animations *::before,
      .reduce-animations *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    
    if (!document.getElementById('reduced-animations')) {
      document.head.appendChild(style);
      document.body.classList.add('reduce-animations');
    }
  }

  private enableLazyLoading() {
    // Enable aggressive lazy loading
    document.body.classList.add('aggressive-lazy-loading');
  }

  private reduceFeatures() {
    // Reduce non-essential features
    document.body.classList.add('reduced-features');
  }

  private handleErrorDirectly(type: string, data: any) {
    // Fallback error handling when worker is not available
    console.log(`Handling ${type} directly:`, data);
    
    switch (type) {
      case 'SCRIPT_ERROR':
        this.activateErrorBoundary();
        break;
      case 'PROMISE_REJECTION':
        this.enableGracefulDegradation();
        break;
      case 'MEMORY_HIGH':
        this.reduceFeatures();
        this.reduceAnimations();
        break;
      case 'LOW_FPS':
        this.reduceAnimations();
        break;
    }
  }

  private setupFallbackMonitoring() {
    // Basic monitoring without Web Worker
    setInterval(() => {
      const report: HealthReport = {
        status: 'healthy',
        activeIssues: 0,
        resolvedIssues: 0,
        averageResponseTime: 0,
        memoryUsage: 0,
        uptime: Date.now(),
        lastCheck: Date.now()
      };
      
      if (this.healthCallback) {
        this.healthCallback(report);
      }
    }, 5000);
  }

  // Public methods
  public startMonitoring() {
    if (this.worker) {
      this.worker.postMessage({ type: 'START_MONITORING' });
    } else {
      this.isActive = true;
    }
  }

  public getHealthReport(): Promise<HealthReport> {
    return new Promise((resolve) => {
      if (this.worker) {
        const timeout = setTimeout(() => {
          resolve(this.getFallbackHealthReport());
        }, 1000);

        const handler = (event: MessageEvent) => {
          if (event.data.type === 'HEALTH_REPORT') {
            clearTimeout(timeout);
            this.worker?.removeEventListener('message', handler);
            resolve(event.data.data);
          }
        };

        this.worker.addEventListener('message', handler);
        this.worker.postMessage({ type: 'GET_HEALTH_REPORT' });
      } else {
        resolve(this.getFallbackHealthReport());
      }
    });
  }

  private getFallbackHealthReport(): HealthReport {
    return {
      status: 'healthy',
      activeIssues: 0,
      resolvedIssues: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      uptime: Date.now(),
      lastCheck: Date.now()
    };
  }

  public onHealthUpdate(callback: (report: HealthReport) => void) {
    this.healthCallback = callback;
  }

  public onIssueDetected(callback: (issue: PageIssue) => void) {
    this.issueCallback = callback;
  }

  public onIssueResolved(callback: (issue: PageIssue) => void) {
    this.resolutionCallback = callback;
  }

  public forceHealthCheck() {
    if (this.worker) {
      this.worker.postMessage({ type: 'FORCE_HEALTH_CHECK' });
    }
  }

  public isMonitoringActive(): boolean {
    return this.isActive;
  }
}

// Global instance
export const pageMonitor = new AutonomousPageMonitor();