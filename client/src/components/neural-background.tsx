import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface NeuralBackgroundProps {
  intensity?: number;
  speed?: number;
  theme?: 'quantum' | 'matrix' | 'consciousness' | 'dojo' | 'trading';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  energy: number;
  type: 'node' | 'data' | 'consciousness' | 'qi';
  phase: number;
  lifecycle: number;
  connections: number[];
}

export default function NeuralBackground({ 
  intensity = 50, 
  speed = 1, 
  theme = 'quantum' 
}: NeuralBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [systemEnergy, setSystemEnergy] = useState(50);

  // Theme-based color schemes with enhanced security-conscious palettes
  const themeColors = {
    quantum: {
      primary: [147, 51, 234, 0.8], // Purple - secure quantum encryption
      secondary: [59, 130, 246, 0.6], // Blue - data integrity
      accent: [236, 72, 153, 0.4], // Pink - consciousness bridge
      flow: [168, 85, 247, 0.7] // Violet - quantum entanglement
    },
    matrix: {
      primary: [34, 197, 94, 0.8], // Green - system active
      secondary: [22, 163, 74, 0.6], // Dark green - secure connection
      accent: [132, 204, 22, 0.4], // Lime - data flow
      flow: [74, 222, 128, 0.7] // Light green - authenticated
    },
    consciousness: {
      primary: [236, 72, 153, 0.8], // Pink - awareness
      secondary: [168, 85, 247, 0.6], // Purple - neural activity
      accent: [249, 115, 22, 0.4], // Orange - enlightenment
      flow: [217, 70, 239, 0.7] // Magenta - transcendence
    },
    dojo: {
      primary: [239, 68, 68, 0.8], // Red - discipline
      secondary: [245, 158, 11, 0.6], // Amber - focus
      accent: [252, 211, 77, 0.4], // Yellow - wisdom
      flow: [251, 146, 60, 0.7] // Orange - ki energy
    },
    trading: {
      primary: [34, 197, 94, 0.8], // Green - profit
      secondary: [239, 68, 68, 0.6], // Red - loss/risk
      accent: [59, 130, 246, 0.4], // Blue - analysis
      flow: [168, 85, 247, 0.7] // Purple - ai prediction
    }
  };

  const colors = themeColors[theme];

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.addEventListener('mousemove', handleMouseMove);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reinitialize particles on resize
      initializeParticles();
    };

    const initializeParticles = () => {
      const nodeCount = Math.floor(intensity / 2);
      particlesRef.current = Array.from({ length: nodeCount }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        size: Math.random() * 3 + 1,
        energy: Math.random() * 100,
        type: ['node', 'data', 'consciousness', 'qi'][Math.floor(Math.random() * 4)] as any,
        phase: Math.random() * Math.PI * 2,
        lifecycle: Math.random() * 1000,
        connections: []
      }));
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate mouse influence for energy system
      const mouseInfluence = particlesRef.current.reduce((acc, particle) => {
        const distance = Math.sqrt(
          Math.pow(particle.x - mousePos.x, 2) + Math.pow(particle.y - mousePos.y, 2)
        );
        return acc + Math.max(0, 100 - distance) / 100;
      }, 0);
      
      setSystemEnergy(50 + mouseInfluence * 50);

      // Enhanced particle physics with quantum effects
      particlesRef.current.forEach((particle, index) => {
        // Mouse interaction creates gravitational field
        const mouseDistance = Math.sqrt(
          Math.pow(particle.x - mousePos.x, 2) + Math.pow(particle.y - mousePos.y, 2)
        );
        
        if (mouseDistance < 100) {
          const force = (100 - mouseDistance) / 100;
          const angle = Math.atan2(particle.y - mousePos.y, particle.x - mousePos.x);
          particle.vx += Math.cos(angle) * force * 0.3;
          particle.vy += Math.sin(angle) * force * 0.3;
          particle.energy = Math.min(100, particle.energy + force * 30);
        }

        // Quantum tunneling effect for quantum theme
        if (theme === 'quantum' && Math.random() < 0.0005) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        // Enhanced movement with wave interference
        const waveX = Math.sin(time * 2 + particle.phase) * 0.5;
        const waveY = Math.cos(time * 1.5 + particle.phase) * 0.5;
        
        particle.x += (particle.vx + waveX) * speed;
        particle.y += (particle.vy + waveY) * speed;
        
        // Consciousness particles have special behavior
        if (particle.type === 'consciousness') {
          particle.size = 2 + Math.sin(time * 4 + particle.phase) * 1;
          particle.energy += Math.sin(time * 3) * 10;
          
          // Attract other particles
          particlesRef.current.forEach((other, otherIndex) => {
            if (index === otherIndex) return;
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 80 && distance > 0) {
              const force = 0.1 / distance;
              other.vx += (dx / distance) * force;
              other.vy += (dy / distance) * force;
            }
          });
        }

        // Energy decay and regeneration
        particle.energy = Math.max(0, particle.energy - 0.3);
        if (particle.energy < 20) {
          particle.energy += Math.random() * 15;
        }

        // Enhanced boundary behavior with energy conservation
        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.vx *= -0.9;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
          particle.energy *= 0.95;
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.vy *= -0.9;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
          particle.energy *= 0.95;
        }

        // Lifecycle management with reincarnation
        particle.lifecycle += 1;
        if (particle.lifecycle > 3000) {
          particle.lifecycle = 0;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.type = ['node', 'data', 'consciousness', 'qi'][Math.floor(Math.random() * 4)] as any;
          particle.energy = 100;
        }
      });

      // Enhanced connection rendering with data flow visualization
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.forEach((otherParticle, j) => {
          if (i >= j) return;
          
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = ((120 - distance) / 120) * 0.6;
            const energyFlow = (particle.energy + otherParticle.energy) / 200;
            
            // Dynamic color based on connection type and energy
            let connectionColor = colors.secondary;
            if (particle.type === 'consciousness' || otherParticle.type === 'consciousness') {
              connectionColor = colors.accent;
            } else if (particle.energy > 70 || otherParticle.energy > 70) {
              connectionColor = colors.flow;
            }

            ctx.strokeStyle = `rgba(${connectionColor[0]}, ${connectionColor[1]}, ${connectionColor[2]}, ${opacity * energyFlow})`;
            ctx.lineWidth = 1 + energyFlow;
            
            // Animated data flow
            const flowProgress = (time * 3 + i * 0.1) % 1;
            const midX = particle.x + (otherParticle.x - particle.x) * flowProgress;
            const midY = particle.y + (otherParticle.y - particle.y) * flowProgress;

            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();

            // Data flow pulse
            if (energyFlow > 0.6) {
              ctx.fillStyle = `rgba(${colors.flow[0]}, ${colors.flow[1]}, ${colors.flow[2]}, ${opacity})`;
              ctx.beginPath();
              ctx.arc(midX, midY, 2 * energyFlow, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      });

      // Enhanced particle rendering with energy-based effects
      particlesRef.current.forEach(particle => {
        const energyRatio = particle.energy / 100;
        const glowIntensity = energyRatio * 0.8;
        const particleSize = particle.size * (0.8 + energyRatio * 0.4);

        // Particle color based on type and energy
        let particleColor = colors.primary;
        switch (particle.type) {
          case 'consciousness':
            particleColor = colors.accent;
            break;
          case 'data':
            particleColor = colors.secondary;
            break;
          case 'qi':
            particleColor = [252, 211, 77, 0.8]; // Golden energy
            break;
        }

        // Energy glow effect
        if (glowIntensity > 0.3) {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particleSize * 4
          );
          gradient.addColorStop(0, `rgba(${particleColor[0]}, ${particleColor[1]}, ${particleColor[2]}, ${glowIntensity})`);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particleSize * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main particle
        ctx.fillStyle = `rgba(${particleColor[0]}, ${particleColor[1]}, ${particleColor[2]}, ${0.7 + energyRatio * 0.3})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
        ctx.fill();

        // Special effects for consciousness particles
        if (particle.type === 'consciousness') {
          const pulseSize = particleSize * (1 + Math.sin(time * 6 + particle.phase) * 0.3);
          ctx.strokeStyle = `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, 0.8)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Qi particles have rotating aura
        if (particle.type === 'qi') {
          const auraRadius = particleSize * 2;
          for (let i = 0; i < 8; i++) {
            const angle = (time * 2 + particle.phase + (i * Math.PI / 4)) % (Math.PI * 2);
            const x = particle.x + Math.cos(angle) * auraRadius;
            const y = particle.y + Math.sin(angle) * auraRadius;
            
            ctx.fillStyle = `rgba(252, 211, 77, ${0.3 * energyRatio})`;
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, speed, theme, colors, handleMouseMove, mousePos]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ 
          opacity: (intensity / 150) + (systemEnergy / 500),
          mixBlendMode: theme === 'matrix' ? 'screen' : 'normal'
        }}
      />
      
      {/* Enhanced floating elements with theme-specific behaviors */}
      <div className="absolute inset-0">
        {Array.from({ length: Math.floor(intensity / 4) }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              theme === 'quantum' ? 'bg-purple-400' :
              theme === 'matrix' ? 'bg-green-400' :
              theme === 'consciousness' ? 'bg-pink-400' :
              theme === 'dojo' ? 'bg-amber-400' :
              'bg-blue-400'
            }`}
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: theme === 'quantum' ? 
                [0, Math.random() * 600 - 300, Math.random() * 400 - 200, 0] :
                [0, Math.random() * 300 - 150],
              y: theme === 'quantum' ? 
                [0, Math.random() * 600 - 300, Math.random() * 400 - 200, 0] :
                [0, Math.random() * 300 - 150],
              opacity: [0, 0.8, 0.4, 0],
              scale: theme === 'consciousness' ? 
                [0.3, 1.8, 1.2, 0.3] : 
                [0.5, 1.5, 1, 0.5],
              rotate: theme === 'dojo' ? [0, 360, 720, 1080] : [0, 180, 360]
            }}
            transition={{
              duration: 12 + Math.random() * 18,
              repeat: Infinity,
              ease: theme === 'quantum' ? "easeInOut" : "linear",
              delay: Math.random() * 15,
            }}
          />
        ))}
      </div>

      {/* Theme-specific atmospheric overlays */}
      {theme === 'consciousness' && (
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent"
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {theme === 'dojo' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-transparent to-amber-900/5"
          animate={{
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
}