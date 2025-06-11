import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'quantum' | 'harmony' | 'memory' | 'elemental' | 'social';
}

export const ParticleSystem: React.FC = () => {
  const { currentTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!currentTheme.effects.particleSystem) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticle = (): Particle => {
      const types: Particle['type'][] = ['quantum', 'harmony', 'memory', 'elemental', 'social'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      let color = currentTheme.colors.primary;
      if (type === 'harmony') color = currentTheme.colors.secondary;
      if (type === 'memory') color = currentTheme.colors.accent;
      if (type === 'elemental') color = currentTheme.colors.primary;
      if (type === 'social') color = currentTheme.colors.glow;

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 0,
        maxLife: 3000 + Math.random() * 2000,
        size: Math.random() * 3 + 1,
        color: color,
        type: type
      };
    };

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push(createParticle());
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        particle.life += 16;
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Quantum resonance effect
        if (currentTheme.effects.quantumResonance && particle.type === 'quantum') {
          particle.vx += Math.sin(particle.life * 0.01) * 0.1;
          particle.vy += Math.cos(particle.life * 0.01) * 0.1;
        }

        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        const alpha = Math.max(0, (particle.maxLife - particle.life) / particle.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = particle.color;
        
        if (particle.type === 'quantum') {
          ctx.shadowBlur = 20;
          ctx.shadowColor = particle.color;
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Remove dead particles
        if (particle.life >= particle.maxLife) {
          particlesRef.current[index] = createParticle();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTheme]);

  if (!currentTheme.effects.particleSystem) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};