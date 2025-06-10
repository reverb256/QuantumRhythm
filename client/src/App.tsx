import { Switch, Route, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// Tooltip system removed for DOM nesting compliance
import SEOHead, { getSEOForPage } from "@/components/seo-head";
import { ConsciousContainer } from "@/components/smart-elements";
import { EnhancedConsole } from "@/components/enhanced-console";
import { MetaTagManager, useAISEO } from "@/lib/ai-seo-engine";
import { ErrorBoundaryFallback } from "@/components/error-state-manager";
import { ErrorBoundary } from "react-error-boundary";

import Navigation from "@/components/navigation";
import Home from "@/pages/home";
import Values from "@/pages/values";
import VRChat from "@/pages/vrchat";
import Dashboard from "@/pages/Dashboard";
import TechnicalDeepDive from "@/pages/technical-deep-dive";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/not-found";
import PerformanceMonitor from "@/components/ui/performance-monitor";

function Router() {
  const [location] = useLocation();
  const previousLocation = useRef(location);
  
  // Scroll management for page transitions
  useEffect(() => {
    // Only scroll to top on forward navigation (not back button)
    if (previousLocation.current !== location) {
      const isBackNavigation = window.history.state?.idx < (window.history.state?.previousIdx || 0);
      if (!isBackNavigation) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      previousLocation.current = location;
    }
  }, [location]);
  
  // Determine current page for SEO
  const getCurrentPage = () => {
    if (location === '/') return 'home';
    if (location === '/vrchat') return 'vrchat';
    if (location === '/values') return 'values';
    if (location === '/dashboard') return 'dashboard';
    if (location === '/technical-deep-dive') return 'technical-deep-dive';
    return 'home';
  };

  const currentPage = getCurrentPage();
  const seoData = getSEOForPage(currentPage);

  return (
    <>
      <SEOHead {...seoData} />
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/values" component={Values} />
        <Route path="/vrchat" component={VRChat} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/technical-deep-dive" component={TechnicalDeepDive} />
        <Route path="/legal" component={Legal} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  // Initialize AI-powered SEO system
  const metaManager = MetaTagManager.getInstance();
  
  useEffect(() => {
    // Set global meta tags for the platform
    metaManager.updateMetaTags({
      title: 'VibeCoding - Quantum AI Trading & Consciousness Platform',
      description: 'Advanced AI-powered autonomous trading system integrating quantum consciousness principles and martial arts ethics for secure, intelligent financial operations.',
      keywords: ['AI trading', 'quantum consciousness', 'autonomous systems', 'blockchain', 'martial arts ethics', 'dojo kun', 'vibecoding'],
      type: 'website',
      url: window.location.href
    });

    // Detect and apply HDR and accessibility preferences
    if (window.matchMedia && window.matchMedia('(dynamic-range: high)').matches) {
      document.documentElement.classList.add('hdr-supported');
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
      document.documentElement.classList.add('high-contrast');
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion');
    }
    
    document.documentElement.classList.add('wcag-compliant');
    
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]') || document.createElement('meta');
    metaColorScheme.setAttribute('name', 'color-scheme');
    metaColorScheme.setAttribute('content', 'dark light');
    if (!document.querySelector('meta[name="color-scheme"]')) {
      document.head.appendChild(metaColorScheme);
    }
  }, [metaManager]);

  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <QueryClientProvider client={queryClient}>
        <ConsciousContainer learningRate={0.15}>

          <Toaster />
          <main id="main-content" className="relative z-10 hdr-background text-wcag-aaa focus-enhanced">
            <Router />
          </main>
          <EnhancedConsole />
        </ConsciousContainer>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
