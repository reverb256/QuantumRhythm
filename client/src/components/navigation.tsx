import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code, Zap, Terminal } from 'lucide-react';

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
      scrolled ? 'bg-[var(--space-black)]/95 backdrop-blur-xl border-b border-cyan-400/20' : 'bg-[var(--space-black)]/80 backdrop-blur-md'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Brand with Console */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link 
              href="/" 
              className="font-bold text-lg sm:text-xl text-cyan-300 flex items-center hover:text-cyan-100 transition-colors duration-300 cursor-pointer group"
              onMouseEnter={() => handleMouseEnter({
                title: "reverb256",
                description: "Consciousness architect and AI collaborator specializing in quantum development methodologies",
                category: "Personal Brand"
              })}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center mr-2"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </motion.div>
              reverb256<span className="console-cursor text-[var(--synthwave-cyan)] group-hover:animate-pulse">|</span>
            </Link>
            
            {/* Permanent Console Interface */}
            <motion.button
              onClick={toggleConsole}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center space-x-1.5 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 hover:border-cyan-400/50 rounded-lg px-2.5 py-1.5 transition-all duration-300 group shadow-lg hover:shadow-cyan-400/20"
              style={{
                boxShadow: isConsoleOpen ? '0 0 20px rgba(34, 211, 238, 0.3)' : '0 0 10px rgba(34, 211, 238, 0.1)',
              }}
            >
              <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 group-hover:text-cyan-300" />
              <span className="text-xs sm:text-sm font-mono text-cyan-300 group-hover:text-cyan-200 hidden sm:inline">
                console
              </span>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
            </motion.button>
          </div>

          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('about')} 
              className={`hover:text-cyan-300 transition-colors duration-300 ${location === '/' ? 'text-cyan-100' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "About",
                description: "Learn about the consciousness architect behind quantum development methodologies",
                category: "Personal"
              })}
              onMouseLeave={handleMouseLeave}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('projects')} 
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-cyan-300 transition-colors duration-300 ${location === '/' ? 'text-cyan-100' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Projects",
                description: "Production-ready applications showcasing VibeCoding methodology in action",
                category: "Portfolio"
              })}
              onMouseLeave={handleMouseLeave}
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('skills')} 
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-cyan-300 transition-colors duration-300 ${location === '/' ? 'text-cyan-100' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Skills",
                description: "Technical expertise spanning infrastructure, development, and consciousness research",
                category: "Technical"
              })}
              onMouseLeave={handleMouseLeave}
            >
              Skills
            </button>
            <Link 
              href="/values"
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-cyan-300 transition-colors duration-300 ${location === '/values' ? 'text-cyan-300' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Values",
                description: "Ethical framework and principles guiding development decisions",
                category: "Philosophy"
              })}
              onMouseLeave={handleMouseLeave}
            >
              Values
              {location === '/values' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            <Link 
              href="/vrchat"
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-cyan-300 transition-colors duration-300 ${location === '/vrchat' ? 'text-cyan-300' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "VR Research",
                description: "4,320 hours of virtual reality consciousness exploration and social interaction research",
                category: "Research"
              })}
              onMouseLeave={handleMouseLeave}
            >
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
            <Link 
              href="/dashboard"
              className={`relative px-2 py-1 text-sm lg:text-base font-medium hover:text-cyan-300 transition-colors duration-300 ${location === '/dashboard' ? 'text-cyan-300' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Trading",
                description: "Autonomous Solana trading system with quantum consciousness architecture",
                category: "AI"
              })}
              onMouseLeave={handleMouseLeave}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}