import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Troves & Coves",
    subtitle: "Mystical Crystal Jewelry E-commerce",
    description: "Production e-commerce platform for sacred crystal jewelry featuring AI-enhanced storefront, Stripe payment integration, and metaphysical product catalog. Built as a full-stack application with modern web technologies serving crystal jewelry enthusiasts.",
    image: "/attached_assets/screenshot-1749440648583.png",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe API", "TypeScript"],
    status: "Production",
    link: "https://trovesandcoves.ca",
    github: "https://github.com/reverb256/troves-coves",
    color: "from-purple-400 to-pink-500"
  },
  {
    title: "Local Cleaning Service",
    subtitle: "AI-Enhanced Service Platform",
    description: "Professional cleaning services platform with contract management, automated quoting system, and client portal. Features comprehensive accessibility compliance and responsive design for streamlined service booking and client management.",
    image: "/attached_assets/screenshot-1749440511823.png",
    technologies: ["React", "Express", "PostgreSQL", "AI Integration", "Docker"],
    status: "Production",
    link: "https://2034c3d1-09aa-49c2-bad4-380f7b9d56ee-00-2eybkgfvy9084.riker.replit.dev",
    github: "https://github.com/reverb256/Local-Cleaning-Service",
    color: "from-cyan-400 to-blue-500"
  },
  {
    title: "CaddyPad Web UI",
    subtitle: "Server Administration Interface",
    description: "Fully-featured web interface for Caddy web server administration, providing intuitive configuration management and real-time monitoring capabilities. Simplifies Caddy server management through an elegant and accessible interface.",
    image: "/attached_assets/screenshot-1749440916527.png",
    technologies: ["Web UI", "Caddy", "JavaScript", "Apache License"],
    status: "Development",
    link: "#",
    github: "https://github.com/reverb256/CaddyPad",
    color: "from-green-400 to-teal-500"
  }
];

export default function ProjectsSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="projects" className="py-20 relative min-h-screen overflow-hidden" ref={elementRef}>
      {/* Layered Cybernetic Background */}
      <div className="absolute inset-0 z-0">
        {/* Primary cosmic data streams */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437274417.png')`,
            filter: 'brightness(0.25) saturate(1.3)',
          }}
        />
        
        {/* Digital architecture overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-screen opacity-20" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437295296.png')`,
          }}
        />
        
        {/* Holographic circuit accent */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-15" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437315258.png')`,
          }}
        />
      </div>

      {/* Cybernetic Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-25 z-5"></div>

      {/* Floating Quantum Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="quantum-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-6 py-3 holo-panel rounded-full border border-cyan-400/50 mb-8">
              <i className="fas fa-rocket text-cyan-400 mr-3"></i>
              <span className="text-cyan-300 text-sm font-medium">DIGITAL_ARCHITECTURES</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space">
              <span className="holo-text">Projects</span>
            </h2>
            
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              Convergent digital experiences where philosophical depth meets technological innovation
            </p>
          </div>

          {/* Featured Projects Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {projects.map((project, index) => (
              <div 
                key={project.title} 
                className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow group hover:border-cyan-400/70 transition-all duration-500"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Project Image */}
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${project.color} text-white`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-300 mb-2">{project.title}</h3>
                    <p className="text-cyan-100/80">{project.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${project.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <i className="fas fa-code text-white"></i>
                  </div>
                </div>

                {/* Description */}
                <p className="text-cyan-100 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Technology Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1 bg-blue-900/30 border border-cyan-400/30 text-cyan-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    className={`flex-1 bg-gradient-to-r ${project.color} hover:opacity-90 text-white border-0`}
                    onClick={() => window.open(project.link, '_blank')}
                    disabled={project.link === '#'}
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    {project.link === '#' ? 'In Development' : 'View Live'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
                    onClick={() => window.open(project.github, '_blank')}
                  >
                    <i className="fab fa-github mr-2"></i>
                    Code
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Project Categories */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "E-commerce Platforms",
                icon: "fas fa-shopping-cart",
                description: "Production-ready retail platforms with payment integration and AI-enhanced customer experiences",
                count: 1,
                color: "from-purple-400 to-pink-500"
              },
              {
                title: "Service Platforms",
                icon: "fas fa-cogs",
                description: "Professional service management systems with automated workflows and client portals",
                count: 1,
                color: "from-cyan-400 to-blue-500"
              },
              {
                title: "DevOps Tools",
                icon: "fas fa-server",
                description: "Server administration interfaces and development tools for enhanced productivity",
                count: 1,
                color: "from-green-400 to-teal-500"
              }
            ].map((category, index) => (
              <div key={category.title} className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-6`}>
                  <i className={`${category.icon} text-white text-2xl`}></i>
                </div>
                
                <h3 className="text-2xl font-bold text-cyan-300 mb-4">{category.title}</h3>
                <p className="text-cyan-100 mb-6 leading-relaxed">{category.description}</p>
                
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-cyan-400 mr-2">{category.count}</span>
                  <span className="text-cyan-100">Active Projects</span>
                </div>
              </div>
            ))}
          </div>

          {/* Development Philosophy */}
          <div className="holo-panel p-10 rounded-3xl border border-cyan-400/50 gacha-shine">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-cyan-300 mb-4 flex items-center justify-center">
                <i className="fas fa-lightbulb text-cyan-400 mr-4"></i>
                Development Philosophy
              </h3>
              <p className="text-xl text-cyan-100 max-w-4xl mx-auto leading-relaxed">
                Every project is an exploration of convergent possibilities—where ancient wisdom meets cutting-edge technology, 
                where spiritual consciousness guides technical innovation, and where each line of code becomes an expression 
                of humanity's infinite potential through digital transformation.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mt-10">
              {[
                { icon: "fas fa-yin-yang", label: "Balance", description: "Harmony between form and function" },
                { icon: "fas fa-infinity", label: "Infinite", description: "Unlimited potential in every creation" },
                { icon: "fas fa-atom", label: "Quantum", description: "Superposition of possibilities" },
                { icon: "fas fa-eye", label: "Vision", description: "Future-focused perspectives" }
              ].map((principle, index) => (
                <div key={principle.label} className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <i className={`${principle.icon} text-white text-xl`}></i>
                  </div>
                  <h4 className="text-lg font-bold text-cyan-300 mb-2">{principle.label}</h4>
                  <p className="text-cyan-100 text-sm">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}