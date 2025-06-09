import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Button } from "@/components/ui/button";
import { MetaRecursiveProject } from "./meta-recursive-project";
import trovesCovestImage from "@assets/image_1749452464369.png";
import cleaningServiceImage from "@assets/image_1749452436437.png";
import portfolioImage from "@assets/image_1749452548538.png";

const projects = [
  {
    title: "Troves & Coves",
    subtitle: "Sacred Sanctuary Crystal Jewelry",
    description: "Production-ready e-commerce platform featuring authentic wooden sign branding, mystical three-color harmony (turquoise/cursive-blue/skull-turquoise), and AI-orchestrated customer service. Enterprise security with OWASP Top 10 compliance, Cloudflare edge optimization, and seamless Etsy integration.",
    image: trovesCovestImage,
    technologies: [
      { name: "React 18", class: "react-tooltip" },
      { name: "Multi-LLM AI", class: "ai-tooltip" },
      { name: "Cloudflare KV", class: "cloudflare-tooltip" },
      { name: "ISO 27001", class: "security-tooltip" },
      { name: "Edge Computing", class: "edge-tooltip" }
    ],
    status: "Production",
    link: "https://trovesandcoves.ca",
    github: "https://github.com/reverb256/troves-coves",
    color: "from-[var(--spectrum-violet)] to-[var(--spectrum-pink)]",
    vibecoding: "Authentic brand discovery with mystical aesthetic preservation"
  },
  {
    title: "Workplace Janitorial Services",
    subtitle: "VibeCoding Innovation Showcase",
    description: "Revolutionary 6-container harmonized design framework with glassmorphism architecture. Memory-efficient backend (380MB peak), 60fps animations, complete OWASP security compliance, and accessibility excellence. Demonstrates advanced performance optimization under resource constraints.",
    image: cleaningServiceImage,
    technologies: [
      { name: "Glassmorphism", class: "glassmorphism-tooltip" },
      { name: "Performance Engineering", class: "performance-tooltip" },
      { name: "WCAG AAA", class: "accessibility-tooltip" },
      { name: "Security Framework", class: "security-tooltip" },
      { name: "Turquoise/Green Branding", class: "branding-tooltip" }
    ],
    status: "Production",
    link: "https://2034c3d1-09aa-49c2-bad4-380f7b9d56ee-00-2eybkgfvy9084.riker.replit.dev",
    github: "https://github.com/reverb256/Local-Cleaning-Service",
    color: "from-[var(--spectrum-cyan)] to-[var(--spectrum-blue)]",
    vibecoding: "Authentic business requirements with accessibility-first development"
  },
  {
    title: "Neural Network Portfolio",
    subtitle: "Cyberpunk Meta-Recursive Design",
    description: "This very portfolio - a self-referential cyberpunk masterpiece featuring quantum particle systems, prismatic spectrum harmonization, and philosophical depth. Demonstrates meta-recursive design principles where the portfolio showcases itself through unified visual components.",
    image: portfolioImage,
    technologies: [
      { name: "React 18", class: "react-tooltip" },
      { name: "Cyberpunk Aesthetics", class: "cyberpunk-tooltip" },
      { name: "Quantum Animations", class: "quantum-tooltip" },
      { name: "Meta-Recursion", class: "meta-tooltip" },
      { name: "Spectrum Variables", class: "spectrum-tooltip" }
    ],
    status: "Active Development",
    link: "/",
    github: "https://github.com/reverb256/portfolio",
    color: "from-[var(--spectrum-green)] to-[var(--spectrum-teal)]",
    vibecoding: "Philosophical confluence meets modern technical expression"
  },
  {
    title: "Frostbite Gazette",
    subtitle: "Quantum-Enhanced Democratic Journalism",
    description: "Canada's sovereign accountability infrastructure powered by AI-first journalism and 5th Generation Warfare defense frameworks. Quantum RAG identity engine with bilingual Canadian core, classical learning integration, and Charter-compliant democratic transparency tools.",
    image: cleaningServiceImage,
    technologies: [
      { name: "Quantum RAG", class: "quantum-tooltip" },
      { name: "5GW Defense", class: "defense-tooltip" },
      { name: "Bilingual AI", class: "bilingual-tooltip" },
      { name: "Charter Compliance", class: "charter-tooltip" },
      { name: "Democratic Tools", class: "democratic-tooltip" }
    ],
    status: "Coming Soon",
    link: "https://github.com/reverb256/Frostbite-Gazette",
    github: "https://github.com/reverb256/Frostbite-Gazette",
    color: "from-blue-400 via-cyan-400 to-white",
    vibecoding: "Truth preservation through quantum-enhanced Canadian journalism",
    isComingSoon: true
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
            backgroundImage: `url('/attached_assets/Reverb_with_all_the_same_colours_but_expansive._its_an_ultra_lo_1e5ce51d-b4d2-4bf2-9130-aa08807662b9_1749430526095.png')`,
            filter: 'brightness(0.25) saturate(1.3)',
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
            
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
              Production-ready applications built with modern frameworks, thoughtful user experience design, and scalable architecture
            </p>
          </div>

          {/* Meta-Recursive Portfolio Analysis */}
          <div className="mb-16">
            <MetaRecursiveProject />
          </div>

          {/* Featured Projects Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {projects.map((project, index) => (
              <div 
                key={project.title} 
                className={`holo-panel p-8 rounded-3xl border gacha-shine energy-flow group transition-all duration-500 ${
                  project.isComingSoon 
                    ? 'border-cyan-300/60 bg-gradient-to-br from-blue-900/20 via-cyan-900/30 to-white/10 shadow-2xl shadow-cyan-400/30 frost-aura' 
                    : 'border-cyan-400/50 hover:border-cyan-400/70'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Project Image */}
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  {project.isComingSoon ? (
                    <div className="relative w-full h-48 bg-gradient-to-br from-blue-900/40 via-cyan-800/30 to-white/20 flex items-center justify-center">
                      {/* Frost/Ice Effect Background */}
                      <div className="absolute inset-0 frost-pattern opacity-30"></div>
                      {/* Mysterious Glowing Symbol */}
                      <div className="relative z-10 text-center">
                        <div className="w-24 h-24 mx-auto mb-4 frost-glow animate-pulse">
                          <i className="fas fa-snowflake text-6xl text-cyan-200"></i>
                        </div>
                        <div className="text-cyan-300 font-mono text-sm">
                          <span className="animate-pulse">█ █ █ CLASSIFIED █ █ █</span>
                        </div>
                      </div>
                      {/* Scanning Line Effect */}
                      <div className="absolute inset-0 scanning-line"></div>
                    </div>
                  ) : (
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Status Badge with Beat Sync */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${project.color} text-white ${
                      project.isComingSoon ? 'beat-sync frost-pulse' : ''
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Header with Hover Effects */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--spectrum-cyan)] mb-2 hover-glitch cursor-pointer">{project.title}</h3>
                    <p className="text-[var(--text-secondary)] hover-deprecated">{project.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${project.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 hover-404`}>
                    <i className="fas fa-code text-white"></i>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[var(--text-muted)] leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Technology Stack with Tech Humor */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => {
                    const techName = typeof tech === 'string' ? tech : tech.name;
                    const techClass = typeof tech === 'string' ? 'hover-deprecated' : tech.class;
                    
                    return (
                      <span 
                        key={techName} 
                        className={`px-3 py-1 bg-blue-900/30 border border-cyan-400/30 text-[var(--spectrum-cyan)] rounded-full text-sm transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-400/10 ${techClass}`}
                      >
                        {techName}
                      </span>
                    );
                  })}
                </div>

                {/* VibeCoding Methodology Insight */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-xl border border-purple-400/30">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-lightbulb text-yellow-400 mr-2"></i>
                    <span className="text-sm font-semibold text-purple-300">VibeCoding Insight</span>
                  </div>
                  <p className="text-sm text-purple-200 italic">
                    {project.vibecoding}
                  </p>
                </div>

                {/* Action Buttons with Tech Humor */}
                <div className="flex gap-4">
                  <Button 
                    className="tech-button flex-1 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--synthwave-pink)] hover:from-[var(--synthwave-pink)] hover:to-[var(--synthwave-gold)] text-white border-0 transition-all duration-300 git-commit-humor"
                    onClick={() => window.open(project.link, '_blank')}
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    <span className="hover-loading">Live Demo</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="tech-button flex-1 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 stackoverflow-reference"
                    onClick={() => window.open(project.github, '_blank')}
                  >
                    <i className="fab fa-github mr-2"></i>
                    <span className="hover-syntax-error">GitHub</span>
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
                Every project balances technical excellence with thoughtful design. I focus on creating scalable solutions 
                that solve real problems while maintaining clean, maintainable code. My development philosophy emphasizes 
                user-centered design, accessibility, and building applications that truly serve their intended purpose.
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