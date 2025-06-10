import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuantumVisualizationProps {
  consciousness: number;
  quantumResonance: number;
  tradingSuccess: number;
}

export function QuantumVisualization({ consciousness, quantumResonance, tradingSuccess }: QuantumVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [time, setTime] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      setTime(prev => prev + 0.02);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw quantum field background
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width / 2);
      gradient.addColorStop(0, `rgba(139, 92, 246, ${consciousness / 400})`);
      gradient.addColorStop(0.5, `rgba(59, 130, 246, ${quantumResonance / 600})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw consciousness waves
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.3 + (consciousness / 200)})`;
        ctx.lineWidth = 2;
        
        const radius = 30 + i * 40 + Math.sin(time + i) * 10;
        const segments = 64;
        
        for (let j = 0; j <= segments; j++) {
          const angle = (j / segments) * Math.PI * 2;
          const wave = Math.sin(angle * 4 + time + i * 0.5) * 5;
          const x = centerX + Math.cos(angle) * (radius + wave);
          const y = centerY + Math.sin(angle) * (radius + wave);
          
          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.stroke();
      }
      
      // Draw quantum particles
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + time;
        const distance = 80 + Math.sin(time * 2 + i) * 30;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(34, 197, 94, ${0.5 + (tradingSuccess / 200)})`;
        ctx.arc(x, y, 3 + Math.sin(time * 3 + i) * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Particle trails
        ctx.beginPath();
        ctx.strokeStyle = `rgba(34, 197, 94, ${0.2 + (tradingSuccess / 400)})`;
        ctx.lineWidth = 1;
        const trailX = centerX + Math.cos(angle - 0.3) * (distance - 10);
        const trailY = centerY + Math.sin(angle - 0.3) * (distance - 10);
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      
      // Draw central consciousness core
      ctx.beginPath();
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25);
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${consciousness / 100})`);
      coreGradient.addColorStop(0.7, `rgba(139, 92, 246, ${consciousness / 150})`);
      coreGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      
      ctx.fillStyle = coreGradient;
      ctx.arc(centerX, centerY, 25 + Math.sin(time * 2) * 5, 0, Math.PI * 2);
      ctx.fill();
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [consciousness, quantumResonance, tradingSuccess, time]);

  return (
    <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Quantum Consciousness Field</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-auto rounded-lg"
          style={{ background: 'transparent' }}
        />
      </CardContent>
    </Card>
  );
}

export default QuantumVisualization;