import { useEffect, useState } from "react";

export default function HeroSectionMidjourney() {
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
      {/* Midjourney Cybernetic Background System */}
      <div className="absolute inset-0">
        {/* Base cosmic gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-purple-950/50 to-indigo-950/40" />
        
        {/* Primary Midjourney cosmic ocean background */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url('/images/midjourney_cosmic_ocean.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Midjourney neon cosmos overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('/images/midjourney_neon_cosmos.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'screen'
          }}
        />
        
        {/* Midjourney expansive energy accent */}
        <div 
          className="absolute top-20 right-20 w-96 h-96 opacity-25 animate-pulse"
          style={{
            backgroundImage: `url('/images/midjourney_expansive_energy.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animationDuration: '6s'
          }}
        />
        
        {/* Midjourney abstract flow accent */}
        <div 
          className="absolute bottom-32 left-16 w-64 h-64 opacity-20 animate-bounce"
          style={{
            backgroundImage: `url('/images/midjourney_abstract_flow.png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animationDuration: '4s'
          }}
        />
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-black/10 to-black/25" />
      </div>
      
      {/* Content Layer */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="glass-morphism p-8 md:p-12 rounded-3xl cyber-border">
          {/* Catboy Profile Avatar */}
          <div className="mb-8">
            <img 
              src="/images/catboy_profile.png" 
              alt="reverb256 - Anime catboy profile picture" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-4 border-cyan-400 shadow-lg shadow-cyan-400/50 object-cover ethereal-glow"
            />
          </div>
          
          <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            Digital Architect
          </h1>
          
          <h2 className="text-xl md:text-2xl lg:text-3xl mb-4 text-gray-300">
            VibeCoder & Cybernetic Systems Engineer
          </h2>
          
          <p className="text-base md:text-lg lg:text-xl mb-8 max-w-3xl mx-auto text-gray-400">
            Canadian architect of convergent technologies, orchestrating the cross-empowerment of classical wisdom 
            and revolutionary AI systems. My digital realm spans from philosophical exploration to technological 
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
                    '#06b6d4', // cyan-500
                    '#3b82f6', // blue-500
                    '#8b5cf6', // violet-500
                    '#ec4899', // pink-500
                    '#f59e0b'  // amber-500
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