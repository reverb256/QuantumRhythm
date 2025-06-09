import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import GeometricBackground from "@/components/geometric-background";
import Footer from "@/components/footer";
import { QuantumWordTagger } from '@/components/ui/quantum-word-tagger';
import EnhancedConsole from '@/components/enhanced-console';
import { useState } from 'react';

export default function Values() {
  const { elementRef, isVisible } = useScrollAnimation();
  const [showConsole, setShowConsole] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white pt-16">{/* Add padding top for fixed nav */}
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/attached_assets/catboy2025BG_1749433079455.png" 
            alt="Cyberpunk space background" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* Quantum Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="quantum-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-6 py-3 prismatic-glass rounded-full border border-cyan-400/50 mb-8">
              <i className="fas fa-compass text-cyan-400 mr-3"></i>
              <span className="text-cyan-300 text-sm font-medium">CORE_VALUES</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space">
              <span className="holo-text">Core Values</span>
            </h1>
            
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              Principles that guide my development philosophy and approach to building meaningful technology
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 relative" ref={elementRef}>
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space text-center fade-in-up ${isVisible ? 'animate' : ''}`}>
            <span className="holo-text">Development Philosophy</span>
          </h2>
          
          <div className={`max-w-4xl mx-auto text-center mb-16 fade-in-up ${isVisible ? 'animate' : ''}`}>
            <div className="holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine">
              <div className="font-mono text-sm text-left bg-[var(--space-black)] p-6 rounded-lg border border-cyan-400/30 shadow-lg shadow-cyan-500/20 clickable-console">
                <span className="text-[var(--synthwave-pink)] hover-deprecated">const</span> <span className="text-[var(--synthwave-cyan)] hover-syntax-error">developmentValues</span> <span className="text-white">=</span> <span className="text-yellow-400 hover-404">&#123;</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)] hover-loading">userFirst</span><span className="text-white">:</span> <span className="text-green-400">"accessibility + intuitive_design + meaningful_solutions"</span><span className="text-white">,</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)] stackoverflow-reference">excellence</span><span className="text-white">:</span> <span className="text-green-400">"clean_code + best_practices + continuous_learning"</span><span className="text-white">,</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)] hover-segfault">ethics</span><span className="text-white">:</span> <span className="text-green-400">"privacy + transparency + responsible_ai"</span><span className="text-white">,</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)] git-commit-humor">impact</span><span className="text-white">:</span> <span className="text-green-400">"solve_real_problems + enhance_human_connection"</span><br />
                <span className="text-yellow-400 hover-404">&#125;;</span><br /><br />
                <span className="text-gray-400 easter-egg-hint">// Principles that guide every project, every decision, every line of code</span>
                <span className="console-cursor text-[var(--synthwave-cyan)]">_</span>
              </div>
              <p className="text-gray-300 mt-6 leading-relaxed">
                <strong className="text-[var(--light-beam)]">Core principles encoded into every project</strong>—
                these values ensure that technology serves humanity's best interests while maintaining technical excellence.
              </p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* User-Centered Design */}
            <div className={`holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--synthwave-gold)] to-[var(--bright-blue)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-users text-[var(--space-black)] text-xl"></i>
                </div>
                <h3 className="font-semibold text-xl text-[var(--synthwave-gold)]">User-Centered Design</h3>
                <p className="text-sm text-gray-400 mt-2">Human-First Development</p>
              </div>
              
              <p className="text-gray-300 mb-6 text-center leading-relaxed">
                Every interface should feel intuitive, every interaction meaningful. I prioritize accessibility, 
                usability, and genuine user needs over flashy features. Technology should enhance human capability, 
                not create barriers.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <i className="fas fa-universal-access text-[var(--synthwave-gold)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Accessibility built in from the start</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-mobile-alt text-[var(--synthwave-gold)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Responsive design across all devices</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-heart text-[var(--synthwave-gold)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Intuitive experiences that users love</span>
                </div>
              </div>
            </div>

            {/* Technical Excellence */}
            <div className={`holo-panel p-8 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--synthwave-pink)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-code text-[var(--space-black)] text-xl"></i>
                </div>
                <h3 className="font-semibold text-xl text-[var(--synthwave-cyan)]">Technical Excellence</h3>
                <p className="text-sm text-gray-400 mt-2">Quality & Performance</p>
              </div>
              
              <p className="text-gray-300 mb-6 text-center leading-relaxed">
                Clean, maintainable code isn't just a preference—it's a responsibility. I follow best practices, 
                write comprehensive tests, and build systems that scale. Every project is an opportunity to 
                demonstrate craftsmanship.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <i className="fas fa-shield-alt text-[var(--synthwave-cyan)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Security and privacy by design</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-rocket text-[var(--synthwave-cyan)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Performance optimization and scalability</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-[var(--synthwave-cyan)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Comprehensive testing and documentation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fun Interactive Demonstration */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className={`holo-panel p-8 rounded-3xl border border-pink-400/50 gacha-shine energy-flow fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.5s' }}>
              <h3 className="font-semibold text-2xl mb-6 text-pink-300 text-center">
                <i className="fas fa-heart mr-3"></i>Values in Action: Interactive Demo
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Humanity Demo */}
                <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 p-6 rounded-xl border border-pink-400/30">
                  <h4 className="text-pink-300 font-semibold mb-3 flex items-center">
                    <i className="fas fa-heart-broken mr-2"></i>Humanity First
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-black/50 p-3 rounded font-mono text-xs">
                      <span className="text-gray-400">// Real user feedback:</span><br/>
                      <span className="text-green-400">"This site actually made me smile during a rough day. Thank you for caring about accessibility."</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Every design choice prioritizes human dignity and connection over flashy tech demos.
                    </p>
                  </div>
                </div>

                {/* Free Speech Demo */}
                <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-cyan-400/30">
                  <h4 className="text-cyan-300 font-semibold mb-3 flex items-center">
                    <i className="fas fa-megaphone mr-2"></i>Free Speech Champion
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-black/50 p-3 rounded font-mono text-xs">
                      <span className="text-gray-400">// Platform responsibility:</span><br/>
                      <span className="text-yellow-400">transparency &gt; censorship</span><br/>
                      <span className="text-green-400">user_agency &gt; algorithmic_control</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Building systems that empower rather than manipulate human expression.
                    </p>
                  </div>
                </div>

                {/* Truth Quest Demo */}
                <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 p-6 rounded-xl border border-yellow-400/30 md:col-span-2">
                  <h4 className="text-yellow-300 font-semibold mb-3 flex items-center">
                    <i className="fas fa-search mr-2"></i>Quest for Truth Against All Odds
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-black/50 p-3 rounded font-mono text-xs">
                      <span className="text-gray-400">// 5th Generation Warfare Defense:</span><br/>
                      <span className="text-red-400">detectDisinformation()</span><br/>
                      <span className="text-blue-400">verifySourceCredibility()</span><br/>
                      <span className="text-green-400">promoteTransparency()</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p><i className="fas fa-shield-alt text-yellow-400 mr-2"></i>Information warfare mitigation</p>
                      <p><i className="fas fa-search text-yellow-400 mr-2"></i>Source verification systems</p>
                      <p><i className="fas fa-lightbulb text-yellow-400 mr-2"></i>Critical thinking frameworks</p>
                    </div>
                  </div>
                </div>

                {/* Gaming Philosophy Corner */}
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-400/30 md:col-span-2">
                  <h4 className="text-purple-300 font-semibold mb-3 flex items-center">
                    <i className="fas fa-gamepad mr-2"></i>Gaming Philosophy: Perfect Rhythm & Digital Flow
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-black/50 p-3 rounded">
                      <div className="text-xs text-purple-300 font-semibold mb-2">Rhythm Mastery</div>
                      <div className="text-xs text-gray-300 space-y-1">
                        <p className="beat-sync">🎵 10,000+ hours in IIDX</p>
                        <p>Perfect timing in code & beats</p>
                        <p>Flow state development</p>
                      </div>
                    </div>
                    <div className="bg-black/50 p-3 rounded">
                      <div className="text-xs text-cyan-300 font-semibold mb-2">Digital Worlds</div>
                      <div className="text-xs text-gray-300 space-y-1">
                        <p>HSR: Anaxa's philosophical inquiry</p>
                        <p>Rappa's authentic expression</p>
                        <p>VRChat consciousness research</p>
                      </div>
                    </div>
                    <div className="bg-black/50 p-3 rounded">
                      <div className="text-xs text-orange-300 font-semibold mb-2">Fire & Frost</div>
                      <div className="text-xs text-gray-300 space-y-1">
                        <p className="frost-pulse">❄️ Frostbite journalism</p>
                        <p>🔥 Burnice's explosive energy</p>
                        <p>⚡ Elemental coding harmony</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VibeCoding: Philosophy Meets Production */}
          <div className="max-w-4xl mx-auto">
            <div className={`holo-panel p-8 md:p-12 rounded-3xl border border-purple-400/50 gacha-shine energy-flow fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
              <h3 className="font-semibold text-2xl mb-6 text-[var(--spectrum-violet)] text-center">
                <i className="fas fa-code mr-3"></i>VibeCoding: Philosophy Meets Production
              </h3>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg text-center italic text-[var(--bright-purple)]">
                  "The Neural Network Portfolio: Where consciousness converges with computation."
                </p>
                
                <p>
                  VibeCoding isn't just methodology—it's digital alchemy. Where Socratic inquiry debugs reality, 
                  Aristotelian analysis architected Troves & Coves' AI orchestration, and Platonic ideals shaped 
                  the perfect Forms of clean code. Because if you're going to build the future, might as well 
                  bring some ancient wisdom to the party.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="holo-panel p-4 rounded-xl border border-[var(--synthwave-cyan)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-cyan)] mb-2 flex items-center text-sm">
                      <i className="fas fa-brain mr-2"></i>Classical Convergence
                    </h4>
                    <ul className="space-y-1 text-[var(--text-secondary)] text-xs">
                      <li>• Socratic inquiry drives debugging</li>
                      <li>• Aristotelian first-principles architecture</li>
                      <li>• Stoic discipline in error handling</li>
                      <li>• Platonic Forms guide clean code</li>
                    </ul>
                  </div>
                  
                  <div className="holo-panel p-4 rounded-xl border border-[var(--synthwave-pink)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-pink)] mb-2 flex items-center text-sm">
                      <i className="fas fa-robot mr-2"></i>AI-First Orchestration
                    </h4>
                    <ul className="space-y-1 text-[var(--text-secondary)] text-xs">
                      <li>• 30+ open-source models on tap</li>
                      <li>• Cross-empowerment intelligence</li>
                      <li>• Quantum-inspired state management</li>
                      <li>• Idempotent workflow poetry</li>
                    </ul>
                  </div>
                  
                  <div className="holo-panel p-4 rounded-xl border border-[var(--synthwave-gold)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-gold)] mb-2 flex items-center text-sm">
                      <i className="fas fa-shield-alt mr-2"></i>5GW Defense Ready
                    </h4>
                    <ul className="space-y-1 text-[var(--text-secondary)] text-xs">
                      <li>• Information warfare mitigation</li>
                      <li>• Narrative manipulation detection</li>
                      <li>• Cognitive security frameworks</li>
                      <li>• Democratic transparency tools</li>
                    </ul>
                  </div>
                </div>
                
                <p>
                  The Neural Network Portfolio you're browsing? It's a meta-recursive proof-of-concept where 
                  the showcase includes itself—because nothing says "I understand recursive design patterns" 
                  like breaking the fourth wall with style. Troves & Coves deployed with OWASP + ISO 27001 
                  security on a 512MB memory budget. Frostbite Gazette processes 15K daily AI calls with 
                  zero-trust verification. Sometimes the best portfolio project is the portfolio itself.
                </p>
                
                <div className="bg-gradient-to-r from-[var(--synthwave-violet)]/10 to-[var(--synthwave-cyan)]/10 p-6 rounded-lg border border-[var(--synthwave-violet)]/30">
                  <p className="text-center font-semibold text-[var(--synthwave-gold)]">
                    "Code is law. Let's write laws that protect consciousness, amplify creativity, and serve the flourishing of authentic digital expression."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cyberpunk Design Philosophy */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="holo-panel p-8 md:p-12 rounded-3xl border border-green-400/50 gacha-shine energy-flow">
              <h2 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--spectrum-green)] text-center">
                <i className="fas fa-eye mr-3"></i>Cyberpunk Design Philosophy
              </h2>
              
              <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed">
                <p className="text-lg text-center italic text-[var(--bright-green)]">
                  "Technology as art. Code as consciousness. Interfaces that acknowledge the cyborg nature of modern digital interaction."
                </p>
                
                <p>
                  Most portfolios follow predictable patterns—clean minimalism that screams "hire me, I'm safe." 
                  But why settle for corporate beige when you can have prismatic spectrum harmonization? 
                  This cyberpunk aesthetic isn't style over substance; it's substance through authentic style. 
                  Because if your interface doesn't suggest underlying digital physics, are you even trying?
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="holo-panel p-6 rounded-2xl border border-[var(--synthwave-cyan)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-cyan)] mb-3 flex items-center">
                      <i className="fas fa-prism mr-2"></i>Prismatic Harmonization
                    </h4>
                    <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                      <li>• Spectrum variables that mimic light refraction</li>
                      <li>• Glass morphism with quantum particle effects</li>
                      <li>• Energy flow patterns representing data streams</li>
                      <li>• Visual metaphors for consciousness complexity</li>
                    </ul>
                  </div>
                  
                  <div className="holo-panel p-6 rounded-2xl border border-[var(--synthwave-pink)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-pink)] mb-3 flex items-center">
                      <i className="fas fa-universal-access mr-2"></i>Accessible Cyberpunk
                    </h4>
                    <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                      <li>• WCAG 2.1 compliance with futuristic aesthetics</li>
                      <li>• High contrast ratios maintained throughout</li>
                      <li>• Reduced motion preferences respected</li>
                      <li>• Proving accessibility needn't sacrifice vision</li>
                    </ul>
                  </div>
                </div>
                
                <p>
                  The meta-recursive project showcase—including this portfolio within itself—creates temporal 
                  paradox within the browsing experience. It's not just clever; it's essential cyberpunk philosophy: 
                  acknowledging that all interfaces are constructs, all portfolios are performances, and the 
                  most honest approach embraces this truth rather than hiding it.
                </p>
                
                <div className="bg-gradient-to-r from-[var(--synthwave-green)]/10 to-[var(--synthwave-blue)]/10 p-6 rounded-lg border border-[var(--synthwave-green)]/30">
                  <p className="text-center font-semibold text-[var(--synthwave-gold)]">
                    "In the digital realm, authenticity means embracing the artificial. Let consciousness and computation converge with style."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Warfare Defense */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="holo-panel p-8 md:p-12 rounded-3xl border border-blue-400/50 gacha-shine energy-flow">
              <h2 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--spectrum-blue)] text-center">
                <i className="fas fa-shield-alt mr-3"></i>5th Generation Warfare Defense
              </h2>
              
              <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed">
                <p className="text-lg text-center italic text-[var(--bright-blue)]">
                  "In the digital realm, code is law. Let's write laws that defend consciousness."
                </p>
                
                <p>
                  Information warfare isn't science fiction—it's Tuesday. From narrative seeding to Overton window 
                  manipulation, modern conflict happens in perception space. Frostbite Gazette's defense framework 
                  implements zero-trust verification, cryptographic content integrity, and real-time threat intelligence. 
                  Because when algorithms determine what truth gets seen, transparency becomes a national security issue.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="holo-panel p-4 rounded-xl border border-[var(--synthwave-cyan)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-cyan)] mb-2 flex items-center text-sm">
                      <i className="fas fa-search mr-2"></i>Pattern Recognition
                    </h4>
                    <ul className="space-y-1 text-[var(--text-secondary)] text-xs">
                      <li>• Coordinated inauthentic behavior detection</li>
                      <li>• Narrative manipulation identification</li>
                      <li>• Astroturfing pattern analysis</li>
                      <li>• Foreign interference monitoring</li>
                    </ul>
                  </div>
                  
                  <div className="holo-panel p-4 rounded-xl border border-[var(--synthwave-pink)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-pink)] mb-2 flex items-center text-sm">
                      <i className="fas fa-lock mr-2"></i>Cryptographic Integrity
                    </h4>
                    <ul className="space-y-1 text-[var(--text-secondary)] text-xs">
                      <li>• SHA-256 content hashing</li>
                      <li>• Blockchain-style verification chains</li>
                      <li>• Immutable audit trails</li>
                      <li>• Digital signature validation</li>
                    </ul>
                  </div>
                  
                  <div className="holo-panel p-4 rounded-xl border border-[var(--synthwave-gold)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-gold)] mb-2 flex items-center text-sm">
                      <i className="fas fa-brain mr-2"></i>Cognitive Security
                    </h4>
                    <ul className="space-y-1 text-[var(--text-secondary)] text-xs">
                      <li>• Trivium-based analysis tools</li>
                      <li>• Logical fallacy detection</li>
                      <li>• Bias inoculation systems</li>
                      <li>• Critical thinking enhancement</li>
                    </ul>
                  </div>
                </div>
                
                <p>
                  The Canadian context adds complexity—linguistic division exploitation, resource politics manipulation, 
                  Arctic sovereignty information campaigns. Our defense architecture protects democratic discourse through 
                  multi-dimensional verification, Overton window monitoring, and quantum-resistant cryptography. 
                  Sometimes the most patriotic thing you can do is build systems that defend shared truth.
                </p>
                
                <div className="bg-gradient-to-r from-[var(--synthwave-blue)]/10 to-[var(--synthwave-cyan)]/10 p-6 rounded-lg border border-[var(--synthwave-blue)]/30">
                  <p className="text-center font-semibold text-[var(--synthwave-gold)]">
                    "Disinformation spreads like wildfire; truth builds like architecture. Choose your building materials wisely."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Principles */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <h2 className="font-bold text-3xl md:text-4xl text-center mb-16 text-[var(--bright-blue)]">
            Technical Implementation
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Continuous Learning */}
            <div className="holo-panel p-6 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--synthwave-pink)] to-[var(--synthwave-gold)] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-[var(--space-black)] text-lg"></i>
                </div>
                <h3 className="font-semibold text-lg text-[var(--synthwave-pink)]">Continuous Learning</h3>
                <p className="text-xs text-gray-400">Growth Mindset</p>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-4">
                Technology evolves rapidly, and staying current requires dedication to learning. 
                I embrace new frameworks and techniques while maintaining focus on fundamentals.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <i className="fas fa-book text-[var(--synthwave-pink)] mr-2"></i>
                  <span className="text-gray-400">Regular skill development and training</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-users-cog text-[var(--synthwave-pink)] mr-2"></i>
                  <span className="text-gray-400">Community involvement and knowledge sharing</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-lightbulb text-[var(--synthwave-pink)] mr-2"></i>
                  <span className="text-gray-400">Experimenting with emerging technologies</span>
                </div>
              </div>
            </div>

            {/* Collaboration */}
            <div className="holo-panel p-6 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--bright-blue)] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <i className="fas fa-handshake text-[var(--space-black)] text-lg"></i>
                </div>
                <h3 className="font-semibold text-lg text-[var(--synthwave-cyan)]">Collaboration</h3>
                <p className="text-xs text-gray-400">Team Success</p>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-4">
                Great software is built by teams, not individuals. I value clear communication, 
                constructive feedback, and shared ownership of outcomes.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <i className="fas fa-comments text-[var(--synthwave-cyan)] mr-2"></i>
                  <span className="text-gray-400">Clear and honest communication</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-code-branch text-[var(--synthwave-cyan)] mr-2"></i>
                  <span className="text-gray-400">Collaborative development practices</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-trophy text-[var(--synthwave-cyan)] mr-2"></i>
                  <span className="text-gray-400">Shared responsibility for project success</span>
                </div>
              </div>
            </div>

            {/* Innovation */}
            <div className="holo-panel p-6 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--synthwave-gold)] to-[var(--synthwave-pink)] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <i className="fas fa-rocket text-[var(--space-black)] text-lg"></i>
                </div>
                <h3 className="font-semibold text-lg text-[var(--synthwave-gold)]">Innovation</h3>
                <p className="text-xs text-gray-400">Creative Solutions</p>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-4">
                While respecting proven patterns, I actively seek creative approaches to complex problems. 
                Innovation comes from understanding both constraints and possibilities.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <i className="fas fa-puzzle-piece text-[var(--synthwave-gold)] mr-2"></i>
                  <span className="text-gray-400">Creative problem-solving approaches</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-flask text-[var(--synthwave-gold)] mr-2"></i>
                  <span className="text-gray-400">Experimenting with new ideas and concepts</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-chart-line text-[var(--synthwave-gold)] mr-2"></i>
                  <span className="text-gray-400">Balancing innovation with reliability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VibeCoding Methodology */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="holo-panel p-8 md:p-12 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
              <h2 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--synthwave-cyan)] text-center">
                <i className="fas fa-infinity mr-3"></i>The VibeCoding Methodology
              </h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg text-center italic text-[var(--bright-blue)]">
                  "When technical excellence meets thoughtful design, software becomes an expression of human potential."
                </p>
                
                <p>
                  VibeCoding represents my integrated approach to software development—where philosophical principles inform 
                  technical decisions, and every project reflects a commitment to meaningful impact. It's about building 
                  technology that enhances human capability while respecting human agency.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="holo-panel p-6 rounded-2xl border border-[var(--synthwave-gold)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-gold)] mb-3 flex items-center">
                      <i className="fas fa-code mr-2"></i>Technical Practices
                    </h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Test-driven development with comprehensive coverage</li>
                      <li>• Clean architecture and maintainable code patterns</li>
                      <li>• Performance optimization without sacrificing clarity</li>
                      <li>• Accessibility and inclusive design from day one</li>
                    </ul>
                  </div>
                  
                  <div className="holo-panel p-6 rounded-2xl border border-[var(--synthwave-cyan)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-cyan)] mb-3 flex items-center">
                      <i className="fas fa-heart mr-2"></i>Human-Centered Values
                    </h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• User experience that prioritizes clarity over cleverness</li>
                      <li>• Privacy protection built into core architecture</li>
                      <li>• Meaningful feedback and error handling</li>
                      <li>• Technology that augments rather than replaces human judgment</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[var(--synthwave-pink)]/10 to-[var(--synthwave-gold)]/10 p-6 rounded-lg border border-[var(--synthwave-pink)]/30">
                  <p className="text-center font-semibold text-[var(--synthwave-gold)]">
                    "Great software doesn't just work—it empowers people to achieve their goals with dignity and joy."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Speech & Digital Rights */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="holo-panel p-8 md:p-12 rounded-3xl border border-cyan-400/50 gacha-shine energy-flow">
              <h2 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--spectrum-cyan)] text-center">
                <i className="fas fa-bullhorn mr-3"></i>Free Speech & Digital Rights
              </h2>
              
              <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed">
                <p className="text-lg text-center italic text-[var(--bright-blue)]">
                  "The right to speak freely is the foundation upon which all other freedoms rest."
                </p>
                
                <p>
                  In an era where digital platforms increasingly control the flow of information, defending free speech 
                  becomes a fundamental responsibility for every developer. The code we write, the platforms we build, 
                  and the systems we architect must preserve the fundamental human right to express ideas without fear 
                  of censorship or retribution.
                </p>
                
                <p>
                  Technology should empower diverse voices, not silence them. Every algorithm that determines what content 
                  gets seen, every moderation system that decides what speech is acceptable, and every platform policy 
                  that governs expression represents a critical choice about the kind of digital society we're building.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="holo-panel p-6 rounded-2xl border border-[var(--synthwave-cyan)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-cyan)] mb-3 flex items-center">
                      <i className="fas fa-shield-alt mr-2"></i>Platform Principles
                    </h4>
                    <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                      <li>• Transparent content policies with clear appeals processes</li>
                      <li>• Open-source moderation algorithms where possible</li>
                      <li>• User control over algorithmic content curation</li>
                      <li>• Decentralized systems that resist single points of censorship</li>
                    </ul>
                  </div>
                  
                  <div className="holo-panel p-6 rounded-2xl border border-[var(--synthwave-pink)]/50 gacha-shine">
                    <h4 className="font-semibold text-[var(--synthwave-pink)] mb-3 flex items-center">
                      <i className="fas fa-users mr-2"></i>Developer Responsibility
                    </h4>
                    <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
                      <li>• Building systems that protect user privacy and expression</li>
                      <li>• Resisting pressure to implement overreaching censorship</li>
                      <li>• Creating tools that empower individual agency</li>
                      <li>• Advocating for digital rights within development teams</li>
                    </ul>
                  </div>
                </div>
                
                <p>
                  The internet was built on principles of open communication and free exchange of ideas. As developers, 
                  we have the power and responsibility to ensure these principles survive and thrive in the digital age. 
                  Every line of code is a choice between freedom and control, between empowerment and suppression.
                </p>
                
                <div className="bg-gradient-to-r from-[var(--synthwave-cyan)]/10 to-[var(--synthwave-pink)]/10 p-6 rounded-lg border border-[var(--synthwave-cyan)]/30">
                  <p className="text-center font-semibold text-[var(--synthwave-gold)]">
                    "In the digital realm, code is law. Let us write laws that protect the fundamental human right to speak, think, and express freely."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}