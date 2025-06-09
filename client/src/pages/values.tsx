import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import GeometricBackground from "@/components/geometric-background";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Values() {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen relative">
      <Navigation />
      <GeometricBackground />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/images/catboy2025BG_1749433079455.PNG" 
            alt="Anime synthwave space background" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl mb-6 text-gradient-cyan">
              Charter Principles
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Canadian values forged in digital steel, defending freedom through convergent wisdom
            </p>
            
            {/* Canadian Flag */}
            <div className="flex justify-center mb-8">
              <div className="glass-morphism p-4 rounded-xl">
                <svg className="w-12 h-8 mx-auto" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
                  <rect width="1000" height="500" fill="#FF0000"/>
                  <rect x="250" y="0" width="500" height="500" fill="#FFFFFF"/>
                  <g transform="translate(500,250)">
                    <path d="M0,-83 L15,-67 L35,-75 L20,-55 L30,-35 L15,-45 L25,-25 L5,-35 L15,-15 L-15,-15 L-5,-35 L-25,-25 L-15,-45 L-30,-35 L-20,-55 L-35,-75 L-15,-67 Z" fill="#FF0000"/>
                    <rect x="-3" y="-15" width="6" height="60" fill="#FF0000"/>
                  </g>
                </svg>
                <p className="text-sm text-gray-400 mt-2">Canadian Democratic Values</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 relative" ref={elementRef}>
        <div className="container mx-auto px-6">
          <h2 className={`font-bold text-3xl md:text-4xl text-center mb-16 text-[var(--synthwave-cyan)] fade-in-up ${isVisible ? 'animate' : ''}`}>
            Principles as Code
          </h2>
          
          <div className={`max-w-4xl mx-auto text-center mb-16 fade-in-up ${isVisible ? 'animate' : ''}`}>
            <div className="glass-morphism p-8 rounded-2xl cyber-border">
              <div className="font-mono text-sm text-left bg-[var(--space-black)] p-6 rounded-lg border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
                <span className="text-[var(--synthwave-pink)]">const</span> <span className="text-[var(--synthwave-cyan)]">canadianValues</span> <span className="text-white">=</span> <span className="text-yellow-400">&#123;</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)]">freedom</span><span className="text-white">:</span> <span className="text-green-400">"expression + conscience + religion"</span><span className="text-white">,</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)]">democracy</span><span className="text-white">:</span> <span className="text-green-400">"participation + representation + accountability"</span><span className="text-white">,</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)]">equality</span><span className="text-white">:</span> <span className="text-green-400">"before_law + opportunity + dignity"</span><span className="text-white">,</span><br />
                &nbsp;&nbsp;<span className="text-[var(--synthwave-gold)]">justice</span><span className="text-white">:</span> <span className="text-green-400">"fundamental + procedural + substantive"</span><br />
                <span className="text-yellow-400">&#125;;</span><br /><br />
                <span className="text-gray-400">// Compiled into every decision, every line of code, every human interaction</span>
              </div>
              <p className="text-gray-300 mt-6 leading-relaxed">
                <strong className="text-[var(--light-beam)]">Constitutional principles architected as immutable constants</strong>—
                these values form the unbreakable foundation upon which all technological innovation must be built.
              </p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* Freedom of Expression */}
            <div className={`glass-morphism p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--synthwave-gold)] to-[var(--bright-blue)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-microphone text-[var(--space-black)] text-xl"></i>
                </div>
                <h3 className="font-semibold text-xl text-[var(--synthwave-gold)]">Freedom of Expression</h3>
                <p className="text-sm text-gray-400 mt-2">Charter Section 2(b)</p>
              </div>
              
              <p className="text-gray-300 mb-6 text-center leading-relaxed">
                The sacred cornerstone of democratic society—every voice deserves to pierce the digital void, 
                every truth demands its platform, every dissent fuels the engine of progress. 
                Speech is the weapon of the enlightened mind.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <i className="fas fa-quote-left text-[var(--synthwave-gold)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">The marketplace of ideas thrives in unrestricted discourse</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-quote-left text-[var(--synthwave-gold)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Truth emerges through debate, not censorship</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-quote-left text-[var(--synthwave-gold)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Digital platforms must honor constitutional principles</span>
                </div>
              </div>
            </div>

            {/* Democratic Rights */}
            <div className={`glass-morphism p-8 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--synthwave-pink)] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-balance-scale text-[var(--space-black)] text-xl"></i>
                </div>
                <h3 className="font-semibold text-xl text-[var(--synthwave-cyan)]">Democratic Rights</h3>
                <p className="text-sm text-gray-400 mt-2">Charter Sections 3-5</p>
              </div>
              
              <p className="text-gray-300 mb-6 text-center leading-relaxed">
                The citizen's sovereign power flows through authentic representation, unmanipulated by foreign 
                algorithms or domestic deception. Every vote carries the weight of genuine will, 
                every election stands as democracy's sacred ritual.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <i className="fas fa-crown text-[var(--synthwave-cyan)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Right to vote and seek office without interference</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-crown text-[var(--synthwave-cyan)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Legislative assemblies accountable to the people</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-crown text-[var(--synthwave-cyan)] mr-3 mt-1"></i>
                  <span className="text-gray-300 text-sm">Protection from algorithmic manipulation of democracy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Free Speech Manifesto */}
          <div className="max-w-4xl mx-auto">
            <div className={`glass-morphism p-8 md:p-12 rounded-2xl cyber-border fade-in-up ${isVisible ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
              <h3 className="font-semibold text-2xl mb-6 text-[var(--synthwave-pink)] text-center">
                <i className="fas fa-bullhorn mr-3"></i>The Sacred Imperative of Free Speech
              </h3>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg text-center italic text-[var(--bright-blue)]">
                  "In the crucible of unrestricted discourse, truth emerges not as dogma, but as hard-won wisdom."
                </p>
                
                <p>
                  Free speech stands as the cornerstone upon which all other freedoms rest—not merely as legal construct, 
                  but as the fundamental operating system of democratic society. When we silence voices, we do not eliminate 
                  ideas; we drive them underground where they fester and metastasize beyond the reach of reasoned challenge.
                </p>
                
                <p>
                  The digital age demands fierce protection of this principle. Algorithmic censorship, shadow banning, 
                  and platform manipulation represent new forms of tyranny—more insidious because they operate in shadows, 
                  more dangerous because they masquerade as progress.
                </p>
                
                <p>
                  Truth fears no scrutiny. Lies crumble under examination. The answer to speech we despise is not silence 
                  but more speech—better speech, more persuasive speech, speech backed by evidence and delivered with wisdom.
                </p>
                
                <div className="bg-gradient-to-r from-[var(--synthwave-pink)]/10 to-[var(--synthwave-gold)]/10 p-6 rounded-lg border border-[var(--synthwave-pink)]/30">
                  <p className="text-center font-semibold text-[var(--synthwave-gold)]">
                    "The moment we declare any idea too dangerous to discuss, we have already surrendered our capacity to think."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Charter Rights */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <h2 className="font-bold text-3xl md:text-4xl text-center mb-16 text-[var(--bright-blue)]">
            Constitutional Pillars
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Legal Rights */}
            <div className="glass-morphism p-6 rounded-2xl cyber-border">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--synthwave-pink)] to-[var(--synthwave-gold)] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <i className="fas fa-gavel text-[var(--space-black)] text-lg"></i>
                </div>
                <h3 className="font-semibold text-lg text-[var(--synthwave-pink)]">Legal Rights</h3>
                <p className="text-xs text-gray-400">Sections 7-14</p>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-4">
                Justice flows through transparent processes, where every citizen stands equal before 
                digital and physical law alike.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-[var(--synthwave-pink)] mr-2"></i>
                  <span className="text-gray-400">Life, liberty and security of person</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-[var(--synthwave-pink)] mr-2"></i>
                  <span className="text-gray-400">Protection against unreasonable search</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-[var(--synthwave-pink)] mr-2"></i>
                  <span className="text-gray-400">Presumption of innocence and fair trial</span>
                </div>
              </div>
            </div>

            {/* Equality Rights */}
            <div className="glass-morphism p-6 rounded-2xl cyber-border">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--bright-blue)] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <i className="fas fa-equals text-[var(--space-black)] text-lg"></i>
                </div>
                <h3 className="font-semibold text-lg text-[var(--synthwave-cyan)]">Equality Rights</h3>
                <p className="text-xs text-gray-400">Section 15</p>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-4">
                Digital citizenship transcends all boundaries—every soul possesses inherent worth 
                in the networked democracy we forge.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <i className="fas fa-handshake text-[var(--synthwave-cyan)] mr-2"></i>
                  <span className="text-gray-400">Equal protection and benefit of law</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-handshake text-[var(--synthwave-cyan)] mr-2"></i>
                  <span className="text-gray-400">Non-discrimination in digital spaces</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-handshake text-[var(--synthwave-cyan)] mr-2"></i>
                  <span className="text-gray-400">Affirmative action for disadvantaged groups</span>
                </div>
              </div>
            </div>

            {/* Language Rights */}
            <div className="glass-morphism p-6 rounded-2xl cyber-border">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--synthwave-gold)] to-[var(--synthwave-pink)] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <i className="fas fa-language text-[var(--space-black)] text-lg"></i>
                </div>
                <h3 className="font-semibold text-lg text-[var(--synthwave-gold)]">Language Rights</h3>
                <p className="text-xs text-gray-400">Sections 16-23</p>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-4">
                The twin tongues of our nation must echo equally through every digital corridor, 
                every platform, every algorithm that shapes Canadian discourse.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <i className="fas fa-comments text-[var(--synthwave-gold)] mr-2"></i>
                  <span className="text-gray-400">English and French official status</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-comments text-[var(--synthwave-gold)] mr-2"></i>
                  <span className="text-gray-400">Right to communicate with government</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-comments text-[var(--synthwave-gold)] mr-2"></i>
                  <span className="text-gray-400">Minority language educational rights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Philosophy */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="glass-morphism p-8 md:p-12 rounded-2xl cyber-border">
              <h2 className="font-bold text-2xl md:text-3xl mb-8 text-[var(--synthwave-cyan)] text-center">
                <i className="fas fa-infinity mr-3"></i>Code as Constitutional Expression
              </h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg text-center italic text-[var(--bright-blue)]">
                  "Every algorithm embodies political philosophy; every database structure reflects societal values."
                </p>
                
                <p>
                  Technology is never neutral. Each line of code carries the biases, assumptions, and values of its creators. 
                  When we build systems that process Canadian data, serve Canadian citizens, or influence Canadian discourse, 
                  we bear the sacred responsibility to embed Charter principles into the very architecture of our solutions.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="glass-morphism p-6 rounded-lg border border-[var(--synthwave-gold)]/30">
                    <h4 className="font-semibold text-[var(--synthwave-gold)] mb-3 flex items-center">
                      <i className="fas fa-code mr-2"></i>Technical Principles
                    </h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Algorithmic transparency and auditability</li>
                      <li>• Privacy by design, not afterthought</li>
                      <li>• Accessible interfaces for all abilities</li>
                      <li>• Bilingual by default, inclusive by intention</li>
                    </ul>
                  </div>
                  
                  <div className="glass-morphism p-6 rounded-lg border border-[var(--synthwave-cyan)]/30">
                    <h4 className="font-semibold text-[var(--synthwave-cyan)] mb-3 flex items-center">
                      <i className="fas fa-shield-alt mr-2"></i>Constitutional Guards
                    </h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• No backdoors that compromise Charter rights</li>
                      <li>• AI systems that resist authoritarian capture</li>
                      <li>• Democratic oversight of automated decisions</li>
                      <li>• Protection from foreign influence operations</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[var(--synthwave-pink)]/10 to-[var(--synthwave-gold)]/10 p-6 rounded-lg border border-[var(--synthwave-pink)]/30">
                  <p className="text-center font-semibold text-[var(--synthwave-gold)]">
                    "We do not build systems that could survive under tyranny. We build systems that make tyranny impossible."
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