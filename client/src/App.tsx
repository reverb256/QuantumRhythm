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
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { CursorGlow } from "@/components/CursorGlow";
import { ParticleSystem } from "@/components/ParticleSystem";

import Navigation from "@/components/navigation";
import { BreathingPageWrapper } from "@/components/breathing-animation";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import Philosophy from "@/pages/philosophy";
import ConsciousnessMapPage from "@/pages/consciousness-map";
import Values from "@/pages/values";
import VRChat from "@/pages/VRChat";
import Dashboard from "@/pages/Dashboard";
import TradingDashboard from "@/pages/TradingDashboard";
import TradingInterface from "@/pages/TradingInterface";
import TradingVisualization from "@/pages/TradingVisualization";
import TraderDashboard from "@/pages/TraderDashboard";
import { DeFiDashboard } from "@/pages/DeFiDashboard";
import PortfolioDashboard from "@/pages/PortfolioDashboard";
import Platform from "@/pages/Platform";
import CloudflareOptimization from "@/pages/CloudflareOptimization";
import TechnicalDeepDive from "@/pages/technical-deep-dive";
import Legal from "@/pages/Legal";
import AISystems from "@/pages/AISystems";
import AIOnboarding from "@/pages/AIOnboarding";
import AgentInsights from "@/pages/AgentInsights";
import Compliance from "@/pages/Compliance";
import WorkplaceJanitorial from "@/pages/workplace-janitorial";
import TrovesCoves from "@/pages/troves-coves";
import FrostbiteGazette from "@/pages/frostbite-gazette";
import HealthMonitorDashboard from "@/components/HealthMonitorDashboard";
import CompatibilityTestPage from "@/pages/CompatibilityTestPage";
import SecurityPage from "@/pages/SecurityPage";
import ClaudeConsciousness from "@/pages/claude-consciousness";
import { SystemIntegrationDashboard } from "@/pages/SystemIntegrationDashboard";
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
    if (location === '/projects') return 'projects';
    if (location === '/philosophy') return 'philosophy';
    if (location === '/consciousness-map') return 'consciousness-map';
    if (location === '/vrchat') return 'vrchat';
    if (location === '/values') return 'values';
    if (location === '/dashboard') return 'dashboard';
    if (location === '/trading') return 'trading';
    if (location === '/defi') return 'defi';
    if (location === '/cloudflare') return 'cloudflare';
    if (location === '/technical-deep-dive') return 'technical-deep-dive';
    if (location === '/ai-onboarding') return 'ai-onboarding';
    if (location === '/agent-insights') return 'agent-insights';
    if (location === '/health-monitor') return 'health-monitor';
    if (location === '/legal') return 'legal';
    if (location === '/workplace-janitorial') return 'workplace-janitorial';
    if (location === '/troves-coves') return 'troves-coves';
    if (location === '/frostbite-gazette') return 'frostbite-gazette';
    return 'home';
  };

  const currentPage = getCurrentPage();
  const seoData = getSEOForPage(currentPage);

  return (
    <>
      <SEOHead {...seoData} />
      
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/projects" component={Projects} />
        <Route path="/philosophy" component={Philosophy} />
        <Route path="/consciousness-map" component={ConsciousnessMapPage} />
        <Route path="/values" component={Values} />
        <Route path="/vrchat" component={VRChat} />
        <Route path="/platform" component={Platform} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/trader-dashboard" component={TraderDashboard} />
        <Route path="/trading-visualization" component={TradingVisualization} />
        <Route path="/trading" component={TradingInterface} />
        <Route path="/defi" component={DeFiDashboard} />
        <Route path="/portfolio" component={PortfolioDashboard} />
        <Route path="/cloudflare" component={CloudflareOptimization} />
        <Route path="/technical-deep-dive" component={TechnicalDeepDive} />
        <Route path="/ai-systems" component={AISystems} />
        <Route path="/ai-onboarding" component={AIOnboarding} />
        <Route path="/agent-insights" component={AgentInsights} />
        <Route path="/health-monitor" component={HealthMonitorDashboard} />
        <Route path="/compatibility-test" component={CompatibilityTestPage} />
        <Route path="/security" component={SecurityPage} />
        <Route path="/compliance" component={Compliance} />
        <Route path="/legal" component={Legal} />
        <Route path="/workplace-janitorial" component={WorkplaceJanitorial} />
        <Route path="/troves-coves" component={TrovesCoves} />
        <Route path="/frostbite-gazette" component={FrostbiteGazette} />
        <Route path="/claude-consciousness" component={ClaudeConsciousness} />
        <Route path="/system-integration" component={SystemIntegrationDashboard} />
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
    <ErrorBoundary 
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorBoundaryFallback error={error} resetError={resetErrorBoundary} />
      )}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <Web3AuthProvider>
            <ThemeProvider>
              <ConsciousContainer learningRate={0.15}>
                <CursorGlow />
                <ParticleSystem />
                <ThemeSwitcher />
                <Toaster />
                <main id="main-content" className="relative z-10 hdr-background text-wcag-aaa focus-enhanced">
                  <Navigation />
                  <Router />
                </main>
                <EnhancedConsole />
              </ConsciousContainer>
            </ThemeProvider>
          </Web3AuthProvider>
        </WalletProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;