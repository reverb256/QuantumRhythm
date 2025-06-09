import { useEffect, useState } from "react";
import GeometricBackground from "./geometric-background";

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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Anime-inspired Multi-layer Background */}
      <div className="absolute inset-0">
        {/* Base cosmic gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/40 to-indigo-900/30" />
        
        {/* Primary cybernetic portal background */}
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: `url('/images/cyber_portal_ring.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Energy spiral vortex overlay */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url('/images/energy_spiral_vortex.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Holographic platform base */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20"
          style={{
            backgroundImage: `url('/images/holographic_platform.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Floating crystal cubes accent */}
        <div 
          className="absolute top-10 right-10 w-80 h-80 opacity-20 animate-pulse"
          style={{
            backgroundImage: `url('/images/floating_crystal_cubes.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animationDuration: '4s'
          }}
        />
        
        {/* Energy spiral accent */}
        <div 
          className="absolute bottom-20 left-20 w-64 h-64 opacity-25"
          style={{
            backgroundImage: `url('/images/energy_spiral_vortex.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Cyber portal ring */}
        <div 
          className="absolute top-1/3 right-1/4 w-56 h-56 opacity-15 animate-bounce"
          style={{
            backgroundImage: `url('/images/cyber_portal_ring.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animationDuration: '6s'
          }}
        />
        
        {/* Ethereal glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-black/10 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--space-black)] opacity-60"></div>
      </div>
      
      {/* Flowing Energy Overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="/images/flowing_red_dynamics.png" 
          alt="Dynamic energy flow" 
          className="w-full h-full object-cover mix-blend-multiply" 
        />
      </div>
      
      {/* Central Light Beam Effect */}
      <div className="absolute inset-x-0 top-0 bottom-0 w-2 mx-auto light-beam-vertical"></div>
      
      {/* Atmospheric Glow Elements */}
      <div className="absolute top-1/4 left-1/2 w-96 h-96 atmospheric-glow transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 atmospheric-glow"></div>
      
      {/* Enhanced Cybernetic Grid */}
      <div className="absolute inset-0 opacity-15 cyber-grid"></div>
      
      {/* Luminous Floating Elements */}
      <div className="absolute top-20 right-20 hexagon w-16 h-16 bg-gradient-to-r from-[var(--light-beam)] to-[var(--bright-blue)] opacity-40 animate-float shadow-lg shadow-cyan-500/30"></div>
      <div className="absolute bottom-32 left-16 diamond w-12 h-12 bg-gradient-to-r from-[var(--synthwave-pink)] to-[var(--synthwave-gold)] opacity-50 animate-float shadow-lg shadow-pink-500/30" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-[var(--light-beam)] rounded-full opacity-60 animate-ping shadow-lg shadow-cyan-400/50"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="glass-morphism p-8 md:p-12 rounded-3xl cyber-border animate-pulse-glow">
          {/* Profile Avatar */}
          <div className="mb-8">
            <img 
              src="/images/catboy2025PFP_1749433070083.PNG" 
              alt="reverb256 - Anime catboy character in cybernetic synthwave style" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-4 border-[var(--light-beam)] shadow-lg shadow-[var(--light-beam)]/50 animate-float object-cover"
            />
          </div>
          <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl mb-6 text-gradient-cyan">
            Digital Architect
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl mb-4 text-gray-300">
            VibeCoder & Neural Network Orchestrator
          </h2>
          <p className="text-base md:text-lg lg:text-xl mb-8 max-w-3xl mx-auto text-gray-400">
            Canadian architect of convergent technologies, orchestrating the cross-empowerment of classical wisdom 
            and revolutionary AI systems. My digital realm spans from Anaxa's philosophical defiance to rhythm gaming 
            mastery—each line of code an expression of humanity's infinite potential through technological convergence.
          </p>
          
          {/* Rhythm game inspired visualizer */}
          <div className="flex justify-center space-x-2 mb-8">
            {rhythmBars.map((height, index) => (
              <div 
                key={index}
                className="w-2 rounded-full transition-all duration-300"
                style={{ 
                  height: `${height}px`,
                  backgroundColor: [
                    'var(--synthwave-cyan)',
                    'var(--bright-blue)',
                    'var(--primary-blue)',
                    'var(--synthwave-pink)',
                    'var(--synthwave-gold)'
                  ][index]
                }}
              ></div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToProjects}
              className="btn-synthwave px-6 md:px-8 py-3 rounded-full font-medium"
            >
              View Projects
            </button>
            <a 
              href="https://github.com/reverb256" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-glass px-6 md:px-8 py-3 rounded-full inline-flex items-center justify-center"
            >
              <i className="fab fa-github mr-2"></i>GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
