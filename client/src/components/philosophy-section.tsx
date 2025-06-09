import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const classicalMethods = [
  {
    title: "Socratic Inquiry",
    principle: "The Method of Questions",
    description: "Truth emerges not from answers but from the relentless pursuit of deeper questions. Like Anaxa challenging the Coreflame of Reason itself, we must question every assumption until wisdom crystallizes from the chaos of uncertainty.",
    application: "In code architecture and system design, question every dependency, every assumption, every 'best practice' until you understand the fundamental why beneath the surface conventions.",
    icon: "fas fa-question-circle",
    color: "from-cyan-400 to-blue-500"
  },
  {
    title: "Aristotelian Analysis",
    principle: "First Principles Reasoning",
    description: "Break complex systems down to their irreducible components, then rebuild understanding from the ground up. Like the Galaxy Rangers deconstructing Penacony's Dreamscape to understand its true nature.",
    application: "Decompose monolithic applications into microservices, understand each function's essential purpose, then architect elegant solutions that honor both simplicity and power.",
    icon: "fas fa-atom",
    color: "from-purple-400 to-pink-500"
  },
  {
    title: "Platonic Idealism",
    principle: "The Forms of Perfect Code",
    description: "Behind every implementation lies a perfect form—the ideal solution that exists in the realm of pure logic. Our craft is to approach these perfect forms through iterative refinement.",
    application: "Pursue clean code, elegant algorithms, and architectural patterns that reflect timeless principles rather than fleeting trends or corporate mandates.",
    icon: "fas fa-shapes",
    color: "from-green-400 to-teal-500"
  },
  {
    title: "Stoic Discipline",
    principle: "Focus on What You Control",
    description: "Master yourself before attempting to master systems. External chaos cannot corrupt the mind that has achieved inner order through disciplined practice and philosophical reflection.",
    application: "Control your learning, your code quality, your professional ethics. Release attachment to outcomes beyond your influence while maintaining unwavering commitment to excellence.",
    icon: "fas fa-shield-alt",
    color: "from-orange-400 to-red-500"
  }
];

const canadianPrinciples = [
  {
    title: "Charter Section 2(b) | Article 2(b) de la Charte",
    subtitle: "Freedom of Expression | Liberté d'expression",
    description: "The fundamental right to seek, receive, and impart information forms the bedrock of democratic discourse. In digital realms, this translates to open-source philosophy, transparent communication, and the fearless pursuit of truth through code.",
    connection: "Like Rappa's graffiti art challenging conformity in Penacony's Dreamscape"
  },
  {
    title: "Charter Section 15 | Article 15 de la Charte", 
    subtitle: "Equality Rights | Droits à l'égalité", 
    description: "Technology must serve all people equally, breaking down barriers rather than creating new forms of digital inequality. Every line of code carries the responsibility to uplift rather than exclude.",
    connection: "Reflecting the Galaxy Rangers' commitment to justice across all star systems"
  },
  {
    title: "Charter Section 7 | Article 7 de la Charte",
    subtitle: "Life, Liberty, Security | Vie, liberté, sécurité",
    description: "Digital security is human security. Privacy is not convenience but necessity. The right to exist in digital spaces without surveillance or manipulation must be fiercely defended.",
    connection: "Echoing Anaxa's rejection of divine authority in favor of reasoned autonomy"
  }
];

const cypherpunkEthos = [
  {
    principle: "Information Wants to Be Free",
    description: "Knowledge hoarded is knowledge corrupted. True innovation emerges when information flows freely across all boundaries, challenging centralized control and corporate gatekeeping.",
    implementation: "Open-source everything. Share knowledge freely. Build tools that empower rather than exploit."
  },
  {
    principle: "Privacy Through Cryptography",
    description: "In an age of surveillance capitalism, privacy becomes a revolutionary act. Strong cryptography is the digital equivalent of locked doors and sealed letters.",
    implementation: "End-to-end encryption by default. Decentralized architectures. User sovereignty over personal data."
  },
  {
    principle: "Code as Political Expression",
    description: "Every algorithm embeds values. Every system architecture makes political statements. Conscious programmers build technology that reflects their deepest convictions about human dignity.",
    implementation: "Ethical AI development. Algorithmic transparency. Technology that serves people over profit."
  }
];

