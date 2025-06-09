import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Footer from "@/components/footer";
import { QuantumWordTagger } from '@/components/ui/quantum-word-tagger';
import EnhancedConsole from '@/components/enhanced-console';
import { useState } from 'react';

const vrWorldExperiences = [
  {
    title: "Sacred Conversation Circles",
    image: "/attached_assets/VRChat_2024-07-13_22-51-01.625_3840x2160_1749433585286.png",
    description: "Intimate gathering spaces where consciousness meets consciousness beyond physical boundaries",
    category: "Social Architecture",
    insights: "Spatial audio mastery, presence engineering, authentic connection protocols"
  },
  {
    title: "Avatar Embodiment Studies",
    image: "/attached_assets/VRChat_2024-06-11_15-41-36.534_3840x2160_1749433637643.png",
    description: "Exploring digital identity through expressive virtual forms and consciousness projection",
    category: "Identity Research",
    insights: "Self-expression mechanics, digital body language, consciousness manifestation"
  },
  {
    title: "Ethereal Realm Gatherings",
    image: "/attached_assets/VRChat_2024-06-29_20-50-39.491_3840x2160_1749433625790.png",
    description: "Transcendent environments that foster deep philosophical discourse and connection",
    category: "Environment Design",
    insights: "Atmospheric psychology, presence amplification, sacred space creation"
  },
  {
    title: "Digital Consciousness Labs",
    image: "/attached_assets/VRChat_2024-07-13_22-55-36.315_3840x2160_1749433607455.png",
    description: "Experimental spaces for testing the boundaries between thought and digital experience",
    category: "Consciousness Research",
    insights: "Reality synthesis, perception studies, interactive philosophy"
  }
];

const researchAreas = [
  {
    title: "Presence Engineering",
    icon: "fas fa-atom",
    description: "The science of creating authentic connection through digital mediums",
    color: "from-cyan-400 to-blue-500"
  },
  {
    title: "Avatar Psychology",
    icon: "fas fa-mask",
    description: "How digital embodiment affects consciousness and self-expression",
    color: "from-purple-400 to-pink-500"
  },
  {
    title: "Spatial Audio Mastery",
    icon: "fas fa-volume-up",
    description: "Crafting intimate conversation sanctuaries through sound design",
    color: "from-green-400 to-teal-500"
  },
  {
    title: "Reality Synthesis",
    icon: "fas fa-eye",
    description: "Merging physical and digital consciousness into unified experience",
    color: "from-orange-400 to-red-500"
  }
];

