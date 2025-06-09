import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const skills = [
  { icon: "fab fa-react", name: "React", category: "Enterprise UI", color: "from-[var(--synthwave-cyan)] to-[var(--bright-blue)]" },
  { icon: "fab fa-js-square", name: "TypeScript", category: "Type Safety", color: "from-[var(--bright-blue)] to-[var(--primary-blue)]" },
  { icon: "fab fa-node-js", name: "Node.js", category: "Backend API", color: "from-[var(--primary-blue)] to-[var(--synthwave-pink)]" },
  { icon: "fas fa-database", name: "PostgreSQL", category: "Data Layer", color: "from-[var(--synthwave-pink)] to-[var(--synthwave-gold)]" },
  { icon: "fas fa-robot", name: "AI/ML", category: "Neural Networks", color: "from-[var(--synthwave-gold)] to-[var(--synthwave-cyan)]" },
  { icon: "fab fa-python", name: "Python", category: "AI Training", color: "from-[var(--synthwave-cyan)] to-[var(--bright-blue)]" },
  { icon: "fab fa-docker", name: "Docker", category: "Containerization", color: "from-[var(--bright-blue)] to-[var(--primary-blue)]" },
  { icon: "fas fa-server", name: "Proxmox", category: "Cluster Ops", color: "from-[var(--primary-blue)] to-[var(--synthwave-pink)]" },
  { icon: "fab fa-bitcoin", name: "Blockchain", category: "Crypto Mining", color: "from-[var(--synthwave-pink)] to-[var(--synthwave-gold)]" },
  { icon: "fas fa-shield-alt", name: "OWASP", category: "Security", color: "from-[var(--synthwave-gold)] to-[var(--synthwave-cyan)]" },
  { icon: "fas fa-vr-cardboard", name: "VR Dev", category: "Quest Pro", color: "from-[var(--synthwave-cyan)] to-[var(--bright-blue)]" },
  { icon: "fas fa-gamepad", name: "Game Dev", category: "Unity/UE", color: "from-[var(--bright-blue)] to-[var(--primary-blue)]" }
];

export default function SkillsSection() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section id="skills" className="py-20 relative" ref={elementRef}>
      {/* Electric synthwave lightning background */}
      <div className="absolute inset-0 opacity-15">
        <img 
          src="/images/synthwave_lightning.png" 
          alt="Electric energy patterns" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--space-black)]/70 via-transparent to-[var(--space-black)]/70"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl text-center mb-12 text-[var(--synthwave-cyan)] fade-in-up ${isVisible ? 'animate' : ''}`}>
          <i className="fas fa-microchip mr-4"></i>Tech Arsenal
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {skills.map((skill, index) => (
            <div 
              key={skill.name}
              className={`glass-morphism p-4 md:p-6 rounded-xl cyber-border hover:shadow-lg hover:shadow-[var(--synthwave-cyan)]/30 transition-all duration-300 text-center fade-in-up ${isVisible ? 'animate' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`hexagon w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${skill.color} mx-auto mb-3 md:mb-4 flex items-center justify-center hover:animate-rotate-slow`}>
                <i className={`${skill.icon} text-[var(--space-black)] text-lg md:text-2xl`}></i>
              </div>
              <h3 className="font-semibold text-sm md:text-lg text-[var(--bright-blue)]">{skill.name}</h3>
              <p className="text-gray-400 text-xs md:text-sm">{skill.category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
