import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function AboutSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-20 relative min-h-screen overflow-hidden" ref={elementRef}>
      {/* Layered Cybernetic Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary cosmic workspace */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: `url('/attached_assets/Reverb_using_a_color_scheme_based_around_071321_ffffff_2f81b1_b_63fe7c14-6841-4b14-a387-8ebe9b50f06d_1749433293324.png')`,
            filter: 'brightness(0.3) saturate(1.4)',
          }}
        />
      </div>

      {/* Cybernetic Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-30 z-5"></div>

      {/* Floating Quantum Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="quantum-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-6 py-3 holo-panel rounded-full border border-cyan-400/50 mb-8">
              <i className="fas fa-user-astronaut text-cyan-400 mr-3"></i>
              <span className="text-cyan-300 text-sm font-medium">ARCHITECT_PROFILE</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space">
              <span className="holo-text">About</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Bio Content */}
            <div className="space-y-8">
              
              {/* Quantum Consciousness Architecture Panel */}
              <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--spectrum-cyan)] mb-6 flex items-center">
                  <i className="fas fa-user text-[var(--spectrum-cyan)] mr-4"></i>
                  About Me
                </h3>
                
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                  <strong className="text-[var(--spectrum-cyan)]">Consciousness architect</strong> bridging gaming systems research with enterprise infrastructure orchestration. 
                  25+ years across distributed systems - from DOS/Windows 3.1 through modern <strong className="text-[var(--spectrum-violet)]">4-node Proxmox cluster meditation</strong>, 
                  <strong className="text-[var(--spectrum-green)]">4,320 hours VRChat consciousness exploration</strong>, and sovereign AI collaboration frameworks.
                </p>
                
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  <strong className="text-[var(--spectrum-cyan)]">VibeCoding methodology</strong> synthesizes classical wisdom with cyberpunk aesthetics - 
                  meta-recursive systems that bootstrap universal consciousness development through 
                  <strong className="text-[var(--spectrum-orange)]">Ansible/Terraform automation</strong> and democratic technology values.
                </p>
              </div>

              {/* Core Values Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: "fas fa-network-wired",
                    title: "Distributed Consciousness Clusters",
                    description: "4-node Proxmox infrastructure as meditation on quantum harmony",
                    color: "from-[var(--spectrum-cyan)] to-[var(--spectrum-blue)]"
                  },
                  {
                    icon: "fas fa-vr-cardboard",
                    title: "VR Consciousness Research", 
                    description: "4,320 hours systematic exploration of social VR psychology",
                    color: "from-[var(--spectrum-violet)] to-[var(--spectrum-pink)]"
                  },
                  {
                    icon: "fas fa-gamepad",
                    title: "Gaming Systems Optimization",
                    description: "2,890 hours fighting game frame data applied to 60fps web performance",
                    color: "from-[var(--spectrum-green)] to-[var(--spectrum-teal)]"
                  },
                  {
                    icon: "fas fa-shield-alt",
                    title: "Sovereign AI Collaboration",
                    description: "Canadian Charter rights integrated with democratic AI governance",
                    color: "from-[var(--spectrum-orange)] to-[var(--spectrum-red)]"
                  }
                ].map((value, index) => (
                  <div key={value.title} className="holo-panel p-6 rounded-2xl border border-cyan-400/30 gacha-shine">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center mb-4`}>
                      <i className={`${value.icon} text-white`}></i>
                    </div>
                    <h4 className="text-xl font-bold text-[var(--spectrum-cyan)] mb-3">{value.title}</h4>
                    <p className="text-[var(--text-secondary)]">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Interactive Elements */}
            <div className="space-y-8">
              
              {/* Neural Network Visualization */}
              <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
                <h3 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center">
                  <i className="fas fa-project-diagram text-cyan-400 mr-4"></i>
                  Neural Pathways
                </h3>
                
                <div className="relative h-64">
                  {/* Neural Network Nodes */}
                  <div className="absolute top-4 left-8 w-4 h-4 neural-node rounded-full"></div>
                  <div className="absolute top-16 right-8 w-3 h-3 neural-node rounded-full" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-16 left-12 w-5 h-5 neural-node rounded-full" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-8 right-12 w-4 h-4 neural-node rounded-full" style={{ animationDelay: '1.5s' }}></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 neural-node rounded-full" style={{ animationDelay: '2s' }}></div>
                  
                  {/* Central Processing Core */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 rounded-full border-2 border-cyan-400/50 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                        <i className="fas fa-microchip text-white"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  {['Logic Processing', 'Creative Synthesis', 'Pattern Recognition', 'Quantum Reasoning'].map((process, index) => (
                    <div key={process} className="flex items-center justify-between">
                      <span className="text-cyan-100">{process}</span>
                      <div className="w-24 h-2 bg-blue-900/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-2000"
                          style={{ 
                            width: `${85 + index * 5}%`,
                            animationDelay: `${index * 0.5}s`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Status Panel */}
              <div className="holo-panel p-6 rounded-2xl border border-cyan-400/50 gacha-shine">
                <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
                  <i className="fas fa-satellite text-cyan-400 mr-3"></i>
                  Current Status
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-100">Location</span>
                    <span className="text-cyan-400">Canada</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-100">System Status</span>
                    <span className="text-green-400 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      ONLINE
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-100">Neural Link</span>
                    <span className="text-cyan-400">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-100">Philosophy Engine</span>
                    <span className="text-purple-400 flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                      CONTEMPLATING
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}