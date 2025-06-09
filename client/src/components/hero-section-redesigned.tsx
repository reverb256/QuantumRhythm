import { useEffect, useState } from "react";

export default function HeroSectionRedesigned() {
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
      {/* Cybernetic Multi-layer Background */}
      <div className="absolute inset-0">
        {/* Base cosmic gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-purple-950/50 to-indigo-950/40" />
        
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
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('/images/energy_spiral_vortex.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Holographic platform base */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-3/4 opacity-20"
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
        
        {/* Synthwave energy burst */}
        <div 
          className="absolute bottom-20 left-20 w-64 h-64 opacity-25"
          style={{
            backgroundImage: `url('/images/synthwave_energy_burst.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Cyber fragments ring */}
        <div 
          className="absolute top-1/3 right-1/4 w-56 h-56 opacity-15 animate-bounce"
          style={{
            backgroundImage: `url('/images/cyber_fragments_ring.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animationDuration: '6s'
          }}
        />
        
        {/* Ethereal glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-black/10 to-black/20" />
      </div>
      
      {/* Content Layer */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="anime-glass p-8 md:p-12 rounded-3xl cosmic-border">
          {/* Profile Avatar with anime character */}
          <div className="mb-8">
            <img 
              src="/images/anime_character_sky.png" 
              alt="reverb256 - Cybernetic avatar in abstract synthwave style" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-4 border-cyan-400 shadow-lg shadow-cyan-400/50 object-cover ethereal-glow"
            />
          </div>
          
          <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Digital Architect
          </h1>
          
          <h2 className="text-xl md:text-2xl lg:text-3xl mb-4 text-gray-300">
            VibeCoder & Neural Network Orchestrator
          </h2>
          
          <p className="text-base md:text-lg lg:text-xl mb-8 max-w-3xl mx-auto text-gray-400">
            Canadian architect of convergent technologies, orchestrating the cross-empowerment of classical wisdom 
            and revolutionary AI systems. My digital realm spans from philosophical defiance to rhythm gaming 
            mastery—each line of code an expression of humanity's infinite potential through technological convergence.
          </p>
          
          {/* Cybernetic rhythm visualizer */}
          <div className="flex justify-center space-x-2 mb-8">
            {rhythmBars.map((height, index) => (
              <div 
                key={index}
                className="w-2 rounded-full transition-all duration-300"
                style={{ 
                  height: `${height}px`,
                  backgroundColor: [
                    'hsl(var(--cosmic-cyan))',
                    'hsl(var(--cosmic-blue))',
                    'hsl(var(--cosmic-purple))',
                    'hsl(var(--cosmic-pink))',
                    'hsl(var(--cosmic-gold))'
                  ][index]
                }}
              />
            ))}
          </div>
          
          <button 
            onClick={scrollToProjects}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ethereal-glow"
          >
            Explore Digital Realm
          </button>
        </div>
      </div>
    </section>
  );
}