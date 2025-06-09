import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const skills = [
  { icon: "fab fa-react", name: "React", category: "Frontend Architecture", level: 95, color: "from-cyan-400 to-blue-500" },
  { icon: "fab fa-js-square", name: "TypeScript", category: "Type Systems", level: 92, color: "from-blue-400 to-indigo-500" },
  { icon: "fab fa-node-js", name: "Node.js", category: "Backend Systems", level: 90, color: "from-green-400 to-emerald-500" },
  { icon: "fas fa-database", name: "PostgreSQL", category: "Data Architecture", level: 88, color: "from-purple-400 to-violet-500" },
  { icon: "fas fa-robot", name: "AI/ML", category: "Neural Networks", level: 85, color: "from-pink-400 to-rose-500" },
  { icon: "fab fa-python", name: "Python", category: "AI Development", level: 87, color: "from-orange-400 to-red-500" },
  { icon: "fab fa-docker", name: "Docker", category: "DevOps", level: 82, color: "from-teal-400 to-cyan-500" },
  { icon: "fas fa-server", name: "Proxmox", category: "Infrastructure", level: 80, color: "from-indigo-400 to-purple-500" },
  { icon: "fab fa-bitcoin", name: "Blockchain", category: "Distributed Systems", level: 78, color: "from-yellow-400 to-orange-500" },
  { icon: "fas fa-shield-alt", name: "Security", category: "OWASP Standards", level: 84, color: "from-red-400 to-pink-500" },
  { icon: "fas fa-vr-cardboard", name: "VR Research", category: "Digital Consciousness", level: 90, color: "from-violet-400 to-purple-500" },
  { icon: "fas fa-infinity", name: "Philosophy", category: "Classical Learning", level: 95, color: "from-emerald-400 to-teal-500" }
];

export default function SkillsSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="skills" className="py-20 relative min-h-screen overflow-hidden" ref={elementRef}>
      {/* Layered Cybernetic Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary cosmic landscape */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437172806.png')`,
            filter: 'brightness(0.2) saturate(1.5)',
          }}
        />
        
        {/* Data stream overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-screen opacity-20" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437226380.png')`,
          }}
        />
        
        {/* Circuit pattern accent */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-10" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437231414.png')`,
          }}
        />
      </div>

      {/* Cybernetic Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20 z-5"></div>

      {/* Floating Quantum Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="quantum-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-6 py-3 holo-panel rounded-full border border-cyan-400/50 mb-8">
              <i className="fas fa-microchip text-cyan-400 mr-3"></i>
              <span className="text-cyan-300 text-sm font-medium">NEURAL_CAPABILITIES</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space">
              <span className="holo-text">Skills</span>
            </h2>
            
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              A convergent mastery spanning classical development paradigms and cutting-edge AI architectures
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {skills.map((skill, index) => (
              <div 
                key={skill.name} 
                className="holo-panel p-6 rounded-2xl border border-cyan-400/30 gacha-shine energy-flow group hover:border-cyan-400/60 transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${skill.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${skill.icon} text-white text-xl`}></i>
                  </div>
                  <span className="text-cyan-400 font-bold text-lg">{skill.level}%</span>
                </div>
                
                <h3 className="text-xl font-bold text-cyan-300 mb-2">{skill.name}</h3>
                <p className="text-cyan-100/80 text-sm mb-4">{skill.category}</p>
                
                {/* Skill Level Bar */}
                <div className="w-full h-2 bg-blue-900/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: isVisible ? `${skill.level}%` : '0%',
                      transitionDelay: `${index * 0.1}s`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Expertise Categories */}
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: "Frontend Mastery",
                icon: "fas fa-desktop",
                description: "Architecting responsive, performant user interfaces with React, TypeScript, and cutting-edge UI libraries",
                technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
                color: "from-cyan-400 to-blue-500"
              },
              {
                title: "Backend Engineering",
                icon: "fas fa-server",
                description: "Building scalable server architectures with Node.js, Python, and robust database systems",
                technologies: ["Node.js", "Python", "PostgreSQL", "Docker", "Microservices"],
                color: "from-purple-400 to-pink-500"
              },
              {
                title: "VR & Philosophy",
                icon: "fas fa-infinity",
                description: "Exploring digital consciousness through VR research and classical philosophical frameworks",
                technologies: ["VRChat Research", "Digital Presence", "Classical Learning", "Consciousness Studies", "Spatial Audio"],
                color: "from-green-400 to-teal-500"
              }
            ].map((category, index) => (
              <div key={category.title} className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6`}>
                  <i className={`${category.icon} text-white text-2xl`}></i>
                </div>
                
                <h3 className="text-2xl font-bold text-cyan-300 mb-4">{category.title}</h3>
                <p className="text-cyan-100 mb-6 leading-relaxed">{category.description}</p>
                
                <div className="space-y-2">
                  {category.technologies.map((tech) => (
                    <div key={tech} className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                      <span className="text-cyan-100">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Neural Processing Metrics */}
          <div className="mt-16">
            <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
              <h3 className="text-2xl font-bold text-cyan-300 mb-8 text-center flex items-center justify-center">
                <i className="fas fa-chart-line text-cyan-400 mr-4"></i>
                Neural Processing Metrics
              </h3>
              
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { label: "Code Quality", value: 97, unit: "%" },
                  { label: "Problem Solving", value: 94, unit: "%" },
                  { label: "Innovation Index", value: 91, unit: "%" },
                  { label: "Learning Rate", value: 99, unit: "%" }
                ].map((metric, index) => (
                  <div key={metric.label} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-900/50" />
                        <circle 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          fill="none" 
                          strokeLinecap="round"
                          className="text-cyan-400"
                          style={{
                            strokeDasharray: `${2 * Math.PI * 10}`,
                            strokeDashoffset: isVisible ? `${2 * Math.PI * 10 * (1 - metric.value / 100)}` : `${2 * Math.PI * 10}`,
                            transition: `stroke-dashoffset 1s ease-out ${index * 0.2}s`
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-cyan-300">{metric.value}{metric.unit}</span>
                      </div>
                    </div>
                    <p className="text-cyan-100 font-medium">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}