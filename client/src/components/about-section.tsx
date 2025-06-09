import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function AboutSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-20 relative" ref={elementRef}>
      {/* Crystalline fragments background */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="/images/crystalline_fragments.png" 
          alt="Crystalline geometric patterns" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--space-black)]/85 to-[var(--deep-space)]/85"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl mb-12 text-center text-[var(--synthwave-cyan)] fade-in-up ${isVisible ? 'animate' : ''}`}>
            <i className="fas fa-atom mr-4"></i>Digital Architect
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl md:text-2xl font-semibold text-[var(--bright-blue)] mb-4">
                <i className="fas fa-code mr-3 text-[var(--synthwave-cyan)]"></i>
                The VibeCoding Journey
              </h3>
              <p className="text-gray-300 mb-4">
                From the frozen landscapes of Canada emerges a developer who bridges the ancient wisdom of philosophy 
                with the blazing frontier of modern technology. Every line of code becomes a meditation on possibility, 
                every algorithm a step toward digital enlightenment.
              </p>
              <p className="text-gray-300">
                Through years of crafting solutions that honor both innovation and human dignity, 
                I have cultivated a practice where technical excellence serves deeper purpose.
              </p>
            </div>
            
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
              <h3 className="text-xl md:text-2xl font-semibold text-[var(--bright-blue)] mb-4">
                <i className="fas fa-gamepad mr-3 text-[var(--synthwave-pink)]"></i>
                Virtual Realms Explorer
              </h3>
              <p className="text-gray-300 mb-4">
                In VRChat's infinite worlds, I discover the profound truth that digital presence can be 
                as meaningful as physical existence. Each virtual encounter teaches new lessons about 
                connection, creativity, and the boundless nature of human imagination.
              </p>
              <p className="text-gray-300">
                Gaming becomes more than entertainment—it transforms into a laboratory for understanding 
                human interaction, community building, and the future of digital society.
              </p>
            </div>
          </div>
          
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border mt-8 text-center fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--bright-blue)] mb-4">
              <i className="fas fa-infinity mr-3 text-[var(--synthwave-gold)]"></i>
              Philosophy Meets Technology
            </h3>
            <p className="text-lg text-gray-300">
              Where classical thought traditions converge with quantum computing possibilities, 
              where ancient ethical frameworks guide artificial intelligence development, 
              and where every technological choice reflects a deeper commitment to human flourishing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}