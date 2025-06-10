import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal, Shield, Brain, Zap } from 'lucide-react';
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
          <div className="hidden md:flex items-center space-x-2">
            {/* Page Links */}
            <Link href="/cloudflare" className={navItemClass('/cloudflare')}>
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Cloudflare AI</span>
              </div>
            </Link>
            
            <Link href="/defi" className={navItemClass('/defi')}>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>DeFi</span>
              </div>
            </Link>
            
            {/* Section Buttons (for home page) */}
            <button onClick={() => scrollToSection('about')} className={sectionButtonClass}>
              About
            </button>
            
            <button onClick={() => scrollToSection('projects')} className={sectionButtonClass}>
              Projects
            </button>
            
            <button onClick={() => scrollToSection('skills')} className={sectionButtonClass}>
              Skills
            </button>
            
            <Link href="/values" className={navItemClass('/values')}>
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
            
            <Link href="/vrchat" className={navItemClass('/vrchat')}>
              VRChat
              {location === '/vrchat' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            
            <Link href="/dashboard" className={navItemClass('/dashboard')}>
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
            
            <Link href="/technical-deep-dive" className={navItemClass('/technical-deep-dive')}>
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
            
            <Link href="/legal" className={navItemClass('/legal')}>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Legal</span>
              </div>
              {location === '/legal' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
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
              <div className="px-3 py-3 space-y-2">
                <button 
                  onClick={() => { scrollToSection('about'); setIsOpen(false); }} 
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-accent hover:bg-primary/10 transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => { scrollToSection('projects'); setIsOpen(false); }} 
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-accent hover:bg-primary/10 transition-colors"
                >
                  Projects
                </button>
                <button 
                  onClick={() => { scrollToSection('skills'); setIsOpen(false); }} 
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-accent hover:bg-primary/10 transition-colors"
                >
                  Skills
                </button>
                <Link 
                  href="/values"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location === '/values'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Values
                </Link>
                <Link 
                  href="/vrchat"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location === '/vrchat'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  VRChat
                </Link>
                <Link 
                  href="/dashboard"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location === '/dashboard'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Trading
                </Link>
                <Link 
                  href="/technical-deep-dive"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location === '/technical-deep-dive'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Tech Deep Dive
                </Link>
                <Link 
                  href="/cloudflare"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location === '/cloudflare'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Cloudflare AI
                </Link>
                <Link 
                  href="/defi"
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location === '/defi'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  DeFi
                </Link>
                <Link 
                  href="/legal"
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location === '/legal'
                      ? 'text-accent bg-primary/15'
                      : 'text-muted-foreground hover:text-accent hover:bg-primary/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  <span>Legal Compliance</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}