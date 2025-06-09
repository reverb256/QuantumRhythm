import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const contactMethods = [
  {
    platform: "GitHub",
    handle: "@reverb256",
    description: "Open source repositories and development portfolio",
    icon: "fab fa-github",
    color: "from-cyan-400 to-blue-500",
    href: "https://github.com/reverb256",
    label: "Code Repository"
  },
  {
    platform: "Email",
    handle: "contact@reverb256.ca",
    description: "Direct communication for collaboration opportunities",
    icon: "fas fa-envelope",
    color: "from-purple-400 to-pink-500",
    href: "mailto:contact@reverb256.ca",
    label: "Professional Inquiries"
  },
  {
    platform: "Discord",
    handle: "reverb256",
    description: "Real-time discussions about technology and philosophy",
    icon: "fab fa-discord",
    color: "from-green-400 to-teal-500",
    href: "#",
    label: "Community Chat"
  },
  {
    platform: "VRChat",
    handle: "reverb256",
    description: "Virtual reality experiences and immersive digital worlds",
    icon: "fas fa-vr-cardboard",
    color: "from-orange-400 to-red-500",
    href: "/vrchat",
    label: "Virtual Worlds"
  }
];

const collaborationAreas = [
  "Enterprise AI Integration",
  "VibeCoding Methodology",
  "Philosophical Technology",
  "Neural Architecture Design",
  "Consciousness Computing",
  "Digital Convergence Projects"
];

export default function ContactSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="contact" className="py-20 relative min-h-screen overflow-hidden" ref={elementRef}>
      {/* Layered Cybernetic Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary communication nexus */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437202750.png')`,
            filter: 'brightness(0.2) saturate(1.4)',
          }}
        />
        
        {/* Digital communication streams */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-screen opacity-15" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437206205.png')`,
          }}
        />
        
        {/* Neural connection patterns */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-20" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437219730.png')`,
          }}
        />
      </div>

      {/* Cybernetic Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20 z-5"></div>

      {/* Floating Quantum Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="quantum-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 18}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-6 py-3 holo-panel rounded-full border border-cyan-400/50 mb-8">
              <i className="fas fa-satellite-dish text-cyan-400 mr-3"></i>
              <span className="text-cyan-300 text-sm font-medium">NEURAL_NETWORK_ACCESS</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space">
              <span className="holo-text">Connect</span>
            </h2>
            
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              Ready to venture into convergent possibilities where classical wisdom meets revolutionary technology?
            </p>
          </div>

          {/* Connection Philosophy */}
          <div className="holo-panel p-12 rounded-3xl border border-cyan-400/50 gacha-shine mb-16">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-8">
                <i className="fas fa-network-wired text-white text-3xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-cyan-300 mb-6">Digital Convergence Awaits</h3>
              <p className="text-xl text-cyan-100 leading-relaxed max-w-4xl mx-auto">
                Together we shall architect digital experiences that honor both blazing innovation and eternal human dignity. 
                Every collaboration becomes an exploration of infinite potential, where technology serves to amplify human creativity 
                and forge deeper connections across the digital void.
              </p>
            </div>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <a
                key={method.platform}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow group hover:border-cyan-400/70 transition-all duration-500 block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${method.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                  <i className={`${method.icon} text-white text-2xl`}></i>
                </div>
                
                <h3 className="text-xl font-bold text-cyan-300 mb-2 text-center">{method.platform}</h3>
                <p className="text-cyan-100/80 text-sm mb-4 text-center">{method.label}</p>
                <p className="text-cyan-400 font-mono text-sm mb-4 text-center">{method.handle}</p>
                <p className="text-cyan-100 text-xs leading-relaxed text-center">{method.description}</p>
              </a>
            ))}
          </div>

          {/* Collaboration Areas */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            
            {/* Areas of Interest */}
            <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
              <h3 className="text-2xl font-bold text-cyan-300 mb-8 flex items-center">
                <i className="fas fa-lightbulb text-cyan-400 mr-4"></i>
                Collaboration Realms
              </h3>
              
              <div className="space-y-4">
                {collaborationAreas.map((area, index) => (
                  <div key={area} className="flex items-center group">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full mr-4 group-hover:scale-125 transition-transform duration-300"></div>
                    <span className="text-cyan-100 group-hover:text-cyan-300 transition-colors duration-300">{area}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-blue-900/20 rounded-xl border border-cyan-400/20">
                <p className="text-cyan-100 text-sm leading-relaxed">
                  <strong className="text-cyan-300">Open to:</strong> Enterprise partnerships, philosophical technology discussions, 
                  AI consciousness research, VR experience design, and any projects that explore the intersection of wisdom and innovation.
                </p>
              </div>
            </div>

            {/* Response Time & Availability */}
            <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
              <h3 className="text-2xl font-bold text-cyan-300 mb-8 flex items-center">
                <i className="fas fa-clock text-cyan-400 mr-4"></i>
                Neural Response Matrix
              </h3>
              
              <div className="space-y-6">
                {[
                  { channel: "Email", time: "< 24 hours", priority: "Enterprise & Collaboration", status: "Primary" },
                  { channel: "GitHub", time: "< 48 hours", priority: "Open Source & Code", status: "Active" },
                  { channel: "Discord", time: "Real-time", priority: "Community & Discussion", status: "Available" },
                  { channel: "LinkedIn", time: "< 72 hours", priority: "Professional Network", status: "Business" }
                ].map((response, index) => (
                  <div key={response.channel} className="flex items-center justify-between p-4 bg-blue-900/20 rounded-xl border border-cyan-400/20">
                    <div>
                      <h4 className="text-lg font-bold text-cyan-300">{response.channel}</h4>
                      <p className="text-cyan-100/80 text-sm">{response.priority}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-cyan-400 font-bold text-sm">{response.time}</span>
                      <p className="text-cyan-100/80 text-xs">{response.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="holo-panel p-10 rounded-3xl border border-cyan-400/50 gacha-shine text-center">
            <h3 className="text-3xl font-bold text-cyan-300 mb-6 flex items-center justify-center">
              <i className="fas fa-rocket text-cyan-400 mr-4"></i>
              Ready to Begin?
            </h3>
            
            <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Interested in the VibeCoding methodology, enterprise AI integration, or exploring the philosophical depths of technology? 
              Let's architect the future of human-centered digital experiences together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToProjects}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/50"
              >
                <i className="fas fa-code mr-2"></i>
                Explore My Work
              </button>
              
              <a
                href="mailto:contact@reverb256.ca"
                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-400/50"
              >
                <i className="fas fa-envelope mr-2"></i>
                Start Conversation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}