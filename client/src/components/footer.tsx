export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[var(--deep-space)] to-[var(--space-black)] py-12 border-t border-[var(--atmospheric-glow)] relative overflow-hidden">
      {/* Atmospheric background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 atmospheric-glow opacity-20"></div>
      <div className="absolute bottom-0 right-1/3 w-48 h-48 atmospheric-glow opacity-15"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="glass-morphism p-6 rounded-xl">
            <h3 className="font-bold text-lg text-gradient-cyan mb-4 flex items-center">
              <i className="fas fa-code mr-2"></i>
              reverb256
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Canadian architect of convergent technologies, orchestrating the cross-empowerment of classical wisdom 
              and revolutionary AI systems through luminous digital experiences.
            </p>
          </div>
          
          <div className="glass-morphism p-6 rounded-xl">
            <h4 className="font-semibold text-[var(--light-beam)] mb-4">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#about" className="text-gray-300 hover:text-[var(--light-beam)] transition-all duration-300 flex items-center group">
                <i className="fas fa-user-astronaut mr-2 group-hover:text-[var(--synthwave-cyan)]"></i>About
              </a></li>
              <li><a href="#projects" className="text-gray-300 hover:text-[var(--light-beam)] transition-all duration-300 flex items-center group">
                <i className="fas fa-rocket mr-2 group-hover:text-[var(--synthwave-cyan)]"></i>Projects
              </a></li>
              <li><a href="#skills" className="text-gray-300 hover:text-[var(--light-beam)] transition-all duration-300 flex items-center group">
                <i className="fas fa-brain mr-2 group-hover:text-[var(--synthwave-cyan)]"></i>Skills
              </a></li>
              <li><a href="/values" className="text-gray-300 hover:text-[var(--light-beam)] transition-all duration-300 flex items-center group">
                <i className="fas fa-maple-leaf mr-2 group-hover:text-[var(--synthwave-cyan)]"></i>Values
              </a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-[var(--light-beam)] transition-all duration-300 flex items-center group">
                <i className="fas fa-satellite-dish mr-2 group-hover:text-[var(--synthwave-cyan)]"></i>Connect
              </a></li>
            </ul>
          </div>
          
          <div className="glass-morphism p-6 rounded-xl">
            <h4 className="font-semibold text-[var(--light-beam)] mb-4">Digital Presence</h4>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://github.com/reverb256" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 glass-morphism rounded-full flex items-center justify-center text-gray-300 hover:text-[var(--light-beam)] hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
              <a 
                href="https://linkedin.com/in/reverb256" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 glass-morphism rounded-full flex items-center justify-center text-gray-300 hover:text-[var(--light-beam)] hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a 
                href="mailto:contact@reverb256.dev" 
                className="w-12 h-12 glass-morphism rounded-full flex items-center justify-center text-gray-300 hover:text-[var(--light-beam)] hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300"
              >
                <i className="fas fa-envelope text-xl"></i>
              </a>
            </div>
            <p className="text-xs text-gray-400">
              Building tomorrow's convergent systems today
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[var(--atmospheric-glow)] text-center">
          <p className="text-luminous text-sm">
            © 2025 reverb256 • Architecting luminous convergence between classical wisdom and revolutionary AI
          </p>
        </div>
      </div>
    </footer>
  );
}
