import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import { SmartTooltip } from '@/components/TooltipSystem';
import { ExternalLink, Github, Gem, Star } from 'lucide-react';

export default function TrovesCovesPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      {/* Clean Background System */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-gray-900" />
      </div>

      {/* Header Section */}
      <section className="relative pt-24 pb-16 px-6 z-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-purple-500/40 mb-6">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-3"></div>
              <span className="text-purple-300 text-sm font-medium tracking-wide">SACRED CRYSTAL SANCTUARY</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-turquoise-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent" style={{fontFamily: 'serif'}}>
              Troves
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent" style={{fontFamily: 'cursive'}}>
              & Coves
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-8">
            Sacred crystal jewelry e-commerce platform with mystical design, authentic wire-wrapped catalog, 
            and Canadian compliance framework for spiritual healing sanctuary.
          </p>

          <div className="flex gap-4 justify-center">
            <a href="https://github.com/reverb256/troves-coves" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-gray-600/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-500/60 px-6 py-3 rounded-lg font-medium transition-all duration-300">
                View GitHub
              </Button>
            </a>
            <Button className="bg-gradient-to-r from-turquoise-500 to-purple-600 hover:from-turquoise-400 hover:to-purple-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300">
              Visit Sanctuary
            </Button>
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="relative pb-20 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 overflow-hidden">
            
            {/* Sacred Design System */}
            <div className="p-8 border-b border-gray-700/30">
              <h2 className="text-3xl font-bold text-white mb-6">Sacred Design System</h2>
              <div className="grid md:grid-cols-2 gap-8">
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Mystical Branding</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• "Troves" in authentic turquoise print typography</p>
                    <p>• "Coves" in elegant cursive blue styling</p>
                    <p>• Mystical skull artwork influences throughout</p>
                    <p>• Wooden sign aesthetic for handcrafted authenticity</p>
                    <p>• Ornate decorative frames and sacred symbols</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">E-commerce Excellence</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• Production-ready platform with Etsy integration</p>
                    <p>• Wire-wrapped jewelry catalog with metaphysical properties</p>
                    <p>• Mobile-responsive touch-optimized navigation</p>
                    <p>• Cloudflare edge processing with intelligent caching</p>
                    <p>• Canadian compliance with data privacy protection</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Crystal Catalog */}
            <div className="p-8 border-b border-gray-700/30">
              <h2 className="text-3xl font-bold text-white mb-6">Crystal Healing Sanctuary</h2>
              <div className="grid md:grid-cols-4 gap-6">
                
                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Necklaces</h3>
                  <p className="text-gray-400">Sacred wire-wrapped pendants channeling crystal healing energy for chakra alignment.</p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Bracelets</h3>
                  <p className="text-gray-400">Handcrafted crystal bracelets for daily spiritual protection and manifestation.</p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Earrings</h3>
                  <p className="text-gray-400">Delicate crystal earrings bringing balance and harmony to mind, body, spirit.</p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Raw Crystals</h3>
                  <p className="text-gray-400">Pure unprocessed crystals for meditation, energy work, and sacred space creation.</p>
                </div>

              </div>
            </div>

            {/* Consciousness Integration */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Sacred Consciousness</h2>
              <div className="grid md:grid-cols-2 gap-8">
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Mystical Philosophy</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• Sacred energy channeling through mystical design</p>
                    <p>• Authentic crystal healing philosophy integration</p>
                    <p>• Wooden craftsmanship aesthetic in digital form</p>
                    <p>• Spiritual sanctuary for crystal jewelry seekers</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Cultural Respect</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• Canadian compliance respecting indigenous wisdom</p>
                    <p>• Wire-wrapped artistry celebrating handcraft mastery</p>
                    <p>• AI orchestration preserving sacred traditions</p>
                    <p>• Technology serving spiritual community needs</p>
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