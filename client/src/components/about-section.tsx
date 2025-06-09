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
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--bright-blue)]">
                <i className="fas fa-maple-leaf mr-2 text-[var(--synthwave-cyan)]"></i>Canadian Values
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                A proud Canadian who stands firm in humanity's boundless potential and the enduring power of classical learning. 
                My approach weaves traditional analytical mastery with revolutionary AI orchestration, 
                forging digital experiences that celebrate both blazing innovation and eternal principles of wisdom.
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
                <i className="fas fa-brain mr-2 text-[var(--synthwave-gold)]"></i>AI Orchestration
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Architecting the VibeCoding methodology—a revolutionary fusion of authentic business intelligence, 
                accessibility-first consciousness, and AI-enhanced development mastery. Every algorithm breathes 
                with both technical excellence and unwavering human dignity.
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
