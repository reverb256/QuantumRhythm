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
              DDR, Beatmania, and Beat Saber enthusiast. The precision and flow of rhythm games 
              influences my approach to UI timing and user interaction design.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[var(--synthwave-pink)]/20 text-[var(--synthwave-pink)] rounded-full text-xs md:text-sm">DDR</span>
              <span className="px-3 py-1 bg-[var(--synthwave-pink)]/20 text-[var(--synthwave-pink)] rounded-full text-xs md:text-sm">Beatmania</span>
              <span className="px-3 py-1 bg-[var(--synthwave-pink)]/20 text-[var(--synthwave-pink)] rounded-full text-xs md:text-sm">Beat Saber</span>
            </div>
          </div>
          
          {/* VR Gaming */}
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
            <img 
              src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="VR gaming setup with headset and controllers" 
              className="w-full h-40 md:h-48 object-cover rounded-lg mb-6" 
            />
            
            <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--synthwave-gold)]">
              <i className="fas fa-vr-cardboard mr-2"></i>VR Immersion
            </h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Quest Pro with full body tracking represents the frontier of human-computer interaction. 
              Every VR session informs my understanding of spatial UI and immersive experiences.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[var(--synthwave-gold)]/20 text-[var(--synthwave-gold)] rounded-full text-xs md:text-sm">Quest Pro</span>
              <span className="px-3 py-1 bg-[var(--synthwave-gold)]/20 text-[var(--synthwave-gold)] rounded-full text-xs md:text-sm">Full Body</span>
              <span className="px-3 py-1 bg-[var(--synthwave-gold)]/20 text-[var(--synthwave-gold)] rounded-full text-xs md:text-sm">Spatial UI</span>
            </div>
          </div>
          
          {/* Streaming & Content */}
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
            <div className="w-full h-40 md:h-48 bg-gradient-to-br from-[var(--synthwave-pink)] via-[var(--synthwave-cyan)] to-[var(--synthwave-gold)] rounded-lg mb-6 flex items-center justify-center">
              <i className="fas fa-city text-[var(--space-black)] text-4xl md:text-6xl opacity-50"></i>
            </div>
            
            <h3 className="font-semibold text-xl md:text-2xl mb-4 text-[var(--synthwave-cyan)]">
              <i className="fab fa-twitch mr-2"></i>Content Creation
            </h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Occasional Twitch streaming combines my love for gaming with community building. 
              Broadcasting VR sessions and development streams creates authentic connections.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[var(--synthwave-cyan)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">Twitch</span>
              <span className="px-3 py-1 bg-[var(--synthwave-cyan)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">VR Streams</span>
              <span className="px-3 py-1 bg-[var(--synthwave-cyan)]/20 text-[var(--synthwave-cyan)] rounded-full text-xs md:text-sm">Dev Talks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
