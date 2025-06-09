export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const navigationLinks = [
    { href: "#about", label: "About", icon: "fas fa-user-astronaut" },
    { href: "#projects", label: "Projects", icon: "fas fa-rocket" },
    { href: "#skills", label: "Skills", icon: "fas fa-microchip" },
    { href: "#gaming", label: "Gaming", icon: "fas fa-gamepad" },
    { href: "#philosophy", label: "Philosophy", icon: "fas fa-infinity" },
    { href: "#contact", label: "Connect", icon: "fas fa-satellite-dish" }
  ];

  const socialLinks = [
    { href: "https://github.com/reverb256", icon: "fab fa-github", label: "GitHub", color: "from-cyan-400 to-blue-500" },
    { href: "mailto:contact@reverb256.ca", icon: "fas fa-envelope", label: "Email", color: "from-purple-400 to-pink-500" },
    { href: "#discord", icon: "fab fa-discord", label: "Discord", color: "from-green-400 to-teal-500" }
  ];

  const quickLinks = [
    { href: "/values", label: "Canadian Values", icon: "fas fa-maple-leaf" },
    { href: "/vrchat", label: "VRChat Worlds", icon: "fas fa-vr-cardboard" },
    { href: "#docs", label: "VibeCoding Docs", icon: "fas fa-book" },
    { href: "#ai-philosophy", label: "AI Philosophy", icon: "fas fa-brain" }
  ];

  return (
    <footer className="relative overflow-hidden border-t border-cyan-400/20">
      {/* Layered Cybernetic Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary footer foundation */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437156152.png')`,
            filter: 'brightness(0.1) saturate(1.8)',
          }}
        />
        
        {/* Digital foundation streams */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-screen opacity-8" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437172806.png')`,
          }}
        />
        
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-blue-950/50 to-transparent"></div>
      </div>

      {/* Cybernetic Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-10 z-5"></div>

      {/* Floating Quantum Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="quantum-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 15}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 py-16 relative z-20">
        
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine h-full">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mr-4">
                  <i className="fas fa-code text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-300 mb-1">reverb256</h3>
                  <p className="text-cyan-100/80 text-sm">Digital Architect & Philosopher</p>
                </div>
              </div>
              
              <p className="text-lg text-cyan-100 leading-relaxed mb-6">
                Canadian architect of convergent technologies, orchestrating the cross-empowerment of classical wisdom 
                and revolutionary AI systems through luminous digital experiences that honor both innovation and human dignity.
              </p>
              
              <div className="flex items-center space-x-2 text-cyan-100/80">
                <i className="fas fa-map-marker-alt text-cyan-400"></i>
                <span>Canada</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span>Available for Collaboration</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
            <h4 className="text-xl font-bold text-cyan-300 mb-6 flex items-center">
              <i className="fas fa-sitemap text-cyan-400 mr-3"></i>
              Navigation
            </h4>
            <ul className="space-y-4">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="flex items-center text-cyan-100 hover:text-cyan-300 transition-all duration-300 group"
                  >
                    <i className={`${link.icon} mr-3 text-cyan-400 group-hover:scale-110 transition-transform duration-300`}></i>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
            <h4 className="text-xl font-bold text-cyan-300 mb-6 flex items-center">
              <i className="fas fa-bolt text-cyan-400 mr-3"></i>
              Quick Access
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="flex items-center text-cyan-100 hover:text-cyan-300 transition-all duration-300 group"
                  >
                    <i className={`${link.icon} mr-3 text-cyan-400 group-hover:scale-110 transition-transform duration-300`}></i>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine mb-12">
          <h4 className="text-2xl font-bold text-cyan-300 mb-8 text-center flex items-center justify-center">
            <i className="fas fa-network-wired text-cyan-400 mr-4"></i>
            Digital Presence
          </h4>
          
          <div className="grid md:grid-cols-3 gap-8">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group block"
              >
                <div className="holo-panel p-6 rounded-2xl border border-cyan-400/30 gacha-shine text-center hover:border-cyan-400/60 transition-all duration-500">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${social.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${social.icon} text-white text-2xl`}></i>
                  </div>
                  <h5 className="text-lg font-bold text-cyan-300 mb-2">{social.label}</h5>
                  <p className="text-cyan-100/80 text-sm">Connect & Collaborate</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Philosophy Quote */}
        <div className="holo-panel p-10 rounded-3xl border border-cyan-400/50 gacha-shine mb-12">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-quote-left text-white text-2xl"></i>
            </div>
            <blockquote className="text-2xl text-cyan-100 italic leading-relaxed max-w-4xl mx-auto mb-6">
              "Technology must bow before humanity's greatness, never the reverse. Every line of code becomes 
              an expression of infinite potential, where classical wisdom guides revolutionary innovation."
            </blockquote>
            <cite className="text-cyan-300 font-semibold">— reverb256, VibeCoding Philosophy</cite>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cyan-400/20 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <div className="text-cyan-100/80 text-center lg:text-left">
              <p className="mb-2">
                © {currentYear} reverb256. All rights reserved.
              </p>
              <p className="text-sm">
                Built with React, TypeScript, and infinite curiosity.
              </p>
            </div>

            {/* Tech Stack */}
            <div className="flex items-center space-x-6 text-cyan-100/80">
              <div className="flex items-center">
                <i className="fab fa-react text-cyan-400 mr-2"></i>
                <span className="text-sm">React</span>
              </div>
              <div className="flex items-center">
                <i className="fab fa-js-square text-cyan-400 mr-2"></i>
                <span className="text-sm">TypeScript</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-palette text-cyan-400 mr-2"></i>
                <span className="text-sm">Tailwind CSS</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-brain text-cyan-400 mr-2"></i>
                <span className="text-sm">AI Enhanced</span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">System Online</span>
              </div>
              <div className="w-px h-6 bg-cyan-400/30"></div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-cyan-400 text-sm font-medium">Neural Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}