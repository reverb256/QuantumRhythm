import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import GeometricBackground from "@/components/geometric-background";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Values() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/attached_assets/catboy2025BG_1749433079455.png" 
            alt="Cyberpunk space background" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* Quantum Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="quantum-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-6 py-3 prismatic-glass rounded-full border border-cyan-400/50 mb-8">
              <i className="fas fa-compass text-cyan-400 mr-3"></i>
              <span className="text-cyan-300 text-sm font-medium">CORE_VALUES</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space">
              <span className="holo-text">Core Values</span>
            </h1>
            
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              Principles that guide my development philosophy and approach to building meaningful technology
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 relative" ref={elementRef}>
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space text-center fade-in-up ${isVisible ? 'animate' : ''}`}>
            <span className="holo-text">Development Philosophy</span>
          </h2>
          
          <div className={`max-w-4xl mx-auto text-center mb-16 fade-in-up ${isVisible ? 'animate' : ''}`}>
            <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
              <div className="font-mono text-sm text-left bg-[var(--space-black)] p-6 rounded-lg border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
                <span className="text-[var(--synthwave-pink)]">const</span> <span className="text-[var(--synthwave-cyan)]">developmentValues</span> <span className="text-white">=</span> <span className="text-yellow-400">&#123;</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)]">userFirst</span><span className="text-white">:</span> <span className="text-green-400">"accessibility + intuitive_design + meaningful_solutions"</span><span className="text-white">,</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)]">excellence</span><span className="text-white">:</span> <span className="text-green-400">"clean_code + best_practices + continuous_learning"</span><span className="text-white">,</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)]">ethics</span><span className="text-white">:</span> <span className="text-green-400">"privacy + transparency + responsible_ai"</span><span className="text-white">,</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)]">impact</span><span className="text-white">:</span> <span className="text-green-400">"solve_real_problems + enhance_human_connection"</span><br />
                <span className="text-yellow-400">&#125;;</span><br /><br />
                <span className="text-gray-400">// Principles that guide every project, every decision, every line of code</span>
              </div>
              <p className="text-gray-300 mt-6 leading-relaxed">
                <strong className="text-[var(--light-beam)]">Core principles encoded into every project</strong>—
                these values ensure that technology serves humanity's best interests while maintaining technical excellence.
              </p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* User-Centered Design */}
            <div className={`holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--synthwave-gold)] to-[var(--bright-blue)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-users text-[var(--space-black)] text-xl"></i>
                </div>
                <h3 className="font-semibold text-xl text-[var(--synthwave-gold)]">User-Centered Design</h3>
                <p className="text-sm text-gray-400 mt-2">Human-First Development</p>
              </div>
              
              <p className="text-gray-300 mb-6 text-center leading-relaxed">
                Every interface should feel intuitive, every interaction meaningful. I prioritize accessibility, 
                usability, and genuine user needs over flashy features. Technology should enhance human capability, 
                not create barriers.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <i className="fas fa-universal-access text-[var(--synthwave-gold)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Accessibility built in from the start</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-mobile-alt text-[var(--synthwave-gold)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Responsive design across all devices</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-heart text-[var(--synthwave-gold)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Intuitive experiences that users love</span>
                </div>
              </div>
            </div>

            {/* Technical Excellence */}
            <div className={`holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--synthwave-pink)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-code text-[var(--space-black)] text-xl"></i>
                </div>
                <h3 className="font-semibold text-xl text-[var(--synthwave-cyan)]">Technical Excellence</h3>
                <p className="text-sm text-gray-400 mt-2">Quality & Performance</p>
              </div>
              
              <p className="text-gray-300 mb-6 text-center leading-relaxed">
                Clean, maintainable code isn't just a preference—it's a responsibility. I follow best practices, 
                write comprehensive tests, and build systems that scale. Every project is an opportunity to 
                demonstrate craftsmanship.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <i className="fas fa-shield-alt text-[var(--synthwave-cyan)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Security and privacy by design</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-rocket text-[var(--synthwave-cyan)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Performance optimization and scalability</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-[var(--synthwave-cyan)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Comprehensive testing and documentation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ethical Technology */}
          <div className="max-w-4xl mx-auto">
            <div className={`holo-panel p-8 md:p-12 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
              <h3 className="font-semibold text-2xl mb-6 text-[var(--synthwave-pink)] text-center">
                <i className="fas fa-balance-scale mr-3"></i>Ethical Technology Development
              </h3>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg text-center italic text-[var(--bright-blue)]">
                  "Technology is not neutral—it amplifies the values and intentions of its creators."
                </p>
                
                <p>
                  Every algorithm embodies choices about what matters, what's fair, and how humans should interact. 
                  As developers, we have the responsibility to consider the broader impact of our work, ensuring that 
                  innovation serves human flourishing rather than exploitation.
                </p>
                
                <p>
                  Privacy isn't a feature to be added later—it's a fundamental right that must be designed into systems 
                  from the ground up. Data collection should serve users, not extract value from them without consent.
                </p>
                
                <p>
                  AI systems should augment human capabilities while preserving human agency. Automation should free people 
                  to focus on creative and meaningful work, not replace human judgment in critical decisions.
                </p>
                
                <div className="bg-gradient-to-r from-[var(--synthwave-pink)]/10 to-[var(--synthwave-gold)]/10 p-6 rounded-lg border border-[var(--synthwave-pink)]/30">
                  <p className="text-center font-semibold text-[var(--synthwave-gold)]">
                    "The best technology feels like magic, but it's built on principles that prioritize human dignity."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Principles */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <h2 className="font-bold text-3xl md:text-4xl text-center mb-16 text-[var(--bright-blue)]">
            Development Principles
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Continuous Learning */}
            <div className="holo-panel p-6 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--synthwave-pink)] to-[var(--synthwave-gold)] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-[var(--space-black)] text-lg"></i>
                </div>
                <h3 className="font-semibold text-lg text-[var(--synthwave-pink)]">Continuous Learning</h3>
                <p className="text-xs text-gray-400">Growth Mindset</p>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-4">
                Technology evolves rapidly, and staying current requires dedication to learning. 
                I embrace new frameworks and techniques while maintaining focus on fundamentals.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <i className="fas fa-book text-[var(--synthwave-pink)] mr-2"></i>
                  <span className="text-gray-400">Regular skill development and training</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-users-cog text-[var(--synthwave-pink)] mr-2"></i>
                  <span className="text-gray-400">Community involvement and knowledge sharing</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-lightbulb text-[var(--synthwave-pink)] mr-2"></i>
                  <span className="text-gray-400">Experimenting with emerging technologies</span>
                </div>
              </div>
            </div>

            {/* Collaboration */}
            <div className="holo-panel p-6 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--bright-blue)] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <i className="fas fa-handshake text-[var(--space-black)] text-lg"></i>
                </div>
                <h3 className="font-semibold text-lg text-[var(--synthwave-cyan)]">Collaboration</h3>
                <p className="text-xs text-gray-400">Team Success</p>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-4">
                Great software is built by teams, not individuals. I value clear communication, 
                constructive feedback, and shared ownership of outcomes.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <i className="fas fa-comments text-[var(--synthwave-cyan)] mr-2"></i>
                  <span className="text-gray-400">Clear and honest communication</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-code-branch text-[var(--synthwave-cyan)] mr-2"></i>
                  <span className="text-gray-400">Collaborative development practices</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-trophy text-[var(--synthwave-cyan)] mr-2"></i>
                  <span className="text-gray-400">Shared responsibility for project success</span>
                </div>
              </div>
            </div>

            {/* Innovation */}
            <div className="holo-panel p-6 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--synthwave-gold)] to-[var(--synthwave-pink)] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <i className="fas fa-rocket text-[var(--space-black)] text-lg"></i>
                </div>
                <h3 className="font-semibold text-lg text-[var(--synthwave-gold)]">Innovation</h3>
                <p className="text-xs text-gray-400">Creative Solutions</p>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-4">
                While respecting proven patterns, I actively seek creative approaches to complex problems. 
                Innovation comes from understanding both constraints and possibilities.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <i className="fas fa-puzzle-piece text-[var(--synthwave-gold)] mr-2"></i>
                  <span className="text-gray-400">Creative problem-solving approaches</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-flask text-[var(--synthwave-gold)] mr-2"></i>
                  <span className="text-gray-400">Experimenting with new ideas and concepts</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-chart-line text-[var(--synthwave-gold)] mr-2"></i>
                  <span className="text-gray-400">Balancing innovation with reliability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VibeCoding Methodology */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="holo-panel p-8 md:p-12 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
              <h2 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--synthwave-cyan)] text-center">
                <i className="fas fa-infinity mr-3"></i>The VibeCoding Methodology
              </h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg text-center italic text-[var(--bright-blue)]">
                  "When technical excellence meets thoughtful design, software becomes an expression of human potential."
                </p>
                
                <p>
                  VibeCoding represents my integrated approach to software development—where philosophical principles inform 
                  technical decisions, and every project reflects a commitment to meaningful impact. It's about building 
                  technology that enhances human capability while respecting human agency.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="holo-panel p-6 rounded-2xl border border-[var(--synthwave-gold)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-gold)] mb-3 flex items-center">
                      <i className="fas fa-code mr-2"></i>Technical Practices
                    </h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Test-driven development with comprehensive coverage</li>
                      <li>• Clean architecture and maintainable code patterns</li>
                      <li>• Performance optimization without sacrificing clarity</li>
                      <li>• Accessibility and inclusive design from day one</li>
                    </ul>
                  </div>
                  
                  <div className="holo-panel p-6 rounded-2xl border border-[var(--synthwave-cyan)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-cyan)] mb-3 flex items-center">
                      <i className="fas fa-heart mr-2"></i>Human-Centered Values
                    </h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• User experience that prioritizes clarity over cleverness</li>
                      <li>• Privacy protection built into core architecture</li>
                      <li>• Meaningful feedback and error handling</li>
                      <li>• Technology that augments rather than replaces human judgment</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[var(--synthwave-pink)]/10 to-[var(--synthwave-gold)]/10 p-6 rounded-lg border border-[var(--synthwave-pink)]/30">
                  <p className="text-center font-semibold text-[var(--synthwave-gold)]">
                    "Great software doesn't just work—it empowers people to achieve their goals with dignity and joy."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}