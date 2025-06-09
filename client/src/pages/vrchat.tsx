import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Navigation from "@/components/navigation";
import GeometricBackground from "@/components/geometric-background";
import Footer from "@/components/footer";

export default function VRChat() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white relative">
      <Navigation />
      <GeometricBackground />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="/images/VRChat_2024-06-10_05-08-42.597_3840x2160_1749433636045.png" 
            alt="VRChat virtual connection moment" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--space-black)] opacity-70"></div>
        </div>
        
        {/* Central light beam effect */}
        <div className="absolute inset-x-0 top-0 bottom-0 w-2 mx-auto light-beam-vertical opacity-40"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl mb-6 text-gradient-cyan">
              Digital Presence Alchemy
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Where consciousness transcends flesh to forge connections that burn brighter than stars
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 relative" ref={elementRef}>
        <div className="container mx-auto px-6">
          
          {/* VR Social Architecture */}
          <div className={`max-w-6xl mx-auto mb-16 fade-in-up ${isVisible ? 'animate' : ''}`}>
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h2 className="font-bold text-3xl md:text-4xl mb-8 text-[var(--synthwave-pink)] text-center">
                <i className="fas fa-users mr-3"></i>VR Social Platform Mastery
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <img 
                    src="/images/VRChat_2024-06-29_20-50-39.491_3840x2160_1749433625790.png" 
                    alt="VRChat social interaction design" 
                    className="w-full h-64 object-cover rounded-lg shadow-lg shadow-cyan-500/20" 
                  />
                </div>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p>
                    Extensive VRChat experience provided deep insights into immersive social platform design, 
                    presence psychology, and the technical infrastructure required for meaningful virtual interactions. 
                    This hands-on research informed my understanding of spatial UX and embodied interface design.
                  </p>
                  <p>
                    Through systematic experimentation with avatar embodiment, spatial communication patterns, and 
                    virtual environment psychology, I developed expertise in designing digital spaces that foster 
                    authentic human connection and overcome traditional social interaction barriers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Implementation */}
          <div className={`max-w-6xl mx-auto mb-16 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h3 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--light-beam)] text-center">
                <i className="fas fa-cogs mr-3"></i>VR Platform Technical Analysis
              </h3>
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <img 
                    src="/images/VRChat_2024-07-13_22-51-01.625_3840x2160_1749433585286.png" 
                    alt="VRChat group interaction mechanics" 
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg shadow-pink-500/20" 
                  />
                  <h4 className="font-semibold text-lg text-[var(--synthwave-cyan)] mb-3">Spatial Audio Design</h4>
                  <p className="text-sm text-gray-300">
                    Advanced positional audio systems creating realistic conversation zones and natural 
                    interaction patterns that mirror physical social dynamics.
                  </p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="/images/VRChat_2024-06-11_15-41-36.534_3840x2160_1749433637643.png" 
                    alt="Avatar interaction systems" 
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg shadow-cyan-500/20" 
                  />
                  <h4 className="font-semibold text-lg text-[var(--synthwave-pink)] mb-3">Presence Engineering</h4>
                  <p className="text-sm text-gray-300">
                    Full-body tracking integration with haptic feedback systems enabling high-fidelity 
                    emotional expression through gesture and proximity-based interactions.
                  </p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="/images/VRChat_2024-02-21_16-21-17.090_3840x2160_1749433779729.png" 
                    alt="VR environment optimization" 
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg shadow-purple-500/20" 
                  />
                  <h4 className="font-semibold text-lg text-[var(--synthwave-gold)] mb-3">Avatar Psychology</h4>
                  <p className="text-sm text-gray-300">
                    Research into avatar embodiment effects on user behavior, confidence patterns, 
                    and social interaction optimization through virtual identity design.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Research Applications */}
          <div className={`max-w-6xl mx-auto mb-16 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h3 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--synthwave-cyan)] flex items-center justify-center">
                <i className="fas fa-flask mr-3"></i>Applied Social VR Research
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    <strong className="text-[var(--light-beam)]">Breakthrough Discovery:</strong> Virtual presence engineering can create authentic emotional responses through carefully designed interaction systems.
                  </p>
                  <p>
                    Extensive field research revealed that brain neuroplasticity enables genuine connection formation in virtual environments. This insight directly informed my approach to designing convergent technologies that honor both technical innovation and human psychology.
                  </p>
                  <p>
                    Through systematic experimentation with avatar embodiment, spatial audio design, and haptic feedback integration, I developed frameworks for creating digital spaces that overcome traditional social barriers and enable authentic self-expression.
                  </p>
                  <div className="glass-morphism p-4 rounded-lg border border-cyan-400/50">
                    <p className="text-[var(--light-beam)] font-semibold text-sm">Key Finding:</p>
                    <p className="text-xs">
                      Virtual environments can systematically reduce social anxiety and enable personality development through controlled exposure therapy in safe, customizable social contexts.
                    </p>
                  </div>
                  <div className="pt-4">
                    <a 
                      href="https://vrchat.com/home/user/usr_bddf1b9a-608f-4507-a01e-ed4f91638524"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--bright-blue)] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                    >
                      <i className="fas fa-vr-cardboard mr-2"></i>View VRChat Profile
                    </a>
                  </div>
                </div>
                <div>
                  <img 
                    src="/images/VRChat_2024-04-27_17-35-01.884_3840x2160_1749433681186.png" 
                    alt="VRChat research environment" 
                    className="w-full h-80 object-cover rounded-lg shadow-lg shadow-cyan-400/30" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transformation Gallery */}
          <div className={`max-w-6xl mx-auto mb-16 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h3 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--synthwave-gold)] text-center">
                <i className="fas fa-camera mr-3"></i>Moments of Authentic Connection
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <img 
                    src="/images/VRChat_2024-03-18_22-02-47.860_3840x2160_1749433712016.png" 
                    alt="VRChat pool hall gathering" 
                    className="w-full h-40 object-cover rounded-lg shadow-lg shadow-amber-500/20" 
                  />
                  <p className="text-xs text-gray-400 text-center">Shared experiences transcending physical space</p>
                </div>
                
                <div className="space-y-3">
                  <img 
                    src="/images/VRChat_2024-02-04_07-15-51.693_3840x2160_1749433722320.png" 
                    alt="Unique avatar expression" 
                    className="w-full h-40 object-cover rounded-lg shadow-lg shadow-green-500/20" 
                  />
                  <p className="text-xs text-gray-400 text-center">Identity expression beyond conventional limits</p>
                </div>
                
                <div className="space-y-3">
                  <img 
                    src="/images/VRChat_2024-02-28_20-10-00.165_3840x2160_1749433771194.png" 
                    alt="Cybernetic environment interaction" 
                    className="w-full h-40 object-cover rounded-lg shadow-lg shadow-purple-500/20" 
                  />
                  <p className="text-xs text-gray-400 text-center">Environments that foster genuine conversation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Transformation */}
          <div className={`max-w-6xl mx-auto fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.8s' }}>
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h3 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--synthwave-pink)] text-center">
                <i className="fas fa-seedling mr-3"></i>The Convergence Revelation
              </h3>
              
              <div className="space-y-6 text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
                <p className="text-lg">
                  VRChat taught me that presence transcends physicality—that genuine connection emerges from 
                  consciousness meeting consciousness, regardless of the medium. This revelation became foundational 
                  to my understanding of convergent technologies.
                </p>
                <p>
                  Through thousands of hours in virtual worlds, I learned to embrace vulnerability, express 
                  authentic emotion, and forge relationships that rivaled those formed in physical space. The 
                  shyness that once constrained me dissolved in environments where personality could shine 
                  unencumbered by physical self-consciousness.
                </p>
                <p className="text-xl text-[var(--light-beam)] font-semibold">
                  Virtual presence revealed that the most human connections often occur when we transcend the limitations of humanity itself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}