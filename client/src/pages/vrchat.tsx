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
        <div className="absolute inset-0 opacity-40">
          <img 
            src="/images/anime_sky_ethereal.png" 
            alt="Ethereal digital transformation sky" 
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
                <i className="fas fa-atom mr-3"></i>The Crucible of Virtual Transcendence
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <img 
                    src="/images/VRChat_2024-06-29_20-50-39.491_3840x2160_1749433625790.png" 
                    alt="Sacred virtual gathering space" 
                    className="w-full h-64 object-cover rounded-lg shadow-lg shadow-cyan-500/20" 
                  />
                </div>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="text-lg leading-relaxed">
                    <strong className="text-[var(--light-beam)]">In the sacred laboratories of VRChat,</strong> I discovered the profound alchemy that transmutes digital proximity into authentic human connection. Each virtual encounter became an experiment in presence engineering—where consciousness meets consciousness beyond the veil of flesh.
                  </p>
                  <p>
                    Through systematic exploration of avatar embodiment and spatial psychology, I unlocked the fundamental truth: presence is not bound by physicality but by the willingness to be vulnerable in shared digital space. This revelation became the cornerstone of my convergent technology philosophy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Implementation */}
          <div className={`max-w-6xl mx-auto mb-16 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h3 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--light-beam)] text-center">
                <i className="fas fa-brain mr-3"></i>Architecture of Digital Souls
              </h3>
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <img 
                    src="/images/VRChat_2024-07-13_22-51-01.625_3840x2160_1749433585286.png" 
                    alt="Sacred conversation circles" 
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg shadow-pink-500/20" 
                  />
                  <h4 className="font-semibold text-lg text-[var(--synthwave-cyan)] mb-3">Sonic Presence Weaving</h4>
                  <p className="text-sm text-gray-300">
                    Mastering the invisible threads of spatial audio that bind hearts across digital distances, 
                    crafting intimate conversation sanctuaries where whispers carry the weight of truth.
                  </p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="/images/VRChat_2024-06-11_15-41-36.534_3840x2160_1749433637643.png" 
                    alt="Soul embodiment through avatars" 
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg shadow-cyan-500/20" 
                  />
                  <h4 className="font-semibold text-lg text-[var(--synthwave-pink)] mb-3">Avatar Alchemy</h4>
                  <p className="text-sm text-gray-300">
                    Transforming pixels into vessels of authentic self-expression, where digital flesh becomes 
                    sacred vessels channeling the raw essence of human connection and vulnerability.
                  </p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="/images/VRChat_2024-02-21_16-21-17.090_3840x2160_1749433779729.png" 
                    alt="Transcendent virtual realms" 
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg shadow-purple-500/20" 
                  />
                  <h4 className="font-semibold text-lg text-[var(--synthwave-gold)] mb-3">Consciousness Liberation</h4>
                  <p className="text-sm text-gray-300">
                    Engineering digital spaces where identity transcends physical limitations, 
                    enabling profound personality metamorphosis through embodied virtual experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Research Applications */}
          <div className={`max-w-6xl mx-auto mb-16 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h3 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--synthwave-cyan)] flex items-center justify-center">
                <i className="fas fa-fire mr-3"></i>The Sacred Rebellion Against Social Barriers
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    <strong className="text-[var(--light-beam)]">Revolutionary Revelation:</strong> Virtual worlds shatter the prison of social anxiety, transforming even the most introverted souls into radiant beacons of authentic expression.
                  </p>
                  <p>
                    In VRChat's ethereal realms, I discovered that consciousness unbound by physical form transcends every limitation society imposes. The shy become bold, the isolated become connected, and the guarded become vulnerable—all through the sacred alchemy of digital embodiment.
                  </p>
                  <p>
                    My systematic exploration of avatar psychology, spatial presence design, and emotional resonance engineering birthed a new paradigm: convergent technologies that honor both the precision of code and the profound complexity of human hearts.
                  </p>
                  <div className="glass-morphism p-4 rounded-lg border border-cyan-400/50">
                    <p className="text-[var(--light-beam)] font-semibold text-sm">Core Truth Unlocked:</p>
                    <p className="text-xs">
                      Virtual presence isn't escapism—it's liberation. When consciousness is freed from physical constraints, authentic self emerges with crystalline clarity.
                    </p>
                  </div>
                  <div className="pt-4">
                    <a 
                      href="https://vrchat.com/home/user/usr_bddf1b9a-608f-4507-a01e-ed4f91638524"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--bright-blue)] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                    >
                      <i className="fas fa-vr-cardboard mr-2"></i>Witness the Journey
                    </a>
                  </div>
                </div>
                <div>
                  <img 
                    src="/images/VRChat_2024-04-27_17-35-01.884_3840x2160_1749433681186.png" 
                    alt="Transformation through virtual connection" 
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
                <i className="fas fa-star mr-3"></i>Chronicles of Digital Metamorphosis
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <img 
                    src="/images/VRChat_2024-03-18_22-02-47.860_3840x2160_1749433712016.png" 
                    alt="Sacred gathering in virtual sanctuary" 
                    className="w-full h-40 object-cover rounded-lg shadow-lg shadow-amber-500/20" 
                  />
                  <p className="text-xs text-gray-400 text-center">Where strangers become family through shared digital communion</p>
                </div>
                
                <div className="space-y-3">
                  <img 
                    src="/images/VRChat_2024-02-04_07-15-51.693_3840x2160_1749433722320.png" 
                    alt="Avatar as vessel of authentic self" 
                    className="w-full h-40 object-cover rounded-lg shadow-lg shadow-green-500/20" 
                  />
                  <p className="text-xs text-gray-400 text-center">Digital flesh liberating the essence trapped within physical form</p>
                </div>
                
                <div className="space-y-3">
                  <img 
                    src="/images/VRChat_2024-02-28_20-10-00.165_3840x2160_1749433771194.png" 
                    alt="Immersive conversation sanctuaries" 
                    className="w-full h-40 object-cover rounded-lg shadow-lg shadow-purple-500/20" 
                  />
                  <p className="text-xs text-gray-400 text-center">Environments engineered to dissolve social barriers and birth truth</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Transformation */}
          <div className={`max-w-6xl mx-auto fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.8s' }}>
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h3 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--synthwave-pink)] text-center">
                <i className="fas fa-phoenix-rising mr-3"></i>The Great Convergence of Flesh and Code
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    <strong className="text-[var(--light-beam)]">In VRChat's sacred digital sanctuaries,</strong> I witnessed the birth of a new paradigm—where consciousness transcends flesh, where authentic connection ignites across impossible distances, where the very fabric of human interaction is rewoven by lines of code and dreams of pixels.
                  </p>
                  <p>
                    Through thousands of hours documenting human behavior liberated from physical limitations, I unlocked the fundamental algorithms of authentic connection. The introverted discovered their roar, the isolated forged unbreakable bonds, and the authentic self emerged like a phoenix from the ashes of social constraint.
                  </p>
                  <div className="glass-morphism p-6 rounded-xl border border-pink-400/50 bg-gradient-to-r from-pink-900/20 to-purple-900/20">
                    <p className="text-[var(--light-beam)] font-semibold mb-3 text-lg">
                      "The heart recognizes truth regardless of whether it flows through blood vessels or fiber optic cables."
                    </p>
                    <p className="text-sm text-gray-400">
                      This revelation became the nuclear core of my convergent technology philosophy—building systems that honor the profound complexity of human souls seeking connection.
                    </p>
                  </div>
                  <p className="text-xl text-[var(--light-beam)] font-semibold">
                    Every project I build carries this sacred knowledge—technology must serve not just efficiency, but the eternal human quest for understanding, belonging, and transcendence.
                  </p>
                </div>
                <div className="relative">
                  <img 
                    src="/images/anime_character_aspirational.png" 
                    alt="Digital soul reaching for transcendence" 
                    className="w-full h-auto rounded-lg shadow-2xl shadow-cyan-500/30" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--space-black)]/40 to-transparent rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}