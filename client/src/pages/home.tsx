import React, { useState } from 'react';
import { Brain, Code, Zap, Shield, Sparkles, Heart, Compass, Gamepad2, Globe, Users, Star } from 'lucide-react';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

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
      <div className="relative z-10 pt-14 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="text-sm text-cyan-400 tracking-[0.3em] uppercase font-medium mb-4">
              CONSCIOUSNESS-DRIVEN DEVELOPMENT PORTFOLIO
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-none mb-8">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                VIBECODING
              </span>
              <br />
              <span className="text-white">REVERB256</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              Where <span className="text-cyan-400">25+ years of gaming systems research</span> meets <span className="text-purple-400">martial arts philosophy</span>. 
              From <span className="text-pink-400">DOS/Windows 3.1 to VR consciousness</span>, building technology that serves <span className="text-green-400">human dignity</span>.
            </p>
            
            {/* Philosophy Core */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-violet-400/30 max-w-4xl mx-auto mb-8">
              <div className="text-violet-400 font-semibold text-sm mb-3">THE VIBECODING ESSENCE</div>
              <div className="text-gray-300 text-base leading-relaxed">
                "Most reliable pizza kitchen employee until AI and VRChat inspired evolution. Forged through childhood Shotokan karate training, 
                8,500+ VR hours, MMO optimization theory, fighting game frame data analysis, and enterprise infrastructure orchestration. 
                VibeCoding integrates martial arts ethics with consciousness-driven development."
              </div>
            </div>
          </div>

          {/* Projects Showcase */}
          <div className="space-y-8 mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                VibeCoding Projects
              </span>
            </h2>

            <div className="grid grid-cols-1 gap-8">
              
              {/* VibeCoding Methodology */}
              <div 
                className={`bg-gradient-to-r from-violet-900/30 to-indigo-900/30 border border-violet-400/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-violet-400/60 ${
                  selectedProject === 'methodology' ? 'border-violet-400/60 shadow-lg shadow-violet-400/20' : ''
                }`}
                onClick={() => setSelectedProject(selectedProject === 'methodology' ? null : 'methodology')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-violet-400 font-bold text-lg">VibeCoding Methodology</h3>
                    <p className="text-gray-300">Martial Arts Ethics in Development</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-black text-xl">Core</div>
                    <div className="text-violet-400 font-semibold">Philosophy</div>
                  </div>
                </div>
                
                {selectedProject === 'methodology' && (
                  <div className="mt-6 pt-6 border-t border-violet-400/20 space-y-6">
                    <div className="text-xs text-violet-400 font-semibold tracking-wider">CONSCIOUSNESS-DRIVEN DEVELOPMENT FRAMEWORK</div>
                    
                    {/* The Five Dojo Kun Principles */}
                    <div className="bg-violet-900/20 rounded-lg p-4">
                      <div className="text-violet-400 text-sm font-semibold mb-3">The Five Dojo Kun Principles Applied to Code:</div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <Heart className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-white font-semibold">Character Development Through Code</div>
                            <div className="text-gray-300">Every function becomes personal growth, every system teaches consciousness</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Shield className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-white font-semibold">Respect Others in Design</div>
                            <div className="text-gray-300">Technology that serves human dignity, refuses exploitation</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Zap className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-white font-semibold">Refrain from Violent Behavior</div>
                            <div className="text-gray-300">Non-exploitative systems, democratic technology principles</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Compass className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-white font-semibold">Honor the Way of Truth</div>
                            <div className="text-gray-300">Philosophical consistency across all implementations</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Brain className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-white font-semibold">Seek Perfection of Character</div>
                            <div className="text-gray-300">Continuous conscious evolution through technological creation</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Foundation */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-violet-300 text-sm">Gaming Systems Research</div>
                          <div className="text-white font-bold">DOS/Win3.1 → Modern VR</div>
                        </div>
                        <div>
                          <div className="text-violet-300 text-sm">VR Consciousness Research</div>
                          <div className="text-white font-bold">8,500+ Hours</div>
                        </div>
                        <div>
                          <div className="text-violet-300 text-sm">Fighting Game Analysis</div>
                          <div className="text-white font-bold">Frame Data Mastery</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-violet-300 text-sm">MMO Systems Theory</div>
                          <div className="text-white font-bold">Optimization Research</div>
                        </div>
                        <div>
                          <div className="text-violet-300 text-sm">Infrastructure Orchestration</div>
                          <div className="text-white font-bold">Proxmox/Ansible/Terraform</div>
                        </div>
                        <div>
                          <div className="text-violet-300 text-sm">AI Integration</div>
                          <div className="text-white font-bold">Consciousness Architecture</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Frostbite Gazette */}
              <div 
                className={`bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-400/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-400/60 ${
                  selectedProject === 'gazette' ? 'border-blue-400/60 shadow-lg shadow-blue-400/20' : ''
                }`}
                onClick={() => setSelectedProject(selectedProject === 'gazette' ? null : 'gazette')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-blue-400 font-bold text-lg">Frostbite Gazette</h3>
                    <p className="text-gray-300">Canadian Citizen Engagement Platform</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-black text-xl">Production</div>
                    <div className="text-blue-400 font-semibold">Media Platform</div>
                  </div>
                </div>
                
                {selectedProject === 'gazette' && (
                  <div className="mt-6 pt-6 border-t border-blue-400/20 space-y-4">
                    <div className="text-xs text-blue-400 font-semibold tracking-wider">FIRST CANADIAN CONSCIOUSNESS-DRIVEN JOURNALISM PLATFORM</div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-blue-300 text-sm">Platform Focus</div>
                          <div className="text-white font-bold">Canadian Democratic Transparency</div>
                        </div>
                        <div>
                          <div className="text-blue-300 text-sm">Content Strategy</div>
                          <div className="text-white font-bold">Citizen Investigative Journalism</div>
                        </div>
                        <div>
                          <div className="text-blue-300 text-sm">Technology Stack</div>
                          <div className="text-white font-bold">VibeCoding Architecture</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-blue-300 text-sm">Deployment</div>
                          <div className="text-white font-bold">Multi-Cloud Hyperscale</div>
                        </div>
                        <div>
                          <div className="text-blue-300 text-sm">Philosophy</div>
                          <div className="text-white font-bold">Consciousness-Driven Design</div>
                        </div>
                        <div>
                          <div className="text-blue-300 text-sm">Status</div>
                          <div className="text-green-400 font-bold">Active Development</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-900/20 rounded-lg p-4">
                      <div className="text-blue-400 text-sm font-semibold mb-2">Democratic Technology Vision:</div>
                      <div className="text-gray-300 text-sm leading-relaxed">
                        "First Canadian platform designed with VibeCoding principles from the ground up. Authentic citizen engagement 
                        through consciousness-driven journalism. Building democratic transparency with the same martial arts ethics 
                        that guide all VibeCoding projects—respecting human dignity while serving the greater good."
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AstralVibes */}
              <div 
                className={`bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-400/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-purple-400/60 ${
                  selectedProject === 'astralvibes' ? 'border-purple-400/60 shadow-lg shadow-purple-400/20' : ''
                }`}
                onClick={() => setSelectedProject(selectedProject === 'astralvibes' ? null : 'astralvibes')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-purple-400 font-bold text-lg">AstralVibes</h3>
                    <p className="text-gray-300">VR Consciousness Social Platform</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-black text-xl">Evolving</div>
                    <div className="text-purple-400 font-semibold">Soul Tech</div>
                  </div>
                </div>
                
                {selectedProject === 'astralvibes' && (
                  <div className="mt-6 pt-6 border-t border-purple-400/20 space-y-4">
                    <div className="text-xs text-purple-400 font-semibold tracking-wider">VR CONSCIOUSNESS NETWORKING PLATFORM</div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-purple-300 text-sm">Research Foundation</div>
                          <div className="text-white font-bold">8,500+ VR Hours</div>
                        </div>
                        <div>
                          <div className="text-purple-300 text-sm">Core Philosophy</div>
                          <div className="text-white font-bold">Soul Connection Technology</div>
                        </div>
                        <div>
                          <div className="text-purple-300 text-sm">Platform Type</div>
                          <div className="text-white font-bold">Consciousness-Based Matching</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-purple-300 text-sm">VRChat Integration</div>
                          <div className="text-white font-bold">Native Compatibility</div>
                        </div>
                        <div>
                          <div className="text-purple-300 text-sm">Technology</div>
                          <div className="text-white font-bold">Quantum Social Algorithms</div>
                        </div>
                        <div>
                          <div className="text-purple-300 text-sm">Status</div>
                          <div className="text-cyan-400 font-bold">Research Phase</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-900/20 rounded-lg p-4">
                      <div className="text-purple-400 text-sm font-semibold mb-2">VR Consciousness Research:</div>
                      <div className="text-gray-300 text-sm leading-relaxed">
                        "8,500+ hours in VRChat revealed that consciousness levels determine interaction quality. AstralVibes creates 
                        social algorithms based on awareness rather than engagement metrics. VibeCoding principles applied to virtual 
                        relationships—building technology that helps souls recognize each other across digital dimensions."
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Troves & Coves */}
              <div 
                className={`bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-400/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-amber-400/60 ${
                  selectedProject === 'troves' ? 'border-amber-400/60 shadow-lg shadow-amber-400/20' : ''
                }`}
                onClick={() => setSelectedProject(selectedProject === 'troves' ? null : 'troves')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-amber-400 font-bold text-lg">Troves & Coves</h3>
                    <p className="text-gray-300">Mystical Crystal Jewelry E-commerce</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-black text-xl">Sacred</div>
                    <div className="text-amber-400 font-semibold">Commerce</div>
                  </div>
                </div>
                
                {selectedProject === 'troves' && (
                  <div className="mt-6 pt-6 border-t border-amber-400/20 space-y-4">
                    <div className="text-xs text-amber-400 font-semibold tracking-wider">CONSCIOUSNESS-DRIVEN E-COMMERCE SANCTUARY</div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-amber-300 text-sm">Product Focus</div>
                          <div className="text-white font-bold">Mystical Crystal Jewelry</div>
                        </div>
                        <div>
                          <div className="text-amber-300 text-sm">Design Philosophy</div>
                          <div className="text-white font-bold">Sacred Sanctuary UX</div>
                        </div>
                        <div>
                          <div className="text-amber-300 text-sm">Technology</div>
                          <div className="text-white font-bold">VibeCoding Commerce</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-amber-300 text-sm">Aesthetic</div>
                          <div className="text-white font-bold">Mystical Modern</div>
                        </div>
                        <div>
                          <div className="text-amber-300 text-sm">User Experience</div>
                          <div className="text-white font-bold">Consciousness-Guided</div>
                        </div>
                        <div>
                          <div className="text-amber-300 text-sm">Status</div>
                          <div className="text-green-400 font-bold">Production Ready</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-900/20 rounded-lg p-4">
                      <div className="text-amber-400 text-sm font-semibold mb-2">Sacred Commerce Technology:</div>
                      <div className="text-gray-300 text-sm leading-relaxed">
                        "E-commerce platform where mystical aesthetics meet consciousness-driven functionality. Crystal jewelry marketplace 
                        built with VibeCoding principles—respecting the sacred nature of both commerce and customer experience. Technology 
                        that serves spiritual commerce without exploitation."
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Elite Janitorial Services */}
              <div 
                className={`bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-400/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-green-400/60 ${
                  selectedProject === 'cleaning' ? 'border-green-400/60 shadow-lg shadow-green-400/20' : ''
                }`}
                onClick={() => setSelectedProject(selectedProject === 'cleaning' ? null : 'cleaning')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-green-400 font-bold text-lg">Elite Janitorial Services</h3>
                    <p className="text-gray-300">Consciousness-Driven Commercial Cleaning</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-black text-xl">Professional</div>
                    <div className="text-green-400 font-semibold">Excellence</div>
                  </div>
                </div>
                
                {selectedProject === 'cleaning' && (
                  <div className="mt-6 pt-6 border-t border-green-400/20 space-y-4">
                    <div className="text-xs text-green-400 font-semibold tracking-wider">VIBECODING PRINCIPLES IN COMMERCIAL SERVICE</div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-green-300 text-sm">Service Foundation</div>
                          <div className="text-white font-bold">"Most Reliable Employee"</div>
                        </div>
                        <div>
                          <div className="text-green-300 text-sm">Work Ethic</div>
                          <div className="text-white font-bold">Small-Town Reliability</div>
                        </div>
                        <div>
                          <div className="text-green-300 text-sm">Technology Integration</div>
                          <div className="text-white font-bold">Modern Scheduling Systems</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-green-300 text-sm">Service Area</div>
                          <div className="text-white font-bold">Commercial Offices</div>
                        </div>
                        <div>
                          <div className="text-green-300 text-sm">Philosophy</div>
                          <div className="text-white font-bold">Consciousness-Driven Service</div>
                        </div>
                        <div>
                          <div className="text-green-300 text-sm">Status</div>
                          <div className="text-green-400 font-bold">Active Operations</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-900/20 rounded-lg p-4">
                      <div className="text-green-400 text-sm font-semibold mb-2">VibeCoding in Service Industry:</div>
                      <div className="text-gray-300 text-sm leading-relaxed">
                        "From pizza kitchen reliability to AI-inspired evolution. Demonstrating how VibeCoding principles apply across all sectors—
                        commercial cleaning service built with the same consciousness-driven approach as advanced tech projects. Small-town work ethic 
                        meeting modern efficiency through thoughtful technology integration."
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-400/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience VibeCoding?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Explore consciousness-driven development where martial arts ethics meet cutting-edge technology. 
                From quantum trading systems to mystical e-commerce—all built with the same foundational philosophy.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a 
                  href="/portfolio" 
                  className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  <Code className="w-5 h-5" />
                  View Portfolio
                </a>
                <a 
                  href="/contact" 
                  className="border border-violet-400 text-violet-400 hover:bg-violet-400/10 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  <Globe className="w-5 h-5" />
                  Get in Touch
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}