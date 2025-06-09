import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'prismatic-glass border-b border-cyan-400/20 gacha-shine' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="font-bold text-xl text-cyan-300 flex items-center hover:text-cyan-100 transition-colors duration-300 cursor-pointer prismatic-glow"
            onMouseEnter={() => handleMouseEnter({
              title: "reverb256",
              description: "Consciousness architect and AI collaborator specializing in quantum development methodologies",
              category: "Personal Brand"
            })}
            onMouseLeave={handleMouseLeave}
          >
            <i className="fas fa-code mr-2 text-cyan-400"></i>
            reverb256<span className="console-cursor text-[var(--synthwave-cyan)]">|</span>
          </Link>

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
              className={`hover:text-cyan-300 transition-colors duration-300 ${location === '/' ? 'text-cyan-100' : 'text-gray-400'}`}
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
              className={`hover:text-cyan-300 transition-colors duration-300 ${location === '/' ? 'text-cyan-100' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Skills",
                description: "Technical expertise spanning infrastructure, development, and consciousness research",
                category: "Technical"
              })}
              onMouseLeave={handleMouseLeave}
            >
              Skills
            </button>
            <button 
              onClick={() => scrollToSection('philosophy')} 
              className={`hover:text-cyan-300 transition-colors duration-300 ${location === '/' ? 'text-cyan-100' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Philosophy",
                description: "Core principles and methodologies guiding conscious development practices",
                category: "Concept"
              })}
              onMouseLeave={handleMouseLeave}
            >
              Philosophy
            </button>
            <button 
              onClick={() => scrollToSection('gaming')} 
              className={`hover:text-cyan-300 transition-colors duration-300 ${location === '/' ? 'text-cyan-100' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Gaming",
                description: "2,890 hours of fighting game frame optimization and competitive analysis",
                category: "Research"
              })}
              onMouseLeave={handleMouseLeave}
            >
              Gaming
            </button>
            <Link 
              href="/values"
              className={`hover:text-cyan-300 transition-colors duration-300 ${location === '/values' ? 'text-cyan-300' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Values",
                description: "Ethical framework and principles guiding development decisions",
                category: "Philosophy"
              })}
              onMouseLeave={handleMouseLeave}
            >
              Values
            </Link>
            <Link 
              href="/vrchat"
              className={`hover:text-cyan-300 transition-colors duration-300 ${location === '/vrchat' ? 'text-cyan-300' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "VR Research",
                description: "4,320 hours of virtual reality consciousness exploration and social interaction research",
                category: "Research"
              })}
              onMouseLeave={handleMouseLeave}
            >
              VR Research
            </Link>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={`hover:text-cyan-300 transition-colors duration-300 ${location === '/' ? 'text-cyan-100' : 'text-gray-400'}`}
              onMouseEnter={() => handleMouseEnter({
                title: "Connect",
                description: "Get in touch for collaboration opportunities and consciousness-driven development",
                category: "Contact"
              })}
              onMouseLeave={handleMouseLeave}
            >
              Connect
            </button>
          </div>

          <button 
            className="md:hidden text-[var(--synthwave-cyan)]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 glass-morphism rounded-lg p-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-left hover:text-[var(--synthwave-cyan)] transition-colors duration-300"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('projects')} 
                className="text-left hover:text-[var(--synthwave-cyan)] transition-colors duration-300"
              >
                Projects
              </button>
              <button 
                onClick={() => scrollToSection('skills')} 
                className="text-left hover:text-[var(--synthwave-cyan)] transition-colors duration-300"
              >
                Skills
              </button>
              <button 
                onClick={() => scrollToSection('philosophy')} 
                className="text-left hover:text-[var(--synthwave-cyan)] transition-colors duration-300"
              >
                Philosophy
              </button>
              <button 
                onClick={() => scrollToSection('gaming')} 
                className="text-left hover:text-[var(--synthwave-cyan)] transition-colors duration-300"
              >
                Gaming
              </button>
              <Link 
                href="/values"
                className={`text-left hover:text-[var(--synthwave-cyan)] transition-colors duration-300 ${location === '/values' ? 'text-[var(--synthwave-cyan)]' : 'text-white'}`}
                onClick={() => setIsOpen(false)}
              >
                Values
              </Link>
              <Link 
                href="/vrchat"
                className={`text-left hover:text-[var(--synthwave-cyan)] transition-colors duration-300 ${location === '/vrchat' ? 'text-[var(--synthwave-cyan)]' : 'text-white'}`}
                onClick={() => setIsOpen(false)}
              >
                VR Research
              </Link>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-left hover:text-[var(--synthwave-cyan)] transition-colors duration-300"
              >
                Connect
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}