import { Switch, Route, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SEOHead, { getSEOForPage } from "@/components/seo-head";
import ConsoleEasterEgg from "@/components/console-easter-egg";

import Navigation from "@/components/navigation";
import Home from "@/pages/home";
import Values from "@/pages/values";
import VRChat from "@/pages/vrchat";
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
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ConsoleEasterEgg />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
