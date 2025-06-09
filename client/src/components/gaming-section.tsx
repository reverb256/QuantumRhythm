import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function GamingSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 relative min-h-screen overflow-hidden" ref={elementRef}>
      {/* Enhanced Background with Cybernetic Portal Effects */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/25 to-cyan-900/20" />
        
        {/* Primary cybernetic portal - center background */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url('/images/cyber_portal_ring.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Energy spiral overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/images/energy_spiral_vortex.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Holographic platform base */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-2/3 opacity-15"
          style={{
            backgroundImage: `url('/images/holographic_platform.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Cyber fragments ring accent */}
        <div 
          className="absolute top-10 right-10 w-80 h-80 opacity-30 animate-pulse"
          style={{
            backgroundImage: `url('/images/cyber_fragments_ring.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animationDuration: '4s'
          }}
        />
        
        {/* Synthwave energy burst */}
        <div 
          className="absolute top-1/4 left-10 w-64 h-64 opacity-25"
          style={{
            backgroundImage: `url('/images/synthwave_energy_burst.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Floating crystal cubes */}
        <div 
          className="absolute bottom-1/3 right-1/4 w-56 h-56 opacity-20 animate-bounce"
          style={{
            backgroundImage: `url('/images/floating_crystal_cubes.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animationDuration: '5s'
          }}
        />
        
        {/* Anime character sky accent */}
        <div 
          className="absolute top-0 left-1/3 w-72 h-72 opacity-15"
          style={{
            backgroundImage: `url('/images/anime_character_sky.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-b from-transparent via-black/5 to-black/15" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-6">
        <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl text-center mb-12 text-cyan-300 fade-in-up ${isVisible ? 'animate' : ''}`}>
          <i className="fas fa-gamepad mr-4 text-purple-400"></i>Digital Passions
        </h2>
        
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Rhythm Games */}
          <div className={`backdrop-blur-md bg-black/20 border border-cyan-500/30 p-6 md:p-8 rounded-2xl shadow-2xl shadow-cyan-500/10 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div 
              className="w-full h-40 md:h-48 rounded-lg mb-6 relative overflow-hidden"
              style={{
                backgroundImage: `url('/images/synthwave_energy_burst.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/60 via-pink-500/60 to-cyan-400/60 flex items-center justify-center">
                <i className="fas fa-music text-6xl text-white drop-shadow-lg"></i>
              </div>
            </div>
            
            <h3 className="font-semibold text-xl md:text-2xl mb-4 text-pink-300">
              <i className="fas fa-music mr-2"></i>Rhythm Gaming
            </h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              DDR, Beatmania, and Beat Saber virtuoso. The surgical precision and hypnotic flow of rhythm gaming 
              courses through my approach to UI timing and user interaction orchestration, where every click 
              resonates with perfect tempo.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs md:text-sm border border-pink-500/30">DDR</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">Beatmania</span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs md:text-sm border border-cyan-500/30">Beat Saber</span>
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
          
          {/* World of Warcraft */}
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
            <div className="w-full h-40 md:h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[var(--space-black)]/50"></div>
              <div className="relative z-10 text-center">
                <i className="fas fa-bolt text-4xl md:text-6xl text-blue-300 mb-2"></i>
                <div className="text-purple-300 font-bold text-lg">Elemental Mastery</div>
              </div>
            </div>
            
            <h3 className="font-semibold text-xl md:text-2xl mb-4 text-blue-300">
              <i className="fas fa-magic mr-2"></i>World of Warcraft
            </h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Ten years of dedication as an Elemental Shaman Draenei, mastering the intricate dance of elemental forces 
              and strategic positioning. This decade-long journey through Azeroth taught profound lessons in systematic 
              thinking, resource optimization, and the delicate balance between power and precision that now flows through 
              every architecture I design.
            </p>
            <div className="mb-3">
              <div className="glass-morphism p-3 rounded-lg border border-blue-400/50">
                <p className="text-blue-300 text-sm font-semibold mb-1">Draenei Shaman Philosophy:</p>
                <p className="text-gray-300 text-xs md:text-sm">
                  The Light's wisdom channeled through elemental fury—a perfect metaphor for convergent technologies 
                  where ancient principles empower revolutionary systems.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm">Elemental</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm">Draenei</span>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs md:text-sm">10 Years</span>
            </div>
          </div>

          {/* Final Fantasy XIV */}
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.5s' }}>
            <div className="w-full h-40 md:h-48 bg-gradient-to-br from-amber-400 via-red-500 to-purple-600 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[var(--space-black)]/40"></div>
              <div className="relative z-10 text-center">
                <i className="fas fa-crown text-4xl md:text-6xl text-amber-300 mb-2"></i>
                <div className="text-red-300 font-bold text-lg">Striking Beauty</div>
              </div>
            </div>
            
            <h3 className="font-semibold text-xl md:text-2xl mb-4 text-amber-300">
              <i className="fas fa-feather-alt mr-2"></i>Final Fantasy XIV
            </h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              A strikingly beautiful experience that transcends gaming into pure artistry. The seamless integration 
              of narrative depth, visual splendor, and community connection creates a living testament to how 
              technology can elevate human storytelling. Every quest reveals new dimensions of design philosophy 
              that inspire my approach to creating meaningful digital experiences.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs md:text-sm">Visual Art</span>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs md:text-sm">Narrative</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm">Community</span>
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