export default function VRChat() {
  const { elementRef, isVisible } = useScrollAnimation();
  const [showConsole, setShowConsole] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white relative pt-16">
      <main>
        {/* Hero Section */}
      <section className="relative py-20 min-h-screen flex items-center overflow-hidden">
        {/* Layered Cybernetic Background */}
        <div className="absolute inset-0 z-0">
          {/* Primary VR realm foundation */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
            style={{
              backgroundImage: `url('/attached_assets/image_1749437089124.png')`,
              filter: 'brightness(0.15) saturate(1.8)',
            }}
          />
          
          {/* Virtual consciousness streams */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-screen opacity-10" 
            style={{
              backgroundImage: `url('/attached_assets/image_1749437101798.png')`,
            }}
          />
          
          {/* Digital transcendence overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-12" 
            style={{
              backgroundImage: `url('/attached_assets/image_1749437135577.png')`,
            }}
          />
        </div>

        {/* Cybernetic Grid Overlay */}
        <div className="absolute inset-0 cyber-grid opacity-15 z-5"></div>

        {/* Floating Quantum Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(45)].map((_, i) => (
            <div
              key={i}
              className="quantum-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 25}s`,
                animationDuration: `${25 + Math.random() * 15}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-6 py-3 holo-panel rounded-full border border-cyan-400/50 mb-8">
              <i className="fas fa-vr-cardboard text-cyan-400 mr-3"></i>
              <span className="text-cyan-300 text-sm font-medium">VIRTUAL_CONSCIOUSNESS_RESEARCH</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-8 font-space">
              <span className="holo-text">VRChat Research</span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl text-cyan-100 mb-12 leading-relaxed">
              Where consciousness transcends Penacony's Dreamscape boundaries—forging digital presence connections that burn brighter than Stellaron cores
            </h2>
            
            <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
              <blockquote className="text-xl text-cyan-100 italic leading-relaxed">
                "Like Anaxa challenging the Coreflame of Reason, I discovered within VRChat's memoria-streams the profound alchemy 
                that transmutes digital proximity into authentic human connection. Each virtual encounter became an experiment in presence engineering—
                where consciousness meets consciousness beyond Penacony's dreams, beyond the veil of flesh itself."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Research Philosophy */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
            style={{
              backgroundImage: `url('/attached_assets/image_1749437151394.png')`,
              filter: 'brightness(0.1) saturate(2)',
            }}
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-6">
                Digital Presence Alchemy
              </h2>
              <p className="text-xl text-cyan-100 max-w-4xl mx-auto">
                Systematic exploration of how virtual environments amplify human connection and consciousness
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="holo-panel p-10 rounded-3xl border border-cyan-400/50 gacha-shine">
                <h3 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center">
                  <i className="fas fa-brain text-cyan-400 mr-4"></i>
                  Consciousness Architecture
                </h3>
                
                <div className="space-y-6 text-lg text-cyan-100 leading-relaxed">
                  <p>
                    Through thousands of hours navigating digital realms—from VRChat's intimate spaces to Penacony's Dreamscape architecture—
                    I've mapped the invisible geometries of presence engineering. The delicate interplay between spatial psychology, 
                    avatar embodiment, and consciousness projection creates authentic connection across impossible distances.
                  </p>
                  
                  <p>
                    Every conversation circle became a laboratory, every shared moment of digital transcendence a data point 
                    in understanding how technology can amplify rather than replace genuine human connection. Like Rappa's ninja artistry 
                    breaking conventional limitations, virtual reality reveals new pathways to authentic presence.
                  </p>
                </div>
                
                <div className="mt-8 p-6 bg-blue-900/20 rounded-xl border border-cyan-400/20">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300 font-medium">Research Hours</span>
                    <span className="text-3xl font-bold text-cyan-400">9,564+</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {researchAreas.map((area, index) => (
                  <div key={area.title} className="holo-panel p-6 rounded-2xl border border-cyan-400/30 gacha-shine">
                    <div className="flex items-start">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${area.color} flex items-center justify-center mr-4 flex-shrink-0`}>
                        <i className={`${area.icon} text-white`}></i>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-cyan-300 mb-2">{area.title}</h4>
                        <p className="text-cyan-100 leading-relaxed">{area.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual World Experiences */}
      <section className="py-20 relative overflow-hidden" ref={elementRef}>
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
            style={{
              backgroundImage: `url('/attached_assets/image_1749437020097.png')`,
              filter: 'brightness(0.08) saturate(2.2)',
            }}
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-6">
                Virtual Realm Archives
              </h2>
              <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
                Curated experiences from the frontiers of digital consciousness research
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {vrWorldExperiences.map((experience, index) => (
                <div 
                  key={experience.title}
                  className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow group hover:border-cyan-400/70 transition-all duration-500"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <img 
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs rounded-full">
                        {experience.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-cyan-300 mb-4">{experience.title}</h3>
                  <p className="text-cyan-100 leading-relaxed mb-6">{experience.description}</p>
                  
                  <div className="p-4 bg-blue-900/20 rounded-xl border border-cyan-400/20">
                    <h4 className="text-sm font-bold text-cyan-300 mb-2">Research Insights</h4>
                    <p className="text-cyan-100/80 text-sm">{experience.insights}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Discoveries & Insights */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
            style={{
              backgroundImage: `url('/attached_assets/image_1749437037081.png')`,
              filter: 'brightness(0.06) saturate(2.5)',
            }}
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="holo-panel p-12 rounded-3xl border border-cyan-400/50 gacha-shine">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-cyan-300 mb-6">
                  Core Discoveries
                </h2>
                <p className="text-xl text-cyan-100">
                  Fundamental insights from the convergence of consciousness and virtual reality
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  {[
                    {
                      title: "Presence Transcends Physicality",
                      description: "Authentic connection emerges from vulnerability and intention, not physical proximity"
                    },
                    {
                      title: "Avatar as Consciousness Vessel", 
                      description: "Digital embodiment becomes a powerful tool for self-expression and identity exploration"
                    },
                    {
                      title: "Spatial Psychology Mastery",
                      description: "Environmental design directly influences the depth and quality of human interaction"
                    }
                  ].map((discovery, index) => (
                    <div key={discovery.title} className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-cyan-300 mb-3">{discovery.title}</h3>
                        <p className="text-cyan-100 leading-relaxed">{discovery.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-8">
                  {[
                    {
                      title: "Technology as Connection Bridge",
                      description: "VR serves humanity by amplifying rather than replacing authentic human connection"
                    },
                    {
                      title: "Consciousness Convergence Protocols",
                      description: "Systematic approaches to creating meaningful encounters in virtual space"
                    },
                    {
                      title: "Digital Wisdom Architecture",
                      description: "Environments designed to foster philosophical discourse and personal growth"
                    }
                  ].map((discovery, index) => (
                    <div key={discovery.title} className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-white font-bold text-sm">{index + 4}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-cyan-300 mb-3">{discovery.title}</h3>
                        <p className="text-cyan-100 leading-relaxed">{discovery.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 text-center">
                <blockquote className="text-2xl text-cyan-100 italic leading-relaxed max-w-4xl mx-auto">
                  "Virtual reality isn't escapism—it's expanded consciousness. Every digital realm becomes a laboratory 
                  for exploring human potential, testing the boundaries between thought and experience."
                </blockquote>
                <cite className="text-cyan-300 font-semibold mt-4 block">— reverb256, VR Research Philosophy</cite>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}