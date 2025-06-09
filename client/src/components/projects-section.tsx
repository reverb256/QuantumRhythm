import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Troves & Coves",
    subtitle: "Mystical Crystal E-commerce",
    description: "Sacred crystal sanctuary where mystical brand identity merges with cutting-edge e-commerce architecture. AI-enhanced platform channeling spiritual energy through sophisticated product catalogs.",
    image: "/attached_assets/image_1749437249135.png",
    technologies: ["React", "TypeScript", "E-commerce", "AI Integration", "Mystical UX"],
    status: "Production",
    link: "#",
    color: "from-purple-400 to-pink-500"
  },
  {
    title: "Frostbite Gazette",
    subtitle: "AI Journalism Platform",
    description: "Revolutionary Canadian civic engagement platform combining classical analysis engines with democratic discourse. Features political accountability systems and AI-driven journalism ethics.",
    image: "/attached_assets/image_1749437252454.png",
    technologies: ["Next.js", "AI Analysis", "Political Engine", "Ethics Framework", "Democratic UX"],
    status: "Active Development",
    link: "#",
    color: "from-cyan-400 to-blue-500"
  },
  {
    title: "VibeCoding Methodology",
    subtitle: "Development Philosophy",
    description: "Comprehensive development methodology merging philosophical depth with technical excellence. A complete framework for creating software that honors both functionality and spiritual consciousness.",
    image: "/attached_assets/image_1749437257761.png",
    technologies: ["Philosophy", "Methodology", "Best Practices", "Spiritual Tech", "Innovation"],
    status: "Framework",
    link: "#",
    color: "from-green-400 to-teal-500"
  },
  {
    title: "Neural Architecture Suite",
    subtitle: "AI Development Tools",
    description: "Advanced toolkit for building neural networks and AI systems with philosophical grounding. Combines cutting-edge machine learning with classical wisdom frameworks.",
    image: "/attached_assets/image_1749437265529.png",
    technologies: ["Python", "TensorFlow", "Neural Networks", "Philosophy AI", "Consciousness"],
    status: "Research",
    link: "#",
    color: "from-orange-400 to-red-500"
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
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    View Project
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
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
                description: "Sophisticated retail experiences with mystical brand integration and AI-powered personalization",
                count: 3,
                color: "from-purple-400 to-pink-500"
              },
              {
                title: "AI & Analytics",
                icon: "fas fa-brain",
                description: "Neural networks and machine learning systems with philosophical consciousness frameworks",
                count: 5,
                color: "from-cyan-400 to-blue-500"
              },
              {
                title: "Developer Tools",
                icon: "fas fa-tools",
                description: "Methodologies and frameworks merging technical excellence with spiritual wisdom",
                count: 4,
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