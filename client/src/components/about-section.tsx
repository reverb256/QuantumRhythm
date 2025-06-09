import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function AboutSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-20 relative" ref={elementRef}>
      {/* Deep space background */}
      <div className="absolute inset-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000" 
          alt="Deep space nebula background" 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl text-center mb-12 text-[var(--synthwave-cyan)] fade-in-up ${isVisible ? 'animate' : ''}`}>
            <i className="fas fa-user-astronaut mr-4"></i>About The Architect
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--bright-blue)] flex items-center">
                <svg className="w-8 h-5 mr-2" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
                  <rect width="1000" height="500" fill="#FF0000"/>
                  <rect x="250" y="0" width="500" height="500" fill="#FFFFFF"/>
                  <g transform="translate(500,250)">
                    <path d="M0,-83 L15,-67 L35,-75 L20,-55 L30,-35 L15,-45 L25,-25 L5,-35 L15,-15 L-15,-15 L-5,-35 L-25,-25 L-15,-45 L-30,-35 L-20,-55 L-35,-75 L-15,-67 Z" fill="#FF0000"/>
                    <rect x="-3" y="-15" width="6" height="60" fill="#FF0000"/>
                  </g>
                </svg>
                Canadian Values
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                A proud Canadian who champions humanity's infinite potential through the convergence of classical wisdom and 
                cutting-edge innovation. My work embodies the cross-empowerment of traditional analytical frameworks with 
                revolutionary AI systems, creating digital architectures that honor both blazing technological advancement 
                and timeless philosophical principles.
              </p>
            </div>
            
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--bright-blue)]">
                <i className="fas fa-gamepad mr-2 text-[var(--synthwave-pink)]"></i>Digital Renaissance
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Nearly four decades deep yet vibrating with the energy of twenty. I dance at the convergence of rhythm games, anime aesthetics, 
                and VR immersion. My Quest Pro with full body tracking transcends entertainment—it's pioneering research 
                into the infinite frontier of human-computer symbiosis.
              </p>
            </div>
            
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--bright-blue)]">
                <i className="fas fa-brain mr-2 text-[var(--synthwave-gold)]"></i>Convergent Intelligence
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Architecting the VibeCoding methodology—where classical analytical frameworks cross-empower 
                AI systems to create unprecedented technological synergies. Every algorithm embodies the 
                convergence of timeless wisdom and cutting-edge innovation, breathing with both technical 
                excellence and unwavering human dignity.
              </p>
            </div>
            
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.8s' }}>
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--bright-blue)]">
                <i className="fas fa-server mr-2 text-[var(--synthwave-cyan)]"></i>Infrastructure Mastery
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Commanding a Proxmox cluster armed with multiple GPUs for neural network training and cryptocurrency mining. 
                This homelab fortress transcends hobby territory—it's my proving ground for enterprise-scale innovations 
                and the birthplace of tomorrow's decentralized computing revolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
