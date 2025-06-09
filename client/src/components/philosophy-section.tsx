import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function PhilosophySection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="philosophy" className="py-20 relative" ref={elementRef}>
      {/* Deep space with distant galaxies background */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000" 
          alt="Deep space with distant galaxies and stars" 
          className="w-full h-full object-cover" 
        />
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
                In an age of rapid technological evolution, I believe in anchoring innovation 
                with timeless principles. Classical learning methods—logic, analysis, and systematic 
                inquiry—form the foundation of every line of code I write.
              </p>
              
              <p className="leading-relaxed">
                Technology should serve humanity, not the other way around. My VibeCoding methodology 
                ensures that every digital experience honors human dignity, accessibility, and the 
                pursuit of truth. We're not just building applications; we're crafting the future 
                of human interaction.
              </p>
              
              <p className="leading-relaxed">
                The infinite potential of AI excites me not for its technical prowess, but for its 
                ability to amplify human creativity and connection. When we combine artificial 
                intelligence with classical wisdom, we create tools that genuinely improve lives.
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
