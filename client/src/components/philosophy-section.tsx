import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const philosophicalConcepts = [
  {
    title: "Digital Convergence",
    subtitle: "Technology & Wisdom",
    description: "The sacred synthesis where ancient philosophical principles guide cutting-edge technological innovation, creating solutions that honor both human dignity and computational power.",
    icon: "fas fa-yin-yang",
    color: "from-cyan-400 to-blue-500"
  },
  {
    title: "Infinite Potential",
    subtitle: "Boundless Creation",
    description: "Every line of code, every digital interaction, every technological solution exists as an expression of humanity's limitless capacity for growth and transformation.",
    icon: "fas fa-infinity",
    color: "from-purple-400 to-pink-500"
  },
  {
    title: "Conscious Computing",
    subtitle: "AI with Soul",
    description: "Artificial intelligence must serve as an amplifier of human creativity and connection, never replacing the irreplaceable spark of human consciousness and wisdom.",
    icon: "fas fa-brain",
    color: "from-green-400 to-teal-500"
  },
  {
    title: "Truth Through Code",
    subtitle: "Ethical Architecture",
    description: "Every application becomes a vessel for truth-seeking, built upon foundations of accessibility, dignity, and genuine human connection across the digital divide.",
    icon: "fas fa-search",
    color: "from-orange-400 to-red-500"
  }
];

const coreBeliefs = [
  "Technology must bow before humanity's greatness, never the reverse",
  "Classical wisdom provides eternal foundations for digital innovation",
  "Every digital experience should celebrate human dignity and accessibility",
  "AI amplifies creativity rather than replacing human consciousness",
  "Truth-seeking guides every architectural decision",
  "Connection transcends the boundaries between physical and digital realms"
];

export default function PhilosophySection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="philosophy" className="py-20 relative min-h-screen overflow-hidden" ref={elementRef}>
      {/* Layered Cybernetic Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary consciousness flow */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437184067.png')`,
            filter: 'brightness(0.15) saturate(1.6)',
          }}
        />
        
        {/* Wisdom stream overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-screen opacity-12" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437187781.png')`,
          }}
        />
        
        {/* Philosophical energy patterns */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-18" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437191708.png')`,
          }}
        />
      </div>

      {/* Cybernetic Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-10 z-5"></div>

      {/* Floating Quantum Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="quantum-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-6 py-3 holo-panel rounded-full border border-cyan-400/50 mb-8">
              <i className="fas fa-infinity text-cyan-400 mr-3"></i>
              <span className="text-cyan-300 text-sm font-medium">CONSCIOUSNESS_ARCHITECTURE</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space">
              <span className="holo-text">Philosophy</span>
            </h2>
            
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              Where eternal wisdom meets technological innovation—every line of code an expression of human potential
            </p>
          </div>

          {/* Core Philosophy Statement */}
          <div className="holo-panel p-12 rounded-3xl border border-cyan-400/50 gacha-shine mb-16">
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-eye text-white text-3xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-cyan-300 mb-6">
                Seeker of Truth & Deep Thinker
              </h3>
            </div>
            
            <div className="space-y-8 text-lg text-cyan-100 leading-relaxed max-w-5xl mx-auto">
              <p>
                In this epoch of blazing technological metamorphosis, I anchor every innovation upon the bedrock of eternal principles. 
                Classical learning mastery—logic's precision, analysis's depth, and systematic inquiry's rigor—flows through the very DNA 
                of every algorithm I architect.
              </p>
              
              <p>
                Technology must bow before humanity's greatness, never the reverse. My VibeCoding methodology stands as guardian ensuring 
                every digital experience champions human dignity, celebrates accessibility, and pursues truth with unwavering dedication. 
                We transcend mere application building—we sculpt the future symphony of human interaction.
              </p>
              
              <p>
                The boundless potential of artificial intelligence ignites my soul not for its computational might, but for its power to 
                amplify human creativity and forge deeper connections across the digital void. When we unite artificial intelligence with 
                classical wisdom's eternal flame, we birth tools that genuinely elevate the human experience.
              </p>
            </div>
          </div>

          {/* Philosophical Concepts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {philosophicalConcepts.map((concept, index) => (
              <div 
                key={concept.title} 
                className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow group hover:border-cyan-400/70 transition-all duration-500"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${concept.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${concept.icon} text-white text-2xl`}></i>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-400/50 flex items-center justify-center">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-cyan-300 mb-2">{concept.title}</h3>
                <p className="text-cyan-100/80 mb-4">{concept.subtitle}</p>
                <p className="text-cyan-100 leading-relaxed">{concept.description}</p>
              </div>
            ))}
          </div>

          {/* Core Beliefs System */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* Beliefs List */}
            <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
              <h3 className="text-2xl font-bold text-cyan-300 mb-8 flex items-center">
                <i className="fas fa-lightbulb text-cyan-400 mr-4"></i>
                Core Principles
              </h3>
              
              <div className="space-y-6">
                {coreBeliefs.map((belief, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <p className="text-cyan-100 leading-relaxed">{belief}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wisdom Metrics */}
            <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
              <h3 className="text-2xl font-bold text-cyan-300 mb-8 flex items-center">
                <i className="fas fa-chart-line text-cyan-400 mr-4"></i>
                Wisdom Metrics
              </h3>
              
              <div className="space-y-6">
                {[
                  { aspect: "Classical Analysis", level: 97, description: "Logic, reasoning, systematic inquiry" },
                  { aspect: "Ethical Framework", level: 99, description: "Human dignity, accessibility, truth" },
                  { aspect: "Innovation Balance", level: 94, description: "Technology serving humanity" },
                  { aspect: "Consciousness Integration", level: 92, description: "AI amplifying human potential" }
                ].map((metric, index) => (
                  <div key={metric.aspect} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-300 font-medium">{metric.aspect}</span>
                      <span className="text-cyan-400 font-bold">{metric.level}%</span>
                    </div>
                    <div className="w-full h-2 bg-blue-900/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: isVisible ? `${metric.level}%` : '0%',
                          transitionDelay: `${index * 0.2}s`
                        }}
                      ></div>
                    </div>
                    <p className="text-cyan-100/80 text-sm">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Future Vision */}
          <div className="holo-panel p-10 rounded-3xl border border-cyan-400/50 gacha-shine">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-cyan-300 mb-6 flex items-center justify-center">
                <i className="fas fa-telescope text-cyan-400 mr-4"></i>
                Future Vision
              </h3>
              <p className="text-xl text-cyan-100 max-w-4xl mx-auto leading-relaxed">
                The convergence of ancient wisdom and modern technology will birth a new era of human potential—
                where every digital creation becomes a vessel for truth, connection, and the infinite expansion of consciousness.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-10">
              {[
                { 
                  icon: "fas fa-rocket", 
                  title: "Technological Transcendence", 
                  description: "AI and humans creating in perfect harmony",
                  color: "from-cyan-400 to-blue-500"
                },
                { 
                  icon: "fas fa-globe", 
                  title: "Universal Connection", 
                  description: "Digital bridges uniting all consciousness",
                  color: "from-purple-400 to-pink-500"
                },
                { 
                  icon: "fas fa-star", 
                  title: "Infinite Possibilities", 
                  description: "Every limitation transformed into opportunity",
                  color: "from-green-400 to-teal-500"
                }
              ].map((vision, index) => (
                <div key={vision.title} className="text-center group">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${vision.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${vision.icon} text-white text-2xl`}></i>
                  </div>
                  <h4 className="text-xl font-bold text-cyan-300 mb-3">{vision.title}</h4>
                  <p className="text-cyan-100 leading-relaxed">{vision.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}