import React from 'react';

export default function TechnicalDeepDive() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Quantum Particle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Technical Deep Dive
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Journey through the quantum consciousness architecture and 
            sophisticated engineering principles that power next-generation digital experiences.
          </p>
        </div>

        {/* Architecture Philosophy Section */}
        <section className="mb-16">
          <div className="holo-panel p-8 rounded-2xl mb-8 backdrop-blur-lg border border-cyan-500/30">
            <h2 className="text-4xl font-bold mb-6 text-cyan-400">
              🏗️ Architecture Philosophy
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-blue-300">
                  Quantum Consciousness Design
                </h3>
                <p className="text-gray-300 mb-4">
                  Imagine your favorite rhythm game like beatmania IIDX - it processes thousands of notes simultaneously while maintaining 
                  60fps performance. Our architecture applies this same parallel processing philosophy to web experiences.
                </p>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-blue-500/20">
                  <code className="text-cyan-300 text-sm">
                    {`// Like a chess engine evaluating multiple moves
const quantumProcessor = {
  parallel_streams: 8,
  consciousness_layers: ['visual', 'interactive', 'philosophical'],
  performance_target: '60fps_guaranteed'
}`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  Glassmorphic Interface Engineering
                </h3>
                <p className="text-gray-300 mb-4">
                  Think of looking through a crystal - you see multiple layers of reality simultaneously. Our interfaces use 
                  glassmorphism to create this same multi-dimensional awareness, 
                  where background and foreground dance together like light through a prism.
                </p>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                  <code className="text-purple-300 text-sm">
                    {`// Creating translucent consciousness layers
.holo-panel {
  backdrop-filter: blur(15px) saturate(200%);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(100, 255, 255, 0.3);
}`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Engineering Methodology Section */}
        <section className="mb-16">
          <div className="holo-panel p-8 rounded-2xl mb-8 backdrop-blur-lg border border-purple-500/30">
            <h2 className="text-4xl font-bold mb-6 text-purple-400">
              ⚡ Engineering Methodology
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-green-300">
                  VibeCoding Methodology
                </h3>
                <p className="text-gray-300 mb-4">
                  Like a rhythm game where perfect timing creates beautiful music, 
                  VibeCoding synchronizes technical excellence with human intuition. Each code pattern flows like a musical phrase, 
                  creating software that feels alive and responsive.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                    <h4 className="font-semibold text-green-300 mb-2">🎵 Rhythm Coding</h4>
                    <p className="text-sm text-gray-300">
                      Functions flow like beat saber patterns - 
                      predictable yet surprising, efficient yet elegant.
                    </p>
                  </div>
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                    <h4 className="font-semibold text-blue-300 mb-2">🧠 Consciousness Patterns</h4>
                    <p className="text-sm text-gray-300">
                      Architecture mirrors human thought - parallel processing with focused attention loops.
                    </p>
                  </div>
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                    <h4 className="font-semibold text-purple-300 mb-2">🎮 Gaming Optimization</h4>
                    <p className="text-sm text-gray-300">
                      Performance tuned like fighting game frame data - 
                      every millisecond matters.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-orange-300">
                  Multi-LLM Orchestration
                </h3>
                <p className="text-gray-300 mb-4">
                  Picture an orchestra where each instrument (AI model) has its specialty - the violin handles delicate UI details, 
                  the drums manage robust backend systems, and the conductor (orchestrator) ensures perfect harmony. No single AI 
                  does everything; instead, they collaborate like a raid team 
                  in an MMO.
                </p>

                <div className="bg-slate-800/50 p-4 rounded-lg border border-orange-500/20">
                  <code className="text-orange-300 text-sm">
                    {`// Orchestrating multiple AI consciousness streams
const aiOrchestra = {
  frontend_specialist: 'handles_ui_and_animations',
  backend_architect: 'manages_databases_and_apis', 
  philosophy_guide: 'ensures_ethical_patterns',
  conductor: 'coordinates_perfect_harmony'
}`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Integration Section */}
        <section className="mb-16">
          <div className="holo-panel p-8 rounded-2xl mb-8 backdrop-blur-lg border border-green-500/30">
            <h2 className="text-4xl font-bold mb-6 text-green-400">
              🏛️ Philosophy Integration
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  Socratic Debugging Methodology
                </h3>
                <p className="text-gray-300 mb-4">
                  When bugs appear, we don't just fix them - we interrogate them like Socrates questioning assumptions. 
                  "Why did this fail?" leads to "What did we assume?" which reveals deeper truths about system design. 
                  Each error becomes a philosophical teacher.
                </p>

                <div className="bg-cyan-900/20 p-4 rounded-lg border border-cyan-500/30">
                  <h4 className="font-semibold text-cyan-300 mb-2">The Socratic Stack Trace:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>1. "What broke?" → Identify the symptom</li>
                    <li>2. "Why did we expect this to work?" → Question assumptions</li>
                    <li>3. "What does this teach us?" → Extract wisdom</li>
                    <li>4. "How can we prevent this pattern?" → Evolve architecture</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-yellow-300">
                  Stoic Deployment Principles
                </h3>
                <p className="text-gray-300 mb-4">
                  Like Marcus Aurelius preparing for battle, we deploy with acceptance of uncertainty. We control our code quality, 
                  testing thoroughness, and response protocols - but accept that production environments will surprise us. 
                  This mental framework creates unshakeable resilience.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-red-300">
                  Canadian Charter Programming Ethics
                </h3>
                <p className="text-gray-300 mb-4">
                  Every line of code reflects values. We embed democratic principles 
                  directly into architecture - accessibility isn't an afterthought but a foundational requirement, privacy is built-in 
                  not bolted-on, and user agency is preserved through transparent, empowering interfaces.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Democratic Technology Section */}
        <section className="mb-16">
          <div className="holo-panel p-8 rounded-2xl mb-8 backdrop-blur-lg border border-blue-500/30">
            <h2 className="text-4xl font-bold mb-6 text-blue-400">
              🏛️ Democratic Technology Principles
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-emerald-300">
                  Accessibility-First Architecture
                </h3>
                <p className="text-gray-300 mb-4">
                  We design for the most challenging use cases first - if it works for someone navigating with 
                  keyboard only or using screen readers, it works 
                  beautifully for everyone. Like designing a building with ramps instead of adding them later.
                </p>

                <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/30">
                  <h4 className="font-semibold text-emerald-300 mb-2">Universal Design Patterns:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Keyboard navigation for every interaction</li>
                    <li>• Screen reader compatibility with rich context</li>
                    <li>• High contrast modes for visual accessibility</li>
                    <li>• Reduced motion options for vestibular sensitivity</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-pink-300">
                  Transparency Through Code
                </h3>
                <p className="text-gray-300 mb-4">
                  Our systems explain themselves. Like a strategy game 
                  showing damage calculations, users understand how data flows and decisions are made. Transparency builds trust, 
                  trust enables authentic collaboration.
                </p>

                <div className="bg-pink-900/20 p-4 rounded-lg border border-pink-500/30">
                  <code className="text-pink-300 text-sm">
                    {`// Self-documenting democratic systems
const democraticProcessor = {
  decision_logic: 'always_visible',
  data_flow: 'user_controlled',
  privacy_level: 'maximum_by_default',
  explanation: 'human_readable'
}`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Applications */}
        <section className="mb-16">
          <div className="holo-panel p-8 rounded-2xl mb-8 backdrop-blur-lg border border-yellow-500/30">
            <h2 className="text-4xl font-bold mb-6 text-yellow-400">
              🌟 Real-World Applications
            </h2>

            <div className="space-y-6">
              <div className="bg-slate-800/30 p-6 rounded-lg border border-blue-500/20">
                <h3 className="text-xl font-semibold mb-3 text-blue-300">
                  Portfolio Quantum Architecture
                </h3>
                <p className="text-gray-300">
                  This very site runs on quantum consciousness architecture - 
                  multiple animation layers process in parallel while philosophical principles guide every interaction. 
                  The glassmorphic panels you're reading create depth through mathematical precision rather than visual tricks.
                </p>
              </div>

              <div className="bg-slate-800/30 p-6 rounded-lg border border-purple-500/20">
                <h3 className="text-xl font-semibold mb-3 text-purple-300">
                  Troves & Coves: Consciousness-Driven Commerce
                </h3>
                <p className="text-gray-300">
                  E-commerce reimagined with consciousness-driven design - 
                  where AI assists discovery without manipulation, interfaces honor user agency, and the shopping experience 
                  feels like browsing a wise friend's curated collection rather than a corporate catalog.
                </p>
              </div>

              <div className="bg-slate-800/30 p-6 rounded-lg border border-green-500/20">
                <h3 className="text-xl font-semibold mb-3 text-green-300">
                  Gaming-Informed Performance Optimization
                </h3>
                <p className="text-gray-300">
                  25+ years of gaming research applied to web performance - 
                  fighting game frame data analysis ensures every animation hits its target, rhythm game precision guides 
                  interaction timing, and MMO optimization strategies manage complex system states.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="text-center">
          <div className="holo-panel p-8 rounded-2xl backdrop-blur-lg border border-cyan-500/30">
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">
              The Synthesis
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Technology becomes truly powerful when it serves human consciousness rather than replacing it. 
              Through quantum consciousness architecture, 
              philosophical programming principles, and 
              democratic technology values, we create digital 
              experiences that amplify human potential while preserving human dignity.
            </p>
            <p className="text-lg text-gray-400 mt-4">
              Every line of code is a choice. Every interaction pattern is a value statement. 
              Every system architecture is a philosophical position about how humans and technology should relate.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}