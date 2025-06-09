import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function ContactSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-[var(--deep-space)] to-[var(--space-black)]" ref={elementRef}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl mb-12 text-[var(--synthwave-cyan)] fade-in-up ${isVisible ? 'animate' : ''}`}>
            <i className="fas fa-satellite-dish mr-4"></i>Connect Across the Void
          </h2>
          
          <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border mb-8 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Ready to explore the intersection of classical wisdom and cutting-edge technology? 
              Let's build something that honors both innovation and human dignity.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <a 
                href="https://github.com/reverb256" 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-morphism p-4 md:p-6 rounded-xl border border-[var(--synthwave-cyan)]/50 hover:border-[var(--synthwave-cyan)] hover:shadow-lg hover:shadow-[var(--synthwave-cyan)]/30 transition-all duration-300 group"
              >
                <i className="fab fa-github text-3xl md:text-4xl text-[var(--synthwave-cyan)] mb-4 group-hover:scale-110 transition-transform duration-300"></i>
                <h3 className="font-semibold text-base md:text-lg text-[var(--bright-blue)]">GitHub</h3>
                <p className="text-gray-400 text-sm md:text-base">Code Repository</p>
              </a>
              
              <button className="glass-morphism p-4 md:p-6 rounded-xl border border-[var(--synthwave-pink)]/50 hover:border-[var(--synthwave-pink)] hover:shadow-lg hover:shadow-[var(--synthwave-pink)]/30 transition-all duration-300 group">
                <i className="fab fa-twitch text-3xl md:text-4xl text-[var(--synthwave-pink)] mb-4 group-hover:scale-110 transition-transform duration-300"></i>
                <h3 className="font-semibold text-base md:text-lg text-[var(--bright-blue)]">Twitch</h3>
                <p className="text-gray-400 text-sm md:text-base">Live Streams</p>
              </button>
              
              <a 
                href="mailto:contact@reverb256.dev" 
                className="glass-morphism p-4 md:p-6 rounded-xl border border-[var(--synthwave-gold)]/50 hover:border-[var(--synthwave-gold)] hover:shadow-lg hover:shadow-[var(--synthwave-gold)]/30 transition-all duration-300 group"
              >
                <i className="fas fa-envelope text-3xl md:text-4xl text-[var(--synthwave-gold)] mb-4 group-hover:scale-110 transition-transform duration-300"></i>
                <h3 className="font-semibold text-base md:text-lg text-[var(--bright-blue)]">Email</h3>
                <p className="text-gray-400 text-sm md:text-base">Direct Contact</p>
              </a>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className={`text-center fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              Interested in the VibeCoding methodology or enterprise AI integration?
            </p>
            <button 
              onClick={scrollToProjects}
              className="bg-gradient-to-r from-[var(--synthwave-cyan)] via-[var(--bright-blue)] to-[var(--synthwave-pink)] text-[var(--space-black)] px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:shadow-xl hover:shadow-[var(--synthwave-cyan)]/50 transition-all duration-300 inline-block"
            >
              Explore My Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
