import { useEffect, useState } from "react";

export default function HeroSection() {
  const [rhythmBars, setRhythmBars] = useState([20, 30, 25, 35, 20]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRhythmBars(prev => prev.map(() => Math.random() * 30 + 20));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPhilosophy = () => {
    const element = document.getElementById('philosophy');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Prismatic Cybernetic Sky Background */}
      <div className="absolute inset-0">
        {/* Base deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-indigo-950/60 to-purple-950/50" />
        
        {/* Cybernetic sky with holographic elements */}
        <div 
          className="absolute inset-0 opacity-65"
          style={{
            backgroundImage: `url('/attached_assets/image_1749437089124.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.4) contrast(1.3) saturate(1.2)'
          }}
        />
        
        {/* Prismatic light refractions */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-radial from-cyan-400/40 via-blue-400/20 to-transparent blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-gradient-radial from-violet-400/30 via-purple-400/15 to-transparent blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-gradient-radial from-pink-400/25 via-red-400/10 to-transparent blur-xl animate-pulse delay-2000"></div>
        </div>
        
        {/* Holographic portal overlay */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            backgroundImage: `url('/attached_assets/image_1749437115515.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Abstract blue data streams */}
        <div 
          className="absolute top-0 right-0 w-full h-full opacity-30"
          style={{
            backgroundImage: `url('/attached_assets/image_1749437226380.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'soft-light'
          }}
        />
        
        {/* Prismatic glass overlay with particle effects */}
        <div className="absolute inset-0 backdrop-blur-[3px] bg-gradient-to-b from-transparent via-blue-950/15 to-blue-950/30 particle-bg" />
      </div>
      
      {/* RPG-Style HUD System */}
      {/* Corner HUD Elements */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-cyan-400/60 z-30"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-cyan-400/60 z-30"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-cyan-400/60 z-30"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-cyan-400/60 z-30"></div>

      {/* Floating Holographic Elements */}
      <div className="absolute top-32 left-1/4 w-8 h-8 bg-cyan-400/30 rounded-full animate-pulse z-15"></div>
      <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-blue-400/40 rounded-full animate-bounce z-15" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-purple-400/25 rounded-full animate-pulse z-15" style={{ animationDelay: '2s' }}></div>

      {/* Scanning Lines */}
      <div className="absolute inset-0 pointer-events-none z-15">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Top Status Bar - Prismatic Glass */}
      <div className="absolute top-0 left-0 right-0 h-16 md:h-20 prismatic-glass border-b border-cyan-400/40 z-20 gacha-shine">
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <i className="fas fa-user-astronaut text-white text-sm md:text-xl"></i>
            </div>
            <div>
              <div className="text-cyan-300 text-xs md:text-sm font-medium">Digital Architect</div>
              <div className="text-white text-sm md:text-lg font-bold">reverb256</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="text-right">
              <div className="text-cyan-300 text-xs md:text-sm">System Status</div>
              <div className="text-green-400 text-sm md:text-lg font-bold flex items-center">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full mr-1 md:mr-2 animate-pulse"></div>
                <span className="hidden sm:inline">ONLINE</span>
                <span className="sm:hidden">ON</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-cyan-300 text-xs md:text-sm">Neural Link</div>
              <div className="text-cyan-400 text-sm md:text-lg font-bold">100%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side Panel - Prismatic Glass */}
      <div className="hidden xl:block absolute left-0 top-16 md:top-20 bottom-16 md:bottom-20 w-64 xl:w-80 prismatic-glass border-r border-cyan-400/30 z-20 spectrum-border">
        <div className="p-6 h-full flex flex-col">
          <div className="mb-6">
            <h3 className="text-cyan-300 text-lg font-bold mb-4 flex items-center">
              <i className="fas fa-chart-line mr-3"></i>Tech Arsenal
            </h3>
            <div className="space-y-3">
              {['React/TypeScript', 'AI/ML Systems', 'Cybernetic Architecture', 'VR Development'].map((skill, index) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="text-white text-sm">{skill}</span>
                  <div className="w-20 h-2 bg-blue-900/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${85 + index * 5}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-cyan-300 text-lg font-bold mb-4 flex items-center">
              <i className="fas fa-microchip mr-3"></i>System Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Location</span>
                <span className="text-cyan-400">Canada</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Specialization</span>
                <span className="text-cyan-400">VibeCoding</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Philosophy</span>
                <span className="text-cyan-400">Human-AI Unity</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-cyan-300 text-lg font-bold mb-4 flex items-center">
              <i className="fas fa-satellite-dish mr-3"></i>Neural Feed
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center text-green-400">
                <div className="w-1 h-1 bg-green-400 rounded-full mr-2"></div>
                Quantum processing cores: Active
              </div>
              <div className="flex items-center text-blue-400">
                <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                VRChat connectivity: Established
              </div>
              <div className="flex items-center text-purple-400">
                <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                Philosophy engine: Analyzing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel - Prismatic Glass */}
      <div className="hidden xl:block absolute right-0 top-16 md:top-20 bottom-16 md:bottom-20 w-64 xl:w-80 prismatic-glass border-l border-cyan-400/30 z-20 spectrum-border">
        <div className="p-6 h-full flex flex-col">
          <div className="mb-6">
            <h3 className="text-cyan-300 text-lg font-bold mb-4 flex items-center">
              <i className="fas fa-code mr-3"></i>Active Projects
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Portfolio Matrix', progress: 95, status: 'Deploying' },
                { name: 'AI Ethics Framework', progress: 78, status: 'In Progress' },
                { name: 'VR Experience Lab', progress: 60, status: 'Development' }
              ].map((project, index) => (
                <div key={project.name} className="p-3 bg-blue-900/30 rounded-lg border border-cyan-400/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">{project.name}</span>
                    <span className="text-cyan-400 text-xs">{project.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-blue-900/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{project.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-cyan-300 text-lg font-bold mb-4 flex items-center">
              <i className="fas fa-gamepad mr-3"></i>Virtual Realms
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">VRChat Sessions</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Rhythm Games</span>
                <span className="text-cyan-400">Mastered</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-cyan-300 text-lg font-bold mb-4 flex items-center">
              <i className="fas fa-brain mr-3"></i>Thought Stream
            </h3>
            <div className="text-xs text-gray-300 leading-relaxed">
              "Every line of code is a meditation on possibility. 
              Classical wisdom guides the architecture while 
              revolutionary AI amplifies human potential."
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar - Prismatic Glass */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 prismatic-glass border-t border-cyan-400/40 z-20 gacha-shine">
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-center">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4">
            <button 
              onClick={scrollToProjects}
              className="px-4 md:px-6 py-2 md:py-3 prismatic-glass border border-cyan-400/50 rounded-lg text-cyan-100 font-medium hover:border-cyan-300/70 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 transform text-sm md:text-base gacha-shine prismatic-glow"
            >
              <i className="fas fa-rocket text-xs md:text-sm"></i>
              <span className="hidden sm:inline">View Projects</span>
              <span className="sm:hidden">Projects</span>
            </button>
            <button 
              onClick={scrollToPhilosophy}
              className="px-4 md:px-6 py-2 md:py-3 prismatic-glass border border-violet-400/50 rounded-lg text-violet-100 font-medium hover:border-violet-300/70 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 transform text-sm md:text-base gacha-shine"
            >
              <i className="fas fa-brain text-xs md:text-sm"></i>
              <span>Philosophy</span>
            </button>
            <button 
              onClick={scrollToContact}
              className="px-4 md:px-6 py-2 md:py-3 prismatic-glass border border-emerald-400/50 rounded-lg text-emerald-100 font-medium hover:border-emerald-300/70 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 transform text-sm md:text-base gacha-shine"
            >
              <i className="fas fa-satellite-dish text-xs md:text-sm"></i>
              <span>Connect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Central Character Panel - Responsive with proper spacing */}
      <div className="container mx-auto px-4 md:px-6 xl:px-80 text-center relative z-10 flex items-center justify-center min-h-screen pt-16 md:pt-20 pb-16 md:pb-20">
        <div className="max-w-2xl mx-auto w-full">
          {/* Character Portrait with HUD Frame */}
          <div className="relative mb-6 md:mb-8">
            <div className="absolute inset-0 border-2 md:border-4 border-cyan-400/50 rounded-full animate-pulse"></div>
            <div className="absolute -inset-2 md:-inset-4 border border-blue-400/30 rounded-full"></div>
            <div className="absolute -inset-4 md:-inset-8 border border-purple-400/20 rounded-full"></div>
            <img 
              src="/images/catboy_profile.png" 
              alt="reverb256 - Digital Architect" 
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover relative z-10 shadow-2xl shadow-cyan-400/50"
            />
            {/* Character Level Badge */}
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 md:border-4 border-blue-900 z-20">
              <span className="text-white font-bold text-xs md:text-sm">∞</span>
            </div>
          </div>
          
          {/* Character Title */}
          <div className="mb-4 md:mb-6 p-4 md:p-6 prismatic-glass rounded-xl md:rounded-2xl border border-cyan-400/40 spectrum-border gacha-shine">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-2 md:mb-4 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              Digital Architect
            </h1>
            <h2 className="text-lg md:text-xl lg:text-2xl mb-2 text-cyan-300 font-medium">
              VibeCoder & Cybernetic Systems Engineer
            </h2>
            <div className="text-xs md:text-sm text-gray-300">
              Level ∞ • Class: Philosopher-Technologist • Origin: Canada
            </div>
          </div>
          
          {/* Character Description */}
          <div className="mb-6 md:mb-8 p-4 md:p-6 prismatic-glass rounded-lg md:rounded-xl border border-cyan-400/30 prismatic-glow">
            <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed">
              Canadian architect of convergent technologies, orchestrating the cross-empowerment of classical wisdom 
              and revolutionary AI systems. My digital realm spans from philosophical exploration to technological 
              mastery—each line of code an expression of humanity's infinite potential through technological convergence.
            </p>
          </div>
          
          {/* Energy Visualization */}
          <div className="flex justify-center space-x-1 md:space-x-2 mb-6 md:mb-8">
            {rhythmBars.map((height, index) => (
              <div 
                key={index}
                className="w-2 md:w-3 rounded-full transition-all duration-300 shadow-lg"
                style={{ 
                  height: `${height + 15}px`,
                  background: `linear-gradient(to top, ${[
                    '#06b6d4', // cyan-500
                    '#3b82f6', // blue-500
                    '#8b5cf6', // violet-500
                    '#ec4899', // pink-500
                    '#f59e0b'  // amber-500
                  ][index]}, rgba(255,255,255,0.3))`,
                  boxShadow: `0 0 15px ${[
                    '#06b6d4', // cyan-500
                    '#3b82f6', // blue-500
                    '#8b5cf6', // violet-500
                    '#ec4899', // pink-500
                    '#f59e0b'  // amber-500
                  ][index]}40`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}