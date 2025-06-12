import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
export default function FrostbiteGazettePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      
      {/* Clean Background System */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-gray-900" />
      </div>

      {/* Header Section */}
      <section className="relative pt-16 pb-16 px-6 z-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-purple-500/40 mb-6">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-3"></div>
              <span className="text-purple-300 text-sm font-medium tracking-wide">CITIZEN ENGAGEMENT PLATFORM</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-ice-blue-300 via-cyan-400 to-white bg-clip-text text-transparent">
              FROSTBITE
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-gray-200 to-ice-blue-300 bg-clip-text text-transparent">
              GAZETTE
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-8">
            Le Premier Plateforme Canadienne d'Engagement Citoyen - Gel et Blanche design system 
            fostering civic participation through bilingual democratic dialogue.
          </p>

          <div className="flex gap-4 justify-center">
            <a href="https://github.com/reverb256/frostbite-gazette" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-gray-600/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-500/60 px-6 py-3 rounded-lg font-medium transition-all duration-300">
                View GitHub
              </Button>
            </a>
            <Button className="bg-gradient-to-r from-ice-blue-500 to-white text-slate-900 hover:from-ice-blue-400 hover:to-gray-100 px-8 py-3 rounded-lg font-medium transition-all duration-300">
              Access Platform
            </Button>
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="relative pb-20 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 overflow-hidden">
            
            {/* Democratic Innovation */}
            <div className="p-8 border-b border-gray-700/30">
              <h2 className="text-3xl font-bold text-white mb-6">Democratic Innovation</h2>
              <div className="grid md:grid-cols-2 gap-8">
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Bilingual Engagement</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• French-English bilingual interface respecting linguistic rights</p>
                    <p>• "Gel et Blanche" ice-blue and white design philosophy</p>
                    <p>• Canadian Charter of Rights compliance framework</p>
                    <p>• Indigenous consultation integration protocols</p>
                    <p>• Municipal to federal civic participation pathways</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Civic Technology</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• Real-time democratic dialogue facilitation</p>
                    <p>• AI-moderated community discussion forums</p>
                    <p>• Transparent governance tracking dashboards</p>
                    <p>• Citizen petition and proposal submission system</p>
                    <p>• Electoral information and candidate comparison tools</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Engagement Features */}
            <div className="p-8 border-b border-gray-700/30">
              <h2 className="text-3xl font-bold text-white mb-6">Civic Participation Tools</h2>
              <div className="grid md:grid-cols-3 gap-6">
                
                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Town Halls</h3>
                  <p className="text-gray-400">Virtual town hall meetings with real-time translation and accessibility features.</p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Policy Tracker</h3>
                  <p className="text-gray-400">Transparent policy development tracking from proposal to implementation.</p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Citizen Voice</h3>
                  <p className="text-gray-400">Direct communication channels between citizens and elected representatives.</p>
                </div>

              </div>
            </div>

            {/* Cultural Integration */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Cultural Consciousness</h2>
              <div className="grid md:grid-cols-2 gap-8">
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Canadian Values</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• Charter of Rights and Freedoms digital implementation</p>
                    <p>• Multiculturalism celebration through inclusive design</p>
                    <p>• Truth and Reconciliation principles integration</p>
                    <p>• French linguistic rights preserved and honored</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Democratic Integrity</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• Transparent algorithmic governance with public audits</p>
                    <p>• Privacy-first citizen data protection protocols</p>
                    <p>• Open-source democratic technology principles</p>
                    <p>• Community-driven platform governance structure</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Navigation */}
          <div className="text-center mt-16">
            <Link href="/projects">
              <Button variant="outline" className="border-purple-400/50 text-purple-300 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:border-purple-400/80 px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-purple-500/20">
                Back to Projects
              </Button>
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}