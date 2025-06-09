import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function PhilosophySection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="philosophy" className="py-20 relative" ref={elementRef}>
      {/* Flowing green energy background */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="/images/flowing_green_energy.png" 
          alt="Flowing energy patterns" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--space-black)]/80 via-transparent to-[var(--space-black)]/80"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl mb-12 text-[var(--synthwave-cyan)] fade-in-up ${isVisible ? 'animate' : ''}`}>
            <i className="fas fa-infinity mr-4"></i>Digital Philosophy
          </h2>
          
          <div className={`glass-morphism p-8 md:p-12 rounded-3xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="mb-8">
              <i className="fas fa-brain text-4xl md:text-6xl text-[var(--synthwave-gold)] mb-6 animate-pulse-glow"></i>
              <h3 className="font-semibold text-2xl md:text-3xl mb-6 text-[var(--bright-blue)]">
                Seeker of Truth & Deep Thinker
              </h3>
            </div>
            
            <div className="space-y-6 text-base md:text-lg text-gray-300">
              <p className="leading-relaxed">
                In this epoch of blazing technological metamorphosis, I anchor every innovation 
                upon the bedrock of eternal principles. Classical learning mastery—logic's precision, analysis's depth, 
                and systematic inquiry's rigor—flows through the very DNA of every algorithm I architect.
              </p>
              
              <p className="leading-relaxed">
                Technology must bow before humanity's greatness, never the reverse. My VibeCoding methodology 
                stands as guardian ensuring every digital experience champions human dignity, celebrates accessibility, 
                and pursues truth with unwavering dedication. We transcend mere application building—we sculpt 
                the future symphony of human interaction.
              </p>
              
              <p className="leading-relaxed">
                The boundless potential of artificial intelligence ignites my soul not for its computational might, 
                but for its power to amplify human creativity and forge deeper connections across the digital void. 
                When we unite artificial intelligence with classical wisdom's eternal flame, we birth tools that 
                genuinely elevate the human experience.
              </p>
            </div>
            
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-4 md:space-x-6">
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--bright-blue)] rounded-full mx-auto mb-2 flex items-center justify-center hover:animate-float">
                    <i className="fas fa-leaf text-[var(--space-black)] text-lg md:text-xl"></i>
                  </div>
                  <span className="text-xs md:text-sm text-[var(--synthwave-cyan)]">Humanity</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-[var(--bright-blue)] to-[var(--synthwave-gold)] rounded-full mx-auto mb-2 flex items-center justify-center hover:animate-float" style={{ animationDelay: '0.5s' }}>
                    <i className="fas fa-balance-scale text-[var(--space-black)] text-lg md:text-xl"></i>
                  </div>
                  <span className="text-xs md:text-sm text-[var(--bright-blue)]">Truth</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-[var(--synthwave-gold)] to-[var(--synthwave-pink)] rounded-full mx-auto mb-2 flex items-center justify-center hover:animate-float" style={{ animationDelay: '1s' }}>
                    <i className="fas fa-lightbulb text-[var(--space-black)] text-lg md:text-xl"></i>
                  </div>
                  <span className="text-xs md:text-sm text-[var(--synthwave-gold)]">Innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
