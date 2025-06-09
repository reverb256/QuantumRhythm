
import React, { Suspense, lazy, memo, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Intelligent lazy loading with performance optimization
const createLazyComponent = (importFn: () => Promise<any>, fallback?: React.ComponentType) => {
  const LazyComponent = lazy(importFn);
  
  return memo((props: any) => (
    <ErrorBoundary
      fallback={<div className="text-red-400">Component failed to load</div>}
      onError={(error) => console.error('Lazy component error:', error)}
    >
      <Suspense fallback={fallback ? <fallback /> : <ComponentSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  ));
};

// Optimized skeleton with minimal CSS
const ComponentSkeleton: React.FC = memo(() => (
  <div className="animate-pulse space-y-4 p-6">
    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    <div className="h-32 bg-gray-700 rounded"></div>
  </div>
));

// Viewport-aware lazy loading
export const useIntersectionLoader = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return [setRef, isVisible] as const;
};

// Performance-optimized lazy components
export const LazyProjectsSection = createLazyComponent(
  () => import('./projects-section'),
  ComponentSkeleton
);

export const LazyTechnicalDeepDive = createLazyComponent(
  () => import('../pages/technical-deep-dive'),
  ComponentSkeleton
);

export const LazyTradingDashboard = createLazyComponent(
  () => import('./trading-agent-dashboard'),
  ComponentSkeleton
);

export const LazyConsciousnessEngine = createLazyComponent(
  () => import('./consciousness-engine'),
  ComponentSkeleton
);

// Intelligent component loader with priority
export const PriorityLoader: React.FC<{
  children: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  className?: string;
}> = memo(({ children, priority, className = '' }) => {
  const [containerRef, isVisible] = useIntersectionLoader(
    priority === 'high' ? 0 : priority === 'medium' ? 0.1 : 0.3
  );

  return (
    <div ref={containerRef} className={className}>
      {isVisible && children}
    </div>
  );
});

// Resource preloader for critical components
export const useResourcePreloader = (resources: string[]) => {
  useEffect(() => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.js') ? 'script' : 'style';
      document.head.appendChild(link);
    });
  }, [resources]);
};

export default {
  LazyProjectsSection,
  LazyTechnicalDeepDive,
  LazyTradingDashboard,
  LazyConsciousnessEngine,
  PriorityLoader,
  useIntersectionLoader,
  useResourcePreloader
};
