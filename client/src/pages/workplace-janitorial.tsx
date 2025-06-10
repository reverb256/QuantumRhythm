import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Navigation from '@/components/Navigation';
import { SmartTooltip } from '@/components/TooltipSystem';
import { ExternalLink, Github, Sparkles, Shield } from 'lucide-react';

export default function WorkplaceJanitorialPage() {
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
              <span className="text-purple-300 text-sm font-medium tracking-wide">COMMERCIAL CLEANING PLATFORM</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-sky-300 via-cyan-400 to-lime-400 bg-clip-text text-transparent">
              WORKPLACE
            </span>
            <br />
            <span className="bg-gradient-to-r from-lime-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
              JANITORIAL
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-8">
            AI-enhanced commercial cleaning platform with WCAG AAA compliance, glassmorphism design, 
            and authentic business implementation for Winnipeg's premier cleaning service.
          </p>

          <div className="flex gap-4 justify-center">
            <a href="https://github.com/reverb256/Local-Cleaning-Service" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-gray-600/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-500/60 px-6 py-3 rounded-lg font-medium transition-all duration-300">
                View GitHub
              </Button>
            </a>
            <Button className="bg-gradient-to-r from-sky-500 to-lime-600 hover:from-sky-400 hover:to-lime-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300">
              Live Platform
            </Button>
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="relative pb-20 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 overflow-hidden">
            
            {/* Technical Excellence */}
            <div className="p-8 border-b border-gray-700/30">
              <h2 className="text-3xl font-bold text-white mb-6">Technical Excellence</h2>
              <div className="grid md:grid-cols-2 gap-8">
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Accessibility Leadership</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• WCAG AAA compliance with 21:1 contrast ratios</p>
                    <p>• Complete keyboard navigation and screen reader optimization</p>
                    <p>• Semantic HTML with comprehensive ARIA labeling</p>
                    <p>• Motion sensitivity and high contrast mode support</p>
                    <p>• Voice control and switch navigation compatibility</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">AI Orchestration</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• RAG system with authentic business knowledge</p>
                    <p>• Local AI models for cost-effective processing</p>
                    <p>• Intelligent rate limiting and security controls</p>
                    <p>• Real-time content management through admin panel</p>
                    <p>• Natural language to structured commands</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Business Implementation */}
            <div className="p-8 border-b border-gray-700/30">
              <h2 className="text-3xl font-bold text-white mb-6">Authentic Business Integration</h2>
              <div className="grid md:grid-cols-3 gap-6">
                
                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Service Excellence</h3>
                  <p className="text-gray-400">30-minute guarantee, WCB coverage, criminal background checks for authentic Winnipeg commercial cleaning.</p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Design System</h3>
                  <p className="text-gray-400">Glassmorphism UI with sky blue (#55C7F7) and lime green (#A4D65E) from actual business branding.</p>
                </div>

                <div className="bg-black/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Contact Integration</h3>
                  <p className="text-gray-400">Verified (204) 415-2910 and info@workplacejanitorial.ca with Greater Winnipeg Area service mapping.</p>
                </div>

              </div>
            </div>

            {/* VibeCoding Philosophy */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Consciousness Integration</h2>
              <div className="grid md:grid-cols-2 gap-8">
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Character Through Code</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• Seeking perfection through TypeScript strict mode</p>
                    <p>• Faithfulness to users via accessibility excellence</p>
                    <p>• Business authenticity over generic templates</p>
                    <p>• Respectful design honoring human dignity</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">AI-Human Partnership</h3>
                  <div className="space-y-3 text-gray-400">
                    <p>• AI orchestration serving human business needs</p>
                    <p>• Local business representation preserving identity</p>
                    <p>• Technology enhancing without replacing human touch</p>
                    <p>• Conscious development respecting community values</p>
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