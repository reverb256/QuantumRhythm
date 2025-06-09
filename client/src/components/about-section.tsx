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
            backgroundImage: `url('/attached_assets/image_1749437115515.png')`,
            filter: 'brightness(0.3) saturate(1.4)',
          }}
        />
        
        {/* Digital stream overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-screen opacity-25" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437226380.png')`,
          }}
        />
        
        {/* Holographic accent */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-15" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437242188.png')`,
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
              
              {/* Main Bio Panel */}
              <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
                <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-6 flex items-center">
                  <i className="fas fa-user text-cyan-400 mr-4"></i>
                  About Me
                </h3>
                
                <p className="text-lg text-cyan-100 leading-relaxed mb-6">
                  <strong className="text-cyan-300">I'm a full-stack developer</strong> passionate about creating meaningful digital experiences. 
                  My work spans across modern web technologies including React, Node.js, and AI integration, 
                  with a focus on building applications that solve real problems for real people.
                </p>
                
                <p className="text-lg text-cyan-100 leading-relaxed">
                  Through my <strong className="text-cyan-300">VibeCoding methodology</strong>, I combine technical excellence with thoughtful design principles. 
                  This approach ensures every application is not only functionally robust but also accessible, user-friendly, 
                  and built with sustainable development practices.
                </p>
              </div>

              {/* Core Values Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: "fas fa-code",
                    title: "Full-Stack Development",
                    description: "React, Node.js, TypeScript, and modern web frameworks",
                    color: "from-cyan-400 to-blue-500"
                  },
                  {
                    icon: "fas fa-users",
                    title: "User-Centered Design",
                    description: "Prioritizing accessibility and intuitive user experiences",
                    color: "from-purple-400 to-pink-500"
                  },
                  {
                    icon: "fas fa-shopping-cart",
                    title: "E-commerce Solutions",
                    description: "Production-ready platforms with payment integration",
                    color: "from-green-400 to-teal-500"
                  },
                  {
                    icon: "fas fa-brain",
                    title: "AI Integration",
                    description: "Smart features that enhance without overwhelming",
                    color: "from-orange-400 to-red-500"
                  }
                ].map((value, index) => (
                  <div key={value.title} className="holo-panel p-6 rounded-2xl border border-cyan-400/30 gacha-shine">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center mb-4`}>
                      <i className={`${value.icon} text-white`}></i>
                    </div>
                    <h4 className="text-xl font-bold text-cyan-300 mb-3">{value.title}</h4>
                    <p className="text-cyan-100">{value.description}</p>
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