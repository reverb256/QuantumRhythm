import React, { Suspense } from 'react';
import HeroSection from '../components/hero-section';
import { 
  LazyProjectsSection,
  PriorityLoader,
  useResourcePreloader 
} from '../components/optimized-lazy-loader';
import { usePerformanceMonitor } from '../lib/performance-optimizer';
import Footer from '../components/footer';

// Lazy load non-critical components
const AboutSection = React.lazy(() => import('../components/about-section'));
const SkillsSection = React.lazy(() => import('../components/skills-section'));
const ContactSection = React.lazy(() => import('../components/contact-section'));
const ConsoleEasterEgg = React.lazy(() => import('../components/console-easter-egg'));

export default function HomePage() {
  // Monitor performance metrics
  const metrics = usePerformanceMonitor();

  // Preload critical resources
  useResourcePreloader([
    '/fonts/inter.woff2',
    '/images/hero-bg.webp'
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Critical above-the-fold content */}
      <HeroSection />

      {/* High priority - loads immediately when visible */}
      <PriorityLoader priority="high">
        <Suspense fallback={<div className="h-64 bg-gray-800 animate-pulse" />}>
          <AboutSection />
        </Suspense>
      </PriorityLoader>

      {/* Medium priority - loads with some threshold */}
      <PriorityLoader priority="medium">
        <LazyProjectsSection />
      </PriorityLoader>

      {/* Low priority - loads only when scrolled near */}
      <PriorityLoader priority="low">
        <Suspense fallback={<div className="h-64 bg-gray-800 animate-pulse" />}>
          <SkillsSection />
        </Suspense>
      </PriorityLoader>

      <PriorityLoader priority="low">
        <Suspense fallback={<div className="h-64 bg-gray-800 animate-pulse" />}>
          <ContactSection />
        </Suspense>
      </PriorityLoader>

      <Footer />

      {/* Load console as lowest priority */}
      <Suspense fallback={null}>
        <ConsoleEasterEgg />
      </Suspense>

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