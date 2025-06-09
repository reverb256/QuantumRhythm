import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const gamingExperiences = [
  {
    title: "VRChat Social Evolution",
    category: "Consciousness Awakening Research",
    description: "Journey from GPU power surplus (post-Ethereum) to social anxiety healing - overcoming motion sickness in experimental flight worlds to discover genuine human connection in digital realms reminiscent of Penacony",
    hours: "4,320+",
    platform: "Quest 2→Quest 3",
    color: "from-purple-400 to-pink-500",
    icon: "fas fa-vr-cardboard",
    insights: "Social anxiety therapy, virtual world emotional healing, avatar-mediated authentic connection"
  },
  {
    title: "miHoYo Gacha Ecosystem Analysis",
    category: "Game Design Research",
    description: "Deep systems analysis of Genshin Impact elemental mechanics, Honkai Star Rail's narrative design, and Zenless Zone Zero's action RPG evolution - with special focus on musical consciousness integration",
    hours: "1,240+",
    platform: "PC/Mobile",
    color: "from-amber-400 to-orange-500",
    icon: "fas fa-music",
    insights: "Gacha economics, elemental synergy design, progression psychology, orchestral narrative flow"
  },
  {
    title: "Draenei Elemental Harmony",
    category: "Spiritual Systems Coordination",
    description: "5,670+ hours as Draenei Elemental Shaman 'Saifa' (evolved from 'Sypha') - mastering lightning/earth elements with resto/enhancement versatility reflecting multi-domain adaptability",
    hours: "5,670+",
    platform: "PC/Add-ons",
    color: "from-blue-400 to-purple-500",
    icon: "fas fa-bolt",
    insights: "Elemental force coordination, multi-spec adaptability, spiritual-technical balance"
  },
  {
    title: "Sakura Rushdown Philosophy",
    category: "Technical Creative Expression",
    description: "Sakura main across Street Fighter series, Capcom vs SNK, Soul Calibur - orthodox shoto foundation with creative moveset expression demonstrating technical precision with innovative freedom",
    hours: "2,890+",
    platform: "Arcade/Console",
    color: "from-red-400 to-pink-500",
    icon: "fas fa-fist-raised",
    insights: "Orthodox foundation with creative variation, cross-system adaptability, technical precision"
  },
  {
    title: "Rhythm Game Precision Training",
    category: "Input Timing Research",
    description: "IIDX double play mastery, DDR freestyle, Beat Saber modding - exploring human-machine synchronization",
    hours: "3,560+",
    platform: "Arcade/VR/PC",
    color: "from-cyan-400 to-blue-500",
    icon: "fas fa-music",
    insights: "Timing windows, muscle memory formation, flow state triggers"
  },
  {
    title: "FFXIV Raid Coordination",
    category: "Complex Systems Management",
    description: "Savage raid optimization and job rotation theory-crafting across multiple combat roles and expansions",
    hours: "2,180+",
    platform: "PC/PS5",
    color: "from-indigo-400 to-purple-500",
    icon: "fas fa-sword",
    insights: "Rotation optimization, raid coordination, damage calculation theory"
  },
  {
    title: "Retro Gaming Archaeology",
    category: "Historical Systems Research",
    description: "DOS/Windows 3.1 era preservation, console emulation, CPS2/Triforce arcade analysis, modchip firmware research",
    hours: "8,900+",
    platform: "DOS/Emulation/Hardware",
    color: "from-green-400 to-teal-500",
    icon: "fas fa-microchip",
    insights: "Hardware limitations as design constraints, preservation methodology"
  },
  {
    title: "Proxmox Cluster Orchestration",
    category: "Enterprise Infrastructure",
    description: "Multi-node Proxmox cluster with Ansible automation and Terraform IaC - Ryzen 9 5950X/3900X, i5-9500, R7 1700 nodes",
    hours: "12,000+",
    platform: "Proxmox/Ansible/Terraform",
    color: "from-orange-400 to-red-500",
    icon: "fas fa-server",
    insights: "Infrastructure as Code, cluster orchestration, AI-assisted automation through VibeCoding"
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
                className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow group hover:border-cyan-400/70 transition-all duration-500 gpu-accelerated smooth-60fps"
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
                <p className="text-cyan-100 leading-relaxed mb-4">{experience.description}</p>

                {experience.insights && (
                  <div className="mb-6 p-3 bg-cyan-900/20 border border-cyan-400/30 rounded-lg">
                    <p className="text-xs text-cyan-300 font-mono mb-1">// Key Insights</p>
                    <p className="text-cyan-100/90 text-sm">{experience.insights}</p>
                  </div>
                )}

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

          {/* VR Social Spaces Research */}
          <div className="holo-panel p-10 rounded-3xl border border-cyan-400/50 gacha-shine mb-16">
            <h3 className="text-3xl font-bold text-cyan-300 mb-8 text-center flex items-center justify-center">
              <i className="fas fa-users text-cyan-400 mr-4"></i>
              VR Social Architecture Research
            </h3>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {[
                {
                  space: "Canadian Duck Park",
                  evolution: "Extreme shyness → gentle furry community introduction",
                  insight: "Safe spaces for social anxiety healing",
                  color: "from-green-400 to-emerald-500"
                },
                {
                  space: "The Pug",
                  evolution: "Listening in → joining random conversations",
                  insight: "Organic social integration through observation",
                  color: "from-blue-400 to-cyan-500"
                },
                {
                  space: "Black Cat (chaos zone)",
                  evolution: "Avoidance → occasional chaos tolerance",
                  insight: "Controlled exposure to social complexity",
                  color: "from-red-400 to-orange-500"
                }
              ].map((space, index) => (
                <div key={space.space} className={`p-6 rounded-2xl bg-gradient-to-br ${space.color} text-white`}>
                  <h4 className="text-xl font-bold mb-3">{space.space}</h4>
                  <p className="text-sm opacity-90 mb-3">{space.evolution}</p>
                  <p className="text-xs italic">{space.insight}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <blockquote className="text-xl text-cyan-100 italic leading-relaxed max-w-4xl mx-auto">
                "VRChat became my virtual Penacony - a dream world where I reawakened my love for humanity 
                through genuine connections with beautiful people who helped heal decades of social isolation."
              </blockquote>
            </div>
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

          {/* Anime Consciousness Foundation */}
              <div className="holo-panel p-8 rounded-3xl border border-[var(--spectrum-violet)]/30 gacha-shine mb-8">
                <h3 className="text-2xl font-bold text-[var(--spectrum-violet)] mb-6 flex items-center">
                  <i className="fas fa-magic text-[var(--spectrum-pink)] mr-4"></i>
                  Anime Consciousness Foundation
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[var(--spectrum-pink)]/20 to-[var(--spectrum-violet)]/20">
                      <div>
                        <h4 className="font-semibold text-[var(--spectrum-pink)]">Transformational Anime</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Sailor Moon, Dragon Ball, Madoka Magica</p>
                      </div>
                      <div className="text-[var(--spectrum-violet)]">
                        <i className="fas fa-heart text-2xl"></i>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[var(--spectrum-red)]/20 to-[var(--spectrum-orange)]/20">
                      <div>
                        <h4 className="font-semibold text-[var(--spectrum-red)]">Action Philosophy</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Akame ga Kill decisive execution</p>
                      </div>
                      <div className="text-[var(--spectrum-orange)]">
                        <i className="fas fa-sword text-2xl"></i>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[var(--spectrum-green)]/20 to-[var(--spectrum-teal)]/20">
                      <div>
                        <h4 className="font-semibold text-[var(--spectrum-green)]">Meta-Narrative</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Excel Saga, Slayers systematic magic</p>
                      </div>
                      <div className="text-[var(--spectrum-teal)]">
                        <i className="fas fa-infinity text-2xl"></i>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[var(--spectrum-blue)]/20 to-[var(--spectrum-cyan)]/20">
                      <div>
                        <h4 className="font-semibold text-[var(--spectrum-blue)]">VRChat Social Viewing</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Shared consciousness anime experiences</p>
                      </div>
                      <div className="text-[var(--spectrum-cyan)]">
                        <i className="fas fa-vr-cardboard text-2xl"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Star Trek Philosophy Integration */}
              <div className="holo-panel p-8 rounded-3xl border border-[var(--spectrum-blue)]/30 gacha-shine mb-8">
                <h3 className="text-2xl font-bold text-[var(--spectrum-blue)] mb-6 flex items-center">
                  <i className="fas fa-rocket text-[var(--spectrum-cyan)] mr-4"></i>
                  Star Trek Political Philosophy
                </h3>

                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--spectrum-blue)]/20 to-[var(--spectrum-cyan)]/20">
                    <h4 className="font-semibold text-[var(--spectrum-blue)] mb-2">Deep Space Nine Ensemble Politics</h4>
                    <p className="text-[var(--text-secondary)] mb-4">Complex stakeholder management and ethical decision-making under pressure</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-[var(--spectrum-blue)]/30 text-[var(--spectrum-blue)] text-sm">Multi-faction Coordination</span>
                      <span className="px-3 py-1 rounded-full bg-[var(--spectrum-cyan)]/30 text-[var(--spectrum-cyan)] text-sm">Political Intrigue</span>
                      <span className="px-3 py-1 rounded-full bg-[var(--spectrum-teal)]/30 text-[var(--spectrum-teal)] text-sm">Ethical Complexity</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--spectrum-orange)]/20 to-[var(--spectrum-red)]/20">
                    <h4 className="font-semibold text-[var(--spectrum-orange)] mb-2">Original Movies Emotional Engineering</h4>
                    <p className="text-[var(--text-secondary)] mb-4">Character relationship depth creating genuine emotional investment in outcomes</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-[var(--spectrum-orange)]/30 text-[var(--spectrum-orange)] text-sm">Character Development</span>
                      <span className="px-3 py-1 rounded-full bg-[var(--spectrum-red)]/30 text-[var(--spectrum-red)] text-sm">Emotional Investment</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Music Evolution Timeline */}
              <div className="holo-panel p-8 rounded-3xl border border-[var(--spectrum-cyan)]/30 gacha-shine">
                <h3 className="text-2xl font-bold text-[var(--spectrum-cyan)] mb-6 flex items-center">
                  <i className="fas fa-music text-[var(--spectrum-violet)] mr-4"></i>
                  Musical Consciousness Evolution
                </h3>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {[
                {
                  era: "Chiptune Foundation",
                  games: "NES Mario • Mega Man",
                  insight: "8-bit constraints breeding infinite creativity",
                  color: "from-green-400 to-emerald-500"
                },
                {
                  era: "Mystical SNES Era",
                  games: "Seiken Densetsu 3 • FF6",
                  insight: "Ethereal soundfonts expressing narrative depth",
                  color: "from-purple-400 to-violet-500"
                },
                {
                  era: "Modern miHoYo Mastery",
                  games: "Genshin • Star Rail • ZZZ",
                  insight: "Orchestral consciousness through interactive storytelling",
                  color: "from-amber-400 to-orange-500"
                }
              ].map((era, index) => (
                <div key={era.era} className={`p-6 rounded-2xl bg-gradient-to-br ${era.color} text-white`}>
                  <h4 className="text-xl font-bold mb-3">{era.era}</h4>
                  <p className="text-sm opacity-90 mb-3">{era.games}</p>
                  <p className="text-xs italic">{era.insight}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <blockquote className="text-xl text-cyan-100 italic leading-relaxed max-w-4xl mx-auto">
                "From NES chiptunes to miHoYo's orchestral masterpieces - every musical evolution reflects consciousness expanding 
                through interactive experience. Gaming soundtracks become the soundtrack to consciousness exploration."
              </blockquote>
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