
// Performance optimization utilities for Cloudflare deployment
import { useState, useEffect, useCallback, useMemo } from 'react';

// Bundle size analyzer
export const bundleAnalyzer = {
  trackComponentSize: (componentName: string, size: number) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`component-${componentName}-size-${size}`);
    }
  },
  
  measureRenderTime: (componentName: string) => {
    const startMark = `${componentName}-render-start`;
    const endMark = `${componentName}-render-end`;
    
    return {
      start: () => performance.mark(startMark),
      end: () => {
        performance.mark(endMark);
        performance.measure(`${componentName}-render`, startMark, endMark);
      }
    };
  }
};

// Intelligent caching system
export class PerformanceCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxSize = 100;

  set(key: string, data: any, ttl = 300000) { // 5 min default
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear() {
    this.cache.clear();
  }
}

// Resource optimization
export const resourceOptimizer = {
  // Preload critical resources
  preloadCritical: (resources: string[]) => {
    resources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = url.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  },

  // Optimize images for Cloudflare
  optimizeImage: (src: string, width?: number, quality = 80) => {
    if (!src) return src;
    
    // Cloudflare image optimization
    const params = new URLSearchParams();
    if (width) params.set('width', width.toString());
    params.set('quality', quality.toString());
    params.set('format', 'auto');
    
    return `/cdn-cgi/image/${params.toString()}/${src}`;
  },

  // Lazy load with intersection observer
  createLazyLoader: (threshold = 0.1) => {
    return (callback: () => void) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              callback();
              observer.disconnect();
            }
          });
        },
        { threshold }
      );
      
      return observer;
    };
  }
};

// Performance monitoring hooks
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
        }
        
        if (entry.entryType === 'first-input') {
          setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
        }
        
        if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
          setMetrics(prev => ({ ...prev, cls: prev.cls + entry.value }));
        }
      });
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

    // TTFB measurement
    if (performance.timing) {
      const ttfb = performance.timing.responseStart - performance.timing.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
    }

    return () => observer.disconnect();
  }, []);

  return metrics;
};

// Memory optimization
export const useMemoryOptimizer = () => {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo((performance as any).memory);
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const optimizeMemory = useCallback(() => {
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
    
    // Clear performance entries
    if (performance.clearResourceTimings) {
      performance.clearResourceTimings();
    }
  }, []);

  return { memoryInfo, optimizeMemory };
};

// Request batching for API optimization
export class RequestBatcher {
  private batches = new Map<string, Array<{ resolve: Function; reject: Function; params: any }>>();
  private timers = new Map<string, NodeJS.Timeout>();
  private batchDelay = 50; // 50ms batching window

  batch<T>(endpoint: string, params: any, fetcher: (batchedParams: any[]) => Promise<T[]>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.batches.has(endpoint)) {
        this.batches.set(endpoint, []);
      }
      
      this.batches.get(endpoint)!.push({ resolve, reject, params });
      
      // Clear existing timer
      if (this.timers.has(endpoint)) {
        clearTimeout(this.timers.get(endpoint)!);
      }
      
      // Set new timer
      this.timers.set(endpoint, setTimeout(async () => {
        const batch = this.batches.get(endpoint)!;
        this.batches.delete(endpoint);
        this.timers.delete(endpoint);
        
        try {
          const batchParams = batch.map(item => item.params);
          const results = await fetcher(batchParams);
          
          batch.forEach((item, index) => {
            item.resolve(results[index]);
          });
        } catch (error) {
          batch.forEach(item => item.reject(error));
        }
      }, this.batchDelay));
    });
  }
}

// CSS optimization utilities
export const cssOptimizer = {
  // Remove unused CSS classes
  purgeUnusedClasses: (usedClasses: Set<string>) => {
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        rules.forEach((rule, index) => {
          if (rule.type === CSSRule.STYLE_RULE) {
            const styleRule = rule as CSSStyleRule;
            const selector = styleRule.selectorText;
            
            // Check if any class in selector is used
            const hasUsedClass = selector.split(',').some(sel => {
              const classes = sel.match(/\.[a-zA-Z0-9_-]+/g) || [];
              return classes.some(cls => usedClasses.has(cls.substring(1)));
            });
            
            if (!hasUsedClass) {
              stylesheet.deleteRule(index);
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheets can't be accessed
      }
    });
  },

  // Inline critical CSS
  inlineCritical: (criticalSelectors: string[]) => {
    const criticalCSS = criticalSelectors.map(selector => {
      const element = document.querySelector(selector);
      return element ? window.getComputedStyle(element).cssText : '';
    }).join('\n');
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }
};

// Global performance cache instance
export const performanceCache = new PerformanceCache();

// Global request batcher instance
export const requestBatcher = new RequestBatcher();

export default {
  bundleAnalyzer,
  PerformanceCache,
  resourceOptimizer,
  usePerformanceMonitor,
  useMemoryOptimizer,
  RequestBatcher,
  cssOptimizer,
  performanceCache,
  requestBatcher
};
