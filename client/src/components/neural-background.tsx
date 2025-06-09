import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface NeuralBackgroundProps {
  intensity?: number;
  speed?: number;
  theme?: 'quantum' | 'matrix' | 'consciousness' | 'dojo' | 'trading';
}

export default function NeuralBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-cyan-900/10" />
    </div>
  );
}

  // Theme-based color schemes with deep ocean blue palettes
  const themeColors = {
    quantum: {
      primary: [30, 64, 175, 0.8], // Deep blue - quantum depth
      secondary: [37, 99, 235, 0.6], // Medium blue - data integrity
      accent: [59, 130, 246, 0.4], // Light blue - consciousness bridge
      flow: [96, 165, 250, 0.7] // Sky blue - quantum entanglement
    },
    matrix: {
      primary: [30, 58, 138, 0.8], // Navy blue - system active
      secondary: [29, 78, 216, 0.6], // Royal blue - secure connection
      accent: [59, 130, 246, 0.4], // Blue - data flow
      flow: [147, 197, 253, 0.7] // Light blue - authenticated
    },
    consciousness: {
      primary: [15, 23, 42, 0.8], // Dark navy - deep awareness
      secondary: [30, 64, 175, 0.6], // Deep blue - neural activity
      accent: [37, 99, 235, 0.4], // Blue - enlightenment
      flow: [59, 130, 246, 0.7] // Light blue - transcendence
    },
    dojo: {
      primary: [30, 41, 59, 0.8], // Slate blue - discipline
      secondary: [51, 65, 85, 0.6], // Blue gray - focus
      accent: [71, 85, 105, 0.4], // Light slate - wisdom
      flow: [100, 116, 139, 0.7] // Slate gray blue - ki energy
    },
    trading: {
      primary: [12, 74, 110, 0.8], // Ocean blue - depth
      secondary: [14, 116, 144, 0.6], // Cyan blue - analysis
      accent: [22, 163, 74, 0.4], // Teal green - profit
      flow: [239, 68, 68, 0.7] // Red accent - risk alerts
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
      // Drastically reduced particle count for performance
      const nodeCount = Math.min(Math.floor(intensity * 0.3), 25);
      particlesRef.current = Array.from({ length: nodeCount }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed * 0.8,
        vy: (Math.random() - 0.5) * speed * 0.8,
        size: Math.random() * 1.5 + 0.5,
        energy: Math.random() * 60 + 40,
        type: ['node', 'data', 'consciousness', 'qi'][Math.floor(Math.random() * 4)] as any,
        phase: Math.random() * Math.PI * 2,
        lifecycle: Math.random() * 600 + 400,
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
        // Simplified mouse interaction
        const mouseDistance = Math.sqrt(
          Math.pow(particle.x - mousePos.x, 2) + Math.pow(particle.y - mousePos.y, 2)
        );
        
        if (mouseDistance < 80) {
          const force = (80 - mouseDistance) / 80;
          particle.energy = Math.min(100, particle.energy + force * 15);
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

      // Minimal connection rendering - only closest neighbor for performance
      particlesRef.current.forEach((particle, i) => {
        if (i % 2 === 0 && i < particlesRef.current.length - 1) { // Only every other particle
          const nextParticle = particlesRef.current[i + 1];
          const dx = particle.x - nextParticle.x;
          const dy = particle.y - nextParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const opacity = ((100 - distance) / 100) * 0.2;
            ctx.strokeStyle = `rgba(${colors.secondary[0]}, ${colors.secondary[1]}, ${colors.secondary[2]}, ${opacity})`;
            ctx.lineWidth = 0.5;
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(nextParticle.x, nextParticle.y);
            ctx.stroke();
          }
        }
      });

      // Abstract visionary cyber space with stark deep blues
      const visionaryGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      visionaryGradient.addColorStop(0, 'rgba(1, 3, 12, 0.95)');     // Void black-blue
      visionaryGradient.addColorStop(0.2, 'rgba(3, 7, 18, 0.92)');   // Deep abyssal
      visionaryGradient.addColorStop(0.5, 'rgba(8, 15, 32, 0.88)');  // Ocean depth
      visionaryGradient.addColorStop(0.8, 'rgba(15, 23, 42, 0.85)'); // Cyber space blue
      visionaryGradient.addColorStop(1, 'rgba(2, 6, 23, 0.9)');      // Deep void
      
      ctx.fillStyle = visionaryGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Abstract geometric data lattice - stark background structure
      for (let layer = 0; layer < 3; layer++) {
        const gridSize = 80 + layer * 40;
        const opacity = 0.03 + layer * 0.01;
        const offset = (time * 10 + layer * 30) % gridSize;
        
        ctx.strokeStyle = `rgba(30, 64, 175, ${opacity})`;
        ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = -offset; x < canvas.width + gridSize; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = -offset; y < canvas.height + gridSize; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
      
      // Subtle data streams - minimal visual presence for contrast
      for (let stream = 0; stream < 3; stream++) {
        const streamTime = time * (0.2 + stream * 0.05);
        const yPos = canvas.height * (0.2 + stream * 0.3);
        
        // Ultra-subtle horizontal data flow
        ctx.strokeStyle = `rgba(30, 64, 175, 0.08)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([20, 40]);
        ctx.lineDashOffset = -streamTime * 50;
        
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(canvas.width, yPos);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Sparse quantum dots - minimal interference with foreground
      for (let dot = 0; dot < 15; dot++) {
        const dotX = (dot * 137 + Math.sin(time * 0.3 + dot * 0.2) * 20) % (canvas.width + 40) - 20;
        const dotY = (dot * 89 + Math.cos(time * 0.2 + dot * 0.15) * 25) % (canvas.height + 40) - 20;
        const dotOpacity = 0.1 + Math.sin(time * 1.5 + dot * 0.3) * 0.05;
        
        // Minimal quantum glow
        ctx.fillStyle = `rgba(59, 130, 246, ${dotOpacity})`;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Enhanced particle rendering with energy-based effects
      particlesRef.current.forEach(particle => {
        const energyRatio = particle.energy / 100;
        const glowIntensity = energyRatio * 0.8;
        const particleSize = particle.size * (0.8 + energyRatio * 0.4);

        // Particle color based on type and energy - all using deep blues
        let particleColor = colors.primary;
        switch (particle.type) {
          case 'consciousness':
            particleColor = colors.accent;
            break;
          case 'data':
            particleColor = colors.secondary;
            break;
          case 'qi':
            particleColor = colors.flow; // Changed from golden to blue flow
            break;
        }

        // Energy glow effect with safe radius values
        if (glowIntensity > 0.3 && particleSize > 0) {
          const glowRadius = Math.max(particleSize * 4, 1); // Ensure minimum radius
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, glowRadius
          );
          gradient.addColorStop(0, `rgba(${particleColor[0]}, ${particleColor[1]}, ${particleColor[2]}, ${glowIntensity})`);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main particle
        ctx.fillStyle = `rgba(${particleColor[0]}, ${particleColor[1]}, ${particleColor[2]}, ${0.7 + energyRatio * 0.3})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
        ctx.fill();

        // Minimal special effects for key particle types
        if (particle.type === 'consciousness' && energyRatio > 0.7) {
          const pulseSize = particleSize * 1.5;
          ctx.strokeStyle = `rgba(${colors.accent[0]}, ${colors.accent[1]}, ${colors.accent[2]}, 0.3)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
          ctx.stroke();
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