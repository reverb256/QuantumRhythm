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
      {/* Midjourney Cybernetic Background System */}
      <div className="absolute inset-0">
        {/* Base cosmic gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-purple-950/50 to-indigo-950/40" />
        
        {/* Primary blue cosmic ocean background */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url('/images/blue_cosmic_ocean.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Blue holographic sky overlay */}
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: `url('/images/blue_holographic_sky.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Blue cyber dome accent */}
        <div 
          className="absolute top-20 right-20 w-96 h-96 opacity-25 animate-pulse"
          style={{
            backgroundImage: `url('/images/blue_cyber_dome.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animationDuration: '6s'
          }}
        />
        
        {/* Blue energy waves accent */}
        <div 
          className="absolute bottom-32 left-16 w-64 h-64 opacity-20 animate-bounce"
          style={{
            backgroundImage: `url('/images/blue_energy_waves.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animationDuration: '4s'
          }}
        />
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-black/10 to-black/25" />
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

      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-900/80 via-blue-900/60 to-transparent backdrop-blur-md border-b border-cyan-400/30 z-20">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <i className="fas fa-user-astronaut text-white text-xl"></i>
            </div>
            <div>
              <div className="text-cyan-300 text-sm font-medium">Digital Architect</div>
              <div className="text-white text-lg font-bold">reverb256</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-cyan-300 text-sm">System Status</div>
              <div className="text-green-400 text-lg font-bold flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                ONLINE
              </div>
            </div>
            <div className="text-right">
              <div className="text-cyan-300 text-sm">Neural Link</div>
              <div className="text-cyan-400 text-lg font-bold">100%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side Panel - Hidden on mobile */}
      <div className="hidden lg:block absolute left-0 top-20 bottom-20 w-80 bg-gradient-to-r from-blue-900/80 via-blue-900/40 to-transparent backdrop-blur-md border-r border-cyan-400/20 z-20">
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

      {/* Right Side Panel - Hidden on mobile */}
      <div className="hidden lg:block absolute right-0 top-20 bottom-20 w-80 bg-gradient-to-l from-blue-900/80 via-blue-900/40 to-transparent backdrop-blur-md border-l border-cyan-400/20 z-20">
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

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-900/80 via-blue-900/60 to-transparent backdrop-blur-md border-t border-cyan-400/30 z-20">
        <div className="container mx-auto px-6 h-full flex items-center justify-center">
          <div className="flex space-x-4">
            <button 
              onClick={scrollToProjects}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform"
            >
              <i className="fas fa-rocket"></i>
              <span>View Projects</span>
            </button>
            <button 
              onClick={scrollToPhilosophy}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white font-medium hover:from-purple-400 hover:to-pink-500 transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform"
            >
              <i className="fas fa-brain"></i>
              <span>Philosophy</span>
            </button>
            <button 
              onClick={scrollToContact}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white font-medium hover:from-green-400 hover:to-teal-500 transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform"
            >
              <i className="fas fa-satellite-dish"></i>
              <span>Connect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Central Character Panel */}
      <div className="container mx-auto px-6 text-center relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* Character Portrait with HUD Frame */}
          <div className="relative mb-8">
            <div className="absolute inset-0 border-4 border-cyan-400/50 rounded-full animate-pulse"></div>
            <div className="absolute -inset-4 border-2 border-blue-400/30 rounded-full"></div>
            <div className="absolute -inset-8 border border-purple-400/20 rounded-full"></div>
            <img 
              src="/images/catboy_profile.png" 
              alt="reverb256 - Digital Architect" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover relative z-10 shadow-2xl shadow-cyan-400/50"
            />
            {/* Character Level Badge */}
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-blue-900 z-20">
              <span className="text-white font-bold text-sm">∞</span>
            </div>
          </div>
          
          {/* Character Title */}
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-900/80 to-purple-900/80 rounded-2xl backdrop-blur-md border border-cyan-400/30">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              Digital Architect
            </h1>
            <h2 className="text-xl md:text-2xl mb-2 text-cyan-300 font-medium">
              VibeCoder & Cybernetic Systems Engineer
            </h2>
            <div className="text-sm text-gray-300">
              Level ∞ • Class: Philosopher-Technologist • Origin: Canada
            </div>
          </div>
          
          {/* Character Description */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/60 to-purple-900/60 rounded-xl backdrop-blur-md border border-cyan-400/20">
            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Canadian architect of convergent technologies, orchestrating the cross-empowerment of classical wisdom 
              and revolutionary AI systems. My digital realm spans from philosophical exploration to technological 
              mastery—each line of code an expression of humanity's infinite potential through technological convergence.
            </p>
          </div>
          
          {/* Energy Visualization */}
          <div className="flex justify-center space-x-2 mb-8">
            {rhythmBars.map((height, index) => (
              <div 
                key={index}
                className="w-3 rounded-full transition-all duration-300 shadow-lg"
                style={{ 
                  height: `${height + 20}px`,
                  background: `linear-gradient(to top, ${[
                    '#06b6d4', // cyan-500
                    '#3b82f6', // blue-500
                    '#8b5cf6', // violet-500
                    '#ec4899', // pink-500
                    '#f59e0b'  // amber-500
                  ][index]}, rgba(255,255,255,0.3))`,
                  boxShadow: `0 0 20px ${[
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