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
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--bright-blue)]">🇨🇦 Canadian Values</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                A proud Canadian who believes in humanity's potential and the power of classical learning. 
                My approach combines traditional analytical methods with cutting-edge AI orchestration, 
                creating digital experiences that honor both innovation and timeless principles.
              </p>
            </div>
            
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--bright-blue)]">🎮 Digital Renaissance</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Almost 40 but feeling 20, I live at the intersection of rhythm games, anime culture, 
                and VR gaming. My Quest Pro with full body tracking isn't just entertainment—it's 
                research into the future of human-computer interaction.
              </p>
            </div>
            
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--bright-blue)]">🧠 AI Orchestration</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Pioneering the VibeCoding methodology—a fusion of authentic business analysis, 
                accessibility-first design, and AI-enhanced development. Every line of code serves 
                both technical excellence and human dignity.
              </p>
            </div>
            
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.8s' }}>
              <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--bright-blue)]">⚡ Infrastructure</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                Running a Proxmox cluster with multiple GPUs for AI training and cryptocurrency mining. 
                My homelab isn't just hobby tech—it's a testing ground for enterprise-scale solutions 
                and the future of decentralized computing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
