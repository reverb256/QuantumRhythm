import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal, Shield, Brain, Zap, TrendingUp, Bot, Cog, Scale, DollarSign, Cloud, Code } from 'lucide-react';
import { Web3AuthButton } from "@/components/web3-auth";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  useEffect(() => {
    const handleConsoleStateChange = (event: CustomEvent) => {
      setIsConsoleOpen(event.detail.isOpen);
    };

    window.addEventListener('consoleStateChange', handleConsoleStateChange as EventListener);
    return () => {
      window.removeEventListener('consoleStateChange', handleConsoleStateChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handlePageNavigation = (href: string) => {
    setIsOpen(false);
    // Let the router handle navigation and scroll behavior
  };

  const toggleConsole = () => {
    const event = new KeyboardEvent('keydown', { 
      key: '`', 
      ctrlKey: true,
      bubbles: true 
    });
    document.dispatchEvent(event);
  };

  const navItemClass = (path: string) => `
    relative px-3 py-2 text-sm font-medium transition-colors duration-300 
    hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md
    ${location === path ? 'text-accent' : 'text-muted-foreground'}
  `;

  const sectionButtonClass = `
    px-3 py-2 text-sm font-medium transition-colors duration-300 
    hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-md
    ${location === '/' ? 'text-primary' : 'text-muted-foreground'}
  `;

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-xl border-b border-primary/20' : 'bg-background/80 backdrop-blur-md'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link 
              href="/" 
              className="font-bold text-lg sm:text-xl text-primary hover:text-accent transition-colors duration-300 cursor-pointer group"
            >
              reverb256<span className="text-accent group-hover:animate-pulse">|</span>
            </Link>

            {/* Console Toggle */}
            <motion.button
              onClick={toggleConsole}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center space-x-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 rounded-lg px-2.5 py-1.5 transition-all duration-300 group shadow-lg hover:shadow-primary/20 ${
                isConsoleOpen ? 'shadow-[0_0_20px_hsla(var(--primary),.4)] border-primary/60' : ''
              }`}
            >
              <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-primary group-hover:text-accent" />
              <span className="text-xs sm:text-sm font-mono text-primary group-hover:text-accent hidden sm:inline">
                console
              </span>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse opacity-60"></div>
            </motion.button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Home Page Sections */}
            {location === '/' && (
              <>
                <button onClick={() => scrollToSection('about')} className={sectionButtonClass}>
                  About
                </button>
                <button onClick={() => scrollToSection('projects')} className={sectionButtonClass}>
                  Projects
                </button>
                <button onClick={() => scrollToSection('skills')} className={sectionButtonClass}>
                  Skills
                </button>
                <div className="h-4 w-px bg-primary/30 mx-2"></div>
              </>
            )}
            
            {/* Trading & DeFi */}
            <Link href="/dashboard" className={navItemClass('/dashboard')} onClick={() => handlePageNavigation('/dashboard')}>
              <div className="flex items-center space-x-1.5">
                <TrendingUp className="h-4 w-4" />
                <span>Trading</span>
              </div>
              {location === '/dashboard' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400" />
              )}
            </Link>
            
            <Link href="/trading" className={navItemClass('/trading')} onClick={() => handlePageNavigation('/trading')}>
              <div className="flex items-center space-x-1.5">
                <Bot className="h-4 w-4" />
                <span>Live</span>
              </div>
              {location === '/trading' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400" />
              )}
            </Link>
            
            <Link href="/defi" className={navItemClass('/defi')} onClick={() => handlePageNavigation('/defi')}>
              <div className="flex items-center space-x-1.5">
                <DollarSign className="h-4 w-4" />
                <span>DeFi</span>
              </div>
              {location === '/defi' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400" />
              )}
            </Link>

            <div className="h-4 w-px bg-primary/30 mx-2"></div>
            
            {/* AI & Tech */}
            <Link href="/cloudflare" className={navItemClass('/cloudflare')} onClick={() => handlePageNavigation('/cloudflare')}>
              <div className="flex items-center space-x-1.5">
                <Cloud className="h-4 w-4" />
                <span>AI</span>
              </div>
              {location === '/cloudflare' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400" />
              )}
            </Link>
            
            <Link href="/ai-onboarding" className={navItemClass('/ai-onboarding')} onClick={() => handlePageNavigation('/ai-onboarding')}>
              <div className="flex items-center space-x-1.5">
                <Brain className="h-4 w-4" />
                <span>Onboard</span>
              </div>
              {location === '/ai-onboarding' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400" />
              )}
            </Link>
            
            <Link href="/technical-deep-dive" className={navItemClass('/technical-deep-dive')} onClick={() => handlePageNavigation('/technical-deep-dive')}>
              <div className="flex items-center space-x-1.5">
                <Code className="h-4 w-4" />
                <span>Tech</span>
              </div>
              {location === '/technical-deep-dive' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 to-blue-400" />
              )}
            </Link>

            <div className="h-4 w-px bg-primary/30 mx-2"></div>
            
            {/* Personal & Values */}
            <Link href="/values" className={navItemClass('/values')} onClick={() => handlePageNavigation('/values')}>
              <div className="flex items-center space-x-1.5">
                <Scale className="h-4 w-4" />
                <span>Values</span>
              </div>
              {location === '/values' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-400" />
              )}
            </Link>
            
            <Link href="/vrchat" className={navItemClass('/vrchat')} onClick={() => handlePageNavigation('/vrchat')}>
              <div className="flex items-center space-x-1.5">
                <Zap className="h-4 w-4" />
                <span>VRChat</span>
              </div>
              {location === '/vrchat' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400" />
              )}
            </Link>
            
            <Link href="/legal" className={navItemClass('/legal')} onClick={() => handlePageNavigation('/legal')}>
              <div className="flex items-center space-x-1.5">
                <Shield className="w-4 h-4" />
                <span>Legal</span>
              </div>
              {location === '/legal' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-400 to-slate-400" />
              )}
            </Link>
            
            <div className="h-4 w-px bg-primary/30 mx-2"></div>
            
            <Web3AuthButton />
          </div>
          
          {/* Compact Desktop Navigation for medium screens */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            <Link href="/dashboard" className={navItemClass('/dashboard')} onClick={() => handlePageNavigation('/dashboard')}>
              <TrendingUp className="h-4 w-4" />
            </Link>
            <Link href="/defi" className={navItemClass('/defi')} onClick={() => handlePageNavigation('/defi')}>
              <DollarSign className="h-4 w-4" />
            </Link>
            <Link href="/cloudflare" className={navItemClass('/cloudflare')} onClick={() => handlePageNavigation('/cloudflare')}>
              <Cloud className="h-4 w-4" />
            </Link>
            <Link href="/values" className={navItemClass('/values')} onClick={() => handlePageNavigation('/values')}>
              <Scale className="h-4 w-4" />
            </Link>
            <Link href="/legal" className={navItemClass('/legal')} onClick={() => handlePageNavigation('/legal')}>
              <Shield className="h-4 w-4" />
            </Link>
            <Web3AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-primary hover:text-accent hover:bg-primary/10 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-primary/20 bg-background/95 backdrop-blur-md mt-3"
            >
              <div className="px-3 py-3 space-y-1">
                {/* Home Page Sections */}
                {location === '/' && (
                  <>
                    <div className="px-3 py-1 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                      Sections
                    </div>
                    <button 
                      onClick={() => { scrollToSection('about'); setIsOpen(false); }} 
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-accent hover:bg-primary/10 transition-colors"
                    >
                      About
                    </button>
                    <button 
                      onClick={() => { scrollToSection('projects'); setIsOpen(false); }} 
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-accent hover:bg-primary/10 transition-colors"
                    >
                      Projects
                    </button>
                    <button 
                      onClick={() => { scrollToSection('skills'); setIsOpen(false); }} 
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-accent hover:bg-primary/10 transition-colors"
                    >
                      Skills
                    </button>
                    <div className="h-px bg-primary/20 my-2"></div>
                  </>
                )}

                {/* Trading & Finance */}
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                  Trading
                </div>
                <Link 
                  href="/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === '/dashboard'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Trading Dashboard</span>
                </Link>
                <Link 
                  href="/trading"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === '/trading'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Bot className="w-4 h-4" />
                  <span>Live Trading</span>
                </Link>
                <Link 
                  href="/defi"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === '/defi'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>DeFi Dashboard</span>
                </Link>

                <div className="h-px bg-primary/20 my-2"></div>

                {/* AI & Technology */}
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                  AI & Tech
                </div>
                <Link 
                  href="/cloudflare"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === '/cloudflare'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Cloud className="w-4 h-4" />
                  <span>Cloudflare AI</span>
                </Link>
                <Link 
                  href="/ai-onboarding"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === '/ai-onboarding'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Brain className="w-4 h-4" />
                  <span>AI Onboarding</span>
                </Link>
                <Link 
                  href="/technical-deep-dive"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === '/technical-deep-dive'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Code className="w-4 h-4" />
                  <span>Technical Deep Dive</span>
                </Link>

                <div className="h-px bg-primary/20 my-2"></div>

                {/* Personal & Values */}
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                  Personal
                </div>
                <Link 
                  href="/values"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === '/values'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Scale className="w-4 h-4" />
                  <span>Values & Philosophy</span>
                </Link>
                <Link 
                  href="/vrchat"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === '/vrchat'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Zap className="w-4 h-4" />
                  <span>VRChat Research</span>
                </Link>

                <div className="h-px bg-primary/20 my-2"></div>

                {/* Legal & Compliance */}
                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                  Legal
                </div>
                <Link 
                  href="/legal"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location === '/legal'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  <span>Legal Compliance</span>
                </Link>

                <div className="h-px bg-primary/20 my-3"></div>

                {/* Web3 Auth */}
                <div className="px-3">
                  <Web3AuthButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}