import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-morphism' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-[var(--synthwave-cyan)] flex items-center hover:text-[var(--bright-blue)] transition-colors duration-300 cursor-pointer">
            <i className="fas fa-code mr-2"></i>
            reverb256
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('about')} 
              className={`hover:text-[var(--synthwave-cyan)] transition-colors duration-300 ${location === '/' ? 'text-white' : 'text-gray-400'}`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('projects')} 
              className={`hover:text-[var(--synthwave-cyan)] transition-colors duration-300 ${location === '/' ? 'text-white' : 'text-gray-400'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('skills')} 
              className={`hover:text-[var(--synthwave-cyan)] transition-colors duration-300 ${location === '/' ? 'text-white' : 'text-gray-400'}`}
            >
              Skills
            </button>
            <Link 
              href="/values"
              className={`hover:text-[var(--synthwave-cyan)] transition-colors duration-300 ${location === '/values' ? 'text-[var(--synthwave-cyan)]' : 'text-white'}`}
            >
              Values
            </Link>
            <button 
              onClick={() => scrollToSection('philosophy')} 
              className={`hover:text-[var(--synthwave-cyan)] transition-colors duration-300 ${location === '/' ? 'text-white' : 'text-gray-400'}`}
            >
              Philosophy
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={`hover:text-[var(--synthwave-cyan)] transition-colors duration-300 ${location === '/' ? 'text-white' : 'text-gray-400'}`}
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
              <Link 
                href="/values"
                className={`text-left hover:text-[var(--synthwave-cyan)] transition-colors duration-300 ${location === '/values' ? 'text-[var(--synthwave-cyan)]' : 'text-white'}`}
                onClick={() => setIsOpen(false)}
              >
                Values
              </Link>
              <button 
                onClick={() => scrollToSection('philosophy')} 
                className="text-left hover:text-[var(--synthwave-cyan)] transition-colors duration-300"
              >
                Philosophy
              </button>
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
