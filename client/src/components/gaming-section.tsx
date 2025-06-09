import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function GamingSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-gradient-to-b from-[var(--cyber-blue)] to-[var(--deep-space)]" ref={elementRef}>
      <div className="container mx-auto px-6">
        <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl text-center mb-12 text-[var(--synthwave-pink)] fade-in-up ${isVisible ? 'animate' : ''}`}>
          <i className="fas fa-gamepad mr-4"></i>Digital Passions
        </h2>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Rhythm Games */}
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <img 
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Colorful rhythm game interface with beat patterns" 
              className="w-full h-40 md:h-48 object-cover rounded-lg mb-6" 
            />
            
            <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--synthwave-pink)]">
              <i className="fas fa-music mr-2"></i>Rhythm Gaming
            </h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              DDR, Beatmania, and Beat Saber virtuoso. The surgical precision and hypnotic flow of rhythm gaming 
              courses through my approach to UI timing and user interaction orchestration, where every click 
              resonates with perfect tempo.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[var(--synthwave-pink)]/20 text-[var(--synthwave-pink)] rounded-full text-xs md:text-sm">DDR</span>
              <span className="px-3 py-1 bg-[var(--synthwave-pink)]/20 text-[var(--synthwave-pink)] rounded-full text-xs md:text-sm">Beatmania</span>
              <span className="px-3 py-1 bg-[var(--synthwave-pink)]/20 text-[var(--synthwave-pink)] rounded-full text-xs md:text-sm">Beat Saber</span>
            </div>
          </div>

          {/* HoYoverse Games */}
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.3s' }}>
            <div className="w-full h-40 md:h-48 bg-gradient-to-br from-[var(--synthwave-cyan)] via-[var(--bright-blue)] to-[var(--synthwave-pink)] rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[var(--space-black)]/60"></div>
              <div className="relative z-10 text-center">
                <i className="fas fa-star text-4xl md:text-6xl text-[var(--synthwave-gold)] mb-2"></i>
                <div className="text-[var(--synthwave-cyan)] font-bold text-lg">HoYoverse</div>
              </div>
            </div>
            
            <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--synthwave-cyan)]">
              <i className="fas fa-rocket mr-2"></i>Stellar Journeys
            </h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Honkai Star Rail, Genshin Impact, and Zenless Zone Zero devotee. These worlds embody the convergence 
              of narrative depth and technological artistry—where character development mirrors code architecture 
              and every quest teaches lessons in systematic design thinking.
            </p>
            <div className="mb-4">
              <div className="glass-morphism p-3 rounded-lg border border-[var(--synthwave-gold)]/50">
                <p className="text-[var(--synthwave-gold)] text-sm font-semibold mb-1">Anaxa - The Blasphemer Sage:</p>
                <p className="text-gray-300 text-xs md:text-sm">
                  Anaxagoras embodies my core philosophy—a defiant scholar who rejects dogma to pursue truth through reason. 
                  His declaration "In a world full of lies, I am the only truth" mirrors my approach to convergent technologies: 
                  questioning established patterns while forging new pathways between classical wisdom and AI innovation.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[var(--synthwave-cyan)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">Star Rail</span>
              <span className="px-3 py-1 bg-[var(--bright-blue)]/20 text-[var(--bright-blue)] rounded-full text-xs md:text-sm">Genshin</span>
              <span className="px-3 py-1 bg-[var(--synthwave-pink)]/20 text-[var(--synthwave-pink)] rounded-full text-xs md:text-sm">ZZZ</span>
            </div>
          </div>
          
          {/* VR Gaming */}
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.5s' }}>
            <img 
              src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="VR gaming setup with headset and controllers" 
              className="w-full h-40 md:h-48 object-cover rounded-lg mb-6" 
            />
            
            <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--synthwave-gold)]">
              <i className="fas fa-vr-cardboard mr-2"></i>VR Immersion
            </h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Quest Pro with full body tracking stands as my portal to the infinite frontier of human-computer symbiosis. 
              Every VR session becomes sacred research, expanding my mastery of spatial UI design and 
              immersive experience architecture that transcends the physical realm.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[var(--synthwave-gold)]/20 text-[var(--synthwave-gold)] rounded-full text-xs md:text-sm">Quest Pro</span>
              <span className="px-3 py-1 bg-[var(--synthwave-gold)]/20 text-[var(--synthwave-gold)] rounded-full text-xs md:text-sm">Full Body</span>
              <span className="px-3 py-1 bg-[var(--synthwave-gold)]/20 text-[var(--synthwave-gold)] rounded-full text-xs md:text-sm">Spatial UI</span>
            </div>
          </div>
          
          {/* Technology Convergence */}
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
            <div className="w-full h-40 md:h-48 bg-gradient-to-br from-[var(--synthwave-pink)] via-[var(--synthwave-cyan)] to-[var(--synthwave-gold)] rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              <div className="relative z-10 text-center">
                <i className="fas fa-project-diagram text-4xl md:text-6xl text-[var(--synthwave-cyan)] mb-2"></i>
                <div className="text-[var(--synthwave-gold)] font-bold text-sm">Cross-Empowerment</div>
              </div>
            </div>
            
            <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--synthwave-gold)]">
              <i className="fas fa-network-wired mr-2"></i>Convergent Systems
            </h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Gaming reveals the profound convergence of narrative architecture, behavioral psychology, and 
              technological innovation. Each virtual world becomes a testing ground for understanding how 
              classical principles can cross-empower modern AI systems, creating synergistic frameworks 
              that transcend individual domains.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[var(--synthwave-gold)]/20 text-[var(--synthwave-gold)] rounded-full text-xs md:text-sm">Systems Thinking</span>
              <span className="px-3 py-1 bg-[var(--synthwave-pink)]/20 text-[var(--synthwave-pink)] rounded-full text-xs md:text-sm">Cross-Domain</span>
              <span className="px-3 py-1 bg-[var(--synthwave-cyan)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">Innovation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
