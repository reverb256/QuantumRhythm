import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function ProjectsSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="projects" className="py-20 relative" ref={elementRef}>
      {/* Ice crystal burst background */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="/images/ice_crystal_burst.png" 
          alt="Crystal energy formations" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--deep-space)]/90 to-[var(--cyber-blue)]/90"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl text-center mb-12 text-[var(--synthwave-cyan)] fade-in-up ${isVisible ? 'animate' : ''}`}>
          <i className="fas fa-rocket mr-4"></i>Enterprise Projects
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Troves & Coves Project */}
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border hover:shadow-xl hover:shadow-[var(--synthwave-cyan)]/20 transition-all duration-500 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center mb-6">
              <div className="hexagon w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-[var(--synthwave-pink)] to-[var(--synthwave-gold)] mr-4 flex items-center justify-center">
                <i className="fas fa-gem text-[var(--space-black)] text-lg md:text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-xl md:text-2xl text-[var(--bright-blue)]">Troves & Coves</h3>
                <p className="text-gray-400 text-sm md:text-base">Crystal Jewelry E-commerce</p>
              </div>
            </div>
            
            <img 
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Luxury crystal jewelry display" 
              className="w-full h-40 md:h-48 object-cover rounded-lg mb-6" 
            />
            
            <p className="text-gray-300 mb-6 text-sm md:text-base">
              Sacred crystal sanctuary where mystical brand identity merges with cutting-edge e-commerce architecture. 
              This AI-enhanced platform channels spiritual energy through sophisticated product catalogs, 
              transforming ancient crystal wisdom into modern digital experiences that honor both commerce and consciousness.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-[var(--primary-blue)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">React</span>
              <span className="px-3 py-1 bg-[var(--primary-blue)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-[var(--primary-blue)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">E-commerce</span>
              <span className="px-3 py-1 bg-[var(--primary-blue)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">AI Integration</span>
            </div>
            
            <div className="flex gap-4">
              <a 
                href="https://www.trovesandcoves.ca/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[var(--synthwave-pink)] to-[var(--synthwave-gold)] text-[var(--space-black)] px-4 md:px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-[var(--synthwave-pink)]/50 transition-all duration-300 text-sm md:text-base"
              >
                Live Site
              </a>
              <a 
                href="https://github.com/reverb256/troves-coves" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-glass px-4 md:px-6 py-2 rounded-full transition-all duration-300 text-sm md:text-base"
              >
                <i className="fab fa-github mr-2"></i>Code
              </a>
            </div>
          </div>
          
          {/* Workplace Janitorial Project */}
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border hover:shadow-xl hover:shadow-[var(--bright-blue)]/20 transition-all duration-500 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center mb-6">
              <div className="hexagon w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-[var(--bright-blue)] to-[var(--synthwave-cyan)] mr-4 flex items-center justify-center">
                <i className="fas fa-building text-[var(--space-black)] text-lg md:text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-xl md:text-2xl text-[var(--bright-blue)]">Workplace Janitorial</h3>
                <p className="text-gray-400 text-sm md:text-base">Commercial Cleaning Platform</p>
              </div>
            </div>
            
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Modern office building with glass facade" 
              className="w-full h-40 md:h-48 object-cover rounded-lg mb-6" 
            />
            
            <p className="text-gray-300 mb-6 text-sm md:text-base">
              Enterprise fortress of commercial excellence wielding WCAG AAA compliance mastery, 
              AI-powered conversational intelligence, and fortress-grade OWASP security architecture. 
              This Winnipeg-rooted platform embodies the complete VibeCoding methodology in production-ready magnificence.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-[var(--primary-blue)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">VibeCoding</span>
              <span className="px-3 py-1 bg-[var(--primary-blue)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">WCAG AAA</span>
              <span className="px-3 py-1 bg-[var(--primary-blue)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">OWASP</span>
              <span className="px-3 py-1 bg-[var(--primary-blue)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">AI Chat</span>
            </div>
            
            <div className="flex gap-4">
              <a 
                href="https://github.com/reverb256/Local-Cleaning-Service" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[var(--bright-blue)] to-[var(--synthwave-cyan)] text-[var(--space-black)] px-4 md:px-6 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-[var(--bright-blue)]/50 transition-all duration-300 text-sm md:text-base"
              >
                View Project
              </a>
              <button className="btn-glass px-4 md:px-6 py-2 rounded-full transition-all duration-300 text-sm md:text-base">
                <i className="fas fa-external-link-alt mr-2"></i>Demo
              </button>
            </div>
          </div>
        </div>
        
        {/* VibeCoding Methodology Highlight */}
        <div className={`max-w-4xl mx-auto mt-12 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
          <div className="glass-morphism p-6 md:p-8 rounded-2xl cyber-border animate-pulse-glow">
            <div className="text-center">
              <h3 className="font-bold text-2xl md:text-3xl mb-4 text-[var(--synthwave-gold)]">
                <i className="fas fa-dna mr-3"></i>The VibeCoding Process
              </h3>
              <p className="text-lg md:text-xl text-gray-300 mb-6">
                A revolutionary web development methodology combining authentic business analysis, 
                accessibility-first design, AI orchestration, and enterprise security frameworks.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--bright-blue)] rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-search text-[var(--space-black)] text-lg md:text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-[var(--synthwave-cyan)] text-sm md:text-base">Discovery</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-[var(--bright-blue)] to-[var(--primary-blue)] rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-shield-alt text-[var(--space-black)] text-lg md:text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-[var(--bright-blue)] text-sm md:text-base">Security</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-[var(--primary-blue)] to-[var(--synthwave-pink)] rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-universal-access text-[var(--space-black)] text-lg md:text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-[var(--primary-blue)] text-sm md:text-base">Accessibility</h4>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-[var(--synthwave-pink)] to-[var(--synthwave-gold)] rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-robot text-[var(--space-black)] text-lg md:text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-[var(--synthwave-pink)] text-sm md:text-base">AI Integration</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
