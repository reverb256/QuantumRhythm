import React from 'react';
import { Mail, Github, Twitter, Globe } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
        
        {/* Neural network visualization */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="text-sm text-cyan-400 tracking-[0.3em] uppercase font-medium mb-4">
              GET IN TOUCH
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-none bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
              CONNECT<br />
              <span className="text-white">WITH REVERB</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Ready to explore <span className="text-cyan-400">consciousness-driven development</span>? 
              Let's discuss <span className="text-purple-400">VibeCoding projects</span> and <span className="text-pink-400">quantum possibilities</span>.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Professional Contact */}
            <div className="bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-400/30 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <Mail className="w-8 h-8 text-cyan-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">Professional Inquiries</h3>
                  <p className="text-gray-400">VibeCoding & Development Projects</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-cyan-400 text-sm font-semibold">Email</div>
                  <div className="text-white">contact@reverb256.ca</div>
                </div>
                <div>
                  <div className="text-cyan-400 text-sm font-semibold">Response Time</div>
                  <div className="text-gray-300">24-48 hours</div>
                </div>
                <div>
                  <div className="text-cyan-400 text-sm font-semibold">Best For</div>
                  <div className="text-gray-300">Project collaborations, consulting, technical discussions</div>
                </div>
              </div>
            </div>

            {/* Social & Community */}
            <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-400/30 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <Globe className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">Community & Social</h3>
                  <p className="text-gray-400">VRChat, Gaming & Philosophy</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-purple-400 text-sm font-semibold">VRChat</div>
                  <div className="text-white">reverb256</div>
                </div>
                <div>
                  <div className="text-purple-400 text-sm font-semibold">Focus</div>
                  <div className="text-gray-300">Consciousness exploration, soul connections</div>
                </div>
                <div>
                  <div className="text-purple-400 text-sm font-semibold">Best For</div>
                  <div className="text-gray-300">VR experiences, philosophical discussions, creative collaboration</div>
                </div>
              </div>
            </div>
          </div>

          {/* Development Links */}
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700/30">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Development Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <a 
                href="https://github.com/reverb256" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-600/30 hover:border-gray-500/60 transition-all duration-300 group"
              >
                <Github className="w-6 h-6 text-gray-400 group-hover:text-white" />
                <div>
                  <div className="text-white font-semibold">GitHub</div>
                  <div className="text-gray-400 text-sm">Open source projects</div>
                </div>
              </a>

              <a 
                href="https://portfolio.reverb256.ca" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-600/30 hover:border-gray-500/60 transition-all duration-300 group"
              >
                <Globe className="w-6 h-6 text-gray-400 group-hover:text-white" />
                <div>
                  <div className="text-white font-semibold">Portfolio</div>
                  <div className="text-gray-400 text-sm">VibeCoding showcase</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-600/30">
                <Twitter className="w-6 h-6 text-gray-400" />
                <div>
                  <div className="text-white font-semibold">Social</div>
                  <div className="text-gray-400 text-sm">Coming soon</div>
                </div>
              </div>
            </div>
          </div>

          {/* Philosophy Quote */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-400/30 rounded-xl p-8">
              <blockquote className="text-xl text-gray-300 leading-relaxed mb-4">
                "In the intersection of consciousness and code, we find the quantum leap from programming to awakening."
              </blockquote>
              <div className="text-violet-400 font-semibold">— VibeCoding Philosophy</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}