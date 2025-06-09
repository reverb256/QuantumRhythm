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
              Virtual Presence Philosophy
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Where digital embodiment transcends physical limitations to forge authentic human connections
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 relative" ref={elementRef}>
        <div className="container mx-auto px-6">
          
          {/* The Transformation */}
          <div className={`max-w-6xl mx-auto mb-16 fade-in-up ${isVisible ? 'animate' : ''}`}>
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h2 className="font-bold text-3xl md:text-4xl mb-8 text-[var(--synthwave-pink)] text-center">
                <i className="fas fa-butterfly mr-3"></i>The Digital Metamorphosis
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <img 
                    src="/images/VRChat_2024-06-29_20-50-39.491_3840x2160_1749433625790.png" 
                    alt="Intimate VRChat conversation moment" 
                    className="w-full h-64 object-cover rounded-lg shadow-lg shadow-cyan-500/20" 
                  />
                </div>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p>
                    VRChat became my crucible of transformation—a digital forge where shyness dissolved and authentic 
                    self-expression crystallized. Through virtual embodiment, I discovered profound truths about human 
                    connection that transcend the boundaries of physical space.
                  </p>
                  <p>
                    The platform shattered conventional limitations, allowing me to explore facets of identity and 
                    communication previously locked away by social anxiety. Each conversation became an experiment 
                    in presence, each virtual gesture a step toward genuine openness.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Presence Philosophy */}
          <div className={`max-w-6xl mx-auto mb-16 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h3 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--light-beam)] text-center">
                <i className="fas fa-brain mr-3"></i>The Neuroscience of Virtual Presence
              </h3>
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <img 
                    src="/images/VRChat_2024-07-13_22-51-01.625_3840x2160_1749433585286.png" 
                    alt="Group gathering in VRChat social space" 
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg shadow-pink-500/20" 
                  />
                  <h4 className="font-semibold text-lg text-[var(--synthwave-cyan)] mb-3">Embodied Cognition</h4>
                  <p className="text-sm text-gray-300">
                    Virtual avatars activate the same neural pathways as physical presence, creating genuine 
                    emotional bonds through spatial proximity and shared experiences.
                  </p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="/images/VRChat_2024-06-11_15-41-36.534_3840x2160_1749433637643.png" 
                    alt="Close virtual connection moment" 
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg shadow-cyan-500/20" 
                  />
                  <h4 className="font-semibold text-lg text-[var(--synthwave-pink)] mb-3">Authentic Intimacy</h4>
                  <p className="text-sm text-gray-300">
                    The brain's remarkable plasticity allows virtual touch, proximity, and eye contact to generate 
                    real emotional responses and deep interpersonal connections.
                  </p>
                </div>
                
                <div className="text-center">
                  <img 
                    src="/images/VRChat_2024-02-21_16-21-17.090_3840x2160_1749433779729.png" 
                    alt="Peaceful VRChat moment" 
                    className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg shadow-purple-500/20" 
                  />
                  <h4 className="font-semibold text-lg text-[var(--synthwave-gold)] mb-3">Identity Liberation</h4>
                  <p className="text-sm text-gray-300">
                    Virtual embodiment removes physical self-consciousness, allowing personality and essence 
                    to shine through unfiltered by conventional social barriers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Sacred Ethics */}
          <div className={`max-w-6xl mx-auto mb-16 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h3 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--synthwave-cyan)] flex items-center justify-center">
                <i className="fas fa-heart mr-3"></i>The Ethics of "Tricking" the Brain
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    <strong className="text-[var(--light-beam)]">Is it deception when virtual presence generates real emotion?</strong>
                  </p>
                  <p>
                    The philosophical question isn't whether we're "tricking" our brains—it's whether the connections 
                    formed through virtual presence are less authentic than those bound by physical proximity. My 
                    experience suggests they are not.
                  </p>
                  <p>
                    When two consciousness meet in virtual space, when avatars convey genuine emotion through gesture 
                    and proximity, when hearts synchronize across digital distances—this transcends mere illusion. 
                    It reveals the fundamental truth that connection exists in the realm of consciousness, not flesh.
                  </p>
                  <div className="glass-morphism p-4 rounded-lg border border-cyan-400/50">
                    <p className="text-[var(--light-beam)] font-semibold text-sm">Core Insight:</p>
                    <p className="text-xs">
                      Virtual presence doesn't diminish authentic connection—it reveals that authenticity was never 
                      dependent on physical form, but on the willingness to be vulnerable and present with another consciousness.
                    </p>
                  </div>
                </div>
                <div>
                  <img 
                    src="/images/VRChat_2024-04-27_17-35-01.884_3840x2160_1749433681186.png" 
                    alt="Diverse VRChat social gathering" 
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