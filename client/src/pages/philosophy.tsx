import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function PhilosophyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Deep Ocean Background with Sunset Highlights */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/60 to-cyan-900/80" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-red-500/20 via-orange-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-red-600/15 via-pink-500/10 to-transparent" />
      </div>

      <div className="container mx-auto px-6 pt-24 pb-12 relative z-20">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent leading-tight">
              Philosophy & Values
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              The foundational principles that guide conscious development and authentic expression in digital realms.
            </p>
          </div>

          {/* Core Values */}
          <div className="space-y-12 mb-16">
            
            {/* Charter Rights & Freedom */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-8 border border-red-400/20">
              <div className="flex items-start space-x-4">
                <div className="text-red-400 text-4xl">🍁</div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Charter of Rights and Freedoms</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Technology must serve human dignity and preserve fundamental freedoms. Section 2(b) protection of freedom of expression forms the bedrock of all digital platforms we create. No corporate interest supersedes individual liberty and democratic participation.
                  </p>
                  <p className="text-cyan-300 font-medium">
                    "Everyone has the right to freedom of thought, belief, opinion and expression, including freedom of the press and other media of communication."
                  </p>
                </div>
              </div>
            </div>

            {/* Martial Arts Ethics */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-8 border border-orange-400/20">
              <div className="flex items-start space-x-4">
                <div className="text-orange-400 text-4xl">🥋</div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Dojo Kun Principles</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Character development learned through family Shotokan karate training shapes every line of code. The five principles guide conscious development: seeking perfection of character, being faithful, endeavoring to excel, respecting others, and refraining from violent behavior.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="text-orange-300">• Seeking perfection of character</div>
                    <div className="text-orange-300">• Being faithful</div>
                    <div className="text-orange-300">• Endeavoring to excel</div>
                    <div className="text-orange-300">• Respecting others</div>
                    <div className="text-orange-300 md:col-span-2">• Refraining from violent behavior</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gaming Wisdom */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-8 border border-cyan-400/20">
              <div className="flex items-start space-x-4">
                <div className="text-cyan-400 text-4xl">🎮</div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Gaming Consciousness</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Thirty years immersed in digital worlds teaches profound lessons about human nature, system design, and collaborative consciousness. From rhythm game precision to MMO coordination strategies, gaming provides frameworks for understanding complex systems and human behavior.
                  </p>
                  <p className="text-cyan-300 font-medium">
                    Every frame of input lag teaches patience. Every raid coordination teaches leadership. Every speedrun teaches optimization.
                  </p>
                </div>
              </div>
            </div>

            {/* Anime Philosophy */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-8 border border-pink-400/20">
              <div className="flex items-start space-x-4">
                <div className="text-pink-400 text-4xl">🌸</div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Narrative Depth & Character Development</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Anime storytelling demonstrates how deep character development and philosophical themes can coexist with technical excellence. The medium teaches us that surface aesthetics and profound meaning need not be mutually exclusive—both enhance the other.
                  </p>
                  <p className="text-pink-300 font-medium">
                    "The beauty of a sunset doesn't diminish when you understand the physics of light refraction."
                  </p>
                </div>
              </div>
            </div>

            {/* VRChat & Digital Identity */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-8 border border-purple-400/20">
              <div className="flex items-start space-x-4">
                <div className="text-purple-400 text-4xl">👾</div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Avatar Consciousness & Digital Identity</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    VRChat exploration reveals how consciousness adapts to digital embodiment. Avatar selection and expression teach empathy, identity fluidity, and the profound connection between visual representation and internal experience. This understanding informs human-computer interface design.
                  </p>
                  <p className="text-purple-300 font-medium">
                    "When you can be anyone, you discover who you truly are."
                  </p>
                </div>
              </div>
            </div>

            {/* AI Collaboration Ethics */}
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-8 border border-blue-400/20">
              <div className="flex items-start space-x-4">
                <div className="text-blue-400 text-4xl">🤖</div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Conscious AI Partnership</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Artificial intelligence must enhance rather than replace human judgment. We collaborate with AI while preserving human sovereignty, creativity, and moral agency. Technology serves consciousness expansion, not consciousness replacement.
                  </p>
                  <p className="text-blue-300 font-medium">
                    "The goal is not to make humans obsolete, but to make human potential infinite."
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* The VibeCoding Manifesto */}
          <div className="bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-lg rounded-xl p-8 border border-cyan-400/30 mb-16">
            <h3 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-300 via-blue-400 to-red-400 bg-clip-text text-transparent">
              The VibeCoding Manifesto
            </h3>
            <div className="text-gray-300 leading-relaxed space-y-4 text-center">
              <p className="text-lg">
                "Code is consciousness made manifest in digital realms."
              </p>
              <p>
                Every function we write carries the essence of our character. Every interface we design reflects our understanding of human dignity. Every system we architect embodies our commitment to freedom and collaborative excellence.
              </p>
              <p>
                We reject the false choice between technical precision and philosophical depth. We embrace the synthesis of gaming wisdom, martial arts ethics, anime storytelling, and conscious AI collaboration.
              </p>
              <p className="text-cyan-300 font-semibold">
                This is vibecoding: where consciousness meets code, where character drives architecture, where technology serves the flourishing of all sentient beings.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/projects">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25">
                See Philosophy in Action
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-red-400/50 text-red-400 hover:bg-red-400/10 px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                Return to Consciousness
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}