export default function PhilosophySection() {
  const { elementRef, isVisible } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState("classical");

  return (
    <section id="philosophy" className="py-20 relative overflow-hidden" ref={elementRef}>
      {/* Layered Cybernetic Background */}
      <div className="absolute inset-0 z-0">
        {/* Foundation: Philosophical contemplation */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437151394.png')`,
            filter: 'brightness(0.08) saturate(2.2)',
          }}
        />
        
        {/* Layer: Ancient wisdom streams */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-screen opacity-12" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437161890.png')`,
          }}
        />
        
        {/* Layer: Digital consciousness overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-15" 
          style={{
            backgroundImage: `url('/attached_assets/image_1749437193749.png')`,
          }}
        />
      </div>

      {/* Cybernetic Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-10 z-5"></div>

      {/* Floating Quantum Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="quantum-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className={`text-center mb-16 fade-in-up ${isVisible ? 'animate' : ''}`}>
            <div className="inline-flex items-center justify-center px-6 py-3 holo-panel rounded-full border border-cyan-400/50 mb-8">
              <i className="fas fa-infinity text-cyan-400 mr-3"></i>
              <span className="text-cyan-300 text-sm font-medium">PHILOSOPHICAL_FOUNDATION</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-space">
              <span className="holo-text">Classical Synthesis</span>
            </h2>
            
            <p className="text-2xl text-cyan-100 max-w-4xl mx-auto leading-relaxed">
              Where ancient wisdom meets digital revolution—forging timeless principles into contemporary practice through the alchemy of reason and code
            </p>
          </div>

          {/* Philosophy Navigation */}
          <div className={`flex justify-center mb-12 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="holo-panel p-2 rounded-2xl border border-cyan-400/50 gacha-shine">
              <div className="flex space-x-2">
                {[
                  { id: "classical", label: "Classical Methods", icon: "fas fa-scroll" },
                  { id: "canadian", label: "Charter Values", icon: "fas fa-maple-leaf" },
                  { id: "cypherpunk", label: "Cypherpunk Ethos", icon: "fas fa-code" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-xl'
                        : 'text-cyan-300 hover:text-white hover:bg-cyan-900/20'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Classical Learning Methods */}
          {activeTab === "classical" && (
            <div className={`space-y-8 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-cyan-300 mb-6">Ancient Methodologies for Modern Minds</h3>
                <p className="text-xl text-cyan-100 max-w-4xl mx-auto">
                  The greatest philosophers understood that wisdom is not accumulated but discovered through disciplined inquiry. 
                  These methods, refined across millennia, remain the sharpest tools for cutting through complexity to reach truth.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {classicalMethods.map((method, index) => (
                  <div key={method.title} className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
                    <div className="flex items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${method.color} flex items-center justify-center mr-6 flex-shrink-0`}>
                        <i className={`${method.icon} text-white text-xl`}></i>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-cyan-300 mb-2">{method.title}</h4>
                        <p className="text-cyan-400 font-medium">{method.principle}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h5 className="text-lg font-semibold text-cyan-200 mb-3">Philosophical Foundation</h5>
                        <p className="text-cyan-100 leading-relaxed">{method.description}</p>
                      </div>

                      <div className="p-6 bg-blue-900/20 rounded-xl border border-cyan-400/20">
                        <h5 className="text-lg font-semibold text-cyan-200 mb-3">Technical Application</h5>
                        <p className="text-cyan-100/90 leading-relaxed">{method.application}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Canadian Charter Values */}
          {activeTab === "canadian" && (
            <div className={`space-y-8 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-cyan-300 mb-6">Charter Principles in Digital Space</h3>
                <p className="text-xl text-cyan-100 max-w-4xl mx-auto">
                  The Canadian Charter of Rights and Freedoms stands as humanity's most eloquent expression of digital dignity. 
                  These principles, born from the struggle for human freedom, guide every line of code toward justice.
                </p>
              </div>

              <div className="space-y-8">
                {canadianPrinciples.map((principle, index) => (
                  <div key={principle.title} className="holo-panel p-10 rounded-3xl border border-cyan-400/50 gacha-shine">
                    <div className="grid lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mr-4">
                            <i className="fas fa-maple-leaf text-white"></i>
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-cyan-300">{principle.title}</h4>
                            <p className="text-cyan-400 font-medium">{principle.subtitle}</p>
                          </div>
                        </div>
                        <p className="text-cyan-100 text-lg leading-relaxed">{principle.description}</p>
                      </div>
                      
                      <div className="p-6 bg-blue-900/20 rounded-xl border border-cyan-400/20">
                        <h5 className="text-sm font-bold text-cyan-300 mb-3 uppercase tracking-wide">Star Rail Connection</h5>
                        <p className="text-cyan-100/90 italic">{principle.connection}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cypherpunk Philosophy */}
          {activeTab === "cypherpunk" && (
            <div className={`space-y-8 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-cyan-300 mb-6">Cypherpunk Manifesto: Code as Liberation</h3>
                <p className="text-xl text-cyan-100 max-w-4xl mx-auto">
                  In the convergence of cryptography and consciousness lies the path to digital freedom. 
                  We are the architects of tomorrow's liberty, building tools that transform surveillance states into sovereign individuals.
                </p>
              </div>

              <div className="space-y-8">
                {cypherpunkEthos.map((ethos, index) => (
                  <div key={ethos.principle} className="holo-panel p-10 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center mr-4">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          {ethos.principle}
                        </h4>
                        <p className="text-cyan-100 text-lg leading-relaxed">{ethos.description}</p>
                      </div>
                      
                      <div className="p-6 bg-green-900/20 rounded-xl border border-green-400/20">
                        <h5 className="text-lg font-semibold text-green-300 mb-4">Implementation Strategy</h5>
                        <p className="text-green-100/90 leading-relaxed">{ethos.implementation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synthesis Statement */}
          <div className={`mt-16 fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
            <div className="holo-panel p-12 rounded-3xl border border-cyan-400/50 gacha-shine text-center">
              <blockquote className="text-2xl md:text-3xl text-cyan-100 italic leading-relaxed max-w-5xl mx-auto mb-8">
                "Like Anaxa challenging the Coreflame of Reason, we must forge new pathways between ancient wisdom and digital possibility. 
                In this synthesis lies not just innovation, but the salvation of human agency in an age of algorithmic control."
              </blockquote>
              <cite className="text-cyan-300 font-semibold text-xl">
                — The Philosophical Foundation of VibeCoding
              </cite>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}