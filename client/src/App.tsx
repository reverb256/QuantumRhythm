import { Switch, Route, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
// Tooltip system removed for DOM nesting compliance
import SEOHead, { getSEOForPage } from "@/components/seo-head";
import { ConsciousContainer } from "@/components/smart-elements";
import EnhancedConsole from "@/components/enhanced-console";
import { MetaTagManager, useAISEO } from "@/lib/ai-seo-engine";
import { ErrorBoundaryFallback } from "@/components/error-state-manager";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { WalletProvider } from "@/hooks/useWallet";
import { Web3AuthProvider } from "@/components/Web3AuthProvider";
import { ThemeProvider } from "@/hooks/useTheme";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { CursorGlow } from "@/components/CursorGlow";
import { ParticleSystem } from "@/components/ParticleSystem";

import SimplifiedNavigation from "@/components/SimplifiedNavigation";
import { BreathingPageWrapper } from "@/components/breathing-animation";
import Home from "@/pages/home";
import QuantumPortfolio from "@/pages/QuantumPortfolio";
import TradingHub from "@/pages/TradingHub";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const previousLocation = useRef(location);

  // Enhanced scroll management for page transitions
  useEffect(() => {
    if (previousLocation.current !== location) {
      // Small delay to ensure DOM is ready for smooth scrolling
      const scrollToTop = () => {
        // For home page, don't auto-scroll to allow section navigation
        if (location === '/') {
          // Only scroll to top if coming from another page, not from hash changes
          if (previousLocation.current !== '/' && !location.includes('#')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          // For all other pages, always scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };

      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setTimeout(scrollToTop, 50);
      });

      previousLocation.current = location;
    }
  }, [location]);

  // Determine current page for SEO
  const getCurrentPage = () => {
    if (location === '/') return 'home';
    if (location === '/consciousness') return 'consciousness';
    if (location === '/portfolio') return 'portfolio';
    if (location === '/trading-hub') return 'trading-hub';
    if (location === '/cost-optimization') return 'cost-optimization';
    if (location === '/ai-intelligence') return 'ai-intelligence';
    if (location === '/defi-protocols') return 'defi-protocols';
    if (location === '/quantum-platform') return 'quantum-platform';
    if (location === '/virtual-realms') return 'virtual-realms';
    if (location === '/security-compliance') return 'security-compliance';
    return 'home';
  };

  const currentPage = getCurrentPage();
  const seoData = getSEOForPage(currentPage);

  return (
    <>
      <SEOHead {...seoData} />
      
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/portfolio" component={QuantumPortfolio} />
        <Route path="/trading-hub" component={TradingHub} />
        <Route path="/contact" component={Contact} />
        
        {/* Redirect legacy routes to main sections */}
        <Route path="/trading" component={TradingHub} />
        <Route path="/consciousness" component={Home} />
        <Route path="/cost-optimization" component={TradingHub} />
        
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function ThemedApp() {
  return (
    <ConsciousContainer learningRate={0.15}>
      <CursorGlow />
      <ParticleSystem />
      <ThemeSwitcher />
      <Toaster />
      <main id="main-content" className="relative z-10 hdr-background text-wcag-aaa focus-enhanced">
        <SimplifiedNavigation />
        <Router />
      </main>
      <EnhancedConsole />
    </ConsciousContainer>
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
    <ErrorBoundary 
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorBoundaryFallback error={error} resetError={resetErrorBoundary} />
      )}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <Web3AuthProvider>
            <ThemeProvider>
              <ThemedApp />
            </ThemeProvider>
          </Web3AuthProvider>
        </WalletProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;