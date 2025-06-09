import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function AboutSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-20 relative min-h-screen overflow-hidden" ref={elementRef}>
      {/* Cybernetic Abstract Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/25 to-blue-900/20" />
        
        {/* Futuristic workspace environment */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url('/attached_assets/image_1749437115515.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.6) contrast(1.2)'
          }}
        />
        
        {/* Blue light streams */}
        <div 
          className="absolute inset-0 opacity-35 mix-blend-soft-light"
          style={{
            backgroundImage: `url('/attached_assets/image_1749437219730.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Circuit patterns accent */}
        <div 
          className="absolute top-20 right-20 w-80 h-80 opacity-20 animate-pulse"
          style={{
            backgroundImage: `url('/attached_assets/image_1749437231414.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animationDuration: '6s'
          }}
        />
        
        {/* Energy crystals */}
        <div 
          className="absolute bottom-20 left-20 w-64 h-64 opacity-25 animate-pulse"
          style={{
            backgroundImage: `url('/attached_assets/image_1749437206205.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animationDuration: '8s',
            animationDelay: '2s'
          }}
        />
        
        {/* Prismatic particle overlay */}
        <div className="absolute inset-0 particle-bg bg-gradient-to-b from-transparent via-blue-950/10 to-blue-950/25" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl mb-12 text-center bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent fade-in-up ${isVisible ? 'animate' : ''}`}>
            <i className="fas fa-atom mr-4 text-cyan-400"></i>Digital Architect
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