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
    <section className="relative min-h-screen flex items-center justify-center geometric-bg overflow-hidden">
      <GeometricBackground />
      
      {/* Cybernetic grid overlay */}
      <div className="absolute inset-0 opacity-20 cyber-grid"></div>
      
      {/* Floating geometric elements */}
      <div className="absolute top-20 right-20 hexagon w-16 h-16 bg-gradient-to-r from-[var(--synthwave-cyan)] to-[var(--bright-blue)] opacity-30 animate-float"></div>
      <div className="absolute bottom-32 left-16 diamond w-12 h-12 bg-gradient-to-r from-[var(--synthwave-pink)] to-[var(--synthwave-gold)] opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-[var(--primary-blue)] rounded-full opacity-50 animate-ping"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="glass-morphism p-8 md:p-12 rounded-3xl cyber-border animate-pulse-glow">
          {/* Profile Avatar */}
          <div className="mb-8">
            <img 
              src="/attached_assets/PFP_1749430516108.jpg" 
              alt="reverb256 - Cybernetic cat silhouette against cosmic triangle" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto border-4 border-[var(--synthwave-cyan)] shadow-lg shadow-[var(--synthwave-cyan)]/50 animate-float"
            />
          </div>
          <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl mb-6 text-gradient-cyan">
            Digital Architect
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl mb-4 text-gray-300">
            VibeCoder & Neural Network Orchestrator
          </h2>
          <p className="text-base md:text-lg lg:text-xl mb-8 max-w-3xl mx-auto text-gray-400">
            Forging the future where classical wisdom meets artificial intelligence. 
            Every line of code pulses with the rhythm of innovation and the heartbeat of human dignity.
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
