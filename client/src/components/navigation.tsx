import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code, Zap, Terminal, Shield, Brain, TrendingUp } from 'lucide-react';
import SecurityFramework from "@/lib/security-framework";
import { Web3AuthButton } from "@/components/web3-auth";

interface TooltipInfo {
  title: string;
  description: string;
  category: string;
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const [activeTooltip, setActiveTooltip] = useState<TooltipInfo | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Listen for console state changes
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

  const handleMouseEnter = (tooltip: TooltipInfo) => {
    setActiveTooltip(tooltip);
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  const toggleConsole = () => {
    const event = new KeyboardEvent('keydown', { 
      key: '`', 
      ctrlKey: true,
      bubbles: true 
    });
    document.dispatchEvent(event);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-xl border-b border-primary/20' : 'bg-background/80 backdrop-blur-md'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Brand with Console */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link 
              href="/" 
              className="font-bold text-lg sm:text-xl text-primary hover:text-accent transition-colors duration-300 cursor-pointer group"
              onMouseEnter={() => handleMouseEnter({
                title: "reverb256",
                description: "Portfolio featuring AI-orchestrated Cloudflare optimization and oceanic design",
                category: "Portfolio"
              })}
              onMouseLeave={handleMouseLeave}
            >
              reverb256<span className="console-cursor text-accent group-hover:animate-pulse">|</span>
            </Link>

            {/* Permanent Console Interface */}
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

          <div className="hidden md:flex space-x-8">
            <Link href="/cloudflare" className={`hover:text-accent transition-colors duration-300 focus-enhanced hdr-enhanced ${
              location === '/cloudflare' ? 'text-accent' : 'text-muted-foreground'
            }`}>
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Cloudflare AI</span>
              </div>
            </Link>
            
            <Link href="/defi" className={`hover:text-accent transition-colors duration-300 focus-enhanced hdr-enhanced ${
              location === '/defi' ? 'text-accent' : 'text-muted-foreground'
            }`}>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>DeFi</span>
              </div>
            </Link>
            
            <button 
              onClick={() => scrollToSection('about')} 
              className={`hover:text-accent transition-colors duration-300 focus-enhanced hdr-enhanced ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "About",
                description: "Portfolio featuring AI-orchestrated Cloudflare optimization and oceanic design",
                category: "Personal"
              })}
              onMouseLeave={handleMouseLeave}
              aria-label="Navigate to About section"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('projects')} 
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-accent transition-colors duration-300 focus-enhanced hdr-enhanced ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Projects",
                description: "Production-ready applications showcasing AI-orchestrated Cloudflare optimization",
                category: "Portfolio"
              })}
              onMouseLeave={handleMouseLeave}
              aria-label="Navigate to Projects section"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('skills')} 
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-accent transition-colors duration-300 focus-enhanced hdr-enhanced ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Skills",
                description: "Technical expertise in AI orchestration, edge optimization, and portfolio development",
                category: "Technical"
              })}
              onMouseLeave={handleMouseLeave}
              aria-label="Navigate to Skills section"
            >
              Skills
            </button>
            <Link 
              href="/values"
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-accent transition-colors duration-300 focus-enhanced link-enhanced hdr-enhanced ${location === '/values' ? 'text-accent' : 'text-muted-foreground'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Values",
                description: "Ethical framework and principles guiding portfolio development",
                category: "Philosophy"
              })}
              onMouseLeave={handleMouseLeave}
              aria-label="Navigate to Values page"
            >
              Values
              {location === '/values' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            <Link 
              href="/vrchat"
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-accent transition-colors duration-300 focus-enhanced link-enhanced hdr-enhanced ${location === '/vrchat' ? 'text-accent' : 'text-muted-foreground'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "VR Research",
                description: "4,320 hours of virtual reality consciousness exploration and social interaction research",
                category: "Research"
              })}
              onMouseLeave={handleMouseLeave}
              aria-label="Navigate to VRChat Research page"
            >
              VRChat
              {location === '/vrchat' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 hdr-enhanced"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            <Link 
              href="/dashboard"
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-cyan-300 transition-colors duration-300 focus-enhanced link-enhanced hdr-enhanced ${location === '/dashboard' ? 'text-cyan-300' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Trading",
                description: "Autonomous Solana trading system with quantum consciousness architecture",
                category: "AI"
              })}
              onMouseLeave={handleMouseLeave}
              aria-label="Navigate to Trading Dashboard"
            >
              Trading
              {location === '/dashboard' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            <Link 
              href="/technical-deep-dive"
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-cyan-300 transition-colors duration-300 focus-enhanced link-enhanced hdr-enhanced ${location === '/technical-deep-dive' ? 'text-cyan-300' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Tech Deep Dive",
                description: "Comprehensive technical documentation and system architecture insights",
                category: "Technical"
              })}
              onMouseLeave={handleMouseLeave}
              aria-label="Navigate to Technical Deep Dive"
            >
              Tech
              {location === '/technical-deep-dive' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            <Link 
              href="/legal"
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-cyan-300 transition-colors duration-300 focus-enhanced link-enhanced hdr-enhanced ${location === '/legal' ? 'text-cyan-300' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Legal Compliance",
                description: "Comprehensive regulatory compliance monitoring across US, EU, and Canadian jurisdictions",
                category: "Legal"
              })}
              onMouseLeave={handleMouseLeave}
              aria-label="Navigate to Legal Compliance Dashboard"
            >
              <Shield className="w-4 h-4 inline mr-1" />
              Legal
              {location === '/legal' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            
            {/* Web3 Authentication - Only shows when Solana wallets detected */}
            <Web3AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 transition-colors"
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
              className="md:hidden border-t border-cyan-400/20 bg-[var(--space-black)]/95 backdrop-blur-md mt-3"
            >
              <div className="px-3 py-3 space-y-2">
                <button 
                  onClick={() => { scrollToSection('about'); setIsOpen(false); }} 
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-cyan-300 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20 transition-all duration-300"
                >
                  About
                </button>
                <button 
                  onClick={() => { scrollToSection('projects'); setIsOpen(false); }} 
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-cyan-300 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20 transition-all duration-300"
                >
                  Projects
                </button>
                <button 
                  onClick={() => { scrollToSection('skills'); setIsOpen(false); }} 
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-cyan-300 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20 transition-all duration-300"
                >
                  Skills
                </button>
                <Link 
                  href="/values"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location === '/values'
                      ? 'text-cyan-300 bg-cyan-400/15 border border-cyan-400/30'
                      : 'text-gray-300 hover:text-cyan-300 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Values
                </Link>
                <Link 
                  href="/vrchat"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location === '/vrchat'
                      ? 'text-cyan-300 bg-cyan-400/15 border border-cyan-400/30'
                      : 'text-gray-300 hover:text-cyan-300 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  VRChat
                </Link>
                <Link 
                  href="/dashboard"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location === '/dashboard'
                      ? 'text-cyan-300 bg-cyan-400/15 border border-cyan-400/30'
                      : 'text-gray-300 hover:text-cyan-300 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Trading
                </Link>
                <Link 
                  href="/technical-deep-dive"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location === '/technical-deep-dive'
                      ? 'text-cyan-300 bg-cyan-400/15 border border-cyan-400/30'
                      : 'text-gray-300 hover:text-cyan-300 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Tech Deep Dive
                </Link>
                <Link 
                  href="/legal"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location === '/legal'
                      ? 'text-cyan-300 bg-cyan-400/15 border border-cyan-400/30'
                      : 'text-gray-300 hover:text-cyan-300 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Legal Compliance
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}