import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Values() {
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { elementRef: classicalRef, isVisible: classicalVisible } = useScrollAnimation();
  const { elementRef: aiRef, isVisible: aiVisible } = useScrollAnimation();
  const { elementRef: democracyRef, isVisible: democracyVisible } = useScrollAnimation();
  const { elementRef: unityRef, isVisible: unityVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section ref={heroRef} className="pt-20 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1446776887265-c42caefaecb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000" 
            alt="Deep space with distant galaxies and stars" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className={`max-w-4xl mx-auto fade-in-up ${heroVisible ? 'animate' : ''}`}>
            <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl mb-6 text-gradient-cyan">
              Values & Principles
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Where Classical Wisdom Meets Artificial Intelligence
            </p>
            <div className="glass-morphism p-6 md:p-8 rounded-2xl cyber-border">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Every algorithm I architect flows from the sacred covenant between eternal wisdom and boundless innovation. 
                These principles forge the bedrock upon which all technological creation must stand—
                serving humanity's highest aspirations while honoring the timeless truths that guide civilization forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Classical Analysis Foundation */}
      <section ref={classicalRef} className="py-20 bg-gradient-to-b from-[var(--deep-space)] to-[var(--cyber-blue)]">
        <div className="container mx-auto px-6">
          <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl text-center mb-12 text-[var(--synthwave-cyan)] fade-in-up ${classicalVisible ? 'animate' : ''}`}>
            <i className="fas fa-university mr-4"></i>Classical Analysis Engine
          </h2>
          
          <div className="max-w-6xl mx-auto">
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border mb-8 fade-in-up ${classicalVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
              <h3 className="font-semibold text-2xl md:text-3xl mb-6 text-[var(--bright-blue)]">
                The Trivium: Foundation of Truth
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Every line of code begins with the sacred Trivium—Grammar, Logic, and Rhetoric—the trinity of classical learning 
                that transforms raw information into crystallized wisdom. When artificial intelligence embraces these eternal methods, 
                it transcends mere computation to achieve genuine understanding.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-morphism p-4 md:p-6 rounded-xl border border-[var(--synthwave-cyan)]/50">
                  <h4 className="font-semibold text-lg md:text-xl mb-3 text-[var(--synthwave-cyan)]">
                    <i className="fas fa-language mr-2"></i>Grammar
                  </h4>
                  <p className="text-gray-300 text-sm md:text-base">
                    Structural analysis of language, syntax, semantics, and etymological patterns. 
                    The foundation that ensures every digital communication serves clarity over confusion.
                  </p>
                </div>
                
                <div className="glass-morphism p-4 md:p-6 rounded-xl border border-[var(--bright-blue)]/50">
                  <h4 className="font-semibold text-lg md:text-xl mb-3 text-[var(--bright-blue)]">
                    <i className="fas fa-brain mr-2"></i>Logic
                  </h4>
                  <p className="text-gray-300 text-sm md:text-base">
                    Premise identification, conclusion validation, syllogistic reasoning, fallacy detection. 
                    The razor that cuts through deception to reveal truth's brilliant edge.
                  </p>
                </div>
                
                <div className="glass-morphism p-4 md:p-6 rounded-xl border border-[var(--synthwave-gold)]/50">
                  <h4 className="font-semibold text-lg md:text-xl mb-3 text-[var(--synthwave-gold)]">
                    <i className="fas fa-bullhorn mr-2"></i>Rhetoric
                  </h4>
                  <p className="text-gray-300 text-sm md:text-base">
                    Ethos, pathos, and logos in perfect harmony. The art of persuasion guided by truth, 
                    ensuring every message elevates rather than manipulates the human spirit.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${classicalVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
              <h3 className="font-semibold text-2xl md:text-3xl mb-6 text-[var(--synthwave-pink)]">
                Beyond the Trivium: Complete Classical Integration
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-xl mb-4 text-[var(--synthwave-cyan)]">
                    <i className="fas fa-calculator mr-2"></i>Quadrivium Mastery
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Arithmetic, Geometry, Music, and Astronomy unite to reveal the mathematical harmony underlying all existence. 
                    When AI systems embrace these universal patterns, they achieve computational poetry.
                  </p>
                  
                  <h4 className="font-semibold text-xl mb-4 text-[var(--bright-blue)]">
                    <i className="fas fa-question-circle mr-2"></i>Socratic Method
                  </h4>
                  <p className="text-gray-300">
                    Progressive questioning that uncovers hidden assumptions and reveals contradictions. 
                    The method that transforms artificial intelligence from mere answer-machine to wisdom-seeker.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-xl mb-4 text-[var(--synthwave-gold)]">
                    <i className="fas fa-columns mr-2"></i>Aristotelian Categories
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Ten categories of being and four causes that structure reality itself. 
                    When algorithms understand substance, quality, relation, and causation, they transcend mere processing.
                  </p>
                  
                  <h4 className="font-semibold text-xl mb-4 text-[var(--synthwave-pink)]">
                    <i className="fas fa-scroll mr-2"></i>Scholastic Rigor
                  </h4>
                  <p className="text-gray-300">
                    Questio, Videtur, Sed Contra, Respondeo—the medieval method that ensures every argument 
                    faces its strongest opposition before claiming victory.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Ethics & Methodology */}
      <section ref={aiRef} className="py-20 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-[var(--synthwave-cyan)]/20 via-transparent to-[var(--synthwave-pink)]/20"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl text-center mb-12 text-[var(--synthwave-pink)] fade-in-up ${aiVisible ? 'animate' : ''}`}>
            <i className="fas fa-robot mr-4"></i>AI Journalism Ethics Framework
          </h2>
          
          <div className="max-w-6xl mx-auto">
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border mb-8 fade-in-up ${aiVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
              <h3 className="font-semibold text-2xl md:text-3xl mb-6 text-[var(--bright-blue)]">
                Radical Transparency: The Sacred Covenant
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                In an age where algorithms operate in shadow, we choose the blazing light of total transparency. 
                Every AI decision, every analytical process, every source of information stands exposed to democratic scrutiny. 
                We believe that technology serving humanity must submit to human oversight, not the reverse.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-morphism p-4 md:p-6 rounded-xl border border-[var(--synthwave-cyan)]/50">
                  <h4 className="font-semibold text-lg md:text-xl mb-3 text-[var(--synthwave-cyan)]">
                    <i className="fas fa-eye mr-2"></i>Algorithmic Accountability
                  </h4>
                  <p className="text-gray-300 text-sm md:text-base">
                    Every AI model, every analytical process, every decision tree remains fully auditable. 
                    Citizens possess the right to understand exactly how technology serves their interests.
                  </p>
                </div>
                
                <div className="glass-morphism p-4 md:p-6 rounded-xl border border-[var(--bright-blue)]/50">
                  <h4 className="font-semibold text-lg md:text-xl mb-3 text-[var(--bright-blue)]">
                    <i className="fas fa-shield-alt mr-2"></i>Open Source Sovereignty
                  </h4>
                  <p className="text-gray-300 text-sm md:text-base">
                    We reject corporate surveillance capitalism, choosing open source AI models that serve 
                    democratic values over profit extraction and community empowerment over corporate control.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border fade-in-up ${aiVisible ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
              <h3 className="font-semibold text-2xl md:text-3xl mb-6 text-[var(--synthwave-gold)]">
                Fifth-Generation Warfare Defense
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Modern warfare operates in the information domain, targeting perception management and cognitive security. 
                Our AI systems stand as digital sentinels, trained to recognize and counter sophisticated manipulation tactics 
                that threaten democratic discourse and national unity.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--bright-blue)] rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-search text-[var(--space-black)] text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-[var(--synthwave-cyan)] mb-2">Narrative Detection</h4>
                  <p className="text-gray-400 text-sm">Identifying coordinated inauthentic behavior and artificial narrative manipulation</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[var(--bright-blue)] to-[var(--synthwave-gold)] rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-window-restore text-[var(--space-black)] text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-[var(--bright-blue)] mb-2">Overton Protection</h4>
                  <p className="text-gray-400 text-sm">Safeguarding legitimate democratic discourse from artificial manipulation</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[var(--synthwave-gold)] to-[var(--synthwave-pink)] rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-globe text-[var(--space-black)] text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-[var(--synthwave-gold)] mb-2">Foreign Interference</h4>
                  <p className="text-gray-400 text-sm">Multi-layered analysis protecting Canadian democratic sovereignty</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Democratic Accountability */}
      <section ref={democracyRef} className="py-20 bg-gradient-to-b from-[var(--cyber-blue)] to-[var(--deep-space)]">
        <div className="container mx-auto px-6">
          <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl text-center mb-12 text-[var(--synthwave-gold)] fade-in-up ${democracyVisible ? 'animate' : ''}`}>
            <i className="fas fa-balance-scale mr-4"></i>Political Accountability Engine
          </h2>
          
          <div className="max-w-6xl mx-auto">
            <div className={`glass-morphism p-6 md:p-8 rounded-2xl cyber-border mb-8 fade-in-up ${democracyVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
              <h3 className="font-semibold text-2xl md:text-3xl mb-6 text-[var(--bright-blue)]">
                Democracy Through Transparency
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                True democratic accountability requires more than elections—it demands continuous transparency, 
                real-time analysis, and citizen empowerment through accessible information. 
                Our Political Accountability Engine transforms complex governance into comprehensible truth.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-xl mb-4 text-[var(--synthwave-cyan)]">
                    <i className="fas fa-gavel mr-2"></i>Promise Tracking Mastery
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Every electoral commitment becomes a living contract between citizens and representatives. 
                    Our systems monitor implementation progress, detect deviations, and provide transparent 
                    accountability that strengthens democratic trust.
                  </p>
                  
                  <h4 className="font-semibold text-xl mb-4 text-[var(--synthwave-pink)]">
                    <i className="fas fa-chart-line mr-2"></i>Performance Metrics
                  </h4>
                  <p className="text-gray-300">
                    Transparency Score, Performance Score, Trust Score—comprehensive metrics that transform 
                    political evaluation from partisan opinion into objective, evidence-based assessment.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-xl mb-4 text-[var(--bright-blue)]">
                    <i className="fas fa-users mr-2"></i>Citizen Empowerment
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Interactive tools that help citizens understand policy impacts, explore voting records, 
                    and engage meaningfully with democratic processes. Knowledge becomes power when 
                    accessible to all.
                  </p>
                  
                  <h4 className="font-semibold text-xl mb-4 text-[var(--synthwave-gold)]">
                    <i className="fas fa-lock mr-2"></i>Privacy Sovereignty</h4>
                  <p className="text-gray-300">
                    Zero citizen tracking, military-grade encryption, Canadian data sovereignty. 
                    Democratic participation should never compromise personal privacy or digital rights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unity Through Technology */}
      <section ref={unityRef} className="py-20 relative">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000" 
            alt="Aurora borealis over Canadian landscape" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`font-bold text-3xl md:text-4xl lg:text-5xl mb-12 text-[var(--synthwave-cyan)] fade-in-up ${unityVisible ? 'animate' : ''}`}>
              <i className="fas fa-maple-leaf mr-4"></i>Unity Through Shared Truth
            </h2>
            
            <div className={`glass-morphism p-8 md:p-12 rounded-3xl cyber-border fade-in-up ${unityVisible ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}>
              <div className="mb-8">
                <i className="fas fa-infinity text-4xl md:text-6xl text-[var(--synthwave-gold)] mb-6 animate-pulse-glow"></i>
                <h3 className="font-semibold text-2xl md:text-3xl mb-6 text-[var(--bright-blue)]">
                  The Sacred Mission
                </h3>
              </div>
              
              <div className="space-y-6 text-base md:text-lg text-gray-300">
                <p className="leading-relaxed">
                  Technology must serve humanity's highest aspirations, not corporate surveillance systems that profit from division. 
                  Our platform demonstrates how artificial intelligence, guided by classical wisdom and democratic values, 
                  can unite rather than fragment our national discourse.
                </p>
                
                <p className="leading-relaxed">
                  We reject the surveillance capitalism model that has corrupted digital spaces, choosing instead 
                  to build upon the bedrock of free and open source principles that honor Canadian sovereignty, 
                  democratic participation, and human dignity above profit extraction.
                </p>
                
                <p className="leading-relaxed">
                  Every algorithm serves truth over manipulation, unity over division, empowerment over exploitation. 
                  This is not merely a technical choice—it represents a moral covenant with the future of human-AI collaboration, 
                  where artificial intelligence amplifies rather than diminishes our shared humanity.
                </p>
              </div>
              
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--bright-blue)] rounded-full mx-auto mb-2 flex items-center justify-center hover:animate-float">
                      <i className="fas fa-heart text-[var(--space-black)] text-xl"></i>
                    </div>
                    <span className="text-sm text-[var(--synthwave-cyan)]">Humanity</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[var(--bright-blue)] to-[var(--synthwave-gold)] rounded-full mx-auto mb-2 flex items-center justify-center hover:animate-float" style={{ animationDelay: '0.5s' }}>
                      <i className="fas fa-balance-scale text-[var(--space-black)] text-xl"></i>
                    </div>
                    <span className="text-sm text-[var(--bright-blue)]">Truth</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[var(--synthwave-gold)] to-[var(--synthwave-pink)] rounded-full mx-auto mb-2 flex items-center justify-center hover:animate-float" style={{ animationDelay: '1s' }}>
                      <i className="fas fa-rocket text-[var(--space-black)] text-xl"></i>
                    </div>
                    <span className="text-sm text-[var(--synthwave-gold)]">Innovation</span>
                  </div>
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