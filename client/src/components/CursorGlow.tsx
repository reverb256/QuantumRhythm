import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const CursorGlow: React.FC = () => {
  const { currentTheme } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!currentTheme.effects.cursorGlow) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentTheme.effects.cursorGlow]);

  if (!currentTheme.effects.cursorGlow) return null;

  return (
    <>
      {/* Primary cursor glow */}
      <div
        className="fixed pointer-events-none z-50 w-8 h-8 rounded-full mix-blend-screen"
        style={{
          left: mousePos.x - 16,
          top: mousePos.y - 16,
          background: `radial-gradient(circle, ${currentTheme.colors.primary}60 0%, ${currentTheme.colors.primary}20 50%, transparent 100%)`,
          filter: 'blur(8px)',
        }}
      />

      {/* Secondary outer glow */}
      <div
        className="fixed pointer-events-none z-40 w-20 h-20 rounded-full mix-blend-screen"
        style={{
          left: mousePos.x - 40,
          top: mousePos.y - 40,
          background: `radial-gradient(circle, ${currentTheme.colors.secondary}30 0%, ${currentTheme.colors.secondary}10 50%, transparent 100%)`,
          filter: 'blur(16px)',
        }}
      />

      {/* Reality distortion effect for quantum theme */}
      {currentTheme.effects.quantumResonance && (
        <div
          className="fixed pointer-events-none z-30 w-32 h-32 rounded-full"
          style={{
            left: mousePos.x - 64,
            top: mousePos.y - 64,
            background: `conic-gradient(from 0deg, ${currentTheme.colors.accent}20, transparent, ${currentTheme.colors.primary}20, transparent)`,
            filter: 'blur(24px)',
            animation: 'spin 8s linear infinite',
          }}
        />
      )}
    </>
  );
};