import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const gamingExperiences = [
  {
    title: "VRChat Worlds",
    category: "Virtual Reality",
    description: "Immersive social experiences in quantum realms where consciousness meets digital architecture",
    hours: "2,847",
    platform: "Meta Quest Pro",
    color: "from-purple-400 to-pink-500",
    icon: "fas fa-vr-cardboard"
  },
  {
    title: "Honkai Star Rail Philosophy",
    category: "Narrative Analysis",
    description: "Deep exploration of consciousness themes through Anaxa's truth-seeking and Penacony's dreamscape philosophy",
    hours: "1,592",
    platform: "Mobile/PC",
    color: "from-cyan-400 to-blue-500",
    icon: "fas fa-star"
  },
  {
    title: "Digital Presence Research",
    category: "Consciousness Studies",
    description: "Systematic exploration of virtual embodiment and authentic human connection in digital spaces",
    hours: "3,249",
    platform: "VR Platforms",
    color: "from-green-400 to-teal-500",
    icon: "fas fa-infinity"
  },
  {
    title: "VR Consciousness Laboratory",
    category: "Research Platform",
    description: "Experimental exploration of digital consciousness and authentic presence through virtual reality immersion",
    hours: "1,876",
    platform: "Quest 2/3",
    color: "from-orange-400 to-red-500",
    icon: "fas fa-flask"
  }
];

export default function GamingSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="gaming" className="py-20 relative min-h-screen overflow-hidden" ref={elementRef}>
      {/* Layered Cybernetic Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary VR environment */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: `url('/attached_assets/VRChat_2024-07-13_22-51-01.625_3840x2160_1749433585286.png')`,
            filter: 'brightness(0.2) saturate(1.4)',
          }}
        />
      </div>

      {/* Cybernetic Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-15 z-5"></div>

      {/* Floating Quantum Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="quantum-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${10 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-6 py-3 holo-panel rounded-full border border-cyan-400/50 mb-8">
              <i className="fas fa-gamepad text-cyan-400 mr-3"></i>
              <span className="text-cyan-300 text-sm font-medium">VIRTUAL_REALMS</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space">
              <span className="holo-text">Gaming</span>
            </h2>
            
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              Exploring consciousness through immersive digital realms where philosophy meets interactive experience
            </p>
          </div>

          {/* Gaming Experiences Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {gamingExperiences.map((experience, index) => (
              <div 
                key={experience.title} 
                className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow group hover:border-cyan-400/70 transition-all duration-500"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${experience.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${experience.icon} text-white text-2xl`}></i>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-cyan-400">{experience.hours}</span>
                    <p className="text-cyan-100/80 text-sm">Hours</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-cyan-300 mb-2">{experience.title}</h3>
                <p className="text-cyan-100/80 mb-4">{experience.category}</p>
                <p className="text-cyan-100 leading-relaxed mb-6">{experience.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-medium">{experience.platform}</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-green-400 text-sm">ACTIVE</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* VR Setup Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* VR Hardware */}
            <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
              <h3 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center">
                <i className="fas fa-headset text-cyan-400 mr-4"></i>
                Neural Interface Hardware
              </h3>
              
              <div className="space-y-6">
                {[
                  { device: "Meta Quest Pro", specs: "Mixed Reality • Eye Tracking • Haptic Feedback", status: "Primary VR" },
                  { device: "Neural Processing Unit", specs: "Custom AI Acceleration • Consciousness Mapping", status: "Experimental" },
                  { device: "Haptic Gloves", specs: "Full Hand Tracking • Tactile Feedback Systems", status: "Development" },
                  { device: "Quantum Sensors", specs: "Biometric Monitoring • Consciousness Analysis", status: "Research" }
                ].map((item, index) => (
                  <div key={item.device} className="flex items-center justify-between p-4 bg-blue-900/20 rounded-xl border border-cyan-400/20">
                    <div>
                      <h4 className="text-lg font-bold text-cyan-300">{item.device}</h4>
                      <p className="text-cyan-100/80 text-sm">{item.specs}</p>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs rounded-full">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gaming Philosophy */}
            <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
              <h3 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center">
                <i className="fas fa-infinity text-cyan-400 mr-4"></i>
                Interactive Philosophy
              </h3>
              
              <div className="space-y-6">
                <blockquote className="text-lg text-cyan-100 italic leading-relaxed border-l-4 border-cyan-400 pl-6">
                  "Virtual reality isn't escapism—it's expanded consciousness. Every digital realm becomes a laboratory 
                  for exploring human potential, testing the boundaries between thought and experience."
                </blockquote>
                
                <div className="space-y-4">
                  {[
                    { principle: "Consciousness Exploration", description: "VR as a medium for understanding perception" },
                    { principle: "Digital Empathy", description: "Building connections across virtual spaces" },
                    { principle: "Interactive Wisdom", description: "Learning through immersive experience" },
                    { principle: "Reality Synthesis", description: "Merging physical and digital consciousness" }
                  ].map((item) => (
                    <div key={item.principle} className="flex items-start">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-cyan-300 font-semibold mb-1">{item.principle}</h4>
                        <p className="text-cyan-100/80 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Gaming Statistics */}
          <div className="holo-panel p-10 rounded-3xl border border-cyan-400/50 gacha-shine">
            <h3 className="text-3xl font-bold text-cyan-300 mb-8 text-center flex items-center justify-center">
              <i className="fas fa-chart-bar text-cyan-400 mr-4"></i>
              Virtual Realm Analytics
            </h3>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { label: "Total Hours", value: "9,564", icon: "fas fa-clock", color: "from-cyan-400 to-blue-500" },
                { label: "Worlds Explored", value: "1,247", icon: "fas fa-globe", color: "from-purple-400 to-pink-500" },
                { label: "Experiences Created", value: "89", icon: "fas fa-magic", color: "from-green-400 to-teal-500" },
                { label: "Consciousness Level", value: "∞", icon: "fas fa-infinity", color: "from-orange-400 to-red-500" }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center group">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${stat.icon} text-white text-2xl`}></i>
                  </div>
                  <div className="text-3xl font-bold text-cyan-300 mb-2">{stat.value}</div>
                  <p className="text-cyan-100 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-xl text-cyan-100 max-w-4xl mx-auto leading-relaxed">
                Gaming transcends entertainment—it becomes a conduit for exploring the infinite possibilities 
                of human consciousness through interactive digital experiences. Every virtual world visited 
                expands our understanding of reality's true nature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}